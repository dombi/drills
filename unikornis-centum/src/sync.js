/* ============ 12d) FELHŐ — szinkron: delta-küldés + 3-utas összefésülés ============
   A játék továbbra is a `mentes` objektumot módosítja és ment()-et hív. A ment() jelez ide;
   ~1 mp múlva összevetjük a profilt az utolsó ismert felhő-állapottal (FELHO.alap), és CSAK a
   megváltozott leveleket küldjük fel (set + merge):
     • számlálók (✨ 💧 játékidő): increment(különbség) — két gép pénze összeadódik, nem felülíródik
     • térképek (ruhák, jelvények, pályák…): levélszintű írás — a másik gép új kulcsai megmaradnak
     • minden más (kinézet, aktív ruha, tömbök): utolsó írás nyer
   Beérkező változásnál ugyanez visszafelé: a (felhő − alap) különbséget rávezetjük a helyi állapotra,
   így a még el nem küldött helyi módosítások sem vesznek el. */
function felhoMentJelez() {
  if (!FELHO.kesz) return;
  clearTimeout(FELHO.idozito);
  FELHO.idozito = setTimeout(felhoKuld, 1200);
}
function felhoKuld() {
  if (!FELHO.kesz || !FELHO.db) return;
  clearTimeout(FELHO.idozito); FELHO.idozito = null;
  var FV = firebase.firestore.FieldValue;
  Object.keys(mentes.profilok).forEach(function (k) {
    var uj = felhoTiszta(mentes.profilok[k]), valtozas = {};
    if (!felhoKulonbseg(FELHO.alap[k] || {}, uj, valtozas, true)) return;
    valtozas._updatedAt = FV.serverTimestamp();
    felhoLenyRef(k).set(valtozas, { merge: true }).catch(function (e) { console.warn("[felhő] mentés hiba:", k, e.code || e); });
    FELHO.alap[k] = uj;
  });
  var u = felhoUserAllapot();
  if (JSON.stringify(u) !== JSON.stringify(FELHO.alapUser)) {
    felhoUserRef().set({ settings: u.settings, activeUnicorn: u.activeUnicorn, lastSeen: FV.serverTimestamp() }, { merge: true }).catch(function () {});
    FELHO.alapUser = u;
  }
}
function felhoUserAllapot() { return { settings: { hang: !!mentes.hang, valaszmod: mentes.valaszmod || "beszed" }, activeUnicorn: mentes.leny }; }

/* a profil felhőbe menő alakja: JSON-tiszta (nincs undefined/NaN), a munkamenet-mezők (sorozat) és a _meta mezők nélkül */
function felhoTiszta(p) {
  var t = JSON.parse(JSON.stringify(p || {}));
  delete t.sorozat;
  Object.keys(t).forEach(function (k) { if (k.charAt(0) === "_") delete t[k]; });
  return t;
}
function felhoMasol(x) { return JSON.parse(JSON.stringify(x)); }
function felhoTerkep(x) { return x !== null && typeof x === "object" && !Array.isArray(x); }
/* kulcssorrend-független összevetés (a Firestore rendezve adja vissza a térkép-kulcsokat) */
function felhoKanon(x) {
  if (Array.isArray(x)) return "[" + x.map(felhoKanon).join(",") + "]";
  if (felhoTerkep(x)) return "{" + Object.keys(x).sort().map(function (k) { return JSON.stringify(k) + ":" + felhoKanon(x[k]); }).join(",") + "}";
  return x === undefined ? "u" : JSON.stringify(x);
}
function felhoEgyenlo(a, b) { return felhoKanon(a) === felhoKanon(b); }

/* alap → uj különbség beírása a `ki` objektumba (set+merge alakban). Visszaad: volt-e változás. */
function felhoKulonbseg(alap, uj, ki, felso) {
  var FV = firebase.firestore.FieldValue, volt = false, kulcsok = {}, k;
  for (k in alap) kulcsok[k] = 1;
  for (k in uj) kulcsok[k] = 1;
  for (k in kulcsok) {
    var a = alap[k], u = uj[k];
    if (felhoEgyenlo(a, u)) continue;
    volt = true;
    if (felhoTerkep(a) && felhoTerkep(u)) { ki[k] = {}; felhoKulonbseg(a, u, ki[k], false); }   /* kanonikusan eltér → a mélyben is lesz levél */
    else if (u === undefined) ki[k] = FV.delete();
    else if (felso && FELHO_SZAMLALOK[k] && typeof a === "number" && typeof u === "number") ki[k] = FV.increment(u - a);
    else ki[k] = u;
  }
  return volt;
}

/* 3-utas összefésülés: a (tavoli − alap) változást rávezeti a helyi objektumra. Visszaad: változott-e a helyi. */
function felhoOsszefesul(helyi, alap, tavoli, felso) {
  var volt = false, kulcsok = {}, k;
  for (k in alap) kulcsok[k] = 1;
  for (k in tavoli) kulcsok[k] = 1;
  for (k in kulcsok) {
    var a = alap[k], t = tavoli[k];
    if (felhoEgyenlo(a, t)) continue;            /* a felhőben ez nem változott → a helyi marad */
    if (felhoTerkep(a) && felhoTerkep(t) && felhoTerkep(helyi[k])) {
      if (felhoOsszefesul(helyi[k], a, t, false)) volt = true;
    } else if (felso && FELHO_SZAMLALOK[k] && typeof a === "number" && typeof t === "number" && typeof helyi[k] === "number") {
      helyi[k] += (t - a); volt = true;
    } else if (t === undefined) {
      if (k in helyi) { delete helyi[k]; volt = true; }
    } else if (!felhoEgyenlo(helyi[k], t)) {
      helyi[k] = felhoMasol(t); volt = true;
    }
  }
  return volt;
}

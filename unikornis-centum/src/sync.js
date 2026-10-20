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
  felhoKuldetlenJelol(FELHO.kesz ? FELHO.uid : felhoGazda());   /* 📴 a helyi mentés előrébb jár a felhőnél (a küldés törli; ha nincs net / az SDK nem jött le, megmarad) */
  if (!FELHO.kesz) return;
  clearTimeout(FELHO.idozito);
  FELHO.idozito = setTimeout(felhoKuld, 1200);
}
function felhoKuld() {
  if (!FELHO.kesz || !FELHO.db) return;
  clearTimeout(FELHO.idozito); FELHO.idozito = null;
  var FV = firebase.firestore.FieldValue, kuldott = false;
  if (FELHO.memoriaTar && FELHO.nyugtazott === FELHO.kuldSzam) felhoAlapRogzit(FELHO.alap);   /* minden korábbi írás megérkezett → ez a biztos alap */
  Object.keys(mentes.profilok).forEach(function (k) {
    var uj = felhoTiszta(mentes.profilok[k]), valtozas = {};
    if (!felhoKulonbseg(FELHO.alap[k] || {}, uj, valtozas, true)) return;
    valtozas._updatedAt = FV.serverTimestamp();
    felhoLenyRef(k).set(valtozas, { merge: true }).catch(function (e) { console.warn("[felhő] mentés hiba:", k, e.code || e); });
    FELHO.alap[k] = uj;
    kuldott = true;
  });
  var u = felhoUserAllapot();
  if (JSON.stringify(u) !== JSON.stringify(FELHO.alapUser)) {
    felhoUserRef().set({ settings: u.settings, activeUnicorn: u.activeUnicorn, lastSeen: FV.serverTimestamp() }, { merge: true }).catch(function () {});
    FELHO.alapUser = u;
  }
  if (!FELHO.memoriaTar) {   /* az írás a Firestore offline tárában van → onnan biztosan felmegy */
    if (kuldott) felhoAlapRogzit(FELHO.alap);
    else try { localStorage.removeItem(FELHO_KULDETLEN); } catch (e) {}   /* nincs eltérés: a helyi = az eltett alap */
    return;
  }
  if (!kuldott) return;
  /* offline tár nélkül az írás csak a memóriában vár: amíg a szerver nem nyugtázza, „küldetlen" marad */
  felhoKuldetlenJelol(FELHO.uid);
  var n = ++FELHO.kuldSzam, pillanat = felhoMasol(FELHO.alap), uid = FELHO.uid;
  FELHO.db.waitForPendingWrites().then(function () {
    if (n <= FELHO.nyugtazott || !FELHO.kesz || FELHO.uid !== uid) return;
    FELHO.nyugtazott = n;
    felhoAlapRogzit(pillanat, n !== FELHO.kuldSzam || !!FELHO.idozito);   /* újabb küldés úton / készül → a jelző marad */
  }).catch(function () {});
}

/* ── 📴 Offline 1. kör: „semmi nem vész el" ──
   uc_felho_alap_<uid> = az utolsó, a felhőbe biztosan eljutott állapot (offline tárral: amit a Firestore-nak
   átadtunk; offline tár nélkül: amit a szerver nyugtázott). A ment() beállítja az uc_kuldetlen jelzőt, a
   sikeres küldés törli → ha megmarad (nincs net, nem jött le az SDK, bezárták a lapot), következő indításkor a
   felhoElsoAllapot nem írja felül a helyi mentést, hanem a (helyi − eltett alap) különbséget rávezeti a
   felhő-állapotra (felhoOsszefesul) — ✨ 💧 játékidő összeadódik, a többi levélszinten / utolsó írás nyer.
   Kiskapu ellen: az összefésülés után az alap azonnal a felhő-állapot lesz, a küldés után a küldött állapot
   → egy újratöltés / net ki-be ugyanazt a különbséget nem vezeti rá kétszer. */
function felhoKuldetlenJelol(uid) {
  if (!FELHO.be || !uid) return;
  try { if (localStorage.getItem(FELHO_KULDETLEN) !== uid) localStorage.setItem(FELHO_KULDETLEN, uid); } catch (e) {}
}
function felhoKuldetlen() { try { return localStorage.getItem(FELHO_KULDETLEN); } catch (e) { return null; } }
function felhoAlapRogzit(alap, jelzoMarad) {
  if (!FELHO.uid) return;
  try { localStorage.setItem(FELHO_ALAP_ELOTAG + FELHO.uid, JSON.stringify(alap)); }
  catch (e) { felhoAlapTorol(FELHO.uid); return; }   /* tele a tár: inkább semmi alap, mint egy elavult (az kétszer adna) */
  if (!jelzoMarad) try { localStorage.removeItem(FELHO_KULDETLEN); } catch (e) {}
}
function felhoEltettAlap(uid) {
  try { var a = JSON.parse(localStorage.getItem(FELHO_ALAP_ELOTAG + uid) || "null"); return felhoTerkep(a) ? a : null; } catch (e) { return null; }
}
function felhoAlapTorol(uid) {
  try { if (uid) localStorage.removeItem(FELHO_ALAP_ELOTAG + uid); localStorage.removeItem(FELHO_KULDETLEN); } catch (e) {}
}
/* a helyi mentés másolata, ha nem lehetett összefésülni (helyreallitas.html-ből visszatölthető); egy indításkor egyszer, max. 3 */
var FELHO_OFFLINE_MASOLVA = false;
function felhoOfflineMasolat() {
  if (FELHO_OFFLINE_MASOLVA) return;
  FELHO_OFFLINE_MASOLVA = true;
  try {
    var r = localStorage.getItem(KULCS); if (!r) return;
    var regiek = [], i, k;
    for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); if (k && k.indexOf(FELHO_OFFLINE_MASOLAT) === 0) regiek.push(k); }
    regiek.sort();
    while (regiek.length >= 3) localStorage.removeItem(regiek.shift());
    localStorage.setItem(FELHO_OFFLINE_MASOLAT + new Date().toISOString().slice(0, 23).replace(/[:.]/g, "-"), r);
  } catch (e) {}
}
/* a net nélküli játék rávezetése egy profilra: felho = a felhő-állapot másolata (ezt módosítja), eltett = az alap,
   helyi = a helyi profil. Visszaad: a rávezetett játékidő (mp), vagy -1, ha a helyi mentés gyanús (régebbi az alapnál). */
function felhoOfflineRavezet(felho, eltett, helyi) {
  var h = felhoTiszta(helyi), dMp = (h.jatekMp || 0) - (eltett.jatekMp || 0);
  if (dMp < 0) return -1;   /* a játékidő sosem csökken → ez nem az alapból továbbjátszott mentés (pl. sérült / üres) — nem vezetjük rá */
  felhoOsszefesul(felho, eltett, h, true);
  return dMp;
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

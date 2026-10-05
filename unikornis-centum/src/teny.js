/* ============ 3b) 🌸 TÉNY-MOTOR (terv/teny-motor-rendszerterv.html) ============
   A játék eddig pályákat jegyzett; ez a modul minden egyes TÉNYT is (7 + 5, 13 − 7, 6 × 7, 42 ÷ 6):
   tudja-e a gyerek, és fejből, gyorsan tudja-e. MINDEN tény-ügy egyedül ezen megy át (a pult, a
   Neked szóló ösvény, a becsempészés, a Tény-kert és a későbbi Villámkör is ezt használja).

   2. kör (2026-10-05): a pult 🌸 Tények füle ugyanezt a fájlt tölti be (tenyCsaladok, tenyLepcso, tenyTabla,
     tenyKertAllapot(tar), tenyOsszevon) — a beállításokat (TENY_ALAP ← FELULIR.teny) lásd lent.
   1. kör (2026-10-05): a motor LÁTHATATLANUL fut. A gyereknek semmi nem változik, csak gyűlik az adat.
     • Rejtett időmérés: tenyOraElo(f) a feladat megjelenésekor, tenyOraIndit(f) a felolvasás végén,
       tenyOraAll() az első leütött számjegynél / a beszéd kezdeténél (onspeechstart). A felolvasás
       vége előtti bevitel 0 mp (= villám). Beszédnél, ha nincs onspeechstart: felismerés − 1 mp.
     • Könyvelés: a naplozz() hívja a tenyJegyez-t; feladatonként CSAK AZ ELSŐ próba számít.

   Tény-kör: két 10×10-es tábla (55 család × 3 tény = 155 tény mindkettőben, a 0-s tények nélkül):
     o{a}_{b}  összeadás  (a ≤ b, a 7 + 5 és az 5 + 7 ugyanaz: o5_7)   k{c}_{b}  kivonás   (12 − 5: k12_5)
     s{a}_{b}  szorzás    (a ≤ b: s6_7)                                 d{c}_{b}  osztás    (42 ÷ 6: d42_6)
   A 100-as kör típusonként (P().tenyTipus): t10 kerek tízesek · e1 / e1a kétjegyű ± egyjegyű átlépés
   nélkül / átlépéssel · tz kétjegyű ± kerek tízes · k2 / k2a kétjegyű ± kétjegyű. A rokon tény (67 + 5 → 5 + 7)
   csak számolt, nincs elmentve.

   Egy tény sora (P().tenyek[kulcs], a P().tenyTipus is ugyanilyen):
     { d: doboz 0–5, e: esedékes nap, n: próbák, h: utolsó 6 eredmény, m: utolsó idő (tized mp),
       fl: forma-jelek („e” = mennyi az eredmény; később „h” = mi bújt el), ln: utolsó feljebb lépés napja }
   Eredmény-betűk: V villám · J jó, de lassú · S jó, de 20 mp fölött (szünet) · H botlás.
   Nap = helyi naptári nap sorszáma (tenyNap), így az „esedékes” éjfélkor fordul. */

var TENY_TIPUSOK = { osszeadas: 1, kivonas: 1, tizesek: 1, szorzas: 1, osztas: 1 };   /* ezek a naplo-típusok számítanak */
var TENY_KOZ = [0, 0, 1, 2, 5, 14];          /* doboz → hány nap múlva esedékes (0: új, nincs) */
var TENY_SZUNET_MS = 20000;                  /* 20 mp fölött „szünet”: nem lassú, csak nem villám */
var TENY_ALAP = { hatar: 3, hatarTipus: 5, ujKor: 4, becsempesz: true, osveny: true, tablak: null };

/* ── a pult beállításai (2. kör, 2026-10-05) ────────────────────────────────
   producerConfig/{uid}.teny és groups/{gid}.teny = { hatar?, hatarTipus?, ujKor?, becsempesz?, osveny?, tablak? }
     hatar       villám-határ (mp) a 20-as körben és a szorzótáblában, 2–8 (alap 3)
     hatarTipus  villám-határ (mp) a 100-as kör típusainál, 2–8 (alap 5)
     ujKor       legfeljebb ennyi új tény egy Neked szóló körben, 0–8 (alap 4)
     becsempesz  false = a meglévő pályák nem kérnek esedékes tényt (alap: igen)
     osveny      false = a Neked szóló ösvény nem látszik (alap: látszik)
     tablak      a bekapcsolt táblák (TENY_TABLAK kulcsai); nincs = automatikus: amivel a gyerek már találkozott
   Sorrend: alap < csoport(ok) < egyéni. Több csoportnál az ENGEDÉKENYEBB nyer: a nagyobb villám-határ, a kevesebb
   új tény/kör, a táblák metszete; a becsempészés és az ösvény ki, ha bármelyik csoport kikapcsolja.
   A pult (admin/index.html) ugyanezt a fájlt tölti be, így a két oldal szabálya nem válhat el. */
var TENY_TABLAK = [
  ["ok10", "+ − 10-en belül"], ["ok20", "+ − a 20-as körben (átlépéssel)"],
  ["s", "× szorzótábla"], ["d", "÷ bennfoglalás"], ["kor100", "+ − a 100-as körben"]
];
function tenyOsszevon(egyeni, csoportok) {
  var ki = {};
  function szam(v, min, max) { v = +v; return (v >= min && v <= max && v % 1 === 0) ? v : null; }
  function tablaLista(l) { return Array.isArray(l) ? l.filter(function (x) { return TENY_TABLAK.some(function (t) { return t[0] === x; }); }) : null; }
  (csoportok || []).forEach(function (c) {
    if (!c) return;
    var h = szam(c.hatar, 2, 8), ht = szam(c.hatarTipus, 2, 8), u = szam(c.ujKor, 0, 8), t = tablaLista(c.tablak);
    if (h != null) ki.hatar = Math.max(ki.hatar || 0, h);
    if (ht != null) ki.hatarTipus = Math.max(ki.hatarTipus || 0, ht);
    if (u != null) ki.ujKor = ki.ujKor == null ? u : Math.min(ki.ujKor, u);
    if (c.becsempesz === false) ki.becsempesz = false;
    if (c.osveny === false) ki.osveny = false;
    if (t) ki.tablak = ki.tablak ? ki.tablak.filter(function (x) { return t.indexOf(x) >= 0; }) : t;
  });
  var e = egyeni || {}, v;
  if ((v = szam(e.hatar, 2, 8)) != null) ki.hatar = v;
  if ((v = szam(e.hatarTipus, 2, 8)) != null) ki.hatarTipus = v;
  if ((v = szam(e.ujKor, 0, 8)) != null) ki.ujKor = v;
  if (typeof e.becsempesz === "boolean") ki.becsempesz = e.becsempesz;
  if (typeof e.osveny === "boolean") ki.osveny = e.osveny;
  if ((v = tablaLista(e.tablak))) ki.tablak = v;
  return ki;
}
/* az érvényes beállítás a játékban (alap + a pult összevont felülírása: FELULIR.teny) */
function tenyBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.teny) || {};
  var b = {}, k;
  for (k in TENY_ALAP) b[k] = TENY_ALAP[k];
  for (k in f) if (f[k] != null) b[k] = f[k];
  return b;
}
/* melyik táblához tartozik egy tény (a pult színezéséhez és a 3. kör választójához) */
function tenyTabla(k) {
  var m = /^([okds])(\d+)_(\d+)$/.exec(k || "");
  if (!m) return TENY_TIPUS_KULCS[k] ? "kor100" : null;
  var a = +m[2], b = +m[3];
  if (m[1] === "s") return "s";
  if (m[1] === "d") return "d";
  return (m[1] === "o" ? a + b : a) > 10 ? "ok20" : "ok10";
}
function tenyNap(t) { var d = new Date(t || Date.now()); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }

/* ── a feladatból kulcs ──────────────────────────────────────────────────────
   Bemenet: a feladat naplo-mezője ({ tipus, kerdes: "7 + 5" | "12 − 5" | "6×7" | "42÷6" }).
   Kimenet: null (nem tény-feladat) vagy { kulcs, tipus: false, agy: "ok"|"sd" } (tény) vagy
   { kulcs: "e1a", tipus: true, rokon: "o5_7"|null } (100-as kör típusa). */
function tenyTenyKulcs(op, a, b) {
  if (op === "+") { if (a < 1 || b < 1 || a > 10 || b > 10) return null; return "o" + Math.min(a, b) + "_" + Math.max(a, b); }
  if (op === "-") { var c = a - b; if (b < 1 || c < 1 || b > 10 || c > 10) return null; return "k" + a + "_" + b; }
  if (op === "×") { if (a < 1 || b < 1 || a > 10 || b > 10) return null; return "s" + Math.min(a, b) + "_" + Math.max(a, b); }
  if (op === "÷") { if (b < 1 || b > 10 || a % b !== 0) return null; var q = a / b; if (q < 1 || q > 10) return null; return "d" + a + "_" + b; }
  return null;
}
function tenyKulcs(naplo) {
  if (!naplo || !TENY_TIPUSOK[naplo.tipus]) return null;
  var m = /^\s*(\d+)\s*([+−×÷-])\s*(\d+)\s*$/.exec(String(naplo.kerdes || ""));
  if (!m) return null;
  var a = +m[1], op = m[2] === "−" ? "-" : m[2], b = +m[3];
  var t = tenyTenyKulcs(op, a, b);
  if (t) return { kulcs: t, tipus: false, agy: (op === "+" || op === "-") ? "ok" : "sd" };
  if (op !== "+" && op !== "-") return null;  /* a szorzótábla 10×10-en túl nincs mérve */
  if (op === "+" && a < b) { var cs = a; a = b; b = cs; }   /* 4 + 53 ugyanaz a típus, mint 53 + 4 */
  if (b < 1 || a < 10 || a > 100 || (op === "+" && a + b > 100) || (op === "-" && b > a)) return null;   /* 0-s és egyjegyű feladat nem típus */
  var kt, rokon = null;
  if (a % 10 === 0 && b % 10 === 0) { kt = "t10"; rokon = tenyTenyKulcs(op, a / 10, b / 10); }
  else if (b < 10) { kt = atlepesE(a, b, op) ? "e1a" : "e1";
    rokon = tenyTenyKulcs(op, op === "+" ? a % 10 : (atlepesE(a, b, op) ? 10 + a % 10 : a % 10), b); }
  else if (b % 10 === 0) { kt = "tz"; rokon = tenyTenyKulcs(op, Math.floor(a / 10), b / 10); }
  else kt = atlepesE(a, b, op) ? "k2a" : "k2";
  return { kulcs: kt, tipus: true, rokon: rokon };
}

/* ── egy tény sora + lépcső ─────────────────────────────────────────────── */
function tenyTar(tipus) { var p = P(); if (tipus) return p.tenyTipus || (p.tenyTipus = {}); return p.tenyek || (p.tenyek = {}); }
function tenySor(kulcs, tipus) { return tenyTar(tipus)[kulcs] || null; }
/* új → tanulja → tudja → villám (a doboz 0 / 1–2 / 3 / 4–5) */
function tenyLepcso(k) {
  var s = (k && typeof k === "object") ? k : typeof k === "string" ? tenySor(k, TENY_TIPUS_KULCS[k] === 1) : null;   /* nincs sor = új */
  var d = s ? s.d : 0;
  return d >= 4 ? "villam" : d === 3 ? "tudja" : d >= 1 ? "tanulja" : "uj";
}
var TENY_TIPUS_KULCS = { t10: 1, e1: 1, e1a: 1, tz: 1, k2: 1, k2a: 1 };

/* a doboz-szabály (rendszerterv „Hogyan lép a tény”):
   V → +1 (a 3-asból feljebb csak másik napon, mint az előző feljebb lépés) · J → +1, de legfeljebb 3-ig
   · H → −2, de legalább 1 (villám virág sosem lesz újra mag) · S → csak a 0-ból lesz 1. */
function tenyLep(s, betu, ma) {
  var d = s.d || 0, uj = d;
  if (betu === "V") { uj = Math.min(5, d + 1); if (d >= 3 && s.ln === ma) uj = d; }
  else if (betu === "J") { if (d < 3) uj = d + 1; }
  else if (betu === "H") uj = Math.max(1, d - 2);
  else if (betu === "S") { if (d === 0) uj = 1; }
  if (uj > d) s.ln = ma;
  s.d = uj;
  s.e = ma + TENY_KOZ[uj];
}

/* ── könyvelés (a naplozz hívja, minden válasznál) ───────────────────────────
   eredmeny: true = elsőre jó, false = botlás. ms: a rejtett óra (null = nincs mérés).
   Feladatonként csak az első hívás számít (a tipp utáni jó válasz „segítséggel”: nem változtat). */
function tenyJegyez(naplo, elsore, ms) {
  if (!naplo || naplo._teny) return null;
  naplo._teny = 1;
  var tk = tenyKulcs(naplo);
  if (!tk) return null;
  var B = tenyBeall(), ma = tenyNap();
  var tar = tenyTar(tk.tipus), s = tar[tk.kulcs] || (tar[tk.kulcs] = { d: 0, e: 0, n: 0, h: "", m: 0, fl: "", ln: 0 });
  var hatarMs = (tk.tipus ? B.hatarTipus : B.hatar) * 1000, betu;
  if (!elsore) betu = "H";
  else if (ms == null || ms > TENY_SZUNET_MS) betu = "S";
  else betu = ms <= hatarMs ? "V" : "J";
  if (elsore && ms != null) s.m = Math.round(ms / 100);
  s.n = (s.n || 0) + 1;
  s.h = ((s.h || "") + betu).slice(-6);
  var forma = naplo.forma || "e";
  if ((s.fl || "").indexOf(forma) < 0) s.fl = (s.fl || "") + forma;
  tenyLep(s, betu, ma);
  return { kulcs: tk.kulcs, tipus: tk.tipus, betu: betu, d: s.d };
}

/* ── a rejtett óra ───────────────────────────────────────────────────────────
   Egy feladathoz egy óra (TO). Az óra a felolvasás végén indul (tenyOraIndit), és az első bevitelnél
   áll meg (tenyOraAll). A naplozz a tenyOraMs(naplo)-val kérdezi le. Csak tény-feladatnál ketyeg. */
var TO = { naplo: null, indult: 0, allt: 0, korai: false };
function tenyOraElo(f) {
  var n = f && f.naplo;
  if (TO.naplo === n) return;                 /* ugyanaz a feladat újra megjelenik → az óra nem indul újra */
  TO.naplo = (n && tenyKulcs(n)) ? n : null; TO.indult = 0; TO.allt = 0; TO.korai = false;
}
function tenyOraIndit(f) {
  if (!TO.naplo || !f || f.naplo !== TO.naplo || TO.indult || TO.allt) return;
  TO.indult = Date.now();
}
/* levonas: beszédnél, ha a böngésző nem adott onspeechstart-ot, a felismerés kb. 1 mp-ét levonjuk */
function tenyOraAll(levonas) {
  if (!TO.naplo || TO.allt) return;
  TO.allt = Date.now() - (levonas || 0);
  if (!TO.indult) TO.korai = true;            /* még a felolvasás alatt kezdett válaszolni → fejből tudta */
}
function tenyOraMs(naplo) {
  if (!TO.naplo || TO.naplo !== naplo) return null;
  if (TO.korai) return 0;
  if (!TO.indult) return 0;                   /* a felolvasás vége előtt jött a válasz (pl. némítva, gyors beírás) */
  var veg = TO.allt || Date.now();
  return Math.max(0, veg - TO.indult);
}

/* ── lekérdezések: esedékes tények, választó, kert-összegzés ─────────────── */
/* a két tábla összes ténye: családonként (a ≤ b) 3 tény, duplánál 2 */
function tenyCsaladok(agy) {
  var ki = [];
  for (var a = 1; a <= 10; a++) for (var b = a; b <= 10; b++) {
    var c = agy === "sd" ? a * b : a + b, cs = agy === "sd"
      ? ["s" + a + "_" + b, "d" + c + "_" + a, "d" + c + "_" + b]
      : ["o" + a + "_" + b, "k" + c + "_" + a, "k" + c + "_" + b];
    if (a === b) cs.pop();
    ki.push({ a: a, b: b, c: c, tenyek: cs });
  }
  return ki;
}
function tenyMind(agy) { var ki = []; tenyCsaladok(agy).forEach(function (cs) { ki = ki.concat(cs.tenyek); }); return ki; }
function tenyAgyE(k) { var c = k.charAt(0); return (c === "o" || c === "k") ? "ok" : (c === "s" || c === "d") ? "sd" : null; }
/* esedékes (és már látott) tények, a „tanulja” elöl, azon belül a legrégebben esedékes elöl */
function tenyEsedekes(halmaz, tar) {
  tar = tar || tenyTar(false);
  var ma = tenyNap(), ki = [];
  (halmaz || Object.keys(tar)).forEach(function (k) { var s = tar[k]; if (s && s.d >= 1 && s.e <= ma) ki.push(k); });
  ki.sort(function (x, y) {
    var sx = tar[x], sy = tar[y], lx = sx.d <= 2 ? 0 : 1, ly = sy.d <= 2 ? 0 : 1;
    return lx - ly || sx.e - sy.e || sx.d - sy.d;
  });
  return ki;
}
/* A KÖZÖS VÁLASZTÓ: a halmazból (tény-kulcsok) db darab, a rendszerterv keveréke szerint:
   kb. fele esedékes, kb. 3/10 ismétlés a „tudja/villám” tényekből, legfeljebb ujKor új; ami hiányzik,
   azt a többi csoport tölti ki. A Neked szóló ösvény (3. kör) és a becsempészés is ezt hívja. */
function tenyValaszt(halmaz, db, opc) {
  opc = opc || {};
  var tar = tenyTar(false), B = tenyBeall(), ma = tenyNap();
  var maxUj = opc.ujMax != null ? opc.ujMax : B.ujKor;
  var esed = tenyEsedekes(halmaz), ism = [], uj = [];
  halmaz.forEach(function (k) {
    var s = tar[k];
    if (!s || !s.d) uj.push(k);
    else if (s.e > ma && s.d >= 3) ism.push(k);
  });
  function kever(t) { for (var i = t.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
  kever(ism); kever(uj);
  var ki = [], kell = { esed: Math.round(db * 0.5), ism: Math.round(db * 0.3) };
  kell.uj = Math.min(maxUj, db - kell.esed - kell.ism);
  ki = ki.concat(esed.slice(0, kell.esed), ism.slice(0, kell.ism), uj.slice(0, kell.uj));
  var tartalek = esed.slice(kell.esed).concat(ism.slice(kell.ism));   /* hiány esetén: előbb a többi esedékes/ismétlés, … */
  while (ki.length < db && tartalek.length) ki.push(tartalek.shift());
  var ujMaradek = uj.slice(kell.uj);                                    /* … végül új (a korláton túl csak, ha nincs más) */
  while (ki.length < db && ujMaradek.length) ki.push(ujMaradek.shift());
  return ki;
}
/* A Tény-kert, a pult és a későbbi visszahívás (Tamagocsi) kérdezhető összegzése (a pult a tar-t adja át):
   ágyásonként hány virág (család) és hány tény van az egyes lépcsőkön, hány esedékes. */
function tenyKertAllapot(tar) {
  tar = tar || tenyTar(false);
  var ma = tenyNap(), ki = { ok: null, sd: null, csillogoSor: null };
  ["ok", "sd"].forEach(function (agy) {
    var o = { tenyek: { uj: 0, tanulja: 0, tudja: 0, villam: 0 }, viragok: { nyilik: 0, bimbo: 0, hajtas: 0, mag: 0 }, esedekes: 0, osszes: 0 };
    tenyCsaladok(agy).forEach(function (cs) {
      var legkisebb = 9;
      cs.tenyek.forEach(function (k) {
        var s = tar[k], d = s ? s.d : 0;
        o.tenyek[tenyLepcso(s)]++; o.osszes++;
        if (s && d >= 1 && s.e <= ma) o.esedekes++;
        if (d < legkisebb) legkisebb = d;
      });
      /* a virág a család leggyengébb tényénél tart (a szirompárok külön nyílnak, ez a kert dolga lesz) */
      o.viragok[legkisebb >= 4 ? "nyilik" : legkisebb === 3 ? "bimbo" : legkisebb >= 1 ? "hajtas" : "mag"]++;
    });
    ki[agy] = o;
  });
  return ki;
}

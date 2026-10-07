/* ============ 3b) 🌸 TÉNY-MOTOR (terv/teny-motor-rendszerterv.html) ============
   A játék eddig pályákat jegyzett; ez a modul minden egyes TÉNYT is (7 + 5, 13 − 7, 6 × 7, 42 ÷ 6):
   tudja-e a gyerek, és fejből, gyorsan tudja-e. MINDEN tény-ügy egyedül ezen megy át (a pult, a
   Neked szóló ösvény, a becsempészés, a Tény-kert és a későbbi Villámkör is ezt használja).

   ⚡ Villámkör 2. kör (2026-10-07): forma "v" (a sprint feladatai, src/villam.js) — külön rövid előzmény (vh), és SZELÍD
     botlás: a sprintben a kapkodás is hibát okoz, ezért a doboz nem csúszik le, a tény csak esedékes lesz (a Neked szóló
     ösvény nyugodtan, felolvasással visszahozza; ha ott is botlik, az már rendes botlás). A V/J ugyanúgy léptet.
   Tamagocsi-kert 3. kör (2026-10-05): a virágok rejtett könyvelése (tenyKertHajt, tenyKertNyit; lent) + src/gondozas.js.
   Mi bújt el? 5. kör (2026-10-07): a Neked szóló ösvényen kb. minden ötödik feladat „mi bújt el” formában, ha a gyerek
     abban a családban már végigjárt egy bújócska-pályát (hiNekedJelol / hiNekedForma, src/bujocska.js).
   3. kör (2026-10-05): a 🌸 Neked szóló ösvény (tenyPalya, GEN.teny: a motor rakja össze, minden indításkor frissen,
     vegyes műveletekkel) + a becsempészés (tenyCsempesz: a meglévő pályák állomásonként legfeljebb 1 esedékes tényt
     kérnek, a saját keretükön belül). A beállítások (ujKor, tablak, becsempesz, osveny) innentől hatnak.
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
   nélkül / átlépéssel · tz kétjegyű ± kerek tízes · k2 / k2a kétjegyű ± kétjegyű · sb százas barátok
   (37 + 63, 100 − 36; „Mi bújt el?” 2. kör, 2026-10-07). A rokon tény (67 + 5 → 5 + 7; 37 + 63 → 7 + 3)
   csak számolt, nincs elmentve.

   Egy tény sora (P().tenyek[kulcs], a P().tenyTipus is ugyanilyen):
     { d: doboz 0–5, e: esedékes nap, n: próbák, h: utolsó 6 eredmény, m: utolsó idő (tized mp),
       fl: forma-jelek („e” = mennyi az eredmény, „h” = mi bújt el, „v” = Villámkör), ln: utolsó feljebb lépés napja,
       hh: a „mi bújt el” forma utolsó 6 eredménye (csak ha volt ilyen; a h-ba és a dobozba is beleszámít),
       vh: a Villámkör utolsó 6 eredménye (csak ha volt ilyen; a h-ba is beleszámít, a botlása szelíd) }
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
  /* százas barátok: két nem kerek szám, együtt pont száz (37 + 63, 100 − 36); rokon: az egyesek tízes barátja (7 + 3) */
  if ((op === "+" && a + b === 100 && b % 10 !== 0 && b > 10) || (op === "-" && a === 100 && b % 10 !== 0 && b > 10 && b < 90))
    return { kulcs: "sb", tipus: true, rokon: tenyTenyKulcs("+", b % 10, 10 - b % 10) };
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
var TENY_TIPUS_KULCS = { t10: 1, e1: 1, e1a: 1, tz: 1, k2: 1, k2a: 1, sb: 1 };

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
  if (forma === "h") s.hh = ((s.hh || "") + betu).slice(-6);   /* 🌿 „mi bújt el”: külön előzmény (a pult 🌿 jele ebből) */
  if (forma === "v") s.vh = ((s.vh || "") + betu).slice(-6);   /* ⚡ Villámkör: külön előzmény (a pult látja, ha csak sprintben csúszik el) */
  if (forma === "v" && betu === "H") s.e = ma;                  /* ⚡ szelíd botlás: a doboz marad, csak esedékes lesz */
  else tenyLep(s, betu, ma);
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
/* egy tény VAGY egy 100-as típus sora (a halmazban vegyesen lehetnek); a pult a saját tar-ját adja át */
function tenySorBarmi(k, tar) { return tar ? tar[k] : TENY_TIPUS_KULCS[k] ? tenyTar(true)[k] : tenyTar(false)[k]; }
function tenyEsedekes(halmaz, tar) {
  var ma = tenyNap(), ki = [];
  (halmaz || Object.keys(tar || tenyTar(false))).forEach(function (k) { var s = tenySorBarmi(k, tar); if (s && s.d >= 1 && s.e <= ma) ki.push(k); });
  tenyKever(ki);   /* egyenlő rangnál véletlen sorrend (a rendezés stabil), ne mindig a tábla eleje jöjjön */
  ki.sort(function (x, y) {
    var sx = tenySorBarmi(x, tar), sy = tenySorBarmi(y, tar), lx = sx.d <= 2 ? 0 : 1, ly = sy.d <= 2 ? 0 : 1;
    return lx - ly || sx.e - sy.e || sx.d - sy.d;
  });
  return ki;
}
/* A KÖZÖS VÁLASZTÓ: a halmazból (tény-kulcsok) db darab, a rendszerterv keveréke szerint:
   kb. fele esedékes, kb. 3/10 ismétlés a „tudja/villám” tényekből, legfeljebb ujKor új; ami hiányzik,
   azt a többi csoport tölti ki. Az új tények a könnyebbtől a nehezebb felé jönnek (tenyNehez), és előbb
   azoknak a családoknak a fordítottjai, amelyek műveletét a gyerek már tudja (5 + 7 megy → 12 − 7 jöhet).
   opc.szigoru: az új tények száma SOSEM lépi túl a korlátot (a Neked szóló ösvény inkább ismétel, lásd tenyKorEpit).
   A Neked szóló ösvény (3. kör) ezt hívja; a becsempészés csak az esedékeseket nézi (tenyEsedekes). */
function tenyKever(t) { for (var i = t.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
/* mennyire nehéz egy MÉG ÚJ tény (kisebb = előbb jön): + − a tagok nagysága, a 10 átlépése; × ÷ a „barátságos”
   táblák (1, 2, 5, 10) elöl; a fordított művelet kicsit később, de ha a család művelete már megy, előrébb */
function tenyNehez(k) {
  if (TENY_TIPUS_KULCS[k]) return { t10: 4, e1: 5, tz: 5, e1a: 7, k2: 7, k2a: 9, sb: 8 }[k];
  var m = /^([okds])(\d+)_(\d+)$/.exec(k), op = m[1], x = +m[2], y = +m[3], a, b, n;
  if (op === "o" || op === "s") { a = x; b = y; }
  else { var z = op === "k" ? x - y : x / y; a = Math.min(y, z); b = Math.max(y, z); }
  if (op === "o" || op === "k") n = (a + b) / 2 + (a + b > 10 ? 3 : 0);
  else n = (a <= 2 || a === 5 || b === 5 || b === 10) ? 1 + b / 10 : 1 + a * b / 12;
  if (op === "k" || op === "d") {
    var s = tenySorBarmi((op === "k" ? "o" : "s") + a + "_" + b);
    n += (s && s.d >= 3) ? -2 : 1.5;
  }
  return n;
}
function tenyValaszt(halmaz, db, opc) {
  opc = opc || {};
  var B = tenyBeall(), ma = tenyNap();
  var maxUj = opc.ujMax != null ? opc.ujMax : B.ujKor;
  var esed = tenyEsedekes(halmaz), ism = [], uj = [];
  halmaz.forEach(function (k) {
    var s = tenySorBarmi(k);
    if (!s || !s.d) uj.push(k);
    else if (s.e > ma && s.d >= 3) ism.push(k);
  });
  tenyKever(ism);
  var ujS = {}; uj.forEach(function (k) { ujS[k] = tenyNehez(k) + Math.random() * 2; });   /* egy kis véletlen, hogy ne mindig ugyanaz jöjjön */
  uj.sort(function (x, y) { return ujS[x] - ujS[y]; });
  var ki = [], kell = { esed: Math.round(db * 0.5), ism: Math.round(db * 0.3) };
  kell.uj = Math.min(maxUj, db - kell.esed - kell.ism);
  ki = ki.concat(esed.slice(0, kell.esed), ism.slice(0, kell.ism), uj.slice(0, kell.uj));
  var tartalek = esed.slice(kell.esed).concat(ism.slice(kell.ism));   /* hiány esetén: előbb a többi esedékes/ismétlés, … */
  while (ki.length < db && tartalek.length) ki.push(tartalek.shift());
  var ujMaradek = opc.szigoru ? [] : uj.slice(kell.uj);                                   /* … végül új (a korláton túl csak, ha nincs más) */
  while (ki.length < db && ujMaradek.length) ki.push(ujMaradek.shift());
  return ki;
}
/* A Tény-kert, a pult és a későbbi visszahívás (Tamagocsi) kérdezhető összegzése (a pult a tar-t adja át):
   ágyásonként hány virág (család) és hány tény van az egyes lépcsőkön, hány esedékes.
   + .kert: a gyerek kertje (Tamagocsi): { hajtas, bimbo, virag, szomj 0–2, mag {f, g}, meglepetes } — a játékban
   magától, a pult a kert-tárral (P().tenyKert) kéri. Erre épül majd a visszahívás. */
function tenyKertAllapot(tar, kert) {
  if (!tar && kert === undefined) kert = tenyKertTar();
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
  if (kert) {
    var g = { hajtas: 0, bimbo: 0, virag: 0, szomj: typeof igeny === "function" ? igeny(kert.loc) : null,
      mag: kert.mag ? { f: kert.mag.f, g: kert.mag.g || 0 } : null, meglepetes: !!(kert.meg && !kert.meg.kesz),
      ritka: Object.keys(kert.ritka || {}).length, magFazis: kert.mag ? (kert.mag.kesz ? 4 : kert.mag.i || 0) : null,
      kincs: Object.keys(kert.kincs || {}).length, locsolt: kert.loc || null, bent: kert.bent || null };
    Object.keys(kert.v || {}).forEach(function (k) { g[["", "hajtas", "bimbo", "virag"][tenyViragFazis(kert.v[k], ma)]]++; });
    ki.kert = g;
  }
  return ki;
}

/* ════════════ Tamagocsi-kert 3. kör (2026-10-05): a virágok rejtve gyűlnek (terv/teny-kert-tamagocsi-terv.html) ════════════
   P().tenyKert.v[kulcs] = { a: 1 hajtás · 2 bimbó · 3 virág, n: a hajtás napja (tenyNap), g: a nyílás gyakorlós napja }.
   Hajtás: az első villám-válasz, ha a doboz utána ≥ 3 (a tény már legalább kétszer ment jól) — a naplozz hívja a
     tenyJegyez után; a motor számolása érintetlen. Csak a két tény-ágyás tényei (a 100-as kör típusai nem).
   Bimbó: a hajtás utáni naptári napon magától (nem kell menteni, a fázis a napból számolódik).
   Virág: a következő gyakorlós napon (a nap első végigjátszott pályája: gyakLep → tenyKertNyit). Ami nyílt, nyitva marad.
   Amíg a gyerek a kertet még nem látta (indult = 0), a virágok bimbóban várnak, így az első belépés
   „Nézd, mennyi bimbó!” élménye megmarad (a 4. kör óta a teny-kert.js tenyKertBelep állítja be az első belépéskor:
   a meglévő tudás — doboz ≥ 3 — és a várakozó hajtások ekkor bimbók lesznek, n = aznap, így a következő gyakorlós napon nyílnak).
   K.gy = a gyerek virág-magja (a kinézethez), K.lg[agy] = az a gyakorlós nap, amikor utoljára látta közelről az ágyást
   (ami azóta nyílt, annak egyszer lejátszódik a nyílás-jelenete), K.hir.mondva = az ösvény végén már elhangzott a hír. */
function tenyKertTar(p) {
  p = p || P();
  var k = p.tenyKert;
  if (!k || typeof k !== "object") k = p.tenyKert = {};
  if (!k.v || typeof k.v !== "object") k.v = {};
  return k;
}
function tenyKertHajt(tj) {
  if (!tj || tj.tipus || tj.betu !== "V" || tj.d < 3 || !tenyAgyE(tj.kulcs)) return false;
  var v = tenyKertTar().v;
  if (v[tj.kulcs]) return false;                   /* már van hajtása / virága */
  v[tj.kulcs] = { a: 1, n: tenyNap() };
  return true;
}
/* 0 nincs · 1 hajtás · 2 bimbó · 3 virág */
function tenyViragFazis(r, ma) {
  if (!r) return 0;
  if (r.a >= 2) return r.a;
  return (ma == null ? tenyNap() : ma) > r.n ? 2 : 1;
}
/* a nap első végigjátszott pályája után: kinyílik minden bimbó, ami nem ma bújt ki. Visszaad: hány nyílt
   (a hír a 4. körtől szól: „🌸 Két új virág nyílt a kertedben!”; addig csak a K.hir-be kerül). */
function tenyKertNyit() {
  var K = tenyKertTar();
  if (!K.indult) return 0;
  var ma = tenyNap(), gy = gyakNap(), db = 0;
  Object.keys(K.v).forEach(function (k) {
    var r = K.v[k];
    if (r.a < 3 && r.n < ma) { r.a = 3; r.g = gy; db++; }
  });
  if (db) K.hir = { nap: ma, nyilt: db };
  return db;
}

/* ════════════ 3. KÖR (2026-10-05): a 🌸 Neked szóló ösvény + a becsempészés ════════════ */

/* ── melyik táblák vannak bekapcsolva: a pult listája, vagy (üres = automatikus) amivel a gyerek már találkozott ── */
function tenyTablakAktiv(B) {
  B = B || tenyBeall();
  if (Array.isArray(B.tablak)) return B.tablak.slice();
  var lat = {};
  Object.keys(tenyTar(false)).forEach(function (k) { var t = tenyTabla(k); if (t) lat[t] = 1; });
  if (Object.keys(tenyTar(true)).length) lat.kor100 = 1;
  return TENY_TABLAK.map(function (t) { return t[0]; }).filter(function (t) { return lat[t]; });
}
/* a táblák összes ténye (+ a 100-as kör 6 típusa, ha az is be van kapcsolva) */
function tenyHalmaz(tablak) {
  var ki = [];
  tenyMind("ok").concat(tenyMind("sd")).forEach(function (k) { if (tablak.indexOf(tenyTabla(k)) >= 0) ki.push(k); });
  if (tablak.indexOf("kor100") >= 0) ki = ki.concat(Object.keys(TENY_TIPUS_KULCS).filter(function (k) {
    return k !== "sb" || tenyTar(true).sb;   /* a százas barátok csak azután, hogy a gyerek már találkozott velük */
  }));
  return ki;
}

/* ── egy tényből (vagy 100-as típusból) feladat, a megszokott alakban (engine-gen.js feladat*) ── */
var TENY_TIPUS_GEN = {   /* típus → [generátor, beállítás] változatok; a kész feladatot a tenyKulcs ellenőrzi */
  t10: [["tizesek", {}]],
  e1: [["osszeadas", { a_min: 11, a_max: 89, b_min: 1, b_max: 9, atlepes: "nem", eredmeny_max: 100 }], ["kivonas", { a_min: 11, a_max: 99, b_min: 1, b_max: 9, atlepes: "nem" }]],
  e1a: [["osszeadas", { a_min: 11, a_max: 89, b_min: 2, b_max: 9, atlepes: "kell", eredmeny_max: 100 }], ["kivonas", { a_min: 11, a_max: 99, b_min: 2, b_max: 9, atlepes: "kell" }]],
  tz: [["osszeadas", { a_min: 11, a_max: 89, b_min: 10, b_max: 80, b_tizes: true, eredmeny_max: 100 }], ["kivonas", { a_min: 21, a_max: 99, b_min: 10, b_max: 80, b_tizes: true }]],
  k2: [["osszeadas", { a_min: 11, a_max: 88, b_min: 11, b_max: 88, atlepes: "nem", eredmeny_max: 100 }], ["kivonas", { a_min: 22, a_max: 99, b_min: 11, b_max: 88, atlepes: "nem" }]],
  k2a: [["osszeadas", { a_min: 11, a_max: 88, b_min: 11, b_max: 88, atlepes: "kell", eredmeny_max: 100 }], ["kivonas", { a_min: 22, a_max: 99, b_min: 11, b_max: 88, atlepes: "kell" }]]
};
function tenyFeladat(k) {
  var f = null;
  if (k === "sb") {   /* százas barátok: 37 + 63 vagy 100 − 36 (a sima generátorok ritkán adnak pont százat) */
    var n = veletlen(1, 8) * 10 + veletlen(1, 9);
    f = Math.random() < 0.5 ? feladatOsszeadas(n, 100 - n) : feladatKivonas(100, n);
  } else if (TENY_TIPUS_KULCS[k]) {
    for (var i = 0; i < 60 && !f; i++) {
      var v = veletlenElem(TENY_TIPUS_GEN[k]), g = GEN[v[0]](v[1], {}), tk = tenyKulcs(g.naplo);
      if (tk && tk.kulcs === k) f = g;
    }
    if (!f) f = k === "t10" ? feladatOsszeadas(30, 40) : feladatOsszeadas(53, 4);   /* (nem fordul elő) */
  } else {
    var m = /^([okds])(\d+)_(\d+)$/.exec(k), x = +m[2], y = +m[3], cs = Math.random() < 0.5;
    if (m[1] === "o") f = cs ? feladatOsszeadas(x, y) : feladatOsszeadas(y, x);
    else if (m[1] === "k") f = feladatKivonas(x, y);
    else if (m[1] === "s") f = cs ? feladatSzorzas(x, y) : feladatSzorzas(y, x);
    else f = feladatOsztas(y, x / y);
  }
  f.tenyK = k;
  return f;
}

/* ── a Neked szóló ösvény mint pálya: a „💖 Neked készült” ligetben, az egyéni pályák előtt (egyeniPalyak) ──
   Rajt → 4 szakasz → Odú-küszöb, állomásonként 4 feladat = 20. Egyéni pálya: ✨ + 💧 jár, égi szilánk nem;
   a 12 órás kapu és a pult „🔁 Hányszor” korlátja viszont rá is érvényes (palyaZarva, palyaElfogyott).
   Akkor látszik, ha a pult nem rejti (osveny), és van miből összerakni (legalább egy bekapcsolt tábla;
   ha az új tény / kör 0, akkor legalább 5 már ismert tény is). */
var TENY_OSVENY_ID = "teny-neked";
var TENY_ALLOMAS_NEVEK = ["Harmatos rét", "Pitypangmező", "Lepkerét", "Virágos domb"];
var TENY_KOR_DB = 20;
var TENY_PALYA = null;
var TENY_CSAK_ISMERT_MIN = 5;   /* új tény / kör = 0 esetén legalább ennyi ismert tény kell (különben egy-két tény ismétlődne 20-szor) */
function tenyPalya() {
  var B = tenyBeall();
  if (B.osveny === false) return null;
  var tablak = tenyTablakAktiv(B), H = tenyHalmaz(tablak);
  if (!H.length) return null;
  if (!B.ujKor && H.filter(function (k) { var s = tenySorBarmi(k); return s && s.d >= 1; }).length < TENY_CSAK_ISMERT_MIN) return null;
  if (!TENY_PALYA) {
    var all = [{ nev: "Rajt" }];
    TENY_ALLOMAS_NEVEK.forEach(function (n) { all.push({ nev: n, darab: 4 }); });
    all.push({ nev: "Odú-küszöb", darab: 4, cel: true });
    TENY_PALYA = { id: TENY_OSVENY_ID, nev: "Neked szóló ösvény", ikon: "🌸", regio: "egyeni", egyeni: true, teny: true,
                   szint: 1, palcim: "", alap: { tipus: "teny" }, kez_nelkul: false, allomasok: all, letrehozva: 0 };
  }
  var jel = [], szint = 1;
  if (tablak.some(function (t) { return t === "ok10" || t === "ok20" || t === "kor100"; })) jel.push("+ −");
  if (tablak.indexOf("s") >= 0) jel.push("×");
  if (tablak.indexOf("d") >= 0) jel.push("÷");
  tablak.forEach(function (t) { szint = Math.max(szint, { ok10: 1, ok20: 2, kor100: 3, s: 4, d: 5 }[t] || 1); });
  TENY_PALYA.szint = szint;
  TENY_PALYA.palcim = jel.join(" ") + (jel.length > 1 ? " vegyesen" : "") + " · mindig a neked való feladatok";
  return TENY_PALYA;
}

/* ── egy kör összeállítása (az ösvény első feladatánál, J.tenyKor) ──────────────
   A keverék: kb. 10 esedékes, kb. 6 ismétlés, legfeljebb ujKor új (tenyValaszt, szigorúan). Ha ez kevés
   (a gyereknek még kevés ismert ténye van), a hiányt így töltjük fel:
     0. a még nem esedékes „tanulja” tények (holnapra várnának, de gyakorolni ma is jó);
     1. az új és az esedékes tények egyszer még visszajönnek (egy tény legfeljebb kétszer egy körben);
     2. ha még mindig kevés, további új tények, a legkönnyebbek (ilyenkor a kör elején lévő gyerek tényleg
        kezdő; a korlát a sok ismert tény közé kevert újak számát fogja vissza) — ujKor = 0 esetén soha;
     3. végső esetben bármelyik kiválasztott újra (ujKor = 0 és nagyon kevés ismert tény).
   Az első feladat lehetőleg egy már tudott tény (jó kezdés), két új tény lehetőleg nem jön egymás után. */
function tenyKorEpit() {
  var B = tenyBeall(), H = tenyHalmaz(tenyTablakAktiv(B)), db = TENY_KOR_DB;
  var kul = tenyValaszt(H, db, { ujMax: B.ujKor, szigoru: true }), ma = tenyNap();
  H.filter(function (k) { var s = tenySorBarmi(k); return s && s.d >= 1 && s.d <= 2 && s.e > ma && kul.indexOf(k) < 0; })
    .sort(function (x, y) { return tenySorBarmi(x).e - tenySorBarmi(y).e; })
    .forEach(function (k) { if (kul.length < db) kul.push(k); });
  if (!kul.length) kul = tenyValaszt(H, db, { ujMax: Math.max(1, B.ujKor) });   /* (a tenyPalya ezt kizárja; biztonsági háló) */
  var sor = kul.map(function (k) {
    var s = tenySorBarmi(k);
    return { k: k, f: !s || !s.d ? "uj" : s.e <= ma ? "esed" : "ism" };
  });
  var masodszor = tenyKever(sor.slice()).filter(function (x) { return x.f !== "ism"; });
  for (var i = 0; sor.length < db && i < masodszor.length; i++) sor.push({ k: masodszor[i].k, f: "ujra" });
  if (sor.length < db && B.ujKor > 0) {
    tenyValaszt(H, db, { ujMax: db }).forEach(function (k) {
      if (sor.length < db && kul.indexOf(k) < 0 && !(tenySorBarmi(k) || {}).d) { kul.push(k); sor.push({ k: k, f: "uj" }); }
    });
  }
  for (var u = 0; sor.length < db && kul.length; u++) sor.push({ k: kul[u % kul.length], f: "ujra" });
  tenyKever(sor);
  var elso = -1;
  sor.forEach(function (x, j) { if (elso < 0 && x.f === "ism") elso = j; });
  if (elso < 0) sor.forEach(function (x, j) { if (elso < 0 && x.f === "esed" && (tenySorBarmi(x.k) || {}).d >= 3) elso = j; });
  if (elso > 0) sor.unshift(sor.splice(elso, 1)[0]);
  for (var a = 1; a < sor.length; a++) {   /* két új egymás után → a második hátrébb, egy nem-új helyére */
    if (sor[a].f === "uj" && sor[a - 1].f === "uj") {
      for (var b = a + 1; b < sor.length; b++) if (sor[b].f !== "uj") { var t = sor[a]; sor[a] = sor[b]; sor[b] = t; break; }
    }
  }
  tenySzomszedRendez(sor, 1);
  if (typeof hiNekedJelol === "function") hiNekedJelol(sor);   /* 🌿 kb. minden ötödik „mi bújt el” formában (bujocska.js) */
  return { sor: sor, hol: 0, allomas: -1, botlasAll: 0, vissza: {}, utolso: null };
}
/* ugyanaz a tény kétszer egymás után sosem jön: a második helyet cserél egy későbbivel */
function tenySzomszedRendez(sor, tol) {
  for (var i = Math.max(1, tol); i < sor.length; i++) {
    if (sor[i].k !== sor[i - 1].k) continue;
    for (var j = i + 1; j < sor.length; j++) {
      if (sor[j].k !== sor[i - 1].k && (j + 1 >= sor.length || sor[j + 1].k !== sor[i].k) && sor[j - 1].k !== sor[i].k) {
        var t = sor[i]; sor[i] = sor[j]; sor[j] = t; break;
      }
    }
  }
}
/* túl sok botlás egy szakaszban (4-ből legalább 2) → a következő szakasz új tényei hátrébb kerülnek,
   a helyükre a későbbi, már ismert tények jönnek előre */
function tenyKorKonnyit(K) {
  var veg = Math.min(K.sor.length, K.hol + 4);
  for (var i = K.hol; i < veg; i++) {
    if (K.sor[i].f !== "uj") continue;
    for (var j = K.sor.length - 1; j >= veg; j--) {
      if (K.sor[j].f !== "uj") { var t = K.sor[i]; K.sor[i] = K.sor[j]; K.sor[j] = t; break; }
    }
  }
  tenySzomszedRendez(K.sor, K.hol);
}
/* a Neked szóló ösvény feladat-generátora (az állomás tipusa: "teny"); a pult is betölti ezt a fájlt, ott nincs GEN */
function tenyGen(cfg, kerultMar) {
  var K = J.tenyKor || (J.tenyKor = tenyKorEpit());
  if (K.allomas !== J.allomasIdx) {
    if (K.allomas >= 0 && K.botlasAll >= 2) tenyKorKonnyit(K);
    K.allomas = J.allomasIdx; K.botlasAll = 0;
  }
  if (K.hol >= K.sor.length) K.sor.push({ k: K.sor[Math.floor(Math.random() * K.sor.length)].k, f: "ujra" });   /* (nem fordul elő) */
  if (K.sor[K.hol].k === K.utolso && K.hol + 1 < K.sor.length) { var t = K.sor[K.hol]; K.sor[K.hol] = K.sor[K.hol + 1]; K.sor[K.hol + 1] = t; }
  var x = K.sor[K.hol++];
  K.utolso = x.k;
  var f = tenyFeladat(x.k);
  return (x.h && typeof hiNekedForma === "function") ? hiNekedForma(f) : f;
}
if (typeof GEN !== "undefined") GEN.teny = tenyGen;
/* a naplozz hívja a tenyJegyez eredményével: a Neked szóló ösvényen a botlós tény 3–5 feladattal később visszajön
   (egy körben egyszer), és számoljuk a szakasz botlásait */
function tenyKorJegyez(tj) {
  var K = J && J.tenyKor;
  if (!K || !tj || tj.betu !== "H") return;
  K.botlasAll++;
  if (K.vissza[tj.kulcs]) return;
  var hova = K.hol + veletlen(2, 4);           /* a mostani a hol−1. helyen van → 3–5 feladattal később */
  if (hova >= Math.min(K.sor.length, TENY_KOR_DB)) return;
  K.vissza[tj.kulcs] = 1;
  var most = K.sor[K.hol - 1];
  K.sor.splice(hova, 0, { k: tj.kulcs, f: "vissza", h: !!(most && most.k === tj.kulcs && most.h) });   /* 🌿 ugyanabban a formában jön vissza */
  tenySzomszedRendez(K.sor, K.hol);
}

/* ── becsempészés: a meglévő pályák állomásonként legfeljebb 1 esedékes tényt kérnek ──
   Csak a pálya saját keretein belül (a 3-as szorzó állomás csak a 3-as tábla esedékes tényét kérheti; az
   összeadó állomás tartománya, átlépés-szabálya, eredmény-korlátja is áll). Az állomáson belül véletlen
   helyen jön, egy pályán egy tény legfeljebb egyszer. A pulton kikapcsolható (becsempesz). */
var TENY_CSEMPESZ_TIPUS = { osszeadas: 1, kivonas: 1, szorzas: 1, osztas: 1, szorzasosztas: 1, hianyzo: 1 };   /* hianyzo: 🌿 „mi bújt el” formában (bujocska.js) */
function tenyBenne(v, lo, hi) { return lo != null && hi != null && v >= lo && v <= hi; }
/* a tény belefér-e az állomás keretébe → a feladat (és a generátor „volt már” jele), vagy null */
function tenyKeretben(k, cfg, kerult) {
  var m = /^([okds])(\d+)_(\d+)$/.exec(k || "");
  if (!m) return null;
  var op = m[1], x = +m[2], y = +m[3], t = cfg.tipus, i, p;
  if (t === "hianyzo") return typeof hianyzoKeretben === "function" ? hianyzoKeretben(k, cfg, kerult) : null;   /* 🌿 bújócska-pályák */
  if (t === "szorzasosztas") t = op === "s" ? "szorzas" : op === "d" ? "osztas" : null;
  if (t === "osszeadas" && op === "o") {
    if (cfg.csak_tizes || cfg.b_tizes || kerult[x + "|" + y]) return null;
    var parok = Math.random() < 0.5 ? [[x, y], [y, x]] : [[y, x], [x, y]];
    for (i = 0; i < 2; i++) {
      p = parok[i];
      if (tenyBenne(p[0], cfg.a_min, cfg.a_max) && tenyBenne(p[1], cfg.b_min, cfg.b_max) && p[0] + p[1] <= (cfg.eredmeny_max || 100) &&
          atlepesOK(p[0], p[1], "+", cfg.atlepes)) { kerult[x + "|" + y] = true; return feladatOsszeadas(p[0], p[1]); }
    }
    return null;
  }
  if (t === "kivonas" && op === "k") {
    if (cfg.csak_tizes || cfg.b_tizes || kerult[x + "|" + y]) return null;
    if (!tenyBenne(x, cfg.a_min, cfg.a_max) || !tenyBenne(y, cfg.b_min, Math.min(cfg.b_max, x)) || !atlepesOK(x, y, "-", cfg.atlepes)) return null;
    kerult[x + "|" + y] = true;
    return feladatKivonas(x, y);
  }
  if (t === "szorzas" && op === "s") {
    var N = cfg.szorzo != null ? [cfg.szorzo] : (cfg.tablak || []), jo = [];
    if (kerult["sz" + x + "x" + y]) return null;
    if (N.indexOf(x) >= 0) jo.push([x, y]);
    if (x !== y && N.indexOf(y) >= 0) jo.push([y, x]);
    if (!jo.length) return null;
    p = veletlenElem(jo); kerult["sz" + x + "x" + y] = true;
    return feladatSzorzas(p[0], p[1]);
  }
  if (t === "osztas" && op === "d") {
    var D = cfg.oszto != null ? [cfg.oszto] : cfg.osztok || (cfg.szorzo != null ? [cfg.szorzo] : (cfg.tablak || [])), q = x / y;
    if (D.indexOf(y) < 0 || kerult["o" + y + "/" + q]) return null;
    kerult["o" + y + "/" + q] = true;
    return feladatOsztas(y, q);
  }
  return null;
}
/* az ujFeladat hívja a generátor előtt: ha ez az állomás „becsempészett” helye, és van a keretbe illő
   esedékes tény → az lesz a feladat; különben null (marad a pálya saját sorsolása) */
function tenyCsempesz(cfg, kerult) {
  if (!J || !J.palya || J.palya.teny || !cfg || !TENY_CSEMPESZ_TIPUS[cfg.tipus]) return null;
  if (!tenyBeall().becsempesz) return null;
  var cs = J.tenyCsempesz || (J.tenyCsempesz = { all: -1, cel: 0, kesz: false, volt: {} });
  if (cs.all !== J.allomasIdx) { cs.all = J.allomasIdx; cs.kesz = false; cs.cel = veletlen(0, Math.max(0, (J.feladatDb || 1) - 1)); }
  if (cs.kesz || J.feladatKesz < cs.cel) return null;
  cs.kesz = true;
  var esed = tenyEsedekes();
  for (var i = 0; i < esed.length; i++) {
    if (cs.volt[esed[i]]) continue;
    var f = tenyKeretben(esed[i], cfg, kerult);
    if (f) { cs.volt[esed[i]] = 1; f.tenyK = esed[i]; f.csempeszett = true; return f; }
  }
  return null;
}

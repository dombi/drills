/* ============ 6h7) 💰 FIZESS PONTOSAN — üres a kassza (3. receptes pálya a Piactéren, 1. kör, 2026-11-07) ============
   Recept-lap: terv/fizess-pontosan-recept-lap.html (✅ mind az 5 döntés A). A sora a receptek.js-ben, a kép a jelenet-motoron (jelenet.js),
   Zsivány standján lakik (2. kártya: piac.js kártyaválasztó). A Zsibvásár (zsib.js) rajzkészletét és Zsivány-rigjét használja.
   MIT CSINÁL A GYEREK A KÉPEN? Reggel még üres Zsivány kasszája, nem tud visszaadni. A gyerek a korlátos erszényéből a pultra rakja az
   érméket (felvesz–letesz), és „Fizetek”. Zsivány nagyobb érmével kezdve hangosan összeszámolja. Pont annyi → elteszi az árut. Sok → vállat von,
   a kassza üres rekeszei világítanak, az érmék visszalebegnek. Kevés → a szalagon üres hely marad a cédula előtt. Ha szerinte nem lehet, a
   cédulát a „Nem lehet” tálba teszi, és meg kell mutatnia, miért (🔒 kiskapu: a „nem lehet” csak indoklással ér).
     ① Csupa egyforma — egy címlet sok darabban (1. MF 108., 2. MF 40., 3. TC 40.). Az ugró-szalag minden lerakott érménél ugrik egyet:
        a kérdés, hogy a cédulánál megáll-e. Állomásonként egy nem kifizethető ár: indoklás = a szalagon a két szomszéd megálló.
     ② Pontosan, másképp is — vegyes erszény, címletenként legfeljebb 2 (Hármasország, 2. MF 60–62.; 3. MB 15/4). Pósa: fizesd ki → van más út?
        (csak 💧, kihagyható, ugyanaz nem ér). A szalag csak 2 hiba után jelenik meg, a pult széle is akkor mutatja, mennyi van kint.
     ③ Lehet egyáltalán? (2. kör) — vegyes erszény, szalag nélkül, a fele nem fizethető ki. Pólya: előbb nézd az erszényt. A „nem lehet”
        után okkártya (3 kártya, mindig pontosan egy igaz): kevés az egész · csupa páros érme (páratlan ár) · csak ötösével (az ár nem 0/5-re végződik).
        Rossz kártya = hiba, a kártya áthúzva marad, Zsivány megmondja, miért nem igaz (van páratlan / nem ötös érméd).
     ④ Biztos, lehet, lehetetlen (3. o.-tól, 3. TB 50/1) — „Egy vevő pontosan kifizette ezt ebből az erszényből.” 3 állítás egymás után,
        mindegyik a három tál egyikébe (koppintás a tálra, vagy felvesz–letesz). A pulton ki is próbálhatja (Számold: Zsivány összeszámolja,
        hibát nem könyvel). Rossz tál → ellenpélda a pulton (egy pontos fizetés, ahol nem / ahol igen igaz), „lehet”-nél az összes pontos
        fizetés ✓/✗-tel. Az állítások tálai nem mindig különbözők (különben az utolsó ingyen menne).
     ④ Ennyi érmével (1–2. o., 3. TC 23.) — „Fizess pontosan, N érmével!” Van pontos fizetés más érmeszámmal is (Dienes: itt nem igaz).
     🏠 Odú-küszöb — ① ② ③ ④ vegyesen, szalag nélkül (a „nem lehet” indoklásánál a szalag előjön: az a bizonyíték).
   Számkör (2A): 1. o. 20-ig (1, 2, 5, 10) · 2. o. 100-ig, 3–5 érme · 3. o.-tól 100-ig, 4–6 érme, 50-es is.
   Jó válasz után NINCS magyarázat (a producer, 11-08: „cserébe kevesebbet magyarázzon”, a magyarázat a B/L/N animációé): csak „Pont annyi.
   Köszönöm!” / „Igaz!”, a visszajelzés-sor csak „Ez az!”. Hibánál marad a magyarázat (a kép következménye + Zsivány mondata).
   Napló (a pult ezt látja): szakaszonként más kérdés-alak — „csak 5-ös, 23” · „pontos 37” · „lehet? 41” · „pontos 26, 3 érme” · „B/L/N 26”. */

VS_SZIN.fizess1 = { teto: "#f7d57a", csik: "#fffaf0", sotet: "#b5842c", cimer: "🪙" };
VS_SZIN.fizess2 = { teto: "#f6a5c0", csik: "#fffaf0", sotet: "#b5607e", cimer: "💰" };
VS_SZIN.fizess3 = { teto: "#a9d8c4", csik: "#fffaf0", sotet: "#3f7f75", cimer: "❓" };
VS_SZIN.fizess4 = { teto: "#c9b6e8", csik: "#fffaf0", sotet: "#7a5ca8", cimer: "⚖️" };
var FP_URES = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0 };
var FP_ESEID = { 1: "egyeseid", 2: "ketteseid", 5: "ötöseid", 10: "tízeseid", 20: "húszasaid", 50: "ötveneseid" };
var FP_ESSEL = { 2: "kettesével", 5: "ötösével", 10: "tízesével", 20: "húszasával" };
var FP_TA = { 1: "egyest", 2: "kettest", 5: "ötöst", 10: "tízest", 20: "húszast", 50: "ötvenest" };
var FP_ESEKET = { 1: "egyeseket", 2: "ketteseket", 5: "ötösöket", 10: "tízeseket", 20: "húszasokat", 50: "ötveneseket" };
var FP_ED = { 1: "egyesed", 2: "kettesed", 5: "ötösöd", 10: "tízesed", 20: "húszasod", 50: "ötvenesed" };
var FP_OKOK = ["keves", "paros", "otos"];
function fpOdu(o) { return ["pontos", "lehet", "egyforma", o >= 3 ? "bln" : "ennyi"]; }   /* Odú-küszöb: a 4 szakasz sorban (az egyforma a 3., itt a „nem lehet”) */
function fpNaplo(k) { return { tipus: "bolt", kerdes: k, forma: "z" }; }
function fpCsokk(a, b) { return b - a; }
PALYA_MAT["fizess-pontosan"] = "Üres a kassza. Fizess pontosan, vagy mutasd meg, hogy nem lehet. Hanggal játszd: Zsivány mondja el a feladatot!";   /* a producer, 11-08: hang nélkül a ④ érthetetlen volt */   /* a csengő ezt olvassa fel (a palcim „·” jele helyett) */

/* ═════════════════ FELADATGYÁRTÓK (tiszta adat) ═════════════════ */
/* a pontos fizetések (érme-multihalmazok, csökkenő sorrendben): ["20+5+2", …] */
function fpJok(e, ar) {
  var n = e.length, l = {}, m, i;
  for (m = 1; m < 1 << n; m++) { var t = [], s = 0; for (i = 0; i < n; i++) if (m & 1 << i) { t.push(e[i]); s += e[i]; } if (s === ar) l[t.join("+")] = 1; }
  return Object.keys(l);
}
/* ① csupa egyforma: nem = az ár NEM fizethető ki (nem többszöröse a címletnek). Az erszényben mindig több van, mint az ár (mindent letolni = sok) */
function fpEgyforma(o, nem) {
  var cl = o <= 1 ? [2, 5] : o === 2 ? [2, 5, 10] : [2, 5, 10, 20];
  for (var p = 0; p < 300; p++) {
    var c = veletlenElem(cl), hi = Math.min(o <= 1 ? 20 : 100, c * 7), ar = veletlen(c + 1, hi);
    if (nem ? ar % c === 0 : ar % c !== 0) continue;
    var n = Math.min(8, Math.floor(ar / c) + 2), e = [];
    for (var i = 0; i < n; i++) e.push(c);
    if (n * c <= ar) continue;
    return { forma: "egyforma", cim: c, ar: ar, nem: !!nem, erszeny: e, aru: zsAruk(1)[0], jok: nem ? 0 : 1, naplo: fpNaplo("csak " + c + "-es, " + ar) };
  }
  return nem ? { forma: "egyforma", cim: 5, ar: 17, nem: true, erszeny: [5, 5, 5, 5, 5], aru: ZS_ARU[0], jok: 0, naplo: { tipus: "bolt", kerdes: "pontos 17", forma: "z" } }
             : { forma: "egyforma", cim: 5, ar: 15, nem: false, erszeny: [5, 5, 5, 5, 5], aru: ZS_ARU[0], jok: 1, naplo: { tipus: "bolt", kerdes: "pontos 15", forma: "z" } };
}
/* ② pontosan, másképp is: címletenként legfeljebb 2 érme; van pontos fizetés; az egész nem pont az ár; a „próbálgatás” ne érje meg
   (a pontos fizetések legfeljebb a fele az ár fölötti/egyenlő kirakásoknak); többnyire több pontos út is van (Pósa: más út) */
function fpPontos(o) {
  var cim = o <= 1 ? [1, 2, 5, 10] : o === 2 ? [1, 2, 5, 10, 20] : [1, 2, 5, 10, 20, 50];
  for (var p = 0; p < 1500; p++) {
    var db = o <= 2 ? veletlen(3, 5) : veletlen(4, 6), e = keverTomb(cim.concat(cim)).slice(0, db), i;   /* minden címletből legfeljebb 2 */
    var S = tallerOsszeg(e);
    if (S > (o <= 1 ? 20 : 100) || S < 8) continue;
    e.sort(function (a, b) { return b - a; });
    var ar = o <= 1 ? veletlen(5, Math.min(19, S - 1)) : veletlen(Math.max(12, Math.floor(S / 3)), S - 2);
    if (ar >= S || ar % 10 === 0 && Math.random() < .7) continue;
    var jok = fpJok(e, ar); if (!jok.length) continue;
    var tobb = 0, m; for (m = 1; m < 1 << e.length; m++) { var s = 0; for (i = 0; i < e.length; i++) if (m & 1 << i) s += e[i]; if (s >= ar) tobb++; }
    if (jok.length * 2 > tobb && p < 1200) continue;
    if (jok.length < 2 && p < 1100 && Math.random() < .93) continue;   /* a szakasz neve „másképp is”: többnyire legyen más út */
    return { forma: "pontos", ar: ar, erszeny: e, aru: zsAruk(1)[0], jok: jok.length, naplo: { tipus: "bolt", kerdes: "pontos " + ar, forma: "z" } };
  }
  return { forma: "pontos", ar: o <= 1 ? 7 : 37, erszeny: o <= 1 ? [5, 2, 2, 1] : [20, 10, 5, 5, 2], aru: ZS_ARU[0], jok: o <= 1 ? 2 : 1, naplo: { tipus: "bolt", kerdes: "pontos 37", forma: "z" } };
}

/* ③ lehet egyáltalán? nem = nem fizethető ki; ok = az egyetlen igaz okkártya. A hamis okok mindig cáfolhatók az erszényből:
   kevés → van 1-es (páratlan, nem ötös) · páros → van 2-es (nem ötösével) · ötös → van 5-ös (páratlan) */
function fpLehet(o, nem) {
  var d, hat = o <= 1 ? 20 : 100;
  if (!nem) { d = fpPontos(o); d.forma = "lehet"; d.naplo = fpNaplo("lehet? " + d.ar); return d; }
  var ok = veletlenElem(FP_OKOK);
  for (var p = 0; p < 3000; p++) {
    var cim = ok === "paros" ? (o <= 1 ? [2, 10] : o === 2 ? [2, 10, 20] : [2, 10, 20, 50]) :
              ok === "otos" ? (o <= 1 ? [5, 10] : o === 2 ? [5, 10, 20] : [5, 10, 20, 50]) :
              (o <= 1 ? [1, 2, 5, 10] : o === 2 ? [1, 2, 5, 10, 20] : [1, 2, 5, 10, 20, 50]);
    var max = Math.min(cim.length * 2, o <= 2 ? 5 : 6), e = keverTomb(cim.concat(cim)).slice(0, veletlen(Math.min(3, max), max)).sort(fpCsokk), S = tallerOsszeg(e), ar;
    if (S > (o <= 1 ? 30 : 100)) continue;
    if (ok === "keves") {
      if (e.indexOf(1) < 0) continue;
      ar = veletlen(S + 1, S + (o <= 1 ? 6 : 15));
      if (ar > hat) continue;
    } else {
      if (e.indexOf(ok === "paros" ? 2 : 5) < 0 || S < (o <= 1 ? 8 : 15)) continue;
      ar = veletlen(o <= 1 ? 3 : 11, Math.min(hat, S - 1));
      if (ok === "paros" ? ar % 2 === 0 : ar % 5 === 0) continue;
    }
    if (fpJok(e, ar).length) continue;
    return { forma: "lehet", ar: ar, erszeny: e, nem: true, ok: ok, aru: zsAruk(1)[0], jok: 0, naplo: fpNaplo("lehet? " + ar) };
  }
  return { forma: "lehet", ar: 13, erszeny: [10, 2, 2], nem: true, ok: "paros", aru: ZS_ARU[0], jok: 0, naplo: fpNaplo("lehet? 13") };
}
/* az okkártya igaz-e erre a feladatra (a gépi próba is ezzel nézi, hogy mindig pontosan egy igaz) */
function fpOkIgaz(d, ok) {
  var e = d.erszeny;
  if (ok === "keves") return tallerOsszeg(e) < d.ar;
  if (ok === "paros") return e.every(function (v) { return v % 2 === 0; }) && d.ar % 2 === 1;
  return e.every(function (v) { return v % 5 === 0; }) && d.ar % 5 !== 0;
}
/* ④ (1–2. o.) ennyi érmével: van pontos fizetés n érmével, és van más érmeszámmal is */
function fpEnnyi(o) {
  var cim = o <= 1 ? [1, 2, 5, 10] : [1, 2, 5, 10, 20], hat = o <= 1 ? 20 : 100;
  for (var p = 0; p < 2000; p++) {
    var e = keverTomb(cim.concat(cim)).slice(0, veletlen(4, o <= 1 ? 5 : 6)).sort(fpCsokk), S = tallerOsszeg(e);
    if (S > hat || S < 9) continue;
    var ar = veletlen(o <= 1 ? 5 : 12, S - 2);
    if (ar % 10 === 0 && Math.random() < .7) continue;
    var jok = fpJok(e, ar), szam = {};
    jok.forEach(function (j) { szam[j.split("+").length] = 1; });
    var k = Object.keys(szam).map(Number); if (k.length < 2) continue;
    var n = veletlenElem(k);
    return { forma: "ennyi", ar: ar, n: n, erszeny: e, aru: zsAruk(1)[0], jok: jok.filter(function (j) { return j.split("+").length === n; }).length, naplo: fpNaplo("pontos " + ar + ", " + n + " érme") };
  }
  return { forma: "ennyi", ar: 12, n: 3, erszeny: [10, 5, 5, 2, 1], aru: ZS_ARU[0], jok: 1, naplo: fpNaplo("pontos 12, 3 érme") };
}
/* ④ (3. o.-tól) biztos / lehet / lehetetlen: az állítás egy pontos fizetésre (f: érmék) */
function fpAllitIgaz(a, f) {
  if (a.t === "van") return f.indexOf(a.c) >= 0;
  if (a.t === "nincs") return f.indexOf(a.c) < 0;
  if (a.t === "paros") return f.length % 2 === 0;
  if (a.t === "paratlan") return f.length % 2 === 1;
  if (a.t === "legalabb") return f.length >= a.n;
  if (a.t === "kevesebb") return f.length < a.n;
  if (a.t === "csak") return f.every(function (v) { return v === a.c; });
  return f.length === a.n;   /* mind: minden érméjét odaadta */
}
function fpAllitErt(a, P) { var t = P.filter(function (f) { return fpAllitIgaz(a, f); }).length; return t === P.length ? "b" : t === 0 ? "n" : "l"; }
function fpAllitasok(e, P) {
  var l = [], c = e.filter(function (v, i) { return e.indexOf(v) === i; }), n;
  c.forEach(function (v) {
    l.push({ t: "van", c: v, csal: "c", szoveg: "Adott " + FP_TA[v] + " is." }, { t: "nincs", c: v, csal: "c", szoveg: "Nem adott " + FP_TA[v] + "." });
    l.push({ t: "csak", c: v, csal: "csak", szoveg: "Csak " + FP_ESEKET[v] + " adott." });
  });
  l.push({ t: "paros", csal: "db2", szoveg: "Páros számú érmét adott." }, { t: "paratlan", csal: "db2", szoveg: "Páratlan számú érmét adott." });
  for (n = 2; n <= 5; n++) l.push({ t: "legalabb", n: n, csal: "db", szoveg: "Legalább " + n + " érmét adott." }, { t: "kevesebb", n: n, csal: "db", szoveg: "Kevesebb, mint " + n + " érmét adott." });
  l.push({ t: "mind", n: e.length, csal: "mind", szoveg: "Minden érméjét odaadta." });
  l.forEach(function (a) { a.ert = fpAllitErt(a, P); });
  return l;
}
function fpBln(o) {
  var cim = [1, 2, 5, 10, 20, 50];
  for (var p = 0; p < 3000; p++) {
    var e = keverTomb(cim.concat(cim)).slice(0, veletlen(5, 6)).sort(fpCsokk), S = tallerOsszeg(e);
    if (S > 100) continue;
    var ar = veletlen(12, S - 2), P = fpJok(e, ar).map(function (j) { return j.split("+").map(Number); });
    if (P.length < 2 || P.length > 4) continue;
    /* a 3 tál: nem mind ugyanaz, és nem mindig mind a három (különben a 3. állítás ingyen menne) */
    var cel = [veletlenElem(["b", "l", "n"]), veletlenElem(["b", "l", "n"]), veletlenElem(["b", "l", "n"])];
    if (cel[0] === cel[1] && cel[1] === cel[2]) continue;
    var all = keverTomb(fpAllitasok(e, P)), csal = {}, val = [];
    cel.forEach(function (c) {
      for (var i = 0; i < all.length; i++) { var a = all[i]; if (a.ert === c && !csal[a.csal] && !(a.csal === "mind" && Math.random() < .6)) { csal[a.csal] = 1; val.push(a); return; } }
    });
    if (val.length < 3) continue;
    return { forma: "bln", ar: ar, erszeny: e, fiz: P, allit: val, aru: zsAruk(1)[0], jok: P.length, naplo: fpNaplo("B/L/N " + ar) };
  }
  var e0 = [20, 10, 5, 2, 2, 1], P0 = fpJok(e0, 27).map(function (j) { return j.split("+").map(Number); }), a0 = fpAllitasok(e0, P0);
  return { forma: "bln", ar: 27, erszeny: e0, fiz: P0, allit: [a0[0], a0[a0.length - 2], a0[a0.length - 1]], aru: ZS_ARU[0], jok: P0.length, naplo: fpNaplo("B/L/N 27") };
}

/* ═════════════════ FELADAT (GEN.fizess) ═════════════════ */
GEN.fizess = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, o = zsOsztaly(), n = cfg.darab || 4, halvany = !!cfg.halvany, forma = cfg.forma, d;
  if (forma === "vegyes") forma = fpOdu(o)[i % 4];
  if (forma === "bln" && o <= 2) forma = "ennyi";   /* 4A döntés: 1–2. o.-ban „Ennyi érmével” */
  if (st.nemI == null) st.nemI = cfg.forma === "vegyes" ? 2 : veletlen(1, n - 1);   /* állomásonként egy „itt nem igaz” ár (nem az első) */
  if (!st.lehetMinta) st.lehetMinta = keverTomb([1, 1, 0, 0]);   /* ③: a fele nem fizethető ki */
  d = forma === "egyforma" ? fpEgyforma(o, i === st.nemI) : forma === "lehet" ? fpLehet(o, cfg.forma === "vegyes" ? Math.random() < .5 : !!st.lehetMinta[i % 4]) :
      forma === "ennyi" ? fpEnnyi(o) : forma === "bln" ? fpBln(o) : fpPontos(o);
  var x = { d: d, halvany: halvany, hib: 0, lep: d.forma === "bln" ? "bln" : "fizet", pult: [], okVal: [], okRossz: [], ai: 0, betett: [] }, k = fpKerdes(x);
  return { csalad: "jelenet", jelenet: "fizess", zs: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>', szoveg: k[0], felolvas: k[1],
    helyes: d.ar, keplet: k[0], tipp: "", naplo: d.naplo };
};
/* a lépés kérdése: [felirat, felolvasás] — a szabály az első mozdulat előtt elhangzik, és a kasszán is ott áll */
function fpKerdes(x) {
  var d = x.d, L = x.lep, ar = "Ez " + szo(d.ar) + " tallérba kerül. ";
  if (L === "mas") return ["Van más út? Fizess másképp!", "Van más út? Ha más érmékkel is ki tudod fizetni, kapsz egy csepp tündérharmatot!"];
  if (L === "okk") return ["Miért nem lehet? Válaszd ki!", "Miért nem lehet pontosan kifizetni? Nézd meg az erszényedet, és koppints arra a kártyára, amelyik igaz!"];
  if (d.forma === "bln") {
    var a = d.allit[Math.min(x.ai, 2)];
    return ["Biztos, lehet, vagy lehetetlen?", (x.ai === 0 ? "Egy vevő pontosan kifizette ezt ebből az erszényből. Nem kellett visszaadni. " : "") + a.szoveg +
      " Biztos, lehet, vagy lehetetlen? Tedd a tálba!" + (x.ai === 0 ? " A pulton ki is próbálhatod." : "")];
  }
  if (d.forma === "ennyi") return ["Fizess pontosan, " + d.n + " érmével!", ar + "Üres a kasszám. Pontosan " + szo(d.n) + " érmével fizess, se többel, se kevesebbel!"];
  if (d.forma === "lehet" && L === "fizet") return ["Fizess pontosan! Vagy nem lehet?", ar + "Üres a kasszám, nem tudok visszaadni. Előbb nézd meg az erszényedet! Ha pontosan ki tudod fizetni, fizess. Ha nem lehet, tedd a cédulát a tálba!"];
  if (L === "ok") return ["Miért nem lehet? Mutasd a szalagon!", "Mutasd meg a szalagon, miért nem lehet! Koppints a két megállóra: az egyik közvetlenül a cédula előtt van, a másik utána."];
  if (d.forma === "egyforma") return ["Fizess pontosan! Csak " + FP_ESEID[d.cim] + " vannak.", ar + "Üres a kasszám, nem tudok visszaadni. Csak " + FP_ESEID[d.cim] + " vannak. Fizess pontosan! Ha nem lehet, tedd a cédulát a tálba!"];
  return ["Fizess pontosan!", ar + "Üres a kasszám, nem tudok visszaadni. Pontosan fizess! Ha nem lehet, tedd a cédulát a tálba!"];
}
function fpLep(x, lep, csendben) {
  x.lep = lep; JL.rossz = null; x.hib = 0; JL.seg = 0;
  var k = fpKerdes(x), f = JL.f;
  f.szoveg = f.keplet = k[0]; $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>';
  if (!csendben) { var vj = $("visszajelzes"); vj.className = "visszajelzes"; vj.textContent = ""; }
  jlRajz(); if (!csendben) mondd(k[1]);
}
function fpPultErmek(x) { return x.pult.map(function (i) { return x.d.erszeny[i]; }).sort(function (a, b) { return b - a; }); }
/* Zsivány hangosan összeszámol, a nagyobb érmével kezdve (1. MF 129.: először a tízesek): „Húsz, harminc, harmincöt.” */
function fpSzamol(t) { var s = 0; return zsCap(t.map(function (v) { s += v; return szo(s); }).join(", ")) + "."; }

/* ═════════════════ JÁTÉKMENET ═════════════════ */
function fpFizet(x) {
  var d = x.d, t = fpPultErmek(x), s = tallerOsszeg(t), mas = x.lep === "mas", szamol;
  hangGomb();
  if (!t.length) { mondd("Tegyél érméket a pultra!"); return; }
  szamol = fpSzamol(t);
  if (s < d.ar) {   /* kevés: az érmék a pulton maradnak, a szalagon üres hely a cédula előtt */
    if (mas) { jlSzol(szamol + " Ez még kevés.", true); return; }
    zsRossz(x, "kevés", d.naplo, szamol + " " + (x.hib === 0 ? "Ez még kevés." : fpTipp(x, s)));
    return;
  }
  if (s > d.ar) {   /* sok: Zsivány vállat von, a kassza üres rekeszei világítanak, az érmék visszalebegnek */
    x.vilagit = KF_KASSZA_CIM.slice(); x.lep = "var";
    zsZsivany("vallatvon", null, 2600);
    var mondat = szamol + " Ez sok. Üres a kasszám, nem tudok visszaadni." + (x.hib >= 1 && !mas ? " " + fpTipp(x, s) : "");
    if (mas) { jlRajz(); jlSzol(mondat, true); } else zsRossz(x, "sok", d.naplo, mondat);
    zsVar(function () { x.lebeg = x.pult.slice(); x.pult = []; x.vilagit = null; x.lep = mas ? "mas" : "fizet"; jlRajz(); }, 2400);
    return;
  }
  if (d.forma === "ennyi" && t.length !== d.n) {   /* pont annyi, de nem annyi érmével: vissza a pultról, hiba */
    x.lep = "var";
    zsRossz(x, t.length + " érme", d.naplo, szamol + " Pont annyi, de ez " + szo(t.length) + " érme. Én " + szo(d.n) + " érmét kérek.");
    zsVar(function () { x.lebeg = x.pult.slice(); x.pult = []; x.lep = "fizet"; jlRajz(); }, 2400);
    return;
  }
  var kulcs = t.join("+");
  if (mas) {
    if (kulcs === x.elso) { x.lebeg = x.pult.slice(); x.pult = []; jlRajz(); mondd(szamol + " Így már fizettél. Más érmékkel is megy?"); return; }
    P().tunderharmat = (P().tunderharmat || 0) + ZS_MAS_HARMAT; ment();
    x.masik = kulcs; fpVege(x, "Így is jó! Ezért egy csepp tündérharmat jár.");
    return;
  }
  x.elso = kulcs;
  var harmatRejt = typeof nyitasHarmatRejtett === "function" && nyitasHarmatRejtett();
  if (d.forma === "pontos" && d.jok > 1 && !x.halvany && !harmatRejt) {   /* Pósa: ugyanarra az árra van más út is? (csak 💧-ért, kihagyható) */
    x.lep = "var"; hangCsilla(); zsKolyokPoz("orul"); jlRajz();
    zsZsivany("orul", "Pont annyi. Köszönöm!", 1800);
    zsVar(function () { x.lebeg = x.pult.slice(); x.pult = []; fpLep(x, "mas"); }, 2200);
    return;
  }
  fpVege(x, "Pont annyi. Köszönöm!");
}
/* a 2. hibától: a kép felel (① a szalagra mutat, ② a pult széle mutatja, mennyi van kint) — a megoldást nem mondjuk ki */
function fpTipp(x, s) {
  if (x.d.forma === "egyforma" && !x.halvany) return "Nézd a szalagot: megáll a cédulánál?";
  return "A pulton " + szo(s) + " tallér van" + (x.d.forma === "ennyi" ? ", " + szo(x.pult.length) + " érme" : "") + ". Az ár " + szo(x.d.ar) + ".";
}
function fpVege(x, mondat) {
  var d = x.d, f = JL.f, k = (x.masik || x.elso).split("+");
  x.lep = "kesz"; f.helyes = d.ar;
  jlJo("", null, function (tov) { hangCsilla(); zsZsivany("orul", mondat, 2200); zsKolyokPoz("orul"); zsVar(tov, 2600); });
}
/* a cédula a „Nem lehet” tálban: ha tényleg nem lehet, jön az indoklás (a szalagon a két szomszéd megálló); ha lehet, Zsivány visszaadja */
function fpNemLehet(x) {
  var d = x.d;
  if (d.nem) { hangCsilla(); x.lebeg = x.pult.length ? x.pult.slice() : null; x.pult = []; x.tal = true; if (d.forma === "lehet") zsKolyokPoz("gondol"); fpLep(x, d.forma === "lehet" ? "okk" : "ok"); return; }
  x.tal = false; zsZsivany("mutat", null, 1800);
  zsRossz(x, "nem lehet", d.naplo, x.hib === 0 ? "Szerintem lehet. Próbáld meg!" : "Szerintem lehet. Rakd ki, és nézd meg, mennyi van a pulton!");
}
/* az indoklás: a két megálló, amelyek között az ár van (pl. 15 és 20 a 17-nél) */
function fpOk(x, v) {
  var d = x.d, c = d.cim, lo = Math.floor(d.ar / c) * c, k = x.okVal.indexOf(v);
  hangGomb();
  if (k >= 0) x.okVal.splice(k, 1); else x.okVal.push(v);
  if (x.okVal.length < 2) { jlRajz(); return; }
  var a = Math.min(x.okVal[0], x.okVal[1]), b = Math.max(x.okVal[0], x.okVal[1]);
  if (a === lo && b === lo + c) {
    x.lep = "kesz";
    jlJo("", null, function (tov) { zsZsivany("orul", "Igaz!", 1800); zsKolyokPoz("orul"); zsVar(tov, 2200); });
    return;
  }
  x.okVal = [];
  var l = [], i; for (i = 0; i <= lo + c; i += c) l.push(szo(i));
  zsRossz(x, "megálló", d.naplo, x.hib === 0 ? "Keresd a cédulát a szalagon! Melyik megálló van közvetlenül előtte, és melyik utána?" : zsCap(FP_ESSEL[c]) + ": " + l.join(", ") + ". Melyik kettő között van " + szo(d.ar) + "?");
}

/* ③ az okkártya: igaz → kész; hamis → hiba, a kártya áthúzva marad, Zsivány az erszényből cáfolja */
function fpOkk(x, ok) {
  var d = x.d, S = tallerOsszeg(d.erszeny), ar = zsCap(szo(d.ar));
  hangGomb();
  if (x.okRossz.indexOf(ok) >= 0) return;
  if (fpOkIgaz(d, ok)) {
    x.lep = "kesz";
    jlJo("", null, function (tov) { zsZsivany("orul", "Igaz!", 1800); zsKolyokPoz("orul"); zsVar(tov, 2200); });
    return;
  }
  x.okRossz.push(ok);
  var ptl = d.erszeny.filter(function (v) { return v % 2; })[0], nem5 = d.erszeny.filter(function (v) { return v % 5; })[0];
  zsRossz(x, "ok: " + ok, d.naplo, ok === "keves" ? "Nem kevés: minden érméd együtt " + szo(S) + " tallér, az több, mint " + szo(d.ar) + "." :
    ok === "paros" ? "Nem csupa páros: van " + FP_ED[ptl] + " is." : "Nem csak ötösével megy: van " + FP_ED[nem5] + " is.");
}
/* ④ az állítás a tálba: jó → a következő; rossz → ellenpélda a pulton (vagy „lehet”-nél az összes pontos fizetés ✓/✗), a kártya visszajön */
function fpBlnTesz(x, tal) {
  var d = x.d, a = d.allit[x.ai], P = d.fiz, f, mondat;
  hangGomb(); x.mutat = null;
  if (tal === a.ert) {
    hangCsilla(); x.betett.push(tal); x.ai++; x.pult = [];
    if (x.ai < 3) { fpLep(x, "bln"); return; }
    x.lep = "kesz";
    jlJo("", null, function (tov) { zsZsivany("orul", "Mind a három a helyén van. Köszönöm!", 2200); zsKolyokPoz("orul"); zsVar(tov, 2600); });
    return;
  }
  if (tal === "l") {
    x.pult = []; x.mutat = P.map(function (g) { return { f: g, j: fpAllitIgaz(a, g) }; });
    mondat = a.ert === "b" ? "Nézd meg az összes pontos fizetést! Mindegyikben igaz." : "Nézd meg az összes pontos fizetést! Egyikben sem igaz.";
  } else {
    f = P.filter(function (g) { return fpAllitIgaz(a, g) !== (tal === "b"); })[0];
    var hasz = []; f.forEach(function (v) { for (var i = 0; i < d.erszeny.length; i++) if (d.erszeny[i] === v && hasz.indexOf(i) < 0) { hasz.push(i); return; } });
    x.pult = hasz;
    mondat = fpSzamol(f.slice()) + " Ez is pontos fizetés, és itt " + (tal === "b" ? "nem igaz." : "igaz.");
  }
  zsRossz(x, { b: "biztos", l: "lehet", n: "lehetetlen" }[tal], d.naplo, mondat);
}

/* ═════════════════ A KÉP (JELENETEK.fizess) ═════════════════ */
var FP_PULT = function (k) { return [30 + (k % 4) * 42, 264 + Math.floor(k / 4) * 44]; };
var FP_ERSZ = function (j) { return [92 + (j % 4) * 40, 362 + Math.floor(j / 4) * 42]; };
JELENETEK.fizess = {
  kep: function () { var K = zsK(); return { vb: K.vb, tabla: null, uni: K.uni }; },
  rajz: function (JL) {
    var K = zsK(), s = '<defs>' + HE_DEFS + '</defs>' + zsHatter(JL);
    s += '<g transform="' + K.stand + '">' + zsStand(true, false) + '</g>';   /* a kassza nagyban, a munka-részben (üres) */
    s += '<g class="zs-kolyok-hely"></g>';
    s += '<g transform="translate(' + K.m[0] + ' ' + K.m[1] + ') scale(' + K.m[2] + ')">' + fpRajz(JL) + '</g>';
    return zsHe(s);
  },
  utan: function (JL) { JELENETEK.zsib.utan(JL); },   /* Zsivány (ugyanaz a figura) és a kölyök a helyére, a lebegő érmék indulnak */
  fogRajz: function (JL, F) {
    if (F.id === "all") return '<g transform="translate(' + pcF(F.x - 98) + ' ' + pcF(F.y - 40) + ') scale(.7)">' + fpAllitKartya(JL.f.zs, 0, 0) + '</g>';
    if (F.id === "ced") return '<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 30) + ')">' + kfCedula(0, 0, JL.f.zs.d.ar, 1.15) + '</g>';
    return zsHe('<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 6) + ')">' + tallerBelso(F.n, 1) + '</g>');
  },
  felvesz: function (JL, id) {
    var x = JL.f.zs;
    if (x.lep !== "fizet" && x.lep !== "mas" && x.lep !== "bln") return null;
    x.lebeg = null; x.mutat = null;
    if (id === "all") { if (x.lep !== "bln") return null; x.fog = "all"; return 0; }
    if (id === "ced") { if (x.lep !== "fizet" || !fpTalVan(x.d)) return null; x.fog = "ced"; return x.d.ar; }
    var i = +id.split("-")[1]; x.fog = i; return x.d.erszeny[i];
  },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.zs; x.fog = null;
    if (id === "ced") { if (hova === "tal") { hangGomb(); fpNemLehet(x); } else jlRajz(); return; }
    if (id === "all") { if (hova === "b" || hova === "l" || hova === "n") fpBlnTesz(x, hova); else jlRajz(); return; }
    var i = +id.split("-")[1], k = x.pult.indexOf(i);
    if (hova === "pult") { if (k < 0) x.pult.push(i); } else if (k >= 0) x.pult.splice(k, 1);
    hangGomb(); jlRajz();
  },
  katt: function (JL, t) {
    var x = JL.f.zs, g = t.closest ? t.closest(".zs-gomb") : null, m = t.closest ? t.closest(".fp-megallo") : null, tal = t.closest ? t.closest(".fp-tal") : null;
    var okk = t.closest ? t.closest(".fp-okk") : null, bt = t.closest ? t.closest(".fp-btal") : null, hg = t.closest ? t.closest(".fp-hang") : null;
    if (hg) { hangGomb(); mondd(fpKerdes(x)[1]); return; }
    if (okk && x.lep === "okk") { fpOkk(x, okk.getAttribute("data-ok")); return; }
    if (bt && x.lep === "bln") { fpBlnTesz(x, bt.getAttribute("data-t")); return; }   /* a tálra koppintás is beteszi a soron lévő állítást */
    if (g && x.lep === "bln" && g.getAttribute("data-g") === "szamol") {   /* próba a pulton: Zsivány összeszámol, hibát nem könyvel */
      var pt = fpPultErmek(x), ps = tallerOsszeg(pt); hangGomb();
      mondd(pt.length ? fpSzamol(pt) + (ps === x.d.ar ? " Pont annyi." : ps < x.d.ar ? " Ez kevés." : " Ez sok.") : "Tegyél érméket a pultra!");
      return;
    }
    if (g && (x.lep === "fizet" || x.lep === "mas")) { if (g.getAttribute("data-g") === "tovabb") { hangGomb(); fpVege(x, "Pont annyi. Köszönöm!"); } else fpFizet(x); return; }
    if (m && x.lep === "ok") { fpOk(x, +m.getAttribute("data-v")); return; }
    if (tal && x.lep === "fizet" && fpTalVan(x.d)) { hangGomb(); fpNemLehet(x); }   /* a tálra koppintás is beteszi a cédulát */
  },
  bekuld: function () {},
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele lépésenként */
    var x = JL.f.zs, d = x.d, L = x.lep, q = function (s) { return "#jl-svg " + s; };
    if (L === "fizet" && d.nem) return { katt: [q('.jl-fog[data-fog="ced"]'), q('.jl-hely[data-hely="tal"]')], rossz: q('.zs-gomb[data-g="fizet"]') };
    if (L === "okk") {
      var rk = FP_OKOK.filter(function (k) { return !fpOkIgaz(d, k) && x.okRossz.indexOf(k) < 0; });
      return { katt: [q('.fp-okk[data-ok="' + FP_OKOK.filter(function (k) { return fpOkIgaz(d, k); })[0] + '"]')], rossz: rk.length ? q('.fp-okk[data-ok="' + rk[0] + '"]') : null };
    }
    if (L === "bln") {
      var ert = d.allit[x.ai].ert;
      return { katt: [q('.fp-btal[data-t="' + ert + '"]')], rossz: q('.fp-btal[data-t="' + (ert === "l" ? "b" : "l") + '"]') };
    }
    if (L === "ok") {
      var lo = Math.floor(d.ar / d.cim) * d.cim;
      return { katt: [q('.fp-megallo[data-v="' + lo + '"]'), q('.fp-megallo[data-v="' + (lo + d.cim) + '"]')] };
    }
    if (L === "fizet") {   /* az első pontos fizetés érméi a pultra (a már kint lévők vissza), aztán „Fizetek”; rossz: a cédula a tálba */
      var jo = fpJok(d.erszeny, d.ar).filter(function (j) { return d.forma !== "ennyi" || j.split("+").length === d.n; })[0].split("+").map(Number), hasz = [], ki = [];
      jo.forEach(function (v) { for (var i = 0; i < d.erszeny.length; i++) if (d.erszeny[i] === v && hasz.indexOf(i) < 0) { hasz.push(i); return; } });
      x.pult.forEach(function (i) { if (hasz.indexOf(i) < 0) ki.push(q('.jl-fog[data-fog="p-' + i + '"]'), q('.zs-erszeny-hely')); });
      hasz.forEach(function (i) { if (x.pult.indexOf(i) < 0) ki.push(q('.jl-fog[data-fog="p-' + i + '"]'), q('.jl-hely[data-hely="pult"]')); });
      return { katt: ki.concat([q('.zs-gomb[data-g="fizet"]')]), rossz: fpTalVan(d) ? q('.fp-tal') : null };
    }
    if (L === "mas") return { katt: [q('.zs-gomb[data-g="tovabb"]')] };
    return { katt: [] };
  }
};

/* ═════════════════ RAJZ (a munka-doboz: 290 × 430) ═════════════════ */
function fpTalVan(d) { return d.forma !== "ennyi" && d.forma !== "bln"; }   /* a „Nem lehet” tál: ahol mindig lehet, ott nincs */
function fpRajz(JL) {
  var x = JL.f.zs, d = x.d, s = '', aktiv = (x.lep === "fizet" || x.lep === "mas" || x.lep === "bln") && !JL.lezart, tv = fpTalVan(d), bln = d.forma === "bln";
  /* a tárgy a cédulával (a cédula felvehető: a „Nem lehet” tálba tehető) */
  s += zsKacat(d.aru[0], 36, 76, 0);
  if (!x.tal && x.fog !== "ced") s += '<g' + (tv && x.lep === "fizet" && !JL.lezart ? ' class="jl-fog" data-fog="ced" data-m="1" style="cursor:pointer"' : '') + '>' + kfCedula(96, 14, d.ar, 1.15) + '</g>';
  /* a „Nem lehet” tál (jobbra fent) · ④-ben a tábla és a három tál */
  s += fpHangGomb();
  if (bln) s += fpBlnRajz(JL, x);
  else if (tv) s += '<g class="fp-tal" style="cursor:pointer"><rect class="jl-hely" data-hely="tal" x="186" y="26" width="98" height="78" rx="12" fill="#fff" fill-opacity="' + (x.lep === "fizet" && !JL.lezart ? .3 : 0) + '" stroke="' + (x.lep === "fizet" && !JL.lezart ? "#e6b3c4" : "none") + '" stroke-dasharray="6 5"/>' +
       '<g filter="url(#lt-firka)"><path d="M190 62Q235 96 280 62Z" fill="#f6d3df" stroke="#b5607e" stroke-width="2"/><ellipse cx="235" cy="62" rx="45" ry="9" fill="#fbe7ee" stroke="#b5607e" stroke-width="2"/></g>' +
       zsSzoveg(235, 98, "Nem lehet", 15, "#b5607e", "middle") + '</g>';
  if (x.tal) s += '<g transform="translate(235 24) rotate(-6)">' + kfCedula(0, 0, d.ar, .9) + '</g>';
  if (!bln) {
    /* az üres kassza, a fedelén Zsivány táblája (a szabály az első mozdulat előtt látszik) */
    s += kfKassza(100, 150, .74, FP_URES, x.vilagit);
    s += '<g transform="translate(98 128) rotate(-2)"><g filter="url(#lt-firka)"><rect x="-80" y="-19" width="160" height="38" rx="5" fill="#fffaf0" stroke="#b5804a" stroke-width="1.8"/></g>' +
         '<circle cx="-72" cy="-12" r="2" fill="#b5804a"/><circle cx="72" cy="-12" r="2" fill="#b5804a"/>' +
         zsSzoveg(0, -3, "Üres a kasszám!", 14, "#b35f28", "middle") + zsSzoveg(0, 13, d.forma === "ennyi" ? "Pontosan, " + d.n + " érmével!" : "Pontosan fizess!", 13, "#4a3b7a", "middle") + '</g>';
  }
  /* az ugró-szalag: ① mindig · ② és ennyi: 2 hiba után · ③ ④: soha · Odú-küszöb: csak az indoklásnál */
  var szalag = x.lep === "ok" || !x.halvany && (d.forma === "egyforma" || x.hib >= 2 && (d.forma === "pontos" || d.forma === "ennyi"));
  if (szalag) s += fpSzalag(JL, x);
  if (x.lep === "okk" || x.lep === "kesz" && d.forma === "lehet" && x.tal) return s + fpOkkRajz(JL, x) + fpErszenyRajz(x, false);
  /* a pult: kockás terítő (ide kerülnek az érmék) */
  s += '<rect class="jl-hely" data-hely="pult" x="6" y="240" width="176" height="92" rx="12" fill="#fdeeee" stroke="' + (aktiv ? "#d98c8c" : "#efc9c9") + '" stroke-width="2"' + (aktiv ? ' stroke-dasharray="6 5"' : '') + '/>';
  for (var cx = 26; cx < 180; cx += 26) s += '<path d="M' + cx + ' 242V330" stroke="#f6c9c9" stroke-width="9" opacity=".55" pointer-events="none"/>';
  for (var cy = 258; cy < 330; cy += 26) s += '<path d="M8 ' + cy + 'H180" stroke="#f6c9c9" stroke-width="9" opacity=".55" pointer-events="none"/>';
  x.pult.forEach(function (j, k) {
    if (x.fog === j) return;
    var P = FP_PULT(k);
    s += kfTaller(P[0], P[1], d.erszeny[j], .85, aktiv ? ' class="jl-fog" data-fog="p-' + j + '" data-m=".85"' : '');
  });
  if (x.mutat) s += fpMutatRajz(x);
  if (x.hib >= 2 && x.pult.length && x.lep !== "ok" && !bln) s += zsSzoveg(178, 236, "kint: " + tallerOsszeg(fpPultErmek(x)), 14, "#8a7a9e", "end");   /* a pult széle (2 hiba után) */
  if (aktiv) s += bln ? zsGomb(238, 286, 84, "szamol", "Számold", "#3f9e6a") : zsGomb(238, 286, 84, "fizet", "Fizetek", "#3f9e6a");
  s += fpErszenyRajz(x, aktiv);
  if (x.lep === "mas" && !JL.lezart) s += zsGomb(256, 404, 62, "tovabb", "Tovább", "#7a5ca8");
  return s;
}
/* 🔊 a pálya hanggal megy (Zsivány mondja el a feladatot): a hangszóró mindig ott van, koppintásra újra elmondja (a producer, 11-08) */
function fpHangGomb() {
  return '<g class="fp-hang" style="cursor:pointer" transform="translate(166 96)"><circle r="14" fill="#fffaf0" stroke="#7a5ca8" stroke-width="2.2"/>' +
    '<path d="M-7 -3H-3L3 -8V8L-3 3H-7Z" fill="#7a5ca8"/><path d="M6 -5Q10 0 6 5" fill="none" stroke="#7a5ca8" stroke-width="1.8" stroke-linecap="round"/></g>';
}
/* az erszény: minden érme látszik, a helyük állandó (index szerint), a visszalebegők a pultról jönnek */
function fpErszenyRajz(x, aktiv) {
  var d = x.d, s = '<rect class="jl-hely zs-erszeny-hely" data-hely="erszeny" x="6" y="338" width="230" height="92" fill="transparent"/>' + kfErszeny(34, 428, .8, "");
  d.erszeny.forEach(function (v, j) {
    if (x.pult.indexOf(j) >= 0 || x.fog === j) return;
    var E = FP_ERSZ(j), k = x.lebeg ? x.lebeg.indexOf(j) : -1, c = kfTaller(E[0], E[1], v, .85, aktiv ? ' class="jl-fog" data-fog="p-' + j + '" data-m=".85"' : '');
    if (k >= 0) { var P = FP_PULT(k); c = zsLebeg(P[0] - E[0], P[1] - E[1], c); }
    s += c;
  });
  return s;
}
/* ③ a három okkártya a pult helyén (rajzocskával); a rossz áthúzva, halványan */
function fpOkkRajz(JL, x) {
  var s = '', szov = { keves: ["Kevés", "az egész."], paros: ["Csupa", "páros érme."], otos: ["Csak", "ötösével."] };
  FP_OKOK.forEach(function (ok, i) {
    var X = 8 + i * 94, Y = 236, rossz = x.okRossz.indexOf(ok) >= 0, jo = x.lep === "kesz" && fpOkIgaz(x.d, ok);
    s += '<g class="fp-okk" data-ok="' + ok + '" style="cursor:pointer" opacity="' + (rossz ? .4 : 1) + '"><g filter="url(#lt-firka)"><rect x="' + X + '" y="' + Y + '" width="86" height="96" rx="10" fill="#fffaf0" stroke="' + (jo ? "#3f9e6a" : "#b5804a") + '" stroke-width="' + (jo ? 3.2 : 2) + '"/></g>';
    if (ok === "keves") s += kfTaller(X + 20, Y + 30, 1, .38, '') + kfTaller(X + 34, Y + 26, 2, .38, '') + '<path d="M' + (X + 52) + ' ' + (Y + 40) + 'V' + (Y + 12) + '" stroke="#e0417a" stroke-width="2" stroke-dasharray="3 3"/>' + zsSzoveg(X + 66, Y + 30, "?", 18, "#e0417a", "middle");
    else if (ok === "paros") s += zsSzoveg(X + 43, Y + 32, "2, 4, 6 …", 14, "#5f84b0", "middle");
    else s += zsSzoveg(X + 43, Y + 32, "5, 10, 15 …", 14, "#5f84b0", "middle");
    s += zsSzoveg(X + 43, Y + 64, szov[ok][0], 14, "#4a3b7a", "middle") + zsSzoveg(X + 43, Y + 82, szov[ok][1], 14, "#4a3b7a", "middle");
    if (rossz) s += '<path d="M' + (X + 8) + ' ' + (Y + 88) + 'L' + (X + 78) + ' ' + (Y + 8) + '" stroke="#c0465a" stroke-width="3" stroke-linecap="round"/>';
    s += '</g>';
  });
  return s;
}
/* ④ a soron lévő állítás kártyája (felvehető) */
function fpAllitKartya(x, X, Y) {
  var a = x.d.allit[Math.min(x.ai, 2)];
  return '<g filter="url(#lt-firka)"><rect x="' + X + '" y="' + Y + '" width="278" height="46" rx="10" fill="#fffaf0" stroke="#7a5ca8" stroke-width="2.2"/></g>' +
    zsSzoveg(X + 139, Y + 29, "„" + a.szoveg + "”", 16, "#4a3b7a", "middle");
}
/* ④ a tábla (jobbra fent), az állítás, a három tál a betett kártyácskákkal */
function fpBlnRajz(JL, x) {
  var s = '', T = [["b", "Biztos", "#3f9e6a"], ["l", "Lehet", "#5f84b0"], ["n", "Lehetetlen", "#b5607e"]];
  s += '<g transform="translate(232 54) rotate(2)"><g filter="url(#lt-firka)"><rect x="-54" y="-30" width="108" height="60" rx="6" fill="#fffaf0" stroke="#b5804a" stroke-width="1.8"/></g>' +
       zsSzoveg(0, -8, "Pontosan", 14, "#b35f28", "middle") + zsSzoveg(0, 10, "fizették,", 14, "#b35f28", "middle") + zsSzoveg(0, 26, "nincs vissza.", 12, "#4a3b7a", "middle") + '</g>';
  s += zsSzoveg(270, 106, Math.min(x.ai + 1, 3) + " / 3", 13, "#8a7a9e", "end");
  if (x.ai < 3 && x.fog !== "all") s += '<g' + (x.lep === "bln" && !JL.lezart ? ' class="jl-fog" data-fog="all" data-m="1" style="cursor:pointer"' : '') + '>' + fpAllitKartya(x, 6, 112) + '</g>';
  T.forEach(function (t, i) {
    var X = 6 + i * 96, n = x.betett.filter(function (b) { return b === t[0]; }).length, nyit = x.lep === "bln" && !JL.lezart;
    s += '<g class="fp-btal" data-t="' + t[0] + '" style="cursor:pointer"><rect class="jl-hely" data-hely="' + t[0] + '" x="' + X + '" y="164" width="88" height="70" rx="12" fill="#fff" fill-opacity="' + (nyit ? .3 : 0) + '" stroke="' + (nyit ? t[2] : "none") + '" stroke-dasharray="6 5"/>' +
         '<g filter="url(#lt-firka)"><path d="M' + (X + 8) + ' 192Q' + (X + 44) + ' 222 ' + (X + 80) + ' 192Z" fill="#fbf3e4" stroke="' + t[2] + '" stroke-width="2"/><ellipse cx="' + (X + 44) + '" cy="192" rx="36" ry="7" fill="#fffaf0" stroke="' + t[2] + '" stroke-width="2"/></g>';
    for (var k = 0; k < n; k++) s += '<rect x="' + (X + 26 + k * 12) + '" y="' + (176 - k * 3) + '" width="26" height="16" rx="3" fill="#fffaf0" stroke="#7a5ca8" stroke-width="1.4" transform="rotate(' + (k * 8 - 6) + ' ' + (X + 39 + k * 12) + ' 184)"/>';
    s += zsSzoveg(X + 44, 228, t[1], 14, t[2], "middle") + '</g>';
  });
  return s;
}
/* ④ rossz „lehet” után: az összes pontos fizetés a pulton, ✓ ahol igaz, ✗ ahol nem */
function fpMutatRajz(x) {
  var s = '<rect x="10" y="244" width="168" height="84" rx="8" fill="#fffef6" opacity=".92"/>';
  x.mutat.forEach(function (m, k) {
    var y = 262 + k * 19;
    s += zsSzoveg(18, y, m.f.join(" + "), 14, "#4a3b7a") + zsSzoveg(170, y, m.j ? "✓" : "✗", 15, m.j ? "#3f9e6a" : "#c0465a", "end");
  });
  return s;
}
/* az ugró-szalag 0-tól: a cédula (az ár) rózsaszín jellel áll rajta; a pultra tett érmék a nagyobbtól ugranak (ív, az érme az ív tetején).
   Indoklásnál (ok) a címlet minden megállója koppintható pötty. Szám csak a 0-nál és a kerek tízeseknél. */
function fpSzalag(JL, x) {
  var d = x.d, t = x.lep === "ok" ? [] : fpPultErmek(x), S = tallerOsszeg(t), c = d.cim || 5;
  var hi = Math.ceil(Math.max(d.ar + (d.forma === "egyforma" ? c : 4), S) / 10) * 10, x0 = 16, x1 = 276, e = (x1 - x0) / hi, Y = 216, i, s = '';
  var px = function (n) { return x0 + n * e; };
  s += '<path d="M' + x0 + ' ' + Y + 'H' + x1 + '" stroke="#c9b48a" stroke-width="5" stroke-linecap="round"/>';
  for (i = 0; i <= hi; i++) { var tz = i % 10 === 0; if (e >= 3.5 || tz) s += '<path d="M' + pcF(px(i)) + ' ' + (Y - (tz ? 8 : 4)) + 'V' + (Y + (tz ? 8 : 4)) + '" stroke="#a8936a" stroke-width="' + (tz ? 2 : 1.1) + '"/>'; if (tz && (hi <= 50 || i % 20 === 0 || i === hi)) s += zsSzoveg(pcF(px(i)), Y + 20, String(i), 11, "#5f84b0", "middle"); }
  /* a cédula jele: szaggatott rózsaszín vonal, fölötte az ár */
  s += '<path d="M' + pcF(px(d.ar)) + ' ' + (Y - 30) + 'V' + (Y + 6) + '" stroke="#e0417a" stroke-width="2" stroke-dasharray="3 3"/>' +
       '<rect x="' + pcF(px(d.ar) - 13) + '" y="' + (Y - 44) + '" width="26" height="15" rx="3" fill="#fffef6" stroke="#e0417a" stroke-width="1.4"/>' + zsSzoveg(pcF(px(d.ar)), Y - 32.5, String(d.ar), 11, "#e0417a", "middle");
  if (x.lep === "ok") {   /* a címlet megállói: halvány ugrások + koppintható pöttyök */
    for (i = 0; i + c <= hi; i += c) s += '<path d="M' + pcF(px(i)) + ' ' + (Y - 3) + 'Q' + pcF(px(i + c / 2)) + ' ' + (Y - 18) + ' ' + pcF(px(i + c)) + ' ' + (Y - 3) + '" fill="none" stroke="#c9b6dc" stroke-width="1.6"/>';
    for (i = 0; i <= hi; i += c) { var val = x.okVal.indexOf(i) >= 0; s += '<g class="fp-megallo" data-v="' + i + '" style="cursor:pointer"><circle cx="' + pcF(px(i)) + '" cy="' + Y + '" r="11" fill="transparent"/><circle cx="' + pcF(px(i)) + '" cy="' + Y + '" r="' + (val ? 7 : 5.5) + '" fill="' + (val ? "#e0417a" : "#fffaf0") + '" stroke="#7a5ca8" stroke-width="2"/></g>'; }
    return s;
  }
  var p = 0;
  t.forEach(function (v, k) {
    var a = px(p), b = px(p + v), cy = Y - 8 - Math.min(26, 6 + v * e * .3);
    s += '<path d="M' + pcF(a) + ' ' + (Y - 4) + 'Q' + pcF((a + b) / 2) + ' ' + pcF(cy) + ' ' + pcF(b) + ' ' + (Y - 4) + '" fill="none" stroke="' + (k % 2 ? "#5f92d0" : "#f2708f") + '" stroke-width="2.6" stroke-linecap="round"/>';
    s += kfTaller((a + b) / 2, (Y - 4 + cy) / 2 - 4, v, .5, '');
    p += v;
  });
  if (t.length) s += '<path d="M' + pcF(px(p)) + ' ' + (Y + 4) + 'l-6 11h12Z" fill="#7a5ca8"/>';   /* ide ért a szalag (szám nélkül) */
  return s;
}

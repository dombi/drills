/* ============ 6s3) 🧺 „ELŐBB AZ EGÉSZ” — a szerszám tartalma (Mesekönyv + Varázstekercs) ============
   Terv: Matekos\szerszam-letrak-terv.html (✅) · tartalom: …-tartalom.html 4. pont (✅ 2026-10-09) ·
   átnézés: …-egesz-mit-atnezes.html (✅ 2026-10-16, mind az 5 döntés) · rajz: …-egesz-rajzterv.html (✅ 2026-10-16, mind a 4 döntés).
   1. kód-kör (2026-10-16): 📖 Mesekönyv (5) + 📜 Varázstekercs (a, a, b, a). 2. kód-kör (2026-10-16): a Tekercs 5. feladata, a 🐪 (c)
   rakodás, és a 3 🏅 Mesterpróba — szerszam-egesz-mester.js (+ rakodas.js).

   Az olvasó-polc motorján fut (olvaso-polc.js: polcMutat / polcJo / polcHiba / lift / végigvezetés) — a feladatok f.polc = "EGESZ"-t
   kapnak, a pálya viszont SZERSZÁM-pálya (pa.szerszam = "EGESZ": a szekrényben áll, a pálya végét a szPalyaVege adja).
   A rajz a közös kosár (kosar.js).

   📖 MESEKÖNYV — három kérdés egymás után, ugyanazon a lapon (átnézés 4. pont, ✅ kérdés-szótár):
     🪜 Hány … van összesen?  →  🪜 Hány … jut egyikőjüknek?  →  🎯 Hány …-t ad X Y-nak?
     A 🎯 nagy kérdés az első pillanattól látszik (lilával, a lap alján); a 🪜 lépcsőfokok fölötte jönnek egyenként.
   📜 TEKERCS — csak a 🎯. (a) 3 gyerek osztozik · (b) közös persely: ugyanannyi pénz ÉS ugyanannyi érme.
     🙋 első sora: „🧺 Tedd a kosárba!” (utána a jó válasz nem önálló, 2. döntés ✅) · 🛗 lift: ugyanez kicsiben, 🪜 lépcsőfokokkal.
   ✋ lépcsőfok-jelzés (olvaso-ellenor.js): a nagy kérdésnél az összes és az egy főre jutó szám = lépcsőfok, nem hiba.
   Egyértelműség (átnézés 2. pont): az összes, az egy főre jutó és a válasz különböző, és egyik sem szerepel a mesében;
   pontosan EGY gyereknek van több az átlagnál (ő ad), senkinek nincs eleve annyi, amennyi jut. */

var SEG_KERET = {
  golyo:     { t: "golyó", tAcc: "golyót", birt: "golyójuk", ige: "talált", kuld: "golyókat találtak" },
  matrica:   { t: "matrica", tAcc: "matricát", birt: "matricájuk", ige: "kapott", kuld: "matricákat kaptak" },
  gesztenye: { t: "gesztenye", tAcc: "gesztenyét", birt: "gesztenyéjük", ige: "szedett", geszt: true, kuld: "gesztenyét szedtek" },
  persely:   { t: "forint", tAcc: "forintot", birt: "forintjuk", penz: true, kuld: "pénzt gyűjtöttek" }
};
/* a szereplők: a játék saját állatai (grafika-vázlat 3. döntés ✅, 2026-10-16) — FIGURA-kulcs; a név, a „-nak/-nek” és a teljes név a FIGURA-táblából */
var SEG_ALLATOK = ["mia", "samu", "brumi", "cincin", "brekus", "kata", "tas", "potyi", "bence", "kitti", "pali", "juli", "cirmi", "bogyo"];
var SEG_MESE_N = [2, 2, 3, 2, 3];                 /* a Mesekönyv 5 feladata: hány gyerek osztozik */
var SEG_TEK_FORMA = ["a", "a", "b", "a", "c"];    /* a Tekercs 5 feladata — (c): 🐪 rakodás (szerszam-egesz-mester.js) */
/* 🖊️ lektorra — a bagoly mondatai */
var SEG_M = {
  lepcsofok: "Ez egy lépcsőfok: felvisz a nagy kérdéshez.",
  nagy: "Most jön a nagy kérdés!",
  kuldetes: function (nevek, mit) { return szkLista(nevek) + " " + mit + "! Segíts nekik igazságosan elosztani!"; },
  harom: "Három lépésben megyünk.",
  sorszam: ["", "Most a második!", "Most a harmadik!", "Most a negyedik!"],
  osszesJo: function (x) { return "Igen, összesen " + x + ". Mind a kosárba került."; },
  egyJo: "Igen! Nézd a tálkákat: ami sok, sárgán villog, az üres helyen lila karika.",
  mesevege: function (e, t) { return "Ügyes! Most már mindenkinek " + e + " " + t + " jut."; },
  tekVege: function (o, e, t) { return "Összesen " + o + ", egyikőjüknek " + e + " " + t + " jut."; },
  egyGyereke: "Ez csak egyikőjüké. Mennyi van mindenkinél együtt?",
  ezAzOssz: "Ez az összes. Most oszd el: hány jut egyikőjüknek?",
  kozOssz: function (t) { return "Ez egy lépcsőfok volt: ennyi " + t + " van összesen. De mit kérdeztek?"; },
  kozEgy: "Ez egy lépcsőfok volt: ennyi jut egyikőjüknek. De mit kérdeztek?",
  kulonbseg: function (a, b, bnak) { return "Ez a különbség " + a + " és " + b + " között. Ha ennyit adna, " + bnak + " lenne több! Nézd meg: mennyi jut egyikőjüknek?"; },
  adOssz: function (a, b) { return "Ennyit ad " + a + " a két társának együtt. De mennyit kap " + b + "?"; },
  visszaA: "Ügyes! Ugyanaz, csak hárman osztoznak. Előbb az összes, aztán mennyi jut egyikőjüknek.",
  visszaB: "Ügyes! Ugyanaz, csak több érmével. Előbb az összes pénz, aztán az összes érme."
};
POLC_DICSER.EGESZ = ["Előbb az egész – pontosan!", "Mindenkinek ugyanannyi jut – ügyes!", "Ez az! Előbb az összes, aztán egy főre."];   /* 🖊️ lektorra */

/* ── segédek ── */
function segNevek(n) {                                     /* n szereplő, különböző kezdőbetűvel: [név, -nak/-nek, FIGURA-kulcs, teljes név] */
  var L = mKever(SEG_ALLATOK), ki = [], betu = {};
  for (var i = 0; i < L.length && ki.length < n; i++) { var F = FIGURA[L[i]], b = F.n.charAt(0); if (!betu[b]) { betu[b] = 1; ki.push([F.n, F.nak, L[i], F.tel]); } }
  return ki;
}
function segKeret(elozo) { return ekE(Object.keys(SEG_KERET).filter(function (k) { return k !== elozo; })); }
/* egy osztozkodás: c (darab, pénznél 10 forintos érme), T összesen, E egy főre, g aki ad, r akiről a kérdés szól, v a válasz */
function segOsztas(n, o) {
  for (var t = 0; t < 2000; t++) {
    var c = [], T = 0;
    for (var i = 0; i < n; i++) { c.push(ekR(o.min, o.max)); T += c[i]; }
    if (T % n || T > o.maxT || T < o.minT) continue;
    var E = T / n;
    if (c.indexOf(E) >= 0) continue;
    var g = -1, nagyobb = 0;
    c.forEach(function (x, k) { if (x > E) { nagyobb++; g = k; } });
    if (nagyobb !== 1) continue;
    var R = []; c.forEach(function (x, k) { if (k !== g) R.push(k); });
    var r = ekE(R), v = E - c[r], d = c[g] - c[r], adO = c[g] - E;
    var foglalt = [T, E, v];
    if (foglalt[0] === foglalt[1] || foglalt[1] === foglalt[2] || foglalt[0] === foglalt[2]) continue;
    if (c.indexOf(T) >= 0 || c.indexOf(v) >= 0) continue;
    if (foglalt.indexOf(d) >= 0) continue;
    return { c: c, T: T, E: E, g: g, r: r, v: v, d: d, adO: adO };
  }
  return null;
}
/* az oe-étlap egy kulcsa csak egyszer (a válasz sosem lehet kulcs) */
function segOeAdd(oe, fajta, n, m, valasz) {
  if (n === valasz || n == null) return;
  if (oe.koztes[n] || oe.masik[n] || oe.csap[n]) return;
  oe[fajta][n] = { m: m };
}
function segUresOe(szo) { return { szo: szo || "", koztes: {}, masik: {}, csap: {} }; }

/* ── egy osztozkodós mese (Mesekönyv, Tekercs a, és a lift kicsije) ── */
function segOsztoMese(keret, n, o) {
  var K = SEG_KERET[keret], u = K.penz ? 10 : 1, x = segOsztas(n, o);
  if (!x) return null;
  var nev = segNevek(n), N = nev.map(function (a) { return a[0]; }), c = x.c.map(function (y) { return y * u; });
  var T = x.T * u, E = x.E * u, v = x.v * u, d = x.d * u, A = N[x.g], B = N[x.r], Bnak = nev[x.r][1];
  var m1;
  if (K.penz) m1 = nev.map(function (a, k) { return a[3] + " perselyében " + c[k] + " forint" + (k === 0 ? " van" : ""); }).join(", ") + ".";
  else m1 = nev.map(function (a, k) { return a[3] + " " + c[k] + " " + K.tAcc + (k === 0 ? " " + K.ige : ""); }).join(", ") + ".";
  var mondatok = [m1];
  if (K.penz) mondatok.push("Mindenki 10 forintosokat gyűjt.");
  mondatok.push("Úgy osztják el, hogy " + (n === 2 ? "mindkettőjüknek" : "mindhármuknak") + " ugyanannyi " + (K.penz ? "pénze " : "") + "legyen.");
  var Q = "Hány " + K.tAcc + " ad " + A + " " + Bnak + "?";
  var oe = segUresOe("hány " + K.tAcc + " ad " + A + " " + Bnak);
  segOeAdd(oe, "koztes", T, SEG_M.kozOssz(K.t), v);
  segOeAdd(oe, "koztes", E, SEG_M.kozEgy, v);
  segOeAdd(oe, "csap", d, SEG_M.kulonbseg(A, B, Bnak), v);
  if (n > 2) segOeAdd(oe, "csap", x.adO * u, SEG_M.adOssz(A, B), v);
  var oe1 = segUresOe(""), oe2 = segUresOe("");
  c.forEach(function (y) { segOeAdd(oe1, "csap", y, SEG_M.egyGyereke, T); });
  segOeAdd(oe2, "csap", T, SEG_M.ezAzOssz, E);
  var lepcso = [
    { k: "Hány " + K.birt + " van összesen?", v: T, m: c.join(" + ") + " = " + T, oe: oe1, uto: SEG_M.osszesJo(T) },
    { k: "Hány " + K.t + " jut egyikőjüknek?", v: E, m: T + " : " + n + " = " + E, oe: oe2, uto: "Igen! Egyikőjüknek " + E + " " + K.t + " jut. " + SEG_M.egyJo.replace(/^Igen! /, "") }
  ];
  var kos = { gy: nev.map(function (a, k) { return { nev: a[0], k: a[2], n: x.c[k] }; }), egy: x.E, egyseg: K.penz ? "10" : "", gesztenye: !!K.geszt, kezd: "kupac",
    vOssz: T, vEgy: E, szamOssz: T + (K.penz ? " Ft" : ""), szamEgy: T + " = " + N.map(function () { return E; }).join(" + ") + (K.penz ? " Ft" : ""), cimkeEgy: E + (K.penz ? " Ft" : "") };
  return { keret: keret, mondatok: mondatok, kerdes: Q, helyes: v, oe: oe, lepcso: lepcso, kosar: kos,
    lep: lepcso.map(function (l) { return { k: l.k, v: l.v, m: l.m }; }).concat([{ k: Q, v: v, m: E + " − " + c[x.r] + " = " + v }]),
    mit: ["hány " + K.tAcc + " ad " + A + " " + Bnak, "hány " + K.t + " jut egyikőjüknek", "hány " + K.t + " van összesen"],
    kuld: SEG_M.kuldetes(N, K.kuld), uto: SEG_M.mesevege(E, K.t), utoNagy: SEG_M.tekVege(T, E, K.t) };
}
/* ── a közös persely (Tekercs b): ugyanannyi pénz ÉS ugyanannyi érme ── */
function segPerselyMese(fix) {
  var L = [];
  [2, 4, 6].forEach(function (a) { [2, 4, 6].forEach(function (b) { [20, 10].forEach(function (t) {
    var V = 20 * a + 10 * b, C = a + b, v = (t === 20 ? a : b) / 2, koz = [V, V / 2, C, C / 2];
    if (koz.indexOf(v) >= 0 || v === a || v === b) return;
    if (koz[0] === koz[1] || koz[2] === koz[3] || koz[1] === koz[2]) return;
    L.push({ a: a, b: b, t: t, V: V, C: C, v: v });
  }); }); });
  var x = fix || ekE(L), nev = segNevek(2), A = nev[0][0], B = nev[1][0];
  var mondatok = [nev[0][3] + " és " + nev[1][3] + " a perselyben " + x.a + " darab 20 forintost és " + x.b + " darab 10 forintost talált.",
    "Úgy osztják el, hogy mindketten ugyanannyi pénzt és ugyanannyi érmét kapjanak."];
  var Q = "Hány " + x.t + " forintost kap " + A + "?";
  var oe = segUresOe("hány " + x.t + " forintost kap " + A);
  segOeAdd(oe, "koztes", x.V, "Ez egy lépcsőfok volt: ennyi pénzt találtak összesen. De mit kérdeztek?", x.v);
  segOeAdd(oe, "koztes", x.V / 2, "Ez egy lépcsőfok volt: ennyi pénz jut egyikőjüknek. De mit kérdeztek?", x.v);
  segOeAdd(oe, "koztes", x.C, "Ez egy lépcsőfok volt: ennyi érmét találtak összesen. De mit kérdeztek?", x.v);
  segOeAdd(oe, "koztes", x.C / 2, "Ez egy lépcsőfok volt: ennyi érme jut egyikőjüknek. De mit kérdeztek?", x.v);
  segOeAdd(oe, "csap", x.t === 20 ? x.a : x.b, "Ennyi " + x.t + " forintost találtak ketten együtt. Mennyit kap " + A + "?", x.v);
  var ermek = [], i, k1 = [], k2 = [];
  for (i = 0; i < x.a; i++) { ermek.push("20"); (i < x.a / 2 ? k1 : k2).push(ermek.length - 1); }
  for (i = 0; i < x.b; i++) { ermek.push("10"); (i < x.b / 2 ? k1 : k2).push(ermek.length - 1); }
  var tobb = {}; tobb[x.C] = x.C + " érme"; tobb[x.C / 2] = x.C + " = " + x.C / 2 + " + " + x.C / 2 + " érme";
  var kos = { gy: [{ nev: A, k: nev[0][2], n: 0 }, { nev: B, k: nev[1][2], n: 0 }], ermek: ermek, kioszt: [k1, k2], egy: x.C / 2, kezd: "kosar",
    vOssz: x.V, vEgy: x.V / 2, szamOssz: x.V + " Ft", szamEgy: x.V + " = " + x.V / 2 + " + " + x.V / 2 + " Ft", tobb: tobb, cimkeEgy: x.V / 2 + " Ft" };
  var lepcso = [
    { k: "Hány forint jut egyikőjüknek?", v: x.V / 2, m: x.V + " : 2 = " + x.V / 2, oe: segUresOe(""), uto: "Igen! Egyikőjüknek " + x.V / 2 + " forint jut." },
    { k: "Hány érme jut egyikőjüknek?", v: x.C / 2, m: x.C + " : 2 = " + x.C / 2, oe: segUresOe(""), uto: "Igen! Egyikőjüknek " + x.C / 2 + " érme jut." }
  ];
  segOeAdd(lepcso[0].oe, "csap", x.V, SEG_M.ezAzOssz, x.V / 2);
  segOeAdd(lepcso[1].oe, "csap", x.C, "Ez az összes érme. Most oszd el: hány jut egyikőjüknek?", x.C / 2);
  return { keret: "persely2", mondatok: mondatok, kerdes: Q, helyes: x.v, oe: oe, lepcso: lepcso, kosar: kos,
    lep: [{ k: "Hány forintot találtak összesen?", v: x.V, m: x.a + " · 20 + " + x.b + " · 10 = " + x.V },
          { k: "Hány forint jut egyikőjüknek?", v: x.V / 2, m: x.V + " : 2 = " + x.V / 2 },
          { k: "Hány érmét találtak összesen?", v: x.C, m: x.a + " + " + x.b + " = " + x.C },
          { k: "Hány érme jut egyikőjüknek?", v: x.C / 2, m: x.C + " : 2 = " + x.C / 2 },
          { k: Q, v: x.v, m: (x.t === 20 ? x.a : x.b) + " : 2 = " + x.v }],
    mit: ["hány " + x.t + " forintost kap " + A, "hány forint jut egyikőjüknek", "hány érmét találtak összesen"],
    kuld: SEG_M.kuldetes([A, B], "pénzt találtak"),
    uto: "Ügyes! Mindkettőjüknek " + x.V / 2 + " forint jut, " + x.C / 2 + " érmében.", utoNagy: "Összesen " + x.V + " forint és " + x.C + " érme: egyikőjüknek " + x.V / 2 + " forint és " + x.C / 2 + " érme jut." };
}

/* ── a lap: a számozott kérdés-létra (grafika-vázlat 2. döntés ✅) — mindhárom kérdés látszik, MINDIG az aktuális a legnagyobb ── */
function segLetra(M, j) {
  var k = M.lepcso.map(function (l) { return l.k; }).concat([M.kerdes]), ert = M.lepcso.map(function (l) { return l.v; }).concat([M.helyes]);
  return { k: k, ert: ert, most: j, cel: k.length - 1 };
}
/* „A” elrendezés (alap): a jelenet felül, teljes szélességben; „B”: a könyv, a jelenet a jobb lapon — a pult választja (szerszamBeall().kep) */
function segFelul() { return szerszamBeall().kep !== "B"; }
function segOp(M, j, fuzet, N) {
  var L = M.lepcso && M.lepcso.length ? segLetra(M, j) : null;
  var lap = { mondatok: M.mondatok, kerdes: L ? L.k[j] : M.kerdes, letra: L, cel: !L, celAkt: !L };
  if (!fuzet) { lap.rajz = kosarHTML(); lap.segit = true; lap.felul = segFelul(); return lap; }
  return { mondatok: N.op.mondatok, kerdes: N.op.kerdes, cel: true, rajz: kosarHTML(), felul: segFelul(), fuzet: lap };
}
function segNaplo(tipus, k, v) { return { tipus: tipus, kerdes: ekSima(k).slice(0, 60), helyes: v, atlepes: false }; }
/* egy lépcsős lánc: 🪜 … 🪜 → 🎯. o = { mese, kicsi, N (a nagy, ha kicsi), L, elso (a pálya első feladata) } */
function segLanc(M, o) {
  var lanc = [], kos = {}, tip = "sz-egesz-" + (o.kicsi ? "kicsi" : J.palya.fok) + "-" + M.keret;
  for (var k in M.kosar) kos[k] = M.kosar[k];
  M.lepcso.forEach(function (l, j) {
    var op = segOp(M, j, o.kicsi, o.N), O = op.fuzet || op;
    var S = { csalad: "egyenkent", polc: "EGESZ", polcSzerep: o.kicsi ? "kicsi" : "lepes", helyes: l.v, oe: l.oe, jegyMax: 3, op: op, kosar: kos,
      szoveg: ekSima(l.k), felolvas: ekKiejt(M.mondatok.concat([M.kerdes]).join(" ")), megoldas: l.m, keplet: "", tipp: "", lanc: null,
      utoMondat: l.uto, naplo: segNaplo(tip + "-" + (j + 1), l.k, l.v) };
    if (j === 0) { if (o.mese) S.opElo = M.kuld + (o.elso ? " " + SEG_M.harom : ""); if (o.kicsi) S.liftKeres = true; }   /* küldetés-mondat (4. döntés ✅) */
    else { S.csakLepes = true; S.lepFel = ekKiejt((SEG_M.sorszam[j] || "") + " " + l.k); }
    S.kartyaHTML = opKonyv(S.op);
    lanc.push(S);
  });
  var opV = segOp(M, M.lepcso.length, o.kicsi, o.N);
  var F = { csalad: "egyenkent", polc: "EGESZ", polcSzerep: o.kicsi ? "kicsi" : "lepes", helyes: M.helyes, oe: M.oe, jegyMax: 3, op: opV, kosar: kos, M: M,
    szoveg: ekSima(M.kerdes), felolvas: ekKiejt(M.mondatok.concat([M.kerdes]).join(" ")), megoldas: M.lep[M.lep.length - 1].m, keplet: "", tipp: "", lanc: null,
    csakLepes: true, lepFel: ekKiejt(SEG_M.nagy + " " + M.kerdes), utoMondat: M.uto, naplo: segNaplo(tip, M.kerdes, M.helyes) };
  F.kartyaHTML = opKonyv(F.op);
  if (o.kicsi) { F.polcKicsiVeg = true; lanc.forEach(function (S) { S.polcN = o.N; }); F.polcN = o.N; }
  else { F.polcVeg = true; F.polcL = o.L; F.polcN = F; lanc.forEach(function (S) { S.polcN = F; }); }
  lanc.push(F);
  for (var i = 0; i < lanc.length - 1; i++) lanc[i].lanc = [lanc[i + 1]];
  return lanc[0];
}
/* a Tekercs nagy feladata: csak a 🎯 (+ a lift és a végigvezetés anyaga) */
function segNagy(M, L) {
  var N = { csalad: "egyenkent", polc: "EGESZ", polcSzerep: "nagy", polcVeg: true, polcL: L, M: M, helyes: M.helyes, oe: M.oe, jegyMax: 3, lanc: null,
    op: { mondatok: M.mondatok, kerdes: M.kerdes, rajz: kosarHTML(), segit: true, cel: true, celAkt: true, felul: segFelul() }, kosar: M.kosar,
    szoveg: ekSima(M.kerdes), felolvas: ekKiejt(M.mondatok.concat([M.kerdes]).join(" ")), megoldas: M.lep[M.lep.length - 1].m, keplet: "", tipp: "",
    utoMondat: M.utoNagy, kicsiGen: segKicsi, naplo: segNaplo("sz-egesz-tekercs-" + M.keret, M.kerdes, M.helyes) };
  N.kartyaHTML = opKonyv(N.op);
  return N;
}
/* 🛗 a lift kicsije (olvaso-polc.js polcKicsiFeladat hívja): ugyanaz a keret, kevesebb, 🪜 lépcsőfokokkal, a kis füzetben */
function segKicsi(N) {
  var M = N.M, K = null;
  if (M.keret === "persely2") { K = segPerselyMese({ a: 2, b: 4, t: 20, V: 80, C: 6, v: 1 }); N.polcVissza = SEG_M.visszaB; }
  else {
    for (var t = 0; t < 20 && !K; t++) K = segOsztoMese(M.keret, 2, SEG_KERET[M.keret].penz ? { min: 1, max: 5, maxT: 6, minT: 4 } : { min: 1, max: 9, maxT: 14, minT: 4 });
    N.polcVissza = SEG_M.visszaA;
  }
  K.uto = null;
  return segLanc(K, { kicsi: true, N: N });
}

/* ── GEN.szerszam (szerszam-palya.js SZ_SAJAT) ── */
function segFeladat(cfg) {
  if (!J.sz) J.sz = { sz: "EGESZ", eredm: [], L: null };
  if (!J.polc || J.polc.palya !== J.palya.id) J.polc = { palya: J.palya.id, eredm: J.sz.eredm, elozo: null, kezd: J.feladatKesz };
  var i = J.feladatKesz, fok = cfg.fok, M = null, keret, t;
  if (fok === "mester") return segMester();                /* 🏅 2. kód-kör (szerszam-egesz-mester.js) */
  if (fok === "tekercs" && SEG_TEK_FORMA[i % SEG_TEK_FORMA.length] === "c") return segRakTekercs();
  if (fok === "tekercs" && SEG_TEK_FORMA[i % SEG_TEK_FORMA.length] === "b") M = segPerselyMese();
  for (t = 0; t < 40 && !M; t++) {
    keret = segKeret(J.polc.elozo);
    var penz = SEG_KERET[keret].penz;
    if (fok === "tekercs") M = segOsztoMese(keret, 3, penz ? { min: 1, max: 6, maxT: 9, minT: 6 } : { min: 1, max: 20, maxT: 45, minT: 12 });
    else M = segOsztoMese(keret, SEG_MESE_N[i % SEG_MESE_N.length], penz ? { min: 1, max: 8, maxT: 10, minT: 4 } : { min: 1, max: 18, maxT: 30, minT: 6 });
  }
  J.polc.elozo = M.keret;
  var L = liftUj({ sz: "EGESZ", palya: J.palya.id, fok: fok, fid: M.keret });
  L.nagy = fok === "tekercs"; L.kicsiJoKell = 1;
  J.polc.L = L; J.polc.kicsiHiba = 0; J.sz.L = L;
  if (fok === "tekercs") return segNagy(M, L);
  return segLanc(M, { mese: true, L: L, elso: i === 0 });
}
SZ_SAJAT.EGESZ = segFeladat;

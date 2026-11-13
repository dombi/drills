/* ============ 6j4h) 🎀 SZALAGMŰHELY — az egyenlet előszobája (1. kör: a ház + a hód mester + az előszoba, 2026-11-13) ============
   Tervlap: terv/szalag-tervlap.html (✅ 2026-11-13, mind a 13 döntés A) · könyv: memória szalag-konyv-atnezes.
   A KÖZÖS KÉP a mérőléc (sín) a műhely asztalán: szereplőnként egy szalag-sor. A SZÍN a szereplő, a HOSSZ a mennyiség (6. döntés A).
   A gyerek a szöveg mondatait egyenként rakja ki (felvesz–letesz): a polcon egy TEKERCS (darab: a szalag végére kerül) és egy
   KAPOCS (az egész: a szalag fölé kerül), ugyanazzal a számmal — el kell döntenie, melyik kell, és kinek a sorába. Aztán kiszínezi,
   amit kérdeznek (koppint a részre), és csak utána ír számot. Rossz számra a kép a következményt mutatja (kilóg / nem ér el).
   ELŐSZOBA („Rudak a sínen”), 5 állomás + Odú-küszöb:
     ① Legyenek egyformák! (Davidov, szám nélkül) — toldás a rövidebbhez VAGY vágás a hosszabbikból (két jó út)
     ② Mi van a kendő alatt? (1TC 93.) — az első két feladatban rovátkás rudat tesz a kendő alá, aztán a táblára írja; később csak ír
     ③ Rakd ki, amit mond! — változás · rész–egész · összevetés; az ismeretlen helye vándorol (eredmény · változás · kiindulás)
     ④ Melyik a hosszabb? — fordított szöveg (vonatkoztatott ismeretlen): előbb koppint, kinek van több, aztán kirak (2TB 74.)
     ⑤ Hányan ültek fel? (Hejný: Autóbusz) — a postakocsi visszafelé gurul a megállókon, megállónként a gyerek mondja a számot
   🔒 Kiskapu: a darab/kapocs választás és a sor 50%-os volna → minden rossz letevés hibának számít (próba), és a ✨ csak a végső,
   beírt számért jár; a kiszínezés maga nem ad semmit; a vágás helye pontos rovátka; a buszon megállónként kell a szám.
   ⏳ A tervlapból a 2. körre maradt: a ④ utolsó, nyitott feladata (számpárok gyűjtése).
   GYÁRTÓ (tiszta adat): szlFeladat(tipus) → { sorok, lepesek[{ mondat, targy, hova, csali, all }], kerdes{ mondat, cel, all }, helyes }.
   A HÓD MESTER (4. döntés A; a nevét a producer adja): hodSVG(o) — képregényes, kötény, nyakában mérőszalag.
   A HÁZ a Piactér falutérképén: szlTerkepHaz(lepes, J) — fa műhely, tetején szalag-orsó cégér, a kéményről lobogó szalag. */

var SZL_LAKO = "a hód mester";   /* ⏳ a név a producertől jön (az 1. kör megállóján) */

/* az ösvény sátrai (vasar.js vasarJelenetSVG) — szalag-színek */
VS_SZIN.szalag1 = { teto: "#f6c4d2", csik: "#fff", sotet: "#b5607e", cimer: "🎀" };
VS_SZIN.szalag2 = { teto: "#e8d3b4", csik: "#fff", sotet: "#8a6a4a", cimer: "🧣" };
VS_SZIN.szalag3 = { teto: "#c9e7d4", csik: "#fff", sotet: "#5e9a72", cimer: "🧵" };
VS_SZIN.szalag4 = { teto: "#b9c6ec", csik: "#fff", sotet: "#5f6fa8", cimer: "📏" };
VS_SZIN.szalag5 = { teto: "#fce49a", csik: "#fff", sotet: "#c9962a", cimer: "🚌" };

/* ═════════════════ NYELV (számjeggyel írt szám ragjai) ═════════════════ */
/* tárgyrag: 15-öt, 23-at, 20-at, 10-et, 100-at */
function szlT(n) {
  var e = n % 10, t = Math.floor(n / 10) % 10, r;
  if (n === 100) r = "at";
  else if (e) r = { 1: "et", 2: "t", 3: "at", 4: "et", 5: "öt", 6: "ot", 7: "et", 8: "at", 9: "et" }[e];
  else r = { 1: "et", 2: "at", 3: "at", 4: "et", 5: "et", 6: "at", 7: "et", 8: "at", 9: "et" }[t];
  return n + "-" + r;
}
/* -val/-vel, hasonulva: 5-tel, 3-mal, 20-szal, 10-zel, 100-zal */
function szlVal(n) {
  var e = n % 10, t = Math.floor(n / 10) % 10, r;
  if (n === 100) r = "zal";
  else if (e) r = { 1: "gyel", 2: "vel", 3: "mal", 4: "gyel", 5: "tel", 6: "tal", 7: "tel", 8: "cal", 9: "cel" }[e];
  else r = { 1: "zel", 2: "szal", 3: "cal", 4: "nel", 5: "nel", 6: "nal", 7: "nel", 8: "nal", 9: "nel" }[t];
  return n + "-" + r;
}
/* szereplők (a játékosok nevét kerüljük); nak: részeshatározó, e: birtokos („Annáé”) */
var SZL_NEVEK = [
  { n: "Anna", nak: "Annának", e: "Annáé" }, { n: "Bence", nak: "Bencének", e: "Bencéé" }, { n: "Réka", nak: "Rékának", e: "Rékáé" },
  { n: "Dani", nak: "Daninak", e: "Danié" }, { n: "Kata", nak: "Katának", e: "Katáé" }, { n: "Zoli", nak: "Zolinak", e: "Zolié" },
  { n: "Bori", nak: "Borinak", e: "Borié" }, { n: "Máté", nak: "Máténak", e: "Mátéé" } ];
/* tárgyak: b = birtokos („matricája”), t = tárgyeset */
var SZL_DOLGOK = [
  { b: "matricája", t: "matricát" }, { b: "bélyege", t: "bélyeget" }, { b: "golyója", t: "golyót" },
  { b: "gesztenyéje", t: "gesztenyét" }, { b: "kártyája", t: "kártyát" } ];
var SZL_KOSAR = [["alma", "körte", "gyümölcs", "A kosárban"], ["piros gyöngy", "kék gyöngy", "gyöngy", "A dobozban"], ["kislány", "kisfiú", "gyerek", "A játszótéren"]];
/* a sorok színei: [kitöltés, szél] */
var SZL_SZIN = [["#f6a5c0", "#c0567f"], ["#9ec9f0", "#5f84b0"]];

/* ═════════════════ GYÁRTÓ (tiszta adat) ═════════════════
   egy állapot (all) = a sorok rajza: [{ s: [{ id, v, c, sz (szaggatott: „annyi, mint…”), ism (?) , n (felirat alatta) }], k: { id, v, c, ism } | null }]
   egy lépés: a polcról EGY tárgy kell: { t: "d" (tekercs → a sor végére) | "k" (kapocs → a sor fölé), v } a „hova” helyre (r0 · r1 · k0 · k1);
   a csali ugyanaz a szám a másik fajtával, kétsoros feladatnál a másik sor is rossz. */
function szlSeg(id, v, c, o) { o = o || {}; return { id: id, v: v, c: c == null ? String(v) : c, sz: !!o.sz, ism: !!o.ism, n: o.n || "" }; }
function szlKap(id, v, c, ism) { return { id: id, v: v, c: c == null ? String(v) : c, ism: !!ism }; }
function szlLep(mondat, t, v, hova, all) { return { mondat: mondat, targy: { t: t, v: v }, hova: hova, all: all }; }
function szlKet(a, b) { return [a, b]; }
var SZL_TIPUSOK = ["valt-ered", "valt-valt", "valt-kiind", "resz-ered", "resz-resz", "ossz-ered", "ossz-kul"];
function szlFeladat(tipus) {
  var N = keverTomb(SZL_NEVEK.slice()), A = N[0], B = N[1], D = veletlenElem(SZL_DOLGOK), a, b, c, d, L, Q, so, K;
  if (tipus === "valt-ered") {
    a = veletlen(11, 58); b = veletlen(5, Math.min(40, 96 - a)); c = a + b;
    so = [{ nev: A.n }];
    L = [szlLep(A.nak + " " + a + " " + D.b + " volt.", "d", a, "r0", [{ s: [szlSeg("a", a)] }]),
         szlLep("Kapott még " + szlT(b) + ".", "d", b, "r0", [{ s: [szlSeg("a", a), szlSeg("b", b)] }])];
    Q = { mondat: "Hány " + D.b + " lett?", cel: "K", all: [{ s: [szlSeg("a", a), szlSeg("b", b)], k: szlKap("K", c, "?", true) }] };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: c };
  }
  if (tipus === "valt-valt") {
    a = veletlen(11, 58); b = veletlen(5, Math.min(40, 96 - a)); c = a + b;
    so = [{ nev: A.n }];
    L = [szlLep(A.nak + " " + a + " " + D.b + " volt.", "d", a, "r0", [{ s: [szlSeg("a", a)] }]),
         szlLep("Kapott még valahányat, így " + c + " lett.", "k", c, "k0", [{ s: [szlSeg("a", a), szlSeg("x", b, "?", { ism: true })], k: szlKap("K", c) }])];
    Q = { mondat: "Hányat kapott?", cel: "x", all: L[1].all };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: b };
  }
  if (tipus === "valt-kiind") {
    a = veletlen(8, 55); b = veletlen(5, Math.min(40, 96 - a)); c = a + b;
    so = [{ nev: A.n }];
    L = [szlLep(A.nak + " volt néhány " + D.b + ". Kapott még " + szlT(b) + ".", "d", b, "r0", [{ s: [szlSeg("x", a, "?", { ism: true }), szlSeg("b", b)] }]),
         szlLep("Így " + c + " lett.", "k", c, "k0", [{ s: [szlSeg("x", a, "?", { ism: true }), szlSeg("b", b)], k: szlKap("K", c) }])];
    Q = { mondat: "Hány " + D.b + " volt előtte?", cel: "x", all: L[1].all };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: a };
  }
  if (tipus === "resz-ered" || tipus === "resz-resz") {
    K = veletlenElem(SZL_KOSAR); a = veletlen(8, 50); b = veletlen(6, Math.min(45, 96 - a)); c = a + b;
    so = [{ nev: K[2] }];
    if (tipus === "resz-ered") {
      L = [szlLep(K[3] + " " + a + " " + K[0] + " van.", "d", a, "r0", [{ s: [szlSeg("a", a, null, { n: K[0] })] }]),
           szlLep("És " + b + " " + K[1] + ".", "d", b, "r0", [{ s: [szlSeg("a", a, null, { n: K[0] }), szlSeg("b", b, null, { n: K[1] })] }])];
      Q = { mondat: "Hány " + K[2] + " van összesen?", cel: "K", all: [{ s: L[1].all[0].s, k: szlKap("K", c, "?", true) }] };
      return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: c };
    }
    L = [szlLep(K[3] + " " + a + " " + K[0] + " van, a többi " + K[1] + ".", "d", a, "r0", [{ s: [szlSeg("a", a, null, { n: K[0] }), szlSeg("x", b, "?", { ism: true, n: K[1] })] }]),
         szlLep("Összesen " + c + " " + K[2] + " van.", "k", c, "k0", [{ s: [szlSeg("a", a, null, { n: K[0] }), szlSeg("x", b, "?", { ism: true, n: K[1] })], k: szlKap("K", c) }])];
    Q = { mondat: "Hány " + K[1] + " van?", cel: "x", all: L[1].all };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: b };
  }
  if (tipus === "ossz-ered") {
    a = veletlen(10, 55); d = veletlen(4, Math.min(30, 96 - a)); c = a + d;
    so = [{ nev: A.n }, { nev: B.n }];
    L = [szlLep(A.nak + " " + a + " " + D.b + " van.", "d", a, "r0", [{ s: [szlSeg("a", a)] }, { s: [] }]),
         szlLep(B.nak + " " + szlVal(d) + " több van, mint " + A.nak + ".", "d", d, "r1",
           [{ s: [szlSeg("a", a)] }, { s: [szlSeg("c", a, "", { sz: true }), szlSeg("d", d)] }])];
    Q = { mondat: "Hány " + D.b + " van " + B.nak + "?", cel: "K", all: [{ s: [szlSeg("a", a)] }, { s: [szlSeg("c", a, "", { sz: true }), szlSeg("d", d)], k: szlKap("K", c, "?", true) }] };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: c };
  }
  if (tipus === "ossz-kul") {
    a = veletlen(10, 55); d = veletlen(4, Math.min(30, 96 - a)); c = a + d;
    so = [{ nev: A.n }, { nev: B.n }];
    L = [szlLep(A.nak + " " + a + " " + D.b + " van.", "d", a, "r0", [{ s: [szlSeg("a", a)] }, { s: [] }]),
         szlLep(B.nak + " " + c + " van.", "d", c, "r1", [{ s: [szlSeg("a", a)] }, { s: [szlSeg("b", c)] }])];
    Q = { mondat: "Mennyivel több " + D.b + " van " + B.nak + ", mint " + A.nak + "?", cel: "x",
          all: [{ s: [szlSeg("a", a)] }, { s: [szlSeg("c", a, "", { sz: true }), szlSeg("x", d, "?", { ism: true })], k: szlKap("K", c) }] };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: d };
  }
  /* ④ fordított szöveg: a „több / kevesebb” a vonatkoztatott szereplőről szól. ki = kinek a sora a hosszabb */
  a = veletlen(14, 60); d = veletlen(3, Math.min(20, a - 6));
  if (tipus === "vonat-tobb") {   /* „Daninak 38. Ez 5-tel több, mint Rékáé.” → Réka = 33 */
    so = [{ nev: A.n }, { nev: B.n }];
    L = [szlLep(A.nak + " " + a + " " + D.b + " van.", "d", a, "r0", [{ s: [szlSeg("a", a)] }, { s: [] }]),
         szlLep("Ez " + szlVal(d) + " több, mint " + B.e + ".", "d", d, "r0",
           [{ s: [szlSeg("c", a - d, "", { sz: true }), szlSeg("d", d)], k: szlKap("A", a) }, { s: [szlSeg("x", a - d, "?", { ism: true })] }])];
    Q = { mondat: "Hány " + D.b + " van " + B.nak + "?", cel: "x", all: L[1].all };
    return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: a - d, ki: 0 };
  }
  /* vonat-keves: „Rékának 30. Ez 5-tel kevesebb, mint Daninak.” → Dani = 35 (a kulcsszó-módszert lebuktatja) */
  a = veletlen(10, 70); d = veletlen(3, Math.min(20, 96 - a));
  so = [{ nev: A.n }, { nev: B.n }];
  L = [szlLep(A.nak + " " + a + " " + D.b + " van.", "d", a, "r0", [{ s: [szlSeg("a", a)] }, { s: [] }]),
       szlLep("Ez " + szlVal(d) + " kevesebb, mint amennyi " + B.nak + " van.", "d", d, "r1",
         [{ s: [szlSeg("a", a)] }, { s: [szlSeg("c", a, "", { sz: true }), szlSeg("d", d)] }])];
  Q = { mondat: "Hány " + D.b + " van " + B.nak + "?", cel: "K", all: [{ s: [szlSeg("a", a)] }, { s: [szlSeg("c", a, "", { sz: true }), szlSeg("d", d)], k: szlKap("K", a + d, "?", true) }] };
  return { tipus: tipus, sorok: so, lepesek: L, kerdes: Q, helyes: a + d, ki: 1 };
}
/* ⑤ a postakocsi: induláskor s, 3 megálló (+ felszáll / − leszáll), a végén v; 0 ≤ utasok ≤ 20 */
function szlBusz() {
  for (var p = 0; p < 300; p++) {
    var s = veletlen(4, 12), u = s, m = [], ok = true;
    for (var i = 0; i < 3; i++) {
      var fel = i === 1 ? veletlen(0, 1) : veletlen(0, 2) > 0, k = veletlen(2, 6);
      if (!fel && u - k < 1) fel = true;
      u += fel ? k : -k; m.push(fel ? k : -k);
      if (u > 20) ok = false;
    }
    if (ok && m.some(function (x) { return x < 0; }) && m.some(function (x) { return x > 0; })) return { s: s, m: m, v: u };
  }
  return { s: 8, m: [4, -3, 2], v: 11 };
}
function szlNaplo(k) { return { tipus: "szalag", kerdes: k, forma: "j" }; }

/* ═════════════════ FELADAT (GEN.szalag) ═════════════════
   cfg.forma: egyforma · kendo · kirak · hossz · busz · vegyes (Odú-küszöb: kirak, segítség nélkül) */
GEN.szalag = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, forma = cfg.forma, h = !!cfg.halvany, x;
  if (forma === "egyforma") {
    var ro = veletlen(5, 10), ho = ro + veletlen(2, 5), felul = veletlen(0, 1);
    var jo = ho - ro, op = keverTomb([jo, jo + veletlenElem([1, 2]), Math.max(1, jo - veletlenElem([1, 2]))].filter(function (v, k, t) { return t.indexOf(v) === k; }));
    while (op.length < 3) op.push(jo + op.length + 1);
    x = { forma: "egyforma", h: felul ? [ho, ro] : [ro, ho], polc: op, vezet: !h && (i < 1 || st.vezet > 0), fazis: "rak" };
    if (st.vezet > 0 && i >= 1) st.vezet--;
    return szlFeladatKi(x, jo, "Tedd egyformává a két szalagot! Vigyél toldást a rövidebbhez, vagy koppints a hosszabbikra, ahol levágod!",
      "Tedd egyformává a két szalagot! Toldd meg a rövidebbet, vagy vágj le a hosszabbikból!", szlNaplo("egyforma " + ro + "/" + ho));
  }
  if (forma === "kendo") {
    var E = veletlen(9, 18), H = veletlen(3, Math.min(9, E - 3)), V = E - H, rak = !h && i < 2;
    var rudak = keverTomb([H, H + veletlenElem([1, 2]), Math.max(1, H - veletlenElem([1, 2]))].filter(function (v, k, t) { return t.indexOf(v) === k; }));
    while (rudak.length < 3) rudak.push(H + rudak.length + 1);
    x = { forma: "kendo", E: E, V: V, H: H, rak: rak, rudak: rudak, fazis: rak ? "rak" : "ir", hely: null, emel: false };
    return szlFeladatKi(x, H, rak ? "Melyik rúd fér a kendő alá? Vidd oda!" : "Mennyi van a kendő alatt? Írd a táblára!",
      "Az egész rúd " + szo(E) + ". Ennyi látszik: " + szo(V) + ". " + (rak ? "Melyik rúd fér a kendő alá? Vidd oda!" : "Mennyi van a kendő alatt? Írd a táblára!"), szlNaplo("kendő " + E + "−" + V));
  }
  if (forma === "busz") {
    var b = szlBusz();
    x = { forma: "busz", b: b, k: 3, ertek: [null, null, null, b.v], figurak: !h && i === 0, fazis: "valaszt", hol: 3 };
    return szlFeladatKi(x, b.s, "Most " + b.v + " utas ül a kocsiban. Hányan ültek benne induláskor? Koppints a villogó megállóra!",
      "A postakocsiban most " + szo(b.v) + " utas ül. Hányan ültek benne induláskor? Menj visszafelé! Koppints a villogó megállóra!", szlNaplo("busz " + b.v));
  }
  /* kirak · hossz · vegyes */
  var tip;
  if (forma === "hossz") { if (!st.hsor) st.hsor = keverTomb(["vonat-tobb", "vonat-keves", "vonat-tobb", "vonat-keves"]); tip = st.hsor[i % 4]; }
  else if (forma === "vegyes") tip = veletlenElem(SZL_TIPUSOK.concat(["vonat-tobb", "vonat-keves"]));
  else { if (!st.ksor) st.ksor = ["valt-ered", "resz-ered", "ossz-ered"].concat(keverTomb(["valt-valt", "valt-kiind", "resz-resz", "ossz-kul"]).slice(0, 2)); tip = st.ksor[i % st.ksor.length]; }
  var F = szlFeladat(tip), kiKell = forma === "hossz" && !h && !((st.kiJo || 0) >= 3);
  x = { forma: "kirak", f: F, lep: 0, fazis: kiKell ? "ki" : "kirak", kiszin: false, felul: null, polc: null, halvany: h, hossz: forma === "hossz" };
  szlPolc(x);
  return szlFeladatKi(x, F.helyes, szlUtasitas(x), szlFelolvas(x), szlNaplo(tip + " " + F.helyes));
};
function szlFeladatKi(x, helyes, kerdes, felolvas, naplo) {
  return { csalad: "jelenet", jelenet: "szalag", szl: x, kartyaHTML: szlKartya(x, kerdes), szoveg: kerdes, felolvas: felolvas,
    helyes: helyes, keplet: kerdes, tipp: "", naplo: naplo };
}
/* a buborékban: a történet mondatai (a mostani kiemelve) + alatta, mit kell csinálni (hang nélkül is érthető) */
function szlKartya(x, utasitas) {
  if (x.forma !== "kirak") return '<span class="bk-kerdes">' + kiiras(utasitas) + '</span>';
  var F = x.f, most = x.fazis === "kirak" ? x.lep : x.fazis === "ki" ? -1 : F.lepesek.length, ki = x.fazis === "ki", s = '<span class="bk-kerdes szl-tortenet">';
  F.lepesek.forEach(function (l, k) { s += '<span class="' + (ki ? "szl-volt" : k === most ? "szl-most" : k < most ? "szl-volt" : "szl-majd") + '">' + kiiras(l.mondat) + '</span> '; });
  s += '<span class="' + (ki ? "szl-volt" : most >= F.lepesek.length ? "szl-most" : "szl-majd") + '">' + kiiras(F.kerdes.mondat) + '</span></span>';
  return s + '<span class="szl-utasitas">' + kiiras(utasitas) + '</span>';
}
function szlUtasitas(x) {
  if (x.fazis === "ki") return "Kinek van több? Koppints a nevére!";
  if (x.fazis === "kirak") return "Vedd fel a tekercset vagy a kapcsot, és tedd a szalaghoz!";
  if (x.fazis === "kerdez") return "Mit kérdez? Koppints arra a részre a szalagon!";
  return "Írd a táblára a számot!";
}
function szlFelolvas(x) {
  var F = x.f;
  if (x.fazis === "ki") return F.lepesek.map(function (l) { return l.mondat; }).join(" ") + " " + F.kerdes.mondat + " Kinek van több? Koppints a nevére!";
  return F.lepesek.map(function (l) { return l.mondat; }).join(" ") + " " + F.kerdes.mondat + " Rakd ki mondatonként! Vedd fel a tekercset vagy a kapcsot, és tedd a szalaghoz!";
}
function szlFelirat(x, utasitas) {
  JL.f.szoveg = JL.f.keplet = utasitas;
  $("buborek-feladat").innerHTML = szlKartya(x, utasitas);
}
/* a polc a mostani lépéshez: a jó tárgy + ugyanaz a szám a másik fajtával (keverve) */
function szlPolc(x) {
  if (x.forma !== "kirak" || x.lep >= x.f.lepesek.length) { x.polc = null; return; }
  var l = x.f.lepesek[x.lep], t = l.targy;
  x.polc = keverTomb([{ t: t.t, v: t.v, jo: true }, { t: t.t === "d" ? "k" : "d", v: t.v, jo: false }]);
}

/* ═════════════════ ELRENDEZÉS (laptop + 📱 telefon, álló) ═════════════════ */
var SZL_KEP = {
  teljes: { vb: "0 0 800 430", W: 800, H: 430, hod: [80, 318, .6], tabla: [700, 70, 112, 62], x0: 210, x1: 690, ry: [170, 262], nevX: 200,
            polcY: 352, polcX: [330, 470, 610], uni: [756, 412, .26], busz: { y: 300, start: 200, m: [330, 460, 590], veg: 720 } },
  keskeny: { vb: "0 0 400 680", W: 400, H: 680, hod: [62, 196, .42], tabla: [300, 74, 112, 62], x0: 64, x1: 372, ry: [300, 400], nevX: 60,
            polcY: 548, polcX: [90, 200, 310], uni: [356, 652, .22], busz: { y: 430, start: 40, m: [120, 210, 300], veg: 368 } }
};
function szlK() { return SZL_KEP[JL && JL.keskeny ? "keskeny" : "teljes"]; }
var SZL_FR = ' font-family="Fredoka,sans-serif" font-weight="600"';

/* ═════════════════ RAJZ: szalag, kapocs, tekercs, rúd ═════════════════ */
/* egy szalagdarab: (x, y) a bal széle, középmagasságban; w hossz; sz: szaggatott („annyi, mint…”); ism: ? */
function szlDarab(x, y, w, szin, c, o) {
  o = o || {}; var F = pcF, h = o.h || 30, s = '<g' + (o.attr || '') + '>';
  if (o.attr) s += '<rect x="' + F(x) + '" y="' + F(y - h / 2 - 8) + '" width="' + F(Math.max(w, 24)) + '" height="' + (h + 16) + '" fill="transparent"/>';
  var fill = o.sz ? "#fffaf4" : o.ism ? "#fff" : szin[0], str = o.jelolt ? "#e0417a" : szin[1];
  s += '<rect x="' + F(x + 1) + '" y="' + F(y - h / 2) + '" width="' + F(Math.max(w - 2, 4)) + '" height="' + h + '" rx="5" fill="' + fill + '" stroke="' + str + '" stroke-width="' + (o.jelolt ? 3.4 : 2.2) + '"' + (o.sz || o.ism ? ' stroke-dasharray="6 4"' : '') + (o.hiba ? ' opacity=".55"' : '') + '/>';
  if (o.jelolt) s += '<rect x="' + F(x + 3) + '" y="' + F(y - h / 2 + 2) + '" width="' + F(Math.max(w - 6, 2)) + '" height="' + (h - 4) + '" rx="4" fill="url(#szl-csik)" opacity=".55"/>';
  if (o.rov) for (var k = 1; k < o.rov; k++) s += '<path d="M' + F(x + w * k / o.rov) + ' ' + F(y - h / 2 + 4) + 'V' + F(y + h / 2 - 4) + '" stroke="' + szin[1] + '" stroke-width="1.4" opacity=".7"/>';
  if (c) s += '<text x="' + F(x + w / 2) + '" y="' + F(y + 6) + '" text-anchor="middle" font-size="' + (w < 30 ? 13 : 17) + '"' + SZL_FR + ' fill="' + (o.ism ? "#e0417a" : "#3c2a50") + '">' + kiiras(c) + '</text>';
  if (o.n) s += '<text x="' + F(x + w / 2) + '" y="' + F(y + h / 2 + 15) + '" text-anchor="middle" font-size="12"' + SZL_FR + ' fill="#6b6280">' + kiiras(o.n) + '</text>';
  return s + '</g>';
}
/* kapocs (kapcsos zárójel) a sor fölött x0 → x1, y a sor közepe */
function szlKapocs(x0, x1, y, c, o) {
  o = o || {}; var F = pcF, yb = y - 24, m = (x0 + x1) / 2, col = o.jelolt ? "#e0417a" : o.hiba ? "#c0567f" : "#6e4a36", s = '<g' + (o.attr || '') + '>';
  if (o.attr) s += '<rect x="' + F(x0) + '" y="' + F(yb - 34) + '" width="' + F(Math.max(x1 - x0, 30)) + '" height="40" fill="transparent"/>';
  s += '<path d="M' + F(x0 + 2) + ' ' + F(yb + 6) + 'Q' + F(x0 + 2) + ' ' + F(yb) + ' ' + F(x0 + 10) + ' ' + F(yb) + 'H' + F(m - 8) + 'Q' + F(m) + ' ' + F(yb) + ' ' + F(m) + ' ' + F(yb - 8) +
       'Q' + F(m) + ' ' + F(yb) + ' ' + F(m + 8) + ' ' + F(yb) + 'H' + F(x1 - 10) + 'Q' + F(x1 - 2) + ' ' + F(yb) + ' ' + F(x1 - 2) + ' ' + F(yb + 6) + '" fill="none" stroke="' + col + '" stroke-width="' + (o.jelolt ? 3.6 : 2.6) + '" stroke-linecap="round"/>';
  var w = String(c).length * 10 + 20;
  s += '<rect x="' + F(m - w / 2) + '" y="' + F(yb - 32) + '" width="' + w + '" height="22" rx="8" fill="' + (o.jelolt ? "#ffe3ee" : "#fffaf0") + '" stroke="' + col + '" stroke-width="1.6"/>' +
       '<text x="' + F(m) + '" y="' + F(yb - 15.5) + '" text-anchor="middle" font-size="16"' + SZL_FR + ' fill="' + (o.ism ? "#e0417a" : "#3c2a50") + '">' + kiiras(c) + '</text>';
  return s + '</g>';
}
/* a polc tárgyai: tekercs (darab) · kapocs-kártya (egész). (x, y) a közepe */
function szlTekercs(x, y, v, attr) {
  var F = pcF;
  return '<g' + (attr || '') + ' transform="translate(' + F(x) + ' ' + F(y) + ')"><g class="kf-ic"><rect x="-44" y="-30" width="88" height="56" fill="transparent"/>' +
    '<path d="M6 4Q30 0 40 14L36 22Q26 10 6 14Z" fill="#fce49a" stroke="#c9962a" stroke-width="1.8"/>' +
    '<ellipse cx="-6" cy="0" rx="24" ry="22" fill="#fce49a" stroke="#c9962a" stroke-width="2.2"/><ellipse cx="-6" cy="0" rx="15" ry="14" fill="none" stroke="#e8c46a" stroke-width="1.4"/>' +
    '<text x="-6" y="6" text-anchor="middle" font-size="17"' + SZL_FR + ' fill="#6e4a1a">' + v + '</text></g></g>';
}
function szlKapocsKartya(x, y, v, attr) {
  var F = pcF;
  return '<g' + (attr || '') + ' transform="translate(' + F(x) + ' ' + F(y) + ')"><g class="kf-ic"><rect x="-44" y="-30" width="88" height="56" fill="transparent"/>' +
    '<rect x="-40" y="-24" width="80" height="46" rx="8" fill="#fffaf0" stroke="#c9ad85" stroke-width="1.8"/>' +
    '<path d="M-30 14Q-30 8 -24 8H-6Q0 8 0 2Q0 8 6 8H24Q30 8 30 14" fill="none" stroke="#6e4a36" stroke-width="2.4" stroke-linecap="round"/>' +
    '<text x="0" y="-4" text-anchor="middle" font-size="17"' + SZL_FR + ' fill="#3c2a50">' + v + '</text></g></g>';
}
function szlTargy(x, y, T, attr) { return T.t === "k" ? szlKapocsKartya(x, y, T.v, attr) : szlTekercs(x, y, T.v, attr); }
function szlPolcRajz(K, n) {
  var F = pcF, y = K.polcY + 20, xa = K.polcX[0] - 60, xb = K.polcX[n - 1] + 60;
  return '<g filter="url(#lt-firka)"><path d="M' + F(xa) + ' ' + y + 'H' + F(xb) + 'V' + (y + 9) + 'H' + F(xa) + 'Z" fill="#c99a6a" stroke="#8a5a3a" stroke-width="2"/>' +
    '<path d="M' + F(xa + 14) + ' ' + (y + 9) + 'v12M' + F(xb - 14) + ' ' + (y + 9) + 'v12" stroke="#8a5a3a" stroke-width="3"/></g>';
}
/* rúd-tartó: a rovátkás rudak / toldások egymás alatt, igazi hosszukban (a polcon egymás mellett nem férnének el) */
var SZL_TARTO = { teljes: [430, [302, 338, 374]], keskeny: [64, [500, 540, 580]] };
function szlRudTarto(JL, K, lista, u, szin) {
  var T = SZL_TARTO[JL.keskeny ? "keskeny" : "teljes"], F = pcF, s = '';
  T[1].forEach(function (y) { s += '<path d="M' + F(T[0] - 10) + ' ' + (y + 16) + 'H' + F(Math.min(K.W - 60, T[0] + 290)) + '" stroke="#c99a6a" stroke-width="4" stroke-linecap="round" opacity=".8"/>'; });
  lista.forEach(function (v, i) {
    if (JL.fog && JL.fog.id === "p" + i) return;
    s += '<g class="jl-fog js-lukt" data-fog="p' + i + '"><g class="kf-ic">' + szlDarab(T[0], T[1][i], v * u, szin, "", { rov: v, h: 26 }) + '</g></g>';
  });
  return s;
}
/* a sor neve a sín elején (kétsoros feladatnál koppintható: „kinek van több?”) */
function szlNev(K, y, nev, i, attr, jelolt) {
  var F = pcF, w = nev.length * 9 + 18, x = K.nevX - w;
  return '<g' + (attr || '') + '><rect x="' + F(x) + '" y="' + F(y - 14) + '" width="' + w + '" height="28" rx="9" fill="' + (jelolt ? "#ffe3ee" : SZL_SZIN[i][0]) + '" stroke="' + (jelolt ? "#e0417a" : SZL_SZIN[i][1]) + '" stroke-width="' + (jelolt ? 3 : 1.8) + '"/>' +
    '<text x="' + F(x + w / 2) + '" y="' + F(y + 5.5) + '" text-anchor="middle" font-size="15"' + SZL_FR + ' fill="#3c2a50">' + kiiras(nev) + '</text></g>';
}
/* a mérőléc a sor alatt */
function szlSin(K, y) {
  var F = pcF, s = '<g opacity=".9"><rect x="' + F(K.x0 - 6) + '" y="' + F(y + 18) + '" width="' + F(K.x1 - K.x0 + 12) + '" height="9" rx="3" fill="#e9c98f" stroke="#b08a52" stroke-width="1.4"/>';
  for (var x = K.x0; x <= K.x1; x += 24) s += '<path d="M' + F(x) + ' ' + F(y + 18) + 'v4" stroke="#8a6a3a" stroke-width="1.2"/>';
  return s + '</g>';
}

/* ═════════════════ 🦫 A HÓD MESTER ═════════════════
   a figura egy 200 × 240-es dobozban, talppont: (100, 232). o.poz: var · mutat · orul. Képregényes: a végtag egy hajlékony vonal. */
var HD_INK = "#3a2a1e", HD_BUN = "#b07a4f", HD_BUND = "#8a5a36", HD_HAS = "#ecd2a8", HD_FAROK = "#6e4a36", HD_KOT = "#8fc4a5", HD_KOTD = "#5e9a72", HD_SZALAG = "#f2cf5b";
var HD_KAR = { var: [[70, 128, 62, 156, 76, 176], [130, 128, 138, 156, 124, 176]], mutat: [[70, 128, 62, 156, 76, 176], [130, 126, 160, 110, 176, 84]],
  orul: [[70, 126, 50, 104, 42, 78], [130, 126, 150, 104, 158, 78]] };
function hdCso(p, w, col) {
  var cx = 2 * p[2] - (p[0] + p[4]) / 2, cy = 2 * p[3] - (p[1] + p[5]) / 2, d = "M" + p[0] + " " + p[1] + "Q" + cx + " " + cy + " " + p[4] + " " + p[5];
  return '<path d="' + d + '" fill="none" stroke="' + HD_INK + '" stroke-width="' + (w + 5) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
}
function hodSVG(o) {
  o = o || {};
  var poz = o.poz || "var", K = HD_KAR[poz] || HD_KAR.var, cs = lkCsokkent(), s = '';
  s += '<ellipse cx="100" cy="236" rx="56" ry="7" fill="#000" opacity=".13"/>';
  /* lapos, pikkelyes farok hátul */
  s += '<g transform="rotate(-14 150 214)"><path d="M128 214C150 196 196 198 198 216C196 234 150 236 128 222Z" fill="' + HD_FAROK + '" stroke="' + HD_INK + '" stroke-width="2.8" stroke-linejoin="round"/>' +
       '<path d="M146 204L152 230M162 202L168 230M178 204L182 228M140 214H194" stroke="#563824" stroke-width="1.6" fill="none"/></g>';
  /* test */
  s += '<path d="M56 206C44 160 60 112 100 110C140 112 156 160 144 206C128 224 72 224 56 206Z" fill="' + HD_BUN + '" stroke="' + HD_INK + '" stroke-width="3.2" stroke-linejoin="round"/>';
  /* lábak (széles, úszóhártyás talp) */
  [[84, -1], [116, 1]].forEach(function (l) {
    var tx = l[0] + l[1] * 4;
    s += hdCso([l[0], 206, l[0] + l[1] * 2, 218, tx, 226], 15, HD_BUN) +
      '<path d="M' + (tx - 17) + ' 234C' + (tx - 15) + ' 222 ' + (tx + 15) + ' 222 ' + (tx + 18) + ' 234Z" fill="' + HD_BUND + '" stroke="' + HD_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  });
  /* kötény zsebbel, a zsebben ceruza */
  s += '<path d="M70 128C66 160 68 196 74 210H126C132 196 134 160 130 128Q100 120 70 128Z" fill="' + HD_KOT + '" stroke="' + HD_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M84 168H116V188Q100 194 84 188Z" fill="' + HD_KOTD + '" stroke="' + HD_INK + '" stroke-width="2" stroke-linejoin="round"/>';
  s += '<path d="M106 170L112 150L116 151L110 171Z" fill="#f5a54a" stroke="' + HD_INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M112 150L114 145L116 151Z" fill="' + HD_INK + '"/>';
  /* karok */
  s += hdCso(K[0], 13, HD_BUN) + hdCso(K[1], 13, HD_BUN);
  /* a nyakában mérőszalag, két vége lelóg */
  s += '<path d="M72 120Q100 136 128 120" fill="none" stroke="' + HD_INK + '" stroke-width="10" stroke-linecap="round"/><path d="M72 120Q100 136 128 120" fill="none" stroke="' + HD_SZALAG + '" stroke-width="6.4" stroke-linecap="round"/>';
  s += '<path d="M78 124L74 160M122 124L128 158" stroke="' + HD_INK + '" stroke-width="9" stroke-linecap="round"/><path d="M78 124L74 160M122 124L128 158" stroke="' + HD_SZALAG + '" stroke-width="5.6" stroke-linecap="round"/>';
  s += '<path d="M77 132h3M76 140h3M75 148h3M123 132h3M124 140h3M125 148h3" stroke="' + HD_INK + '" stroke-width="1.2"/>';
  /* fej */
  s += '<g transform="rotate(' + (o.billen || (poz === "mutat" ? 5 : poz === "orul" ? -4 : 0)) + ' 100 104)">';
  s += '<path d="M78 46C70 40 62 48 68 56M122 46C130 40 138 48 132 56" fill="' + HD_BUND + '" stroke="' + HD_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M64 80C60 50 80 38 100 38C120 38 140 50 136 80C134 104 66 104 64 80Z" fill="' + HD_BUN + '" stroke="' + HD_INK + '" stroke-width="3" stroke-linejoin="round"/>';
  s += '<path d="M80 84C80 74 120 74 120 84C120 96 80 96 80 84Z" fill="' + HD_HAS + '" stroke="' + HD_INK + '" stroke-width="2.2"/>';
  if (poz === "orul") s += '<path d="M80 64Q86 58 92 64M108 64Q114 58 120 64" fill="none" stroke="' + HD_INK + '" stroke-width="2.8" stroke-linecap="round"/>';
  else {
    s += '<ellipse cx="86" cy="63" rx="4" ry="5" fill="' + HD_INK + '"/><ellipse cx="114" cy="63" rx="4" ry="5" fill="' + HD_INK + '"/><circle cx="87.5" cy="61.4" r="1.4" fill="#fff"/><circle cx="115.5" cy="61.4" r="1.4" fill="#fff"/>';
    if (!cs) s += '<g opacity="0"><path d="M80 63Q86 67 92 63M108 63Q114 67 120 63" fill="' + HD_BUN + '" stroke="' + HD_INK + '" stroke-width="2.6" stroke-linecap="round"/><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.93;.96;1" dur="4.8s" repeatCount="indefinite"/></g>';
  }
  s += '<path d="M78 54Q86 50 92 54M108 54Q114 50 122 54" fill="none" stroke="' + HD_INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  s += '<path d="M94 76Q100 72 106 76Q104 80 100 80Q96 80 94 76Z" fill="' + HD_INK + '"/>';
  s += '<path d="M100 80V84" stroke="' + HD_INK + '" stroke-width="2"/><path d="M90 84Q100 ' + (poz === "orul" || poz === "mutat" ? 92 : 88) + ' 110 84" fill="none" stroke="' + HD_INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  /* a két nagy metszőfog */
  s += '<path d="M93 86H107V100Q100 103 93 100Z" fill="#fff6d8" stroke="' + HD_INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M100 86V101" stroke="' + HD_INK + '" stroke-width="1.6"/>';
  s += '<path d="M84 80l-12 -2M84 84l-12 2M116 80l12 -2M116 84l12 2" stroke="' + HD_INK + '" stroke-width="1.2" stroke-linecap="round"/>';
  s += '</g>';
  return s;
}
function szlHod(x, y, k, poz) { return '<g class="szl-hod" transform="translate(' + pcF(x - 100 * k) + ' ' + pcF(y - 232 * k) + ') scale(' + k + ')">' + hodSVG({ poz: poz }) + '</g>'; }

/* ═════════════════ 🏠 A HÁZ a Piactér falutérképén ═════════════════
   (0, 0) a talpa közepe; ~130 széles, ~140 magas. all: zart · uj · folyik · kesz */
function szlTerkepHaz(lepes, J) {
  var all = J.all === "alszik" || J.all === "zarva" ? "zart" : J.vil ? "uj" : J.all === "kesz" || lepes >= 6 ? "kesz" : "folyik";
  var eg = all === "kesz" ? 2 : all === "folyik" ? 1 : 0, cs = lkCsokkent(), s = '<g' + (all === "zart" ? ' style="filter:saturate(.55)"' : '') + '>';
  if (all === "uj") s += '<ellipse cx="0" cy="-60" rx="96" ry="80" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".5;1;.5", "2.4s")) + '</ellipse>';
  s += '<ellipse cx="0" cy="3" rx="66" ry="9" fill="#3c2a50" opacity=".14"/>';
  s += '<g filter="url(#lt-firka)">';
  /* lobogó szalag a kéményről */
  s += '<path d="M30 -112V-128" stroke="#8a5a3a" stroke-width="2.4"/><path d="M30 -128Q50 -136 62 -126T96 -122" fill="none" stroke="#f17ea6" stroke-width="5" stroke-linecap="round">' + (cs ? '' : '<animate attributeName="d" values="M30 -128Q50 -136 62 -126T96 -122;M30 -128Q50 -120 64 -130T96 -128;M30 -128Q50 -136 62 -126T96 -122" dur="2.6s" repeatCount="indefinite"/>') + '</path>';
  s += '<rect x="22" y="-118" width="16" height="22" fill="#c99272" stroke="#8a5a3a" stroke-width="2"/>';
  /* fa ház */
  s += '<path d="M-52 0V-64H52V0Z" fill="#e7c99a" stroke="#8a5a3a" stroke-width="2.6"/>';
  s += '<path d="M-52 -48H52M-52 -32H52M-52 -16H52" stroke="#c9a06a" stroke-width="1.4"/>';
  s += '<path d="M-62 -60L0 -110L62 -60Z" fill="#d9776f" stroke="#8a3a3a" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M-44 -66L0 -100L44 -66" fill="none" stroke="#b85a52" stroke-width="1.6"/>';
  /* cégér: szalag-orsó */
  s += '<path d="M-46 -40H-70" stroke="#8a5a3a" stroke-width="2.4"/><path d="M-66 -40V-34M-58 -40V-34" stroke="#8a5a3a" stroke-width="1.4"/>';
  s += '<g transform="translate(-62 -22)"><rect x="-12" y="-12" width="24" height="24" rx="3" fill="#fce49a" stroke="#c9962a" stroke-width="2"/><path d="M-12 -4H12M-12 4H12" stroke="#f17ea6" stroke-width="4"/><rect x="-15" y="-14" width="30" height="4" rx="2" fill="#c99272" stroke="#8a5a3a" stroke-width="1.2"/><rect x="-15" y="10" width="30" height="4" rx="2" fill="#c99272" stroke="#8a5a3a" stroke-width="1.2"/></g>';
  s += '</g>';
  /* ajtó + két ablak */
  s += '<g class="pc-ajto" style="transform-origin:-13px 0"><path d="M-13 0V-30H13V0Z" fill="#c99272" stroke="#8a5a3a" stroke-width="2.2"/><circle cx="7" cy="-15" r="2" fill="#8a5a3a"/></g>';
  [-32, 32].forEach(function (wx, i) {
    s += '<rect x="' + (wx - 9) + '" y="-54" width="18" height="16" rx="2" fill="' + (eg > i ? "#ffe9a0" : "#e8e2ef") + '" stroke="#8a5a3a" stroke-width="1.8"/><path d="M' + wx + ' -54V-38M' + (wx - 9) + ' -46H' + (wx + 9) + '" stroke="#8a5a3a" stroke-width="1.2"/>';
  });
  return s + '</g>';
}

/* ═════════════════ A KÉP (JELENETEK.szalag) ═════════════════ */
function szlHatter(JL) {
  var K = szlK(), W = K.W, H = K.H, s = '';
  s += '<defs><pattern id="szl-csik" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" fill="#f9b8cf"/></pattern></defs>';
  s += '<rect width="' + W + '" height="' + H + '" fill="#fbf1e2"/>';   /* krém fal */
  s += '<path d="M0 ' + (H - 34) + 'H' + W + 'V' + H + 'H0Z" fill="#e3c08f"/>';   /* fapadló */
  for (var x = 40; x < W; x += 90) s += '<path d="M' + x + ' ' + (H - 34) + 'V' + H + '" stroke="#c99a6a" stroke-width="1.4"/>';
  /* a falon: orsók egy polcon (díszlet, halványan) */
  var py = JL.keskeny ? 150 : 46, px0 = JL.keskeny ? 140 : 300;
  s += '<g opacity=".55"><path d="M' + (px0 - 10) + ' ' + (py + 18) + 'h170" stroke="#b08a52" stroke-width="5" stroke-linecap="round"/>';
  [["#f17ea6", 0], ["#9ec9f0", 40], ["#a7d99a", 80], ["#fce49a", 120]].forEach(function (o) {
    s += '<rect x="' + (px0 + o[1]) + '" y="' + (py - 6) + '" width="22" height="22" rx="3" fill="' + o[0] + '" stroke="#8a6a52" stroke-width="1.4"/>';
  });
  return s + '</g>';
}
JELENETEK.szalag = {
  kep: function (JL) {
    var K = szlK(), x = JL.f.szl, T = x.forma === "egyforma" ? null : K.tabla;
    return { vb: "0 0 " + K.W + " " + K.H, tabla: T, uni: [K.uni[0], K.uni[1], K.uni[2], -1] };
  },
  indit: function (JL) { szlKeskenyNez(JL); return false; },
  tablaAll: function (JL) {
    var x = JL.f.szl;
    if (x.forma === "kendo") return x.fazis === "ir" ? "" : "var";
    if (x.forma === "kirak") return x.fazis === "felel" ? "" : "var";
    if (x.forma === "busz") return x.fazis === "ir" ? "" : "var";
    return "var";
  },
  tablaVarMondat: function (JL) {
    var x = JL.f.szl;
    if (x.forma === "kendo") return "Vidd a rudat a kendő alá!";
    if (x.forma === "busz") return "Koppints a villogó megállóra!";
    if (x.forma === "kirak") return x.fazis === "kerdez" ? "Előbb koppints arra a részre, amit kérdeznek!" : x.fazis === "ki" ? "Kinek van több? Koppints a nevére!" : "Előbb rakd ki a szalagot!";
    return "Vidd a toldást a rövidebb szalaghoz!";
  },
  rajz: function (JL) {
    var x = JL.f.szl, K = szlK(), s = szlHatter(JL);
    if (x.forma === "egyforma") s += szlEgyformaRajz(JL, x, K);
    else if (x.forma === "kendo") s += szlKendoRajz(JL, x, K);
    else if (x.forma === "busz") s += szlBuszRajz(JL, x, K);
    else s += szlKirakRajz(JL, x, K);
    return s;
  },
  fogRajz: function (JL, F) {
    var x = JL.f.szl, i = +F.id.slice(1), s;
    if (x.forma === "kirak") s = szlTargy(F.x, F.y, x.polc[i], '');
    else { var u = szlEgyseg(x, szlK()), w = x.forma === "kendo" ? x.rudak[i] * u : x.polc[i] * u; s = szlDarab(F.x - w / 2, F.y, w, SZL_SZIN[x.forma === "kendo" ? 0 : szlRovid(x)], "", { rov: x.forma === "kendo" ? x.rudak[i] : x.polc[i] }); }
    return kfSajatId('<g transform="translate(0 -6)">' + s + '</g>', "jl");
  },
  felvesz: function (JL, id) {
    var x = JL.f.szl;
    if (!/^p\d$/.test(id)) return null;
    if (x.forma === "egyforma") return x.fazis === "rak" ? 1 : null;
    if (x.forma === "kendo") return x.fazis === "rak" ? 1 : null;
    if (x.forma === "kirak") return x.fazis === "kirak" && x.polc ? 1 : null;
    return null;
  },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.szl, i = +id.slice(1);
    if (!hova) { jlRajz(); return; }
    if (x.forma === "egyforma") szlToldTesz(JL, x, i, hova);
    else if (x.forma === "kendo") szlKendoTesz(JL, x, i, hova);
    else if (x.forma === "kirak") szlKirakTesz(JL, x, i, hova);
  },
  katt: function (JL, t) {
    var x = JL.f.szl, e;
    if (x.forma === "egyforma" && (e = t.closest(".szl-vag"))) { szlVag(JL, x, +e.getAttribute("data-k")); return; }
    if (x.forma === "kirak" && x.fazis === "ki" && (e = t.closest(".szl-nev"))) { szlKi(JL, x, +e.getAttribute("data-i")); return; }
    if (x.forma === "kirak" && x.fazis === "kerdez" && (e = t.closest(".szl-resz"))) { szlKerdezKatt(JL, x, e.getAttribute("data-id")); return; }
    if (x.forma === "busz" && x.fazis === "valaszt" && (e = t.closest(".szl-megallo"))) { szlMegallo(JL, x, +e.getAttribute("data-i")); return; }
  },
  bekuld: function (JL, v) {
    var x = JL.f.szl;
    if (x.forma === "kendo") szlKendoIr(JL, x, v);
    else if (x.forma === "kirak") szlFelel(JL, x, v);
    else if (x.forma === "busz") szlBuszIr(JL, x, v);
  },
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele */
    var x = JL.f.szl, fog = function (i) { return '#jl-svg .jl-fog[data-fog="p' + i + '"]'; }, hely = function (h) { return '#jl-svg .jl-hely[data-hely="' + h + '"]'; };
    if (x.forma === "egyforma") return { katt: [fog(x.polc.indexOf(Math.abs(x.h[0] - x.h[1]))), hely("t")] };
    if (x.forma === "kendo") return x.fazis === "rak" ? { katt: [fog(x.rudak.indexOf(x.H)), hely("kendo")] } : { gepel: x.H };
    if (x.forma === "busz") return x.fazis === "valaszt" ? { katt: ['#jl-svg .szl-megallo[data-i="' + (x.hol - 1) + '"]'] } : { gepel: szlBuszElotte(x, x.hol) };
    if (x.fazis === "ki") return { katt: ['#jl-svg .szl-nev[data-i="' + x.f.ki + '"]'] };
    if (x.fazis === "kirak") { var l = x.f.lepesek[x.lep]; return { katt: [fog(x.polc.map(function (p) { return p.jo; }).indexOf(true)), hely(l.hova)] }; }
    if (x.fazis === "kerdez") return { katt: ['#jl-svg .szl-resz[data-id="' + x.f.kerdes.cel + '"]'] };
    return { gepel: x.f.helyes };
  }
};
function szlKeskenyNez(JL) { var pw = JL.svg && JL.svg.parentNode && JL.svg.parentNode.parentNode.clientWidth; JL.keskeny = !!(pw && pw < 520); }
function szlVar(f, ms, fn) { setTimeout(function () { if (JL && JL.f === f) fn(); }, lkCsokkent() || window.__UC_GYORS ? 0 : ms); }
/* a jó válasz után a kép még egy kicsit mutatja az eredményt, aztán tovább */
function szlEltart(tovabb) { setTimeout(tovabb, lkCsokkent() || window.__UC_GYORS ? 0 : 1500); }

/* ═════════════════ ① LEGYENEK EGYFORMÁK! ═════════════════ */
function szlEgyseg(x, K) {
  var max = x.forma === "kendo" ? x.E + 2 : Math.max(x.h[0], x.h[1]) + 1;
  return Math.min(30, (K.x1 - K.x0) / max);
}
function szlRovid(x) { return x.h[0] < x.h[1] ? 0 : 1; }
function szlEgyformaRajz(JL, x, K) {
  var u = szlEgyseg(x, K), r = szlRovid(x), hs = 1 - r, s = '', F = pcF, kesz = x.fazis === "kesz";
  s += szlHod(K.hod[0], K.hod[1], K.hod[2], x.hod || (x.vezet ? "mutat" : "var"));
  [0, 1].forEach(function (i) {
    var y = K.ry[i], hossz = x.h[i];
    s += szlSin(K, y);
    if (i === hs && x.vag != null) hossz = x.vag;   /* levágva (vagy a próba-vágás) */
    s += szlDarab(K.x0, y, hossz * u, SZL_SZIN[i], "", { rov: hossz });
    if (i === r && x.told != null) s += szlDarab(K.x0 + hossz * u, y, x.told * u, SZL_SZIN[i], "", { rov: x.told, hiba: x.toldRossz, jelolt: kesz });
  });
  /* a levágott darab lehull az asztalra */
  if (x.vag != null) {
    var lv = x.h[hs] - x.vag, ly = K.ry[1] + 52;
    if (lv > 0) s += '<g transform="rotate(4 ' + F(K.x0 + x.vag * u) + ' ' + ly + ')">' + szlDarab(K.x0 + x.vag * u, ly, lv * u, SZL_SZIN[hs], "", { rov: lv, h: 22, jelolt: kesz }) + '</g>';
  }
  /* vezető vonal a rövidebb végénél */
  if (x.vezet && !kesz) s += '<path d="M' + F(K.x0 + x.h[r] * u) + ' ' + (K.ry[0] - 30) + 'V' + (K.ry[1] + 30) + '" stroke="#e0417a" stroke-width="2" stroke-dasharray="5 5" opacity=".8"/>';
  if (x.fazis !== "rak" || JL.lezart) return s;
  /* a vágás helyei a hosszabbikon (rovátkánként) */
  for (var k = 1; k < x.h[hs]; k++) s += '<g class="szl-vag" data-k="' + k + '" style="cursor:pointer"><rect x="' + F(K.x0 + k * u - u / 2) + '" y="' + (K.ry[hs] - 22) + '" width="' + F(u) + '" height="44" fill="transparent"/></g>';
  /* a toldás helye a rövidebb végén */
  s += '<rect class="jl-hely" data-hely="t" x="' + F(K.x0 + x.h[r] * u) + '" y="' + (K.ry[r] - 24) + '" width="' + F(Math.max(60, (x.h[hs] - x.h[r]) * u + 20)) + '" height="48" rx="10" fill="transparent"/>';
  /* a polc: toldások */
  return s + szlRudTarto(JL, K, x.polc, u, SZL_SZIN[r]);
}
function szlToldTesz(JL, x, i, hova) {
  if (hova !== "t") { jlRajz(); return; }
  var v = x.polc[i], kell = Math.abs(x.h[0] - x.h[1]), f = JL.f;
  x.told = v;
  if (v === kell) { x.fazis = "kesz"; x.hod = "orul"; hangCsilla(); jlJo("Egyformák!", null, szlEltart); return; }
  x.toldRossz = true; JL.lezart = true;
  jlRossz(String(v), szlNaplo("egyforma toldás"));
  if (JL.seg >= 2) JL.st.vezet = 2;
  x.vezet = true; jlRajz();
  jlSzol(v > kell ? "Hm. Most a másik lett hosszabb. Kisebb toldás kell!" : "Hm. Még mindig rövidebb. Nagyobb toldás kell!", true);
  szlVar(f, 1300, function () { x.told = null; x.toldRossz = false; JL.lezart = false; jlRajz(); });
}
function szlVag(JL, x, k) {
  var r = szlRovid(x), f = JL.f;
  hangGomb(); x.vag = k;
  if (k === x.h[r]) { x.fazis = "kesz"; x.hod = "orul"; hangCsilla(); jlJo("Egyformák!", null, szlEltart); return; }
  JL.lezart = true;
  jlRossz("vágás", szlNaplo("egyforma vágás"));
  if (JL.seg >= 2) JL.st.vezet = 2;
  x.vezet = true; jlRajz();
  jlSzol(k < x.h[r] ? "Hm. Ez túl sok volt, most ez lett a rövidebb!" : "Hm. Még mindig hosszabb. Nézd meg, hol ér véget a másik!", true);
  szlVar(f, 1300, function () { x.vag = null; JL.lezart = false; jlRajz(); });
}

/* ═════════════════ ② MI VAN A KENDŐ ALATT? ═════════════════ */
function szlKendoRajz(JL, x, K) {
  var u = szlEgyseg(x, K), y = Math.round((K.ry[0] + K.ry[1]) / 2), F = pcF, s = '', xv = K.x0 + x.V * u, xe = K.x0 + x.E * u;
  s += szlHod(K.hod[0], K.hod[1], K.hod[2], x.hod || "var");
  s += szlSin(K, y);
  s += szlDarab(K.x0, y, x.V * u, SZL_SZIN[0], String(x.V), { rov: x.V });
  /* a kendő alá tett rúd (a gyerek választotta, vagy amit beírt) */
  var alatta = x.hely != null ? x.hely : null;
  if (alatta != null) s += szlDarab(xv, y, alatta * u, SZL_SZIN[1], x.emel ? String(alatta) : "", { rov: x.rak ? alatta : 0, hiba: x.rossz, jelolt: x.fazis === "kesz" });
  /* a kendő: a rejtett rész fölött, túllóg a végén (nem látszik, hol ér véget) */
  var kx0 = xv - 8, kx1 = xe + u * 1.6, ky = y - 26;
  if (!x.emel) {
    s += '<g filter="url(#lt-firka)"><path d="M' + F(kx0) + ' ' + F(ky) + 'Q' + F((kx0 + kx1) / 2) + ' ' + F(ky - 10) + ' ' + F(kx1) + ' ' + F(ky + 2) + 'L' + F(kx1 + 6) + ' ' + F(y + 30) +
      'Q' + F(kx1 - 12) + ' ' + F(y + 22) + ' ' + F((kx0 + kx1) / 2 + 10) + ' ' + F(y + 34) + 'Q' + F(kx0 + 20) + ' ' + F(y + 24) + ' ' + F(kx0 - 6) + ' ' + F(y + 32) + 'Z" fill="#c9a8e6" stroke="#7a5ea8" stroke-width="2.2"/>' +
      '<path d="M' + F(kx0 + 20) + ' ' + F(ky + 6) + 'Q' + F(kx0 + 26) + ' ' + F(y + 6) + ' ' + F(kx0 + 18) + ' ' + F(y + 26) + 'M' + F(kx1 - 24) + ' ' + F(ky + 4) + 'Q' + F(kx1 - 20) + ' ' + F(y + 4) + ' ' + F(kx1 - 28) + ' ' + F(y + 24) + '" fill="none" stroke="#a88ad0" stroke-width="1.6"/></g>';
    s += '<text x="' + F((kx0 + kx1) / 2) + '" y="' + F(y + 8) + '" text-anchor="middle" font-size="24"' + SZL_FR + ' fill="#fff">?</text>';
    if (x.fazis === "rak" && !JL.lezart) s += '<rect class="jl-hely" data-hely="kendo" x="' + F(kx0) + '" y="' + F(ky - 6) + '" width="' + F(kx1 - kx0) + '" height="' + F(y + 40 - ky) + '" rx="12" fill="transparent"/>';
  }
  s += szlKapocs(K.x0, xe, y, String(x.E));   /* a kapocs a kendő fölött: látszik, hol ér véget az egész */
  if (x.fazis !== "rak" || JL.lezart) return s;
  return s + szlRudTarto(JL, K, x.rudak, u, SZL_SZIN[1]);
}
/* a kendő felemelkedik: látszik, belefér-e; kesz(jó) */
function szlKendoEmel(JL, x, v, utana) {
  var f = JL.f; x.hely = v; x.emel = true; x.rossz = v !== x.H; JL.lezart = true; jlRajz();
  szlVar(f, 300, function () { utana(v === x.H); });
}
function szlKendoTesz(JL, x, i, hova) {
  if (hova !== "kendo") { jlRajz(); return; }
  var v = x.rudak[i], f = JL.f;
  hangGomb();
  szlKendoEmel(JL, x, v, function (jo) {
    if (jo) { x.fazis = "ir"; x.rossz = false; JL.lezart = false; szlFelirat(x, "Pont befér! Hány rovátka van rajta? Írd a táblára!"); jlRajz(); mondd("Pont befér! Hány rovátka van rajta? Írd a táblára!"); jlFokusz(); return; }
    jlRossz(String(v), szlNaplo("kendő rúd"));
    jlSzol(v > x.H ? "Hm. Kilóg a kapocsból: ez túl hosszú." : "Hm. Marad egy rés: ez túl rövid.", true);
    szlVar(f, 1400, function () { x.hely = null; x.emel = false; x.rossz = false; JL.lezart = false; jlRajz(); });
  });
}
function szlKendoIr(JL, x, v) {
  var f = JL.f;
  if (v > x.E + 6) v = x.E + 6;   /* a rajz ne lógjon ki a képből */
  szlKendoEmel(JL, x, v, function (jo) {
    if (jo) { x.fazis = "kesz"; x.hod = "orul"; hangCsilla(); jlJo(x.V + " + " + x.H + " = " + x.E, null, szlEltart); return; }
    JL.rossz = String(v); jlRossz(String(v), szlNaplo("kendő " + x.E + "−" + x.V));
    jlSzol(JL.seg >= 2 ? "Az egész " + szo(x.E) + ". Ebből " + szo(x.V) + " látszik. Mennyi kell még, hogy " + szo(x.E) + " legyen?" :
      v > x.H ? "Hm. Kilóg a kapocsból: ez túl sok." : "Hm. Marad egy rés: ez kevés.", true);
    szlVar(f, 1400, function () { x.hely = null; x.emel = false; x.rossz = false; JL.lezart = false; jlRajz(); jlFokusz(); });
  });
}

/* ═════════════════ ③ ④ RAKD KI, AMIT MOND! ═════════════════ */
/* a mostani állapot: a kirakott lépések utáni rajz; kérdésnél és utána a kérdés rajza */
function szlAllNow(x) {
  var F = x.f;
  if (x.fazis === "ki") return F.sorok.map(function () { return { s: [] }; });
  if (x.fazis === "kirak") return x.lep === 0 ? F.sorok.map(function () { return { s: [] }; }) : F.lepesek[x.lep - 1].all;
  return F.kerdes.all;
}
function szlKirakRajz(JL, x, K) {
  var F = x.f, A = szlAllNow(x), s = '', P = pcF, kesz = x.fazis === "kesz", ket = F.sorok.length > 1;
  s += szlHod(K.hod[0], K.hod[1], K.hod[2], x.hod || (x.fazis === "kerdez" ? "mutat" : "var"));
  /* a lépték: a legnagyobb sor / kapocs férjen el */
  var max = 1;
  F.kerdes.all.forEach(function (r) { var t = 0; r.s.forEach(function (g) { t += g.v; }); max = Math.max(max, t, r.k ? r.k.v : 0); });
  var u = Math.min(14, (K.x1 - K.x0) / max);
  var ys = ket ? K.ry : [Math.round((K.ry[0] + K.ry[1]) / 2)];
  F.sorok.forEach(function (so, i) {
    var y = ys[i], r = A[i] || { s: [] }, xx = K.x0, katt = x.fazis === "kerdez" && !JL.lezart;
    s += szlSin(K, y);
    s += szlNev(K, y, so.nev, i, x.fazis === "ki" && !JL.lezart ? ' class="szl-nev" data-i="' + i + '" style="cursor:pointer"' : '', x.kiJel === i);
    r.s.forEach(function (g) {
      var v = x.felul && x.felul.id === g.id ? x.felul.v : g.v, c = g.ism && kesz ? String(F.helyes) : x.felul && x.felul.id === g.id ? String(x.felul.v) : g.c;
      s += szlDarab(xx, y, v * u, SZL_SZIN[i], c, { sz: g.sz, ism: g.ism && !kesz, n: g.n, jelolt: x.kiszin && F.kerdes.cel === g.id, hiba: x.felul && x.felul.id === g.id,
        attr: katt ? ' class="szl-resz" data-id="' + g.id + '" style="cursor:pointer"' : '' });
      xx += v * u;
    });
    if (r.k) {
      var kv = x.felul && x.felul.id === r.k.id ? x.felul.v : r.k.v, kc = r.k.ism && kesz ? String(F.helyes) : x.felul && x.felul.id === r.k.id ? String(x.felul.v) : r.k.c;
      s += szlKapocs(K.x0, K.x0 + kv * u, y, kc, { ism: r.k.ism && !kesz, jelolt: x.kiszin && F.kerdes.cel === r.k.id, hiba: x.felul && x.felul.id === r.k.id,
        attr: katt ? ' class="szl-resz" data-id="' + r.k.id + '" style="cursor:pointer"' : '' });
    }
    /* a letevés helyei: a sor (tekercs) és a sor fölötte (kapocs) */
    if (x.fazis === "kirak" && !JL.lezart) {
      s += '<rect class="jl-hely" data-hely="r' + i + '" x="' + P(K.x0) + '" y="' + (y - 20) + '" width="' + P(K.x1 - K.x0) + '" height="40" rx="10" fill="transparent"/>';
      s += '<rect class="jl-hely" data-hely="k' + i + '" x="' + P(K.x0) + '" y="' + (y - 62) + '" width="' + P(K.x1 - K.x0) + '" height="38" rx="10" fill="transparent"/>';
    }
  });
  /* a polc: tekercs + kapocs */
  if (x.fazis === "kirak" && x.polc && !JL.lezart) {
    s += szlPolcRajz(K, 2);
    x.polc.forEach(function (T, i) {
      if (JL.fog && JL.fog.id === "p" + i) return;
      s += szlTargy(K.polcX[i], K.polcY, T, ' class="jl-fog js-lukt" data-fog="p' + i + '"');
    });
  }
  return s;
}
function szlKi(JL, x, i) {
  var f = JL.f;
  hangGomb();
  if (i === x.f.ki) {
    JL.st.kiJo = (JL.st.kiJo || 0) + 1; x.kiJel = i; x.fazis = "kirak"; szlPolc(x);
    hangCsilla(); szlFelirat(x, szlUtasitas(x)); jlRajz(); mondd(x.f.lepesek[0].mondat + " Vedd fel a tekercset vagy a kapcsot, és tedd a szalaghoz!");
    return;
  }
  /* a „kinek van több?” magában nem ad ✨-t, de a hiba visszahozza a következő feladatokra */
  JL.st.kiJo = 0; x.kiJel = i; jlRajz();
  jlSzol("Hm. Olvasd el még egyszer: kiről mondja, hogy több, és kiről, hogy kevesebb?", true);
  szlVar(f, 900, function () { x.kiJel = null; jlRajz(); });
}
function szlKirakTesz(JL, x, i, hova) {
  var l = x.f.lepesek[x.lep], T = x.polc[i], f = JL.f;
  if (T.t === l.targy.t && hova === l.hova) {
    hangCsilla(); x.lep++;
    if (x.lep < x.f.lepesek.length) {
      szlPolc(x); szlFelirat(x, szlUtasitas(x)); jlRajz(); mondd(x.f.lepesek[x.lep].mondat);
      return;
    }
    x.fazis = "kerdez"; x.polc = null; szlFelirat(x, szlUtasitas(x)); jlRajz(); mondd(x.f.kerdes.mondat + " Koppints arra a részre!");
    return;
  }
  /* rossz letevés: hibának számít (különben a 2 tárgy és a 2 sor tippelhető volna) */
  jlRossz(T.t === "k" ? "kapocs" : "tekercs", szlNaplo("kirak " + x.f.tipus));
  var sorJo = hova.charAt(1) === l.hova.charAt(1), fajtaJo = T.t === l.targy.t && hova.charAt(0) === l.hova.charAt(0), m;
  if (!sorJo && x.f.sorok.length > 1) m = "Kiről szól ez a mondat? Az ő szalagjához tedd!";
  else if (l.targy.t === "k") m = T.t === "k" ? "A kapocs a szalag fölé kerül." : "Ez a szám az egészet mondja meg. Az egész a kapocs, a szalag fölé kerül.";
  else m = T.t === "d" ? "A tekercs a szalag végére kerül." : "Ez a szám egy darab, ami hozzájön: a tekercs a szalag végére kerül.";
  jlRajz(); jlSzol(m, true);
}
function szlKerdezKatt(JL, x, id) {
  var f = JL.f;
  hangGomb();
  if (id === x.f.kerdes.cel) {
    x.kiszin = true; x.fazis = "felel"; szlFelirat(x, szlUtasitas(x)); jlRajz(); mondd("Igen, ezt kérdezi. Mennyi ez? Írd a táblára!"); jlFokusz();
    return;
  }
  /* a kiszínezés maga nem ad semmit: rossz koppintásra csak a mondatot mondja újra */
  jlSzol("Hm. Olvasd el a kérdést: " + x.f.kerdes.mondat, true);
}
function szlFelel(JL, x, v) {
  var F = x.f, f = JL.f;
  if (v === F.helyes) { x.fazis = "kesz"; x.hod = "orul"; hangCsilla(); jlJo(String(v), null, szlEltart); return; }
  /* rossz szám: a kérdezett rész a beírt hosszal rajzolódik → kilóg / nem ér el */
  var max = 0; F.kerdes.all.forEach(function (r) { var t = 0; r.s.forEach(function (g) { t += g.v; }); max = Math.max(max, t, r.k ? r.k.v : 0); });
  x.felul = { id: F.kerdes.cel, v: Math.max(1, Math.min(v, max * 2)) };
  JL.rossz = String(v); JL.lezart = true; jlRossz(String(v), szlNaplo(F.tipus + " " + F.helyes));
  jlRajz();
  jlSzol(JL.seg >= 2 ? szlLepesSeg(F) : "Hm. Nézd meg a szalagot: így nem illik össze.", true);
  szlVar(f, 1500, function () { x.felul = null; JL.lezart = false; jlRajz(); jlFokusz(); });
}
/* 2. hibától: lépésenként mondja, mit kell kiszámolni (a választ nem) */
function szlLepesSeg(F) {
  var t = F.tipus;
  if (t === "valt-ered" || t === "resz-ered" || t === "ossz-ered" || t === "vonat-keves") return "A kérdezett rész a kapocs alatt van. Add össze a darabokat!";
  if (t === "ossz-kul") return "A szaggatott rész ugyanannyi, mint a másik szalag. Mennyi marad, ha ezt elveszed az egészből?";
  return "A kapocs az egész. Ha elveszed belőle az ismert darabot, mennyi marad?";
}

/* ═════════════════ ⑤ HÁNYAN ÜLTEK FEL? (Autóbusz) ═════════════════ */
/* hol: a kocsi melyik megálló UTÁN van (3 = a végén); ertek[hol] = ennyien ülnek ott (a gyerek mondta, vagy a végén adott) */
function szlBuszElotte(x, hol) { return x.ertek[hol] - x.b.m[hol - 1]; }   /* a hol-adik megálló előtt ennyien ültek */
function szlBuszRajz(JL, x, K) {
  var B = K.busz, y = B.y, F = pcF, s = '', b = x.b;
  s += szlHod(K.hod[0], K.hod[1] - 40, K.hod[2], x.hod || "var");
  /* az út */
  s += '<g filter="url(#lt-firka)"><path d="M' + (B.start - 40) + ' ' + (y + 20) + 'H' + (B.veg + 40) + 'V' + (y + 46) + 'H' + (B.start - 40) + 'Z" fill="#e6d7b8" stroke="#c9ad85" stroke-width="2"/></g>';
  s += '<text x="' + B.start + '" y="' + (y + 68) + '" text-anchor="middle" font-size="13"' + SZL_FR + ' fill="#6b6280">indulás</text>';
  /* a megállók: tábla (+3 / −5) és a fel- / leszálló figurák */
  b.m.forEach(function (d, i) {
    var mx = B.m[i], aktiv = x.fazis === "valaszt" && i === x.hol - 1 && !JL.lezart, kesz = i >= x.hol;
    s += '<g class="szl-megallo" data-i="' + i + '"' + (aktiv ? ' style="cursor:pointer"' : '') + '><rect x="' + (mx - 34) + '" y="' + (y - 120) + '" width="68" height="150" fill="transparent"/>' +
      '<path d="M' + mx + ' ' + (y + 20) + 'V' + (y - 74) + '" stroke="#6e4a36" stroke-width="3"/>' +
      '<rect x="' + (mx - 26) + '" y="' + (y - 104) + '" width="52" height="32" rx="7" fill="' + (d > 0 ? "#dff3e7" : "#ffe3ee") + '" stroke="' + (aktiv ? "#e0417a" : "#8a6a52") + '" stroke-width="' + (aktiv ? 3.4 : 1.8) + '"/>' +
      '<text x="' + mx + '" y="' + (y - 81) + '" text-anchor="middle" font-size="18"' + SZL_FR + ' fill="#3c2a50">' + (d > 0 ? "+" + d : "−" + (-d)) + '</text>';
    if (aktiv && !lkCsokkent()) s += '<circle cx="' + mx + '" cy="' + (y - 88) + '" r="32" fill="none" stroke="#e0417a" stroke-width="2.4"><animate attributeName="r" values="28;38;28" dur="1.2s" repeatCount="indefinite"/></circle>';
    if (x.figurak) {   /* kis figurák a tábla mellett: nyíl fel (felszáll) / le (leszáll) */
      for (var k = 0; k < Math.abs(d); k++) {
        var fx = mx - 22 + (k % 3) * 14, fy = y - 44 - Math.floor(k / 3) * 22;
        s += '<circle cx="' + fx + '" cy="' + (fy - 6) + '" r="5" fill="#f3d2b0" stroke="#8a6a52" stroke-width="1.2"/><path d="M' + (fx - 5) + ' ' + (fy + 8) + 'Q' + fx + ' ' + (fy - 4) + ' ' + (fx + 5) + ' ' + (fy + 8) + 'Z" fill="' + (d > 0 ? "#a7d99a" : "#f6a5c0") + '" stroke="#8a6a52" stroke-width="1.2"/>';
      }
      s += '<path d="M' + (mx + 26) + ' ' + (y - (d > 0 ? 30 : 56)) + 'V' + (y - (d > 0 ? 56 : 30)) + 'M' + (mx + 21) + ' ' + (y - (d > 0 ? 50 : 36)) + 'L' + (mx + 26) + ' ' + (y - (d > 0 ? 57 : 29)) + 'L' + (mx + 31) + ' ' + (y - (d > 0 ? 50 : 36)) + '" fill="none" stroke="' + (d > 0 ? "#3f9e6a" : "#c0567f") + '" stroke-width="2.4" stroke-linecap="round"/>';
    }
    if (kesz && x.ertek[i + 1] != null && i + 1 < 3) s += '<text x="' + (mx + 64) + '" y="' + (y + 68) + '" text-anchor="middle" font-size="13"' + SZL_FR + ' fill="#6b6280">' + x.ertek[i + 1] + ' utas</text>';
    s += '</g>';
  });
  /* a postakocsi */
  var kx = x.fazis === "ir" ? B.m[x.hol - 1] : x.hol === 3 ? B.veg : x.hol === 0 ? B.start : (B.m[x.hol - 1] + B.m[x.hol]) / 2;
  var n = x.fazis === "ir" ? null : x.ertek[x.hol];
  s += szlKocsi(kx, y + 16, n);
  return s;
}
function szlKocsi(x, y, n) {
  var F = pcF;
  return '<g transform="translate(' + F(x) + ' ' + F(y) + ')"><g filter="url(#lt-firka)"><path d="M-40 -10V-54Q-40 -62 -30 -62H34Q42 -62 42 -54V-10Z" fill="#f6c4d2" stroke="#b5607e" stroke-width="2.4"/>' +
    '<rect x="-32" y="-54" width="20" height="16" rx="3" fill="#eaf6ff" stroke="#b5607e" stroke-width="1.6"/><rect x="-6" y="-54" width="20" height="16" rx="3" fill="#eaf6ff" stroke="#b5607e" stroke-width="1.6"/>' +
    '<path d="M-46 -62H48" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round"/></g>' +
    '<circle cx="-24" cy="-6" r="10" fill="#8a6a52" stroke="#4a3624" stroke-width="2"/><circle cx="26" cy="-6" r="10" fill="#8a6a52" stroke="#4a3624" stroke-width="2"/>' +
    (n != null ? '<rect x="18" y="-56" width="34" height="24" rx="7" fill="#fffaf0" stroke="#8a6a52" stroke-width="1.6"/><text x="35" y="-38.5" text-anchor="middle" font-size="16"' + SZL_FR + ' fill="#3c2a50">' + n + '</text>' :
      '<rect x="18" y="-56" width="34" height="24" rx="7" fill="#fffaf0" stroke="#e0417a" stroke-width="2"/><text x="35" y="-38.5" text-anchor="middle" font-size="16"' + SZL_FR + ' fill="#e0417a">?</text>') + '</g>';
}
function szlMegallo(JL, x, i) {
  if (i !== x.hol - 1) { jlSzol("Visszafelé megyünk: a villogó megálló jön!", false); return; }
  hangGomb(); x.fazis = "ir"; x.hol = i + 1;   /* a kocsi a megálló előtt áll, és azt kérdezzük: hányan ültek, mielőtt ide ért? */
  var d = x.b.m[i], m = "Hányan ültek a kocsiban, mielőtt ide ért? Itt " + (d > 0 ? szo(d) + " utas felszállt." : szo(-d) + " utas leszállt.");
  szlFelirat(x, "Hányan ültek, mielőtt ide ért? Írd a táblára!"); jlRajz(); mondd(m); jlFokusz();
}
function szlBuszIr(JL, x, v) {
  var kell = szlBuszElotte(x, x.hol), f = JL.f, d = x.b.m[x.hol - 1];
  if (v === kell) {
    hangCsilla(); x.ertek[x.hol - 1] = v; x.hol--;
    if (x.hol === 0) { x.fazis = "kesz"; x.hod = "orul"; jlJo("Induláskor " + v + " utas", null, szlEltart); return; }
    x.fazis = "valaszt"; szlFelirat(x, "Ott " + v + " utas ült. Koppints a következő villogó megállóra!"); jlRajz(); mondd("Igaz! Koppints a következő megállóra!");
    return;
  }
  JL.rossz = String(v); jlRossz(String(v), szlNaplo("busz " + x.b.v));
  jlRajz();
  jlSzol(JL.seg >= 2 ? (d > 0 ? "Itt felszálltak, tehát előtte kevesebben ültek: " + szlVal(d) + " kevesebben." : "Itt leszálltak, tehát előtte többen ültek: " + szlVal(-d) + " többen.") :
    (d > 0 ? "Hm. Itt felszálltak. Előtte többen vagy kevesebben ültek?" : "Hm. Itt leszálltak. Előtte többen vagy kevesebben ültek?"), true);
  jlFokusz();
}

/* ============ 6s4) 🧺 „ELŐBB AZ EGÉSZ” — 2. kód-kör: 🐪 rakodás (Tekercs c) + 🏅 3 Mesterpróba ============
   Tartalom: Matekos\szerszam-letrak-tartalom.html 4.3–4.4 (✅) · átnézés: …-egesz-mit-atnezes.html 4. döntés (✅ Tekercs c) ·
   rajz: …-egesz-rajzterv.html 4–5. pont (✅ mind a 4 döntés).

   📜 (c) RAKODÁS — a Tekercs 5. feladata: két teve, a csomagokat koppintással kell felrakni (rakodas.js, a dobogó testvére).
     Ez a szerszám-pálya dobogós útján fut (szerszam-palya.js: szMutat / szKesz / lift / végigvezetés), nem az olvasó-polcén.
     Rossz elosztásnál a kosár-tipp jön (rakKosarMutat), onnantól a tevék terhe is látszik. 🙋 első sora: „🧺 Tedd a kosárba!”.
   🏅 MESTERPRÓBA — nehézség szerint (SEG_MESTER sorrendje), a versenyfeladat szövege betűhíven:
     1. Vakond Vendel kerítése (Zrínyi 2024/3 M12) · 2. a bűvös tábla (Zrínyi 2020/3 M20) — beírással, az olvasó-polc motorján;
     3. a három teve (Kalmár 2023/3 O1/2) — rakodással, két megoldással: az első után „Ez jó! De van még egy másik is.”
     Mindegyikhez 2 kicsi testvér (🛗 lift) és egy „vissza a nagyra” mondat. Minden sor kap egy magasság-mezőt (mag: évfolyam;
     a módszer-létra később felfelé nő — átnézés 2. pont).
     A kosár a 🙋-ban (rajzterv 4. döntés ✅): az első sor „🧺 Tedd a kosárba!”; az ábra mozgóképe a „?”-ig megy, a választ nem
     mondja meg. Akkor is elindul, ha a gyerek a liftből visszajött és újra elakadt. A végigvezetésben a válaszig megy. */

var SEG_RAK_M = {   /* 🖊️ lektorra */
  van: "Ez jó! De van még egy másik is. Megtalálod?",
  megvolt: "Ezt már megtaláltad! Keress egy másikat.",
  nemEgy: "Nézd meg újra: mindegyik tevén ugyanakkora legyen a teher!",
  suly: function (e) { return "Nézd a tevék terhét: mindegyiken " + e + " kiló legyen!"; },
  mit: "Azt kérdezik, melyik teve melyik csomagot vigye. Rakd fel mindet úgy, hogy egyforma legyen a teher!"
};
/* 📜 (c) és a két kicsi testvére (a lift: ugyanakkora, más számokkal) */
var SEG_RAK_TEK = {
  R: { tevek: ["Fuvi", "Nuvi"], fix: [[2], [4]], uj: [3, 5], per: 1, megold: [[[5], [3]]] },
  mon: ["Két teve, Fuvi és Nuvi csomagokat szállít.", "Fuvi hátán egy 2 kilós csomag van, Nuvi hátán egy 4 kilós.",
        "Még egy 3 és egy 5 kilós csomagot kell felrakni úgy, hogy a két tevén ugyanakkora legyen a teher."],
  kerdes: "Melyik teve melyik csomagot vigye?", vissza: "Előbb az összes súly, aztán egy tevére mennyi jut.",
  kicsi: [
    { R: { tevek: ["Fuvi", "Nuvi"], fix: [[1], [2]], uj: [4, 5], per: 1, megold: [[[5], [4]]] },
      mon: ["Két teve, Fuvi és Nuvi csomagokat szállít az oázisba.", "Fuvi hátán már van egy 1 kilogrammos csomag, Nuvi hátán egy 2 kilogrammos.",
            "Még egy 4 és egy 5 kilogrammos csomagot kell felpakolni úgy, hogy a két tevén ugyanakkora legyen a teher."], kerdes: "Melyik teve melyik csomagot vigye?" },
    { R: { tevek: ["Fuvi", "Nuvi"], fix: [[3], [1]], uj: [2, 4], per: 1, megold: [[[2], [4]]] },   /* 🖊️ új */
      mon: ["Két teve, Fuvi és Nuvi csomagokat szállít.", "Fuvi hátán egy 3 kilós csomag van, Nuvi hátán egy 1 kilós.",
            "Még egy 2 és egy 4 kilós csomagot kell felrakni úgy, hogy a két tevén ugyanakkora legyen a teher."], kerdes: "Melyik teve melyik csomagot vigye?" }]
};

/* 🏅 a Mesterpróba-készlet (nehézség szerint). forma: "beiras" (olvasó-polc motor) | "rakodas" (dobogós út) */
var SEG_MESTER = [
  { id: "zrinyi-2024-3-M-12", cim: "Vakond Vendel kertjei", forras: "Zrínyi 2024 / 3. o. megyei 12.", mag: 3, forma: "beiras",
    abra: { t: "kerites", tri: [30, 30, 40], sq: "?" },
    mon: ["Vakond Vendel háromszög alakú virágos kertjének és négyzet alakú veteményes kertjének ugyanolyan hosszú a kerítése (lásd ábra)."],
    kerdes: "Hány méter hosszú a veteményes kert egy oldala?", v: 25, szo: "a veteményes kert egy oldala",
    oe: { koztes: { 100: "Ez egy lépcsőfok volt: ennyi a teljes kerítés körben. De a négyzet egy oldalát kérdezték!" },
          csap: { 30: "A 30 a háromszög egy oldala. A négyzet kerítése az egész háromszög kerítésével egyforma: előbb azt számold ki!" } },
    lep: [{ k: "Milyen hosszú a virágos kert kerítése körben?", v: 100, m: "30 + 30 + 40 = 100" }, { k: "Hány méter a veteményes kert egy oldala?", v: 25, m: "100 : 4 = 25" }],
    mit: ["hány méter a veteményes kert egy oldala", "milyen hosszú a kerítés körben", "hány méter a háromszög egy oldala"],
    elso: "Ne a háromszög egyik oldalát keresd a négyzeten! Előbb számold ki, milyen hosszú a virágos kert teljes kerítése, körbe mindhárom oldalon. A veteményes kert kerítése ugyanilyen hosszú: hány egyforma oldalra kell ezt szétosztanod?",
    segit: "Előbb a teljes kerítés: 30 + 30 + 40. Ezt kell négy egyforma oldalra szétosztani.",   /* 🖊️ lektorra */
    uto: "Igen! A teljes kerítés 100 méter, és ez négy egyforma oldalra 25 méter.",
    kicsi: [
      { mon: ["Vakond Vendel négyzet alakú kertjének minden oldala 3 méter."], kerdes: "Hány méter hosszú a kerítése körben?", v: 12,
        abra: { t: "kerites", tri: null, sq: 3 }, oe: { csap: { 3: "A 3 egy oldal. A kerítés körbe megy, mind a négy oldalon." } } },
      { mon: ["Vakond Vendel háromszög alakú kertjének mindhárom oldala 4 méter.", "A négyzet alakú kertjének ugyanolyan hosszú a kerítése."],
        kerdes: "Hány méter hosszú a négyzet alakú kert egy oldala?", v: 3, abra: { t: "kerites", tri: [4, 4, 4], sq: "?" },
        oe: { koztes: { 12: "Ez egy lépcsőfok volt: ennyi a teljes kerítés körben. De a négyzet egy oldalát kérdezték!" }, csap: { 4: "A 4 a háromszög egy oldala. Előbb a teljes kerítés!" } } }],
    vissza: "Ügyes! Ugyanaz, csak nagyobb kerttel. Előbb a teljes kerítés, aztán szétosztod." },

  { id: "zrinyi-2020-3-M-20", cim: "A bűvös tábla", forras: "Zrínyi 2020 / 3. o. megyei 20.", mag: 3, forma: "beiras",
    abra: { t: "tabla", sor: [[4, 2, 9], [3, 5, 7], [8, 1, 6]], csere: [[0, 2], [0, 1]], kopp: { adott: [0, 2], kiemel: false } },   /* 👆 a szöveg betűhíven, a csere koppintással */
    mon: ["Az ábrán két számot megcserélünk úgy, hogy minden oszlopban és minden sorban ugyanannyi legyen a számok összege.", "A két szám közül az egyik a 9."],
    kerdes: "Melyik a másik szám?", v: 2, szo: "a másik szám",
    oe: { koztes: { 45: "Ez egy lépcsőfok volt: ennyi mind a kilenc szám együtt. De egy számot kérdeztek!",
                    15: "Ez egy lépcsőfok volt: ennyi kell legyen minden sorban és oszlopban. De melyik szám cserél helyet a 9-cel?" } },
    lep: [{ k: "Mennyi mind a kilenc szám összege?", v: 45, m: "4 + 2 + 9 + 3 + 5 + 7 + 8 + 1 + 6 = 45" }, { k: "Mennyi kell legyen egy sorban?", v: 15, m: "45 : 3 = 15" },
          { k: "Melyik a másik szám?", v: 2, m: "a középső oszlopban 8, a jobb szélsőben 22 van: a 9 és a 2 helyet cserél, és mindkettőben 15 lesz" }],
    mit: ["melyik szám cserél helyet a 9-cel", "mennyi a kilenc szám összege", "mennyi jut egy sorra"],
    elso: "Add össze mind a kilenc számot, és oszd el a három sor között! Ennyi kell legyen minden sorban és minden oszlopban. Most nézd meg: melyik oszlopban kevés, és melyikben sok?",
    segit: "Előbb mind a kilenc szám összege, aztán egy sorra ennek a harmada. Most nézd az oszlopokat: melyikben kevés, és melyikben sok?",   /* 🖊️ lektorra */
    uto: "Igen! A kilenc szám összesen 45, egy sorra 15 jut. A 9 és a 2 helyet cserél, és minden oszlopban 15 lesz.",
    kicsi: [
      { mon: ["Ugyanez a tábla, ugyanazzal a kilenc számmal."], kerdes: "Add össze mind a kilenc számot! Mennyi jut egy sorra, ha a három sorban ugyanannyi az összeg?", v: 15,
        abra: { t: "tabla", sor: [[4, 2, 9], [3, 5, 7], [8, 1, 6]], kopp: { nem: true } }, oe: { koztes: { 45: "Ez egy lépcsőfok volt: ennyi mind a kilenc szám. Mennyi jut egy sorra?" } } },
      { mon: ["Két sorban hat szám áll: fent 1, 2, 3, lent 4, 5, 7.", "Két számot megcserélünk, egyet fentről és egyet lentről, úgy, hogy a két sorban ugyanannyi legyen a számok összege.", "Az egyik szám a 7."],
        kerdes: "Melyik számmal cseréljen helyet a 7, hogy a két sorban ugyanannyi legyen az összeg?", v: 2, abra: { t: "tabla", sor: [[1, 2, 3], [4, 5, 7]], sorCsere: true, kopp: { adott: [1, 2], kiemel: true } },
        oe: { koztes: { 22: "Ez egy lépcsőfok volt: ennyi a hat szám együtt. De melyik szám cserél helyet a 7-tel?", 11: "Ez egy lépcsőfok volt: ennyi kell legyen egy sorban. De melyik szám cserél helyet a 7-tel?" } } }],
    vissza: "Ügyes! Ugyanaz, csak három sorral és három oszloppal. Előbb az összes, aztán egy sorra mennyi jut." },

  { id: "kalmar-2023-3-O1-2", cim: "A három teve", forras: "Kalmár 2023 / 3. o. országos 1. nap 2.", mag: 3, forma: "rakodas",
    R: { tevek: ["Fuvi", "Nuvi", "Tuvi"], fix: [[1], [2], [3]], uj: [4, 5, 6, 7, 8, 9], per: 2, megold: [[[5, 9], [6, 7], [4, 8]], [[6, 8], [4, 9], [5, 7]]] },
    mon: ["Három teve, Fuvi, Nuvi és Tuvi csomagokat szállít az oázisba.", "Fuvi hátán már van egy 1 kilogrammos csomag, Nuvi hátán egy 2 kilogrammos, Tuvi hátán pedig egy 3 kilogrammos csomag.",
          "Még 6 csomagot kell felpakolni, egy 4, egy 5, egy 6, egy 7, egy 8 és egy 9 kilogrammos csomagot.", "Mindegyik teve három csomagot fog szállítani, melyek teljes tömege mindhárom tevén ugyanakkora kell legyen."],
    kerdes: "Melyik teve mely csomagokat vigye? Keresd meg az összes lehetőséget!",
    tobb: "tevénként két új csomaggal", vissza: "Előbb az összes súly, aztán egy tevére mennyi jut.",
    indok: "Mindkettőt megtaláltad! Összesen 45 kiló, egy tevére 15 jut. Fuvinak még 14 kell: ez csak 5 + 9 vagy 6 + 8 lehet.",   /* 🖊️ lektorra (8/5: „Válaszodat indokold!”) */
    kicsi: [
      { R: { tevek: ["Fuvi", "Nuvi"], fix: [[1], [2]], uj: [4, 5], per: 1, megold: [[[5], [4]]] },
        mon: ["Két teve, Fuvi és Nuvi csomagokat szállít az oázisba.", "Fuvi hátán már van egy 1 kilogrammos csomag, Nuvi hátán egy 2 kilogrammos.",
              "Még egy 4 és egy 5 kilogrammos csomagot kell felpakolni úgy, hogy a két tevén ugyanakkora legyen a teher."], kerdes: "Melyik teve melyik csomagot vigye?" },
      { R: { tevek: ["Fuvi", "Nuvi", "Tuvi"], fix: [[1], [2], [3]], uj: [4, 5, 6], per: 1, megold: [[[6], [5], [4]]] },
        mon: ["Három teve, Fuvi, Nuvi és Tuvi csomagokat szállít.", "Fuvi hátán 1, Nuvi hátán 2, Tuvi hátán 3 kilogrammos csomag van.",
              "Még egy 4, egy 5 és egy 6 kilogrammos csomagot kell felpakolni úgy, hogy mindhárom tevén ugyanakkora legyen a teher."], kerdes: "Melyik teve melyik csomagot vigye?" }] }
];
function segMesterAdat(id) { for (var i = 0; i < SEG_MESTER.length; i++) if (SEG_MESTER[i].id === id) return SEG_MESTER[i]; return null; }

/* ═════════════════ 🏅 SZÁMVÁLTOZATOK (Mesterpróba-változatok: a szerszám-Mesterpróbák bekötése, 2026-10-20) ═════════════════
   Terv: Matekos\mesterproba-valtozatok-terv.html (✅). A gyerek emlékszik a már megoldott Mesterpróba válaszára, ezért a
   második találkozástól számváltozat jön (a közös szabály: mester-valtozat.js). A három 🧺 Mesterpróba a játékba van írva,
   ezért a változatok is itt készülnek, recept szerint. Az első kéréskor a játék maga ellenőrzi őket (segValtJo): ami nem
   stimmel, az kimarad. A versenyfeladat mondatai ugyanazok, csak a számok mások. A bagoly-tudás (lépcsőfok, csapda,
   végigvezetés, tipp) a változat számaiból készül. A kicsi testvérek az eredetiek, kivéve a bűvös tábla „Ugyanez a tábla”
   kicsijét: az a változat tábláját mutatja.
     · kerítés: egyenlő szárú háromszög [a, a, b]; a kerület osztható 4-gyel, és legfeljebb 100 m (fejben számolható);
     · bűvös tábla: a 3×3-as bűvös négyzet egyik tükörképe vagy elforgatása, minden számhoz + k, és két szám egy sorban
       vagy egy oszlopban helyet cserél; a megadott számhoz pontosan egy jó csere van;
     · tevék: más alap-csomagok és hat egymás utáni szám, pontosan két jó elosztással; Fuvinak két lehetősége van. */
var SEG_VALT_KERITES = [[20, 24], [30, 36], [15, 18], [28, 32], [22, 28], [25, 30]];          /* [a, b]: a háromszög szára és alapja */
var SEG_VALT_TABLA = [   /* [tükörkép / forgatás 0–7, + k, egyik hely, másik hely, melyik a megadott (0 | 1)] */
  [1, 1, [0, 0], [0, 2], 0], [2, 2, [0, 1], [2, 1], 1], [3, 3, [1, 0], [1, 2], 0],
  [4, 0, [0, 2], [2, 2], 0], [5, 4, [2, 0], [2, 1], 1], [6, 2, [0, 0], [1, 0], 1]];
var SEG_VALT_TEVE = [[[2, 3, 4], 5], [[2, 3, 1], 6], [[1, 3, 5], 7], [[2, 1, 3], 5], [[3, 4, 5], 6], [[3, 5, 1], 7]];   /* [alap-csomagok, a legkisebb új csomag] */
var SEG_LOSHU = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
var SEG_VALT = null;                                       /* { alapId: [változat…] } — az első kéréskor készül */

function segMesterValt(fid) { if (!SEG_VALT) SEG_VALT = segValtKeszit(); return SEG_VALT[fid] || []; }
function segValtKeszit() {
  var V = {};
  SEG_MESTER.forEach(function (D) {
    var L = [], R = D.id === "zrinyi-2024-3-M-12" ? SEG_VALT_KERITES.map(segValtKerites) : D.id === "zrinyi-2020-3-M-20" ? SEG_VALT_TABLA.map(segValtTabla)
      : D.id === "kalmar-2023-3-O1-2" ? SEG_VALT_TEVE.map(segValtTeve) : [];
    R.forEach(function (x, i) {
      if (!x) return;
      var v = {}, k; for (k in D) v[k] = D[k]; for (k in x) v[k] = x[k];
      v.id = D.id + "-v" + (i < 9 ? "0" : "") + (i + 1); v.alapId = D.id;
      var hiba = segValtJo(v, D);
      if (hiba) { if (typeof console !== "undefined") console.warn("🏅 kimaradt változat " + v.id + ": " + hiba); return; }
      L.push(v);
    });
    V[D.id] = L;
  });
  return V;
}

/* kerítés: [a, a, b] → a kerület, és ennek a negyede */
function segValtKerites(ab) {
  var a = ab[0], b = ab[1], P = 2 * a + b, s = P / 4;
  if (P % 4 || P > 100) return null;
  var csap = {}, koz = {}, cm = function (n) { return "A " + n + " a háromszög egy oldala. A négyzet kerítése az egész háromszög kerítésével egyforma: előbb azt számold ki!"; };
  csap[a] = cm(a); csap[b] = cm(b);
  koz[P] = "Ez egy lépcsőfok volt: ennyi a teljes kerítés körben. De a négyzet egy oldalát kérdezték!";
  return { abra: { t: "kerites", tri: [a, a, b], sq: "?" }, v: s, oe: { koztes: koz, csap: csap },
    lep: [{ k: "Milyen hosszú a virágos kert kerítése körben?", v: P, m: a + " + " + a + " + " + b + " = " + P }, { k: "Hány méter a veteményes kert egy oldala?", v: s, m: P + " : 4 = " + s }],
    segit: "Előbb a teljes kerítés: " + a + " + " + a + " + " + b + ". Ezt kell négy egyforma oldalra szétosztani.",
    uto: "Igen! A teljes kerítés " + P + " méter, és ez négy egyforma oldalra " + s + " méter." };
}

/* bűvös tábla */
function segTablaSzim(i) {                                 /* a 8 tükörkép / elforgatás: páros = forgatás, páratlan = ugyanez tükrözve */
  var m = SEG_LOSHU, rot = function (q) { return q[0].map(function (_, j) { return q.map(function (r) { return r[j]; }).reverse(); }); };
  var tr = function (q) { return q[0].map(function (_, j) { return q.map(function (r) { return r[j]; }); }); };
  for (var k = 0; k < Math.floor(i / 2); k++) m = rot(m);
  return i % 2 ? tr(m) : m;
}
function segTablaCsere(S, a, b) { S = S.map(function (r) { return r.slice(); }); var t = S[a[0]][a[1]]; S[a[0]][a[1]] = S[b[0]][b[1]]; S[b[0]][b[1]] = t; return S; }
function segTablaBuvos(S) {
  var E = S.reduce(function (o, r) { return o + segSum(r); }, 0) / S.length;
  return S.every(function (r) { return segSum(r) === E; }) && S[0].every(function (_, j) { return S.reduce(function (o, r) { return o + r[j]; }, 0) === E; });
}
var SEG_OSZLOP_NEV = [["a bal szélső", "a bal szélsőben"], ["a középső", "a középsőben"], ["a jobb szélső", "a jobb szélsőben"]];
var SEG_SOR_NEV = [["a felső", "a felsőben"], ["a középső", "a középsőben"], ["az alsó", "az alsóban"]];
function segValtTabla(p) {
  var k = p[1], M = segTablaSzim(p[0]).map(function (r) { return r.map(function (x) { return x + k; }); });
  var B = segTablaCsere(M, p[2], p[3]), ad = p[4] ? p[3] : p[2], ma = p[4] ? p[2] : p[3], g = B[ad[0]][ad[1]], x = B[ma[0]][ma[1]];
  var sorban = p[2][0] === p[3][0];                        /* egy sorban cserélnek → az oszlopok romlottak el (mint az eredetiben) */
  var S = B.reduce(function (o, r) { return o + segSum(r); }, 0), E = S / 3, szk = sorban ? "oszlopban" : "sorban";
  var N = sorban ? SEG_OSZLOP_NEV : SEG_SOR_NEV, ket = sorban ? [p[2][1], p[3][1]] : [p[2][0], p[3][0]];
  ket.sort(function (a, b) { return a - b; });
  var ossz = function (h) { return sorban ? B.reduce(function (o, r) { return o + r[h]; }, 0) : segSum(B[h]); };
  var hol = N[ket[0]][0] + " " + szk + " " + ossz(ket[0]) + ", " + N[ket[1]][1] + " " + ossz(ket[1]) + " van";   /* „a középső oszlopban 8, a jobb szélsőben 22 van” */
  var koz = {}, kk = {};
  koz[S] = "Ez egy lépcsőfok volt: ennyi mind a kilenc szám együtt. De egy számot kérdeztek!";
  koz[E] = "Ez egy lépcsőfok volt: ennyi kell legyen minden sorban és oszlopban. De melyik szám cserél helyet " + mAz(g) + " " + ekRag(g, "val") + "?";
  var K = segMesterAdat("zrinyi-2020-3-M-20").kicsi;
  kk[S] = "Ez egy lépcsőfok volt: ennyi mind a kilenc szám. Mennyi jut egy sorra?";
  return { abra: { t: "tabla", sor: B, csere: [ad, ma], kopp: { adott: ad, kiemel: false } },
    mon: ["Az ábrán két számot megcserélünk úgy, hogy minden oszlopban és minden sorban ugyanannyi legyen a számok összege.", "A két szám közül az egyik " + ekA(g) + "."],
    v: x, oe: { koztes: koz },
    lep: [{ k: "Mennyi mind a kilenc szám összege?", v: S, m: B.map(function (r) { return r.join(" + "); }).join(" + ") + " = " + S }, { k: "Mennyi kell legyen egy sorban?", v: E, m: S + " : 3 = " + E },
          { k: "Melyik a másik szám?", v: x, m: hol + ": " + ekA(g) + " és " + ekA(x) + " helyet cserél, és mindkettőben " + E + " lesz" }],
    mit: ["melyik szám cserél helyet " + mAz(g) + " " + ekRag(g, "val"), "mennyi a kilenc szám összege", "mennyi jut egy sorra"],
    elso: "Add össze mind a kilenc számot, és oszd el a három sor között! Ennyi kell legyen minden sorban és minden oszlopban. Most nézd meg: melyik " + szk + " kevés, és melyikben sok?",
    segit: "Előbb mind a kilenc szám összege, aztán egy sorra ennek a harmada. Most nézd " + (sorban ? "az oszlopokat" : "a sorokat") + ": melyikben kevés, és melyikben sok?",   /* 🖊️ lektorra */
    uto: "Igen! A kilenc szám összesen " + S + ", egy sorra " + E + " jut. " + ekA(g, true) + " és " + ekA(x) + " helyet cserél, és minden " + szk + " " + E + " lesz.",
    kicsi: [{ mon: K[0].mon, kerdes: K[0].kerdes, v: E, abra: { t: "tabla", sor: B, kopp: { nem: true } }, oe: { koztes: kk } }, K[1]] };
}

/* tevék: minden jó elosztás (tevénként per darab, egyforma teherrel) */
function segRakMegoldasok(fix, uj, per) {
  var T = fix.length, E = (segSum(fix) + segSum(uj)) / T, ki = [];
  if (E % 1) return ki;
  (function lep(t, mar, eddig) {
    if (t === T) { if (!mar.length) ki.push(eddig); return; }
    (function valaszt(tol, vett, sum) {
      if (vett.length === per) { if (sum === E - fix[t]) lep(t + 1, mar.filter(function (x) { return vett.indexOf(x) < 0; }), eddig.concat([vett])); return; }
      for (var i = tol; i < mar.length; i++) valaszt(i + 1, vett.concat([mar[i]]), sum + mar[i]);
    })(0, [], 0);
  })(0, uj.slice(), []);
  return ki;
}
function segValtTeve(p) {
  var fix = p[0], uj = [0, 1, 2, 3, 4, 5].map(function (i) { return p[1] + i; }), m = segRakMegoldasok(fix, uj, 2);
  if (m.length !== 2 || m[0][0].join() === m[1][0].join()) return null;
  var O = segSum(fix) + segSum(uj), E = O / 3;
  return { R: { tevek: ["Fuvi", "Nuvi", "Tuvi"], fix: fix.map(function (x) { return [x]; }), uj: uj, per: 2, megold: m },
    mon: ["Három teve, Fuvi, Nuvi és Tuvi csomagokat szállít az oázisba.",
          "Fuvi hátán már van egy " + fix[0] + " kilogrammos csomag, Nuvi hátán egy " + fix[1] + " kilogrammos, Tuvi hátán pedig egy " + fix[2] + " kilogrammos csomag.",
          "Még 6 csomagot kell felpakolni, " + uj.slice(0, 5).map(function (x) { return "egy " + x; }).join(", ") + " és egy " + uj[5] + " kilogrammos csomagot.",
          "Mindegyik teve három csomagot fog szállítani, melyek teljes tömege mindhárom tevén ugyanakkora kell legyen."],
    indok: "Mindkettőt megtaláltad! Összesen " + O + " kiló, egy tevére " + E + " jut. Fuvinak még " + (E - fix[0]) + " kell: ez csak " + m[0][0].join(" + ") + " vagy " + m[1][0].join(" + ") + " lehet." };
}

/* önellenőrzés: a változat válasza más, mint az eredetié, és a bagoly-tudás a változat számaira illik. Visszaad: a hiba | "" */
function segValtJo(v, D) {
  if (v.forma === "rakodas") {
    var R = v.R;
    if (segRakMegoldasok(R.fix.map(function (x) { return x[0]; }), R.uj, R.per).length !== 2) return "nem két megoldás";
    if (rakMegoldKulcs(R.megold[0]) === rakMegoldKulcs(D.R.megold[0])) return "ugyanaz, mint az eredeti";
    if (R.uj.some(function (x) { return R.fix.some(function (f) { return f[0] === x; }); })) return "alap- és új csomag egyforma";
    return "";
  }
  if (v.v === D.v) return "a válasz ugyanaz, mint az eredetiben";
  if (v.lep[v.lep.length - 1].v !== v.v) return "a végigvezetés nem a válasznál ér véget";
  if (v.abra.t === "kerites") {
    var t = v.abra.tri;
    if (segSum(t) !== 4 * v.v || t[0] * 2 <= t[2]) return "rossz kerítés";
    return v.oe.csap[v.v] ? "a válasz csapda is" : "";
  }
  var B = v.abra.sor, ad = v.abra.kopp.adott, n = 0, L = [], i, j;
  for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) if (!(i === ad[0] && j === ad[1]) && segTablaBuvos(segTablaCsere(B, ad, [i, j]))) { n++; if (B[i][j] !== v.v) return "más csere is jó"; }
  if (n !== 1) return "nem egy jó csere";
  if (segTablaBuvos(B)) return "a tábla már bűvös";
  B.forEach(function (r) { L = L.concat(r); });
  if (L.some(function (x, k) { return L.indexOf(x) !== k; })) return "ismétlődő szám";
  return "";
}
mvForras(function () { return SEG_MESTER.map(function (m) { return m.id; }); }, {
  helyi: true, valt: segMesterValt,
  palya: function () { return "sz-egesz-mester"; }, hely: function () { return null; }   /* a 🧺-nak nincs saját kockája: a mester-szalag fényesedik */
});

/* ═════════════════ 🐪 RAKODÁS a szerszám-pályán ═════════════════ */
function segRakMasol(R) { var x = JSON.parse(JSON.stringify(R)); x.sulyLat = false; return x; }
function segCsomagot(kg) { return mAz(kg) + " " + ekRag(kg, "os") + "t"; }     /* „az 5-öst”, „a 3-ast” */
/* a végigvezetés lépései (szVegigFut: t = mondat, tesz = [[sor, hely, id]], kosar = a kis kosár előjön) */
function segRakLep(R, m, masodik) {
  var T = R.tevek.length, O = rakOssz(R), E = rakEgy(R), L = [];
  var dar = R.fix.reduce(function (a, t) { return a.concat(t); }, []).concat(R.uj);
  if (!masodik) {
    L.push({ t: "Előbb az összes súly: " + dar.join(" + ") + " = " + O + " kg.", kosar: true });
    L.push({ t: "Egy tevére " + O + " : " + T + " = " + E + " kg jut." });
  }
  R.tevek.forEach(function (nv, k) {
    var van = R.fix[k].reduce(function (a, b) { return a + b; }, 0), kell = E - van, pk = m[k], t;
    var mit = pk.map(segCsomagot).join(" és ");
    if (masodik) t = (k === 0 ? "A másik lehetőség: " : "") + nv + " " + mit + " viszi.";
    else {
      t = nv + "nak már van " + van + " kilója: még " + kell + " kell.";
      if (k === 0 && R.megold.length > 1) t += " Ez lehet " + R.megold.map(function (x) { return x[0].join(" + "); }).join(" vagy ") + ". Először:";
      t += " " + nv + " " + mit + " viszi.";
    }
    var tesz = pk.map(function (kg, p) { return [0, p * T + k, rakId(kg)]; });
    L.push({ t: t, tesz: tesz });
  });
  return L;
}
function segRakKiir(R, m) { return R.tevek.map(function (nv, k) { return nv + ": " + R.fix[k].concat(m[k]).join(" + ") + " = " + rakEgy(R) + " kg"; }).join(" · "); }
/* a tartalom → a szerszám-pálya feladata (szFeladatKesz alakja) */
function segRakFeladat(R, o) {
  return { forma: "dobogo", fok: o.fok, fid: o.fid, nevek: R.tevek.slice(), mon: o.mon.map(function (s) { return { s: s }; }), kerdes: o.kerdes,
    dob: rakDob(R), nezet: function (A) { return A; }, lep: segRakLep(R, R.megold[0], false), joKiir: segRakKiir(R, R.megold[0]),
    rakodas: R, tobb: o.tobb || "", vissza: o.vissza || "", indok: o.indok || "", mester: o.fok === "mester", mitKerdez: SEG_RAK_M.mit };
}
function segRakNagy(c, kicsiJo) {
  var F = szFeladatKesz(c, "EGESZ", "nagy", null);
  J.sz.L.nagy = true; J.sz.L.kicsiJoKell = kicsiJo;
  return F;
}
/* 📜 (c) — a Tekercs 5. feladata */
function segRakTekercs() {
  var T = SEG_RAK_TEK;
  return segRakNagy(segRakFeladat(segRakMasol(T.R), { fok: "tekercs", fid: "EGESZ-tekercs-c", mon: T.mon, kerdes: T.kerdes, vissza: T.vissza }), 1);
}
/* 🛗 a rakodás kicsije (szerszam-palya.js szKicsi → SZ_TARTALOM.EGESZ.kicsi) */
SZ_TARTALOM.EGESZ = {
  kicsi: function (nagy, k) {
    var D = nagy.mester ? segMesterAdat(nagy.fid) : null, L = nagy.rakKicsi || (D || SEG_RAK_TEK).kicsi, x = L[Math.min(k, L.length - 1)];   /* 🔮: generált kicsik */
    return segRakFeladat(segRakMasol(x.R), { fok: "kicsi", fid: nagy.fid + "-kicsi-" + (k + 1), mon: x.mon, kerdes: x.kerdes });
  }
};
/* Kész után (szerszam-palya.js szKesz hívja): a két megoldású rakodás „van még egy” része. true = kezelte. */
function segRakKesz(f, jo) {
  var R = f.rakodas; if (!R || R.megold.length < 2 || f.szerep !== "nagy" || !DOB) return false;
  var k = rakKulcs(R, DOB.hely[0]), v = $("visszajelzes");
  var masik = function () { return R.megold.filter(function (m) { return rakMegoldKulcs(m) !== R.talalt; })[0] || R.megold[1]; };
  if (!R.talalt) {
    if (!jo) return false;                                       /* az első keresés: a szokásos rossz-út (lift, végigvezetés) */
    R.talalt = k;
    if (J.sz && J.sz.L && !f.vegigVolt) liftJo(J.sz.L);           /* az első megoldás elsőre jó volt-e (mester-szalag) */
    var m2 = masik(), T = R.tevek.length;
    f.dob.jo = [f.dob.jo[0].map(function (x, i) { return rakId(m2[i % T][Math.floor(i / T)]); })];   /* a végigvezetésnek / a gépi próbának */
    hangJo(); figArc("ujjong");
    dobogoUrit();
    v.className = "visszajelzes jo"; v.textContent = "🦉 " + SEG_RAK_M.van;
    if (f.vegigVolt) { f.lep = segRakLep(R, m2, true); mondd(SEG_RAK_M.van, function () { if (J && J.feladat === f) szVegigFut(f); }); }
    else mondd(SEG_RAK_M.van);
    ment();
    return true;
  }
  if (k === R.talalt) { v.className = "visszajelzes"; v.textContent = "🦉 " + SEG_RAK_M.megvolt; mondd(SEG_RAK_M.megvolt); return true; }
  if (jo) { f.joKiir = "Mindkét elosztás megvan!"; return false; }   /* a másik is megvan → kész (szJo) */
  R.hiba2 = (R.hiba2 || 0) + 1;                                  /* a második keresés: nem fogy próba, csak tipp; 3. után együtt */
  if (R.hiba2 >= 3 && !f.vegigVolt) { f.lep = segRakLep(R, masik(), true); szVegigFut(f); return true; }
  segRakHiba(f);
  return true;
}
/* rossz elosztás (szHibaMutat helyett): a Tekercsben és a liftben rögtön a kosár-tipp; a Mesterpróbán előbb csak egy
   figyelmeztetés — a kosár ott a 🙋-ban van, vagy ha a gyerek a liftből visszajött (rajzterv 4. döntés) */
function segRakHiba(f) {
  var R = f.rakodas, L = J.sz && J.sz.L, v = $("visszajelzes"), m;
  if (DOB) { DOB.kez = null; DOB.cel = null; }
  if (R.sulyLat) m = SEG_RAK_M.suly(rakEgy(R));
  else if (f.mester && f.szerep === "nagy" && !(L && L.lift) && !R.talalt) m = SEG_RAK_M.nemEgy;
  else m = rakKosarMutat(f);
  if (DOB) dobRajz();
  v.className = "visszajelzes ek-csapda"; v.textContent = "🦉 " + m;
  mondd(ekKiejt(m));
}
/* 🙋 „🧺 Tedd a kosárba!” a rakodáson */
function segRakSegit(f) {
  var L = J.sz && J.sz.L;
  if (f.szerep === "nagy" && L) L.seg = Math.max(L.seg || 0, 2);
  f.kosarSegitVolt = true;
  var m = rakKosarMutat(f), v = $("visszajelzes");
  v.className = "visszajelzes"; v.textContent = "🦉 🧺 " + m;
  mondd(ekKiejt(m));
}

/* ═════════════════ 🏅 MESTERPRÓBA ═════════════════ */
function segMester() {
  /* a közös szabály (szerszam-palya.js szMesterKiv → mester-valtozat.js): eredeti, vagy a második találkozástól számváltozat.
     A nyomon követés (lift, napló, Kockavár) mindig az eredeti azonosítójával megy (fid), a számok a változatéi (D). */
  var V = szMesterKiv(SEG_MESTER.map(function (m) { return m.id; })), fid = segMesterAdat(V.fid) ? V.fid : SEG_MESTER[0].id, D = V.valt || segMesterAdat(fid);
  var F;
  if (D.forma === "rakodas") {
    F = segRakNagy(segRakFeladat(segRakMasol(D.R), { fok: "mester", fid: fid, mon: D.mon, kerdes: D.kerdes, tobb: D.tobb, vissza: D.vissza, indok: D.indok }), 2);
  } else {
    var oe = { szo: D.szo, koztes: {}, masik: {}, csap: {} }, n;
    for (n in D.oe.koztes || {}) oe.koztes[n] = { m: D.oe.koztes[n] };
    for (n in D.oe.csap || {}) oe.csap[n] = { m: D.oe.csap[n] };
    var M = { keret: "mester", mondatok: D.mon, kerdes: D.kerdes, helyes: D.v, oe: oe, lep: D.lep, mit: D.mit, rajz: '<div class="eg-abra"></div>', fid: fid };
    var L = liftUj({ sz: "EGESZ", palya: J.palya.id, fok: "mester", fid: fid });
    L.nagy = true; L.kicsiJoKell = 2; J.polc.L = L; J.polc.kicsiHiba = 0; J.sz.L = L;
    F = polcNagy(M, "EGESZ", "mester", L);
    F.mester = { kicsi: D.kicsi, elso: D.elso, vissza: D.vissza }; F.kicsiGen = segMesterKicsi; F.egAbra = segAbraUj(D.abra, D.segit);
    if (D.abra.kopp && D.abra.kopp.adott) F.oe = M.oe = segKoppOe(F.egAbra.p, D.v, D.szo);   /* 👆 a koppintott szám a válasz */
    F.utoMondat = D.uto; F.naplo.tipus = "sz-egesz-mester";
  }
  F.op.mester = true; F.op.segit = !F.rakodas; F.kartyaHTML = opKonyv(F.op); F.opElo = POLC_M.mester;
  J.polc.mesterFid = fid;
  if (V.valt && F.naplo) F.naplo.valtozat = V.valt.id;
  return F;
}
/* 🛗 a beírásos Mesterpróba kicsi testvérei (olvaso-polc.js polcKicsiFeladat → N.kicsiGen) */
function segMesterKicsi(N, idx) {
  var D = N.mester && N.mester.kicsi ? N.mester : segMesterAdat(N.M.fid), T = D.kicsi[Math.min(idx, D.kicsi.length - 1)];   /* 🔮: a generált testvérek az N.mester-ben */
  var oe = { szo: "", koztes: {}, masik: {}, csap: {} }, n;
  for (n in (T.oe && T.oe.koztes) || {}) oe.koztes[n] = { m: T.oe.koztes[n] };
  for (n in (T.oe && T.oe.csap) || {}) oe.csap[n] = { m: T.oe.csap[n] };
  N.polcVissza = D.vissza;
  var f = { csalad: "egyenkent", polc: "EGESZ", polcSzerep: "kicsi", polcKicsiVeg: true, polcN: N, helyes: T.v, oe: oe, jegyMax: 3, lanc: null, liftKeres: true,
    op: { mondatok: N.op.mondatok, kerdes: N.op.kerdes, rajz: '<div class="eg-abra"></div>', fuzet: { mondatok: T.mon, kerdes: T.kerdes } }, egAbra: segAbraUj(T.abra, T.segit || ""),
    szoveg: ekSima(T.kerdes), megoldas: String(T.v), keplet: "", tipp: "",
    naplo: { tipus: "sz-egesz-mester-kicsi", kerdes: ekSima(T.kerdes).slice(0, 60), helyes: T.v, atlepes: false } };
  if (T.abra.kopp && T.abra.kopp.adott) f.oe = segKoppOe(f.egAbra.p, T.v, "");   /* 👆 */
  f.felolvas = ekKiejt(T.mon.concat([T.kerdes]).join(" "));
  f.kartyaHTML = opKonyv(f.op);
  return f;
}

/* ═════════════════ 🏅 az ábrák és a kosár-mozgókép (a jobb lapon) ═════════════════
   E = { p: az ábra adatai, A: a kirajzolt kép sorszáma, kerdo: eddig megy a 🙋 („?”), max: a végigvezetés vége, segit: a bagoly mondata }
   kerítés: 0 ábra · 1 a háromszög kerítése kiegyenesedik egy szalaggá (🧺 100 m) · 2 négy egyforma darab „?” · 3 a válasz
   tábla:   0 ábra · 1 🧺 a kilenc szám összege · 2 soronként 15 · 3 oszlopok összege (kevés kékkel, sok naranccsal) · 4 a csere */
var SEG_ABRA = null;          /* { E, el, idok } — az éppen látható ábra */
function segAbraUj(p, segit) {
  p = JSON.parse(JSON.stringify(p));                             /* saját példány: a 👆 csere állapota (p.cs) a feladaté */
  if (p.kopp && p.kopp.adott) return { p: p, A: 0, kerdo: p.sorCsere ? 2 : 3, max: p.sorCsere ? 2 : 3, segit: segit };   /* 👆 a csere a gyereké: a mozgókép az összegekig megy */
  var mozog = p.t === "kerites" ? !!(p.tri || p.tegla) && p.sq === "?" : !!p.csere;
  var kerdo = p.t === "kerites" || p.sorCsere ? 2 : 3, max = p.t === "kerites" || p.sorCsere ? 3 : 4;   /* 🔮 két sor: nincs oszlop-lépés */
  return { p: p, A: 0, kerdo: mozog ? kerdo : 0, max: mozog ? max : 0, segit: segit };
}
function segAbraAll(f) { return f ? f.egAbra || (f.polcN && f.polcN.egAbra) || null : null; }
function segAbraStop() { if (SEG_ABRA) SEG_ABRA.idok.forEach(clearTimeout); }
/* polcMutat hívja (a kosár után) */
function segAbraMutat(f) {
  segAbraStop(); SEG_ABRA = null;
  var E = segAbraAll(f), el = document.querySelector("#buborek-feladat .op-jobb .eg-abra");
  if (!E || !el) return;
  var lap = el.closest(".op-jobb"); if (lap) lap.classList.add("kosar-lap");
  SEG_ABRA = { E: E, el: el, idok: [] };
  el.innerHTML = segAbraHTML(E.p, E.A, -1);
  if (f.vezet && !E.vegigVolt && E.max) { E.vegigVolt = true; segAbraFut(f, true); }   /* a végigvezetésben a válaszig (rajzterv 5. pont) */
}
function segAbraFut(f, vegig) {
  var S = SEG_ABRA, E = segAbraAll(f); if (!S || S.E !== E || !E.max) return;
  var cel = vegig ? E.max : Math.max(E.A, E.kerdo), tol = E.A;
  E.A = cel;                                                     /* az állapot rögtön a végső; a képsor csak látvány */
  segAbraStop(); S.idok = [];
  for (var a = tol + 1, t = 0; a <= cel; a++, t += 1500) (function (a, t) {
    S.idok.push(setTimeout(function () { if (SEG_ABRA === S) S.el.innerHTML = segAbraHTML(E.p, a, a); }, t));
  })(a, t);
}
/* 🙋 „🧺 Tedd a kosárba!” a beírásos Mesterpróbán (kosar.js kosarSegit adja át) — és ha a liftből visszajött, és újra elakadt */
function segAbraSegit(f) {
  var E = segAbraAll(f); if (!E) return;
  if (f.polcL) f.polcL.seg = Math.max(f.polcL.seg || 0, 2);
  f.kosarSegitVolt = true;
  segAbraFut(f, false);
  var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 🧺 " + E.segit;
  mondd(ekKiejt(E.segit));
}
function segAbraHTML(p, A, uj) { return p.kopp ? segKoppHTML(p, A, uj) : p.t === "kerites" ? segKeritesSVG(p, A, uj) : segTablaSVG(p, A, uj); }
function segU(a, uj) { return a === uj ? ' class="eg-uj"' : ''; }
function segTx(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.m || 13) + '" font-weight="' + (o.w || 700) + '" fill="' + (o.c || "#4a3b2a") + '">' + s + '</text>'; }
/* kerítés: a bal kert (háromszög vagy 🔮 téglalap, lehet null), a négyzet (sq: oldal-felirat), a szalag */
function segKeritesSVG(p, A, uj) {
  var s = '<svg class="eg-svg" viewBox="0 0 260 196" aria-hidden="true" font-family="Fredoka,system-ui,sans-serif">';
  var t = p.tri || (p.tegla ? [p.tegla[0], p.tegla[1], p.tegla[0], p.tegla[1]] : null), ossz = t ? t.reduce(function (a, b) { return a + b; }, 0) : 0, felel = ossz / 4 + " m";
  var sqx = p.tegla ? 168 : t ? 162 : 92, sqy = 30, sqa = 75, oldal = A >= 3 ? felel : p.sq === "?" ? "?" : p.sq + " m";
  if (p.tri) {
    var b = p.tri[2], a = p.tri[0], h = Math.sqrt(a * a - b * b / 4), sk = Math.min(120 / b, 72 / h), bw = b * sk, hh = h * sk, x0 = 80 - bw / 2;
    s += '<g opacity="' + (A >= 1 ? ".35" : "1") + '"><path d="M' + x0 + ',105 L' + (x0 + bw) + ',105 L80,' + (105 - hh) + ' Z" fill="#dff0d4" stroke="#8a5a2e" stroke-width="3" stroke-dasharray="7 3"/>' +
      segTx(80, 96, "🌷", { m: 16 }) + segTx(x0 + bw / 4 - 6, 104 - hh / 2, a + " m", { a: "end" }) + segTx(x0 + 3 * bw / 4 + 6, 104 - hh / 2, a + " m", { a: "start" }) + segTx(80, 122, b + " m") + '</g>';
  } else if (p.tegla) {
    var w = p.tegla[0], m = p.tegla[1], k0 = Math.min(84 / w, 64 / m), rw = w * k0, rh = m * k0, rx = 80 - rw / 2, ry = 105 - rh;
    s += '<g opacity="' + (A >= 1 ? ".35" : "1") + '"><rect x="' + rx + '" y="' + ry + '" width="' + rw + '" height="' + rh + '" fill="#dff0d4" stroke="#8a5a2e" stroke-width="3" stroke-dasharray="7 3"/>' +
      segTx(80, ry + rh / 2 + 6, "🌷", { m: 16 }) + segTx(80, ry - 6, w + " m") + segTx(80, 122, w + " m") + segTx(rx - 4, ry + rh / 2 + 5, m + " m", { a: "end" }) + segTx(rx + rw + 4, ry + rh / 2 + 5, m + " m", { a: "start" }) + '</g>';
  }
  s += '<rect x="' + sqx + '" y="' + sqy + '" width="' + sqa + '" height="' + sqa + '" fill="#f6ead0" stroke="#8a5a2e" stroke-width="3" stroke-dasharray="7 3"/>' + segTx(sqx + sqa / 2, sqy + sqa / 2 + 6, "🥕", { m: 18 });
  var oc = A >= 3 ? "#3b8a3b" : "#7a5aa8";
  s += segTx(sqx + sqa / 2, sqy - 7, oldal, { c: oc }) + segTx(sqx + sqa / 2, sqy + sqa + 17, oldal, { c: oc }) + segTx(sqx - 5, sqy + sqa / 2 + 5, oldal, { a: "end", c: oc }) + segTx(sqx + sqa + 5, sqy + sqa / 2 + 5, oldal, { a: "start", c: oc });
  if (A >= 1 && t) {
    var k = 220 / ossz, x = 20, szin = p.tri ? ["#f4a6c0", "#f4a6c0", "#a9d4f5"] : ["#f4a6c0", "#a9d4f5", "#f4a6c0", "#a9d4f5"];
    s += '<g' + segU(1, uj) + '>' + segTx(130, 146, "🧺 " + t.join(" + ") + " = " + ossz + " m", { m: 13 }) + '</g>';
    if (A === 1) {
      s += '<g class="' + (uj === 1 ? "eg-no" : "") + '">';
      t.forEach(function (d, i) { s += '<rect x="' + x + '" y="154" width="' + (d * k) + '" height="16" rx="3" fill="' + szin[i] + '" stroke="#8a5a2e" stroke-width="1.6"/>' + segTx(x + d * k / 2, 167, d, { m: 11 }); x += d * k; });
      s += '</g>';
    } else {
      s += '<g' + segU(2, uj) + '>';
      for (var i = 0; i < 4; i++) s += '<rect x="' + (20 + i * 56) + '" y="154" width="52" height="16" rx="3" fill="#ffd27a" stroke="#8a5a2e" stroke-width="1.6"/>' + segTx(46 + i * 56, 188, A >= 3 ? felel : "?", { c: A >= 3 ? "#3b8a3b" : "#7a5aa8" });
      s += '</g>';
    }
  }
  return s + '</svg>';
}
/* bűvös tábla: a számok rácsban; a kosár-sor, a sorok és az oszlopok összege, a végén a csere.
   🔮 két sor (p.sorCsere): nincs oszlop-lépés, a sor-összegek színe mutatja, hol kevés (kék) és hol sok (narancs); a csere a 3. kép */
function segTablaSVG(p, A, uj) {
  var S = p.sor.map(function (r) { return r.slice(); }), R = S.length, C = S[0].length, cs = p.csere, c = 40, x0 = 50, y0 = 8, i, j, CA = p.sorCsere ? 3 : 4;
  if (A >= CA && cs) { var t = S[cs[0][0]][cs[0][1]]; S[cs[0][0]][cs[0][1]] = S[cs[1][0]][cs[1][1]]; S[cs[1][0]][cs[1][1]] = t; }
  var ossz = 0; p.sor.forEach(function (r) { r.forEach(function (x) { ossz += x; }); });
  var E = ossz / R, H = y0 + R * c;
  var s = '<svg class="eg-svg" viewBox="0 0 240 ' + (H + 70) + '" aria-hidden="true" font-family="Fredoka,system-ui,sans-serif">';
  for (i = 0; i < R; i++) for (j = 0; j < C; j++) {
    var cser = cs && A >= CA && ((i === cs[0][0] && j === cs[0][1]) || (i === cs[1][0] && j === cs[1][1]));
    s += '<rect x="' + (x0 + j * c) + '" y="' + (y0 + i * c) + '" width="' + c + '" height="' + c + '" fill="' + (cser ? "#fff3cf" : A === 1 ? "#f6ead0" : "#fff") + '" stroke="#7a6a5a" stroke-width="2"/>' +
      '<g' + (cser ? segU(CA, uj) : "") + '>' + segTx(x0 + j * c + c / 2, y0 + i * c + 27, S[i][j], { m: 20, c: cser ? "#c0447e" : "#3a3040" }) + '</g>';
  }
  if (A >= 1) s += '<g' + segU(1, uj) + '>' + segTx(120, H + 60, "🧺 " + (A >= 2 ? ossz + " : " + R + " = " + E + " egy sorban" : "mind a " + R * C + " szám: " + ossz), { m: 13 }) + '</g>';
  if (A >= 2) {
    s += '<g' + segU(2, uj) + '>';
    for (i = 0; i < R; i++) { var so = S[i].reduce(function (a, b) { return a + b; }, 0); s += segTx(x0 + C * c + 8, y0 + i * c + 26, "= " + so, { a: "start", m: 14, c: !p.sorCsere || so === E ? "#3b8a3b" : so < E ? "#3a78c0" : "#d9772e" }); }
    s += '</g>';
  }
  if (A >= 3 && !p.sorCsere) {
    s += '<g' + segU(3, uj) + '>';
    for (j = 0; j < C; j++) { var o = 0; for (i = 0; i < R; i++) o += S[i][j]; s += segTx(x0 + j * c + c / 2, H + 22, o, { m: 15, c: o < E ? "#3a78c0" : o > E ? "#d9772e" : "#3b8a3b" }); }
    s += '</g>';
  }
  return s + '</svg>';
}

/* ═════════════════ 👆 CSERE KOPPINTÁSSAL (Matekos\szerszam-letrak-egesz-csere-koppintas.html ✅ 2026-10-17) ═════════════════
   A cserés feladatnál (🔮 két sor, 🏅 bűvös tábla és a cserés kicsik) a gyerek nem beír, hanem a képen cserél: a megadott
   számra nem kell koppintani, csak arra, amelyikkel helyet cserél. A két kártya rögtön helyet cserél, és felvillan a sorok
   (a 3×3-asnál az oszlopok) összege: jó csere → zöld, és ott marad; rossz → a bagoly megmondja, mi lett, és visszaugranak.
   A koppintott szám a válasz (ertekel) — ugyanaz a motor: lift, végigvezetés, ✨, láda.
   p.kopp = { adott: [sor, oszlop] (a megadott szám), kiemel: fénylik-e (a 🏅-on nem), gazda: ["Mia", "Samu"] | null, nem: csak nézni (kicsi „egy sorra”) }
   Az állapot a p-n: p.cs = [sor, oszlop] (az épp kipróbált csere), p.jo = jó volt. */
var SEG_KOPP_M = {   /* 🖊️ lektorra */
  kartya: "👆 Koppints a kártyára, amelyiket cserébe adja!",
  szam: function (g) { return "👆 Koppints arra a számra, amelyik " + mAz(g) + " " + ekRag(g, "val") + " helyet cserél!"; },
  sajat: function (ado, kap) { return "Ez " + ado + " kártyája. Cserébe " + kap + " ad egyet: koppints " + kap + " egyik kártyájára!"; },
  jo: "Ez az! Most egyforma.", joTipp: "Így már jó – most egyforma!",
  sor: function (g) { return ekNagy(mAz(g)) + " " + g + " a másik sorból cserél. Koppints egy számra a másik sorban!"; },
  maga: function (g) { return "Ez maga " + mAz(g) + " " + g + ". Melyik számmal cseréljen helyet?"; },
  gazdaRossz: function (a, na, b, nb) { return "Így " + a + " kártyái " + ekRag(na, "t") + " érnek, " + b + " kártyái " + ekRag(nb, "t") + ". Még nem egyforma — nézd, kinél több!"; },
  sorRossz: function (nf, nl) { return "Így fent " + nf + ", lent " + nl + " lesz az összeg. Még nem egyforma — nézd, hol több!"; },
  tablaRossz: "Így nem lesz minden sorban és oszlopban ugyanannyi. Nézd az összegeket!"
};
function segKoppAll(p) {                                    /* a tábla a kipróbált cserével */
  var S = p.sor.map(function (r) { return r.slice(); }), a = p.kopp.adott, c = p.cs;
  if (c && a) { var t = S[a[0]][a[1]]; S[a[0]][a[1]] = S[c[0]][c[1]]; S[c[0]][c[1]] = t; }
  return S;
}
function segSum(r) { return r.reduce(function (a, b) { return a + b; }, 0); }
function segKoppSzabad(p, i, j) {                           /* koppintható-e (válasz lehet-e) */
  var a = p.kopp.adott; if (!a || p.kopp.nem) return false;
  if (i === a[0] && j === a[1]) return false;
  return !(p.sorCsere && i === a[0]);
}
/* minden rossz koppintásra a saját mondata (oe-étlap: csap) — a cserés feladaton csak a táblában lévő szám jöhet válaszként */
function segKoppOe(p, helyes, szo) {
  var oe = { szo: szo || "", koztes: {}, masik: {}, csap: {} };
  p.sor.forEach(function (r, i) { r.forEach(function (x, j) {
    if (!segKoppSzabad(p, i, j) || x === helyes) return;
    var S = segKoppAll({ sor: p.sor, kopp: p.kopp, cs: [i, j] }), m;
    if (p.kopp.gazda) m = SEG_KOPP_M.gazdaRossz(p.kopp.gazda[0], segSum(S[0]), p.kopp.gazda[1], segSum(S[1]));
    else if (p.sorCsere) m = SEG_KOPP_M.sorRossz(segSum(S[0]), segSum(S[1]));
    else m = SEG_KOPP_M.tablaRossz;
    oe.csap[x] = { m: m };
  }); });
  return oe;
}
function segKoppHTML(p, A, uj) {
  var S = segKoppAll(p), R = S.length, C = S[0].length, a = p.kopp.adott, ossz = 0, i, j;
  p.sor.forEach(function (r) { r.forEach(function (x) { ossz += x; }); });
  var E = ossz / R, lat = A >= 2 || !!p.cs, h = '<div class="eg-kopp' + (p.kopp.gazda ? " gazdas" : "") + '">';
  for (i = 0; i < R; i++) {
    var so = segSum(S[i]);
    h += '<div class="eg-ksor">' + (p.kopp.gazda ? '<span class="eg-gazda">' + p.kopp.gazda[i] + '</span>' : '');
    for (j = 0; j < C; j++) {
      var cser = p.cs && ((i === p.cs[0] && j === p.cs[1]) || (a && i === a[0] && j === a[1]));
      var ad = !p.cs && a && p.kopp.kiemel && i === a[0] && j === a[1], sz = segKoppSzabad(p, i, j) && !p.jo;
      var cls = "eg-kartya" + (ad ? " adott" : "") + (cser ? (p.jo ? " jo" : " proba") : "") + (sz ? " szabad" : "");
      h += '<button type="button" class="' + cls + '" data-i="' + i + '" data-j="' + j + '"' + (sz ? "" : ' tabindex="-1"') + '>' + S[i][j] + '</button>';
    }
    h += '<span class="eg-kossz ' + (so === E ? "egy" : so < E ? "kev" : "sok") + (lat ? " lat" : "") + '">= ' + so + '</span></div>';
  }
  if (!p.sorCsere && R > 2 && (A >= 3 || p.cs)) {
    h += '<div class="eg-ksor eg-koszlop">';
    for (j = 0; j < C; j++) { var o = 0; for (i = 0; i < R; i++) o += S[i][j]; h += '<span class="eg-kossz lat ' + (o === E ? "egy" : o < E ? "kev" : "sok") + '">' + o + '</span>'; }
    h += '<span class="eg-kossz"></span></div>';
  }
  if (A >= 1) h += '<div class="eg-kkosar' + (uj === 1 || uj === 2 ? " eg-uj" : "") + '">🧺 ' + (A >= 2 ? ossz + " : " + R + " = " + E + (p.kopp.gazda ? " egyikőjüknek" : " egy sorban") : "mind a " + R * C + (p.kopp.gazda ? " kártya: " : " szám: ") + ossz) + '</div>';
  if (a && !p.kopp.nem && !p.jo) h += '<div class="eg-ksug">' + (p.kopp.gazda ? SEG_KOPP_M.kartya : SEG_KOPP_M.szam(p.sor[a[0]][a[1]])) + '</div>';
  return h + '</div>';
}
/* a koppintás (a dokumentumon figyel: a könyv minden feladatnál újrarajzolódik) */
function segKoppKatt(ev) {
  var b = ev.target.closest ? ev.target.closest(".eg-kartya") : null; if (!b || !J || !J.feladat) return;
  var f = J.feladat, E = segAbraAll(f), p = E && E.p, v = $("visszajelzes");
  if (!p || !p.kopp || p.kopp.nem || p.jo || p.zar || J.joVolt === f) return;
  if (f.polc && polcZar(f)) return;
  var i = +b.getAttribute("data-i"), j = +b.getAttribute("data-j"), a = p.kopp.adott, g = p.sor[a[0]][a[1]], m;
  hangGomb();
  if (i === a[0] && j === a[1]) m = SEG_KOPP_M.maga(g);
  else if (!segKoppSzabad(p, i, j)) m = p.kopp.gazda ? SEG_KOPP_M.sajat(p.kopp.gazda[a[0]], p.kopp.gazda[1 - a[0]]) : SEG_KOPP_M.sor(g);
  if (m) { v.className = "visszajelzes"; v.textContent = "🦉 " + m; mondd(ekKiejt(m)); return; }
  var x = p.sor[i][j];
  p.cs = [i, j]; p.jo = x === f.helyes;
  if (p.jo) f.joKiir = "";                                       /* a dicséret a kép nyelvén (polcDicser: segKoppDicser) */
  if (SEG_ABRA && SEG_ABRA.E === E) { segAbraStop(); SEG_ABRA.el.innerHTML = segAbraHTML(p, E.A, -1); }
  if (!p.jo) {
    p.zar = true;
    setTimeout(function () {
      p.cs = null; p.zar = false;
      if (SEG_ABRA && SEG_ABRA.E === E && J && J.feladat === f) SEG_ABRA.el.innerHTML = segAbraHTML(p, E.A, -1);
    }, 2400);
  }
  ertekel(x);
}
document.addEventListener("click", segKoppKatt);
/* polcMutat hívja (a válaszmód beállítása után): a cserés feladaton nincs beíró doboz, se „Inkább mondom” */
function segKoppMod(f) {
  var E = segAbraAll(f); if (!E || !E.p.kopp || E.p.kopp.nem || !E.p.kopp.adott) return;
  $("beiro-doboz").hidden = true; $("mondom-gomb").style.display = "none"; $("beiras-valt").style.display = "none";
}
/* a jó csere dicsérete (polcDicser hívja) — null, ha nem cserés feladat */
function segKoppDicser(f, elsore) { var E = segAbraAll(f); return E && E.p.kopp && E.p.kopp.adott && !f.vezet ? (elsore ? SEG_KOPP_M.jo : SEG_KOPP_M.joTipp) : null; }

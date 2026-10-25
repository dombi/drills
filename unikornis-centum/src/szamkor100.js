/* ============ 3i) 🪜🏡⚙️ A 100-AS KÖR ÚJ PÁLYÁI — feladatgyártó (terv/eletszeru-100-as-palyak-terv.html 4. + 5. pont) ============
   2. kör (2026-10-23): LÁTHATATLAN közös alap, mint a bolt.js: tiszta adat, kép nélkül; a gépi próba ⑩ piac-őre gyárt
   belőle ezreket. A 3–4. kör rajzolja („épülő utca”: Rokon-létra ház, Számcsalád ház), később a falu házai is ezt kapják.

     🪜 rokon     Rokon-létra: 7 + 5 → 27 + 5 → 67 + 5 (ugyanaz az ugrás, csak egy tízessel arrébb); kivonással 12 − 5 → 42 − 5
     🪜 segit     „Melyik kis feladat segít?”: 48 + 7 mellé 3 kártya, egy a rokon (8 + 7)
     🏡 csalad    Számcsalád: 3 kavics (8, 5, 13) → 4 ablak (8 + 5, 5 + 8, 13 − 5, 13 − 8); kakukktojás: 4 kavicsból 1 kilóg
     ⚙️ gep       Varázsgép (2. csomag): 5 → 12, 9 → 16 … a gyerek beállítja a tárcsát (+7); fordított gép: mi ment be?
   Naplo-formák a tény-motorban: „r” = rokon-létra / segít, „c” = számcsalád, „g” = varázsgép (teny.js fejléce).
   🔒 A létra fokai nem ismétlik a választ (a 27 + 5 eredménye nem a 12); a felhúzott ugrás csak a lépést mutatja. */

function sk100Naplo(a, op, b, forma) {
  return { tipus: op === "+" ? "osszeadas" : "kivonas", kerdes: a + (op === "+" ? " + " : " − ") + b, forma: forma, helyes: op === "+" ? a + b : a - b };
}
/* a számvonal-ugrás a tízesen át: 7 + 5 → [7, 10, 12] és a lépések [3, 2]; 42 − 5 → [42, 40, 37] és [2, 3].
   Ha nem lép át tízest, csak [kezdet, cél] és egy lépés. */
function sk100Ugras(a, op, b) {
  var c = op === "+" ? a + b : a - b, t = op === "+" ? Math.ceil(a / 10) * 10 : Math.floor(a / 10) * 10;
  if (t === a || (op === "+" ? t >= c : t <= c)) return { pontok: [a, c], lepesek: [b] };
  return { pontok: [a, t, c], lepesek: [Math.abs(t - a), Math.abs(c - t)] };
}

/* ── 🪜 Rokon-létra ───────────────────────────────────────────────────────────
   cfg: { op: "+" | "-" (alap "+"), fokok (alap 3), atlepes: true (alap: az alsó fok átlépi a tízest) }
   Az alsó fok egyjegyű tény (7 + 5 / 12 − 5); a többi fok ugyanaz egy-egy (növekvő) tízessel arrébb. */
function rokonLetra(cfg) {
  cfg = cfg || {};
  var op = cfg.op || "+", db = cfg.fokok || 3, at = cfg.atlepes !== false, a, b;
  for (var p = 0; p < 100; p++) {
    if (op === "+") { a = veletlen(2, 9); b = veletlen(2, 9); if (at ? a + b > 10 : a + b < 10) break; }
    else if (at) { a = veletlen(11, 18); b = veletlen(2, 9); if (a - b < 10) break; }   /* 12 − 5 → 42 − 5 */
    else { a = veletlen(3, 9); b = veletlen(2, a - 1); break; }                          /* átlépés nélkül: 8 − 3 → 38 − 3 */
  }
  /* a tízesek: növekvő, különböző eltolások úgy, hogy a felső fok is 100-ban maradjon */
  var maxT = Math.floor((100 - (op === "+" ? a + b : a)) / 10), lehet = [];
  for (var t = 1; t <= maxT; t++) lehet.push(t * 10);
  keverTomb(lehet);
  var tolas = [0].concat(lehet.slice(0, db - 1).sort(function (x, y) { return x - y; }));
  var fokok = tolas.map(function (d) {
    var x = a + d, c = op === "+" ? x + b : x - b;
    return { a: x, b: b, op: op, c: c, ugras: sk100Ugras(x, op, b), naplo: sk100Naplo(x, op, b, "r") };
  });
  return { forma: "rokon", op: op, fokok: fokok };
}

/* ── 🪜 Rokon-létra: EGY LÉTRA MENETE (Pálya-hely B kör, 2026-10-25 · a producer döntése 2026-10-24, rajzterv 6. pont) ──
   Egy fok = egy tízes: 7 + 5, 17 + 5 … 87 + 5, ameddig belefér a 100-ba (mint a százas tábla egy oszlopa) — mindig 9 fok.
   A gyerek ezeket mondja meg, ebben a sorrendben (kerdes): ① az alap (0. fok) · ② egy TÁVOLI rokon (3–4. fok, nem a szomszéd)
   · ③ a létra magától kitölti a „magatol” fokokat, egyenként, alulról · ④ „hiany” db hiányzó a távoli rokon FÖLÖTT, alulról felfelé.
   ⬆️ Csak felfelé (a producer élő próbája, 2026-10-25): a lefelé ugrálás közben a gyerek azt kereste, hol tart. A „tízzel több,
   mint az alatta lévő” nem kiskapu: ez maga a tanulság (a tízes utazik); az alapból gondolkodást a távoli rokon kéri. cfg: { op: "+" | "-", hiany: 3 (alap; az Odú-küszöbön 1), alap: [a, b] } */
function rokonLetraMenet(cfg) {
  cfg = cfg || {};
  var op = cfg.op === "-" ? "-" : "+", hiany = cfg.hiany == null ? 3 : cfg.hiany, a, b, i;
  for (var p = 0; p < 100; p++) {
    if (op === "+") { a = veletlen(2, 9); b = veletlen(2, 9); if (a + b > 10) break; }
    else { a = veletlen(11, 18); b = veletlen(2, 9); if (a - b < 10) break; }   /* 12 − 5 → 42 − 5: az átlépés is öröklődik */
  }
  if (cfg.alap) { a = cfg.alap[0]; b = cfg.alap[1]; }
  var n = Math.floor((100 - (op === "+" ? a + b : a)) / 10) + 1, fokok = [];
  for (i = 0; i < n; i++) { var x = a + 10 * i; fokok.push({ a: x, b: b, op: op, c: op === "+" ? x + b : x - b, ugras: sk100Ugras(x, op, b), naplo: sk100Naplo(x, op, b, "r") }); }
  var tavoli = veletlen(3, Math.min(4, n - 2)), fent = [], szabad = [];
  for (i = tavoli + 1; i < n; i++) fent.push(i);
  var H = keverTomb(fent).slice(0, hiany).sort(function (x, y) { return x - y; });   /* a távoli fölött, alulról felfelé */
  for (i = 1; i < n; i++) if (i !== tavoli && H.indexOf(i) < 0) szabad.push(i);
  return { forma: "letra", op: op, alap: [a, b], fokok: fokok, kerdes: [0, tavoli].concat(H), magatol: szabad };
}
/* 🪜 „Írj te egy rokont!” (az Odú-küszöb csúcsa): a gyerek maga választ fokot az alaphoz (6 + 7 → 46 + 7).
   Jó rokon: egész tízessel arrébb (ugyanaz az egyes, nem maga az alap), és a 100-ban marad. Vissza: { jo, c } */
function rokonSajatEll(alap, x) {
  var a = alap.a, b = alap.b, op = alap.op;
  if (!(x > a) || (x - a) % 10 !== 0) return { jo: false, c: null };
  var c = op === "+" ? x + b : x - b;
  return { jo: x <= 100 && c <= 100 && c >= 0, c: c };
}

/* ── 🪜 „Melyik kis feladat segít?” ───────────────────────────────────────────
   Egy 100-as feladat (kétjegyű ± egyjegyű, átlépéssel) és 3 kártya: a rokon + 2 csali.
   A rokon pontosan az, amit a tény-motor is rokonnak tart (tenyKulcs(...).rokon — a gépi próba összeveti).
   Csalik: a tízes jegye a tag helyén (48 + 7 → 4 + 7), a szomszéd tény (8 + 6), vagy a tízesek (40 + 7). */
function rokonSegit(cfg) {
  cfg = cfg || {};
  var op = cfg.op || (Math.random() < 0.5 ? "+" : "-"), a, b, c;
  for (var p = 0; p < 100; p++) {
    a = veletlen(21, 89); b = veletlen(3, 9);
    if (a % 10 === 0 || !atlepesE(a, b, op)) continue;
    c = op === "+" ? a + b : a - b;
    if (c <= 100 && c >= 10) break;
  }
  var e = a % 10, ra = op === "+" ? e : 10 + e;              /* 48 + 7 → 8 + 7 · 42 − 5 → 12 − 5 */
  var rokon = { a: ra, b: b, op: op };
  var jelolt = [
    { a: Math.floor(a / 10), b: b, op: op },                  /* a tízes jegye a tag helyén */
    { a: ra, b: b + (b < 9 ? 1 : -1), op: op },               /* a szomszéd tény */
    { a: ra, b: b - 1, op: op },
    { a: Math.floor(a / 10) * 10, b: b, op: op }              /* csak a tízesek */
  ].filter(function (k) {
    var v = k.op === "+" ? k.a + k.b : k.a - k.b;
    return k.b >= 1 && v >= 0 && !(k.a === rokon.a && k.b === rokon.b);
  }).filter(function (k, i, t) { return !t.slice(0, i).some(function (m) { return m.a === k.a && m.b === k.b; }); });   /* két egyforma csali se legyen */
  keverTomb(jelolt);
  var kartyak = keverTomb([rokon, jelolt[0], jelolt[1]]).map(function (k) { return { a: k.a, b: k.b, op: k.op, szoveg: k.a + (k.op === "+" ? " + " : " − ") + k.b }; });
  var jo = -1;
  kartyak.forEach(function (k, i) { if (k.a === rokon.a && k.b === rokon.b) jo = i; });
  return { forma: "segit", a: a, b: b, op: op, c: c, kartyak: kartyak, jo: jo, naplo: sk100Naplo(a, op, b, "r") };
}

/* ── 🏡 Számcsalád ────────────────────────────────────────────────────────────
   cfg: { max: 20 | 100 (alap 20), kakukk: true (4. kavics, ami nem tartozik a családba) }
   x + y = z, x ≠ y (különben csak 2 ablak volna). Az ablakok: x + y, y + x, z − x, z − y.
   A kakukktojás közeli szám (z ± 1, z ± 10, x + 1 …), de úgy, hogy a 4 kavicsból SEMMI más hármas ne alkosson családot. */
function szamCsalad(cfg) {
  cfg = cfg || {};
  var max = cfg.max || 20, x, y, z, kakukk = null;
  /* a kakukktojás-állomáson NEM maradhat el (C kör 1. menet): ha egy családhoz nincs egyértelmű kakukk, új családot sorsol */
  for (var k = 0; k < 50; k++) {
    for (var p = 0; p < 100; p++) {
      if (max <= 20) { x = veletlen(2, 9); y = veletlen(2, 9); }
      else { x = veletlen(11, 69); y = veletlen(6, 49); }
      z = x + y;
      if (x !== y && z <= max && (max <= 20 ? z > 10 : z > 20)) break;
    }
    if (!cfg.kakukk) break;
    var jel = [z + 1, z - 1, z + 10, z - 10, x + 1, y - 1, x + 10].filter(function (n) {
      return n > 0 && n <= max && [x, y, z].indexOf(n) < 0 && csaladokSzama([x, y, z, n]) === 1;
    });
    if (jel.length) { kakukk = veletlenElem(jel); break; }
  }
  return csaladBol(x, y, max, kakukk);
}
/* egy család a három számból (x + y = z); kakukk: a 4. kavics (vagy null) */
function csaladBol(x, y, max, kakukk) {
  var z = x + y, kavicsok = kakukk != null ? keverTomb([x, y, z, kakukk]) : [x, y, z];
  return {
    forma: "csalad", max: max, x: x, y: y, z: z, kavicsok: kavicsok, kakukk: kakukk == null ? null : kakukk,
    ablakok: [[x, "+", y, z], [y, "+", x, z], [z, "−", x, y], [z, "−", y, x]],
    naplo: sk100Naplo(x, "+", y, "c")
  };
}
/* 🧺🧺 Két kosár (a Számcsalád 4. állomása, OH 2. o. 85. o.): két számsor, a gyerek mindkettőből választ egyet, és a táblára
   írja az egészet. Bármely pár összege 100 alatt van, és a hat szám mind különbözik (x ≠ y, így 4 ablak lesz). */
function csaladKosarak() {
  for (var p = 0; p < 100; p++) {
    var a = [veletlen(11, 59), veletlen(11, 59), veletlen(11, 59)], b = [veletlen(6, 39), veletlen(6, 39), veletlen(6, 39)], mind = a.concat(b);
    if (mind.every(function (n, i) { return mind.indexOf(n) === i; })) return { a: a, b: b };
  }
  return { a: [23, 38, 46], b: [15, 27, 9] };
}
/* hány különböző családot (p + q = r hármast) alkot egy kavics-sor — a kakukktojás egyértelműségéhez */
function csaladokSzama(l) {
  var db = 0;
  for (var i = 0; i < l.length; i++) for (var j = i + 1; j < l.length; j++) for (var k = 0; k < l.length; k++)
    if (k !== i && k !== j && l[i] + l[j] === l[k] && l[i] !== l[j]) db++;
  return db;
}
/* egy ablak: a gyerek 3 kavicsot rakott be (p op q = r). Vissza: { jo, ok: "jo" | "nem-csalad" (más kavics) | "nem-igaz" (5 − 13) | "megvan" (ez az ablak-alak már kész) }.
   A „+” két sorrendje külön ablak (8 + 5 és 5 + 8), a „−” is (13 − 5 és 13 − 8). keszek: a már kigyúlt ablakok [[p, op, q, r], …] */
function csaladAblakEll(cs, p, op, q, r, keszek) {
  var t = [cs.x, cs.y, cs.z];
  if (!tallerUgyanaz([p, q, r], t)) return { jo: false, ok: "nem-csalad" };
  var igaz = op === "+" ? p + q === r : p - q === r;
  if (!igaz) return { jo: false, ok: "nem-igaz" };
  if ((keszek || []).some(function (w) { return w[0] === p && w[1] === op && w[2] === q; })) return { jo: false, ok: "megvan" };
  return { jo: true, ok: "jo" };
}

/* ── ⚙️ Varázsgép (2. csomag) ──────────────────────────────────────────────────
   cfg: { op: "+" | "-", k: a szabály (alap: 2–9), probak (alap 3), forditott: true (csak a kimenet látszik) }
   Minden be- és kimenet 0–100 között; a próbák különbözők és nem egymás után sorban (a gyerek ne a sorozatot olvassa). */
function varazsGep(cfg) {
  cfg = cfg || {};
  var op = cfg.op || (Math.random() < 0.6 ? "+" : "-"), k = cfg.k || veletlen(2, 9), db = cfg.probak || 3, max = cfg.max || 100;
  var lo = op === "+" ? 1 : k + 1, hi = op === "+" ? max - k : max, be = [];   /* a 0 se be, se ki (a tény-motor nem méri) */
  for (var p = 0; be.length < db + 1 && p < 500; p++) {
    var v = veletlen(lo, Math.min(hi, max <= 20 ? 20 : 99));
    if (be.indexOf(v) < 0 && be.indexOf(v - 1) < 0 && be.indexOf(v + 1) < 0) be.push(v);
  }
  function ki(v) { return op === "+" ? v + k : v - k; }
  var probak = be.slice(0, db).map(function (v) { return [v, ki(v)]; }), kerdes = be[db];
  return {
    forma: "gep", szabaly: { op: op, k: k }, probak: probak, forditott: !!cfg.forditott,
    kerdes: cfg.forditott ? ki(kerdes) : kerdes, valasz: cfg.forditott ? kerdes : ki(kerdes),
    naplo: cfg.forditott ? sk100Naplo(ki(kerdes), op === "+" ? "-" : "+", k, "g") : sk100Naplo(kerdes, op, k, "g")
  };
}

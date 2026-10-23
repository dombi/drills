/* ============ 3h) 🏪 TÜSKE NÉNI BOLTJA — feladatgyártó (terv/eletszeru-100-as-palyak-terv.html 3. + 5. pont) ============
   2. kör (2026-10-23): LÁTHATATLAN közös alap. Semmi nem hívja még a játékban; a gépi próba ⑩ piac-őre gyárt belőle
   ezreket. Tiszta adat, kép nélkül: a bolt képe (3. kör) és később a falu háza ugyanezt kapja.

   A pénz a tallér (nem ✨, nem forint): 1, 2, 5, 10, 20, 50, 100. Egy érme-lista = számok tömbje, pl. [50, 20, 10, 5].
   A színük a helyi érték (HE_SZIN, constants.js). Beváltás: 10 egyes → 1 tízes, 10 tízes → 1 százas (és vissza).

   Három állomás (1. csomag):
     ① fizet    „Fizesd ki!” — Pósa-folyam ugyanarra az árra: 1. fizesd ki · 2. másképp · 3. a legkevesebb érmével
     ② vissza   Visszajáró — a vevő nagyobbal fizet, a gyerek a tenyérbe számol felfelé (37 → 40 → 50)
     ③ blokk    🦊 Róka Juli blokkja — ✓ / ✗ pecsét; a ✗ csak jó javítással ér (🔒 kiskapu: a vaktában ✗ nem visz előre)
   Minden feladat ad egy naplo-mezőt { tipus, kerdes, forma: "b" }: a tény-motor ebből könyvel (teny.js).

   A róka hibái a gyerekek tipikus hibái (ROKA_HIBA), és a tény-motor 100-as típusához kötve kerülnek a
   P().roka naplóba: így látszik majd a pulton (🦊 sor), ha a gyerek mindig ugyanazt a hibát nem veszi észre. */

var TALLER = [1, 2, 5, 10, 20, 50, 100];
var BOLT_ALAP = { rokaPontos: 2, tetelek: 2 };   /* rokaPontos: 5 blokkból ennyi pontos (0–5) · tetelek: tétel a blokkon (2–3) */
function boltBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.bolt) || {};
  var b = {}, k;
  for (k in BOLT_ALAP) b[k] = BOLT_ALAP[k];
  if (+f.rokaPontos >= 0 && +f.rokaPontos <= 5 && f.rokaPontos % 1 === 0) b.rokaPontos = +f.rokaPontos;
  if (f.tetelek === 2 || f.tetelek === 3) b.tetelek = f.tetelek;
  return b;
}

/* ── érme-modell ─────────────────────────────────────────────────────────── */
function tallerOsszeg(l) { var s = 0; (l || []).forEach(function (v) { s += v; }); return s; }
/* a legkevesebb érme (a tallér-sor „kanonikus”: a mohó választás mindig a legkevesebb — a gépi próba DP-vel ellenőrzi) */
function tallerLegkevesebb(n, talca) {
  var t = (talca || TALLER).slice().sort(function (a, b) { return b - a; }), ki = [];
  t.forEach(function (v) { while (n >= v) { ki.push(v); n -= v; } });
  return n === 0 ? ki : null;
}
/* két érme-lista ugyanaz-e (a sorrend nem számít) */
function tallerUgyanaz(a, b) {
  if ((a || []).length !== (b || []).length) return false;
  var x = a.slice().sort(function (p, q) { return p - q; }), y = b.slice().sort(function (p, q) { return p - q; });
  return x.every(function (v, i) { return v === y[i]; });
}
/* beváltás a kasszában: 10 db egyforma `hely` értékű érme (1 vagy 10) → egy 10 × hely; ha nincs 10, null */
function tallerBevalt(l, hely) {
  var db = l.filter(function (v) { return v === hely; }).length;
  if ((hely !== 1 && hely !== 10) || db < 10) return null;
  var ki = l.slice(), n = 10;
  for (var i = ki.length - 1; i >= 0 && n; i--) if (ki[i] === hely) { ki.splice(i, 1); n--; }
  ki.push(hely * 10);
  return ki;
}
/* felváltás (Tüske néni kéri): egy 10-es → tíz 1-es, egy 100-as → tíz 10-es; ha nincs ilyen érme, null */
function tallerFelvalt(l, ertek) {
  var i = l.indexOf(ertek);
  if ((ertek !== 10 && ertek !== 100) || i < 0) return null;
  var ki = l.slice(); ki.splice(i, 1);
  for (var j = 0; j < 10; j++) ki.push(ertek / 10);
  return ki;
}

/* ── ① Fizesd ki! ─────────────────────────────────────────────────────────────
   cfg: { min, max (az ár határai, alap 3–99), talca (a tálca érméi, alap: mind, a 100-as nélkül) }.
   Az ár legalább 3: az 1-et és a 2-t nem lehet „másképp” is kifizetni úgy, hogy a 3. kérdésnek legyen értelme. */
function boltFizet(cfg) {
  cfg = cfg || {};
  var talca = cfg.talca || [1, 2, 5, 10, 20, 50], ar, min, legk;
  for (var p = 0; p < 50; p++) {
    ar = veletlen(Math.max(3, cfg.min || 3), Math.min(100, cfg.max || 99));
    legk = tallerLegkevesebb(ar, talca);
    if (legk && legk.length >= 2) break;   /* egyetlen érmés ár (pl. 20) után a „legkevesebb” kérdés üres volna */
  }
  min = legk.length;
  return {
    forma: "fizet", ar: ar, talca: talca, legkevesebb: legk, minDarab: min,
    naplo: { tipus: "bolt", kerdes: "fizet " + ar, forma: "b" }
  };
}
/* a gyerek fizetése: lepes 1 = fizesd ki · 2 = másképp (elozo: az előző fizetés) · 3 = a legkevesebb érmével
   Vissza: { jo, elteres (összeg − ár), visszatol (ha sok: a vevő ezt az érmét tolja vissza, ha egy is elég), ok } */
function boltFizetEll(f, l, lepes, elozo) {
  var s = tallerOsszeg(l), el = s - f.ar, ki = { jo: false, elteres: el, visszatol: null, ok: "" };
  if (el < 0) { ki.ok = "keves"; return ki; }
  if (el > 0) {
    ki.ok = "sok";
    l.slice().sort(function (a, b) { return a - b; }).some(function (v) { if (v <= el) { ki.visszatol = v; } return v > el; });
    return ki;
  }
  if (lepes === 2 && elozo && tallerUgyanaz(l, elozo)) { ki.ok = "ugyanaz"; return ki; }
  if (lepes === 3 && l.length > f.minDarab) { ki.ok = "tobb-erme"; return ki; }
  ki.jo = true; ki.ok = "jo";
  return ki;
}

/* ── ② Visszajáró ─────────────────────────────────────────────────────────────
   fok: "tizesre"  37 → 40   (a vevő a következő kerek tízessel fizet)
        "tizesbol" 40 → 50   (kerek ár, kerek fizetés)
        "teljes"   37 → 50   (a felfelé számolás két lépésben: +3, +10)
        "szazbol"  63 → 100  (100-assal fizet)
   A lepesek a szalag megállói: [[37, 40], [40, 50]] — a szalag csak azt mutatja, ahová a gyerek már eljutott. */
var VISSZA_FOK = ["tizesre", "tizesbol", "teljes", "szazbol"];
function boltVissza(fok) {
  fok = fok || "teljes";
  var ar, fizet;
  if (fok === "tizesre") { ar = veletlen(11, 89); if (ar % 10 === 0) ar += veletlen(1, 9); fizet = Math.ceil(ar / 10) * 10; }
  else if (fok === "tizesbol") { ar = veletlen(1, 8) * 10; fizet = veletlenElem([20, 50, 100].filter(function (v) { return v > ar; })); }
  else if (fok === "szazbol") { ar = veletlen(51, 89); if (ar % 10 === 0) ar -= veletlen(1, 9); fizet = 100; }   /* 89-ig: a 97 → 100 csak egy lépés volna */
  else { ar = veletlen(11, 89); if (ar % 10 === 0) ar += veletlen(1, 9);
    fizet = veletlenElem([20, 50, 100].filter(function (v) { return v - ar > 10 - ar % 10; })); }
  var lepesek = [], x = ar, t = Math.ceil(ar / 10) * 10;
  if (t > x && t <= fizet) { lepesek.push([x, t]); x = t; }
  if (fizet > x) lepesek.push([x, fizet]);
  return {
    forma: "vissza", fok: fok, ar: ar, fizet: fizet, fizetErmek: tallerLegkevesebb(fizet), vissza: fizet - ar, lepesek: lepesek,
    naplo: { tipus: "kivonas", kerdes: fizet + " − " + ar, forma: "b" }
  };
}
/* a tenyérbe számolt érmék: { jo, elteres, ok: "jo" | "keves" (a vevő a tenyerére néz, vár) | "sok" (visszaad egyet: „Ez sok!”) } */
function boltVisszaEll(f, l) {
  var el = tallerOsszeg(l) - f.vissza;
  return { jo: el === 0, elteres: el, ok: el === 0 ? "jo" : el < 0 ? "keves" : "sok" };
}

/* ── ③ 🦊 Róka Juli blokkja ────────────────────────────────────────────────────
   Juli kapkodó, nem csaló: a hibái a gyerekek tipikus hibái. Mindegyik a tény-motor 100-as típusához kötve
   (a blokk saját típusa a tenyKulcs-ból jön: e1a, k2a…), így a pulton a hiba és a típus együtt látszik. */
var ROKA_HIBA = {
  atvitel: { nev: "elfelejtett átvitel", pl: "38 + 25 = 53" },   /* csak átlépéses összeadásnál: − 10 */
  tizes:   { nev: "kimaradt tízes",      pl: "38 + 25 = 43" },   /* az egyik tag tízesei (legalább 20) kimaradnak */
  csere:   { nev: "felcserélt jegyek",   pl: "36 helyett 63" },
  egy:     { nev: "eggyel elszámolta",   pl: "38 + 25 = 62" }
};
/* egy hibás eredmény a megadott típussal, vagy null, ha erre a blokkra nem illik */
function rokaHibaz(tetelek, tipus) {
  var h = tallerOsszeg(tetelek), r = null;
  if (tipus === "atvitel") {
    var egyesek = 0; tetelek.forEach(function (v) { egyesek += v % 10; });
    if (egyesek >= 10) r = h - 10 * Math.floor(egyesek / 10);
  } else if (tipus === "tizes") {
    var t = tetelek.filter(function (v) { return v >= 20 && v % 10 !== 0; });
    if (t.length) r = h - Math.floor(veletlenElem(t) / 10) * 10;
  } else if (tipus === "csere") {
    if (h >= 12 && h <= 98 && h % 10 !== 0 && h % 10 !== Math.floor(h / 10)) r = (h % 10) * 10 + Math.floor(h / 10);
  } else if (tipus === "egy") r = h + (Math.random() < 0.5 ? 1 : -1);
  return r != null && r > 0 && r <= 100 && r !== h ? r : null;
}
/* kerekítés tízesre (5 felfelé) — a „körülbelül stimmel?” lépés */
function kerekTizes(v) { return Math.floor((v + 5) / 10) * 10; }
/* egy blokk. pontos: true/false (a sorrendet a rokaSor adja). Vissza: { tetelek, irt (amit Juli írt), helyes, pontos,
   hiba (ROKA_HIBA kulcsa vagy null), becsles, kbStimmel (a becslés kifogja-e: |írt − becslés| ≤ 5 × tételszám),
   tenyTipus (a tény-motor 100-as típusa, két tételnél), naplo } */
function rokaBlokk(pontos, cfg) {
  cfg = cfg || {};
  var n = cfg.tetelek || boltBeall().tetelek, tet, h, hiba = null, irt;
  for (var p = 0; p < 200; p++) {
    tet = [];
    for (var i = 0; i < n; i++) tet.push(veletlen(n === 2 ? 11 : 6, n === 2 ? 69 : 39));
    h = tallerOsszeg(tet);
    if (h > 100 || tet.some(function (v) { return v % 10 === 0; })) continue;
    if (pontos) { irt = h; break; }
    hiba = veletlenElem(cfg.hibak || Object.keys(ROKA_HIBA));
    irt = rokaHibaz(tet, hiba);
    if (irt != null) break;
  }
  if (irt == null) { pontos = true; hiba = null; irt = h; }   /* (200 próbából sosem marad üres; a gépi próba figyeli) */
  var becs = 0; tet.forEach(function (v) { becs += kerekTizes(v); });
  var kerdes = tet.join(" + "), tk = n === 2 && typeof tenyKulcs === "function" ? tenyKulcs({ tipus: "osszeadas", kerdes: kerdes }) : null;
  return {
    forma: "blokk", tetelek: tet, irt: irt, helyes: h, pontos: !!pontos, hiba: pontos ? null : hiba,
    becsles: becs, kbStimmel: Math.abs(irt - becs) <= 5 * n, tenyTipus: tk && tk.tipus ? tk.kulcs : null,
    naplo: n === 2 ? { tipus: "osszeadas", kerdes: kerdes, forma: "b" } : { tipus: "bolt", kerdes: kerdes, forma: "b" }   /* 3 tétel: nem egy tény */
  };
}
/* egy állomás blokkjainak sorrendje: db blokkból a beállított arányban pontos (5-ből 2), összekeverve,
   hogy ne legyen kiszámítható; legalább egy pontos és egy hibás, ha db ≥ 2 */
function rokaSor(db, B) {
  B = B || boltBeall();
  var p = Math.round(db * B.rokaPontos / 5);
  if (db >= 2) p = Math.min(db - 1, Math.max(1, p));
  var sor = [];
  for (var i = 0; i < db; i++) sor.push(i < p);
  return keverTomb(sor);
}
function keverTomb(t) { for (var i = t.length - 1; i > 0; i--) { var j = veletlen(0, i), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
/* a pecsét: "ok" (✓) vagy "x" (✗); javitas: a beírt szám (✗ után kötelező).
   🔒 A ✓ csak pontos blokkon ér, a ✗ csak hibás blokkon ÉS jó javítással.
   Vissza: { jo, ok: "jo" | "nem-vette-eszre" (✓ hibásra) | "rossz-javitas" | "gyanu" (✗ pontosra) } */
function rokaPecsetEll(b, pecset, javitas) {
  if (b.pontos) return pecset === "ok" ? { jo: true, ok: "jo" } : { jo: false, ok: "gyanu" };
  if (pecset !== "x") return { jo: false, ok: "nem-vette-eszre" };
  return +javitas === b.helyes ? { jo: true, ok: "jo" } : { jo: false, ok: "rossz-javitas" };
}
/* a 🦊 napló (a pult 🦊 sorához): P().roka = { atvitel: "EENE", …, pontos: "OOG" } — az utolsó 8 eset betűje:
   E észrevette és javította · R észrevette, de rosszul javított · N nem vette észre · O pontosra ✓ · G pontosra ✗ (gyanakodott).
   Minden hibás blokknál a 100-as típus is (t: { k2a: "EN" }), hogy a hiba-oka felismerés lássa, hol csúszik. */
function rokaJegyez(b, ell) {
  var p = P(), r = p.roka || (p.roka = {}), kulcs = b.pontos ? "pontos" : b.hiba, betu;
  if (b.pontos) betu = ell.jo ? "O" : "G";
  else betu = ell.jo ? "E" : ell.ok === "rossz-javitas" ? "R" : "N";
  r[kulcs] = ((r[kulcs] || "") + betu).slice(-8);
  if (!b.pontos && b.tenyTipus) { var t = r.t || (r.t = {}); t[b.tenyTipus] = ((t[b.tenyTipus] || "") + betu).slice(-8); }
  return betu;
}

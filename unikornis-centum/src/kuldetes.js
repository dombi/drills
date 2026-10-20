/* ============ 3c3) 🐉 SÁRKÁNY-KÜLDETÉSEK — az általános küldetés-motor ============
   Terv: terv/sarkany-kuldetesek-rendszerterv.html (✅ 9/9) + terv/sarkany-kuldetesek-rajzterv.html (✅). 1. kód-kör (2026-10-17):
   az ÁGY-küldetés végig — kérés → választás → tábla → 🐉 a térképen + pikkely a kapukon → darab az ösvény végén + hír →
   kupac az odúban → a gyerek felrakja → kész (a kölyök beleugrik). A rajzok és az odú-réteg: sarkany-holmi.js.
     • Csak annál a gyereknél, akinél a kölyök hazatért (P().leny2.fazis === "kolyok"), és a pulton be van kapcsolva
       (FELULIR.leny.kuld, alapból be — leny-kiser.js lenyBeall).
     • A helyek a 4. szakasz szabálya szerint (kuldOsszeallit, tiszta függvény): a ligetnek a gyereknél látszó, nyitott
       pályái közül azok, amelyek még nem mennek (tudas.js); fajtánként legalább 1, legfeljebb 2 hely, legfeljebb 10;
       ≤ 2 fajta → a liget „kész”, nincs kérés. Mindig 10 részlet: rövidebb küldetésnél egy hely több részletet hoz.
     • Csak a VÉGIGÉRT pálya visz darabot (palyaVege → kuldPalyaVege); a megszakított semmit (kiskapu-elv).
     • A futó küldetés nem változik; csak ha egy pálya közben elérhetetlenné válik (pult: elrejtve), az ő helye csendben
       eltűnik, és a részletek újraosztódnak (kuldIgazit) — a gyerek soha nem ragad bent. Ugyanígy, ha egy pálya
       utólag a kimaradók közé kerül (🧺 Mi maradt?, 2026-10-18). A 🧺 ráadás-pálya: lásd KULD_LIGET.raadas.
     • 1. kör: amíg csak az ágy kész, a kérés 3 KÜLÖNBÖZŐ ágyat kínált (A1); amit már megkapott, nem jön újra.
     • 2. kör (2026-10-17): + KISHÁZ a kertben, a napozó szikla mellett — ott áll a tábla, a darab-kupac és az épülő ház
       is (producer: „minden a kertben”); az odúban a fészek fölött egy 🏡-buborék emlékeztet. A kérés mindig 3 kártya:
       1 ágy + 1 kisház + a harmadik egy újabb ágy vagy ház (amíg a ruha nincs kész); ha egy típus elfogyott, a másik pótolja.
     • 3. kör (2026-10-17): + RUHA — a választó 1 ágy + 1 kisház + 1 ruhadarab (ha egy típus elfogyott, egy másik pótolja).
       A ruha az odúban készül (tábla + kupac, mint az ágynál), a kölyök már magán viseli a készülő ruhát (a hiányzó
       részletek halvány körvonallal); kész → felveszi és megpördül. Az elsővel jön a ruhaláda (az ágy mellett): benne
       a megszerzett ruhák, koppintásra fel-le veszi; helyenként (nyak, fej, láb, hát) egy lehet rajta. A kísérő az
       ösvényen és a kölyök a kertben is viseli (kuldRajta).
     • 4. kör (2026-10-18): a pult-kártya. A liget a pultról jön (lenyBeall().kuldLiget, alap: Szorzós liget); ha a
       pulton KÉZI PÁLYALISTA van (kuldPalyak, bármelyik ligetből), a te listád számít: a gyereknek látszó, nyitott,
       mérhető pályái, a „megy” is (te választottad), legalább 1 fajta, fajtánként 1–2 hely (kuldUjHelyek) — ekkor
       akt.liget = "kezi", és a 🐉 minden olyan ligeten látszik, ahol kért pálya van (kuldLigetJel). A pult-változás csak a
       következő küldetésre hat; a futót csak az elrejtett pálya igazítja (mint eddig).
     • 5. kör (2026-10-20): EMLÉK-PRÓBÁK. Ha egy már „menő” pályánál esedékes az emlék-próba (tudas.js tudasEsedekes),
       a következő küldetésbe csendben visszakerül pontosan 1 helyre (nem kap 2. helyet, nem előz; a 10-es plafonnál egy
       2. hely helyére jön). Fajtának számít (a ≤ 2 szabálynál is). A próba eredményét a tudás-napló intézi
       (tudasPalyaVege): a gyerek csak annyit lát, hogy kitöltött egy helyet. A kézi listán a „megy” amúgy is bent van.
   Mentés: P().kuld = { akt: { id, tip, liget, helyek: [{ p, resz, kesz, ks }], hozott, felrakva, ks, kezd, hir },
                        kesz: [{ id, nap }], holmi: { agy: [], haz: [], ruha: [] }, kint: { agy, haz },
                        rajta: { nyak, fej, lab, hat }, keres: { op: [id], nap, v } }
   Tiltólista: nincs határidő, nincs kudarc, nincs szám a gyerek tudásáról; a hozott és a felrakott darab soha nem vész el. */

/* a ligetek, ahonnan a kölyök kérhet (új liget = egy új sor); kimarad: nem mérhető pálya (🎵 felmondás, 7. döntés),
   és ami nem kötelező (🧺 Mi maradt? — maradékos osztás, producer 2026-10-18).
   raadas: nem kötelező, de ha végigjátssza, küldetésenként egyszer hoz 1 darabot — a legtöbbet hozó nyitott helytől veszi
   el (az legalább 1 marad, így minden kért pálya kell továbbra is); a táblán kész helyként jelenik meg (kuldRaadas) */
var KULD_LIGET = {
  szorzo: { nev: "Szorzós liget", honnan: "a Szorzós ligetből", kimarad: ["szorzo-dallam", "mi-maradt"], raadas: ["mi-maradt"] }
};
var KULD_KEZI = "kezi";   /* akt.liget, ha a küldetés a pult kézi listájából állt össze */
var KULD_TIPUS = ["agy", "haz", "ruha"];   /* 1 + 1 + 1 a választóban (3. kör) */
var KULD_RESZ = 10, KULD_MAX_HELY = 10;

/* ── a mentés-ág ── */
function kuldTar(p) {
  p = p || P();
  if (!p.kuld || typeof p.kuld !== "object") p.kuld = {};
  var k = p.kuld;
  if (k.akt && (typeof k.akt !== "object" || !Array.isArray(k.akt.helyek))) k.akt = null;
  if (k.akt === undefined) k.akt = null;
  if (!Array.isArray(k.kesz)) k.kesz = [];
  if (!k.holmi || typeof k.holmi !== "object") k.holmi = {};
  ["agy", "haz", "ruha"].forEach(function (t) { if (!Array.isArray(k.holmi[t])) k.holmi[t] = []; });
  if (!k.kint || typeof k.kint !== "object") k.kint = {};
  if (!k.rajta || typeof k.rajta !== "object") k.rajta = {};
  if (k.keres && (typeof k.keres !== "object" || !Array.isArray(k.keres.op))) k.keres = null;
  return k;
}
/* van-e küldetés ennél a gyereknél (hazatért kölyök + pult) */
function kuldVan() {
  if (typeof P !== "function" || !P()) return false;
  return lenyTar().fazis === "kolyok" && lenyBeall().kuld;
}

/* ── a liget fajtái a gyereknél: látszik, nyitva van, nem „hamarosan”, nem kimaradó ── */
function kuldFajtak(liget, p) {
  var L = KULD_LIGET[liget]; if (!L) return [];
  return PALYAK.filter(function (pa) {
    return pa.regio === liget && !pa.hamarosan && L.kimarad.indexOf(pa.id) < 0 && !palyaRejtve(pa) && !palyaZarva(pa);
  }).map(function (pa) { return { id: pa.id, napok: tudasNapok(pa.id, p), ut: tudasUtolso(pa.id, p), megy: tudasMegy(pa.id, p), esed: tudasEsedekes(pa.id, p) }; });
}
/* kimaradó (nem mérhető / nem kötelező) pálya-e bármelyik ligetben — a kézi listából is kimarad */
function kuldKimarad(id) {
  return Object.keys(KULD_LIGET).some(function (l) { return KULD_LIGET[l].kimarad.indexOf(id) >= 0; });
}
/* ── a pult kézi listája (bármelyik ligetből): a gyereknél látszó, nyitott, nem kimaradó pályák, a PALYAK sorrendjében ── */
function kuldKeziFajtak(ids, p) {
  return PALYAK.filter(function (pa) {
    return ids.indexOf(pa.id) >= 0 && !pa.hamarosan && !kuldKimarad(pa.id) && !palyaRejtve(pa) && !palyaZarva(pa);
  }).map(function (pa) { return { id: pa.id, napok: tudasNapok(pa.id, p), ut: tudasUtolso(pa.id, p), megy: tudasMegy(pa.id, p), esed: tudasEsedekes(pa.id, p) }; });
}
/* honnan kér segítséget (a kérés-mondat): a liget neve; a kézi listánál a közös liget, ha mind egyből van */
function kuldHonnan(a) {
  if (KULD_LIGET[a.liget]) return KULD_LIGET[a.liget].honnan;
  var r = {}; a.helyek.forEach(function (h) { var pa = shPalya(h.p); if (pa) r[palyaLiget(pa)] = 1; });
  var l = Object.keys(r);
  return l.length === 1 && KULD_LIGET[l[0]] ? KULD_LIGET[l[0]].honnan : "a ligetekből";
}
/* a következő küldetés helyei a pult szerint: { liget, helyek } | null */
function kuldUjHelyek() {
  var b = lenyBeall();
  if (b.kuldPalyak) { var h = kuldOsszeallit(kuldKeziFajtak(b.kuldPalyak), true); return h ? { liget: KULD_KEZI, helyek: h } : null; }
  var a = kuldOsszeallit(kuldFajtak(b.kuldLiget));
  return a ? { liget: b.kuldLiget, helyek: a } : null;
}
/* ── A SZABÁLY (tervlap 4. szakasz) — tiszta függvény: fajtak = [{ id, napok, ut, megy, esed }] a liget sorrendjében.
   Visszaad: [{ p, resz }] (a fajták sorrendjében, fajtánként egymás után), vagy null (≤ 2 fajta: a liget kész).
   Elsőbbség (2. hely, több részlet): a legkevesebb tiszta napú, döntetlennél a legrégebben játszott (5. döntés).
   Emlék-próba (5. kör): a „megy”, de esedékes fajta pontosan 1 helyet kap, az elsőbbségi sor végén.
   kezi (a pult listája): a „megy” is bent marad, és 1 fajta is elég. ── */
function kuldOsszeallit(fajtak, kezi) {
  var L = (fajtak || []).filter(function (f) { return kezi || !f.megy || f.esed; });
  if (L.length <= (kezi ? 0 : 2)) return null;
  var proba = function (f) { return !kezi && f.megy ? 1 : 0; };
  var elso = L.map(function (f, i) { return { f: f, i: i }; }).sort(function (a, b) {
    return (proba(a.f) - proba(b.f)) || (a.f.napok - b.f.napok) || (a.f.ut - b.f.ut) || (a.i - b.i);
  }).map(function (x) { return x.f.id; });
  if (elso.length > KULD_MAX_HELY) { var bent = elso.slice(0, KULD_MAX_HELY); L = L.filter(function (f) { return bent.indexOf(f.id) >= 0; }); elso = bent; }
  var prDb = L.filter(proba).length, db = {}, helyDb = Math.min(KULD_MAX_HELY, 2 * L.length - prDb);
  L.forEach(function (f) { db[f.id] = 1; });
  for (var j = 0; j < helyDb - L.length; j++) db[elso[j]] = 2;
  var helyek = [];
  L.forEach(function (f) { for (var k = 0; k < db[f.id]; k++) helyek.push({ p: f.id, resz: 1 }); });
  kuldReszOszt(helyek, KULD_RESZ, elso);
  return helyek;
}
/* n részletet oszt szét a helyeken (mindegyik ≥ 1): a többlet körönként egyet-egyet, előbb a fajták ELSŐ helye kap,
   az elsőbbség sorrendjében, aztán a második (így 6 helynél 2-2-2-2-1-1, és egy fajta sem kap aránytalanul sokat) */
function kuldReszOszt(helyek, n, elso) {
  if (!helyek.length) return;
  helyek.forEach(function (h) { h.resz = 1; });
  var marad = n - helyek.length, sor = [];
  [0, 1].forEach(function (k) {
    (elso || []).forEach(function (id) { var t = helyek.filter(function (h) { return h.p === id; })[k]; if (t) sor.push(t); });
  });
  helyek.forEach(function (h) { if (sor.indexOf(h) < 0) sor.push(h); });
  for (var i = 0; marad > 0; i = (i + 1) % sor.length, marad--) sor[i].resz++;
}

/* ── a futó küldetés ── */
function kuldAkt(p) { var a = kuldTar(p).akt; if (!p) kuldIgazit(a); return a; }
/* elérhetetlenné vált pálya (a pulton elrejtve) → a helye csendben eltűnik, a részletek újraosztódnak */
function kuldIgazit(a) {
  if (!a) return;
  var elotte = a.helyek.length;
  a.helyek = a.helyek.filter(function (h) {
    if (h.kesz || h.raad) return true;
    var pa = null; PALYAK.forEach(function (x) { if (x.id === h.p) pa = x; });
    var L = KULD_LIGET[a.liget];
    return !!pa && !palyaRejtve(pa) && !(L && L.kimarad.indexOf(h.p) >= 0);   /* kimaradóvá vált pálya is kiesik */
  });
  if (a.helyek.length === elotte) return;
  var nyitott = a.helyek.filter(function (h) { return !h.kesz; }), keszResz = 0;
  a.helyek.forEach(function (h) { if (h.kesz) keszResz += h.resz; });
  if (!nyitott.length) { a.hozott = KULD_RESZ; return; }   /* minden megmaradt hely kész → a hiányzó részletek is megjönnek */
  kuldReszOszt(nyitott, KULD_RESZ - keszResz, nyitott.map(function (h) { return h.p; }).filter(function (id, i, l) { return l.indexOf(id) === i; }));
}
/* hozhat-e darabot ez a pálya (a kísérő és a kártya pikkelye kérdezi) */
function kuldKertPalya(id) {
  if (!kuldVan()) return false;
  var a = kuldAkt(); if (!a) return false;
  return a.helyek.some(function (h) { return h.p === id && !h.kesz; }) || !!kuldRaadas(a, id);
}
/* 🧺 ráadás: hozhat-e még ez a nem kötelező pálya egy darabot. Visszaad: a nyitott hely, amelytől a darabot átveszi | null */
function kuldRaadas(a, id) {
  var L = KULD_LIGET[a.liget];
  if (!L || !L.raadas || L.raadas.indexOf(id) < 0 || a.hozott >= KULD_RESZ) return null;
  if (a.helyek.some(function (h) { return h.p === id; })) return null;   /* küldetésenként egyszer */
  var tol = null;
  a.helyek.forEach(function (h) { if (!h.kesz && h.resz > 1 && (!tol || h.resz > tol.resz)) tol = h; });
  return tol;
}
/* a térkép Kert-jele: 🐉, ha a kisház egy darabja a kertben vár (terkep.js) */
function kuldKertJel() {
  if (!kuldVan()) return [];
  var a = kuldAkt();
  return a && a.tip === "haz" && a.hozott > a.felrakva ? ["🐉"] : [];
}
/* van-e még kért pálya ebben a ligetben (🐉 a ligettérképen) — a kézi listánál pályánként a saját ligete számít */
function kuldLigetJel(r) {
  if (!kuldVan()) return [];
  var a = kuldAkt();
  if (!a) return [];
  return a.helyek.some(function (h) { var pa = shPalya(h.p); return !h.kesz && (a.liget === KULD_KEZI ? !!pa && palyaLiget(pa) === r : a.liget === r); }) ? ["🐉"] : [];
}
/* a pályavége hívja (engine-logic.js palyaVege, minden végigért pálya után). Visszaad: { resz: [rajz-részlet sorszámok] } | null */
function kuldPalyaVege(id) {
  if (!kuldVan()) return null;
  var a = kuldAkt(); if (!a) return null;
  kuldIgazit(a);
  var h = a.helyek.filter(function (x) { return x.p === id && !x.kesz; })[0], tol0 = !h && kuldRaadas(a, id);
  if (tol0) { tol0.resz--; h = { p: id, resz: 1, kesz: 0, ks: 0, raad: 1 }; a.helyek.push(h); }   /* 🧺 ráadás-darab */
  if (!h) return null;
  h.kesz = 1; h.ks = ++a.ks;
  var tol = a.hozott;
  a.hozott = Math.min(KULD_RESZ, a.hozott + h.resz);
  var r = []; for (var i = tol; i < a.hozott; i++) r.push(i);
  a.hir = { nap: tenyNap(), resz: r, mind: a.hozott >= KULD_RESZ, mondva: 0 };
  esemeny("kuld_darab", { holmi: a.id, palya: id, hozott: a.hozott });
  return { resz: r };
}
/* a tábla pecsétjei: egy hely akkor kap pecsétet, ha minden részletét már fel is rakta (a kész-sorrendben számolva) */
function kuldPecsetes(a) {
  var ki = {}, sum = 0;
  a.helyek.map(function (h, i) { return { h: h, i: i }; }).filter(function (x) { return x.h.kesz; })
    .sort(function (x, y) { return x.h.ks - y.h.ks; })
    .forEach(function (x) { sum += x.h.resz; if (sum <= a.felrakva) ki[x.i] = 1; });
  return ki;
}

/* ── a kérés: 3 lehetőség — típusonként egy véletlen, még meg nem kapott holmi, a maradék helyre egy újabb a többiből;
   egy napon egyszer jön elő magától ── */
function kuldKeresKell() {
  if (!kuldVan()) return false;
  var k = kuldTar();
  if (k.akt) return false;
  return !!kuldKeresOpciok().length && !!kuldUjHelyek();
}
function kuldKeresOpciok() {
  var k = kuldTar();
  var nincs = function (id) { return SH_HOLMI_BY[id] && k.holmi[SH_HOLMI_BY[id].tip].indexOf(id) < 0; };
  /* a régi (1. körös, csak ágyas) kérés újra összeáll, ha bővült a típusok köre; a „Majd később” napja megmarad */
  if (k.keres && k.keres.v === KULD_TIPUS.length && k.keres.op.length && k.keres.op.every(nincs)) return k.keres.op;
  var op = [], tobbi = [];
  KULD_TIPUS.forEach(function (t) {
    var l = shKever(SH_HOLMI.filter(function (h) { return h.tip === t && nincs(h.id); }));
    if (l.length) op.push(l[0].id);
    tobbi = tobbi.concat(l.slice(1));
  });
  shKever(tobbi).forEach(function (h) { if (op.length < 3) op.push(h.id); });
  op = op.slice(0, 3).sort(function (a, b) { return KULD_TIPUS.indexOf(SH_HOLMI_BY[a].tip) - KULD_TIPUS.indexOf(SH_HOLMI_BY[b].tip); });
  k.keres = { op: op, nap: k.keres ? k.keres.nap : null, v: KULD_TIPUS.length };
  return op;
}
/* „Majd később”: ma már nem kérdez magától, a 💭 marad */
function kuldKesobb() { var k = kuldTar(); if (k.keres) k.keres.nap = tenyNap(); ment(); }
function kuldKesobbVan() { var k = kuldTar(); return !k.akt && !!k.keres && k.keres.nap != null && kuldKeresKell(); }
function kuldMagatolKer() { var k = kuldTar(); return kuldKeresKell() && !(k.keres && k.keres.nap === tenyNap()); }
/* a gyerek választott: indul a küldetés */
function kuldValaszt(id) {
  var k = kuldTar(), h = SH_HOLMI_BY[id], uj = kuldUjHelyek();
  if (!h || !uj) return null;
  k.akt = { id: id, tip: h.tip, liget: uj.liget, helyek: uj.helyek.map(function (x) { return { p: x.p, resz: x.resz, kesz: 0, ks: 0 }; }),
            hozott: 0, felrakva: 0, ks: 0, kezd: tenyNap(), hir: null };
  k.keres = null;
  ment();
  esemeny("kuld_indul", { holmi: id, helyek: k.akt.helyek.map(function (x) { return x.p; }) });
  return k.akt;
}
/* a gyerek felrak egy darabot (a kupacra koppintva). Visszaad: "resz" | "kesz" | null */
function kuldFelrak() {
  var k = kuldTar(), a = k.akt;
  if (!a || a.felrakva >= a.hozott) return null;
  a.felrakva++;
  if (a.felrakva < KULD_RESZ) { ment(); return "resz"; }
  if (k.holmi[a.tip].indexOf(a.id) < 0) k.holmi[a.tip].push(a.id);
  if (a.tip === "ruha") k.rajta[SH_HOLMI_BY[a.id].hely] = a.id;   /* a kész ruhát rögtön felveszi */
  else k.kint[a.tip] = a.id;   /* az új kerül ki, a régi megmarad (9. döntés) */
  k.kesz.push({ id: a.id, nap: tenyNap() });
  k.akt = null;
  ment();
  esemeny("kuld_kesz", { holmi: a.id });
  return "kesz";
}
/* a megszerzett ágyak (kisházak) között vált (koppintás rá, ha több is van). Visszaadja az új kint lévőt. */
function kuldValt(tip) {
  var k = kuldTar(), l = k.holmi[tip];
  if (!l || l.length < 2) return k.kint[tip] || null;
  k.kint[tip] = l[(l.indexOf(k.kint[tip]) + 1) % l.length];
  ment();
  return k.kint[tip];
}

/* a ruhaládánál: fel- vagy leveszi (helyenként egy lehet rajta). Visszaad: true = most rajta van, false = levette, null = nincs ilyen */
function kuldRuhaValt(id) {
  var k = kuldTar(), h = SH_HOLMI_BY[id];
  if (!h || h.tip !== "ruha" || k.holmi.ruha.indexOf(id) < 0) return null;
  if (k.rajta[h.hely] === id) delete k.rajta[h.hely]; else k.rajta[h.hely] = id;
  ment();
  return k.rajta[h.hely] === id;
}
/* ami most a kölyökön van: [{ h, n }] — a készülő ruha (epul: csak az odúban) a saját helyén a régit eltakarja */
var SH_RUHA_REND = ["hat", "lab", "nyak", "fej"];   /* rajzolási sorrend: a köpeny legalul, a sál a gallér fölött */
function kuldRajta(epul) {
  if (!kuldVan()) return [];
  var k = kuldTar(), a = k.akt, l = [], fog = {};
  if (epul && a && a.tip === "ruha" && SH_HOLMI_BY[a.id]) { l.push({ h: SH_HOLMI_BY[a.id], n: a.felrakva }); fog[SH_HOLMI_BY[a.id].hely] = 1; }
  Object.keys(k.rajta).forEach(function (hely) {
    var h = SH_HOLMI_BY[k.rajta[hely]];
    if (h && !fog[hely] && k.holmi.ruha.indexOf(h.id) >= 0) l.push({ h: h, n: KULD_RESZ });
  });
  return l.sort(function (x, y) { return SH_RUHA_REND.indexOf(x.h.hely) - SH_RUHA_REND.indexOf(y.h.hely); });
}

/* ── a közös hír-sor forrása (gondozas.js VISSZA_HIR „kuld”): a ma hozott darab egyszer szól ── */
var KULD_HIR_SZIN = "#a0603a";
function kuldHirek() {
  if (!kuldVan()) return [];
  var a = kuldAkt();
  if (!a || !a.hir || a.hir.mondva || a.hir.nap !== tenyNap()) return [];
  a.hir.mondva = 1;
  var h = SH_HOLMI_BY[a.id], nev = lenyTar().nev || "a kölyök", sor = [];
  var darab = a.hir.resz.map(function (i) { return h.r[shSor(h)[i]][2]; });
  var mit = darab.length > 1 ? darab.slice(0, -1).join(", ") + " és " + darab[darab.length - 1] : darab[0];
  sor.push({ t: "🐉 Hoztunk " + mit + " " + nev + " " + SH_TIP_HOZ[h.tip] + "!", szin: KULD_HIR_SZIN });
  if (a.hir.mind) sor.push({ t: "🐉 Megvan minden darab! Rakjuk össze " + (h.tip === "haz" ? "a kertben, a szikla mellett!" : h.tip === "ruha" ? "és próbáljuk fel az odúban!" : "az odúban!"), szin: KULD_HIR_SZIN });
  else if (h.tip === "haz") sor.push({ t: "🐉 A darab a kertben vár, a szikla mellett.", szin: KULD_HIR_SZIN });
  return sor;
}

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
       eltűnik, és a részletek újraosztódnak (kuldIgazit) — a gyerek soha nem ragad bent.
     • 1. kör: amíg csak az ágy kész, a kérés 3 KÜLÖNBÖZŐ ágyat kínált (A1); amit már megkapott, nem jön újra.
     • 2. kör (2026-10-17): + KISHÁZ a kertben, a napozó szikla mellett — ott áll a tábla, a darab-kupac és az épülő ház
       is (producer: „minden a kertben”); az odúban a fészek fölött egy 🏡-buborék emlékeztet. A kérés mindig 3 kártya:
       1 ágy + 1 kisház + a harmadik egy újabb ágy vagy ház (amíg a ruha nincs kész); ha egy típus elfogyott, a másik pótolja.
   Mentés: P().kuld = { akt: { id, tip, liget, helyek: [{ p, resz, kesz, ks }], hozott, felrakva, ks, kezd, hir },
                        kesz: [{ id, nap }], holmi: { agy: [], haz: [], ruha: [] }, kint: { agy, haz }, keres: { op: [id], nap } }
   Tiltólista: nincs határidő, nincs kudarc, nincs szám a gyerek tudásáról; a hozott és a felrakott darab soha nem vész el. */

/* a ligetek, ahonnan a kölyök kérhet (új liget = egy új sor); kimarad: nem mérhető pálya (🎵 felmondás, 7. döntés) */
var KULD_LIGET = {
  szorzo: { nev: "Szorzós liget", honnan: "a Szorzós ligetből", kimarad: ["szorzo-dallam"] }
};
var KULD_TIPUS = ["agy", "haz"];   /* 2. kör: ágy + kisház; a 3. körtől + "ruha" (1 + 1 + 1 a választóban) */
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
  }).map(function (pa) { return { id: pa.id, napok: tudasNapok(pa.id, p), ut: tudasUtolso(pa.id, p), megy: tudasMegy(pa.id, p) }; });
}
/* ── A SZABÁLY (tervlap 4. szakasz) — tiszta függvény: fajtak = [{ id, napok, ut, megy }] a liget sorrendjében.
   Visszaad: [{ p, resz }] (a fajták sorrendjében, fajtánként egymás után), vagy null (≤ 2 fajta: a liget kész).
   Elsőbbség (2. hely, több részlet): a legkevesebb tiszta napú, döntetlennél a legrégebben játszott (5. döntés). ── */
function kuldOsszeallit(fajtak) {
  var L = (fajtak || []).filter(function (f) { return !f.megy; });
  if (L.length <= 2) return null;
  var elso = L.map(function (f, i) { return { f: f, i: i }; }).sort(function (a, b) {
    return (a.f.napok - b.f.napok) || (a.f.ut - b.f.ut) || (a.i - b.i);
  }).map(function (x) { return x.f.id; });
  if (elso.length > KULD_MAX_HELY) { var bent = elso.slice(0, KULD_MAX_HELY); L = L.filter(function (f) { return bent.indexOf(f.id) >= 0; }); elso = bent; }
  var db = {}, helyDb = Math.min(KULD_MAX_HELY, 2 * L.length);
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
function kuldAkt(p) { return kuldTar(p).akt; }
/* elérhetetlenné vált pálya (a pulton elrejtve) → a helye csendben eltűnik, a részletek újraosztódnak */
function kuldIgazit(a) {
  if (!a) return;
  var elotte = a.helyek.length;
  a.helyek = a.helyek.filter(function (h) {
    if (h.kesz) return true;
    var pa = null; PALYAK.forEach(function (x) { if (x.id === h.p) pa = x; });
    return !!pa && !palyaRejtve(pa);
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
  return a.helyek.some(function (h) { return h.p === id && !h.kesz; });
}
/* a térkép Kert-jele: 🐉, ha a kisház egy darabja a kertben vár (terkep.js) */
function kuldKertJel() {
  if (!kuldVan()) return [];
  var a = kuldAkt();
  return a && a.tip === "haz" && a.hozott > a.felrakva ? ["🐉"] : [];
}
/* van-e még kért pálya ebben a ligetben (🐉 a ligettérképen) */
function kuldLigetJel(r) {
  if (!kuldVan()) return [];
  var a = kuldAkt();
  return a && a.liget === r && a.helyek.some(function (h) { return !h.kesz; }) ? ["🐉"] : [];
}
/* a pályavége hívja (engine-logic.js palyaVege, minden végigért pálya után). Visszaad: { resz: [rajz-részlet sorszámok] } | null */
function kuldPalyaVege(id) {
  if (!kuldVan()) return null;
  var a = kuldAkt(); if (!a) return null;
  kuldIgazit(a);
  var h = a.helyek.filter(function (x) { return x.p === id && !x.kesz; })[0];
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
  return !!kuldKeresOpciok().length && !!kuldOsszeallit(kuldFajtak("szorzo"));
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
  var k = kuldTar(), h = SH_HOLMI_BY[id], helyek = kuldOsszeallit(kuldFajtak("szorzo"));
  if (!h || !helyek) return null;
  k.akt = { id: id, tip: h.tip, liget: "szorzo", helyek: helyek.map(function (x) { return { p: x.p, resz: x.resz, kesz: 0, ks: 0 }; }),
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
  k.kint[a.tip] = a.id;   /* az új kerül ki, a régi megmarad (9. döntés) */
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
  if (a.hir.mind) sor.push({ t: "🐉 Megvan minden darab! Rakjuk össze " + (h.tip === "haz" ? "a kertben, a szikla mellett!" : "az odúban!"), szin: KULD_HIR_SZIN });
  else if (h.tip === "haz") sor.push({ t: "🐉 A darab a kertben vár, a szikla mellett.", szin: KULD_HIR_SZIN });
  return sor;
}

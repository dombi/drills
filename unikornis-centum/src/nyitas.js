/* ============ 3c2b) 🚪 NYITÁS — az újonc-menet közös alapja (Újonc-bevezetés 1. kör, 2026-10-20) ============
   Terv: terv/ujonc-bevezetes-rendszerterv.html (✅ jóváhagyva 2026-10-20) + terv/ujonc-bevezetes-rajzterv.html (✅ B: köd).
   Egy tábla arról, MI MIKOR ÉBRED, és egy kérdés, amit minden hely feltesz: „ébren vagyok?”. Ma a ligettérkép és a
   liget-belső kérdezi (terkep.js, ui.js, engine-logic.js palyaZarva); a 3. körben az utca, a kert, a fodrász, a felhőkert,
   a bank és a heti kártya is (nyitasEbren). A falu, ha elkészül, ugyanezt a táblát örökli.
     • Újonc = akinek egyetlen unikornisánál sincs végigjátszott pálya (Lili és Fanni így sosem kapja meg). A jel a
       P().uj ágban él (annál az unikornisnál, akivel kezdett — „kezdő profil”); a menet a gyerekhez tartozik, nem az
       unikornishoz, ezért bármelyik unikornisnál ugyanazt a rekordot olvassuk. A jel csak akkor születik, ha a gyerek
       mentése már biztosan megjött (felhő: FELHO.kesz / hátizsák), különben egy új gépen Lili is újonc lenne.
     • Osztály: a pult felülírja (FELULIR.nyitas.osztaly), különben P().uj.o (a 2. körben a lufik írják). Osztály nélkül
       NINCS menet: minden nyitva, mint ma (így az 1. kör élesben semmit nem ront el az első perc előtt).
     • Idő: a gyakorlós nap (gondozas.js gyakNap). A menet napja = hányadik gyakorlós napnál tart (a mai, még gyakorlás
       nélküli nap már a következő). Aki 3 napot kihagy, ott folytatja.
     • Naponta legfeljebb 1 új dolog (P().uj.napok[nap] = id). Elsőbbség: tudás nyit felfelé → elakadás nyit oldalra →
       a játékhelyek naptára. Sárkány-esemény napján (NYITAS_SARKANY_NAP) más nem nyílik.
     • Liget-állapot: "vil" (ébren, ide hív az unikornis: világít) · "nyitva" (ébren, nem hív: a nagyobbnak a könnyebb
       ligetek, ill. ami már „megy”) · "alszik" (köd) · null = a menet nem érinti (odú, utca, kert — a 3. körig).
     • A világító ligetben a pályák SORBAN ébrednek: az első még végig nem vitt pálya világít, a többi alszik.
       (A Bagolykönyvtárnak saját sorrendje van, ekLakat — ahhoz nem nyúlunk.)
     • Felfelé: egy liget „megy”, ha benne legalább NYITAS_MEGY.palya különböző pálya kerülő nélkül, legalább
       NYITAS_MEGY.nap különböző napon (tudas.js P().tud[].n). Ekkor a következő gyakorlós (szabad) napon felébred a
       következő liget a felfelé vezető úton.
     • Oldalra: elakadás = ugyanazon a pályán NYITAS_ELAKAD egymás utáni kerülős végigjátszás vagy félbehagyás. Ekkor a
       KÖVETKEZŐ gyakorlós napon egy ugyanolyan szintű, más témájú liget ébred. Felfelé sosem nyit (kiskapu-elv), és
       ez is a napi egy közül való.
     • A pult régi beállításai erősebbek: ami rejtve van, rejtve marad; a pult „ki”-je (vészkijárat) mindent kinyit.
   PULT: producerConfig/{uid}.nyitas és groups/{gid}.nyitas = { menet: true|false, osztaly: 1–6 } — alap < csoport < egyéni.
   A pult (admin/index.html) ugyanezt a fájlt tölti be: itt felső szinten csak adat és függvény-definíció lehet.
   Mentés: P().uj = { o: osztály|null, g0: a menet előtti gyakorlós nap, t: kezdés ideje, nyilt: { id: nap },
     napok: { nap: id }, lat: { id: 1 } (a nyílást már látta), fel: [ligetek, amelyek „mennek”], fv: felfelé váró nyílások,
     elakad: nap|null, sor: { palyaId: egymás utáni rossz kör } }. */

/* osztály → mi világít az első napon, mi van nyitva (a nagyobbnak a könnyebb ligetek, 5.D), merre ébred tovább */
var NYITAS_MERES = ["szabo", "bajital", "pekseg"];
/* elso: a ligeten belül ettől a pályától ébrednek sorban (tervlap 4.② „első pálya”); az előttük lévő, könnyebb pályák
   nyitva vannak, csak nem világítanak (mint 5.D a ligeteknél). Ahol nincs megadva, az első pályától. */
var NYITAS_OSZTALY = {
  1: { vil: ["osszeado"], nyitva: [], fel: ["szorzo", "vasar", "konyvtar", "fejtoro"], oldal: NYITAS_MERES, elso: { osszeado: "oszkiv-10" } },
  2: { vil: ["osszeado"], nyitva: [], fel: ["szorzo", "vasar", "konyvtar", "fejtoro"], oldal: NYITAS_MERES, elso: { osszeado: "oszkiv-20" } },
  3: { vil: ["osszeado", "szorzo"], nyitva: [], fel: ["vasar", "konyvtar", "fejtoro"], oldal: NYITAS_MERES, elso: { osszeado: "tizesek" } },
  4: { vil: ["szorzo", "vasar"], nyitva: ["osszeado"].concat(NYITAS_MERES), fel: ["konyvtar", "fejtoro"], oldal: [] },
  5: { vil: ["szorzo", "vasar", "konyvtar"], nyitva: ["osszeado"].concat(NYITAS_MERES), fel: ["fejtoro"], oldal: [] },
  6: { vil: ["szorzo", "vasar", "konyvtar"], nyitva: ["osszeado"].concat(NYITAS_MERES), fel: ["fejtoro"], oldal: [] }
};
/* 🌰🎵 VERS-PÁLYÁK (producer, 2026-10-20): a bontás és a szorzótábla felmondása az alap — „nem kiszámolni kell tudni,
   hanem mint egy verset”; ha nem bombabiztos, abból jönnek a számolási hibák és a látszólagos kedvetlenség. Ezért:
     • nem részei a sornak, mindig ébren vannak (a gyerek osztályában), és VILÁGÍTANAK, amíg nem mennek versként
       (tudas.js „megy” = 3 különböző napon tiszta), utána az emlék-próbák napján (1 hét, 3 hét, 2 hónap…) újra;
     • a ligetük csak akkor „megy” (csak akkor nyit felfelé), ha a vers is megy;
     • elakadásnál (hiv: ezekben a ligetekben) még aznap felvillan, és az unikornis hívja (mondat);
     • tol–ig: osztály; feb: ebben az osztályban csak a tanév 2. felétől (február–augusztus) — a szorzótáblát 2. osztály
       februárja körül kezdik. Ha a ligete addig aludt, „vers-ligetként” ébred: csak a vers van benne ébren. */
var NYITAS_VERS = [
  { id: "bontas-felmondas", liget: "osszeado", tol: 1, ig: 4, hiv: ["osszeado"], mondat: "Mondjuk el együtt a bontásokat!" },
  { id: "szorzo-dallam", liget: "szorzo", tol: 2, ig: 6, feb: 2, hiv: ["szorzo", "vasar"], mondat: "Mondjuk el együtt a szorzótáblát!" }
];
var NYITAS_TANULO = ["osszeado", "szorzo", "szabo", "bajital", "pekseg", "vasar", "konyvtar", "fejtoro", "egyeni"];
/* a játékhelyek naptára (tervlap 4.⑤): [id, legkorábbi gyakorlós nap] — sorban nyílnak, ha egy nap foglalt, eltolódnak.
   Az 1. körben csak a napokat foglalják (a napi egy szabály miatt); az altatásuk a 3. kör (nyitasEbren). */
var NYITAS_NAPOK = [["utca", 1], ["kert", 2], ["het", 4], ["fodrasz", 6], ["harmat", 7], ["felhokert", 8], ["kolyok", 9],
                    ["bank", 10], ["unikornisok", 15], ["frissites", 16]];
var NYITAS_SARKANY_NAP = { 3: "kikel", 5: "elropul" };   /* a sárkány napja: más nem nyílik */
var NYITAS_NEV = { utca: "🏘️ utca (Bolt)", kert: "🌿 kert", het: "📅 heti kártya", fodrasz: "💇 fodrász", harmat: "💧 harmat", felhokert: "☁️ felhőkert",
                   kolyok: "🐉 kölyök az ösvényen", bank: "🏦 bank", unikornisok: "🦄 a többi unikornis", frissites: "✨ frissítések", fejtoro: "🏔️ Fejtörő-hegy" };   /* a pultnak */
var NYITAS_MEGY = { palya: 3, nap: 2 };
var NYITAS_ELAKAD = 2;
var NYITAS_MONDAT = {
  alszik: "Ez még alszik. Majd felébresztjük!",
  palyaAlszik: "Ez az ösvény még alszik. Előbb az előzőt járjuk végig!"
};

/* ── pult-beállítás: { menet: true (be) | false (ki: minden nyitva) | — (automatikus), osztaly: 1–6 } ── */
function nyitasBeallOsszevon(egyeni, csoportok) {
  var ki = {};
  (csoportok || []).forEach(function (c) {
    if (!c) return;
    if (c.menet === false) ki.menet = false; else if (c.menet === true && ki.menet !== false) ki.menet = true;   /* a vészkijárat nyer */
    if (ki.osztaly == null && c.osztaly >= 1 && c.osztaly <= 6) ki.osztaly = +c.osztaly;
  });
  if (egyeni && typeof egyeni.menet === "boolean") ki.menet = egyeni.menet;
  if (egyeni && egyeni.osztaly >= 1 && egyeni.osztaly <= 6) ki.osztaly = +egyeni.osztaly;
  return ki;
}
function nyitasBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.nyitas) || {};
  return { menet: typeof f.menet === "boolean" ? f.menet : null, osztaly: f.osztaly >= 1 && f.osztaly <= 6 ? Math.floor(f.osztaly) : null };
}

/* ── a rekord (tiszta függvények: a pult is hívja, a gyerek mentésével) ── */
function nyitasNormal(p) {
  var r = p && p.uj;
  if (!r || typeof r !== "object") { if (p && p.uj !== undefined) delete p.uj; return; }
  if (!(r.o >= 1 && r.o <= 6)) r.o = null;
  if (typeof r.g0 !== "number") r.g0 = 0;
  ["nyilt", "napok", "lat", "sor", "hiv", "hivM"].forEach(function (k) { if (!r[k] || typeof r[k] !== "object" || Array.isArray(r[k])) r[k] = {}; });
  if (!Array.isArray(r.fel)) r.fel = [];
  if (typeof r.fv !== "number") r.fv = 0;
  if (typeof r.elakad !== "number") r.elakad = null;
}
function nyitasRekordKeres(profilok) {
  var ki = null;
  Object.keys(profilok || {}).forEach(function (k) { var p = profilok[k]; if (!ki && p && p.uj && typeof p.uj === "object") ki = { k: k, r: p.uj }; });
  return ki;
}
/* egyik unikornisnál sincs végigjátszott pálya (a Fejtörő-hegyen sem) */
function nyitasSzuz(profilok) {
  return Object.keys(profilok || {}).every(function (k) {
    var p = profilok[k] || {}, f = (p.fejtoro || {}).palyak || {};
    function van(t) { return Object.keys(t || {}).some(function (id) { return t[id] && t[id].kesz; }); }
    return !van(p.palyak) && !van(f);
  });
}
/* a liget alap-állapota: "vil" / "nyitva" / "vers" (csak a vers-pálya ébren benne) / "alszik" — a versek fénye nélkül */
function nyitasLigetAllapot(r, sor, id, egyeniVan) {
  if (NYITAS_TANULO.indexOf(id) < 0) return null;
  if (id === "egyeni") return egyeniVan ? "nyitva" : "alszik";   /* a pult saját pályája mindig ott van; a 🌸 ösvény még vár */
  if (sor.vil.indexOf(id) >= 0 || r.nyilt[id] != null) return r.fel.indexOf(id) >= 0 ? "nyitva" : "vil";
  if (sor.nyitva.indexOf(id) >= 0) return "nyitva";
  return r.nyilt["vers:" + id] != null ? "vers" : "alszik";
}
/* 🌰🎵 vers-pályák (tiszta függvények — a pult is hívja) */
function nyitasVersAktiv(v, o, most) {
  if (!(o >= v.tol && o <= v.ig)) return false;
  if (o === v.feb) { var h = (most || new Date()).getMonth(); return h >= 1 && h <= 7; }   /* február–augusztus */
  return true;
}
function nyitasVersek(o) { return NYITAS_VERS.filter(function (v) { return nyitasVersAktiv(v, o); }); }
function nyitasVersPalya(id, o) { return nyitasVersek(o).filter(function (v) { return v.id === id; })[0] || null; }
/* világít-e: még nem megy versként, emlék-próba esedékes, vagy ma hívta az unikornis (elakadás) */
function nyitasVersVilagit(v, r, p, nap) {
  if (r.hiv[v.id] === nap) return true;
  var s = tudasTar(p)[v.id];
  if (!s || typeof s.megy !== "number") return true;
  return typeof s.esed === "number" && s.esed <= tenyNap();
}
/* a menet napja: a mai, még gyakorlás nélküli nap már a következő */
function nyitasNapja(r, p) { return Math.max(1, gyakNap(p) - r.g0 + (gyakMa(p) ? 0 : 1)); }

/* ── a játék ezt kérdezi ── */
/* fut-e a menet: { r, k (kezdő profil), p, o, sor } vagy null. Ha kell (és lehet), itt születik a rekord. */
function nyitasMenet() {
  if (typeof mentes !== "object" || !mentes || !mentes.profilok) return null;
  var b = nyitasBeall(), t = nyitasRekordKeres(mentes.profilok);
  if (b.menet === false) return null;
  if (!t) {
    if (b.menet !== true && !nyitasSzuz(mentes.profilok)) return null;
    if (!b.osztaly || !nyitasMentesKesz()) return null;   /* a pult osztálya nélkül a rekordot az első perc lufija hozza létre (nyitasIndit) */
    nyitasRekordUj(P(), null, b.osztaly);
    t = { k: mentes.leny, r: P().uj };
  }
  var o = b.osztaly || t.r.o;
  if (!NYITAS_OSZTALY[o]) return null;
  return { r: t.r, k: t.k, p: mentes.profilok[t.k], o: o, sor: NYITAS_OSZTALY[o] };
}
/* a rekord születése (a kezdő unikornisnál): o = a gyerek osztálya (lufi) vagy null (a pult adja: po) */
function nyitasRekordUj(p, o, po) {
  p.uj = { o: o, g0: gyakNap(p) - (gyakMa(p) ? 1 : 0), t: Date.now() };
  nyitasNormal(p);
  nyitasVersek(po || o).forEach(function (v) {   /* a már esedékes vers az első naptól ott van (nem foglal napot, nincs ébredés) */
    if (nyitasLigetAllapot(p.uj, NYITAS_OSZTALY[po || o], v.liget, false) === "alszik") { p.uj.nyilt["vers:" + v.liget] = 0; p.uj.lat["vers:" + v.liget] = 1; }
  });
  p.bemutatva.terkep = 1;   /* a régi „a kertünk mostantól itt van…” mondat a régi játékosoknak szólt */
  ment();
}
/* az első perc vége (nyitokep.js): a lufi osztályával indul a menet (ha a pult is adott osztályt, az erősebb) */
function nyitasIndit(o) {
  var p = P(), t = nyitasRekordKeres(mentes.profilok);
  if (t) { if (o >= 1 && o <= 6) { t.r.o = o; ment(); } return; }
  nyitasRekordUj(p, o >= 1 && o <= 6 ? o : null, nyitasBeall().osztaly);
}
/* az első pálya: ide sétál az unikornis az első perc végén (tervlap 4.② „első pálya” oszlopa) */
var NYITAS_ELSO_LIGET = { 1: "osszeado", 2: "osszeado", 3: "osszeado", 4: "szorzo", 5: "vasar", 6: "vasar" };
/* 🛍️ a Bolt az újoncnál: 1 polc (ruhák), a 💧 kerti trükkök a harmattal, minden más a frissítések napjától (tervlap 4.③, 4.⑤) */
function nyitasBoltFulek() {
  var m = nyitasMenet(); if (!m || m.r.nyilt.frissites != null) return null;
  return m.r.nyilt.harmat != null ? ["holmik", "kert"] : ["holmik"];
}
/* az újonc rövidebb első pályája (tervlap 4.②): amíg egyik unikornisnál sincs végigjátszott pálya */
function nyitasRovidElso(pa) {
  if (!pa || pa.egyeni || pa.konyvtar || pa.szerszam || pa.polc || pa.vasar || pa.meres || pa.muhely || pa.teny || pa.villam || pa.fejtoro) return false;
  var a = pa.allomasok || [], alap = pa.alap || {};
  if (a.length < 5 || !a[a.length - 1].cel) return false;
  if (a.some(function (x) { var t = x.tipus || alap.tipus; return t === "szambontas" || t === "szorzotabla-felmondas"; })) return false;
  return !!nyitasMenet() && nyitasSzuz(mentes.profilok);
}
function nyitasMentesKesz() { return typeof FELHO === "undefined" || !FELHO.be || FELHO.kesz || !!FELHO.offline; }
function nyitasEgyeniVan() {
  return typeof egyeniPalyak === "function" && egyeniPalyak().some(function (pa) { return !pa.teny && !palyaRejtve(pa); });
}
function nyitasNap() { var m = nyitasMenet(); return m ? nyitasNapja(m.r, m.p) : 0; }
/* egy liget állapota a térképen ("vil" / "nyitva" / "alszik"), null = nincs menet vagy nem tanuló hely.
   A nyitott liget (és a vers-liget) világít, ha benne egy vers-pálya világít — oda hív az unikornis. */
function nyitasLiget(id) {
  var m = nyitasMenet(); if (!m) return null;
  var a = nyitasLigetAllapot(m.r, m.sor, id, nyitasEgyeniVan());
  if (a !== "nyitva" && a !== "vers") return a;
  var nap = nyitasNapja(m.r, m.p);
  return nyitasVersek(m.o).some(function (v) { return v.liget === id && nyitasVersVilagit(v, m.r, m.p, nap); }) ? "vil" : "nyitva";
}
/* egy játékhely ébren van-e (3. kör: utca, kert, fodrász…) — menet nélkül mindig */
function nyitasEbren(id) { var m = nyitasMenet(); return !m || m.r.nyilt[id] != null; }

/* a liget számolós pályái sorban (a vers-pályák nélkül — azok nem részei a sornak); a sorrend a PALYAK-é, mint a kártyáké */
function nyitasLigetPalyai(lg, o) {
  return PALYAK.filter(function (pa) { return palyaLiget(pa) === lg && !pa.hamarosan && !palyaRejtve(pa) && !nyitasVersPalya(pa.id, o); });
}
function nyitasLigetElso(lg, sor, o) {
  var L = nyitasLigetPalyai(lg, o), k = 0, eid = ((sor && sor.elso) || {})[lg];
  if (eid) L.forEach(function (pa, i) { if (pa.id === eid) k = i; });
  for (var i = k; i < L.length; i++) { var pr = P().palyak[L[i].id]; if (!(pr && pr.kesz)) return { pa: L[i], i: i, L: L }; }
  return null;
}
/* alszik-e a pálya a menet miatt (az egész liget alszik, vagy a világító ligetben még nem ő jön) */
function nyitasPalyaAlszik(pa) {
  if (!pa || pa.hamarosan || (pa.egyeni && !pa.teny)) return false;
  var m = nyitasMenet(); if (!m) return false;
  var lg = palyaLiget(pa), all = nyitasLigetAllapot(m.r, m.sor, lg, nyitasEgyeniVan());
  if (all === "alszik") return true;
  if (nyitasVersPalya(pa.id, m.o)) return false;   /* 🌰🎵 a vers mindig ébren */
  if (all === "vers") return true;                  /* vers-liget: csak a vers ébren */
  /* a menetben ébredt ligetben a sor akkor is megmarad, ha a liget már „megy” (csak a fénye alszik ki) — különben felfelé ingyen nyílna */
  var soros = m.sor.vil.indexOf(lg) >= 0 || m.r.nyilt[lg] != null;
  if (!soros || pa.konyvtar || pa.szerszam || pa.polc) return false;
  var e = nyitasLigetElso(lg, m.sor, m.o);
  return !!e && e.L.indexOf(pa) > e.i;
}
/* ez a pálya világít-e a liget belsejében: a sorban következő, ill. a vers, amíg nem megy (vagy próba / hívás van) */
function nyitasPalyaVilagit(pa) {
  var m = nyitasMenet(); if (!m || !pa || pa.konyvtar || pa.szerszam || pa.polc) return false;
  var lg = palyaLiget(pa), all = nyitasLigetAllapot(m.r, m.sor, lg, nyitasEgyeniVan()), v = nyitasVersPalya(pa.id, m.o);
  if (v) return all !== "alszik" && nyitasVersVilagit(v, m.r, m.p, nyitasNapja(m.r, m.p));
  if (all !== "vil") return false;
  var e = nyitasLigetElso(lg, m.sor, m.o);
  return !!e && e.pa === pa;
}
/* a liget belsejébe lépve: ha ma elakadás miatt egy vers hív, az unikornis egyszer szól (ui.js renderFomenu) */
function nyitasVersHivas(lg) {
  var m = nyitasMenet(); if (!m) return "";
  var r = m.r, nap = nyitasNapja(r, m.p), ki = "";
  nyitasVersek(m.o).forEach(function (v) {
    if (ki || r.hiv[v.id] !== nap || r.hivM[v.id] === nap || v.hiv.indexOf(lg) < 0) return;
    if (nyitasLigetAllapot(r, m.sor, v.liget, nyitasEgyeniVan()) === "alszik") return;
    r.hivM[v.id] = nap; ment();
    ki = v.liget === lg ? v.mondat : v.mondat.replace("!", " " + (v.liget === "szorzo" ? "a Szorzós ligetben" : "az Összeadó ligetben") + "!");
  });
  return ki;
}

/* „megy” a liget: legalább NYITAS_MEGY.palya különböző pálya tiszta végigjátszással, legalább NYITAS_MEGY.nap napon */
function nyitasLigetMegy(p, lg, o) {
  var L = nyitasLigetPalyai(lg, o); if (!L.length) return false;
  var db = 0, napok = {}, t = tudasTar(p);
  L.forEach(function (pa) { var s = t[pa.id]; if (s && Array.isArray(s.n) && s.n.length) { db++; s.n.forEach(function (d) { napok[d] = 1; }); } });
  var versMegy = nyitasVersek(o).every(function (v) { var s = t[v.id]; return v.liget !== lg || (s && typeof s.megy === "number"); });   /* felfelé csak biztos alapról */
  return versMegy && db >= Math.min(NYITAS_MEGY.palya, L.length) && Object.keys(napok).length >= NYITAS_MEGY.nap;
}
/* a mai nap nyílása (ha még nincs): felfelé → oldalra → játékhely. van = a térképen létező ligetek (fomenuLigetek().regiok). */
function nyitasKovetkezo(m, nap, van) {
  var r = m.r, eg = nyitasEgyeniVan();
  function alvo(lista) { return lista.filter(function (id) { return van[id] && nyitasLigetAllapot(r, m.sor, id, eg) === "alszik"; })[0]; }
  if (r.fv > 0) {
    var f = alvo(m.sor.fel);
    if (f) { r.fv--; return f; }
    r.fv = 0;
  }
  /* 🎵 a vers ideje eljött (2. o. februárja), de a ligete még alszik → vers-ligetként ébred */
  var vl = nyitasVersek(m.o).filter(function (v) { return van[v.liget] && nyitasLigetAllapot(r, m.sor, v.liget, eg) === "alszik"; })[0];
  if (vl) return "vers:" + vl.liget;
  if (r.elakad != null && r.elakad < nap) {
    var o = alvo(m.sor.oldal);
    r.elakad = null;
    if (o) return o;
  }
  for (var i = 0; i < NYITAS_NAPOK.length; i++) {
    var id = NYITAS_NAPOK[i][0];
    if (r.nyilt[id] != null) continue;
    if (id === "bank" && !(m.p.csillampor > 0 && m.p.tunderharmat > 0)) continue;   /* csak ha ✨ és 💧 is gyűlik */
    return NYITAS_NAPOK[i][1] <= nap ? id : null;
  }
  return null;
}
/* a térkép hívja rajzolás előtt: „megy”-e valamelyik világító liget, és ha a mai nap még szabad, mi nyílik.
   Visszaadja a felébredt, de még be nem mutatott ligeteket (a térkép felszállítja róluk a ködöt). */
function nyitasFrissit(van) {
  var m = nyitasMenet(); if (!m) return [];
  var r = m.r, nap = nyitasNapja(r, m.p), valt = false, eg = nyitasEgyeniVan();
  NYITAS_TANULO.forEach(function (id) {
    if (r.fel.indexOf(id) < 0 && nyitasLigetAllapot(r, m.sor, id, eg) === "vil" && nyitasLigetMegy(m.p, id, m.o)) { r.fel.push(id); r.fv++; valt = true; }
  });
  if (r.napok[nap] == null && !NYITAS_SARKANY_NAP[nap]) {
    var id = nyitasKovetkezo(m, nap, van || {});
    if (id) { r.napok[nap] = id; r.nyilt[id] = nap; valt = true; }
  }
  if (valt) ment();
  return NYITAS_TANULO.filter(function (id) {
    return (r.nyilt[id] != null && !r.lat[id]) || (r.nyilt["vers:" + id] != null && !r.lat["vers:" + id]);
  });
}
function nyitasLatta(id) {
  var m = nyitasMenet(); if (!m) return;
  var r = m.r, valt = false;
  [id, "vers:" + id].forEach(function (k) { if (r.nyilt[k] != null && !r.lat[k]) { r.lat[k] = 1; valt = true; } });
  if (valt) ment();
}

/* az esemeny() hívja (analytics.js): elakadás = ugyanazon a pályán egymás után kerülős kör vagy félbehagyás */
function nyitasEsemeny(tipus, adat) {
  try {
    if (tipus !== "palya_end" && tipus !== "palya_kilep") return;
    var m = nyitasMenet(); if (!m || !adat || !adat.palyaId) return;
    var pid = String(adat.palyaId), pa = typeof palyaKeres === "function" ? palyaKeres(pid) : null;
    if (!pa || NYITAS_TANULO.indexOf(palyaLiget(pa)) < 0) return;
    var r = m.r;
    if (tipus === "palya_end" && adat.teljes) { if (r.sor[pid]) { delete r.sor[pid]; ment(); } return; }
    r.sor[pid] = (r.sor[pid] || 0) + 1;
    if (r.sor[pid] >= NYITAS_ELAKAD) {
      var nap = nyitasNapja(r, m.p), lg = palyaLiget(pa);
      delete r.sor[pid];
      if (r.elakad == null) r.elakad = nap;   /* holnap oldalra */
      nyitasVersek(m.o).forEach(function (v) { if (v.id !== pid && v.hiv.indexOf(lg) >= 0) r.hiv[v.id] = nap; });   /* ma: előbb a vers */
    }
    ment();
  } catch (e) { /* a menet soha ne akassza meg a játékot */ }
}

/* ── a pult nézete: mi a helyzet ennél a gyereknél (a gyerek mentéséből + a pult beállításából) ── */
function nyitasPultAllapot(profilok, beall) {
  var t = nyitasRekordKeres(profilok), o = beall.osztaly || (t && t.r.o);
  if (beall.menet === false) return { menet: false, ok: "ki" };
  if (!t) return { menet: false, ok: beall.menet === true || nyitasSzuz(profilok) ? (o ? "indul" : "osztaly") : "regi" };
  nyitasNormal({ uj: t.r });
  var sor = NYITAS_OSZTALY[o], p = profilok[t.k];
  if (!sor) return { menet: false, ok: "osztaly", k: t.k };
  var all = {}, nap = nyitasNapja(t.r, p);
  NYITAS_TANULO.forEach(function (id) { if (id !== "egyeni") all[id] = nyitasLigetAllapot(t.r, sor, id, false); });
  var versek = nyitasVersek(o).map(function (v) {
    var s = tudasTar(p)[v.id] || {};
    return { id: v.id, liget: v.liget, megy: typeof s.megy === "number", esed: typeof s.esed === "number" ? s.esed : null, vil: nyitasVersVilagit(v, t.r, p, nap), hiv: t.r.hiv[v.id] === nap };
  });
  return { menet: true, k: t.k, o: o, nap: nap, all: all, versek: versek, napok: t.r.napok, elakad: t.r.elakad, fv: t.r.fv };
}

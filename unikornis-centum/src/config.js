/* ============ 12f) FELHŐ — producer-felülírások + csoportok (backend 4. fázis) ============
   A producer a pulton (admin/) állítja, a játék csak olvassa:
     producerConfig/{uid}.overrides[palyaId] = { enabled?, recommended?, extraReward?,
                                                 muvelet?, tablak?, darab?, kulcs?, korlat? } — egyéni
     producerConfig/{uid}.kapuOrak = N (a kapu óraszáma, alap 12)
     producerConfig/{uid}.ekStabil = { nap, arany } (📚 Bagolykönyvtár stabil-küszöb, alap 3 nap × 0,8 — pult 🧱 fül)
     producerConfig/{uid}.bank = { valtasId: { ar, korlat, ki, mod, palyak } } (🏦 Tündérbank, bank.js — bankOsszevon)
     producerConfig/{uid}.teny = { hatar, hatarTipus, ujKor, becsempesz, osveny, tablak } (🌸 tény-motor, teny.js — tenyOsszevon)
     producerConfig/{uid}.szerszam = { k, n, latszik, liftKer } (🧰 szerszám-létrák, szerszam.js — szerszamOsszevon)
     groups/{gid} = { name, members: [uid], overrides: {…ugyanígy}, kapuOrak?, ekStabil?, bank?, teny?, szerszam? }  — csoportos
   Sorrend: alap < csoport(ok) < egyéni (az egyéni a legerősebb). Több csoportnál: rejtve, ha BÁRMELYIK
   elrejti; ajánlott, ha bármelyik ajánlja; a szorzó a legnagyobb; a nehézségnél a KÖNNYEBB nyer
   (összeadás/szorzás a kivonás/osztás előtt, a táblák metszete, a kisebb feladatszám); kulcs-pálya, ha bármelyik
   kulcsnak jelöli; a kapu óraszáma és a darabkorlát a nagyobb (engedékenyebb); a stabil-küszöbnél a kevesebb nap
   és a kisebb arány (szintén az engedékenyebb).
   A gyerek nem látja, hogy testreszabott: a rejtett pálya egyszerűen nincs ott, az ajánlott 💖-t kap,
   az extra szorzó csak a ✨-ban látszik. Rejtett pálya nem lehet kapu-kulcs (engine-logic.js kapuKulcsok).
   Offline: az utolsó ismert eredményt localStorage őrzi; felhő nélkül (kapcsoló ki) nincs felülírás. */
var FELULIR_KULCS = "uc_felulirasok";
var FELULIR = {
  uid: null,
  egyeni: null,       /* producerConfig/{uid}.overrides — null, amíg nem jött meg */
  csoportok: null,    /* { gid: overrides } — null, amíg nem jött meg */
  kesz: {},           /* összevont eredmény: palyaId → { enabled, recommended, extraReward, …, kulcs, korlat } */
  egyeniOrak: null,   /* producerConfig/{uid}.kapuOrak */
  csoportOrak: {},    /* gid → kapuOrak */
  kapuOrak: null,     /* összevont kapu-óraszám (null = alap 12) */
  egyeniStabil: null, /* producerConfig/{uid}.ekStabil */
  csoportStabil: {},  /* gid → ekStabil */
  ekStabil: null,     /* összevont stabil-küszöb { nap, arany } (null = alap, konyvtar-mester.js EK_STABIL_ALAP) */
  egyeniBank: null,   /* producerConfig/{uid}.bank */
  csoportBank: {},    /* gid → bank */
  bank: {},           /* összevont bank-beállítás: valtasId → { ar, korlat, ki, mod, palyak } (üres = a bank zárva) */
  egyeniTeny: null,   /* producerConfig/{uid}.teny */
  csoportTeny: {},    /* gid → teny */
  teny: {},           /* összevont tény-motor beállítás (üres = alap, teny.js TENY_ALAP) */
  egyeniSzer: null,   /* producerConfig/{uid}.szerszam */
  csoportSzer: {},    /* gid → szerszam */
  szerszam: {},       /* összevont szerszám-létra beállítás (üres = alap, szerszam.js SZERSZAM_ALAP) */
  egyeniP: null,      /* producerConfig/{uid}.customLevels — egyéni pályák (4b) */
  csoportP: null,     /* a csoportok customLevels-e egybe */
  palyak: {},         /* összevont egyéni pályák: id → nyers leírás (csak az aktívak) */
  leir: []
};

function felulirCacheBetolt() {
  try {
    var c = JSON.parse(localStorage.getItem(FELULIR_KULCS) || "null");
    if (c && c.kesz) { FELULIR.uid = c.uid || null; FELULIR.kesz = c.kesz; FELULIR.palyak = c.palyak || {}; FELULIR.kapuOrak = c.kapuOrak || null; FELULIR.ekStabil = c.ekStabil || null; FELULIR.bank = c.bank || {}; FELULIR.teny = c.teny || {}; FELULIR.szerszam = c.szerszam || {}; }
  } catch (e) {}
}
function felulirCacheTorol() {
  FELULIR.kesz = {}; FELULIR.palyak = {}; FELULIR.kapuOrak = null; FELULIR.ekStabil = null; FELULIR.bank = {}; FELULIR.teny = {}; FELULIR.szerszam = {};
  try { localStorage.removeItem(FELULIR_KULCS); } catch (e) {}
}

/* belépés után: élő figyelés a saját beállításra és azokra a csoportokra, amelyeknek tagja */
function felulirFigyel() {
  if (FELULIR.uid && FELULIR.uid !== FELHO.uid) felulirCacheTorol();   /* másik fiók gyorsítótára volt */
  FELULIR.uid = FELHO.uid;
  felulirLeiratkozik();
  var db = FELHO.db;
  FELULIR.leir.push(db.collection("producerConfig").doc(FELHO.uid).onSnapshot(function (d) {
    FELULIR.egyeni = (d.exists && d.data().overrides) || {};
    FELULIR.egyeniP = (d.exists && d.data().customLevels) || {};
    FELULIR.egyeniOrak = d.exists && typeof d.data().kapuOrak === "number" ? d.data().kapuOrak : null;
    FELULIR.egyeniStabil = (d.exists && d.data().ekStabil) || null;
    FELULIR.egyeniBank = (d.exists && d.data().bank) || {};
    FELULIR.egyeniTeny = (d.exists && d.data().teny) || {};
    FELULIR.egyeniSzer = (d.exists && d.data().szerszam) || {};
    felulirSzamol();
  }, function (e) { console.warn("[felhő] producer-beállítás hiba:", e.code || e); }));
  FELULIR.leir.push(db.collection("groups").where("members", "array-contains", FELHO.uid).onSnapshot(function (snap) {
    var cs = {}, cp = {}, co = {}, cst = {}, cb = {}, ct = {}, csz = {};
    snap.forEach(function (d) {
      cs[d.id] = d.data().overrides || {};
      if (typeof d.data().kapuOrak === "number") co[d.id] = d.data().kapuOrak;
      if (d.data().ekStabil) cst[d.id] = d.data().ekStabil;
      if (d.data().bank) cb[d.id] = d.data().bank;
      if (d.data().teny) ct[d.id] = d.data().teny;
      if (d.data().szerszam) csz[d.id] = d.data().szerszam;
      var l = d.data().customLevels || {}; for (var k in l) cp[k] = l[k];
    });
    FELULIR.csoportok = cs; FELULIR.csoportP = cp; FELULIR.csoportOrak = co; FELULIR.csoportStabil = cst; FELULIR.csoportBank = cb; FELULIR.csoportTeny = ct; FELULIR.csoportSzer = csz;
    felulirSzamol();
  }, function (e) { console.warn("[felhő] csoport-beállítás hiba:", e.code || e); }));
}
function felulirLeiratkozik() {
  FELULIR.leir.forEach(function (f) { try { f(); } catch (e) {} });
  FELULIR.leir = [];
}

var NEHEZ_MEZOK = ["enabled", "recommended", "extraReward", "muvelet", "tablak", "darab", "kulcs", "korlat"];
var KONNYU_MUVELET = ["osszeadas", "szorzas"];   /* két csoport ütközésénél ez a könnyebb */

/* a pult ugyanezt a szabályt használja (admin/index.html felulirOsszevon) — együtt változtasd! */
function felulirOsszevon(egyeni, csoportLista) {
  var ki = {};
  function mezo(id) { return ki[id] || (ki[id] = {}); }
  csoportLista.forEach(function (ov) {
    Object.keys(ov || {}).forEach(function (id) {
      var o = ov[id] || {}, k = mezo(id);
      if (o.enabled === false) k.enabled = false;
      if (o.recommended === true) k.recommended = true;
      if (typeof o.extraReward === "number") k.extraReward = Math.max(k.extraReward || 1, o.extraReward);
      if (o.muvelet) k.muvelet = (k.muvelet && KONNYU_MUVELET.indexOf(k.muvelet) >= 0) ? k.muvelet : o.muvelet;
      if (o.tablak && o.tablak.length) {
        if (!k.tablak) k.tablak = o.tablak.slice();
        else {
          var met = k.tablak.filter(function (x) { return o.tablak.indexOf(x) >= 0; });
          k.tablak = met.length ? met : (o.tablak.length < k.tablak.length ? o.tablak.slice() : k.tablak);
        }
      }
      if (typeof o.darab === "number") k.darab = Math.min(k.darab || 99, o.darab);
      if (o.kulcs === true) k.kulcs = true;
      if (typeof o.korlat === "number") k.korlat = Math.max(k.korlat || 0, o.korlat);
    });
  });
  Object.keys(egyeni || {}).forEach(function (id) {
    var o = egyeni[id] || {}, k = mezo(id);
    NEHEZ_MEZOK.forEach(function (m) { if (o[m] != null) k[m] = o[m]; });
  });
  return ki;
}
/* a kapu óraszáma: az egyéni nyer; különben a csoportok közül a hosszabb; semmi → null (alap 12) */
function kapuOrakOsszevon(egyeni, csoportOrak) {
  if (typeof egyeni === "number") return egyeni;
  var m = null; csoportOrak.forEach(function (o) { if (typeof o === "number") m = Math.max(m || 0, o); });
  return m;
}
/* a stabil-küszöb: az egyéni nyer (mezőnként); különben a csoportok közül a kevesebb nap / kisebb arány; semmi → null (alap) */
function ekStabilOsszevon(egyeni, csoportok) {
  function jo(x) { return x && (x.nap >= 1 || x.arany > 0); }
  var ki = null;
  csoportok.forEach(function (c) {
    if (!jo(c)) return;
    ki = ki || {};
    if (c.nap >= 1) ki.nap = ki.nap ? Math.min(ki.nap, c.nap) : c.nap;
    if (c.arany > 0) ki.arany = ki.arany ? Math.min(ki.arany, c.arany) : c.arany;
  });
  if (jo(egyeni)) { ki = ki || {}; if (egyeni.nap >= 1) ki.nap = egyeni.nap; if (egyeni.arany > 0) ki.arany = egyeni.arany; }
  if (!ki) return null;
  return { nap: Math.round(ki.nap || 3), arany: ki.arany || 0.8 };
}

/* 🏦 Tündérbank (2026-10-01): váltásonként { ar?, korlat?, ki?, mod?: "nap"|"palya", palyak?: [id] }.
   Több csoportnál a SZIGORÚBB nyer: a magasabb ár, a kisebb napi korlát, a kikapcsolt; a pályás mód erősebb a napinál,
   a kijelölt pályák listája összeadódik. Az egyéni mezőnként mindent felülír (korlat: -1 = nála nincs korlát,
   ki: false = nála be van kapcsolva). Ár nélkül a bank zárva (nincs alapérték).
   A pult (admin/index.html bankOsszevon) UGYANEZ — együtt változtasd! */
function bankOsszevon(egyeni, csoportok) {
  var ki = {};
  function v(id) { return ki[id] || (ki[id] = {}); }
  function unio(a, b) { var l = (a || []).slice(); (b || []).forEach(function (x) { if (l.indexOf(x) < 0) l.push(x); }); return l; }
  csoportok.forEach(function (c) {
    Object.keys(c || {}).forEach(function (id) {
      var o = c[id] || {}, k = v(id);
      if (typeof o.ar === "number" && o.ar >= 1) k.ar = Math.max(k.ar || 0, o.ar);
      if (typeof o.korlat === "number" && o.korlat >= 0) k.korlat = typeof k.korlat === "number" ? Math.min(k.korlat, o.korlat) : o.korlat;
      if (o.ki === true) k.ki = true;
      if (o.mod === "palya") { k.mod = "palya"; k.palyak = unio(k.palyak, o.palyak); }
      else if (o.mod === "nap" && !k.mod) k.mod = "nap";
    });
  });
  Object.keys(egyeni || {}).forEach(function (id) {
    var o = egyeni[id] || {}, k = v(id);
    if (typeof o.ar === "number" && o.ar >= 1) k.ar = o.ar;
    if (typeof o.korlat === "number") { if (o.korlat >= 0) k.korlat = o.korlat; else delete k.korlat; }
    if (typeof o.ki === "boolean") k.ki = o.ki;
    if (o.mod === "nap" || o.mod === "palya") k.mod = o.mod;
    if (Array.isArray(o.palyak)) k.palyak = o.palyak.slice();
  });
  Object.keys(ki).forEach(function (id) {
    var k = ki[id];
    if (k.mod !== "palya") delete k.palyak; else if (!k.palyak) k.palyak = [];
    if (k.ki !== true) delete k.ki;
  });
  return ki;
}

function felulirSzamol() {
  if (FELULIR.egyeni === null || FELULIR.csoportok === null) return;   /* várjuk mindkét forrást — addig a gyorsítótár él */
  var cs = FELULIR.csoportok, lista = Object.keys(cs).sort().map(function (g) { return cs[g]; });
  var uj = felulirOsszevon(FELULIR.egyeni, lista), ujP = {}, k;
  var ujO = kapuOrakOsszevon(FELULIR.egyeniOrak, Object.keys(FELULIR.csoportOrak || {}).map(function (g) { return FELULIR.csoportOrak[g]; }));
  [FELULIR.csoportP || {}, FELULIR.egyeniP || {}].forEach(function (l) {
    for (k in l) if (l[k] && l[k].aktiv !== false) ujP[k] = l[k];
  });
  var ujS = ekStabilOsszevon(FELULIR.egyeniStabil, Object.keys(FELULIR.csoportStabil || {}).sort().map(function (g) { return FELULIR.csoportStabil[g]; }));
  var ujB = bankOsszevon(FELULIR.egyeniBank, Object.keys(FELULIR.csoportBank || {}).sort().map(function (g) { return FELULIR.csoportBank[g]; }));
  var ujT = tenyOsszevon(FELULIR.egyeniTeny, Object.keys(FELULIR.csoportTeny || {}).sort().map(function (g) { return FELULIR.csoportTeny[g]; }));
  var ujSz = szerszamOsszevon(FELULIR.egyeniSzer, Object.keys(FELULIR.csoportSzer || {}).sort().map(function (g) { return FELULIR.csoportSzer[g]; }));
  if (JSON.stringify(uj) === JSON.stringify(FELULIR.kesz) && JSON.stringify(ujP) === JSON.stringify(FELULIR.palyak) && ujO === FELULIR.kapuOrak &&
      JSON.stringify(ujS) === JSON.stringify(FELULIR.ekStabil) && JSON.stringify(ujB) === JSON.stringify(FELULIR.bank) &&
      JSON.stringify(ujT) === JSON.stringify(FELULIR.teny) && JSON.stringify(ujSz) === JSON.stringify(FELULIR.szerszam)) return;
  FELULIR.kesz = uj; FELULIR.palyak = ujP; FELULIR.kapuOrak = ujO; FELULIR.ekStabil = ujS; FELULIR.bank = ujB; FELULIR.teny = ujT; FELULIR.szerszam = ujSz;
  try { localStorage.setItem(FELULIR_KULCS, JSON.stringify({ uid: FELULIR.uid, kesz: uj, palyak: ujP, kapuOrak: ujO, ekStabil: ujS, bank: ujB, teny: ujT, szerszam: ujSz })); } catch (e) {}
  var akt = document.querySelector(".kepernyo.aktiv"), id = akt ? akt.id : "";
  if (id === "kepernyo-profil") renderProfil();
  else if (id === "kepernyo-fomenu") renderFomenu();
  else if (id === "kepernyo-utca") renderUtca();     /* 🏦 a bank zárva/nyitva címkéje */
  else if (id === "kepernyo-bank") bankFrissit();
}

/* ── a játék ezeket kérdezi ── */
function palyaFelulir(id) { return FELULIR.kesz[id] || {}; }
function palyaRejtve(pa) {
  if (pa && pa.meres && !meresLathato()) return true;   /* mérés-ligetek: élesítve 2026-09-27 (meres.js meresLathato) */
  return !!pa && palyaFelulir(pa.id).enabled === false;
}
function palyaAjanlott(pa) { return !!pa && palyaFelulir(pa.id).recommended === true; }
var AJANLOTT_HARMAT = 2;   /* 💖 ajánlott pálya: +2 💧 minden befejezéskor (nincs napi korlát) */
function palyaSzorzo(pa) {
  var x = pa ? +palyaFelulir(pa.id).extraReward : 1;
  return x >= 1 && x <= 3 ? x : 1;
}

/* ── nehézség-állítás (4. fázis, 2026-09-24): a pálya állomásait a producer beállítása szerint alakítja.
   Az állomások sorrendje és fokozatossága megmarad; a gyerek nem látja, hogy testreszabott.
   Jutalom változatlan (feladatonként jár, tehát a feladatszámmal arányos). Kulcs-pályákon is él. */
function nehezsegAlkalmaz(pa, allomasok) {
  var f = palyaFelulir(pa.id), tip = (pa.alap || {}).tipus, al = pa.alap || {};
  var felmondos = (tip === "szambontas" || tip === "szorzotabla-felmondas");
  var maxT = tip === "maradekos_osztas" ? 9 : 10;
  var T = (f.tablak || []).map(Number).filter(function (x) { return x >= 2 && x <= maxT && x % 1 === 0; });
  var darab = +f.darab;
  function metszet(lista) {
    var m = (lista || []).filter(function (x) { return T.indexOf(x) >= 0; });
    return m.length ? m : T.slice();
  }
  return allomasok.map(function (o) {
    /* ── 🧺 Tündérvásár: a „3” → standonként legfeljebb 2 feladat; nagyobbra nem hosszabbít (tartalom-lap „Pályahossz”) ── */
    if (tip === "vasar") { if (darab >= 1 && darab <= 3 && o.darab) o.darab = Math.min(o.darab, 2); return o; }
    /* ── összeadás ↔ kivonás: a fordított művelettel, ugyanabban a számkörben (a+b=c ↔ c−b=a) ── */
    if (tip === "osszeadas" && (f.muvelet === "osszeadas" || f.muvelet === "kivonas") && o.tipus !== f.muvelet) {
      var emax = al.eredmeny_max || 100, lo, hi;
      if (f.muvelet === "kivonas") {
        lo = o.a_min + o.b_min; hi = Math.min(o.a_max + o.b_max, emax);
      } else {
        lo = Math.max(al.a_min || 1, o.a_min - o.b_max); hi = o.a_max - o.b_min;
        o.eredmeny_max = Math.min(emax, o.a_max);
      }
      o.a_min = Math.min(lo, hi); o.a_max = hi; o.tipus = f.muvelet;
    }
    /* ── szorzás-osztás vegyes pályán: csak az egyik ── */
    if (tip === "szorzasosztas" && (f.muvelet === "szorzas" || f.muvelet === "osztas")) o.tipus = f.muvelet;
    /* ── táblák / osztók: az állomás saját készletének metszete a beállítottal; ha üres, a teljes beállított ── */
    if (T.length) {
      if (tip === "szorzotabla-felmondas") {
        o.tabla_keszlet = metszet(o.tabla != null ? [o.tabla] : o.tabla_keszlet); delete o.tabla;
      } else if (tip === "szorzasosztas") {
        if (o.szorzo != null || o.szorzo_keszlet) { o.szorzo_keszlet = metszet(o.szorzo != null ? [o.szorzo] : o.szorzo_keszlet); delete o.szorzo; }
        else o.tablak = metszet(o.tablak);
      } else if (tip === "osztas" || tip === "maradekos_osztas") {
        o.osztok = metszet(o.osztok);
      } else if (tip === "hianyzo" && o.tablak) {   /* 🌙 Holdfény-bújócska: az ismert tábla / osztó */
        o.tablak = metszet(o.tablak);
      }
    }
    if (!felmondos && darab >= 1 && darab <= 12) o.darab = darab;
    return o;
  });
}

/* ============ EGYÉNI PÁLYÁK (4b, 2026-09-24) ============
   A producer a pulton (✏️ Egyéni pályák) rak össze pályát egy gyereknek vagy egy csoportnak:
     producerConfig/{uid}.customLevels[id]  vagy  groups/{gid}.customLevels[id] =
       { nev, ikon, sablon, aktiv, allomasDb (3–7), darab (3–8), letrehozva,
         tablak | osztok | szamok | fajtak, muvelet }
   Sablonok (mind meglévő motorra épül): szorzas (× / ÷ / vegyes a bejelölt táblákkal) · felmondas (szorzótábla
   hangosan) · osszeadas (a beépített összeadó pályák fajtáiból) · maradekos (osztók) · bontas (számbontás hangosan).
   A gyereknél a menü tetején, a „💖 Neked készült” ligetben jelennek meg; a kapu nem zárja őket (de kulcs lehet belőlük),
   ✨ + 💧 jár értük, de égi szilánk, 🌟-számláló, jelvény és napi kiemelés NEM (azok a közös PALYAK-hoz tartoznak).
   Fokozatosság: előbb a bejelöltek egyenként (vagy kis csoportokban), a végén mind keverve.
   A pult (admin/index.html) ugyanezeket a sablon-mezőket írja — együtt változtasd! */
var EGYENI_ALLOMAS_NEVEK = ["Mohos kő", "Pitypangmező", "Kis fahíd", "Gombaház", "Csillámpatak", "Lepkerét",
  "Szivárványtó", "Holdfény-tisztás", "Harmatos rét", "Mókusodú"];
var EGYENI_OSSZEADO_FAJTAK = ["oszkiv-10", "oszkiv-20", "tizesek", "aprok", "lepegeto", "atlepo", "erdo-melye", "erdo-szive"];
var EGYENI_MEMO = { kulcs: null, lista: [] };

function egyeniSzamok(lista, min, max) {
  var ki = [];
  (lista || []).forEach(function (x) { x = +x; if (x % 1 === 0 && x >= min && x <= max && ki.indexOf(x) < 0) ki.push(x); });
  return ki.sort(function (a, b) { return a - b; });
}
/* n állomás készlete: előbb egymás utáni kis csoportokban (egyesével, ha elfér), a maradék állomáson mind együtt */
function egyeniFokozatos(L, n) {
  var k = L.length === 1 ? 1 : Math.min(L.length, n - 1), ki = [];
  for (var i = 0; i < k; i++) ki.push(L.slice(Math.floor(i * L.length / k), Math.floor((i + 1) * L.length / k)));
  while (ki.length < n) ki.push(L.slice());
  return ki;
}
/* összeadó fajta → állomás-beállítás a beépített pálya adataiból (összeadásnál a teljes alap-tartomány,
   kivonásnál a pálya utolsó kivonásos állomásának tartománya — azt már kipróbáltuk) */
function egyeniOsszeadoCfg(pid, muv) {
  var pa = palyaKeres(pid), o = {}, k;
  for (k in pa.alap) o[k] = pa.alap[k];
  if (muv === "kivonas") {
    var ks = null;
    pa.allomasok.forEach(function (a) { if (a.tipus === "kivonas") ks = a; });
    ["a_min", "a_max", "b_min", "b_max"].forEach(function (m) { if (ks && ks[m] != null) o[m] = ks[m]; });
  }
  o.tipus = muv;
  return o;
}
function egyeniPalyaEpit(id, r) {
  if (!r) return null;
  var n = Math.max(3, Math.min(7, +r.allomasDb || 5)), darab = Math.max(3, Math.min(8, +r.darab || 5));
  var st = [], alap = {}, szint = 4, kez = false, mat = "", L;
  switch (r.sablon) {
    case "szorzas":
      L = egyeniSzamok(r.tablak, 2, 10); if (!L.length) return null;
      alap.tipus = r.muvelet === "szorzas" ? "szorzas" : (r.muvelet === "osztas" ? "osztas" : "szorzasosztas");
      szint = r.muvelet === "szorzas" ? 4 : 5;
      egyeniFokozatos(L, n).forEach(function (c) { st.push({ tablak: c, darab: darab }); });
      mat = L.join(", ") + " · " + (r.muvelet === "szorzas" ? "szorzás" : (r.muvelet === "osztas" ? "osztás" : "× és ÷"));
      break;
    case "felmondas":
      L = egyeniSzamok(r.tablak, 2, 10); if (!L.length) return null;
      alap.tipus = "szorzotabla-felmondas"; szint = 8; kez = true;
      egyeniFokozatos(L, n).forEach(function (c) { st.push(c.length === 1 ? { tabla: c[0] } : { tabla_keszlet: c }); });
      mat = "szorzótábla hangosan: " + L.join(", ");
      break;
    case "maradekos":
      L = egyeniSzamok(r.osztok, 2, 9); if (!L.length) return null;
      alap.tipus = "maradekos_osztas"; szint = 6;
      egyeniFokozatos(L, n).forEach(function (c) { st.push({ osztok: c, max: Math.min(99, 11 * c[c.length - 1] - 1), darab: darab }); });
      mat = "maradékos osztás: " + L.join(", ");
      break;
    case "bontas":
      L = egyeniSzamok(r.szamok, 2, 10); if (!L.length) return null;
      alap.tipus = "szambontas"; szint = 8; kez = true;
      egyeniFokozatos(L, n).forEach(function (c) { st.push({ szam_keszlet: c }); });
      mat = "bontások hangosan: " + L.join(", ");
      break;
    case "osszeadas":
      L = EGYENI_OSSZEADO_FAJTAK.filter(function (f) { return (r.fajtak || []).indexOf(f) >= 0; });
      if (!L.length) return null;
      alap.tipus = "osszeadas"; kez = true;
      n = Math.max(n, L.length);   /* minden bejelölt fajta kapjon legalább egy állomást */
      szint = 1; L.forEach(function (f) { szint = Math.max(szint, palyaKeres(f).szint || 1); });
      for (var i = 0; i < n; i++) {
        /* vegyesnél váltakozik a + és a −, úgy, hogy minden fajta kapjon mindkettőből (ha van rá hely) */
        var par = (L.length % 2) ? i : i + Math.floor(i / L.length);
        var muv = (r.muvelet === "osszeadas" || r.muvelet === "kivonas") ? r.muvelet : (par % 2 ? "kivonas" : "osszeadas");
        var o = egyeniOsszeadoCfg(L[i % L.length], muv); o.darab = darab;
        st.push(o);
      }
      mat = r.muvelet === "osszeadas" ? "összeadás" : (r.muvelet === "kivonas" ? "kivonás" : "összeadás és kivonás");
      break;
    default: return null;
  }
  var h = 0; for (var j = 0; j < id.length; j++) h = (h * 31 + id.charCodeAt(j)) % 997;
  var allomasok = [{ nev: "Rajt" }];
  st.forEach(function (o, i) {
    var utolso = (i === st.length - 1);
    o.nev = utolso ? "Odú-küszöb" : EGYENI_ALLOMAS_NEVEK[(h + i) % EGYENI_ALLOMAS_NEVEK.length];
    if (utolso) o.cel = true;
    allomasok.push(o);
  });
  return { id: id, nev: String(r.nev || "Neked készült ösvény").slice(0, 40), ikon: r.ikon || "💖", regio: "egyeni", egyeni: true,
           szint: szint, palcim: mat, alap: alap, kez_nelkul: kez, allomasok: allomasok, letrehozva: +r.letrehozva || 0 };
}
/* az aktív egyéni pályák, létrehozás szerint (a legrégebbi elöl) — csak akkor épít újra, ha változott a forrás.
   Legelöl a 🌸 Neked szóló ösvény (teny.js tenyPalya), ha a gyereknek látszik. */
function egyeniPalyak() {
  var kulcs = JSON.stringify(FELULIR.palyak || {});
  if (kulcs !== EGYENI_MEMO.kulcs) {
    var l = [];
    Object.keys(FELULIR.palyak || {}).forEach(function (id) {
      try { var pa = egyeniPalyaEpit(id, FELULIR.palyak[id]); if (pa) l.push(pa); }
      catch (e) { console.warn("[egyéni pálya] hibás leírás:", id, e); }
    });
    l.sort(function (a, b) { return a.letrehozva - b.letrehozva || (a.id < b.id ? -1 : 1); });
    EGYENI_MEMO = { kulcs: kulcs, lista: l };
  }
  var tp = null;
  try { tp = tenyPalya(); } catch (e) { tp = null; }   /* 🌸 a Neked szóló ösvény az egyéniek előtt (teny.js); profil nélkül nincs */
  return tp ? [tp].concat(EGYENI_MEMO.lista) : EGYENI_MEMO.lista;
}
/* pálya keresése azonosító szerint: előbb a beépítettek, aztán az egyéniek */
function palyaKeres(id) {
  for (var i = 0; i < PALYAK.length; i++) if (PALYAK[i].id === id) return PALYAK[i];
  var e = egyeniPalyak();
  for (var j = 0; j < e.length; j++) if (e[j].id === id) return e[j];
  return null;
}

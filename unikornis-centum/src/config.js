/* ============ 12f) FELHŐ — producer-felülírások + csoportok (backend 4. fázis) ============
   A producer a pulton (admin/) állítja, a játék csak olvassa:
     producerConfig/{uid}.overrides[palyaId] = { enabled?, recommended?, extraReward?,
                                                 muvelet?, tablak?, darab? }                 — egyéni
     groups/{gid} = { name, members: [uid], overrides: {…ugyanígy} }                       — csoportos
   Sorrend: alap < csoport(ok) < egyéni (az egyéni a legerősebb). Több csoportnál: rejtve, ha BÁRMELYIK
   elrejti; ajánlott, ha bármelyik ajánlja; a szorzó a legnagyobb; a nehézségnél a KÖNNYEBB nyer
   (összeadás/szorzás a kivonás/osztás előtt, a táblák metszete, a kisebb feladatszám).
   A gyerek nem látja, hogy testreszabott: a rejtett pálya egyszerűen nincs ott, az ajánlott 💖-t kap,
   az extra szorzó csak a ✨-ban látszik. A kapu-kulcs pályák nem rejthetők (nélkülük zárva maradna az erdő).
   Offline: az utolsó ismert eredményt localStorage őrzi; felhő nélkül (kapcsoló ki) nincs felülírás. */
var FELULIR_KULCS = "uc_felulirasok";
var FELULIR = {
  uid: null,
  egyeni: null,       /* producerConfig/{uid}.overrides — null, amíg nem jött meg */
  csoportok: null,    /* { gid: overrides } — null, amíg nem jött meg */
  kesz: {},           /* összevont eredmény: palyaId → { enabled, recommended, extraReward } */
  leir: []
};

function felulirCacheBetolt() {
  try {
    var c = JSON.parse(localStorage.getItem(FELULIR_KULCS) || "null");
    if (c && c.kesz) { FELULIR.uid = c.uid || null; FELULIR.kesz = c.kesz; }
  } catch (e) {}
}
function felulirCacheTorol() {
  FELULIR.kesz = {};
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
    felulirSzamol();
  }, function (e) { console.warn("[felhő] producer-beállítás hiba:", e.code || e); }));
  FELULIR.leir.push(db.collection("groups").where("members", "array-contains", FELHO.uid).onSnapshot(function (snap) {
    var cs = {};
    snap.forEach(function (d) { cs[d.id] = d.data().overrides || {}; });
    FELULIR.csoportok = cs;
    felulirSzamol();
  }, function (e) { console.warn("[felhő] csoport-beállítás hiba:", e.code || e); }));
}
function felulirLeiratkozik() {
  FELULIR.leir.forEach(function (f) { try { f(); } catch (e) {} });
  FELULIR.leir = [];
}

var NEHEZ_MEZOK = ["enabled", "recommended", "extraReward", "muvelet", "tablak", "darab"];
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
    });
  });
  Object.keys(egyeni || {}).forEach(function (id) {
    var o = egyeni[id] || {}, k = mezo(id);
    NEHEZ_MEZOK.forEach(function (m) { if (o[m] != null) k[m] = o[m]; });
  });
  return ki;
}

function felulirSzamol() {
  if (FELULIR.egyeni === null || FELULIR.csoportok === null) return;   /* várjuk mindkét forrást — addig a gyorsítótár él */
  var cs = FELULIR.csoportok, lista = Object.keys(cs).sort().map(function (g) { return cs[g]; });
  var uj = felulirOsszevon(FELULIR.egyeni, lista);
  if (JSON.stringify(uj) === JSON.stringify(FELULIR.kesz)) return;
  FELULIR.kesz = uj;
  try { localStorage.setItem(FELULIR_KULCS, JSON.stringify({ uid: FELULIR.uid, kesz: uj })); } catch (e) {}
  var akt = document.querySelector(".kepernyo.aktiv"), id = akt ? akt.id : "";
  if (id === "kepernyo-profil") renderProfil();
  else if (id === "kepernyo-fomenu") renderFomenu();
}

/* ── a játék ezeket kérdezi ── */
function palyaFelulir(id) { return FELULIR.kesz[id] || {}; }
function palyaRejtve(pa) { return !!pa && !kapuKulcsPalya(pa.id) && palyaFelulir(pa.id).enabled === false; }
function palyaAjanlott(pa) { return !!pa && palyaFelulir(pa.id).recommended === true; }
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
      }
    }
    if (!felmondos && darab >= 1 && darab <= 12) o.darab = darab;
    return o;
  });
}

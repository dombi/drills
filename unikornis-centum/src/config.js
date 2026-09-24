/* ============ 12f) FELHŐ — producer-felülírások + csoportok (backend 4. fázis) ============
   A producer a pulton (admin/) állítja, a játék csak olvassa:
     producerConfig/{uid}.overrides[palyaId] = { enabled?, recommended?, extraReward? }   — egyéni
     groups/{gid} = { name, members: [uid], overrides: {…ugyanígy} }                       — csoportos
   Sorrend: alap < csoport(ok) < egyéni (az egyéni a legerősebb). Több csoportnál: rejtve, ha BÁRMELYIK
   elrejti; ajánlott, ha bármelyik ajánlja; a szorzó a legnagyobb.
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
    });
  });
  Object.keys(egyeni || {}).forEach(function (id) {
    var o = egyeni[id] || {}, k = mezo(id);
    ["enabled", "recommended", "extraReward"].forEach(function (m) { if (o[m] != null) k[m] = o[m]; });
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

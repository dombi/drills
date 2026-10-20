/* ============ 12) FELHŐ — Firebase beállítás + kapcsoló ============
   Backend-átállás 1. fázis. A felhő CSAK kapcsolóval él: ?felho → be (megjegyzi), ?felho=ki → ki.
   Kapcsoló nélkül a játék pontosan úgy fut, mint eddig (az SDK be sem töltődik).
   A config NEM titok — a védelmet a firestore.rules adja. */
var FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7O40iCaeSryo17HEOVcWKJ0263LY5-fw",
  authDomain: "unicornis-centum.firebaseapp.com",
  projectId: "unicornis-centum",
  storageBucket: "unicornis-centum.firebasestorage.app",
  messagingSenderId: "198411098733",
  appId: "1:198411098733:web:e55f82c3b71fe347123d64",
  databaseURL: "https://unicornis-centum-default-rtdb.europe-west1.firebasedatabase.app"   /* Égi Tüneménykert (RTDB, 5. fázis) */
};
var FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.14.1/";
var FELHO_EMAIL_DOMAIN = "unikornis.app";   /* belépőkód CSILLAG-42 → csillag-42@unikornis.app, jelszó: CSILLAG-42 */
var FELHO_KAPCS = "uc_felho";               /* localStorage: "1" = felhő-mód bekapcsolva ezen a gépen */
var FELHO_GAZDA = "uc_felho_gazda";         /* localStorage: melyik fiók (uid) adatai vannak a helyi mentésben */
var FELHO_GEP_JATEKOSOK = "uc_gep_jatekosok";   /* localStorage: kik léptek be ezen a gépen (névkártyához: kód + unikornis-kinézet); 2+ = közös gép */
var FELHO_MENTES_ELOTTE = "unikornis_centum_v1_felho_elott";   /* biztonsági másolat az első felhő-felülírás előtt */
var FELHO_SZAMLALOK = { csillampor: 1, tunderharmat: 1, jatekMp: 1 };   /* ezek delta-alapon (increment) szinkronizálnak */
/* 📴 Offline 1. kör — „semmi nem vész el" (terv/offline-jatek-rendszerterv.html) */
var FELHO_ALAP_ELOTAG = "uc_felho_alap_";   /* + uid: az utolsó, a felhőbe biztosan eljutott állapot (FELHO.alap tükre) — az offline összefésülés alapja */
var FELHO_KULDETLEN = "uc_kuldetlen";       /* uid: a helyi mentésben van olyan, ami még nem jutott el a felhőbe (net nélkül játszott) */
var FELHO_ESEMENY_SOR = "uc_esemeny_sor";   /* net nélkül gyűlt események (max. ESEMENY_SOR_MAX), visszatéréskor felmennek */
var FELHO_OFFLINE_MASOLAT = "unikornis_centum_v1_offline_elott_";   /* + időpont: a helyi mentés másolata, ha nem lehetett összefésülni (max. 3) */
var ESEMENY_SOR_MAX = 500;

var FELHO = {
  aktiv: false,       /* be van lépve + fut a szinkron */
  kesz: false,        /* megjött az első felhő-állapot (előtte nem küldünk) */
  uid: null, kod: null,
  auth: null, db: null,
  alap: {},           /* profilonként az utolsó ismert felhő-állapot (a 3-utas összefésülés alapja) */
  alapUser: null,
  idozito: null, leiratkozas: null,
  be: false,          /* felhő-mód ezen a gépen (felhoIndit) — a ment() ebből tudja, hogy a net nélküli játékot jelölnie kell */
  memoriaTar: false,  /* a Firestore offline tára nem elérhető (privát ablak…) → az írás csak a szerver nyugtája után számít elküldöttnek */
  kuldSzam: 0, nyugtazott: 0,  /* memoriaTar esetén: hány küldés ment el, és hányat nyugtázott a szerver */
  offline: null       /* 📴 net nélkül belépett gyerek { uid, kod, k } (hatizsak.js) — amíg a felhő nem él */
};

function felhoBekapcsolva() {
  try {
    var q = new URLSearchParams(location.search);
    if (q.has("felho")) {
      if (q.get("felho") === "ki") localStorage.removeItem(FELHO_KAPCS);
      else localStorage.setItem(FELHO_KAPCS, "1");
    }
    return localStorage.getItem(FELHO_KAPCS) === "1";
  } catch (e) { return false; }
}

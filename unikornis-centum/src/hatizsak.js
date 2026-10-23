/* ============ 12d2) FELHŐ — 📴 Offline 3. kör: közös gépen is (terv/offline-jatek-rendszerterv.html) ============
   HÁTIZSÁK gyerekenként: uc_hatizsak_<uid> = { mentes, kuldetlen, felulir, ido }.
     • Ha a gépen gazdát cserél a helyi mentés (kilépés, másik gyerek belépése nettel vagy net nélkül),
       az eddigi gazda mentése a hátizsákjába kerül — a még fel nem ment játékkal együtt (kuldetlen),
       és a pult-beállításai gyorsítótárával (felulir), hogy net nélkül is az ő pályái látsszanak.
     • Belépéskor a gyerek hátizsákja lesz a helyi mentés, és a hátizsák KIÜRÜL (áthelyezés, nem másolat):
       így ugyanaz a net nélküli különbség soha nem mehet fel kétszer (kiskapu).
     • Az eltett felhő-alap (uc_felho_alap_<uid>) eleve gyerekenként van → a hátizsákkal együtt az 1. kör
       összefésülése fut, amikor a gyerek legközelebb nettel belép.
   NET NÉLKÜLI BELÉPÉS: névkártya + a kód — a gép a névkártyához ma is a kódot jegyzi meg, így ugyanazt
   ellenőrizzük, mint nettel (ujjlenyomat nem kell). Új gyerek első belépése továbbra is netet kér.
   CSENDES VISSZALÉPÉS: a kód a munkamenetben marad (sessionStorage — ugyanott, ahol a Firebase is tartja
   a közös gépes belépést); ha jön a net és a gyerek épp a profilválasztón vagy a térképen van, a játék a
   háttérben belép, és az 1. kör hozzáadja a net nélküli játékot a felhőhöz. A gyerek ebből semmit nem lát. */
var HATIZSAK_ELOTAG = "uc_hatizsak_";
var FELHO_OFFLINE_BELEPES = "uc_offline_belepes";   /* sessionStorage: { uid, kod, k } — a net nélkül belépett gyerek */
var HATIZSAK_BIZTOS = { "kepernyo-fomenu": 1, "kepernyo-nyito": 1 };   /* itt nem fut pálya → a felhő-állapot ráírása nem zavar */

function hatizsakOlvas(uid) {
  try { var h = JSON.parse(localStorage.getItem(HATIZSAK_ELOTAG + uid) || "null"); return h && h.mentes && h.mentes.profilok ? h : null; } catch (e) { return null; }
}
/* a mostani helyi mentés a gazdája hátizsákjába; visszaad: sikerült-e */
function hatizsakBe(uid) {
  if (!uid) return false;
  var r, f, h;
  try { r = localStorage.getItem(KULCS); f = localStorage.getItem(FELULIR_KULCS); } catch (e) { return false; }
  if (!r) return false;
  try { var fo = JSON.parse(f || "null"); if (!fo || fo.uid !== uid) f = null; } catch (e) { f = null; }   /* csak a saját pult-gyorsítótára */
  h = '{"mentes":' + r + ',"kuldetlen":' + (felhoKuldetlen() === uid) + ',"felulir":' + (f || "null") + ',"ido":' + Date.now() + '}';
  try { localStorage.setItem(HATIZSAK_ELOTAG + uid, h); return true; } catch (e) {}
  try { localStorage.setItem(HATIZSAK_ELOTAG + uid, '{"mentes":' + r + ',"kuldetlen":' + (felhoKuldetlen() === uid) + ',"felulir":null,"ido":' + Date.now() + '}'); return true; }   /* tele a tár: a pult-gyorsítótár nélkül */
  catch (e) { felhoOfflineMasolat(); return false; }   /* így sem fér el → legalább a gép biztonsági másolata (helyreallitas.html) */
}
function helyiVanJatek() {
  try {
    var m = JSON.parse(localStorage.getItem(KULCS) || "null"), van = false;
    if (m && m.profilok) Object.keys(m.profilok).forEach(function (k) { if (m.profilok[k] && m.profilok[k].jatekMp > 0) van = true; });
    return van;
  } catch (e) { return false; }
}
/* üres helyi mentés — a hang és a válaszmód gép-beállítás, az marad */
function uresMentes() { var u = alapMentes(); u.hang = mentes.hang; u.valaszmod = mentes.valaszmod; return u; }

/* a helyi mentés gazdája `uid` lesz: az eddigi gazda a hátizsákjába, az új a hátizsákjából (ha van).
   Gazda nélküli helyi mentést (régi, felhő előtti gép) csak akkor bántunk, ha az új gyereknek van hátizsákja —
   különben az első belépés felköltözteti (migráció, db.js). Visszaad: cserélt-e. */
function hatizsakCsere(uid) {
  var g = felhoGazda();
  if (!uid || g === uid) return false;
  var h = hatizsakOlvas(uid);
  if (!g && !h) return false;
  if (g) hatizsakBe(g);
  else if (helyiVanJatek()) felhoOfflineMasolat();
  var m = h ? h.mentes : uresMentes();
  m.hang = mentes.hang; m.valaszmod = mentes.valaszmod;
  felulirCacheTorol();
  try {
    localStorage.setItem(KULCS, JSON.stringify(m));
    localStorage.setItem(FELHO_GAZDA, uid);
    if (h && h.kuldetlen) localStorage.setItem(FELHO_KULDETLEN, uid); else localStorage.removeItem(FELHO_KULDETLEN);
    if (h && h.felulir) localStorage.setItem(FELULIR_KULCS, JSON.stringify(h.felulir));
    localStorage.removeItem(HATIZSAK_ELOTAG + uid);   /* áthelyezés: a hátizsák most a helyi mentés */
  } catch (e) { console.warn("[felhő] hátizsák-csere hiba:", e); }
  felulirCacheBetolt();
  betolt();
  return true;
}

/* ── net nélküli belépés ── */
function gepJatekos(kod) {
  var l = gepJatekosok();
  for (var i = l.length - 1; i >= 0; i--) if (l[i] && l[i].kod === kod) return l[i];
  return null;
}
/* net nélkül csak az léphet be, akinek a mentése a gépen van (ő a helyi mentés gazdája, vagy van hátizsákja) */
function felhoOfflineBelephet(j) { return !!(j && j.uid && (felhoGazda() === j.uid || hatizsakOlvas(j.uid))); }
function felhoOfflineBelep(j, kod) {
  hatizsakCsere(j.uid);
  FELHO.offline = { uid: j.uid, kod: j.kod, k: kod };
  try { sessionStorage.setItem(FELHO_OFFLINE_BELEPES, JSON.stringify(FELHO.offline)); } catch (e) {}
  esemeny("login", { device: felhoEszkoz(), offline: true });   /* a gép sorába — belépéskor eredeti időponttal felmegy */
  belepoRejt();
  felhoKepernyoFrissit();
  felhoCsendesBelep();
}
/* újratöltés után (ugyanabban a böngésző-munkamenetben) a net nélkül belépett gyerek bent marad */
function felhoOfflineVissza() {
  try {
    var o = JSON.parse(sessionStorage.getItem(FELHO_OFFLINE_BELEPES) || "null");
    if (o && o.uid && o.uid === felhoGazda()) { FELHO.offline = o; return true; }
    sessionStorage.removeItem(FELHO_OFFLINE_BELEPES);
  } catch (e) {}
  return false;
}
function felhoOfflineVege() {
  FELHO.offline = null;
  try { sessionStorage.removeItem(FELHO_OFFLINE_BELEPES); } catch (e) {}
}

/* ── csendes visszalépés a felhőbe ── */
var CSENDES = { fut: false, idozito: null, all: false };
function felhoCsendesBelep() {
  if (!CSENDES.idozito) {
    CSENDES.idozito = setInterval(felhoCsendesBelep, 30000);
    window.addEventListener("online", felhoCsendesBelep);
  }
  if (!FELHO.offline || FELHO.aktiv || CSENDES.fut || CSENDES.all) return;
  if (navigator.onLine === false) return;
  var akt = document.querySelector(".kepernyo.aktiv");
  if (!akt || !HATIZSAK_BIZTOS[akt.id]) return;   /* pálya közben nem — a következő térkép-látogatáskor */
  if (!FELHO.auth) { felhoSdkIndit(); return; }     /* az SDK net nélkül nem jött le → most; ha kész, újra ide jön */
  CSENDES.fut = true;
  kodBelep(FELHO.offline.k).then(function () { CSENDES.fut = false; }, function (e) {
    CSENDES.fut = false;
    var c = (e && e.code) || "";
    if (c !== "auth/network-request-failed" && c !== "auth/too-many-requests") {
      CSENDES.all = true;   /* a kód már nem jó (pl. törölt fiók) → nem próbálgatjuk; a haladás a gépen marad */
      console.warn("[felhő] csendes belépés nem sikerült:", c);
    }
  });
}

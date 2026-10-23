/* ============ 12b) FELHŐ — belépés kóddal ============
   A belépőkód egyben a jelszó: CSILLAG-42 → csillag-42@unikornis.app / CSILLAG-42.
   A fiókot a producer hozza létre a Firebase-konzolon (Authentication → Add user).
   EGY gyerek egy gépen: a böngésző megjegyzi a belépést — a gyerek csak egyszer írja be a kódot.
   KÖZÖS GÉP (ugyanazon a gépen már 2+ különböző kóddal léptek be — a gép magától ismeri fel, nincs kapcsoló):
     • a belépés csak a böngésző bezárásáig él (SESSION), utána újra a belépő jön;
     • a kilépés (a legelő kis kapuja) után a helyi mentés kiürül (a hang/válaszmód gép-beállítás marad).
   🦄 A BELÉPŐ A LEGELŐ (Belépő legelő 2. kör, legelo.js): üres tábla, a táblára koppintva a képen nyílik a mező; a gép
     gyerekeinek neve sehol nem látszik, mindenki beírja a belépőjét. Belépéskor csillámfelhő, kilépés a kis kapun.
   „most felhő nélkül játszom” csak olyan gépen van, ahol még senki nem lépett be kóddal.
   📴 NET NÉLKÜL (offline 3. kör, hatizsak.js): a névkártyás gyerek net nélkül is belép a kódjával; a mentése a
     hátizsákjából jön, és a háttérben felmegy, ha lesz net. Kilépéskor a mentés a hátizsákba kerül. */
function felhoIndit() {
  if (!felhoBekapcsolva()) return;
  FELHO.be = true;
  felulirCacheBetolt();   /* a producer-felülírások offline is élnek (az utolsó ismert állapot) */
  if (felhoOfflineVissza()) felhoCsendesBelep();   /* 📴 net nélkül belépett gyerek, újratöltés után: bent marad */
  else if (kozosGep()) belepoMutat();   /* közös gépen azonnal a belépő — amíg a felhő tölt, senki ne játsszon a másik nevében */
  felhoSdkIndit();
}
/* az SDK betöltése + a belépés figyelése; ha net nélkül nem jött le, a csendes visszalépés később újrahívja */
var FELHO_SDK_ALLAPOT = 0;   /* 0 = nincs, 1 = tölt, 2 = kész */
function felhoSdkIndit() {
  if (FELHO_SDK_ALLAPOT) return;
  FELHO_SDK_ALLAPOT = 1;
  sdkBetolt(["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"], function (ok) {
    if (!ok || !window.firebase) {
      FELHO_SDK_ALLAPOT = 0;
      console.warn("[felhő] az SDK nem töltődött be (nincs net?) — helyi mentéssel megyünk tovább");
      if (!gepJatekosok().some(felhoOfflineBelephet)) belepoHiba("Nincs internet. Próbáld újra később!");   /* 📴 névkártyás gyerek net nélkül is beléphet */
      return;
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      FELHO.auth = firebase.auth();
      FELHO.db = firebase.firestore();
      FELHO.db.enablePersistence({ synchronizeTabs: true }).catch(function (e) { FELHO.memoriaTar = true; console.warn("[felhő] offline tár nem elérhető:", e.code); });
      if (kozosGep()) belepesCsakMost();
    } catch (e) { console.warn("[felhő] indítási hiba:", e); return; }
    FELHO_SDK_ALLAPOT = 2;
    FELHO.auth.onAuthStateChanged(function (u) {
      if (u && FELHO.offline && FELHO.offline.uid !== u.uid) { FELHO.auth.signOut(); return; }   /* 📴 egy korábbi gyerek belépése maradt meg — a net nélkül belépett gyerek játszik */
      if (u) { felhoOfflineVege(); belepoRejt(); felhoBelepve(u); }
      else if (!FELHO.offline) belepoMutat();
    });
    if (FELHO.offline) felhoCsendesBelep();
  });
}
var SDK_BETOLTVE = {};   /* fájlnév → 1: újrapróbánál csak a hiányzók töltődnek (a kétszer betöltött SDK összeakadna) */
function sdkBetolt(fajlok, kesz) {
  var i = 0;
  (function kov() {
    if (i >= fajlok.length) { kesz(true); return; }
    var f = fajlok[i++];
    if (SDK_BETOLTVE[f]) { kov(); return; }
    var s = document.createElement("script");
    s.src = FIREBASE_SDK + f;
    s.onload = function () { SDK_BETOLTVE[f] = 1; kov(); };
    s.onerror = function () { s.remove(); kesz(false); };
    document.head.appendChild(s);
  })();
}
function kodNormal(kod) { return String(kod || "").trim().toUpperCase().replace(/\s+/g, "-"); }
function kodBelep(kod) {
  var k = kodNormal(kod);
  if (k.length < 6) return Promise.reject({ code: "rovid" });
  if (!FELHO.auth) return Promise.reject({ code: "auth/network-request-failed" });
  var elotte = kozosGep() ? FELHO.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION) : Promise.resolve();
  return elotte.then(function () { return FELHO.auth.signInWithEmailAndPassword(k.toLowerCase() + "@" + FELHO_EMAIL_DOMAIN, k); });
}
/* közös gépen a belépés a böngésző bezárásáig él (a már élő belépést is átteszi) */
function belepesCsakMost() {
  if (FELHO.auth) FELHO.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(function (e) { console.warn("[felhő] session-belépés hiba:", e.code || e); });
}
/* kilépés: a mentés a gyerek hátizsákjába kerül (📴 a még fel nem ment játékkal együtt), a helyi mentés kiürül —
   a következő gyerek ne a kilépő unikornisait lássa; a kilépő legközelebb (net nélkül is) a hátizsákjából folytatja */
function felhoKilep() {
  var uid = FELHO.aktiv ? FELHO.uid : FELHO.offline ? FELHO.offline.uid : felhoGazda(), online = FELHO.aktiv || !!(FELHO.auth && FELHO.auth.currentUser);   /* (🔒 a lakat Mégse-je a felhő előtt is jöhet) */
  gepJatekosJegyez();
  felhoKuld();
  FELHO.aktiv = false; FELHO.kesz = false;
  if (FELHO.leiratkozas) FELHO.leiratkozas();
  if (FELHO.userLeir) { FELHO.userLeir(); FELHO.userLeir = null; }
  LAKAT.nyitva = null; LAKAT.tudjuk = null; LAKAT.pultLe = null;
  felulirLeiratkozik(); fejtoroLeiratkozik();
  if (uid && felhoGazda() === uid) hatizsakBe(uid);
  felulirCacheTorol();
  try {
    localStorage.setItem(KULCS, JSON.stringify(uresMentes()));
    localStorage.removeItem(FELHO_GAZDA);       /* az üres mentés senkié — a következő belépő nem teheti a kilépő hátizsákjába */
    localStorage.removeItem(FELHO_KULDETLEN);   /* (az eltett felhő-alap gyerekenként marad: a hátizsákkal együtt kell) */
  } catch (e) {}
  felhoOfflineVege();
  if (online && FELHO.auth) { FELHO.auth.signOut().then(function () { location.reload(); }); return; }
  betolt(); belepoMutat();   /* 📴 net nélkül újratöltés nélkül (most lehet, hogy be sem töltene): üres tábla a legelőn */
}

/* ── a gép játékosai (névkártyákhoz) ── */
function gepJatekosok() {
  try { var l = JSON.parse(localStorage.getItem(FELHO_GEP_JATEKOSOK) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}
function kozosGep() { return gepJatekosok().length >= 2; }
/* belépés után / kilépéskor: a gyerek kódja + az aktív unikornisa kinézete (a névkártyára) */
function gepJatekosJegyez() {
  var kod = FELHO.kesz ? FELHO.kod : FELHO.offline && FELHO.offline.kod, uid = FELHO.kesz ? FELHO.uid : FELHO.offline && FELHO.offline.uid;
  if (!kod || !uid) return;
  var p = mentes.profilok[mentes.leny] || {};
  var l = gepJatekosok().filter(function (x) { return x && x.kod !== kod; });
  l.push({ kod: kod, uid: uid, leny: mentes.leny, oltozet: p.oltozet || null, kinezet: p.kinezet || null });   /* uid: 📴 a net nélküli belépéshez (hátizsák) */
  try { localStorage.setItem(FELHO_GEP_JATEKOSOK, JSON.stringify(l)); } catch (e) {}
  if (l.length >= 2) belepesCsakMost();
}
var JATEKOS_NEV = { DAVID: "Dávid", TIPAZ: "Tipáz" };   /* a kód ékezet nélküli — a névkártyán ékezettel */
function jatekosNev(kod) {
  var n = String(kod || "").split("-")[0];
  return JATEKOS_NEV[n] || (n.charAt(0) + n.slice(1).toLowerCase());
}

/* ── 🦄 belépés a legelőn (Belépő legelő 2. kör, legelo.js): senki nincs belépve → üres tábla; a táblára (vagy egy
   unikornisra) koppintva a képen nyílik a mező, ennek a tartalmával lép be a belepoProbal. Bármelyik kód beléphet. ── */
function belepoMutat() { legeloBelepo(); }
/* hiba(szoveg): nem sikerült (a tábla mondja el); siker esetén a felhő / 📴 a hátizsák viszi tovább (nyitoFrissit → csillámfelhő) */
function belepoProbal(szoveg, hiba) {
  var kod = kodNormal(szoveg), j = gepJatekos(kod);
  LAKAT.friss = true; LAKAT.nyitva = null;   /* 🔒 beírt kóddal lép be → ha van titkos kódja, a lakat kérdez (lakat.js) */
  var offline = felhoOfflineBelephet(j);   /* 📴 a gép ismeri ezt a gyereket → net nélkül is beléphet */
  if (offline && (!FELHO.auth || navigator.onLine === false)) { felhoOfflineBelep(j, kod); return; }
  kodBelep(kod).then(function (c) {
    /* ugyanaz a gyerek lépett be újra, aki már bent volt: a Firebase nem jelez változást (onAuthStateChanged nem fut) → magunk megyünk tovább */
    if (c && c.user && FELHO.kesz && c.user.uid === FELHO.uid) { belepoRejt(); nyitoFrissit(); }
  }).catch(function (e) {
    var c = (e && e.code) || "";
    if (c === "auth/network-request-failed" && offline) { felhoOfflineBelep(j, kod); return; }
    hiba(c === "auth/network-request-failed" ? "Nincs internet. Próbáld újra később!"
      : c === "auth/too-many-requests" ? "Túl sok próbálkozás. Várj egy kicsit!"
      : "Ezt nem ismerem. Nézd meg még egyszer!");
  });
}
function belepoHiba(szoveg) { if (NYITO.mod === "belepo" && LEGELO.mod === "belepo" && LEGELO.svg && LEGELO.svg.isConnected) { legeloMezoGomb(); legeloTablaSzol(szoveg, 5); } }
function belepoRejt() { legeloMezoRejt(); }

/* ============ 12b) FELHŐ — belépés kóddal ============
   A belépőkód egyben a jelszó: CSILLAG-42 → csillag-42@unikornis.app / CSILLAG-42.
   A fiókot a producer hozza létre a Firebase-konzolon (Authentication → Add user).
   EGY gyerek egy gépen: a böngésző megjegyzi a belépést — a gyerek csak egyszer írja be a kódot.
   KÖZÖS GÉP (ugyanazon a gépen már 2+ különböző kóddal léptek be — a gép magától ismeri fel, nincs kapcsoló):
     • a belépő a nyitókép: a gyerekek unikornisai alszanak (név a táblán), a felébresztett után a kódot be kell írni;
     • a belépés csak a böngésző bezárásáig él (SESSION), utána újra a belépő jön;
     • a 👋 Kilépek után a helyi mentés kiürül (a hang/válaszmód gép-beállítás marad).
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
  var uid = FELHO.aktiv ? FELHO.uid : FELHO.offline && FELHO.offline.uid, online = FELHO.aktiv;
  gepJatekosJegyez();
  felhoKuld();
  FELHO.aktiv = false; FELHO.kesz = false;
  if (FELHO.leiratkozas) FELHO.leiratkozas();
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
  NYITO.belepett = false;
  betolt(); belepoMutat();   /* 📴 net nélkül újratöltés nélkül (most lehet, hogy be sem töltene): a nyitókép alvó gyerekei */
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

/* ── belépő képernyő (rátét a nyitókép fölé) ──
   🚪 Újonc-bevezetés 2. kör: ahol a gépen már léptek be kóddal, a belépő maga a nyitókép (nyitokep.js): a gyerekek
   unikornisai alszanak a fűben, a gyerek a sajátját ébreszti fel, és UTÁNA kéri a kódot ez a kártya — belepoMutat(kod).
   belepoMutat(null) = „✏️ Másik gyerek” (kód névkártya nélkül; bármelyik kód beléphet, a névkártyáról is); belepoMutat() = a gép állapota dönt. */
function belepoMutat(kod) {
  if (kod === undefined && gepJatekosok().length) {
    if (NYITO.mod === "kozos" && $("kepernyo-nyito").classList.contains("aktiv")) return;   /* már ott alszanak (vagy épp a kódját írja valaki) */
    belepoRejt(); nyitoRajzol("kozos"); return;
  }
  var d = $("felho-belepo");
  if (!d) {
    d = el("div", "felho-belepo"); d.id = "felho-belepo";
    d.innerHTML =
      '<div class="felho-kartya">' +
        '<div class="felho-ikon">☁️🦄</div>' +
        '<h2 id="felho-cim">Belépés</h2>' +
        '<p id="felho-kerdes">Írd be a belépőkódodat!</p>' +
        '<input id="felho-kod" class="felho-mezo" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="pl. CSILLAG-42" />' +
        '<div id="felho-hiba" class="felho-hiba"></div>' +
        '<button id="felho-belep" class="nagy-gomb kiemelt">Belépek</button>' +
        '<button id="felho-kesobb" class="tovabb-link">most felhő nélkül játszom</button>' +
        '<button id="felho-vissza" class="tovabb-link">← Vissza</button>' +
      '</div>';
    document.body.appendChild(d);
    var mezo = $("felho-kod"), gomb = $("felho-belep"), hiba = $("felho-hiba");
    function probal() {
      hiba.textContent = "";
      var kod = kodNormal(mezo.value), j = gepJatekos(kod);   /* bármelyik kód beléphet, nem csak a felébresztett gyereké (a producer kérése, 2026-10-23) */
      var offline = felhoOfflineBelephet(j);   /* 📴 a gép ismeri ezt a gyereket → net nélkül is beléphet */
      NYITO.belepett = true;   /* most írta be a kódot: a nyitóképen nem kell még egyszer ébresztenie (nyitokep.js) */
      if (offline && (!FELHO.auth || navigator.onLine === false)) { felhoOfflineBelep(j, kod); return; }
      gomb.disabled = true; gomb.textContent = "Egy pillanat…";
      kodBelep(kod).then(function (c) {
        /* ugyanaz a gyerek lépett be újra, aki már bent volt: a Firebase nem jelez változást (onAuthStateChanged nem fut) → magunk megyünk tovább */
        if (c && c.user && FELHO.kesz && c.user.uid === FELHO.uid) { belepoRejt(); nyitoFrissit(); }
      }).catch(function (e) {
        var c = (e && e.code) || "";
        if (c === "auth/network-request-failed" && offline) { felhoOfflineBelep(j, kod); return; }
        NYITO.belepett = false;
        hiba.textContent = c === "auth/network-request-failed" ? "Nincs internet. Próbáld újra később!"
          : c === "auth/too-many-requests" ? "Túl sok próbálkozás. Várj egy kicsit!"
          : "Ez a kód nem jó. Nézd meg még egyszer!";
        gomb.disabled = false; gomb.textContent = "Belépek";
      });
    }
    gomb.addEventListener("click", probal);
    mezo.addEventListener("keydown", function (e) { if (e.key === "Enter") probal(); });
    $("felho-kesobb").addEventListener("click", belepoRejt);
    $("felho-vissza").addEventListener("click", function () { hangGomb(); belepoRejt(); nyitoKozosVissza(); });
  }
  var gb = $("felho-belep"); gb.disabled = false; gb.textContent = "Belépek";
  $("felho-kod").value = ""; $("felho-hiba").textContent = "";
  var van = gepJatekosok().length > 0;
  $("felho-cim").textContent = kod ? jatekosNev(kod) : (van ? "Ki vagy?" : "Belépés");
  $("felho-kerdes").textContent = kod ? NYITO_KOD_KER.replace("{n}", jatekosNev(kod)) : "Írd be a belépőkódodat!";
  $("felho-kesobb").hidden = van;   /* ahol már léptek be kóddal, a felhő nélküli játék csak elveszne (net nélkül a belépő meg sem jelenik) */
  $("felho-vissza").hidden = !van;  /* vissza a nyitóképre (a gyerekek újra alszanak) */
  d.hidden = false;
  setTimeout(function () { try { $("felho-kod").focus(); } catch (e) {} }, 50);
}
function belepoHiba(szoveg) { var h = $("felho-hiba"); if (h && !$("felho-belepo").hidden) h.textContent = szoveg; }
function belepoRejt() { var d = $("felho-belepo"); if (d) d.hidden = true; }


/* ============ 12c) FELHŐ — Firestore: betöltés, első feltöltés, élő figyelés ============
   users/{uid}                 — beállítások (hang, válaszmód, aktív lény)
   users/{uid}/unicorns/{leny} — egy-egy unikornis teljes profilja (a helyi mentes.profilok[leny] tükre)
   A helyi mentés (localStorage) továbbra is íródik — offline tartalék, és gyors indulás. */
function felhoUserRef() { return FELHO.db.collection("users").doc(FELHO.uid); }
function felhoLenyRef(k) { return felhoUserRef().collection("unicorns").doc(k); }
function felhoGazda() { try { return localStorage.getItem(FELHO_GAZDA); } catch (e) { return null; } }

function felhoBelepve(u) {
  hatizsakCsere(u.uid);   /* 📴 más volt a helyi mentés gazdája → az ő hátizsákjába; ennek a gyereknek a hátizsákja lesz a helyi mentés */
  FELHO.uid = u.uid;
  FELHO.kod = (u.email || "").split("@")[0].toUpperCase();
  FELHO.aktiv = true;
  FELHO.leiratkozas = felhoUserRef().collection("unicorns").onSnapshot({ includeMetadataChanges: false }, function (snap) {
    if (!FELHO.kesz) felhoElsoAllapot(snap);
    else felhoTavoliValtozas(snap);
  }, function (e) { console.warn("[felhő] figyelés hiba:", e.code || e); });
  felulirFigyel();   /* producer-felülírások + csoportok (4. fázis) */
  fejtoroFigyel();   /* Fejtörő-hegy: versenyfeladatok (csak belépve olvashatók) */
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") felhoKuld(); });
  window.addEventListener("pagehide", function () { gepJatekosJegyez(); felhoKuld(); });   /* a névkártyán a legutóbbi kinézet legyen */
  renderFelhoAllapot();
}

/* az első felhő-állapot: vagy a felhő adatai jönnek le, vagy (üres fióknál) a helyi mentés megy fel */
function felhoElsoAllapot(snap) {
  if (snap.empty && snap.metadata.fromCache) return;       /* még nem tudjuk, üres-e a szerveren — várjuk a szervert */
  var gazda = felhoGazda(), sajat = (gazda === FELHO.uid);
  if (!sajat) felhoBiztonsagiMasolat();   /* a helyi mentés mostantól nem a régi gazdáé (az ő mentése már a hátizsákjában, az eltett alapja vele marad — hatizsak.js) */
  var migralt = false, offline = null;
  if (snap.empty) {
    /* üres fiók: ha a helyi mentés még senkié → felköltözik (migráció); ha másé → új, üres kezdés */
    if (gazda && !sajat) mentes = alapMentes();
    else migralt = true;
    var batch = FELHO.db.batch();
    batch.set(felhoUserRef(), {
      settings: { hang: !!mentes.hang, valaszmod: mentes.valaszmod },
      activeUnicorn: mentes.leny,
      kod: FELHO.kod,                  /* a producer-pult ezen a néven mutatja a játékost */
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      migratedFrom: migralt ? "localStorage" : null
    }, { merge: true });
    LENY_SORREND.forEach(function (k) {
      var t = felhoTiszta(mentes.profilok[k]);
      batch.set(felhoLenyRef(k), t);
      FELHO.alap[k] = t;
    });
    batch.commit().catch(function (e) { console.warn("[felhő] első feltöltés hiba:", e.code || e); });
  } else {
    /* van felhő-adat: az az igazság (a Firestore gyorsítótára a még el nem küldött írásokat is tartalmazza) —
       📴 KIVÉVE, ha a helyi mentésben felhőbe nem jutott játék van: akkor a (helyi − eltett alap) különbség rámegy */
    var megvan = {}, eltett = sajat ? felhoEltettAlap(FELHO.uid) : null;
    var helyiElotte = sajat && felhoKuldetlen() === FELHO.uid ? mentes.profilok : null;
    if (helyiElotte) {
      offline = { mp: 0, profil: 0, gyanus: 0 };
      if (!eltett) felhoOfflineMasolat();    /* régi gép / első futás: nincs alap → a mai felülírás, de előtte másolat */
    }
    snap.forEach(function (d) {   /* (a helyi profilt a ráírás ELŐTT olvassuk ki: felhoOfflineRavezet → felhoTiszta = másolat) */
      var t = felhoTiszta(d.data()), uj = felhoMasol(t);
      FELHO.alap[d.id] = t;
      if (helyiElotte && eltett && helyiElotte[d.id] && eltett[d.id]) {
        var dMp = felhoOfflineRavezet(uj, eltett[d.id], helyiElotte[d.id]);
        if (dMp < 0) { offline.gyanus++; felhoOfflineMasolat(); }
        else if (!felhoEgyenlo(uj, t)) { offline.profil++; offline.mp += dMp; }
      }
      mentes.profilok[d.id] = profilNormal(uj, d.id);
      megvan[d.id] = 1;
    });
    LENY_SORREND.forEach(function (k) {     /* hiányzó lény (pl. új unikornis) → alapprofil, a következő küldés felteszi */
      if (megvan[k]) return;
      FELHO.alap[k] = {};
      if (helyiElotte && helyiElotte[k]) return;   /* 📴 net nélkül játszott vele → a helyi profil megy fel */
      mentes.profilok[k] = profilNormal(alapProfil(k), k);   /* a hiányzó ágak (bemutatva, visszahívás…) is meglegyenek */
    });
    felhoUserRef().set({ kod: FELHO.kod, lastSeen: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(function () {});
  }
  FELHO.alapUser = felhoUserAllapot();
  try { localStorage.setItem(FELHO_GAZDA, FELHO.uid); } catch (e) {}
  felhoAlapRogzit(FELHO.alap, true);         /* 📴 az eltett alap = a most látott felhő-állapot (a jelzőt a felhoKuld törli, ha minden felment) */
  FELHO.kesz = true;
  try { localStorage.setItem(KULCS, JSON.stringify(mentes)); } catch (e) {}
  esemeny("login", { device: felhoEszkoz(), migrated: migralt });
  var sor = esemenySorKuld();                /* 📴 net nélkül gyűlt események (eredeti időponttal) */
  if (offline && (offline.mp >= 30 || sor.palya || offline.gyanus))   /* a pult jele: „📴 net nélkül játszott" */
    esemeny("offline", { mp: offline.mp, palya: sor.palya, esemeny: sor.db, profil: offline.profil, gyanus: offline.gyanus, alap: eltett ? 1 : 0 });
  gepJatekosJegyez();                        /* névkártya + közös gép felismerése (2+ kód ezen a gépen) */
  felhoKuld();                               /* a normalizálás miatti apró eltérések + a net nélküli különbség felmennek */
  felhoKepernyoFrissit();
}

/* később érkező változás (másik gép, vagy a saját írásunk visszaigazolása) → 3-utas összefésülés */
function felhoTavoliValtozas(snap) {
  var volt = false;
  snap.docChanges().forEach(function (ch) {
    if (ch.type === "removed") return;       /* törlést a kliens sosem követ — adatvesztés ellen */
    var k = ch.doc.id, t = felhoTiszta(ch.doc.data());
    if (!mentes.profilok[k]) { mentes.profilok[k] = profilNormal(felhoMasol(t), k); FELHO.alap[k] = t; volt = true; return; }
    if (felhoOsszefesul(mentes.profilok[k], FELHO.alap[k] || {}, t, true)) volt = true;
    FELHO.alap[k] = t;
  });
  if (!FELHO.memoriaTar || FELHO.nyugtazott === FELHO.kuldSzam) felhoAlapRogzit(FELHO.alap, true);   /* 📴 az eltett alap kövesse a felhőt (a jelzőt csak a küldés törli) */
  if (volt) {
    try { localStorage.setItem(KULCS, JSON.stringify(mentes)); } catch (e) {}
    felhoKepernyoFrissit();
  }
}

function felhoBiztonsagiMasolat() {
  try {
    if (localStorage.getItem(FELHO_MENTES_ELOTTE)) return;   /* csak az első, eredeti állapotot őrizzük */
    var r = localStorage.getItem(KULCS);
    if (r) localStorage.setItem(FELHO_MENTES_ELOTTE, r);
  } catch (e) {}
}
function felhoEszkoz() {
  var ua = navigator.userAgent || "";
  return (/Android/.test(ua) ? "Android" : /iPad|iPhone/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "Mac" : "egyéb") +
    (/Edg\//.test(ua) ? " · Edge" : /Chrome\//.test(ua) ? " · Chrome" : /Firefox\//.test(ua) ? " · Firefox" : /Safari\//.test(ua) ? " · Safari" : "");
}

/* távoli változás után a látható számlálók/listák frissítése — játék közben a jelenetet nem bántjuk */
function felhoKepernyoFrissit() {
  var akt = document.querySelector(".kepernyo.aktiv"), id = akt ? akt.id : "";
  if (id === "kepernyo-profil") renderProfil();
  else if (id === "kepernyo-nyito") nyitoFrissit();   /* 🚪 a név, az unikornis — vagy az újoncnál az első perc (nyitokep.js) */
  else if (id === "kepernyo-fomenu") renderFomenu();
  var p = P(); if (!p) return;
  ["fomenu", "jatek", "odu", "kert", "utca", "szalon", "tk"].forEach(function (h) {
    var c = $(h + "-csillampor"); if (c) c.textContent = p.csillampor;
    var t = $(h + "-harmat"); if (t) t.textContent = p.tunderharmat || 0;
  });
  renderFelhoAllapot();
}

/* Szülőknek → Beállítások: felhő-állapot sor + kilépés */
function renderFelhoAllapot() {
  kilepGombFrissit();
  var blokk = document.querySelector(".szuloi-blokk.beallitasok"); if (!blokk) return;
  var s = $("felho-allapot");
  if (!s) { s = el("p", "felho-allapot"); s.id = "felho-allapot"; blokk.appendChild(s); }
  if (!FELHO.aktiv) { s.innerHTML = FELHO.offline ? "☁️ Felhő: <b>" + kiiras(FELHO.offline.kod) + "</b> — net nélkül; ha lesz net, a játék felmegy" : "☁️ Felhő: nincs belépve"; return; }
  s.innerHTML = "☁️ Felhő: belépve — <b>" + kiiras(FELHO.kod) + "</b>" + (FELHO.kesz ? "" : " (szinkron indul…)") +
    ' <button id="felho-kilep" class="kis-gomb">Kilépés</button>';
  $("felho-kilep").onclick = felhoKilep;
}

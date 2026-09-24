/* ============ 12c) FELHŐ — Firestore: betöltés, első feltöltés, élő figyelés ============
   users/{uid}                 — beállítások (hang, válaszmód, aktív lény)
   users/{uid}/unicorns/{leny} — egy-egy unikornis teljes profilja (a helyi mentes.profilok[leny] tükre)
   A helyi mentés (localStorage) továbbra is íródik — offline tartalék, és gyors indulás. */
function felhoUserRef() { return FELHO.db.collection("users").doc(FELHO.uid); }
function felhoLenyRef(k) { return felhoUserRef().collection("unicorns").doc(k); }
function felhoGazda() { try { return localStorage.getItem(FELHO_GAZDA); } catch (e) { return null; } }

function felhoBelepve(u) {
  FELHO.uid = u.uid;
  FELHO.kod = (u.email || "").split("@")[0].toUpperCase();
  FELHO.aktiv = true;
  FELHO.leiratkozas = felhoUserRef().collection("unicorns").onSnapshot({ includeMetadataChanges: false }, function (snap) {
    if (!FELHO.kesz) felhoElsoAllapot(snap);
    else felhoTavoliValtozas(snap);
  }, function (e) { console.warn("[felhő] figyelés hiba:", e.code || e); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") felhoKuld(); });
  window.addEventListener("pagehide", felhoKuld);
  renderFelhoAllapot();
}

/* az első felhő-állapot: vagy a felhő adatai jönnek le, vagy (üres fióknál) a helyi mentés megy fel */
function felhoElsoAllapot(snap) {
  if (snap.empty && snap.metadata.fromCache) return;       /* még nem tudjuk, üres-e a szerveren — várjuk a szervert */
  var gazda = felhoGazda(), sajat = (gazda === FELHO.uid);
  if (!sajat) felhoBiztonsagiMasolat();
  var migralt = false;
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
    /* van felhő-adat: az az igazság (a Firestore gyorsítótára a még el nem küldött írásokat is tartalmazza) */
    var megvan = {};
    snap.forEach(function (d) {
      var t = felhoTiszta(d.data());
      FELHO.alap[d.id] = t;
      mentes.profilok[d.id] = profilNormal(felhoMasol(t));
      megvan[d.id] = 1;
    });
    LENY_SORREND.forEach(function (k) {     /* hiányzó lény (pl. új unikornis) → alapprofil, a következő küldés felteszi */
      if (!megvan[k]) { mentes.profilok[k] = alapProfil(); FELHO.alap[k] = {}; }
    });
    felhoUserRef().set({ kod: FELHO.kod, lastSeen: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(function () {});
  }
  FELHO.alapUser = felhoUserAllapot();
  try { localStorage.setItem(FELHO_GAZDA, FELHO.uid); } catch (e) {}
  FELHO.kesz = true;
  try { localStorage.setItem(KULCS, JSON.stringify(mentes)); } catch (e) {}
  esemeny("login", { device: felhoEszkoz(), migrated: migralt });
  felhoKuld();                               /* a normalizálás miatti apró eltérések felmennek */
  felhoKepernyoFrissit();
}

/* később érkező változás (másik gép, vagy a saját írásunk visszaigazolása) → 3-utas összefésülés */
function felhoTavoliValtozas(snap) {
  var volt = false;
  snap.docChanges().forEach(function (ch) {
    if (ch.type === "removed") return;       /* törlést a kliens sosem követ — adatvesztés ellen */
    var k = ch.doc.id, t = felhoTiszta(ch.doc.data());
    if (!mentes.profilok[k]) { mentes.profilok[k] = profilNormal(felhoMasol(t)); FELHO.alap[k] = t; volt = true; return; }
    if (felhoOsszefesul(mentes.profilok[k], FELHO.alap[k] || {}, t, true)) volt = true;
    FELHO.alap[k] = t;
  });
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
  else if (id === "kepernyo-fomenu") renderFomenu();
  var p = P(); if (!p) return;
  ["fomenu", "jatek", "odu", "kert", "utca", "szalon"].forEach(function (h) {
    var c = $(h + "-csillampor"); if (c) c.textContent = p.csillampor;
    var t = $(h + "-harmat"); if (t) t.textContent = p.tunderharmat || 0;
  });
  renderFelhoAllapot();
}

/* Szülőknek → Beállítások: felhő-állapot sor + kilépés */
function renderFelhoAllapot() {
  var blokk = document.querySelector(".szuloi-blokk.beallitasok"); if (!blokk) return;
  var s = $("felho-allapot");
  if (!s) { s = el("p", "felho-allapot"); s.id = "felho-allapot"; blokk.appendChild(s); }
  if (!FELHO.aktiv) { s.innerHTML = "☁️ Felhő: nincs belépve"; return; }
  s.innerHTML = "☁️ Felhő: belépve — <b>" + kiiras(FELHO.kod) + "</b>" + (FELHO.kesz ? "" : " (szinkron indul…)") +
    ' <button id="felho-kilep" class="kis-gomb">Kilépés</button>';
  $("felho-kilep").onclick = felhoKilep;
}

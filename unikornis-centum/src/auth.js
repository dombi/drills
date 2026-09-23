/* ============ 12b) FELHŐ — belépés kóddal ============
   A belépőkód egyben a jelszó: CSILLAG-42 → csillag-42@unikornis.app / CSILLAG-42.
   A fiókot a producer hozza létre a Firebase-konzolon (Authentication → Add user).
   A böngésző megjegyzi a belépést — a gyerek csak egyszer írja be a kódot. */
function felhoIndit() {
  if (!felhoBekapcsolva()) return;
  sdkBetolt(["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"], function (ok) {
    if (!ok || !window.firebase) { console.warn("[felhő] az SDK nem töltődött be (nincs net?) — helyi mentéssel megyünk tovább"); return; }
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      FELHO.auth = firebase.auth();
      FELHO.db = firebase.firestore();
      FELHO.db.enablePersistence({ synchronizeTabs: true }).catch(function (e) { console.warn("[felhő] offline tár nem elérhető:", e.code); });
    } catch (e) { console.warn("[felhő] indítási hiba:", e); return; }
    FELHO.auth.onAuthStateChanged(function (u) {
      if (u) { belepoRejt(); felhoBelepve(u); }
      else belepoMutat();
    });
  });
}
function sdkBetolt(fajlok, kesz) {
  var i = 0;
  (function kov() {
    if (i >= fajlok.length) { kesz(true); return; }
    var s = document.createElement("script");
    s.src = FIREBASE_SDK + fajlok[i++];
    s.onload = kov;
    s.onerror = function () { kesz(false); };
    document.head.appendChild(s);
  })();
}
function kodNormal(kod) { return String(kod || "").trim().toUpperCase().replace(/\s+/g, "-"); }
function kodBelep(kod) {
  var k = kodNormal(kod);
  if (k.length < 6) return Promise.reject({ code: "rovid" });
  return FELHO.auth.signInWithEmailAndPassword(k.toLowerCase() + "@" + FELHO_EMAIL_DOMAIN, k);
}
function felhoKilep() {
  felhoKuld();
  FELHO.aktiv = false; FELHO.kesz = false;
  if (FELHO.leiratkozas) FELHO.leiratkozas();
  FELHO.auth.signOut().then(function () { location.reload(); });
}

/* ── belépő képernyő (rátét a profilválasztó fölé) ── */
function belepoMutat() {
  var d = $("felho-belepo");
  if (!d) {
    d = el("div", "felho-belepo"); d.id = "felho-belepo";
    d.innerHTML =
      '<div class="felho-kartya">' +
        '<div class="felho-ikon">☁️🦄</div>' +
        '<h2>Belépés</h2>' +
        '<p>Írd be a belépőkódodat!</p>' +
        '<input id="felho-kod" class="felho-mezo" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="pl. CSILLAG-42" />' +
        '<div id="felho-hiba" class="felho-hiba"></div>' +
        '<button id="felho-belep" class="nagy-gomb kiemelt">Belépek</button>' +
        '<button id="felho-kesobb" class="tovabb-link">most felhő nélkül játszom</button>' +
      '</div>';
    document.body.appendChild(d);
    var mezo = $("felho-kod"), gomb = $("felho-belep"), hiba = $("felho-hiba");
    function probal() {
      hiba.textContent = ""; gomb.disabled = true; gomb.textContent = "Egy pillanat…";
      kodBelep(mezo.value).catch(function (e) {
        var c = (e && e.code) || "";
        hiba.textContent = c === "auth/network-request-failed" ? "Nincs internet. Próbáld újra később!"
          : c === "auth/too-many-requests" ? "Túl sok próbálkozás. Várj egy kicsit!"
          : "Ez a kód nem jó. Nézd meg még egyszer!";
        gomb.disabled = false; gomb.textContent = "Belépek";
      });
    }
    gomb.addEventListener("click", probal);
    mezo.addEventListener("keydown", function (e) { if (e.key === "Enter") probal(); });
    $("felho-kesobb").addEventListener("click", belepoRejt);
  }
  d.hidden = false;
}
function belepoRejt() { var d = $("felho-belepo"); if (d) d.hidden = true; }

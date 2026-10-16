/* ============ 12b) FELHŐ — belépés kóddal ============
   A belépőkód egyben a jelszó: CSILLAG-42 → csillag-42@unikornis.app / CSILLAG-42.
   A fiókot a producer hozza létre a Firebase-konzolon (Authentication → Add user).
   EGY gyerek egy gépen: a böngésző megjegyzi a belépést — a gyerek csak egyszer írja be a kódot.
   KÖZÖS GÉP (ugyanazon a gépen már 2+ különböző kóddal léptek be — a gép magától ismeri fel, nincs kapcsoló):
     • a belépő névkártyákat mutat (név + a gyerek unikornisa), a kártya után a kódot be kell írni;
     • a belépés csak a böngésző bezárásáig él (SESSION), utána újra a belépő jön;
     • nincs „felhő nélkül” játék (különben a két gyerek haladása összekeveredne);
     • a 👋 Kilépek után a helyi mentés kiürül (a hang/válaszmód gép-beállítás marad). */
function felhoIndit() {
  if (!felhoBekapcsolva()) return;
  felulirCacheBetolt();   /* a producer-felülírások offline is élnek (az utolsó ismert állapot) */
  if (kozosGep()) belepoMutat();   /* közös gépen azonnal a belépő — amíg a felhő tölt, senki ne játsszon a másik nevében */
  sdkBetolt(["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"], function (ok) {
    if (!ok || !window.firebase) { console.warn("[felhő] az SDK nem töltődött be (nincs net?) — helyi mentéssel megyünk tovább"); belepoHiba("Nincs internet. Próbáld újra később!"); return; }
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      FELHO.auth = firebase.auth();
      FELHO.db = firebase.firestore();
      FELHO.db.enablePersistence({ synchronizeTabs: true }).catch(function (e) { console.warn("[felhő] offline tár nem elérhető:", e.code); });
      if (kozosGep()) belepesCsakMost();
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
  if (!FELHO.auth) return Promise.reject({ code: "auth/network-request-failed" });
  var elotte = kozosGep() ? FELHO.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION) : Promise.resolve();
  return elotte.then(function () { return FELHO.auth.signInWithEmailAndPassword(k.toLowerCase() + "@" + FELHO_EMAIL_DOMAIN, k); });
}
/* közös gépen a belépés a böngésző bezárásáig él (a már élő belépést is átteszi) */
function belepesCsakMost() {
  if (FELHO.auth) FELHO.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(function (e) { console.warn("[felhő] session-belépés hiba:", e.code || e); });
}
function felhoKilep() {
  gepJatekosJegyez();
  felhoKuld();
  var kozos = kozosGep();
  FELHO.aktiv = false; FELHO.kesz = false;
  if (FELHO.leiratkozas) FELHO.leiratkozas();
  felulirLeiratkozik(); felulirCacheTorol(); fejtoroLeiratkozik();
  if (kozos) {   /* a következő gyerek ne a kilépő unikornisait lássa a belépő mögött */
    var ures = alapMentes(); ures.hang = mentes.hang; ures.valaszmod = mentes.valaszmod;
    try { localStorage.setItem(KULCS, JSON.stringify(ures)); } catch (e) {}
  }
  FELHO.auth.signOut().then(function () { location.reload(); });
}

/* ── a gép játékosai (névkártyákhoz) ── */
function gepJatekosok() {
  try { var l = JSON.parse(localStorage.getItem(FELHO_GEP_JATEKOSOK) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}
function kozosGep() { return gepJatekosok().length >= 2; }
/* belépés után / kilépéskor: a gyerek kódja + az aktív unikornisa kinézete (a névkártyára) */
function gepJatekosJegyez() {
  if (!FELHO.kod || !FELHO.kesz) return;
  var p = mentes.profilok[mentes.leny] || {};
  var l = gepJatekosok().filter(function (x) { return x && x.kod !== FELHO.kod; });
  l.push({ kod: FELHO.kod, leny: mentes.leny, oltozet: p.oltozet || null, kinezet: p.kinezet || null });
  try { localStorage.setItem(FELHO_GEP_JATEKOSOK, JSON.stringify(l)); } catch (e) {}
  if (l.length >= 2) belepesCsakMost();
}
var JATEKOS_NEV = { DAVID: "Dávid", TIPAZ: "Tipáz" };   /* a kód ékezet nélküli — a névkártyán ékezettel */
function jatekosNev(kod) {
  var n = String(kod || "").split("-")[0];
  return JATEKOS_NEV[n] || (n.charAt(0) + n.slice(1).toLowerCase());
}

/* ── belépő képernyő (rátét a profilválasztó fölé) ── */
var BELEPO_VALASZTOTT = null;   /* a kiválasztott névkártya kódja (közös gépen) */
function belepoMutat() {
  var d = $("felho-belepo");
  if (!d) {
    d = el("div", "felho-belepo"); d.id = "felho-belepo";
    d.innerHTML =
      '<div class="felho-kartya">' +
        '<div class="felho-ikon">☁️🦄</div>' +
        '<h2 id="felho-cim">Belépés</h2>' +
        '<div id="felho-jatekosok" class="felho-jatekosok"></div>' +
        '<p id="felho-kerdes">Írd be a belépőkódodat!</p>' +
        '<input id="felho-kod" class="felho-mezo" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="pl. CSILLAG-42" />' +
        '<div id="felho-hiba" class="felho-hiba"></div>' +
        '<button id="felho-belep" class="nagy-gomb kiemelt">Belépek</button>' +
        '<button id="felho-kesobb" class="tovabb-link">most felhő nélkül játszom</button>' +
      '</div>';
    document.body.appendChild(d);
    var mezo = $("felho-kod"), gomb = $("felho-belep"), hiba = $("felho-hiba");
    function probal() {
      hiba.textContent = "";
      if (BELEPO_VALASZTOTT && kodNormal(mezo.value) !== BELEPO_VALASZTOTT) {
        hiba.textContent = "Ez nem " + jatekosNev(BELEPO_VALASZTOTT) + " kódja. Nézd meg még egyszer!";
        return;
      }
      gomb.disabled = true; gomb.textContent = "Egy pillanat…";
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
  BELEPO_VALASZTOTT = null;
  belepoJatekosok();
  $("felho-kesobb").hidden = kozosGep();
  d.hidden = false;
}
/* névkártyák: a gépen már belépett gyerekek (legutóbbi elöl) */
function belepoJatekosok() {
  var hely = $("felho-jatekosok"), l = gepJatekosok().slice().reverse();
  hely.innerHTML = "";
  $("felho-cim").textContent = l.length ? "Ki játszik most?" : "Belépés";
  $("felho-kerdes").textContent = l.length ? "Kattints a nevedre! Ha új vagy, írd be a kódodat!" : "Írd be a belépőkódodat!";
  hely.parentNode.classList.toggle("szeles", l.length > 0);
  l.forEach(function (j, i) {
    var c = LENYEK[j.leny] || LENYEK[LENY_SORREND[0]];
    var k = el("button", "felho-nevkartya");
    k.innerHTML = '<svg viewBox="-78 -132 156 150" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("fb" + i, c, 0.9, j.oltozet || null, j.kinezet || null) + '</svg>' +
      '<span class="nev">' + kiiras(jatekosNev(j.kod)) + '</span>';
    k.addEventListener("click", function () {
      hangGomb();
      BELEPO_VALASZTOTT = j.kod;
      Array.prototype.forEach.call(hely.children, function (x) { x.classList.toggle("valasztott", x === k); });
      $("felho-kerdes").textContent = "Szia, " + jatekosNev(j.kod) + "! Írd be a kódodat!";
      $("felho-hiba").textContent = "";
      var m = $("felho-kod"); m.value = ""; m.focus();
    });
    hely.appendChild(k);
  });
}
function belepoHiba(szoveg) { var h = $("felho-hiba"); if (h && !$("felho-belepo").hidden) h.textContent = szoveg; }
function belepoRejt() { var d = $("felho-belepo"); if (d) d.hidden = true; }

/* 👋 Kilépek — a profilválasztó bal alsó sarkában, ha be van lépve (főleg közös gépre) */
function kilepGombFrissit() {
  var hely = $("kepernyo-profil"); if (!hely) return;
  var g = $("profil-kilep");
  if (!g) {
    g = el("button", "szuloi-gomb sarok-bal"); g.id = "profil-kilep";
    g.addEventListener("click", function () { hangGomb(); felhoKilep(); });
    hely.appendChild(g);
  }
  g.hidden = !FELHO.aktiv;
  if (FELHO.aktiv) g.textContent = "👋 " + jatekosNev(FELHO.kod) + ", kilépek";
}

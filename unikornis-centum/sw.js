/* Unicornis Centum — service worker (📴 Offline játék, 2. kör: „net nélkül is induljon")
   Terv: terv/offline-jatek-rendszerterv.html. A regisztráció és a ?friss vészfék az index.html fejében van.
   • A játék saját fájljai (az oldal, game.js, style.css, kert-hangok.js, tk-diszek.js): HÁLÓZAT ELŐSZÖR —
     nettel mindig a legfrissebb jön (és a tárba is bekerül), net nélkül a tárolt példány.
     A ?v= miatt egy fájlnak mindig csak a legutóbbi változata marad a tárban.
   • A Firebase SDK (rögzített 10.14.1) és a Fredoka betű: TÁR ELŐSZÖR (ezek nem változnak).
   • ?friss (vészfék): a worker onnantól semmit nem tesz el és nem szolgál ki; az index.html üríti a tárat és leiratkoztat.
   • Telepítéskor előre letöltünk mindent, hogy már az első netes indítás után net nélkül is menjen.
   • Érintetlenül átmegy: az admin/ (producer-pult), a helyreallitas.html, és minden felhő-forgalom
     (Firestore, belépés, Égi Tüneménykert) — ezekhez a worker hozzá sem nyúl. */
var JATEK = "uc-jatek-1", KULSO = "uc-kulso-1";
var HATOKOR = new URL("./", self.location).href;
var SDK = "https://www.gstatic.com/firebasejs/10.14.1/";
var SDK_FAJLOK = ["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js", "firebase-database-compat.js"];
var BETU = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
var ATMEGY = ["admin/", "helyreallitas.html", "sw.js"];
var LEALL = false;   /* ?friss vészfék jött: ez a worker már semmit nem tesz el (az oldal közben üríti a tárat és leiratkoztatja) */

function atmegy(u) { var ut = u.split(/[?#]/)[0]; return ATMEGY.some(function (a) { return ut.indexOf(HATOKOR + a) === 0; }); }
function sajat(u) { return u.indexOf(HATOKOR) === 0 && !atmegy(u); }
function kulso(u) { return u.indexOf(SDK) === 0 || BETU.test(u); }
/* az oldal kulcsa a tárban: kérdőjel nélkül (?felho, ?sw…), a mappa = index.html */
function oldalKulcs(u) { var ut = u.split(/[?#]/)[0]; return /\/$/.test(ut) ? ut + "index.html" : ut; }

/* saját fájl a tárba; ugyanannak a fájlnak a régebbi ?v= változatai kikerülnek */
function tarol(kulcs, valasz) {
  if (LEALL) return Promise.resolve();
  return caches.open(JATEK).then(function (c) {
    return c.put(kulcs, valasz).then(function () { return c.keys(); }).then(function (kulcsok) {
      var ut = kulcs.split("?")[0];
      return Promise.all(kulcsok.map(function (k) { return k.url !== kulcs && k.url.split("?")[0] === ut ? c.delete(k) : null; }));
    });
  }).catch(function () {});   /* tele tár / privát ablak: a játék úgy fut, mint eddig */
}
/* külső (CDN) fájl: CORS-szal kérjük, hogy ne „átlátszatlan" válasz kerüljön a tárba (az sokkal több helyet foglal) */
function kulsoKer(u) {
  return fetch(u, { mode: "cors", credentials: "omit" }).catch(function () { return fetch(u, { mode: "no-cors" }); });
}

/* ── telepítés: előre letöltés (egy hiba nem állítja meg a többit) ── */
function eloreLetolt() {
  return self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then(function (lapok) {
    var oldalak = {}; oldalak[HATOKOR + "index.html"] = 1;
    lapok.forEach(function (l) { if (sajat(l.url)) oldalak[oldalKulcs(l.url)] = 1; });
    return Promise.all(Object.keys(oldalak).map(function (u) {
      return fetch(u, { cache: "no-cache" }).then(function (v) {
        if (!v.ok) return "";
        tarol(u, v.clone());
        return v.text();
      }).catch(function () { return ""; });
    }));
  }).then(function (htmlek) {
    var sajatok = {}, kulsok = {};
    SDK_FAJLOK.forEach(function (f) { kulsok[SDK + f] = 1; });
    htmlek.join("\n").replace(/(?:src|href)="([^"#]+)"/g, function (m, h) {
      var u = new URL(h, HATOKOR).href;
      if (sajat(u) && /\.(js|css)(\?|$)/.test(u)) sajatok[u] = 1;
      else if (BETU.test(u) && /\/css2?\?/.test(u)) kulsok[u] = 1;
      return m;
    });
    var egy = Object.keys(sajatok).map(function (u) {
      return fetch(u).then(function (v) { if (v.ok) return tarol(u, v); }).catch(function () {});
    });
    var masik = caches.open(KULSO).then(function (c) {
      return Promise.all(Object.keys(kulsok).map(function (u) {
        return c.match(u).then(function (m) {
          if (m) return m.clone().text().catch(function () { return ""; }).then(function (t) { return [u, t]; });
          return kulsoKer(u).then(function (v) {
            if (!v.ok && v.type !== "opaque") return [u, ""];
            var t = v.type === "opaque" ? Promise.resolve("") : v.clone().text();
            return c.put(u, v).then(function () { return t; }).then(function (s) { return [u, s]; });
          }).catch(function () { return [u, ""]; });
        });
      })).then(function (parok) {
        /* a betű-CSS-ben hivatkozott betűfájlok is kellenek */
        var betuk = [];
        parok.forEach(function (p) { if (BETU.test(p[0])) p[1].replace(/url\((https:[^)]+)\)/g, function (m, u) { betuk.push(u); return m; }); });
        return Promise.all(betuk.map(function (u) {
          return c.match(u).then(function (m) {
            if (m) return;
            return kulsoKer(u).then(function (v) { if (v.ok || v.type === "opaque") return c.put(u, v); }).catch(function () {});
          });
        }));
      });
    }).catch(function () {});
    return Promise.all(egy.concat([masik]));
  }).catch(function () {});
}

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(eloreLetolt());
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (nevek) {
    return Promise.all(nevek.map(function (n) { return /^uc-/.test(n) && n !== JATEK && n !== KULSO ? caches.delete(n) : null; }));
  }).then(function () { return self.clients.claim(); }));
});

/* ── kérések ── */
function oldal(e) {
  var kulcs = oldalKulcs(e.request.url);
  return fetch(e.request).then(function (v) {
    if (v.ok && v.type === "basic" && !v.redirected) e.waitUntil(tarol(kulcs, v.clone()));
    return v;
  }).catch(function () {
    return caches.open(JATEK).then(function (c) {
      return c.match(kulcs).then(function (m) { return m || c.match(HATOKOR + "index.html"); });
    }).then(function (m) { return m || Response.error(); });
  });
}
function halozatElobb(e) {
  var r = e.request;
  return fetch(r).then(function (v) {
    if (v.ok && v.type === "basic") e.waitUntil(tarol(r.url, v.clone()));
    return v;
  }).catch(function () {
    return caches.open(JATEK).then(function (c) {
      return c.match(r).then(function (m) { return m || c.match(r, { ignoreSearch: true }); });   /* más ?v= is jobb, mint a semmi */
    }).then(function (m) { return m || Response.error(); });
  });
}
function tarElobb(e) {
  var u = e.request.url;
  return caches.open(KULSO).then(function (c) {
    return c.match(u).then(function (m) {
      if (m) return m;
      return kulsoKer(u).then(function (v) {
        if (!LEALL && (v.ok || v.type === "opaque")) e.waitUntil(c.put(u, v.clone()).catch(function () {}));
        return v;
      });
    });
  }).catch(function () { return fetch(e.request); });
}

self.addEventListener("fetch", function (e) {
  var r = e.request, u = r.url;
  if (r.method !== "GET") return;
  if (kulso(u)) { e.respondWith(tarElobb(e)); return; }
  if (!sajat(u)) return;
  if (r.mode === "navigate" && /[?&]friss(=|&|$)/.test(u)) { LEALL = true; return; }   /* vészfék: egyenesen a hálózatról */
  if (LEALL) return;
  if (r.mode === "navigate") { e.respondWith(oldal(e)); return; }
  if (/\.(js|css)(\?|$)/.test(u)) e.respondWith(halozatElobb(e));
});

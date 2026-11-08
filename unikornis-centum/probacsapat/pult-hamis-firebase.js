/* PRÓBA: hamis Firebase a pulthoz — csak egy próba-másolat tölti be, az éles pult SOHA. Használat (Pult-mátrix 1. kör, 2026-11-08): másold admin/_hamis-firebase.js néven, készíts admin/_teszt_pult.html-t az admin/index.html-ből úgy, hogy a 4 gstatic firebase-script helyett ezt töltse be; http-szerverről nyisd (a pult fetch-csel olvassa a ../src fájlokat), a végén mindkettőt töröld. Memóriában tárol, semmit nem küld sehová; a teszt-írások: window.__HAMIS.irasok. */
(function () {
  var DEL = { __del: 1 }, TS = { __ts: 1 };
  function AU(l) { return { __au: l }; } function AR(l) { return { __ar: l }; }
  var docs = {}, figyelok = [];
  window.__HAMIS = { docs: docs, irasok: [] };
  function seed(p, d) { docs[p] = JSON.parse(JSON.stringify(d)); }
  seed("users/u-fanni", { kod: "FANNI-12" });
  seed("users/u-fanni/unicorns/ragyogas", { csillampor: 120, palyak: {} });
  seed("users/u-lili", { kod: "LILI-15" });
  seed("users/u-lili/unicorns/tuz", { csillampor: 300, palyak: {} });
  seed("groups/g-2b", { name: "2.b", members: ["u-fanni"], overrides: { "egy-szam": { tablak: [2, 5, 10] }, "holdfeny-bujocska": { enabled: false } } });
  seed("producerConfig/u-fanni", { overrides: { "oszkiv-10": { recommended: true, extraReward: 1.5 }, "oszkiv-20": { darab: 3, korlat: 2 } }, bank: { "csilla-harmat": { ar: 50, mod: "palya", palyak: ["oszkiv-10"] } } });
  function klon(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }
  function alkalmaz(cel, src, merge) {
    Object.keys(src).forEach(function (k) {
      var v = src[k];
      if (v === DEL) { delete cel[k]; return; }
      if (v === TS) { cel[k] = new Date().toISOString(); return; }
      if (v && v.__au) { var l = Array.isArray(cel[k]) ? cel[k] : []; v.__au.forEach(function (x) { if (l.indexOf(x) < 0) l.push(x); }); cel[k] = l; return; }
      if (v && v.__ar) { cel[k] = (cel[k] || []).filter(function (x) { return v.__ar.indexOf(x) < 0; }); return; }
      if (merge && v && typeof v === "object" && !Array.isArray(v)) { if (!cel[k] || typeof cel[k] !== "object" || Array.isArray(cel[k])) cel[k] = {}; alkalmaz(cel[k], v, true); return; }
      if (v && typeof v === "object" && !Array.isArray(v)) { cel[k] = {}; alkalmaz(cel[k], v, false); return; }
      cel[k] = klon(v);
    });
  }
  function snapDoc(p) { var id = p.split("/").pop(); return { id: id, exists: !!docs[p], data: function () { return klon(docs[p]); } }; }
  function gyujt(col) {
    var n = col.split("/").length, l = [];
    Object.keys(docs).forEach(function (p) { if (p.indexOf(col + "/") === 0 && p.split("/").length === n + 1) l.push(snapDoc(p)); });
    return { forEach: function (f) { l.forEach(f); }, size: l.length, docs: l };
  }
  function ertesit() { setTimeout(function () { figyelok.forEach(function (f) { f(); }); }, 0); }
  function docRef(p) {
    return {
      id: p.split("/").pop(),
      collection: function (c) { return colRef(p + "/" + c); },
      get: function () { return Promise.resolve(snapDoc(p)); },
      set: function (d, o) { window.__HAMIS.irasok.push({ p: p, d: d }); var merge = o && o.merge; if (!merge || !docs[p]) docs[p] = merge ? (docs[p] || {}) : {}; alkalmaz(docs[p], d, !!merge); ertesit(); return Promise.resolve(); },
      update: function (d) { if (!docs[p]) return Promise.reject({ code: "not-found" }); var x = {}; Object.keys(d).forEach(function (k) { var c = x, ut = k.split("."); ut.slice(0, -1).forEach(function (s) { c = c[s] = c[s] || {}; }); c[ut[ut.length - 1]] = d[k]; }); alkalmaz(docs[p], x, true); ertesit(); return Promise.resolve(); },
      delete: function () { delete docs[p]; ertesit(); return Promise.resolve(); },
      onSnapshot: function (f) { var g = function () { f(snapDoc(p)); }; figyelok.push(g); g(); return function () { figyelok.splice(figyelok.indexOf(g), 1); }; }
    };
  }
  var szamlalo = 0;
  function colRef(c) {
    var q = {
      doc: function (id) { return docRef(c + "/" + (id || "auto" + (++szamlalo))); },
      where: function () { return q; }, orderBy: function () { return q; }, limit: function () { return q; },
      get: function () { return Promise.resolve(gyujt(c)); },
      onSnapshot: function (f) { var g = function () { f(gyujt(c)); }; figyelok.push(g); g(); return function () { figyelok.splice(figyelok.indexOf(g), 1); }; }
    };
    return q;
  }
  var user = { email: "admin@unikornis.app (PRÓBA)", uid: "admin" };
  var fs = function () { return { collection: colRef }; };
  fs.FieldValue = { delete: function () { return DEL; }, serverTimestamp: function () { return TS; }, arrayUnion: function () { return AU([].slice.call(arguments)); }, arrayRemove: function () { return AR([].slice.call(arguments)); } };
  var rtRef = function () { var r = { child: function () { return r; }, on: function () {}, off: function () {}, once: function () { return Promise.resolve({ val: function () { return null; }, forEach: function () {} }); }, set: function () { return Promise.resolve(); }, update: function () { return Promise.resolve(); }, remove: function () { return Promise.resolve(); }, orderByChild: function () { return r; }, limitToLast: function () { return r; } }; return r; };
  window.firebase = {
    initializeApp: function () {
      return {
        auth: function () { return { onAuthStateChanged: function (f) { setTimeout(function () { f(user); }, 0); }, signOut: function () {}, signInWithEmailAndPassword: function () { return Promise.resolve(); } }; },
        firestore: fs, database: function () { return { ref: rtRef }; }
      };
    },
    firestore: fs
  };
})();

/* AmbitusNumerorum: Unicornis Centum — MVP-A. Vanilla JS, függőség nélkül, file:// alól fut. */
(function () {
"use strict";

/* ============ 1) ADATOK ============ */
var LENYEK = {
  ragyogas: {
    nev: "Ragyogás", test: "#ffffff",
    soreny: ["#ffd94a", "#ffb0d8", "#ffe58a"], farok: ["#ffd94a", "#ffb0d8", "#ffe58a"],
    szarv: "#ffd94a", szarvcsik: "#ffb0d8", szem: "#7a5a90", jel: "csillag", jelszin: "#ffd94a"
  },
  tuz: {
    nev: "Tűz", test: "#f6b48e",
    soreny: ["#ff3b1f", "#ff8a1f", "#ffd23b"], farok: ["#ff3b1f", "#ff8a1f", "#ffd23b"],
    szarv: "#ff6a2b", szarvcsik: "#ffd23b", szem: "#7a3a2a", jel: "lang", jelszin: "#ff5a2b"
  },
  csillamharmat: {
    nev: "Csillámharmat", test: "#cfe8fb",
    soreny: ["#1fa8e6", "#d84fd8", "#7fd0ff"], farok: ["#1fa8e6", "#d84fd8", "#7fd0ff"],
    szarv: "#2b6ad8", szarvcsik: "#7fd0ff", szem: "#2a5a8a", jel: "hopehely", jelszin: "#6a8fe0"
  }
};
var LENY_SORREND = ["ragyogas", "tuz", "csillamharmat"];

var PALYAK = [
  {
    id: "bontas-felmondas", nev: "Mondd el a bontásokat", ikon: "🌰",
    palcim: "Számbontás — hangosan, lentről fölfelé",
    alap: { tipus: "szambontas" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Két kavics", szam: 3 },
      { nev: "Öreg tölgy", szam: 4 },
      { nev: "Mohapárna", szam: 5 },
      { nev: "Csörgő patak", szam: 6 },
      { nev: "Kidőlt fenyő", szam_min: 5, szam_max: 7 },
      { nev: "Napos tisztás", szam_min: 6, szam_max: 8 },
      { nev: "Szürke szikla", szam_min: 7, szam_max: 9 },
      { nev: "Odú-küszöb", szam_min: 8, szam_max: 10, cel: true }
    ]
  },
  {
    id: "oszkiv-10", nev: "Összeadás-kivonás 10-ig", ikon: "➕",
    palcim: "Adj össze és vegyél el — átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 10, atlepes: "nincs" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Első lépés", darab: 5, a_min: 1, a_max: 4, b_min: 1, b_max: 4 },
      { nev: "Gombamező", darab: 5, a_min: 2, a_max: 6, b_min: 1, b_max: 4 },
      { nev: "Vissza egyet", tipus: "kivonas", darab: 5, a_min: 4, a_max: 10, b_min: 1, b_max: 4 },
      { nev: "Tízig érünk", darab: 6, a_min: 3, a_max: 8, b_min: 1, b_max: 5 },
      { nev: "Levélszőnyeg", tipus: "kivonas", darab: 6, a_min: 5, a_max: 10, b_min: 2, b_max: 6 },
      { nev: "Vegyes 1", darab: 4, a_min: 2, a_max: 7, b_min: 2, b_max: 6 },
      { nev: "Vegyes 2", tipus: "kivonas", darab: 4, a_min: 6, a_max: 10, b_min: 2, b_max: 7 },
      { nev: "Odú-küszöb", darab: 6, a_min: 4, a_max: 9, b_min: 1, b_max: 6, cel: true }
    ]
  },
  {
    id: "oszkiv-20", nev: "Összeadás-kivonás 20-ig", ikon: "➖",
    palcim: "Húszig — most jön a tízes átlépés",
    alap: { tipus: "osszeadas", eredmeny_max: 20 },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Húszig nyújtózunk", darab: 5, a_min: 5, a_max: 12, b_min: 3, b_max: 8, atlepes: "nincs" },
      { nev: "Elvétel húszból", tipus: "kivonas", darab: 5, a_min: 10, a_max: 20, b_min: 2, b_max: 8, atlepes: "nincs" },
      { nev: "Éppen tízig", darab: 5, a_min: 6, a_max: 9, b_min: 1, b_max: 4, atlepes: "lehet" },
      { nev: "Átlépő híd", darab: 6, a_min: 6, a_max: 9, b_min: 5, b_max: 9, atlepes: "kell" },
      { nev: "Vissza a tízen át", tipus: "kivonas", darab: 6, a_min: 11, a_max: 18, b_min: 3, b_max: 9, atlepes: "kell" },
      { nev: "Vegyes 1", darab: 5, a_min: 4, a_max: 15, b_min: 3, b_max: 8, atlepes: "lehet" },
      { nev: "Vegyes 2", tipus: "kivonas", darab: 5, a_min: 8, a_max: 20, b_min: 3, b_max: 9, atlepes: "lehet" },
      { nev: "Utolsó próba", darab: 6, a_min: 7, a_max: 9, b_min: 6, b_max: 9, atlepes: "kell" },
      { nev: "Odú-küszöb", tipus: "kivonas", darab: 6, a_min: 12, a_max: 20, b_min: 4, b_max: 9, atlepes: "lehet", cel: true }
    ]
  },
  { id: "tizesek", nev: "Tízesek ösvénye", ikon: "🔟", palcim: "Teljes tízesek 100-ig", hamarosan: true },
  { id: "aprok", nev: "Aprók a tízeshez", ikon: "🐜", palcim: "Kétjegyű ± egyjegyű", hamarosan: true },
  { id: "lepegeto", nev: "Tízes-lépegető", ikon: "🦶", palcim: "Kétjegyű ± kerek tízes", hamarosan: true },
  { id: "erdo-melye", nev: "Erdő mélye", ikon: "🌲", palcim: "Kétjegyű ± kétjegyű", hamarosan: true }
];

/* ============ 2) SEGÉDEK ============ */
function $(id) { return document.getElementById(id); }
function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function veletlen(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

var EGYES = ["nulla", "egy", "kettő", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"];
var TIZES = { 10: "tíz", 20: "húsz", 30: "harminc", 40: "negyven", 50: "ötven", 60: "hatvan", 70: "hetven", 80: "nyolcvan", 90: "kilencven" };
var TIZ_ELOTAG = { 10: "tizen", 20: "huszon", 30: "harminc", 40: "negyven", 50: "ötven", 60: "hatvan", 70: "hetven", 80: "nyolcvan", 90: "kilencven" };
function szo(n) {
  n = Math.round(n);
  if (n === 100) return "száz";
  if (n < 10) return EGYES[n];
  if (n === 10) return "tíz";
  var t = Math.floor(n / 10) * 10, e = n % 10;
  if (e === 0) return TIZES[t];
  return TIZ_ELOTAG[t] + EGYES[e];
}
var SZOTAR = (function () {
  var m = {}; for (var i = 0; i <= 100; i++) m[szo(i)] = i;
  m["ketto"] = 2; m["harom"] = 3; m["negy"] = 4; m["ot"] = 5; m["het"] = 7; m["ket"] = 2;
  return m;
})();
var TIZES_SZO = { "tiz": 10, "tíz": 10, "husz": 20, "húsz": 20, "harminc": 30, "negyven": 40, "otven": 50, "ötven": 50, "hatvan": 60, "hetven": 70, "nyolcvan": 80, "kilencven": 90 };
var EGYES_SZO = { "nulla": 0, "egy": 1, "ketto": 2, "kettő": 2, "ket": 2, "harom": 3, "három": 3, "negy": 4, "négy": 4, "ot": 5, "öt": 5, "hat": 6, "het": 7, "hét": 7, "nyolc": 8, "kilenc": 9 };
function tokenek(szoveg) { return String(szoveg).toLowerCase().replace(/[^a-zá-ű0-9\s]/gi, " ").split(/\s+/).filter(Boolean); }
function szamokKinyer(szoveg) {
  var tk = tokenek(szoveg), out = [], i;
  for (i = 0; i < tk.length; i++) {
    var w = tk[i];
    if (/^\d+$/.test(w)) { var v = parseInt(w, 10); if (v >= 0 && v <= 100) out.push(v); continue; }
    if (TIZES_SZO[w] != null) {
      var nx = tk[i + 1];
      if (nx && EGYES_SZO[nx] != null && EGYES_SZO[nx] > 0) { out.push(TIZES_SZO[w] + EGYES_SZO[nx]); i++; }
      else out.push(TIZES_SZO[w]);
      continue;
    }
    if (SZOTAR[w] != null) { out.push(SZOTAR[w]); continue; }
    if (EGYES_SZO[w] != null) out.push(EGYES_SZO[w]);
  }
  return out;
}
function elsoSzam(szoveg) { var a = szamokKinyer(szoveg); return a.length ? a[0] : null; }
function atlepesE(a, b, op) { if (op === "+") return (a % 10) + (b % 10) >= 10; return (a % 10) - (b % 10) < 0; }
function atlepesOK(a, b, op, mode) { if (!mode || mode === "lehet") return true; var e = atlepesE(a, b, op); return mode === "kell" ? e : !e; }

/* ============ 3) FELADATGENERÁTOR ============ */
function tippOsszeadas(a, b) {
  if (atlepesE(a, b, "+") && a % 10 !== 0) {
    var kell = 10 - (a % 10);
    if (b > kell) return "Told fel kerek tízesig: " + szo(a) + " meg " + szo(kell) + " az " + szo(a + kell) + ". Mennyi van még hátra?";
  }
  return "Előbb add össze a tízeseket, aztán az egyeseket.";
}
function tippKivonas(a, b) {
  if (atlepesE(a, b, "-") && a % 10 !== 0) {
    return "Előbb vegyél el " + szo(a % 10) + "-t: " + szo(a) + " mínusz " + szo(a % 10) + " az " + szo(a - (a % 10)) + ". Mennyi van még hátra?";
  }
  return "Előbb vedd el a tízeseket, aztán az egyeseket.";
}
var GEN = {
  osszeadas: function (cfg, kerultMar) {
    var emax = cfg.eredmeny_max || 100, a, b, kulcs, kor = 0;
    do {
      a = veletlen(cfg.a_min, cfg.a_max); b = veletlen(cfg.b_min, cfg.b_max);
      kulcs = Math.min(a, b) + "|" + Math.max(a, b); kor++;
    } while (kor < 500 && (a + b > emax || !atlepesOK(a, b, "+", cfg.atlepes) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return { csalad: "egyenkent", keplet: a + " + " + b, szoveg: a + " + " + b + " = ?",
      kartyaHTML: '<span class="k-nagy">' + a + ' + ' + b + ' = <b>?</b></span>',
      felolvas: "Mennyi " + szo(a) + " meg " + szo(b) + "?", helyes: a + b, tipp: tippOsszeadas(a, b),
      naplo: { tipus: "osszeadas", kerdes: a + " + " + b, helyes: a + b, atlepes: atlepesE(a, b, "+") } };
  },
  kivonas: function (cfg, kerultMar) {
    var a, b, kulcs, kor = 0;
    do {
      a = veletlen(cfg.a_min, cfg.a_max); b = veletlen(cfg.b_min, Math.min(cfg.b_max, a));
      kulcs = a + "|" + b; kor++;
    } while (kor < 500 && (b > a || !atlepesOK(a, b, "-", cfg.atlepes) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return { csalad: "egyenkent", keplet: a + " − " + b, szoveg: a + " − " + b + " = ?",
      kartyaHTML: '<span class="k-nagy">' + a + ' − ' + b + ' = <b>?</b></span>',
      felolvas: szo(a) + " mínusz " + szo(b) + ". Mennyi?", helyes: a - b, tipp: tippKivonas(a, b),
      naplo: { tipus: "kivonas", kerdes: a + " − " + b, helyes: a - b, atlepes: atlepesE(a, b, "-") } };
  },
  szambontas: function (cfg) {
    var N = (cfg.szam != null) ? cfg.szam : veletlen(cfg.szam_min || 4, cfg.szam_max || 8);
    var lapos = []; for (var i = 0; i <= N; i++) { lapos.push(i); lapos.push(N - i); }
    return { csalad: "felmondas", N: N, szoveg: "Mondd el a(z) " + N + " összes bontását!",
      kartyaHTML: 'Mondd el a <span class="szam-jelveny">' + N + '</span> összes bontását!',
      felolvas: "Mondd el " + szo(N) + " összes bontását. Kezdd lentről: nulla meg " + szo(N) + ", egy meg " + szo(N - 1) + ", és így tovább.",
      lapos: lapos, tipp: "Kezdd lentről: nulla meg " + szo(N) + ". Aztán egy meg " + szo(N - 1) + ". Folytasd!",
      naplo: { tipus: "szambontas", kerdes: N + " bontása", helyes: N, atlepes: false } };
  }
};

/* ============ 4) MENTÉS ============ */
var KULCS = "unikornis_centum_v1";
var mentes;
function alapProfil() { return { csillampor: 0, becenev: "", palyak: {}, naplo: [], jatekMp: 0 }; }
function alapMentes() { var pr = {}; LENY_SORREND.forEach(function (k) { pr[k] = alapProfil(); }); return { verzio: 1, leny: "ragyogas", hang: true, valaszmod: "beszed", profilok: pr }; }
function ment() { try { localStorage.setItem(KULCS, JSON.stringify(mentes)); } catch (e) {} }
function betolt() {
  try {
    var m = JSON.parse(localStorage.getItem(KULCS));
    if (m && m.profilok) {
      mentes = m;
      LENY_SORREND.forEach(function (k) {
        if (!mentes.profilok[k]) mentes.profilok[k] = alapProfil();
        var p = mentes.profilok[k];
        if (typeof p.csillampor !== "number") p.csillampor = 0;
        if (!p.palyak) p.palyak = {}; if (!p.naplo) p.naplo = [];
        if (typeof p.jatekMp !== "number") p.jatekMp = 0;
      });
      if (mentes.hang == null) mentes.hang = true;
      if (!mentes.valaszmod) mentes.valaszmod = "beszed";
      return;
    }
  } catch (e) {}
  mentes = alapMentes();
}
function P() { return mentes.profilok[mentes.leny]; }

/* ============ 5) HANG ============ */
var AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
function beep(freq, hossz, tipus, kesl, vol) {
  if (!mentes.hang) return;
  var c = ac(); if (!c) return;
  var o = c.createOscillator(), g = c.createGain();
  o.type = tipus || "sine"; o.frequency.value = freq;
  var t0 = c.currentTime + (kesl || 0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.22, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + hossz);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + hossz + 0.03);
}
function hangJo() { beep(660, 0.13, "sine", 0); beep(880, 0.13, "sine", 0.1); beep(1174, 0.2, "sine", 0.2); }
function hangCsilla() { beep(1600, 0.09, "triangle", 0, 0.16); beep(2100, 0.09, "triangle", 0.07, 0.12); }
function hangHiba() { beep(200, 0.14, "sine", 0, 0.14); }
function hangAllomas() { beep(523, 0.12, "triangle", 0); beep(659, 0.12, "triangle", 0.11); beep(784, 0.12, "triangle", 0.22); beep(1046, 0.26, "triangle", 0.33); }
function hangVege() { [523, 587, 659, 784, 880, 1046, 1318].forEach(function (f, i) { beep(f, 0.16, "triangle", i * 0.11, 0.18); }); }
function hangGomb() { beep(420, 0.05, "sine", 0, 0.06); }

var huHang = null;
function hangokBetolt() { try { var vs = speechSynthesis.getVoices(); huHang = vs.filter(function (v) { return /hu(-|_)?/i.test(v.lang); })[0] || null; } catch (e) {} }
if (window.speechSynthesis) { hangokBetolt(); speechSynthesis.onvoiceschanged = hangokBetolt; }
function mondd(szoveg, kesz) {
  bagolyAnimal(true);
  if (!window.speechSynthesis || !mentes.hang) { setTimeout(function () { bagolyAnimal(false); if (kesz) kesz(); }, 350); return; }
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(szoveg);
    u.lang = "hu-HU"; u.rate = 0.95; u.pitch = 1.0;
    if (huHang) u.voice = huHang;
    u.onend = function () { bagolyAnimal(false); if (kesz) kesz(); };
    u.onerror = function () { bagolyAnimal(false); if (kesz) kesz(); };
    speechSynthesis.speak(u);
  } catch (e) { bagolyAnimal(false); if (kesz) kesz(); }
}
function bagolyAnimal(be) { var b = document.querySelector(".bagoly-figura"); if (b) b.classList.toggle("beszel", be); }

var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var beszedTamogatott = !!SR;
var felismero = null;
function figyelj(siker, hiba) {
  if (!SR) { hiba && hiba("nincs"); return; }
  try { if (felismero) felismero.abort(); } catch (e) {}
  felismero = new SR();
  felismero.lang = "hu-HU"; felismero.interimResults = false; felismero.maxAlternatives = 3; felismero.continuous = false;
  var kaptunk = false;
  var ido = setTimeout(function () { try { felismero.stop(); } catch (e) {} }, 7000);
  felismero.onresult = function (ev) {
    kaptunk = true;
    var alt = []; for (var i = 0; i < ev.results[0].length; i++) alt.push(ev.results[0][i].transcript);
    siker(alt);
  };
  felismero.onerror = function (ev) { clearTimeout(ido); hiba && hiba(ev.error === "no-speech" ? "nincs-hang" : ev.error); };
  felismero.onend = function () { clearTimeout(ido); if (!kaptunk) hiba && hiba("nincs-hang"); };
  try { felismero.start(); } catch (e) { hiba && hiba("start"); }
}
function figyelStop() { try { if (felismero) felismero.stop(); } catch (e) {} }

/* ============ 6) SVG ============ */
var KOR = "#3a2f2a"; // körvonal
function ecset(x0, y0, x1, y1, szinek, w, db, ivx) {
  var s = "";
  for (var i = 0; i < db; i++) {
    var t = db > 1 ? i / (db - 1) : 0.5;
    var sx = x0 + (t - 0.5) * 12, sy = y0 + (t - 0.5) * 5;
    var ex = x1 + (t - 0.5) * 16, ey = y1 + (t - 0.5) * 12;
    var mx = (sx + ex) / 2 + (i % 2 ? ivx : -ivx * 0.7), my = (sy + ey) / 2 + 7;
    s += '<path d="M' + sx.toFixed(1) + ',' + sy.toFixed(1) + ' Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + ex.toFixed(1) + ',' + ey.toFixed(1) +
         '" fill="none" stroke="' + szinek[i % szinek.length] + '" stroke-width="' + w + '" stroke-linecap="round" opacity="0.92"/>';
  }
  return s;
}
function csillagSVG(x, y, r, fill) {
  var p = [];
  for (var i = 0; i < 10; i++) {
    var ang = Math.PI / 5 * i - Math.PI / 2;
    var rr = i % 2 ? r * 0.42 : r;
    p.push((x + Math.cos(ang) * rr).toFixed(1) + "," + (y + Math.sin(ang) * rr).toFixed(1));
  }
  return '<path d="M' + p.join(" L") + ' Z" fill="' + fill + '"/>';
}
function jelSVG(tipus, x, y, szin) {
  if (tipus === "lang")
    return '<path d="M' + x + ',' + (y + 7) + ' q-7,-11 0,-18 q3,7 6,4 q3,-5 0,-9 q11,9 6,22 q-4,7 -12,1 Z" fill="' + szin + '" opacity="0.9"/>';
  if (tipus === "hopehely")
    return '<g stroke="' + szin + '" stroke-width="2.4" stroke-linecap="round" opacity="0.9"><path d="M' + x + ',' + (y - 9) + ' v18 M' + (x - 8) + ',' + (y - 5) + ' l16,10 M' + (x + 8) + ',' + (y - 5) + ' l-16,10"/></g>';
  return csillagSVG(x, y, 8, szin);
}
function unikornisSVG(id, c, meret) {
  var s = meret || 1;
  return '<g id="' + id + '" transform="scale(' + s + ')">' +
    /* farok – hátul, lent */ ecset(-40, -50, -60, 20, c.farok, 8, 5, 12) +
    /* lábak */
    [-28, -11, 12, 30].map(function (x) {
      return '<rect x="' + (x - 6) + '" y="-18" width="12" height="24" rx="3" fill="' + c.test + '" stroke="' + KOR + '" stroke-width="2.4"/>';
    }).join("") +
    /* test */ '<ellipse cx="0" cy="-46" rx="44" ry="30" fill="' + c.test + '" stroke="' + KOR + '" stroke-width="2.6"/>' +
    /* jel */ jelSVG(c.jel, -4, -47, c.jelszin) +
    /* sörény a nyak hátán */ ecset(20, -76, 8, -22, c.soreny, 6, 5, 7) +
    /* fej */ '<ellipse cx="42" cy="-72" rx="22" ry="17" fill="' + c.test + '" stroke="' + KOR + '" stroke-width="2.6"/>' +
    /* fül */ '<path d="M31,-83 L40,-104 L49,-81 Z" fill="' + c.test + '" stroke="' + KOR + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    /* szarv */ '<path d="M44,-86 L52,-122 L60,-86 Z" fill="' + c.szarv + '" stroke="' + KOR + '" stroke-width="2"/>' +
    '<path d="M46,-95 l11,3 M47,-103 l9,3 M48,-111 l7,2" stroke="' + c.szarvcsik + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    /* homlokfürt */ ecset(41, -90, 34, -66, c.soreny, 5, 3, 5) +
    /* szem */ '<circle cx="50" cy="-73" r="3.4" fill="#fff" stroke="' + c.szem + '" stroke-width="2"/><circle cx="50" cy="-72.5" r="1.6" fill="' + c.szem + '"/>' +
    /* csillámok */ csillagSVG(36, -110, 5, c.soreny[0]) + csillagSVG(63, -103, 4, c.szarvcsik) + csillagSVG(29, -92, 3, "#fff2c4") +
  '</g>';
}
function sorenyGrad() { return ""; }
function bagolySVG() {
  return '<svg class="bagoly-figura" viewBox="-52 -60 104 126" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M-40,52 Q0,40 40,52" stroke="#6b5442" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<g class="bagoly-test">' +
      '<ellipse cx="0" cy="0" rx="34" ry="42" fill="#c9a8e6"/>' +
      '<ellipse cx="0" cy="8" rx="22" ry="30" fill="#e9ddf3"/>' +
      '<path d="M-34,-6 Q-46,10 -34,30 Q-30,10 -30,-6 Z" fill="#b48fd6"/>' +
      '<path d="M34,-6 Q46,10 34,30 Q30,10 30,-6 Z" fill="#b48fd6"/>' +
      '<path d="M-26,-40 l10,-14 l6,14 Z" fill="#c9a8e6"/>' +
      '<path d="M26,-40 l-10,-14 l-6,14 Z" fill="#c9a8e6"/>' +
      '<circle cx="-13" cy="-14" r="14" fill="#fdfdfd"/>' +
      '<circle cx="13" cy="-14" r="14" fill="#fdfdfd"/>' +
      '<circle class="bagoly-pupilla" cx="-11" cy="-12" r="6.5" fill="#4a3b7a"/>' +
      '<circle class="bagoly-pupilla" cx="11" cy="-12" r="6.5" fill="#4a3b7a"/>' +
      '<circle cx="-13" cy="-15" r="2" fill="#fff"/><circle cx="9" cy="-15" r="2" fill="#fff"/>' +
      '<path d="M-5,-2 L5,-2 L0,10 Z" fill="#ffcf6b"/>' +
      '<path d="M-30,44 l-6,10 M-22,46 l-2,10 M22,46 l2,10 M30,44 l6,10" stroke="#ffcf6b" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M18,-44 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2 Z" fill="#fff2c4"/>' +
    '</g>' +
  '</svg>';
}

var NEZ_SZ = 900, NEZ_MA = 460;
function allomasX(i) { return 150 + i * 260; }
function allomasY(i) { return 262 + 20 * Math.sin(i * 0.9); }
function jelenetSVG(palya, lenyKulcs) {
  var n = palya.allomasok.length;
  var szelesseg = allomasX(n - 1) + 260;
  var c = LENYEK[lenyKulcs];
  var utD = "M " + allomasX(0) + " " + (allomasY(0) + 4);
  for (var i = 1; i < n; i++) {
    var mx = (allomasX(i - 1) + allomasX(i)) / 2, my = (allomasY(i - 1) + allomasY(i)) / 2 + 30;
    utD += " Q " + mx + " " + my + " " + allomasX(i) + " " + (allomasY(i) + 4);
  }
  var fak = "";
  for (var f = 0; f < szelesseg; f += 200) {
    var fx = f + ((f / 200) % 2 ? 70 : 130), fy = 210 + ((f / 200) % 3) * 12;
    fak += '<g transform="translate(' + fx + ',' + fy + ')">' +
      '<rect x="-7" y="18" width="14" height="40" fill="#a9805e"/>' +
      '<circle cx="0" cy="0" r="34" fill="#8fca7e"/><circle cx="-22" cy="16" r="26" fill="#8fca7e"/><circle cx="22" cy="16" r="26" fill="#8fca7e"/>' +
      '<circle cx="-10" cy="-12" r="13" fill="#a8d998"/>' +
      '</g>';
  }
  var allomasok = "";
  for (var s = 0; s < n; s++) {
    var ax = allomasX(s), ay = allomasY(s);
    allomasok +=
      '<ellipse cx="' + ax + '" cy="' + (ay + 8) + '" rx="30" ry="14" fill="#cbb6e6" stroke="#b298da" stroke-width="2.5"/>' +
      '<rect x="' + (ax - 4) + '" y="' + (ay - 36) + '" width="8" height="42" fill="#b79c86"/>' +
      '<g transform="translate(' + ax + ',' + (ay - 46) + ')">' +
        '<rect x="-58" y="-16" width="116" height="32" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
        '<text x="0" y="5" font-size="14" font-family="sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[s].nev) + '</text>' +
      '</g>' +
      '<g class="allomas-pipa" id="pipa-' + s + '" transform="translate(' + ax + ',' + (ay - 2) + ')" opacity="0"><circle r="12" fill="#a7d99a"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  var celX = allomasX(n - 1) + 150, celY = allomasY(n - 1) + 6;
  var cel =
    '<g transform="translate(' + celX + ',' + celY + ')">' +
      '<ellipse cx="0" cy="36" rx="72" ry="18" fill="#2f4a3a" opacity="0.35"/>' +
      '<path d="M-48,42 C-48,-32 -30,-74 0,-82 C30,-74 48,-32 48,42 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
      '<ellipse cx="0" cy="-6" rx="25" ry="33" fill="#3a2a20"/>' +
      '<ellipse cx="0" cy="0" rx="18" ry="25" fill="#ffe9ad"/>' +
      '<ellipse cx="0" cy="8" rx="10" ry="14" fill="#fff6d8"/>' +
      csillagSVG(0, -92, 9, "#ffe08a") +
    '</g>';
  return '' +
  '<svg viewBox="0 0 ' + NEZ_SZ + ' ' + NEZ_MA + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="0" y="0" width="' + NEZ_SZ + '" height="' + NEZ_MA + '" fill="#d6e6f6"/>' +
    '<circle cx="' + (NEZ_SZ - 90) + '" cy="70" r="46" fill="#fdeeb6" opacity="0.5"/>' +
    '<g id="kamera">' +
      '<path d="M-100 284 Q ' + (szelesseg / 2) + ' 252 ' + (szelesseg + 100) + ' 284 L ' + (szelesseg + 100) + ' 460 L -100 460 Z" fill="#bfe0a6"/>' +
      '<path d="M-100 322 Q ' + (szelesseg / 2) + ' 294 ' + (szelesseg + 100) + ' 322 L ' + (szelesseg + 100) + ' 460 L -100 460 Z" fill="#a9d68f"/>' +
      fak +
      '<path d="' + utD + '" fill="none" stroke="#dcc79a" stroke-width="48" stroke-linecap="round"/>' +
      '<path d="' + utD + '" fill="none" stroke="#ead9b0" stroke-width="38" stroke-linecap="round"/>' +
      allomasok + cel +
      '<ellipse id="mosti-ko" cx="' + allomasX(0) + '" cy="' + (allomasY(0) + 8) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
      '<g id="unikornis-hely" transform="translate(' + allomasX(0) + ',' + allomasY(0) + ')">' + unikornisSVG("uni", c, 0.66) + '</g>' +
    '</g>' +
  '</svg>';
}
function kiiras(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

/* ============ 7) KÉPERNYŐK ============ */
function mutat(id) {
  var volt = document.querySelector(".kepernyo.aktiv");
  if (volt) volt.classList.remove("aktiv");
  $(id).classList.add("aktiv");
  if (id === "kepernyo-jatek") idomeroInd(); else idomeroAll();
}
function renderProfil() {
  var lista = $("profil-lista"); lista.innerHTML = "";
  LENY_SORREND.forEach(function (k) {
    var c = LENYEK[k], p = mentes.profilok[k];
    var keszDb = Object.keys(p.palyak).filter(function (x) { return p.palyak[x].kesz; }).length;
    var kart = el("div", "profil-kartya");
    kart.innerHTML =
      '<svg viewBox="-78 -132 156 150" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("p" + k, c, 0.9) + '</svg>' +
      '<div class="nev">' + (p.becenev ? kiiras(p.becenev) + " · " : "") + c.nev + '</div>' +
      '<div class="adat">✨ ' + p.csillampor + ' &nbsp;·&nbsp; 🌟 ' + keszDb + '/7</div>';
    kart.addEventListener("click", function () { hangGomb(); mentes.leny = k; ment(); renderFomenu(); mutat("kepernyo-fomenu"); });
    lista.appendChild(kart);
  });
}
function renderFomenu() {
  $("fomenu-csillampor").textContent = P().csillampor;
  var racs = $("palya-racs"); racs.innerHTML = "";
  PALYAK.forEach(function (pa) {
    var kesz = P().palyak[pa.id] && P().palyak[pa.id].kesz;
    var kart = el("div", "palya-kartya" + (pa.hamarosan ? " hamarosan" : "") + (kesz ? " kesz" : ""));
    kart.innerHTML =
      '<div class="allapot">' + (pa.hamarosan ? "🔜" : (kesz ? "🌟" : "")) + '</div>' +
      '<div class="ikon">' + pa.ikon + '</div>' +
      '<div class="pnev">' + kiiras(pa.nev) + '</div>' +
      '<div class="palcim">' + kiiras(pa.palcim) + '</div>';
    kart.addEventListener("click", function () {
      hangGomb();
      if (pa.hamarosan) { mondd("Ez az ösvény hamarosan nyílik meg!"); return; }
      palyaInditas(pa.id);
    });
    racs.appendChild(kart);
  });
  var ossz = 0, jo = 0;
  (P().naplo || []).forEach(function (r) { ossz++; if (r.elsore) jo++; });
  $("ma-statisztika").textContent = ossz ? ("Eddig " + ossz + " feladatot próbáltál, " + jo + " sikerült elsőre.") : "";
}

/* ============ 8) JÁTÉK-LOGIKA ============ */
var J = null;
var curX = allomasX(0), curY = allomasY(0);

function palyaInditas(id) {
  var pa = null;
  PALYAK.forEach(function (x) { if (x.id === id) pa = x; });
  if (!pa || pa.hamarosan) return;
  var allomasok = pa.allomasok.map(function (a) {
    var o = {}, k; for (k in (pa.alap || {})) o[k] = pa.alap[k];
    for (k in a) o[k] = a[k]; return o;
  });
  J = { palya: pa, allomasok: allomasok, allomasIdx: 0, feladat: null, feladatDb: 0, feladatKesz: 0,
        probak: 0, kerultKulcsok: {}, futoElsore: 0, futoOssz: 0, futoCsilla: 0, lepesSor: 0, beirt: "" };
  $("jatek-palyanev").textContent = pa.nev;
  $("jatek-csillampor").textContent = P().csillampor;
  $("szinpad").innerHTML = jelenetSVG(pa, mentes.leny);
  curX = allomasX(0); curY = allomasY(0);
  kameraAllit(0, true);
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  mutat("kepernyo-jatek");
  setTimeout(function () { mondd("Induljunk! Gyűjtsük össze a csillagszilánkokat.", function () { kovAllomas(); }); }, 400);
}
function kameraAllit(i, azonnal) {
  var kam = document.querySelector("#szinpad #kamera");
  if (!kam) return;
  var n = J.allomasok.length;
  var szelesseg = allomasX(n - 1) + 260;
  var cel = -(allomasX(i) - NEZ_SZ * 0.42);
  var minPan = -(szelesseg - NEZ_SZ + 40);
  if (cel < minPan) cel = minPan;
  if (cel > 40) cel = 40;
  if (J) J.kameraX = cel;
  kam.style.transition = azonnal ? "none" : "transform 1.1s ease";
  kam.style.transform = "translateX(" + cel + "px)";
}
function unikornisOda(i, dur, kesz) {
  var u = document.querySelector("#szinpad #unikornis-hely");
  var ko = document.getElementById("mosti-ko");
  if (!u) { if (kesz) kesz(); return; }
  var x0 = curX, y0 = curY, x1 = allomasX(i), y1 = allomasY(i);
  var t0 = performance.now();
  function lep(now) {
    var t = Math.min(1, (now - t0) / dur);
    var e = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    var x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(t * Math.PI * 4) * 5;
    u.setAttribute("transform", "translate(" + x + "," + y + ")");
    if (t < 1) requestAnimationFrame(lep);
    else {
      curX = x1; curY = y1;
      u.setAttribute("transform", "translate(" + x1 + "," + y1 + ")");
      if (ko) { ko.setAttribute("cx", x1); ko.setAttribute("cy", y1 + 8); }
      if (kesz) kesz();
    }
  }
  requestAnimationFrame(lep);
}
function kovAllomas() {
  J.allomasIdx++;
  var i = J.allomasIdx, a = J.allomasok[i];
  kameraAllit(i);
  unikornisOda(i, 1200, function () {
    J.probak = 0; J.feladatKesz = 0; J.kerultKulcsok = {};
    J.feladatDb = (a.tipus === "szambontas") ? 1 : (a.darab || 5);
    $("kerulo-gomb").style.display = "block";
    ujFeladat();
  });
}
function ujFeladat() {
  var a = J.allomasok[J.allomasIdx];
  J.probak = 0; J.lepesSor = 0;
  if (a.tipus === "szambontas") J.feladat = GEN.szambontas(a);
  else J.feladat = GEN[a.tipus](a, J.kerultKulcsok);
  var f = J.feladat;
  J.parokKesz = 0;
  $("bagoly-buborek").hidden = false;
  $("buborek-cim").hidden = true;
  $("buborek-feladat").hidden = false;
  $("buborek-feladat").innerHTML = f.kartyaHTML || kiiras(f.szoveg);
  $("felmond-lista").hidden = true; $("felmond-lista").innerHTML = "";
  $("felmond-megvan").hidden = true;
  $("hallgat-e").hidden = true; $("hallgat-f").hidden = true;
  $("bontas-kesz-gomb").hidden = true;
  $("valaszter").style.visibility = "visible";
  $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  if (f.csalad === "felmondas") {
    $("valasz-egyenkent").hidden = true;
    $("valasz-felmondas").hidden = false;
    $("bontas-lepes").hidden = true;
    $("szambillentyuzet").hidden = true;
    $("beiro-kijelzo").hidden = true;
    $("mondom-bontas-gomb").style.display = beszedTamogatott ? "" : "none";
    $("mondom-bontas-gomb").textContent = "🎤 Mondom a bontását";
    $("halld-ujra-f").style.display = beszedTamogatott ? "" : "none";
    if (!beszedTamogatott || mentes.valaszmod === "beiras") { mondd(f.felolvas, function () { bontasLepesNyit(); }); return; }
  } else {
    $("valasz-felmondas").hidden = true;
    $("valasz-egyenkent").hidden = false;
    renderPottyok(); beiroReset(); modBeallit();
  }
  mondd(f.felolvas);
}
/* bontás: átváltás a VÁLASZ (hallgatás) állapotra */
function frissitMegvan() {
  var N = J.feladat.N, ossz = N + 1, kesz = J.parokKesz, p = "";
  for (var i = 0; i < ossz; i++) p += '<i class="' + (i < kesz ? "zold" : "") + '"></i>';
  var szoveg = kesz > 0 ? ("eddig " + kesz + " / " + ossz + " pár jó volt") : (ossz + " pár – mondd el mind egyben");
  $("felmond-megvan").innerHTML = szoveg + " <span class=\"pontok\">" + p + "</span>";
}
function bagolyMondat(txt) {
  var b = $("bagoly-mondat");
  b.textContent = txt; b.hidden = false;
  clearTimeout(bagolyMondat._t);
  bagolyMondat._t = setTimeout(function () { b.hidden = true; }, 2200);
}
function csillagRepul(honnanEl) {
  var cel = $("jatek-csillampor");
  if (!cel || !honnanEl) return;
  var r1 = honnanEl.getBoundingClientRect(), r2 = cel.getBoundingClientRect();
  var s = el("div", "repulo-csillag", "✨");
  s.style.left = (r1.left + r1.width / 2) + "px";
  s.style.top = (r1.top + 20) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(function () {
    s.style.left = (r2.left + r2.width / 2) + "px";
    s.style.top = (r2.top + r2.height / 2) + "px";
    s.style.transform = "scale(.4)"; s.style.opacity = "0.2";
  });
  setTimeout(function () { s.remove(); }, 950);
}
function renderPottyok() {
  var box = $("haladas-pottyok"); box.innerHTML = "";
  for (var i = 0; i < J.feladatDb; i++)
    box.appendChild(el("span", "potty" + (i < J.feladatKesz ? " kesz" : (i === J.feladatKesz ? " most" : ""))));
}
function renderFelmondLista(sor, lepesMod) {
  var N = J.feladat.N, box = $("felmond-lista"); box.innerHTML = "";
  for (var i = 0; i <= N; i++) {
    var aktiv = lepesMod && i === sor;
    var st = i < sor ? "kesz" : (aktiv ? "most" : "jovo");
    var jStil = aktiv ? ' style="opacity:.5"' : '';
    var sorEl = el("div", "felmond-sor " + st);
    sorEl.innerHTML = '<span class="dob">' + i + '</span><span>+</span><span class="dob"' + jStil + '>' + (N - i) + '</span><span class="pipa"></span>';
    box.appendChild(sorEl);
    if (aktiv && sor <= N) box.appendChild(el("div", "felmond-most-cim", "…ezt írd be"));
  }
}
function modBeallit() {
  var beiras = (mentes.valaszmod === "beiras") || !beszedTamogatott;
  $("mondom-gomb").style.display = (beszedTamogatott && !beiras) ? "" : "none";
  $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
  $("beiras-valt").textContent = beiras ? "🎤 Inkább mondom" : "⌨ Inkább beírom";
  $("szambillentyuzet").hidden = !beiras;
  $("beiro-kijelzo").hidden = !beiras;
  if (beiras) beiroReset();
}
function beiroReset() { J.beirt = ""; if ($("beiro-kijelzo")) $("beiro-kijelzo").textContent = ""; }
function billentyuzetEpit() {
  var box = $("szambillentyuzet"); box.innerHTML = "";
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(function (k) {
    var b = el("button", (k === "⌫" || k === "✓") ? "spec" : "", k);
    b.addEventListener("click", function () {
      hangGomb();
      if (k === "⌫") J.beirt = J.beirt.slice(0, -1);
      else if (k === "✓") { billentyuBekuld(); return; }
      else if (J.beirt.length < 3) J.beirt += k;
      $("beiro-kijelzo").textContent = J.beirt;
    });
    box.appendChild(b);
  });
}
function billentyuBekuld() {
  if (J.feladat.csalad === "felmondas") { bontasLepesBekuld(); return; }
  if (J.beirt === "") return;
  var v = parseInt(J.beirt, 10);
  J.beirt = ""; $("beiro-kijelzo").textContent = "";
  ertekel(v);
}
function ertekel(valasz) {
  var f = J.feladat;
  if (valasz === f.helyes) {
    naplozz(f.naplo, J.probak === 0, valasz);
    J.futoOssz++; if (J.probak === 0) J.futoElsore++;
    hangJo(); hangCsilla();
    var jar = 2;
    P().csillampor += jar; J.futoCsilla += jar;
    $("jatek-csillampor").textContent = P().csillampor;
    $("visszajelzes").className = "visszajelzes jo";
    $("visszajelzes").textContent = "Ez az! " + f.helyes + "  (+" + jar + " ✨)";
    csillagRepul($("bagoly-buborek")); J.feladatKesz++; ment();
    setTimeout(function () { if (J.feladatKesz >= J.feladatDb) allomasKesz(); else ujFeladat(); }, 900);
  } else {
    J.probak++;
    naplozz(f.naplo, false, valasz);
    hangHiba();
    $("visszajelzes").className = "visszajelzes rossz";
    if (J.probak === 1) { $("visszajelzes").textContent = "Nem " + valasz + ". Nézd meg még egyszer!"; mondd("Nem talált. Próbáld újra!"); }
    else { $("visszajelzes").textContent = "✘ " + f.keplet + " = " + f.helyes; mondd(f.tipp); }
    ment();
  }
}
function felmondErtekel(altList) {
  var N = J.feladat.N, elvart = J.feladat.lapos, legjobb = 0;
  altList.forEach(function (sz) {
    var nums = szamokKinyer(sz), egyezes = 0;
    for (var i = 0; i < elvart.length && i < nums.length; i++) { if (nums[i] === elvart[i]) egyezes++; else break; }
    if (egyezes > legjobb) legjobb = egyezes;
  });
  $("hallgat-f").hidden = true;

  // Az EGÉSZ felmondást egyszerre értékeljük.
  if (legjobb >= elvart.length) { felmondSiker(); return; }

  J.probak++;
  var jutott = Math.floor(legjobb / 2);      // hány pár volt jó a felmondás elejéről
  J.parokKesz = jutott;                       // csak visszajelzésnek, nem gyűlik
  $("felmond-lista").hidden = false; $("felmond-megvan").hidden = true;
  renderFelmondLista(jutott);
  naplozz(J.feladat.naplo, false, "hiányos felmondás");
  $("visszajelzes-f").className = "visszajelzes rossz";
  if (J.probak >= 2) {
    $("visszajelzes-f").textContent = "Nézzük lépésenként!";
    mondd("Nézzük lépésenként. " + J.feladat.tipp, function () { bontasLepesNyit(); });
  } else {
    hangHiba();
    $("visszajelzes-f").textContent = jutott > 0
      ? ("Eddig jó volt " + jutott + " pár. Mondd el újra az egészet, lentről kezdve!")
      : "Kezdd lentről: nulla meg " + N + ", egy meg " + (N - 1) + " …";
    mondd("Majdnem! Mondd el az egész bontást még egyszer, lentről kezdve.");
  }
  ment();
}
function felmondSiker() {
  naplozz(J.feladat.naplo, J.probak === 0, "helyes felmondás");
  J.futoOssz++; if (J.probak === 0) J.futoElsore++;
  hangJo(); hangCsilla();
  var jar = 5;
  P().csillampor += jar; J.futoCsilla += jar;
  $("hallgat-f").hidden = true; $("bontas-kesz-gomb").hidden = true;
  J.parokKesz = J.feladat.N + 1;
  $("felmond-lista").hidden = false; $("felmond-megvan").hidden = true;
  renderFelmondLista(J.parokKesz);
  bagolyMondat("Szuper! Kész! 🌟");
  $("visszajelzes-f").className = "visszajelzes jo";
  $("visszajelzes-f").textContent = "Kész a bontás!  (+" + jar + " ✨)";
  csillagRepul($("bagoly-buborek"));
  setTimeout(function () { $("jatek-csillampor").textContent = P().csillampor; }, 500);
  J.feladatKesz++; ment();
  setTimeout(function () { allomasKesz(); }, 1400);
}
function bontasLepesNyit() {
  $("hallgat-f").hidden = true; $("bontas-kesz-gomb").hidden = true;
  $("mondom-bontas-gomb").style.display = "none";
  $("buborek-feladat").hidden = true;
  $("buborek-cim").hidden = false; $("buborek-cim").innerHTML = 'A <b>' + J.feladat.N + '</b> bontásai – lépésenként';
  $("felmond-lista").hidden = false; $("felmond-megvan").hidden = false;
  $("bontas-lepes").hidden = false;
  J.lepesSor = Math.max(J.lepesSor || 0, J.parokKesz || 0);
  J.beirt = "";
  bontasLepesMutat();
}
function bontasLepesMutat() {
  var N = J.feladat.N, i = J.lepesSor;
  J.parokKesz = i;
  renderFelmondLista(i, true);
  frissitMegvan();
  $("bontas-lepes").innerHTML = '<span class="dob">' + i + '</span><span>+</span><b>' + (J.beirt || "?") + '</b>';
  $("beiro-kijelzo").hidden = false;
  $("szambillentyuzet").hidden = false;
  $("beiro-kijelzo").textContent = J.beirt || "";
}
function bontasLepesBekuld() {
  var N = J.feladat.N, i = J.lepesSor;
  if (J.beirt === "") return;
  if (parseInt(J.beirt, 10) === N - i) {
    J.beirt = ""; $("beiro-kijelzo").textContent = "";
    J.lepesSor++; hangCsilla();
    if (J.lepesSor > N) { $("bontas-lepes").hidden = true; felmondSiker(); } else bontasLepesMutat();
  } else {
    hangHiba();
    $("visszajelzes-f").className = "visszajelzes rossz";
    $("visszajelzes-f").textContent = "✘ " + N + " = " + i + " + " + (N - i);
    J.beirt = ""; $("beiro-kijelzo").textContent = "";
  }
}
function allomasKesz() {
  var a = J.allomasok[J.allomasIdx];
  var pipa = $("pipa-" + J.allomasIdx); if (pipa) pipa.setAttribute("opacity", "1");
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  hangAllomas();
  P().csillampor += 3; J.futoCsilla += 3;
  $("jatek-csillampor").textContent = P().csillampor; ment();
  if (a.cel) { palyaVege(); return; }
  mondd("Ügyes! Mehetünk tovább.", function () { kovAllomas(); });
}
function keruloUt() {
  hangGomb();
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  var a = J.allomasok[J.allomasIdx];
  var pipa = $("pipa-" + J.allomasIdx);
  if (pipa) { var kr = pipa.querySelector("circle"); if (kr) kr.setAttribute("fill", "#cdbfe0"); pipa.setAttribute("opacity", "1"); }
  mondd("Menjünk a hosszú úton.");
  var u = document.querySelector("#szinpad #unikornis-hely");
  var x0 = curX, y0 = curY, t0 = performance.now(), TART = 15000;
  function lep(now) {
    var t = Math.min(1, (now - t0) / TART);
    var x = x0 + 120 * Math.sin(t * Math.PI * 2) * (1 - t) + 60 * t;
    var y = y0 + 70 * Math.sin(t * Math.PI) + Math.sin(t * 30) * 4;
    if (u) u.setAttribute("transform", "translate(" + x + "," + y + ")");
    if (t < 1) requestAnimationFrame(lep);
    else { curX = x0 + 60; curY = y0; if (a.cel) { palyaVege(); return; } kovAllomas(); }
  }
  requestAnimationFrame(lep);
}
function palyaVege() {
  var id = J.palya.id;
  if (!P().palyak[id]) P().palyak[id] = { kesz: false, rekordElsore: 0 };
  var pr = P().palyak[id];
  pr.kesz = true;
  var ujRekord = J.futoElsore > (pr.rekordElsore || 0);
  if (ujRekord) pr.rekordElsore = J.futoElsore;
  P().csillampor += 20; J.futoCsilla += 20;
  $("jatek-csillampor").textContent = P().csillampor;
  ment();
  $("vege-szoveg").innerHTML =
    "<b>" + J.futoOssz + "</b> feladatból <b>" + J.futoElsore + "</b> sikerült elsőre.<br>" +
    "Gyűjtöttél: <b>" + J.futoCsilla + " ✨</b> csillámport.<br>" +
    (ujRekord ? '<span style="color:#c86bb0;font-weight:800">✨ ÚJ SAJÁT REKORD! ✨</span><br>' : "") +
    "Megvan egy újabb <b>csillagszilánk</b> 🌟";
  var kov = kovetkezoJatszhato(id);
  $("vege-kovetkezo").style.display = kov ? "" : "none";
  $("vege-kovetkezo").onclick = function () { hangGomb(); if (kov) palyaInditas(kov); };
  konfettiSzor(); hangVege();
  mutat("kepernyo-vege");
  mondd("Megérkeztünk! " + J.futoOssz + " feladatot oldottál meg.");
}
function kovetkezoJatszhato(id) {
  var idx = -1;
  PALYAK.forEach(function (p, i) { if (p.id === id) idx = i; });
  for (var i = idx + 1; i < PALYAK.length; i++) if (!PALYAK[i].hamarosan) return PALYAK[i].id;
  return null;
}
function naplozz(alap, elsore, valasz) {
  P().naplo.push({ t: Date.now(), palya: J.palya.id, kerdes: alap.kerdes, valasz: String(valasz),
    helyes: alap.helyes, elsore: !!elsore, atlepes: !!alap.atlepes, tipus: alap.tipus });
  if (P().naplo.length > 80) P().naplo.shift();
}
var idomeroTimer = null;
function idomeroInd() { if (idomeroTimer) return; idomeroTimer = setInterval(function () { P().jatekMp += 1; }, 1000); }
function idomeroAll() { if (idomeroTimer) { clearInterval(idomeroTimer); idomeroTimer = null; ment(); } }
function csillaBuborek() {
  var b = el("div", null, "+✨");
  b.style.cssText = "position:absolute;left:50%;top:30%;font-size:30px;font-weight:800;color:#c86bb0;pointer-events:none;transition:all 1s ease;transform:translate(-50%,0);z-index:6";
  var jt = document.querySelector(".jatekter"); if (!jt) return;
  jt.appendChild(b);
  requestAnimationFrame(function () { b.style.top = "10%"; b.style.opacity = "0"; });
  setTimeout(function () { b.remove(); }, 1000);
}
function konfettiSzor() {
  var box = $("konfetti"); box.innerHTML = "";
  var szinek = ["#f6a5c0", "#a7d99a", "#9ec9f0", "#ffe08a", "#c3a5e0"];
  for (var i = 0; i < 46; i++) {
    var s = el("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = szinek[i % szinek.length];
    s.style.animationDuration = (2 + Math.random() * 2) + "s";
    s.style.animationDelay = (Math.random() * 0.6) + "s";
    box.appendChild(s);
  }
}

/* ============ 9) SZÜLŐI NÉZET ============ */
var szuloiFul = "ragyogas";
function renderSzuloi() {
  var fbox = $("szuloi-fulek"); fbox.innerHTML = "";
  LENY_SORREND.forEach(function (k) {
    var f = el("div", "szuloi-ful" + (k === szuloiFul ? " aktiv" : ""), LENYEK[k].nev);
    f.addEventListener("click", function () { szuloiFul = k; renderSzuloi(); });
    fbox.appendChild(f);
  });
  var p = mentes.profilok[szuloiFul];
  var keszDb = 0, jatszhato = 0;
  PALYAK.forEach(function (pa) { if (!pa.hamarosan) { jatszhato++; if (p.palyak[pa.id] && p.palyak[pa.id].kesz) keszDb++; } });
  var perc = Math.round(p.jatekMp / 60);
  var perPalya = "";
  PALYAK.forEach(function (pa) {
    if (pa.hamarosan) return;
    var sorok = p.naplo.filter(function (r) { return r.palya === pa.id; });
    var ossz = sorok.length, jo = sorok.filter(function (r) { return r.elsore; }).length;
    perPalya += "<tr><td>" + kiiras(pa.nev) + "</td><td>" + (ossz ? Math.round(jo / ossz * 100) + "%  (" + jo + "/" + ossz + ")" : "—") + "</td></tr>";
  });
  var atl = p.naplo.filter(function (r) { return r.atlepes; });
  var atlJo = atl.filter(function (r) { return r.elsore; }).length;
  var bont = p.naplo.filter(function (r) { return r.tipus === "szambontas"; });
  var bontJo = bont.filter(function (r) { return r.elsore; }).length;
  $("szuloi-osszegzes").innerHTML =
    "<h3>Összegzés — " + LENYEK[szuloiFul].nev + (p.becenev ? " (" + kiiras(p.becenev) + ")" : "") + "</h3><table>" +
    "<tr><td>Játékidő összesen</td><td>" + (perc >= 1 ? perc + " perc" : (p.jatekMp + " mp")) + "</td></tr>" +
    "<tr><td>Kész pályák</td><td>" + keszDb + " / " + jatszhato + " elérhető</td></tr>" +
    "<tr><td>Tízesátlépéses feladatok</td><td>" + (atl.length ? Math.round(atlJo / atl.length * 100) + "% elsőre (" + atlJo + "/" + atl.length + ")" : "még nincs adat") + "</td></tr>" +
    "<tr><td>Számbontás felmondás</td><td>" + (bont.length ? Math.round(bontJo / bont.length * 100) + "% elsőre (" + bontJo + "/" + bont.length + ")" : "még nincs adat") + "</td></tr>" +
    "</table><h3 style='margin-top:14px'>Pályánként (elsőre jó)</h3><table>" + (perPalya || "<tr><td>—</td></tr>") + "</table>";
  var hibak = p.naplo.filter(function (r) { return !r.elsore; }).slice(-20).reverse();
  var hs = hibak.map(function (r) { return "<tr><td>" + kiiras(r.kerdes) + "</td><td>" + kiiras(r.valasz) + "</td><td>" + r.helyes + "</td></tr>"; }).join("");
  $("szuloi-hibak").innerHTML = "<h3>Legutóbbi tévesztések</h3>" +
    (hs ? "<table><tr><th>Feladat</th><th>Amit mondott</th><th>Helyes</th></tr>" + hs + "</table>" : "<p>Még nincs tévesztés a naplóban.</p>");
  $("beall-hang").checked = !!mentes.hang;
  $("beall-valaszmod").value = mentes.valaszmod;
  $("beall-becenev").value = p.becenev || "";
  $("beszed-tamogatas").textContent = beszedTamogatott
    ? "A beszédfelismerés ebben a böngészőben működik."
    : "Ebben a böngészőben a beszéd nem elérhető — a gyerek a számbillentyűzettel játszik. (Chrome ajánlott.)";
}

/* ============ 10) ESEMÉNYEK ============ */
function hosszuNyomas(gomb, kesz) {
  var t = null;
  function ind(e) { e.preventDefault(); gomb.classList.add("nyomva"); t = setTimeout(function () { gomb.classList.remove("nyomva"); kesz(); }, 2000); }
  function vege() { if (t) clearTimeout(t); t = null; gomb.classList.remove("nyomva"); }
  gomb.addEventListener("pointerdown", ind);
  gomb.addEventListener("pointerup", vege);
  gomb.addEventListener("pointerleave", vege);
  gomb.addEventListener("pointercancel", vege);
}
function mikrofonInd() {
  var felm = J.feladat.csalad === "felmondas";
  var g = felm ? $("mondom-bontas-gomb") : $("mondom-gomb");
  var hj = felm ? $("hallgat-f") : $("hallgat-e");
  if (felm) {
    J.parokKesz = 0;
    $("felmond-lista").hidden = true; $("felmond-lista").innerHTML = "";
    $("felmond-megvan").hidden = true;
    $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  }
  g.classList.add("figyel"); g.textContent = "🎤 Hallgatlak…";
  hj.hidden = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelj(function (alt) {
    g.classList.remove("figyel"); g.textContent = felm ? "🎤 Mondom a bontását" : "🎤 Mondom a megoldást";
    hj.hidden = true;
    if (felm) felmondErtekel(alt);
    else {
      var n = elsoSzam(alt.join(" "));
      if (n == null) { $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "Nem hallottam — mondd még egyszer!"; }
      else ertekel(n);
    }
  }, function (hiba) {
    g.classList.remove("figyel"); g.textContent = felm ? "🎤 Mondom a bontását" : "🎤 Mondom a megoldást";
    hj.hidden = true;
    var cel = felm ? "visszajelzes-f" : "visszajelzes";
    $(cel).className = "visszajelzes";
    if (hiba === "nincs" || hiba === "not-allowed" || hiba === "service-not-allowed") {
      beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
      $(cel).textContent = "Most beírással játszunk.";
      if (felm) bontasLepesNyit(); else modBeallit();
    } else { $(cel).textContent = "Nem hallottam — mondd még egyszer!"; }
  });
}
function belepSzuloi() { hangGomb(); szuloiFul = mentes.leny; renderSzuloi(); mutat("kepernyo-szuloi"); }
function tovabbMegoldasNelkul() {
  if (!J) return;
  hangGomb();
  if (J.feladat && J.feladat.csalad === "felmondas") { $("bontas-lepes").hidden = true; J.feladatKesz++; allomasKesz(); return; }
  J.feladatKesz++;
  if (J.feladatKesz >= J.feladatDb) allomasKesz(); else ujFeladat();
}
function esemenyek() {
  billentyuzetEpit();
  hosszuNyomas($("profil-szuloi"), belepSzuloi);
  hosszuNyomas($("fomenu-szuloi"), belepSzuloi);
  $("fomenu-vissza").addEventListener("click", function () { hangGomb(); renderProfil(); mutat("kepernyo-profil"); });
  $("jatek-haza").addEventListener("click", function () { hangGomb(); figyelStop(); try { speechSynthesis.cancel(); } catch (e) {} renderFomenu(); mutat("kepernyo-fomenu"); });
  $("mondom-gomb").addEventListener("click", mikrofonInd);
  $("mondom-bontas-gomb").addEventListener("click", mikrofonInd);
  $("halld-ujra").addEventListener("click", function () { if (J && J.feladat) mondd(J.feladat.felolvas); });
  $("halld-ujra-f").addEventListener("click", function () { if (J && J.feladat) mondd(J.feladat.felolvas); });
  $("beiras-valt").addEventListener("click", function () {
    hangGomb();
    mentes.valaszmod = (mentes.valaszmod === "beiras") ? "beszed" : "beiras";
    if (!beszedTamogatott) mentes.valaszmod = "beiras";
    ment(); modBeallit();
  });
  $("bontas-beiras").addEventListener("click", function () { hangGomb(); bontasLepesNyit(); });
  $("tovabb-megoldas-nelkul").addEventListener("click", tovabbMegoldasNelkul);
  $("tovabb-megoldas-nelkul-f").addEventListener("click", tovabbMegoldasNelkul);
  $("kerulo-gomb").addEventListener("click", keruloUt);
  $("vege-fomenu").addEventListener("click", function () { hangGomb(); renderFomenu(); mutat("kepernyo-fomenu"); });
  $("szuloi-vissza").addEventListener("click", function () { hangGomb(); renderProfil(); mutat("kepernyo-profil"); });
  $("beall-hang").addEventListener("change", function () { mentes.hang = $("beall-hang").checked; ment(); });
  $("beall-valaszmod").addEventListener("change", function () { mentes.valaszmod = $("beall-valaszmod").value; ment(); });
  $("beall-becenev").addEventListener("input", function () { mentes.profilok[szuloiFul].becenev = $("beall-becenev").value.trim(); ment(); });
  $("beall-naplo-torles").addEventListener("click", function () {
    if (confirm("Biztos törlöd " + LENYEK[szuloiFul].nev + " naplóját? A díszek megmaradnak.")) {
      mentes.profilok[szuloiFul].naplo = []; mentes.profilok[szuloiFul].jatekMp = 0; ment(); renderSzuloi();
    }
  });
}

/* ============ 11) INDÍTÁS ============ */
betolt();
document.querySelector(".jatekter").insertAdjacentHTML("beforeend", bagolySVG());
esemenyek();
renderProfil();
mutat("kepernyo-profil");
document.addEventListener("pointerdown", function egyszer() {
  var c = ac(); if (c && c.state === "suspended") c.resume();
  document.removeEventListener("pointerdown", egyszer);
});

/* fejlesztői teszt-fogantyú (éles használatot nem zavar) */
window.UC = {
  get J() { return J; }, get mentes() { return mentes; },
  ertekel: ertekel, felmondErtekel: felmondErtekel, palyaInditas: palyaInditas,
  GEN: GEN, szamokKinyer: szamokKinyer, szo: szo
};

})();

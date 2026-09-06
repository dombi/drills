/* AmbitusNumerorum: Unicornis Centum — MVP-A. Vanilla JS, függőség nélkül, file:// alól fut. */
(function () {
"use strict";

/* ============ 1) ADATOK ============ */
var LENYEK = {
  ragyogas: {
    nev: "Ragyogás", rajz: "rozsa", test: "#ffffff",
    soreny: ["#ffd94a", "#ffb0d8", "#ffe58a"], farok: ["#ffd94a", "#ffb0d8", "#ffe58a"],
    szarv: "#ffd94a", szarvcsik: "#ffb0d8", szem: "#7a5a90", jel: "csillag", jelszin: "#ffd94a"
  },
  tuz: {
    nev: "Tűz", rajz: "korall", test: "#f6b48e",
    soreny: ["#ff3b1f", "#ff8a1f", "#ffd23b"], farok: ["#ff3b1f", "#ff8a1f", "#ffd23b"],
    szarv: "#ff6a2b", szarvcsik: "#ffd23b", szem: "#7a3a2a", jel: "lang", jelszin: "#ff5a2b"
  },
  csillamharmat: {
    nev: "Csillámharmat", rajz: "kek", test: "#cfe8fb",
    soreny: ["#1fa8e6", "#d84fd8", "#7fd0ff"], farok: ["#1fa8e6", "#d84fd8", "#7fd0ff"],
    szarv: "#2b6ad8", szarvcsik: "#7fd0ff", szem: "#2a5a8a", jel: "hopehely", jelszin: "#6a8fe0"
  }
};
var LENY_SORREND = ["ragyogas", "tuz", "csillamharmat"];

var PALYAK = [
  {
    id: "bontas-felmondas", nev: "Mondd el a bontásokat", ikon: "🌰",
    palcim: "Számbontás — hangosan, lentről fölfelé, kézmentes hang!",
    alap: { tipus: "szambontas" },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Két kavics", szam_min: 1, szam_max: 6 },
      { nev: "Öreg tölgy", szam_min: 1, szam_max: 6 },
      { nev: "Mohapárna", szam_min: 1, szam_max: 6 },
      { nev: "Csörgő patak", szam: 6 },
      { nev: "Kidőlt fenyő", szam_min: 5, szam_max: 7 },
      { nev: "Napos tisztás", szam_min: 6, szam_max: 8 },
      { nev: "Szürke szikla", szam_min: 7, szam_max: 9 },
      { nev: "Odú-küszöb", szam_min: 8, szam_max: 10, cel: true }
    ]
  },
  {
    id: "oszkiv-10", nev: "Összeadás-kivonás 10-ig", ikon: "➕",
    palcim: "Adj össze és vegyél el — tízig, átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 10, atlepes: "nincs", a_min: 1, a_max: 9, b_min: 1, b_max: 9 },
    kez_nelkul: true,
    teljes_ut: true,   /* TESZT: kamera nélküli, egyképernyős térkép-nézet (2026-09-06) */
    allomasok: [
      { nev: "Rajt" },
      { nev: "Első lépés", darab: 5, a_min: 1, a_max: 4, b_min: 1, b_max: 4 },
      { nev: "Gombamező", tipus: "kivonas", darab: 5, a_min: 4, a_max: 8, b_min: 1, b_max: 4 },
      { nev: "Tízig érünk", darab: 5, a_min: 2, a_max: 7, b_min: 1, b_max: 5 },
      { nev: "Levélszőnyeg", tipus: "kivonas", darab: 6, a_min: 5, a_max: 10, b_min: 2, b_max: 6 },
      { nev: "Vegyes tisztás", darab: 6, a_min: 2, a_max: 8, b_min: 1, b_max: 7 },
      { nev: "Kerülő kanyar", tipus: "kivonas", darab: 5, a_min: 6, a_max: 10, b_min: 2, b_max: 7 },
      { nev: "Odú-küszöb", darab: 6, a_min: 3, a_max: 9, b_min: 1, b_max: 7, cel: true }
    ]
  },
  {
    id: "oszkiv-20", nev: "Összeadás-kivonás 20-ig", ikon: "➖",
    palcim: "Húszig — most jön a tízes átlépés",
    alap: { tipus: "osszeadas", eredmeny_max: 20, atlepes: "kell", a_min: 2, a_max: 9, b_min: 2, b_max: 9 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Átlépő híd", darab: 5 },
      { nev: "Vissza a tízen át", tipus: "kivonas", darab: 5, a_min: 11, a_max: 19 },
      { nev: "Föl a húszig", darab: 5 },
      { nev: "Kölcsönző elvétel", tipus: "kivonas", darab: 6, a_min: 11, a_max: 19 },
      { nev: "Még egy átlépés", darab: 6 },
      { nev: "Vegyes ráhangolás", darab: 5, atlepes: "lehet" },
      { nev: "Odú-küszöb", tipus: "kivonas", darab: 6, a_min: 11, a_max: 19, atlepes: "lehet", cel: true }
    ]
  },
  {
    id: "tizesek", nev: "Tízesek ösvénye", ikon: "🔟",
    palcim: "Csak kerek tízesek — százig",
    alap: { tipus: "osszeadas", eredmeny_max: 100, csak_tizes: true, atlepes: "lehet", a_min: 10, a_max: 90, b_min: 10, b_max: 60 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Tízes-kövek", darab: 5, a_min: 10, a_max: 40, b_min: 10, b_max: 30 },
      { nev: "Kerek tisztás", tipus: "kivonas", darab: 5, a_min: 20, a_max: 60, b_min: 10, b_max: 30 },
      { nev: "Följebb tízesével", darab: 5, a_min: 20, a_max: 60, b_min: 10, b_max: 40 },
      { nev: "Vissza a tízeken", tipus: "kivonas", darab: 6, a_min: 30, a_max: 80, b_min: 10, b_max: 50 },
      { nev: "Százig tízesével", darab: 6, a_min: 20, a_max: 80, b_min: 10, b_max: 50 },
      { nev: "Vegyes tízesek", darab: 5, a_min: 10, a_max: 90, b_min: 10, b_max: 60 },
      { nev: "Odú-küszöb", tipus: "kivonas", darab: 6, a_min: 30, a_max: 90, b_min: 10, b_max: 60, cel: true }
    ]
  },
  {
    id: "aprok", nev: "Aprók a tízeshez", ikon: "🐜",
    palcim: "Kétjegyű ± egyjegyű — átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 100, atlepes: "nincs", a_min: 11, a_max: 89, b_min: 1, b_max: 8 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Hangyaboly", darab: 5, a_min: 11, a_max: 29, b_min: 1, b_max: 6 },
      { nev: "Levélrakás", tipus: "kivonas", darab: 5, a_min: 15, a_max: 39, b_min: 1, b_max: 6 },
      { nev: "Morzsagyűjtés", darab: 5, a_min: 11, a_max: 55 },
      { nev: "Vissza a bolyba", tipus: "kivonas", darab: 6, a_min: 20, a_max: 69 },
      { nev: "Vegyes bolyongás", darab: 6, a_min: 11, a_max: 79 },
      { nev: "Utolsó szemek", tipus: "kivonas", darab: 5, a_min: 20, a_max: 89 },
      { nev: "Odú-küszöb", darab: 6, a_min: 11, a_max: 89, cel: true }
    ]
  },
  {
    id: "lepegeto", nev: "Tízes-lépegető", ikon: "🦶",
    palcim: "Kétjegyű ± kerek tízes — átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 100, b_tizes: true, atlepes: "nincs", a_min: 11, a_max: 79, b_min: 10, b_max: 60 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Kis lépések", darab: 5, a_min: 11, a_max: 39, b_min: 10, b_max: 30 },
      { nev: "Vissza felé", tipus: "kivonas", darab: 5, a_min: 31, a_max: 59, b_min: 10, b_max: 30 },
      { nev: "Nagyobb lépés", darab: 5, a_min: 15, a_max: 59, b_min: 10, b_max: 40 },
      { nev: "Lépés visszafelé", tipus: "kivonas", darab: 6, a_min: 41, a_max: 79, b_min: 10, b_max: 50 },
      { nev: "Messzebb lépünk", darab: 6, a_min: 20, a_max: 69, b_min: 10, b_max: 50 },
      { nev: "Vegyes lépések", darab: 5, a_min: 11, a_max: 69, b_min: 10, b_max: 60 },
      { nev: "Odú-küszöb", tipus: "kivonas", darab: 6, a_min: 41, a_max: 89, b_min: 10, b_max: 60, cel: true }
    ]
  },
  {
    id: "atlepo", nev: "Tízes-átlépő", ikon: "🌰",
    palcim: "Kétjegyű ± egyjegyű — tízesátlépéssel",
    alap: { tipus: "osszeadas", eredmeny_max: 100, atlepes: "kell", a_min: 11, a_max: 89, b_min: 2, b_max: 9 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Bukkanó", darab: 5, a_min: 11, a_max: 39 },
      { nev: "Gödör", tipus: "kivonas", darab: 5, a_min: 21, a_max: 49 },
      { nev: "Kidőlt fa", darab: 5, a_min: 15, a_max: 59 },
      { nev: "Árok", tipus: "kivonas", darab: 6, a_min: 31, a_max: 79 },
      { nev: "Meredek", darab: 6, a_min: 20, a_max: 79 },
      { nev: "Szakadék széle", tipus: "kivonas", darab: 5, a_min: 31, a_max: 89 },
      { nev: "Odú-küszöb", darab: 6, a_min: 11, a_max: 89, cel: true }
    ]
  },
  {
    id: "erdo-melye", nev: "Erdő mélye", ikon: "🌲",
    palcim: "Kétjegyű ± kétjegyű — átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 100, atlepes: "nincs", a_min: 11, a_max: 88, b_min: 11, b_max: 70 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Első nagy lépés", darab: 5, a_min: 11, a_max: 40, b_min: 11, b_max: 30 },
      { nev: "Visszafelé az ösvényen", tipus: "kivonas", darab: 5, a_min: 31, a_max: 60, b_min: 11, b_max: 30 },
      { nev: "Mélyebbre", darab: 5, a_min: 20, a_max: 60, b_min: 11, b_max: 40 },
      { nev: "Kölcsön nélkül vissza", tipus: "kivonas", darab: 6, a_min: 41, a_max: 80, b_min: 11, b_max: 50 },
      { nev: "Sűrű avar", darab: 6, a_min: 15, a_max: 70, b_min: 11, b_max: 50 },
      { nev: "Vegyes ösvény", tipus: "kivonas", darab: 5, a_min: 31, a_max: 88, b_min: 11, b_max: 60 },
      { nev: "Odú-küszöb", darab: 6, a_min: 11, a_max: 88, b_min: 11, b_max: 70, cel: true }
    ]
  },
  {
    id: "erdo-szive", nev: "Erdő szíve", ikon: "🌲",
    palcim: "Kétjegyű ± kétjegyű — tízesátlépéssel",
    alap: { tipus: "osszeadas", eredmeny_max: 100, atlepes: "kell", a_min: 13, a_max: 88, b_min: 13, b_max: 79 },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Küszöb", darab: 5, a_min: 13, a_max: 45, b_min: 13, b_max: 35 },
      { nev: "Homályösvény", tipus: "kivonas", darab: 5, a_min: 31, a_max: 60, b_min: 13, b_max: 29 },
      { nev: "Mohos szurdok", darab: 5, a_min: 20, a_max: 65, b_min: 13, b_max: 45 },
      { nev: "Vaksötét", tipus: "kivonas", darab: 6, a_min: 41, a_max: 85, b_min: 15, b_max: 55 },
      { nev: "Suttogó mély", darab: 6, a_min: 20, a_max: 75, b_min: 13, b_max: 55 },
      { nev: "Az erdő szíve", tipus: "kivonas", darab: 5, a_min: 35, a_max: 88, b_min: 15, b_max: 69 },
      { nev: "Odú-küszöb", darab: 6, a_min: 13, a_max: 88, b_min: 13, b_max: 79, cel: true }
    ]
  }
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
      // "húsz egy" → 21 összevonás CSAK 20-tól: a "tíz egy" nem 11, hanem két külön
      // szám (a bontás felmondásában gyakori: "…tíz, egy meg kilenc…").
      var nx = tk[i + 1];
      if (TIZES_SZO[w] >= 20 && nx && EGYES_SZO[nx] != null && EGYES_SZO[nx] > 0) { out.push(TIZES_SZO[w] + EGYES_SZO[nx]); i++; }
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
/* kerek tízes sorsolás a megadott [min,max] értéktartományban (a min/max maga értékben van megadva) */
function veletlenTizes(min, max) { return veletlen(Math.ceil(min / 10), Math.floor(max / 10)) * 10; }
var GEN = {
  osszeadas: function (cfg, kerultMar) {
    var emax = cfg.eredmeny_max || 100, a, b, kulcs, kor = 0;
    do {
      if (cfg.csak_tizes) { a = veletlenTizes(cfg.a_min, cfg.a_max); b = veletlenTizes(cfg.b_min, cfg.b_max); }
      else {
        a = veletlen(cfg.a_min, cfg.a_max);
        b = cfg.b_tizes ? veletlenTizes(cfg.b_min, cfg.b_max) : veletlen(cfg.b_min, cfg.b_max);
      }
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
      if (cfg.csak_tizes) { a = veletlenTizes(cfg.a_min, cfg.a_max); b = veletlenTizes(cfg.b_min, cfg.b_max); }
      else {
        a = veletlen(cfg.a_min, cfg.a_max);
        b = cfg.b_tizes ? veletlenTizes(cfg.b_min, cfg.b_max) : veletlen(cfg.b_min, Math.min(cfg.b_max, a));
      }
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
  },
  /* Teljes tízesek 100-ig: kerek tízes ± kerek tízes, nincs átlépés, nem megy 0 alá. */
  tizesek: function (cfg, kerultMar) {
    var a, b, op, kulcs, kor = 0;
    do {
      op = cfg.muvelet || (veletlen(0, 1) ? "+" : "-");
      a = veletlen(cfg.a_min || 2, cfg.a_max || 9) * 10;
      b = veletlen(cfg.b_min || 1, cfg.b_max || 8) * 10;
      kulcs = op + Math.min(a, b) + "|" + Math.max(a, b); kor++;
    } while (kor < 400 && ((op === "+" && a + b > 100) || (op === "-" && a - b < 0) || (op === "-" && a === b) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    var keplet = op === "+" ? (a + " + " + b) : (a + " − " + b);
    var helyes = op === "+" ? a + b : a - b;
    var ta = a / 10, tb = b / 10, th = helyes / 10;
    return {
      csalad: "egyenkent", keplet: keplet, szoveg: keplet + " = ?",
      kartyaHTML: '<span class="k-nagy">' + keplet + ' = <b>?</b></span>',
      felolvas: op === "+" ? ("Mennyi " + szo(a) + " meg " + szo(b) + "?") : ("Mennyi " + szo(a) + " mínusz " + szo(b) + "?"),
      helyes: helyes,
      tipp: op === "+"
        ? ("Számold a tízeseket: " + ta + " meg " + tb + " az " + th + " tízes, vagyis " + szo(helyes) + ".")
        : ("Számold a tízeseket: " + ta + " mínusz " + tb + " az " + th + " tízes, vagyis " + szo(helyes) + "."),
      naplo: { tipus: "tizesek", kerdes: keplet, helyes: helyes, atlepes: false }
    };
  }
};

/* ============ 4) MENTÉS ============ */
var KULCS = "unikornis_centum_v1";
var mentes;
function alapOdu() { return { napszak: "este", ido: "tiszta", van: { napszak: { este: 1 }, ido: { tiszta: 1 } } }; }
function alapOltozet() { return { fej: null, nyak: null, hat: null, lab: null, oldal: null, farok: null, van: {} }; }
function alapProfil() { return { csillampor: 0, becenev: "", palyak: {}, naplo: [], jatekMp: 0, odu: alapOdu(), oltozet: alapOltozet() }; }
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
        if (!p.odu) p.odu = alapOdu();
        if (!p.odu.van) p.odu.van = { napszak: {}, ido: {} };
        if (!p.odu.van.napszak) p.odu.van.napszak = {};
        if (!p.odu.van.ido) p.odu.van.ido = {};
        p.odu.van.napszak.este = 1; p.odu.van.ido.tiszta = 1;   /* az alap mindig birtokolt */
        if (!p.odu.napszak) p.odu.napszak = "este";
        if (!p.odu.ido) p.odu.ido = "tiszta";
        if (!p.oltozet) p.oltozet = alapOltozet();
        if (!p.oltozet.van) p.oltozet.van = {};
        ["fej", "nyak", "hat", "lab", "oldal", "farok"].forEach(function (h) { if (p.oltozet[h] === undefined) p.oltozet[h] = null; });
      });
      if (mentes.hang == null) mentes.hang = true;
      if (!mentes.valaszmod) mentes.valaszmod = "beszed";
      if (!mentes.ragyogasNulla20260906) {                 /* egyszeri visszaállítás: Ragyogás pont + megvásárolt eszközök nullázása */
        var rg = mentes.profilok.ragyogas;
        if (rg) { rg.csillampor = 0; rg.oltozet = alapOltozet(); rg.odu = alapOdu(); }
        mentes.ragyogasNulla20260906 = 1;
        ment();
      }
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
  var lefutott = false, orzo = null, fig = null;
  function befejez() {
    if (lefutott) return;
    lefutott = true;
    if (orzo) clearTimeout(orzo);
    if (fig) clearInterval(fig);
    bagolyAnimal(false);
    if (kesz) kesz();
  }
  if (!window.speechSynthesis || !mentes.hang) { setTimeout(befejez, 350); return; }
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(szoveg);
    u.lang = "hu-HU"; u.rate = 0.95; u.pitch = 1.0;
    if (huHang) u.voice = huHang;
    u.onend = befejez;
    u.onerror = befejez;
    speechSynthesis.speak(u);
    /* A Chrome sokszor nem süti el az onend-et (főleg cancel() után, vagy háttérfülnél),
       ilyenkor a callback nélkül a játék végleg megállna. Ezért magát a speechSynthesis-t
       figyeljük: ha elindult a beszéd, megvárjuk míg elhallgat; ha ~1,5 mp alatt el sem
       indult (a bug egyik formája), továbblépünk; és van egy 12 mp-es végső határ is. */
    var kezdet = Date.now(), beszeltMar = false;
    fig = setInterval(function () {
      var telt = Date.now() - kezdet;
      if (speechSynthesis.speaking) beszeltMar = true;
      var elhallgatott = beszeltMar && !speechSynthesis.speaking && !speechSynthesis.pending;
      var elSemIndult = !beszeltMar && telt > 1500;
      if (elhallgatott || elSemIndult || telt > 12000) befejez();
    }, 200);
  } catch (e) { befejez(); }
}
function bagolyAnimal(be) { var b = document.querySelector(".bagoly-figura"); if (b) b.classList.toggle("beszel", be); }

var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var beszedTamogatott = !!SR;
var felismero = null;
function figyelj(siker, hiba) {
  if (!SR) { hiba && hiba("nincs"); return; }
  try { if (felismero) felismero.abort(); } catch (e) {}
  var sajat = new SR();
  felismero = sajat;
  sajat.lang = "hu-HU"; sajat.interimResults = false; sajat.maxAlternatives = 3; sajat.continuous = false;
  var kaptunk = false, lezart = false;
  var ido = setTimeout(function () { try { sajat.stop(); } catch (e) {} }, 7000);
  /* védelem: ez a felismerő csak EGYSZER adhat eredményt/hibát, és a saját 7 mp-es
     időzítője csak a SAJÁT (nem egy időközben elindult újabb) felismerőt állíthatja le
     — előfordulhat, hogy a böngésző kétszer sül el egy elhangzott válaszra. */
  sajat.onresult = function (ev) {
    if (lezart) return; lezart = true; kaptunk = true; clearTimeout(ido);
    var alt = []; for (var i = 0; i < ev.results[0].length; i++) alt.push(ev.results[0][i].transcript);
    siker(alt);
  };
  sajat.onerror = function (ev) {
    if (lezart) return; lezart = true; clearTimeout(ido);
    hiba && hiba(ev.error === "no-speech" ? "nincs-hang" : ev.error);
  };
  sajat.onend = function () { clearTimeout(ido); if (!kaptunk && !lezart) { lezart = true; hiba && hiba("nincs-hang"); } };
  try { sajat.start(); } catch (e) { hiba && hiba("start"); }
}
function figyelStop() { FB.aktiv = false; clearTimeout(FB.timer); try { if (felismero) felismero.stop(); } catch (e) {} }

/* ── ÉLŐ FELMONDÁS: folyamatos hallgatás, soronkénti pipa + csilingelés ──────
   A gyerek egyben mondja a bontást, de a gép SORONKÉNT nyugtáz: minden jól
   kimondott sor után zöld pipa pukkan + csilingelés. A sorok tartalma NEM
   látszik (memóriajáték: fejben kell tartani, hol jár) — csak a pipák.     */
var FB = { aktiv: false, sor: 0, puffer: [], N: 0, sorHibak: 0, timer: null };

function figyeljElo(onChunk, onHiba) {
  if (!SR) { onHiba && onHiba("nincs"); return; }
  try { if (felismero) felismero.abort(); } catch (e) {}
  felismero = new SR();
  felismero.lang = "hu-HU"; felismero.interimResults = false;
  felismero.maxAlternatives = 3; felismero.continuous = true;
  felismero.onresult = function (ev) {
    for (var r = ev.resultIndex; r < ev.results.length; r++) {
      if (!ev.results[r].isFinal) continue;
      var alt = []; for (var i = 0; i < ev.results[r].length; i++) alt.push(ev.results[r][i].transcript);
      onChunk(alt);
    }
  };
  felismero.onerror = function (ev) {
    if (ev.error === "no-speech" || ev.error === "aborted") return; /* az onend újraindít */
    onHiba && onHiba(ev.error);
  };
  /* a böngésző csendnél magától leáll — amíg a felmondás él, újraindítjuk */
  felismero.onend = function () {
    if (FB.aktiv) setTimeout(function () { if (FB.aktiv) { try { felismero.start(); } catch (e) {} } }, 180);
  };
  try { felismero.start(); } catch (e) { onHiba && onHiba("start"); }
}

/* Fogyasztó: a hallott számokat az elvárt sorrendhez illeszti.
   Elvárt sorok: i + (N−i), i = 0…N, lentről; soronként opcionális kimondott
   összeg (N). Visszaadja az új állapotot + hány ÚJ sor lett kész + hiba volt-e. */
function bontasEloFogyaszt(sor, puffer, N) {
  puffer = puffer.slice();
  var uj = 0, hiba = false, megy = true;
  while (megy) {
    megy = false;
    if (sor > N) { /* minden sor kész — már csak záró összeg jöhet */
      while (puffer.length && puffer[0] === N) puffer.shift();
      if (puffer.length) hiba = true;
      break;
    }
    if (!puffer.length) break;
    if (puffer[0] === sor) {
      if (puffer.length < 2) break;                 /* várjuk a sor második tagját */
      if (puffer[1] === N - sor) { puffer.shift(); puffer.shift(); sor++; uj++; megy = true; continue; }
      if (sor === N && puffer[1] === N) { puffer.shift(); megy = true; continue; } /* ez az N még az előző sor összege volt */
      hiba = true; break;
    }
    if (puffer[0] === N && sor > 0) { puffer.shift(); megy = true; continue; }     /* előző sor kimondott összege */
    hiba = true; break;
  }
  return { sor: sor, puffer: puffer, uj: uj, hiba: hiba };
}

/* A felismerő az "öt meg egy"-et gyakran "ötvenegy"-nek (51) hallja, a
   "hat meg nulla"-t "hatvan"-nak. Ebben a feladatban 10-nél nagyobb szám nem
   hangozhat el legitim módon → minden 10 feletti számból szétbontott jelöltet
   is képzünk (51 → 5,1; 60 → 6,0 vagy 6), és a pontozó választ. */
function szetbont(szamok, nullaval) {
  var out = [];
  szamok.forEach(function (v) {
    if (v > 10) {
      out.push(Math.floor(v / 10));
      var e = v % 10;
      if (e > 0 || nullaval) out.push(e);
    } else out.push(v);
  });
  return out;
}

function bontasEloChunk(altList) {
  if (!FB.aktiv) return;
  var N = FB.N, legjobb = null, jeloltek = [];
  altList.forEach(function (sz) {
    var n = szamokKinyer(sz);
    if (!n.length) return;
    jeloltek.push(n);
    if (n.some(function (v) { return v > 10; })) {
      jeloltek.push(szetbont(n, true));
      jeloltek.push(szetbont(n, false));
    }
  });
  jeloltek.forEach(function (szamok) {
    var proba = bontasEloFogyaszt(FB.sor, FB.puffer.concat(szamok), N);
    var pont = proba.uj * 10 + (proba.hiba ? 0 : 5);   /* több kész sor > hibátlanság */
    if (!legjobb || pont > legjobb.pont) { legjobb = proba; legjobb.pont = pont; }
  });
  if (!legjobb) return;

  if (legjobb.uj > 0) {
    for (var k = 0; k < legjobb.uj; k++)
      setTimeout(function () { hangCsilla(); }, k * 200);
    FB.sor = legjobb.sor;
    FB.sorHibak = 0;                                  /* új sor: nulláról indul az elakadás-számláló */
    J.parokKesz = Math.min(FB.sor, N + 1);
    renderPipaSor();
  }
  if (FB.sor > N) { FB.puffer = legjobb.puffer; bontasEloSiker(); return; }
  if (legjobb.hiba) {
    FB.puffer = [];                                   /* a rossz próbálkozást eldobjuk – de a pipák maradnak */
    hangHiba();
    var ps = $("pipa-sor");
    ps.classList.remove("razas"); void ps.offsetWidth; ps.classList.add("razas");
    bontasEloBotlas();                                /* ugyanabból az FB.sor-ból folytatjuk, NINCS reset */
    return;
  }
  FB.puffer = legjobb.puffer;                         /* jó (esetleg félbehagyott) sor: várunk a folytatásra */
  if (legjobb.uj > 0) {
    inaktivUjra();
    /* a csilingelés után egy felszólító pittyegés: „jöhet a következő pár” */
    setTimeout(function () { if (FB.aktiv) pittyKovetkezo(); }, legjobb.uj * 200 + 160);
  }
}
function pittyKovetkezo() { beep(880, 0.08, "sine", 0, 0.12); }
/* Elakadás UGYANAZON a soron (csend vagy félrehallott pár): a haladás megmarad,
   a bagoly megmutatja a soron következő párt + pittyegés, és ugyanabból az FB.sor-ból
   figyel tovább. Csak sok egymás utáni elakadás után adjuk fel (→ lépésenkénti beírás). */
function bontasEloBotlas() {
  if (!FB.aktiv) return;
  FB.sorHibak++;
  if (FB.sorHibak >= 4) { bontasEloVege(); return; }
  bagolyMondat("Most ezt mondd: " + FB.sor + " meg " + (FB.N - FB.sor) + ".");
  setTimeout(function () { if (FB.aktiv) pittyKovetkezo(); }, 900);
  inaktivUjra();
}

/* Felmondás KÖZBEN csak pipák látszanak (a tartalom a fejben van) —
   a golyós lista a legvégén jelenik meg, jutalomként. */
function renderPipaSor() {
  var box = $("pipa-sor"); box.hidden = false; box.innerHTML = "";
  var sor = el("div", "pipa-hatra");
  for (var i = 0; i <= FB.N; i++)
    sor.appendChild(el("span", "pipa-hely" + (i < FB.sor ? " kesz" : "")));
  box.appendChild(sor);
}

/* A VÉGÉN: az összes bontás golyóhuzogatós ábrával (2+4=6 → 2 piros + 4 kék
   golyó a rúdon), képlettel és pipával. */
function renderGolyoLista() {
  var box = $("pipa-sor"); box.hidden = false; box.innerHTML = "";
  var N = J.feladat.N;
  for (var i = 0; i <= N; i++) {
    var sorEl = el("div", "golyo-sor uj");
    sorEl.style.animationDelay = (i * 90) + "ms";
    var g = "";
    for (var p = 0; p < i; p++) g += '<i class="golyo piros"></i>';
    for (var k = 0; k < N - i; k++) g += '<i class="golyo kek"></i>';
    sorEl.innerHTML =
      '<span class="golyok">' + g + '</span>' +
      '<span class="golyo-keplet">' + i + ' + ' + (N - i) + ' = ' + N + '</span>' +
      '<span class="golyo-pipa">✓</span>';
    box.appendChild(sorEl);
  }
}

function inaktivUjra() {
  clearTimeout(FB.timer);
  FB.timer = setTimeout(function () {
    if (!FB.aktiv) return;
    bontasEloBotlas();                                /* csend: ugyanaz a segítés, mint a félrehallásnál – NINCS reset */
  }, 12000);
}

/* CSAK a feladat legelső indításakor hívjuk – ez nullázza a haladást (FB.sor = 0). */
function bontasEloStart() {
  FB = { aktiv: true, sor: 0, puffer: [], N: J.feladat.N, sorHibak: 0, timer: null };
  J.parokKesz = 0;
  var g = $("mondom-bontas-gomb");
  g.classList.add("figyel"); g.textContent = "⏹ Kész vagyok";
  $("hallgat-f").hidden = false;
  $("felmond-lista").hidden = true; $("felmond-lista").innerHTML = "";
  $("felmond-megvan").hidden = true;
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  renderPipaSor();
  try { speechSynthesis.cancel(); } catch (e) {}     /* a felolvasást ne hallja a mikrofon */
  inaktivUjra();
  figyeljElo(bontasEloChunk, bontasEloHibaAg);
}
/* Elakadás UTÁNI folytatás – a haladást (FB.sor, pipák, J.parokKesz) NEM nullázza,
   csak újraindítja a hallgatást ugyanabból a pontból. Soha ne kezdje elölről. */
function bontasEloFolytat() {
  if (!J || !J.feladat || J.feladat.csalad !== "felmondas") return;
  FB.aktiv = true;
  FB.puffer = [];
  var g = $("mondom-bontas-gomb");
  g.classList.add("figyel"); g.textContent = "⏹ Kész vagyok";
  $("hallgat-f").hidden = false;
  inaktivUjra();
  figyeljElo(bontasEloChunk, bontasEloHibaAg);
}
function bontasEloHibaAg(hiba) {
  bontasEloElhallgat();
  if (hiba === "nincs" || hiba === "not-allowed" || hiba === "service-not-allowed") {
    beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
    $("visszajelzes-f").textContent = "Most beírással játszunk.";
    bontasLepesNyit();
  } else if (felmondKezNelkulE()) {
    $("visszajelzes-f").textContent = "Egy pillanat — figyelek tovább…";
    setTimeout(function () { if (felmondKezNelkulE()) bontasEloFolytat(); }, 600);
  } else {
    $("visszajelzes-f").textContent = "Nyomd meg a gombot, és folytasd onnan!";
  }
}

function bontasEloElhallgat() {
  FB.aktiv = false; clearTimeout(FB.timer);
  try { if (felismero) felismero.abort(); } catch (e) {}
  var g = $("mondom-bontas-gomb");
  g.classList.remove("figyel"); g.textContent = "🎤 Mondom a bontását";
  $("hallgat-f").hidden = true;
}

function bontasEloSiker() {
  bontasEloElhallgat();
  felmondSiker();                        /* a gyöngyös lista + „mondd el még egyszer” benne */
}

/* Végszükség: „Kész vagyok" gomb, vagy ugyanazon a soron 4× elakadás.
   NINCS újrakezdés – a meglévő pipáktól folytatjuk lépésenkénti beírással. */
function bontasEloVege() {
  bontasEloElhallgat();
  if (FB.sor > FB.N) return;
  J.parokKesz = FB.sor;                               /* a beírás innen folytatódik (bontasLepesNyit) */
  $("visszajelzes-f").className = "visszajelzes";
  $("visszajelzes-f").textContent = FB.sor > 0
    ? ("Eddig " + FB.sor + " pipa megvan — fejezzük be beírással!")
    : "Nézzük lépésenként!";
  mondd((FB.sor > 0 ? "Fejezzük be beírással. " : "Nézzük lépésenként. ") + J.feladat.tipp, function () { bontasLepesNyit(); });
  ment();
}

/* ============ 6) SVG ============ */
var KOR = "#3a2f2a"; // körvonal
function csillagSVG(x, y, r, fill) {
  var p = [];
  for (var i = 0; i < 10; i++) {
    var ang = Math.PI / 5 * i - Math.PI / 2;
    var rr = i % 2 ? r * 0.42 : r;
    p.push((x + Math.cos(ang) * rr).toFixed(1) + "," + (y + Math.sin(ang) * rr).toFixed(1));
  }
  return '<path d="M' + p.join(" L") + ' Z" fill="' + fill + '"/>';
}
/* A három lény kész rajza (Matekos: unikornis-korall/kek/rozsa.svg — a gyerekek
   rajza alapján). Eredeti keret: 0..380 × 0..300, a talp ~y288, a vízszintes
   közép ~x190. A közös motor-koordinátába illesztve: scale(0.5) translate(-190,-272)
   → talp ~y8, közép ~x0, kb. 135 magas (mint a régi figura). */
var UNI_KORALL = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#f2662b" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#d83b22" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffb43a" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffb43a" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#f2662b" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#d83b22" stroke-width="5"/> <path d="M100 222 L120 222 L114 286 L92 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M134 230 L154 230 L152 288 L130 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M178 230 L198 230 L202 288 L180 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M216 222 L236 222 L256 286 L232 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#f2a877" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#f8c6a1" stroke="none"/> <path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#f2662b" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#f2662b" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#f2662b" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#d83b22" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#d83b22" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#f2662b" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#d83b22" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffb43a" stroke-width="4"/> <path d="M232 120 C232 92 258 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C252 170 232 150 232 120 Z" fill="#f2a877" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#3a2a20" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#f2662b" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#d83b22" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffb43a" stroke-width="4"/> <path d="M250 92 L266 92 L258 58 Z" fill="#f2a877" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#f28a2e" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#c9531a" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#c9531a" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#c9531a" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#c9531a" stroke-width="3"/> <g stroke="none"> <ellipse cx="120" cy="166" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="133" cy="174" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="128" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="112" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="107" cy="174" rx="6" ry="8" fill="#d63a3a"/> <circle cx="120" cy="178" r="4.5" fill="#ffd24d"/> </g> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f2662b"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#d94fb0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffb43a"/> </g> </g>';
var UNI_KEK = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#29a3dd" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#7a3bc0" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#c98fe6" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#c98fe6" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#29a3dd" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#7a3bc0" stroke-width="5"/> <path d="M100 222 L120 222 L114 286 L92 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M134 230 L154 230 L152 288 L130 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M178 230 L198 230 L202 288 L180 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M216 222 L236 222 L256 286 L232 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#d7ebfb" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ecf6fe" stroke="none"/> <path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#29a3dd" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#29a3dd" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#29a3dd" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#7a3bc0" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#7a3bc0" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#29a3dd" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#7a3bc0" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#c98fe6" stroke-width="4"/> <path d="M232 120 C232 92 258 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C252 170 232 150 232 120 Z" fill="#d7ebfb" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#2ea8e0" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#29a3dd" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#7a3bc0" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#c98fe6" stroke-width="4"/> <path d="M250 92 L266 92 L258 58 Z" fill="#d7ebfb" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#6a6fd6" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#454bb0" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#454bb0" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#454bb0" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#454bb0" stroke-width="3"/> <g stroke="#2b7fd0" stroke-width="3" stroke-linecap="round"> <path d="M120 162 V190"/> <path d="M108 169 L132 183"/> <path d="M132 169 L108 183"/> <path d="M120 167 l-5 5 M120 167 l5 5"/> <path d="M120 185 l-5 -5 M120 185 l5 -5"/> </g> <circle cx="120" cy="176" r="3" fill="#7a3bc0" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#29a3dd"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#7a3bc0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#b06be0"/> </g> </g>';
var UNI_ROZSA = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#ffcf4d" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#e6a92e" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffe6a0" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffe6a0" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#ffcf4d" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#e6a92e" stroke-width="5"/> <path d="M100 222 L120 222 L114 286 L92 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M134 230 L154 230 L152 288 L130 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M178 230 L198 230 L202 288 L180 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M216 222 L236 222 L256 286 L232 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#fdf3f7" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ffffff" stroke="none"/> <path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#ffcf4d" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#e6a92e" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#e6a92e" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#ffcf4d" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#e6a92e" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffe6a0" stroke-width="4"/> <path d="M232 120 C232 92 258 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C252 170 232 150 232 120 Z" fill="#fdf3f7" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.4" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#e67ba6" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#ffcf4d" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#e6a92e" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffe6a0" stroke-width="4"/> <path d="M250 92 L266 92 L258 58 Z" fill="#fdf3f7" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#ffcf4d" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#e0a52e" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#e0a52e" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#e0a52e" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#e0a52e" stroke-width="3"/> <path d="M120 162 l3 10 l10 4 l-10 4 l-3 10 l-3 -10 l-10 -4 l10 -4 Z" fill="#f4a6c6" stroke="none"/> <path d="M136 186 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#f28ab8" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f4a6c6"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#f28ab8"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffd24d"/> </g> </g>';
var UNI_RAJZ = { korall: UNI_KORALL, kek: UNI_KEK, rozsa: UNI_ROZSA };

/* A közös felület: a hívók unikornisSVG(id, c, meret, oltozet)-et kérnek.
   Az `oltozet` (opcionális) a felvett ruhák: { fej, nyak, hat, lab, oldal, farok }.
   A ruhák a kész rajz saját (380×300) koordinátájában rajzolódnak. */
function unikornisSVG(id, c, meret, oltozet) {
  var s = meret || 1;
  var art = UNI_RAJZ[(c && c.rajz) || "korall"] || UNI_KORALL;
  var ruha = "";
  if (oltozet) ["hat", "farok", "oldal", "lab", "nyak", "fej"].forEach(function (h) { if (oltozet[h]) ruha += ruhaSVG(oltozet[h]); });
  return '<g id="' + id + '" transform="scale(' + s + ')">' +
    '<g transform="scale(0.5) translate(-190,-272)">' + art + ruha + (window.__UC_ANCHOR ? anchorVizSVG() : "") + '</g>' +
  '</g>';
}
/* ── FEJLESZTŐI ANCHOR-VIZUALIZÁLÓ (nem éles): a 380×300 rajz-keretben kirajzolja a
   ruha-zónák borítékát + a horgonypontokat, hogy élesben látszódjon, hova esik minden ruha.
   Bekapcsolás: URL-ben ?anchor=1 VAGY konzolból UC.anchorViz(true). */
var ANCHOR_ZONAK = [
  { nev: "fej",   x: 244, y: 54,  w: 88,  h: 48, hx: 288, hy: 73,  szin: "#e0417a" },
  { nev: "nyak",  x: 232, y: 145, w: 80,  h: 68, hx: 266, hy: 160, szin: "#1f9e6b" },
  { nev: "hát",   x: 104, y: 96,  w: 152, h: 78, hx: 180, hy: 118, szin: "#8a4fd0" },
  { nev: "oldal", x: 40,  y: 26,  w: 172, h: 136, hx: 172, hy: 106, szin: "#c98a1e" },
  { nev: "farok", x: 54,  y: 128, w: 76,  h: 46, hx: 92,  hy: 150, szin: "#c0407a" }
];
function anchorVizSVG() {
  var s = '<g class="anchor-viz" pointer-events="none" font-family="sans-serif">';
  /* testtető-ív referencia (a hát-takarók alsó éle ezt követhesse) */
  s += '<path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176" fill="none" stroke="#ff2fa0" stroke-width="1.6" stroke-dasharray="5 3" opacity="0.9"/>';
  ANCHOR_ZONAK.forEach(function (z) {
    s += '<rect x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" fill="' + z.szin + '" fill-opacity="0.10" stroke="' + z.szin + '" stroke-width="1.4" stroke-dasharray="6 4"/>';
    s += '<circle cx="' + z.hx + '" cy="' + z.hy + '" r="4" fill="' + z.szin + '" stroke="#fff" stroke-width="1.2"/>';
    s += '<text x="' + (z.x + 3) + '" y="' + (z.y + 12) + '" font-size="10" font-weight="700" fill="' + z.szin + '">' + z.nev + '</text>';
  });
  /* a 4 láb-horgony */
  [103, 141, 191, 244].forEach(function (cx) {
    s += '<circle cx="' + cx + '" cy="270" r="3.4" fill="#2b6ad8" stroke="#fff" stroke-width="1"/>';
  });
  s += '<text x="90" y="286" font-size="10" font-weight="700" fill="#2b6ad8">láb ×4</text>';
  /* oldal-szárny csúcsirány jelző */
  s += '<line x1="172" y1="106" x2="85" y2="40" stroke="#c98a1e" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.8"/>';
  return s + '</g>';
}
function anchorViz(on) {
  window.__UC_ANCHOR = (on !== false);
  var aktiv = (document.querySelector(".kepernyo.aktiv") || {}).id;
  try {
    if (aktiv === "kepernyo-profil") renderProfil();
    else if (aktiv === "kepernyo-odu") renderOdu();
    else if (aktiv === "kepernyo-fomenu") renderFomenu();
    var op = $("odu-panel"); if (op && !op.hidden) renderOduPanel();
  } catch (e) {}
  return "anchor-viz: " + (window.__UC_ANCHOR ? "BE" : "KI") + " (a pálya-térképen a következő képernyőváltáskor frissül)";
}
if (/[?&]anchor=1\b/.test(location.search)) window.__UC_ANCHOR = true;
/* Egy ruhadarab rajza a kész unikornis-rajz 380×300 koordinátájában.
   Horgonypontok: fej ~(288,121) / szarv-tő ~(272,90), nyak/mell ~(236,200). */
function ruhaSVG(itemId) {
  var s;
  switch (itemId) {
    case "fej-a": /* Virágkoszorú – a fej TETEJÉN ívelve (zóna: fej-korona, y≤96); egységes bélyegkép-spec: élénk, elütő színű szirmok */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M254 98 Q288 70 322 98" fill="none" stroke="#a7d99a" stroke-width="2" opacity="0.7"/>' +
        '<circle cx="256" cy="96" r="7" fill="#f6a5c0"/><circle cx="272" cy="80" r="7" fill="#fce49a"/>' +
        '<circle cx="290" cy="74" r="7.5" fill="#a7d99a"/><circle cx="308" cy="80" r="7" fill="#9ec9f0"/>' +
        '<circle cx="324" cy="96" r="7" fill="#c9a8e6"/>' +
        '</g><g fill="#ffd24d"><circle cx="256" cy="96" r="2.3"/><circle cx="272" cy="80" r="2.3"/>' +
        '<circle cx="290" cy="74" r="2.4"/><circle cx="308" cy="80" r="2.3"/><circle cx="324" cy="96" r="2.3"/></g>';
    case "fej-k": /* Csillag-szarvdísz – szikra-csóva a szarv felé + csillag a csúcsnál (egységes bélyegkép-spec) */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M270 86 Q288 78 296 62" fill="none" stroke="#e6c34d" stroke-width="4.5"/>' +
        '<path d="M278 68 Q294 60 300 46" fill="none" stroke="#e6c34d" stroke-width="4"/>' +
        '</g><path d="M298 40 l3.5 9 l9.5 0.7 l-7.5 6 l2.8 9.2 l-8.3 -5.4 l-8.3 5.4 l2.8 -9.2 l-7.5 -6 l9.5 -0.7 Z" fill="#ffd24d" stroke="#222" stroke-width="1"/>';
    case "fej-r": /* Hold-korona – recés pánt a fej tetején + holdsarló a közepén (egységes bélyegkép-spec) */
      return '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M258 100 Q262 82 272 80 l4 8 l8 -11 l8 11 l4 -8 Q316 82 318 100 Z" fill="#d9c7ec"/>' +
        '<path d="M292 76 a9 9 0 1 0 6.2 15.4 a7.2 7.2 0 1 1 -6.2 -15.4 Z" fill="#fdf0d0" stroke="#c9a8e6" stroke-width="1"/>' +
        '</g><circle cx="264" cy="92" r="2.2" fill="#ffd24d"/><circle cx="312" cy="92" r="2.2" fill="#9ec9f0"/>';
    case "nyak-a": /* Makk-lánc – a fej alatti nyak-öbölben (zóna: nyak-öböl, y150–210), makk-medál lóg le */
      return '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M238 158 Q266 196 294 172" fill="none" stroke="#8a6a4a" stroke-width="4.5"/>' +
        '<circle cx="246" cy="168" r="2.6" fill="#a9814e"/><circle cx="286" cy="178" r="2.6" fill="#a9814e"/>' +
        '<ellipse cx="266" cy="200" rx="8.5" ry="10.5" fill="#c08a52"/>' +
        '<path d="M256 194 q10 -8 20 0 l0 -4 q-10 -6 -20 0 Z" fill="#8a6a4a"/><path d="M266 188 v-5" stroke="#8a6a4a" stroke-width="2.4"/>' +
        '</g>';
    case "nyak-k": /* Szív-medál – arany gyöngysor a nyak-öbölben + szív lóg le (ua. zóna, mint nyak-a) */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M236 150 Q266 192 296 168" fill="none" stroke="#c9a06a" stroke-width="2" opacity="0.4"/>' +
        '<circle cx="236" cy="150" r="3" fill="#ffd24d"/><circle cx="246.1" cy="162.2" r="3" fill="#ffd24d"/><circle cx="256" cy="170.7" r="3" fill="#ffd24d"/><circle cx="266" cy="175.5" r="3" fill="#ffd24d"/><circle cx="276" cy="176.7" r="3" fill="#ffd24d"/><circle cx="286.1" cy="174.2" r="3" fill="#ffd24d"/><circle cx="296" cy="168" r="3" fill="#ffd24d"/>' +
        '<path d="M266 177.5 L266 187.5" stroke="#222" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M266 178.5 L266 186.5" stroke="#ffd24d" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M266 191.5 C263 186.5 255 187.5 255 193.5 C255 200.5 266 207.5 266 207.5 C266 207.5 277 200.5 277 193.5 C277 187.5 269 186.5 266 191.5 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.6"/>' +
        '<ellipse cx="261" cy="195.5" rx="2.4" ry="3.6" fill="#fdf4d8" opacity="0.9" stroke="none"/>' +
        '<path d="M279 189 l1.5 3.6 l3.6 1.5 l-3.6 1.5 l-1.5 3.6 l-1.5 -3.6 l-3.6 -1.5 l3.6 -1.5 Z" fill="#fff2c4" stroke="none"/>' +
        '<path d="M243 160 l1.1 2.8 l2.8 1.1 l-2.8 1.1 l-1.1 2.8 l-1.1 -2.8 l-2.8 -1.1 l2.8 -1.1 Z" fill="#fff2c4" stroke="none"/>' +
        '</g>';
    case "nyak-r": /* Szivárvány-sál – ÚJRARAJZOLVA (egységes bélyegkép-spec): egy csíkos háromszög-kendő
                      a nyak alatt (horgony-y 166-tól, hogy ne a szájnál lógjon), nem két hosszú lebeny */
      return '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M244 166 Q272 148 300 166 Q290 178 272 176 Q254 178 244 166 Z" fill="#f6a5c0"/>' +
        '<path d="M259 175 L272 210 L285 175 Z" fill="#f6a5c0"/>' +
        '<path d="M261 182 L283 182" stroke="#fce49a" stroke-width="3.4"/>' +
        '<path d="M263 191 L281 191" stroke="#a7d99a" stroke-width="3.2"/>' +
        '<path d="M265 200 L279 200" stroke="#9ec9f0" stroke-width="3"/>' +
        '</g>';

    /* ── HÁT ── a test tetejére simuló takaró/köpeny, közös sziluett-sablonon, a testtető-ívre
       igazítva, -8°-kal döntve (a rajzoló session anyaga, 2026-09-05; spec-grafikai-eszkozlista §3.1). */
    case "hat-a": /* Pillekönnyű takaró */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#e9ddf3"/>' +
        '<path d="M128 132 Q186 108 238 132 Q234 120 186 116 Q138 120 128 132 Z" fill="#dcd0ec"/>' +
        '<path d="M138 154 Q186 168 232 154 L228 168 Q186 180 142 168 Z" fill="#cbbde6"/>' +
        '</g>';
    case "hat-k": /* Hímzett nyeregtakaró */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#d9b48a"/>' +
        '<path d="M124 140 Q186 118 242 140" fill="none" stroke="#f6ecd8" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>' +
        '<path d="M160 116 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#f6a5c0"/>' +
        '<path d="M212 116 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#a7d99a"/>' +
        '<circle cx="186" cy="150" r="6" fill="#fce49a" stroke="#222" stroke-width="1"/>' +
        '</g>';
    case "hat-r": /* Csillagköpeny */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#5a4fa0"/>' +
        '<path d="M128 132 Q186 108 238 132 Q234 120 186 116 Q138 120 128 132 Z" fill="#6a5fb0"/>' +
        '<path d="M150 128 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff6d8"/>' +
        '<path d="M222 130 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#fff6d8"/>' +
        '<circle cx="186" cy="150" r="3.4" fill="#ffd24d"/>' +
        '</g>';

    /* ── LÁB ── mind a 4 lábra */
    case "lab-a": case "lab-k": case "lab-r":
      s = '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">';
      [103, 141, 191, 244].forEach(function (cx) {
        if (itemId === "lab-a")
          s += '<rect x="' + (cx - 11) + '" y="264" width="22" height="8" rx="2.5" fill="#a7d99a"/><path d="M' + cx + ' 264 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>';
        else if (itemId === "lab-k")
          s += '<path d="M' + (cx - 10) + ' 288 a 10 9 0 0 1 20 0" fill="none" stroke="#cfd6de" stroke-width="4.5"/><circle cx="' + (cx - 8) + '" cy="285" r="1.6" fill="#eef2f6"/><circle cx="' + (cx + 8) + '" cy="285" r="1.6" fill="#eef2f6"/>';
        else
          s += '<path d="M' + (cx - 10) + ' 288 a 10 9 0 0 1 20 0" fill="none" stroke="#f4b8d8" stroke-width="4.5"/><path d="M' + cx + ' 270 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>';
      });
      return s + '</g>';

    /* ── OLDAL (szárny) ── a vállon, a nyak-tő mögött, felfelé-hátra álló kis szárnyként (zóna: váll, x166–216 y84–152) */
    /* NAGYÍTOTT + JÓVÁHAGYOTT IRÁNY (2026-09-04, spec-szarny-nagyitas.html): tő a hát-tetőn
       ~(172,106), a csúcs hátrafelé-fölfelé dől a farok irányába (~(85,40)), kb. 2,3× a korábbi
       méretnek, teljesen LÁTHATÓAN a test/sörény előtt (nem bújik el mögötte). */
    case "oldal-a": /* Levél-szárny — egy nagy, hegyes levél */
      return '<g stroke="#222" stroke-width="1.8" stroke-linejoin="round">' +
        '<path d="M172 106 Q116 90 82 42 Q146 66 180 96 Q198 108 188 118 Q178 122 172 106 Z" fill="#a7d99a"/>' +
        '<path d="M172 104 Q142 90 96 52 M164 100 Q144 100 118 84" fill="none" stroke="#7fb872" stroke-width="2.2"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';
    case "oldal-k": /* Pillangó-szárny — két lebeny, pöttyökkel */
      return '<g stroke="#222" stroke-width="1.7" stroke-linejoin="round">' +
        '<path d="M172 106 Q112 76 76 36 Q108 44 140 60 Q168 78 178 98 Q182 104 172 106 Z" fill="#c9a8e6"/>' +
        '<path d="M172 110 Q135 128 108 165 Q112 138 140 118 Q160 108 172 110 Z" fill="#b58fd8"/>' +
        '<circle cx="118" cy="66" r="5.5" fill="#f6a5c0"/><circle cx="140" cy="86" r="4" fill="#fce49a"/><circle cx="128" cy="145" r="4.5" fill="#fce49a"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';
    case "oldal-r": /* Fény-szárny — glóriás, csillanó */
      return '<g stroke-linejoin="round">' +
        '<ellipse cx="128" cy="86" rx="92" ry="78" fill="#ffe9ad" opacity="0.26"/>' +
        '<g stroke="#222" stroke-width="1.6">' +
        '<path d="M170 108 Q120 82 85 40 Q140 55 175 62 Q195 62 205 82 Q220 78 205 100 Q190 108 170 108 Z" fill="#ffffff"/>' +
        '<path d="M172 104 Q130 84 100 50 M178 90 Q160 78 145 64" fill="none" stroke="#f0d9a0" stroke-width="1.6"/>' +
        '</g>' +
        '<path d="M96 46 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffd24d"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';

    /* ── FAROK ── a farok tövénél (hátul-balra) */
    /* a farok-tő ~(92,150) köré, -15°-kal a farok irányába döntve (rajzoló session, 2026-09-05; §3.1.3) */
    case "farok-a": /* Szalagcsokor */
      return '<g transform="rotate(-15 92 150)" stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M92 150 Q78 138 66 148 Q76 158 92 150 Z" fill="#f6a5c0"/>' +
        '<path d="M92 150 Q106 138 118 148 Q108 158 92 150 Z" fill="#f6a5c0"/>' +
        '<circle cx="92" cy="150" r="5" fill="#e88bb4"/>' +
        '<path d="M88 155 l-8 20 M96 155 l8 20" fill="none" stroke="#f6a5c0" stroke-width="3"/>' +
        '</g>';
    case "farok-k": /* Csengettyűs farokdísz */
      return '<g transform="rotate(-15 92 150)" stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M76 144 Q92 134 108 144" fill="none" stroke="#c9a8e6" stroke-width="4"/>' +
        '<path d="M83 150 q-9 0 -9 10 l0 7 l18 0 l0 -7 q0 -10 -9 -10 Z" fill="#ffd24d"/>' +
        '<circle cx="92" cy="170" r="2.6" fill="#e0a52e"/><circle cx="90" cy="146" r="2.6" fill="#ffe6a0"/>' +
        '</g>';
    case "farok-r": /* Üstökös-farok */
      return '<g transform="rotate(-15 92 150)" stroke-linejoin="round">' +
        '<path d="M92 150 Q70 172 55 200" fill="none" stroke="#fff2c4" stroke-width="12" stroke-linecap="round" opacity="0.5"/>' +
        '<path d="M92 150 Q72 170 58 198" fill="none" stroke="#ffe08a" stroke-width="5" stroke-linecap="round" opacity="0.9"/>' +
        '<path d="M55 200 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffe08a" stroke="#222" stroke-width="1.3"/>' +
        '</g>';
  }
  return "";
}
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
/* TESZT (pálya 2): kamera nélküli, teljes-út nézet. A jelenet-render állítja be. */
var SCENE_TELJES = false, SCENE_N = 8;
var TU_X0 = 78, TU_X1 = 1092;
function allomasX(i) {
  if (SCENE_TELJES) return TU_X0 + i * (TU_X1 - TU_X0) / Math.max(1, SCENE_N - 1);
  return 150 + i * 260;
}
function allomasY(i) {
  if (SCENE_TELJES) {
    var t = SCENE_N > 1 ? i / (SCENE_N - 1) : 0;
    return (418 - t * 176) + (i % 2 ? 40 : -40);   /* fölfelé sodródó cikk-cakk a 200–460 sávban */
  }
  return 262 + 20 * Math.sin(i * 0.9);
}
/* kamera nélküli, egyképernyős térkép — a teljes út (Rajt → Cél) egyszerre látszik,
   az unikornis továbbra is állomásról állomásra sétál rajta (mockup-terkep-teljes-ut.html). */
function jelenetSVGteljes(palya, c) {
  var n = palya.allomasok.length;
  var px = [], py = [];
  for (var k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var utD = "M " + px[0].toFixed(1) + " " + py[0].toFixed(1);
  for (var i = 1; i < n; i++) {
    var dx = px[i] - px[i - 1];
    utD += " C " + (px[i - 1] + dx / 2).toFixed(1) + " " + py[i - 1].toFixed(1) +
           " " + (px[i] - dx / 2).toFixed(1) + " " + py[i].toFixed(1) +
           " " + px[i].toFixed(1) + " " + py[i].toFixed(1);
  }
  /* háttér: ég + nap + felhők + dombsávok */
  var s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="tu-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdeaf7"/><stop offset="0.6" stop-color="#dff2e2"/><stop offset="1" stop-color="#eaf6df"/></linearGradient></defs>' +
    '<rect x="0" y="0" width="1200" height="560" fill="url(#tu-eg)"/>' +
    '<circle cx="1086" cy="72" r="66" fill="#fff6d0" opacity="0.5"/><circle cx="1086" cy="72" r="26" fill="#fff2b8" opacity="0.9"/>' +
    '<g fill="#ffffff" opacity="0.55"><ellipse cx="220" cy="70" rx="46" ry="16"/><ellipse cx="255" cy="62" rx="30" ry="13"/><ellipse cx="640" cy="50" rx="38" ry="14"/><ellipse cx="670" cy="58" rx="24" ry="10"/></g>' +
    '<path d="M0 335 Q150 305 300 330 Q460 355 620 325 Q800 295 960 330 Q1100 353 1200 330 L1200 560 L0 560 Z" fill="#cdeac0" opacity="0.7"/>' +
    '<path d="M0 378 Q200 353 420 383 Q650 413 880 378 Q1050 353 1200 383 L1200 560 L0 560 Z" fill="#bfe3a0"/>' +
    '<path d="M0 420 Q220 400 460 425 Q700 450 940 418 Q1080 400 1200 422 L1200 560 L0 560 Z" fill="#aedb8e" opacity="0.85"/>';
  /* fák CSAK a kereten (fönt/oldalt), középen szabad az út */
  function fa(x, y, m) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + m + ')">' +
      '<rect x="-8" y="14" width="16" height="46" fill="#a9805e"/>' +
      '<circle cx="0" cy="0" r="36" fill="#5a9a4a"/><circle cx="-24" cy="16" r="27" fill="#6bb156"/><circle cx="24" cy="16" r="27" fill="#4f8f42"/>' +
      '<circle cx="-10" cy="-14" r="14" fill="#a8d998"/></g>';
  }
  s += fa(80, 150, 1.15) + fa(150, 300, 0.8) + fa(60, 470, 1) +
       fa(1130, 130, 1.1) + fa(1150, 330, 0.85) + fa(1120, 500, 1) +
       fa(430, 250, 0.62) + fa(720, 235, 0.6) + fa(980, 250, 0.66);
  /* bagoly beljebb egy ágon */
  s += '<g transform="translate(190,220)">' +
    '<path d="M0 4 Q-40 10 -76 2" stroke="#8f6a3e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="-16" rx="17" ry="19" fill="#c9a06a"/><ellipse cx="0" cy="-10" rx="12" ry="12" fill="#e9d3ad"/>' +
    '<path d="M-15 -28 l6 10 l6 -6 Z" fill="#c9a06a"/><path d="M15 -28 l-6 10 l-6 -6 Z" fill="#c9a06a"/>' +
    '<circle cx="-6" cy="-20" r="5" fill="#fff"/><circle cx="6" cy="-20" r="5" fill="#fff"/>' +
    '<circle cx="-6" cy="-20" r="2.3" fill="#4a3b2a"/><circle cx="6" cy="-20" r="2.3" fill="#4a3b2a"/>' +
    '<path d="M0 -14 l-3 4 l6 0 Z" fill="#e8a23d"/></g>';
  /* az út: árnyék + test + világos szegély */
  s += '<g id="kamera">' +
    '<path d="' + utD + '" transform="translate(4,10)" fill="none" stroke="#3b6a30" stroke-width="34" stroke-linecap="round" opacity="0.16"/>' +
    '<path d="' + utD + '" fill="none" stroke="#d9b48a" stroke-width="30" stroke-linecap="round"/>' +
    '<path d="' + utD + '" fill="none" stroke="#f0dcb0" stroke-width="20" stroke-linecap="round"/>';
  /* állomások + Rajt-zászló + Cél-odú */
  for (var s2 = 0; s2 < n; s2++) {
    var ax = px[s2], ay = py[s2], utolso = (s2 === n - 1);
    if (s2 === 0) {
      s += '<g transform="translate(' + ax + ',' + ay + ')"><circle r="15" fill="#a7d99a" stroke="#222" stroke-width="2"/>' +
        '<path d="M0 -24 L0 -2" stroke="#8f6a3e" stroke-width="3"/><path d="M0 -24 L15 -17 L0 -10 Z" fill="#f6a5c0"/></g>';
    } else if (!utolso) {
      s += '<g transform="translate(' + ax + ',' + (ay - 44) + ')">' +
        '<rect x="-58" y="-16" width="116" height="32" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
        '<text x="0" y="5" font-size="14" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[s2].nev) + '</text></g>' +
        '<rect x="' + (ax - 4) + '" y="' + (ay - 30) + '" width="8" height="30" fill="#b79c86"/>' +
        '<circle cx="' + ax + '" cy="' + ay + '" r="14" fill="#f6c85a" stroke="#222" stroke-width="2"/>';
    }
    s += '<g class="allomas-pipa" id="pipa-' + s2 + '" transform="translate(' + ax + ',' + ay + ')" opacity="0"><circle r="12" fill="#a7d99a"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  /* Cél-odú az utolsó pont mögött-fölött */
  var cx = px[n - 1] + 62, cy = py[n - 1] - 6;
  s += '<g transform="translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ')">' +
    '<ellipse cx="0" cy="34" rx="60" ry="16" fill="#2f4a3a" opacity="0.3"/>' +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    csillagSVG(0, -86, 9, "#ffe08a") + '</g>';
  s += '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g>' +
    '</g></svg>';
  return s;
}
function jelenetSVG(palya, lenyKulcs) {
  SCENE_TELJES = !!palya.teljes_ut;
  SCENE_N = palya.allomasok.length;
  if (SCENE_TELJES) return jelenetSVGteljes(palya, LENYEK[lenyKulcs]);
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
        '<text x="0" y="5" font-size="14" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[s].nev) + '</text>' +
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
      '<g id="unikornis-hely" transform="translate(' + allomasX(0) + ',' + allomasY(0) + ')">' + unikornisSVG("uni", c, 0.66, P().oltozet) + '</g>' +
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
    var palyaOssz = PALYAK.filter(function (x) { return !x.hamarosan; }).length;
    var kart = el("div", "profil-kartya");
    kart.innerHTML =
      '<svg viewBox="-78 -132 156 150" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("p" + k, c, 0.9, p.oltozet) + '</svg>' +
      '<div class="nev">' + (p.becenev ? kiiras(p.becenev) + " · " : "") + c.nev + '</div>' +
      '<div class="adat">✨ ' + p.csillampor + ' &nbsp;·&nbsp; 🌟 ' + keszDb + '/' + palyaOssz + '</div>';
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
        probak: 0, kerultKulcsok: {}, futoElsore: 0, futoOssz: 0, futoCsilla: 0, lepesSor: 0, beirt: "",
        kezCsend: 0, kezBeiras: false };
  $("jatek-palyanev").textContent = pa.nev;
  $("jatek-csillampor").textContent = P().csillampor;
  $("szinpad").innerHTML = jelenetSVG(pa, mentes.leny);
  curX = allomasX(0); curY = allomasY(0);
  kameraAllit(0, true);
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  var tovabbMehet0 = (mentes.leny === "csillamharmat");
  $("tovabb-megoldas-nelkul").hidden = !tovabbMehet0;
  $("tovabb-megoldas-nelkul-f").hidden = !tovabbMehet0;
  mutat("kepernyo-jatek");
  setTimeout(function () { mondd("Induljunk! Gyűjtsük össze a csillagszilánkokat.", function () { kovAllomas(); }); }, 400);
}
function kameraAllit(i, azonnal) {
  var kam = document.querySelector("#szinpad #kamera");
  if (!kam) return;
  if (SCENE_TELJES) { kam.style.transition = "none"; kam.style.transform = "translateX(0)"; if (J) J.kameraX = 0; return; }
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
  if (window.__UC_GYORS) { curX = x1; curY = y1; u.setAttribute("transform", "translate(" + x1 + "," + y1 + ")"); if (ko) { ko.setAttribute("cx", x1); ko.setAttribute("cy", y1 + 8); } if (kesz) setTimeout(kesz, 0); return; }
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
  if (FB.aktiv) bontasEloElhallgat();
  $("pipa-sor").hidden = true;
  $("hallgat-e").hidden = true; $("hallgat-f").hidden = true;
  $("bontas-kesz-gomb").hidden = true;
  $("valaszter").style.visibility = "visible";
  $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  var tovabbMehet = (mentes.leny === "csillamharmat");
  $("tovabb-megoldas-nelkul").hidden = !tovabbMehet;
  $("tovabb-megoldas-nelkul-f").hidden = !tovabbMehet;
  if (f.csalad === "felmondas") {
    $("valasz-egyenkent").hidden = true;
    $("valasz-felmondas").hidden = false;
    $("bontas-lepes").hidden = true;
    $("szambillentyuzet").hidden = true;
    $("beiro-kijelzo").hidden = true;
    var felKn = felmondKezNelkulE();
    $("mondom-bontas-gomb").style.display = (beszedTamogatott && !felKn) ? "" : "none";
    $("mondom-bontas-gomb").textContent = "🎤 Mondom a bontását";
    $("halld-ujra-f").style.display = beszedTamogatott ? "" : "none";
    if (!beszedTamogatott || mentes.valaszmod === "beiras") { mondd(f.felolvas, function () { bontasLepesNyit(); }); return; }
    if (felKn) { felmondKezNelkulKor(); return; }
  } else {
    $("valasz-felmondas").hidden = true;
    $("valasz-egyenkent").hidden = false;
    renderPottyok(); beiroReset();
    J.kezCsend = 0; J.kezBeiras = false;
    if (kezNelkulE()) { kezNelkulModUI(); kezNelkulKor(); return; }
    modBeallit();
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
    if (J.probak === 1) { $("visszajelzes").textContent = "Nem " + valasz + ". Nézd meg még egyszer!"; mondd("Nem talált. Próbáld újra!", kezNelkulUjra); }
    else { $("visszajelzes").textContent = "✘ " + f.keplet + " = " + f.helyes; mondd(f.tipp, kezNelkulUjra); }
    ment();
  }
}
/* hibás válasz után kézmentes pályán: pittyentés + újra figyelés (máshol no-op) */
function kezNelkulUjra() {
  if (!kezNelkulE()) return;
  beep(1046, 0.1, "sine", 0, 0.16);
  setTimeout(kezNelkulFigyel, 240);
}
/* ═══════════════════════════════════════════════════════════════════════════════
   A „MONDD EL A BONTÁST" FELADAT ELFOGADÁSI SZABÁLYA
   ═══════════════════════════════════════════════════════════════════════════════
   A gép ad egy N számot (1 ≤ N ≤ 10). A gyereknek EGYBEN, EGYFOLYTÁBAN,
   LENTRŐL FÖLFELÉ fel kell mondania N minden bontását:

        0 + N,  1 + (N−1),  2 + (N−2),  … ,  N + 0        →  összesen N+1 sor

   Csak a KIMONDOTT SZÁMOK és a SORRENDJÜK számít. Minden más szó – „meg",
   „plusz", „és", „hozzá", „egyenlő", „az", „lesz", „is", szünet, vessző –
   figyelmen kívül marad (a szamokKinyer() eleve csak a számokat szedi ki).

   EGY SOR elfogadható alakjai (a gyerek szabadon választ, soronként külön):
        „nulla meg öt"              →  csak a két tag              →  [0, 5]
        „nulla meg öt az öt"        →  két tag + kimondott összeg  →  [0, 5, 5]
        „nulla plusz öt egyenlő öt" →  bármilyen kötőszóval        →  [0, 5, 5]
   A kimondott összeg (mindig N) elhagyható, soronként vegyesen is.

   A teljes felmondás AKKOR JÓ, ha a kimondott számlista pontosan ez:
        i = 0 … N-re egymás után:   [ i , N−i ]   és utána OPCIONÁLISAN   [ N ]
   Tehát: egyetlen sor sem hiányozhat, a sorrend kötött (lentről), a két tag
   összege minden sorban N, és nem lóghat ki „idegen" szám.

   Visszatérés: { ok, sorok } – a `sorok` az elejéről hibátlanul elmondott sorok
   száma (ez megy a „Eddig 3 sor jó volt" visszajelzésbe).
   ═══════════════════════════════════════════════════════════════════════════════ */
function bontasFelmondOk(nums, N) {
  var p = 0;
  for (var i = 0; i <= N; i++) {
    // a sor két kötelező tagja, ebben a sorrendben:  i , majd  N−i
    if (nums[p] !== i)     return { ok: false, sorok: i };
    p++;
    if (nums[p] !== N - i) return { ok: false, sorok: i };
    p++;
    // a sor végén OPCIONÁLISAN elhangozhat a kimondott összeg (N):
    if (i < N - 1) {
      // a következő sor első tagja (i+1) biztosan nem N → minden itt álló N csak összeg
      while (nums[p] === N) p++;
    } else if (i === N - 1) {
      // az utolsó előtti sor: a következő sor első tagja épp N, ezért abból
      // az egymást követő N-ekből egyet meg kell hagyni a záró „N + 0" sornak
      var db = 0; while (nums[p + db] === N) db++;
      while (db-- > 1) p++;
    }
  }
  while (nums[p] === N) p++;              // a legutolsó sor kimondott összege
  if (p !== nums.length) return { ok: false, sorok: N };   // idegen szám maradt a végén
  return { ok: true, sorok: N + 1 };
}
function felmondErtekel(altList) {
  var N = J.feladat.N, legjobbSor = 0, siker = false;
  altList.forEach(function (sz) {
    var r = bontasFelmondOk(szamokKinyer(sz), N);
    if (r.ok) siker = true;
    if (r.sorok > legjobbSor) legjobbSor = r.sorok;
  });
  $("hallgat-f").hidden = true;

  if (siker) { felmondSiker(); return; }

  J.probak++;
  var jutott = Math.min(legjobbSor, N);      // hány sort mondott jól a felmondás elejéről
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
      ? ("Eddig jó volt " + jutott + " sor. Mondd el újra az egészet, lentről kezdve!")
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
  /* a piros-kék gyöngyös lista jutalomként jelenik meg (nem a szöveges);
     a gyereknek NEM kell újra felmondania — a Tovább gomb visz tovább */
  $("felmond-lista").hidden = true;
  $("felmond-megvan").hidden = true;
  renderGolyoLista();
  $("pipa-sor").hidden = false;
  $("visszajelzes-f").className = "visszajelzes jo";
  $("visszajelzes-f").textContent = "Kész a bontás!  (+" + jar + " ✨)";
  csillagRepul($("bagoly-buborek"));
  setTimeout(function () { $("jatek-csillampor").textContent = P().csillampor; }, 500);
  J.feladatKesz++; ment();
  /* NEM lépünk tovább magunktól — a Tovább gomb vár a gyerekre. */
  var tg = $("bontas-kesz-gomb");
  tg.textContent = "Tovább →"; tg.className = "nagy-gomb tovabb-kesz"; tg.hidden = false;
  bagolyMondat("Szuper! Kész a bontás! 🌟");
  mondd("Szuper! Kész a bontás!");
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
  hangGomb(); figyelStop();
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
/* ── KÉZMENTES HANG (Tízesek ösvénye): felolvas → pittyentés → magától figyel ── */
function kezNelkulE() {
  return !!(J && J.palya && J.palya.kez_nelkul && beszedTamogatott
    && mentes.valaszmod !== "beiras" && !J.kezBeiras
    && J.feladat && J.feladat.csalad === "egyenkent");
}
function kezNelkulModUI() {
  $("mondom-gomb").style.display = "none";
  $("szambillentyuzet").hidden = true;
  $("beiro-kijelzo").hidden = true;
  $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
  $("beiras-valt").textContent = "⌨ Inkább beírom";
}
function kezNelkulKor() {
  if (!kezNelkulE()) return;
  $("hallgat-e").hidden = true;
  $("visszajelzes").className = "visszajelzes";
  $("visszajelzes").textContent = "";
  mondd(J.feladat.felolvas, function () {
    if (!kezNelkulE()) return;
    beep(1046, 0.12, "sine", 0, 0.18);                 /* „vége a kérdésnek" pittyentés */
    setTimeout(kezNelkulFigyel, 280);
  });
}
function kezNelkulFigyel() {
  if (!kezNelkulE()) return;
  $("hallgat-e").hidden = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelj(function (alt) {
    $("hallgat-e").hidden = true;
    var n = elsoSzam(alt.join(" "));
    if (n == null) { kezNelkulCsend(); return; }
    J.kezCsend = 0;
    ertekel(n);
  }, function (hiba) {
    $("hallgat-e").hidden = true;
    if (hiba === "not-allowed" || hiba === "service-not-allowed" || hiba === "nincs") {
      beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
      $("visszajelzes").className = "visszajelzes";
      $("visszajelzes").textContent = "Most beírással játszunk.";
      J.kezBeiras = true; modBeallit();
      return;
    }
    kezNelkulCsend();
  });
}
function kezNelkulCsend() {
  if (!kezNelkulE()) return;
  J.kezCsend = (J.kezCsend || 0) + 1;
  var f = J.feladat;
  if (J.kezCsend === 1) {
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Halljam a választ! 🎤";
    mondd("Mondd bátran a választ!", function () {
      if (kezNelkulE()) { beep(1046, 0.1, "sine", 0, 0.16); setTimeout(kezNelkulFigyel, 240); }
    });
  } else if (J.kezCsend === 2) {
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Figyelj a kérdésre!";
    mondd(f.felolvas, function () {
      if (kezNelkulE()) { beep(1046, 0.12, "sine", 0, 0.18); setTimeout(kezNelkulFigyel, 280); }
    });
  } else {
    /* 3. csönd → előjön a számbillentyűzet (szégyenmentes kiút) */
    J.kezBeiras = true; J.kezCsend = 0;
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Írd be a választ, ha így könnyebb 🙂";
    $("mondom-gomb").style.display = "none";
    $("szambillentyuzet").hidden = false;
    $("beiro-kijelzo").hidden = false; beiroReset();
    $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
    $("beiras-valt").textContent = "🎤 Inkább mondom";
  }
}
/* ── KÉZMENTES HANG a felmondás-pályán (Erdei bontás): felolvas → pittyentés →
   magától indul az élő hallgatás (bontasEloStart, CSAK a legelső indításnál nulláz).
   Pár-onként: pipa + csilingelés + felszólító pittyegés. Elakadásnál (csend/félrehallás)
   NINCS reset: bontasEloBotlas() megmutatja a soron következő párt és bontasEloFolytat()
   figyel tovább ugyanabból az FB.sor-ból; csak 4× elakadás vagy „Kész vagyok" → beírás. ── */
function felmondKezNelkulE() {
  return !!(J && J.palya && J.palya.kez_nelkul && beszedTamogatott
    && mentes.valaszmod !== "beiras"
    && J.feladat && J.feladat.csalad === "felmondas");
}
function felmondKezNelkulKor() {
  if (!felmondKezNelkulE()) return;
  mondd(J.feladat.felolvas, function () {
    if (!felmondKezNelkulE()) return;
    beep(1046, 0.12, "sine", 0, 0.18);
    setTimeout(function () { if (felmondKezNelkulE()) bontasEloStart(); }, 280);
  });
}
function mikrofonInd() {
  var felm = J.feladat.csalad === "felmondas";
  /* a bontás-felmondás ÉLŐ hallgatással megy: a gomb indít, majd „Kész vagyok"-ként zár */
  if (felm) {
    if (FB.aktiv) bontasEloVege(); else bontasEloStart();
    return;
  }
  var g = $("mondom-gomb");
  var hj = $("hallgat-e");
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
  hangGomb(); figyelStop();
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
  $("bontas-kesz-gomb").addEventListener("click", function () {
    hangGomb(); $("bontas-kesz-gomb").hidden = true; allomasKesz();
  });
  $("halld-ujra").addEventListener("click", function () {
    if (!J || !J.feladat) return;
    if (kezNelkulE()) { figyelStop(); kezNelkulKor(); return; }
    mondd(J.feladat.felolvas);
  });
  $("halld-ujra-f").addEventListener("click", function () { if (J && J.feladat) mondd(J.feladat.felolvas); });
  $("beiras-valt").addEventListener("click", function () {
    hangGomb(); figyelStop();
    if (J && J.kezBeiras) {                 /* kézmentes pályán vissza a hangra */
      J.kezBeiras = false; J.kezCsend = 0;
      $("szambillentyuzet").hidden = true; $("beiro-kijelzo").hidden = true;
      kezNelkulModUI(); kezNelkulKor();
      return;
    }
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
  $("fomenu-odu").addEventListener("click", function () { hangGomb(); oduNyit("fomenu"); });
  $("vege-odu").addEventListener("click", function () { hangGomb(); oduNyit("vege"); });
  $("odu-vissza").addEventListener("click", function () { hangGomb(); renderFomenu(); mutat("kepernyo-fomenu"); });
  $("odu-valto").addEventListener("click", function () { hangGomb(); oduPanelZar(); renderProfil(); mutat("kepernyo-profil"); });
  $("odu-katalogus-nyit").addEventListener("click", function () { hangGomb(); oduPanelNyit(); });
  $("odu-panel-zar").addEventListener("click", function () { hangGomb(); oduPanelZar(); });
}

/* ============ 10b) ODÚ — v0: hazamehető szoba · v1: időjárás-vásárlás ============ */
/* Ez a blokk teljesen additív: a pálya-motor egyetlen függvényét sem hívja/írja át.
   Saját mentés-ág: P().odu. Saját DOM: #kepernyo-odu + .odu-* osztályok. */

var ODU_KAT = {
  napszak: [
    { id: "este",    nev: "Este",           ar: 0 },
    { id: "reggel",  nev: "Reggel",         ar: 40 },
    { id: "del",     nev: "Dél",            ar: 40 },
    { id: "eclipse", nev: "Napfogyatkozás", ar: 120 }
  ],
  ido: [
    { id: "tiszta",     nev: "Tiszta idő", ar: 0 },
    { id: "eso",        nev: "Eső",        ar: 35 },
    { id: "ho",         nev: "Hó",         ar: 45 },
    { id: "szivarvany", nev: "Szivárvány", ar: 60 }
  ]
};
var ODU_FUL = "ido";
var BOLT_VAL = { holmik: null, ido: null };   /* a bolt aktív fülén kiválasztott tétel { g, id } */

/* v2a: unikornis-ruhák (Holmik). Hely → 3 tétel (alap / különleges / ritka). */
var RUHAK = {
  fej:   [{ id: "fej-a", nev: "Virágkoszorú", ar: 20 }, { id: "fej-k", nev: "Csillag-szarvdísz", ar: 60 }, { id: "fej-r", nev: "Hold-korona", ar: 140 }],
  nyak:  [{ id: "nyak-a", nev: "Makk-lánc", ar: 15 }, { id: "nyak-k", nev: "Szív-medál", ar: 50 }, { id: "nyak-r", nev: "Szivárvány-sál", ar: 120 }],
  hat:   [{ id: "hat-a", nev: "Pillekönnyű takaró", ar: 30 }, { id: "hat-k", nev: "Hímzett nyeregtakaró", ar: 80 }, { id: "hat-r", nev: "Csillagköpeny", ar: 180 }],
  lab:   [{ id: "lab-a", nev: "Fűzöld bokapánt", ar: 20 }, { id: "lab-k", nev: "Ezüst patkó", ar: 70 }, { id: "lab-r", nev: "Kristály-patkó", ar: 160 }],
  oldal: [{ id: "oldal-a", nev: "Levél-szárny", ar: 40 }, { id: "oldal-k", nev: "Pillangó-szárny", ar: 110 }, { id: "oldal-r", nev: "Fény-szárny", ar: 220 }],
  farok: [{ id: "farok-a", nev: "Szalagcsokor", ar: 15 }, { id: "farok-k", nev: "Csengettyűs farokdísz", ar: 55 }, { id: "farok-r", nev: "Üstökös-farok", ar: 130 }]
};
var RUHA_HELY = [
  { kulcs: "fej", nev: "Fej" }, { kulcs: "nyak", nev: "Nyak" }, { kulcs: "hat", nev: "Hát" },
  { kulcs: "lab", nev: "Láb" }, { kulcs: "oldal", nev: "Oldal (szárny)" }, { kulcs: "farok", nev: "Farok" }
];

/* --- az ablakon át látszó ég egy W×H dobozban (bal-felső sarok = 0,0) --- */
function oduEgSVG(napszak, W, H) {
  var w = W, h = H, s = "";
  function savok(y, c) { return '<rect x="0" y="' + y.toFixed(1) + '" width="' + w + '" height="' + (h - y).toFixed(1) + '" fill="' + c + '"/>'; }
  if (napszak === "reggel") {
    s += savok(0, "#ffd3e4") + savok(h * 0.55, "#ffe6cf");
    s += '<circle cx="' + (w * 0.72) + '" cy="' + (h * 0.66) + '" r="' + (h * 0.3) + '" fill="#ffe6c2" opacity="0.5"/>';
    s += '<circle cx="' + (w * 0.72) + '" cy="' + (h * 0.66) + '" r="' + (h * 0.16) + '" fill="#ffd39a"/>';
    s += '<ellipse cx="' + (w * 0.3) + '" cy="' + (h * 0.28) + '" rx="' + (w * 0.2) + '" ry="' + (h * 0.09) + '" fill="#fff6ea" opacity="0.85"/>';
  } else if (napszak === "del") {
    s += savok(0, "#a9d4f2") + savok(h * 0.5, "#cbe8fa");
    var cx = w * 0.74, cy = h * 0.3;
    s += '<g stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0.8">';
    for (var i = 0; i < 8; i++) { var a = Math.PI / 4 * i; s += '<line x1="' + (cx + Math.cos(a) * h * 0.2).toFixed(1) + '" y1="' + (cy + Math.sin(a) * h * 0.2).toFixed(1) + '" x2="' + (cx + Math.cos(a) * h * 0.32).toFixed(1) + '" y2="' + (cy + Math.sin(a) * h * 0.32).toFixed(1) + '"/>'; }
    s += '</g><circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (h * 0.16) + '" fill="#ffe08a"/>';
    s += '<ellipse cx="' + (w * 0.32) + '" cy="' + (h * 0.62) + '" rx="' + (w * 0.22) + '" ry="' + (h * 0.1) + '" fill="#ffffff" opacity="0.9"/>';
  } else if (napszak === "eclipse") {
    s += savok(0, "#1b1a33");
    var ex = w * 0.6, ey = h * 0.42, er = h * 0.2;
    s += '<circle cx="' + ex + '" cy="' + ey + '" r="' + (er * 1.7) + '" fill="#ffe9ad" opacity="0.32"/>';
    s += '<circle cx="' + ex + '" cy="' + ey + '" r="' + (er * 1.22) + '" fill="#ffd36b" opacity="0.5"/>';
    s += '<circle cx="' + ex + '" cy="' + ey + '" r="' + er + '" fill="#141328"/>';
    s += '<g fill="#fff2c4" opacity="0.8">';
    [[0.2, 0.2], [0.85, 0.7], [0.3, 0.82], [0.72, 0.16], [0.5, 0.62]].forEach(function (p) { s += '<circle cx="' + (w * p[0]).toFixed(1) + '" cy="' + (h * p[1]).toFixed(1) + '" r="1.6"/>'; });
    s += '</g>';
  } else { /* este */
    s += savok(0, "#2f3b74") + savok(h * 0.62, "#4a5596");
    s += '<circle cx="' + (w * 0.68) + '" cy="' + (h * 0.26) + '" r="' + (h * 0.15) + '" fill="#fdf0d0"/>';
    s += '<circle cx="' + (w * 0.62) + '" cy="' + (h * 0.22) + '" r="' + (h * 0.13) + '" fill="#2f3b74"/>';
    s += '<g fill="#fff6d8" opacity="0.9">';
    [[0.2, 0.28], [0.4, 0.16], [0.52, 0.5], [0.3, 0.66], [0.82, 0.56], [0.15, 0.52]].forEach(function (p) { s += '<circle cx="' + (w * p[0]).toFixed(1) + '" cy="' + (h * p[1]).toFixed(1) + '" r="1.7"/>'; });
    s += '</g>';
  }
  return s;
}

/* --- időjárás-réteg egy W×H dobozban --- */
function oduIdoSVG(ido, W, H, db) {
  var w = W, s = "";
  if (ido === "eso") {
    var n = db || 16;
    for (var i = 0; i < n; i++) {
      var x = ((i + 0.5) / n * w + (i % 3) * 4);
      s += '<line class="eso-csepp" x1="' + x.toFixed(1) + '" y1="' + (-(i % 4) * 10) + '" x2="' + (x - 5).toFixed(1) + '" y2="' + (10 - (i % 4) * 10) + '" stroke="#bfe0f5" stroke-width="2.4" stroke-linecap="round" opacity="0.85" style="animation-delay:-' + ((i % 7) * 0.11).toFixed(2) + 's"/>';
    }
  } else if (ido === "ho") {
    var m = db || 16;
    for (var j = 0; j < m; j++) {
      var x2 = ((j + 0.5) / m * w + (j % 2) * 6);
      s += '<circle class="ho-pihe" cx="' + x2.toFixed(1) + '" cy="' + (-(j % 5) * 12) + '" r="' + (2 + (j % 3)) + '" fill="#ffffff" opacity="0.9" style="animation-delay:-' + ((j % 9) * 0.4).toFixed(2) + 's"/>';
    }
  } else if (ido === "szivarvany") {
    var rcx = w * 0.5, rcy = H * 1.02, rr = H * 0.92;
    var szin = ["#f6a5c0", "#f7c59f", "#fce49a", "#a7d99a", "#9ec9f0", "#c3a5e0"];
    for (var k = 0; k < szin.length; k++) {
      var r = rr - k * (H * 0.05);
      s += '<path d="M ' + (rcx - r).toFixed(1) + ' ' + rcy.toFixed(1) + ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (rcx + r).toFixed(1) + ' ' + rcy.toFixed(1) + '" fill="none" stroke="' + szin[k] + '" stroke-width="' + (H * 0.045).toFixed(1) + '" opacity="0.7"/>';
    }
  }
  return s;
}

/* --- kis mesebolt-stand a szobában (a katalógus/bolt megnyitója) --- */
function boltStandSVG(cx, cy) {
  var s = '<g transform="translate(' + cx + ',' + cy + ')">';
  s += '<ellipse cx="0" cy="16" rx="42" ry="9" fill="#3b2f66" opacity="0.16"/>';
  /* oszlopok */
  s += '<rect x="-34" y="-42" width="6" height="52" rx="2" fill="#b79fd4"/><rect x="28" y="-42" width="6" height="52" rx="2" fill="#b79fd4"/>';
  /* pult */
  s += '<rect x="-38" y="-6" width="76" height="20" rx="4" fill="#d9b8d6"/><rect x="-42" y="-12" width="84" height="8" rx="3" fill="#c9a8e6"/>';
  s += '<g stroke-width="2.4" stroke-linecap="round"><path d="M-32 2 h64" stroke="#f7b8d0"/><path d="M-32 7 h64" stroke="#fbe0a0"/></g>';
  /* ponyva – csipkés cukorcsík */
  s += '<path d="M-44 -42 Q0 -52 44 -42 L44 -36 L-44 -36 Z" fill="#e79ac0"/>';
  var pc = ["#f6a5c0", "#fdf0d0"];
  for (var i = 0; i < 7; i++) { var x = -42 + i * 12; s += '<path d="M' + x + ' -36 q6 8 12 0 Z" fill="' + pc[i % 2] + '"/>'; }
  /* csillag-cégér */
  s += '<line x1="0" y1="-42" x2="0" y2="-54" stroke="#8f7ab8" stroke-width="2"/>';
  s += '<g stroke="#a88fce" stroke-width="1.4" stroke-linejoin="round">' + csillagSVG(0, -58, 7, "#ffd878") + '</g>';
  /* portéka a pulton */
  s += csillagSVG(-22, -12, 4.5, "#fff6d8");
  s += '<circle cx="-6" cy="-10" r="5" fill="#9ec9f0"/>';
  s += '<rect x="4" y="-16" width="12" height="12" rx="2" fill="#a7d99a"/><path d="M10 -16 v12 M4 -10 h12" stroke="#fff" stroke-width="1.6"/>';
  s += '<rect x="22" y="-14" width="7" height="12" rx="2" fill="#f7b8d0"/>';
  /* csillámok – „nyomj rám" */
  s += '<g class="odu-bolt-szikra" fill="#fff2c4">' + csillagSVG(-40, -20, 2.6, "#fff2c4") + csillagSVG(42, -14, 2.2, "#fff2c4") + '</g>';
  return s + '</g>';
}

/* --- a teljes Csillagbolt háttér (680×540) — a bolt.svg mintájára --- */
function oduBoltSVG() {
  var s = '<svg viewBox="0 0 680 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">';
  s += '<rect x="0" y="0" width="680" height="540" fill="#2e2350"/>';
  s += '<path d="M30 540 L30 230 Q30 80 340 60 Q650 80 650 230 L650 540 Z" fill="#b79fd4"/>';
  s += '<path d="M75 540 L75 245 Q75 110 340 92 Q605 110 605 245 L605 540 Z" fill="#cbb6e6"/>';
  s += '<ellipse cx="340" cy="300" rx="300" ry="240" fill="#ffd9ec" opacity="0.05"/><ellipse cx="340" cy="360" rx="260" ry="150" fill="#e9c9f0" opacity="0.08"/>';
  /* sarok-csillagok */
  s += '<g fill="#d9c7ec">' + csillagSVG(150, 112, 4, "#d9c7ec") + csillagSVG(232, 124, 4, "#d9c7ec") + csillagSVG(452, 122, 4, "#d9c7ec") + csillagSVG(540, 112, 4, "#d9c7ec") + '</g>';
  /* zászlófüzér */
  s += '<path d="M100 108 Q340 140 580 108" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  var zc = ["#f6a5c0", "#a7d99a", "#fce49a", "#c3a5e0", "#9ec9f0", "#f6a5c0", "#a7d99a"];
  var zy = [121, 123, 124, 123, 121, 118, 114];
  for (var z = 0; z < 7; z++) { var zx = 236 + z * 48; s += '<path d="M' + zx + ' ' + zy[z] + ' l16 0 l-8 12 Z" fill="' + zc[z] + '"/>'; }
  /* „csillagbolt" cégér */
  s += '<line x1="300" y1="78" x2="305" y2="66" stroke="#8f7ab8" stroke-width="2"/><line x1="380" y1="78" x2="375" y2="66" stroke="#8f7ab8" stroke-width="2"/>';
  s += '<circle cx="305" cy="65" r="2.5" fill="#8f7ab8"/><circle cx="375" cy="65" r="2.5" fill="#8f7ab8"/>';
  s += '<rect x="272" y="74" width="136" height="38" rx="9" fill="#a88fce" stroke="#8f7ab8" stroke-width="1.6"/>';
  s += csillagSVG(288, 93, 6, "#fdf0d0") + csillagSVG(392, 93, 6, "#fdf0d0");
  s += '<text x="340" y="99" font-family="Fredoka,\'Comic Sans MS\',sans-serif" font-size="17" font-weight="700" fill="#fdf0d0" text-anchor="middle">Csillagbolt</text>';
  /* 4-polcos szekrény: fejléc-táblák + oszlopok + polc-lécek (halványan, hogy a kártyák uralják) */
  var lab = [["holmik", 150], ["kinézet", 280], ["kellékek", 410], ["időjárás", 540]];
  s += '<g opacity="0.62">';
  s += '<g stroke="#ab90cf" stroke-width="1">';
  [[90, "#d3c0ea"], [220, "#cdbce6"], [350, "#d3c0ea"], [480, "#cdbce6"]].forEach(function (c) { s += '<rect x="' + c[0] + '" y="168" width="120" height="204" fill="' + c[1] + '"/>'; });
  s += '</g>';
  s += '<g fill="#b79fd4">';
  [93, 223, 353, 483].forEach(function (x) { [236, 303, 356].forEach(function (y) { s += '<rect x="' + x + '" y="' + y + '" width="114" height="5"/>'; }); s += '<rect x="' + x + '" y="368" width="114" height="6"/>'; });
  s += '</g>';
  [98, 228, 358, 488].forEach(function (x) { s += '<rect x="' + x + '" y="150" width="104" height="18" rx="4" fill="#a88fce"/>'; });
  lab.forEach(function (l) { s += '<text x="' + l[1] + '" y="163" font-family="Fredoka,sans-serif" font-size="12" fill="#fdf0d0" text-anchor="middle">' + l[0] + '</text>'; });
  s += '</g>';
  /* padló + szivárvány-szőnyeg */
  s += '<rect x="0" y="430" width="680" height="110" fill="#e3c9de"/>';
  s += '<g stroke="#cdaecb" stroke-width="2" opacity="0.55"><line x1="0" y1="470" x2="680" y2="470"/><line x1="0" y1="505" x2="680" y2="505"/><line x1="150" y1="430" x2="150" y2="540"/><line x1="340" y1="430" x2="340" y2="540"/><line x1="530" y1="430" x2="530" y2="540"/></g>';
  s += '<ellipse cx="340" cy="502" rx="152" ry="28" fill="#f6a5c0"/><ellipse cx="340" cy="502" rx="110" ry="20" fill="#f7c59f"/><ellipse cx="340" cy="502" rx="64" ry="11" fill="#a7d99a"/>';
  /* pult árcédulákkal */
  s += '<ellipse cx="340" cy="474" rx="292" ry="15" fill="#3b2f66" opacity="0.16"/>';
  s += '<rect x="60" y="414" width="560" height="58" fill="#c197bf"/><rect x="52" y="404" width="576" height="12" rx="3" fill="#d9b8d6"/><rect x="60" y="416" width="560" height="7" fill="#b48fd6"/>';
  s += '<g fill="none" stroke="#d9b8d6" stroke-width="2"><rect x="120" y="430" width="96" height="28" rx="3"/><rect x="300" y="430" width="96" height="28" rx="3"/><rect x="470" y="430" width="96" height="28" rx="3"/></g>';
  s += '<g fill="#d9b8d6">' + csillagSVG(168, 444, 4, "#d9b8d6") + csillagSVG(348, 444, 4, "#d9b8d6") + csillagSVG(518, 444, 4, "#d9b8d6") + '</g>';
  /* csengő */
  s += '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><path d="M84 404 q0 -20 17 -20 q17 0 17 20 Z" fill="#e6c34d"/><rect x="78" y="402" width="46" height="6" rx="3" fill="#c9a24d"/><circle cx="101" cy="380" r="3.6" fill="#fff6d8"/></g>';
  /* csillag-pénztárgép */
  s += '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><rect x="470" y="388" width="46" height="24" rx="4" fill="#b79fd4"/><g stroke="#cbb6e6" stroke-width="2.6"><path d="M478 398 l5 5"/><path d="M491 398 l5 5"/><path d="M504 398 l5 5"/></g></g>' + csillagSVG(493, 374, 8, "#ffd24d");
  /* cserepes növény */
  s += '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><rect x="590" y="392" width="26" height="20" rx="3" fill="#c197bf"/><rect x="586" y="386" width="34" height="8" rx="2" fill="#d9b8d6"/>';
  s += '<path d="M603 386 q-11 -16 -5 -32 q11 12 7 32 Z" fill="#a7d99a"/><path d="M603 386 q0 -20 0 -32 q9 14 5 32 Z" fill="#8cc47c"/><path d="M603 386 q11 -16 5 -32 q-11 12 -7 32 Z" fill="#a7d99a"/></g>';
  /* csillámok */
  s += '<g fill="#fff2c4" opacity="0.7">' + csillagSVG(64, 220, 4, "#fff2c4") + csillagSVG(618, 250, 4, "#fff2c4") + csillagSVG(340, 200, 3, "#fff2c4") + csillagSVG(120, 130, 2.6, "#fff2c4") + '</g>';
  s += '</svg>';
  return s;
}

/* --- a teljes odú-szoba (680×540) — az odu-belso.svg mintájára --- */
function oduSVG(lenyKulcs, o) {
  var c = LENYEK[lenyKulcs];
  var WX = 190, WY = 180, WR = 64;                  /* ablak: bal-felső, holddal */
  var tint = { este: ["#2b2a5a", 0.14], reggel: ["#ffd0e0", 0.08], del: ["#fff3d0", 0.04], eclipse: ["#0a0a1e", 0.22] }[o.napszak] || ["#2b2a5a", 0.14];

  var s = '<svg viewBox="0 0 680 540" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs><clipPath id="odu-ablak"><circle cx="' + WX + '" cy="' + WY + '" r="' + (WR - 10) + '"/></clipPath></defs>';

  /* fa kívül + fal + meleg alapfény */
  s += '<rect x="0" y="0" width="680" height="540" fill="#2e2350"/>';
  s += '<path d="M30 540 L30 230 Q30 80 340 60 Q650 80 650 230 L650 540 Z" fill="#b79fd4"/>';
  s += '<path d="M75 540 L75 245 Q75 110 340 92 Q605 110 605 245 L605 540 Z" fill="#cbb6e6"/>';
  s += '<ellipse cx="345" cy="330" rx="250" ry="210" fill="#ffd9ec" opacity="0.06"/><ellipse cx="140" cy="392" rx="120" ry="100" fill="#e9c9f0" opacity="0.1"/>';

  /* gyökér-erezet a falon */
  s += '<g fill="none" stroke="#ab90cf" stroke-width="3" stroke-linecap="round" opacity="0.5">';
  s += '<path d="M150 250 Q160 360 150 500"/><path d="M245 240 Q255 360 248 500"/><path d="M440 240 Q432 360 440 500"/><path d="M525 250 Q516 360 525 500"/></g>';
  s += '<ellipse cx="437" cy="300" rx="9" ry="5" fill="#ab90cf"/>';

  /* padló */
  s += '<rect x="75" y="436" width="530" height="104" fill="#e3c9de"/>';
  s += '<g stroke="#cdaecb" stroke-width="2" opacity="0.6"><line x1="75" y1="464" x2="605" y2="464"/><line x1="75" y1="494" x2="605" y2="494"/><line x1="75" y1="520" x2="605" y2="520"/><line x1="200" y1="436" x2="200" y2="540"/><line x1="345" y1="436" x2="345" y2="540"/><line x1="470" y1="436" x2="470" y2="540"/></g>';

  /* zászlófüzér */
  s += '<path d="M100 112 Q340 150 580 112" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  var zsz = ["#f6a5c0", "#a7d99a", "#fce49a", "#c3a5e0", "#9ec9f0", "#f6a5c0", "#a7d99a"];
  var zY = [128, 130, 131, 130, 128, 124, 119];
  for (var z = 0; z < zsz.length; z++) { var zx = 236 + z * 48; s += '<path d="M' + zx + ' ' + zY[z] + ' l16 0 l-8 14 Z" fill="' + zsz[z] + '"/>'; }

  /* keretezett szivárvány-kép a falon */
  s += '<rect x="262" y="150" width="60" height="48" rx="3" fill="#a88fce"/><rect x="268" y="156" width="48" height="36" fill="#4a3b7a"/>';
  s += '<path d="M268 188 A26 26 0 0 1 316 188" stroke="#f6a5c0" stroke-width="4" fill="none"/><path d="M274 188 A20 20 0 0 1 310 188" stroke="#fce49a" stroke-width="4" fill="none"/><path d="M280 188 A14 14 0 0 1 304 188" stroke="#a7d99a" stroke-width="4" fill="none"/><circle cx="292" cy="188" r="4" fill="#fdf0d0"/>';

  /* mennyezeti csillag-lámpa */
  s += '<line x1="345" y1="112" x2="345" y2="154" stroke="#8f7ab8" stroke-width="3"/><circle cx="345" cy="150" r="4" fill="none" stroke="#8f7ab8" stroke-width="3"/>';
  s += '<ellipse cx="345" cy="178" rx="40" ry="36" fill="#ffe9ad" opacity="0.16"/><ellipse cx="345" cy="178" rx="22" ry="20" fill="#ffe9ad" opacity="0.22"/>';
  s += '<polygon points="345,154 350,169 366,169 354,179 358,194 345,185 332,194 336,179 324,169 340,169" fill="#ffd878" stroke="#a88fce" stroke-width="3" stroke-linejoin="round"/>';

  /* ── ABLAK (napszak + időjárás) ── */
  s += '<circle cx="' + WX + '" cy="' + WY + '" r="' + WR + '" fill="#a88fce"/>';
  s += '<g clip-path="url(#odu-ablak)"><g transform="translate(' + (WX - 60) + ',' + (WY - 60) + ')">';
  s += oduEgSVG(o.napszak, 120, 120);
  s += oduIdoSVG(o.ido, 120, 120, 7);
  s += '</g></g>';
  s += '<ellipse cx="168" cy="206" rx="16" ry="7" fill="#cbb6e6"/><circle cx="160" cy="204" r="6" fill="#cbb6e6"/><circle cx="176" cy="203" r="7" fill="#cbb6e6"/>';
  s += '<line x1="190" y1="126" x2="190" y2="234" stroke="#a88fce" stroke-width="6"/><line x1="136" y1="180" x2="244" y2="180" stroke="#a88fce" stroke-width="6"/>';

  /* ── FELHŐ-ÁGY (bal) ── */
  s += '<g stroke-linecap="round" fill="none" stroke-width="10">';
  var bx = [13, 22, 31, 40, 49, 58], br = [97, 88, 79, 70, 61, 52], bc = ["#f6a5c0", "#f7c59f", "#fce49a", "#a7d99a", "#9ec9f0", "#c3a5e0"];
  for (var b = 0; b < 6; b++) { s += '<path d="M' + bx[b] + ' 432 A' + br[b] + ' ' + br[b] + ' 0 0 1 ' + (bx[b] + br[b] * 2) + ' 432" stroke="' + bc[b] + '"/>'; }
  s += '</g>';
  s += '<ellipse cx="160" cy="452" rx="98" ry="11" fill="#3b2f66" opacity="0.18"/>';
  s += '<path d="M84 408 Q70 358 62 300 Q80 356 102 402 Z" fill="#fdf0d0"/>';
  s += '<g stroke="#f0c98a" stroke-width="3" fill="none" stroke-linecap="round"><path d="M78 396 Q90 392 98 399"/><path d="M74 374 Q85 370 93 376"/><path d="M71 352 Q81 349 88 354"/><path d="M68 332 Q76 330 82 334"/></g><circle cx="62" cy="300" r="3" fill="#fff6d8"/>';
  s += '<rect x="80" y="422" width="166" height="22" rx="9" fill="#c9a8e6"/><rect x="88" y="444" width="14" height="11" rx="3" fill="#b48fd6"/><rect x="226" y="444" width="14" height="11" rx="3" fill="#b48fd6"/>';
  s += '<rect x="84" y="404" width="156" height="26" rx="13" fill="#fdfdfd"/><circle cx="102" cy="404" r="20" fill="#fdfdfd"/><circle cx="134" cy="398" r="24" fill="#fdfdfd"/><circle cx="172" cy="398" r="24" fill="#fdfdfd"/><circle cx="206" cy="403" r="20" fill="#fdfdfd"/><circle cx="228" cy="409" r="15" fill="#fdfdfd"/>';
  s += '<path d="M88 424 Q160 434 236 424" stroke="#e9ddf3" stroke-width="4" fill="none"/>';
  s += '<path d="M150 404 h92 v20 a12 12 0 0 1 -12 12 h-68 a12 12 0 0 1 -12 -12 Z" fill="#d7c4ee"/>';
  s += '<g stroke-width="3" stroke-linecap="round"><path d="M154 420 h84" stroke="#f7b8d0"/><path d="M156 426 h80" stroke="#fbe0a0"/><path d="M160 432 h72" stroke="#a7d99a"/></g>';
  s += '<polygon points="122,372 128,388 145,389 131,399 136,415 122,406 108,415 113,399 99,389 116,388" fill="#f7b8d0" stroke="#e79ac0" stroke-width="2"/>';
  s += '<path d="M114 394 q3 3 6 0 M124 394 q3 3 6 0" stroke="#b56b93" stroke-width="2" fill="none"/><circle cx="112" cy="399" r="2.5" fill="#f59ab8"/><circle cx="131" cy="399" r="2.5" fill="#f59ab8"/>';

  /* ── GYÖKÉRPOLC (jobb-közép) ── */
  s += '<rect x="398" y="296" width="150" height="12" rx="4" fill="#cbb6e6"/>';
  s += '<path d="M410 308 q-8 18 6 30 l6 -4 q-10 -12 -4 -26 Z" fill="#ab90cf"/><path d="M536 308 q8 18 -6 30 l-6 -4 q10 -12 4 -26 Z" fill="#ab90cf"/>';
  s += '<rect x="410" y="262" width="12" height="34" rx="2" fill="#f6a5c0"/><rect x="424" y="258" width="12" height="38" rx="2" fill="#9ec9f0"/><rect x="438" y="264" width="12" height="32" rx="2" fill="#a7d99a"/>';
  s += '<ellipse cx="470" cy="286" rx="8" ry="10" fill="#fce4b8"/><path d="M462 283 a8 6 0 0 1 16 0 Z" fill="#c9a8e6"/><line x1="470" y1="275" x2="470" y2="270" stroke="#c9a8e6" stroke-width="2"/>';
  s += '<rect x="494" y="262" width="30" height="8" rx="3" fill="#b79fd4"/><rect x="496" y="268" width="26" height="28" rx="6" fill="#e9ddf3"/><rect x="500" y="279" width="18" height="14" rx="3" fill="#a7d99a"/>';
  s += '<rect x="526" y="262" width="30" height="8" rx="3" fill="#b79fd4"/><rect x="528" y="268" width="26" height="28" rx="6" fill="#e9ddf3"/><rect x="532" y="279" width="18" height="14" rx="3" fill="#f7b8d0"/>';

  /* ── KÁLYHA (jobb) ── */
  s += '<ellipse cx="542" cy="432" rx="72" ry="52" fill="#ffb3d6" opacity="0.12"/>';
  s += '<rect x="505" y="360" width="95" height="78" rx="14" fill="#d9b8d6"/><rect x="498" y="350" width="110" height="12" rx="4" fill="#c9a8e6"/>';
  s += '<rect x="560" y="300" width="16" height="60" rx="4" fill="#b79fd4"/><circle cx="568" cy="292" r="7" fill="#fdfdfd"/><circle cx="561" cy="278" r="6" fill="#fdfdfd"/><circle cx="571" cy="266" r="5" fill="#fdfdfd"/>';
  s += '<path d="M520 438 v-30 a22 22 0 0 1 44 0 v30 Z" fill="#4a3b7a"/><ellipse cx="542" cy="437" rx="18" ry="5" fill="#ffd0a8"/>';
  s += '<path d="M528 436 q6 -26 14 -32 q4 12 10 14 q6 -6 6 -18 q14 16 10 36 Z" fill="#f7a8c8"/><path d="M533 436 q5 -18 10 -22 q3 8 7 10 q3 -4 3 -12 q9 12 6 24 Z" fill="#ffc59f"/><path d="M538 436 q3 -12 6 -14 q2 6 5 7 q1 -3 1 -8 q6 9 3 15 Z" fill="#fce49a"/>';
  s += '<rect x="512" y="434" width="18" height="10" rx="3" fill="#b79fd4"/><rect x="574" y="434" width="18" height="10" rx="3" fill="#b79fd4"/>';

  /* ── KEREK ASZTAL csillag-befőttel (jobbra tolva, hogy az unikornis elférjen) ── */
  s += '<g transform="translate(115,0)">';
  s += '<ellipse cx="345" cy="458" rx="34" ry="9" fill="#3b2f66" opacity="0.2"/>';
  s += '<ellipse cx="345" cy="380" rx="46" ry="42" fill="#ffe9ad" opacity="0.18"/><ellipse cx="345" cy="378" rx="26" ry="24" fill="#ffe9ad" opacity="0.24"/>';
  s += '<ellipse cx="345" cy="404" rx="72" ry="20" fill="#d9b8d6"/><ellipse cx="345" cy="404" rx="72" ry="20" fill="none" stroke="#c197bf" stroke-width="3"/>';
  s += '<rect x="290" y="404" width="110" height="10" fill="#c197bf"/><rect x="336" y="414" width="18" height="40" fill="#c197bf"/>';
  s += '<rect x="328" y="394" width="34" height="8" rx="2" fill="#b79fd4"/><path d="M330 396 v-20 a15 15 0 0 1 30 0 v20 Z" fill="#e9ddf3" opacity="0.9"/><rect x="338" y="352" width="14" height="9" rx="2" fill="#b79fd4"/>';
  s += '<circle cx="345" cy="376" r="8" fill="#ffe9ad" opacity="0.6"/><polygon points="345,366 347,373 355,373 349,377 351,384 345,380 339,384 341,377 335,373 343,373" fill="#fff6d8"/>';
  s += '</g>';

  /* ── GOMBA (bal-közép) ── */
  s += '<ellipse cx="286" cy="452" rx="26" ry="7" fill="#3b2f66" opacity="0.2"/><rect x="278" y="428" width="16" height="24" rx="7" fill="#fdf0d0"/><path d="M262 430 a24 15 0 0 1 48 0 Z" fill="#f6a5c0"/>';
  s += '<circle cx="278" cy="424" r="3.5" fill="#ffffff"/><circle cx="298" cy="426" r="3" fill="#ffffff"/><circle cx="288" cy="418" r="2.5" fill="#ffffff"/>';

  /* ── SZIVÁRVÁNY-SZŐNYEG ── */
  s += '<ellipse cx="340" cy="488" rx="168" ry="47" fill="#f6a5c0"/><ellipse cx="340" cy="488" rx="122" ry="34" fill="#f7c59f"/><ellipse cx="340" cy="488" rx="78" ry="21" fill="#a7d99a"/><ellipse cx="340" cy="488" rx="34" ry="9" fill="#9ec9f0"/>';

  /* ── AZ UNIKORNIS a szőnyegen ── */
  s += '<ellipse cx="348" cy="492" rx="56" ry="13" fill="#3b2f66" opacity="0.16"/>';
  s += '<g transform="translate(346,492) scale(1.28)">' + unikornisSVG("odu-uni", c, 1, P().oltozet) + '</g>';

  /* mennyezeti csillámok */
  s += '<g fill="#fff2c4" opacity="0.7"><path d="M330 250 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><path d="M410 232 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><circle cx="360" cy="205" r="2"/><circle cx="300" cy="240" r="1.6"/><circle cx="470" cy="210" r="1.8"/><path d="M505 232 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z"/></g>';

  /* eső / hó a szobában is (halványabban) */
  if (o.ido === "eso" || o.ido === "ho") { s += '<g opacity="0.5" pointer-events="none">' + oduIdoSVG(o.ido, 680, 470, o.ido === "ho" ? 30 : 24) + '</g>'; }

  /* hangulatfény */
  s += '<rect x="0" y="0" width="680" height="540" fill="' + tint[0] + '" opacity="' + tint[1] + '" pointer-events="none"/>';

  /* ── MESEBOLT-STAND a szőnyegtől jobbra — MINDIG legfelül, hogy biztosan kattintható legyen ── */
  s += '<g id="odu-bolt-jel"><rect x="508" y="444" width="96" height="84" fill="transparent"/>' + boltStandSVG(556, 506) + '</g>';

  s += '</svg>';
  return s;
}

/* --- vezérlés --- */
function oduNyit(honnan) {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  oduPanelZar();
  renderOdu();
  mutat("kepernyo-odu");
}
function renderOdu() {
  var o = P().odu;
  $("odu-csillampor").textContent = P().csillampor;
  $("odu-szoba").innerHTML = oduSVG(mentes.leny, o);
  var bolt = document.getElementById("odu-bolt-jel");     /* a szoba-SVG minden rajzoláskor újraépül */
  if (bolt) {
    bolt.style.cursor = "pointer";
    bolt.addEventListener("click", function () { hangGomb(); oduPanelNyit(); });
  }
}
function oduPanelNyit() { ODU_FUL = "ido"; renderOduPanel(); $("odu-panel").hidden = false; }
function oduPanelZar() { $("odu-panel").hidden = true; }
function renderOduPanel() {
  var bf = $("odu-bolt-hatter"); if (bf && !bf.innerHTML) bf.innerHTML = oduBoltSVG();
  var fbox = $("odu-fulek"); fbox.innerHTML = "";
  [
    { id: "holmik", nev: "👗 Holmik" }, { id: "kinezet", nev: "💫 Kinézet", zar: true },
    { id: "kellekek", nev: "🪑 Kellékek", zar: true }, { id: "ido", nev: "🌦 Időjárás" }
  ].forEach(function (f) {
    var d = el("div", "odu-ful" + (f.id === ODU_FUL ? " aktiv" : "") + (f.zar ? " zar" : ""), f.nev);
    d.addEventListener("click", function () {
      if (f.zar) { bagolyMondat("Ez a polc hamarosan nyílik! 🌱"); return; }
      ODU_FUL = f.id; renderOduPanel();
    });
    fbox.appendChild(d);
  });
  var box = $("odu-panel-tartalom"); box.innerHTML = "";
  var polcok = el("div", "bolt-polcok"), lap = el("div", "bolt-adatlap");
  box.appendChild(polcok); box.appendChild(lap);
  boltPolcokRajzol(polcok);
  boltAdatlapRajzol(lap);
}

/* ── a bolt polcos böngészője (Holmik / Időjárás) ── */
/* egy fül tétel-csoportjai: [{ kulcs, nev, fajta, tetelek:[...] }] */
function boltCsoportok() {
  if (ODU_FUL === "holmik")
    return RUHA_HELY.map(function (h) { return { kulcs: h.kulcs, nev: h.nev, fajta: "ruha", tetelek: RUHAK[h.kulcs] || [] }; });
  if (ODU_FUL === "ido")
    return [
      { kulcs: "napszak", nev: "Napszak", fajta: "ido", tetelek: ODU_KAT.napszak },
      { kulcs: "ido", nev: "Időjárás", fajta: "ido", tetelek: ODU_KAT.ido }
    ];
  return [];
}
function boltBirt(cs, t) {
  return cs.fajta === "ruha" ? !!P().oltozet.van[t.id] : !!P().odu.van[cs.kulcs][t.id];
}
function boltAktiv(cs, t) {
  return cs.fajta === "ruha" ? (P().oltozet[cs.kulcs] === t.id) : (P().odu[cs.kulcs] === t.id);
}
/* a kiválasztott tétel érvényesítése / alapértelmezése az aktív fülön */
function boltKivalasztott() {
  var csk = boltCsoportok(), sel = BOLT_VAL[ODU_FUL], i, j;
  if (sel) for (i = 0; i < csk.length; i++) if (csk[i].kulcs === sel.g)
    for (j = 0; j < csk[i].tetelek.length; j++) if (csk[i].tetelek[j].id === sel.id)
      return { cs: csk[i], t: csk[i].tetelek[j], rang: j };
  if (csk[0] && csk[0].tetelek[0]) {
    BOLT_VAL[ODU_FUL] = { g: csk[0].kulcs, id: csk[0].tetelek[0].id };
    return { cs: csk[0], t: csk[0].tetelek[0], rang: 0 };
  }
  return null;
}
function boltValaszt(gk, id) { BOLT_VAL[ODU_FUL] = { g: gk, id: id }; hangGomb(); renderOduPanel(); }

function boltPolcokRajzol(host) {
  host.innerHTML = "";
  var sel = BOLT_VAL[ODU_FUL];
  boltCsoportok().forEach(function (cs) {
    var polc = el("div", "bolt-polc");
    polc.appendChild(el("div", "bolt-polc-cim", cs.nev));
    var lec = el("div", "bolt-lec");
    cs.tetelek.forEach(function (t) {
      var birt = boltBirt(cs, t), aktiv = boltAktiv(cs, t), kival = sel && sel.g === cs.kulcs && sel.id === t.id;
      var slot = el("button", "bolt-slot" + (cs.kulcs === "oldal" ? " nagy" : "") + (birt ? " van" : "") + (aktiv ? " visel" : "") + (kival ? " valasztott" : ""));
      var kep = el("div", "bolt-slot-kep"); kep.innerHTML = boltThumb(cs, t);
      slot.appendChild(kep);
      slot.appendChild(el("div", "bolt-arcimke", t.ar === 0 ? "alap" : ("✨" + t.ar)));
      if (birt) slot.appendChild(el("div", "bolt-pipa", "✓"));
      slot.addEventListener("click", function () { boltValaszt(cs.kulcs, t.id); });
      lec.appendChild(slot);
    });
    polc.appendChild(lec);
    host.appendChild(polc);
  });
}
function boltThumb(cs, t) {
  if (cs.fajta === "ruha") {
    /* egységes bélyegkép-nyelv (spec-bolti-belyegkep-egyseges.html): minden polc-kép ugyanaz a
       mini-unikornis a saját bőrén, ugyanabból a szögből, CSAK a kérdéses holmi felöltve.
       A 380×300-as rajz-keret tartalma (x40–344 / y24–290) középre igazítva egy 120-as kártyán:
       translate(60−192·0.34, 60−157·0.34) scale(0.34) ≈ translate(-5,7) scale(0.34). */
    var c = LENYEK[mentes.leny] || LENYEK.ragyogas;
    var art = UNI_RAJZ[(c && c.rajz) || "korall"] || UNI_KORALL;
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="60" cy="60" r="57" fill="#f3ecfa"/>' +
      '<g transform="translate(-5,7) scale(0.34)">' + art + ruhaSVG(t.id) + '</g>' +
      '</svg>';
  }
  var o = P().odu;
  return '<svg viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">' +
    (cs.kulcs === "napszak" ? oduEgSVG(t.id, 120, 64) : oduEgSVG(o.napszak, 120, 64) + oduIdoSVG(t.id, 120, 64, 9)) + '</svg>';
}

var BOLT_TIPP = {
  "fej-a": "Erdei virágokból font koszorú.", "fej-k": "Csillagszikra a szarv köré.", "fej-r": "Vékony holdsarló-korona.",
  "nyak-a": "Makkokból fűzött lánc.", "nyak-k": "Rózsaszín szív-medál aranyláncon.", "nyak-r": "Puha, színes sál a hidegre.",
  "hat-a": "Könnyű takaró a hátra.", "hat-k": "Hímzett nyeregtakaró.", "hat-r": "Csillagmintás köpeny.",
  "lab-a": "Fűzöld pánt mind a négy bokára.", "lab-k": "Fényes ezüst patkó.", "lab-r": "Kristályból csiszolt patkó.",
  "oldal-a": "Levél alakú kis szárnyak.", "oldal-k": "Pillangó-szárny a röptetéshez.", "oldal-r": "Ragyogó fény-szárny.",
  "farok-a": "Szalagcsokor a farok tövére.", "farok-k": "Csengettyűk, halkan csilingelnek.", "farok-r": "Fénycsóvás üstökös-farok.",
  "este": "Csendes esti égbolt, telihold.", "reggel": "Rózsás hajnal, puha felhők.", "del": "Ragyogó déli napsütés.", "eclipse": "Ritka napfogyatkozás, csillagokkal.",
  "tiszta": "Derült, felhőtlen idő.", "eso": "Szelíd eső kopog az ablakon.", "ho": "Nagy pihékben hull a hó.", "szivarvany": "Eső után szivárvány ível az égen."
};
function boltAdatlapRajzol(host) {
  host.innerHTML = "";
  var k = boltKivalasztott();
  if (!k) { host.appendChild(el("div", "bolt-lap-ures", "Válassz egy tételt a polcról!")); return; }
  var cs = k.cs, t = k.t, birt = boltBirt(cs, t), aktiv = boltAktiv(cs, t), eleg = P().csillampor >= t.ar;
  var rang = t.ar === 0 ? 0 : (k.rang >= cs.tetelek.length - 1 ? 2 : 1);
  if (rang > 0) host.appendChild(el("div", "bolt-szalag r" + rang, rang === 2 ? "★ ritka" : "különleges"));
  var elonez = el("div", "bolt-elonezet");
  if (cs.fajta === "ruha") {
    var pr = {}; pr[cs.kulcs] = t.id;
    elonez.innerHTML = '<svg viewBox="-120 -196 240 226" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("bap", LENYEK[mentes.leny], 1, pr) + '</svg>';
  } else {
    var o2 = P().odu;
    elonez.innerHTML = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><clipPath id="bolt-korong"><circle cx="100" cy="100" r="86"/></clipPath></defs>' +
      '<circle cx="100" cy="100" r="92" fill="#a88fce"/>' +
      '<g clip-path="url(#bolt-korong)"><g transform="translate(28,28)">' +
      (cs.kulcs === "napszak" ? oduEgSVG(t.id, 144, 144) : oduEgSVG(o2.napszak, 144, 144) + oduIdoSVG(t.id, 144, 144, 10)) +
      '</g></g><circle cx="100" cy="100" r="92" fill="none" stroke="#8f7ab8" stroke-width="4"/>' +
      '<line x1="100" y1="12" x2="100" y2="188" stroke="#a88fce" stroke-width="5"/><line x1="12" y1="100" x2="188" y2="100" stroke="#a88fce" stroke-width="5"/></svg>';
  }
  host.appendChild(elonez);
  host.appendChild(el("div", "bolt-lap-cim", t.nev));
  host.appendChild(el("div", "bolt-lap-tipp", BOLT_TIPP[t.id] || ""));
  host.appendChild(el("div", "bolt-lap-ar", t.ar === 0 ? "alap – ingyen" : ("✨ " + t.ar)));
  var akt = el("div", "bolt-lap-akcio"); host.appendChild(akt);
  boltGombRajzol(akt, cs, t, birt, aktiv, eleg);
}
function boltGombRajzol(host, cs, t, birt, aktiv, eleg) {
  host.innerHTML = "";
  function gomb(txt, cls, fn) {
    var b = el("button", "bolt-nagy-gomb " + cls, txt);
    if (fn) b.addEventListener("click", fn); else b.disabled = true;
    host.appendChild(b); return b;
  }
  if (birt) {
    if (cs.fajta === "ruha") {
      if (aktiv) gomb("Leveszem", "le", function () { oduRuhaVisel(cs.kulcs, null); });
      else gomb("Felveszem", "fel", function () { oduRuhaVisel(cs.kulcs, t.id); });
    } else {
      if (aktiv) gomb("✓ ez van kint", "kesz", null);
      else gomb("Beállítom", "fel", function () { oduBeallit(cs.kulcs, t.id); });
    }
    return;
  }
  if (!eleg) { gomb("✨" + t.ar + " · még " + (t.ar - P().csillampor) + " ✨ kell", "keves", null); return; }
  gomb("Megveszem ✨" + t.ar, "vesz", function () {
    if (t.ar >= 60) boltVeszKerdes(host, cs, t); else boltVegrehajt(cs, t);
  });
}
function boltVeszKerdes(host, cs, t) {
  hangGomb();
  host.innerHTML = "";
  var igen = el("button", "bolt-nagy-gomb vesz", "Biztos? Megveszem ✨" + t.ar);
  var megse = el("button", "bolt-nagy-gomb megse", "Mégse");
  igen.addEventListener("click", function () { boltVegrehajt(cs, t); });
  megse.addEventListener("click", function () { hangGomb(); renderOduPanel(); });
  host.appendChild(igen); host.appendChild(megse);
}
function boltVegrehajt(cs, t) {
  if (cs.fajta === "ruha") oduRuhaVesz({ kulcs: cs.kulcs }, t);
  else oduVesz(cs.kulcs, t);
}
function oduRuhaVesz(hely, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar;
  P().oltozet.van[t.id] = 1;
  P().oltozet[hely.kulcs] = t.id;          /* vétel után rögtön fel is vesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduRuhaVisel(kulcs, itemId) {
  P().oltozet[kulcs] = itemId;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}
function oduVesz(kat, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar;
  P().odu.van[kat][t.id] = 1;
  P().odu[kat] = t.id;                 /* vétel után rögtön ki is tesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduBeallit(kat, id) {
  P().odu[kat] = id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
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
  ertekel: ertekel, felmondErtekel: felmondErtekel, bontasFelmondOk: bontasFelmondOk,
  bontasEloFogyaszt: bontasEloFogyaszt, palyaInditas: palyaInditas,
  GEN: GEN, szamokKinyer: szamokKinyer, szo: szo,
  oduNyit: oduNyit, ODU_KAT: ODU_KAT, unikornisSVG: unikornisSVG, LENYEK: LENYEK,
  oduVesz: function (kat, id) { var t = null; ODU_KAT[kat].forEach(function (x) { if (x.id === id) t = x; }); if (t) oduVesz(kat, t); },
  oduBeallit: oduBeallit, RUHAK: RUHAK,
  oduRuhaVesz: function (kulcs, id) { var t = null; (RUHAK[kulcs] || []).forEach(function (x) { if (x.id === id) t = x; }); if (t) oduRuhaVesz({ kulcs: kulcs }, t); },
  oduRuhaVisel: oduRuhaVisel,
  anchorViz: anchorViz, ANCHOR_ZONAK: ANCHOR_ZONAK,
  get FB() { return FB; },
  bontasEloStart: bontasEloStart, bontasEloBotlas: bontasEloBotlas, bontasEloVege: bontasEloVege,
  bontasEloChunk: bontasEloChunk
};

})();

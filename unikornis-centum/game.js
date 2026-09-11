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
    szint: 8,
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
    szint: 1,
    palcim: "Adj össze és vegyél el — tízig, átlépés nélkül",
    alap: { tipus: "osszeadas", eredmeny_max: 10, atlepes: "nincs", a_min: 1, a_max: 9, b_min: 1, b_max: 9 },
    kez_nelkul: true,
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
    szint: 2,
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
    szint: 3,
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
    szint: 4,
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
    szint: 5,
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
    szint: 6,
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
    szint: 7,
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
    szint: 8,
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
  },

  /* ══ SZORZÓS LIGET (szorzás-osztás, 100-ig) — szorzos-palyak-terv.html + spec-palya-adatlap-szorzos.html ══ */
  {
    id: "szorzo-dallam", nev: "Szorzódallam", ikon: "🎵", regio: "szorzo", hamarosan: true,
    szint: 8,
    palcim: "Mondd fel az egész szorzótáblát – egyszer öt az öt…",
    alap: { tipus: "szorzotabla-felmondas" },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Két kavics", tabla: 2 },
      { nev: "Öreg tölgy", tabla: 10 },
      { nev: "Mohapárna", tabla: 5 },
      { nev: "Csörgő patak", tabla: 3 },
      { nev: "Napos tisztás", tabla: 4 },
      { nev: "Szürke szikla", tabla: 6 },
      { nev: "Sűrű bozót", tabla_keszlet: [7, 8, 9] },
      { nev: "Odú-küszöb", tabla_keszlet: [2, 3, 4, 5, 6, 7, 8, 9, 10], cel: true }
    ]
  },
  {
    id: "egy-szam", nev: "Egy szám bűvköre", ikon: "🔮", regio: "szorzo",
    szint: 4,
    palcim: "Egy szám minden titka – szorzás és osztás együtt",
    alap: { tipus: "szorzasosztas" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "A kettes", szorzo: 2, darab: 6 },
      { nev: "A tízes", szorzo: 10, darab: 6 },
      { nev: "Az ötös", szorzo: 5, darab: 6 },
      { nev: "A hármas", szorzo: 3, darab: 6 },
      { nev: "A négyes", szorzo: 4, darab: 6 },
      { nev: "A hatos", szorzo: 6, darab: 6 },
      { nev: "A nehéz", szorzo_keszlet: [7, 8, 9], darab: 6 },
      { nev: "A kilences", szorzo: 9, darab: 6, cel: true }
    ]
  },
  {
    id: "osztas-100", nev: "Osztogató tisztás", ikon: "➗", regio: "szorzo",
    szint: 5,
    palcim: "Osztás az egész erdőben, százig",
    alap: { tipus: "osztas" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Első lépések", osztok: [2, 10], darab: 5 },
      { nev: "Ötös forrás", osztok: [5, 2], darab: 5 },
      { nev: "Gombamező", osztok: [3, 4], darab: 5 },
      { nev: "Kevert ösvény", osztok: [2, 3, 4, 5, 10], darab: 6 },
      { nev: "Sötét sűrű", osztok: [6, 7], darab: 6 },
      { nev: "Szikla-hágó", osztok: [8, 9], darab: 6 },
      { nev: "Nagy vegyes", osztok: [2, 3, 4, 5, 6, 7, 8, 9, 10], darab: 6 },
      { nev: "Odú-küszöb", osztok: [2, 3, 4, 5, 6, 7, 8, 9, 10], darab: 6, cel: true }
    ]
  },
  {
    id: "vegyes-szorzo", nev: "Szám-rengeteg", ikon: "🌲", regio: "szorzo",
    szint: 7,
    palcim: "Szorzás és osztás, keresztül-kasul, százig",
    alap: { tipus: "szorzasosztas" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Erdőszél", tablak: [2, 5, 10], darab: 5 },
      { nev: "Ösvény", tablak: [2, 3, 4, 5, 10], darab: 5 },
      { nev: "Tisztás", tablak: [2, 3, 4, 5, 10], darab: 6 },
      { nev: "Sűrűsödik", tablak: [6, 7], darab: 6 },
      { nev: "Mély vadon", tablak: [8, 9], darab: 6 },
      { nev: "Minden fa", tablak: [2, 3, 4, 5, 6, 7, 8, 9, 10], darab: 6 },
      { nev: "Százig", tablak: [2, 3, 4, 5, 6, 7, 8, 9, 10], darab: 6 },
      { nev: "Odú-küszöb", tablak: [2, 3, 4, 5, 6, 7, 8, 9, 10], darab: 6, cel: true }
    ]
  }
];

/* pályaválasztó: rajzolt ikonok + rövid matek-sor + közös erdő-háttér (grafikai session, 2026-09-08) */
var PALYA_IKON = {
  "bontas-felmondas": '<ellipse cx="30" cy="38" rx="13" ry="15" fill="#e0b47e" stroke="#222" stroke-width="1.6"/> <path d="M16 26 Q30 18 44 26 Q44 32 30 33 Q16 32 16 26 Z" fill="#a9814e" stroke="#222" stroke-width="1.6"/> <path d="M30 18 Q30 12 32 9" stroke="#8f6a3e" stroke-width="2.4" fill="none" stroke-linecap="round"/> <path d="M24 36 Q30 42 36 36" stroke="#c9a06a" stroke-width="1.6" fill="none"/>',
  "oszkiv-10": '<path d="M25 12 h10 v13 h13 v10 h-13 v13 h-10 v-13 h-13 v-10 h13 Z" fill="#c9a8e6" stroke="#222" stroke-width="1.8" stroke-linejoin="round"/>',
  "oszkiv-20": '<path d="M13 25 h34 v10 h-34 Z" fill="#9ec9f0" stroke="#222" stroke-width="1.8" stroke-linejoin="round"/>',
  "tizesek": '<path d="M12 20 Q30 17 48 20 Q50 32 48 42 Q30 45 12 42 Q10 32 12 20 Z" fill="#d9b48a" stroke="#222" stroke-width="1.6"/> <path d="M15 26 Q30 24 45 26" stroke="#c9a06a" stroke-width="1.4" fill="none"/> <text x="30" y="38" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="800" fill="#4a3b2a">10</text> <path d="M24 15 Q30 8 36 15" stroke="#8f6a3e" stroke-width="2.4" fill="none"/>',
  "aprok": '<ellipse cx="20" cy="32" rx="7" ry="6" fill="#6a4a3a" stroke="#222" stroke-width="1.4"/> <ellipse cx="31" cy="33" rx="6" ry="5" fill="#6a4a3a" stroke="#222" stroke-width="1.4"/> <ellipse cx="42" cy="31" rx="8" ry="7" fill="#6a4a3a" stroke="#222" stroke-width="1.4"/> <g stroke="#4a3428" stroke-width="1.6" stroke-linecap="round"> <path d="M26 30 l-4 -8"/><path d="M31 29 l1 -9"/><path d="M36 30 l5 -8"/> <path d="M24 37 l-5 7"/><path d="M32 38 l0 8"/><path d="M39 37 l5 7"/> <path d="M47 27 l5 -5"/><path d="M47 33 l6 2"/> </g> <circle cx="45" cy="29" r="1.3" fill="#fff"/>',
  "lepegeto": '<!-- halvány hátsó lépés: érzékelteti a lépegetést --> <g opacity="0.3"> <path d="M13 36 Q11 45 15 51 Q18 55 22 54 Q26 53 28 48 Q31 41 29 34 Q21 32 13 36 Z" fill="#f7c59f" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/> <g fill="#f7c59f" stroke="#222" stroke-width="1.2"> <circle cx="13" cy="30" r="2.6"/><circle cx="19" cy="27" r="2.4"/><circle cx="25" cy="28" r="2.1"/> </g> </g> <!-- fő lábnyom --> <path d="M25 24 Q22 36 27 45 Q31 51 36 50 Q42 49 45 42 Q49 33 46 23 Q36 19 25 24 Z" fill="#f7c59f" stroke="#222" stroke-width="1.7" stroke-linejoin="round"/> <path d="M28 32 Q35 36 42 31" stroke="#e0a878" stroke-width="1.5" fill="none"/> <g fill="#f7c59f" stroke="#222" stroke-width="1.4"> <circle cx="25" cy="17" r="3.5"/><circle cx="33" cy="13" r="3.3"/> <circle cx="40" cy="13" r="2.9"/><circle cx="46" cy="16" r="2.5"/> </g>',
  "atlepo": '<ellipse cx="15" cy="42" rx="10" ry="6" fill="#c9bda8" stroke="#222" stroke-width="1.5"/> <ellipse cx="45" cy="42" rx="10" ry="6" fill="#c9bda8" stroke="#222" stroke-width="1.5"/> <path d="M17 34 Q30 14 43 34" stroke="#8fbf7a" stroke-width="3" fill="none" stroke-dasharray="4 4" stroke-linecap="round"/> <path d="M43 34 l-5 -2 l1 5 Z" fill="#8fbf7a"/>',
  "erdo-melye": '<path d="M30 10 l11 16 l-22 0 Z" fill="#4f8f42" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/> <path d="M30 22 l14 20 l-28 0 Z" fill="#457a3a" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/> <rect x="26" y="42" width="8" height="9" fill="#8f6a3e" stroke="#222" stroke-width="1.4"/>',
  "erdo-szive": '<circle cx="30" cy="28" r="21" fill="#ffe9ad" opacity="0.55"/> <path d="M30 9 l11 16 l-22 0 Z" fill="#5f9c4e" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/> <path d="M30 21 l14 20 l-28 0 Z" fill="#4f8f42" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/> <rect x="26" y="41" width="8" height="9" fill="#8f6a3e" stroke="#222" stroke-width="1.4"/> <path d="M30 30 c-3 -4 -8 -1 -5 3 c1.6 2 3.4 3.4 5 4.6 c1.6 -1.2 3.4 -2.6 5 -4.6 c3 -4 -2 -7 -5 -3 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.1"/>',
  "szorzo-dallam": '<line x1="10" y1="40" x2="50" y2="37" stroke="#c9bda8" stroke-width="1.4"/> <line x1="10" y1="46" x2="50" y2="43" stroke="#c9bda8" stroke-width="1.4"/> <line x1="28" y1="38" x2="47" y2="15" stroke="#6a4a9a" stroke-width="2.4" stroke-linecap="round"/> <line x1="47" y1="15" x2="47" y2="34" stroke="#6a4a9a" stroke-width="2.4" stroke-linecap="round"/> <path d="M27 15 L47 12" stroke="#e8b84a" stroke-width="4.2" stroke-linecap="round"/> <g transform="rotate(-20 22 38)"><ellipse cx="22" cy="38" rx="6.5" ry="4.8" fill="#b48ad8" stroke="#222" stroke-width="1.6"/></g> <g transform="rotate(-20 42 34)"><ellipse cx="42" cy="34" rx="6.5" ry="4.8" fill="#b48ad8" stroke="#222" stroke-width="1.6"/></g> <line x1="27.5" y1="35" x2="27.5" y2="16" stroke="#6a4a9a" stroke-width="2.4" stroke-linecap="round"/> <path d="M45 8 l1.4 4 l4 1.4 l-4 1.4 l-1.4 4 l-1.4 -4 l-4 -1.4 l4 -1.4 Z" fill="#ffd24d" stroke="none"/>',
  "egy-szam": '<path d="M18 46 Q30 40 42 46 L45 51 Q30 55 15 51 Z" fill="#c9a86a" stroke="#222" stroke-width="1.6" stroke-linejoin="round"/> <circle cx="30" cy="27" r="16" fill="#bcd8f0" stroke="#222" stroke-width="1.8"/> <path d="M20 20 Q22 15 28 14" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85"/> <path d="M34 30 l1.6 4.6 l4.6 1.6 l-4.6 1.6 l-1.6 4.6 l-1.6 -4.6 l-4.6 -1.6 l4.6 -1.6 Z" fill="#fff2b8" stroke="none"/> <path d="M42 15 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 Z" fill="#c9a8e6" stroke="none"/>',
  "osztas-100": '<rect x="13" y="27" width="34" height="6" rx="3" fill="#86c9a6" stroke="#222" stroke-width="1.8" stroke-linejoin="round"/> <circle cx="30" cy="17" r="4.4" fill="#86c9a6" stroke="#222" stroke-width="1.8"/> <circle cx="30" cy="43" r="4.4" fill="#86c9a6" stroke="#222" stroke-width="1.8"/>',
  "vegyes-szorzo": '<path d="M16 20 l7 11 l-14 0 Z" fill="#7fae5f" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/> <path d="M16 28 l9 13 l-18 0 Z" fill="#7fae5f" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/> <rect x="13.5" y="41" width="5" height="6" fill="#8f6a3e" stroke="#222" stroke-width="1.2"/> <path d="M44 20 l7 11 l-14 0 Z" fill="#7fae5f" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/> <path d="M44 28 l9 13 l-18 0 Z" fill="#7fae5f" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/> <rect x="41.5" y="41" width="5" height="6" fill="#8f6a3e" stroke="#222" stroke-width="1.2"/> <path d="M30 12 l11 16 l-22 0 Z" fill="#4f8f42" stroke="#222" stroke-width="1.6" stroke-linejoin="round"/> <path d="M30 24 l14 20 l-28 0 Z" fill="#457a3a" stroke="#222" stroke-width="1.6" stroke-linejoin="round"/> <rect x="26" y="44" width="8" height="8" fill="#8f6a3e" stroke="#222" stroke-width="1.4"/>',
};
var PALYA_MAT = {
  "bontas-felmondas": "hangosan, lentről fölfelé",
  "oszkiv-10": "10-ig, átlépés nélkül",
  "oszkiv-20": "20-ig, tízes átlépéssel",
  "tizesek": "csak kerek tízesek",
  "aprok": "kétjegyű ± egyjegyű",
  "lepegeto": "kétjegyű ± kerek tízes",
  "atlepo": "kétjegyű ± egyjegyű, átlépéssel",
  "erdo-melye": "kétjegyű ± kétjegyű",
  "erdo-szive": "kétjegyű ± kétjegyű, átlépéssel",
  "szorzo-dallam": "szorzótábla, hangosan",
  "egy-szam": "egy szám: × és ÷ együtt",
  "osztas-100": "osztás, 100-ig",
  "vegyes-szorzo": "× és ÷ keverve, 100-ig",
};
var FOMENU_HATTER = '<svg class="hatter" viewBox="0 0 1120 760" preserveAspectRatio="none" aria-hidden="true"> <defs> <linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#d8ecf8"/><stop offset="0.45" stop-color="#e6f2ea"/> <stop offset="1" stop-color="#eaf4e2"/> </linearGradient> <radialGradient id="nap2" cx="0.5" cy="0.5" r="0.5"> <stop offset="0" stop-color="#fff6d0" stop-opacity="0.85"/> <stop offset="1" stop-color="#fff6d0" stop-opacity="0"/> </radialGradient> </defs> <rect x="0" y="0" width="1120" height="760" fill="url(#eg2)"/> <circle cx="985" cy="80" r="90" fill="url(#nap2)"/> <circle cx="985" cy="80" r="30" fill="#fff2b8" opacity="0.7"/> <g fill="#ffffff" opacity="0.5"> <ellipse cx="210" cy="70" rx="52" ry="17"/><ellipse cx="250" cy="61" rx="34" ry="14"/> <ellipse cx="640" cy="46" rx="42" ry="15"/><ellipse cx="672" cy="55" rx="26" ry="11"/> </g> <!-- távoli dombsor --> <path d="M0 300 Q160 268 320 296 Q480 322 640 292 Q800 262 960 296 Q1060 316 1120 298 L1120 760 L0 760 Z" fill="#cfe8c2" opacity="0.8"/> <!-- fa-sziluettek: csak a peremen, hogy a kártyák tiszták maradjanak --> <g opacity="0.72"> <g fill="#8fbf7a"> <path d="M60 300 l26 66 l-52 0 Z"/><path d="M60 336 l32 78 l-64 0 Z"/><rect x="54" y="410" width="12" height="26" fill="#a9814e"/> <path d="M150 340 l22 56 l-44 0 Z"/><path d="M150 372 l27 66 l-54 0 Z"/><rect x="145" y="434" width="10" height="22" fill="#a9814e"/> <path d="M1060 300 l26 66 l-52 0 Z"/><path d="M1060 336 l32 78 l-64 0 Z"/><rect x="1054" y="410" width="12" height="26" fill="#a9814e"/> <path d="M968 344 l22 56 l-44 0 Z"/><path d="M968 376 l27 66 l-54 0 Z"/><rect x="963" y="438" width="10" height="22" fill="#a9814e"/> </g> <g fill="#7fae5f"> <ellipse cx="330" cy="322" rx="30" ry="22"/><ellipse cx="470" cy="312" rx="24" ry="18"/> <ellipse cx="700" cy="316" rx="28" ry="20"/><ellipse cx="840" cy="326" rx="22" ry="16"/> </g> </g> <!-- talaj --> <path d="M0 700 Q280 676 560 700 Q840 724 1120 698 L1120 760 L0 760 Z" fill="#bfe3a0" opacity="0.9"/> <g fill="#fff6c4" opacity="0.7"> <circle cx="120" cy="180" r="3"/><circle cx="420" cy="150" r="2.4"/><circle cx="760" cy="170" r="2.6"/> <circle cx="900" cy="230" r="2.2"/><circle cx="270" cy="250" r="2.2"/> </g> </svg>';
/* Szorzós liget alkonyi/aranyóra háttér (grafikai session, producer-jóváhagyott 2026-09-11) */
var SZORZOS_HATTER = '<svg class="hatter" viewBox="0 0 1120 760" preserveAspectRatio="none" aria-hidden="true"> <defs> <linearGradient id="szg" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#f7e2c6"/><stop offset="0.45" stop-color="#f0e4d6"/> <stop offset="1" stop-color="#e6ecd2"/> </linearGradient> <radialGradient id="szn" cx="0.5" cy="0.5" r="0.5"> <stop offset="0" stop-color="#ffdf9e" stop-opacity="0.95"/><stop offset="1" stop-color="#ffdf9e" stop-opacity="0"/> </radialGradient> </defs> <rect x="0" y="0" width="1120" height="760" fill="url(#szg)"/> <!-- nagyobb, mélyebben ülő aranyóra-nap --> <circle cx="560" cy="150" r="150" fill="url(#szn)"/> <circle cx="560" cy="150" r="46" fill="#ffcf6e" opacity="0.75"/> <!-- lila-arany távoli dombsor (mélyebb, varázslatosabb) --> <path d="M0 320 Q170 286 340 314 Q510 340 680 308 Q850 278 1010 314 Q1070 328 1120 316 L1120 760 L0 760 Z" fill="#d9c6e0" opacity="0.7"/> <path d="M0 380 Q200 352 400 378 Q600 402 800 374 Q1000 348 1120 378 L1120 760 L0 760 Z" fill="#c9d8b0" opacity="0.75"/> <!-- fa-sziluettek a peremen, melegebb árnyalatban --> <g opacity="0.72"><g fill="#9a8f6a"> <path d="M60 320 l26 66 l-52 0 Z"/><path d="M60 356 l32 78 l-64 0 Z"/><rect x="54" y="430" width="12" height="26" fill="#8a6a3e"/> <path d="M150 360 l22 56 l-44 0 Z"/><path d="M150 392 l27 66 l-54 0 Z"/><rect x="145" y="454" width="10" height="22" fill="#8a6a3e"/> <path d="M1060 320 l26 66 l-52 0 Z"/><path d="M1060 356 l32 78 l-64 0 Z"/><rect x="1054" y="430" width="12" height="26" fill="#8a6a3e"/> <path d="M968 364 l22 56 l-44 0 Z"/><path d="M968 396 l27 66 l-54 0 Z"/><rect x="963" y="458" width="10" height="22" fill="#8a6a3e"/> </g></g> <!-- talaj --> <path d="M0 710 Q280 686 560 710 Q840 734 1120 708 L1120 760 L0 760 Z" fill="#cdd9a0" opacity="0.9"/> <!-- szentjánosbogarak / varázs-szikrák (a dallam + bűvkör téma) --> <g fill="#fff2b8"> <circle cx="230" cy="210" r="3.4" opacity="0.9"/><circle cx="360" cy="150" r="2.4" opacity="0.8"/> <circle cx="470" cy="250" r="2.8" opacity="0.85"/><circle cx="720" cy="180" r="2.6" opacity="0.8"/> <circle cx="840" cy="240" r="3.2" opacity="0.9"/><circle cx="930" cy="180" r="2.2" opacity="0.75"/> <circle cx="300" cy="300" r="2.2" opacity="0.7"/><circle cx="640" cy="300" r="2.4" opacity="0.7"/> </g> <!-- pár lebegő hangjegy-pötty a Szorzódallam témára --> <g fill="#c9a8e6" opacity="0.55"> <circle cx="410" cy="120" r="5"/><rect x="414" y="104" width="2" height="18"/> <circle cx="690" cy="130" r="5"/><rect x="694" y="114" width="2" height="18"/> </g> </svg>';

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
/* ── Szorzós liget: magyar toldalékok + tippek (2026-09-11) ── */
function veletlenElem(arr) { return arr[veletlen(0, arr.length - 1)]; }
var SZOR_SZO = { 1: "egyszer", 2: "kétszer", 3: "háromszor", 4: "négyszer", 5: "ötször",
                 6: "hatszor", 7: "hétszer", 8: "nyolcszor", 9: "kilencszer", 10: "tízszer" };
var OSZT_VAL = { 2: "kettővel", 3: "hárommal", 4: "néggyel", 5: "öttel", 6: "hattal",
                 7: "héttel", 8: "nyolccal", 9: "kilenccel", 10: "tízzel" };
function szorSzo(n) { return SZOR_SZO[n] || (szo(n) + "-szer"); }
function azSzo(n) { return "aáeéiíoóöőuúüű".indexOf(szo(n).charAt(0)) >= 0 ? "az" : "a"; }
function osztVal(n) { return OSZT_VAL[n] || (szo(n) + "-vel"); }
/* a tipp-szövegek a spec-hang-es-beszed.html kánonját követik (Szorzós liget tippek) */
function tippSzorzas(nagy, kis) {
  if (kis <= 1) return "Gondolj a szorzótáblára: " + szorSzo(1) + " " + szo(nagy) + " az " + szo(nagy) + ".";
  return "Gondolj a szorzótáblára: " + szorSzo(kis - 1) + " " + szo(nagy) + " az " + szo(nagy * (kis - 1)) +
         ", meg még egy " + szo(nagy) + ". Mennyi az?";
}
function tippOsztas(osztando, oszto, hanyados) {
  return "Fordítva gondold: hányszor van meg " + szo(oszto) + " " + azSzo(osztando) + " " + szo(osztando) +
         " számban? Segít a szorzótábla — " + szorSzo(hanyados) + " " + szo(oszto) + " " + azSzo(osztando * 1) + " " + szo(osztando) + ".";
}
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
  /* szorzás: a×b ≤ 100; a fókusz N a cfg.szorzo, vagy a cfg.tablak-ból sorsolt tábla */
  szorzas: function (cfg, kerultMar) {
    var N = (cfg.szorzo != null) ? cfg.szorzo : veletlenElem(cfg.tablak), a, kulcs, kor = 0;
    do { a = veletlen(1, 10); kulcs = "sz" + Math.min(N, a) + "x" + Math.max(N, a); kor++; }
    while (kor < 200 && (N * a > 100 || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return { csalad: "egyenkent", keplet: N + " × " + a, szoveg: N + " × " + a + " = ?",
      kartyaHTML: '<span class="k-nagy">' + N + ' × ' + a + ' = <b>?</b></span>',
      felolvas: szorSzo(N) + " " + szo(a) + ". Mennyi?", helyes: N * a, tipp: tippSzorzas(N, a),
      naplo: { tipus: "szorzas", kerdes: N + "×" + a, helyes: N * a, atlepes: false } };
  },
  /* osztás mindig maradék nélkül: hányadosból építve, d = osztó, q = hányados (1–10) */
  osztas: function (cfg, kerultMar) {
    var d = (cfg.oszto != null) ? cfg.oszto
          : (cfg.osztok ? veletlenElem(cfg.osztok)
          : (cfg.szorzo != null ? cfg.szorzo : veletlenElem(cfg.tablak)));
    var q, kulcs, kor = 0;
    do { q = veletlen(1, 10); kulcs = "o" + d + "/" + q; kor++; }
    while (kor < 200 && (d * q > 100 || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    var osztando = d * q;
    return { csalad: "egyenkent", keplet: osztando + " ÷ " + d, szoveg: osztando + " ÷ " + d + " = ?",
      kartyaHTML: '<span class="k-nagy">' + osztando + ' ÷ ' + d + ' = <b>?</b></span>',
      felolvas: szo(osztando) + " osztva " + osztVal(d) + ". Mennyi?", helyes: q, tipp: tippOsztas(osztando, d, q),
      naplo: { tipus: "osztas", kerdes: osztando + "÷" + d, helyes: q, atlepes: false } };
  },
  /* vegyes: állomáson belül szorzás és osztás ~fele-fele (B és D pálya) */
  szorzasosztas: function (cfg, kerultMar) {
    return (veletlen(0, 1) ? GEN.szorzas : GEN.osztas)(cfg, kerultMar);
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
function alapOdu() { return { napszak: "este", ido: "tiszta", van: { napszak: { este: 1 }, ido: { tiszta: 1 } }, szint: alapButorSzint(), vanButor: {}, disz: {}, vanDisz: {} }; }
function alapButorSzint() { return { fal: 1, szonyeg: 1, ablak: 1, fuggony: 1, agy: 1, fuzer: 1, kalyha: 1, polc: 1, asztal: 1 }; }
function alapOltozet() { return { fej: null, nyak: null, hat: null, lab: null, oldal: null, farok: null, van: {} }; }
function alapKinezet() { return { sorenySzin: 0, szemSzin: null, vanSoreny: { 0: 1 }, vanSzem: { "0": 1 } }; }
function alapProfil() { return { csillampor: 0, becenev: "", palyak: {}, naplo: [], jatekMp: 0, odu: alapOdu(), oltozet: alapOltozet(), jelvenyek: {}, streakRekord: 0, dropUres: 0, sorozat: { hossz: 0, utolsoPalya: null }, kinezet: alapKinezet() }; }
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
        if (!p.odu.szint) p.odu.szint = alapButorSzint();
        else { var asz = alapButorSzint(), hk; for (hk in asz) if (typeof p.odu.szint[hk] !== "number") p.odu.szint[hk] = asz[hk]; }
        if (!p.odu.vanButor) p.odu.vanButor = {};
        if (!p.odu.disz) p.odu.disz = {};
        if (!p.odu.vanDisz) p.odu.vanDisz = {};
        if (!p.oltozet) p.oltozet = alapOltozet();
        if (!p.oltozet.van) p.oltozet.van = {};
        ["fej", "nyak", "hat", "lab", "oldal", "farok"].forEach(function (h) { if (p.oltozet[h] === undefined) p.oltozet[h] = null; });
        if (!p.jelvenyek) p.jelvenyek = {};
        if (typeof p.streakRekord !== "number") p.streakRekord = 0;
        if (typeof p.dropUres !== "number") p.dropUres = 0;
        p.sorozat = { hossz: 0, utolsoPalya: null };   /* egy leülés = egy sorozat: minden betöltéskor nullázódik (7.1b) */
        if (!p.kinezet) p.kinezet = alapKinezet();
        if (typeof p.kinezet.sorenySzin !== "number") p.kinezet.sorenySzin = 0;
        if (!p.kinezet.vanSoreny) p.kinezet.vanSoreny = { 0: 1 };
        if (!p.kinezet.vanSzem) p.kinezet.vanSzem = { "0": 1 };
        p.kinezet.vanSoreny[0] = 1; p.kinezet.vanSzem["0"] = 1;
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

/* ── JUTALOM-MOTOR (rendszerterv 7.1a) — egy helyen számol a régi beégetett 2/5/3/20 helyett.
   feladat = 1+szint (2→9) · tipp után helyes = 1 · felmondás = 42 (egy „produkció") ·
   állomás = 3 (állandó) · pálya vége = 10×(szint+1) (20→90). Hibázás sosem von le. */
function palyaSzint(palya) { return (palya && palya.szint) || 1; }
function jutalom(mit, palya) {
  var p = palya || (J && J.palya) || null, sz = palyaSzint(p);
  switch (mit) {
    case "feladat":   return sz >= 5 ? 2 : 1;   /* H7.1a: 1 ✨ (1–4. szint) · 2 ✨ (5–8) */
    case "tipp":      return 1;                 /* nem skálázódik – állandó horgony */
    case "felmondas": return 9;                 /* bontás / szorzótábla felmondása */
    case "allomas":   return 1;                 /* állomás kész – állandó horgony */
    case "palyavege": return 5 * sz;            /* 5 × szint (5 → 40) */
  }
  return 0;
}
/* a pálya teljes becsült értéke (a „végig ≈ X ✨" kártya-sorhoz, 7.1d) — szorzó/teljes-ösvény nélkül.
   Az effektív tipus/darab az alap-ból öröklődik, ha az állomás nem írja felül. */
function palyaBecsultErtek(palya) {
  var alap = palya.alap || {}, n = palya.allomasok.length, feladatErtek = 0, allo = 0;
  for (var i = 1; i < n; i++) {
    var a = palya.allomasok[i], tip = a.tipus || alap.tipus;
    allo++;
    if (tip === "szambontas" || tip === "szorzotabla-felmondas") feladatErtek += jutalom("felmondas", palya);
    else feladatErtek += (a.darab || alap.darab || 5) * jutalom("feladat", palya);
  }
  return feladatErtek + allo * jutalom("allomas", palya) + jutalom("palyavege", palya);
}

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
var UNI_KORALL = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#f2662b" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#d83b22" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffb43a" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffb43a" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#f2662b" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#d83b22" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#f2a877" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#f8c6a1" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#f2662b" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#f2662b" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#f2662b" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#d83b22" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#d83b22" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#f2662b" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#d83b22" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffb43a" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#f2a877" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#3a2a20" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#f2662b" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#d83b22" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffb43a" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#f2a877" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#f28a2e" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#c9531a" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#c9531a" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#c9531a" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#c9531a" stroke-width="3"/> <g stroke="none"> <ellipse cx="120" cy="166" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="133" cy="174" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="128" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="112" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="107" cy="174" rx="6" ry="8" fill="#d63a3a"/> <circle cx="120" cy="178" r="4.5" fill="#ffd24d"/> </g> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f2662b"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#d94fb0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffb43a"/> </g> </g>';
var UNI_KEK = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#29a3dd" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#7a3bc0" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#c98fe6" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#c98fe6" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#29a3dd" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#7a3bc0" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#d7ebfb" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ecf6fe" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#29a3dd" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#29a3dd" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#29a3dd" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#7a3bc0" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#7a3bc0" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#29a3dd" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#7a3bc0" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#c98fe6" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#d7ebfb" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#2ea8e0" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#29a3dd" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#7a3bc0" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#c98fe6" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#d7ebfb" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#6a6fd6" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#454bb0" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#454bb0" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#454bb0" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#454bb0" stroke-width="3"/> <g stroke="#2b7fd0" stroke-width="3" stroke-linecap="round"> <path d="M120 162 V190"/> <path d="M108 169 L132 183"/> <path d="M132 169 L108 183"/> <path d="M120 167 l-5 5 M120 167 l5 5"/> <path d="M120 185 l-5 -5 M120 185 l5 -5"/> </g> <circle cx="120" cy="176" r="3" fill="#7a3bc0" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#29a3dd"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#7a3bc0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#b06be0"/> </g> </g>';
var UNI_ROZSA = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#ffcf4d" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#e6a92e" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffe6a0" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffe6a0" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#ffcf4d" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#e6a92e" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#fdf3f7" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ffffff" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#ffcf4d" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#e6a92e" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#e6a92e" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#ffcf4d" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#e6a92e" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffe6a0" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#fdf3f7" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.4" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#e67ba6" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#ffcf4d" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#e6a92e" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffe6a0" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#fdf3f7" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#ffcf4d" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#e0a52e" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#e0a52e" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#e0a52e" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#e0a52e" stroke-width="3"/> <path d="M120 162 l3 10 l10 4 l-10 4 l-3 10 l-3 -10 l-10 -4 l10 -4 Z" fill="#f4a6c6" stroke="none"/> <path d="M136 186 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#f28ab8" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f4a6c6"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#f28ab8"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffd24d"/> </g> </g>';
var UNI_RAJZ = { korall: UNI_KORALL, kek: UNI_KEK, rozsa: UNI_ROZSA };

/* A közös felület: a hívók unikornisSVG(id, c, meret, oltozet)-et kérnek.
   Az `oltozet` (opcionális) a felvett ruhák: { fej, nyak, hat, lab, oldal, farok }.
   A ruhák a kész rajz saját (380×300) koordinátájában rajzolódnak. */
/* v4 „Kinézet": a sörény/farok színhármasa + a szemszín, bőrönként (spec-odu-v4-kinezet.html).
   Az 1. mindig a jelenlegi alap. A hossz-változatok KÉSŐBB jönnek (most csak szín + szem). */
var SORENY_SZIN = {
  kek:    [{ nev: "Alap", c: ["#29a3dd", "#7a3bc0", "#c98fe6"] }, { nev: "Jégkék", c: ["#4ec3e0", "#3f6fd0", "#a7d9f0"] }, { nev: "Magenta-hajnal", c: ["#4aa8dd", "#b03bc0", "#f0a5d8"] }],
  korall: [{ nev: "Alap", c: ["#f2662b", "#d83b22", "#ffb43a"] }, { nev: "Parázs", c: ["#ff8a3d", "#c22e2e", "#ffd08a"] }, { nev: "Naplemente", c: ["#f2662b", "#b0347a", "#ffc45c"] }],
  rozsa:  [{ nev: "Alap", c: ["#ffcf4d", "#e6a92e", "#ffe6a0"] }, { nev: "Rózsaarany", c: ["#f7b6c8", "#e08aa8", "#ffe0ea"] }, { nev: "Holdezüst", c: ["#e8e4f0", "#a49cc0", "#f7f5fb"] }]
};
var SZEM_SZIN = [
  { nev: "Alap", hex: null }, { nev: "Égkék", hex: "#2ea8e0" }, { nev: "Rózsa", hex: "#e67ba6" }, { nev: "Sötétbarna", hex: "#3a2a20" },
  { nev: "Mohazöld", hex: "#3f9e6a" }, { nev: "Borostyán", hex: "#b5762e" }, { nev: "Ametiszt", hex: "#7a5bc0" }
];
var SZEM_ALAP = { korall: "#3a2a20", kek: "#2ea8e0", rozsa: "#e67ba6" };
/* a sörény/farok recolor: csak a <g class="ucg"> csoportokon belül cseréli a C1/C2/C3-at */
function ucgSzinez(art, defC, ujC) {
  return art.replace(/<g class="ucg">([\s\S]*?)<\/g>/g, function (m, inner) {
    inner = inner.split(defC[0]).join("").split(defC[1]).join("").split(defC[2]).join("")
                 .split("").join(ujC[0]).split("").join(ujC[1]).split("").join(ujC[2]);
    return '<g class="ucg">' + inner + '</g>';
  });
}
function kinezetAlkalmaz(art, rajz, kinezet) {
  if (!kinezet) return art;
  var sz = kinezet.sorenySzin || 0, lista = SORENY_SZIN[rajz];
  if (sz && lista && lista[sz]) art = ucgSzinez(art, lista[0].c, lista[sz].c);
  if (kinezet.szemSzin) {
    var alap = SZEM_ALAP[rajz] || "#3a2a20";
    art = art.split('r="5" fill="' + alap + '"').join('r="5" fill="' + kinezet.szemSzin + '"');
  }
  return art;
}
function unikornisSVG(id, c, meret, oltozet, kinezet) {
  var s = meret || 1;
  var rajz = (c && c.rajz) || "korall";
  var art = UNI_RAJZ[rajz] || UNI_KORALL;
  if (kinezet === undefined) kinezet = (typeof P === "function" && P() && P().kinezet) || null;
  art = kinezetAlkalmaz(art, rajz, kinezet);
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
  /* MINDEN pálya a kamera nélküli, egyképernyős teljes-út nézetet kapja (producer-döntés,
     2026-09-06). A régi kamerás nézet csak akkor fut, ha egy pálya kifejezetten teljes_ut:false. */
  SCENE_TELJES = (palya.teljes_ut !== false);
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
    var jelvDb = Object.keys(p.jelvenyek || {}).length;
    var kart = el("div", "profil-kartya");
    kart.innerHTML =
      '<svg viewBox="-78 -132 156 150" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("p" + k, c, 0.9, p.oltozet, p.kinezet || null) + '</svg>' +
      '<div class="nev">' + (p.becenev ? kiiras(p.becenev) + " · " : "") + c.nev + '</div>' +
      '<div class="adat">✨ ' + p.csillampor + ' &nbsp;·&nbsp; 🌟 ' + keszDb + '/' + palyaOssz +
      (jelvDb ? ' &nbsp;·&nbsp; 🏅 ' + jelvDb : '') + '</div>';
    kart.addEventListener("click", function () { hangGomb(); mentes.leny = k; ment(); renderFomenu(); mutat("kepernyo-fomenu"); });
    lista.appendChild(kart);
  });
}
function renderFomenu() {
  $("fomenu-csillampor").textContent = P().csillampor;
  var hb = $("fomenu-hatter"); if (hb && !hb.innerHTML) hb.innerHTML = FOMENU_HATTER;
  var racs = $("palya-racs"); racs.innerHTML = "";
  var sor = P().sorozat || { hossz: 0, utolsoPalya: null };
  var kovSzorzo = (sor.hossz >= 2) ? 3 : (sor.hossz >= 1 ? 2 : 1);
  var REGIO_CIM = { osszeado: "🌳 Összeadó liget", szorzo: "🌙 Szorzós liget" };
  var REGIO_HATTER = { osszeado: FOMENU_HATTER, szorzo: SZORZOS_HATTER };   /* mindkét liget saját jelenetet kap */
  /* régiónként csoportosítunk, a PALYAK sorrendjét megtartva */
  var regiok = {}, regioSorrend = [];
  PALYAK.forEach(function (pa, idx) {
    var r = pa.regio || "osszeado";
    if (!regiok[r]) { regiok[r] = []; regioSorrend.push(r); }
    regiok[r].push({ pa: pa, idx: idx });
  });
  regioSorrend.forEach(function (regio) {
    var szek = el("div", "palya-regio r-" + regio);
    if (REGIO_HATTER[regio]) { var bgEl = el("div", "palya-regio-hatter"); bgEl.innerHTML = REGIO_HATTER[regio]; szek.appendChild(bgEl); }
    szek.appendChild(el("div", "palya-regio-cim", REGIO_CIM[regio] || ""));
    var grid = el("div", "palya-regio-grid");
    regiok[regio].forEach(function (rec) { grid.appendChild(keszitKartya(rec.pa, rec.idx)); });
    szek.appendChild(grid);
    racs.appendChild(szek);
  });
  function keszitKartya(pa, idx) {
    var prc = P().palyak[pa.id];
    var kesz = prc && prc.kesz, arany = prc && prc.arany;
    var bontas = (pa.id === "bontas-felmondas");
    var feladatErtek = bontas ? jutalom("felmondas", pa) : jutalom("feladat", pa);
    var vegig = pa.hamarosan ? 0 : palyaBecsultErtek(pa);
    var mat = PALYA_MAT[pa.id] || pa.palcim;
    var mutatSzorzo = (kovSzorzo > 1 && pa.id !== sor.utolsoPalya && !pa.hamarosan);
    var kart = el("div", "palya-kartya" + (pa.hamarosan ? " hamarosan" : "") + (arany ? " arany" : (kesz ? " kesz" : "")));
    kart.innerHTML =
      (mutatSzorzo ? '<div class="palya-szorzo">×' + kovSzorzo + '</div>' : '') +
      '<div class="sorszam">' + (idx + 1) + '</div>' +
      '<div class="allapot">' + (arany ? "🌟" : (kesz ? "⭐" : (pa.hamarosan ? "🔜" : ""))) + '</div>' +
      '<div class="ikon">' + (PALYA_IKON[pa.id] ? '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' + PALYA_IKON[pa.id] + '</svg>' : pa.ikon) + '</div>' +
      '<div class="pnev">' + kiiras(pa.nev) + '</div>' +
      '<div class="palcim">' + kiiras(mat) + '</div>' +
      (pa.hamarosan ? "" :
        '<div class="also"><span class="jutalom">≈ ' + vegig + ' ✨</span><button class="palya-felolvas" title="Olvasd fel">🔊</button></div>');
    kart.addEventListener("click", function () {
      hangGomb();
      if (pa.hamarosan) { mondd("Ez az ösvény hamarosan nyílik meg!"); return; }
      palyaInditas(pa.id);
    });
    var fbtn = kart.querySelector(".palya-felolvas");
    if (fbtn) fbtn.addEventListener("click", function (e) {
      e.stopPropagation(); hangGomb();
      var mondat = kiiras(pa.nev) + ". " + mat + ". Az egész pálya körülbelül " + vegig + " csillámpor." +
        (mutatSzorzo ? (" Most " + (kovSzorzo >= 3 ? "háromszorosát" : "duplát") + " éri!") : "") +
        " Ha egy állomást sem hagysz ki, arany csillagszilánk jár és dupla záró-jutalom.";
      mondd(mondat);
    });
    return kart;
  }
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
  /* ── sorozat-szorzó erre a futásra (7.1b): a bejövő sorozat-hosszból; ugyanaz a pálya újra → reset ── */
  var s = P().sorozat || (P().sorozat = { hossz: 0, utolsoPalya: null });
  if (id === s.utolsoPalya) { s.hossz = 0; s.utolsoPalya = null; }   /* farmolás-védelem: ugyanaz a pálya nem viszi tovább */
  var sorozatSzorzo = (s.hossz >= 2) ? 3 : (s.hossz >= 1 ? 2 : 1);

  J = { palya: pa, allomasok: allomasok, allomasIdx: 0, feladat: null, feladatDb: 0, feladatKesz: 0,
        probak: 0, kerultKulcsok: {}, futoElsore: 0, futoOssz: 0, futoCsilla: 0, lepesSor: 0, beirt: "",
        kezCsend: 0, kezBeiras: false, keruloVolt: false, sorozatSzorzo: sorozatSzorzo };
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
  var szil = $("jatek-szilank"); if (szil) { szil.classList.remove("halvany"); szil.hidden = false; }
  var szB = $("jatek-szorzo");
  if (szB) { if (sorozatSzorzo > 1) { szB.textContent = "×" + sorozatSzorzo; szB.hidden = false; } else szB.hidden = true; }
  mutat("kepernyo-jatek");
  var inditoSzoveg = "Induljunk! Gyűjtsük össze a csillagszilánkokat.";
  if (sorozatSzorzo > 1) inditoSzoveg += " Ez a pálya most " + (sorozatSzorzo >= 3 ? "háromszorosát" : "duplát") + " ér!";
  inditoSzoveg += " Ha egy állomást sem hagysz ki, ragyogó, arany csillagszilánk kerül az odúd egére.";
  setTimeout(function () { mondd(inditoSzoveg, function () { kovAllomas(); }); }, 400);
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
    var felmondosE = (a.tipus === "szambontas" || a.tipus === "szorzotabla-felmondas");
    J.feladatDb = felmondosE ? 1 : (a.darab || 5);
    /* állomás-szintű sorsolás: a „nehéz" állomás egy fókusz-számot kap az egész állomásra */
    J.allomasSzorzo = a.szorzo_keszlet ? veletlenElem(a.szorzo_keszlet) : null;
    $("kerulo-gomb").style.display = "block";
    ujFeladat();
  });
}
function ujFeladat() {
  var a = J.allomasok[J.allomasIdx];
  J.probak = 0; J.lepesSor = 0;
  if (a.tipus === "szambontas") J.feladat = GEN.szambontas(a);
  else if (a.tipus === "szorzotabla-felmondas") J.feladat = GEN["szorzotabla-felmondas"](a);
  else {
    var eff = a;
    if (a.szorzo_keszlet != null && J.allomasSzorzo != null) {
      eff = {}; for (var kk in a) eff[kk] = a[kk]; eff.szorzo = J.allomasSzorzo;
    }
    J.feladat = GEN[a.tipus](eff, J.kerultKulcsok);
  }
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
    streakLep(J.probak === 0);
    hangJo(); hangCsilla();
    var jar = (J.probak >= 2) ? jutalom("tipp") : jutalom("feladat");   /* tipp után 1, egyébként 1+szint (7.1a) */
    P().csillampor += jar; J.futoCsilla += jar;
    $("jatek-csillampor").textContent = P().csillampor;
    $("visszajelzes").className = "visszajelzes jo";
    $("visszajelzes").textContent = "Ez az! " + f.helyes + "  (+" + jar + " ✨)";
    csillagRepul($("bagoly-buborek")); J.feladatKesz++;
    dropUnnepel(dropProbal(0.15));
    jelvenyEllenoriz();
    ment();
    setTimeout(function () { if (J.feladatKesz >= J.feladatDb) allomasKesz(); else ujFeladat(); }, 900);
  } else {
    J.probak++;
    streakLep(false);
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
  streakLep(J.probak === 0);
  hangJo(); hangCsilla();
  dropUnnepel(dropProbal(0.30));
  jelvenyEllenoriz();
  var jar = jutalom("felmondas");        /* egy teljes bontás felmondása = 42 ✨ (7.1a) */
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
  var allJar = jutalom("allomas"); P().csillampor += allJar; J.futoCsilla += allJar;   /* +3, állandó (7.1a) */
  $("jatek-csillampor").textContent = P().csillampor; ment();
  if (a.cel) { palyaVege(); return; }
  mondd("Ügyes! Mehetünk tovább.", function () { kovAllomas(); });
}
function keruloUt() {
  hangGomb(); figyelStop();
  J.keruloVolt = true;                 /* teljes ösvény: egyetlen kerülő is elrontja (7.1c) */
  keruloSzilankHalvanyit();
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
    else {
      curX = x0 + 60; curY = y0;
      dropUnnepel(dropProbal(0.25));       /* kerülőn: állomásonként 25% talált tárgy */
      jelvenyEllenoriz();
      if (a.cel) { palyaVege(); return; }
      kovAllomas();
    }
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

  /* ── záró jutalom: pálya-vége bónusz (× sorozat-szorzó) + teljes-ösvény extra (7.1a–c) ── */
  var szorzo = J.sorozatSzorzo || 1;
  var zaroBonusz = jutalom("palyavege");
  var teljes = !J.keruloVolt;                       /* egyetlen kerülő sem volt → teljes ösvény */
  var teljesExtra = teljes ? zaroBonusz : 0;        /* a záró bónusz kétszerezése */
  var zaroOssz = (zaroBonusz + teljesExtra) * szorzo;
  P().csillampor += zaroOssz; J.futoCsilla += zaroOssz;
  if (teljes) pr.arany = true;                      /* ami egyszer arany, az arany marad */

  /* ── sorozat frissítése a KÖVETKEZŐ pályához ── */
  P().sorozat.hossz = (P().sorozat.hossz || 0) + 1;
  P().sorozat.utolsoPalya = id;
  var kovSzorzo = (P().sorozat.hossz >= 2) ? 3 : 2;  /* legalább 1 pálya kész → a következő legalább ×2 */

  $("jatek-csillampor").textContent = P().csillampor;
  ment();
  var ujJelv = jelvenyEllenoriz();

  var szorzoSor = szorzo > 1 ? ('<br><span style="color:#c86bb0;font-weight:800">🔥 Sorozat-bónusz (×' + szorzo + ')</span>') : "";
  var teljesSor = teljes
    ? '<br><span style="color:#8a6a1e;font-weight:800">🌟 Teljes ösvény! +' + (teljesExtra * szorzo) + ' ✨, arany szilánk az égedre</span>'
    : "";
  $("vege-szoveg").innerHTML =
    "<b>" + J.futoOssz + "</b> feladatból <b>" + J.futoElsore + "</b> sikerült elsőre.<br>" +
    "Gyűjtöttél: <b>" + J.futoCsilla + " ✨</b> csillámport." +
    szorzoSor + teljesSor +
    (ujRekord ? '<br><span style="color:#c86bb0;font-weight:800">✨ ÚJ SAJÁT REKORD! ✨</span>' : "") +
    '<br>Megvan egy újabb <b>' + (teljes ? "arany " : "") + 'csillagszilánk</b> 🌟' +
    (ujJelv.length ? '<br><span style="color:#8a6a1e;font-weight:800">🏅 Új jelvény: ' + ujJelv.map(function (j) { return j.nev; }).join(", ") + '</span>' : "");
  var kov = kovetkezoJatszhato(id);
  $("vege-kovetkezo").style.display = kov ? "" : "none";
  $("vege-kovetkezo").onclick = function () { hangGomb(); if (kov) palyaInditas(kov); };
  konfettiSzor(); hangVege();
  mutat("kepernyo-vege");
  /* bagoly: a következő pálya szorzóját mondja, hogy a gyerek dönthessen (7.1b) */
  var buzd = kov ? (" Ha most rögtön nekiindulsz egy másik pályának, " + (kovSzorzo >= 3 ? "háromszoros" : "dupla") + " csillámport kapsz!") : "";
  mondd("Megérkeztünk! " + J.futoOssz + " feladatot oldottál meg." + buzd);
}
function keruloSzilankHalvanyit() { var s = $("jatek-szilank"); if (s) s.classList.add("halvany"); }
/* a sorozat megtörése (pálya félbehagyása cél előtt, profilváltás) — néma, nincs felirat (7.1b) */
function sorozatMegtor() { if (P().sorozat) { P().sorozat.hossz = 0; P().sorozat.utolsoPalya = null; ment(); } }
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
  $("fomenu-vissza").addEventListener("click", function () { hangGomb(); sorozatMegtor(); renderProfil(); mutat("kepernyo-profil"); });
  $("jatek-haza").addEventListener("click", function () { hangGomb(); figyelStop(); sorozatMegtor(); try { speechSynthesis.cancel(); } catch (e) {} renderFomenu(); mutat("kepernyo-fomenu"); });
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
  $("odu-valto").addEventListener("click", function () { hangGomb(); sorozatMegtor(); oduPanelZar(); renderProfil(); mutat("kepernyo-profil"); });
  $("odu-katalogus-nyit").addEventListener("click", function () { hangGomb(); oduPanelNyit(); });
  $("odu-panel-zar").addEventListener("click", function () { hangGomb(); oduPanelZar(); });
  $("odu-jelveny-nyit").addEventListener("click", function () { hangGomb(); renderJelveny(); $("odu-lap").hidden = false; });
  $("odu-gyujtemeny-nyit").addEventListener("click", function () { hangGomb(); renderGyujtemeny(); $("odu-lap").hidden = false; });
  $("odu-lap-zar").addEventListener("click", function () { hangGomb(); $("odu-lap").hidden = true; });
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

/* v3: odú-berendezés (Kellékek fül). Hely → szintek (1 = alap, ingyen). Árak/nevek a gazdaság-specből. */
var ODU_BUTOR = {
  fal:     [{ id: 1, nev: "Sima fal", ar: 0 }, { id: 2, nev: "Csillagmintás tapéta", ar: 45 }, { id: 3, nev: "Erdőmintás tapéta", ar: 105 }],
  ablak:   [{ id: 1, nev: "Kerek ablak", ar: 0 }, { id: 2, nev: "Ólomüveg ablak", ar: 70 }, { id: 3, nev: "Rózsaablak", ar: 160 }],
  fuggony: [{ id: 1, nev: "Nincs függöny", ar: 0 }, { id: 2, nev: "Muszlin függöny", ar: 30 }, { id: 3, nev: "Bársony függöny", ar: 90 }],
  agy:     [{ id: 1, nev: "Felhő-ágy", ar: 0 }, { id: 2, nev: "Szivárványos felhő-ágy", ar: 60 }, { id: 3, nev: "Csillagbaldachinos ágy", ar: 150 }],
  kalyha:  [{ id: 1, nev: "Egyszerű kályha", ar: 0 }, { id: 2, nev: "Pasztell cserépkályha", ar: 50 }, { id: 3, nev: "Szikrázó tündérkályha", ar: 130 }],
  polc:    [{ id: 1, nev: "Gyökérpolc", ar: 0 }, { id: 2, nev: "Faragott polc", ar: 40 }, { id: 3, nev: "Üvegcsés varázspolc", ar: 110 }],
  asztal:  [{ id: 1, nev: "Egyszerű asztal", ar: 0 }, { id: 2, nev: "Kerek tölgyasztal", ar: 40 }, { id: 3, nev: "Holdfa asztal", ar: 100 }],
  szonyeg: [{ id: 1, nev: "Szivárvány-szőnyeg", ar: 0 }, { id: 2, nev: "Gyapjú rózsaszőnyeg", ar: 35 }, { id: 3, nev: "Mandala-szőnyeg", ar: 95 }],
  fuzer:   [{ id: 1, nev: "Egyszerű füzér", ar: 0 }, { id: 2, nev: "Csillagfüzér", ar: 25 }]   /* kis hely: 2 szint */
};
var BUTOR_HELY = [
  { kulcs: "fal", nev: "Fal" }, { kulcs: "ablak", nev: "Ablak" }, { kulcs: "fuggony", nev: "Függöny" },
  { kulcs: "agy", nev: "Ágy" }, { kulcs: "kalyha", nev: "Kályha" }, { kulcs: "polc", nev: "Polc" },
  { kulcs: "asztal", nev: "Asztal" }, { kulcs: "szonyeg", nev: "Szőnyeg" }, { kulcs: "fuzer", nev: "Zászlófüzér" }
];

/* ── ODÚ v3 BERENDEZÉS-SZINTEK (a grafikai session mockup-odu-szintek.html-jéből, 2026-09-06).
   Minden csoport a 680×540 szoba-koordinátában; az oduSVG a hely szintje szerint szúrja be
   a megfelelő z-ponton (butorElem/butorAgyHatso/butorAsztal). Az asztal-csoportokat a hívó
   a bázis-asztal translate(115,0) keretébe teszi. */
var BERENDEZES_SZINT = {
  "fal2": '<g fill="#e5d6f2"> <path d="M140 200 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z"/> <path d="M250 165 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z"/> <path d="M360 150 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z"/> <path d="M470 165 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z"/> <path d="M560 205 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z"/> <path d="M195 285 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/> <path d="M305 262 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/> <path d="M415 258 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/> <path d="M525 280 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/> <circle cx="245" cy="225" r="3"/><circle cx="355" cy="212" r="3"/><circle cx="465" cy="225" r="3"/> <circle cx="140" cy="330" r="2.6"/><circle cx="570" cy="330" r="2.6"/> </g>',
  "fal3": '<path d="M75 436 Q340 429 605 436 L605 356 Q340 350 75 357 Z" fill="#c0a8dd"/> <path d="M75 357 Q340 350 605 356" stroke="#a88fce" stroke-width="4" fill="none"/> <g stroke="#b096d6" stroke-width="2.5" fill="none" opacity="0.8"> <path d="M150 360 Q152 396 150 432"/><path d="M240 356 Q242 394 240 432"/> <path d="M340 353 Q342 392 340 432"/><path d="M440 356 Q438 394 440 432"/> <path d="M530 361 Q528 396 530 432"/> </g> <path d="M95 322 Q200 300 340 296 Q480 300 585 322" stroke="#8fbf7a" stroke-width="3" fill="none" opacity="0.85"/> <g fill="#a7d99a"> <path d="M150 310 q-9 -8 0 -13 q9 5 0 13 Z"/><path d="M230 301 q-9 -8 0 -13 q9 5 0 13 Z"/> <path d="M340 297 q-9 -8 0 -13 q9 5 0 13 Z"/><path d="M450 301 q-9 -8 0 -13 q9 5 0 13 Z"/> <path d="M530 311 q-9 -8 0 -13 q9 5 0 13 Z"/> </g> <g fill="#f6a5c0"><circle cx="190" cy="304" r="4.5"/><circle cx="285" cy="297" r="4.5"/> <circle cx="395" cy="297" r="4.5"/><circle cx="490" cy="305" r="4.5"/></g>',
  "szonyeg2": '<path d="M172 486 Q180 452 262 443 Q344 435 424 444 Q504 452 508 489 Q502 522 420 532 Q338 540 258 531 Q178 522 172 486 Z" fill="none" stroke="#e88bb4" stroke-width="4" stroke-dasharray="10 7" stroke-linecap="round"/> <g fill="#fdf0d0"> <circle cx="238" cy="461" r="4"/><circle cx="300" cy="450" r="4"/><circle cx="380" cy="450" r="4"/> <circle cx="442" cy="462" r="4"/><circle cx="470" cy="497" r="4"/><circle cx="400" cy="522" r="4"/> <circle cx="290" cy="524" r="4"/><circle cx="212" cy="500" r="4"/> </g>',
  "szonyeg3": '<path d="M172 486 Q180 452 262 443 Q344 435 424 444 Q504 452 508 489 Q502 522 420 532 Q338 540 258 531 Q178 522 172 486 Z" fill="none" stroke="#e88bb4" stroke-width="4" stroke-dasharray="10 7" stroke-linecap="round"/> <g fill="#fdf0d0"> <circle cx="238" cy="461" r="4"/><circle cx="300" cy="450" r="4"/><circle cx="380" cy="450" r="4"/> <circle cx="442" cy="462" r="4"/><circle cx="470" cy="497" r="4"/><circle cx="400" cy="522" r="4"/> <circle cx="290" cy="524" r="4"/><circle cx="212" cy="500" r="4"/> </g> <g stroke="#e88bb4" stroke-width="3" stroke-linecap="round"> <path d="M186 508 l-11 6"/><path d="M212 522 l-8 9"/><path d="M258 533 l-4 10"/> <path d="M340 540 l0 10"/><path d="M420 534 l4 10"/><path d="M470 521 l9 8"/><path d="M497 507 l11 6"/> </g> <path d="M340 470 l4.5 11 l11.5 1 l-9 7.5 l3 11.5 l-10 -6.5 l-10 6.5 l3 -11.5 l-9 -7.5 l11.5 -1 Z" fill="#fff6d8" stroke="#f0c98a" stroke-width="1.6"/> <circle cx="300" cy="489" r="4" fill="#c9a8e6"/><circle cx="382" cy="489" r="4" fill="#c9a8e6"/>',
  "ablak2": '<path d="M191 110 Q259 112 261 180 Q259 248 190 250 Q121 248 119 180 Q121 112 191 110 Z" fill="none" stroke="#c9a8e6" stroke-width="9"/> <g fill="#d9c7ec"> <circle cx="190" cy="112" r="6"/><circle cx="259" cy="180" r="6"/> <circle cx="190" cy="249" r="6"/><circle cx="121" cy="180" r="6"/> </g> <path d="M128 254 Q190 249 252 254 Q252 264 190 268 Q128 264 128 254 Z" fill="#c197bf"/> <path d="M214 254 q-8 -6 0 -12 q9 5 0 12 Z" fill="#a7d99a"/> <path d="M224 254 q-9 -9 -1 -16 q10 7 1 16 Z" fill="#8fbf7a"/> <rect x="206" y="240" width="24" height="15" rx="4" fill="#f7c59f"/>',
  "ablak3": '<g opacity="0.55"> <path d="M190 128 Q152 132 140 168 Q166 172 188 176 Z" fill="#f6a5c0"/> <path d="M192 128 Q230 133 242 168 Q216 172 192 176 Z" fill="#fce49a"/> <path d="M188 184 Q164 188 140 192 Q152 226 188 232 Z" fill="#9ec9f0"/> <path d="M192 184 Q216 188 242 192 Q230 226 192 232 Z" fill="#a7d99a"/> </g> <path d="M191 106 Q263 108 265 180 Q263 252 190 254 Q117 252 115 180 Q117 108 191 106 Z" fill="none" stroke="#e0b8ea" stroke-width="11"/> <path d="M191 106 Q263 108 265 180 Q263 252 190 254 Q117 252 115 180 Q117 108 191 106 Z" fill="none" stroke="#c9a8e6" stroke-width="4"/> <g fill="#ffe08a"> <circle cx="190" cy="108" r="5"/><circle cx="263" cy="180" r="5"/> <circle cx="190" cy="252" r="5"/><circle cx="118" cy="180" r="5"/> </g> <path d="M122 258 Q190 252 258 258 Q258 270 190 274 Q122 270 122 258 Z" fill="#c197bf"/> <path d="M126 258 Q190 253 254 258" stroke="#d9b8d6" stroke-width="3" fill="none"/> <path d="M214 258 q-8 -6 0 -12 q9 5 0 12 Z" fill="#a7d99a"/> <path d="M224 258 q-9 -9 -1 -16 q10 7 1 16 Z" fill="#8fbf7a"/> <rect x="206" y="244" width="24" height="15" rx="4" fill="#f7c59f"/> <circle cx="146" cy="250" r="7" fill="#fdf0d0"/><circle cx="158" cy="252" r="5" fill="#f7b8d0"/>',
  "fuggony2": '<path d="M112 104 Q190 96 268 104 L268 116 Q190 108 112 116 Z" fill="#b79fd4"/> <path d="M116 114 Q126 180 120 250 Q136 244 146 250 Q142 180 138 112 Z" fill="#f7b8d0"/> <path d="M264 114 Q254 180 260 250 Q244 244 234 250 Q238 180 242 112 Z" fill="#f7b8d0"/>',
  "fuggony3": '<path d="M108 100 Q190 90 272 100 L272 118 Q190 108 108 118 Z" fill="#c9a8e6"/> <path d="M110 116 Q120 130 132 118 Q144 130 156 118 Q168 130 180 118 Q192 130 204 118 Q216 130 228 118 Q240 130 252 118 Q264 130 270 116 L270 104 Q190 94 110 104 Z" fill="#b79fd4"/> <path d="M112 116 Q124 190 116 268 Q136 258 152 266 Q146 190 142 114 Z" fill="#f6a5c0"/> <path d="M268 116 Q256 190 264 268 Q244 258 228 266 Q234 190 238 114 Z" fill="#f6a5c0"/> <path d="M120 200 Q136 210 152 200" stroke="#ffe08a" stroke-width="5" fill="none" stroke-linecap="round"/> <path d="M228 200 Q244 210 260 200" stroke="#ffe08a" stroke-width="5" fill="none" stroke-linecap="round"/> <g fill="#fff2c4"><circle cx="130" cy="150" r="2.4"/><circle cx="250" cy="150" r="2.4"/> <circle cx="126" cy="238" r="2.4"/><circle cx="254" cy="238" r="2.4"/></g>',
  "agy2": '<path d="M108 404 Q134 396 158 404 Q162 418 158 428 Q134 434 108 428 Q104 416 108 404 Z" fill="#fdf0d0"/> <path d="M112 410 Q134 404 154 410" stroke="#f0c98a" stroke-width="2.5" fill="none"/>',
  "agy3a": '<rect x="96" y="300" width="9" height="130" rx="4" fill="#c9a8e6"/> <rect x="231" y="300" width="9" height="130" rx="4" fill="#c9a8e6"/> <path d="M92 306 Q168 288 244 306 Q244 320 168 302 Q92 320 92 306 Z" fill="#b79fd4"/> <path d="M96 312 Q112 330 128 314 Q144 332 160 316 Q176 332 192 314 Q208 330 224 314 Q236 328 240 312 L240 302 Q168 286 96 302 Z" fill="#cbb6e6"/> <circle cx="100" cy="298" r="5" fill="#ffe08a"/><circle cx="236" cy="298" r="5" fill="#ffe08a"/>',
  "agy3b": '<path d="M158 400 Q206 394 254 400 Q258 418 254 436 Q206 442 158 436 Q154 418 158 400 Z" fill="#cbb6e6"/> <g stroke="#e0d0f0" stroke-width="2.5" fill="none"> <path d="M170 404 Q206 399 242 404"/><path d="M168 414 Q206 409 244 414"/> <path d="M170 424 Q206 419 242 424"/> </g> <g fill="#ffe08a"> <path d="M182 408 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z"/> <path d="M228 418 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z"/> </g>',
  "fuzer2": '<path d="M108 122 Q340 156 572 122" stroke="#c9a8e6" stroke-width="2" fill="none"/> <g><circle cx="152" cy="135" r="4" fill="#ffe08a"/><circle cx="204" cy="141" r="4" fill="#f6a5c0"/> <circle cx="262" cy="147" r="4" fill="#a7d99a"/><circle cx="330" cy="149" r="4" fill="#9ec9f0"/> <circle cx="400" cy="148" r="4" fill="#ffe08a"/><circle cx="468" cy="143" r="4" fill="#f6a5c0"/> <circle cx="528" cy="135" r="4" fill="#a7d99a"/></g> <g fill="#fff6d8" opacity="0.75"><circle cx="152" cy="135" r="1.6"/><circle cx="262" cy="147" r="1.6"/> <circle cx="400" cy="148" r="1.6"/><circle cx="528" cy="135" r="1.6"/></g>',
  "kalyha2": '<g stroke="#c197bf" stroke-width="1.2"> <path d="M512 368 q10 -2 20 0 q2 8 0 16 q-10 2 -20 0 q-2 -8 0 -16 Z" fill="#e6d3ea"/> <path d="M536 368 q10 -2 20 0 q2 8 0 16 q-10 2 -20 0 q-2 -8 0 -16 Z" fill="#f2d9e6"/> <path d="M560 368 q10 -2 20 0 q2 8 0 16 q-10 2 -20 0 q-2 -8 0 -16 Z" fill="#e6d3ea"/> </g> <g fill="#c9a8e6"><circle cx="522" cy="376" r="2"/><circle cx="546" cy="376" r="2"/><circle cx="570" cy="376" r="2"/></g>',
  "kalyha3": '<ellipse cx="542" cy="452" rx="42" ry="10" fill="#ffb3d6" opacity="0.18"/> <g stroke="#8f7ab8" stroke-width="1.4"> <path d="M521 348 q-2 -14 21 -14 q23 0 21 14 q1 4 -3 5 q-18 3 -36 0 q-4 -1 -3 -5 Z" fill="#cbb6e6"/> <path d="M521 341 q-10 -1 -12 6 q6 2 10 -1 Z" fill="#b79fd4"/> <path d="M529 335 q13 -9 26 0" fill="none" stroke="#8f7ab8" stroke-width="2.2"/> </g> <ellipse cx="542" cy="334" rx="6" ry="3" fill="#f6a5c0"/><circle cx="542" cy="331" r="2.2" fill="#ffe08a"/>',
  "polc2": '<g stroke="#c197bf" stroke-width="1"> <path d="M479 286 q9 -2 18 0 q1 5 0 10 q-9 2 -18 0 q-1 -5 0 -10 Z" fill="#f7c59f"/> <path d="M481 277 q7 -2 14 0 q1 4 0 9 q-7 2 -14 0 q-1 -5 0 -9 Z" fill="#a7d99a"/> <path d="M483 269 q6 -1 11 0 q1 4 0 8 q-6 1 -11 0 q-1 -4 0 -8 Z" fill="#9ec9f0"/> </g> <rect x="401" y="266" width="10" height="30" rx="3" fill="#c9a8e6" stroke="#b79fd4" stroke-width="1"/> <ellipse cx="406" cy="264" rx="3" ry="4" fill="#e9ddf3"/>',
  "polc3": '<path d="M404 310 Q470 324 540 310" stroke="#c9a8e6" stroke-width="1.4" fill="none"/> <g><circle cx="424" cy="316" r="3" fill="#ffe08a"/><circle cx="456" cy="320" r="3" fill="#f6a5c0"/> <circle cx="490" cy="320" r="3" fill="#a7d99a"/><circle cx="522" cy="316" r="3" fill="#9ec9f0"/></g> <line x1="470" y1="321" x2="470" y2="332" stroke="#c9a8e6" stroke-width="1"/> <path d="M470 332 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff6d8" stroke="#f0c98a" stroke-width="0.8"/>',
  "asztal2": '<path d="M276 402 Q345 388 414 402 Q416 414 408 424 Q345 452 282 424 Q274 414 276 402 Z" fill="#e9ddf3"/> <ellipse cx="345" cy="402" rx="69" ry="16" fill="#f3ecfa"/> <g fill="#f6a5c0"><circle cx="288" cy="416" r="2.4"/><circle cx="402" cy="416" r="2.4"/></g>',
  "asztal3": '<path d="M300 400 Q345 392 390 400 Q392 408 388 414 Q345 430 302 414 Q298 408 300 400 Z" fill="#d7c4ee"/> <g stroke-width="2.4" stroke-linecap="round"> <path d="M312 406 q33 -6 66 0" stroke="#f7b8d0"/><path d="M316 412 q29 -5 58 0" stroke="#a7d99a"/> </g> <ellipse cx="368" cy="398" rx="8" ry="7" fill="#e9ddf3" stroke="#c197bf" stroke-width="1.2"/> <path d="M362 396 q-4 -12 2 -18 q3 8 0 16 Z" fill="#a7d99a"/> <path d="M368 394 q0 -14 4 -20 q3 10 0 20 Z" fill="#8fbf7a"/> <circle cx="362" cy="378" r="3.4" fill="#f6a5c0"/><circle cx="372" cy="374" r="3.4" fill="#ffe08a"/>',
};
/* ── ODÚ dísztárgyak (a grafikai session mockup-odu-targyak.html-jéből, 1. adag 10 db, 2026-09-07).
   Minden ikon 80×80 dobozban; a szobába a saját tf-jével illeszkedik (élő 680×540 közép).
   Egy „hova"-zóna egyszerre EGY tárgyat mutat (a kiválasztottat). Fali tárgyaknál a talaj-árnyék
   már ki van véve. */
var DISZ_TARGY = {
  "patko": { nev: "Patkó", ar: 20, hova: "fal-bal", tf: "translate(145,270) scale(0.6) translate(-40,-40)", svg: '<path d="M25 22 Q25 13 40 13 Q55 13 55 22 Q56 42 49 60 Q45 63 42 58 Q48 42 47 25 Q47 18 40 18 Q33 18 33 25 Q32 42 38 58 Q35 63 31 60 Q24 42 25 22 Z" fill="#d3c4e6" stroke="#8f7ab8" stroke-width="1.5"/> <g fill="#8f7ab8"><circle cx="35" cy="26" r="1.4"/><circle cx="34" cy="38" r="1.4"/><circle cx="45" cy="26" r="1.4"/><circle cx="46" cy="38" r="1.4"/></g>' },
  "tukor": { nev: "Tükör", ar: 45, hova: "fal-bal", tf: "translate(145,270) scale(0.6) translate(-40,-40)", svg: '<path d="M40 12 Q57 12 57 36 Q57 62 40 62 Q23 62 23 36 Q23 12 40 12 Z" fill="#c9a8e6" stroke="#8f7ab8" stroke-width="1.8"/> <path d="M40 18 Q50 18 50 36 Q50 56 40 56 Q30 56 30 36 Q30 18 40 18 Z" fill="#e9ddf3"/> <path d="M35 26 Q39 34 37 48" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.75" stroke-linecap="round"/> <path d="M44 30 Q46 36 45 44" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/> <circle cx="40" cy="12" r="3" fill="#f6a5c0"/>' },
  "koszoru": { nev: "Koszorú", ar: 25, hova: "fal-bal", tf: "translate(145,270) scale(0.6) translate(-40,-40)", svg: '<ellipse cx="40" cy="66" rx="18" ry="3" fill="#3b2f66" opacity="0.12"/> <path d="M40 16 Q60 16 63 39 Q62 61 40 63 Q18 61 17 39 Q19 16 40 16 Z" fill="none" stroke="#6bb156" stroke-width="7" stroke-linecap="round"/> <path d="M40 16 Q60 16 63 39 Q62 61 40 63 Q18 61 17 39 Q19 16 40 16 Z" fill="none" stroke="#8fbf7a" stroke-width="2.5" stroke-dasharray="1 7" stroke-linecap="round"/> <g stroke="#222" stroke-width="0.5"> <circle cx="40" cy="16" r="4.5" fill="#f6a5c0"/><circle cx="62" cy="39" r="4.5" fill="#fce49a"/> <circle cx="40" cy="63" r="4.5" fill="#9ec9f0"/><circle cx="18" cy="39" r="4.5" fill="#c9a8e6"/> </g> <g fill="#ffd24d"><circle cx="40" cy="16" r="1.4"/><circle cx="62" cy="39" r="1.4"/><circle cx="40" cy="63" r="1.4"/><circle cx="18" cy="39" r="1.4"/></g>' },
  "erdokep": { nev: "Erdőkép", ar: 30, hova: "fal-jobb", tf: "translate(500,205) scale(0.62) translate(-40,-40)", svg: '<path d="M18 16 Q40 14 62 16 Q64 40 62 64 Q40 66 18 64 Q16 40 18 16 Z" fill="#c9a06a" stroke="#8f6a3e" stroke-width="1.6"/> <path d="M25 23 Q40 21 55 23 Q56 40 55 57 Q40 59 25 57 Q24 40 25 23 Z" fill="#cdeaf7"/> <path d="M25 48 Q40 46 55 48 Q56 53 55 57 Q40 59 25 57 Q24 52 25 48 Z" fill="#bfe3a0"/> <path d="M39 46 l-2 8 l6 0 l-2 -8 Z" fill="#a9814e"/> <path d="M40 30 Q30 32 30 40 Q30 49 40 49 Q50 49 50 40 Q50 32 40 30 Z" fill="#5a9a4a"/> <path d="M35 36 Q30 34 26 30" stroke="#78bb62" stroke-width="1.4" fill="none"/> <circle cx="50" cy="28" r="4" fill="#fff2b8"/>' },
  "noveny": { nev: "Cserepes növény", ar: 25, hova: "ablak", tf: "translate(210,250) scale(0.6) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="13" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M40 44 Q33 32 27 25 Q34 34 39 44 Z" fill="#6bb156"/> <path d="M40 44 Q40 27 43 18 Q47 29 44 44 Z" fill="#5a9a4a"/> <path d="M40 44 Q47 32 53 26 Q46 35 42 44 Z" fill="#78bb62"/> <circle cx="43" cy="18" r="3.4" fill="#f6a5c0"/><circle cx="27" cy="25" r="3" fill="#fce49a"/> <path d="M30 44 Q40 42 50 44 L50 48 Q40 50 30 48 Z" fill="#f6a5c0"/> <path d="M31 48 Q40 46 49 48 L46 60 Q40 62 34 60 Z" fill="#f7c59f" stroke="#e0a878" stroke-width="1.2"/>' },
  "vaza": { nev: "Váza", ar: 35, hova: "asztal", tf: "translate(448,392) scale(0.6) translate(-40,-64)", svg: '<ellipse cx="40" cy="66" rx="13" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M34 20 Q34 14 40 12 M40 20 Q40 13 40 12 M46 20 Q46 14 40 12" fill="none" stroke="#7fb872" stroke-width="1.6"/> <circle cx="34" cy="18" r="5" fill="#f6a5c0"/><circle cx="40" cy="13" r="5" fill="#fce49a"/><circle cx="46" cy="18" r="5" fill="#c9a8e6"/> <g fill="#ffd24d"><circle cx="34" cy="18" r="1.6"/><circle cx="40" cy="13" r="1.6"/><circle cx="46" cy="18" r="1.6"/></g> <path d="M31 40 Q29 56 40 62 Q51 56 49 40 Q45 43 40 43 Q35 43 31 40 Z" fill="#9ec9f0" stroke="#7fb0d8" stroke-width="1.3"/> <path d="M33 36 Q40 39 47 36 Q47 41 40 43 Q33 41 33 36 Z" fill="#b7d4ec" stroke="#7fb0d8" stroke-width="1"/> <path d="M36 50 Q40 54 44 50" stroke="#ffffff" stroke-width="1.6" fill="none" opacity="0.6"/>' },
  "gyertyatarto": { nev: "Gyertyatartó", ar: 30, hova: "asztal", tf: "translate(476,392) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="12" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M29 58 Q40 54 51 58 Q51 62 40 62 Q29 62 29 58 Z" fill="#c9a8e6" stroke="#8f7ab8" stroke-width="1.2"/> <path d="M37 40 Q36 50 38 58 L42 58 Q44 50 43 40 Z" fill="#cbb6e6" stroke="#8f7ab8" stroke-width="1"/> <path d="M33 40 Q40 37 47 40 Q47 43 40 44 Q33 43 33 40 Z" fill="#b79fd4"/> <path d="M36 26 Q35 34 36 40 Q40 42 44 40 Q45 34 44 26 Q40 24 36 26 Z" fill="#fdf0d0" stroke="#e6d3a8" stroke-width="1"/> <path d="M40 15 Q35 22 40 27 Q45 22 40 15 Z" fill="#ffd24d"/> <path d="M40 19 Q37 23 40 26 Q43 23 40 19 Z" fill="#ff9d4d"/>' },
  "konyvek": { nev: "Könyvek", ar: 35, hova: "polc", tf: "translate(445,296) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="18" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M23 50 Q40 48 57 50 Q58 57 57 60 Q40 62 23 60 Q22 57 23 50 Z" fill="#f6a5c0" stroke="#e79ac0" stroke-width="1.2"/> <path d="M26 42 Q40 40 54 42 Q55 49 54 52 Q40 54 26 52 Q25 49 26 42 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1.2"/> <path d="M29 33 Q40 31 51 33 Q52 40 51 43 Q40 45 29 43 Q28 40 29 33 Z" fill="#9ec9f0" stroke="#7fb0d8" stroke-width="1.2"/> <g stroke-width="1.4" stroke-linecap="round"> <path d="M27 55 h26" stroke="#e79ac0"/><path d="M30 47 h20" stroke="#7fb872"/><path d="M32 38 h16" stroke="#7fb0d8"/> </g> <path d="M40 31 l1.6 3.8 l4 0.4 l-3 2.6 l1 4 l-3.6 -2.2 l-3.6 2.2 l1 -4 l-3 -2.6 l4 -0.4 Z" fill="#ffe08a"/>' },
  "csillag": { nev: "Csillag-figura", ar: 40, hova: "polc", tf: "translate(505,296) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="12" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M30 58 Q40 55 50 58 Q50 62 40 62 Q30 62 30 58 Z" fill="#c9a8e6" stroke="#8f7ab8" stroke-width="1"/> <rect x="38" y="48" width="4" height="10" fill="#cbb6e6"/> <path d="M40 16 l6 13 l14 1 l-11 9 l4 14 l-13 -8 l-13 8 l4 -14 l-11 -9 l14 -1 Z" fill="#ffe08a" stroke="#e0b84d" stroke-width="1.4" stroke-linejoin="round"/> <circle cx="40" cy="33" r="3.5" fill="#fff6d8"/>' },
  "pluss": { nev: "Felhő-plüss", ar: 55, hova: "agy", tf: "translate(150,404) scale(0.6) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M24 46 Q19 35 30 32 Q32 21 46 25 Q58 22 58 36 Q65 41 57 50 Q40 58 26 50 Q22 48 24 46 Z" fill="#fdfdfd" stroke="#d9d9e2" stroke-width="1.5"/> <circle cx="35" cy="41" r="1.8" fill="#4a3b7a"/><circle cx="47" cy="41" r="1.8" fill="#4a3b7a"/> <path d="M36 46 q4 4 8 0" stroke="#f6a5c0" stroke-width="1.8" fill="none" stroke-linecap="round"/> <circle cx="30" cy="45" r="2.6" fill="#f7b8d0" opacity="0.7"/><circle cx="52" cy="45" r="2.6" fill="#f7b8d0" opacity="0.7"/>' },
  /* — 2. adag (2026-09-07) — */
  "krisztaly": { nev: "Függő kristály", ar: 40, hova: "mennyezet", tf: "translate(300,138) scale(0.6) translate(-40,-40)", svg: '<line x1="40" y1="8" x2="40" y2="24" stroke="#c9a8e6" stroke-width="1.6"/> <path d="M40 24 L54 38 L40 66 L26 38 Z" fill="#b7d4ec" stroke="#7fb0d8" stroke-width="1.4"/> <path d="M40 24 L54 38 L40 43 Z" fill="#d7ebfb"/> <path d="M26 38 L40 43 L40 66 Z" fill="#9fc4e8"/> <path d="M33 31 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z" fill="#ffffff" opacity="0.85"/>' },
  "terito": { nev: "Asztalterítő", ar: 20, hova: "asztal", tf: "translate(460,392) scale(0.62) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M22 42 Q40 38 58 42 Q60 52 58 60 Q40 64 22 60 Q20 52 22 42 Z" fill="#e9ddf3" stroke="#c9a8e6" stroke-width="1.2"/> <path d="M24 46 Q40 43 56 46" stroke="#f7b8d0" stroke-width="2.6" fill="none"/> <path d="M25 53 Q40 50 55 53" stroke="#a7d99a" stroke-width="2.6" fill="none"/> <path d="M30 42 Q28 52 30 60" stroke="#cbb6e6" stroke-width="1" fill="none" opacity="0.7"/>' },
  "befott": { nev: "Befőttes-csillag", ar: 30, hova: "asztal", tf: "translate(460,392) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="12" ry="3" fill="#3b2f66" opacity="0.14"/> <rect x="33" y="18" width="14" height="6" rx="2" fill="#c9a8e6"/> <path d="M30 26 Q30 22 40 22 Q50 22 50 26 L50 58 Q50 62 40 62 Q30 62 30 58 Z" fill="#dff0f7" stroke="#a9cbe0" stroke-width="1.4" opacity="0.9"/> <ellipse cx="40" cy="43" rx="13" ry="13" fill="#ffe9ad" opacity="0.5"/> <path d="M40 33 l4 9 l10 0.7 l-8 6 l3 9.5 l-9 -6 l-9 6 l3 -9.5 l-8 -6 l10 -0.7 Z" fill="#ffd24d" stroke="#e0b84d" stroke-width="1"/> <path d="M34 30 Q36 46 34 56" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.5"/>' },
  "pokroc": { nev: "Pokróc", ar: 25, hova: "agy", tf: "translate(162,404) scale(0.6) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M22 40 Q40 36 58 40 Q60 50 58 58 Q40 62 22 58 Q20 50 22 40 Z" fill="#c9a8e6" stroke="#b79fd4" stroke-width="1.3"/> <path d="M24 46 Q40 43 56 46" stroke="#e9ddf3" stroke-width="2.6" fill="none"/> <path d="M24 52 Q40 49 56 52" stroke="#f6a5c0" stroke-width="2.6" fill="none"/> <g stroke="#b79fd4" stroke-width="1.4" stroke-linecap="round"><path d="M25 60 v5"/><path d="M33 61 v5"/><path d="M40 62 v5"/><path d="M47 61 v5"/><path d="M55 60 v5"/></g>' },
  "parna": { nev: "Hímzett párna", ar: 25, hova: "agy", tf: "translate(122,396) scale(0.55) translate(-40,-64)", svg: '<ellipse cx="40" cy="62" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M24 32 Q40 26 56 32 Q62 42 56 54 Q40 60 24 54 Q18 42 24 32 Z" fill="#fdf0d0" stroke="#e6d3a8" stroke-width="1.4"/> <path d="M28 36 Q40 33 52 36" stroke="#f0c98a" stroke-width="1.4" fill="none" opacity="0.7"/> <circle cx="40" cy="44" r="4" fill="#f7b8d0"/> <circle cx="24" cy="43" r="2.5" fill="#f6a5c0"/><circle cx="56" cy="43" r="2.5" fill="#f6a5c0"/>' },
  "uvegcsek": { nev: "Színes üvegcsék", ar: 30, hova: "polc", tf: "translate(473,296) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <rect x="26" y="30" width="4" height="5" fill="#b79fd4"/> <path d="M23 35 Q23 32 31 32 Q39 32 39 35 Q41 48 37 60 Q31 63 25 60 Q21 48 23 35 Z" fill="#f7b8d0" stroke="#e79ac0" stroke-width="1.1"/> <rect x="39" y="24" width="4" height="6" fill="#b79fd4"/> <path d="M37 30 Q37 27 45 27 Q53 27 53 30 Q55 48 51 60 Q45 63 39 60 Q35 48 37 30 Z" fill="#9ec9f0" stroke="#7fb0d8" stroke-width="1.1"/> <rect x="53" y="38" width="3.5" height="4" fill="#b79fd4"/> <path d="M51 42 Q51 39 57 39 Q63 39 63 42 Q64 52 60 60 Q56 63 52 60 Q49 52 51 42 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1.1"/> <circle cx="30" cy="46" r="1.4" fill="#fff" opacity="0.7"/>' },
  "unifigura": { nev: "Unikornis-figura", ar: 40, hova: "polc", tf: "translate(473,296) scale(0.58) translate(-40,-64)", svg: '<ellipse cx="40" cy="63" rx="12" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M30 60 Q40 57 50 60 Q50 63 40 63 Q30 63 30 60 Z" fill="#c9a8e6"/> <path d="M33 60 Q28 46 34 36 Q39 29 47 32 Q55 36 52 46 Q51 55 47 60 Z" fill="#e9ddf3" stroke="#b79fd4" stroke-width="1.3"/> <path d="M41 33 L45 30 L47 35 Z" fill="#e9ddf3" stroke="#b79fd4" stroke-width="1"/> <path d="M46 31 L53 18 L49 32 Z" fill="#ffe08a" stroke="#e0b84d" stroke-width="1"/> <path d="M35 36 Q31 46 33 55" stroke="#f6a5c0" stroke-width="3" fill="none" stroke-linecap="round"/> <circle cx="43" cy="43" r="1.8" fill="#4a3b7a"/>' },
  "kosar": { nev: "Fonott kosár", ar: 25, hova: "padlo-bal", tf: "translate(180,500) scale(0.7) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="16" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M28 38 Q40 20 52 38" fill="none" stroke="#c9a06a" stroke-width="2.5"/> <path d="M26 41 Q40 47 54 41 Q40 35 26 41 Z" fill="none" stroke="#c9a06a" stroke-width="2"/> <path d="M27 42 Q40 47 53 42 L49 60 Q40 64 31 60 Z" fill="#e0b47e" stroke="#c9a06a" stroke-width="1.3"/> <g stroke="#c9a06a" stroke-width="1"><path d="M31 48 Q40 51 49 48"/><path d="M31 54 Q40 57 49 54"/><path d="M35 43 L34 60"/><path d="M40 44 L40 62"/><path d="M45 43 L46 60"/></g>' },
  "ladiko": { nev: "Kincsesládikó", ar: 45, hova: "padlo-jobb", tf: "translate(510,500) scale(0.7) translate(-40,-64)", svg: '<ellipse cx="40" cy="64" rx="18" ry="3" fill="#3b2f66" opacity="0.14"/> <rect x="24" y="43" width="32" height="19" rx="3" fill="#c9a06a" stroke="#8f6a3e" stroke-width="1.4"/> <path d="M24 43 Q24 31 40 31 Q56 31 56 43 Z" fill="#e0b47e" stroke="#8f6a3e" stroke-width="1.4"/> <rect x="22" y="41" width="36" height="5" rx="2" fill="#b58a5a"/> <rect x="36" y="45" width="8" height="9" rx="1.5" fill="#ffe08a" stroke="#e0b84d" stroke-width="1"/> <circle cx="40" cy="49" r="1.4" fill="#8f6a3e"/> <path d="M47 34 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z" fill="#fff6d8"/>' },
  "kispatna": { nev: "Kispárna", ar: 20, hova: "padlo-bal", tf: "translate(180,500) scale(0.7) translate(-40,-64)", svg: '<ellipse cx="40" cy="62" rx="18" ry="3" fill="#3b2f66" opacity="0.14"/> <path d="M22 42 Q40 36 58 42 Q64 50 58 58 Q40 64 22 58 Q16 50 22 42 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1.4"/> <path d="M28 45 Q40 42 52 45" stroke="#c9e6bb" stroke-width="1.4" fill="none"/> <circle cx="40" cy="50" r="3.5" fill="#fce49a"/> <circle cx="22" cy="50" r="2.4" fill="#fce49a"/><circle cx="58" cy="50" r="2.4" fill="#fce49a"/>' },
  "fuggodisz": { nev: "Függődísz", ar: 30, hova: "ablak", tf: "translate(210,150) scale(0.6) translate(-40,-40)", svg: '<line x1="40" y1="8" x2="40" y2="18" stroke="#c9a8e6" stroke-width="1.4"/> <circle cx="40" cy="28" r="11" fill="#ffe9ad" opacity="0.4"/> <circle cx="40" cy="28" r="8" fill="none" stroke="#ffd24d" stroke-width="2"/> <path d="M40 22 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#ffd24d"/> <line x1="33" y1="36" x2="31" y2="52" stroke="#c9a8e6" stroke-width="1"/><circle cx="31" cy="54" r="3" fill="#f6a5c0"/> <line x1="40" y1="39" x2="40" y2="58" stroke="#c9a8e6" stroke-width="1"/><circle cx="40" cy="60" r="3" fill="#9ec9f0"/> <line x1="47" y1="36" x2="49" y2="52" stroke="#c9a8e6" stroke-width="1"/><circle cx="49" cy="54" r="3" fill="#a7d99a"/>' },
};
/* a hely aktív szintjéhez tartozó rárajzolt csoport(ok) — a bázis-bútor UTÁN (kivéve az ágy-baldachin) */
function butorElem(o, hely) {
  var lvl = (o.szint && o.szint[hely]) || 1, out = "";
  function add(id) { out += '<g>' + BERENDEZES_SZINT[id] + '</g>'; }
  if (hely === "fal") { if (lvl >= 2) add("fal2"); if (lvl >= 3) add("fal3"); }
  else if (hely === "szonyeg") { if (lvl === 2) add("szonyeg2"); else if (lvl >= 3) add("szonyeg3"); }
  else if (hely === "ablak") { if (lvl >= 2) add("ablak2"); if (lvl >= 3) add("ablak3"); }
  else if (hely === "fuggony") { if (lvl === 2) add("fuggony2"); else if (lvl >= 3) add("fuggony3"); }
  else if (hely === "fuzer") { if (lvl >= 2) add("fuzer2"); }
  else if (hely === "kalyha") { if (lvl >= 2) add("kalyha2"); if (lvl >= 3) add("kalyha3"); }
  else if (hely === "polc") { if (lvl >= 2) add("polc2"); if (lvl >= 3) add("polc3"); }
  else if (hely === "agy") { if (lvl >= 2) add("agy2"); if (lvl >= 3) add("agy3b"); }   /* elülső rész (a takaró fölé) */
  return out;
}
function butorAgyHatso(o) { return (((o.szint && o.szint.agy) || 1) >= 3) ? '<g>' + BERENDEZES_SZINT["agy3a"] + '</g>' : ""; }   /* baldachin: az ágy MÖGÉ */
function butorAsztal(o) { var lvl = (o.szint && o.szint.asztal) || 1, out = ""; if (lvl >= 2) out += '<g>' + BERENDEZES_SZINT["asztal2"] + '</g>'; if (lvl >= 3) out += '<g>' + BERENDEZES_SZINT["asztal3"] + '</g>'; return out; }

/* ── dísztárgyak: zónák (egy zóna = egy „hova"-kulcs, egyszerre EGY tárgy) ── */
var DISZ_ZONA = [
  { kulcs: "fal-bal", nev: "Bal fal" }, { kulcs: "fal-jobb", nev: "Jobb fal" }, { kulcs: "mennyezet", nev: "Mennyezet" },
  { kulcs: "ablak", nev: "Ablakpárkány" }, { kulcs: "asztal", nev: "Asztalon" }, { kulcs: "polc", nev: "Polcon" },
  { kulcs: "agy", nev: "Ágyon" }, { kulcs: "padlo-bal", nev: "Padló (bal)" }, { kulcs: "padlo-jobb", nev: "Padló (jobb)" }
];
/* a mennyezeti „extra füzér" NEM 80×80 ikon, hanem a füzér-ívre feszülő széles rajz (a bázis-füzér stílusában) */
function extraFuzerSVG() {
  var s = '<path d="M112 150 Q340 200 568 150" stroke="#c9a8e6" stroke-width="2" fill="none"/>';   /* a bázis-füzér ALATT, jól elkülönülve */
  var szin = ["#f6a5c0", "#fce49a", "#a7d99a", "#9ec9f0", "#c3a5e0"];
  for (var i = 0; i < 10; i++) {
    var x = 134 + i * 46, tt = (x - 112) / 456, y = 150 + 50 * 4 * tt * (1 - tt);
    s += '<path d="M' + x + ' ' + y.toFixed(0) + ' l16 0 l-8 15 Z" fill="' + szin[i % 5] + '"/>';
  }
  return s;
}
function diszZonaTetelek(zona) {
  var lista = [{ id: "nincs", nev: "Üres", ar: 0 }];
  if (zona === "mennyezet") lista.push({ id: "extrafuzer", nev: "Extra zászlófüzér", ar: 30 });   /* széles, nincs DISZ_TARGY-ban */
  for (var id in DISZ_TARGY) if (DISZ_TARGY[id].hova === zona) lista.push({ id: id, nev: DISZ_TARGY[id].nev, ar: DISZ_TARGY[id].ar });
  return lista;
}
/* a szobába kirakott dísztárgyak (a bútor UTÁN, az unikornis ELŐTT) */
function diszReteg(o) {
  var out = "", d = o.disz || {};
  DISZ_ZONA.forEach(function (z) {
    var id = d[z.kulcs];
    if (id === "extrafuzer") { out += extraFuzerSVG(); return; }
    if (id && DISZ_TARGY[id]) out += '<g transform="' + DISZ_TARGY[id].tf + '">' + DISZ_TARGY[id].svg + '</g>';
  });
  return out;
}
function diszPreviewOdu(zona, id) {
  var o = P().odu, uj = {}, k; for (k in o) uj[k] = o[k];
  uj.disz = {}; for (k in (o.disz || {})) uj.disz[k] = o.disz[k];
  uj.disz[zona] = (id === "nincs") ? null : id;
  return uj;
}

/* --- csillagszilánk-réteg az ablak egén (7.1c/3.3b): 9 fix pozíció a pályák sorrendjében.
   kész pálya = ezüst szilánk, teljes ösvény (arany) = ragyogó arany, még nem kész = halvány pont.
   Csak a szoba-ablakban jelenik meg (a napszak-bélyegképek NEM hívják). --- */
function oduSzilankReteg(W, H) {
  var poz = [[0.33, 0.35], [0.5, 0.29], [0.67, 0.35], [0.27, 0.5], [0.5, 0.52], [0.73, 0.5], [0.34, 0.7], [0.5, 0.75], [0.66, 0.7]];
  var s = '<g pointer-events="none">';
  for (var i = 0; i < PALYAK.length && i < 9; i++) {
    var x = poz[i][0] * W, y = poz[i][1] * H;
    var pr = P().palyak[PALYAK[i].id];
    if (pr && pr.kesz && pr.arany) s += '<g class="odu-szilank-arany">' + csillagSVG(x, y, 6.5, "#ffe08a") + '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#fff6d8"/></g>';
    else if (pr && pr.kesz) s += csillagSVG(x, y, 4.6, "#e2e8f0");
    else s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6" fill="#ffffff" opacity="0.2"/>';
  }
  return s + '</g>';
}
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

/* --- a teljes odú-szoba (680×540) — az odu-belso.svg mintájára --- */
function oduSVG(lenyKulcs, o, elonezet) {
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
  s += butorElem(o, "fal");                 /* v3: tapéta / lambéria a falon */

  /* padló */
  s += '<rect x="75" y="436" width="530" height="104" fill="#e3c9de"/>';
  s += '<g stroke="#cdaecb" stroke-width="2" opacity="0.6"><line x1="75" y1="464" x2="605" y2="464"/><line x1="75" y1="494" x2="605" y2="494"/><line x1="75" y1="520" x2="605" y2="520"/><line x1="200" y1="436" x2="200" y2="540"/><line x1="345" y1="436" x2="345" y2="540"/><line x1="470" y1="436" x2="470" y2="540"/></g>';

  /* zászlófüzér */
  s += '<path d="M100 112 Q340 150 580 112" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  var zsz = ["#f6a5c0", "#a7d99a", "#fce49a", "#c3a5e0", "#9ec9f0", "#f6a5c0", "#a7d99a"];
  var zY = [128, 130, 131, 130, 128, 124, 119];
  for (var z = 0; z < zsz.length; z++) { var zx = 236 + z * 48; s += '<path d="M' + zx + ' ' + zY[z] + ' l16 0 l-8 14 Z" fill="' + zsz[z] + '"/>'; }
  s += butorElem(o, "fuzer");               /* v3: csillag-/tündérfény-füzér */

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
  s += oduSzilankReteg(120, 120);          /* a gyűjtött csillagszilánkok az égen (7.1c) */
  s += '</g></g>';
  s += '<ellipse cx="168" cy="206" rx="16" ry="7" fill="#cbb6e6"/><circle cx="160" cy="204" r="6" fill="#cbb6e6"/><circle cx="176" cy="203" r="7" fill="#cbb6e6"/>';
  s += '<line x1="190" y1="126" x2="190" y2="234" stroke="#a88fce" stroke-width="6"/><line x1="136" y1="180" x2="244" y2="180" stroke="#a88fce" stroke-width="6"/>';
  s += butorElem(o, "ablak");               /* v3: faragott keret / ólomüveg */
  s += butorElem(o, "fuggony");             /* v3: függöny az ablakra */

  /* ── FELHŐ-ÁGY (bal) ── */
  s += butorAgyHatso(o);                     /* v3: baldachin az ágy MÖGÉ (3. szint) */
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
  s += butorElem(o, "agy");                  /* v3: párna + dúsabb paplan a takaró fölé */

  /* ── GYÖKÉRPOLC (jobb-közép) ── */
  s += '<rect x="398" y="296" width="150" height="12" rx="4" fill="#cbb6e6"/>';
  s += '<path d="M410 308 q-8 18 6 30 l6 -4 q-10 -12 -4 -26 Z" fill="#ab90cf"/><path d="M536 308 q8 18 -6 30 l-6 -4 q10 -12 4 -26 Z" fill="#ab90cf"/>';
  s += '<rect x="410" y="262" width="12" height="34" rx="2" fill="#f6a5c0"/><rect x="424" y="258" width="12" height="38" rx="2" fill="#9ec9f0"/><rect x="438" y="264" width="12" height="32" rx="2" fill="#a7d99a"/>';
  s += '<ellipse cx="470" cy="286" rx="8" ry="10" fill="#fce4b8"/><path d="M462 283 a8 6 0 0 1 16 0 Z" fill="#c9a8e6"/><line x1="470" y1="275" x2="470" y2="270" stroke="#c9a8e6" stroke-width="2"/>';
  s += '<rect x="494" y="262" width="30" height="8" rx="3" fill="#b79fd4"/><rect x="496" y="268" width="26" height="28" rx="6" fill="#e9ddf3"/><rect x="500" y="279" width="18" height="14" rx="3" fill="#a7d99a"/>';
  s += '<rect x="526" y="262" width="30" height="8" rx="3" fill="#b79fd4"/><rect x="528" y="268" width="26" height="28" rx="6" fill="#e9ddf3"/><rect x="532" y="279" width="18" height="14" rx="3" fill="#f7b8d0"/>';
  s += butorElem(o, "polc");                 /* v3: könyvek/üvegcsék + tündérfény a polc alá */

  /* ── KÁLYHA (jobb) ── */
  s += '<ellipse cx="542" cy="432" rx="72" ry="52" fill="#ffb3d6" opacity="0.12"/>';
  s += '<rect x="505" y="360" width="95" height="78" rx="14" fill="#d9b8d6"/><rect x="498" y="350" width="110" height="12" rx="4" fill="#c9a8e6"/>';
  s += '<rect x="560" y="300" width="16" height="60" rx="4" fill="#b79fd4"/><circle cx="568" cy="292" r="7" fill="#fdfdfd"/><circle cx="561" cy="278" r="6" fill="#fdfdfd"/><circle cx="571" cy="266" r="5" fill="#fdfdfd"/>';
  s += '<path d="M520 438 v-30 a22 22 0 0 1 44 0 v30 Z" fill="#4a3b7a"/><ellipse cx="542" cy="437" rx="18" ry="5" fill="#ffd0a8"/>';
  s += '<path d="M528 436 q6 -26 14 -32 q4 12 10 14 q6 -6 6 -18 q14 16 10 36 Z" fill="#f7a8c8"/><path d="M533 436 q5 -18 10 -22 q3 8 7 10 q3 -4 3 -12 q9 12 6 24 Z" fill="#ffc59f"/><path d="M538 436 q3 -12 6 -14 q2 6 5 7 q1 -3 1 -8 q6 9 3 15 Z" fill="#fce49a"/>';
  s += '<rect x="512" y="434" width="18" height="10" rx="3" fill="#b79fd4"/><rect x="574" y="434" width="18" height="10" rx="3" fill="#b79fd4"/>';
  s += butorElem(o, "kalyha");               /* v3: díszcsempe + teáskanna a párkányon */

  /* ── KEREK ASZTAL csillag-befőttel (jobbra tolva, hogy az unikornis elférjen) ── */
  s += '<g transform="translate(115,0)">';
  s += '<ellipse cx="345" cy="458" rx="34" ry="9" fill="#3b2f66" opacity="0.2"/>';
  s += '<ellipse cx="345" cy="380" rx="46" ry="42" fill="#ffe9ad" opacity="0.18"/><ellipse cx="345" cy="378" rx="26" ry="24" fill="#ffe9ad" opacity="0.24"/>';
  s += '<ellipse cx="345" cy="404" rx="72" ry="20" fill="#d9b8d6"/><ellipse cx="345" cy="404" rx="72" ry="20" fill="none" stroke="#c197bf" stroke-width="3"/>';
  s += '<rect x="290" y="404" width="110" height="10" fill="#c197bf"/><rect x="336" y="414" width="18" height="40" fill="#c197bf"/>';
  s += butorAsztal(o);                       /* v3: terítő + futó (a lámpás ALÁ, még a translate-en belül) */
  s += '<rect x="328" y="394" width="34" height="8" rx="2" fill="#b79fd4"/><path d="M330 396 v-20 a15 15 0 0 1 30 0 v20 Z" fill="#e9ddf3" opacity="0.9"/><rect x="338" y="352" width="14" height="9" rx="2" fill="#b79fd4"/>';
  s += '<circle cx="345" cy="376" r="8" fill="#ffe9ad" opacity="0.6"/><polygon points="345,366 347,373 355,373 349,377 351,384 345,380 339,384 341,377 335,373 343,373" fill="#fff6d8"/>';
  s += '</g>';

  /* ── GOMBA (bal-közép) ── */
  s += '<ellipse cx="286" cy="452" rx="26" ry="7" fill="#3b2f66" opacity="0.2"/><rect x="278" y="428" width="16" height="24" rx="7" fill="#fdf0d0"/><path d="M262 430 a24 15 0 0 1 48 0 Z" fill="#f6a5c0"/>';
  s += '<circle cx="278" cy="424" r="3.5" fill="#ffffff"/><circle cx="298" cy="426" r="3" fill="#ffffff"/><circle cx="288" cy="418" r="2.5" fill="#ffffff"/>';

  /* ── SZIVÁRVÁNY-SZŐNYEG ── */
  s += '<ellipse cx="340" cy="488" rx="168" ry="47" fill="#f6a5c0"/><ellipse cx="340" cy="488" rx="122" ry="34" fill="#f7c59f"/><ellipse cx="340" cy="488" rx="78" ry="21" fill="#a7d99a"/><ellipse cx="340" cy="488" rx="34" ry="9" fill="#9ec9f0"/>';
  s += butorElem(o, "szonyeg");              /* v3: fodros / mandala szőnyeg a szivárvány fölé */

  s += diszReteg(o);                     /* v3+: kirakott dísztárgyak a bútor után, az unikornis előtt */

  /* ── AZ UNIKORNIS a szőnyegen (előnézetben elhagyva, hogy a bútor jól látszódjon) ── */
  if (!elonezet) {
    s += '<ellipse cx="348" cy="492" rx="56" ry="13" fill="#3b2f66" opacity="0.16"/>';
    s += '<g transform="translate(346,492) scale(1.28)">' + unikornisSVG("odu-uni", c, 1, P().oltozet) + '</g>';
  }

  /* mennyezeti csillámok */
  s += '<g fill="#fff2c4" opacity="0.7"><path d="M330 250 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><path d="M410 232 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><circle cx="360" cy="205" r="2"/><circle cx="300" cy="240" r="1.6"/><circle cx="470" cy="210" r="1.8"/><path d="M505 232 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z"/></g>';

  /* eső / hó a szobában is (halványabban) */
  if (o.ido === "eso" || o.ido === "ho") { s += '<g opacity="0.5" pointer-events="none">' + oduIdoSVG(o.ido, 680, 470, o.ido === "ho" ? 30 : 24) + '</g>'; }

  /* hangulatfény */
  s += '<rect x="0" y="0" width="680" height="540" fill="' + tint[0] + '" opacity="' + tint[1] + '" pointer-events="none"/>';

  /* ── MESEBOLT-STAND a szőnyegtől jobbra — MINDIG legfelül, hogy biztosan kattintható legyen (előnézetben nincs) ── */
  if (!elonezet) s += '<g id="odu-bolt-jel"><rect x="508" y="444" width="96" height="84" fill="transparent"/>' + boltStandSVG(556, 506) + '</g>';

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
function oduPanelNyit() { ODU_FUL = "ido"; BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null; $("odu-panel").hidden = false; renderOduPanel(); }
function oduPanelZar() { $("odu-panel").hidden = true; var l = $("odu-lap"); if (l) l.hidden = true; }
/* a bolt körüli sötét sávra koppintva is bezárul (a boltra koppintva nem) */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var pan = document.getElementById("odu-panel");
    if (pan) pan.addEventListener("click", function (e) { if (e.target === pan) { hangGomb(); oduPanelZar(); } });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   A BOLT — „Kincseskamra + dumáló bagoly"
   A grafikai session végleges terve (mockup-bolt-vegleges.html, 2026-09-08).

   Diagnózis volt: a rajzolt Csillagbolt a UI MÖGÖTT ült, és átlátszatlan kártyák
   takarták — ezért nem segített a háttér halványítása, a KÁRTYÁKAT kellett
   megszüntetni. Itt az egész bolt EGYETLEN 880×520 SVG:
     · a tárgyak fizikailag a fapolcon állnak, saját talaj-árnyékkal
     · lógó árcédulák a polc éléről (a kiválasztotté arany) — szöveg nélkül is „bolt"
     · a kiválasztott tárgy megemelkedik és felragyog (nem keret, nem pipa)
     · az adatlap falra tűzött papírcédula, nem UI-panel
     · előtér-pult alul → mélység
     · bagoly-boltos a bal alsó sarokban: FIXEN ül, csak a szárnya és a pupillái
       fordulnak (producer-döntés: a boltos szereplő, nem kurzor)
   ═══════════════════════════════════════════════════════════════════════════ */

var BOLT_W = 880, BOLT_H = 520;
var BOLT_POLC_FELSO = 250, BOLT_POLC_ALSO = 430;
var BOLT_LAP = {};             /* fülönként: hányadik oldalon (csoporton) állunk */
var BOLT_BAGOLY_EXTRA = null;  /* átmeneti bagoly-mondat (pl. vásárlás után) */

/* ── oldalak: egy csoport = egy oldal; a 7-nél nagyobb csoport több oldalra bomlik ── */
function boltOldalak() {
  var lapok = [], most = [];
  boltCsoportok().forEach(function (cs) {
    cs.tetelek.forEach(function (t) {
      most.push({ cs: cs, t: t });
      if (most.length === 7) { lapok.push(most); most = []; }
    });
  });
  if (most.length) lapok.push(most);
  return lapok.map(function (tetelek) {
    var nevek = [];
    tetelek.forEach(function (e) { if (nevek.indexOf(e.cs.nev) < 0) nevek.push(e.cs.nev); });
    return { nev: nevek.join(" · "), tetelek: tetelek };
  });
}
/* az aktuális oldal indexe — mindig a kiválasztott tételt tartalmazó oldal */
function boltAktOldal() {
  var old = boltOldalak(), sel = BOLT_VAL[ODU_FUL], i, j;
  if (sel) for (i = 0; i < old.length; i++)
    for (j = 0; j < old[i].tetelek.length; j++) {
      var e = old[i].tetelek[j];
      if (e.cs.kulcs === sel.g && String(e.t.id) === String(sel.id)) return i;
    }
  var l = BOLT_LAP[ODU_FUL] || 0;
  return Math.max(0, Math.min(l, old.length - 1));
}
/* 7 polchely: felül max 4, alul max 3 (a bal alsó sarok a bagolyé) */
function boltHelyek(n) {
  var f = (n <= 4) ? n : (n <= 6 ? Math.ceil(n / 2) : 4), a = n - f, ki = [], i;
  for (i = 0; i < f; i++) ki.push({ x: 305 - (f - 1) * 50 + i * 100, y: BOLT_POLC_FELSO, felso: true });
  for (i = 0; i < a; i++) ki.push({ x: 385 - (a - 1) * 52.5 + i * 105, y: BOLT_POLC_ALSO, felso: false });
  return ki;
}

/* ── a bagoly-boltos: 3 póz, csak a szárny-path és a pupillák térnek el ── */
var BOLT_BAGOLY_POZ = {
  nyugalmi: { szarny: "M28 -40 Q40 -30 35 -16 Q26 -24 26 -38 Z", bal: [-11, -43], jobb: [11, -43] },
  fel:      { szarny: "M28 -44 Q52 -54 66 -66 Q56 -44 34 -34 Z", bal: [-10, -47], jobb: [12, -47] },
  oldal:    { szarny: "M28 -34 Q54 -34 70 -30 Q54 -22 32 -24 Z", bal: [-7, -43],  jobb: [15, -43] }
};
function boltBagolySVG(poz) {
  var p = BOLT_BAGOLY_POZ[poz] || BOLT_BAGOLY_POZ.nyugalmi;
  function szem(c) {   /* a fénypötty mindig 2 px-szel balra és 3 px-szel fölé */
    return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="#4a3b2a"/>' +
           '<circle cx="' + (c[0] - 2) + '" cy="' + (c[1] - 3) + '" r="1.8" fill="#fff"/>';
  }
  return '<g class="bolt-bagoly" transform="translate(140,430)">' +
    '<ellipse cx="0" cy="3" rx="32" ry="5" fill="#3b2f66" opacity="0.18"/>' +
    '<g stroke="#e8a23d" stroke-width="3.4" stroke-linecap="round" fill="none">' +
      '<path d="M-11 -8 v10"/><path d="M11 -8 v10"/><path d="M-15 2 h9 M-11 2 v3"/><path d="M7 2 h9 M11 2 v3"/></g>' +
    '<ellipse cx="0" cy="-36" rx="31" ry="35" fill="#c9a06a" stroke="#222" stroke-width="2.2"/>' +
    '<ellipse cx="0" cy="-28" rx="21" ry="25" fill="#e9d3ad"/>' +
    '<path d="M-28 -62 l10 18 l11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
    '<path d="M28 -62 l-10 18 l-11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
    '<circle cx="-11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
    '<circle cx="11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
    '<g class="bolt-bagoly-szem">' + szem(p.bal) + szem(p.jobb) + '</g>' +
    '<path d="M0 -34 l-5 7 l10 0 Z" fill="#e8a23d" stroke="#222" stroke-width="1.6"/>' +
    '<path d="M-19 -16 Q0 -21 19 -16 Q21 -4 18 4 Q0 9 -18 4 Q-21 -4 -19 -16 Z" fill="#f7b8d0" stroke="#e79ac0" stroke-width="1.8"/>' +
    '<path d="M-8 -10 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#fff2c4"/>' +
    '<path class="bolt-bagoly-szarny" d="' + p.szarny + '" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
  '</g>';
}
/* mit mond a boltos — ez nem dísz: egy 6-7 éves nem tud fejben kivonni,
   a bagoly mondja meg, futja-e (és a buborékra koppintva fel is olvassa) */
function boltBagolySzoveg(k) {
  if (BOLT_BAGOLY_EXTRA) return BOLT_BAGOLY_EXTRA;
  if (!k) return "Nézz csak körül nyugodtan!";
  var cs = k.cs, t = k.t, p = P().csillampor;
  var kint = (cs.fajta === "ruha" || cs.fajta === "kinezet");
  if (boltAktiv(cs, t)) return kint ? "Ez van most rajtad — jól áll!" : "Ez van most kint — jól néz ki!";
  if (boltBirt(cs, t)) return "Ez már a tiéd! " + (kint ? "Fel is veheted." : "Ki is teheted.");
  if (p >= t.ar) return "Van rá elég! Marad " + (p - t.ar) + " ✨";
  return "Még " + (t.ar - p) + " ✨ kell hozzá — gyűjts egy kicsit!";
}

/* ── a nagy gomb állapota (a régi boltGombRajzol döntési fája, SVG-hez) ── */
function boltGombAllapot(cs, t, birt, aktiv, eleg) {
  if (birt) {
    if (cs.fajta === "ruha") return aktiv
      ? { szoveg: "Leveszem", szin: "le", mit: function () { oduRuhaVisel(cs.kulcs, null); } }
      : { szoveg: "Felveszem", szin: "fel", mit: function () { oduRuhaVisel(cs.kulcs, t.id); } };
    if (aktiv) return { szoveg: (cs.fajta === "kinezet") ? "✓ ez van rajta" : "✓ ez van kint", szin: "kesz", mit: null };
    if (cs.fajta === "butor") return { szoveg: "Berendezem", szin: "fel", mit: function () { oduButorBeallit(cs.kulcs, t.id); } };
    if (cs.fajta === "disz") return (t.id === "nincs")
      ? { szoveg: "Leszedem", szin: "le", mit: function () { oduDiszBeallit(cs.kulcs, "nincs"); } }
      : { szoveg: "Kirakom", szin: "fel", mit: function () { oduDiszBeallit(cs.kulcs, t.id); } };
    if (cs.fajta === "kinezet") return { szoveg: "Beállítom", szin: "fel", mit: function () { oduKinezetBeallit(cs.kulcs, t.id); } };
    return { szoveg: "Beállítom", szin: "fel", mit: function () { oduBeallit(cs.kulcs, t.id); } };
  }
  if (!eleg) return { szoveg: "még " + (t.ar - P().csillampor) + " ✨ kell", szin: "keves", mit: null };
  return { szoveg: "Megveszem ✨" + t.ar, szin: "vesz", mit: function () {
    if (t.ar >= 60) { BOLT_MEGEROSIT = true; renderOduPanel(); } else boltVegrehajt(cs, t);
  } };
}
var BOLT_LAPSZAM = "";        /* „2 / 3" — a pult sarkára kerül, nem az árcédulákra */
var BOLT_MEGEROSIT = false;   /* a drága tételnél a „Biztos?" lépés fut-e épp */

/* ── a tárgy a polcon ── */
function boltPolcTargy(cs, t, hely, kival, idx) {
  var x = hely.x, y = hely.y, emel = kival ? 14 : 0, ty = y - emel, s = "";
  if (kival) s += '<ellipse cx="' + x + '" cy="' + (ty - 46) + '" rx="54" ry="50" fill="#ffe9ad" opacity="0.5"/>';
  s += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="' + (kival ? 22 : 20) + '" ry="4" fill="#3b2f66" opacity="' + (kival ? 0.13 : 0.16) + '"/>';
  var belso = boltThumbBelso(cs, t);
  if (cs.fajta === "butor" || cs.fajta === "ido") {
    /* a szoba- és ég-minta nem tárgy: keretezett bolti minta, ami a polcon áll */
    var cid = "boltkeret-" + ODU_FUL + "-" + idx;
    s += '<g transform="translate(' + x + ',' + ty + ')">' +
      '<defs><clipPath id="' + cid + '"><rect x="-38" y="-78" width="76" height="72" rx="5"/></clipPath></defs>' +
      '<rect x="-42" y="-84" width="84" height="84" rx="7" fill="#f7ecd8" stroke="#c9a06a" stroke-width="2.6"/>' +
      '<g clip-path="url(#' + cid + ')"><g transform="translate(0,-42)"><g data-fit="76,72" data-fit-mod="kozep">' + belso + '</g></g></g>' +
      '</g>';
  } else {
    s += '<g transform="translate(' + x + ',' + ty + ')"><g data-fit="78,80">' + belso + '</g></g>';
  }
  if (kival) {
    s += '<path d="M' + (x - 34) + ' ' + (ty - 74) + ' l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6 Z" fill="#ffe08a"/>';
    s += '<path d="M' + (x + 38) + ' ' + (ty - 42) + ' l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/>';
  }
  /* lógó árcédula a polc éléről */
  var ar = (t.ar === 0) ? "alap" : (t.ar + " ✨"), w = kival ? 46 : 42;
  s += '<g class="bolt-cedula">' +
    '<path d="M' + x + ' ' + (y + 19) + ' v9" stroke="' + (kival ? "#ffb300" : "#c9a06a") + '" stroke-width="' + (kival ? 1.8 : 1.4) + '"/>' +
    '<rect x="' + (x - w / 2) + '" y="' + (y + 28) + '" width="' + w + '" height="20" rx="6" fill="' + (kival ? "#fff3cf" : "#fdf4d8") + '" stroke="' + (kival ? "#ffb300" : "#e6d3a8") + '" stroke-width="' + (kival ? 2 : 1.3) + '"/>' +
    '<text x="' + x + '" y="' + (y + 42) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7a5a2a">' + ar + '</text></g>';
  return s;
}
/* a meglévő boltThumb <svg> burkolat nélkül — a méretezést a getBBox-os igazítás végzi */
function boltThumbBelso(cs, t) {
  if (cs.fajta === "ido") {   /* négyzetes ég-minta, hogy kitöltse a keretet */
    var o = P().odu;
    return (cs.kulcs === "napszak" ? oduEgSVG(t.id, 96, 88) : oduEgSVG(o.napszak, 96, 88) + oduIdoSVG(t.id, 96, 88, 8));
  }
  var h = boltThumb(cs, t);
  return h.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/* ── a teljes bolt-színtér ── */
function boltSzinterSVG() {
  var oldalak = boltOldalak(), oi = boltAktOldal(), o = oldalak[oi];
  var k = boltKivalasztott();
  var s = '<svg class="bolt-szinter-svg" viewBox="0 0 880 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';
  /* háttér: bolt-belső, boltív */
  s += '<rect width="880" height="520" fill="#2e2350"/>';
  s += '<path d="M20 520 L20 150 Q20 40 440 24 Q860 40 860 150 L860 520 Z" fill="#b79fd4"/>';
  s += '<path d="M52 520 L52 165 Q52 66 440 52 Q828 66 828 165 L828 520 Z" fill="#cbb6e6"/>';
  s += '<g stroke="#ab90cf" stroke-width="2.5" opacity="0.4" fill="none">' +
    '<path d="M170 150 Q178 300 170 500"/><path d="M330 130 Q338 300 332 500"/>' +
    '<path d="M620 130 Q613 300 620 500"/><path d="M770 150 Q763 300 770 500"/></g>';
  s += '<ellipse cx="300" cy="300" rx="270" ry="230" fill="#ffd9ec" opacity="0.06"/>';
  /* cégér + zászlófüzér */
  s += '<path d="M170 84 Q440 112 710 84" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  s += '<g><path d="M232 96 l14 0 l-7 12 Z" fill="#f6a5c0"/><path d="M286 101 l14 0 l-7 12 Z" fill="#a7d99a"/>' +
    '<path d="M340 104 l14 0 l-7 12 Z" fill="#fce49a"/><path d="M526 104 l14 0 l-7 12 Z" fill="#c3a5e0"/>' +
    '<path d="M580 101 l14 0 l-7 12 Z" fill="#9ec9f0"/><path d="M634 96 l14 0 l-7 12 Z" fill="#f6a5c0"/></g>';
  s += '<rect x="376" y="46" width="128" height="38" rx="10" fill="#a88fce" stroke="#8f7ab8" stroke-width="1.6"/>';
  s += '<path d="M396 66 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fdf0d0"/>';
  s += '<path d="M484 66 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fdf0d0"/>';
  s += '<text x="440" y="71" font-size="17" font-weight="700" fill="#fdf0d0" text-anchor="middle">Csillagbolt</text>';
  /* fülek: lógó fatáblák */
  BOLT_FULEK.forEach(function (f, i) {
    var akt = (f.id === ODU_FUL), fx = 62 + i * 80;
    s += '<g class="bolt-ful-jel"' + (akt ? "" : ' opacity="0.62"') + '>' +
      '<path d="M' + (fx + 35) + ' 118 v10" stroke="#8f6a3e" stroke-width="2"/>' +
      '<rect x="' + fx + '" y="128" width="70" height="26" rx="7" fill="' + (akt ? "#e0b47e" : "#d3c0ea") + '" stroke="' + (akt ? "#8f6a3e" : "#a88fce") + '" stroke-width="' + (akt ? 1.8 : 1.5) + '"/>' +
      '<text x="' + (fx + 35) + '" y="146" font-size="11.5" font-weight="700" fill="' + (akt ? "#4a3b2a" : "#6a5f88") + '" text-anchor="middle">' + f.nev + '</text></g>';
  });
  /* a polc neve (melyik csoportban vagyunk) */
  /* felső polc */
  s += '<rect x="70" y="250" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="263" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 269 l0 12 M508 269 l0 12" stroke="#c19a72" stroke-width="5"/>';
  /* a tárgyak — a felső polcra tartozók */
  var helyek = o ? boltHelyek(o.tetelek.length) : [], also = "";
  if (o) o.tetelek.forEach(function (e, i) {
    var kival = !!(k && k.cs.kulcs === e.cs.kulcs && String(k.t.id) === String(e.t.id));
    var darab = boltPolcTargy(e.cs, e.t, helyek[i], kival, i);
    if (helyek[i].felso) s += darab; else also += darab;
  });
  /* alsó polc */
  s += '<rect x="70" y="430" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="443" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 449 l0 12 M508 449 l0 12" stroke="#c19a72" stroke-width="5"/>';
  s += boltBagolySVG(!k ? "nyugalmi" : (boltKivalHelye(o, k, helyek) ? "fel" : "oldal"));
  s += also;
  /* beszéd-buborék (a szélességét a második menet igazítja a szöveghez) */
  s += '<g class="bolt-buborek" pointer-events="none">' +
    '<rect class="bolt-buborek-tabla" x="196" y="300" width="298" height="54" rx="16" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<path class="bolt-buborek-csor" d="M252 352 L226 370 L234 352 Z" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<text class="bolt-buborek-szo" x="345" y="331" font-size="15" font-weight="700" fill="#7a5a2a" text-anchor="middle">' + kiiras(boltBagolySzoveg(k)) + '</text>' +
    '<text class="bolt-buborek-hang" x="474" y="321" font-size="13" text-anchor="middle" opacity="0.5">🔊</text></g>';
  /* lapozó fa-nyilak */
  if (oldalak.length > 1) {
    s += '<g class="bolt-nyil-jel" fill="#e0b47e" stroke="#8f6a3e" stroke-width="1.6">' +
      '<path d="M56 336 l-14 13 l14 13 Z"/><path d="M554 336 l14 13 l-14 13 Z"/></g>';
    BOLT_LAPSZAM = (oi + 1) + " / " + oldalak.length;
  } else { BOLT_LAPSZAM = ""; }
  if (0) {
  }
  /* adatlap: falra tűzött cédula */
  s += boltCedulaSVG(k);
  /* előtér: a pult széle → mélység */
  s += '<path d="M0 488 Q440 472 880 488 L880 520 L0 520 Z" fill="#c197bf"/>';
  s += '<path d="M0 488 Q440 472 880 488 L880 498 Q440 482 0 498 Z" fill="#d9b8d6"/>';
  s += '<g><path d="M60 500 l3.2 7.6 l7.6 3.2 l-7.6 3.2 l-3.2 7.6 l-3.2 -7.6 l-7.6 -3.2 l7.6 -3.2 Z" fill="#ffd878"/>' +
    '<text x="84" y="513" font-size="15.5" font-weight="800" fill="#fdf0d0">' + P().csillampor + '</text>' +
    (BOLT_LAPSZAM ? '<text x="440" y="513" font-size="12.5" font-weight="700" fill="#fdf0d0" text-anchor="middle" opacity="0.8">' + BOLT_LAPSZAM + '</text>' : "") + '</g>';
  /* ── legfelső réteg: a láthatatlan találati zónák (a tárgyak szabálytalanok) ── */
  if (o) o.tetelek.forEach(function (e, i) {
    var h = helyek[i];
    s += '<rect class="bolt-fogo" x="' + (h.x - 48) + '" y="' + (h.y - 92) + '" width="96" height="140" fill="transparent"' +
      ' data-mit="valaszt" data-g="' + e.cs.kulcs + '" data-id="' + e.t.id + '"/>';
  });
  BOLT_FULEK.forEach(function (f, i) {
    s += '<rect class="bolt-fogo" x="' + (62 + i * 80) + '" y="118" width="70" height="40" fill="transparent" data-mit="ful" data-ful="' + f.id + '"/>';
  });
  if (oldalak.length > 1) {
    s += '<rect class="bolt-fogo" x="26" y="322" width="44" height="54" fill="transparent" data-mit="lap" data-ir="-1"/>';
    s += '<rect class="bolt-fogo" x="540" y="322" width="44" height="54" fill="transparent" data-mit="lap" data-ir="1"/>';
  }
  s += '<rect class="bolt-fogo" x="196" y="300" width="298" height="54" fill="transparent" data-mit="mondd"/>';
  if (k) s += boltCedulaFogok(k);
  s += '</svg>';
  return s;
}
/* a kiválasztott a FELSŐ polcon van-e (ettől függ a bagoly póza) */
function boltKivalHelye(o, k, helyek) {
  if (!o || !k) return false;
  for (var i = 0; i < o.tetelek.length; i++)
    if (o.tetelek[i].cs.kulcs === k.cs.kulcs && String(o.tetelek[i].t.id) === String(k.t.id))
      return !!(helyek[i] && helyek[i].felso);
  return false;
}

/* ── az adatlap: falra tűzött papírcédula ── */
function boltCedulaSVG(k) {
  var s = '<g class="bolt-cedula-lap">' +
    '<path d="M580 162 Q706 152 832 162 Q840 300 832 456 Q706 468 580 456 Q572 300 580 162 Z" fill="#fdf4e2" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<circle cx="706" cy="160" r="7.5" fill="#f6a5c0" stroke="#222" stroke-width="1.5"/>';
  if (!k) {
    s += '<text x="706" y="310" font-size="13.5" fill="#a08a6a" text-anchor="middle">Válassz valamit a polcról!</text></g>';
    return s;
  }
  var cs = k.cs, t = k.t, birt = boltBirt(cs, t), aktiv = boltAktiv(cs, t), eleg = P().csillampor >= t.ar;
  var rang = (t.ar === 0) ? 0 : (k.rang >= cs.tetelek.length - 1 ? 2 : 1);
  if (rang > 0) s += '<g><rect x="646" y="180" width="120" height="20" rx="10" fill="' + (rang === 2 ? "#ffd24d" : "#f0c869") + '"/>' +
    '<text x="706" y="194" font-size="11" font-weight="800" fill="#7a5a1e" text-anchor="middle">' + (rang === 2 ? "★ RITKA" : "✦ KÜLÖNLEGES") + '</text></g>';
  s += '<text x="706" y="' + (rang > 0 ? 222 : 210) + '" font-size="15.5" font-weight="800" fill="#7a5a2a" text-anchor="middle">' + kiiras(t.nev) + '</text>';
  s += '<text x="706" y="' + (rang > 0 ? 240 : 228) + '" font-size="11" font-weight="700" fill="#c2a887" text-anchor="middle">' + kiiras(cs.nev) + '</text>';
  s += '<text x="706" y="' + (rang > 0 ? 256 : 244) + '" font-size="11.5" fill="#a08a6a" text-anchor="middle">' + kiiras(BOLT_TIPP[t.id] || "") + '</text>';
  /* „így áll rajtad" előnézet a papíron */
  s += '<ellipse cx="706" cy="318" rx="94" ry="66" fill="#fff8e8"/>';
  s += '<defs><clipPath id="bolt-lap-vago"><ellipse cx="706" cy="318" rx="92" ry="64"/></clipPath></defs>';
  s += '<g clip-path="url(#bolt-lap-vago)"><g transform="translate(706,318)"><g data-fit="176,124" data-fit-mod="kozep">' +
    boltElonezetBelso(cs, t) + '</g></g></g>';
  var cimke = (cs.fajta === "ruha" || cs.fajta === "kinezet") ? "így áll rajtad"
            : (cs.fajta === "ido" ? "ilyen lesz az ég" : "így néz ki a szobád");
  s += '<text x="706" y="398" font-size="11" fill="#a08a6a" text-anchor="middle">' + cimke + '</text>';
  /* ár */
  if (t.ar > 0) {
    s += '<path d="M664 406 l2.8 6.8 l6.8 2.8 l-6.8 2.8 l-2.8 6.8 l-2.8 -6.8 l-6.8 -2.8 l6.8 -2.8 Z" fill="#ffd24d"/>' +
      '<text x="700" y="422" font-size="18" font-weight="800" fill="#7a5a2a">' + t.ar + '</text>';
  } else {
    s += '<text x="706" y="421" font-size="13" font-weight="700" fill="#a08a6a" text-anchor="middle">alap – ingyen</text>';
  }
  /* nagy gomb (vagy a „Biztos?" megerősítés drága tételnél) */
  var g = boltGombAllapot(cs, t, birt, aktiv, eleg);
  var szin = { vesz: ["#a7d99a", "#7bbd7a", "#2f5f2b"], fel: ["#9ec9f0", "#6fa8d8", "#1e3f5f"],
               le: ["#efe3f7", "#cdbce6", "#6a5a90"], kesz: ["#e9e2d2", "#d5c9b0", "#8a7a5a"],
               keves: ["#ecdfe2", "#d8c2c8", "#8a6a72"] }[g.szin] || ["#e9e2d2", "#d5c9b0", "#8a7a5a"];
  if (BOLT_MEGEROSIT && !birt) {
    s += '<rect x="610" y="410" width="192" height="32" rx="16" fill="#a7d99a" stroke="#7bbd7a" stroke-width="2"/>' +
      '<text x="706" y="431" font-size="13.5" font-weight="800" fill="#2f5f2b" text-anchor="middle">Biztos? Megveszem</text>' +
      '<rect x="610" y="448" width="192" height="26" rx="13" fill="#efe3f7" stroke="#cdbce6" stroke-width="1.8"/>' +
      '<text x="706" y="466" font-size="12.5" font-weight="700" fill="#6a5a90" text-anchor="middle">Mégse</text>';
  } else {
    s += '<rect x="610" y="428" width="192" height="36" rx="18" fill="' + szin[0] + '" stroke="' + szin[1] + '" stroke-width="2"' + (g.mit ? "" : ' opacity="0.75"') + '/>' +
      '<text x="706" y="452" font-size="14.5" font-weight="800" fill="' + szin[2] + '" text-anchor="middle">' + kiiras(g.szoveg) + '</text>';
  }
  return s + '</g>';
}
function boltCedulaFogok(k) {
  var cs = k.cs, t = k.t;
  if (BOLT_MEGEROSIT && !boltBirt(cs, t))
    return '<rect class="bolt-fogo" x="610" y="410" width="192" height="32" fill="transparent" data-mit="megerosit"/>' +
           '<rect class="bolt-fogo" x="610" y="448" width="192" height="26" fill="transparent" data-mit="megse"/>';
  return '<rect class="bolt-fogo" x="610" y="428" width="192" height="36" fill="transparent" data-mit="gomb"/>';
}
/* az adatlap előnézete: a régi boltAdatlapRajzol tartalma, <svg> burkolat nélkül */
function boltElonezetBelso(cs, t) {
  var h;
  if (cs.fajta === "ruha") { var pr = {}; pr[cs.kulcs] = t.id; h = unikornisSVG("bap", LENYEK[mentes.leny], 1, pr); }
  else if (cs.fajta === "butor") h = oduSVG(mentes.leny, butorPreviewOdu(cs.kulcs, t.id), true);
  else if (cs.fajta === "disz") h = oduSVG(mentes.leny, diszPreviewOdu(cs.kulcs, t.id), true);
  else if (cs.fajta === "kinezet") h = unikornisSVG("bkp", LENYEK[mentes.leny], 1, P().oltozet, kinezetPreview(cs.kulcs, t.id));
  else {
    var o2 = P().odu;
    h = (cs.kulcs === "napszak" ? oduEgSVG(t.id, 144, 96) : oduEgSVG(o2.napszak, 144, 96) + oduIdoSVG(t.id, 144, 96, 10));
  }
  return h.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/* ── második menet: mindent a helyére igazítunk (getBBox alapján) ── */
function boltIgazit(gyoker) {
  var volt = false;
  [].forEach.call(gyoker.querySelectorAll("[data-fit]"), function (g) {
    var b; try { b = g.getBBox(); } catch (e) { return; }
    if (!b || b.width <= 0 || b.height <= 0) return;
    volt = true;
    var m = g.getAttribute("data-fit").split(","), sz = +m[0], ma = +(m[1] || m[0]);
    var s = Math.min(sz / b.width, ma / b.height);
    var dx = -(b.x + b.width / 2) * s;
    var dy = (g.getAttribute("data-fit-mod") === "kozep") ? -(b.y + b.height / 2) * s : -(b.y + b.height) * s;
    g.setAttribute("transform", "translate(" + dx.toFixed(1) + "," + dy.toFixed(1) + ") scale(" + s.toFixed(4) + ")");
  });
  /* a buborék a szöveghez igazodik, legfeljebb 2 sorban */
  var szo = gyoker.querySelector(".bolt-buborek-szo"), tab = gyoker.querySelector(".bolt-buborek-tabla"),
      csor = gyoker.querySelector(".bolt-buborek-csor"), hang = gyoker.querySelector(".bolt-buborek-hang"),
      fogo = gyoker.querySelector('[data-mit="mondd"]');
  if (szo && tab) {
    var sz = 0; try { sz = szo.getComputedTextLength(); } catch (e) {}
    if (sz) {
      var w = Math.max(200, Math.min(320, sz + 62)), bal = 345 - w / 2;
      tab.setAttribute("x", bal.toFixed(1)); tab.setAttribute("width", w.toFixed(1));
      if (hang) hang.setAttribute("x", (bal + w - 20).toFixed(1));
      if (csor) csor.setAttribute("d", "M" + (bal + 56) + " 352 L" + (bal + 30) + " 370 L" + (bal + 38) + " 352 Z");
      if (fogo) { fogo.setAttribute("x", bal.toFixed(1)); fogo.setAttribute("width", w.toFixed(1)); }
    }
  }
  return volt;
}

/* ── a bolt kirajzolása + a koppintások bekötése ── */
var BOLT_FULEK = [
  { id: "holmik", nev: "Holmik" }, { id: "kinezet", nev: "Kinézet" },
  { id: "kellekek", nev: "Kellékek" }, { id: "ido", nev: "Időjárás" }
];
function renderOduPanel() {
  var host = $("odu-bolt-szinter");
  if (!host) return;
  host.innerHTML = boltSzinterSVG();
  var svg = host.querySelector("svg");
  if (!svg) return;
  if (!boltIgazit(svg)) requestAnimationFrame(function () { boltIgazit(svg); });   /* ha még nem volt látható */
  [].forEach.call(svg.querySelectorAll(".bolt-fogo"), function (r) {
    r.addEventListener("click", function () { boltKoppint(r); });
  });
}
function boltKoppint(r) {
  var mit = r.getAttribute("data-mit");
  if (mit === "valaszt") {
    BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    boltValaszt(r.getAttribute("data-g"), boltTetelId(r.getAttribute("data-g"), r.getAttribute("data-id")));
    return;
  }
  if (mit === "ful") {
    hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    ODU_FUL = r.getAttribute("data-ful"); renderOduPanel(); return;
  }
  if (mit === "lap") {
    hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    var old = boltOldalak(), i = boltAktOldal() + (+r.getAttribute("data-ir"));
    i = (i + old.length) % old.length;
    BOLT_LAP[ODU_FUL] = i;
    var o = old[i];
    if (o && o.tetelek[0]) BOLT_VAL[ODU_FUL] = { g: o.tetelek[0].cs.kulcs, id: o.tetelek[0].t.id };
    renderOduPanel(); return;
  }
  if (mit === "mondd") { hangGomb(); mondd(boltBagolySzoveg(boltKivalasztott())); return; }
  if (mit === "megse") { hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null; renderOduPanel(); return; }
  var k = boltKivalasztott(); if (!k) return;
  if (mit === "megerosit") { BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = "Jó választás! Csomagolom is."; boltVegrehajt(k.cs, k.t); return; }
  if (mit === "gomb") {
    var g = boltGombAllapot(k.cs, k.t, boltBirt(k.cs, k.t), boltAktiv(k.cs, k.t), P().csillampor >= k.t.ar);
    if (!g.mit) { hangGomb(); BOLT_BAGOLY_EXTRA = null; renderOduPanel(); mondd(boltBagolySzoveg(k)); return; }
    /* a „Csomagolom is." csak a friss vétel után áll meg — minden más gomb visszaadja a szót a helyzetnek */
    BOLT_BAGOLY_EXTRA = (g.szin === "vesz" && k.t.ar < 60) ? "Jó választás! Csomagolom is." : null;
    g.mit();
  }
}
/* a data-id attribútumból a tétel eredeti típusú azonosítója (szám vagy szöveg) */
function boltTetelId(gk, id) {
  var csk = boltCsoportok(), i, j;
  for (i = 0; i < csk.length; i++) if (csk[i].kulcs === gk)
    for (j = 0; j < csk[i].tetelek.length; j++) if (String(csk[i].tetelek[j].id) === String(id)) return csk[i].tetelek[j].id;
  return id;
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
  if (ODU_FUL === "kellekek")
    return BUTOR_HELY.map(function (h) { return { kulcs: h.kulcs, nev: h.nev, fajta: "butor", tetelek: ODU_BUTOR[h.kulcs] || [] }; })
      .concat(DISZ_ZONA.map(function (z) { return { kulcs: z.kulcs, nev: z.nev, fajta: "disz", tetelek: diszZonaTetelek(z.kulcs) }; }));
  if (ODU_FUL === "kinezet") {
    var rajz = LENYEK[mentes.leny].rajz;
    return [
      { kulcs: "soreny", nev: "Sörény színe", fajta: "kinezet", tetelek: (SORENY_SZIN[rajz] || []).map(function (v, i) { return { id: i, nev: v.nev, ar: i === 0 ? 0 : 60 }; }) },
      { kulcs: "szem", nev: "Szemszín", fajta: "kinezet", tetelek: SZEM_SZIN.map(function (v, i) { return { id: i, nev: v.nev, ar: i === 0 ? 0 : 30 }; }) }
    ];
  }
  return [];
}
function boltBirt(cs, t) {
  if (cs.fajta === "ruha") return !!P().oltozet.van[t.id];
  if (cs.fajta === "butor") return t.id === 1 || !!(P().odu.vanButor[cs.kulcs] && P().odu.vanButor[cs.kulcs][t.id]);
  if (cs.fajta === "disz") return t.id === "nincs" || !!P().odu.vanDisz[t.id];
  if (cs.fajta === "kinezet") { var v = cs.kulcs === "soreny" ? P().kinezet.vanSoreny : P().kinezet.vanSzem; return t.id === 0 || !!(v && v[t.id]); }
  return !!P().odu.van[cs.kulcs][t.id];
}
function boltAktiv(cs, t) {
  if (cs.fajta === "ruha") return P().oltozet[cs.kulcs] === t.id;
  if (cs.fajta === "butor") return ((P().odu.szint && P().odu.szint[cs.kulcs]) || 1) === t.id;
  if (cs.fajta === "disz") return (P().odu.disz[cs.kulcs] || "nincs") === t.id;
  if (cs.fajta === "kinezet") {
    if (cs.kulcs === "soreny") return (P().kinezet.sorenySzin || 0) === t.id;
    return (P().kinezet.szemSzin || null) === (SZEM_SZIN[t.id] ? SZEM_SZIN[t.id].hex || null : null);
  }
  return P().odu[cs.kulcs] === t.id;
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

/* A 18 ruha „polc-pózban" — a tárgy MAGA, a bolti polcon fekve/lógva (nem mini-unikornison).
   Visszaállítva 2026-09-06, producer-kérésre (a mini-unikornisos bélyegkép helyett). */
var POLC_POZ = {
  "fej-a":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M80 110 Q105 88 130 110" fill="none" stroke="#a7d99a" stroke-width="1.6" opacity="0.6"/>' +
    '<g stroke="#222" stroke-width="0.7"><circle cx="80" cy="110" r="4.5" fill="#f6a5c0"/><circle cx="92" cy="98" r="4.5" fill="#fce49a"/><circle cx="105" cy="93" r="4.5" fill="#a7d99a"/><circle cx="118" cy="98" r="4.5" fill="#9ec9f0"/><circle cx="130" cy="110" r="4.5" fill="#c9a8e6"/></g>' +
    '<g fill="#ffd24d" stroke="none"><circle cx="80" cy="110" r="1.6"/><circle cx="92" cy="98" r="1.6"/><circle cx="105" cy="93" r="1.6"/><circle cx="118" cy="98" r="1.6"/><circle cx="130" cy="110" r="1.6"/></g>',
  "fej-k":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M80 108 Q105 90 130 108" fill="none" stroke="#e6c34d" stroke-width="3.5"/>' +
    '<path d="M105 82 l3.5 9 l9.5 0.7 l-7.5 6 l2.8 9.2 l-8.3 -5.4 l-8.3 5.4 l2.8 -9.2 l-7.5 -6 l9.5 -0.7 Z" fill="#ffd24d" stroke="#222" stroke-width="1"/>',
  "fej-r":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M78 112 Q80 90 91 89 l4 8 l7 -11 l7 11 l4 -8 Q120 90 122 112 Z" fill="#d9c7ec" stroke="#222" stroke-width="1.2"/>' +
    '<path d="M108 82 a10 10 0 1 0 7 17 a8 8 0 1 1 -7 -17 Z" fill="#fdf0d0" stroke="#c9a8e6" stroke-width="1"/>' +
    '<circle cx="88" cy="103" r="2" fill="#ffd24d"/><circle cx="122" cy="103" r="2" fill="#9ec9f0"/>',
  "nyak-a":
    '<rect x="92" y="66" width="26" height="7" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1"/><circle cx="120" cy="69.5" r="4" fill="#cbb6e6" stroke="#222" stroke-width="1"/>' +
    '<path d="M96 74 C82 92 82 138 105 148 C128 138 128 92 114 74" fill="none" stroke="#8a6a4a" stroke-width="3.4"/>' +
    '<circle cx="86" cy="98" r="2.6" fill="#a9814e"/><circle cx="124" cy="98" r="2.6" fill="#a9814e"/>' +
    '<ellipse cx="105" cy="152" rx="8" ry="10" fill="#c08a52" stroke="#222" stroke-width="1.2"/>' +
    '<path d="M96 148 q9 -7 18 0 l0 -4 q-9 -6 -18 0 Z" fill="#8a6a4a" stroke="#222" stroke-width="1"/><path d="M105 140 v-5" stroke="#8a6a4a" stroke-width="2.4"/>',
  "nyak-k": /* polc-poz-mintak.svg mintája */
    '<rect x="96" y="96" width="30" height="8" rx="4" fill="#b79fd4" stroke="#222" stroke-width="1.4"/><circle cx="128" cy="100" r="5" fill="#cbb6e6" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M104 104 C90 124 90 176 118 190 C146 176 146 124 132 104" fill="none" stroke="#c9a06a" stroke-width="1.4" opacity="0.5"/>' +
    '<g fill="#ffd24d"><circle cx="103" cy="107" r="2.6"/><circle cx="97" cy="124" r="2.6"/><circle cx="96" cy="142" r="2.6"/><circle cx="100" cy="160" r="2.6"/><circle cx="108" cy="176" r="2.6"/><circle cx="118" cy="184" r="2.6"/><circle cx="128" cy="176" r="2.6"/><circle cx="136" cy="160" r="2.6"/><circle cx="140" cy="142" r="2.6"/><circle cx="139" cy="124" r="2.6"/><circle cx="133" cy="107" r="2.6"/></g>' +
    '<path d="M118 186 v6" stroke="#ffd24d" stroke-width="2"/>' +
    '<path d="M118 192 c-4 -3.4 -9 -1.4 -9 3 c0 5.6 9 11 9 11 c0 0 9 -5.4 9 -11 c0 -4.4 -5 -6.4 -9 -3 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M133 182 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill="#fff2c4" stroke="none"/>',
  "nyak-r":
    '<rect x="92" y="66" width="26" height="7" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1"/><circle cx="120" cy="69.5" r="4" fill="#cbb6e6" stroke="#222" stroke-width="1"/>' +
    '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
    '<path d="M97 74 Q104 68 111 74" fill="none" stroke="#f6a5c0" stroke-width="6"/>' +
    '<path d="M86 76 Q80 120 76 168 L90 168 Q94 120 98 78 Z" fill="#f6a5c0"/><path d="M124 76 Q130 120 134 168 L120 168 Q116 120 112 78 Z" fill="#f6a5c0"/>' +
    '<path d="M84 90 Q105 80 126 90" fill="none" stroke="#fce49a" stroke-width="3"/><path d="M85 98 Q105 90 125 98" fill="none" stroke="#a7d99a" stroke-width="2.4"/>' +
    '</g><path d="M80 168 l2 10 l5 -8 Z" fill="#9ec9f0"/><path d="M128 168 l3 9 l4 -9 Z" fill="#c9a8e6"/>',
  "hat-a":
    '<rect x="20" y="172" width="170" height="11" rx="3" fill="#d9b48a"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<rect x="55" y="150" width="100" height="18" rx="3" fill="#cbbde6"/><rect x="59" y="134" width="92" height="18" rx="3" fill="#dcd0ec"/><rect x="63" y="118" width="84" height="18" rx="3" fill="#e9ddf3"/>' +
    '<path d="M63 118 q-7 25 0 50" fill="none" stroke="#8f7ab8" stroke-width="1.2"/><path d="M70 126 q40 -5 74 0" fill="none" stroke="#c9b8e0" stroke-width="1.6"/>' +
    '</g>',
  "hat-k": /* polc-poz-mintak.svg mintája */
    '<rect x="66" y="188" width="110" height="18" rx="3" fill="#b58fd8" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<rect x="70" y="172" width="102" height="18" rx="3" fill="#c9a8e6" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<rect x="74" y="156" width="94" height="18" rx="3" fill="#d7c4ee" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M74 156 q-8 24 0 50" fill="none" stroke="#8f7ab8" stroke-width="1.4"/><path d="M84 164 q37 -6 66 0" fill="none" stroke="#ffd24d" stroke-width="2" stroke-dasharray="5 3"/>' +
    '<path d="M117 158 l2.5 6 l6.5 0.6 l-5 4.4 l1.6 6.4 l-5.6 -3.6 l-5.6 3.6 l1.6 -6.4 l-5 -4.4 l6.5 -0.6 Z" fill="#fff6d8"/>',
  "hat-r":
    '<rect x="20" y="172" width="170" height="11" rx="3" fill="#d9b48a"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<rect x="55" y="150" width="100" height="18" rx="3" fill="#4f4590"/><rect x="59" y="134" width="92" height="18" rx="3" fill="#5a4fa0"/><rect x="63" y="118" width="84" height="18" rx="3" fill="#6a5fb0"/>' +
    '<path d="M82 124 l1.6 4 l4 0.4 l-3 2.8 l1 4 l-3.6 -2.3 l-3.6 2.3 l1 -4 l-3 -2.8 l4 -0.4 Z" fill="#fff6d8" stroke="none"/><circle cx="122" cy="126" r="1.6" fill="#fff6d8" stroke="none"/><circle cx="103" cy="115" r="3" fill="#ffd24d"/>' +
    '</g>',
  "lab-a":
    '<path d="M55 92 h100 M60 92 v-9 M150 92 v-9" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
    '<rect x="78" y="98" width="24" height="30" rx="4" fill="#a7d99a"/><path d="M90 98 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>' +
    '<rect x="112" y="98" width="24" height="30" rx="4" fill="#a7d99a"/><path d="M124 98 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>' +
    '</g>',
  "lab-k": /* polc-poz-mintak.svg mintája */
    '<ellipse cx="128" cy="177" rx="30" ry="7" fill="#c9b8e0" stroke="#222" stroke-width="1.4"/>' +
    '<rect x="123" y="107" width="10" height="70" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M128 107 q14 0 14 12" fill="none" stroke="#b79fd4" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M130 123 Q130 143 146 143 Q162 143 162 123" fill="none" stroke="#cfd6de" stroke-width="6" stroke-linecap="round"/>' +
    '<g fill="#eef2f6" stroke="none"><circle cx="134" cy="137" r="1.4"/><circle cx="146" cy="143" r="1.4"/><circle cx="158" cy="137" r="1.4"/></g>' +
    '<path d="M92 167 a10 9 0 0 1 20 0" fill="none" stroke="#f4b8d8" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M102 153 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#fff6d8" stroke="none"/>',
  "lab-r":
    '<path d="M55 92 h100 M60 92 v-9 M150 92 v-9" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke-linecap="round">' +
    '<path d="M78 122 a14 12 0 0 1 28 0" fill="none" stroke="#f4b8d8" stroke-width="5"/><path d="M92 98 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>' +
    '<path d="M114 122 a14 12 0 0 1 28 0" fill="none" stroke="#f4b8d8" stroke-width="5"/><path d="M128 98 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>' +
    '</g>',
  "oldal-a": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
    '<path d="M150 148 Q36 130 52 28 Q112 66 148 92 Q206 122 168 184 Q98 176 150 148 Z" fill="#a7d99a"/>' +
    '<path d="M118 86 Q78 58 42 36 M108 128 Q76 138 50 172 M132 108 Q100 112 70 128" fill="none" stroke="#7fb872" stroke-width="2"/>' +
    '</g><circle cx="150" cy="146" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "oldal-k": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' +
    '<path d="M150 118 Q56 26 22 78 Q54 140 146 132 Z" fill="#c9a8e6"/>' +
    '<path d="M146 132 Q84 172 46 186 Q128 168 152 136 Z" fill="#b58fd8"/>' +
    '<circle cx="58" cy="80" r="7" fill="#f6a5c0"/><circle cx="72" cy="98" r="5" fill="#fce49a"/><circle cx="80" cy="158" r="5.5" fill="#fce49a"/>' +
    '</g><circle cx="149" cy="128" r="3.6" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "oldal-r": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<ellipse cx="112" cy="106" rx="92" ry="78" fill="#ffe9ad" opacity="0.28"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M150 128 Q86 40 26 46 Q66 92 122 122 Z" fill="#ffffff"/><path d="M148 140 Q78 108 20 130 Q74 166 132 152 Z" fill="#fff6e0"/><path d="M144 150 Q94 176 58 186 Q112 172 150 156 Z" fill="#ffffff"/>' +
    '</g><path d="M150 66 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffd24d"/><circle cx="148" cy="146" r="3.6" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "farok-a":
    '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M105 48 Q78 34 70 48 Q78 64 105 48 Z" fill="#f6a5c0"/><path d="M105 48 Q132 34 140 48 Q132 64 105 48 Z" fill="#f6a5c0"/>' +
    '<circle cx="105" cy="48" r="5" fill="#e88bb4"/><path d="M100 54 l-8 20 M110 54 l8 20" fill="none" stroke="#f6a5c0" stroke-width="3"/>' +
    '</g>',
  "farok-k":
    '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M90 40 Q105 32 120 40" fill="none" stroke="#c9a8e6" stroke-width="4"/>' +
    '<path d="M97 46 q-8 0 -8 10 l0 7 l18 0 l0 -7 q0 -10 -8 -10 Z" fill="#ffd24d"/><circle cx="97.5" cy="66" r="2.6" fill="#e0a52e"/><circle cx="97" cy="42" r="2.6" fill="#ffe6a0"/>' +
    '</g>',
  "farok-r":
    '<path d="M105 20 v12 M105 20 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke-linejoin="round">' +
    '<path d="M105 34 Q84 62 68 96" fill="none" stroke="#fff2c4" stroke-width="12" stroke-linecap="round" opacity="0.5"/>' +
    '<path d="M105 34 Q86 60 72 94" fill="none" stroke="#ffe08a" stroke-width="5" stroke-linecap="round" opacity="0.9"/>' +
    '<path d="M68 96 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffe08a" stroke="#222" stroke-width="1.3"/>' +
    '</g>'
};
function boltThumb(cs, t) {
  if (cs.fajta === "ruha") {
    /* a tárgy maga a polcon (POLC_POZ), nem mini-unikornison — producer-kérés (2026-09-06) */
    var poz = POLC_POZ[t.id];
    if (poz) return '<svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">' + poz + '</svg>';
    var p = {}; p[cs.kulcs] = t.id;
    return '<svg viewBox="-92 -150 184 172" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("bt-" + t.id, LENYEK[mentes.leny], 1, p) + '</svg>';
  }
  if (cs.fajta === "butor") return oduSVG(mentes.leny, butorPreviewOdu(cs.kulcs, t.id), true);   /* mini-szoba a szinttel */
  if (cs.fajta === "kinezet") {
    var kn = kinezetPreview(cs.kulcs, t.id);
    return '<svg viewBox="-84 -150 168 168" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("bk-" + cs.kulcs + t.id, LENYEK[mentes.leny], 1, null, kn) + '</svg>';
  }
  if (cs.fajta === "disz") {
    if (t.id === "nincs") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="26" fill="none" stroke="#b08d5e" stroke-width="3.4" stroke-dasharray="5 5"/><path d="M30 30 L50 50 M50 30 L30 50" stroke="#b08d5e" stroke-width="3.4" stroke-linecap="round"/></svg>';
    if (t.id === "extrafuzer") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 30 Q40 46 70 30" stroke="#c9a8e6" stroke-width="1.6" fill="none"/><path d="M15 32 l11 1 l-6 13 Z" fill="#f6a5c0"/><path d="M28 36 l11 1 l-6 13 Z" fill="#fce49a"/><path d="M41 37 l11 0 l-6 13 Z" fill="#a7d99a"/><path d="M54 34 l11 -1 l-6 13 Z" fill="#9ec9f0"/></svg>';
    return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' + DISZ_TARGY[t.id].svg + '</svg>';   /* maga az ikon */
  }
  var o = P().odu;
  return '<svg viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">' +
    (cs.kulcs === "napszak" ? oduEgSVG(t.id, 120, 64) : oduEgSVG(o.napszak, 120, 64) + oduIdoSVG(t.id, 120, 64, 9)) + '</svg>';
}
/* kinézet-előnézet: a jelenlegi kinézet, de a kérdéses tulajdonság a kért értéken */
function kinezetPreview(kulcs, id) {
  var k = P().kinezet, uj = { sorenySzin: k.sorenySzin || 0, szemSzin: k.szemSzin || null };
  if (kulcs === "soreny") uj.sorenySzin = id;
  else uj.szemSzin = SZEM_SZIN[id] ? (SZEM_SZIN[id].hex || null) : null;
  return uj;
}
/* előnézet-odú: a jelenlegi állapot, de a kérdéses hely a kért szinten */
function butorPreviewOdu(hely, level) {
  var o = P().odu, uj = {}, k; for (k in o) uj[k] = o[k];
  uj.szint = {}; for (k in (o.szint || {})) uj.szint[k] = o.szint[k];
  uj.szint[hely] = level; return uj;
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
function boltVegrehajt(cs, t) {
  if (cs.fajta === "ruha") oduRuhaVesz({ kulcs: cs.kulcs }, t);
  else if (cs.fajta === "butor") oduButorVesz(cs.kulcs, t);
  else if (cs.fajta === "disz") oduDiszVesz(cs.kulcs, t);
  else if (cs.fajta === "kinezet") oduKinezetVesz(cs.kulcs, t);
  else oduVesz(cs.kulcs, t);
}
function oduKinezetVesz(kulcs, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar;
  var van = kulcs === "soreny" ? P().kinezet.vanSoreny : P().kinezet.vanSzem;
  van[t.id] = 1;
  oduKinezetBeallit(kulcs, t.id, true);     /* vétel után rögtön fel is vesszük */
}
function oduKinezetBeallit(kulcs, id, vetel) {
  if (kulcs === "soreny") P().kinezet.sorenySzin = id;
  else P().kinezet.szemSzin = SZEM_SZIN[id] ? (SZEM_SZIN[id].hex || null) : null;
  if (vetel) { hangCsilla(); hangJo(); } else hangGomb();
  ment(); renderOdu(); renderOduPanel();
}
function oduDiszVesz(zona, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar;
  P().odu.vanDisz[t.id] = 1;
  P().odu.disz[zona] = t.id;                /* vétel után rögtön ki is rakjuk */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduDiszBeallit(zona, id) {
  P().odu.disz[zona] = (id === "nincs") ? null : id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}
function oduButorVesz(hely, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar;
  if (!P().odu.vanButor[hely]) P().odu.vanButor[hely] = {};
  P().odu.vanButor[hely][t.id] = 1;
  P().odu.szint[hely] = t.id;              /* vétel után rögtön ki is tesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduButorBeallit(hely, id) {
  P().odu.szint[hely] = id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
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

/* ============ 10c) JELVÉNYEK · GYŰJTEMÉNY-KÖNYV · TALÁLT TÁRGY ============ */
/* Additív: saját mentés-ág (P().jelvenyek / streakRekord / dropUres), saját DOM
   (#odu-lap + .jelveny-* / .gyujt-* / #talalt-buborek). A pálya-motorba csak
   hívások kerültek (ertekel / felmondSiker / keruloUt / palyaVege). */

/* — sorozat (elsőre jó válaszok egymás után) — a legjobbat a profil őrzi — */
function streakLep(elsore) {
  if (elsore) {
    J.streak = (J.streak || 0) + 1;
    if (J.streak > (P().streakRekord || 0)) P().streakRekord = J.streak;
  } else J.streak = 0;
}

/* — jelvények (nem vásárolható, feloldás) — */
function palyakKeszek(p, idk) { return idk.every(function (id) { return p.palyak[id] && p.palyak[id].kesz; }); }
var JELVENYEK = [
  { id: "elso-bontas", nev: "Első bontás mestere", felt: "Az 1. pálya kész", szin: "#f6a5c0",
    teljesul: function (p) { return palyakKeszek(p, ["bontas-felmondas"]); } },
  { id: "tizes-barat", nev: "Tízes barát", felt: "A 2. és 3. pálya kész", szin: "#a7d99a",
    teljesul: function (p) { return palyakKeszek(p, ["oszkiv-10", "oszkiv-20"]); } },
  { id: "szazas-felfedezo", nev: "Százas felfedező", felt: "A 4–6. pálya kész", szin: "#9ec9f0",
    teljesul: function (p) { return palyakKeszek(p, ["tizesek", "aprok", "lepegeto"]); } },
  { id: "atlepo-bajnok", nev: "Átlépő bajnok", felt: "A 7. és 9. pálya kész", szin: "#c9a8e6",
    teljesul: function (p) { return palyakKeszek(p, ["atlepo", "erdo-szive"]); } },
  { id: "erdo-ura", nev: "Az erdő ura", felt: "Az Összeadó liget mind a 9 pályája kész", szin: "#ffd24d",
    teljesul: function (p) { return PALYAK.every(function (x) { return (x.regio || "osszeado") !== "osszeado" || (p.palyak[x.id] && p.palyak[x.id].kesz); }); } },
  { id: "kitarto", nev: "Kitartó", felt: "5 elsőre jó válasz egymás után", szin: "#f7c59f",
    teljesul: function (p) { return (p.streakRekord || 0) >= 5; } },
  { id: "gyujto", nev: "Gyűjtő", felt: "10 különböző holmi megvan", szin: "#fce49a",
    teljesul: function (p) { return Object.keys(p.oltozet.van || {}).length >= 10; } }
];
function jelvenyEllenoriz() {
  var p = P(), ujak = [];
  JELVENYEK.forEach(function (j) {
    if (!p.jelvenyek[j.id] && j.teljesul(p)) { p.jelvenyek[j.id] = 1; ujak.push(j); }
  });
  if (ujak.length) {
    ment();
    ujak.forEach(function (j, i) { setTimeout(function () { jelvenyUnnepel(j); }, 400 + i * 1700); });
  }
  return ujak;
}
function jelvenyUnnepel(j) {
  hangCsilla();
  bagolyMondat("🏅 Új jelvény: " + j.nev + "!");
}
function jelvenyMedalSVG(j, van) {
  var szin = van ? j.szin : "#c9bfe0";
  return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M22 40 L14 58 L24 52 L30 60 L36 52 L46 58 L38 40 Z" fill="' + (van ? "#f6a5c0" : "#d8cfe8") + '"/>' +
    '<circle cx="30" cy="26" r="20" fill="' + szin + '" stroke="#6a4a8a" stroke-width="2.5"/>' +
    '<circle cx="30" cy="26" r="14" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7"/>' +
    csillagSVG(30, 26, 9, van ? "#fff6d8" : "#efeaf6") +
    '</svg>';
}
function renderJelveny() {
  $("odu-lap-cim").textContent = "🏅 Jelvények";
  var host = $("odu-lap-tartalom"); host.innerHTML = "";
  var p = P();
  var megvan = JELVENYEK.filter(function (j) { return p.jelvenyek[j.id]; }).length;
  host.appendChild(el("div", "jelveny-osszeg", megvan + " / " + JELVENYEK.length + " jelvény megvan"));
  var racs = el("div", "jelveny-racs");
  JELVENYEK.forEach(function (j) {
    var van = !!p.jelvenyek[j.id];
    var k = el("div", "jelveny-kartya" + (van ? " van" : " zar"));
    k.innerHTML = '<div class="med">' + jelvenyMedalSVG(j, van) + '</div>' +
      '<div class="jnev">' + kiiras(j.nev) + '</div>' +
      '<div class="jfelt">' + (van ? "✓ megvan" : kiiras(j.felt)) + '</div>';
    racs.appendChild(k);
  });
  host.appendChild(racs);
}

/* — talált tárgy: helyes válaszért / felmondásért / kerülőn eshet egy holmi is — */
function dropProbal(esely) {
  var p = P();
  var kell = (p.dropUres >= 12);                        /* pity: 12 „csak ✨" után garantált tárgy */
  if (!kell && Math.random() >= esely) { p.dropUres++; ment(); return null; }
  var lehet = [];
  RUHA_HELY.forEach(function (h) {
    (RUHAK[h.kulcs] || []).forEach(function (t, rang) {
      if (!p.oltozet.van[t.id]) { var suly = [3, 2, 1][rang] || 1; for (var s = 0; s < suly; s++) lehet.push(t); }
    });
  });
  if (!lehet.length) { p.csillampor += 5; p.dropUres = 0; ment(); return { vigasz: true }; }
  var t = lehet[veletlen(0, lehet.length - 1)];
  p.oltozet.van[t.id] = 1;
  p.dropUres = 0; ment();
  return { talalt: t };
}
function dropUnnepel(res) {
  if (!res) return;
  if (res.vigasz) { hangCsilla(); bagolyMondat("Minden holmid megvan! +5 ✨"); return; }
  var e = $("talalt-buborek");
  e.textContent = "✨ Találtál egy holmit: " + res.talalt.nev + "!";
  e.hidden = false;
  clearTimeout(dropUnnepel._t);
  dropUnnepel._t = setTimeout(function () { e.hidden = true; }, 2800);
  hangCsilla();
}

/* — gyűjtemény-könyv: minden bolti tétel, megvan / hiányzik — */
function gyujtBirt(cs, t) {
  if (cs.fajta === "ruha") return !!P().oltozet.van[t.id];
  return !!(P().odu.van[cs.kulcs] && P().odu.van[cs.kulcs][t.id]);
}
function renderGyujtemeny() {
  $("odu-lap-cim").textContent = "📖 Gyűjtemény";
  var host = $("odu-lap-tartalom"); host.innerHTML = "";
  var szakaszok = [
    { cim: "👗 Holmik", csoportok: RUHA_HELY.map(function (h) {
        return { fajta: "ruha", kulcs: h.kulcs, nev: h.nev, tetelek: RUHAK[h.kulcs] || [] }; }) },
    { cim: "🌦 Időjárás", csoportok: [
        { fajta: "ido", kulcs: "napszak", nev: "Napszak", tetelek: ODU_KAT.napszak },
        { fajta: "ido", kulcs: "ido", nev: "Időjárás", tetelek: ODU_KAT.ido }
      ] }
  ];
  var ossz = 0, van = 0;
  szakaszok.forEach(function (sz) { sz.csoportok.forEach(function (cs) { cs.tetelek.forEach(function (t) { ossz++; if (gyujtBirt(cs, t)) van++; }); }); });
  host.appendChild(el("div", "jelveny-osszeg", van + " / " + ossz + " tétel megvan"));
  szakaszok.forEach(function (sz) {
    var blk = el("div", "gyujt-szakasz");
    blk.appendChild(el("div", "gyujt-szakasz-cim", sz.cim));
    var racs = el("div", "gyujt-racs");
    sz.csoportok.forEach(function (cs) {
      cs.tetelek.forEach(function (t) {
        var b = gyujtBirt(cs, t);
        var k = el("div", "gyujt-kartya " + (b ? "van" : "nincs"));
        k.innerHTML = '<div class="gkep">' + boltThumb(cs, t) + '</div>' +
          '<div class="gnev">' + kiiras(t.nev) + '</div>' +
          '<div class="gallap">' + (b ? "✓ megvan" : (t.ar ? ("✨" + t.ar) : "alap")) + '</div>';
        racs.appendChild(k);
      });
    });
    blk.appendChild(racs);
    host.appendChild(blk);
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
  bontasEloChunk: bontasEloChunk,
  JELVENYEK: JELVENYEK, jelvenyEllenoriz: jelvenyEllenoriz, dropProbal: dropProbal,
  renderJelveny: renderJelveny, renderGyujtemeny: renderGyujtemeny,
  jutalom: jutalom, palyaBecsultErtek: palyaBecsultErtek, renderFomenu: renderFomenu,
  PALYAK: PALYAK,
  ODU_BUTOR: ODU_BUTOR,
  oduButorVesz: function (hely, id) { var t = null; (ODU_BUTOR[hely] || []).forEach(function (x) { if (x.id === id) t = x; }); if (t) oduButorVesz(hely, t); },
  oduButorBeallit: oduButorBeallit, oduSVG: function () { return oduSVG(mentes.leny, P().odu); },
  DISZ_TARGY: DISZ_TARGY, DISZ_ZONA: DISZ_ZONA,
  oduDiszVesz: function (id) {
    if (id === "extrafuzer") { oduDiszVesz("mennyezet", { id: id, ar: 30 }); return; }
    var d = DISZ_TARGY[id]; if (d) oduDiszVesz(d.hova, { id: id, ar: d.ar });
  },
  oduDiszBeallit: oduDiszBeallit,
  SORENY_SZIN: SORENY_SZIN, SZEM_SZIN: SZEM_SZIN,
  oduKinezetVesz: oduKinezetVesz, oduKinezetBeallit: oduKinezetBeallit
};

})();

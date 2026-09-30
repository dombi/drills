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
      { nev: "Két kavics", szam_min: 4, szam_max: 5 },
      { nev: "Öreg tölgy", szam_min: 6, szam_max: 7 },
      { nev: "Csörgő patak", szam: 8 },
      { nev: "Odú-küszöb", szam_min: 9, szam_max: 10, cel: true }   /* 8 → 4 állomás (2026-09-24, producer) */
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
    id: "szorzo-dallam", nev: "Szorzódallam", ikon: "🎵", regio: "szorzo",
    szint: 8,
    palcim: "Mondd fel az egész szorzótáblát – egyszer öt az öt…",
    alap: { tipus: "szorzotabla-felmondas" },
    kez_nelkul: true,
    allomasok: [
      { nev: "Rajt" },
      { nev: "Két kavics", tabla_keszlet: [2, 5, 10] },
      { nev: "Öreg tölgy", tabla_keszlet: [3, 4] },
      { nev: "Mohapárna", tabla_keszlet: [6, 7] },
      { nev: "Odú-küszöb", tabla_keszlet: [8, 9], cel: true }   /* 8 → 4 állomás, szintenként sorsolva (2026-09-24, producer) */
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
    id: "mi-maradt", nev: "Mi maradt?", ikon: "🧺", regio: "szorzo",
    szint: 6,
    palcim: "Osztás maradékkal — mennyi jut, és mennyi marad?",
    alap: { tipus: "maradekos_osztas" },
    allomasok: [
      { nev: "Rajt" },
      { nev: "Páros-páratlan", osztok: [2], max: 19, darab: 5 },
      { nev: "Ötösök",         osztok: [5], max: 49, darab: 5 },
      { nev: "Hármas kalács",  osztok: [3], max: 30, darab: 5 },
      { nev: "Négyes szekér",  osztok: [3, 4], max: 40, darab: 6 },
      { nev: "Kevert kosár",   osztok: [2, 3, 4, 5], min: 10, max: 60, darab: 6 },
      { nev: "Nehéz szikla",   osztok: [6, 7, 8, 9], min: 10, max: 90, darab: 6 },
      { nev: "Odú-küszöb",     osztok: [2, 3, 4, 5, 6, 7, 8, 9], max: 99, darab: 6, cel: true }
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

/* ══ FIGURA — az állandó szereplők KÖZÖS táblája (producer, 2026-09-30) ══
   A 📚 Bagolykönyvtár (konyvtar.js EK_SZ) és a 🧺 Tündérvásár (vasar.js) is innen olvas. A rajzot a figurak.js adja
   (betöltéskor e → SVG fej-érem, az emoji `emo`-ban marad; 2026-09-30). Mezők: e = kép, n = név, tel = teljes név,
   t = tárgyeset („Brumit”), nak = részeshatározó („Bruminak”), nal = „Bruminál”, a = „a medve”. */
var FIGURA = {
  mia:    { e: "🐿️", n: "Mia", tel: "Mókus Mia", t: "Miát", a: "a mókus", nak: "Miának", nal: "Miánál" },
  samu:   { e: "🦔", n: "Samu", tel: "Sün Samu", t: "Samut", a: "a sün", nak: "Samunak", nal: "Samunál" },
  brumi:  { e: "🐻", n: "Brumi", tel: "Medve Brumi", t: "Brumit", a: "a medve", nak: "Bruminak", nal: "Bruminál" },
  cincin: { e: "🐭", n: "Cincin", tel: "Egér Cincin", t: "Cincint", a: "az egér", nak: "Cincinnek", nal: "Cincinnél" },
  brekus: { e: "🐸", n: "Brekus", tel: "Béka Brekus", t: "Brekust", a: "a béka", nak: "Brekusnak", nal: "Brekusnál" },
  kata:   { e: "🦆", n: "Kata", tel: "Kacsa Kata", t: "Katát", a: "a kacsa", nak: "Katának", nal: "Katánál" },
  tas:    { e: "🐢", n: "Tas", tel: "Teknős Tas", t: "Tast", a: "a teknős", nak: "Tasnak", nal: "Tasnál" },
  potyi:  { e: "🐷", n: "Pötyi", tel: "Malac Pötyi", t: "Pötyit", a: "a malac", nak: "Pötyinek", nal: "Pötyinél" },
  bence:  { e: "🦡", n: "Bence", tel: "Borz Bence", t: "Bencét", a: "a borz", nak: "Bencének", nal: "Bencénél" },
  kitti:  { e: "🐞", n: "Kitti", tel: "Katica Kitti", t: "Kittit", a: "a katica", nak: "Kittinek", nal: "Kittinél" },
  pali:   { e: "🐰", n: "Pali", tel: "Nyúl Pali", t: "Palit", a: "a nyúl", nak: "Palinak", nal: "Palinál" },
  juli:   { e: "🦊", n: "Juli", tel: "Róka Juli", t: "Julit", a: "a róka", nak: "Julinak", nal: "Julinál" },
  tuske:  { e: "🦔", n: "Tüske néni", tel: "Tüske néni", t: "Tüske nénit", a: "a sün-árus", nak: "Tüske néninek", nal: "Tüske néninél" }
};

/* ══ 🧺 TÜNDÉRVÁSÁR — szöveges szorzás-osztás (src/vasar.js) — Matekos\szoveges-szorzas-osztas-rendszerterv.html ══
   A 🌙 Szorzós liget alatt, saját helyszínnel. Osztályonként EGY pálya (nem keverednek); most CSAK a 3. és 4. o.
   (producer, 2026-09-30) — az 5–6. o. (🌇 Alkonyi, 🏮 Lámpás vásár) terve kész, de NINCS a játékban, amíg nem kéri.
   Egy pálya: Rajt → 5 stand → Odú-küszöb. PÁLYAHOSSZ: standonként egy szám a VS_DARAB-ban (tartalom-lap „Pályahossz”: 17);
   a pult „feladatszám” kapcsolója: 3 → standonként 2 · 8 → nem hosszabbít (config.js nehezsegAlkalmaz). */
var VS_STANDOK = [["kosar", "Kosárrakó"], ["doboz", "Dobozoló"], ["arcedula", "Árcédula"], ["hasonlito", "Hasonlító pult"], ["nagy", "Nagy vásár"], ["odu", "Odú-küszöb"]];
var VS_DARAB = [3, 3, 3, 3, 2, 3];
/* o.nelkul: kihagyott standok · o.allomasok: saját állomás-lista ({ nev, stand, sor: [sablonok], ujTort, szin, intro, darab }) */
function vsPalya(o) {
  var all = [{ nev: "Rajt" }];
  if (o.allomasok) o.allomasok.forEach(function (a) { var x = { g: o.g, cel: a.stand === "odu" }; for (var k in a) x[k] = a[k]; all.push(x); });
  else VS_STANDOK.forEach(function (s, i) { if ((o.nelkul || []).indexOf(s[0]) < 0) all.push({ nev: s[1], stand: s[0], g: o.g, darab: VS_DARAB[i], cel: s[0] === "odu" }); });
  o.regio = "vasar"; o.vasar = true; o.osztaly = o.g; o.kez_nelkul = true; o.allomasok = all;
  return o;
}
/* 3. o.: a maradékos osztás még nehéz → a Reggeli vásárban NINCS Dobozoló (14 feladat); a maradék a saját
   📦 Dobozoló-nap ösvényen jön, lépcsőzetesen: TELI → MARAD → KELL → egy történet, három kérdés (producer, 2026-09-30) */
PALYAK.push(
  vsPalya({ id: "vasar-3", nev: "Reggeli vásár", ikon: "🌅", g: 3, szint: 4, palcim: "100-ig · ×, : — 3. o.", alap: { tipus: "vasar" }, nelkul: ["doboz"] }),
  vsPalya({ id: "vasar-3d", nev: "Dobozoló-nap", ikon: "📦", g: 3, szint: 4, palcim: "maradékos osztás — 3. o.", alap: { tipus: "vasar" }, allomasok: [
    { nev: "Teli dobozok", stand: "doboz", sor: ["D1"], ujTort: true, szin: "kosar", intro: "Hány doboz lesz tele? Ezt keressük.", darab: 3 },
    { nev: "Mi marad ki?", stand: "doboz", sor: ["D2"], ujTort: true, szin: "doboz", intro: "Most azt figyeld, mi marad ki!", darab: 3 },
    { nev: "Kell még egy?", stand: "doboz", sor: ["D3"], ujTort: true, szin: "arcedula", intro: "Hová kerül a maradék? Kell még egy doboz!", darab: 3 },
    { nev: "Három kérdés", stand: "doboz", sor: ["D1", "D2", "D3"], keverd: true, szin: "hasonlito", intro: "Ugyanaz a történet, de figyeld, mit kérdezek!", darab: 3 },
    { nev: "Odú-küszöb", stand: "odu", sor: ["D1", "D2", "D3"], keverd: true, ujTort: true, szin: "nagy", intro: "Utolsó próba az odú előtt!", darab: 3 }] }),
  vsPalya({ id: "vasar-4", nev: "Déli vásár", ikon: "☀️", g: 4, szint: 5, palcim: "10 000-ig · írásbeli — 4. o.", alap: { tipus: "vasar" } })
  /* 🌇 Alkonyi vásár (5. o.) · 🏮 Lámpás vásár (6. o.) — a producer döntéséig NINCS itt (a tervük: tunderevasar-tartalom.html 5–6. o.) */
);

/* ══ MÉRÉS-LIGETEK (hosszúság · űrmérték · tömeg) — Matekos\meres-palyacsoport-rendszerterv.html ══
   3 liget × 4 pálya osztály szerint (1–2. · 3. · 4. · 5.). Egy pálya: Rajt → 5 munkapad → Odú-küszöb.
   Az állomás cfg: feladatok = a feladattípusok (src/meres.js GEN.meres), g = osztály (1–5).
   Az 1. pálya eleje 1. osztályos (20-ig), a vége 2. osztályos; az 5. osztályos pályán az 1. pad az összetett alak.
   Koppintós kártyák (2. szakasz): 5. pad = összehasonlítás (+ szóban „mennyivel?”) + becslés; Odú-küszöb = szöveges +
   sorba rendezés + melyik mértékegység (+ 4. osztálytól kakukktojás). */
var MERES_ALLOMAS = {
  szabo:   ["Vonalzó", "Szabás", "Mennyi hiányzik?", "Varrás", "Melyik hosszabb?", "Hosszú vég"],
  bajital: ["Mérőpohár", "Átöntés", "Mennyi hiányzik?", "Keverés", "Melyik több?", "Hordócímke"],
  pekseg:  ["Mérleg", "Kimérés", "Mennyi hiányzik?", "Dagasztás", "Melyik nehezebb?", "Nagy zsákok"]
};
function meresPalya(id, nev, ikon, liga, menny, osztaly, szint, palcim) {
  var N = MERES_ALLOMAS[liga], g0 = osztaly, g2 = (osztaly === 1 ? 2 : osztaly);
  return {
    id: id, nev: nev, ikon: ikon, regio: liga, muhely: liga, meres: true, osztaly: osztaly, szint: szint, palcim: palcim, kez_nelkul: true,
    alap: { tipus: "meres", mennyiseg: menny },
    allomasok: [
      { nev: "Rajt" },
      osztaly >= 5 ? { nev: N[5], feladatok: ["osszetett"], g: 5, darab: 5 } : { nev: N[0], feladatok: ["meres"], g: g0, darab: 5 },
      { nev: N[1], feladatok: ["atvaltas"], g: g0, darab: 6 },
      { nev: N[2], feladatok: ["kieg"], g: g2, darab: 5 },
      { nev: N[3], feladatok: osztaly >= 4 ? ["muvelet", "muvelet", "osszetett"] : ["muvelet"], g: g2, darab: 6 },
      { nev: N[4], feladatok: ["osszeh", "osszeh", "becsles"], g: g2, darab: 5 },
      { nev: "Odú-küszöb", feladatok: ["szoveges", "szoveges", "sorba", "egyseg"].concat(osztaly >= 4 ? ["kakukk"] : []), g: g2, darab: 6, cel: true }
    ]
  };
}
PALYAK.push(
  meresPalya("meres-szabo-1", "Első öltések", "📏", "szabo", "hossz", 1, 2, "Méter, deciméter, centiméter — 1–2. osztály"),
  meresPalya("meres-szabo-2", "Tűhegyes milliméter", "🪡", "szabo", "hossz", 3, 4, "Jön a milliméter és a kilométer — 3. osztály"),
  meresPalya("meres-szabo-3", "Hosszú vég szövet", "🧶", "szabo", "hossz", 4, 5, "Vegyesen, tízezerig — 4. osztály"),
  meresPalya("meres-szabo-4", "Kilométeres szalag", "🛣️", "szabo", "hossz", 5, 6, "Nagy ugrások — 5. osztály"),
  meresPalya("meres-bajital-1", "Liter és deci", "🥛", "bajital", "ur", 1, 2, "Liter, deciliter, centiliter — 1–2. osztály"),
  meresPalya("meres-bajital-2", "Cseppenként", "💧", "bajital", "ur", 3, 4, "Jön a milliliter — 3. osztály"),
  meresPalya("meres-bajital-3", "A nagy üst", "🫕", "bajital", "ur", 4, 5, "Vegyesen, tízezerig — 4. osztály"),
  meresPalya("meres-bajital-4", "Hektoliteres hordók", "🛢️", "bajital", "ur", 5, 6, "Jön a hektoliter — 5. osztály"),
  meresPalya("meres-pekseg-1", "Kiló és deka", "⚖️", "pekseg", "tomeg", 1, 2, "Kilogramm és dekagramm — 1–2. osztály"),
  meresPalya("meres-pekseg-2", "Csipetnyi gramm", "🧂", "pekseg", "tomeg", 3, 4, "Jön a gramm — 3. osztály"),
  meresPalya("meres-pekseg-3", "Mézes mérleg", "🍯", "pekseg", "tomeg", 4, 5, "Vegyesen, tízezerig — 4. osztály"),
  meresPalya("meres-pekseg-4", "Mázsa és tonna", "🌾", "pekseg", "tomeg", 5, 6, "Jön a mázsa és a tonna — 5. osztály")
);

/* ══ 📚 BAGOLYKÖNYVTÁR — Zrínyi építőkocka-pályák (src/konyvtar.js) — Matekos\epitokocka-palyak-terv.html ══
   Egy kocka (K1…) = egy pálya-fajta: Rajt → 5 olvasóasztal → Odú-küszöb (vegyesen a 2–5. asztalból, a végén 1 A–E).
   SZARNYAK: a könyvtár osztályonként „szárnyat” kap (mesés névvel — az osztály szót a gyerek nem látja). ÚJ SZÁRNY = új sor a SZARNYAK-ban + az ekPalya-sorai lent
   (+ ha új kocka kell: új sor az EK_KOCKA_DEF-ben és a sablonjai a konyvtar.js EK_GEN-jében).
   A szárnyon belül a pályák sorban nyílnak (ekLakat), a 12 órás kapu nem zárja őket.
   PÁLYAHOSSZ: asztalonként egy szám az EK_DARAB-ban (a pult „feladatszám” kapcsolója gyerekenként ezt is felülírja). */
/* var = a kocka helye a 14-es Kockavár-sorban (konyvtar.js EK_KOCKAK, jóváhagyott sorrend);
   mester = a 🏅 Mesterpróba Fejtörő-feladatai (versenyFeladatok azonosítók — a SZÖVEG a felhőben van, a repó nyilvános);
   sorban váltakoznak, egy kör után a számváltozataik jönnek. A pult 🧱 füle felülírhatja (versenyPalyak/mester-K1 …). */
var EK_KOCKA_DEF = {
  K1: { sablonok: ["nagyito", "kirol", "mit", "lanc", "nyomoz"],
        asztalok: ["Nagyító", "Kiről szól?", "Mit számolunk?", "Lánc-kérdés", "Nyomozás"],
        var: 0, mester: ["zrinyi-2020-3-M-13", "zrinyi-2021-3-M-11"] },          /* Röfi házai · csokigolyó és perec */
  K2: { sablonok: ["iker", "nem", "legalabb", "par", "mindketto"],
        asztalok: ["Ikerkérdés", "Nem, különböző", "Legalább", "Pár, hét, tucat", "Mindkettő"],
        var: 1, mester: ["zrinyi-2024-3-M-8", "zrinyi-2023-3-M-8"] },           /* telefonszám · a 23 számszomszédai (ÚJ, fejtoro-mesterproba.json) */
  K3: { sablonok: ["lepcso", "kinek", "felut", "hanylepes", "kakas"],
        asztalok: ["Lépcsőfok", "Kinek van igaza?", "Félút-figyelő", "Hány lépés?", "Kakasmagasság"],
        var: 2, mester: ["zrinyi-2022-3-M-13", "zrinyi-2022-3-M-18"] }          /* Varjú Varga Pál cipői · a kiskakas szemétdombja */
};
var EK_DARAB = {          /* 1–5. asztal + Odú-küszöb (tartalom-lap „Pályahossz”: 29 / 29 / 28 pötty) */
  K1: [5, 5, 5, 4, 5, 5],
  K2: [5, 5, 5, 5, 4, 5],
  K3: [5, 5, 5, 4, 4, 5]
};
var SZARNYAK = [
  { id: "3o", nev: "Holdfény-szárny", ikon: "🌙", osztaly: 3, szint: 4 },   /* a gyerek mesés nevet lát (producer, 2026-09-29); */
  { id: "5o", nev: "Csillagtorony", ikon: "✨", osztaly: 5, szint: 6 }      /* az osztály csak a pultban látszik */
];
/* FOKOK (producer, 2026-09-29): minden kocka egy 3 fokú létra — 📖 Mesekönyv (alap, 1 lépés) → 📜 Varázstekercs (összetett KÉRDÉS,
   de a szárny számkörében; a kocka-napok ▢▢▢ CSAK itt gyűlnek) → 🏅 Mesterpróba (konyvtar-mester.js). A Mesekönyv egyszeri végigjárása nyitja a Varázstekercset.
   A menüben egy SOR = egy kocka. Az állomás-cfg „ossz” mezője = összetettség (a sablon a bonyolultabb szerkezetet választja), a „g” marad a számkör. */
var EK_FOK = {
  mese:    { nev: "Mesekönyv", ikon: "📖", al: "Egyszerű mondatok" },
  tekercs: { nev: "Varázstekercs", ikon: "📜", al: "Csavaros kérdések" }
};
function ekPalya(id, nev, ikon, osztaly, kocka, fok) {
  var D = EK_KOCKA_DEF[kocka], N = EK_DARAB[kocka], sz = null, ossz = fok === "tekercs";
  SZARNYAK.forEach(function (s) { if (s.osztaly === osztaly) sz = s; });
  var all = [{ nev: "Rajt" }];
  D.sablonok.forEach(function (sab, i) { all.push({ nev: D.asztalok[i], sablon: sab, g: osztaly, ossz: ossz, kocka: kocka, darab: N[i] }); });
  all.push({ nev: "Odú-küszöb", sablon: "odu", odu: true, vegyes: D.sablonok.slice(1), g: osztaly, ossz: ossz, kocka: kocka, darab: N[5], cel: true });
  return { id: id, nev: ossz ? nev + " – " + EK_FOK.tekercs.nev : nev, kockaNev: nev, kockaIkon: ikon, ikon: EK_FOK[fok].ikon, fok: fok,
    regio: "konyvtar", konyvtar: true, szarny: sz.id, kocka: kocka, osztaly: osztaly, szint: sz.szint,
    palcim: EK_FOK[fok].al, kez_nelkul: true, alap: { tipus: "konyvtar" }, allomasok: all };
}
PALYAK.push(
  ekPalya("ek-k1-3", "Kit kérdeznek?", "🔎", 3, "K1", "mese"),
  ekPalya("ek-k1-3v", "Kit kérdeznek?", "🔎", 3, "K1", "tekercs"),
  ekPalya("ek-k2-3", "Kis szavak", "🔤", 3, "K2", "mese"),
  ekPalya("ek-k2-3v", "Kis szavak", "🔤", 3, "K2", "tekercs"),
  ekPalya("ek-k3-3", "Ez már a válasz?", "✋", 3, "K3", "mese"),
  ekPalya("ek-k3-3v", "Ez már a válasz?", "✋", 3, "K3", "tekercs")
  /* ✨ Csillagtorony (5. o.) — a producer döntése (2026-09-29): addig NINCS a menüben, amíg meg nem jönnek az IGAZI
     5. osztályos Zrínyi-feladatok (a mostaniak mind 3. osztályosak). A konyvtar.js 5. o. számkörei (g ≥ 5) megmaradnak;
     visszakapcsolás: ide sorok, mint fent, 5-ös osztállyal és „-5” / „-5v” végű azonosítóval. */
);

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
  "mi-maradt": '<path d="M14 28 Q13 46 18 50 Q30 54 42 50 Q47 46 46 28 Z" fill="#d9a64a" stroke="#222" stroke-width="1.6"/> <path d="M16 34 Q30 32 44 34" stroke="#c4913a" stroke-width="1.2" fill="none"/> <path d="M17 40 Q30 38 43 40" stroke="#c4913a" stroke-width="1.2" fill="none"/> <path d="M18 46 Q30 44 42 46" stroke="#c4913a" stroke-width="1.2" fill="none"/> <path d="M22 28 Q30 14 38 28" stroke="#b8883a" stroke-width="2.4" fill="none" stroke-linecap="round"/> <circle cx="50" cy="44" r="2.2" fill="#f0d090" stroke="#222" stroke-width="1"/> <circle cx="48" cy="50" r="1.6" fill="#f0d090" stroke="#222" stroke-width="1"/> <circle cx="10" cy="48" r="1.8" fill="#f0d090" stroke="#222" stroke-width="1"/>',
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
  "mi-maradt": "osztás maradékkal",
  "vegyes-szorzo": "× és ÷ keverve, 100-ig",
  "meres-szabo-1": "m · dm · cm — 1–2. o.", "meres-szabo-2": "+ mm, km — 3. o.", "meres-szabo-3": "vegyesen, 10 000-ig — 4. o.", "meres-szabo-4": "nagy ugrások — 5. o.",
  "meres-bajital-1": "l · dl · cl — 1–2. o.", "meres-bajital-2": "+ ml — 3. o.", "meres-bajital-3": "vegyesen, 10 000-ig — 4. o.", "meres-bajital-4": "+ hl — 5. o.",
  "meres-pekseg-1": "kg · dkg — 1–2. o.", "meres-pekseg-2": "+ g — 3. o.", "meres-pekseg-3": "vegyesen, 10 000-ig — 4. o.", "meres-pekseg-4": "+ q, t — 5. o.",
};
var FOMENU_HATTER = '<svg class="hatter" viewBox="0 0 1120 760" preserveAspectRatio="none" aria-hidden="true"> <defs> <linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#d8ecf8"/><stop offset="0.45" stop-color="#e6f2ea"/> <stop offset="1" stop-color="#eaf4e2"/> </linearGradient> <radialGradient id="nap2" cx="0.5" cy="0.5" r="0.5"> <stop offset="0" stop-color="#fff6d0" stop-opacity="0.85"/> <stop offset="1" stop-color="#fff6d0" stop-opacity="0"/> </radialGradient> </defs> <rect x="0" y="0" width="1120" height="760" fill="url(#eg2)"/> <circle cx="985" cy="80" r="90" fill="url(#nap2)"/> <circle cx="985" cy="80" r="30" fill="#fff2b8" opacity="0.7"/> <g fill="#ffffff" opacity="0.5"> <ellipse cx="210" cy="70" rx="52" ry="17"/><ellipse cx="250" cy="61" rx="34" ry="14"/> <ellipse cx="640" cy="46" rx="42" ry="15"/><ellipse cx="672" cy="55" rx="26" ry="11"/> </g> <!-- távoli dombsor --> <path d="M0 300 Q160 268 320 296 Q480 322 640 292 Q800 262 960 296 Q1060 316 1120 298 L1120 760 L0 760 Z" fill="#cfe8c2" opacity="0.8"/> <!-- fa-sziluettek: csak a peremen, hogy a kártyák tiszták maradjanak --> <g opacity="0.72"> <g fill="#8fbf7a"> <path d="M60 300 l26 66 l-52 0 Z"/><path d="M60 336 l32 78 l-64 0 Z"/><rect x="54" y="410" width="12" height="26" fill="#a9814e"/> <path d="M150 340 l22 56 l-44 0 Z"/><path d="M150 372 l27 66 l-54 0 Z"/><rect x="145" y="434" width="10" height="22" fill="#a9814e"/> <path d="M1060 300 l26 66 l-52 0 Z"/><path d="M1060 336 l32 78 l-64 0 Z"/><rect x="1054" y="410" width="12" height="26" fill="#a9814e"/> <path d="M968 344 l22 56 l-44 0 Z"/><path d="M968 376 l27 66 l-54 0 Z"/><rect x="963" y="438" width="10" height="22" fill="#a9814e"/> </g> <g fill="#7fae5f"> <ellipse cx="330" cy="322" rx="30" ry="22"/><ellipse cx="470" cy="312" rx="24" ry="18"/> <ellipse cx="700" cy="316" rx="28" ry="20"/><ellipse cx="840" cy="326" rx="22" ry="16"/> </g> </g> <!-- talaj --> <path d="M0 700 Q280 676 560 700 Q840 724 1120 698 L1120 760 L0 760 Z" fill="#bfe3a0" opacity="0.9"/> <g fill="#fff6c4" opacity="0.7"> <circle cx="120" cy="180" r="3"/><circle cx="420" cy="150" r="2.4"/><circle cx="760" cy="170" r="2.6"/> <circle cx="900" cy="230" r="2.2"/><circle cx="270" cy="250" r="2.2"/> </g> </svg>';
/* Szorzós liget alkonyi/aranyóra háttér (grafikai session, producer-jóváhagyott 2026-09-11) */
var SZORZOS_HATTER = '<svg class="hatter" viewBox="0 0 1120 760" preserveAspectRatio="none" aria-hidden="true"> <defs> <linearGradient id="szg" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#f7e2c6"/><stop offset="0.45" stop-color="#f0e4d6"/> <stop offset="1" stop-color="#e6ecd2"/> </linearGradient> <radialGradient id="szn" cx="0.5" cy="0.5" r="0.5"> <stop offset="0" stop-color="#ffdf9e" stop-opacity="0.95"/><stop offset="1" stop-color="#ffdf9e" stop-opacity="0"/> </radialGradient> </defs> <rect x="0" y="0" width="1120" height="760" fill="url(#szg)"/> <!-- nagyobb, mélyebben ülő aranyóra-nap --> <circle cx="560" cy="150" r="150" fill="url(#szn)"/> <circle cx="560" cy="150" r="46" fill="#ffcf6e" opacity="0.75"/> <!-- lila-arany távoli dombsor (mélyebb, varázslatosabb) --> <path d="M0 320 Q170 286 340 314 Q510 340 680 308 Q850 278 1010 314 Q1070 328 1120 316 L1120 760 L0 760 Z" fill="#d9c6e0" opacity="0.7"/> <path d="M0 380 Q200 352 400 378 Q600 402 800 374 Q1000 348 1120 378 L1120 760 L0 760 Z" fill="#c9d8b0" opacity="0.75"/> <!-- fa-sziluettek a peremen, melegebb árnyalatban --> <g opacity="0.72"><g fill="#9a8f6a"> <path d="M60 320 l26 66 l-52 0 Z"/><path d="M60 356 l32 78 l-64 0 Z"/><rect x="54" y="430" width="12" height="26" fill="#8a6a3e"/> <path d="M150 360 l22 56 l-44 0 Z"/><path d="M150 392 l27 66 l-54 0 Z"/><rect x="145" y="454" width="10" height="22" fill="#8a6a3e"/> <path d="M1060 320 l26 66 l-52 0 Z"/><path d="M1060 356 l32 78 l-64 0 Z"/><rect x="1054" y="430" width="12" height="26" fill="#8a6a3e"/> <path d="M968 364 l22 56 l-44 0 Z"/><path d="M968 396 l27 66 l-54 0 Z"/><rect x="963" y="458" width="10" height="22" fill="#8a6a3e"/> </g></g> <!-- talaj --> <path d="M0 710 Q280 686 560 710 Q840 734 1120 708 L1120 760 L0 760 Z" fill="#cdd9a0" opacity="0.9"/> <!-- szentjánosbogarak / varázs-szikrák (a dallam + bűvkör téma) --> <g fill="#fff2b8"> <circle cx="230" cy="210" r="3.4" opacity="0.9"/><circle cx="360" cy="150" r="2.4" opacity="0.8"/> <circle cx="470" cy="250" r="2.8" opacity="0.85"/><circle cx="720" cy="180" r="2.6" opacity="0.8"/> <circle cx="840" cy="240" r="3.2" opacity="0.9"/><circle cx="930" cy="180" r="2.2" opacity="0.75"/> <circle cx="300" cy="300" r="2.2" opacity="0.7"/><circle cx="640" cy="300" r="2.4" opacity="0.7"/> </g> <!-- pár lebegő hangjegy-pötty a Szorzódallam témára --> <g fill="#c9a8e6" opacity="0.55"> <circle cx="410" cy="120" r="5"/><rect x="414" y="104" width="2" height="18"/> <circle cx="690" cy="130" r="5"/><rect x="694" y="114" width="2" height="18"/> </g> </svg>';


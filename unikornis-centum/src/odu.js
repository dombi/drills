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
  oldal: [{ id: "oldal-a", nev: "Pihe-szárny", ar: 40 }, { id: "oldal-k", nev: "Szivárvány-szárny", ar: 110 }, { id: "oldal-r", nev: "Fény-szárny", ar: 220 }],
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
  agy:     [{ id: 1, nev: "Felhőfészek", ar: 0 }, { id: 2, nev: "Holdbölcső", ar: 60 }, { id: 3, nev: "Lótuszágy", ar: 150 }],   /* 7. lépés: a szint = másik ágy (agyRajz) */
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
   a megfelelő z-ponton (butorElem/butorAsztal; az ágy: agyRajz). Az asztal-csoportokat a hívó
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
  "krisztaly": { nev: "Függő kristály", ar: 40, hova: "mennyezet", tf: "translate(410,138) scale(0.6) translate(-40,-40)", svg: '<line x1="40" y1="8" x2="40" y2="24" stroke="#c9a8e6" stroke-width="1.6"/> <path d="M40 24 L54 38 L40 66 L26 38 Z" fill="#b7d4ec" stroke="#7fb0d8" stroke-width="1.4"/> <path d="M40 24 L54 38 L40 43 Z" fill="#d7ebfb"/> <path d="M26 38 L40 43 L40 66 Z" fill="#9fc4e8"/> <path d="M33 31 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z" fill="#ffffff" opacity="0.85"/>' },
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
/* a hely aktív szintjéhez tartozó rárajzolt csoport(ok) — a bázis-bútor UTÁN (az ágynál a szint = másik ágy: agyRajz) */
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
  return out;
}

/* ══ 🛏️ ÁGYAK (unikornis pózok, 7. lépés — terv/agy-rajzterv.html, producer: 2026-10-04) ══
   Három könnyű ágy = a három bolti ágy-szint: 1 Felhőfészek (ingyen) · 2 Holdbölcső · 3 Lótuszágy.
   EGY rajz az odúban és a kertben (kertTargyBelso "agy" / "agy-elol" ugyanezt hívja, kicsinyítve).
   Odú-koordinátában: az ágy közepe x=155, a padló y=452; akkora, hogy a valódi méretű (1.28) fekvő unikornis belefér.
   Két réteg: "hatso" = az unikornis MÖGÉ, "elol" = a perem az unikornis ELÉ (fekve ebbe süpped bele).
   AGY_FEKVES = a fekvő unikornis helye (az unikornis-rajz origója) ugyanebben a koordinátában. */
var AGY_FAJTA = { 1: "felho", 2: "hold", 3: "lotusz" };
var AGY_FEKVES = { felho: { x: 158, y: 401 }, hold: { x: 162, y: 399 }, lotusz: { x: 158, y: 399 } };   /* 8. lépés: a fekvő pózban a test 46 rajz-egységgel lejjebb van (UNI_POZ.fekszik) → a hely 46×0,5×1,28 ≈ 29-cel feljebb */
var KERT_AGY_SKALA = 0.322;   /* odú-egység → kerti tárgy-egység: a kerti unikornis ~0,95 px/egység, az odúban 1.28× → az ágy 0,95/1.28 px/odú-egység (KERT_AGY_PX-szel osztva) */
var AGY_KERET = '<rect x="28" y="300" width="262" height="160" fill="none"/>';   /* azonos befoglaló a két rétegnek (a kerti besüppedés közös origója) */
function agySzirom(x, y, fok, L, W, szin, el, er) {   /* hegyes szirom (x,y)-ból, fok irányba */
  return '<g transform="translate(' + x + ',' + y + ') rotate(' + fok + ')"><path d="M0 0 C' + W + ' ' + (-L * .38) + ' ' + (W * .55) + ' ' + (-L) + ' 0 ' + (-L) +
    ' C' + (-W * .55) + ' ' + (-L) + ' ' + (-W) + ' ' + (-L * .38) + ' 0 0 Z" fill="' + szin + '" stroke="' + el + '" stroke-width="1.4"/>' +
    '<path d="M0 -9 V' + (-L + 15) + '" stroke="' + er + '" stroke-width="2" stroke-linecap="round"/></g>';
}
var AGY_RAJZ = {
  /* A) Felhőfészek: keret és láb nélkül, kicsit lebegő felhő; párna = kis alvó holdsarló */
  felho: {
    hatso: '<ellipse cx="155" cy="452" rx="104" ry="8" fill="#3b2f66" opacity=".14"/>' +
      '<g fill="#fdfdfd"><circle cx="52" cy="406" r="18"/><circle cx="80" cy="394" r="25"/><circle cx="120" cy="386" r="29"/><circle cx="162" cy="384" r="30"/><circle cx="204" cy="388" r="28"/><circle cx="242" cy="398" r="23"/><circle cx="266" cy="410" r="15"/></g>' +
      '<ellipse cx="158" cy="414" rx="106" ry="13" fill="#efe7fa"/>' +
      '<g class="e-parna"><path d="M60 370 a22 22 0 1 0 28 32 a17 17 0 1 1 -28 -32 Z" fill="#fce49a" stroke="#f0c870" stroke-width="1.4"/>' +
      '<path d="M66 392 q3 3 6 0" stroke="#c99a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="68" cy="398" r="2" fill="#f7b8d0"/></g>' +
      '<g fill="#fff6c8"><circle cx="100" cy="360" r="2"/><circle cx="230" cy="366" r="1.6"/><circle cx="282" cy="392" r="1.4"/></g>',
    elol: '<g fill="#fdfdfd"><rect x="40" y="410" width="232" height="26" rx="13"/><circle cx="56" cy="418" r="16"/><circle cx="92" cy="418" r="20"/><circle cx="132" cy="420" r="21"/><circle cx="172" cy="420" r="21"/><circle cx="212" cy="418" r="20"/><circle cx="248" cy="418" r="16"/><circle cx="266" cy="414" r="11"/></g>' +
      '<path d="M76 404 q14 -6 28 0 M150 404 q14 -6 28 0 M222 404 q12 -5 24 0" stroke="#efe7fa" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 438 Q158 452 262 436" stroke="#e2d6f2" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g fill="#fff6c8"><circle cx="96" cy="446" r="1.6"/><circle cx="196" cy="448" r="1.8"/><circle cx="150" cy="449" r="1.2"/></g>'
  },
  /* B) Holdbölcső: aranyló holdsarló két karcsú lábon, alvó arccal; a csúcsán kis csillag lóg; benne felhőpárna */
  hold: {
    hatso: '<ellipse cx="155" cy="452" rx="96" ry="8" fill="#3b2f66" opacity=".14"/>' +
      '<g stroke="#e6b94f" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M106 440 L98 452"/><path d="M214 440 L222 452"/></g><circle cx="97" cy="452" r="2.6" fill="#f0c870"/><circle cx="223" cy="452" r="2.6" fill="#f0c870"/>' +
      '<path d="M50 316 C20 382 46 444 150 446 C214 447 256 424 272 392 C244 418 204 428 152 428 C84 428 50 390 50 316 Z" fill="#fce49a" stroke="#efc566" stroke-width="1.6"/>' +
      '<path d="M38 368 q5 4 10 0" stroke="#c99a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="44" cy="378" r="2.6" fill="#f7b8d0" opacity=".8"/>' +
      '<line x1="50" y1="316" x2="50" y2="330" stroke="#e6b94f" stroke-width="1"/><path d="M50 330 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#ffe08a"/>' +
      '<g fill="#fdfdfd"><rect x="62" y="404" width="200" height="22" rx="11"/><circle cx="80" cy="404" r="14"/><circle cx="116" cy="398" r="18"/><circle cx="156" cy="397" r="19"/><circle cx="196" cy="399" r="18"/><circle cx="234" cy="404" r="15"/></g>' +
      '<g class="e-parna"><ellipse cx="78" cy="396" rx="18" ry="11" fill="#e9ddf3"/><path d="M66 394 q12 -6 24 0" stroke="#fdfdfd" stroke-width="2" fill="none"/></g>',
    elol: '<g fill="#fdfdfd"><rect x="64" y="410" width="196" height="20" rx="10"/><circle cx="92" cy="414" r="13"/><circle cx="128" cy="416" r="15"/><circle cx="166" cy="416" r="15"/><circle cx="204" cy="415" r="14"/><circle cx="238" cy="412" r="12"/></g>' +
      '<path d="M62 426 C96 446 200 448 262 414 C244 430 204 440 152 440 C108 440 80 434 62 426 Z" fill="#fce49a" stroke="#efc566" stroke-width="1.2"/>'
  },
  /* C) Lótuszágy: halvány tavirózsa — hátul szirom-legyező, elöl tulipánszerűen összezáruló szirmok, alatta két levél */
  lotusz: {
    hatso: '<ellipse cx="155" cy="452" rx="108" ry="8" fill="#3b2f66" opacity=".14"/>' +
      '<ellipse cx="70" cy="447" rx="30" ry="6" fill="#b8deb0" transform="rotate(-8 70 447)"/><ellipse cx="244" cy="447" rx="30" ry="6" fill="#b8deb0" transform="rotate(8 244 447)"/>' +
      [[-80, 120], [-62, 128], [-44, 122], [44, 122], [62, 128], [80, 120]].map(function (p) { return agySzirom(158, 432, p[0], p[1], 30, "#fbdbe8", "#f2b6cc", "#fdeef4"); }).join("") +
      '<g fill="#fdf6e3"><rect x="48" y="404" width="220" height="26" rx="13"/><circle cx="70" cy="404" r="14"/><circle cx="108" cy="399" r="17"/><circle cx="150" cy="397" r="18"/><circle cx="192" cy="398" r="17"/><circle cx="232" cy="403" r="15"/></g>' +
      '<g class="e-parna"><ellipse cx="74" cy="396" rx="17" ry="10" fill="#fff0b8"/><g fill="#f6c84c"><circle cx="68" cy="394" r="1.6"/><circle cx="76" cy="392" r="1.6"/><circle cx="80" cy="398" r="1.6"/></g></g>',
    elol: [[-62, 64], [-34, 58], [0, 54], [34, 58], [62, 64]].map(function (p) { return agySzirom(158, 452, p[0], p[1], 24, "#f9cadb", "#f0aac4", "#fde6ef"); }).join("")
  }
};
function agyFajta(szint) { return AGY_FAJTA[szint] || "felho"; }
function agyRajz(szint, reteg) { return AGY_RAJZ[agyFajta(szint)][reteg]; }
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

/* ── KINCSVITRIN + csillagkristály-díszek (producer-döntés 2026-09-13) ──
   Prémium dísz-kategória: a bolt „Kristály" fülén ✨-ből megvehető, mint bármi más
   (NINCS külön valuta, NINCS váltás). A megvett darab a fő fal Kincsvitrinjébe kerül,
   ami egyszerre több díszt is mutat (mint az oltozet.van), és láthatóan telik.
   Mentés-ág: P().odu.vitrin = { id:1 }. A tétel-ikon 0..80-as dobozban (mint a dísztárgyak). */
var KRISTALY = [
  { id: "k-gomb", nev: "Kristálygömb", ar: 70,
    svg: '<ellipse cx="40" cy="60" rx="17" ry="4.5" fill="#c9a8e6"/>' +
      '<circle cx="40" cy="38" r="20" fill="#8fd6ee"/><circle cx="40" cy="38" r="20" fill="none" stroke="#5aa9d8" stroke-width="1.6"/>' +
      '<circle cx="34" cy="31" r="7.5" fill="#e8f9ff" opacity="0.85"/>' +
      '<path d="M30 28 Q37 24 44 29" stroke="#fff" stroke-width="2.4" fill="none" opacity="0.85" stroke-linecap="round"/>' +
      '<circle cx="47" cy="46" r="2.4" fill="#fff" opacity="0.6"/>' },
  { id: "k-roka", nev: "Kristályróka", ar: 80,
    svg: '<ellipse cx="40" cy="62" rx="15" ry="4" fill="#c9a8e6"/>' +
      '<path d="M30 30 L25 19 L37 27 Z" fill="#f7b58a" stroke="#e0895a" stroke-width="1.1"/><path d="M50 30 L55 19 L43 27 Z" fill="#f7b58a" stroke="#e0895a" stroke-width="1.1"/>' +
      '<path d="M40 22 L58 44 L40 60 L22 44 Z" fill="#f7b58a" stroke="#e0895a" stroke-width="1.4"/>' +
      '<path d="M40 22 L58 44 L40 44 Z" fill="#ffd0a8"/><path d="M22 44 L40 44 L40 60 Z" fill="#e0895a" opacity="0.55"/>' +
      '<circle cx="35" cy="41" r="1.9" fill="#4a3020"/><circle cx="45" cy="41" r="1.9" fill="#4a3020"/><circle cx="40" cy="48" r="2.1" fill="#7a4a2a"/>' },
  { id: "k-bagoly", nev: "Kristálybagoly", ar: 80,
    svg: '<ellipse cx="40" cy="62" rx="15" ry="4" fill="#c9a8e6"/>' +
      '<path d="M40 22 Q56 26 54 46 Q52 60 40 60 Q28 60 26 46 Q24 26 40 22 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1.4"/>' +
      '<path d="M40 22 L40 60" stroke="#cbead9" stroke-width="1"/>' +
      '<path d="M30 26 L26 18 L36 24 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1"/><path d="M50 26 L54 18 L44 24 Z" fill="#a7d99a" stroke="#7fb872" stroke-width="1"/>' +
      '<circle cx="34" cy="39" r="5" fill="#fff"/><circle cx="46" cy="39" r="5" fill="#fff"/><circle cx="34" cy="39" r="2.2" fill="#3a3050"/><circle cx="46" cy="39" r="2.2" fill="#3a3050"/>' +
      '<path d="M40 43 l-3 4 l6 0 Z" fill="#ffd24d"/>' },
  { id: "k-terkep", nev: "Csillagtérkép-gömb", ar: 110,
    svg: '<ellipse cx="40" cy="61" rx="16" ry="4" fill="#c9a8e6"/>' +
      '<path d="M22 40 a18 18 0 0 0 36 0" fill="none" stroke="#c9a06a" stroke-width="2.2"/>' +
      '<circle cx="40" cy="38" r="18" fill="#3a4a86"/><circle cx="34" cy="31" r="4.5" fill="#6a7ac0" opacity="0.7"/>' +
      '<g fill="#fff6d8"><circle cx="34" cy="32" r="1.4"/><circle cx="47" cy="36" r="1.2"/><circle cx="40" cy="45" r="1.3"/><circle cx="32" cy="43" r="1"/><circle cx="45" cy="44" r="1"/></g>' +
      '<path d="M40 20 l1.2 3 l3 .3 l-2.3 1.9 l.8 3 l-2.7 -1.7 l-2.7 1.7 l.8 -3 l-2.3 -1.9 l3 -.3 Z" fill="#ffe08a"/>' },
  { id: "k-zene", nev: "Zenélő doboz", ar: 130,
    svg: '<ellipse cx="40" cy="62" rx="18" ry="4.5" fill="#c9a8e6"/>' +
      '<rect x="24" y="40" width="32" height="20" rx="4" fill="#c9a8e6" stroke="#a98fd0" stroke-width="1.4"/><rect x="24" y="40" width="32" height="7" rx="3" fill="#b79fd4"/>' +
      '<path d="M30 34 l3 4 l3 -4" fill="none" stroke="#8f7ab8" stroke-width="1.4"/>' +
      '<circle cx="40" cy="30" r="6.5" fill="#fdfdfd" stroke="#e0d0e8" stroke-width="1"/><polygon points="40,20 41.6,26 38.4,26" fill="#ffd24d"/><circle cx="42" cy="30" r="1.2" fill="#4a3b5a"/>' +
      '<path d="M35 33 q5 3 10 0" stroke="#f6a5c0" stroke-width="1.4" fill="none"/>' },
  { id: "k-lampas", nev: "Tündérlámpás", ar: 100,
    svg: '<ellipse cx="40" cy="62" rx="14" ry="4" fill="#c9a8e6"/>' +
      '<ellipse cx="40" cy="42" rx="17" ry="19" fill="#ffe9ad" opacity="0.35"/>' +
      '<path d="M34 22 q6 -5 12 0" stroke="#c9a06a" stroke-width="2" fill="none"/>' +
      '<rect x="28" y="24" width="24" height="6" rx="2" fill="#c9a06a"/><rect x="28" y="54" width="24" height="6" rx="2" fill="#c9a06a"/>' +
      '<rect x="31" y="28" width="18" height="28" rx="8" fill="#ffd98f" stroke="#e0a85a" stroke-width="1.6"/>' +
      '<path d="M40 36 q-4 6 0 11 q4 -5 0 -11 Z" fill="#ffb43a"/><circle cx="40" cy="44" r="2" fill="#fff2c4"/>' }
];
/* ── KERT bolt-fül. A kert 2026-10 óta ingyenes (a régi ✨-os kertkapu-kulcs megszűnt, kertKulcsRendez).
   A séta-TRÜKKÖK (2. fázis) a bolt „Kert" fülén vehetők meg, 💧 TÜNDÉRHARMATÉRT (kitartás-valuta). Adatvezérelt: egy trükk = egy sor
   (id = animáció-osztály neve is: .trukk-<id>; `emoji`+`perc` a kertbeli lejátszáshoz,
   `svg` a bolti bélyegkép). 3. fázis = ide még egy sor + egy CSS-keyframe. ── */
var KERT_BOLT = [
  { id: "ules", nev: "Ülés", ar: 3, emoji: "🛋️", perc: 1600,
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +   /* rét-korong (mint a kulcsnál) */
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<ellipse cx="40" cy="52" rx="16" ry="5" fill="#b98ad6"/>' +               /* kis puff/ülőke a füvön */
      '<path d="M25 52 q0 -13 15 -13 q15 0 15 13 Z" fill="#d9a7ef" stroke="#a56fce" stroke-width="1.6"/>' +
      '<path d="M33 30 l3 -6 M40 27 l0 -7 M47 30 l3 -6" stroke="#7a3bc0" stroke-width="2.4" stroke-linecap="round" fill="none"/>' },  /* „leül" mozgás-vonalak */
  { id: "ugras", nev: "Ugrás", ar: 12, emoji: "🦘", perc: 1100,
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +   /* rét-korong */
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<path d="M22 58 Q40 16 58 58" fill="none" stroke="#7a3bc0" stroke-width="4" stroke-linecap="round" stroke-dasharray="1.5 6"/>' +  /* ugró-ív */
      '<path d="M40 22 l2.4 5.6 l5.6 2.4 l-5.6 2.4 l-2.4 5.6 l-2.4 -5.6 l-5.6 -2.4 l5.6 -2.4 Z" fill="#ffd24d"/>' },  /* csillag a csúcson */
  { id: "porges", nev: "Pörgés", ar: 12, emoji: "🌀", perc: 1400,
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<path d="M22 38 a22 22 0 0 1 36 -4" fill="none" stroke="#7a3bc0" stroke-width="3.8" stroke-linecap="round"/>' +
      '<path d="M58 34 l-2 10 l-9 -5 Z" fill="#7a3bc0"/>' +
      '<path d="M40 28 l1.8 4.2 l4.2 1.8 l-4.2 1.8 l-1.8 4.2 l-1.8 -4.2 l-4.2 -1.8 l4.2 -1.8 Z" fill="#b39af0"/>' },
  { id: "csillam", nev: "Csillámszórás", ar: 12, emoji: "✨", perc: 1800,
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<path d="M38 44 l4 -26 l6 23 Z" fill="#ffd66b" stroke="#f2b93d" stroke-width="1.4"/>' +
      '<circle cx="44" cy="16" r="10" fill="#ffd24d" opacity=".3"/>' +
      '<path d="M30 16 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" fill="#ffd24d"/>' +
      '<path d="M56 20 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z" fill="#ffd24d"/>' +
      '<path d="M44 6 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill="#ff9ec4"/>' +
      '<circle cx="24" cy="26" r="2.4" fill="#ff9ec4"/><circle cx="60" cy="12" r="2" fill="#b39af0"/>' +
      '<circle cx="52" cy="30" r="2.2" fill="#87cc66"/><circle cx="34" cy="8" r="1.8" fill="#a7d8f2"/>' },
  /* 😋 Evés = KÉPESSÉG (nem egyszeri trükk, ezért NINCS `perc`): megvéve a kertben egy letett ÉTELRE
     koppintva az unikornis odasétál és megeszi. A trükk-sorban ezért nem jelenik meg gomb (kertTrukksorRender
     `!t.perc` → kihagyja); a bekötés a kertEtelKoppint/kertEszik ágon fut. */
  { id: "eves", nev: "Evés", ar: 6, emoji: "😋",
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +   /* rét-korong (mint a többi trükknél) */
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<path d="M34 46 c-7 0 -10 14 -1 18 c3 1.4 5 0 6 0 c1 0 3 1.4 6 0 c9 -4 6 -18 -1 -18 c-2 0 -4 1.4 -5 1.4 c-1 0 -3 -1.4 -5 -1.4 Z" fill="#e0503f"/>' +   /* piros alma */
      '<path d="M39 45 c0 -4 3 -6 6 -6" stroke="#5aa84e" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="35" cy="52" rx="2.6" ry="4.6" fill="#fff" opacity="0.3"/>' +
      '<path d="M52 30 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 Z" fill="#ffd24d"/>' +   /* nyami-csillám */
      '<circle cx="26" cy="30" r="2" fill="#ffe987"/>' },
  /* 😴 Befekvés = KÉPESSÉG (nincs `perc` → a trükk-sorban nem jelenik meg gomb): megvéve egy letett
     KERTI ÁGY-ra koppintva az unikornis odasétál és belefekszik (tartós pihenő-póz, mint az ülés).
     A bekötés a kertAgyKoppint/kertFekszik ágon fut; a fekvésből koppintásra feláll. */
  { id: "befekves", nev: "Befekvés", ar: 6, emoji: "😴",
    svg: '<rect x="14" y="16" width="52" height="52" rx="6" fill="#eaf6ff"/>' +   /* rét-korong (mint a többinél) */
      '<path d="M14 52 Q40 44 66 52 L66 68 L14 68 Z" fill="#8ecf6e"/>' +
      '<rect x="21" y="48" width="38" height="8" rx="3" fill="#b98a55"/>' +       /* ágykeret */
      '<rect x="23" y="41" width="34" height="9" rx="4" fill="#fbeede"/>' +       /* matrac */
      '<rect x="23" y="37" width="14" height="9" rx="3" fill="#ffd9e4"/>' +       /* párna */
      '<path d="M45 31 l6 0 -6 6 6 0" stroke="#7a3bc0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +   /* Z */
      '<path d="M52 22 l4 0 -4 4 4 0" stroke="#9a6ad0" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' }   /* kis z */
];

/* ── KERT BERENDEZÉSI TÁRGYAK (kert-berendezes-terv.html, 2026-09-14): 💧-ért, DARABRA vehető,
   a kertben szabadon lerakható tárgyak. Adatvezérelt: egy tárgy = egy sor (id, nev, ar, csoport).
   A rajzot a `kertTargyBelso(id)` adja: origó a TALAJPONT (0,0), a tárgy fölfelé (negatív y) épül —
   így a bolti bélyegkép és a kertbeli példány UGYANAZT a rajzot használja. Új tárgy = 1 sor + 1 rajz-ág. */
var KERT_TARGYAK = [
  /* Díszek */
  { id: "kerites",   nev: "Kerítés-elem",   ar: 2, csoport: "disz" },
  { id: "lampas",    nev: "Kerti lámpás",   ar: 3, csoport: "disz" },
  { id: "szokokut",  nev: "Kis szökőkút",   ar: 4, csoport: "disz" },
  { id: "agy",       nev: "Kerti ágy",      ar: 4, csoport: "disz" },   /* letéve a Befekvés képességgel „ráfekhető" (tárgy, a helyén marad) */
  /* Növényzet */
  { id: "viragagyas", nev: "Virágágyás",    ar: 2, csoport: "noveny" },
  { id: "tulipan",    nev: "Tulipán-csokor", ar: 2, csoport: "noveny" },
  { id: "gombak",     nev: "Gombák",        ar: 2, csoport: "noveny" },
  { id: "bokor",      nev: "Virágzó bokor", ar: 3, csoport: "noveny" },
  { id: "facska",     nev: "Fácska",        ar: 4, csoport: "noveny" },
  /* Ételek — letéve az Evés képességgel megehető (nem fogy el, a helyén marad) */
  { id: "ropi",  nev: "Ropogtatnivaló", ar: 2, csoport: "etel" },
  { id: "eper",  nev: "Eperkosár",      ar: 3, csoport: "etel" },
  { id: "torta", nev: "Ünnepi torta",   ar: 4, csoport: "etel" }
];
/* csoportok a bolt „Kert" fülén (a tárgyak ide sorolódnak) */
var KERT_TARGY_CSOPORTOK = [
  { kulcs: "kt-disz",   nev: "Díszek",    csoport: "disz" },
  { kulcs: "kt-noveny", nev: "Növényzet", csoport: "noveny" },
  { kulcs: "kt-etel",   nev: "Ételek",    csoport: "etel" }
];
function kertTargyDef(id) { for (var i = 0; i < KERT_TARGYAK.length; i++) if (KERT_TARGYAK[i].id === id) return KERT_TARGYAK[i]; return null; }
/* egy tárgy rajza — origó = TALAJPONT (0,0), fölfelé (negatív y) épül. Színátmenetek: index.html #ko-*. */
function kertTargyBelso(id) {
  var arny = '<ellipse cx="0" cy="0" rx="RX" ry="RY" fill="#2c5a1e" opacity="0.16"/>';   /* talaj-árnyék minta */
  if (id === "bokor") return arny.replace("RX", 34).replace("RY", 8)
    + '<circle cx="-17" cy="-20" r="19" fill="url(#ko-leaf2)"/>'
    + '<circle cx="17" cy="-20" r="19" fill="url(#ko-leaf2)"/>'
    + '<circle cx="0" cy="-34" r="23" fill="url(#ko-leaf)"/>'
    + '<circle cx="0" cy="-15" r="19" fill="url(#ko-leaf)"/>'
    + '<g fill="#ff9ec4"><circle cx="-11" cy="-34" r="3.6"/><circle cx="12" cy="-40" r="3.6"/><circle cx="0" cy="-23" r="3.6"/><circle cx="18" cy="-27" r="3.2"/></g>'
    + '<g fill="#fff"><circle cx="-11" cy="-34" r="1.3"/><circle cx="12" cy="-40" r="1.3"/><circle cx="0" cy="-23" r="1.3"/></g>';
  if (id === "facska") return arny.replace("RX", 26).replace("RY", 7)
    + '<rect x="-6" y="-40" width="12" height="40" rx="4" fill="url(#ko-trunk)"/>'
    + '<circle cx="-16" cy="-52" r="18" fill="url(#ko-leaf2)"/>'
    + '<circle cx="16" cy="-52" r="18" fill="url(#ko-leaf2)"/>'
    + '<circle cx="0" cy="-66" r="22" fill="url(#ko-leaf)"/>'
    + '<circle cx="0" cy="-46" r="18" fill="url(#ko-leaf)"/>'
    + '<circle cx="-10" cy="-58" r="3.4" fill="#ff6b6b"/><circle cx="10" cy="-52" r="3.4" fill="#ff6b6b"/><circle cx="2" cy="-68" r="3.4" fill="#ff8f6b"/>';
  if (id === "kerites") return arny.replace("RX", 36).replace("RY", 7)
    + '<g stroke="#c9a86a" stroke-width="1">'
    + '<rect x="-34" y="-24" width="68" height="7" rx="3" fill="url(#ko-wood)"/>'
    + '<rect x="-34" y="-12" width="68" height="7" rx="3" fill="url(#ko-wood)"/>'
    + '<path d="M-30 -2 V-30 l6 -8 6 8 V-2 Z" fill="url(#ko-wood)"/>'
    + '<path d="M18 -2 V-30 l6 -8 6 8 V-2 Z" fill="url(#ko-wood)"/>'
    + '</g>';
  if (id === "lampas") return arny.replace("RX", 15).replace("RY", 5)
    + '<circle class="kt-lampas-glow" cx="0" cy="-52" r="19" fill="#fff3b0" opacity="0.5"/>'
    + '<rect x="-3" y="-48" width="6" height="48" rx="2.5" fill="url(#ko-trunk)"/>'
    + '<rect class="kt-lampas-uveg" x="-10" y="-66" width="20" height="20" rx="3" fill="#ffe9a3" stroke="#7a6a3a" stroke-width="1.3"/>'
    + '<line x1="0" y1="-66" x2="0" y2="-46" stroke="#c9a24a" stroke-width="1"/>'
    + '<path d="M-11 -66 h22 l-3 -7 h-16 Z" fill="#4a3d66"/>'
    + '<circle class="kt-lampas-lang" cx="0" cy="-56" r="3.6" fill="#fff4c2"/>';
  if (id === "szokokut") return arny.replace("RX", 40).replace("RY", 11)
    + '<ellipse cx="0" cy="-4" rx="40" ry="13" fill="url(#ko-stone)"/>'
    + '<ellipse class="kt-szokokut-tukr" cx="0" cy="-8" rx="34" ry="10" fill="url(#ko-water2)"/>'
    + '<rect x="-5" y="-40" width="10" height="34" rx="3" fill="url(#ko-stone)"/>'
    + '<ellipse cx="0" cy="-40" rx="14" ry="5" fill="url(#ko-stone)"/>'
    + '<ellipse class="kt-szokokut-teto" cx="0" cy="-42" rx="9" ry="3.4" fill="url(#ko-water)"/>'
    + '<path class="kt-szokokut-sugar" d="M0 -44 C-7 -56 -4 -66 0 -70 C4 -66 7 -56 0 -44 Z" fill="url(#ko-water)" opacity="0.9"/>'
    + '<path class="kt-szokokut-ag" d="M-4 -40 C-12 -30 -14 -18 -14 -10" stroke="url(#ko-water)" stroke-width="3" fill="none" opacity="0.75"/>'
    + '<path class="kt-szokokut-ag" style="animation-delay:1.2s" d="M4 -40 C12 -30 14 -18 14 -10" stroke="url(#ko-water)" stroke-width="3" fill="none" opacity="0.75"/>';
  if (id === "agy" || id === "agy-elol")   /* a kerti ágy = az odúban választott ágy (agyRajz), kicsinyítve; a .kt-agy-matrac süpped be az unikornis súlyától.
     Az "agy-elol" a perem: külön rétegben az unikornis ELÉ, így fekve belesüpped. KERT_AGY_SKALA: az unikornis és az ágy aránya ugyanaz, mint az odúban. */
    return '<g transform="scale(' + KERT_AGY_SKALA + ') translate(-155,-452)"><g class="kt-agy-matrac">' + AGY_KERET
      + agyRajz((P().odu.szint && P().odu.szint.agy) || 1, id === "agy" ? "hatso" : "elol") + '</g></g>';
  if (id === "viragagyas") return arny.replace("RX", 36).replace("RY", 9)
    + '<ellipse cx="0" cy="-2" rx="34" ry="10" fill="#7a5230"/>'
    + '<ellipse cx="0" cy="-5" rx="30" ry="7" fill="#8a5f39"/>'
    + '<g stroke="#4f9e46" stroke-width="2"><line x1="-22" y1="-6" x2="-22" y2="-20"/><line x1="-8" y1="-6" x2="-8" y2="-24"/><line x1="6" y1="-6" x2="6" y2="-22"/><line x1="20" y1="-6" x2="20" y2="-18"/></g>'
    + '<circle cx="-22" cy="-22" r="5.5" fill="#ff9ec2"/><circle cx="-8" cy="-26" r="6" fill="#ffd24d"/><circle cx="6" cy="-24" r="5.5" fill="#c79cff"/><circle cx="20" cy="-20" r="5" fill="#8fd0ff"/>'
    + '<g fill="#fff"><circle cx="-22" cy="-22" r="1.6"/><circle cx="-8" cy="-26" r="1.6"/><circle cx="6" cy="-24" r="1.6"/></g>';
  if (id === "tulipan") return arny.replace("RX", 20).replace("RY", 6)
    + '<g stroke="#4f9e46" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-14 -2 V-32"/><path d="M0 -2 V-40"/><path d="M14 -2 V-34"/></g>'
    + '<path d="M-12 -18 c8 -1 12 -6 14 -12" stroke="#5aa84e" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M-20 -32 q-3 -10 6 -12 q9 2 6 12 q-3 3 -6 1 q-3 2 -6 -1 Z" fill="#ff7ea8"/>'
    + '<path d="M-6 -40 q-3 -10 6 -12 q9 2 6 12 q-3 3 -6 1 q-3 2 -6 -1 Z" fill="#ffca3a"/>'
    + '<path d="M8 -34 q-3 -10 6 -12 q9 2 6 12 q-3 3 -6 1 q-3 2 -6 -1 Z" fill="#ff6b6b"/>';
  if (id === "gombak") return arny.replace("RX", 24).replace("RY", 6)
    + '<rect x="-12" y="-16" width="9" height="16" rx="4" fill="#f6ecd6"/>'
    + '<path d="M-22 -16 a14 12 0 0 1 28 0 Z" fill="#e0503f"/>'
    + '<ellipse cx="-8" cy="-16" rx="14" ry="3" fill="#c53f30"/>'
    + '<g fill="#fff"><circle cx="-14" cy="-22" r="2"/><circle cx="-4" cy="-24" r="1.8"/><circle cx="-9" cy="-19" r="1.4"/></g>'
    + '<rect x="11" y="-11" width="7" height="11" rx="3.5" fill="#f6ecd6"/>'
    + '<path d="M4 -11 a11 9 0 0 1 22 0 Z" fill="#ef6a54"/>'
    + '<ellipse cx="15" cy="-11" rx="11" ry="2.4" fill="#d24f3c"/>'
    + '<g fill="#fff"><circle cx="10" cy="-15" r="1.6"/><circle cx="20" cy="-14" r="1.4"/></g>';
  /* ── Ételek (kert-berendezes-rajzterv.html, talajpont-origóra tolva: x−60, y−106) ── */
  if (id === "ropi") return arny.replace("RX", 26).replace("RY", 7)
    + '<path d="M-18 -30 c-10 0 -14 20 -2 26 c4 2 8 0 8 0 c0 0 4 2 8 0 c12 -6 8 -26 -2 -26 c-3 0 -6 2 -6 2 c0 0 -3 -2 -6 -2 Z" fill="#e0503f"/>'   /* alma */
    + '<path d="M-12 -32 c0 -6 4 -8 8 -8" stroke="#5aa84e" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="-14" cy="-24" rx="4" ry="7" fill="#fff" opacity="0.25"/>'
    + '<path d="M14 -6 c-4 -16 -2 -30 4 -34 c6 4 8 18 4 34 c-2 4 -6 4 -8 0 Z" fill="#ff9f3a"/>'   /* répa */
    + '<path d="M16 -40 l-6 -8 M20 -40 l4 -8 M18 -41 l0 -10" stroke="#5aa84e" stroke-width="2.4" stroke-linecap="round"/>'
    + '<g stroke="#d9832a" stroke-width="1"><line x1="14" y1="-26" x2="22" y2="-26"/><line x1="15" y1="-18" x2="21" y2="-18"/></g>';
  if (id === "eper") return arny.replace("RX", 28).replace("RY", 7)
    + '<g fill="#ff5d6c">'   /* három eperszem */
    + '<path d="M-16 -40 c-5 0 -7 8 -1 12 c2 1 4 0 5 0 c1 0 3 1 5 0 c6 -4 4 -12 -1 -12 c-2 0 -3 1 -4 1 c-1 0 -2 -1 -4 -1 Z"/>'
    + '<path d="M0 -44 c-5 0 -7 8 -1 12 c2 1 4 0 5 0 c1 0 3 1 5 0 c6 -4 4 -12 -1 -12 c-2 0 -3 1 -4 1 c-1 0 -2 -1 -4 -1 Z"/>'
    + '<path d="M16 -40 c-5 0 -7 8 -1 12 c2 1 4 0 5 0 c1 0 3 1 5 0 c6 -4 4 -12 -1 -12 c-2 0 -3 1 -4 1 c-1 0 -2 -1 -4 -1 Z"/>'
    + '</g>'
    + '<g fill="#ffe14d"><circle cx="-14" cy="-36" r="1"/><circle cx="-10" cy="-34" r="1"/><circle cx="1" cy="-40" r="1"/><circle cx="5" cy="-37" r="1"/><circle cx="18" cy="-36" r="1"/></g>'   /* magvak */
    + '<g fill="#4f9e46"><path d="M-14 -44 l3 4 l3 -4Z"/><path d="M2 -48 l3 4 l3 -4Z"/><path d="M18 -44 l3 4 l3 -4Z"/></g>'   /* levélkék */
    + '<path d="M-26 -28 h52 l-6 22 h-40 Z" fill="#c8934f"/>'   /* kosár */
    + '<path d="M-26 -28 h52 l-1 6 h-50 Z" fill="#a9762f"/>'
    + '<g stroke="#8a5f2a" stroke-width="1.4"><line x1="-16" y1="-22" x2="-18" y2="-6"/><line x1="0" y1="-22" x2="0" y2="-6"/><line x1="16" y1="-22" x2="18" y2="-6"/></g>';
  if (id === "torta") return arny.replace("RX", 28).replace("RY", 7)
    + '<rect x="-26" y="-26" width="52" height="20" rx="5" fill="#ffd9a6"/>'   /* alsó szint */
    + '<path d="M-26 -22 q13 8 26 0 q13 -8 26 0 v-4 h-52 Z" fill="#fff3f6"/>'
    + '<rect x="-20" y="-44" width="40" height="20" rx="5" fill="#ffe1ec"/>'   /* felső szint */
    + '<path d="M-20 -40 q10 7 20 0 q10 -7 20 0 v-4 h-40 Z" fill="#fff6fa"/>'
    + '<rect x="-2" y="-58" width="4" height="14" rx="2" fill="#8fd0ff"/>'   /* gyertya */
    + '<path d="M0 -62 c-3 3 -3 6 0 6 c3 0 3 -3 0 -6 Z" fill="#ffb03a"/>'   /* láng */
    + '<g fill="#ff7ea8"><circle cx="-12" cy="-34" r="1.6"/><circle cx="0" cy="-36" r="1.6"/><circle cx="12" cy="-34" r="1.6"/></g>'
    + '<g fill="#a7e0ff"><circle cx="-16" cy="-16" r="1.6"/><circle cx="0" cy="-14" r="1.6"/><circle cx="16" cy="-16" r="1.6"/></g>';
  return '';
}
/* a bolti/fészer bélyegkép: a tárgy egységes négyzetes korongon, rét-sávval (a rajz talajpont-origós) */
function kertTargyIkon(id) {
  return '<svg viewBox="-49 -84 98 98" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M-42 -4 Q0 -13 42 -4 L42 14 L-42 14 Z" fill="#8ecf6e"/>' +   /* rét-sáv a talajnál */
    (id === "agy" ? kertTargyBelso("agy") + kertTargyBelso("agy-elol") : kertTargyBelso(id)) + '</svg>';
}
/* a bolt „Kert" fülének tárgy-csoportjai (csak nyitott kert esetén) */
function kertTargyBoltCsoportok() {
  return KERT_TARGY_CSOPORTOK.map(function (cs) {
    return { kulcs: cs.kulcs, nev: cs.nev, fajta: "kertdisz",
      tetelek: KERT_TARGYAK.filter(function (t) { return t.csoport === cs.csoport; }) };
  }).filter(function (g) { return g.tetelek.length; });
}
/* hány példány van már lerakva egy tárgyból (a bagoly szövegéhez) */
function kertElemDb(id) { var n = 0, e = P().kert.elemek || []; for (var i = 0; i < e.length; i++) if (e[i].tip === id) n++; return n; }
/* egy tárgy megvétele → a fészerbe kerül (darabra, 💧-ért) */
function kertTargyVesz(t) {
  if ((P().tunderharmat || 0) < t.ar) { renderOduPanel(); return; }
  P().tunderharmat -= t.ar; vasarlasNaplo(t.id, t.ar, "tunderharmat");
  P().kert.keszlet[t.id] = (P().kert.keszlet[t.id] || 0) + 1;
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function vitrinPreviewOdu(id) {
  var o = P().odu, uj = {}, k; for (k in o) uj[k] = o[k];
  uj.vitrin = {}; for (k in (o.vitrin || {})) uj.vitrin[k] = o.vitrin[k];
  uj.vitrin[id] = 1;
  return uj;
}
function oduVitrinVesz(t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  P().odu.vitrin[t.id] = 1;                 /* a vitrinbe kerül, ott is marad */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
/* A „Kert" fül tételei két valutát kevernek: a kulcs ✨ (csillampor), a séta-trükkök
   💧 (tunderharmat, kitartás-valuta). Ez a három segéd dönti el, melyik a tétel valutája. */
function kertTrukkTetel(cs, t) { return !!(cs && cs.fajta === "kert" && t); }
/* 💧-s tétel: a séta-trükkök ÉS a berendezési tárgyak (kertdisz) is tündérharmatért mennek */
function harmatTetel(cs, t) { return kertTrukkTetel(cs, t) || !!(cs && cs.fajta === "kertdisz"); }
function boltValuta(cs, t) { return harmatTetel(cs, t) ? "💧" : "✨"; }
function boltPenz(cs, t) { return harmatTetel(cs, t) ? (P().tunderharmat || 0) : P().csillampor; }
/* Kert-tétel vétele: a „kulcs" (✨) kinyitja a kertkaput; a séta-trükkök (💧) a kertben játszhatók. */
function oduKertVesz(t) {
  if ((P().tunderharmat || 0) < t.ar) { renderOduPanel(); return; }
  P().tunderharmat -= t.ar;
  vasarlasNaplo(t.id, t.ar, "tunderharmat");
  P().kert.trukkok[t.id] = 1;
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
/* a Kincsvitrin a fő falon: fa szekrény, 2×3 állvány; a megvett kristály-dísz a helyére kerül,
   a hiányzó helyeken halvány „?" — a gyűjtemény láthatóan telik. Odú-koordináta (680×540). */
/* Kincsek — NYITOTT POLC a fő falon (producer 2026-09-14): nincs szekrény/üveg, nincs felirat,
   nincs „?" és nincs szaggatás; az üres helyek tiszta kis állványok. Két pasztell fapolc, 3-3 hely. */
function vitrinReteg(o) {
  var v = (o && o.vitrin) || {};
  var X = 256, W = 140, rowY = [242, 300], colX = [X + 24, X + 70, X + 116];
  var s = '<g class="odu-vitrin">';
  rowY.forEach(function (ry) {
    s += '<rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="7" rx="3" fill="#cbb6e6"/>';
    s += '<rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="3" rx="1.5" fill="#dcc7f0"/>';
    s += '<path d="M' + (X + 12) + ' ' + (ry + 11) + ' q-6 8 2 16" stroke="#ab90cf" stroke-width="3" fill="none" stroke-linecap="round"/>';
    s += '<path d="M' + (X + W - 12) + ' ' + (ry + 11) + ' q6 8 -2 16" stroke="#ab90cf" stroke-width="3" fill="none" stroke-linecap="round"/>';
  });
  for (var i = 0; i < 6; i++) {
    var cx = colX[i % 3], cy = rowY[Math.floor(i / 3)], it = KRISTALY[i];
    if (it && v[it.id]) {
      s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="14" ry="4" fill="#c9a8e6"/>';
      s += '<g class="odu-kristaly"><g transform="translate(' + (cx - 21) + ',' + (cy - 42) + ') scale(0.52)">' + it.svg + '</g></g>';
    } else {
      s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="11" ry="3.2" fill="#e6dcf2"/>';   /* üres, tiszta állvány */
    }
  }
  return s + '</g>';
}

/* --- csillagszilánk-réteg az ablak egén (7.1c/3.3b): pályánként egy szilánk, a PALYAK sorrendjében.
   teljes ösvény (arany) = ragyogó arany szilánk, kész (volt kerülő) = halványabb ezüst,
   még nem kész = SEMMI nem látszik (producer-döntés, 2026-09-11 – nincs üres körvonal/pötty).
   A szilánkszám a PALYAK hosszához igazodik (most 32 = 9 összeadó + 5 szorzós + 12 mérés + 6 könyvtár); ha több pálya lenne, mint pozíció,
   a maradék egy belső körre kerül. Odú-koordináta (680×540), a hívó klippeli az ablakra.
   Csak a szoba-ablakban jelenik meg (a napszak-bélyegképek NEM hívják). --- */
function oduSzilankReteg() {
  var POZ = [[166, 154], [188, 145], [210, 142], [228, 172], [230, 192], [216, 210], [198, 220], [182, 222], [152, 196], [146, 186], [150, 162], [184, 188], [196, 196],
    /* 13 új hely (2026-09-27): a Szám-rengeteg (eddig tartalék-körön) + a 12 mérés-pálya — a meglévők közé,
       az ablakkereszttől, az esti holdtól és a felhőtől távol */
    [198, 172], [172, 172], [164, 218], [212, 188], [172, 138], [168, 192], [182, 160], [158, 172], [154, 150], [202, 208], [228, 206], [210, 222], [144, 172],
    /* 6 új hely (2026-09-29): a 📚 Bagolykönyvtár 6 pályája (32 szilánk) */
    [220, 156], [156, 208], [190, 208], [238, 182], [176, 150], [206, 160]];
  var s = "";
  for (var i = 0; i < PALYAK.length; i++) {
    var pr = P().palyak[PALYAK[i].id];
    if (!pr || !pr.kesz) continue;                 /* üres hely NEM látszik */
    var p = POZ[i];
    if (!p) { var a = Math.PI * 2 * (i - POZ.length) / Math.max(1, PALYAK.length - POZ.length); p = [190 + Math.cos(a) * 30, 180 + Math.sin(a) * 30]; }
    if (pr.arany) s += '<g class="odu-szilank-arany"><use href="#sz-arany" x="' + p[0] + '" y="' + p[1] + '"/></g>';
    else s += '<use href="#sz-ezust" x="' + p[0] + '" y="' + p[1] + '"/>';
  }
  return s;
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

/* --- 🧺 a Szekrény a szobában, a régi bolt-stand helyén (Térkép mint központ, 3. kör): pasztell ruhásszekrény
   csillagos koronával; a jobb ajtó résnyire nyitva, kilóg egy csíkos sál, bent egy csillag ragyog --- */
function szekrenySVG(cx, cy) {
  var s = '<g transform="translate(' + cx + ',' + cy + ')">';
  s += '<ellipse cx="0" cy="16" rx="40" ry="8" fill="#3b2f66" opacity="0.16"/>';
  s += '<rect x="-30" y="8" width="7" height="9" rx="2" fill="#a88fce"/><rect x="23" y="8" width="7" height="9" rx="2" fill="#a88fce"/>';   /* lábak */
  s += '<path d="M-34 10V-48Q-34 -58 -24 -58H24Q34 -58 34 -48V10Z" fill="#e9d6f0" stroke="#a88fce" stroke-width="2.4"/>';   /* törzs */
  s += '<path d="M-38 -56Q0 -78 38 -56Q38 -52 34 -52H-34Q-38 -52 -38 -56Z" fill="#c9a8e6" stroke="#a88fce" stroke-width="2"/>';   /* korona */
  s += '<g stroke="#a88fce" stroke-width="1.4" stroke-linejoin="round">' + csillagSVG(0, -64, 5.5, "#ffd878") + '</g>';
  s += '<rect x="-29" y="-48" width="27" height="52" rx="4" fill="#f7d6ea" stroke="#c197bf" stroke-width="1.8"/>';   /* bal ajtó */
  s += '<path d="M-15.5 -32c-3 -4 -8 -1 -5 3l5 5l5 -5c3 -4 -2 -7 -5 -3z" fill="#f6a5c0"/><circle cx="-6" cy="-14" r="2.2" fill="#ffd24d" stroke="#c9a06a" stroke-width="1"/>';
  s += '<rect x="2" y="-48" width="27" height="52" rx="4" fill="#5e4a8a"/>';   /* a résnyire nyitott jobb ajtó mögött */
  s += csillagSVG(18, -30, 5, "#ffe9ad");
  s += '<path d="M6 -40q6 8 2 18q-3 8 2 16" stroke="#f6a5c0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6 -40q6 8 2 18q-3 8 2 16" stroke="#fce49a" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="4 5"/>';
  s += '<path d="M14 -49L31 -53V7L14 5Z" fill="#f7d6ea" stroke="#c197bf" stroke-width="1.8"/><circle cx="18" cy="-16" r="2" fill="#ffd24d" stroke="#c9a06a" stroke-width="1"/>';
  s += '<path d="M23 -36c-2 -3 -6 -1 -4 2l4 4l4 -4c2 -3 -2 -5 -4 -2z" fill="#f6a5c0"/>';
  s += '<g class="odu-bolt-szikra" fill="#fff2c4">' + csillagSVG(-40, -24, 2.6, "#fff2c4") + csillagSVG(40, -40, 2.2, "#fff2c4") + '</g>';   /* „nyomj rám” */
  return s + '</g>';
}

/* --- a teljes Csillagbolt háttér (680×540) — a bolt.svg mintájára --- */

/* --- a teljes odú-szoba (680×540) — az odu-belso.svg mintájára --- */
/* RUGALMAS SZOBA (odú D2, rajzterv: Matekos/odu-terulet-rajzterv.html): a fix közép mindig látszik
   (a két leendő oldalajtóval együtt), a falak annyira nyúlnak ki oldalra, amennyi hely van; felül a
   plafon üres része lemarad („közelebb"). Álló telefonon nem nyújtjuk: A ≥ 1,3, a szoba középen marad. */
var ODU_KOZEP = { L: -96, R: 776, T: 88, B: 540 };
function oduKeret(arany) {
  var K = ODU_KOZEP, kw = K.R - K.L, kh = K.B - K.T, cx = (K.L + K.R) / 2;
  var A = Math.max(arany, 1.3), w, h, x0, y0;
  if (A >= kw / kh) { h = kh; w = h * A; x0 = cx - w / 2; y0 = K.T; }
  else { w = kw; h = w / A; x0 = K.L; y0 = K.T - (h - kh) * 0.55; }
  return { L: x0, T: y0, W: w, H: h, R: x0 + w, B: y0 + h, cx: cx };
}

function oduSVG(lenyKulcs, o, elonezet, arany) {
  var c = LENYEK[lenyKulcs];
  var WX = 190, WY = 180, WR = 64;                  /* ablak: bal-felső, holddal */
  var tint = { este: ["#2b2a5a", 0.14], reggel: ["#ffd0e0", 0.08], del: ["#fff3d0", 0.04], eclipse: ["#0a0a1e", 0.22] }[o.napszak] || ["#2b2a5a", 0.14];
  /* arany nélkül (bolti előnézet) a régi, fix 680×540-es szoba */
  var tag = !!arany;
  var F = tag ? oduKeret(arany) : { L: 0, T: 0, W: 680, H: 540, R: 680, B: 540, cx: 340 };
  var bL = tag ? F.L + 14 : 75, bR = tag ? F.R - 14 : 605, bB = F.B;   /* belső fal széle + padló alja */

  var s = '<svg viewBox="' + F.L.toFixed(1) + ' ' + F.T.toFixed(1) + ' ' + F.W.toFixed(1) + ' ' + F.H.toFixed(1) + '" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs><clipPath id="odu-ablak"><circle cx="' + WX + '" cy="' + WY + '" r="' + (WR - 10) + '"/></clipPath>';
  /* csillagszilánk-szimbólumok (grafika: mockup-csillagszilank-ego.html) – 0,0 középre rajzolva */
  s += '<filter id="odu-ragyog" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="2.3"/></filter>';
  s += '<g id="sz-arany"><circle r="9" fill="#ffd24d" opacity="0.55" filter="url(#odu-ragyog)"/><path d="M0 -8 L2.2 -2.2 L8 0 L2.2 2.2 L0 8 L-2.2 2.2 L-8 0 L-2.2 -2.2 Z" fill="#ffe07a" stroke="#f2b026" stroke-width="0.7" stroke-linejoin="round"/><path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#fff6d8"/><circle r="1.4" fill="#ffffff"/></g>';
  s += '<g id="sz-ezust"><circle r="6" fill="#cfe0f2" opacity="0.28" filter="url(#odu-ragyog)"/><path d="M0 -6.5 L1.7 -1.7 L6.5 0 L1.7 1.7 L0 6.5 L-1.7 1.7 L-6.5 0 L-1.7 -1.7 Z" fill="#d9e6f4" stroke="#a9bdd6" stroke-width="0.6" stroke-linejoin="round"/><circle r="1.1" fill="#ffffff"/></g>';
  s += '</defs>';

  /* fa kívül + fal + meleg alapfény */
  s += '<rect x="' + (F.L - 20) + '" y="' + (F.T - 20) + '" width="' + (F.W + 40) + '" height="' + (F.H + 40) + '" fill="#2e2350"/>';
  if (tag) {                                /* a falak a látható szélig érnek, a plafon íve a tetőhöz igazodik */
    var pT = Math.min(F.T, 88), fcx = F.cx;
    s += '<path d="M' + F.L + ' ' + bB + ' L' + F.L + ' ' + (pT + 142) + ' Q' + F.L + ' ' + (pT - 8) + ' ' + fcx + ' ' + (pT - 28) + ' Q' + F.R + ' ' + (pT - 8) + ' ' + F.R + ' ' + (pT + 142) + ' L' + F.R + ' ' + bB + ' Z" fill="#b79fd4" class="odu-kul"/>';
    s += '<path d="M' + bL + ' ' + bB + ' L' + bL + ' ' + (pT + 157) + ' Q' + bL + ' ' + (pT + 12) + ' ' + fcx + ' ' + (pT - 4) + ' Q' + bR + ' ' + (pT + 12) + ' ' + bR + ' ' + (pT + 157) + ' L' + bR + ' ' + bB + ' Z" fill="#cbb6e6" class="odu-fal"/>';
  } else {
    s += '<path d="M30 540 L30 230 Q30 80 340 60 Q650 80 650 230 L650 540 Z" fill="#b79fd4" class="odu-kul"/>';
    s += '<path d="M75 540 L75 245 Q75 110 340 92 Q605 110 605 245 L605 540 Z" fill="#cbb6e6" class="odu-fal"/>';
  }
  s += '<ellipse cx="345" cy="330" rx="250" ry="210" fill="#ffd9ec" opacity="0.06"/><ellipse cx="140" cy="392" rx="120" ry="100" fill="#e9c9f0" opacity="0.1"/>';

  /* gyökér-erezet a falon */
  s += '<g class="odu-erezet" fill="none" stroke="#ab90cf" stroke-width="3" stroke-linecap="round" opacity="0.5">';
  s += '<path d="M150 250 Q160 360 150 500"/><path d="M245 240 Q255 360 248 500"/><path d="M440 240 Q432 360 440 500"/><path d="M525 250 Q516 360 525 500"/></g>';
  s += '<ellipse cx="437" cy="300" rx="9" ry="5" fill="#ab90cf"/>';
  s += butorElem(o, "fal");                 /* v3: tapéta / lambéria a falon */
  if (tag && ((o.szint && o.szint.fal) || 1) >= 3) {    /* a lambéria a kinyúló falakon is folytatódik */
    s += '<g fill="#c0a8dd"><rect x="' + bL + '" y="357" width="' + (75 - bL) + '" height="79"/><rect x="605" y="356" width="' + (bR - 605) + '" height="80"/></g>';
    s += '<g stroke="#a88fce" stroke-width="4"><line x1="' + bL + '" y1="357" x2="75" y2="357"/><line x1="605" y1="356" x2="' + bR + '" y2="356"/></g>';
  }

  /* padló */
  s += '<rect x="' + bL + '" y="436" width="' + (bR - bL) + '" height="' + (bB - 436) + '" fill="#e3c9de" class="odu-padlo"/>';
  s += '<g stroke="#cdaecb" stroke-width="2" opacity="0.6"><line x1="' + bL + '" y1="464" x2="' + bR + '" y2="464"/><line x1="' + bL + '" y1="494" x2="' + bR + '" y2="494"/><line x1="' + bL + '" y1="520" x2="' + bR + '" y2="520"/><line x1="200" y1="436" x2="200" y2="' + bB + '"/><line x1="345" y1="436" x2="345" y2="' + bB + '"/><line x1="470" y1="436" x2="470" y2="' + bB + '"/>';
  if (tag) { for (var px = 75; px > bL; px -= 125) s += '<line x1="' + px + '" y1="436" x2="' + px + '" y2="' + bB + '"/>'; for (var qx = 595; qx < bR; qx += 125) s += '<line x1="' + qx + '" y1="436" x2="' + qx + '" y2="' + bB + '"/>'; }
  s += '</g>';
  s += '<g class="odu-feny-hely"></g>';          /* ide kerülnek az élő szoba fénytócsái (odu-elet.js) — fal és padló fölé, bútor alá */

  /* zászlófüzér */
  s += '<path d="M100 112 Q340 150 580 112" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  var zsz = ["#f6a5c0", "#a7d99a", "#fce49a", "#c3a5e0", "#9ec9f0", "#f6a5c0", "#a7d99a"];
  var zY = [128, 130, 131, 130, 128, 124, 119];
  for (var z = 0; z < zsz.length; z++) { var zx = 236 + z * 48; s += '<path d="M' + zx + ' ' + zY[z] + ' l16 0 l-8 14 Z" fill="' + zsz[z] + '"/>'; }
  s += butorElem(o, "fuzer");               /* v3: csillag-/tündérfény-füzér */

  /* JELVÉNYTÁBLA a falon (odú D2, 2. lépés) — a régi szivárványos falikép helyén, ugyanakkora keretben,
     hogy ne lógjon az ablakra, a lámpára és a vitrinre; a függő kristály-dísz ezért jobbra költözött */
  s += '<g id="odu-t-jelveny" class="odu-targy">' + jelvenyTablaSVG() + '</g>';

  /* mennyezeti csillag-lámpa */
  s += '<line x1="345" y1="112" x2="345" y2="154" stroke="#8f7ab8" stroke-width="3"/><circle cx="345" cy="150" r="4" fill="none" stroke="#8f7ab8" stroke-width="3"/>';
  s += '<ellipse cx="345" cy="178" rx="40" ry="36" fill="#ffe9ad" opacity="0.16"/><ellipse cx="345" cy="178" rx="22" ry="20" fill="#ffe9ad" opacity="0.22"/>';
  s += '<polygon points="345,154 350,169 366,169 354,179 358,194 345,185 332,194 336,179 324,169 340,169" fill="#ffd878" stroke="#a88fce" stroke-width="3" stroke-linejoin="round"/>';

  /* Kincsvitrin a fő falon (megvett kristály-díszek) — 2026-09-28 óta a kertkapu régi helyén, a gyökérpolc fölött */
  s += '<g transform="translate(180,-80)">' + vitrinReteg(o) + '</g>';
  /* 🐚 a Kincsvitrin új polca a bal falon (az ablak mellett, a patkó-zóna fölött): a kertben talált part menti apróságok (teny-kert.js) */
  s += tenyKertKincsPolc(6, 112, 232);
  s += tenyKertRitkaPolc(6, 112, 276);   /* 🌰 alatta a Ritka virágok polca: a dombon kinyílt ritka virágok kis cserépben (teny-kert.js, 6. kör) */

  /* ── ABLAK (napszak + időjárás) ── */
  s += '<g id="odu-t-ablak" class="odu-targy">';   /* koppintható: innen nő ki a szivárványhíd az ösvényekre (6. lépés) */
  s += '<circle cx="' + WX + '" cy="' + WY + '" r="' + WR + '" fill="#a88fce"/>';
  s += '<g clip-path="url(#odu-ablak)"><g transform="translate(' + (WX - 60) + ',' + (WY - 60) + ')">';
  s += oduEgSVG(o.napszak, 120, 120);
  s += oduIdoSVG(o.ido, 120, 120, 7);
  s += '</g>';
  s += '<g pointer-events="none">' + oduSzilankReteg() + '</g>';   /* a gyűjtött csillagszilánkok az égen (7.1c/3.3b), odú-koordinátában, a hold/felhő ALATT */
  s += '</g>';
  s += '<ellipse cx="168" cy="206" rx="16" ry="7" fill="#cbb6e6"/><circle cx="160" cy="204" r="6" fill="#cbb6e6"/><circle cx="176" cy="203" r="7" fill="#cbb6e6"/>';
  s += '<line x1="190" y1="126" x2="190" y2="234" stroke="#a88fce" stroke-width="6"/><line x1="136" y1="180" x2="244" y2="180" stroke="#a88fce" stroke-width="6"/>';
  s += butorElem(o, "ablak");               /* v3: faragott keret / ólomüveg */
  s += butorElem(o, "fuggony");             /* v3: függöny az ablakra */
  s += '</g>';

  /* ── ÁGY (bal) — a választott ágy (bolti szint), közös rajz: agyRajz ── */
  var agySz = (o.szint && o.szint.agy) || 1;
  s += '<g id="odu-t-agy" class="odu-targy"><g class="odu-agy-matrac">' + AGY_KERET + '<g class="odu-agy-hatso">' + agyRajz(agySz, "hatso") + '</g>' + agyRajz(agySz, "elol") + '</g></g>';   /* 9. lépés: koppintható, fekve besüpped */

  /* ── GYÖKÉRPOLC (jobb-közép) ── */
  s += '<rect x="398" y="296" width="150" height="12" rx="4" fill="#cbb6e6"/>';
  s += '<path d="M410 308 q-8 18 6 30 l6 -4 q-10 -12 -4 -26 Z" fill="#ab90cf"/><path d="M536 308 q8 18 -6 30 l-6 -4 q10 -12 4 -26 Z" fill="#ab90cf"/>';
  if (elonezet || !tag) s += '<rect x="410" y="262" width="12" height="34" rx="2" fill="#f6a5c0"/><rect x="424" y="258" width="12" height="38" rx="2" fill="#9ec9f0"/><rect x="438" y="264" width="12" height="32" rx="2" fill="#a7d99a"/>';   /* a 3 kis könyv csak a bolti előnézetben; a játékban a nagy mesekönyv áll a helyükön */
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

  /* (a kertkapu a Térkép mint központ 2. körében megszűnt: a Kert a térképen van, az Odú mellett; a 🦋 is oda költözött) */

  /* ── KOPPINTHATÓ TÁRGYAK a gombsor helyett (odú D2, 2. lépés): nagy mesekönyv a gyökérpolcon (csak a rugalmas
     szobában fér el); a térképre az ablakon át visz a szivárványhíd. (Az utca-ajtó a Térkép mint központ 3. körében
     megszűnt: az utca csak a térképről nyílik.) ── */
  if (!elonezet && tag) s += '<g id="odu-t-gyujt" class="odu-targy">' + meseKonyvSVG() + '</g>';

  /* ── AZ UNIKORNIS a szőnyegen (előnézetben elhagyva, hogy a bútor jól látszódjon).
     A külső csoportot a séta tolja (CSS transform), a belsőt a közös fordulás tükrözi (--dir, uniFordul). ── */
  if (!elonezet) {
    s += '<g id="odu-t-felho">' + oduHidFelhoSVG() + '</g>';
    s += '<g id="odu-hid" pointer-events="none"></g>';
  }
  if (!elonezet) {
    var ux = tag ? ODU_UNI.x - ODU_UNI_RAJZ : 0, udir = tag ? ODU_UNI.dir : 1;
    s += '<g id="odu-uni-mozgo" style="transform:translate(' + ux + 'px,0px)">';
    s += '<ellipse id="odu-uni-arnyek" cx="348" cy="492" rx="56" ry="13" fill="#3b2f66" opacity="0.16"/>';
    /* #odu-uni-emel: befekvéskor felhuppan az ágyra (függőlegesen); #odu-uni-alvo: a póz és az alvás osztályai (9. lépés) */
    s += '<g id="odu-uni-emel"><g transform="translate(346,492)"><g id="odu-uni-flip" style="--dir:' + udir + ';transform:scale(var(--dir,1),1)"><g id="odu-uni-alvo" transform="scale(1.28)">' + unikornisSVG("odu-uni", c, 1, P().oltozet) + '</g></g></g></g>';
    s += '</g>';
    s += '<g id="odu-agy-elore" pointer-events="none"><g class="odu-agy-matrac">' + AGY_KERET + agyRajz((o.szint && o.szint.agy) || 1, "elol") + '</g></g>';   /* fekve az ágy pereme az unikornis elé */
  }

  /* mennyezeti csillámok */
  s += '<g fill="#fff2c4" opacity="0.7"><path d="M330 250 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><path d="M410 232 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><circle cx="360" cy="205" r="2"/><circle cx="300" cy="240" r="1.6"/><circle cx="470" cy="210" r="1.8"/><path d="M505 232 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z"/></g>';

  /* eső / hó a szobában is (halványabban) */
  if (o.ido === "eso" || o.ido === "ho") {
    var idoDb = Math.round((o.ido === "ho" ? 30 : 24) * F.W / 680);
    s += '<g opacity="0.5" pointer-events="none" transform="translate(' + F.L.toFixed(1) + ',' + Math.max(0, F.T).toFixed(1) + ')">' + oduIdoSVG(o.ido, F.W, 470, idoDb) + '</g>';
  }

  /* hangulatfény */
  s += '<rect x="' + (F.L - 20) + '" y="' + (F.T - 20) + '" width="' + (F.W + 40) + '" height="' + (F.H + 40) + '" fill="' + tint[0] + '" opacity="' + tint[1] + '" pointer-events="none" class="odu-tint"/>';

  /* ── 🧺 SZEKRÉNY a szőnyegtől jobbra (a régi bolt-stand helyén) — MINDIG legfelül, hogy biztosan kattintható legyen (előnézetben nincs) ── */
  if (!elonezet) s += '<g id="odu-szekreny" class="odu-targy"><rect x="508" y="430" width="96" height="98" fill="transparent"/>' + szekrenySVG(556, 506) + '</g>';

  if (!elonezet) s += '<g id="odu-hid-szikra" pointer-events="none"></g>';

  /* ── KOPPINTÓ RÉTEG legfelül: átlátszó mezők + névfelirat. A rajz alatta marad (fény, dísz, unikornis
     nem „nyeli el" a koppintást); a kiemelést a renderOdu teszi a tárgyra (.fel). ── */
  if (!elonezet) {
    s += '<g class="odu-celok">';
    ODU_CELOK.forEach(function (t) {
      if (t.csakTag && !tag) return;
      var h = t.hit, fw = t.felirat.length * 10 + 26, fx = t.fx - fw / 2;
      s += '<g class="odu-cel" data-cel="' + t.id + '" role="button" aria-label="' + t.felirat + '">';
      s += '<rect x="' + h[0] + '" y="' + h[1] + '" width="' + h[2] + '" height="' + h[3] + '" rx="10" fill="transparent"/>';
      s += '<g class="odu-felirat" pointer-events="none"><rect x="' + fx.toFixed(1) + '" y="' + (t.fy - 20) + '" width="' + fw.toFixed(1) + '" height="28" rx="14" fill="#fffaf0" stroke="#a88fce" stroke-width="2"/>';
      s += '<text x="' + t.fx + '" y="' + (t.fy + 0.5) + '" font-size="17" font-weight="800" fill="#5a3f8a" text-anchor="middle">' + t.felirat + '</text></g>';
      s += '</g>';
    });
    s += '</g>';
  }

  s += '</svg>';
  return s;
}
/* ══ ODÚ D2, 2. lépés: a régi alsó gombsor tárgyként a szobában (rajzterv: Matekos/odu-terulet-rajzterv.html).
   Minden rajz odú-koordinátában; a koppintást az oduSVG végi átlátszó réteg (ODU_CELOK) fogja. ══ */
/* halványan felvillanó kis csillag — „ez koppintható" (a bolt-stand csillámának testvére) */
function oduSzikra(x, y, r, kesl) {
  return '<g class="odu-targy-szikra" style="animation-delay:' + kesl + 's">' + csillagSVG(x, y, r, "#fff2c4") + '</g>';
}
/* ☁️ puha felhő a padlón, a bal fal előtt (a régi erdei ösvény-nyílás helyén): innen indul a szivárványhíd az ablakba */
function oduHidFelhoSVG() {
  var x = ODU_HID.x, y = 498, s = "";
  s += '<ellipse class="odu-kijarat-feny" cx="' + x + '" cy="' + (y - 4) + '" rx="96" ry="24" fill="#fff6c8" opacity="0.4"/>';
  s += '<ellipse cx="' + x + '" cy="' + (y + 10) + '" rx="78" ry="9" fill="#3b2f66" opacity="0.12"/>';
  s += '<g fill="#e9dcf7"><ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="74" ry="13"/><circle cx="' + (x - 44) + '" cy="' + (y - 4) + '" r="16"/><circle cx="' + (x + 46) + '" cy="' + (y - 3) + '" r="15"/></g>';
  s += '<g fill="#fbf7ff"><circle cx="' + (x - 22) + '" cy="' + (y - 10) + '" r="19"/><circle cx="' + (x + 14) + '" cy="' + (y - 12) + '" r="21"/><circle cx="' + (x + 40) + '" cy="' + (y - 6) + '" r="13"/><circle cx="' + (x - 48) + '" cy="' + (y - 5) + '" r="11"/></g>';
  s += '<g fill="none" stroke-width="2.4" stroke-linecap="round" opacity="0.7">';
  for (var k = 0; k < 3; k++) s += '<path d="M' + (x - 30 + k * 4) + ' ' + (y - 2 - k * 3) + ' Q' + x + ' ' + (y - 16 - k * 3) + ' ' + (x + 30 - k * 4) + ' ' + (y - 2 - k * 3) + '" stroke="' + SZIVARVANY_SZIN[k * 2] + '"/>';
  s += '</g>';
  s += oduSzikra(x + 52, y - 26, 3.2, 0.4);
  return s;
}
/* 🏅 jelvénytábla a falon: a gyerek (a lista szerinti) legutóbbi 3 jelvénye, üres helyen halvány kör */
function jelvenyTablaSVG() {
  var s = '<rect x="262" y="148" width="60" height="50" rx="5" fill="#b98a55"/><rect x="266" y="152" width="52" height="42" rx="3" fill="#f3e2c0"/>';
  s += '<g fill="#e6cfa4"><circle cx="272" cy="188" r="1.2"/><circle cx="310" cy="157" r="1.2"/><circle cx="296" cy="190" r="1"/></g>';   /* parafa-pöttyök */
  var megvan = (typeof JELVENYEK !== "undefined") ? JELVENYEK.filter(function (j) { return P().jelvenyek && P().jelvenyek[j.id]; }).slice(-3) : [];
  for (var i = 0; i < 3; i++) {
    var x = 267 + i * 17, j = megvan[i];
    if (j) s += jelvenyMedalSVG(j, true, false).replace('<svg ', '<svg x="' + x + '" y="158" width="17" height="17" ');
    else s += '<circle cx="' + (x + 8.5) + '" cy="165" r="6" fill="#ead6ae"/>';
  }
  s += '<rect x="276" y="182" width="32" height="6" rx="3" fill="#e0a92e"/>';                             /* kis arany névtábla */
  s += '<circle cx="292" cy="148" r="5" fill="#ffd24d" stroke="#c9a06a" stroke-width="1.4"/><path d="M289 152 l-3 7 l4 -2 l2 3 Z M295 152 l3 7 l-4 -2 l-2 3 Z" fill="#f6a5c0"/>';   /* rozetta */
  s += oduSzikra(318, 150, 2.8, 1.8);
  return s;
}
/* 📖 nagy mesekönyv a gyökérpolcon (a 3 kis könyv helyén) */
function meseKonyvSVG() {
  var s = '<ellipse cx="428" cy="296" rx="18" ry="3" fill="#3b2f66" opacity="0.16"/>';
  s += '<rect x="416" y="250" width="27" height="46" rx="2" fill="#fffaf0" stroke="#e6d8c0" stroke-width="1"/>';   /* lapok */
  s += '<g stroke="#e6d8c0" stroke-width="0.8"><line x1="441" y1="254" x2="441" y2="292"/><line x1="439" y1="254" x2="439" y2="292"/></g>';
  s += '<rect x="412" y="248" width="28" height="48" rx="3" fill="#9b6fd0"/><rect x="412" y="248" width="6" height="48" rx="2" fill="#7a4fb3"/>';
  s += '<rect x="421" y="253" width="15" height="38" rx="2" fill="none" stroke="#ffd878" stroke-width="1.4"/>';
  s += csillagSVG(428.5, 266, 5.5, "#ffd878");
  s += '<g stroke="#ffd878" stroke-width="1.6" stroke-linecap="round"><line x1="424" y1="278" x2="433" y2="278"/><line x1="425" y1="283" x2="432" y2="283"/></g>';
  s += oduSzikra(444, 246, 2.8, 2.7);
  return s;
}
/* a koppintható helyek: hit = [x,y,szél,mag] odú-koordinátában, fx/fy = a névfelirat helye, cx = ahova az
   unikornis odasétál. A sorrend a rétegsorrend (a későbbi van felül). */
var ODU_CELOK = [
  { id: "lampa", felirat: "Villany", helyben: true, hit: [330, 150, 42, 90], fx: 345, fy: 260, cx: 345 },   /* csillaglámpa + húzózsinór: villanyoltás (odu-elet.js), nem kell odasétálni */
  { id: "agy", felirat: "Ágy", helyben: true, hit: [40, 336, 236, 116], fx: 155, fy: 332, cx: 158 },   /* befekvés / felkelés (9. lépés); a sétát az oduBefekszik intézi */
  { id: "osveny", felirat: "Térkép", hit: [126, 116, 128, 128], fx: 190, fy: 268, cx: 60 },   /* az ablak: szivárványhíd (6. lépés) */
  { id: "jelveny", felirat: "Jelvények", hit: [256, 140, 72, 62], fx: 292, fy: 136, cx: 300 },
  { id: "gyujt", felirat: "Gyűjtemény", csakTag: true, hit: [406, 238, 40, 62], fx: 428, fy: 232, cx: 420 },
  { id: "szekreny", felirat: "Szekrény", hit: [508, 424, 96, 106], fx: 556, fy: 426, cx: 472 }
];
var ODU_CEL_RAJZ = { agy: "odu-t-agy", lampa: "", osveny: "odu-t-ablak", jelveny: "odu-t-jelveny", gyujt: "odu-t-gyujt", szekreny: "odu-szekreny" };
/* mit mond és mit nyit a koppintás (a régi gombsor gombjainak viselkedése) */
var ODU_CEL_TETT = {
  osveny: { szo: function () { return "Térkép"; }, nyit: function () { oduTavozasVege(); } },   /* a szivárványhídon át: oduTavozik */
  jelveny: { szo: function () { return "Jelvények"; }, nyit: function () { renderJelveny(); $("odu-lap").hidden = false; } },
  gyujt: { szo: function () { return "Gyűjtemény"; }, nyit: function () { renderGyujtemeny(); $("odu-lap").hidden = false; } },
  szekreny: { szo: function () { return "Szekrény"; }, nyit: function () { renderSzekreny(); $("odu-lap").hidden = false; } },   /* badges.js */
  lampa: { nyit: function () {
    oduVillanyKapcsol();
    if (!ODU_SOTET && ODU_FEKSZIK) _oduAgyIdo.push(setTimeout(function () { oduFelkel(true); }, 450));   /* villanygyújtás: reggel van — felkel és nyújtózik */
  } },
  agy: { nyit: function () { if (ODU_FEKSZIK) oduFelkel(true); else oduBefekszik(); } }
};

/* ── az unikornis sétája az odúban: koppintásra odaüget a tárgyhoz, és csak odaérve nyílik meg (~½–1 mp);
   séta közben egy második koppintás azonnal nyit. Lap/bolt bezárása után hazasétál a szőnyegre. ── */
var ODU_UNI_RAJZ = 346;   /* ahová a rajz készül (a séta ehhez képest tol) */
var ODU_UNI_HAZA = 346;   /* alaphelyzet: a szőnyeg közepe (a kertkapu megszűnt, Térkép mint központ 2. kör) */
var ODU_UNI = { x: ODU_UNI_HAZA, dir: 1 };
var _oduSetaIdo = null, _oduSetaCel = null;
function oduUniSetal(celX, kesz) {
  var mozgo = document.getElementById("odu-uni-mozgo"), flip = document.getElementById("odu-uni-flip");
  clearTimeout(_oduSetaIdo);
  if (uniJarFut(mozgo)) {   /* menet közben új cél: onnan indul, ahol épp jár */
    var most = new DOMMatrix(getComputedStyle(mozgo).transform).e;
    ODU_UNI.x = ODU_UNI_RAJZ + most;
    mozgo.style.transition = "none"; mozgo.style.transform = "translate(" + most + "px,0px)";
  }
  var tav = Math.abs(celX - ODU_UNI.x);
  var nyugi = nyugiMod();
  if (!mozgo || tav < 6 || nyugi) {
    uniAll(mozgo);
    ODU_UNI.x = celX;
    if (mozgo) { mozgo.style.transition = "none"; mozgo.style.transform = "translate(" + (celX - ODU_UNI_RAJZ) + "px,0px)"; }
    _oduSetaIdo = setTimeout(function () { if (kesz) kesz(); }, 120);
    return;
  }
  ODU_UNI.dir = celX < ODU_UNI.x ? -1 : 1;
  if (uniIrany(flip) !== ODU_UNI.dir) uniAll(mozgo);
  var fordul = uniFordul(flip, ODU_UNI.dir);   /* előbb megfordul (közös fordulás), csak utána lép */
  function indul() {
    var svg = mozgo.ownerSVGElement, m = svg && svg.getScreenCTM && svg.getScreenCTM();
    var ut = uniUt(mozgo, tav * (m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1)), mp = ut.mp;   /* a közös járás: séta vagy ügetés */
    mozgo.style.transition = "transform " + mp.toFixed(2) + "s linear";   /* egyenletes: a földön lévő pata nem csúszik */
    uniJar(mozgo, ut);
    ODU_UNI.x = celX;
    mozgo.style.transform = "translate(" + (celX - ODU_UNI_RAJZ) + "px,0px)";
    _oduSetaIdo = setTimeout(function () { uniAll(mozgo); if (kesz) kesz(); }, mp * 1000 + 60);
  }
  if (fordul) _oduSetaIdo = setTimeout(indul, fordul); else indul();
}
function oduTargyKoppint(cel) {
  var t = ODU_CEL_TETT[cel], def = null;
  ODU_CELOK.forEach(function (d) { if (d.id === cel) def = d; });
  if (!t || !def) return;
  if (def.helyben) { t.nyit(); return; }         /* a lámpa: azonnal kapcsol, séta és beszéd nélkül; az ágy: maga intézi */
  if (ODU_FEKSZIK) { oduFelkel(false, function () { oduTargyKoppint(cel); }); return; }   /* alszik → előbb felkel, aztán megy */
  if (cel === "osveny") { oduTavozik(); return; }   /* az ösvényekre: a szivárványhídon át */
  if (_oduSetaCel === cel) {                    /* türelmetlen második koppintás → azonnal nyílik */
    clearTimeout(_oduSetaIdo); _oduSetaCel = null;
    var m = document.getElementById("odu-uni-mozgo"); uniAll(m);
    t.nyit(); return;
  }
  hangGomb(); mondd(t.szo());
  _oduSetaCel = cel;
  oduUniSetal(def.cx, function () {
    _oduSetaCel = null;
    var k = $("kepernyo-odu");
    if (k && k.classList.contains("aktiv")) t.nyit();   /* közben elhagyta az odút → nem nyitunk semmit */
  });
}
/* a lap / bolt bezárása után vissza a szőnyegre, és újra a szoba felé néz */
function oduUniHaza() {
  if (Math.abs(ODU_UNI.x - ODU_UNI_HAZA) < 1) return;
  oduUniSetal(ODU_UNI_HAZA, function () {
    ODU_UNI.dir = 1;
    uniFordul(document.getElementById("odu-uni-flip"), 1);
  });
}

/* ── ODÚBELI ÁGY (unikornis pózok 9. lépés, terv/odu-agy-rajzterv.html; producer: csak az ágyra koppintva, ingyen,
   villanygyújtásra felkel). Az ágyra koppintva odasétál, a párna felé fordul, felhuppan, a matrac besüpped, és elalszik —
   a fekvés, az alvás, a Zzz és a nyújtózás a KÖZÖS kód (renderer.js: UNI_POZ.fekszik, uniElalszik/uniFelebred/uniNyujtozik),
   ugyanaz, mint a kertben; itt csak a hely (AGY_FEKVES, 1.28-as méret) és a rétegek vannak. Nem mentődik. ── */
var ODU_FEKSZIK = false;
var _oduAgyIdo = [];
function oduAgyFekves() { return AGY_FEKVES[agyFajta((P().odu.szint && P().odu.szint.agy) || 1)]; }
function oduAktiv() { var k = $("kepernyo-odu"); return !!(k && k.classList.contains("aktiv")); }
function oduBefekszik() {
  if (_oduTavozas) return;
  if (_oduSetaCel === "agy") {                  /* türelmetlen második koppintás → azonnal befekszik */
    clearTimeout(_oduSetaIdo); _oduSetaCel = null; uniAll(document.getElementById("odu-uni-mozgo")); oduFekszik(false); return;
  }
  hangGomb(); mondd("Ágy");
  _oduSetaCel = "agy";
  oduUniSetal(oduAgyFekves().x, function () { _oduSetaCel = null; if (oduAktiv()) oduFekszik(false); });
}
/* azonnal = true: huppanás és álmosság nélkül (újrarajzoláskor) */
function oduFekszik(azonnal) {
  var svg = $("odu-szoba").querySelector("svg"), mozgo = document.getElementById("odu-uni-mozgo"), emel = document.getElementById("odu-uni-emel");
  var flip = document.getElementById("odu-uni-flip"), alvo = document.getElementById("odu-uni-alvo");
  if (!svg || !mozgo || !emel || !alvo) return;
  _oduAgyIdo.forEach(clearTimeout); _oduAgyIdo = [];
  var f = oduAgyFekves(), nyugi = nyugiMod() || azonnal;
  ODU_FEKSZIK = true; ODU_UNI.x = f.x; ODU_UNI.dir = -1;   /* fejjel a párna (bal) felé */
  svg.classList.add("odu-fekszik");
  mozgo.style.transition = nyugi ? "none" : "transform .55s ease-out";
  mozgo.style.transform = "translate(" + (f.x - ODU_UNI_RAJZ) + "px,0px)";
  emel.style.transition = nyugi ? "none" : "transform .55s cubic-bezier(.3,1.7,.55,1)";   /* kis ív: felhuppan */
  emel.style.transform = "translate(0px," + (f.y - 492) + "px)";
  if (nyugi) flip.style.setProperty("--dir", -1); else uniFordul(flip, -1);
  alvo.classList.add("fekszik-all");
  function landol() { svg.classList.add("odu-agy-fekve", "odu-agy-terhelt"); }   /* a perem elé kerül, a matrac besüpped */
  if (nyugi) landol(); else { _oduAgyIdo.push(setTimeout(landol, 380)); hangCsilla(); }
  uniElalszik(alvo, azonnal);
}
/* nyujt = true: a szőnyegre érve nyújtózik és ásít, aztán hazasétál; kesz: utána (pl. a koppintott tárgy felé indul) */
function oduFelkel(nyujt, kesz) {
  _oduAgyIdo.forEach(clearTimeout); _oduAgyIdo = [];
  var svg = $("odu-szoba").querySelector("svg"), emel = document.getElementById("odu-uni-emel"), alvo = document.getElementById("odu-uni-alvo");
  ODU_FEKSZIK = false;
  if (!svg || !emel || !alvo) { if (kesz) kesz(); return; }
  var nyugi = nyugiMod();
  svg.classList.remove("odu-fekszik", "odu-agy-fekve", "odu-agy-terhelt");
  alvo.classList.remove("fekszik-all");
  uniFelebred(alvo);
  emel.style.transition = nyugi ? "none" : "transform .5s ease";   /* leugrik a szőnyegre */
  emel.style.transform = "translate(0px,0px)";
  hangGomb();
  _oduAgyIdo.push(setTimeout(function () {
    if (!oduAktiv() || ODU_FEKSZIK) return;
    if (nyujt) uniNyujtozik(alvo, function () { if (oduAktiv() && !ODU_FEKSZIK && !_oduSetaCel && !_oduTavozas) oduUniHaza(); });
    if (kesz) kesz();
  }, nyugi ? 0 : 520));
}

/* ── SZIVÁRVÁNYOS TÁVOZÁS az ösvényekre (unikornis pózok 6. lépés): az ablakból szivárványhíd nő le a felhőig,
   az unikornis odasétál, hátat fordít, és felszalad rajta az ablakba. Ugyanez a „← Térkép” gombra.
   Közben egy második koppintás (ablak vagy gomb) azonnal átvált. ── */
var ODU_HID = { x: 60, w0: 124, w1: 26, skala: [1, 0.15] };
ODU_HID.ut = szivarvanyGorbe([ODU_HID.x, 492], [34, 350], [104, 196], [186, 186], 40);
var _oduTavozas = null;
function oduTavozik() {
  if (_oduTavozas) { oduTavozasVege(); return; }   /* türelmetlen második koppintás */
  if (ODU_FEKSZIK) { oduFelkel(false, oduTavozik); return; }   /* a „← Térkép” gomb alvás közben: előbb felkel */
  hangGomb(); mondd("Térkép");
  var tok = _oduTavozas = { hid: false, ott: false };
  clearTimeout(_oduSetaIdo); _oduSetaCel = null;
  oduPanelZar();
  function indul() {
    if (_oduTavozas !== tok || !tok.hid || !tok.ott) return;
    uniSzivarvanyba({ mozgo: document.getElementById("odu-uni-mozgo"), el: document.getElementById("odu-uni-flip"),
      talp: [ODU_UNI_RAJZ, 492], ut: ODU_HID.ut, skala: ODU_HID.skala, szikra: document.getElementById("odu-hid-szikra") },
      function () { if (_oduTavozas === tok) oduTavozasVege(); });
  }
  hangCsilla();
  szivarvanyNo(document.getElementById("odu-hid"), ODU_HID.ut, ODU_HID.w0, ODU_HID.w1, function () { tok.hid = true; indul(); });
  oduUniSetal(ODU_HID.x, function () { tok.ott = true; indul(); });
}
function oduTavozasVege() {
  _oduTavozas = null;
  clearTimeout(_oduSetaIdo); _oduSetaCel = null;
  var k = $("kepernyo-odu");
  if (!k || !k.classList.contains("aktiv")) return;   /* közben máshová ment */
  visszaUgrik("odu");   /* a térképen az Odú mellett áll (ui.js) */
}

/* --- vezérlés --- */
function oduNyit(honnan) {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  oduPanelZar();
  clearTimeout(_oduSetaIdo); _oduSetaCel = null; _oduTavozas = null;
  ODU_SOTET = false;                        /* a villanyoltás nem mentődik: az odú mindig világosan nyílik */
  ODU_FEKSZIK = false; _oduAgyIdo.forEach(clearTimeout); _oduAgyIdo = [];   /* az alvás sem: ébren, a szőnyegen vár */
  ODU_UNI.x = ODU_UNI_HAZA; ODU_UNI.dir = 1;   /* a szőnyegen áll (az odú csak a térképről nyílik) */
  mutat("kepernyo-odu");                    /* előbb látható legyen, hogy a szoba-terület mérhető legyen */
  kertKulcsRendez();                        /* a kert ingyenes: a régi kulcs árát egyszer visszaadjuk (kert.js) */
  renderOdu();
  bemutat("szekreny");   /* egyszer: „Itt vannak a holmijaid…” (ui.js) */
}
/* a szoba-terület szélesség/magasság aránya (a rugalmas szobához); rejtett képernyőn becslés */
function oduTeruletArany() {
  var sz = $("odu-szoba"), cs = getComputedStyle(sz);
  var w = sz.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  var h = sz.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  if (w > 50 && h > 50) return w / h;
  var a = window.innerWidth / Math.max(200, window.innerHeight - 230);
  return a > 0.3 ? a : 16 / 9;               /* láthatatlan ablak (0 széles) → laptop-arány, hogy a tárgyak se tűnjenek el */
}
function renderOdu() {
  var o = P().odu;
  $("odu-csillampor").textContent = P().csillampor;
  var harmatEl = $("odu-harmat"); if (harmatEl) harmatEl.textContent = (P().tunderharmat || 0);   /* kitartás-valuta (7.2) */
  $("odu-szoba").innerHTML = "";            /* a régi rajz ne feszítse a mérést */
  $("odu-szoba").innerHTML = oduSVG(mentes.leny, o, false, oduTeruletArany());
  oduElet($("odu-szoba").querySelector("svg"), o);   /* élő szoba: fények, láng, füst, lepke… (odu-elet.js) */
  uniNezoAdat($("odu-uni-flip"), { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });   /* a fordulás szemből-képéhez */
  /* a szoba-SVG minden rajzoláskor újraépül → a koppintó réteget is újra bekötjük */
  Array.prototype.forEach.call(document.querySelectorAll("#odu-szoba .odu-cel"), function (h) {
    var cel = h.getAttribute("data-cel"), rajz = document.getElementById(ODU_CEL_RAJZ[cel]);
    h.addEventListener("mouseenter", function () { if (rajz) rajz.classList.add("fel"); });
    h.addEventListener("mouseleave", function () { if (rajz) rajz.classList.remove("fel"); });
    h.addEventListener("click", function () { oduTargyKoppint(cel); });
  });
  if (ODU_FEKSZIK) oduFekszik(true);         /* újrarajzolás (ablakméret) alvás közben: rögtön újra az ágyban alszik */
}
/* ablakméret-váltáskor (laptop-ablak átméretezés, tablet elforgatás) a szoba újra igazodik */
var _oduMeretIdo = null;
window.addEventListener("resize", function () {
  clearTimeout(_oduMeretIdo);
  _oduMeretIdo = setTimeout(function () {
    var k = $("kepernyo-odu");
    if (k && k.classList.contains("aktiv")) { if (_oduTavozas) oduTavozasVege(); else renderOdu(); }   /* távozás közben: azonnal át */
  }, 150);
});

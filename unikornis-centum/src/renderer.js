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
/* ── EGY SZÍNFORRÁS (unikornis pózok 1a, terv/pata-rajzterv.html) ──────────────
   Minden unikornis-szín EGY helyen: ebből készül az oldalrajz (UNI_SABLON), a szemből/
   hátulról nézet (unikornisNezetArt), a bolti sörényszín-lista „Alap” sora és az alap szemszín.
   ► Szín átírása = csak ITT. s = sörény/farok/tincs színhármasa (C1, C2, C3 = csillám),
   pata = a pata színhelye (később a körömlakk ide kerül), orr = az orrlyuk áttetszősége,
   szikra = a szarv körüli 3 kis csillag. */
var UNI_SZIN = {
  korall: { test: "#f2a877", has: "#f8c6a1", lab: "#f8c6a1", pata: "#f28a2e", s: ["#f2662b", "#d83b22", "#ffb43a"],
            szarv: "#f28a2e", szarvCs: "#c9531a", szem: "#3a2a20", orr: "0.45", szikra: ["#f2662b", "#d94fb0", "#ffb43a"] },
  kek:    { test: "#d7ebfb", has: "#ecf6fe", lab: "#ecf6fe", pata: "#6a6fd6", s: ["#29a3dd", "#7a3bc0", "#c98fe6"],
            szarv: "#6a6fd6", szarvCs: "#454bb0", szem: "#2ea8e0", orr: "0.45", szikra: ["#29a3dd", "#7a3bc0", "#b06be0"] },
  rozsa:  { test: "#fdf3f7", has: "#ffffff", lab: "#ffffff", pata: "#ffcf4d", s: ["#ffcf4d", "#e6a92e", "#ffe6a0"],
            szarv: "#ffcf4d", szarvCs: "#e0a52e", szem: "#e67ba6", orr: "0.4", szikra: ["#f4a6c6", "#f28ab8", "#ffd24d"] }
};
/* a far jele (oldalnézet): Tűz = virág, Csillámharmat = hópehely, Ragyogás = csillag */
var UNI_JEL = {
  korall: ' <g stroke="none"> <ellipse cx="120" cy="166" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="133" cy="174" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="128" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="112" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="107" cy="174" rx="6" ry="8" fill="#d63a3a"/> <circle cx="120" cy="178" r="4.5" fill="#ffd24d"/> </g> ',
  kek:    ' <g stroke="#2b7fd0" stroke-width="3" stroke-linecap="round"> <path d="M120 162 V190"/> <path d="M108 169 L132 183"/> <path d="M132 169 L108 183"/> <path d="M120 167 l-5 5 M120 167 l5 5"/> <path d="M120 185 l-5 -5 M120 185 l5 -5"/> </g> <circle cx="120" cy="176" r="3" fill="#7a3bc0" stroke="none"/> ',
  rozsa:  ' <path d="M120 162 l3 10 l10 4 l-10 4 l-3 10 l-3 -10 l-10 -4 l10 -4 Z" fill="#f4a6c6" stroke="none"/> <path d="M136 186 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#f28ab8" stroke="none"/> '
};
/* ── A 4 LÁB + PATA + ÍZÜLETEK (unikornis pózok 1a + 2a, terv/izuletek-rajzterv.html) ──
   láb = [bal-felső, jobb-felső, jobb-alsó, bal-alsó] a 380×300-as keretben; 0,1 = hátsó, 2,3 = elülső.
   Ebből készül a láb, a pata ÉS a lábdísz helye (labDiszSVG) — egy forrás.
   Egy láb két részből áll: a felső rész (comb / alkar) a csípőn/vállon fordul (.uni-comb), az alsó rész
   (lábszár + csüd + pata + LÁBDÍSZ) a csánkon/térden (.uni-terd). Az ízület-pont a láb közepe az IZ_Y
   magasságban; hajlításkor egy láb-színű ízület-gömb tölti ki a rést (álló pózban nem látszik).
   A dísz az alsó részben van → ülve, fekve, ugrás közben is a lábon marad.
   Minden ízület a saját pontja körül fordul: translate(pont) › forgó <g> › translate(-pont); a forgást
   a CSS adja a közös póz-táblából (UNI_POZ, lent). A külső <g class="uni-lab"> a séta lendítése. */
var UNI_LABAK = [[[102, 208], [121, 208], [114, 286], [92, 286]], [[135, 216], [154, 216], [152, 288], [130, 288]],
                 [[177, 216], [197, 216], [202, 288], [180, 288]], [[212, 208], [232, 208], [256, 286], [232, 286]]];
var PATA_MAG = 15;   /* a pata magassága; fölötte a csüd (ide kerül a bokapánt) */
var IZ_Y = [248, 252, 252, 248];   /* a csánk (hátsó) és a térd (elülső) magassága */
function uniK(n) { return +n.toFixed(1); }
function labSzel(L, y) {   /* a láb bal és jobb széle y magasságban */
  var t = (y - L[0][1]) / (L[3][1] - L[0][1]);
  return [L[0][0] + (L[3][0] - L[0][0]) * t, L[1][0] + (L[2][0] - L[1][0]) * t];
}
function labCsipo(i) { var L = UNI_LABAK[i]; return [(L[0][0] + L[1][0]) / 2, L[0][1]]; }
function labIzulet(i) { var k = labSzel(UNI_LABAK[i], IZ_Y[i]); return [(k[0] + k[1]) / 2, IZ_Y[i], (k[1] - k[0]) / 2, k]; }
function pataD(x1, x2, yt, yb) {   /* pata: kissé domború pártaszél fent, kiszélesedő talp lent */
  return "M" + uniK(x1) + " " + uniK(yt) + " Q" + uniK((x1 + x2) / 2) + " " + uniK(yt - 3) + " " + uniK(x2) + " " + uniK(yt) +
    " L" + uniK(x2 + 2.5) + " " + uniK(yb) + " Q" + uniK((x1 + x2) / 2) + " " + uniK(yb + 1.5) + " " + uniK(x1 - 2.5) + " " + uniK(yb) + " Z";
}
function izNyit(cls, p) {   /* ízület-keret nyitása; cls: egy vagy több (egymásba ágyazott) forgó csoport, "a b" */
  return '<g transform="translate(' + uniK(p[0]) + ' ' + uniK(p[1]) + ')">' + cls.split(" ").map(function (c) { return '<g class="' + c + '">'; }).join("") +
    '<g transform="translate(' + uniK(-p[0]) + ' ' + uniK(-p[1]) + ')">';
}
function izZar(cls) { return '</g>' + cls.split(" ").map(function () { return '</g>'; }).join("") + '</g>'; }
function izForgo(cls, p, belso) { return izNyit(cls, p) + belso + izZar(cls); }   /* egy ízület: a p pont körül forgó csoport */
/* ── FEJ, NYAK, FAROK, SZÁRNY ízülete (unikornis pózok 2b) ── a rajz ÉS a rajta lévő dísz ugyanabba a
   keretbe kerül (ugyanaz az osztály, ugyanaz a pont), így a dísz a testrésszel együtt mozdul:
   fej (a nyak tövénél) · nyak = sörény + nyakdísz (a fej szögének fele) · farok (a farok tövénél; benne a
   .uni-farok a lengés) · szárny (a vállnál). */
var UNI_TEST_IZ = {
  fej:   { pont: [252, 142], cls: "uni-fej" },
  nyak:  { pont: [252, 142], cls: "uni-nyak" },
  farok: { pont: [94, 152],  cls: "uni-farok-iz uni-farok" },
  szarny:{ pont: [178, 106], cls: "uni-szarny" }
};
function uniIzKeret(nev, belso) { var z = UNI_TEST_IZ[nev]; return izForgo(z.cls, z.pont, belso); }
function uniLabSVG(i, sz, labDisz) {
  var L = UNI_LABAK[i], yb = L[2][1], yt = yb - PATA_MAG, sz0 = labSzel(L, yt), fy = labSzel(L, yt + 3);
  var iz = labIzulet(i), k = iz[3], ky = iz[1];
  function P(x, y) { return uniK(x) + " " + uniK(y); }
  var felso = '<path d="M' + P(L[0][0], L[0][1]) + " L" + P(L[1][0], L[1][1]) + " L" + P(k[1], ky + 1) + " L" + P(k[0], ky + 1) + ' Z" fill="' + sz.lab + '" stroke="none"/>' +
              '<path d="M' + P(L[0][0], L[0][1]) + " L" + P(k[0], ky) + " M" + P(L[1][0], L[1][1]) + " L" + P(k[1], ky) + '" fill="none" stroke-width="4"/>';
  var also = '<path d="M' + P(k[0], ky) + " L" + P(k[1], ky) + " L" + P(L[2][0], L[2][1]) + " L" + P(L[3][0], L[3][1]) + ' Z" fill="' + sz.lab + '" stroke="none"/>' +
             '<path d="M' + P(k[0], ky) + " L" + P(L[3][0], L[3][1]) + " L" + P(L[2][0], L[2][1]) + " L" + P(k[1], ky) + '" fill="none" stroke-width="4"/>' +
             '<path class="uni-pata" d="' + pataD(sz0[0], sz0[1], yt, yb + 1) + '" fill="' + sz.pata + '" stroke-width="3.2"/>' +
             '<path d="M' + uniK(fy[1] - 4) + " " + uniK(yt + 4) + " L" + uniK(L[2][0] - 3) + " " + uniK(yb - 2) + '" fill="none" stroke="#fff" stroke-width="2.4" opacity=".55"/>' +
             (labDisz ? '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' + labDiszSVG(labDisz, L) + '</g>' : "");
  return '<g class="uni-lab uni-lab-' + (i % 2 ? "b" : "a") + ' uni-lab-' + (i < 2 ? "h" : "e") + '">' +
    izForgo("uni-comb", labCsipo(i),
      '<circle cx="' + uniK(iz[0]) + '" cy="' + ky + '" r="' + uniK(iz[2] - 1) + '" fill="' + sz.lab + '" stroke-width="4"/>' +
      izForgo("uni-terd", iz, also) + felso) +
    '</g>';
}
var UNI_SABLON = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> {farokBe}<g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="{s0}" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="{s1}" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="{s2}" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="{s2}" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="{s0}" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="{s1}" stroke-width="5"/> </g>{farokKi}{lab0} {lab1} {lab2} {lab3} <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="{test}" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="{has}" stroke="none"/> {nyakBe}<g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="{s0}" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="{s0}" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="{s0}" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="{s1}" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="{s1}" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="{s0}" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="{s1}" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="{s2}" stroke-width="4"/> </g>{nyakKi}{fejBe}<path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="{test}" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="{orr}" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="{szem}" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="uni-szem-csuk" display="none" fill="none" stroke="#222" stroke-linecap="round"> <path d="M290 111 Q301 121 314 110" stroke-width="2.6"/> <path d="M293 114.5 q-4 2 -6 6" stroke-width="2"/> <path d="M297 116.5 q-2 3 -3 7" stroke-width="2"/> <path d="M301.5 117 q0 3.5 0 7" stroke-width="2"/> <path d="M292 108 Q301 104 311 106" stroke-width="1.1" opacity="0.4"/> </g> <g class="uni-asit" opacity="0" stroke="#222" stroke-width="2.2"> <ellipse cx="322" cy="154" rx="8" ry="10" fill="#7a2f52"/> <ellipse cx="322" cy="159.5" rx="5" ry="3.6" fill="#f48fb1" stroke="none"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="{s0}" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="{s1}" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="{s2}" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="{test}" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="{szarv}" stroke-width="4"/> <path d="M270 84 L285 79" stroke="{szarvCs}" stroke-width="3"/> <path d="M275 68 L291 62" stroke="{szarvCs}" stroke-width="3"/> <path d="M281 50 L296 44" stroke="{szarvCs}" stroke-width="3"/> <path d="M287 36 L300 31" stroke="{szarvCs}" stroke-width="3"/>{fejKi}{jel}{fejBe}<g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="{k0}"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="{k1}"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="{k2}"/> </g>{fejKi} </g>';
function uniOldalArt(rajz, labDisz) {
  var sz = UNI_SZIN[rajz] || UNI_SZIN.korall;
  var ertek = { s0: sz.s[0], s1: sz.s[1], s2: sz.s[2], k0: sz.szikra[0], k1: sz.szikra[1], k2: sz.szikra[2], jel: UNI_JEL[rajz] || UNI_JEL.korall };
  for (var i = 0; i < 4; i++) ertek["lab" + i] = uniLabSVG(i, sz, labDisz);
  ["fej", "nyak", "farok"].forEach(function (n) { var z = UNI_TEST_IZ[n]; ertek[n + "Be"] = izNyit(z.cls, z.pont); ertek[n + "Ki"] = izZar(z.cls); });
  return UNI_SABLON.replace(/\{(\w+)\}/g, function (m, k) { return k in ertek ? ertek[k] : sz[k]; });
}
var UNI_RAJZ = { korall: uniOldalArt("korall"), kek: uniOldalArt("kek"), rozsa: uniOldalArt("rozsa") };
/* az oldalrajz a lábdísszel együtt (a dísz a láb alsó részében van); rajz+dísz szerint egyszer készül el */
var UNI_RAJZ_LAB = {};
function uniAlapArt(rajz, labDisz) {
  if (!UNI_SZIN[rajz]) rajz = "korall";
  if (!labDisz) return UNI_RAJZ[rajz];
  var k = rajz + "|" + labDisz;
  return UNI_RAJZ_LAB[k] || (UNI_RAJZ_LAB[k] = uniOldalArt(rajz, labDisz));
}
/* ── PÓZOK: EGY KÖZÖS TÁBLA (unikornis pózok 2a, terv/izuletek-rajzterv.html) ────────────────
   Minden helyszín (kert, felhőkert, odú, …) ugyanazt a pózt kapja: a táblából készül a CSS (uniPozCSS),
   a rajz ízületei (.uni-comb, .uni-terd, .uni-test) ezt követik. ► Új póz / mozdulat = egy új SOR itt.
   UNI_POZ: tartós póz. h / e = hátsó / elülső láb: [csípő°, csánk/térd°] (+ = óramutató iránya; a rajz
     jobbra néz, tehát + = a pata hátrafelé lendül). test = [dőlés°, dx, dy] az UNI_POZ_PONT körül, vagy
     "talaj": a test annyit ereszkedik, hogy a legalsó pata a földön maradjon (gépi számolás).
     fej / farok / szarny = a testrész szöge (°, + = óramutató iránya): fej + = az orr lefelé bólint,
     farok + = hátra-fölfelé lendül, szarny − = fölemelkedik. A nyak (sörény, nyakdísz) a fej szögének felét kapja.
     Kiváltja: .uni-poz-<név> VAGY a sor `osztaly` listája (a helyszínek meglévő osztályai).
   UNI_MOZDULAT: egyszeri mozdulat egy póz felé és vissza. kulcs = [[idő%, mérték 0..1], …], ido = mp.
     Kiváltja: .uni-mozd-<név> VAGY az `osztaly` lista. */
var UNI_POZ_PONT = [215, 288];   /* a test dőlés-pontja: az elülső paták a talajon */
var UNI_POZ = {
  ul:      { h: [-50, 120], e: [26, 0],    test: [-26, 0, 6], fej: 16, farok: 40, osztaly: [".ules-all"] },   /* A: „kutyás ülés”; a farok a földre simul */
  fekszik: { h: [-85, 165], e: [95, -175], test: [0, 0, 46], fej: 4,  farok: 34, osztaly: [".fekszik-all"] }, /* 8. lépés: a lábak a test alá, a has a matracon, a farok a test mellett */
  alszik:  { h: [-85, 165], e: [95, -175], test: [3, 0, 46], fej: 36, farok: 34, osztaly: [".uni-alszik"] },  /* alvás (uniElalszik): a fej a mellkasra hajlik */
  nyujt:   { h: [-26, 6],   e: [-90, 90],  test: [20, 0, 27], fej: -24, farok: -40 },   /* nyújtózás (felkeléskor): mellkas le, mellső lábak előre, far és farok fel, fej fel (ásít) */
  guggol:  { h: [50, -100], e: [-50, 100], test: "talaj",     fej: 8,  farok: -10, szarny: -14 },   /* elöl a térd előre, hátul a csánk hátra */
  hajol:   { h: [0, 0],     e: [-18, 36],  test: "talaj",     fej: 30, farok: -6 }    /* evés, szagolás: az elülső térd rogy, a fej lehajol */
};
var UNI_MOZDULAT = {
  ugras:   { poz: "guggol", ido: 1.1,  kulcs: [[0, 0], [14, 1], [26, 0], [50, .8], [62, 0], [74, .4], [100, 0]], osztaly: [".trukk-ugras", ".g-ugras"] },
  csillam: { poz: "guggol", ido: 1.8,  kulcs: [[0, 0], [15, .6], [30, 0], [100, 0]], osztaly: [".trukk-csillam", ".g-csillam"] },
  eszik:   { poz: "hajol",  ido: 1.65, kulcs: [[0, 0], [16, 1], [32, .8], [48, 1], [64, .8], [80, 1], [100, 0]], osztaly: [".kert-uni-doboz.eszik"] },   /* csám-csám: a fej bólogat */
  szagol:  { poz: "hajol",  ido: 1.3,  kulcs: [[0, 0], [20, .8], [45, .68], [65, .8], [100, 0]], osztaly: [".kert-uni-doboz.szagol"] },
  nyujt:   { poz: "nyujt",  ido: 1.8,  kulcs: [[0, 0], [30, 1], [75, 1], [100, 0]] }   /* + ásítás és hunyorgás (style.css .uni-mozd-nyujt) */
};
function uniForgat(q, a, c) {
  var r = a * Math.PI / 180, x = q[0] - c[0], y = q[1] - c[1];
  return [c[0] + x * Math.cos(r) - y * Math.sin(r), c[1] + x * Math.sin(r) + y * Math.cos(r)];
}
/* ennyit kell a testnek ereszkednie, hogy a hajlított lábak legalsó patája a földön maradjon */
function uniTalajDy(h, e) {
  var alap = 0, most = 0;
  for (var i = 0; i < 4; i++) {
    var L = UNI_LABAK[i], a = i < 2 ? h : e, c = labCsipo(i), iz = labIzulet(i);
    [L[2], L[3]].forEach(function (q) {
      alap = Math.max(alap, q[1]);
      most = Math.max(most, uniForgat(uniForgat(q, a[1], iz), a[0], c)[1]);
    });
  }
  return alap - most;
}
function uniPozAllas(nev, m) {   /* a póz m-szeres mértékben (0 = áll, 1 = teljes póz) */
  var pz = UNI_POZ[nev], h = [pz.h[0] * m, pz.h[1] * m], e = [pz.e[0] * m, pz.e[1] * m];
  var t = pz.test === "talaj" ? [0, 0, uniTalajDy(h, e)] : [pz.test[0] * m, pz.test[1] * m, pz.test[2] * m];
  var f = (pz.fej || 0) * m;
  return { hc: h[0], ht: h[1], ec: e[0], et: e[1], t: t, fe: f, ny: f / 2, fa: (pz.farok || 0) * m, sz: (pz.szarny || 0) * m };
}
var UNI_IZ_RESZ = { hc: " .uni-lab-h .uni-comb", ht: " .uni-lab-h .uni-terd", ec: " .uni-lab-e .uni-comb", et: " .uni-lab-e .uni-terd", t: " .uni-test",
                    fe: " .uni-fej", ny: " .uni-nyak", fa: " .uni-farok-iz", sz: " .uni-szarny" };
var UNI_IZ_CSOPORT = ".uni-comb,.uni-terd,.uni-test,.uni-fej,.uni-nyak,.uni-farok-iz,.uni-szarny";
function uniIzTr(all, r) {
  if (r === "t") return "rotate(" + uniK(all.t[0]) + "deg) translate(" + uniK(all.t[1]) + "px," + uniK(all.t[2]) + "px)";
  return "rotate(" + uniK(all[r]) + "deg)";
}
function uniPozCSS() {
  var css = UNI_IZ_CSOPORT + "{transform-box:view-box;transform-origin:0 0;transition:transform .45s ease}\n";
  function sel(alap, lista, r) { return [alap].concat(lista || []).map(function (x) { return x + UNI_IZ_RESZ[r]; }).join(","); }
  Object.keys(UNI_POZ).forEach(function (nev) {
    var all = uniPozAllas(nev, 1);
    Object.keys(UNI_IZ_RESZ).forEach(function (r) { css += sel(".uni-poz-" + nev, UNI_POZ[nev].osztaly, r) + "{transform:" + uniIzTr(all, r) + "}\n"; });
  });
  Object.keys(UNI_MOZDULAT).forEach(function (nev) {
    var md = UNI_MOZDULAT[nev];
    Object.keys(UNI_IZ_RESZ).forEach(function (r) {
      var an = "uni-m-" + nev + "-" + r;
      css += "@keyframes " + an + "{" + md.kulcs.map(function (k) { return k[0] + "%{transform:" + uniIzTr(uniPozAllas(md.poz, k[1]), r) + "}"; }).join("") + "}\n";
      css += sel(".uni-mozd-" + nev, md.osztaly, r) + "{animation:" + an + " " + md.ido + "s ease-in-out 1}\n";
    });
  });
  return css + "@media (prefers-reduced-motion:reduce){" + UNI_IZ_CSOPORT + "{transition:none!important;animation:none!important}}\n";
}
/* ── JÁRÁS: EGY KÖZÖS TÁBLA (unikornis pózok 3. lépés, terv/jaras-rajzterv.html) ──────────────
   Minden helyszín (kert, felhőkert, odú, később a pályák) ugyanígy jár: uniUt(elem, távolság px) megmondja,
   sétáljon vagy ügessen, milyen tempóval és mennyi ideig; uniJar(elem, út) indítja, uniAll(elem) leállítja.
   UNI_JARAS: mozgásmódonként egy sor. ► Új mozgásmód (pl. repülés) = egy új SOR itt.
     ido    = egy teljes lépésciklus (mp), amíg mind a 4 láb egyszer lép
     talaj  = a ciklus mekkora részében van a pata a földön (séta > fél, ügetés < fél)
     lend   = a láb lendülete a csípőn/vállon (°): ennyit előre, ennyit hátra
     hajlit = a csánk (h) és a térd (e) behajlása, amikor a láb a levegőben van (°)
     fazis  = a 4 láb ütemeltolása [hátsó-1, hátsó-2, elülső-1, elülső-2]; séta: 4 külön ütem,
              ügetés: az átlós lábpárok együtt
     fej    = [alapszög, bólintás, bólintás/ciklus]; nyak = fej fele (ahogy a pózoknál)
     farok  = [alapszög, lengés, lengés/ciklus]
   A test emelkedése és billenése NINCS a táblában: gép számolja ki úgy, hogy a földön lévő paták mindig
   pontosan a talajon legyenek (nem süllyednek bele, nem lebegnek) — mint a pózoknál a test:"talaj".
   A haladás sebessége is a lábból jön (uniJarasSebesseg): a pata nem csúszik a földön.
   Kiváltó: .uni-jar-seta / .uni-jar-uget egy ős-elemen, a --jar-tempo CSS-változó szaporítja a lépést. */
var UNI_JARAS = {
  seta: { ido: .7,  talaj: .62, lend: 26, hajlit: { h: -42, e: 72 }, fazis: [0, .5, .25, .75], fej: [3, 3.5, 2], farok: [2, 5, 1] },
  uget: { ido: .42, talaj: .42, lend: 28, hajlit: { h: -58, e: 92 }, fazis: [0, .5, .5, 0],    fej: [1, 2, 2],   farok: [-12, 4, 2] }
};
var UNI_JARAS_LEPES = 40;   /* ennyi kockára bontjuk a ciklust a CSS-ben */
/* ismétlődő görbe: [[hely 0..1, érték, "lin"?], …]; két pont között lágy (koszinusz) átmenet, "lin" = egyenletes */
function jarGorbe(pontok, p) {
  for (var i = 0; i < pontok.length - 1; i++) {
    var a = pontok[i], b = pontok[i + 1];
    if (p >= a[0] && p <= b[0]) {
      var t = (p - a[0]) / ((b[0] - a[0]) || 1);
      if (!a[2]) t = (1 - Math.cos(Math.PI * t)) / 2;
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return pontok[0][1];
}
/* egy láb szögei a ciklus p pontján (p = 0: a pata elöl leér) → [csípő°, csánk/térd°] */
function uniLabFazis(md, hatso, p) {
  var S = md.talaj, A = md.lend, F = md.hajlit[hatso ? "h" : "e"], w = 1 - S;
  /* a földön: egyenletesen hátrafelé (a test halad el fölötte) · a levegőben: behajlik, előrelendül, kinyúl */
  var comb = jarGorbe([[0, -A, "lin"], [S, A], [S + w * .3, A * .6], [S + w * .82, -A * 1.1], [1, -A]], p);
  var terd = jarGorbe([[0, 0], [S * .7, hatso ? -2 : 2], [S, hatso ? -8 : 10], [S + w * .42, F], [S + w * .8, F * .12], [1, 0]], p);
  return [comb, terd];
}
/* a pata talpának 3 pontja (a pataD rajzából: a kiszélesedő két sarok + a domború közép) */
function uniPataTalp(i) {
  var L = UNI_LABAK[i], yb = L[2][1], sz = labSzel(L, yb - PATA_MAG);
  return [[sz[0] - 2.5, yb + 1], [(sz[0] + sz[1]) / 2, yb + 1.8], [sz[1] + 2.5, yb + 1]];
}
/* a test: annyit ereszkedik/billen, hogy hátul és elöl is a legalsó pata a földön legyen */
var UNI_JARAS_BILLEN = 3;   /* a test legfeljebb ennyi fokot billen előre-hátra */
function uniJarasTest(szogek, foldon) {
  var P = UNI_POZ_PONT, talp = [], tam = { h: null, e: null };
  for (var i = 0; i < 4; i++) {
    var c = labCsipo(i), iz = labIzulet(i), a = szogek[i];
    uniPataTalp(i).forEach(function (q) {
      var u = uniForgat(uniForgat(q, a[1], iz), a[0], c), cs = i < 2 ? "h" : "e";
      talp.push([u[0], u[1], q[1]]);   /* [x, y most, y állva = a láb saját talajvonala] */
      if (foldon[i] && (!tam[cs] || u[1] - q[1] > tam[cs][1])) tam[cs] = [u[0], u[1] - q[1]];
    });
  }
  /* 1. billenés: a földön lévő hátsó és elülső pata emelkedéséből (csak ha mindkét felén van földön lévő láb) */
  var th = 0;
  if (tam.h && tam.e) th = Math.max(-UNI_JARAS_BILLEN, Math.min(UNI_JARAS_BILLEN, (-tam.e[1] + tam.h[1]) / (tam.e[0] - tam.h[0]) * 180 / Math.PI));
  /* 2. ereszkedés: a legmélyebb pata (bármelyik lábé) pontosan a talajra kerüljön — semmi sem süllyed bele */
  var r = th * Math.PI / 180, mely = -1e9;
  talp.forEach(function (t) { mely = Math.max(mely, P[1] + (t[0] - P[0]) * Math.sin(r) + (t[1] - P[1]) * Math.cos(r) - t[2]); });
  return [th, 0, -mely / Math.cos(r)];
}
function uniJarasAllas(md, p) {   /* a ciklus p pontján minden ízület szöge, a uniPozAllas formájában */
  var fz = [0, 1, 2, 3].map(function (i) { return (p + 1 - md.fazis[i]) % 1; });
  var sz = fz.map(function (q, i) { return uniLabFazis(md, i < 2, q); });
  var f = md.fej[0] + md.fej[1] * Math.cos(2 * Math.PI * md.fej[2] * p);
  return { lab: sz, t: uniJarasTest(sz, fz.map(function (q) { return q <= md.talaj; })), fe: f, ny: f / 2,
           fa: md.farok[0] + md.farok[1] * Math.sin(2 * Math.PI * md.farok[2] * p) };
}
var UNI_JARAS_LAB = [".uni-lab-h.uni-lab-a", ".uni-lab-h.uni-lab-b", ".uni-lab-e.uni-lab-a", ".uni-lab-e.uni-lab-b"];
function uniJarasCSS() {
  var css = ".uni-jar-seta .uni-elo,.uni-jar-uget .uni-elo{animation:none!important}\n" +   /* séta közben nem lebeg: a pata a földön */
            ".uni-magas{transform:translateY(calc(var(--uni-magas, 0) * -1px))}\n";   /* magasság: ma mindig 0 */
  Object.keys(UNI_JARAS).forEach(function (nev) {
    var md = UNI_JARAS[nev], kocka = [], k;
    for (k = 0; k <= UNI_JARAS_LEPES; k++) kocka.push(uniJarasAllas(md, k / UNI_JARAS_LEPES));
    function anim(resz, sel, fv) {
      var an = "uni-j-" + nev + "-" + resz;
      css += "@keyframes " + an + "{" + kocka.map(function (a, k) { return uniK(k * 100 / UNI_JARAS_LEPES) + "%{transform:" + fv(a) + "}"; }).join("") + "}\n";
      css += ".uni-jar-" + nev + " " + sel + "{animation:" + an + " calc(" + md.ido + "s / var(--jar-tempo, 1)) linear var(--jar-kezd, 0s) infinite}\n";   /* --jar-kezd: sima indulás (uniJar) */
    }
    UNI_JARAS_LAB.forEach(function (lab, i) {
      anim("c" + i, lab + " .uni-comb", function (a) { return "rotate(" + uniK(a.lab[i][0]) + "deg)"; });
      anim("t" + i, lab + " .uni-terd", function (a) { return "rotate(" + uniK(a.lab[i][1]) + "deg)"; });
    });
    anim("test", ".uni-test", function (a) { return uniIzTr(a, "t"); });
    anim("fej", ".uni-fej", function (a) { return "rotate(" + uniK(a.fe) + "deg)"; });
    anim("nyak", ".uni-nyak", function (a) { return "rotate(" + uniK(a.ny) + "deg)"; });
    anim("farok", ".uni-farok-iz", function (a) { return "rotate(" + uniK(a.fa) + "deg)"; });
  });
  return css;
}
/* a pata földön töltött ideje alatt a test ennyit halad (rajz-egység / mp) → ennél gyorsabban csúszna a pata */
function uniJarasSebesseg(nev) {
  var md = UNI_JARAS[nev], i = 3, L = UNI_LABAK[i], c = labCsipo(i), iz = labIzulet(i);
  var x0 = uniForgat(uniForgat(L[2], uniLabFazis(md, false, 0)[1], iz), uniLabFazis(md, false, 0)[0], c)[0];
  var x1 = uniForgat(uniForgat(L[2], uniLabFazis(md, false, md.talaj)[1], iz), uniLabFazis(md, false, md.talaj)[0], c)[0];
  return Math.abs(x0 - x1) / (md.talaj * md.ido);
}
/* ── a közös út-tervező: mennyi ideig, milyen mozgással (terv: tempó-szabály) ── */
var UNI_TESTHOSSZ = 270;      /* rajz-egység: a farok tövétől az orrig */
var UNI_SETA_HATAR = 1.5;     /* ennyi testhosszig sétál, fölötte üget */
var UNI_UT_MAX = 3.4;         /* mp: ennél tovább nem tart egy út … */
var UNI_TEMPO_MAX = 1.4;      /* … amíg a láb legfeljebb ennyiszer szaporábban lép (fölötte már hosszabb lesz) */
function uniPxEgyseg(el) {   /* hány képernyő-képpont egy rajz-egység (a valódi, kirajzolt méretből) */
  var g = el && el.querySelector && el.querySelector(".uni-elo"), m = g && g.getScreenCTM && g.getScreenCTM();
  var px = m ? Math.sqrt(m.a * m.a + m.b * m.b) : 0;
  return px > 0.01 ? px : 0.475;   /* nincs még kirajzolva → a kerti méret */
}
function uniUt(el, tavPx) {
  var px = uniPxEgyseg(el), mod = tavPx / px <= UNI_SETA_HATAR * UNI_TESTHOSSZ ? "seta" : "uget";
  var v = uniJarasSebesseg(mod) * px, mp = tavPx / v, tempo = 1;
  if (mod === "uget" && mp > UNI_UT_MAX) { tempo = Math.min(UNI_TEMPO_MAX, mp / UNI_UT_MAX); mp /= tempo; }
  return { mod: mod, tempo: tempo, mp: Math.max(0.2, mp) };
}
/* INDULÁS: a lépésciklus abból a pillanatából indul, ahol a lábak a legközelebb vannak az álló helyzethez
   (gép keresi ki, mozgásmódonként egyszer) → nincs rándulás (4. lépés). */
var UNI_JARAS_INDUL = {};
function uniJarasIndul(nev) {
  if (UNI_JARAS_INDUL[nev] != null) return UNI_JARAS_INDUL[nev];
  var md = UNI_JARAS[nev], legjobb = 0, min = 1e9;
  for (var k = 0; k < UNI_JARAS_LEPES; k++) {
    var a = uniJarasAllas(md, k / UNI_JARAS_LEPES), s = 0;
    a.lab.forEach(function (l) { s += l[0] * l[0] + l[1] * l[1]; });
    s += a.t[0] * a.t[0] * 40 + a.t[2] * a.t[2] * 4 + a.fe * a.fe;
    if (s < min) { min = s; legjobb = k / UNI_JARAS_LEPES; }
  }
  return (UNI_JARAS_INDUL[nev] = legjobb);
}
function uniJarFut(el) { return !!el && (el.classList.contains("uni-jar-seta") || el.classList.contains("uni-jar-uget")); }
function uniJar(el, ut) {
  if (!el) return;
  el.classList.remove("uni-jar-seta", "uni-jar-uget");
  el.style.setProperty("--jar-tempo", ut.tempo.toFixed(2));
  el.style.setProperty("--jar-kezd", (-uniJarasIndul(ut.mod) * UNI_JARAS[ut.mod].ido / ut.tempo).toFixed(3) + "s");
  el.classList.add("uni-jar-" + ut.mod);
}
/* ── ALVÁS (unikornis pózok 8. lépés, terv/fekves-rajzterv.html) — minden helyszínen ugyanez ─────
   A fekvő pózt (UNI_POZ.fekszik) a helyszín adja (pl. kert: .fekszik-all), az elalvást ez:
   1. álmos pislogás (.uni-almos, a szemhéj kétszer lecsukódik), 2. alszik (.uni-alszik = UNI_POZ.alszik:
   a fej lassan a mellkasra hajlik, csukott szem, lassú lélegzés), 3. Zzz a fej fölött.
   el = a figura doboza (position: absolute/relative; a --dir iránya szerint a fej fölé kerül a Zzz).
   UNI_ALVAS: mikor (ms a befekvéstől) jön az álmosság, az alvás és a Zzz. Felkeléskor: uniNyujtozik (nyújtózás + ásítás). */
var UNI_ALVAS = { almos: 700, alszik: 2300, zzz: 3300, leleg: 4200, kifuj: 1900 };   /* leleg = egy lélegzet (= .uni-alszik .uni-elo animáció), kifuj = a kifújás kezdete benne */
function uniZzzSVG() {   /* egy lekerekített „Z” (lila, fehér szegéllyel) */
  return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5 H16 L5 15.5 H16.5" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M4 4.5 H16 L5 15.5 H16.5" fill="none" stroke="#8a55d0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function uniElalszik(el) {
  if (!el) return;
  uniFelebred(el);
  if (nyugiMod()) { el.classList.add("uni-alszik"); uniZzz(el, true); return; }
  el._alvas = [
    setTimeout(function () { el.classList.add("uni-almos"); }, UNI_ALVAS.almos),
    setTimeout(function () {
      el.classList.remove("uni-almos"); el.classList.add("uni-alszik");
      /* halk szuszogás minden kifújásnál, a lélegzéssel egy ütemben (audio.js) */
      el._alvas.push(setTimeout(function () {
        hangSzuszog();
        el._szusz = setInterval(function () { if (!el.isConnected) { uniFelebred(el); return; } hangSzuszog(); }, UNI_ALVAS.leleg);
      }, UNI_ALVAS.kifuj));
    }, UNI_ALVAS.alszik),
    setTimeout(function () { uniZzz(el, true); }, UNI_ALVAS.zzz)
  ];
}
function uniFelebred(el) {
  if (!el) return;
  (el._alvas || []).forEach(clearTimeout); el._alvas = null;
  clearInterval(el._szusz); el._szusz = null;
  el.classList.remove("uni-almos", "uni-alszik");
  uniZzz(el, false);
}
/* NYÚJTÓZÁS: felkelés után egyszer (UNI_MOZDULAT.nyujt + ásítás); kesz a végén */
function uniNyujtozik(el, kesz) {
  if (!el || nyugiMod()) { if (kesz) kesz(); return; }
  el.classList.remove("uni-mozd-nyujt"); void el.getBoundingClientRect();
  el.classList.add("uni-mozd-nyujt");
  clearTimeout(el._nyujtT);
  el._nyujtT = setTimeout(function () { el.classList.remove("uni-mozd-nyujt"); if (kesz) kesz(); }, UNI_MOZDULAT.nyujt.ido * 1000 + 50);
}
function uniZzz(el, be) {
  var z = el.querySelector(":scope > .uni-zzz");
  if (!be) { if (z) z.parentNode.removeChild(z); return; }
  if (z) return;
  z = document.createElement("div");
  z.className = "uni-zzz"; z.setAttribute("aria-hidden", "true");
  z.innerHTML = "<i>" + uniZzzSVG() + "</i><i>" + uniZzzSVG() + "</i><i>" + uniZzzSVG() + "</i>";
  el.appendChild(z);
}
/* MEGÁLLÁS: a láb, a test, a fej és a farok UNI_FORDUL.simit mp alatt simul vissza (a járó helyzetet
   pillanatképként rögzítjük, aztán elengedjük → a CSS-átmenet viszi a póz/álló helyzetbe) */
function uniAll(el) {
  if (!uniJarFut(el)) return;
  var reszek = (typeof getComputedStyle === "function" && !nyugiMod()) ? el.querySelectorAll(UNI_IZ_CSOPORT) : [], most = [], i;
  for (i = 0; i < reszek.length; i++) most.push(getComputedStyle(reszek[i]).transform);
  for (i = 0; i < reszek.length; i++) { reszek[i].style.transition = "none"; reszek[i].style.transform = most[i]; }
  el.classList.remove("uni-jar-seta", "uni-jar-uget");
  if (!reszek.length) return;
  void el.getBoundingClientRect();
  for (i = 0; i < reszek.length; i++) { reszek[i].style.transition = "transform " + UNI_FORDUL.simit + "s ease-out"; reszek[i].style.transform = ""; }
  clearTimeout(el._simitTimer);
  el._simitTimer = setTimeout(function () { for (var j = 0; j < reszek.length; j++) reszek[j].style.transition = ""; }, UNI_FORDUL.simit * 1000 + 50);
}

/* ── FORDULÁS ÉS PÖRGÉS: EGY KÖZÖS KÓD (unikornis pózok 4. lépés, terv/fordulas-rajzterv.html) ──────
   Unikornis-elem (el) = amelyiken a --dir ül (1 jobbra, -1 balra), és amelyikben a unikornisSVG() rajza van
   (kert: a doboz, felhőkert: a .tk-uni, odú: #odu-uni-flip). A köztes nézet (szemből/hátulról) RÁKERÜL az
   oldalrajzra (azt csak elrejti), így a póz, a lebegés és a rajz nem épül újra. A nézet-képhez kell a lény
   adata: uniNezoAdat(el, {rajz, kinezet, oltozet}) — minden rajzoláskor. */
var UNI_FORDUL = {
  ido: .34,      /* mp: ennyi ideig látszik a köztes nézet fordulás közben */
  nezet: "elol", /* felénk fordul — producer döntése (2026-10-04) */
  porges: [0, 6, 0, 10, 0, 6, 0, 10],   /* pörgés: nézetenként a kis ugrás (rajz-egység, a .uni-magas réteggel) */
  simit: .22     /* mp: megálláskor ennyi idő alatt simulnak a lábak álló helyzetbe */
};
var _uniNezoSzam = 0;
function uniNezoAdat(el, adat) { if (el) { el._uniNezo = adat; el._uniNezoPfx = "nz" + (++_uniNezoSzam); } }
function uniIrany(el) { return el && +el.style.getPropertyValue("--dir") < 0 ? -1 : 1; }
/* a köztes nézet (elol/hatul) rárakása az oldalrajzra; null → vissza az oldalrajzra */
function uniNezetMutat(el, nezet) {
  var reteg = el.querySelector(".uni-nezet-reteg");
  if (reteg) reteg.parentNode.removeChild(reteg);
  el.classList.toggle("uni-nezetben", !!nezet);
  var magas = el.querySelector(".uni-magas"), a = el._uniNezo || {};
  if (!nezet || !magas) return;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "uni-magas uni-nezet-reteg");
  g.innerHTML = '<g class="uni-elo">' + unikornisNezetArt(nezet, a.rajz || "korall", a.kinezet || null, el._uniNezoPfx, a.oltozet || null) + '</g>';
  magas.parentNode.appendChild(g);
}
/* FORDULÁS: oldalról → szemből → a másik oldalra. Visszaadja, hány ms múlva áll az új irányba
   (0 = nem kellett fordulnia); kesz() akkor fut. */
function uniFordul(el, dir, kesz) {
  if (!el) { if (kesz) kesz(); return 0; }
  dir = dir < 0 ? -1 : 1;
  clearTimeout(el._fordulTimer);
  if (el.classList.contains("uni-nezetben")) uniNezetMutat(el, null);
  if (uniIrany(el) === dir || nyugiMod()) { el.style.setProperty("--dir", dir); if (kesz) kesz(); return 0; }
  uniAll(el);
  uniNezetMutat(el, UNI_FORDUL.nezet);
  el.style.setProperty("--dir", dir);   /* a köztes nézet takarásában tükrözünk: nem látszik */
  el._fordulTimer = setTimeout(function () { uniNezetMutat(el, null); if (kesz) kesz(); }, UNI_FORDUL.ido * 1000);
  return UNI_FORDUL.ido * 1000;
}
/* PÖRGÉS: kétszer körbe (oldal → szemből → másik oldal → hátulról), minden nézetben kis ugrás,
   szikrákkal (HTML-elemen). Ugyanez a kertben és a felhőkertben (a többiek unikornisán is). */
function uniPorog(el, ms, kesz) {
  if (!el) { if (kesz) kesz(); return; }
  var d0 = uniIrany(el), kockak = UNI_FORDUL.porges, i = 0, km = ms / kockak.length;
  clearTimeout(el._fordulTimer);
  uniAll(el);
  if (nyugiMod()) { el._fordulTimer = setTimeout(function () { if (kesz) kesz(); }, ms); return; }
  el.classList.add("uni-porog");
  (function kocka() {
    if (i >= kockak.length) {
      uniNezetMutat(el, null); el.style.setProperty("--dir", d0);
      el.style.removeProperty("--uni-magas"); el.classList.remove("uni-porog");
      if (kesz) kesz(); return;
    }
    var f = i % 4;   /* 0: oldal, 1: szemből, 2: a másik oldal, 3: hátulról */
    uniNezetMutat(el, f === 1 ? "elol" : f === 3 ? "hatul" : null);
    el.style.setProperty("--dir", f === 2 ? -d0 : d0);
    el.style.setProperty("--uni-magas", kockak[i]);
    if (el instanceof HTMLElement) {
      var sp = document.createElement("span");
      sp.className = "forgato-szikra";
      sp.textContent = ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)];
      sp.style.left = (30 + Math.random() * 40) + "%"; sp.style.top = (20 + Math.random() * 50) + "%";
      el.appendChild(sp);
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 650);
    }
    i++;
    el._fordulTimer = setTimeout(kocka, km);
  })();
}
/* ── SZIVÁRVÁNYOS TÁVOZÁS: EGY KÖZÖS KÓD (unikornis pózok 6. lépés, terv/szivarvany-tavozas-rajzterv.html) ──
   A szivárvány egy pontsor (a híd közepe) mentén húzott 5 színsáv; a szélessége az elejétől a végéig szűkül
   (w0 → w1: a híd a távolba fut). Odúban az ablakból nő le a padlóig, az utcán a Matek-kapuból az odú-ház ajtajáig.
   Az unikornis hátat fordít, és szökdelve végigfut rajta; közben összemegy, a végén szikrázva eltűnik. */
var SZIVARVANY_SZIN = ["#e0417a", "#f0a800", "#3f9e6a", "#29a3dd", "#8a4fd0"];   /* az utcai Matek-kapu színei */
var UNI_SZIVARVANY = {
  no: 0.8,       /* mp: ennyi alatt nő ki a híd */
  guggol: 0.22,  /* mp: lendületvétel */
  fut: 1.35,     /* mp: a futás a hídon */
  szokken: 12,   /* rajz-egység: a szökdelés magassága (a .uni-magas réteggel) */
  szokkenDb: 4,  /* ennyit szökken a hídon */
  eltunik: 0.25  /* a futás utolsó ennyiad részében halványul el */
};
/* köbös Bézier-görbe pontsorrá (n szakasz) */
function szivarvanyGorbe(a, b, c, d, n) {
  var p = [];
  for (var i = 0; i <= n; i++) {
    var t = i / n, u = 1 - t;
    p.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
            u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
  }
  return p;
}
/* a pontsor t-edik helye (0..1, a hossz arányában) */
function szivarvanyPont(p, t) {
  var L = [0];
  for (var i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  var s = Math.max(0, Math.min(1, t)) * L[L.length - 1], k = 1;
  while (k < p.length - 1 && L[k] < s) k++;
  var r = L[k] > L[k - 1] ? (s - L[k - 1]) / (L[k] - L[k - 1]) : 1;
  return [p[k - 1][0] + (p[k][0] - p[k - 1][0]) * r, p[k - 1][1] + (p[k][1] - p[k - 1][1]) * r];
}
/* a híd rajza a pontsor [t0..t1] szakaszán: fehér dereng + 5 színsáv, mindegyik egy kitöltött szalag */
function szivarvanySVG(p, w0, w1, t0, t1) {
  t0 = t0 || 0; t1 = t1 === undefined ? 1 : t1;
  var n = p.length - 1, sor = [], ts = [t0];
  for (var i = Math.floor(t0 * n) + 1; i < t1 * n; i++) ts.push(i / n);
  ts.push(t1);
  ts.forEach(function (t) {
    var q = szivarvanyPont(p, t), a = szivarvanyPont(p, t - 0.02), b = szivarvanyPont(p, t + 0.02);
    var dx = b[0] - a[0], dy = b[1] - a[1], h = Math.hypot(dx, dy) || 1;
    sor.push({ x: q[0], y: q[1], nx: -dy / h, ny: dx / h, w: w0 + (w1 - w0) * t });
  });
  if (sor.length < 2 || t1 - t0 < 0.002) return "";
  function szalag(f0, f1) {   /* a szélesség f0..f1 része (−0,5..0,5) */
    var bal = [], jobb = [];
    sor.forEach(function (o) {
      bal.push((o.x + o.nx * o.w * f0).toFixed(1) + "," + (o.y + o.ny * o.w * f0).toFixed(1));
      jobb.unshift((o.x + o.nx * o.w * f1).toFixed(1) + "," + (o.y + o.ny * o.w * f1).toFixed(1));
    });
    return "M" + bal.join(" L") + " L" + jobb.join(" L") + " Z";
  }
  var s = '<path d="' + szalag(-0.64, 0.64) + '" fill="#ffffff" opacity="0.4"/>';
  for (var k = 0; k < 5; k++) s += '<path d="' + szalag(-0.5 + k * 0.2, -0.29 + k * 0.2) + '" fill="' + SZIVARVANY_SZIN[k] + '"/>';
  return s;
}
/* a híd kinövése: g-be rajzol, a pontsor VÉGÉRŐL indulva (ablak / kapu) az eleje felé (padló / ajtó) */
function szivarvanyNo(g, p, w0, w1, kesz) {
  if (!g) { if (kesz) kesz(); return; }
  if (nyugiMod() || window.__UC_GYORS) { g.innerHTML = szivarvanySVG(p, w0, w1); if (kesz) kesz(); return; }
  var t0 = performance.now(), ms = UNI_SZIVARVANY.no * 1000;
  requestAnimationFrame(function lep(most) {
    if (!g.isConnected) return;
    var t = Math.min(1, (most - t0) / ms), e = 1 - (1 - t) * (1 - t);
    g.innerHTML = szivarvanySVG(p, w0, w1, 1 - e, 1);
    if (t < 1) requestAnimationFrame(lep); else if (kesz) kesz();
  });
}
/* AZ UNIKORNIS A HÍDON: o = { mozgo: a csoport, amit tolunk-kicsinyítünk (CSS transform),
   el: a --dir/nézet eleme, talp: [x,y] a talp helye a mozgo saját rajzában (eltolás nélkül),
   ut: a híd pontsora (az unikornis talpa ezen fut végig), skala: [eleje, vége], szikra: g a végső csillagoknak } */
function uniSzivarvanyba(o, kesz) {
  var m = o.mozgo, el = o.el, U = UNI_SZIVARVANY, sk = o.skala || [1, 0.2];
  function hely(t, s) {
    var q = szivarvanyPont(o.ut, t);
    m.style.transition = "none";
    m.style.transform = "translate(" + (q[0] - o.talp[0] * s).toFixed(2) + "px," + (q[1] - o.talp[1] * s).toFixed(2) + "px) scale(" + s.toFixed(4) + ")";
  }
  function vege() {
    if (el) { uniNezetMutat(el, null); el.style.removeProperty("--uni-magas"); }
    if (kesz) kesz();
  }
  if (!m || !m.isConnected) { if (kesz) kesz(); return; }
  if (el) { uniAll(el); clearTimeout(el._fordulTimer); }
  if (nyugiMod() || window.__UC_GYORS) {   /* nyugodt mód: csak elhalványul */
    m.style.transition = "opacity .4s"; m.style.opacity = "0";
    setTimeout(vege, window.__UC_GYORS ? 0 : 420); return;
  }
  if (el) uniNezetMutat(el, "hatul");   /* hátat fordít: a híd a távolba fut */
  hely(0, sk[0]);
  if (el) el.style.setProperty("--uni-magas", -3);   /* guggol: lendületet vesz */
  setTimeout(function () {
    if (!m.isConnected) return;
    hangAllomas();
    var t0 = performance.now(), ms = U.fut * 1000;
    requestAnimationFrame(function lep(most) {
      if (!m.isConnected) return;
      var t = Math.min(1, (most - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      hely(e, sk[0] + (sk[1] - sk[0]) * e);
      if (el) el.style.setProperty("--uni-magas", (Math.abs(Math.sin(t * Math.PI * U.szokkenDb)) * U.szokken * (1 - 0.5 * t)).toFixed(1));
      m.style.opacity = t > 1 - U.eltunik ? ((1 - t) / U.eltunik).toFixed(3) : "1";
      if (t < 1) { requestAnimationFrame(lep); return; }
      if (o.szikra) szivarvanySzikra(o.szikra, o.ut[o.ut.length - 1]);
      hangCsilla();
      setTimeout(vege, 380);
    });
  }, U.guggol * 1000);
}
/* a végén: csillagok pattannak szét a szivárvány végénél */
function szivarvanySzikra(g, q) {
  var s = "";
  for (var i = 0; i < 7; i++) {
    var a = i / 7 * Math.PI * 2, r = 16 + (i % 3) * 8;
    s += '<g class="szivarvany-szikra" style="--sx:' + (Math.cos(a) * r).toFixed(1) + 'px;--sy:' + (Math.sin(a) * r).toFixed(1) + 'px;animation-delay:' + (i % 3) * 0.05 + 's">' +
         csillagSVG(q[0], q[1], 3 + (i % 3), i % 2 ? "#ffffff" : "#ffd24d") + '</g>';
  }
  g.innerHTML = s;
}
function uniForduloCSS() {
  return ".uni-nezetben .uni-magas:not(.uni-nezet-reteg){visibility:hidden}\n" +
         ".uni-porog .uni-magas{transition:transform .08s ease-out}\n" +
         ".uni-porog .uni-arnyek{display:inline}\n";
}
(function uniPozStilus() {   /* egyszer, betöltéskor: a táblából készült CSS a lap végére */
  if (typeof document === "undefined" || document.getElementById("uni-poz-css")) return;
  var st = document.createElement("style"); st.id = "uni-poz-css"; st.textContent = uniPozCSS() + uniJarasCSS() + uniForduloCSS();
  (document.head || document.documentElement).appendChild(st);
})();

/* A közös felület: a hívók unikornisSVG(id, c, meret, oltozet)-et kérnek.
   Az `oltozet` (opcionális) a felvett ruhák: { fej, nyak, hat, lab, oldal, farok }.
   A ruhák a kész rajz saját (380×300) koordinátájában rajzolódnak. */
/* v4 „Kinézet": a sörény/farok színhármasa + a szemszín, bőrönként (spec-odu-v4-kinezet.html).
   Az 1. mindig a jelenlegi alap. A hossz-változatok KÉSŐBB jönnek (most csak szín + szem). */
var SORENY_SZIN = {
  kek:    [{ nev: "Alap", c: UNI_SZIN.kek.s }, { nev: "Jégkék", c: ["#4ec3e0", "#3f6fd0", "#a7d9f0"] }, { nev: "Magenta-hajnal", c: ["#4aa8dd", "#b03bc0", "#f0a5d8"] }],
  korall: [{ nev: "Alap", c: UNI_SZIN.korall.s }, { nev: "Parázs", c: ["#ff8a3d", "#c22e2e", "#ffd08a"] }, { nev: "Naplemente", c: ["#f2662b", "#b0347a", "#ffc45c"] }],
  rozsa:  [{ nev: "Alap", c: UNI_SZIN.rozsa.s }, { nev: "Rózsaarany", c: ["#f7b6c8", "#e08aa8", "#ffe0ea"] }, { nev: "Holdezüst", c: ["#e8e4f0", "#a49cc0", "#f7f5fb"] }]
};
var SZEM_SZIN = [
  { nev: "Alap", hex: null }, { nev: "Égkék", hex: "#2ea8e0" }, { nev: "Rózsa", hex: "#e67ba6" }, { nev: "Sötétbarna", hex: "#3a2a20" },
  { nev: "Mohazöld", hex: "#3f9e6a" }, { nev: "Borostyán", hex: "#b5762e" }, { nev: "Ametiszt", hex: "#7a5bc0" }
];
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
    var alap = (UNI_SZIN[rajz] || UNI_SZIN.korall).szem;
    art = art.split('r="5" fill="' + alap + '"').join('r="5" fill="' + kinezet.szemSzin + '"');
  }
  return art;
}
/* ── FODRÁSZAT (1. fázis): frizura göndör ↔ egyenes ─────────────────────────
   A göndör a 3 „ucg" csoportot (farok/sörény/homloktincs) fürtös buborékokra cseréli,
   a rajz saját színhármasában (SORENY_SZIN[rajz][0].c = [C1,C2,C3]) — így a kinezet-recolor
   és az élő-animáció ugyanúgy fut, mint az egyenesen. Buborék-pozíciók: fodraszat-rajzterv.html.
   ► A FÜRTÖK EGY HELYEN hangolhatók: az alábbi CURLY tábla [cx, cy, r, szín-slot]. */
var CURLY = {                          /* slot: 0=C1, 1=C2, 2=C3 (csillám) */
  farok:  [[86,164,18,1],[72,180,17,0],[82,198,18,0],[66,212,16,1],[74,230,18,0],[58,246,16,0],[66,264,16,1],[54,282,15,0],
           [80,176,5,2],[72,206,5,2],[64,238,5,2],[58,272,4.5,2]],
  soreny: [[244,94,17,1],[232,114,18,0],[239,136,17,0],[224,154,18,1],[229,176,18,0],[212,192,17,0],[216,214,17,1],[199,227,16,0],[187,235,15,0],
           [237,106,5,2],[231,146,5,2],[221,184,5,2],[206,220,4.5,2]],
  tincs:  [[276,92,11,0],[287,102,10,1],[272,110,10,0],[284,120,9,0],
           [280,98,3.5,2],[277,116,3.2,2]]
};
function furtCsoport(lista, szinek) {
  var s = '<g class="ucg">';
  for (var i = 0; i < lista.length; i++) { var b = lista[i]; s += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + szinek[b[3]] + '" stroke="none"/>'; }
  return s + '</g>';
}
function frizuraGondorArt(rajz, alap) {
  alap = alap || UNI_RAJZ[rajz] || UNI_RAJZ.korall;
  var lista = SORENY_SZIN[rajz] || SORENY_SZIN.korall, szinek = lista[0].c;
  var parts = [furtCsoport(CURLY.farok, szinek), furtCsoport(CURLY.soreny, szinek), furtCsoport(CURLY.tincs, szinek)], i = 0;
  return alap.replace(/<g class="ucg">[\s\S]*?<\/g>/g, function () { return parts[i++]; });
}
/* ── FODRÁSZAT (2. fázis): sörény-, farok- és tincsfestés ────────────────────
   Terv: terv/fodraszat-festes-rendszerterv.html + fodraszat-festes-rajzterv.html (jóváhagyva 2026-09-26).
   Mentés: P().kinezet.festek = { soreny, farok, tincs } (festék-id vagy null); megvett: P().szalon.festekek.
   A festés a bolti sörényszín (kinezetAlkalmaz) UTÁN fut, tehát a festék a bolti szín fölé kerül.
   ► ÚJ SZÍN = ÚJ SOR a FESTEKEK táblában (id, nev, em, ar, és egy rajz-típus: minta / grad / ketszin).
     A mentés csak az id-t tárolja; ismeretlen id → nincs festés. A kerti forgató-nézetek
     (szemből/hátulról) ugyanezt a festéket kapják (FESTEK_NEZET). */
function festekCsillag(x, y, r, fill) {   /* négyágú csillag */
  var p = [];
  for (var i = 0; i < 8; i++) { var a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; p.push((x + Math.cos(a) * rr).toFixed(1) + "," + (y + Math.sin(a) * rr).toFixed(1)); }
  return '<path d="M' + p.join(" L") + 'Z" fill="' + fill + '"/>';
}
function festekPehely(x, y, r) {
  var s = '<g stroke="#fff" stroke-width="1.4" stroke-linecap="round">';
  for (var i = 0; i < 3; i++) { var a = Math.PI / 3 * i, dx = Math.cos(a) * r, dy = Math.sin(a) * r; s += '<line x1="' + (x - dx).toFixed(1) + '" y1="' + (y - dy).toFixed(1) + '" x2="' + (x + dx).toFixed(1) + '" y2="' + (y + dy).toFixed(1) + '"/>'; }
  return s + '<circle cx="' + x + '" cy="' + y + '" r="1.3" fill="#fff" stroke="none"/></g>';
}
/* rózsaszín négyágú csillagok fehér szívvel (a producer rajzáról); bg=null → átlátszó réteg */
function festekCsillagMinta(p, bg, szin, folt) {
  return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="40" height="40">' +
    (bg ? '<rect width="40" height="40" fill="' + bg + '"/>' : '') + (folt ? '<ellipse cx="28" cy="12" rx="13" ry="7" fill="' + folt + '" opacity=".7"/>' : '') +
    festekCsillag(11, 12, 7.5, szin) + '<circle cx="11" cy="12" r="1.6" fill="#fff"/>' +
    festekCsillag(29, 30, 7, szin) + '<circle cx="29" cy="30" r="1.5" fill="#fff"/>' +
    festekCsillag(34, 7, 3.6, szin) + festekCsillag(6, 33, 3.4, szin) + '</pattern>';
}
function festekSima(id, nev, em, a, b) {   /* egyszerű szín: két árnyalat lágy átmenettel */
  return { id: id, nev: nev, em: em, ar: 12, csik: ["#ffffff", 0.4], fenyp: "#ffffff", grad: [[a, 0], [b, 1]] };
}
var FESTEKEK = [
  /* ── 7 különleges ── */
  { id: "arany", nev: "Arany csillagos", em: "✨", ar: 12, csik: ["#fff3a8", 0.85], fenyp: "#fffbe0",
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(-12)">' +
        '<rect width="34" height="34" fill="#f2b90f"/><rect x="0" y="0" width="17" height="34" fill="#f7c928"/>' +
        festekCsillag(8, 9, 4.6, "#fffbe0") + festekCsillag(25, 24, 3.6, "#fff6b0") + '<circle cx="23" cy="6" r="1.4" fill="#fff"/><circle cx="6" cy="27" r="1.2" fill="#fff"/></pattern>'; } },
  { id: "pottyos", nev: "Pöttyös", em: "⚫", ar: 12, csik: ["#3b3b46", 1], fenyp: "#ffffff",
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="20" height="20">' +
        '<rect width="20" height="20" fill="#1b1b1f"/><circle cx="5" cy="5" r="3.3" fill="#fff"/><circle cx="15" cy="15" r="3.3" fill="#fff"/></pattern>'; } },
  { id: "szivarvany", nev: "Szivárványos", em: "🌈", ar: 12, csik: ["#ffffff", 0.35], fenyp: "#ffffff",
    grad: [["#e94b4b", 0], ["#e94b4b", 0.15], ["#f5a13b", 0.19], ["#f5a13b", 0.32], ["#f5dc3b", 0.36], ["#f5dc3b", 0.49], ["#5cc85c", 0.53], ["#5cc85c", 0.66], ["#3ba3dd", 0.70], ["#3ba3dd", 0.83], ["#8a5bd0", 0.87], ["#8a5bd0", 1]] },
  { id: "naplemente", nev: "Naplemente", em: "🌅", ar: 12, csik: ["#ffd9b0", 0.5], fenyp: "#ffe2c4",
    grad: [["#6f45b8", 0], ["#b0509f", 0.35], ["#e8649a", 0.55], ["#ff9a3d", 0.85], ["#ffb85c", 1]] },
  { id: "galaxis", nev: "Galaxis", em: "🌌", ar: 12, csik: ["#b58cff", 0.55], fenyp: "#ffffff",
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="72" height="72">' +
        '<rect width="72" height="72" fill="#1a2350"/><ellipse cx="44" cy="26" rx="30" ry="15" fill="#8a4fd0" opacity=".5"/>' +
        '<ellipse cx="14" cy="58" rx="18" ry="10" fill="#e05aa8" opacity=".35"/><ellipse cx="60" cy="60" rx="12" ry="8" fill="#3fa0e0" opacity=".3"/>' +
        '<circle cx="10" cy="12" r="1.4" fill="#fff"/><circle cx="30" cy="44" r="1.2" fill="#fff"/><circle cx="62" cy="10" r="1" fill="#fff"/>' +
        '<circle cx="52" cy="40" r="1.3" fill="#fff"/><circle cx="22" cy="30" r=".9" fill="#fff"/><circle cx="40" cy="66" r="1.1" fill="#fff"/>' +
        festekCsillag(36, 22, 3.8, "#fff") + festekCsillag(8, 46, 2.8, "#ffe9ff") + '</pattern>'; } },
  { id: "nyaloka", nev: "Nyalóka", em: "🍭", ar: 12, csik: ["#ffffff", 0.4], fenyp: "#ffffff",
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(40)">' +
        '<rect width="18" height="18" fill="#fff"/><rect width="9" height="18" fill="#f27aa8"/></pattern>'; } },
  { id: "jeg", nev: "Jégkristály", em: "❄️", ar: 12, csik: ["#ffffff", 0.9], fenyp: "#ffffff",
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="42" height="42">' +
        '<rect width="42" height="42" fill="#b8e2f5"/><ellipse cx="30" cy="12" rx="14" ry="8" fill="#e6f7fd" opacity=".8"/>' +
        festekPehely(12, 13, 6) + festekPehely(31, 31, 4.2) + '<circle cx="34" cy="8" r="1.2" fill="#fff"/><circle cx="8" cy="34" r="1.4" fill="#fff"/></pattern>'; } },
  /* ── 4 a producer rajzából (terv/fodraszat-rajzok/kulonleges-sorenyek.png), sima rajzstílusban ── */
  { id: "tengerkek", nev: "Tengerkék csillagos", em: "🌊", ar: 12, csik: ["#ffffff", 0.3], fenyp: "#ffffff",
    ketszin: ["#12bfe6", "#8ef0f7"], csillag: "#ff5fbf" },
  { id: "menta", nev: "Menta csillagos", em: "🍃", ar: 12, csik: ["#ffffff", 0.35], fenyp: "#ffffff",
    minta: function (p) { return festekCsillagMinta(p, "#86f0cc", "#d46fe6", "#b8f7e2"); } },
  { id: "vanilia", nev: "Vanília csillagos", em: "🍦", ar: 12, csik: ["#fff8e0", 0.6], fenyp: "#ffffff",
    minta: function (p) { return festekCsillagMinta(p, "#efdfb0", "#ff2fa8", "#f8eccb"); } },
  { id: "ejcsillam", nev: "Éjszakai csillámpor", em: "🌠", ar: 12, csik: ["#2a2f7a", 0.9], fenyp: "#ffffff",
    minta: function (p) {
      var d = [[3, 4, 1.1], [11, 2, 0.8], [18, 7, 1.2], [7, 11, 0.9], [15, 14, 1], [2, 17, 0.8], [21, 19, 1.1], [10, 21, 0.9], [13, 9, 0.6], [20, 1, 0.7], [5, 23, 0.7]];
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#0b0f4a"/>' +
        d.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fff"/>'; }).join("") + '</pattern>'; } },
  /* ── 6 egyszerű ── */
  festekSima("pink", "Pink", "💗", "#ff5fa8", "#ff9fcf"),
  festekSima("turkiz", "Türkiz", "🐬", "#1fc0c0", "#7fe6e0"),
  festekSima("zold", "Zöld", "🌿", "#4fc07a", "#b8ecc8"),
  festekSima("levendula", "Levendula", "💜", "#a98be0", "#d9c8f5"),
  festekSima("barack", "Barack", "🍑", "#ff9f7a", "#ffd0b0"),
  festekSima("ezust", "Ezüst", "🥈", "#a8b0c0", "#eef1f6")
];
var FESTEK_BY = {};
FESTEKEK.forEach(function (f) { FESTEK_BY[f.id] = f; });
/* NÉZETENKÉNT: az ucg csoportok sorrendje (melyik rész) + részenként az irány a hajszál hossza mentén
   [x1, y1, x2, y2, fél-szélesség] (a színátmenetes és a kétszínű festékhez). vonal = a nézet sörénye
   vonalakból áll (szemből/hátulról): ott a vonal maga kapja a festéket. */
var FESTEK_NEZET = {
  oldal: { reszek: ["farok", "soreny", "tincs"], irany: [[96, 146, 46, 292, 26], [254, 52, 168, 238, 30], [282, 76, 266, 140, 12]] },
  elol:  { reszek: ["soreny", "soreny", "tincs"], irany: [[154, 56, 134, 240, 14], [226, 56, 246, 240, 14], [190, 62, 190, 96, 10]], vonal: true },
  hatul: { reszek: ["farok", "soreny", "tincs"], irany: [[190, 220, 190, 296, 22], [190, 52, 190, 240, 30], [190, 52, 190, 24, 10]], vonal: true }
};
function festekKetszinDef(f, pid, d) {
  var mx = (d[0] + d[2]) / 2, my = (d[1] + d[3]) / 2, dx = d[2] - d[0], dy = d[3] - d[1], L = Math.sqrt(dx * dx + dy * dy), w = d[4];
  var px = -dy / L * w, py = dx / L * w;
  return '<linearGradient id="' + pid + '" gradientUnits="userSpaceOnUse" x1="' + (mx - px).toFixed(1) + '" y1="' + (my - py).toFixed(1) + '" x2="' + (mx + px).toFixed(1) + '" y2="' + (my + py).toFixed(1) + '">' +
    '<stop offset="0" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[1] + '"/><stop offset="1" stop-color="' + f.ketszin[1] + '"/></linearGradient>' +
    festekCsillagMinta(pid + "-r", null, f.csillag);
}
/* a festék kitöltés-definíciója egy részre (pid példányonként egyedi) */
function festekDef(f, pid, d) {
  if (f.ketszin) return festekKetszinDef(f, pid, d);
  if (f.minta) return f.minta(pid);
  var s = '<linearGradient id="' + pid + '" gradientUnits="userSpaceOnUse" x1="' + d[0] + '" y1="' + d[1] + '" x2="' + d[2] + '" y2="' + d[3] + '">';
  f.grad.forEach(function (g) { s += '<stop offset="' + g[1] + '" stop-color="' + g[0] + '"/>'; });
  return s + '</linearGradient>';
}
/* kis festékfolt (tégely teteje, gomb-ikon, vásárlás-ablak): saját 0..1 koordinátában */
function festekFoltDef(f, id) {
  if (f.ketszin) return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset=".5" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[1] + '"/></linearGradient>';
  if (f.minta) return f.minta(id);
  var s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">';
  f.grad.forEach(function (g) { s += '<stop offset="' + g[1] + '" stop-color="' + g[0] + '"/>'; });
  return s + '</linearGradient>';
}
/* egy rész kifestése: a fő kitöltés → festék, a fénycsíkok/fénypöttyök → festékhez illő árnyalat.
   csillam = vonalas sörény (szemből/hátulról) csillám-színe: a többi vonal a festéket kapja. */
function festekReszFest(inner, f, pid, csillam) {
  return inner.replace(/<(path|circle)([^>]*?)\/>/g, function (m, tag, attr) {
    var rm = tag === "circle" && /\br="([\d.]+)"/.exec(attr);
    var kicsiFeny = !!rm && parseFloat(rm[1]) <= 5.5;
    if (/fill="none"/.test(attr) && csillam && attr.indexOf('stroke="' + csillam + '"') < 0) {
      var vo = '<' + tag + attr.replace(/stroke="#[0-9a-fA-F]{6}"/, 'stroke="url(#' + pid + ')"') + '/>';
      return f.ketszin ? vo + '<' + tag + attr.replace(/stroke="#[0-9a-fA-F]{6}"/, 'stroke="url(#' + pid + '-r)"') + '/>' : vo;
    }
    if (/fill="none"/.test(attr)) return '<' + tag + attr.replace(/stroke="#[0-9a-fA-F]{6}"/, 'stroke="' + f.csik[0] + '" stroke-opacity="' + f.csik[1] + '"') + '/>';
    if (kicsiFeny) return '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="' + f.fenyp + '" fill-opacity=".9"') + '/>';
    var fo = '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="url(#' + pid + ')"') + '/>';
    return f.ketszin ? fo + '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="url(#' + pid + '-r)"') + '/>' : fo;
  });
}
var FESTEK_SORSZAM = 0;   /* a minta-id-k példányonként egyediek (egy képernyőn több unikornis is lehet) */
/* nezet: "oldal" (alap) / "elol" / "hatul"; csillam = a vonalas nézet csillám-színe (sz.s3) */
function festekAlkalmaz(art, festek, pfx, nezet, csillam) {
  if (!festek || !(FESTEK_BY[festek.soreny] || FESTEK_BY[festek.farok] || FESTEK_BY[festek.tincs])) return art;
  var N = FESTEK_NEZET[nezet] || FESTEK_NEZET.oldal;
  var p = "fs" + (++FESTEK_SORSZAM) + "-" + String(pfx || "u").replace(/[^A-Za-z0-9_-]/g, ""), defs = "", k = 0;
  art = art.replace(/<g class="ucg">([\s\S]*?)<\/g>/g, function (m, inner) {
    var i = k++, resz = N.reszek[i], f = resz && FESTEK_BY[festek[resz]];
    if (f) { var pid = p + "-" + resz + i; defs += festekDef(f, pid, N.irany[i]); inner = festekReszFest(inner, f, pid, N.vonal && csillam); }
    return '<g class="ucg">' + inner + '</g>';
  });
  return '<defs>' + defs + '</defs>' + art;
}
/* MAGASSÁG (3. lépés, előkészítés a repüléshez): a .uni-magas réteg emeli a testet (--uni-magas, rajz-egység,
   0 = a földön), az árnyék-folt a földön marad. Ma mindig 0, az árnyék rejtve — a repülés kapcsolja majd be. */
var UNI_ARNYEK = '<ellipse class="uni-arnyek" cx="174" cy="291" rx="92" ry="8" fill="#3c3c28" opacity=".16" display="none"/>';
function unikornisSVG(id, c, meret, oltozet, kinezet) {
  var s = meret || 1;
  var rajz = (c && c.rajz) || "korall";
  var art = uniAlapArt(rajz, oltozet && oltozet.lab);   /* a lábdísz a láb része (2a) */
  if (kinezet === undefined) kinezet = (typeof P === "function" && P() && P().kinezet) || null;
  if (kinezet && kinezet.frizura === "gondor") art = frizuraGondorArt(rajz, art);   /* FODRÁSZAT: göndör forma (a recolor/anim ugyanúgy fut rá) */
  art = kinezetAlkalmaz(art, rajz, kinezet);
  art = festekAlkalmaz(art, kinezet && kinezet.festek, id);   /* FODRÁSZAT 2.: festék a bolti szín fölé */
  art = eloAnimHorgony(art);
  var ruha = "";
  var KERET = { farok: "farok", oldal: "szarny", nyak: "nyak", fej: "fej" };   /* a dísz a testrésze ízület-keretében (2b) */
  if (oltozet) ["hat", "farok", "oldal", "nyak", "fej"].forEach(function (h) {
    if (!oltozet[h]) return;
    ruha += KERET[h] ? uniIzKeret(KERET[h], ruhaSVG(oltozet[h])) : ruhaSVG(oltozet[h]);
    /* a hát-takaróra a sörény omlik: a sörény-csoportot a takaró után még egyszer kirajzoljuk (a nyak keretében) */
    if (h === "hat") { var sor = art.match(/<g class="ucg uni-soreny">[\s\S]*?<\/g>/); if (sor) ruha += uniIzKeret("nyak", sor[0]); }
  });
  return '<g id="' + id + '" transform="scale(' + s + ')">' +
    '<g transform="scale(0.5) translate(-190,-272)">' +
      UNI_ARNYEK +
      '<g class="uni-magas"><g class="uni-elo">' + izForgo("uni-test", UNI_POZ_PONT, art + ruha) + '</g></g>' +   /* uni-test: a póz testtartása */
      (window.__UC_ANCHOR ? anchorVizSVG() : "") +
    '</g>' +
  '</g>';
}
/* ── 4 NÉZETES FORGATÓ MOTOR (sprite-swap rotation) ────────────────────────
   Bármilyen figurát/tárgyat körbeforgathatunk 4 nézettel (jobb/elöl/bal/hátul).
   A közös fordulás (uniFordul) és 🌀 pörgés (uniPorog) ezt használja — így sosem lesz papírvékony csík.
   A színek UGYANABBÓL a UNI_SZIN-ből jönnek, mint az oldalrajzé (unikornis pózok 1a). */
function forgatoSzinek(rajz, kinezet) {
  var a = UNI_SZIN[rajz] || UNI_SZIN.korall;
  var sz = { test: a.test, has: a.has, lab: a.lab, pata: a.pata, s1: a.s[0], s2: a.s[1], s3: a.s[2], szarv: a.szarv, szarvCs: a.szarvCs, szem: a.szem };
  if (kinezet && kinezet.sorenySzin) {
    var lista = SORENY_SZIN[rajz];
    if (lista && lista[kinezet.sorenySzin]) { var c = lista[kinezet.sorenySzin].c; sz.s1 = c[0]; sz.s2 = c[1]; sz.s3 = c[2]; }
  }
  if (kinezet && kinezet.szemSzin) sz.szem = kinezet.szemSzin;
  return sz;
}
/* szemből ("elol") vagy hátulról ("hatul") — a lény színeivel, frizurájával, a VALÓDI festékmintával
   és a felvett díszekkel (oltozet; unikornis pózok 1b, terv/diszek-nezetek-rajzterv.html) */
function unikornisNezetArt(nezet, rajz, kinezet, pfx, oltozet) {
  var sz = forgatoSzinek(rajz, kinezet), gondor = !!(kinezet && kinezet.frizura === "gondor");
  var r = nezetDiszRetegek(nezet === "hatul" ? "hatul" : "elol", oltozet);
  var art = nezet === "hatul" ? unikornisBackArt(sz, gondor, r) : unikornisFrontArt(sz, gondor, r);
  return festekAlkalmaz(art, kinezet && kinezet.festek, (pfx || "nz") + nezet, nezet === "hatul" ? "hatul" : "elol", sz.s3);
}
/* ── SZEMBŐL/HÁTULRÓL: A 4 LÁB ── ugyanaz a [bal-felső, jobb-felső, jobb-alsó, bal-alsó] alak, mint a
   UNI_LABAK-ban, így a lábdísz (labDiszSVG) ugyanazzal a kóddal kerül rá, mint oldalról.
   hatso = a test mögötti pár (halványabb); elso = az elülső pár. A két nézet lába azonos. */
var NEZET_LABAK = {
  hatso: [[[148, 220], [156, 222], [162, 286], [140, 286]], [[224, 222], [232, 220], [240, 286], [218, 286]]],
  elso:  [[[158, 224], [166, 226], [174, 286], [150, 286]], [[214, 226], [222, 224], [230, 286], [206, 286]]]
};
function nezetLabSVG(L, jobb, sz, op) {   /* a felső él nyitva marad (a test takarja) */
  var p = jobb ? [L[1], L[2], L[3], L[0]] : [L[0], L[3], L[2], L[1]];
  return '<path d="M' + p[0].join(" ") + " L" + p[1].join(" ") + " L" + p[2].join(" ") + " L" + p[3].join(" ") + '" fill="' + sz.lab + '" stroke-width="4"' + (op ? ' opacity="' + op + '"' : '') + '/>';
}
/* szemből/hátulról: egy láb pata-része (x1, x2 = a láb alja; op = a hátsó pár halványabb) */
function nezetPata(sz, x1, x2, op) {
  return '<path class="uni-pata" d="' + pataD(x1 + 1, x2 - 1, 273, 287) + '" fill="' + sz.pata + '" stroke-width="3.2"' + (op ? ' opacity="' + op + '"' : '') + '/>';
}
function nezetLabPar(sz, par, op) {   /* egy pár láb (2 láb), utána a 2 pata */
  var L = NEZET_LABAK[par];
  return nezetLabSVG(L[0], false, sz, op) + nezetLabSVG(L[1], true, sz, op);
}
function nezetPataPar(sz, par, op) {
  var L = NEZET_LABAK[par];
  return nezetPata(sz, L[0][3][0], L[0][2][0], op) + nezetPata(sz, L[1][3][0], L[1][2][0], op);
}
/* r = a díszek rétegei (nezetDiszRetegek): mogott · farok · labH · labE · test · nyak · veg */
function unikornisFrontArt(sz, gondor, r) {
  r = r || {};
  var s = '<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">';
  s += (r.mogott || "");   /* szárnyak: a test mögött */
  s += '<path d="M172 228 Q158 256 156 278" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/>';
  s += '<path d="M208 228 Q222 256 224 278" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/>';
  s += (r.farok || "");
  s += nezetLabPar(sz, "hatso", ".7");
  s += nezetPataPar(sz, "hatso", ".7");   /* a hátsó pár patája, a test mögött */
  s += (r.labH || "");
  s += '<path d="M110 174 C110 130 142 118 190 118 C238 118 270 130 270 174 C270 218 242 236 190 236 C138 236 110 218 110 174 Z" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="190" cy="200" rx="52" ry="26" fill="' + sz.has + '" stroke="none"/>';
  s += nezetLabPar(sz, "elso");
  s += '<ellipse cx="162" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += '<ellipse cx="218" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += nezetPataPar(sz, "elso");   /* az elülső pár patája */
  s += (r.labE || "") + (r.test || "");   /* lábdísz; a hát-takaró két oldala (a sörény rá omlik) */
  if (gondor) {
    s += '<g class="ucg"><circle cx="138" cy="82" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="128" cy="112" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="122" cy="146" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="120" cy="178" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="126" cy="206" r="12" fill="' + sz.s1 + '" stroke="none"/><circle cx="132" cy="94" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="124" cy="162" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
    s += '<g class="ucg"><circle cx="242" cy="82" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="252" cy="112" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="258" cy="146" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="260" cy="178" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="254" cy="206" r="12" fill="' + sz.s1 + '" stroke="none"/><circle cx="248" cy="94" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="256" cy="162" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M154 56 Q124 82 118 124 Q114 160 122 200 Q128 224 134 240" fill="none" stroke="' + sz.s1 + '" stroke-width="9"/><path d="M156 62 Q130 92 124 134 Q120 168 128 210" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M158 54 Q136 78 132 116 Q128 148 134 180" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
    s += '<g class="ucg"><path d="M226 56 Q256 82 262 124 Q266 160 258 200 Q252 224 246 240" fill="none" stroke="' + sz.s1 + '" stroke-width="9"/><path d="M224 62 Q250 92 256 134 Q260 168 252 210" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M222 54 Q244 78 248 116 Q252 148 246 180" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
  }
  s += '<circle cx="190" cy="88" r="42" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="153" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(-15,153,56)"/>';
  s += '<ellipse cx="227" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(15,227,56)"/>';
  s += '<polygon points="190,12 176,62 204,62" fill="' + sz.szarv + '" stroke-width="4"/>';
  s += '<path d="M180 52 L200 52" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M183 40 L197 40" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M186 28 L194 28" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  if (gondor) {
    s += '<g class="ucg"><circle cx="178" cy="78" r="9" fill="' + sz.s1 + '" stroke="none"/><circle cx="202" cy="78" r="9" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="74" r="7" fill="' + sz.s2 + '" stroke="none"/><circle cx="184" cy="86" r="3" fill="' + sz.s3 + '" stroke="none"/><circle cx="196" cy="86" r="3" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M180 64 Q174 80 178 96" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/><path d="M186 62 Q180 78 184 94" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/><path d="M194 62 Q200 78 196 94" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/><path d="M200 64 Q206 80 202 96" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/></g>';
  }
  s += '<path d="M165 86 Q172 76 180 76 Q188 76 191 86 Q186 92 178 92 Q170 92 165 86 Z" fill="#fff" stroke-width="1.7"/>';
  s += '<circle cx="178" cy="85" r="5.5" fill="' + sz.szem + '" stroke="none"/><circle cx="178" cy="85" r="3.2" fill="#222" stroke="none"/><circle cx="176" cy="83" r="1.6" fill="#fff" stroke="none"/>';
  s += '<path d="M189 86 Q196 76 204 76 Q212 76 215 86 Q210 92 202 92 Q194 92 189 86 Z" fill="#fff" stroke-width="1.7"/>';
  s += '<circle cx="202" cy="85" r="5.5" fill="' + sz.szem + '" stroke="none"/><circle cx="202" cy="85" r="3.2" fill="#222" stroke="none"/><circle cx="200" cy="83" r="1.6" fill="#fff" stroke="none"/>';
  s += '<path d="M165 84 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/><path d="M169 80 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/>';
  s += '<path d="M215 84 q3 -3 5 -8" fill="none" stroke-width="2.2"/><path d="M211 80 q2 -4 3 -9" fill="none" stroke-width="2.2"/>';
  s += '<path d="M183 104 Q190 110 197 104" fill="none" stroke="#e088b0" stroke-width="2"/>';
  s += '<ellipse cx="162" cy="98" rx="8" ry="5" fill="#f0b8d8" opacity=".35" stroke="none"/>';
  s += '<ellipse cx="218" cy="98" rx="8" ry="5" fill="#f0b8d8" opacity=".35" stroke="none"/>';
  s += '<path d="M148 24 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="' + sz.s1 + '" stroke="none"/>';
  s += '<path d="M234 18 l1.4 3.2 l3.2 1.4 l-3.2 1.4 l-1.4 3.2 l-1.4 -3.2 l-3.2 -1.4 l3.2 -1.4 Z" fill="' + sz.s2 + '" stroke="none"/>';
  s += (r.nyak || "") + (r.veg || "");   /* nyakdísz a mellkason, fejdísz a fejen — legfelül */
  return s + '</g>';
}
function unikornisBackArt(sz, gondor, r) {
  r = r || {};
  var s = '<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">';
  if (gondor) {
    s += '<g class="ucg"><circle cx="176" cy="238" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="248" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="204" cy="238" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="170" cy="264" r="13" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="272" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="210" cy="264" r="13" fill="' + sz.s1 + '" stroke="none"/><circle cx="180" cy="286" r="11" fill="' + sz.s2 + '" stroke="none"/><circle cx="200" cy="286" r="11" fill="' + sz.s2 + '" stroke="none"/><circle cx="184" cy="254" r="4" fill="' + sz.s3 + '" stroke="none"/><circle cx="196" cy="254" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M190 222 Q164 252 156 274 Q150 288 156 294" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M190 220 Q190 258 188 280 Q186 292 190 296" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M190 222 Q216 252 224 274 Q230 288 224 294" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M190 218 Q176 248 170 270 Q166 284 170 292" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/><path d="M190 218 Q204 248 210 270 Q214 284 210 292" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
  }
  s += nezetLabPar(sz, "hatso", ".7");
  s += nezetPataPar(sz, "hatso", ".7");   /* a hátsó pár patája, a test mögött */
  s += (r.labH || "");
  s += '<path d="M110 174 C110 130 142 118 190 118 C238 118 270 130 270 174 C270 218 242 236 190 236 C138 236 110 218 110 174 Z" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="190" cy="200" rx="52" ry="26" fill="' + sz.has + '" stroke="none"/>';
  s += nezetLabPar(sz, "elso");
  s += '<ellipse cx="162" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += '<ellipse cx="218" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += nezetPataPar(sz, "elso");   /* az elülső pár patája */
  s += (r.labE || "") + (r.test || "") + (r.farok || "");   /* lábdísz; hát-takaró (a fej és a sörény rá omlik); farokdísz a farok tetején */
  s += '<circle cx="190" cy="88" r="42" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="153" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(-15,153,56)"/>';
  s += '<ellipse cx="227" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(15,227,56)"/>';
  s += '<ellipse cx="153" cy="58" rx="5.5" ry="12" fill="#f0b8d8" stroke="none" transform="rotate(-15,153,58)"/>';
  s += '<ellipse cx="227" cy="58" rx="5.5" ry="12" fill="#f0b8d8" stroke="none" transform="rotate(15,227,58)"/>';
  s += '<polygon points="190,18 180,58 200,58" fill="' + sz.szarv + '" stroke-width="4"/>';
  s += '<path d="M183 48 L197 48" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M185 36 L195 36" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += (r.nyak || "");   /* nyakdísz a tarkón + szárnyak a háton: a sörény rájuk omlik */
  if (gondor) {
    s += '<g class="ucg"><circle cx="172" cy="76" r="15" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="82" r="16" fill="' + sz.s1 + '" stroke="none"/><circle cx="208" cy="76" r="15" fill="' + sz.s2 + '" stroke="none"/><circle cx="166" cy="110" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="116" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="214" cy="110" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="172" cy="142" r="12" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="146" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="208" cy="142" r="12" fill="' + sz.s2 + '" stroke="none"/><circle cx="180" cy="92" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="200" cy="92" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="178" cy="128" r="4" fill="' + sz.s3 + '" stroke="none"/><circle cx="202" cy="128" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M172 60 Q156 100 154 148 Q152 188 160 224" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M180 56 Q168 100 166 150 Q164 196 172 236" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M190 52 Q190 100 190 150 Q190 196 190 240" fill="none" stroke="' + sz.s3 + '" stroke-width="6"/><path d="M200 56 Q212 100 214 150 Q216 196 208 236" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M208 60 Q224 100 226 148 Q228 188 220 224" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/></g>';
  }
  s += '<g class="ucg">';
  if (gondor) {
    s += '<circle cx="182" cy="52" r="8" fill="' + sz.s1 + '" stroke="none"/><circle cx="198" cy="52" r="8" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="48" r="6" fill="' + sz.s2 + '" stroke="none"/>';
  } else {
    s += '<path d="M182 52 Q178 36 180 24" fill="none" stroke="' + sz.s1 + '" stroke-width="4"/><path d="M198 52 Q202 36 200 24" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/>';
  }
  s += '</g>';
  s += (r.veg || "");   /* fejdísz */
  return s + '</g>';
}
/* ── ÉLETRE KELTÉS (idle animáció) ──────────────────────────────────────────
   Csak CLASS-eket tesz a meglévő rajzra — a geometriát/színt NEM érinti. A tényleges
   mozgást a style.css végzi, és CSAK a "hős" konténerekben (#szinpad, #odu-szoba,
   #profil-lista); a pici bélyegképek (menü-kártyák, bolt-előnézet, jelvények) mozdulatlanok.
   FONTOS: ez kinezetAlkalmaz UTÁN fut, mert az a szó szerinti <g class="ucg">-re épül és
   visszaírja azt. A három "ucg" csoport sorrendben: 1) farok, 2) sörény, 3) homloktincs;
   a szem az egyetlen 3-jegyű #222-es csoport. */
function eloAnimHorgony(art) {
  art = art.replace('<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">',
                    '<g class="uni-szem" stroke="#222" stroke-linejoin="round" stroke-linecap="round">');
  var n = 0;
  art = art.replace(/<g class="ucg">/g, function () {
    n++;
    return '<g class="ucg ' + (n === 1 ? "uni-farok-rajz" : n === 2 ? "uni-soreny" : "uni-tincs") + '">';
  });
  /* a 4 láb (láb + pata) osztályát már a sablon adja (uniLabSVG); a járást a UNI_JARAS tábla adja */
  return art;
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
﻿/* ── HÁT-TAKARÓK (újrarajzolva, 2026-09-26, terv/hattakarok-rajzterv.html) ──
   A régi takaró egy lapos folt volt a test közepén, a sörényre és a far jelére lógott.
   Az új a hát-ívre simul, a jobb széle a sörény alá fut: az unikornisSVG a takaró után
   a sörényt ÚJRA kirajzolja, így a sörény a takaróra omlik. A far jelét takarja.
   Egy tábla: a ruhaSVG ÉS a bolti polckép (POLC_POZ) is innen rajzol. */
var HAT_DISZ = (function () {
  function f1(n) { return +n.toFixed(1); }
  function szikra(cx, cy, r, fill) { return '<path d="M' + cx + ' ' + (cy - r) + ' Q' + cx + ' ' + cy + ' ' + (cx + r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + r) + ' Q' + cx + ' ' + cy + ' ' + (cx - r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>'; }
  function csillag5(cx, cy, R, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; p.push(f1(cx + q * Math.cos(a)) + " " + f1(cy + q * Math.sin(a))); } return "M" + p.join(" L") + " Z"; }
  /* az alsó szegély: másodfokú ív (202,196) → (104,200), kontroll (152,212) */
  function also(t) { var u = 1 - t; return [u * u * 202 + 2 * u * t * 152 + t * t * 104, u * u * 196 + 2 * u * t * 212 + t * t * 200]; }
  /* hullám/csipke vagy csúcsos szegély az alsó él mentén: n darab, kifelé (lefelé) d-vel */
  function szegely(n, d, csucsos) {
    var s = "M202 196", i;
    for (i = 0; i < n; i++) {
      var a = also(i / n), b = also((i + 1) / n), m = also((i + 0.5) / n);
      if (csucsos) s += " L" + f1(m[0]) + " " + f1(m[1] + d) + " L" + f1(b[0]) + " " + f1(b[1]);
      else s += " Q" + f1(m[0]) + " " + f1(m[1] + d * 2) + " " + f1(b[0]) + " " + f1(b[1]);
    }
    return s + " Q152 212 202 196 Z";
  }
  /* közös takaró-sziluett: a hát-ívre simul (≈2 px-lel fölötte), a far jelét is takarja,
     a jobb széle a sörény alá fut (a sörényt a renderer a takaró FÖLÉ rajzolja újra) */
  var TEST = "M100 121 C112 110 140 103.5 172 103.5 C196 103.5 214 106.5 231 114 L218 160 L202 196 Q152 212 104 200 Z";
  var SAV = "M104 188 Q152 200 206 185 L202 196 Q152 212 104 200 Z";   /* alsó szegélysáv */
  return {
    "hat-a": /* Pillekönnyű takaró — rózsaszín, fehér pöttyös, steppelt, lila csipkés szegéllyel */
      '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
      '<path d="' + szegely(9, 5) + '" fill="#d9c4f0"/>' +
      '<path d="' + TEST + '" fill="#f9c9dc"/>' +
      '<path d="' + SAV + '" fill="#d9c4f0"/>' +
      '</g>' +
      '<g fill="none" stroke="#e79bbb" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round">' +
      '<path d="M108 128 Q150 110 212 118"/><path d="M106 156 Q150 144 206 150"/><path d="M142 110 L142 196 M180 106 L180 192"/>' +
      '</g>' +
      '<g fill="#fff">' +
      '<circle cx="123" cy="138" r="3.4"/><circle cx="161" cy="128" r="3.4"/><circle cx="198" cy="130" r="3.4"/>' +
      '<circle cx="123" cy="174" r="3.4"/><circle cx="161" cy="170" r="3.4"/><circle cx="194" cy="170" r="3.4"/>' +
      '</g>' +
      '<g fill="#fff" stroke="none" opacity=".9"><circle cx="118" cy="199" r="1.8"/><circle cx="140" cy="203" r="1.8"/><circle cx="162" cy="202.5" r="1.8"/><circle cx="184" cy="198" r="1.8"/></g>' +
      '<path d="M110 117 Q140 106 176 106" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>',

    "hat-k": /* Hímzett nyeregtakaró — málnapiros, arany hímzett keret, virághímzés, arany bojtok */
      '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
      '<path d="' + TEST + '" fill="#d9577e"/>' +
      '</g>' +
      '<path d="M108 125 C120 115 144 110 172 110 C194 110 210 112 226 118 M108 125 L111 192 Q152 203 204 188" fill="none" stroke="#ffd24d" stroke-width="3.4" stroke-linejoin="round"/>' +
      '<path d="M108 125 C120 115 144 110 172 110 C194 110 210 112 226 118 M108 125 L111 192 Q152 203 204 188" fill="none" stroke="#b8323f" stroke-width="1.2" stroke-dasharray="1.5 3.5"/>' +
      '<g fill="none" stroke="#a7d99a" stroke-width="2" stroke-linecap="round"><path d="M126 150 Q116 138 124 128 M170 150 Q180 138 172 128"/></g>' +
      '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
      '<path d="M120 132 q-7 -2 -9 -9 q8 0 9 9 Z M176 132 q7 -2 9 -9 q-8 0 -9 9 Z M140 172 q-8 2 -12 10 q9 0 12 -10 Z M156 172 q8 2 12 10 q-9 0 -12 -10 Z" fill="#a7d99a"/>' +
      '<circle cx="148" cy="138" r="7" fill="#f6a5c0"/><circle cx="162" cy="149" r="7" fill="#f6a5c0"/><circle cx="157" cy="165" r="7" fill="#f6a5c0"/>' +
      '<circle cx="139" cy="165" r="7" fill="#f6a5c0"/><circle cx="134" cy="149" r="7" fill="#f6a5c0"/>' +
      '<circle cx="148" cy="153" r="6" fill="#ffd24d"/>' +
      '<circle cx="124" cy="128" r="3.6" fill="#9ec9f0"/><circle cx="172" cy="128" r="3.6" fill="#9ec9f0"/>' +
      '</g>' +
      [[106, 200], [152, 206], [196, 199]].map(function (p) {
        var x = p[0], y = p[1];
        return '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
          '<path d="M' + x + ' ' + (y - 2) + ' L' + x + ' ' + (y + 4) + '" stroke="#c9912a" stroke-width="1.6"/>' +
          '<path d="M' + x + ' ' + (y + 3) + ' C' + (x - 5) + ' ' + (y + 3) + ' ' + (x - 6) + ' ' + (y + 10) + ' ' + (x - 5) + ' ' + (y + 16) + ' L' + (x + 5) + ' ' + (y + 16) + ' C' + (x + 6) + ' ' + (y + 10) + ' ' + (x + 5) + ' ' + (y + 3) + ' ' + x + ' ' + (y + 3) + ' Z" fill="#ffd24d"/>' +
          '<path d="M' + (x - 2.5) + ' ' + (y + 9) + ' L' + (x - 2.5) + ' ' + (y + 15) + ' M' + x + ' ' + (y + 9) + ' L' + x + ' ' + (y + 15) + ' M' + (x + 2.5) + ' ' + (y + 9) + ' L' + (x + 2.5) + ' ' + (y + 15) + '" stroke="#e0a52e" stroke-width="1"/>' +
          '<circle cx="' + x + '" cy="' + (y + 3) + '" r="2.4" fill="#e0a52e"/></g>';
      }).join(""),

    "hat-r": /* Csillagköpeny — éjkék, hosszan a farra omló köpeny, arany szegéllyel, csillagokkal, hullámos aljjal */
      '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
      '<path d="M100 121 C112 110 140 103.5 172 103.5 C196 103.5 214 106.5 231 114 L218 160 L204 202 Q194 214 182 208 Q170 220 156 212 Q142 224 128 214 Q114 224 102 214 Q90 222 80 212 C78 180 82 142 100 121 Z" fill="#4b3f9a"/>' +
      '<path d="M100 121 C84 142 80 180 80 212 Q86 216 91 216 C88 184 92 146 106 124 Z" fill="#8f7ad6"/>' +
      '</g>' +
      '<g fill="none" stroke="#3a3080" stroke-width="2" stroke-linecap="round"><path d="M122 150 Q118 180 116 210 M190 150 Q188 176 184 204"/></g>' +
      '<path d="M104 121 C116 112 142 107 172 107 C196 107 212 110 228 116.5" fill="none" stroke="#ffd24d" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M84 206 Q92 214 102 208 Q114 218 128 208 Q142 218 156 206 Q170 214 182 202 Q194 208 204 198" fill="none" stroke="#ffd24d" stroke-width="2.4" stroke-linecap="round"/>' +
      '<g fill="#ffd24d" stroke="#222" stroke-width="1">' +
      '<path d="' + csillag5(146, 140, 9, 3.8) + '"/><path d="' + csillag5(178, 128, 6, 2.6) + '"/><path d="' + csillag5(160, 180, 7, 3) + '"/><path d="' + csillag5(106, 176, 5.5, 2.4) + '"/>' +
      '</g>' +
      '<g stroke="none">' + szikra(126, 128, 3.2, "#fff6d8") + szikra(194, 152, 3.2, "#fff6d8") + szikra(134, 194, 3, "#fff6d8") + szikra(114, 154, 2.6, "#fff6d8") + szikra(186, 188, 2.6, "#ffd24d") + '</g>' +
      '<g stroke="#222" stroke-width="1.2"><path d="' + csillag5(104, 121, 7, 3.2) + '" fill="#ffd24d"/></g>'
  };
})();
/* ── SZÁRNYAK (újrarajzolva, 2026-09-26, szarnyak-rajzterv.html) ──
   Tollas unikornis-szárny: kar-él, alatta legyezőben 7 evezőtoll, a tövüknél két csipkés fedőtoll-sor.
   A töve SZÉLES vállként a hát tetején fekszik (x132–180, y≈106), minden a hát-vonal fölött marad,
   így a hát-takaróval (HAT_DISZ) együtt is felvehető, nem takarja el.
   Egy tábla: a ruhaSVG ÉS a bolti polckép (POLC_POZ) is innen rajzol. */
var SZARNY_DISZ = (function () {
  function f(n) { return +n.toFixed(1); }
  /* kar-él: a csuklótól (138,34) a váll-tőig (180,106), előre domborodva */
  function kar(t) { var u = 1 - t; return [u*u*138 + 2*u*t*184 + t*t*180, u*u*34 + 2*u*t*50 + t*t*106]; }
  var VEG = [[46,12],[34,34],[36,56],[50,73],[72,86],[100,94]];   /* evezőtollak vége, fentről lefelé; a legalsó is a fedőtollak alá fut (nem lóg ki) */
  var BT = [0, 0.12, 0.26, 0.42, 0.58, 0.74];                    /* a tövük helye a kar-élen */
  function toll(b, t, w, fill) {
    var dx = t[0] - b[0], dy = t[1] - b[1], L = Math.sqrt(dx*dx + dy*dy), ux = dx / L, uy = dy / L, nx = -uy * w / 2, ny = ux * w / 2;
    var k = [t[0] - ux * w * .7, t[1] - uy * w * .7];
    b = [b[0] + ux * 6, b[1] + uy * 6];   /* a tő a kar-él mögé húzva, keskenyen: nem áll ki a fedőtollak alól */
    return '<path d="M' + f(b[0] + nx * .3) + ' ' + f(b[1] + ny * .3) + ' L' + f(k[0] + nx) + ' ' + f(k[1] + ny) + ' Q' + f(t[0] + ux * w * .35 + nx * .2) + ' ' + f(t[1] + uy * w * .35 + ny * .2) + ' ' + f(k[0] - nx) + ' ' + f(k[1] - ny) + ' L' + f(b[0] - nx * .3) + ' ' + f(b[1] - ny * .3) + ' Z" fill="' + fill + '"/>' +
      '<path d="M' + f(b[0] + ux * L * .35) + ' ' + f(b[1] + uy * L * .35) + ' L' + f(k[0] - ux * 2) + ' ' + f(k[1] - uy * 2) + '" fill="none" stroke-width="1.1" class="szar"/>';
  }
  function szikra(cx, cy, r, fill) { return '<path d="M' + cx + ' ' + (cy - r) + ' Q' + cx + ' ' + cy + ' ' + (cx + r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + r) + ' Q' + cx + ' ' + cy + ' ' + (cx - r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>'; }
  function fedo(a, d, fill) {   /* fedőtoll-sor: a kar-éltől a tollak felé a-nyira, d mélységű csipkével */
    var s = "M180 106", i, t;
    for (t = 1; t >= -0.0001; t -= 0.1) { var p = kar(Math.max(t, 0)); s += " L" + f(p[0]) + " " + f(p[1]); }
    var pts = BT.map(function (bt, i) { var b = kar(bt); return [b[0] + (VEG[i][0] - b[0]) * a, b[1] + (VEG[i][1] - b[1]) * a]; });
    s += " L" + f(pts[0][0]) + " " + f(pts[0][1]);
    for (i = 1; i < pts.length; i++) {
      var m = [(pts[i-1][0] + pts[i][0]) / 2, (pts[i-1][1] + pts[i][1]) / 2], dx = m[0] - 150, dy = m[1] - 60, L = Math.sqrt(dx*dx + dy*dy);
      s += " Q" + f(m[0] + dx / L * d) + " " + f(m[1] + dy / L * d) + " " + f(pts[i][0]) + " " + f(pts[i][1]);
    }
    var u = pts[pts.length - 1];   /* az utolsó csipkétől lekerekítve le a hátra (nincs lefelé álló csücsök) */
    return '<path d="' + s + ' Q' + f(u[0] - 6) + ' 106 ' + f(u[0] + 14) + ' 106 L180 106 Z" fill="' + fill + '"/>';
  }
  function szarny(o) {
    var s = (o.glo || "") + '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">';
    for (var i = 0; i < VEG.length; i++) s += toll(kar(BT[i]), VEG[i], 17 - i * .6, o.evezo[i % o.evezo.length]);
    s += fedo(0.5, 7, o.kozep) + fedo(0.27, 6, o.fedo) + '</g>';
    s = s.replace(/class="szar"/g, 'stroke="' + o.er + '"');
    var e = "M180 106"; for (var t = 1; t >= -0.0001; t -= 0.1) { var p = kar(Math.max(t, 0)); e += " L" + f(p[0]) + " " + f(p[1]); }
    if (o.elvast) s += '<path d="' + e + '" fill="none" stroke="' + o.elszin + '" stroke-width="' + o.elvast + '" stroke-linecap="round"/>';
    return s + (o.utana || "");
  }
  return {
    "oldal-a": szarny({ /* Pihe-szárny — hófehér tollak, halvány lila árnyalat */
      evezo: ["#efe6fb", "#f6f0ff"], kozep: "#faf6ff", fedo: "#ffffff", er: "#cbbbe6" }),
    "oldal-k": szarny({ /* Szivárvány-szárny — minden evezőtoll más pasztellszín */
      evezo: ["#c9a8e6", "#9ec9f0", "#a7d99a", "#fce49a", "#ffc9a0", "#f6a5c0", "#d9b8f0"], kozep: "#fdf6ff", fedo: "#ffffff", er: "#ffffff" }),
    "oldal-r": szarny({ /* Fény-szárny — aranyvégű tollak, arany él, ragyogás csak a szárny mögött */
      glo: '<path d="M172 108 C176 40 150 4 40 2 C18 30 20 70 50 92 C84 110 130 114 172 108 Z" fill="#ffe9ad" opacity=".5"/>',
      evezo: ["#ffe08a", "#fff2c4"], kozep: "#fff6de", fedo: "#ffffff", er: "#e8b93e", elszin: "#ffc93a", elvast: 2.6,
      utana: '<g stroke="none">' + szikra(40, 8, 6, "#ffd24d") + szikra(24, 50, 4, "#ffd24d") + szikra(60, 100, 3.5, "#ffd24d") + szikra(150, 20, 3.5, "#ffd24d") + '</g>' })
  };
})();
/* ── FAROKDÍSZEK (újrarajzolva, 2026-09-26, farokdiszek-uj-rajzterv.html) ──
   A farok nagy része a test MÖGÉ bújik; a látható csík a far bal oldalán ~(44–82, 160–290).
   A díszek ide, a látható farokrészre ülnek (a régi a far tetején, a testen volt).
   Egy tábla: a ruhaSVG ÉS a bolti polckép (POLC_POZ) is innen rajzol. */
var FAROK_DISZ = (function () {
  function csillag5(cx, cy, R, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; p.push((cx + q * Math.cos(a)).toFixed(1) + " " + (cy + q * Math.sin(a)).toFixed(1)); } return "M" + p.join(" L") + " Z"; }
  function szikra(cx, cy, r, fill) { return '<path d="M' + cx + ' ' + (cy - r) + ' Q' + cx + ' ' + cy + ' ' + (cx + r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + r) + ' Q' + cx + ' ' + cy + ' ' + (cx - r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>'; }
  function csengo(x, y, sc) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' +
      '<circle cx="0" cy="-1" r="2.2" fill="none" stroke="#c9912a" stroke-width="1.6"/>' +
      '<path d="M0 1 C-5.5 1 -7 5 -7 10 L-7.5 13.5 Q-9 15 -9.5 16.5 L9.5 16.5 Q9 15 7.5 13.5 L7 10 C7 5 5.5 1 0 1 Z" fill="#ffd24d" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M-8.6 15.2 L8.6 15.2" stroke="#e8a92e" stroke-width="1.6"/>' +
      '<path d="M-3.5 5 Q-5 9 -4.6 13" fill="none" stroke="#fff6c8" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="0" cy="19" r="2.4" fill="#e0a52e" stroke="#222" stroke-width="1.1"/></g>';
  }
  function pant(d) { return '<path d="' + d + '" fill="none" stroke="#222" stroke-width="7.2" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#c9a8e6" stroke-width="4.6" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#e6d5f5" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="0.1 5"/>'; }
  return {
    "farok-a":
      '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' +
      '<path d="M44 185 Q62 193 82 187 L82 195 Q62 201 45 193 Z" fill="#ee8fb5"/>' +
      '<path d="M60 196 C57 206 52 214 46 223 L52.5 222.5 L54.5 229 C60 219 63.5 208 64 197 Z" fill="#ee8fb5"/>' +
      '<path d="M66 196 C68 206 72 215 75 225 L68.8 223 L65.5 228.5 C64.5 217 64 207 62.5 197 Z" fill="#f6a5c0"/>' +
      '<path d="M63 192 C52 176 36 177 38.5 190 C40 201 54 201 63 192 Z" fill="#f6a5c0"/>' +
      '<path d="M63 192 C74 176 90 177 87.5 190 C86 201 72 201 63 192 Z" fill="#f6a5c0"/>' +
      '<path d="M60 191 C53 185 46 186 45.5 190.5 C46 194.5 53 195 60 191 Z" fill="#e57aa6" stroke="none"/>' +
      '<path d="M66 191 C73 185 80 186 80.5 190.5 C80 194.5 73 195 66 191 Z" fill="#e57aa6" stroke="none"/>' +
      '<rect x="58.5" y="186.5" width="9" height="11" rx="3.6" fill="#e88bb4"/>' +
      '<path d="M61 189 q2 3 0 6 M65 189 q-2 3 0 6" fill="none" stroke="#c9679a" stroke-width="1"/>' +
      '<path d="M42 186 q3 -5 9 -4.5 M78 182 q5 0 7.5 3.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>' +
      '</g>',
    "farok-k":
      '<g>' +
      pant("M43 190 Q62 199 82 192") +
      csengo(62, 196, 1.45) +
      '<g fill="#b58fd8" stroke="none"><path d="M33 208 l0 -9 l6 -2 l0 9" stroke="#b58fd8" stroke-width="1.4" fill="none"/><ellipse cx="31.5" cy="208.5" rx="2.4" ry="1.8"/><ellipse cx="37.5" cy="206.5" rx="2.4" ry="1.8"/>' +
      '<path d="M86 214 l0 -8" stroke="#b58fd8" stroke-width="1.4"/><path d="M86 206 q4 1 4 5" stroke="#b58fd8" stroke-width="1.4" fill="none"/><ellipse cx="84.3" cy="214.4" rx="2.4" ry="1.8"/></g>' +
      '</g>',
    "farok-r":
      '<g stroke-linejoin="round">' +
      '<circle cx="60" cy="192" r="13" fill="#fff2c4" opacity=".6"/>' +
      '<path d="' + csillag5(60, 192, 10.5, 4.6) + '" fill="#ffd24d" stroke="#222" stroke-width="1.5"/>' +
      '<path d="M56.6 189 l2 -3.5" stroke="#fff6c8" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="' + csillag5(52, 232, 6.5, 2.8) + '" fill="#ffe08a" stroke="#222" stroke-width="1.2"/>' +
      '<path d="' + csillag5(44, 272, 5, 2.2) + '" fill="#ffd24d" stroke="#222" stroke-width="1.1"/>' +
      szikra(70, 212, 4.5, "#ffffff") + szikra(45, 212, 3.5, "#ffe08a") + szikra(64, 250, 4, "#ffffff") +
      szikra(38, 250, 3, "#ffe08a") + szikra(56, 286, 3.5, "#ffffff") + szikra(30, 292, 5, "#ffd24d") +
      szikra(20, 308, 3.5, "#ffe08a") +
      '<circle cx="66" cy="228" r="1.8" fill="#ff9ec4"/><circle cx="40" cy="232" r="1.6" fill="#b39af0"/><circle cx="58" cy="266" r="1.7" fill="#a7d8f2"/>' +
      '<circle cx="36" cy="282" r="1.8" fill="#ff9ec4"/><circle cx="26" cy="302" r="1.5" fill="#b39af0"/><circle cx="12" cy="316" r="1.3" fill="#ffd24d"/>' +
      '</g>'
  };
})();
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

    /* ── HÁT ── a HAT_DISZ táblából (a sörényt az unikornisSVG rajzolja fölé) */
    case "hat-a": case "hat-k": case "hat-r":
      return HAT_DISZ[itemId];

    /* ── LÁB ── mind a 4 lábra, a UNI_LABAK-ból (pata-rajzterv): a bokapánt a csüdön, a pata fölött;
       a patkó vékony csík a pata talpán, hogy a pata színe (később a körömlakk) látsszon */
    case "lab-a": case "lab-k": case "lab-r":
      s = '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">';
      UNI_LABAK.forEach(function (L) { s += labDiszSVG(itemId, L); });
      return s + '</g>';

    /* ── OLDAL (szárny) ── a SZARNY_DISZ táblából: széles váll-tő a hát tetején, fölfelé-hátra nyílik */
    case "oldal-a": case "oldal-k": case "oldal-r":   /* Pihe-szárny · Szivárvány-szárny · Fény-szárny */
      return SZARNY_DISZ[itemId];

    /* ── FAROK ── a farok tövénél (hátul-balra) */
    /* a farok-tő ~(92,150) köré, -15°-kal a farok irányába döntve (rajzoló session, 2026-09-05; §3.1.3) */
    case "farok-a": case "farok-k": case "farok-r":   /* Szalagcsokor · Csengettyű · Üstökös — FAROK_DISZ tábla */
      return FAROK_DISZ[itemId];
  }
  return "";
}
/* Egy láb dísze (bokapánt a csüdön / patkó-csík a pata talpán) egy láb-négyszögre
   ([bal-felső, jobb-felső, jobb-alsó, bal-alsó]). Oldalról a UNI_LABAK, szemből/hátulról a
   NEZET_LABAK lábaira ugyanez rajzol — egy forrás. */
function labDiszSVG(itemId, L) {
  var s = "", yb = L[2][1], bl = L[3][0] - 3.5, br = L[2][0] + 3.5, cx = (bl + br) / 2;
  if (itemId === "lab-a") {
    var y = yb - PATA_MAG - 10, sz = labSzel(L, y + 4);
    s += '<rect x="' + uniK(sz[0] - 1.5) + '" y="' + y + '" width="' + uniK(sz[1] - sz[0] + 3) + '" height="8" rx="2.5" fill="#a7d99a"/>' +
         '<path d="M' + uniK((sz[0] + sz[1]) / 2) + ' ' + y + ' l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>';
  } else {
    s += '<path d="M' + uniK(bl) + ' ' + (yb - 0.5) + ' L' + uniK(br) + ' ' + (yb - 0.5) + ' L' + uniK(br - 1) + ' ' + (yb + 4) + ' L' + uniK(bl + 1) + ' ' + (yb + 4) + ' Z" fill="' + (itemId === "lab-k" ? "#cfd6de" : "#f4b8d8") + '" stroke-width="1.3"/>';
    if (itemId === "lab-k") [-6, 0, 6].forEach(function (d) { s += '<circle cx="' + uniK(cx + d) + '" cy="' + (yb + 1.8) + '" r="1.1" fill="#fff" stroke="none"/>'; });
    else s += '<path d="M' + uniK(br + 5) + ' ' + (yb - 11) + ' l1.6 3.4 l3.4 1.2 l-3.4 1.4 l-1.6 3.4 l-1.6 -3.4 l-3.4 -1.4 l3.4 -1.2 Z" fill="#fff6d8" stroke="#e8a0c8" stroke-width=".8"/>';
  }
  return s;
}
/* ── A DÍSZEK SZEMBŐL ÉS HÁTULRÓL (unikornis pózok 1b, terv/diszek-nezetek-rajzterv.html) ──
   NEZET_DISZ[nezet][dísz-id] = { réteg: SVG } — a nézet-rajz (unikornisFrontArt/BackArt) ezekbe a
   rétegekbe teszi, így a dísz a megfelelő testrész elé/mögé kerül:
     mogott (csak szemből: a test mögött) · farok · labH (hátsó lábpár) · labE (elülső lábpár) ·
     test (hát-takaró; a sörény rá omlik) · nyak · veg (legfelül)
   Ugyanazok a színek és formák, mint oldalról (HAT_DISZ, SZARNY_DISZ, FAROK_DISZ, ruhaSVG):
   ► a szárny és a láb rajza NEM másolat — a szárny a SZARNY_DISZ tükrözve, a láb a labDiszSVG.
   Szemből a farokdísz a test mögé bújik: csak ami kilóg belőle, az látszik (hangjegy, szikrák). */
var NEZET_DISZ = (function () {
  var TUKOR = "matrix(-1 0 0 1 380 0)";   /* tükör a függőleges középvonalra (x = 190) */
  function f1(n) { return +n.toFixed(1); }
  function ketoldal(bal) { return bal + '<g transform="' + TUKOR + '">' + bal + '</g>'; }
  function csillag5(cx, cy, R, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; p.push(f1(cx + q * Math.cos(a)) + " " + f1(cy + q * Math.sin(a))); } return "M" + p.join(" L") + " Z"; }
  function szikra(cx, cy, r, fill) { return '<path d="M' + cx + ' ' + (cy - r) + ' Q' + cx + ' ' + cy + ' ' + (cx + r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + r) + ' Q' + cx + ' ' + cy + ' ' + (cx - r) + ' ' + cy + ' Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>'; }
  function kvad(a, k, b, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * k[0] + t * t * b[0], u * u * a[1] + 2 * u * t * k[1] + t * t * b[1]]; }

  /* ── FEJ ── a fej teteje szemből/hátulról: fej-kör (190,88) r42, szarv-tő y≈60, a szem y76-tól */
  function koszoru() {   /* virágkoszorú a szarv töve körül (hátulról ugyanígy látszik) */
    var v = [[158, 76, 7, "#f6a5c0"], [173, 63, 7, "#fce49a"], [190, 58, 7.5, "#a7d99a"], [207, 63, 7, "#9ec9f0"], [222, 76, 7, "#c9a8e6"]];
    return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
      '<path d="M156 80 Q190 38 224 80" fill="none" stroke="#a7d99a" stroke-width="2" opacity="0.7"/>' +
      v.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + c[3] + '"/>'; }).join("") +
      '</g><g fill="#ffd24d">' + v.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="2.3"/>'; }).join("") + '</g>';
  }
  function szarvCsillag(csucs, vonalak) {   /* arany szikra-csóva a szarv köré + csillag a csúcson */
    return '<g fill="none" stroke-linecap="round">' + vonalak.map(function (v) { return '<path d="' + v[0] + '" stroke="#e6c34d" stroke-width="' + v[1] + '"/>'; }).join("") + '</g>' +
      '<path d="M190 ' + csucs + ' l3.5 9 l9.5 0.7 l-7.5 6 l2.8 9.2 l-8.3 -5.4 l-8.3 5.4 l2.8 -9.2 l-7.5 -6 l9.5 -0.7 Z" fill="#ffd24d" stroke="#222" stroke-width="1"/>';
  }
  var KORONA = "M156 70 L157 54 L167 61 L174 48 L182 58 L190 44 L198 58 L206 48 L213 61 L223 54 L224 70 Q190 80 156 70 Z";

  /* ── NYAK ── szemből a mellkason (a fej alatt), hátulról a tarkón (a sörény rá omlik) */
  function gyongyok(a, k, b, n, r) {
    var s = "";
    for (var i = 0; i <= n; i++) { var p = kvad(a, k, b, i / n); s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + r + '" fill="#ffd24d"/>'; }
    return s;
  }

  /* ── HÁT ── szemből: a takaró két oldala lelóg a test két szélén; hátulról: a hát teteje */
  var OLDAL = "M146 122 C120 124 102 142 98 170 L96 204 Q106 212 118 206 L132 200 C126 172 130 144 152 128 Z";
  var OLDAL_HOSSZU = "M146 122 C120 124 100 142 96 172 L92 216 Q100 222 108 216 Q118 222 128 214 L134 200 C126 172 130 144 152 128 Z";
  var HAT = "M116 150 C120 130 150 121 190 121 C230 121 260 130 264 150 L268 198 Q230 214 190 212 Q150 214 112 198 Z";
  var HAT_SAV = "M113 189 Q150 205 190 203 Q230 205 267 189 L268 198 Q230 214 190 212 Q150 214 112 198 Z";
  var HAT_HOSSZU = "M116 150 C120 130 150 121 190 121 C230 121 260 130 264 150 L272 222 Q260 232 248 224 Q236 234 222 226 Q206 236 190 228 Q174 236 158 226 Q144 234 132 224 Q120 232 108 222 Z";
  function bojt(x, y) {   /* arany bojt (mint oldalról a hímzett nyeregtakarón) */
    return '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
      '<path d="M' + x + ' ' + (y - 2) + ' L' + x + ' ' + (y + 4) + '" stroke="#c9912a" stroke-width="1.6"/>' +
      '<path d="M' + x + ' ' + (y + 3) + ' C' + (x - 5) + ' ' + (y + 3) + ' ' + (x - 6) + ' ' + (y + 10) + ' ' + (x - 5) + ' ' + (y + 16) + ' L' + (x + 5) + ' ' + (y + 16) + ' C' + (x + 6) + ' ' + (y + 10) + ' ' + (x + 5) + ' ' + (y + 3) + ' ' + x + ' ' + (y + 3) + ' Z" fill="#ffd24d"/>' +
      '<circle cx="' + x + '" cy="' + (y + 3) + '" r="2.4" fill="#e0a52e"/></g>';
  }
  function virag(x, y, r) {   /* 5 szirmú hímzett virág (hat-k) */
    var s = '<g stroke="#222" stroke-width="1.2">';
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += '<circle cx="' + f1(x + Math.cos(a) * r * 1.3) + '" cy="' + f1(y + Math.sin(a) * r * 1.3) + '" r="' + r + '" fill="#f6a5c0"/>'; }
    return s + '<circle cx="' + x + '" cy="' + y + '" r="' + f1(r * 0.85) + '" fill="#ffd24d"/></g>';
  }
  function hullamAlj(n, d) {   /* csipkés alj hátulról: kis félkörök a HAT alsó éle mentén */
    var s = "";
    for (var i = 0; i <= n; i++) {
      var t = i / n, p = t < 0.5 ? kvad([112, 198], [150, 214], [190, 212], t * 2) : kvad([190, 212], [230, 214], [268, 198], t * 2 - 1);
      s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1] + d) + '" r="5"/>';
    }
    return s;
  }

  /* ── SZÁRNY ── a SZARNY_DISZ rajza: a váll-tő (180,106) a test bal vállára (156,138) kerül, kicsit
     keskenyebbre véve (szemből rövidül), a jobb szárny ennek tükre. Szemből a test mögött, hátulról előtte. */
  function szarnyPar(id) {
    return ketoldal('<g transform="translate(26.4 51.1) scale(.72 .82)">' + SZARNY_DISZ[id] + '</g>');
  }

  /* ── FAROK ── hátulról a farok teteje (190, ~240), a takaró és a lábak előtt */
  function hangjegy(x, y) {   /* a csengettyű kis hangjegye (FAROK_DISZ farok-k) */
    return '<g fill="#b58fd8" stroke="none" transform="translate(' + (x - 33) + ' ' + (y - 208) + ')"><path d="M33 208 l0 -9 l6 -2 l0 9" stroke="#b58fd8" stroke-width="1.4" fill="none"/><ellipse cx="31.5" cy="208.5" rx="2.4" ry="1.8"/><ellipse cx="37.5" cy="206.5" rx="2.4" ry="1.8"/></g>';
  }
  var UST_SZIKRAK = szikra(122, 258, 4.5, "#ffffff") + szikra(108, 282, 3.5, "#ffe08a") + szikra(262, 262, 4, "#ffffff") + szikra(276, 288, 5, "#ffd24d") +
    '<circle cx="118" cy="300" r="1.7" fill="#ff9ec4"/><circle cx="268" cy="306" r="1.6" fill="#b39af0"/>';

  return {
    elol: {
      "fej-a": { veg: koszoru() },
      "fej-k": { veg: szarvCsillag(0, [["M177 58 Q192 56 202 50", 4.5], ["M181 42 Q192 40 199 34", 4]]) },
      "fej-r": { veg: '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round"><path d="' + KORONA + '" fill="#d9c7ec"/>' +
        '<path d="M190 48 a9 9 0 1 0 6.2 15.4 a7.2 7.2 0 1 1 -6.2 -15.4 Z" fill="#fdf0d0" stroke="#c9a8e6" stroke-width="1"/></g>' +
        '<circle cx="165" cy="64" r="2.2" fill="#ffd24d"/><circle cx="215" cy="64" r="2.2" fill="#9ec9f0"/>' },
      "nyak-a": { nyak: '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M160 120 Q190 150 220 120" fill="none" stroke="#8a6a4a" stroke-width="4.5"/>' +
        '<circle cx="169" cy="127.6" r="2.6" fill="#a9814e"/><circle cx="211" cy="127.6" r="2.6" fill="#a9814e"/>' +
        '<ellipse cx="190" cy="150" rx="8.5" ry="10.5" fill="#c08a52"/>' +
        '<path d="M180 144 q10 -8 20 0 l0 -4 q-10 -6 -20 0 Z" fill="#8a6a4a"/><path d="M190 138 v-5" stroke="#8a6a4a" stroke-width="2.4"/></g>' },
      "nyak-k": { nyak: '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M158 118 Q190 158 222 118" fill="none" stroke="#c9a06a" stroke-width="2" opacity="0.4"/>' + gyongyok([158, 118], [190, 158], [222, 118], 6, 3) +
        '<g transform="translate(-76 -38)"><path d="M266 177.5 L266 187.5" stroke="#222" stroke-width="3.2" stroke-linecap="round"/><path d="M266 178.5 L266 186.5" stroke="#ffd24d" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M266 191.5 C263 186.5 255 187.5 255 193.5 C255 200.5 266 207.5 266 207.5 C266 207.5 277 200.5 277 193.5 C277 187.5 269 186.5 266 191.5 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.6"/>' +
        '<ellipse cx="261" cy="195.5" rx="2.4" ry="3.6" fill="#fdf4d8" opacity="0.9" stroke="none"/>' +
        '<path d="M279 189 l1.5 3.6 l3.6 1.5 l-3.6 1.5 l-1.5 3.6 l-1.5 -3.6 l-3.6 -1.5 l3.6 -1.5 Z" fill="#fff2c4" stroke="none"/></g></g>' },
      "nyak-r": { nyak: '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M156 116 Q190 136 224 116 L222 126 Q190 148 158 126 Z" fill="#f6a5c0"/>' +
        '<path d="M175 134 L190 174 L205 134 Z" fill="#f6a5c0"/>' +
        '<path d="M178 143 L202 143" stroke="#fce49a" stroke-width="3.4"/><path d="M181 152 L199 152" stroke="#a7d99a" stroke-width="3.2"/><path d="M185 161 L195 161" stroke="#9ec9f0" stroke-width="3"/></g>' },
      "hat-a": { test: ketoldal('<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<g fill="#d9c4f0"><circle cx="99" cy="207" r="4"/><circle cx="108" cy="211" r="4"/><circle cx="117" cy="209" r="4"/><circle cx="126" cy="205" r="4"/></g>' +
        '<path d="' + OLDAL + '" fill="#f9c9dc"/><path d="M97 192 L132 187 L132 200 L118 206 Q106 212 96 204 Z" fill="#d9c4f0"/></g>' +
        '<path d="M104 160 Q118 154 134 150" fill="none" stroke="#e79bbb" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round"/>' +
        '<g fill="#fff"><circle cx="112" cy="147" r="3.2"/><circle cx="112" cy="176" r="3.2"/></g>') },
      "hat-k": { test: ketoldal('<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><path d="' + OLDAL + '" fill="#d9577e"/></g>' +
        '<path d="M138 130 C118 138 106 154 104 174 L102 197 L126 193" fill="none" stroke="#ffd24d" stroke-width="3.4" stroke-linejoin="round"/>' +
        '<path d="M138 130 C118 138 106 154 104 174 L102 197 L126 193" fill="none" stroke="#b8323f" stroke-width="1.2" stroke-dasharray="1.5 3.5"/>' +
        virag(114, 166, 3.6) + bojt(97, 203)) },
      "hat-r": { test: ketoldal('<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><path d="' + OLDAL_HOSSZU + '" fill="#4b3f9a"/>' +
        '<path d="M146 122 C120 124 100 142 96 172 L92 216 Q96 219 100 219 C100 186 108 150 138 127 Z" fill="#8f7ad6"/></g>' +
        '<path d="M94 212 Q100 220 108 214 Q118 220 128 212" fill="none" stroke="#ffd24d" stroke-width="2.4" stroke-linecap="round"/>' +
        '<g fill="#ffd24d" stroke="#222" stroke-width="1"><path d="' + csillag5(114, 166, 6.5, 2.8) + '"/></g>' +
        '<g stroke="none">' + szikra(108, 192, 3, "#fff6d8") + szikra(124, 140, 2.6, "#fff6d8") + '</g>') },
      "oldal-a": { mogott: szarnyPar("oldal-a") }, "oldal-k": { mogott: szarnyPar("oldal-k") }, "oldal-r": { mogott: szarnyPar("oldal-r") },
      "farok-a": {},   /* a szalagcsokor a test mögött van — szemből nem látszik */
      "farok-k": { mogott: hangjegy(104, 246) + hangjegy(270, 238) },
      "farok-r": { mogott: '<g stroke-linejoin="round">' + UST_SZIKRAK + '</g>' }
    },
    hatul: {
      "fej-a": { veg: koszoru() },
      "fej-k": { veg: szarvCsillag(6, [["M181 52 Q191 50 199 45", 4.5], ["M184 38 Q191 37 196 32", 4]]) },
      "fej-r": { veg: '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round"><path d="' + KORONA + '" fill="#d9c7ec"/></g>' +
        '<circle cx="165" cy="64" r="2.2" fill="#9ec9f0"/><circle cx="190" cy="68" r="2.6" fill="#ffd24d"/><circle cx="215" cy="64" r="2.2" fill="#ffd24d"/>' },
      "nyak-a": { nyak: '<g stroke="#222" stroke-width="1.6"><path d="M158 116 Q190 138 222 116" fill="none" stroke="#8a6a4a" stroke-width="4.5"/>' +
        '<circle cx="166" cy="123" r="2.6" fill="#a9814e"/><circle cx="214" cy="123" r="2.6" fill="#a9814e"/></g>' },
      "nyak-k": { nyak: '<g stroke="#222" stroke-width="1.4"><path d="M158 116 Q190 138 222 116" fill="none" stroke="#c9a06a" stroke-width="2" opacity="0.4"/>' + gyongyok([158, 116], [190, 138], [222, 116], 6, 3) + '</g>' },
      "nyak-r": { nyak: '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round"><path d="M154 114 Q190 134 226 114 L224 125 Q190 146 156 125 Z" fill="#f6a5c0"/>' +
        '<path d="M156 120 Q190 141 224 120" fill="none" stroke="#fce49a" stroke-width="2.6"/></g>' },
      "hat-a": { test: '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><g fill="#d9c4f0">' + hullamAlj(10, 1) + '</g>' +
        '<path d="' + HAT + '" fill="#f9c9dc"/><path d="' + HAT_SAV + '" fill="#d9c4f0"/></g>' +
        '<g fill="none" stroke="#e79bbb" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round"><path d="M122 160 Q190 140 258 160"/><path d="M118 184 Q190 168 262 184"/></g>' +
        '<g fill="#fff"><circle cx="134" cy="148" r="3.4"/><circle cx="132" cy="174" r="3.4"/><circle cx="246" cy="148" r="3.4"/><circle cx="248" cy="174" r="3.4"/></g>' +
        '<path d="M124 140 Q150 126 180 124" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>' },
      "hat-k": { test: '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><path d="' + HAT + '" fill="#d9577e"/></g>' +
        '<path d="M122 154 C126 138 152 130 190 130 C228 130 254 138 258 154 L261 192 Q228 204 190 203 Q152 204 119 192 Z" fill="none" stroke="#ffd24d" stroke-width="3.4" stroke-linejoin="round"/>' +
        '<path d="M122 154 C126 138 152 130 190 130 C228 130 254 138 258 154 L261 192 Q228 204 190 203 Q152 204 119 192 Z" fill="none" stroke="#b8323f" stroke-width="1.2" stroke-dasharray="1.5 3.5"/>' +
        virag(138, 170, 5) + virag(242, 170, 5) + bojt(114, 197) + bojt(190, 210) + bojt(266, 197) },
      "hat-r": { test: '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round"><path d="' + HAT_HOSSZU + '" fill="#4b3f9a"/></g>' +
        '<g fill="none" stroke="#3a3080" stroke-width="2" stroke-linecap="round"><path d="M134 160 Q130 190 128 218 M246 160 Q250 190 252 218"/></g>' +
        '<path d="M120 146 C126 132 152 125 190 125 C228 125 254 132 260 146" fill="none" stroke="#ffd24d" stroke-width="3.4" stroke-linecap="round"/>' +
        '<path d="M110 218 Q120 228 132 220 Q144 230 158 222 Q174 232 190 224 Q206 232 222 222 Q236 230 248 220 Q260 228 270 218" fill="none" stroke="#ffd24d" stroke-width="2.4" stroke-linecap="round"/>' +
        '<g fill="#ffd24d" stroke="#222" stroke-width="1"><path d="' + csillag5(140, 176, 8, 3.4) + '"/><path d="' + csillag5(242, 168, 6, 2.6) + '"/><path d="' + csillag5(250, 204, 5.5, 2.4) + '"/><path d="' + csillag5(128, 206, 5, 2.2) + '"/></g>' +
        '<g stroke="none">' + szikra(124, 150, 3.2, "#fff6d8") + szikra(256, 140, 3.2, "#fff6d8") + szikra(150, 200, 3, "#fff6d8") + szikra(232, 196, 2.6, "#ffd24d") + '</g>' },
      "oldal-a": { nyak: szarnyPar("oldal-a") }, "oldal-k": { nyak: szarnyPar("oldal-k") }, "oldal-r": { nyak: szarnyPar("oldal-r") },
      "farok-a": { farok: '<g transform="translate(127 54)">' + FAROK_DISZ["farok-a"] + '</g>' },
      "farok-k": { farok: '<g transform="translate(128 46)">' + FAROK_DISZ["farok-k"] + '</g>' },
      "farok-r": { farok: '<g stroke-linejoin="round"><circle cx="190" cy="244" r="13" fill="#fff2c4" opacity=".6"/>' +
        '<path d="' + csillag5(190, 244, 10.5, 4.6) + '" fill="#ffd24d" stroke="#222" stroke-width="1.5"/><path d="M186.6 241 l2 -3.5" stroke="#fff6c8" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="' + csillag5(180, 276, 6.5, 2.8) + '" fill="#ffe08a" stroke="#222" stroke-width="1.2"/><path d="' + csillag5(170, 306, 5, 2.2) + '" fill="#ffd24d" stroke="#222" stroke-width="1.1"/>' +
        szikra(202, 262, 4.5, "#ffffff") + szikra(174, 258, 3.5, "#ffe08a") + szikra(196, 290, 4, "#ffffff") + szikra(160, 288, 3, "#ffe08a") + szikra(186, 314, 3.5, "#ffffff") + szikra(156, 316, 4, "#ffd24d") +
        '<circle cx="198" cy="276" r="1.8" fill="#ff9ec4"/><circle cx="166" cy="272" r="1.6" fill="#b39af0"/><circle cx="178" cy="296" r="1.7" fill="#a7d8f2"/></g>' }
    }
  };
})();
/* a lábdíszek: mindkét nézetben ugyanaz a labDiszSVG a NEZET_LABAK lábain (a hátsó pár halványabb) */
["elol", "hatul"].forEach(function (nz) {
  ["lab-a", "lab-k", "lab-r"].forEach(function (id) {
    function par(p) { return NEZET_LABAK[p].map(function (L) { return labDiszSVG(id, L); }).join(""); }
    NEZET_DISZ[nz][id] = { labH: '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round" opacity=".7">' + par("hatso") + '</g>',
                           labE: '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' + par("elso") + '</g>' };
  });
});
/* a felvett díszek (oltozet) rétegekbe gyűjtve, a nézet-rajznak (ugyanaz a sorrend, mint oldalról).
   Minden dísz egy „tiszta” csoportba kerül: a nézet-rajz fekete körvonalát nem örökli, így pontosan
   úgy rajzolódik, mint oldalról (ott a ruha a test csoportján kívül van). */
function nezetDiszRetegek(nezet, oltozet) {
  var r = {}, tabla = NEZET_DISZ[nezet];
  if (!oltozet || !tabla) return r;
  ["hat", "farok", "oldal", "lab", "nyak", "fej"].forEach(function (h) {
    var e = oltozet[h] && tabla[oltozet[h]];
    if (e) Object.keys(e).forEach(function (k) { r[k] = (r[k] || "") + '<g stroke="none" stroke-linejoin="miter" stroke-linecap="butt">' + e[k] + '</g>'; });
  });
  return r;
}

/* ERDEI ÖSVÉNY — az egyképernyős térkép (Rajt → Cél egyszerre látszik) a közös ösvény-vázon (osveny.js);
   itt csak a díszlet: ég, dombok, fák a kereten, bagoly, a földút és az állomás-táblák. */
function erdoHatterSVG() {
  var s = '<defs><linearGradient id="tu-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdeaf7"/><stop offset="0.6" stop-color="#dff2e2"/><stop offset="1" stop-color="#eaf6df"/></linearGradient></defs>' +
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
  return s;
}
function jelenetSVG(palya, lenyKulcs) {
  var c = LENYEK[lenyKulcs];
  if (palya.muhely) return muhelyJelenetSVG(palya, c);       /* mérés-ligetek: műhely-ösvény (meres.js) */
  if (palya.konyvtar) return konyvtarJelenetSVG(palya, c);   /* 📚 Bagolykönyvtár: olvasóasztalok (konyvtar.js) */
  if (palya.vasar) return vasarJelenetSVG(palya, c);         /* 🧺 Tündérvásár: sátrak a vásártéren (vasar.js) */
  return osvenyVaz(palya, c, {
    hatter: erdoHatterSVG(),
    ut: function (d) {   /* az út: árnyék + test + világos szegély */
      return '<path d="' + d + '" transform="translate(4,10)" fill="none" stroke="#3b6a30" stroke-width="34" stroke-linecap="round" opacity="0.16"/>' +
        '<path d="' + d + '" fill="none" stroke="#d9b48a" stroke-width="30" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#f0dcb0" stroke-width="20" stroke-linecap="round"/>';
    },
    elotte: function (px, py) {   /* Rajt-zászló + állomás-táblák */
      var s = '', n = px.length;
      for (var i = 0; i < n - 1; i++) {
        var ax = px[i], ay = py[i];
        if (i === 0) s += '<g transform="translate(' + ax + ',' + ay + ')"><circle r="15" fill="#a7d99a" stroke="#222" stroke-width="2"/>' +
          '<path d="M0 -24 L0 -2" stroke="#8f6a3e" stroke-width="3"/><path d="M0 -24 L15 -17 L0 -10 Z" fill="#f6a5c0"/></g>';
        else s += '<g transform="translate(' + ax + ',' + (ay - 44) + ')">' +
          '<rect x="-58" y="-16" width="116" height="32" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
          '<text x="0" y="5" font-size="14" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[i].nev) + '</text></g>' +
          '<rect x="' + (ax - 4) + '" y="' + (ay - 30) + '" width="8" height="30" fill="#b79c86"/>' +
          '<circle cx="' + ax + '" cy="' + ay + '" r="14" fill="#f6c85a" stroke="#222" stroke-width="2"/>';
      }
      return s;
    },
    pipaKicsi: true, pipaElobb: true,
    odu: { arnyek: "#2f4a3a", arnyekOp: "0.3", csillag: [-86, 9] }
  });
}
function kiiras(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }


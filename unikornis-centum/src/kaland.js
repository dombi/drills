/* ============ 6l) 🗺️ KALANDTÉRKÉP — a kissárkány nyomában (visszahívás 4. kör, 2026-10-06) ============
   Terv: terv/visszahivas-rendszerterv.html („A kissárkány nyomában”) + terv/visszahivas-rajzterv.html (A rész, jóváhagyva).
     • A fióka egy szivárványpillangó után elröppen (leny.js: lenyElroppenes), és bújócskázik. A lila bagoly hozza a
       térképet (kalandBagoly) — innen a kalandtérkép az odúból nyílik: a fészekben hagyott térkép-tekercsre koppintva.
     • A térkép egy KÜLÖN mesevilág (nem a ligetek térképe), 12 tájjal; a közös térkép-modul rajzolja (terkep.js:
       terkepRajzol, terkepSetal — ugyanaz a sétáló unikornis). Ebben új: a felhő-réteg, a nyomok és a barlang.
     • BÁRMELYIK végigjátszott pálya után 1 felhő jár (kalandFelhoJar, a lenyPalyaVege hívja), naponta legfeljebb
       KALAND_FELHO_NAP (3). A gyerek maga választja ki, melyiket fújja el — csak a kitisztult rész mellettieket (arany fény).
       Ami kitisztult, SOHA nem felhősödik vissza.
     • Minden tájon nyom: lábnyomok a kissárkány útja felé (KALAND_UT), 6 képeslap (→ album), 2 fényes pikkely
       (→ a Kincsvitrinre, odu.js: lenyPikkelyVitrin). A Holdfény-barlang felhője csak a többi 11 után nyílik meg,
       kilógó szíves farokkal; ott alszik, és kölyökként ébred → együtt sétálnak haza (fazis „kolyok”).
   Mentés: P().leny2.terkep = { tiszta: [id…], jog, napi: { nap, db }, hol, bagoly }, .kepeslap: [táj-id], .pikkely: [táj-id].
   Új táj = egy sor a KALAND_TAJ-ban + egy hely a KALAND_TERKEP-ben + egy jelkép (KT_JELKEP). */

var KALAND_FELHO_NAP = 3;   /* naponta legfeljebb ennyi felhő (tervlap 4. döntés; később a pultról) */
/* a tájak: név, nyom (lap = képeslap, pik = pikkely, lab = csak lábnyom, veg = itt alszik), mondat, a folt színe */
var KALAND_TAJ = {
  k:    { nev: "Odú és kert", ny: "", mondat: "Innen indult a kaland.", szin: "#c4e6bc" },
  "1":  { nev: "Pillangós rét", ny: "lap", mondat: "Itt virágkoszorút font! Egy képeslapot is hagyott.", szin: "#c4e6bc" },
  "2":  { nev: "Suttogó erdő", ny: "lab", mondat: "Makkokat rakott sorba: egy, kettő, három, négy, öt!", szin: "#b9dea4" },
  "3":  { nev: "Bárányka-rét", ny: "lap", mondat: "Egy gombolyaggal játszott, és kicsit összegabalyodott! Képeslapot is rajzolt.", szin: "#f3d6e4" },
  "4":  { nev: "Buborék-forrás", ny: "pik", mondat: "Buborékot fújt a forrásból. Nézd, egy fényes pikkely!", szin: "#d8ccf2" },
  "5":  { nev: "Szélmalom-domb", ny: "lap", mondat: "Mézes kalácsot kóstolt a malomnál. Képeslapot is küldött!", szin: "#f7e3a8" },
  "6":  { nev: "Holdas dombok", ny: "lab", mondat: "Csillagokat számolt. Szikrás lábnyomok vezetnek tovább!", szin: "#d4c8ec" },
  "7":  { nev: "Körhinta-tisztás", ny: "lap", mondat: "Körhintázott a tisztáson! Ezt is megírta egy képeslapon.", szin: "#fbd3c4" },
  "8":  { nev: "Szivárvány-tó", ny: "pik", mondat: "Homokvárat épített a parton. Itt is elhagyott egy fényes pikkelyt!", szin: "#c3e3f4" },
  "9":  { nev: "Bagolyfa", ny: "lap", mondat: "A bagoly mesét olvasott neki. Képeslap is vár!", szin: "#c9dcb8" },
  "10": { nev: "Csillag-vízesés", ny: "lab", mondat: "Lezuhanyzott a vízesés alatt. Vizes lábnyomok!", szin: "#c8e0f4" },
  "11": { nev: "Kavics-hegy", ny: "lap", mondat: "Kirakót rakott a kövekből. Utolsó képeslap!", szin: "#ddd2ee" },
  "12": { nev: "Holdfény-barlang", ny: "veg", mondat: "Itt alszik összegömbölyödve.", szin: "#cbbfe4" }
};
var KALAND_IDK = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var KALAND_UT = ["1", "2", "4", "3", "5", "6", "8", "7", "9", "10", "11", "12"];   /* a kissárkány valódi útja: erre mutatnak a lábnyomok */
var KALAND_BARLANG = "12";

/* ── a mentés-ág ── */
function kalandTar(l) {
  l = l || lenyTar();
  var T = l.terkep;
  if (!Array.isArray(T.tiszta)) T.tiszta = [];
  if (typeof T.jog !== "number") T.jog = 0;
  if (typeof T.hol !== "string") T.hol = "k";
  if (typeof T.bagoly !== "number") T.bagoly = 0;
  if (!Array.isArray(l.kepeslap)) l.kepeslap = [];
  if (!Array.isArray(l.pikkely)) l.pikkely = [];
  return T;
}
function kalandTiszta(T, id) { return id === "k" || T.tiszta.indexOf(id) >= 0; }
/* a lenyPalyaVege hívja minden végigjátszott pálya végén (kaland fázisban): igaz, ha most jár egy felhő.
   A jog legfeljebb annyi, amennyit ma még el lehet fújni (napiMarad) — így naponta legfeljebb 3, és nem gyűlik halomba. */
function kalandFelhoJar(l) {
  var T = kalandTar(l);
  if (T.tiszta.length >= KALAND_IDK.length) return false;
  if (T.jog >= napiMarad(T, KALAND_FELHO_NAP)) return false;
  T.jog++;
  return true;
}
/* most elfújható-e felhő (a ligettérkép ☁️ jele, az aranyfény) */
function kalandFujhat(l) {
  var T = kalandTar(l);
  return T.jog > 0 && napiMarad(T, KALAND_FELHO_NAP) > 0 && T.tiszta.length < KALAND_IDK.length;
}

/* ════════════ A TÉRKÉP ADATAI (a közös térkép-modul alakjában, terkep.js) ════════════ */
function ktH(sz, al, magas, szel) { return { szeles: sz, allo: al, magas: magas, szel: szel }; }
var KALAND_TERKEP = {
  helyek: {
    k:    ktH([64, 394], [200, 742], 66, 46),
    "1":  ktH([168, 360], [106, 652], 44, 46), "2":  ktH([150, 180], [294, 640], 40, 44),
    "3":  ktH([282, 334], [94, 536], 40, 46),  "4":  ktH([270, 160], [300, 522], 38, 44),
    "5":  ktH([398, 372], [112, 420], 48, 46), "6":  ktH([392, 196], [290, 406], 44, 46),
    "7":  ktH([516, 332], [96, 304], 46, 46),  "8":  ktH([506, 152], [302, 294], 40, 46),
    "9":  ktH([626, 374], [116, 190], 54, 46), "10": ktH([628, 214], [292, 180], 44, 44),
    "11": ktH([724, 302], [110, 88], 44, 46),  "12": ktH([734, 112], [300, 78], 50, 48)
  },
  /* a térkép két ösvényből áll, keresztutakkal összekötve (létra): majdnem mindig két felhő közül lehet választani */
  utak: [["k", "1", 10], ["k", "2", -14], ["1", "2", 12], ["1", "3", -10], ["2", "4", 10], ["3", "4", -12], ["3", "5", 10], ["4", "6", -10],
         ["5", "6", 12], ["5", "7", -10], ["6", "8", 10], ["7", "8", -12], ["7", "9", 10], ["8", "10", -10], ["9", "10", 12], ["9", "11", -10],
         ["10", "11", 10], ["11", "12", -12]],
  elr: { szeles: { w: 800, h: 460, uni: 0.34, jk: 1, felho: 1.2 },
         allo:   { w: 400, h: 790, uni: 0.3, jk: 1, felho: 0.95 } },
  oldal: { szeles: { "11": -1, "12": -1 }, allo: { "2": -1, "4": -1, "6": -1, "8": -1, "10": -1, "12": -1 } },
  utRajz: function (d) { return '<path d="' + d + '" fill="none" stroke="#a8794c" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round" opacity=".6"/>'; }
};
function ktPoz(id, mod) { return KALAND_TERKEP.helyek[id][mod]; }
function ktSzomszed(id) {
  var r = [];
  KALAND_TERKEP.utak.forEach(function (u) { if (u[0] === id) r.push(u[1]); else if (u[1] === id) r.push(u[0]); });
  return r;
}
function ktElerheto(T, id) {
  if (kalandTiszta(T, id)) return false;
  if (id === KALAND_BARLANG && T.tiszta.length < KALAND_IDK.length - 1) return false;   /* a barlang csak a többi 11 után */
  return ktSzomszed(id).some(function (n) { return kalandTiszta(T, n); });
}
function ktKovetkezo(id) { var i = KALAND_UT.indexOf(id); return i >= 0 && i < KALAND_UT.length - 1 ? KALAND_UT[i + 1] : null; }
/* a járható háló: csak a kitisztult helyek és a köztük futó utak (a felhő alatt nem jár az unikornis) */
function ktJaroHalo(T) {
  var van = { k: true }, lathato = {};
  T.tiszta.forEach(function (id) { van[id] = true; });
  Object.keys(KALAND_TERKEP.helyek).forEach(function (id) { lathato[id] = true; });
  return { van: van, lathato: lathato, utak: KALAND_TERKEP.utak.filter(function (u) { return van[u[0]] && van[u[1]]; }) };
}

/* ── a tájak kis festett jelképei (rajzterv 5., változatlanul) — talppont (0,0) körül, kb. y=10-ig ── */
function ktLepke(x, y, s) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g><path d="M0 0q-8 -10 -11 -2q3 6 11 2z" fill="#f6a5c0" stroke="#8a6a7e" stroke-width=".8"/><path d="M0 0q8 -10 11 -2q-3 6 -11 2z" fill="#9ec9f0" stroke="#8a6a7e" stroke-width=".8"/>' +
    '<path d="M0 0q-6 7 -8 4q1 -4 8 -4z" fill="#fce49a" stroke="#8a6a7e" stroke-width=".8"/><path d="M0 0q6 7 8 4q-1 -4 -8 -4z" fill="#a7d99a" stroke="#8a6a7e" stroke-width=".8"/><path d="M0 -4v8" stroke="#5a4a6a" stroke-width="1.6" stroke-linecap="round"/>' +
    '<animateTransform attributeName="transform" type="scale" values="1 1;.35 1;1 1" dur=".3s" repeatCount="indefinite"/></g></g>';
}
var KT_JELKEP = {
  k: function () { return '<path d="M-40 10Q0 -6 40 10Z" fill="#bfe3a8"/><path d="M-12 8V-26h24V8Z" fill="#b98a5c" stroke="#7c5636" stroke-width="1.6"/><circle cx="0" cy="-40" r="26" fill="#a8dc9c" stroke="#6fae74" stroke-width="1.6"/><circle cx="-14" cy="-48" r="12" fill="#bfe8b0"/><path d="M-6 8V-6a6 6 0 0 1 12 0V8Z" fill="#7a4fa0"/><circle cx="3" cy="0" r="1.2" fill="#fce49a"/><circle cx="26" cy="4" r="3" fill="#f6a5c0"/><circle cx="32" cy="7" r="2.5" fill="#fce49a"/>'; },
  "1": function () { return '<path d="M-36 10Q0 -12 36 10Z" fill="#bfe3a8"/>' + [[-16, -2, "#f6a5c0"], [0, -9, "#fce49a"], [16, -1, "#c9a8e6"], [-26, 4, "#fff"], [26, 5, "#f7b8d0"]].map(function (f) { return '<path d="M' + f[0] + " " + (f[1] + 10) + "V" + f[1] + '" stroke="#6fae74" stroke-width="2"/><circle cx="' + f[0] + '" cy="' + f[1] + '" r="5" fill="' + f[2] + '" stroke="#c0567f" stroke-width=".8"/><circle cx="' + f[0] + '" cy="' + f[1] + '" r="1.6" fill="#ffd24d"/>'; }).join("") + ktLepke(10, -28, 1.1); },
  "2": function () { return [[-20, -10, 12, "#a8dc9c"], [0, -20, 15, "#8fcf8a"], [20, -8, 11, "#b9e2a6"]].map(function (f) { var x = f[0], y = f[1], r = f[2]; return '<path d="M' + (x - 2) + " 10V" + (y + r - 2) + 'h4V10Z" fill="#9a6f52"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f[3] + '" stroke="#6fae74" stroke-width="1.4"/><circle cx="' + lnF(x - r * 0.35) + '" cy="' + lnF(y - r * 0.35) + '" r="' + lnF(r * 0.35) + '" fill="#fff" opacity=".35"/>'; }).join(""); },
  "3": function () { return '<path d="M-36 10Q0 -8 36 10Z" fill="#c4e6bc"/><g transform="translate(-8 -8)"><path d="M-8 8v6M6 8v6" stroke="#4a3b5a" stroke-width="2.4" stroke-linecap="round"/>' + [[-8, -2, 8], [2, -6, 9], [10, 0, 7], [-2, 4, 8], [8, 6, 7]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fff" stroke="#c9bcd6" stroke-width="1.2"/>'; }).join("") + '<ellipse cx="18" cy="-4" rx="6" ry="7" fill="#4a3b5a"/><circle cx="20" cy="-6" r="1.3" fill="#fff"/></g><g transform="translate(22 -2)"><rect x="-6" y="-10" width="12" height="18" rx="2" fill="#f7b8d0" stroke="#c0567f"/><path d="M-6 -5h12M-6 0h12M-6 4h12" stroke="#c0567f" stroke-width=".8"/><path d="M6 -2q10 4 4 14" stroke="#e0699b" stroke-width="1.4" fill="none"/></g>'; },
  "4": function () { return '<ellipse cx="0" cy="4" rx="30" ry="9" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/><path d="M-30 6q-6 -10 6 -10M30 6q6 -10 -6 -10" fill="#b8b0c8" stroke="#8a7fa6" stroke-width="1.2"/>' + [[-6, -8, 4], [4, -18, 3], [-2, -28, 2.4], [10, -6, 3.4]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#e8f6ff" fill-opacity=".7" stroke="#9ec9f0"/>'; }).join("") + '<g transform="translate(-24 -4)"><path d="M-2 8V-2h4V8Z" fill="#fdf0d0"/><path d="M-10 -1Q0 -16 10 -1Z" fill="#c9a8e6" stroke="#8d6aa8" stroke-width="1.2"/><circle cx="-3" cy="-6" r="1.6" fill="#fff"/><circle cx="4" cy="-8" r="1.3" fill="#fff"/></g>'; },
  "5": function () { return '<path d="M-36 10Q0 -4 36 10Z" fill="#f2df9a"/><path d="M-8 10L-6 -28H6L8 10Z" fill="#fdf0d0" stroke="#b98a5c" stroke-width="1.6"/><path d="M-8 -28L0 -38L8 -28Z" fill="#e07aa3" stroke="#b05a80" stroke-width="1.2"/><g transform="translate(0 -26)"><g class="kt-malom"><path d="M0 0L-3 -22H3ZM0 0L22 -3V3ZM0 0L3 22H-3ZM0 0L-22 3V-3Z" fill="#f7b8d0" stroke="#c0567f" stroke-width="1"/><circle r="3" fill="#c0567f"/></g></g>' + [-26, -20, 20, 26].map(function (x) { return '<path d="M' + x + ' 10V-6" stroke="#d9a63a" stroke-width="1.6"/><ellipse cx="' + x + '" cy="-8" rx="2.4" ry="5" fill="#f0c04a"/>'; }).join(""); },
  "6": function () { return '<path d="M-38 10Q-20 -24 0 6Q18 -20 38 10Z" fill="#c9b8ea" stroke="#9483c2" stroke-width="1.4"/><path d="M14 -34a10 10 0 1 0 8 14a8 8 0 1 1 -8 -14Z" fill="#fff1b8" stroke="#e3a92a" stroke-width="1.2"/>' + lnCsillag(-18, -24, 4, "#ffd24d") + lnCsillag(-4, -32, 3, "#ffd24d") + lnCsillag(30, -10, 3, "#ffd24d"); },
  "7": function () { return '<path d="M-36 10Q0 -2 36 10Z" fill="#c4e6bc"/><path d="M-20 10L0 -26L20 10Z" fill="#fff" stroke="#e0699b" stroke-width="1.6"/><path d="M-10 10L0 -26L-4 10ZM4 10L0 -26L12 10Z" fill="#f7b8d0"/><path d="M0 -26V-36l10 4l-10 4" fill="#fce49a" stroke="#c9a032" stroke-width="1"/><path d="M-36 -14Q-24 -6 -14 -14M14 -14Q24 -6 36 -14" stroke="#9a6f52" stroke-width="1" fill="none"/>' + [-30, -22, 22, 30].map(function (x, i) { return '<path d="M' + (x - 3) + ' -12h6l-3 6Z" fill="' + ["#9ec9f0", "#fce49a", "#a7d99a", "#f6a5c0"][i] + '"/>'; }).join(""); },
  "8": function () { return '<ellipse cx="0" cy="2" rx="36" ry="10" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/>' + ["#f6a5c0", "#fce49a", "#a7d99a", "#9ec9f0"].map(function (c, i) { return '<path d="M' + (-30 + i * 4) + " 0A" + (30 - i * 4) + " " + (28 - i * 4) + " 0 0 1 " + (30 - i * 4) + ' 0" stroke="' + c + '" stroke-width="3.4" fill="none"/>'; }).join("") + '<path d="M8 8l4 -8l4 4l4 -6l4 10Z" fill="#f2df9a" stroke="#c9a032" stroke-width="1"/>'; },
  "9": function () { return '<path d="M-4 10V-14h12V10Z" fill="#9a6f52" stroke="#6e472c" stroke-width="1.4"/><circle cx="2" cy="-30" r="24" fill="#9fd49a" stroke="#6fae74" stroke-width="1.4"/><circle cx="-12" cy="-38" r="11" fill="#c7e8b6"/><ellipse cx="2" cy="-4" rx="5" ry="6" fill="#4a3b5a"/><circle cx="0" cy="-5" r="1.6" fill="#fce49a"/><circle cx="4" cy="-5" r="1.6" fill="#fce49a"/><g transform="translate(-24 4) rotate(-10)"><rect x="-8" y="-6" width="16" height="11" rx="1.5" fill="#9ec9f0" stroke="#5a7fa8"/><path d="M0 -6v11" stroke="#5a7fa8"/></g>'; },
  "10": function () { return '<path d="M-30 10V-26q10 -10 22 -4V10Z" fill="#c8bcd8" stroke="#8a7fa6" stroke-width="1.4"/><path d="M-6 -24q2 18 0 32" stroke="#a9d6ef" stroke-width="9" fill="none"/><path class="kt-zuhatag" d="M-6 -24q2 18 0 32" stroke="#fff" stroke-width="3" fill="none"/><ellipse cx="2" cy="10" rx="20" ry="5" fill="#a9d6ef"/>' + lnCsillag(14, -26, 4, "#ffd24d") + lnCsillag(24, -12, 3, "#ffd24d") + lnCsillag(-20, -34, 3, "#ffd24d"); },
  "11": function () { return '<path d="M-36 10L-6 -34L10 -14L18 -24L38 10Z" fill="#cbbde6" stroke="#8a7fa6" stroke-width="1.4"/><path d="M-14 -22L-6 -34L2 -24L-4 -20Z" fill="#fff"/><path d="M18 -24V-44" stroke="#6a4f9e" stroke-width="1.6"/><path d="M18 -44h14l-4 5l4 5h-14Z" fill="#fce49a" stroke="#c9a032"/>'; },
  "12": function () { return '<path d="M-40 10Q-36 -36 0 -36Q36 -36 40 10Z" fill="#b9a8d9" stroke="#7d6aa8" stroke-width="1.6"/><path d="M-16 10Q-16 -16 0 -16Q16 -16 16 10Z" fill="#3a2d55"/><path d="M22 -50a9 9 0 1 0 7 12a7 7 0 1 1 -7 -12Z" fill="#fff1b8" stroke="#e3a92a" stroke-width="1"/>' + lnCsillag(-24, -44, 3, "#ffd24d") + lnCsillag(36, -24, 2.5, "#fff"); }
};
/* a pergamen-táj: pergamen, festett foltok a tájak alatt, szélrózsa (álló réteg, firkával) + két pillangó (mozgó) */
function ktTaj(T, mod) {
  var L = T.elr[mod], W = L.w, H = L.h, k = L.jk, s = "";
  s += '<rect width="' + W + '" height="' + H + '" fill="#e6d2ad"/>';
  s += '<path d="M10 14Q' + W / 2 + " 4 " + (W - 12) + " 12Q" + (W - 4) + " " + H / 2 + " " + (W - 10) + " " + (H - 12) + "Q" + W / 2 + " " + (H - 4) + " 12 " + (H - 10) + "Q4 " + H / 2 + ' 10 14Z" fill="url(#kt-gPerg)" stroke="#c9a87a" stroke-width="3"/>';
  Object.keys(T.helyek).forEach(function (id) {
    var p = T.helyek[id][mod];
    s += '<ellipse cx="' + p[0] + '" cy="' + (p[1] - 8) + '" rx="' + lnF(58 * k) + '" ry="' + lnF(36 * k) + '" fill="' + KALAND_TAJ[id].szin + '" opacity=".55"/>';
  });
  var r = mod === "szeles" ? [460, 48, 0.9] : [356, 752, 0.7];
  s += '<g transform="translate(' + r[0] + " " + r[1] + ") scale(" + r[2] + ')" opacity=".75"><circle r="20" fill="none" stroke="#a8794c" stroke-width="1.5"/><path d="M0 -26L5 0L0 26L-5 0Z" fill="#c0567f"/><path d="M-26 0L0 -5L26 0L0 5Z" fill="#a8794c"/><text y="-30" text-anchor="middle" font-size="10" font-weight="700" fill="#6a2c4c">É</text></g>';
  var mozgo = mod === "szeles" ? ltLepke(330, 260, 8, "#f7b8d0") + ltLepke(560, 90, 10, "#fce49a") : ltLepke(180, 470, 8, "#f7b8d0") + ltLepke(200, 240, 10, "#fce49a");
  return { allo: s, mozgo: mozgo };
}
var KT_PIKKELY_DEF = '<defs><linearGradient id="kt-gPikkely" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bff3e0"/><stop offset=".5" stop-color="#d9c6f7"/><stop offset="1" stop-color="#ffd1e6"/></linearGradient></defs>';
var KT_DEFS = LT_DEFS + KT_PIKKELY_DEF +
  '<defs><radialGradient id="kt-gPerg" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#fbf1dc"/><stop offset=".7" stop-color="#f3e2bf"/><stop offset="1" stop-color="#dcc095"/></radialGradient></defs>';
KALAND_TERKEP.jelkep = KT_JELKEP;
KALAND_TERKEP.taj = ktTaj;
KALAND_TERKEP.defs = KT_DEFS;

/* ── felhő, lábnyom, nyom-jel (rajzterv 5.) ── */
function ktFelhoRajz(id, sc, suru) {
  var r = lnRng(31 + (+id || 0) * 7), T = [[-32, 4, 20], [-14, -10, 24], [10, -14, 22], [32, 0, 19], [16, 11, 20], [-14, 12, 19], [0, 0, 26]];
  if (suru) T.push([-40, -8, 18], [40, -10, 17], [0, -24, 18]);
  var p = T.map(function (q) { return [(q[0] + (r() - 0.5) * 6) * sc, (q[1] + (r() - 0.5) * 5) * sc, (q[2] + (r() - 0.5) * 4) * sc]; });
  var s = p.map(function (q) { return '<circle class="kt-puff" cx="' + lnF(q[0]) + '" cy="' + lnF(q[1] + 5 * sc) + '" r="' + lnF(q[2]) + '" fill="' + (suru ? "#d3c8e8" : "#ddd3ef") + '"/>'; }).join("");
  s += p.map(function (q) { return '<circle class="kt-puff" cx="' + lnF(q[0]) + '" cy="' + lnF(q[1]) + '" r="' + lnF(q[2]) + '" fill="' + (suru ? "#f1ecf8" : "#ffffff") + '"/>'; }).join("");
  s += p.slice(0, 4).map(function (q) { return '<circle class="kt-puff" cx="' + lnF(q[0] - q[2] * 0.25) + '" cy="' + lnF(q[1] - q[2] * 0.35) + '" r="' + lnF(q[2] * 0.45) + '" fill="#fff" opacity=".8"/>'; }).join("");
  return s;
}
function ktLabnyomok(x, y, cx, cy, k) {
  var dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, a = Math.atan2(uy, ux) * 180 / Math.PI + 90;
  return [24, 36, 48, 60].map(function (d, i) {
    var o = (i % 2 ? 5 : -5) * k, px = x + ux * d * k - uy * o, py = y + uy * d * k + ux * o;
    return '<g transform="translate(' + lnF(px) + " " + lnF(py) + ") rotate(" + lnF(a) + ") scale(" + lnF(k) + ')" opacity="' + lnF(0.85 - i * 0.12) + '"><ellipse cx="0" cy="1" rx="3" ry="3.6" fill="#8a6a7e"/><circle cx="-3" cy="-4" r="1.3" fill="#8a6a7e"/><circle cx="0" cy="-5.2" r="1.3" fill="#8a6a7e"/><circle cx="3" cy="-4" r="1.3" fill="#8a6a7e"/></g>';
  }).join("");
}
function ktPikkelyRajz() {
  return '<path d="M0 -11C7 -4 8 4 0 9C-8 4 -7 -4 0 -11Z" fill="url(#kt-gPikkely)" stroke="#8a6fc0" stroke-width="1.4"/><path d="M-2 -4q-2 4 0 8" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>' + lnCsillag(9, -9, 3.5, "#ffd24d");
}
function ktNyomJel(fajta) {
  if (fajta === "lap") return '<g transform="rotate(-8)"><rect x="-11" y="-8" width="22" height="16" rx="2" fill="#fffaf0" stroke="#b98a5c" stroke-width="1.4"/><rect x="3" y="-5" width="5" height="6" fill="#f7b8d0"/><path d="M-8 -3h8M-8 1h8M-8 5h6" stroke="#b9a8c9" stroke-width="1"/></g>';
  if (fajta === "pik") return ktPikkelyRajz();
  return "";
}

/* ════════════ A KALANDTÉRKÉP KÉPERNYŐ (fedőlap az odú fölött) ════════════ */
var KT = null;   /* { M, mod, fut, host } — a kirajzolt térkép */
var _ktIdo = [];
function ktIdo(ms, fn) { _ktIdo.push(setTimeout(fn, ms)); }
function ktFedo(id, html) {
  var d = document.getElementById(id);
  if (!d) { d = document.createElement("div"); d.id = id; document.body.appendChild(d); }
  d.className = "kaland-fedo" + (id === "kaland-lap" ? " kaland-lap" : ""); d.innerHTML = html; d.hidden = false;
  return d;
}
function ktFedoZar(id) { var d = document.getElementById(id); if (d) { d.hidden = true; d.innerHTML = ""; } }
function kalandNyitva() { var d = document.getElementById("kaland-fedo"); return !!(d && !d.hidden); }
function ktMond(t, hang) {
  var p = document.getElementById("kt-szoveg"); if (p) p.textContent = "🔊 " + t;
  if (hang !== false) mondd(t.replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "").trim());
}
/* megnyitás (az odúból: a fészekben hagyott térkép-tekercs) */
function kalandNyit() {
  var l = lenyTar(), T = kalandTar(l);
  _ktIdo.forEach(clearTimeout); _ktIdo = [];
  var d = ktFedo("kaland-fedo", '<div class="kt-ablak"><div class="kt-fej"><button class="kt-gomb" id="kt-vissza">← Odú</button>' +
    '<div class="kt-cim">A kissárkány nyomában</div><button class="kt-gomb" id="kt-album-gomb">📒 Album</button></div>' +
    '<div class="kt-terkep uni-terep" id="kt-terkep"></div>' +
    '<div class="kt-lab"><span class="kt-jel" id="kt-jel"></span><p class="kt-szoveg" id="kt-szoveg"></p></div></div>');
  d.querySelector("#kt-vissza").addEventListener("click", function () { hangGomb(); kalandZar(); });
  d.querySelector("#kt-album-gomb").addEventListener("click", function () { hangGomb(); kalandAlbum(); });
  ktRajzol();
  if (T.tiszta.length >= KALAND_IDK.length - 1 && !kalandTiszta(T, KALAND_BARLANG)) ktMond("Nézd, a barlang felhője alól kilóg valami!");
  else if (kalandFujhat(l)) ktMond(l.nev + " nyomát követjük. Melyik felhőt fújjuk el? A fénylők közül választhatsz.");
  else if (T.jog > 0) ktMond("Mára elég a felhőfújásból, holnap folytatjuk a nyomkeresést!");
  else ktMond("Egy végigjátszott pálya után elfújhatsz egy felhőt.");
}
function kalandZar() {
  _ktIdo.forEach(clearTimeout); _ktIdo = [];
  if (KT && KT.koveto) cancelAnimationFrame(KT.koveto);
  KT = null;
  ktFedoZar("kaland-lap"); ktFedoZar("kaland-fedo");
  try { speechSynthesis.cancel(); } catch (e) {}
  if (oduAktiv()) { renderOdu(); oduUniHaza(); }   /* a fészek, az album, a kölyök, a vitrin pikkelyei a mostani állapot szerint */
}
function ktRajzol() {
  var host = document.getElementById("kt-terkep"); if (!host) return;
  var l = lenyTar(), T = kalandTar(l), mod = utcaMod(host.clientWidth, host.clientHeight), L = KALAND_TERKEP.elr[mod], k = L.jk;
  var lathato = {}; Object.keys(KALAND_TERKEP.helyek).forEach(function (id) { lathato[id] = true; });
  var halo = { van: lathato, lathato: lathato, utak: KALAND_TERKEP.utak };
  /* a fedő réteg: nyomok → az alvó lény a barlangnál → felhők → a hazakísért kölyök */
  var f = "";
  KALAND_IDK.forEach(function (id) {
    var p = ktPoz(id, mod), D = KALAND_TAJ[id], kov = ktKovetkezo(id), ny = "";
    if (kov) { var c = ktPoz(kov, mod); ny += ktLabnyomok(p[0], p[1], c[0], c[1], k); }
    if (D.ny === "lap" || D.ny === "pik") ny += '<g transform="translate(' + lnF(p[0] - 34 * k) + " " + lnF(p[1] - 38 * k) + ") scale(" + lnF(k * 1.1) + ')">' + ktNyomJel(D.ny) + "</g>";
    f += '<g class="kt-nyom' + (kalandTiszta(T, id) ? " ki" : "") + '" id="kt-nyom-' + id + '" pointer-events="none">' + ny + "</g>";
  });
  var bp = ktPoz(KALAND_BARLANG, mod), pal = lenyPal();
  f += '<g id="kt-barlang-leny" pointer-events="none" transform="translate(' + bp[0] + " " + lnF(bp[1] + 9 * k) + ") scale(" + lnF(0.3 * k) + ')" style="opacity:0;transition:opacity .8s">' +
    '<g id="kt-bl-alvo" style="transition:opacity .7s">' + lenyRajz("alvo", pal) + '<text x="40" y="-70" font-weight="700" font-size="30" fill="' + pal.d + '">z z</text></g>' +
    '<g id="kt-bl-kolyok" style="opacity:0;transition:opacity .7s">' + lenyRajz("kolyok", pal) + "</g></g>";
  KALAND_IDK.forEach(function (id) {
    if (kalandTiszta(T, id)) return;
    var p = ktPoz(id, mod), suru = id === KALAND_BARLANG;
    f += '<g class="kt-felho" id="kt-felho-' + id + '" data-id="' + id + '" role="button" aria-label="Felhő" transform="translate(' + p[0] + " " + lnF(p[1] - 12 * k) + ')">' +
      '<g class="kt-ring" style="animation-delay:-' + (+id * 0.6).toFixed(1) + 's">' + ktFelhoRajz(id, L.felho * k * 1.06, suru) + "</g>" +
      (suru ? '<g id="kt-kilogo" style="display:none" transform="translate(' + lnF(36 * k) + " " + lnF(20 * k) + ") scale(" + lnF(k * 1.2) + ')"><g class="kt-kilog">' +
        '<path d="M0 0q10 -4 14 -16" stroke="' + pal.d + '" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M0 0q10 -4 14 -16" stroke="' + pal.b + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<g transform="translate(14 -16) rotate(20) scale(1.1)"><path d="' + LN_SZIV_D + '" fill="' + pal.tuske + '" stroke="' + pal.d + '" stroke-width="1.6"/></g></g></g>' : "") + "</g>";
  });
  f += '<g id="kt-kolyok" pointer-events="none" style="opacity:0"></g><g id="kt-szel" pointer-events="none"></g>';
  var M = terkepRajzol(host, KALAND_TERKEP, { mod: mod, all: kalandTiszta(T, T.hol) ? T.hol : "k", halo: halo, nev: function (id) { return KALAND_TAJ[id].nev; }, fedo: f, koppint: ktHelyKatt });
  /* a felhő alatti tájak neve még rejtve */
  Array.prototype.forEach.call(M.svg.querySelectorAll('.terkep-hely[aria-hidden]'), function (g) {
    g.classList.add("kt-nev"); if (!kalandTiszta(T, g.getAttribute("data-id"))) g.classList.add("kt-rejt");
  });
  M.halo = ktJaroHalo(T);
  M.svg.addEventListener("click", function (e) { var g = e.target.closest(".kt-felho"); if (g) ktFelhoKatt(g.getAttribute("data-id")); });
  KT = { M: M, mod: mod, fut: false, host: host };
  ktAllapot();
}
/* a fénylő (elfújható) felhők, a barlang kilógó farka, a számláló */
function ktAllapot() {
  if (!KT) return;
  var l = lenyTar(), T = kalandTar(l), fuj = kalandFujhat(l) && !KT.fut;
  Array.prototype.forEach.call(KT.M.svg.querySelectorAll(".kt-felho"), function (g) { g.classList.toggle("elerheto", fuj && ktElerheto(T, g.getAttribute("data-id"))); });
  var kl = KT.M.svg.querySelector("#kt-kilogo"); if (kl) kl.style.display = T.tiszta.length >= KALAND_IDK.length - 1 ? "" : "none";
  var j = document.getElementById("kt-jel");
  if (j) j.innerHTML = "☁️ " + (T.tiszta.length < KALAND_IDK.length ? Math.min(T.jog, napiMarad(T, KALAND_FELHO_NAP)) : 0) + '<span class="kt-jel-kis">🗺️ ' + T.tiszta.length + "/" + KALAND_IDK.length + "</span>";
  var ag = document.getElementById("kt-album-gomb"); if (ag) ag.hidden = !l.kepeslap.length && !l.pikkely.length;
}
/* egy kitisztult tájra koppintva: odasétál, és elmondja, mit csinált ott a kissárkány (a képeslapot újra megmutatja) */
function ktHelyKatt(id) {
  if (!KT || KT.fut) return;
  var M = KT.M, D = KALAND_TAJ[id], l = lenyTar();
  if (!kalandTiszta(kalandTar(l), id)) { ktFelhoKatt(id); return; }   /* a felhő széle alól kilógó hely = a felhő */
  if (M.fut) { terkepSetal(M, id); return; }
  hangGomb();
  ktMond(D.nev + "! " + (id === "k" ? "Innen indult a kaland." : D.mondat));
  terkepSetal(M, id, function () {
    kalandTar(l).hol = id; ment();
    if (D.ny === "lap" && l.kepeslap.indexOf(id) >= 0) ktIdo(500, function () { kalandLapMutat(id, false); });
  });
}
function ktFelhoKatt(id) {
  if (!KT || KT.fut || KT.M.fut) return;
  var l = lenyTar(), T = kalandTar(l);
  if (kalandTiszta(T, id)) return;
  if (id === KALAND_BARLANG && T.tiszta.length < KALAND_IDK.length - 1) { hangGomb(); ktMond("Ez a felhő még nagyon sűrű. Előbb kövessük a többi nyomot!"); return; }
  if (!ktElerheto(T, id)) { hangGomb(); ktMond("Ez a felhő még messze van. A kitisztult rész melletti felhőket lehet elfújni."); return; }
  if (T.jog > 0 && !napiMarad(T, KALAND_FELHO_NAP)) { hangGomb(); ktMond("Mára elég a felhőfújásból, holnap folytatjuk a nyomkeresést!"); return; }
  if (T.jog <= 0) { hangGomb(); ktMond("Egy végigjátszott pálya után elfújhatsz egy felhőt."); return; }
  KT.fut = true; ktAllapot();
  var M = KT.M, mod = KT.mod;
  M.halo = ktJaroHalo(T);
  /* a legközelebbi kitisztult szomszédhoz megy, onnan fúj */
  var honnan = null, legjobb = Infinity;
  ktSzomszed(id).filter(function (n) { return kalandTiszta(T, n); }).forEach(function (n) {
    var ut = terkepUtkereso(KALAND_TERKEP, M.halo, M.all, n, mod), h = ut ? ut.length : Infinity;
    if (h < legjobb) { legjobb = h; honnan = n; }
  });
  if (!honnan) { KT.fut = false; ktAllapot(); return; }
  hangGomb(); ktMond("Odamegyünk, és elfújjuk!", false);
  terkepSetal(M, honnan, function () {
    if (!KT || KT.M !== M) return;
    T.hol = honnan;
    var c = ktPoz(id, mod), dir = c[0] >= M.x ? 1 : -1;
    uniFordul(M.el, dir, function () { if (KT && KT.M === M) ktFuj(id, dir); });
  });
}
/* fúúú: szélvonalak az unikornis szájától a felhőig, a pamacsok szétszállnak; a táj kitisztul, előjön a nyom */
function ktFuj(id, dir) {
  var M = KT.M, mod = KT.mod, l = lenyTar(), T = kalandTar(l), c = ktPoz(id, mod), k = KALAND_TERKEP.elr[mod].jk;
  /* a száj: a rajz elülső-felső része (a tükrözéstől függetlenül a befoglaló doboz külső széléből) */
  var bb = M.hely.getBBox(), hx = M.x + dir * 0.72 * Math.max(Math.abs(bb.x), Math.abs(bb.x + bb.width)), hy = M.y + bb.y + bb.height * 0.25;
  var cx = c[0], cy = c[1] - 12 * k, a = Math.atan2(cy - hy, cx - hx) * 180 / Math.PI, d = Math.max(20, Math.hypot(cx - hx, cy - hy) - 40 * k);
  KT.M.svg.querySelector("#kt-szel").innerHTML = '<g class="kt-szel" transform="translate(' + lnF(hx) + " " + lnF(hy) + ") rotate(" + lnF(a) + ')">' +
    [-8, 0, 8].map(function (o, i) { return '<path d="M4 ' + o + "q" + lnF(d / 2) + " " + (-4 + i * 4) + " " + lnF(d) + " " + lnF(o * 0.6) + '" stroke="#9ec9f0" stroke-width="2.6" fill="none" stroke-linecap="round" pathLength="1" style="animation-delay:' + i * 0.1 + 's"/>'; }).join("") + "</g>";
  ktMond("Fúúú!", false); hangSzuszog();
  /* mentés AZONNAL: ami kitisztult, soha nem felhősödik vissza (akkor sem, ha a gyerek közben bezárja) */
  T.tiszta.push(id); T.jog = Math.max(0, T.jog - 1); napiHatar(T, KALAND_FELHO_NAP);
  var D = KALAND_TAJ[id];
  if (D.ny === "lap" && l.kepeslap.indexOf(id) < 0) l.kepeslap.push(id);
  if (D.ny === "pik" && l.pikkely.indexOf(id) < 0) l.pikkely.push(id);
  if (id === KALAND_BARLANG) { l.fazis = "kolyok"; l.t = gyakNap(); l.megtalalt = Date.now(); T.hol = "k"; esemeny("leny_megtalalt", { nev: l.nev, leny: mentes.leny }); }
  ment();
  ktIdo(450, function () {
    var g = M.svg.querySelector("#kt-felho-" + id), r = lnRng(+id * 13); if (!g) return;
    g.classList.remove("elerheto"); g.style.pointerEvents = "none";
    Array.prototype.forEach.call(g.querySelectorAll(".kt-puff"), function (p) {
      var x = +p.getAttribute("cx"), y = +p.getAttribute("cy");
      p.style.transform = "translate(" + lnF(x * 0.6 + dir * 60 + (r() - 0.5) * 40) + "px," + lnF(y * 0.6 - 20 - r() * 30) + "px) scale(.3)"; p.style.opacity = "0";
    });
    hangCsilla();
  });
  ktIdo(1150, function () { var s = M.svg.querySelector("#kt-szel"); if (s) s.innerHTML = ""; });
  ktIdo(1450, function () {
    var g = M.svg.querySelector("#kt-felho-" + id); if (g) g.parentNode.removeChild(g);
    var ny = M.svg.querySelector("#kt-nyom-" + id); if (ny) ny.classList.add("ki");
    Array.prototype.forEach.call(M.svg.querySelectorAll('.kt-nev[data-id="' + id + '"]'), function (n) { n.classList.remove("kt-rejt"); });
    M.halo = ktJaroHalo(T);
    if (id === KALAND_BARLANG) { ktAllapot(); ktMegtalaltuk(); return; }
    var utolso = T.tiszta.length === KALAND_IDK.length - 1;
    ktMond(D.nev + ": " + D.mondat + (utolso ? " Nézd, a barlang felhője alól kilóg valami!" : ""));
    KT.fut = false; ktAllapot();
    if (D.ny === "lap") ktIdo(2600, function () { if (KT && !KT.fut) kalandLapMutat(id, true); });
  });
}
/* a barlangban: alszik összegömbölyödve → kölyökként ébred → az unikornis mellé lép → együtt sétálnak haza */
function ktMegtalaltuk() {
  var M = KT.M, mod = KT.mod, l = lenyTar(), k = KALAND_TERKEP.elr[mod].jk, bl = M.svg.querySelector("#kt-barlang-leny");
  bl.style.opacity = "1"; hangVege();
  ktMond("Megvan! Ott alszik összegömbölyödve… " + l.nev + "!");
  ktIdo(2600, function () {
    var a = M.svg.querySelector("#kt-bl-alvo"), ko = M.svg.querySelector("#kt-bl-kolyok");
    a.style.opacity = "0"; ko.style.opacity = "1"; lenyTusszent(ko);
    ktMond(l.nev + " felébredt! Nézd, mekkorát nőtt, amíg kalandozott!");
  });
  ktIdo(6400, function () {
    if (!KT || KT.M !== M) return;
    bl.style.transition = "none"; bl.style.opacity = "0";
    var kg = M.svg.querySelector("#kt-kolyok"), bp = ktPoz(KALAND_BARLANG, mod), s = 0.3 * k;
    kg.innerHTML = lenyRajz("kolyok", lenyPal()); kg.style.opacity = "1";
    kg.setAttribute("transform", "translate(" + bp[0] + " " + lnF(bp[1] + 9 * k) + ") scale(" + lnF(s) + ")");
    ktMond("Együtt sétálunk haza. " + l.nev + " mostantól újra az odúban lakik.");
    /* a kölyök az unikornis nyomában lépked: a séta pontjait kis késéssel követi */
    var nyom = [], fl = 1;
    function hova(x, y) { kg.setAttribute("transform", "translate(" + lnF(x) + " " + lnF(y) + ") scale(" + lnF(s * fl) + " " + lnF(s) + ")"); }
    function lep() {
      if (!KT || KT.M !== M || !M.fut) return;
      nyom.push([M.x, M.y]);
      if (nyom.length < 3) { KT.koveto = requestAnimationFrame(lep); return; }
      var q = nyom[Math.max(0, nyom.length - 20)], e = nyom[Math.max(0, nyom.length - 24)];
      if (Math.abs(q[0] - e[0]) > 0.3) fl = q[0] < e[0] ? -1 : 1;
      hova(q[0], q[1]);
      KT.koveto = requestAnimationFrame(lep);
    }
    terkepSetal(M, "k", function () {   /* hazaértek: a kölyök az unikornis mögé áll */
      if (!KT || KT.M !== M) return;
      var d = uniIrany(M.el) || 1; fl = d; hova(M.x - d * 34 * k, M.y);
      lenyTusszent(kg); KT.fut = false; ktAllapot();
    });
    if (M.fut) KT.koveto = requestAnimationFrame(lep); else { fl = uniIrany(M.el) || 1; hova(M.x - fl * 34 * k, M.y); }
  });
}

/* ════════════ KÉPESLAPOK (a kissárkány zsírkréta-rajza, rajzterv 6.) + ALBUM ════════════ */
function ktKretaSarkany(p, x, y, s) {
  var c = p.d;
  return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M-14 -10l-6 -12l10 4l2 -12l8 10" fill="' + p.tuske + '"/><path d="M-26 0q-14 -2 -16 -14" fill="none"/>' +
    '<ellipse cx="0" cy="0" rx="20" ry="16" fill="' + p.b + '" fill-opacity=".85"/><circle cx="16" cy="-20" r="13" fill="' + p.b + '" fill-opacity=".85"/><circle cx="19" cy="-23" r="2.4" fill="' + c + '" stroke="none"/>' +
    '<path d="M18 -14q5 3 9 -1" fill="none"/><path d="M-6 -14l-12 -14l2 14" fill="' + p.szarny + '" fill-opacity=".8"/><path d="M-8 14v6M8 14v6"/></g>';
}
var KALAND_LAP = {
  "1":  { sor: ["Itt jártam a", "Pillangós réten!", "Virágkoszorút", "fontam.", "Szép vagyok?"], rajz: function (p) { return ktKretaSarkany(p, 70, 96, 1.3) + [[-14, -48], [-2, -54], [10, -52], [20, -44]].map(function (d, i) { return '<circle cx="' + (92 + d[0]) + '" cy="' + (96 + d[1] + 18) + '" r="5" fill="' + ["#f6a5c0", "#fce49a", "#c9a8e6", "#f6a5c0"][i] + '" stroke="#c0567f" stroke-width="2"/>'; }).join("") + '<path d="M20 130q60 -16 120 0" stroke="#7cc07a" stroke-width="4" fill="none"/>'; } },
  "3":  { sor: ["A Bárányka-réten", "gombolyaggal", "játszottam. Kicsit", "összegabalyodtam!"], rajz: function (p) { return ktKretaSarkany(p, 62, 94, 1.2) + '<circle cx="118" cy="104" r="16" fill="#f7b8d0" stroke="#c0567f" stroke-width="3"/><path d="M106 96q12 6 24 0M104 106q14 6 28 0" stroke="#c0567f" stroke-width="2" fill="none"/><path d="M102 110q-30 30 -60 -4q-10 -20 10 -24" stroke="#e0699b" stroke-width="2.6" fill="none"/>'; } },
  "5":  { sor: ["A malomnál", "mézes kalácsot", "kóstoltam.", "Hmm, de finom", "volt!"], rajz: function (p) { return ktKretaSarkany(p, 60, 96, 1.2) + '<path d="M98 112q20 -26 42 0q-20 10 -42 0Z" fill="#f0c04a" stroke="#b07a10" stroke-width="3"/><path d="M106 104l6 8M118 100l4 10M128 104l-2 8" stroke="#b07a10" stroke-width="2"/><path d="M128 40v40M118 52l20 -4M118 70l20 -4" stroke="#b98a5c" stroke-width="3"/>'; } },
  "7":  { sor: ["A tisztáson", "körhintáztam!", "Háromszor", "három kört!"], rajz: function (p) { return '<path d="M30 60L90 30L150 60Z" fill="#f7b8d0" stroke="#c0567f" stroke-width="3"/><path d="M40 60v60M90 60v60M140 60v60" stroke="#9a6f52" stroke-width="3"/><path d="M26 122h128" stroke="#9a6f52" stroke-width="4"/>' + ktKretaSarkany(p, 92, 104, 0.9) + '<path d="M32 90h14M136 90h12" stroke="#fce49a" stroke-width="5"/>'; } },
  "9":  { sor: ["A Bagolyfánál", "a bagoly mesét", "olvasott nekem.", "Huhú!"], rajz: function (p) { return ktKretaSarkany(p, 54, 104, 1.1) + '<ellipse cx="124" cy="82" rx="20" ry="24" fill="#c9a8e6" stroke="#6a4f9e" stroke-width="3"/><circle cx="116" cy="76" r="6" fill="#fff" stroke="#6a4f9e" stroke-width="2"/><circle cx="132" cy="76" r="6" fill="#fff" stroke="#6a4f9e" stroke-width="2"/><circle cx="116" cy="77" r="2.4" fill="#3b2f4a"/><circle cx="132" cy="77" r="2.4" fill="#3b2f4a"/><path d="M98 120l26 -6l26 6v-16l-26 -6l-26 6Z" fill="#9ec9f0" stroke="#5a7fa8" stroke-width="2.6"/>'; } },
  "11": { sor: ["A Kavics-hegyen", "kirakót raktam", "a kövekből.", "Majdnem kész", "lett!"], rajz: function (p) { return ktKretaSarkany(p, 60, 100, 1.15) + '<path d="M98 120h20v-8a5 5 0 1 1 6 -6v-6h20v26h-14a5 5 0 1 0 -8 0h-24Z" fill="#fce49a" stroke="#c9a032" stroke-width="3"/><path d="M104 60l20 -30l20 30Z" fill="#cbbde6" stroke="#8a7fa6" stroke-width="3"/>'; } }
};
var _ktLapId = 0;
function kalandLapSVG(id) {
  var p = lenyPal(), D = KALAND_TAJ[id], Lp = KALAND_LAP[id], nev = lenyTar().nev || "", fz = "kt-zsk" + (++_ktLapId);
  var s = '<svg class="kt-lap-svg" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg"><defs><filter id="' + fz + '" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="1" seed="9"/><feDisplacementMap in="SourceGraphic" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
  s += '<rect x="2" y="2" width="316" height="206" rx="6" fill="#fffaf0" stroke="#e2cba3" stroke-width="2"/>';
  s += '<g filter="url(#' + fz + ')"><rect x="12" y="14" width="160" height="182" rx="4" fill="#fffdf6"/>' + Lp.rajz(p) + "</g>";
  s += '<path d="M184 22V190" stroke="#e2cba3" stroke-width="2" stroke-dasharray="3 4"/>';
  s += '<g transform="translate(266 18)"><rect width="42" height="50" fill="#fdf0d0" stroke="#c9a87a" stroke-width="1.5" stroke-dasharray="3 2"/><g transform="translate(19 30) scale(.5)">' + lnFej(p, { fej: [0, 0, 1], szarv: 0.7 }) + "</g></g>";
  s += '<g transform="translate(244 54) rotate(-12)" opacity=".55"><circle r="17" fill="none" stroke="#8a6fc0" stroke-width="1.6"/><text y="-2" text-anchor="middle" font-size="6" font-weight="700" fill="#8a6fc0">' + htmlVed(D.nev.toUpperCase()) + '</text><path d="M-14 6h28" stroke="#8a6fc0" stroke-width="1.2"/></g>';
  s += Lp.sor.map(function (t, i) { return '<text x="193" y="' + (88 + i * 18) + '" font-size="12.5" font-weight="600" fill="' + p.d + '">' + htmlVed(t) + "</text>"; }).join("");
  s += '<text x="300" y="194" text-anchor="end" font-size="15" font-weight="700" fill="' + p.d + '">— ' + htmlVed(nev) + " 💕</text>";
  return s + "</svg>";
}
function kalandLapMondat(id) { return KALAND_LAP[id].sor.join(" ").replace(/\s+/g, " ") + " Puszi: " + (lenyTar().nev || "a kissárkány") + "."; }
/* egy képeslap nagyban (uj = most találtuk: „Az albumba!”), az unikornis felolvassa */
function kalandLapMutat(id, uj) {
  if (!KALAND_LAP[id]) return;
  var d = ktFedo("kaland-lap", '<div class="kt-lap-kartya">' + (uj ? '<div class="kt-lap-cim">📮 Képeslapot küldött ' + htmlVed(lenyTar().nev) + "!</div>" : "") +
    '<div class="kt-lap-nagy">' + kalandLapSVG(id) + '</div><button class="nagy-gomb kiemelt" id="kt-lap-ok">' + (uj ? "📒 Az albumba!" : "Rendben") + "</button></div>");
  mondd(kalandLapMondat(id));
  d.querySelector("#kt-lap-ok").addEventListener("click", function () { hangGomb(); ktFedoZar("kaland-lap"); ktAllapot(); });
}
/* az album: a megtalált képeslapok + a fényes pikkelyek (az odúból is nyílik: a fészek melletti kis könyv) */
function kalandAlbum() {
  var l = lenyTar(), lapok = KALAND_IDK.filter(function (id) { return l.kepeslap.indexOf(id) >= 0 && KALAND_LAP[id]; });
  var osszLap = Object.keys(KALAND_LAP).length, osszPik = KALAND_IDK.filter(function (id) { return KALAND_TAJ[id].ny === "pik"; }).length;
  var pik = l.pikkely.length ? '<div class="kt-album-pik">' + l.pikkely.map(function () { return '<svg viewBox="-14 -14 28 28" width="34" height="34">' + KT_PIKKELY_DEF + ktPikkelyRajz() + "</svg>"; }).join("") +
    "<span>Fényes pikkely " + l.pikkely.length + "/" + osszPik + " · a Kincsvitrinen is ragyog</span></div>" : "";
  var d = ktFedo("kaland-lap", '<div class="kt-album"><div class="kt-album-fej"><b>📒 ' + htmlVed(l.nev || "A kissárkány") + " képeslapjai</b><span>" + lapok.length + "/" + osszLap + '</span><button class="kt-gomb" id="kt-album-zar">✕</button></div>' +
    pik + '<div class="kt-album-racs">' + (lapok.length ? lapok.map(function (id) { return '<button class="kt-album-lap" data-id="' + id + '">' + kalandLapSVG(id) + "</button>"; }).join("") : '<p class="kt-album-ures">Még nem jött képeslap. Kövessétek a nyomokat a kalandtérképen!</p>') + "</div></div>");
  mondd(lapok.length ? "Az album. Koppints egy képeslapra, és felolvasom!" : "Még nem jött képeslap.");
  d.querySelector("#kt-album-zar").addEventListener("click", function () { hangGomb(); ktFedoZar("kaland-lap"); try { speechSynthesis.cancel(); } catch (e) {} });
  Array.prototype.forEach.call(d.querySelectorAll(".kt-album-lap"), function (b) { b.addEventListener("click", function () { hangGomb(); mondd(kalandLapMondat(b.getAttribute("data-id"))); }); });
}

/* ════════════ A LILA BAGOLY HOZZA A TÉRKÉPET (az elröppenés után, az odúban) ════════════ */
function kalandBagoly() {
  if (!oduAktiv()) return;
  var l = lenyTar();
  var tekercs = '<g transform="translate(0 46) rotate(-8)"><rect x="-30" y="-9" width="60" height="18" rx="9" fill="#f3e2bf" stroke="#a8794c" stroke-width="2.4"/><ellipse cx="-30" cy="0" rx="5" ry="9" fill="#e6d2ad" stroke="#a8794c" stroke-width="2"/><path d="M-6 -9v18" stroke="#e07aa3" stroke-width="4"/></g>';
  var s = '<svg class="kt-bagoly-kep" viewBox="-80 -80 160 150" xmlns="http://www.w3.org/2000/svg"><g class="kt-bagoly-repul">' +
    '<path d="M-30 -10Q-70 -40 -76 -6Q-56 -10 -34 10Z" fill="#b48fd6" stroke="#8a6fc0" stroke-width="2"/><path d="M30 -10Q70 -40 76 -6Q56 -10 34 10Z" fill="#b48fd6" stroke="#8a6fc0" stroke-width="2"/>' +
    bagolyLilaTest(bagolyPislog("4.5s", "0;.94;.97;1", bagolyPupillak(-12, 6.5))) + tekercs + "</g></svg>";
  var d = lenyFedo('<div class="leny-kartya kt-bagoly-kartya">' + s + '<p class="leny-szoveg">🔊 Huhú! Láttam, merre repült ' + htmlVed(l.nev) + '. Itt a térkép, kövessétek a nyomát!</p>' +
    '<button class="nagy-gomb kiemelt" id="kt-bagoly-ok">🗺️ Nézzük a térképet!</button></div>');
  mondd("Huhú! Láttam, merre repült " + l.nev + ". Itt a térkép, kövessétek a nyomát!");
  d.querySelector("#kt-bagoly-ok").addEventListener("click", function () {
    hangGomb(); lenyFedoZar();
    kalandTar(l).bagoly = 1; ment();
    lenyOduFrissit();
    kalandNyit();
  });
}

/* a ligettérkép Odú-jelzése: 🥚 (lelet, kikelés), 🦋 (elröppenés vár), ☁️ (elfújható felhő, ill. a bagoly térképe) */
function lenyTerkepJel() {
  var l = lenyTar();
  if (l.fazis === "tojas" && (!l.lelet || lenyTojasAll(l).kesz)) return ["🥚"];
  if (lenyElropVar(l)) return ["🦋"];
  if (l.fazis === "kaland" && (!kalandTar(l).bagoly || kalandFujhat(l))) return ["☁️"];
  return [];
}
window.addEventListener("resize", function () {   /* forgatás: fekvő ↔ álló — a térkép újrarajzolódik (nem séta közben) */
  if (!KT || KT.fut || KT.M.fut || !kalandNyitva()) return;
  if (utcaMod(KT.host.clientWidth, KT.host.clientHeight) !== KT.mod) ktRajzol();
});

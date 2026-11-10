/* ============ 6j4d) 🐾 GARAS, A NYEST + 🗼 GARAS TORNYA (Garas tornya, 2. kör: 2026-11-09) ============
   Rajz: terv/irasbeli-haz-rajzterv.html (✅ 11-09, mind A) — innen átvéve, ugyanazzal a rajzzal.
   Képregényes, NEM papírmasé (uj-figura-kepregenyes-nem-papirmase): a végtag egy hajlékony vonal a vállától a mancsáig (gaCso), kör nélkül.
   Monokli + lila mellény + ceruza a fül mögött; meleg gesztenyebarna bunda, krém előke.
   garasSVG(o) → a figura egy 240 × 300-as dobozban (talppont: 120, 286). GARAS_POZ[név] = a rajzterv 7 póza.
   gaTorony(all, eg) → a torony kívülről (200 széles, a talppont 100, 380): all zart | uj | folyik | kesz · eg = hány ablak ég.
   GA_DEFS: a színátmenetek (ga-…), minden kép <defs>-ébe. */
var GA_INK = "#3a2418", GA_FUR = "#a2683f", GA_FURD = "#6e4329", GA_BIB = "#fbeedd", GA_MUZ = "#f3dcc2", GA_EAR = "#eab3a3", GA_NOSE = "#b56a6a",
    GA_VEST = "#b79fd4", GA_GOLD = "#f2c94c", GA_GOLDD = "#a87a1c";
var GA_HE = { 1: ["#f6a5c0", "#c0567f", "#ffe3ee"], 10: ["#9ec9f0", "#5f84b0", "#e3f0fc"], 100: ["#f5cf6a", "#b5842c", "#fdf1cf"] };
var GA_DEFS =
  '<linearGradient id="ga-ko" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9beb2"/><stop offset=".45" stop-color="#e6ded4"/><stop offset="1" stop-color="#bfb3a6"/></linearGradient>' +
  '<linearGradient id="ga-fa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dcb98c"/><stop offset=".45" stop-color="#f3dbb4"/><stop offset="1" stop-color="#d4ae80"/></linearGradient>' +
  '<linearGradient id="ga-teto" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8f78c2"/><stop offset=".45" stop-color="#b7a2e0"/><stop offset="1" stop-color="#8670b8"/></linearGradient>' +
  '<linearGradient id="ga-fal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2d2b8"/><stop offset=".5" stop-color="#f8ecd9"/><stop offset="1" stop-color="#dccab0"/></linearGradient>' +
  '<radialGradient id="ga-feny"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>' +
  '<pattern id="ga-kocka" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#fffef8"/><path d="M16 0V16H0" fill="none" stroke="#bdd3ec" stroke-width="1"/></pattern>';

/* ── közös kis elemek ── */
function gaCso(p, w, col) {   /* hajlékony végtag: váll → könyök → mancs, egy vonal, kör nélkül */
  var cx = 2 * p[2] - (p[0] + p[4]) / 2, cy = 2 * p[3] - (p[1] + p[5]) / 2, d = "M" + p[0] + " " + p[1] + "Q" + cx + " " + cy + " " + p[4] + " " + p[5];
  return '<path d="' + d + '" fill="none" stroke="' + GA_INK + '" stroke-width="' + (w + 6) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
}
function gaTaller(x, y, r, v) {
  var c = GA_HE[v || 100];
  return '<g><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="' + (r > 8 ? 2 : 1.4) + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .64) + '" fill="none" stroke="' + c[1] + '" stroke-width="1" opacity=".7"/>' +
    '<path d="M' + (x - r * .3) + ' ' + (y - r * .28) + 'H' + (x + r * .3) + 'M' + x + ' ' + (y - r * .28) + 'V' + (y + r * .36) + '" stroke="' + c[1] + '" stroke-width="' + (r > 8 ? 1.8 : 1.2) + '" stroke-linecap="round"/></g>';
}
function gaCeruza(x, y, a, len) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ')"><rect x="' + (-9 - len) + '" y="-4" width="' + len + '" height="8" fill="#ffd166" stroke="' + GA_INK + '" stroke-width="1.8"/>' +
    '<path d="M0 0L-9 -4V4Z" fill="#f3d2a2" stroke="' + GA_INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M-3 -1.3V1.3L0 0Z" fill="' + GA_INK + '"/>' +
    '<rect x="' + (-16 - len) + '" y="-4" width="7" height="8" rx="2" fill="#f4a6b8" stroke="' + GA_INK + '" stroke-width="1.6"/></g>';
}
function gaSzikra(x, y, r) { return '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="#ffe08a" stroke="#d1a23a" stroke-width="1.2"/>'; }

/* ── Garas ── */
function gaSzem(t) {
  var Y = 88;
  function nyit(x) { return '<ellipse cx="' + x + '" cy="' + Y + '" rx="7.5" ry="10" fill="' + GA_INK + '"/><circle cx="' + (x + 2.6) + '" cy="' + (Y - 4) + '" r="2.8" fill="#fff"/>'; }
  function zar(x) { return '<path d="M' + (x - 8) + ' ' + (Y + 2) + 'Q' + x + ' ' + (Y - 8) + ' ' + (x + 8) + ' ' + (Y + 2) + '" fill="none" stroke="' + GA_INK + '" stroke-width="3.4" stroke-linecap="round"/>'; }
  function le(x) { return '<ellipse cx="' + x + '" cy="' + (Y + 3) + '" rx="7" ry="6.5" fill="' + GA_INK + '"/><path d="M' + (x - 9) + ' ' + (Y - 1) + 'Q' + x + ' ' + (Y - 5) + ' ' + (x + 9) + ' ' + (Y - 1) + '" fill="none" stroke="' + GA_INK + '" stroke-width="3" stroke-linecap="round"/>'; }
  function fel(x) { return '<ellipse cx="' + x + '" cy="' + (Y + 1) + '" rx="7.5" ry="8.5" fill="' + GA_INK + '"/><circle cx="' + (x + 2) + '" cy="' + (Y + 3) + '" r="2.2" fill="#fff"/><path d="M' + (x - 10) + ' ' + (Y - 10) + 'H' + (x + 10) + 'V' + (Y - 1) + 'H' + (x - 10) + 'Z" fill="' + GA_FUR + '"/><path d="M' + (x - 10) + ' ' + (Y - 1) + 'H' + (x + 10) + '" stroke="' + GA_INK + '" stroke-width="3.2" stroke-linecap="round"/>'; }
  if (t === "le") return le(103) + le(137);
  if (t === "felig") return fel(103) + fel(137);
  if (t === "zart") return zar(103) + zar(137);
  if (t === "kacsint") return nyit(103) + zar(137);
  var pislog = lkCsokkent() ? "" : '<g opacity="0"><ellipse cx="103" cy="' + Y + '" rx="9.5" ry="12" fill="' + GA_FUR + '"/><ellipse cx="137" cy="' + Y + '" rx="9.5" ry="12" fill="' + GA_FUR + '"/>' + zar(103) + zar(137) +
    '<animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.93;.965;1" dur="4.6s" repeatCount="indefinite"/></g>';
  return nyit(103) + nyit(137) + pislog;
}
var GA_SZEMOLD = { semleges: ["M95 74Q103 70 111 73", "M129 73Q137 70 145 74"], fel: ["M95 69Q103 62 111 67", "M129 67Q137 62 145 69"],
  hm: ["M95 68Q103 62 111 66", "M129 76L146 74"], ravasz: ["M96 75Q104 78 111 77", "M129 70Q138 63 146 67"] };
var GA_SZAJ = {
  mosoly: '<path d="M110 111Q115 117 120 111Q125 117 130 111" fill="none" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  nagy: '<path d="M106 110Q120 133 134 110Z" fill="#7a2f35" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M112 121Q120 115 128 121Q125 127 120 127Q115 127 112 121Z" fill="#e88a8f"/>',
  hm: '<path d="M111 115Q116 112 121 115T131 113" fill="none" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linecap="round"/>',
  nyelv: '<path d="M124 113Q131 123 135 115" fill="#e88a8f" stroke="' + GA_INK + '" stroke-width="2"/><path d="M110 111Q115 117 120 111Q125 117 130 111" fill="none" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linecap="round"/>',
  ravasz: '<path d="M107 113Q122 122 135 107" fill="none" stroke="' + GA_INK + '" stroke-width="2.8" stroke-linecap="round"/><path d="M127 116L129 121L131 114" fill="#fff" stroke="' + GA_INK + '" stroke-width="1.4" stroke-linejoin="round"/>'
};
function gaLab(p, ir) { var x = p[4], y = p[5]; return gaCso(p, 17, GA_FURD) + '<path d="M' + (x - 14 + ir * 4) + ' ' + (y + 8) + 'C' + (x - 15 + ir * 4) + ' ' + (y - 5) + ' ' + (x + 12 + ir * 4) + ' ' + (y - 7) + ' ' + (x + 15 + ir * 4) + ' ' + (y + 8) + 'Z" fill="' + GA_FURD + '" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/>'; }
function garasSVG(o) {
  o = o || {};
  var aL = o.armL || [106, 148, 90, 182, 100, 206], aR = o.armR || [134, 148, 150, 182, 140, 206],
      lL = o.legL || [110, 224, 106, 254, 104, 280], lR = o.legR || [130, 224, 134, 254, 136, 280], j = o.jump || 0, cs = lkCsokkent();
  var s = '<ellipse cx="120" cy="291" rx="' + (j ? 30 : 46) + '" ry="7" fill="#000" opacity=".13"/>';
  s += '<g transform="translate(0 ' + (-j) + ') rotate(' + (o.lean || 0) + ' 120 286)">';
  s += '<g transform="rotate(' + (o.tail || 0) + ' 138 222)"><g>' + (cs ? '' : '<animateTransform attributeName="transform" type="rotate" values="-4 138 222;5 138 222;-4 138 222" dur="3.4s" repeatCount="indefinite"/>') +
    '<path d="M136 226C178 238 218 212 211 166C206 136 186 116 169 125C159 131 161 144 170 152C183 168 182 192 168 205C158 214 148 216 136 212Z" fill="' + GA_FURD + '" stroke="' + GA_INK + '" stroke-width="3.2" stroke-linejoin="round"/>' +
    '<path d="M197 150C202 170 197 190 185 203M187 137C193 146 195 156 193 166" fill="none" stroke="#8d5a37" stroke-width="2.4" stroke-linecap="round"/></g></g>';
  s += gaLab(lL, -1) + gaLab(lR, 1) + (o.hatul || "");
  s += '<path d="M96 228C88 196 92 158 106 136C112 128 128 128 134 136C148 158 152 196 144 228C136 245 104 245 96 228Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="3.4" stroke-linejoin="round"/>';
  s += '<path d="M140 152C150 182 150 212 140 233C134 238 129 238 127 236C137 214 141 184 140 152Z" fill="#000" opacity=".09"/>';
  s += '<path d="M108 136C114 131 126 131 132 136C134 158 130 176 127 190L120 178L113 190C110 176 106 158 108 136Z" fill="' + GA_BIB + '" stroke="' + GA_INK + '" stroke-width="2" stroke-linejoin="round"/>';
  s += '<path d="M96 228C88 196 92 158 106 136L111 139C106 162 106 200 113 238C104 238 99 234 96 228Z" fill="' + GA_VEST + '" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M144 228C152 196 148 158 134 136L129 139C134 162 134 200 127 238C136 238 141 234 144 228Z" fill="' + GA_VEST + '" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<g transform="rotate(-12 102 198)">' + gaTaller(102, 192, 7, 100) + '</g><path d="M93 196Q101 200 110 197L110 210Q101 213 94 209Z" fill="#a58bc9" stroke="' + GA_INK + '" stroke-width="2"/>';
  [170, 190, 210].forEach(function (y) { s += '<circle cx="' + (131 + (y - 170) * .03) + '" cy="' + y + '" r="3" fill="' + GA_GOLD + '" stroke="' + GA_GOLDD + '" stroke-width="1.2"/>'; });
  if (o.ujj) {   /* a mancsán felemelt ujjak: a továbbvitt szám (3TC: az ujjunkon is tarthatjuk) */
    for (var i = 0; i < o.ujj; i++) { var x = aR[4] - (o.ujj - 1) * 3.6 + i * 7.2; s += gaCso([x, aR[5] - 3, x + (i - (o.ujj - 1) / 2) * 1.5, aR[5] - 10, x + (i - (o.ujj - 1) / 2) * 3, aR[5] - 19], 5.5, GA_FURD); }
  }
  if (o.mutat) s += gaCso([aR[4], aR[5], (aR[4] + o.mutat[0]) / 2, (aR[5] + o.mutat[1]) / 2, o.mutat[0], o.mutat[1]], 5.5, GA_FURD);
  s += gaCso(aL, 14, GA_FURD) + (o.kozte || "") + gaCso(aR, 14, GA_FURD);
  s += '<g transform="rotate(' + (o.head || 0) + ' 120 128)">';
  s += '<path d="M86 72C70 64 74 40 93 44C101 46 105 51 107 57Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M89 65C80 59 82 49 92 50C97 51 100 54 101 58Z" fill="' + GA_EAR + '"/>';
  s += '<path d="M154 72C170 64 166 40 147 44C139 46 135 51 133 57Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M151 65C160 59 158 49 148 50C143 51 140 54 139 58Z" fill="' + GA_EAR + '"/>';
  if (o.ceruzaFul !== false) s += '<g transform="rotate(-38 152 58)">' + gaCeruza(178, 58, 0, 26) + '</g>';
  s += '<path d="M85 102L71 115L93 117Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M155 102L169 115L147 117Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M78 88C76 64 96 52 120 52C144 52 164 64 162 88C160 104 146 118 134 126C128 131 112 131 106 126C94 118 80 104 78 88Z" fill="' + GA_FUR + '" stroke="' + GA_INK + '" stroke-width="3.4" stroke-linejoin="round"/>';
  s += '<path d="M150 68C161 84 158 106 140 121C151 104 153 86 150 68Z" fill="#000" opacity=".08"/>';
  s += '<path d="M105 102C105 93 135 93 135 102C135 116 128 127 120 127C112 127 105 116 105 102Z" fill="' + GA_MUZ + '"/>';
  s += gaSzem(o.eyes);
  var b = GA_SZEMOLD[o.brow || "semleges"]; s += '<path d="' + b[0] + "M" + b[1].slice(1) + '" fill="none" stroke="' + GA_INK + '" stroke-width="3.6" stroke-linecap="round"/>';
  s += '<path d="M113 99C113 95 127 95 127 99C127 103 122 106 120 106C118 106 113 103 113 99Z" fill="' + GA_NOSE + '" stroke="' + GA_INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M120 106V110" stroke="' + GA_INK + '" stroke-width="2"/>';
  s += GA_SZAJ[o.mouth || "mosoly"];
  s += '<path d="M101 106L85 102M101 110L85 113M139 106L155 102M139 110L155 113" stroke="' + GA_INK + '" stroke-width="1.5" opacity=".6" stroke-linecap="round"/>';
  s += '<circle cx="137" cy="88" r="13" fill="#e9f6ff" opacity=".35" stroke="' + GA_GOLD + '" stroke-width="3"/><circle cx="137" cy="88" r="13" fill="none" stroke="' + GA_GOLDD + '" stroke-width="1"/><path d="M148 95Q162 118 146 138" fill="none" stroke="' + GA_GOLDD + '" stroke-width="1.6" stroke-dasharray="2 3"/>';
  s += '</g>' + (o.elol || "") + '</g>';
  return s;
}
var GA_CSIPO = [106, 148, 82, 178, 98, 202];
/* a rajzterv 7 póza (+ „vár”: semleges, mancs a csípőn) */
var GARAS_POZ = {
  var: { armL: GA_CSIPO, brow: "semleges" },
  valt: { head: 10, eyes: "le", armL: [106, 148, 90, 188, 104, 212], armR: [134, 148, 152, 186, 140, 210] },
  ujj: { lean: -3, head: -6, brow: "fel", armL: GA_CSIPO, armR: [134, 148, 166, 140, 168, 108], ujj: 2 },
  ir: { head: 12, eyes: "le", mouth: "nyelv", armL: [106, 148, 92, 184, 110, 200], armR: [134, 148, 158, 180, 136, 190],
        kozte: '<g transform="rotate(-8 120 200)"><rect x="96" y="184" width="50" height="34" rx="3" fill="url(#ga-kocka)" stroke="' + GA_INK + '" stroke-width="2.4"/></g>', elol: gaCeruza(121, 201, 135, 24) },
  hm: { head: 14, eyes: "felig", brow: "hm", mouth: "hm", tail: 10, armL: [106, 148, 104, 192, 140, 184], armR: [134, 148, 162, 162, 128, 130] },
  orul: { jump: 22, head: -4, eyes: "zart", brow: "fel", mouth: "nagy", tail: -14, armL: [106, 146, 80, 120, 74, 86], armR: [134, 146, 160, 120, 166, 86],
          legL: [110, 224, 94, 244, 100, 262], legR: [130, 224, 146, 244, 140, 262], elol: gaSzikra(50, 70, 9) + gaSzikra(196, 58, 11) + gaSzikra(184, 120, 7) },
  mutat: { lean: 5, head: 6, armL: GA_CSIPO, armR: [134, 148, 168, 158, 196, 160], mutat: [214, 158] },
  csibesz: { lean: -4, head: -8, eyes: "kacsint", brow: "ravasz", mouth: "ravasz", tail: 8, armL: GA_CSIPO, armR: [134, 148, 168, 170, 160, 140],
    elol: '<path d="M162 132Q170 104 172 76" fill="none" stroke="#d1a23a" stroke-width="1.6" stroke-dasharray="3 5"/><g><animateTransform attributeName="transform" type="translate" values="0 12;0 -10;0 12" dur="1.4s" repeatCount="indefinite"/><g transform="translate(172 64)"><g><animateTransform attributeName="transform" type="scale" values="1 1;.15 1;1 1" dur=".5s" repeatCount="indefinite"/>' + gaTaller(0, 0, 11, 100) + '</g></g></g>' }
};
function garasPoz(nev, extra) { var o = {}, k, p = GARAS_POZ[nev] || GARAS_POZ["var"]; for (k in p) o[k] = p[k]; for (k in (extra || {})) o[k] = extra[k]; return garasSVG(o); }

/* ── a torony kívülről (rajzterv 2.): kő lent, fa fent, lila tető, tallér-szélkakas, ablakok spirálban ── */
function gaTorony(all, eg) {
  var ABL = [[72, 338], [100, 316], [128, 294], [100, 272], [72, 250], [100, 196], [128, 174], [100, 152]], cs = lkCsokkent();
  if (eg == null) eg = all === "kesz" ? 8 : all === "folyik" ? 3 : 0;
  var s = '<ellipse cx="100" cy="362" rx="84" ry="10" fill="#000" opacity=".12"/>';
  s += '<path d="M48 360C49 316 50 270 52 228H148C150 270 151 316 152 360Z" fill="url(#ga-ko)" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/>';
  s += '<path d="M52 256H80M96 256H148M50 286H66M84 286H148M49 316H58M114 316H151M51 344H90M108 344H150M72 242V256M120 256V286M94 300V316M70 330V344" stroke="#9f9284" stroke-width="1.6" fill="none"/>';
  s += '<path d="M58 218C57 186 57 152 58 128H142C143 152 143 186 142 218Z" fill="url(#ga-fa)" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/>';
  s += '<path d="M72 130V216M86 128V218M114 128V218M128 130V216" stroke="#c19a6b" stroke-width="1.4"/>';
  s += '<path d="M42 230C70 226 130 226 158 230V218C130 214 70 214 42 218Z" fill="#b9a99a" stroke="' + GA_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M38 130H162V120H38Z" fill="#c99668" stroke="' + GA_INK + '" stroke-width="2.6"/><path d="M44 120V96M66 120V96M100 120V96M134 120V96M156 120V96" stroke="' + GA_INK + '" stroke-width="3"/><path d="M40 108H160" stroke="' + GA_INK + '" stroke-width="2.4"/>';
  s += '<path d="M34 98C60 74 82 40 100 12C118 40 140 74 166 98C130 104 70 104 34 98Z" fill="url(#ga-teto)" stroke="' + GA_INK + '" stroke-width="3" stroke-linejoin="round"/>';
  s += '<path d="M58 80Q66 84 74 80Q82 84 90 80Q98 84 106 80Q114 84 122 80Q130 84 138 80Q146 84 148 80M74 58Q82 62 90 58Q98 62 106 58Q114 62 122 58Q128 61 128 58M88 38Q96 41 104 38Q110 41 112 38" fill="none" stroke="#6f5aa6" stroke-width="1.5"/>';
  s += '<path d="M100 12V-8" stroke="' + GA_INK + '" stroke-width="2.4"/>' + gaTaller(100, -12, 8, 100);
  if (all === "kesz") s += '<path d="M100 2L122 6L100 11Z" fill="#f4a6b8" stroke="' + GA_INK + '" stroke-width="1.6">' + (cs ? '' : '<animate attributeName="d" values="M100 2L122 6L100 11Z;M100 2L120 8L100 11Z;M100 2L122 6L100 11Z" dur="1.6s" repeatCount="indefinite"/>') + '</path>';
  ABL.forEach(function (a, i) {
    var x = a[0], y = a[1], w = x === 100 ? 7 : 4.5, eg_ = i < eg;
    if (eg_) s += '<circle cx="' + x + '" cy="' + y + '" r="18" fill="url(#ga-feny)"/>';
    s += '<path d="M' + (x - w) + ' ' + (y + 9) + 'V' + (y - 3) + 'Q' + x + ' ' + (y - 13) + ' ' + (x + w) + ' ' + (y - 3) + 'V' + (y + 9) + 'Z" fill="' + (eg_ ? "#ffe08a" : "#7d7896") + '" stroke="' + GA_INK + '" stroke-width="2"/>';
  });
  var nyit = all !== "zart";
  if (all === "uj") s += '<circle cx="100" cy="346" r="34" fill="url(#ga-feny)">' + (cs ? '' : '<animate attributeName="r" values="28;38;28" dur="2.2s" repeatCount="indefinite"/>') + '</circle>';
  s += '<path class="pc-ajto" style="transform-origin:82px 360px" d="M82 360V334Q100 312 118 334V360Z" fill="' + (nyit ? "#ffe9a8" : "#a0714a") + '" stroke="' + GA_INK + '" stroke-width="2.6"/>';
  if (!nyit) s += '<path d="M91 330V360M100 324V360M109 330V360" stroke="#7a5233" stroke-width="1.6"/><circle cx="112" cy="346" r="2" fill="' + GA_INK + '"/>';
  s += '<path d="M148 296H176" stroke="' + GA_INK + '" stroke-width="3"/><path d="M168 296V302M178 296V302" stroke="' + GA_INK + '" stroke-width="1.4"/><g>' +
    (cs ? '' : '<animateTransform attributeName="transform" type="rotate" values="-3 173 302;3 173 302;-3 173 302" dur="3s" repeatCount="indefinite"/>') + gaTaller(173, 318, 14, 100) + '</g>';
  if (all === "uj") s += gaSzikra(60, 330, 7) + gaSzikra(146, 350, 6);
  return s;
}

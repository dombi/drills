/* ============ 6a3) 🦔🦊 LAKÓK — a falu kidolgozott szereplői (Piactér 3. kör, 2026-10-23) ============
   Rajz: terv/piacter-rajzterv.html 3. pont (✅ jóváhagyva 2026-10-23) — a csontváz és a pózok onnan jöttek át, változatlanul.
   A lakó NEM érem-figura (az a figurak.js-ben marad a feladatkártyákhoz): egész alak a ház terében, ≥ 6 póz átmenettel,
   élet a házban (pislog, polcot igazgat, töröl, dúdol), arc-elemek külön (szem, szemöldök, száj, pír).
   CSONTVÁZ: a kéz helyét a póz adja (lx,ly / rx,ry), a könyököt a gép számolja ki (két kör metszéspontja: lkIk).
   Új póz = egy sor a LK_POZ-ban; új lakó = egy LK_RIG sor + rajz-függvény (a falu későbbi lakói is erre épülnek).
   Használat: var L = new Lako(gElem, "tuske", { poz: "var", elet: true }); L.poz("orul"); L.sorLe([["szamol", 1300], ["var", 0]]);
   A rajz 240 × 300-as keretben van (talppont: 120, 288). Mozgáscsökkentésnél csak pislognak, a pózváltás azonnali.
   Egy közös képkocka-hurok fut, és magától leáll, ha egyetlen lakó sincs a lapon. */

function lkF(n) { return (+n).toFixed(1); }
var LK_MQ = null;
function lkCsokkent() {
  try {
    if (LK_MQ === null) LK_MQ = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : false;
    return !!(LK_MQ && LK_MQ.matches) || !!window.__UC_GYORS;
  } catch (e) { return false; }
}
function lkTuskek(cx, cy, r1, r2, a0, a1, n, fill, d, w) {
  var p = [], st = (a1 - a0) / (2 * n);
  for (var i = 0; i <= 2 * n; i++) { var a = (a0 + i * st) * Math.PI / 180, r = i % 2 ? r2 : r1; p.push(lkF(cx + r * Math.cos(a)) + "," + lkF(cy + r * Math.sin(a))); }
  return '<polygon points="' + p.join(" ") + '" fill="' + fill + '" stroke="' + d + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"/>';
}
function lkKv(d, w) { return ' stroke="' + d + '" stroke-width="' + (w || 2.2) + '" stroke-linejoin="round" stroke-linecap="round"'; }
/* felkar (ujj = a ruha ujja), alkar + kéz; a csoportok: .j-?sh (váll körül forog), benne .j-?el (könyök körül) */
function lkKar(S, E, H, ujj, kez, R, kellek) {
  return '<path d="M' + S + 'L' + E + '" stroke="' + R.d + '" stroke-width="15" stroke-linecap="round"/><path d="M' + S + 'L' + E + '" stroke="' + ujj + '" stroke-width="11.5" stroke-linecap="round"/>' +
    '<g class="EL"><path d="M' + E + 'L' + H + '" stroke="' + R.d + '" stroke-width="12" stroke-linecap="round"/><path d="M' + E + 'L' + H + '" stroke="' + R.b + '" stroke-width="8.6" stroke-linecap="round"/>' +
    '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="5.6" fill="' + ujj + '"/>' + (kellek || "") +
    '<circle cx="' + H[0] + '" cy="' + H[1] + '" r="7.6" fill="' + kez + '"' + lkKv(R.d, 2) + '/></g>';
}
/* a közös arc-elemek osztályokkal: szemek, boldog szem, kacsintás, szemöldök, négy száj, pír */
function lkArc(R, o) {
  var s = "", e = o.szem, ink = "#3b2f4a";
  s += '<g class="pir">' + e.map(function (p, i) { return '<ellipse cx="' + (p[0] + (i ? 13 : -13)) + '" cy="' + (p[1] + 14) + '" rx="6.5" ry="4" fill="#f59bb0"/>'; }).join("") + '</g>';
  e.forEach(function (p, i) {
    s += '<g class="e-' + (i ? "r" : "l") + '"><ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="5" ry="6.4" fill="' + ink + '"/><circle cx="' + (p[0] + 1.9) + '" cy="' + (p[1] - 2.4) + '" r="2" fill="#fff"/><circle cx="' + (p[0] - 1.6) + '" cy="' + (p[1] + 2.4) + '" r=".9" fill="#fff" opacity=".8"/></g>';
    s += '<path class="e-boldog-' + (i ? "r" : "l") + '" d="M' + (p[0] - 5.5) + ',' + (p[1] + 1.5) + ' Q' + p[0] + ',' + (p[1] - 5.5) + ' ' + (p[0] + 5.5) + ',' + (p[1] + 1.5) + '" fill="none" stroke="' + ink + '" stroke-width="2.8" stroke-linecap="round"/>';
  });
  var w = e[1];
  s += '<path class="e-kacs" d="M' + (w[0] - 6) + ',' + (w[1] + .5) + ' Q' + w[0] + ',' + (w[1] + 4.5) + ' ' + (w[0] + 6) + ',' + (w[1] - .5) + '" fill="none" stroke="' + ink + '" stroke-width="2.8" stroke-linecap="round"/>';
  e.forEach(function (p, i) {
    var x = p[0], y = o.szemoY;
    s += '<path class="b-' + (i ? "r" : "l") + '" d="M' + (x - 6) + ',' + (y + (i ? 1 : 0)) + ' Q' + x + ',' + (y - 3) + ' ' + (x + 6) + ',' + (y + (i ? 0 : 1)) + '" fill="none" stroke="' + o.szemoSzin + '" stroke-width="3" stroke-linecap="round"/>';
  });
  var m = o.szaj, hw = o.hw || 7.5;
  s += '<path class="m-mos" d="M' + (m[0] - hw) + ',' + m[1] + ' Q' + m[0] + ',' + (m[1] + 7) + ' ' + (m[0] + hw) + ',' + m[1] + '" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round"/>';
  s += '<g class="m-nyit"><path d="M' + (m[0] - hw - 1.5) + ',' + (m[1] - 1) + ' Q' + m[0] + ',' + (m[1] + 14) + ' ' + (m[0] + hw + 1.5) + ',' + (m[1] - 1) + ' Z" fill="#b8475f"' + lkKv(ink, 2) + '/><ellipse cx="' + m[0] + '" cy="' + (m[1] + 6.5) + '" rx="4" ry="2.6" fill="#f59bb0"/></g>';
  s += '<ellipse class="m-o" cx="' + m[0] + '" cy="' + (m[1] + 3) + '" rx="4.4" ry="5.6" fill="#b8475f"' + lkKv(ink, 2) + '/>';
  s += '<path class="m-lapos" d="M' + (m[0] - hw * .6) + ',' + (m[1] + 2) + ' Q' + (m[0] + 1) + ',' + (m[1] + 4) + ' ' + (m[0] + hw * .8) + ',' + (m[1] + .5) + '" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round"/>';
  return s;
}

var LK_RIG = {
  tuske: {
    b: "#ecd0ad", d: "#6d5446", l: "#fbeede", tu: "#a8988e", tu2: "#c4b6ac", ruha: "#9ec9f0", ruhaD: "#5f84b0",
    S: { l: [98, 180], r: [142, 180] }, E: { l: [86, 210], r: [154, 210] }, H: { l: [90, 240], r: [150, 240] },
    nyak: [120, 166], talp: [120, 288], tuK: [120, 212], kozep: 120,
    szem: [[106.4, 129.5], [133.6, 129.5]], fejK: [120, 132]
  },
  juli: {
    b: "#f4a15e", d: "#b35f28", l: "#fff4e8", ruha: "#f4a15e",
    S: { l: [101, 160], r: [139, 160] }, E: { l: [92, 190], r: [148, 190] }, H: { l: [95, 220], r: [145, 220] },
    nyak: [120, 140], talp: [120, 288], tuK: [146, 252], kozep: 120,
    szem: [[107.4, 103.7], [132.6, 103.7]], fejK: [120, 106]
  }
};

/* Tüske néni: kötény (csipkés szegély, zseb zsebkendővel, masni), kendő pöttyökkel, szemüveg, ceruza a tüskék közt */
LK_RIG.tuske.rajz = function () {
  var R = this, s = "";
  s += '<ellipse cx="120" cy="290" rx="58" ry="7" fill="#3c2a50" opacity=".14"/>';
  s += '<g class="j-all">';
  s += '<g class="j-tu">' + lkTuskek(120, 212, 46, 72, 148, 392, 13, "#8f7f76", R.d) + lkTuskek(120, 212, 42, 60, 154, 386, 12, R.tu, R.tu) + '</g>';
  s += '<path d="M104,262 V282 M136,262 V282" stroke="' + R.d + '" stroke-width="13" stroke-linecap="round"/><path d="M104,262 V282 M136,262 V282" stroke="' + R.b + '" stroke-width="9.5" stroke-linecap="round"/>';
  s += '<ellipse cx="100" cy="286" rx="15" ry="6.5" fill="#f6a5c0"' + lkKv("#b5607e") + '/><ellipse cx="140" cy="286" rx="15" ry="6.5" fill="#f6a5c0"' + lkKv("#b5607e") + '/><circle cx="92" cy="283" r="3.4" fill="#fff"/><circle cx="148" cy="283" r="3.4" fill="#fff"/>';
  s += '<path d="M120,158 C96,158 78,186 75,220 C72,254 90,274 120,274 C150,274 168,254 165,220 C162,186 144,158 120,158 Z" fill="' + R.ruha + '"' + lkKv(R.d, 2.4) + '/>';
  s += [[86, 222], [94, 252], [152, 230], [146, 258], [158, 206], [84, 198]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.3" fill="#fff" opacity=".9"/>'; }).join("");
  s += '<path d="M97,178 Q120,173 143,178 L152,258 Q120,270 88,258 Z" fill="#fff"' + lkKv("#e38aa6", 2.2) + '/>';
  s += '<path d="M90,258' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var x = 90 + (i + 1) * 7.75; return ' Q' + lkF(x - 3.9) + ',' + (i % 2 ? 268 : 266) + ' ' + lkF(x) + ',' + (258 + Math.sin((i + 1) / 8 * Math.PI) * 9); }).join("") + '" fill="none" stroke="#f6a5c0" stroke-width="2"/>';
  s += '<rect x="108" y="222" width="24" height="18" rx="5" fill="#fff4f8"' + lkKv("#e38aa6", 1.8) + '/><path d="M114,222 l4,-7 l5,5 l4,-5 l2,7" fill="#c9aee6"' + lkKv("#7a5ca8", 1.2) + '/>';
  s += '<path d="M85,206 q-11,-8 -13,2 q4,6 13,-2 q-8,10 -4,15 M85,206 q-4,9 2,14" fill="#fff"' + lkKv("#e38aa6", 1.6) + '/>';
  s += '<g class="j-fej">';
  s += lkTuskek(120, 132, 31, 52, 160, 380, 12, "#8f7f76", R.d) + lkTuskek(120, 132, 29, 44, 166, 374, 11, R.tu, R.tu);
  s += '<g class="p-ceruT"><path d="M152,116 L170,94" stroke="#6d5446" stroke-width="7" stroke-linecap="round"/><path d="M152,116 L170,94" stroke="#fcd66a" stroke-width="4.6" stroke-linecap="butt"/><path d="M170,94 l3,-4" stroke="#f2a3b8" stroke-width="4.6" stroke-linecap="round"/><path d="M152,116 l-3,4" stroke="#3b2f4a" stroke-width="2.6" stroke-linecap="round"/></g>';
  s += '<ellipse cx="120" cy="132" rx="37" ry="33.3" fill="' + R.b + '"' + lkKv(R.d, 2.4) + '/>';
  s += '<ellipse cx="120" cy="147" rx="17" ry="12" fill="' + R.l + '"/>';
  s += lkArc(R, { szem: R.szem, szemoY: 116.5, szemoSzin: "#8a6650", szaj: [120, 150.5], hw: 7.4 });
  s += '<circle cx="120" cy="141.5" r="4.6" fill="#4a3a3a"/><circle cx="118.6" cy="140" r="1.4" fill="#fff" opacity=".7"/>';
  s += '<g class="j-uveg"><circle cx="106.4" cy="129.5" r="9.6" fill="#fff" fill-opacity=".14" stroke="#7a5ca8" stroke-width="2.2"/><circle cx="133.6" cy="129.5" r="9.6" fill="#fff" fill-opacity=".14" stroke="#7a5ca8" stroke-width="2.2"/><path d="M116,128.5 Q120,125.5 124,128.5" fill="none" stroke="#7a5ca8" stroke-width="2.2"/><path d="M98,124 l3,-1.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></g>';
  s += '<path d="M78,136 Q72,81 120,80 Q168,81 162,136 Q141,111 120,111 Q99,111 78,136 Z" fill="#c9aee6"' + lkKv("#7a5ca8", 2.2) + '/>';
  s += [[100.3, 96.2], [120, 88.8], [139.7, 96.2], [111.4, 106], [128.6, 106], [88, 112], [152, 112]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.1" fill="#fff"/>'; }).join("");
  s += '<ellipse cx="160" cy="134" rx="5.4" ry="4" fill="#c9aee6"' + lkKv("#7a5ca8", 1.8) + '/><path d="M161,137 L166,148 L159,145 Z M158,137 L157,149 L153,144 Z" fill="#c9aee6"' + lkKv("#7a5ca8", 1.5) + '/>';
  s += '</g>';
  /* karok — a fej előtt, hogy a kéz az arcához érhessen; a jobb kézben: tallér / rongy / ceruza (a póz kapcsolja) */
  var ermeKez = '<g class="p-erme" transform="translate(' + (R.H.r[0] + 2) + ' ' + (R.H.r[1] - 8) + ')">' + tallerBelso(10, .7) + '</g>';
  var ceruKez = '<g class="p-ceruK"><path d="M' + (R.H.r[0] - 2) + ',' + (R.H.r[1] + 4) + ' l14,-22" stroke="#6d5446" stroke-width="7" stroke-linecap="round"/><path d="M' + (R.H.r[0] - 2) + ',' + (R.H.r[1] + 4) + ' l14,-22" stroke="#fcd66a" stroke-width="4.6"/></g>';
  var rongy = '<path class="p-rongy" d="M' + (R.H.r[0] - 10) + ',' + (R.H.r[1] + 2) + ' q8,-6 18,0 q2,8 -4,12 q-8,2 -14,-4 z" fill="#9ec9f0"' + lkKv(R.ruhaD, 1.5) + '/>';
  s += '<g class="j-lsh">' + lkKar(R.S.l, R.E.l, R.H.l, R.ruha, R.b, R).replace('class="EL"', 'class="j-lel"') + '</g>';
  s += '<g class="j-rsh">' + lkKar(R.S.r, R.E.r, R.H.r, R.ruha, R.b, R, ermeKez + rongy + ceruKez).replace('class="EL"', 'class="j-rel"') + '</g>';
  s += '</g>';
  return s;
};

/* Zsivány (a róka): bozontos farok, pénztáros-táska, zöld sál, blokkfüzet a bal kézben, ceruza a füle mögött */
LK_RIG.juli.rajz = function () {
  var R = this, s = "", sotet = "#5a3a2a";
  s += '<ellipse cx="120" cy="290" rx="50" ry="7" fill="#3c2a50" opacity=".14"/>';
  s += '<g class="j-all">';
  s += '<g class="j-farok"><g class="j-tu"><path d="M136,258 C178,266 220,240 214,196 C211,174 198,164 186,168 C198,186 196,214 178,228 C164,238 150,242 136,242 Z" fill="' + R.b + '"' + lkKv(R.d, 2.4) + '/>' +
    '<path d="M186,168 C198,163 211,174 214,196 C207,190 199,185 192,183 C190,178 188,173 186,168 Z" fill="#fff"' + lkKv(R.d, 2) + '/>' +
    '<path d="M150,248 C172,248 192,234 200,212" fill="none" stroke="#f8c08e" stroke-width="5" stroke-linecap="round" opacity=".8"/></g></g>';
  s += '<path d="M108,258 V282 M132,258 V282" stroke="' + R.d + '" stroke-width="12" stroke-linecap="round"/><path d="M108,258 V270 M132,258 V270" stroke="' + R.b + '" stroke-width="8.6" stroke-linecap="round"/><path d="M108,270 V282 M132,270 V282" stroke="' + sotet + '" stroke-width="8.6" stroke-linecap="round"/>';
  s += '<ellipse cx="105" cy="286" rx="12" ry="5.5" fill="' + sotet + '"/><ellipse cx="135" cy="286" rx="12" ry="5.5" fill="' + sotet + '"/>';
  s += '<path d="M120,140 C100,140 88,166 86,200 C84,238 96,264 120,264 C144,264 156,238 154,200 C152,166 140,140 120,140 Z" fill="' + R.b + '"' + lkKv(R.d, 2.4) + '/>';
  s += '<path d="M120,156 C106,156 100,180 100,206 C100,236 108,254 120,254 C132,254 140,236 140,206 C140,180 134,156 120,156 Z" fill="' + R.l + '"/>';
  s += '<path d="M104,150 L150,226" stroke="#7a5ca8" stroke-width="3.4" stroke-linecap="round"/><rect x="140" y="220" width="24" height="20" rx="5" fill="#c9aee6"' + lkKv("#7a5ca8", 2) + '/><path d="M140,228 H164" stroke="#7a5ca8" stroke-width="1.6"/><circle cx="152" cy="232" r="2.4" fill="#fce49a"' + lkKv("#d1a23a", 1) + '/>';
  s += '<g class="j-fej">';
  s += '<g class="j-ful-l"><path d="M92.4,92.2 L85.5,55.4 L115.4,78.4 Z" fill="' + R.b + '"' + lkKv(R.d, 2.2) + '/><path d="M94.7,85.3 L91.3,65.8 L107.4,78.4 Z" fill="' + R.l + '"/><path d="M85.5,55.4 L87.8,66.9 L97,62.3 Z" fill="' + sotet + '"/></g>';
  s += '<g class="j-ful-r"><path d="M147.6,92.2 L154.5,55.4 L124.6,78.4 Z" fill="' + R.b + '"' + lkKv(R.d, 2.2) + '/><path d="M145.3,85.3 L148.7,65.8 L132.6,78.4 Z" fill="' + R.l + '"/><path d="M154.5,55.4 L152.2,66.9 L143,62.3 Z" fill="' + sotet + '"/>' +
    '<g class="p-ceruF"><path d="M136,86 L166,66" stroke="#6d5446" stroke-width="7" stroke-linecap="round"/><path d="M136,86 L166,66" stroke="#fcd66a" stroke-width="4.6"/><path d="M166,66 l4,-2.6" stroke="#f2a3b8" stroke-width="4.6" stroke-linecap="round"/></g></g>';
  s += '<ellipse cx="120" cy="106" rx="34.5" ry="31" fill="' + R.b + '"' + lkKv(R.d, 2.4) + '/>';
  s += '<path d="M86.6,110.6 Q103.9,106 120,119.8 Q136.1,106 153.4,110.6 Q145.3,137 120,137 Q94.7,137 86.6,110.6 Z" fill="' + R.l + '"/>';
  s += '<path d="M104,80 Q112,74 120,80 Q128,74 136,80" fill="none" stroke="' + R.d + '" stroke-width="1.6" opacity=".5"/>';
  s += lkArc(R, { szem: R.szem, szemoY: 92, szemoSzin: R.d, szaj: [120, 125], hw: 7 });
  s += '<ellipse cx="120" cy="117.5" rx="4.6" ry="3.6" fill="#3a2a2a"/><circle cx="118.6" cy="116.4" r="1.2" fill="#fff" opacity=".7"/>';
  s += '</g>';
  s += '<path d="M96,138 Q120,150 144,138 L145,148 Q120,160 95,148 Z" fill="#8fd18a"' + lkKv("#4f8f42", 2) + '/><path d="M132,148 L138,182 L147,179 L141,146 Z" fill="#8fd18a"' + lkKv("#4f8f42", 2) + '/><path d="M135,165 h8 M136.6,172 h8" stroke="#d9f5cf" stroke-width="2"/>';
  var H = R.H.l, blokk = '<g class="p-blokk" transform="translate(' + (H[0] + 6) + ' ' + (H[1] - 4) + ')"><g class="p-blokkN"><rect x="-15" y="-20" width="30" height="38" rx="3" fill="#fffef6"' + lkKv("#8a7a6e", 1.8) + '/><rect x="-15" y="-20" width="30" height="7" rx="2" fill="#f6a5c0"/>' +
    '<path d="M-10,-6 h20 M-10,0 h20 M-10,6 h14 M-10,12 h20" stroke="#9ec9f0" stroke-width="1.4"/><path d="M-8,-23 v5 M0,-23 v5 M8,-23 v5" stroke="#8a7a6e" stroke-width="2" stroke-linecap="round"/></g></g>';
  var Hr = R.H.r, ceruKez = '<g class="p-ceruK"><path d="M' + (Hr[0] + 2) + ',' + (Hr[1] + 6) + ' l-12,-20" stroke="#6d5446" stroke-width="7" stroke-linecap="round"/><path d="M' + (Hr[0] + 2) + ',' + (Hr[1] + 6) + ' l-12,-20" stroke="#fcd66a" stroke-width="4.6"/></g>';
  s += '<g class="j-lsh">' + lkKar(R.S.l, R.E.l, R.H.l, R.b, sotet, R, "").replace('class="EL"', 'class="j-lel"').replace(/<\/g>$/, blokk + '</g>') + '</g>';
  s += '<g class="j-rsh">' + lkKar(R.S.r, R.E.r, R.H.r, R.b, sotet, R, ceruKez).replace('class="EL"', 'class="j-rel"') + '</g>';
  s += '</g>';
  return s;
};

/* alap-értékek és pózok (a hiányzó kulcs = alap) */
var LK_ALAP = {
  tuske: { lean: 0, bob: 0, tu: 1, hr: 0, hdx: 0, hdy: 0, lx: 111, ly: 228, rx: 129, ry: 228, open: 1, wide: 0, edx: 0, edy: 0, happy: 0, wink: 0, browY: 0, browR: 0,
           mos: 1, nyit: 0, o: 0, lapos: 0, pir: .45, erme: 0, ceruK: 0, ceruT: 1, rongy: 0, uveg: 0, farok: 0, ful: 0, blokkFel: 0, ceruF: 1 },
  juli:  { lean: 0, bob: 0, tu: 1, hr: 0, hdx: 0, hdy: 0, lx: 108, ly: 194, rx: 152, ry: 212, open: 1, wide: 0, edx: 0, edy: 0, happy: 0, wink: 0, browY: 0, browR: 0,
           mos: 1, nyit: 0, o: 0, lapos: 0, pir: .4, erme: 0, ceruK: 0, ceruT: 0, rongy: 0, uveg: 0, farok: 0, ful: 0, blokkFel: 0, ceruF: 1 }
};
var LK_OLDAL = { "tuske.gondol": { r: "be" }, "juli.gondol": { r: "be" }, "juli.szamol": { r: "ki" } };   /* póz → könyök-oldal */
var LK_POZ = {
  tuske: {
    var:     { },
    koszon:  { rx: 176, ry: 150, nyit: .7, mos: .3, hr: -4, browY: -2, pir: .7 },
    szamol:  { lx: 104, ly: 234, rx: 136, ry: 238, edy: 3, hdy: 3, browY: -1, erme: 1, mos: .4, nyit: .3 },
    orul:    { lx: 62, ly: 128, rx: 178, ry: 128, happy: 1, nyit: 1, mos: 0, pir: 1, browY: -3 },
    meglep:  { lx: 84, ly: 154, rx: 156, ry: 154, wide: 1, browY: -6, o: 1, mos: 0, tu: 1.1, lean: -3, edy: -1 },
    integet: { rx: 174, ry: 116, mos: .6, nyit: .4, hr: 4, pir: .7 },
    gondol:  { rx: 129, ry: 164, lx: 100, ly: 238, edx: 2, edy: -3, mos: 0, lapos: 1, browR: 8, hr: -5 },
    ceruza:  { rx: 164, ry: 120, ceruK: 1, ceruT: 0, hr: 6, edx: 3, edy: -2 },
    ceruza2: { rx: 164, ry: 120, ceruK: 0, ceruT: 1, hr: 6, edx: 3, edy: -2, mos: 1 },
    iras:    { rx: 132, ry: 236, lx: 108, ly: 238, ceruK: 1, ceruT: 0, edy: 3, hdy: 3, lapos: .6, mos: .4 },
    uveg:    { rx: 124, ry: 143, uveg: 0, edy: -1, mos: .5, lapos: .5 },
    polc:    { lx: 52, ly: 152, hr: -8, edx: -3, edy: -2, lean: -2 },
    torol:   { rx: 150, ry: 252, rongy: 1, edy: 3, hdy: 2, mos: .6 },
    mutat:   { rx: 190, ry: 134, edx: 2, edy: -2, hr: 4, mos: .7 },
    dudol:   { o: .5, mos: .3, happy: .6 }
  },
  juli: {
    var:     { },
    koszon:  { rx: 172, ry: 126, nyit: .7, mos: .3, hr: 4, browY: -2, ful: 6 },
    szamol:  { lx: 110, ly: 196, rx: 114, ry: 194, ceruK: 1, ceruF: 0, edy: 3, hdy: 2, browY: -1, mos: .5, nyit: .2 },
    orul:    { lx: 66, ly: 104, rx: 174, ry: 104, happy: 1, nyit: 1, mos: 0, pir: .9, browY: -3, ful: 8 },
    meglep:  { lx: 88, ly: 134, rx: 152, ry: 134, wide: 1, browY: -6, o: 1, mos: 0, tu: 1.15, lean: -3, ful: -12 },
    integet: { rx: 170, ry: 98, mos: .6, nyit: .4, hr: 4 },
    gondol:  { rx: 126, ry: 140, lx: 100, ly: 200, edx: 2, edy: -3, mos: 0, lapos: 1, browR: 8, hr: -5 },
    kacsint: { wink: 1, mos: 1, browR: -9, browY: -1, hr: 7, lean: 2, rx: 154, ry: 210, pir: .8 },
    mutat:   { lx: 120, ly: 166, blokkFel: 1, mos: .8, nyit: .3, hr: -3, edy: 2 },
    fulrez:  { ful: 10 }
  }
};
/* pózon belüli mozgás: (v, t mp a póz óta) */
var LK_HUROK = {
  tuske: {
    koszon: function (v, t) { if (t < 1.6) { v.rx += 7 * Math.sin(t * 9); v.hr += -4 * Math.sin(t * 5); } v.nyit += t < 1.2 ? .25 * Math.sin(t * 14) : 0; },
    szamol: function (v, t) { v.ry -= 5 * Math.abs(Math.sin(t * 5)); v.nyit = .15 + .35 * Math.abs(Math.sin(t * 8)); },
    orul: function (v, t) { if (t < 1.8) v.bob -= 7 * Math.abs(Math.sin(t * 6)); },
    integet: function (v, t) { v.rx += 12 * Math.sin(t * 9); },
    meglep: function (v, t) { v.tu += .03 * Math.sin(t * 40) * Math.max(0, 1 - t); },
    torol: function (v, t) { v.rx += 24 * Math.sin(t * 4); },
    iras: function (v, t) { v.rx += 3 * Math.sin(t * 18); v.ry += 2 * Math.sin(t * 11); },
    dudol: function (v, t) { v.hr += 5 * Math.sin(t * 3); v.o = .35 + .25 * Math.sin(t * 6); v.bob += 1.2 * Math.sin(t * 6); },
    mutat: function (v, t) { v.rx += 2.5 * Math.sin(t * 11); v.ry -= 2.5 * Math.abs(Math.sin(t * 11)); }
  },
  juli: {
    koszon: function (v, t) { if (t < 1.6) v.rx += 7 * Math.sin(t * 9); v.nyit += t < 1.2 ? .25 * Math.sin(t * 14) : 0; },
    szamol: function (v, t) { v.rx += 4 * Math.sin(t * 22); v.ry += 2 * Math.sin(t * 13); v.nyit = .1 + .3 * Math.abs(Math.sin(t * 9)); },
    orul: function (v, t) { if (t < 1.8) v.bob -= 8 * Math.abs(Math.sin(t * 6)); v.farok += 10 * Math.sin(t * 10); },
    integet: function (v, t) { v.rx += 12 * Math.sin(t * 9); v.farok += 6 * Math.sin(t * 9); },
    meglep: function (v, t) { v.ful += 3 * Math.sin(t * 30) * Math.max(0, 1 - t); },
    kacsint: function (v, t) { v.farok += 8 * Math.sin(t * 7); },
    fulrez: function (v, t) { v.ful = 10 * Math.sin(t * 25) * Math.max(0, 1 - t * 1.5); }
  }
};
var LK_ALAPHUROK = { tuske: function () {}, juli: function (v, now) { v.farok += 4 * Math.sin(now / 1000 * 1.8); } };
/* élet a házban: amíg a gyerek gondolkodik, apróságok (nem vonhatja el a figyelmet: lassú, ritka, csendes) */
var LK_ELET = {
  tuske: [["polc", 1700], ["torol", 2400], ["uvegsor"], ["dudol", 2200], ["ceruzasor"], ["var", 1200]],
  juli: [["szamol", 1600], ["kacsint", 1300], ["fulrez", 900], ["mutat", 1500], ["var", 1200]]
};
var LK_SOROK = {
  tuske: { ceruzasor: [["iras", 1100], ["ceruza", 650], ["ceruza2", 450], ["var", 0]], uvegsor: [["uveg", 900], ["var", 0]] },
  juli: {}
};
/* a lakók szavajárása (rajzterv „szavajárás-tábla”; becézés nélkül — lakok-normalisan-beszeljenek) */
var LK_MONDAT = {
  tuske: { koszon: "Szia! Beállsz ma a pult mögé?", var: "Ráérünk, nem sietünk.", orul: "Na, ez aztán szép munka volt!",
           meglep: "Jaj, a tüskéim! Ez nem jön ki…", integet: "Gyere máskor is!", gondol: "Hmm. Nézzük csak meg még egyszer, együtt." },
  juli: { koszon: "Szia! Villámgyorsan összeadok mindent!", var: "Na, mehet a pecsét, főnök?", szamol: "Ez meg ez… kész is! Gyors voltam, mi?", orul: "Pecsét rajta! Ma senki nem jár rosszul!",
          meglep: "Hoppá, elkapkodtam!", integet: "Pá! Holnap is ellenőrzöl?", gondol: "Hmm… hol hagytam el azt a tízest?", kacsint: "Ezt most jól elkaptad!", mutat: "Nézd csak meg te is!" }
};

/* két kör metszéspontja: a könyök → [vállszög, könyökszög] */
function lkIk(S, E0, H0, T, oldal, kozep) {
  var L1 = Math.hypot(E0[0] - S[0], E0[1] - S[1]), L2 = Math.hypot(H0[0] - E0[0], H0[1] - E0[1]);
  var dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  d = Math.max(Math.abs(L1 - L2) + .01, Math.min(L1 + L2 - .01, d));
  var a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  var px = S[0] + ux * a, py = S[1] + uy * a;
  var c1 = [px - uy * h, py + ux * h], c2 = [px + uy * h, py - ux * h];
  var ki1 = Math.abs(c1[0] - kozep) > Math.abs(c2[0] - kozep);
  var E = (oldal === "be") ? (ki1 ? c2 : c1) : (ki1 ? c1 : c2);
  var Tx = S[0] + ux * d, Ty = S[1] + uy * d;
  var a1 = Math.atan2(E0[1] - S[1], E0[0] - S[0]), a2 = Math.atan2(H0[1] - E0[1], H0[0] - E0[0]);
  var sh = Math.atan2(E[1] - S[1], E[0] - S[0]) - a1, el = Math.atan2(Ty - E[1], Tx - E[0]) - a2 - sh;
  function n(x) { x = x * 180 / Math.PI; while (x > 180) x -= 360; while (x <= -180) x += 360; return x; }
  return [n(sh), n(el)];
}

var LAKOK = [], LK_FUT = false;
var LK_ELEMEK = ["j-all", "j-tu", "j-fej", "j-lsh", "j-lel", "j-rsh", "j-rel", "e-l", "e-r", "e-boldog-l", "e-boldog-r", "e-kacs", "b-l", "b-r", "m-mos", "m-nyit", "m-o", "m-lapos", "pir",
                 "p-erme", "p-ceruK", "p-ceruT", "p-rongy", "j-uveg", "j-farok", "j-ful-l", "j-ful-r", "p-blokkN", "p-ceruF"];
function Lako(root, k, o) {
  o = o || {};
  this.root = root; this.k = k; this.R = LK_RIG[k];
  root.innerHTML = this.R.rajz();
  var el = this.el = {};
  LK_ELEMEK.forEach(function (c) { el[c] = root.querySelector("." + c); });
  var cur = this.cur = {}, a; for (a in LK_ALAP[k]) cur[a] = LK_ALAP[k][a];
  this.oldal = { l: "ki", r: "ki" };
  this.elet = !!o.elet;
  var most = lkMost();
  this.kovPislog = most + 1500 + Math.random() * 2500; this.pislogIg = 0;
  this.kovElet = most + 3000 + Math.random() * 3000; this.sor = null; this.uvegCsuszik = 0;
  this.poz(o.poz || "var", true);
  LAKOK = LAKOK.filter(function (L) { return L.root.isConnected; });   /* a régi (eltűnt) jelenetek lakói ne fussanak tovább */
  LAKOK.push(this);
  lkInditas();
}
function lkMost() { return typeof performance !== "undefined" ? performance.now() : Date.now(); }
Lako.prototype.poz = function (nev, azonnal, dur) {
  var k = this.k;
  if (LK_SOROK[k][nev]) return this.sorLe(LK_SOROK[k][nev]);
  var cel = {}, a, p = LK_POZ[k][nev] || {};
  for (a in LK_ALAP[k]) cel[a] = LK_ALAP[k][a];
  for (a in p) cel[a] = p[a];
  var from = {}; for (a in this.cur) from[a] = this.cur[a];
  this.from = from; this.to = cel;
  this.t0 = lkMost(); this.dur = (azonnal || lkCsokkent()) ? 0 : (dur || 430);
  this.pozNev = nev; this.pozT = this.t0;
  var ol = LK_OLDAL[k + "." + nev] || {}; this.oldal = { l: ol.l || "ki", r: ol.r || "ki" };
};
/* mozdulatsor: [[póz, ms], …]; a végén kesz() */
Lako.prototype.sorLe = function (lista, kesz) {
  var self = this, i = 0;
  clearTimeout(this.sorT);
  (function lep() {
    if (i >= lista.length) { self.sor = null; if (kesz) kesz(); return; }
    var p = lista[i++]; self.poz(p[0]); self.sor = true;
    self.sorT = setTimeout(lep, p[1] || 0);
  })();
};
/* a játék szól közbe (a gyerek csinált valamit): az élet egy időre elhallgat */
Lako.prototype.megszakit = function () { clearTimeout(this.sorT); this.sor = null; this.kovElet = lkMost() + 6000; };
/* egy póz egy ideig, aztán vissza a várakozáshoz */
Lako.prototype.pozIdeig = function (nev, ms) {
  var self = this; this.megszakit(); this.poz(nev);
  this.sorT = setTimeout(function () { self.poz("var"); self.kovElet = lkMost() + 5000; }, ms || 2200);
};
Lako.prototype.keret = function (now) {
  var p = this.dur ? Math.min(1, (now - this.t0) / this.dur) : 1, e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, v = {}, a, k = this.k, cs = lkCsokkent();
  for (a in this.to) { var f = this.from[a], t = this.to[a]; v[a] = this.cur[a] = f + (t - f) * e; }
  var tp = (now - this.pozT) / 1000;
  if (!cs) {
    v.bob += .9 * Math.sin(now / 1000 * 2.1);
    if (LK_HUROK[k][this.pozNev]) LK_HUROK[k][this.pozNev](v, tp);
    LK_ALAPHUROK[k](v, now);
  }
  /* Tüske néni szemüvege lassan lecsúszik, a „szemüveg” mozdulat visszatolja */
  if (k === "tuske") {
    if (this.pozNev === "uveg" && tp > .35) this.uvegCsuszik = Math.max(0, this.uvegCsuszik - .2);
    else if (!cs) this.uvegCsuszik = Math.min(4, this.uvegCsuszik + .0025);
    v.uveg += this.uvegCsuszik;
  }
  if (now > this.kovPislog) { this.pislogIg = now + 130; this.kovPislog = now + 2600 + Math.random() * 3200; if (Math.random() < .2) this.kovPislog = now + 260; }
  var pis = now < this.pislogIg ? .1 : 1;
  if (this.elet && !this.sor && this.pozNev === "var" && now > this.kovElet && !cs) {
    var lista = LK_ELET[k], m = lista[Math.floor(Math.random() * lista.length)];
    this.kovElet = now + 4200 + Math.random() * 3500;
    if (LK_SOROK[k][m[0]]) this.sorLe(LK_SOROK[k][m[0]]); else this.sorLe([[m[0], m[1]], ["var", 0]]);
  }
  this.alkalmaz(v, pis);
};
Lako.prototype.alkalmaz = function (v, pis) {
  var R = this.R, el = this.el;
  el["j-all"].setAttribute("transform", "translate(0 " + lkF(v.bob) + ") rotate(" + lkF(v.lean) + " " + R.talp + ")");
  el["j-tu"].setAttribute("transform", "translate(" + R.tuK + ") scale(" + v.tu.toFixed(3) + ") translate(" + (-R.tuK[0]) + " " + (-R.tuK[1]) + ")");
  el["j-fej"].setAttribute("transform", "translate(" + lkF(v.hdx) + " " + lkF(v.hdy) + ") rotate(" + lkF(v.hr) + " " + R.nyak + ")");
  var L = lkIk(R.S.l, R.E.l, R.H.l, [v.lx, v.ly], this.oldal.l, R.kozep), Rr = lkIk(R.S.r, R.E.r, R.H.r, [v.rx, v.ry], this.oldal.r, R.kozep);
  el["j-lsh"].setAttribute("transform", "rotate(" + lkF(L[0]) + " " + R.S.l + ")"); el["j-lel"].setAttribute("transform", "rotate(" + lkF(L[1]) + " " + R.E.l + ")");
  el["j-rsh"].setAttribute("transform", "rotate(" + lkF(Rr[0]) + " " + R.S.r + ")"); el["j-rel"].setAttribute("transform", "rotate(" + lkF(Rr[1]) + " " + R.E.r + ")");
  var sz = R.szem, sx = 1 + v.wide * .18, sy = Math.max(.08, v.open * (1 + v.wide * .25) * pis);
  [["e-l", sz[0], 1], ["e-r", sz[1], 1 - v.wink]].forEach(function (q) {
    el[q[0]].setAttribute("transform", "translate(" + lkF(q[1][0] + v.edx) + " " + lkF(q[1][1] + v.edy) + ") scale(" + sx.toFixed(3) + " " + Math.max(.06, sy * q[2]).toFixed(3) + ") translate(" + (-q[1][0]) + " " + (-q[1][1]) + ")");
  });
  el["e-l"].setAttribute("opacity", lkF(1 - v.happy)); el["e-r"].setAttribute("opacity", lkF((1 - v.happy) * (v.wink > .5 ? 0 : 1)));
  el["e-boldog-l"].setAttribute("opacity", lkF(v.happy)); el["e-boldog-r"].setAttribute("opacity", lkF(v.happy * (1 - v.wink)));
  el["e-kacs"].setAttribute("opacity", lkF(v.wink));
  el["b-l"].setAttribute("transform", "translate(0 " + lkF(v.browY - v.wide * 1) + ") rotate(" + lkF(-v.browR * .4) + " " + sz[0] + ")");
  el["b-r"].setAttribute("transform", "translate(0 " + lkF(v.browY + (v.browR < 0 ? v.browR * .5 : 0)) + ") rotate(" + lkF(v.browR) + " " + sz[1] + ")");
  var ossz = v.mos + v.nyit + v.o + v.lapos || 1;
  el["m-mos"].setAttribute("opacity", (v.mos / ossz).toFixed(2)); el["m-nyit"].setAttribute("opacity", (v.nyit / ossz).toFixed(2));
  el["m-o"].setAttribute("opacity", (v.o / ossz).toFixed(2)); el["m-lapos"].setAttribute("opacity", (v.lapos / ossz).toFixed(2));
  el["pir"].setAttribute("opacity", (v.pir * .7).toFixed(2));
  function op(c, x) { if (el[c]) el[c].setAttribute("opacity", Math.max(0, Math.min(1, x)).toFixed(2)); }
  op("p-erme", v.erme); op("p-ceruK", v.ceruK); op("p-ceruT", v.ceruT); op("p-rongy", v.rongy); op("p-ceruF", v.ceruF);
  if (el["j-uveg"]) el["j-uveg"].setAttribute("transform", "translate(0 " + lkF(v.uveg) + ")");
  if (el["j-farok"]) el["j-farok"].setAttribute("transform", "rotate(" + lkF(v.farok) + " 140 250)");
  if (el["j-ful-l"]) { el["j-ful-l"].setAttribute("transform", "rotate(" + lkF(-v.ful) + " 104 84)"); el["j-ful-r"].setAttribute("transform", "rotate(" + lkF(v.ful) + " 136 84)"); }
  if (el["p-blokkN"]) el["p-blokkN"].setAttribute("transform", "scale(" + (1 + v.blokkFel * .7).toFixed(2) + ")");
};
/* a közös képkocka-hurok: csak addig fut, amíg van lakó a lapon */
function lkInditas() {
  if (LK_FUT || typeof requestAnimationFrame === "undefined") return;
  LK_FUT = true;
  requestAnimationFrame(function lkKeret(now) {
    LAKOK = LAKOK.filter(function (L) { return L.root.isConnected; });
    if (!LAKOK.length) { LK_FUT = false; return; }
    LAKOK.forEach(function (L) { try { L.keret(now); } catch (e) {} });
    requestAnimationFrame(lkKeret);
  });
}

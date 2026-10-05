/* ============ 10c2) KERT-TÁJKÉP: a patakparti C2 kert (Tamagocsi-kert 2. kör) ============
   A kert háttere a jóváhagyott C2 rajzterv szerint (terv/teny-kert-c2-rajzterv.html):
   hátul a túlpart a két virágágyással (+− rózsaszín, ×÷ lila) és köztük a csodaágyás-dombbal,
   középen a patak fahíddal, balra öböl tavirózsákkal, elöl a füves part, ahol az unikornis sétál
   és a tárgyak állnak. Két elrendezés: fekvő (1000×620) és álló (400×660, telefon).
   Ez a közös modul: a Tény-kert (4. kör) ugyanezt a KERT_LAY-t és rajzot használja, a virágok
   az ágyások „data-agy" csoportjába kerülnek. Az ágyások most még üresek (frissen ásott föld):
   a kert nem hazudik, virág csak tanulásból nő. */

/* a füves part teteje: ide (és lejjebb) kerülhetnek a tárgyak, % a színtér magasságából */
var KERT_TARGY_MIN_Y = 70;

var KERT_LAY = {
  f: { W: 1000, H: 620,
       agy: { o: { cx: 255, cy: 292, rx: 160, ry: 36 }, s: { cx: 745, cy: 292, rx: 160, ry: 36 } },
       domb: { cx: 500, cy: 266, rx: 64, ry: 22 },
       patak: { y: 342, v: 48 }, obol: { cx: 200, cy: 394, rx: 128, ry: 27 },
       hid: { x: 500, yF: 418, yB: 338, wF: 44, wB: 24 },
       hal: [668, 374], nad: [[934, 392], [70, 404], [338, 402], [868, 396]],
       fuz: [52, 300], fak: [[968, 262, 1], [905, 252, .78]],
       szk: [[930, 344], [840, 290], [720, 318], [640, 300], [760, 360], [880, 330]] },
  a: { W: 400, H: 660,
       agy: { o: { cx: 100, cy: 302, rx: 86, ry: 30 }, s: { cx: 300, cy: 302, rx: 86, ry: 30 } },
       domb: { cx: 200, cy: 258, rx: 34, ry: 14 },
       patak: { y: 350, v: 46 }, obol: { cx: 74, cy: 398, rx: 70, ry: 24 },
       hid: { x: 200, yF: 420, yB: 346, wF: 30, wB: 17 },
       hal: [292, 378], nad: [[388, 398], [150, 402]],
       fuz: [18, 300], fak: [[388, 262, .62]],
       szk: [[386, 350], [330, 300], [250, 322], [300, 362]] }
};
var KERT_ORIENT = "f";   /* az épp kirajzolt elrendezés: "f" fekvő, "a" álló */

/* fekvő vagy álló kép: a színtér arányából (a telefon álló képernyőjén az álló változat) */
function kertTajOrient(host) {
  if (!host || !host.clientWidth || !host.clientHeight) return "f";
  return (host.clientWidth / host.clientHeight) < 0.95 ? "a" : "f";
}

/* kis segédek (a rajzterv r1/hashStr/q2/P megfelelői) */
function ktR(n) { return Math.round(n * 10) / 10; }
function ktHash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function ktQ2(p0, p1, p2, t) { var u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; }
function ktP() { var a = []; for (var i = 0; i < arguments.length; i++) a.push(typeof arguments[i] === "number" ? ktR(arguments[i]) : arguments[i]); return a.join(" "); }

function kertTajDefs() {
  return '<defs>' +
    '<linearGradient id="kcg-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9e0fb"/><stop offset="1" stop-color="#eef8ff"/></linearGradient>' +
    '<radialGradient id="kcg-nap" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff7d2"/><stop offset="55%" stop-color="#ffe987"/><stop offset="100%" stop-color="#ffe987" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="kcg-tav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeebb"/><stop offset="1" stop-color="#b6e09c"/></linearGradient>' +
    '<linearGradient id="kcg-koz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3e295"/><stop offset="1" stop-color="#93d173"/></linearGradient>' +
    '<linearGradient id="kcg-fu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccf69"/><stop offset="1" stop-color="#5fae49"/></linearGradient>' +
    '<radialGradient id="kcg-fold" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#a87a4e"/><stop offset="1" stop-color="#7a5230"/></radialGradient>' +
    '<linearGradient id="kcg-deszka" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b07a"/><stop offset="1" stop-color="#f0d3a3"/></linearGradient>' +
    '<linearGradient id="kcg-ko-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8eaee"/><stop offset="1" stop-color="#d8bcc5"/></linearGradient>' +
    '<linearGradient id="kcg-ko-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efeaf8"/><stop offset="1" stop-color="#c4b8dc"/></linearGradient>' +
    '<linearGradient id="kcg-ko" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eeeae2"/><stop offset="1" stop-color="#c6bdad"/></linearGradient>' +
    '<linearGradient id="kcg-viz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9dcf6"/><stop offset=".55" stop-color="#8ccdf0"/><stop offset="1" stop-color="#b9e6fb"/></linearGradient>' +
    '<radialGradient id="kcg-obol" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#bfe8fb"/><stop offset="1" stop-color="#8ccdf0"/></radialGradient>' +
    '<linearGradient id="kcg-domb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4f0b4"/><stop offset="1" stop-color="#98d27a"/></linearGradient>' +
    '<filter id="kcg-firka" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>' +
    '</defs>';
}

/* ég, nap, úszó felhők, távoli dombok */
function kertTajEg(L, f) {
  var W = L.W, s = '<rect width="' + W + '" height="' + L.H + '" fill="url(#kcg-eg)"/>';
  var nx = f ? 842 : 330, ny = f ? 86 : 74;
  s += '<circle cx="' + nx + '" cy="' + ny + '" r="' + (f ? 76 : 58) + '" fill="url(#kcg-nap)"/><circle cx="' + nx + '" cy="' + ny + '" r="' + (f ? 25 : 19) + '" fill="#fff3b0"/>';
  s += '<g class="kc-felho" fill="#fff" opacity=".88">' + (f
    ? '<ellipse cx="200" cy="88" rx="62" ry="24"/><ellipse cx="248" cy="76" rx="46" ry="21"/><ellipse cx="160" cy="94" rx="36" ry="15"/><ellipse cx="560" cy="62" rx="50" ry="19"/><ellipse cx="600" cy="70" rx="38" ry="16"/>'
    : '<ellipse cx="86" cy="92" rx="48" ry="20"/><ellipse cx="124" cy="82" rx="36" ry="17"/><ellipse cx="238" cy="132" rx="30" ry="12"/>') + '</g>';
  s += f
    ? '<path d="M0 238 Q150 196 320 222 T640 212 T1000 222 V620 H0Z" fill="#d6eedf"/><path d="M0 254 Q260 230 520 248 T1000 242 V620 H0Z" fill="url(#kcg-tav)"/>'
    : '<path d="M0 228 Q100 198 210 220 T400 212 V660 H0Z" fill="#d6eedf"/><path d="M0 246 Q120 232 240 244 T400 240 V660 H0Z" fill="url(#kcg-tav)"/>';
  return s;
}
function kertTajFa(x, y, m) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + m + ')"><rect x="-7" y="-60" width="14" height="60" rx="5" fill="url(#ko-trunk)"/><circle cx="-24" cy="-70" r="26" fill="url(#ko-leaf2)"/><circle cx="24" cy="-72" r="25" fill="url(#ko-leaf2)"/><circle cx="0" cy="-92" r="32" fill="url(#ko-leaf)"/><circle cx="-6" cy="-66" r="24" fill="url(#ko-leaf)"/><circle cx="-10" cy="-100" r="8" fill="#b8ec98" opacity=".6"/></g>';
}
function kertTajFuz(x, y, m) {
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + m + ')"><path d="M-6 0 C -4 -40 -2 -70 4 -96 L 14 -96 C 10 -70 10 -40 12 0Z" fill="url(#ko-trunk)"/><ellipse cx="10" cy="-104" rx="64" ry="36" fill="url(#ko-leaf)"/><ellipse cx="-20" cy="-96" rx="34" ry="22" fill="#86cd66"/>';
  for (var i = -6; i <= 7; i++) {
    var x0 = 10 + i * 9.5;
    s += '<g transform="translate(' + ktR(x0) + ' -100)"><g class="kc-fuzag" style="animation-delay:-' + ktR((i + 6) * .33) + 's"><path d="M0 0 q' + ktR(i * 1.2) + ' 34 ' + ktR(i * 1.8) + ' ' + (64 + Math.abs((i * 37) % 22)) + '" stroke="' + (i % 2 ? "#6fbf5a" : "#7fca62") + '" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>';
  }
  return s + '</g>';
}
function kertTajNad(x, y, m) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + m + ')"><g class="kc-fuszal"><path d="M0 0 q-4 -24 -2 -44 M8 0 q2 -26 6 -38 M-8 0 q-6 -16 -12 -26 M3 0 q1 -14 -1 -30" stroke="#5aa843" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-5.4" y="-54" width="6.4" height="17" rx="3.2" fill="#9a6b42"/><rect x="11" y="-48" width="6" height="14" rx="3" fill="#8a5d36"/></g></g>';
}
function kertTajKoSor(pontok, m) {
  var s = '<g filter="url(#kcg-firka)">';
  pontok.forEach(function (p, i) {
    s += '<ellipse cx="' + ktR(p[0]) + '" cy="' + ktR(p[1]) + '" rx="' + ktR((8 + ktHash("k" + i) % 5) * m) + '" ry="' + ktR((4.6 + ktHash("q" + i) % 3 * .6) * m) + '" fill="url(#ko-stone)" stroke="#a9b2bc" stroke-width=".7"/>';
  });
  return s + '</g>';
}
/* tavirózsa: két sor hegyes, rózsaszín szirom (a rajzterv „hegyes" szirma, színátmenettel) */
function kertTajSzirom(L, w) { return "M" + ktP(0, 0, "C", w * .95, -L * .22, w * .8, -L * .62, 0, -L, "C", -w * .8, -L * .62, -w * .95, -L * .22, 0, 0) + "Z"; }
function kertTajTavirozsa(x, y, m) {
  function sor(n, L, w, lap, fel) {
    var s = '<g transform="scale(1 ' + lap + ')">';
    for (var i = 0; i < n; i++) s += '<g transform="rotate(' + ktR(fel + 360 * i / n) + ')">' +
      '<path d="' + kertTajSzirom(L, w) + '" fill="#ffd3e3" stroke="#e98fb4" stroke-opacity=".5" stroke-width=".6"/>' +
      '<path d="' + kertTajSzirom(L * .58, w * .76) + '" fill="#e98fb4" opacity=".5"/></g>';
    return s + '</g>';
  }
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + m + ')">' + sor(8, 12, 4.2, .42, 0) + sor(6, 8.5, 3.4, .5, 30) + '<ellipse cx="0" cy="-1.4" rx="3.4" ry="2" fill="#ffd24d"/></g>';
}
function kertTajLevelLap(x, y, m, a) {
  var r = a * Math.PI / 180, r2 = (a + 24) * Math.PI / 180;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + m + ')"><g class="kc-lap" style="animation-delay:-' + ktR(a / 60) + 's"><path d="M0 0 L' + ktR(Math.cos(r) * 16) + ' ' + ktR(Math.sin(r) * 5.6) + ' A16 5.6 0 1 1 ' + ktR(Math.cos(r2) * 16) + ' ' + ktR(Math.sin(r2) * 5.6) + ' Z" fill="#6fbf5a" stroke="#4f9e46" stroke-width=".8"/><path d="M-6 -1.4 Q0 -3 7 -1" stroke="#a5df8c" stroke-width="1" fill="none"/></g></g>';
}
function kertTajPatak(L) {
  var W = L.W, y0 = L.patak.y, v = L.patak.v, N = 40, fel = [], al = [], i, k;
  for (i = 0; i <= N; i++) { var x = W * i / N; fel.push(ktR(x) + " " + ktR(y0 + Math.sin(i * .7) * 3.5)); al.unshift(ktR(x) + " " + ktR(y0 + v + Math.sin(i * .9 + 1) * 2.5)); }
  var s = '<g><path d="M' + fel.join(" L") + ' L' + al.join(" L") + ' Z" fill="url(#kcg-viz)"/>';
  s += '<path d="M' + fel.join(" L") + '" stroke="#e9f7ff" stroke-width="2.4" fill="none"/>';
  for (k = 0; k < 3; k++) {
    var p = []; for (i = 0; i <= N; i++) p.push(ktR(W * i / N) + " " + ktR(y0 + Math.sin(i * .7) * 3.5 + v * (.28 + k * .22)));
    s += '<path class="kc-hullam" style="animation-delay:-' + (k * .8) + 's" d="M' + p.join(" L") + '" stroke="#f4fbff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>';
  }
  return s + '</g>';
}
function kertTajHid(Hh) {
  var x = Hh.x, yF = Hh.yF, yB = Hh.yB, wF = Hh.wF, wB = Hh.wB, ym = (yF + yB) / 2 - 14;
  var bal = [[x - wF, yF], [x - (wF + wB) / 2 - 3, ym], [x - wB, yB]], jobb = [[x + wF, yF], [x + (wF + wB) / 2 + 3, ym], [x + wB, yB]];
  var s = '<ellipse cx="' + x + '" cy="' + ktR((yF + yB) / 2 + 6) + '" rx="' + ktR(wF * 1.1) + '" ry="' + ktR((yF - yB) * .28) + '" fill="#2d6a8a" opacity=".16"/>';
  s += '<g filter="url(#kcg-firka)">';
  [bal, jobb].forEach(function (o) {   /* oldal-gerendák */
    s += '<path d="M' + ktP(o[0][0], o[0][1], "Q", o[1][0], o[1][1], o[2][0], o[2][1], "L", o[2][0], o[2][1] + 5, "Q", o[1][0], o[1][1] + 9, o[0][0], o[0][1] + 9) + 'Z" fill="#a8774a"/>';
  });
  s += '<path d="M' + ktP(bal[0][0], bal[0][1], "Q", bal[1][0], bal[1][1], bal[2][0], bal[2][1], "L", jobb[2][0], jobb[2][1], "Q", jobb[1][0], jobb[1][1], jobb[0][0], jobb[0][1]) + 'Z" fill="url(#kcg-deszka)" stroke="#b5844f" stroke-width="1"/>';
  for (var i = 1; i < 10; i++) { var t = i / 10, a = ktQ2(bal[0], bal[1], bal[2], t), b = ktQ2(jobb[0], jobb[1], jobb[2], t); s += '<path d="M' + ktP(a[0], a[1], "L", b[0], b[1]) + '" stroke="#c4935e" stroke-width="' + ktR(1.4 - t * .6) + '"/>'; }
  [bal, jobb].forEach(function (old) {   /* korlát */
    var tet = [];
    [0, .34, .67, 1].forEach(function (t) { var p = ktQ2(old[0], old[1], old[2], t), h = 24 - t * 11; tet.push([p[0], p[1] - h]); s += '<rect x="' + ktR(p[0] - 2.6 + t) + '" y="' + ktR(p[1] - h) + '" width="' + ktR(5.2 - t * 2) + '" height="' + ktR(h) + '" rx="1.6" fill="#c99761"/>'; });
    s += '<path d="M' + ktP(tet[0][0], tet[0][1], "C", tet[1][0], tet[1][1], tet[2][0], tet[2][1], tet[3][0], tet[3][1]) + '" stroke="#ecc996" stroke-width="4" fill="none" stroke-linecap="round"/>';
  });
  return s + '</g>';
}
/* egy ágyás a túlparton: kővel szegett, frissen ásott föld (a virágok a 4. körben a .kc-agy-virag csoportba nőnek) */
function kertTajAgy(op, L) {
  var K = L.agy[op], s = '<g class="kc-agyas" data-agy="' + op + '">';
  s += '<ellipse cx="' + K.cx + '" cy="' + ktR(K.cy + K.ry * .5) + '" rx="' + (K.rx + 10) + '" ry="' + ktR(K.ry * .7) + '" fill="#2c5a1e" opacity=".14"/>';
  s += '<g filter="url(#kcg-firka)"><ellipse cx="' + K.cx + '" cy="' + K.cy + '" rx="' + K.rx + '" ry="' + K.ry + '" fill="url(#kcg-fold)"/>';
  for (var j = 1; j < 4; j++) s += '<ellipse cx="' + K.cx + '" cy="' + ktR(K.cy + 1) + '" rx="' + ktR(K.rx * j / 4.3) + '" ry="' + ktR(K.ry * j / 4.3) + '" fill="none" stroke="#8d6440" stroke-width="1" opacity=".45"/>';
  var N = Math.round(K.rx / 7.2);
  for (var i = 0; i < N; i++) {
    var a = i / N * Math.PI * 2;
    s += '<ellipse cx="' + ktR(K.cx + Math.cos(a) * K.rx) + '" cy="' + ktR(K.cy + Math.sin(a) * K.ry) + '" rx="' + ktR(8 + ktHash(op + i) % 30 / 10) + '" ry="' + ktR(5.2 + ktHash(i + op) % 16 / 10) + '" fill="url(#kcg-ko-' + op + ')" stroke="#b3a3a8" stroke-width=".7"/>';
  }
  return s + '</g><g class="kc-agy-virag"></g></g>';
}
/* a csodaágyás-domb a két ágyás között (a ritka mag helye; most még üres, fehér kavics-gyűrű) */
function kertTajDomb(L) {
  var D = L.domb, s = '<g class="kc-domb">';
  s += '<ellipse cx="' + D.cx + '" cy="' + ktR(D.cy + D.ry * .55) + '" rx="' + (D.rx + 6) + '" ry="' + ktR(D.ry * .6) + '" fill="#2c5a1e" opacity=".14"/>';
  s += '<path d="M' + ktP(D.cx - D.rx, D.cy + D.ry * .4, "Q", D.cx - D.rx * .6, D.cy - D.ry * 1.3, D.cx, D.cy - D.ry * 1.2, "Q", D.cx + D.rx * .6, D.cy - D.ry * 1.3, D.cx + D.rx, D.cy + D.ry * .4, "Q", D.cx, D.cy + D.ry * 1.1, D.cx - D.rx, D.cy + D.ry * .4) + 'Z" fill="url(#kcg-domb)"/>';
  s += '<ellipse cx="' + D.cx + '" cy="' + ktR(D.cy - D.ry * .7) + '" rx="' + ktR(D.rx * .42) + '" ry="' + ktR(D.ry * .36) + '" fill="#8a5f39"/>';
  for (var i = 0; i < 9; i++) { var a = i / 9 * 6.283; s += '<circle cx="' + ktR(D.cx + Math.cos(a) * D.rx * .44) + '" cy="' + ktR(D.cy - D.ry * .7 + Math.sin(a) * D.ry * .4) + '" r="' + ktR(D.rx * .05) + '" fill="#fffaf2" stroke="#d9cfc0" stroke-width=".5"/>'; }
  return s + '<g class="kc-domb-mag"></g></g>';
}
/* kavicsos ösvények a híd végétől a két ágyáshoz és a dombra */
function kertTajUtak(L) {
  var Hh = L.hid, yb = Hh.yB + 1, x = Hh.x, nagy = L.W > 500;
  var s = '<g stroke-linecap="round" fill="none">';
  ["o", "s"].forEach(function (op) {
    var K = L.agy[op], sd = op === "o" ? -1 : 1, cx = K.cx + sd * K.rx * .28;
    var d = 'M' + ktP(x, yb, "Q", (x + cx) / 2, yb + 2, cx, K.cy + K.ry - 3);
    s += '<path d="' + d + '" stroke="#e3cfa6" stroke-width="' + (nagy ? 15 : 10) + '"/><path d="' + d + '" stroke="#f4e8cf" stroke-width="' + (nagy ? 9 : 6) + '" stroke-dasharray="2 9"/>';
  });
  s += '<path d="M' + ktP(x, yb, "L", x, L.domb.cy + L.domb.ry * .4) + '" stroke="#e3cfa6" stroke-width="' + (nagy ? 12 : 8) + '"/>';
  return s + '</g>';
}
/* elöl: lengő fűcsomók + egy lepke */
function kertTajElotter(L, f) {
  var s = '<g stroke-linecap="round" fill="none">';
  var sz = f ? [[70, 602], [130, 606], [540, 608], [700, 602], [900, 606], [300, 606], [420, 602]] : [[30, 642], [120, 648], [250, 646], [370, 642]];
  sz.forEach(function (b, i) {
    s += '<g transform="translate(' + b[0] + ' ' + b[1] + ')"><g class="kc-fuszal" style="animation-delay:-' + (i * .4).toFixed(1) + 's"><path d="M0 0 q-5 -16 -14 -24 M0 0 q-1 -22 3 -34 M0 0 q6 -14 15 -20" stroke="' + (i % 2 ? "#5aa843" : "#4f9c3a") + '" stroke-width="4.5"/></g></g>';
  });
  s += '</g>';
  var lx = f ? 600 : 230, ly = f ? 470 : 476;
  s += '<g transform="translate(' + lx + ' ' + ly + ')"><g class="kc-lepke"><path class="kc-sz1" d="M0 0 q-14 -12 -22 0 q8 12 22 5 Z" fill="#ff9ec4"/><path class="kc-sz2" d="M0 0 q14 -12 22 0 q-8 12 -22 5 Z" fill="#b6a7f2"/><circle r="2.6" fill="#4a3f6b"/></g></g>';
  return s;
}
function kertTajHal() {
  return '<g id="kc-hal" style="display:none"><path d="M-14 0 C -8 -8 8 -8 13 0 C 8 7 -8 7 -14 0Z" fill="#ffb27a" stroke="#d9773e" stroke-width=".9"/><path d="M-13 0 L -22 -7 L -20 0 L -22 7Z" fill="#ffc79e" stroke="#d9773e" stroke-width=".9"/><path d="M-2 -6 Q 2 -11 5 -6" fill="#ffc79e" stroke="#d9773e" stroke-width=".8"/><circle cx="7" cy="-1.6" r="1.6" fill="#2a1a1a"/><circle cx="7.4" cy="-2.1" r=".5" fill="#fff"/><path d="M-4 1 Q 0 3 4 1" stroke="#ffe0c4" stroke-width="1.2" fill="none"/></g>';
}
function kertTajSzitakoto() {
  return '<g id="kc-szk"><g class="kc-szk-szarny"><ellipse cx="-3" cy="-6" rx="3" ry="9" fill="#e6fbff" stroke="#9fd8e8" stroke-width=".6" opacity=".85" transform="rotate(-62 -3 -6)"/><ellipse cx="3" cy="-6" rx="3" ry="9" fill="#e6fbff" stroke="#9fd8e8" stroke-width=".6" opacity=".85" transform="rotate(62 3 -6)"/></g><path d="M-12 0 L 12 0" stroke="#3fb3ad" stroke-width="2.6" stroke-linecap="round"/><circle cx="13" cy="0" r="2.8" fill="#2f8f8a"/><circle cx="14" cy="-1" r=".9" fill="#fff"/></g>';
}

/* a teljes kert-háttér (o: "f" | "a"). Alulra igazítva vágódik (xMidYMax slice): széles laptop-képen
   az ég fogy el, a füves part, ahol az unikornis és a tárgyak állnak, mindig látszik. */
function kertHatterSVG(o) {
  o = o === "a" ? "a" : "f";
  KERT_ORIENT = o;
  var L = KERT_LAY[o], W = L.W, H = L.H, f = o === "f";
  var s = '<svg class="kert-hatter" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
  s += kertTajDefs() + kertTajEg(L, f);
  L.fak.forEach(function (t) { s += kertTajFa(t[0], t[1], t[2]); });
  s += kertTajFuz(L.fuz[0], L.fuz[1], f ? 1 : .62);
  /* a túlpart rétje */
  s += '<path d="M0 ' + (f ? 250 : 240) + ' Q' + W / 2 + ' ' + (f ? 238 : 232) + ' ' + W + ' ' + (f ? 252 : 242) + ' V' + (L.patak.y + 12) + ' H0Z" fill="url(#kcg-koz)"/>';
  s += kertTajUtak(L) + kertTajDomb(L) + kertTajAgy("o", L) + kertTajAgy("s", L);
  s += kertTajPatak(L) + kertTajHal() + '<g id="kc-gyuruk"></g>';
  /* az innenső part: fű */
  var b = L.patak.y + L.patak.v - 3;
  s += '<path d="M0 ' + b + ' Q' + W * .25 + ' ' + (b - 5) + ' ' + W * .5 + ' ' + (b + 2) + ' T' + W + ' ' + b + ' V' + H + ' H0Z" fill="url(#kcg-fu)"/>';
  /* öböl tavirózsákkal */
  var Ob = L.obol, om = f ? 1 : .62;
  s += '<g><ellipse cx="' + Ob.cx + '" cy="' + Ob.cy + '" rx="' + Ob.rx + '" ry="' + Ob.ry + '" fill="url(#kcg-obol)"/><path d="M' + ktP(Ob.cx - Ob.rx, Ob.cy, "A", Ob.rx, Ob.ry, 0, 0, 0, Ob.cx + Ob.rx, Ob.cy) + '" stroke="#d6efc0" stroke-width="3" fill="none" opacity=".7"/>';
  [[-82, -4, 1, 10], [-40, 9, .9, 190], [6, -3, 1.15, 60], [52, 10, .85, 250], [88, 1, .9, 120]].forEach(function (q) {
    s += kertTajLevelLap(ktR(Ob.cx + q[0] * om), ktR(Ob.cy + q[1] * om), ktR(q[2] * om * 100) / 100, q[3]);
  });
  s += kertTajTavirozsa(ktR(Ob.cx - 40 * om), ktR(Ob.cy + 6 * om), om * 1.15) + kertTajTavirozsa(ktR(Ob.cx + 54 * om), ktR(Ob.cy + 7 * om), om * .95) + '</g>';
  /* part menti kövek, nád, híd, lépőkövek */
  var kp = [];
  for (var x = f ? 360 : 150; x < W; x += f ? 34 : 30) { if (Math.abs(x - L.hid.x) < L.hid.wF + 16) continue; kp.push([x + (ktHash("p" + x) % 9 - 4), b + 3 + (ktHash("y" + x) % 5)]); }
  s += kertTajKoSor(kp, f ? 1 : .7);
  L.nad.forEach(function (n) { s += kertTajNad(n[0], n[1], f ? 1 : .75); });
  s += kertTajHid(L.hid);
  var lm = f ? 1 : .7;
  s += '<g filter="url(#kcg-firka)">' + [[0, L.hid.yF + 12, 1], [-6, L.hid.yF + 34, 1.1], [5, L.hid.yF + 58, 1.2]].map(function (q) {
    return '<ellipse cx="' + (L.hid.x + q[0]) + '" cy="' + q[1] + '" rx="' + ktR(16 * q[2] * lm) + '" ry="' + ktR(5.4 * q[2] * lm) + '" fill="url(#kcg-ko)" stroke="#b7ad9b" stroke-width=".8"/>';
  }).join("") + '</g>';
  s += kertTajElotter(L, f) + kertTajSzitakoto();
  return s + '</svg>';
}

/* ── élet a vízen: a hal néha kiugrik (gyűrűvel), a szitakötő körbe repül a nád fölött.
   Egy futás = egy azonosító; új kirajzoláskor vagy a kertből kilépve a régi magától leáll. ── */
var KERT_TAJ_FUT = 0, KERT_TAJ_HAL = null;
function kertTajMozgasStop() { KERT_TAJ_FUT++; clearInterval(KERT_TAJ_HAL); KERT_TAJ_HAL = null; }
function kertTajLathato() { var k = $("kepernyo-kert"); return !!(k && k.classList.contains("aktiv")) && document.visibilityState === "visible"; }
function kertTajGyuru(x, y) {
  var g = $("kc-gyuruk"); if (!g) return;
  var a = KERT_ORIENT === "f", e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  e.setAttribute("cx", ktR(x)); e.setAttribute("cy", ktR(y)); e.setAttribute("rx", a ? 22 : 14); e.setAttribute("ry", a ? 6 : 4);
  e.setAttribute("fill", "none"); e.setAttribute("stroke", "#f4fbff"); e.setAttribute("stroke-width", "2"); e.setAttribute("class", "kc-gyuru");
  g.appendChild(e); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 1200);
}
function kertTajHalUgrik() {
  var h = $("kc-hal"); if (!h || h._fut || nyugiMod()) return;
  var L = KERT_LAY[KERT_ORIENT], f = KERT_ORIENT === "f";
  var x0 = L.hal[0], y0 = L.patak.y + L.patak.v * .55, m = f ? 1 : .7, ugr = f ? 62 : 40, hossz = f ? 70 : 46;
  h._fut = true; h.style.display = ""; kertTajGyuru(x0, y0);
  var t0 = performance.now();
  (function lep(t) {
    var u = Math.min(1, (t - t0) / 900), x = x0 + hossz * u, y = y0 - ugr * 4 * u * (1 - u), a = -50 + 100 * u;
    h.setAttribute("transform", "translate(" + ktR(x) + " " + ktR(y) + ") rotate(" + ktR(a) + ") scale(" + m + ")");
    if (u < 1 && h.isConnected) requestAnimationFrame(lep);
    else { h.style.display = "none"; h._fut = false; kertTajGyuru(x0 + hossz, y0); }
  })(t0);
}
function kertTajMozgasIndit() {
  kertTajMozgasStop();
  var fut = KERT_TAJ_FUT, g = $("kc-szk"); if (!g) return;
  var f = KERT_ORIENT === "f", L = KERT_LAY[KERT_ORIENT], kor = L.szk, m = f ? 1 : .7;
  var s = { x: kor[0][0], y: kor[0][1], i: 0, varj: 0, irany: 1 };
  g.setAttribute("transform", "translate(" + s.x + " " + s.y + ") scale(" + m + ")");
  if (nyugiMod()) return;
  KERT_TAJ_HAL = setInterval(function () { if (kertTajLathato()) kertTajHalUgrik(); }, 7000);
  var elozo = performance.now();
  (function lep(t) {
    if (fut !== KERT_TAJ_FUT || !g.isConnected) return;
    var dt = Math.min(50, t - elozo); elozo = t;
    if (s.varj > 0) s.varj -= dt;
    else {
      var cel = kor[(s.i + 1) % kor.length], dx = cel[0] - s.x, dy = cel[1] - s.y, d = Math.hypot(dx, dy), v = (f ? .16 : .1) * dt;
      if (d < v) { s.x = cel[0]; s.y = cel[1]; s.i = (s.i + 1) % kor.length; if (s.i === 0) s.varj = 2600; }
      else { s.x += dx / d * v; s.y += dy / d * v + Math.sin(t / 180) * .3; s.irany = dx < 0 ? -1 : 1; }
    }
    g.setAttribute("transform", "translate(" + ktR(s.x) + " " + ktR(s.y) + ") scale(" + ktR(m * s.irany * 100) / 100 + " " + m + ")");
    requestAnimationFrame(lep);
  })(elozo);
}

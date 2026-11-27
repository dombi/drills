/* ═════════════════ 🍄 A HÁZ BELSEJE: a pálya képe a ház belsejében (16a, Matekos\allomasok-16a-tervlap.html) ═════════════════
   A kanyargós ösvény helyett (osveny.js): a pálya a ház szobájában játszódik. Csak a MOSTANI tárgy szaggatott körvonala és
   4 szentjánosbogár-hely látszik; a kész tárgyak a szobában maradnak (a megszerzett nő, a hátralévő sehogy nem látszik).
   A cél EGY tárgy az elejétől: a gomba-lámpa, ami minden letett tárgytól fényesebb; az utolsó (fekhely) után teljesen ég,
   az unikornis lefekszik, a kissárkány mellé gömbölyödik.
   Kapcsoló: a pályán `belso: "kisgomba"` (constants.js). A pálya-motor (engine-logic.js) ágazik el ide:
     belsoSVG (renderer.js jelenetSVG) · belsoIndul · belsoAllomasra · belsoBogar (jó válasz) · belsoKesz (állomás vége →
     „Tedd a helyére!”, felvesz – letesz, felvesz.js) · belsoKerulo (hosszú út = EGY feladat: kimegy, lilás bogarat hoz) · belsoLefekves (pálya vége).
   A séta a közös osvenyMegy (osveny.js) — ugyanaz a járás, ugyanaz az OSV hely, a kölyök is ugyanúgy követ (leny-kiser.js).
   Új ház belseje = egy új sor a BELSO táblában (hatter + ajtó + lámpa-pont + cel() saját cél-rajz + 5 tárgy; opcionális: feny, hideg, meleg). */
var BL_K = "#3b2f4a";
var BL_UNI = 0.85;   /* a szobában közelebbről látjuk, mint az ösvényen (0.62) */
function blKesz(c) { return 'fill="' + c + '" stroke="' + BL_K + '" stroke-width="3"'; }
/* egy tárgy rajza a saját középpontja körül; m: "korv" (szaggatott körvonal) | "kesz" | "lila" (hosszú úton hozta) */
function blAttr(m, c) {
  if (m === "korv") return 'fill="#fff6ea" fill-opacity=".35" stroke="#7a6a8a" stroke-width="3" stroke-dasharray="8 7"';
  return blKesz(m === "lila" ? "#cdb6ea" : c);
}
var BELSO = {
  kisgomba: {
    fal: "#fde6d8",
    hatter: function () {   /* a piros pöttyös kalap-kupola belülről, bordás mennyezet, krém fal, fapadló, kerek ajtó és ablak */
      var s = '<rect width="1200" height="560" fill="#fde6d8"/>' +
        '<path d="M0 260 Q600 -150 1200 260 L1200 0 L0 0Z" fill="#f0766a"/>';
      for (var i = 1; i < 12; i++) {   /* a kalap bordái a lámpa felől sugárban */
        var x = i * 100, dx = x - 600, y = 260 - 205 * (1 - Math.pow(dx / 600, 2));
        s += '<path d="M600 55 Q' + (600 + dx * .55).toFixed(0) + ' ' + ((55 + y) / 2).toFixed(0) + ' ' + x + ' ' + y.toFixed(0) + '" stroke="#f6d9c4" stroke-width="3" fill="none" opacity=".75"/>';
      }
      [[170, 70], [420, 24], [760, 30], [1030, 80], [290, 128], [900, 118]].forEach(function (p) {
        s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="26" ry="16" fill="#fffaf2" opacity=".9"/>'; });
      s += '<path d="M0 260 Q600 -150 1200 260" fill="none" stroke="' + BL_K + '" stroke-width="5"/>' +
        '<path d="M0 365 Q600 340 1200 365 L1200 560 L0 560Z" fill="#c99a6a"/>' +
        '<path d="M0 405 Q600 382 1200 405 M0 450 Q600 428 1200 450 M0 500 Q600 480 1200 500" stroke="#b5875a" stroke-width="3" fill="none"/>' +
        '<path d="M0 365 Q600 340 1200 365" stroke="' + BL_K + '" stroke-width="4" fill="none"/>' +
        '<g id="bl-ajto"><path d="M40 366 L40 230 Q95 170 150 230 L150 366Z" fill="#7a5ac0" stroke="' + BL_K + '" stroke-width="4"/>' +
        '<path d="M95 196 V366" stroke="#6648a8" stroke-width="3"/><circle cx="130" cy="300" r="6" fill="#f2c14e"/></g>' +
        '<circle cx="1080" cy="225" r="48" fill="#cdeaf7" stroke="#f59bb0" stroke-width="10"/>' +
        '<path d="M1046 252 q14 -34 30 -6 q12 -30 34 4 Z" fill="#a7d99a" opacity=".8"/>' +
        '<path d="M1080 177 V273 M1032 225 H1128" stroke="#f59bb0" stroke-width="5"/>';
      return s;
    },
    ajto: [180, 374],   /* bent, az ajtó előtt: itt áll az unikornis belépéskor */
    kint: [96, 364],    /* az ajtónyílás (hosszú út: itt megy ki és jön be) */
    lampa: [600, 172],
    cel: function () {   /* 2A: a ház saját cél-rajza — itt a gomba-lámpa (a fény/izzó id-k közösek: blFenyAllit) */
      var L = this.lampa;
      return '<line x1="' + L[0] + '" y1="55" x2="' + L[0] + '" y2="' + (L[1] - 46) + '" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<g id="bl-lampa" transform="translate(' + L[0] + ',' + L[1] + ')"><path d="M-48 -8 Q0 -78 48 -8Z" fill="#f0766a" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<circle cx="-16" cy="-30" r="6" fill="#fffaf2"/><circle cx="16" cy="-26" r="5" fill="#fffaf2"/><circle cx="0" cy="-48" r="4" fill="#fffaf2"/>' +
        '<ellipse id="bl-izzo" cx="0" cy="4" rx="26" ry="18" fill="#e4d2a6" stroke="' + BL_K + '" stroke-width="3"/></g>';
    },
    targyak: [
      { nev: "szőnyeg", x: 670, y: 374, rx: 170, ry: 30, all: [300, 372], rajz: function (m) {
        return '<ellipse rx="170" ry="30" ' + blAttr(m, "#f59bb0") + '/>' +
          (m === "korv" ? '' : '<ellipse rx="120" ry="19" fill="none" stroke="#fffaf2" stroke-width="5" stroke-dasharray="14 10"/>'); } },
      { nev: "kosár", x: 222, y: 340, rx: 60, ry: 40, all: [372, 376], rajz: function (m) {
        return '<path d="M-55 20 L-40 -30 H40 L55 20Z" ' + blAttr(m, "#e8b36a") + '/>' +
          (m === "korv" ? '' : '<path d="M-48 -4 H48 M-44 -18 H44" stroke="#c48f4a" stroke-width="3"/><circle cx="-15" cy="-38" r="14" fill="#f0766a" stroke="' + BL_K + '" stroke-width="2"/><circle cx="15" cy="-40" r="13" fill="#fcd24a" stroke="' + BL_K + '" stroke-width="2"/>'); } },
      { nev: "virágcserép", x: 930, y: 322, rx: 40, ry: 60, all: [770, 376], rajz: function (m) {
        return (m === "korv" ? '' : '<path d="M0 2 V-48" stroke="#5a9a4a" stroke-width="4"/><path d="M0 -20 q-18 -6 -22 -20 q16 0 22 14" fill="#a7d99a" stroke="' + BL_K + '" stroke-width="2"/><circle cx="0" cy="-58" r="14" fill="' + (m === "lila" ? "#d9c4f0" : "#f59bb0") + '" stroke="' + BL_K + '" stroke-width="2"/><circle cx="0" cy="-58" r="5" fill="#fcd24a"/>') +
          '<path d="M-30 40 L-22 0 H22 L30 40Z" ' + blAttr(m, "#c97a5a") + '/>'; } },
      { nev: "bögrés polc", x: 840, y: 180, rx: 90, ry: 34, all: [680, 376], rajz: function (m) {
        return (m === "korv" ? '' : '<path d="M-60 22 l10 22 M60 22 l-10 22" stroke="#a9805e" stroke-width="6" stroke-linecap="round"/>' +
          '<rect x="-62" y="-18" width="24" height="28" rx="5" fill="#c9a8e6" stroke="' + BL_K + '" stroke-width="2"/><rect x="-20" y="-14" width="22" height="24" rx="5" fill="#a7d99a" stroke="' + BL_K + '" stroke-width="2"/><rect x="20" y="-20" width="26" height="30" rx="5" fill="#f59bb0" stroke="' + BL_K + '" stroke-width="2"/>') +
          '<rect x="-80" y="10" width="160" height="12" rx="4" ' + blAttr(m, "#a9805e") + '/>'; } },
      { nev: "párnás fekhely", x: 432, y: 372, rx: 120, ry: 28, all: [660, 378], fekhely: true, rajz: function (m) {
        return '<ellipse rx="120" ry="30" ' + blAttr(m, "#c9a8e6") + '/>' +
          (m === "korv" ? '' : '<ellipse cx="0" cy="-6" rx="96" ry="18" fill="none" stroke="#fffaf2" stroke-width="3" opacity=".7"/><ellipse cx="-70" cy="-14" rx="36" ry="16" fill="#fffaf2" stroke="' + BL_K + '" stroke-width="2"/>'); } }
    ]
  },
  /* 🍄 a Nagy gombaház (oszkiv-20) — rajzterv: Matekos\allomasok-16a-nagy-gombahaz-rajzterv.html, 1. változat (1A 2A 3A 4A, 11-27):
     a cél a zsályazöld cserépkályha (a kinti kémény füstje bentről is értelmet kap); a láng és a fénykör nő,
     a szoba az elején hűvös, kékes, a végén meleg, mézszínű (hideg → meleg réteg). */
  nagygomba: {
    fal: "#fff4e0", padlo: "#dcb27a",
    hideg: ["#8aa6c8", 0.22],   /* [szín, kezdő átlátszatlanság] — 0-ra fogy */
    meleg: ["#ffc870", 0.20],   /* 0-ról nő a végére */
    hatter: function () {   /* a kalap alja (lemezek), vanília tönk-fal, mézszínű padló, magas deszkaajtó, két kerek ablak */
      var s = '<rect width="1200" height="560" fill="#fff4e0"/>';
      for (var i = 0; i < 14; i++) { var x = 40 + i * 86; s += '<path d="M' + x + ' 250 Q' + (x + 8) + ' 310 ' + (x - 4) + ' 362" stroke="#f1dfbc" stroke-width="3" fill="none"/>'; }
      s += '<path d="M0 266 Q600 -170 1200 266 L1200 0 L0 0Z" fill="#f6d9c4"/>';
      for (var g = 0; g <= 26; g++) {
        var x2 = g / 26 * 1200, dx = x2 - 600, y2 = 262 - 218 * (1 - Math.pow(dx / 600, 2));
        s += '<path d="M600 34 Q' + (600 + dx * .5).toFixed(0) + ' ' + ((34 + y2) / 2 - 6).toFixed(0) + ' ' + x2.toFixed(0) + ' ' + y2.toFixed(0) + '" stroke="#d9a890" stroke-width="2.4" fill="none" opacity=".8"/>';
      }
      return s + '<circle cx="600" cy="34" r="26" fill="#f1dfbc" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<path d="M0 266 Q600 -170 1200 266" fill="none" stroke="#d9555f" stroke-width="16"/>' +
        '<path d="M0 274 Q600 -162 1200 274" fill="none" stroke="' + BL_K + '" stroke-width="4"/>' +
        '<path d="M0 364 Q600 342 1200 364 L1200 560 L0 560Z" fill="#dcb27a"/>' +
        '<path d="M0 404 Q600 384 1200 404 M0 450 Q600 430 1200 450 M0 500 Q600 482 1200 500" stroke="#c4955c" stroke-width="3" fill="none"/>' +
        '<path d="M0 364 Q600 342 1200 364" stroke="' + BL_K + '" stroke-width="4" fill="none"/>' +
        '<g id="bl-ajto"><path d="M34 368 L34 214 Q100 150 166 214 L166 368Z" fill="#a8764f" stroke="' + BL_K + '" stroke-width="4"/>' +
        '<path d="M67 196 V368 M100 182 V368 M133 196 V368" stroke="#8a5a3a" stroke-width="3"/><circle cx="146" cy="296" r="6" fill="#f2c14e" stroke="' + BL_K + '" stroke-width="1.5"/></g>' +
        blAblak(330, 206, 40) + blAblak(1080, 204, 52);
    },
    ajto: [196, 376],
    kint: [100, 366],
    lampa: [600, 318],   /* a tűztér szája: innen röppennek ki a bogarak */
    feny: { x: 600, y: 302, r: 370, sk: 0.19 },
    cel: function () {   /* a cserépkályha; a láng (#bl-lang) a letett tárgyakkal nő (blFenyAllit) */
      var x = 600, y = 362, s = '<rect x="' + (x - 22) + '" y="40" width="44" height="' + (y - 190) + '" fill="#8a6a52" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<path d="M' + (x - 22) + ' 120 H' + (x + 22) + '" stroke="' + BL_K + '" stroke-width="2"/>' +
        '<path d="M' + (x - 70) + ' ' + y + ' V' + (y - 142) + ' Q' + x + ' ' + (y - 170) + ' ' + (x + 70) + ' ' + (y - 142) + ' V' + y + 'Z" fill="#a9d4b4" stroke="' + BL_K + '" stroke-width="4"/>';
      for (var r = 1; r < 5; r++) s += '<path d="M' + (x - 70) + ' ' + (y - r * 32) + ' H' + (x + 70) + '" stroke="#7fb593" stroke-width="2.5"/>';
      for (var r2 = 0; r2 < 5; r2++) { var o = r2 % 2 ? 0 : 23; for (var c = -46; c <= 46; c += 46) s += '<path d="M' + (x + c + o) + ' ' + (y - r2 * 32) + ' v-32" stroke="#7fb593" stroke-width="2"/>'; }
      return s + '<rect x="' + (x - 80) + '" y="' + (y - 158) + '" width="160" height="16" rx="6" fill="#8fc4a0" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<path d="M' + (x - 36) + ' ' + (y - 8) + ' V' + (y - 60) + ' Q' + x + ' ' + (y - 96) + ' ' + (x + 36) + ' ' + (y - 60) + ' V' + (y - 8) + 'Z" fill="#5a4048" stroke="' + BL_K + '" stroke-width="3"/>' +
        '<g transform="translate(' + x + ',' + (y - 12) + ')"><g id="bl-lang" style="transform:scale(.22)"><g class="bl-lobog">' +
          '<path d="M-30 0 Q-38 -40 -14 -62 Q-12 -36 0 -48 Q4 -80 22 -88 Q16 -56 34 -38 Q40 -16 30 0Z" fill="#ff9a4a" stroke="' + BL_K + '" stroke-width="2.5"/>' +
          '<path d="M-14 0 Q-18 -24 -4 -36 Q0 -20 8 -28 Q14 -14 14 0Z" fill="#ffe27a"/></g></g></g>' +
        '<path d="M' + (x - 30) + ' ' + (y - 6) + ' h60" stroke="#8a5a3a" stroke-width="7" stroke-linecap="round"/>';
    },
    targyak: [
      { nev: "farakás", x: 740, y: 345, rx: 62, ry: 40, all: [900, 378], rajz: function (m) {
        return m === "korv" ? '<path d="M-62 30 L-62 6 L-40 -18 L-20 -40 H20 L40 -18 L62 6 L62 30Z" ' + blAttr(m) + '/>' :
          [[-40, 14], [0, 14], [40, 14], [-20, -12], [20, -12], [0, -36]].map(function (p) {
            return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="19" ' + blAttr(m, "#d9a070") + '/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="none" stroke="#a8764f" stroke-width="2.5"/>'; }).join(''); } },
      { nev: "tönk-asztal", x: 872, y: 332, rx: 62, ry: 44, all: [720, 380], rajz: function (m) {
        return m === "korv" ? '<path d="M-48 32 V-8 H-62 Q0 -30 62 -8 H48 V32Z M-24 -18 V-56 H24 V-18" ' + blAttr(m) + '/>' :
          '<path d="M-44 32 V-6 H44 V32Z" ' + blAttr(m, "#c9a070") + '/><path d="M-30 32 V0 M0 32 V-2 M28 32 V0" stroke="#a8764f" stroke-width="2.5"/><ellipse cx="0" cy="-8" rx="60" ry="13" ' + blAttr(m, "#e8c48a") + '/><ellipse cx="0" cy="-8" rx="34" ry="6" fill="none" stroke="#c9a070" stroke-width="2"/>' +
          '<path d="M-20 -14 Q-26 -40 -14 -50 H14 Q26 -40 20 -14Z" ' + blAttr(m, "#f2c14e") + '/><path d="M-16 -50 h32 v-6 h-32z" fill="#f6d9c4" stroke="' + BL_K + '" stroke-width="2"/><path d="M-18 -36 q8 6 16 0 q8 6 18 0" stroke="#d99a2a" stroke-width="2.5" fill="none"/>'; } },
      { nev: "könyvespolc", x: 900, y: 200, rx: 90, ry: 30, all: [700, 380], rajz: function (m) {
        return m === "korv" ? '<path d="M-90 6 V-28 H70 V6 H90 V20 H-90Z" ' + blAttr(m) + '/>' :
          '<path d="M-70 20 l12 22 M70 20 l-12 22" stroke="#a8764f" stroke-width="6" stroke-linecap="round"/>' +
          '<rect x="-80" y="-26" width="18" height="34" rx="3" ' + blAttr(m, "#8fc4a0") + '/><rect x="-60" y="-20" width="16" height="28" rx="3" ' + blAttr(m, "#f2c14e") + '/><rect x="-42" y="-30" width="20" height="38" rx="3" ' + blAttr(m, "#8aa6c8") + '/><path d="M-18 8 L-4 -24 L10 -20 L-2 8Z" ' + blAttr(m, "#e88a6a") + '/><rect x="20" y="-14" width="34" height="22" rx="10" ' + blAttr(m, "#f6d9c4") + '/>' +
          '<rect x="-90" y="8" width="180" height="12" rx="4" ' + blAttr(m, "#a8764f") + '/>'; } },
      { nev: "virágos ablakláda", x: 1080, y: 292, rx: 64, ry: 40, all: [880, 380], rajz: function (m) {
        return m === "korv" ? '<path d="M-64 22 V-6 H-50 Q-40 -44 0 -48 Q40 -44 50 -6 H64 V22Z" ' + blAttr(m) + '/>' :
          [[-40, -26, "#e88a6a"], [-12, -38, "#f2c14e"], [16, -30, "#fffaf2"], [42, -24, "#e88a6a"]].map(function (p) {
            return '<path d="M' + p[0] + ' -6 V' + (p[1] + 8) + '" stroke="#5a9a4a" stroke-width="3"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="' + (m === "lila" ? "#d9c4f0" : p[2]) + '" stroke="' + BL_K + '" stroke-width="2"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#d99a2a"/>'; }).join('') +
          '<rect x="-62" y="-8" width="124" height="30" rx="5" ' + blAttr(m, "#8fc4a0") + '/><path d="M-62 6 H62" stroke="#6aa080" stroke-width="2.5"/>'; } },
      { nev: "mohás fészekágy", x: 380, y: 376, rx: 124, ry: 30, all: [200, 380], fekhely: true, rajz: function (m) {
        return '<ellipse rx="124" ry="30" ' + blAttr(m, "#8fc48a") + '/>' + (m === "korv" ? '' :
          '<path d="M-110 -6 q10 -14 22 -4 q12 -16 24 -2 q12 -14 26 -2 q14 -14 26 0 q14 -12 26 0 q14 -12 26 2 q10 -8 16 6" stroke="#5f9a5a" stroke-width="3" fill="none"/><ellipse cx="6" cy="-4" rx="86" ry="17" fill="#fff4e0" stroke="' + BL_K + '" stroke-width="2.5"/><path d="M-60 -6 h20 M-20 -8 h20 M20 -6 h20" stroke="#e8c48a" stroke-width="4" stroke-linecap="round"/>'); } }
    ]
  }
};
function blAblak(x, y, r) {   /* kerek ablak, mint kint: halványkék üveg, zöld domb, fa-keret, kereszt */
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#e9f4fb" stroke="#a8764f" stroke-width="10"/>' +
    '<path d="M' + (x - r * .7) + ' ' + (y + r * .55) + ' q' + r * .3 + ' ' + (-r * .7) + ' ' + r * .6 + ' -' + r * .12 + ' q' + r * .25 + ' ' + (-r * .6) + ' ' + r * .75 + ' ' + r * .1 + ' Z" fill="#a7d99a" opacity=".85"/>' +
    '<path d="M' + x + ' ' + (y - r) + ' V' + (y + r) + ' M' + (x - r) + ' ' + y + ' H' + (x + r) + '" stroke="#a8764f" stroke-width="5"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="' + BL_K + '" stroke-width="2.5"/>';
}
var BL_CSS = '<style>' +
  '#bl-sotet{transition:opacity 1.2s ease}#bl-feny{transform-box:fill-box;transform-origin:center;transition:transform 1.2s ease,opacity 1.2s ease}' +
  '#bl-izzo{transition:fill 1s}#bl-meleg{transition:opacity 1.2s ease}' +
  '#bl-lang{transform-box:fill-box;transform-origin:50% 100%;transition:transform 1.2s ease}' +
  '.bl-lobog{animation:blLob 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}@keyframes blLob{0%,100%{transform:scale(1,1)}50%{transform:scale(.95,1.07)}}' +
  '.bl-be{animation:blBe .6s ease-out}@keyframes blBe{from{opacity:0}to{opacity:1}}' +
  '.bl-lukt{animation:blLukt 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes blLukt{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}' +
  '.bl-dereng{animation:blDer 1.6s ease-in-out infinite}@keyframes blDer{0%,100%{opacity:.55}50%{opacity:1}}' +
  '.bl-villan{animation:blVil .9s ease-out}@keyframes blVil{0%{opacity:.4}30%{opacity:1;filter:drop-shadow(0 0 10px #fff3b0)}100%{opacity:.6}}' +
  '.bl-bogar-fenylik{animation:blBog 2.4s ease-in-out infinite}@keyframes blBog{0%,100%{opacity:.75}50%{opacity:1}}' +
  '.bl-ugrik{animation:blUgr .45s ease-out;transform-box:fill-box;transform-origin:center}@keyframes blUgr{0%{transform:translateY(0)}40%{transform:translateY(-14px)}100%{transform:translateY(0)}}' +
  '.bl-felirat{animation:blBe .4s ease-out}' +
  '@media (prefers-reduced-motion:reduce){.bl-lukt,.bl-dereng,.bl-bogar-fenylik,.bl-be,.bl-lobog{animation:none}}' +
  '</style>';

/* ── állapot a futó pályán ── */
var BL = null;   /* { haz, n (tárgyak száma ezen a futáson), fenyes (letett db), t (mostani tárgy indexe), bogar, var: {...} } */
function blHaz() { return BELSO[(J && J.palya && J.palya.belso) || "kisgomba"]; }
function blSvg() { return document.querySelector("#szinpad svg"); }
function blEl(id) { return document.getElementById(id); }
/* a futás tárgy-sora: a nem-cél állomások sorban az első 4 tárgyat kapják, a cél (Odú-küszöb) mindig a fekhelyet
   — így az újonc rövid pályája (Rajt → 2 szakasz → küszöb) magától szőnyeg → kosár → fekhely */
function blTargyIdx(i) {
  var a = J.allomasok[i], T = blHaz().targyak;
  return a && a.cel ? T.length - 1 : Math.min(i - 1, T.length - 2);
}
/* van: false = üres hely · true = sárga (megoldotta) · "lila" = a hosszú útról hozta (mint a lila pipa: segítséggel) */
function blBogarSVG(x, y, van) {
  var lila = van === "lila";
  return van ? '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')"><g class="bl-bogar-fenylik"><circle r="17" fill="' + (lila ? "#e6d9f5" : "#fff3b0") + '" opacity=".6"/>' +
      '<ellipse cx="-6" cy="-6" rx="6" ry="4" fill="#fff" opacity=".85"/><ellipse cx="6" cy="-6" rx="6" ry="4" fill="#fff" opacity=".85"/>' +
      '<circle r="7" fill="' + (lila ? "#b48ee0" : "#fcd24a") + '" stroke="' + BL_K + '" stroke-width="1.5"/></g></g>'
    : '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="#fff8e0" fill-opacity=".35" stroke="#8a74a8" stroke-width="2.5" stroke-dasharray="4 4"/>';
}
/* a k. bogár helye (n darab ív mentén a tárgy fölött) */
function blBogarHely(t, k, n) {
  var a = Math.PI * (1.12 + 0.76 * (n > 1 ? k / (n - 1) : .5));
  return [t.x + Math.cos(a) * (t.rx + 34), t.y + Math.sin(a) * (t.ry + 46) - 12];
}

/* ═════ A KÉP (renderer.js jelenetSVG hívja, ha a pályán belso van) ═════ */
function belsoSVG(palya, c) {
  var H = BELSO[palya.belso] || BELSO.kisgomba, a = H.ajto, F = blFeny(H), hd = blHideg(H);
  return '<svg class="bl-be" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + BL_CSS + '<defs><radialGradient id="bl-feny-g"><stop offset="0" stop-color="#fff6c0" stop-opacity="1"/><stop offset=".45" stop-color="#fff3b0" stop-opacity=".55"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>' + H.hatter() +
    '<rect id="bl-sotet" width="1200" height="560" fill="' + hd[0] + '" opacity="' + hd[1] + '"/>' +
    (H.meleg ? '<rect id="bl-meleg" width="1200" height="560" fill="' + H.meleg[0] + '" opacity="0"/>' : '') +
    '<circle id="bl-feny" cx="' + F.x + '" cy="' + F.y + '" r="' + F.r + '" fill="url(#bl-feny-g)" opacity=".5" style="transform:scale(' + F.sk + ')"/>' +
    H.cel() +
    '<g id="kamera"><g id="bl-kesz"></g><g id="bl-most"></g>' +
    lenyKiserSVG(a[0], a[1]) +
    '<g id="unikornis-hely" transform="translate(' + a[0] + ',' + a[1] + ')">' +
      '<g id="uni-irany" style="--dir:1;transform:scale(var(--dir,1),1)">' + unikornisSVG("uni", c, BL_UNI, P().oltozet) + '</g></g>' +
    '<g id="bl-viszi"></g><g id="bl-repul"></g>' +
    '<g id="bl-felirat" style="display:none"><rect x="430" y="18" width="340" height="52" rx="24" fill="#fffaf2" stroke="#c9a8e6" stroke-width="3"/>' +
      '<text x="600" y="53" font-size="28" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">Tedd a helyére!</text></g>' +
    '</g></svg>';
}
/* pálya-indításkor (engine-logic palyaInditas, az osvenyIndul helyett) */
function belsoIndul() {
  var H = blHaz(), n = J.allomasok.length - 1;
  BL = { haz: H, n: n, fenyes: 0, t: null, bogar: 0, var: null, ido: null };
  OSV.x = H.ajto[0]; OSV.y = H.ajto[1];
  var u = osvenyUni();
  if (u.el) uniNezoAdat(u.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  lenyKiserIndul();
  blFenyAllit(true);
  var svg = blSvg(); if (svg) svg.addEventListener("click", blKopp);
}
/* a lámpa: 0 = pislákol … 1 = teljesen ég; a szoba vele világosodik (folyamatos fény, nem megszámolható) */
/* a ház fénykör-adatai (alap: a lámpa pontja, r 300, .18-ról nő) és a hűvös/sötét rétege (alap: a kis ház lilás sötétje) */
function blFeny(H) { var F = H.feny || {}; return { x: F.x != null ? F.x : H.lampa[0], y: F.y != null ? F.y : H.lampa[1], r: F.r || 300, sk: F.sk || 0.18 }; }
function blHideg(H) { return H.hideg || ["#4a2a3a", 0.3]; }
function blFenyAllit(azonnal) {
  var f = BL.n ? BL.fenyes / BL.n : 0, sot = blEl("bl-sotet"), feny = blEl("bl-feny"), iz = blEl("bl-izzo"), mel = blEl("bl-meleg"), lang = blEl("bl-lang");
  if (!sot) return;
  var F = blFeny(BL.haz), hd = blHideg(BL.haz), el = [sot, feny, iz, mel, lang].filter(Boolean);
  if (azonnal) el.forEach(function (e) { e.style.transition = "none"; });
  sot.setAttribute("opacity", (hd[1] * (1 - f)).toFixed(3));
  if (mel) mel.setAttribute("opacity", (BL.haz.meleg[1] * f).toFixed(3));   /* 3A: hűvösből mézszínű */
  feny.style.transform = "scale(" + (F.sk + (1 - F.sk) * f).toFixed(3) + ")";
  feny.setAttribute("opacity", (0.5 + 0.5 * f).toFixed(3));
  if (iz) iz.setAttribute("fill", f >= 1 ? "#fff3b0" : f > 0 ? "#fcd24a" : "#e4d2a6");
  if (lang) lang.style.transform = "scale(" + (0.22 + 0.78 * f).toFixed(3) + ")";   /* a kályha lángja: parázsból lobogó tűz */
  if (azonnal) setTimeout(function () { el.forEach(function (e) { e.style.transition = ""; }); }, 30);
}
/* szakasz eleje: a mostani tárgy halvány körvonala + n bogár-hely; az unikornis rövid, egyenes sétával mellé megy */
function belsoAllomasra(i, n, kesz) {
  var T = BL.haz.targyak, ti = blTargyIdx(i), t = T[ti];
  BL.t = ti; BL.bogar = 0; BL.bogarN = n; BL.var = null; BL.lila = {};
  blMostRajz();
  osvenyMegy([[OSV.x, OSV.y], t.all], null, function () { blFelem(); if (kesz) kesz(); });
}
function blFelem() {   /* a mostani tárgy felé fordul */
  var u = osvenyUni(), t = BL.haz.targyak[BL.t], d = t.x < OSV.x ? -1 : 1;
  if (u.el && uniIrany(u.el) !== d) uniFordul(u.el, d);
}
function blMostRajz() {
  var t = BL.haz.targyak[BL.t], s = '<g id="bl-hely" data-bl="hely" class="bl-dereng" transform="translate(' + t.x + ',' + t.y + ')">' + t.rajz("korv") +
    '<rect x="' + (-t.rx - 20) + '" y="' + (-t.ry - 30) + '" width="' + (2 * t.rx + 40) + '" height="' + (2 * t.ry + 50) + '" fill="transparent"/></g>';
  for (var k = 0; k < BL.bogarN; k++) { var h = blBogarHely(t, k, BL.bogarN); s += '<g id="bl-bog-' + k + '">' + blBogarSVG(h[0], h[1], k < BL.bogar && (BL.lila[k] ? "lila" : true)) + '</g>'; }
  blEl("bl-most").innerHTML = s;
}
/* egy pont-pont mozgás (rAF), a g transform-jával */
function blRepit(el, a, b, ms, kesz, sk) {
  if (nyugiMod() || window.__UC_GYORS) { el.setAttribute("transform", "translate(" + b[0] + "," + b[1] + ")" + (sk ? " scale(" + sk[1] + ")" : "")); if (kesz) kesz(); return; }
  var t0 = performance.now();
  requestAnimationFrame(function lep(most) {
    if (!el.isConnected) return;
    var t = Math.min(1, (most - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    var x = a[0] + (b[0] - a[0]) * e, y = a[1] + (b[1] - a[1]) * e - Math.sin(Math.PI * t) * 40;
    el.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")" + (sk ? " scale(" + (sk[0] + (sk[1] - sk[0]) * e).toFixed(3) + ")" : ""));
    if (t < 1) requestAnimationFrame(lep); else if (kesz) kesz();
  });
}
/* JÓ VÁLASZ (ertekel, a J.feladatKesz++ után): egy szentjánosbogár beröppen a következő helyre és felragyog.
   Hibás válaszra a képen semmi (tervlap 2A). */
function belsoBogar(k, lila) {
  if (!BL || BL.t == null || k < 1 || k > BL.bogarN) return;
  var t = BL.haz.targyak[BL.t], h = blBogarHely(t, k - 1, BL.bogarN), rep = blEl("bl-repul"), v = lila ? "lila" : true;
  BL.bogar = k; if (lila) BL.lila[k - 1] = true;
  if (!rep) return;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = blBogarSVG(0, 0, v); rep.appendChild(g);
  var hon = lila ? [OSV.x, OSV.y - 120] : k % 2 ? [1100, 300] : [BL.haz.lampa[0], BL.haz.lampa[1] + 20];   /* az ablak felől / a lámpa alól röppen be; a lilát az unikornis hozza */
  blRepit(g, hon, h, 750, function () { g.remove(); var hely = blEl("bl-bog-" + (k - 1)); if (hely) hely.innerHTML = blBogarSVG(h[0], h[1], v); });
}
/* ÁLLOMÁS VÉGE (allomasKesz): a bogarak a körvonalba gyűlnek, a tárgy elkészül és lüktetve lebeg a helye fölött;
   „Tedd a helyére!” — a gyerek felveszi (koppint), majd leteszi (koppint a helyére). Nincs időkorlát (8A). */
function belsoKesz(kesz) {
  var t = BL.haz.targyak[BL.t], most = blEl("bl-most");
  [].forEach.call(most.querySelectorAll("[id^=bl-bog-] > g"), function (g) {   /* a bogarak a tárgyba szállnak */
    var m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.getAttribute("transform") || ""); if (!m) return;
    blRepit(g, [+m[1], +m[2]], [t.x, t.y], 500, function () { g.remove(); });
  });
  setTimeout(function () { blTargyLebeg("kesz", kesz); }, nyugiMod() ? 0 : 560);
}
function blTargyLebeg(m, kesz) {
  var t = BL.haz.targyak[BL.t], most = blEl("bl-most");
  most.innerHTML = '<g id="bl-hely" data-bl="hely" class="bl-dereng" transform="translate(' + t.x + ',' + t.y + ')">' + t.rajz("korv") +
    '<rect x="' + (-t.rx - 20) + '" y="' + (-t.ry - 30) + '" width="' + (2 * t.rx + 40) + '" height="' + (2 * t.ry + 50) + '" fill="transparent"/></g>' +
    '<g id="bl-targy" data-bl="targy" transform="translate(' + t.x + ',' + (t.y - 34) + ')"><g class="bl-lukt">' + t.rajz(m) +
    '<rect x="' + (-t.rx - 10) + '" y="' + (-t.ry - 40) + '" width="' + (2 * t.rx + 20) + '" height="' + (2 * t.ry + 60) + '" fill="transparent"/></g></g>';
  BL.var = { m: m, viszi: false, kesz: kesz };
  blFelirat(true);
  mondd("Tedd a helyére!");
  blEmlekIndit();
}
function blFelirat(be) { var f = blEl("bl-felirat"); if (f) { f.style.display = be ? "" : "none"; if (be) { f.classList.remove("bl-felirat"); void f.getBBox(); f.classList.add("bl-felirat"); } } }
/* 6 mp tétlenség után a hely egyet villan (7A); minden koppintás újraindítja */
function blEmlekIndit() {
  clearTimeout(BL.ido);
  BL.ido = setTimeout(function () {
    if (!BL || !BL.var) return;
    var h = blEl("bl-hely"); if (h) { h.classList.remove("bl-villan"); void h.getBBox(); h.classList.add("bl-villan"); setTimeout(function () { h.classList.remove("bl-villan"); }, 950); }
    blEmlekIndit();
  }, 6000);
}
/* a vitt tárgy az unikornis szarva fölött lebeg (követi, ha sétál) */
function blViszPont() { var d = uniIrany(osvenyUni().el); return [OSV.x + d * 26, OSV.y - 150]; }
function blFelvesz(m) {
  var t = BL.haz.targyak[BL.t], v = blEl("bl-viszi"), tg = blEl("bl-targy");
  if (tg) tg.remove();
  v.innerHTML = '<g id="bl-vitt"><g class="bl-lukt">' + t.rajz(m) + '</g></g>';
  var g = v.firstChild, sk = 0.38;
  g.setAttribute("transform", "translate(" + blViszPont().join(",") + ") scale(" + sk + ")");
  BL.var.viszi = true;
  (function kov() {   /* amíg viszi, a szarv fölött marad */
    requestAnimationFrame(function () {
      if (!BL || !BL.var || !BL.var.viszi || !g.isConnected || g._repul) return;
      g.setAttribute("transform", "translate(" + blViszPont().map(function (n) { return n.toFixed(1); }).join(",") + ") scale(" + sk + ")");
      kov();
    });
  })();
}
function blKopp(e) {
  if (!BL || !BL.var) return;
  var svg = blSvg(), V = BL.var;
  blEmlekIndit();
  if (!V.viszi) {
    if (e.target.closest && e.target.closest("[data-bl=targy]")) { hangGomb(); blFelvesz(V.m); return; }
    var tg = blEl("bl-targy"); if (tg) { var l = tg.firstChild; l.classList.remove("bl-ugrik"); void l.getBBox(); l.classList.add("bl-ugrik"); }   /* „engem vegyél fel” */
    return;
  }
  var hely = (e.target.closest && e.target.closest("[data-bl=hely]")) ? "hely" : fvLegkozelebbi(svg, "[data-bl=hely]", "data-bl", e);
  var vitt = blEl("bl-vitt");
  if (hely !== "hely") {   /* rossz helyre: a tárgy finoman visszaugrik a szarv fölé, nincs hibajel */
    if (vitt) { var l2 = vitt.firstChild; l2.classList.remove("bl-ugrik"); void l2.getBBox(); l2.classList.add("bl-ugrik"); }
    return;
  }
  blLetesz(vitt);
}
function blLetesz(vitt) {
  var t = BL.haz.targyak[BL.t], V = BL.var;
  BL.var = null; clearTimeout(BL.ido);
  blFelirat(false);
  var hon = blViszPont();
  if (vitt) vitt._repul = true;
  var vege = function () {
    if (vitt) vitt.remove();
    blEl("bl-most").innerHTML = "";
    var k = blEl("bl-kesz"); if (!k) return;
    k.insertAdjacentHTML("beforeend", '<g data-targy="' + BL.t + '" transform="translate(' + t.x + ',' + t.y + ')">' + t.rajz(V.m) + '</g>');
    BL.fenyes++; blFenyAllit();
    hangCsilla();
    setTimeout(function () { if (V.kesz) V.kesz(); }, nyugiMod() ? 300 : 1100);
  };
  if (vitt) blRepit(vitt, hon, [t.x, t.y], 520, vege, [0.38, 1]); else vege();
}
/* HOSSZÚ ÚT (engine-logic keruloUt): EGY feladatot vált ki (a producer, 11-27 — nem az egész tárgyat): kimegy a kis ajtón,
   rövid kör odakint, visszajön a tárgy mellé; utána a motor egy LILÁS bogarat tesz a következő helyre (belsoBogar(k, true)). */
function belsoKerulo(kesz) {
  var H = BL.haz, u = osvenyUni();
  var vissza = function () {
    if (!u.hely || !u.hely.isConnected) return;
    u.hely.setAttribute("opacity", "1"); u.hely.removeAttribute("transform"); osvenyAllit(H.kint[0], H.kint[1]);
    uniNezetMutat(u.el, null);
    if (typeof _ks !== "undefined" && _ks && _ks.el.isConnected) { _ks.oduba = null; _ks.el.setAttribute("opacity", "1"); }   /* 🐉 a kölyök is visszajön */
    osvenyMegy([[OSV.x, OSV.y], H.targyak[BL.t].all], null, function () { blFelem(); if (kesz) kesz(); });
  };
  osvenyMegy([[OSV.x, OSV.y], H.ajto, H.kint], null, function () {
    if (!u.hely || !u.hely.isConnected) return;
    lenyKiserOduba(H.kint[0] + 20, H.kint[1]);
    if (nyugiMod() || window.__UC_GYORS) { u.hely.setAttribute("opacity", "0"); setTimeout(vissza, window.__UC_GYORS ? 0 : 900); return; }
    uniNezetMutat(u.el, "hatul");
    var t0 = performance.now(), MS = 600;
    requestAnimationFrame(function lep(most) {
      if (!u.hely.isConnected) return;
      var t = Math.min(1, (most - t0) / MS);
      u.hely.setAttribute("opacity", (1 - t).toFixed(3));
      if (t < 1) requestAnimationFrame(lep); else setTimeout(vissza, 1800);   /* odakint: egy kör a fák között */
    });
  });
}
/* PÁLYA VÉGE (a fekhely letétele után): a lámpa teljesen ég, az unikornis lefekszik, a kissárkány mellé gömbölyödik; utána a mai jutalom */
function belsoLefekves(kesz) {
  var t = BL.haz.targyak[BL.haz.targyak.length - 1], u = osvenyUni();
  BL.fenyes = BL.n; blFenyAllit();
  var hely = [t.x + 10, t.y - 4];
  osvenyMegy([[OSV.x, OSV.y], hely], null, function () {
    if (!u.el || !u.el.isConnected) return;
    if (typeof _ks !== "undefined" && _ks && _ks.el.isConnected) _ks.oduba = { x: hely[0] + 96, y: hely[1] - 30, t0: Infinity };   /* mellé száll, és ott marad */
    uniFordul(u.el, -1);   /* fejjel a párna felé */
    setTimeout(function () { if (u.el.isConnected) u.el.classList.add("fekszik-all"); }, 350);
    setTimeout(function () { if (u.el.isConnected) u.el.classList.add("uni-alszik"); }, 1500);
    setTimeout(function () { if (kesz) kesz(); }, (nyugiMod() || window.__UC_GYORS) ? 200 : 2600);
  });
}

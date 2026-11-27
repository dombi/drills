/* ═════════════════ 🍄 A HÁZ BELSEJE: a pálya képe a ház belsejében (16a, Matekos\allomasok-16a-tervlap.html) ═════════════════
   A kanyargós ösvény helyett (osveny.js): a pálya a ház szobájában játszódik. Csak a MOSTANI tárgy szaggatott körvonala és
   4 szentjánosbogár-hely látszik; a kész tárgyak a szobában maradnak (a megszerzett nő, a hátralévő sehogy nem látszik).
   A cél EGY tárgy az elejétől: a gomba-lámpa, ami minden letett tárgytól fényesebb; az utolsó (fekhely) után teljesen ég,
   az unikornis lefekszik, a kissárkány mellé gömbölyödik.
   Kapcsoló: a pályán `belso: "kisgomba"` (constants.js). A pálya-motor (engine-logic.js) ágazik el ide:
     belsoSVG (renderer.js jelenetSVG) · belsoIndul · belsoAllomasra · belsoBogar (jó válasz) · belsoKesz (állomás vége →
     „Tedd a helyére!”, felvesz – letesz, felvesz.js) · belsoKerulo (hosszú út: kimegy, lilás tárgyat hoz) · belsoLefekves (pálya vége).
   A séta a közös osvenyMegy (osveny.js) — ugyanaz a járás, ugyanaz az OSV hely, a kölyök is ugyanúgy követ (leny-kiser.js).
   Új ház belseje = egy új sor a BELSO táblában (hatter + ajtó + lámpa + 5 tárgy). */
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
  }
};
var BL_CSS = '<style>' +
  '#bl-sotet{transition:opacity 1.2s ease}#bl-feny{transform-box:fill-box;transform-origin:center;transition:transform 1.2s ease,opacity 1.2s ease}' +
  '#bl-izzo{transition:fill 1s}.bl-be{animation:blBe .6s ease-out}@keyframes blBe{from{opacity:0}to{opacity:1}}' +
  '.bl-lukt{animation:blLukt 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes blLukt{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}' +
  '.bl-dereng{animation:blDer 1.6s ease-in-out infinite}@keyframes blDer{0%,100%{opacity:.55}50%{opacity:1}}' +
  '.bl-villan{animation:blVil .9s ease-out}@keyframes blVil{0%{opacity:.4}30%{opacity:1;filter:drop-shadow(0 0 10px #fff3b0)}100%{opacity:.6}}' +
  '.bl-bogar-fenylik{animation:blBog 2.4s ease-in-out infinite}@keyframes blBog{0%,100%{opacity:.75}50%{opacity:1}}' +
  '.bl-ugrik{animation:blUgr .45s ease-out;transform-box:fill-box;transform-origin:center}@keyframes blUgr{0%{transform:translateY(0)}40%{transform:translateY(-14px)}100%{transform:translateY(0)}}' +
  '.bl-felirat{animation:blBe .4s ease-out}' +
  '@media (prefers-reduced-motion:reduce){.bl-lukt,.bl-dereng,.bl-bogar-fenylik,.bl-be{animation:none}}' +
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
function blBogarSVG(x, y, van) {
  return van ? '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')"><g class="bl-bogar-fenylik"><circle r="17" fill="#fff3b0" opacity=".6"/>' +
      '<ellipse cx="-6" cy="-6" rx="6" ry="4" fill="#fff" opacity=".85"/><ellipse cx="6" cy="-6" rx="6" ry="4" fill="#fff" opacity=".85"/>' +
      '<circle r="7" fill="#fcd24a" stroke="' + BL_K + '" stroke-width="1.5"/></g></g>'
    : '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="#fff8e0" fill-opacity=".35" stroke="#8a74a8" stroke-width="2.5" stroke-dasharray="4 4"/>';
}
/* a k. bogár helye (n darab ív mentén a tárgy fölött) */
function blBogarHely(t, k, n) {
  var a = Math.PI * (1.12 + 0.76 * (n > 1 ? k / (n - 1) : .5));
  return [t.x + Math.cos(a) * (t.rx + 34), t.y + Math.sin(a) * (t.ry + 46) - 12];
}

/* ═════ A KÉP (renderer.js jelenetSVG hívja, ha a pályán belso van) ═════ */
function belsoSVG(palya, c) {
  var H = BELSO[palya.belso] || BELSO.kisgomba, L = H.lampa, a = H.ajto;
  return '<svg class="bl-be" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + BL_CSS + '<defs><radialGradient id="bl-feny-g"><stop offset="0" stop-color="#fff6c0" stop-opacity="1"/><stop offset=".45" stop-color="#fff3b0" stop-opacity=".55"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>' + H.hatter() +
    '<rect id="bl-sotet" width="1200" height="560" fill="#4a2a3a" opacity=".3"/>' +
    '<circle id="bl-feny" cx="' + L[0] + '" cy="' + L[1] + '" r="300" fill="url(#bl-feny-g)" opacity=".5" style="transform:scale(.18)"/>' +
    '<line x1="' + L[0] + '" y1="55" x2="' + L[0] + '" y2="' + (L[1] - 46) + '" stroke="' + BL_K + '" stroke-width="3"/>' +
    '<g id="bl-lampa" transform="translate(' + L[0] + ',' + L[1] + ')"><path d="M-48 -8 Q0 -78 48 -8Z" fill="#f0766a" stroke="' + BL_K + '" stroke-width="3"/>' +
    '<circle cx="-16" cy="-30" r="6" fill="#fffaf2"/><circle cx="16" cy="-26" r="5" fill="#fffaf2"/><circle cx="0" cy="-48" r="4" fill="#fffaf2"/>' +
    '<ellipse id="bl-izzo" cx="0" cy="4" rx="26" ry="18" fill="#e4d2a6" stroke="' + BL_K + '" stroke-width="3"/></g>' +
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
function blFenyAllit(azonnal) {
  var f = BL.n ? BL.fenyes / BL.n : 0, sot = blEl("bl-sotet"), feny = blEl("bl-feny"), iz = blEl("bl-izzo");
  if (!sot) return;
  if (azonnal) [sot, feny, iz].forEach(function (e) { e.style.transition = "none"; });
  sot.setAttribute("opacity", (0.3 * (1 - f)).toFixed(3));
  feny.style.transform = "scale(" + (0.18 + 0.82 * f).toFixed(3) + ")";
  feny.setAttribute("opacity", (0.5 + 0.5 * f).toFixed(3));
  iz.setAttribute("fill", f >= 1 ? "#fff3b0" : f > 0 ? "#fcd24a" : "#e4d2a6");
  if (azonnal) setTimeout(function () { [sot, feny, iz].forEach(function (e) { e.style.transition = ""; }); }, 30);
}
/* szakasz eleje: a mostani tárgy halvány körvonala + n bogár-hely; az unikornis rövid, egyenes sétával mellé megy */
function belsoAllomasra(i, n, kesz) {
  var T = BL.haz.targyak, ti = blTargyIdx(i), t = T[ti];
  BL.t = ti; BL.bogar = 0; BL.bogarN = n; BL.var = null;
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
  for (var k = 0; k < BL.bogarN; k++) { var h = blBogarHely(t, k, BL.bogarN); s += '<g id="bl-bog-' + k + '">' + blBogarSVG(h[0], h[1], k < BL.bogar) + '</g>'; }
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
function belsoBogar(k) {
  if (!BL || BL.t == null || k < 1 || k > BL.bogarN) return;
  var t = BL.haz.targyak[BL.t], h = blBogarHely(t, k - 1, BL.bogarN), rep = blEl("bl-repul");
  BL.bogar = k;
  if (!rep) return;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = blBogarSVG(0, 0, true); rep.appendChild(g);
  var hon = k % 2 ? [1100, 300] : [BL.haz.lampa[0], BL.haz.lampa[1] + 20];   /* az ablak felől vagy a lámpa alól röppen be */
  blRepit(g, hon, h, 750, function () { g.remove(); var hely = blEl("bl-bog-" + (k - 1)); if (hely) hely.innerHTML = blBogarSVG(h[0], h[1], true); });
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
/* HOSSZÚ ÚT (keruloUt, 3A): kimegy a kis ajtón, rövid kör odakint, és a tárgyat lilás színben, bogarak nélkül hozza vissza;
   a gyerek ugyanúgy leteszi; a lámpa ugyanúgy fényesedik. */
function belsoKerulo(kesz) {
  var H = BL.haz, u = osvenyUni();
  BL.bogar = 0; blMostRajz();
  [].forEach.call(blEl("bl-most").querySelectorAll("[id^=bl-bog-]"), function (g) { g.remove(); });   /* bogarak nélkül */
  var vissza = function () {
    if (!u.hely || !u.hely.isConnected) return;
    u.hely.setAttribute("opacity", "1"); u.hely.removeAttribute("transform"); osvenyAllit(H.kint[0], H.kint[1]);
    uniNezetMutat(u.el, null);
    if (typeof _ks !== "undefined" && _ks && _ks.el.isConnected) { _ks.oduba = null; _ks.el.setAttribute("opacity", "1"); }   /* 🐉 a kölyök is visszajön */
    BL.var = { m: "lila", viszi: false, kesz: kesz };
    blFelvesz("lila");
    osvenyMegy([[OSV.x, OSV.y], H.targyak[BL.t].all], null, function () {
      blFelem();
      var hely = blEl("bl-hely"); if (hely) hely.classList.add("bl-dereng");
      blFelirat(true); mondd("Tedd a helyére!"); blEmlekIndit();
    });
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

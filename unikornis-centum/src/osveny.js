/* ═════════════════ ÖSVÉNY: a pálya-kép közös váza + az unikornis útja rajta ═════════════════
   (unikornis pózok 5. lépés, terv/osveny-seta-rajzterv.html)
   VÁZ: osvenyVaz(palya, c, díszlet) rajzolja a kanyargó utat, a Cél-odút, az „itt állsz” követ, az unikornist
   és a pipákat — minden pálya-család (erdő, műhely, könyvtár, vásár) ezt hívja, és csak a díszletet adja:
     hatter        = SVG a <g id="kamera"> elé (ég, fal, padló, füzér…)
     ut(d)         = az út rétegei a d görbéhez
     elotte(px,py) = ami az unikornis MÖGÉ kerül (Rajt-jel, táblák, sátrak)
     utana(px,py)  = ami ELÉ (munkapad, olvasóasztal — az unikornis a pad mögött áll)
     odu           = a Cél-odú: { arnyek, arnyekOp, mogotte (SVG az odú mögé), felirat: {fill, stroke, szin, font} | null, csillag: [y, r] }
     pipa(b,px,py) = a b. pipa helye ([x, y]); pipaKicsi = az erdei kis pipa; pipaElobb = a pipák az odú elé (az unikornis alá)
   SÉTA: az unikornis a rajzolt görbén halad (osvenyMegy), a lábát a közös járás mozgatja (uniUt/uniJar/uniAll),
   és visszafelé előbb megfordul (uniFordul). Erre épül: állomásról állomásra (osvenyAllomasra), a kerülő (osvenyKerulo),
   a pálya vége (osvenyOduba) és a jó válasz öröme (osvenyOrom). */
var SCENE_N = 8;
var TU_X0 = 78, TU_X1 = 1092;
function allomasX(i) { return TU_X0 + i * (TU_X1 - TU_X0) / Math.max(1, SCENE_N - 1); }
function allomasY(i) {
  var t = SCENE_N > 1 ? i / (SCENE_N - 1) : 0;
  return (418 - t * 176) + (i % 2 ? 40 : -40);   /* fölfelé sodródó cikk-cakk a 200–460 sávban */
}
/* az i-1. és i. állomás közti szakasz: köbös görbe, az állomásokon vízszintes érintővel */
function osvenySzakasz(i) {
  var x0 = allomasX(i - 1), y0 = allomasY(i - 1), x1 = allomasX(i), y1 = allomasY(i), dx = x1 - x0;
  return [[x0, y0], [x0 + dx / 2, y0], [x1 - dx / 2, y1], [x1, y1]];
}
function osvenyUtD(n) {
  var d = "M " + allomasX(0).toFixed(1) + " " + allomasY(0).toFixed(1);
  for (var i = 1; i < n; i++) {
    var g = osvenySzakasz(i);
    d += " C " + g[1][0].toFixed(1) + " " + g[1][1].toFixed(1) + " " + g[2][0].toFixed(1) + " " + g[2][1].toFixed(1) + " " + g[3][0].toFixed(1) + " " + g[3][1].toFixed(1);
  }
  return d;
}
/* a Cél-odú (x, y = az odú talppontja-közepe) */
function osvenyCelOdu(x, y, o) {
  var f = o.felirat, cs = o.csillag || [-128, 8];
  return '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')">' +
    '<ellipse cx="0" cy="34" rx="60" ry="16" fill="' + (o.arnyek || "#6b4a2a") + '" opacity="' + (o.arnyekOp || ".22") + '"/>' +
    (o.mogotte || "") +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    (f ? '<g transform="translate(0,-100)"><rect x="-56" y="-15" width="112" height="30" rx="12" fill="' + (f.fill || "#fdf4d8") + '" stroke="' + (f.stroke || "#c9a8e6") + '" stroke-width="2.5"/>' +
         '<text x="0" y="5" font-size="14" ' + f.font + ' fill="' + (f.szin || "#6a4a8a") + '" text-anchor="middle">Odú-küszöb</text></g>' : '') +
    csillagSVG(0, cs[0], cs[1], "#ffe08a") + '</g>';
}
function osvenyPipaSVG(b, x, y, kicsi) {
  return '<g class="allomas-pipa" id="pipa-' + b + '" transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')" opacity="0">' +
    (kicsi ? '<circle r="12" fill="#a7d99a"/>' : '<circle r="13" fill="#a7d99a" stroke="#fff" stroke-width="2"/>') +
    '<path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
}
function osvenyVaz(palya, c, o) {
  var n = palya.allomasok.length, px = [], py = [], k;
  SCENE_N = n;
  for (k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var pipak = "";
  for (k = 0; k < n; k++) { var h = o.pipa ? o.pipa(k, px, py) : [px[k], py[k]]; pipak += osvenyPipaSVG(k, h[0], h[1], o.pipaKicsi); }
  var s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + o.hatter +
    '<g id="kamera">' + o.ut(osvenyUtD(n)) + (o.elotte ? o.elotte(px, py) : "") + (o.pipaElobb ? pipak : "") +
    osvenyCelOdu(px[n - 1] + 62, py[n - 1] - 6, o.odu || {}) +
    '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' +
      '<g id="uni-irany" style="--dir:1;transform:scale(var(--dir,1),1)">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g></g>' +
    (o.utana ? o.utana(px, py) : "") + (o.pipaElobb ? "" : pipak);
  return s + '</g></svg>';
}

/* ── SÉTA ─────────────────────────────────────────────────────────────────────────────────── */
var OSV = { x: 0, y: 0, fut: null };   /* hol áll az unikornis (rajz-egység), és az épp futó út */
var OSV_KERULO = { le: 95, alja: 530 };   /* a kitérő: ennyivel az út alatt, de legfeljebb itt (pálya-egység) */
function osvenyUni() { return { hely: document.querySelector("#szinpad #unikornis-hely"), el: document.getElementById("uni-irany") }; }
/* pálya-indításkor, a jelenet kirajzolása után */
function osvenyIndul() {
  OSV.x = allomasX(0); OSV.y = allomasY(0); OSV.fut = null;
  var u = osvenyUni();
  if (u.el) uniNezoAdat(u.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });   /* a fordulás szemből-képéhez */
}
function osvenyAllit(x, y) {
  var u = osvenyUni(), ko = document.getElementById("mosti-ko");
  OSV.x = x; OSV.y = y;
  if (u.hely) u.hely.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")");
  if (ko) { ko.setAttribute("cx", x.toFixed(1)); ko.setAttribute("cy", (y + 8).toFixed(1)); }
}
/* köbös görbék → sűrű pontsor */
function osvenyPontok(gorbek) {
  var p = [], LEP = 24;
  gorbek.forEach(function (g, gi) {
    for (var k = gi ? 1 : 0; k <= LEP; k++) {
      var t = k / LEP, u = 1 - t, a = u * u * u, b = 3 * u * u * t, cc = 3 * u * t * t, d = t * t * t;
      p.push([a * g[0][0] + b * g[1][0] + cc * g[2][0] + d * g[3][0], a * g[0][1] + b * g[1][1] + cc * g[2][1] + d * g[3][1]]);
    }
  });
  return p;
}
/* sima görbe a pontokon át (Catmull–Rom → köbös darabok) */
function osvenySimaGorbe(q) {
  var g = [];
  for (var i = 0; i < q.length - 1; i++) {
    var a = q[Math.max(0, i - 1)], b = q[i], c = q[i + 1], d = q[Math.min(q.length - 1, i + 2)];
    g.push([b, [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6], c]);
  }
  return g;
}
/* a pontsor szétvágása irány szerint: ahol visszafelé indul, ott fordulni kell */
function osvenyIranySzakaszok(p) {
  var sz = [[p[0]]], dir = 0;
  for (var i = 1; i < p.length; i++) {
    var dx = p[i][0] - p[i - 1][0], d = dx > 0.01 ? 1 : dx < -0.01 ? -1 : dir;
    if (dir && d !== dir) sz.push([p[i - 1]]);
    if (d) dir = d;
    sz[sz.length - 1].push(p[i]);
  }
  return sz;
}
function osvenyHossz(p) { var L = 0; for (var i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
function osvenyPxEgyseg() {   /* hány képernyő-képpont egy pálya-egység */
  var k = document.querySelector("#szinpad #kamera"), m = k && k.getScreenCTM && k.getScreenCTM();
  return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1;
}
/* VÉGIGMEGY egy pontsoron: irány-szakaszonként előbb (ha kell) megfordul, aztán egyenletesen halad, járó lábbal.
   A közös uniUt dönt (séta/ügetés, tempó); o.seta = mindig természetes séta (a kerülőn);
   o.fordulon(tovabb) = mi történjen, mielőtt visszafelé indul (a kerülőn: megszagolja a füvet). */
function osvenyMegy(p, o, kesz) {
  o = o || {};
  var u = osvenyUni(), fut = OSV.fut = {};
  if (!u.hely || !u.el || p.length < 2 || osvenyHossz(p) < 2) { if (p.length) osvenyAllit(p[p.length - 1][0], p[p.length - 1][1]); if (kesz) kesz(); return; }
  if (window.__UC_GYORS) { osvenyAllit(p[p.length - 1][0], p[p.length - 1][1]); if (kesz) setTimeout(kesz, 0); return; }
  var szak = osvenyIranySzakaszok(p), egys = osvenyPxEgyseg(), si = 0;
  var iranyok = szak.map(function (q) { return q[q.length - 1][0] < q[0][0] ? -1 : 1; });
  (function kov() {
    if (fut !== OSV.fut || !u.hely.isConnected) return;   /* új út indult, vagy elhagytuk a pályát */
    if (si >= szak.length) { uniAll(u.el); if (kesz) kesz(); return; }
    if (si && o.fordulon && !o._kozte) { o._kozte = true; uniAll(u.el); o.fordulon(kov); return; }
    o._kozte = false;
    var q = szak[si], L = osvenyHossz(q), dir = iranyok[si++];
    u.el.classList.remove("uni-mozd-ugras", "osveny-orom");
    uniFordul(u.el, dir, function () {
      if (fut !== OSV.fut || !u.hely.isConnected) return;
      var ut = o.seta ? { mod: "seta", tempo: 1, mp: L * egys / (uniJarasSebesseg("seta") * uniPxEgyseg(u.el)) } : uniUt(u.el, L * egys);
      var cum = [0]; for (var i = 1; i < q.length; i++) cum.push(cum[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]));
      if (!nyugiMod()) uniJar(u.el, ut);
      var t0 = performance.now(), k = 1;
      requestAnimationFrame(function lep(most) {
        if (fut !== OSV.fut || !u.hely.isConnected) return;
        var s = Math.min(1, (most - t0) / (ut.mp * 1000)) * L;
        while (k < q.length - 1 && cum[k] < s) k++;
        var a = q[k - 1], b = q[k], r = cum[k] > cum[k - 1] ? (s - cum[k - 1]) / (cum[k] - cum[k - 1]) : 1;
        osvenyAllit(a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r);
        if (s < L) requestAnimationFrame(lep); else kov();
      });
    });
  })();
}
/* állomásról állomásra, az út görbéjén */
function osvenyAllomasra(i, kesz) {
  osvenyMegy(i > 0 ? osvenyPontok([osvenySzakasz(i)]) : [[OSV.x, OSV.y], [allomasX(0), allomasY(0)]], null, kesz);
}
/* KERÜLŐ („hosszú út”): lelép az útról, kanyarodik egyet a fűben (egyszer visszafordul, aztán újra előre),
   és a következő állomásnál (az utolsón: ugyanott) tér vissza — természetes sétával; a fordulóknál megszagolja a füvet. */
function osvenyKerulo(i, kesz) {
  var x0 = OSV.x, y0 = OSV.y, vegso = i + 1 >= SCENE_N;
  var x1 = vegso ? x0 : allomasX(i + 1), y1 = vegso ? y0 : allomasY(i + 1), dx = vegso ? 150 : x1 - x0;
  var lent = Math.min(OSV_KERULO.alja, Math.max(y0, y1) + OSV_KERULO.le);
  var q = [[x0, y0], [x0 + dx * 0.78, lent - 30], [x0 + dx * 0.2, lent], [x1, y1]];
  if (vegso) q = [[x0, y0], [x0 - dx * 0.6, lent - 20], [x0 - dx * 0.2, lent], [x0, y0]];   /* az utolsón visszafelé tér ki (az odú felé nincs hely) */
  osvenyMegy(osvenyPontok(osvenySimaGorbe(q)), { seta: true, fordulon: function (tovabb) {
    var el = osvenyUni().el; if (!el || nyugiMod()) { tovabb(); return; }
    el.classList.add("uni-mozd-szagol");
    setTimeout(function () { el.classList.remove("uni-mozd-szagol"); setTimeout(tovabb, 250); }, UNI_MOZDULAT.szagol.ido * 1000);
  } }, kesz);
}
/* PÁLYA VÉGE: az Odú-küszöbtől az ajtóhoz sétál, hátat fordít (bemegy), és eltűnik az ajtóban */
function osvenyOduba(kesz) {
  var u = osvenyUni(), n = SCENE_N, ax = allomasX(n - 1) + 62, ay = allomasY(n - 1) + 14;
  if (!u.hely || window.__UC_GYORS) { if (kesz) kesz(); return; }
  osvenyMegy([[OSV.x, OSV.y], [ax, ay]], null, function () {
    if (!u.hely.isConnected) return;
    if (nyugiMod()) { u.hely.setAttribute("opacity", "0"); if (kesz) kesz(); return; }
    uniNezetMutat(u.el, "hatul");   /* hátulról látjuk: befelé indul */
    var t0 = performance.now(), MS = 650;
    requestAnimationFrame(function lep(most) {
      if (!u.hely.isConnected) return;
      var t = Math.min(1, (most - t0) / MS), e = t * t;
      u.hely.setAttribute("transform", "translate(" + ax.toFixed(1) + "," + (ay - 16 * e).toFixed(1) + ") scale(" + (1 - 0.55 * e).toFixed(3) + ")");
      u.hely.setAttribute("opacity", (1 - e).toFixed(3));
      if (t < 1) requestAnimationFrame(lep); else if (kesz) kesz();
    });
  });
}
/* JÓ VÁLASZ: kis örömugrás a helyén (a kerti ugrás mozdulata, kisebb magassággal) */
function osvenyOrom() {
  var u = osvenyUni();
  if (!u.el || uniJarFut(u.el) || nyugiMod()) return;
  u.el.classList.remove("uni-mozd-ugras", "osveny-orom"); void u.el.getBoundingClientRect();
  u.el.classList.add("uni-mozd-ugras", "osveny-orom");
  clearTimeout(u.el._oromTimer);
  u.el._oromTimer = setTimeout(function () { u.el.classList.remove("uni-mozd-ugras", "osveny-orom"); }, UNI_MOZDULAT.ugras.ido * 1000 + 50);
}

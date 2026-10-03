/* ═══════════════ ÉLET AZ ODÚBAN (2026-09-28, rajzterv: Matekos/odu-elet-rajzterv.html) ═══════════════
   A kész odú-SVG-t (oduSVG) a renderOdu után „éleszti fel”: semmi ne álljon mozdulatlanul.
     A · élénk szoba — színátmenetes fal/padló, fénytócsák (lámpa, kályha, befőtt), ablak-fénysáv, szél-sötétítés
     F · kis élet    — láng, füst, lámpa-himbálózás, zászlók, porszemek, ablak, befőtt-csillag, párna, erdő,
                       katica a szivárvány-ágyon, nappal lepke / este szentjánosbogarak
     B · élő polc    — inda + csiga + derengő helyek + fény-suhanás + kristály-csillanás a Kincsvitrinen,
                       bugyogó üvegcsék + billegő makk + hajtás a gyökérpolcon, lebbenő lap a mesekönyvben
   Élénkség: közepes; koppintásra nem reagálnak (producer-ajánlás, 2026-09-28).
   Minden mozgás CSS (style.css „élet az odúban”), csak a lepke / bogarak / katica útját számolja a rAF,
   és azt is csak amíg az odú látszik. „Kevesebb mozgás” beállításnál minden áll.
   Csak a játék-szobában fut, a bolti előnézet kis szobája mozdulatlan marad. */
var _oduEletRaf = null;
function oduElet(svg, o) {
  if (_oduEletRaf) { cancelAnimationFrame(_oduEletRaf); _oduEletRaf = null; }
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  function q(s) { return svg.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); }
  function el(tag, at, par) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; }
  function elotte(uj, ref) { if (ref && ref.parentNode) ref.parentNode.insertBefore(uj, ref); else svg.appendChild(uj); return uj; }
  function utana(uj, ref) { if (ref && ref.parentNode) ref.parentNode.insertBefore(uj, ref.nextSibling); else svg.appendChild(uj); return uj; }
  function cls(n, c) { if (n) n.setAttribute("class", ((n.getAttribute("class") || "") + " " + c).trim()); return n; }
  function kesl(n, mp) { if (n) n.style.animationDelay = mp + "s"; return n; }
  function burok(nodes, c) {                  /* új csoportba fogja a meglévő elemeket (a helyükön), hogy együtt mozogjanak */
    nodes = nodes.filter(Boolean); if (!nodes.length) return null;
    var g = el("g", { "class": c }); nodes[0].parentNode.insertBefore(g, nodes[0]);
    nodes.forEach(function (n) { g.appendChild(n); }); return g;
  }
  function lin(defs, id, a, b) { var g = el("linearGradient", { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); el("stop", { offset: 0, "stop-color": a }, g); el("stop", { offset: 1, "stop-color": b }, g); }
  function rad(defs, id, c, op) { var g = el("radialGradient", { id: id }, defs); el("stop", { offset: 0, "stop-color": c, "stop-opacity": op }, g); el("stop", { offset: 0.55, "stop-color": c, "stop-opacity": op * 0.45 }, g); el("stop", { offset: 1, "stop-color": c, "stop-opacity": 0 }, g); }

  var defs = q("defs"), tint = q(".odu-tint");
  var este = o.napszak === "este" || o.napszak === "eclipse" || !o.napszak;

  /* ════════ A · ÉLÉNK SZOBA (közepes élénkség) ════════ */
  lin(defs, "e-fal", "#b99ce9", "#f7d3e1");
  lin(defs, "e-kul", "#9f80d6", "#c898c8");
  lin(defs, "e-pad", "#f5cbd7", "#dba9c4");
  rad(defs, "e-f-lampa", "#fff0bf", 0.8);
  rad(defs, "e-f-tuz", "#ffb98a", 0.715);
  rad(defs, "e-f-befott", "#fff0bf", 0.65);
  var savSzin = este ? "#cfdcff" : "#fff6d0";
  lin(defs, "e-f-sav", savSzin, savSzin);
  var vg = el("radialGradient", { id: "e-vignetta", cx: 0.5, cy: 0.52, r: 0.7 }, defs);
  el("stop", { offset: 0.55, "stop-color": "#2e2350", "stop-opacity": 0 }, vg); el("stop", { offset: 1, "stop-color": "#2e2350", "stop-opacity": 0.24 }, vg);
  qa(".odu-kul").forEach(function (x) { x.setAttribute("fill", "url(#e-kul)"); });
  qa(".odu-fal").forEach(function (x) { x.setAttribute("fill", "url(#e-fal)"); });
  qa(".odu-padlo").forEach(function (x) { x.setAttribute("fill", "url(#e-pad)"); });
  var ver = q(".odu-erezet"); if (ver) { ver.setAttribute("opacity", 0.8); ver.setAttribute("stroke", "#a084cc"); }
  var elenk = { "#f6a5c0": "#f592b9", "#f7c59f": "#f9ba8c", "#a7d99a": "#95d488", "#9ec9f0": "#89c0f2" };
  qa('ellipse[cx="340"][cy="488"], path[d$="l16 0 l-8 14 Z"]').forEach(function (x) { var f = x.getAttribute("fill"); if (elenk[f]) x.setAttribute("fill", elenk[f]); });
  /* fénytócsák a falon és a padlón, a bútor MÖGÖTT */
  var fg = q(".odu-feny-hely");
  if (fg) {
    fg.setAttribute("pointer-events", "none");
    el("polygon", { points: "150,200 232,200 330,520 60,520", fill: "url(#e-f-sav)", opacity: este ? 0.13 : 0.22 }, fg);
    el("ellipse", { "class": "e-lampa-feny", cx: 345, cy: 215, rx: 190, ry: 150, fill: "url(#e-f-lampa)" }, fg);
    el("ellipse", { "class": "e-lang-feny", cx: 548, cy: 420, rx: 150, ry: 120, fill: "url(#e-f-tuz)" }, fg);
    kesl(el("ellipse", { "class": "e-lang-feny", cx: 548, cy: 470, rx: 120, ry: 40, fill: "url(#e-f-tuz)" }, fg), -0.6);
    kesl(el("ellipse", { "class": "e-lampa-feny", cx: 460, cy: 392, rx: 90, ry: 75, fill: "url(#e-f-befott)" }, fg), -1.3);
  }
  if (tint) {
    var tx = +tint.getAttribute("x"), ty = +tint.getAttribute("y"), tw = +tint.getAttribute("width"), th = +tint.getAttribute("height");
    elotte(el("rect", { x: tx, y: ty, width: tw, height: th, fill: "url(#e-vignetta)", "pointer-events": "none" }), tint);
    if (o.napszak === "este" || !o.napszak) tint.setAttribute("opacity", 0.07);   /* a ködös esti fátyol halványabb, a fény melegebb */
  }

  /* ════════ F · KIS ÉLET ════════ */
  /* 1 kályhaláng */
  cls(q('path[fill="#f7a8c8"][d^="M528"]'), "e-lang e-lang1");
  cls(q('path[fill="#ffc59f"][d^="M533"]'), "e-lang e-lang2");
  cls(q('path[d^="M538 436"]'), "e-lang e-lang3");
  cls(q('ellipse[cx="542"][cy="432"]'), "e-lang-feny");
  cls(q('ellipse[cx="542"][cy="437"]'), "e-parazs");
  /* 2 füst */
  [["568", "292", 0], ["561", "278", -1.5], ["571", "266", -3]].forEach(function (p) { kesl(cls(q('circle[cx="' + p[0] + '"][cy="' + p[1] + '"]'), "e-fust"), p[2]); });
  /* 3 csillaglámpa */
  burok([q('line[x1="345"][y1="112"]'), q('circle[cx="345"][cy="150"]')].concat(qa('ellipse[cx="345"][cy="178"]')).concat([q('polygon[points^="345,154"]')]), "e-lampa");
  qa('ellipse[cx="345"][cy="178"]').forEach(function (x) { cls(x, "e-lampa-feny"); });
  /* 4 zászlók */
  qa('path[d$="l16 0 l-8 14 Z"]').forEach(function (x, i) { kesl(cls(x, "e-zaszlo"), -i * 0.45); });
  /* 6 porszemek a lámpa fényében */
  var por = elotte(el("g", { "pointer-events": "none", fill: "#fff2c4" }), tint);
  [[300, 250, 1.6, 0], [330, 270, 1.2, -2], [365, 240, 1.8, -4], [390, 265, 1.3, -1], [320, 225, 1.1, -5.5], [378, 215, 1.5, -3], [350, 285, 1.2, -6]].forEach(function (p) { kesl(el("circle", { "class": "e-por", cx: p[0], cy: p[1], r: p[2] }, por), p[3]); });
  /* 7 ablak: pislákoló csillagok, sodródó felhő */
  var cg = q('g[fill="#fff6d8"][opacity="0.9"]');
  if (cg) Array.prototype.slice.call(cg.children).forEach(function (c, i) { kesl(cls(c, "e-csillag"), -i * 0.7); });
  burok([q('ellipse[cx="168"][cy="206"]'), q('circle[cx="160"][cy="204"]'), q('circle[cx="176"][cy="203"]')], "e-felho");
  /* 8 befőtt-csillag */
  burok([q('circle[cx="345"][cy="376"]'), q('polygon[points^="345,366"]')], "e-befott");
  /* 10 csillag-párna */
  burok([q('polygon[points^="122,372"]'), q('path[d^="M114 394"]'), q('circle[cx="112"][cy="399"]'), q('circle[cx="131"][cy="399"]')], "e-parna");
  /* 11 erdő a kijáraton túl */
  cls(q('#odu-t-osveny g[fill="#9fd48a"]'), "e-lomb"); cls(q('#odu-t-osveny g[fill="#7fc26a"]'), "e-lomb2");
  /* 9 katica a szivárvány-ágy ívén (a felhő-ágy MÖGÉ, hogy a felhő eltakarja az ív alját) */
  var katB = null, ivV = q('path[d^="M13 432"]');
  if (ivV) {
    var kat = utana(el("g", { "pointer-events": "none" }), ivV.parentNode);
    katB = el("g", {}, kat);
    el("ellipse", { cx: 0, cy: 0, rx: 4.2, ry: 3.4, fill: "#e8505b" }, katB);
    el("line", { x1: 0, y1: -3.4, x2: 0, y2: 3.4, stroke: "#7a2a30", "stroke-width": 0.8 }, katB);
    el("circle", { cx: 4, cy: 0, r: 1.9, fill: "#3b2f3a" }, katB);
    el("circle", { cx: -1.8, cy: -1.4, r: 0.8, fill: "#3b2f3a" }, katB); el("circle", { cx: -1.6, cy: 1.5, r: 0.8, fill: "#3b2f3a" }, katB); el("circle", { cx: 1.6, cy: -1.2, r: 0.7, fill: "#3b2f3a" }, katB);
  }
  /* 5 lepke (nappal) vagy szentjánosbogarak (este) */
  var lepke = null, lb = null, bogarak = [];
  if (!este) {
    lepke = elotte(el("g", { "pointer-events": "none" }), tint);
    lb = el("g", {}, lepke);
    var sb = el("g", { "class": "e-szarny" }, lb);
    el("path", { d: "M0 0 C-10 -14 -20 -10 -17 -2 C-15 3 -6 3 0 0 Z", fill: "#f6a5c0", stroke: "#d77ea3", "stroke-width": 0.8 }, sb);
    el("path", { d: "M0 0 C-8 4 -14 10 -9 13 C-5 14 -2 8 0 0 Z", fill: "#fce49a", stroke: "#d9b45a", "stroke-width": 0.8 }, sb);
    var sj = el("g", { "class": "e-szarny j" }, lb);
    el("path", { d: "M0 0 C10 -14 20 -10 17 -2 C15 3 6 3 0 0 Z", fill: "#f6a5c0", stroke: "#d77ea3", "stroke-width": 0.8 }, sj);
    el("path", { d: "M0 0 C8 4 14 10 9 13 C5 14 2 8 0 0 Z", fill: "#fce49a", stroke: "#d9b45a", "stroke-width": 0.8 }, sj);
    el("ellipse", { cx: 0, cy: 3, rx: 1.6, ry: 6, fill: "#6a4a8a" }, lb);
    el("path", { d: "M-.5 -2.5 Q-3 -8 -5 -9 M.5 -2.5 Q3 -8 5 -9", stroke: "#6a4a8a", "stroke-width": 0.8, fill: "none" }, lb);
  } else {
    for (var b = 0; b < 3; b++) {
      var bg = elotte(el("g", { "pointer-events": "none" }), tint);
      var gl = kesl(el("g", { "class": "e-bogar-feny" }, bg), -b * 0.8);
      el("circle", { r: 9, fill: "#fff3a0", opacity: 0.35 }, gl); el("circle", { r: 2.6, fill: "#fffbd0" }, gl);
      bogarak.push(bg);
    }
  }

  /* ════════ B · ÉLŐ POLC ════════ */
  var vit = q(".odu-vitrin");
  if (vit) {
    /* 12 borostyán-inda a felső vitrinpolcról */
    [[262, 253, -1], [390, 253, 1]].forEach(function (p, i) {
      var g = kesl(el("g", { "class": "e-inda", "pointer-events": "none" }, vit), -i * 2.2);
      el("path", { d: "M" + p[0] + " " + p[1] + " q" + (3 * p[2]) + " 10 0 20 q" + (-3 * p[2]) + " 9 1 18", stroke: "#6fae5e", "stroke-width": 1.6, fill: "none", "stroke-linecap": "round" }, g);
      [[0, 6], [1, 13], [0, 21], [1, 29], [0, 36]].forEach(function (l) { var x = p[0] + (l[0] ? 3 : -3) * p[2], y = p[1] + l[1]; el("path", { d: "M" + x + " " + y + " q" + (l[0] ? 5 : -5) * p[2] + " -3 " + (l[0] ? 7 : -7) * p[2] + " 1 q" + (l[0] ? -3 : 3) * p[2] + " 4 " + (l[0] ? -7 : 7) * p[2] + " -1 Z", fill: l[1] % 2 ? "#95d488" : "#7fc26a" }, g); });
    });
    /* 16 üres kristályhelyek derengése + a meglévő kristályok egyenként felcsillannak */
    qa('.odu-vitrin ellipse[fill="#e6dcf2"]').forEach(function (x, i) { kesl(cls(x, "e-hely"), -i * 0.7); });
    qa(".odu-vitrin .odu-kristaly").forEach(function (x, i) { kesl(cls(x, "e-kristaly"), i * 1.3); });
    /* 17 csiga az alsó polcon */
    var cs = el("g", { "class": "e-csiga", "pointer-events": "none" }, vit);
    el("path", { d: "M266 303.5 q9 -2 18 0 l3 -3 q-1 4 -3 3.5 Z", fill: "#f3d9b0", stroke: "#c9a06a", "stroke-width": 0.8 }, cs);
    el("circle", { cx: 273, cy: 297.5, r: 5.2, fill: "#f6a5c0", stroke: "#d77ea3", "stroke-width": 1 }, cs);
    el("path", { d: "M273 297.5 m-2.6 0 a2.6 2.6 0 1 1 2.6 2.6", fill: "none", stroke: "#d77ea3", "stroke-width": 1 }, cs);
    var szv = el("g", { "class": "e-csiga-szarv" }, cs);
    el("path", { d: "M284 301 l1.5 -6 M286 301 l3 -5", stroke: "#c9a06a", "stroke-width": 0.9, "stroke-linecap": "round" }, szv);
    /* 16 fény suhan át a polcokon */
    [246, 304].forEach(function (y, i) { kesl(el("rect", { "class": "e-suhan", x: 258, y: y, width: 8, height: 4, rx: 2, fill: "#ffffff" }, vit), -i * 4); });
  }
  /* 13 varázs-üvegcsék a gyökérpolcon: derengő tartalom + buborékok; mellettük a makk időnként megbillen */
  var u1 = q('rect[x="500"][y="279"]'), u2 = q('rect[x="532"][y="279"]');
  cls(u1, "e-uveg"); kesl(cls(u2, "e-uveg"), -1.6);
  if (u2) {
    var bub = utana(el("g", { "pointer-events": "none", fill: "#ffffff" }), u2);
    [[505, 291, 1.3, 0], [511, 292, 1, -0.9], [514, 290, 1.1, -1.8], [537, 291, 1.2, -0.4], [543, 292, 1, -1.3], [546, 290, 1.1, -2.1]].forEach(function (p) { kesl(el("circle", { "class": "e-bub", cx: p[0], cy: p[1], r: p[2] }, bub), p[3]); });
  }
  burok([q('ellipse[cx="470"][cy="286"]'), q('path[d^="M462 283"]'), q('line[x1="470"][y1="275"]')], "e-makk");
  /* 14 mesekönyv: fellebbenő lap + kiszálló csillám */
  var konyv = q("#odu-t-gyujt");
  if (konyv) {
    el("path", { "class": "e-lap", d: "M440 252 Q452 262 450 274 Q452 286 440 294 Z", fill: "#fffaf0", stroke: "#e6d8c0", "stroke-width": 1 }, konyv);
    [[428, 246, "-8px", 0], [436, 246, "6px", -0.25]].forEach(function (p) {
      var s = el("path", { "class": "e-konyv-sz", d: "M" + p[0] + " " + (p[1] - 5) + " l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4 Z", fill: "#ffe07a" }, konyv);
      s.style.setProperty("--dx", p[2]); kesl(s, p[3]);
    });
  }
  /* 15 gyökérhajtás a bal tartón */
  var tarto = q('path[d^="M410 308"]');
  if (tarto) {
    var h = utana(el("g", { "class": "e-hajtas", "pointer-events": "none" }), tarto);
    el("path", { d: "M414 334 Q408 326 410 318", stroke: "#7fb872", "stroke-width": 1.8, fill: "none", "stroke-linecap": "round" }, h);
    el("path", { d: "M410 320 Q401 314 400 320 Q404 325 410 320 Z", fill: "#95d488" }, h);
    el("path", { d: "M410 318 Q416 309 420 314 Q417 320 410 318 Z", fill: "#7fc26a" }, h);
  }

  bogarak = bogarak.concat(oduVillany(svg, este, bogarak));
  oduEletUt(lepke, lb, bogarak, katB);
}

/* ═══════════════ VILLANYOLTÁS (2026-09-28, rajzterv: Matekos/odu-villanyoltas-rajzterv.html) ═══════════════
   A csillaglámpára (vagy a húzózsinórra) koppintva lekapcsol a villany: a lámpa pislan és kialszik, mély-lila
   félhomály ereszkedik (SOHA nem teljes sötét, a fényforrások körül „lyukas”), a kályha melegen lobog, holdfény
   esik az ablakból, a falon világító matrica-csillagok derengenek, a jobb falon egy unikornisfej-csillagkép
   rajzolódik ki, az unikornis szarva éjjeli lámpaként világít, szentjánosbogarak jönnek elő, a befőtt / üvegcsék /
   mesekönyv / kijárat derengenek. Még egy koppintás: vissza a fény.
   Producer döntései (2026-09-28): mind a 9 elem, közepes sötétség, van húzózsinór, a csillagkép mindig unikornis,
   az unikornisnak most csak a szarva világít, jelvény nincs, NEM mentődik — az odú mindig világosan nyílik
   (az oduNyit nullázza), csak az ablakméret-váltás / vásárlás miatti újrarajzolás őrzi meg. Nappal ×0,6 sötétség.
   Kímélő módban (kevesebb mozgás) nincs pislogás és rajzolódás, csak átvált. Semmibe nem kerül, semmit nem ad. */
var ODU_SOTET = false;                       /* be van-e oltva a villany (csak az odú e látogatására) */
var ODU_SOTET_FOK = 0.52;                    /* „közepes” sötétség */
var _oduVillany = null;                      /* az aktuális szoba villany-rétege: { svg, zs, szarvHely } */
function oduVillany(svg, este, regiBogarak) {
  var NS = "http://www.w3.org/2000/svg";
  function q(s) { return svg.querySelector(s); }
  function el(tag, at, par) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; }
  function cls(n, c) { if (n) n.setAttribute("class", ((n.getAttribute("class") || "") + " " + c).trim()); return n; }
  function csillagD(cx, cy, r) {
    var d = "";
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1) + " "; }
    return d + "Z";
  }
  function rad(defs, id, stops) { var g = el("radialGradient", { id: id }, defs); stops.forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] }, g); }); }

  _oduVillany = null;
  var defs = q("defs"), celok = q(".odu-celok"), lampa = q(".e-lampa"), lcs = q('polygon[points^="345,154"]');
  if (!defs || !celok || !lampa || !lcs) return [];
  var vb = svg.viewBox.baseVal, VB = { x: vb.x - 40, y: vb.y - 40, w: vb.width + 80, h: vb.height + 80 };

  rad(defs, "vo-lyuk", [[0, "#000", 1], [0.55, "#000", 0.7], [1, "#000", 0]]);
  rad(defs, "vo-szarv-g", [[0, "#fff3b0", 0.9], [0.5, "#ffe07a", 0.35], [1, "#ffe07a", 0]]);
  rad(defs, "vo-glo", [[0, "#f3ffb8", 0.9], [0.5, "#dfff9a", 0.3], [1, "#dfff9a", 0]]);
  rad(defs, "vo-arany", [[0, "#fff0bf", 0.9], [0.55, "#fff0bf", 0.35], [1, "#fff0bf", 0]]);
  rad(defs, "vo-zold", [[0, "#d8f5b8", 0.8], [0.55, "#d8f5b8", 0.3], [1, "#d8f5b8", 0]]);
  var savSzin = este ? "#cfdcff" : "#fff3c0";            /* este holdfény, nappal meleg napfény-sáv */
  var hs = el("linearGradient", { id: "vo-sav", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": savSzin, "stop-opacity": 0.42 }, hs);
  el("stop", { offset: 1, "stop-color": savSzin, "stop-opacity": 0 }, hs);
  /* 2 a fátyol maszkja: a fényforrások körül lyuk (kályha, ablak, befőtt, kijárat, szarv) */
  var maszk = el("mask", { id: "vo-maszk", maskUnits: "userSpaceOnUse", x: VB.x, y: VB.y, width: VB.w, height: VB.h }, defs);
  el("rect", { x: VB.x, y: VB.y, width: VB.w, height: VB.h, fill: "#fff" }, maszk);
  var lyukak = {};
  [["tuz", 548, 425, 165, 130], ["ablak", 190, 180, 95, 95], ["befott", 460, 378, 60, 55], ["kijarat", -40, 392, 75, 85], ["szarv", -999, -999, 75, 75]].forEach(function (l) {
    lyukak[l[0]] = el("ellipse", { cx: l[1], cy: l[2], rx: l[3], ry: l[4], fill: "url(#vo-lyuk)" }, maszk);
  });

  /* 1 lámpa + gyöngyös húzózsinór (a lámpa csoportjában, hogy együtt himbálózzon) */
  cls(lcs, "vo-lampacs");
  var zs = el("g", { "class": "vo-zsinor" });
  lampa.insertBefore(zs, lcs);
  el("line", { x1: 356, y1: 184, x2: 356, y2: 222, stroke: "#8f7ab8", "stroke-width": 1.6 }, zs);
  [192, 200, 208, 216].forEach(function (y) { el("circle", { cx: 356, cy: y, r: 1.8, fill: "#f7b8d0" }, zs); });
  el("path", { d: csillagD(356, 228, 6.5), fill: "#ffe07a", stroke: "#c9a06a", "stroke-width": 1 }, zs);

  /* a villanyoltás rétege: a bolt-stand fölé, a koppintó mezők és feliratok alá */
  var reteg = el("g", { "class": "vo-reteg", "pointer-events": "none" });
  celok.parentNode.insertBefore(reteg, celok);
  el("rect", { "class": "vo-fatyol", x: VB.x, y: VB.y, width: VB.w, height: VB.h, fill: "#1a1642", mask: "url(#vo-maszk)" }, reteg);
  el("ellipse", { "class": "vo-meleg", cx: 548, cy: 430, rx: 150, ry: 115, fill: "url(#e-f-tuz)" }, reteg);   /* 3 kályhatűz */
  el("polygon", { "class": "vo-hold", points: "150,200 232,200 330,520 60,520", fill: "url(#vo-sav)" }, reteg);   /* 4 holdfény */
  /* 9 derengő tárgyak: befőtt, két üvegcse, mesekönyv, kijárat */
  var der = el("g", { "class": "vo-dereng" }, reteg);
  [[460, 376, 26, "vo-arany", 0], [509, 286, 16, "vo-zold", -0.8], [541, 286, 16, "vo-arany", -1.6], [428.5, 266, 14, "vo-arany", -2.2], [-40, 392, 58, "vo-zold", -1]].forEach(function (p) {
    el("circle", { "class": "pis", cx: p[0], cy: p[1], r: p[2], fill: "url(#" + p[3] + ")" }, der).style.animationDelay = p[4] + "s";
  });
  /* 7 szarv-fény — a helyét a szarv valódi helyéből számoljuk (követi a sétát) */
  var szarv = cls(q('#odu-uni-mozgo path[d="M268 92 L285 84 L306 24 Z"]'), "vo-szarvpath");
  var szarvFeny = el("circle", { "class": "vo-szarvfeny", cx: -999, cy: -999, r: 46, fill: "url(#vo-szarv-g)" }, reteg);
  /* 5 matrica-csillagok + 6 unikornisfej-csillagkép a jobb falon */
  function matrica(x, y, r, osztaly, kesl) {
    var g = el("g", { "class": "vo-matrica " + osztaly }, reteg);
    var p = el("g", { "class": "pis" }, g); p.style.animationDelay = kesl + "s";
    el("circle", { "class": "glo", cx: x, cy: y, r: r * 2.6, fill: "url(#vo-glo)" }, p);
    el("path", { "class": "mag", d: csillagD(x, y, r) }, p);
  }
  [[-60, 200, 6], [-10, 165, 5], [40, 215, 4.5], [80, 150, 5.5], [-70, 265, 4], [420, 101, 4], [600, 150, 5], [592, 222, 4], [752, 252, 4.5], [95, 280, 3.5]].forEach(function (s, i) { matrica(s[0], s[1], s[2], "szort", -i * 0.6); });
  var K = { A: [640, 190], B: [672, 228], C: [700, 214], D: [712, 240], E: [730, 300], F: [690, 312], G: [668, 272], H: [628, 262], I: [652, 240] };
  var kep = el("g", { "class": "vo-kep", stroke: "#f3ffb8", "stroke-width": 1.4, "stroke-linecap": "round" }, reteg);
  [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "F"], ["F", "G"], ["G", "H"], ["H", "I"], ["I", "B"]].forEach(function (v, i) {
    el("line", { x1: K[v[0]][0], y1: K[v[0]][1], x2: K[v[1]][0], y2: K[v[1]][1], pathLength: 1 }, kep).style.transitionDelay = (1.4 + i * 0.2) + "s";
  });
  Object.keys(K).forEach(function (k, i) { matrica(K[k][0], K[k][1], k === "A" ? 6.5 : 4.8, "kepi", -i * 0.45); });
  el("path", { "class": "vo-kep-szem", d: csillagD(666, 250, 4.2), fill: "#fff6d8" }, reteg);
  /* 8 szentjánosbogarak: este a meglévő három a fátyol fölé költözik és fényesebb lesz, plusz három új
     (nappal csak ez a három, és csak sötétben látszik); az útjukat az oduEletUt rAF-je számolja */
  (regiBogarak || []).forEach(function (g) { cls(g, "vo-bogar"); reteg.appendChild(g); });
  var ujak = [];
  for (var b = 0; b < 3; b++) {
    var bg = el("g", { "class": "vo-bogar vo-extra", "pointer-events": "none" }, reteg);
    var gl = el("g", { "class": "e-bogar-feny" }, bg); gl.style.animationDelay = (-b * 0.7 - 0.3) + "s";
    el("circle", { r: 9, fill: "#fff3a0", opacity: 0.35 }, gl); el("circle", { r: 2.6, fill: "#fffbd0" }, gl);
    ujak.push(bg);
  }

  function szarvHely() {
    if (!szarv || !svg.getScreenCTM() || !szarv.getScreenCTM()) return;
    var m = svg.getScreenCTM().inverse().multiply(szarv.getScreenCTM());
    var p = svg.createSVGPoint(); p.x = 290; p.y = 56; p = p.matrixTransform(m);
    szarvFeny.setAttribute("cx", p.x.toFixed(1)); szarvFeny.setAttribute("cy", p.y.toFixed(1));
    lyukak.szarv.setAttribute("cx", p.x.toFixed(1)); lyukak.szarv.setAttribute("cy", p.y.toFixed(1));
  }
  if (!este) svg.classList.add("vo-nappal");
  svg.style.setProperty("--sot", (ODU_SOTET_FOK * (este ? 1 : 0.6)).toFixed(2));
  _oduVillany = { svg: svg, zs: zs, szarvHely: szarvHely };
  szarvHely();
  if (ODU_SOTET) {                              /* újrarajzolás (ablakméret, vásárlás) sötétben: azonnal sötét, animáció nélkül */
    svg.classList.add("vo-azonnal", "lampa-ki", "soteg", "kep-be");
    void svg.getBoundingClientRect();
    setTimeout(function () { svg.classList.remove("vo-azonnal"); }, 50);
  }
  return ujak;
}
/* koppintás a lámpára: le- vagy felkapcsol */
var _oduVillanyIdo = [];
function oduVillanyKapcsol() {
  var v = _oduVillany; if (!v || !document.body.contains(v.svg)) return;
  var svg = v.svg, nyugi = nyugiMod();
  _oduVillanyIdo.forEach(clearTimeout); _oduVillanyIdo = []; svg.classList.remove("felvillan");
  function kesobb(fn, ms) { _oduVillanyIdo.push(setTimeout(fn, ms)); }
  v.zs.classList.remove("huz"); void v.zs.getBoundingClientRect(); v.zs.classList.add("huz");
  beep(1900, 0.035, "square", 0, 0.035);        /* kattanás */
  v.szarvHely();
  ODU_SOTET = !ODU_SOTET;
  if (ODU_SOTET) {
    [784, 587, 440].forEach(function (f, i) { beep(f, 0.7, "sine", 0.12 + i * 0.17, 0.12); });   /* lefelé csilingel */
    if (nyugi) { svg.classList.add("lampa-ki", "soteg", "kep-be"); return; }
    svg.classList.add("lampa-ki");                /* a lámpa pislan, aztán kialszik */
    kesobb(function () { svg.classList.remove("lampa-ki"); }, 90);
    kesobb(function () { svg.classList.add("lampa-ki"); }, 190);
    kesobb(function () { svg.classList.add("soteg"); }, 280);
    kesobb(function () { svg.classList.add("kep-be"); }, 300);
  } else {
    [523, 784].forEach(function (f, i) { beep(f, 0.7, "sine", 0.12 + i * 0.17, 0.12); });         /* felfelé csilingel */
    svg.classList.remove("lampa-ki", "soteg", "kep-be");
    if (nyugi) return;
    svg.classList.add("felvillan");
    kesobb(function () { svg.classList.remove("felvillan"); }, 450);
  }
}

/* a lepke útja pontról pontra hajlított ívben, leszállásokkal (szivárvány, mesekönyv, zászló, felhő-ágy, kályha,
   kertkapu); a szentjánosbogarak lassan kóborolnak; a katica végigmászik az ágy ívén és visszafordul.
   Csak amíg az odú látszik — utána a rAF leáll (a következő renderOdu újraindítja). */
function oduEletUt(lepke, lb, bogarak, katB) {
  var nyugi = nyugiMod();
  var megallok = [[110, 326], [430, 246], [380, 142], [172, 374], [530, 346], [326, 338]];
  var poz = [240, 300], cel = 0, ul = true, ulIg = 0, repIg = 0, honnan = poz.slice(), kontroll = [0, 0], ido = 3200;
  function ujCel(most) {
    honnan = poz.slice();
    cel = (cel + 1 + Math.floor(Math.random() * (megallok.length - 1))) % megallok.length;
    var c = megallok[cel];
    kontroll = [(honnan[0] + c[0]) / 2 + (Math.random() - 0.5) * 220, Math.min(honnan[1], c[1]) - 60 - Math.random() * 80];
    ido = 2600 + Math.random() * 1800; repIg = most + ido; ul = false;
    if (lepke) lepke.classList.remove("ul");
  }
  if (nyugi) {                                /* kevesebb mozgás: a lepke a kapun ül, a többiek is egy helyben */
    if (lepke) { lepke.classList.add("ul"); lepke.setAttribute("transform", "translate(326,338)"); }
    bogarak.forEach(function (g, i) { g.setAttribute("transform", "translate(" + (80 + i * 120) + "," + (250 + (i % 2) * 40) + ")"); });
    if (katB) katB.setAttribute("transform", "translate(110,329) rotate(0)");
    return;
  }
  ujCel(performance.now());
  var szarvIdo = 0;
  function lep(most) {
    var k0 = $("kepernyo-odu");
    if (!k0 || !k0.classList.contains("aktiv") || !document.body.contains(lepke || bogarak[0] || katB)) { _oduEletRaf = null; return; }
    var t = most / 1000;
    if (lepke) {
      if (ul) { if (most > ulIg) ujCel(most); }
      else {
        var k = 1 - (repIg - most) / ido;
        if (k >= 1) { k = 1; ul = true; ulIg = most + 2000 + Math.random() * 2000; lepke.classList.add("ul"); }
        var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, c = megallok[cel];
        var x = (1 - e) * (1 - e) * honnan[0] + 2 * (1 - e) * e * kontroll[0] + e * e * c[0];
        var y = (1 - e) * (1 - e) * honnan[1] + 2 * (1 - e) * e * kontroll[1] + e * e * c[1] + (ul ? 0 : Math.sin(t * 9) * 4);
        var irany = c[0] < honnan[0] ? -1 : 1; poz = [x, y];
        lepke.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")");
        lb.setAttribute("transform", "rotate(" + (ul ? 0 : irany * 14) + ")");
      }
    }
    bogarak.forEach(function (g, i) {
      var bx = 330 + Math.sin(t * 0.23 + i * 2.1) * 230 + Math.sin(t * 0.61 + i) * 40, by = 280 + Math.sin(t * 0.31 + i * 1.3) * 90 + Math.cos(t * 0.83 + i) * 18;
      g.setAttribute("transform", "translate(" + bx.toFixed(1) + "," + by.toFixed(1) + ")");
    });
    if (katB) {
      var sz = Math.sin(t * 0.09), a = (90 - sz * 52) * Math.PI / 180, ir = Math.cos(t * 0.09) >= 0 ? 1 : -1;
      var kx = 110 + 103 * Math.cos(a), ky = 432 - 103 * Math.sin(a);
      katB.setAttribute("transform", "translate(" + kx.toFixed(1) + "," + ky.toFixed(1) + ") rotate(" + (90 - a * 57.3).toFixed(1) + ") scale(" + ir + ",1)");
    }
    if (_oduVillany && most - szarvIdo > 120) { _oduVillany.szarvHely(); szarvIdo = most; }   /* a szarv-fény követi az unikornist */
    _oduEletRaf = requestAnimationFrame(lep);
  }
  _oduEletRaf = requestAnimationFrame(lep);
}

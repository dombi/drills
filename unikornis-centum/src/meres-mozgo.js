/* ============ 6c) MÉRÉS-MOZGÓKÉPEK — a rajzterv 1. köréből (Matekos\meres-palyacsoport-rajzterv.html, jóváhagyva 2026-09-26) ============
   Négy szemléltető mozgókép egy 800×420-as színpadon, a gyerek saját unikornisával:
     🧪 bájital   10 decis pohár beömlik az 1 literes üvegbe (1 l = 10 dl)
     🧵 szabó     10 × 1 cm → 1 dm pálca; 10 pálca → 1 m mérőszalag (csak a szükséges fele fut)
     🧁 pékség    kétkarú mérleg: 1 kg ↔ 10 × 10 dkg, a tizediknél kiegyenesedik
     🪜 lépcső    mértékegység-lépcső: minden lépés × 10 (a nagy váltószámokhoz), a köztes fokok halványak
   + a „csoportos” változat rossz válasz után (pl. 3 l = 30 dl: három üveg, tízesével számolva).
   Mikor jön (rendszerterv 6.): az átváltás-feladatnál egy egységpár ELSŐ előfordulásakor a pályakörben (bemutató),
   és RÁ válasz után az adott feladat számaival; utána a gyerek ugyanarra a kérdésre újra felel.
   Koppintásra a végére ugrik; a végén magától továbbmegy (kézmentes módban is). Alap tempó: lassú (×1,7). */
var MK_NS = "http://www.w3.org/2000/svg", MK_TEMPO = 1.7;
function mkAttr(e, o) { for (var k in o) e.setAttribute(k, o[k]); return e; }
function mkLerp(a, b, p) { return a + (b - a) * p; }
function mkEaseIO(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
function mkEaseOut(p) { return 1 - Math.pow(1 - p, 3); }
function mkEaseBack(p) { var c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
function mkLin(p) { return p; }
function mkQ(r, s) { return r.querySelector(s); }
function mkQQ(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
function mkRnd(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

/* ── lejátszó-motor: tw(ctx, ms, fn, ease) → Promise; ctx.skip = azonnal a végállapot ── */
function mkTw(ctx, ms, fn, ease) {
  ease = ease || mkEaseIO;
  return new Promise(function (res, rej) {
    if (!ctx.el()) return rej("stop");
    if (ctx.skip || ms <= 0) { fn(1); return res(); }
    var d = ms * ctx.lassu, t0 = performance.now();
    (function f(now) {
      if (!ctx.el()) return rej("stop");
      if (ctx.skip) { fn(1); return res(); }
      var p = Math.min(1, (now - t0) / d); fn(ease(p));
      if (p < 1) requestAnimationFrame(f); else res();
    })(t0);
  });
}
function mkVar(ctx, ms) { return mkTw(ctx, ms, function () {}); }
function mkMond(ctx, szoveg, mindig) { if (!ctx.el() || (ctx.skip && !mindig)) return; mondd(szoveg); }
function mkCsillag(g, x, y, r, szin) {
  var p = document.createElementNS(MK_NS, "path");
  mkAttr(p, { d: "M0 " + (-r) + " L" + r * .28 + " " + (-r * .28) + " L" + r + " 0 L" + r * .28 + " " + r * .28 + " L0 " + r + " L" + (-r * .28) + " " + r * .28 + " L" + (-r) + " 0 L" + (-r * .28) + " " + (-r * .28) + "Z", fill: szin, transform: "translate(" + x + "," + y + ")" });
  g.appendChild(p); return p;
}
function mkSzikra(ctx, svg, x, y, n, szinek) {
  var g = mkQ(svg, ".fx");
  for (var i = 0; i < n; i++) (function (i) {
    var a = i / n * Math.PI * 2 + Math.random() * .5, d = 26 + Math.random() * 34;
    var s = mkCsillag(g, x, y, 5 + Math.random() * 5, szinek[i % szinek.length]);
    mkTw(ctx, 650, function (p) { mkAttr(s, { transform: "translate(" + (x + Math.cos(a) * d * p) + "," + (y + Math.sin(a) * d * p) + ") scale(" + (1 - p * .6) + ")", opacity: 1 - p }); }, mkEaseOut)
      .then(function () { s.remove(); }, function () { s.remove(); });
  })(i);
}
/* a szarv hegye a lábponthoz képest (a rajzterv SZARV-ja, unikornisSVG belső 0,5-ös méretezésével) */
function mkSzarvVarazs(ctx, svg, u) {
  var x = u.x + 116 * u.s * .5 * (u.tukor ? -1 : 1), y = u.y - 248 * u.s * .5;
  var g = mkQ(svg, ".fx"), c = document.createElementNS(MK_NS, "circle");
  mkAttr(c, { cx: x, cy: y, r: 4, fill: "#fff6b0", opacity: .95 }); g.appendChild(c);
  mkTw(ctx, 380, function (p) { mkAttr(c, { r: 4 + p * 16, opacity: .95 * (1 - p) }); }, mkEaseOut).then(function () { c.remove(); }, function () { c.remove(); });
  mkSzikra(ctx, svg, x, y, 4, ["#ffe27a", "#ffffff", "#f6a5c0"]);
}
function mkUgrik(ctx, svg, magas) {
  var g = mkQ(svg, ".mk-ugras");
  return mkTw(ctx, 260, function (p) { mkAttr(g, { transform: "translate(0," + (-magas * Math.sin(Math.PI * p)) + ")" }); }, mkLin);
}
/* a gyerek saját unikornisa (lábpont x,y; s = a unikornisSVG mérete) */
function mkUni(x, y, s, tukor) {
  var c = LENYEK[mentes.leny] || LENYEK[Object.keys(LENYEK)[0]];
  return '<g transform="translate(' + x + ',' + y + ')' + (tukor ? ' scale(-1,1)' : '') + '"><g class="mk-ugras">' + unikornisSVG("mk-uni", c, s, P().oltozet) + '</g></g>';
}

/* ── közös műhely-belső (800×420) + pult + beszédbuborék ── */
function mkBelso(tipus) {
  var T = {
    szabo:   { fal1: "#fdeef4", fal2: "#f6e0ea", csik: "rgba(236,180,206,.28)", padlo: "#ead0b8", padlo2: "#dcbc9c" },
    bajital: { fal1: "#eee8f8", fal2: "#e2eef2", csik: "rgba(170,150,210,.18)", padlo: "#d6cfe4", padlo2: "#c5bcd8" },
    pekseg:  { fal1: "#fff4de", fal2: "#fbe6c4", csik: "rgba(230,180,110,.16)", padlo: "#efc9a3", padlo2: "#e2b58a" },
    lepcso:  { fal1: "#eef3fd", fal2: "#f3ecfb", csik: "rgba(180,170,230,.14)", padlo: "#dfe8d0", padlo2: "#cfdcbd" }
  }[tipus];
  var cs = ""; for (var x = 20; x < 800; x += 44) cs += '<rect x="' + x + '" y="0" width="5" height="360" fill="' + T.csik + '"/>';
  return '<defs><linearGradient id="mk-fal-' + tipus + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + T.fal1 + '"/><stop offset="1" stop-color="' + T.fal2 + '"/></linearGradient></defs>' +
    '<rect width="800" height="420" fill="url(#mk-fal-' + tipus + ')"/>' + cs +
    '<rect y="360" width="800" height="60" fill="' + T.padlo + '"/><rect y="360" width="800" height="5" fill="' + T.padlo2 + '"/>';
}
function mkPult(x1, x2, y) {
  return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${404 - y}" fill="#ecd3b4"/>
    <rect x="${x1 + 14}" y="${y + 24}" width="${(x2 - x1) / 2 - 22}" height="${380 - y - 24}" rx="8" fill="none" stroke="#d9b98f" stroke-width="3"/>
    <rect x="${(x1 + x2) / 2 + 8}" y="${y + 24}" width="${(x2 - x1) / 2 - 22}" height="${380 - y - 24}" rx="8" fill="none" stroke="#d9b98f" stroke-width="3"/>
    <rect x="${x1 - 8}" y="${y - 6}" width="${x2 - x1 + 16}" height="13" rx="5" fill="#c99b6d"/>`;
}
function mkBuborek(x, y, w) {
  return `<g class="bub" transform="translate(${x},${y})">
    <path d="M18 0 H${w - 18} Q${w} 0 ${w} 18 V46 Q${w} 64 ${w - 18} 64 H70 L52 84 L50 64 H18 Q0 64 0 46 V18 Q0 0 18 0Z" fill="#fff" stroke="#cbb6e6" stroke-width="3"/>
    <text class="bubtxt" x="${w / 2}" y="43" text-anchor="middle" font-family="Fredoka,Segoe UI,sans-serif" font-weight="700" font-size="27" fill="#4a3b7a"></text></g>`;
}
function mkBub(svg, t) { var b = mkQ(svg, ".bubtxt"); if (b) { b.textContent = t; b.setAttribute("font-size", t.length > 13 ? 22 : 27); } }
var MK_EGY = ["", "egy", "kettő", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc", "tíz"];

/* ═════════════════ 🧪 BÁJITALKONYHA ═════════════════ */
var MK_PALACK = "M676 76 L704 76 L704 118 Q740 128 740 158 L740 286 Q740 296 730 296 L650 296 Q640 296 640 286 L640 158 Q640 128 676 118 Z";
var MK_BAJ = "#c79bea", MK_BAJ2 = "#e6c9ff", MK_MEZ = "#f6c14a", MK_MEZ2 = "#ffe08a";
function mkPohar(i, x, y) {
  return `<g class="pohar" data-i="${i}" transform="translate(${x},${y})">
    <ellipse class="halo" cx="0" cy="-17" rx="24" ry="26" fill="#fff6b0" opacity="0"/>
    <g class="pl" transform="scale(1,1)"><path d="M-11 -25 L11 -25 L9 0 L-9 0Z" fill="${MK_BAJ}"/></g>
    <path d="M-12 -34 L12 -34 L9 0 L-9 0Z" fill="rgba(255,255,255,.35)" stroke="#7a6aa6" stroke-width="2.4" stroke-linejoin="round"/>
    <text x="0" y="-9" text-anchor="middle" font-size="8.5" font-weight="700" fill="#4a3b7a" font-family="Segoe UI,sans-serif">1 dl</text></g>`;
}
/* üveg (bájital) vagy mézes bödön (pékség); szeletek: 10 szelet a csoportos változathoz */
function mkPalack(dx, id, szeletek, cimke, szin, szin2) {
  var jel = "", k; for (k = 1; k <= 10; k++) jel += `<line x1="724" x2="736" y1="${294 - 16 * k}" y2="${294 - 16 * k}" stroke="#7a6aa6" stroke-width="${k === 10 ? 3 : 1.6}"/>`;
  var tolt = "";
  if (szeletek) for (k = 0; k < 10; k++) tolt += `<rect class="szelet" x="640" y="${278 - 16 * k}" width="100" height="16" fill="${szin}" stroke="${szin2}" stroke-width="1.5" opacity=".28"/>`;
  else tolt = `<rect class="szint" x="640" y="294" width="100" height="0" fill="${szin}"/><rect class="felszin" x="640" y="292" width="100" height="3" fill="${szin2}" opacity="0"/>`;
  return `<g transform="translate(${dx},0)"><clipPath id="${id}"><path d="${MK_PALACK}"/></clipPath>
    <ellipse class="palack-feny" cx="690" cy="200" rx="84" ry="120" fill="#fff4a8" opacity="0"/>
    <g clip-path="url(#${id})"><rect x="640" y="70" width="100" height="230" fill="rgba(230,240,255,.55)"/>${tolt}</g>
    <path d="${MK_PALACK}" fill="none" stroke="#7a6aa6" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="671" y="69" width="38" height="9" rx="3.5" fill="#fff" stroke="#7a6aa6" stroke-width="3"/>
    <path d="M652 160 Q650 220 656 270" stroke="#fff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>
    ${jel}<rect x="656" y="190" width="68" height="30" rx="8" fill="#fff" stroke="#cbb6e6" stroke-width="2"/>
    <text class="pcimke" x="690" y="212" text-anchor="middle" font-size="${cimke.length > 5 ? 15 : 18}" font-weight="800" fill="#4a3b7a" font-family="Fredoka,Segoe UI,sans-serif">${cimke}</text></g>`;
}
function mkBajitalHatter() {
  return mkBelso("bajital") + `
   <path d="M20 40 Q160 70 300 40 Q440 70 580 40 Q720 70 800 48" stroke="#a88a6a" stroke-width="2.5" fill="none"/>
   ${[80, 230, 380, 520, 670].map(function (x, i) { return `<g transform="translate(${x},${56 + (i % 2) * 6})"><path d="M0 0 L-9 24 L9 24Z" fill="${i % 2 ? '#9fcf8a' : '#b6d98f'}"/><path d="M-5 4 L-14 30 M5 4 L14 30" stroke="#7fae5f" stroke-width="3"/><rect x="-4" y="-3" width="8" height="6" fill="#c9a06a"/></g>`; }).join("")}
   ${mkPult(222, 792, 302)}`;
}
var MK_BAJITAL = {
  render: function () {
    var s = mkBajitalHatter() + mkUni(118, 402, 1.2) + mkBuborek(16, 22, 230) + mkPalack(0, "mk-pk0", false, "1 l", MK_BAJ, MK_BAJ2);
    for (var i = 0; i < 10; i++) s += mkPohar(i, 262 + i * 34, 296);
    return s + `<line class="folyam" x1="688" y1="62" x2="688" y2="62" stroke="${MK_BAJ}" stroke-width="6" stroke-linecap="round" opacity="0"/><g class="fx"></g>`;
  },
  play: async function (ctx, svg, fel) {
    var u = { x: 118, y: 402, s: 1.2 };
    var szint = mkQ(svg, ".szint"), felszin = mkQ(svg, ".felszin"), folyam = mkQ(svg, ".folyam"), poharak = mkQQ(svg, ".pohar");
    mkMond(ctx, "Hány deci fér egy literbe? Figyeld!");
    await mkVar(ctx, 700);
    for (let i = 0; i < 10; i++) {
      let g = poharak[i], x0 = 262 + i * 34, y0 = 296, halo = mkQ(g, ".halo"), pl = mkQ(g, ".pl");
      mkSzarvVarazs(ctx, svg, u); mkAttr(halo, { opacity: .7 });
      await mkTw(ctx, 240, function (p) {
        var x = mkLerp(x0, 678, p), y = mkLerp(y0, 60, p) - 70 * Math.sin(Math.PI * p), r = 115 * Math.max(0, (p - .55) / .45);
        mkAttr(g, { transform: "translate(" + x + "," + y + ") rotate(" + r + ",0,-17)" });
      });
      mkAttr(folyam, { opacity: 1 });
      let alja = 294 - i * 16;
      await mkTw(ctx, 170, function (p) {
        mkAttr(pl, { transform: "scale(1," + (1 - p) + ")" });
        var L = (i + p) * 16;
        mkAttr(szint, { y: 294 - L, height: L }); mkAttr(felszin, { y: 292 - L, opacity: 1 });
        mkAttr(folyam, { y2: alja - p * 16 });
      }, mkLin);
      mkAttr(folyam, { opacity: 0, y2: 62 });
      mkBub(svg, (i + 1) + " deci"); fel((i + 1) + " dl"); mkMond(ctx, MK_EGY[i + 1]);
      mkTw(ctx, 260, function (p) {
        var x = mkLerp(678, x0, p), y = mkLerp(60, y0, p) - 40 * Math.sin(Math.PI * p);
        mkAttr(g, { transform: "translate(" + x + "," + y + ") rotate(" + (115 * (1 - p)) + ",0,-17)", opacity: 1 - .55 * p });
        mkAttr(halo, { opacity: .7 * (1 - p) });
      }).catch(function () {});
      await mkVar(ctx, 40);
    }
    await mkVar(ctx, 300);
    mkBub(svg, "10 dl = 1 l"); fel("10 deciliter = 1 liter"); mkMond(ctx, "Tíz deciliter az egy liter!", true);
    mkSzikra(ctx, svg, 690, 150, 12, ["#ffe27a", "#f6a5c0", "#c79bea", "#fff"]);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    var fk = mkQ(svg, ".palack-feny");
    await mkTw(ctx, 1400, function (p) { mkAttr(fk, { opacity: .32 * Math.sin(Math.PI * p) }); }, mkLin);
  }
};

/* ═════════════════ 🧵 SZABÓMŰHELY ═════════════════ */
var MK_SZALAG_SZIN = ["#f6a5c0", "#a7d99a", "#c9a8e6", "#9ec9f0", "#f7c59f", "#fce49a", "#f59fb0", "#8fd3c7", "#b9a4f0", "#ffcf8a"];
function mkSzaboHatter() {
  var racs = "", x, y;
  for (x = 250; x < 780; x += 25) racs += `<line x1="${x}" x2="${x}" y1="136" y2="338" stroke="#c4e4cf" stroke-width="1"/>`;
  for (y = 150; y < 340; y += 25) racs += `<line x1="230" x2="782" y1="${y}" y2="${y}" stroke="#c4e4cf" stroke-width="1"/>`;
  return mkBelso("szabo") + `
    <path d="M10 26 Q200 60 400 26 Q600 60 790 26" stroke="#ffd96b" stroke-width="10" fill="none"/>
    <path d="M10 26 Q200 60 400 26 Q600 60 790 26" stroke="#c79a2a" stroke-width="6" stroke-dasharray="1.3 9" fill="none"/><circle cx="400" cy="24" r="4" fill="#b89070"/>
    ${mkPult(210, 792, 350)}
    <rect x="228" y="132" width="556" height="210" rx="16" fill="#dff3e5" stroke="#b6dcc2" stroke-width="3"/>${racs}`;
}
function mkVonalzo() {
  var t = ""; for (var k = 0; k <= 100; k++) { var x = 255 + k * 5, h = k % 10 === 0, fl = k % 5 === 0;
    t += `<line x1="${x}" x2="${x}" y1="262" y2="${262 + (h ? 14 : fl ? 9 : 5)}" stroke="#8a6a1e" stroke-width="${h ? 2 : 1}"/>`;
    if (h) t += `<text x="${x}" y="286" text-anchor="middle" font-size="10" font-weight="700" fill="#8a6a1e" font-family="Segoe UI,sans-serif">${k / 10}</text>`; }
  return `<g class="vonalzo"><rect x="245" y="260" width="520" height="30" rx="4" fill="#fff6d6" stroke="#d6b75c" stroke-width="2"/>${t}
    <text x="772" y="286" font-size="10" font-weight="700" fill="#8a6a1e" font-family="Segoe UI,sans-serif">cm</text></g>`;
}
function mkPalca(x, w, cimke, osztaly) {
  return `<g class="${osztaly}" transform="translate(${x},232)"><rect x="0" y="0" width="${w}" height="24" rx="${Math.min(6, w / 5)}" fill="#e2b07c" stroke="#b07a45" stroke-width="2"/>
    <path d="M4 8 H${w - 4} M8 16 H${w - 10}" stroke="#c98f55" stroke-width="1.2"/>
    ${cimke ? `<text x="${w / 2}" y="17" text-anchor="middle" font-size="${w > 100 ? 15 : 11}" font-weight="800" fill="#5a3a18" font-family="Fredoka,Segoe UI,sans-serif">${cimke}</text>` : ""}</g>`;
}
/* v: "egesz" (cm → dm → m) · "cm" (csak cm → dm) · "dm" (csak dm → m) */
var MK_SZABO = {
  render: function (v) {
    var s = mkSzaboHatter() + mkUni(112, 402, 1.2) + mkBuborek(16, 22, 230), i, j, k;
    s += `<g class="nagyito" opacity="0"><rect x="600" y="98" width="178" height="28" rx="14" fill="#fff" stroke="#cbb6e6" stroke-width="2"/><text class="nagyito-t" x="689" y="117" text-anchor="middle" font-size="13" font-weight="700" fill="#4a3b7a" font-family="Segoe UI,sans-serif">🔍 nagyítva</text></g>`;
    if (v !== "dm") {
      s += mkVonalzo();
      var r = mkRnd(7);
      for (i = 0; i < 10; i++) {
        var felso = i % 2 === 0, x = 290 + Math.floor(i / 2) * 104 + (felso ? 0 : 48) + (r() - .5) * 16, y = felso ? 170 + r() * 26 : 312 + r() * 10, rot = (r() - .5) * 60;
        s += `<g class="darab" data-x="${x}" data-y="${y}" data-r="${rot}" transform="translate(${x},${y}) rotate(${rot})">
          <rect x="-23" y="-12" width="46" height="24" rx="5" fill="${MK_SZALAG_SZIN[i]}"/><path d="M-19 -6 H19 M-19 6 H19" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 3" opacity=".9"/>
          <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="800" fill="#4a3b7a" font-family="Segoe UI,sans-serif">1 cm</text></g>`;
      }
      s += `<g class="nagy-palca" opacity="0">${mkPalca(255, 500, "1 dm", "np")}</g>`;
    }
    for (j = 0; j < 10; j++) s += `<g class="dmp" data-j="${j}" opacity="${v === "dm" && j === 0 ? 1 : 0}">${mkPalca(0, 48, "1 dm", "p")}</g>`;
    var jel = ""; for (k = 0; k <= 100; k++) { var xx = 255 + k * 5, dm = k % 10 === 0;
      jel += `<line x1="${xx}" x2="${xx}" y1="230" y2="${230 + (dm ? 12 : 6)}" stroke="#8a6a1e" stroke-width="${dm ? 2 : 1}"/>`;
      if (dm && k && k < 100) jel += `<text x="${xx}" y="254" text-anchor="middle" font-size="10" font-weight="700" fill="#8a6a1e" font-family="Segoe UI,sans-serif">${k / 10}</text>`; }
    s += `<clipPath id="mk-szalagClip"><rect class="szalag-vag" x="250" y="190" width="0" height="80"/></clipPath>
      <g class="meroszalag" clip-path="url(#mk-szalagClip)"><rect x="255" y="228" width="500" height="30" rx="3" fill="#ffd96b" stroke="#c79a2a" stroke-width="2"/>${jel}
      <rect x="712" y="200" width="42" height="24" rx="8" fill="#fff" stroke="#c79a2a" stroke-width="2"/><text x="733" y="217" text-anchor="middle" font-size="14" font-weight="800" fill="#4a3b7a" font-family="Fredoka,Segoe UI,sans-serif">1 m</text></g>
      <circle class="tekercs" cx="255" cy="243" r="0" fill="#ffd96b" stroke="#c79a2a" stroke-width="2"/>`;
    return s + `<g class="fx"></g>`;
  },
  play: async function (ctx, svg, fel, v) {
    var u = { x: 112, y: 402, s: 1.2 }, i, j;
    var dmp = mkQQ(svg, ".dmp"), nagyito = mkQ(svg, ".nagyito"), nt = mkQ(svg, ".nagyito-t");
    dmp.forEach(function (g, j) { mkAttr(g, { transform: "translate(" + (256 + j * 50) + ",0)" }); });
    if (v !== "dm") {
      mkAttr(nagyito, { opacity: 1 });
      mkMond(ctx, "Hány centi egy deci? Figyeld!");
      await mkVar(ctx, 600);
      var darabok = mkQQ(svg, ".darab");
      for (i = 0; i < 10; i++) {
        let g = darabok[i], x0 = +g.getAttribute("data-x"), y0 = +g.getAttribute("data-y"), r0 = +g.getAttribute("data-r"), x1 = 280 + i * 50, y1 = 244;
        mkSzarvVarazs(ctx, svg, u);
        await mkTw(ctx, 260, function (p) { mkAttr(g, { transform: "translate(" + mkLerp(x0, x1, p) + "," + (mkLerp(y0, y1, p) - 30 * Math.sin(Math.PI * p)) + ") rotate(" + (r0 * (1 - p)) + ")" }); });
        mkBub(svg, (i + 1) + " centi"); fel((i + 1) + " cm"); mkMond(ctx, MK_EGY[i + 1]);
        await mkVar(ctx, 80);
      }
      await mkVar(ctx, 250);
      var np = mkQ(svg, ".nagy-palca");
      await mkTw(ctx, 520, function (p) { darabok.forEach(function (d) { mkAttr(d, { opacity: 1 - p }); }); mkAttr(np, { opacity: p }); });
      mkBub(svg, "10 cm = 1 dm"); fel("10 centiméter = 1 deciméter"); mkMond(ctx, "Tíz centiméter az egy deciméter!", true);
      mkSzikra(ctx, svg, 505, 244, 10, ["#ffe27a", "#f6a5c0", "#a7d99a", "#fff"]);
      if (v === "cm") { await mkUgrik(ctx, svg, 14); await mkVar(ctx, 900); return; }
      await mkVar(ctx, 1200);
      nt.textContent = "🔍 kicsinyítünk…";
      var vz = mkQ(svg, ".vonalzo");
      await mkTw(ctx, 700, function (p) {
        mkAttr(np, { transform: "translate(" + mkLerp(0, 256 - 255 * .096, p) + ",0) translate(255,244) scale(" + mkLerp(1, .096, p) + ",1) translate(-255,-244)", opacity: 1 - p });
        mkAttr(vz, { opacity: 1 - p }); mkAttr(dmp[0], { opacity: p });
      });
      nt.textContent = "🔍 kicsinyítve";
    } else {
      mkAttr(nagyito, { opacity: 1 }); nt.textContent = "🔍 kicsinyítve";
      mkMond(ctx, "Hány deci egy méter? Figyeld!");
      await mkVar(ctx, 900);
    }
    mkBub(svg, "1 deci"); fel("1 dm");
    await mkVar(ctx, 350);
    for (j = 1; j < 10; j++) {
      let gg = dmp[j], xx1 = 256 + j * 50;
      mkSzarvVarazs(ctx, svg, u);
      await mkTw(ctx, 200, function (p) { mkAttr(gg, { transform: "translate(" + mkLerp(820, xx1, p) + "," + (-50 * Math.sin(Math.PI * p)) + ")", opacity: Math.min(1, p * 3) }); }, mkEaseOut);
      mkBub(svg, (j + 1) + " deci"); fel((j + 1) + " dm"); mkMond(ctx, MK_EGY[j + 1]);
      await mkVar(ctx, 60);
    }
    await mkVar(ctx, 300);
    var vag = mkQ(svg, ".szalag-vag"), tek = mkQ(svg, ".tekercs");
    await mkTw(ctx, 800, function (p) { mkAttr(vag, { width: 510 * p }); mkAttr(tek, { cx: 255 + 500 * p, r: 16 * (1 - p) + (p < 1 ? 4 : 0) });
      dmp.forEach(function (g) { g.setAttribute("opacity", 1 - p); }); });
    mkAttr(tek, { r: 0 });
    mkBub(svg, "10 dm = 1 m"); fel("10 deciméter = 1 méter"); mkMond(ctx, "Tíz deciméter az egy méter!", true);
    mkSzikra(ctx, svg, 505, 243, 12, ["#ffe27a", "#f6a5c0", "#a7d99a", "#fff"]);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    await mkVar(ctx, 900);
  }
};

/* ═════════════════ 🧁 MÉZES PÉKSÉG ═════════════════ */
var MK_MX = 530, MK_MY = 150, MK_KAR = 170, MK_LOG = 100;
function mkSulyDkg() {
  return `<ellipse cx="0" cy="-1" rx="12" ry="3.5" fill="#b8892c"/><rect x="-12" y="-24" width="24" height="23" fill="#e9b949"/>
    <ellipse cx="0" cy="-24" rx="12" ry="3.5" fill="#f6d47a" stroke="#b8892c" stroke-width="1.2"/><rect x="-3" y="-31" width="6" height="7" rx="2" fill="#d9a53c"/>
    <text x="0" y="-10" text-anchor="middle" font-size="13" font-weight="800" fill="#4a2e04" font-family="Fredoka,Segoe UI,sans-serif">10</text>
    <text x="0" y="-2.5" text-anchor="middle" font-size="7.5" font-weight="800" fill="#4a2e04" font-family="Fredoka,Segoe UI,sans-serif">dkg</text>`;
}
function mkSerpenyo(osztaly, belso) {
  var L = MK_LOG;
  return `<g class="${osztaly}"><line x1="0" y1="0" x2="-62" y2="${L - 4}" stroke="#9a7a4a" stroke-width="2"/><line x1="0" y1="0" x2="62" y2="${L - 4}" stroke="#9a7a4a" stroke-width="2"/>
    <line x1="0" y1="0" x2="0" y2="${L - 8}" stroke="#9a7a4a" stroke-width="1.5" opacity=".6"/>
    <path d="M-80 ${L - 4} Q0 ${L + 22} 80 ${L - 4}Z" fill="#e8c47a" stroke="#b88a3a" stroke-width="2.5"/>
    <ellipse cx="0" cy="${L - 4}" rx="80" ry="6" fill="#f3d99a" stroke="#b88a3a" stroke-width="2"/>
    <circle cx="0" cy="0" r="4" fill="#b88a3a"/><g class="rakomany">${belso || ""}</g></g>`;
}
var MK_SULY_M = 1.3;   /* a 10 dkg-os súlyok nagyítása (olvasható felirat, producer 2026-09-27) */
var MK_HELY = [-56, -28, 0, 28, 56].map(function (x) { return [x, MK_LOG - 6]; }).concat([-42, -14, 14, 42, 0].map(function (x, i) { return [x, i < 4 ? MK_LOG - 39 : MK_LOG - 72]; }));
function mkPeksegHatter() {
  return mkBelso("pekseg") + `
    <path d="M10 30 Q200 62 400 30 Q600 62 790 30" stroke="#b07a45" stroke-width="2.5" fill="none"/>
    ${[90, 200, 310, 490, 600, 710].map(function (x, i) { return `<g transform="translate(${x},${44 + Math.sin(i) * 4})">${i % 2 ? `<path d="M0 0 l4 9 l10 1 l-8 6 l3 10 l-9 -5 l-9 5 l3 -10 l-8 -6 l10 -1Z" fill="#d9965c" stroke="#fff" stroke-width="1.5"/>` : `<path d="M0 6 C-10 -4 -18 8 0 22 C18 8 10 -4 0 6Z" fill="#d9965c" stroke="#fff" stroke-width="1.5"/>`}</g>`; }).join("")}
    <rect x="218" y="106" width="332" height="9" rx="3" fill="#c99b6d"/><path d="M234 115 l0 14 l14 -14 M534 115 l0 14 l-14 -14" stroke="#b07a45" stroke-width="3" fill="none"/>
    ${mkPult(222, 792, 302)}`;
}
function mkMerleg() {
  var MX = MK_MX, MY = MK_MY, KAR = MK_KAR, L = MK_LOG;
  return `<g class="merleg">
    <path d="M${MX - 52} 296 L${MX + 52} 296 L${MX + 34} 272 L${MX - 34} 272Z" fill="#c99b6d" stroke="#a87a48" stroke-width="2"/>
    <rect x="${MX - 7}" y="${MY}" width="14" height="124" fill="#d9ad72" stroke="#a87a48" stroke-width="2"/>
    <path d="M${MX - 34} ${MY - 64} A40 40 0 0 1 ${MX + 34} ${MY - 64}" fill="none" stroke="#a87a48" stroke-width="3"/>
    <line x1="${MX}" y1="${MY - 104}" x2="${MX}" y2="${MY - 92}" stroke="#7a9a4a" stroke-width="4" stroke-linecap="round"/>
    <g class="gerenda"><rect x="${MX - KAR}" y="${MY - 5}" width="${KAR * 2}" height="10" rx="5" fill="#e0b476" stroke="#a87a48" stroke-width="2"/>
      <path d="M${MX - 4} ${MY} L${MX} ${MY - 92} L${MX + 4} ${MY}Z" fill="#6f5a8a"/></g>
    <circle cx="${MX}" cy="${MY}" r="8" fill="#a87a48"/>
    ${mkSerpenyo("bal-s", `<path d="M-26 ${L - 6} L26 ${L - 6} L18 ${L - 44} L-18 ${L - 44}Z" fill="#7d88a6" stroke="#5a6480" stroke-width="2"/><rect x="-7" y="${L - 54}" width="14" height="11" rx="5" fill="none" stroke="#5a6480" stroke-width="4"/><text x="0" y="${L - 18}" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" font-family="Fredoka,Segoe UI,sans-serif">1 kg</text>`)}
    ${mkSerpenyo("jobb-s", "")}</g>`;
}
function mkMerlegAll(svg, fok) {
  var r = fok * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  mkAttr(mkQ(svg, ".gerenda"), { transform: "rotate(" + (-fok) + "," + MK_MX + "," + MK_MY + ")" });
  mkAttr(mkQ(svg, ".bal-s"), { transform: "translate(" + (MK_MX - MK_KAR * c) + "," + (MK_MY + MK_KAR * s) + ")" });
  mkAttr(mkQ(svg, ".jobb-s"), { transform: "translate(" + (MK_MX + MK_KAR * c) + "," + (MK_MY - MK_KAR * s) + ")" });
}
var MK_PEKSEG = {
  render: function () {
    var s = mkPeksegHatter() + mkUni(118, 402, 1.2) + mkBuborek(16, 22, 230) + mkMerleg();
    for (var i = 0; i < 10; i++) s += `<g class="dkg" data-i="${i}" transform="translate(${240 + i * 30},106) scale(${MK_SULY_M})"><ellipse class="halo" cx="0" cy="-14" rx="18" ry="20" fill="#fff6b0" opacity="0"/>${mkSulyDkg()}</g>`;
    return s + `<g class="fx"></g>`;
  },
  init: function (svg) { mkMerlegAll(svg, 12); },
  play: async function (ctx, svg, fel) {
    var u = { x: 118, y: 402, s: 1.2 };
    mkMerlegAll(svg, 12);
    var sulyok = mkQQ(svg, ".dkg"), rak = mkQ(svg, ".jobb-s .rakomany");
    mkMond(ctx, "Hány deka kell egy kilóhoz? Figyeld!");
    await mkVar(ctx, 700);
    var fok = 12;
    for (var i = 0; i < 10; i++) {
      let g = sulyok[i], x0 = 240 + i * 30, y0 = 106, halo = mkQ(g, ".halo");
      let r = fok * Math.PI / 180, px = MK_MX + MK_KAR * Math.cos(r), py = MK_MY - MK_KAR * Math.sin(r);
      let hx = MK_HELY[i][0], hy = MK_HELY[i][1], x1 = px + hx, y1 = py + hy;
      mkSzarvVarazs(ctx, svg, u); mkAttr(halo, { opacity: .7 });
      await mkTw(ctx, 260, function (p) { mkAttr(g, { transform: "translate(" + mkLerp(x0, x1, p) + "," + (mkLerp(y0, y1, p) - 60 * Math.sin(Math.PI * p)) + ") scale(" + MK_SULY_M + ")" }); });
      mkAttr(halo, { opacity: 0 });
      rak.appendChild(g); mkAttr(g, { transform: "translate(" + hx + "," + hy + ") scale(" + MK_SULY_M + ")" });
      let uj = 12 * (1 - (i + 1) / 10), regi = fok;
      mkBub(svg, ((i + 1) * 10) + " deka"); fel(((i + 1) * 10) + " dkg"); mkMond(ctx, mSzamSzo((i + 1) * 10));
      await mkTw(ctx, 240, function (p) { fok = mkLerp(regi, uj, p); mkMerlegAll(svg, fok); }, mkEaseBack);
      fok = uj;
      await mkVar(ctx, 30);
    }
    mkMerlegAll(svg, 0);
    await mkVar(ctx, 250);
    mkBub(svg, "100 dkg = 1 kg"); fel("100 dekagramm = 1 kilogramm"); mkMond(ctx, "Száz dekagramm az egy kilogramm!", true);
    mkSzikra(ctx, svg, MK_MX, MK_MY - 96, 12, ["#ffe27a", "#f6a5c0", "#f7c59f", "#fff"]);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    await mkVar(ctx, 900);
  }
};

/* ═════════════════ 🪜 MÉRTÉKEGYSÉG-LÉPCSŐ ═════════════════
   A köztes fokok (hm, dam, dal, hg, és a q–kg közti 10 kg) csak itt, halványan, szaggatottan — feladat SOHA. */
var MK_FOKOK = { hossz: ["km", "hm", "dam", "m", "dm", "cm", "mm"], ur: ["hl", "dal", "l", "dl", "cl", "ml"], tomeg: ["t", "q", "", "kg", "hg", "dkg", "g"] };
var MK_SZELLEM = { hm: 1, dam: 1, dal: 1, hg: 1, "": 1 };
var MK_SZELLEM_NEV = { hm: "hektométer", dam: "dekaméter", dal: "dekaliter", hg: "hektogramm" };
var MK_FOK_SZIN = ["#f6a5c0", "#f7c59f", "#fce49a", "#a7d99a", "#9ec9f0", "#c9a8e6", "#f59fb0"];
function mkLepcsoGeo(n) { var W = Math.min(104, 700 / n), H = 36, x0 = (800 - n * W) / 2; return { W: W, H: H, x0: x0, top: function (i) { return 150 + i * H; }, kozep: function (i) { return x0 + i * W + W / 2; } }; }
/* o: { menny, from (egység), to (egység), szam } */
var MK_LEPCSO = {
  render: function (o) {
    var F = MK_FOKOK[o.menny], n = F.length, G = mkLepcsoGeo(n), from = F.indexOf(o.from), to = F.indexOf(o.to), le = to > from, s = mkBelso("lepcso");
    for (var i = 0; i < n; i++) {
      var x = G.x0 + i * G.W, y = G.top(i), nev = F[i], sz = MK_SZELLEM[nev];
      s += `<g class="fok" data-i="${i}"><rect x="${x}" y="${y}" width="${G.W}" height="${404 - y}" fill="${sz ? "#f5f1fb" : MK_FOK_SZIN[i % 7]}" stroke="${sz ? "#cbb6e6" : "#fff"}" stroke-width="${sz ? 2 : 3}" ${sz ? 'stroke-dasharray="6 5"' : ""}/>
        <rect x="${x}" y="${y}" width="${G.W}" height="7" fill="${sz ? "#ece4f7" : "rgba(255,255,255,.55)"}"/>
        ${nev ? `<text x="${x + G.W / 2}" y="${y + 36}" text-anchor="middle" font-size="22" font-weight="800" fill="${sz ? "#9d8cc0" : "#4a3b7a"}" font-family="Fredoka,Segoe UI,sans-serif">${nev}</text>` : `<text x="${x + G.W / 2}" y="${y + 32}" text-anchor="middle" font-size="13" font-style="italic" font-weight="700" fill="#9d8cc0" font-family="Segoe UI,sans-serif">(10 kg)</text>`}
        <rect class="fok-feny" x="${x}" y="${y}" width="${G.W}" height="${404 - y}" fill="#fff6b0" opacity="0"/></g>`;
      if (i < n - 1) s += `<g class="cimke" data-i="${i}" opacity="0" transform="translate(${x + G.W},${y + G.H / 2})"><rect class="cimke-r" x="-24" y="-12" width="48" height="24" rx="12" fill="#e0569a"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Segoe UI,sans-serif">${le ? "× 10" : "÷ 10"}</text></g>`;
    }
    s += `<g class="lepo" transform="translate(${G.kozep(from)},${G.top(from)})">${mkUni(0, 0, .6, !le)}
      <g class="tabla" transform="translate(0,-122)"><rect class="tabla-r" x="-78" y="-24" width="156" height="44" rx="14" fill="#fff" stroke="#cbb6e6" stroke-width="3"/>
      <text class="tabla-t" x="0" y="8" text-anchor="middle" font-size="24" font-weight="800" fill="#4a3b7a" font-family="Fredoka,Segoe UI,sans-serif">${mSzamIr(o.szam)} ${o.from}</text>
      <line x1="0" y1="20" x2="0" y2="34" stroke="#cbb6e6" stroke-width="3"/></g></g>`;
    return s + `<g class="fx"></g>`;
  },
  play: async function (ctx, svg, fel, o) {
    var F = MK_FOKOK[o.menny], G = mkLepcsoGeo(F.length), from = F.indexOf(o.from), to = F.indexOf(o.to), le = to > from, lep = le ? 1 : -1;
    var lepo = mkQ(svg, ".lepo"), tt = mkQ(svg, ".tabla-t"), cimkek = mkQQ(svg, ".cimke"), fokok = mkQQ(svg, ".fok");
    mkMond(ctx, mNagy(mMondd(o.szam, o.from)) + " hány " + M_NEV[o.to] + "? " + (le ? "Lefelé" : "Fölfelé") + " lépkedünk, minden lépcsőfok " + (le ? "tízszeres!" : "tized!"));
    await mkVar(ctx, 2200);
    var szam = o.szam;
    for (var i = from; i !== to; i += lep) {
      let j = i + lep, x0 = G.kozep(i), y0 = G.top(i), x1 = G.kozep(j), y1 = G.top(j), ck = cimkek[Math.min(i, j)];
      mkAttr(ck, { opacity: 1 });
      await mkTw(ctx, 480, function (p) { mkAttr(lepo, { transform: "translate(" + mkLerp(x0, x1, p) + "," + (mkLerp(y0, y1, p) - 44 * Math.sin(Math.PI * p)) + ")" }); }, mkLin);
      szam = le ? szam * 10 : szam / 10;
      var nev = F[j];
      tt.textContent = mSzamIr(szam) + (nev ? " " + nev : "");
      let ff = mkQ(fokok[j], ".fok-feny");
      mkTw(ctx, 420, function (p) { mkAttr(ff, { opacity: .6 * (1 - p) }); }, mkLin).catch(function () {});
      mkTw(ctx, 260, function (p) { mkAttr(mkQ(svg, ".tabla"), { transform: "translate(0,-122) scale(" + (1 + .18 * Math.sin(Math.PI * p)) + ")" }); }, mkLin).catch(function () {});
      fel((le ? "× 10" : "÷ 10") + " → " + mSzamIr(szam) + (nev ? " " + nev : ""));
      mkMond(ctx, mSzamSzo(szam));
      await mkVar(ctx, 420);
      mkAttr(mkQ(ck, ".cimke-r"), { fill: "#8f7ab8" });
    }
    mkAttr(mkQ(svg, ".tabla-r"), { fill: "#fff6c8", stroke: "#f2c94c" });
    fel(mSzamIr(o.szam) + " " + o.from + " = " + mSzamIr(szam) + " " + o.to);
    var db = Math.abs(to - from);
    mkMond(ctx, mNagy(mMondd(o.szam, o.from)) + " az " + mMondd(szam, o.to) + "! " + mNagy(mSzamSzo(db)) + " lépés, mindegyik " + (le ? "tízszeres." : "tized."), true);
    mkSzikra(ctx, svg, G.kozep(to), G.top(to) - 122, 12, ["#ffe27a", "#f6a5c0", "#9ec9f0", "#fff"]);
    await mkUgrik(ctx, svg, 12);
    await mkVar(ctx, 900);
  }
};

/* ═════════════════ CSOPORTOS változat (rossz válasz után): n „egész” tárgy, mindegyikben 10 szelet ═════════════════
   🧪 üvegek · 🧁 mézes bödönök · 🧵 pálcák. Pl. „3 l = ? dl”: három üveg, a szeletek kigyúlnak, tízesével számol.
   o: { menny, liga, a (nagy egység), b (kicsi), f, n (hány nagy), le (nagyból kicsibe?) } */
var MK_CSOPORT = {
  render: function (o) {
    var s, i, k, kozep = function (b) { return 240 + (b + .5) * 550 / o.n; };
    if (o.liga === "szabo") {
      s = mkSzaboHatter() + mkUni(112, 402, 1.2) + mkBuborek(16, 22, 250);
      var dy = Math.min(44, 190 / o.n), y0 = 150 + (190 - dy * o.n) / 2;
      for (i = 0; i < o.n; i++) {
        var y = y0 + i * dy, sz = "";
        for (k = 0; k < 10; k++) sz += `<rect class="szelet" x="${300 + k * 46}" y="${y}" width="46" height="${dy - 10}" fill="${MK_SZALAG_SZIN[(i + k) % 10]}" stroke="#fff" stroke-width="1.5" opacity=".28"/>`;
        s += `<g class="uveg">${sz}<rect x="300" y="${y}" width="460" height="${dy - 10}" rx="4" fill="none" stroke="#b07a45" stroke-width="2.5"/>
          <rect x="240" y="${y + (dy - 10) / 2 - 12}" width="52" height="24" rx="10" fill="#fff" stroke="#cbb6e6" stroke-width="2"/>
          <text class="pcimke" x="266" y="${y + (dy - 10) / 2 + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="#4a3b7a" font-family="Fredoka,Segoe UI,sans-serif">1 ${o.a}</text>
          <ellipse class="palack-feny" cx="530" cy="${y + (dy - 10) / 2}" rx="250" ry="${dy}" fill="#fff4a8" opacity="0"/></g>`;
      }
    } else {
      var baj = o.liga === "bajital";
      s = (baj ? mkBajitalHatter() : mkPeksegHatter()) + mkUni(118, 402, 1.2) + mkBuborek(16, 22, 250);
      for (i = 0; i < o.n; i++) s += `<g class="uveg">${mkPalack(kozep(i) - 690, "mk-cs" + i, true, "1 " + o.a, baj ? MK_BAJ : MK_MEZ, baj ? MK_BAJ2 : MK_MEZ2)}</g>`;
    }
    return s + `<g class="fx"></g>`;
  },
  play: async function (ctx, svg, fel, o) {
    var u = { x: 118, y: 402, s: 1.2 }, szel = o.f / 10, uvegek = mkQQ(svg, ".uveg");
    var fa = o.le ? mNagy(mMondd(o.n, o.a)) + ". Minden " + mBen(o.a) + " " + mMondd(o.f, o.b) + " van."
                  : mNagy(mMondd(o.n * o.f, o.b)) + ". Minden " + M_NEV[o.a] + " " + mMondd(o.f, o.b) + ". Töltsük meg sorban!";
    mkMond(ctx, fa);
    mkBub(svg, o.le ? (o.n + " " + o.a + " = ? " + o.b) : (mSzamIr(o.n * o.f) + " " + o.b + " = ? " + o.a));
    await mkVar(ctx, 2000);
    for (var b = 0; b < o.n; b++) {
      mkSzarvVarazs(ctx, svg, u);
      var sz = mkQQ(uvegek[b], ".szelet");
      for (let k2 = 0; k2 < 10; k2++) { let r = sz[k2]; await mkTw(ctx, 55, function (p) { mkAttr(r, { opacity: .28 + .72 * p }); }, mkLin); }
      let fk = mkQ(uvegek[b], ".palack-feny");
      mkTw(ctx, 500, function (p) { mkAttr(fk, { opacity: .3 * Math.sin(Math.PI * p) }); }, mkLin).catch(function () {});
      var n = (b + 1) * o.f;
      mkQ(uvegek[b], ".pcimke").textContent = o.f + " " + o.b;
      if (o.le) { mkBub(svg, mSzamIr(n) + " " + o.b); fel((b + 1) + ". " + o.a + ": még " + o.f + " " + o.b + " → " + mSzamIr(n) + " " + o.b); mkMond(ctx, mSzamSzo(n)); }
      else { mkBub(svg, (b + 1) + " " + o.a); fel(mSzamIr(n) + " " + o.b + " → " + (b + 1) + " " + o.a); mkMond(ctx, mSzamSzo(b + 1)); }
      await mkVar(ctx, 700);
    }
    var vegs = o.le ? (o.n + " " + o.a + " = " + mSzamIr(o.n * o.f) + " " + o.b) : (mSzamIr(o.n * o.f) + " " + o.b + " = " + o.n + " " + o.a);
    mkBub(svg, vegs); fel(vegs + " · Most te mondd!");
    mkMond(ctx, (o.le ? mNagy(mMondd(o.n, o.a)) + " az " + mMondd(o.n * o.f, o.b) : mNagy(mMondd(o.n * o.f, o.b)) + " az " + mMondd(o.n, o.a)) + ". Most te mondd!", true);
    mkSzikra(ctx, svg, 500, 140, 12, ["#ffe27a", "#f6a5c0", "#c79bea", "#fff"]);
    await mkUgrik(ctx, svg, 14);
    await mkVar(ctx, 900);
  }
};

/* ═════════════════ melyik mozgókép? ═════════════════ */
/* bemutató egy egységpárhoz (a: nagy, b: kicsi) */
function mkBemutatoValaszt(mk) {
  var p = mk.a + "-" + mk.b;
  if (p === "l-dl") return { klip: MK_BAJITAL };
  if (p === "dm-cm") return { klip: MK_SZABO, o: "cm" };
  if (p === "m-dm") return { klip: MK_SZABO, o: "dm" };
  if (p === "m-cm") return { klip: MK_SZABO, o: "egesz" };
  if (p === "kg-dkg") return { klip: MK_PEKSEG };
  return { klip: MK_LEPCSO, o: { menny: mk.menny, from: mk.a, to: mk.b, szam: 1 } };
}
/* rossz válasz után az adott feladat számaival: kis számnál csoportos, egyébként a lépcső */
function mkHibaValaszt(mk) {
  var f = M_SZ[mk.a] / M_SZ[mk.b], le = (mk.u === mk.a), nNagy = le ? mk.n : mk.n / f;
  var liga = MENNY[mk.menny].liga;
  if (f <= 100 && nNagy >= 1 && nNagy <= 5 && nNagy === Math.round(nNagy))
    return { klip: MK_CSOPORT, o: { menny: mk.menny, liga: liga, a: mk.a, b: mk.b, f: f, n: nNagy, le: le } };
  return { klip: MK_LEPCSO, o: { menny: mk.menny, from: mk.u, to: mk.cel, szam: mk.n } };
}

/* ═════════════════ a lejátszó réteg ═════════════════ */
var MKJ = { token: 0, ctx: null, kesz: null, idozito: null };
function mkReteg() {
  var r = $("mk-reteg");
  if (r) return r;
  r = el("div", "mk-reteg"); r.id = "mk-reteg"; r.hidden = true;
  r.innerHTML = '<div class="mk-doboz" role="dialog" aria-label="Szemléltető mozgókép"><div class="mk-cim"></div>' +
    '<div class="mk-szinpad"><svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg"></svg><span class="mk-atugor">koppints: ugrás a végére ⏭</span></div>' +
    '<div class="mk-felirat"></div><button class="mk-tovabb" type="button">⏭ Átugrom</button></div>';
  document.body.appendChild(r);
  mkQ(r, ".mk-szinpad").addEventListener("click", function () { if (MKJ.ctx && MKJ.ctx.fut) MKJ.ctx.skip = true; });
  mkQ(r, ".mk-tovabb").addEventListener("click", function () {
    hangGomb();
    if (MKJ.ctx && MKJ.ctx.fut) { MKJ.ctx.skip = true; return; }
    mkBezar();
  });
  return r;
}
function mkBezar() {
  var r = $("mk-reteg"); if (r) r.hidden = true;
  clearTimeout(MKJ.idozito);
  MKJ.token++;
  if (MKJ.ctx) MKJ.ctx.fut = false;
  var k = MKJ.kesz; MKJ.kesz = null;
  if (k) k();
}
/* lejátszás; kesz() a bezárás után fut (a játék folytatódik) */
function mkLejatszik(valasztas, cim, kesz) {
  var r = mkReteg(), svg = mkQ(r, "svg"), felirat = mkQ(r, ".mk-felirat"), gomb = mkQ(r, ".mk-tovabb");
  if (typeof figyelStop === "function") figyelStop();
  MKJ.token++; clearTimeout(MKJ.idozito);
  var tok = MKJ.token, klip = valasztas.klip, o = valasztas.o;
  MKJ.kesz = kesz;
  mkQ(r, ".mk-cim").textContent = cim;
  svg.innerHTML = klip.render(o);
  if (klip.init) klip.init(svg);
  felirat.textContent = ""; gomb.textContent = "⏭ Átugrom"; gomb.classList.remove("vege");
  r.hidden = false; r.classList.add("fut");
  var ctx = { skip: false, lassu: window.__UC_GYORS ? .03 : MK_TEMPO, fut: true, el: function () { return MKJ.token === tok; } };
  MKJ.ctx = ctx;
  var fel = function (t) { if (ctx.el()) felirat.textContent = t; };
  klip.play(ctx, svg, fel, o).catch(function (e) { if (e !== "stop") console.error(e); }).then(function () {
    if (!ctx.el()) return;
    ctx.fut = false; r.classList.remove("fut");
    gomb.textContent = "Értem, jöhet! ▶"; gomb.classList.add("vege");
    MKJ.idozito = setTimeout(function () { if (ctx.el()) mkBezar(); }, ctx.skip ? 2600 : 2200);   /* magától is továbbmegy (kézmentes mód) */
  });
}
/* az átváltás-feladat ELŐTT: az egységpár első előfordulása ebben a pályakörben → bemutató (true = most fut) */
function mkElottKell(f, tovabb) {
  if (!f || !f.mk || !J) return false;
  J.mkLatott = J.mkLatott || {};
  var kulcs = f.mk.a + "-" + f.mk.b;
  if (J.mkLatott[kulcs]) return false;
  J.mkLatott[kulcs] = true;
  mkLejatszik(mkBemutatoValaszt(f.mk), "Nézd meg: 1 " + f.mk.a + " = " + mSzamIr(M_SZ[f.mk.a] / M_SZ[f.mk.b]) + " " + f.mk.b, tovabb);
  return true;
}
/* rossz válasz után az adott feladat számaival, aztán ugyanaz a kérdés újra */
function mkHiba(f, valasz) {
  figyelStop();
  $("visszajelzes").className = "visszajelzes rossz";
  $("visszajelzes").textContent = "Nem " + valasz + ". Nézzük meg együtt!";
  mondd("Nem talált. Nézzük meg együtt!", function () {
    if (!J || J.feladat !== f) return;
    mkLejatszik(mkHibaValaszt(f.mk), mJel(f.mk.n, f.mk.u) + " = ? " + f.mk.cel, function () {
      if (!J || J.feladat !== f) return;
      $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "Most te: " + mJel(f.mk.n, f.mk.u) + " = ? " + f.mk.cel;
      mondd(f.felolvas, kezNelkulUjra);
    });
  });
}

/* agy-valtozatok.js — az új ágy 3 rajzváltozata (unikornis pózok, 7. lépés). CSAK az előnézethez (terv/agy-build.py).
   Odú-koordinátában rajzolva: az ágy közepe x=155, a padló y=452; a fekvő unikornis (scale 1.28) a matracon x 50–275.
   Minden változat: hatso(szint) = az unikornis MÖGÉ, elol(szint) = az unikornis ELÉ (a matrac pereme, amibe belesüpped).
   Szintek (a bolti ágyszintek megmaradnak): 1 = alap, 2 = + szivárványos takaró, 3 = + csillagbaldachin. */
var AGY_SZIV = ["#f6a5c0", "#f7c59f", "#fce49a", "#a7d99a", "#9ec9f0"];

/* 2. szint: vékony szivárványcsíkos takaró, a hátsó felére terítve (az unikornis ELÉ) */
function agyTakaro(x0, x1, y0, h) {
  var s = "", m = (x0 + x1) / 2, d = h / 5;
  for (var i = 0; i < 5; i++) {
    var a = y0 + i * d, b = a + d;
    s += '<path d="M' + x0 + ' ' + a + ' Q' + m + ' ' + (a - 7) + ' ' + x1 + ' ' + a + ' L' + x1 + ' ' + b + ' Q' + m + ' ' + (b - 7) + ' ' + x0 + ' ' + b + ' Z" fill="' + AGY_SZIV[i] + '"/>';
  }
  s += '<path d="M' + x0 + ' ' + y0 + ' Q' + m + ' ' + (y0 - 7) + ' ' + x1 + ' ' + y0 + '" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>';
  var r = "";
  for (var x = x0 + 6; x < x1 - 2; x += 10) r += '<circle cx="' + x + '" cy="' + (y0 + h + 2) + '" r="2.4" fill="#fdfdfd"/>';
  return '<g opacity=".95">' + s + r + '</g>';
}
/* 3. szint: két karcsú arany pálca + könnyű, áttetsző fátyol-ív csillagokkal (az unikornis MÖGÉ) */
function agyBaldachin(x0, x1, yTop, yAlj) {
  var m = (x0 + x1) / 2, s = "";
  s += '<g stroke="#f0c870" stroke-width="3" stroke-linecap="round"><path d="M' + x0 + ' ' + yAlj + ' V' + yTop + '"/><path d="M' + x1 + ' ' + yAlj + ' V' + yTop + '"/></g>';
  s += '<path d="M' + x0 + ' ' + yTop + ' Q' + m + ' ' + (yTop + 34) + ' ' + x1 + ' ' + yTop + ' L' + x1 + ' ' + (yTop + 10) + ' Q' + m + ' ' + (yTop + 46) + ' ' + x0 + ' ' + (yTop + 10) + ' Z" fill="#cbb6e6" opacity=".55"/>';
  s += '<path d="M' + x0 + ' ' + (yTop + 4) + ' Q' + (x0 - 10) + ' ' + (yTop + 60) + ' ' + (x0 + 6) + ' ' + (yTop + 112) + ' Q' + (x0 + 18) + ' ' + (yTop + 60) + ' ' + (x0 + 26) + ' ' + (yTop + 18) + ' Z" fill="#e0d2f3" opacity=".6"/>';
  s += '<path d="M' + x1 + ' ' + (yTop + 4) + ' Q' + (x1 + 10) + ' ' + (yTop + 60) + ' ' + (x1 - 6) + ' ' + (yTop + 112) + ' Q' + (x1 - 18) + ' ' + (yTop + 60) + ' ' + (x1 - 26) + ' ' + (yTop + 18) + ' Z" fill="#e0d2f3" opacity=".6"/>';
  [[x0, yTop - 4, 7], [x1, yTop - 4, 7], [m - 40, yTop + 30, 4], [m, yTop + 36, 5], [m + 40, yTop + 30, 4]].forEach(function (c) {
    var x = c[0], y = c[1], r = c[2];
    s += '<path d="M' + x + ' ' + (y - r) + ' l' + (r * .3) + ' ' + (r * .7) + ' l' + (r * .7) + ' ' + (r * .3) + ' l' + (-r * .7) + ' ' + (r * .3) + ' l' + (-r * .3) + ' ' + (r * .7) + ' l' + (-r * .3) + ' ' + (-r * .7) + ' l' + (-r * .7) + ' ' + (-r * .3) + ' l' + (r * .7) + ' ' + (-r * .3) + ' Z" fill="#ffe08a"/>';
  });
  return s;
}
function agyArnyek(rx) { return '<ellipse cx="155" cy="452" rx="' + rx + '" ry="8" fill="#3b2f66" opacity=".14"/>'; }
function agyCsillam(pontok) {
  return '<g fill="#fff6c8">' + pontok.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] || 1.8) + '"/>'; }).join("") + '</g>';
}

var AGY_VALTOZAT = {
  /* ── A) FELHŐFÉSZEK: keret és láb nélkül, egy puha, lebegő felhő-fészek; párna = kis alvó holdsarló ── */
  felho: {
    nev: "A) Felhőfészek", rovid: "lebegő felhő, keret nélkül",
    uni: { x: 158, y: 430 },
    hatso: function (sz) {
      var s = "";
      if (sz >= 3) s += agyBaldachin(40, 272, 300, 448);
      s += agyArnyek(104);
      s += '<g fill="#fdfdfd"><circle cx="52" cy="406" r="18"/><circle cx="80" cy="394" r="25"/><circle cx="120" cy="386" r="29"/><circle cx="162" cy="384" r="30"/><circle cx="204" cy="388" r="28"/><circle cx="242" cy="398" r="23"/><circle cx="266" cy="410" r="15"/></g>';
      s += '<ellipse cx="158" cy="414" rx="106" ry="13" fill="#efe7fa"/>';
      s += '<path d="M60 370 a22 22 0 1 0 28 32 a17 17 0 1 1 -28 -32 Z" fill="#fce49a" stroke="#f0c870" stroke-width="1.4"/>';   /* holdsarló-párna */
      s += '<path d="M66 392 q3 3 6 0" stroke="#c99a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="68" cy="398" r="2" fill="#f7b8d0"/>';
      s += agyCsillam([[100, 360, 2], [230, 366, 1.6], [282, 392, 1.4]]);
      return s;
    },
    elol: function (sz) {
      var s = '<g fill="#fdfdfd"><rect x="40" y="410" width="232" height="26" rx="13"/><circle cx="56" cy="418" r="16"/><circle cx="92" cy="418" r="20"/><circle cx="132" cy="420" r="21"/><circle cx="172" cy="420" r="21"/><circle cx="212" cy="418" r="20"/><circle cx="248" cy="418" r="16"/><circle cx="266" cy="414" r="11"/></g>';
      s += '<path d="M76 404 q14 -6 28 0 M150 404 q14 -6 28 0 M222 404 q12 -5 24 0" stroke="#efe7fa" stroke-width="2" fill="none" stroke-linecap="round"/>';
      s += '<path d="M54 438 Q158 452 262 436" stroke="#e2d6f2" stroke-width="4" fill="none" stroke-linecap="round"/>';
      if (sz >= 2) s += agyTakaro(150, 262, 420, 26);
      s += agyCsillam([[96, 446, 1.6], [196, 448, 1.8], [150, 449, 1.2]]);
      return s;
    }
  },

  /* ── B) HOLDBÖLCSŐ: vékony, aranyló holdsarló-bölcső két karcsú lábon, benne felhőpárna; a sarló alszik ── */
  hold: {
    nev: "B) Holdbölcső", rovid: "aranyló holdsarló, karcsú lábak",
    uni: { x: 162, y: 428 },
    hatso: function (sz) {
      var s = "";
      if (sz >= 3) s += agyBaldachin(40, 280, 300, 450);
      s += agyArnyek(96);
      s += '<g stroke="#e6b94f" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M106 440 L98 452"/><path d="M214 440 L222 452"/></g><circle cx="97" cy="452" r="2.6" fill="#f0c870"/><circle cx="223" cy="452" r="2.6" fill="#f0c870"/>';
      s += '<path d="M50 316 C20 382 46 444 150 446 C214 447 256 424 272 392 C244 418 204 428 152 428 C84 428 50 390 50 316 Z" fill="#fce49a" stroke="#efc566" stroke-width="1.6"/>';   /* a holdsarló */
      s += '<path d="M38 368 q5 4 10 0" stroke="#c99a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="44" cy="378" r="2.6" fill="#f7b8d0" opacity=".8"/>';   /* alvó arc */
      s += '<line x1="50" y1="316" x2="50" y2="330" stroke="#e6b94f" stroke-width="1"/><path d="M50 330 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#ffe08a"/>';   /* lógó csillag a csúcsán */
      s += '<g fill="#fdfdfd"><rect x="62" y="404" width="200" height="22" rx="11"/><circle cx="80" cy="404" r="14"/><circle cx="116" cy="398" r="18"/><circle cx="156" cy="397" r="19"/><circle cx="196" cy="399" r="18"/><circle cx="234" cy="404" r="15"/></g>';
      s += '<ellipse cx="78" cy="396" rx="18" ry="11" fill="#e9ddf3"/><path d="M66 394 q12 -6 24 0" stroke="#fdfdfd" stroke-width="2" fill="none"/>';   /* kis felhőpárna */
      return s;
    },
    elol: function (sz) {
      var s = '<g fill="#fdfdfd"><rect x="64" y="410" width="196" height="20" rx="10"/><circle cx="92" cy="414" r="13"/><circle cx="128" cy="416" r="15"/><circle cx="166" cy="416" r="15"/><circle cx="204" cy="415" r="14"/><circle cx="238" cy="412" r="12"/></g>';
      s += '<path d="M62 426 C96 446 200 448 262 414 C244 430 204 440 152 440 C108 440 80 434 62 426 Z" fill="#fce49a" stroke="#efc566" stroke-width="1.2"/>';   /* a sarló elülső pereme */
      if (sz >= 2) s += agyTakaro(150, 258, 418, 24);
      return s;
    }
  },

  /* ── C) SZIROMÁGY: nagy, halvány virág; a hátsó szirmok könnyű legyezőként az ágyvég, elöl lágyan kihajlanak ── */
  szirom: {
    nev: "C) Lótuszágy", rovid: "halvány tavirózsa-virág, szirmok közt fekszik",
    uni: { x: 158, y: 428 },
    hatso: function (sz) {
      var s = "";
      if (sz >= 3) s += agyBaldachin(36, 278, 300, 448);
      s += agyArnyek(108);
      s += '<ellipse cx="70" cy="447" rx="30" ry="6" fill="#b8deb0" transform="rotate(-8 70 447)"/><ellipse cx="244" cy="447" rx="30" ry="6" fill="#b8deb0" transform="rotate(8 244 447)"/>';
      [[-80, 120], [-62, 128], [-44, 122], [44, 122], [62, 128], [80, 120]].forEach(function (p) {
        var L = p[1], W = 30;
        s += '<g transform="translate(158,432) rotate(' + p[0] + ')"><path d="M0 0 C' + W + ' ' + (-L * .35) + ' ' + (W * .6) + ' ' + (-L) + ' 0 ' + (-L) + ' C' + (-W * .6) + ' ' + (-L) + ' ' + (-W) + ' ' + (-L * .35) + ' 0 0 Z" fill="#fbdbe8" stroke="#f2b6cc" stroke-width="1.4"/>' +
             '<path d="M0 -10 V' + (-L + 16) + '" stroke="#fdeef4" stroke-width="2" stroke-linecap="round"/></g>';
      });
      s += '<g fill="#fdf6e3"><rect x="48" y="404" width="220" height="26" rx="13"/><circle cx="70" cy="404" r="14"/><circle cx="108" cy="399" r="17"/><circle cx="150" cy="397" r="18"/><circle cx="192" cy="398" r="17"/><circle cx="232" cy="403" r="15"/></g>';
      s += '<ellipse cx="74" cy="396" rx="17" ry="10" fill="#fff0b8"/><g fill="#f6c84c"><circle cx="68" cy="394" r="1.6"/><circle cx="76" cy="392" r="1.6"/><circle cx="80" cy="398" r="1.6"/></g>';   /* virágpor-párna */
      return s;
    },
    elol: function (sz) {
      var s = "";
      [[-62, 64], [-34, 58], [0, 54], [34, 58], [62, 64]].forEach(function (p) {
        var L = p[1], W = 24;
        s += '<g transform="translate(158,452) rotate(' + p[0] + ')"><path d="M0 0 C' + W + ' ' + (-L * .4) + ' ' + (W * .5) + ' ' + (-L) + ' 0 ' + (-L) + ' C' + (-W * .5) + ' ' + (-L) + ' ' + (-W) + ' ' + (-L * .4) + ' 0 0 Z" fill="#f9cadb" stroke="#f0aac4" stroke-width="1.3"/>' +
             '<path d="M0 -8 V' + (-L + 14) + '" stroke="#fde6ef" stroke-width="2" stroke-linecap="round"/></g>';
      });
      if (sz >= 2) s += agyTakaro(150, 262, 426, 22);
      return s;
    }
  }
};

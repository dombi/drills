/* ══ 🦉 BAGOLY — a játék négy baglya egy helyen (takarító kör H, 2026-10-03) ══
   kabala (a jelenet sarkában, beszél) · konyvtaros (a kabala szemüveggel, pislog) ·
   bankar (karamell, szemüveg, pink csokornyakkendő, pislog) · boltos (körvonalas, 3 szárny-póz).
   Producer döntése: egy modul, külsőre változatlanul — a rajzok betűre azonosak a korábbi 4 külön függvénnyel.
   Hívás: bagolyRajz("kabala") · bagolyRajz("konyvtaros", x, y, s) · bagolyRajz("bankar", x, y, s) · bagolyRajz("boltos", poz).
   Új bagoly = egy sor a BAGOLY-táblába, a közös darabokból (pupilla, pislogás, szemüveg). */

/* ── közös darabok ── */
var BAGOLY_AG = '<path d="M-40,52 Q0,40 40,52" stroke="#6b5442" stroke-width="9" fill="none" stroke-linecap="round"/>';
function bagolyHelyen(x, y, s, belso) { return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' + belso + '</g>'; }
function bagolyPupillak(cy, r, cls) {
  var c = cls ? ' class="' + cls + '"' : '';
  return '<circle' + c + ' cx="-11" cy="' + cy + '" r="' + r + '" fill="#4a3b7a"/><circle' + c + ' cx="11" cy="' + cy + '" r="' + r + '" fill="#4a3b7a"/>';
}
function bagolyFeny(cy) { return '<circle cx="-13" cy="' + cy + '" r="2" fill="#fff"/><circle cx="9" cy="' + cy + '" r="2" fill="#fff"/>'; }
/* pislogás: a pupillák függőlegesen összecsukódnak (dur = egy kör, kt = mikor csukódik) */
function bagolyPislog(dur, kt, belso) {
  return '<g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .1;1 1" keyTimes="' + kt + '" dur="' + dur + '" repeatCount="indefinite" additive="sum"/>' + belso + '</g>';
}
function bagolySzemuveg(cy, r, szin, hid) {
  var kv = ' fill="none" stroke="' + szin + '" stroke-width="2.5"/>';
  return '<circle cx="-13" cy="' + cy + '" r="' + r + '"' + kv + '<circle cx="13" cy="' + cy + '" r="' + r + '"' + kv +
    '<path d="M' + (-hid / 2) + ',' + (cy - 2) + ' h' + hid + '" stroke="' + szin + '" stroke-width="2.5"/>';
}
/* a lila bagoly teste (kabala és könyvtáros): ág nélkül, a pupillák helye kívülről jön */
function bagolyLilaTest(pupillak) {
  return '<ellipse cx="0" cy="0" rx="34" ry="42" fill="#c9a8e6"/>' +
    '<ellipse cx="0" cy="8" rx="22" ry="30" fill="#e9ddf3"/>' +
    '<path d="M-34,-6 Q-46,10 -34,30 Q-30,10 -30,-6 Z" fill="#b48fd6"/>' +
    '<path d="M34,-6 Q46,10 34,30 Q30,10 30,-6 Z" fill="#b48fd6"/>' +
    '<path d="M-26,-40 l10,-14 l6,14 Z" fill="#c9a8e6"/>' +
    '<path d="M26,-40 l-10,-14 l-6,14 Z" fill="#c9a8e6"/>' +
    '<circle cx="-13" cy="-14" r="14" fill="#fdfdfd"/>' +
    '<circle cx="13" cy="-14" r="14" fill="#fdfdfd"/>' +
    pupillak + bagolyFeny(-15) +
    '<path d="M-5,-2 L5,-2 L0,10 Z" fill="#ffcf6b"/>' +
    '<path d="M-30,44 l-6,10 M-22,46 l-2,10 M22,46 l2,10 M30,44 l6,10" stroke="#ffcf6b" stroke-width="4" stroke-linecap="round"/>';
}

/* ── a bagoly-boltos: 3 póz, csak a szárny-path és a pupillák térnek el ── */
var BOLT_BAGOLY_POZ = {
  nyugalmi: { szarny: "M28 -40 Q40 -30 35 -16 Q26 -24 26 -38 Z", bal: [-11, -43], jobb: [11, -43] },
  fel:      { szarny: "M28 -44 Q52 -54 66 -66 Q56 -44 34 -34 Z", bal: [-10, -47], jobb: [12, -47] },
  oldal:    { szarny: "M28 -34 Q54 -34 70 -30 Q54 -22 32 -24 Z", bal: [-7, -43],  jobb: [15, -43] }
};

var BAGOLY = {
  /* a jelenet sarkában ülő kabala (main.js teszi ki; beszéd közben az audio.js bagolyAnimal mozgatja) */
  kabala: function () {
    return '<svg class="bagoly-figura" viewBox="-52 -60 104 126" xmlns="http://www.w3.org/2000/svg">' + BAGOLY_AG +
      '<g class="bagoly-test">' + bagolyLilaTest(bagolyPupillak(-12, 6.5, "bagoly-pupilla")) +
        '<path d="M18,-44 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2 Z" fill="#fff2c4"/>' +
      '</g>' +
    '</svg>';
  },
  /* 📚 a könyvtáros: a kabala szemüveggel, pislog */
  konyvtaros: function (x, y, s) {
    return bagolyHelyen(x, y, s, BAGOLY_AG + bagolyLilaTest(bagolyPislog("4.5s", "0;.94;.97;1", bagolyPupillak(-12, 6.5))) +
      bagolySzemuveg(-14, 17, "#8a6a4a", 2));
  },
  /* 🏦 a bankár (rajzterv: karamell, szemüveg, pink csokornyakkendő, pislog) — 0,0 a test közepe */
  bankar: function (x, y, s) {
    return bagolyHelyen(x, y, s,
      '<ellipse cx="0" cy="46" rx="34" ry="6" fill="#000" opacity=".18"/>' +
      '<path d="M-26,-40 l8,-16 l8,15 Z" fill="#c98d55"/><path d="M26,-40 l-8,-16 l-8,15 Z" fill="#c98d55"/>' +
      '<ellipse cx="0" cy="0" rx="34" ry="44" fill="#e2b07a"/>' +
      '<ellipse cx="0" cy="12" rx="22" ry="29" fill="#fbe6c8"/>' +
      '<path d="M-10,14 q3,4 6,0 M2,22 q3,4 6,0 M-6,30 q3,4 6,0" stroke="#e2b07a" stroke-width="2" fill="none"/>' +
      '<path d="M-34,-4 Q-48,14 -33,34 Q-28,14 -29,-4 Z" fill="#c98d55"/><path d="M34,-4 Q48,14 33,34 Q28,14 29,-4 Z" fill="#c98d55"/>' +
      '<circle cx="-13" cy="-15" r="13" fill="#fffaf0"/><circle cx="13" cy="-15" r="13" fill="#fffaf0"/>' +
      bagolyPislog("4.2s", "0;.93;.965;1", bagolyPupillak(-13, 6)) +
      bagolyFeny(-16) +
      bagolySzemuveg(-15, 16, "#7a5230", 4) +
      '<path d="M-5,-3 L5,-3 L0,8 Z" fill="#ffb347"/>' +
      '<g transform="translate(0,17)"><path d="M0,0 L-13,-7 L-13,7 Z" fill="#f06aa8"/><path d="M0,0 L13,-7 L13,7 Z" fill="#f06aa8"/><circle r="3.5" fill="#d84f96"/></g>' +
      '<path d="M-14,44 l-4,8 M-8,45 l-1,8 M8,45 l1,8 M14,44 l4,8" stroke="#ffb347" stroke-width="4" stroke-linecap="round"/>');
  },
  /* 🛍️ a boltos az odú boltjában: nyugalmi · fel (szárnnyal a kiválasztott felé) · oldal */
  boltos: function (poz) {
    var p = BOLT_BAGOLY_POZ[poz] || BOLT_BAGOLY_POZ.nyugalmi;
    function szem(c) {   /* a fénypötty mindig 2 px-szel balra és 3 px-szel fölé */
      return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="#4a3b2a"/>' +
             '<circle cx="' + (c[0] - 2) + '" cy="' + (c[1] - 3) + '" r="1.8" fill="#fff"/>';
    }
    return '<g class="bolt-bagoly" transform="translate(140,430)">' +
      '<ellipse cx="0" cy="3" rx="32" ry="5" fill="#3b2f66" opacity="0.18"/>' +
      '<g stroke="#e8a23d" stroke-width="3.4" stroke-linecap="round" fill="none">' +
        '<path d="M-11 -8 v10"/><path d="M11 -8 v10"/><path d="M-15 2 h9 M-11 2 v3"/><path d="M7 2 h9 M11 2 v3"/></g>' +
      '<ellipse cx="0" cy="-36" rx="31" ry="35" fill="#c9a06a" stroke="#222" stroke-width="2.2"/>' +
      '<ellipse cx="0" cy="-28" rx="21" ry="25" fill="#e9d3ad"/>' +
      '<path d="M-28 -62 l10 18 l11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
      '<path d="M28 -62 l-10 18 l-11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
      '<circle cx="-11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
      '<circle cx="11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
      '<g class="bolt-bagoly-szem">' + szem(p.bal) + szem(p.jobb) + '</g>' +
      '<path d="M0 -34 l-5 7 l10 0 Z" fill="#e8a23d" stroke="#222" stroke-width="1.6"/>' +
      '<path d="M-19 -16 Q0 -21 19 -16 Q21 -4 18 4 Q0 9 -18 4 Q-21 -4 -19 -16 Z" fill="#f7b8d0" stroke="#e79ac0" stroke-width="1.8"/>' +
      '<path d="M-8 -10 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#fff2c4"/>' +
      '<path class="bolt-bagoly-szarny" d="' + p.szarny + '" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
    '</g>';
  }
};
function bagolyRajz(fajta) { return BAGOLY[fajta].apply(null, Array.prototype.slice.call(arguments, 1)); }

/* ============ 6j2) 🏪 PIAC.JS — a régi Piactér maradéka: a házak állapota, a tárgy-nézetek, a beköltözött ligetek ============
   A régi Piactér (a nagy térkép „piac” helye + a kis falutérkép: piacTer, piacKoppint, piacDelibe, piacVasarba, a háttér)
   a Világkép 8. hullámában (2. kódkör, 2026-11-27) kikerült: a falu ma a világkép közelképeiben él (hely.js, helyek.js).
   Ami maradt, és amit a közelképek használnak:
   A HÁZ ÁLLAPOTA (építés, nem értékelés; sosem romlik vissza — P().piac.haz[id] a legmagasabb elért lépés):
     2 épül (még nem vitte végig) · 3 tető (végigvitte) · 4 ajtó + előtető (egy tiszta nap) · 5 kész: lámpa, cégtábla
     (két tiszta nap) · 6 virágos (megy: tudas.js). A számok a tudás-naplóból jönnek, a gyerek számot nem lát.
   A TÁRGY-NÉZETEK (PC_TARGY + pcValasztoSvg): egy házban több pálya → a ház belseje, a tárgy a bejárat (hely.js helyTargyNezet).
   TERKEP_GAZDA: melyik liget melyik hely lakója (🧺 a Tündérvásár — id-je ma is „vasar” — a régi Piactér lakója volt, 2026-10-24);
   a hely-motor (hely.js) és az újonc-menet (nyitokep.js) ebből tudja, hogy a lakó jelei a gazdánál látszanak. */
var TERKEP_GAZDA = { vasar: "piac" };
function terkepGazda(r) { return TERKEP_GAZDA[r] || r; }
function terkepLakok(g) { return [g].concat(Object.keys(TERKEP_GAZDA).filter(function (r) { return TERKEP_GAZDA[r] === g; })); }
function pcF(n) { return (+n).toFixed(1); }
/* kézzel hullámosított fal (ltFalHaz módján): szélesség ±sz, magasság m, talppont 0 */
function pcFal(sz, m) {
  return 'M' + pcF(-sz) + ' 1Q' + pcF(-sz + .8) + ' ' + pcF(-m / 2) + ' ' + pcF(-sz + .6) + ' ' + pcF(-m) + 'Q0 ' + pcF(-m - 2) + ' ' + pcF(sz - .6) + ' ' + pcF(-m) + 'Q' + pcF(sz + .8) + ' ' + pcF(-m / 2) + ' ' + pcF(sz) + ' 1Q0 3 ' + pcF(-sz) + ' 1Z';
}
/* csíkos, csipkés előtető: x0..x1, y felső él, mely: a csipke mélysége */
function pcEloteto(x0, x1, y, mely, db) {
  var w = (x1 - x0) / db, s = '', i;
  var d = 'M' + pcF(x0 - 2) + ' ' + pcF(y + .8) + 'Q' + pcF((x0 + x1) / 2) + ' ' + pcF(y - 1.6) + ' ' + pcF(x1 + 2) + ' ' + pcF(y + .8) + 'L' + pcF(x1) + ' ' + pcF(y + mely * .6);
  for (i = db; i > 0; i--) d += 'Q' + pcF(x0 + (i - .5) * w) + ' ' + pcF(y + mely * 1.5) + ' ' + pcF(x0 + (i - 1) * w) + ' ' + pcF(y + mely * .6);
  s += '<path d="' + d + 'Z" fill="#f6a5c0" stroke="#b5607e" stroke-width="1.6" stroke-linejoin="round"/>';
  for (i = 0; i < db; i += 2) s += '<path d="M' + pcF(x0 + i * w + w * .1) + ' ' + pcF(y + .4) + 'L' + pcF(x0 + (i + 1) * w - w * .1) + ' ' + pcF(y + .4) + 'L' + pcF(x0 + (i + 1) * w - w * .05) + ' ' + pcF(y + mely * .9) + 'Q' + pcF(x0 + (i + .5) * w) + ' ' + pcF(y + mely * 1.3) + ' ' + pcF(x0 + i * w + w * .05) + ' ' + pcF(y + mely * .9) + 'Z" fill="#fff8f2"/>';
  return s;
}
/* ── a ház állapota (lépés 0–6) ── */
var PIAC_HAZ_TETO = { bolt: ["url(#lt-gTetoR)", "#b5607e"], letra: ["url(#lt-gTetoT)", "#3f8a85"], csalad: ["url(#lt-gTetoM)", "#c9862a"] };
function piacTar(p) { p = p || P(); if (!p.piac || typeof p.piac !== "object") p.piac = {}; if (!p.piac.haz || typeof p.piac.haz !== "object") p.piac.haz = {}; return p.piac; }
function piacHazLepes(id) {
  var pr = P().palyak[id], n = tudasNapok(id), l = 2;
  if (pr && pr.kesz) l = 3;
  if (n >= 1) l = 4;
  if (n >= 2) l = 5;
  if (tudasMegy(id)) l = 6;
  var t = piacTar(), v = Math.max(l, t.haz[id] || 0);
  if (v !== t.haz[id]) { t.haz[id] = v; ment(); }   /* sosem romlik vissza */
  return v;
}
function pcAblakSzin(alszik, eg) { return alszik ? "#7d7896" : eg ? "url(#lt-gAblak)" : "#cfe2f2"; }
function pcAblak(x, y, w, h, fill) {
  return '<path d="M' + pcF(x) + ' ' + pcF(y + h) + 'Q' + pcF(x - .6) + ' ' + pcF(y + h / 2) + ' ' + pcF(x + .4) + ' ' + pcF(y + 3) + 'Q' + pcF(x + w / 2) + ' ' + pcF(y - 1.2) + ' ' + pcF(x + w - .4) + ' ' + pcF(y + 3) + 'Q' + pcF(x + w + .6) + ' ' + pcF(y + h / 2) + ' ' + pcF(x + w) + ' ' + pcF(y + h) + 'Q' + pcF(x + w / 2) + ' ' + pcF(y + h + 1.2) + ' ' + pcF(x) + ' ' + pcF(y + h) + 'Z" fill="' + fill + '" stroke="#8a6a7e" stroke-width="2"/>' +
    '<path d="M' + pcF(x + w / 2) + ' ' + pcF(y + 1) + 'V' + pcF(y + h) + 'M' + pcF(x + 1) + ' ' + pcF(y + h * .52) + 'H' + pcF(x + w - 1) + '" stroke="#8a6a7e" stroke-width="1.3" opacity=".7"/>';
}
/* egy ház a térkép rajzkészletéből: tipus bolt / letra / csalad, lepes 0–6, alszik (újonc: sötét, csukott) */
function piacHaz(tipus, lepes, alszik) {
  var cs = lkCsokkent(), szel = tipus === "letra" ? 52 : 70, mag = tipus === "letra" ? 92 : 62, teto = PIAC_HAZ_TETO[tipus], tetoMag = tipus === "letra" ? 50 : 40;
  var ar = "", kint = "", elol = "", y, i;   /* ar: a firka-szűrős épület · kint: füst, szereplők · elol: a szűrő fölött */
  kint += '<ellipse cx="0" cy="3" rx="' + (szel + 14) + '" ry="9" fill="#3c2a50" opacity=".14"/>';
  if (lepes >= 6 && !alszik) kint += '<ellipse cx="0" cy="-' + (mag / 2) + '" rx="' + (szel + 40) + '" ry="' + (mag + 20) + '" fill="url(#lt-gHalo)" opacity=".5"/>';
  if (lepes >= 3) ar += '<path d="M' + pcF(szel * .42) + ' ' + pcF(-mag - tetoMag * .5) + 'Q' + pcF(szel * .42 - .6) + ' ' + pcF(-mag - tetoMag * .75) + ' ' + pcF(szel * .43) + ' ' + pcF(-mag - tetoMag * .95) + 'Q' + pcF(szel * .42 + 6) + ' ' + pcF(-mag - tetoMag * .98) + ' ' + pcF(szel * .42 + 12) + ' ' + pcF(-mag - tetoMag * .95) + 'Q' + pcF(szel * .42 + 12.6) + ' ' + pcF(-mag - tetoMag * .7) + ' ' + pcF(szel * .42 + 12) + ' ' + pcF(-mag - tetoMag * .3) + 'Z" fill="#c99a8a" stroke="#7a5a6e" stroke-width="1.8"/>';
  var falMag = lepes >= 1 ? mag : mag * .45;
  if (lepes >= 1) ar += '<path d="' + pcFal(szel, falMag) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.2" stroke-linejoin="round"/>';
  else ar += '<path d="M' + (-szel) + ' 1Q' + pcF(-szel + .8) + ' ' + pcF(-falMag / 2) + ' ' + (-szel) + ' ' + pcF(-falMag) + 'L' + pcF(-szel / 3) + ' ' + pcF(-falMag - 6) + 'L' + pcF(szel / 4) + ' ' + pcF(-falMag + 4) + 'L' + szel + ' ' + pcF(-falMag - 3) + 'Q' + pcF(szel + .8) + ' ' + pcF(-falMag / 2) + ' ' + szel + ' 1Q0 3 ' + (-szel) + ' 1Z" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.2" stroke-linejoin="round"/>';
  if (lepes < 3) for (y = -10; y > -falMag + 2; y -= 10) ar += '<path d="M' + (-szel + 3) + ' ' + y + 'Q0 ' + (y - 1.5) + ' ' + (szel - 3) + ' ' + (y + .5) + '" stroke="#e3cfae" stroke-width="1.3" fill="none"/>';
  if (lepes >= 3) {
    var tx = szel + 10, ty = -mag + 2, csucs = -mag - tetoMag;
    if (tipus === "csalad") {   /* mézsárga, csipkés alsó él (mint a Pékség) */
      var d = 'M' + (-tx) + ' ' + ty + 'Q' + pcF(-tx * .9) + ' ' + pcF(csucs + 10) + ' 0 ' + csucs + 'Q' + pcF(tx * .9) + ' ' + pcF(csucs + 10) + ' ' + tx + ' ' + ty;
      for (i = 6; i > 0; i--) d += 'Q' + pcF(-tx + (i - .5) * tx / 3) + ' ' + pcF(ty + 7) + ' ' + pcF(-tx + (i - 1) * tx / 3) + ' ' + ty;
      ar += '<path d="' + d + 'Z" fill="' + teto[0] + '" stroke="' + teto[1] + '" stroke-width="2.2" stroke-linejoin="round"/>';
    } else if (tipus === "letra") {   /* türkiz, magas, csúcsos */
      ar += '<path d="M' + (-tx) + ' ' + ty + 'Q' + pcF(-tx * .5) + ' ' + pcF(csucs + 22) + ' 0 ' + csucs + 'Q' + pcF(tx * .5) + ' ' + pcF(csucs + 22) + ' ' + tx + ' ' + ty + 'Q0 ' + (ty - 5) + ' ' + (-tx) + ' ' + ty + 'Z" fill="' + teto[0] + '" stroke="' + teto[1] + '" stroke-width="2.2" stroke-linejoin="round"/>';
    } else {   /* rózsaszín, ívelt (mint a Szabóműhely) */
      ar += '<path d="M' + (-tx) + ' ' + ty + 'Q' + pcF(-tx * .42) + ' ' + pcF(csucs + 14) + ' 0 ' + csucs + 'Q' + pcF(tx * .42) + ' ' + pcF(csucs + 14) + ' ' + tx + ' ' + ty + 'Q0 ' + (ty - 6) + ' ' + (-tx) + ' ' + ty + 'Z" fill="' + teto[0] + '" stroke="' + teto[1] + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }
    ar += '<path d="M' + pcF(-szel * .3) + ' ' + pcF(csucs + tetoMag * .45) + 'Q' + pcF(-szel * .12) + ' ' + pcF(csucs + tetoMag * .22) + ' ' + pcF(szel * .1) + ' ' + pcF(csucs + tetoMag * .2) + '" stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>';
    if (lepes >= 5 && !alszik && !cs) [0, 1.3].forEach(function (k) { var fx = szel * .42 + 6, fy = -mag - tetoMag; kint += '<circle cx="' + pcF(fx) + '" cy="' + pcF(fy) + '" r="5" fill="#fff" opacity="0">' + ltAnim("cy", pcF(fy) + ";" + pcF(fy - 32), "2.6s", ' begin="' + k + 's"') + ltAnim("r", "4;9", "2.6s", ' begin="' + k + 's"') + ltAnim("opacity", "0;.75;0", "2.6s", ' begin="' + k + 's"') + '</circle>'; });
  } else if (lepes >= 2) {   /* tetőgerendák */
    ar += '<path d="M' + (-szel - 6) + ' ' + (-mag) + 'Q' + pcF(-szel * .45) + ' ' + pcF(-mag - tetoMag * .62) + ' 0 ' + (-mag - tetoMag + 4) + 'Q' + pcF(szel * .45) + ' ' + pcF(-mag - tetoMag * .62) + ' ' + (szel + 6) + ' ' + (-mag) + 'M' + pcF(-szel / 2) + ' ' + pcF(-mag - tetoMag * .45) + 'Q0 ' + pcF(-mag - tetoMag * .5) + ' ' + pcF(szel / 2) + ' ' + pcF(-mag - tetoMag * .44) + '" fill="none" stroke="#b08a68" stroke-width="3" stroke-linecap="round"/>';
  }
  if (lepes < 3) ar += '<path d="M' + (-szel - 12) + ' 2Q' + (-szel - 13) + ' ' + pcF(-mag / 2) + ' ' + (-szel - 11) + ' ' + (-mag - 10) + 'M' + (szel + 12) + ' 2Q' + (szel + 13) + ' ' + pcF(-mag / 2) + ' ' + (szel + 11) + ' ' + (-mag - 10) + 'M' + (-szel - 16) + ' ' + pcF(-mag * .5) + 'Q0 ' + pcF(-mag * .5 - 2) + ' ' + (szel + 16) + ' ' + pcF(-mag * .5) + 'M' + (-szel - 12) + ' -4L' + (-szel + 12) + ' ' + pcF(-mag * .5) + '" stroke="#b08a68" stroke-width="3" stroke-linecap="round" fill="none"/>' +
    '<g transform="translate(' + (szel + 22) + ' 0)"><rect x="-10" y="-8" width="9" height="6" rx="1" fill="#e8a77a" stroke="#a5623a" stroke-width="1"/><rect x="0" y="-8" width="9" height="6" rx="1" fill="#e8a77a" stroke="#a5623a" stroke-width="1"/><rect x="-5" y="-14" width="9" height="6" rx="1" fill="#e8a77a" stroke="#a5623a" stroke-width="1"/></g>';
  var ajtoKeret = function (x0, x1, h, fill) { var m = (x0 + x1) / 2; return '<path d="M' + x0 + ' 1.5V' + pcF(-h + 8) + 'Q' + x0 + ' ' + (-h) + ' ' + m + ' ' + (-h) + 'Q' + x1 + ' ' + (-h) + ' ' + x1 + ' ' + pcF(-h + 8) + 'V1.5Z" fill="' + fill + '" stroke="#8a6a7e" stroke-width="2"/>'; };
  if (tipus === "bolt") {
    if (lepes >= 2) ar += pcAblak(-50, -46, 42, 30, pcAblakSzin(alszik, lepes >= 5));
    if (lepes >= 4 && !alszik) ar += '<path d="M-48 -20Q-29 -23 -10 -20V-17H-48Z" fill="#c99272" stroke="#8a5a3a" stroke-width="1.2"/><circle cx="-41" cy="-23" r="4" fill="#e8505b" stroke="#a83a44" stroke-width="1"/><circle cx="-32" cy="-23" r="4" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1"/><path d="M-24 -19h9l-1.5 -7h-6z" fill="#f5b942" stroke="#a8741c" stroke-width="1"/>';
    if (lepes >= 4) ar += pcEloteto(-56, -2, -54, 7, 8);
    if (lepes >= 4) {
      ar += ajtoKeret(8, 36, 42, alszik ? "#c99272" : "#6e4a6e");
      if (!alszik) elol += '<path class="pc-ajto" d="M8 1.5V-34Q8 -42 15 -42V5Z" fill="#c99272" stroke="#8a6a7e" stroke-width="1.6"/>';
      else ar += '<circle cx="31" cy="-16" r="2" fill="#6e4a36"/>';
    } else ar += '<path d="M8 1.5V-34H36V1.5Z" fill="#4a3b5a" opacity=".45"/>';
    if (lepes >= 5) kint += '<g transform="translate(' + (-szel - 4) + ' -60)"><path d="M0 -4H-14" stroke="#6e4a36" stroke-width="2"/><path d="M-14 -4V2" stroke="#6e4a36" stroke-width="1.4"/><g transform="translate(-30 2) scale(.32)">' + fgFej(FIG_RAJZ.tuske, "vidam") + '</g></g>';
    if (lepes >= 6) {
      ar += '<g transform="translate(-29 -12)"><path d="M-22 0Q0 -1.5 22 0L21 8Q0 9 -21 8Z" fill="#c99272" stroke="#8a5a3a" stroke-width="1.4"/></g>';
      elol += '<g transform="translate(-29 -12)">' + [-15, -5, 5, 15].map(function (x, i) { return ltRozsa(x, -2, 4.2, ["#f2708f", "#fce49a", "#c9a8e6", "#f6a5c0"][i]); }).join("") + '</g>';
      kint += '<g transform="translate(46 -6) scale(.36)"><g transform="translate(-60 -150)">' + fgAlak(FIG_RAJZ.tuske, "ujjong") + '</g></g>';
    }
  } else if (tipus === "letra") {
    if (lepes >= 2) ar += pcAblak(-14, -84, 28, 22, pcAblakSzin(alszik, lepes >= 5)) + pcAblak(-14, -54, 28, 22, pcAblakSzin(alszik, lepes >= 5));
    ar += '<path d="M' + (szel + 4) + ' 2Q' + (szel - 1) + ' ' + pcF(-mag / 2) + ' ' + (szel - 6) + ' ' + (-mag - 6) + 'M' + (szel + 16) + ' 2Q' + (szel + 11) + ' ' + pcF(-mag / 2) + ' ' + (szel + 6) + ' ' + (-mag - 6) + '" stroke="#b08a68" stroke-width="3" stroke-linecap="round" fill="none"/>';
    for (var r = 0; r < 7; r++) { var yy = -6 - r * 14; ar += '<path d="M' + pcF(szel + 4 - r * 1.4) + ' ' + yy + 'H' + pcF(szel + 16 - r * 1.4) + '" stroke="#b08a68" stroke-width="2.4" stroke-linecap="round"/>'; }
    ar += ajtoKeret(-10, 10, 28, alszik ? "#c99272" : "#9a7bc0");
  } else {
    if (lepes >= 2) [[-44, -50], [-12, -50], [-44, -24], [-12, -24]].forEach(function (p, i) { ar += pcAblak(p[0], p[1], 24, 18, pcAblakSzin(alszik, lepes >= 5 || i < lepes - 1)); });
    ar += ajtoKeret(20, 48, 38, alszik ? "#c99272" : "#7fb2e8");
    elol += '<g transform="translate(-18 8)">' + [["8", -14], ["5", 0], ["13", 15]].map(function (k) { return '<g transform="translate(' + k[1] + ' 0)"><ellipse rx="7" ry="5" fill="#d9cbe6" stroke="#7a5ea8" stroke-width="1.2"/><text y="3" text-anchor="middle" font-size="7" font-family="Fredoka" font-weight="600" fill="#4a3b7a">' + k[0] + '</text></g>'; }).join("") + '</g>';
  }
  return '<g' + (alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '>' + kint + '<g filter="url(#lt-firka)">' + ar + '</g>' + elol + '</g>';
}

/* ── a régi falutérkép házai (a receptek ezt nézik: receptek.js; a hely-készlet: palyahely.js) ── */
var PIAC_HAZAK = {
  dallam: { x: 62, y: 246, nev: "Dallam-tér", k: .8 },
  vasar:  { x: 136, y: 352, nev: "Tündérvásár", k: 1.15, liget: "vasar" },   /* 🧺 beköltözött (2026-10-24): a sátorban a Vásár pályái (kártyák) */
  zsib:   { x: 548, y: 262, nev: "Zsivány zsibvására", tipus: "zsib", k: 1 },   /* 🦊 a volt üres telken (zsib.js; recept-lap 1A) */
  csalad: { x: 748, y: 238, nev: "Számcsalád", tipus: "csalad", k: .66 },   /* 🏡 a C körben nyílik (még épül) */
  letra:  { x: 640, y: 300, nev: "Rokon-létra", tipus: "letra", k: .8, palya: "rokon-letra" },   /* 🪜 Pálya-hely B kör (letra.js) */
  bolt:   { x: 290, y: 322, nev: "Tüske néni boltja", tipus: "bolt", k: 1.1, palya: "tuske-bolt", ceger: .7 },   /* a cégér kisebb (11-10): ne takarja a dombon Garas tornyát */   /* a cégér óta kicsit jobbra (a sátor cégére ne lógjon rá) */
  irasbeli: { x: 238, y: 134, nev: "Garas tornya", tipus: "irasbeli", k: .5 },   /* ✍️ a domboldalon, a Déli vásár mellett (irasbeli.js; recept-lap 7. döntés A) — a dombság csírája */
  szalag: { x: 408, y: 152, nev: "Szalagműhely", tipus: "szalag", k: .5 },   /* 🎀 a Piactér közepén fent, a domb lábánál (szalag.js; tervlap 3. döntés A) */
  josda: { x: 694, y: 110, nev: "Jósda", tipus: "josda", k: .42 }   /* 🔭 a dombra vivő ösvény elején, Garas tornyával szemben (josda.js; tervlap 2. döntés A) */
};
/* a Tündérvásár sátra (a régi ligettérkép jelképe; a 8. hullámban ide költözött — a tárgy-nézet sátra, PC_TARGY.vasar, ebből épül) */
function pcVasarJelkep() { return ltArnyek(44) +
  '<path d="M-30 1L-29 -36L29 -36L30 1Z" fill="#fff4e4" stroke="#b5607e" stroke-width="2"/>' +
  '<path d="M-9 1L0 -30L9 1Z" fill="#7a5ea8" opacity=".55"/>' +
  '<path d="M-36 -34Q-18 -58 0 -70Q18 -58 36 -34Q30 -28 24 -34Q18 -28 12 -34Q6 -28 0 -34Q-6 -28 -12 -34Q-18 -28 -24 -34Q-30 -28 -36 -34Z" fill="#fff4e4" stroke="#b5607e" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M0 -70L-24 -34Q-18 -28 -12 -34ZM0 -70L0 -34Q6 -28 12 -34ZM0 -70L24 -34Q30 -28 36 -34Q30 -42 24 -48Z" fill="#f6a5c0" opacity=".9"/>' +
  '<path d="M0 -70V-84" stroke="#6e4a36" stroke-width="1.8"/>' +
  '<path d="M0 -84Q7 -86 13 -82Q7 -78 0 -78Z" fill="#9ec9f0" stroke="#5f84b0" stroke-width="1">' + ltAnim("d","M0 -84Q7 -86 13 -82Q7 -78 0 -78Z;M0 -84Q7 -81 13 -83Q7 -77 0 -78Z;M0 -84Q7 -86 13 -82Q7 -78 0 -78Z","1.6s") + '</path>' +
  '<path d="M36 -34Q42 -30 44 -24" stroke="#6e4a36" stroke-width="1.4" fill="none"/>' +
  '<path d="M44 -42V1" stroke="#6e4a36" stroke-width="2.2" stroke-linecap="round"/><path d="M31 -40Q38 -34 44 -40" stroke="#6e4a36" stroke-width="1" fill="none"/>' +
  '<path d="M33 -39l2 5l2 -5zM38 -37l2 5l2 -5z" fill="#fce49a" stroke="#d1a23a" stroke-width=".6"/>' +
  '<path d="M-28 -2Q-28 -12 -18 -12Q-8 -12 -8 -2Z" fill="#e8b27a" stroke="#8a5a3a" stroke-width="1.4"/><path d="M-26 -8H-10" stroke="#8a5a3a" stroke-width="1"/>' +
  '<circle cx="-22" cy="-14" r="3.6" fill="#f2708f"/><circle cx="-16" cy="-15" r="3.4" fill="#fce49a"/><circle cx="-13" cy="-12.5" r="2.8" fill="#a7d99a"/>';
}
/* 🧺 a Tündérvásár sátra (a tárgy-nézetben, PC_TARGY.vasar): a jelkép nagyobban, ládákkal, kosárral; alszik = újonc-köd / pult-zár */
function pcVasarSator(alszik, vil) {
  var s = '<g' + (alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '>', cs = lkCsokkent();
  s += '<ellipse cx="0" cy="3" rx="62" ry="9" fill="#3c2a50" opacity=".14"/>';
  if (vil) s += '<ellipse cx="0" cy="-40" rx="80" ry="66" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".55;1;.55", "2.4s")) + '</ellipse>';
  s += '<g filter="url(#lt-firka)">';
  /* gyümölcsös láda a sátor mellett (jobbra a zászlórúd; onnan semmi ne lógjon a bolt nevére) */
  s += '<g transform="translate(-46 0)"><rect x="-12" y="-14" width="24" height="15" rx="2" fill="#e8b27a" stroke="#8a5a3a" stroke-width="1.6"/><path d="M-12 -7H12M-4 -14V1M4 -14V1" stroke="#b5804a" stroke-width="1"/>' +
       '<circle cx="-6" cy="-17" r="4" fill="#e8505b" stroke="#a83a44" stroke-width="1"/><circle cx="2" cy="-18" r="4" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1"/><circle cx="8" cy="-16" r="3.4" fill="#fce49a" stroke="#d1a23a" stroke-width="1"/></g>';
  s += '</g><g transform="scale(1.05)">' + pcVasarJelkep() + '</g></g>';
  return s;
}
function pcRezeg(g) {
  var rz = g && g.querySelector(".pc-rezeg"); if (!rz || !rz.animate || lkCsokkent()) return;
  rz.animate([{ transform: "translateX(0)" }, { transform: "translateX(4px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }], { duration: 260, iterations: 2 });
}
/* ═════════ 💰 TÖBB PÁLYA EGY HELYEN (Zsivány standja: Zsibvásár + Fizess pontosan; recept-lap 1A) ═════════
   A hely cégére a pályák közös jeleit mutatja (pcTobbJel). Koppintásra az unikornis odasétál, és a stand fölött kinyílik a pályák kártyája
   (ikon, név, állapot, 🔔 csengő). Kártya = indul; mellé koppintás = becsukja. A pályák jelei egyenként a palyaJelek-ből (palyahely.js). */
function pcTobbJel(lista) {
  var Js = lista.map(palyaJelek), ebren = Js.filter(function (j) { return !j.alszik; }), nyitva = ebren.filter(function (j) { return !j.zarva; });
  var any = function (k) { return Js.some(function (j) { return j[k]; }); };
  var J = { kesz: Js.every(function (j) { return j.kesz; }), arany: Js.every(function (j) { return j.arany; }), alszik: !ebren.length, zarva: !nyitva.length,
            napiAktiv: any("napiAktiv"), ajanlott: any("ajanlott"), sarkany: any("sarkany"), vil: any("vil"), ertek: Math.max.apply(null, Js.map(function (j) { return j.ertek || 0; })) };
  J.all = J.alszik ? "alszik" : J.zarva ? "zarva" : J.arany ? "arany" : J.kesz ? "kesz" : "";
  J.cetli = "⭐ " + Js.filter(function (j) { return j.kesz; }).length + "/" + Js.length;
  return J;
}
/* 🔍 több pálya egy helyen (Zsivány standja): NEM kártyák (a producer, 11-08: „ne kártya legyen a pályaválasztó”), hanem a hely
   KÖZELKÉPE, és a tárgy maga a bejárat — a kacatpolc = Zsibvásár, a kassza = Fizess pontosan. Bővítés: egy új sor a PC_TARGY-ban
   (a tárgy helye a hely saját rajzán + a cégér helye és nagysága + a kimondott szó); amelyik pályának nincs sora, annak a cégére a kép alján áll.
   kep(): a hely nagy rajza a saját koordinátáiban; k, tx, ty: hová kerül a közelképen (800 × 460). */
var PC_TARGY = {
  vasar: {   /* 🧺 a Tündérvásár sátra (3. kör, 4. döntés A): a kosár = Reggeli vásár, a dobozok = Dobozoló-nap — a kártyás belső helyett */
    kep: function () {
      return '<g transform="translate(400 330) scale(2.1)">' + pcVasarSator(false, false) + '</g>' +
        '<g transform="translate(220 360)" filter="url(#lt-firka)"><path d="M-62 0Q-70 -66 0 -70Q70 -66 62 0Z" fill="#e8b27a" stroke="#8a5a3a" stroke-width="4"/><path d="M-52 -58Q0 -140 52 -58" fill="none" stroke="#8a5a3a" stroke-width="6"/>' +
        '<path d="M-56 -36H56M-60 -16H60" stroke="#b5804a" stroke-width="2.5"/><circle cx="-22" cy="-76" r="15" fill="#e8505b" stroke="#a83a44" stroke-width="2"/><circle cx="10" cy="-80" r="15" fill="#fce49a" stroke="#d1a23a" stroke-width="2"/><circle cx="34" cy="-72" r="13" fill="#a7d99a" stroke="#5f8e6a" stroke-width="2"/></g>' +
        '<g transform="translate(590 362)" filter="url(#lt-firka)"><rect x="-74" y="-60" width="72" height="60" fill="#e9c9a0" stroke="#8a5a3a" stroke-width="4"/><rect x="4" y="-48" width="64" height="48" fill="#f2d5ae" stroke="#8a5a3a" stroke-width="4"/>' +
        '<rect x="-48" y="-112" width="66" height="52" fill="#f2d5ae" stroke="#8a5a3a" stroke-width="4"/><path d="M-74 -30H-2M4 -24H68M-48 -86H18" stroke="#b5804a" stroke-width="3"/></g>';
    }, k: 1, tx: 0, ty: 0,
    t: { "vasar-3":  { hely: [140, 250, 160, 120], ceger: [220, 410, .95], szo: "a kosarat" },
         "vasar-3d": { hely: [500, 236, 180, 136], ceger: [590, 410, .95], szo: "a dobozokat" } }
  },
  zsib: {
    kep: function () { return zsStand(false, true); }, k: .8, tx: -24, ty: 44,
    t: { "zsibvasar":       { hely: [414, 150, 280, 72], ceger: [614, 176, .78], szo: "a kacatokat" },
         "fizess-pontosan": { hely: [474, 246, 172, 92], ceger: [560, 352, .95], szo: "a kasszát" } }
  },
  irasbeli: {   /* ✍️ Garas tornya: lent (kő) a szorzás, fent (fa) az osztás — recept-lap 2. döntés A */
    kep: function () { return '<defs>' + GA_DEFS + '</defs>' + gaTorony("folyik", 5); }, k: 1.05, tx: 295, ty: 46,
    t: { "irasbeli-szorzas": { hely: [42, 228, 116, 136], ceger: [-70, 270, .95], szo: "a szorzást lent" },
         "irasbeli-osztas":  { hely: [52, 118, 96, 104], ceger: [260, 165, .95], szo: "az osztást fent" } }
  }
};
/* ═════════ 🧵🧪🧁 A Kézművesek műhelyei (4. kör, terv: Matekos\vilagkep-4-kor-kezmuvesek.html 2. pont, ✅ 2026-11-24) ═════════
   A műhely belseje, a tárgyak NEM sorban, hanem a helyükön (asztal, polc, tűzhely, föld): a kicsi az asztalon, a legnagyobb a földön.
   A fal és a padló a pálya belsejének színe (MK_FAL, meres-mozgo.js), így a belépés folytonos. A cégér 4 tárgynál kisebb (.8). */
function pcMuhelyFal(tipus) {   /* a kártya (30,14 – 770,446) kitöltve a műhely falával, csíkokkal és padlóval */
  var T = MK_FAL[tipus], cs = "", x;
  for (x = 52; x < 770; x += 44) cs += '<rect x="' + x + '" y="16" width="5" height="364" fill="' + T.csik + '"/>';
  return '<defs><linearGradient id="pc-fal-' + tipus + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + T.fal1 + '"/><stop offset="1" stop-color="' + T.fal2 + '"/></linearGradient></defs>' +
    '<rect x="30" y="14" width="740" height="432" rx="22" fill="url(#pc-fal-' + tipus + ')"/>' + cs +
    '<path d="M30 380H770V424Q770 446 748 446H52Q30 446 30 424Z" fill="' + T.padlo + '"/><path d="M30 380H770" stroke="' + T.padlo2 + '" stroke-width="4"/>' +
    '<rect x="30" y="14" width="740" height="432" rx="22" fill="none" stroke="#c9ad85" stroke-width="3"/>';
}
function pcMeh(x, y, utvonal, dur) {   /* repkedő méh (a mézesbödön körül) */
  return '<g transform="translate(' + x + ' ' + y + ')"><g><animateTransform attributeName="transform" type="translate" values="' + utvonal + '" dur="' + dur + '" repeatCount="indefinite"/>' +
    '<ellipse rx="8" ry="6" fill="#f2c14e" stroke="#5a4a7a" stroke-width="1.5"/><path d="M-2 -5v10M3 -5v10" stroke="#5a4a7a" stroke-width="1.5"/><ellipse cy="-8" rx="6" ry="4" fill="#fff" opacity=".8"/></g></g>';
}
PC_TARGY.szabo = {   /* ✂️ Szabóműhely: mérőszalag + tűpárna az asztalon, szövetvég a polcon, a nagy orsó a földön (a szalag végigfut a padlón) */
  kep: function () {
    return pcMuhelyFal("szabo") + '<g stroke="#5a4a7a" stroke-width="2.5" stroke-linejoin="round" filter="url(#lt-firka)">' +
      /* díszlet: ablak, próbababa */
      '<rect x="420" y="50" width="130" height="110" rx="8" fill="#e9f4fb"/><path d="M485 50V160M420 105H550" stroke-width="2"/>' +
      '<g transform="translate(110 400)"><path d="M0 0V-40M-16 0H16" stroke="#8a6a4a" stroke-width="4"/><path d="M-26 -40Q-34 -110 -20 -130Q0 -142 20 -130Q34 -110 26 -40Z" fill="#f4a6c8"/><path d="M-20 -100Q0 -92 20 -100" stroke="#fff" stroke-width="3" fill="none"/><circle cy="-146" r="12" fill="#d8b48a"/></g>' +
      /* fali polc: a szövetvég (3) */
      '<path d="M180 190H420" stroke="#8a6a4a" stroke-width="8"/><path d="M200 190l14 22M400 190l-14 22" stroke="#8a6a4a" stroke-width="5"/>' +
      '<g transform="translate(300 158)"><ellipse cx="-90" rx="12" ry="30" fill="#c9a8e6"/><path d="M-90 -30H90V30H-90" fill="#c9a8e6"/><ellipse cx="90" rx="12" ry="30" fill="#b593d8"/><ellipse cx="90" rx="4" ry="9" fill="#8a6a4a"/><path d="M-76 -14H80M-76 0H80M-76 14H80" stroke="#fff" stroke-width="3" opacity=".6"/>' +
      '<path d="M-90 30Q-104 60 -96 90" stroke="#c9a8e6" stroke-width="14" fill="none">' + ltAnim("d", "M-90 30Q-104 60 -96 90;M-90 30Q-96 62 -106 88;M-90 30Q-104 60 -96 90", "3.4s") + '</path></g>' +
      /* szabóasztal: elöl balra a mérőszalag (1), hátul jobbra a tűpárna (2) */
      '<path d="M230 282H620V298H230Z" fill="#c99a6a"/><path d="M250 298V380M600 298V380" stroke="#8a6a4a" stroke-width="10"/><path d="M230 298H620V330H230Z" fill="#d8b48a"/>' +
      '<g transform="translate(300 274)"><circle r="20" fill="#fce49a"/><circle r="7" fill="#d1a23a"/><path d="M16 8Q50 14 74 6" stroke="#fce49a" stroke-width="10" fill="none" stroke-linecap="round">' + ltAnim("d", "M16 8Q50 14 74 6;M16 8Q46 4 74 10;M16 8Q50 14 74 6", "2.6s") + '</path></g>' +
      '<g transform="translate(540 270)"><path d="M-30 0Q-36 -38 0 -40Q36 -38 30 0Z" fill="#e8505b"/><path d="M0 -40V0M-17 -35Q-22 -16 -17 0M17 -35Q22 -16 17 0" stroke="#a83a44" stroke-width="2" fill="none"/><g stroke="#8a8aa6" stroke-width="2.5"><path d="M-8 -40l-8 -24M6 -40l6 -26M18 -34l16 -18"/></g><g fill="#fce49a" stroke-width="1.5"><circle cx="-16" cy="-66" r="5"/><circle cx="12" cy="-68" r="5"/><circle cx="34" cy="-54" r="5"/></g></g>' +
      /* a földön: a nagy szalagorsó (4), a szalag végigfut a padlón */
      '<g transform="translate(700 410)"><rect x="-46" y="-196" width="92" height="18" rx="6" fill="#c99a6a"/><rect x="-46" y="-12" width="92" height="18" rx="6" fill="#c99a6a"/><rect x="-32" y="-178" width="64" height="166" fill="#f4a6c8"/><path d="M-32 -148H32M-32 -118H32M-32 -88H32M-32 -58H32M-32 -28H32" stroke="#fff" stroke-width="3" opacity=".6"/></g>' +
      '<path d="M668 400Q600 430 520 414Q440 400 380 424" stroke="#f4a6c8" stroke-width="14" fill="none" stroke-linecap="round">' + ltAnim("d", "M668 400Q600 430 520 414Q440 400 380 424;M668 400Q600 420 520 424Q440 410 380 420;M668 400Q600 430 520 414Q440 400 380 424", "3s") + '</path></g>';
  }, k: 1, tx: 0, ty: 0,
  t: { "meres-szabo-1": { hely: [266, 244, 114, 50],  ceger: [320, 318, .8], szo: "a mérőszalagot" },
       "meres-szabo-2": { hely: [500, 196, 90, 80],   ceger: [530, 318, .8], szo: "a tűpárnát" },
       "meres-szabo-3": { hely: [196, 118, 218, 84],  ceger: [300, 226, .8], szo: "a szövetet" },
       "meres-szabo-4": { hely: [644, 206, 112, 216], ceger: [680, 188, .8], szo: "az orsót" } }
};
PC_TARGY.bajital = {   /* 🧪 Bájitalkonyha: mérőpohár a munkaasztalon, cseppentős üvegcse a polcon, üst a tűzhelyen, hordó a sarokban */
  kep: function () {
    var bub = function (cx, r, kesl) { return '<circle cx="' + cx + '" cy="-94" r="' + r + '">' + ltAnim("cy", "-88;-130", "2s", ' begin="' + kesl + 's"') + ltAnim("opacity", "1;0", "2s", ' begin="' + kesl + 's"') + '</circle>'; };
    return pcMuhelyFal("bajital") + '<g stroke="#5a4a7a" stroke-width="2.5" stroke-linejoin="round" filter="url(#lt-firka)">' +
      /* fali polc üvegekkel: köztük a cseppentős üvegcse (2) */
      '<path d="M70 150H320" stroke="#8a6a4a" stroke-width="8"/><path d="M90 150l14 22M300 150l-14 22" stroke="#8a6a4a" stroke-width="5"/>' +
      '<path d="M96 146v-34h18v34z" fill="#a7d99a" opacity=".8"/><path d="M130 146q-10 -24 6 -30v-10h8v10q16 6 6 30z" fill="#f6a5c0" opacity=".8"/>' +
      '<g transform="translate(250 146)"><path d="M-22 0Q-30 -36 -6 -44V-62H6V-44Q30 -36 22 0Z" fill="#c9a8e6"/><path d="M-10 -62h20v-10q-10 -12 -20 0z" fill="#e8505b"/><path d="M-20 -14Q0 -6 20 -14L22 0H-22Z" fill="#7a5cd6" stroke="none"/></g>' +
      '<g transform="translate(286 170)"><path d="M0 0q-6 10 0 13q6 -3 0 -13z" fill="#8fd3e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" values="0 -10;0 40" dur="1.6s" repeatCount="indefinite"/>' + ltAnim("opacity", "1;1;0", "1.6s") + '</path></g>' +
      /* munkaasztal: a mérőpohár (1) és egy mozsár */
      '<path d="M70 290H330V304H70Z" fill="#c99a6a"/><path d="M86 304V380M314 304V380" stroke="#8a6a4a" stroke-width="10"/>' +
      '<g transform="translate(140 290)"><path d="M-22 0h44l6 -64h-56z" fill="#e8f6fa"/><path d="M-24 -26h48l-2 26h-44z" fill="#8fd3e0" stroke="none"/><path d="M-22 0h44l6 -64h-56z" fill="none"/><path d="M12 -50h10M14 -36h8M14 -22h8" stroke-width="2"/></g>' +
      '<g transform="translate(260 290)"><path d="M-22 0Q-26 -30 0 -30Q26 -30 22 0Z" fill="#b9b0c8"/><path d="M6 -26l20 -26" stroke="#8a6a4a" stroke-width="6" stroke-linecap="round"/></g>' +
      /* a tűzhely: a láng fölött lóg az üst (3) */
      '<path d="M400 380V150Q400 100 450 100H580Q630 100 630 150V380" fill="#d9cbb4"/><path d="M430 380V210Q430 180 460 180H570Q600 180 600 210V380" fill="#4a3a4e"/>' +
      '<path d="M515 100V40M490 40H540" stroke="#6e5a4a" stroke-width="6"/><path d="M515 180V236" stroke="#5a4a7a" stroke-width="3"/>' +
      '<g transform="translate(515 320)"><path d="M-60 -10Q-70 -84 0 -84Q70 -84 60 -10Z" fill="#5a5a6e"/><ellipse cy="-82" rx="56" ry="12" fill="#8fd3e0"/>' +
      '<path d="M-30 50q10 -26 20 0q10 -26 20 0q10 -26 20 0" fill="#f2a24e" stroke="#c96a2a">' + ltAnim("opacity", "1;.75;1", ".9s") + '</path><g fill="#bfeaf0" stroke-width="1.5">' + bub(-18, 7, 0) + bub(14, 5, .9) + bub(-2, 4, 1.5) + '</g></g>' +
      /* a sarokban a földön: a nagy hordó (4) csappal */
      '<g transform="translate(704 410)"><path d="M-52 0Q-66 -90 -52 -180H52Q66 -90 52 0Z" fill="#c99a6a"/><path d="M-58 -36H58M-62 -90H62M-58 -144H58" stroke="#6e4a36" stroke-width="6"/><rect x="-62" y="-60" width="16" height="10" fill="#8a6a4a"/></g></g>';
  }, k: 1, tx: 0, ty: 0,
  t: { "meres-bajital-1": { hely: [104, 216, 76, 80],   ceger: [200, 326, .8], szo: "a mérőpoharat" },
       "meres-bajital-2": { hely: [218, 64, 70, 90],    ceger: [200, 194, .8], szo: "az üvegcsét" },
       "meres-bajital-3": { hely: [444, 214, 142, 160], ceger: [515, 410, .8], szo: "az üstöt" },
       "meres-bajital-4": { hely: [636, 222, 132, 196], ceger: [690, 196, .8], szo: "a hordót" } }
};
PC_TARGY.pekseg = {   /* 🍯 Mézes pékség: mérleg + sótartó a pulton, mézesbödön a polcon, liszteszsákok a földön, az ajtó mellett (a malom felől) */
  kep: function () {
    var pereg = function (cx, r, kesl) { return '<circle cx="' + cx + '" cy="-20" r="' + r + '">' + ltAnim("cy", "-30;-2", "1.8s", ' begin="' + kesl + 's"') + '</circle>'; };
    return pcMuhelyFal("pekseg") + '<g stroke="#5a4a7a" stroke-width="2.5" stroke-linejoin="round" filter="url(#lt-firka)">' +
      /* díszlet: ablak, ajtó a malom felé */
      '<rect x="300" y="50" width="140" height="110" rx="8" fill="#e9f4fb"/><path d="M370 50V160M300 105H440" stroke-width="2"/>' +
      '<path d="M50 380V140Q50 110 80 110H150Q180 110 180 140V380" fill="#a8764f" opacity=".55"/>' +
      /* az ajtó mellett a földön: liszteszsákok a malomból (4) */
      '<g transform="translate(150 410)"><path d="M-100 0Q-108 -84 -72 -98Q-48 -106 -32 -90Q-16 -64 -20 0Z" fill="#f4ecdc"/><path d="M-16 0Q-22 -90 18 -102Q50 -108 62 -88Q78 -56 72 0Z" fill="#efe3cc"/><path d="M-70 -92Q-66 -180 -22 -190Q18 -198 28 -176Q44 -134 32 -96Q-12 -84 -70 -92Z" fill="#f7efe0"/><path d="M-36 -186q4 -14 14 -12M18 -100q6 -12 16 -8" stroke-width="2" fill="none"/><g fill="#fff" stroke="none" opacity=".7"><circle cx="-50" cy="-40" r="3"/><circle cx="20" cy="-50" r="3"/><circle cx="-10" cy="-140" r="3"/></g></g>' +
      /* a pult: balra a mérleg a cipóval (1), jobbra hátrébb a sótartó (2) a tészta mellett */
      '<path d="M250 270H600V380H250Z" fill="#d8b48a"/><path d="M240 262H610V276H240Z" fill="#c99a6a"/><path d="M250 320H600" stroke="#b5804a" stroke-width="2"/>' +
      '<g transform="translate(330 262)"><path d="M-36 0h72l-10 -20h-52z" fill="#e9c9a0"/><path d="M0 -20V-50" stroke-width="4"/><path d="M-48 -50H48" stroke-width="4"/><path d="M-60 -50q14 18 28 0M32 -50q14 18 28 0" fill="#f2d5ae"/><ellipse cx="-46" cy="-58" rx="15" ry="9" fill="#e0a85e"/></g>' +
      '<g transform="translate(470 258)"><ellipse cx="40" cy="-4" rx="40" ry="12" fill="#f7efe0"/><ellipse cx="40" cy="-12" rx="30" ry="12" fill="#f4e4c4"/></g>' +
      '<g transform="translate(468 252)"><rect x="-14" y="-40" width="28" height="40" rx="8" fill="#fffaf0"/><path d="M-14 -40Q0 -58 14 -40" fill="#e9e3f3"/><g fill="#fff" stroke="#c9c3d8" stroke-width="1">' + pereg(24, 2.5, 0) + pereg(30, 2, .6) + pereg(20, 2, 1.2) + '</g></g>' +
      /* fali polc jobbra fent: a mézesbödön (3) befőttesüvegek közt, méhek */
      '<path d="M520 180H750" stroke="#8a6a4a" stroke-width="8"/><path d="M540 180l14 22M730 180l-14 22" stroke="#8a6a4a" stroke-width="5"/>' +
      '<path d="M690 176v-34q0 -6 6 -6h28q6 0 6 6v34z" fill="#f6a5c0" opacity=".75"/><path d="M540 176v-26q0 -5 5 -5h22q5 0 5 5v26z" fill="#a7d99a" opacity=".75"/>' +
      '<g transform="translate(630 176)"><path d="M-44 0Q-54 -74 0 -78Q54 -74 44 0Z" fill="#f2c14e"/><path d="M-36 -64H36" stroke="#9a6a3a" stroke-width="7"/><path d="M-30 -76Q-22 -54 -16 -66Q-10 -48 -4 -70" fill="#f7d47a" stroke="#c99a2a" stroke-width="2"/><path d="M-16 -34h32v20h-32z" fill="#fffaf0" stroke-width="2"/></g></g>' +
      pcMeh(570, 86, "0 0;16 -10;30 0;16 10;0 0", "3s") + pcMeh(680, 92, "0 0;-12 -12;-20 4;0 0", "2.6s");
  }, k: 1, tx: 0, ty: 0,
  t: { "meres-pekseg-1": { hely: [262, 194, 136, 74],  ceger: [330, 300, .8], szo: "a mérleget" },
       "meres-pekseg-2": { hely: [444, 196, 60, 62],   ceger: [500, 350, .8], szo: "a sótartót" },
       "meres-pekseg-3": { hely: [574, 86, 112, 96],   ceger: [630, 222, .8], szo: "a mézesbödönt" },
       "meres-pekseg-4": { hely: [44, 214, 180, 200],  ceger: [120, 426, .8], szo: "a zsákokat" } }
};
/* a tárgy-nézet rajza (800 × 460): a közelképek (hely.js helyTargyNezet) használják */
function pcValasztoSvg(id, lista) {
  var D = PC_TARGY[id] || { kep: function () { return ""; }, k: 1, tx: 0, ty: 0, t: {} }, F = pcF, cs = lkCsokkent(), szavak = [], tobbi = 0;
  var s = '<g class="pc-kartya"><g filter="url(#lt-firka)"><rect x="30" y="14" width="740" height="432" rx="22" fill="#fff6e6" stroke="#c9ad85" stroke-width="3"/></g>';
  s += '<g transform="translate(' + D.tx + ' ' + D.ty + ') scale(' + D.k + ')">' + D.kep();
  lista.forEach(function (pa) {
    var T = D.t[pa.id], J = palyaJelek(pa), hal = J.alszik || J.zarva;
    if (!T) { T = { hely: [300 + tobbi * 150, 392, 140, 30], ceger: [370 + tobbi * 150, 410] }; tobbi++; }
    if (T.szo) szavak.push(T.szo);
    var h = T.hely, cx = h[0] + h[2] / 2, cy = h[1] + h[3] / 2;
    s += '<g class="pc-valaszt" data-pa="' + pa.id + '" style="cursor:pointer">';
    if (J.vil) s += '<ellipse cx="' + F(cx) + '" cy="' + F(cy) + '" rx="' + F(h[2] * .62) + '" ry="' + F(h[3] * .8) + '" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".55;1;.55", "2.4s")) + '</ellipse>';
    s += '<rect x="' + h[0] + '" y="' + h[1] + '" width="' + h[2] + '" height="' + h[3] + '" rx="14" fill="#fff" fill-opacity=".001" stroke="' + (J.ajanlott ? "#e0417a" : "#b35f28") + '" stroke-width="2.6" stroke-dasharray="7 6" opacity="' + (hal ? .35 : .8) + '"/>';
    s += '<g transform="translate(' + T.ceger[0] + ' ' + T.ceger[1] + ') scale(' + (T.ceger[2] || .95) + ')"' + (hal ? ' opacity=".6"' : '') + '>' + phCeger(pa.nev, 0, 0, J, pa.id) +
         (J.all === "zarva" || J.alszik ? phLakat(0, -32) : J.all === "elfogyott" ? phHold(0, -36, .8) : '') + '</g></g>';
  });
  s += '</g>';
  /* bezárás: ✕ a jobb felső sarokban (mellé koppintás is becsukja) */
  s += '<g class="pc-valaszt-zar" style="cursor:pointer" transform="translate(742 42)"><circle r="18" fill="#fffaf0" stroke="#c9ad85" stroke-width="2.2"/><path d="M-6 -6L6 6M6 -6L-6 6" stroke="#8a6a52" stroke-width="3" stroke-linecap="round"/></g></g>';
  return { s: s, mondat: szavak.length === 2 ? "Mit választasz? " + zsCap(szavak[0]) + ", vagy " + szavak[1] + "?" : "Mit választasz?" };
}

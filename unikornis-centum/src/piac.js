/* ============ 6j2) 🏪 PIACTÉR — a falu csírája a térképen + a kis falutérkép (Piactér 3. kör, 2026-10-23) ============
   Terv: terv/eletszeru-100-as-palyak-terv.html 0. pont · rajz: terv/piacter-rajzterv.html 1–2. pont (✅ jóváhagyva 2026-10-23).
   A NAGY TÉRKÉPEN: új hely („piac”), 2026-10-24 óta a Tündérvásár régi helyén (a Vásár beköltözött, lent: TERKEP_GAZDA). Rajzoltan, a térkép saját készletéből (hullámos fal, lt-firka, LT_DEFS), és látszóan
   más, mint az Utca: a Piactér a tanulás helye, az Utca a költésé.
   BELÜL: a kis falutérkép — patak + híd, ködös ösvény a dombra (☀️ Déli vásár, a Fejtörő-hegy körvonala), a tér közepén kút,
   🏪 Tüske néni boltja (a pálya = a ház), üres telek („Hamarosan…”), az épülő Összeadó utca (🪜 Rokon-létra, 🏡 Számcsalád:
   még épülnek), balra a 🎵 Dallam-tér helye („hamarosan”). Újoncnak a domb ködben, és csak a bolt világít.
   A HÁZ ÁLLAPOTA (építés, nem értékelés; sosem romlik vissza — P().piac.haz[id] a legmagasabb elért lépés):
     2 épül (még nem vitte végig) · 3 tető (végigvitte) · 4 ajtó + előtető (egy tiszta nap) · 5 kész: lámpa, cégtábla
     (két tiszta nap) · 6 virágos (megy: tudas.js). A számok a tudás-naplóból jönnek, a gyerek számot nem lát. */

/* ── a nagy térkép: hely, utak, jelkép ──
   🧺 2026-10-24: a Tündérvásár BEKÖLTÖZÖTT a Piactérre. A Piactér átveszi a Vásár helyét és útjait a nagy térképen, a Vásár
   a falutérképen sátor (balra, a szorzás-osztás oldalán, a Dallam-tér mellett). A liget maga változatlan: id-je („vasar”),
   pályái, mentése, csillagai, a pult és a sárkány ugyanúgy látja. TERKEP_GAZDA: melyik liget melyik térkép-hely belsejében
   lakik — a térkép a lakó jeleit (⭐, 💧, 🐉, újonc-fény) a gazda helyén mutatja. Új költözés = egy sor ide. */
var TERKEP_GAZDA = { vasar: "piac" };
var TERKEP_GAZDA_BENT = { piac: "a Piactéren" };
function terkepGazda(r) { return TERKEP_GAZDA[r] || r; }
function terkepLakok(g) { return [g].concat(Object.keys(TERKEP_GAZDA).filter(function (r) { return TERKEP_GAZDA[r] === g; })); }
/* a hely újonc-állapota (nyitas.js): a benne lakó ligetek közül a legébrebb (csak amelyik a gyereknél látszik) */
function terkepNyitas(g, regiok) {
  var RANG = { vil: 3, nyitva: 2, vers: 2, alszik: 1 }, ki = null;
  terkepLakok(g).forEach(function (r) { if (regiok && !regiok[r]) return; var a = nyitasLiget(r); if (a && (!ki || RANG[a] > RANG[ki])) ki = a; });
  return ki;
}
(function () {
  var T = LIGET_TERKEP, v = T.helyek.vasar;
  T.helyek.piac = { szeles: v.szeles, allo: v.allo, magas: 66, szel: 66 };
  delete T.helyek.vasar;
  ["szeles", "allo"].forEach(function (m) {
    T.utak[m] = T.utak[m].map(function (u) { return [terkepGazda(u[0]), terkepGazda(u[1]), u[2]]; });
    if (T.oldal[m].vasar) { T.oldal[m].piac = T.oldal[m].vasar; delete T.oldal[m].vasar; }
  });
})();
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
LT_JELKEP.piac = function () {
  var s = ltArnyek(50), i;
  s += '<g transform="scale(1.18)">';   /* a Vásár beköltözése óta nagyobb (rajzterv 1. pont) */
  s += '<g filter="url(#lt-firka)"><path d="M-50 -1Q-48 -12 0 -12Q48 -12 50 -1Q48 10 0 10Q-48 10 -50 -1Z" fill="#efe0c4" stroke="#b59a7a" stroke-width="1.6"/></g>';
  for (i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; s += '<ellipse cx="' + pcF(Math.cos(a) * 34) + '" cy="' + pcF(-1 + Math.sin(a) * 6.5) + '" rx="4" ry="1.8" fill="#e2cfaa"/>'; }
  /* az épülő ház (az Összeadó utca) a háttérben, állvánnyal */
  s += '<g transform="translate(30 -8) scale(.62)" filter="url(#lt-firka)"><path d="' + pcFal(22, 26) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2"/>' +
       '<path d="M-24 -26L0 -48L24 -26" fill="none" stroke="#b08a68" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
       '<path d="M-30 2V-40M30 2V-40M-34 -20H34" stroke="#b08a68" stroke-width="2.6" stroke-linecap="round"/><path d="M-18 -8H18M-18 -16H18" stroke="#e3cfae" stroke-width="1.4"/></g>';
  /* Tüske néni háza (kicsiben), a cégtáblán a sün */
  s += '<g transform="translate(-22 -6)"><g filter="url(#lt-firka)">' +
       '<rect x="10" y="-50" width="7" height="13" rx="1" fill="#c99a8a" stroke="#7a5a6e" stroke-width="1.3"/>' +
       '<path d="' + pcFal(20, 30) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="1.8"/>' +
       '<path d="M-26 -27Q-12 -44 0 -52Q12 -44 26 -27Q0 -31 -26 -27Z" fill="url(#lt-gTetoR)" stroke="#b5607e" stroke-width="1.8" stroke-linejoin="round"/>' +
       '<path d="M-6 -44Q2 -48 9 -44" stroke="#fff" stroke-width="2" opacity=".45" fill="none" stroke-linecap="round"/>' +
       pcEloteto(-22, 22, -18, 6, 8) +
       '<path d="M-16 4V-6Q-16 -9 -10 -9Q-4 -9 -4 -6V4Z" fill="url(#lt-gAblak)" stroke="#8a6a7e" stroke-width="1.2"/>' +
       '<path d="M4 4V-5Q4 -10 9 -10Q14 -10 14 -5V4Z" fill="#c99272" stroke="#8a6a7e" stroke-width="1.2"/></g>' +
       '<path d="M-20 -22H-27" stroke="#6e4a36" stroke-width="1.4"/><circle cx="-27" cy="-17" r="5" fill="#fbeede" stroke="#6d5446" stroke-width="1.2"/>' + lkTuskek(-27, -17, 4, 7, 160, 380, 7, "#a8988e", "#6d5446", 1) + '<circle cx="-27" cy="-16" r="3.4" fill="#ecd0ad"/><circle cx="-27" cy="-15" r=".9" fill="#4a3a3a"/></g>';
  /* kút */
  s += '<g transform="translate(12 -2)"><g filter="url(#lt-firka)"><ellipse cx="0" cy="0" rx="11" ry="3.6" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.4"/><path d="M-11 0V3Q0 7 11 3V0" fill="#d9cbb4" stroke="#8a7a6e" stroke-width="1.2"/>' +
       '<path d="M-1.5 0V-11H1.5V0Z" fill="#d9cbb4" stroke="#8a7a6e" stroke-width="1"/></g><path d="M0 -12Q-6 -18 -8 -3M0 -12Q6 -18 8 -3" fill="none" stroke="#9ec9f0" stroke-width="1.6" stroke-linecap="round">' + ltAnim("opacity", ".5;1;.5", "1.4s") + '</path></g>';
  /* zászlófüzér */
  s += '<path d="M-48 -2V-40M48 -2V-40" stroke="#6e4a36" stroke-width="1.8" stroke-linecap="round"/><path d="M-48 -38Q0 -24 48 -38" fill="none" stroke="#6e4a36" stroke-width="1"/>';
  var szin = ["#f6a5c0", "#fce49a", "#9ec9f0", "#a7d99a", "#c9a8e6"];
  for (i = 0; i < 9; i++) { var x = -40 + i * 10, y = -38 + 14 * (1 - Math.pow((x / 48), 2)) * .9 + .5; s += '<path d="M' + pcF(x - 3.5) + ' ' + pcF(y) + 'L' + pcF(x + 3.5) + ' ' + pcF(y) + 'L' + pcF(x) + ' ' + pcF(y + 7) + 'Z" fill="' + szin[i % 5] + '"/>'; }
  return s + '</g>';
};

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

/* ── a kis falutérkép ── */
var PIAC_HAZAK = {
  dallam: { x: 62, y: 246, nev: "Dallam-tér", k: .8 },
  vasar:  { x: 136, y: 352, nev: "Tündérvásár", k: 1.15, liget: "vasar" },   /* 🧺 beköltözött (2026-10-24): a sátorban a Vásár pályái (kártyák) */
  zsib:   { x: 548, y: 262, nev: "Zsivány zsibvására", tipus: "zsib", k: 1 },   /* 🦊 a volt üres telken (zsib.js; recept-lap 1A) */
  csalad: { x: 748, y: 238, nev: "Számcsalád", tipus: "csalad", k: .66 },   /* 🏡 a C körben nyílik (még épül) */
  letra:  { x: 640, y: 300, nev: "Rokon-létra", tipus: "letra", k: .8, palya: "rokon-letra" },   /* 🪜 Pálya-hely B kör (letra.js) */
  bolt:   { x: 290, y: 322, nev: "Tüske néni boltja", tipus: "bolt", k: 1.1, palya: "tuske-bolt" }   /* a cégér óta kicsit jobbra (a sátor cégére ne lógjon rá) */
};
var PIAC = null;   /* a kirakott falutérkép: { svg, uni: { hely, el, x, y }, fut } */
var PIAC_HONNAN = null;   /* a Vásárból jött vissza („← Piactér”): az unikornis a sátor előtt áll */
/* 🧺 a Tündérvásár sátra a falutérképen: a térkép jelképe nagyobban, ládákkal, kosárral; alszik = újonc-köd / pult-zár */
function pcVasarSator(alszik, vil) {
  var s = '<g' + (alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '>', cs = lkCsokkent();
  s += '<ellipse cx="0" cy="3" rx="62" ry="9" fill="#3c2a50" opacity=".14"/>';
  if (vil) s += '<ellipse cx="0" cy="-40" rx="80" ry="66" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".55;1;.55", "2.4s")) + '</ellipse>';
  s += '<g filter="url(#lt-firka)">';
  /* gyümölcsös láda a sátor mellett (jobbra a zászlórúd; onnan semmi ne lógjon a bolt nevére) */
  s += '<g transform="translate(-46 0)"><rect x="-12" y="-14" width="24" height="15" rx="2" fill="#e8b27a" stroke="#8a5a3a" stroke-width="1.6"/><path d="M-12 -7H12M-4 -14V1M4 -14V1" stroke="#b5804a" stroke-width="1"/>' +
       '<circle cx="-6" cy="-17" r="4" fill="#e8505b" stroke="#a83a44" stroke-width="1"/><circle cx="2" cy="-18" r="4" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1"/><circle cx="8" cy="-16" r="3.4" fill="#fce49a" stroke="#d1a23a" stroke-width="1"/></g>';
  s += '</g><g transform="scale(1.05)">' + LT_JELKEP.vasar() + '</g></g>';
  return s;
}
function pcKod(x, y, rx, ry, kesl) {
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="url(#lt-gNyKod)">' + (lkCsokkent() ? '' : ltAnim("opacity", ".75;1;.75", (5 + kesl) + "s") + '<animateTransform attributeName="transform" type="translate" values="0 0;' + (8 + kesl * 2) + ' 0;0 0" dur="' + (11 + kesl * 3) + 's" repeatCount="indefinite"/>') + '</ellipse>';
}
function pcCimke(x, y, t, kiemel) {
  var w = t.length * 6.6 + 16;
  return '<g transform="translate(' + x + ' ' + (y + 22) + ')"><rect x="' + (-w / 2) + '" y="-9" width="' + w + '" height="17" rx="8.5" fill="' + (kiemel ? "#e0417a" : "#fffaf2") + '" stroke="' + (kiemel ? "#b02d60" : "#c9b6dc") + '" stroke-width="1.2" opacity=".95"/>' +
    '<text y="3.6" text-anchor="middle" font-size="11" font-family="Fredoka,sans-serif" font-weight="600" fill="' + (kiemel ? "#fff" : "#4a3b7a") + '">' + t + '</text></g>';
}
function pcHatter(uj) {
  var cs = lkCsokkent(), s = "";
  s += '<rect width="800" height="460" fill="url(#lt-gEgA)"/><circle cx="70" cy="50" r="56" fill="url(#lt-gNap)"/><circle cx="70" cy="50" r="21" fill="#fff4c2"/>';
  s += '<g opacity=".85" transform="translate(0 16)"><path d="M520 120Q580 92 620 64Q648 42 676 18Q694 34 708 50Q722 40 734 52Q770 84 800 100V140H520Z" fill="url(#lt-gHegy)" stroke="#6f5a9e" stroke-width="2" stroke-linejoin="round" filter="url(#lt-firka)"/>' +
       '<path d="M660 34Q668 26 676 18Q686 28 694 38Q688 42 684 38Q678 46 672 38Q666 42 660 34Z" fill="#fff" stroke="#c9bde6" stroke-width="1.2"/>' +
       '<path d="M676 18V-2" stroke="#6e4a36" stroke-width="2"/><path d="M676 -2Q686 -4 694 1Q686 5 676 6Z" fill="#f6a5c0" stroke="#b5607e" stroke-width="1">' + (cs ? '' : ltAnim("d", "M676 -2Q686 -4 694 1Q686 5 676 6Z;M676 -2Q686 1 694 -1Q686 7 676 6Z;M676 -2Q686 -4 694 1Q686 5 676 6Z", "1.4s")) + '</path></g>';
  s += '<path d="M0 132Q70 96 150 112Q230 70 330 100Q420 78 500 108Q600 92 680 118Q740 104 800 116V460H0Z" fill="#d6cdee"/>';
  s += '<path d="M0 160Q90 122 190 142Q262 104 340 120Q410 132 470 146Q560 120 650 150Q730 134 800 148V460H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>';
  s += '<path d="M220 150Q300 116 380 136" fill="none" stroke="#e3f4dc" stroke-width="3" opacity=".7" stroke-linecap="round"/>';
  /* a Déli vásár a domb tetején (napos sátor) */
  s += '<g transform="translate(330 120)">' + (uj ? '' : '<ellipse cx="0" cy="-16" rx="36" ry="30" fill="url(#lt-gHalo)"/>') + '<g transform="scale(.52)">' + LT_JELKEP.vasar() + '</g>' +
       '<g transform="translate(16 -44)"><circle r="6" fill="#ffe08a" stroke="#d1a23a" stroke-width="1.2"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path d="M0 -8.5V-11" stroke="#d1a23a" stroke-width="1.4" stroke-linecap="round" transform="rotate(' + a + ')"/>'; }).join("") + '</g></g>';
  s += '<path d="M444 196Q420 182 404 172Q380 160 396 150Q414 140 384 134Q356 130 346 124M400 152Q440 142 470 136Q520 126 560 112Q600 100 630 84" fill="none" stroke="#f3e2c2" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="1 6"/>';
  s += pcKod(520, 122, 70, 20, 0) + pcKod(620, 92, 60, 18, 2) + pcKod(150, 128, 80, 18, 1) + pcKod(440, 104, 54, 14, 3);
  if (uj) s += pcKod(330, 112, 70, 34, 1) + pcKod(380, 150, 60, 18, 2);
  /* patak a falu és a dombság között, rajta a híd */
  s += '<path d="M0 196Q120 184 240 194T470 190T680 184T800 178V196Q690 202 580 200T360 206T140 208T0 212Z" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/>';
  s += '<path d="M60 202h22M190 199h16M300 202h20M560 194h18M700 190h14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".8">' + (cs ? '' : ltAnim("opacity", ".3;.9;.3", "2.6s")) + '</path>';
  s += '<path d="M0 210Q140 202 300 210T560 204T800 196V460H0Z" fill="url(#lt-gRetA)"/>';
  s += '<g transform="translate(444 196)" filter="url(#lt-firka)"><path d="M-30 8Q0 -14 30 8" fill="none" stroke="#b08a68" stroke-width="7" stroke-linecap="round"/><path d="M-30 8Q0 -14 30 8" fill="none" stroke="#e9c193" stroke-width="3.6" stroke-linecap="round"/>' +
       '<path d="M-24 2V-10M-8 -4V-16M8 -4V-16M24 2V-10" stroke="#8a6a52" stroke-width="2.2" stroke-linecap="round"/><path d="M-26 -8Q0 -24 26 -8" fill="none" stroke="#8a6a52" stroke-width="2"/></g>';
  s += '<g transform="translate(374 236)"><path d="M0 4V-26" stroke="#8a6a52" stroke-width="3"/><path d="M-4 -34H44L52 -27L44 -20H-4Z" fill="#fffaf0" stroke="#8a6a52" stroke-width="1.8"/><text x="24" y="-23.5" text-anchor="middle" font-size="9.5" font-family="Fredoka" font-weight="600" fill="#6e4a36">100 fölött ↑</text></g>';
  s += ltKisfa(22, 236, 1.3, "#a8dc9c", "#5f9e6a") + ltKisfa(784, 300, 1.4, "#a8dc9c", "#5f9e6a") + ltKisfa(360, 232, 1, "#c7ecb8", "#5f9e6a") + ltBokor(170, 240, 1.2, "#a8dc9c", "#5f9e6a") + ltBokor(620, 226, 1, "#c7ecb8", "#5f9e6a") + ltBokor(740, 420, 1.4, "#a8dc9c", "#5f9e6a");
  if (!cs) s += ltFelho(80, 60, 1.2, 70, 10, "#fff", 800) + ltFelho(400, 40, .9, 90, 50, "#fdfdfd", 800) + ltLepke(140, 380, 9, "#f6a5c0");
  return s;
}
function pcDallam(alszik) {
  var s = '<g' + (alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '><g filter="url(#lt-firka)"><path d="M-64 0Q-62 -14 0 -16Q62 -14 64 0Q62 14 0 16Q-62 14 -64 0Z" fill="#e8dcc0" stroke="#c9ad85" stroke-width="2"/>';
  [-56, -40, -22, 22, 40, 56].forEach(function (x) { var y = -Math.sqrt(Math.max(0, 1 - x * x / 4200)) * 13; s += '<path d="M' + x + ' ' + pcF(y + 4) + 'V' + pcF(y - 14) + '" stroke="#c9a77a" stroke-width="3.4" stroke-linecap="round"/>'; });
  s += '<path d="M-58 -10Q-40 -24 -20 -24M20 -24Q40 -24 58 -10" fill="none" stroke="#c9a77a" stroke-width="2.2"/>';
  s += '<path d="M0 6V-30M-8 6L0 -6L8 6" stroke="#8a6a52" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M-16 -50L16 -50L14 -30L-14 -30Z" fill="#fffaf0" stroke="#8a6a52" stroke-width="1.8"/></g>';
  s += '<path d="M-11 -44H11M-11 -40H11M-11 -36H11" stroke="#c9b6dc" stroke-width=".8"/><circle cx="-5" cy="-37" r="2" fill="#7a5ea8"/><path d="M-3 -37V-46" stroke="#7a5ea8" stroke-width="1.2"/><circle cx="5" cy="-41" r="2" fill="#7a5ea8"/><path d="M7 -41V-49" stroke="#7a5ea8" stroke-width="1.2"/>';
  if (!alszik && !lkCsokkent()) s += '<text x="22" y="-46" font-size="14" fill="#c9a8e6">♪' + ltAnim("y", "-46;-60;-46", "3s") + ltAnim("opacity", ".2;1;.2", "3s") + '</text><text x="-30" y="-40" font-size="12" fill="#f6a5c0">♫' + ltAnim("y", "-40;-56;-40", "3.6s") + ltAnim("opacity", "1;.2;1", "3.6s") + '</text>';
  s += phCegerAllo("Dallam-tér", -52, { all: alszik ? "alszik" : "hamarosan", nincsCetli: true }, null) + '</g>';   /* a cégérén „épül!” (Pálya-hely B kör) */
  return s;
}
function pcGalamb(x, y) {
  return '<g transform="translate(' + x + ' ' + y + ')"><g>' + (lkCsokkent() ? '' : '<animateTransform attributeName="transform" type="rotate" values="0 0 0;0 0 0;24 4 0;0 0 0;0 0 0" dur="' + (1.6 + x / 30) + 's" repeatCount="indefinite"/>') +
    '<ellipse cx="0" cy="-5" rx="8" ry="5" fill="#d9d4e6" stroke="#8d93a5" stroke-width="1.2"/><circle cx="7" cy="-9" r="3.4" fill="#d9d4e6" stroke="#8d93a5" stroke-width="1.2"/><path d="M10 -9l3 1l-3 1z" fill="#f5a54a"/><circle cx="7.8" cy="-9.6" r=".8" fill="#2a2140"/></g>' +
    '<path d="M-2 0v3M2 0v3" stroke="#f2708f" stroke-width="1.2"/></g>';
}
/* a Piactér belseje (ui.js renderFomenu hívja a liget helyett); lista = a liget pályái (fomenuLigetek),
   vasarLista = a beköltözött Tündérvásár pályái (null, ha a gyereknél nincs Vásár: akkor nincs sátor) */
function piacTer(lista, vasarLista) {
  var host = el("div", "piac-ter uni-terep"), cs = lkCsokkent();
  var bolt = (lista.filter(function (r) { return r.pa.id === PIAC_HAZAK.bolt.palya; })[0] || {}).pa;
  var m = typeof nyitasMenet === "function" ? nyitasMenet() : null, uj = !!m, H = PIAC_HAZAK, i;
  var s = '<svg viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + LT_DEFS +
    '<defs><filter id="pc-alszik"><feColorMatrix type="saturate" values=".35"/></filter></defs>' + pcHatter(uj);
  /* utak: ki a nagy térképre (bal-lent), az épülő utca (jobbra fel), a híd (hátra), a Dallam-tér felé */
  s += '<g filter="url(#lt-firka)"><path d="M390 380 Q240 430 40 452" fill="none" stroke="#efe0c4" stroke-width="22" stroke-linecap="round"/>' +
       '<path d="M600 330 Q660 296 700 270 T770 236" fill="none" stroke="#efe0c4" stroke-width="16" stroke-linecap="round"/>' +
       '<path d="M440 290 Q436 250 444 212" fill="none" stroke="#efe0c4" stroke-width="14" stroke-linecap="round"/>' +
       '<path d="M260 330 Q170 296 96 264" fill="none" stroke="#efe0c4" stroke-width="12" stroke-linecap="round"/></g>';
  s += '<g filter="url(#lt-firka)"><ellipse cx="440" cy="342" rx="232" ry="60" fill="#efe0c4" stroke="#c9ad85" stroke-width="2.4"/></g>';
  var r = ltVeletlen(11);
  for (i = 0; i < 70; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()), x = 440 + Math.cos(a) * d * 217, y = 342 + Math.sin(a) * d * 54; s += '<ellipse cx="' + pcF(x) + '" cy="' + pcF(y) + '" rx="' + pcF(5 + r() * 4) + '" ry="' + pcF(2.2 + r() * 1.4) + '" fill="#e2cfaa"/>'; }
  s += '<path d="M352 300Q351 260 353 214M620 296Q621 256 619 210" stroke="#6e4a36" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M353 218Q486 268 619 214" fill="none" stroke="#6e4a36" stroke-width="1.4"/>';
  var szin = ["#f6a5c0", "#fce49a", "#9ec9f0", "#a7d99a", "#c9a8e6"];
  for (i = 0; i < 14; i++) { var t = (i + .5) / 14, bx = (1 - t) * (1 - t) * 353 + 2 * (1 - t) * t * 486 + t * t * 619, by = (1 - t) * (1 - t) * 218 + 2 * (1 - t) * t * 268 + t * t * 214; s += '<path d="M' + pcF(bx - 7) + ' ' + pcF(by) + 'L' + pcF(bx + 7) + ' ' + pcF(by) + 'L' + pcF(bx) + ' ' + pcF(by + 13) + 'Z" fill="' + szin[i % 5] + '"/>'; }
  s += '<g class="pc-hely" data-id="dallam" transform="translate(' + H.dallam.x + ' ' + H.dallam.y + ') scale(' + (H.dallam.k || 1) + ')"><rect x="-66" y="-80" width="132" height="100" fill="transparent"/>' + pcDallam(uj) + '</g>';
  s += '<g transform="translate(440 338)"><g filter="url(#lt-firka)"><ellipse rx="40" ry="11" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="2"/><path d="M-40 0V10Q0 24 40 10V0" fill="#d9cbb4" stroke="#8a7a6e" stroke-width="2"/>' +
       '<path d="M-5 0V-36H5V0Z" fill="#d9cbb4" stroke="#8a7a6e" stroke-width="1.8"/><ellipse cx="0" cy="-36" rx="14" ry="4" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/></g>' +
       '<path d="M0 -40Q-16 -58 -26 -4M0 -40Q16 -58 26 -4M0 -40Q-6 -60 -12 -4M0 -40Q6 -60 12 -4" fill="none" stroke="#9ec9f0" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 4">' + (cs ? '' : '<animate attributeName="stroke-dashoffset" values="0;-18" dur=".9s" repeatCount="indefinite"/>') + '</path></g>';
  s += '<g transform="translate(600 352)"><path d="M0 4V-40" stroke="#8a6a52" stroke-width="3.4"/><path d="M-4 -44H66L76 -36L66 -28H-4Z" fill="#fffaf0" stroke="#8a6a52" stroke-width="2"/><text x="34" y="-32" text-anchor="middle" font-size="10" font-family="Fredoka" font-weight="600" fill="#6e4a36">Összeadó utca</text>' +
       '<rect x="4" y="-24" width="44" height="13" rx="3" fill="#fce49a" stroke="#d1a23a" stroke-width="1.4" transform="rotate(-6 26 -18)"/><text x="26" y="-14.5" text-anchor="middle" font-size="9" font-family="Fredoka" font-weight="600" fill="#8a5a1a" transform="rotate(-6 26 -18)">épül!</text></g>';
  s += '<g class="pc-hely" data-id="terkep" transform="translate(78 440)"><rect x="-76" y="-46" width="84" height="54" fill="transparent"/><path d="M0 4V-34" stroke="#8a6a52" stroke-width="3.4"/><path d="M4 -40H-62L-72 -32L-62 -24H4Z" fill="#fffaf0" stroke="#8a6a52" stroke-width="2"/><text x="-32" y="-28" text-anchor="middle" font-size="10" font-family="Fredoka" font-weight="600" fill="#6e4a36">Térkép</text></g>';
  /* házak hátulról előre (Pálya-hely B kör, 2026-10-25): a ház = a pálya, cégérrel és a közös jelekkel (palyahely.js phBurok + phHaz);
     a ház állapota a gyerek haladásából (piacHazLepes); amelyik háznak még nincs pályája, az épül (🔜 váz + „épül!”) */
  var hazPa = {}, hazJ = {};
  ["csalad", "zsib", "letra", "bolt"].forEach(function (id) {
    var h = H[id], pa = h.palya ? (lista.filter(function (r) { return r.pa.id === h.palya; })[0] || {}).pa : null;
    var J = pa ? palyaJelek(pa) : { all: uj ? "alszik" : "hamarosan", ertek: 0, nincsCetli: true };
    hazPa[id] = pa || null; hazJ[id] = J;
    s += '<g class="pc-hely pc-haz" data-id="' + id + '">' + phBurok(pa ? pa.id : id, h.nev, J, phHaz(h.tipus, pa ? piacHazLepes(pa.id) : 2, J), { x: h.x, y: h.y, k: h.k }) + '</g>';
  });
  var vil = !!bolt && hazJ.bolt.vil && hazJ.bolt.all !== "alszik";
  /* 🧺 a Tündérvásár sátra (beköltözött): újonc-köd → alszik; a pult mindet lezárta → zárva; világít, ha oda hív az unikornis */
  /* a saját bejáratú pályák (piacHely, pl. a ☀️ Déli vásár a dombon) nem a sátorban vannak */
  var satorLista = (vasarLista || []).filter(function (r) { return !r.pa.piacHely; });
  var deli = ((vasarLista || []).filter(function (r) { return r.pa.piacHely === "domb"; })[0] || {}).pa || null;
  var vs = satorLista.length ? { lista: satorLista, o: ligetOsszegzo("vasar", satorLista), ny: nyitasLiget("vasar") } : null;
  if (vs) {
    vs.alszik = vs.ny === "alszik"; vs.vil = vs.ny === "vil" && !vs.o.alszik;
    /* a sátor cégére (mint a házaké): ⭐ zászló, ha minden kész · jel-táblák 🐉 💧 💖 · a cetlin ⭐ kész/összes (Fanni gyűjt) */
    var vJ = { all: vs.alszik ? "alszik" : vs.o.ossz && vs.o.kesz >= vs.o.ossz ? "kesz" : "", napiAktiv: vs.o.jelzes.indexOf("💧") >= 0, ajanlott: vs.o.jelzes.indexOf("💖") >= 0,
               sarkany: satorLista.some(function (r) { return kuldKertPalya(r.pa.id); }), cetli: "⭐ " + vs.o.kesz + "/" + vs.o.ossz, nincsCetli: vs.alszik };
    s += '<g class="pc-hely pc-haz" data-id="vasar" transform="translate(' + H.vasar.x + ' ' + H.vasar.y + ') scale(' + H.vasar.k + ')"><g class="pc-rezeg">' +
      '<rect x="-64" y="-150" width="140" height="160" fill="transparent"/>' + pcVasarSator(vs.alszik || vs.o.alszik, vs.vil) +
      '<g transform="scale(.85)"' + (vs.alszik || vs.o.alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '>' + phCegerAllo("Tündérvásár", -96, vJ, null) + '</g></g></g>';
  }
  s += '<g transform="translate(330 384)">' + pcGalamb(0, 0) + pcGalamb(22, 6) + '</g><g transform="translate(540 388)">' + pcGalamb(0, 0) + '</g>';
  /* a fehér névcímkék helyett cégér (rajzterv 7. döntés): a házakon, a sátron, a Dallam-téren és a Déli vásáron is */
  /* ☀️ a Déli vásár bejárata a domb tetején (10 000-ig — a producer, 2026-10-24): koppintásra az unikornis a hídig sétál, onnan indul */
  if (deli) {
    var dAlszik = palyaZarva(deli) && nyitasPalyaAlszik(deli), dVil = !palyaZarva(deli) && nyitasPalyaVilagit(deli);
    s += '<g class="pc-hely" data-id="deli" transform="translate(330 120)">' +
      (dVil ? '<ellipse cx="0" cy="-16" rx="46" ry="38" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".55;1;.55", "2.4s")) + '</ellipse>' : '') +
      '<rect x="-44" y="-60" width="88" height="96" fill="transparent"/></g>';
    /* a cégére a sátor fölött, kisebben (a domb messze van): a közös jelek (palyaJelek — palyahely.js), csengővel; zárva / mára elég: 🔒 / 🌙 a sátron */
    var dJ = palyaJelek(deli);
    s += '<g transform="translate(330 120) scale(.62)"' + (dAlszik ? ' filter="url(#pc-alszik)" opacity=".6"' : '') + '>' + phCegerAllo("Déli vásár", -66, dJ, dAlszik ? null : deli.id) +
      (dJ.all === "zarva" ? phLakat(0, -40) : dJ.all === "elfogyott" ? phHold(0, -44, .8) : '') + '</g>';
  }
  s += '<g class="pc-uni" pointer-events="none"><g class="pc-uni-irany" style="--dir:-1;transform:scale(var(--dir,1),1)">' + unikornisSVG("pc-uni", LENYEK[mentes.leny], .42, P().oltozet) + '</g></g>';
  host.innerHTML = s + '</svg>';
  var svg = host.querySelector("svg");
  PIAC = { svg: svg, hely: svg.querySelector(".pc-uni"), el: svg.querySelector(".pc-uni-irany"), x: 440, y: 404, fut: null, bolt: bolt, vasar: vs, deli: deli, haz: hazPa, hazJ: hazJ };
  uniNezoAdat(PIAC.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  if (PIAC_HONNAN === "vasar" && vs) pcUniAllit(H.vasar.x + 112, H.vasar.y + 18);   /* a Vásárból jött ki: a sátor előtt áll */
  else if (PIAC_HONNAN === "deli" && deli) pcUniAllit(PIAC_HID[0], PIAC_HID[1]);   /* a Déli vásárból jött le: a híd lábánál */
  else if (PIAC_HONNAN && hazPa[PIAC_HONNAN]) pcUniAllit(pcHazCel(PIAC_HONNAN)[0], pcHazCel(PIAC_HONNAN)[1]);   /* egy ház pályájáról jött ki: a ház előtt áll */
  else pcUniAllit(440, 404);
  PIAC_HONNAN = null;
  phLengIndit(svg);   /* a cégérek finoman lengenek (palyahely.js) */
  svg.addEventListener("click", function (e) {
    var cs = e.target.closest(".ph-csengo");
    if (cs) { e.stopPropagation(); phCsengo(cs); return; }   /* 🔔 a cégér csengője felolvassa a pályát */
    var g = e.target.closest(".pc-hely"); if (g) piacKoppint(g.getAttribute("data-id"), g);
  });
  setTimeout(function () { if (host.scrollWidth > host.clientWidth + 4) host.scrollLeft = PIAC.x / 800 * host.scrollWidth - host.clientWidth / 2; }, 0);   /* 📱 telefonon az unikornisnál nyílik */
  var hivas = vil ? "Gyere, Tüske néni vár a boltban!" : vs && vs.vil ? "Gyere, a Tündérvásár vár!" : null;
  if (hivas && !lkCsokkent()) setTimeout(function () { if (PIAC && PIAC.svg === svg && svg.isConnected && !PIAC.fut) mondd(hivas); }, 700);
  return host;
}
function pcUniAllit(x, y) { PIAC.x = x; PIAC.y = y; PIAC.hely.setAttribute("transform", "translate(" + pcF(x) + " " + pcF(y) + ")"); }
function pcRezeg(g) {
  var rz = g && g.querySelector(".pc-rezeg"); if (!rz || !rz.animate || lkCsokkent()) return;
  rz.animate([{ transform: "translateX(0)" }, { transform: "translateX(4px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }], { duration: 260, iterations: 2 });
}
function piacKoppint(id, g) {
  if (!PIAC || !PIAC.svg.isConnected) return;
  hangGomb();
  if (id === "terkep") { FOMENU_LIGET = null; renderFomenu(); fomenuFelulre(); return; }
  if (id === "dallam") { mondd("Itt lesz a Dallam-tér. Hamarosan megépül!"); return; }
  if (id === "vasar") { piacVasarba(g); return; }
  if (id === "deli") { piacDelibe(); return; }
  var pa = PIAC.haz[id];
  if (!pa) { pcRezeg(g); mondd("Ez a ház még épül. Hamarosan kinyílik!"); return; }
  var nem = palyaNemIndulMondat(pa, PIAC.hazJ[id]);   /* zárva / alszik / mára elég (palyahely.js) */
  if (nem) { pcRezeg(g); mondd(nem); return; }
  function indul() { if ($("kepernyo-fomenu").classList.contains("aktiv") && FOMENU_LIGET === "piac") { PIAC_HONNAN = id; palyaInditas(pa.id); } }
  if (PIAC.fut) { PIAC.fut = null; uniUtvonalAll(PIAC.el); indul(); return; }   /* második koppintás: azonnal indul */
  var cel = pcHazCel(id), tok = PIAC.fut = {};
  mondd(PIAC_HAZAK[id].nev + "!");
  uniUtvonal({ el: PIAC.el, allit: pcUniAllit, egyseg: function () { var m = PIAC.svg.getScreenCTM && PIAC.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; } },
    uniGorbePontok(uniSimaGorbe([[PIAC.x, PIAC.y], [(PIAC.x + cel[0]) / 2, (PIAC.y + cel[1]) / 2 + 14], cel])), { ido: 1.2 },
    function () {
      if (PIAC.fut !== tok) return;
      PIAC.fut = null;
      var ajto = PIAC.svg.querySelector('[data-id="' + id + '"] .pc-ajto');
      if (ajto && ajto.animate && !lkCsokkent()) ajto.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(.2)" }], { duration: 450, fill: "forwards" });
      else pcRezeg(g);
      setTimeout(indul, lkCsokkent() ? 0 : 480);
    });
}
/* hová sétál az unikornis egy házhoz: a ház jobb oldala elé (a létra-háznál a létra mellé) */
function pcHazCel(id) { var h = PIAC_HAZAK[id], g = PH_HAZ[h.tipus]; if (g.cel) return [h.x + g.cel[0] * h.k, h.y + g.cel[1] * h.k]; return [h.x + (g.szel + (h.tipus === "letra" ? 42 : 30)) * h.k, h.y + 22]; }
/* ☀️ a Déli vásár (a domb tetején): a hídig sétál, és indul a pálya; utána a Piactérre jön vissza (engine-logic.js: piacHely) */
var PIAC_HID = [440, 238];
function piacDelibe() {
  var pa = PIAC.deli; if (!pa) return;
  if (palyaZarva(pa)) { mondd(nyitasPalyaAlszik(pa) ? NYITAS_MONDAT.palyaAlszik : zarvaMondat()); return; }
  if (palyaElfogyott(pa)) { mondd(elfogyottMondat()); return; }
  function indul() { if ($("kepernyo-fomenu").classList.contains("aktiv") && FOMENU_LIGET === "piac") { PIAC_HONNAN = "deli"; palyaInditas(pa.id); } }
  if (PIAC.fut) { PIAC.fut = null; uniUtvonalAll(PIAC.el); indul(); return; }   /* második koppintás: azonnal indul */
  var cel = PIAC_HID, tok = PIAC.fut = {};
  mondd("Fel a Déli vásárba!");
  uniUtvonal({ el: PIAC.el, allit: pcUniAllit, egyseg: function () { var m = PIAC.svg.getScreenCTM && PIAC.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; } },
    uniGorbePontok(uniSimaGorbe([[PIAC.x, PIAC.y], [(PIAC.x + cel[0]) / 2 + 10, (PIAC.y + cel[1]) / 2], cel])), { ido: 1.2 },
    function () { if (PIAC.fut !== tok) return; PIAC.fut = null; setTimeout(indul, lkCsokkent() ? 0 : 200); });
}
/* 🧺 a sátorhoz sétál, és belép a Tündérvásárba (a Vásár kártyái, „← Piactér” gombbal — ui.js) */
function piacVasarba(g) {
  var vs = PIAC.vasar; if (!vs) return;
  if (vs.alszik) { pcRezeg(g); mondd(NYITAS_MONDAT.alszik); return; }
  if (vs.o.alszik) { pcRezeg(g); mondd(zarvaMondat()); return; }
  function be() { if ($("kepernyo-fomenu").classList.contains("aktiv") && FOMENU_LIGET === "piac") ligetbeLep("vasar"); }
  if (PIAC.fut) { PIAC.fut = null; uniUtvonalAll(PIAC.el); be(); return; }   /* második koppintás: azonnal belép */
  var cel = [PIAC_HAZAK.vasar.x + 112, PIAC_HAZAK.vasar.y + 18], tok = PIAC.fut = {};
  mondd("Tündérvásár!");
  uniUtvonal({ el: PIAC.el, allit: pcUniAllit, egyseg: function () { var m = PIAC.svg.getScreenCTM && PIAC.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; } },
    uniGorbePontok(uniSimaGorbe([[PIAC.x, PIAC.y], [(PIAC.x + cel[0]) / 2, (PIAC.y + cel[1]) / 2 + 10], cel])), { ido: 1.1 },
    function () { if (PIAC.fut !== tok) return; PIAC.fut = null; setTimeout(be, lkCsokkent() ? 0 : 200); });
}

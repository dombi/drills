/* jaras-proto.js — A KÖZÖS JÁRÁS-TÁBLA PRÓBAVÁLTOZATA (unikornis pózok, 3. lépés: élethű mozgás).
   Csak a próbalap (terv/jaras-build.py) tölti be. Jóváhagyás után ez kerül a renderer.js-be, a UNI_POZ mellé.
   A renderer.js függvényeire épül: UNI_LABAK, labCsipo, labIzulet, uniForgat, uniK, UNI_POZ_PONT, uniIzTr.

   UNI_JARAS: mozgásmódonként egy sor.
     ido    = egy teljes lépésciklus (mp), amíg mind a 4 láb egyszer lép
     talaj  = a ciklus mekkora részében van a pata a földön (séta > fél, ügetés < fél)
     lend   = a láb lendülete a csípőn/vállon (°): ennyit előre, ennyit hátra
     hajlit = a csánk (h) és a térd (e) behajlása, amikor a láb a levegőben van (°)
     fazis  = a 4 láb ütemeltolása [hátsó-1, hátsó-2, elülső-1, elülső-2]; séta: 4 külön ütem,
              ügetés: az átlós lábpárok együtt
     fej    = [alapszög, bólintás, bólintás/ciklus]; nyak = fej fele (ahogy a pózoknál)
     farok  = [alapszög, lengés, lengés/ciklus]
   A test emelkedése és billenése NINCS a táblában: gép számolja ki úgy, hogy a földön lévő paták mindig
   pontosan a talajon legyenek (nem süllyednek bele, nem lebegnek) — mint a pózoknál a test:"talaj".
   A haladás sebessége is a lábból jön (uniJarasSebesseg): a pata nem csúszik a földön. */
var UNI_JARAS = {
  seta: { ido: .7,  talaj: .62, lend: 26, hajlit: { h: -42, e: 72 }, fazis: [0, .5, .25, .75], fej: [3, 3.5, 2], farok: [2, 5, 1] },
  uget: { ido: .42, talaj: .42, lend: 28, hajlit: { h: -58, e: 92 }, fazis: [0, .5, .5, 0],    fej: [1, 2, 2],   farok: [-12, 4, 2] }
};
var UNI_JARAS_LEPES = 40;   /* ennyi kockára bontjuk a ciklust a CSS-ben */
/* ismétlődő görbe: [[hely 0..1, érték, "lin"?], …]; két pont között lágy (koszinusz) átmenet, "lin" = egyenletes */
function jarGorbe(pontok, p) {
  for (var i = 0; i < pontok.length - 1; i++) {
    var a = pontok[i], b = pontok[i + 1];
    if (p >= a[0] && p <= b[0]) {
      var t = (p - a[0]) / ((b[0] - a[0]) || 1);
      if (!a[2]) t = (1 - Math.cos(Math.PI * t)) / 2;
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return pontok[0][1];
}
/* egy láb szögei a ciklus p pontján (p = 0: a pata elöl leér) → [csípő°, csánk/térd°] */
function uniLabFazis(md, hatso, p) {
  var S = md.talaj, A = md.lend, F = md.hajlit[hatso ? "h" : "e"], w = 1 - S;
  /* a földön: egyenletesen hátrafelé (a test halad el fölötte) · a levegőben: behajlik, előrelendül, kinyúl */
  var comb = jarGorbe([[0, -A, "lin"], [S, A], [S + w * .3, A * .6], [S + w * .82, -A * 1.1], [1, -A]], p);
  var terd = jarGorbe([[0, 0], [S * .7, hatso ? -2 : 2], [S, hatso ? -8 : 10], [S + w * .42, F], [S + w * .8, F * .12], [1, 0]], p);
  return [comb, terd];
}
/* a pata talpának 3 pontja (a pataD rajzából: a kiszélesedő két sarok + a domború közép) */
function uniPataTalp(i) {
  var L = UNI_LABAK[i], yb = L[2][1], sz = labSzel(L, yb - PATA_MAG);
  return [[sz[0] - 2.5, yb + 1], [(sz[0] + sz[1]) / 2, yb + 1.8], [sz[1] + 2.5, yb + 1]];
}
/* a test: annyit ereszkedik/billen, hogy hátul és elöl is a legalsó pata a földön legyen */
var UNI_JARAS_BILLEN = 3;   /* a test legfeljebb ennyi fokot billen előre-hátra */
function uniJarasTest(szogek, foldon) {
  var P = UNI_POZ_PONT, talp = [], tam = { h: null, e: null };
  for (var i = 0; i < 4; i++) {
    var c = labCsipo(i), iz = labIzulet(i), a = szogek[i];
    uniPataTalp(i).forEach(function (q) {
      var u = uniForgat(uniForgat(q, a[1], iz), a[0], c), cs = i < 2 ? "h" : "e";
      talp.push([u[0], u[1], q[1]]);   /* [x, y most, y állva = a láb saját talajvonala] */
      if (foldon[i] && (!tam[cs] || u[1] - q[1] > tam[cs][1])) tam[cs] = [u[0], u[1] - q[1]];
    });
  }
  /* 1. billenés: a földön lévő hátsó és elülső pata emelkedéséből (csak ha mindkét felén van földön lévő láb) */
  var th = 0;
  if (tam.h && tam.e) th = Math.max(-UNI_JARAS_BILLEN, Math.min(UNI_JARAS_BILLEN, (-tam.e[1] + tam.h[1]) / (tam.e[0] - tam.h[0]) * 180 / Math.PI));
  /* 2. ereszkedés: a legmélyebb pata (bármelyik lábé) pontosan a talajra kerüljön — semmi sem süllyed bele */
  var r = th * Math.PI / 180, mely = -1e9;
  talp.forEach(function (t) { mely = Math.max(mely, P[1] + (t[0] - P[0]) * Math.sin(r) + (t[1] - P[1]) * Math.cos(r) - t[2]); });
  return [th, 0, -mely / Math.cos(r)];
}
function uniJarasAllas(md, p) {   /* a ciklus p pontján minden ízület szöge, a uniPozAllas formájában */
  var fz = [0, 1, 2, 3].map(function (i) { return (p + 1 - md.fazis[i]) % 1; });
  var sz = fz.map(function (q, i) { return uniLabFazis(md, i < 2, q); });
  var f = md.fej[0] + md.fej[1] * Math.cos(2 * Math.PI * md.fej[2] * p);
  return { lab: sz, t: uniJarasTest(sz, fz.map(function (q) { return q <= md.talaj; })), fe: f, ny: f / 2,
           fa: md.farok[0] + md.farok[1] * Math.sin(2 * Math.PI * md.farok[2] * p) };
}
var UNI_JARAS_LAB = [".uni-lab-h.uni-lab-a", ".uni-lab-h.uni-lab-b", ".uni-lab-e.uni-lab-a", ".uni-lab-e.uni-lab-b"];
function uniJarasCSS() {
  var css = "";
  Object.keys(UNI_JARAS).forEach(function (nev) {
    var md = UNI_JARAS[nev], kocka = [], k, sav = {};
    for (k = 0; k <= UNI_JARAS_LEPES; k++) kocka.push(uniJarasAllas(md, k / UNI_JARAS_LEPES));
    function anim(resz, sel, fv) {
      var an = "uni-j-" + nev + "-" + resz;
      css += "@keyframes " + an + "{" + kocka.map(function (a, k) { return uniK(k * 100 / UNI_JARAS_LEPES) + "%{transform:" + fv(a) + "}"; }).join("") + "}\n";
      css += ".uni-jar-" + nev + " " + sel + "{animation:" + an + " calc(" + md.ido + "s / var(--jar-tempo, 1)) linear infinite}\n";
    }
    UNI_JARAS_LAB.forEach(function (lab, i) {
      anim("c" + i, lab + " .uni-comb", function (a) { return "rotate(" + uniK(a.lab[i][0]) + "deg)"; });
      anim("t" + i, lab + " .uni-terd", function (a) { return "rotate(" + uniK(a.lab[i][1]) + "deg)"; });
    });
    anim("test", ".uni-test", function (a) { return uniIzTr(a, "t"); });
    anim("fej", ".uni-fej", function (a) { return "rotate(" + uniK(a.fe) + "deg)"; });
    anim("nyak", ".uni-nyak", function (a) { return "rotate(" + uniK(a.ny) + "deg)"; });
    anim("farok", ".uni-farok-iz", function (a) { return "rotate(" + uniK(a.fa) + "deg)"; });
  });
  return css;
}
/* a pata földön töltött ideje alatt a test ennyit halad (rajz-egység / mp) → ennél gyorsabban csúszna a pata */
function uniJarasSebesseg(nev) {
  var md = UNI_JARAS[nev], i = 3, L = UNI_LABAK[i], c = labCsipo(i), iz = labIzulet(i);
  var x0 = uniForgat(uniForgat(L[2], uniLabFazis(md, false, 0)[1], iz), uniLabFazis(md, false, 0)[0], c)[0];
  var x1 = uniForgat(uniForgat(L[2], uniLabFazis(md, false, md.talaj)[1], iz), uniLabFazis(md, false, md.talaj)[0], c)[0];
  return Math.abs(x0 - x1) / (md.talaj * md.ido);
}

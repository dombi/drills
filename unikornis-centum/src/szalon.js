/* ============ 10e) FODRÁSZAT / SZÉPSÉGSZALON (1. fázis: forma göndör↔egyenes · 2. fázis: sörény/farok/tincs festés) ============
   Additív helyszín + utca-hub + égi matek-portál (terv: terv/fodraszat-rendszerterv.html,
   terv/fodraszat-rajzterv.html, jóváhagyva 2026-09-18).
   - A frizura az unikornis elmentett tulajdonsága: P().kinezet.frizura ("egyenes"|"gondor").
     A göndör-formát a fenti frizuraGondorArt() adja; a közös unikornisSVG rajzolja mindenhol.
   - Belépő: 150 ✨ egyszeri (P().szalon.nyitva). Két kefe egyszeri képesség 12-12 💧
     (P().szalon.kefek.gondor / .egyenes); ha megvan, ingyen váltasz vele. */
var SZALON_BELEPO_AR = 150;   /* ✨ csillagpor, egyszeri (Kertkapu mintára) */
var KEFE_AR = 12;             /* 💧 tündérharmat / kefe, egyszeri képesség */

/* ── UTCA-HUB ─────────────────────────────────────────────────────────────
   Terv: terv/utca-kepernyoterv.html (jóváhagyva 2026-10-01). Két elrendezés a képernyő alakja szerint:
   fekvő → „szeles” (800×460, 5 ház egy sorban), álló → „allo” (400×760, hátul 3, elöl 2 ház).
   A házak a régi rajzok a régi 400×460-as koordinátáikban (talpvonal y=432); utcaHely() teszi őket a helyükre.
   Sorrend: fodrász · csillagbolt · kert · odú · bank (a bank a jobb szélen). Ambient mozgás: style.css .u-* */
var UTCA_ELR = {
  szeles: { w: 800, h: 460, fold: 290, hold: [86, 62], portal: [400, 138], tk: [400, -34],
    hazak: { fodrasz: [88, 430, 1.32], bolt: [244, 430, 1.32], kert: [400, 430, 1.32], odu: [556, 430, 1.32], bank: [712, 430, 1.32] },
    jardak: [430], lampak: [[166, 430], [322, 430], [478, 430], [634, 430]],
    csillagok: [[150, 30], [250, 80], [300, 24], [520, 40], [560, 96], [640, 30], [40, 140], [180, 170], [620, 170], [700, 110], [500, 200], [270, 210]] },
  allo: { w: 400, h: 760, fold: 268, hold: [46, 50], portal: [200, 150], tk: [0, -6],
    hazak: { fodrasz: [70, 470, 1], bolt: [200, 470, 1], bank: [330, 470, 1], kert: [104, 728, 1.3], odu: [294, 728, 1.3] },
    jardak: [470, 728], lampak: [[135, 470], [265, 470], [200, 728]],
    csillagok: [[130, 34], [270, 30], [330, 66], [96, 92], [190, 60], [70, 160], [300, 200], [30, 230], [120, 240]] }
};
function utcaMod(w, h) {
  if (!(w > 0 && h > 0)) { w = window.innerWidth; h = window.innerHeight; }   /* még rejtett képernyő: az ablak alakja dönt */
  return w >= h ? "szeles" : "allo";
}
/* Név-tábla egy épület alá (egységes, jól koppintható a gyereknek). */
function utcaCimke(cx, y, felirat) {
  return '<rect x="' + (cx - 48) + '" y="' + (y + 5) + '" width="96" height="24" rx="12" fill="#ffffff" opacity="0.95"/>' +
         '<text x="' + cx + '" y="' + (y + 22) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#2a2140">' + felirat + '</text>';
}
/* a régi koordinátákban rajzolt ház (középvonal: origCx, talp: 432) → helyére és méretére */
function utcaHely(id, hely, origCx, rajz, felirat) {
  var cx = hely[0], talp = hely[1], s = hely[2];
  return '<g id="' + id + '" class="utca-epulet">' +
    '<g transform="translate(' + (cx - s * origCx).toFixed(1) + ',' + (talp - s * 432).toFixed(1) + ') scale(' + s + ')">' + rajz + '</g>' +
    utcaCimke(cx, talp, felirat) + '</g>';
}
function utcaZarCimke(cx, szoveg) {   /* sötét címke a ház elején (régi koordináták) */
  return '<rect x="' + (cx - 38) + '" y="300" width="76" height="20" rx="10" fill="#1a1338" opacity="0.9"/>' +
    '<text x="' + cx + '" y="314" text-anchor="middle" font-size="12" font-weight="700" fill="#ffd24d">' + szoveg + '</text>';
}
/* négyágú csillám (bank-tábla, széf, fodrász-cégér) */
function uCsillam(x, y, r, c, kes) {
  var q = r * 0.18;
  return '<path class="u-pisl" style="animation-delay:' + (kes || 0) + 's" d="M' + x + ',' + (y - r) + ' Q' + (x + q) + ',' + (y - q) + ' ' + (x + r) + ',' + y + ' Q' + (x + q) + ',' + (y + q) + ' ' + x + ',' + (y + r) + ' Q' + (x - q) + ',' + (y + q) + ' ' + (x - r) + ',' + y + ' Q' + (x - q) + ',' + (y - q) + ' ' + x + ',' + (y - r) + ' Z" fill="' + c + '"/>';
}
function utcaPortalSVG() {
  var cx = 200, cy = 158, g = '<g id="utca-portal" class="utca-portal">';
  g += '<rect x="96" y="40" width="208" height="140" fill="transparent"/>';   /* koppintó-felület */
  var cols = SZIVARVANY_SZIN;   /* a szivárványos távozás hídja is ezekből a színekből (renderer.js) */
  for (var i = 0; i < cols.length; i++) {
    var r = 86 - i * 7;
    g += '<path d="M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="' + cols[i] + '" stroke-width="6" stroke-linecap="round" opacity="0.92"/>';
  }
  g += csillagSVG(cx, cy - 98, 11, "#ffd24d");
  g += csillagSVG(cx - 30, cy - 80, 7, "#ffffff");
  g += csillagSVG(cx + 32, cy - 78, 7, "#ffd24d");
  g += '<rect x="' + (cx - 78) + '" y="' + (cy + 6) + '" width="156" height="26" rx="13" fill="#ffffff" opacity="0.94"/>';
  g += '<text x="' + cx + '" y="' + (cy + 24) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#8a4fd0">✦ Matek ✦</text>';
  g += '</g>';
  return g;
}

/* ── a házak (a régi rajzok + fény és mozgás) ── */
function utcaFodraszRajz(zarva, uniSVG) {
  return '<rect x="6" y="276" width="96" height="182" fill="transparent"/>' +
    '<path d="M10 302 L54 278 L98 302 Z" fill="#2b3aa0"/>' +
    '<rect x="14" y="302" width="80" height="130" rx="6" fill="#3f5fd0"/>' +
    '<text x="54" y="298" text-anchor="middle" font-size="14" font-weight="800" fill="#ff69b4" font-style="italic">fodrász</text>' +
    uCsillam(88, 286, 4, "#ffd6ec", 0.4) +
    '<circle class="u-feny" cx="54" cy="359" r="38" fill="url(#u-izz)"/>' +
    '<rect x="28" y="330" width="52" height="58" rx="5" fill="#bfe6f2" stroke="#20267f" stroke-width="2"/>' +
    uniSVG +
    (zarva ? utcaZarCimke(54, "🔒 " + SZALON_BELEPO_AR + " ✨") : "");
}
function utcaBoltRajz() {
  var s = '<rect x="102" y="276" width="96" height="182" fill="transparent"/>' +
    '<rect x="166" y="284" width="12" height="22" fill="#b86a2f"/>';
  /* a kéményből csillagok szállnak fel */
  [[172, 278, 5, "#ffd24d", 0], [178, 276, 3.5, "#fff", 1.1], [169, 279, 4, "#ffe08a", 2.1]].forEach(function (c) {
    s += '<g class="u-szall" style="animation-delay:' + c[4] + 's">' + csillagSVG(c[0], c[1], c[2], c[3]) + '</g>';
  });
  s += '<path d="M106 302 L150 278 L194 302 Z" fill="#b52f98"/>' +
    '<rect x="110" y="302" width="80" height="130" rx="6" fill="#e63bc0"/>' +
    '<text x="150" y="330" text-anchor="middle" font-size="13" font-weight="800" fill="#ffe0f4" font-style="italic">csillagbolt</text>' +
    '<circle class="u-feny" style="animation-delay:1.2s" cx="150" cy="365" r="34" fill="url(#u-izz)"/>' +
    '<rect x="126" y="344" width="48" height="42" rx="5" fill="#ffc0e6" stroke="#a02f88" stroke-width="2"/>' +
    '<g class="u-pisl" style="animation-duration:3.4s">' + csillagSVG(150, 365, 9, "#ffd24d") + '</g>';
  return s;
}
function utcaKertRajz() {
  return '<rect x="200" y="284" width="96" height="174" fill="transparent"/>' +
    '<rect x="206" y="330" width="84" height="102" rx="5" fill="#cdeecb"/>' +
    '<rect x="206" y="316" width="84" height="18" fill="#3f9e6a"/>' +
    '<g class="u-leng"><path d="M206 334 l10 14 l10 -14 Z" fill="#e14b4b"/><path d="M226 334 l10 14 l10 -14 Z" fill="#f2c23b"/><path d="M246 334 l10 14 l10 -14 Z" fill="#e14b4b"/><path d="M266 334 l10 14 l10 -14 Z" fill="#f2c23b"/></g>' +
    '<rect x="222" y="392" width="52" height="30" rx="4" fill="#b98a4e"/>' +
    '<circle cx="238" cy="392" r="9" fill="#e14b4b"/><circle cx="256" cy="394" r="8" fill="#7fbf3f"/>' +
    '<path d="M266 386 l5 14 M263 388 l4 7" stroke="#e6822f" stroke-width="4" stroke-linecap="round"/>';
}
function utcaOduRajz() {
  return '<rect x="296" y="272" width="98" height="186" fill="transparent"/>' +
    '<rect x="322" y="340" width="46" height="92" fill="#9c6b3f"/>' +
    '<g class="u-lomb"><circle cx="345" cy="318" r="42" fill="#3fa15e"/><circle cx="316" cy="326" r="24" fill="#57b877"/><circle cx="374" cy="328" r="22" fill="#57b877"/>' +
    '<circle class="u-feny" cx="336" cy="300" r="22" fill="url(#u-izz)"/>' +
    '<circle cx="336" cy="300" r="14" fill="#bfe6f2" stroke="#20267f" stroke-width="2"/><path d="M336 287 v27 M323 300 h26" stroke="#20267f" stroke-width="1.5"/></g>' +
    '<ellipse cx="345" cy="408" rx="16" ry="22" fill="#5c2f1a"/>';
}
/* (a bank háza: bank.js utcaBankRajz) */

/* ── ég, föld, járda, lámpák ── */
function utcaDefs() {
  return '<defs>' +
    '<linearGradient id="utca-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12194f"/><stop offset="0.55" stop-color="#2b2f78"/><stop offset="1" stop-color="#5a4a9a"/></linearGradient>' +
    '<linearGradient id="utca-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1650"/><stop offset="1" stop-color="#0a1240"/></linearGradient>' +
    '<radialGradient id="u-izz"><stop offset="0" stop-color="#fff2a0" stop-opacity=".75"/><stop offset="1" stop-color="#fff2a0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="u-hold"><stop offset=".45" stop-color="#fdf3c4" stop-opacity=".35"/><stop offset="1" stop-color="#fdf3c4" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="u-hullo-gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="u-b-fal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a98c6"/><stop offset=".55" stop-color="#7090be"/><stop offset="1" stop-color="#5d7cae"/></linearGradient>' +
    '<linearGradient id="u-b-ablak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset="1" stop-color="#ffe45a"/></linearGradient>' +
    '<linearGradient id="u-b-tabla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b25ab4"/><stop offset="1" stop-color="#9a449c"/></linearGradient>' +
    '<clipPath id="u-b-bal"><rect x="114" y="104" width="68" height="70" rx="3"/></clipPath>' +
    '<filter id="u-firka" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>' +
    '</defs>';
}
function utcaJarda(w, y) {
  var s = '<rect x="-400" y="' + y + '" width="' + (w + 800) + '" height="30" fill="#1b2468"/>' +
    '<path d="M-400 ' + y + ' H' + (w + 400) + '" stroke="#3b4290" stroke-width="3"/>';
  for (var x = 20; x < w; x += 46) s += '<path d="M' + x + ' ' + (y + 3) + ' v26" stroke="#2a3380" stroke-width="2"/>';
  return s;
}
function utcaLampa(x, talp) {
  var t = talp - 4;
  return '<circle class="u-feny" cx="' + x + '" cy="' + (t - 74) + '" r="30" fill="url(#u-izz)"/>' +
    '<rect x="' + (x - 2.5) + '" y="' + (t - 66) + '" width="5" height="66" rx="2" fill="#2a2a5e"/>' +
    '<rect x="' + (x - 8) + '" y="' + (t - 84) + '" width="16" height="18" rx="5" fill="#fff2a0" stroke="#2a2a5e" stroke-width="3"/>' +
    '<path d="M' + (x - 10) + ' ' + (t - 84) + ' L' + x + ' ' + (t - 92) + ' L' + (x + 10) + ' ' + (t - 84) + ' Z" fill="#2a2a5e"/>';
}
function utcaSVG(mod) {
  var L = UTCA_ELR[mod] || UTCA_ELR.szeles, w = L.w, h = L.h;
  var c = LENYEK[mentes.leny];
  var uni = '<g transform="translate(54,368) scale(0.125)">' + unikornisSVG("utca-kirakat-uni", c, 1, P().oltozet) + '</g>';
  var s = '<svg class="utca-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">' + utcaDefs();
  /* ég és föld a képernyő széléig (a viewBox-on túl is: nincs üres sáv) */
  s += '<rect x="-400" y="-600" width="' + (w + 800) + '" height="' + (600 + L.fold) + '" fill="#12194f"/>';
  s += '<rect x="-400" y="0" width="' + (w + 800) + '" height="' + L.fold + '" fill="url(#utca-eg)"/>';
  L.csillagok.forEach(function (p, i) {
    s += '<circle class="u-pisl" style="animation-delay:' + (i * 0.43).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.6 : 2.2) + '" fill="#fff"/>';
  });
  var hx = L.hold[0], hy = L.hold[1];
  s += '<circle class="u-feny" cx="' + hx + '" cy="' + hy + '" r="44" fill="url(#u-hold)"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="20" fill="#fdf3c4"/><circle cx="' + (hx - 8) + '" cy="' + (hy - 6) + '" r="20" fill="#1c2560" opacity="0.55"/>';
  s += '<g transform="translate(' + (w * 0.82) + ',30)"><g class="u-hullo"><path d="M0 0 L46 -16" stroke="url(#u-hullo-gr)" stroke-width="2.5" stroke-linecap="round"/><circle r="2.4" fill="#fff"/></g></g>';
  s += '<g transform="translate(' + (L.portal[0] - 200) + ',' + (L.portal[1] - 158) + ')">' + utcaPortalSVG() + '</g>';
  s += '<g transform="translate(' + L.tk[0] + ',' + L.tk[1] + ')">' + tkLepcsoSVG() + '</g>';   /* Égi Tüneménykert felhőlépcső (csak felhő-módban + pulton engedélyezve) */
  s += '<rect x="-400" y="' + L.fold + '" width="' + (w + 800) + '" height="' + (h - L.fold + 600) + '" fill="url(#utca-fold)"/>';
  L.jardak.forEach(function (y) { s += utcaJarda(w, y); });
  L.lampak.forEach(function (p) { s += utcaLampa(p[0], p[1]); });
  /* a házak hátulról előre (az álló elrendezésben az első sor takarja a hátsót) */
  var H = L.hazak, sor = [
    ["utca-fodrasz", "fodrasz", 54, utcaFodraszRajz(!P().szalon.nyitva, uni), "fodrász"],
    ["utca-bolt", "bolt", 150, utcaBoltRajz(), "csillagbolt"],
    ["utca-kert", "kert", 248, utcaKertRajz(), "kert"],
    ["utca-odu", "odu", 345, utcaOduRajz(), "odú"],
    ["utca-bank", "bank", 200, utcaBankRajz(bankZarva()), "tündérbank"]
  ].sort(function (x, y) { return H[x[1]][1] - H[y[1]][1]; });
  sor.forEach(function (e) { s += utcaHely(e[0], H[e[1]], e[2], e[3], e[4]); });
  s += '<g id="utca-hid" pointer-events="none"></g><g id="utca-uni-hely" pointer-events="none"></g><g id="utca-hid-szikra" pointer-events="none"></g>';   /* szivárványos távozás (utcaTavozik) */
  /* szentjánosbogár-fények a föld fölött */
  for (var i = 0; i < 7; i++) {
    var fx = (w / 7) * i + 26, fy = L.fold + 18 + ((i * 37) % 60);
    s += '<circle class="u-szentj" style="animation-delay:' + (i * 0.7).toFixed(1) + 's" cx="' + fx.toFixed(0) + '" cy="' + fy + '" r="2.2" fill="#fff6a8"/>';
  }
  return s + '</svg>';
}
var UTCA_MOD = "nez";   /* "nez" | "megerosit-belepo" | "megerosit-tk" */
var UTCA_ELR_MOST = null;   /* az utoljára rajzolt elrendezés („szeles” | „allo”) — forgatáskor átrajzolunk */
window.addEventListener("resize", function () {
  var host = document.getElementById("utca-szinter"), akt = document.querySelector(".kepernyo.aktiv");
  if (!host || !akt || akt.id !== "kepernyo-utca") return;
  if (utcaMod(host.clientWidth, host.clientHeight) !== UTCA_ELR_MOST) { if (_utcaTavozas) utcaTavozasVege(); else renderUtca(); }
});
function utcaNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  UTCA_MOD = "nez"; _utcaTavozas = null;
  mutat("kepernyo-utca");
  renderUtca();   /* a képernyő már látszik: a mérete dönti el az elrendezést */
  tkElokeszit();   /* első alkalommal betölti a felhőkert beállításait (utána magától újrarajzol) */
}
function utcaKot(id, fn) { var g = document.getElementById(id); if (g) { g.style.cursor = "pointer"; g.addEventListener("click", fn); } }
function renderUtca() {
  var cp = $("utca-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("utca-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var host = $("utca-szinter"); if (!host) return;
  UTCA_ELR_MOST = utcaMod(host.clientWidth, host.clientHeight);
  host.innerHTML = utcaSVG(UTCA_ELR_MOST);
  utcaKot("utca-fodrasz", utcaFodraszKoppint);
  utcaKot("utca-bolt", function () { hangGomb(); oduNyit(); oduPanelNyit(); });
  utcaKot("utca-kert", function () {
    hangGomb();
    if (P().kert.nyitva) kertNyit();
    else { mondd("A kert kapuja zárva. A kulcsot a boltban szerezheted meg!"); oduNyit(); oduPanelNyit("kert"); }
  });
  utcaKot("utca-odu", function () { hangGomb(); oduNyit(); });
  utcaKot("utca-bank", function () { hangGomb(); bankNyit(); });
  utcaKot("utca-felhokert", tkLepcsoKoppint);
  utcaKot("utca-portal", utcaTavozik);
  var sugo = $("utca-sugo");
  if (sugo) {
    if (UTCA_MOD === "megerosit-belepo") {
      sugo.innerHTML = 'Megnyitod a szalont 150 ✨-ért? <button class="kis-gomb" id="utca-belepo-igen">Igen ✓</button> <button class="kis-gomb" id="utca-belepo-nem">Mégse</button>';
      $("utca-belepo-igen").addEventListener("click", utcaBelepoVesz);
      $("utca-belepo-nem").addEventListener("click", function () { hangGomb(); UTCA_MOD = "nez"; renderUtca(); });
    } else if (UTCA_MOD === "megerosit-tk") {
      sugo.innerHTML = 'Megnyitod a felhőkertet ' + TK_FELOLDAS_AR + ' 💧-ért? <button class="kis-gomb" id="utca-tk-igen">Igen ✓</button> <button class="kis-gomb" id="utca-tk-nem">Mégse</button>';
      $("utca-tk-igen").addEventListener("click", tkFeloldasVesz);
      $("utca-tk-nem").addEventListener("click", function () { hangGomb(); UTCA_MOD = "nez"; renderUtca(); });
    } else {
      sugo.textContent = "Koppints egy házra — oda mész! 👆";
    }
  }
}
/* ── SZIVÁRVÁNYOS TÁVOZÁS az utcán (unikornis pózok 6. lépés, közös kód: renderer.js uniSzivarvanyba):
   a Matek-kapuból szivárványhíd nő le az odú-ház ajtajáig, kilép az unikornis, és felszalad rajta a kapuba.
   Közben egy második koppintás azonnal átvált. ── */
var _utcaTavozas = null;
function utcaTavozik() {
  if (_utcaTavozas) { utcaTavozasVege(); return; }
  var hely = $("utca-uni-hely"); if (!hely) return;
  hangGomb(); mondd("Induljunk matekozni!");
  var tok = _utcaTavozas = {};
  var L = UTCA_ELR[UTCA_ELR_MOST] || UTCA_ELR.szeles, h = L.hazak.odu, k = 0.32 * h[2];
  var ajto = [h[0], h[1] - 2 * h[2]], kapu = [L.portal[0], L.portal[1] - 18];
  var ut = szivarvanyGorbe(ajto, [ajto[0], ajto[1] - 140], [kapu[0] + 110, kapu[1] + 20], kapu, 40);
  hely.innerHTML = '<g id="utca-uni-mozgo" style="opacity:0;transform:translate(' + ajto[0] + 'px,' + ajto[1] + 'px) scale(' + k + ')">' +
    '<g id="utca-uni-flip" style="--dir:' + (kapu[0] < ajto[0] ? -1 : 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG("utca-uni", LENYEK[mentes.leny], 1, P().oltozet) + '</g></g>';
  var m = $("utca-uni-mozgo"), fl = $("utca-uni-flip");
  uniNezoAdat(fl, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  void m.getBoundingClientRect();
  m.style.transition = "opacity .3s"; m.style.opacity = "1";   /* kilép az odú-ház ajtaján */
  hangCsilla();
  szivarvanyNo($("utca-hid"), ut, 34 * h[2], 10 * h[2], function () {
    if (_utcaTavozas !== tok) return;
    uniSzivarvanyba({ mozgo: m, el: fl, talp: [0, 0], ut: ut, skala: [k, k * 0.3], szikra: $("utca-hid-szikra") },
      function () { if (_utcaTavozas === tok) utcaTavozasVege(); });
  });
}
function utcaTavozasVege() {
  _utcaTavozas = null;
  var k = $("kepernyo-utca");
  if (!k || !k.classList.contains("aktiv")) return;   /* közben máshová ment */
  renderFomenu(); mutat("kepernyo-fomenu");
}
function utcaFodraszKoppint() {
  hangGomb();
  if (P().szalon.nyitva) { szalonNyit(); return; }
  if (P().csillampor < SZALON_BELEPO_AR) { mondd("A szalon belépő 150 csillagpor. Gyűjts még matekozással!"); return; }
  UTCA_MOD = "megerosit-belepo"; renderUtca();
}
function utcaBelepoVesz() {
  hangGomb();
  if (P().csillampor < SZALON_BELEPO_AR) { UTCA_MOD = "nez"; renderUtca(); return; }
  P().csillampor -= SZALON_BELEPO_AR; vasarlasNaplo("szalon-belepo", SZALON_BELEPO_AR, "csillampor");
  P().szalon.nyitva = 1;
  UTCA_MOD = "nez";
  hangCsilla(); hangJo(); ment();
  mondd("Kinyílt a szépségszalon! Milyen frizurát kérsz?");
  szalonNyit();
}

/* ── SZALON-BELSŐ ─────────────────────────────────────────────────────────
   2. fázis (terv/fodraszat-festes-rajzterv.html, jóváhagyva 2026-09-26): balra a festékszekrény
   (8 tégely/oldal, ◀ ▶ lapozó), előtte a padlón az ingyenes 🧽 lemosó szivacs; középen a NAGY
   unikornis a lila csillag-folton, alatta 3 rész-gomb (sörény / farok / tincs); jobbra a pulton
   a két kefe (1. fázis). Menet: tégely → (ha nincs meg: „Megveszed?”) → ecset → rész → átszíneződik. */
var FESTEK_OLDAL = 8;          /* ennyi tégely fér a szekrény egy oldalára */
var SZALON_ECSET = null;       /* null | festék-id | "szivacs" */
var SZALON_LAP = 0;
var SZALON_SZOVEG = "Válassz festéket!";
var SZALON_DLG = null;         /* a megvételre kérdezett festék id-je (vásárlás-ablak) */
var SZALON_RESZ_NEV = { soreny: "sörény", farok: "farok", tincs: "tincs" };

function szalonKefeSVG(id, x, jel, megvan, aktiv) {
  var g = '<g id="' + id + '" class="szalon-kefe">';
  g += '<rect x="' + (x - 20) + '" y="60" width="40" height="46" fill="transparent"/>';   /* koppintó-felület */
  g += '<rect x="' + (x - 15) + '" y="66" width="30" height="30" rx="8" fill="' + (aktiv ? "#fff6a8" : "#ffffff") + '" stroke="' + (aktiv ? "#2f8f57" : "#8a4fd0") + '" stroke-width="' + (aktiv ? 2.4 : 1.5) + '"/>';
  g += '<text x="' + x + '" y="87" text-anchor="middle" font-size="15">' + jel + '</text>';
  if (!megvan) g += '<rect x="' + (x - 15) + '" y="96" width="30" height="11" rx="5.5" fill="#1a2340" opacity="0.85"/><text x="' + x + '" y="104.5" text-anchor="middle" font-size="7.5" font-weight="800" fill="#7fd6ec">12 💧</text>';
  return g + '</g>';
}
/* kis ikon a rész-gombon: a rész formája a jelenlegi festékkel (festetlenül a saját alapszínével) */
function szalonReszIkon(resz, x, y, fill) {
  var d;
  if (resz === "soreny") d = 'M' + (x + 10) + ' ' + (y - 10) + ' Q' + (x - 6) + ' ' + (y - 6) + ' ' + (x - 12) + ' ' + (y + 12) + ' Q' + (x - 2) + ' ' + (y + 2) + ' ' + (x + 4) + ' ' + (y + 8) + ' Q' + (x + 2) + ' ' + (y - 2) + ' ' + (x + 10) + ' ' + (y - 10) + ' Z';
  else if (resz === "farok") d = 'M' + (x + 8) + ' ' + (y - 11) + ' Q' + (x - 10) + ' ' + (y - 6) + ' ' + (x - 10) + ' ' + (y + 13) + ' Q' + (x - 2) + ' ' + (y + 3) + ' ' + (x + 2) + ' ' + (y + 10) + ' Q' + (x + 2) + ' ' + (y - 2) + ' ' + (x + 8) + ' ' + (y - 11) + ' Z';
  else d = 'M' + (x - 4) + ' ' + (y - 10) + ' Q' + (x - 9) + ' ' + (y + 2) + ' ' + (x - 4) + ' ' + (y + 12) + ' Q' + (x + 1) + ' ' + (y + 3) + ' ' + (x + 6) + ' ' + (y + 7) + ' Q' + (x + 8) + ' ' + (y - 4) + ' ' + (x + 7) + ' ' + (y - 10) + ' Z';
  return '<path d="' + d + '" fill="' + fill + '" stroke="#5a3a90" stroke-width="1"/>';
}
function szalonSVG() {
  var c = LENYEK[mentes.leny], rajz = (c && c.rajz) || "korall";
  var kin = P().kinezet, most = kin.frizura || "egyenes", van = P().szalon.festekek;
  var alapSz = (SORENY_SZIN[rajz] && SORENY_SZIN[rajz][kin.sorenySzin || 0] || SORENY_SZIN.korall[0]).c[0];
  var i, x;
  var s = '<svg class="szalon-svg' + (SZALON_ECSET ? " festheto" : "") + '" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  var defs = '<radialGradient id="szalon-ecset-feny" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6a8" stop-opacity="0.95"/><stop offset="1" stop-color="#fff6a8" stop-opacity="0"/></radialGradient>';
  FESTEKEK.forEach(function (f) { defs += festekFoltDef(f, "szalon-teg-" + f.id); });
  s += '<defs>' + defs + '</defs>';
  s += '<rect x="0" y="0" width="400" height="300" fill="#c6e6f2"/><rect x="0" y="262" width="400" height="38" fill="#b9d9ec"/>';   /* fal + padló */

  /* díszlet: körömlakk + szőrfesték (később jönnek) */
  var lakk = ["#e14b4b", "#f2c23b", "#8fd23b", "#3ba3dd", "#e63bc0"];
  s += '<g opacity="0.75"><rect x="150" y="38" width="80" height="6" rx="2" fill="#b0733f"/>';
  for (i = 0; i < 5; i++) { x = 156 + i * 15; s += '<rect x="' + x + '" y="22" width="8" height="16" rx="2" fill="' + lakk[i] + '"/><rect x="' + (x + 1.5) + '" y="17" width="5" height="6" fill="#333"/>'; }
  s += '<text x="190" y="12" text-anchor="middle" font-size="8.5" font-weight="800" fill="#e63bc0" font-style="italic">körömlakkok · hamarosan</text></g>';
  s += '<g opacity="0.75"><rect x="300" y="40" width="90" height="6" rx="2" fill="#b0733f"/>';
  ["#e14b4b", "#f2c23b", "#8fd23b", "#e63bc0"].forEach(function (b, j) { var bx = 312 + j * 22; s += '<circle cx="' + bx + '" cy="30" r="9" fill="' + b + '"/><rect x="' + (bx - 3.5) + '" y="17" width="7" height="8" rx="2" fill="' + b + '"/>'; });
  s += '<text x="345" y="12" text-anchor="middle" font-size="8.5" font-weight="800" fill="#e6a000" font-style="italic">szőrfesték · hamarosan</text></g>';

  /* FESTÉK-SZEKRÉNY: 2 oszlop × 4 sor = 8 tégely/oldal; több festéknél ◀ ▶ lapozó */
  var lapok = Math.max(1, Math.ceil(FESTEKEK.length / FESTEK_OLDAL));
  if (SZALON_LAP >= lapok) SZALON_LAP = lapok - 1;
  if (SZALON_LAP < 0) SZALON_LAP = 0;
  s += '<rect x="8" y="48" width="100" height="214" rx="4" fill="#7a1818" stroke="#5c1010" stroke-width="2"/>';
  s += '<text x="58" y="61" text-anchor="middle" font-size="8.5" font-weight="800" fill="#ffd9a0" font-style="italic">sörény- és farokfesték</text>';
  FESTEKEK.slice(SZALON_LAP * FESTEK_OLDAL, SZALON_LAP * FESTEK_OLDAL + FESTEK_OLDAL).forEach(function (f, j) {
    var tx = 33 + (j % 2) * 50, ty = 82 + Math.floor(j / 2) * 42, megvan = !!van[f.id];
    s += '<g class="szalon-tegely" data-f="' + f.id + '">';
    s += '<rect x="' + (tx - 24) + '" y="' + (ty - 18) + '" width="48" height="42" fill="transparent"/>';   /* koppintó-felület */
    if (SZALON_ECSET === f.id) s += '<circle cx="' + tx + '" cy="' + ty + '" r="23" fill="url(#szalon-ecset-feny)"/>';
    s += '<rect x="' + (tx - 15) + '" y="' + (ty - 6) + '" width="30" height="20" rx="5" fill="#f4f0f8" stroke="#5c1010" stroke-width="1.5"/>';
    s += '<ellipse cx="' + tx + '" cy="' + (ty - 6) + '" rx="15" ry="7" fill="url(#szalon-teg-' + f.id + ')" stroke="#5c1010" stroke-width="1.5"/>';
    s += '<text x="' + tx + '" y="' + (ty + 10) + '" text-anchor="middle" font-size="10">' + f.em + '</text>';
    if (megvan) s += '<circle cx="' + (tx + 14) + '" cy="' + (ty - 12) + '" r="6" fill="#3fae6a" stroke="#fff" stroke-width="1.5"/><text x="' + (tx + 14) + '" y="' + (ty - 9.2) + '" text-anchor="middle" font-size="7.5" font-weight="900" fill="#fff">✓</text>';
    else s += '<rect x="' + (tx - 15) + '" y="' + (ty + 15) + '" width="30" height="11" rx="5.5" fill="#fff" stroke="#39b7d6" stroke-width="1.2"/><text x="' + tx + '" y="' + (ty + 23.5) + '" text-anchor="middle" font-size="7.5" font-weight="800" fill="#1587b3">' + f.ar + ' 💧</text>';
    s += '</g>';
  });
  if (lapok > 1) {
    s += '<g class="szalon-lapoz" data-d="-1" opacity="' + (SZALON_LAP > 0 ? 1 : 0.35) + '"><circle cx="24" cy="250" r="12" fill="transparent"/><circle cx="24" cy="250" r="9" fill="#ffd9a0"/><text x="24" y="254" text-anchor="middle" font-size="10" font-weight="900" fill="#7a1818">◀</text></g>';
    s += '<text x="58" y="254" text-anchor="middle" font-size="9.5" font-weight="800" fill="#ffd9a0">' + (SZALON_LAP + 1) + ' / ' + lapok + '</text>';
    s += '<g class="szalon-lapoz" data-d="1" opacity="' + (SZALON_LAP < lapok - 1 ? 1 : 0.35) + '"><circle cx="92" cy="250" r="12" fill="transparent"/><circle cx="92" cy="250" r="9" fill="#ffd9a0"/><text x="92" y="254" text-anchor="middle" font-size="10" font-weight="900" fill="#7a1818">▶</text></g>';
  }
  /* 🧽 szivacs: a szekrény előtt a padlón, mindig látszik (nem lapozódik el) */
  s += '<g class="szalon-tegely" data-f="szivacs"><rect x="14" y="266" width="74" height="30" fill="transparent"/>' +
    (SZALON_ECSET === "szivacs" ? '<circle cx="40" cy="280" r="22" fill="url(#szalon-ecset-feny)"/>' : '') +
    '<rect x="23" y="270" width="34" height="20" rx="7" fill="#ffe36b" stroke="#c9a21a" stroke-width="1.5"/>' +
    '<circle cx="33" cy="277" r="2" fill="#e6c23a"/><circle cx="45" cy="283" r="2.4" fill="#e6c23a"/><circle cx="48" cy="275" r="1.5" fill="#e6c23a"/>' +
    '<text x="62" y="284" font-size="8.5" font-weight="800" fill="#5a3a90">lemosó</text></g>';

  /* kefék a pulton (1. fázis) */
  s += '<rect x="300" y="108" width="90" height="7" rx="2" fill="#b06fd0"/>';
  s += szalonKefeSVG("szalon-kefe-gondor", 324, "🌀", !!P().szalon.kefek.gondor, most === "gondor");
  s += szalonKefeSVG("szalon-kefe-egyenes", 366, "〰️", !!P().szalon.kefek.egyenes, most === "egyenes");
  s += '<text x="345" y="127" text-anchor="middle" font-size="8.5" font-weight="700" fill="#8a4fd0" font-style="italic">kefék</text>';

  /* lila csillag-folt + a NAGY unikornis (a közös unikornisSVG — frizura, bolti szín, festék mind rajta) */
  s += '<ellipse cx="208" cy="214" rx="92" ry="22" fill="#b98fd8"/>' + csillagSVG(208, 210, 26, "#ecdafb");
  s += '<g transform="translate(208,207)">' + unikornisSVG("szalon-uni", c, 1.12, P().oltozet) + '</g>';

  /* beszédbuborék */
  s += '<rect x="122" y="54" width="172" height="26" rx="13" fill="#fff" stroke="#e0417a" stroke-width="1.6"/>' +
    '<text x="208" y="71.5" text-anchor="middle" font-size="11" font-weight="800" fill="#e0417a">' + SZALON_SZOVEG + '</text>';

  /* 3 NAGY rész-gomb */
  [["soreny", "Sörény", 150], ["farok", "Farok", 208], ["tincs", "Tincs", 266]].forEach(function (g) {
    var fid = kin.festek && kin.festek[g[0]], gx = g[2];
    s += '<g class="szalon-rgomb" data-resz="' + g[0] + '">' +
      '<rect x="' + (gx - 26) + '" y="242" width="52" height="46" rx="12" fill="#fff" stroke="' + (SZALON_ECSET ? "#f0a800" : "#8a4fd0") + '" stroke-width="' + (SZALON_ECSET ? 3 : 1.6) + '"/>' +
      szalonReszIkon(g[0], gx, 258, FESTEK_BY[fid] ? "url(#szalon-teg-" + fid + ")" : alapSz) +
      '<text x="' + gx + '" y="283" text-anchor="middle" font-size="10" font-weight="800" fill="#5a3a90">' + g[1] + '</text></g>';
  });
  s += '</svg>';
  return s;
}
/* vásárlás-ablak: festékfolt + „Megveszed?” (vagy kedves mondat, ha kevés a 💧) */
function szalonDlgHTML() {
  var f = FESTEK_BY[SZALON_DLG]; if (!f) return "";
  var eleg = (P().tunderharmat || 0) >= f.ar;
  var h = '<div class="szalon-dlg"><div class="szalon-dlg-kartya">';
  h += '<svg viewBox="0 0 74 74" width="74" height="74" class="szalon-dlg-folt"><defs>' + festekFoltDef(f, "szalon-dlg-" + f.id) + '</defs><rect width="74" height="74" fill="url(#szalon-dlg-' + f.id + ')"/></svg>';
  if (eleg) {
    h += '<p>' + f.em + ' ' + f.nev + '<br>Megveszed ' + f.ar + ' 💧-ért?</p>';
    h += '<div class="szalon-dlg-gombok"><button class="kis-gomb" id="szalon-dlg-igen">Igen ✓</button> <button class="kis-gomb" id="szalon-dlg-nem">Mégse</button></div>';
  } else {
    h += '<p>' + f.em + ' ' + f.nev + '<br>Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz! 💧</p>';
    h += '<div class="szalon-dlg-gombok"><button class="kis-gomb" id="szalon-dlg-nem">Rendben</button></div>';
  }
  return h + '</div></div>';
}
function szalonNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  SZALON_ECSET = null; SZALON_DLG = null; SZALON_SZOVEG = "Válassz festéket!";
  renderSzalon();
  mutat("kepernyo-szalon");
}
function szalonKot(el, fn) { el.style.cursor = "pointer"; el.addEventListener("click", fn); }
function renderSzalon() {
  var cp = $("szalon-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("szalon-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var host = $("szalon-szinter"); if (!host) return;
  host.innerHTML = szalonSVG() + szalonDlgHTML();
  var kg = document.getElementById("szalon-kefe-gondor"); if (kg) szalonKot(kg, function () { szalonKefe("gondor"); });
  var ke = document.getElementById("szalon-kefe-egyenes"); if (ke) szalonKot(ke, function () { szalonKefe("egyenes"); });
  host.querySelectorAll(".szalon-tegely").forEach(function (el) { szalonKot(el, function () { szalonTegely(el.getAttribute("data-f")); }); });
  host.querySelectorAll(".szalon-lapoz").forEach(function (el) { szalonKot(el, function () { hangGomb(); SZALON_LAP += +el.getAttribute("data-d"); renderSzalon(); }); });
  host.querySelectorAll(".szalon-rgomb").forEach(function (el) { szalonKot(el, function () { szalonFest(el.getAttribute("data-resz")); }); });
  [["uni-soreny", "soreny"], ["uni-farok", "farok"], ["uni-tincs", "tincs"]].forEach(function (p) {
    host.querySelectorAll("#szalon-uni ." + p[0]).forEach(function (el) { el.classList.add("szalon-resz"); szalonKot(el, function (e) { e.stopPropagation(); szalonFest(p[1]); }); });
  });
  var igen = $("szalon-dlg-igen"); if (igen) igen.addEventListener("click", szalonFestekVesz);
  var nem = $("szalon-dlg-nem"); if (nem) nem.addEventListener("click", function () { hangGomb(); SZALON_DLG = null; renderSzalon(); });
  var sugo = $("szalon-sugo");
  if (sugo) sugo.textContent = SZALON_ECSET ? "Koppints a sörényre, a farokra vagy a tincsre! 🖌️" : "Koppints egy festékre vagy egy kefére! 🎨";
}
function szalonTegely(fid) {
  hangGomb();
  if (fid === "szivacs") { SZALON_ECSET = "szivacs"; SZALON_SZOVEG = "Mit mossak le?"; mondd("Mit mossak le?"); renderSzalon(); return; }
  var f = FESTEK_BY[fid]; if (!f) return;
  if (P().szalon.festekek[fid]) { SZALON_ECSET = fid; SZALON_SZOVEG = f.nev + "! Hova fessem?"; mondd(f.nev + "! Hova fessem?"); renderSzalon(); return; }
  SZALON_DLG = fid;
  if ((P().tunderharmat || 0) >= f.ar) mondd(f.nev + ". Megveszed " + f.ar + " tündérharmatért?");
  else mondd("Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz!");
  renderSzalon();
}
function szalonFestekVesz() {
  var f = FESTEK_BY[SZALON_DLG]; SZALON_DLG = null;
  if (!f || (P().tunderharmat || 0) < f.ar) { hangGomb(); renderSzalon(); return; }
  P().tunderharmat -= f.ar; vasarlasNaplo("festek-" + f.id, f.ar, "tunderharmat");
  P().szalon.festekek[f.id] = 1;
  SZALON_ECSET = f.id; SZALON_SZOVEG = "Megvan! Hova fessem?";
  hangCsilla(); ment();
  mondd("Megvan! Hova fessem?");
  renderSzalon();
}
function szalonFest(resz) {
  if (!SZALON_ECSET) { hangGomb(); SZALON_SZOVEG = "Előbb válassz egy festéket!"; mondd("Előbb válassz egy festéket!"); renderSzalon(); return; }
  var nev = SZALON_RESZ_NEV[resz], fs = P().kinezet.festek;
  if (SZALON_ECSET === "szivacs") {
    if (!fs[resz]) { hangGomb(); SZALON_SZOVEG = "Ez már tiszta!"; mondd("Ez már tiszta!"); renderSzalon(); return; }
    fs[resz] = null; SZALON_SZOVEG = "Tiszta lett a " + nev + "!";
  } else {
    fs[resz] = SZALON_ECSET; SZALON_SZOVEG = "Hű, " + FESTEK_BY[SZALON_ECSET].nev.toLowerCase() + " " + nev + "!";
  }
  hangCsilla(); hangJo(); ment();
  mondd(SZALON_SZOVEG);
  renderSzalon();
}
function szalonKefe(cel) {
  var most = P().kinezet.frizura || "egyenes";
  if (most === cel) { hangGomb(); mondd(cel === "gondor" ? "Már göndör a sörény!" : "Már egyenes a sörény!"); return; }
  if (!P().szalon.kefek[cel]) {
    if ((P().tunderharmat || 0) < KEFE_AR) { hangGomb(); mondd("Ehhez a keféhez 12 tündérharmat kell. Gyűjts még kitartással!"); return; }
    P().tunderharmat -= KEFE_AR; vasarlasNaplo("kefe-" + cel, KEFE_AR, "tunderharmat");
    P().szalon.kefek[cel] = 1;
  }
  P().kinezet.frizura = cel;
  SZALON_SZOVEG = cel === "gondor" ? "Hopp, göndör lett!" : "Sima, egyenes sörény!";
  hangCsilla(); hangJo(); ment();
  mondd(cel === "gondor" ? "Hopp, göndör lett! Csigavonalak!" : "Sima, egyenes sörény! Szép!");
  renderSzalon();
}

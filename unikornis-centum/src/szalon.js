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
   Sorrend: fodrász · csillagbolt · ⛲ szökőkút · 🌙 pad · bank (a bank a jobb szélen). Ambient mozgás: style.css .u-*
   Térkép mint központ (rajzterv C: szökőkutas tér): 2. kör — a kertkapu helyén szökőkút (a Kert csak a térképről nyílik);
   3. kör — az odú-ház helyén holdfényes pad alvó cicával, az unikornis LÁTSZIK az utcán (uni: talppont + méret), onnan
   indul a szivárványhíd; a szivárvány alatt „🗺️ Térkép” tábla; a csillagbolt az utca fölött nyílik (utcaBoltNyit). */
var UTCA_ELR = {
  szeles: { w: 800, h: 460, fold: 290, hold: [86, 62], portal: [400, 138], tk: [400, -34],
    hazak: { fodrasz: [88, 430, 1.32], bolt: [244, 430, 1.32], kut: [392, 430, 1.25], pad: [556, 430, 1.25], bank: [712, 430, 1.32] },
    uni: [468, 432, 0.42], jardak: [430], lampak: [[166, 430], [322, 430], [634, 430]],
    csillagok: [[150, 30], [250, 80], [300, 24], [520, 40], [560, 96], [640, 30], [40, 140], [180, 170], [620, 170], [700, 110], [500, 200], [270, 210]] },
  allo: { w: 400, h: 760, fold: 268, hold: [46, 50], portal: [200, 150], tk: [0, -6],
    hazak: { fodrasz: [70, 470, 1], bolt: [200, 470, 1], bank: [330, 470, 1], kut: [112, 728, 1.15], pad: [318, 728, 1.05] },
    uni: [222, 730, 0.44], jardak: [470, 728], lampak: [[135, 470], [265, 470]],
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
/* ⛲ szökőkút (talppont: x, talp; s = méret; nincs név-táblája, nem visz sehová). Koppintásra magasabbra szökik a víz. */
function utcaKutRajz(x, talp, s) {
  var g = '<g id="utca-kut" class="utca-epulet" transform="translate(' + x + ' ' + talp + ') scale(' + s + ')">';
  g += '<rect x="-62" y="-96" width="124" height="104" fill="transparent"/>';
  g += '<circle class="u-feny" cx="0" cy="-40" r="66" fill="url(#u-izz)"/>';
  g += '<ellipse cx="0" cy="2" rx="60" ry="9" fill="#0a0f3a" opacity=".55"/>';
  g += '<path d="M-56 -14Q-55 0 -44 3H44Q55 0 56 -14Z" fill="#6f66b0"/><path d="M-56 -14Q-55 0 -44 3H44Q55 0 56 -14" fill="none" stroke="#4d4590" stroke-width="2"/>';
  g += '<ellipse cx="0" cy="-14" rx="56" ry="10" fill="#b9b0e6"/><ellipse cx="0" cy="-14" rx="49" ry="7.5" fill="#7fd0f0"/>';
  g += '<path d="M-30 -14h14M8 -12h18" stroke="#e6faff" stroke-width="2" stroke-linecap="round" opacity=".8"/>';
  g += '<rect x="-6" y="-58" width="12" height="44" rx="4" fill="#b9b0e6"/><rect x="-6" y="-58" width="4" height="44" fill="#d9d2f6"/>';
  g += '<path d="M-26 -60Q-24 -50 -12 -48H12Q24 -50 26 -60Z" fill="#8f86c9"/><ellipse cx="0" cy="-60" rx="26" ry="5.5" fill="#b9b0e6"/><ellipse cx="0" cy="-60" rx="21" ry="3.8" fill="#7fd0f0"/>';
  /* a lehulló vízfüggöny a felső tálból (folyik: a szaggatás eltolása) */
  g += '<g fill="none" stroke="#bfeeff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="5 7" opacity=".85">' +
    '<path d="M-22 -59Q-36 -54 -40 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".8s" repeatCount="indefinite"/></path>' +
    '<path d="M22 -59Q36 -54 40 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".8s" repeatCount="indefinite"/></path>' +
    '<path d="M-12 -59Q-20 -50 -22 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".9s" repeatCount="indefinite"/></path>' +
    '<path d="M12 -59Q20 -50 22 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".9s" repeatCount="indefinite"/></path></g>';
  /* a felszökő sugár + cseppek */
  g += '<g id="utca-kut-sugar"><path d="M0 -62V-84" stroke="#dff7ff" stroke-width="3.4" stroke-linecap="round"><animate attributeName="d" values="M0 -62V-80;M0 -62V-86;M0 -62V-80" dur="1.2s" repeatCount="indefinite"/></path>';
  [[-6, 0], [5, .4], [-2, .8]].forEach(function (c) {
    g += '<circle cx="' + c[0] + '" cy="-84" r="2" fill="#dff7ff" opacity="0"><animate attributeName="cy" values="-84;-62" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/><animate attributeName="cx" values="0;' + (c[0] * 3) + '" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/></circle>';
  });
  g += '</g>';
  g += uCsillam(-34, -18, 3.4, "#fff6a8", .3) + uCsillam(30, -16, 2.8, "#fff6a8", 1.4) + uCsillam(0, -96, 4, "#ffd24d", .8);
  return g + '</g>';
}
/* 🌙 holdfényes pad egy virágzó fa alatt, rajta alvó cica (talppont: x, talp; s = méret; nem visz sehová).
   Koppintásra a cica felébred, csóválja a farkát, aztán visszaalszik. */
function utcaPadRajz(x, talp, s) {
  var g = '<g id="utca-pad" class="utca-epulet" transform="translate(' + x + ' ' + talp + ') scale(' + s + ')">';
  g += '<rect x="-58" y="-150" width="116" height="158" fill="transparent"/>';
  g += '<rect x="-4" y="-104" width="9" height="106" rx="3" fill="#6b4a7a"/>';
  g += '<g class="u-lomb"><circle cx="0" cy="-118" r="38" fill="#b46aa8"/><circle cx="-28" cy="-104" r="22" fill="#c27bb6"/><circle cx="28" cy="-106" r="22" fill="#c27bb6"/>' +
    '<circle cx="-12" cy="-130" r="4" fill="#ffd0ea"/><circle cx="14" cy="-122" r="3.4" fill="#ffd0ea"/><circle cx="-24" cy="-110" r="3" fill="#ffd0ea"/><circle cx="26" cy="-102" r="3.2" fill="#ffd0ea"/><circle cx="2" cy="-104" r="2.6" fill="#ffd0ea"/></g>';
  g += '<circle class="u-feny" cx="-40" cy="-62" r="26" fill="url(#u-izz)"/><path d="M-40 -48V2" stroke="#2a2a5e" stroke-width="3"/><rect x="-46" y="-64" width="12" height="15" rx="4" fill="#fff2a0" stroke="#2a2a5e" stroke-width="2.4"/>';
  g += '<rect x="-30" y="-30" width="62" height="7" rx="3" fill="#a4734a"/><rect x="-30" y="-20" width="62" height="7" rx="3" fill="#b9845a"/>';
  g += '<path d="M-26 -13V2M28 -13V2" stroke="#6b4a33" stroke-width="4" stroke-linecap="round"/>';
  g += '<g id="utca-cica-alszik"><ellipse cx="8" cy="-38" rx="15" ry="9" fill="#f3c08a"/><circle cx="-5" cy="-40" r="7.5" fill="#f3c08a"/><path d="M-10 -46l2 -6l4 5M-3 -47l3 -6l2 6" fill="#f3c08a"/>' +
    '<path d="M-8 -40q2 1.6 4 0M-3 -40q2 1.6 4 0" stroke="#7a4a2a" stroke-width="1" fill="none"/><path d="M20 -34q8 2 6 -8" stroke="#f3c08a" stroke-width="4.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M2 -42q4 -2 8 0M8 -34q4 -2 8 0" stroke="#d9925a" stroke-width="1.6" fill="none"/>' +
    '<text x="4" y="-56" font-size="10" font-weight="700" fill="#cfd6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></text>' +
    '<text x="12" y="-66" font-size="8" font-weight="700" fill="#cfd6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin=".6s" repeatCount="indefinite"/></text></g>';
  g += '<g id="utca-cica-ebren" style="display:none"><ellipse cx="8" cy="-36" rx="13" ry="10" fill="#f3c08a"/><circle cx="-4" cy="-48" r="8" fill="#f3c08a"/><path d="M-10 -54l2 -7l4 5M-1 -55l3 -7l2 7" fill="#f3c08a"/>' +
    '<circle cx="-7" cy="-49" r="1.6" fill="#2a2140"/><circle cx="-1" cy="-49" r="1.6" fill="#2a2140"/><path d="M-5 -45q1 1 2 0" stroke="#7a4a2a" stroke-width="1" fill="none"/>' +
    '<path d="M20 -32q10 -4 8 -20" stroke="#f3c08a" stroke-width="4.6" fill="none" stroke-linecap="round"><animate attributeName="d" values="M20 -32q10 -4 8 -20;M20 -32q14 -2 14 -18;M20 -32q10 -4 8 -20" dur=".8s" repeatCount="indefinite"/></path>' +
    '<text x="10" y="-62" font-size="9" font-weight="700" fill="#ffd0ea">♥</text></g>';
  return g + '</g>';
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
  s += '<g transform="translate(' + (L.portal[0] - 200) + ',' + (L.portal[1] - 158) + ')">' + utcaPortalSVG() +
    /* a szivárvány a térképre visz: a „Matek” tábla alatt egy „Térkép” tábla (producer, 2026-10-06) */
    '<g id="utca-portal-terkep" class="utca-portal"><rect x="148" y="194" width="104" height="24" rx="12" fill="#e8f6e2" stroke="#3f9e6a" stroke-width="1.6"/>' +
    '<text x="200" y="211" text-anchor="middle" font-size="13" font-weight="800" fill="#2f7a50">🗺️ Térkép</text></g></g>';
  s += '<g transform="translate(' + L.tk[0] + ',' + L.tk[1] + ')">' + tkLepcsoSVG() + '</g>';   /* Égi Tüneménykert felhőlépcső (csak felhő-módban + pulton engedélyezve) */
  s += '<rect x="-400" y="' + L.fold + '" width="' + (w + 800) + '" height="' + (h - L.fold + 600) + '" fill="url(#utca-fold)"/>';
  L.jardak.forEach(function (y) { s += utcaJarda(w, y); });
  L.lampak.forEach(function (p) { s += utcaLampa(p[0], p[1]); });
  /* a házak hátulról előre (az álló elrendezésben az első sor takarja a hátsót) */
  var H = L.hazak, sor = [
    [H.fodrasz, utcaHely("utca-fodrasz", H.fodrasz, 54, utcaFodraszRajz(!P().szalon.nyitva, uni), "fodrász")],
    [H.bolt, utcaHely("utca-bolt", H.bolt, 150, utcaBoltRajz(), "csillagbolt")],
    [H.kut, utcaKutRajz(H.kut[0], H.kut[1], H.kut[2])],
    [H.pad, utcaPadRajz(H.pad[0], H.pad[1], H.pad[2])],
    [H.bank, utcaHely("utca-bank", H.bank, 200, utcaBankRajz(bankZarva()), "tündérbank")]
  ].sort(function (x, y) { return x[0][1] - y[0][1]; });
  sor.forEach(function (e) { s += e[1]; });
  /* az unikornis az utcán: itt érkezett a szivárványkapuból, innen indul vissza (utcaTavozik) */
  var u = L.uni;
  s += '<g id="utca-uni-all" pointer-events="none" transform="translate(' + u[0] + ' ' + u[1] + ') scale(' + u[2] + ')">' + unikornisSVG("utca-all-uni", c, 1, P().oltozet) + '</g>';
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
  $("odu-panel").hidden = true;   /* a bolt csukva (ha nyitva hagyta, amikor elment) */
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
  utcaKot("utca-bolt", function () { hangGomb(); utcaBoltNyit(); });
  utcaKot("utca-kut", function () {   /* ⛲ csak egy kedves apróság: magasabbra szökik a víz */
    hangCsilla(); mondd("Csobb!");
    var sug = $("utca-kut-sugar"); if (!sug) return;
    sug.classList.remove("szok"); void sug.getBoundingClientRect(); sug.classList.add("szok");
    clearTimeout(renderUtca._kut); renderUtca._kut = setTimeout(function () { sug.classList.remove("szok"); }, 700);
  });
  utcaKot("utca-pad", function () {   /* 🐈 a cica felébred, csóvál, aztán visszaalszik */
    hangGomb(); mondd("Miaú!");
    var a = $("utca-cica-alszik"), e = $("utca-cica-ebren"); if (!a || !e) return;
    a.style.display = "none"; e.style.display = "";
    clearTimeout(renderUtca._cica); renderUtca._cica = setTimeout(function () { a.style.display = ""; e.style.display = "none"; }, 2600);
  });
  utcaKot("utca-bank", function () { hangGomb(); bankNyit(); });
  utcaKot("utca-felhokert", tkLepcsoKoppint);
  utcaKot("utca-portal", utcaTavozik);
  utcaKot("utca-portal-terkep", utcaTavozik);
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
   a Matek-kapuból szivárványhíd nő le oda, ahol az unikornis áll (a szökőkút mellett), és felszalad rajta a kapuba.
   Közben egy második koppintás azonnal átvált. ── */
var _utcaTavozas = null;
function utcaTavozik() {
  if (_utcaTavozas) { utcaTavozasVege(); return; }
  var hely = $("utca-uni-hely"); if (!hely) { hangGomb(); visszaUgrik("utca"); return; }
  hangGomb(); mondd("Irány a térkép!");
  var tok = _utcaTavozas = {};
  var L = UTCA_ELR[UTCA_ELR_MOST] || UTCA_ELR.szeles, u = L.uni, k = u[2];
  var all = $("utca-uni-all"); if (all) all.style.display = "none";   /* a mozgó másolat veszi át a helyét */
  var ajto = [u[0], u[1]], kapu = [L.portal[0], L.portal[1] - 18];
  var ut = szivarvanyGorbe(ajto, [ajto[0], ajto[1] - 140], [kapu[0] + (ajto[0] < kapu[0] ? -110 : 110), kapu[1] + 20], kapu, 40);
  hely.innerHTML = '<g id="utca-uni-mozgo" style="transform:translate(' + ajto[0] + 'px,' + ajto[1] + 'px) scale(' + k + ')">' +
    '<g id="utca-uni-flip" style="--dir:' + (kapu[0] < ajto[0] ? -1 : 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG("utca-uni", LENYEK[mentes.leny], 1, P().oltozet) + '</g></g>';
  var m = $("utca-uni-mozgo"), fl = $("utca-uni-flip");
  uniNezoAdat(fl, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  hangCsilla();
  szivarvanyNo($("utca-hid"), ut, 34 * k / 0.42, 10 * k / 0.42, function () {
    if (_utcaTavozas !== tok) return;
    uniSzivarvanyba({ mozgo: m, el: fl, talp: [0, 0], ut: ut, skala: [k, k * 0.3], szikra: $("utca-hid-szikra") },
      function () { if (_utcaTavozas === tok) utcaTavozasVege(); });
  });
}
function utcaTavozasVege() {
  _utcaTavozas = null;
  var k = $("kepernyo-utca");
  if (!k || !k.classList.contains("aktiv")) return;   /* közben máshová ment */
  visszaUgrik("utca");   /* a térképen az utca-kapunál áll (ui.js) */
}
/* 🛍️ a Csillagbolt az utca fölött nyílik (Térkép mint központ, 3. kör): vásárlás az utcán, a megvett holmi rögtön a helyére
   kerül (a bútor az odúban, a ruha rajtad); rakosgatni otthon, a 🧺 Szekrényben lehet. Bezárva az utcán maradsz (oduPanelZar). */
function utcaBoltNyit() {
  mondd("Csillagbolt!");
  oduPanelNyit("holmik");
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
   unikornis a lila csillag-folton, alatta a gombsor; jobbra a pulton a két kefe (1. fázis).
   Menet: tégely → (ha nincs meg: „Megveszed?”) → ecset → rész → átszíneződik.
   PATALAKK (terv/fodraszat-patalakk-rendszerterv.html + patalakk-rajzterv.html, jóváhagyva 2026-10-07):
   fent az élő falipolc (2 × 4 üvegcse, ◀ ▶), patánként más lakk; a gombsor ahhoz igazodik, ami a kézben van
   (festék → 3 rész · lakk → 4 pata + „Mind a 4” · szivacs → két sor, mind a 7 hely · üres → 3 rész + „Paták”);
   a beszédbuborék jobbra, a fej mellé került (fent a polc van).
   SZŐRFESTÉS (terv/fodraszat-szorfestes-rendszerterv.html + szorfestes-rajzterv.html, jóváhagyva 2026-10-07):
   jobbra fent, a régi „szőrfesték · hamarosan” díszlet helyén az élő szőrfesték-polc (2 × 4 öblös üveg);
   egy még meg nem vett szőrre koppintva az unikornis 2 mp-re felveszi („Így néznél ki!”), csak utána kérdez;
   kézben szőrfestékkel a testre vagy a nagy „Szőr” gombra koppintva: söprés a fejtől a farig → megrázza magát →
   körbefordul (uniPorog) → „Nézd, milyen szép lettem!”. A szivacs a „Szőr” gombbal / a testen lemossa. */
var FESTEK_OLDAL = 8;          /* ennyi tégely fér a szekrény egy oldalára */
var LAKK_OLDAL = 8;            /* ennyi üvegcse fér a falipolc egy oldalára */
var SZOR_OLDAL = 8;            /* ennyi öblös üveg fér a szőrfesték-polcra */
var SZALON_ECSET = null;       /* null | festék-id | "szivacs" */
var SZALON_LAKK = null;        /* null | lakk-id (a kézben lévő lakk; kizárja az ecsetet) */
var SZALON_SZOR = null;        /* null | szőrfesték-id (a kézben lévő szőrfesték; kizárja az ecsetet és a lakkot) */
var SZALON_PROBA = null;       /* a 2 mp-es próba alatt (és a „Megveszed?” alatt) ezt a szőrt viseli */
var SZALON_SOPRES = null;      /* festés közben: { regi: szőr-id | null } — a régi szőr fölött végigfut az új */
var SZALON_ZAR = false;        /* az öröm-pillanat alatt nem lehet koppintani */
var SZALON_PROBA_MS = 2000;
var _szalonProbaT = null;
var SZALON_LAP = 0;
var SZALON_LAKK_LAP = 0;
var SZALON_SZOVEG = "Válassz festéket!";
var SZALON_DLG = null;         /* a megvételre kérdezett festék / lakk id-je (vásárlás-ablak) */
var SZALON_DLG_T = "festek";   /* "festek" | "lakk" | "szor" */
var SZALON_VILLAN = null;      /* egyszeri jelzés a következő rajzolásra: "polc" | "szorpolc" | "szekreny" */
var SZALON_CSILL = [];         /* egyszeri csillanás ezeken a patákon */
var SZALON_RESZ_NEV = { soreny: "sörény", farok: "farok", tincs: "tincs" };
var SZALON_PATA_D = "M0 0 Q12 -3 24 0 L26.5 15 Q12 16.5 -2.5 15 Z";   /* a pata alakja a gombokon (pataD, helyi keret) */

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
/* kis pata (lábcsonkkal) a pata-gombon, a felkent lakkal — vagy a lény saját pataszínével */
function szalonPataIkon(rajz, x, y, s, lid, pid) {
  var sz = UNI_SZIN[rajz] || UNI_SZIN.korall, l = LAKK_BY[lid], tr = 'transform="translate(' + x + ' ' + y + ') scale(' + s + ')"';
  var lab = '<path d="M3 -12 L21 -12 L22 0 L2 0 Z" fill="' + sz.lab + '" stroke="#222" stroke-width="1.4"/>';
  if (!l) return '<g ' + tr + '>' + lab + '<path d="' + SZALON_PATA_D + '" fill="' + sz.pata + '" stroke="#222" stroke-width="1.6"/></g>';
  var f = lakkFolt(l, pid, SZALON_PATA_D, [0, 0, 24, 15], sz.pata, ' stroke="none"');
  return '<g ' + tr + '><defs>' + f.defs + '</defs>' + lab + f.svg + '<path d="' + SZALON_PATA_D + '" fill="none" stroke="#222" stroke-width="1.6"/></g>';
}
/* kis unikornis-sziluett a „Szőr” gombon, a felkent (vagy a saját) szőrszínnel */
function szalonSzorIkon(rajz, szid, x, y, s) {
  var sz = UNI_SZIN[rajz] || UNI_SZIN.korall, f = SZOR_BY[szid], fill = szorKitoltes(f, "szalon-szm-" + (f && f.id)) || sz.test, lab = f ? f.has : sz.lab;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
    '<rect x="-9" y="2" width="4" height="9" rx="1" fill="' + lab + '"/><rect x="5" y="2" width="4" height="9" rx="1" fill="' + lab + '"/>' +
    '<ellipse cx="0" cy="0" rx="13" ry="7" fill="' + fill + '"/><ellipse cx="13" cy="-7" rx="6" ry="5" fill="' + fill + '"/>' +
    '<path d="M14 -11 L19 -19 L17 -10 Z" fill="' + sz.szarv + '" stroke-width="1"/></g>';
}
/* egy öblös szőrfesték-üveg a polcon (x = közép, y = az üveg alja = a polc teteje); ár vagy ✓ a sarokban */
function szalonSzorUveg(f, x, y, megvan, kezben) {
  var s = '<g class="szalon-szuveg" data-sz="' + f.id + '"><rect x="' + (x - 12) + '" y="' + (y - 26) + '" width="24" height="27" fill="transparent"/>';   /* koppintó-felület */
  if (kezben) s += '<circle cx="' + x + '" cy="' + (y - 10) + '" r="15" fill="url(#szalon-ecset-feny)"/>';
  s += '<rect x="' + (x - 5) + '" y="' + (y - 25) + '" width="10" height="5" rx="1.5" fill="#8a4fd0" stroke="#4a3a5a" stroke-width=".8"/>' +
    '<rect x="' + (x - 3.5) + '" y="' + (y - 20.5) + '" width="7" height="4" fill="#f4f0f8" stroke="#4a3a5a" stroke-width=".8"/>' +
    '<ellipse cx="' + x + '" cy="' + (y - 8.5) + '" rx="10" ry="8.5" fill="#f4f0f8" stroke="#4a3a5a" stroke-width="1"/>' +
    '<ellipse cx="' + x + '" cy="' + (y - 7.5) + '" rx="8.2" ry="6.6" fill="' + szorKitoltes(f, "szalon-szm-" + f.id) + '"/>' +
    '<path d="M' + (x - 6) + ' ' + (y - 12) + ' Q' + (x - 5) + ' ' + (y - 14.5) + ' ' + (x - 2) + ' ' + (y - 15) + '" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>';
  if (megvan) s += '<circle cx="' + (x + 8) + '" cy="' + (y - 18) + '" r="4.4" fill="#3fae6a" stroke="#fff" stroke-width="1"/><text x="' + (x + 8) + '" y="' + (y - 15.9) + '" text-anchor="middle" font-size="5.8" font-weight="900" fill="#fff">✓</text>';
  else s += '<circle cx="' + (x + 8) + '" cy="' + (y - 18) + '" r="5" fill="#fff" stroke="#39b7d6" stroke-width=".9"/><text x="' + (x + 8) + '" y="' + (y - 16.1) + '" text-anchor="middle" font-size="5.4" font-weight="900" fill="#1587b3">' + f.ar + '</text>' +
    '<path d="M' + (x + 12.5) + ' ' + (y - 24) + ' q2 2.6 0 3.6 q-2 -1 0 -3.6 Z" fill="#39b7d6"/>';
  return s + '</g>';
}
/* egy üvegcse a falipolcon (x = közép, y = az üvegcse alja) */
function szalonUvegcse(l, x, y, pid, megvan, kezben) {
  var d = "M" + (x - 7) + " " + (y - 13) + " Q" + (x - 7) + " " + (y - 15) + " " + (x - 5) + " " + (y - 15) + " L" + (x + 5) + " " + (y - 15) + " Q" + (x + 7) + " " + (y - 15) + " " + (x + 7) + " " + (y - 13) +
    " L" + (x + 7) + " " + (y - 2) + " Q" + (x + 7) + " " + y + " " + (x + 5) + " " + y + " L" + (x - 5) + " " + y + " Q" + (x - 7) + " " + y + " " + (x - 7) + " " + (y - 2) + " Z";
  var f = lakkFolt(l, pid, d, [x - 7, y - 15, x + 7, y], l.atl ? "#ebe6ff" : "#fff", ' stroke="#4a3a5a" stroke-width="1"');
  var s = '<g class="szalon-uveg" data-l="' + l.id + '"><rect x="' + (x - 17) + '" y="' + (y - 25) + '" width="34" height="26" fill="transparent"/>';   /* koppintó-felület */
  if (kezben) s += '<circle cx="' + x + '" cy="' + (y - 11) + '" r="15" fill="url(#szalon-ecset-feny)"/>';
  s += '<defs>' + f.defs + '</defs>' + f.svg +
    '<rect x="' + (x - 2.5) + '" y="' + (y - 19) + '" width="5" height="4" fill="#ddd" stroke="#4a3a5a" stroke-width=".8"/>' +
    '<rect x="' + (x - 3.5) + '" y="' + (y - 25) + '" width="7" height="6.5" rx="1.5" fill="#2b2233"/>';
  if (megvan) s += '<circle cx="' + (x + 12) + '" cy="' + (y - 9) + '" r="4.6" fill="#3fae6a" stroke="#fff" stroke-width="1.1"/><text x="' + (x + 12) + '" y="' + (y - 6.8) + '" text-anchor="middle" font-size="6" font-weight="900" fill="#fff">✓</text>';
  else s += '<rect x="' + (x + 8) + '" y="' + (y - 13) + '" width="16" height="9" rx="4.5" fill="#fff" stroke="#39b7d6" stroke-width="1"/><text x="' + (x + 16) + '" y="' + (y - 6.6) + '" text-anchor="middle" font-size="5.6" font-weight="800" fill="#1587b3">' + l.ar + '💧</text>';
  return s + '</g>';
}
function szalonGomb(cls, data, x, y, w, h, belso, kiemel) {
  return '<g class="' + cls + '" ' + data + '><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (h > 30 ? 12 : 9) + '" fill="#fff" stroke="' + (kiemel ? "#f0a800" : "#8a4fd0") + '" stroke-width="' + (kiemel ? 3 : 1.6) + '"/>' + belso + '</g>';
}
/* a gombsor: ahhoz igazodik, ami a gyerek kezében van */
function szalonGombsor(rajz, kin, alapSz) {
  var s = "", lakk = kin.lakk || [], festo = SZALON_ECSET && SZALON_ECSET !== "szivacs", mos = SZALON_ECSET === "szivacs";
  function szorGomb(x, y, w, h, kiemel, hosszu) {   /* a „Szőr” gomb: kicsi (üres kéz, szivacs) vagy egy nagy (szőrfesték a kézben) */
    s += szalonGomb("szalon-sgomb", 'data-szor="1"', x, y, w, h, h > 30
      ? szalonSzorIkon(rajz, kin.szor, x + (hosszu ? 34 : w / 2 - 3), y + (hosszu ? h / 2 + 2 : 18), hosszu ? 1.1 : .8) +
        '<text x="' + (hosszu ? x + 64 : x + w / 2) + '" y="' + (hosszu ? y + h / 2 + 4 : y + h - 5) + '"' + (hosszu ? '' : ' text-anchor="middle"') + ' font-size="' + (hosszu ? 12 : 10) + '" font-weight="800" fill="#5a3a90">' + (hosszu ? "Szőr · vagy koppints a testemre!" : "Szőr") + '</text>'
      : szalonSzorIkon(rajz, kin.szor, x + 13, y + h / 2 + 1, .55) + '<text x="' + (x + 27) + '" y="' + (y + h / 2 + 3.5) + '" font-size="9.5" font-weight="800" fill="#5a3a90">Szőr</text>', kiemel);
  }
  function reszek(y, h, w, x0, gap) {
    [["soreny", "Sörény"], ["farok", "Farok"], ["tincs", "Tincs"]].forEach(function (g, i) {
      var fid = kin.festek && kin.festek[g[0]], x = x0 + i * (w + gap), cx = x + w / 2;
      var fill = FESTEK_BY[fid] ? "url(#szalon-teg-" + fid + ")" : alapSz;
      s += szalonGomb("szalon-rgomb", 'data-resz="' + g[0] + '"', x, y, w, h, h > 30
        ? szalonReszIkon(g[0], cx, y + 16, fill) + '<text x="' + cx + '" y="' + (y + h - 5) + '" text-anchor="middle" font-size="10" font-weight="800" fill="#5a3a90">' + g[1] + '</text>'
        : szalonReszIkon(g[0], x + 14, y + h / 2, fill) + '<text x="' + (x + 28) + '" y="' + (y + h / 2 + 3.5) + '" font-size="9.5" font-weight="800" fill="#5a3a90">' + g[1] + '</text>', festo || mos);
    });
  }
  function patak(y, h, w, x0, gap) {
    for (var i = 0; i < 4; i++) {
      var x = x0 + i * (w + gap), nagy = h > 30;
      s += szalonGomb("szalon-pgomb", 'data-pata="' + i + '"', x, y, w, h, szalonPataIkon(rajz, x + w / 2 - (nagy ? 10 : 7.5), y + (nagy ? 21 : 11), nagy ? 0.84 : 0.62, lakk[i], "szalon-gp" + i), !!SZALON_LAKK || mos);
    }
    var xm = x0 + 4 * (w + gap);
    s += szalonGomb("szalon-pgomb", 'data-pata="mind"', xm, y, 50, h, h > 30
      ? '<text x="' + (xm + 25) + '" y="' + (y + 22) + '" text-anchor="middle" font-size="14">✨</text><text x="' + (xm + 25) + '" y="' + (y + h - 5) + '" text-anchor="middle" font-size="9.5" font-weight="800" fill="#5a3a90">Mind a 4</text>'
      : '<text x="' + (xm + 12) + '" y="' + (y + h / 2 + 3.5) + '" text-anchor="middle" font-size="9.5">✨</text><text x="' + (xm + 33) + '" y="' + (y + h / 2 + 3.5) + '" text-anchor="middle" font-size="8.5" font-weight="800" fill="#5a3a90">Mind</text>', !!SZALON_LAKK || mos);
  }
  if (SZALON_SZOR) szorGomb(122, 242, 270, 46, true, true);
  else if (SZALON_LAKK) patak(242, 46, 40, 122, 6);
  else if (mos) { reszek(236, 26, 64, 122, 5); szorGomb(332, 236, 60, 26, true); patak(266, 26, 34, 122, 6); }
  else if (festo) reszek(242, 46, 52, 122, 6);
  else {   /* üres kéz: 3 rész + „Paták” + „Szőr” (az utóbbi kettő a polcra mutat) */
    reszek(242, 46, 48, 122, 5);
    s += szalonGomb("szalon-pgomb", 'data-pata="sugo"', 281, 242, 52, 46, szalonPataIkon(rajz, 297, 261, 0.8, null, "szalon-gpk") + '<text x="307" y="283" text-anchor="middle" font-size="10" font-weight="800" fill="#5a3a90">Paták</text>', false);
    szorGomb(338, 242, 54, 46, false);
  }
  return s;
}
/* sortördelés a beszédbuborékhoz (n = kb. ennyi betű fér egy sorba) */
function szalonTordel(t, n) {
  var sor = [], most = "";
  String(t).split(" ").forEach(function (w) { if ((most + " " + w).trim().length > n && most) { sor.push(most); most = w; } else most = (most + " " + w).trim(); });
  if (most) sor.push(most);
  return sor;
}
function szalonSVG() {
  var c = LENYEK[mentes.leny], rajz = (c && c.rajz) || "korall";
  var kin = P().kinezet, most = kin.frizura || "egyenes", van = P().szalon.festekek, vanL = P().szalon.lakkok || {};
  var alapSz = (SORENY_SZIN[rajz] && SORENY_SZIN[rajz][kin.sorenySzin || 0] || SORENY_SZIN.korall[0]).c[0];
  var i;
  var s = '<svg class="szalon-svg' + (SZALON_ECSET ? " festheto" : "") + (SZALON_LAKK || SZALON_ECSET === "szivacs" ? " lakkozhato" : "") + (SZALON_SZOR || SZALON_ECSET === "szivacs" ? " szorfesto" : "") + '" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  var defs = '<radialGradient id="szalon-ecset-feny" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6a8" stop-opacity="0.95"/><stop offset="1" stop-color="#fff6a8" stop-opacity="0"/></radialGradient>';
  FESTEKEK.forEach(function (f) { defs += festekFoltDef(f, "szalon-teg-" + f.id); });
  SZORFESTEKEK.forEach(function (f) { if (f.minta) defs += szorMintaDef(f, "szalon-szm-" + f.id, "kicsi"); });
  s += '<defs>' + defs + '</defs>';
  s += '<rect x="0" y="0" width="400" height="300" fill="#c6e6f2"/><rect x="0" y="262" width="400" height="38" fill="#b9d9ec"/>';   /* fal + padló */

  /* ÉLŐ FALIPOLC: 2 sor × 4 üvegcse, több lakknál ◀ ▶ (alatta az oldalszám) */
  var lapok = Math.max(1, Math.ceil(LAKKOK.length / LAKK_OLDAL));
  if (SZALON_LAKK_LAP >= lapok) SZALON_LAKK_LAP = lapok - 1;
  if (SZALON_LAKK_LAP < 0) SZALON_LAKK_LAP = 0;
  s += '<rect x="114" y="2" width="184" height="58" rx="6" fill="#eaf6fb" opacity=".7"/>';
  if (SZALON_VILLAN === "polc") s += '<rect class="szalon-villan" x="114" y="2" width="184" height="58" rx="6" fill="none" stroke="#f0a800" stroke-width="3"/>';
  s += '<rect x="132" y="31" width="148" height="4" rx="1.5" fill="#b0733f"/><rect x="132" y="56" width="148" height="4" rx="1.5" fill="#b0733f"/>';
  LAKKOK.slice(SZALON_LAKK_LAP * LAKK_OLDAL, SZALON_LAKK_LAP * LAKK_OLDAL + LAKK_OLDAL).forEach(function (l, j) {
    s += szalonUvegcse(l, 147 + (j % 4) * 38, 31 + Math.floor(j / 4) * 25, "szalon-uv" + j, !!vanL[l.id], SZALON_LAKK === l.id);
  });
  if (lapok > 1) {
    s += '<g class="szalon-llapoz" data-d="-1" opacity="' + (SZALON_LAKK_LAP > 0 ? 1 : 0.3) + '"><circle cx="122" cy="31" r="11" fill="transparent"/><circle cx="122" cy="31" r="7" fill="#ffd9a0"/><text x="122" y="34" text-anchor="middle" font-size="8" font-weight="900" fill="#7a1818">◀</text></g>';
    s += '<g class="szalon-llapoz" data-d="1" opacity="' + (SZALON_LAKK_LAP < lapok - 1 ? 1 : 0.3) + '"><circle cx="290" cy="31" r="11" fill="transparent"/><circle cx="290" cy="31" r="7" fill="#ffd9a0"/><text x="290" y="34" text-anchor="middle" font-size="8" font-weight="900" fill="#7a1818">▶</text></g>';
    s += '<text x="122" y="52" text-anchor="middle" font-size="7.5" font-weight="800" fill="#7a1818">' + (SZALON_LAKK_LAP + 1) + '/' + lapok + '</text>';
  }
  /* ÉLŐ SZŐRFESTÉK-POLC: 2 sor × 4 öblös üveg (a régi „szőrfesték · hamarosan” díszlet helyén) */
  var vanSz = P().szalon.szorfestekek || {};
  s += '<rect x="301" y="2" width="97" height="58" rx="6" fill="#fdf0fa" opacity=".8"/>';
  if (SZALON_VILLAN === "szorpolc") s += '<rect class="szalon-villan" x="301" y="2" width="97" height="58" rx="6" fill="none" stroke="#f0a800" stroke-width="3"/>';
  s += '<rect x="303" y="29" width="93" height="3.5" rx="1.5" fill="#b0733f"/><rect x="303" y="56" width="93" height="3.5" rx="1.5" fill="#b0733f"/>';
  SZORFESTEKEK.slice(0, SZOR_OLDAL).forEach(function (f, j) {   /* ► 8-nál több szőrfestéknél ide jön a lapozó, mint a lakk-polcon */
    s += szalonSzorUveg(f, 313 + (j % 4) * 24, 29 + Math.floor(j / 4) * 27, !!vanSz[f.id], SZALON_SZOR === f.id);
  });

  /* FESTÉK-SZEKRÉNY: 2 oszlop × 4 sor = 8 tégely/oldal; több festéknél ◀ ▶ lapozó */
  lapok = Math.max(1, Math.ceil(FESTEKEK.length / FESTEK_OLDAL));
  if (SZALON_LAP >= lapok) SZALON_LAP = lapok - 1;
  if (SZALON_LAP < 0) SZALON_LAP = 0;
  s += '<rect x="8" y="48" width="100" height="214" rx="4" fill="#7a1818" stroke="#5c1010" stroke-width="2"/>';
  s += '<text x="58" y="61" text-anchor="middle" font-size="8.5" font-weight="800" fill="#ffd9a0" font-style="italic">sörény- és farokfesték</text>';
  if (SZALON_VILLAN === "szekreny") s += '<rect class="szalon-villan" x="8" y="48" width="100" height="214" rx="4" fill="none" stroke="#f0a800" stroke-width="3.5"/>';
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

  /* lila csillag-folt + a NAGY unikornis (a közös unikornisSVG — frizura, bolti szín, festék, lakk mind rajta) */
  s += '<ellipse cx="208" cy="214" rx="92" ry="22" fill="#b98fd8"/>' + csillagSVG(208, 210, 26, "#ecdafb");
  /* a próba alatt a próbált szőr; festéskor a régi szőr fölött a fejtől a farig végigfut az új (söprés, 1 mp) */
  var kinM = {}, k; for (k in kin) kinM[k] = kin[k];
  if (SZALON_PROBA) kinM.szor = SZALON_PROBA;
  s += '<g transform="translate(208,207)"><g id="szalon-uni-forg" style="transform:scale(var(--dir,1),1)"><g id="szalon-uni-razo">';
  if (SZALON_SOPRES) {
    var kinR = {}; for (k in kinM) kinR[k] = kinM[k]; kinR.szor = SZALON_SOPRES.regi;
    s += unikornisSVG("szalon-uni-regi", c, 1.12, P().oltozet, kinR) +
      '<clipPath id="szalon-sopres" clipPathUnits="userSpaceOnUse"><rect x="90" y="-160" width="0" height="200">' +
      '<animate attributeName="x" from="90" to="-100" dur="1s" fill="freeze"/><animate attributeName="width" from="0" to="190" dur="1s" fill="freeze"/></rect></clipPath>' +
      '<g clip-path="url(#szalon-sopres)">' + unikornisSVG("szalon-uni", c, 1.12, P().oltozet, kinM) + '</g>';
  } else s += unikornisSVG("szalon-uni", c, 1.12, P().oltozet, kinM);
  s += '</g></g></g>';
  if (SZALON_PROBA && !SZALON_DLG) s += '<text x="208" y="238" text-anchor="middle" font-size="9" font-weight="800" fill="#8a4fd0">✨ próba ✨</text>';

  /* beszédbuborék: jobbra, a fejjel egy magasságban, a kefék alatt */
  var sorok = szalonTordel(SZALON_SZOVEG, 19), bh = Math.max(34, 14 + sorok.length * 12), ty = 136 + (bh - sorok.length * 12) / 2 + 9;
  s += '<path d="M302 136 h88 a8 8 0 0 1 8 8 v' + (bh - 16) + ' a8 8 0 0 1 -8 8 h-88 a8 8 0 0 1 -8 -8 v-' + (bh - 26) + ' l-8 -4 l8 -4 v-2 a8 8 0 0 1 8 -8 Z" fill="#fff" stroke="#e0417a" stroke-width="1.6"/>';
  sorok.forEach(function (t, k) { s += '<text x="346" y="' + (ty + k * 12) + '" text-anchor="middle" font-size="9.5" font-weight="800" fill="#e0417a">' + t + '</text>'; });

  s += szalonGombsor(rajz, kin, alapSz);
  s += '</svg>';
  return s;
}
/* vásárlás-ablak: festékfolt / lakkos pata + „Megveszed?” (vagy kedves mondat, ha kevés a 💧) */
function szalonDlgHTML() {
  var lakk = SZALON_DLG_T === "lakk", szor = SZALON_DLG_T === "szor", f = szor ? SZOR_BY[SZALON_DLG] : lakk ? LAKK_BY[SZALON_DLG] : FESTEK_BY[SZALON_DLG]; if (!f) return "";
  var eleg = (P().tunderharmat || 0) >= f.ar;
  var h = '<div class="szalon-dlg' + (szor ? ' also' : '') + '"><div class="szalon-dlg-kartya">';
  if (szor) {
    var cr = (LENYEK[mentes.leny] || {}).rajz || "korall";
    h += '<svg viewBox="-22 -24 46 38" width="96" height="78"><defs>' + (f.minta ? szorMintaDef(f, "szalon-szm-" + f.id, "kicsi") : "") + '</defs>' + szalonSzorIkon(cr, f.id, 0, 0, 1.4) + '</svg>';
  } else if (lakk) {
    var c = LENYEK[mentes.leny], sz = UNI_SZIN[(c && c.rajz) || "korall"] || UNI_SZIN.korall, lf = lakkFolt(f, "szalon-dlg-l-" + f.id, SZALON_PATA_D, [0, 0, 24, 15], sz.pata, ' stroke="none"');
    h += '<svg viewBox="-6 -6 36 26" width="96" height="70"><defs>' + lf.defs + '</defs>' + lf.svg + '<path d="' + SZALON_PATA_D + '" fill="none" stroke="#222" stroke-width="1.6"/></svg>';
  } else h += '<svg viewBox="0 0 74 74" width="74" height="74" class="szalon-dlg-folt"><defs>' + festekFoltDef(f, "szalon-dlg-" + f.id) + '</defs><rect width="74" height="74" fill="url(#szalon-dlg-' + f.id + ')"/></svg>';
  if (eleg) {
    h += '<p>' + f.em + ' ' + f.nev + (lakk ? ' lakk' : szor ? ' szőr' : '') + '<br>Megveszed ' + f.ar + ' 💧-ért?</p>';
    h += '<div class="szalon-dlg-gombok"><button class="kis-gomb" id="szalon-dlg-igen">Igen ✓</button> <button class="kis-gomb" id="szalon-dlg-nem">Mégse</button></div>';
  } else {
    h += '<p>' + f.em + ' ' + f.nev + (lakk ? ' lakk' : szor ? ' szőr' : '') + '<br>Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz! 💧</p>';
    h += '<div class="szalon-dlg-gombok"><button class="kis-gomb" id="szalon-dlg-nem">Rendben</button></div>';
  }
  return h + '</div></div>';
}
function szalonNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  szalonProbaVege(); SZALON_SOPRES = null; SZALON_ZAR = false;
  SZALON_ECSET = null; SZALON_LAKK = null; SZALON_SZOR = null; SZALON_DLG = null; SZALON_SZOVEG = "Válassz festéket, lakkot vagy szőrfestéket!";
  renderSzalon();
  mutat("kepernyo-szalon");
}
function szalonKot(el, fn) { el.style.cursor = "pointer"; el.addEventListener("click", fn); }
/* rövid csillanás egy patán (a csillag a pata fölé kerül, a rajz saját koordinátáiban) */
function szalonCsillan(el) {
  try {
    var bb = el.getBBox(), g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(" + (bb.x + bb.width * 0.7) + " " + (bb.y + 2) + ")");
    g.setAttribute("pointer-events", "none");
    g.innerHTML = '<g class="szalon-csill">' + lkCs(0, 0, 9, "#fff") + '</g>';
    el.parentNode.appendChild(g);
  } catch (e) {}
}
function renderSzalon() {
  var cp = $("szalon-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("szalon-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var host = $("szalon-szinter"); if (!host) return;
  host.innerHTML = szalonSVG() + szalonDlgHTML();
  var kg = document.getElementById("szalon-kefe-gondor"); if (kg) szalonKot(kg, function () { szalonKefe("gondor"); });
  var ke = document.getElementById("szalon-kefe-egyenes"); if (ke) szalonKot(ke, function () { szalonKefe("egyenes"); });
  host.querySelectorAll(".szalon-tegely").forEach(function (el) { szalonKot(el, function () { szalonTegely(el.getAttribute("data-f")); }); });
  host.querySelectorAll(".szalon-uveg").forEach(function (el) { szalonKot(el, function () { szalonLakk(el.getAttribute("data-l")); }); });
  host.querySelectorAll(".szalon-szuveg").forEach(function (el) { szalonKot(el, function () { szalonSzor(el.getAttribute("data-sz")); }); });
  host.querySelectorAll(".szalon-sgomb").forEach(function (el) { szalonKot(el, function () { szalonSzorFest(); }); });
  host.querySelectorAll("#szalon-uni .uni-szor").forEach(function (el) { szalonKot(el, function (e) { e.stopPropagation(); szalonSzorFest(); }); });
  host.querySelectorAll(".szalon-lapoz").forEach(function (el) { szalonKot(el, function () { hangGomb(); SZALON_LAP += +el.getAttribute("data-d"); renderSzalon(); }); });
  host.querySelectorAll(".szalon-llapoz").forEach(function (el) { szalonKot(el, function () { hangGomb(); SZALON_LAKK_LAP += +el.getAttribute("data-d"); renderSzalon(); }); });
  host.querySelectorAll(".szalon-rgomb").forEach(function (el) { szalonKot(el, function () { szalonFest(el.getAttribute("data-resz")); }); });
  host.querySelectorAll(".szalon-pgomb").forEach(function (el) { szalonKot(el, function () { var d = el.getAttribute("data-pata"); szalonLakkoz(d === "mind" || d === "sugo" ? d : +d); }); });
  [["uni-soreny", "soreny"], ["uni-farok", "farok"], ["uni-tincs", "tincs"]].forEach(function (p) {
    host.querySelectorAll("#szalon-uni ." + p[0]).forEach(function (el) { el.classList.add("szalon-resz"); szalonKot(el, function (e) { e.stopPropagation(); szalonFest(p[1]); }); });
  });
  /* a nagy unikornis patái: nagyobb, láthatatlan koppintó-felület + csillanás a frissen lakkozottakon */
  host.querySelectorAll("#szalon-uni path[data-pata]").forEach(function (el) {
    var i = +el.getAttribute("data-pata"), fogo = el.cloneNode(false);
    fogo.removeAttribute("class"); fogo.setAttribute("fill", "transparent"); fogo.setAttribute("stroke", "transparent"); fogo.setAttribute("stroke-width", "16");
    el.classList.add("szalon-pata");
    el.parentNode.appendChild(fogo);
    [el, fogo].forEach(function (x) { szalonKot(x, function (e) { e.stopPropagation(); szalonLakkoz(i); }); });
    if (SZALON_CSILL.indexOf(i) >= 0) szalonCsillan(el);
  });
  SZALON_VILLAN = null; SZALON_CSILL = [];
  var igen = $("szalon-dlg-igen"); if (igen) igen.addEventListener("click", szalonFestekVesz);
  var nem = $("szalon-dlg-nem"); if (nem) nem.addEventListener("click", function () { hangGomb(); SZALON_DLG = null; szalonProbaVege(); renderSzalon(); });
  var sugo = $("szalon-sugo");
  if (sugo) sugo.textContent = SZALON_SZOR ? "Koppints az unikornis testére! 🖌️" : SZALON_LAKK ? "Koppints egy patára! 💅" : SZALON_ECSET === "szivacs" ? "Koppints arra, amit lemosnál! 🧽" : SZALON_ECSET ? "Koppints a sörényre, a farokra vagy a tincsre! 🖌️" : "Koppints egy festékre, egy lakkra, egy szőrfestékre vagy egy kefére! 🎨";
}
function szalonMond(t) { SZALON_SZOVEG = t; mondd(t); }
function szalonTegely(fid) {
  hangGomb();
  if (SZALON_ZAR) return;
  szalonProbaVege();
  if (fid === "szivacs") { SZALON_ECSET = "szivacs"; SZALON_LAKK = null; SZALON_SZOR = null; szalonMond("Mit mossak le?"); renderSzalon(); return; }
  var f = FESTEK_BY[fid]; if (!f) return;
  if (P().szalon.festekek[fid]) { SZALON_ECSET = fid; SZALON_LAKK = null; SZALON_SZOR = null; szalonMond(f.nev + "! Hova fessem?"); renderSzalon(); return; }
  SZALON_DLG = fid; SZALON_DLG_T = "festek";
  if ((P().tunderharmat || 0) >= f.ar) mondd(f.nev + ". Megveszed " + f.ar + " tündérharmatért?");
  else mondd("Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz!");
  renderSzalon();
}
/* lakk a falipolcról: ha megvan, a kézbe kerül; ha nincs, „Megveszed?” */
function szalonLakk(lid) {
  hangGomb();
  if (SZALON_ZAR) return;
  szalonProbaVege();
  var l = LAKK_BY[lid]; if (!l) return;
  if ((P().szalon.lakkok || {})[lid]) { SZALON_LAKK = lid; SZALON_ECSET = null; SZALON_SZOR = null; szalonMond(l.nev + "! Melyik patára?"); renderSzalon(); return; }
  SZALON_DLG = lid; SZALON_DLG_T = "lakk";
  if ((P().tunderharmat || 0) >= l.ar) mondd(l.nev + " lakk. Megveszed " + l.ar + " tündérharmatért?");
  else mondd("Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz!");
  renderSzalon();
}
function szalonFestekVesz() {
  if (SZALON_DLG_T === "szor") { szalonSzorVesz(); return; }
  var lakk = SZALON_DLG_T === "lakk", f = lakk ? LAKK_BY[SZALON_DLG] : FESTEK_BY[SZALON_DLG]; SZALON_DLG = null;
  if (!f || (P().tunderharmat || 0) < f.ar) { hangGomb(); renderSzalon(); return; }
  P().tunderharmat -= f.ar; vasarlasNaplo((lakk ? "lakk-" : "festek-") + f.id, f.ar, "tunderharmat");
  if (lakk) { if (!P().szalon.lakkok) P().szalon.lakkok = {}; P().szalon.lakkok[f.id] = 1; SZALON_LAKK = f.id; SZALON_ECSET = null; SZALON_SZOVEG = "Megvan! Melyik patára?"; }
  else { P().szalon.festekek[f.id] = 1; SZALON_ECSET = f.id; SZALON_LAKK = null; SZALON_SZOVEG = "Megvan! Hova fessem?"; }
  hangCsilla(); ment();
  mondd(SZALON_SZOVEG);
  renderSzalon();
}
function szalonFest(resz) {
  if (SZALON_ZAR) return;
  if (SZALON_SZOR) { hangGomb(); SZALON_VILLAN = "szekreny"; szalonMond("Ez a szőrre való! A sörényhez a szekrényben találsz festéket."); renderSzalon(); return; }
  if (SZALON_LAKK) { hangGomb(); szalonMond("A lakk a patára való!"); renderSzalon(); return; }
  if (!SZALON_ECSET) { hangGomb(); szalonMond("Előbb válassz egy festéket!"); renderSzalon(); return; }
  var nev = SZALON_RESZ_NEV[resz], fs = P().kinezet.festek;
  if (SZALON_ECSET === "szivacs") {
    if (!fs[resz]) { hangGomb(); szalonMond("Ez már tiszta!"); renderSzalon(); return; }
    fs[resz] = null; SZALON_SZOVEG = "Tiszta lett a " + nev + "!";
  } else {
    fs[resz] = SZALON_ECSET; SZALON_SZOVEG = "Hű, " + FESTEK_BY[SZALON_ECSET].nev.toLowerCase() + " " + nev + "!";
  }
  hangCsilla(); hangJo(); ment();
  mondd(SZALON_SZOVEG);
  renderSzalon();
}
/* lakkozás: i = 0…3 (UNI_LABAK sorrend), "mind" = mind a 4, "sugo" = a „Paták” gomb (üres kézzel) */
function szalonLakkoz(i) {
  var lk = P().kinezet.lakk;
  if (!Array.isArray(lk)) lk = P().kinezet.lakk = [null, null, null, null];
  if (SZALON_ZAR) return;
  if (SZALON_SZOR) { hangGomb(); SZALON_VILLAN = "polc"; szalonMond("A patára lakk kell! Nézd a polcon!"); renderSzalon(); return; }
  if (i === "sugo" || (!SZALON_LAKK && !SZALON_ECSET)) { hangGomb(); SZALON_VILLAN = "polc"; szalonMond(i === "sugo" ? "A patára lakk kell! Nézd a polcon!" : "Előbb válassz egy lakkot a polcról!"); renderSzalon(); return; }
  if (SZALON_ECSET && SZALON_ECSET !== "szivacs") { hangGomb(); SZALON_VILLAN = "polc"; szalonMond("A patára lakk kell! Nézd a polcon!"); renderSzalon(); return; }
  var idx = i === "mind" ? [0, 1, 2, 3] : [i];
  if (SZALON_ECSET === "szivacs") {
    if (idx.every(function (j) { return !lk[j]; })) { hangGomb(); szalonMond("Ez már tiszta!"); renderSzalon(); return; }
    idx.forEach(function (j) { lk[j] = null; });
    SZALON_SZOVEG = idx.length > 1 ? "Tiszta lett mind a 4 pata!" : "Tiszta lett a pata!";
  } else {
    idx.forEach(function (j) { lk[j] = SZALON_LAKK; });
    var kul = {}; lk.forEach(function (x) { if (x) kul[x] = 1; });
    SZALON_SZOVEG = Object.keys(kul).length === 4 ? "Hű, négy különböző!" : P().kinezet.festek && P().kinezet.festek.soreny === SZALON_LAKK ? "Csillog-villog! Most illik a sörényedhez!" : "Csillog-villog!";
  }
  SZALON_CSILL = idx;
  hangCsilla(); hangJo(); ment();
  mondd(SZALON_SZOVEG);
  renderSzalon();
}
/* ── SZŐRFESTÉS ── */
function szalonProbaVege() { clearTimeout(_szalonProbaT); _szalonProbaT = null; SZALON_PROBA = null; }
/* szőrfesték a polcról: ha megvan, a kézbe kerül; ha nincs, 2 mp-re felveszi („Így néznél ki!”), aztán „Megveszed?” */
function szalonSzor(szid) {
  if (SZALON_ZAR) return;
  hangGomb();
  var f = SZOR_BY[szid]; if (!f) return;
  szalonProbaVege(); SZALON_DLG = null;
  if ((P().szalon.szorfestekek || {})[szid]) { SZALON_SZOR = szid; SZALON_ECSET = null; SZALON_LAKK = null; szalonMond(f.nev + "! Koppints a testemre!"); renderSzalon(); return; }
  SZALON_SZOR = null; SZALON_ECSET = null; SZALON_LAKK = null;
  SZALON_PROBA = szid; szalonMond("Így néznél ki!"); hangCsilla(); renderSzalon();
  _szalonProbaT = setTimeout(function () {
    _szalonProbaT = null;
    if (SZALON_PROBA !== szid) return;
    SZALON_DLG = szid; SZALON_DLG_T = "szor";
    if ((P().tunderharmat || 0) >= f.ar) mondd(f.nev + " szőr. Megveszed " + f.ar + " tündérharmatért?");
    else mondd("Ehhez még kell egy kis tündérharmat. Ügyes kitartással gyűjthetsz!");
    renderSzalon();
  }, SZALON_PROBA_MS);
}
function szalonSzorVesz() {
  var f = SZOR_BY[SZALON_DLG]; SZALON_DLG = null;
  if (!f || (P().tunderharmat || 0) < f.ar) { hangGomb(); szalonProbaVege(); renderSzalon(); return; }
  P().tunderharmat -= f.ar; vasarlasNaplo("szor-" + f.id, f.ar, "tunderharmat");
  if (!P().szalon.szorfestekek) P().szalon.szorfestekek = {};
  P().szalon.szorfestekek[f.id] = 1;
  SZALON_SZOR = f.id; SZALON_ECSET = null; SZALON_LAKK = null;
  szalonProbaVege(); ment();
  szalonSzorFest();   /* már látta magát benne: rögtön felkenjük */
}
/* koppintás a testre vagy a „Szőr” gombra */
function szalonSzorFest() {
  if (SZALON_ZAR) return;
  var kin = P().kinezet;
  if (SZALON_ECSET === "szivacs") {
    if (!kin.szor) { hangGomb(); szalonMond("Ez már tiszta!"); renderSzalon(); return; }
    szalonSzorOrom(kin.szor, null); return;
  }
  if (!SZALON_SZOR) {
    hangGomb(); SZALON_VILLAN = "szorpolc";
    szalonMond(SZALON_ECSET || SZALON_LAKK ? "A szőrhöz szőrfesték kell! Nézd a polcon!" : "Előbb válassz egy szőrfestéket a polcról!");
    renderSzalon(); return;
  }
  if (kin.szor === SZALON_SZOR) { hangGomb(); szalonMond("Ez már rajtam van!"); renderSzalon(); return; }
  szalonSzorOrom(kin.szor || null, SZALON_SZOR);
}
/* az öröm-pillanat: a szín a fejtől a farig végigfut (1 mp) → megrázza magát → egyszer körbefordul → egy mondat */
function szalonSzorOrom(regi, uj) {
  var kin = P().kinezet;
  kin.szor = uj; ment();
  hangCsilla();
  var nyugi = typeof nyugiMod === "function" && nyugiMod();
  function vege() {
    SZALON_ZAR = false;
    var f = SZOR_BY[uj];
    SZALON_SZOVEG = !uj ? "Tiszta lett a szőröm!" : f && kin.festek && f.illik.indexOf(kin.festek.soreny) >= 0 ? "Most minden összeillik!" : "Nézd, milyen szép lettem!";
    hangJo(); mondd(SZALON_SZOVEG); renderSzalon();
  }
  if (nyugi) { vege(); return; }
  SZALON_ZAR = true; SZALON_SOPRES = { regi: regi }; SZALON_SZOVEG = "…"; renderSzalon();
  setTimeout(function () {
    SZALON_SOPRES = null; renderSzalon();
    if (!uj) { vege(); return; }   /* lemosáskor csak a söprés */
    var r = $("szalon-uni-razo"); if (r) r.classList.add("szalon-razza");
    setTimeout(function () {
      var el = $("szalon-uni-forg");
      if (!el || typeof uniPorog !== "function") { vege(); return; }
      uniNezoAdat(el, { rajz: (LENYEK[mentes.leny] || {}).rajz || "korall", kinezet: kin, oltozet: P().oltozet });
      uniPorog(el, 1200, vege);
    }, 750);
  }, 1050);
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

/* ============ 10e) FODRÁSZAT / SZÉPSÉGSZALON (1. fázis: forma göndör↔egyenes) ============
   Additív helyszín + utca-hub + égi matek-portál (terv: terv/fodraszat-rendszerterv.html,
   terv/fodraszat-rajzterv.html, jóváhagyva 2026-09-18).
   - A frizura az unikornis elmentett tulajdonsága: P().kinezet.frizura ("egyenes"|"gondor").
     A göndör-formát a fenti frizuraGondorArt() adja; a közös unikornisSVG rajzolja mindenhol.
   - Belépő: 150 ✨ egyszeri (P().szalon.nyitva). Két kefe egyszeri képesség 12-12 💧
     (P().szalon.kefek.gondor / .egyenes); ha megvan, ingyen váltasz vele. */
var SZALON_BELEPO_AR = 150;   /* ✨ csillagpor, egyszeri (Kertkapu mintára) */
var KEFE_AR = 12;             /* 💧 tündérharmat / kefe, egyszeri képesség */

/* ── UTCA-HUB ─────────────────────────────────────────────────────────────
   Álló elrendezés (400×460, meet): fönt az égi matek-portál, lent 2×2 házrács. */
/* Név-tábla egy épület alá (egységes, jól koppintható a gyereknek). */
function utcaCimke(cx, felirat) {
  return '<rect x="' + (cx - 44) + '" y="436" width="88" height="21" rx="10" fill="#ffffff" opacity="0.95"/>' +
         '<text x="' + cx + '" y="451" text-anchor="middle" font-size="13" font-weight="700" fill="#2a2140">' + felirat + '</text>';
}
function utcaPortalSVG() {
  var cx = 200, cy = 158, g = '<g id="utca-portal" class="utca-portal">';
  g += '<rect x="96" y="40" width="208" height="140" fill="transparent"/>';   /* koppintó-felület */
  var cols = ["#e0417a", "#f0a800", "#3f9e6a", "#29a3dd", "#8a4fd0"];
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
function utcaSVG() {
  var zarva = !P().szalon.nyitva;
  var c = LENYEK[mentes.leny];
  var s = '<svg class="utca-svg" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs>' +
    '<linearGradient id="utca-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12194f"/><stop offset="0.55" stop-color="#2b2f78"/><stop offset="1" stop-color="#5a4a9a"/></linearGradient>' +
    '<linearGradient id="utca-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1650"/><stop offset="1" stop-color="#0a1240"/></linearGradient>' +
    '</defs>';
  s += '<rect x="0" y="0" width="400" height="460" fill="url(#utca-eg)"/>';
  s += '<circle cx="46" cy="50" r="20" fill="#fdf3c4"/><circle cx="38" cy="44" r="20" fill="#1c2560" opacity="0.55"/>';   /* hold */
  [[130, 34], [270, 30], [330, 66], [96, 92], [356, 120], [190, 60], [300, 150], [70, 150]].forEach(function (p) {
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.7" fill="#fff" opacity="0.85"/>';
  });
  s += utcaPortalSVG();
  s += tkLepcsoSVG();   /* Égi Tüneménykert felhőlépcső (csak felhő-módban + pulton engedélyezve) */
  s += '<rect x="0" y="250" width="400" height="210" fill="url(#utca-fold)"/>';

  /* ── FODRÁSZ (kék épület, kirakatban az unikornis) ── */
  var lock = zarva ? '<g><rect x="16" y="300" width="76" height="20" rx="10" fill="#1a1338" opacity="0.9"/><text x="54" y="314" text-anchor="middle" font-size="12" font-weight="700" fill="#ffd24d">🔒 150 ✨</text></g>' : "";
  s += '<g id="utca-fodrasz" class="utca-epulet">' +
    '<rect x="6" y="276" width="96" height="182" fill="transparent"/>' +
    '<path d="M10 302 L54 278 L98 302 Z" fill="#2b3aa0"/>' +
    '<rect x="14" y="302" width="80" height="130" rx="6" fill="#3f5fd0"/>' +
    '<text x="54" y="298" text-anchor="middle" font-size="14" font-weight="800" fill="#ff69b4" font-style="italic">fodrász</text>' +
    '<rect x="28" y="330" width="52" height="58" rx="5" fill="#bfe6f2" stroke="#20267f" stroke-width="2"/>' +
    '<g transform="translate(54,368) scale(0.125)">' + unikornisSVG("utca-kirakat-uni", c, 1, P().oltozet) + '</g>' +
    lock +
    utcaCimke(54, "fodrász") +
    '</g>';

  /* ── CSILLAGBOLT (pink épület, kéménnyel) ── */
  s += '<g id="utca-bolt" class="utca-epulet">' +
    '<rect x="102" y="276" width="96" height="182" fill="transparent"/>' +
    '<rect x="166" y="284" width="12" height="22" fill="#b86a2f"/>' +
    csillagSVG(172, 276, 6, "#ffd24d") + csillagSVG(184, 268, 4, "#fff") +
    '<path d="M106 302 L150 278 L194 302 Z" fill="#b52f98"/>' +
    '<rect x="110" y="302" width="80" height="130" rx="6" fill="#e63bc0"/>' +
    '<text x="150" y="330" text-anchor="middle" font-size="13" font-weight="800" fill="#ffe0f4" font-style="italic">csillagbolt</text>' +
    '<rect x="126" y="344" width="48" height="42" rx="5" fill="#ffc0e6" stroke="#a02f88" stroke-width="2"/>' +
    csillagSVG(150, 365, 9, "#ffd24d") +
    utcaCimke(150, "csillagbolt") +
    '</g>';

  /* ── KERT / ZÖLDSÉGES (stand zászlófüzérrel) ── */
  s += '<g id="utca-kert" class="utca-epulet">' +
    '<rect x="200" y="284" width="96" height="174" fill="transparent"/>' +
    '<rect x="206" y="330" width="84" height="102" rx="5" fill="#cdeecb"/>' +
    '<rect x="206" y="316" width="84" height="18" fill="#3f9e6a"/>' +
    '<path d="M206 334 l10 14 l10 -14 Z" fill="#e14b4b"/><path d="M226 334 l10 14 l10 -14 Z" fill="#f2c23b"/><path d="M246 334 l10 14 l10 -14 Z" fill="#e14b4b"/><path d="M266 334 l10 14 l10 -14 Z" fill="#f2c23b"/>' +
    '<rect x="222" y="392" width="52" height="30" rx="4" fill="#b98a4e"/>' +
    '<circle cx="238" cy="392" r="9" fill="#e14b4b"/><circle cx="256" cy="394" r="8" fill="#7fbf3f"/>' +
    '<path d="M266 386 l5 14 M263 388 l4 7" stroke="#e6822f" stroke-width="4" stroke-linecap="round"/>' +
    utcaCimke(248, "kert") +
    '</g>';

  /* ── ODÚ (faodú: törzs + lombkorona + kerek ablak) ── */
  s += '<g id="utca-odu" class="utca-epulet">' +
    '<rect x="296" y="272" width="98" height="186" fill="transparent"/>' +
    '<rect x="322" y="340" width="46" height="92" fill="#9c6b3f"/>' +
    '<circle cx="345" cy="318" r="42" fill="#3fa15e"/><circle cx="316" cy="326" r="24" fill="#57b877"/><circle cx="374" cy="328" r="22" fill="#57b877"/>' +
    '<circle cx="336" cy="300" r="14" fill="#bfe6f2" stroke="#20267f" stroke-width="2"/><path d="M336 287 v27 M323 300 h26" stroke="#20267f" stroke-width="1.5"/>' +
    '<ellipse cx="345" cy="408" rx="16" ry="22" fill="#5c2f1a"/>' +
    utcaCimke(344, "odú") +
    '</g>';

  s += '</svg>';
  return s;
}
var UTCA_MOD = "nez";   /* "nez" | "megerosit-belepo" | "megerosit-tk" */
function utcaNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  UTCA_MOD = "nez";
  renderUtca();
  mutat("kepernyo-utca");
  tkElokeszit();   /* első alkalommal betölti a felhőkert beállításait (utána magától újrarajzol) */
}
function utcaKot(id, fn) { var g = document.getElementById(id); if (g) { g.style.cursor = "pointer"; g.addEventListener("click", fn); } }
function renderUtca() {
  var cp = $("utca-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("utca-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var host = $("utca-szinter"); if (!host) return;
  host.innerHTML = utcaSVG();
  utcaKot("utca-fodrasz", utcaFodraszKoppint);
  utcaKot("utca-bolt", function () { hangGomb(); oduNyit(); oduPanelNyit(); });
  utcaKot("utca-kert", function () {
    hangGomb();
    if (P().kert.nyitva) kertNyit();
    else { mondd("A kert kapuja zárva. A kulcsot a boltban szerezheted meg!"); oduNyit(); oduPanelNyit("kert"); }
  });
  utcaKot("utca-odu", function () { hangGomb(); oduNyit(); });
  utcaKot("utca-felhokert", tkLepcsoKoppint);
  utcaKot("utca-portal", function () { hangGomb(); mondd("Induljunk matekozni!"); renderFomenu(); mutat("kepernyo-fomenu"); });
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
   Az unikornis a lila csillag-folton áll; a pulton a két kefe (1. fázisban aktív). */
function szalonKefeSVG(id, cx, cy, jel, megvan, aktiv) {
  var g = '<g id="' + id + '" class="szalon-kefe' + (aktiv ? " aktiv" : "") + '">';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="32" fill="transparent"/>';   /* koppintó-felület */
  if (aktiv) g += '<circle cx="' + cx + '" cy="' + cy + '" r="27" fill="none" stroke="#2f8f57" stroke-width="3"/>';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#fff8e6" stroke="#f0a800" stroke-width="' + (aktiv ? 0 : 2) + '"/>';
  g += '<text x="' + cx + '" y="' + (cy + 9) + '" text-anchor="middle" font-size="24">' + jel + '</text>';
  if (!megvan) {
    g += '<rect x="' + (cx - 23) + '" y="' + (cy + 27) + '" width="46" height="18" rx="9" fill="#1a2340" opacity="0.85"/>';
    g += '<text x="' + cx + '" y="' + (cy + 40) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7fd6ec">12 💧</text>';
  } else if (aktiv) {
    g += '<text x="' + cx + '" y="' + (cy + 40) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2f8f57">✓ most</text>';
  }
  g += '</g>';
  return g;
}
/* A szalon-belső a jóváhagyott „fodrászat belső" rajz szerint (terv/fodraszat-rajzterv.html):
   világoskék fal, körömlakkok, festék-szekrény, kirakat+nap, kiemelt kefék a pulton,
   szőrfestékek, lila csillag-folt az élő unikornissal. 1. fázisban CSAK a kefék aktívak. */
function szalonSVG() {
  var c = LENYEK[mentes.leny];
  var kefeG = !!P().szalon.kefek.gondor, kefeE = !!P().szalon.kefek.egyenes;
  var most = P().kinezet.frizura || "egyenes";
  var lakk = ["#e14b4b", "#f2c23b", "#8fd23b", "#3ba3dd", "#e63bc0"];
  var i, x;
  var s = '<svg class="szalon-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs><radialGradient id="szalon-kefe-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6a8" stop-opacity="0.95"/><stop offset="1" stop-color="#fff6a8" stop-opacity="0"/></radialGradient></defs>';
  s += '<rect x="0" y="0" width="400" height="300" fill="#c6e6f2"/>';                          /* világoskék fal */
  s += '<rect x="0" y="256" width="400" height="44" fill="#b9d9ec"/>';                          /* padló */

  /* körömlakkok (bal-fent) */
  s += '<text x="56" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#e63bc0" font-style="italic">körömlakkok</text>';
  s += '<rect x="14" y="40" width="86" height="7" rx="2" fill="#b0733f"/>';
  for (i = 0; i < 5; i++) { x = 20 + i * 16; s += '<rect x="' + x + '" y="23" width="9" height="17" rx="2" fill="' + lakk[i] + '"/><rect x="' + (x + 1.5) + '" y="18" width="6" height="6" fill="#333"/>'; }

  /* kirakat (közép-fent) + nap */
  s += '<rect x="150" y="10" width="96" height="74" rx="3" fill="#b0733f"/><rect x="157" y="17" width="82" height="60" fill="#a6dcec"/>';
  s += '<circle cx="172" cy="34" r="13" fill="#ffe25a"/>';
  s += '<text x="212" y="30" text-anchor="middle" font-size="12" font-weight="800" fill="#ffd23b" font-style="italic">kirakat</text>' + csillagSVG(224, 56, 5, "#ffffff");

  /* szőr festékek (jobb-fent) */
  s += '<text x="338" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#e6a000" font-style="italic">szőr festékek</text>';
  s += '<rect x="288" y="44" width="102" height="7" rx="2" fill="#b0733f"/>';
  [["#e14b4b", 302], ["#f2c23b", 328], ["#8fd23b", 354], ["#e63bc0", 380]].forEach(function (b) {
    s += '<circle cx="' + b[1] + '" cy="32" r="11" fill="' + b[0] + '"/><rect x="' + (b[1] - 4) + '" y="18" width="8" height="10" rx="2" fill="' + b[0] + '"/>';
  });

  /* festék-szekrény (bal, sötétvörös) + sárga nyíl + felirat */
  s += '<rect x="10" y="98" width="66" height="150" fill="#7a1818"/>';
  var pal = ["#e14b4b", "#f2c23b", "#8fd23b", "#8a6fd0", "#5ac0d0", "#e64fb0"], k = 0;
  [128, 166, 204].forEach(function (py) { [28, 58].forEach(function (px) { s += '<circle cx="' + px + '" cy="' + py + '" r="6" fill="' + pal[k++] + '"/>'; }); });
  s += '<path d="M96 176 q-8 4 -18 0" fill="none" stroke="#ffdb1f" stroke-width="6" stroke-linecap="round"/><path d="M80 170 l-8 6 l9 4 Z" fill="#ffdb1f"/>';
  s += '<text x="43" y="262" text-anchor="middle" font-size="8.5" font-weight="800" fill="#f2a000" font-style="italic">sörény- és</text><text x="43" y="272" text-anchor="middle" font-size="8.5" font-weight="800" fill="#f2a000" font-style="italic">farokfesték</text>';

  /* lila csillag-folt + az unikornis (aktuális frizura, mindenhol egységes) */
  s += '<ellipse cx="326" cy="236" rx="70" ry="26" fill="#b98fd8"/>' + csillagSVG(326, 228, 30, "#ecdafb");
  s += '<g transform="translate(326,216) scale(0.52)">' + unikornisSVG("szalon-uni", c, 1, P().oltozet) + '</g>';

  /* kefe-pult (kiemelve — 1. fázisban ez az aktív) */
  s += '<ellipse cx="193" cy="182" rx="98" ry="62" fill="url(#szalon-kefe-glow)"/>';
  s += '<rect x="120" y="196" width="150" height="14" rx="4" fill="#b06fd0"/><rect x="130" y="210" width="130" height="30" fill="#8a4fd0" opacity="0.4"/>';
  s += szalonKefeSVG("szalon-kefe-gondor", 158, 176, "🌀", kefeG, most === "gondor");
  s += szalonKefeSVG("szalon-kefe-egyenes", 232, 176, "〰️", kefeE, most === "egyenes");
  s += '<rect x="149" y="246" width="92" height="20" rx="10" fill="#ffffff" opacity="0.92"/><text x="195" y="260" text-anchor="middle" font-size="11.5" font-weight="800" fill="#e0417a">● 1. FÁZIS</text>';

  s += '</svg>';
  return s;
}
function szalonNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  renderSzalon();
  mutat("kepernyo-szalon");
}
function renderSzalon() {
  var cp = $("szalon-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("szalon-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var host = $("szalon-szinter"); if (!host) return;
  host.innerHTML = szalonSVG();
  var kg = document.getElementById("szalon-kefe-gondor"); if (kg) { kg.style.cursor = "pointer"; kg.addEventListener("click", function () { szalonKefe("gondor"); }); }
  var ke = document.getElementById("szalon-kefe-egyenes"); if (ke) { ke.style.cursor = "pointer"; ke.addEventListener("click", function () { szalonKefe("egyenes"); }); }
  var sugo = $("szalon-sugo"); if (sugo) sugo.textContent = "Koppints egy kefére — átalakul a sörény! 🪮";
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
  hangCsilla(); hangJo(); ment();
  mondd(cel === "gondor" ? "Hopp, göndör lett! Csigavonalak!" : "Sima, egyenes sörény! Szép!");
  renderSzalon();
}


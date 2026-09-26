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

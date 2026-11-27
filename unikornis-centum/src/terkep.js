/* ═════════════════ 6j) TÉRKÉP: a közös séta-motor (a kissárkány kalandtérképe használja) + a régi belső unikornisa ═════════════════
   A beköltözés előtti festett ligettérkép (LIGET_TERKEP, renderLigetTerkep, a 13 jelkép, a táj) a Világkép 8. hullámában
   (2. kódkör, 2026-11-27) kikerült: a főképernyő a világkép (hely.js). Ami itt maradt:
   KÖZÖS MOTOR: egy térkép = egy adat-tábla
     T = { helyek: { id: { szeles:[x,y], allo:[x,y], magas, szel } },   (x,y = a jelkép talppontja; magas = a rajz magassága, szel = állóhely-távolság)
           utak:   [[A, B, kanyar], …]  (kanyar = a görbe kihajlása, képpont) — vagy elrendezésenként: { szeles:[…], allo:[…] },
           elr:    { szeles:{w,h,uni,jk,hz}, allo:{…} }  (fekvő 800×460, álló 400×760; uni = az unikornis mérete, jk = a jelképeké; jelLe = a ⭐-tábla a név alá),
           oldal:  { szeles:{id:±1}, allo:{…} }  (melyik oldalán áll az unikornis a jelképnek; alap: jobbra),
           jelkep: { id: fn → SVG }, taj(T, mod) → { allo, mozgo }, defs }
   terkepHalo(T, lathato, mod) — az elrejtett zsákutca-helyek lenyesve; az elrejtett átmenő hely helyén bokor áll, az út megmarad
   terkepRajzol(host, T, o) — a kép + az unikornis (a gyerek saját, öltöztetett unikornisa: unikornisSVG)
   terkepSetal(M, cel, kesz) — végigmegy az ösvényeken (Dijkstra-út → a közös uniUtvonal: járás, fordulás); 2. hívás séta közben = azonnal ott van
   Opcionális: T.utRajz(d) = saját út-stílus (a kalandtérkép szaggatott ösvénye); o.fedo = SVG-réteg a helyek fölé, az unikornis alá
   (a kalandtérkép felhői, nyomai — kaland.js, visszahívás 4. kör).
   KÖZÖS RAJZ-APRÓSÁGOK (lt…): árnyék, csillám, felhő, lepke, bokor, kisfa, újonc-fény és -köd, LT_DEFS — hely.js, piac.js, nyitokep.js is használja.
   RÉGI BELSŐ (Bagolykönyvtár, Fejtörő-hegy — FOMENU_LIGET): ligetUniReteg + ligetUget — az unikornis a belső alján áll, választáskor odaüget. */

/* ── KÖZÖS: görbék, gráf, útkereső ── */
function terkepPont(T, id, mod) { var p = T.helyek[id][mod]; return [p[0], p[1] + 6]; }   /* a hely „ajtaja” az úton */
function terkepGorbe(a, b, kanyar) {
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return [a, [a[0] + dx / 3 + nx * kanyar, a[1] + dy / 3 + ny * kanyar], [a[0] + dx * 2 / 3 - nx * kanyar * .5, a[1] + dy * 2 / 3 - ny * kanyar * .5], b];
}
function terkepEl(T, utak, a, b, mod) {   /* az a→b út köbös görbéje (visszafelé is) */
  for (var i = 0; i < utak.length; i++) {
    var u = utak[i];
    if (u[0] === a && u[1] === b) return terkepGorbe(terkepPont(T, a, mod), terkepPont(T, b, mod), u[2]);
    if (u[1] === a && u[0] === b) { var g = terkepGorbe(terkepPont(T, b, mod), terkepPont(T, a, mod), u[2]); return [g[3], g[2], g[1], g[0]]; }
  }
  return null;
}
/* a látható helyek hálója: az elrejtett hely, ha zsákutca (legfeljebb 1 útja maradt), az útjával együtt lekerül — ismételve */
function terkepUtak(T, mod) { return Array.isArray(T.utak) ? T.utak : T.utak[mod]; }
function terkepHalo(T, lathato, mod) {
  var utak = terkepUtak(T, mod).slice(), van = {}, valt = true;
  Object.keys(T.helyek).forEach(function (id) { van[id] = true; });
  while (valt) {
    valt = false;
    Object.keys(van).forEach(function (id) {
      if (lathato[id]) return;
      var fok = utak.filter(function (u) { return u[0] === id || u[1] === id; }).length;
      if (fok <= 1) { delete van[id]; utak = utak.filter(function (u) { return u[0] !== id && u[1] !== id; }); valt = true; }
    });
  }
  return { van: van, utak: utak, lathato: lathato };
}
function terkepUtkereso(T, halo, honnan, hova, mod) {
  var tav = {}, elozo = {}, nyitott = Object.keys(halo.van);
  nyitott.forEach(function (k) { tav[k] = Infinity; }); tav[honnan] = 0;
  while (nyitott.length) {
    nyitott.sort(function (a, b) { return tav[a] - tav[b]; });
    var u = nyitott.shift(); if (u === hova || tav[u] === Infinity) break;
    halo.utak.forEach(function (e) {
      var v = e[0] === u ? e[1] : e[1] === u ? e[0] : null; if (!v) return;
      var a = terkepPont(T, u, mod), b = terkepPont(T, v, mod), d = tav[u] + Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d < tav[v]) { tav[v] = d; elozo[v] = u; }
    });
  }
  if (tav[hova] === Infinity) return null;
  var ut = [hova]; while (ut[0] !== honnan) ut.unshift(elozo[ut[0]]);
  return ut;
}
/* állóhely: az unikornis a jelkép MELLETT áll (az úton állva eltakarná a nevet); o = melyik oldalon (+1 jobbra) */
function terkepAllas(T, id, mod) {
  var h = T.helyek[id], p = h[mod], o = (T.oldal[mod] || {})[id] || 1, L = T.elr[mod], fel = 86 * L.uni;   /* fel = az unikornis fél szélessége (farokkal) */
  return { x: Math.max(fel, Math.min(L.w - fel, p[0] + o * h.szel * L.jk)), y: p[1] + 2, o: o };   /* ne lógjon ki a képből */
}
function ltF(n) { return n.toFixed(1); }
function ltGorbeD(g, kezd) { return (kezd ? "M" + ltF(g[0][0]) + " " + ltF(g[0][1]) : "") + "C" + ltF(g[1][0]) + " " + ltF(g[1][1]) + " " + ltF(g[2][0]) + " " + ltF(g[2][1]) + " " + ltF(g[3][0]) + " " + ltF(g[3][1]); }
function terkepUtakSVG(T, halo, mod) {
  var d = halo.utak.map(function (u) { return ltGorbeD(terkepEl(T, halo.utak, u[0], u[1], mod), true); }).join("");
  if (T.utRajz) return T.utRajz(d);
  return '<path d="' + d + '" fill="none" stroke="#d9bf94" stroke-width="17" stroke-linecap="round"/>' +
         '<path d="' + d + '" fill="none" stroke="#f5e6c6" stroke-width="12" stroke-linecap="round"/>' +
         '<path d="' + d + '" fill="none" stroke="#fffaf0" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2 11" opacity=".8"/>';
}

/* ── KÖZÖS: rajzolás ──
   o = { mod, all (hol áll az unikornis), halo, nev(id) → felirat, jelzes: { id: {kesz, ossz, alszik, jelzes:[…]} }, koppint(id) } */
function terkepRajzol(host, T, o) {
  var mod = o.mod, L = T.elr[mod], halo = o.halo, k = L.jk, t = T.taj(T, mod), jel = o.jelzes || {};
  var sorrend = Object.keys(T.helyek).sort(function (a, b) { return T.helyek[a][mod][1] - T.helyek[b][mod][1]; });
  var liget = sorrend.filter(function (id) { return halo.lathato[id]; });
  var bokrok = sorrend.filter(function (id) { return !halo.lathato[id]; }).map(function (id) {   /* elrejtett hely: kis liget-tájkép, nem lyuk */
    var p = T.helyek[id][mod];
    return '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + k + ')">' + ltBokor(-14, 2, 1.5, "#a8dc9c", "#6fae74") + ltKisfa(12, 0, 1.4, "#9fd49a", "#6fae74") + '</g>';
  }).join("");
  var helyek = liget.map(function (id) {
    var p = T.helyek[id][mod], j = jel[id] || {}, m = T.helyek[id].magas;
    return '<g class="terkep-hely' + (j.alszik ? " alszik" : "") + (j.ny === "alszik" ? " ny-kod" : "") + '" data-id="' + id + '" role="button" tabindex="0" aria-label="' + htmlVed(o.nev(id)) + '">' +
      '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + k + ')">' +
      '<rect x="-56" y="' + (-m - 6) + '" width="112" height="' + (m + 38) + '" fill="transparent"/>' +
      (j.ny === "vil" ? ltNyHalo(m) : "") +
      '<g class="hb' + (j.ny === "vil" ? " ny-vilagit" : "") + '">' + T.jelkep[id]() + '</g>' + (j.ny === "alszik" ? ltNyKod(m) : "") + '</g></g>';
  }).join("");
  var cimkek = liget.map(function (id) {
    var p = T.helyek[id][mod], j = jel[id] || {};
    return '<g class="terkep-hely' + (j.ny === "alszik" ? " ny-kod-cimke" : "") + '" data-id="' + id + '" aria-hidden="true">' + ltCimke(p[0], p[1], o.nev(id), k) + '</g>' + ltJelzesRajz(T, id, p[0], p[1], k, o.nev(id), jel[id], L, mod);
  }).join("");
  var a = terkepAllas(T, o.all, mod);
  host.innerHTML =
    '<svg class="terkep-svg" viewBox="0 0 ' + L.w + ' ' + L.h + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + T.defs +
      '<g filter="url(#lt-firka)">' + t.allo + terkepUtakSVG(T, halo, mod) + '</g>' + t.mozgo + bokrok + helyek + cimkek + (o.fedo || "") +
      '<g class="terkep-uni" pointer-events="none"><g class="terkep-uni-irany" style="--dir:' + (-a.o) + ';transform:scale(var(--dir,1),1)">' +
        unikornisSVG("lt-uni", LENYEK[mentes.leny], L.uni, P().oltozet) + '</g></g>' +
    '</svg>';
  var svg = host.querySelector("svg");
  var M = { T: T, mod: mod, halo: halo, svg: svg, hely: svg.querySelector(".terkep-uni"), el: svg.querySelector(".terkep-uni-irany"), all: o.all, fut: null };
  uniNezoAdat(M.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });   /* a fordulás szemből-képéhez */
  terkepAllit(M, a.x, a.y);
  svg.addEventListener("click", function (e) { var g = e.target.closest(".terkep-hely"); if (g) o.koppint(g.getAttribute("data-id")); });
  svg.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var g = e.target.closest && e.target.closest(".terkep-hely"); if (!g) return;
    e.preventDefault(); o.koppint(g.getAttribute("data-id"));
  });
  return M;
}
function terkepAllit(M, x, y) { M.x = x; M.y = y; M.hely.setAttribute("transform", "translate(" + ltF(x) + " " + ltF(y) + ")"); }
function terkepEgyseg(M) { var m = M.svg.getScreenCTM && M.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; }
/* SÉTA a térképen: állóhely → az ösvények (útkereső) → a cél állóhelye; ott a hely felé fordul. Legfeljebb TERKEP_SETA_MP.
   Séta közben újra hívva (bármelyik helyre): azonnal a mostani célnál áll, és rögtön továbbmegy (kesz). Nyugalmas módban nincs séta. */
function terkepSetal(M, cel, kesz) {
  var T = M.T, mod = M.mod;
  if (M.fut) { var f = M.fut; M.fut = null; uniUtvonalAll(M.el); terkepOda(M, f.cel); if (f.kesz) f.kesz(); return; }
  var b = terkepAllas(T, cel, mod);
  function megerkezett() { M.fut = null; M.all = cel; uniFordul(M.el, -b.o, function () { if (kesz) kesz(); }); }
  var ut = cel === M.all ? null : terkepUtkereso(T, M.halo, M.all, cel, mod);
  if (!ut || nyugiMod()) { terkepOda(M, cel); if (kesz) kesz(); return; }
  /* az ösvények görbéi; az első az állóhelyről indul, az utolsó a cél állóhelyén ér véget (nincs kitérő az ajtóig és vissza) */
  var g = [];
  for (var i = 0; i < ut.length - 1; i++) g.push(terkepEl(T, M.halo.utak, ut[i], ut[i + 1], mod).slice());
  function tol(gg, vi, ki, x, y) {   /* a végpontot a mellette lévő vezérlőponttal együtt toljuk el: a görbe alakja marad, nem fordul vissza */
    var dx = x - gg[vi][0], dy = y - gg[vi][1];
    gg[vi] = [x, y]; gg[ki] = [gg[ki][0] + dx, gg[ki][1] + dy];
  }
  tol(g[0], 0, 1, M.x, M.y);
  tol(g[g.length - 1], 3, 2, b.x, b.y);
  M.fut = { cel: cel, kesz: kesz };
  var en = M.fut;
  uniUtvonal({ el: M.el, allit: function (x, y) { terkepAllit(M, x, y); }, egyseg: function () { return terkepEgyseg(M); } },
    uniGorbePontok(g), { ido: TERKEP_SETA_MP }, function () { if (M.fut === en) megerkezett(); });
}
var TERKEP_SETA_MP = 1.8;   /* a térképen egy út legfeljebb ennyi mp (+ fordulások); a terv: kb. 2 mp */
function terkepOda(M, cel) {   /* azonnal a hely mellett, felé fordulva */
  var b = terkepAllas(M.T, cel, M.mod);
  M.all = cel; terkepAllit(M, b.x, b.y); uniFordul(M.el, -b.o);
}
/* BELÉPÉS: a kép ránagyít a helyre és elhalványul (~0,4 mp), aztán kesz */
function terkepBelep(M, id, kesz) {
  if (nyugiMod() || window.__UC_GYORS) { kesz(); return; }
  var p = M.T.helyek[id][M.mod], L = M.T.elr[M.mod];
  M.svg.style.transformOrigin = (p[0] / L.w * 100) + "% " + ((p[1] - 30) / L.h * 100) + "%";
  M.svg.classList.add("belep");
  setTimeout(kesz, 380);
}

/* ── közös rajz-apróságok (a régi ligettérkép készletéből; hely.js, piac.js, kaland.js, nyitokep.js is használja) ── */
function ltAnim(attr, values, dur, extra) { return '<animate attributeName="' + attr + '" values="' + values + '" dur="' + dur + '" repeatCount="indefinite"' + (extra || "") + '/>'; }
function ltArnyek(rx) { return '<ellipse cx="0" cy="3" rx="' + rx + '" ry="' + (rx * 0.17).toFixed(1) + '" fill="#3c2a50" opacity=".16"/>'; }
function ltCsillam(x, y, s, c, dur, kesl) { return '<path d="M' + x + ' ' + (y - s) + 'L' + (x + s * .3) + ' ' + (y - s * .3) + 'L' + (x + s) + ' ' + y + 'L' + (x + s * .3) + ' ' + (y + s * .3) + 'L' + x + ' ' + (y + s) + 'L' + (x - s * .3) + ' ' + (y + s * .3) + 'L' + (x - s) + ' ' + y + 'L' + (x - s * .3) + ' ' + (y - s * .3) + 'Z" fill="' + c + '">' + ltAnim("opacity", "0.2;1;0.2", dur, ' begin="' + (kesl || 0) + 's"') + '</path>'; }
function ltRozsa(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#c0567f" stroke-width="1"/><path d="M' + (x - r * .4) + ' ' + y + 'q' + (r * .4) + ' ' + (-r * .5) + ' ' + (r * .7) + ' 0" stroke="#c0567f" stroke-width=".9" fill="none"/>'; }
function ltVeletlen(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function ltFelho(x, y, s, dur, kesl, szin, w) {
  return '<g opacity=".92"><animateTransform attributeName="transform" type="translate" values="-160 0;' + (w + 160) + ' 0" dur="' + dur + 's" begin="-' + kesl + 's" repeatCount="indefinite"/>' +
    '<path d="M' + x + ' ' + y + 'q' + (-4 * s) + ' ' + (-14 * s) + ' ' + (10 * s) + ' ' + (-14 * s) + 'q' + (6 * s) + ' ' + (-12 * s) + ' ' + (22 * s) + ' ' + (-6 * s) + 'q' + (14 * s) + ' ' + (-4 * s) + ' ' + (16 * s) + ' ' + (10 * s) + 'q' + (10 * s) + ' ' + (2 * s) + ' ' + (4 * s) + ' ' + (10 * s) + 'z" fill="' + szin + '"/></g>';
}
function ltLepke(x, y, dur, c) {
  return '<g><animateTransform attributeName="transform" type="translate" values="0 0;30 -14;60 4;34 18;0 0" dur="' + dur + 's" repeatCount="indefinite"/>' +
    '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0q-6 -7 -8 -1q2 4 8 1zM0 0q6 -7 8 -1q-2 4 -8 1z" fill="' + c + '" stroke="#8a6a7e" stroke-width=".6">' +
    '<animateTransform attributeName="transform" type="scale" values="1 1;0.3 1;1 1" dur=".35s" repeatCount="indefinite"/></path></g></g>';
}
function ltBokor(x, y, s, c1, c2) { return '<path d="M' + (x - 10 * s) + ' ' + y + 'q-3 ' + (-10 * s) + ' ' + (6 * s) + ' ' + (-12 * s) + 'q' + (4 * s) + ' ' + (-8 * s) + ' ' + (12 * s) + ' ' + (-2 * s) + 'q' + (8 * s) + ' 0 ' + (6 * s) + ' ' + (14 * s) + 'z" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1.2"/>'; }
function ltKisfa(x, y, s, c1, c2) { return '<path d="M' + (x - 1.5) + ' ' + y + 'v' + (-10 * s) + 'h3v' + (10 * s) + 'z" fill="#9a6f52"/><circle cx="' + x + '" cy="' + (y - 16 * s) + '" r="' + (9 * s) + '" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1.2"/>'; }
/* név-tábla a jelkép alatt + a jelzések (⭐ kész/összes, legfeljebb 2 kerek jelvény a bal vállon, alvó hold) */
function ltCimke(x, y, nev, k) {
  var sz = nev.length * 7.2 + 22;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><rect x="' + ltF(-sz / 2) + '" y="7" width="' + ltF(sz) + '" height="22" rx="11" fill="#ffffff" opacity=".94" stroke="#e6d8f0"/>' +
         '<text y="23" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2a2140">' + htmlVed(nev) + '</text></g>';
}
/* 🚪 újonc-menet (nyitas.js; rajzterv 3., ✅ B: köd): a világító hely fénykörrel + csillámmal, az alvó köd alatt.
   m = a jelkép magassága (a hely saját egységeiben); a színátmenetek az LT_DEFS-ben (lt-gNyHalo, lt-gNyKod). */
function ltNyHalo(m) {
  return '<g class="ny-halo" pointer-events="none"><ellipse cx="0" cy="' + ltF(-m * .42) + '" rx="' + ltF(m * .95) + '" ry="' + ltF(m * .8) + '" fill="url(#lt-gNyHalo)"/>' +
    ltCsillam(Math.round(-m * 5.5) / 10, Math.round(-m * 8) / 10, 5, "#fff6c4", "2.2s", 0) + ltCsillam(Math.round(m * 6) / 10, Math.round(-m * 5.5) / 10, 4, "#ffe08a", "2.6s", .8) +
    ltCsillam(Math.round(m) / 10, Math.round(-m * 10.8) / 10, 4.5, "#ffffff", "2s", 1.4) + '</g>';   /* számmal (a ltCsillam összead) */
}
function ltNyKod(m) {
  return '<g class="ny-kodfelho" pointer-events="none">' +
    '<ellipse cx="-14" cy="' + ltF(-m * .22) + '" rx="' + ltF(m * .62) + '" ry="' + ltF(m * .22) + '" fill="url(#lt-gNyKod)"/>' +
    '<ellipse cx="16" cy="' + ltF(-m * .5) + '" rx="' + ltF(m * .55) + '" ry="' + ltF(m * .2) + '" fill="url(#lt-gNyKod)"/>' +
    '<ellipse cx="0" cy="' + ltF(-m * .02) + '" rx="' + ltF(m * .72) + '" ry="' + ltF(m * .16) + '" fill="url(#lt-gNyKod)"/></g>';
}
function ltJelzesRajz(T, id, x, y, k, nev, j, L, mod) {
  if (!j || j.ny === "alszik") return "";   /* a ködben nincs ⭐-tábla, se jelzés */
  var s = "", sz = nev.length * 7.2 + 22, magas = T.helyek[id].magas;
  if (j.ossz) {
    var tele = j.kesz >= j.ossz, cx = x + (sz / 2 + 4) * k, cy = y + 7 * k, le = y + 56 * k <= L.h;
    /* a név mellé (jobbra); álló képen (jelLe) a név alá, mert ott a szomszéd hely neve túl közel van — vagy ha jobbra nem fér el */
    if (le && (L.jelLe || cx + 48 * k > L.w)) { cx = x - 22 * k; cy = y + 32 * k; }
    s += '<g pointer-events="none" transform="translate(' + ltF(cx) + ' ' + ltF(cy) + ') scale(' + k + ')"><rect width="44" height="22" rx="11" fill="' + (tele ? "#fff1b8" : "#ffffff") + '" stroke="' + (tele ? "#e3a92a" : "#3f9e6a") + '" stroke-width="1.6"/>' +
         '<text x="22" y="15.5" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (tele ? "#b07a10" : "#3f9e6a") + '">' + (tele ? "🌟" : "⭐") + ' ' + j.kesz + '/' + j.ossz + '</text></g>';
  }
  /* a jelvények a bal vállon — ha az unikornis a hely bal oldalán áll (oldal −1), a jobbon, különben eltakarná (pl. a 🦋 a Kerten) */
  var bal = ((T.oldal[mod] || {})[id] || 1) > 0, le = !bal && j.alszik ? 1 : 0;   /* jobbra a hold alá */
  (j.jelzes || []).slice(0, 2).forEach(function (ik, i) {
    var ix = x + (bal ? -36 : 36) * k, iy = y - magas * k * 0.62 + (i + le) * 26 * k;
    if (T.jelFent && T.jelFent[id]) { ix = x + (18 + i * 26) * k; iy = y - (magas + 10) * k; }   /* a jelkép tetején (pl. az Odún: balra az Utca neve, jobbra az unikornis) */
    s += '<g pointer-events="none" transform="translate(' + ltF(ix) + ' ' + ltF(iy) + ') scale(' + k + ')"><circle r="12" fill="#fff" stroke="' + (ik === "💧" ? "#29a3dd" : ik === "🏦" ? "#b07a10" : ik === "🦋" ? "#8a6fc0" : "#e0417a") + '" stroke-width="2"/>' +
         '<text y="4.5" text-anchor="middle" font-size="13">' + ik + '</text>' + ltAnim("opacity", "1;.75;1", "2.2s") + '</g>';
  });
  if (j.alszik) {
    var ax = x + 30 * k, ay = y - magas * k * 0.8;
    s += '<g pointer-events="none" transform="translate(' + ltF(ax) + ' ' + ltF(ay) + ') scale(' + k + ')"><path d="M-8 -10A11 11 0 1 0 4 8A8 8 0 1 1 -8 -10Z" fill="#fff1b8" stroke="#b07a10" stroke-width="1.4"/>' +
         '<text x="10" y="-6" font-size="11" font-weight="700" fill="#6b6280">z' + ltAnim("opacity", "0;1;0", "2.4s") + '</text>' +
         '<text x="17" y="-15" font-size="9" font-weight="700" fill="#6b6280">z' + ltAnim("opacity", "0;1;0", "2.4s", ' begin=".6s"') + '</text></g>';
  }
  return s;
}
/* a térkép színátmenetei + a firka-szűrő (a táj enyhe kézi vonalremegése; a nevekre, jelzésekre, unikornisra nem) */
var LT_DEFS = '<defs>' +
  '<linearGradient id="lt-gFa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8b0"/><stop offset="1" stop-color="#6fbf7a"/></linearGradient>' +
  '<linearGradient id="lt-gFa2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8c6f4"/><stop offset="1" stop-color="#8fa6e0"/></linearGradient>' +
  '<linearGradient id="lt-gSziv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7ecb8"/><stop offset="1" stop-color="#86c98c"/></linearGradient>' +
  '<linearGradient id="lt-gTorzs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a6f52"/><stop offset=".45" stop-color="#c79e76"/><stop offset="1" stop-color="#8c6248"/></linearGradient>' +
  '<linearGradient id="lt-gFal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6ea"/><stop offset="1" stop-color="#f0d9bd"/></linearGradient>' +
  '<linearGradient id="lt-gTetoR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9b6cf"/><stop offset="1" stop-color="#e07aa3"/></linearGradient>' +
  '<linearGradient id="lt-gTetoT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ade8de"/><stop offset="1" stop-color="#5cb8b2"/></linearGradient>' +
  '<linearGradient id="lt-gTetoM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#f0aa3c"/></linearGradient>' +
  '<linearGradient id="lt-gTorony" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9a0de"/><stop offset=".5" stop-color="#ddcdf5"/><stop offset="1" stop-color="#a98fd4"/></linearGradient>' +
  '<linearGradient id="lt-gHegy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4c8ec"/><stop offset="1" stop-color="#9483c2"/></linearGradient>' +
  '<radialGradient id="lt-gAblak" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff6c4"/><stop offset="1" stop-color="#ffbe55"/></radialGradient>' +
  '<radialGradient id="lt-gHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="lt-gNyHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff0b0" stop-opacity=".95"/><stop offset=".55" stop-color="#ffe08a" stop-opacity=".55"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="lt-gNyKod" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fbf8ff" stop-opacity=".95"/><stop offset=".6" stop-color="#efe8fb" stop-opacity=".8"/><stop offset="1" stop-color="#efe8fb" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="lt-gNap"cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7cc"/><stop offset=".55" stop-color="#ffeaa0" stop-opacity=".7"/><stop offset="1" stop-color="#ffeaa0" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="lt-gUtca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12194f"/><stop offset=".6" stop-color="#2b2f78"/><stop offset="1" stop-color="#5a4a9a"/></linearGradient>' +
  '<linearGradient id="lt-gEgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8e3f7"/><stop offset="1" stop-color="#eef6ee"/></linearGradient>' +
  '<linearGradient id="lt-gRetA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4f0c8"/><stop offset="1" stop-color="#b3dea4"/></linearGradient>' +
  '<filter id="lt-firka" x="-5%" y="-5%" width="110%" height="110%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/>' +
  '<feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/>' +
  '</filter>' +
  '</defs>';
var LIGET_M = null;       /* a kirajzolt főképernyő-kép (a világkép vagy egy közelkép — hely.js: LIGET_M = VILAG_M) */
var TERKEP_HOL = null;    /* { leny, id }: hol áll az unikornis a képen ebben a játékban (odú/kert/utca-kapu is); különben P().utolsoLiget */
window.addEventListener("resize", function () {   /* forgatás: más elrendezés (fekvő ↔ álló); a régi belsőben az unikornis a helyére */
  if (!$("kepernyo-fomenu").classList.contains("aktiv")) return;
  if (FOMENU_LIGET) { ligetUniAlap(); return; }
  var host = document.querySelector("#palya-racs .terkep-host");
  if (host && LIGET_M && !LIGET_M.fut && utcaMod(host.clientWidth, host.clientHeight) !== LIGET_M.mod) renderFomenu();
});

/* ── RÉGI BELSŐ (Bagolykönyvtár, Fejtörő-hegy): az unikornis a kártyák alatt áll (bal lent), választáskor odaüget a kártyához, aztán indul a pálya ── */
var LIGET_UNI = null;
function ligetUniReteg() {
  var k = $("kepernyo-fomenu"), regi = $("liget-uni-reteg");
  if (regi) regi.parentNode.removeChild(regi);
  LIGET_UNI = null;
  if (!FOMENU_LIGET) return;   /* csak a régi belsőben (Bagolykönyvtár, Fejtörő-hegy) */
  var r = el("div", "liget-uni-reteg uni-terep");
  r.id = "liget-uni-reteg"; r.setAttribute("aria-hidden", "true");
  r.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g class="liget-uni-hely"><g class="liget-uni-irany" style="--dir:1;transform:scale(var(--dir,1),1)">' +
    unikornisSVG("li-uni", LENYEK[mentes.leny], window.innerWidth < 600 ? 0.44 : 0.6, P().oltozet) + '</g></g></svg>';
  k.appendChild(r);
  LIGET_UNI = { reteg: r, hely: r.querySelector(".liget-uni-hely"), el: r.querySelector(".liget-uni-irany"), x: 0, y: 0, fut: null };
  uniNezoAdat(LIGET_UNI.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  ligetUniAlap();
}
function ligetUniAllit(x, y) { var U = LIGET_UNI; if (!U) return; U.x = x; U.y = y; U.hely.setAttribute("transform", "translate(" + ltF(x) + " " + ltF(y) + ")"); }
function ligetUniAlap() {   /* bal lent, a kártyák alatt — a napi statisztika sora fölött (különben eltakarná) */
  var U = LIGET_UNI; if (!U || U.fut) return;
  var pult = document.querySelector("#palya-racs .bkt-pult");   /* 📚 a Bagolykönyvtárban az olvasópult mellett áll (konyvtar-terem.js) */
  if (pult && pult.offsetParent) {
    var pr = pult.getBoundingClientRect(), rr = U.reteg.getBoundingClientRect();
    var jobbra = window.innerWidth <= 820 || (window.innerWidth <= 1000 && window.innerHeight > window.innerWidth);   /* álló tablet, telefon: a pult jobb oldalán van hely */
    var ux = jobbra ? Math.min(rr.width - 40, pr.right - rr.left + 34) : Math.max(40, pr.left - rr.left - 30);
    if (pr.bottom > rr.top && pr.top < rr.bottom) { ligetUniAllit(ux, Math.min(rr.height - 10, pr.bottom - rr.top - 2)); return; }
  }
  var y = (U.reteg.clientHeight || window.innerHeight) - 10, st = $("ma-statisztika");
  if (st && st.offsetParent && st.textContent.trim()) y = Math.min(y, st.getBoundingClientRect().top - U.reteg.getBoundingClientRect().top - 2);
  ligetUniAllit(window.innerWidth < 600 ? 58 : 92, y);
}
/* a kártya választásakor: odaüget a kártya alá (kb. 1 mp), aztán indit(). Közben még egy választás = azonnal indul (az új). */
function ligetUget(kart, indit) {
  var U = LIGET_UNI;
  if (U && U.fut) { U.fut = null; uniUtvonalAll(U.el); indit(); return; }
  if (!U || !U.reteg.isConnected || nyugiMod() || window.__UC_GYORS) { indit(); return; }
  var rr = U.reteg.getBoundingClientRect(), kr = kart.getBoundingClientRect();
  var tx = kr.left + kr.width / 2 - rr.left, ty = Math.max(60, Math.min(rr.height - 10, kr.bottom - rr.top + 4));
  var tok = U.fut = {};
  uniUtvonal({ el: U.el, allit: ligetUniAllit, egyseg: function () { return 1; } },
    uniGorbePontok(uniSimaGorbe([[U.x, U.y], [(U.x + tx) / 2, (U.y + ty) / 2 + 24], [tx, ty]])), { ido: 1 },
    function () { if (U.fut !== tok) return; U.fut = null; setTimeout(function () { if (U.reteg.isConnected) indit(); }, 120); });
}

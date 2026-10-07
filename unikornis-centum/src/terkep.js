/* ═════════════════ 6j) TÉRKÉP: közös térkép-modul + a ligettérkép (ligetválasztó 3. kör) ═════════════════
   Terv: terv/ligetvalaszto-rendszerterv.html + terv/ligetterkep-rajzterv.html (A · Tavaszi völgy + utca-kapu, jóváhagyva 2026-10-05).
   KÖZÖS (a ligettérkép, később a kissárkány-térkép): egy térkép = egy adat-tábla
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
   LIGETTÉRKÉP: LIGET_TERKEP + renderLigetTerkep (a fomenü hívja, ha nincs liget kiválasztva).
   LIGET-BELSŐ: ligetUniReteg + ligetUget — az unikornis a kártyák alatt áll, választáskor odaüget, aztán indul a pálya. */

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
    var p = T.helyek[id][mod], j = jel[id] || {};
    return '<g class="terkep-hely' + (j.alszik ? " alszik" : "") + '" data-id="' + id + '" role="button" tabindex="0" aria-label="' + htmlVed(o.nev(id)) + '">' +
      '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + k + ')">' +
      '<rect x="-56" y="' + (-T.helyek[id].magas - 6) + '" width="112" height="' + (T.helyek[id].magas + 38) + '" fill="transparent"/>' +
      '<g class="hb">' + T.jelkep[id]() + '</g></g></g>';
  }).join("");
  var cimkek = liget.map(function (id) {
    var p = T.helyek[id][mod];
    return '<g class="terkep-hely" data-id="' + id + '" aria-hidden="true">' + ltCimke(p[0], p[1], o.nev(id), k) + '</g>' + ltJelzesRajz(T, id, p[0], p[1], k, o.nev(id), jel[id], L, mod);
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

/* ── LIGETTÉRKÉP: a rajzterv A változata (Tavaszi völgy) ── */
function ltAnim(attr, values, dur, extra) { return '<animate attributeName="' + attr + '" values="' + values + '" dur="' + dur + '" repeatCount="indefinite"' + (extra || "") + '/>'; }
function ltArnyek(rx) { return '<ellipse cx="0" cy="3" rx="' + rx + '" ry="' + (rx * 0.17).toFixed(1) + '" fill="#3c2a50" opacity=".16"/>'; }
function ltPlusz(x, y, c) { return '<path d="M' + (x - 3.5) + ' ' + y + 'H' + (x + 3.5) + 'M' + x + ' ' + (y - 3.5) + 'V' + (y + 3.5) + '" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round"/>'; }
function ltCsillam(x, y, s, c, dur, kesl) { return '<path d="M' + x + ' ' + (y - s) + 'L' + (x + s * .3) + ' ' + (y - s * .3) + 'L' + (x + s) + ' ' + y + 'L' + (x + s * .3) + ' ' + (y + s * .3) + 'L' + x + ' ' + (y + s) + 'L' + (x - s * .3) + ' ' + (y + s * .3) + 'L' + (x - s) + ' ' + y + 'L' + (x - s * .3) + ' ' + (y - s * .3) + 'Z" fill="' + c + '">' + ltAnim("opacity", "0.2;1;0.2", dur, ' begin="' + (kesl || 0) + 's"') + '</path>'; }
function ltRozsa(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#c0567f" stroke-width="1"/><path d="M' + (x - r * .4) + ' ' + y + 'q' + (r * .4) + ' ' + (-r * .5) + ' ' + (r * .7) + ' 0" stroke="#c0567f" stroke-width=".9" fill="none"/>'; }
function ltFalHaz(tetoUrl, tetoD, tetoSzin) {
  return '<path d="M-26 1 Q-25.5 -17 -25 -34 Q0 -35.5 25 -35 Q25.5 -17 26 1 Q0 2.5 -26 1Z" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2"/>' +
         '<path d="M-8 1.5V-15Q-8 -23 0 -23Q8 -23 8 -15V1.5Z" fill="#c99272" stroke="#8a6a7e" stroke-width="1.8"/><circle cx="4.5" cy="-9" r="1.3" fill="#6e4a36"/>' +
         '<path d="' + tetoD + '" fill="' + tetoUrl + '" stroke="' + tetoSzin + '" stroke-width="2" stroke-linejoin="round"/>';
}
/* a jelképek (talppont: 0,0; felfelé rajzolva) — a rajzterv képei változatlanul */
var LT_JELKEP = {
  utca: function(){ return ltArnyek(38) +
    '<path d="M-18 1V-40Q-18 -60 0 -62Q18 -60 18 -40V1Z" fill="url(#lt-gUtca)"/>' +
    '<circle cx="-9" cy="-46" r="1" fill="#fff"/><circle cx="6" cy="-52" r="1.2" fill="#fff"/><circle cx="12" cy="-38" r=".9" fill="#fff"/>' +
    '<path d="M7 -48A5 5 0 1 0 12 -42A3.6 3.6 0 1 1 7 -48Z" fill="#fff1b8"/>' +
    '<path d="M-17 1V-15L-10 -22L-3 -15V1ZM1 1V-19L8.5 -26L16 -19V1Z" fill="#0e1650"/>' +
    '<rect x="-12" y="-12" width="4" height="4" fill="#ffd98a"/><rect x="6.5" y="-15" width="4" height="4" fill="#ffd98a"/><rect x="6.5" y="-7" width="4" height="4" fill="#ffd98a"/>' +
    '<path d="M-31 1L-30 -48L-19 -48L-18 1Z M18 1L19 -48L30 -48L31 1Z" fill="#ece0d0" stroke="#8a7a6e" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M-30 -30H-19M-30 -14H-19M19 -24H30M19 -8H30" stroke="#c9b9a6" stroke-width="1.2"/>' +
    '<path d="M-32 -48Q-31 -78 0 -80Q31 -78 32 -48L19 -48Q18 -64 0 -66Q-18 -64 -19 -48Z" fill="#f3c9d8" stroke="#b5607e" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M-22 -60Q-14 -72 -2 -74" stroke="#fff" stroke-width="2.4" opacity=".5" fill="none" stroke-linecap="round"/>' +
    ltCsillam(0,-73,4.5,"#fce49a","2.4s",0) +
    '<path d="M31 -40H39V-36" stroke="#6e4a36" stroke-width="1.6" fill="none"/><circle cx="39" cy="-31" r="9" fill="url(#lt-gHalo)">' + ltAnim("opacity","0.6;1;0.6","2.8s") + '</circle>' +
    '<rect x="36" y="-36" width="6" height="9" rx="2" fill="#ffe08a" stroke="#6e4a36" stroke-width="1.2"/>'; },
  odu: function(){ return ltArnyek(42) +
    '<path d="M-34 2Q-42 4 -47 1M34 2Q42 5 47 2M-20 3Q-26 7 -30 6" stroke="#6e4a36" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M-34 2Q-31 -10 -30 -30Q-31 -48 -27 -60Q-12 -66 2 -65Q18 -66 27 -60Q31 -46 30 -28Q31 -10 35 2Q20 5 0 4Q-20 5 -34 2Z" fill="url(#lt-gTorzs)" stroke="#6e4a36" stroke-width="2"/>' +
    '<path d="M-21 -50Q-23 -30 -20 -12M20 -48Q23 -30 21 -10" stroke="#7a5440" stroke-width="1.6" fill="none" opacity=".55"/>' +
    '<ellipse cx="0" cy="-61" rx="27" ry="7" fill="#ecd0a6" stroke="#6e4a36" stroke-width="2"/>' +
    '<ellipse cx="0" cy="-61" rx="16" ry="4" fill="none" stroke="#c9a476" stroke-width="1.4"/><ellipse cx="0" cy="-61" rx="7" ry="1.8" fill="none" stroke="#c9a476" stroke-width="1.2"/>' +
    '<path d="M-12 3V-20Q-12 -32 0 -32Q12 -32 12 -20V3Z" fill="url(#lt-gAblak)" stroke="#6e4a36" stroke-width="2"/><circle cx="7" cy="-12" r="1.6" fill="#6e4a36"/>' +
    '<circle cx="19" cy="-42" r="5.5" fill="url(#lt-gAblak)" stroke="#6e4a36" stroke-width="1.6"/>' +
    '<path d="M-5 -66Q-7 -77 -1 -84" stroke="#5f9e6a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M-5 -72Q-14 -77 -17 -70Q-10 -67 -5 -72Z M-2 -80Q6 -86 9 -79Q2 -76 -2 -80Z" fill="#8fd18f" stroke="#5f9e6a" stroke-width="1.2"/>' +
    '<path d="M-31 -1Q-32 -9 -24 -10Q-17 -9 -18 -1Z" fill="#f6a5c0" stroke="#b5607e" stroke-width="1.4"/><circle cx="-27" cy="-6" r="1.3" fill="#fff"/><circle cx="-22" cy="-7" r="1" fill="#fff"/>'; },
  kert: function(){   /* Térkép mint központ (2. kör): rózsaíves kertkapu sövénnyel; a kapun át a napfényes túlpart két virágágyása,
                        elöl patak-kanyar tavirózsával — a C2 patakparti kert kicsiben (terv/terkep-kozpont-rajzterv.html) */
    var ny = "M-15 1V-40Q-15 -60 0 -61Q15 -60 15 -40V1Z";   /* a kapu nyílása */
    return ltArnyek(46) +
    '<defs><clipPath id="lt-kertNyilas"><path d="' + ny + '"/></clipPath></defs>' +
    '<g clip-path="url(#lt-kertNyilas)"><rect x="-16" y="-62" width="32" height="64" fill="#cfe9fa"/><circle cx="7" cy="-44" r="6" fill="#fff4c2"/>' +
    '<path d="M-16 -22Q0 -30 16 -22V2H-16Z" fill="#a8dc9c"/>' +
    '<ellipse cx="-7" cy="-20" rx="7" ry="2.6" fill="#f6a5c0"/><ellipse cx="7" cy="-20" rx="7" ry="2.6" fill="#c9a8e6"/>' +
    '<circle cx="-9" cy="-21.5" r="1.2" fill="#fff"/><circle cx="-5" cy="-21" r="1.1" fill="#f28ab8"/><circle cx="5" cy="-21.5" r="1.1" fill="#fff"/><circle cx="9" cy="-21" r="1.2" fill="#7a5ea8"/>' +
    '<path d="M-16 -12Q0 -16 16 -12V2H-16Z" fill="#8ecf6e"/><path d="M-4 -9H4" stroke="#a9d6ef" stroke-width="2.4" stroke-linecap="round"/></g>' +
    '<path d="M-46 2Q-50 -18 -40 -30Q-30 -40 -20 -32Q-17 -29 -17 -20V2Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="1.8"/>' +
    '<path d="M17 2V-20Q17 -30 26 -34Q36 -38 43 -28Q50 -16 45 2Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="1.8"/>' +
    '<circle cx="-36" cy="-20" r="2.6" fill="#fff"/><circle cx="-27" cy="-10" r="2.2" fill="#fce49a"/><circle cx="-40" cy="-6" r="2" fill="#f6a5c0"/><circle cx="-26" cy="-26" r="2" fill="#f6a5c0"/>' +
    '<circle cx="28" cy="-22" r="2.4" fill="#fff"/><circle cx="36" cy="-10" r="2.2" fill="#f6a5c0"/><circle cx="25" cy="-8" r="2" fill="#fce49a"/>' +
    '<path d="M-14 2V-18H0V2Z" fill="#fffaf0" stroke="#b5a08a" stroke-width="1.4"/><path d="M-9.5 -18V2M-5 -18V2M-14 -9H0" stroke="#d9cbb4" stroke-width="1.1"/>' +
    '<path d="M2 2L10 -1V-21L2 -18Z" fill="#f3ead8" stroke="#b5a08a" stroke-width="1.3"/><path d="M6 0V-19.5" stroke="#d9cbb4" stroke-width="1"/>' +
    '<path d="' + ny + '" fill="none" stroke="#b5a08a" stroke-width="7.5" stroke-linejoin="round"/>' +
    '<path d="' + ny + '" fill="none" stroke="#fffaf0" stroke-width="4.5" stroke-linejoin="round"/>' +
    '<path d="M-15 -4Q-19 -14 -14 -22Q-19 -32 -14 -42Q-12 -54 -4 -59Q4 -63 10 -57Q17 -50 15 -40Q19 -30 14 -20Q18 -12 15 -4" fill="none" stroke="#6fae74" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M-19 -26q-5 -2 -7 2q4 2 7 -2zM19 -30q5 -2 7 2q-4 2 -7 -2zM-8 -60q-2 -5 2 -7q2 4 -2 7zM18 -12q5 -1 6 3q-4 1 -6 -3z" fill="#8fd18f" stroke="#5f9e6a" stroke-width=".8"/>' +
    ltRozsa(-15, -36, 4.4, "#f6a5c0") + ltRozsa(-11, -52, 4.8, "#fbc4d8") + ltRozsa(1, -61, 5.4, "#f28ab8") + ltRozsa(13, -51, 4.6, "#f6a5c0") + ltRozsa(16, -34, 4.2, "#fbc4d8") +
    ltRozsa(-16, -19, 3.8, "#f28ab8") + ltRozsa(16, -17, 3.6, "#f6a5c0") +
    '<path d="M18 5Q34 -2 50 4Q56 8 48 11Q34 14 20 11Z" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/>' +
    '<path d="M27 6h10M41 8h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>' +
    '<ellipse cx="44" cy="6.5" rx="5" ry="2" fill="#8fd18f" stroke="#5f9e6a" stroke-width=".8"/><circle cx="44" cy="5" r="1.8" fill="#f6a5c0"/>' +
    '<path d="M-31 4V-6M-25 4V-8" stroke="#5f9e6a" stroke-width="1.4"/><path d="M-34 -6q3 -6 6 0q-3 2 -6 0z" fill="#f2708f"/><path d="M-28 -8q3 -6 6 0q-3 2 -6 0z" fill="#c9a8e6"/>' +
    ltCsillam(28, -46, 4.2, "#fff3a8", "2.4s", .5) + ltCsillam(-30, -40, 3.2, "#ffffff", "2.9s", 1.2); },
  egyeni: function(){ return ltArnyek(36) +
    '<path d="M-3 1L-2 -14L2 -14L3 1Z" fill="url(#lt-gTorzs)" stroke="#6e4a36" stroke-width="1.4"/>' +
    '<path d="M0 -12C-42 -34 -36 -76 -13 -72Q-4 -70 0 -60Q4 -70 13 -72C36 -76 42 -34 0 -12Z" fill="url(#lt-gSziv)" stroke="#5f9e6a" stroke-width="2"/>' +
    [[-16,-52],[12,-56],[-2,-38],[18,-40],[-20,-36],[2,-62]].map(function(p,i){ var c=["#f6a5c0","#f28ab8","#fbc4d8"][i%3];
      return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5.2" fill="'+c+'" stroke="#c0567f" stroke-width="1.1"/><path d="M'+(p[0]-2)+' '+p[1]+'q2 -2.5 3.5 0q-1 2 -3 1" stroke="#c0567f" stroke-width="1" fill="none"/>'; }).join("") +
    '<rect x="12" y="-13" width="18" height="14" rx="2" fill="#c9a8e6" stroke="#7a5ea8" stroke-width="1.6"/><path d="M21 -13V1M12 -7H30" stroke="#fce49a" stroke-width="3"/>' +
    '<path d="M21 -13Q15 -20 17 -22Q20 -21 21 -13Q22 -21 25 -22Q27 -20 21 -13Z" fill="#fce49a" stroke="#d1a23a" stroke-width="1"/>' +
    ltCsillam(-30,-70,5,"#fff3a8","2.2s",0) + ltCsillam(30,-64,4,"#fff3a8","2.6s",.8) + ltCsillam(0,-80,3.5,"#ffffff","1.9s",1.3); },
  osszeado: function(){ return ltArnyek(46) +
    '<path d="M-27 1L-26 -26L-21 -26L-20 1Z" fill="url(#lt-gTorzs)" stroke="#6e4a36" stroke-width="1.5"/>' +
    '<path d="M-38 -34Q-44 -48 -32 -54Q-26 -62 -16 -56Q-6 -52 -10 -40Q-12 -28 -24 -28Q-36 -26 -38 -34Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="1.8"/>' +
    '<path d="M-5 2Q-2 -20 -7 -36L7 -36Q3 -18 6 2Z" fill="url(#lt-gTorzs)" stroke="#6e4a36" stroke-width="1.8"/>' +
    '<path d="M-22 -48Q-32 -66 -14 -76Q-6 -92 12 -86Q30 -92 35 -70Q46 -56 32 -42Q26 -30 8 -34Q-12 -28 -22 -48Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="2"/>' +
    '<ellipse cx="0" cy="-72" rx="13" ry="7" fill="#fff" opacity=".28"/>' +
    ltPlusz(-10,-62,"#f6a5c0") + ltPlusz(15,-75,"#fff") + ltPlusz(23,-52,"#f28ab8") + ltPlusz(2,-46,"#fce49a") + ltPlusz(-28,-44,"#fff") + ltPlusz(28,-66,"#fce49a"); },
  szorzo: function(){ return ltArnyek(40) +
    '<path d="M14 1Q8 -10 16 -16Q22 -24 30 -16Q38 -10 30 1Z" fill="url(#lt-gFa2)" stroke="#6f6aa8" stroke-width="1.6"/>' +
    '<path d="M-3 2Q-1 -24 -4 -44L4 -44Q2 -22 4 2Z" fill="url(#lt-gTorzs)" stroke="#6e4a36" stroke-width="1.6"/>' +
    '<path d="M0 -102Q23 -82 23 -60Q23 -40 0 -38Q-23 -40 -23 -60Q-23 -82 0 -102Z" fill="url(#lt-gFa2)" stroke="#6f6aa8" stroke-width="2"/>' +
    '<path d="M-6 -86Q-13 -74 -12 -62" stroke="#fff" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>' +
    '<path d="M-27 -100A12 12 0 1 0 -14 -80A9 9 0 1 1 -27 -100Z" fill="#ffe08a" stroke="#d1a23a" stroke-width="1.3"/>' +
    '<g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M16 -94l6 6M22 -94l-6 6">'+ltAnim("opacity","0.3;1;0.3","2.4s")+'</path><path d="M27 -72l5 5M32 -72l-5 5">'+ltAnim("opacity","1;0.3;1","2.8s")+'</path><path d="M-14 -56l5 5M-9 -56l-5 5">'+ltAnim("opacity","0.4;1;0.4","3.1s")+'</path></g>'; },
  szabo: function(){ return ltArnyek(40) +
    ltFalHaz("url(#lt-gTetoR)", "M-33 -32Q-14 -58 0 -66Q14 -58 33 -33Q0 -38 -33 -32Z", "#b5607e") +
    '<circle cx="15" cy="-21" r="7" fill="#fce49a" stroke="#d1a23a" stroke-width="1.6"/><circle cx="12.6" cy="-23.4" r="1.2" fill="#d1a23a"/><circle cx="17.4" cy="-23.4" r="1.2" fill="#d1a23a"/><circle cx="12.6" cy="-18.6" r="1.2" fill="#d1a23a"/><circle cx="17.4" cy="-18.6" r="1.2" fill="#d1a23a"/>' +
    '<path d="M-26 -28H-40" stroke="#6e4a36" stroke-width="2.4" stroke-linecap="round"/><path d="M-37 -28V-24M-31 -28V-24" stroke="#6e4a36" stroke-width="1"/>' +
    '<g><animateTransform attributeName="transform" type="rotate" values="-5 -34 -28;5 -34 -28;-5 -34 -28" dur="3s" repeatCount="indefinite"/>' +
    '<rect x="-42" y="-24" width="16" height="3" rx="1" fill="#c99272" stroke="#6e4a36" stroke-width="1"/><rect x="-40" y="-21" width="12" height="11" fill="#9ec9f0" stroke="#5f84b0" stroke-width="1"/>' +
    '<path d="M-40 -18H-28M-40 -15H-28M-40 -12H-28" stroke="#cfe5fa" stroke-width="1"/><rect x="-42" y="-10" width="16" height="3" rx="1" fill="#c99272" stroke="#6e4a36" stroke-width="1"/></g>' +
    '<path d="M-6 -60Q4 -64 12 -58" stroke="#fff" stroke-width="2.4" opacity=".45" fill="none" stroke-linecap="round"/>'; },
  bajital: function(){ return ltArnyek(40) +
    '<path d="M-26 1Q-25.5 -16 -25 -32Q0 -33.5 25 -33Q25.5 -16 26 1Q0 2.5 -26 1Z" fill="url(#lt-gFal)" stroke="#5f8e8a" stroke-width="2"/>' +
    '<rect x="11" y="-80" width="9" height="20" rx="1.5" fill="#c99a8a" stroke="#7a5a6e" stroke-width="1.6"/>' +
    '<path d="M-31 -30Q-31 -70 0 -72Q31 -70 31 -30Q0 -35 -31 -30Z" fill="url(#lt-gTetoT)" stroke="#3f8a85" stroke-width="2"/>' +
    '<path d="M-16 -54Q-8 -64 4 -64" stroke="#fff" stroke-width="2.6" opacity=".45" fill="none" stroke-linecap="round"/>' +
    '<path d="M-8 1.5V-15Q-8 -23 0 -23Q8 -23 8 -15V1.5Z" fill="#9a7bc0" stroke="#5f4a86" stroke-width="1.8"/><circle cx="4.5" cy="-9" r="1.3" fill="#fce49a"/>' +
    '<path d="M13 -26h6v4l4 6q1 4 -3 4h-8q-4 0 -3 -4l4 -6z" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1.4"/><path d="M12 -16h12" stroke="#d9f5cf" stroke-width="2"/>' +
    '<path d="M-22 -24h8v8h-8z" fill="url(#lt-gAblak)" stroke="#5f8e8a" stroke-width="1.4"/>' +
    [["#c9a8e6",0,3.6],["#a7d99a",.9,3],["#f6a5c0",1.8,2.6]].map(function(b){
      return '<circle cx="15.5" cy="-84" r="'+b[2]+'" fill="'+b[0]+'" stroke="#fff" stroke-width=".8" opacity="0">' +
        ltAnim("cy","-84;-118",'2.7s',' begin="'+b[1]+'s"') + ltAnim("cx","15.5;20;13;18",'2.7s',' begin="'+b[1]+'s"') + ltAnim("opacity","0;1;0",'2.7s',' begin="'+b[1]+'s"') + '</circle>'; }).join(""); },
  pekseg: function(){ return ltArnyek(40) +
    '<rect x="-20" y="-78" width="9" height="18" rx="1.5" fill="#c99a8a" stroke="#7a5a6e" stroke-width="1.6"/>' +
    [0,1.3].map(function(k){ return '<circle cx="-15.5" cy="-82" r="5" fill="#fff" opacity="0">'+ltAnim("cy","-82;-112",'2.6s',' begin="'+k+'s"')+ltAnim("r","4;9",'2.6s',' begin="'+k+'s"')+ltAnim("opacity","0;.75;0",'2.6s',' begin="'+k+'s"')+'</circle>'; }).join("") +
    ltFalHaz("url(#lt-gTetoM)", "M-33 -31Q-31 -58 0 -66Q31 -58 33 -31Q27 -25 22 -31Q16 -23 10 -31Q4 -25 -2 -31Q-8 -23 -14 -31Q-20 -25 -26 -31Q-30 -27 -33 -31Z", "#c9862a") +
    '<circle cx="0" cy="-69" r="5" fill="#f2708f" stroke="#b5405e" stroke-width="1.4"/><path d="M0 -74Q3 -80 7 -80" stroke="#5f9e6a" stroke-width="1.6" fill="none"/><circle cx="-1.6" cy="-70.5" r="1.3" fill="#fff" opacity=".7"/>' +
    '<path d="M-8 -52Q0 -58 10 -54" stroke="#fff" stroke-width="2.4" opacity=".5" fill="none" stroke-linecap="round"/>' +
    '<rect x="10" y="-27" width="12" height="10" rx="2" fill="url(#lt-gAblak)" stroke="#8a6a7e" stroke-width="1.4"/>' +
    '<path d="M-24 -20h10l-2 9h-6z" fill="#e8b27a" stroke="#8a5a3a" stroke-width="1.2"/><path d="M-25 -20q0 -7 6 -7q6 0 6 7z" fill="#f7b8d0" stroke="#b5607e" stroke-width="1.2"/><circle cx="-19" cy="-28" r="1.6" fill="#f2708f"/>'; },
  vasar: function(){ return ltArnyek(44) +
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
    '<circle cx="-22" cy="-14" r="3.6" fill="#f2708f"/><circle cx="-16" cy="-15" r="3.4" fill="#fce49a"/><circle cx="-13" cy="-12.5" r="2.8" fill="#a7d99a"/>'; },
  konyvtar: function(){ return ltArnyek(36) +
    '<path d="M-18 1L-16 -78Q0 -80 16 -78L18 1Q0 3 -18 1Z" fill="url(#lt-gTorony)" stroke="#6f5a9e" stroke-width="2"/>' +
    '<path d="M-17 -38Q0 -40 17 -38M-17.5 -20Q0 -22 17.5 -20" stroke="#8f78bf" stroke-width="1.2" fill="none" opacity=".6"/>' +
    '<path d="M-26 -74Q-8 -90 0 -112Q8 -90 26 -74Q0 -80 -26 -74Z" fill="#8a6fc0" stroke="#5a4890" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M-6 -96Q-10 -86 -14 -80" stroke="#fff" stroke-width="2.2" opacity=".35" fill="none" stroke-linecap="round"/>' +
    ltCsillam(0,-116,4.5,"#fce49a","2.4s",0) +
    '<circle cx="0" cy="-57" r="11" fill="url(#lt-gAblak)" stroke="#6f5a9e" stroke-width="2"/>' +
    '<path d="M-7 -50Q-7 -62 0 -62Q7 -62 7 -50Z" fill="#b08a68"/><path d="M-6 -61l2 -4l2 3M6 -61l-2 -4l-2 3" fill="#b08a68"/>' +
    '<circle cx="-3" cy="-56" r="2.6" fill="#fff"/><circle cx="3" cy="-56" r="2.6" fill="#fff"/><circle cx="-3" cy="-56" r="1.3" fill="#2a2140"/><circle cx="3" cy="-56" r="1.3" fill="#2a2140"/>' +
    '<path d="M-1 -53l1 2l1 -2z" fill="#f0aa3c"/>' +
    '<rect x="-6" y="-59" width="12" height="0" fill="#b08a68">' + ltAnim("height","0;0;6;0;0","4s",' keyTimes="0;0.86;0.9;0.94;1"') + '</rect>' +
    '<path d="M-7 1.5V-13Q-7 -20 0 -20Q7 -20 7 -13V1.5Z" fill="#c99272" stroke="#6f5a9e" stroke-width="1.6"/>' +
    '<rect x="18" y="-6" width="16" height="6" rx="1" fill="#f6a5c0" stroke="#b5607e" stroke-width="1"/><rect x="20" y="-12" width="13" height="6" rx="1" fill="#9ec9f0" stroke="#5f84b0" stroke-width="1"/><rect x="19" y="-17" width="12" height="5" rx="1" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1"/>'; },
  fejtoro: function(){ return ltArnyek(66) +
    '<path d="M-72 2Q-50 -30 -30 -52Q-14 -72 -2 -94Q8 -78 18 -66Q28 -74 34 -62Q54 -32 74 2Q0 6 -72 2Z" fill="url(#lt-gHegy)" stroke="#6f5a9e" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M18 -66Q30 -40 40 -20M-2 -94Q-20 -60 -30 -30" stroke="#fff" stroke-width="2" opacity=".3" fill="none"/>' +
    '<path d="M-15 -72Q-7 -86 -2 -94Q6 -82 12 -72Q7 -66 3 -72Q-3 -64 -8 -72Q-11 -67 -15 -72Z" fill="#fff" stroke="#c9bde6" stroke-width="1.2"/>' +
    '<path d="M24 -70Q28 -73 31 -66Q28 -63 26 -66Z" fill="#fff"/>' +
    '<path d="M-22 1Q-6 -8 -18 -20Q0 -28 -12 -42Q2 -50 -5 -64" stroke="#f3e2c2" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-dasharray="1 5"/>' +
    '<path d="M-2 -93V-118" stroke="#6e4a36" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M-2 -118Q8 -120 17 -115Q8 -111 -2 -108Z" fill="#f6a5c0" stroke="#b5607e" stroke-width="1">' + ltAnim("d","M-2 -118Q8 -120 17 -115Q8 -111 -2 -108Z;M-2 -118Q8 -115 17 -117Q8 -109 -2 -108Z;M-2 -118Q8 -120 17 -115Q8 -111 -2 -108Z","1.4s") + '</path>' +
    '<path d="M44 -6q0 -9 9 -9t9 9z" fill="#b8b0c8" stroke="#6f5a9e" stroke-width="1.4"/><text x="53" y="-5.5" font-size="9" font-weight="700" text-anchor="middle" fill="#4a3b7a" font-family="Fredoka,sans-serif">?</text>'; }
};
function ltVeletlen(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function ltSzabadHely(T, x, y, mod, tav) {
  for (var k in T.helyek) { var p = T.helyek[k][mod]; if (Math.abs(x - p[0]) < (tav || 52) && y > p[1] - T.helyek[k].magas - 12 && y < p[1] + 34) return false; }
  return true;
}
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
/* a táj: ég, nap, három dombsor, tavacska, bokrok, fák, virágok (álló réteg, firkával) + úszó felhők, két pillangó (mozgó réteg) */
function ltTaj(T, mod) {
  var L = T.elr[mod], w = L.w, h = L.h, hz = L.hz, r = ltVeletlen(7), s = "", mozgo = "", i, x, y;
  s += '<rect width="' + w + '" height="' + h + '" fill="url(#lt-gEgA)"/>';
  s += '<circle cx="' + (w * 0.08) + '" cy="' + (h * 0.1) + '" r="54" fill="url(#lt-gNap)"/><circle cx="' + (w * 0.08) + '" cy="' + (h * 0.1) + '" r="21" fill="#fff4c2"/>';
  s += '<path d="M0 ' + (hz - 10) + 'Q' + (w * .18) + ' ' + (hz - 58) + ' ' + (w * .38) + ' ' + (hz - 28) + 'T' + (w * .78) + ' ' + (hz - 40) + 'T' + w + ' ' + (hz - 22) + 'V' + h + 'H0Z" fill="#d9cbef"/>';
  s += '<path d="M0 ' + (hz + 18) + 'Q' + (w * .24) + ' ' + (hz - 20) + ' ' + (w * .5) + ' ' + (hz + 8) + 'T' + w + ' ' + hz + 'V' + h + 'H0Z" fill="#c4e6bc"/>';
  s += '<path d="M0 ' + (hz + 44) + 'Q' + (w * .3) + ' ' + (hz + 20) + ' ' + (w * .62) + ' ' + (hz + 40) + 'T' + w + ' ' + (hz + 30) + 'V' + h + 'H0Z" fill="url(#lt-gRetA)"/>';
  var to = L.to;
  s += '<ellipse cx="' + to[0] + '" cy="' + to[1] + '" rx="' + to[2] + '" ry="' + to[3] + '" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="2"/><path d="M' + (to[0] - to[2] * .5) + ' ' + (to[1] - 2) + 'h' + (to[2] * .5) + '" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>';
  for (i = 0; i < 14; i++) { x = 20 + r() * (w - 40); y = hz + 50 + r() * (h - hz - 60); if (ltSzabadHely(T, x, y, mod, 58)) s += r() < .5 ? ltBokor(x, y, 1 + r() * .4, "#a8dc9c", "#6fae74") : ltKisfa(x, y, 1 + r() * .3, "#9fd49a", "#6fae74"); }
  for (i = 0; i < 70; i++) { x = 8 + r() * (w - 16); y = hz + 40 + r() * (h - hz - 44); if (ltSzabadHely(T, x, y, mod, 40)) s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (1.6 + r() * 1.4).toFixed(1) + '" fill="' + ["#f6a5c0", "#fce49a", "#ffffff", "#c9a8e6"][i % 4] + '"/>'; }
  mozgo += ltFelho(0, 46, 1.2, 80, 10, "#ffffff", w) + ltFelho(0, 78, .8, 110, 70, "#ffffff", w) + ltFelho(0, 30, .9, 95, 40, "#fdfdfd", w);
  mozgo += L.lepkek.map(function (l) { return ltLepke(l[0], l[1], l[2], l[3]); }).join("");
  return { allo: s, mozgo: mozgo };
}
/* név-tábla a jelkép alatt + a jelzések (⭐ kész/összes, legfeljebb 2 kerek jelvény a bal vállon, alvó hold) */
function ltCimke(x, y, nev, k) {
  var sz = nev.length * 7.2 + 22;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><rect x="' + ltF(-sz / 2) + '" y="7" width="' + ltF(sz) + '" height="22" rx="11" fill="#ffffff" opacity=".94" stroke="#e6d8f0"/>' +
         '<text y="23" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2a2140">' + htmlVed(nev) + '</text></g>';
}
function ltJelzesRajz(T, id, x, y, k, nev, j, L, mod) {
  if (!j) return "";
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
  '<radialGradient id="lt-gNap" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7cc"/><stop offset=".55" stop-color="#ffeaa0" stop-opacity=".7"/><stop offset="1" stop-color="#ffeaa0" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="lt-gUtca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12194f"/><stop offset=".6" stop-color="#2b2f78"/><stop offset="1" stop-color="#5a4a9a"/></linearGradient>' +
  '<linearGradient id="lt-gEgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8e3f7"/><stop offset="1" stop-color="#eef6ee"/></linearGradient>' +
  '<linearGradient id="lt-gRetA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4f0c8"/><stop offset="1" stop-color="#b3dea4"/></linearGradient>' +
  '<filter id="lt-firka" x="-5%" y="-5%" width="110%" height="110%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/>' +
  '<feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/>' +
  '</filter>' +
  '</defs>';
/* A HELY-TÁBLA: új liget = egy új sor itt + egy út az UTAK-ban + egy jelkép (a nevét a LIGET_NEV adja, ui.js)
   Térkép mint központ, 2. kör: a Kert az Odú mellé került. Fekvő: a „Neked készült” a térkép alsó közepére, az Összeadó
   kicsit feljebb. Álló: a Kert az utca-kapu régi helyén, az utca-kapu egy lépéssel beljebb, az Összeadó és a Szorzós közé. */
var LIGET_TERKEP = {
  helyek: {
    odu:      { szeles: [ 95, 405], allo: [ 85, 705], magas:  86, szel: 66 },
    utca:     { szeles: [ 52, 322], allo: [215, 602], magas:  80, szel: 52 },
    kert:     { szeles: [245, 428], allo: [195, 700], magas:  66, szel: 56 },
    egyeni:   { szeles: [450, 425], allo: [295, 720], magas:  76, szel: 64 },
    osszeado: { szeles: [300, 340], allo: [125, 592], magas:  92, szel: 72 },
    szorzo:   { szeles: [175, 250], allo: [305, 585], magas: 102, szel: 60 },
    szabo:    { szeles: [330, 212], allo: [ 75, 447], magas:  74, szel: 70 },
    bajital:  { szeles: [452, 300], allo: [205, 425], magas:  84, szel: 64 },
    pekseg:   { szeles: [582, 402], allo: [310, 447], magas:  76, szel: 64 },
    vasar:    { szeles: [688, 334], allo: [300, 302], magas:  76, szel: 72 },
    konyvtar: { szeles: [578, 218], allo: [105, 282], magas: 114, szel: 58 },
    fejtoro:  { szeles: [690, 122], allo: [245, 142], magas: 118, szel: 56 }
  },
  utak: {
    szeles: [["odu", "utca", -10], ["odu", "kert", 14], ["odu", "osszeado", -26], ["osszeado", "egyeni", -14], ["osszeado", "szorzo", 24], ["osszeado", "bajital", -18],
             ["bajital", "szabo", 20], ["bajital", "pekseg", 22], ["pekseg", "vasar", -20], ["bajital", "konyvtar", -16],
             ["vasar", "konyvtar", 18], ["konyvtar", "fejtoro", 24]],
    allo:   [["odu", "kert", 10], ["kert", "egyeni", -10], ["odu", "osszeado", -26], ["osszeado", "utca", 12], ["utca", "szorzo", -12], ["osszeado", "bajital", -18],
             ["bajital", "szabo", 20], ["bajital", "pekseg", 22], ["pekseg", "vasar", -20], ["bajital", "konyvtar", -16],
             ["vasar", "konyvtar", 18], ["konyvtar", "fejtoro", 24]]
  },
  elr: { szeles: { w: 800, h: 460, hz: 110, uni: 0.5, jk: 1, to: [740, 432, 50, 13], lepkek: [[395, 190, 7, "#f7b8d0"], [640, 300, 9, "#fce49a"]] },
         allo:   { w: 400, h: 760, hz: 120, uni: 0.44, jk: 0.86, jelLe: true, to: [40, 520, 30, 10], lepkek: [[220, 240, 7, "#f7b8d0"], [150, 660, 9, "#fce49a"]] } },
  oldal: { szeles: { kert: -1, vasar: -1, fejtoro: -1, szorzo: 1 }, allo: { odu: -1, kert: -1, utca: 1, szorzo: -1, vasar: -1, fejtoro: -1 } },
  jelFent: { odu: true },   /* az Odú jele (🥚 / 🦋 / ☁️, kaland.js) a csonk tetején */
  jelkep: LT_JELKEP,
  taj: ltTaj,
  defs: LT_DEFS
};
var LIGET_M = null;       /* a kirajzolt ligettérkép (terkepRajzol eredménye) */
var TERKEP_HOL = null;    /* { leny, id }: hol áll az unikornis a térképen ebben a játékban (odú/kert/utca-kapu is); különben P().utolsoLiget */
function ltNev(id) { return id === "odu" ? "Odú" : id === "utca" ? "Utca" : id === "kert" ? "Kert" : (LIGET_NEV[id] || ["", id])[1]; }
function renderLigetTerkep(racs, L) {
  var host = el("div", "terkep-host uni-terep");
  racs.appendChild(host);
  var lathato = { odu: true, utca: true, kert: true }, jel = {}, mod = utcaMod(host.clientWidth, host.clientHeight);
  L.sorrend.forEach(function (r) { if (LIGET_TERKEP.helyek[r]) { lathato[r] = true; jel[r] = ligetOsszegzo(r, L.regiok[r]); } });
  jel.kert = { jelzes: (tenyKertVar() ? ["🦋"] : []).concat(lenyKertJel()) };   /* + 🌈 a nagy sárkány vár a kertben (leny.js, 5. kör) */   /* 🦋 a kertben új dolog vár (meglepetés, kinyílt virág) — csak egy kedves jel (teny-kert.js) */
  jel.odu = { jelzes: lenyTerkepJel() };                 /* 🥚 / 🦋 / ☁️ a kis lény vár az odúban (kaland.js, visszahívás 4. kör) */
  var halo = terkepHalo(LIGET_TERKEP, lathato, mod);
  var hol = TERKEP_HOL && TERKEP_HOL.leny === mentes.leny ? TERKEP_HOL.id : P().utolsoLiget;
  if (!lathato[hol]) hol = "odu";
  LIGET_M = terkepRajzol(host, LIGET_TERKEP, { mod: mod, all: hol, halo: halo, nev: ltNev, jelzes: jel, koppint: ligetTerkepKoppint });
  LIGET_M.jel = jel;
  bemutat("terkep");   /* egyszer: „a kertünk mostantól itt van…” (ui.js) */
}
function ligetTerkepKoppint(id) {
  var M = LIGET_M; if (!M || !M.svg.isConnected) return;
  if (M.fut) { terkepSetal(M, id); return; }   /* második koppintás séta közben: azonnal ott van */
  hangGomb();
  var j = M.jel[id];
  mondd(id === "utca" ? "Irány az utca!" : id === "odu" ? "Haza, az odúba!" : id === "kert" ? "Irány a kert!" : (j && j.alszik ? zarvaMondat() : ltNev(id) + "!"));
  terkepSetal(M, id, function () {
    TERKEP_HOL = { leny: mentes.leny, id: id };
    terkepBelep(M, id, function () {
      if (!$("kepernyo-fomenu").classList.contains("aktiv")) return;   /* közben máshová ment */
      if (id === "utca") utcaNyit();
      else if (id === "odu") oduNyit("fomenu");
      else if (id === "kert") kertNyit();
      else ligetbeLep(id);
    });
  });
}
window.addEventListener("resize", function () {   /* forgatás: más elrendezés (fekvő ↔ álló); a ligetben az unikornis a helyére */
  if (!$("kepernyo-fomenu").classList.contains("aktiv")) return;
  if (FOMENU_LIGET) { ligetUniAlap(); return; }
  var host = document.querySelector("#palya-racs .terkep-host");
  if (host && LIGET_M && !LIGET_M.fut && utcaMod(host.clientWidth, host.clientHeight) !== LIGET_M.mod) renderFomenu();
});

/* ── LIGET-BELSŐ: az unikornis a kártyák alatt áll (bal lent), választáskor odaüget a kártyához, aztán indul a pálya ── */
var LIGET_UNI = null;
function ligetUniReteg() {
  var k = $("kepernyo-fomenu"), regi = $("liget-uni-reteg");
  if (regi) regi.parentNode.removeChild(regi);
  LIGET_UNI = null;
  if (!FOMENU_LIGET) return;
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

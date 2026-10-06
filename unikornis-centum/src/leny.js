/* ============ 6k) 🐣 A KIS LÉNY — varázstojás → fióka (→ kalandtérkép → kölyök → nagy) ============
   Terv: terv/visszahivas-rendszerterv.html (3. elem) + terv/visszahivas-rajzterv.html (A rész, jóváhagyva).
   Visszahívás 3. kör (2026-10-06): tojás és fióka.
     • Az első végigjátszott pálya után az unikornis a patakparton talál egy meleg, pöttyös tojást. Amikor a gyerek
       legközelebb belép az odúba, egy rövid jelenet mutatja a leletet, aztán a tojás az ágy előtti fészekbe kerül.
     • A tojás gyakorlós napokon érik (gondozas.js: erik): 1. nap kis reccsenés (már a leletkor ott van), 2. nap nagy
       repedés fénnyel, 3. nap kikel — a kikelés az odúba lépve játszódik le, utána a gyerek nevet választ (3-asával).
     • A fióka az odúban totyog, pislog, koppintásra szikrát tüsszent; a kikelés napján a héjsapka még a fején van.
     • Hír az ösvény végén (gondozas.js VISSZA_HIR „leny” sora), legfeljebb egy „holnapra” mondattal.
   A fióka 2 gyakorlós nap után elröppen (kalandtérkép) — ez a 4. kör, addig az odúban marad.
   Egy rajzoló (lenyRajz) + adat-tábla (LENY_RAJZ): fióka, kölyök, nagy és alvó ugyanabból. A szín unikornisonként
   (LENY_SZIN). Mentés: P().leny2 (gondozas.js visszaTar) — fazis, faj, nev, t, lelet, hir.
   Tiltólista: soha halál, betegség, szomorúság; a kimaradt nap semmin nem ront, a lény ott vár, ahol volt. */

/* ── adatok ─────────────────────────────────────────────────────────────── */
var LENY_PAL = {
  menta:     { b: "#a6e0c4", s: "#7cc6a6", d: "#3f8a6b", has: "#fff1c9", csik: "#e9c98a", szarny: "#f7b8d0", szarny2: "#e99bb9", tuske: "#f6a5c0", szarv: "#fce49a", petty: "#fff3d2" },
  levendula: { b: "#cfb6ee", s: "#ac90d8", d: "#6a4f9e", has: "#fde6c4", csik: "#e5c08f", szarny: "#a9d3f3", szarny2: "#86b9e2", tuske: "#9ec9f0", szarv: "#fce49a", petty: "#fff0dc" },
  barack:    { b: "#f9c9a2", s: "#eea576", d: "#a8603a", has: "#fff4d6", csik: "#eac28c", szarny: "#b6e2a8", szarny2: "#93cc83", tuske: "#f6a5c0", szarv: "#fff1b0", petty: "#fff7e4" }
};
var LENY_SZIN = { ragyogas: "menta", tuz: "barack", csillamharmat: "levendula" };   /* rajzterv 2. döntés */
var LENY_NEVEK = ["Parázs", "Szikra", "Pikkely", "Füsti", "Zsarátnok", "Lángi", "Tüsszi", "Pöfi", "Villám", "Smaragd", "Taréj", "Szárnyi"];
/* hány gyakorlós nap egy-egy lépcső (tervlap 5. döntés; később a pultról állítható) */
var LENY_NAP = { tojas: 3, fioka: 2 };
var LENY_TOJAS_LEPCSO = ["reccs", "repedes", "kikel"];   /* a tojás gyakorlós napjai: erik() */
var LENY_INK = "#3b2f4a";

/* a hír-sor mondatai (gondozas.js VISSZA_HIR „leny”); u = az unikornis neve, n = a fióka neve */
var LENY_HIR = {
  lelet: function (u) { return ["🥚 " + u + " talált valamit a patakparton! Nézd meg az odúban!", { t: "Vajon mi lehet benne?…", holnap: 1 }]; },
  reccs: function () { return ["🥚 A tojás megmocorodott a fészekben.", { t: "Holnap talán nagyobbat reccsen…", holnap: 1 }]; },
  repedes: function () { return ["🥚 A tojás megreccsent! Fény szűrődik ki belőle…", { t: "Holnap talán kikukucskál valaki a tojásból…", holnap: 1 }]; },
  kikel: function () { return ["🐣 Nagyon mocorog a tojás az odúban! Menj, nézd meg!"]; },
  fioka: function (u, n) { return ["🐣 " + n + " már ügyesen totyog az odúban."]; }
};
var LENY_HIR_SZIN = "#a0603a";

/* ── a mentés-ág ────────────────────────────────────────────────────────── */
function lenyTar(p) {
  var l = visszaTar(p).leny2;
  if (typeof l.lelet !== "number") l.lelet = 0;   /* 1 = a gyerek már látta a patakparti leletet */
  return l;
}
function lenyPal(lenyKulcs) { return LENY_PAL[LENY_SZIN[lenyKulcs || mentes.leny]] || LENY_PAL.menta; }
/* a tojás hol tart: { i: 0 reccs | 1 repedés | 2 kikelhet, kesz } */
function lenyTojasAll(l) { return erik(l, LENY_TOJAS_LEPCSO.slice(0, LENY_NAP.tojas)); }

/* a pályavége hívja (gondozas.js gyakPalyaVege): ujNap = ez a nap első végigjátszott pályája.
   A lelet bármelyik pályavégén megtörténhet (az első, amikor ez a rész élesedik); a lépcsők csak új gyakorlós napon. */
function lenyPalyaVege(ujNap) {
  var l = lenyTar(), ma = tenyNap();
  if (!l.fazis) {
    l.fazis = "tojas"; l.faj = "sarkany"; l.t = gyakNap(); l.lelet = 0;
    l.hir = { nap: ma, tip: "lelet" };
    return;
  }
  if (!ujNap) return;
  if (l.fazis === "tojas") {
    var e = lenyTojasAll(l);
    if (e.i > 0) l.hir = { nap: ma, tip: e.kesz ? "kikel" : LENY_TOJAS_LEPCSO[e.i] };
  } else if (l.fazis === "fioka") {
    if (gyakNap() - l.t === 1) l.hir = { nap: ma, tip: "fioka" };
  }
}
/* a közös hír-sor forrása: a mai hír egyszer szól */
function lenyHirek() {
  var l = lenyTar();
  if (!l.hir || l.hir.nap !== tenyNap() || l.hir.mondva || !LENY_HIR[l.hir.tip]) return [];
  l.hir.mondva = 1;
  return LENY_HIR[l.hir.tip](LENYEK[mentes.leny].nev, l.nev).map(function (h) {
    if (typeof h === "string") h = { t: h };
    h.szin = LENY_HIR_SZIN;
    return h;
  });
}

/* ════════════ RAJZ: egy rajzoló, négy alak (rajzterv A rész, B kontúr = a saját szín sötétebb árnyalata) ════════════
   egység: az unikornis rajzának egysége; talp y=0, közép x=0, jobbra néz */
var LENY_RAJZ = {
  fioka: { test: [0, -26, 25, 23], fej: [17, -58, 1.0], nyak: null,
           labak: { w: 12, kozel: [-9, 13], tavol: [] }, szarny: { x: -4, y: -40, s: 0.42, ket: false },
           farok: { p: [[-20, -16], [-40, -4], [-56, -18], [-48, -38]], w: [12, 4], sziv: 6, tuske: [0.4, 0.7] },
           hatTuske: [198, 222, 246], szarv: 0.7, kar: [14, -28, 8] },
  kolyok: { test: [0, -50, 40, 29], fej: [50, -110, 1.22], nyak: { p: [[22, -64], [32, -80], [40, -92], [46, -102]], w: [26, 21], tuske: [0.35, 0.75] },
           labak: { w: 15, kozel: [-22, 22], tavol: [-8, 34] }, szarny: { x: -8, y: -72, s: 0.95, ket: true },
           farok: { p: [[-34, -40], [-68, -22], [-94, -48], [-86, -84]], w: [18, 5], sziv: 9, tuske: [0.3, 0.52, 0.74] },
           hatTuske: [196, 214, 232, 250], szarv: 1, kar: [30, -46, 9] },
  nagy: { test: [0, -114, 96, 60], fej: [134, -282, 2.0], nyak: { p: [[58, -138], [94, -184], [110, -236], [126, -262]], w: [56, 38], tuske: [0.22, 0.46, 0.7] },
           labak: { w: 38, kozel: [-56, 54], tavol: [-30, 80] }, szarny: { x: -16, y: -164, s: 2.5, ket: true },
           farok: { p: [[-86, -100], [-164, -66], [-246, -118], [-252, -214]], w: [44, 10], sziv: 20, tuske: [0.22, 0.4, 0.58, 0.76] },
           hatTuske: [194, 208, 222, 236, 250], szarv: 1.6, kar: null },
  alvo: { test: [0, -26, 46, 26], fej: [36, -30, 1.12], nyak: null, alszik: true,
           labak: { w: 0, kozel: [], tavol: [] }, szarny: { x: -8, y: -42, s: 0.62, ket: false, fekvo: true },
           farok: { p: [[-38, -12], [-62, 6], [-10, 16], [30, 6]], w: [17, 5], sziv: 9, tuske: [0.25, 0.45], elol: true },
           hatTuske: [200, 220, 240, 262], szarv: 1, kar: null }
};
var _lnId = 0;
function lnF(n) { return (+n).toFixed(1); }
function lnKv(p) { return { c: p.d, w: 2.4 }; }
function lnSk(p, extra) { var k = lnKv(p); return ' stroke="' + k.c + '" stroke-width="' + (extra ? lnF(k.w * extra) : k.w) + '" stroke-linejoin="round" stroke-linecap="round"'; }
function lnRng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function lnBez(P, t) { var u = 1 - t; return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; }
/* elvékonyodó cső egy köbös görbe mentén (farok, nyak) */
function lnCso(P, w0, w1, n) {
  n = n || 28; var pts = [];
  for (var i = 0; i <= n; i++) {
    var t = i / n, a = lnBez(P, Math.max(0, t - 0.01)), b = lnBez(P, Math.min(1, t + 0.01)), q = lnBez(P, t);
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    pts.push({ x: q[0], y: q[1], nx: -dy, ny: dx, tx: dx, ty: dy, w: (w0 + (w1 - w0) * t) / 2 });
  }
  var bal = pts.map(function (q) { return lnF(q.x + q.nx * q.w) + " " + lnF(q.y + q.ny * q.w); });
  var jobb = pts.map(function (q) { return lnF(q.x - q.nx * q.w) + " " + lnF(q.y - q.ny * q.w); }).reverse();
  return { d: "M" + bal.join("L") + "L" + jobb.join("L") + "Z", pts: pts };
}
function lnTuskeCson(p, c, t, h, oldal, szin) {   /* puha háromszög a cső egyik oldalán */
  var n = c.pts.length - 1, i = Math.round(t * n), a = c.pts[Math.max(0, i - 2)], b = c.pts[Math.min(n, i + 2)], m = c.pts[i], s = oldal;
  var pa = [a.x + a.nx * a.w * s * 0.8, a.y + a.ny * a.w * s * 0.8], pb = [b.x + b.nx * b.w * s * 0.8, b.y + b.ny * b.w * s * 0.8];
  var cs = [m.x + m.nx * (m.w + h) * s - m.tx * h * 0.35, m.y + m.ny * (m.w + h) * s - m.ty * h * 0.35];
  return '<path d="M' + lnF(pa[0]) + " " + lnF(pa[1]) + "Q" + lnF(cs[0]) + " " + lnF(cs[1]) + " " + lnF(cs[0]) + " " + lnF(cs[1]) + "Q" + lnF(cs[0]) + " " + lnF(cs[1]) + " " + lnF(pb[0]) + " " + lnF(pb[1]) + 'Z" fill="' + szin + '"' + lnSk(p) + "/>";
}
function lnTuskeEllipszisen(p, cx, cy, rx, ry, fok, h, szin) {
  var r = fok * Math.PI / 180, d = 0.16;
  function P(a) { return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; }
  var a = P(r - d), b = P(r + d), m = P(r), nx = Math.cos(r) / rx, ny = Math.sin(r) / ry, L = Math.hypot(nx, ny); nx /= L; ny /= L;
  var cs = [m[0] + nx * h, m[1] + ny * h];
  return '<path d="M' + lnF(a[0] - nx * 4) + " " + lnF(a[1] - ny * 4) + "L" + lnF(cs[0]) + " " + lnF(cs[1]) + "L" + lnF(b[0] - nx * 4) + " " + lnF(b[1] - ny * 4) + 'Z" fill="' + szin + '"' + lnSk(p) + "/>";
}
var LN_SZIV_D = "M0 4C-8 -2 -8 -10 -3 -10C-1 -10 0 -8 0 -7C0 -8 1 -10 3 -10C8 -10 8 -2 0 4Z";
function lnFarokSziv(p, c, meret, szin) {
  var q = c.pts[c.pts.length - 1], a = Math.atan2(q.ty, q.tx) * 180 / Math.PI + 90;
  return '<g transform="translate(' + lnF(q.x) + " " + lnF(q.y) + ") rotate(" + lnF(a) + ") scale(" + lnF(meret / 7) + ') translate(0 -3)"><path d="' + LN_SZIV_D + '" fill="' + szin + '"' + lnSk(p, 7 / meret) + "/></g>";
}
var LN_SZARNY_D = "M0 0C-4 -18 -18 -42 -42 -54C-38 -42 -44 -32 -52 -25C-40 -27 -34 -19 -36 -9C-26 -15 -16 -11 -12 0Z";
function lnSzarny(p, o, szin, tavol) {
  var k = lnKv(p);
  return '<g transform="translate(' + o.x + " " + o.y + ") " + (o.fekvo ? "rotate(52) " : "") + (tavol ? "translate(10 -4) rotate(-10) " : "") + "scale(" + o.s + ')"><g class="sz-szarny' + (tavol ? " tavol" : "") + '">' +
    '<path d="' + LN_SZARNY_D + '" fill="' + szin + '" stroke="' + k.c + '" stroke-width="' + lnF(k.w / o.s) + '" stroke-linejoin="round"/>' +
    '<path d="M-3 -6L-41 -51M-7 -4L-50 -26M-10 -2L-35 -11" stroke="' + k.c + '" stroke-width="' + lnF(k.w * 0.55 / o.s) + '" stroke-linecap="round" opacity=".55" fill="none"/>' +
    '<path d="M-2 -4C-6 -20 -20 -42 -41 -52" stroke="' + p.has + '" stroke-width="' + lnF(1.6 / o.s) + '" fill="none" opacity=".7"/></g></g>';
}
function lnLab(p, x, top, w, szin) {
  var k = lnKv(p);
  return '<path d="M' + lnF(x - w / 2) + " " + lnF(top) + "V" + lnF(-w * 0.3) + "Q" + lnF(x - w / 2) + " 0 " + lnF(x - w / 4) + " 0H" + lnF(x + w * 0.55) + "Q" + lnF(x + w * 0.82) + " 0 " + lnF(x + w * 0.62) + " " + lnF(-w * 0.36) + "Q" + lnF(x + w / 2) + " " + lnF(-w * 0.46) + " " + lnF(x + w / 2) + " " + lnF(-w * 0.6) + "V" + lnF(top) + 'Z" fill="' + szin + '"' + lnSk(p) + "/>" +
    '<path d="M' + lnF(x + w * 0.1) + " " + lnF(-w * 0.02) + "v" + lnF(-w * 0.18) + "M" + lnF(x + w * 0.36) + " " + lnF(-w * 0.02) + "v" + lnF(-w * 0.18) + '" stroke="' + k.c + '" stroke-width="' + lnF(k.w * 0.6) + '" stroke-linecap="round" opacity=".6"/>';
}
var LN_FEJ_D = "M-22 -2C-22 -22 -6 -29 6 -27C19 -25 26 -16 27 -6C35 -4 38 7 31 14C25 20 11 21 2 21C-12 21 -22 12 -22 -2Z";
function lnFej(p, R) {
  var k = lnKv(p), hx = R.fej[0], hy = R.fej[1], hs = R.fej[2], w = lnF(k.w / hs);
  var kv2 = ' stroke="' + k.c + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"';
  var s = '<g transform="translate(' + hx + " " + hy + ") scale(" + hs + ')"><g class="sz-fej">';
  s += '<path d="M-17 -12L-33 -17L-21 -22Z" fill="' + p.tuske + '"' + kv2 + '/><path d="M-12 -20L-24 -32L-8 -26Z" fill="' + p.tuske + '"' + kv2 + "/>";
  s += '<g transform="translate(0 -25) scale(1 ' + R.szarv + ') translate(0 25)"><path d="M-7 -23C-10 -34 -5 -40 -1 -42C0 -36 1 -30 1 -24Z" fill="' + p.szarv + '"' + kv2 + '/><path d="M7 -25C6 -36 11 -41 16 -42C16 -36 14 -30 13 -24Z" fill="' + p.szarv + '"' + kv2 + "/></g>";
  s += '<path d="' + LN_FEJ_D + '" fill="' + p.b + '"' + kv2 + "/>";
  s += '<path d="M25 10C29 6 34 7 33 11" fill="none" stroke="' + p.s + '" stroke-width="' + lnF(2 / hs) + '" opacity=".7"/>';
  s += '<ellipse cx="6" cy="8" rx="5.5" ry="3.2" fill="#f59bb0" opacity=".55"/><ellipse cx="22" cy="7" rx="3.4" ry="2.4" fill="#f59bb0" opacity=".45"/>';
  s += '<circle cx="29" cy="2" r="1.5" fill="' + LENY_INK + '" opacity=".75"/><circle cx="33.5" cy="4.5" r="1.3" fill="' + LENY_INK + '" opacity=".75"/>';
  if (R.alszik) {
    s += '<path d="M-9 -6q6 5 12 0M8 -7q4.5 4 9 0" fill="none" stroke="' + LENY_INK + '" stroke-width="' + lnF(2.2 / hs * 1.1) + '" stroke-linecap="round"/>';
    s += '<path d="M16 13q5 3 9 0" fill="none" stroke="' + LENY_INK + '" stroke-width="' + lnF(1.8 / hs * 1.1) + '" stroke-linecap="round"/>';
  } else {
    s += '<g class="sz-szem"><ellipse cx="-3" cy="-7" rx="6.6" ry="8" fill="#fff" stroke="' + LENY_INK + '" stroke-width="' + lnF(1.4 / hs * 1.2) + '"/><ellipse cx="-.6" cy="-6" rx="4.3" ry="5.5" fill="' + LENY_INK + '"/><circle cx=".8" cy="-9" r="1.9" fill="#fff"/><circle cx="-2.4" cy="-3.6" r=".9" fill="#fff"/>' +
      '<ellipse cx="12.5" cy="-8" rx="5" ry="7" fill="#fff" stroke="' + LENY_INK + '" stroke-width="' + lnF(1.3 / hs * 1.2) + '"/><ellipse cx="14" cy="-7" rx="3.3" ry="4.7" fill="' + LENY_INK + '"/><circle cx="15.2" cy="-9.6" r="1.5" fill="#fff"/></g>';
    s += '<path d="M14 12q7 5.5 13 0" fill="none" stroke="' + LENY_INK + '" stroke-width="' + lnF(1.9 / hs * 1.1) + '" stroke-linecap="round"/>';
  }
  return s + "</g></g>";
}
function lnCsillag(x, y, r, c) { return '<path d="M' + x + " " + (y - r) + "L" + lnF(x + r * 0.3) + " " + lnF(y - r * 0.3) + "L" + (x + r) + " " + y + "L" + lnF(x + r * 0.3) + " " + lnF(y + r * 0.3) + "L" + x + " " + (y + r) + "L" + lnF(x - r * 0.3) + " " + lnF(y + r * 0.3) + "L" + (x - r) + " " + y + "L" + lnF(x - r * 0.3) + " " + lnF(y - r * 0.3) + 'Z" fill="' + c + '"/>'; }
/* a lény: fazis = fioka | kolyok | nagy | alvo; p = paletta (lenyPal); extra.sapka = héjsapka a fején, extra.cls */
function lenyRajz(fazis, p, extra) {
  var R = LENY_RAJZ[fazis], k = lnKv(p); extra = extra || {};
  var bx = R.test[0], by = R.test[1], rx = R.test[2], ry = R.test[3], s = "";
  /* 1. hátsó szárny, hátsó lábak */
  if (R.szarny.ket) s += lnSzarny(p, R.szarny, p.szarny2, true);
  R.labak.tavol.forEach(function (x) { s += lnLab(p, x, by + ry * 0.2, R.labak.w, p.s); });
  /* 2. farok (ha nem elöl) */
  var fc = lnCso(R.farok.p, R.farok.w[0], R.farok.w[1]);
  var farok = '<g class="sz-farok">' + R.farok.tuske.map(function (t) { return lnTuskeCson(p, fc, t, R.farok.w[0] * 0.32 * (1.1 - t * 0.5), -1, p.tuske); }).join("") +
    '<path d="' + fc.d + '" fill="' + p.b + '"' + lnSk(p) + "/>" + lnFarokSziv(p, fc, R.farok.sziv, p.tuske) + "</g>";
  if (!R.farok.elol) s += farok;
  /* 3. háttüskék, nyak */
  s += R.hatTuske.map(function (f) { return lnTuskeEllipszisen(p, bx, by, rx, ry, f, ry * 0.32, p.tuske); }).join("");
  if (R.nyak) {
    var nc = lnCso(R.nyak.p, R.nyak.w[0], R.nyak.w[1], 20);
    s += R.nyak.tuske.map(function (t) { return lnTuskeCson(p, nc, t, R.nyak.w[0] * 0.3, -1, p.tuske); }).join("");
    s += '<path d="' + nc.d + '" fill="' + p.b + '"' + lnSk(p) + "/>";
    var hc = lnCso(R.nyak.p.map(function (q) { return [q[0] + R.nyak.w[0] * 0.22, q[1] + R.nyak.w[0] * 0.1]; }), R.nyak.w[0] * 0.42, R.nyak.w[1] * 0.36, 16);
    s += '<path d="' + hc.d + '" fill="' + p.has + '" opacity=".9"/>';
  }
  /* 4. test + has */
  s += '<g class="sz-test"><ellipse cx="' + bx + '" cy="' + by + '" rx="' + rx + '" ry="' + ry + '" fill="' + p.b + '"' + lnSk(p) + "/>";
  var hx = bx + rx * 0.34, hy = by + ry * 0.2, hrx = rx * 0.52, hry = ry * 0.68;
  s += '<ellipse cx="' + lnF(hx) + '" cy="' + lnF(hy) + '" rx="' + lnF(hrx) + '" ry="' + lnF(hry) + '" fill="' + p.has + '"/>';
  for (var i = 1; i <= 3; i++) {
    var yy = hy - hry * 0.55 + i * hry * 0.32, ww = hrx * (1.5 - Math.abs(i - 2) * 0.3);
    s += '<path d="M' + lnF(hx - ww / 2) + " " + lnF(yy) + "q" + lnF(ww / 2) + " " + lnF(hry * 0.12) + " " + lnF(ww) + ' 0" fill="none" stroke="' + p.csik + '" stroke-width="' + lnF(k.w * 0.8) + '" stroke-linecap="round"/>';
  }
  s += '<ellipse cx="' + lnF(bx - rx * 0.35) + '" cy="' + lnF(by - ry * 0.45) + '" rx="' + lnF(rx * 0.22) + '" ry="' + lnF(ry * 0.12) + '" fill="#fff" opacity=".28"/></g>';
  if (R.farok.elol) s += farok;
  /* 5. első lábak, kar */
  R.labak.kozel.forEach(function (x) { s += lnLab(p, x, by + ry * 0.25, R.labak.w, p.b); });
  if (R.kar) {
    var ax = R.kar[0], ay = R.kar[1], aw = R.kar[2], kd = "M" + ax + " " + ay + "q" + lnF(aw * 0.9) + " " + lnF(aw * 0.7) + " " + lnF(aw * 1.6) + " " + lnF(aw * 0.2);
    s += '<path d="' + kd + '" fill="none" stroke="' + k.c + '" stroke-width="' + lnF(aw + k.w * 2) + '" stroke-linecap="round"/><path d="' + kd + '" fill="none" stroke="' + p.b + '" stroke-width="' + aw + '" stroke-linecap="round"/>';
  }
  /* 6. első szárny, fej */
  s += lnSzarny(p, R.szarny, p.szarny, false);
  s += lnFej(p, R);
  /* 7. extrák: héjsapka, tüsszentés-szikra, buborékok */
  if (extra.sapka) s += '<g transform="translate(' + (R.fej[0] + 2) + " " + (R.fej[1] - 24 * R.fej[2]) + ") rotate(-14) scale(" + (0.62 * R.fej[2]) + ')">' + lenyHejTeto(p) + "</g>";
  var orr = [R.fej[0] + 36 * R.fej[2], R.fej[1] + 4 * R.fej[2]], sz = R.fej[2];
  s += '<g class="ln-szikra" data-szikra="1" transform="translate(' + lnF(orr[0]) + " " + lnF(orr[1]) + ") scale(" + sz + ')">' +
    [[10, -6, 5, "#ffd24d"], [16, 4, 4, "#f6a5c0"], [6, 8, 3.4, "#9ec9f0"], [18, -12, 3, "#fff"]].map(function (c) { return lnCsillag(c[0], c[1], c[2], c[3]); }).join("") + "</g>";
  for (var j = 0; j < 3; j++) s += '<circle class="ln-buborek" data-bub="' + j + '" cx="' + lnF(orr[0] + 4) + '" cy="' + lnF(orr[1] - 4) + '" r="' + lnF((4 + j * 1.5) * sz) + '" fill="#e8f6ff" fill-opacity=".55" stroke="#9ec9f0" stroke-width="1.2"/>';
  return '<g class="sarkany ' + (extra.cls || "") + '">' + s + "</g>";
}
function lenyTusszent(gyoker) {
  if (!gyoker) return;
  Array.prototype.forEach.call(gyoker.querySelectorAll("[data-szikra]"), function (e) { e.classList.remove("ki"); void e.getBBox(); e.classList.add("ki"); });
}

/* ── a tojás: talp y=0, 80 magas; allapot 0 = ép, 1 = kis reccsenés, 2 = nagy repedés és fény ── */
var LN_TOJAS_D = "M0 -80C21 -80 34 -48 34 -28C34 -9 19 0 0 0C-19 0 -34 -9 -34 -28C-34 -48 -21 -80 0 -80Z";
var LN_CIKK = [[-35, -40], [-25, -48], [-16, -38], [-7, -48], [2, -38], [11, -48], [20, -38], [28, -47], [35, -41]];
var LN_CIKK_D = "M" + LN_CIKK.map(function (q) { return q.join(" "); }).join("L");
var LN_CIKK_VISSZA = LN_CIKK.slice().reverse().map(function (q) { return "L" + q.join(" "); }).join("");
function lenyTojasTest(p, allapot) {
  var s = '<path d="' + LN_TOJAS_D + '" fill="' + p.b + '"' + lnSk(p) + "/>";
  s += [[-12, -52, 7, 9], [14, -34, 9, 7], [-6, -18, 6, 5], [17, -62, 5, 6], [-21, -31, 4, 5], [5, -70, 3.5, 3]].map(function (e, i) {
    return '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '" fill="' + (i % 3 === 2 ? p.tuske : p.petty) + '" opacity=".95"/>'; }).join("");
  s += '<path d="M-21 -55Q-19 -68 -9 -74" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>';
  if (allapot >= 1) s += '<path d="M11 -71L16 -64L11 -60L17 -54" fill="none"' + lnSk(p, 0.8) + "/>";
  if (allapot >= 2) s += '<path d="M-30 -44L-22 -50L-14 -42L-6 -50L2 -42L9 -48" fill="none" stroke="#fff3b0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#ln-f-puha)"/><path d="M-30 -44L-22 -50L-14 -42L-6 -50L2 -42L9 -48" fill="none"' + lnSk(p, 0.8) + "/>";
  return s;
}
function lenyHejTeto(p) {   /* a felső héj (a kikelésnél külön mozog, aztán sapka lesz) — saját helyén, a cikkcakk fölött */
  var id = "ln-ct" + (++_lnId);
  return '<g transform="translate(0 44)"><clipPath id="' + id + '"><path d="M-40 -90H40V-41' + LN_CIKK_VISSZA + 'Z"/></clipPath>' +
    '<g clip-path="url(#' + id + ')"><path d="' + LN_TOJAS_D + '" fill="' + p.b + '"/>' +
    [[-12, -52, 7, 9], [17, -62, 5, 6], [5, -70, 3.5, 3]].map(function (e) { return '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '" fill="' + p.petty + '"/>'; }).join("") +
    '<path d="M-21 -55Q-19 -68 -9 -74" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>' +
    '<path d="M-35 -40C-34 -50 -24 -80 0 -80C24 -80 34 -50 35 -41" fill="none"' + lnSk(p) + '/><path d="' + LN_CIKK_D + '" fill="none"' + lnSk(p) + "/></g>";
}
function lenyHejAlso(p) {
  var id = "ln-ca" + (++_lnId);
  return '<clipPath id="' + id + '"><path d="M-40 10H40V-41' + LN_CIKK_VISSZA + 'Z"/></clipPath>' +
    '<g clip-path="url(#' + id + ')"><path d="' + LN_TOJAS_D + '" fill="' + p.b + '"' + lnSk(p) + '/><ellipse cx="14" cy="-34" rx="9" ry="7" fill="' + p.petty + '"/><ellipse cx="-6" cy="-18" rx="6" ry="5" fill="' + p.tuske + '"/></g>' +
    '<path d="' + LN_CIKK_D + '" fill="none"' + lnSk(p) + "/>";
}
function lenyFeszek(x, y, s) {   /* fészek: gallyakból, puha bélés */
  var g = '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><ellipse cx="0" cy="-4" rx="58" ry="16" fill="#b98a5c" stroke="#7c5636" stroke-width="2"/><ellipse cx="0" cy="-9" rx="44" ry="9" fill="#fdf0d0"/>';
  var r = lnRng(3);
  for (var i = 0; i < 14; i++) { var a = -56 + i * 8.6, yy = -4 + (r() - 0.5) * 10; g += '<path d="M' + lnF(a) + " " + lnF(yy) + "q" + lnF(10 + r() * 8) + " " + lnF(-6 + r() * 12) + " " + lnF(22 + r() * 6) + " " + lnF((r() - 0.5) * 6) + '" stroke="' + (i % 2 ? "#8d6440" : "#d2a676") + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; }
  return g + "</g>";
}
function lenyFeszekElol(x, y, s) {
  return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><path d="M-58 -4Q-50 12 0 12Q50 12 58 -4Q40 4 0 4Q-40 4 -58 -4Z" fill="#a8794c" stroke="#7c5636" stroke-width="2"/>' +
    [-40, -18, 6, 30].map(function (a) { return '<path d="M' + a + ' 4q8 -3 16 1" stroke="#d2a676" stroke-width="2" fill="none" stroke-linecap="round"/>'; }).join("") + "</g>";
}
var LN_DEFS = '<defs><radialGradient id="ln-g-repedes" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7c2"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>' +
  '<filter id="ln-f-puha" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>';
function lnNevTabla(nev) {
  return '<g class="ln-nevtabla" transform="translate(0 14)"><rect x="' + (-nev.length * 5 - 14) + '" y="0" width="' + (nev.length * 10 + 28) + '" height="26" rx="13" fill="#fff" stroke="#e6d8f0" opacity=".95"/>' +
    '<text y="18" text-anchor="middle" font-size="15" font-weight="700" fill="#2a2140">' + htmlVed(nev) + "</text></g>";
}

/* ════════════ AZ ODÚBAN: fészek az ágy előtt, benne a tojás; mellette a fióka ════════════
   Odú-koordinátában (oduSVG). A réteg az unikornis és az ágy pereme UTÁN jön: a fészek a padlón elöl áll. */
var LENY_ODU = { feszek: [188, 510], s: 0.86, helyek: [[122, 512], [262, 530], [160, 540]] };   /* a 0. hely = ahová a kikelés után kilép */
var _lnIdo = [], _lnFut = false;
function lnIdo(ms, fn) { _lnIdo.push(setTimeout(fn, ms)); }
function lnIdoTorol() { _lnIdo.forEach(clearTimeout); _lnIdo = []; }
/* mi látszik az odúban: "" (semmi), "tojas" (még a patakparton), "tojas1", "tojas2", "kesz" (kikelhet), "fioka" */
function lenyOduMod() {
  var l = lenyTar();
  if (l.fazis === "tojas") {
    if (!l.lelet) return "";
    var e = lenyTojasAll(l);
    return e.kesz ? "kesz" : e.i ? "tojas2" : "tojas1";
  }
  return l.fazis === "fioka" ? "fioka" : "";
}
function lenyOduReteg() {
  return '<g id="leny-odu">' + lenyOduBelso(lenyOduMod()) + "</g>";
}
function lenyOduBelso(mod) {
  if (!mod) return "";
  var p = lenyPal(), l = lenyTar(), fx = LENY_ODU.feszek[0], fy = LENY_ODU.feszek[1], fs = LENY_ODU.s, s = LN_DEFS;
  s += '<ellipse cx="' + fx + '" cy="' + (fy - 30) + '" rx="78" ry="58" fill="url(#ln-g-repedes)" opacity=".55" class="ln-lampa"/>';   /* a csillaglámpa meleg fénye a fészken */
  s += lenyFeszek(fx, fy, fs);
  if (mod === "fioka") {
    s += '<g transform="translate(' + fx + " " + (fy - 6) + ") scale(" + fs + ')">' + lenyHejAlso(p) + "</g>";   /* az üres héj a fészekben */
    s += lenyFeszekElol(fx, fy, fs);
    var h = LENY_ODU.helyek[0], sapka = gyakNap() === l.t;   /* a kikelés napján még rajta a héjsapka */
    s += '<g id="ln-fioka-poz" class="ln-seta" style="transform:translate(' + h[0] + "px," + h[1] + 'px)" role="button" aria-label="' + htmlVed(l.nev || "Fióka") + '">' +
      '<ellipse cx="0" cy="2" rx="' + (30 * fs) + '" ry="6" fill="#3b2f66" opacity=".16"/>' +
      '<g id="ln-fioka-flip" style="transform:scale(1,1)"><g id="ln-fioka-hop"><g transform="scale(' + fs + ')">' + lenyRajz("fioka", p, { sapka: sapka }) + "</g></g></g>" +
      '<rect x="-46" y="-100" width="92" height="104" fill="transparent"/>' + lnNevTabla(l.nev || "") + "</g>";
  } else {
    var allapot = mod === "tojas1" ? 1 : 2, cls = mod === "tojas1" ? "ln-billeg1" : mod === "tojas2" ? "ln-billeg2" : "ln-remeg";
    s += '<g id="ln-tojas" transform="translate(' + fx + " " + (fy - 6) + ") scale(" + fs + ')" role="button" aria-label="Tojás">' +
      (allapot >= 2 ? '<circle cx="0" cy="-40" r="58" fill="url(#ln-g-repedes)" opacity=".75" class="ln-lampa"/>' : "") +
      '<g class="ln-tojas-b ' + cls + '" id="ln-tojas-b">' + lenyTojasTest(p, allapot) + "</g>" +
      '<g class="ln-kop" id="ln-kop"><text x="38" y="-74" font-size="18" font-weight="700" fill="' + p.d + '">kop!</text></g>' +
      '<rect x="-40" y="-90" width="80" height="96" fill="transparent"/></g>';
    s += lenyFeszekElol(fx, fy, fs);
  }
  return s;
}
/* a renderOdu hívja minden rajzoláskor: koppintások + a fióka élete */
function lenyOduKot(svg) {
  var futott = _lnFut;
  lnIdoTorol(); _lnFut = false;
  if (!svg) return;
  if (futott) { lenyFedoZar(); lenyOduNyit(); }   /* újrarajzolás (ablakméret) a kikelés közben → elölről */
  var t = svg.querySelector("#ln-tojas"), f = svg.querySelector("#ln-fioka-poz");
  if (t) t.addEventListener("click", function () { if (!_lnFut) lenyTojasKopp(svg); });
  if (f) { f.addEventListener("click", function () { lenyFiokaKopp(svg); }); lenyFiokaEl(svg, 0); }
}
/* az oduNyit hívja: ami vár (lelet, kikelés), az most lejátszódik */
function lenyOduNyit() {
  var l = lenyTar();
  if (l.fazis !== "tojas") return;
  if (!l.lelet) { lnIdo(900, lenyLeletJelenet); return; }
  if (lenyTojasAll(l).kesz) lnIdo(1300, lenyKikeles);
}
function lenyTojasKopp(svg) {
  var mod = lenyOduMod();
  if (mod === "kesz") { lenyKikeles(); return; }
  var b = svg.querySelector("#ln-tojas-b"), k = svg.querySelector("#ln-kop"); if (!b) return;
  var elozo = b.getAttribute("class");
  b.setAttribute("class", "ln-tojas-b ln-kopp"); k.classList.remove("ki"); void k.getBBox(); k.classList.add("ki");
  setTimeout(function () { b.setAttribute("class", elozo); }, 720);
  hangGomb();
  mondd(mod === "tojas1" ? "Kop-kop… Valaki van odabent!" : "Kop-kop-kop! Már nagyon készülődik!");
}
function lenyFiokaKopp(svg) {
  var f = svg.querySelector("#ln-fioka-poz"); if (!f) return;
  lenyTusszent(f);
  var nt = f.querySelector(".ln-nevtabla"); if (nt) { nt.classList.add("ki"); setTimeout(function () { nt.classList.remove("ki"); }, 2600); }
  hangGomb();
  mondd("Hapci! " + (lenyTar().nev || "A fióka") + " szikrát tüsszentett!");
}
/* a fióka magától totyog egyik helyről a másikra (a három hely között), néha tüsszent egyet */
function lenyFiokaEl(svg, hol) {
  lnIdo(5200 + Math.random() * 3500, function () {
    var f = svg.querySelector("#ln-fioka-poz"), flip = svg.querySelector("#ln-fioka-flip"), hop = svg.querySelector("#ln-fioka-hop");
    if (!f || !document.body.contains(f)) return;
    if (Math.random() < 0.25) { lenyTusszent(f); lenyFiokaEl(svg, hol); return; }
    var H = LENY_ODU.helyek, uj = (hol + 1 + Math.floor(Math.random() * (H.length - 1))) % H.length, a = H[hol], b = H[uj];
    var mp = Math.max(0.9, Math.abs(b[0] - a[0]) / 70);
    flip.style.transform = "scale(" + (b[0] < a[0] ? -1 : 1) + ",1)";
    if (!nyugiMod()) hop.setAttribute("class", "ln-hop");
    f.style.transition = "transform " + mp.toFixed(2) + "s linear";
    f.style.transform = "translate(" + b[0] + "px," + b[1] + "px)";
    lnIdo(mp * 1000 + 50, function () { hop.setAttribute("class", ""); lenyFiokaEl(svg, uj); });
  });
}

/* ── a patakparti lelet (rajzterv: 1. jelenet) — fedőlap az odú fölött, a „Hazavisszük!” gombbal ── */
function lenyFedo(html) {
  var d = document.getElementById("leny-fedo");
  if (!d) { d = document.createElement("div"); d.id = "leny-fedo"; document.body.appendChild(d); }
  d.className = "leny-fedo"; d.innerHTML = html; d.hidden = false;
  return d;
}
function lenyFedoZar() { var d = document.getElementById("leny-fedo"); if (d) { d.hidden = true; d.innerHTML = ""; } }
function lnPatakHatter() {
  var w = 800, h = 450, hz = 190, py = [h - 70, h - 20], s = '<rect width="' + w + '" height="' + h + '" fill="url(#ln-g-eg)"/>';
  s += '<path d="M0 ' + hz + "Q" + w * 0.25 + " " + (hz - 60) + " " + w * 0.5 + " " + (hz - 24) + "T" + w + " " + (hz - 30) + "V" + h + 'H0Z" fill="#d9cbef"/>';
  s += '<path d="M0 ' + (hz + 30) + "Q" + w * 0.3 + " " + (hz - 8) + " " + w * 0.6 + " " + (hz + 22) + "T" + w + " " + (hz + 12) + "V" + h + 'H0Z" fill="url(#ln-g-fu)"/>';
  s += '<path d="M0 ' + py[0] + "Q" + w * 0.3 + " " + (py[0] - 24) + " " + w * 0.55 + " " + (py[0] + 4) + "T" + w + " " + (py[0] - 12) + "V" + (py[1] + 40) + 'H0Z" fill="url(#ln-g-patak)" stroke="#7fb8d8" stroke-width="2"/>';
  for (var i = 0; i < 5; i++) s += '<path d="M' + (40 + i * w / 5) + " " + (py[0] + 22 + (i % 2) * 14) + 'q12 -5 24 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>';
  var r = lnRng(11);
  for (var j = 0; j < 40; j++) { var x = r() * w, y = hz + 40 + r() * (py[0] - hz - 50); s += '<circle cx="' + lnF(x) + '" cy="' + lnF(y) + '" r="' + lnF(1.8 + r() * 1.6) + '" fill="' + ["#f6a5c0", "#fce49a", "#fff", "#c9a8e6"][j % 4] + '"/>'; }
  function nad(x, y, n) {
    var g = "";
    for (var k = 0; k < n; k++) {
      var dx = (k - n / 2) * 5;
      g += '<path d="M' + (x + dx) + " " + y + "q" + lnF(dx * 0.6) + " -30 " + lnF(dx * 1.2 + (k % 2 ? 4 : -4)) + " -" + (54 + (k % 3) * 10) + '" stroke="#6fae74" stroke-width="3" fill="none" stroke-linecap="round"/>';
      if (k % 2) g += '<ellipse cx="' + lnF(x + dx * 2.2 + (k % 2 ? 4 : -4)) + '" cy="' + (y - 60 - (k % 3) * 10) + '" rx="3.5" ry="10" fill="#a87a52"/>';
    }
    return g;
  }
  return s + nad(580, py[0] - 4, 6) + nad(90, py[0] + 6, 5);
}
function lenyLeletJelenet() {
  if (!oduAktiv()) return;
  var l = lenyTar(), p = lenyPal(), tx = 520, ty = 362, unev = LENYEK[mentes.leny].nev;
  var s = '<svg class="leny-jelenet" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">' + LN_DEFS.replace("</defs>",
    '<linearGradient id="ln-g-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8e3f7"/><stop offset="1" stop-color="#eef6ee"/></linearGradient>' +
    '<linearGradient id="ln-g-fu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdeec0"/><stop offset="1" stop-color="#a7d99a"/></linearGradient>' +
    '<linearGradient id="ln-g-patak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe3f7"/><stop offset="1" stop-color="#8ec5ea"/></linearGradient></defs>');
  s += lnPatakHatter();
  s += '<g transform="translate(300 372)"><g class="ln-szagol" id="ln-lelet-uni"><g transform="scale(1.24)">' + unikornisSVG("ln-lelet-u", LENYEK[mentes.leny], 1, P().oltozet) + "</g></g></g>";
  s += '<g transform="translate(' + tx + " " + ty + ') scale(.8)"><circle cx="0" cy="-40" r="60" fill="url(#ln-g-repedes)" opacity=".7" class="ln-lampa"/><g class="ln-tojas-b ln-billeg1">' + lenyTojasTest(p, 1) + "</g></g>";
  s += [[-30, 0], [-18, 4], [16, 4], [28, 0], [40, -2]].map(function (d, i) { return '<path d="M' + (tx + d[0]) + " " + (ty + d[1] + 4) + "q" + (i % 2 ? 4 : -4) + " -14 " + (i % 2 ? -2 : 6) + " -" + (18 + i * 2) + '" stroke="#7cc07a" stroke-width="3.4" fill="none" stroke-linecap="round"/>'; }).join("");
  s += "</svg>";
  var mondat1 = "Nézd, mit találtam! Meleg, és mintha mocorogna…";
  var d = lenyFedo('<div class="leny-kartya">' + s + '<p class="leny-szoveg" id="leny-szoveg">🔊 ' + mondat1 + '</p>' +
    '<button class="nagy-gomb kiemelt" id="leny-haza" style="visibility:hidden">🏠 Hazavisszük!</button></div>');
  mondd(unev + " a patakparton járt. " + mondat1);
  var u = d.querySelector("#ln-lelet-uni");
  lnIdo(500, function () { if (u) u.style.transform = "rotate(5deg)"; });
  lnIdo(2400, function () {
    if (u) u.style.transform = "rotate(0deg)";
    var t = d.querySelector("#leny-szoveg"); if (t) t.textContent = "🔊 Hazavisszük az odúba, ott a csillaglámpa melegen tartja.";
    var g = d.querySelector("#leny-haza"); if (g) g.style.visibility = "visible";
  });
  d.querySelector("#leny-haza").addEventListener("click", function () {
    hangGomb(); lenyFedoZar();
    l.lelet = 1; ment();
    lenyOduFrissit();
    mondd("Itt a fészekben jó meleg van. Vajon mi lesz belőle?");
    if (lenyTojasAll(l).kesz) lnIdo(2600, lenyKikeles);   /* aki napokig nem nézett be: a lelet után rögtön kikel */
  });
}
/* csak a lény rétegét rajzolja újra (az odú többi része marad) */
function lenyOduFrissit() {
  var svg = document.querySelector("#odu-szoba svg"), g = svg && svg.querySelector("#leny-odu");
  if (!g) return;
  g.innerHTML = lenyOduBelso(lenyOduMod());
  lenyOduKot(svg);
}

/* ── a kikelés (rajzterv: 4. jelenet) a valódi odúban: az unikornis odamegy, a tojás remeg, reccs, a teteje felpattan,
   kikukucskál a fióka, a héj a fejére esik sapkának, tüsszent, kilép — aztán a gyerek nevet választ ── */
function lenyKikeles() {
  if (!oduAktiv() || _lnFut) return;
  var svg = document.querySelector("#odu-szoba svg"), g = svg && svg.querySelector("#leny-odu");
  if (!g) return;
  _lnFut = true; lnIdoTorol();
  if (ODU_FEKSZIK) { oduFelkel(false, function () { _lnFut = false; lenyKikeles(); }); return; }
  var p = lenyPal(), fx = LENY_ODU.feszek[0], fy = LENY_ODU.feszek[1], fs = LENY_ODU.s, R = LENY_RAJZ.fioka;
  var s = LN_DEFS + '<ellipse cx="' + fx + '" cy="' + (fy - 30) + '" rx="78" ry="58" fill="url(#ln-g-repedes)" opacity=".55" class="ln-lampa"/>' + lenyFeszek(fx, fy, fs);
  s += '<g transform="translate(' + fx + " " + (fy - 6) + ") scale(" + fs + ')">' +
    '<g id="ln-k-fioka" class="ln-mozgo" style="transform:translate(0px,46px) scale(.9);opacity:0"><g id="ln-k-fioka-b">' + lenyRajz("fioka", p) + "</g></g>" +
    '<g id="ln-k-also" style="opacity:0">' + lenyHejAlso(p) + "</g>" +
    '<g id="ln-k-egesz"><g class="ln-tojas-b ln-remeg" id="ln-k-tojas">' + lenyTojasTest(p, 2) + '</g><path id="ln-k-cikk" d="' + LN_CIKK_D + '" fill="none"' + lnSk(p) + ' stroke-dasharray="120" stroke-dashoffset="120" style="transition:stroke-dashoffset .8s"/></g>' +
    '<g id="ln-k-teto" style="opacity:0" class="ln-mozgo"><g style="transform:translate(0px,-44px)">' + lenyHejTeto(p) + "</g></g>" +
    '<circle id="ln-k-feny" cx="0" cy="-44" r="10" fill="url(#ln-g-repedes)" style="transition:r .6s, opacity .8s" opacity="0"/></g>';
  s += lenyFeszekElol(fx, fy, fs);
  g.innerHTML = s;
  function $k(id) { return g.querySelector("#" + id); }
  lenyFedo('<div class="leny-fogo"></div>');   /* a kikelés alatt az odú többi része nem koppintható */
  /* az unikornis odasétál, és a fészek felé fordul */
  oduUniSetal(326, function () { ODU_UNI.dir = -1; uniFordul(document.getElementById("odu-uni-flip"), -1); });
  mondd("Nézd! A tojás remeg!");
  lnIdo(1500, function () { $k("ln-k-cikk").style.strokeDashoffset = "0"; $k("ln-k-feny").setAttribute("opacity", "1"); $k("ln-k-feny").setAttribute("r", "46"); });
  lnIdo(2600, function () {
    $k("ln-k-tojas").setAttribute("class", "ln-tojas-b"); $k("ln-k-egesz").style.opacity = "0"; $k("ln-k-also").style.opacity = "1"; $k("ln-k-teto").style.opacity = "1";
    $k("ln-k-teto").style.transform = "translate(-6px,-70px) rotate(-30deg)"; $k("ln-k-fioka").style.opacity = "1"; $k("ln-k-fioka").style.transform = "translate(0px,18px) scale(.9)";
  });
  lnIdo(3400, function () {
    $k("ln-k-feny").setAttribute("opacity", "0");
    $k("ln-k-teto").style.transform = "translate(" + lnF((R.fej[0] + 2) * 0.9) + "px," + lnF(18 + (R.fej[1] - 24) * 0.9) + "px) rotate(-14deg) scale(.56)";
    mondd("Kikelt! Egy kis sárkány! Nézd, milyen pici!");
  });
  lnIdo(5200, function () { lenyTusszent($k("ln-k-fioka-b")); });
  lnIdo(6000, function () {
    $k("ln-k-fioka").style.transform = "translate(-76px,8px) scale(1)";
    $k("ln-k-teto").style.transform = "translate(" + lnF(-76 + (R.fej[0] + 2)) + "px," + lnF(8 + R.fej[1] - 24) + "px) rotate(-14deg) scale(.62)";
  });
  lnIdo(7000, function () { lenyNevValaszto(0); });
}
/* a névválasztó: hármasával a 12 névből, felolvasva; „Másikat!” → a következő három. Gépelni nem kell. */
function lenyNevValaszto(kezd) {
  var harom = [0, 1, 2].map(function (i) { return LENY_NEVEK[(kezd + i) % LENY_NEVEK.length]; });
  var d = lenyFedo('<div class="leny-fogo"></div><div class="leny-nevek"><div class="leny-nevek-cim">Mi legyen a neve?</div><div class="leny-nevek-sor">' +
    harom.map(function (n) { return '<button class="leny-nev" data-nev="' + n + '">' + n + "</button>"; }).join("") +
    '</div><button class="leny-masik">Másikat! 🔄</button></div>');
  mondd("Mi legyen a neve? " + harom[0] + ", " + harom[1] + ", vagy " + harom[2] + "?");
  Array.prototype.forEach.call(d.querySelectorAll(".leny-nev"), function (b) {
    b.addEventListener("click", function () { hangGomb(); lenyNevad(b.getAttribute("data-nev")); });
  });
  d.querySelector(".leny-masik").addEventListener("click", function () { hangGomb(); lenyNevValaszto((kezd + 3) % LENY_NEVEK.length); });
}
function lenyNevad(nev) {
  var l = lenyTar();
  lenyFedoZar();
  l.fazis = "fioka"; l.nev = nev; l.t = gyakNap(); l.kikelt = Date.now();
  ment();
  esemeny("leny_kikelt", { nev: nev, leny: mentes.leny });
  _lnFut = false;
  lenyOduFrissit();
  var svg = document.querySelector("#odu-szoba svg");
  lnIdo(300, function () { lenyTusszent(svg && svg.querySelector("#ln-fioka-poz")); });
  mondd("Szia, " + nev + "! Mostantól itt laksz velünk az odúban.");
  lnIdo(1800, oduUniHaza);
}

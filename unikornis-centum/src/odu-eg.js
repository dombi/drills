/* ══ 🌌 ODÚ-ÉG: tetőablak + nyitott ég + csillagkép-motor (terv/odu-eg-rendszerterv.html, A lépés, 2026-11-09)
   Az odú plafonján kerek tetőablak; koppintásra kinyílik a teljes esti ég. Minden kész pálya egy csillag, a csillagok
   egységenként (liget / műhely) csillagképpé állnak össze. A hiányzó csillagok helye SEMMIBEN nem látszik.
   A lépés: tábla, elrendezés, égrajz, koppintások, visszajátszás, ?egproba próbanézet. B lépés (még nincs): fekvő
   felnézés, sárkány-pára, csillagrepülés, kiteljesedés-pillanat, átköltözés, villanyoltás, hangok.
   ⚠️ Élesben (EG_ELES = false) még a régi fali-ablak ég látszik; a tetőablak csak ?egproba mellett. ══ */

var EG_PROBA = /[?&]egproba\b/.test(location.search);
var EG_ELES = false;   /* a B lépés után true: akkor kapják meg a gyerekek */
function egAktiv() { return EG_ELES || EG_PROBA; }

/* ── a csillagképek: egység(ek) → kép. A pontok FONTOSSÁGI sorrendben (az első pályák kapják őket, néhány csillagból
   is sejthető a forma); a vonalak pont-indexek láncai. Koordináta: 0–100-as doboz. Új egység = új sor itt. ── */
var EG_KEPEK = [
  { id: "noctua", nev: "Noctua", hu: "a Bagoly", egysegek: ["konyvtar"], mozdul: "szarny",
    pontok: [[41, 44], [59, 44], [30, 14], [70, 14], [50, 88], [26, 36], [74, 36], [30, 70], [70, 70]],
    vonalak: [[2, 5, 7, 4, 8, 6, 3], [5, 6]] },
  { id: "tabernaculum", nev: "Tabernaculum", hu: "a Sátor", egysegek: ["vasar"], mozdul: "lebben",
    pontok: [[50, 16], [10, 82], [90, 82], [50, 58], [62, 6], [30, 49], [70, 49], [40, 82], [60, 82]],
    vonalak: [[1, 5, 0, 6, 2], [1, 7, 8, 2], [7, 3, 8], [0, 4]] },
  { id: "libra", nev: "Libra", hu: "a Mérleg", egysegek: ["piac"], hely: "vasar", mozdul: "billen",
    pontok: [[50, 14], [50, 86], [14, 32], [86, 32], [4, 58], [24, 58], [76, 58], [96, 58], [50, 32]],
    vonalak: [[0, 8, 1], [2, 8, 3], [2, 4, 5, 2], [3, 6, 7, 3]] },
  { id: "lyra", nev: "Lyra", hu: "a Lant", egysegek: ["szorzo"], mozdul: "peng",
    pontok: [[26, 12], [74, 12], [50, 86], [18, 46], [82, 46], [34, 76], [66, 76], [23, 26], [77, 26]],
    vonalak: [[0, 7, 3, 5, 2, 6, 4, 8, 1], [7, 8]] },
  { id: "forfex", nev: "Forfex", hu: "az Olló", egysegek: ["szabo"], mozdul: "csattan",
    pontok: [[20, 10], [80, 10], [50, 46], [24, 66], [76, 66], [12, 80], [88, 80], [32, 90], [68, 90]],
    vonalak: [[1, 2, 3], [0, 2, 4], [3, 5, 7, 3], [4, 6, 8, 4]] },
  { id: "ampulla", nev: "Ampulla", hu: "a Lombik", egysegek: ["bajital"], mozdul: "bugyog",
    pontok: [[40, 10], [60, 10], [14, 84], [86, 84], [40, 38], [60, 38], [50, 74], [24, 66], [76, 66]],
    vonalak: [[0, 4, 7, 2, 3, 8, 5, 1], [0, 1], [7, 8]] },
  { id: "fornax", nev: "Fornax", hu: "a Kemence", egysegek: ["pekseg"], mozdul: "parazs",
    pontok: [[50, 22], [12, 82], [88, 82], [18, 46], [82, 46], [72, 8], [50, 62], [72, 37], [36, 82], [64, 82]],
    vonalak: [[1, 3, 0, 7, 4, 2], [7, 5], [1, 8, 9, 2], [8, 6, 9]] },
  { id: "monoceros", nev: "Monoceros", hu: "az Egyszarvú", egysegek: ["osszeado"], mozdul: "bolint",
    pontok: [[90, 6], [66, 30], [20, 58], [44, 92], [72, 52], [56, 22], [34, 56], [50, 40], [52, 60]],
    vonalak: [[0, 1, 5, 7, 6, 2, 8, 3], [1, 4, 8]] },
  { id: "mensa", nev: "Mensa", hu: "az Asztalhegy", egysegek: ["fejtoro"], mozdul: "ragyog",
    pontok: [[46, 14], [4, 86], [96, 86], [22, 40], [78, 34], [38, 32], [56, 32]],
    vonalak: [[1, 3, 5, 0, 6, 4, 2], [1, 2]] },
  { id: "cor", nev: "Cor", hu: "a Szív", egysegek: ["egyeni"], mozdul: "dobban",
    pontok: [[50, 88], [50, 32], [12, 48], [88, 48], [36, 16], [64, 16], [18, 22], [82, 22]],
    vonalak: [[0, 2, 6, 4, 1, 5, 7, 3, 0]] }
];
/* fenntartva (még nincs egységük): Draco (a Sárkány) — kissárkány; Corona (a Korona) — Mesterpróba; Scala (a Létra) — 100-as kör */

/* ── az ég két elrendezése: fekvő (laptop, tablet) és álló (telefon). A csillagkép helye a ligettérképből
   (LIGET_TERKEP.helyek) számolódik, így ha a térkép változik, az ég követi. EG_IGAZIT: kézi eltolás (ég-egységben). ── */
var EG_MOD = {
  szeles: { W: 1000, H: 640, meret: 112, terkep: [800, 110, 440], x0: 80, xw: 840, y0: 70, yh: 400, keret: [500, -200, 780], tejut: [[30, 340], [210, 20]] },
  allo:   { W: 600, H: 1000, meret: 98, terkep: [400, 130, 740], x0: 40, xw: 520, y0: 70, yh: 780, keret: [300, -300, 1240], tejut: [[18, 610], [80, 330]] }
};
var EG_IGAZIT = { libra: { szeles: [110, 12], allo: [100, -112] }, tabernaculum: { szeles: [-20, 0], allo: [0, 0] } };
function egModValaszt() { return (window.innerWidth >= window.innerHeight * 0.95) ? "szeles" : "allo"; }
function egKepHely(kep, mod) {
  var M = EG_MOD[mod], helyek = (typeof LIGET_TERKEP !== "undefined") ? LIGET_TERKEP.helyek : {};
  var kulcs = kep.hely || kep.egysegek[0], h = helyek[kulcs] || helyek[terkepGazda(kulcs)];
  var p = h ? h[mod] : [M.terkep[0] / 2, (M.terkep[1] + M.terkep[2]) / 2];
  var x = M.x0 + p[0] / M.terkep[0] * M.xw, y = M.y0 + (p[1] - M.terkep[1]) / (M.terkep[2] - M.terkep[1]) * M.yh;
  var t = (EG_IGAZIT[kep.id] || {})[mod];
  if (t) { x += t[0]; y += t[1]; }
  return [x, y];
}

/* ── a forma n csillaggal: n ≤ fő pontok → a legfontosabb n fő pont (a vonalak a meglévők között futnak);
   n > fő pontok → a többlet kitöltő csillag a vonalakon, hossz szerint arányosan, egyenletesen.
   Eredmény: pos[i] = az i. pálya csillaga; lancok = csillag-index láncok (a vonalak). ── */
function egElrendez(kep, n) {
  var P0 = kep.pontok, k = Math.min(n, P0.length), van = {}, pos = [], i;
  for (i = 0; i < k; i++) { van[i] = true; pos.push({ x: P0[i][0], y: P0[i][1], fo: i }); }
  var szak = [], volt = {};
  kep.vonalak.forEach(function (v) {
    var f = v.filter(function (j) { return van[j]; });
    for (var t = 1; t < f.length; t++) {
      var a = f[t - 1], b = f[t], kk = Math.min(a, b) + "-" + Math.max(a, b);
      if (a === b || volt[kk]) continue;
      volt[kk] = true; szak.push([a, b]);
    }
  });
  var m = n - k, db = szak.map(function () { return 0; });
  if (m > 0 && szak.length) {
    var hossz = szak.map(function (s) { var a = P0[s[0]], b = P0[s[1]]; return Math.hypot(b[0] - a[0], b[1] - a[1]); });
    var L = hossz.reduce(function (x, y) { return x + y; }, 0), mar = m;
    var tort = hossz.map(function (h, si) { var q = m * h / L; db[si] = Math.floor(q); mar -= db[si]; return { si: si, f: q - db[si] }; });
    tort.sort(function (a, b) { return b.f - a.f || a.si - b.si; });
    for (i = 0; i < mar; i++) db[tort[i % tort.length].si]++;
  } else if (m > 0) {   /* vonal nélküli váz (nem fordul elő): körben a közép körül */
    for (i = 0; i < m; i++) { var sz = Math.PI * 2 * i / m; pos.push({ x: 50 + Math.cos(sz) * 30, y: 50 + Math.sin(sz) * 30, fo: -1 }); }
  }
  var lancok = szak.map(function (s, si) {
    var a = P0[s[0]], b = P0[s[1]], c = db[si], ch = [s[0]];
    for (var q = 1; q <= c; q++) { var t = q / (c + 1); pos.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, fo: -1 }); ch.push(pos.length - 1); }
    ch.push(s[1]);
    return ch;
  });
  return { pos: pos, lancok: lancok };
}

/* ── adatforrás: a valódi mentés, vagy (?egproba) kitalált adat. Mindkettő ugyanazt tudja. ── */
function egUjAllapot() { return { sorrend: [], latott: {}, teljes: {}, atkoltozve: false }; }
function egAllapot() {
  var p = P();
  if (!p.eg) p.eg = egUjAllapot();
  var e = p.eg;
  if (!Array.isArray(e.sorrend)) e.sorrend = [];
  if (!e.latott) e.latott = {};
  if (!e.teljes) e.teljes = {};
  return e;
}
function egKepeEgyseg(r) { for (var i = 0; i < EG_KEPEK.length; i++) if (EG_KEPEK[i].egysegek.indexOf(r) >= 0) return EG_KEPEK[i]; return null; }
var EG_VALODI = {
  kepPalyak: function (kep) {
    return PALYAK.filter(function (pa) {
      if (kep.egysegek.indexOf(palyaLiget(pa)) < 0) return false;
      var pr = P().palyak[pa.id];
      return !palyaRejtve(pa) || !!(pr && pr.kesz);   /* a pultról elrejtett pálya nem számít, hacsak már kész nincs */
    });
  },
  vandorok: function () {   /* kész pálya, amelynek egysége még nincs a táblában */
    return PALYAK.filter(function (pa) { var pr = P().palyak[pa.id]; return pr && pr.kesz && !egKepeEgyseg(palyaLiget(pa)); });
  },
  allapot: function (id) { return P().palyak[id] || {}; },
  eg: function () { return egAllapot(); },
  ment: function () { ment(); }
};
function egForras() { return EG_PROBA ? egProbaForras() : EG_VALODI; }

/* ── egy kép állapota: csillagok (helyükkel), vonalak, teljes-e ── */
function egKepAllapot(kep, src, mod) {
  var lista = src.kepPalyak(kep), L = egElrendez(kep, lista.length), eg = src.eg();
  var hely = egKepHely(kep, mod), M = EG_MOD[mod].meret;
  var cs = lista.map(function (pa, i) {
    var a = src.allapot(pa.id) || {}, p = L.pos[i];
    return { id: pa.id, pa: pa, kesz: !!a.kesz, arany: !!a.arany, fo: p.fo,
      x: hely[0] + (p.x - 50) / 100 * M, y: hely[1] + (p.y - 50) / 100 * M };
  });
  var kesz = cs.filter(function (c) { return c.kesz; });
  var teljes = cs.length > 0 && kesz.length === cs.length;
  var rajzolt = teljes || !!eg.teljes[kep.id];   /* ami egyszer kirajzolódott, nem tűnik el */
  var vonalak = [];
  L.lancok.forEach(function (ch) {
    if (rajzolt) {   /* teljes kép: a lánc kész csillagai sorban összekötve (az új, még nem kész csillag helye nem látszik) */
      var f = ch.filter(function (j) { return cs[j] && cs[j].kesz; });
      for (var t = 1; t < f.length; t++) vonalak.push([f[t - 1], f[t]]);
    } else {          /* félkész: csak két szomszédos, már kész csillag között */
      for (var u = 1; u < ch.length; u++) if (cs[ch[u - 1]] && cs[ch[u]] && cs[ch[u - 1]].kesz && cs[ch[u]].kesz) vonalak.push([ch[u - 1], ch[u]]);
    }
  });
  return { kep: kep, cs: cs, kesz: kesz, teljes: teljes, rajzolt: rajzolt, vonalak: vonalak,
    arany: rajzolt && kesz.length > 0 && kesz.length === cs.length && kesz.every(function (c) { return c.arany; }) };
}

/* még nem látott csillag (vagy arany-váltás) → a tetőablak finoman felragyog */
function egUjCsillag(c, eg) { var l = eg.latott[c.id] || 0; return c.kesz && (l < 1 || (c.arany && l < 2)); }
function egVanUj() {
  if (!egAktiv()) return false;
  var src = egForras(), eg = src.eg(), van = false;
  EG_KEPEK.forEach(function (kep) {
    var lista = src.kepPalyak(kep);
    lista.forEach(function (pa) { var a = src.allapot(pa.id) || {}; if (egUjCsillag({ id: pa.id, kesz: a.kesz, arany: a.arany }, eg)) van = true; });
  });
  src.vandorok().forEach(function (pa) { var a = src.allapot(pa.id) || {}; if (egUjCsillag({ id: pa.id, kesz: a.kesz, arany: a.arany }, eg)) van = true; });
  return van;
}

/* ── a kigyúlási sorrend: a régi, dátum nélküli csillagok EGYSZER véletlen sorrendbe kerülnek (és el is mentődnek),
   az újak a keszIdo szerint jönnek utána ── */
function egSorrendFrissit(src, keszIdk) {
  var eg = src.eg(), benne = {};
  eg.sorrend = eg.sorrend.filter(function (id) { if (benne[id]) return false; benne[id] = true; return true; });
  var uj = keszIdk.filter(function (id) { return !benne[id]; });
  if (!uj.length) return false;
  var regi = uj.filter(function (id) { return !(src.allapot(id) || {}).keszIdo; });
  var datum = uj.filter(function (id) { return !!(src.allapot(id) || {}).keszIdo; });
  for (var i = regi.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = regi[i]; regi[i] = regi[j]; regi[j] = t; }
  datum.sort(function (a, b) { return src.allapot(a).keszIdo - src.allapot(b).keszIdo; });
  eg.sorrend = eg.sorrend.concat(regi, datum);
  return true;
}

/* ── kis segédek ── */
function egHash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
function egVel(seed) { var x = seed >>> 0 || 1; return function () { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; }
function egEsc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function egCsillagSVG(c, uj, kesl) {
  var r = c.arany ? 4.4 : (c.fo === 0 ? 3.6 : c.fo > 0 ? 3 : 2.3);
  var s = '<g class="eg-cs' + (c.arany ? " arany" : "") + (uj ? " eg-uj" : "") + '" data-id="' + egEsc(c.id) + '"' + (uj ? ' style="animation-delay:' + kesl.toFixed(2) + 's"' : "") + '>';
  s += '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="16" fill="transparent"/>';   /* koppintási terület */
  if (c.arany) s += '<circle class="eg-korong" cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (r * 3.2).toFixed(1) + '" fill="url(#eg-arany-fu)"/>';
  else s += '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (r * 2.6).toFixed(1) + '" fill="url(#eg-ezust-fu)"/>';
  var d = r * 1.9, w = r * 0.42;
  s += '<g class="eg-mag" style="animation-delay:-' + (egHash(c.id) * 3).toFixed(2) + 's"><path d="M' + c.x.toFixed(1) + ' ' + (c.y - d).toFixed(1) + ' L' + (c.x + w).toFixed(1) + ' ' + (c.y - w).toFixed(1) + ' L' + (c.x + d).toFixed(1) + ' ' + c.y.toFixed(1) + ' L' + (c.x + w).toFixed(1) + ' ' + (c.y + w).toFixed(1) + ' L' + c.x.toFixed(1) + ' ' + (c.y + d).toFixed(1) + ' L' + (c.x - w).toFixed(1) + ' ' + (c.y + w).toFixed(1) + ' L' + (c.x - d).toFixed(1) + ' ' + c.y.toFixed(1) + ' L' + (c.x - w).toFixed(1) + ' ' + (c.y - w).toFixed(1) + ' Z" fill="' + (c.arany ? "#ffd86a" : "#eef3ff") + '"/>';
  s += '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (r * 0.75).toFixed(1) + '" fill="' + (c.arany ? "#fff6d8" : "#ffffff") + '"/></g>';
  return s + '</g>';
}

/* ── a nyitott ég rajza ── */
function egRajz(src, mod) {
  var M = EG_MOD[mod], W = M.W, H = M.H, eg = src.eg(), s = "", ujDb = 0;
  s += '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Fredoka, Segoe UI, sans-serif">';
  s += '<defs><linearGradient id="eg-hatter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121842"/><stop offset="0.7" stop-color="#232c63"/><stop offset="1" stop-color="#36407e"/></linearGradient>';
  s += '<radialGradient id="eg-ezust-fu"><stop offset="0" stop-color="#cfe0ff" stop-opacity="0.55"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>';
  s += '<radialGradient id="eg-arany-fu"><stop offset="0" stop-color="#ffd24d" stop-opacity="0.7"/><stop offset="1" stop-color="#ffd24d" stop-opacity="0"/></radialGradient>';
  s += '<radialGradient id="eg-szarv-fu"><stop offset="0" stop-color="#fff3b0" stop-opacity="0.9"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient>';
  s += '<filter id="eg-tejut-f" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="18"/></filter></defs>';
  s += '<rect x="-400" y="-400" width="' + (W + 800) + '" height="' + (H + 800) + '" fill="url(#eg-hatter)"/>';
  /* Tejút: halvány sáv (itt sodródnak a vándorcsillagok) */
  var t0 = M.tejut[0], t1 = M.tejut[1], tcx = (t0[0] + t1[0]) / 2, tcy = (t0[1] + t1[1]) / 2, tsz = Math.atan2(t1[1] - t0[1], t1[0] - t0[0]) * 180 / Math.PI;
  s += '<ellipse cx="' + tcx + '" cy="' + tcy + '" rx="' + (Math.hypot(t1[0] - t0[0], t1[1] - t0[1]) / 2 + 60).toFixed(0) + '" ry="34" fill="#8e9ad8" opacity="0.16" filter="url(#eg-tejut-f)" transform="rotate(' + tsz.toFixed(1) + ' ' + tcx + ' ' + tcy + ')"/>';
  /* háttér-porszemek: apró, halvány, mindig ugyanott — nem a gyerek csillagai, semmit sem árulnak el */
  var v = egVel(mod === "szeles" ? 7 : 11);
  s += '<g fill="#dfe6ff">';
  for (var i = 0; i < 110; i++) s += '<circle cx="' + (v() * W).toFixed(1) + '" cy="' + (v() * H * 0.9).toFixed(1) + '" r="' + (0.5 + v() * 0.7).toFixed(2) + '" opacity="' + (0.18 + v() * 0.3).toFixed(2) + '"/>';
  s += '</g>';

  /* a csillagképek */
  var kepek = EG_KEPEK.map(function (kep) { return egKepAllapot(kep, src, mod); });
  kepek.forEach(function (ka) {
    if (!ka.kesz.length && !ka.rajzolt) return;
    var xs = ka.kesz.map(function (c) { return c.x; }), ys = ka.kesz.map(function (c) { return c.y; });
    var bx0 = Math.min.apply(null, xs) - 14, bx1 = Math.max.apply(null, xs) + 14, by0 = Math.min.apply(null, ys) - 14, by1 = Math.max.apply(null, ys) + 14;
    s += '<g class="eg-kep' + (ka.rajzolt ? " teljes" : "") + (ka.arany ? " arany" : "") + ' eg-m-' + ka.kep.mozdul + '" data-kep="' + ka.kep.id + '">';
    s += '<g class="eg-kep-belso">';
    ka.vonalak.forEach(function (vn) {
      var a = ka.cs[vn[0]], b = ka.cs[vn[1]];
      s += '<line class="eg-vonal' + (ka.rajzolt ? " teljes" : "") + '" data-kell="' + egEsc(ka.rajzolt ? ka.kesz.map(function (c) { return c.id; }).join(" ") : a.id + " " + b.id) + '" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/>';
    });
    ka.kesz.forEach(function (c) { var uj = egUjCsillag(c, eg); s += egCsillagSVG(c, uj, 0.5 + ujDb * 0.35); if (uj) ujDb++; });
    s += '</g></g>';
  });
  /* vándorcsillagok a Tejútban (kész pálya, amelynek egysége még nincs a táblában) */
  src.vandorok().forEach(function (pa) {
    var a = src.allapot(pa.id) || {}, t = 0.1 + egHash(pa.id) * 0.8;
    var c = { id: pa.id, pa: pa, kesz: true, arany: !!a.arany, fo: -1, x: t0[0] + (t1[0] - t0[0]) * t, y: t0[1] + (t1[1] - t0[1]) * t };
    var uj = egUjCsillag(c, eg);
    s += '<g class="eg-vandor" style="animation-delay:-' + (egHash(pa.id + "v") * 20).toFixed(1) + 's">' + egCsillagSVG(c, uj, 0.5 + ujDb * 0.35) + '</g>';
    if (uj) ujDb++;
  });

  /* a tetőablak kerete a kép alján + az unikornis ragyogó szarvhegye (ő néz fel) */
  var K = M.keret, kAlj = K[1] + K[2];
  s += '<path class="eg-keret" fill-rule="evenodd" d="M-400 -400 H' + (W + 400) + ' V' + (H + 400) + ' H-400 Z M' + (K[0] - K[2]) + ' ' + K[1] + ' a' + K[2] + ' ' + K[2] + ' 0 1 0 ' + (K[2] * 2) + ' 0 a' + K[2] + ' ' + K[2] + ' 0 1 0 ' + (-K[2] * 2) + ' 0 Z" fill="#7e64ad"/>';
  s += '<circle cx="' + K[0] + '" cy="' + K[1] + '" r="' + K[2] + '" fill="none" stroke="#b79fd4" stroke-width="7" pointer-events="none"/>';
  s += '<circle cx="' + K[0] + '" cy="' + K[1] + '" r="' + (K[2] + 14) + '" fill="none" stroke="#6a5296" stroke-width="3" opacity="0.6" pointer-events="none"/>';
  s += '<g class="eg-szarv" pointer-events="none"><circle cx="' + K[0] + '" cy="' + (kAlj - 22) + '" r="44" fill="url(#eg-szarv-fu)"/>';
  s += '<path d="M' + (K[0] - 9) + ' ' + (kAlj + 12) + ' L' + K[0] + ' ' + (kAlj - 34) + ' L' + (K[0] + 9) + ' ' + (kAlj + 12) + ' Z" fill="#fff1c4" stroke="#e8c46a" stroke-width="1.6" stroke-linejoin="round"/>';
  s += '<g stroke="#e8c46a" stroke-width="1.3" opacity="0.8"><line x1="' + (K[0] - 6) + '" y1="' + (kAlj - 2) + '" x2="' + (K[0] + 6) + '" y2="' + (kAlj - 8) + '"/><line x1="' + (K[0] - 4) + '" y1="' + (kAlj - 14) + '" x2="' + (K[0] + 4) + '" y2="' + (kAlj - 19) + '"/></g></g>';
  s += '</svg>';
  return { svg: s, kepek: kepek, ujDb: ujDb };
}

/* ── a nyitott ég képernyője ── */
var EG_NYITVA = null;   /* { src, mod, kepek } */
function egNyit() {
  egZar(true);
  var src = egForras(), mod = egModValaszt(), eg = src.eg();
  var keszIdk = [];
  EG_KEPEK.forEach(function (kep) { src.kepPalyak(kep).forEach(function (pa) { if ((src.allapot(pa.id) || {}).kesz) keszIdk.push(pa.id); }); });
  src.vandorok().forEach(function (pa) { keszIdk.push(pa.id); });
  var valt = egSorrendFrissit(src, keszIdk);

  var host = document.createElement("div");
  host.id = "eg-kep";
  if (nyugiMod()) host.classList.add("eg-nyugi");
  var r = egRajz(src, mod);
  host.innerHTML = r.svg +
    '<button class="eg-gomb eg-vissza" type="button">← Vissza az odúba</button>' +
    '<button class="eg-gomb eg-vj-gomb" type="button" aria-label="Hogyan gyúlt ki az egem?" title="Hogyan gyúlt ki az egem?">⏪</button>' +
    (EG_PROBA ? '<button class="eg-gomb eg-proba" type="button">🧪 ' + EG_PROBA_SOR[EG_PROBA_I].nev + ' ▸</button>' : "");
  document.body.appendChild(host);
  EG_NYITVA = { src: src, mod: mod, kepek: r.kepek, host: host };
  egKot(host);

  /* minden most látott csillag „látott” lesz; a kirajzolódott kép az is marad */
  keszIdk.forEach(function (id) { var a = src.allapot(id) || {}; var kell = a.arany ? 2 : 1; if ((eg.latott[id] || 0) < kell) { eg.latott[id] = kell; valt = true; } });
  r.kepek.forEach(function (ka) { if (ka.teljes && !eg.teljes[ka.kep.id]) { eg.teljes[ka.kep.id] = 1; valt = true; } });
  if (valt) src.ment();
  hangCsilla();
}
function egZar(csendben) {
  var h = document.getElementById("eg-kep");
  _egVjIdo.forEach(clearTimeout); _egVjIdo = [];
  if (h) h.parentNode.removeChild(h);
  EG_NYITVA = null;
  if (csendben) return;
  hangGomb();
  if (oduAktiv()) { renderOdu(); oduUniHaza(); }   /* a tetőablak ragyogása frissül */
}
function egKot(host) {
  host.querySelector(".eg-vissza").addEventListener("click", function () { egZar(); });
  host.querySelector(".eg-vj-gomb").addEventListener("click", function (e) { e.stopPropagation(); egVisszajatszas(); });
  var pb = host.querySelector(".eg-proba");
  if (pb) pb.addEventListener("click", function () { EG_PROBA_I = (EG_PROBA_I + 1) % EG_PROBA_SOR.length; EG_PROBA_ADAT = null; hangGomb(); egNyit(); });
  var svg = host.querySelector("svg");
  svg.addEventListener("click", function (e) {
    if (host.classList.contains("eg-vj")) { egVjVege(); return; }   /* visszajátszás közben: a végére ugrik */
    var cs = e.target.closest && e.target.closest(".eg-cs");
    if (cs) { egCsillagKoppint(cs.getAttribute("data-id")); return; }
    if (e.target.closest && e.target.closest(".eg-keret")) { egZar(); return; }
    egCimke(null);
  });
}

/* csillagra koppintva: felfénylik, mellette a pálya ikonja + neve (a hang is mondja). Osztályt, szintet NEM ír ki.
   A csillagkép vonalai CSAK ilyenkor látszanak, pár másodpercig (producer, 2026-11-09: alapból nincs csík a csillagok között).
   Teljes képnél a címke alatt a kép neve is, és a kép egyszer megmozdul; félkésznél a név rejtve marad (a kiteljesedés jutalma). */
var _egVonalIdo = null;
function egCsillagKoppint(id) {
  var N = EG_NYITVA; if (!N) return;
  var c = null, ka = null;
  N.kepek.forEach(function (k) { k.cs.forEach(function (x) { if (x.id === id) { c = x; ka = k; } }); });
  if (!c) N.src.vandorok().forEach(function (pa) { if (pa.id === id) c = { id: id, pa: pa, arany: !!(N.src.allapot(id) || {}).arany }; });
  if (!c) return;
  Array.prototype.forEach.call(N.host.querySelectorAll(".eg-kep.fenylik, .eg-kep.mozdul"), function (g) { g.classList.remove("fenylik", "mozdul"); });
  clearTimeout(_egVonalIdo);
  var g = ka && N.host.querySelector('.eg-kep[data-kep="' + ka.kep.id + '"]');
  if (g) {
    void g.getBBox();
    g.classList.add("fenylik");
    if (ka.rajzolt) g.classList.add("mozdul");
    _egVonalIdo = setTimeout(function () { g.classList.remove("fenylik", "mozdul"); }, 3500);
  }
  var el = N.host.querySelector('.eg-cs[data-id="' + id.replace(/"/g, '\\"') + '"]');
  if (el) {
    egCimke({ szoveg: (c.pa.ikon ? c.pa.ikon + " " : "") + c.pa.nev, arany: c.arany,
      alcim: ka && ka.rajzolt ? ka.kep.nev + " · " + ka.kep.hu : null });
    el.classList.remove("fenylik"); void el.getBBox(); el.classList.add("fenylik");
  }
  hangCsilla();   /* beszéd nincs (producer, 11-09): csak a felirat a képernyő szélén */
}
/* a felirat a képernyő bal alsó szélén, a tetőablak keretén (producer, 11-09: ne takarja ki a csillagképet) */
function egCimke(o) {
  var N = EG_NYITVA; if (!N) return;
  var d = N.host.querySelector(".eg-cimke");
  if (!o) { if (d) d.parentNode.removeChild(d); return; }
  if (d) d.parentNode.removeChild(d);
  d = document.createElement("div");
  d.className = "eg-cimke" + (o.arany ? " arany" : "");
  d.innerHTML = '<div class="eg-cimke-fo">' + egEsc(o.szoveg) + '</div>' + (o.alcim ? '<div class="eg-cimke-al">' + egEsc(o.alcim) + '</div>' : "");
  N.host.appendChild(d);
}

/* ── ⏪ „Hogyan gyúlt ki az egem?”: az ég elsötétül, a csillagok a mentett sorrendben egyenként kigyúlnak (elején lassan,
   aztán gyorsulva, összesen legfeljebb ~13 mp); vonal nincs. Koppintás → vége. ── */
var _egVjIdo = [];
function egVisszajatszas() {
  var N = EG_NYITVA; if (!N) return;
  var host = N.host, sor = N.src.eg().sorrend, hely = {}, i;
  egCimke(null);
  var csEl = Array.prototype.slice.call(host.querySelectorAll(".eg-cs")), vEl = Array.prototype.slice.call(host.querySelectorAll(".eg-vonal"));
  var ids = csEl.map(function (e) { return e.getAttribute("data-id"); });
  var rend = sor.filter(function (id) { return ids.indexOf(id) >= 0; });
  ids.forEach(function (id) { if (rend.indexOf(id) < 0) rend.push(id); });
  rend.forEach(function (id, k) { hely[id] = k; });
  var n = rend.length; if (!n) return;
  var T = Math.min(13, 2 + n * 1.1), ido = rend.map(function (id, k) { return 0.7 + T * Math.pow(k / Math.max(1, n - 1), 0.62); });
  _egVjIdo.forEach(clearTimeout); _egVjIdo = [];
  host.classList.add("eg-vj");
  csEl.concat(vEl).forEach(function (e) { e.classList.remove("eg-ego"); });
  hangGomb();
  csEl.forEach(function (e) {
    var k = hely[e.getAttribute("data-id")];
    _egVjIdo.push(setTimeout(function () { e.classList.add("eg-ego"); if (k % 3 === 0) hangCsilla(); }, ido[k] * 1000));
  });
  /* a vonalak a visszajátszásban sem látszanak (producer, 11-09: csík csak csillag-koppintásra) */
  _egVjIdo.push(setTimeout(egVjVege, (ido[n - 1] + 1.6) * 1000));
}
function egVjVege() {
  var N = EG_NYITVA; if (!N) return;
  _egVjIdo.forEach(clearTimeout); _egVjIdo = [];
  N.host.classList.remove("eg-vj");
  Array.prototype.forEach.call(N.host.querySelectorAll(".eg-ego"), function (e) { e.classList.remove("eg-ego"); });
}

window.addEventListener("resize", function () {
  if (!EG_NYITVA) return;
  var mod = egModValaszt();
  if (mod !== EG_NYITVA.mod) egNyit();
});

/* ── a tetőablak az odú plafonján (odu.js hívja). Csukva: egy szelet ég a napszak színében, pár csillám (nem a gyerek
   csillagai). ragyog = van még nem látott csillag → az üveg lassan lüktetve felragyog (szám, felirat nincs). ── */
var EG_TETO = { x: 345, y: 104, rx: 58, ry: 15 };
function tetoablakSVG(napszak, ragyog) {
  var T = EG_TETO, X = T.x, Y = T.y;
  var c = { este: ["#1f2350", "#3a4488"], reggel: ["#ffc6dc", "#ffe6cf"], del: ["#8fc6ee", "#cbe8fa"], eclipse: ["#141328", "#2a2850"] }[napszak] || ["#1f2350", "#3a4488"];
  var s = '<defs><clipPath id="eg-teto-clip"><ellipse cx="' + X + '" cy="' + Y + '" rx="' + T.rx + '" ry="' + T.ry + '"/></clipPath>';
  s += '<linearGradient id="eg-teto-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>';
  if (ragyog) s += '<ellipse class="eg-teto-ragyog" cx="' + X + '" cy="' + Y + '" rx="' + (T.rx + 26) + '" ry="' + (T.ry + 18) + '" fill="#fff3b0"/>';
  s += '<ellipse cx="' + X + '" cy="' + (Y + 1) + '" rx="' + (T.rx + 9) + '" ry="' + (T.ry + 6) + '" fill="#7e64ad"/>';   /* a kéregbe vágott perem */
  s += '<ellipse cx="' + X + '" cy="' + Y + '" rx="' + (T.rx + 4) + '" ry="' + (T.ry + 3) + '" fill="#a88fce"/>';
  s += '<g clip-path="url(#eg-teto-clip)"><rect x="' + (X - T.rx) + '" y="' + (Y - T.ry) + '" width="' + (T.rx * 2) + '" height="' + (T.ry * 2) + '" fill="url(#eg-teto-gr)"/>';
  var nappal = napszak === "reggel" || napszak === "del";
  s += '<g class="eg-teto-csillam" fill="' + (nappal ? "#ffffff" : "#fff6d8") + '" opacity="' + (nappal ? 0.55 : 0.9) + '">';
  [[-38, -4, 1.3], [-18, 5, 1.1], [6, -7, 1.5], [24, 3, 1.1], [42, -3, 1.2], [-6, 8, 0.9]].forEach(function (p) { s += '<circle cx="' + (X + p[0]) + '" cy="' + (Y + p[1]) + '" r="' + p[2] + '"/>'; });
  s += '</g>';
  if (ragyog) s += '<ellipse class="eg-teto-ragyog eg-teto-belso" cx="' + X + '" cy="' + Y + '" rx="' + T.rx + '" ry="' + T.ry + '" fill="#ffe9ad"/>';
  s += '<path d="M' + (X - 40) + ' ' + (Y - 8) + ' Q' + (X - 20) + ' ' + (Y - 13) + ' ' + X + ' ' + (Y - 12) + '" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>';   /* üvegfény */
  s += '</g>';
  s += '<g stroke="#8a6fb8" stroke-width="3.2" stroke-linecap="round"><line x1="' + (X - T.rx) + '" y1="' + Y + '" x2="' + (X + T.rx) + '" y2="' + Y + '"/><line x1="' + X + '" y1="' + (Y - T.ry) + '" x2="' + X + '" y2="' + (Y + T.ry) + '"/></g>';
  s += '<circle cx="' + X + '" cy="' + Y + '" r="3.4" fill="#8a6fb8"/>';
  return s;
}

/* ══ 🧪 ?egproba: kitalált adatokkal (a valódi mentés érintetlen marad). A „🧪 … ▸” gomb lapozza a próbákat. ══ */
var EG_PROBA_SOR = [
  { nev: "Vegyes", kepek: {
      noctua: { n: "valodi", kesz: 1, arany: 0.35 }, tabernaculum: { n: "valodi", kesz: 0.67 }, libra: { n: "valodi", kesz: 1, arany: 1 },
      lyra: { n: "valodi", kesz: 0.5 }, forfex: { n: "valodi", kesz: 1 }, ampulla: { n: "valodi", kesz: 0.25 }, fornax: { n: "valodi", kesz: 0.75 },
      monoceros: { n: "valodi", kesz: 1, uj: 3 }, mensa: { n: 7, kesz: 1, arany: 0.5 }, cor: { n: 4, kesz: 0.5, uj: 1 } }, vandor: 2 },
  { nev: "3 csillag", alap: { n: 3, kesz: 1 }, aranyKepek: ["libra", "lyra", "fornax", "cor"] },
  { nev: "20 csillag", alap: { n: 20, kesz: 1 }, aranyKepek: ["noctua", "ampulla", "mensa"] },
  { nev: "Félkész", alap: { n: 10, kesz: 0.5 } },
  { nev: "Saját ég", sajat: true }
];
var EG_PROBA_I = 0, EG_PROBA_ADAT = null;
function egProbaForras() {
  if (EG_PROBA_ADAT) return EG_PROBA_ADAT;
  var sz = EG_PROBA_SOR[EG_PROBA_I], allapot = {}, listak = {}, vandor = [], eg = egUjAllapot();
  if (sz.sajat) {   /* a valódi mentés MÁSOLATA: látszik a saját ég, de semmi nem mentődik */
    var mas = JSON.parse(JSON.stringify(P().palyak || {})), egm = JSON.parse(JSON.stringify(P().eg || egUjAllapot()));
    EG_PROBA_ADAT = { kepPalyak: EG_VALODI.kepPalyak, vandorok: EG_VALODI.vandorok, allapot: function (id) { return mas[id] || {}; },
      eg: function () { if (!egm.latott) egm.latott = {}; if (!egm.teljes) egm.teljes = {}; if (!Array.isArray(egm.sorrend)) egm.sorrend = []; return egm; }, ment: function () {} };
    return EG_PROBA_ADAT;
  }
  var most = Date.now();
  EG_KEPEK.forEach(function (kep) {
    var d = (sz.kepek && sz.kepek[kep.id]) || sz.alap || { n: 0 };
    var lista = d.n === "valodi" ? EG_VALODI.kepPalyak(kep).map(function (pa) { return { id: pa.id, nev: pa.nev, ikon: pa.ikon }; }) : [];
    if (d.n !== "valodi") for (var i = 0; i < d.n; i++) lista.push({ id: "proba-" + kep.id + "-" + (i + 1), nev: kep.hu.replace(/^(a|az) /, "") + " próbapályája " + (i + 1), ikon: "⭐" });
    var f = d.kesz || 0, aranyF = d.arany !== undefined ? d.arany : ((sz.aranyKepek || []).indexOf(kep.id) >= 0 ? 1 : 0);
    lista.forEach(function (pa, i) {   /* a kész pályák egyenletesen szétszórva (félkésznél minden második) */
      allapot[pa.id] = { kesz: f >= 1 || Math.floor((i + 1) * f + 1e-9) > Math.floor(i * f + 1e-9) };
    });
    var keszek = lista.filter(function (pa) { return allapot[pa.id].kesz; });
    var aranyDb = Math.round(keszek.length * aranyF), ujDb = d.uj || 0;
    keszek.forEach(function (pa, i) {
      if (i < aranyDb) allapot[pa.id].arany = true;
      var uj = i >= keszek.length - ujDb;
      if (uj) allapot[pa.id].keszIdo = most - (keszek.length - i) * 60000;
      else eg.latott[pa.id] = allapot[pa.id].arany ? 2 : 1;
    });
    listak[kep.id] = lista;
  });
  for (var v = 0; v < (sz.vandor || 0); v++) { var vid = "proba-vandor-" + (v + 1); vandor.push({ id: vid, nev: "Vándorcsillag " + (v + 1), ikon: "🌠" }); allapot[vid] = { kesz: true }; eg.latott[vid] = 1; }
  EG_PROBA_ADAT = { kepPalyak: function (kep) { return listak[kep.id] || []; }, vandorok: function () { return vandor; },
    allapot: function (id) { return allapot[id] || {}; }, eg: function () { return eg; }, ment: function () {} };
  return EG_PROBA_ADAT;
}

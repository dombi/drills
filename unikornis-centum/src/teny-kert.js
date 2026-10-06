/* ============ 10c3) 🌷 TÉNY-KERT: a virágok a túlparton (Tamagocsi-kert 4. kör) ============
   Terv: terv/teny-kert-tamagocsi-terv.html · kép: terv/teny-kert-c2-rajzterv.html (a virág-kód innen jön, változatlan rajzzal).
   • Egy tő = egy számcsalád (6, 7, 42), rajta tényenként egy virág (2–3). Napraforgó-spirál: középen a könnyű családok
     (tenyNehez), kifelé a nehezek; egy tő helye mindig ugyanaz. A gyerek nem lát számot, a virág egyszerűen az övé.
   • A kinézet a tény kulcsából és a gyerek állandó magjából (P().tenyKert.gy) számolódik: forma (tövenként), árnyalat
     (az ágyás színkörén belül, a tövön mind más), minta, közép, apró ékszer — betöltéskor nem sorsolódik újra.
   • Fázis: tenyViragFazis (teny.js): 1 hajtás · 2 bimbó · 3 virág. A nyílás jelenete egyszer játszódik le, amikor a gyerek
     először látja közelről (P().tenyKert.lg[agy] = az a gyakorlós nap, amikor utoljára látta az ágyást).
   • Távolról (kertHatterSVG ágyásai): színes pöttyök a spirálon (toMini). Ágyásra koppintva az unikornis a hídon át
     belesétál, a kép ráközelít (kert-kamera), majd a közeli kép (tvk-kozel) jön: tövek, sétálás, szagolás.
   • Első belépés (tenyKertBelep): a meglévő tudás (doboz ≥ 3) bimbóként jelenik meg, a következő gyakorlós napon nyílik.
   • Az ösvény végén (palyaVege, ftVege): „🌸 Két új virág nyílt a kertedben!” / „🌱 Új hajtás bújt ki…” (tenyKertPalyaHir).
   • A pult (admin) is betölti: tenyKertTovek + tenyKertPultSVG rajzolja a „gyerek kertje” nézetet.
   5. kör (gondozás: szomjúság, locsolás, üdvözlés, napi meglepetés) és 6. kör (ritka mag) még hátra: a toRajz kedv-állapotai
   (szomj1/szomj2/jol/koszon) már itt vannak, a C2 rajzterv szerint. */

/* ════════════ 1. A VIRÁG-MODUL (a C2 rajzterv kódja) ════════════ */
function tvRad(a) { return a * Math.PI / 180; }
function tvRng(seed) {
  var a = seed >>> 0;
  return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function tvSulyos(r, arr) {
  var o = 0, i; for (i = 0; i < arr.length; i++) o += arr[i][1];
  var x = r() * o; for (i = 0; i < arr.length; i++) { x -= arr[i][1]; if (x < 0) return arr[i][0]; }
  return arr[arr.length - 1][0];
}
function tvHsl(h, s, l) { return "hsl(" + Math.round((h + 360) % 360) + " " + Math.round(Math.max(0, Math.min(100, s))) + "% " + Math.round(Math.max(0, Math.min(100, l))) + "%)"; }
function tvMas(k, felul) { var o = {}, x; for (x in k) o[x] = k[x]; for (x in felul) o[x] = felul[x]; return o; }

/* az ágyások színköre: o = rózsaszín (+ −), s = lila (× ÷) */
var TV_ARNYALAT = {
  o: [{ nev: "rózsa", h: 340, s: 78, l: 76 }, { nev: "barack", h: 24, s: 92, l: 77 }, { nev: "korall", h: 6, s: 85, l: 72 }, { nev: "málna", h: 334, s: 62, l: 60 }, { nev: "vajsárga", h: 46, s: 92, l: 76 }, { nev: "pír", h: 352, s: 70, l: 86 }],
  s: [{ nev: "levendula", h: 262, s: 58, l: 78 }, { nev: "ibolya", h: 264, s: 52, l: 63 }, { nev: "égkék", h: 207, s: 72, l: 75 }, { nev: "szilva", h: 312, s: 38, l: 56 }, { nev: "gyöngyház", h: 268, s: 40, l: 92 }, { nev: "mályva", h: 290, s: 48, l: 73 }]
};
function tvSzinHarmas(a, r) {
  var h = a.h + (r() - .5) * 12, s = a.s + (r() - .5) * 6, l = a.l + (r() - .5) * 7;
  return { m: tvHsl(h, s, l), l: tvHsl(h, s - 8, Math.min(97, l + 12)), mm: tvHsl(h + 3, s + 4, l - 8), d: tvHsl(h - 4, s + 8, l - 22), nev: a.nev };
}
var TV_MINTAK = [["egyszinu", 3], ["csikos", 2], ["pottyos", 2], ["ketszinu", 2], ["atmenetes", 2], ["szegelyes", 2]];
function tvMintakNelkul(mi) { return TV_MINTAK.filter(function (m) { return m[0] !== mi; }); }
var TV_KOZEP = { arany: { m: "#ffd24d", l: "#fff0a6", d: "#d9961c" }, narancs: { m: "#ffa552", l: "#ffd7a8", d: "#d8691d" },
                 feher: { m: "#fffaf0", l: "#ffffff", d: "#e0b94a" }, csillogo: { m: "#ffe27a", l: "#fffbe2", d: "#c99428", csill: 1 } };
var TV_KOZEPEK = [["arany", 3], ["narancs", 2], ["feher", 2], ["csillogo", 1]];

/* ── rajz-elemek ── */
function tvSzirom(tip, L, w) {
  switch (tip) {
    case "hegyes": return "M" + ktP(0, 0, "C", w * .95, -L * .22, w * .8, -L * .62, 0, -L, "C", -w * .8, -L * .62, -w * .95, -L * .22, 0, 0) + "Z";
    case "csipkes": return "M" + ktP(0, 0, "C", w * .9, -L * .18, w * 1.15, -L * .85, w * .5, -L, "Q", w * .18, -L * 1.03, 0, -L * .87, "Q", -w * .18, -L * 1.03, -w * .5, -L, "C", -w * 1.15, -L * .85, -w * .9, -L * .18, 0, 0) + "Z";
    case "szeles": return "M" + ktP(0, 0, "C", w * .6, -L * .08, w * 1.12, -L * .5, w * .78, -L * .9, "Q", w * .4, -L * 1.06, 0, -L * .96, "Q", -w * .4, -L * 1.06, -w * .78, -L * .9, "C", -w * 1.12, -L * .5, -w * .6, -L * .08, 0, 0) + "Z";
    default: return "M" + ktP(0, 0, "C", w * .9, -L * .16, w * 1.06, -L * .8, 0, -L, "C", -w * 1.06, -L * .8, -w * .9, -L * .16, 0, 0) + "Z";
  }
}
/* egy festett szirom: alap + minta + fény + tő-árnyék (felfelé mutat, tő a (0,0)-ban) */
function tvSziromFest(tip, L, w, k, c) {
  c = c || k.c; var m = k.minta, s = "";
  var v = ' stroke="' + c.d + '" stroke-opacity=".5" stroke-width=".6"';
  if (m === "szegelyes") s += '<path d="' + tvSzirom(tip, L, w) + '" fill="#fffaf4"' + v + '/><path d="' + tvSzirom(tip, L * .84, w * .78) + '" fill="' + c.m + '"/>';
  else if (m === "ketszinu") s += '<path d="' + tvSzirom(tip, L, w) + '" fill="' + k.c2.m + '"' + v + '/><path d="' + tvSzirom(tip, L * .62, w * .9) + '" fill="' + c.m + '"/>';
  else s += '<path d="' + tvSzirom(tip, L, w) + '" fill="' + c.m + '"' + v + '/>';
  if (m === "atmenetes") s += '<path d="' + tvSzirom(tip, L * .58, w * .76) + '" fill="' + c.d + '" opacity=".5"/>';
  s += '<path d="' + tvSzirom("kerek", L * .74, w * .3) + '" fill="' + c.l + '" opacity=".7" transform="translate(' + ktR(-w * .2) + ' ' + ktR(-L * .06) + ')"/>';
  s += '<ellipse cx="0" cy="' + ktR(-L * .1) + '" rx="' + ktR(w * .42) + '" ry="' + ktR(L * .13) + '" fill="' + c.d + '" opacity=".28"/>';
  if (m === "csikos") s += '<path d="M' + ktP(0, -L * .1, "Q", w * .12, -L * .5, 0, -L * .86, "M", -w * .36, -L * .18, "Q", -w * .46, -L * .5, -w * .3, -L * .74, "M", w * .36, -L * .18, "Q", w * .46, -L * .5, w * .3, -L * .74) + '" stroke="' + c.d + '" stroke-width="' + ktR(Math.max(.5, w * .1)) + '" fill="none" stroke-linecap="round" opacity=".65"/>';
  if (m === "pottyos") [[-.28, .3], [.26, .34], [0, .48], [-.18, .62], [.2, .64]].forEach(function (q) { s += '<circle cx="' + ktR(q[0] * w) + '" cy="' + ktR(-q[1] * L) + '" r="' + ktR(Math.max(.45, w * .09)) + '" fill="' + c.d + '" opacity=".7"/>'; });
  return s;
}
function tvKorben(n, fn, lap, fel, cls) {
  cls = cls === undefined ? "tv-sz" : cls;
  var s = '<g transform="scale(1 ' + ktR(lap || 1) + ')">';
  for (var i = 0; i < n; i++) s += '<g transform="rotate(' + ktR((fel || 0) + 360 * i / n) + ')"><g class="' + cls + '" style="--i:' + i + '">' + fn(i) + '</g></g>';
  return s + '</g>';
}
function tvCsillam(x, y, m) { return '<g transform="translate(' + ktR(x) + ' ' + ktR(y) + ') scale(' + ktR(m / 7 * 10) / 10 + ')"><path class="tv-csillog" d="M0 -7 L1.6 -1.6 7 0 1.6 1.6 0 7 -1.6 1.6 -7 0 -1.6 -1.6Z" fill="#fffbe6" stroke="#ffd24d" stroke-width="1"/></g>'; }
function tvKozep(k, r, lap) {
  var z = TV_KOZEP[k.kozep], s = '<g class="tv-kozep"><g transform="scale(1 ' + (lap || 1) + ')">', i, a;
  if (z.csill) for (i = 0; i < 10; i++) { a = i / 10 * 6.283; s += '<path d="M' + ktP(Math.cos(a) * r * .8, Math.sin(a) * r * .8, "L", Math.cos(a) * r * 1.55, Math.sin(a) * r * 1.55) + '" stroke="#e8c35a" stroke-width=".55"/><circle cx="' + ktR(Math.cos(a) * r * 1.6) + '" cy="' + ktR(Math.sin(a) * r * 1.6) + '" r="' + ktR(r * .13) + '" fill="#fff6c2"/>'; }
  s += '<circle r="' + ktR(r) + '" fill="' + z.m + '" stroke="' + z.d + '" stroke-width=".7"/>';
  s += '<circle cx="' + ktR(-r * .28) + '" cy="' + ktR(-r * .3) + '" r="' + ktR(r * .5) + '" fill="' + z.l + '" opacity=".85"/>';
  var N = Math.max(5, Math.round(r * 1.3));
  for (i = 0; i < N; i++) { a = i / N * 6.283 + .4; s += '<circle cx="' + ktR(Math.cos(a) * r * .62) + '" cy="' + ktR(Math.sin(a) * r * .62) + '" r="' + ktR(Math.max(.4, r * .12)) + '" fill="' + z.d + '" opacity=".6"/>'; }
  s += '</g>';
  if (z.csill) s += tvCsillam(r * .2, -r * .25, r * .75);
  return s + '</g>';
}
/* harang (harangvirág): akasztás a (0,0)-ban, lefelé nyílik */
function tvHarang(k, c, z) {
  var m = k.minta;
  var d = "M0 0 C -4 0 -6 3 -6 8 L -7.5 15 Q -9 18.5 -6 17.6 Q -4.6 19.8 -2.6 18.2 Q 0 20.2 2.6 18.2 Q 4.6 19.8 6 17.6 Q 9 18.5 7.5 15 L 6 8 C 6 3 4 0 0 0Z";
  var s = '<path d="M0 -3 V1" stroke="#56a540" stroke-width="1.6"/>';
  s += '<path d="' + d + '" fill="' + (m === "szegelyes" ? "#fffaf4" : c.m) + '" stroke="' + c.d + '" stroke-opacity=".55" stroke-width=".6"/>';
  if (m === "szegelyes") s += '<path d="M0 0 C -4 0 -6 3 -6 8 L -6.9 14.6 Q 0 16.4 6.9 14.6 L 6 8 C 6 3 4 0 0 0Z" fill="' + c.m + '"/>';
  if (m === "ketszinu") s += '<path d="M -7.1 13.2 L -7.5 15 Q -9 18.5 -6 17.6 Q -4.6 19.8 -2.6 18.2 Q 0 20.2 2.6 18.2 Q 4.6 19.8 6 17.6 Q 9 18.5 7.5 15 L 7.1 13.2 Q 0 15 -7.1 13.2Z" fill="' + k.c2.m + '"/>';
  if (m === "atmenetes") s += '<path d="M0 0 C -4 0 -6 3 -6 8 L -6.4 10 Q 0 12 6.4 10 L 6 8 C 6 3 4 0 0 0Z" fill="' + c.d + '" opacity=".45"/>';
  s += '<path d="M -3.6 2.4 C -5 6 -5.4 11 -5.6 15.6" stroke="' + c.l + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>';
  if (m === "csikos") s += '<path d="M0 1 V17.5 M -3.6 3 L -4.8 16.6 M 3.6 3 L 4.8 16.6" stroke="' + c.d + '" stroke-width=".55" fill="none" opacity=".6"/>';
  s += '<ellipse cx="0" cy="17.4" rx="6" ry="1.7" fill="' + c.d + '" opacity=".55"/>';
  s += '<path d="M0 12 V19.6" stroke="' + z.d + '" stroke-width=".7"/><circle cx="0" cy="20" r="1.3" fill="' + z.m + '"/>';
  s += '<path d="M -2.6 .6 L -4 -1.6 M 2.6 .6 L 4 -1.6" stroke="#56a540" stroke-width="1.2" stroke-linecap="round"/>';
  return s;
}
function tvLegyezo(R, ny) {
  var N = 13, d = "M0 " + ktR(ny);
  for (var i = 0; i <= N; i++) { var a = tvRad(-80 + 160 * i / N), rr = i % 2 ? R * .84 : R; d += " L" + ktR(Math.sin(a) * rr) + " " + ktR(ny - Math.cos(a) * rr); }
  return d + "Z";
}

/* ── a 12 forma (adat-tábla, könnyen bővíthető): n = szirom-szám tartomány, talp/skala/mag = a fej helye és mérete a száron,
   arc = az arcocska helye [x, y, méret] (null: a formának nincs arca) ── */
var VIRAG_FORMAK = [
  { id: "szazszorszep", nev: "százszorszép", n: [16, 21], level: "kerek", talp: 2, skala: .62, mag: .92, arc: [0, 0, 4.8], mintak: [["egyszinu", 2], ["ketszinu", 3], ["atmenetes", 2]],
    fej: function (k) {
      return tvKorben(k.n, function () { return tvSziromFest("kerek", 17, 2.5, tvMas(k, { minta: k.minta === "ketszinu" ? "ketszinu" : "egyszinu" }), { m: k.c.mm, l: k.c.m, d: k.c.d }); }, .88, 180 / k.n) +
        tvKorben(k.n, function () { return tvSziromFest("kerek", 15, 2.7, k); }, .88, 0) + tvKozep(k, 5.2, .88);
    } },
  { id: "margareta", nev: "margaréta", n: [11, 14], level: "karcsu", talp: 2, skala: .62, mag: 1.05, arc: [0, 0, 6.2], mintak: tvMintakNelkul("szegelyes"),
    fej: function (k) { return tvKorben(k.n, function () { return tvSziromFest("kerek", 19, 4.6, k); }, .84, k.forg) + tvKozep(k, 7.6, .84); } },
  { id: "kankalin", nev: "kankalin", n: [5, 5], level: "kerek", talp: 2, skala: .64, mag: .72, arc: [0, 0, 4.8], mintak: [["egyszinu", 2], ["atmenetes", 2], ["szegelyes", 3], ["ketszinu", 2], ["pottyos", 1]],
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], s = tvKorben(5, function () { return tvSziromFest("csipkes", 15.5, 9, k); }, .92, k.forg), csi = "M0 -7";
      for (var i = 1; i <= 10; i++) { var a = tvRad(i * 36), rr = i % 2 ? 3.4 : 7; csi += " L" + ktR(Math.sin(a) * rr) + " " + ktR(-Math.cos(a) * rr * .92); }
      return s + '<g class="tv-kozep"><path d="' + csi + 'Z" fill="' + z.l + '" stroke="' + z.m + '" stroke-width=".6"/><circle r="2.3" fill="' + z.d + '"/><circle cx="-.6" cy="-.6" r=".8" fill="#fff" opacity=".7"/>' + (z.csill ? tvCsillam(2, -3, 4) : "") + '</g>';
    } },
  { id: "csillagvirag", nev: "csillagvirág", n: [5, 6], level: "karcsu", talp: 2, skala: .62, mag: .95, arc: [0, 0, 4.4], mintak: tvMintakNelkul("pottyos"),
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], s = tvKorben(k.n, function () { return tvSziromFest("hegyes", 20, 5.6, k); }, .9, k.forg) + '<g class="tv-kozep">';
      for (var i = 0; i < k.n; i++) { var a = tvRad(k.forg + 180 / k.n + 360 * i / k.n); s += '<path d="M0 0 L' + ktR(Math.sin(a) * 8) + ' ' + ktR(-Math.cos(a) * 7.2) + '" stroke="' + z.d + '" stroke-width=".6"/><circle cx="' + ktR(Math.sin(a) * 8) + '" cy="' + ktR(-Math.cos(a) * 7.2) + '" r="1.1" fill="' + z.m + '"/>'; }
      return s + '</g>' + tvKozep(k, 3.2, .9);
    } },
  { id: "nefelejcs", nev: "nefelejcs", n: [5, 7], level: "karcsu", talp: 2, skala: .66, mag: .85, arc: [0, 0, 4.6], mintak: [["egyszinu", 3], ["atmenetes", 2], ["ketszinu", 2], ["szegelyes", 1]],
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], hely = [[0, 0, 1.3], [-9.5, -6, 1], [9.5, -6, 1], [-10, 6.5, .95], [10, 6.5, .95], [0, -13, .9], [0, 12.5, .9]];
      var s = '<path d="M-6 2 Q-12 1 -15 -3 M6 0 Q12 -1 15 -5" stroke="#56a540" stroke-width="1" fill="none"/><ellipse cx="-15.4" cy="-4" rx="1.7" ry="2.3" fill="#7cc35c"/><ellipse cx="15.2" cy="-6" rx="1.6" ry="2.2" fill="' + k.c.mm + '"/>';
      for (var j = k.n - 1; j >= 0; j--) {
        var h = hely[j], kk = j % 2 ? tvMas(k, { c: k.c2v }) : k;
        s += '<g transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + h[2] + ')"><g class="tv-sz" style="--i:' + j + '">' + tvKorben(5, function () { return tvSziromFest("kerek", 5.6, 3.5, kk); }, 1, j * 11 + k.forg, "") + '<circle r="1.9" fill="#fffdf2"/><circle r="1.1" fill="' + z.m + '"/></g></g>';
      }
      return s;
    } },
  { id: "pipacs", nev: "pipacs", n: [4, 4], level: "karcsu", talp: 2, skala: .64, mag: 1.05, arc: [0, 0, 4.6], mintak: [["egyszinu", 2], ["atmenetes", 3], ["szegelyes", 2], ["ketszinu", 2]],
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], s = '<g transform="scale(1 .9)">', i, a;
      [225, 315, 135, 45].forEach(function (b, j) { s += '<g transform="rotate(' + ktR(b + k.forg * .3) + ')"><g class="tv-sz" style="--i:' + j + '">' + tvSziromFest("szeles", 18, 12.5, k) + '<path d="M-6 -6 Q-3 -12 -5 -16 M4 -5 Q6 -11 3 -15" stroke="' + k.c.d + '" stroke-width=".6" fill="none" opacity=".4"/></g></g>'; });
      s += '</g><g class="tv-kozep">';
      for (i = 0; i < 16; i++) { a = i / 16 * 6.283; s += '<path d="M' + ktP(Math.cos(a) * 4.2, Math.sin(a) * 4.2, "L", Math.cos(a) * 7, Math.sin(a) * 7 * .9) + '" stroke="#3b2a3f" stroke-width=".7"/><circle cx="' + ktR(Math.cos(a) * 7.2) + '" cy="' + ktR(Math.sin(a) * 7.2 * .9) + '" r="1" fill="' + z.m + '"/>'; }
      s += '<circle r="4.5" fill="#a7b984" stroke="#5f7444" stroke-width=".7"/>';
      for (i = 0; i < 6; i++) { a = i / 6 * 6.283; s += '<path d="M0 0 L' + ktR(Math.cos(a) * 4) + ' ' + ktR(Math.sin(a) * 4) + '" stroke="#5f7444" stroke-width=".6"/>'; }
      return s + '<circle cx="-1.4" cy="-1.5" r="1.4" fill="#e3edc9" opacity=".8"/></g>';
    } },
  { id: "rozsa", nev: "rózsa", n: [5, 5], level: "karcsu", talp: 2, skala: .64, mag: 1, arc: [0, 1, 5.6], mintak: [["egyszinu", 3], ["atmenetes", 2], ["szegelyes", 2], ["ketszinu", 2]],
    fej: function (k) {
      return tvKorben(5, function () { return tvSziromFest("szeles", 17, 11, k); }, .9, k.forg) +
        tvKorben(5, function () { return tvSziromFest("szeles", 12.5, 8.5, k, { m: k.c.m, l: k.c.l, d: k.c.d }); }, .9, k.forg + 36) +
        tvKorben(4, function () { return tvSziromFest("szeles", 8, 6.5, tvMas(k, { minta: "egyszinu" }), { m: k.c.mm, l: k.c.m, d: k.c.d }); }, .9, k.forg + 18) +
        '<g class="tv-kozep"><path d="M-2.5 .5 C -2.5 -3 3 -3.2 3 0 C 3 2.6 -1.4 2.8 -1.2 .4 C -1 -1.2 1.2 -1.2 1.2 .2" fill="none" stroke="' + k.c.d + '" stroke-width="1" stroke-linecap="round"/>' + (TV_KOZEP[k.kozep].csill ? tvCsillam(3, -4, 4.5) : "") + '</g>';
    } },
  { id: "tulipan", nev: "tulipán", n: [3, 3], level: "keskeny", talp: 13, skala: .66, mag: 1, arc: [0, 1, 6.2], mintak: [["egyszinu", 2], ["csikos", 3], ["ketszinu", 2], ["szegelyes", 2], ["atmenetes", 1]],
    fej: function (k) {
      var b = 13, cm = { m: k.c.mm, l: k.c.m, d: k.c.d };
      function h(a, i, L, w, c) { return '<g transform="translate(0 ' + b + ') rotate(' + a + ')"><g class="tv-sz" style="--i:' + i + '">' + tvSziromFest("hegyes", L, w, k, c) + '</g></g>'; }
      return h(-26, 0, 25, 7.5, cm) + h(26, 1, 25, 7.5, cm) + '<ellipse cx="0" cy="' + (b - 5) + '" rx="8.5" ry="6.5" fill="' + k.c.mm + '"/>' + h(-13, 2, 27.5, 9) + h(13, 3, 27.5, 9) + h(0, 4, 26.5, 8.6) +
        (TV_KOZEP[k.kozep].csill ? '<g class="tv-kozep">' + tvCsillam(-5, -8, 4) + '</g>' : "");
    } },
  { id: "harangvirag", nev: "harangvirág", n: [1, 3], level: "karcsu", talp: 14, skala: .66, mag: 1.05, arc: null, mintak: tvMintakNelkul("pottyos"),
    arcFn: function (k) { var h = k.n === 1 ? [13, -13, 1.5] : k.n === 2 ? [4, -12, 1.15] : [9, -15, 1.12]; return [h[0] - 6, h[1] + 10 * h[2], 4.4 * h[2]]; },
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], hely = k.n === 1 ? [[13, -13, 1.5]] : k.n === 2 ? [[4, -12, 1.15], [21, -8, 1]] : [[-1, -5, 1], [9, -15, 1.12], [22, -8, .9]];
      var s = '<path d="M0 14 C 0 0 2 -14 12 -16 C 18 -17 22 -12 22 -8" stroke="#56a540" stroke-width="2" fill="none" stroke-linecap="round"/>';
      hely.forEach(function (h, j) { s += '<g transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + h[2] + ')"><g class="tv-sz" style="--i:' + j + '">' + tvHarang(k, k.c, z) + '</g></g>'; });
      return '<g transform="translate(-6 0)">' + s + '</g>';
    } },
  { id: "liliom", nev: "liliom", n: [6, 6], level: "keskeny", talp: 2, skala: .6, mag: 1.12, arc: [0, -.5, 4.4], mintak: [["pottyos", 3], ["csikos", 2], ["egyszinu", 2], ["atmenetes", 1], ["szegelyes", 1], ["ketszinu", 1]],
    fej: function (k) {
      var z = TV_KOZEP[k.kozep], s = tvKorben(6, function () { return tvSziromFest("hegyes", 22, 6.4, k); }, .8, k.forg) + '<g class="tv-kozep">';
      for (var i = 0; i < 6; i++) {
        var a = i / 6 * 6.283 + .5, x = Math.cos(a) * 12, y = Math.sin(a) * 12 * .8 - 4;
        s += '<path d="M0 0 Q' + ktR(x * .4) + ' ' + ktR(y * .4 - 5) + ' ' + ktR(x) + ' ' + ktR(y) + '" stroke="#b7d98a" stroke-width=".8" fill="none"/><ellipse cx="' + ktR(x) + '" cy="' + ktR(y) + '" rx="2" ry="1" fill="' + z.d + '" transform="rotate(' + ktR(a * 57.3) + ' ' + ktR(x) + ' ' + ktR(y) + ')"/>';
      }
      return s + '<circle r="2.4" fill="#d9f0a8"/>' + (z.csill ? tvCsillam(-3, -5, 4) : "") + '</g>';
    } },
  { id: "kosbor", nev: "kosbor", n: [5, 5], level: "kerek", talp: 10, skala: .66, mag: .95, arc: [0, 8, 5], mintak: [["pottyos", 3], ["csikos", 2], ["atmenetes", 2], ["egyszinu", 1], ["ketszinu", 2]],
    fej: function (k) {
      var cs = { m: k.c.mm, l: k.c.m, d: k.c.d }, z = TV_KOZEP[k.kozep];
      function g(a, i, t, L, w, c) { return '<g transform="rotate(' + a + ')"><g class="tv-sz" style="--i:' + i + '">' + tvSziromFest(t, L, w, k, c) + '</g></g>'; }
      var s = g(0, 0, "hegyes", 17, 4.6, cs) + g(-135, 1, "hegyes", 16, 4.4, cs) + g(135, 2, "hegyes", 16, 4.4, cs) + g(-72, 3, "kerek", 15, 6.8) + g(72, 4, "kerek", 15, 6.8);
      var lip = "M0 1 C 9 1 13 7 11 12.5 Q 8.6 16.6 4.4 14.8 Q 0 18.8 -4.4 14.8 Q -8.6 16.6 -11 12.5 C -13 7 -9 1 0 1Z";
      s += '<g class="tv-sz" style="--i:5"><path d="' + lip + '" fill="' + (k.minta === "ketszinu" ? k.c2.m : k.c.d) + '" stroke="' + k.c.d + '" stroke-width=".6"/><path d="M0 3 C 6 3 8 7 7 10 Q 3 12 0 11 Q -3 12 -7 10 C -8 7 -6 3 0 3Z" fill="' + k.c.l + '" opacity=".55"/>';
      if (k.minta === "pottyos") s += '<g fill="' + k.c.d + '"><circle cx="-3" cy="6" r=".9"/><circle cx="3" cy="6.4" r=".9"/><circle cx="0" cy="8.6" r=".9"/><circle cx="-4.6" cy="9.4" r=".8"/><circle cx="4.6" cy="9.6" r=".8"/></g>';
      if (k.minta === "csikos") s += '<path d="M0 3 V13 M-3 4 L-5 12 M3 4 L5 12" stroke="' + k.c.d + '" stroke-width=".7" fill="none"/>';
      s += '</g><g class="tv-kozep"><ellipse cx="0" cy="-.5" rx="2.6" ry="3.4" fill="#fffaf2" stroke="' + k.c.d + '" stroke-width=".5"/><circle cx="0" cy="-2.4" r="1.2" fill="' + z.m + '"/>' + (z.csill ? tvCsillam(3, -4, 4) : "") + '</g>';
      return '<g transform="translate(0 -3)">' + s + '</g>';
    } },
  { id: "szegfu", nev: "szegfű", n: [3, 4], level: "keskeny", talp: 16, skala: .64, mag: 1, arc: [0, 3, 5.6], mintak: [["egyszinu", 2], ["ketszinu", 3], ["szegelyes", 2], ["csikos", 2], ["pottyos", 1]],
    fej: function (k) {
      var c = k.c, m = k.minta, ret = [[17, 0, c.mm], [14, 1, c.m], [10.5, 3, c.m], [7, 4, c.l]].slice(0, k.n), s = "";
      ret.forEach(function (r, i) {
        var ny = 5 + r[1];
        s += '<g class="tv-sz" style="--i:' + i + '">';
        if (m === "ketszinu" || m === "szegelyes") s += '<path d="' + tvLegyezo(r[0], ny) + '" fill="' + (m === "ketszinu" ? k.c2.m : "#fffaf4") + '" stroke="' + c.d + '" stroke-opacity=".45" stroke-width=".6"/><path d="' + tvLegyezo(r[0] * .82, ny) + '" fill="' + r[2] + '"/>';
        else s += '<path d="' + tvLegyezo(r[0], ny) + '" fill="' + r[2] + '" stroke="' + c.d + '" stroke-opacity=".45" stroke-width=".6"/>';
        s += '<path d="' + tvLegyezo(r[0] * .55, ny) + '" fill="' + c.l + '" opacity=".45"/>';
        if (m === "csikos") s += '<path d="M0 ' + ny + ' L' + ktR(-r[0] * .5) + ' ' + ktR(ny - r[0] * .75) + ' M0 ' + ny + ' L0 ' + ktR(ny - r[0] * .9) + ' M0 ' + ny + ' L' + ktR(r[0] * .5) + ' ' + ktR(ny - r[0] * .75) + '" stroke="' + c.d + '" stroke-width=".6" opacity=".55"/>';
        if (m === "pottyos") s += '<g fill="' + c.d + '" opacity=".6"><circle cx="' + ktR(-r[0] * .4) + '" cy="' + ktR(ny - r[0] * .6) + '" r=".7"/><circle cx="' + ktR(r[0] * .3) + '" cy="' + ktR(ny - r[0] * .7) + '" r=".7"/></g>';
        s += '</g>';
      });
      s += '<path d="M-3.9 5 C -3.6 10 -2.4 14 -1.4 18 L 1.4 18 C 2.4 14 3.6 10 3.9 5 Q 0 6.6 -3.9 5Z" fill="#7cc35c" stroke="#4f9e46" stroke-width=".7"/><path d="M-3.9 5 L-5.4 1.8 L-1.8 5.6 M3.9 5 L5.4 1.8 L1.8 5.6 M0 6 L0 2.6" fill="#7cc35c" stroke="#4f9e46" stroke-width=".7" stroke-linejoin="round"/><path d="M-1 7 V16" stroke="#a5df8c" stroke-width=".7"/>';
      if (TV_KOZEP[k.kozep].csill) s += '<g class="tv-kozep">' + tvCsillam(-6, -6, 4) + '</g>';
      return '<g transform="translate(0 -4)">' + s + '</g>';
    } }
];

/* a kinézet: a kulcsból és a gyerek magjából mindig ugyanaz (a sorsolás sorrendje kötött — ne cseréld fel) */
function viragKinezet(kulcs, gyerekMag, agy, forma, arnyalat) {
  var r = tvRng(ktHash(kulcs + "|" + gyerekMag)), F = VIRAG_FORMAK[forma], pal = TV_ARNYALAT[agy];
  var v = Math.floor(r() * pal.length), ai = arnyalat === undefined ? v : arnyalat % pal.length, c = tvSzinHarmas(pal[ai], r);
  var a2 = pal[(ai + 1 + Math.floor(r() * (pal.length - 1))) % pal.length], c2 = tvSzinHarmas(a2, r);
  var minta = tvSulyos(r, F.mintak || TV_MINTAK), kozep = tvSulyos(r, TV_KOZEPEK);
  var n = F.n[0] + Math.floor(r() * (F.n[1] - F.n[0] + 1));
  var e = r(), ekszer = e < .09 ? "harmat" : e < .17 ? "csillam" : null;
  var c2v = tvSzinHarmas(pal[ai], r), mag = .88 + r() * .26, dol = (r() - .5) * 22, forg = (r() - .5) * 24, ekszerSzog = r() * 360, ido = r() * 4;
  return { forma: forma, agy: agy, c: c, c2: c2, c2v: c2v, minta: minta, kozep: kozep, n: n, mag: mag, dol: dol, forg: forg, ekszer: ekszer, ekszerSzog: ekszerSzog, ido: ido };
}
/* egy tő virágai: a tövön minden virág más árnyalatot kap (a tő saját „lépésközével”) */
function toArnyalatok(csaladKulcs, gyerekMag, n) {
  var h = ktHash(csaladKulcs + "@" + gyerekMag), alap = h % 6, lep = [1, 2, 4, 5][(h >>> 4) % 4], ki = [];
  for (var j = 0; j < n; j++) ki.push((alap + j * lep) % 6);
  return ki;
}

/* ── levelek, hajtás, bimbó, ékszer, arcocska ── */
var TV_LEVEL = { keskeny: [25, 4.2], karcsu: [18, 5.4], kerek: [13, 7.2] };
function tvLevelUt(L, w) { return "M" + ktP(0, 0, "C", w * 1.1, -L * .25, w, -L * .75, 0, -L, "C", -w * .6, -L * .7, -w * 1.1, -L * .3, 0, 0) + "Z"; }
function tvLevel(tip, a, fenyes) {
  var L = TV_LEVEL[tip][0], w = TV_LEVEL[tip][1];
  return '<g transform="rotate(' + ktR(a) + ')"><g class="tv-lev"><path d="' + tvLevelUt(L, w) + '" fill="#6cbd55" stroke="#4a9a3e" stroke-width=".7"/><path d="M0 -1 Q' + ktR(w * .15) + ' ' + ktR(-L * .5) + ' 0 ' + ktR(-L * .9) + '" stroke="#a5df8c" stroke-width=".8" fill="none"/>' +
    (fenyes ? '<path d="' + tvLevelUt(L * .55, w * .35) + '" fill="#f0ffe3" opacity=".65" transform="translate(' + ktR(w * .3) + ' ' + ktR(-L * .14) + ')"/>' : '') + '</g></g>';
}
function hajtasRajz() { return '<path d="M0 0 Q.6 -6 0 -11" stroke="#56a540" stroke-width="1.8" fill="none"/><ellipse cx="-3.6" cy="-12" rx="4" ry="2.2" transform="rotate(-25 -3.6 -12)" fill="#8fd36f" stroke="#4f9e46" stroke-width=".6"/><ellipse cx="3.6" cy="-12.6" rx="4" ry="2.2" transform="rotate(25 3.6 -12.6)" fill="#9bdc7a" stroke="#4f9e46" stroke-width=".6"/>'; }
/* a bimbó csak sejtet: egy csík az árnyalatból — a forma, a minta, a közép nyíláskor derül ki */
function bimboRajz(szin, m) { return '<g transform="scale(' + (m || 1) + ')"><path d="M0 7 C -5.5 5 -5.5 -4 0 -10 C 5.5 -4 5.5 5 0 7Z" fill="#79c25a" stroke="#4f9e46" stroke-width=".7"/><path d="M-.5 5 C 1.8 1 2.4 -4 .4 -8.6 C 2.9 -4 3 1.5 1.2 5Z" fill="' + szin + '"/><path d="M-4 3 Q -2 -2 0 -9 M4 3 Q 2 -2 0 -9" stroke="#4f9e46" stroke-width=".7" fill="none" opacity=".6"/><path d="M-4 5 L -6.5 8 M 4 5 L 6.5 8 M0 7 L0 9.5" stroke="#4f9e46" stroke-width="1.4" stroke-linecap="round"/></g>'; }
function tvEkszer(k, R) {
  if (!k.ekszer) return "";
  var a = tvRad(k.ekszerSzog), x = Math.sin(a) * R * .7, y = -Math.cos(a) * R * .62;
  if (k.ekszer === "harmat") return '<circle cx="' + ktR(x) + '" cy="' + ktR(y) + '" r="1.9" fill="#eaf8ff" stroke="#8fcaf0" stroke-width=".6" opacity=".95"/><circle cx="' + ktR(x - .6) + '" cy="' + ktR(y - .6) + '" r=".6" fill="#fff"/>';
  return tvCsillam(x, y, 4.2);
}
/* arcocska (csak közelről): nyitott · boldog · kuncog · kacsint · csucsor */
function tvArc(x, y, r, tip) {
  var e = r * .38, ey = -r * .1, sz = "#4a2d3a", w = ktR(Math.max(.5, r * .13));
  var s = '<g class="tv-arc"><g transform="translate(' + ktR(x) + ' ' + ktR(y) + ')">';
  s += '<circle cx="' + ktR(-r * .66) + '" cy="' + ktR(r * .22) + '" r="' + ktR(r * .2) + '" fill="#ff8fb0" opacity=".5"/><circle cx="' + ktR(r * .66) + '" cy="' + ktR(r * .22) + '" r="' + ktR(r * .2) + '" fill="#ff8fb0" opacity=".5"/>';
  function zart(x0) { return '<path d="M' + ktP(x0 - r * .17, ey + r * .04, "Q", x0, ey - r * .2, x0 + r * .17, ey + r * .04) + '" stroke="' + sz + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>'; }
  function nyit(x0) { return '<ellipse cx="' + ktR(x0) + '" cy="' + ktR(ey) + '" rx="' + ktR(r * .11) + '" ry="' + ktR(r * .15) + '" fill="' + sz + '"/><circle cx="' + ktR(x0 - r * .04) + '" cy="' + ktR(ey - r * .06) + '" r="' + ktR(r * .045) + '" fill="#fff"/>'; }
  if (tip === "boldog" || tip === "kuncog") s += zart(-e) + zart(e);
  else if (tip === "kacsint") s += zart(-e) + nyit(e);
  else s += nyit(-e) + nyit(e);
  if (tip === "csucsor") s += '<ellipse cx="0" cy="' + ktR(r * .32) + '" rx="' + ktR(r * .1) + '" ry="' + ktR(r * .12) + '" fill="#c2557a"/>';
  else if (tip === "kuncog") s += '<path d="M' + ktP(-r * .22, r * .18, "Q", 0, r * .56, r * .22, r * .18, "Z") + '" fill="#c2557a"/>';
  else s += '<path d="M' + ktP(-r * .2, r * .2, "Q", 0, r * .42, r * .2, r * .2) + '" stroke="' + sz + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>';
  return s + '</g></g>';
}
/* a virág feje */
function viragFej(k, o) {
  o = o || {}; var F = VIRAG_FORMAK[k.forma];
  var s = F.fej(k) + tvEkszer(k, 17);
  if (o.arc) { var a = F.arcFn ? F.arcFn(k) : F.arc; if (a) s += tvArc(a[0], a[1], a[2], o.arc); }
  return s;
}
function tvSzikrak() {
  var s = "";
  for (var i = 0; i < 5; i++) s += '<g transform="translate(' + ktR((i - 2) * 4) + ' -6)"><path class="tv-szikra" style="--k:' + (1.1 + i * .12) + 's;--dx:' + ((i - 2) * 5) + 'px" d="M0 -3 L.8 -.8 3 0 .8 .8 0 3 -.8 .8 -3 0 -.8 -.8Z" fill="#fff6c2" stroke="#ffd24d" stroke-width=".5"/></g>';
  return s;
}
/* ── egy tő: egy számcsalád, rajta tényenként egy virág ──
   to = { forma, mag, tenyek: [{ k, f: 0 semmi · 1 hajtás · 2 bimbó · 3 virág, nyilik }] }
   o = { kedv: "alap|jol|szomj1|szomj2|koszon|kuncog", arc: bool, fel: -1|1 (merre köszön) } */
function toRajz(to, o) {
  o = o || {}; var F = VIRAG_FORMAK[to.forma], r = tvRng(to.mag), n = to.tenyek.length, max = 0, i;
  for (i = 0; i < n; i++) max = Math.max(max, to.tenyek[i].f);
  if (!max) return "";
  var szogek = n === 3 ? [-17, 0, 17] : n === 2 ? [-10, 10] : [0];
  var kedv = o.kedv || "alap", fenyes = kedv === "jol", dolj = kedv === "koszon" ? (o.fel || 1) * 9 : 0;
  var lev = "", szar = "", fejek = "", poharak = "";
  if (max >= 2) { lev += tvLevel(F.level, -54 + (r() - .5) * 16, fenyes) + tvLevel(F.level, 52 + (r() - .5) * 16, fenyes); if (r() < .6) lev += tvLevel(F.level, -16 + (r() - .5) * 12, fenyes); }
  else { r(); r(); r(); }
  [1, 0, 2].filter(function (j) { return j < n; }).forEach(function (j) {
    var t = to.tenyek[j]; if (!t.f) return;
    var a = szogek[j] + t.k.dol * .35 + dolj;
    if (t.f === 1) { fejek += '<g transform="translate(' + ktR(Math.sin(tvRad(a)) * 7) + ' 0) rotate(' + ktR(a * .5) + ')">' + hajtasRajz() + '</g>'; return; }
    var h = 44 * F.mag * t.k.mag * (t.f === 2 ? .8 : 1), hx = Math.sin(tvRad(a)) * h, hy = -Math.cos(tvRad(a)) * h;
    szar += '<path d="M0 0 Q' + ktR(hx * .15 + t.k.dol * .12) + ' ' + ktR(hy * .55) + ' ' + ktR(hx) + ' ' + ktR(hy) + '" stroke="#56a540" stroke-width="2.1" fill="none" stroke-linecap="round"/>';
    var kesl = 'animation-delay:-' + ktR(t.k.ido) + 's';
    /* poharat tartó levélke (szomjas — 5. kör) */
    var pohar = kedv === "szomj2" || (kedv === "szomj1" && (to.mag >>> 3) % 3 !== 2 && j === to.mag % n);
    if (pohar && t.f === 3) {
      var sd = j === 0 ? -1 : 1, px = hx * .62, py = hy * .62;
      poharak += '<g transform="translate(' + ktR(px) + ' ' + ktR(py) + ') scale(' + (sd * 1.5) + ' 1.5)"><g class="tv-pohar" style="' + kesl + '"><path d="M0 0 C 3 -1 6 -3 8 -6" stroke="#56a540" stroke-width="1.3" fill="none"/><path d="M5 -7 C 6 -12 14 -13 15 -8 C 13 -4 7 -3 5 -7Z" fill="#7cc75d" stroke="#4a9a3e" stroke-width=".7"/><path d="M6.6 -8 C 8 -10.6 12.6 -11 13.6 -8.6" stroke="#bfe7ff" stroke-width="1.4" fill="none" stroke-linecap="round"/></g></g>';
    }
    if (t.f === 2) { fejek += '<g transform="translate(' + ktR(hx) + ' ' + ktR(hy) + ')"><g class="tv-fej" style="' + kesl + '"><g transform="rotate(' + ktR(a * .4) + ')">' + bimboRajz(t.k.c.m, .95) + '</g></g></g>'; return; }
    var arc = null;
    if (o.arc) arc = kedv === "jol" ? "boldog" : kedv === "kuncog" ? "kuncog" : kedv === "szomj2" ? (j === 1 ? "kacsint" : "csucsor") : kedv === "szomj1" ? (pohar ? "csucsor" : "nyitott") : "nyitott";
    var S = F.skala, ty = -F.talp * S;
    fejek += '<g transform="translate(' + ktR(hx) + ' ' + ktR(hy) + ')"><g class="tv-fej' + (t.nyilik ? ' tv-nyilik' : '') + '" style="' + kesl + '"><g transform="translate(0 ' + ktR(ty) + ') rotate(' + ktR(t.k.forg * .25 + a * .3) + ') scale(' + S + ')">' + viragFej(t.k, { arc: arc }) + '</g></g>' +
      (t.nyilik ? '<g class="tv-bimbo-el"><g transform="rotate(' + ktR(a * .4) + ')">' + bimboRajz(t.k.c.m, .95) + '</g></g>' + tvSzikrak() : '') + '</g>';
  });
  return '<g class="tv-ring" style="animation-delay:-' + ktR(r() * 4) + 's">' + lev + szar + poharak + fejek + '</g>';
}
/* távolról: pár színes pötty */
function toMini(to) {
  var n = to.tenyek.length, dx = n === 3 ? [-3.4, 0, 3.4] : n === 2 ? [-2, 2] : [0];
  var s = '<ellipse cx="0" cy=".4" rx="5" ry="1.7" fill="#3f7a32" opacity=".3"/>';
  to.tenyek.forEach(function (t, i) {
    var x = dx[i], y = -6.4 - (i === 1 ? 1.2 : 0);
    if (t.f === 1) s += '<ellipse cx="' + (x - 1) + '" cy="-1.6" rx="1.3" ry=".8" fill="#8fd36f"/><ellipse cx="' + (x + 1) + '" cy="-1.8" rx="1.3" ry=".8" fill="#9bdc7a"/>';
    else if (t.f === 2) s += '<path d="M' + x + ' 0 V-4" stroke="#4f9e46" stroke-width=".8"/><ellipse cx="' + x + '" cy="-5" rx="1.3" ry="2" fill="#79c25a"/><ellipse cx="' + (x + .4) + '" cy="-5.2" rx=".5" ry="1.3" fill="' + t.k.c.m + '"/>';
    else if (t.f === 3) s += '<path d="M' + x + ' 0 V-5" stroke="#4f9e46" stroke-width=".8"/><circle cx="' + x + '" cy="' + ktR(y) + '" r="2.9" fill="' + t.k.c.m + '" stroke="' + t.k.c.d + '" stroke-width=".4"/><circle cx="' + x + '" cy="' + ktR(y) + '" r="1" fill="' + TV_KOZEP[t.k.kozep].m + '"/>';
  });
  return '<g class="tv-mini" style="animation-delay:-' + ktR((to.mag % 40) / 10) + 's">' + s + '</g>';
}
/* napraforgó-spirál: az i. tő helye (i = 0 középen) egy rx × ry ellipszisben */
function tvSpiral(i, cx, cy, rx, ry) { var t = Math.sqrt((i + .6) / 55.6), a = i * 2.39996 + .9; return [cx + Math.cos(a) * rx * t, cy + Math.sin(a) * ry * t]; }

/* ════════════ 2. A GYEREK KERTJE: tövek a motor adataiból (a játék és a pult is ezt hívja) ════════════ */
var TV_AGY = { ok: "o", sd: "s" };   /* a motor ágyása → a kép ágyása (és színköre) */
var TV_SORREND = {};
/* a családok helye a spirálon: a könnyűek középen (tenyNehez — a motor új tényeinek sorrendje), egyenlőnél a kisebb elöl.
   Állandó (nem függ a gyerek tudásától), így egy tő helye mindig ugyanaz. */
function tvSorrend(agy) {
  if (TV_SORREND[agy]) return TV_SORREND[agy];
  var l = tenyCsaladok(agy).map(function (c) { return { c: c, n: tenyNehez(c.tenyek[0]) }; });
  l.sort(function (x, y) { return x.n - y.n || (x.c.a + x.c.b) - (y.c.a + y.c.b) || x.c.a - y.c.a; });
  return (TV_SORREND[agy] = l.map(function (x) { return x.c; }));
}
/* kert = P().tenyKert (vagy a pultnak a gyerekéé) → az ágyás 55 töve: { i, kulcs, cs, forma, mag, tenyek: [{ kulcs, k, f, nyilik }] } */
function tenyKertTovek(agy, kert, ma) {
  kert = kert || {}; ma = ma == null ? tenyNap() : ma;
  var v = kert.v || {}, gy = kert.gy || "uc", op = TV_AGY[agy], lat = (kert.lg || {})[agy] || 0;
  return tvSorrend(agy).map(function (cs, i) {
    var kulcs = cs.tenyek[0], forma = ktHash(kulcs + "#" + gy) % VIRAG_FORMAK.length, arny = toArnyalatok(kulcs, gy, cs.tenyek.length);
    return { i: i, kulcs: kulcs, cs: cs, forma: forma, mag: ktHash(kulcs + gy),
      tenyek: cs.tenyek.map(function (k, j) {
        var r = v[k], f = tenyViragFazis(r, ma);
        return { kulcs: k, k: viragKinezet(k, gy, op, forma, arny[j]), f: f, nyilik: f === 3 && (r.g || 0) > lat };
      }) };
  });
}
function tvVanValami(to) { return to.tenyek.some(function (t) { return t.f > 0; }); }

/* ════════════ 3. A JÁTÉKBAN: első belépés, távoli kép, belesétálás, közeli kép ════════════ */

/* az első belépés (kertNyit): a gyerek magja (a virágok kinézetéhez) + a meglévő tudás bimbóként (doboz ≥ 3). Ami már
   kihajtott, az is bimbó lesz; mind a következő gyakorlós napon nyílik (n = ma → aznap nem). Visszaad: hír-szöveg vagy null. */
function tenyKertBelep() {
  var K = tenyKertTar(), ma = tenyNap(), elso = !K.indult;
  if (!K.gy) K.gy = Math.random().toString(36).slice(2, 8);
  if (!K.lg || typeof K.lg !== "object") K.lg = {};
  if (!elso) return null;
  var T = tenyTar(false);
  tenyMind("ok").concat(tenyMind("sd")).forEach(function (k) { var s = T[k]; if (s && s.d >= 3 && !K.v[k]) K.v[k] = { a: 2, n: ma }; });
  var db = 0;
  Object.keys(K.v).forEach(function (k) { var r = K.v[k]; if (r.a < 3) { r.a = 2; r.n = ma; db++; } });
  K.indult = ma;
  ment();
  if (!db) return null;
  return db >= 3 ? "🌷 Nézd, mennyi bimbó a túlparton! Holnapra kinyílnak."
    : db === 2 ? "🌷 Nézd, két bimbó bújt ki a túlparton! Holnapra kinyílnak." : "🌷 Nézd, egy bimbó bújt ki a túlparton! Holnapra kinyílik.";
}
/* van-e kinyílt virág, amit a gyerek még nem látott közelről (a súgónak) */
function tenyKertUjVirag() {
  var K = tenyKertTar(), lg = K.lg || {}, van = false;
  Object.keys(K.v).forEach(function (k) { var r = K.v[k], agy = tenyAgyE(k); if (r.a === 3 && (r.g || 0) > (lg[agy] || 0)) van = true; });
  return van;
}

/* távolról: a két ágyás .kc-agy-virag csoportjába a tövek színes pöttyei (renderKert és az elforgatás után) */
var KERT_MINI = { f: 1.55, a: .95 };   /* a távoli tő-pötty mérete elrendezésenként */
function tenyKertTavol() {
  var svg = document.querySelector("#kert-szinter .kert-hatter"); if (!svg) return;
  var L = KERT_LAY[KERT_ORIENT], K = tenyKertTar(), ma = tenyNap(), m = KERT_MINI[KERT_ORIENT];
  ["ok", "sd"].forEach(function (agy) {
    var g = svg.querySelector('.kc-agyas[data-agy="' + TV_AGY[agy] + '"] .kc-agy-virag'); if (!g) return;
    var A = L.agy[TV_AGY[agy]], lst = [];
    tenyKertTovek(agy, K, ma).forEach(function (to) { if (tvVanValami(to)) lst.push([tvSpiral(to.i, A.cx, A.cy - 2, A.rx * .84, A.ry * .7), to]); });
    lst.sort(function (a, b) { return a[0][1] - b[0][1]; });
    g.innerHTML = lst.map(function (x) {
      var p = x[0], ds = (.82 + .36 * (p[1] - (A.cy - A.ry)) / (2 * A.ry)) * m;
      return '<g transform="translate(' + ktR(p[0]) + ' ' + ktR(p[1]) + ') scale(' + ktR(ds * 100) / 100 + ')">' + toMini(x[1]) + '</g>';
    }).join("");
  });
}

/* ── a színpad állapota: null = a fűben · "megy" = átsétál · "bent" = közeli kép · "vissza" = visszasétál ── */
var TVK = { allapot: null, agy: null, G: 0, kTovek: [], kux: 0, kuy: 0, zar: false, kedv: {} };
/* a közeli kép elrendezése (C2 rajzterv KLAY): az ágyás nagyban, uni = az unikornis mérete (a játék rajzán: 0,5 × 380 egység = 1) */
var TVK_KLAY = {
  f: { W: 1000, H: 620, agy: { cx: 500, cy: 390, rx: 446, ry: 176, irx: 398, iry: 146 }, T: 1.3, uni: 1.2, uniY0: 596, uniX0: 120, yHat: 214, yEl: 600, zoomTo: 2, minW: .4 },
  a: { W: 400, H: 660, agy: { cx: 200, cy: 410, rx: 194, ry: 184, irx: 170, iry: 158 }, T: .86, uni: .84, uniY0: 632, uniX0: 62, yHat: 226, yEl: 636, zoomTo: 2.4, minW: .55 }
};
var TVK_UNI_TALP = 8;   /* a játék unikornis-rajzán a paták ennyivel az origó alatt vannak (rajz-egység) */

/* a háttér-SVG (xMidYMax slice) → a színtér képpontjai */
function tvkTerkep(host) {
  var L = KERT_LAY[KERT_ORIENT], w = host.clientWidth || 1, h = host.clientHeight || 1, s = Math.max(w / L.W, h / L.H);
  return { s: s, ox: (w - L.W * s) / 2, oy: h - L.H * s, w: w, h: h };
}
function tvkHidPont(Hh, t) { var ym = (Hh.yF + Hh.yB) / 2 - 14, p = ktQ2([Hh.x, Hh.yF], [Hh.x, ym + 4], [Hh.x, Hh.yB], t); return [p[0], p[1]]; }
/* a távoli unikornis (a kerti doboz) a kép (x, y) pontján, mélység szerint kisebb, és a fű tárgyai mögé kerül */
function tvkDobozAllit(x, y) {
  var host = $("kert-szinter"), d = $("kert-uni-doboz"); if (!host || !d) return;
  var M = tvkTerkep(host), L = KERT_LAY[KERT_ORIENT], yB = L.hid.yB;
  var sc = Math.max(.42, Math.min(1, .5 + .5 * (y - yB) / Math.max(1, TVK.G - yB)));
  var px = M.ox + x * M.s, py = M.oy + y * M.s;
  d.style.left = ktR(px) + "px";
  d.style.bottom = ktR(M.h - py - KERT_UNI_TALP) + "px";
  d.style.transformOrigin = "50% calc(100% - " + KERT_UNI_TALP + "px)";
  d.style.transform = "scale(" + ktR(sc * 1000) / 1000 + ")";
  d.style.zIndex = Math.round((py + KERT_UNI_TALP) / M.h * 1000);
  TVK.ux = x; TVK.uy = y;
}
function tvkDobozVissza() {   /* a séta végén vissza a kert saját (CSS) helyére */
  var d = $("kert-uni-doboz"); if (!d) return;
  d.style.transition = "none"; d.style.transform = ""; d.style.transformOrigin = ""; d.style.bottom = "";
  d.style.left = KERT_UNI_X + "%"; d.style.zIndex = 870;
  void d.offsetWidth; d.style.transition = "";
}
/* a kert-kamera: a teljes jelenet (háttér, tárgyak, unikornis) ráközelít az ágyásra (op), vagy vissza (op = null) */
function tvkKamera(op, ms) {
  var kam = $("kert-kamera"), host = $("kert-szinter"); if (!kam || !host) return;
  if (nyugiMod()) ms = 0;
  kam.style.transition = ms ? "transform " + ms + "ms ease-in-out" : "none";
  if (!op) { kam.style.transform = ""; return; }
  var M = tvkTerkep(host), A = KERT_LAY[KERT_ORIENT].agy[op];
  var cx = M.ox + A.cx * M.s, cy = M.oy + (A.cy - 6) * M.s, z = Math.max(1, M.w / (A.rx * 2.5 * M.s));
  var tx = Math.max(M.w - z * M.w, Math.min(0, M.w / 2 - z * cx)), ty = Math.max(M.h - z * M.h, Math.min(0, M.h / 2 - z * cy));
  kam.style.transform = "translate(" + ktR(tx) + "px," + ktR(ty) + "px) scale(" + ktR(z * 1000) / 1000 + ")";
}
function tvkBentJel(be) { var k = $("kepernyo-kert"); if (k) k.classList.toggle("tvk-bent", !!be); }

/* ágyásra koppintás (kertSzinterKlikk, séta-módban): fű → híd → túlpart, közben ráközelít, aztán a közeli kép */
function tenyKertBesetal(op) {
  var host = $("kert-szinter"), doboz = $("kert-uni-doboz");
  if (!host || !doboz || TVK.allapot) return;
  if (KERT_UL || KERT_FEKSZIK) kertAll();
  hangGomb();
  TVK.allapot = "megy"; TVK.agy = op; tvkBentJel(true);
  var M = tvkTerkep(host), L = KERT_LAY[KERT_ORIENT], Hh = L.hid;
  var fx = KERT_UNI_X / 100 * M.w, fy = M.h * .87 - KERT_UNI_TALP;   /* a doboz alapja: bottom 13 % */
  var x0 = (fx - M.ox) / M.s, y0 = (fy - M.oy) / M.s;
  TVK.G = y0;
  var ut = [[x0, y0], [Hh.x, Math.min(y0, Hh.yF + 40)]];
  [0, .25, .5, .75, 1].forEach(function (t) { ut.push(tvkHidPont(Hh, t)); });
  ut.push(L.allo[op]);
  clearTimeout(doboz._jarTimer); kertLepesHang(false);
  doboz.style.transition = "none";
  tvkDobozAllit(x0, y0);
  kertSugo("Átsétálunk a hídon a virágokhoz… 🌸");
  uniUtvonal({ el: doboz, allit: tvkDobozAllit, egyseg: function () { return tvkTerkep(host).s; } }, ut, { ido: 2.8 }, function () {
    if (TVK.allapot !== "megy") return;
    uniFordul(doboz, op === "o" ? -1 : 1);
    tvkKamera(op, 1200);
    setTimeout(function () { if (TVK.allapot === "megy" && host.isConnected) tvkKozelNyit(op); }, nyugiMod() ? 0 : 1200);
  });
}

/* ── a közeli kép (egy ágyás) ── */
function tvkKozelHatter(K, f) {
  var W = K.W, H = K.H;
  var s = '<rect x="' + (-W) + '" y="' + (-H) + '" width="' + (3 * W) + '" height="' + (3 * H) + '" fill="url(#kcg-eg)"/>';
  s += f ? '<path d="M-1000 120 L0 120 Q200 82 420 104 T1000 96 L2000 96 V620 H-1000Z" fill="#d6eedf"/><path d="M-1000 150 L0 150 Q300 124 600 142 T1000 136 L2000 136 V620 H-1000Z" fill="url(#kcg-tav)"/>'
    : '<path d="M-400 120 L0 120 Q120 92 240 112 T400 104 L800 104 V660 H-400Z" fill="#d6eedf"/><path d="M-400 150 L0 150 Q140 132 260 146 T400 140 L800 140 V660 H-400Z" fill="url(#kcg-tav)"/>';
  s += f ? kertTajFa(70, 170, 1.3) + kertTajFa(930, 160, 1.1) + kertTajFuz(830, 180, .9) : kertTajFa(36, 170, .9) + kertTajFa(372, 160, .8);
  var gy = f ? 168 : 166;
  s += '<path d="M' + (-W) + ' ' + gy + ' L0 ' + gy + ' Q' + W / 2 + ' ' + (f ? 156 : 158) + ' ' + W + ' ' + (f ? 170 : 166) + ' L' + 2 * W + ' ' + (f ? 170 : 166) + ' V' + 2 * H + ' H' + (-W) + 'Z" fill="url(#kcg-koz)"/>';
  var py = H - (f ? 24 : 22);   /* lent a patak csücske */
  s += '<path d="M' + (-W) + ' ' + py + ' L0 ' + py + ' Q' + W * .3 + ' ' + (py - 6) + ' ' + W * .55 + ' ' + (py - 1) + ' T' + W + ' ' + (py - 4) + ' L' + 2 * W + ' ' + (py - 4) + ' V' + 2 * H + ' H' + (-W) + 'Z" fill="url(#kcg-viz)"/>' +
    '<path class="kc-hullam" d="M0 ' + (py + 9) + ' Q' + W * .3 + ' ' + (py + 4) + ' ' + W * .55 + ' ' + (py + 9) + ' T' + W + ' ' + (py + 6) + '" stroke="#f4fbff" stroke-width="2" fill="none"/>';
  return s;
}
function tvkToDs(K, y) { var Ag = K.agy; return K.T * (.76 + .48 * (y - (Ag.cy - Ag.iry)) / (2 * Ag.iry)); }
function tvkToG(q) {
  var K = TVK_KLAY[KERT_ORIENT], ds = tvkToDs(K, q.p[1]), kedv = TVK.kedv[q.to.i] || "alap";
  return '<g class="tv-to' + (kedv === "kuncog" ? " tv-hajol" : "") + '" data-i="' + q.to.i + '" data-y="' + ktR(q.p[1]) + '" transform="translate(' + ktR(q.p[0]) + ' ' + ktR(q.p[1]) + ') scale(' + ktR(ds * 100) / 100 + ')">' +
    '<ellipse cx="0" cy="1" rx="13" ry="3.6" fill="#4a2f18" opacity=".28"/>' + toRajz(q.to, { kedv: kedv, arc: true, fel: TVK.kux < q.p[0] ? -1 : 1 }) + '<circle cx="0" cy="-26" r="26" fill="transparent"/></g>';
}
function tvkToCsere(q) {
  var el = document.querySelector('#tvk-tovek .tv-to[data-i="' + q.to.i + '"]'); if (!el) return;
  var t = document.createElementNS("http://www.w3.org/2000/svg", "g"); t.innerHTML = tvkToG(q);
  el.parentNode.replaceChild(t.firstChild, el);
}
function tvkKozelSVG(op) {
  var f = KERT_ORIENT === "f", K = TVK_KLAY[KERT_ORIENT], Ag = K.agy, c = LENYEK[mentes.leny];
  var s = '<svg id="tvk-svg" viewBox="0 0 ' + K.W + ' ' + K.H + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + kertTajDefs() + tvkKozelHatter(K, f);
  s += '<ellipse cx="' + Ag.cx + '" cy="' + ktR(Ag.cy + Ag.ry * .6) + '" rx="' + (Ag.rx + 14) + '" ry="' + ktR(Ag.ry * .6) + '" fill="#2c5a1e" opacity=".14"/>';
  s += '<g filter="url(#kcg-firka)"><ellipse cx="' + Ag.cx + '" cy="' + Ag.cy + '" rx="' + Ag.rx + '" ry="' + Ag.ry + '" fill="url(#kcg-fold)"/>';
  for (var j = 1; j < 5; j++) s += '<ellipse cx="' + Ag.cx + '" cy="' + ktR(Ag.cy + 2) + '" rx="' + ktR(Ag.irx * j / 4.6) + '" ry="' + ktR(Ag.iry * j / 4.6) + '" fill="none" stroke="#8d6440" stroke-width="1.6" opacity=".35"/>';
  var N = Math.round(Ag.rx / (f ? 13 : 9));
  for (var i = 0; i < N; i++) {
    var a = i / N * Math.PI * 2, mm = .75 + .45 * (Math.sin(a) + 1) / 2;
    s += '<ellipse cx="' + ktR(Ag.cx + Math.cos(a) * Ag.rx) + '" cy="' + ktR(Ag.cy + Math.sin(a) * Ag.ry) + '" rx="' + ktR((f ? 16 : 11) * mm + ktHash(op + i) % 4) + '" ry="' + ktR((f ? 9.5 : 7) * mm + ktHash(i + op) % 3) + '" fill="url(#kcg-ko-' + op + ')" stroke="#b3a3a8" stroke-width=".8"/>';
  }
  s += '</g><g id="tvk-tovek">';
  TVK.kTovek.forEach(function (q) { s += tvkToG(q); });
  s += '<g id="tvk-uni-hely" data-y="0"><g id="tvk-uni" style="--dir:1;transform:scale(var(--dir,1),1)">' + unikornisSVG("tvk-uni-rajz", c, 1, P().oltozet) + '</g></g>';
  s += '</g><g stroke-linecap="round" fill="none">';
  (f ? [[40, 616], [300, 620], [640, 618], [960, 614]] : [[24, 656], [200, 660], [380, 654]]).forEach(function (b, i) {
    s += '<g transform="translate(' + b[0] + ' ' + b[1] + ')"><g class="kc-fuszal" style="animation-delay:-' + i * .5 + 's"><path d="M0 0 q-5 -16 -14 -24 M0 0 q-1 -22 3 -34 M0 0 q6 -14 15 -20" stroke="#4f9c3a" stroke-width="5"/></g></g>';
  });
  return s + '</g><g id="tvk-szikrak"></g></svg>';
}
/* a közeli unikornis: mélység szerint kisebb (hátul), a talppontja a (x, y)-on; a tövek közé sorolva */
function tvkUniSc(y) { var K = TVK_KLAY[KERT_ORIENT]; return K.uni * Math.max(.5, Math.min(1, .55 + .45 * (y - K.yHat) / (K.yEl - K.yHat))); }
function tvkUniAllit(x, y) {
  var h = $("tvk-uni-hely"); if (!h) return;
  var k = tvkUniSc(y);
  TVK.kux = x; TVK.kuy = y;
  h.setAttribute("transform", "translate(" + ktR(x) + " " + ktR(y - TVK_UNI_TALP * k) + ") scale(" + ktR(k * 1000) / 1000 + ")");
  h.setAttribute("data-y", ktR(y));
  var sz = h.parentNode, elotte = null;
  for (var c = sz.firstChild; c; c = c.nextSibling) if (c !== h && +c.getAttribute("data-y") > y) { elotte = c; break; }
  if (elotte) { if (h.nextSibling !== elotte) sz.insertBefore(h, elotte); } else if (sz.lastChild !== h) sz.appendChild(h);
}
function tvkEgyseg() { var s = $("tvk-svg"), m = s && s.getScreenCTM && s.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; }
function tvkUniMegy(cel, o, kesz) {
  var el = $("tvk-uni"); if (!el) return;
  uniUtvonal({ el: el, allit: tvkUniAllit, egyseg: tvkEgyseg }, [[TVK.kux, TVK.kuy]].concat(cel), o || {}, kesz);
}
/* a kép kerete a kinőtt tövekhez igazodik (a színtér arányában, hogy a slice ne vágjon le belőle) */
function tvkKeret(cx, cy, w) {
  var K = TVK_KLAY[KERT_ORIENT], host = $("kert-szinter"), asp = host ? (host.clientWidth || 1) / (host.clientHeight || 1) : K.W / K.H;
  w = Math.min(w, K.W, K.H * asp); var h = w / asp;
  return [Math.max(0, Math.min(K.W - w, cx - w / 2)), Math.max(0, Math.min(K.H - h, cy - h / 2)), w, h];
}
function tvkAlapKeret() {
  var K = TVK_KLAY[KERT_ORIENT], t = TVK.kTovek, host = $("kert-szinter"), asp = host ? (host.clientWidth || 1) / (host.clientHeight || 1) : K.W / K.H;
  if (!t.length) return tvkKeret(K.agy.cx, K.agy.cy - 20, K.W);
  var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  t.forEach(function (q) { x0 = Math.min(x0, q.p[0]); x1 = Math.max(x1, q.p[0]); y0 = Math.min(y0, q.p[1] - 70 * K.T); y1 = Math.max(y1, q.p[1]); });
  x0 = Math.min(x0, TVK.kux - 90 * tvkUniSc(TVK.kuy)); y1 = Math.max(y1, TVK.kuy + 10); y0 = Math.min(y0, TVK.kuy - 150 * tvkUniSc(TVK.kuy));
  var pad = K.W * .06, w = Math.max(K.W * K.minW, x1 - x0 + 2 * pad, (y1 - y0 + 2 * pad) * asp);
  return tvkKeret((x0 + x1) / 2, (y0 + y1) / 2, w);
}
/* a közeli kép kamerája: a viewBox lassú mozgatása */
function tvkNezet(cel, ms, kesz) {
  var svg = $("tvk-svg"); if (!svg) return;
  if (nyugiMod() || window.__UC_GYORS) ms = 0;
  var vb = svg.viewBox.baseVal, k = [vb.x, vb.y, vb.width, vb.height], t0 = performance.now(), fut = svg._nezet = {};
  if (!ms) { svg.setAttribute("viewBox", cel.map(ktR).join(" ")); if (kesz) kesz(); return; }
  requestAnimationFrame(function lep(t) {
    if (svg._nezet !== fut || !svg.isConnected) return;
    var u = Math.min(1, (t - t0) / ms), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    svg.setAttribute("viewBox", k.map(function (v, i) { return ktR(v + (cel[i] - v) * e); }).join(" "));
    if (u < 1) requestAnimationFrame(lep); else if (kesz) kesz();
  });
}
function tvkGombok(op) {
  return '<div class="tvk-gombok"><button type="button" id="tvk-vissza">⤺ <span class="tvk-hosszu">Vissza a kertbe</span><span class="tvk-rovid">Vissza</span></button>' +
    '<button type="button" id="tvk-masik">' + (op === "o" ? "A lila ágyás ▶" : "◀ A rózsaszín ágyás") + '</button></div>';
}
function tvkKozelNyit(op) {
  var host = $("kert-szinter"); if (!host) return;
  var regi = $("tvk-kozel"); if (regi) regi.parentNode.removeChild(regi);
  var K = TVK_KLAY[KERT_ORIENT], Ag = K.agy, agy = op === "o" ? "ok" : "sd", Kt = tenyKertTar();
  TVK.agy = op; TVK.kedv = {}; TVK.zar = false;
  TVK.kTovek = tenyKertTovek(agy, Kt).filter(tvVanValami)
    .map(function (to) { return { to: to, p: tvSpiral(to.i, Ag.cx, Ag.cy - 6, Ag.irx, Ag.iry) }; })
    .sort(function (a, b) { return a.p[1] - b.p[1]; });
  /* az unikornis a virágok elé, balra áll */
  TVK.kux = K.uniX0; TVK.kuy = K.uniY0;
  if (TVK.kTovek.length) {
    var x0 = 1e9, y1 = -1e9; TVK.kTovek.forEach(function (q) { x0 = Math.min(x0, q.p[0]); y1 = Math.max(y1, q.p[1]); });
    TVK.kuy = Math.min(K.yEl - 4, y1 + (KERT_ORIENT === "f" ? 46 : 34)); TVK.kux = Math.max(80 * K.uni, x0 - (KERT_ORIENT === "f" ? 70 : 30));   /* a teste (balra ~75 egység) ne lógjon ki */
  }
  var d = document.createElement("div");
  d.id = "tvk-kozel"; d.className = "tvk-kozel uni-terep";
  d.innerHTML = tvkKozelSVG(op) + tvkGombok(op);
  host.appendChild(d);
  var el = $("tvk-uni");
  uniNezoAdat(el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  tvkUniAllit(TVK.kux, TVK.kuy);
  $("tvk-svg").setAttribute("viewBox", tvkAlapKeret().map(ktR).join(" "));
  d.onclick = tvkKozKlikk;
  $("tvk-vissza").onclick = function (e) { e.stopPropagation(); tvkKozelZar(); };
  $("tvk-masik").onclick = function (e) { e.stopPropagation(); tvkMasikAgy(); };
  requestAnimationFrame(function () { d.classList.add("lathato"); });
  TVK.allapot = "bent";
  /* a nyílás jelenete: ami a legutóbbi látogatás óta nyílt, most bomlik ki (egyszer); az unikornis odafordul */
  var uj = TVK.kTovek.filter(function (q) { return q.to.tenyek.some(function (t) { return t.nyilik; }); });
  if (!Kt.lg) Kt.lg = {};
  Kt.lg[agy] = gyakNap(); ment();
  if (uj.length) {
    var q = uj[0];
    kertSugo("Nézd, kinyílik! Vajon milyen lesz? 🌸");
    uniFordul(el, TVK.kux < q.p[0] ? 1 : -1);
    setTimeout(function () { if (TVK.allapot === "bent") tvkNezet(tvkKeret(q.p[0], q.p[1] - 30 * K.T, K.W / 1.6), 900); }, 450);
    setTimeout(function () { if (TVK.allapot === "bent" && !TVK.zar) { tvkNezet(tvkAlapKeret(), 900); kertSugo("Koppints egy virágra, és az unikornis megszagolja. 🌷"); } }, 3400);
    setTimeout(function () { uj.forEach(function (x) { x.to.tenyek.forEach(function (t) { t.nyilik = false; }); }); }, 2600);
    hangCsilla();
  }
  else if (!TVK.kTovek.length) kertSugo("Itt még csak a föld pihen. Figyeld, mi bújik majd ki belőle! 🌱");
  else if (TVK.kTovek.some(function (x) { return x.to.tenyek.some(function (t) { return t.f === 2; }); }) && Kt.indult === tenyNap()) kertSugo("Nézd, mennyi bimbó! Holnapra kinyílnak. 🌷");
  else kertSugo("Koppints egy virágra, és az unikornis megszagolja. 🌷");
}
/* a közeli képen: tőre koppintva odasétál és megszagolja; a földre koppintva odasétál */
function tvkKozKlikk(e) {
  e.stopPropagation();
  if (TVK.allapot !== "bent" || TVK.zar) return;
  var svg = $("tvk-svg"); if (!svg || e.target.closest("button")) return;
  var to = e.target.closest(".tv-to");
  if (to) { tvkSzagol(+to.getAttribute("data-i")); return; }
  var K = TVK_KLAY[KERT_ORIENT], Ag = K.agy, pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  var p = pt.matrixTransform(svg.getScreenCTM().inverse());
  var bent = Math.pow((p.x - Ag.cx) / Ag.rx, 2) + Math.pow((p.y - Ag.cy) / Ag.ry, 2) < 1.15;
  if (!bent && p.y < Ag.cy) return;
  tvkUniMegy([[Math.max(80 * K.uni, Math.min(K.W - 80 * K.uni, p.x)), Math.max(Ag.cy - Ag.iry * .6, Math.min(K.H - 30, p.y))]]);
}
function tvkSzagol(i) {
  var K = TVK_KLAY[KERT_ORIENT], q = null;
  TVK.kTovek.forEach(function (z) { if (z.to.i === i) q = z; });
  if (!q) return;
  var k = tvkUniSc(q.p[1] + 6), oldal = TVK.kux < q.p[0] ? -1 : 1;
  var cx = q.p[0] + oldal * 56 * k, cy = q.p[1] + 8, el = $("tvk-uni");
  TVK.zar = true; kertSugo("Odasétál… 🌷");
  tvkUniMegy([[cx, cy]], {}, function () {
    if (TVK.allapot !== "bent") return;
    uniFordul(el, -oldal, function () {
      if (TVK.allapot !== "bent") return;
      tvkNezet(tvkKeret((q.p[0] + cx) / 2, q.p[1] - 40 * K.T, K.W / K.zoomTo), 900);
      el.classList.remove("uni-mozd-szagol"); void el.getBoundingClientRect(); el.classList.add("uni-mozd-szagol");
      hangCsilla();
      setTimeout(function () {
        if (TVK.allapot !== "bent") return;
        TVK.kedv[i] = "kuncog"; tvkToCsere(q);
        kertSugo("Szipp-szipp… A virág kuncog, és meghajol! 🌸");
        tvkSzikraFel(q.p[0], q.p[1] - 56 * tvkToDs(K, q.p[1]));
      }, 550);
      setTimeout(function () { el.classList.remove("uni-mozd-szagol"); }, 1350);
      setTimeout(function () {
        if (TVK.allapot !== "bent") return;
        delete TVK.kedv[i]; tvkToCsere(q); TVK.zar = false;
        tvkNezet(tvkAlapKeret(), 900);
        kertSugo("Micsoda illat! Koppints egy másik virágra is. 🌷");
      }, 2400);
    });
  });
}
function tvkSzikraFel(x, y) {
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g"), cel = $("tvk-szikrak"); if (!cel) return;
  g.setAttribute("transform", "translate(" + ktR(x) + " " + ktR(y) + ") scale(2)");
  g.innerHTML = tvSzikrak().replace(/--k:[0-9.]+s/g, function () { return "--k:" + ktR(Math.random() * .3) + "s"; });
  cel.appendChild(g);
  setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 2200);
}
/* a másik ágyás: a kép elhalványul, és a másik ágyás jön (a távoli unikornis is átáll, hogy onnan sétáljon vissza) */
function tvkMasikAgy() {
  if (TVK.allapot !== "bent") return;
  hangGomb();
  var uj = TVK.agy === "o" ? "s" : "o", d = $("tvk-kozel");
  TVK.allapot = "megy"; TVK.zar = true;
  if (d) d.classList.remove("lathato");
  var L = KERT_LAY[KERT_ORIENT];
  tvkDobozAllit(L.allo[uj][0], L.allo[uj][1]); uniFordul($("kert-uni-doboz"), uj === "o" ? -1 : 1);
  tvkKamera(uj, 0);
  setTimeout(function () { if (TVK.allapot === "megy") tvkKozelNyit(uj); }, nyugiMod() ? 0 : 380);
}
/* vissza a kertbe: a kép eltávolodik, az unikornis visszasétál a hídon a fűre */
function tvkKozelZar() {
  if (TVK.allapot !== "bent") return;
  hangGomb();
  var d = $("tvk-kozel"), host = $("kert-szinter"), doboz = $("kert-uni-doboz");
  TVK.allapot = "vissza";
  if (d) { d.classList.remove("lathato"); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 450); }
  kertSugo("Vissza a hídon… 🚶");
  var L = KERT_LAY[KERT_ORIENT], Hh = L.hid, M = tvkTerkep(host), f = KERT_ORIENT === "f";
  var ut = [[TVK.ux, TVK.uy]];
  [1, .75, .5, .25, 0].forEach(function (t) { ut.push(tvkHidPont(Hh, t)); });
  ut.push([Hh.x, Hh.yF + 40]);
  var vx = Hh.x + (f ? 90 : 50);
  ut.push([vx, TVK.G]);
  setTimeout(function () {
    if (TVK.allapot !== "vissza") return;
    tvkKamera(null, 1100);
    uniUtvonal({ el: doboz, allit: tvkDobozAllit, egyseg: function () { return tvkTerkep(host).s; } }, ut, { ido: 2.6 }, function () {
      if (TVK.allapot !== "vissza") return;
      KERT_UNI_X = Math.max(13, Math.min(87, (M.ox + vx * M.s) / M.w * 100));
      tvkDobozVissza();
      TVK.allapot = null; tvkBentJel(false);
      kertSugo(KERT_SUGO_SETA);
    });
  }, nyugiMod() ? 0 : 350);
}
/* kilépés / újrarajzolás: minden vissza alaphelyzetbe (a DOM újraépül) */
function tenyKertAlaphelyzet() {
  var d = $("kert-uni-doboz"); if (d) uniUtvonalAll(d);
  TVK.allapot = null; TVK.zar = false; TVK.kedv = {};
  tvkBentJel(false);
}

/* ════════════ 4. AZ ÖSVÉNY VÉGÉN: a kert híre (palyaVege, ftVege) ════════════
   hajtDb = ennyi új hajtás bújt ki ezen az ösvényen. Visszaad: { html, mondat } vagy null. A nyílás híre egyszer szól. */
function tvDb(n) { return ["", "Egy", "Két", "Három", "Négy", "Öt", "Hat", "Hét", "Nyolc", "Kilenc", "Tíz"][n] || String(n); }
function tenyKertPalyaHir(hajtDb) {
  var K = tenyKertTar(), ma = tenyNap(), sor = [];
  if (K.hir && K.hir.nap === ma && K.hir.nyilt && !K.hir.mondva) {
    K.hir.mondva = 1;
    sor.push("🌸 " + tvDb(K.hir.nyilt) + " új virág nyílt a kertedben!");
  }
  if (hajtDb) sor.push("🌱 Új hajtás bújt ki a kertedben!");
  if (!sor.length) return null;
  return { html: sor.map(function (x) { return '<br><span style="color:#3f9e6a;font-weight:800">' + x + '</span>'; }).join(""),
    mondat: " " + sor.join(" ").replace(/[🌸🌱]/g, "").replace(/\s+/g, " ").trim() };
}

/* ════════════ 5. A PULT: „a gyerek kertje” (admin/index.html, 🌸 Tények fül) ════════════
   Egy ágyás közelről, a gyerek virágaival (arc nélkül, mozdulatlanul). cim(to) → a tő buboréka (melyik család, mi nyílt). */
function tenyKertPultSVG(kert, agy, cim) {
  var K = TVK_KLAY.f, Ag = K.agy, op = TV_AGY[agy];
  var lst = tenyKertTovek(agy, kert).map(function (to) { to.tenyek.forEach(function (t) { t.nyilik = false; }); return { to: to, p: tvSpiral(to.i, Ag.cx, Ag.cy - 6, Ag.irx, Ag.iry) }; })
    .sort(function (a, b) { return a.p[1] - b.p[1]; });
  var s = '<svg class="tv-pult" viewBox="40 150 920 450" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<radialGradient id="tvp-fold-' + op + '" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#a87a4e"/><stop offset="1" stop-color="#7a5230"/></radialGradient></defs>' +
    '<rect x="40" y="150" width="920" height="450" rx="18" fill="#cfeebb"/>' +
    '<ellipse cx="' + Ag.cx + '" cy="' + Ag.cy + '" rx="' + Ag.rx + '" ry="' + Ag.ry + '" fill="url(#tvp-fold-' + op + ')" stroke="' + (op === "o" ? "#e4b7c6" : "#c4b8dc") + '" stroke-width="10"/>';
  lst.forEach(function (q) {
    var ds = tvkToDs(K, q.p[1]), van = tvVanValami(q.to);
    s += '<g transform="translate(' + ktR(q.p[0]) + ' ' + ktR(q.p[1]) + ') scale(' + ktR(ds * 100) / 100 + ')"><title>' + (cim ? cim(q.to) : q.to.kulcs) + '</title>' +
      (van ? '<ellipse cx="0" cy="1" rx="13" ry="3.6" fill="#4a2f18" opacity=".28"/>' + toRajz(q.to, {}) : '<circle r="3" fill="#6a4628" opacity=".55"/>') +
      '<circle cx="0" cy="-20" r="22" fill="transparent"/></g>';
  });
  return s + '</svg>';
}

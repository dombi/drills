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
   • 5. kör (gondozás, lent a 6. részben): jókedvűen szomjas virágok (igeny(K.loc) → jol/szomj1/szomj2), 💧 locsolás
     esőfelhővel (naponta egyszer, 1 💧 az egész kertnek), üdvözlés (K.bent), napi meglepetés (látogató / part menti
     apróság → a Kincsvitrin új polca, P().tenyKert.kincs), pillangó a kertkapun (tenyKertVar). Soha hervadás, bűntudat.
   • 6. kör (ritka mag, lent a 3c. részben): az első mag ajándék, gyakorlós napokon érik a dombon (erik), a fajta titok;
     a kinyílt ritka virág a dombon marad, és a Kincsvitrin „Ritka virágok” polcára kerül; a következő mag a parton vár. */

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
  TVK.elso = true;   /* az első napon nincs üdvözlés: ott a bimbók a hír */
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
  tvRitkaTavol(svg);                     /* 🌰 a domb: az érő ritka mag + a kinyílt ritka virágok (6. kör) */
  tvkMeglepRajzol();
}

/* ── a színpad állapota: null = a fűben · "megy" = átsétál · "bent" = közeli kép · "vissza" = visszasétál ── */
var TVK = { allapot: null, agy: null, G: 0, kTovek: [], kux: 0, kuy: 0, zar: false, kedv: {}, kozos: null, elso: false, udvKozel: false };
/* a közeli kép elrendezése (C2 rajzterv KLAY): az ágyás nagyban, uni = az unikornis mérete (a játék rajzán: 0,5 × 380 egység = 1) */
var TVK_KLAY = {
  f: { W: 1000, H: 620, agy: { cx: 500, cy: 390, rx: 446, ry: 176, irx: 398, iry: 146 }, T: 1.3, uni: 1.2, uniY0: 596, uniX0: 120, yHat: 214, yEl: 600, zoomTo: 2, minW: .4 },
  a: { W: 400, H: 660, agy: { cx: 200, cy: 410, rx: 194, ry: 184, irx: 170, iry: 158 }, T: .86, uni: .84, uniY0: 632, uniX0: 62, yHat: 226, yEl: 636, zoomTo: 2.4, minW: .55 }
};
var TVK_UNI_TALP = 8;   /* a játék unikornis-rajzán a paták ennyivel az origó alatt vannak (rajz-egység) */

/* a háttér-SVG → a színtér képpontjai (ugyanaz a kivágás, mint a képen: kert-tajkep.js kertTajNezet) */
function tvkTerkep(host) { return kertTajNezet(host); }
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
  var M = tvkTerkep(host), L = KERT_LAY[KERT_ORIENT], d = op === "d", A = d ? L.domb : L.agy[op];   /* d = a csodaágyás-domb (6. kör) */
  var cx = M.ox + A.cx * M.s, cy = M.oy + (d ? A.cy - A.ry : A.cy - 6) * M.s, z = Math.max(1, M.w / (A.rx * (d ? 5 : 2.5) * M.s));
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
  clearTimeout(TVK.hirT);                   /* a még sorban álló hírek elmaradnak: a közeli képen eltakarnák a gombokat */
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
  kertSugo(op === "d" ? "Átsétálunk a hídon a dombhoz… 🌰" : "Átsétálunk a hídon a virágokhoz… 🌸");
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
/* a tő kedve: egyéni (kuncog) > közös jelenet (koszon, kortyol, tancol) > a szomjúság (jol / szomj1 / szomj2) */
var TVK_KEDV_OSZTALY = { kuncog: " tv-hajol", koszon: " tv-integet", kortyol: " tv-kortyol", tancol: " tv-tancol", szomj2: " tv-nyujtozik" };
function tvkToG(q) {
  var K = TVK_KLAY[KERT_ORIENT], ds = tvkToDs(K, q.p[1]), kedv = TVK.kedv[q.to.i] || TVK.kozos || tvkKedvAlap();
  return '<g class="tv-to' + (TVK_KEDV_OSZTALY[kedv] || "") + '" data-i="' + q.to.i + '" data-y="' + ktR(q.p[1]) + '" transform="translate(' + ktR(q.p[0]) + ' ' + ktR(q.p[1]) + ') scale(' + ktR(ds * 100) / 100 + ')">' +
    '<ellipse cx="0" cy="1" rx="13" ry="3.6" fill="#4a2f18" opacity=".28"/>' + toRajz(q.to, { kedv: kedv === "kortyol" || kedv === "tancol" ? "jol" : kedv, arc: true, fel: TVK.kux < q.p[0] ? -1 : 1 }) + '<circle cx="0" cy="-26" r="26" fill="transparent"/></g>';
}
function tvkTovekUjra() { TVK.kTovek.forEach(tvkToCsere); }
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
  return s + '</g><g id="tvk-szikrak"></g><g id="tvk-eso"></g><g id="tvk-lepkek"></g></svg>';
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
  if (op === "d") return '<div class="tvk-gombok"><button type="button" id="tvk-vissza">⤺ <span class="tvk-hosszu">Vissza a kertbe</span><span class="tvk-rovid">Vissza</span></button></div>';
  return '<div class="tvk-gombok"><button type="button" id="tvk-vissza">⤺ <span class="tvk-hosszu">Vissza a kertbe</span><span class="tvk-rovid">Vissza</span></button>' +
    '<button type="button" id="tvk-masik">' + (op === "o" ? "A lila ágyás ▶" : "◀ A rózsaszín ágyás") + '</button></div>' +
    '<div class="tvk-also" id="tvk-also">' + tvkLocsolGomb() + '</div>';
}
function tvkKozelNyit(op) {
  if (op === "d") { tvkDombNyit(); return; }   /* a csodaágyás-domb (3c. rész) */
  var host = $("kert-szinter"); if (!host) return;
  var regi = $("tvk-kozel"); if (regi) regi.parentNode.removeChild(regi);
  var K = TVK_KLAY[KERT_ORIENT], Ag = K.agy, agy = op === "o" ? "ok" : "sd", Kt = tenyKertTar();
  TVK.agy = op; TVK.kedv = {}; TVK.kozos = null; TVK.zar = false;
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
  tvkLocsolBekot();
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
    setTimeout(function () { if (TVK.allapot === "bent" && !TVK.zar) { tvkNezet(tvkAlapKeret(), 900); kertSugo(tvkSzomjasE() ? "A virágok szomjasak, de nagyon vidámak. Meglocsoljuk őket? 💧" : "Koppints egy virágra, és az unikornis megszagolja. 🌷"); } }, 3400);
    setTimeout(function () { uj.forEach(function (x) { x.to.tenyek.forEach(function (t) { t.nyilik = false; }); }); }, 2600);
    hangCsilla();
  }
  else if (!TVK.kTovek.length) kertSugo("Itt még csak a föld pihen. Figyeld, mi bújik majd ki belőle! 🌱");
  else if (TVK.udvKozel) {   /* aznap először jön közel (és legalább egy nap telt el): a virágok integetnek */
    TVK.udvKozel = false; TVK.kozos = "koszon"; tvkTovekUjra();
    kertSugo(tvkSzomjasE() ? "A virágok integetnek! Szomjasak, de nagyon vidámak. Meglocsoljuk őket? 💧" : "A virágok integetnek, és nyújtózkodnak! 👋");
    setTimeout(function () {
      if (TVK.allapot !== "bent" || TVK.kozos !== "koszon") return;
      TVK.kozos = null; tvkTovekUjra();
      kertSugo(tvkSzomjasE() ? "A virágok szomjasak, de nagyon vidámak. Meglocsoljuk őket? 💧" : "Koppints egy virágra, és az unikornis megszagolja. 🌷");
    }, 3800);
  }
  else if (tvkSzomjasE()) kertSugo("A virágok szomjasak, de nagyon vidámak. Meglocsoljuk őket? 💧");
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
      var mg = tvkMeglepLathato(tenyKertTar());
      kertSugo(mg && !mg.kesz ? (mg.tip !== "latogato" ? "Valami csillog a parton! Koppints rá! 🎁" : "Valaki vár a kertben! Koppints rá! 🎁") : KERT_SUGO_SETA);
    });
  }, nyugiMod() ? 0 : 350);
}
/* kilépés / újrarajzolás: minden vissza alaphelyzetbe (a DOM újraépül) */
function tenyKertAlaphelyzet() {
  var d = $("kert-uni-doboz"); if (d) uniUtvonalAll(d);
  TVK.allapot = null; TVK.zar = false; TVK.kedv = {}; TVK.kozos = null;
  tvkBentJel(false);
}

/* ════════════ 3b. GONDOZÁS (Tamagocsi-kert 5. kör) ════════════
   Jókedvűen szomjas virágok, 💧 locsolás esőfelhővel, üdvözlés, napi meglepetés, pillangó a kertkapun.
   Közös alap: gondozas.js (igeny, meglepetesSor). Mentés: P().tenyKert.loc (utolsó locsolás napja), .bent (utolsó
   kerti látogatás napja), .meg / .megSz (a napi meglepetés), .kincs (a felvett part menti apróságok → Kincsvitrin).
   Tiltólista: nincs hervadás, büntetés, „hiányoztál” — a szomjúság semmire nem hat, csak kedves kérés. */
var TVK_LOCSOL_AR = 1;   /* 💧 naponta egyszer, az egész kertnek (jóváhagyva, 4.) */
function tvkSzomj() { return igeny(tenyKertTar().loc); }                     /* 0 jóllakott · 1 kicsit · 2 nagyon (és sosem rosszabb) */
function tvkKedvAlap() { return ["jol", "szomj1", "szomj2"][tvkSzomj()]; }
function tvkVanVirag(K) { K = K || tenyKertTar(); var ma = tenyNap(); return Object.keys(K.v).some(function (k) { return tenyViragFazis(K.v[k], ma) === 3; }); }
function tvkSzomjasE() { return tvkSzomj() > 0 && tvkVanVirag(); }

/* ── locsolás (a közeli kép alján) ── */
function tvkLocsolGomb() {
  if (!TVK.kTovek.length) return "";
  if (tenyKertTar().loc === tenyNap()) return '<span class="tvk-locsol-kesz">Ma már jóllaktak. Holnap újra örülnek a harmatnak! 💚</span>';
  if ((P().tunderharmat || 0) < TVK_LOCSOL_AR) return '<span class="tvk-locsol-kesz">Egy ösvény után lesz harmatod, és akkor locsolhatunk! 💧</span>';
  return '<button type="button" id="tvk-locsol" class="tvk-locsol">💧 Locsolás</button>';
}
function tvkLocsolBekot() { var b = $("tvk-locsol"); if (b) b.onclick = function (e) { e.stopPropagation(); tvkLocsol(); }; }
function tvkLocsolFrissit() { var a = $("tvk-also"); if (a) { a.innerHTML = tvkLocsolGomb(); tvkLocsolBekot(); } }
function tvkSvgPont(x, y) { var svg = $("tvk-svg"), pt = svg.createSVGPoint(); pt.x = x; pt.y = y; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
/* 💧 a fejléc számlálójából a szarvba száll → esőfelhő → a virágok kortyolnak → táncolnak, jönnek a lepkék */
function tvkLocsol() {
  if (TVK.allapot !== "bent" || TVK.zar) return;
  var K = tenyKertTar(), ma = tenyNap();
  if (K.loc === ma || (P().tunderharmat || 0) < TVK_LOCSOL_AR) { tvkLocsolFrissit(); return; }
  TVK.zar = true; hangGomb();
  P().tunderharmat -= TVK_LOCSOL_AR; K.loc = ma;   /* rögtön mentjük: ha közben kilép, se kétszer, se elveszve */
  vasarlasNaplo("tenyKertLocsol", TVK_LOCSOL_AR, "tunderharmat"); ment();
  var a = $("tvk-also"); if (a) a.innerHTML = "";
  var uni = $("tvk-uni"), szarv = uni && uni.querySelector('polygon[points^="190,"]'), cr = (szarv || uni).getBoundingClientRect();
  var sx = cr.left + cr.width / 2, sy = cr.top + 2, h = $("kert-harmat"), fr = h ? h.getBoundingClientRect() : { left: sx, top: 0 };
  if (h) h.textContent = P().tunderharmat;
  var c = document.createElement("span"); c.className = "tvk-repulo"; c.textContent = "💧";
  c.style.left = ktR(fr.left) + "px"; c.style.top = ktR(fr.top - 4) + "px"; document.body.appendChild(c);
  requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.transform = "translate(" + ktR(sx - fr.left - 12) + "px," + ktR(sy - fr.top - 8) + "px) scale(.7)"; }); });
  kertSugo("A harmat a szarvba száll… ✨");
  var gy = nyugiMod() || window.__UC_GYORS ? .3 : 1, bent = function () { return TVK.allapot === "bent"; };
  setTimeout(function () {
    c.style.opacity = "0"; setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 300);
    if (!bent()) return;
    var pt = tvkSvgPont(sx, sy); tvkSzikraFel(pt.x, pt.y); hangCsilla();
    tvkFelho(); kertSugo("Esik a harmat! 🌧️");
    setTimeout(function () { if (!bent()) return; TVK.kozos = "kortyol"; tvkTovekUjra(); kertSugo("Kortyolnak… 💧"); }, 1700 * gy);
    setTimeout(function () {
      if (!bent()) return;
      var f = $("tvk-felho"); if (f) f.setAttribute("class", "tv-felho-ki");
      TVK.kozos = "tancol"; tvkTovekUjra(); tvkLepkekBe(); hangCsilla();
      kertSugo("Táncolnak, és jönnek a lepkék! 🦋");
    }, 3200 * gy);
    setTimeout(function () {
      if (!bent()) return;
      var e = $("tvk-eso"); if (e) e.innerHTML = "";
      TVK.kozos = null; tvkTovekUjra(); TVK.zar = false; tvkLocsolFrissit();
      kertSugo("Jóllaktak, és nagyon boldogok. 💚");
    }, 6200 * gy);
  }, 1050 * gy);
}
function tvkFelho() {
  var svg = $("tvk-svg"), eso = $("tvk-eso"); if (!svg || !eso) return;
  var vb = svg.viewBox.baseVal, K = TVK_KLAY[KERT_ORIENT], fx = vb.x + vb.width / 2, fy = vb.y + vb.height * .16, m = vb.width / K.W * (KERT_ORIENT === "f" ? 1.6 : 1.3);
  var s = '<g transform="translate(' + ktR(fx) + ' ' + ktR(fy) + ') scale(' + ktR(m * 100) / 100 + ')"><g class="tv-felho-be" id="tvk-felho"><g fill="#fff" stroke="#cfe3f3" stroke-width="1.2"><ellipse cx="-30" cy="6" rx="34" ry="20"/><ellipse cx="22" cy="4" rx="38" ry="22"/><ellipse cx="-4" cy="-10" rx="32" ry="24"/></g><ellipse cx="-12" cy="-16" rx="14" ry="7" fill="#fff" opacity=".9"/>';
  for (var i = 0; i < 26; i++) s += '<path class="tv-esocsepp" style="animation-delay:' + ktR((i % 7) * .08) + 's;--esik:' + ktR(vb.height * .55 / m) + 'px" d="M' + (-60 + ((i * 37) % 120)) + ' 22 v8" stroke="#8fcff2" stroke-width="2.4" stroke-linecap="round"/>';
  eso.innerHTML = s + '</g></g>';
}
function tvLepkeRajz(c1, c2) { return '<path class="kc-sz1" d="M0 0 q-14 -12 -22 0 q8 12 22 5 Z" fill="' + c1 + '"/><path class="kc-sz2" d="M0 0 q14 -12 22 0 q-8 12 -22 5 Z" fill="' + c2 + '"/><circle r="2.6" fill="#4a3f6b"/>'; }
function tvkLepkekBe() {
  var svg = $("tvk-svg"), g = $("tvk-lepkek"); if (!svg || !g) return;
  var vb = svg.viewBox.baseVal, m = vb.width / TVK_KLAY[KERT_ORIENT].W * (KERT_ORIENT === "f" ? 1.3 : 1.1), s = "";
  [["#ff9ec4", "#b6a7f2"], ["#ffd36b", "#ff9e7a"], ["#9ed6f0", "#c9a8e6"]].forEach(function (c, i) {
    s += '<g transform="translate(' + ktR(vb.x + vb.width * (.25 + i * .25)) + ' ' + ktR(vb.y + vb.height * (.3 + (i % 2) * .15)) + ') scale(' + ktR(m * 100) / 100 + ')"><g class="' + (i % 2 ? "kc-lepke2" : "kc-lepke") + '" style="animation-delay:-' + ktR(i * 1.3) + 's">' + tvLepkeRajz(c[0], c[1]) + '</g></g>';
  });
  g.innerHTML = s;
}

/* ── érkezés a kertbe (kertNyit): első nap a bimbók híre; egy nap után üdvözlés (a virágok integetnek, a hal kiugrik,
   a szitakötő odarepül); ugyanazon a napon csak egy biccentés. Utána a meglepetés híre. Az üdvözlés mindig ugyanolyan boldog. */
function tenyKertErkezik(bimboHir, ritkaHir) {
  var K = tenyKertTar(), ma = tenyNap(), regi = K.bent, elso = TVK.elso, hirek = [];
  TVK.elso = false; TVK.udvKozel = false;
  K.bent = ma; ment();
  var vanTo = Object.keys(K.v).length > 0;
  if (bimboHir) hirek.push(bimboHir);
  else if (!elso && typeof regi === "number" && regi < ma) {
    tvkUdvozles(); TVK.udvKozel = vanTo;
    hirek.push(tvkSzomjasE() ? "👋 Szia! A virágok integetnek. Szomjasak, de nagyon vidámak. Meglocsoljuk őket? 💧"
      : vanTo ? "👋 Szia! A virágok integetnek, a hal kiugrik, a szitakötő odarepül!" : "👋 Szia! A hal kiugrik, a szitakötő odarepül!");
  }
  else if (!elso && regi === ma) setTimeout(function () { if (!TVK.allapot) tvkAgyasJel("tv-biccent", 900); }, 500);
  if (ritkaHir) hirek.push(ritkaHir);   /* 🌰 az első ritka mag: ajándék (6. kör) */
  var mg = meglepetesVar(K) && tvkMeglepLathato(K);
  if (mg) hirek.push(mg.tip === "mag" ? "🌰 Nézd, egy új ritka mag vár a parton!" : "🎁 Valaki járt itt, amíg nem voltál! Nézd csak!");
  if (mg) kertSugo(mg.tip !== "latogato" ? "Valami csillog a parton! Koppints rá! 🎁" : "Valaki vár a kertben! Koppints rá! 🎁");
  else if (tenyKertUjVirag()) kertSugo("🌸 Új virág nyílt a túlparton! Koppints az ágyásra!");
  else if (ritkaHir) kertSugo("🌰 Koppints a dombra a két ágyás között: ott alszik a ritka mag!");
  else if (tvRitkaUj(K)) kertSugo(K.mag.kesz ? "✨ Kinyílt valami a dombon! Koppints rá!" : "🌱 A ritka mag továbbnőtt! Koppints a dombra!");
  else if (tvkSzomjasE()) kertSugo("A virágok szomjasak, de vidámak. Koppints az ágyásra, és meglocsoljuk! 💧");
  tvkHirSor(hirek);
}
/* a hírek egymás után (a kertHir szalagja), amíg a gyerek a kertben van */
function tvkHirSor(l) {
  var h = $("kert-hir"), t = h && h.classList.contains("lat") ? 6200 : 400, i = 0;
  clearTimeout(TVK.hirT);
  (function kov() {
    if (i >= l.length) return;
    TVK.hirT = setTimeout(function () { var k = $("kepernyo-kert"); if (!k || !k.classList.contains("aktiv")) return; kertHir(l[i++]); t = 6200; kov(); }, t);
  })();
}
function tvkAgyasJel(cls, ms) {
  Array.prototype.forEach.call(document.querySelectorAll("#kert-szinter .kc-agyas"), function (g) {
    g.classList.remove(cls); void g.getBoundingClientRect(); g.classList.add(cls);
    setTimeout(function () { g.classList.remove(cls); }, ms);
  });
}
function tvkUdvozles() {
  setTimeout(function () {
    if (TVK.allapot) return;
    tvkAgyasJel("tv-koszon", 2600);
    kertTajHalUgrik();
    var d = $("kert-uni-doboz"), host = $("kert-szinter"); if (!d || !host) return;
    var r = d.getBoundingClientRect(), hr = host.getBoundingClientRect(), M = tvkTerkep(host), dir = uniIrany(d) || 1;
    var px = r.left - hr.left + r.width * (dir > 0 ? .8 : .2), py = r.top - hr.top + r.height * .12;
    kertTajSzkOda((px - M.ox) / M.s, (py - M.oy) / M.s);
  }, nyugiMod() ? 0 : 700);
}

/* ── a napi meglepetés („amíg nem voltál itt”): adat-tábla, sorban, körbe (gondozas.js meglepetesSor).
   latogato: koppintásra köszön, és a nap végéig ott marad · kincs: az unikornis felveszi → a Kincsvitrin új polcára.
   A kincs csak egyszer jön (felt), utána a sor a többivel megy tovább. ── */
var TVK_MEGLEP = [
  { tip: "latogato", id: "katica" }, { tip: "kincs", id: "kavics" }, { tip: "latogato", id: "sun" }, { tip: "kincs", id: "kagylo" },
  { tip: "latogato", id: "csiga" }, { tip: "kincs", id: "toll" }, { tip: "latogato", id: "madar" }, { tip: "kincs", id: "uveggolyo" },
  { tip: "kincs", id: "makk" }, { tip: "kincs", id: "csillagko" }
];   /* + soron kívül: { tip: "mag", id: "mag" } — az új ritka mag, ha az előző kinyílt (tenyKertMeglepetes, 6. kör) */
TVK_MEGLEP.forEach(function (m) { if (m.tip === "kincs") m.felt = function (K) { return !(K.kincs && K.kincs[m.id]); }; });
var TVK_KINCSEK = ["kavics", "kagylo", "toll", "uveggolyo", "makk", "csillagko"];   /* a Kincsvitrin új polcának sorrendje */
var TVK_MEGLEP_HELY = {
  f: { katica: [172, 390], sun: [446, 410], csiga: [640, 398], madar: [530, 350], kavics: [318, 430], kagylo: [706, 422], toll: [392, 432], uveggolyo: [318, 430], makk: [392, 432], csillagko: [706, 422], mag: [588, 436] },
  a: { katica: [66, 394], sun: [164, 412], csiga: [300, 404], madar: [214, 358], kavics: [120, 438], kagylo: [322, 430], toll: [262, 442], uveggolyo: [120, 438], makk: [262, 442], csillagko: [322, 430], mag: [244, 450] }
};
var TVK_MEGLEP_SZOVEG = {
  katica: "🐞 Katica: „Szia! Ma itt napozom a tavirózsán.”", sun: "🦔 Sün: „Pszt, csak szundítok a híd alatt. Szia!”",
  csiga: "🐌 Csiga: „Lassan értem ide, de megérte!”", madar: "🐦 Madárka: „Csip-csip! Szép a kerted!”",
  kavics: "✨ Egy csillogó kavics! „Ezt elteszem!” A Kincsvitrin új polcára kerül.", kagylo: "🐚 Egy kagyló sodródott a partra! „Ezt elteszem!” A Kincsvitrin új polcára kerül.",
  toll: "🪶 Egy rózsaszín toll! „Ezt elteszem!” A Kincsvitrin új polcára kerül.", uveggolyo: "🔮 Egy kék üveggolyó csillan a fűben! „Ezt elteszem!” A Kincsvitrin új polcára kerül.",
  makk: "🌰 Egy aranyló makk! „Ezt elteszem!” A Kincsvitrin új polcára kerül.", csillagko: "⭐ Egy csillag alakú kavics! „Ezt elteszem!” A Kincsvitrin új polcára kerül.",
  mag: "🌰 Egy új ritka mag! „Elültetem a dombon!” Vajon mi lesz belőle?"
};
function tvMeglepRajz(id) {
  var s = "", i, a, x, y, rr;
  switch (id) {
    case "mag": return '<ellipse cx="0" cy="0" rx="8" ry="2" fill="#2c5a1e" opacity=".2"/><circle class="tvr-dereng" cx="0" cy="-6" r="10" fill="#fff6c2" opacity=".6"/><ellipse cx="0" cy="-5" rx="5.2" ry="4.2" fill="#9a6b42" stroke="#6a4424" stroke-width=".7"/><path d="M-2.2 -7.4 Q0 -9 2.4 -7" stroke="#c99a6a" stroke-width=".9" fill="none"/>' + tvCsillam(6, -12, 4.6) + tvCsillam(-7, -9, 3.4);
    case "katica": return '<ellipse cx="0" cy="-4" rx="6.4" ry="5" fill="#ff5a5a" stroke="#7a1f1f" stroke-width=".8"/><path d="M0 -9 V1" stroke="#7a1f1f" stroke-width=".8"/><circle cx="-2.6" cy="-5" r="1.2" fill="#2a1a1a"/><circle cx="2.6" cy="-3" r="1.2" fill="#2a1a1a"/><circle cx="-2" cy="-1.4" r=".9" fill="#2a1a1a"/><circle cx="6.6" cy="-5.4" r="2.8" fill="#2a1a1a"/><circle cx="7.4" cy="-6" r=".7" fill="#fff"/><circle cx="-3" cy="-7" r="1.4" fill="#fff" opacity=".5"/>';
    case "sun":
      for (i = 0; i < 11; i++) { a = tvRad(-170 + i * 16); x = Math.cos(a) * 12; y = Math.sin(a) * 10; s += '<path d="M' + ktP(x * .6, y * .6 - 1, "L", x * 1.18, y * 1.18 - 1, "L", Math.cos(a + .2) * 12 * .6, Math.sin(a + .2) * 10 * .6 - 1) + 'Z" fill="#8a6a4a"/>'; }
      return '<ellipse cx="0" cy="0" rx="14" ry="3" fill="#2c5a1e" opacity=".2"/>' + s + '<ellipse cx="0" cy="-5" rx="11" ry="7.6" fill="#a8845e"/><path d="M6 -6 C 12 -6 15 -3 16 -1 C 13 0 8 0 5 -2Z" fill="#f3dcc0"/><circle cx="16" cy="-1.2" r="1.4" fill="#2a1a1a"/><circle cx="9.6" cy="-5" r="1.2" fill="#2a1a1a"/><circle cx="10" cy="-5.4" r=".4" fill="#fff"/><ellipse cx="8.6" cy="-2.6" rx="1.4" ry=".9" fill="#ff9fb4" opacity=".7"/>';
    case "csiga": return '<ellipse cx="2" cy="0" rx="12" ry="2.4" fill="#2c5a1e" opacity=".18"/><path d="M-10 0 C -10 -3 4 -4 12 -2 C 14 -6 13 -10 12 -12 M 12 -2 C 15 -6 16 -9 17 -11" stroke="#b9d68e" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="12" cy="-12.6" r="1.3" fill="#3a3a2a"/><circle cx="17" cy="-11.6" r="1.3" fill="#3a3a2a"/><circle cx="-1" cy="-8" r="8" fill="#f7c59f" stroke="#b97a4a" stroke-width="1"/><path d="M-1 -8 m0 -5 a5 5 0 1 1 -4.6 3 a3 3 0 1 1 3 3" stroke="#b97a4a" stroke-width="1.1" fill="none"/>';
    case "madar": return '<path d="M-9 -4 L-15 -1 L-9 0Z" fill="#7fb6e6"/><ellipse cx="0" cy="-5" rx="9" ry="7" fill="#9ec9f0"/><ellipse cx="1" cy="-3" rx="6" ry="4.4" fill="#e9f5ff"/><circle cx="6" cy="-12" r="5.6" fill="#9ec9f0"/><path d="M11 -12.6 L 15 -11.6 L 11 -10.4Z" fill="#ffb03a"/><circle cx="7.6" cy="-13" r="1.2" fill="#2a1a1a"/><circle cx="7.9" cy="-13.4" r=".4" fill="#fff"/><path d="M-6 -7 Q -1 -11 4 -7" fill="#7fb6e6"/><path d="M-1 2 V5 M2 2 V5" stroke="#d99a3a" stroke-width="1"/>';
    case "kavics": return '<ellipse cx="0" cy="0" rx="10" ry="2.2" fill="#2c5a1e" opacity=".2"/><path d="M-9 -2 C -9 -8 9 -9 9 -3 C 9 1 -9 2 -9 -2Z" fill="#bcc7e6" stroke="#8d9ac0" stroke-width=".8"/><path d="M-5 -5 Q 0 -8 4 -6" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>' + tvCsillam(5, -9, 5);
    case "kagylo":
      s = '<ellipse cx="0" cy="0" rx="10" ry="2.2" fill="#2c5a1e" opacity=".2"/><path d="M0 0 L -9 -6 C -8 -14 8 -14 9 -6Z" fill="#ffd9c7" stroke="#e0a08a" stroke-width=".8"/>';
      for (i = -3; i <= 3; i++) s += '<path d="M0 0 L' + ktR(i * 2.6) + ' -12" stroke="#e8b29e" stroke-width=".7"/>';
      return s + '<path d="M-2 0 h4 v2 h-4Z" fill="#f2b8a2"/>' + tvCsillam(-6, -12, 4.6);
    case "toll": return '<ellipse cx="0" cy="0" rx="12" ry="2" fill="#2c5a1e" opacity=".2"/><path d="M-12 -1 C -4 -12 8 -12 12 -8 C 6 -4 -4 -2 -12 -1Z" fill="#f7b8d0" stroke="#d98aa8" stroke-width=".7"/><path d="M-13 0 Q 0 -6 12 -8" stroke="#c97a98" stroke-width=".9" fill="none"/>' + tvCsillam(6, -12, 4.4);
    case "uveggolyo": return '<ellipse cx="0" cy="0" rx="8" ry="2" fill="#2c5a1e" opacity=".2"/><circle cx="0" cy="-6.5" r="6.5" fill="#8fd6ee" stroke="#4fa6cf" stroke-width=".8"/><path d="M-4 -4 C -2 -9 3 -9 4 -5 C 2 -7 -1 -7 -4 -4Z" fill="#c9a8e6"/><circle cx="-2.2" cy="-9" r="1.8" fill="#fff" opacity=".85"/>' + tvCsillam(5, -12, 4);
    case "makk": return '<ellipse cx="0" cy="0" rx="8" ry="2" fill="#2c5a1e" opacity=".2"/><path d="M-5.6 -7 C -6 -1 -3 1 0 1 C 3 1 6 -1 5.6 -7Z" fill="#ffcf5a" stroke="#c9922a" stroke-width=".8"/><path d="M-7 -7 C -7 -12 7 -12 7 -7 C 3 -6 -3 -6 -7 -7Z" fill="#a8743f" stroke="#7a5228" stroke-width=".8"/><path d="M0 -10.6 L 1.4 -13" stroke="#7a5228" stroke-width="1.4" stroke-linecap="round"/><path d="M-3 -5 Q -3.4 -2 -1.4 -.6" stroke="#fff3c4" stroke-width="1.2" fill="none"/>' + tvCsillam(6, -12, 4);
    case "csillagko":
      s = "M0 -14";
      for (i = 1; i <= 10; i++) { a = tvRad(i * 36); rr = i % 2 ? 3.6 : 8; s += " L" + ktR(Math.sin(a) * rr) + " " + ktR(-6 - Math.cos(a) * rr); }
      return '<ellipse cx="0" cy="0" rx="9" ry="2" fill="#2c5a1e" opacity=".2"/><path d="' + s + 'Z" fill="#ffc0cf" stroke="#e08aa2" stroke-width=".8" stroke-linejoin="round"/><circle cx="-1.6" cy="-8" r="1.3" fill="#fff" opacity=".8"/>' + tvCsillam(6, -13, 4);
  }
  return "";
}
/* a gyakPalyaVege hívja (a nap első végigjátszott pályája után): ha a kertet már látta, jöhet a következő meglepetés */
function tenyKertMeglepetes() {
  var K = tenyKertTar(); if (!K.indult) return null;
  var m = meglepetesSor(K, TVK_MEGLEP, tvRitkaUjMagJar(K) ? { elore: { tip: "mag", id: "mag" } } : null);   /* 🌰 az új ritka mag soron kívül jön */
  if (m) ment();
  return m;
}
/* a most látható meglepetés: ami még vár, vagy amit ma talált meg (a látogató a nap végéig ott marad); a felvett kincs már nem */
function tvkMeglepLathato(K) {
  var m = K && K.meg; if (!m || m.fel) return null;
  return !m.kesz || m.lat === tenyNap() ? m : null;
}
/* saját réteg a lerakott tárgyak fölött (a bokor kerete ne nyelje el a koppintást), de az unikornis mögött;
   ugyanaz a viewBox és vágás, mint a háttéré, így a hely a kert-képhez igazodik */
function tvkMeglepRajzol() {
  var kam = $("kert-kamera"); if (!kam) return;
  var L = KERT_LAY[KERT_ORIENT], svg = $("kc-meglep-reteg");
  if (!svg) {
    var t = document.createElement("div");
    t.innerHTML = '<svg id="kc-meglep-reteg" class="kc-meglep-reteg" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>';
    svg = t.firstChild; kam.appendChild(svg);
  }
  svg.setAttribute("viewBox", kertTajNezet($("kert-szinter")).vb.map(ktR).join(" "));
  svg.innerHTML = "";
  var m = tvkMeglepLathato(tenyKertTar()), p = m && TVK_MEGLEP_HELY[KERT_ORIENT][m.id]; if (!p) return;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", "kc-meglep"); g.setAttribute("class", "kc-meglep" + (m.kesz ? "" : " kc-meglep-var")); g.setAttribute("data-m", m.id);
  g.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ") scale(" + (KERT_ORIENT === "f" ? 1.35 : 1) + ")");
  g.innerHTML = '<g class="kc-ugral">' + tvMeglepRajz(m.id) + '</g><circle r="22" cy="-6" fill="transparent"/>';
  svg.appendChild(g);
}
/* koppintás a meglepetésre (kertSzinterKlikk): a látogató köszön; a kincshez az unikornis odasétál, és felveszi */
function tenyKertMeglepKlikk(g) {
  var K = tenyKertTar(), m = K.meg, ma = tenyNap(); if (!m || TVK.allapot || KERT_TRUKK_FUT) return;
  var szoveg = TVK_MEGLEP_SZOVEG[m.id] || "";
  if (m.tip === "latogato") {
    g.classList.remove("kc-koszon"); void g.getBoundingClientRect(); g.classList.add("kc-koszon");
    hangCsilla();
    if (!m.kesz) { meglepetesKesz(K); m.lat = ma; ment(); esemeny("tenyKertMeglepetes", { id: m.id }); g.classList.remove("kc-meglep-var"); }
    kertHir(szoveg); kertSugo(KERT_SUGO_SETA);
    return;
  }
  var host = $("kert-szinter"), M = tvkTerkep(host), p = TVK_MEGLEP_HELY[KERT_ORIENT][m.id], xp = (M.ox + p[0] * M.s) / M.w * 100;
  if (KERT_UL || KERT_FEKSZIK) kertAll();
  KERT_TRUKK_FUT = true; kertSugo("Odasétál… ✨");
  var cel = Math.max(13, Math.min(87, xp + (KERT_UNI_X < xp ? -7 : 7)));
  kertSetalIde(cel, function () {
    uniFordul($("kert-uni-doboz"), KERT_UNI_X < xp ? 1 : -1);
    if (m.tip === "mag") { if (!K.mag || K.mag.kesz) { tvRitkaUltet(K); TVK.dombJel = true; } }   /* 🌰 az új ritka mag a dombra */
    else { if (!K.kincs || typeof K.kincs !== "object") K.kincs = {}; K.kincs[m.id] = 1; }
    meglepetesKesz(K); m.lat = ma; m.fel = 1; ment();
    esemeny("tenyKertMeglepetes", { id: m.id, kincs: m.tip === "kincs" ? 1 : 0 });
    hangCsilla(); hangJo();
    var u = g.querySelector(".kc-ugral"); g.classList.remove("kc-meglep-var");
    if (u) { u.style.transition = "transform .9s cubic-bezier(.4,-.4,.6,1), opacity .9s ease"; u.style.transform = "translateY(-60px) scale(1.6)"; u.style.opacity = "0"; }
    kertHir(szoveg); kertSugo(m.tip === "mag" ? "Elültetem a dombon! 🌰 Koppints a dombra, és megnézzük." : "Ezt elteszem! ✨ A Kincsvitrin új polcára kerül.");
    setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); KERT_TRUKK_FUT = false; if (m.tip === "mag") tenyKertTavol(); }, 950);
  });
}
/* a Kincsvitrin új polca (odu.js, a bal falon): a felvett part menti apróságok, sorrendben; üres hely nem látszik */
function tenyKertKincsPolc(X, W, ry) {
  var K = P().tenyKert, kin = (K && K.kincs) || {}, van = TVK_KINCSEK.filter(function (id) { return kin[id]; });
  if (!van.length) return "";
  var s = '<g class="odu-kincspolc"><rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="7" rx="3" fill="#cbb6e6"/><rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="3" rx="1.5" fill="#dcc7f0"/>';
  s += '<path d="M' + (X + 12) + ' ' + (ry + 11) + ' q-6 8 2 16" stroke="#ab90cf" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M' + (X + W - 12) + ' ' + (ry + 11) + ' q6 8 -2 16" stroke="#ab90cf" stroke-width="3" fill="none" stroke-linecap="round"/>';
  van.forEach(function (id, i) { s += '<g transform="translate(' + ktR(X + 13 + i * (W - 26) / 5) + ' ' + (ry + 4) + ') scale(1)">' + tvMeglepRajz(id) + '</g>'; });
  return s + '</g>';
}
/* vár-e valami új a kertben (meglepetés, kinyílt, még nem látott virág) → pillangó a kertkapun az odúban */
function tenyKertVar() {
  var K = tenyKertTar(); if (!K.indult) return false;
  return !!(meglepetesVar(K) && tvkMeglepLathato(K)) || tenyKertUjVirag() || tvRitkaUj(K);
}
/* a pillangó a kertkapun (odú-koordináta): lassan nyitogatja a szárnyát. Nincs számláló, piros pötty vagy villogás. */
function tenyKertKapuLepke(x, y) {
  return '<g class="tv-kapu-lepke" transform="translate(' + x + ' ' + y + ') rotate(-14) scale(1.1)"><path class="tv-ksz1" d="M0 0 q-14 -12 -22 0 q8 12 22 5 Z" fill="#ff9ec4"/><path class="tv-ksz2" d="M0 0 q14 -12 22 0 q-8 12 -22 5 Z" fill="#b6a7f2"/><circle r="2.6" fill="#4a3f6b"/><path d="M0 -2 q-3 -6 -6 -7 M0 -2 q3 -6 6 -7" stroke="#4a3f6b" stroke-width="1" fill="none"/></g>';
}

/* ════════════ 3c. A RITKA MAG: napokon át érő titok a dombon (Tamagocsi-kert 6. kör) ════════════
   Az első mag ajándék a kert megnyitásakor (tenyKertRitkaAjandek). Gyakorlós napokon érik a közös erik()-kel
   (gondozas.js): mag → csíra → levelek → bimbó (a színe sejtet) → virág; a kimaradt nap nem ront rajta.
   Ha kinyílt, a következő gyakorlós nap meglepetése egy új mag a parton (meglepetesSor elore): az unikornis
   felveszi, és elülteti. Egyszerre mindig csak egy érik. A sorrend előre adott (TV_RITKA_SORREND), nem sorsolódik,
   nem vehető ✨-ért. A kinyílt ritka virágok a dombon maradnak (körben), és a Kincsvitrin „Ritka virágok” polcára
   is felkerülnek. Ha mind a 8 megvan, a sor új színváltozatokkal megy tovább (v = hányadik kör).
   Mentés: P().tenyKert.mag = { f: fajta, v: színváltozat, t: ültetés gyakorlós napja, g/i: hány lépcsőt ért,
   lt: amit a gyerek már látott, h: { nap, i, mondva } hír, kesz/ny: kinyílt (melyik gyakorlós napon), lat: a nyílást látta };
   .ritka = { holdvirag: 1, … } (hányszor nyílt), .rk = a sorban következő sorszám. */
var TV_RITKA_LEPCSOK = ["mag", "csira", "levelek", "bimbo", "virag"];
var TV_RITKA_SORREND = [0, 4, 2, 6, 3, 5, 1, 7];   /* holdvirág, tűzpipacs, csengővirág, felhőpitypang, csillagrózsa, harmatharang, szivárványliliom, mézvirág */
function tvRk(m, l, d) { return { m: m, l: l, d: d, mm: m }; }
var RITKA_VIRAGOK = [
  { id: "holdvirag", nev: "Holdvirág", tipp: "#cfdcff", mond: "Sötétben is halványan dereng.",
    fej: function () {
      var k = { minta: "egyszinu", c: tvRk("#f4f7ff", "#ffffff", "#9fb4e8") }, k2 = { minta: "egyszinu", c: tvRk("#e3ebff", "#ffffff", "#9fb4e8") };
      return '<circle class="tvr-dereng" r="34" fill="url(#tvr-hold)"/>' + tvKorben(8, function () { return tvSziromFest("kerek", 24, 7, k); }, .92, 10, "") +
        tvKorben(8, function () { return tvSziromFest("kerek", 15, 5, k2); }, .92, 32, "") + '<circle r="6.4" fill="#ffe9a8"/><circle cx="2.8" cy="-1.8" r="5.4" fill="#e3ebff"/>' +
        tvCsillam(-12, -18, 5) + tvCsillam(16, -8, 4) + tvCsillam(-4, 16, 4);
    } },
  { id: "szivarvanyliliom", nev: "Szivárványliliom", tipp: "#ffc4d6", mond: "Minden szirma más színű.",
    fej: function () {
      var SZ = ["#ff9aa2", "#ffc48a", "#ffe58a", "#a8e6a3", "#9ec9f0", "#c9a8e6"], s = '<g transform="scale(1 .82)">', i;
      SZ.forEach(function (c, j) { s += '<g transform="rotate(' + (j * 60) + ')">' + tvSziromFest("hegyes", 27, 7.6, { minta: "egyszinu", c: tvRk(c, "#ffffff", c) }) + '</g>'; });
      s += '</g>';
      for (i = 0; i < 6; i++) { var a = i / 6 * 6.283 + .5, x = Math.cos(a) * 15, y = Math.sin(a) * 12 - 5; s += '<path d="M0 0 Q' + ktR(x * .4) + ' ' + ktR(y * .4 - 6) + ' ' + ktR(x) + ' ' + ktR(y) + '" stroke="#d6eeb0" stroke-width=".9" fill="none"/><circle cx="' + ktR(x) + '" cy="' + ktR(y) + '" r="1.6" fill="#ffb347"/>'; }
      return s + '<circle r="3" fill="#fff6c2"/>' + tvCsillam(14, -16, 5);
    } },
  { id: "csengovirag", nev: "Csengővirág", tipp: "#ffe08a", mond: "Koppintásra csilingel.",
    fej: function () {
      var k = { minta: "egyszinu", c2: tvRk("#fff", "#fff", "#fff") }, c = tvRk("#ffd56b", "#fff3c4", "#c98f1e"), z = TV_KOZEP.arany;
      var s = '<path d="M-14 8 C -14 -12 0 -22 14 -20 C 22 -19 26 -12 26 -6" stroke="#56a540" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      [[-12, -6, 1.25], [2, -17, 1.35], [22, -9, 1.15]].forEach(function (h, j) { s += '<g transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + h[2] + ')"><g class="tvr-csileng" style="animation-delay:-' + (j * .5) + 's">' + tvHarang(k, c, z) + '<circle cx="-3" cy="6" r=".9" fill="#fff"/></g></g>'; });
      return s + '<g class="tvr-hangjegyek"></g>';
    } },
  { id: "csillagrozsa", nev: "Csillagrózsa", tipp: "#ffe08a", mond: "Apró csillagok keringenek körülötte.",
    fej: function () {
      var k = { forma: 6, minta: "ketszinu", c: tvRk("#ffc8de", "#fff0f6", "#e07aa6"), c2: tvRk("#ffe27a", "#fff6c2", "#d9a52e"), kozep: "csillogo", forg: 0 };
      var s = '<g transform="scale(1.35)">' + VIRAG_FORMAK[6].fej(k) + '</g><g class="tvr-kering">';
      for (var i = 0; i < 5; i++) { var a = i / 5 * 6.283; s += '<path transform="translate(' + ktR(Math.cos(a) * 30) + ' ' + ktR(Math.sin(a) * 22) + ')" d="M0 -4 L1.2 -1.2 4 0 1.2 1.2 0 4 -1.2 1.2 -4 0 -1.2 -1.2Z" fill="#ffe27a" stroke="#d9a52e" stroke-width=".5"/>'; }
      return s + '</g>';
    } },
  { id: "tuzpipacs", nev: "Tűzpipacs", tipp: "#ff9a6b", mond: "Tűz kedvence. Úgy lobog, mint a láng.",
    fej: function () {
      var s = '<g class="tvr-lang"><g transform="scale(1 .9)">';
      for (var i = 0; i < 6; i++) s += '<g transform="rotate(' + (i * 60 + 10) + ')"><g class="tvr-sz" style="--i:' + i + '"><path d="M0 0 C 9 -6 12 -18 5 -27 C 4 -20 1 -20 -1 -29 C -7 -20 -11 -9 0 0Z" fill="url(#tvr-tuz)" stroke="#e0502e" stroke-width=".6"/><path d="M0 -3 C 4 -8 5 -14 2 -19" stroke="#fff3b0" stroke-width="1.4" fill="none" opacity=".7"/></g></g>';
      return s + '</g></g><circle r="6" fill="#4a2a2a"/><circle cx="-1.6" cy="-1.8" r="2" fill="#7a4a4a"/>' + tvCsillam(0, -30, 5);
    } },
  { id: "harmatharang", nev: "Harmatharang", tipp: "#bfe9ff", mond: "Kristály harangjairól harmat csöpög.",
    fej: function () {
      var k = { minta: "egyszinu" }, c = tvRk("#d8f3ff", "#ffffff", "#5fb3e0"), z = { m: "#bfe9ff", d: "#7cc3ea" };
      var s = '<path d="M-14 8 C -14 -12 0 -22 14 -20 C 22 -19 26 -12 26 -6" stroke="#56a540" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      [[-12, -6, 1.25], [2, -17, 1.35], [22, -9, 1.15]].forEach(function (h, j) { s += '<g transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + h[2] + ')"><g opacity=".9">' + tvHarang(k, c, z) + '</g><path d="M-3 4 Q -4.6 9 -4.4 14" stroke="#fff" stroke-width="1.2" fill="none" opacity=".9"/><g transform="translate(0 21)"><path class="tvr-csepeg" style="--k:' + (j * .8) + 's" d="M0 0 C -1.8 2.6 -1.8 4 0 4.4 C 1.8 4 1.8 2.6 0 0Z" fill="#bfe9ff" stroke="#7cc3ea" stroke-width=".5"/></g></g>'; });
      return s;
    } },
  { id: "felhopitypang", nev: "Felhőpitypang", tipp: "#eef0f6", mond: "Pihéket fúj a szélbe.",
    fej: function () {
      var s = '<circle r="20" fill="#ffffff" opacity=".55"/>', i;
      for (i = 0; i < 30; i++) { var a = i / 30 * 6.283, x = Math.cos(a) * 18, y = Math.sin(a) * 18; s += '<path d="M0 0 L' + ktR(x) + ' ' + ktR(y) + '" stroke="#e6e9f2" stroke-width=".6"/><circle cx="' + ktR(x) + '" cy="' + ktR(y) + '" r="1.6" fill="#fff" stroke="#dfe3ee" stroke-width=".4"/>'; }
      s += '<circle r="3.2" fill="#d9c9a0"/>';
      for (i = 0; i < 4; i++) s += '<g transform="translate(' + ktR((i - 1.5) * 8) + ' -14)"><g class="tvr-pihe" style="--k:' + ktR(i * 1.2) + 's;--dx:' + (18 + i * 8) + 'px"><path d="M0 6 V0 M0 0 L-3 -3 M0 0 L0 -4 M0 0 L3 -3" stroke="#cfd5e3" stroke-width=".7"/><circle cy="6.6" r=".9" fill="#c9b78a"/></g></g>';
      return s;
    } },
  { id: "mezvirag", nev: "Mézvirág", tipp: "#ffc94d", mond: "Egy méhecske jár hozzá.",
    fej: function () {
      var k = { minta: "atmenetes", c: tvRk("#ffc94d", "#fff0b0", "#e08e1e") };
      var s = tvKorben(14, function () { return tvSziromFest("kerek", 21, 5, k); }, .92, 0, "") + '<circle r="9.5" fill="#8a5a2e"/><circle r="7" fill="#a8743e"/>';
      for (var i = 0; i < 14; i++) { var a = i * 2.4, rr = Math.sqrt(i / 14) * 7; s += '<circle cx="' + ktR(Math.cos(a) * rr) + '" cy="' + ktR(Math.sin(a) * rr) + '" r=".8" fill="#5e3a1c"/>'; }
      s += '<path d="M3 2 C 3 5 6 5 6 2 C 6 0 4.5 -1 4.5 -1 C 4.5 -1 3 0 3 2Z" fill="#ffb020" stroke="#d98a10" stroke-width=".4"/><circle cx="4" cy="1.4" r=".6" fill="#fff"/>';
      s += '<g class="tvr-meh"><g transform="translate(30 0)"><ellipse rx="4.6" ry="3.2" fill="#ffd24d" stroke="#5a4520" stroke-width=".6"/><path d="M-1.6 -3 V3 M1.4 -3 V3" stroke="#5a4520" stroke-width="1.2"/><ellipse cx="-1" cy="-4.6" rx="2.6" ry="1.8" fill="#eaf6ff" opacity=".85"/><ellipse cx="1.8" cy="-4.2" rx="2.2" ry="1.6" fill="#eaf6ff" opacity=".85"/><circle cx="4" cy="-.6" r=".7" fill="#2a1a1a"/></g></g>';
      return s;
    } }
];
/* a ritka virágok saját színátmenetei (minden rajz mellé odakerül, hogy a pultban és az odúban is meglegyen) */
function tvRitkaDefs() {
  return '<defs><radialGradient id="tvr-hold" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#eef3ff"/><stop offset=".6" stop-color="#cfdcff" stop-opacity=".7"/><stop offset="1" stop-color="#cfdcff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="tvr-feny" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="tvr-tuz" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4f3a"/><stop offset=".6" stop-color="#ff9a3d"/><stop offset="1" stop-color="#ffe066"/></linearGradient></defs>';
}
/* a fázisok (0 mag · 1 csíra · 2 levelek · 3 bimbó · 4 virág); v = színváltozat (a 2. körtől: a fej színe elfordul) */
function tvRitkaSzin(v) { return v ? ' style="filter:hue-rotate(' + ((v * 55) % 360) + 'deg)"' : ""; }
function ritkaRajz(fajta, fazis, v) {
  var R = RITKA_VIRAGOK[fajta];
  if (fazis <= 0) return '<ellipse cx="0" cy="0" rx="9" ry="3" fill="#7a5230"/><ellipse cx="0" cy="-2" rx="4" ry="3" fill="#9a6b42" stroke="#6a4424" stroke-width=".6"/><path d="M-1.4 -3.4 Q0 -4.6 1.6 -3.2" stroke="#c99a6a" stroke-width=".8" fill="none"/>' + tvCsillam(6, -8, 4);
  if (fazis === 1) return '<g transform="scale(1.5)">' + hajtasRajz() + '</g>';
  var lev = tvLevel("kerek", -60) + tvLevel("kerek", 58) + tvLevel("karcsu", -22) + tvLevel("karcsu", 24);
  if (fazis === 2) return '<g transform="scale(1.4)">' + lev + '<path d="M0 0 V-14" stroke="#56a540" stroke-width="2"/></g>';
  var szar = '<g transform="scale(1.4)">' + lev + '<path d="M0 0 Q2 -18 0 -36" stroke="#56a540" stroke-width="2.4" fill="none"/></g>';
  if (fazis === 3) return szar + '<g' + tvRitkaSzin(v) + '><circle cx="0" cy="-52" r="14" fill="' + R.tipp + '" opacity=".45" class="tvr-dereng"/><g transform="translate(0 -50)">' + bimboRajz(R.tipp, 1.7) + '</g></g>';
  return szar + '<circle cx="0" cy="-54" r="36" fill="url(#tvr-feny)" opacity=".7"/><g transform="translate(0 -54)"><g class="tvr-fej"' + tvRitkaSzin(v) + '>' + R.fej() + '</g></g>';
}
var TV_RITKA_SUGO = ["Itt alszik a ritka mag. Vajon mi lesz belőle? 🌰", "A ritka mag kicsírázott! Vajon mi lesz belőle? 🌱", "Már levelei is vannak! 🌿",
  "Bimbó! A színe már sejtet valamit… ✨"];
var TV_RITKA_HIR = ["", "🌱 A ritka mag kicsírázott! Vajon mi lesz belőle?", "🌿 A ritka magnak levelei nőttek!", "🌷 A ritka mag bimbót hozott! A színe már sejtet valamit…",
  "✨ Kinyílt a ritka virág a dombon! Gyere, nézd meg!"];

/* ── állapot ── */
function tvRitkaGyujt(K) { K = K || tenyKertTar(); if (!K.ritka || typeof K.ritka !== "object") K.ritka = {}; return K.ritka; }
function tvRitkaUltet(K) {   /* a sorban következő mag a dombra; a mai gyakorlós nap már nem számít bele (holnaptól érik) */
  var rk = K.rk || 0;
  K.mag = { f: TV_RITKA_SORREND[rk % TV_RITKA_SORREND.length], v: Math.floor(rk / TV_RITKA_SORREND.length), t: gyakNap(), g: 0, i: 0, lt: 0 };
  K.rk = rk + 1;
  return K.mag;
}
function tvRitkaUj(K) { var m = K && K.mag; return !!(m && ((m.i || 0) > (m.lt || 0) || (m.kesz && !m.lat))); }   /* továbbnőtt, és a gyerek még nem látta */
/* a kert megnyitásakor (kertNyit, a tenyKertBelep után): az első mag ajándék. Visszaad: hír vagy null */
function tenyKertRitkaAjandek() {
  var K = tenyKertTar(); if (!K.indult || K.mag || K.rk) return null;
  var m = tvRitkaUltet(K);
  esemeny("tenyKertRitka", { mi: "ajandek", f: RITKA_VIRAGOK[m.f].id });
  ment();
  TVK.dombJel = true;
  return "🌰 Ajándék neked: egy ritka mag! Az unikornis elültette a dombon, a két ágyás között. Vajon mi lesz belőle?";
}
/* a gyakPalyaVege hívja (a nap első végigjátszott pályája): egy lépcsővel tovább érik; nyíláskor a gyűjteménybe kerül */
function tenyKertRitkaErik() {
  var K = tenyKertTar(), m = K.mag; if (!K.indult || !m || m.kesz) return 0;
  var e = erik(m, TV_RITKA_LEPCSOK);
  if (e.i <= (m.i || 0)) return 0;
  m.i = e.i; m.h = { nap: tenyNap(), i: e.i };
  if (e.kesz) {
    var id = RITKA_VIRAGOK[m.f].id, gy = tvRitkaGyujt(K);
    m.kesz = 1; m.ny = gyakNap(); gy[id] = (gy[id] || 0) + 1;
    esemeny("tenyKertRitka", { mi: "nyilt", f: id, v: m.v || 0 });
  }
  ment();
  return e.i;
}
/* új mag jár, ha az előző egy korábbi gyakorlós napon kinyílt (a tenyKertMeglepetes kéri soron kívül) */
function tvRitkaUjMagJar(K) { var m = K.mag; return !!(m && m.kesz && (m.ny || 0) < gyakNap()); }

/* ── távolról: a domb (.kc-domb-mag): középen az érő mag, körben a kinyílt ritka virágok kicsiben ── */
var TV_RITKA_TAV = { f: { m: .5, kor: .2 }, a: { m: .34, kor: .14 } };
function tvRitkaKorben(K) {   /* a körben álló, már kinyílt ritka virágok: [fajta, változat]; a középen nyíló nincs köztük */
  var gy = K.ritka || {}, m = K.mag, ki = [];
  RITKA_VIRAGOK.forEach(function (R, f) { var n = gy[R.id] || 0; if (n && !(m && m.kesz && m.f === f)) ki.push([f, n - 1]); });
  return ki;
}
function tvRitkaKorHely(j, n, cx, cy, rx, ry) {   /* hátul kezdve, két oldalra felváltva, hogy a közepet ne takarják */
  var sz = [-120, -60, -150, -30, 155, 25, 130, 50][j % 8];
  return [cx + Math.cos(tvRad(sz)) * rx, cy + Math.sin(tvRad(sz)) * ry];
}
function tvRitkaTavol(svg) {
  var g = svg.querySelector(".kc-domb-mag"); if (!g) return;
  var K = tenyKertTar(), D = KERT_LAY[KERT_ORIENT].domb, T = TV_RITKA_TAV[KERT_ORIENT], m = K.mag, cy = D.cy - D.ry * .7, l = [];
  tvRitkaKorben(K).forEach(function (x, j) { var p = tvRitkaKorHely(j, 8, D.cx, cy, D.rx * .78, D.ry * .62); l.push([p[1], '<g transform="translate(' + ktR(p[0]) + ' ' + ktR(p[1]) + ') scale(' + T.kor + ')">' + ritkaRajz(x[0], 4, x[1]) + '</g>']); });
  if (m) l.push([cy, '<g class="tvr-tav-kozep' + (TVK.dombJel ? ' tvr-ujmag' : '') + '" transform="translate(' + D.cx + ' ' + ktR(cy) + ') scale(' + T.m + ')">' + ritkaRajz(m.f, m.kesz ? 4 : (m.i || 0), m.v) + '</g>']);
  l.sort(function (a, b) { return a[0] - b[0]; });
  g.innerHTML = tvRitkaDefs() + l.map(function (x) { return x[1]; }).join("") +
    '<ellipse class="kc-domb-hit" cx="' + D.cx + '" cy="' + ktR(D.cy - D.ry * 1.4) + '" rx="' + ktR(D.rx + 6) + '" ry="' + ktR(D.ry * 2.6) + '" fill="transparent"/>';
  TVK.dombJel = false;
}

/* ── közelről: a domb (a C2 rajzterv kozelDombSVG-je) ── */
var TVK_DOMB = { f: { cx: 500, cy: 470, rx: 260, ry: 70, sc: 2.2 }, a: { cx: 200, cy: 470, rx: 170, ry: 56, sc: 1.7 } };
function tvkDombTy() { var D = TVK_DOMB[KERT_ORIENT]; return D.cy - D.ry * .9; }
function tvkRitkaG(f, fazis, v, x, y, sc, jel, cls) {
  return '<g class="tvr-to' + (cls || "") + '" data-r="' + jel + '" data-y="' + ktR(y) + '" transform="translate(' + ktR(x) + ' ' + ktR(y) + ') scale(' + ktR(sc * 100) / 100 + ')">' +
    '<ellipse cx="0" cy="1" rx="14" ry="3.8" fill="#4a2f18" opacity=".28"/>' + ritkaRajz(f, fazis, v) + '<circle cx="0" cy="-40" r="40" fill="transparent"/></g>';
}
function tvkRitkaKozelek(o) {   /* o.fazis: a középső mag felülírt fázisa (a nyílás jelenetéhez), o.nyilik: a nyílás osztálya */
  o = o || {};
  var K = tenyKertTar(), D = TVK_DOMB[KERT_ORIENT], ty = tvkDombTy(), m = K.mag, l = [];
  tvRitkaKorben(K).forEach(function (x, j) { var p = tvRitkaKorHely(j, 8, D.cx, ty, D.rx * .72, D.ry * .7); l.push([p[1], tvkRitkaG(x[0], 4, x[1], p[0], p[1], D.sc * .55, x[0])]); });
  if (m) l.push([ty, tvkRitkaG(m.f, o.fazis != null ? o.fazis : m.kesz ? 4 : (m.i || 0), m.v, D.cx, ty, D.sc, "c", o.nyilik ? " tvr-nyilik" : "")]);
  l.sort(function (a, b) { return a[0] - b[0]; });
  return l.map(function (x) { return x[1]; }).join("");
}
function tvkRitkaUjra(o) {   /* a domb virágai újra (a nyílás jelenete); utána mélység szerint sorba, az unikornissal együtt */
  var t = $("tvk-tovek"); if (!t) return;
  Array.prototype.slice.call(t.querySelectorAll(".tvr-to")).forEach(function (e) { t.removeChild(e); });
  var w = document.createElementNS("http://www.w3.org/2000/svg", "g"); w.innerHTML = tvkRitkaKozelek(o);
  while (w.firstChild) t.appendChild(w.firstChild);
  Array.prototype.slice.call(t.children).sort(function (a, b) { return +a.getAttribute("data-y") - +b.getAttribute("data-y"); })
    .forEach(function (e) { t.appendChild(e); });
}
function tvkDombSVG() {
  var f = KERT_ORIENT === "f", K = TVK_KLAY[KERT_ORIENT], D = TVK_DOMB[KERT_ORIENT], c = LENYEK[mentes.leny], ty = tvkDombTy();
  var s = '<svg id="tvk-svg" viewBox="0 0 ' + K.W + ' ' + K.H + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + kertTajDefs() + tvRitkaDefs() + tvkKozelHatter(K, f);
  s += '<ellipse cx="' + D.cx + '" cy="' + ktR(D.cy + D.ry * .6) + '" rx="' + (D.rx + 12) + '" ry="' + ktR(D.ry * .6) + '" fill="#2c5a1e" opacity=".14"/>';
  s += '<path d="M' + ktP(D.cx - D.rx, D.cy + D.ry * .4, "Q", D.cx - D.rx * .6, D.cy - D.ry * 1.6, D.cx, D.cy - D.ry * 1.5, "Q", D.cx + D.rx * .6, D.cy - D.ry * 1.6, D.cx + D.rx, D.cy + D.ry * .4, "Q", D.cx, D.cy + D.ry * 1.1, D.cx - D.rx, D.cy + D.ry * .4) + 'Z" fill="url(#kcg-domb)"/>';
  s += '<ellipse cx="' + D.cx + '" cy="' + ktR(ty) + '" rx="' + ktR(D.rx * .4) + '" ry="' + ktR(D.ry * .42) + '" fill="#8a5f39"/>';
  for (var i = 0; i < 14; i++) { var a = i / 14 * 6.283; s += '<ellipse cx="' + ktR(D.cx + Math.cos(a) * D.rx * .42) + '" cy="' + ktR(ty + Math.sin(a) * D.ry * .45) + '" rx="' + (f ? 7 : 5) + '" ry="' + (f ? 4.4 : 3.2) + '" fill="#fffaf2" stroke="#d9cfc0" stroke-width=".6"/>'; }
  s += '<g id="tvk-tovek">' + tvkRitkaKozelek() + '<g id="tvk-uni-hely" data-y="0"><g id="tvk-uni" style="--dir:1;transform:scale(var(--dir,1),1)">' + unikornisSVG("tvk-uni-rajz", c, 1, P().oltozet) + '</g></g></g>';
  s += '<g stroke-linecap="round" fill="none">';
  (f ? [[40, 616], [300, 620], [640, 618], [960, 614]] : [[24, 656], [200, 660], [380, 654]]).forEach(function (b, j) {
    s += '<g transform="translate(' + b[0] + ' ' + b[1] + ')"><g class="kc-fuszal" style="animation-delay:-' + j * .5 + 's"><path d="M0 0 q-5 -16 -14 -24 M0 0 q-1 -22 3 -34 M0 0 q6 -14 15 -20" stroke="#4f9c3a" stroke-width="5"/></g></g>';
  });
  return s + '</g><g id="tvk-szikrak"></g><g id="tvk-eso"></g><g id="tvk-lepkek"></g></svg>';
}
/* a domb kerete: a kinyílt virág teteje (kb. 104 rajz-egység × sc) és az unikornis talpa is beférjen */
function tvkDombKeret() {
  var K = TVK_KLAY[KERT_ORIENT], D = TVK_DOMB[KERT_ORIENT], host = $("kert-szinter"), asp = host ? (host.clientWidth || 1) / (host.clientHeight || 1) : K.W / K.H;
  var fent = tvkDombTy() - 104 * D.sc, lent = D.cy + D.ry * 1.25, pad = K.H * .04;
  return tvkKeret(D.cx, (fent + lent) / 2, Math.max(K.W * .6, D.rx * 2.5, (lent - fent + 2 * pad) * asp));
}
function tvkDombNyit() {
  var host = $("kert-szinter"); if (!host) return;
  var regi = $("tvk-kozel"); if (regi) regi.parentNode.removeChild(regi);
  var K = TVK_KLAY[KERT_ORIENT], D = TVK_DOMB[KERT_ORIENT], Kt = tenyKertTar(), m = Kt.mag, ty = tvkDombTy();
  TVK.agy = "d"; TVK.kedv = {}; TVK.kozos = null; TVK.zar = false; TVK.kTovek = [];
  TVK.kux = D.cx - D.rx * .72; TVK.kuy = Math.min(K.yEl - 4, D.cy + D.ry * .95);
  var nyilas = !!(m && m.kesz && !m.lat);
  var d = document.createElement("div");
  d.id = "tvk-kozel"; d.className = "tvk-kozel uni-terep";
  d.innerHTML = tvkDombSVG() + tvkGombok("d");
  host.appendChild(d);
  var el = $("tvk-uni");
  uniNezoAdat(el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  tvkUniAllit(TVK.kux, TVK.kuy);
  if (nyilas) tvkRitkaUjra({ fazis: 3 });
  $("tvk-svg").setAttribute("viewBox", tvkDombKeret().map(ktR).join(" "));
  d.onclick = tvkDombKlikk;
  $("tvk-vissza").onclick = function (e) { e.stopPropagation(); tvkKozelZar(); };
  requestAnimationFrame(function () { d.classList.add("lathato"); });
  TVK.allapot = "bent";
  if (!m) { kertSugo("Itt még csak a föld pihen a dombon. 🌱"); return; }
  var R = RITKA_VIRAGOK[m.f], uj = (m.i || 0) > (m.lt || 0);
  m.lt = m.kesz ? 4 : (m.i || 0);
  if (nyilas) {   /* a nyílás jelenete: egyszer, amikor először látja */
    m.lat = 1; ment(); TVK.zar = true;
    kertSugo("Nézd, kinyílik! Vajon mi lesz belőle? ✨");
    uniFordul(el, 1);
    setTimeout(function () { if (TVK.allapot === "bent") tvkNezet(tvkKeret(D.cx, ty - 60 * D.sc, K.W / (KERT_ORIENT === "f" ? 1.7 : 1.15)), 900); }, 400);
    setTimeout(function () {
      if (TVK.allapot !== "bent") return;
      tvkRitkaUjra({ nyilik: true }); hangCsilla(); hangJo();
      tvkSzikraFel(D.cx, ty - 54 * D.sc); tvkSzikraFel(D.cx - 30 * D.sc, ty - 40 * D.sc); tvkSzikraFel(D.cx + 30 * D.sc, ty - 40 * D.sc);
      kertSugo("✨ Kinyílt: " + R.nev + "! " + R.mond);
      kertHir("✨ Kinyílt: " + R.nev + "! " + R.mond + " A Kincsvitrinbe is felkerült.");
    }, 1400);
    setTimeout(function () { if (TVK.allapot !== "bent") return; tvkRitkaUjra(); TVK.zar = false; tvkNezet(tvkDombKeret(), 900); kertSugo("Koppints a ritka virágra! ✨"); }, 5200);
    return;
  }
  ment();
  if (uj && !m.kesz) { kertSugo(TV_RITKA_SUGO[m.i || 0]); tvkSzikraFel(D.cx, ty - 20 * D.sc); hangCsilla(); }
  else if (m.kesz) kertSugo("Itt nyílik a ritka virágod: " + R.nev + ". Koppints rá! ✨");
  else kertSugo(TV_RITKA_SUGO[m.i || 0]);
}
/* a dombon: virágra koppintva odasétál, megszagolja, és a virág eljátssza a saját mozgását; a fűre koppintva odasétál */
function tvkDombKlikk(e) {
  e.stopPropagation();
  if (TVK.allapot !== "bent" || TVK.zar) return;
  var svg = $("tvk-svg"); if (!svg || e.target.closest("button")) return;
  var t = e.target.closest(".tvr-to");
  if (t) { tvkRitkaKoppint(t.getAttribute("data-r")); return; }
  var K = TVK_KLAY[KERT_ORIENT], D = TVK_DOMB[KERT_ORIENT], pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  var p = pt.matrixTransform(svg.getScreenCTM().inverse());
  if (p.y < D.cy - D.ry * 1.2) return;
  tvkUniMegy([[Math.max(80 * K.uni, Math.min(K.W - 80 * K.uni, p.x)), Math.max(D.cy - D.ry * .3, Math.min(K.H - 30, p.y))]]);
}
function tvkRitkaKoppint(jel) {
  var Kt = tenyKertTar(), m = Kt.mag, D = TVK_DOMB[KERT_ORIENT], ty = tvkDombTy(), x = D.cx, y = ty, f, fazis, sc = D.sc;
  if (jel === "c") { if (!m) return; f = m.f; fazis = m.kesz ? 4 : (m.i || 0); }
  else {
    f = +jel; fazis = 4; sc = D.sc * .55;
    tvRitkaKorben(Kt).forEach(function (q, j) { if (q[0] === f) { var p = tvRitkaKorHely(j, 8, D.cx, ty, D.rx * .72, D.ry * .7); x = p[0]; y = p[1]; } });
  }
  var R = RITKA_VIRAGOK[f], k = tvkUniSc(y + 6), oldal = TVK.kux < x ? -1 : 1, el = $("tvk-uni");
  var cx = x + oldal * (sc * 22 + 52 * k), cy = Math.max(y + 10, ty + D.ry * .5);
  TVK.zar = true; kertSugo("Odasétál… " + (fazis < 4 ? "🌰" : "✨"));
  tvkUniMegy([[cx, cy]], {}, function () {
    if (TVK.allapot !== "bent") return;
    uniFordul(el, -oldal, function () {
      if (TVK.allapot !== "bent") return;
      el.classList.remove("uni-mozd-szagol"); void el.getBoundingClientRect(); el.classList.add("uni-mozd-szagol");
      hangCsilla();
      setTimeout(function () {
        if (TVK.allapot !== "bent") return;
        if (fazis < 4) { kertSugo(TV_RITKA_SUGO[fazis]); tvkSzikraFel(x, y - 14 * sc); return; }
        var g = document.querySelector('#tvk-tovek .tvr-to[data-r="' + jel + '"]');
        if (g) { g.classList.remove("tvr-jatszik"); void g.getBoundingClientRect(); g.classList.add("tvr-jatszik"); setTimeout(function () { g.classList.remove("tvr-jatszik"); }, 2600); }
        if (R.id === "csengovirag") { tvRitkaHangjegyek(g); kertSugo("🔔 Csilingel! Ting-ting-ting!"); hangCsilla(); setTimeout(hangCsilla, 260); setTimeout(hangCsilla, 520); }
        else kertSugo("✨ " + R.nev + ": " + R.mond);
        tvkSzikraFel(x, y - 54 * sc);
      }, 550);
      setTimeout(function () { el.classList.remove("uni-mozd-szagol"); }, 1350);
      setTimeout(function () { if (TVK.allapot === "bent") TVK.zar = false; }, 1500);
    });
  });
}
function tvRitkaHangjegyek(el) {
  var g = el && el.querySelector(".tvr-hangjegyek"); if (!g) return;
  var s = ""; for (var i = 0; i < 4; i++) s += '<text class="tvr-hang" style="--k:' + ktR(i * .25) + 's;--dx:' + ktR((i - 1.5) * 9) + 'px" x="' + (i * 6 - 8) + '" y="-30" font-size="9" fill="#d9a52e">♪</text>';
  g.innerHTML = s; setTimeout(function () { g.innerHTML = ""; }, 2400);
}
/* a Kincsvitrin „Ritka virágok” polca (odu.js, a part menti kincsek polca alatt): a kinyílt ritka virágok kis cserépben */
function tenyKertRitkaPolc(X, W, ry) {
  var K = P().tenyKert, gy = (K && K.ritka) || {}, van = [];
  RITKA_VIRAGOK.forEach(function (R, f) { if (gy[R.id]) van.push([f, gy[R.id] - 1]); });
  if (!van.length) return "";
  var s = '<g class="odu-ritkapolc">' + tvRitkaDefs() + '<rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="7" rx="3" fill="#b9d9a8"/><rect x="' + X + '" y="' + (ry + 4) + '" width="' + W + '" height="3" rx="1.5" fill="#d3ecc4"/>';
  s += '<path d="M' + (X + 12) + ' ' + (ry + 11) + ' q-6 8 2 16" stroke="#93bd80" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M' + (X + W - 12) + ' ' + (ry + 11) + ' q6 8 -2 16" stroke="#93bd80" stroke-width="3" fill="none" stroke-linecap="round"/>';
  /* egy hosszú virágláda; a virágok felváltva hátrébb (magasabban) és elöl állnak, így nagyobbak is elférnek */
  var lep = (W - 20) / Math.max(5, van.length), ly = ry - 5, hatso = "", elso = "";
  van.forEach(function (x, i) {
    var px = X + 10 + lep * (i + .5), g = '<g transform="translate(' + ktR(px) + ' ' + (ly + (i % 2 ? 2 : 0)) + ') scale(' + (i % 2 ? .27 : .31) + ')">' + ritkaRajz(x[0], 4, x[1]) + '</g>';
    if (i % 2) elso += g; else hatso += g;
  });
  s += hatso + elso;
  s += '<path d="M' + (X + 6) + ' ' + (ly - 1) + ' H' + (X + W - 6) + ' L' + (X + W - 9) + ' ' + (ry + 4) + ' H' + (X + 9) + 'Z" fill="#e0a77a" stroke="#b97a4a" stroke-width=".8"/>';
  s += '<rect x="' + (X + 5) + '" y="' + (ly - 2.5) + '" width="' + (W - 10) + '" height="3" rx="1.5" fill="#eab88e"/>';
  return s + '</g>';
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
  var m = K.mag;   /* 🌰 a ritka mag továbbnőtt (6. kör) — egyszer szól */
  if (m && m.h && m.h.nap === ma && !m.h.mondva) { m.h.mondva = 1; sor.push(TV_RITKA_HIR[m.h.i]); }
  if (!sor.length) return null;
  return { html: sor.map(function (x) { return '<br><span style="color:#3f9e6a;font-weight:800">' + x + '</span>'; }).join(""),
    mondat: " " + sor.join(" ").replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, "").replace(/\s+/g, " ").trim() };
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

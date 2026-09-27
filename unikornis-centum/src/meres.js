/* ============ 6b) MÉRÉS-LIGETEK — 🧵 Szabóműhely · 🧪 Bájitalkonyha · 🧁 Mézes pékség ============
   Rendszerterv: Matekos\meres-palyacsoport-rendszerterv.html · rajzterv: meres-palyacsoport-rajzterv.html (1. kör:
   hátterek + mozgóképek) és meres-palyacsoport-rajzterv-2.html (2. kör: feladat-képernyők + kártyák).
   3 liget × 4 pálya (1–2. · 3. · 4. · 5. osztály). A három mennyiség SOHA nem keveredik: egy liget = egy mennyiség.
   Egy pálya: Rajt → 5 munkapad → Odú-küszöb. A gyerek mindig SZÁMOT mond, a mértékegység a kérdésben van.
   A kép a kérdés-buborékban ül (a Fejtörő-hegy mintájára), a motor a meglévő „egyenkent” út.
   Kódolás szakaszokban (2026-09-26): 1. szakasz = motor + 3 liget + 12 pálya + a szóbeli típusok
   (1 mérés, 2 átváltás, 3 kiegészítés, 4 műveletek, 8 összetett alak) + „mennyivel?” + 1 lépéses szöveges.
   2. szakasz ✅ (2026-09-27): a koppintós kártyák (5, 6, 7, 9, 10) + a „mennyivel?” láncban.
   3. szakasz ✅ (2026-09-27): többlépéses szöveges feladat + lépésenkénti végigvezetés, a 4 mozgókép (meres-mozgo.js),
   az égen 26 szilánk-hely (odu.js), élesítés — a ligeteket már a gyerekek is látják. */

/* ── láthatóság: ✅ élesítve (2026-09-27) — a gyerekek is látják; egy-egy pályát a pulton lehet elrejteni.
   (A fejlesztés alatt: MRZS-kód vagy ?meres; a hívók maradnak, ha egy új liget megint rejtve készülne.) ── */
function meresLathato() { return true; }

/* ── mennyiségek és mértékegységek ── */
var M_SZ = { mm: 1, cm: 10, dm: 100, m: 1000, km: 1e6, ml: 1, cl: 10, dl: 100, l: 1000, hl: 1e5, g: 1, dkg: 10, kg: 1000, q: 1e5, t: 1e6 };
var M_NEV = { mm: "milliméter", cm: "centiméter", dm: "deciméter", m: "méter", km: "kilométer", ml: "milliliter", cl: "centiliter",
  dl: "deciliter", l: "liter", hl: "hektoliter", g: "gramm", dkg: "dekagramm", kg: "kilogramm", q: "mázsa", t: "tonna" };
/* -ból/-ből és -os/-es alak (bennfoglalás: „6 kilogrammból hány 20 dekagrammos adag?”) */
function mBol(u) { var n = M_NEV[u]; return /a$/.test(n) ? n.slice(0, -1) + "ából" : n + (/gramm$/.test(n) ? "ból" : "ből"); }
function mOs(u) { var n = M_NEV[u]; return /a$/.test(n) ? n.slice(0, -1) + "ás" : n + (/gramm$/.test(n) ? "os" : "es"); }
function mBolJel(u) { return /gramm$|a$/.test(M_NEV[u]) ? "-ból" : "-ből"; }
function mOsJel(u) { return /gramm$/.test(M_NEV[u]) ? "-os" : (/a$/.test(M_NEV[u]) ? "-s" : "-es"); }
/* a mennyiség → liget, a mértékegységek osztályonként (a tankönyvek szerint, rendszerterv 3–3b) */
var MENNY = {
  hossz: { liga: "szabo", egys: { 1: ["dm", "m"], 2: ["cm", "dm", "m"], 3: ["mm", "cm", "dm", "m", "km"], 5: ["mm", "cm", "dm", "m", "km"] },
           tobb: "hosszabb", ige: "hosszú" },
  ur:    { liga: "bajital", egys: { 1: ["dl", "l"], 2: ["cl", "dl", "l"], 3: ["ml", "cl", "dl", "l"], 5: ["ml", "cl", "dl", "l", "hl"] },
           tobb: "több", ige: "" },
  tomeg: { liga: "pekseg", egys: { 1: ["kg"], 2: ["dkg", "kg"], 3: ["g", "dkg", "kg"], 5: ["g", "dkg", "kg", "q", "t"] },
           tobb: "nehezebb", ige: "" }
};
var M_HATAR = { 1: 20, 2: 100, 3: 1000, 4: 10000, 5: 100000 };   /* számkör osztályonként */
function mEgysegek(menny, g) { var e = MENNY[menny].egys; return (e[g] || e[g >= 5 ? 5 : (g >= 3 ? 3 : g)]).slice(); }
function mFinomabb(a, b) { return M_SZ[a] < M_SZ[b]; }

/* ── számok kiírása és kimondása 100 000-ig ── */
function mSzamIr(n) { return n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(n); }
function mSzazSzo(n) {
  var s = Math.floor(n / 100), r = n % 100, o = "";
  if (s) o += (s === 1 ? "" : (s === 2 ? "két" : szo(s))) + "száz";
  if (r) o += szo(r);
  return o;
}
function mSzamSzo(n) {
  n = Math.round(n);
  if (n === 0) return "nulla";
  if (n < 1000) return mSzazSzo(n);
  var e = Math.floor(n / 1000), r = n % 1000;
  return (e === 1 ? "" : mSzazSzo(e).replace(/kettő$/, "két")) + "ezer" + (r ? (n > 2000 ? "-" : "") + mSzazSzo(r) : "");
}
function mSzo(n) { return mSzamSzo(n).replace(/kettő$/, "két"); }             /* jelzői alak: „két liter” */
function mMondd(n, u) { return mSzo(n) + " " + M_NEV[u]; }                       /* „negyven deciméter” */
function mJel(n, u) { return mSzamIr(n) + " " + u; }                         /* képernyőn: „40 dm” */
function mB(n, u) { return "<b>" + mJel(n, u) + "</b>"; }
function mAz(n) { return "aáeéiíoóöőuúüű".indexOf(mSzamSzo(n).charAt(0)) >= 0 ? "az" : "a"; }
function mBen(u) { var n = M_NEV[u]; return /a$/.test(n) ? n.slice(0, -1) + "ában" : n + (/gramm$/.test(n) ? "ban" : "ben"); }
function mNagy(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
var M_VAL = { 10: "tízzel", 100: "százzal", 1000: "ezerrel", 10000: "tízezerrel", 100000: "százezerrel" };

/* ── nagy számok kiolvasása a hangból („kétezer-háromszázöt”, „negyvenezer”, „2 305”) ── */
var MSZ_MORF = [["kilencven", 90, "t"], ["nyolcvan", 80, "t"], ["hetven", 70, "t"], ["hatvan", 60, "t"], ["ötven", 50, "t"], ["otven", 50, "t"],
  ["negyven", 40, "t"], ["harminc", 30, "t"], ["huszon", 20, "t"], ["húsz", 20, "t"], ["husz", 20, "t"], ["tizen", 10, "t"], ["tíz", 10, "t"],
  ["tiz", 10, "t"], ["száz", 100, "x"], ["szaz", 100, "x"], ["ezer", 1000, "k"], ["kilenc", 9, "e"], ["nyolc", 8, "e"], ["kettő", 2, "e"],
  ["ketto", 2, "e"], ["három", 3, "e"], ["harom", 3, "e"], ["négy", 4, "e"], ["negy", 4, "e"], ["hét", 7, "e"], ["het", 7, "e"], ["hat", 6, "e"],
  ["két", 2, "e"], ["ket", 2, "e"], ["egy", 1, "e"], ["öt", 5, "e"], ["ot", 5, "e"], ["nulla", 0, "e"]]
  .sort(function (a, b) { return b[0].length - a[0].length; });
function mSzoBont(w) {
  var pos = 0, out = [];
  while (pos < w.length) {
    var m = null;
    for (var i = 0; i < MSZ_MORF.length; i++) if (w.substr(pos, MSZ_MORF[i][0].length) === MSZ_MORF[i][0]) { m = MSZ_MORF[i]; break; }
    if (!m) break;
    if (m[2] === "e" && out.length && out[out.length - 1][2] === "e") break;   /* „ötöt”, „hetet”: a második tag már rag */
    out.push(m); pos += m[0].length;
  }
  return (out.length && w.length - pos <= 3) ? out : null;   /* rövid rag maradhat („ötöt”, „egyet”) */
}
function meresSzamok(szoveg) {
  var s = String(szoveg).toLowerCase(), prev;
  do { prev = s; s = s.replace(/(\d)[\s  .](?=\d{3}(\D|$))/g, "$1"); } while (s !== prev);
  var tk = s.replace(/[^a-zá-ű0-9\s]/gi, " ").split(/\s+/).filter(Boolean);
  var out = [], total = 0, cur = 0, aktiv = false, utolso = null, utolsoErt = 0;
  function lezar() { if (aktiv) out.push(total + cur); total = 0; cur = 0; aktiv = false; utolso = null; }
  function alkalmaz(m) {
    if (m[2] === "k") { total += (cur === 0 ? 1 : cur) * 1000; cur = 0; }
    else if (m[2] === "x") cur = (cur === 0 ? 1 : cur) * 100;
    else cur += m[1];
    aktiv = true; utolso = m[2]; utolsoErt = m[1];
  }
  for (var i = 0; i < tk.length; i++) {
    var w = tk[i];
    if (/^\d+$/.test(w)) { lezar(); cur = parseInt(w, 10); aktiv = true; utolso = "d"; continue; }
    var b = mSzoBont(w);
    if (!b) { lezar(); continue; }
    var elso = b[0][2];
    var folytat = aktiv && (utolso === "x" || utolso === "k" || elso === "x" || elso === "k" ||
      (utolso === "t" && utolsoErt >= 20 && elso === "e"));
    if (!folytat) lezar();
    b.forEach(alkalmaz);
  }
  lezar();
  return out;
}
function meresSzamKi(szoveg) { var a = meresSzamok(szoveg); return a.length ? a[0] : null; }
/* a válasz-kiolvasás: mérés-feladatnál a nagy számokat is érti, máshol a régi (0–100) út marad */
function valaszSzamKi(alt) {
  var sz = alt.join(" ");
  return (J && J.feladat && J.feladat.nagySzam) ? meresSzamKi(sz) : elsoSzam(sz);
}
/* hány számjegy írható be (a régi pályákon 3, a mérésnél 6) */
function beirMax() { return (J && J.feladat && J.feladat.jegyMax) || 3; }

/* ═════════════════ RAJZOK (a rajzterv 2. köréből, jóváhagyva 2026-09-26) ═════════════════ */
var MR = (function () {
  var F = 'font-family="Fredoka,Segoe UI,sans-serif"';
  var LIGA = {
    szabo:   { fal1: "#fdeef4", fal2: "#f6e0ea", csik: "rgba(236,180,206,.30)", padlo: "#ead0b8", padlo2: "#dcbc9c",
               ut: "#f9d3e1", ut2: "#e7a9c0", fuzer: "#ffd96b", fuzer2: "#c79a2a", szinek: ["#f6a5c0", "#a7d99a", "#c9a8e6", "#9ec9f0", "#f7c59f", "#fce49a"] },
    bajital: { fal1: "#eee8f8", fal2: "#e2eef2", csik: "rgba(170,150,210,.20)", padlo: "#d6cfe4", padlo2: "#c5bcd8",
               ut: "#ebe4f7", ut2: "#c9b8e6", fuzer: "#a88a6a", fuzer2: "#a88a6a", szinek: ["#c79bea", "#8fd3c7", "#f6a5c0", "#9ec9f0", "#fce49a", "#a7d99a"] },
    pekseg:  { fal1: "#fff4de", fal2: "#fbe6c4", csik: "rgba(230,180,110,.18)", padlo: "#efc9a3", padlo2: "#e2b58a",
               ut: "#f6d2a6", ut2: "#d9a877", fuzer: "#b07a45", fuzer2: "#b07a45", szinek: ["#f3e3c3", "#f1d6ae", "#efe6d2", "#f6dcc0", "#eadbc0", "#f3e3c3"] }
  };
  function tag(x, y, t, o) {
    o = o || {};
    var fs = o.fs || 20, w = Math.max(40, String(t).length * fs * .56 + 18), h = fs + 14;
    return `<g transform="translate(${x},${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.4}" fill="${o.bg || "#fff"}" stroke="${o.st || "#cbb6e6"}" stroke-width="2.5" ${o.dash ? 'stroke-dasharray="6 4"' : ""}/>
      <text x="0" y="${fs * .36}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${o.fill || "#4a3b7a"}" ${F}>${t}</text></g>`;
  }
  function kerdoTag(x, y, t, fs) { return tag(x, y, t, { fs: fs || 24, dash: true, st: "#e2589b" }); }
  function nyil(x1, x2, y) {
    return `<path d="M${x1} ${y} H${x2 - 8}" stroke="#b79fd4" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 10} L${x2} ${y} L${x2 - 14} ${y + 10}" fill="none" stroke="#b79fd4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function jel(x, y, t, fs) { return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs || 36}" font-weight="800" fill="#b79fd4" ${F}>${t}</text>`; }
  function tekercs(cx, cy, c, s) {
    return `<g transform="translate(${cx},${cy}) scale(${s || 1})">
      <path d="M26 8 q16 6 12 24 l-8 -5 l-7 8 q5 -15 -3 -21Z" fill="${c}" stroke="rgba(0,0,0,.12)"/>
      <rect x="-28" y="-24" width="56" height="48" rx="5" fill="${c}"/><path d="M-28 -12 H28 M-28 0 H28 M-28 12 H28" stroke="#fff" stroke-opacity=".45" stroke-width="2.2"/>
      <rect x="-35" y="-31" width="70" height="9" rx="4" fill="#e6c49b" stroke="#c28d58" stroke-width="2"/><rect x="-35" y="22" width="70" height="9" rx="4" fill="#e6c49b" stroke="#c28d58" stroke-width="2"/></g>`;
  }
  function lombik(cx, cy, c, s) {
    return `<g transform="translate(${cx},${cy}) scale(${s || 1})">
      <path d="M-23.8 -22 H23.8 L30 -12 Q36 0 24 0 H-24 Q-36 0 -30 -12Z" fill="${c}"/>
      <path d="M-9 -68 H9 V-46 L30 -12 Q36 0 24 0 H-24 Q-36 0 -30 -12 L-9 -46Z" fill="rgba(235,240,255,.35)" stroke="#7a6aa6" stroke-width="3" stroke-linejoin="round"/>
      <rect x="-11" y="-78" width="22" height="11" rx="3" fill="#c9a06a" stroke="#8a6a3a" stroke-width="2"/>
      <path d="M-17 -30 Q-24 -18 -22 -8" stroke="#fff" stroke-width="3.5" fill="none" opacity=".7" stroke-linecap="round"/>
      <circle cx="8" cy="-11" r="3" fill="#fff" opacity=".7"/><circle cx="14" cy="-17" r="2" fill="#fff" opacity=".7"/></g>`;
  }
  function zsak(cx, cy, c, s) {
    return `<g transform="translate(${cx},${cy}) scale(${s || 1})">
      <path d="M-26 -56 Q-35 -38 -36 -20 Q-38 0 -24 0 H24 Q38 0 36 -20 Q35 -38 26 -56 Q0 -49 -26 -56Z" fill="${c}" stroke="#b08a5a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-24 -56 Q-18 -72 -8 -63 Q0 -76 8 -63 Q18 -72 24 -56" fill="${c}" stroke="#b08a5a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-24 -56 Q0 -49 24 -56" stroke="#d9665f" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M0 -40 v18 M0 -36 l-6 -5 M0 -36 l6 -5 M0 -29 l-6 -5 M0 -29 l6 -5" stroke="#d2a86a" stroke-width="2.2" stroke-linecap="round"/></g>`;
  }
  function pohar(x, y, c, felirat) {
    return `<g transform="translate(${x},${y})"><path d="M-12 -26 L12 -26 L9 0 L-9 0Z" fill="${c}"/>
      <path d="M-14 -38 L14 -38 L10 0 L-10 0Z" fill="rgba(255,255,255,.35)" stroke="#7a6aa6" stroke-width="2.6" stroke-linejoin="round"/>
      ${felirat ? `<text x="0" y="-8" text-anchor="middle" font-size="10" font-weight="800" fill="#4a3b7a" ${F}>${felirat}</text>` : ""}</g>`;
  }
  function ust(cx, cy) {
    return `<g transform="translate(${cx},${cy})"><path d="M-30 4 l-8 12 M30 4 l8 12" stroke="#3f3850" stroke-width="5" stroke-linecap="round"/>
      <path d="M-46 -40 Q-50 2 -18 6 H18 Q50 2 46 -40Z" fill="#5d5470" stroke="#3f3850" stroke-width="3"/>
      <ellipse cx="0" cy="-40" rx="48" ry="11" fill="#8fd3c7" stroke="#3f3850" stroke-width="3"/>
      <circle cx="-14" cy="-44" r="4" fill="#c9f0e8"/><circle cx="12" cy="-48" r="3" fill="#c9f0e8"/></g>`;
  }
  function suly(x, y, szam, egys, m) {
    m = m || 1;
    var r = 13 * m, h = 22 * m;
    return `<g transform="translate(${x},${y})"><ellipse cx="0" cy="-1" rx="${r}" ry="${r * .3}" fill="#b8892c"/><rect x="${-r}" y="${-h}" width="${2 * r}" height="${h - 1}" fill="#e9b949"/>
      <ellipse cx="0" cy="${-h}" rx="${r}" ry="${r * .3}" fill="#f6d47a" stroke="#b8892c" stroke-width="1.2"/><rect x="-3" y="${-h - 7}" width="6" height="7" rx="2" fill="#d9a53c"/>
      <text x="0" y="${-h * .5 + 2}" text-anchor="middle" font-size="${String(szam).length > 2 ? 15 : 18}" font-weight="800" fill="#4a2e04" ${F}>${szam}</text>
      <text x="0" y="-3" text-anchor="middle" font-size="10" font-weight="800" fill="#4a2e04" ${F}>${egys}</text></g>`;   /* nagy, sötét felirat (producer, 2026-09-27: kicsi súlyon is olvasható legyen) */
  }
  function vasSuly(x, y, felirat, fs) {
    return `<g transform="translate(${x},${y})"><path d="M-24 0 L24 0 L17 -34 L-17 -34Z" fill="#7d88a6" stroke="#5a6480" stroke-width="2"/>
      <rect x="-7" y="-44" width="14" height="11" rx="5" fill="none" stroke="#5a6480" stroke-width="4"/>
      <text x="0" y="-11" text-anchor="middle" font-size="${fs || (felirat.length > 5 ? 11 : 14)}" font-weight="800" fill="#fff" ${F}>${felirat}</text></g>`;
  }
  function kalacs(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s || 1})"><path d="M-34 0 Q-38 -22 -14 -24 Q0 -34 14 -24 Q38 -22 34 0Z" fill="#e0a45c" stroke="#a8702e" stroke-width="2.5"/>
      <path d="M-22 -8 q6 -12 12 -2 q6 -12 12 -2 q6 -12 12 -2" stroke="#f6d49a" stroke-width="3" fill="none"/><circle cx="-8" cy="-17" r="1.6" fill="#fff"/><circle cx="6" cy="-19" r="1.6" fill="#fff"/></g>`;
  }
  /* kétkarú mérleg (360×150). fok>0: a bal oldal lent */
  function kisMerleg(bal, jobb, fok, tw) {
    var MX = 180, MY = 34, K = 108, H = 60, r = fok * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), T = tw || 50;   /* tw: a tányér fél-szélessége */
    function tany(x, y, t) {
      return `<g transform="translate(${x},${y})"><path d="M0 0 L${-T + 10} ${H} M0 0 L${T - 10} ${H}" stroke="#9a7a4a" stroke-width="2"/>
        <path d="M${-T} ${H} Q0 ${H + 16} ${T} ${H}Z" fill="#e8c47a" stroke="#b88a3a" stroke-width="2.5"/><ellipse cx="0" cy="${H}" rx="${T}" ry="5" fill="#f3d99a" stroke="#b88a3a" stroke-width="2"/>
        <circle r="3.5" fill="#b88a3a"/><g transform="translate(0,${H - 2})">${t}</g></g>`;
    }
    return `<path d="M${MX - 44} 148 L${MX + 44} 148 L${MX + 30} 132 L${MX - 30} 132Z" fill="#c99b6d" stroke="#a87a48" stroke-width="2"/>
      <rect x="${MX - 6}" y="${MY}" width="12" height="100" fill="#d9ad72" stroke="#a87a48" stroke-width="2"/>
      <g transform="rotate(${-fok},${MX},${MY})"><rect x="${MX - K}" y="${MY - 4}" width="${2 * K}" height="8" rx="4" fill="#e0b476" stroke="#a87a48" stroke-width="2"/>
        <path d="M${MX - 3} ${MY} L${MX} ${MY - 24} L${MX + 3} ${MY}Z" fill="#6f5a8a"/></g><circle cx="${MX}" cy="${MY}" r="6" fill="#a87a48"/>
      ${tany(MX - K * c, MY + K * s, bal)}${tany(MX + K * c, MY - K * s, jobb)}`;
  }
  /* mérőhenger 10 osztással: szint = hány osztásig teli; o.hiany: a hiányzó rész szaggatva;
     o.cimke(k): az osztás felirata (alap: k), o.cimkeNelkul: felirat nélkül */
  function henger(cx, szint, o) {
    o = o || {};
    var bot = 138, top = 16, h = 11, x1 = cx - 30, x2 = cx + 30, jelek = "";
    for (var k = 1; k <= 10; k++) {
      var y = bot - k * h;
      jelek += `<line x1="${x2 - 14}" x2="${x2}" y1="${y}" y2="${y}" stroke="#7a6aa6" stroke-width="${k === 10 || k === 5 ? 2.6 : 1.5}"/>`;
      if (!o.cimkeNelkul) jelek += `<text x="${x2 + 6}" y="${y + 4}" font-size="10.5" font-weight="700" fill="#6a5a9a" ${F}>${o.cimke ? o.cimke(k) : k}</text>`;
    }
    var ty = bot - szint * h;
    return `<rect x="${x1}" y="${ty}" width="60" height="${bot - ty}" fill="#c79bea"/><rect x="${x1}" y="${ty - 1.5}" width="60" height="3" fill="#e6c9ff"/>
      ${o.hiany ? `<rect x="${x1 + 3}" y="${bot - 10 * h}" width="54" height="${Math.max(4, (10 - szint) * h - 2)}" fill="#fff8d6" stroke="#e2589b" stroke-width="2.5" stroke-dasharray="6 4" rx="3"/>
        <text x="${cx}" y="${bot - (10 + szint) / 2 * h + 8}" text-anchor="middle" font-size="24" font-weight="800" fill="#e2589b" ${F}>?</text>` : ""}
      <path d="M${x1} ${top} L${x1} ${bot} Q${x1} ${bot + 4} ${x1 + 4} ${bot + 4} L${x2 - 4} ${bot + 4} Q${x2} ${bot + 4} ${x2} ${bot} L${x2} ${top} L${x2 + 6} ${top - 6}" fill="none" stroke="#7a6aa6" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${cx - 42} ${bot + 8} H${cx + 42}" stroke="#7a6aa6" stroke-width="5" stroke-linecap="round"/>
      <path d="M${x1 + 8} ${top + 20} V${bot - 10}" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>${jelek}
      <text x="${x2 + 6}" y="${top - 1}" font-size="11" font-weight="800" fill="#6a5a9a" ${F}>${o.felso || "dl"}</text>`;
  }
  function masni(x, y, c) {
    return `<g transform="translate(${x},${y})"><path d="M0 0 L-16 -9 Q-20 0 -16 9Z M0 0 L16 -9 Q20 0 16 9Z" fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>
      <path d="M-2 2 L-8 16 M2 2 L8 16" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="${c}" stroke="rgba(0,0,0,.2)"/></g>`;
  }
  function ollo(x, y) {
    return `<g transform="translate(${x},${y}) rotate(90)"><circle cx="-7" cy="-26" r="6.5" fill="none" stroke="#e07aa0" stroke-width="3.5"/><circle cx="7" cy="-26" r="6.5" fill="none" stroke="#e07aa0" stroke-width="3.5"/>
      <path d="M-3 -20 L3 16 L5 -20Z M3 -20 L-3 16 L-5 -20Z" fill="#c8ccd8" stroke="#9aa0b4" stroke-width="1"/></g>`;
  }
  function szalag(x1, x2, y, c, h) {
    h = h || 22;
    return `<rect x="${x1}" y="${y}" width="${Math.max(4, x2 - x1)}" height="${h}" rx="3" fill="${c}"/><path d="M${x1 + 4} ${y + h / 2} H${x2 - 4}" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 4" opacity=".8"/>`;
  }
  function mRud(x, y, w, felirat) {
    var t = "";
    for (var i = 0; i < Math.floor(w / 10) - 1; i++) t += `<line x1="${(i + 1) * 10}" x2="${(i + 1) * 10}" y1="0" y2="${(i + 1) % 5 ? 5 : 9}" stroke="#a88a2a" stroke-width="1"/>`;
    return `<g transform="translate(${x},${y})"><rect width="${w}" height="20" rx="4" fill="#fce49a" stroke="#c79a2a" stroke-width="2"/>${t}
      <text x="${w / 2}" y="16" text-anchor="middle" font-size="12" font-weight="800" fill="#6a4a10" ${F}>${felirat}</text></g>`;
  }
  function svg360(b) { return `<svg viewBox="0 -4 360 162" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${b}</svg>`; }
  /* a mennyiség „tárgya”: szabó = cérnatekercs, bájital = üvegcse, pékség = zsák; (x, talppont y) */
  function targy(liga, x, y, s, ci) {
    var c = LIGA[liga].szinek[(ci || 0) % 6];
    if (liga === "szabo") return tekercs(x, y - 31 * s, c, s);
    if (liga === "bajital") return lombik(x, y, c, s);
    return zsak(x, y, c, s);
  }
  return { F: F, LIGA: LIGA, tag: tag, kerdoTag: kerdoTag, nyil: nyil, jel: jel, tekercs: tekercs, lombik: lombik, zsak: zsak, pohar: pohar,
    ust: ust, suly: suly, vasSuly: vasSuly, kalacs: kalacs, kisMerleg: kisMerleg, henger: henger, masni: masni, ollo: ollo,
    szalag: szalag, mRud: mRud, svg360: svg360, targy: targy };
})();

/* ═════════════════ FELADAT-GENERÁTOROK ═════════════════
   A pálya-állomás cfg-je: { tipus:"meres", mennyiseg, g (osztály 1–5), feladatok:[fajta…] }.
   Minden feladat szóbeli (számot mond a gyerek), a kép a buborékban. A „lanc” mező: ugyanazon feladat
   további kérdései (láncos átváltás, összetett alak két kérdésben) — nem számítanak külön pöttynek. */
function mFeladat(cfg, o) {
  var liga = MENNY[cfg.mennyiseg].liga;
  var f = {
    csalad: "egyenkent", nagySzam: true, jegyMax: 6, meres: cfg.mennyiseg,
    kartyaHTML: '<div class="meres-kep">' + (o.kep || "") + '</div><div class="meres-kerdes' + (o.hosszu ? ' hosszu' : '') + '">' + o.kerdes + '</div>',
    szoveg: o.kerdes.replace(/<[^>]+>/g, ""), keplet: o.keplet || "", megoldas: o.megoldas, felolvas: o.felolvas,
    helyes: o.helyes, tipp: o.tipp || "", lanc: o.lanc || null, liga: liga, mk: o.mk || null, mkk: o.mkk || null,
    naplo: { tipus: "meres-" + o.fajta, kerdes: (o.keplet || o.kerdes.replace(/<[^>]+>/g, "")).slice(0, 60), helyes: o.helyes, atlepes: false }
  };
  return f;
}
function mVel(lista) { return lista[veletlen(0, lista.length - 1)]; }
/* kulcs-ismétlés-védelem: legfeljebb 60 próba, aztán elfogadjuk */
function mEgyedi(kerultMar, fn) {
  var r, kor = 0;
  do { r = fn(); kor++; } while (kor < 60 && r && kerultMar[r.kulcs]);
  if (r) kerultMar[r.kulcs] = true;
  return r;
}

/* ── 2) ÁTVÁLTÁS (4.2): mindkét irány; láncos 4–5. o. ── */
function mParok(menny, g, maxF) {
  var E = mEgysegek(menny, g), L = M_HATAR[g], out = [];
  for (var i = 0; i < E.length; i++) for (var j = 0; j < E.length; j++) {
    var a = E[j], b = E[i];                           /* a durvább, b finomabb */
    if (!mFinomabb(b, a)) continue;
    var f = M_SZ[a] / M_SZ[b];
    if (f <= L && f <= (maxF || 1e9)) out.push({ a: a, b: b, f: f });
  }
  return out;
}
function genAtvaltas(cfg, kerultMar) {
  var g = cfg.g, L = M_HATAR[g], menny = cfg.mennyiseg, liga = MENNY[menny].liga;
  var P0 = mParok(menny, g, g <= 1 ? 10 : (g <= 2 ? 100 : (g <= 4 ? 1000 : 10000)));
  if (g <= 1) L = 20;
  if (!P0.length) P0 = mParok(menny, 2, 100);                  /* 1. o. tömeg: csak kg van → 1 kg = 100 dkg */
  /* láncos (4–5. o., kb. minden 3.): három egység egymás után, „… és az hány …?” */
  if (g >= 4 && veletlen(1, 3) === 1) {
    var E = mEgysegek(menny, g).filter(function (u) { return M_SZ[u] >= 1; }), lancok = [];
    for (var x = 0; x + 2 < E.length; x++) {
      var a0 = E[x + 2], b0 = E[x + 1], c0 = E[x];
      if (M_SZ[a0] / M_SZ[c0] <= L / 2) lancok.push([a0, b0, c0]);
    }
    if (lancok.length) {
      var r = mEgyedi(kerultMar, function () {
        var l = mVel(lancok), n = veletlen(2, Math.max(2, Math.min(9, Math.floor(L / (M_SZ[l[0]] / M_SZ[l[2]])))));
        return { kulcs: "lanc" + n + l.join(""), l: l, n: n };
      });
      var l = r.l, n = r.n, v1 = n * M_SZ[l[0]] / M_SZ[l[1]], v2 = n * M_SZ[l[0]] / M_SZ[l[2]];
      var kep1 = MR.svg360(MR.targy(liga, 80, 112, 1.15, n) + MR.tag(80, 134, mJel(n, l[0])) + MR.nyil(140, 212, 70) + MR.kerdoTag(272, 72, "? " + l[1]));
      var kep2 = MR.svg360(MR.targy(liga, 80, 112, 1.15, n) + MR.tag(80, 134, mJel(v1, l[1])) + MR.nyil(140, 212, 70) + MR.kerdoTag(272, 72, "? " + l[2]));
      var masodik = mFeladat(cfg, { fajta: "atvaltas-lanc", kep: kep2, kerdes: "És " + mB(v1, l[1]) + " hány <b>" + l[2] + "</b>?",
        felolvas: "És az hány " + M_NEV[l[2]] + "?", helyes: v2, keplet: mJel(v1, l[1]) + " = ? " + l[2], megoldas: mJel(v1, l[1]) + " = " + mJel(v2, l[2]),
        tipp: "Egy " + M_NEV[l[1]] + " az " + mSzo(M_SZ[l[1]] / M_SZ[l[2]]) + " " + M_NEV[l[2]] + ", ezért szorozd meg " + M_VAL[M_SZ[l[1]] / M_SZ[l[2]]] + "!",
        mk: { menny: menny, a: l[1], b: l[2], n: v1, u: l[1], cel: l[2] } });
      return mFeladat(cfg, { fajta: "atvaltas-lanc", kep: kep1, kerdes: mB(n, l[0]) + " hány <b>" + l[1] + "</b>?",
        felolvas: mNagy(mMondd(n, l[0])) + " hány " + M_NEV[l[1]] + "?", helyes: v1, keplet: mJel(n, l[0]) + " = ? " + l[1],
        megoldas: mJel(n, l[0]) + " = " + mJel(v1, l[1]),
        tipp: "Egy " + M_NEV[l[0]] + " az " + mSzo(M_SZ[l[0]] / M_SZ[l[1]]) + " " + M_NEV[l[1]] + ", ezért szorozd meg " + M_VAL[M_SZ[l[0]] / M_SZ[l[1]]] + "!",
        lanc: [masodik], mk: { menny: menny, a: l[0], b: l[1], n: n, u: l[0], cel: l[1] } });
    }
  }
  var r2 = mEgyedi(kerultMar, function () {
    var p = mVel(P0), maxN = Math.max(1, Math.floor(L / p.f)), n;
    if (g >= 4 && maxN >= 10) n = veletlen(2, Math.min(maxN, g >= 5 ? 99 : 60));
    else n = veletlen(1, Math.min(maxN, g >= 3 ? 12 : 9));
    var nagybol = (g <= 2) ? (veletlen(1, 5) <= 4) : (veletlen(0, 1) === 1);
    return { kulcs: "atv" + p.a + p.b + n + nagybol, p: p, n: n, nagybol: nagybol };
  });
  var p = r2.p, n = r2.n, f = p.f;
  var adott = r2.nagybol ? { n: n, u: p.a } : { n: n * f, u: p.b };
  var kerdezett = r2.nagybol ? { n: n * f, u: p.b } : { n: n, u: p.a };
  var kep = MR.svg360(MR.targy(liga, 80, 112, 1.15, n) + MR.tag(80, 134, mJel(adott.n, adott.u)) + MR.nyil(140, 212, 70) +
    MR.kerdoTag(272, 72, "? " + kerdezett.u));
  return mFeladat(cfg, { fajta: "atvaltas", kep: kep,
    kerdes: mB(adott.n, adott.u) + " hány <b>" + kerdezett.u + "</b>?",
    felolvas: mNagy(mMondd(adott.n, adott.u)) + " hány " + M_NEV[kerdezett.u] + "?",
    helyes: kerdezett.n, keplet: mJel(adott.n, adott.u) + " = ? " + kerdezett.u,
    megoldas: mJel(adott.n, adott.u) + " = " + mJel(kerdezett.n, kerdezett.u),
    tipp: "Egy " + M_NEV[p.a] + " az " + mSzo(f) + " " + M_NEV[p.b] + ", ezért " + (r2.nagybol ? "szorozd meg " : "oszd el ") + M_VAL[f] + "!",
    mk: { menny: menny, a: p.a, b: p.b, n: adott.n, u: adott.u, cel: kerdezett.u } });   /* mozgókép: 1. előfordulás + rossz válasz (meres-mozgo.js) */
}

/* ── 3) KIEGÉSZÍTÉS KEREK EGYSÉGRE (4.3) ── */
var M_KIEG = {
  hossz: { 2: [[1, "m", "cm"], [1, "m", "dm"], [1, "dm", "cm"]], 3: [[1, "km", "m"], [1, "cm", "mm"], [1, "m", "cm"], [1, "dm", "mm"], [1, "m", "mm"]] },
  ur:    { 2: [[1, "l", "dl"], [1, "l", "cl"], [1, "dl", "cl"]], 3: [[5, "l", "dl"], [10, "l", "dl"], [1, "l", "ml"], [1, "cl", "ml"], [1, "dl", "ml"], [1, "l", "cl"]],
           5: [[1, "hl", "l"], [1, "hl", "dl"]] },
  tomeg: { 2: [[1, "kg", "dkg"]], 3: [[1, "kg", "g"], [1, "dkg", "g"], [10, "dkg", "dkg"], [10, "dkg", "g"], [1, "kg", "dkg"]],
           5: [[1, "t", "kg"], [1, "q", "kg"], [1, "t", "q"]] }
};
function genKieg(cfg, kerultMar) {
  var g = Math.max(2, cfg.g), menny = cfg.mennyiseg, liga = MENNY[menny].liga, T = M_KIEG[menny];
  var lista = T[2].slice();
  if (g >= 3) lista = lista.concat(T[3]);
  if (g >= 5 && T[5]) lista = lista.concat(T[5], T[5]);
  var r = mEgyedi(kerultMar, function () {
    var t = mVel(g === 2 ? T[2] : lista), k = t[0], U = t[1], A = t[2];
    var osszA = k * M_SZ[U] / M_SZ[A];                 /* a cél A-ban */
    var B = A;
    if (g >= 4 && veletlen(0, 1)) {                    /* 4–5. o.: a válasz más egységben is lehet */
      var jel = MENNY[menny].egys[5].filter(function (u) { return M_SZ[u] > M_SZ[A] && M_SZ[u] < M_SZ[U]; });
      if (jel.length) B = mVel(jel);
    }
    var lep = M_SZ[B] / M_SZ[A];                       /* a meglévő mennyiség ennek többszöröse legyen */
    var db = osszA / lep, a;
    if (db < 2) { B = A; lep = 1; db = osszA; }
    var mDb = veletlen(1, db - 1);
    if (db >= 100 && veletlen(1, 3) > 1) mDb = Math.max(1, Math.round(mDb / 10) * 10 >= db ? mDb : Math.round(mDb / 10) * 10);
    a = mDb * lep;
    return { kulcs: "kieg" + k + U + A + B + a, k: k, U: U, A: A, B: B, a: a, hiany: (osszA - a) / lep, osszA: osszA };
  });
  var frac = r.a / r.osszA, cel = mJel(r.k, r.U);
  var kep, kerdes, felolv;
  if (liga === "bajital") {
    var dlSkala = (r.k === 1 && r.U === "l" && r.A === "dl");
    kep = MR.svg360(MR.henger(180, 10 * frac, { hiany: true, felso: cel, cimkeNelkul: !dlSkala }) + MR.tag(84, 110, mJel(r.a, r.A), { fs: 18 }) +
      '<path d="M' + (84 + mJel(r.a, r.A).length * 5 + 10) + ' 110 H146" stroke="#b79fd4" stroke-width="3" stroke-dasharray="4 4"/>');
    kerdes = "Az üvegben " + mB(r.a, r.A) + " bájital van. Hány <b>" + r.B + "</b> kell még, hogy " + mB(r.k, r.U) + " legyen?";
    felolv = "Az üvegben " + mMondd(r.a, r.A) + " bájital van. Hány " + M_NEV[r.B] + " kell még, hogy " + mMondd(r.k, r.U) + " legyen?";
  } else if (liga === "szabo") {
    var x0 = 22, W = 316, t = "";
    for (var i = 0; i <= 10; i++) t += '<line x1="' + (x0 + i * W / 10) + '" x2="' + (x0 + i * W / 10) + '" y1="96" y2="' + (i % 5 ? 104 : 110) + '" stroke="#8a6a1e" stroke-width="' + (i % 5 ? 1 : 2) + '"/>';
    kep = MR.svg360('<rect x="10" y="92" width="340" height="38" rx="4" fill="#ffe27a" stroke="#c79a2a" stroke-width="2"/>' + t +
      '<text x="180" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="#8a6a1e" ' + MR.F + '>' + cel + '</text>' +
      MR.szalag(x0, x0 + W * frac, 58, "#a7d99a", 26) +
      '<rect x="' + (x0 + W * frac + 2) + '" y="58" width="' + Math.max(6, W * (1 - frac) - 2) + '" height="26" rx="3" fill="#fff8d6" stroke="#e2589b" stroke-width="2.5" stroke-dasharray="6 4"/>' +
      '<text x="' + (x0 + W * (1 + frac) / 2) + '" y="78" text-anchor="middle" font-size="20" font-weight="800" fill="#e2589b" ' + MR.F + '>?</text>' +
      MR.tag(Math.max(60, x0 + W * frac / 2), 36, mJel(r.a, r.A), { fs: 16 }));
    kerdes = "A szalag " + mB(r.a, r.A) + " hosszú. Hány <b>" + r.B + "</b> hiányzik, hogy " + mB(r.k, r.U) + " legyen?";
    felolv = "A szalag " + mMondd(r.a, r.A) + " hosszú. Hány " + M_NEV[r.B] + " hiányzik, hogy " + mMondd(r.k, r.U) + " legyen?";
  } else {
    kep = MR.svg360(MR.kisMerleg(MR.vasSuly(0, -2, cel), MR.zsak(0, -2, "#f3e3c3", .62) + MR.tag(0, -58, mJel(r.a, r.A), { fs: 13 }) +
      '<text x="46" y="-40" font-size="24" font-weight="800" fill="#e2589b" ' + MR.F + '>?</text>', 8));
    kerdes = "A zsákban " + mB(r.a, r.A) + " liszt van. Hány <b>" + r.B + "</b> kell még, hogy " + mB(r.k, r.U) + " legyen?";
    felolv = "A zsákban " + mMondd(r.a, r.A) + " liszt van. Hány " + M_NEV[r.B] + " kell még, hogy " + mMondd(r.k, r.U) + " legyen?";
  }
  var tipp = mNagy(mMondd(r.k, r.U)) + " az " + mMondd(r.osszA, r.A) + ". " +
    (r.B === r.A ? mNagy(mSzamSzo(r.a)) + " meg mennyi lesz " + mSzamSzo(r.osszA) + "?"
                 : mNagy(mSzamSzo(r.osszA)) + " mínusz " + mSzamSzo(r.a) + " az " + mMondd(r.osszA - r.a, r.A) + ". Az hány " + M_NEV[r.B] + "?");
  return mFeladat(cfg, { fajta: "kiegeszites", kep: kep, kerdes: kerdes, felolvas: felolv, helyes: r.hiany, hosszu: true,
    keplet: mJel(r.a, r.A) + " + ? " + r.B + " = " + cel, megoldas: mJel(r.a, r.A) + " + " + mJel(r.hiany, r.B) + " = " + cel, tipp: tipp,
    mkk: { menny: menny, liga: liga, k: r.k, U: r.U, A: r.A, B: r.B, a: r.a, osszA: r.osszA, hiany: r.hiany } });   /* rossz válasz → „Mennyi hiányzik?” mozgókép (meres-mozgo.js) */
}

/* ── 4) MŰVELETEK MENNYISÉGEKKEL (4.4) — mindig egylépéses; hol mesés mondat, hol csupasz művelet ── */
var M_MESE = {
  hossz: {
    plusz: function (a, b, u) { return ["Egy " + mB(a[0], a[1]) + " és egy " + mB(b[0], b[1]) + " hosszú szalagot összevarrunk. Hány <b>" + u + "</b> hosszú lett?",
      "Egy " + mMondd(a[0], a[1]) + " és egy " + mMondd(b[0], b[1]) + " hosszú szalagot összevarrunk. Hány " + M_NEV[u] + " hosszú lett?"]; },
    minusz: function (a, b, u) { return ["A szalag " + mB(a[0], a[1]) + " hosszú. Levágunk belőle egy " + mB(b[0], b[1]) + " hosszú darabot. Hány <b>" + u + "</b> maradt?",
      "A szalag " + mMondd(a[0], a[1]) + " hosszú. Levágunk belőle egy " + mMondd(b[0], b[1]) + " hosszú darabot. Hány " + M_NEV[u] + " maradt?"]; },
    szor: function (a, n, u) { return ["Minden masnihoz " + mB(a[0], a[1]) + " szalag kell. Hány <b>" + u + "</b> kell <b>" + n + "</b> masnihoz?",
      "Minden masnihoz " + mMondd(a[0], a[1]) + " szalag kell. Hány " + M_NEV[u] + " kell " + mSzo(n) + " masnihoz?"]; },
    oszt: function (a, n, u) { return ["Egy " + mB(a[0], a[1]) + " hosszú szalagot <b>" + n + "</b> egyforma darabra vágunk. Hány <b>" + u + "</b> lesz egy darab?",
      "Egy " + mMondd(a[0], a[1]) + " hosszú szalagot " + mSzo(n) + " egyforma darabra vágunk. Hány " + M_NEV[u] + " lesz egy darab?"]; } },
  ur: {
    plusz: function (a, b, u) { return ["Az üstbe " + mB(a[0], a[1]) + " holdharmatot és " + mB(b[0], b[1]) + " csillagvizet öntünk. Hány <b>" + u + "</b> lett?",
      "Az üstbe " + mMondd(a[0], a[1]) + " holdharmatot és " + mMondd(b[0], b[1]) + " csillagvizet öntünk. Hány " + M_NEV[u] + " lett?"]; },
    minusz: function (a, b, u) { return ["A kannában " + mB(a[0], a[1]) + " bájital van. " + mB(b[0], b[1]) + " bájitalt kiöntünk. Hány <b>" + u + "</b> maradt?",
      "A kannában " + mMondd(a[0], a[1]) + " bájital van. " + mNagy(mMondd(b[0], b[1])) + " bájitalt kiöntünk. Hány " + M_NEV[u] + " maradt?"]; },
    szor: function (a, n, u) { return ["Minden üvegcsébe " + mB(a[0], a[1]) + " bájitalt töltünk. Hány <b>" + u + "</b> kell <b>" + n + "</b> üvegcsébe?",
      "Minden üvegcsébe " + mMondd(a[0], a[1]) + " bájitalt töltünk. Hány " + M_NEV[u] + " kell " + mSzo(n) + " üvegcsébe?"]; },
    oszt: function (a, n, u) { return [mB(a[0], a[1]) + " bájitalt <b>" + n + "</b> üvegcsébe egyformán szétosztunk. Hány <b>" + u + "</b> jut egy üvegcsébe?",
      mNagy(mMondd(a[0], a[1])) + " bájitalt " + mSzo(n) + " üvegcsébe egyformán szétosztunk. Hány " + M_NEV[u] + " jut egy üvegcsébe?"]; } },
  tomeg: {
    plusz: function (a, b, u) { return ["A pék " + mB(a[0], a[1]) + " lisztet és " + mB(b[0], b[1]) + " cukrot vett. Hány <b>" + u + "</b> ez együtt?",
      "A pék " + mMondd(a[0], a[1]) + " lisztet és " + mMondd(b[0], b[1]) + " cukrot vett. Hány " + M_NEV[u] + " ez együtt?"]; },
    minusz: function (a, b, u) { return ["A pékségben " + mB(a[0], a[1]) + " liszt van. " + mB(b[0], b[1]) + " lisztet felhasználunk. Hány <b>" + u + "</b> maradt?",
      "A pékségben " + mMondd(a[0], a[1]) + " liszt van. " + mNagy(mMondd(b[0], b[1])) + " lisztet felhasználunk. Hány " + M_NEV[u] + " maradt?"]; },
    szor: function (a, n, u) { return ["Minden kalácsba " + mB(a[0], a[1]) + " liszt kell. Hány <b>" + u + "</b> kell <b>" + n + "</b> kalácsba?",
      "Minden kalácsba " + mMondd(a[0], a[1]) + " liszt kell. Hány " + M_NEV[u] + " kell " + mSzo(n) + " kalácsba?"]; },
    oszt: function (a, n, u) { return [mB(a[0], a[1]) + " lisztet <b>" + n + "</b> egyforma részre osztunk. Hány <b>" + u + "</b> jut egy részre?",
      mNagy(mMondd(a[0], a[1])) + " lisztet " + mSzo(n) + " egyforma részre osztunk. Hány " + M_NEV[u] + " jut egy részre?"]; } }
};
/* a mesés feladatokban egységenként ekkora mennyiség még életszerű (szalag, üst, zsák); a csupasz műveletre nem vonatkozik */
var M_MESE_MAX = { mm: 900, cm: 600, dm: 100, m: 40, ml: 1000, cl: 400, dl: 100, l: 60, g: 1000, dkg: 400, kg: 60 };
var M_MESE_DB = { mm: 800, cm: 80, dm: 8, m: 3, ml: 500, cl: 50, dl: 5, l: 3, g: 600, dkg: 60, kg: 3 };   /* egy masni / üvegcse / kalács */
var M_MESE_MIN = { mm: 10, ml: 20, g: 20 };
/* kerekebb szám a nagyobb számkörökben (a gyerek fejben számol) */
function mKerekSzam(min, max, g) {
  var lep = g >= 5 ? 100 : (g >= 4 ? 50 : (g >= 3 ? 10 : 1));
  if (max - min < lep * 3) lep = 1;
  var n = veletlen(Math.ceil(min / lep), Math.floor(max / lep)) * lep;
  return Math.max(min, Math.min(max, n));
}
function genMuvelet(cfg, kerultMar) {
  var g = cfg.g, menny = cfg.mennyiseg, liga = MENNY[menny].liga, L = Math.min(M_HATAR[g], 10000);
  var E = mEgysegek(menny, g);
  var fajtak = ["plusz", "minusz"];
  if (g >= 2) fajtak.push(cfg.mese ? "plusz" : "hianyzo", "vegyes");
  if (g >= 3) fajtak.push("szor", "oszt");
  if (g >= 5 && !cfg.mese) fajtak.push("bennfog", "bennfog");
  var meseE = cfg.mese ? true : veletlen(0, 1) === 1;
  if (meseE) fajtak = fajtak.filter(function (x) { return x !== "hianyzo" && x !== "bennfog"; });
  var L0 = L;
  var r = mEgyedi(kerultMar, function () {
    var fj = mVel(fajtak), a, b, n;
    var UE = E.filter(function (x) { return !meseE || M_MESE_MAX[x]; });
    var u = mVel(UE.length ? UE : E);
    L = meseE && M_MESE_MAX[u] ? Math.min(L0, M_MESE_MAX[u]) : L0;
    if (fj === "plusz" || fj === "minusz" || fj === "hianyzo") {
      var mn = meseE ? (M_MESE_MIN[u] || 1) : 1;
      var c = mKerekSzam(Math.max(2 * mn, Math.min(10, L)), L, g);   /* az eredmény / a nagyobb szám */
      a = mKerekSzam(mn, c - mn, g); b = c - a;
      if (b < 1) { a = c - 1; b = 1; }
      return { kulcs: "mv" + fj + u + a + "|" + b, fj: fj, u: u, a: a, b: b };
    }
    if (fj === "vegyes") {                                        /* két szomszédos egység, az eredmény a finomabban */
      var parok = mParok(menny, Math.max(2, g), 100).filter(function (p) { return (p.f === 10 || (g <= 2 && p.f === 100)) && (!meseE || (M_MESE_MAX[p.a] && M_MESE_MAX[p.b])); });
      if (!parok.length) return { kulcs: "x" + Math.random(), fj: "plusz", u: u, a: 3, b: 4 };
      var p = mVel(parok), plusz = (g >= 3) ? veletlen(0, 1) === 1 : false;
      if (!plusz) {                                               /* „1 l − 2 dl”: egész nagy egységből */
        var egesz = veletlen(1, Math.max(1, Math.min(9, Math.floor(L / p.f)))), mind = egesz * p.f;
        b = mKerekSzam(1, mind - 1, Math.min(g, 3));
        return { kulcs: "mvv-" + p.a + p.b + egesz + "|" + b, fj: "vegyes", plusz: false, p: p, a: egesz, b: b };
      }
      var aN = veletlen(1, Math.max(1, Math.min(9, Math.floor(L / p.f / 2))));
      b = mKerekSzam(1, Math.max(1, L / 2), Math.min(g, 3));
      return { kulcs: "mvv+" + p.a + p.b + aN + "|" + b, fj: "vegyes", plusz: true, p: p, a: aN, b: b };
    }
    if (fj === "szor") {
      n = veletlen(2, 9); a = mKerekSzam(2, Math.max(2, Math.floor(L / n / (g >= 4 || meseE ? 1 : 2))), Math.min(g, 3));
      if (meseE && M_MESE_DB[u]) a = mKerekSzam(Math.max(1, Math.round(M_MESE_DB[u] / 8)), M_MESE_DB[u], M_MESE_DB[u] >= 100 ? 3 : 1);
      return { kulcs: "mvx" + u + a + "x" + n, fj: fj, u: u, a: a, n: n };
    }
    if (fj === "oszt") {
      n = veletlen(2, 9); var q = mKerekSzam(2, Math.max(2, Math.floor(L / n / (g >= 4 ? 1 : 2))), Math.min(g, 3));
      return { kulcs: "mvo" + u + q + ":" + n, fj: fj, u: u, a: q * n, n: n, q: q };
    }
    /* bennfoglalás (5. o.): „6 kg-ból hány 20 dkg-os adag?” */
    var bp = mParok(menny, g, 1000).filter(function (p) { return p.f <= 1000 && ["km", "hl", "q", "t"].indexOf(p.a) < 0; });
    var pp = mVel(bp), adag = mVel([2, 4, 5, 10, 20, 25, 50].filter(function (x) { return x < pp.f; }).concat([pp.f / 2]));
    var egeszDb = veletlen(1, 9), osszB = egeszDb * pp.f;
    if (osszB % adag) egeszDb = adag;                             /* mindig maradék nélkül */
    return { kulcs: "mvb" + pp.a + pp.b + egeszDb + "/" + adag, fj: "bennfog", p: pp, a: egeszDb, adag: adag };
  });
  var kep, kerdes, felolv, helyes, keplet, megold, tipp;
  var T = M_MESE[menny];
  if (r.fj === "plusz" || r.fj === "minusz") {
    var pl = r.fj === "plusz", A = pl ? r.a : r.a + r.b, B = r.b;
    helyes = pl ? r.a + r.b : r.a;
    if (meseE) { var ms = T[pl ? "plusz" : "minusz"]([A, r.u], [B, r.u], r.u); kerdes = ms[0]; felolv = ms[1]; }
    else {
      kerdes = mB(A, r.u) + (pl ? " + " : " − ") + mB(B, r.u) + " = <b>?</b>&nbsp;" + r.u;
      felolv = mNagy(mMondd(A, r.u)) + (pl ? " meg " : " mínusz ") + mMondd(B, r.u) + ", az hány " + M_NEV[r.u] + "?";
    }
    keplet = mJel(A, r.u) + (pl ? " + " : " − ") + mJel(B, r.u);
    megold = keplet + " = " + mJel(helyes, r.u);
    kep = mMuvKep(liga, pl ? "+" : "−", mJel(A, r.u), mJel(B, r.u));
    tipp = "Csak a számokkal számolj: " + mSzamSzo(A) + (pl ? " meg " : " mínusz ") + mSzamSzo(B) + ".";
  } else if (r.fj === "hianyzo") {
    var cc = r.a + r.b;
    kerdes = "<b>?</b>&nbsp;" + r.u + " + " + mB(r.b, r.u) + " = " + mB(cc, r.u);
    felolv = "Mennyi meg " + mMondd(r.b, r.u) + " lesz " + mMondd(cc, r.u) + "? Hány " + M_NEV[r.u] + "?";
    helyes = r.a; keplet = "? + " + mJel(r.b, r.u) + " = " + mJel(cc, r.u); megold = mJel(r.a, r.u) + " + " + mJel(r.b, r.u) + " = " + mJel(cc, r.u);
    kep = mMuvKep(liga, "+", "?", mJel(r.b, r.u));
    tipp = "Fordítva gondold: " + mSzamSzo(cc) + " mínusz " + mSzamSzo(r.b) + ".";
  } else if (r.fj === "vegyes") {
    var p = r.p, egesz = mJel(r.a, p.a), bb = mJel(r.b, p.b), atv = r.a * p.f;
    helyes = r.plusz ? atv + r.b : atv - r.b;
    if (meseE) { var mv = T[r.plusz ? "plusz" : "minusz"]([r.a, p.a], [r.b, p.b], p.b); kerdes = mv[0]; felolv = mv[1]; }
    else {
      kerdes = mB(r.a, p.a) + (r.plusz ? " + " : " − ") + mB(r.b, p.b) + " = <b>?</b>&nbsp;" + p.b;
      felolv = mNagy(mMondd(r.a, p.a)) + (r.plusz ? " meg " : " mínusz ") + mMondd(r.b, p.b) + ", az hány " + M_NEV[p.b] + "?";
    }
    keplet = egesz + (r.plusz ? " + " : " − ") + bb; megold = keplet + " = " + mJel(helyes, p.b);
    kep = mMuvKep(liga, r.plusz ? "+" : "−", egesz, bb);
    tipp = "Előbb váltsd át: " + mMondd(r.a, p.a) + " az " + mMondd(atv, p.b) + ".";
  } else if (r.fj === "szor") {
    helyes = r.a * r.n;
    if (meseE) { var mx = T.szor([r.a, r.u], r.n, r.u); kerdes = mx[0]; felolv = mx[1]; }
    else { kerdes = mB(r.a, r.u) + " × " + r.n + " = <b>?</b>&nbsp;" + r.u; felolv = mNagy(szorSzo(r.n)) + " " + mMondd(r.a, r.u) + ", az hány " + M_NEV[r.u] + "?"; }
    keplet = mJel(r.a, r.u) + " × " + r.n; megold = keplet + " = " + mJel(helyes, r.u);
    kep = mMuvKep(liga, "×", mJel(r.a, r.u), String(r.n));
    tipp = "Csak a számokkal számolj: " + szorSzo(r.n) + " " + mSzamSzo(r.a) + ".";
  } else if (r.fj === "oszt") {
    helyes = r.q;
    if (meseE) { var mo = T.oszt([r.a, r.u], r.n, r.u); kerdes = mo[0]; felolv = mo[1]; }
    else { kerdes = mB(r.a, r.u) + " : " + r.n + " = <b>?</b>&nbsp;" + r.u; felolv = mNagy(mMondd(r.a, r.u)) + " osztva " + osztVal(r.n) + ", az hány " + M_NEV[r.u] + "?"; }
    keplet = mJel(r.a, r.u) + " : " + r.n; megold = keplet + " = " + mJel(helyes, r.u);
    kep = mMuvKep(liga, ":", mJel(r.a, r.u), String(r.n));
    tipp = "Gondolj a szorzásra: " + szorSzo(r.n) + " mennyi az " + mSzamSzo(r.a) + "?";
  } else {
    var pp = r.p, osszB = r.a * pp.f;
    helyes = osszB / r.adag;
    kerdes = mB(r.a, pp.a) + mBolJel(pp.a) + " hány " + mB(r.adag, pp.b) + mOsJel(pp.b) + " adag lesz?";
    felolv = mNagy(mSzo(r.a)) + " " + mBol(pp.a) + " hány " + mSzo(r.adag) + " " + mOs(pp.b) + " adag lesz?";
    keplet = mJel(r.a, pp.a) + " : " + mJel(r.adag, pp.b); megold = mJel(osszB, pp.b) + " : " + mJel(r.adag, pp.b) + " = " + helyes;
    kep = mMuvKep(liga, ":", mJel(r.a, pp.a), mJel(r.adag, pp.b));
    tipp = "Előbb váltsd át: " + mMondd(r.a, pp.a) + " az " + mMondd(osszB, pp.b) + ". Hányszor van meg benne " + mAz(r.adag) + " " + mSzamSzo(r.adag) + "?";
  }
  return mFeladat(cfg, { fajta: "muvelet-" + r.fj, kep: kep, kerdes: kerdes, felolvas: felolv, helyes: helyes, hosszu: meseE,
    keplet: keplet, megoldas: megold, tipp: tipp });
}
/* művelet-kép: bal tárgy + jel + jobb tárgy (a szabónál kivonáskor olló) */
function mMuvKep(liga, jel, bal, jobb) {
  var ki = (jel === "−");
  if (liga === "szabo" && ki)
    return MR.svg360(MR.szalag(20, 196, 56, "#9ec9f0", 26) + MR.szalag(236, 312, 70, "#9ec9f0", 26) + MR.ollo(214, 68) +
      MR.tag(108, 112, bal, { fs: 16 }) + MR.tag(274, 120, jobb, { fs: 16 }));
  var jobbTargy = /^\d+$/.test(jobb) ? MR.tag(272, 84, jobb, { fs: 30 })
    : MR.targy(liga, 272, 120, .8, 1) + MR.tag(272, 138, jobb, { fs: 16, dash: jobb === "?", st: jobb === "?" ? "#e2589b" : undefined });
  var balRajz = bal === "?" ? MR.targy(liga, 88, 120, 1, 0) + MR.kerdoTag(88, 138, "?", 16) : MR.targy(liga, 88, 120, 1, 0) + MR.tag(88, 138, bal, { fs: 16 });
  return MR.svg360(balRajz + MR.jel(180, 98, jel) + jobbTargy);
}

/* ── 8) ÖSSZETETT ALAK (4.8): 4. o. könnyű, 5. o. teljes; mindkét irány (az egyszerűből összetettbe két kérdés) ── */
function genOsszetett(cfg, kerultMar) {
  var g = cfg.g, menny = cfg.mennyiseg, liga = MENNY[menny].liga;
  var konnyu = { hossz: [["m", "dm"], ["dm", "cm"], ["cm", "mm"]], ur: [["l", "dl"], ["dl", "cl"], ["cl", "ml"]], tomeg: [["kg", "dkg"], ["dkg", "g"]] };
  var teljes = { hossz: [["km", "m"], ["m", "cm"], ["m", "dm"], ["m", "mm"], ["dm", "mm"]], ur: [["hl", "l"], ["l", "dl"], ["l", "cl"], ["l", "ml"], ["hl", "dl"]],
                 tomeg: [["t", "kg"], ["q", "kg"], ["t", "q"], ["kg", "dkg"], ["kg", "g"]] };
  var r = mEgyedi(kerultMar, function () {
    var par = mVel(g >= 5 ? teljes[menny] : konnyu[menny]), U1 = par[0], U2 = par[1], f = M_SZ[U1] / M_SZ[U2];
    var a = veletlen(1, g >= 5 ? 9 : 5), b = veletlen(1, f - 1);
    if (g >= 5 && f >= 100 && veletlen(1, 4) === 1) b = veletlen(1, 9);            /* nullás csapda: 2 t 5 kg = 2005 kg */
    var irany = veletlen(0, 2) ? "a" : "b", cel = U2, szokatlan = false;
    /* 5. o.: néha a finomabb harmadik egységben kérdez (6 kg 2 dkg = 6020 g) */
    if (g >= 5 && irany === "a" && veletlen(1, 4) === 1) {
      var fin = MENNY[menny].egys[5].filter(function (u) { return M_SZ[u] < M_SZ[U2] && (a * M_SZ[U1] + b * M_SZ[U2]) / M_SZ[u] <= 100000; });
      if (fin.length) cel = fin[fin.length - 1];
    }
    if (g >= 5 && irany === "a" && cel === U2 && f === 100 && veletlen(1, 5) === 1) { b = veletlen(11, 19) * 10; szokatlan = true; }   /* 4 kg 150 dkg */
    return { kulcs: "ot" + U1 + U2 + a + "|" + b + irany + cel, U1: U1, U2: U2, f: f, a: a, b: b, irany: irany, cel: cel, szokatlan: szokatlan };
  });
  var osszJel = r.a + " " + r.U1 + " " + r.b + " " + r.U2, ossz = r.a * M_SZ[r.U1] + r.b * M_SZ[r.U2];
  if (r.irany === "a") {
    var v = ossz / M_SZ[r.cel];
    var kep = MR.svg360(MR.targy(liga, 90, 134, 1.4, r.a) + MR.tag(236, 70, osszJel, { fs: 22 }) + MR.nyil(200, 272, 108) + MR.kerdoTag(310, 108, "? " + r.cel, 20));
    return mFeladat(cfg, { fajta: "osszetett", kep: kep, kerdes: "<b>" + osszJel + "</b> hány <b>" + r.cel + "</b>?",
      felolvas: mNagy(mMondd(r.a, r.U1)) + " " + mMondd(r.b, r.U2) + " hány " + M_NEV[r.cel] + "?", helyes: v,
      keplet: osszJel + " = ? " + r.cel, megoldas: osszJel + " = " + mJel(v, r.cel),
      tipp: mNagy(mMondd(r.a, r.U1)) + " az " + mMondd(r.a * M_SZ[r.U1] / M_SZ[r.cel], r.cel) + ", meg még " + mMondd(r.b * M_SZ[r.U2] / M_SZ[r.cel], r.cel) + "." });
  }
  /* egyszerűből összetettbe: két kérdés (hány egész …? · és még hány …?) */
  var b0 = r.b % r.f, a0 = r.a + Math.floor(r.b / r.f), osszU2 = ossz / M_SZ[r.U2];
  var kepB = MR.svg360(MR.targy(liga, 100, 134, 1.5, r.a) + MR.tag(250, 76, mJel(osszU2, r.U2), { fs: 24 }));
  var ures = function (t, jo) { return '<span class="ures' + (jo ? ' jo' : '') + '">' + t + '</span>'; };
  var masodik = mFeladat(cfg, { fajta: "osszetett-b", kep: kepB,
    kerdes: mB(osszU2, r.U2) + " = " + ures(a0, true) + "&nbsp;" + r.U1 + " " + ures("?") + "&nbsp;" + r.U2 + "<br>És még hány <b>" + r.U2 + "</b>?",
    felolvas: "És még hány " + M_NEV[r.U2] + "?", helyes: b0, keplet: mJel(osszU2, r.U2) + " = " + a0 + " " + r.U1 + " ? " + r.U2,
    megoldas: mJel(osszU2, r.U2) + " = " + a0 + " " + r.U1 + " " + b0 + " " + r.U2,
    tipp: mNagy(mMondd(a0, r.U1)) + " az " + mMondd(a0 * r.f, r.U2) + ". " + mNagy(mSzamSzo(osszU2)) + " mínusz " + mSzamSzo(a0 * r.f) + "." });
  return mFeladat(cfg, { fajta: "osszetett-b", kep: kepB,
    kerdes: mB(osszU2, r.U2) + " = " + ures("?") + "&nbsp;" + r.U1 + " " + ures("…") + "&nbsp;" + r.U2 + "<br>Hány egész <b>" + r.U1 + "</b>?",
    felolvas: mNagy(mMondd(osszU2, r.U2)) + ". Hány egész " + M_NEV[r.U1] + "?", helyes: a0,
    keplet: mJel(osszU2, r.U2) + " = ? " + r.U1 + " … " + r.U2, megoldas: mJel(osszU2, r.U2) + " = " + a0 + " " + r.U1 + " " + b0 + " " + r.U2,
    tipp: "Egy " + M_NEV[r.U1] + " az " + mMondd(r.f, r.U2) + ". " + mNagy(mSzamSzo(osszU2)) + " " + mBen(r.U2) + " hányszor van meg " + mAz(r.f) + " " + mSzamSzo(r.f) + "?",
    lanc: [masodik] });
}

/* ── 1) MÉRÉS, LEOLVASÁS (4.1) ── */
function genMeres(cfg, kerultMar) {
  var g = cfg.g, liga = MENNY[cfg.mennyiseg].liga, F = MR.F;
  if (liga === "szabo") {
    if (g <= 1) {                                       /* hány méterrúd hosszú a szalag? */
      var r1 = mEgyedi(kerultMar, function () { var n = veletlen(2, 5); return { kulcs: "mr" + n, n: n }; });
      var w = 300 / r1.n, rud = "";
      for (var i = 0; i < r1.n; i++) rud += MR.mRud(30 + i * w, 96, w - 2, "1 m");
      return mFeladat(cfg, { fajta: "meres-rud", kep: MR.svg360(MR.szalag(30, 330, 52, "#f6a5c0", 30) + rud),
        kerdes: "A szalag alá méterrudakat tettünk. Hány <b>m</b> hosszú a szalag?", felolvas: "A szalag alá méterrudakat tettünk. Hány méter hosszú a szalag?",
        helyes: r1.n, keplet: "a szalag = ? m", megoldas: "a szalag = " + r1.n + " m", tipp: "Számold meg a méterrudakat!" });
    }
    var mmE = (g >= 3 && veletlen(0, 1) === 1), csapda = (g >= 3 && !mmE);
    var r = mEgyedi(kerultMar, function () {
      if (mmE) { var e = veletlen(21, 118); if (e % 10 === 0) e++; return { kulcs: "mmm" + e, s: 0, e: e }; }
      var s = csapda ? veletlen(1, 4) : 0, hossz = veletlen(2, 12 - s);
      return { kulcs: "mcm" + s + "|" + hossz, s: s * 10, e: (s + hossz) * 10 };
    });
    var x0 = 22, u = 25, t = "";
    for (var k = 0; k <= 120; k++) {
      var x = x0 + k * u / 10, cm = k % 10 === 0, fel = k % 5 === 0;
      t += '<line x1="' + x + '" x2="' + x + '" y1="98" y2="' + (98 + (cm ? 16 : fel ? 10 : 6)) + '" stroke="#8a6a1e" stroke-width="' + (cm ? 2 : 1) + '"/>';
      if (cm) t += '<text x="' + x + '" y="130" text-anchor="middle" font-size="12" font-weight="700" fill="#8a6a1e" ' + F + '>' + (k / 10) + '</text>';
    }
    var xs = x0 + r.s * u / 10, xe = x0 + r.e * u / 10;
    var kep = MR.svg360('<rect x="10" y="96" width="342" height="42" rx="5" fill="#fff6d6" stroke="#d6b75c" stroke-width="2"/>' + t +
      '<text x="348" y="130" text-anchor="end" font-size="11" font-weight="700" fill="#8a6a1e" ' + F + '>cm</text>' +
      MR.szalag(xs, xe, 58, "#f6a5c0", 26) + '<path d="M' + xe + ' 58 l12 13 l-12 13" fill="#f6a5c0"/>' +
      '<path d="M' + xs + ' 84 V98 M' + xe + ' 84 V98" stroke="#c77fb4" stroke-width="2" stroke-dasharray="3 3"/>');
    if (mmE) return mFeladat(cfg, { fajta: "meres-mm", kep: kep, kerdes: "Hány <b>mm</b> hosszú a szalag?", felolvas: "Hány milliméter hosszú a szalag?",
      helyes: r.e, keplet: "a szalag = ? mm", megoldas: Math.floor(r.e / 10) + " cm " + (r.e % 10) + " mm = " + r.e + " mm",
      tipp: "Egy centiméter az tíz milliméter. " + mNagy(mMondd(Math.floor(r.e / 10), "cm")) + " az " + mMondd(Math.floor(r.e / 10) * 10, "mm") + ", meg még " + mMondd(r.e % 10, "mm") + "." });
    var hosszCm = (r.e - r.s) / 10;
    return mFeladat(cfg, { fajta: r.s ? "meres-csapda" : "meres-cm", kep: kep, kerdes: "Hány <b>cm</b> hosszú a szalag?", felolvas: "Hány centiméter hosszú a szalag?",
      helyes: hosszCm, keplet: "a szalag = ? cm", megoldas: r.s ? ((r.e / 10) + " − " + (r.s / 10) + " = " + hosszCm + " cm") : ("a szalag = " + hosszCm + " cm"),
      tipp: r.s ? "Vigyázz, a szalag nem a nullánál kezdődik! " + mNagy(mSzamSzo(r.e / 10)) + " mínusz " + mSzamSzo(r.s / 10) + "." : "Nézd meg, melyik számnál ér véget a szalag!" });
  }
  if (liga === "bajital") {
    if (g <= 1) {                                       /* hány decis pohár fér bele? */
      var r2 = mEgyedi(kerultMar, function () { var n = veletlen(2, 8); return { kulcs: "mp" + n, n: n }; });
      var poh = "";
      for (var j = 0; j < r2.n; j++) poh += MR.pohar(150 + (j % 4) * 50, j < 4 ? 76 : 138, "#c79bea", "1 dl");
      return mFeladat(cfg, { fajta: "meres-pohar", kep: MR.svg360(MR.lombik(70, 138, "#c79bea", 1.35) + MR.nyil(112, 134, 80) + poh),
        kerdes: "Az üvegből ennyi decis poharat töltöttünk tele. Hány <b>dl</b> bájital volt az üvegben?",
        felolvas: "Az üvegből ennyi decis poharat töltöttünk tele. Hány deciliter bájital volt az üvegben?",
        helyes: r2.n, keplet: "? dl", megoldas: r2.n + " pohár = " + r2.n + " dl", tipp: "Számold meg a poharakat! Mindegyikben egy deciliter van." });
    }
    var sk = (g >= 3) ? mVel([{ u: "cl", l: 10, f: "1 l" }, { u: "ml", l: 100, f: "1 l" }, { u: "dl", l: 1, f: "1 l" }]) : { u: "dl", l: 1, f: "1 l" };
    var r3 = mEgyedi(kerultMar, function () { var n = veletlen(1, 9); return { kulcs: "mh" + sk.u + n, n: n }; });
    var cimke = sk.l === 1 ? null : function (k) { return k * sk.l; };
    return mFeladat(cfg, { fajta: "meres-henger", kep: MR.svg360(MR.henger(200, r3.n, { cimke: cimke, felso: sk.u }) +
        (sk.u === "dl" ? MR.pohar(100, 138, "#c79bea", "1 dl") + '<text x="100" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="#8a7ba8" ' + F + '>ilyen egy deci</text>' : "")),
      kerdes: "Hány <b>" + sk.u + "</b> bájital van a mérőpohárban?", felolvas: "Hány " + M_NEV[sk.u] + " bájital van a mérőpohárban?",
      helyes: r3.n * sk.l, keplet: "a mérőpohárban ? " + sk.u, megoldas: "a mérőpohárban " + (r3.n * sk.l) + " " + sk.u,
      tipp: "Keresd meg, melyik vonalnál áll a bájital teteje, és olvasd le mellette a számot!" });
  }
  /* pékség: kétkarú mérleg egyensúlyban, a súlyok összege = a kalács */
  if (g <= 1) {
    var r4 = mEgyedi(kerultMar, function () { var n = veletlen(2, 5); return { kulcs: "mk" + n, n: n }; });
    var vs = "", also = Math.min(r4.n >= 4 ? 4 : 3, r4.n), msz = r4.n >= 4 ? .68 : .8;   /* 4–5 súly: 4 alul, kisebbek — ne érjen a mérleg karjához */
    for (var q = 0; q < r4.n; q++) {
      var sor = q < also ? 0 : 1, db = sor ? r4.n - also : also, hely = sor ? q - also : q;
      vs += MR.vasSuly((hely - (db - 1) / 2) * 48, -2 - sor * 46, "1 kg", 19);
    }
    return mFeladat(cfg, { fajta: "meres-kg", kep: MR.svg360(MR.kisMerleg(MR.zsak(0, -2, "#f3e3c3", .8), '<g transform="scale(' + msz + ')">' + vs + '</g>', 0, 64)),
      kerdes: "A mérleg egyensúlyban van. Minden súly <b>1 kg</b>. Hány <b>kg</b> a zsák?", felolvas: "A mérleg egyensúlyban van. Minden súly egy kilogramm. Hány kilogramm a zsák?",
      helyes: r4.n, keplet: "a zsák = ? kg", megoldas: "a zsák = " + r4.n + " kg", tipp: "Számold meg a súlyokat! Mindegyik egy kilogramm." });
  }
  var gramm = (g >= 3 && veletlen(0, 1) === 1);
  var keszlet = gramm ? [500, 200, 100, 50, 20, 10, 5, 2, 1] : [50, 20, 10, 5, 2, 1];
  var egys = gramm ? "g" : "dkg";
  var r5 = mEgyedi(kerultMar, function () {
    var db = veletlen(2, 3), lista = [], sum = 0, pool = keszlet.slice();
    for (var z = 0; z < db; z++) { var s = mVel(pool); pool.splice(pool.indexOf(s), 1); lista.push(s); sum += s; }
    lista.sort(function (a, b) { return b - a; });
    return { kulcs: "mm" + egys + lista.join("+"), lista: lista, sum: sum };
  });
  var sulyok = "", xx = -((r5.lista.length - 1) * 21);
  r5.lista.forEach(function (s, ii) { sulyok += MR.suly(xx + ii * 42, -2, s, egys, s >= 100 ? 1.55 : (s >= 10 ? 1.42 : 1.3)); });
  return mFeladat(cfg, { fajta: "meres-merleg", kep: MR.svg360(MR.kisMerleg(MR.kalacs(0, -2, 1.05), sulyok, 0, 64)),
    kerdes: "A mérleg egyensúlyban van. Hány <b>" + egys + "</b> a kalács?", felolvas: "A mérleg egyensúlyban van. Hány " + M_NEV[egys] + " a kalács?",
    helyes: r5.sum, keplet: r5.lista.join(" + ") + " = ?", megoldas: r5.lista.join(" + ") + " = " + r5.sum + " " + egys,
    tipp: "Add össze a súlyokat: " + r5.lista.map(mSzamSzo).join(" meg ") + "." });
}

/* ── 5a) MENNYIVEL? (az összehasonlítás szóbeli fele; az 1. szakaszban még kártya nélkül) ── */
function genMennyivel(cfg, kerultMar) {
  var g = Math.max(2, cfg.g), menny = cfg.mennyiseg, liga = MENNY[menny].liga, L = M_HATAR[g];
  var P0 = mParok(menny, g, g >= 5 ? 1000 : (g >= 3 ? 100 : 10));
  if (!P0.length) P0 = mParok(menny, g, 100);
  var r = mEgyedi(kerultMar, function () {
    var p = mVel(P0), n = veletlen(1, Math.max(1, Math.min(9, Math.floor(L / p.f)))), nagyB = n * p.f, kis;
    do { kis = mKerekSzam(Math.max(1, Math.round(nagyB / 4)), Math.min(L, nagyB * 2), Math.min(g, 3)); } while (kis === nagyB);
    return { kulcs: "mny" + p.a + n + "|" + kis, p: p, n: n, kis: kis, nagyB: nagyB };
  });
  var p = r.p, kul = Math.abs(r.nagyB - r.kis), csere = veletlen(0, 1) === 1;
  var egyik = csere ? [r.kis, p.b] : [r.n, p.a], masik = csere ? [r.n, p.a] : [r.kis, p.b];
  var tobb = MENNY[menny].tobb;
  var kep = MR.svg360(MR.targy(liga, 90, 120, 1, 0) + MR.tag(90, 138, mJel(egyik[0], egyik[1]), { fs: 16 }) + MR.jel(180, 98, "?", 30) +
    MR.targy(liga, 270, 120, 1, 2) + MR.tag(270, 138, mJel(masik[0], masik[1]), { fs: 16 }));
  return mFeladat(cfg, { fajta: "mennyivel", kep: kep,
    kerdes: mB(egyik[0], egyik[1]) + " és " + mB(masik[0], masik[1]) + ". Mennyivel " + tobb + " az egyik? Hány <b>" + p.b + "</b>?",
    felolvas: mNagy(mMondd(egyik[0], egyik[1])) + " és " + mMondd(masik[0], masik[1]) + ". Mennyivel " + tobb + " az egyik? Hány " + M_NEV[p.b] + "?",
    helyes: kul, hosszu: true, keplet: mJel(r.nagyB, p.b) + " − " + mJel(r.kis, p.b),
    megoldas: mJel(Math.max(r.nagyB, r.kis), p.b) + " − " + mJel(Math.min(r.nagyB, r.kis), p.b) + " = " + mJel(kul, p.b),
    tipp: "Előbb váltsd át: " + mMondd(r.n, p.a) + " az " + mMondd(r.nagyB, p.b) + ". Aztán vond ki a kisebbet a nagyobból." });
}

/* ── 11) SZÖVEGES FELADAT (4.11, 3. szakasz): a lépésszám osztályonként nő — 1. o. 1 lépés · 2–3. o. 2 lépés ·
      4–5. o. 2–3 lépés, átváltással. A „vegig” mező a részkérdések sora: rossz válasz után a gép lépésenként
      végigvezet (meresVegigvezet), mint a Zrínyi-állomáson, végül újra a főkérdés. ── */
var M_SZ_PAR = { hossz: [["m", "dm"], ["dm", "cm"], ["m", "cm"], ["cm", "mm"], ["km", "m"]],
                 ur: [["l", "dl"], ["dl", "cl"], ["l", "cl"], ["dl", "ml"], ["l", "ml"], ["hl", "l"]],
                 tomeg: [["kg", "dkg"], ["dkg", "g"], ["kg", "g"], ["q", "kg"], ["t", "kg"]] };
/* az átváltós történetek egységpárjai (a nagy egység n-szerese belefér a számkörbe és életszerű) */
function mSzParok(menny, g, L) {
  var E = mEgysegek(menny, g);
  return M_SZ_PAR[menny].map(function (p) { return { a: p[0], b: p[1], f: M_SZ[p[0]] / M_SZ[p[1]] }; }).filter(function (p) {
    return E.indexOf(p.a) >= 0 && E.indexOf(p.b) >= 0 && p.f * 2 <= L && (!M_MESE_MAX[p.b] || p.f <= M_MESE_MAX[p.b]);
  });
}
function mLep(k, f, h, m) { return { k: k, f: f, h: h, m: m }; }
function genSzoveges(cfg, kerultMar) {
  var g = cfg.g, menny = cfg.mennyiseg;
  if (g <= 1) {                                                   /* 1. o.: egylépéses (a mesés művelet) */
    var c = {}; for (var k in cfg) c[k] = cfg[k];
    c.mese = true;
    var f1 = genMuvelet(c, kerultMar);
    f1.naplo.tipus = f1.naplo.tipus.replace("muvelet", "szoveges");
    return f1;
  }
  var L = Math.min(M_HATAR[g], 10000);
  var UE = mEgysegek(menny, g).filter(function (u) { return M_MESE_MAX[u]; });
  var fajtak = g <= 2 ? ["ket", "atv"] : (g === 3 ? ["ket", "atv", "szorkiv", "osszoszt"] : ["ket", "atv", "atv", "szorkiv", "szorkiv", "osszoszt", "osszoszt"]);
  if (!mSzParok(menny, g, L).length) fajtak = fajtak.filter(function (x) { return x !== "atv"; });
  var r = mEgyedi(kerultMar, function () {
    var fj = mVel(fajtak), u = mVel(UE), Lu = Math.min(L, M_MESE_MAX[u]), mn = M_MESE_MIN[u] || 1, gg = Math.min(g, 3);
    if (fj === "ket") {                                           /* van → még hozzá → elvesz */
      var tot = mKerekSzam(Math.max(10, 3 * mn), Lu, gg), a = mKerekSzam(mn, tot - mn, gg), c0 = mKerekSzam(mn, tot - mn, gg);
      return { kulcs: "sz-ket" + u + a + "|" + tot + "|" + c0, fj: fj, u: u, a: a, b: tot - a, c: c0, tot: tot };
    }
    if (fj === "atv") {                                           /* n nagy egységből elvesz valamennyit a kicsiben */
      var p = mVel(mSzParok(menny, g, L)), n = veletlen(1, Math.max(1, Math.min(g >= 4 ? 9 : 5, Math.floor(L / p.f)))), ossz = n * p.f;
      var b = mKerekSzam(1, ossz - 1, gg);
      return { kulcs: "sz-atv" + p.a + p.b + n + "|" + b, fj: fj, p: p, n: n, ossz: ossz, b: b };
    }
    if (fj === "szorkiv") {                                       /* n darabhoz egyenként a kell; ennyiből marad? (4–5. o.: a készlet a nagy egységben) */
      var UD = UE.filter(function (x) { return M_MESE_DB[x] && x !== "mm"; }), B = mVel(UD.length ? UD : UE), DB = M_MESE_DB[B] || 10;   /* masnit nem mérünk milliméterben */
      var a2 = mKerekSzam(Math.max(1, Math.round(DB / 8)), DB, DB >= 100 ? 3 : 1), db = veletlen(2, 6), kell = a2 * db;
      var par = null, m = 0;
      if (g >= 4) {
        var jel = mSzParok(menny, g, L).filter(function (q) { return q.b === B && Math.ceil((kell + 1) / q.f) <= 9 && Math.ceil((kell + 1) / q.f) * q.f <= L; });
        if (jel.length) { par = mVel(jel); m = veletlen(Math.ceil((kell + 1) / par.f), Math.min(9, Math.floor(L / par.f))); }
      }
      var keszlet = par ? m * par.f : 0;
      if (!par) {                                                 /* kerek készlet: 18 → 20/30, 144 → 200/300, 2010 → 3000 */
        var lp = Math.pow(10, Math.max(0, Math.floor(Math.log10(kell)))), fel = Math.ceil((kell + 1) / lp);
        keszlet = (fel + veletlen(0, 2)) * lp;
        if (keszlet > Math.min(L, M_MESE_MAX[B] || L)) keszlet = fel * lp;
      }
      return { kulcs: "sz-szk" + B + a2 + "x" + db + "|" + keszlet, fj: fj, u: B, a: a2, db: db, kell: kell, keszlet: keszlet, par: par, m: m };
    }
    /* osszoszt: két mennyiség össze, aztán n egyforma részre (4–5. o.: az egyik a nagy egységben) */
    var n2 = veletlen(2, g >= 4 ? 9 : 5), par2 = null;
    if (g >= 4) { var j2 = mSzParok(menny, g, L).filter(function (q) { return q.b === u && q.f * 2 <= Lu; }); if (j2.length && veletlen(0, 2)) par2 = mVel(j2); }
    var q0 = mKerekSzam(1, Math.max(1, Math.floor(Lu / n2)), Math.min(g, 3)), ossz2 = q0 * n2, aN, bN;
    if (par2) {
      if (ossz2 <= par2.f) { q0 = Math.ceil((par2.f + 1) / n2); ossz2 = q0 * n2; }
      aN = veletlen(1, Math.max(1, Math.floor((ossz2 - 1) / par2.f))); bN = ossz2 - aN * par2.f;
    } else { if (ossz2 < 2) { q0 = 1; n2 = 2; ossz2 = 2; } aN = mKerekSzam(1, ossz2 - 1, Math.min(g, 3)); bN = ossz2 - aN; }
    return { kulcs: "sz-oo" + u + aN + "|" + bN + ":" + n2, fj: "osszoszt", u: u, a: aN, b: bN, n: n2, q: q0, ossz: ossz2, par: par2 };
  });
  /* a történet: s (képernyő), sf (felolvasás), a lépések (utolsó = a főkérdés) */
  var s, sf, lep = [], U, Uf;
  function mm(n, u) { return mMondd(n, u); }
  if (r.fj === "ket") {
    U = "<b>" + r.u + "</b>"; Uf = M_NEV[r.u];
    var A = mB(r.a, r.u), B2 = mB(r.b, r.u), C = mB(r.c, r.u), Af = mm(r.a, r.u), Bf = mm(r.b, r.u), Cf = mm(r.c, r.u);
    if (menny === "hossz") {
      s = "A szabónak " + A + " szalagja volt. Vett még " + B2 + " szalagot. Aztán levágott belőle egy " + C + " hosszú darabot.";
      sf = "A szabónak " + Af + " szalagja volt. Vett még " + Bf + " szalagot. Aztán levágott belőle egy " + Cf + " hosszú darabot.";
      lep.push(mLep("Először: hány " + U + " szalagja lett, amikor vett még?", "Először: hány " + Uf + " szalagja lett, amikor vett még?", r.tot, mJel(r.a, r.u) + " + " + mJel(r.b, r.u) + " = " + mJel(r.tot, r.u)));
      lep.push(mLep("Hány " + U + " szalagja maradt?", "Hány " + Uf + " szalagja maradt?", r.tot - r.c, mJel(r.tot, r.u) + " − " + mJel(r.c, r.u) + " = " + mJel(r.tot - r.c, r.u)));
    } else if (menny === "ur") {
      s = "Az üstben " + A + " bájital volt. Beleöntöttünk még " + B2 + " holdharmatot. Aztán " + C + " bájitalt kimertünk belőle.";
      sf = "Az üstben " + Af + " bájital volt. Beleöntöttünk még " + Bf + " holdharmatot. Aztán " + Cf + " bájitalt kimertünk belőle.";
      lep.push(mLep("Először: hány " + U + " lett az üstben, amikor beleöntöttük a holdharmatot?", "Először: hány " + Uf + " lett az üstben, amikor beleöntöttük a holdharmatot?", r.tot, mJel(r.a, r.u) + " + " + mJel(r.b, r.u) + " = " + mJel(r.tot, r.u)));
      lep.push(mLep("Hány " + U + " bájital maradt az üstben?", "Hány " + Uf + " bájital maradt az üstben?", r.tot - r.c, mJel(r.tot, r.u) + " − " + mJel(r.c, r.u) + " = " + mJel(r.tot - r.c, r.u)));
    } else {
      s = "A péknek " + A + " lisztje volt. Vett még " + B2 + " lisztet. Aztán " + C + " lisztet beledagasztott a kenyérbe.";
      sf = "A péknek " + Af + " lisztje volt. Vett még " + Bf + " lisztet. Aztán " + Cf + " lisztet beledagasztott a kenyérbe.";
      lep.push(mLep("Először: hány " + U + " lisztje lett, amikor vett még?", "Először: hány " + Uf + " lisztje lett, amikor vett még?", r.tot, mJel(r.a, r.u) + " + " + mJel(r.b, r.u) + " = " + mJel(r.tot, r.u)));
      lep.push(mLep("Hány " + U + " lisztje maradt?", "Hány " + Uf + " lisztje maradt?", r.tot - r.c, mJel(r.tot, r.u) + " − " + mJel(r.c, r.u) + " = " + mJel(r.tot - r.c, r.u)));
    }
  } else if (r.fj === "atv") {
    var p = r.p, N = mB(r.n, p.a), Nf = mm(r.n, p.a), Bb = mB(r.b, p.b), Bbf = mm(r.b, p.b);
    U = "<b>" + p.b + "</b>"; Uf = M_NEV[p.b];
    var marad = "Hány " + U + " maradt?", maradF = "Hány " + Uf + " maradt?";
    if (p.a === "km") {
      s = "Az unikornis " + N + " utat vágtat a vásárig. Már " + Bb + " utat megtett."; sf = "Az unikornis " + Nf + " utat vágtat a vásárig. Már " + Bbf + " utat megtett.";
      marad = "Hány " + U + " van még hátra?"; maradF = "Hány " + Uf + " van még hátra?";
    } else if (menny === "hossz") {
      s = "Egy " + N + " hosszú szalagból levágtunk egy " + Bb + " hosszú darabot."; sf = "Egy " + Nf + " hosszú szalagból levágtunk egy " + Bbf + " hosszú darabot.";
    } else if (menny === "ur") {
      var hol = p.a === "hl" ? "hordóban" : (M_SZ[p.a] <= 10 ? "üvegcsében" : "kancsóban");
      s = "Egy " + hol + " " + N + " bájital volt. " + Bb + " bájitalt kiöntöttünk belőle."; sf = "Egy " + hol + " " + Nf + " bájital volt. " + mNagy(Bbf) + " bájitalt kiöntöttünk belőle.";
    } else {
      var hol2 = (p.a === "q" || p.a === "t") ? "A raktárban" : (M_SZ[p.a] <= 10 ? "Egy tálkában" : "Egy zsákban");
      s = hol2 + " " + N + " liszt volt. " + Bb + " lisztet felhasználtunk belőle."; sf = hol2 + " " + Nf + " liszt volt. " + mNagy(Bbf) + " lisztet felhasználtunk belőle.";
    }
    lep.push(mLep("Először: hány " + U + " " + mAz(r.n) + " " + N + "?", "Először: hány " + Uf + " " + mAz(r.n) + " " + Nf + "?", r.ossz, mJel(r.n, p.a) + " = " + mJel(r.ossz, p.b)));
    lep.push(mLep(marad, maradF, r.ossz - r.b, mJel(r.ossz, p.b) + " − " + mJel(r.b, p.b) + " = " + mJel(r.ossz - r.b, p.b)));
  } else if (r.fj === "szorkiv") {
    U = "<b>" + r.u + "</b>"; Uf = M_NEV[r.u];
    var K = r.par ? mB(r.m, r.par.a) : mB(r.keszlet, r.u), Kf = r.par ? mm(r.m, r.par.a) : mm(r.keszlet, r.u);
    var Ae = mB(r.a, r.u), Aef = mm(r.a, r.u), dbT = mAz(r.db) + " <b>" + r.db + "</b>", dbF = mAz(r.db) + " " + mSzo(r.db);
    var mit, kerd, kerdF;
    if (menny === "hossz") {
      s = "A szabónál egy " + K + " hosszú szalag van. <b>" + r.db + "</b> masnit köt belőle, mindegyikhez " + Ae + " szalag kell.";
      sf = "A szabónál egy " + Kf + " hosszú szalag van. " + mNagy(mSzo(r.db)) + " masnit köt belőle, mindegyikhez " + Aef + " szalag kell.";
      mit = [" szalag kell " + dbT + " masnihoz?", " szalag kell " + dbF + " masnihoz?"]; kerd = "Hány " + U + " szalag marad?"; kerdF = "Hány " + Uf + " szalag marad?";
    } else if (menny === "ur") {
      s = "Egy " + (r.par && r.par.a === "hl" ? "hordóban " : "kancsóban ") + K + " bájital van. <b>" + r.db + "</b> üvegcsét töltünk meg belőle, mindegyikbe " + Ae + " bájitalt.";
      sf = "Egy " + (r.par && r.par.a === "hl" ? "hordóban " : "kancsóban ") + Kf + " bájital van. " + mNagy(mSzo(r.db)) + " üvegcsét töltünk meg belőle, mindegyikbe " + Aef + " bájitalt.";
      mit = [" bájital kell " + dbT + " üvegcsébe?", " bájital kell " + dbF + " üvegcsébe?"]; kerd = "Hány " + U + " bájital marad?"; kerdF = "Hány " + Uf + " bájital marad?";
    } else {
      s = "Egy zsákban " + K + " liszt van. <b>" + r.db + "</b> kalácsot sütünk belőle, mindegyikbe " + Ae + " liszt kell.";
      sf = "Egy zsákban " + Kf + " liszt van. " + mNagy(mSzo(r.db)) + " kalácsot sütünk belőle, mindegyikbe " + Aef + " liszt kell.";
      mit = [" liszt kell " + dbT + " kalácsba?", " liszt kell " + dbF + " kalácsba?"]; kerd = "Hány " + U + " liszt marad?"; kerdF = "Hány " + Uf + " liszt marad?";
    }
    lep.push(mLep("Először: hány " + U + mit[0], "Először: hány " + Uf + mit[1], r.kell, mJel(r.a, r.u) + " × " + r.db + " = " + mJel(r.kell, r.u)));
    if (r.par) lep.push(mLep("Most: hány " + U + " " + mAz(r.m) + " " + K + "?", "Most: hány " + Uf + " " + mAz(r.m) + " " + Kf + "?", r.keszlet, mJel(r.m, r.par.a) + " = " + mJel(r.keszlet, r.u)));
    lep.push(mLep(kerd, kerdF, r.keszlet - r.kell, mJel(r.keszlet, r.u) + " − " + mJel(r.kell, r.u) + " = " + mJel(r.keszlet - r.kell, r.u)));
  } else {
    U = "<b>" + r.u + "</b>"; Uf = M_NEV[r.u];
    var aU = r.par ? r.par.a : r.u, Aa = mB(r.a, aU), Aaf = mm(r.a, aU), Bo = mB(r.b, r.u), Bof = mm(r.b, r.u), nT = "<b>" + r.n + "</b>", nF = mSzo(r.n);
    var egy, egyF, ossz, osszF;
    if (menny === "hossz") {
      s = "Egy " + Aa + " és egy " + Bo + " hosszú szalagot összevarrunk. Aztán " + nT + " egyforma darabra vágjuk.";
      sf = "Egy " + Aaf + " és egy " + Bof + " hosszú szalagot összevarrunk. Aztán " + nF + " egyforma darabra vágjuk.";
      ossz = "hány " + U + " hosszú lett az összevarrt szalag?"; osszF = "hány " + Uf + " hosszú lett az összevarrt szalag?"; egy = "Hány " + U + " lesz egy darab?"; egyF = "Hány " + Uf + " lesz egy darab?";
    } else if (menny === "ur") {
      s = "Az üstbe " + Aa + " holdharmatot és " + Bo + " csillagvizet öntünk. Aztán " + nT + " üvegcsébe egyformán szétosztjuk.";
      sf = "Az üstbe " + Aaf + " holdharmatot és " + Bof + " csillagvizet öntünk. Aztán " + nF + " üvegcsébe egyformán szétosztjuk.";
      ossz = "hány " + U + " bájital lett az üstben?"; osszF = "hány " + Uf + " bájital lett az üstben?"; egy = "Hány " + U + " jut egy üvegcsébe?"; egyF = "Hány " + Uf + " jut egy üvegcsébe?";
    } else {
      s = "A pék " + Aa + " lisztet és " + Bo + " cukrot összekever. Aztán " + nT + " egyforma részre osztja.";
      sf = "A pék " + Aaf + " lisztet és " + Bof + " cukrot összekever. Aztán " + nF + " egyforma részre osztja.";
      ossz = "hány " + U + " lett együtt?"; osszF = "hány " + Uf + " lett együtt?"; egy = "Hány " + U + " jut egy részre?"; egyF = "Hány " + Uf + " jut egy részre?";
    }
    var aB = r.par ? r.a * r.par.f : r.a;
    if (r.par) lep.push(mLep("Először: hány " + U + " " + mAz(r.a) + " " + Aa + "?", "Először: hány " + Uf + " " + mAz(r.a) + " " + Aaf + "?", aB, mJel(r.a, aU) + " = " + mJel(aB, r.u)));
    lep.push(mLep((r.par ? "Most: " : "Először: ") + ossz, (r.par ? "Most: " : "Először: ") + osszF, r.ossz, mJel(aB, r.u) + " + " + mJel(r.b, r.u) + " = " + mJel(r.ossz, r.u)));
    lep.push(mLep(egy, egyF, r.q, mJel(r.ossz, r.u) + " : " + r.n + " = " + mJel(r.q, r.u)));
  }
  var fo = lep[lep.length - 1];
  var f = mFeladat(cfg, { fajta: "szoveges-" + r.fj, kep: "", kerdes: s + "<br>" + fo.k, felolvas: sf + " " + fo.f, helyes: fo.h, hosszu: true,
    keplet: fo.m.replace(/ = [^=]*$/, ""), megoldas: lep.map(function (l) { return l.m; }).join(" · "),
    tipp: lep.slice(0, -1).map(function (l) { return l.f.replace(/\?$/, ": ") + mKiejt(l.m.replace(/^.* = /, "")) + "."; }).join(" ") });
  f.tortenet = s; f.vegig = lep;
  return f;
}
/* rossz válasz után: a részkérdések egymás után (a történet a képernyőn marad), végül újra a főkérdés.
   A lépések a meglévő „lánc” úton mennek (nem új pötty); a vezetett kérdés csak 1 ✨-ot ad (mint a tipp utáni). */
function meresVegigvezet(f, valasz) {
  var n = f.vegig.length, sor = f.vegig.map(function (l, i) {
    var vegso = (i === n - 1), cim = vegso ? "Most újra a kérdés:" : (i + 1) + ". lépés";
    var x = { csalad: "egyenkent", nagySzam: true, jegyMax: 6, meres: f.meres, liga: f.liga, vezet: true,
      kartyaHTML: '<div class="meres-kerdes hosszu meres-tortenet">' + f.tortenet + '</div><div class="meres-lepes' + (vegso ? ' vegso' : '') + '"><span class="meres-lepes-cim">' + cim + '</span> ' + l.k + '</div>',
      szoveg: l.k.replace(/<[^>]+>/g, ""), felolvas: (vegso ? "Most újra a kérdés: " : "") + l.f, helyes: l.h, keplet: l.m.replace(/ = [^=]*$/, ""), megoldas: l.m,
      tipp: "Számold ki: " + mKiejt(l.m.replace(/ = [^=]*$/, "")) + ".", lanc: null,
      naplo: { tipus: f.naplo.tipus + (vegso ? "-ujra" : "-lepes"), kerdes: l.m.replace(/ = [^=]*$/, "").slice(0, 60), helyes: l.h, atlepes: false } };
    return x;
  });
  sor[0].lanc = sor.slice(1);
  J.lancKov = sor[0];
  figyelStop();
  $("visszajelzes").className = "visszajelzes rossz";
  $("visszajelzes").textContent = "Nem " + valasz + ". Nézzük lépésenként!";
  mondd("Nem talált. Nézzük meg lépésenként!", function () { if (J && J.lancKov === sor[0]) ujFeladat(); });
}

/* ═════════════════ 2. SZAKASZ: KOPPINTÓS KÁRTYÁK (rajzterv-2, jóváhagyva 2026-09-26) ═════════════════
   5 összehasonlítás (+ utána szóban a „mennyivel?”), 6 becslés, 7 sorba rendezés, 9 melyik mértékegység, 10 kakukktojás.
   f.csalad = "koppint": a mikrofon és a beíró négyzet helyett a #valasz-kartyak panel látszik, a gyerek koppint.
   A gép CSAK a kérdést olvassa fel, a lehetőségeket NEM (producer döntése). Rossz koppintás: piros + billeg, aztán
   halvány, és újra választhat; ahol több egység szerepel, a kártyák alján megjelenik a közös egység. */
var M_KERD_TOBB = { hossz: "Melyik szalag hosszabb?", ur: "Melyik üvegben van több bájital?", tomeg: "Melyik zsák nehezebb?" };
/* -val/-vel alak: „centiméterrel”, „kilogrammal”, „tonnával” (képernyőn: „cm-rel”, „kg-mal”) */
function mVal(u) { var n = M_NEV[u]; return /a$/.test(n) ? n.slice(0, -1) + "ával" : n + (/gramm$/.test(n) ? "al" : "rel"); }   /* „kilogrammal” (három m helyett kettő) */
function mValJel(u) { return /gramm$/.test(M_NEV[u]) ? "-mal" : (/a$/.test(M_NEV[u]) ? "-val" : "-rel"); }
function mNelJel(u) { return /gramm$|a$/.test(M_NEV[u]) ? "-nál" : "-nél"; }
/* a képernyő-mondat felolvasható alakja: „kb. 15 cm” → „körülbelül tizenöt centiméter” */
function mKiejt(s) {
  return String(s).replace(/<[^>]+>/g, "").replace(/\bkb\./g, "körülbelül").replace(/ = /g, " az ").replace(/ : /g, " osztva ").replace(/ × /g, " szorozva ").replace(/ − /g, " mínusz ").replace(/ \+ /g, " meg ")
    .replace(/(\d[\d ]*?)\s?(mm|cm|dm|km|ml|cl|dl|hl|dkg|kg|m|l|g|q|t)(?![a-zá-ű])/g, function (x, n, u) { return mMondd(parseInt(n.replace(/ /g, ""), 10), u); });
}
function mKever(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = veletlen(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function mErtek(k) { return k.n * M_SZ[k.u]; }
function mLegfinomabb(lista) { return lista.map(function (k) { return k.u; }).sort(function (a, b) { return M_SZ[a] - M_SZ[b]; })[0]; }
function mKoppFeladat(cfg, o) {
  return {
    csalad: "koppint", meres: cfg.mennyiseg, liga: MENNY[cfg.mennyiseg].liga, kopp: o.kopp,
    kartyaHTML: (o.kep ? '<div class="meres-kep">' + o.kep + '</div>' : "") + '<div class="meres-kerdes' + (o.hosszu ? ' hosszu' : '') + '">' + o.kerdes + '</div>',
    szoveg: o.kerdes.replace(/<[^>]+>/g, ""), felolvas: o.felolvas, helyes: 1, joKiir: o.joKiir, keplet: o.keplet || "", megoldas: o.megoldas || "",
    tipp: "", lanc: o.lanc || null,
    naplo: { tipus: "meres-" + o.fajta, kerdes: (o.keplet || o.kerdes.replace(/<[^>]+>/g, "")).slice(0, 60), helyes: o.joKiir, atlepes: false }
  };
}
function mEmoji(e) { return '<div class="meres-emoji">' + e + '</div>'; }

/* ── valós tárgyak a becsléshez és a „melyik egység?” feladatokhoz (rendszerterv 4.6 és 4.9) ──
   e: kép · n, u: a valódi nagyság · k: becslő kérdés · a: alany a „1 m-nél hosszabb?” kérdéshez (null = ott nem jó) ·
   t: tárgyeset a „mivel mérnéd …?” kérdéshez · c: mondat a számmal (4.9c) · m: magyarázat rossz válasz után */
var M_TARGYAK = {
  hossz: [
    { e: "✏️", n: 15, u: "cm", k: "Milyen hosszú egy ceruza?", a: "A ceruza", t: "a ceruzát", c: "A ceruzám {} hosszú.", m: "A ceruza kb. 15 cm hosszú." },
    { e: "🚪", n: 2, u: "m", k: "Milyen magas egy ajtó?", a: "Az ajtó", t: "az ajtó magasságát", c: "A szobám ajtaja {} magas.", m: "Az ajtó magasabb, mint te: kb. 2 m." },
    { e: "🚌", n: 12, u: "m", k: "Milyen hosszú egy busz?", a: "A busz", t: "a busz hosszát", c: "A busz {} hosszú.", m: "Egy busz kb. 12 m hosszú." },
    { e: "🐜", n: 3, u: "mm", k: "Milyen hosszú egy hangya?", a: "A hangya", t: "a hangya hosszát", c: "A hangya {} hosszú.", m: "Egy hangya csak kb. 3 mm hosszú." },
    { e: "🛏️", n: 2, u: "m", k: "Milyen hosszú egy ágy?", a: "Az ágy", t: "az ágy hosszát", c: "Az ágyam {} hosszú.", m: "Egy ágy kb. 2 m hosszú." },
    { e: "📓", n: 5, u: "mm", k: "Milyen vastag egy füzet?", a: null, t: "a füzeted vastagságát", c: "A füzetem {} vastag.", m: "A füzet csak kb. 5 mm vastag." },
    { e: "🦒", n: 5, u: "m", k: "Milyen magas egy zsiráf?", a: null, t: "a zsiráf magasságát", c: "A zsiráf {} magas.", m: "Egy zsiráf kb. 5 m magas." },
    { e: "🍌", n: 20, u: "cm", k: "Milyen hosszú egy banán?", a: "A banán", t: "a banánt", c: "A banán {} hosszú.", m: "Egy banán kb. 20 cm hosszú." },
    { e: "🚗", n: 4, u: "m", k: "Milyen hosszú egy autó?", a: "Az autó", t: "az autó hosszát", c: "Az autónk {} hosszú.", m: "Egy autó kb. 4 m hosszú." },
    { e: "🛣️", n: 60, u: "km", k: "Milyen messze van a szomszéd város?", a: "A szomszéd városig az út", t: "a két város közti utat", c: "A két város között {} az út.", m: "A szomszéd városig kb. 60 km az út." },
    { e: "🐛", n: 4, u: "cm", k: "Milyen hosszú egy hernyó?", a: "A hernyó", t: "a hernyót", c: "A hernyó {} hosszú.", m: "Egy hernyó kb. 4 cm hosszú." },
    { e: "🌳", n: 10, u: "m", k: "Milyen magas egy nagy fa?", a: null, t: "a fa magasságát", c: "A kertünkben a nagy fa {} magas.", m: "Egy nagy fa kb. 10 m magas." },
    { e: "📎", n: 3, u: "cm", k: "Milyen hosszú egy gemkapocs?", a: "A gemkapocs", t: "a gemkapcsot", c: "A gemkapocs {} hosszú.", m: "Egy gemkapocs kb. 3 cm hosszú." },
    { e: "🏃", n: 400, u: "m", k: "Milyen hosszú egy kör a futópályán?", a: "Egy kör a futópályán", t: "a futópálya egy körét", c: "Egy kör a futópályán {}.", m: "Egy kör a futópályán 400 m." }
  ],
  ur: [
    { e: "🥛", n: 2, u: "dl", k: "Mennyi víz fér egy pohárba?", a: "Egy pohárba", t: "egy pohár vizet", c: "Egy pohárba {} víz fér.", m: "Egy pohárba kb. 2 dl víz fér." },
    { e: "🪣", n: 10, u: "l", k: "Mennyi víz fér egy vödörbe?", a: "Egy vödörbe", t: "a vödör vizét", c: "A vödörbe {} víz fér.", m: "Egy vödörbe kb. 10 l víz fér." },
    { e: "🛁", n: 150, u: "l", k: "Mennyi víz fér a fürdőkádba?", a: "A fürdőkádba", t: "a kád vizét", c: "A fürdőkádba {} víz fér.", m: "A kádba kb. 150 l víz fér." },
    { e: "🥄", n: 5, u: "ml", k: "Mennyi orvosság fér egy kanálba?", a: "Egy kanálba", t: "egy kanál orvosságot", c: "A kanálba {} orvosság fér.", m: "Egy kanálba csak kb. 5 ml fér." },
    { e: "☕", n: 3, u: "dl", k: "Mennyi tea fér egy bögrébe?", a: "Egy bögrébe", t: "egy bögre teát", c: "Egy bögrébe {} tea fér.", m: "Egy bögrébe kb. 3 dl tea fér." },
    { e: "🐠", n: 50, u: "l", k: "Mennyi víz fér egy akváriumba?", a: "Az akváriumba", t: "az akvárium vizét", c: "Az akváriumba {} víz fér.", m: "Egy akváriumba kb. 50 l víz fér." },
    { e: "🧪", n: 20, u: "ml", k: "Mennyi bájital fér egy kémcsőbe?", a: "Egy kémcsőbe", t: "egy kémcső bájitalt", c: "A kémcsőbe {} bájital fér.", m: "Egy kémcsőbe kb. 20 ml fér." },
    { e: "🍲", n: 3, u: "dl", k: "Mennyi leves fér egy tányérba?", a: "Egy tányérba", t: "egy tányér levest", c: "Egy tányérba {} leves fér.", m: "Egy tányérba kb. 3 dl leves fér." },
    { e: "⛽", n: 50, u: "l", k: "Mennyi benzin fér egy autó tankjába?", a: "Az autó tankjába", t: "az autó benzinjét", c: "Az autó tankjába {} benzin fér.", m: "Egy autó tankjába kb. 50 l benzin fér." },
    { e: "🛢️", n: 2, u: "hl", k: "Mennyi bor fér egy nagy hordóba?", a: "Egy nagy hordóba", t: "a hordó borát", c: "A nagy hordóba {} bor fér.", m: "Egy nagy hordóba kb. 2 hl fér." },
    { e: "🧃", n: 2, u: "dl", k: "Mennyi üdítő van egy kis dobozban?", a: "Egy kis üdítős dobozba", t: "egy doboz üdítőt", c: "A kis dobozban {} üdítő van.", m: "Egy kis dobozos üdítő kb. 2 dl." },
    { e: "🫖", n: 1, u: "l", k: "Mennyi tea fér egy teáskannába?", a: null, t: "a teáskanna teáját", c: "A teáskannába {} tea fér.", m: "Egy teáskannába kb. 1 l tea fér." },
    { e: "💧", n: 1, u: "ml", k: "Mennyi víz van egy nagy vízcseppben?", a: "Egy vízcseppben", t: "egy vízcseppet", c: "Egy nagy vízcsepp {}.", m: "Egy nagy vízcsepp kb. 1 ml." }
  ],
  tomeg: [
    { e: "🥚", n: 6, u: "dkg", k: "Milyen nehéz egy tojás?", a: "Egy tojás", t: "egy tojást", c: "Egy tojás tömege {}.", m: "Egy tojás kb. 6 dkg." },
    { e: "🍎", n: 20, u: "dkg", k: "Milyen nehéz egy alma?", a: "Egy alma", t: "egy almát", c: "Egy alma tömege {}.", m: "Egy alma kb. 20 dkg." },
    { e: "🍉", n: 5, u: "kg", k: "Milyen nehéz egy nagy dinnye?", a: "Egy nagy dinnye", t: "egy dinnyét", c: "A nagy dinnye tömege {}.", m: "Egy nagy dinnye kb. 5 kg." },
    { e: "🐘", n: 5, u: "t", k: "Milyen nehéz egy elefánt?", a: "Egy elefánt", t: "egy elefántot", c: "Az elefánt tömege {}.", m: "Egy elefánt kb. 5 t." },
    { e: "🍬", n: 5, u: "g", k: "Milyen nehéz egy cukorka?", a: "Egy cukorka", t: "egy cukorkát", c: "A cukorka tömege {}.", m: "Egy cukorka csak kb. 5 g." },
    { e: "🧈", n: 25, u: "dkg", k: "Milyen nehéz egy csomag vaj?", a: "Egy csomag vaj", t: "egy csomag vajat", c: "Egy csomag vaj tömege {}.", m: "Egy csomag vaj kb. 25 dkg." },
    { e: "🐈", n: 4, u: "kg", k: "Milyen nehéz egy macska?", a: "Egy macska", t: "a macskát", c: "A macskánk tömege {}.", m: "Egy macska kb. 4 kg." },
    { e: "🎒", n: 3, u: "kg", k: "Milyen nehéz egy iskolatáska?", a: "Az iskolatáska", t: "az iskolatáskát", c: "Az iskolatáskám tömege {}.", m: "Egy iskolatáska kb. 3 kg." },
    { e: "🪶", n: 1, u: "g", k: "Milyen nehéz egy madártoll?", a: "Egy madártoll", t: "egy madártollat", c: "A madártoll tömege {}.", m: "Egy madártoll kb. 1 g, nagyon könnyű." },
    { e: "🥔", n: 20, u: "kg", k: "Milyen nehéz egy zsák krumpli?", a: "Egy zsák krumpli", t: "a zsák krumplit", c: "A zsák krumpli tömege {}.", m: "Egy zsák krumpli kb. 20 kg." },
    { e: "🐕", n: 10, u: "kg", k: "Milyen nehéz egy kutya?", a: "Egy kutya", t: "a kutyát", c: "A kutyánk tömege {}.", m: "Egy közepes kutya kb. 10 kg." },
    { e: "🧂", n: 1, u: "g", k: "Milyen nehéz egy csipet só?", a: "Egy csipet só", t: "egy csipet sót", c: "Egy csipet só tömege {}.", m: "Egy csipet só kb. 1 g." },
    { e: "🚗", n: 1, u: "t", k: "Milyen nehéz egy autó?", a: "Egy autó", t: "egy autót", c: "Az autónk tömege {}.", m: "Egy autó kb. 1 t." },
    { e: "🍫", n: 10, u: "dkg", k: "Milyen nehéz egy tábla csoki?", a: "Egy tábla csoki", t: "egy tábla csokit", c: "Egy tábla csoki tömege {}.", m: "Egy tábla csoki kb. 10 dkg." }
  ]
};
var M_ALAP = { hossz: "m", ur: "l", tomeg: "kg" };                      /* a „1 m-nél hosszabb?” mércéje */
var M_TOBB_KEV = { hossz: ["hosszabb", "rövidebb"], ur: ["több", "kevesebb"], tomeg: ["több", "kevesebb"] };
var M_K3 = { hossz: ["mm", "cm", "m", "km"], ur: ["ml", "dl", "l", "hl"], tomeg: ["g", "dkg", "kg", "t"] };   /* 3 kártyás becslés sora */
function mK3Egys(menny, g) { return M_K3[menny].filter(function (u) { return g >= 5 || (u !== "hl" && u !== "t"); }); }
/* 1–2. osztály: csak az ott tanult egységekkel mondott, egyértelműen 1 egységnél nagyobb/kisebb tárgyak */
function mTisztaTargyak(menny, g) {
  var E = mEgysegek(menny, Math.min(g, 2)), A = M_SZ[M_ALAP[menny]];
  return M_TARGYAK[menny].filter(function (t) { var v = t.n * M_SZ[t.u]; return t.a && E.indexOf(t.u) >= 0 && (v >= 2 * A || v * 2 <= A); });
}
/* 3 szomszédos egység, benne a helyes (véletlen ablak, hogy a jó ne mindig középen legyen) */
function mAblak(lista, u, db) {
  var i = lista.indexOf(u), jo = [];
  for (var s = Math.max(0, i - db + 1); s <= Math.min(i, lista.length - db); s++) jo.push(s);
  if (!jo.length) return lista.slice();
  var s0 = mVel(jo);
  return lista.slice(s0, s0 + db);
}

/* ── 6) BECSLÉS (4.6): 1–2. o. két gomb („1 m-nél hosszabb / rövidebb”), 3. o.-tól három kártya ── */
function genBecsles(cfg, kerultMar) {
  var g = cfg.g, menny = cfg.mennyiseg, A = M_ALAP[menny], TK = M_TOBB_KEV[menny];
  if (g <= 2) {
    var t2 = mEgyedi(kerultMar, function () { var t = mVel(mTisztaTargyak(menny, g)); return { kulcs: "bc2" + t.e, t: t }; }).t;
    var nagyobb = t2.n * M_SZ[t2.u] > M_SZ[A];
    var utotag = menny === "ur" ? " fér?" : "?";
    return mKoppFeladat(cfg, { fajta: "becsles", kep: mEmoji(t2.e),
      kerdes: t2.a + " <b>1 " + A + "</b>" + mNelJel(A) + " " + TK[0] + " vagy " + TK[1] + utotag,
      felolvas: t2.a + " egy " + M_NEV[A] + (/gramm$/.test(M_NEV[A]) ? "nál " : "nél ") + TK[0] + " vagy " + TK[1] + utotag,
      joKiir: (nagyobb ? TK[0] : TK[1]), keplet: t2.e + " ? 1 " + A,
      kopp: { tipus: "gomb", opciok: ["⬆ 1 " + A + mNelJel(A) + " " + TK[0], "⬇ 1 " + A + mNelJel(A) + " " + TK[1]], jo: nagyobb ? 0 : 1, mert: t2.m } });
  }
  var E = mK3Egys(menny, g);
  var t3 = mEgyedi(kerultMar, function () {
    var t = mVel(M_TARGYAK[menny].filter(function (x) { return E.indexOf(x.u) >= 0; }));
    return { kulcs: "bc3" + t.e, t: t };
  }).t;
  var egys = mAblak(E, t3.u, 3);
  return mKoppFeladat(cfg, { fajta: "becsles", kep: mEmoji(t3.e), kerdes: t3.k, felolvas: t3.k, joKiir: mJel(t3.n, t3.u), keplet: t3.e + " ≈ ?",
    kopp: { tipus: "jelveny", opciok: egys.map(function (u) { return mJel(t3.n, u); }), jo: egys.indexOf(t3.u), mert: t3.m } });
}

/* ── 9) MELYIK MÉRTÉKEGYSÉG? (4.9): a · nagy vagy kis egységgel (1–2.) · b · melyikkel mérnéd (3–5.) ·
      c · melyik illik a számhoz (4–5.) · d · milyen egységben lett ennyi (5.) ── */
var M_NAGYKIS = { hossz: ["m", "cm"], ur: ["l", "dl"], tomeg: ["kg", "dkg"] };
function genEgyseg(cfg, kerultMar) {
  var g = cfg.g, menny = cfg.mennyiseg, valt = g <= 2 ? "a" : mVel(g === 3 ? ["b"] : (g === 4 ? ["b", "c"] : ["b", "c", "d"]));
  if (valt === "a") {
    var NK = M_NAGYKIS[menny];
    var ta = mEgyedi(kerultMar, function () { var t = mVel(mTisztaTargyak(menny, g)); return { kulcs: "eg-a" + t.e, t: t }; }).t;
    var nagy = ta.n * M_SZ[ta.u] >= M_SZ[NK[0]];
    return mKoppFeladat(cfg, { fajta: "egyseg-a", kep: mEmoji(ta.e),
      kerdes: "<b>" + NK[0] + "</b>" + mValJel(NK[0]) + " vagy <b>" + NK[1] + "</b>" + mValJel(NK[1]) + " mérnéd " + ta.t + "?",
      felolvas: mNagy(mVal(NK[0])) + " vagy " + mVal(NK[1]) + " mérnéd " + ta.t + "?", joKiir: nagy ? NK[0] : NK[1], keplet: ta.e + ": " + NK[0] + " / " + NK[1],
      kopp: { tipus: "jelveny", opciok: NK.slice(), jo: nagy ? 0 : 1, mert: ta.m + " Ezért " + mVal(nagy ? NK[0] : NK[1]) + " mérjük." } });
  }
  if (valt === "d") {
    var L5 = MENNY[menny].egys[5];
    var rd = mEgyedi(kerultMar, function () {
      var parok = [];
      for (var i = 0; i < L5.length; i++) for (var j = i + 1; j < L5.length; j++) { var f = M_SZ[L5[j]] / M_SZ[L5[i]]; if (f >= 10 && f <= 1000 && j - i <= 3) parok.push([i, j, f]); }
      var p = mVel(parok), n1 = veletlen(2, Math.min(99, Math.floor(100000 / p[2])));
      return { kulcs: "eg-d" + p[0] + p[1] + n1, i: p[0], j: p[1], f: p[2], n1: n1 };
    });
    var u0 = L5[rd.i], u1 = L5[rd.j], n0 = rd.n1 * rd.f, s0 = Math.max(0, Math.min(rd.i, L5.length - 4));
    var opd = L5.slice(s0, s0 + 4);
    return mKoppFeladat(cfg, { fajta: "egyseg-d", kep: "", kerdes: mB(n0, u0) + " ugyanaz, mint <b>" + mSzamIr(rd.n1) + "</b> <span class=\"ures\">?</span>",
      felolvas: mNagy(mMondd(n0, u0)) + " ugyanaz, mint " + mSzo(rd.n1) + " … Melyik egység illik ide?", joKiir: u1,
      keplet: mJel(n0, u0) + " = " + rd.n1 + " ?", megoldas: mJel(n0, u0) + " = " + mJel(rd.n1, u1),
      kopp: { tipus: "jelveny", opciok: opd, jo: opd.indexOf(u1), mert: "1 " + u1 + " = " + mSzamIr(rd.f) + " " + u0 + ", és " + mSzamIr(n0) + " : " + mSzamIr(rd.f) + " = " + rd.n1 + "." } });
  }
  var E = mEgysegek(menny, g);
  /* b: a rossz egységben 1-nél kisebb vagy 1000-nél nagyobb szám jönne ki; c: ugyanaz a szám, szomszédos egységek */
  function rossz(t) { var v = t.n * M_SZ[t.u]; return E.filter(function (u) { var q = v / M_SZ[u]; return u !== t.u && (q < 1 || q >= 1000); }); }
  var jelolt = M_TARGYAK[menny].filter(function (t) { return E.indexOf(t.u) >= 0 && (valt === "c" || rossz(t).length >= 2); });
  var tb = mEgyedi(kerultMar, function () { var t = mVel(jelolt); return { kulcs: "eg-" + valt + t.e, t: t }; }).t;
  var op;
  if (valt === "b") op = [tb.u].concat(mKever(rossz(tb)).slice(0, 2)).sort(function (a, b) { return M_SZ[a] - M_SZ[b]; });
  else op = mAblak(mK3Egys(menny, g), tb.u, 3);
  if (valt === "b")
    return mKoppFeladat(cfg, { fajta: "egyseg-b", kep: mEmoji(tb.e), kerdes: "Melyik egységgel mérnéd " + tb.t + "?", felolvas: "Melyik egységgel mérnéd " + tb.t + "?",
      joKiir: tb.u, keplet: tb.e + ": ?", kopp: { tipus: "jelveny", opciok: op, jo: op.indexOf(tb.u), mert: tb.m } });
  return mKoppFeladat(cfg, { fajta: "egyseg-c", kep: mEmoji(tb.e), kerdes: tb.c.replace("{}", "<b>" + mSzamIr(tb.n) + "</b> <span class=\"ures\">?</span>"),
    felolvas: tb.c.replace("{}", mSzo(tb.n) + " …").replace("….", "…") + " Melyik egység illik ide?", joKiir: tb.u, keplet: tb.c.replace("{}", tb.n + " ?"),
    kopp: { tipus: "jelveny", opciok: op, jo: op.indexOf(tb.u), mert: tb.m } });
}

/* ── 5) ÖSSZEHASONLÍTÁS (4.5): két kártya + „egyforma” gomb; jó koppintás után szóban a „mennyivel?” ── */
function genOsszeh(cfg, kerultMar) {
  var g = Math.max(2, cfg.g), menny = cfg.mennyiseg, liga = MENNY[menny].liga, L = M_HATAR[g];
  var P0 = mParok(menny, g, g >= 3 ? 1000 : 100).filter(function (p) { return p.f * 2 <= L; });
  if (!P0.length) P0 = mParok(menny, g, 100);                                /* 2. o. tömeg: csak kg–dkg (1 kg = 100 dkg) */
  var r = mEgyedi(kerultMar, function () {
    var egyforma = veletlen(1, 9) <= 2;
    if (g === 2 && !egyforma && veletlen(1, 4) === 1) {                      /* 2. o.: néha azonos egység */
      var u = mVel(mEgysegek(menny, 2)), a = veletlen(2, 99), b;
      do { b = veletlen(2, 99); } while (b === a);
      return { kulcs: "oh" + u + a + "|" + b, A: { n: a, u: u }, B: { n: b, u: u } };
    }
    var p = mVel(P0), n = veletlen(1, Math.max(1, Math.min(9, Math.floor(L / p.f / 2)))), nagyB = n * p.f, kis = nagyB;
    if (!egyforma) {
      var cs = [Math.max(2, Math.round(nagyB / 5)), nagyB - 1], fo = [nagyB + 1, Math.min(L, nagyB * 3)];   /* csapda: a nagyobb mérőszám a kisebb mennyiség */
      var rr = (veletlen(0, 1) === 1 || fo[0] > fo[1]) && cs[0] <= cs[1] ? cs : fo, lo = rr[0], hi = rr[1];
      var kor = 0;
      do { kis = mKerekSzam(lo, hi, Math.min(g, 3)); } while (kis === nagyB && ++kor < 20);
      if (kis === nagyB) kis = nagyB + 1;
    }
    return { kulcs: "oh" + p.a + n + "|" + kis + p.b, A: { n: n, u: p.a }, B: { n: kis, u: p.b } };
  });
  var K = veletlen(0, 1) ? [r.A, r.B] : [r.B, r.A], v0 = mErtek(K[0]), v1 = mErtek(K[1]);
  var jo = v0 === v1 ? "=" : (v0 > v1 ? 0 : 1), e = mLegfinomabb(K), tobb = MENNY[menny].tobb;
  var lanc = null;
  if (jo !== "=") {
    var kul = Math.abs(v0 - v1) / M_SZ[e], nagy = K[jo], kicsi = K[1 - jo];
    var cimk = function (k, x) { return MR.targy(liga, x, 112, .95, x > 180 ? 2 : 0) + MR.tag(x, 134, mJel(k.n, k.u), { fs: 16 }) +
      (k.u !== e ? MR.tag(x, 14, "= " + mJel(mErtek(k) / M_SZ[e], e), { fs: 14, bg: "#fff4e6", st: "#f7c59f", fill: "#c86b2a" }) : ""); };
    lanc = [mFeladat(cfg, { fajta: "mennyivel", kep: MR.svg360(cimk(K[0], 90) + MR.jel(180, 94, jo === 0 ? "&gt;" : "&lt;", 34) + cimk(K[1], 270)),
      kerdes: "Ügyes! És mennyivel " + tobb + " " + mAz(nagy.n) + " " + mB(nagy.n, nagy.u) + "? Hány <b>" + e + "</b>" + mValJel(e) + "?",
      felolvas: "Ügyes! És mennyivel " + tobb + "? Hány " + mVal(e) + "?", helyes: kul, hosszu: true,
      keplet: mJel(mErtek(nagy) / M_SZ[e], e) + " − " + mJel(mErtek(kicsi) / M_SZ[e], e),
      megoldas: mJel(mErtek(nagy) / M_SZ[e], e) + " − " + mJel(mErtek(kicsi) / M_SZ[e], e) + " = " + mJel(kul, e),
      tipp: (nagy.u !== e ? mNagy(mMondd(nagy.n, nagy.u)) + " az " + mMondd(mErtek(nagy) / M_SZ[e], e) + ". " :
             (kicsi.u !== e ? mNagy(mMondd(kicsi.n, kicsi.u)) + " az " + mMondd(mErtek(kicsi) / M_SZ[e], e) + ". " : "")) +
            "Vond ki a kisebbet a nagyobból!" })];
  }
  return mKoppFeladat(cfg, { fajta: "osszehasonlitas", kerdes: "<b class=\"tor\">" + M_KERD_TOBB[menny] + "</b>", felolvas: M_KERD_TOBB[menny],
    joKiir: jo === "=" ? "egyformák" : mJel(K[jo].n, K[jo].u), keplet: mJel(K[0].n, K[0].u) + " ? " + mJel(K[1].n, K[1].u),
    kopp: { tipus: "osszeh", kartyak: K, jo: jo }, lanc: lanc });
}

/* ── 7) SORBA RENDEZÉS (4.7): 2. o. 3 kártya egy egységgel · 3. o. 4 kártya, két szomszédos egység · 4–5. o. 5 kártya, három egység ── */
function genSorba(cfg, kerultMar) {
  var g = Math.max(2, cfg.g), menny = cfg.mennyiseg, L = M_HATAR[g], db = g <= 2 ? 3 : (g === 3 ? 4 : 5);
  var r = mEgyedi(kerultMar, function () {
    var K = [], vs = {}, kor = 0;
    if (g <= 2) {
      var u = mVel(mEgysegek(menny, 2));
      while (K.length < db && kor++ < 200) { var n = veletlen(2, 99); if (!vs[n]) { vs[n] = 1; K.push({ n: n, u: u }); } }
    } else {
      var E = mEgysegek(menny, g), k = g === 3 ? 2 : 3, mx = g === 3 ? 5 : 9, ablakok = [];
      for (var s = 0; s + k <= E.length; s++) { var W = E.slice(s, s + k); if (M_SZ[W[k - 1]] / M_SZ[W[0]] * mx <= L) ablakok.push(W); }
      var W0 = mVel(ablakok), T = W0[k - 1], egysegek = mKever(W0.concat(W0, W0)).slice(0, db);
      W0.forEach(function (w, i) { egysegek[i] = w; });                     /* minden egység legalább egyszer */
      egysegek = mKever(egysegek);
      egysegek.forEach(function (x) {
        var tries = 0, n2, v;
        do {
          v = veletlen(Math.round(M_SZ[T] / 2), M_SZ[T] * mx);
          n2 = Math.max(1, Math.round(v / M_SZ[x]));
          if (x !== T) { var kl = n2 >= 10000 ? 500 : n2 >= 1000 ? 50 : (n2 >= 100 ? 10 : (n2 >= 20 ? 5 : 1)); n2 = Math.max(1, Math.round(n2 / kl) * kl); }   /* kerekebb számok */
          v = n2 * M_SZ[x];
        } while ((vs[v] || n2 > L) && ++tries < 60);
        vs[v] = 1; K.push({ n: n2, u: x });
      });
    }
    return { kulcs: "sb" + K.map(function (q) { return q.n + q.u; }).join(","), K: K };
  });
  var no = veletlen(0, 1) === 1, rend = r.K.map(function (q, i) { return i; }).sort(function (a, b) { return no ? mErtek(r.K[a]) - mErtek(r.K[b]) : mErtek(r.K[b]) - mErtek(r.K[a]); });
  var SZ = { hossz: ["a legrövidebbtől a leghosszabbig", "a leghosszabbtól a legrövidebbig"], ur: ["a legkevesebbtől a legtöbbig", "a legtöbbtől a legkevesebbig"],
             tomeg: ["a legkönnyebbtől a legnehezebbig", "a legnehezebbtől a legkönnyebbig"] }[menny][no ? 0 : 1];
  return mKoppFeladat(cfg, { fajta: "sorba", kerdes: "Rakd sorba <b class=\"tor\">" + SZ + "</b>!", felolvas: "Rakd sorba " + SZ + "!",
    joKiir: rend.map(function (i) { return mJel(r.K[i].n, r.K[i].u); }).join(no ? " < " : " > "), keplet: r.K.map(function (q) { return mJel(q.n, q.u); }).join(", "),
    kopp: { tipus: "sorba", kartyak: r.K, rend: rend, no: no } });
}

/* ── 10) KAKUKKTOJÁS (4.10): 4. o. 3 tojás, szomszédos egységek · 5. o. 4 tojás, nagy ugrások; az „álruhás” mindig 10× vagy tized ── */
function genKakukk(cfg, kerultMar) {
  var g = Math.max(4, cfg.g), menny = cfg.mennyiseg, L = M_HATAR[g];
  var r = mEgyedi(kerultMar, function () {
    var K, odd;
    if (g <= 4) {
      var p = mVel(mParok(menny, 4, 100)), n = veletlen(1, 9);
      K = [{ n: n, u: p.a }, { n: n * p.f, u: p.b }];
      var jel = [{ n: n, u: p.b }, { n: n * 10, u: p.a }];
      if (n * p.f * 10 <= L) jel.push({ n: n * p.f * 10, u: p.b });
      odd = mVel(jel);
    } else {
      var E = MENNY[menny].egys[5], abl = [];
      for (var s = 0; s + 3 <= E.length; s++) if (M_SZ[E[s + 2]] / M_SZ[E[s]] * 20 <= L) abl.push(E.slice(s, s + 3));
      var W = mVel(abl), f = M_SZ[W[2]] / M_SZ[W[0]], maxN = Math.min(99, Math.floor(L / (f * 10))), n5;
      do { n5 = veletlen(2, maxN); } while (n5 % 10 === 0);
      K = [{ n: n5, u: W[2] }, { n: n5 * M_SZ[W[2]] / M_SZ[W[1]], u: W[1] }, { n: n5 * f, u: W[0] }];
      var j = veletlen(0, 2), alap = K[j];
      odd = (veletlen(0, 1) && alap.n % 10 === 0) ? { n: alap.n / 10, u: alap.u } : { n: alap.n * 10, u: alap.u };
      if (odd.n > L) odd = { n: alap.n / 10, u: alap.u };
    }
    var T = mKever(K.concat([odd]));
    return { kulcs: "kk" + T.map(function (q) { return q.n + q.u; }).join(","), T: T, odd: T.indexOf(odd) };
  });
  return mKoppFeladat(cfg, { fajta: "kakukk", kerdes: "Melyik a <b>kakukktojás</b>?<br><span class=\"meres-kis\">(Melyik nem egyenlő a többivel?)</span>",
    felolvas: "Melyik a kakukktojás? Melyik nem egyenlő a többivel?", joKiir: mJel(r.T[r.odd].n, r.T[r.odd].u),
    keplet: r.T.map(function (q) { return mJel(q.n, q.u); }).join(" · "), kopp: { tipus: "kakukk", kartyak: r.T, jo: r.odd } });
}

/* ═════════════════ A KÁRTYA-PANEL (a #valasz-egyenkent-en belül, a visszajelzés alatt) ═════════════════ */
function mKoppPanel() {
  var p = $("valasz-kartyak");
  if (!p) {
    p = el("div", "valasz-kartyak"); p.id = "valasz-kartyak";
    var v = $("visszajelzes"); v.parentNode.insertBefore(p, v.nextSibling);
    p.addEventListener("click", mKoppKatt);
  }
  return p;
}
function mKoppRejt() {
  var p = $("valasz-kartyak"); if (p) { p.hidden = true; p.innerHTML = ""; }
  var ve = $("valasz-egyenkent"); if (ve) ve.classList.remove("koppint");
}
function mTkTargy(liga, ci) {
  var c = MR.LIGA[liga].szinek[ci % 6];
  return liga === "szabo" ? MR.tekercs(0, -44, c, .95) : (liga === "bajital" ? MR.lombik(0, -2, c, .98) : MR.zsak(0, -2, c, 1.05));
}
function mTk(liga, k, i, extra) {
  var t = mJel(k.n, k.u);
  return '<button class="tk tk-' + liga + (t.length > 7 ? ' hosszu' : '') + '" data-i="' + i + '"' + (extra || "") + '><svg viewBox="-46 -86 92 88" aria-hidden="true">' +
    mTkTargy(liga, i) + '</svg><span class="cimke">' + t + '</span><span class="valt"></span></button>';
}
/* a kártyák alján a közös (legfinomabb) egység: „= 30 dl” */
function mValtIr(p, K) {
  var e = mLegfinomabb(K);
  Array.prototype.forEach.call(p.querySelectorAll(".tk[data-i]"), function (b) {
    var k = K[+b.getAttribute("data-i")], v = b.querySelector(".valt");
    if (k && v && k.u !== e) v.textContent = "= " + mJel(mErtek(k) / M_SZ[e], e);
  });
}
function mKoppMutat(f) {
  var p = mKoppPanel(), o = f.kopp, liga = f.liga, h = "";
  J.kopp = { f: f, kesz: false, lepes: 0 };
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  if (o.tipus === "osszeh")
    h = '<div class="kartyak">' + mTk(liga, o.kartyak[0], 0) + '<button class="egyforma" data-i="=">=<span>egyforma</span></button>' + mTk(liga, o.kartyak[1], 1) + '</div>';
  else if (o.tipus === "gomb")
    h = '<div class="kartyak">' + o.opciok.map(function (t, i) { return '<button class="ketgomb tk-' + liga + '" data-i="' + i + '">' + t + '</button>'; }).join("") + '</div>';
  else if (o.tipus === "jelveny")
    h = '<div class="kartyak">' + o.opciok.map(function (t, i) { return '<button class="ej ej-' + liga + (t.length > 3 ? ' hosszu' : '') + (t.length > 6 ? ' nagyon' : '') + '" data-i="' + i + '"><span>' + t + '</span></button>'; }).join("") + '</div>';
  else if (o.tipus === "sorba") {
    var rot = [-5, 4, -2, 6, -4];
    h = '<div class="szort">' + o.kartyak.map(function (k, i) { return mTk(liga, k, i, ' style="transform:rotate(' + rot[i] + 'deg)"'); }).join("") + '</div>' +
      '<div class="polc"><div class="polc-irany">' + (o.no ? "kicsi ⟶ nagy" : "nagy ⟶ kicsi") + '</div><div class="polc-sor">' +
      o.kartyak.map(function () { return '<div class="hely"></div>'; }).join("") + '</div><div class="polc-deszka"></div></div>';
  } else if (o.tipus === "kakukk") {
    var K = o.kartyak, lep = 360 / (K.length + 1), sz = ["#fde6f0", "#e6f4fd", "#fdf6d8", "#eaf6e3"], F = MR.F;
    var toj = K.map(function (k, i) {
      var x = lep * (i + 1), num = mSzamIr(k.n);
      return '<g class="tojas" data-i="' + i + '"><ellipse cx="' + x + '" cy="84" rx="' + (K.length > 3 ? 36 : 40) + '" ry="48" fill="' + sz[i] + '" stroke="#c9b3a0" stroke-width="2.5"/>' +
        '<circle cx="' + (x - 14) + '" cy="62" r="3" fill="#fff"/><text x="' + x + '" y="84" text-anchor="middle" font-size="' + (num.length > 4 ? 16 : 20) + '" font-weight="800" fill="#4a3b7a" ' + F + '>' + num + '</text>' +
        '<text x="' + x + '" y="106" text-anchor="middle" font-size="17" font-weight="700" fill="#6a5a9a" ' + F + '>' + k.u + '</text></g>';
    }).join("");
    var fonat = [30, 70, 110, 150, 190, 230, 270, 310].map(function (x, i) { return '<path d="M' + x + ' ' + (138 + (i % 2) * 6) + ' q24 ' + (i % 2 ? -8 : 8) + ' 50 0" stroke="#8a5e34" stroke-width="3" fill="none" stroke-linecap="round"/>'; }).join("");
    h = '<div class="feszek"><svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg"><path d="M14 120 Q180 210 346 120 Q330 176 180 184 Q30 176 14 120Z" fill="#c99b6d"/>' + toj +
      '<path d="M6 118 Q180 196 354 118 Q340 150 180 160 Q20 150 6 118Z" fill="#b98652"/>' + fonat + '<g class="valtsor"></g></svg></div>';
  }
  p.innerHTML = h; p.hidden = false;
}
/* rossz koppintás: a motor könyvelése (mint az ertekel rossz ága), de hallgatás nélkül */
function mKoppRossz(f, cimke, html, kimond) {
  J.probak++; J.allomasHibatlan = false; streakLep(false);
  naplozz(f.naplo, false, cimke); hangHiba();
  var v = $("visszajelzes"); v.className = "visszajelzes rossz"; v.innerHTML = html;
  if (kimond) mondd(kimond);
  ment();
}
function mKoppJo(f, kes) {
  J.kopp.kesz = true;
  setTimeout(function () { if (J && J.feladat === f) ertekel(f.helyes); }, kes || 0);
}
function mBillegHalvany(b) { b.classList.add("rossz"); setTimeout(function () { b.classList.remove("rossz"); b.classList.add("kiszurkul"); }, 650); }
function mKoppKatt(ev) {
  var b = ev.target.closest ? ev.target.closest("[data-i]") : null;
  if (!b || !J || !J.kopp || J.kopp.kesz || !J.feladat || J.feladat.csalad !== "koppint") return;
  if (b.classList.contains("kiszurkul") || b.classList.contains("jo") || b.classList.contains("rossz")) return;
  var f = J.feladat, o = f.kopp, p = $("valasz-kartyak"), d = b.getAttribute("data-i");
  hangGomb();
  if (o.tipus === "osszeh") {
    var valasz = d === "=" ? "=" : +d;
    if (valasz === o.jo) {
      b.classList.add("jo"); mValtIr(p, o.kartyak);
      Array.prototype.forEach.call(p.querySelectorAll(".kartyak > :not(.jo)"), function (x) { x.classList.add("kiszurkul"); });
      mKoppJo(f, 500);
    } else {
      mValtIr(p, o.kartyak); mBillegHalvany(b);
      mKoppRossz(f, d === "=" ? "egyforma" : mJel(o.kartyak[+d].n, o.kartyak[+d].u), "Nézzük meg közös egységben!", "Nézzük meg közös egységben!");
    }
  } else if (o.tipus === "gomb" || o.tipus === "jelveny") {
    if (+d === o.jo) { b.classList.add("jo"); mKoppJo(f, 400); }
    else {
      mBillegHalvany(b);
      mKoppRossz(f, o.opciok[+d], "Nem egészen!<small>" + o.mert + "</small>", "Nem egészen! " + mKiejt(o.mert));
    }
  } else if (o.tipus === "sorba") {
    var i = +d;
    if (i === o.rend[J.kopp.lepes]) {
      b.style.transform = ""; b.classList.add("helyen");
      p.querySelectorAll(".hely")[J.kopp.lepes].appendChild(b);
      J.kopp.lepes++;
      $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
      if (J.kopp.lepes >= o.rend.length) mKoppJo(f, 350);
    } else {
      b.classList.add("rossz"); setTimeout(function () { b.classList.remove("rossz"); }, 650);
      mValtIr(p, o.kartyak);
      mKoppRossz(f, mJel(o.kartyak[i].n, o.kartyak[i].u), "Nézzük meg közös egységben!", "Nézzük meg közös egységben!");
    }
  } else if (o.tipus === "kakukk") {
    var K = o.kartyak, e = mLegfinomabb(K), lep = 360 / (K.length + 1), F = MR.F;
    p.querySelector(".valtsor").innerHTML = K.map(function (k, j) {
      return '<rect x="' + (lep * (j + 1) - 35) + '" y="160" width="70" height="22" rx="11" fill="#fff" stroke="#f7c59f" stroke-width="2"/><text x="' + (lep * (j + 1)) +
        '" y="175.5" text-anchor="middle" font-size="11.5" font-weight="800" fill="#c86b2a" ' + F + '>= ' + mJel(mErtek(k) / M_SZ[e], e) + '</text>';
    }).join("");
    if (+d === o.jo) { b.classList.add("kiesik"); mKoppJo(f, 900); }
    else {
      b.classList.add("rossz"); setTimeout(function () { b.classList.remove("rossz"); }, 650);
      mKoppRossz(f, mJel(K[+d].n, K[+d].u), "Nézzük meg közös egységben!", "Nézzük meg közös egységben!");
    }
  }
}

var M_GEN = { meres: genMeres, atvaltas: genAtvaltas, kieg: genKieg, muvelet: genMuvelet, osszetett: genOsszetett,
  mennyivel: genMennyivel, szoveges: genSzoveges,
  osszeh: genOsszeh, becsles: genBecsles, sorba: genSorba, egyseg: genEgyseg, kakukk: genKakukk };   /* 2. szakasz: koppintós kártyák */
GEN.meres = function (cfg, kerultMar) {
  var fajta = mVel(cfg.feladatok || ["atvaltas"]);
  return (M_GEN[fajta] || genAtvaltas)(cfg, kerultMar);
};

/* ═════════════════ MŰHELY-ÖSVÉNY (a jelenet: fal + padló, az ösvény a szőnyeg, az állomás munkapad) ═════════════════ */
function muhelyJelenetSVG(palya, c) {
  var L = palya.muhely, T = MR.LIGA[L], F = MR.F, W = 1200, n = palya.allomasok.length;
  var px = [], py = [];
  for (var k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var d = "M " + px[0].toFixed(1) + " " + py[0].toFixed(1);
  for (var i = 1; i < n; i++) {
    var dx = px[i] - px[i - 1];
    d += " C " + (px[i - 1] + dx / 2).toFixed(1) + " " + py[i - 1].toFixed(1) + " " + (px[i] - dx / 2).toFixed(1) + " " + py[i].toFixed(1) +
         " " + px[i].toFixed(1) + " " + py[i].toFixed(1);
  }
  var FAL = 150, s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="mh-fal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + T.fal1 + '"/><stop offset="1" stop-color="' + T.fal2 + '"/></linearGradient></defs>' +
    '<rect width="1200" height="560" fill="url(#mh-fal)"/>';
  for (var x = 20; x < W; x += 44) s += '<rect x="' + x + '" y="0" width="5" height="' + FAL + '" fill="' + T.csik + '"/>';
  /* füzér a falon */
  var fz = "M0 22";
  for (var q = 0; q < W; q += 240) fz += " Q" + (q + 120) + " 58 " + (q + 240) + " 22";
  s += '<path d="' + fz + '" stroke="' + T.fuzer + '" stroke-width="' + (L === "szabo" ? 9 : 2.5) + '" fill="none"/>';
  if (L === "szabo") s += '<path d="' + fz + '" stroke="' + T.fuzer2 + '" stroke-width="5" stroke-dasharray="1.2 8" fill="none"/>';
  for (var z = 0; z < 21; z++) {
    var zx = 28 + z * 56, tt = (zx % 240) / 240, zy = 22 + 4 * 18 * tt * (1 - tt) + 4, zc = ["#a7d99a", "#c9a8e6", "#f7c59f", "#9ec9f0", "#f6a5c0"][z % 5];
    s += '<g transform="translate(' + zx + ',' + zy.toFixed(1) + ')"><g><animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="' + (2.6 + (z % 4) * .3) + 's" begin="' + (-z * .4) + 's" repeatCount="indefinite"/>' +
      (L === "szabo" ? '<path d="M-9 0 L9 0 L0 20Z" fill="' + zc + '"/>' :
       L === "bajital" ? '<path d="M0 0 L-8 22 L8 22Z" fill="' + (z % 2 ? "#9fcf8a" : "#b6d98f") + '"/><rect x="-3" y="-3" width="6" height="5" fill="#c9a06a"/>' :
       (z % 2 ? '<path d="M0 2 l4 9 l10 1 l-8 6 l3 10 l-9 -5 l-9 5 l3 -10 l-8 -6 l10 -1Z" fill="#d9965c" stroke="#fff" stroke-width="1.5"/>'
              : '<path d="M0 6 C-10 -4 -18 8 0 22 C18 8 10 -4 0 6Z" fill="#d9965c" stroke="#fff" stroke-width="1.5"/>')) + '</g></g>';
  }
  /* padló */
  s += '<rect y="' + FAL + '" width="1200" height="' + (560 - FAL) + '" fill="' + T.padlo + '"/>';
  for (var pl = -40; pl < W + 80; pl += 64) s += '<path d="M' + pl + ' ' + FAL + ' L' + (pl - 80) + ' 560" stroke="' + T.padlo2 + '" stroke-width="2" opacity=".6"/>';
  s += '<rect y="' + (FAL - 4) + '" width="1200" height="8" fill="' + T.padlo2 + '"/>';
  /* a szőnyeg-ösvény */
  s += '<g id="kamera"><path d="' + d + '" fill="none" stroke="' + T.ut2 + '" stroke-width="50" stroke-linecap="round"/>' +
       '<path d="' + d + '" fill="none" stroke="' + T.ut + '" stroke-width="40" stroke-linecap="round"/>' +
       (L === "szabo" ? '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 6" opacity=".9"/>' :
        L === "bajital" ? '<path d="' + d + '" fill="none" stroke="' + T.ut2 + '" stroke-width="30" stroke-dasharray="2 22" stroke-linecap="round" opacity=".45"/>' :
        '<path d="' + d + '" fill="none" stroke="' + T.ut2 + '" stroke-width="40" stroke-dasharray="3 26" opacity=".7"/>');
  /* Rajt-szőnyegecske + Cél-odú (a pad-sor elé kerül az unikornis, a padok elé a névtábla) */
  s += '<g transform="translate(' + px[0] + ',' + py[0] + ')"><ellipse cx="0" cy="10" rx="44" ry="16" fill="' + T.ut2 + '"/><ellipse cx="0" cy="8" rx="36" ry="12" fill="#fff" opacity=".45"/>' +
       '<path d="M0 -24 L0 -2" stroke="#8f6a3e" stroke-width="3"/><path d="M0 -24 L15 -17 L0 -10 Z" fill="#f6a5c0"/></g>';
  var cx = px[n - 1] + 62, cy = py[n - 1] - 6;
  s += '<g transform="translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ')">' +
    '<ellipse cx="0" cy="34" rx="60" ry="16" fill="#2f4a3a" opacity="0.25"/>' +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    '<g transform="translate(0,-100)"><rect x="-56" y="-15" width="112" height="30" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/><text x="0" y="5" font-size="14" ' + F + ' fill="#6a4a8a" text-anchor="middle">Odú-küszöb</text></g>' +
    csillagSVG(0, -128, 8, "#ffe08a") + '</g>';
  s += '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g>';
  /* munkapadok (az unikornis a pad MÖGÖTT áll, a névtábla a pad elején) + pipák */
  for (var a = 1; a < n - 1; a++) {
    var ax = px[a] + 18, ay = py[a] + 22, nev = kiiras(palya.allomasok[a].nev), w = Math.max(84, palya.allomasok[a].nev.length * 7.6 + 20);
    var kellek = L === "szabo" ? MR.tekercs(-18, -30, T.szinek[a % 6], .32) + '<rect x="2" y="-27" width="26" height="5" rx="2" fill="#ffd96b"/>' :
                 L === "bajital" ? MR.lombik(-16, -24, T.szinek[a % 6], .34) + MR.lombik(14, -24, T.szinek[(a + 1) % 6], .26) :
                 MR.kalacs(-14, -24, .42) + MR.zsak(18, -24, "#f3e3c3", .3);
    s += '<g transform="translate(' + ax.toFixed(1) + ',' + ay.toFixed(1) + ') scale(1.3)"><ellipse cx="0" cy="16" rx="50" ry="13" fill="' + T.ut2 + '" opacity=".55"/>' +
      '<rect x="-40" y="-14" width="9" height="30" fill="#b58556"/><rect x="31" y="-14" width="9" height="30" fill="#b58556"/>' +
      '<rect x="-44" y="-24" width="88" height="11" rx="4" fill="#c99b6d"/>' + kellek +
      '<rect x="' + (-w / 2) + '" y="-8" width="' + w + '" height="28" rx="11" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
      '<text x="0" y="11" font-size="13.5" ' + F + ' fill="#6a4a8a" text-anchor="middle">' + nev + '</text></g>';
  }
  for (var b = 0; b < n; b++) {
    var pxx = b > 0 && b < n - 1 ? px[b] + 18 + (Math.max(84, palya.allomasok[b].nev.length * 7.6 + 20) / 2 - 2) * 1.3 : px[b];
    var pyy = b > 0 && b < n - 1 ? py[b] + 22 - 8 * 1.3 : py[b];
    s += '<g class="allomas-pipa" id="pipa-' + b + '" transform="translate(' + pxx.toFixed(1) + ',' + pyy.toFixed(1) + ')" opacity="0"><circle r="13" fill="#a7d99a" stroke="#fff" stroke-width="2"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  return s + '</g></svg>';
}

/* ═════════════════ LIGET-HÁTTEREK a pályaválasztóba (rajzterv 1. kör, jóváhagyva) ═════════════════
   Réteges: fal (div) + padló-csík + felső füzér (2400×38, slice) + két sarok-matrica (360×116, meet). */
var MERES_HATTER = (function () {
  function friz(tartalom) {
    return `<svg viewBox="0 0 2400 38" preserveAspectRatio="xMidYMin slice" style="position:absolute;left:0;right:0;top:0;bottom:auto;width:100%;height:38px">${tartalom}</svg>`;
  }
  function sarok(oldal, tartalom) {
    return `<svg viewBox="0 0 360 116" preserveAspectRatio="${oldal === "bal" ? "xMinYMin" : "xMaxYMin"} meet" style="position:absolute;top:0;bottom:auto;${oldal === "bal" ? "left:0;right:auto" : "right:0;left:auto"};width:min(38%,360px);height:auto;aspect-ratio:360/116">${tartalom}</svg>`;
  }
  function lanc(per, y0, dip, fn) {
    var d = `M0 ${y0}`, el = "", k = 0;
    for (var x = 0; x < 2400; x += per) {
      d += ` Q${x + per / 2} ${y0 + 2 * dip} ${x + per} ${y0}`;
      [.2, .5, .8].forEach(function (t) { el += fn(x + per * t, y0 + 4 * dip * t * (1 - t), k++); });
    }
    return { d: d, el: el };
  }
  function leng(fok, dur, kes) { return `<animateTransform attributeName="transform" type="rotate" values="${-fok};${fok};${-fok}" dur="${dur}s" begin="${-kes}s" repeatCount="indefinite"/>`; }

  function szabo() {
    var L = lanc(240, 3, 12, function (x, y, k) { var c = ["#a7d99a", "#c9a8e6", "#f7c59f", "#9ec9f0", "#f6a5c0"][k % 5];
      return `<g transform="translate(${x.toFixed(1)},${(y + 4).toFixed(1)})"><g>${leng(7, 2.6 + (k % 4) * .3, k * .37)}<path d="M-9 0 L9 0 L0 20Z" fill="${c}"/><circle cx="-2" cy="5" r="1.6" fill="#fff"/><circle cx="3" cy="9" r="1.4" fill="#fff"/></g></g>`; });
    var fri = `<path d="${L.d}" stroke="#ffd96b" stroke-width="9" fill="none"/><path d="${L.d}" stroke="#c79a2a" stroke-width="5" stroke-dasharray="1.2 8" fill="none"/>${L.el}`;
    var bal = `
      <rect x="12" y="70" width="170" height="7" rx="3" fill="#d9a877"/><path d="M26 77 l0 10 l10 -10 M168 77 l0 10 l-10 -10" stroke="#c28d58" stroke-width="3" fill="none"/>
      ${[[34, "#f6a5c0", 28], [70, "#a7d99a", 32], [106, "#c9a8e6", 26]].map(function (v) { var x = v[0], c = v[1], h = v[2]; return `<g transform="translate(${x},70)"><rect x="-13" y="-4" width="26" height="5" rx="2" fill="#e6c49b"/><rect x="-13" y="${-h - 5}" width="26" height="5" rx="2" fill="#e6c49b"/><rect x="-10" y="${-h}" width="20" height="${h - 4}" fill="${c}"/><path d="M-10 ${-h + 6} H10 M-10 ${-h + 12} H10 M-10 ${-h + 18} H10" stroke="#fff" stroke-width="1.2" opacity=".55"/></g>`; }).join("")}
      <g transform="translate(114,52)"><path d="M0 0 Q6 22 -2 44 Q-8 62 2 80" stroke="#c9a8e6" stroke-width="2" fill="none"><animate attributeName="d" values="M0 0 Q6 22 -2 44 Q-8 62 2 80;M0 0 Q-4 22 4 44 Q10 62 -2 80;M0 0 Q6 22 -2 44 Q-8 62 2 80" dur="3.4s" repeatCount="indefinite"/></path></g>
      <g transform="translate(150,58)"><ellipse cx="0" cy="0" rx="17" ry="12" fill="#ef8f8f"/><path d="M-17 0 Q0 -6 17 0" stroke="#d96f6f" stroke-width="1.5" fill="none"/><path d="M0 -12 q3 -5 6 -2" stroke="#7fae5f" stroke-width="3" fill="none"/>
        ${[[-8, -6, "#9ec9f0"], [4, -8, "#fce49a"], [10, -3, "#c9a8e6"], [-2, -2, "#a7d99a"]].map(function (v) { var x = v[0], y = v[1], c = v[2]; return `<line x1="${x}" y1="${y}" x2="${x + 3}" y2="${y - 9}" stroke="#9a9aa8" stroke-width="1.2"/><circle cx="${x + 3}" cy="${y - 10}" r="2.6" fill="${c}"/>`; }).join("")}</g>
      <circle cx="232" cy="12" r="2.5" fill="#b89070"/>
      <g transform="translate(232,12)"><g>${leng(5, 3.8, 0)}<g transform="rotate(8)"><circle cx="-7" cy="12" r="6" fill="none" stroke="#f6a5c0" stroke-width="3.5"/><circle cx="7" cy="12" r="6" fill="none" stroke="#f6a5c0" stroke-width="3.5"/><path d="M-3 17 L2 52 L4 17Z M3 17 L-2 52 L-4 17Z" fill="#c8ccd8" stroke="#9aa0b4" stroke-width="1"/><circle cx="0" cy="18" r="1.8" fill="#9aa0b4"/></g></g></g>
      <g transform="translate(300,44)"><circle r="24" fill="#fff7fb" stroke="#d9a877" stroke-width="5"/><path d="M0 8 C-12 -2 -8 -12 0 -5 C8 -12 12 -2 0 8Z" fill="none" stroke="#f59fb0" stroke-width="2" stroke-dasharray="3 2"/><rect x="-3" y="-30" width="6" height="7" rx="2" fill="#c28d58"/></g>`;
    var jobb = `
      <rect x="150" y="54" width="120" height="6" rx="3" fill="#d9a877"/>
      ${[[172, "#9ec9f0"], [202, "#fce49a"], [232, "#f6a5c0"]].map(function (v) { return `<g transform="translate(${v[0]},40)"><circle r="13" fill="${v[1]}"/><circle r="12" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/><circle r="4" fill="#d9a877"/></g>`; }).join("")}
      <path d="M232 52 Q226 70 238 84 Q250 98 236 112" stroke="#f6a5c0" stroke-width="6" fill="none" stroke-linecap="round"><animate attributeName="d" values="M232 52 Q226 70 238 84 Q250 98 236 112;M232 52 Q240 70 230 84 Q220 98 240 112;M232 52 Q226 70 238 84 Q250 98 236 112" dur="3s" repeatCount="indefinite"/></path>
      <g transform="translate(310,0)"><rect x="-3" y="4" width="6" height="12" fill="#b89070"/><circle cx="0" cy="4" r="5" fill="#c9a06a"/>
        <path d="M-18 16 Q-30 18 -32 34 Q-36 62 -26 86 Q-30 104 -28 116 L28 116 Q30 104 26 86 Q36 62 32 34 Q30 18 18 16Z" fill="#f7c9d9" stroke="#e7a9c0" stroke-width="2"/>
        <path d="M-8 18 Q0 26 8 18" stroke="#e7a9c0" stroke-width="2" fill="none"/>
        <path d="M-14 17 Q-20 40 -12 64" stroke="#ffd96b" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M14 17 Q18 44 10 76" stroke="#ffd96b" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M-14 17 Q-20 40 -12 64" stroke="#c79a2a" stroke-width="4" stroke-dasharray="1 5" fill="none"/><path d="M14 17 Q18 44 10 76" stroke="#c79a2a" stroke-width="4" stroke-dasharray="1 5" fill="none"/>
        <circle cx="-4" cy="44" r="2.4" fill="#fff"/><circle cx="-4" cy="58" r="2.4" fill="#fff"/><circle cx="-4" cy="72" r="2.4" fill="#fff"/></g>`;
    return `<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,0) 0 38px,rgba(236,180,206,.26) 38px 43px),linear-gradient(180deg,#fdeef4,#f6e0ea)"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:repeating-linear-gradient(90deg,#ead0b8 0 60px,#e2c4a8 60px 62px)"></div>
      ${friz(fri)}${sarok("bal", bal)}${sarok("jobb", jobb)}`;
  }
  function bajital() {
    var L = lanc(200, 2, 11, function (x, y, k) { return k % 2
      ? `<g transform="translate(${x.toFixed(1)},${(y + 2).toFixed(1)})"><g>${leng(5, 3 + (k % 3) * .4, k * .5)}<line y2="6" stroke="#a88a6a" stroke-width="1.5"/><circle cy="15" r="7" fill="#fff6b0" opacity=".5"><animate attributeName="opacity" values=".25;.7;.25" dur="${2.2 + (k % 3) * .5}s" begin="${-k * .3}s" repeatCount="indefinite"/></circle><path d="M-2 6 H2 V10 Q7 12 7 16 Q7 22 0 22 Q-7 22 -7 16 Q-7 12 -2 10Z" fill="${["#f6a5c0", "#a7e0c9", "#fce49a"][k % 3]}" stroke="#8a7ab0" stroke-width="1.2"/></g></g>`
      : `<g transform="translate(${x.toFixed(1)},${(y + 2).toFixed(1)})"><g>${leng(4, 3.6, k * .4)}<rect x="-3" y="0" width="6" height="4" fill="#c9a06a"/><path d="M-1 4 L-9 22 L0 17 L9 22 L1 4Z" fill="${k % 4 ? "#9fcf8a" : "#b9a4d8"}"/><path d="M0 4 V20" stroke="#6f9a52" stroke-width="1.2"/></g></g>`; });
    var fri = `<path d="${L.d}" stroke="#a88a6a" stroke-width="2.2" fill="none"/>${L.el}`;
    var bub = "";
    [[46, 0], [62, 1.1], [78, .5], [56, 1.7], [70, 2.3]].forEach(function (v) { var x = v[0], k = v[1];
      bub += `<circle cx="${x}" cy="70" r="3.5" fill="#c9f2de" opacity="0"><animate attributeName="cy" values="72;30" dur="2.4s" begin="${k}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="2.4s" begin="${k}s" repeatCount="indefinite"/><animate attributeName="r" values="2;4.5" dur="2.4s" begin="${k}s" repeatCount="indefinite"/></circle>`; });
    var bal = `
      <path d="M40 30 q-8 -10 2 -18 q10 -8 4 -18" stroke="#fff" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"><animate attributeName="opacity" values=".15;.55;.15" dur="3.6s" repeatCount="indefinite"/></path>
      <g transform="translate(62,108)">
        <g><animateTransform attributeName="transform" type="scale" values="1 1;1.08 1.18;.95 .92;1 1" dur="0.9s" repeatCount="indefinite"/>
          <path d="M-30 8 Q-26 -14 -12 -6 Q-8 -22 0 -8 Q8 -24 12 -6 Q26 -14 30 8Z" fill="#ffb07a"/><path d="M-18 8 Q-12 -6 -4 2 Q0 -10 4 2 Q12 -6 18 8Z" fill="#ffe08a"/></g></g>
      <path d="M18 64 Q18 104 62 106 Q106 104 106 64Z" fill="#6f6592" stroke="#5a5078" stroke-width="3"/>
      <ellipse cx="62" cy="64" rx="46" ry="10" fill="#8a80b0" stroke="#5a5078" stroke-width="3"/>
      <ellipse cx="62" cy="65" rx="38" ry="6.5" fill="#9fe3c4"><animate attributeName="fill" values="#9fe3c4;#bdf2d8;#9fe3c4" dur="2.6s" repeatCount="indefinite"/></ellipse>
      ${bub}
      <line x1="84" y1="62" x2="104" y2="22" stroke="#b07a45" stroke-width="5" stroke-linecap="round"/>
      <rect x="150" y="46" width="120" height="6" rx="3" fill="#b9a08a"/>
      <g transform="translate(176,46)"><path d="M-10 0 V-24 Q-10 -30 -4 -30 H4 Q10 -30 10 -24 V0Z" fill="#f7c59f" stroke="#8a7ab0" stroke-width="1.6"/><rect x="-8" y="-36" width="16" height="6" rx="2" fill="#c9a06a"/><path d="M-4 -14 l4 -6 l4 6 l-4 6Z" fill="#fff"/></g>
      <g transform="translate(214,46)"><path d="M-12 0 V-20 Q-12 -26 -6 -26 H6 Q12 -26 12 -20 V0Z" fill="#c9a8e6" stroke="#8a7ab0" stroke-width="1.6"/><rect x="-10" y="-32" width="20" height="6" rx="2" fill="#c9a06a"/><path d="M0 -8 C-6 -14 -4 -20 0 -16 C4 -20 6 -14 0 -8Z" fill="#fff"/></g>
      <g transform="translate(250,46)"><circle cx="0" cy="-12" r="11" fill="#a7e0c9" stroke="#8a7ab0" stroke-width="1.6"/><rect x="-4" y="-30" width="8" height="10" fill="#e8f2ff" stroke="#8a7ab0" stroke-width="1.4"/></g>`;
    var jobb = `
      <rect x="120" y="62" width="236" height="6" rx="3" fill="#b9a08a"/><path d="M140 68 l0 10 l10 -10 M336 68 l0 10 l-10 -10" stroke="#9a8270" stroke-width="3" fill="none"/>
      <g transform="translate(150,62)"><circle cx="0" cy="-14" r="14" fill="#f6a5c0" stroke="#8a7ab0" stroke-width="1.8"><animate attributeName="fill" values="#f6a5c0;#ffc2d8;#f6a5c0" dur="2.8s" repeatCount="indefinite"/></circle><rect x="-5" y="-40" width="10" height="16" fill="rgba(235,244,255,.9)" stroke="#8a7ab0" stroke-width="1.6"/><circle cx="-5" cy="-18" r="3" fill="#fff" opacity=".7"/></g>
      <g transform="translate(196,62)"><path d="M-5 -40 H5 V-24 L16 0 H-16 L-5 -24Z" fill="rgba(235,244,255,.9)" stroke="#8a7ab0" stroke-width="1.8"/><path d="M-11 -10 L11 -10 L16 0 H-16Z" fill="#a7e0c9"><animate attributeName="fill" values="#a7e0c9;#c8f4e2;#a7e0c9" dur="3.2s" repeatCount="indefinite"/></path></g>
      <g transform="translate(240,62)"><rect x="-9" y="-54" width="18" height="54" rx="3" fill="rgba(235,244,255,.9)" stroke="#8a7ab0" stroke-width="1.8"/><rect x="-8" y="-30" width="16" height="29" fill="#9ec9f0"/>
        ${[0, 1, 2, 3, 4].map(function (k) { return `<line x1="3" x2="9" y1="${-8 - k * 10}" y2="${-8 - k * 10}" stroke="#4a3b7a" stroke-width="1.3"/>`; }).join("")}<rect x="-13" y="-2" width="26" height="4" rx="2" fill="#8a7ab0"/></g>
      <g transform="translate(290,62)"><circle cx="0" cy="-12" r="12" fill="#fce49a" stroke="#8a7ab0" stroke-width="1.8"/><rect x="-4" y="-34" width="8" height="12" fill="rgba(235,244,255,.9)" stroke="#8a7ab0" stroke-width="1.4"/><circle cx="-4" cy="-38" r="5" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;.8;0" dur="2s" repeatCount="indefinite"/><animate attributeName="cy" values="-36;-54" dur="2s" repeatCount="indefinite"/></circle></g>
      <rect x="200" y="106" width="130" height="5" rx="2" fill="#b9a08a"/>
      ${[214, 232, 250, 268, 286, 304].map(function (x, k) { return `<rect x="${x - 4}" y="84" width="8" height="22" rx="4" fill="rgba(235,244,255,.9)" stroke="#8a7ab0" stroke-width="1.3"/><rect x="${x - 3}" y="${92 + (k % 3) * 3}" width="6" height="${13 - (k % 3) * 3}" rx="3" fill="${["#f6a5c0", "#a7e0c9", "#c9a8e6", "#fce49a", "#9ec9f0", "#f7c59f"][k]}"/>`; }).join("")}
      ${[[130, 22], [330, 16], [176, 8]].map(function (v, k) { var x = v[0], y = v[1]; return `<path d="M${x} ${y - 6} l1.6 4.4 l4.4 1.6 l-4.4 1.6 l-1.6 4.4 l-1.6 -4.4 l-4.4 -1.6 l4.4 -1.6Z" fill="#fff2b8"><animate attributeName="opacity" values="0;1;0" dur="${2 + k * .6}s" repeatCount="indefinite"/></path>`; }).join("")}`;
    return `<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,0) 0 98%,rgba(170,150,210,.12) 98%) 0 0/64px 32px,linear-gradient(0deg,rgba(255,255,255,0) 0 94%,rgba(170,150,210,.12) 94%) 0 0/64px 32px,linear-gradient(180deg,#eee8f8,#e2eef2)"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:repeating-linear-gradient(90deg,#d6cfe4 0 46px,#c5bcd8 46px 48px)"></div>
      ${friz(fri)}${sarok("bal", bal)}${sarok("jobb", jobb)}`;
  }
  function pekseg() {
    var L = lanc(220, 3, 11, function (x, y, k) { return `<g transform="translate(${x.toFixed(1)},${(y + 3).toFixed(1)})"><g>${leng(6, 2.8 + (k % 3) * .35, k * .41)}<line y2="4" stroke="#b07a45" stroke-width="1.2"/>${k % 2
        ? `<path d="M0 4 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1Z" fill="#d9965c" stroke="#fff" stroke-width="1.3"/>`
        : `<path d="M0 9 C-9 0 -16 11 0 24 C16 11 9 0 0 9Z" fill="#d9965c" stroke="#fff" stroke-width="1.3"/><circle cx="0" cy="15" r="1.8" fill="#f6a5c0"/>`}</g></g>`; });
    var fri = `<path d="${L.d}" stroke="#b07a45" stroke-width="2.2" fill="none"/>${L.el}`;
    var teglak = "";
    for (var r = 0; r < 5; r++) for (var c = 0; c < 6; c++) { var x = 16 + c * 22 + (r % 2) * 11, y = 34 + r * 14;
      teglak += `<rect x="${x}" y="${y}" width="20" height="12" rx="2" fill="${(r + c) % 3 ? "#e9a27c" : "#dd9570"}"/>`; }
    var bal = `
      <clipPath id="kemenceKlip"><path d="M10 116 V70 Q10 28 76 28 Q142 28 142 70 V116Z"/></clipPath>
      <rect x="96" y="0" width="22" height="36" fill="#dd9570"/><rect x="92" y="0" width="30" height="6" fill="#c9805e"/>
      ${[0, 1.4, 2.8].map(function (k) { return `<circle cx="107" cy="0" r="6" fill="#fff" opacity="0"><animate attributeName="cy" values="0;-30" dur="4.2s" begin="${k}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="4.2s" begin="${k}s" repeatCount="indefinite"/><animate attributeName="r" values="5;11" dur="4.2s" begin="${k}s" repeatCount="indefinite"/></circle>`; }).join("")}
      <path d="M10 116 V70 Q10 28 76 28 Q142 28 142 70 V116Z" fill="#f0b48e"/>
      <g clip-path="url(#kemenceKlip)">${teglak}</g>
      <path d="M10 116 V70 Q10 28 76 28 Q142 28 142 70 V116" fill="none" stroke="#c9805e" stroke-width="3"/>
      <path d="M44 116 V86 Q44 64 76 64 Q108 64 108 86 V116Z" fill="#7a4a3a"/>
      <path d="M48 116 V88 Q48 68 76 68 Q104 68 104 88 V116Z" fill="#ffb86a"><animate attributeName="fill" values="#ffb86a;#ffd08a;#ff9f5a;#ffb86a" dur="1.8s" repeatCount="indefinite"/></path>
      <path d="M56 104 Q76 84 96 104 Q76 112 56 104Z" fill="#d99a52" stroke="#a86a2a" stroke-width="2"/><path d="M66 98 l4 -4 M76 96 l4 -4 M86 98 l4 -4" stroke="#a86a2a" stroke-width="1.6"/>
      <line x1="160" y1="20" x2="186" y2="116" stroke="#c99b6d" stroke-width="5" stroke-linecap="round"/><ellipse cx="160" cy="16" rx="12" ry="16" fill="#e0b476" transform="rotate(-16,160,16)"/>
      ${[[230, 20], [270, 46], [320, 16]].map(function (v) { return `<path d="M${v[0]} ${v[1]} l7 4 l0 8 l-7 4 l-7 -4 l0 -8Z" fill="none" stroke="#f2c96a" stroke-width="2" opacity=".6"/>`; }).join("")}`;
    var MB = 290;
    var jobb = `
      <rect x="120" y="84" width="240" height="8" rx="3" fill="#c99b6d"/>
      <g transform="translate(160,84)"><path d="M-16 0 V-26 Q-16 -32 -10 -32 H10 Q16 -32 16 -26 V0Z" fill="#f6c14a" stroke="#c9902a" stroke-width="2"/><rect x="-18" y="-38" width="36" height="7" rx="3" fill="#f7a8c0"/><rect x="-8" y="-22" width="16" height="10" rx="3" fill="#fff" opacity=".8"/>
        <path d="M8 -40 L22 -62" stroke="#c99b6d" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="23" cy="-64" rx="5" ry="6" fill="#e0b476"/></g>
      <g>
        ${[0, 1].map(function (k) { return `<g><animateMotion dur="${5 + k * 1.5}s" begin="${-k * 2}s" repeatCount="indefinite" path="M${190 + k * 20} ${36 + k * 8} q30 -26 60 0 q-30 26 -60 0 q-30 -26 -60 0 q30 26 60 0"/><ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#fce49a" stroke="#6a4a10" stroke-width="1.2"/><path d="M-2 -4 V4 M2 -4 V4" stroke="#6a4a10" stroke-width="1.4"/><ellipse cx="-1" cy="-6" rx="4" ry="3" fill="#fff" opacity=".8"/></g>`; }).join("")}</g>
      <g transform="translate(222,84)"><path d="M-18 0 Q-22 -14 -8 -16 Q0 -22 8 -16 Q22 -14 18 0Z" fill="#e8a95a" stroke="#b8792a" stroke-width="2"/><path d="M-8 -15 Q-4 -6 -6 0 M8 -15 Q4 -6 6 0" stroke="#b8792a" stroke-width="1.5" fill="none"/></g>
      <g transform="translate(${MB},84)">
        <path d="M-18 0 L18 0 L10 -8 L-10 -8Z" fill="#c99b6d"/><rect x="-3" y="-52" width="6" height="44" fill="#d9ad72"/>
        <g><animateTransform attributeName="transform" type="rotate" values="-5 0 -52;5 0 -52;-5 0 -52" dur="4.4s" repeatCount="indefinite"/>
          <rect x="-44" y="-55" width="88" height="6" rx="3" fill="#e0b476" stroke="#a87a48" stroke-width="1.5"/></g>
        <g><animateTransform attributeName="transform" type="translate" values="0 3.8;0 -3.8;0 3.8" dur="4.4s" repeatCount="indefinite"/>
          <path d="M-44 -52 L-58 -24 M-44 -52 L-30 -24" stroke="#9a7a4a" stroke-width="1.3"/><path d="M-62 -24 Q-44 -14 -26 -24Z" fill="#e8c47a" stroke="#b88a3a" stroke-width="1.5"/><circle cx="-44" cy="-28" r="5" fill="#d99a52"/></g>
        <g><animateTransform attributeName="transform" type="translate" values="0 -3.8;0 3.8;0 -3.8" dur="4.4s" repeatCount="indefinite"/>
          <path d="M44 -52 L30 -24 M44 -52 L58 -24" stroke="#9a7a4a" stroke-width="1.3"/><path d="M26 -24 Q44 -14 62 -24Z" fill="#e8c47a" stroke="#b88a3a" stroke-width="1.5"/><rect x="39" y="-33" width="10" height="9" rx="2" fill="#e9b949"/></g>
        <circle cx="0" cy="-52" r="3.5" fill="#a87a48"/></g>`;
    return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.35) 0 2px,transparent 3px) 0 0/34px 34px,linear-gradient(180deg,#fff4de,#fbe6c4)"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:repeating-linear-gradient(90deg,#efc9a3 0 40px,#e2b58a 40px 42px)"></div>
      ${friz(fri)}${sarok("bal", bal)}${sarok("jobb", jobb)}`;
  }
  return { szabo: szabo(), bajital: bajital(), pekseg: pekseg() };
})();

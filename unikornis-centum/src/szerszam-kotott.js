/* ============ 3g) 📌 KOTOTT — „Ott kezdem, ahol csak egyféle lehet” — a szerszám-létra tartalma ============
   Tartalom: Matekos\szerszam-letrak-tartalom.html 3. pont (✅ döntések 2026-10-09; a 🖊️ mondatok lektorra várnak).
   📖 Mesekönyv (5 feladat): bevezető (3 szereplő) → CSALI (tagadás a szabad szélső helyről) → KÖTÖTT mondat → kérdés.
   📜 Varázstekercs (4 feladat): bevezető (4 szereplő) → VISZONYÍTÓ („közvetlenül … előtt”) → csali → kötött mondat a VÉGÉN.
   🏅 Mesterpróba: igazi versenyfeladat betűhíven, nehézség szerint (SZK_MESTER), mindegyikhez 2 kicsi testvér a 🛗 lifthez.
   A játék minden generált feladatot kiad előbb magának, és végigpróbálja (szkMegoldasDb): csak az kerülhet a gyerek elé,
   amelynek pontosan egy megoldása van. Egy pályán belül két egymás utáni feladat nem lehet ugyanabban a keretben.
   Az elrendezés sorszáma (0-tól): verseny/fagyi 0 = első · polc 0 = legfelső · ház 0 = legalsó emelet.
   A „közvetlenül X előtt / fölött / alatt” mindig: X sorszáma = Y sorszáma − 1. */

/* ── a szereplők rajza ── */
var SZK_KUTYA = {
  Bodri:   { b: "#e9c48f", d: "#9a6b3a", l: "#fbeacc", fl: "#b98a52" },
  "Cézár": { b: "#8a6a52", d: "#4e3828", l: "#d8bfa3", fl: "#5e4636" },
  Foltos:  { b: "#f8f3ec", d: "#6b5a4e", l: "#ffffff", fl: "#6b5a4e", folt: "#6b5a4e" },
  Morzsa:  { b: "#d9a066", d: "#8f5a2a", l: "#f6dcb8", fl: "#a8692f" },
  Pamacs:  { b: "#f4e3c8", d: "#a88e6a", l: "#fffaf0", fl: "#d8c2a0" },
  "Lurkó": { b: "#6e6e7a", d: "#34343e", l: "#b9b9c6", fl: "#45454f" },
  Berci:   { b: "#c98a4b", d: "#7a4f28", l: "#f0d2a8", fl: "#8f5a2e" },
  Luna:    { b: "#efe7f5", d: "#8a7a9a", l: "#ffffff", fl: "#cfc0dd" },
  "Néró":  { b: "#3e3a42", d: "#1e1b22", l: "#8a8590", fl: "#2a272e" },
  Panka:   { b: "#f3c9a8", d: "#b0764e", l: "#fde9d8", fl: "#d49a72", folt: "#d49a72" },
  Szellem: { b: "#ffffff", d: "#9a9aa8", l: "#f2f2f6", fl: "#dcdce6" },
  Kormos:  { b: "#2f2b33", d: "#141216", l: "#6f6a75", fl: "#1f1c22" },
  Tappancs:{ b: "#e8d2b0", d: "#9a7a52", l: "#fff4e2", fl: "#c4a57a", folt: "#c4a57a" }
};
var SZK_PLUSS = { Maci: "brumi", Nyuszi: "pali", "Süni": "samu", Kacsa: "kata", "Róka": "juli" };
var SZK_CICA = { b: "#f2b880", d: "#a8653a", l: "#fde6cc", ful: "malac", pofa: "eger" };
var SZK_LANY = ["Anna", "Csilla", "Emma", "Bori", "Lili", "Noémi", "Cili"];
function szkHash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }
function szkFejSVG(F) { return '<svg class="szk-fej" viewBox="6 2 88 88" aria-hidden="true">' + fgFej(F, "vidam") + '</svg>'; }
function szkGyerekSVG(nev) {
  var h = szkHash(nev), lany = SZK_LANY.indexOf(nev) >= 0;
  var bor = ["#f6d2b4", "#eec39a", "#d9a57a", "#f9dcc6"][h % 4], haj = ["#5a3a22", "#2f2620", "#c98a3a", "#8a4a2a", "#e0b860"][(h >> 2) % 5];
  var s = "";
  if (lany) s += (h % 2 ? '<path d="M18,52 Q14,86 30,90 L70,90 Q86,86 82,52 Z" fill="' + haj + '"/>' :
    '<circle cx="20" cy="40" r="9" fill="' + haj + '"/><circle cx="80" cy="40" r="9" fill="' + haj + '"/>');
  s += '<ellipse cx="50" cy="56" rx="28" ry="29" fill="' + bor + '" stroke="#8a5a3a" stroke-width="1.6"/>';
  s += h % 3 === 0 ? '<path d="M21,50 Q20,24 50,23 Q80,24 79,50 Q70,36 50,38 Q32,36 21,50 Z" fill="' + haj + '"/>' :
    h % 3 === 1 ? '<path d="M22,48 Q24,22 50,22 Q76,22 78,48 L70,40 L62,44 L54,36 L46,44 L38,37 L30,44 Z" fill="' + haj + '"/>' :
    '<path d="M21,52 Q18,22 50,22 Q82,22 79,52 Q74,34 56,34 Q60,40 50,42 Q36,40 21,52 Z" fill="' + haj + '"/>';
  if (lany && !(h % 2)) s += '<path d="M66,26 l10,-6 l0,12 Z M66,26 l-2,-11 l9,6 Z" fill="#ec6b80"/>';
  s += '<ellipse cx="39" cy="57" rx="3.6" ry="4.6" fill="' + FG_INK + '"/><ellipse cx="61" cy="57" rx="3.6" ry="4.6" fill="' + FG_INK + '"/>' +
    '<circle cx="40.4" cy="55.4" r="1.4" fill="#fff"/><circle cx="62.4" cy="55.4" r="1.4" fill="#fff"/>' +
    '<ellipse cx="31" cy="67" rx="5" ry="3.2" fill="#f59bb0" opacity=".55"/><ellipse cx="69" cy="67" rx="5" ry="3.2" fill="#f59bb0" opacity=".55"/>' +
    '<path d="M43,70 Q50,76 57,70" fill="none" stroke="' + FG_INK + '" stroke-width="2.2" stroke-linecap="round"/>';
  return '<svg class="szk-fej" viewBox="6 2 88 92" aria-hidden="true">' + s + '</svg>';
}
function szkKep(szerep, nev) {
  if (szerep === "kutya") { var K = SZK_KUTYA[nev] || SZK_KUTYA.Bodri, F = { ful: "kutya", pofa: "medve" }; for (var k in K) F[k] = K[k]; return szkFejSVG(F); }
  if (szerep === "pluss") return szkFejSVG(nev === "Cica" ? SZK_CICA : FIG_RAJZ[SZK_PLUSS[nev]] || FIG_RAJZ.brumi);
  return szkGyerekSVG(nev);
}
/* zöldségek (szendvics) — kis rajzok */
var SZK_ZOLDSEG = {
  paprika: '<path d="M30,20 Q16,20 16,38 Q16,54 30,54 Q44,54 44,38 Q44,20 30,20 Z" fill="#e8505b" stroke="#a82f3a" stroke-width="2"/><path d="M30,20 Q29,12 34,9" stroke="#4f8f42" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24,26 Q22,36 24,46" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>',
  retek: '<circle cx="30" cy="38" r="13" fill="#e2589b" stroke="#a83a6e" stroke-width="2"/><path d="M30,51 L30,58" stroke="#a83a6e" stroke-width="1.6"/><path d="M30,25 Q22,12 16,14 M30,25 Q30,10 34,8 M30,25 Q38,12 44,14" stroke="#4f8f42" stroke-width="3" fill="none" stroke-linecap="round"/>',
  uborka: '<rect x="12" y="26" width="36" height="16" rx="8" fill="#6fbf5a" stroke="#3f7a30" stroke-width="2" transform="rotate(-20 30 34)"/><g fill="#3f7a30"><circle cx="22" cy="36" r="1.3"/><circle cx="30" cy="32" r="1.3"/><circle cx="38" cy="29" r="1.3"/></g>',
  "zöldhagyma": '<ellipse cx="30" cy="48" rx="8" ry="7" fill="#fff8ee" stroke="#b9a68a" stroke-width="2"/><path d="M27,42 L22,10 M30,41 L30,8 M33,42 L38,10" stroke="#5aa04c" stroke-width="4" stroke-linecap="round"/>'
};
function szkZoldsegKep(z) { return '<svg class="szk-fej" viewBox="6 4 48 56" aria-hidden="true">' + SZK_ZOLDSEG[z] + '</svg>'; }
var SZK_SPORT = { "úszás": "🏊", "kosárlabda": "🏀", "kajak": "🛶", "tollaslabda": "🏸" };
function szkSportKep(s) { return '<span class="szk-emo">' + SZK_SPORT[s] + '</span>'; }

/* ── a jobb lap rajza: a mese helyszíne + a szereplők (a bevezető sorrendjében, NEM a megoldás szerint) ── */
function szkJelenet(hely, szerep, nevek, extra) {
  var bg = {
    verseny: '<rect width="320" height="230" fill="#dff0d4"/><path d="M0,150 Q160,120 320,150 L320,230 L0,230 Z" fill="#b6dd9a"/><path d="M0,175 Q160,150 320,178" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="10 8"/>' +
      '<g transform="translate(262,40)"><rect x="0" y="0" width="4" height="110" fill="#8a6a4a"/><g>' + [0, 1, 2, 3].map(function (i) { return [0, 1, 2, 3, 4].map(function (j) { return '<rect x="' + (4 + j * 8) + '" y="' + (i * 8) + '" width="8" height="8" fill="' + ((i + j) % 2 ? "#fff" : "#3b2f4a") + '"/>'; }).join(""); }).join("") + '</g></g>',
    fagyi: '<rect width="320" height="230" fill="#fdf0e0"/><rect x="14" y="70" width="110" height="90" rx="8" fill="#fff" stroke="#e0a8c0" stroke-width="3"/><path d="M8,70 L130,70 L120,44 L18,44 Z" fill="#f6a5c0"/><path d="M18,44 L28,70 M38,44 L46,70 M58,44 L64,70 M78,44 L82,70 M98,44 L100,70" stroke="#fff" stroke-width="6"/>' +
      '<g transform="translate(40,82)"><path d="M10,18 L18,44 L26,18 Z" fill="#e8b06a"/><circle cx="18" cy="14" r="10" fill="#c9a8e6"/><path d="M40,18 L48,44 L56,18 Z" fill="#e8b06a"/><circle cx="48" cy="14" r="10" fill="#a7d99a"/></g><rect y="200" width="320" height="30" fill="#efd9b8"/>',
    polc: '<rect width="320" height="230" fill="#f6ead8"/><rect x="40" y="16" width="240" height="150" rx="6" fill="#c9905a" stroke="#8a5a32" stroke-width="3"/>' +
      [0, 1, 2, 3].map(function (i) { return '<rect x="48" y="' + (26 + i * 36) + '" width="224" height="28" fill="#f0d9b5"/>'; }).join("") + '<rect y="196" width="320" height="34" fill="#d8b896"/><ellipse cx="160" cy="210" rx="140" ry="14" fill="#c9a8e6" opacity=".6"/>',
    haz: '<rect width="320" height="230" fill="#dcecff"/><path d="M90,60 L160,14 L230,60 Z" fill="#e07a6a" stroke="#a84a3a" stroke-width="3"/><rect x="100" y="60" width="120" height="120" fill="#fff4dc" stroke="#c9a46a" stroke-width="3"/>' +
      [0, 1, 2].map(function (i) { return '<rect x="116" y="' + (70 + i * 36) + '" width="22" height="20" fill="#9ec9f0" stroke="#6a8aa8" stroke-width="2"/><rect x="182" y="' + (70 + i * 36) + '" width="22" height="20" fill="#9ec9f0" stroke="#6a8aa8" stroke-width="2"/>'; }).join("") + '<rect y="180" width="320" height="50" fill="#b6dd9a"/>',
    tal: '<rect width="320" height="230" fill="#fdf0e0"/><rect y="150" width="320" height="80" fill="#e8d2b0"/>' + [0, 1, 2, 3, 4].map(function (i) { return '<g transform="translate(' + (34 + i * 62) + ',190)"><ellipse rx="22" ry="8" fill="#9ec9f0" stroke="#4a7aa8" stroke-width="2"/><ellipse cy="-3" rx="16" ry="4" fill="#c98a4b"/></g>'; }).join(""),
    tura: '<rect width="320" height="230" fill="#e6f3ff"/><path d="M0,140 L70,60 L130,130 L200,40 L320,150 L320,230 L0,230 Z" fill="#b6dd9a"/><path d="M200,40 L220,62 L180,62 Z" fill="#fff"/><rect y="190" width="320" height="40" fill="#9ccf7e"/>'
  }[hely] || "";
  var n = nevek.length, w = Math.min(70, 290 / n);
  var fejek = nevek.map(function (nv, i) {
    var x = 160 + (i - (n - 1) / 2) * (w + 4), y = hely === "polc" ? 172 : hely === "tal" ? 132 : 150;
    return '<g transform="translate(' + (x - w / 2) + ',' + (y - w) + ')"><foreignObject width="' + w + '" height="' + (w + 22) + '"><div xmlns="http://www.w3.org/1999/xhtml" class="szk-szereplo">' + szkKep(szerep, nv) + '<span>' + nv + '</span></div></foreignObject></g>';
  }).join("");
  return '<svg class="op-rajz" viewBox="0 0 320 230" preserveAspectRatio="xMidYMid meet">' + bg + (extra || "") + fejek + '</svg>';
}

/* ── a négy mese-keret (tartalom-lap 3.1) ── */
var SZK_KERET = {
  verseny: { hely: "verseny", szerep: "kutya", dob: "dobogo", nevek: ["Bodri", "Cézár", "Foltos", "Morzsa", "Pamacs", "Lurkó"],
    bev: ["Három kiskutya futott versenyt: {L}.", "Négy kiskutya futott versenyt: {L}."],
    elso: "{X} nyert.", utolso: "{X} lett az utolsó.", nemElso: "{X} nem nyert.", nemUtolso: "{X} nem lett utolsó.",
    kozv: "{X} közvetlenül {Y} előtt ért célba.", kerdes: "Milyen sorrendben értek célba?", fn: "helyre", tobb: ["három kutyával", "négy kutyával"] },
  fagyi: { hely: "fagyi", szerep: "gyerek", dob: "sor", pult: "🍦", nevek: ["Anna", "Bence", "Csilla", "Dani", "Emma", "Feri"],
    bev: ["{L} sorban áll a fagyisnál.", "{L} sorban áll a fagyisnál."],
    elso: "{X} áll legelöl, a pultnál.", utolso: "{X} áll a sor végén.", nemElso: "{X} nem áll legelöl.", nemUtolso: "{X} nem a sor végén áll.",
    kozv: "{X} közvetlenül {Y} előtt áll.", kerdes: "Milyen sorrendben állnak a sorban?", fn: "helyre", tobb: ["három gyerekkel", "négy gyerekkel"] },
  polc: { hely: "polc", szerep: "pluss", dob: "polc", nevek: ["Maci", "Nyuszi", "Cica", "Süni", "Kacsa", "Róka"],
    bev: ["{L} a polcokon ül, mindegyik más polcon.", "{L} a négy polcon ül, mindegyik más polcon."],
    elso: "{X} a legfelső polcon ül.", utolso: "{X} a legalsó polcon ül.", nemElso: "{X} nem a legfelső polcon ül.", nemUtolso: "{X} nem a legalsó polcon ül.",
    kozv: "{X} közvetlenül {Y} fölött ül.", kerdes: "Ki melyik polcon ül?", fn: "fentről {o} polcra", tobb: ["három plüssállattal", "négy plüssállattal"] },
  haz: { hely: "haz", szerep: "gyerek", dob: "haz", nevek: ["Bori", "Gergő", "Lili", "Marci", "Noémi", "Olivér"],
    bev: ["{L} egy háromemeletes házban lakik, mindenki más emeleten.", "{L} egy négyemeletes házban lakik, mindenki más emeleten."],
    elso: "{X} a legalsó emeleten lakik.", utolso: "{X} lakik legfelül.", nemElso: "{X} nem a legalsó emeleten lakik.", nemUtolso: "{X} nem lakik legfelül.",
    kozv: "{X} közvetlenül {Y} alatt lakik.", kerdes: "Ki hányadik emeleten lakik?", fn: "emeletre", tobb: ["három baráttal", "négy baráttal"] }
};
var SZK_KERET_SOR = ["verseny", "fagyi", "polc", "haz"];
function szkLista(L) { return L.length < 2 ? L.join("") : L.slice(0, -1).join(", ") + " és " + L[L.length - 1]; }
function szkM(K, tip, x, y) { return K[tip].replace("{X}", x).replace("{Y}", y || ""); }
function szkHelyre(K, i) { var o = OP_SORSZ[i], t = K.fn.indexOf("{o}") >= 0 ? K.fn.replace("{o}", o) : o + " " + K.fn; return (/^[aeiouáéíóöőúüű]/i.test(t) ? "az " : "a ") + t; }

/* ── ellenőrzők: egy mondat igaz-e egy elrendezésre (ord: nevek sorszám szerint) ── */
function szkIgaz(c, ord) {
  var i = ord.indexOf(c.x), n = ord.length;
  if (c.t === "elso") return i === 0;
  if (c.t === "utolso") return i === n - 1;
  if (c.t === "nemElso") return i !== 0;
  if (c.t === "nemUtolso") return i !== n - 1;
  if (c.t === "kozv") return i === ord.indexOf(c.y) - 1;
  return true;
}
function szkPermek(a) {
  if (a.length < 2) return [a.slice()];
  var ki = [];
  a.forEach(function (x, i) { var r = a.slice(0, i).concat(a.slice(i + 1)); szkPermek(r).forEach(function (p) { ki.push([x].concat(p)); }); });
  return ki;
}
/* hány elrendezés felel meg minden mondatnak — a gyerek elé csak az 1 megoldásos kerül */
function szkMegoldasDb(nevek, felt) {
  return szkPermek(nevek).filter(function (p) { return felt.every(function (c) { return szkIgaz(c, p); }); }).length;
}

/* ── egy generált feladat (3 vagy 4 szereplő) ──
   o = { keret, n: 3|4, nevek?: [] (a lift: a nagy feladat szereplői közül), veg?: 0|1 (melyik szélről szól a kötött mondat) } */
function szkGeneral(o) {
  var K = SZK_KERET[o.keret], n = o.n;
  for (var proba = 0; proba < 50; proba++) {
    var N = mKever(o.nevek && o.nevek.length >= n ? o.nevek : K.nevek).slice(0, n);
    var e = o.veg != null ? (o.veg ? n - 1 : 0) : veletlen(0, 1) * (n - 1), f = n - 1 - e;
    var D = N[0], C = N[1], A = N[2], B = N[3];
    var sol, felt = [], mon = [];
    var kotott = { t: e === 0 ? "elso" : "utolso", x: D }, csali = { t: f === 0 ? "nemElso" : "nemUtolso", x: C };
    if (n === 3) { sol = e === 0 ? [D, C, A] : [A, C, D]; felt = [csali, kotott]; }
    else { var kozv = { t: "kozv", x: A, y: B }; sol = e === 0 ? [D, C, A, B] : [A, B, C, D]; felt = [kozv, csali, kotott]; }
    if (szkMegoldasDb(N, felt) !== 1 || !felt.every(function (c) { return szkIgaz(c, sol); })) continue;
    var bevL = mKever(N);                                       /* a bevezető NEM a megoldás sorrendjében sorolja őket */
    mon.push({ s: K.bev[n - 3].replace("{L}", szkLista(bevL)) });
    felt.forEach(function (c) { mon.push({ s: szkM(K, c.t, c.x, c.y), c: c, ki: c.x }); });
    /* a végigvezetés lépései (a gondolatmenet, nem csak a megoldás) */
    var lep = [];
    lep.push({ t: szkM(K, kotott.t, D) + " Őt tesszük " + szkHelyre(K, e) + ".", tesz: [[0, e, D]] });
    if (n === 3) {
      lep.push({ t: szkM(K, csali.t, C) + " Így " + C + " csak " + szkHelyre(K, 1) + " kerülhet.", tesz: [[0, 1, C]] });
      lep.push({ t: A + " maradt: ő kerül " + szkHelyre(K, f) + ".", tesz: [[0, f, A]] });
    } else {
      var ci = e === 0 ? 1 : 2, ai = e === 0 ? 2 : 0;
      lep.push({ t: szkM(K, "kozv", A, B) + " Ők ketten csak egymás mellett férnek el.", tesz: [] });
      lep.push({ t: szkM(K, csali.t, C) + " Így " + C + " " + szkHelyre(K, ci) + " kerül.", tesz: [[0, ci, C]] });
      lep.push({ t: A + " és " + B + " a maradék két helyre kerül, ebben a sorrendben.", tesz: [[0, ai, A], [0, ai + 1, B]] });
    }
    return { keret: o.keret, K: K, n: n, nevek: N, bevL: bevL, sol: sol, mon: mon, kerdes: K.kerdes, lep: lep, veg: e ? 1 : 0,
      kulcs: o.keret + ":" + sol.join(",") };
  }
  return null;
}
/* a feladat dobogója + a gyerek elrendezésének ellenőrzője (mondatonként) */
function szkDob(g) {
  return { keret: g.K.dob, pult: g.K.pult, n: g.n, sorok: [{ darabok: g.bevL.map(function (nv) { return { id: nv, nev: nv, kep: szkKep(g.K.szerep, nv) }; }) }], jo: [g.sol.slice()] };
}
function szkMondatOk(m, A) { return !m.c || szkIgaz(m.c, A.s[0]); }

/* ── 🏅 Mesterpróbák (tartalom-lap 3.4) — betűhíven, nehézség szerint; ok(A): a mondat (rész) igaz-e a gyerek elrendezésére ── */
var SZK_MESTER = [
  { id: "zrinyi-2024-3-M-16", cim: "Az öt kutya vacsorája", forras: "Zrínyi 2024 / 3. o. megyei 16.",
    hely: "tal", szerep: "kutya", dob: { keret: "sor", pult: "🥣" }, tobb: "öt kutyával", kicsiKeret: "verseny",
    nevek: ["Berci", "Luna", "Néró", "Panka", "Szellem"], jo: ["Luna", "Panka", "Berci", "Néró", "Szellem"],
    mon: [{ s: "Az öt kutyámat: Bercit (B), Lunát (L), Nérót (N), Pankát (P) és Szellemet (Sz) vacsorázni hívtam." },
          { s: "Táljaikhoz egymás után értek oda úgy, hogy Bercit két kutya előzte meg, Szellem és Néró Panka után érkezett, de Panka nem lett első, Néró pedig nem lett utolsó.",
            ok: [["Bercit két kutya előzte meg", "Berci", function (A) { return A.hol("Berci") === 2; }],
                 ["Szellem és Néró Panka után érkezett", "Panka", function (A) { return A.hol("Szellem") > A.hol("Panka") && A.hol("Néró") > A.hol("Panka"); }],
                 ["Panka nem lett első", "Panka", function (A) { return A.hol("Panka") !== 0; }],
                 ["Néró pedig nem lett utolsó", "Néró", function (A) { return A.hol("Néró") !== 4; }]] }],
    kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
    vissza: "Itt is Berci helye a biztos. Kezdd vele!",
    lep: [{ t: "Bercit két kutya előzte meg: ő a harmadik.", tesz: [[0, 2, "Berci"]] },
          { t: "Panka nem lett első, és két kutya is utána érkezett: ő csak a második lehet.", tesz: [[0, 1, "Panka"]] },
          { t: "Szellem és Néró Panka után jött, ezért az első hely Lunáé.", tesz: [[0, 0, "Luna"]] },
          { t: "Néró nem lett utolsó: ő a negyedik, Szellem pedig az ötödik.", tesz: [[0, 3, "Néró"], [0, 4, "Szellem"]] }],
    kicsik: [
      { nevek: ["Berci", "Luna", "Panka"], jo: ["Luna", "Berci", "Panka"],
        mon: [{ s: "A három kutyámat: Bercit, Lunát és Pankát vacsorázni hívtam." },
              { s: "Bercit egy kutya előzte meg.", ki: "Berci", ok1: function (A) { return A.hol("Berci") === 1; } },
              { s: "Panka nem lett első.", ki: "Panka", ok1: function (A) { return A.hol("Panka") !== 0; } }],
        kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
        lep: [{ t: "Bercit egy kutya előzte meg: ő a második.", tesz: [[0, 1, "Berci"]] }, { t: "Panka nem lett első, tehát ő a harmadik.", tesz: [[0, 2, "Panka"]] }, { t: "Luna maradt: ő az első.", tesz: [[0, 0, "Luna"]] }] },
      { nevek: ["Berci", "Luna", "Néró", "Panka"], jo: ["Luna", "Panka", "Berci", "Néró"],
        mon: [{ s: "A négy kutyámat: Bercit, Lunát, Nérót és Pankát vacsorázni hívtam." },
              { s: "Bercit két kutya előzte meg.", ki: "Berci", ok1: function (A) { return A.hol("Berci") === 2; } },
              { s: "Néró Panka után érkezett.", ki: "Néró", ok1: function (A) { return A.hol("Néró") > A.hol("Panka"); } },
              { s: "Panka nem lett első.", ki: "Panka", ok1: function (A) { return A.hol("Panka") !== 0; } }],
        kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
        lep: [{ t: "Bercit két kutya előzte meg: ő a harmadik.", tesz: [[0, 2, "Berci"]] }, { t: "Panka nem lett első, és Néró utána jött: Panka a második.", tesz: [[0, 1, "Panka"]] },
              { t: "Néró Panka után jött: ő a negyedik. Luna az első.", tesz: [[0, 3, "Néró"], [0, 0, "Luna"]] }] }] },

  { id: "kalmar-2013-3-O2-1", cim: "Az agárverseny", forras: "Kalmár 2013 / 3. o. országos 2. nap 1.",
    hely: "verseny", szerep: "kutya", dob: { keret: "dobogo" }, tobb: "öt kutyával", kicsiKeret: "verseny",
    nevek: ["Bodri", "Cézár", "Kormos", "Foltos", "Tappancs"], jo: ["Cézár", "Kormos", "Bodri", "Tappancs", "Foltos"],
    mon: [{ s: "Az agárverseny döntőjében öt kutya állt rajthoz: Bodri, Cézár, Kormos, Foltos és Tappancs." },
          { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál és Bodrinál.",
            ok: [["Kormos nem nyert", "Kormos", function (A) { return A.hol("Kormos") !== 0; }],
                 ["gyorsabb volt Tappancsnál és Bodrinál", "Kormos", function (A) { return A.hol("Kormos") < A.hol("Tappancs") && A.hol("Kormos") < A.hol("Bodri"); }]] },
          { s: "Bodri nem lett utolsó.", ki: "Bodri", ok1: function (A) { return A.hol("Bodri") !== 4; } },
          { s: "Tappancs közvetlenül Foltos előtt ért célba.", ki: "Tappancs", ok1: function (A) { return A.hol("Tappancs") === A.hol("Foltos") - 1; } }],
    kerdes: "Milyen sorrendben érkeztek be a kutyák a célba, ha nem volt holtverseny? Válaszodat indokold!",
    indok: "Kormos nem nyert, és Tappancs, Bodri meg Foltos is mögötte van, ezért csak Cézár nyerhetett. Kormos lett a második. Tappancs és Foltos egymás után jött, Bodri pedig nem lett utolsó, ezért Bodri a harmadik, Tappancs a negyedik, Foltos az ötödik.",
    vissza: "Most is Kormosról tudunk a legtöbbet.",
    lep: [{ t: "Kormos nem nyert, de Tappancs és Bodri is mögötte van. Foltos pedig Tappancs mögött jön. Így az első csak Cézár lehet.", tesz: [[0, 0, "Cézár"]] },
          { t: "Kormos mindenki más előtt van: ő a második.", tesz: [[0, 1, "Kormos"]] },
          { t: "Tappancs és Foltos egymás után jön, Bodri pedig nem utolsó: Bodri a harmadik.", tesz: [[0, 2, "Bodri"]] },
          { t: "Tappancs a negyedik, közvetlenül utána Foltos az ötödik.", tesz: [[0, 3, "Tappancs"], [0, 4, "Foltos"]] }],
    kicsik: [
      { nevek: ["Bodri", "Kormos", "Tappancs"], jo: ["Bodri", "Kormos", "Tappancs"],
        mon: [{ s: "Az agárverseny döntőjében három kutya állt rajthoz: Bodri, Kormos és Tappancs." },
              { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál.", ki: "Kormos", ok1: function (A) { return A.hol("Kormos") !== 0 && A.hol("Kormos") < A.hol("Tappancs"); } }],
        kerdes: "Milyen sorrendben érkeztek be a kutyák a célba?",
        lep: [{ t: "Kormos nem nyert, de Tappancs mögötte van: Kormos a második, Tappancs a harmadik.", tesz: [[0, 1, "Kormos"], [0, 2, "Tappancs"]] }, { t: "Bodri maradt: ő nyert.", tesz: [[0, 0, "Bodri"]] }] },
      { nevek: ["Bodri", "Kormos", "Foltos", "Tappancs"], jo: ["Bodri", "Kormos", "Tappancs", "Foltos"],
        mon: [{ s: "Az agárverseny döntőjében négy kutya állt rajthoz: Bodri, Kormos, Foltos és Tappancs." },
              { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál.", ki: "Kormos", ok1: function (A) { return A.hol("Kormos") !== 0 && A.hol("Kormos") < A.hol("Tappancs"); } },
              { s: "Bodri nem lett utolsó.", ki: "Bodri", ok1: function (A) { return A.hol("Bodri") !== 3; } },
              { s: "Tappancs közvetlenül Foltos előtt ért célba.", ki: "Tappancs", ok1: function (A) { return A.hol("Tappancs") === A.hol("Foltos") - 1; } }],
        kerdes: "Milyen sorrendben érkeztek be a kutyák a célba?",
        lep: [{ t: "Kormos nem nyert, Tappancs és Foltos pedig mögötte van: így Bodri nyert.", tesz: [[0, 0, "Bodri"]] }, { t: "Kormos a második.", tesz: [[0, 1, "Kormos"]] },
              { t: "Tappancs közvetlenül Foltos előtt: Tappancs a harmadik, Foltos a negyedik.", tesz: [[0, 2, "Tappancs"], [0, 3, "Foltos"]] }] }] },

  { id: "kalmar-2023-3-M-5", cim: "Szendvics a túrán", forras: "Kalmár 2023 / 3. o. megyei 5.",
    hely: "tura", szerep: "gyerek", tobb: "négy gyerekkel", kicsiKeret: "fagyi", ket: true,
    dob: { keret: "tabla", cimkek: ["134 cm", "144 cm", "146 cm", "156 cm"], sorNev: ["gyerek", "zöldség"] },
    nevek: ["Anna", "Berci", "Cili", "Dani"], attr: ["paprika", "retek", "uborka", "zöldhagyma"],
    jo: ["Dani", "Cili", "Anna", "Berci"], joAttr: ["retek", "paprika", "zöldhagyma", "uborka"],
    mon: [{ s: "Anna, Berci, Cili és Dani túrázni indultak, az útra mindenki szendvicset készített magának." },
          { s: "Mindegyikük egyféle zöldséget evett a szendvicséhez a paprika, retek, uborka és zöldhagyma közül, és nem volt két gyerek, aki ugyanolyan zöldséget evett volna." },
          { s: "A gyerekek magassága 134 cm, 144 cm, 146 cm és 156 cm." },
          { s: "Tudjuk, hogy Berci uborkát eszik a szendvicséhez.", ki: "Berci", ok1: function (A) { return A.attr("Berci") === "uborka"; } },
          { s: "Aki paprikát eszik, az 10 centiméterrel magasabb Daninál.", ok1: function (A) { var H = [134, 144, 146, 156], k = A.kie("paprika"); return k != null && H[A.hol(k)] === H[A.hol("Dani")] + 10; } },
          { s: "Dani nem szereti a zöldhagymát.", ki: "Dani", ok1: function (A) { return A.attr("Dani") !== "zöldhagyma"; } },
          { s: "Anna 146 cm magas.", ki: "Anna", ok1: function (A) { return A.hol("Anna") === 2; } }],
    kerdes: "Írd be a táblázatba, ki melyik zöldséget ette a szendvicséhez, és milyen magas?",
    vissza: "Most is Daniról tudsz a legtöbbet.",
    lep: [{ t: "Anna 146 cm magas: őt tesszük a 146 centis oszlopba.", tesz: [[0, 2, "Anna"]] },
          { t: "A paprikás gyerek 10 centivel magasabb Daninál. Csak a 134 és a 144 között van ennyi, ezért Dani 134 cm, a paprikás gyerek pedig 144 cm magas.", tesz: [[0, 0, "Dani"], [1, 1, "paprika"]] },
          { t: "Berci uborkát eszik, így nem ő a paprikás: Berci a legmagasabb, Cili eszi a paprikát.", tesz: [[0, 3, "Berci"], [0, 1, "Cili"], [1, 3, "uborka"]] },
          { t: "Dani nem eszik zöldhagymát, ezért ő a retket eszi, Annának marad a zöldhagyma.", tesz: [[1, 0, "retek"], [1, 2, "zöldhagyma"]] }],
    kicsik: [
      { nevek: ["Anna", "Berci", "Dani"], attr: ["paprika", "retek", "uborka"], csakAttr: true,
        dob: { keret: "tabla", fejNevek: true }, jo: ["Anna", "Berci", "Dani"], joAttr: ["paprika", "uborka", "retek"],
        mon: [{ s: "Anna, Berci és Dani túrázni indultak." },
              { s: "Mindegyikük más zöldséget evett a szendvicséhez: paprikát, retket vagy uborkát." },
              { s: "Berci uborkát eszik.", ki: "Berci", ok1: function (A) { return A.attr("Berci") === "uborka"; } },
              { s: "Dani nem szereti a paprikát.", ki: "Dani", ok1: function (A) { return A.attr("Dani") !== "paprika"; } }],
        kerdes: "Ki melyik zöldséget ette?",
        lep: [{ t: "Berci uborkát eszik.", tesz: [[1, 1, "uborka"]] }, { t: "Dani nem szereti a paprikát, ezért ő a retket eszi.", tesz: [[1, 2, "retek"]] }, { t: "Annának marad a paprika.", tesz: [[1, 0, "paprika"]] }] },
      { nevek: ["Anna", "Berci", "Dani"], attr: ["paprika", "retek", "uborka"],
        dob: { keret: "tabla", cimkek: ["130 cm", "135 cm", "140 cm"] }, jo: ["Berci", "Dani", "Anna"], joAttr: ["uborka", "retek", "paprika"],
        mon: [{ s: "Anna, Berci és Dani túrázni indultak." },
              { s: "Mindegyikük más zöldséget evett a szendvicséhez: paprikát, retket vagy uborkát." },
              { s: "A gyerekek magassága 130 cm, 135 cm és 140 cm." },
              { s: "Berci uborkát eszik.", ki: "Berci", ok1: function (A) { return A.attr("Berci") === "uborka"; } },
              { s: "Aki paprikát eszik, az 5 centiméterrel magasabb Daninál.", ok1: function (A) { var k = A.kie("paprika"); return k != null && A.hol(k) === A.hol("Dani") + 1; } },
              { s: "Anna 140 cm magas.", ki: "Anna", ok1: function (A) { return A.hol("Anna") === 2; } }],
        kerdes: "Ki melyik zöldséget ette, és milyen magas?",
        lep: [{ t: "Anna 140 cm magas.", tesz: [[0, 2, "Anna"]] }, { t: "Berci uborkát eszik, így nem ő a paprikás. Ha Dani 130 centis lenne, Berci lenne a paprikás, ezért Dani 135 cm, Berci 130 cm.", tesz: [[0, 1, "Dani"], [0, 0, "Berci"], [1, 0, "uborka"]] },
              { t: "A paprikás 5 centivel magasabb Daninál: ő Anna. Daninak marad a retek.", tesz: [[1, 2, "paprika"], [1, 1, "retek"]] }] }] },

  { id: "kalmar-2016-3-O2-1", cim: "Négy barát a négyemeletes házban", forras: "Kalmár 2016 / 3. o. országos 2. nap 1.",
    hely: "haz", szerep: "gyerek", tobb: "négy baráttal", kicsiKeret: "haz", ket: true,
    dob: { keret: "haz2", sorNev: ["barát", "sport"] },
    nevek: ["András", "Gábor", "Dávid", "Csaba"], attr: ["úszás", "kosárlabda", "kajak", "tollaslabda"],
    jo: ["Csaba", "Gábor", "Dávid", "András"], joAttr: ["tollaslabda", "úszás", "kosárlabda", "kajak"],
    mon: [{ s: "Négy barát, András, Gábor, Dávid és Csaba egy négyemeletes ház négy különböző emeletén lakik." },
          { s: "Mind a négyen sportolnak, egyikük úszik, másik kosárlabdázik, harmadik kajakozik, negyedik tollaslabdázik." },
          { s: "A kosárlabdázó, az úszó és Csaba, mindhárman András alatt laknak.", ki: "András",
            ok1: function (A) { var a = A.hol("András"), k = A.kie("kosárlabda"), u = A.kie("úszás"); return k !== "Csaba" && u !== "Csaba" && A.hol(k) < a && A.hol(u) < a && A.hol("Csaba") < a; } },
          { s: "Az úszónak egy emeletet kell felmenni az otthonából, ha meg akarja látogatni Dávidot, és egy emeletet le, ha a tollaslabdázót szeretné felkeresni.",
            ok: [["egy emeletet kell felmenni az otthonából, ha meg akarja látogatni Dávidot", "Dávid", function (A) { var u = A.kie("úszás"); return A.hol("Dávid") === A.hol(u) + 1; }],
                 ["egy emeletet le, ha a tollaslabdázót szeretné felkeresni", null, function (A) { var u = A.kie("úszás"), t = A.kie("tollaslabda"); return A.hol(t) === A.hol(u) - 1; }]] }],
    kerdes: "Ki mit sportol, és hányadik emeleten lakik?",
    vissza: "Most is Andrással kezdd: hányan laknak alatta?",
    lep: [{ t: "A kosárlabdázó, az úszó és Csaba három különböző gyerek, és mind András alatt lakik. Így András lakik legfelül, a negyedik emeleten.", tesz: [[0, 3, "András"]] },
          { t: "András nem úszik és nem kosarazik. Tollaslabdázó sem lehet, mert a tollaslabdázó az úszó alatt lakik: András kajakozik.", tesz: [[1, 3, "kajak"]] },
          { t: "Az úszó nem Csaba, és nem is Dávid, mert Dávid az úszó fölött lakik: Gábor az úszó.", tesz: [] },
          { t: "Gábor alatt a tollaslabdázó, fölötte Dávid lakik: Gábor a második emeleten, Dávid a harmadikon lakik.", tesz: [[0, 1, "Gábor"], [1, 1, "úszás"], [0, 2, "Dávid"]] },
          { t: "Csaba a legalsó emeleten lakik, ő tollaslabdázik, Dávid pedig kosárlabdázik.", tesz: [[0, 0, "Csaba"], [1, 0, "tollaslabda"], [1, 2, "kosárlabda"]] }],
    kicsik: [
      { nevek: ["András", "Gábor", "Csaba"], dob: { keret: "haz" }, jo: ["Gábor", "Csaba", "András"],
        mon: [{ s: "Három barát, András, Gábor és Csaba egy háromemeletes ház három különböző emeletén lakik." },
              { s: "Gábor és Csaba is András alatt lakik.", ki: "András", ok1: function (A) { return A.hol("András") === 2; } },
              { s: "Csaba nem a legalsó emeleten lakik.", ki: "Csaba", ok1: function (A) { return A.hol("Csaba") !== 0; } }],
        kerdes: "Ki hányadik emeleten lakik?",
        lep: [{ t: "Gábor és Csaba is András alatt lakik: András lakik legfelül.", tesz: [[0, 2, "András"]] }, { t: "Csaba nem a legalsó emeleten lakik: ő a második emeleten van.", tesz: [[0, 1, "Csaba"]] }, { t: "Gábor maradt: ő lakik a legalsó emeleten.", tesz: [[0, 0, "Gábor"]] }] },
      { nevek: ["András", "Gábor", "Csaba"], attr: ["úszás", "kosárlabda", "kajak"], dob: { keret: "haz2" },
        jo: ["Gábor", "Csaba", "András"], joAttr: ["úszás", "kosárlabda", "kajak"],
        mon: [{ s: "Három barát, András, Gábor és Csaba egy háromemeletes ház három különböző emeletén lakik." },
              { s: "Egyikük úszik, másik kosárlabdázik, harmadik kajakozik." },
              { s: "Az úszó és Csaba is András alatt lakik.", ki: "András", ok1: function (A) { var u = A.kie("úszás"); return u !== "Csaba" && A.hol("András") === 2; } },
              { s: "Az úszónak egy emeletet kell felmenni, ha meg akarja látogatni Csabát.", ok1: function (A) { var u = A.kie("úszás"); return A.hol("Csaba") === A.hol(u) + 1; } },
              { s: "Csaba kosárlabdázik.", ki: "Csaba", ok1: function (A) { return A.attr("Csaba") === "kosárlabda"; } }],
        kerdes: "Ki mit sportol, és hányadik emeleten lakik?",
        lep: [{ t: "Az úszó és Csaba is András alatt lakik: András legfelül lakik.", tesz: [[0, 2, "András"]] }, { t: "Csaba kosárlabdázik, így Gábor az úszó, és Andrásnak marad a kajak.", tesz: [[1, 2, "kajak"]] },
              { t: "Gábor egy emelettel Csaba alatt lakik: Gábor a legalsó, Csaba a második emeleten.", tesz: [[0, 0, "Gábor"], [1, 0, "úszás"], [0, 1, "Csaba"], [1, 1, "kosárlabda"]] }] }] }
];
function szkMester(id) { for (var i = 0; i < SZK_MESTER.length; i++) if (SZK_MESTER[i].id === id) return SZK_MESTER[i]; return null; }

/* egy kézzel írt feladat (Mesterpróba vagy testvére) → mondatok, dobogó, ellenőrzők */
function szkKezi(M, szulo) {
  var hely = szulo ? szulo.hely : M.hely, szerep = szulo ? szulo.szerep : M.szerep, dobO = M.dob || szulo.dob, ket = !!M.attr;
  var mon = [], i;
  M.mon.forEach(function (m) {
    if (m.ok) m.ok.forEach(function (o) { mon.push({ s: m.s, resz: o[0], ki: o[1], f: o[2] }); });
    else mon.push({ s: m.s, ki: m.ki, f: m.ok1 || null });
  });
  var tokNev = function (nv) { return { id: nv, nev: nv, kep: szkKep(szerep, nv) }; };
  var tokAttr = function (a) { return { id: a, nev: a, kep: SZK_ZOLDSEG[a] ? szkZoldsegKep(a) : szkSportKep(a) }; };
  var D = { keret: dobO.keret, pult: dobO.pult, n: M.nevek.length, cimkek: dobO.cimkek || null, sorok: [], jo: [] };
  var sorNev = dobO.sorNev || (szulo && szulo.dob && szulo.dob.sorNev) || [];
  if (M.csakAttr) {                                            /* fejlécben a gyerekek, egy sor zöldség */
    D.cimkek = M.nevek.map(function (nv) { return '<span class="dob-fejkep">' + szkKep(szerep, nv) + '</span>' + nv; });
    D.sorok.push({ nev: "zöldség", darabok: mKever(M.attr).map(tokAttr) }); D.jo.push(M.joAttr.slice());
  } else {
    D.sorok.push({ nev: sorNev[0] || "", darabok: mKever(M.nevek).map(tokNev) }); D.jo.push(M.jo.slice());
    if (ket) { D.sorok.push({ nev: sorNev[1] || "", darabok: mKever(M.attr).map(tokAttr) }); D.jo.push(M.joAttr.slice()); }
  }
  /* csak-attr feladatnál a „hol” / „attr” a fejléc-sorrendre értendő: a ellenőrző saját nézetet kap */
  var nezet = M.csakAttr ? function (A) {
    var H = [M.nevek.slice(), A.s[0]];
    return { s: H, hol: function (id) { return M.nevek.indexOf(id); }, attr: function (id) { var j = M.nevek.indexOf(id); return j >= 0 ? H[1][j] : null; },
             kie: function (a) { var j = H[1].indexOf(a); return j >= 0 ? M.nevek[j] : null; } };
  } : function (A) { return A; };
  var tesz = function (L) { return L.map(function (t) { return M.csakAttr ? [0, t[1], t[2]] : t; }); };
  var joKiir = M.csakAttr ? M.nevek.map(function (nv, j) { return nv + ": " + M.joAttr[j]; }).join(" · ")
    : ket ? M.jo.map(function (nv, j) { return nv + " " + (D.cimkek ? D.cimkek[j] : (j + 1) + ".") + " " + M.joAttr[j]; }).join(" · ") : M.jo.join(" – ");
  return { mon: mon, kerdes: M.kerdes, dob: D, nezet: nezet, lep: M.lep.map(function (l) { return { t: l.t, tesz: tesz(l.tesz) }; }), joKiir: joKiir,
    rajz: szkJelenet(hely, szerep, M.nevek), nevek: M.nevek };
}

/* ── a 📌 polc tartalma a szerszám-pályának (szerszam-palya.js SZ_TARTALOM) ── */
var SZK_TART = {
  /* 📖 / 📜 : a pálya i. feladata. A keret-sor pályánként egyszer sorsolódik (J.szk): 4 különböző keret, a Mesekönyv 5.-e ismétel egyet
     (de nem az előzőt), más nevekkel, és a kötött mondat a másik szélről szól. */
  general: function (fok, i) {
    var S = J.szk || (J.szk = { sor: null, veg: {}, nevek: {} });
    if (!S.sor) {
      var k = mKever(SZK_KERET_SOR);
      if (fok === "mese") { var t = mKever(k.slice(0, 3))[0]; k.push(t); }
      S.sor = k;
    }
    var keret = S.sor[i % S.sor.length], veg = S.veg[keret] != null ? 1 - S.veg[keret] : null, n = fok === "mese" ? 3 : 4;
    var hasz = S.nevek[keret] || [], szabad = SZK_KERET[keret].nevek.filter(function (x) { return hasz.indexOf(x) < 0; });   /* ismételt keret: más nevekkel */
    var g = szkGeneral({ keret: keret, n: n, veg: veg, nevek: szabad.length >= n ? szabad : null });
    S.veg[keret] = g.veg; S.nevek[keret] = hasz.concat(g.nevek);
    return szkFeladatGen(g, fok);
  },
  /* 🛗 a nagy feladat kicsinyített testvére, ugyanabban a mese-keretben */
  kicsi: function (nagy, k) {
    if (nagy.mester) {
      var M = szkMester(nagy.fid);
      if (M && M.kicsik[k]) return szkFeladatKezi(M.kicsik[k], "kicsi", M);
      return szkFeladatGen(szkGeneral({ keret: M ? M.kicsiKeret : "verseny", n: 3 }), "kicsi");
    }
    return szkFeladatGen(szkGeneral({ keret: nagy.keret, n: 3, nevek: nagy.nevek }), "kicsi");
  },
  mester: function (id) { var M = szkMester(id); return M ? szkFeladatKezi(M, "mester") : null; },
  mesterLista: function () { return SZK_MESTER.map(function (m) { return m.id; }); }
};
function szkFeladatGen(g, fok) {
  return { forma: "dobogo", fok: fok, keret: g.keret, nevek: g.nevek, fid: "KOTOTT-" + fok + "-" + g.kulcs, kulcs: g.kulcs, tobb: g.K.tobb[g.n - 3],
    vissza: "Ott is van egy mondat, ami csak egyféleképpen lehet. Megtalálod?",
    mon: g.mon.map(function (m) { return { s: m.s, ki: m.ki, f: m.c ? (function (c) { return function (A) { return szkIgaz(c, A.s[0]); }; })(m.c) : null }; }),
    kerdes: g.kerdes, dob: szkDob(g), nezet: function (A) { return A; }, lep: g.lep, joKiir: g.sol.join(" – "),
    rajz: szkJelenet(g.K.hely, g.K.szerep, g.bevL), mitKerdez: "A sorrendet kérdezik. Tedd mindenkit a helyére!" };
}
function szkFeladatKezi(M, fok, szulo) {
  var k = szkKezi(M, szulo);
  return { forma: "dobogo", fok: fok, mester: fok === "mester", fid: M.id || (szulo ? szulo.id + "-kicsi" : ""), keret: (szulo || M).hely, nevek: k.nevek,
    tobb: M.tobb, vissza: M.vissza, indok: M.indok || "", mon: k.mon, kerdes: k.kerdes, dob: k.dob, nezet: k.nezet, lep: k.lep, joKiir: k.joKiir, rajz: k.rajz,
    mitKerdez: M.attr || (szulo && szulo.attr) ? "Azt kérdezik, ki hol van, és kihez mi tartozik. Tedd mindenkit a helyére!" : "A sorrendet kérdezik. Tedd mindenkit a helyére!" };
}

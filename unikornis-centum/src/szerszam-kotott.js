/* ============ 3g) 📌 KOTOTT — „Ott kezdem, ahol csak egyféle lehet” — a szerszám-létra tartalma ============
   Tartalom: Matekos\szerszam-letrak-tartalom.html 3. pont (✅ döntések 2026-10-09; a 🖊️ mondatok lektorra várnak).
   📖 Mesekönyv (5 feladat): bevezető (3 szereplő) → CSALI (tagadás a szabad szélső helyről) → KÖTÖTT mondat → kérdés.
   📜 Varázstekercs (4 feladat): bevezető (4 szereplő) → VISZONYÍTÓ („közvetlenül … előtt”) → csali → kötött mondat a VÉGÉN.
   🔮 Kristálygömb (4 feladat): kétféle dolog — hely + pár (lent: SZK_PAR, szkGeneralPar).
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
    /* rend: a gondolatmenet sorrendje (a hibajelzés ebben keres): kötött → (viszonyító) → csali */
    var kotott = { t: e === 0 ? "elso" : "utolso", x: D, rend: 0 }, csali = { t: f === 0 ? "nemElso" : "nemUtolso", x: C, rend: n === 3 ? 1 : 2 };
    if (n === 3) { sol = e === 0 ? [D, C, A] : [A, C, D]; felt = [csali, kotott]; }
    else { var kozv = { t: "kozv", x: A, y: B, rend: 1 }; sol = e === 0 ? [D, C, A, B] : [A, B, C, D]; felt = [kozv, csali, kotott]; }
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
            ok: [["Bercit két kutya előzte meg", "Berci", function (A) { return A.hol("Berci") === 2; }, 0],
                 ["Szellem és Néró Panka után érkezett", "Panka", function (A) { return A.hol("Szellem") > A.hol("Panka") && A.hol("Néró") > A.hol("Panka"); }, 2],
                 ["Panka nem lett első", "Panka", function (A) { return A.hol("Panka") !== 0; }, 1],
                 ["Néró pedig nem lett utolsó", "Néró", function (A) { return A.hol("Néró") !== 4; }, 3]] }],
    kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
    vissza: "Itt is Berci helye a biztos. Kezdd vele!",
    lep: [{ t: "Bercit két kutya előzte meg: ő a harmadik.", tesz: [[0, 2, "Berci"]] },
          { t: "Panka nem lett első, és két kutya is utána érkezett: ő csak a második lehet.", tesz: [[0, 1, "Panka"]] },
          { t: "Szellem és Néró Panka után jött, ezért az első hely Lunáé.", tesz: [[0, 0, "Luna"]] },
          { t: "Néró nem lett utolsó: ő a negyedik, Szellem pedig az ötödik.", tesz: [[0, 3, "Néró"], [0, 4, "Szellem"]] }],
    kicsik: [
      { nevek: ["Berci", "Luna", "Panka"], jo: ["Luna", "Berci", "Panka"],
        mon: [{ s: "A három kutyámat: Bercit, Lunát és Pankát vacsorázni hívtam." },
              { s: "Bercit egy kutya előzte meg.", ki: "Berci", rend: 0, ok1: function (A) { return A.hol("Berci") === 1; } },
              { s: "Panka nem lett első.", ki: "Panka", rend: 1, ok1: function (A) { return A.hol("Panka") !== 0; } }],
        kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
        lep: [{ t: "Bercit egy kutya előzte meg: ő a második.", tesz: [[0, 1, "Berci"]] }, { t: "Panka nem lett első, tehát ő a harmadik.", tesz: [[0, 2, "Panka"]] }, { t: "Luna maradt: ő az első.", tesz: [[0, 0, "Luna"]] }] },
      { nevek: ["Berci", "Luna", "Néró", "Panka"], jo: ["Luna", "Panka", "Berci", "Néró"],
        mon: [{ s: "A négy kutyámat: Bercit, Lunát, Nérót és Pankát vacsorázni hívtam." },
              { s: "Bercit két kutya előzte meg.", ki: "Berci", rend: 0, ok1: function (A) { return A.hol("Berci") === 2; } },
              { s: "Néró Panka után érkezett.", ki: "Néró", rend: 2, ok1: function (A) { return A.hol("Néró") > A.hol("Panka"); } },
              { s: "Panka nem lett első.", ki: "Panka", rend: 1, ok1: function (A) { return A.hol("Panka") !== 0; } }],
        kerdes: "Milyen sorrendben értek táljaikhoz a kutyák?",
        lep: [{ t: "Bercit két kutya előzte meg: ő a harmadik.", tesz: [[0, 2, "Berci"]] }, { t: "Panka nem lett első, és Néró utána jött: Panka a második.", tesz: [[0, 1, "Panka"]] },
              { t: "Néró Panka után jött: ő a negyedik. Luna az első.", tesz: [[0, 3, "Néró"], [0, 0, "Luna"]] }] }] },

  { id: "kalmar-2013-3-O2-1", cim: "Az agárverseny", forras: "Kalmár 2013 / 3. o. országos 2. nap 1.",
    hely: "verseny", szerep: "kutya", dob: { keret: "dobogo" }, tobb: "öt kutyával", kicsiKeret: "verseny",
    nevek: ["Bodri", "Cézár", "Kormos", "Foltos", "Tappancs"], jo: ["Cézár", "Kormos", "Bodri", "Tappancs", "Foltos"],
    mon: [{ s: "Az agárverseny döntőjében öt kutya állt rajthoz: Bodri, Cézár, Kormos, Foltos és Tappancs." },
          { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál és Bodrinál.",
            ok: [["Kormos nem nyert", "Kormos", function (A) { return A.hol("Kormos") !== 0; }, 0],
                 ["gyorsabb volt Tappancsnál és Bodrinál", "Kormos", function (A) { return A.hol("Kormos") < A.hol("Tappancs") && A.hol("Kormos") < A.hol("Bodri"); }, 0]] },
          { s: "Bodri nem lett utolsó.", ki: "Bodri", rend: 2, ok1: function (A) { return A.hol("Bodri") !== 4; } },
          { s: "Tappancs közvetlenül Foltos előtt ért célba.", ki: "Tappancs", rend: 1, ok1: function (A) { return A.hol("Tappancs") === A.hol("Foltos") - 1; } }],
    kerdes: "Milyen sorrendben érkeztek be a kutyák a célba, ha nem volt holtverseny? Válaszodat indokold!",
    indok: "Tappancs, Bodri és Foltos is Kormos mögött van, Kormos pedig nem nyert: így Kormos lett a második, és csak Cézár nyerhetett. Tappancs és Foltos egymás után jött, Bodri pedig nem lett utolsó, ezért Bodri a harmadik, Tappancs a negyedik, Foltos az ötödik.",
    vissza: "Most is Kormosról tudunk a legtöbbet.",
    lep: [{ t: "Kormos mögött ott van Tappancs és Bodri, és Foltos is, mert ő Tappancs után jön. Kormos nem nyert. Így Kormos a második.", tesz: [[0, 1, "Kormos"]] },
          { t: "Kormos előtt csak egy kutya lehet, és az nem Tappancs, Bodri vagy Foltos: Cézár nyert.", tesz: [[0, 0, "Cézár"]] },
          { t: "Tappancs és Foltos egymás után jön, Bodri pedig nem utolsó: Bodri a harmadik.", tesz: [[0, 2, "Bodri"]] },
          { t: "Tappancs a negyedik, közvetlenül utána Foltos az ötödik.", tesz: [[0, 3, "Tappancs"], [0, 4, "Foltos"]] }],
    kicsik: [
      { nevek: ["Bodri", "Kormos", "Tappancs"], jo: ["Bodri", "Kormos", "Tappancs"],
        mon: [{ s: "Az agárverseny döntőjében három kutya állt rajthoz: Bodri, Kormos és Tappancs." },
              { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál.", ki: "Kormos", rend: 0, ok1: function (A) { return A.hol("Kormos") !== 0 && A.hol("Kormos") < A.hol("Tappancs"); } }],
        kerdes: "Milyen sorrendben érkeztek be a kutyák a célba?",
        lep: [{ t: "Kormos nem nyert, de Tappancs mögötte van: Kormos a második, Tappancs a harmadik.", tesz: [[0, 1, "Kormos"], [0, 2, "Tappancs"]] }, { t: "Bodri maradt: ő nyert.", tesz: [[0, 0, "Bodri"]] }] },
      { nevek: ["Bodri", "Kormos", "Foltos", "Tappancs"], jo: ["Bodri", "Kormos", "Tappancs", "Foltos"],
        mon: [{ s: "Az agárverseny döntőjében négy kutya állt rajthoz: Bodri, Kormos, Foltos és Tappancs." },
              { s: "Kormos nem nyert, de gyorsabb volt Tappancsnál.", ki: "Kormos", rend: 0, ok1: function (A) { return A.hol("Kormos") !== 0 && A.hol("Kormos") < A.hol("Tappancs"); } },
              { s: "Bodri nem lett utolsó.", ki: "Bodri", rend: 2, ok1: function (A) { return A.hol("Bodri") !== 3; } },
              { s: "Tappancs közvetlenül Foltos előtt ért célba.", ki: "Tappancs", rend: 1, ok1: function (A) { return A.hol("Tappancs") === A.hol("Foltos") - 1; } }],
        kerdes: "Milyen sorrendben érkeztek be a kutyák a célba?",
        lep: [{ t: "Tappancs és Foltos is Kormos mögött van, Kormos pedig nem nyert: így Kormos a második.", tesz: [[0, 1, "Kormos"]] }, { t: "Kormos előtt csak Bodri lehet: Bodri nyert.", tesz: [[0, 0, "Bodri"]] },
              { t: "Tappancs közvetlenül Foltos előtt: Tappancs a harmadik, Foltos a negyedik.", tesz: [[0, 2, "Tappancs"], [0, 3, "Foltos"]] }] }] },

  { id: "kalmar-2023-3-M-5", cim: "Szendvics a túrán", forras: "Kalmár 2023 / 3. o. megyei 5.",
    hely: "tura", szerep: "gyerek", tobb: "négy gyerekkel", kicsiKeret: "fagyi", ket: true,
    dob: { keret: "tabla", cimkek: ["134 cm", "144 cm", "146 cm", "156 cm"], sorNev: ["gyerek", "zöldség"] },
    nevek: ["Anna", "Berci", "Cili", "Dani"], attr: ["paprika", "retek", "uborka", "zöldhagyma"],
    jo: ["Dani", "Cili", "Anna", "Berci"], joAttr: ["retek", "paprika", "zöldhagyma", "uborka"],
    mon: [{ s: "Anna, Berci, Cili és Dani túrázni indultak, az útra mindenki szendvicset készített magának." },
          { s: "Mindegyikük egyféle zöldséget evett a szendvicséhez a paprika, retek, uborka és zöldhagyma közül, és nem volt két gyerek, aki ugyanolyan zöldséget evett volna." },
          { s: "A gyerekek magassága 134 cm, 144 cm, 146 cm és 156 cm." },
          { s: "Tudjuk, hogy Berci uborkát eszik a szendvicséhez.", ki: "Berci", rend: 2, ok1: function (A) { return A.attr("Berci") === "uborka"; } },
          { s: "Aki paprikát eszik, az 10 centiméterrel magasabb Daninál.", rend: 1, ok1: function (A) { var H = [134, 144, 146, 156], k = A.kie("paprika"); return k != null && H[A.hol(k)] === H[A.hol("Dani")] + 10; } },
          { s: "Dani nem szereti a zöldhagymát.", ki: "Dani", rend: 3, ok1: function (A) { return A.attr("Dani") !== "zöldhagyma"; } },
          { s: "Anna 146 cm magas.", ki: "Anna", rend: 0, ok1: function (A) { return A.hol("Anna") === 2; } }],
    kerdes: "Írd be a táblázatba, ki melyik zöldséget ette a szendvicséhez, és milyen magas?",
    vissza: "Most is kezdd azzal, amit biztosan tudsz: Anna magasságával.",
    lep: [{ t: "Anna 146 cm magas: őt tesszük a 146 centis oszlopba.", tesz: [[0, 2, "Anna"]] },
          { t: "A paprikás gyerek 10 centivel magasabb Daninál. Csak a 134 és a 144 között van ennyi, ezért Dani 134 cm, a paprikás gyerek pedig 144 cm magas.", tesz: [[0, 0, "Dani"], [1, 1, "paprika"]] },
          { t: "Berci uborkát eszik, így nem ő a paprikás: Berci a legmagasabb, Cili eszi a paprikát.", tesz: [[0, 3, "Berci"], [0, 1, "Cili"], [1, 3, "uborka"]] },
          { t: "Dani nem eszik zöldhagymát, ezért ő a retket eszi, Annának marad a zöldhagyma.", tesz: [[1, 0, "retek"], [1, 2, "zöldhagyma"]] }],
    kicsik: [
      { nevek: ["Anna", "Berci", "Dani"], attr: ["paprika", "retek", "uborka"], csakAttr: true,
        dob: { keret: "tabla", fejNevek: true }, jo: ["Anna", "Berci", "Dani"], joAttr: ["paprika", "uborka", "retek"],
        mon: [{ s: "Anna, Berci és Dani túrázni indultak." },
              { s: "Mindegyikük más zöldséget evett a szendvicséhez: paprikát, retket vagy uborkát." },
              { s: "Berci uborkát eszik.", ki: "Berci", rend: 0, ok1: function (A) { return A.attr("Berci") === "uborka"; } },
              { s: "Dani nem szereti a paprikát.", ki: "Dani", rend: 1, ok1: function (A) { return A.attr("Dani") !== "paprika"; } }],
        kerdes: "Ki melyik zöldséget ette?",
        lep: [{ t: "Berci uborkát eszik.", tesz: [[1, 1, "uborka"]] }, { t: "Dani nem szereti a paprikát, ezért ő a retket eszi.", tesz: [[1, 2, "retek"]] }, { t: "Annának marad a paprika.", tesz: [[1, 0, "paprika"]] }] },
      { nevek: ["Anna", "Berci", "Dani"], attr: ["paprika", "retek", "uborka"],
        dob: { keret: "tabla", cimkek: ["130 cm", "135 cm", "140 cm"] }, jo: ["Berci", "Dani", "Anna"], joAttr: ["uborka", "retek", "paprika"],
        mon: [{ s: "Anna, Berci és Dani túrázni indultak." },
              { s: "Mindegyikük más zöldséget evett a szendvicséhez: paprikát, retket vagy uborkát." },
              { s: "A gyerekek magassága 130 cm, 135 cm és 140 cm." },
              { s: "Berci uborkát eszik.", ki: "Berci", rend: 1, ok1: function (A) { return A.attr("Berci") === "uborka"; } },
              { s: "Aki paprikát eszik, az 5 centiméterrel magasabb Daninál.", rend: 2, ok1: function (A) { var k = A.kie("paprika"); return k != null && A.hol(k) === A.hol("Dani") + 1; } },
              { s: "Anna 140 cm magas.", ki: "Anna", rend: 0, ok1: function (A) { return A.hol("Anna") === 2; } }],
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
          { s: "A kosárlabdázó, az úszó és Csaba, mindhárman András alatt laknak.", ki: "András", rend: 0,
            ok1: function (A) { var a = A.hol("András"), k = A.kie("kosárlabda"), u = A.kie("úszás"); return k !== "Csaba" && u !== "Csaba" && A.hol(k) < a && A.hol(u) < a && A.hol("Csaba") < a; } },
          { s: "Az úszónak egy emeletet kell felmenni az otthonából, ha meg akarja látogatni Dávidot, és egy emeletet le, ha a tollaslabdázót szeretné felkeresni.",
            ok: [["egy emeletet kell felmenni az otthonából, ha meg akarja látogatni Dávidot", "Dávid", function (A) { var u = A.kie("úszás"); return A.hol("Dávid") === A.hol(u) + 1; }, 1],
                 ["egy emeletet le, ha a tollaslabdázót szeretné felkeresni", null, function (A) { var u = A.kie("úszás"), t = A.kie("tollaslabda"); return A.hol(t) === A.hol(u) - 1; }, 1]] }],
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
              { s: "Gábor és Csaba is András alatt lakik.", ki: "András", rend: 0, ok1: function (A) { return A.hol("András") === 2; } },
              { s: "Csaba nem a legalsó emeleten lakik.", ki: "Csaba", rend: 1, ok1: function (A) { return A.hol("Csaba") !== 0; } }],
        kerdes: "Ki hányadik emeleten lakik?",
        lep: [{ t: "Gábor és Csaba is András alatt lakik: András lakik legfelül.", tesz: [[0, 2, "András"]] }, { t: "Csaba nem a legalsó emeleten lakik: ő a második emeleten van.", tesz: [[0, 1, "Csaba"]] }, { t: "Gábor maradt: ő lakik a legalsó emeleten.", tesz: [[0, 0, "Gábor"]] }] },
      { nevek: ["András", "Gábor", "Csaba"], attr: ["úszás", "kosárlabda", "kajak"], dob: { keret: "haz2" },
        jo: ["Gábor", "Csaba", "András"], joAttr: ["úszás", "kosárlabda", "kajak"],
        mon: [{ s: "Három barát, András, Gábor és Csaba egy háromemeletes ház három különböző emeletén lakik." },
              { s: "Egyikük úszik, másik kosárlabdázik, harmadik kajakozik." },
              { s: "Az úszó és Csaba is András alatt lakik.", ki: "András", rend: 0, ok1: function (A) { var u = A.kie("úszás"); return u !== "Csaba" && A.hol("András") === 2; } },
              { s: "Az úszónak egy emeletet kell felmenni, ha meg akarja látogatni Csabát.", rend: 2, ok1: function (A) { var u = A.kie("úszás"); return A.hol("Csaba") === A.hol(u) + 1; } },
              { s: "Csaba kosárlabdázik.", ki: "Csaba", rend: 1, ok1: function (A) { return A.attr("Csaba") === "kosárlabda"; } }],
        kerdes: "Ki mit sportol, és hányadik emeleten lakik?",
        lep: [{ t: "Az úszó és Csaba is András alatt lakik: András legfelül lakik.", tesz: [[0, 2, "András"]] }, { t: "Csaba kosárlabdázik, így Gábor az úszó, és Andrásnak marad a kajak.", tesz: [[1, 2, "kajak"]] },
              { t: "Gábor egy emelettel Csaba alatt lakik: Gábor a legalsó, Csaba a második emeleten.", tesz: [[0, 0, "Gábor"], [1, 0, "úszás"], [0, 1, "Csaba"], [1, 1, "kosárlabda"]] }] }] }
];
function szkMester(id) { for (var i = 0; i < SZK_MESTER.length; i++) if (SZK_MESTER[i].id === id) return SZK_MESTER[i]; return null; }

/* egy kézzel írt feladat (Mesterpróba vagy testvére) → mondatok, dobogó, ellenőrzők */
function szkKezi(M, szulo) {
  var szerep = szulo ? szulo.szerep : M.szerep, dobO = M.dob || szulo.dob, ket = !!M.attr;
  var mon = [], i;
  M.mon.forEach(function (m) {
    if (m.ok) m.ok.forEach(function (o) { mon.push({ s: m.s, resz: o[0], ki: o[1], f: o[2], rend: o[3] }); });
    else mon.push({ s: m.s, ki: m.ki, f: m.ok1 || null, rend: m.rend });
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
  return { mon: mon, kerdes: M.kerdes, dob: D, nezet: nezet, lep: M.lep.map(function (l) { return { t: l.t, tesz: tesz(l.tesz) }; }), joKiir: joKiir, nevek: M.nevek };
}

/* ══ 🔮 KRISTÁLYGÖMB — kétféle dolog: hely + pár (Matekos\szerszam-letrak-uj-allomas.html ✅ 2026-10-10) ══
   Élő megfigyelés: a Mesterpróba kétsoros feladatai (szendvics, emeletek) új tudást kértek, amit a 📖/📜 nem gyakoroltatott.
   A pálya 4 feladata (tip) ebben a sorrendben:
     1  csak a pár — 3 szereplő, a hely nem kérdés (fejlécben a szereplők, egy sor pár): csali „nem” + kötött „van”
     2  mindkét sor, külön mondatokkal — 3 szereplő: a hely a Mesekönyv szerkezete, mellé egy „van” és egy „nem”
     3  összekötő mondat: „Aki …, az [a szélső helyen]” — itt ér össze először a két sor
     4  a Mesterpróba kis mása — 4 szereplő: közvetlenül-mondat + összekötő „közvetlenül … előtt”, a kötött mondat a VÉGÉN
   A második sor keretenként (emoji): t = a mondatba illő alak (tárgyeset / ige). Ugyanaz a szabály, mint fent: a gép minden
   (hely × pár) elrendezést végigpróbál (szkParDb), és csak az egy megoldásos feladat kerülhet a gyerek elé. */
var SZK_PAR = {
  verseny: { sorNev: ["kutya", "nyakörv"], L: [["piros", "🔴"], ["kék", "🔵"], ["zöld", "🟢"], ["sárga", "🟡"]],
    bev: function (T) { return "Mindegyiknek más színű a nyakörve: " + szkVagy(T) + "."; },
    van: "{X} nyakörve {t}.", nincs: "{X} nyakörve nem {t}.", aki: "A {t} nyakörvű kutya", mi: "{n} nyakörv",
    bev1: "{L} versenyre készül.", kerdes1: "Kinek milyen színű a nyakörve?", kerdes2: "Milyen sorrendben értek célba, és kinek milyen színű a nyakörve?" },
  fagyi: { sorNev: ["gyerek", "fagyi"], L: [["csoki", "🍫", "csokit"], ["eper", "🍓", "epret"], ["vanília", "🍦", "vaníliát"], ["citrom", "🍋", "citromot"]],
    bev: function (T) { return "Mindenki más ízt kér: " + szkVagy(T) + "."; },
    van: "{X} {t} kér.", nincs: "{X} nem kér {t}.", aki: "Aki {t} kér, az", mi: "{n}",
    bev1: "{L} fagyit vesz.", kerdes1: "Ki milyen fagyit kér?", kerdes2: "Ki hányadik a sorban, és milyen fagyit kér?" },
  polc: { sorNev: ["plüss", "kezében"], L: [["lufi", "🎈", "lufit"], ["csillag", "⭐", "csillagot"], ["virág", "🌸", "virágot"], ["masni", "🎀", "masnit"]],
    bev: function (T) { return "Mindegyik mást tart a kezében: " + szkVagy(T) + "."; },
    van: "{X} {t} tart a kezében.", nincs: "{X} nem tart {t}.", aki: "Aki {t} tart, az", mi: "{n}",
    bev1: "{L} a polcon ül.", kerdes1: "Ki mit tart a kezében?", kerdes2: "Ki melyik polcon ül, és mit tart a kezében?" },
  haz: { sorNev: ["barát", "sport"], L: [["úszás", "🏊", "úszik"], ["kosárlabda", "🏀", "kosárlabdázik"], ["kajak", "🛶", "kajakozik"], ["tollaslabda", "🏸", "tollaslabdázik"]],
    bev: function (T) { var o = ["Egyikük", "a másik", "a harmadik", "a negyedik"]; return T.map(function (t, i) { return o[i] + " " + t; }).join(", ") + "."; },
    van: "{X} {t}.", nincs: "{X} nem {t}.", aki: "Aki {t}, az", mi: "{n}",
    bev1: "{L} egy házban lakik.", kerdes1: "Ki mit sportol?", kerdes2: "Ki hányadik emeleten lakik, és mit sportol?" }
};
function szkVagy(L) { return L.length < 2 ? L.join("") : L.slice(0, -1).join(", ") + " vagy " + L[L.length - 1]; }
function szkNevelo(s) { return (/^[aáeéiíoóöőuúüű]/i.test(s) ? "az " : "a ") + s; }
function szkParElem(a) { return { n: a[0], e: a[1], t: a[2] || a[0] }; }
function szkParTok(a) { return { id: a.n, nev: a.n, kep: '<span class="szk-emo">' + a.e + '</span>' }; }
/* egy mondat igaz-e: ord = nevek hely szerint, at = párok (n) hely szerint.
   van / nincs: x párja a · összekötő (l: true): az a-t viselő helyére ugyanaz a hely-szabály, mint a nevekre */
function szkIgaz2(c, ord, at) {
  if (c.t === "van") return at[ord.indexOf(c.x)] === c.a;
  if (c.t === "nincs") return at[ord.indexOf(c.x)] !== c.a;
  if (c.l) { var i = at.indexOf(c.a); return i >= 0 && szkIgaz({ t: c.t, x: ord[i], y: c.y }, ord); }
  return szkIgaz(c, ord);
}
function szkParDb(nevek, parok, felt, csakPar) {
  var O = csakPar ? [nevek] : szkPermek(nevek), A = szkPermek(parok), db = 0;
  O.forEach(function (o) { A.forEach(function (a) { if (felt.every(function (c) { return szkIgaz2(c, o, a); })) db++; }); });
  return db;
}
/* o = { keret, tip: 1–4, nevek?: [] (a lift: a nagy feladat szereplői), veg?: 0|1 } */
function szkGeneralPar(o) {
  var K = SZK_KERET[o.keret], P = SZK_PAR[o.keret], tip = o.tip, n = tip === 4 ? 4 : 3;
  var sv = function (s, x, a) { return s.replace("{X}", x).replace("{t}", a.t); };
  var mi = function (a) { return szkNevelo(P.mi.replace("{n}", a.n)); };
  var aki = function (t, a, y) { return K[t].replace("{X}", P.aki.replace("{t}", a.t)).replace("{Y}", y || ""); };
  for (var proba = 0; proba < 80; proba++) {
    var at = mKever(P.L).slice(0, n).map(szkParElem), ord, mon = [], felt = [], lep = [], g = null, r = tip === 1 ? 0 : 1, e = 0;
    var vegso = function (ki, i, a) { lep.push({ t: "Már csak " + ki + " és " + mi(a) + " maradt: ők összetartoznak.", tesz: [[r, i, a.n]] }); };
    var nincsLep = function (c, i) { lep.push({ t: sv(P.nincs, c.x, c.at) + " Neki csak " + mi(at[i]) + " maradhat.", tesz: [[r, i, at[i].n]] }); };
    if (tip === 1) {
      ord = mKever(o.nevek && o.nevek.length >= n ? o.nevek : K.nevek).slice(0, n);
      var ix = veletlen(0, n - 1), iy = (ix + veletlen(1, n - 1)) % n, iz = 3 - ix - iy;
      var cv = { t: "van", x: ord[ix], a: at[ix].n, rend: 0 }, cn = { t: "nincs", x: ord[iy], a: at[iz].n, at: at[iz], rend: 1 };
      felt = [cn, cv];
      mon.push({ s: P.bev1.replace("{L}", szkLista(ord)) }, { s: P.bev(mKever(at).map(function (a) { return a.t; })) });
      mon.push({ s: sv(P.nincs, cn.x, at[iz]), c: cn, ki: cn.x }, { s: sv(P.van, cv.x, at[ix]), c: cv, ki: cv.x });
      lep.push({ t: sv(P.van, cv.x, at[ix]) + " Ezt már biztosan tudjuk.", tesz: [[0, ix, at[ix].n]] });
      nincsLep(cn, iy); vegso(ord[iz], iz, at[iz]);
    } else {
      g = szkGeneral({ keret: o.keret, n: n, veg: o.veg, nevek: o.nevek });
      if (!g) continue;
      ord = g.sol; e = g.veg ? n - 1 : 0;
      var hely = g.mon.slice(1), kot = hely.pop();                /* szkGeneral: bevezető · (közvetlenül) · csali · kötött */
      felt = hely.map(function (m) { return m.c; }).concat([kot.c]);
      lep = g.lep.slice();
      var maradt = [], i;
      for (i = 0; i < n; i++) maradt.push(i);
      var vesz = function (j) { maradt.splice(maradt.indexOf(j), 1); return j; };
      var parMon = [];
      if (tip === 2) {
        var ip = vesz(maradt[veletlen(0, 2)]), cv2 = { t: "van", x: ord[ip], a: at[ip].n, rend: 2 };
        parMon.push({ s: sv(P.van, ord[ip], at[ip]), c: cv2, ki: ord[ip] }); felt.push(cv2);
        lep.push({ t: sv(P.van, ord[ip], at[ip]) + " Ezt rögtön a helyére tehetjük.", tesz: [[1, ip, at[ip].n]] });
      } else {
        var f = tip === 3 ? n - 1 - e : veletlen(0, n - 2), y = tip === 4 ? ord[f + 1] : "";
        vesz(f);
        var cl = { t: tip === 3 ? (f === 0 ? "elso" : "utolso") : "kozv", l: true, a: at[f].n, y: y, rend: tip === 3 ? 2 : 3 };
        var sl = aki(cl.t, at[f], y);
        parMon.push({ s: sl, c: cl }); felt.push(cl);
        lep.push({ t: sl + (tip === 3 ? " Ott " + ord[f] + " van," : " Ez " + ord[f] + ",") + " tehát övé " + mi(at[f]) + ".", tesz: [[1, f, at[f].n]] });
        if (tip === 4) {
          var iz4 = vesz(maradt[veletlen(0, 2)]), cv4 = { t: "van", x: ord[iz4], a: at[iz4].n, rend: 4 };
          parMon.push({ s: sv(P.van, ord[iz4], at[iz4]), c: cv4, ki: ord[iz4] }); felt.push(cv4);
          lep.push({ t: sv(P.van, ord[iz4], at[iz4]) + " Ezt rögtön a helyére tehetjük.", tesz: [[1, iz4, at[iz4].n]] });
        }
      }
      var iq = vesz(maradt[veletlen(0, 1)]), ir = maradt[0];
      var cn2 = { t: "nincs", x: ord[iq], a: at[ir].n, at: at[ir], rend: tip === 4 ? 5 : 3 };
      parMon.push({ s: sv(P.nincs, ord[iq], at[ir]), c: cn2, ki: ord[iq] }); felt.push(cn2);
      nincsLep(cn2, iq); vegso(ord[ir], ir, at[ir]);
      mon.push(g.mon[0], { s: P.bev(mKever(at).map(function (a) { return a.t; })) });
      /* sorrend a lapon: 2 — csali, „nem”, kötött, „van” · 3 — csali, kötött, összekötő, „nem” · 4 — (közv.), csali, összekötő, „van”, „nem”, kötött a végén */
      if (tip === 2) mon = mon.concat(hely, [parMon[1], kot, parMon[0]]);
      else if (tip === 3) mon = mon.concat(hely, [kot], parMon);
      else mon = mon.concat(hely, parMon, [kot]);
    }
    var atN = at.map(function (a) { return a.n; });
    if (szkParDb(ord, atN, felt, tip === 1) !== 1 || !felt.every(function (c) { return szkIgaz2(c, ord, atN); })) continue;
    return { keret: o.keret, K: K, P: P, tip: tip, n: n, nevek: ord, at: at, sol: ord, mon: mon, lep: lep, veg: g ? g.veg : 0,
      bevL: g ? g.bevL : ord, kerdes: tip === 1 ? P.kerdes1 : P.kerdes2, kulcs: o.keret + ":" + tip + ":" + ord.join(",") + "/" + atN.join(",") };
  }
  return null;
}
function szkFeladatPar(g, fok) {
  var K = g.K, P = g.P, atN = g.at.map(function (a) { return a.n; }), csak = g.tip === 1;
  var tokNev = function (nv) { return { id: nv, nev: nv, kep: szkKep(K.szerep, nv) }; };
  var D = { keret: csak ? "tabla" : K.dob === "haz" ? "haz2" : K.dob, pult: K.pult, n: g.n, cimkek: null, sorok: [], jo: [] };
  if (csak) {                                                  /* fejlécben a szereplők, alattuk egy sor pár */
    D.cimkek = g.nevek.map(function (nv) { return '<span class="dob-fejkep">' + szkKep(K.szerep, nv) + '</span>' + nv; });
    D.sorok.push({ nev: P.sorNev[1], darabok: mKever(g.at).map(szkParTok) }); D.jo.push(atN.slice());
  } else {
    D.sorok.push({ nev: P.sorNev[0], darabok: mKever(g.bevL).map(tokNev) }, { nev: P.sorNev[1], darabok: mKever(g.at).map(szkParTok) });
    D.jo.push(g.sol.slice(), atN.slice());
  }
  var ell = function (c) { return csak ? function (A) { return szkIgaz2(c, g.nevek, A.s[0]); } : function (A) { return szkIgaz2(c, A.s[0], A.s[1]); }; };
  return { forma: "dobogo", fok: fok, par: true, tip: g.tip, keret: g.keret, nevek: g.nevek, fid: "KOTOTT-" + fok + "-" + g.kulcs, kulcs: g.kulcs,
    tobb: csak ? "" : g.n === 4 ? K.tobb[1] + ", és a helyükkel együtt" : "a helyükkel együtt",
    vissza: "Ott is van egy mondat, ami csak egyféleképpen lehet. Megtalálod?",
    mon: g.mon.map(function (m) { return { s: m.s, ki: m.ki, rend: m.c ? m.c.rend : null, f: m.c ? ell(m.c) : null }; }),
    kerdes: g.kerdes, dob: D, nezet: function (A) { return A; }, lep: g.lep,
    joKiir: csak ? g.nevek.map(function (nv, j) { return nv + ": " + atN[j]; }).join(" · ") : g.sol.map(function (nv, j) { return nv + " (" + atN[j] + ")"; }).join(" – "),
    mitKerdez: csak ? "Azt kérdezik, kihez mi tartozik. Tedd mindenki alá a párját!" : "Két dolgot kérdeznek: ki hol van, és kihez mi tartozik. Tedd mindenkit a helyére, és mindenki mellé a párját!" };
}

/* ── a 📌 polc tartalma a szerszám-pályának (szerszam-palya.js SZ_TARTALOM) ── */
var SZK_TART = {
  /* 📖 / 📜 / 🔮 : a pálya i. feladata. A keret-sor pályánként egyszer sorsolódik (J.szk): 4 különböző keret, a Mesekönyv 5.-e ismétel egyet
     (de nem az előzőt), más nevekkel, és a kötött mondat a másik szélről szól. */
  general: function (fok, i) {
    var S = J.szk || (J.szk = { sor: null, veg: {}, nevek: {} });
    if (!S.sor) {
      var k = mKever(SZK_KERET_SOR);
      if (fok === "mese") { var t = mKever(k.slice(0, 3))[0]; k.push(t); }
      S.sor = k;
    }
    var keret = S.sor[i % S.sor.length], veg = S.veg[keret] != null ? 1 - S.veg[keret] : null, n = fok === "mese" ? 3 : 4;
    var tip = fok === "gomb" ? Math.min(i, 3) + 1 : 0;           /* 🔮 Kristálygömb: a pálya i. feladata az i+1. fajta (szkGeneralPar) */
    if (tip) n = tip === 4 ? 4 : 3;
    var hasz = S.nevek[keret] || [], szabad = SZK_KERET[keret].nevek.filter(function (x) { return hasz.indexOf(x) < 0; });   /* ismételt keret: más nevekkel */
    if (tip) {
      var gp = szkGeneralPar({ keret: keret, tip: tip, veg: veg, nevek: szabad.length >= n ? szabad : null });
      S.veg[keret] = gp.veg; S.nevek[keret] = hasz.concat(gp.nevek);
      return szkFeladatPar(gp, fok);
    }
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
    if (nagy.par) return szkFeladatPar(szkGeneralPar({ keret: nagy.keret, tip: 1, nevek: nagy.nevek }), "kicsi");   /* 🔮: kicsiben = csak a pár */
    return szkFeladatGen(szkGeneral({ keret: nagy.keret, n: 3, nevek: nagy.nevek }), "kicsi");
  },
  mester: function (id) { var M = szkMester(id); return M ? szkFeladatKezi(M, "mester") : null; },
  mesterLista: function () { return SZK_MESTER.map(function (m) { return m.id; }); }
};
function szkFeladatGen(g, fok) {
  return { forma: "dobogo", fok: fok, keret: g.keret, nevek: g.nevek, fid: "KOTOTT-" + fok + "-" + g.kulcs, kulcs: g.kulcs, tobb: g.K.tobb[g.n - 3],
    vissza: "Ott is van egy mondat, ami csak egyféleképpen lehet. Megtalálod?",
    mon: g.mon.map(function (m) { return { s: m.s, ki: m.ki, rend: m.c ? m.c.rend : null, f: m.c ? (function (c) { return function (A) { return szkIgaz(c, A.s[0]); }; })(m.c) : null }; }),
    kerdes: g.kerdes, dob: szkDob(g), nezet: function (A) { return A; }, lep: g.lep, joKiir: g.sol.join(" – "),
    mitKerdez: "A sorrendet kérdezik. Tedd mindenkit a helyére!" };
}
function szkFeladatKezi(M, fok, szulo) {
  var k = szkKezi(M, szulo);
  return { forma: "dobogo", fok: fok, mester: fok === "mester", fid: M.id || (szulo ? szulo.id + "-kicsi" : ""), keret: (szulo || M).hely, nevek: k.nevek,
    tobb: M.tobb, vissza: M.vissza, indok: M.indok || "", mon: k.mon, kerdes: k.kerdes, dob: k.dob, nezet: k.nezet, lep: k.lep, joKiir: k.joKiir,
    mitKerdez: M.attr || (szulo && szulo.attr) ? "Azt kérdezik, ki hol van, és kihez mi tartozik. Tedd mindenkit a helyére!" : "A sorrendet kérdezik. Tedd mindenkit a helyére!" };
}

/* ============ 6j4g) 🔭 JÓSDA — kerekítés és becslés (1. kör: a ház + Tiki + az előszoba, 2026-11-13) ============
   Tervlap: terv/josda-tervlap.html (✅ 2026-11-13, mind a 11 döntés A) · könyv: memória josda-konyv-atnezes.
   A KÖZÖS KÉP a Lámpás-ösvény: egyenes, egyforma lépésekből álló ösvény, a kerek tízeseknél lámpás. A gyerek a csillagkövet
   a közelebbi lámpáshoz viszi (felvesz–letesz) — ez maga a kerekítés. Az előszobában (100-ig) még nincs „kerekítés” szó és ≈ jel,
   és a pont-középen eset (25) nem jön elő.
   ELŐSZOBA („Lámpás-utca”), 4 állomás + Odú-küszöb:
     ① Melyik van közelebb? — a kő két lámpás között; az első feladatoknál (és minden rossz letevés után) előbb lépeget: koppintásonként
        egy lépés a kisebb lámpásig, aztán a nagyobbig; a lépések pöttyként megmaradnak. Rossz letevés: hosszú séta a távolabbi lámpásig,
        közben halványan a rövidebb irány pöttyei (2TC 33., 35–36. f.).
     ② Melyik kettő között? — a szám Tiki cetlijén, a gyerek a követ a jó két lámpás közé teszi, a kő a pontos helyére gördül; később
        művelet a cetlin (86 − 79, 17 + 78, 4 · 6): kiszámolás nélkül dönt, Tiki kiszámolja (2MC 10., 12. f.). Halványítás: a lámpások
        számai → csak 0, 50, 100.
     ③ Hány szem van? — gyöngyszemek a távcsőben, pár mp után bepárásodik (11. döntés); becslés (3 kártya → saját szám), aztán
        ellenőrzés: tízesével fűzi (10 szem = gyűrű), és beírja: „Megszámoltam”. A becslésért se ✨, se hiba (5. döntés A, 0b);
        a végén a két szám köve az ösvényen, köztük az eltérés pöttyei (2MC 3. f., 2TC 12. f.).
     ④ Milyen hosszú? — szalag a letakart cm-vonalzó fölött: becsül → a takaró lehúzódik → leolvassa (2TB, 2MB „Becslés · Mérés”);
        utolsó feladat: „Vágj körülbelül 20 cm-es szalagot!” → lemér, pontosan 20-ra igazítja (2TC 20., 7. f.).
   🔒 Kiskapu: a közelebbi lámpás 50%-os tipp volna → minden rossz letevés után lépegetni kell, és az állomás második hibája után
   a következő két feladat is lépegetős; darab- és mérés-becslés maga nem ad semmit, a feladat a számlálással / méréssel lesz kész.
   GYÁRTÓK (tiszta adat): kerekit(n, hely) · kerekEll(n, hely, v) (a zsib.js becslesEll innen a tízes eset) · jsMuv() · jsSzemek(n).
   TIKI, az idős teknős (3. döntés A): tikiSVG(o) — képregényes (a végtag egy hajlékony vonal, kör nélkül), szemüveg, sál.
   A HÁZ a Piactér falutérképén: jsTerkepHaz(lepes, J) — kerek kőház kupolával és távcsővel, előtte lámpások. */

/* az ösvény sátrai (vasar.js vasarJelenetSVG) — esti kék és lámpásfény */
VS_SZIN.josda1 = { teto: "#ffd98a", csik: "#fff", sotet: "#c08a2a", cimer: "🏮" };
VS_SZIN.josda2 = { teto: "#b9c6ec", csik: "#fff", sotet: "#5f6fa8", cimer: "🏮" };
VS_SZIN.josda3 = { teto: "#c9e7d4", csik: "#fff", sotet: "#5e9a72", cimer: "📿" };
VS_SZIN.josda4 = { teto: "#f6c4d2", csik: "#fff", sotet: "#b5607e", cimer: "📏" };

/* ═════════════════ GYÁRTÓK (tiszta adat) ═════════════════ */
/* a tankönyv szabálya: a közelebbi kerek szám; pont középen felfelé (475 ≈ 480, 450 ≈ 500); kerek szám kerekítve önmaga */
function kerekit(n, hely) { return Math.floor((n + hely / 2) / hely) * hely; }
/* v a gyerek kerekítése. hiba: kerek (kerek számot elmozdított) · otos (középsőt lefelé) · szomszed (a távolabbi szomszéd) · tav */
function kerekEll(n, hely, v) {
  var jo = kerekit(n, hely), also = Math.floor(n / hely) * hely;
  if (v === jo) return { jo: true };
  if (n % hely === 0) return { jo: false, hiba: "kerek" };
  if (n % hely === hely / 2 && v === also) return { jo: false, hiba: "otos" };
  return { jo: false, hiba: v === also || v === also + hely ? "szomszed" : "tav" };
}
/* ② művelet a cetlin (2MC 12. f.): az eredmény 1–99, nem kerek tízes */
function jsMuv() {
  for (var p = 0; p < 200; p++) {
    var t = veletlen(0, 2), a, b, e, sz, bs;
    if (t === 0) { a = veletlen(21, 99); b = veletlen(11, a - 1); e = a - b; sz = a + " − " + b; bs = szo(a) + " mínusz " + szo(b); }
    else if (t === 1) { a = veletlen(11, 79); b = veletlen(6, 99 - a); e = a + b; sz = a + " + " + b; bs = szo(a) + " meg " + szo(b); }
    else { a = veletlen(2, 9); b = veletlen(3, 10); e = a * b; sz = a + " · " + b; bs = szorSzo(a) + " " + szo(b); }
    if (e >= 1 && e <= 99 && e % 10 !== 0) return { szoveg: sz, ertek: e, beszed: bs, muv: true };
  }
  return { szoveg: "86 − 79", ertek: 7, beszed: "nyolcvanhat mínusz hetvenkilenc", muv: true };
}
/* ③ a gyöngyszemek helye a lencsében (egységkörben, hogy mindkét elrendezésben jó legyen) */
function jsSzemek(n) {
  var l = [], d = .15, p = 0;
  while (l.length < n && p < 6000) {
    p++; if (p % 1500 === 0) d *= .85;
    var a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * .84, u = Math.cos(a) * r, v = Math.sin(a) * r;
    if (l.some(function (s) { return Math.hypot(s.u - u, s.v - v) < d; })) continue;
    l.push({ u: u, v: v, c: veletlen(0, 4) });
  }
  return l;
}
function jsNaplo(k) { return { tipus: "josda", kerdes: k, forma: "j" }; }
function jsBan(n) { return zsBol(n).slice(-3) === "ból" ? "ban" : "ben"; }

/* ═════════════════ FELADAT (GEN.josda) ═════════════════
   cfg.forma: kozel · koze · darab · meres · vegyes (Odú-küszöb: felváltva kozel és koze, segítség nélkül) */
GEN.josda = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, forma = cfg.forma, h = !!cfg.halvany, x;
  if (forma === "vegyes") forma = i % 2 ? "koze" : "kozel";
  if (forma === "kozel") {
    if (!st.sor) st.sor = keverTomb([0, 1, 0, 1, 1, 0]);   /* 🔒 felfelé és lefelé fele-fele: a „mindig felfelé” nem nyer */
    var T = veletlen(1, 8) * 10, e = st.sor[i % st.sor.length] ? veletlen(6, 9) : veletlen(1, 4), n = T + e;
    var lep = !h && (i < (cfg.lepeget || 0) || (st.lepKell > 0 && st.lepKell-- > 0));
    x = { forma: "kozel", n: n, T: T, lep: lep, L: 0, R: 0, irany: lep ? "b" : null, feny: {}, hol: null };
    return jsFeladat(x, kerekit(n, 10), lep ? "Lépegess a kisebb lámpásig! Koppints a villogó karikára!" : "Vidd a követ a közelebbi lámpáshoz!",
      lep ? "Melyik lámpás van közelebb a kőhöz? Előbb lépegess: koppints a lépésekre, egészen a kisebb lámpásig!" : "Melyik lámpás van közelebb a kőhöz? Vidd oda a követ!", jsNaplo("közelebb " + n));
  }
  if (forma === "koze") {
    var muv = h ? i >= 2 : i >= 3, m;
    if (muv) m = jsMuv();
    else { var v = veletlen(1, 99); while (v % 10 === 0) v = veletlen(1, 99); m = { szoveg: String(v), ertek: v, beszed: szo(v), muv: false }; }
    x = { forma: "koze", m: m, jel: !h && (i < 2 || i === 3), hol: null, kesz: false };
    return jsFeladat(x, Math.floor(m.ertek / 10) * 10, "Melyik két lámpás közé esik? Vidd oda a követ!",
      muv ? "Körülbelül hova esik az eredmény? Ne számold ki pontosan! Vidd a követ a két lámpás közé!" : "Melyik két lámpás közé esik a cetli száma? Vidd oda a követ!", jsNaplo("között " + m.szoveg));
  }
  if (forma === "darab") {
    var nd = i === 0 ? veletlen(21, 34) : veletlen(26, 59);
    x = { forma: "darab", n: nd, kartya: i === 0, auto: i > 0, fazis: "nez", szemek: jsSzemek(nd), fuz: 0, becs: null, becsK: null };
    return jsFeladat(x, nd, "Nézd meg jól!", "Nézd meg jól, aztán mondd meg, körülbelül hány szem van!", jsNaplo("darab " + nd));
  }
  /* meres */
  var kesz = cfg.keszits && i === (cfg.darab || 3) - 1;
  if (kesz) {
    var C = veletlenElem([10, 15, 20, 25]);
    x = { forma: "meres", keszits: true, C: C, fazis: "vag", vag: null };
    return jsFeladat(x, C, "Vágj körülbelül " + C + " cm-es szalagot! Koppints a vonalzóra!", "Vágj körülbelül " + szo(C) + " centis szalagot! Koppints a vonalzóra, ahol elvágod!", jsNaplo("készíts " + C + " cm"));
  }
  var L = veletlen(6, 28);
  x = { forma: "meres", L: L, minta: i === 0, fazis: "becs", becs: null };
  return jsFeladat(x, L, "Milyen hosszú a szalag? Becsüld meg, és írd a táblára!", (i === 0 ? "A kis szalag tíz centi. " : "") + "Milyen hosszú a nagy szalag? Becsüld meg, és írd a táblára!", jsNaplo("mérés " + L));
};
function jsFeladat(x, helyes, kerdes, felolvas, naplo) {
  return { csalad: "jelenet", jelenet: "josda", js: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(kerdes) + '</span>', szoveg: kerdes, felolvas: felolvas,
    helyes: helyes, keplet: kerdes, tipp: "", naplo: naplo };
}
function jsFelirat(szoveg) { JL.f.szoveg = JL.f.keplet = szoveg; $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(szoveg) + '</span>'; }

/* ═════════════════ ELRENDEZÉS (laptop + 📱 telefon, álló) ═════════════════ */
var JS_KEP = {
  teljes: { vb: "0 0 800 430", W: 800, H: 430, py: 312, uy: 392, um: .28, lh: 92, tiki: [84, 300, .62], tabla: [700, 72, 112, 62],
            koz: [250, 722], sor: [190, 770], koStart: [272, 196], lencse: [470, 138, 112],
            kartya: { x: [698, 698, 698], y: [168, 226, 284], w: 160, h: 46 }, gyuru: [230, 380, 70],
            von: { x0: 172, cm: 19, y: 300, sz: 285, minta: 222, cimke: 1 }, uniM: [88, 404], uniD: [760, 410] },
  keskeny: { vb: "0 0 400 680", W: 400, H: 680, py: 410, uy: 492, um: .22, lh: 70, tiki: [58, 210, .46], tabla: [300, 74, 112, 62],
            koz: [44, 356], sor: [28, 372], koStart: [226, 140], lencse: [222, 252, 104],
            kartya: { x: [70, 200, 330], y: [566, 566, 566], w: 118, h: 56 }, gyuru: [46, 504, 62],
            von: { x0: 34, cm: 11, y: 400, sz: 385, minta: 320, cimke: 5 }, uniM: [352, 650], uniD: [352, 650] }
};
function jsK() { return JS_KEP[JL && JL.keskeny ? "keskeny" : "teljes"]; }
function jsKozX(x, v) { var K = jsK(); return K.koz[0] + (v - x.T) * (K.koz[1] - K.koz[0]) / 10; }   /* ① két lámpás, 10 lépés */
function jsSorX(v) { var K = jsK(); return K.sor[0] + v * (K.sor[1] - K.sor[0]) / 100; }                /* ② ③ 0–100 */
function jsCmX(c) { var V = jsK().von; return V.x0 + c * V.cm; }
function jsKeskenyNez(JL) { var pw = JL.svg && JL.svg.parentNode && JL.svg.parentNode.parentNode.clientWidth; JL.keskeny = !!(pw && pw < 520); }

/* ═════════════════ RAJZ: kis elemek ═════════════════ */
var JS_FR = ' font-family="Fredoka,sans-serif" font-weight="600"';
var JS_SZEM_SZIN = [["#f6a5c0", "#c0567f"], ["#9ec9f0", "#5f84b0"], ["#a7d99a", "#5e9a52"], ["#fce49a", "#c9962a"], ["#c9a8e6", "#7a5ea8"]];
/* lámpás: (x, y) a talpa az ösvényen; eg: "" | "eg" | "lobban"; cimke: a szám a tábláján (null: nincs) */
function jsLampas(x, y, h, eg, cimke, attr) {
  var F = pcF, s = '<g' + (attr || '') + '>';
  if (attr) s += '<rect x="' + F(x - 22) + '" y="' + F(y - h - 30) + '" width="44" height="' + F(h + 44) + '" fill="transparent"/>';
  if (eg) s += '<ellipse cx="' + F(x) + '" cy="' + F(y - h - 8) + '" rx="' + (eg === "lobban" ? 42 : 26) + '" ry="' + (eg === "lobban" ? 40 : 24) + '" fill="url(#lt-gNyHalo)">' + (eg === "lobban" && !lkCsokkent() ? ltAnim("opacity", ".6;1;.6", "1.2s") : '') + '</ellipse>';
  s += '<g filter="url(#lt-firka)"><path d="M' + F(x) + ' ' + F(y + 2) + 'V' + F(y - h) + '" stroke="#6e4a36" stroke-width="3.4" stroke-linecap="round"/>' +
       '<path d="M' + F(x - 6) + ' ' + F(y + 2) + 'H' + F(x + 6) + '" stroke="#6e4a36" stroke-width="3" stroke-linecap="round"/>' +
       '<path d="M' + F(x - 9) + ' ' + F(y - h) + 'H' + F(x + 9) + 'L' + F(x + 7) + ' ' + F(y - h - 17) + 'H' + F(x - 7) + 'Z" fill="' + (eg ? "#fff1a8" : "#efe8dc") + '" stroke="#8a6a52" stroke-width="1.8" stroke-linejoin="round"/>' +
       '<path d="M' + F(x - 11) + ' ' + F(y - h - 17) + 'L' + F(x) + ' ' + F(y - h - 26) + 'L' + F(x + 11) + ' ' + F(y - h - 17) + 'Z" fill="#7a5ea8" stroke="#4a3b7a" stroke-width="1.6" stroke-linejoin="round"/></g>';
  if (eg) s += '<path d="M' + F(x) + ' ' + F(y - h - 4) + 'Q' + F(x - 3) + ' ' + F(y - h - 9) + ' ' + F(x) + ' ' + F(y - h - 13) + 'Q' + F(x + 3) + ' ' + F(y - h - 9) + ' ' + F(x) + ' ' + F(y - h - 4) + 'Z" fill="#f5a54a"/>';
  if (cimke != null) {
    var w = String(cimke).length * 8 + 14;
    s += '<g transform="translate(' + F(x) + ' ' + F(y + 24) + ')"><rect x="' + F(-w / 2) + '" y="-10" width="' + w + '" height="19" rx="6" fill="#fffaf0" stroke="#c9ad85" stroke-width="1.4"/>' +
         '<text y="4.6" text-anchor="middle" font-size="13"' + JS_FR + ' fill="#6e4a36">' + cimke + '</text></g>';
  }
  return s + '</g>';
}
/* ✨ csillagkő: (x, y) a közepe; all: "" | "fenyes" | "halvany" */
function jsKo(x, y, t, m, attr, all) {
  var F = pcF, t2 = String(t), fs = t2.length <= 2 ? 17 : t2.length === 3 ? 14 : 11;
  return '<g' + (attr || '') + ' data-m="' + (m || 1) + '" transform="translate(' + F(x) + ' ' + F(y) + ') scale(' + (m || 1) + ')"' + (all === "halvany" ? ' opacity=".4"' : '') + '><g class="kf-ic">' +
    (all === "fenyes" ? '<ellipse rx="34" ry="30" fill="url(#lt-gNyHalo)"/>' : '') +
    '<rect x="-26" y="-24" width="52" height="46" fill="transparent"/><ellipse cx="0" cy="15" rx="22" ry="5" fill="#3c2a50" opacity=".14"/>' +
    '<path d="M-22 0Q-23 -17 -2 -18Q22 -19 22 -2Q23 15 0 16Q-21 17 -22 0Z" fill="#ffe9a8" stroke="#c9962a" stroke-width="2.2"/>' +
    '<path d="M-12 -10Q-4 -14 6 -13" stroke="#fff" stroke-width="2.4" opacity=".8" fill="none" stroke-linecap="round"/>' +
    '<path d="M15 -15l1.6 3.4l3.4 1.6l-3.4 1.6l-1.6 3.4l-1.6 -3.4l-3.4 -1.6l3.4 -1.6z" fill="#fff" stroke="#e3a92a" stroke-width=".8"/>' +
    '<text y="' + F(fs * .36) + '" text-anchor="middle" font-size="' + fs + '"' + JS_FR + ' fill="#6e4a1a">' + kiiras(t2) + '</text></g></g>';
}
function jsPotty(x, y, all) {
  var F = pcF;
  if (all === "eg") return '<circle cx="' + F(x) + '" cy="' + F(y) + '" r="12" fill="url(#lt-gNyHalo)"/><circle cx="' + F(x) + '" cy="' + F(y) + '" r="6.5" fill="#ffd84d" stroke="#d1a23a" stroke-width="1.4"/>';
  if (all === "halvany") return '<circle cx="' + F(x) + '" cy="' + F(y) + '" r="6" fill="#fff0a8" stroke="#e3c46a" stroke-width="1.2" opacity=".75"/>';
  return '<circle cx="' + F(x) + '" cy="' + F(y) + '" r="5.4" fill="#e6d7b8" stroke="#c9ad85" stroke-width="1.2"/>';
}
function jsUt(x0, x1, y) {
  var F = pcF;
  return '<g filter="url(#lt-firka)"><path d="M' + F(x0 - 18) + ' ' + F(y - 9) + 'Q' + F((x0 + x1) / 2) + ' ' + F(y - 12) + ' ' + F(x1 + 18) + ' ' + F(y - 9) + 'L' + F(x1 + 18) + ' ' + F(y + 10) + 'Q' + F((x0 + x1) / 2) + ' ' + F(y + 13) + ' ' + F(x0 - 18) + ' ' + F(y + 10) + 'Z" fill="#efe0c4" stroke="#c9ad85" stroke-width="2"/></g>';
}
/* a cetli Tiki kezében (②): t = a szám vagy a művelet; ered = Tiki kiszámolta */
function jsCetli(x, y, t, ered) {
  var F = pcF, w = Math.max(70, t.length * 13 + 24), h = ered ? 62 : 40;
  return '<g transform="translate(' + F(x) + ' ' + F(y) + ') rotate(-4)"><g filter="url(#lt-firka)"><rect x="' + F(-w / 2) + '" y="' + F(-h / 2) + '" width="' + w + '" height="' + h + '" rx="5" fill="#fffef4" stroke="#b8a27a" stroke-width="1.8"/></g>' +
    '<path d="M' + F(-w / 2 + 8) + ' ' + F(-h / 2) + 'v-6h12v6" fill="#f6c4d2" stroke="#b5607e" stroke-width="1.2"/>' +
    '<text y="' + (ered ? -6 : 7) + '" text-anchor="middle" font-size="20"' + JS_FR + ' fill="#4a3b7a">' + kiiras(t) + '</text>' +
    (ered ? '<text y="20" text-anchor="middle" font-size="17"' + JS_FR + ' fill="#5e9a52">' + kiiras("= " + ered) + '</text>' : '') + '</g>';
}

/* ═════════════════ 🐢 TIKI, az idős teknős ═════════════════
   a figura egy 200 × 240-es dobozban, talppont: (100, 232). o.poz: var · mutat · cetli · orul. Képregényes: a végtag egy vonal (tkCso). */
var TK_INK = "#2f3a2a", TK_BOR = "#a9cf8f", TK_BORD = "#7fa86a", TK_PANCEL = "#6f9a5a", TK_PANCELD = "#4e7440", TK_HAS = "#f3e2a6", TK_SAL = "#e98a6b";
var TK_KAR = { var: [[66, 122, 70, 148, 88, 156], [134, 122, 130, 148, 112, 156]], mutat: [[66, 122, 70, 148, 88, 156], [134, 120, 160, 104, 174, 78]],
  cetli: [[66, 122, 70, 148, 88, 156], [134, 122, 158, 134, 176, 118]], orul: [[66, 120, 46, 100, 38, 74], [134, 120, 154, 100, 162, 74]] };
function tkCso(p, w, col) {
  var cx = 2 * p[2] - (p[0] + p[4]) / 2, cy = 2 * p[3] - (p[1] + p[5]) / 2, d = "M" + p[0] + " " + p[1] + "Q" + cx + " " + cy + " " + p[4] + " " + p[5];
  return '<path d="' + d + '" fill="none" stroke="' + TK_INK + '" stroke-width="' + (w + 5) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
}
function tikiSVG(o) {
  o = o || {};
  var poz = o.poz || "var", K = TK_KAR[poz] || TK_KAR.var, cs = lkCsokkent(), s = '';
  s += '<ellipse cx="100" cy="236" rx="52" ry="7" fill="#000" opacity=".13"/>';
  /* páncél hátul + a farok */
  s += '<path d="M150 206l16 6l-14 6z" fill="' + TK_BOR + '" stroke="' + TK_INK + '" stroke-width="2.4" stroke-linejoin="round"/>';
  s += '<path d="M36 200C22 146 50 96 100 92C150 96 178 146 164 200C142 220 58 220 36 200Z" fill="' + TK_PANCEL + '" stroke="' + TK_INK + '" stroke-width="3.2" stroke-linejoin="round"/>';
  s += '<path d="M44 150Q50 128 62 116M156 150Q150 128 138 116M40 176Q52 184 60 182M160 176Q148 184 140 182" fill="none" stroke="' + TK_PANCELD + '" stroke-width="2.6" stroke-linecap="round"/>';
  /* lábak */
  [[84, -1], [116, 1]].forEach(function (l) {
    s += tkCso([l[0], 200, l[0] + l[1] * 2, 214, l[0] + l[1] * 3, 226], 16, TK_BOR) +
      '<path d="M' + (l[0] + l[1] * 3 - 15) + ' 234C' + (l[0] + l[1] * 3 - 14) + ' 222 ' + (l[0] + l[1] * 3 + 14) + ' 220 ' + (l[0] + l[1] * 3 + 17) + ' 234Z" fill="' + TK_BOR + '" stroke="' + TK_INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
  });
  /* has-pajzs */
  s += '<path d="M62 114C56 150 64 192 100 206C136 192 144 150 138 114C120 104 80 104 62 114Z" fill="' + TK_HAS + '" stroke="' + TK_INK + '" stroke-width="2.8" stroke-linejoin="round"/>';
  s += '<path d="M66 140Q100 146 134 140M64 166Q100 172 136 166M74 190Q100 196 126 190M100 108V204" fill="none" stroke="#d4bd7a" stroke-width="2" stroke-linecap="round"/>';
  /* karok (a mutató / cetlis kar elöl) */
  s += tkCso(K[0], 13, TK_BOR) + tkCso(K[1], 13, TK_BOR);
  /* nyak + sál */
  s += '<path d="M88 104C88 92 112 92 112 104" fill="' + TK_BOR + '" stroke="' + TK_INK + '" stroke-width="2.6"/>';
  s += '<path d="M70 106Q100 120 130 106Q132 98 128 94Q100 106 72 94Q68 98 70 106Z" fill="' + TK_SAL + '" stroke="' + TK_INK + '" stroke-width="2.4" stroke-linejoin="round"/>';
  s += '<path d="M118 108L124 132L114 130L110 110Z" fill="' + TK_SAL + '" stroke="' + TK_INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M116 128l1 5M120 128l1 5" stroke="' + TK_INK + '" stroke-width="1.4"/>';
  /* fej */
  s += '<g transform="rotate(' + (o.billen || (poz === "mutat" ? 6 : poz === "orul" ? -4 : 0)) + ' 100 92)">';
  s += '<path d="M66 70C64 42 82 32 100 32C118 32 136 42 134 70C132 92 68 92 66 70Z" fill="' + TK_BOR + '" stroke="' + TK_INK + '" stroke-width="3" stroke-linejoin="round"/>';
  s += '<path d="M90 44Q100 41 110 44M92 50Q100 48 108 50" fill="none" stroke="' + TK_BORD + '" stroke-width="2" stroke-linecap="round"/>';
  s += '<path d="M72 74Q76 78 80 77M128 74Q124 78 120 77" fill="none" stroke="' + TK_BORD + '" stroke-width="2" stroke-linecap="round"/>';
  /* szemek a szemüveg mögött */
  if (poz === "orul") s += '<path d="M81 64Q87 58 93 64M107 64Q113 58 119 64" fill="none" stroke="' + TK_INK + '" stroke-width="2.8" stroke-linecap="round"/>';
  else {
    s += '<ellipse cx="87" cy="64" rx="3.6" ry="4.4" fill="' + TK_INK + '"/><ellipse cx="113" cy="64" rx="3.6" ry="4.4" fill="' + TK_INK + '"/><circle cx="88.4" cy="62.4" r="1.3" fill="#fff"/><circle cx="114.4" cy="62.4" r="1.3" fill="#fff"/>';
    if (!cs) s += '<g opacity="0"><path d="M81 64Q87 68 93 64M107 64Q113 68 119 64" fill="' + TK_BOR + '" stroke="' + TK_INK + '" stroke-width="2.6" stroke-linecap="round"/><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.94;.97;1" dur="5.2s" repeatCount="indefinite"/></g>';
  }
  /* szemüveg + bozontos ősz szemöldök */
  s += '<circle cx="87" cy="64" r="11" fill="#eaf6ff" fill-opacity=".35" stroke="#6e4a36" stroke-width="2.8"/><circle cx="113" cy="64" r="11" fill="#eaf6ff" fill-opacity=".35" stroke="#6e4a36" stroke-width="2.8"/>';
  s += '<path d="M98 63Q100 60 102 63M76 62L68 58M124 62L132 58" fill="none" stroke="#6e4a36" stroke-width="2.4" stroke-linecap="round"/>';
  s += '<path d="M76 50Q82 44 92 48M108 48Q118 44 124 50" fill="none" stroke="#f4f1ea" stroke-width="4.4" stroke-linecap="round"/><path d="M76 50Q82 44 92 48M108 48Q118 44 124 50" fill="none" stroke="#9a9488" stroke-width="1.2" stroke-linecap="round"/>';
  s += poz === "orul" || poz === "mutat" ? '<path d="M88 80Q100 90 112 80" fill="none" stroke="' + TK_INK + '" stroke-width="2.6" stroke-linecap="round"/>' : '<path d="M91 81Q100 85 109 81" fill="none" stroke="' + TK_INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  s += '<path d="M97 72l2 2l2 -2" fill="none" stroke="' + TK_BORD + '" stroke-width="1.6" stroke-linecap="round"/>';
  s += '</g>';
  return s;
}
function jsTiki(x, y, k, poz) { return '<g class="js-tiki" transform="translate(' + pcF(x - 100 * k) + ' ' + pcF(y - 232 * k) + ') scale(' + k + ')">' + tikiSVG({ poz: poz }) + '</g>'; }
/* Tiki kezének helye a képen (a cetli ide kerül) */
function jsTikiKez(K) { var t = K.tiki, p = TK_KAR.cetli[1]; return [t[0] + (p[4] - 100) * t[2], t[1] + (p[5] - 232) * t[2]]; }

/* ═════════════════ 🏠 A HÁZ a Piactér falutérképén ═════════════════
   (0, 0) a talpa közepe; ~120 széles, ~150 magas. all: zart (alszik / zárva) · uj (hív) · folyik · kesz; eg: hány lámpás ég (0–3) */
function jsTerkepHaz(lepes, J) {
  var all = J.all === "alszik" || J.all === "zarva" ? "zart" : J.vil ? "uj" : J.all === "kesz" || lepes >= 6 ? "kesz" : "folyik";
  var eg = all === "kesz" ? 3 : all === "folyik" ? Math.max(1, Math.min(3, lepes - 2)) : 0, cs = lkCsokkent(), s = '<g' + (all === "zart" ? ' style="filter:saturate(.55)"' : '') + '>';
  if (all === "uj") s += '<ellipse cx="0" cy="-70" rx="96" ry="88" fill="url(#lt-gNyHalo)">' + (cs ? '' : ltAnim("opacity", ".5;1;.5", "2.4s")) + '</ellipse>';
  s += '<ellipse cx="0" cy="3" rx="66" ry="9" fill="#3c2a50" opacity=".14"/>';
  s += '<g filter="url(#lt-firka)">';
  /* távcső a kupola résében */
  s += '<g transform="translate(4 -116) rotate(-38)"><rect x="-7" y="-58" width="14" height="52" rx="3" fill="#e9c27a" stroke="#8a5a1a" stroke-width="2.4"/><rect x="-9" y="-62" width="18" height="9" rx="2" fill="#c9962a" stroke="#8a5a1a" stroke-width="2"/></g>';
  /* kerek kőház */
  s += '<path d="M-48 0V-72Q0 -82 48 -72V0Q0 9 -48 0Z" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.6"/>';
  s += '<path d="M-48 -38Q0 -46 48 -38M-48 -16Q0 -22 48 -16" fill="none" stroke="#d9c3a6" stroke-width="1.6"/>';
  /* kupola a réssel */
  s += '<path d="M-54 -72Q-54 -134 0 -136Q54 -134 54 -72Q0 -84 -54 -72Z" fill="#b9c6ec" stroke="#5f6fa8" stroke-width="2.6" stroke-linejoin="round"/>';
  s += '<path d="M-34 -78Q-38 -112 -14 -130M34 -78Q38 -112 14 -130" fill="none" stroke="#8d9bd0" stroke-width="1.8"/>';
  s += '<path d="M-7 -133L7 -133L9 -80L-9 -80Z" fill="#4a5486" stroke="#3a4170" stroke-width="1.6"/>';
  s += '<path d="M0 -136V-150" stroke="#8a5a1a" stroke-width="2"/></g>';
  s += '<path d="M0 -158l2.6 5.4l5.4 2.6l-5.4 2.6l-2.6 5.4l-2.6 -5.4l-5.4 -2.6l5.4 -2.6z" fill="#ffe08a" stroke="#d1a23a" stroke-width="1.2"/>';
  /* ajtó + két ablak */
  s += '<g class="pc-ajto" style="transform-origin:-13px 0"><path d="M-13 0V-26Q0 -38 13 -26V0Z" fill="#c99272" stroke="#8a5a3a" stroke-width="2.2"/><circle cx="7" cy="-13" r="2" fill="#8a5a3a"/></g>';
  [-32, 32].forEach(function (wx, i) {
    var ezeg = eg > i;
    s += '<path d="M' + (wx - 7) + ' -42V-54Q' + wx + ' -62 ' + (wx + 7) + ' -54V-42Z" fill="' + (ezeg ? "#ffe9a0" : "#e8e2ef") + '" stroke="#8a6a7e" stroke-width="1.8"/>';
  });
  /* lámpások az ösvény mellett */
  [[-62, 0], [62, 2]].forEach(function (l, i) {
    var x = l[0], ezeg = eg > i + 1 || (i === 0 && eg > 0);
    if (ezeg) s += '<ellipse cx="' + x + '" cy="-34" rx="14" ry="13" fill="url(#lt-gNyHalo)"/>';
    s += '<path d="M' + x + ' 2V-28" stroke="#6e4a36" stroke-width="2.6"/><path d="M' + (x - 6) + ' -28H' + (x + 6) + 'L' + (x + 5) + ' -40H' + (x - 5) + 'Z" fill="' + (ezeg ? "#fff1a8" : "#efe8dc") + '" stroke="#8a6a52" stroke-width="1.4"/>' +
         '<path d="M' + (x - 8) + ' -40L' + x + ' -46L' + (x + 8) + ' -40Z" fill="#7a5ea8" stroke="#4a3b7a" stroke-width="1.2"/>';
  });
  return s + '</g>';
}

/* ═════════════════ A KÉP (JELENETEK.josda) ═════════════════ */
/* 📱 telefonon az ösvényes képek alacsonyabbak (nincs lencse, vonalzó) */
function jsMagas(JL) { var f = JL.f.js.forma; return JL.keskeny && (f === "kozel" || f === "koze") ? 540 : jsK().H; }
function jsHatter(JL) {
  var K = jsK(), W = K.W, H = jsMagas(JL), y = K.py, s = '';
  s += '<rect width="' + W + '" height="' + H + '" fill="url(#lt-gEgA)"/>';
  s += '<path d="M0 ' + (y - 70) + 'Q' + W * .3 + ' ' + (y - 104) + ' ' + W * .55 + ' ' + (y - 80) + 'T' + W + ' ' + (y - 86) + 'V' + H + 'H0Z" fill="#d6cdee" opacity=".7"/>';
  s += '<path d="M0 ' + (y - 30) + 'Q' + W * .5 + ' ' + (y - 48) + ' ' + W + ' ' + (y - 30) + 'V' + H + 'H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>';
  s += ltBokor(W - 30, y - 26, 1.2, "#a8dc9c", "#5f9e6a") + ltKisfa(18, y - 28, 1.3, "#a8dc9c", "#5f9e6a");
  return s;
}
JELENETEK.josda = {
  kep: function (JL) {
    var K = jsK(), x = JL.f.js, T = (x.forma === "darab" && ((x.fazis === "becs" && !x.kartya) || x.fazis === "szamol" || x.fazis === "kesz")) || (x.forma === "meres" && !x.keszits) ? K.tabla : null;   /* a tábla csak akkor, ha ide ír (a kártyáknál, a fűzésnél nincs útban) */
    var u = x.forma === "kozel" ? [jsKozX(x, x.n), K.uy] : x.forma === "darab" || x.forma === "meres" ? K.uniD : K.uniM;
    return { vb: "0 0 " + K.W + " " + jsMagas(JL), tabla: T, uni: [u[0], u[1], K.um, x.forma === "kozel" ? 1 : -1] };
  },
  indit: function (JL) {
    var x = JL.f.js;
    jsKeskenyNez(JL);
    if (x.forma === "kozel") { JL.ux = jsKozX(x, x.n); JL.uy = jsK().uy; return false; }   /* az unikornis a kőnél kezd */
    if (x.forma === "darab" && x.fazis === "nez") { jsNez(JL); return true; }
    JL.ux = null; return false;
  },
  tablaAll: function (JL) {
    var x = JL.f.js;
    if (x.forma === "darab") return (x.fazis === "becs" && !x.kartya) || x.fazis === "szamol" ? "" : "var";
    if (x.forma === "meres") return x.fazis === "becs" || x.fazis === "mer" ? "" : "var";
    return "var";
  },
  tablaVarMondat: function (JL) {
    var x = JL.f.js;
    if (x.forma === "darab") return x.fazis === "nez" ? "Nézd meg jól!" : x.fazis === "fuz" ? "Előbb fűzd fel a szemeket!" : "Koppints a kártyára!";
    return "Koppints a vonalzóra, ahol elvágod!";
  },
  rajz: function (JL) {
    var x = JL.f.js, K = jsK(), s = jsHatter(JL);
    if (x.forma === "kozel") s += jsKozelRajz(JL, x, K);
    else if (x.forma === "koze") s += jsKozeRajz(JL, x, K);
    else if (x.forma === "darab") s += jsDarabRajz(JL, x, K);
    else s += jsMeresRajz(JL, x, K);
    return s;
  },
  fogRajz: function (JL, F) { return kfSajatId('<g transform="translate(0 -6)">' + jsKo(F.x, F.y, F.n, 1.05, '', '') + '</g>', "jl"); },
  felvesz: function (JL, id) {
    var x = JL.f.js;
    if (id !== "ko") return null;
    if (x.forma === "kozel") return x.irany || x.hol != null ? null : x.n;
    if (x.forma === "koze") return x.kesz ? null : x.m.muv ? "?" : x.m.ertek;
    return null;
  },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.js;
    if (!hova) { jlRajz(); return; }
    if (x.forma === "kozel") jsKozelTesz(JL, x, hova);
    else if (x.forma === "koze") jsKozeTesz(JL, x, +hova.slice(1));
  },
  katt: function (JL, t) {
    var x = JL.f.js, e;
    if (x.forma === "kozel" && (e = t.closest(".js-lep"))) { jsLep(JL, x); return; }
    if (x.forma === "darab" && x.fazis === "becs" && x.kartya && (e = t.closest(".js-kartya"))) { hangGomb(); x.becsK = +e.getAttribute("data-k"); jsFuzIndit(JL, x); return; }
    if (x.forma === "darab" && x.fazis === "fuz" && (e = t.closest(".js-szem"))) { jsFuz(JL, x, +e.getAttribute("data-i")); return; }
    if (x.forma === "meres" && x.keszits && (e = t.closest(".js-cm"))) { jsVag(JL, x, +e.getAttribute("data-cm")); return; }
  },
  bekuld: function (JL, v) {
    var x = JL.f.js;
    if (x.forma === "darab") {
      if (x.fazis === "becs") { x.becs = v; jsFuzIndit(JL, x); return; }   /* a becslésért se ✨, se hiba */
      if (v === x.n) { x.fazis = "kesz"; x.tiki = "orul"; hangCsilla(); jlJo("Megszámoltam: " + v, null, jsMutatEltart); return; }
      JL.rossz = String(v); jlRossz(String(v)); jlRajz();
      jlSzol(JL.seg >= 2 ? "Tíz, húsz, harminc… számold a gyűrűket tízesével, aztán a maradék szemeket egyesével!" : "Számold a gyűrűket: mindegyikben tíz szem van!", true);
      jlFokusz(); return;
    }
    if (x.forma === "meres") {
      if (x.fazis === "becs") { x.becs = v; x.fazis = "mer"; x.fedoAnim = true; jsFelirat("Most mérd meg! Hány cm? Írd a táblára!"); jlRajz(); mondd("Most mérd meg! Hány centi?"); jlFokusz(); return; }
      if (v === x.L) { x.fazis = "kesz"; x.tiki = "orul"; hangCsilla(); jlJo(v + " cm", null, jsMutatEltart); return; }
      JL.rossz = String(v); jlRossz(String(v) + " cm"); jlRajz();
      jlSzol(JL.seg >= 2 ? "A szalag a nullánál kezdődik. Nézd meg, melyik számnál van a vége!" : "Nézd meg, hol ér véget a szalag a vonalzón!", true);
      jlFokusz();
    }
  },
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele */
    var x = JL.f.js, sel = [], v;
    if (x.forma === "kozel") {
      if (x.irany === "b") for (v = x.n - x.L - 1; v >= x.T; v--) sel.push('#jl-svg .js-lep[data-v="' + v + '"]');
      if (x.irany) for (v = x.n + x.R + 1; v <= x.T + 10; v++) sel.push('#jl-svg .js-lep[data-v="' + v + '"]');
      sel.push('#jl-svg .jl-fog[data-fog="ko"]', '#jl-svg .jl-hely[data-hely="' + (kerekit(x.n, 10) === x.T ? "b" : "j") + '"]');
      return { katt: sel };
    }
    if (x.forma === "koze") return { katt: ['#jl-svg .jl-fog[data-fog="ko"]', '#jl-svg .jl-hely[data-hely="s' + Math.floor(x.m.ertek / 10) + '"]'] };
    if (x.forma === "darab") {
      if (x.fazis === "becs") return x.kartya ? { katt: ['#jl-svg .js-kartya[data-k="1"]'] } : { gepel: 30 };
      if (x.fazis === "fuz") { for (v = 0; v < (x.auto ? 10 - x.fuz : x.n - x.fuz); v++) sel.push('#jl-svg .js-szem'); return { katt: sel }; }
      return { gepel: x.n };
    }
    if (x.keszits) return { katt: x.fazis === "vag" ? ['#jl-svg .js-cm[data-cm="' + (x.C - 2) + '"]', '#jl-svg .js-cm[data-cm="' + x.C + '"]'] : ['#jl-svg .js-cm[data-cm="' + x.C + '"]'] };
    return { gepel: x.fazis === "becs" ? 12 : x.L };
  }
};
/* séta saját tokennel: az újabb lépés megszakítja a régit (a lépegetésnél gyorsan koppinthat) */
function jsSetal(x, y, kesz, lassu) {
  var f = JL.f, tok = JL.jsTok = {}, x0 = JL.ux, y0 = JL.uy, n = lkCsokkent() || window.__UC_GYORS ? 1 : (lassu || 7), i = 0, ir = JL.svg.querySelector(".pc-uni-irany");
  if (ir && Math.abs(x - x0) > 1) ir.style.setProperty("--dir", x < x0 ? -1 : 1);
  (function lep() {
    if (!JL || JL.f !== f || JL.jsTok !== tok || !JL.svg.isConnected) return;
    i++; jlUniAllit(x0 + (x - x0) * i / n, y0 + (y - y0) * i / n - (i < n ? Math.abs(Math.sin(i * 1.3)) * 4 : 0));
    if (i < n) setTimeout(lep, 55); else if (kesz) kesz();
  })();
}
/* a jó válasz után a kép még egy kicsit mutatja az eredményt (beteljesülés, eltérés), aztán tovább */
function jsMutatEltart(tovabb) { setTimeout(tovabb, lkCsokkent() || window.__UC_GYORS ? 0 : 1900); }

/* ═════════════════ ① MELYIK VAN KÖZELEBB? ═════════════════ */
function jsKozelRajz(JL, x, K) {
  var s = '', y = K.py, v, T = x.T, jo = kerekit(x.n, 10) === T ? "b" : "j";
  s += jsUt(K.koz[0] - 40, K.koz[1] + 40, y);
  s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2] * .9, x.tiki || (x.irany ? "mutat" : "var"));
  for (v = T + 1; v < T + 10; v++) {
    if (v === x.n) continue;
    var eg = (v < x.n && v >= x.n - x.L) || (v > x.n && v <= x.n + x.R) || (x.ut && (x.ut === "b" ? v < x.n : v > x.n));
    var vil = x.villan && (x.villan.hosszu === "b" ? v < x.n : v > x.n), hal = x.villan && !vil;
    s += jsPotty(jsKozX(x, v), y, eg || vil ? "eg" : hal ? "halvany" : "");
  }
  ["b", "j"].forEach(function (o) {
    var lv = o === "b" ? T : T + 10, tesz = !x.irany && x.hol == null && !JL.lezart;
    s += jsLampas(jsKozX(x, lv), y, K.lh, x.feny[o] || (x.hol === o ? "lobban" : ""), lv, tesz ? ' class="jl-hely" data-hely="' + o + '"' : '');
  });
  /* a következő lépés (lépegetés): pulzáló karika */
  if (x.irany && !JL.lezart) {
    var nv = x.irany === "b" ? x.n - x.L - 1 : x.n + x.R + 1, nx = jsKozX(x, nv);
    s += '<g class="js-lep" data-v="' + nv + '" style="cursor:pointer"><circle cx="' + pcF(nx) + '" cy="' + y + '" r="22" fill="transparent"/><circle cx="' + pcF(nx) + '" cy="' + y + '" r="9" fill="none" stroke="#e0417a" stroke-width="2.6">' +
         (lkCsokkent() ? '' : '<animate attributeName="r" values="7;13;7" dur="1.1s" repeatCount="indefinite"/>') + '</circle></g>';
  }
  if (JL.fog) return s;
  var kx = x.hol == null ? jsKozX(x, x.n) : jsKozX(x, x.hol === "b" ? T : T + 10) + (x.hol === "b" ? 18 : -18);
  s += jsKo(kx, y - 4, x.n, JL.keskeny ? .9 : 1, x.irany || x.hol != null || JL.lezart ? '' : ' class="jl-fog js-lukt" data-fog="ko"', x.hol === jo || (!x.irany && x.hol == null && !JL.lezart) ? "fenyes" : "");   /* a felvehető kő izzik + lüktet (a producer, 11-13) */
  return s;
}
function jsLep(JL, x) {
  hangGomb();
  if (x.irany === "b") x.L++; else x.R++;
  var v = x.irany === "b" ? x.n - x.L : x.n + x.R, f = JL.f;
  if (x.irany === "b" && v === x.T) {   /* elérte a kisebb lámpást: az kigyúl, vissza a kőhöz, aztán a nagyobbig */
    x.feny.b = "eg"; x.irany = "j"; hangCsilla(); jsFelirat("Most lépegess a nagyobb lámpásig! Koppints a villogó karikára!");
    jlRajz(); jsSetal(jsKozX(x, v), jsK().uy, function () { setTimeout(function () { if (JL && JL.f === f) jsSetal(jsKozX(x, x.n), jsK().uy, null, 10); }, 250); });
    return;
  }
  if (x.irany === "j" && v === x.T + 10) {
    x.feny.j = "eg"; x.irany = null; hangCsilla(); jsFelirat("Melyik lámpás van közelebb? Vidd oda a követ!");
    jlRajz(); jsSetal(jsKozX(x, v), jsK().uy, function () { setTimeout(function () { if (JL && JL.f === f) jsSetal(jsKozX(x, x.n), jsK().uy, null, 10); }, 250); });
    mondd("Melyik lámpás van közelebb? Vidd oda a követ!");
    return;
  }
  jlRajz(); jsSetal(jsKozX(x, v), jsK().uy);
}
function jsKozelTesz(JL, x, hova) {
  var jo = kerekit(x.n, 10) === x.T ? "b" : "j", lv = hova === "b" ? x.T : x.T + 10, f = JL.f, K = jsK(), st = JL.st;
  if (hova === jo) {
    x.hol = hova; x.ut = hova; x.tiki = "orul"; hangCsilla();
    jlJo(x.n + " → " + lv, null, function (tovabb) { jsSetal(jsKozX(x, lv), K.uy, function () { setTimeout(tovabb, lkCsokkent() || window.__UC_GYORS ? 0 : 500); }, 12); });
    return;
  }
  /* rossz: hosszú séta a távolabbi lámpásig, közben halványan a rövidebb irány; aztán lépegetni kell */
  JL.lezart = true; x.hol = hova; x.villan = { hosszu: hova };
  jlRossz(String(lv), jsNaplo("közelebb " + x.n));
  st.rossz = (st.rossz || 0) + 1;
  if (st.rossz >= 2) st.lepKell = Math.max(st.lepKell || 0, 2);   /* 🔒 az állomás 2. hibája után a következő két feladat is lépegetős */
  jlRajz();
  jsSetal(jsKozX(x, lv), K.uy, function () {
    setTimeout(function () {
      if (!JL || JL.f !== f) return;
      x.hol = null; x.villan = null; x.lep = true; x.L = x.R = 0; x.irany = "b"; x.feny = {}; JL.lezart = false;
      jsFelirat("Lépegess a kisebb lámpásig! Koppints a villogó karikára!");
      jlRajz(); jsSetal(jsKozX(x, x.n), K.uy, null, 10);
      jlSzol(JL.seg >= 2 ? "Számold meg a lépéseket! Előbb a kisebb lámpásig, aztán a nagyobbig. Merre kevesebb?" : "Hm. Lépegess, és nézd meg, merre rövidebb az út!", true);
    }, lkCsokkent() || window.__UC_GYORS ? 0 : 700);
  }, 14);
}

/* ═════════════════ ② MELYIK KETTŐ KÖZÖTT? ═════════════════ */
function jsKozeRajz(JL, x, K) {
  var s = '', y = K.py, m = x.m, jo = Math.floor(m.ertek / 10), k, tesz = !x.kesz && !JL.lezart;
  s += jsUt(K.sor[0], K.sor[1], y);
  for (k = 0; k <= 10; k++) {
    var lv = k * 10, cim = x.jel || k % 5 === 0 ? lv : null;
    s += jsLampas(jsSorX(lv), y, K.lh * .7, x.kesz && (k === jo || k === jo + 1) ? "lobban" : "", cim, '');
  }
  if (tesz) for (k = 0; k < 10; k++) s += '<rect class="jl-hely" data-hely="s' + k + '" x="' + pcF(jsSorX(k * 10) + 4) + '" y="' + (y - 34) + '" width="' + pcF(jsSorX(10) - jsSorX(0) - 8) + '" height="56" rx="10" fill="transparent"/>';
  var hk = jsTikiKez(K);
  s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2], x.tiki || "cetli");
  s += jsCetli(hk[0] + (JL.keskeny ? 44 : 50), hk[1] - (JL.keskeny ? 22 : 28), m.szoveg, x.kesz && m.muv ? m.ertek : null);
  if (JL.fog) return s;
  var kp = x.kesz ? [jsSorX(m.ertek), y - 4] : x.rossz != null ? [jsSorX(x.rossz * 10 + 5), y - 4] : K.koStart;
  var t = m.muv && !x.kesz ? "?" : m.ertek;
  s += '<g' + (x.rossz != null && !lkCsokkent() ? ' class="js-razkod"' : '') + '>' + jsKo(kp[0], kp[1], t, JL.keskeny ? .85 : 1, tesz && x.rossz == null ? ' class="jl-fog js-lukt" data-fog="ko"' : '', x.kesz || (tesz && x.rossz == null) ? "fenyes" : "") + '</g>';
  return s;
}
function jsKozeTesz(JL, x, k) {
  var m = x.m, jo = Math.floor(m.ertek / 10), f = JL.f;
  if (k === jo) {
    x.kesz = true; x.tiki = "orul"; hangCsilla();
    if (m.muv) mondd(zsCap(m.beszed) + ", az " + szo(m.ertek) + ".");
    jlJo(m.szoveg + (m.muv ? " = " + m.ertek : "") + " → " + (jo * 10) + " és " + (jo * 10 + 10) + " között", null, jsMutatEltart);
    return;
  }
  JL.lezart = true; x.rossz = k;
  jlRossz((k * 10) + "–" + (k * 10 + 10), jsNaplo("között " + m.szoveg));
  var mondat;
  if (JL.seg >= 2) mondat = m.muv ? "Számold ki: " + m.beszed + "! Aztán keresd meg a helyét." :
    zsCap(zsAz(m.ertek)) + jsBan(m.ertek) + " " + szo(Math.floor(m.ertek / 10)) + " tízes van, és még " + szo(m.ertek % 10) + ". Melyik két lámpás közé esik?";
  else { x.jel = true; mondat = m.muv ? "Körülbelül mennyi lesz? Több, mint tíz? Több, mint ötven?" : "Nézd meg a lámpások számait! Hány tízes van benne?"; }
  if (m.ertek < 10 && JL.seg >= 2 && !m.muv) mondat = zsCap(zsAz(m.ertek)) + " kisebb, mint tíz. Melyik két lámpás közé esik?";
  jlRajz(); jlSzol(mondat, true);
  setTimeout(function () { if (!JL || JL.f !== f) return; x.rossz = null; JL.lezart = false; jlRajz(); }, lkCsokkent() || window.__UC_GYORS ? 0 : 750);
}

/* ═════════════════ ③ HÁNY SZEM VAN? ═════════════════ */
var JS_KARTYA = ["20-nál kevesebb", "20 és 40 között", "40-nél több"];
function jsNez(JL) {
  var x = JL.f.js, f = JL.f;
  JL.lezart = true; jlRajz(); mondd("Nézd meg jól!");
  setTimeout(function () {
    if (!JL || JL.f !== f) return;
    x.fazis = "becs"; JL.lezart = false;
    jsFelirat(x.kartya ? "Körülbelül hány szem van? Válassz kártyát!" : "Körülbelül hány szem van? Írd a táblára!");
    jlRajz(); jlFokusz();
    mondd(x.kartya ? "Körülbelül hány szem volt? Válassz egy kártyát!" : "Körülbelül hány szem volt? Írd a táblára a becslésedet!");
  }, window.__UC_GYORS ? 30 : 3000 + x.n * 35);
}
function jsFuzIndit(JL, x) {
  x.fazis = "fuz";
  jsFelirat("Koppints a szemekre: fűzd fel őket tízesével!");
  jlRajz(); mondd("Most fűzd fel a szemeket! Koppints rájuk egyenként. Tíz szem egy gyűrű.");
}
function jsFuz(JL, x, i) {
  var sz = x.szemek[i]; if (!sz || sz.fuzve) return;
  sz.fuzve = true; x.fuz++; hangGomb();
  if (x.fuz % 10 === 0) hangCsilla();
  if (x.auto && x.fuz === 10) { jsAutoFuz(JL, x); return; }   /* az első gyűrűt ő fűzi, a többi magától fűződik */
  if (x.fuz === x.n) { jsSzamolIndit(JL, x); return; }
  jlRajz();
}
function jsAutoFuz(JL, x) {
  var f = JL.f;
  JL.lezart = true; jlRajz();
  (function tovabb() {
    if (!JL || JL.f !== f) return;
    var sz = x.szemek.filter(function (s) { return !s.fuzve; })[0];
    if (!sz) { JL.lezart = false; jsSzamolIndit(JL, x); return; }
    sz.fuzve = true; x.fuz++; if (x.fuz % 10 === 0) hangCsilla();
    if (window.__UC_GYORS || lkCsokkent()) { tovabb(); return; }
    jlRajz(); setTimeout(tovabb, 110);
  })();
}
function jsSzamolIndit(JL, x) {
  x.fazis = "szamol"; jsFelirat("Hány szem van? Írd a táblára!");
  jlRajz(); jlFokusz(); mondd("Hány szem van? Írd a táblára!");
}
function jsDarabRajz(JL, x, K) {
  var s = '', L = K.lencse, cx = L[0], cy = L[1], r = L[2], i, F = pcF, br = r * .075;
  /* a távcső lencséje: a ki nem fűzött szemek */
  s += '<g filter="url(#lt-firka)"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 12) + '" fill="#e9c27a" stroke="#8a5a1a" stroke-width="3"/></g>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff8ea" stroke="#c9962a" stroke-width="2"/>';
  x.szemek.forEach(function (sz, j) {
    if (sz.fuzve) return;
    var px = cx + sz.u * r, py = cy + sz.v * r, c = JS_SZEM_SZIN[sz.c], kopp = x.fazis === "fuz" && !JL.lezart;
    s += '<g' + (kopp ? ' class="js-szem" data-i="' + j + '" style="cursor:pointer"' : '') + '>' + (kopp ? '<circle cx="' + F(px) + '" cy="' + F(py) + '" r="' + F(br * 1.9) + '" fill="transparent"/>' : '') +
         '<circle cx="' + F(px) + '" cy="' + F(py) + '" r="' + F(br) + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.6"/><circle cx="' + F(px - br * .3) + '" cy="' + F(py - br * .3) + '" r="' + F(br * .28) + '" fill="#fff" opacity=".7"/></g>';
  });
  /* pára: a becslés alatt nem lehet egyesével megszámolni */
  if (x.fazis === "becs") {
    s += '<g pointer-events="none"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#eef2f8"/>';
    [[-.4, -.3, .5], [.35, .1, .55], [-.1, .45, .45]].forEach(function (p) { s += '<ellipse cx="' + F(cx + p[0] * r) + '" cy="' + F(cy + p[1] * r) + '" rx="' + F(p[2] * r) + '" ry="' + F(p[2] * r * .55) + '" fill="#fff" opacity=".9"/>'; });
    s += '</g>';
  }
  /* gyűrűk: 10 szem = egy zárt gyűrű; a maradék egy nyitott szálon */
  var G = K.gyuru, gy = Math.floor(x.fuz / 10), mar = x.fuz % 10, gr = JL.keskeny ? 22 : 26;
  for (i = 0; i <= gy && i < 7; i++) {
    var db = i < gy ? 10 : mar; if (!db) continue;
    var gx = G[0] + i * G[2], zart = i < gy, lk = JL.keskeny ? 13 : 18;
    if (zart) s += '<circle cx="' + gx + '" cy="' + G[1] + '" r="' + gr + '" fill="none" stroke="#b08a68" stroke-width="1.6"/>';
    else s += '<path d="M' + (gx - gr) + ' ' + G[1] + 'H' + F(gx - gr + 10 * lk) + '" stroke="#b08a68" stroke-width="1.6"/>';   /* a maradék: nyitott szál, a szemek külön-külön, megszámolhatóan (a producer, 11-13) */
    for (var j = 0; j < db; j++) {
      var a = -Math.PI / 2 + j * Math.PI / 5, bx = zart ? gx + Math.cos(a) * gr : gx - gr + j * lk + lk / 2, by = zart ? G[1] + Math.sin(a) * gr : G[1];
      s += '<circle cx="' + F(bx) + '" cy="' + F(by) + '" r="' + (zart ? 6.4 : 7) + '" fill="' + JS_SZEM_SZIN[j % 5][0] + '" stroke="' + JS_SZEM_SZIN[j % 5][1] + '" stroke-width="1.2"/>';
    }
  }
  /* kártyák (az első feladat becslése, 2TC 12. f.) */
  if (x.kartya && (x.fazis === "becs" || x.becsK != null)) {
    var C = K.kartya;
    JS_KARTYA.forEach(function (t, k) {
      var val = x.becsK === k, kop = x.fazis === "becs" && !JL.lezart;
      s += '<g' + (kop ? ' class="js-kartya" data-k="' + k + '" style="cursor:pointer"' : '') + ' transform="translate(' + C.x[k] + ' ' + C.y[k] + ')"' + (x.becsK != null && !val ? ' opacity=".35"' : '') + '>' +
           '<g filter="url(#lt-firka)"><rect x="' + (-C.w / 2) + '" y="' + (-C.h / 2) + '" width="' + C.w + '" height="' + C.h + '" rx="9" fill="' + (val ? "#fff1a8" : "#fffaf0") + '" stroke="' + (val ? "#d1a23a" : "#c9ad85") + '" stroke-width="2"/></g>' +
           '<text y="5" text-anchor="middle" font-size="' + (JL.keskeny ? 13 : 15) + '"' + JS_FR + ' fill="#4a3b7a">' + (JL.keskeny ? t.replace(" és ", "–").replace(" között", "") : t) + '</text></g>';
    });
  }
  /* beteljesülés: a két szám köve az ösvényen, köztük az eltérés */
  if (x.fazis === "kesz") s += jsEltartUt(JL, K, x.becs, x.n, x.becsK != null ? [[0, 20], [20, 40], [40, 100]][x.becsK] : null);
  s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2] * (JL.keskeny ? .9 : .8), x.tiki || "var");
  return s;
}
/* ösvény 0–100 a becsült és a megszámolt kővel (köztük pöttyök = az eltérés); sav: a kártya sávja */
function jsEltartUt(JL, K, becs, pontos, sav) {
  var y = K.py, s = jsUt(K.sor[0], K.sor[1], y), k;
  if (sav) s += '<rect x="' + pcF(jsSorX(sav[0])) + '" y="' + (y - 12) + '" width="' + pcF(jsSorX(sav[1]) - jsSorX(sav[0])) + '" height="24" rx="10" fill="#fff1a8" opacity=".75"/>';
  for (k = 0; k <= 10; k++) s += jsLampas(jsSorX(k * 10), y, 34, "", k * 10, '');
  if (becs != null) {
    var b = Math.max(0, Math.min(100, becs)), a = Math.min(b, pontos), c = Math.max(b, pontos);
    for (k = a + 1; k < c; k++) s += jsPotty(jsSorX(k), y, "halvany");
    s += jsKo(jsSorX(b), y - 26, becs, .62, '', '');
  }
  s += jsKo(jsSorX(pontos), y - 26, pontos, .72, '', "fenyes");
  return s;
}

/* ═════════════════ ④ MILYEN HOSSZÚ? ═════════════════ */
function jsMeresRajz(JL, x, K) {
  var V = K.von, s = '', F = pcF, c, w = 30 * V.cm, fedve = x.fazis === "becs" || x.fazis === "vag";
  /* minta: 10 cm (csak az első feladatnál) */
  if (x.minta) s += '<rect x="' + V.x0 + '" y="' + V.minta + '" width="' + (10 * V.cm) + '" height="10" rx="2" fill="#9ec9f0" stroke="#5f84b0" stroke-width="1.6"/><text x="' + (V.x0 + 10 * V.cm + 8) + '" y="' + (V.minta + 9) + '" font-size="13"' + JS_FR + ' fill="#5f84b0">10 cm</text>';
  /* vonalzó */
  s += '<g filter="url(#lt-firka)"><rect x="' + (V.x0 - 12) + '" y="' + V.y + '" width="' + (w + 24) + '" height="38" rx="4" fill="#fff2c9" stroke="#c9a24a" stroke-width="2"/></g>';
  for (c = 0; c <= 30; c++) {
    var tx = jsCmX(c), h = c % 5 === 0 ? 14 : 8;
    s += '<path d="M' + F(tx) + ' ' + V.y + 'v' + h + '" stroke="#8a6a3a" stroke-width="' + (c % 5 === 0 ? 1.8 : 1.1) + '"/>';
    if (c % V.cimke === 0) s += '<text x="' + F(tx) + '" y="' + (V.y + 30) + '" text-anchor="middle" font-size="' + (V.cimke > 1 ? 11 : 10) + '"' + JS_FR + ' fill="#6e4a36">' + c + '</text>';
  }
  /* takaró (a becslés alatt) — lehúzódik, ha mérni kell */
  if (fedve || x.fedoAnim) {
    s += '<g pointer-events="none"><g>' + (x.fedoAnim && !fedve && !lkCsokkent() ? '<animateTransform attributeName="transform" type="translate" values="0 0;' + (w + 60) + ' 0" dur=".7s" fill="freeze"/>' : '') +
         (x.fedoAnim && !fedve && lkCsokkent() ? '' : '<rect x="' + (V.x0 - 14) + '" y="' + (V.y - 4) + '" width="' + (w + 28) + '" height="46" rx="8" fill="#c9b6dc" stroke="#7a5ea8" stroke-width="2"/>' +
         '<path d="M' + (V.x0 - 6) + ' ' + (V.y + 2) + 'H' + (V.x0 + w + 6) + 'M' + (V.x0 - 6) + ' ' + (V.y + 34) + 'H' + (V.x0 + w + 6) + '" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 5"/>') + '</g></g>';
    if (!fedve) x.fedoAnim = false;
  }
  /* szalag */
  var hossz = x.keszits ? (x.vag == null ? 30 : x.vag) : x.L, sy = V.sz;
  s += '<rect x="' + V.x0 + '" y="' + sy + '" width="' + F(hossz * V.cm) + '" height="14" rx="2" fill="#f6a5c0" stroke="#c0567f" stroke-width="1.8"/>';
  if (x.keszits && x.vag == null) s += '<g transform="translate(' + F(V.x0 + 30 * V.cm + 6) + ' ' + (sy + 7) + ')"><circle r="14" fill="#f6a5c0" stroke="#c0567f" stroke-width="1.8"/><circle r="5" fill="#fff" stroke="#c0567f" stroke-width="1.4"/></g>';
  /* koppintó sávok (a vágás helye, cm-enként) */
  if (x.keszits && !JL.lezart && x.fazis !== "kesz") for (c = 1; c <= 30; c++) s += '<rect class="js-cm" data-cm="' + c + '" x="' + F(jsCmX(c) - V.cm / 2) + '" y="' + (sy - 24) + '" width="' + V.cm + '" height="' + (V.y + 44 - sy + 24) + '" fill="transparent" style="cursor:pointer"/>';
  if (x.keszits && x.vag != null) s += '<path d="M' + F(jsCmX(x.vag)) + ' ' + (sy - 12) + 'v38" stroke="#4a3b7a" stroke-width="2" stroke-dasharray="3 3"/>';
  /* beteljesülés: a becslés és a mérés köve, köztük az eltérés */
  if (x.fazis === "kesz" && !x.keszits && x.becs != null) {
    var b = Math.max(0, Math.min(34, x.becs)), a = Math.min(b, x.L), z = Math.max(b, x.L), ky = sy - 30;
    for (c = a + 1; c < z; c++) s += jsPotty(jsCmX(c), ky, "halvany");
    s += jsKo(jsCmX(b), ky, x.becs, .6, '', '') + jsKo(jsCmX(x.L), ky, x.L, .7, '', "fenyes");
  }
  s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2] * (JL.keskeny ? .9 : .8), x.tiki || "var");
  return s;
}
function jsVag(JL, x, c) {
  hangGomb();
  if (x.fazis === "vag") {
    x.vag = c; x.fazis = "igazit"; x.fedoAnim = true;
    jsFelirat("Most pontosan " + x.C + " cm legyen! Koppints oda, ahol elvágod!");
    jlRajz(); mondd("Most mérd meg! Legyen pontosan " + szo(x.C) + " centi: koppints oda, ahol elvágod!");
    return;
  }
  x.vag = c;
  if (c === x.C) { x.fazis = "kesz"; x.tiki = "orul"; hangCsilla(); jlJo(x.C + " cm", null, jsMutatEltart); return; }
  jlRossz(c + " cm", jsNaplo("készíts " + x.C + " cm"));
  jlRajz();
  jlSzol(JL.seg >= 2 ? "A szalag a nullánál kezdődik. Hol van a vonalzón a " + szo(x.C) + "?" : "Nézd meg a vonalzón, hol van a vége!", true);
}

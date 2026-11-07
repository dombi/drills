/* ============ 6h7) 💰 FIZESS PONTOSAN — üres a kassza (3. receptes pálya a Piactéren, 1. kör, 2026-11-07) ============
   Recept-lap: terv/fizess-pontosan-recept-lap.html (✅ mind az 5 döntés A). A sora a receptek.js-ben, a kép a jelenet-motoron (jelenet.js),
   Zsivány standján lakik (2. kártya: piac.js kártyaválasztó). A Zsibvásár (zsib.js) rajzkészletét és Zsivány-rigjét használja.
   MIT CSINÁL A GYEREK A KÉPEN? Reggel még üres Zsivány kasszája, nem tud visszaadni. A gyerek a korlátos erszényéből a pultra rakja az
   érméket (felvesz–letesz), és „Fizetek”. Zsivány nagyobb érmével kezdve hangosan összeszámolja. Pont annyi → elteszi az árut. Sok → vállat von,
   a kassza üres rekeszei világítanak, az érmék visszalebegnek. Kevés → a szalagon üres hely marad a cédula előtt. Ha szerinte nem lehet, a
   cédulát a „Nem lehet” tálba teszi, és meg kell mutatnia, miért (🔒 kiskapu: a „nem lehet” csak indoklással ér).
     ① Csupa egyforma — egy címlet sok darabban (1. MF 108., 2. MF 40., 3. TC 40.). Az ugró-szalag minden lerakott érménél ugrik egyet:
        a kérdés, hogy a cédulánál megáll-e. Állomásonként egy nem kifizethető ár: indoklás = a szalagon a két szomszéd megálló.
     ② Pontosan, másképp is — vegyes erszény, címletenként legfeljebb 2 (Hármasország, 2. MF 60–62.; 3. MB 15/4). Pósa: fizesd ki → van más út?
        (csak 💧, kihagyható, ugyanaz nem ér). A szalag csak 2 hiba után jelenik meg, a pult széle is akkor mutatja, mennyi van kint.
     🏠 Odú-küszöb — ① és ② vegyesen, szalag nélkül (a „nem lehet” indoklásánál a szalag előjön: az a bizonyíték).
   Számkör (2A): 1. o. 20-ig (1, 2, 5, 10) · 2. o. 100-ig, 3–5 érme · 3. o.-tól 100-ig, 4–6 érme, 50-es is.
   2. kör (még nincs): ③ Lehet egyáltalán? (okkártya) · ④ Biztos, lehet, lehetetlen / 2. o.: Ennyi érmével · gépi kiskapu-próba. */

VS_SZIN.fizess1 = { teto: "#f7d57a", csik: "#fffaf0", sotet: "#b5842c", cimer: "🪙" };
VS_SZIN.fizess2 = { teto: "#f6a5c0", csik: "#fffaf0", sotet: "#b5607e", cimer: "💰" };
var FP_URES = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0 };
var FP_ESEID = { 1: "egyeseid", 2: "ketteseid", 5: "ötöseid", 10: "tízeseid", 20: "húszasaid", 50: "ötveneseid" };
var FP_ESSEL = { 2: "kettesével", 5: "ötösével", 10: "tízesével", 20: "húszasával" };
var FP_ODU = ["pontos", "egyforma", "pontos", "egyforma"];
PALYA_MAT["fizess-pontosan"] = "Üres a kassza. Fizess pontosan, vagy mutasd meg, hogy nem lehet";   /* a csengő ezt olvassa fel (a palcim „·” jele helyett) */

/* ═════════════════ FELADATGYÁRTÓK (tiszta adat) ═════════════════ */
/* a pontos fizetések (érme-multihalmazok, csökkenő sorrendben): ["20+5+2", …] */
function fpJok(e, ar) {
  var n = e.length, l = {}, m, i;
  for (m = 1; m < 1 << n; m++) { var t = [], s = 0; for (i = 0; i < n; i++) if (m & 1 << i) { t.push(e[i]); s += e[i]; } if (s === ar) l[t.join("+")] = 1; }
  return Object.keys(l);
}
/* ① csupa egyforma: nem = az ár NEM fizethető ki (nem többszöröse a címletnek). Az erszényben mindig több van, mint az ár (mindent letolni = sok) */
function fpEgyforma(o, nem) {
  var cl = o <= 1 ? [2, 5] : o === 2 ? [2, 5, 10] : [2, 5, 10, 20];
  for (var p = 0; p < 300; p++) {
    var c = veletlenElem(cl), hi = Math.min(o <= 1 ? 20 : 100, c * 7), ar = veletlen(c + 1, hi);
    if (nem ? ar % c === 0 : ar % c !== 0) continue;
    var n = Math.min(8, Math.floor(ar / c) + 2), e = [];
    for (var i = 0; i < n; i++) e.push(c);
    if (n * c <= ar) continue;
    return { forma: "egyforma", cim: c, ar: ar, nem: !!nem, erszeny: e, aru: zsAruk(1)[0], jok: nem ? 0 : 1, naplo: { tipus: "bolt", kerdes: "pontos " + ar, forma: "z" } };
  }
  return nem ? { forma: "egyforma", cim: 5, ar: 17, nem: true, erszeny: [5, 5, 5, 5, 5], aru: ZS_ARU[0], jok: 0, naplo: { tipus: "bolt", kerdes: "pontos 17", forma: "z" } }
             : { forma: "egyforma", cim: 5, ar: 15, nem: false, erszeny: [5, 5, 5, 5, 5], aru: ZS_ARU[0], jok: 1, naplo: { tipus: "bolt", kerdes: "pontos 15", forma: "z" } };
}
/* ② pontosan, másképp is: címletenként legfeljebb 2 érme; van pontos fizetés; az egész nem pont az ár; a „próbálgatás” ne érje meg
   (a pontos fizetések legfeljebb a fele az ár fölötti/egyenlő kirakásoknak); többnyire több pontos út is van (Pósa: más út) */
function fpPontos(o) {
  var cim = o <= 1 ? [1, 2, 5, 10] : o === 2 ? [1, 2, 5, 10, 20] : [1, 2, 5, 10, 20, 50];
  for (var p = 0; p < 1500; p++) {
    var db = o <= 2 ? veletlen(3, 5) : veletlen(4, 6), e = keverTomb(cim.concat(cim)).slice(0, db), i;   /* minden címletből legfeljebb 2 */
    var S = tallerOsszeg(e);
    if (S > (o <= 1 ? 20 : 100) || S < 8) continue;
    e.sort(function (a, b) { return b - a; });
    var ar = o <= 1 ? veletlen(5, Math.min(19, S - 1)) : veletlen(Math.max(12, Math.floor(S / 3)), S - 2);
    if (ar >= S || ar % 10 === 0 && Math.random() < .7) continue;
    var jok = fpJok(e, ar); if (!jok.length) continue;
    var tobb = 0, m; for (m = 1; m < 1 << e.length; m++) { var s = 0; for (i = 0; i < e.length; i++) if (m & 1 << i) s += e[i]; if (s >= ar) tobb++; }
    if (jok.length * 2 > tobb && p < 1200) continue;
    if (jok.length < 2 && p < 1100 && Math.random() < .93) continue;   /* a szakasz neve „másképp is”: többnyire legyen más út */
    return { forma: "pontos", ar: ar, erszeny: e, aru: zsAruk(1)[0], jok: jok.length, naplo: { tipus: "bolt", kerdes: "pontos " + ar, forma: "z" } };
  }
  return { forma: "pontos", ar: o <= 1 ? 7 : 37, erszeny: o <= 1 ? [5, 2, 2, 1] : [20, 10, 5, 5, 2], aru: ZS_ARU[0], jok: o <= 1 ? 2 : 1, naplo: { tipus: "bolt", kerdes: "pontos 37", forma: "z" } };
}

/* ═════════════════ FELADAT (GEN.fizess) ═════════════════ */
GEN.fizess = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, o = zsOsztaly(), n = cfg.darab || 4, halvany = !!cfg.halvany, forma = cfg.forma, d;
  if (forma === "vegyes") forma = FP_ODU[i % FP_ODU.length];
  if (st.nemI == null) st.nemI = cfg.forma === "vegyes" ? 3 : veletlen(1, n - 1);   /* állomásonként egy „itt nem igaz” ár (nem az első) */
  d = forma === "egyforma" ? fpEgyforma(o, i === st.nemI) : fpPontos(o);
  var x = { d: d, halvany: halvany, hib: 0, lep: "fizet", pult: [], okVal: [] }, k = fpKerdes(x);
  return { csalad: "jelenet", jelenet: "fizess", zs: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>', szoveg: k[0], felolvas: k[1],
    helyes: d.ar, keplet: k[0], tipp: "", naplo: d.naplo };
};
/* a lépés kérdése: [felirat, felolvasás] — a szabály az első mozdulat előtt elhangzik, és a kasszán is ott áll */
function fpKerdes(x) {
  var d = x.d, L = x.lep, ar = "Ez " + szo(d.ar) + " tallérba kerül. ";
  if (L === "mas") return ["Van más út? Fizess másképp!", "Van más út? Ha más érmékkel is ki tudod fizetni, kapsz egy csepp tündérharmatot!"];
  if (L === "ok") return ["Miért nem lehet? Mutasd a szalagon!", "Mutasd meg a szalagon, miért nem lehet! Koppints a két megállóra: az egyik közvetlenül a cédula előtt van, a másik utána."];
  if (d.forma === "egyforma") return ["Fizess pontosan! Csak " + FP_ESEID[d.cim] + " vannak.", ar + "Üres a kasszám, nem tudok visszaadni. Csak " + FP_ESEID[d.cim] + " vannak. Fizess pontosan! Ha nem lehet, tedd a cédulát a tálba!"];
  return ["Fizess pontosan!", ar + "Üres a kasszám, nem tudok visszaadni. Pontosan fizess! Ha nem lehet, tedd a cédulát a tálba!"];
}
function fpLep(x, lep, csendben) {
  x.lep = lep; JL.rossz = null; x.hib = 0; JL.seg = 0;
  var k = fpKerdes(x), f = JL.f;
  f.szoveg = f.keplet = k[0]; $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>';
  if (!csendben) { var vj = $("visszajelzes"); vj.className = "visszajelzes"; vj.textContent = ""; }
  jlRajz(); if (!csendben) mondd(k[1]);
}
function fpPultErmek(x) { return x.pult.map(function (i) { return x.d.erszeny[i]; }).sort(function (a, b) { return b - a; }); }
/* Zsivány hangosan összeszámol, a nagyobb érmével kezdve (1. MF 129.: először a tízesek): „Húsz, harminc, harmincöt.” */
function fpSzamol(t) { var s = 0; return zsCap(t.map(function (v) { s += v; return szo(s); }).join(", ")) + "."; }

/* ═════════════════ JÁTÉKMENET ═════════════════ */
function fpFizet(x) {
  var d = x.d, t = fpPultErmek(x), s = tallerOsszeg(t), mas = x.lep === "mas", szamol;
  hangGomb();
  if (!t.length) { mondd("Tegyél érméket a pultra!"); return; }
  szamol = fpSzamol(t);
  if (s < d.ar) {   /* kevés: az érmék a pulton maradnak, a szalagon üres hely a cédula előtt */
    if (mas) { jlSzol(szamol + " Ez még kevés.", true); return; }
    zsRossz(x, "kevés", d.naplo, szamol + " " + (x.hib === 0 ? "Ez még kevés." : fpTipp(x, s)));
    return;
  }
  if (s > d.ar) {   /* sok: Zsivány vállat von, a kassza üres rekeszei világítanak, az érmék visszalebegnek */
    x.vilagit = KF_KASSZA_CIM.slice(); x.lep = "var";
    zsZsivany("vallatvon", null, 2600);
    var mondat = szamol + " Ez sok. Üres a kasszám, nem tudok visszaadni." + (x.hib >= 1 && !mas ? " " + fpTipp(x, s) : "");
    if (mas) { jlRajz(); jlSzol(mondat, true); } else zsRossz(x, "sok", d.naplo, mondat);
    zsVar(function () { x.lebeg = x.pult.slice(); x.pult = []; x.vilagit = null; x.lep = mas ? "mas" : "fizet"; jlRajz(); }, 2400);
    return;
  }
  var kulcs = t.join("+");
  if (mas) {
    if (kulcs === x.elso) { x.lebeg = x.pult.slice(); x.pult = []; jlRajz(); mondd(szamol + " Így már fizettél. Más érmékkel is megy?"); return; }
    P().tunderharmat = (P().tunderharmat || 0) + ZS_MAS_HARMAT; ment();
    x.masik = kulcs; fpVege(x, szamol + " Így is jó! Ezért egy csepp tündérharmat jár.");
    return;
  }
  x.elso = kulcs;
  var harmatRejt = typeof nyitasHarmatRejtett === "function" && nyitasHarmatRejtett();
  if (d.jok > 1 && !x.halvany && !harmatRejt) {   /* Pósa: ugyanarra az árra van más út is? (csak 💧-ért, kihagyható) */
    x.lep = "var"; hangCsilla(); zsKolyokPoz("orul"); jlRajz();
    zsZsivany("orul", szamol + " Pont annyi. Köszönöm!", 1800);
    zsVar(function () { x.lebeg = x.pult.slice(); x.pult = []; fpLep(x, "mas"); }, 2200);
    return;
  }
  fpVege(x, szamol + " Pont annyi. Köszönöm!");
}
/* a 2. hibától: a kép felel (① a szalagra mutat, ② a pult széle mutatja, mennyi van kint) — a megoldást nem mondjuk ki */
function fpTipp(x, s) {
  if (x.d.forma === "egyforma" && !x.halvany) return "Nézd a szalagot: megáll a cédulánál?";
  return "A pulton " + szo(s) + " tallér van. Az ár " + szo(x.d.ar) + ".";
}
function fpVege(x, mondat) {
  var d = x.d, f = JL.f, k = (x.masik || x.elso).split("+");
  x.lep = "kesz"; f.helyes = d.ar;
  jlJo(k.join(" + ") + " = " + d.ar, null, function (tov) { hangCsilla(); zsZsivany("orul", mondat, 2200); zsKolyokPoz("orul"); zsVar(tov, 2600); });
}
/* a cédula a „Nem lehet” tálban: ha tényleg nem lehet, jön az indoklás (a szalagon a két szomszéd megálló); ha lehet, Zsivány visszaadja */
function fpNemLehet(x) {
  var d = x.d;
  if (d.nem) { hangCsilla(); x.lebeg = x.pult.length ? x.pult.slice() : null; x.pult = []; x.tal = true; fpLep(x, "ok"); return; }
  x.tal = false; zsZsivany("mutat", null, 1800);
  zsRossz(x, "nem lehet", d.naplo, x.hib === 0 ? "Szerintem lehet. Próbáld meg!" : "Szerintem lehet. Rakd ki, és nézd meg, mennyi van a pulton!");
}
/* az indoklás: a két megálló, amelyek között az ár van (pl. 15 és 20 a 17-nél) */
function fpOk(x, v) {
  var d = x.d, c = d.cim, lo = Math.floor(d.ar / c) * c, k = x.okVal.indexOf(v);
  hangGomb();
  if (k >= 0) x.okVal.splice(k, 1); else x.okVal.push(v);
  if (x.okVal.length < 2) { jlRajz(); return; }
  var a = Math.min(x.okVal[0], x.okVal[1]), b = Math.max(x.okVal[0], x.okVal[1]);
  if (a === lo && b === lo + c) {
    x.lep = "kesz";
    jlJo(lo + " < " + d.ar + " < " + (lo + c), null, function (tov) { zsZsivany("orul", "Igaz! " + zsCap(FP_ESSEL[c]) + " " + szo(lo) + ", aztán " + szo(lo + c) + ". " + zsCap(szo(d.ar)) + " kimarad. Ezt most nem tudod pontosan kifizetni.", 3000); zsKolyokPoz("orul"); zsVar(tov, 3400); });
    return;
  }
  x.okVal = [];
  var l = [], i; for (i = 0; i <= lo + c; i += c) l.push(szo(i));
  zsRossz(x, "megálló", d.naplo, x.hib === 0 ? "Keresd a cédulát a szalagon! Melyik megálló van közvetlenül előtte, és melyik utána?" : zsCap(FP_ESSEL[c]) + ": " + l.join(", ") + ". Melyik kettő között van " + szo(d.ar) + "?");
}

/* ═════════════════ A KÉP (JELENETEK.fizess) ═════════════════ */
var FP_PULT = function (k) { return [30 + (k % 4) * 42, 264 + Math.floor(k / 4) * 44]; };
var FP_ERSZ = function (j) { return [92 + (j % 4) * 40, 362 + Math.floor(j / 4) * 42]; };
JELENETEK.fizess = {
  kep: function () { var K = zsK(); return { vb: K.vb, tabla: null, uni: K.uni }; },
  rajz: function (JL) {
    var K = zsK(), s = '<defs>' + HE_DEFS + '</defs>' + zsHatter(JL);
    s += '<g transform="' + K.stand + '">' + zsStand(true, false) + '</g>';   /* a kassza nagyban, a munka-részben (üres) */
    s += '<g class="zs-kolyok-hely"></g>';
    s += '<g transform="translate(' + K.m[0] + ' ' + K.m[1] + ') scale(' + K.m[2] + ')">' + fpRajz(JL) + '</g>';
    return zsHe(s);
  },
  utan: function (JL) { JELENETEK.zsib.utan(JL); },   /* Zsivány (ugyanaz a figura) és a kölyök a helyére, a lebegő érmék indulnak */
  fogRajz: function (JL, F) {
    if (F.id === "ced") return '<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 30) + ')">' + kfCedula(0, 0, JL.f.zs.d.ar, 1.15) + '</g>';
    return zsHe('<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 6) + ')">' + tallerBelso(F.n, 1) + '</g>');
  },
  felvesz: function (JL, id) {
    var x = JL.f.zs;
    if (x.lep !== "fizet" && x.lep !== "mas") return null;
    x.lebeg = null;
    if (id === "ced") { if (x.lep !== "fizet") return null; x.fog = "ced"; return x.d.ar; }
    var i = +id.split("-")[1]; x.fog = i; return x.d.erszeny[i];
  },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.zs; x.fog = null;
    if (id === "ced") { if (hova === "tal") { hangGomb(); fpNemLehet(x); } else jlRajz(); return; }
    var i = +id.split("-")[1], k = x.pult.indexOf(i);
    if (hova === "pult") { if (k < 0) x.pult.push(i); } else if (k >= 0) x.pult.splice(k, 1);
    hangGomb(); jlRajz();
  },
  katt: function (JL, t) {
    var x = JL.f.zs, g = t.closest ? t.closest(".zs-gomb") : null, m = t.closest ? t.closest(".fp-megallo") : null, tal = t.closest ? t.closest(".fp-tal") : null;
    if (g && (x.lep === "fizet" || x.lep === "mas")) { if (g.getAttribute("data-g") === "tovabb") { hangGomb(); fpVege(x, "Pont annyi. Köszönöm!"); } else fpFizet(x); return; }
    if (m && x.lep === "ok") { fpOk(x, +m.getAttribute("data-v")); return; }
    if (tal && x.lep === "fizet") { hangGomb(); fpNemLehet(x); }   /* a tálra koppintás is beteszi a cédulát */
  },
  bekuld: function () {},
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele lépésenként */
    var x = JL.f.zs, d = x.d, L = x.lep, q = function (s) { return "#jl-svg " + s; };
    if (L === "fizet" && d.nem) return { katt: [q('.jl-fog[data-fog="ced"]'), q('.jl-hely[data-hely="tal"]')], rossz: q('.zs-gomb[data-g="fizet"]') };
    if (L === "ok") {
      var lo = Math.floor(d.ar / d.cim) * d.cim;
      return { katt: [q('.fp-megallo[data-v="' + lo + '"]'), q('.fp-megallo[data-v="' + (lo + d.cim) + '"]')] };
    }
    if (L === "fizet") {   /* az első pontos fizetés érméi a pultra (a már kint lévők vissza), aztán „Fizetek”; rossz: a cédula a tálba */
      var jo = fpJok(d.erszeny, d.ar)[0].split("+").map(Number), hasz = [], ki = [];
      jo.forEach(function (v) { for (var i = 0; i < d.erszeny.length; i++) if (d.erszeny[i] === v && hasz.indexOf(i) < 0) { hasz.push(i); return; } });
      x.pult.forEach(function (i) { if (hasz.indexOf(i) < 0) ki.push(q('.jl-fog[data-fog="p-' + i + '"]'), q('.zs-erszeny-hely')); });
      hasz.forEach(function (i) { if (x.pult.indexOf(i) < 0) ki.push(q('.jl-fog[data-fog="p-' + i + '"]'), q('.jl-hely[data-hely="pult"]')); });
      return { katt: ki.concat([q('.zs-gomb[data-g="fizet"]')]), rossz: q('.fp-tal') };
    }
    if (L === "mas") return { katt: [q('.zs-gomb[data-g="tovabb"]')] };
    return { katt: [] };
  }
};

/* ═════════════════ RAJZ (a munka-doboz: 290 × 430) ═════════════════ */
function fpRajz(JL) {
  var x = JL.f.zs, d = x.d, s = '', aktiv = (x.lep === "fizet" || x.lep === "mas") && !JL.lezart;
  /* a tárgy a cédulával (a cédula felvehető: a „Nem lehet” tálba tehető) */
  s += zsKacat(d.aru[0], 36, 76, 0);
  if (!x.tal && x.fog !== "ced") s += '<g' + (x.lep === "fizet" && !JL.lezart ? ' class="jl-fog" data-fog="ced" data-m="1" style="cursor:pointer"' : '') + '>' + kfCedula(96, 14, d.ar, 1.15) + '</g>';
  /* a „Nem lehet” tál (jobbra fent) */
  s += '<g class="fp-tal" style="cursor:pointer"><rect class="jl-hely" data-hely="tal" x="186" y="26" width="98" height="78" rx="12" fill="#fff" fill-opacity="' + (x.lep === "fizet" && !JL.lezart ? .3 : 0) + '" stroke="' + (x.lep === "fizet" && !JL.lezart ? "#e6b3c4" : "none") + '" stroke-dasharray="6 5"/>' +
       '<g filter="url(#lt-firka)"><path d="M190 62Q235 96 280 62Z" fill="#f6d3df" stroke="#b5607e" stroke-width="2"/><ellipse cx="235" cy="62" rx="45" ry="9" fill="#fbe7ee" stroke="#b5607e" stroke-width="2"/></g>' +
       zsSzoveg(235, 98, "Nem lehet", 15, "#b5607e", "middle") + '</g>';
  if (x.tal) s += '<g transform="translate(235 24) rotate(-6)">' + kfCedula(0, 0, d.ar, .9) + '</g>';
  /* az üres kassza, a fedelén Zsivány táblája (a szabály az első mozdulat előtt látszik) */
  s += kfKassza(100, 150, .74, FP_URES, x.vilagit);
  s += '<g transform="translate(98 128) rotate(-2)"><g filter="url(#lt-firka)"><rect x="-80" y="-19" width="160" height="38" rx="5" fill="#fffaf0" stroke="#b5804a" stroke-width="1.8"/></g>' +
       '<circle cx="-72" cy="-12" r="2" fill="#b5804a"/><circle cx="72" cy="-12" r="2" fill="#b5804a"/>' +
       zsSzoveg(0, -3, "Üres a kasszám!", 14, "#b35f28", "middle") + zsSzoveg(0, 13, "Pontosan fizess!", 13, "#4a3b7a", "middle") + '</g>';
  /* az ugró-szalag: ① mindig · ② 2 hiba után · Odú-küszöb: csak az indoklásnál */
  var szalag = x.lep === "ok" || !x.halvany && (d.forma === "egyforma" || x.hib >= 2);
  if (szalag) s += fpSzalag(JL, x);
  /* a pult: kockás terítő (ide kerülnek az érmék) */
  s += '<rect class="jl-hely" data-hely="pult" x="6" y="240" width="176" height="92" rx="12" fill="#fdeeee" stroke="' + (aktiv ? "#d98c8c" : "#efc9c9") + '" stroke-width="2"' + (aktiv ? ' stroke-dasharray="6 5"' : '') + '/>';
  for (var cx = 26; cx < 180; cx += 26) s += '<path d="M' + cx + ' 242V330" stroke="#f6c9c9" stroke-width="9" opacity=".55" pointer-events="none"/>';
  for (var cy = 258; cy < 330; cy += 26) s += '<path d="M8 ' + cy + 'H180" stroke="#f6c9c9" stroke-width="9" opacity=".55" pointer-events="none"/>';
  x.pult.forEach(function (j, k) {
    if (x.fog === j) return;
    var P = FP_PULT(k);
    s += kfTaller(P[0], P[1], d.erszeny[j], .85, aktiv ? ' class="jl-fog" data-fog="p-' + j + '" data-m=".85"' : '');
  });
  if (x.hib >= 2 && x.pult.length && x.lep !== "ok") s += zsSzoveg(178, 236, "kint: " + tallerOsszeg(fpPultErmek(x)), 14, "#8a7a9e", "end");   /* a pult széle (2 hiba után) */
  if (aktiv) s += zsGomb(238, 286, 84, "fizet", "Fizetek", "#3f9e6a");
  /* az erszény: minden érme látszik, a helyük állandó (index szerint), a visszalebegők a pultról jönnek */
  s += '<rect class="zs-erszeny-hely" x="60" y="338" width="170" height="92" fill="transparent"/>' + kfErszeny(34, 428, .8, "");
  d.erszeny.forEach(function (v, j) {
    if (x.pult.indexOf(j) >= 0 || x.fog === j) return;
    var E = FP_ERSZ(j), k = x.lebeg ? x.lebeg.indexOf(j) : -1, c = kfTaller(E[0], E[1], v, .85, aktiv ? ' class="jl-fog" data-fog="p-' + j + '" data-m=".85"' : '');
    if (k >= 0) { var P = FP_PULT(k); c = zsLebeg(P[0] - E[0], P[1] - E[1], c); }
    s += c;
  });
  if (x.lep === "mas" && !JL.lezart) s += zsGomb(256, 404, 62, "tovabb", "Tovább", "#7a5ca8");
  return s;
}
/* az ugró-szalag 0-tól: a cédula (az ár) rózsaszín jellel áll rajta; a pultra tett érmék a nagyobbtól ugranak (ív, az érme az ív tetején).
   Indoklásnál (ok) a címlet minden megállója koppintható pötty. Szám csak a 0-nál és a kerek tízeseknél. */
function fpSzalag(JL, x) {
  var d = x.d, t = x.lep === "ok" ? [] : fpPultErmek(x), S = tallerOsszeg(t), c = d.cim || 5;
  var hi = Math.ceil(Math.max(d.ar + (d.forma === "egyforma" ? c : 4), S) / 10) * 10, x0 = 16, x1 = 276, e = (x1 - x0) / hi, Y = 216, i, s = '';
  var px = function (n) { return x0 + n * e; };
  s += '<path d="M' + x0 + ' ' + Y + 'H' + x1 + '" stroke="#c9b48a" stroke-width="5" stroke-linecap="round"/>';
  for (i = 0; i <= hi; i++) { var tz = i % 10 === 0; if (e >= 3.5 || tz) s += '<path d="M' + pcF(px(i)) + ' ' + (Y - (tz ? 8 : 4)) + 'V' + (Y + (tz ? 8 : 4)) + '" stroke="#a8936a" stroke-width="' + (tz ? 2 : 1.1) + '"/>'; if (tz && (hi <= 50 || i % 20 === 0 || i === hi)) s += zsSzoveg(pcF(px(i)), Y + 20, String(i), 11, "#5f84b0", "middle"); }
  /* a cédula jele: szaggatott rózsaszín vonal, fölötte az ár */
  s += '<path d="M' + pcF(px(d.ar)) + ' ' + (Y - 30) + 'V' + (Y + 6) + '" stroke="#e0417a" stroke-width="2" stroke-dasharray="3 3"/>' +
       '<rect x="' + pcF(px(d.ar) - 13) + '" y="' + (Y - 44) + '" width="26" height="15" rx="3" fill="#fffef6" stroke="#e0417a" stroke-width="1.4"/>' + zsSzoveg(pcF(px(d.ar)), Y - 32.5, String(d.ar), 11, "#e0417a", "middle");
  if (x.lep === "ok") {   /* a címlet megállói: halvány ugrások + koppintható pöttyök */
    for (i = 0; i + c <= hi; i += c) s += '<path d="M' + pcF(px(i)) + ' ' + (Y - 3) + 'Q' + pcF(px(i + c / 2)) + ' ' + (Y - 18) + ' ' + pcF(px(i + c)) + ' ' + (Y - 3) + '" fill="none" stroke="#c9b6dc" stroke-width="1.6"/>';
    for (i = 0; i <= hi; i += c) { var val = x.okVal.indexOf(i) >= 0; s += '<g class="fp-megallo" data-v="' + i + '" style="cursor:pointer"><circle cx="' + pcF(px(i)) + '" cy="' + Y + '" r="11" fill="transparent"/><circle cx="' + pcF(px(i)) + '" cy="' + Y + '" r="' + (val ? 7 : 5.5) + '" fill="' + (val ? "#e0417a" : "#fffaf0") + '" stroke="#7a5ca8" stroke-width="2"/></g>'; }
    return s;
  }
  var p = 0;
  t.forEach(function (v, k) {
    var a = px(p), b = px(p + v), cy = Y - 8 - Math.min(26, 6 + v * e * .3);
    s += '<path d="M' + pcF(a) + ' ' + (Y - 4) + 'Q' + pcF((a + b) / 2) + ' ' + pcF(cy) + ' ' + pcF(b) + ' ' + (Y - 4) + '" fill="none" stroke="' + (k % 2 ? "#5f92d0" : "#f2708f") + '" stroke-width="2.6" stroke-linecap="round"/>';
    s += kfTaller((a + b) / 2, (Y - 4 + cy) / 2 - 4, v, .5, '');
    p += v;
  });
  if (t.length) s += '<path d="M' + pcF(px(p)) + ' ' + (Y + 4) + 'l-6 11h12Z" fill="#7a5ca8"/>';   /* ide ért a szalag (szám nélkül) */
  return s;
}

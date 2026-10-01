/* ============ 6h) 🧺 TÜNDÉRVÁSÁR — szöveges szorzás-osztás (🌅 Reggeli vásár 3. o. · ☀️ Déli vásár 4. o.) ============
   Terv: Matekos\szoveges-szorzas-osztas-rendszerterv.html · rajz: tunderevasar-rajzterv.html · tartalom: tunderevasar-tartalom.html
   Egy pálya: Rajt → 🧺 Kosárrakó → 📦 Dobozoló → 🏷️ Árcédula → ⚖️ Hasonlító pult → 🎪 Nagy vásár → 🚪 Odú-küszöb (constants.js vsPalya).
   Állomás-cfg: { tipus: "vasar", stand, g (3 / 4), darab }. Egy standon a sablonok sorrendje a VS_SOR-ból (a Dobozoló
   egy történet három kérdéssel, a Hasonlító pult és a 3. o. Nagy vására kontraszt-pár — ugyanaz a történet, egyszer -szor, egyszer -val).
   Minden sablon a feladattal együtt legyártja: a füzet-sorokat, a RÉSZEREDMÉNYEKET („jó lépés”, nem hiba), a CSAPDA-számokat
   + mondatot (tiszta csapda: ha ütközne, új számok), és a VÉGIGVEZETÉS lépéseit.
   Segítés: részeredmény → sárga „jó lépés”, a füzetbe beíródik, ugyanaz a kérdés · 1. rossz → csapda-mondat (néha kép / 🔀🏷️ mozgókép)
   · 2. rossz → a mozgókép a feladat számaival (ha ennél a feladatnál még nem volt) → lépésenkénti végigvezetés → ugyanaz a kérdés újra.
   📓 Füzet: MINDEN feladat megoldása beíródik (a konyvtar-fuzet.js lapja), és a zöld „Tovább ▶” gombig marad (Enter is) —
   a Bagolykönyvtár 2,2 mp-es automatikus továbblépése itt szándékosan NINCS (producer, 2026-09-30).
   Szereplők: a közös FIGURA-tábla (constants.js). Mozgóképek: vasar-mozgo.js. */

/* ── áruk és tartók (tartalom-lap „Toldalékok”): n = alanyeset, t = tárgyeset, ja = „-ja van”, nak = részeshatározó,
      hoz = „1 ceruzához”, ert = „a ceruzáért”; szem = „18 szem eper”; ember = élő (aki, nem ami) ── */
var VS_ARU = {
  alma:    { e: "🍎", n: "alma", t: "almát", ja: "almája", nak: "almának", hoz: "almához" },
  korte:   { e: "🍐", n: "körte", t: "körtét", ja: "körtéje", nak: "körtének", hoz: "körtéhez" },
  szolo:   { e: "🍇", n: "szőlő", t: "szőlőt", ja: "szőlője", nak: "szőlőnek", hoz: "szőlőhöz" },
  sajt:    { e: "🧀", n: "sajt", t: "sajtot", ja: "sajtja", nak: "sajtnak", hoz: "sajthoz" },
  tojas:   { e: "🥚", n: "tojás", t: "tojást", ja: "tojása", nak: "tojásnak", hoz: "tojáshoz" },
  suti:    { e: "🍪", n: "süti", t: "sütit", ja: "sütije", nak: "sütinek", hoz: "sütihez" },
  eper:    { e: "🍓", n: "eper", t: "epret", ja: "epre", nak: "epernek", hoz: "eperhez", szem: true },
  cukor:   { e: "🍬", n: "cukor", t: "cukrot", ja: "cukra", nak: "cukornak", hoz: "cukorhoz", ert: "cukorért", szem: true },
  dio:     { e: "🌰", n: "dió", t: "diót", ja: "diója", nak: "diónak", hoz: "dióhoz", szem: true },
  gomb:    { e: "🔘", n: "gomb", t: "gombot", ja: "gombja", nak: "gombnak", hoz: "gombhoz", ert: "gombért" },
  kanal:   { e: "🥄", n: "kanál", t: "kanalat", ja: "kanala", nak: "kanálnak", hoz: "kanálhoz", ert: "kanálért" },
  tanyer:  { e: "🍽️", n: "tányér", t: "tányért", ja: "tányérja", nak: "tányérnak", hoz: "tányérhoz" },
  dinnye:  { e: "🍉", n: "dinnye", t: "dinnyét", ja: "dinnyéje", nak: "dinnyének", hoz: "dinnyéhez" },
  lufi:    { e: "🎈", n: "lufi", t: "lufit", ja: "lufija", nak: "lufinak", hoz: "lufihoz", ert: "lufiért" },
  ceruza:  { e: "✏️", n: "ceruza", t: "ceruzát", ja: "ceruzája", nak: "ceruzának", hoz: "ceruzához", ert: "ceruzáért" },
  radir:   { e: null, n: "radír", t: "radírt", ja: "radírja", nak: "radírnak", hoz: "radírhoz", ert: "radírért" },
  zaszlo:  { e: "🚩", n: "zászló", t: "zászlót", ja: "zászlója", nak: "zászlónak", hoz: "zászlóhoz" },
  nyaloka: { e: "🍭", n: "nyalóka", t: "nyalókát", ja: "nyalókája", nak: "nyalókának", hoz: "nyalókához", ert: "nyalókáért" },
  kalap:   { e: "👒", n: "kalap", t: "kalapot", ja: "kalapja", nak: "kalapnak", hoz: "kalaphoz" },
  kosarka: { e: "🧺", n: "kosár", t: "kosarat", ja: "kosara", nak: "kosárnak", hoz: "kosárhoz" },
  kancso:  { e: "🏺", n: "kancsó", t: "kancsót", ja: "kancsója", nak: "kancsónak", hoz: "kancsóhoz" },
  tok:     { e: "🎃", n: "tök", t: "tököt", ja: "töke", nak: "töknek", hoz: "tökhöz" },
  utas:    { e: "🧑", n: "utas", t: "utast", ja: "utasa", nak: "utasnak", hoz: "utashoz", ember: true },
  vevo:    { e: "🧑", n: "vásárló", t: "vásárlót", ja: "vásárlója", nak: "vásárlónak", hoz: "vásárlóhoz", ember: true }
};
var VS_TARTO = {
  kosar:  { n: "kosár", t: "kosarat", k: "kosarak", kat: "kosarakat", ba: "kosárba", ban: "kosárban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  doboz:  { n: "doboz", t: "dobozt", k: "dobozok", kat: "dobozokat", ba: "dobozba", ban: "dobozban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  talca:  { n: "tálca", t: "tálcát", k: "tálcák", kat: "tálcákat", ba: "tálcára", ban: "tálcán", mind: "Mindegyiken", mindbe: "mindegyikre" },
  tal:    { n: "tál", t: "tálat", k: "tálak", kat: "tálakat", ba: "tálba", ban: "tálban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  zacsko: { n: "zacskó", t: "zacskót", k: "zacskók", kat: "zacskókat", ba: "zacskóba", ban: "zacskóban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  lada:   { n: "láda", t: "ládát", k: "ládák", kat: "ládákat", ba: "ládába", ban: "ládában", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  csomag: { n: "csomag", t: "csomagot", k: "csomagok", kat: "csomagokat", ba: "csomagba", ban: "csomagban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  kocsi:  { n: "kocsi", t: "kocsit", k: "kocsik", kat: "kocsikat", ba: "kocsiba", ban: "kocsiban", mind: "Mindegyikben", mindbe: "mindegyikbe" },
  pad:    { n: "pad", t: "padot", k: "padok", kat: "padokat", ba: "padra", ban: "padon", mind: "Mindegyiken", mindbe: "mindegyikre" }
};
for (var vsTk in VS_TARTO) VS_TARTO[vsTk].cls = vsTk;
/* áru + tartó párok (Kosárrakó, Dobozoló) */
var VS_PAROK = [["alma", "kosar"], ["tojas", "talca"], ["eper", "tal"], ["dio", "zacsko"], ["gomb", "csomag"], ["korte", "lada"], ["suti", "doboz"], ["sajt", "doboz"], ["cukor", "zacsko"]];
var VS_VEVOK = ["mia", "brumi", "cincin", "brekus", "kata", "potyi", "tas", "kitti"];   /* Sün Samu, Pali, Juli nem vásárol (tartalom-lap) */
var VS_SZOROS = { 2: "kétszerese", 3: "háromszorosa", 4: "négyszerese", 5: "ötszöröse", 6: "hatszorosa", 7: "hétszerese", 8: "nyolcszorosa", 9: "kilencszerese" };
var VS_RESZE = { 2: "fele", 3: "harmada", 4: "negyede" };
var VS_F = 'font-family="Fredoka,Segoe UI,sans-serif"';

/* ── véletlen, ragok, kiejtés ── */
function vsR(a, b) { return veletlen(a, b); }
function vsE(t) { return t[veletlen(0, t.length - 1)]; }
function vsMax(g) { return g >= 4 ? 9999 : 100; }
function vsVevok(db) { return mKever(VS_VEVOK).slice(0, db).map(function (k) { return FIGURA[k]; }); }
function vsDb(n, A, eset) { return n + " " + (A.szem ? "szem " : "") + A[eset || "n"]; }   /* „18 szem epret” */
function vsSzem(A) { return A.szem ? "szem " : ""; }
function vsAz(szo) { return (/^[aáeéiíoóöőuúüű]/i.test(szo) ? "az " : "a ") + szo; }             /* „az alma”, „a szőlő” */
function vsAzN(szo) { var s = vsAz(szo); return s.charAt(0).toUpperCase() + s.slice(1); }
function vsSzorosT(k) { return VS_SZOROS[k].replace(/e$/, "ét").replace(/a$/, "át"); }          /* „négyszeresét” */
function vsAt(n) { return mAz(n) + " " + ekRag(n, "t"); }                                           /* „a 4-et”, „az 5-öt” */
/* 3. o.-ban a kulcsszó színes (rajzterv B): lila = -szor / fele, zöld = -val több / kevesebb */
function vsKw(t, fajta, g) { return g < 4 ? '<span class="vs-kw-' + fajta + '">' + t + '</span>' : t; }
function vsKiejt(s) {
  return ekKiejt(ekSima(s).replace(/[🦔✋🔀📦🏷️❓]/g, "")
    .replace(/ kg-mal/g, " kilogrammal").replace(/ kg-ot/g, " kilogrammot").replace(/ kg(?=[\s.,!?:)]|$)/g, " kilogramm")
    .replace(/ m-rel/g, " méterrel").replace(/ dl-rel/g, " deciliterrel").replace(/ km-rel/g, " kilométerrel").replace(/ dl(?=[\s.,!?:)]|$)/g, " deciliter").replace(/ km-t/g, " kilométert").replace(/ km(?=[\s.,!?:)]|$)/g, " kilométer"));
}

/* ═════════════════ KÉPEK (a rajzterv 3. része: minden feladatnak van képe; 3. o.-ban megszámolható) ═════════════════ */
var VS_RADIR_SVG = function (x, y, s) {   /* a radírnak nincs emojija — saját rajz (rózsaszín-kék) */
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ') rotate(-12)"><rect x="-15" y="-9" width="30" height="18" rx="4" fill="#f6a5c0" stroke="#b85a80" stroke-width="1.5"/><rect x="2" y="-9" width="13" height="18" rx="3" fill="#9ec9f0" stroke="#4f86b8" stroke-width="1.5"/></g>';
};
/* egy tárgy az SVG-ben: emoji, vagy (radír) saját rajz; x, y = alsó közép */
function vsTargy(A, x, y, meret) {
  if (!A.e) return VS_RADIR_SVG(x, y - meret * .35, meret / 30);
  return '<text x="' + x + '" y="' + y + '" font-size="' + meret + '" text-anchor="middle">' + A.e + '</text>';
}
function vsTargyHTML(A) { return A.e || '<svg viewBox="-18 -14 36 28" width="34" height="26" aria-hidden="true">' + VS_RADIR_SVG(0, 0, 1) + '</svg>'; }
function vsSvg(w, h, belso, cls) { return '<svg class="vs-svg' + (cls ? " " + cls : "") + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + belso + '</svg>'; }
function vsCimke(x, y, t, o) {
  o = o || {}; var w = Math.max(38, String(t).length * 9 + 16);
  return '<rect x="' + (x - w / 2) + '" y="' + (y - 15) + '" width="' + w + '" height="26" rx="9" fill="' + (o.ures ? "#fff" : "#fffaf0") + '" stroke="' + (o.szin || "#a9814e") + '" stroke-width="1.8"' + (o.ures ? ' stroke-dasharray="5 3"' : '') + '/>' +
    '<text x="' + x + '" y="' + (y + 4) + '" font-size="16" ' + VS_F + ' fill="' + (o.ures ? "#b85a80" : "#4a3b7a") + '" text-anchor="middle" font-weight="700">' + t + '</text>';
}
/* tartó-alakok (100 széles, 0–125 magas; a tartalom a 44–112 sávban) */
function vsTartoAlak(fajta, ures) {
  var sz = ures ? ' stroke-dasharray="6 4" opacity=".75"' : '';
  switch (fajta) {
    case "kosar": return '<path d="M6 58 L94 58 L84 118 L16 118 Z" fill="' + (ures ? "#fff" : "#e3b777") + '" stroke="#a9814e" stroke-width="2"' + sz + '/><path d="M16 58 Q50 10 84 58" stroke="#a9814e" stroke-width="4" fill="none"' + sz + '/>' + (ures ? '' : '<path d="M12 80 L88 80 M14 100 L86 100" stroke="#c99a5c" stroke-width="2"/>');
    case "doboz": return '<path d="M8 50 L92 50 L92 118 L8 118 Z" fill="' + (ures ? "#fff" : "#f2d3a8") + '" stroke="#b87a45" stroke-width="2"' + sz + '/><path d="M8 50 L-4 36 L80 36 L92 50" fill="' + (ures ? "#fff" : "#f7dfbc") + '" stroke="#b87a45" stroke-width="2"' + sz + '/>';
    case "talca": return '<path d="M2 104 L98 104 L92 118 L8 118 Z" fill="' + (ures ? "#fff" : "#9ec9f0") + '" stroke="#4f86b8" stroke-width="2"' + sz + '/>';
    case "tal": return '<path d="M4 78 Q50 140 96 78 Z" fill="' + (ures ? "#fff" : "#c9e6c0") + '" stroke="#5e9a52" stroke-width="2"' + sz + '/>';
    case "zacsko": return '<path d="M16 50 L84 50 L92 118 L8 118 Z" fill="' + (ures ? "#fff" : "#f3ecfb") + '" stroke="#8f7ab8" stroke-width="2"' + sz + '/><path d="M16 50 L30 40 L70 40 L84 50" fill="none" stroke="#8f7ab8" stroke-width="2"' + sz + '/>';
    case "lada": return '<rect x="4" y="52" width="92" height="66" rx="3" fill="' + (ures ? "#fff" : "#d9a66a") + '" stroke="#8a5a36" stroke-width="2"' + sz + '/>' + (ures ? '' : '<path d="M4 74 H96 M4 96 H96" stroke="#b9854c" stroke-width="3"/>');
    case "csomag": return '<rect x="8" y="50" width="84" height="68" rx="6" fill="' + (ures ? "#fff" : "#fce49a") + '" stroke="#c9953a" stroke-width="2"' + sz + '/>' + (ures ? '' : '<path d="M50 50 V118 M8 84 H92" stroke="#e2589b" stroke-width="3"/>');
    case "kocsi": return '<rect x="4" y="48" width="92" height="58" rx="8" fill="' + (ures ? "#fff" : "#9ec9f0") + '" stroke="#4f86b8" stroke-width="2"' + sz + '/><circle cx="24" cy="112" r="8" fill="#4a3b7a"' + (ures ? ' opacity=".5"' : '') + '/><circle cx="76" cy="112" r="8" fill="#4a3b7a"' + (ures ? ' opacity=".5"' : '') + '/>';
    case "pad": return '<rect x="2" y="96" width="96" height="10" rx="3" fill="' + (ures ? "#fff" : "#c99b6d") + '" stroke="#8a5a36" stroke-width="2"' + sz + '/><path d="M10 106 V122 M90 106 V122" stroke="#8a5a36" stroke-width="4"' + sz + '/>';
  }
  return "";
}
/* db darab emoji a tartóban, megszámolhatóan */
function vsTartalom(fajta, A, db) {
  if (!db) return "";
  var cols = db <= 3 ? db : (db <= 6 ? 3 : (db <= 8 ? 4 : 5)), sorok = Math.ceil(db / cols), m = sorok > 2 || cols > 4 ? 17 : 21;
  var alj = fajta === "talca" || fajta === "pad" ? 100 : (fajta === "tal" ? 96 : 112), s = "";
  for (var j = 0; j < db; j++) {
    var c = j % cols, r = Math.floor(j / cols), x = 50 + (c - (cols - 1) / 2) * (m + 1);
    s += vsTargy(A, x, alj - (sorok - 1 - r) * (m + 1) - 4, m);
  }
  return s;
}
/* n tartó egy sorban; db (megszámolható) vagy felirat (4. o.); o.utolsoUres: az utolsó szaggatott; sok tartónál 4 + „× n” */
function vsTartokKep(n, fajta, A, db, felirat, o) {
  o = o || {};
  var sok = n > 9, rajz = sok ? 4 : n, W = rajz * 114 - 14 + (sok ? 110 : 0), s = "";
  for (var i = 0; i < rajz; i++) {
    var ures = o.utolsoUres && i === rajz - 1, d = o.dbLista ? o.dbLista[i] : db;
    s += '<g transform="translate(' + (i * 114) + ',0)">' + vsTartoAlak(fajta, ures) +
      (felirat != null && !ures ? vsCimke(50, 84, felirat, {}) : vsTartalom(fajta, A, d)) + '</g>';
  }
  if (sok) s += '<text x="' + (rajz * 114 + 40) + '" y="92" font-size="26" ' + VS_F + ' fill="#6a4fa8" text-anchor="middle" font-weight="700">…</text><text x="' + (rajz * 114 + 50) + '" y="118" font-size="17" ' + VS_F + ' fill="#6a4fa8" text-anchor="middle" font-weight="700">' + n + ' db</text>';
  return vsSvg(W, 128, s);
}
/* kupac: 3. o.-ban megszámolható (≤ 60), különben néhány darab + felirat */
function vsKupac(A, n, g, cimke) {
  var s = "", szamolhato = g < 4 && n <= 60, per = n > 36 ? 12 : (n > 16 ? 10 : 8), db = szamolhato ? n : 9, sor = Math.ceil(db / per), W = per * 22 + 10;
  for (var i = 0; i < db; i++) s += vsTargy(A, 16 + (i % per) * 22, 26 + Math.floor(i / per) * 24, 20);
  var y = sor * 24 + 26;
  s += vsCimke(W / 2, y, cimke || vsDb(n, A));
  return vsSvg(W, y + 16, s);
}
/* árcédula a tárgyak sora fölött (rajzterv „arcedula”): n tárgy, egy közös cédula; ures = szaggatott „? Ft” */
function vsCedula(x, y, txt, ures) {
  var w = Math.max(58, String(txt).length * 9 + 12);
  return '<g transform="translate(' + (x - w / 2) + ',' + y + ')"><path d="M0 0 L' + w + ' 0 L' + (w + 12) + ' 14 L' + w + ' 28 L0 28 Z" fill="' + (ures ? "#fff" : "#fde8f2") + '" stroke="#b85a80" stroke-width="2"' + (ures ? ' stroke-dasharray="5 3"' : '') + '/><circle cx="' + (w + 2) + '" cy="14" r="3" fill="#b85a80"/><text x="' + (w / 2) + '" y="20" font-size="15" ' + VS_F + ' fill="#7a2e55" text-anchor="middle" font-weight="700">' + txt + '</text></g>';
}
function vsCedulaSor(A, n, ar, ures, alcim) {
  var rajz = Math.min(n, 8), w = 34, W = Math.max(rajz * w + 16, 110), x0 = (W - rajz * w) / 2, s = "";
  for (var i = 0; i < rajz; i++) s += vsTargy(A, x0 + i * w + 17, 86, 28);
  if (rajz > 1) s += '<path d="M' + (x0 + 4) + ' 54 q0 -10 10 -10 L' + (x0 + rajz * w - 14) + ' 44 q10 0 10 10" stroke="#b85a80" stroke-width="2" fill="none"/>';
  s += vsCedula(W / 2, 8, ar, ures);
  s += '<text x="' + (W / 2) + '" y="112" font-size="13" ' + VS_F + ' fill="#8a7ba8" text-anchor="middle">' + (alcim || (n + " " + (A.szem ? "szem" : "db"))) + '</text>';
  return vsSvg(W, 120, s);
}
/* szalag-ábra (rajzterv): sorok = [{ nev, d: [[érték, szín, felirat], …], vege }] */
function vsSzalag(sorok, egyseg) {
  var maxE = 0;
  sorok.forEach(function (r) { var t = 0; r.d.forEach(function (x) { t += x[0]; }); maxE = Math.max(maxE, t); });
  var u = egyseg || Math.min(24, 300 / Math.max(1, maxE)), s = "", W = Math.max(460, Math.ceil(100 + maxE * u + 70));
  sorok.forEach(function (r, i) {
    var y = 8 + i * 44, x = 100;
    s += '<text x="92" y="' + (y + 21) + '" font-size="14" ' + VS_F + ' fill="#4a3b7a" text-anchor="end" font-weight="600">' + r.nev + '</text>';
    r.d.forEach(function (x0) {
      var w = x0[0] * u;
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="6" fill="' + x0[1] + '" stroke="#fff" stroke-width="2"/>' +
        (x0[2] !== "" ? '<text x="' + (x + w / 2) + '" y="' + (y + 20) + '" font-size="14" ' + VS_F + ' fill="#3b2f5e" text-anchor="middle" font-weight="700">' + (x0[2] == null ? x0[0] : x0[2]) + '</text>' : '');
      x += w;
    });
    if (r.vege) s += '<text x="' + (x + 8) + '" y="' + (y + 21) + '" font-size="15" ' + VS_F + ' fill="#6a4fa8" font-weight="700">' + r.vege + '</text>';
  });
  return vsSvg(W, sorok.length * 44 + 10, s, "szeles").replace('<svg ', '<svg style="height:calc(' + sorok.length + ' * min(46px, 7.4vh) + 6px)" ');
}
/* szereplő-érem (HTML); ki = név, hogy Tüske néni rámutathasson */
function vsErem(e, sz, c, ki) {
  if (sz === "?") e = figArcCsere(e, "gondol");   /* a „?”-es szereplő gondolkodik (figurak.js) */
  return '<div class="ek-erem vs-erem"' + (ki ? ' data-ki="' + ki + '"' : '') + '><div class="e">' + e + '</div>' +
    (sz == null ? '' : '<div class="sz' + (sz === "?" ? ' q' : '') + '">' + sz + '</div>') + (c ? '<div class="c">' + c + '</div>' : '') + '</div>';
}
var VS_NYIL = '<div class="vs-nyil">→</div>';
/* a Dobozoló képe: kupac + minta-tartó „b fér bele”; KELL-csapdánál a teli tartók + a félig teli utolsó */
function vsDobozKep(D, g, telik) {
  if (D.fajta === "kocsi") {
    var s = '<text x="60" y="30" font-size="15" ' + VS_F + ' fill="#4a3b7a" text-anchor="middle" font-weight="700">' + D.n + ' utas</text>';
    for (var i = 0; i < 14; i++) s += '<text x="' + (14 + (i % 7) * 15) + '" y="' + (54 + Math.floor(i / 7) * 20) + '" font-size="15" text-anchor="middle">🧑</text>';
    s += '<text x="60" y="104" font-size="12" ' + VS_F + ' fill="#8a7ba8" text-anchor="middle">…és még sokan</text>' +
      '<line x1="130" y1="112" x2="440" y2="112" stroke="#a9814e" stroke-width="3"/><text x="165" y="100" font-size="50" text-anchor="middle">🚂</text>' +
      '<g transform="translate(205,0)">' + vsTartoAlak("kocsi") + vsCimke(50, 78, D.b + " hely") + '</g><g transform="translate(320,0)">' + vsTartoAlak("kocsi", true) + '<text x="50" y="84" font-size="22" ' + VS_F + ' fill="#4f86b8" text-anchor="middle">?</text></g>';
    return vsSvg(440, 126, s);
  }
  if (telik && (g >= 4 || D.b > 10)) {             /* 4. o.: nem lehet kirajzolni mind — 3 teli felirattal + a félig teli */
    return vsTartokKep(3, D.T.cls, D.A, 0, String(D.b), { dbLista: [0, 0, 0] }) + VS_NYIL + vsSvg(114, 128, vsTartoAlak(D.T.cls, true) + vsCimke(50, 84, String(D.r), { ures: true })) +
      '<div class="vs-kep-al">' + D.q + ' teli ' + D.T.n + ' — és ' + mAz(D.r) + ' ' + vsDb(D.r, D.A, "nak") + ' is kell egy!</div>';
  }
  if (telik) {                                    /* KELL-csapda: q teli + az utolsó félig (szaggatott) */
    var L = []; for (var j = 0; j < Math.min(D.q, 8); j++) L.push(D.b <= 10 && g < 4 ? D.b : 0);
    L.push(D.b <= 10 && g < 4 ? D.r : 0);
    var fel = g < 4 && D.b <= 10 ? null : String(D.b);
    return vsTartokKep(L.length, D.T.cls, D.A, 0, fel, { dbLista: L, utolsoUres: true }) + '<div class="vs-kep-al">' + vsDb(D.r, D.A, "nak") + ' is kell ' + D.T.n + '!</div>';
  }
  return vsKupac(D.A, D.n, g) + VS_NYIL + vsSvg(114, 128, vsTartoAlak(D.T.cls) + vsCimke(50, 84, D.b + " fér")) + '<div class="vs-kep-al">egy ' + D.T.ba + ' ' + D.b + ' fér</div>';
}

/* ═════════════════ FELADAT-ÉPÍTŐ ═════════════════
   o: { sablon, kep: [html…], tort: [mondat…], kerdes, helyes, mit, sorok: [str | {h, cimk, cls}], valasz,
        resz: [[szám, mondat, füzet-sor index, rámutat]], csap: [[szám, mondat, fajta, {kep, mozgo, mutat}]],
        vezet: [[kérdés, helyes, füzet-sor index | null]], mozgo: {klip, o}, kulcs } */
function vsFel(g, o) {
  var M = vsMax(g), H = o.helyes;
  if (!(H >= 0) || H % 1 || H > M) return null;
  var foglalt = {}, csap = {}, resz = {}, hiba = false;
  foglalt[H] = 1;
  (o.resz || []).forEach(function (r) {
    var n = r[0]; if (n == null) return;
    if (foglalt[n] || n < 0 || n % 1 || n > M) { hiba = true; return; }
    foglalt[n] = 1; resz[n] = { m: r[1], sor: r[2], mutat: r[3] };
  });
  (o.csap || []).forEach(function (c) {
    var n = c[0]; if (n == null || n < 0 || n % 1 || n > M * 10) return;
    if (foglalt[n]) { hiba = true; return; }          /* tiszta csapda: minden szám egyetlen gondolatot jelent */
    var x = c[3] || {};
    foglalt[n] = 1; csap[n] = { m: c[1], t: c[2] || "egyeb", kep: x.kep, mozgo: !!x.mozgo, mutat: x.mutat };
  });
  if (hiba) return null;
  var szamok = (ekSima(o.tort.join(" ") + " " + o.kerdes).match(/\d+/g) || []).map(Number);
  (o.vezet || []).forEach(function (v) { szamok.push(v[1]); (ekSima(v[0]).match(/\d+/g) || []).forEach(function (d) { szamok.push(+d); }); });
  if (szamok.some(function (n) { return n > M; })) return null;   /* számkör-őr: 3. o. ≤ 100, 4. o. < 10 000 */
  var kep = (o.kep || []).join("");
  var V = { g: g, sablon: o.sablon, sorok: o.sorok.map(function (s) { return typeof s === "string" ? { h: s } : s; }), mit: o.mit, valasz: o.valasz,
    csap: csap, resz: resz, vezet: o.vezet || null, mozgo: o.mozgo || null, mozgoVolt: false, bub: { kep: kep, tort: o.tort, kerdes: o.kerdes },
    fIrt: -1, fMit: false };
  return { csalad: "egyenkent", nagySzam: g >= 4, jegyMax: g >= 4 ? 5 : 3, vs: V,
    kartyaHTML: vsBub({ kep: kep, tort: o.tort, kerdes: o.kerdes }),
    szoveg: ekSima(o.kerdes), felolvas: vsKiejt(o.tort.join(" ") + " " + o.kerdes),
    helyes: H, keplet: "", megoldas: V.sorok.map(function (s) { return ekSima(s.h); }).join(", "), tipp: "", lanc: null, kulcs: o.kulcs,
    naplo: { tipus: "vs-" + o.sablon, kerdes: ekSima(o.kerdes).slice(0, 60), helyes: H, atlepes: false } };
}
/* a kép-darabok EGY sorban (nem törnek több sorba), arányosan kicsinyedve; a felirat alatta */
function vsKepBelso(html) {
  var i = html.indexOf('<div class="vs-kep-al">');
  return '<div class="vs-kep-sor">' + (i < 0 ? html : html.slice(0, i)) + '</div>' + (i < 0 ? '' : html.slice(i));
}
function vsBub(o) {
  return '<div class="vs-bub">' + (o.kep ? '<div class="vs-kep">' + vsKepBelso(o.kep) + '</div>' : '') +
    '<div class="vs-tort"><span class="vs-arus" title="Tüske néni">' + figuraSVG("tuske", "gondol", "alak") + '</span><div>' + o.tort.map(function (p) { return '<p>' + p + '</p>'; }).join("") + '</div></div>' +
    '<div class="vs-kk">' + o.kerdes + '</div>' + (o.lepes || '') + '</div>';
}

/* ═════════════════ 🧺 KOSÁRRAKÓ — egy lépés, keverve (K1 szorzás · K2 szétosztás · K3 bennfoglalás) ═════════════════ */
function vsK1(g) {
  var P = vsE(VS_PAROK), A = VS_ARU[P[0]], T = VS_TARTO[P[1]], a, b, negy = g >= 4;
  T.cls = P[1];
  if (!negy) { a = vsR(2, 9); b = vsR(2, 10); }
  else if (vsR(0, 1)) { a = vsR(3, 9); b = vsR(102, Math.min(999, Math.floor(9999 / a))); }
  else { a = vsR(12, 39); b = vsR(12, 99); }
  var h = a * b; if (a === b || h > vsMax(g)) return null;
  var tort = !negy || vsR(0, 1) ? ["Tüske néni " + a + " " + T.t + " rakott tele.", T.mind + " " + vsDb(b, A) + " van."] : [a + " " + T.ban + " egyenként " + vsDb(b, A) + " van."];
  var kerd = "Hány " + vsSzem(A) + A.n + " van összesen?";
  return vsFel(g, { sablon: "K1", kulcs: "K1" + a + "x" + b,
    kep: [negy ? vsTartokKep(a, P[1], A, 0, String(b)) : vsTartokKep(a, P[1], A, b)],
    tort: tort, kerdes: kerd, helyes: h, mit: "hány " + vsSzem(A) + A.n + " összesen",
    sorok: [negy ? b + " · " + a + " = " + h : a + " · " + b + " = " + h], valasz: "Válasz: " + vsDb(h, A) + " van összesen.",
    csap: [[a + b, "Összeadtad " + vsAt(a) + " és " + vsAt(b) + ". De " + a + " " + T.n + " van, és " + T.mind.toLowerCase() + " " + vsDb(b, A) + "! Nézd meg a képet!", "osszead"],
           [b, vsDb(b, A) + " csak egy " + T.ban + " van. Hány van mind " + mAz(a) + " " + a + " " + T.ban + "?", "egy"],
           [a, ekA(a, true) + " a " + T.k + " száma. Mi azt kérdeztük: " + kerd, "masik"]],
    vezet: [["Hány " + T.n + " van?", a, null], ["Egy " + T.ban + " hány " + vsSzem(A) + A.n + " van?", b, null], ["Mennyi " + (negy ? b + " · " + a : a + " · " + b) + "?", h, 0]] });
}
function vsK2(g) {
  var negy = g >= 4, a, b = vsR(2, 9), tal = !negy && vsR(0, 1), P = tal ? vsE([["eper", "tal"], ["dio", "zacsko"], ["alma", "kosar"], ["cukor", "tal"]]) : [vsE(["alma", "sajt", "tojas", "suti", "korte", "gomb"])];
  var A = VS_ARU[P[0]], T = tal ? VS_TARTO[P[1]] : null;
  a = negy ? vsR(12, Math.min(999, Math.floor(9999 / b))) : vsR(2, 10);
  var n = a * b; if (a === b || n > vsMax(g) || (negy && n < 100)) return null;
  var tort, kerd, mit, val, kep;
  if (tal) {
    T.cls = P[1];
    tort = ["Tüske néni " + vsDb(n, A, "t") + " " + b + " " + T.ba + " tesz, " + T.mindbe + " ugyanannyit."];
    kerd = "Hány " + vsSzem(A) + A.n + " kerül egy " + T.ba + "?"; mit = "ami egy " + T.ba + " kerül"; val = "Válasz: egy " + T.ba + " " + vsDb(a, A) + " kerül.";
    kep = [vsKupac(A, n, g), VS_NYIL, vsTartokKep(b, P[1], A, 0, "?")];
  } else {
    tort = [negy ? vsDb(n, A, "t") + " egyenlően szétosztanak " + b + " árus között." : "Tüske néni " + vsDb(n, A, "t") + " egyenlően szétoszt " + b + " kis vásárló között."];
    var ki = negy ? "árus" : "vásárló";
    kerd = "Hány " + vsSzem(A) + A.t + " kap egy " + ki + "?"; mit = "amennyit egy " + ki + " kap"; val = "Válasz: egy " + ki + " " + vsDb(a, A, "t") + " kap.";
    var vk = vsVevok(Math.min(b, 8)).map(function (v) { return '<span class="vs-mini">' + v.e + '<i>?</i></span>'; }).join("");
    kep = [vsKupac(A, n, g), VS_NYIL, '<div class="vs-sor vs-minisor">' + vk + (b > 8 ? '<span class="vs-tobb">… ' + b + ' ' + ki + '</span>' : '') + '</div>'];
  }
  return vsFel(g, { sablon: "K2", kulcs: "K2" + n + "/" + b, kep: kep, tort: tort, kerdes: kerd, helyes: a, mit: mit,
    sorok: [n + " : " + b + " = " + a], valasz: val,
    csap: [[n - b, "Elvettél " + ekRag(b, "t") + ". De " + mAz(n) + " " + vsDb(n, A, "t") + " " + b + " egyforma részre osztjuk!", "kivon"],
           [n, ekA(n, true) + " az összes " + A.n + ". " + (tal ? "Egy " + T.ba + " ennél kevesebb kerül." : "Egy vásárló ennél kevesebbet kap."), "osszes"],
           [n * b, "Ennyi " + A.ja + " nincs is Tüske néninek! Szétosztjuk, nem szorozzuk.", "szoroz"],
           [b, ekA(b, true) + " azt mondja, hány részre osztunk. De mennyi jut egy részre?", "masik"]],
    vezet: [["Hány " + vsSzem(A) + A.t + " osztunk szét?", n, null], ["Hány egyforma részre osztjuk?", b, null], ["Mennyi " + n + " : " + b + "?", a, 0]] });
}
function vsK3(g) {
  var negy = g >= 4, P = vsE(VS_PAROK), A = VS_ARU[P[0]], T = VS_TARTO[P[1]], b = negy ? vsR(3, 9) : vsR(2, 9), a = negy ? vsR(12, Math.min(999, Math.floor(9999 / b))) : vsR(2, 10);
  T.cls = P[1];
  var n = a * b; if (a === b || n > vsMax(g)) return null;
  return vsFel(g, { sablon: "K3", kulcs: "K3" + n + "/" + b,
    kep: [vsKupac(A, n, g), VS_NYIL, vsSvg(114, 128, vsTartoAlak(P[1]) + (negy || b > 10 ? vsCimke(50, 84, String(b)) : vsTartalom(P[1], A, b))), vsTartokKep(Math.min(a, 3), P[1], A, 0, "?", {}).replace('class="vs-svg"', 'class="vs-svg halvany"')],
    tort: ["Tüske néninek " + vsDb(n, A, "ja") + " van.", "Egy " + T.ba + " " + vsDb(b, A) + " kerül."],
    kerdes: "Hány " + T.n + " telik meg?", helyes: a, mit: "hány " + T.n, sorok: [n + " : " + b + " = " + a], valasz: "Válasz: " + a + " " + T.n + " telik meg.",
    csap: [[n - b, "Elvettél " + ekRag(b, "t") + ". De azt nézzük, hány " + T.n + " telik meg!", "kivon"],
           [n, ekA(n, true) + " az összes " + A.n + ". De hány " + T.n + " telik meg?", "osszes"],
           [b, vsDb(b, A) + " megy egy " + T.ba + ". De hány " + T.n + " telik meg?", "egy"]],
    vezet: [["Hány " + vsSzem(A) + A.ja + " van Tüske néninek?", n, null], ["Egy " + T.ba + " hány kerül?", b, null], ["Mennyi " + n + " : " + b + "?", a, 0]] });
}

/* ═════════════════ 📦 DOBOZOLÓ — maradék + „mit kérdeznek?” (egy történet, három kérdés) ═════════════════ */
function vsDobozTort(g) {
  for (var k = 0; k < 400; k++) {
    var negy = g >= 4, fajta = negy ? vsE(["aru", "aru", "aru", "kocsi"]) : vsE(["aru", "aru", "aru", "pad"]), A, T, b, q, r;
    if (fajta === "aru") {
      var P = vsE([["sajt", "doboz"], ["tojas", "talca"], ["suti", "doboz"], ["alma", "kosar"], ["dio", "zacsko"], ["korte", "lada"], ["dinnye", "lada"]]);
      A = VS_ARU[P[0]]; T = VS_TARTO[P[1]]; T.cls = P[1];
      if (!negy) { b = vsR(3, 9); q = vsR(2, 9); }
      else { b = vsR(0, 1) ? vsR(3, 9) : vsR(2, 9) * 10; q = vsR(11, Math.min(400, Math.floor(9000 / b))); }
      if (!negy) q = Math.min(q, 8);
    } else if (fajta === "pad") { A = VS_ARU.vevo; T = VS_TARTO.pad; T.cls = "pad"; b = vsR(3, 6); q = vsR(2, 8); }
    else { A = VS_ARU.utas; T = VS_TARTO.kocsi; T.cls = "kocsi"; b = vsE([120, 150, 180, 200]); q = vsR(3, 9); }
    r = vsR(1, b - 1);
    var n = b * q + r;
    if (n > vsMax(g) || (!negy && n > 90)) continue;
    var L = [q, r, q + 1, b - r, n - b], jo = true;
    for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) if (L[i] === L[j]) jo = false;
    if (!jo) continue;
    return { A: A, T: T, b: b, q: q, r: r, n: n, fajta: fajta };
  }
  return null;
}
function vsD(g, S, kerd) {
  var D = S.tort || (S.tort = vsDobozTort(g));
  if (!D) return null;
  var A = D.A, T = D.T, b = D.b, q = D.q, r = D.r, n = D.n, ember = !!A.ember;
  var tort = D.fajta === "pad" ? ["A vásárra " + n + " vásárló jött.", "Egy padra " + b + " vásárló fér."]
    : D.fajta === "kocsi" ? [n + " utas indul a vásárba.", "Egy kocsiba " + b + " utas fér."]
    : ["Tüske néninek " + vsDb(n, A, "ja") + " van.", "Egy " + T.ba + " " + vsDb(b, A) + " fér."];
  var sor0 = n + " : " + b + " = " + q + ", maradék " + r, o;
  var kiv = [n - b, "Kivontál " + ekRag(b, "t") + ". De itt osztunk: hányszor fér ki " + ekRag(b, "t") + "?", "kivon"];
  if (kerd === "D1") o = { helyes: q, kerdes: "Hány <b>TELI</b> " + T.n + " lesz?", mit: "hány TELI " + T.n, sorok: [sor0], valasz: "Válasz: " + q + " teli " + T.n + " lesz.",
    csap: [[q + 1, (q + 1) + " " + T.n + " kell, hogy mind elférjen — de az utolsó nem lesz tele. Hány TELI " + T.n + " lesz?", "kerekit"],
           [r, ekA(r, true) + " az a " + A.n + ", " + (ember ? "aki" : "ami") + " kimarad. Mi a teli " + T.kat + " kérdeztük.", "masik"], kiv],
    vezet: [["Hány " + vsSzem(A) + A.n + " fér egy " + T.ba + "?", b, null], ["Hány " + T.n + " telik meg, ha egy " + T.ba + " " + b + " fér?", q, 0]] };
  else if (kerd === "D2") o = { helyes: r, kerdes: "Hány " + vsSzem(A) + A.n + " <b>MARAD</b> " + (D.fajta === "pad" ? "állva" : "ki") + "?", mit: "hány " + A.n + " MARAD",
    sorok: [sor0], valasz: "Válasz: " + vsDb(r, A) + " marad " + (D.fajta === "pad" ? "állva" : "ki") + ".",
    csap: [[q, ekA(q, true) + " a teli " + T.k + " száma. Mi azt kérdeztük, hány " + A.n + " marad " + (D.fajta === "pad" ? "állva" : "ki") + ".", "masik"],
           [b - r, "Ennyi férne még az utolsó " + T.ba + ". De hány " + A.n + " marad " + (D.fajta === "pad" ? "állva" : "ki") + "?", "hely"], kiv],
    vezet: [["Hány " + vsSzem(A) + A.n + " fér egy " + T.ba + "?", b, null], ["Hány " + T.n + " telik meg?", q, null], ["Hány " + A.n + " marad ki? " + n + " : " + b + " = " + q + ", maradék ?", r, 0]] };
  else o = { helyes: q + 1, kerdes: "Hány " + T.n + " <b>KELL</b>, hogy " + (ember ? "mindenki " + (D.fajta === "pad" ? "leülhessen" : "elférjen") : "mind elférjen") + "?", mit: "hány " + T.n + " KELL",
    sorok: [sor0, { h: mAz(r) + " " + r + " " + A.nak + " is kell " + T.n + ": " + q + " + 1 = " + (q + 1), cls: "cimkes" }], valasz: "Válasz: " + (q + 1) + " " + T.n + " kell.",
    csap: [[q, q + " " + T.n + " megtelik — de hová " + (ember ? "kerül" : "tesszük") + " a maradék " + vsDb(r, A, ember ? "n" : "t") + "? Hogy " + (ember ? "mindenkinek" : "mind") + " " + (ember ? "jusson hely" : "elférjen") + ", hány " + T.n + " kell?", "kerekit", { kep: vsDobozKep(D, g, true) }],
           [r, ekA(r, true) + " a maradék. De hány " + T.n + " kell?", "masik"], kiv],
    vezet: [["Hány " + T.n + " telik meg, ha egy " + T.ba + " " + b + " fér?", q, null], ["Hány " + A.n + " marad ki?", r, 0], [ekNagy(mAz(r)) + " " + r + " " + A.nak + " is kell " + T.n + ". Hány " + T.n + " kell összesen?", q + 1, 1]] };
  o.sablon = kerd; o.kulcs = kerd + n + "/" + b; o.tort = tort; o.kep = [vsDobozKep(D, g, false)];
  o.mozgo = { klip: "doboz", o: { n: n, b: b, q: q, r: r, A: A, T: T } };
  return vsFel(g, o);
}

/* ═════════════════ 🏷️ ÁRCÉDULA — következtetés egyre ═════════════════ */
function vsA1(g, S, kgE) {
  var negy = g >= 4, kg = kgE != null ? kgE : vsR(0, 2) === 0, A = kg ? VS_ARU[vsE(["korte", "alma", "szolo"])] : VS_ARU[vsE(negy ? ["ceruza", "kanal", "lufi", "gomb"] : ["ceruza", "lufi", "radir", "gomb", "nyaloka"])];
  var a = vsR(2, 9), e = negy ? (vsR(0, 1) ? vsR(2, 99) * 10 : vsR(12, 999)) : vsR(2, 10), T = a * e;
  if (T > vsMax(g) || (!negy && T > 90) || a === e) return null;
  var egy = "1 " + (kg ? "kg " : "") + A.n;
  var tort = kg ? [a + " kg " + A.n + " " + T + " forint."] : [a + " " + A.n + " együtt " + T + " forintba kerül."];
  return vsFel(g, { sablon: kg ? "A1kg" : "A1", kulcs: "A1" + T + "/" + a,
    kep: [vsCedulaSor(A, a, T + " Ft", false, kg ? a + " kg" : null), VS_NYIL, vsCedulaSor(A, 1, "? Ft", true, kg ? "1 kg" : "1 db")],
    tort: tort, kerdes: "Mennyibe kerül " + egy + "?", helyes: e, mit: egy + " ára", sorok: [T + " Ft : " + a + " = " + e + " Ft"],
    valasz: "Válasz: " + egy + " " + e + (kg ? " forint." : " forintba kerül."),
    csap: [[T, ekA(T, true) + " forint " + mAz(a) + " " + a + " " + (kg ? "kg " : "") + A.n + " együtt. " + ekNagy(egy) + " ennél olcsóbb!", "osszes"],
           [T - a, "Elvettél " + ekRag(a, "t") + ". De " + mAz(T) + " " + T + " forintot " + mAz(a) + " " + a + " " + (kg ? "kg " : "") + A.n + " között kell szétosztani!", "kivon", { mozgo: true }],
           [T * a, (T * a) + " forint? Akkor " + egy + " drágább lenne, mint " + a + " együtt!", "szoroz"],
           [T + a, "Összeadtad. De " + egy + " olcsóbb, mint " + a + " együtt!", "osszead"]],
    vezet: [["Mennyibe kerül " + mAz(a) + " " + a + " " + (kg ? "kg " : "") + A.n + " együtt?", T, null], ["A " + T + " forintot " + a + " felé osztjuk. Mennyi " + T + " : " + a + "?", e, 0]],
    mozgo: { klip: "arcedula", o: { T: T, a: a, e: e, A: A, kg: kg } } });
}
function vsA2(g) {
  var negy = g >= 4, V = vsVevok(1)[0], A = VS_ARU[vsE(negy ? ["tanyer", "kanal", "kalap", "ceruza"] : ["lufi", "ceruza", "nyaloka", "gomb"])];
  var e = negy ? (vsR(0, 1) ? vsR(11, 99) * 10 : vsR(101, 999)) : vsR(2, 10), a = vsR(2, 9), h = e * a;
  if (h > vsMax(g) || a === e) return null;
  return vsFel(g, { sablon: "A2", kulcs: "A2" + e + "x" + a,
    kep: [vsCedulaSor(A, 1, e + " Ft", false, "1 db"), VS_NYIL, vsCedulaSor(A, a, "? Ft", true), vsErem(V.e, a + " db", V.n)],
    tort: ["1 " + A.n + " " + e + " forint.", V.tel + " " + a + " " + A.t + " vesz."], kerdes: "Mennyit fizet " + V.n + "?", helyes: h,
    mit: "amit " + V.n + " fizet", sorok: [e + " Ft · " + a + " = " + h + " Ft"], valasz: "Válasz: " + V.n + " " + h + " forintot fizet.",
    csap: [[e + a, "Összeadtad. De " + V.n + " " + a + " " + A.t + " vesz, és mindegyik " + e + " forint!", "osszead"],
           [e, e + " forint csak 1 " + A.n + ". " + V.n + " " + ekRag(a, "t") + " vesz.", "egy"]],
    vezet: [["Mennyi 1 " + A.n + "?", e, null], [V.n + " hányat vesz?", a, null], ["Mennyi " + e + " · " + a + "?", h, 0]] });
}
function vsA3(g, S) {
  if (g < 4) return vsA1(g, S, !S.a1kg);          /* 3. o.: még egy „egyre”, a másik fajtából (kg ↔ darab) */
  if (vsR(0, 2) === 0) {                           /* idő: kút / szekér */
    var kut = vsR(0, 1) === 1, t1 = vsR(2, 9), t2 = vsR(2, 9), u = kut ? vsR(1, 99) * 10 : vsR(5, 20);
    if (t1 === t2) return null;
    var Vt = t1 * u, h = t2 * u, egys = kut ? "dl" : "km", ido = kut ? "perc" : "óra";
    return vsFel(g, { sablon: "A3ido", kulcs: "A3i" + t1 + u + t2,
      kep: [vsErem(kut ? "⛲" : "🛒", t1 + " " + ido, Vt + " " + egys), VS_NYIL, vsErem(kut ? "⛲" : "🛒", t2 + " " + ido, "? " + egys)],
      tort: [kut ? "A vásártéri kút " + t1 + " perc alatt " + Vt + " dl vizet ad." : "A vásári szekér " + t1 + " óra alatt " + Vt + " km-t tesz meg."],
      kerdes: kut ? "Hány dl vizet ad " + t2 + " perc alatt?" : "Hány km-t tesz meg " + t2 + " óra alatt?", helyes: h,
      mit: (kut ? "víz " : "út ") + t2 + " " + ido + " alatt",
      sorok: [{ cimk: "1 " + ido + ":", h: Vt + " " + egys + " : " + t1 + " = " + u + " " + egys }, { cimk: t2 + " " + ido + ":", h: u + " " + egys + " · " + t2 + " = " + h + " " + egys }],
      valasz: "Válasz: " + h + " " + egys + (kut ? " vizet ad." : "-t tesz meg."),
      resz: [[u, (kut ? "Ennyi vizet ad 1 perc alatt" : "Ennyit tesz meg 1 óra alatt") + " — jó lépés! De " + t2 + (kut ? " percet" : " órát") + " kérdeztünk.", 0]],
      csap: [[Vt, ekA(Vt, true) + " " + egys + " " + t1 + " " + ido + " alatt jön ki. " + t2 + " " + ido + " alatt ugyanannyi lenne?", "osszes"],
             [t2 > t1 ? Vt + (t2 - t1) : Vt - (t1 - t2), "Nem " + Math.abs(t2 - t1) + " " + egys + "-rel " + (t2 > t1 ? "több" : "kevesebb") + "! Előbb nézd meg, mennyi 1 " + ido + " alatt.", "kivon"]],
      vezet: [["Mennyi 1 " + ido + " alatt? " + Vt + " : " + t1 + "?", u, 0], ["És " + t2 + " " + ido + " alatt? Mennyi " + u + " · " + t2 + "?", h, 1]] });
  }
  var A = VS_ARU[vsE(["kanal", "ceruza", "gomb", "tanyer"])], a1 = vsR(2, 12), a2 = vsR(2, 12), e = vsR(0, 1) ? vsR(2, 99) * 10 : vsR(12, 999);
  var T = a1 * e, h2 = a2 * e;
  if (a1 === a2 || T > 9999 || h2 > 9999 || a1 === e || a2 === e) return null;
  return vsFel(g, { sablon: "A3", kulcs: "A3" + a1 + "/" + a2 + "/" + e,
    kep: [vsCedulaSor(A, a1, T + " Ft"), VS_NYIL, vsCedulaSor(A, a2, "? Ft", true)],
    tort: [a1 + " " + A.n + " " + T + " forintba kerül."], kerdes: "Mennyibe kerül " + a2 + " " + A.n + "?", helyes: h2, mit: a2 + " " + A.n + " ára",
    sorok: [{ cimk: "1 " + A.n + ":", h: T + " Ft : " + a1 + " = " + e + " Ft" }, { cimk: a2 + " " + A.n + ":", h: e + " Ft · " + a2 + " = " + h2 + " Ft" }],
    valasz: "Válasz: " + a2 + " " + A.n + " " + h2 + " forint.",
    resz: [[e, "Ez 1 " + A.n + " ára — jó lépés! De " + a2 + " " + A.t + " kérdeztünk.", 0]],
    csap: [[a2 < a1 ? T - (a1 - a2) : T + (a2 - a1), "Nem " + Math.abs(a1 - a2) + " forinttal " + (a2 < a1 ? "kevesebb" : "több") + "! Előbb nézd meg, mennyi 1 " + A.n + ".", "kivon"],
           [T, ekA(T, true) + " forint " + a1 + " " + A.n + " ára. " + a2 + " " + A.n + " ugyanannyi lenne?", "osszes"]],
    vezet: [["Mennyi 1 " + A.n + "? " + T + " : " + a1 + "?", e, 0], ["És " + a2 + " " + A.n + "? Mennyi " + e + " · " + a2 + "?", h2, 1]] });
}

/* ═════════════════ ⚖️ HASONLÍTÓ PULT — -szor annyi ↔ -val több (kontraszt-pár) + fele / „kétszerese” ═════════════════ */
/* téma: X = az alap, Y = amit hasonlítunk; szor(k) / val(k) a kulcs-kifejezés; kondSzor / kondVal = „akkor lenne jó, ha …” */
function vsHTema(g) {
  var negy = g >= 4, t = negy ? vsE(["ar", "darab"]) : vsE(["tomeg", "ar", "hossz", "darab"]);
  if (t === "tomeg") {
    var p = vsE([["szolo", "alma"], ["korte", "dinnye"], ["alma", "tok"], ["szolo", "dinnye"]]), X = VS_ARU[p[0]], Y = VS_ARU[p[1]];
    return { t: t, X: X, Y: Y, egys: " kg", kerdY: "Hány kg " + vsAz(Y.n) + "?", kerdX: "Hány kg " + vsAz(X.n) + "?", alap: vsAzN(X.n) + " {a} kg.",
      szor: function (k) { return ekRag(k, "szor") + " olyan nehéz"; }, val: function (k) { return k + " kg-mal nehezebb"; },
      mondat: function (kif) { return vsAzN(Y.n) + " " + kif + ", mint " + vsAz(X.n) + "."; },
      kondSzor: function (k) { return ekRag(k, "szor") + " olyan nehéz lenne"; }, kondVal: function (k) { return k + " kg-mal nehezebb lenne"; },
      ki: vsAz(Y.n), kiT: vsAz(Y.t), xNev: X.n, yNev: Y.n, mit: vsAz(Y.n) + " tömege", valasz: function (h) { return vsAz(Y.n) + " " + h + " kg."; } };
  }
  if (t === "ar") {
    var q = vsE([["kosarka", "kalap"], ["kancso", "tanyer"], ["ceruza", "kalap"], ["lufi", "zaszlo"]]), X2 = VS_ARU[q[0]], Y2 = VS_ARU[q[1]];
    return { t: t, X: X2, Y: Y2, egys: " Ft", kerdY: "Mennyibe kerül " + vsAz(Y2.n) + "?", kerdX: "Mennyibe kerül " + vsAz(X2.n) + "?", alap: vsAzN(X2.n) + " {a} forint.",
      szor: function (k) { return ekRag(k, "szor") + " annyiba"; }, val: function (k) { return k + " forinttal többe"; },
      mondat: function (kif) { return vsAzN(Y2.n) + " " + kif + " kerül, mint " + vsAz(X2.n) + "."; },
      kondSzor: function (k) { return ekRag(k, "szor") + " annyiba kerülne"; }, kondVal: function (k) { return k + " forinttal többe kerülne"; },
      ki: vsAz(Y2.n), kiT: vsAz(Y2.t), xNev: X2.n, yNev: Y2.n, mit: vsAz(Y2.n) + " ára", valasz: function (h) { return vsAz(Y2.n) + " " + h + " forintba kerül."; } };
  }
  if (t === "hossz") return { t: t, egys: " m", kerdY: "Hány m a kék szalag?", kerdX: "Hány m a piros szalag?", alap: "A piros szalag {a} m.",
      szor: function (k) { return ekRag(k, "szor") + " olyan hosszú"; }, val: function (k) { return k + " m-rel hosszabb"; },
      mondat: function (kif) { return "A kék szalag " + kif + ", mint a piros."; },
      kondSzor: function (k) { return ekRag(k, "szor") + " olyan hosszú lenne"; }, kondVal: function (k) { return k + " m-rel hosszabb lenne"; },
      ki: "a kék szalag", kiT: "a kék szalagot", xNev: "piros", yNev: "kék", mit: "a kék szalag hossza", valasz: function (h) { return "a kék szalag " + h + " m."; } };
  var V = vsVevok(2), A = VS_ARU[vsE(negy ? ["gomb", "dio", "tojas"] : ["lufi", "alma", "gomb", "suti"])];
  return { t: t, egys: "", kerdY: "Hány " + vsSzem(A) + A.t + " vett " + V[1].n + "?", kerdX: "Hány " + vsSzem(A) + A.t + " vett " + V[0].n + "?", alap: V[0].tel + " {a} " + vsSzem(A) + A.t + " vett.",
    szor: function (k) { return ekRag(k, "szor") + " annyit"; }, val: function (k) { return ekRag(k, "val") + " többet"; },
    mondat: function (kif) { return V[1].tel + " " + kif + " vett, mint " + V[0].n + "."; },
    kondSzor: function (k) { return ekRag(k, "szor") + " annyit vett volna"; }, kondVal: function (k) { return ekRag(k, "val") + " többet vett volna"; },
    ki: V[1].n, kiT: V[1].t, xNev: V[0].n, yNev: V[1].n, V: V, A: A, mit: "amennyit " + V[1].n + " vett", valasz: function (h) { return V[1].n + " " + vsDb(h, A, "t") + " vett."; } };
}
function vsHParTort(g) {
  for (var k = 0; k < 200; k++) {
    var Te = vsHTema(g), a, kk, d;
    if (g < 4) { a = vsR(2, 10); kk = vsR(2, 5); d = kk; if (a * kk > 50 || a + kk === a * kk || a === kk) continue; }
    else { a = Te.t === "ar" ? vsR(12, 999) : vsR(12, 400); kk = vsR(2, 9); d = vsR(1, 9) * (vsR(0, 1) ? 10 : 100); if (a * kk > 9999 || a + d > 9999) continue; }
    return { Te: Te, a: a, k: kk, d: d };
  }
  return null;
}
function vsH(g, S, szor) {
  var P = S.par || (S.par = vsHParTort(g));
  if (!P) return null;
  var Te = P.Te, a = P.a, k = szor ? P.k : P.d, h = szor ? a * k : a + k, alap = Te.alap.replace("{a}", a);
  var kif = szor ? vsKw(Te.szor(k), "szor", g) : vsKw(Te.val(k), "val", g);
  var szin = Te.t === "tomeg" ? "#b79fd4" : Te.t === "hossz" ? "#f6a5c0" : "#fce49a";
  var egyseg = 300 / Math.max(a * (szor ? k : 1) + (szor ? 0 : Math.min(k, a)), a * 2);
  var kep = vsSzalag([{ nev: Te.xNev, d: [[a, szin, a + Te.egys.replace(" Ft", "")]] },
    { nev: Te.yNev, d: szor ? Array.apply(null, Array(k)).map(function () { return [a, "#ece2fb", String(a)]; }) : [[a, "#dff3d6", String(a)], [Math.min(k, a) || 1, "#a7d99a", "+" + k]], vege: "= ?" }], egyseg);
  var csere = szor ? a + k : a * k;
  var cMond = szor ? "A " + csere + " akkor lenne jó, ha " + Te.ki + " " + Te.kondVal(k) + ". De itt " + Te.szor(k) + (Te.t === "ar" ? " kerül" : Te.t === "darab" ? " vett" : "") + "! Nézd meg a szalagot!"
    : "A " + csere + " akkor lenne jó, ha " + Te.ki + " " + Te.kondSzor(k) + ". De itt csak " + Te.val(k) + (Te.t === "ar" ? " kerül" : Te.t === "darab" ? " vett" : "") + "!";
  var muv = szor ? a + Te.egys + " · " + k + " = " + h + Te.egys : a + Te.egys + " + " + k + Te.egys + " = " + h + Te.egys;
  return vsFel(g, { sablon: szor ? "Hx" : "Hp", kulcs: (szor ? "Hx" : "Hp") + a + "/" + k,
    kep: [kep], tort: [alap, Te.mondat(kif)], kerdes: Te.kerdY, helyes: h, mit: Te.mit, sorok: [muv], valasz: "Válasz: " + Te.valasz(h),
    csap: [[csere, cMond, "szorval", { mozgo: true }], [a, ekA(a, true) + Te.egys + " " + (Te.t === "darab" ? Te.xNev + " vette" : "a " + Te.xNev) + ". Mi " + Te.kiT + " kérdeztük.", "masik"]],
    vezet: [[Te.kerdX, a, null], ["Itt azt írja: " + (szor ? Te.szor(k) : Te.val(k)) + ". Akkor " + (szor ? "szorzunk" : "hozzáadunk") + ". Mennyi " + a + (szor ? " · " : " + ") + k + "?", h, 0]],
    mozgo: { klip: "tobbszor", o: { a: a, k: szor ? k : P.k, d: szor ? P.d : k, szor: szor, x: Te.xNev, y: Te.yNev, egys: Te.egys } } });
}
function vsH3(g) {
  if (g < 4) {                                     /* fele, harmada, negyede */
    var szalag = vsR(0, 2) > 0, k = szalag ? vsR(2, 4) : 2, m = vsR(2, szalag ? Math.floor(40 / k) : 10), a = k * m;
    if (a > 40) return null;
    var fele = VS_RESZE[k], tort = szalag ? ["A piros szalag " + a + " m.", "A kék szalag hossza a piros " + vsKw(fele, "szor", g) + "."] : ["A dinnye " + a + " kg.", "A tök " + vsKw("fele olyan nehéz", "szor", g) + "."];
    var d = []; for (var i = 0; i < k; i++) d.push([m, i === 0 ? "#9ec9f0" : "#e8e1f3", i === 0 ? "?" : ""]);
    return vsFel(g, { sablon: "H3", kulcs: "H3" + a + "/" + k,
      kep: [vsSzalag([{ nev: szalag ? "piros" : "dinnye", d: [[a, szalag ? "#f6a5c0" : "#a7d99a", a + (szalag ? " m" : " kg")]] }, { nev: szalag ? "kék" : "tök", d: d }], 300 / a)],
      tort: tort, kerdes: szalag ? "Hány m a kék szalag?" : "Hány kg a tök?", helyes: m, mit: szalag ? "a kék szalag hossza" : "a tök tömege",
      sorok: [a + (szalag ? " m" : " kg") + " : " + k + " = " + m + (szalag ? " m" : " kg")], valasz: szalag ? "Válasz: a kék szalag " + m + " m." : "Válasz: a tök " + m + " kg.",
      csap: [[a * k, "Ez " + vsAz(VS_SZOROS[k]) + "! A " + fele + " kisebb, mint " + (szalag ? "a piros szalag" : "a dinnye") + ".", "szoroz"],
             [a - k, "Elvettél belőle. A " + fele + " azt jelenti: " + k + " egyforma részre vágjuk, és egy rész kell.", "kivon"],
             [a, ekA(a, true) + (szalag ? " m a piros szalag. Mi a kéket" : " kg a dinnye. Mi a tököt") + " kérdeztük.", "masik"]],
      vezet: [[szalag ? "Hány m a piros szalag?" : "Hány kg a dinnye?", a, null], ["A " + fele + ": " + k + " egyforma részre vágjuk. Mennyi " + a + " : " + k + "?", m, 0]] });
  }
  var k1 = vsR(2, 5), k2 = vsR(2, 9), x = vsR(0, 1) ? vsR(2, 99) * 10 : vsR(12, 999), V = k1 * x, h = k2 * x;
  if (k1 === k2 || V > 9999 || h > 9999) return null;
  var dd = function (n) { var t = []; for (var i = 0; i < n; i++) t.push([1, "#9ec9f0", ""]); return t; };
  return vsFel(g, { sablon: "H3", kulcs: "H34" + k1 + "/" + x + "/" + k2,
    kep: [vsSzalag([{ nev: VS_SZOROS[k1], d: dd(k1), vege: "= " + V }, { nev: VS_SZOROS[k2], d: dd(k2), vege: "= ?" }], 22)],
    tort: ["Egy szám " + VS_SZOROS[k1] + " " + V + "."], kerdes: "Mennyi a szám " + VS_SZOROS[k2] + "?", helyes: h, mit: "a " + VS_SZOROS[k2],
    sorok: [{ cimk: "a szám:", h: V + " : " + k1 + " = " + x }, { cimk: VS_SZOROS[k2] + ":", h: x + " · " + k2 + " = " + h }], valasz: "Válasz: a szám " + VS_SZOROS[k2] + " " + h + ".",
    resz: [[x, "A " + x + " maga a szám — jó lépés! De a " + vsSzorosT(k2) + " kérdeztük.", 0]],
    csap: [[V * k2, "A " + (V * k2) + " " + mAz(V) + " " + V + " " + VS_SZOROS[k2] + ". De " + mAz(V) + " " + V + " már a szám " + VS_SZOROS[k1] + "!", "masik"],
           [V, ekA(V, true) + " a szám " + VS_SZOROS[k1] + ". Mi a " + vsSzorosT(k2) + " kérdeztük.", "masik"]],
    vezet: [["Mennyi maga a szám? " + V + " : " + k1 + "?", x, 0], ["A " + VS_SZOROS[k2] + ": mennyi " + x + " · " + k2 + "?", h, 1]] });
}

/* ═════════════════ 🎪 NAGY VÁSÁR — a kettő együtt (3. o.: kontraszt-pár, 2 lépés · 4. o.: két történet, 3 lépés) ═════════════════ */
function vsN3Tort() {
  for (var k = 0; k < 200; k++) {
    var A1 = VS_ARU[vsE(["ceruza", "lufi", "gomb", "cukor"])], A2 = VS_ARU[vsE(["radir", "zaszlo", "nyaloka"])];
    var a = vsR(2, 5), e = vsR(2, 10), T = a * e, kk = vsR(2, 4);
    if (T > 50 || e * kk > 40 || a === e || e === kk || a === kk || T === e * kk || T === e + kk) continue;
    return { A1: A1, A2: A2, a: a, e: e, T: T, k: kk };
  }
  return null;
}
function vsN3(g, S, szor) {
  var P = S.par || (S.par = vsN3Tort());
  if (!P) return null;
  var A1 = P.A1, A2 = P.A2, a = P.a, e = P.e, T = P.T, k = P.k, h = szor ? e * k : e + k, egy = "1 " + vsSzem(A1) + A1.n;
  var kif = szor ? vsKw(ekRag(k, "szor") + " annyiba", "szor", g) : vsKw(k + " forinttal többe", "val", g);
  var csere = szor ? e + k : e * k;
  var d2 = szor ? Array.apply(null, Array(k)).map(function () { return [1, "#ece2fb", "?"]; }) : [[1, "#ece2fb", "?"], [.7, "#a7d99a", "+" + k]];
  return vsFel(g, { sablon: szor ? "N3x" : "N3p", kulcs: (szor ? "N3x" : "N3p") + T + "/" + a + "/" + k,
    kep: [vsCedulaSor(A1, a, T + " Ft"), VS_NYIL, vsCedulaSor(A1, 1, "? Ft", true, "1 " + (A1.szem ? "szem" : "db")),
          vsSzalag([{ nev: egy, d: [[1, "#fde8f2", "?"]] }, { nev: A2.n, d: d2, vege: "= ?" }], 40)],
    tort: [a + " " + vsSzem(A1) + A1.n + " " + T + " forint.", vsAzN(A2.n) + " " + kif + " kerül, mint " + egy + "."],
    kerdes: "Mennyibe kerül " + vsAz(A2.n) + "?", helyes: h, mit: vsAz(A2.n) + " ára",
    sorok: [{ cimk: egy + ":", h: T + " Ft : " + a + " = " + e + " Ft" }, { cimk: A2.n + ":", h: szor ? e + " Ft · " + k + " = " + h + " Ft" : e + " Ft + " + k + " Ft = " + h + " Ft" }],
    valasz: "Válasz: " + vsAz(A2.n) + " " + h + " forintba kerül.",
    resz: [[e, ekA(e, true) + " forint " + egy + " ára — ez jó lépés! De " + vsAz(A2.t) + " kérdeztük. Mennyi " + vsAz(A2.n) + "?", 0]],
    csap: [[T, ekA(T, true) + " forint " + mAz(a) + " " + a + " " + A1.n + " együtt. Először: mennyibe kerül " + egy + "?", "osszes"],
           [szor ? T * k : T + k, szor ? "A " + (T * k) + " " + mAz(a) + " " + a + " " + A1.n + " " + VS_SZOROS[k] + ". De " + vsAz(A2.t) + " 1 " + A1.hoz + " hasonlítjuk!"
                               : "A " + (T + k) + " " + mAz(a) + " " + a + " " + A1.n + " meg " + k + " forint. De " + vsAz(A2.t) + " 1 " + A1.hoz + " hasonlítjuk!", "masik"],
           [csere, szor ? "A " + csere + " akkor lenne jó, ha " + vsAz(A2.n) + " " + k + " forinttal többe kerülne. De itt " + ekRag(k, "szor") + " annyiba kerül! Nézd meg a szalagot!"
                        : "A " + csere + " akkor lenne jó, ha " + vsAz(A2.n) + " " + ekRag(k, "szor") + " annyiba kerülne. De itt csak " + k + " forinttal többe kerül!", "szorval", { mozgo: true }]],
    vezet: [["Először: mennyibe kerül " + egy + "? Mennyi " + T + " : " + a + "?", e, 0],
            ["Most: " + vsAz(A2.n) + " " + (szor ? ekRag(k, "szor") + " annyiba kerül" : k + " forinttal többe kerül") + ". Mennyi " + e + (szor ? " · " : " + ") + k + "?", h, 1]],
    mozgo: { klip: "tobbszor", o: { a: e, k: k, d: k, szor: szor, x: egy, y: A2.n, egys: " Ft" } } });
}
function vsN4(g, S, kg) {
  var c = vsR(2, 5), a = vsR(2, 9), e, kk, y, h, T, A1, A2, sorok, tort, kerd, mit, cs;
  if (!kg) {
    A1 = VS_ARU[vsE(["kanal", "ceruza", "gomb"])]; A2 = VS_ARU[vsE(["tanyer", "kalap", "kancso"])];
    e = vsR(1, 50) * 10; kk = vsR(2, 6); T = a * e; y = e * kk; h = y * c;
    if (T > 9999 || h > 9999 || y === T || a === e) return null;
    tort = [a + " " + A1.n + " " + T + " forint.", "Egy " + A2.n + " " + ekRag(kk, "szor") + " annyiba kerül, mint egy " + A1.n + "."];
    kerd = "Mennyibe kerül " + c + " " + A2.n + "?"; mit = c + " " + A2.n + " ára";
    sorok = [{ cimk: "1 " + A1.n + ":", h: T + " Ft : " + a + " = " + e + " Ft" }, { cimk: "1 " + A2.n + ":", h: e + " Ft · " + kk + " = " + y + " Ft" }, { cimk: c + " " + A2.n + ":", h: y + " Ft · " + c + " = " + h + " Ft" }];
    cs = [[T * kk, "Ez " + mAz(a) + " " + a + " " + A1.n + " árából jött ki. De " + vsAz(A2.t) + " EGY " + A1.hoz + " hasonlítjuk!", "masik"],
          [(e + kk) * c, "A " + A2.n + " nem " + kk + " forinttal drágább, hanem " + ekRag(kk, "szor") + " annyiba kerül!", "szorval"]];
  } else {
    var gy = mKever(["alma", "korte", "szolo"]); A1 = VS_ARU[gy[0]]; A2 = VS_ARU[gy[1]];
    e = vsR(3, 90) * 10; kk = vsR(1, 30) * 10; T = a * e; y = e + kk; h = y * c;
    if (T > 9999 || h > 9999 || a === e) return null;
    tort = [a + " kg " + A1.n + " " + T + " forint.", "1 kg " + A2.n + " " + kk + " forinttal többe kerül, mint 1 kg " + A1.n + "."];
    kerd = "Mennyibe kerül " + c + " kg " + A2.n + "?"; mit = c + " kg " + A2.n + " ára";
    sorok = [{ cimk: "1 kg " + A1.n + ":", h: T + " Ft : " + a + " = " + e + " Ft" }, { cimk: "1 kg " + A2.n + ":", h: e + " Ft + " + kk + " Ft = " + y + " Ft" }, { cimk: c + " kg " + A2.n + ":", h: y + " Ft · " + c + " = " + h + " Ft" }];
    cs = [[T + kk, "Ez " + mAz(a) + " " + a + " kg " + A1.n + " ára meg még " + kk + " forint. De " + vsAz(A2.t) + " 1 kg " + A1.hoz + " hasonlítjuk!", "masik"],
          [(T + kk) * c, "Ez " + mAz(a) + " " + a + " kg " + A1.n + " árából jött ki. De " + vsAz(A2.t) + " 1 kg " + A1.hoz + " hasonlítjuk!", "masik"]];
  }
  var egy1 = kg ? "1 kg " + A1.n : "1 " + A1.n, egy2 = kg ? "1 kg " + A2.n : "1 " + A2.n, tobb = kg ? c + " kg " + A2.n : c + " " + A2.n;
  var d2 = kg ? [[1, "#ece2fb", "?"], [.6, "#a7d99a", "+" + kk]] : Array.apply(null, Array(kk)).map(function () { return [1, "#ece2fb", "?"]; });
  var d3 = []; for (var i = 0; i < c; i++) d3.push([kg ? 1.6 : kk, i % 2 ? "#e0d4f5" : "#ece2fb", "?"]);
  return vsFel(g, { sablon: kg ? "N4p" : "N4x", kulcs: "N4" + (kg ? "p" : "x") + T + "/" + a + "/" + kk + "/" + c,
    kep: [vsCedulaSor(A1, a, T + " Ft", false, kg ? a + " kg" : null), vsSzalag([{ nev: egy1, d: [[1, "#fde8f2", "?"]] }, { nev: egy2, d: d2 }, { nev: tobb, d: d3, vege: "= ?" }], kg ? 30 : Math.min(30, Math.max(22, 260 / (kk * c))))],
    tort: tort, kerdes: kerd, helyes: h, mit: mit, sorok: sorok, valasz: "Válasz: " + tobb + " " + h + " forint.",
    resz: [[e, "Ez " + egy1 + " ára — jó lépés! De " + tobb + " árát kérdeztük.", 0], [y, "Ez " + egy2 + " ára — jó lépés! De " + tobb + " árát kérdeztük.", 1]],
    csap: cs.concat([[T, ekA(T, true) + " forint " + a + (kg ? " kg " : " ") + A1.n + " együtt. Először: mennyi " + egy1 + "?", "osszes"]]),
    vezet: [["Először: mennyi " + egy1 + "? " + T + " : " + a + "?", e, 0], ["Most: mennyi " + egy2 + "? Mennyi " + e + (kg ? " + " : " · ") + kk + "?", y, 1], ["És " + tobb + "? Mennyi " + y + " · " + c + "?", h, 2]],
    mozgo: kg ? null : { klip: "tobbszor", o: { a: e, k: kk, d: kk, szor: true, x: egy1, y: A2.n, egys: " Ft" } } });
}

/* ═════════════════ 🚪 ODÚ-KÜSZÖB — vegyes ismétlés, „Kit kérdeztünk?” ═════════════════ */
function vsU1(g) {
  var V = vsVevok(2), negy = g >= 4, P = negy ? vsE([["gomb", "csomag"], ["dio", "zacsko"], ["tojas", "talca"]]) : vsE([["cukor", "zacsko"], ["dio", "zacsko"], ["eper", "tal"]]);
  var A = VS_ARU[P[0]], T = VS_TARTO[P[1]], z = negy ? vsR(2, 9) : vsR(2, 5), b = negy ? vsR(12, 500) : vsR(2, 9), k = negy ? vsR(2, 5) : vsR(2, 4), x = z * b, y = x * k, h = negy ? x + y : y;
  if (h > vsMax(g) || z === b || z === k || b === k) return null;
  var tort = [V[0].tel + " " + z + " " + T.n + " " + A.t + " vett, " + T.mind.toLowerCase() + " " + vsDb(b, A) + ".",
              V[1].tel + " " + vsKw(ekRag(k, "szor") + " annyi", "szor", g) + " " + A.t + " vett, mint " + V[0].n + "."];
  var kerd = negy ? "Hány " + vsSzem(A) + A.t + " vettek <b>ketten együtt</b>?" : "Hány " + vsSzem(A) + A.t + " vett <b>" + V[1].n + "</b>?";
  var sorok = [{ cimk: V[0].n + ":", h: b + " · " + z + " = " + x }, { cimk: V[1].n + ":", h: x + " · " + k + " = " + y }];
  if (negy) sorok.push({ cimk: "együtt:", h: x + " + " + y + " = " + h });
  var resz = [[x, "A " + x + " " + V[0].n + " " + A.ja + " — jó lépés! De " + (negy ? "kettejüket együtt" : V[1].t) + " kérdeztük.", 0, negy ? null : V[1].n]];
  if (negy) { resz[0][3] = V[0].n; resz.push([y, "A " + y + " " + V[1].n + " " + A.ja + " — jó lépés! De kettejüket együtt kérdeztük.", 1, V[1].n]); }
  var vez = [["Mennyit vett " + V[0].n + "? Mennyi " + b + " · " + z + "?", x, 0], [V[1].n + " " + ekRag(k, "szor") + " annyit vett. Mennyi " + x + " · " + k + "?", y, 1]];
  if (negy) vez.push(["Együtt: mennyi " + x + " + " + y + "?", h, 2]);
  return vsFel(g, { sablon: "U1", kulcs: "U1" + z + "/" + b + "/" + k,
    kep: [vsErem(V[0].e, z + " " + T.n, V[0].n, V[0].n), vsErem(V[1].e, "?", V[1].n, V[1].n), vsTartokKep(Math.min(z, 5), P[1], A, negy ? 0 : b, negy ? String(b) : null)],
    tort: tort, kerdes: kerd, helyes: h, mit: negy ? "amennyit ketten együtt vettek" : "amennyit " + V[1].n + " vett", sorok: sorok,
    valasz: negy ? "Válasz: együtt " + vsDb(h, A, "t") + " vettek." : "Válasz: " + V[1].n + " " + vsDb(h, A, "t") + " vett.", resz: resz,
    csap: [[b * k, "A " + (b * k) + " egy " + T.n + " " + VS_SZOROS[k] + ". De " + V[0].n + " " + z + " " + T.t + " vett!", "egy", { mutat: V[0].n }],
           [x + k, "A " + (x + k) + " akkor lenne jó, ha " + V[1].n + " " + ekRag(k, "val") + " többet vett volna. De itt " + ekRag(k, "szor") + " annyit vett!", "szorval", { mozgo: true }]],
    vezet: vez, mozgo: { klip: "tobbszor", o: { a: x, k: k, d: k, szor: true, x: V[0].n, y: V[1].n, egys: "" } } });
}
function vsU2(g) {
  if (g >= 4) {                                    /* „legalább hány kell?” */
    var P = vsE([["dinnye", "lada"], ["tojas", "talca"], ["alma", "kosar"]]), A = VS_ARU[P[0]], T = VS_TARTO[P[1]], b = vsR(6, 9), n = vsR(100, 999), q = Math.floor(n / b), r = n % b;
    T.cls = P[1];
    if (!r || r === q || b - r === q) return null;
    return vsFel(g, { sablon: "U2", kulcs: "U2" + n + "/" + b,
      kep: [vsKupac(A, n, g), VS_NYIL, vsSvg(114, 128, vsTartoAlak(P[1]) + vsCimke(50, 84, b + " fér"))],
      tort: ["Egy " + T.ba + " " + b + " " + A.n + " fér.", "Tüske néninek " + vsDb(n, A, "t") + " kell elvinnie."], kerdes: "Legalább hány " + T.n + " <b>KELL</b>?", helyes: q + 1,
      mit: "hány " + T.n + " KELL", sorok: [n + " : " + b + " = " + q + ", maradék " + r, { h: mAz(r) + " " + r + " " + A.nak + " is kell " + T.n + ": " + q + " + 1 = " + (q + 1), cls: "cimkes" }],
      valasz: "Válasz: " + (q + 1) + " " + T.n + " kell.",
      csap: [[q, q + " " + T.n + " megtelik — de hová tesszük a maradék " + vsDb(r, A, "t") + "? Hány " + T.n + " kell?", "kerekit"], [r, ekA(r, true) + " a kimaradó " + A.n + ". Mi a " + T.kat + " kérdeztük.", "masik"]],
      vezet: [["Hány " + T.n + " telik meg, ha egy " + T.ba + " " + b + " fér?", q, null], ["Hány " + A.n + " marad ki?", r, 0], [ekNagy(mAz(r)) + " " + r + " " + A.nak + " is kell " + T.n + ". Hány " + T.n + " kell összesen?", q + 1, 1]],
      mozgo: { klip: "doboz", o: { n: n, b: b, q: q, r: r, A: A, T: T } } });
  }
  var V = vsVevok(2), A2 = VS_ARU[vsE(["eper", "dio", "cukor"])], T2 = VS_TARTO.tal, b2 = vsR(2, 9), p = vsR(2, 6), q2 = vsR(2, 6), h = b2 * (p + q2);
  T2.cls = "tal";
  if (p === q2 || h > 100 || b2 === p || b2 === q2) return null;
  return vsFel(g, { sablon: "U2", kulcs: "U2" + b2 + "/" + p + "/" + q2,
    kep: [vsSvg(114, 128, vsTartoAlak("tal") + vsTartalom("tal", A2, b2)), vsErem(V[0].e, p + " tál", V[0].n, V[0].n), vsErem(V[1].e, q2 + " tál", V[1].n, V[1].n)],
    tort: ["Egy tálban " + vsDb(b2, A2) + " van.", V[0].tel + " " + p + " tálat vett, " + V[1].tel + " " + q2 + " tálat."], kerdes: "Hány " + vsSzem(A2) + A2.t + " vettek <b>együtt</b>?", helyes: h,
    mit: "az összes " + A2.n + " együtt", sorok: [{ cimk: "tálak:", h: p + " + " + q2 + " = " + (p + q2) }, { cimk: A2.n + ":", h: b2 + " · " + (p + q2) + " = " + h }],
    valasz: "Válasz: együtt " + vsDb(h, A2, "t") + " vettek.",
    resz: [[b2 * p, "Ez " + V[0].n + " " + A2.ja + " — jó lépés! De kettejüket együtt kérdeztük.", -1, V[0].n], [b2 * q2, "Ez " + V[1].n + " " + A2.ja + " — jó lépés! De kettejüket együtt kérdeztük.", -1, V[1].n]],
    csap: [[p + q2, ekA(p + q2, true) + " a tálak száma. Mi " + vsAz(A2.t) + " kérdeztük!", "masik"], [b2 + p + q2, "Mindent összeadtál. De egy tálban " + vsDb(b2, A2) + " van — hány tál van összesen?", "osszead"]],
    vezet: [["Hány tálat vettek együtt? Mennyi " + p + " + " + q2 + "?", p + q2, 0], ["Egy tálban " + vsDb(b2, A2) + " van. Mennyi " + b2 + " · " + (p + q2) + "?", h, 1]] });
}
function vsU3(g) {
  var V = vsVevok(1)[0], negy = g >= 4, A, c, e, Pz, fizet, h;
  if (negy) { A = VS_ARU.sajt; c = vsR(2, 9); e = vsR(10, 99) * 10; Pz = vsR(2, 99) * 100; }
  else { A = VS_ARU[vsE(["ceruza", "lufi", "gomb", "nyaloka"])]; c = vsR(2, 9); e = vsR(2, 10); Pz = vsR(2, 10) * 10; }
  fizet = c * e; h = Pz - fizet;
  if (h < 1 || Pz > vsMax(g) || c === e) return null;
  var telNak = V.tel.replace(V.n, V.nak);
  return vsFel(g, { sablon: "U3", kulcs: "U3" + Pz + "/" + c + "/" + e,
    kep: [vsErem(V.e, Pz + " Ft", V.n, V.n), VS_NYIL, vsCedulaSor(A, c, "? Ft", true, negy ? c + " kg" : null), vsErem("🏷️", e + " Ft", negy ? "1 kg" : "1 db")],
    tort: [telNak + " " + Pz + " forintja van.", negy ? "Vesz " + c + " kg sajtot, 1 kg sajt " + e + " forint." : "Vesz " + c + " " + A.t + ", egy " + A.n + " " + e + " forint."],
    kerdes: "Hány forintja <b>MARAD</b>?", helyes: h, mit: "amennyi pénze MARAD",
    sorok: [{ cimk: "fizet:", h: e + " Ft · " + c + " = " + fizet + " Ft" }, { cimk: "marad:", h: Pz + " Ft − " + fizet + " Ft = " + h + " Ft" }], valasz: "Válasz: " + h + " forintja marad.",
    resz: [[fizet, fizet + " forintot fizetett — jó lépés! De azt kérdeztük, mennyi marad.", 0, V.n]],
    csap: [[Pz - c, "Csak egy számot vettél el. Előbb: mennyit fizet?", "kivon"], [Pz - e, "Csak egy számot vettél el. Előbb: mennyit fizet?", "kivon"],
           [c + e, "Összeadtad a darabszámot és az árat. Mennyit fizet " + V.n + "?", "osszead"]],
    vezet: [["Mennyit fizet? Mennyi " + e + " · " + c + "?", fizet, 0], ["Mennyi marad? Mennyi " + Pz + " − " + fizet + "?", h, 1]] });
}

/* ═════════════════ GENERÁTOR-DISZPÉCSER ═════════════════ */
var VS_GEN = {
  K1: vsK1, K2: vsK2, K3: vsK3,
  D1: function (g, S) { return vsD(g, S, "D1"); }, D2: function (g, S) { return vsD(g, S, "D2"); }, D3: function (g, S) { return vsD(g, S, "D3"); },
  A1: function (g, S) { var f = vsA1(g, S); if (f) S.a1kg = /kg/.test(f.vs.sablon); return f; }, A2: vsA2, A3: vsA3,
  Hx: function (g, S) { return vsH(g, S, true); }, Hp: function (g, S) { return vsH(g, S, false); }, H3: vsH3,
  N3x: function (g, S) { return vsN3(g, S, true); }, N3p: function (g, S) { return vsN3(g, S, false); },
  N4x: function (g, S) { return vsN4(g, S, false); }, N4p: function (g, S) { return vsN4(g, S, true); },
  U1: vsU1, U2: vsU2, U3: vsU3
};
/* a stand feladat-sorrendje (tartalom-lap): Á1 mindig az első; a pár (Hasonlító, Nagy vásár) véletlen sorrendben */
function vsStandSor(st, g) {
  if (st === "kosar") return mKever(["K1", "K2", "K3"]);
  if (st === "doboz") return mKever(["D1", "D2", "D3"]);
  if (st === "arcedula") return ["A1"].concat(mKever(["A2", "A3"]));
  if (st === "hasonlito") return mKever(["Hx", "Hp"]).concat(["H3"]);
  if (st === "nagy") return g >= 4 ? mKever(["N4x", "N4p"]) : mKever(["N3x", "N3p"]);
  return mKever(["U1", "U2", "U3"]);
}
var VS_INTRO = { kosar: "Segíts kosarakba rakni!", doboz: "Dobozolunk! Figyeld, mit kérdezek!", arcedula: "Mennyi egy darab? Ezt keressük.",
  hasonlito: "Hasonlítsunk! Figyeld a kis szót!", nagy: "Nagy vásár! Itt két lépés kell.", odu: "Utolsó próba az odú előtt!" };
var VS_DICSER = ["Pontosan!", "Ügyes vásárló vagy!", "Így van!", "Ez az!", "Szép munka!"];
GEN.vasar = function (cfg, kerultMar) {
  ekFuzetTorol(); vsTovabbRejt();                 /* új feladat: tiszta füzetlap */
  var g = cfg.g, i = J.feladatKesz;
  var S = J.vsStand && J.vsStand.idx === J.allomasIdx ? J.vsStand : (J.vsStand = { idx: J.allomasIdx, sor: cfg.sor ? (cfg.keverd ? mKever(cfg.sor) : cfg.sor.slice()) : vsStandSor(cfg.stand, g), tort: null, par: null });
  if (cfg.ujTort) S.tort = null;                   /* 📦 Dobozoló-nap: minden feladat új történet */
  var sab = S.sor[i % S.sor.length], f = null;
  for (var k = 0; k < 400; k++) {
    var x = VS_GEN[sab](g, S);
    if (!x) { if (k % 40 === 39) { S.tort = null; S.par = null; } continue; }   /* a közös történet nem ad tiszta feladatot → új történet */
    f = x;
    if (!x.kulcs || !kerultMar[x.kulcs]) break;
  }
  if (!f) { S.tort = null; S.par = null; for (k = 0; !f && k < 400; k++) f = vsK1(g); }
  if (f.kulcs) kerultMar[f.kulcs] = true;
  f.vs.stand = cfg.stand;
  if (i === 0) {                                  /* a stand első feladata: Tüske néni egy rövid mondata */
    var intro = cfg.intro || VS_INTRO[cfg.stand];
    f.felolvas = vsKiejt(intro) + " " + f.felolvas; setTimeout(function () { bagolyMondat(intro, FIGURA.tuske.e); }, 50);
  }
  return f;
};

/* ═════════════════ MOTOR-KAPCSOLÓK (engine-logic hívja) ═════════════════ */
function vsIndit() { J.vsCsapda = {}; J.vsResz = 0; J.vsStand = null; J.vsFuzetMondva = false; ekFuzetTorol(); vsTovabbRejt(); }
function vsCsapdaSzamol(t) { if (J && J.vsCsapda && t) J.vsCsapda[t] = (J.vsCsapda[t] || 0) + 1; }
function vsDicser(f, elsore) { if (f.vezet) return "Most már megvan!"; if (!elsore) return "Így már jó!"; return vsE(VS_DICSER); }
function vsVillant() {
  var kk = document.querySelector("#buborek-feladat .vs-kk"); if (!kk) return;
  kk.classList.remove("villan"); void kk.offsetWidth; kk.classList.add("villan");
}
/* 👉 Tüske néni rámutat (figurák 2. kör): felemeli a kezét a kép felé; ha van `ki`, a kérdezett szereplő érme lüktet,
   különben az egész kép (az áru) kap egy halvány fényt. Egy ütemmel később fut, hogy az ertekel figArc("gondol")-ja
   ne írja felül; ~2,6 s múlva visszaáll gondolkodó arcra. */
function vsMutat(ki) {
  clearTimeout(vsMutat._t); clearTimeout(vsMutat._v);
  vsMutat._t = setTimeout(function () {
    var bub = document.getElementById("buborek-feladat"); if (!bub) return;
    var t = ki && bub.querySelector('.vs-erem[data-ki="' + ki + '"]'), kep = bub.querySelector(".vs-kep"), cel = t || kep;
    if (cel) { cel.classList.remove(t ? "vs-mutat" : "vs-kep-mutat"); void cel.offsetWidth; cel.classList.add(t ? "vs-mutat" : "vs-kep-mutat"); }
    var a = bub.querySelector('.vs-arus svg[data-fig]');
    if (a) a.outerHTML = figuraSVG(a.getAttribute("data-fig"), "mutat", "alak", a.getAttribute("data-alap") || "gondol");
    vsMutat._v = setTimeout(function () {
      var b = document.querySelector('#buborek-feladat .vs-arus svg[data-arc="mutat"]');
      if (b) b.outerHTML = figuraSVG(b.getAttribute("data-fig"), b.getAttribute("data-alap") || "gondol", "alak");
    }, 2600);
  }, 60);
}
function vsKepCsere(html) { var k = document.querySelector("#buborek-feladat .vs-kep"); if (k && html) k.innerHTML = vsKepBelso(html); }

/* ── 📓 füzet: a ❓ sor + a műveleti sorok idx-ig (a már beírtat nem írja újra) ── */
function vsFuzetIgIr(V, idx, valasz) {
  if (!J.ekFuzet) ekFuzetTorol();
  var ki = [];
  if (!V.fMit) { V.fMit = true; ki.push({ h: '❓ <span class="ekf-alahuz">' + V.mit + '</span>', cls: "kerd" }); }
  for (var i = V.fIrt + 1; i <= Math.min(idx, V.sorok.length - 1); i++) {
    var s = V.sorok[i];
    ki.push({ h: (s.cimk ? '<span class="ekf-cimk">' + s.cimk + '</span> ' : '') + s.h, cls: s.cls || "" });
  }
  V.fIrt = Math.max(V.fIrt, Math.min(idx, V.sorok.length - 1));
  if (valasz) ki.push({ h: V.valasz, cls: "valasz" });
  return ki.length ? ekFuzetIr(ki) : 0;
}
/* ── a „Tovább ▶” gomb (a füzet alján; keskeny kijelzőn a buborékban) ── */
function vsTovabbRejt() { var b = $("vs-tovabb"); if (b) b.hidden = true; if (J) J.vsTovabbFn = null; }
function vsTovabbMutat(fn) {
  var d = ekFuzetDoboz(), b = $("vs-tovabb");
  if (!b) {
    b = el("button", "vs-tovabb", "Tovább ▶"); b.id = "vs-tovabb"; b.type = "button";
    b.addEventListener("click", function () { hangGomb(); vsTovabbNyom(); });
  }
  if (b.parentNode !== d) d.appendChild(b);
  J.vsTovabbFn = fn; b.hidden = false; d.hidden = false;
  if (d.classList.contains("benn")) b.scrollIntoView({ block: "nearest" });
}
function vsTovabbNyom() {
  if (!J || !J.vsTovabbFn) return;
  var fn = J.vsTovabbFn; vsTovabbRejt(); fn();
}
/* Enter = Tovább (beírós módban is) — a számbillentyű-figyelő ELŐTT fut, hogy az Enter ne küldjön üres választ */
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && J && J.vsTovabbFn && $("kepernyo-jatek").classList.contains("aktiv")) { e.preventDefault(); e.stopPropagation(); vsTovabbNyom(); }
}, true);

/* jó válasz után (ertekel): a végigvezetés köztes lépése → a sora beíródik, megy tovább; a végső válasz → a teljes megoldás
   a füzetbe, és a Tovább gombig vár. true = a vásár intézi a továbblépést. */
function vsJoTovabb(f, tovabb) {
  var V = f.vs;
  f.vsKesz = true;                                /* dupla bemondás / Enter ne léptessen kétszer */
  if (f.lanc && f.lanc.length) {                  /* végigvezetés-lépés */
    var ms = f.vsSor != null ? vsFuzetIgIr(V, f.vsSor) : 0;
    setTimeout(tovabb, Math.max(900, ms + 300));
    return true;
  }
  figyelStop();
  var ms2 = vsFuzetIgIr(V, V.sorok.length - 1, true), mondat = null;
  if (!J.vsFuzetMondva) { J.vsFuzetMondva = true; mondat = "Nézd, így kell leírni a füzetbe! Ha megnézted, nyomd meg a Tovább gombot."; }
  else if (f.vezet) mondat = "Most már megvan! Nézd meg a füzetben, hogyan lett.";
  setTimeout(function () {
    if (!J || J.feladat !== f) return;
    vsTovabbMutat(tovabb);
    if (mondat) mondd(mondat);
  }, ms2 + 400);
  return true;
}
/* részeredmény (ertekel, a rossz ág ELŐTT): nem hiba — sárga „jó lépés”, a füzetbe beíródik az addigi sor */
function vsResz(f, valasz) {
  var r = f.vs && f.vs.resz && f.vs.resz[valasz];
  if (!r) return false;
  J.vsResz++;
  hangCsilla();
  var v = $("visszajelzes");
  v.className = "visszajelzes vs-lepes"; v.innerHTML = "✋ " + r.m;
  if (r.sor != null && r.sor >= 0) vsFuzetIgIr(f.vs, r.sor); else vsFuzetIgIr(f.vs, -1);
  vsMutat(r.mutat);
  mondd(vsKiejt(r.m), kezNelkulUjra);
  return true;
}
/* a feladat mozgóképe a feladat számaival (vasar-mozgo.js) */
function vsMozgoJatszik(f, kesz) {
  var M = f.vs.mozgo, K = VSM[M && M.klip];
  if (!K) { kesz(); return; }
  f.vs.mozgoVolt = true;
  mkLejatszik({ klip: K, o: M.o }, K.cim(M.o), function () { if (J && J.feladat === f) kesz(); });
}
/* szóbeli / beírt rossz válasz (ertekel, J.probak már növelve) */
function vsHiba(f, valasz) {
  var V = f.vs, v = $("visszajelzes"), c = V.csap[valasz];
  if (f.vezet && !f.vsUjra) {                     /* végigvezetés-lépés: egyszerű számolás */
    if (J.probak === 1) { v.className = "visszajelzes rossz"; v.textContent = "Nem " + valasz + ". Számold ki újra!"; mondd("Nem talált. Számold ki újra!", kezNelkulUjra); }
    else { v.className = "visszajelzes rossz"; v.textContent = "✘ " + f.megoldas; mondd("Nézd: " + vsKiejt(f.megoldas) + ". Most mondd te!", kezNelkulUjra); }
    return;
  }
  if (c) vsCsapdaSzamol(c.t);
  if (J.probak === 1) {
    if (c) {
      v.className = "visszajelzes ek-csapda"; v.innerHTML = FIGURA.tuske.e + " " + c.m;
      if (c.kep) vsKepCsere(c.kep);
      vsMutat(c.mutat);
      if (c.mozgo && V.mozgo && !V.mozgoVolt) mondd(vsKiejt(c.m), function () { vsMozgoJatszik(f, function () { mondd(vsKiejt(V.bub.kerdes), kezNelkulUjra); }); });
      else mondd(vsKiejt(c.m), kezNelkulUjra);
    } else {
      v.className = "visszajelzes rossz"; v.textContent = "Hmm, nem ennyi. Nézd meg újra a képet, és olvasd el a kérdést!";
      vsVillant(); vsMutat(); mondd("Hmm, nem ennyi. Nézd meg újra a képet, és olvasd el a kérdést!", kezNelkulUjra);
    }
    return;
  }
  if (V.vezet && !f.vezet) {                      /* 2. rossz → (mozgókép) → lépésenként */
    figyelStop();
    v.className = "visszajelzes rossz"; v.textContent = "Nem " + valasz + ". Gyere, lépésenként megcsináljuk!";
    if (V.mozgo && !V.mozgoVolt) mondd("Nézzük meg együtt!", function () { vsMozgoJatszik(f, function () { vsVezet(f); }); });
    else vsVezet(f);
    return;
  }
  v.className = "visszajelzes rossz"; v.textContent = "✘ " + f.megoldas;
  mondd("Nézd meg: " + vsKiejt(f.megoldas) + ". Most mondd te!", kezNelkulUjra);
}
function vsLepesSzob(f, i, kerdes, helyes, sor, ujra) {
  var B = f.vs.bub, lep = '<div class="ek-lepes' + (ujra ? ' vegso' : '') + '"><span class="ek-lepes-cim">' + (ujra ? "Most újra a kérdés:" : (i + 1) + ". lépés") + '</span> ' + kerdes + '</div>';
  return { csalad: "egyenkent", nagySzam: f.nagySzam, jegyMax: f.jegyMax, vezet: true, vsUjra: !!ujra, vsSor: sor, vs: f.vs,
    kartyaHTML: vsBub({ kep: B.kep, tort: B.tort, kerdes: B.kerdes, lepes: lep }),
    szoveg: ekSima(kerdes), felolvas: vsKiejt((ujra ? "Most újra a kérdés: " : "") + kerdes), helyes: helyes, keplet: "",
    megoldas: ujra ? f.megoldas : (sor != null && f.vs.sorok[sor] ? ekSima(f.vs.sorok[sor].h) : String(helyes)), tipp: "", lanc: null,
    naplo: { tipus: f.naplo.tipus + (ujra ? "-ujra" : "-lepes"), kerdes: ekSima(kerdes).slice(0, 60), helyes: helyes, atlepes: false } };
}
function vsVezet(f) {
  var sor = f.vs.vezet.map(function (l, i) { return vsLepesSzob(f, i, l[0], l[1], l[2], false); });
  sor.push(vsLepesSzob(f, 0, ekSima(f.vs.bub.kerdes), f.helyes, f.vs.sorok.length - 1, true));
  for (var i = 0; i < sor.length - 1; i++) sor[i].lanc = sor.slice(i + 1);
  J.lancKov = sor[0];
  mondd("Gyere, lépésenként megcsináljuk!", function () { if (J && J.lancKov === sor[0]) ujFeladat(); });
}
/* pálya vége: csendes mérés (standonként és hibatípusonként) + Tüske néni búcsúja */
function vsPalyaVege() {
  var m = "Ügyes vásárló voltál! Irány az odú!";
  return { html: '<br><span class="vs-vege">' + FIGURA.tuske.e + ' ' + m + '</span>', mondat: " " + m, adat: { osztaly: J.palya.osztaly, csapdak: J.vsCsapda || {}, jolepes: J.vsResz || 0 } };
}

/* ═════════════════ RAJZ: sátor, füzér, lampion (a rajzterv jóváhagyott elemei) ═════════════════ */
var VS_SZIN = {
  kosar: { teto: "#a7d99a", csik: "#fff", sotet: "#5e9a52", cimer: "🧺" },
  doboz: { teto: "#f7c59f", csik: "#fff", sotet: "#b87a45", cimer: "📦" },
  arcedula: { teto: "#f6a5c0", csik: "#fff", sotet: "#b85a80", cimer: "🏷️" },
  hasonlito: { teto: "#9ec9f0", csik: "#fff", sotet: "#4f86b8", cimer: "⚖️" },
  nagy: { teto: "#b79fd4", csik: "#fce49a", sotet: "#6a4fa8", cimer: "🎪" }
};
function vsSator(x, y, s, k, nagy) {
  var w = (nagy ? 150 : 118) * k, h = (nagy ? 64 : 52) * k, tx = x - w / 2, ty = y - (nagy ? 128 : 108) * k, csikok = nagy ? 7 : 6, cw = w / csikok, i;
  var teto = '<path d="M' + x + ' ' + (ty - 34 * k) + ' L' + (tx - 6 * k) + ' ' + ty + ' L' + (tx + w + 6 * k) + ' ' + ty + ' Z" fill="' + s.teto + '"/>';
  for (i = 1; i < csikok; i += 2) teto += '<path d="M' + x + ' ' + (ty - 34 * k) + ' L' + (tx + i * cw) + ' ' + ty + ' L' + (tx + (i + 1) * cw) + ' ' + ty + ' Z" fill="' + s.csik + '" opacity=".75"/>';
  var fodor = "";
  for (i = 0; i < csikok; i++) fodor += '<path d="M' + (tx + i * cw) + ' ' + ty + ' q' + (cw / 2) + ' ' + (16 * k) + ' ' + cw + ' 0 Z" fill="' + (i % 2 ? s.csik : s.teto) + '" stroke="' + s.sotet + '" stroke-width="' + (1.2 * k) + '" stroke-opacity=".35"/>';
  var oszlop = '<rect x="' + (tx + 4 * k) + '" y="' + ty + '" width="' + (5 * k) + '" height="' + (y - ty) + '" fill="#b08a5a"/><rect x="' + (tx + w - 9 * k) + '" y="' + ty + '" width="' + (5 * k) + '" height="' + (y - ty) + '" fill="#b08a5a"/>';
  var pult = '<rect x="' + (tx - 2 * k) + '" y="' + (y - h * .62) + '" width="' + (w + 4 * k) + '" height="' + (h * .62) + '" rx="' + (6 * k) + '" fill="#e9c99a" stroke="#b08a5a" stroke-width="' + (2 * k) + '"/><rect x="' + (tx - 6 * k) + '" y="' + (y - h * .62 - 6 * k) + '" width="' + (w + 12 * k) + '" height="' + (9 * k) + '" rx="' + (4 * k) + '" fill="#d4ad78"/>';
  var cimer = '<circle cx="' + x + '" cy="' + (ty - 40 * k) + '" r="' + (17 * k) + '" fill="#fffaf0" stroke="' + s.sotet + '" stroke-width="' + (2 * k) + '"/><text x="' + x + '" y="' + (ty - 33 * k) + '" font-size="' + (19 * k) + '" text-anchor="middle">' + s.cimer + '</text>';
  var csillag = nagy ? '<text x="' + (x - 40 * k) + '" y="' + (ty - 20 * k) + '" font-size="' + (14 * k) + '">✨</text><text x="' + (x + 28 * k) + '" y="' + (ty - 24 * k) + '" font-size="' + (12 * k) + '">⭐</text>' : "";
  return '<g>' + oszlop + teto + fodor + pult + cimer + csillag + '</g>';
}
function vsFuzer(y0, szel, n) {
  var s = '<path d="M0 ' + y0 + ' Q' + (szel / 2) + ' ' + (y0 + 34) + ' ' + szel + ' ' + y0 + '" stroke="#a88a6a" stroke-width="1.5" fill="none"/>', sz = ["#f6a5c0", "#fce49a", "#a7d99a", "#9ec9f0", "#b79fd4", "#f7c59f"];
  for (var i = 1; i < n; i++) { var t = i / n, x = t * szel, yy = y0 + 2 * t * (1 - t) * 34; s += '<path d="M' + (x - 9) + ' ' + yy + ' L' + (x + 9) + ' ' + yy + ' L' + x + ' ' + (yy + 18) + ' Z" fill="' + sz[i % 6] + '" opacity=".9"/>'; }
  return s;
}
function vsLampion(x, y, k, i) {
  k = k || 1;
  return '<line x1="' + x + '" y1="' + (y - 14 * k) + '" x2="' + x + '" y2="' + (y - 6 * k) + '" stroke="#a88a6a"/><ellipse cx="' + x + '" cy="' + (y + 6 * k) + '" rx="' + (10 * k) + '" ry="' + (13 * k) + '" fill="#ffcf6e"/><ellipse cx="' + x + '" cy="' + (y + 6 * k) + '" rx="' + (5 * k) + '" ry="' + (11 * k) + '" fill="#ffe6a8" opacity=".8"/>' +
    '<circle cx="' + x + '" cy="' + (y + 6 * k) + '" r="' + (22 * k) + '" fill="#ffdf9e" opacity=".22"><animate attributeName="opacity" values=".16;.3;.2;.28;.16" dur="' + (4 + (i || 0) % 3) + 's" repeatCount="indefinite"/></circle>';
}
/* a menü-liget háttere (rajzterv 1.): a Szorzós liget alkonyi palettája + zászlófüzér, lampionok, szélen csíkos sátrak */
var VASAR_HATTER = '<svg class="hatter" viewBox="0 0 1120 420" preserveAspectRatio="none" aria-hidden="true">' +
  '<defs><linearGradient id="vsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dcc0"/><stop offset=".5" stop-color="#f3e3d3"/><stop offset="1" stop-color="#ece6cf"/></linearGradient>' +
  '<radialGradient id="vsn" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffdf9e" stop-opacity=".9"/><stop offset="1" stop-color="#ffdf9e" stop-opacity="0"/></radialGradient></defs>' +
  '<rect width="1120" height="420" fill="url(#vsg)"/><circle cx="880" cy="70" r="110" fill="url(#vsn)"/>' +
  '<path d="M0 200 Q200 170 400 196 Q600 222 800 190 Q980 166 1120 196 L1120 420 L0 420 Z" fill="#dcc8e2" opacity=".6"/>' +
  '<path d="M0 300 Q280 276 560 296 Q840 316 1120 292 L1120 420 L0 420 Z" fill="#e7d3b4" opacity=".7"/>' +
  vsFuzer(18, 1120, 22) +
  '<g opacity=".55">' + vsSator(70, 400, VS_SZIN.kosar, 1.05) + vsSator(1052, 400, VS_SZIN.arcedula, 1.05) + '</g>' +
  '<g opacity=".35">' + vsSator(190, 410, VS_SZIN.doboz, .8) + vsSator(935, 410, VS_SZIN.hasonlito, .8) + '</g>' +
  vsLampion(300, 70, .9, 0) + vsLampion(820, 64, .9, 1) + vsLampion(560, 84, .8, 2) + '</svg>';

/* ═════════════════ A PÁLYA-JELENET: vásártér, macskaköves út, 5 csíkos sátor + Odú-küszöb (rajzterv 2.) ═════════════════ */
function vasarJelenetSVG(palya, c) {
  var n = palya.allomasok.length, px = [], py = [], k;
  for (k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var d = "M " + px[0].toFixed(1) + " " + py[0].toFixed(1);
  for (var i = 1; i < n; i++) { var dx = px[i] - px[i - 1]; d += " C " + (px[i - 1] + dx / 2).toFixed(1) + " " + py[i - 1].toFixed(1) + " " + (px[i] - dx / 2).toFixed(1) + " " + py[i].toFixed(1) + " " + px[i].toFixed(1) + " " + py[i].toFixed(1); }
  var s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="vsj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dcc0"/><stop offset=".4" stop-color="#f6ead8"/><stop offset="1" stop-color="#eee4c8"/></linearGradient>' +
    '<pattern id="vs-macska" width="22" height="16" patternUnits="userSpaceOnUse"><rect width="22" height="16" fill="#e2cfae"/><ellipse cx="6" cy="5" rx="5" ry="3.5" fill="#d3bd98"/><ellipse cx="17" cy="12" rx="5" ry="3.5" fill="#d3bd98"/></pattern></defs>' +
    '<rect width="1200" height="560" fill="url(#vsj)"/><circle cx="1010" cy="70" r="90" fill="#ffdf9e" opacity=".35"/>' +
    '<path d="M0 170 Q200 140 400 166 Q600 192 800 160 Q1000 132 1200 166 L1200 560 L0 560 Z" fill="#dcc8e2" opacity=".5"/>' +
    '<path d="M0 520 Q300 500 600 520 Q900 540 1200 516 L1200 560 L0 560 Z" fill="#e2cfae"/>' +
    vsFuzer(14, 1200, 24) + vsLampion(120, 60, 1, 0) + vsLampion(470, 70, 1, 1) + vsLampion(820, 58, 1, 2) + vsLampion(1100, 72, 1, 3);
  s += '<g id="kamera"><path d="' + d + '" fill="none" stroke="#c9ad84" stroke-width="52" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="url(#vs-macska)" stroke-width="44" stroke-linecap="round"/>';
  s += '<g transform="translate(' + px[0] + ',' + (py[0] + 34) + ')"><rect x="-34" y="-15" width="68" height="30" rx="12" fill="#fff" stroke="#c9a8e6" stroke-width="2.5"/><text y="5" font-size="14" ' + VS_F + ' fill="#6a4a8a" text-anchor="middle">Rajt</text></g>';
  for (var a = 1; a < n - 1; a++) {
    var st = palya.allomasok[a].stand, sz = VS_SZIN[palya.allomasok[a].szin || st], nev = palya.allomasok[a].nev, w = nev.length * 8.4 + 28, nagy = st === "nagy", sx = px[a] + 44, sy = py[a] - 4;
    if (palya.allomasok[a].szin && st === "doboz") sz = { teto: sz.teto, csik: sz.csik, sotet: sz.sotet, cimer: "📦" };
    s += vsSator(sx, sy, sz, nagy ? .82 : .76, nagy) +
      '<g transform="translate(' + sx.toFixed(1) + ',' + (sy + 22).toFixed(1) + ')"><rect x="' + (-w / 2) + '" y="-13" width="' + w + '" height="26" rx="11" fill="#fff" stroke="' + sz.sotet + '" stroke-width="2" stroke-opacity=".5"/><text y="5" font-size="13.5" ' + VS_F + ' fill="#4a3b7a" text-anchor="middle" font-weight="600">' + kiiras(nev) + '</text></g>';
  }
  var ox = px[n - 1] + 62, oy = py[n - 1] - 6;
  s += '<g transform="translate(' + ox.toFixed(1) + ',' + oy.toFixed(1) + ')"><ellipse cx="0" cy="34" rx="60" ry="16" fill="#6b4a2a" opacity=".22"/>' +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    '<g transform="translate(0,-100)"><rect x="-56" y="-15" width="112" height="30" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/><text x="0" y="5" font-size="14" ' + VS_F + ' fill="#6a4a8a" text-anchor="middle">Odú-küszöb</text></g>' +
    csillagSVG(0, -128, 8, "#ffe08a") + '</g>';
  s += '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g>';
  for (var b = 0; b < n; b++) {
    var bx = b > 0 && b < n - 1 ? px[b] + 96 : px[b], by = b > 0 && b < n - 1 ? py[b] - 70 : py[b];
    s += '<g class="allomas-pipa" id="pipa-' + b + '" transform="translate(' + bx.toFixed(1) + ',' + by.toFixed(1) + ')" opacity="0"><circle r="13" fill="#a7d99a" stroke="#fff" stroke-width="2"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  return s + '</g></svg>';
}

/* ============ 6j4e) ✍️ GARAS TORNYA — ✖️ írásbeli szorzás (2. kör: 2026-11-09) ============
   Terv: terv/irasbeli-haz-recept-lap.html (✅ mind A) · rajz: terv/irasbeli-haz-rajzterv.html (✅) · recept: receptek.js „irasbeli-szorzas”.
   A gyerek a képen: Garas pultja előtt ül a füzete fölött (fuzet.js), ceruzával ír a helyiérték szerinti kockákba; az első asztaloknál
   a tallér-tálcán ő viszi át a 10-es köteget (a mozdulat maga az átvitel). A lap és a tankönyvi lépések: irasbeli-gen.js.
   Halványulás (3. döntés A): 1–2. asztal lépésenként + jelölés + tálca + mondóka minden lépésnél · 3. asztaltól a végén, oszloponként,
   mondóka csak a 2. hibától · Odú-küszöb: üres lap, a végén, + 1 munkafüzet-változat (6. döntés A: hiányos szorzás / hibakeresés).
   Rajt: Garas egyszer végigírja a 213 · 3-at (a „gép ír” mód); átugorható.
   A pálya-kép: a torony belseje, csigalépcső asztalokkal (irLepcsoJelenetSVG, az ösvény-vázon) · a Piactéren: a torony (irTerkepTorony). */

VS_SZIN.irszor1 = { teto: "#f6a5c0", csik: "#fffaf0", sotet: "#c0567f", cimer: "✖️" };
VS_SZIN.irszor2 = { teto: "#9ec9f0", csik: "#fffaf0", sotet: "#5f84b0", cimer: "✖️" };
VS_SZIN.irszor3 = { teto: "#f5cf6a", csik: "#fffaf0", sotet: "#b5842c", cimer: "✖️" };
VS_SZIN.irszor4 = { teto: "#a7d99a", csik: "#fffaf0", sotet: "#5e9a52", cimer: "✖️" };
VS_SZIN.irszor5 = { teto: "#c9b6e8", csik: "#fffaf0", sotet: "#7a5ca8", cimer: "✖️" };
VS_SZIN.irszor6 = { teto: "#f7b98a", csik: "#fffaf0", sotet: "#b35f28", cimer: "✖️" };

/* ═════════════════ SZÁMOK: állomásonként a tankönyvi lépcső (OH-MAT03TB 157–161, 04TB 76–81) ═════════════════ */
function irNincs0(n) { return String(n).indexOf("0") < 0; }
/* hány helyen van továbbvitel (a szorzandó nem utolsó jegyeinél) */
function irAtvitelDb(a, b) {
  var d = irJegyek(a).reverse(), atv = 0, db = 0;
  for (var i = 0; i < d.length - 1; i++) { atv = Math.floor((d[i] * b + atv) / 10); if (atv) db++; }
  return db;
}
function irKeres(gyart, jo) { for (var t = 0; t < 600; t++) { var x = gyart(); if (jo(x[0], x[1])) return x; } return gyart(); }
function irSzamok(forma, cfg, o, i) {
  if (forma === "ket" && o < 4) forma = "tobb";   /* a kétjegyű szorzó 4. o.-tól (recept: osztaly [4, 5, 6]) */
  if (forma === "egy" && cfg.atvitel === 0) return irKeres(function () { return [veletlen(111, 444), veletlen(2, 3)]; }, function (a, b) { return irNincs0(a) && irAtvitelDb(a, b) === 0 && a * b < 1000 && irNincs0(a * b); });
  if (forma === "egy" && cfg.atvitel === 1) return irKeres(function () { return [veletlen(112, 489), veletlen(2, 5)]; }, function (a, b) { return irNincs0(a) && irAtvitelDb(a, b) === 1 && a * b < 1000 && irNincs0(a * b); });   /* 3TB: egy helyen lép át, háromjegyű szorzat */
  if (forma === "nulla") return i % 2 === 0
    ? irKeres(function () { return [veletlen(1, 9) * 100 + veletlen(1, 9), veletlen(2, 9)]; }, function (a, b) { return a * b < 10000; })                       /* 0 a szorzandóban: 208 · 4 */
    : irKeres(function () { return [veletlen(112, 899), veletlen(2, 9)]; }, function (a, b) { return irNincs0(a) && !irNincs0(a * b) && a * b < 10000; });   /* 0 a szorzatban: 125 · 2 */
  if (forma === "ket") return irKeres(function () { return [i === 0 ? veletlen(12, 98) : veletlen(112, 399), veletlen(12, 98)]; }, function (a, b) { return irNincs0(a) && irNincs0(b) && a * b < 10000; });
  /* több helyen átvitel (és a többi): 3–9-es szorzó, legalább két helyen */
  return irKeres(function () { return [o >= 4 && i === 2 ? veletlen(1112, 2499) : veletlen(123, 989), veletlen(3, 9)]; }, function (a, b) { return irNincs0(a) && irAtvitelDb(a, b) >= 2 && a * b < 10000; });
}

/* ── munkafüzet-változatok (Odú-küszöb) ── */
/* hiányos szorzás (3MB, 4MC): a szorzat ott van, a szorzandó egy jegye hiányzik. A szorzó 3, 7 vagy 9: így a jegy egyértelmű */
function irHianyos(a, b) {
  var T = irSzorzas(a, b, { becsles: false, ellenoriz: false, talca: false }), ad = String(a), hi = veletlen(0, ad.length - 1), col = T.U - (ad.length - 1 - hi);
  T.celok.forEach(function (c) { if (c.tip === "szam" && !c.opc) T.gep.push({ r: c.r, c: c.c, v: c.v, tip: "szam" }); });
  T.gep = T.gep.filter(function (g) { return !(g.r === T.muvSor && g.c === col && g.tip === "szam"); });
  T.celok = []; T.lepesek = []; T.csere = [];
  T.lepes("Melyik jegy bújt el? A szorzatból számolj vissza, az egyesekkel kezdd: " + b + "-szer mennyi ad ennyit a végén?", "szamol");
  T.cel(T.muvSor, col, ad[hi]);
  T.hianyos = true;
  return T;
}
/* hibakereső (4MB: „Helyesek-e? Számítással ellenőrizd!”): Garas teleírta a lapot, egy jegyet elrontott (elfelejtette a továbbvitelt) */
function irHibakeres(a, b) {
  var T = irSzorzas(a, b, { becsles: false, ellenoriz: false, talca: false }), elotolt = {}, jelolt = [];
  T.celok.forEach(function (c) { if (c.tip === "szam") { elotolt[c.r + "," + c.c] = c.v; if (c.c < T.U && c.r > T.muvSor) jelolt.push(c); } });
  var rossz = jelolt[veletlen(0, jelolt.length - 1)] || T.celok.filter(function (c) { return c.tip === "szam"; })[0];
  var v = (+rossz.v + 9) % 10; if (v === 0 && rossz.c === Math.min.apply(null, jelolt.map(function (c) { return c.c; }))) v = (+rossz.v + 1) % 10;
  elotolt[rossz.r + "," + rossz.c] = String(v);
  return { T: T, elotolt: elotolt, hk: rossz.r + "," + rossz.c };
}

/* ═════════════════ FELADAT (GEN.irszor) ═════════════════ */
GEN.irszor = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, o = zsOsztaly(), forma = cfg.forma || "egy", valt = null, ab, T, x = { cfg: cfg, konyvelt: {}, poz: "var" };
  if (forma === "vegyes") {   /* Odú-küszöb: a 3-ból 1 munkafüzet-változat, a többi a lépcső nehezebb fokairól */
    if (st.valtI == null) st.valtI = veletlen(0, 2);
    if (i % 3 === st.valtI) valt = Math.random() < .5 ? "hianyos" : "hibakeres";
    forma = valt ? "tobb" : (i % 2 ? (o >= 4 ? "ket" : "nulla") : "tobb");
  }
  if (valt === "hianyos") { ab = [irKeres(function () { return veletlen(123, 989); }, function (a) { return irNincs0(a); }), [3, 7, 9][veletlen(0, 2)]]; T = irHianyos(ab[0], ab[1]); }
  else if (valt === "hibakeres") { ab = irSzamok("tobb", cfg, o, i); var H = irHibakeres(ab[0], ab[1]); T = H.T; x.elotolt = H.elotolt; x.hk = H.hk; }
  else { ab = irSzamok(forma, cfg, o, i); T = irSzorzas(ab[0], ab[1], { talca: !!cfg.talca }); }
  x.T = T; x.valt = valt; x.a = ab[0]; x.b = ab[1];
  x.bemutat = !!cfg.bemutat && i === 0;
  var k = valt === "hianyos" ? ["Melyik jegy bújt el?", "Garas lemásolta ezt a szorzást, de egy jegy kimaradt. Melyik szám bújt el?"] :
          valt === "hibakeres" ? ["Garas elrontott egy jegyet. Keresd meg!", "Garas kiszámolta, de egy jegyet elrontott. Keresd meg, radírozd ki, és írd be jól!"] :
          ["Szorozz írásban: " + ab[0] + " · " + ab[1], "Szorozzuk össze írásban: " + szo(ab[0]) + "-szor " + szo(ab[1]) + "! Előbb becsülj."];
  return { csalad: "jelenet", jelenet: "irszor", ir: x, kartyaHTML: '<span class="bk-kerdes">' + k[0] + '</span>', szoveg: k[0], felolvas: k[1],
    helyes: T.ered, keplet: ab[0] + " · " + ab[1], tipp: "", naplo: { tipus: "irszor", kerdes: ab[0] + "×" + ab[1], helyes: T.ered, forma: valt || forma } };
};

/* ═════════════════ A KÉP: Garas pultja + a füzet alatta ═════════════════ */
JELENETEK.irszor = {
  kep: function (JL) { return JL.keskeny || irOldalt() ? { vb: "0 0 420 200", tabla: null, uni: [64, 190, .4, 1] } : { vb: "0 0 800 200", tabla: null, uni: [118, 192, .46, 1] }; },
  rajz: function (JL) {
    var nk = JL.keskeny || irOldalt(), W = nk ? 420 : 800, x = JL.f.ir, gx = nk ? 268 : 590, s = '<defs>' + GA_DEFS + HE_DEFS + '</defs>';
    s += '<rect width="' + W + '" height="200" fill="url(#ga-fal)"/><path d="M0 46H' + W + 'M0 112H' + W + '" stroke="#e6d6bb" stroke-width="2"/>';
    s += '<path d="M' + (W * .42) + ' 104V44Q' + (W * .42 + 22) + ' 16 ' + (W * .42 + 44) + ' 44V104Z" fill="#cfe3f7" stroke="' + GA_INK + '" stroke-width="2.4"/><path d="M' + (W * .42 + 22) + ' 26V104M' + (W * .42) + ' 70H' + (W * .42 + 44) + '" stroke="#9fb9d6" stroke-width="2"/>';
    /* polc a kész füzetekkel (ahány asztal kész ezen a menetben) */
    var px = W * .42 - 120, kesz = Math.max(0, J.allomasIdx - 1);
    s += '<path d="M' + (px - 6) + ' 66H' + (px + 96) + '" stroke="' + GA_INK + '" stroke-width="6"/><path d="M' + (px - 6) + ' 66H' + (px + 96) + '" stroke="#c99668" stroke-width="3"/>';
    for (var i = 0; i < Math.min(6, kesz); i++) s += '<rect x="' + (px + i * 15) + '" y="38" width="12" height="28" rx="1.5" fill="' + ["#f6a5c0", "#9ec9f0", "#f5cf6a", "#a7d99a", "#c9b6e8", "#f7b98a"][i] + '" stroke="' + GA_INK + '" stroke-width="1.6"/>';   /* a kész asztalok füzetei a polcon */
    /* Garas a pult mögött */
    s += '<g class="ir-garas" transform="translate(' + gx + ' 10) scale(.6)">' + garasPoz(x.poz, x.pozExtra) + '</g>';
    s += '<path d="M' + (gx - 30) + ' 150H' + (gx + 176) + 'V200H' + (gx - 30) + 'Z" fill="#c9905c" stroke="' + GA_INK + '" stroke-width="2.6"/><path d="M' + (gx - 36) + ' 144H' + (gx + 182) + 'V154H' + (gx - 36) + 'Z" fill="#e2b27c" stroke="' + GA_INK + '" stroke-width="2.4"/>';
    s += '<g transform="translate(' + (gx + 22) + ' 140)">' + gaTaller(0, 0, 8, 100) + gaTaller(4, -5, 8, 100) + gaTaller(22, 0, 7, 10) + gaTaller(38, 1, 6, 1) + '</g>';
    s += '<path d="M0 186H' + W + 'V200H0Z" fill="#e3c29a"/>';
    return s;
  },
  indit: function (JL) {
    var x = JL.f.ir;
    irFuzetDoboz(true);
    if (x.bemutat) { irBemutat(JL); return true; }
    irFuzetIndit(JL);
    return false;
  },
  felvesz: function () { return null; }, letesz: function () {},
  katt: function (JL, t) { if (t.closest && t.closest(".ir-garas") && JL.f.ir.poz === "var") { irPoz(JL, "csibesz"); setTimeout(function () { if (JL && JL.f.ir.poz === "csibesz") irPoz(JL, "var"); }, 1800); } },
  bekuld: function () {},
  gepi: function () { return { katt: [] }; }
};
/* széles képernyőn a füzet OLDALT-elrendezése (a lap balra, a kép + a felirat + a tálca jobbra): egy képernyőn elfér (a producer, 11-10) */
function irOldalt() { return window.innerWidth >= 900; }
function irKepAt(F) {   /* a kép (és a gombok) a füzet jobb oszlopába */
  if (!F || !F.oldal) return;
  var k = $("jl-svg") && $("jl-svg").parentNode; if (k) F.oldal.appendChild(k);
  var g = $("ir-fuzet-doboz") && $("ir-fuzet-doboz").querySelector(":scope > .ir-gombok"); if (g) F.oldal.appendChild(g);
}
function irKepVissza() {   /* a kép vissza a panel elejére (más kép előtt, vagy mielőtt a füzet eltűnik) */
  var p = $("jl-panel"), k = $("jl-svg") && $("jl-svg").parentNode;
  if (p && k && k.parentNode !== p) p.insertBefore(k, p.firstChild);
}
function irPoz(JL, poz, extra) { var x = JL.f.ir; x.poz = poz; x.pozExtra = extra || null; var g = JL.svg.querySelector(".ir-garas"); if (g) g.innerHTML = garasPoz(poz, extra); }
/* a füzet doboza a kép alatt (a jl-panelben; más kép előtt a jelenet-motor kiveszi) */
function irFuzetDoboz(uj) {
  var d = $("ir-fuzet-doboz");
  if (d && uj) { irKepVissza(); if (d._F) d._F.torol(); d.parentNode.removeChild(d); d = null; }
  if (!d) {
    d = el("div", "ir-fuzet-doboz"); d.id = "ir-fuzet-doboz";
    var p = $("jl-panel"); p.insertBefore(d, $("jl-gombok"));
  }
  return d;
}
function irFuzetIndit(JL) {
  var x = JL.f.ir, cfg = x.cfg, d = irFuzetDoboz(false), f = JL.f;
  irKepVissza();
  if (d._F) d._F.torol();
  d.innerHTML = "";
  var vez = !!cfg.jelol, kulon = x.valt === "hianyos" || x.valt === "hibakeres";
  var F = fzLap(d, x.T, {
    mod: "gyerek", oldalt: true, ell: vez || kulon ? "lepes" : "vegen", jelol: vez, talca: !!cfg.talca && !kulon, mondoka: vez ? "mindig" : "hiba",
    elotolt: x.elotolt, hibakeres: x.hk, csendesHiba: true,
    onHiba: function (F, info) {
      if (!JL || JL.f !== f) return true;
      var kulcs = info.oszlopok ? "o" + (x.okDb = (x.okDb || 0) + 1) : info.cel ? "c" + info.cel.id : info.hk ? "hk" + Math.random() : "x";
      if (!x.konyvelt[kulcs]) { x.konyvelt[kulcs] = 1; jlRossz("füzet", f.naplo); }   /* egy elrontott jegy egyszer számít */
      irPoz(JL, "mutat");
      clearTimeout(x.pozIdo); x.pozIdo = setTimeout(function () { if (JL && JL.f === f && !F.kesz) irPoz(JL, "hm"); }, 1600);
      return false;
    },
    onLepes: function (F, k) {
      if (!JL || JL.f !== f || F.kesz) return;
      var L = x.T.lepesek[k], db = L && L.talca ? L.talca.muv.filter(function (m) { return m.t === "koteg"; }).length : 0;
      if (db && vez) irPoz(JL, "ujj", { ujj: Math.min(4, db) }); else if (x.poz === "ujj") irPoz(JL, "var");
    },
    onKesz: function () {
      if (!JL || JL.f !== f) return;
      irPoz(JL, "orul");
      jlJo(x.a + " · " + x.b + " = " + x.T.ered, null, function (tovabb) { setTimeout(tovabb, lkCsokkent() ? 300 : 1400); });
    }
  });
  d._F = F; irKepAt(F); jlRajz();
  if (x.valt === "hibakeres") F.felirat("Garas elrontott egy jegyet. Számold újra oszloponként, és radírozd ki a rosszat!", "kerd");
  else if (x.valt === "hianyos") F.felirat("Melyik jegy bújt el? Koppints az üres kockára, és írd be!", "kerd");
  else if (!vez) F.felirat("Előbb becsülj: a B: sorba írd, mennyi lesz körülbelül!");
}
/* Rajt: Garas egyszer végigírja a 213 · 3-at (recept ⑥), a gyerek átugorhatja */
function irBemutat(JL) {
  var x = JL.f.ir, f = JL.f, d = irFuzetDoboz(false);
  d.innerHTML = '<div class="ir-gombok"><button type="button" class="nagy-gomb ir-at">Most én! ▶</button></div>';
  $("buborek-feladat").innerHTML = '<span class="bk-kerdes">Nézd, Garas hogyan szoroz!</span>';
  irPoz(JL, "ir");
  jlRajz(); irPoz(JL, "ir");
  var F = fzLap(d, irSzorzas(213, 3, { talca: true }), { mod: "gep", talca: true, oldalt: true });
  d._F = F; irKepAt(F); jlRajz(); irPoz(JL, "ir");
  function tovabb() {
    if (!JL || JL.f !== f) return;
    irKepVissza(); F.torol(); d.innerHTML = ""; d._F = null;
    try { speechSynthesis.cancel(); } catch (e) {}
    irPoz(JL, "var");
    $("buborek-feladat").innerHTML = f.kartyaHTML;
    irFuzetIndit(JL); mondd(f.felolvas);
  }
  d.querySelector(".ir-at").addEventListener("click", function () { hangGomb(); F.allj(); tovabb(); });
  mondd("Nézd, így szorzok írásban!", function () {
    if (!JL || JL.f !== f || !F.gyoker.isConnected) return;
    F.lejatsz(function () { if (JL && JL.f === f) { irPoz(JL, "orul"); var b = d.querySelector(".ir-at"); if (b) b.textContent = "Most te jössz! ▶"; } });
  });
}

/* ═════════════════ A PÁLYA-KÉP: a torony belseje, csigalépcső, asztalok (rajzterv 3.) ═════════════════ */
function irAsztalSVG(x, y, nev) {
  var w = nev.length * 8.2 + 26;
  return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ')"><path d="M-38 0V34M38 0V34" stroke="' + GA_INK + '" stroke-width="6"/><path d="M-38 0V34M38 0V34" stroke="#b07a4c" stroke-width="3"/>' +
    '<rect x="-46" y="-8" width="92" height="11" rx="3" fill="#c99668" stroke="' + GA_INK + '" stroke-width="2.4"/>' +
    '<g transform="translate(-26 -20) rotate(-3)"><path d="M0 12L22 9L44 12V0L22 -3L0 0Z" fill="url(#ga-kocka)" stroke="' + GA_INK + '" stroke-width="1.8"/><path d="M22 -3V9" stroke="#bfae9a" stroke-width="1.6"/></g>' +
    '<path d="M32 -8V-26" stroke="' + GA_INK + '" stroke-width="2"/><path d="M25 -26H39L35 -37H29Z" fill="#ffe08a" stroke="' + GA_INK + '" stroke-width="1.8"/>' +
    '<g transform="translate(0 52)"><rect x="' + (-w / 2) + '" y="-12" width="' + w + '" height="24" rx="10" fill="#fff" stroke="#c9a476" stroke-width="2"/><text y="5" font-size="13" ' + VS_F + ' fill="#5a3f2a" text-anchor="middle" font-weight="600">' + kiiras(nev) + '</text></g></g>';
}
function irLepcsoJelenetSVG(palya, c) {
  var n = palya.allomasok.length;
  return osvenyVaz(palya, c, {
    hatter: '<defs>' + GA_DEFS + '</defs><rect width="1200" height="560" fill="url(#ga-fal)"/>' +
      '<path d="M0 80H1200M0 170H1200M0 260H1200M0 350H1200M0 440H1200M140 0V80M520 80V170M300 170V260M760 260V350M420 350V440M900 0V80M980 170V260M120 260V350M1060 350V440" stroke="#dccbb0" stroke-width="2"/>' +
      '<g>' + [[200, 120], [1010, 210], [620, 70]].map(function (a) { return '<path d="M' + (a[0] - 16) + ' ' + (a[1] + 30) + 'V' + (a[1] - 8) + 'Q' + a[0] + ' ' + (a[1] - 32) + ' ' + (a[0] + 16) + ' ' + (a[1] - 8) + 'V' + (a[1] + 30) + 'Z" fill="#cfe3f7" stroke="' + GA_INK + '" stroke-width="2.6"/><path d="M' + (a[0] - 16) + ' ' + (a[1] + 30) + 'H' + (a[0] + 16) + '" stroke="#b9a99a" stroke-width="6"/>'; }).join("") + '</g>' +
      '<path d="M0 520H1200V560H0Z" fill="#e3c29a"/><path d="M0 520H1200" stroke="' + GA_INK + '" stroke-width="2.4"/>',
    ut: function (d) {   /* a csigalépcső: fa sáv, fokokkal */
      return '<path d="' + d + '" transform="translate(4 12)" fill="none" stroke="#6e4329" stroke-width="50" stroke-linecap="round" opacity=".18"/>' +
        '<path d="' + d + '" fill="none" stroke="' + GA_INK + '" stroke-width="50" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#d9a874" stroke-width="44" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#b07a4c" stroke-width="44" stroke-dasharray="3 17"/>';
    },
    elotte: function (px, py) {
      var s = '<g transform="translate(' + px[0] + ',' + (py[0] + 34) + ')"><rect x="-34" y="-15" width="68" height="30" rx="12" fill="#fff" stroke="#c9a476" stroke-width="2.5"/><text y="5" font-size="14" ' + VS_F + ' fill="#5a3f2a" text-anchor="middle">Rajt</text></g>';
      for (var a = 1; a < n - 1; a++) s += irAsztalSVG(px[a] + 70, py[a] - 30, palya.allomasok[a].nev);
      s += '<g transform="translate(' + (px[0] + 70) + ' ' + (py[0] - 150) + ') scale(.42)">' + garasPoz("mutat") + '</g>';
      return s;
    },
    odu: { felirat: { font: VS_F } },
    pipa: function (b, px, py) { return b > 0 && b < n - 1 ? [px[b] + 70, py[b] - 92] : [px[b], py[b]]; }
  });
}

/* ═════════════════ A PIACTÉREN: a torony (rajzterv 2.: zárva · hív · folyik · kész) ═════════════════ */
var IR_TORONY_K = .42;
function irTerkepTorony(lepes, J) {
  var all = J.all === "alszik" || J.all === "zarva" ? "zart" : J.vil ? "uj" : J.all === "kesz" || lepes >= 6 ? "kesz" : "folyik";
  var eg = all === "kesz" ? 8 : all === "folyik" ? Math.max(1, Math.min(7, Math.round((lepes - 1) * 8 / 6))) : 0;
  return '<defs>' + GA_DEFS + '</defs><g transform="translate(' + (-100 * IR_TORONY_K) + ' ' + (-362 * IR_TORONY_K) + ') scale(' + IR_TORONY_K + ')"' + (all === "zart" ? ' style="filter:saturate(.55)"' : '') + '>' + gaTorony(all, eg) + '</g>';
}

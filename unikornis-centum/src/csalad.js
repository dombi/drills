/* ============ 6h5) 🏡 SZÁMCSALÁD — a ház képe és játékmenete (Pálya-recept C kör 1. menet, 2026-10-25) ============
   Az első receptes pálya: a sora a receptek.js-ben, a kép a jelenet-motoron (jelenet.js), a keretek (ablak, kavics, kosár, tábla)
   a közös keret.js-ből, a feladat a szamkor100.js-ből (szamCsalad, csaladBol, csaladKosarak, csaladAblakEll).
   Terv: terv/palya-recept-terv.html 6. + 8. pont · terv/eletszeru-100-as-palyak-terv.html 4. pont · rajz: terv/palyahely-rajzterv.html 6. pont
   (✅ jóváhagyva; a kavics felvesz–letesz koppintással, nem húzással). Könyv: OH 2. o. 85. o. (két kosár), 31. o. (kakukktojás).
   MIT TANÍT? Előbb az egész: a 13 az egész, a 8 és az 5 a része — ugyanaz a három szám összeadásban és kivonásban (8 + 5, 5 + 8, 13 − 5, 13 − 8).
   MIT CSINÁL A GYEREK A KÉPEN? A háznak 4 ablaka van (+, +, −, −), mindegyikben 3 kavics-hely. Koppint egy kavicsra a kupacban (a kupacból
   mindig jön új), aztán egy helyre: oda kerül. Jó ablakban meleg fény gyullad. 1 ház = 4 ablak = 1 állomás (egy ablak = egy feladat).
   Állomások: Család 20-ig · Család 100-ig · Kakukktojás (4 kavics: előbb a kosárba teszi, amelyik nem lakik itt) · Két kosár (egy-egy
   kavicsot ő választ, az egészet a táblára írja, utána az ablakok) · Odú-küszöb (halványítás: az ablakban két kavics ül, a hiányzót a táblára írja).
   HIBÁNÁL a megoldást nem írjuk ki: 1. hiba → az ablak sötét marad, a kavicsok kigurulnak, és az egész kavics felfénylik („Melyik az egész?”)
   · 2. hibától → lépésenként: az egész és egy rész a helyére ül, a hang elmondja, az utolsót a gyerek teszi be (beírásnál: a lépések szóban).
   🔒 Kiskapu: csak a 3 kavics fér be; az 5 − 13 nem gyullad fel (kigurul); ami már világít, nem ad újra jutalmat (és nem vehető ki);
   ugyanaz az ablak-alak kétszer nem gyullad fel; a kakukktojás félretevéséért nem jár semmi (a rossz választás a pult naplójába kerül,
   a tény-motorba nem — mint a Rokon-létra „melyik segít?” választása). */

/* az ösvény sátrai (a pálya-kép a vásártér: vasar.js vasarJelenetSVG) — a ház mustár teteje (piac.js PIAC_HAZ_TETO.csalad) */
VS_SZIN.csalad1 = { teto: "#f5c96a", csik: "#fff", sotet: "#c9862a", cimer: "🏡" };
VS_SZIN.csalad2 = { teto: "#f2a96b", csik: "#fff", sotet: "#b8693a", cimer: "🏡" };
VS_SZIN.csalad3 = { teto: "#d9cbe6", csik: "#fff", sotet: "#7a5ea8", cimer: "🥚" };
VS_SZIN.csalad4 = { teto: "#a7d99a", csik: "#fff", sotet: "#5e9a52", cimer: "🧺" };

var CS_JEL = ["+", "+", "−", "−"];
/* a két elrendezés: laptop (széles) és 📱 telefon, álló (a 4 ablak egymás alatt, a kavics ujjnyi: ≥ 44 px) */
var CS_KEP = {
  teljes: { vb: "0 0 800 430", ablak: [[165, 158], [445, 158], [165, 272], [445, 272]], am: 1, km: 1, ajto: [305, 352, 1], uni: [62, 416, .3], fold: 356,
            kupac: function (i, db) { return [710, (db > 3 ? 132 : 150) + i * 58]; }, kosar: [710, 392, 84], tabla: [710, 112, 112, 70], beirTabla: [710, 214, 112, 70],
            kk: { x: [668, 752], y: [226, 280, 334], m: .95, kosarY: 408, kosarW: 66 } },
  keskeny: { vb: "0 0 400 820", ablak: [[200, 150], [200, 272], [200, 394], [200, 516]], am: 1.25, km: 1.3, ajto: [200, 640, 1.15], uni: [352, 656, .26], fold: 640,
            kupac: function (i, db) { return db > 3 ? [50 + i * 70, 724] : [70 + i * 80, 724]; }, kosar: [345, 772, 76], tabla: [318, 716, 120, 80], beirTabla: [200, 728, 150, 86],
            kk: { x: [48, 112, 176], y: [688, 772], m: 1.15, sor: true } }
};
function csK() { return CS_KEP[JL && JL.keskeny ? "keskeny" : "teljes"]; }
function csAz(n) { return (/^[aeiouáéíóöőúüű]/i.test(szo(n)) ? "az " : "a ") + szo(n); }
function csNaplo(p, op, q) { return sk100Naplo(p, op === "+" ? "+" : "-", q, "c"); }

/* ═════════════════ FELADAT (GEN.csalad) ═════════════════
   cfg: max (20 | 100) · kakukk · kosar (Két kosár) · beir (Odú-küszöb: a hiányzó a táblára). Egy ház állomásonként (J.jl), egy ablak = egy feladat. */
GEN.csalad = function (cfg) {
  var st = jlAllapot();
  if (!st.ab) {   /* új ház */
    st.ab = [[null, null, null], [null, null, null], [null, null, null], [null, null, null]]; st.kesz = [false, false, false, false];
    if (cfg.kosar) { st.kosar = csaladKosarak(); st.kosar.va = st.kosar.vb = null; st.cs = null; }
    else st.cs = szamCsalad({ max: cfg.max || 20, kakukk: !!cfg.kakukk });
    st.kakukkKi = !st.cs || st.cs.kakukk == null;
    st.beir = !!cfg.beir;
    if (st.beir) {   /* 🔒 ablakonként SAJÁT család: egy közös családnál a válasz kiolvasható volna a szomszéd ablakból */
      st.csaladok = [];
      while (st.csaladok.length < 4) {
        var uj = szamCsalad({ max: Math.random() < .25 ? 20 : cfg.max || 100 });
        if (!st.csaladok.some(function (c) { return c.z === uj.z || c.x === uj.x; })) st.csaladok.push(uj);
      }
      st.cs = st.csaladok[0];
      st.csaladok.forEach(function (c, i) { var w = c.ablakok[i]; st.ab[i] = [w[0], w[2], w[3]]; st.ab[i][CS_HIANY[i]] = null; });
    }
  }
  var x = {};
  if (!st.cs) {   /* 🧺🧺 Két kosár: előbb a pár és az egész */
    var K = st.kosar, a = K.a[K.va == null ? 0 : K.va], b = K.b[K.vb == null ? 0 : K.vb];
    x.mod = "kosar";
    return csFeladat(x, a + b, csNaplo(a, "+", b), "Válassz egyet mindkét kosárból! Bármelyik jó.", "Válassz egy kavicsot mindkét kosárból, amelyik tetszik! Bármelyik jó.");   /* a producer élő megnézése (10-25): nincs „jó számhármas”, ezt ki kell mondani */
  }
  if (st.beir) {   /* ✍️ Odú-küszöb: ablakonként a hiányzó szám a táblára */
    x.mod = "beir"; x.ablak = st.kesz.indexOf(false);
    var w = csBeirSzamol(st, x.ablak);
    return csFeladat(x, w.c, csNaplo(w.a, w.op, w.b), "Melyik szám hiányzik?", csBeirMondat(st, x.ablak));
  }
  x.mod = "rak";
  var cs = st.cs, sotet = st.kesz.filter(function (k) { return !k; }).length;
  return csFeladat(x, cs.z, cs.naplo, csRakKerdes(st), !st.kakukkKi ? "Az egyik kavics nem ebbe a családba való. Tedd a kosárba!" :
    sotet === 4 ? "Rakd ki a családot mind a négy ablakba!" : csRakKerdes(st));
};
function csRakKerdes(st) {
  var sotet = st.kesz.filter(function (k) { return !k; }).length;
  return !st.kakukkKi ? "Melyik kavics nem lakik itt?" : sotet === 4 ? "Rakd ki a családot az ablakokba!" : sotet === 1 ? "Még egy ablak sötét." : "Még " + sotet + " ablak sötét.";
}
function csFeladat(x, helyes, naplo, kerdes, felolvas) {
  return { csalad: "jelenet", jelenet: "csalad", cs: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(kerdes) + '</span>', szoveg: kerdes, felolvas: felolvas,
    helyes: helyes, keplet: kerdes, tipp: "", naplo: naplo };
}
function csFelirat(szoveg) { JL.f.szoveg = JL.f.keplet = szoveg; $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(szoveg) + '</span>'; }

/* ✍️ Odú-küszöb: melyik hely hiányzik az ablakban — felváltva rész és egész (8 + ? = 13 · 5 + 8 = ? · ? − 8 = 5 · 13 − ? = 8) */
var CS_HIANY = [1, 2, 0, 1];
/* a hiányzó szám kiszámolása (a · op · b = c): ebből jön a napló (tény-motor) és a 2. hiba utáni lépések */
function csBeirSzamol(st, i) {
  var t = (st.csaladok ? st.csaladok[i] : st.cs).ablakok[i], p = t[0], q = t[2], r = t[3], h = CS_HIANY[i], plusz = t[1] === "+";
  if (h === 2) return { a: p, op: plusz ? "+" : "-", b: q, c: r };
  if (h === 0) return { a: r, op: "+", b: q, c: p };          /* ? − 8 = 5 → 5 + 8 */
  return plusz ? { a: r, op: "-", b: p, c: q } : { a: p, op: "-", b: r, c: q };   /* 8 + ? = 13 → 13 − 8 · 13 − ? = 8 → 13 − 8 */
}
function csBeirMondat(st, i) {
  var a = st.ab[i], t = function (v) { return v == null ? "mennyi" : szo(v); };
  var s = t(a[0]) + (CS_JEL[i] === "+" ? " meg " : " mínusz ") + t(a[1]) + ", az " + t(a[2]) + "?";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ═════════════════ A KÉP (JELENETEK.csalad) ═════════════════ */
JELENETEK.csalad = {
  kep: function (JL) {
    var K = csK(), x = JL.f.cs, T = x.mod === "kosar" ? K.tabla : x.mod === "beir" ? K.beirTabla : null;
    return { vb: K.vb, tabla: T, uni: K.uni };
  },
  tablaAll: function (JL) { var k = JL.st.kosar; return JL.f.cs.mod === "kosar" && (k.va == null || k.vb == null) ? "var" : ""; },
  tablaVarMondat: function () { return "Előbb válassz egy kavicsot mindkét kosárból! Bármelyik jó."; },
  rajz: function (JL) { return csHazRajz(JL) + csAblakokRajz(JL) + csKupacRajz(JL); },
  felvesz: function (JL, id) {
    var st = JL.st, p = id.split("-");
    if (JL.f.cs.mod !== "rak") return null;
    if (p[0] === "k") return +p[1];   /* a kupacból mindig jön új */
    var i = +p[1], j = +p[2], n = st.ab[i][j];
    if (st.kesz[i] || n == null) return null;   /* 🔒 ami világít, az nem vehető ki */
    st.ab[i][j] = null;
    return n;
  },
  letesz: function (JL, id, n, hova) {
    var st = JL.st, p = id.split("-"), ho = p[0] === "w" ? [+p[1], +p[2]] : null;
    if (hova === "kosar" && !st.kakukkKi) { if (ho) st.ab[ho[0]][ho[1]] = n; csKakukk(n); return; }
    if (hova && hova.charAt(0) === "a") {
      var c = hova.split("-").slice(1).map(Number);
      if (!st.kakukkKi) { jlRajz(); jlSzol("Előbb a kosárba: melyik kavics nem lakik itt?"); return; }
      if (!st.kesz[c[0]]) {
        var regi = st.ab[c[0]][c[1]];
        st.ab[c[0]][c[1]] = n;
        if (ho && regi != null && (ho[0] !== c[0] || ho[1] !== c[1])) st.ab[ho[0]][ho[1]] = regi;   /* két kő helyet cserél */
        hangGomb();
        jlRajz(); csAblakNez(c[0]); return;
      }
    }
    if (ho) st.ab[ho[0]][ho[1]] = n;   /* nincs kör a közelben: vissza oda, ahonnan jött */
    jlRajz();
  },
  katt: function (JL, t) {
    var v = t.closest ? t.closest(".cs-valaszt") : null, K = JL.st.kosar;
    if (!v || JL.f.cs.mod !== "kosar") return;
    hangGomb();
    if (v.getAttribute("data-k") === "a") K.va = +v.getAttribute("data-i"); else K.vb = +v.getAttribute("data-i");
    JL.rossz = null;
    if (K.va == null || K.vb == null) {   /* az első választás megnyugtat: nem lehet rosszul választani */
      jlRajz();
      if (!K.szolt) { K.szolt = true; mondd("Jó választás! Most a másik kosárból."); }
      return;
    }
    var a = K.a[K.va], b = K.b[K.vb], f = JL.f;
    f.helyes = a + b; f.naplo = csNaplo(a, "+", b);
    csFelirat("Mennyi " + a + " + " + b + "?");
    jlRajz(); mondd("Mennyi " + szo(a) + " meg " + szo(b) + "?");
  },
  bekuld: function (JL, v) {
    var f = JL.f, x = f.cs, st = JL.st;
    if (v === f.helyes) {
      if (x.mod === "kosar") { var K = st.kosar; st.cs = csaladBol(K.a[K.va], K.b[K.vb], 100, null); st.kakukkKi = true; jlJo(K.a[K.va] + " + " + K.b[K.vb] + " = " + v); return; }
      var i = x.ablak; st.ab[i][CS_HIANY[i]] = v; st.kesz[i] = true;
      jlJo(csAblakSzoveg(st.ab[i], i), null, st.kesz.every(Boolean) ? csUnnep : null);
      return;
    }
    JL.rossz = String(v);
    jlRossz(String(v));
    var w = x.mod === "kosar" ? { ugras: sk100Ugras(st.kosar.a[st.kosar.va], "+", st.kosar.b[st.kosar.vb]), op: "+" } : csBeirSzamol(st, x.ablak);
    if (x.mod !== "kosar") w = { ugras: sk100Ugras(w.a, w.op, w.b), op: w.op };
    jlRajz();
    if (JL.seg >= 2) jlSzol(rlLepesMondat(w), true);
    else jlSzol(x.mod === "kosar" ? "Előbb a tízeseket add össze, aztán az egyeseket!" : CS_HIANY[x.ablak] === 2 || CS_HIANY[x.ablak] === 0 ? "Az egész hiányzik: a két rész együtt." : "Egy rész hiányzik: mennyi kell még az egészhez?", true);
    jlFokusz();
  },
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele */
    var st = JL.st, x = JL.f.cs, sel = [];
    var kup = function (n) { return '#jl-svg .jl-fog[data-fog="k-' + n + '"]'; }, hely = function (i, j) { return '#jl-svg .jl-hely[data-hely="a-' + i + '-' + j + '"]'; };
    if (x.mod === "kosar") {
      if (st.kosar.va == null || st.kosar.vb == null) return { katt: ['#jl-svg .cs-valaszt[data-k="a"][data-i="0"]', '#jl-svg .cs-valaszt[data-k="b"][data-i="0"]'] };
      return { gepel: JL.f.helyes };
    }
    if (x.mod === "beir") return { gepel: JL.f.helyes };
    if (!st.kakukkKi) sel.push(kup(st.cs.kakukk), '#jl-svg .jl-hely[data-hely="kosar"]');
    var i = st.kesz.indexOf(false), h = csJoHarmas(st, i);
    h.forEach(function (n, j) { sel.push(kup(n), hely(i, j)); });
    return { katt: sel };
  }
};
function csAblakSzoveg(a, i) { return a[0] + " " + CS_JEL[i] + " " + a[1] + " = " + a[2]; }
/* a még nem világító ablak-alakok közül az első, ami ebbe az ablakba illik (a 2. hiba utáni lépésekhez és a gépi próbához) */
function csJoHarmas(st, i) {
  var c = st.cs, jel = CS_JEL[i] === "+" ? [[c.x, c.y, c.z], [c.y, c.x, c.z]] : [[c.z, c.x, c.y], [c.z, c.y, c.x]];
  return jel.filter(function (h) { return !st.kesz.some(function (k, j) { return k && CS_JEL[j] === CS_JEL[i] && st.ab[j][0] === h[0] && st.ab[j][1] === h[1]; }); })[0] || jel[0];
}

/* ═════════════════ RAJZ ═════════════════ */
function csHazRajz(JL) {
  var K = csK(), s = '', A = K.ajto, sz = JL.keskeny;
  s += '<rect width="' + (sz ? 400 : 800) + '" height="' + (sz ? 820 : 430) + '" fill="url(#lt-gEgA)"/>';
  s += sz ? '<path d="M0 640Q200 626 400 640V820H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>' : '<path d="M0 356Q400 334 800 356V430H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>';
  s += sz ? '<g transform="translate(200 640)" filter="url(#lt-firka)"><path d="' + pcFal(186, 556) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.4"/></g>' +
            '<g filter="url(#lt-firka)"><path d="M4 94Q80 46 200 22Q320 46 396 94Q200 84 4 94Z" fill="url(#lt-gTetoM)" stroke="#c9862a" stroke-width="2.4" stroke-linejoin="round"/></g>'
          : '<g transform="translate(305 352)" filter="url(#lt-firka)"><path d="' + pcFal(292, 262) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.4"/></g>' +
            '<g filter="url(#lt-firka)"><path d="M-4 96Q120 40 305 22Q490 40 614 96Q305 84 -4 96Z" fill="url(#lt-gTetoM)" stroke="#c9862a" stroke-width="2.4" stroke-linejoin="round"/></g>';
  s += '<g class="cs-ajto" transform="translate(' + A[0] + ' ' + A[1] + ') scale(' + A[2] + ')"><g filter="url(#lt-firka)"><path d="M-17 0V-38Q0 -54 17 -38V0Z" fill="#c99272" stroke="#8a5a3a" stroke-width="2.2"/></g><circle cx="9" cy="-19" r="2.4" fill="#8a5a3a"/></g>';
  return s;
}
function csAblakokRajz(JL) {
  var K = csK(), st = JL.st, x = JL.f.cs, s = '';
  st.ab.forEach(function (a, i) {
    var rak = x.mod === "rak" && !st.kesz[i] && !JL.lezart;
    var tart = a.map(function (v) { return v == null && st.beir && !st.kesz[i] ? "?" : v; });
    var all = st.kesz[i] ? "jo" : st.csaladFeny ? "csalad" : x.mod === "beir" && i === x.ablak ? "most" : "";
    if (x.mod === "kosar" || (x.mod === "beir" && i > x.ablak && !st.kesz[i])) tart = [null, null, null];   /* ami még nem soros, az üres */
    s += kfAblak(K.ablak[i][0], K.ablak[i][1], K.am, CS_JEL[i], tart, all,
      function (j) { return rak ? ' class="jl-hely" data-hely="a-' + i + '-' + j + '"' : ''; },
      function (j) { return rak ? ' class="jl-fog" data-fog="w-' + i + '-' + j + '" data-m="' + K.am + '"' : ''; });
  });
  return s;
}
function csKupacRajz(JL) {
  var K = csK(), st = JL.st, x = JL.f.cs, s = '', cs = st.cs;
  if (x.mod === "kosar") {   /* 🧺🧺 két kosár, mindegyikben három kavics: egyet-egyet választ (koppintás: kiemelődik) */
    var kk = K.kk;
    ["a", "b"].forEach(function (k, ki) {
      var sor = st.kosar[k], val = st.kosar[k === "a" ? "va" : "vb"];
      if (kk.sor) s += kfKosar(kk.x[2] + 46, kk.y[ki] + 28, 60, '');
      else s += kfKosar(kk.x[ki], kk.kosarY, kk.kosarW, '');
      sor.forEach(function (n, i) {
        var p = kk.sor ? [kk.x[i], kk.y[ki]] : [kk.x[ki], kk.y[i]];
        s += kfKavics(p[0], p[1], n, kk.m, ' class="cs-valaszt" data-k="' + k + '" data-i="' + i + '"', val === i ? "fenyes" : val != null ? "halvany" : "");
      });
    });
    return s;
  }
  if (x.mod === "beir" || !cs) return s;
  var lista = st.kakukkKi ? cs.kavicsok.filter(function (n) { return n !== cs.kakukk; }) : cs.kavicsok;
  lista.forEach(function (n, i) {
    var p = K.kupac(i, lista.length);
    s += kfKavics(p[0], p[1], n, K.km, JL.lezart ? '' : ' class="jl-fog" data-fog="k-' + n + '" data-m="' + K.km + '"', JL.seg >= 1 && st.kakukkKi && n === cs.z ? "fenyes" : "");
  });
  if (cs.kakukk != null) {   /* 🥚 a kakukktojás kosara: ide teszi, amelyik nem lakik itt */
    s += kfKosar(K.kosar[0], K.kosar[1], K.kosar[2], st.kakukkKi ? '' : 'nem lakik itt', st.kakukkKi ? '' : ' class="jl-hely" data-hely="kosar"');
    if (st.kakukkKi) s += kfKavics(K.kosar[0], K.kosar[1] - 30, cs.kakukk, K.km * .8, '', '');
  }
  return s;
}

/* ═════════════════ JÁTÉKMENET ═════════════════ */
/* 🥚 a kosárba tett kavics: a kakukk → kint van (nem jár érte semmi); családtag → hiba a pult naplójában (a tény-motorba nem kerül),
   és a kép felel: a család ablakai halványan kigyúlnak, a kavics visszamegy */
function csKakukk(n) {
  var st = JL.st, cs = st.cs, f = JL.f;
  if (n === cs.kakukk) {
    st.kakukkKi = true; J.probak = 0; JL.seg = 0;
    hangCsilla(); csFelirat(csRakKerdes(st)); jlRajz();
    jlSzol("Igen, " + csAz(n) + " nem lakik itt! Most jöhetnek az ablakok.");
    return;
  }
  rosszValaszKonyvel({ naplo: { tipus: "kakukk", kerdes: "kakukk: " + cs.kavicsok.join(", "), forma: "c" } }, "kosárba: " + n);
  st.csaladFeny = true; jlRajz();
  jlSzol(csAz(n).charAt(0).toUpperCase() + csAz(n).slice(1) + " ide tartozik, a családhoz. Keresd azt, amelyik nem!", true);
  setTimeout(function () { if (JL && JL.f === f) { st.csaladFeny = false; jlRajz(); } }, window.__UC_GYORS ? 0 : 1400);
  ment();
}
/* egy tele ablak: jó → kigyúl (egy ablak = egy feladat) · ugyanaz az alak, ami már világít → kigurul, nem hiba · rossz → hiba-lépcső */
function csAblakNez(i) {
  var st = JL.st, a = st.ab[i];
  if (a.some(function (v) { return v == null; })) return;
  var keszek = [];
  st.kesz.forEach(function (k, j) { if (k && CS_JEL[j] === CS_JEL[i]) keszek.push([st.ab[j][0], CS_JEL[j], st.ab[j][1], st.ab[j][2]]); });
  var e = csaladAblakEll(st.cs, a[0], CS_JEL[i] === "+" ? "+" : "-", a[1], a[2], keszek.map(function (w) { return [w[0], w[1] === "+" ? "+" : "-", w[2], w[3]]; }));
  if (e.jo) {
    st.kesz[i] = true; hangCsilla();
    jlJo(csAblakSzoveg(a, i), csNaplo(a[0], CS_JEL[i], a[1]), st.kesz.every(Boolean) ? csUnnep : null);
    return;
  }
  if (e.ok === "megvan") { csKigurul(i, "Ez már világít egy másik ablakban. Fordítsd meg!"); return; }
  var c = st.cs, w = CS_JEL[i] === "+" ? csNaplo(c.x, "+", c.y) : csNaplo(c.z, "−", c.x);
  jlRossz(csAblakSzoveg(a, i), w);
  if (JL.seg >= 2) { csKigurul(i, "", function () { csLepesenkent(i); }); return; }
  csKigurul(i, "Ez így nem igaz. Melyik az egész?");
}
/* a kavicsok megrázkódnak, és kigurulnak (az ablak sötét marad) */
function csKigurul(i, mondat, utana) {
  var f = JL.f;
  [].forEach.call(JL.svg.querySelectorAll('.jl-fog[data-fog^="w-' + i + '-"] .kf-ic'), function (x) {
    if (x.animate && !lkCsokkent()) x.animate([{ transform: "translateX(0)" }, { transform: "translateX(6px)" }, { transform: "translateX(-6px)" }, { transform: "translateX(0)" }], { duration: 260, iterations: 2 });
  });
  JL.lezart = true;
  if (mondat) jlSzol(mondat, true);
  setTimeout(function () {
    if (!JL || JL.f !== f) return;
    JL.lezart = false; JL.st.ab[i] = [null, null, null];
    if (utana) utana(); else jlRajz();
  }, lkCsokkent() ? 0 : 620);
}
/* 2. hibától: az egész és egy rész a helyére ül; a hang elmondja; az utolsót a gyerek teszi be */
function csLepesenkent(i) {
  var st = JL.st, h = csJoHarmas(st, i), egesz = st.cs.z;
  if (CS_JEL[i] === "+") { st.ab[i] = [h[0], null, h[2]]; }
  else { st.ab[i] = [h[0], h[1], null]; }
  jlRajz();
  var resz = CS_JEL[i] === "+" ? h[0] : h[1], mondat = "Az egész " + csAz(egesz) + ". Bent van " + csAz(resz) + " is. Melyik kavics hiányzik még?";
  jlSzol(mondat, true);
}
/* a ház kész: mind a négy ablak világít, az unikornis odasétál, és bekopog */
function csUnnep(tovabb) {
  var A = csK().ajto, f = JL.f;
  hangCsilla(); csFelirat("Kopp, kopp!");
  jlUniSetal(A[0] + 34 * A[2], csK().uni[1], function () {
    mondd("Kopp, kopp!");
    var aj = JL.svg.querySelector(".cs-ajto");
    if (aj) pcRezeg(aj);
    setTimeout(function () { if (JL && JL.f === f) tovabb(); }, lkCsokkent() || window.__UC_GYORS ? 0 : 900);
  });
}

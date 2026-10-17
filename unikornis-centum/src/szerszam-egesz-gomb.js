/* ============ 6s5) 🧺 „ELŐBB AZ EGÉSZ” — 🔮 KRISTÁLYGÖMB: a 📜 Tekercs és a 🏅 Mesterpróba között ============
   Terv: Matekos\szerszam-letrak-egesz-kristalygomb.html (✅ 2026-10-16, mind a 4 döntés a javaslat szerint).
   A Mesterpróbán négy új dolog jön egyszerre; a 🔮 egyenként hozza őket, mindegyiket generált feladattal:
     1. egyforma kerítés (A: az egész az ábrában van)           — beírás, a kerítés-ábrával (szerszam-egesz-mester.js)
     2. három teve, tevénként egy csomag (B: keresés a hiányra) — 🐪 rakodás (rakodas.js)
     3. két teve, tevénként két csomag (C: pár a hiányra)       — 🐪 rakodás; néha (≈ ⅓) két megoldás → „van még egy”:
        két tevénél, tevénként két csomaggal ez nem lehet (a két pár mindig egymás párja), ezért akkor tevénként HÁROM csomag jön
     4. két sor, egy csere (D: hol kevés, hol sok)               — két szereplő kártyái, 👆 koppintással cserél (2026-10-17)
   Lift, 🙋 „🧺 Tedd a kosárba!”, végigvezetés, ✋ lépcsőfok-jelzés ugyanúgy, mint a 🏅-on; a 🔮 NAGY feladat a ládában.
   A beírásos feladat kicsijei az N.mester.kicsi listában vannak (segMesterKicsi olvassa); a rakodásé az f.rakKicsi-ben. */

var SEG_GOMB_FORMA = ["kerites", "teve3", "teve22", "csere"];
var SEG_TEVEK = ["Fuvi", "Nuvi", "Tuvi"];
/* 🖊️ lektorra — a 🔮 új mondatai */
var SEG_G_M = {
  keritesVissza: "Ügyes! Ugyanaz, csak nagyobb kerttel. Előbb a teljes kerítés, aztán szétosztod.",
  csereVissza: "Ügyes! Most vissza a nagy cseréhez: előbb az összes, aztán egyikőjüknek mennyi jut.",
  rakVissza: "Előbb az összes súly, aztán egy tevére mennyi jut.",
  egyetlen: function (O, E) { return "Ügyes! Összesen " + O + " kiló, egy tevére " + E + " jut. Ez az egyetlen jó elosztás."; },
  ketto: function (O, E, nv, kell, parok) { return "Mindkettőt megtaláltad! Összesen " + O + " kiló, egy tevére " + E + " jut. " + nv + "nak még " + kell + " kell: ez " + parok + " lehet."; }
};

function segSzamLista(L) { return L.slice(0, -1).join(", ") + " és " + L[L.length - 1]; }
function segOeUj(szo, koztes, csap, valasz) {
  var oe = { szo: szo || "", koztes: {}, masik: {}, csap: {} };
  (koztes || []).forEach(function (x) { segOeAdd(oe, "koztes", x[0], x[1], valasz); });
  (csap || []).forEach(function (x) { segOeAdd(oe, "csap", x[0], x[1], valasz); });
  return oe;
}

/* ═════════════════ 1. EGYFORMA KERÍTÉS ═════════════════ */
/* egy kert: { tri: [szár, szár, alap] } vagy { tegla: [hosszú, rövid] }; S a kerítés körben, s a négyzet oldala */
function segKert(kicsi) {
  for (var t = 0; t < 400; t++) {
    var o;
    if (ekR(0, 2) < 2) {
      var a = kicsi ? ekR(2, 6) : ekR(5, 15), b = kicsi ? ekR(2, 6) : ekR(4, 20);
      if (b >= 2 * a || b < 2) continue;
      o = { tri: [a, a, b], S: 2 * a + b };
    } else {
      var w = kicsi ? ekR(3, 6) : ekR(5, 14), h = kicsi ? ekR(1, w - 1) : ekR(2, w - 1);
      o = { tegla: [w, h], S: 2 * (w + h) };
    }
    if (o.S % 4 || o.S > (kicsi ? 20 : 48) || o.S < (kicsi ? 8 : 16)) continue;
    o.s = o.S / 4;
    var oldalak = o.tri || o.tegla;
    if (oldalak.indexOf(o.s) >= 0) continue;
    return o;
  }
  return { tri: [6, 6, 8], S: 20, s: 5 };
}
function segKertMondat(o) {
  if (o.tegla) return "Vakond Vendel téglalap alakú virágos kertjének két hosszabb oldala " + o.tegla[0] + " méter, a két rövidebb " + o.tegla[1] + " méter.";
  if (o.tri[0] === o.tri[2]) return "Vakond Vendel háromszög alakú virágos kertjének mindhárom oldala " + o.tri[0] + " méter.";
  return "Vakond Vendel háromszög alakú virágos kertjének két oldala " + o.tri[0] + " méter, a harmadik " + o.tri[2] + " méter.";
}
function segKertReszek(o) { return o.tri || [o.tegla[0], o.tegla[1], o.tegla[0], o.tegla[1]]; }
function segKertForma(o) { return o.tri ? "háromszög" : "téglalap"; }
function segKeritesGomb() {
  var o = segKert(false), R = segKertReszek(o), forma = segKertForma(o);
  var csap = (o.tri ? [o.tri[0], o.tri[2]] : o.tegla).map(function (x) { return [x, "A " + x + " a " + forma + " egy oldala. A négyzet kerítése az egész " + forma + " kerítésével egyforma: előbb azt számold ki!"]; });
  var D = {
    abra: { t: "kerites", tri: o.tri || null, tegla: o.tegla || null, sq: "?" },
    mon: [segKertMondat(o), "A négyzet alakú veteményes kertjének ugyanolyan hosszú a kerítése, mint a virágos kertnek (lásd ábra)."],
    kerdes: "Hány méter hosszú a veteményes kert egy oldala?", v: o.s, szo: "a veteményes kert egy oldala",
    oe: segOeUj("a veteményes kert egy oldala", [[o.S, "Ez egy lépcsőfok volt: ennyi a teljes kerítés körben. De a négyzet egy oldalát kérdezték!"]], csap, o.s),
    lep: [{ k: "Milyen hosszú a virágos kert kerítése körben?", v: o.S, m: R.join(" + ") + " = " + o.S }, { k: "Hány méter a veteményes kert egy oldala?", v: o.s, m: o.S + " : 4 = " + o.s }],
    mit: ["hány méter a veteményes kert egy oldala", "milyen hosszú a kerítés körben", "hány méter a " + forma + " egy oldala"],
    elso: "Ne a " + forma + " egyik oldalát keresd a négyzeten! Előbb számold ki, milyen hosszú a virágos kert teljes kerítése, körbe minden oldalon. A veteményes kert kerítése ugyanilyen hosszú: hány egyforma oldalra kell ezt szétosztanod?",
    segit: "Előbb a teljes kerítés: " + R.join(" + ") + ". Ezt kell négy egyforma oldalra szétosztani.",
    uto: "Igen! A teljes kerítés " + o.S + " méter, és ez négy egyforma oldalra " + o.s + " méter.",
    vissza: SEG_G_M.keritesVissza, naplo: "kerites"
  };
  var n = ekR(2, 6), k = segKert(true), kf = segKertForma(k);
  D.kicsi = [
    { mon: ["Vakond Vendel négyzet alakú kertjének minden oldala " + n + " méter."], kerdes: "Hány méter hosszú a kerítése körben?", v: 4 * n,
      abra: { t: "kerites", tri: null, sq: n }, oe: { csap: (function () { var c = {}; c[n] = "A " + n + " egy oldal. A kerítés körbe megy, mind a négy oldalon."; return c; })() } },
    { mon: [segKertMondat(k), "A négyzet alakú kertjének ugyanolyan hosszú a kerítése."], kerdes: "Hány méter hosszú a négyzet alakú kert egy oldala?", v: k.s,
      abra: { t: "kerites", tri: k.tri || null, tegla: k.tegla || null, sq: "?" },
      oe: { koztes: (function () { var c = {}; c[k.S] = "Ez egy lépcsőfok volt: ennyi a teljes kerítés körben. De a négyzet egy oldalát kérdezték!"; return c; })(),
            csap: (function () { var c = {}; (k.tri ? [k.tri[0], k.tri[2]] : k.tegla).forEach(function (x) { if (x !== k.s) c[x] = "A " + x + " a " + kf + " egy oldala. Előbb a teljes kerítés!"; }); return c; })() } }];
  return D;
}

/* ═════════════════ 4. KÉT SOR, EGY CSERE ═════════════════ */
/* n szám soronként; háromnál pontosan egy jó csere (egy fentről, egy lentről) */
function segCsereTabla(n) {
  for (var t = 0; t < 2000; t++) {
    var L = mKever([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2 * n), F = L.slice(0, n).sort(function (a, b) { return a - b; }), A = L.slice(n).sort(function (a, b) { return a - b; });
    var sf = F.reduce(function (a, b) { return a + b; }, 0), sa = A.reduce(function (a, b) { return a + b; }, 0), D = sf - sa;
    if (!D || D % 2) continue;
    var d = D / 2, par = [];
    F.forEach(function (x, i) { A.forEach(function (y, j) { if (x - y === d) par.push([i, j]); }); });
    if (par.length !== (n === 2 ? 2 : 1)) continue;          /* két számpárnál mindig két jó csere van (a megadott szám dönt) */
    return { F: F, A: A, sf: sf, sa: sa, T: sf + sa, E: (sf + sa) / 2, D: Math.abs(D), i: par[0][0], j: par[0][1] };
  }
  return null;
}
/* 👆 a mese-keret (csere-koppintás tervlap 1. döntés ✅): két szereplő kártyái, soronként egyé; aki a megadott kártyát adja,
   és aki cserébe ad egyet a sajátjai közül — a kérdésben benne van a cél (a producer: „nem jön ki, hogy ugyanannyi legyen”) */
function segCsereMon(nev, F, A, ado, g) {
  var kap = 1 - ado;
  return [nev[0][0] + " kártyáin " + segSzamLista(F) + " áll. " + nev[1][0] + " kártyáin " + segSzamLista(A) + " áll.",
    nev[ado][0] + " " + mAz(g) + " " + ekRag(g, "os") + " kártyáját odaadja " + nev[kap][1] + ", " + nev[kap][0] + " pedig cserébe ad neki egyet a sajátjai közül."];
}
function segCsereKerdes(nev, ado) { return "Melyik kártyáját adja " + nev[1 - ado][0] + ", hogy mindkettőjük kártyái együtt ugyanannyit érjenek?"; }
function segCsereGomb() {
  var x = segCsereTabla(3), nev = segNevek(2), ado = ekR(0, 1), gaz = [nev[0][0], nev[1][0]];
  var g = ado === 0 ? x.F[x.i] : x.A[x.j], v = ado === 0 ? x.A[x.j] : x.F[x.i], B = nev[1 - ado][0];
  var kerdes = segCsereKerdes(nev, ado);
  var D = {
    abra: { t: "tabla", sor: [x.F, x.A], csere: [[0, x.i], [1, x.j]], sorCsere: true, kopp: { adott: ado === 0 ? [0, x.i] : [1, x.j], kiemel: true, gazda: gaz } },
    mon: segCsereMon(nev, x.F, x.A, ado, g), kerdes: kerdes, v: v, szo: "melyik kártyát adja " + B, oe: null,
    lep: [{ k: "Mennyit ér mind a hat kártya együtt?", v: x.T, m: x.F.concat(x.A).join(" + ") + " = " + x.T }, { k: "Mennyit kell érjen egyikőjük kártyája?", v: x.E, m: x.T + " : 2 = " + x.E },
          { k: kerdes, v: v, m: ekNagy(mAz(g)) + " " + ekRag(g, "os") + " és " + mAz(v) + " " + ekRag(v, "os") + " helyet cserél: mindkettőjük kártyái " + ekRag(x.E, "t") + " érnek" }],
    mit: ["melyik kártyát adja " + B, "mennyit ér a hat kártya együtt", "mennyit ér egyikőjük kártyája"],
    elso: "Előbb add össze mind a hat kártyát, és oszd el kettejük között! Ennyit kell érjen mindkettőjük kártyája. Most nézd meg: kinél kevés, és kinél sok?",
    segit: "Előbb mind a hat kártya együtt, aztán egyikőjüknek ennek a fele. Most nézd: kinél kevés, kinél sok?",
    uto: "Igen! A hat kártya együtt " + ekRag(x.T, "t") + " ér, egyikőjüknek " + x.E + " jut. " + ekNagy(mAz(g)) + " " + ekRag(g, "os") + " és " + mAz(v) + " " + ekRag(v, "os") + " helyet cserél, és mindkettőjük kártyái " + ekRag(x.E, "t") + " érnek.",
    vissza: SEG_G_M.csereVissza, naplo: "csere"
  };
  var y = segCsereTabla(2), gy = y.A[y.j];
  D.kicsi = [
    { mon: ["Ugyanezek a kártyák."], kerdes: "Mennyit kell érjen egyikőjük kártyája, hogy mindkettőjüké ugyanannyi legyen?", v: x.E,
      abra: { t: "tabla", sor: [x.F, x.A], sorCsere: true, kopp: { nem: true, gazda: gaz } },
      oe: { koztes: (function () { var c = {}; c[x.T] = "Ez egy lépcsőfok volt: ennyit ér mind a hat kártya. Mennyi jut egyikőjüknek?"; return c; })() } },
    { mon: segCsereMon(nev, y.F, y.A, 1, gy), kerdes: segCsereKerdes(nev, 1), v: y.F[y.i],
      abra: { t: "tabla", sor: [y.F, y.A], sorCsere: true, kopp: { adott: [1, y.j], kiemel: true, gazda: gaz } } }];
  return D;
}

/* a beírásos 🔮 feladat (a 🏅 beírásos útja, de 🙋-val és arany szegély nélkül) */
function segGombBeiras(D) {
  var oe = D.oe, M = { keret: "gomb", mondatok: D.mon, kerdes: D.kerdes, helyes: D.v, oe: oe, lep: D.lep, mit: D.mit, rajz: '<div class="eg-abra"></div>', fid: "EGESZ-gomb-" + D.naplo };
  var L = liftUj({ sz: "EGESZ", palya: J.palya.id, fok: "gomb", fid: M.fid });
  L.nagy = true; L.kicsiJoKell = 1; J.polc.L = L; J.polc.kicsiHiba = 0; J.sz.L = L;
  var F = polcNagy(M, "EGESZ", "gomb", L);
  F.mester = { kicsi: D.kicsi, elso: D.elso, vissza: D.vissza };   /* a kicsi testvérek és a végigvezetés első mondata (olvaso-polc.js + segMesterKicsi) */
  F.kicsiGen = segMesterKicsi; F.egAbra = segAbraUj(D.abra, D.segit);
  if (D.abra.kopp && D.abra.kopp.adott) F.oe = M.oe = segKoppOe(F.egAbra.p, D.v, D.szo);   /* 👆 a koppintott kártya a válasz */
  F.utoMondat = D.uto; F.naplo.tipus = "sz-egesz-gomb-" + D.naplo;
  F.kartyaHTML = opKonyv(F.op);
  return F;
}

/* ═════════════════ 2–3. TEVÉK ═════════════════ */
/* T teve, tevénként per új csomag; ketto: két megoldás kell (különben pontosan egy) */
function segTeveR(T, per, ketto) {
  for (var t = 0; t < 4000; t++) {
    var L = mKever([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, T + T * per), fix = L.slice(0, T).map(function (x) { return [x]; }), uj = L.slice(T).sort(function (a, b) { return a - b; });
    var O = L.reduce(function (a, b) { return a + b; }, 0);
    if (O % T) continue;
    var E = O / T, megold = segTeveMegold(fix, uj, per, E);
    if (megold.length !== (ketto ? 2 : 1)) continue;
    if (fix.some(function (f) { return f[0] >= E; })) continue;
    return { tevek: SEG_TEVEK.slice(0, T), fix: fix, uj: uj, per: per, megold: megold };
  }
  return null;
}
/* az összes jó elosztás: tevénként a csomagok (növekvő sorrendben) */
function segTeveMegold(fix, uj, per, E) {
  var T = fix.length, ki = [];
  (function lep(k, marad, eddig) {
    if (k === T) { ki.push(eddig.slice()); return; }
    var kell = E - fix[k][0];
    segReszek(marad, per).forEach(function (r) {
      if (r.reduce(function (a, b) { return a + b; }, 0) !== kell) return;
      eddig.push(r); lep(k + 1, marad.filter(function (x) { return r.indexOf(x) < 0; }), eddig); eddig.pop();
    });
  })(0, uj.slice(), []);
  return ki;
}
function segReszek(L, n) {
  if (!n) return [[]];
  var ki = [];
  L.forEach(function (x, i) { segReszek(L.slice(i + 1), n - 1).forEach(function (r) { ki.push([x].concat(r)); }); });
  return ki;
}
function segTeveMon(R) {
  var T = R.tevek.length, mon = [];
  mon.push((T === 3 ? "Három teve, " + R.tevek[0] + ", " + R.tevek[1] + " és " + R.tevek[2] : "Két teve, " + R.tevek[0] + " és " + R.tevek[1]) + " csomagokat szállít.");
  mon.push(R.tevek.map(function (nv, k) { return nv + " hátán " + (k === 0 ? "már van " : "") + "egy " + R.fix[k][0] + " kilós" + (k === 0 ? " csomag" : ""); }).join(", ") + ".");
  var n = R.uj.length, szo = { 2: "két", 3: "három", 4: "négy", 6: "hat" }[n] || n;
  mon.push("Még " + szo + " csomagot kell felrakni: " + R.uj.map(function (x) { return "egy " + x; }).join(", ").replace(/, (egy \d+)$/, " és $1") + " kilósat.");
  mon.push("Mindegyik teve " + ["", "egy", "két", "három"][R.per] + " új csomagot visz" + ", és " + (T === 2 ? "a két tevén" : "mindhárom tevén") + " ugyanakkora legyen a teher.");
  return mon;
}
function segTeveGomb(forma) {
  var ketto = forma === "teve22" && ekR(0, 2) === 0;
  var R = forma === "teve3" ? segTeveR(3, 1, false) : ketto ? segTeveR(2, 3, true) : segTeveR(2, 2, false);
  if (!R) R = segTeveR(2, 1, false);
  var O = rakOssz(R), E = rakEgy(R), kerdes = R.per === 1 ? "Melyik teve melyik csomagot vigye?" : "Melyik teve mely csomagokat vigye? Keresd meg az összes lehetőséget!";
  var indok = R.per === 1 ? "" : R.megold.length > 1
    ? SEG_G_M.ketto(O, E, R.tevek[0], E - R.fix[0][0], R.megold.map(function (m) { return m[0].join(" + "); }).join(" vagy "))
    : SEG_G_M.egyetlen(O, E);
  var c = segRakFeladat(segRakMasol(R), { fok: "gomb", fid: "EGESZ-gomb-" + forma, mon: segTeveMon(R), kerdes: kerdes, vissza: SEG_G_M.rakVissza, indok: indok,
    tobb: R.per === 1 ? "három tevével" : R.per === 2 ? "tevénként két csomaggal" : "tevénként három csomaggal" });
  /* a lift kicsijei: kevesebb teve, tevénként egy csomag */
  var k1 = segTeveR(2, 1, false), k2 = forma === "teve3" ? segTeveR(2, 1, false) : R.per === 3 ? segTeveR(2, 2, false) : segTeveR(3, 1, false);
  c.rakKicsi = [k1, k2].filter(Boolean).map(function (r) { return { R: r, mon: segTeveMon(r), kerdes: "Melyik teve melyik csomagot vigye?" }; });
  return segRakNagy(c, 1);
}

/* ═════════════════ a 🔮 pálya i. feladata (szerszam-egesz.js segFeladat hívja) ═════════════════ */
var SEG_GOMB_VOLT = {};       /* formánként az előző feladat szövege: ugyanaz ne jöjjön kétszer egymás után (gépi próba, matek-őr) */
function segGomb(i) {
  var forma = SEG_GOMB_FORMA[i % SEG_GOMB_FORMA.length], F, sz;
  for (var t = 0; t < 6; t++) {
    F = forma === "kerites" ? segGombBeiras(segKeritesGomb()) : forma === "csere" ? segGombBeiras(segCsereGomb()) : segTeveGomb(forma);
    sz = F.op.mondatok.join(" ");
    if (sz !== SEG_GOMB_VOLT[forma]) break;
  }
  SEG_GOMB_VOLT[forma] = sz;
  return F;
}

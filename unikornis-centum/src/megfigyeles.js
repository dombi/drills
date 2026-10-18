/* ============ 3c5) 🔍 MEGFIGYELÉS — a gyerek-jellemzés mondatai (közös: játék + pult) ============
   Terv: Matekos\pult-atrendezes-terv.html 4c. pont, „B) A mondatok szabályai” + „D) A közös modul”
   (✅ jóváhagyva 2026-10-18, mind A: 4 „mi hajtja” csoport · 3 nap · 60 nap; Pult-átrendezés 2b. kör).
   Tiszta függvények: nem ír semmit, nem használja a P()-t. A játék is betölti (build.py, a megf-naplo.js után;
   a 3. körben ebből lép magától), a pult is (<script src="../src/megfigyeles.js">) — ugyanaz a fájl.

   Bemenet: egy GYEREK összes unikornisának mentése (tömb) — összevonva, mert a gyerek a lényeg, nem az unikornis.
     mentes.mf      — napi napló (megf-naplo.js): mf[„2026-10-18”] = { i, nu, v{n,e,f,t,mp}, k{állomás:db}, mp, u{cél:db} }
     mentes.tud     — tudás-napló (tudas.js): tud[palyaId] = { n:[tenyNap…], megy: nap|null }
     mentes.tenyek / mentes.tenyTipus — tény-motor (teny.js): sor.d (doboz), sor.h (utolsó 6 eredmény)
   A pult a 2a előtti napokat a 90 napos eseménynaplóból pótolja UGYANILYEN mf-alakba, és egy plusz „mentésként” adja át.
   opc: { nev(pid) → pálya neve, liget(pid) → { k: kulcs, nev }, most: ms (teszthez) }

   Kimenet: { keves, napDb, napok, rovatok: hajt / kedv / biztos / epul / akad (mondat + „miért gondolom?” sorok),
              palya[pid] = { jel: biztos|epul|akad|null, … számok }, kartya: { mondat, jelek } }.
   A mondatok sima szövegek (a pult maga escape-eli). A gyerek ebből SEMMIT nem lát. */

var MEGFIGY = {
  nap: 30,          /* az ítéletek ennyi nap napi naplójából */
  kevesNap: 3,      /* ennél kevesebb játéknap az utolsó 30-ban = „Még kevés…” */
  epulNap: 2,       /* 🌿: legalább ennyi különböző napon végigvitte */
  arany: 0.6,       /* 🌿 elsőre jó ≥ 60% (a napok átlaga — egy hosszú nap ne torzítson); 🌱 egy nap 60% alatt */
  akadNap: 3,       /* 🌱: legalább ennyi különböző napon 60% alatt — és a legutóbbi napján is (ha azóta javult, nem akad) */
  kilepNap: 2,      /* 🌱: legalább ennyi különböző napon ugyanannál az állomásnál kilépett · 😊 kerül: ennyi napon félbehagyta */
  kedvNap: 2,       /* 😊 kedvenc: legalább ennyi különböző napon indította */
  hajtDb: 5,        /* 🧭: legalább ennyi pálya-vég „utána” adat… */
  hajtNap: 3        /* …legalább ennyi különböző napról; a nyerő csoportba legalább a fele essen */
};
/* 🧭 a „pálya után hová ment” célok csoportjai (a „masik” = másik, már ismert pálya: semleges, csak a nevezőbe számít —
   a napló nem tudja, másik ligetben volt-e) */
var MEGFIGY_HAJT = {
  gyujto: { nev: "a gyűjtögetés", ikon: "🧺", celok: ["utca", "odu", "bank", "szalon"] },
  siker: { nev: "a siker", ikon: "🏆", celok: ["ujra"] },
  felfedezo: { nev: "a felfedezés", ikon: "🧭", celok: ["uj"] },
  gondoskodo: { nev: "a gondoskodás", ikon: "🌱", celok: ["kert", "tunemenykert"] }
};
var MEGFIGY_CEL_SZO = { utca: "bolt/utca", odu: "odú", bank: "bank", szalon: "fodrászat", ujra: "ugyanaz a pálya újra",
  uj: "még sosem játszott pálya", masik: "másik, ismert pálya", kert: "kert", tunemenykert: "Tüneménykert" };
var MEGFIGY_CEL_TETT = { utca: "a boltba / az utcára ment", odu: "az odúba ment", bank: "a bankba ment", szalon: "a fodrászatba ment",
  ujra: "ugyanazt a pályát játszotta újra", uj: "egy még sosem játszott pályát indított", masik: "egy másik, ismert pályát indított",
  kert: "a kertbe ment", tunemenykert: "a Tüneménykertbe ment" };
var MEGFIGY_TENY_TABLA = [["ok", "az összeadás–kivonás 20-ig"], ["sd", "a szorzás–osztás 10 × 10"]];
var MEGFIGY_TIPUS_NEV = { t10: "kerek tízesek", e1: "kétjegyű ± egyjegyű átlépés nélkül", e1a: "kétjegyű ± egyjegyű átlépéssel",
  tz: "kétjegyű ± kerek tízes", k2: "kétjegyű ± kétjegyű átlépés nélkül", k2a: "kétjegyű ± kétjegyű átlépéssel", sb: "százas barátok" };

function megfigyNapKulcs(ms) {
  var d = new Date(ms);
  return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
}
function megfigyPct(x) { return Math.round(x * 100) + "%"; }
function megfigyNo(o, k, db) { o[k] = (o[k] || 0) + (db == null ? 1 : db); }

/* több unikornis napi naplója egybe: napra összeadva (a gyerek a lényeg) */
function megfigyOsszevon(mentesek) {
  var ki = {};
  (mentesek || []).forEach(function (m) {
    var mf = m && m.mf;
    if (!mf || typeof mf !== "object") return;
    Object.keys(mf).forEach(function (nap) {
      var d = mf[nap] || {}, c = ki[nap] || (ki[nap] = { i: {}, nu: {}, v: {}, k: {}, mp: 0, u: {} });
      c.mp += +d.mp || 0;
      ["i", "u"].forEach(function (m2) { var o = d[m2] || {}; Object.keys(o).forEach(function (x) { megfigyNo(c[m2], x, +o[x] || 0); }); });
      Object.keys(d.nu || {}).forEach(function (x) { c.nu[x] = 1; });
      Object.keys(d.v || {}).forEach(function (pid) {
        var s = d.v[pid] || {}, t = c.v[pid] || (c.v[pid] = { n: 0, e: 0, f: 0, t: 0, mp: 0 });
        ["n", "e", "f", "t", "mp"].forEach(function (m3) { t[m3] += +s[m3] || 0; });
      });
      Object.keys(d.k || {}).forEach(function (pid) {
        var s = d.k[pid] || {}, t = c.k[pid] || (c.k[pid] = {});
        Object.keys(s).forEach(function (a) { megfigyNo(t, a, +s[a] || 0); });
      });
    });
  });
  return ki;
}
function megfigyJatekNap(d) {
  return !!d && (d.mp > 0 || Object.keys(d.i).length > 0 || Object.keys(d.v).length > 0 || Object.keys(d.k).length > 0);
}

/* pályánként, a napok szerint (minden számlálás KÜLÖNBÖZŐ napokra megy, nem darabra) */
function megfigyPalyak(napok, mf) {
  var P = {};
  function sor(pid) { return P[pid] || (P[pid] = { pid: pid, inditNap: 0, inditDb: 0, vegNap: 0, vegDb: 0, e: 0, f: 0, napArany: [], gyengeNap: 0, felbeNap: 0, kilepAll: {}, kilepDb: 0 }); }
  napok.forEach(function (nap) {
    var d = mf[nap];
    Object.keys(d.i).forEach(function (pid) {
      if (!(d.i[pid] > 0)) return;
      var p = sor(pid), vn = d.v[pid] ? d.v[pid].n : 0;
      p.inditNap++; p.inditDb += d.i[pid];
      if (d.i[pid] > vn) p.felbeNap++;          /* aznap elindította, de (legalább egyszer) nem vitte végig */
    });
    Object.keys(d.v).forEach(function (pid) {
      var p = sor(pid), s = d.v[pid];
      if (!(s.n > 0)) return;
      p.vegNap++; p.vegDb += s.n; p.e += s.e; p.f += s.f;
      if (s.f > 0) { var a = s.e / s.f; p.napArany.push(a); if (a < MEGFIGY.arany) p.gyengeNap++; }
    });
    Object.keys(d.k).forEach(function (pid) {
      var p = sor(pid), ma = 0;
      Object.keys(d.k[pid]).forEach(function (a) { if (d.k[pid][a] > 0) { megfigyNo(p.kilepAll, a); p.kilepDb += d.k[pid][a]; ma++; } });   /* kilepAll[állomás] = hány különböző napon */
      if (ma && !(d.i[pid] > 0)) p.felbeNap++;               /* napló-pótlásnál előfordulhat indítás nélküli kilépés */
    });
  });
  Object.keys(P).forEach(function (pid) {
    var p = P[pid];
    p.atlag = p.napArany.length ? p.napArany.reduce(function (s, x) { return s + x; }, 0) / p.napArany.length : null;
    var top = Object.keys(p.kilepAll).sort(function (a, b) { return p.kilepAll[b] - p.kilepAll[a] || a - b; })[0];
    p.kilepTop = top ? { allomas: +top, nap: p.kilepAll[top] } : null;
  });
  return P;
}

/* 🌱 az elsőre-jó miatt akad: legalább 3 napon 60% alatt, ÉS a legutóbbi napján is (ha azóta javult, már nem akad) */
function megfigyGyenge(p) {
  return p.gyengeNap >= MEGFIGY.akadNap && p.napArany.length > 0 && p.napArany[p.napArany.length - 1] < MEGFIGY.arany;
}

/* tudás-napló, unikornisok összevonva: „megy”, ha bármelyiknél megy; a tiszta napok uniója */
function megfigyTudas(mentesek) {
  var ki = {};
  (mentesek || []).forEach(function (m) {
    var t = m && m.tud;
    if (!t || typeof t !== "object") return;
    Object.keys(t).forEach(function (pid) {
      var s = t[pid] || {}, o = ki[pid] || (ki[pid] = { megy: false, napok: {} });
      if (typeof s.megy === "number") o.megy = true;
      (Array.isArray(s.n) ? s.n : []).forEach(function (n) { o.napok[n] = 1; });
    });
  });
  Object.keys(ki).forEach(function (pid) { ki[pid].napDb = Object.keys(ki[pid].napok).length; });
  return ki;
}

/* tény-motor, unikornisok összevonva: tényenként a legjobb doboz (ha valamelyik unikornissal tudja, a gyerek tudja) */
function megfigyTenyTar(mentesek, mezo) {
  var ki = {};
  (mentesek || []).forEach(function (m) {
    var t = m && m[mezo];
    if (!t || typeof t !== "object") return;
    Object.keys(t).forEach(function (k) { var s = t[k]; if (s && (!ki[k] || (s.d || 0) > (ki[k].d || 0))) ki[k] = s; });
  });
  return ki;
}
function megfigyLepcso(s) {
  if (typeof tenyLepcso === "function") return tenyLepcso(s || { d: 0 });
  var d = s ? s.d || 0 : 0;
  return d >= 4 ? "villam" : d === 3 ? "tudja" : d >= 1 ? "tanulja" : "uj";
}
function megfigyBotlott(s) { return !!s && /H/.test(String(s.h || "").slice(-3)); }   /* az utolsó 3 próbában botlott */

/* ── a fő függvény ─────────────────────────────────────────────────────── */
function megfigyeles(mentesek, opc) {
  opc = opc || {};
  var nev = opc.nev || function (pid) { return pid; };
  var ligetF = opc.liget || function () { return null; };
  var most = opc.most || Date.now(), hatar = megfigyNapKulcs(most - (MEGFIGY.nap - 1) * 86400000), ma = megfigyNapKulcs(most);
  var mf = megfigyOsszevon(mentesek);
  var napok = Object.keys(mf).filter(function (n) { return n >= hatar && n <= ma && megfigyJatekNap(mf[n]); }).sort();
  var R = { keves: napok.length < MEGFIGY.kevesNap, napDb: napok.length, napok: napok, palya: {}, kedv: [], biztos: [], epul: [], akad: [], hajt: null };
  var PL = megfigyPalyak(napok, mf), TUD = megfigyTudas(mentesek);

  if (R.keves) R.kevesMondat = "Még kevés játékot láttam ahhoz, hogy biztosan jellemezzem — az utolsó " + MEGFIGY.nap + " napban " +
    (napok.length ? "eddig " + napok.length + " napot játszott" : "nem játszott") + ".";

  /* 🌳🌿🌱 pályánként — sorrend: biztos > akad > épül */
  var pidek = {};
  Object.keys(PL).forEach(function (p) { pidek[p] = 1; });
  Object.keys(TUD).forEach(function (p) { if (TUD[p].megy) pidek[p] = 1; });
  Object.keys(pidek).forEach(function (pid) {
    var p = PL[pid] || null, t = TUD[pid] || null, jel = null, tetel = null;
    var szam = p ? [nev(pid) + " (utolsó " + MEGFIGY.nap + " nap): " + p.inditNap + " napon indította, " + p.vegNap + " napon végigvitte (" + p.vegDb + "×)" +
      (p.atlag != null ? ", elsőre jó naponként átlagosan " + megfigyPct(p.atlag) + " (összesen " + p.e + "/" + p.f + ")" : "") +
      (p.gyengeNap ? ", " + p.gyengeNap + " napon 60% alatt" + (p.gyengeNap >= MEGFIGY.akadNap && !megfigyGyenge(p) ? " (de a legutóbbi napján már nem — javult)" : "") : "") +
      (p.kilepTop ? ", kilépett: " + Object.keys(p.kilepAll).map(function (a) { return a + ". állomás " + p.kilepAll[a] + " napon"; }).join(", ") : "") + "."] : [];
    if (t && t.napDb) szam.push("Tudás-napló: " + t.napDb + " különböző napon tiszta (kerülő nélküli) végigjátszás" + (t.megy ? " → „megy”." : "; 3 kell a „megy”-hez."));
    if (t && t.megy) {
      jel = "biztos";
      tetel = { pid: pid, mondat: "Már megy: " + nev(pid) + " — " + t.napDb + " különböző napon tisztán végigvitte.", miert: szam };
    } else if (p && (megfigyGyenge(p) || (p.kilepTop && p.kilepTop.nap >= MEGFIGY.kilepNap))) {
      jel = "akad";
      var ok = megfigyGyenge(p)
        ? p.gyengeNap + " napon is 60% alatt volt az elsőre jó"
        : p.kilepTop.nap + " napon is a " + p.kilepTop.allomas + ". állomásnál lépett ki";
      tetel = { pid: pid, mondat: "Akasztja meg: " + nev(pid) + " — " + ok + ".", miert: szam };
    } else if (p && p.vegNap >= MEGFIGY.epulNap && p.atlag != null && p.atlag >= MEGFIGY.arany) {
      jel = "epul";
      tetel = { pid: pid, mondat: "Tudja, de még nem biztos: " + nev(pid) + " — " + p.vegNap + " napon " + megfigyPct(p.atlag) + " elsőre jó.", miert: szam };
    }
    R.palya[pid] = { jel: jel, szam: szam, p: p, tud: t };
    if (tetel) R[jel].push(tetel);
  });
  function erosseg(x) { var p = R.palya[x.pid].p; return p ? p.vegNap + p.inditNap : 0; }
  R.biztos.sort(function (a, b) { return R.palya[b.pid].tud.napDb - R.palya[a.pid].tud.napDb; });
  R.epul.sort(function (a, b) { return erosseg(b) - erosseg(a); });
  R.akad.sort(function (a, b) { var x = R.palya[a.pid].p, y = R.palya[b.pid].p; return (y.gyengeNap + (y.kilepTop ? y.kilepTop.nap : 0)) - (x.gyengeNap + (x.kilepTop ? x.kilepTop.nap : 0)); });

  /* 🌳🌿🌱 a tény-kertben: táblánként (20-ig, 10 × 10) + a 100-as kör típusai */
  var tenyek = megfigyTenyTar(mentesek, "tenyek"), tipusok = megfigyTenyTar(mentesek, "tenyTipus");
  if (typeof tenyMind === "function") MEGFIGY_TENY_TABLA.forEach(function (x) {
    var o = { villam: 0, tudja: 0, tanulja: 0, uj: 0 }, botlo = 0;
    tenyMind(x[0]).forEach(function (k) { o[megfigyLepcso(tenyek[k])]++; if (megfigyBotlott(tenyek[k])) botlo++; });
    var latott = o.villam + o.tudja + o.tanulja, megy = o.villam + o.tudja;
    if (!latott) return;
    var miert = ["Tény-motor, " + x[1] + ": " + o.villam + " villám · " + o.tudja + " tudja · " + o.tanulja + " tanulja · " + o.uj + " még nem látta" +
      (botlo ? " · " + botlo + " ténynél botlott az utolsó 3 próbában" : "") + ". 🌳 = a már látott tények többsége tudja vagy villám."];
    if (megy * 2 > latott) R.biztos.push({ teny: x[0], mondat: "A Tény-kertben " + x[1] + " jól megy: " + latott + " gyakorolt tényből " + megy + " már biztos (" + o.villam + " villámgyorsan).", miert: miert });
    if (o.tanulja) R.epul.push({ teny: x[0], mondat: "A Tény-kertben " + x[1] + ": " + o.tanulja + " tényt még tanul" + (megy * 2 > latott ? "." : ", " + megy + " már megy."), miert: miert });
    if (botlo) R.akad.push({ teny: x[0], mondat: "A Tény-kertben " + x[1] + ": " + botlo + " ténynél botlott mostanában.", miert: miert });
  });
  var tb = [], tt = [];
  Object.keys(MEGFIGY_TIPUS_NEV).forEach(function (k) {
    var l = megfigyLepcso(tipusok[k]);
    if (l === "villam" || l === "tudja") tb.push(MEGFIGY_TIPUS_NEV[k]); else if (l === "tanulja") tt.push(MEGFIGY_TIPUS_NEV[k]);
  });
  if (tb.length || tt.length) {
    var tm = ["Tény-motor, a 100-as kör típusai: " + Object.keys(MEGFIGY_TIPUS_NEV).filter(function (k) { return tipusok[k]; })
      .map(function (k) { return MEGFIGY_TIPUS_NEV[k] + " — " + megfigyLepcso(tipusok[k]); }).join("; ") + "."];
    if (tb.length) R.biztos.push({ teny: "tipus", mondat: "A 100-as körben már megy: " + tb.join(", ") + ".", miert: tm });
    if (tt.length) R.epul.push({ teny: "tipus", mondat: "A 100-as körben még tanulja: " + tt.join(", ") + ".", miert: tm });
  }

  /* 😊 Kedv — mit választ magától (különböző napok szerint), mit hagy félbe */
  var lig = {};
  napok.forEach(function (nap) {
    var volt = {};
    Object.keys(mf[nap].i).forEach(function (pid) { if (!(mf[nap].i[pid] > 0)) return; var l = ligetF(pid); if (l && !volt[l.k]) { volt[l.k] = 1; var o = lig[l.k] || (lig[l.k] = { nev: l.nev, nap: 0 }); o.nap++; } });
  });
  var inditNapok = napok.filter(function (n) { return Object.keys(mf[n].i).some(function (pid) { return mf[n].i[pid] > 0; }); }).length;
  var ligL = Object.keys(lig).map(function (k) { return lig[k]; }).sort(function (a, b) { return b.nap - a.nap; });
  var palL = Object.keys(PL).map(function (k) { return PL[k]; }).filter(function (p) { return p.inditNap > 0; })
    .sort(function (a, b) { return b.inditNap - a.inditNap || b.inditDb - a.inditDb; });
  var kedvMiert = ["Az utolsó " + MEGFIGY.nap + " napból " + inditNapok + " napon indított pályát. Ligetenként, hány KÜLÖNBÖZŐ napon választotta (nem a darabszám, hogy egy hosszú nap ne torzítson): " +
    (ligL.length ? ligL.map(function (l) { return l.nev + " " + l.nap; }).join(", ") : "–") + ".",
    "Pályánként: " + (palL.length ? palL.slice(0, 6).map(function (p) { return nev(p.pid) + " " + p.inditNap + " napon (" + p.inditDb + "×)"; }).join(", ") : "–") + "."];
  if (ligL.length && ligL[0].nap >= MEGFIGY.kedvNap && (ligL.length === 1 || ligL[0].nap > ligL[1].nap)) R.kedv.push({ mondat: "Legszívesebben ide megy: " + ligL[0].nev + " — " + inditNapok + " játéknapból " + ligL[0].nap + " napon itt játszott.", miert: kedvMiert });
  else if (ligL.length > 1 && ligL[0].nap >= MEGFIGY.kedvNap) R.kedv.push({ mondat: "Egyformán szívesen megy ide: " + ligL.filter(function (l) { return l.nap === ligL[0].nap; }).slice(0, 3).map(function (l) { return l.nev; }).join(", ") + " (" + ligL[0].nap + " napon).", miert: kedvMiert });
  if (palL.length && palL[0].inditNap >= MEGFIGY.kedvNap) R.kedv.push({ pid: palL[0].pid, mondat: "Kedvenc pályája: " + nev(palL[0].pid) + " — " + palL[0].inditNap + " különböző napon indította el.", miert: kedvMiert });
  Object.keys(PL).map(function (k) { return PL[k]; }).filter(function (p) { return p.felbeNap >= MEGFIGY.kilepNap; })
    .sort(function (a, b) { return b.felbeNap - a.felbeNap; }).slice(0, 2).forEach(function (p) {
      R.kedv.push({ pid: p.pid, kerul: true, mondat: "Félbehagyta: " + nev(p.pid) + " — " + p.felbeNap + " napon is" + (p.kilepTop ? ", legtöbbször a " + p.kilepTop.allomas + ". állomásnál" : "") + ".",
        miert: [nev(p.pid) + ": " + p.inditNap + " napon indította, ebből " + p.felbeNap + " napon nem vitte végig (" + p.kilepDb + " kilépés). A „nem szereti” nem ugyanaz, mint a „nem tudja” — ezért ez a Kedv rovatban van."] });
    });

  /* 🧭 Mi hajtja? — pálya után hová ment */
  var u = {}, uNap = 0, uDb = 0;
  napok.forEach(function (nap) { var o = mf[nap].u, van = 0; Object.keys(o).forEach(function (c) { if (o[c] > 0) { megfigyNo(u, c, o[c]); uDb += o[c]; van = 1; } }); uNap += van; });
  var celSzam = Object.keys(u).sort(function (a, b) { return u[b] - u[a]; }).map(function (c) { return (MEGFIGY_CEL_SZO[c] || c) + " " + u[c]; }).join(", ");
  var hajtMiert = ["Pálya után " + uDb + " alkalommal láttam, hová megy (" + uNap + " napról): " + (celSzam || "–") + ".",
    "Csoportok: 🧺 gyűjtögetés = bolt/utca, odú, bank, fodrászat · 🏆 a siker = ugyanaz a pálya rögtön újra · 🧭 felfedezés = még sosem játszott pálya · 🌱 gondoskodás = kert, Tüneménykert. A „másik, ismert pálya” semleges. Ítélet: legalább " + MEGFIGY.hajtDb + " adat " + MEGFIGY.hajtNap + " napról, és a nyerő csoportba legalább a fele essen."];
  if (uDb < MEGFIGY.hajtDb || uNap < MEGFIGY.hajtNap) {
    R.hajt = { nincs: true, mondat: "Ehhez még keveset láttam: " + (uDb ? uDb + " pálya után figyeltem, hová megy (" + uNap + " napról)" : "még nem láttam, hová megy egy pálya után") + "; legalább " + MEGFIGY.hajtDb + " kell, " + MEGFIGY.hajtNap + " különböző napról.", miert: hajtMiert };
  } else {
    var cs = Object.keys(MEGFIGY_HAJT).map(function (k) {
      var g = MEGFIGY_HAJT[k], db = 0, ide = [];
      g.celok.forEach(function (c) { if (u[c]) { db += u[c]; ide.push([c, u[c]]); } });
      ide.sort(function (a, b) { return b[1] - a[1]; });
      return { k: k, nev: g.nev, ikon: g.ikon, db: db, ide: ide };
    }).sort(function (a, b) { return b.db - a.db; });
    var gy = cs[0];
    if (gy.db * 2 >= uDb && (!cs[1] || gy.db > cs[1].db)) {
      R.hajt = { csoport: gy.k, ikon: gy.ikon, nev: gy.nev, mondat: "Leginkább " + gy.nev + ": pálya után " + uDb + " esetből " + gy.db + " alkalommal " +
        gy.ide.slice(0, 2).map(function (x) { return MEGFIGY_CEL_TETT[x[0]]; }).join(", vagy ") + ".", miert: hajtMiert };
    } else {
      R.hajt = { vegyes: true, mondat: "Nem látok egy irányt: pálya után vegyesen megy — " + celSzam + ".", miert: hajtMiert };
    }
  }

  /* a kezdőlap kártyája */
  var m = [];
  if (R.keves) m.push(R.kevesMondat);
  else {
    var bp = R.biztos.filter(function (x) { return x.pid; }), ep = R.epul.filter(function (x) { return x.pid; });
    if (bp.length) m.push("Biztosan megy: " + bp.slice(0, 2).map(function (x) { return nev(x.pid); }).join(" és ") + ".");
    if (ep.length) m.push("Épül: " + nev(ep[0].pid) + ".");
    if (R.hajt && R.hajt.csoport) m.push("Leginkább " + R.hajt.nev + " hajtja.");
    if (!m.length && palL.length) m.push("Legtöbbet ezt választja: " + nev(palL[0].pid) + ".");
    if (!m.length) m.push("Még nem látok elég végigvitt pályát ahhoz, hogy jellemezzem.");
  }
  var jelek = [], ak = R.akad.filter(function (x) { return x.pid; }), ker = R.kedv.filter(function (x) { return x.kerul; });
  if (ak.length) jelek.push(["s", "🌱 " + ak[0].mondat]);
  if (ker.length && !(ak.length && ak[0].pid === ker[0].pid)) jelek.push(["s", "🚪 " + ker[0].mondat]);
  if (!jelek.length && !R.keves && R.biztos.filter(function (x) { return x.pid; }).length) jelek.push(["z", "🌳 " + R.biztos.filter(function (x) { return x.pid; }).length + " pálya már biztos."]);
  R.kartya = { mondat: m.join(" "), jelek: jelek };
  return R;
}

/* a játékban: az aktuális gyerek összes unikornisa (mentes.profilok) — a 3. körtől innen lép magától */
function megfigyelesJatek(most) {
  var nevek = {}, lig = {};
  if (typeof PALYAK !== "undefined") PALYAK.forEach(function (p) { nevek[p.id] = (p.ikon ? p.ikon + " " : "") + p.nev; lig[p.id] = p.regio || "osszeado"; });
  var l = typeof mentes !== "undefined" && mentes.profilok ? Object.keys(mentes.profilok).map(function (k) { return mentes.profilok[k]; }) : [];
  return megfigyeles(l, { nev: function (pid) { return nevek[pid] || pid; }, liget: function (pid) { return lig[pid] ? { k: lig[pid], nev: lig[pid] } : null; }, most: most });
}

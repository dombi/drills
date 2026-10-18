/* ============ 3c4) 🔍 MEGFIGYELŐ NAPLÓ — napi összesítő a pultnak és a jellemzésnek (LÁTHATATLAN) ============
   Terv: Matekos\pult-atrendezes-terv.html 4c. pont (✅ jóváhagyva 2026-10-18; Pult-átrendezés 2a. kör).
   A játék naponta feljegyzi, mit indított a gyerek, mit vitt végig, honnan lépett ki, mennyit játszott, és HOVÁ MENT
   EGY PÁLYA UTÁN. A gyerek ebből semmit nem lát. A közös src/megfigyeles.js (2b. kör) ebből és a tudás-naplóból
   (tudas.js) írja a gyereklap mondatait — a pult és később a játék is.
   Mentés: P().mf[nap] (nap = helyi dátum, „2026-10-18”), az utolsó MEGF.napok (60) nap; a régebbi törlődik.
     mp: játékidő mp-ben (pálya + fejtörő képernyő, mint a jatekMp)
     i:  { palyaId: indítások száma }            u: { cél: hányszor ment oda egy pálya végén }
     nu: { palyaId: 1 } — aznap először kipróbált, korábban sosem játszott pálya
     v:  { palyaId: { n: végigvitel, e: elsőre jó, f: feladat, t: teljes ösvény, mp: idő } }
     k:  { palyaId: { "állomás (1-től)": kilépések } }
   „u” célok (nyersen; a csoportosítás a megfigyeles.js dolga): ujra (ugyanaz a pálya rögtön újra), uj (még sosem
   játszott pálya), masik (másik, már ismert pálya), odu, kert, utca, szalon, bank, tunemenykert.
   Az esemeny() (analytics.js) és a mutat() (ui.js) hívja — felhő nélkül is gyűlik, a felhőbe a többi mentéssel megy. */

var MEGF = { napok: 60, utanPerc: 15 };
/* a pálya-vég utáni első cél: a pálya-vég képernyő, a térkép és a ligetválasztó még nem cél — a következő hely vagy pálya az */
var MEGF_KEPERNYO = { "kepernyo-odu": "odu", "kepernyo-kert": "kert", "kepernyo-utca": "utca", "kepernyo-szalon": "szalon",
  "kepernyo-bank": "bank", "kepernyo-tunemenykert": "tunemenykert" };
var _megfUtan = null;   /* { pid, ms } — a legutóbbi pálya-vég, amíg ki nem derül, hová ment utána (csak a memóriában) */

function megfNapKulcs(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
}
function megfTar(p) {
  p = p || P();
  if (!p.mf || typeof p.mf !== "object" || Array.isArray(p.mf)) p.mf = {};
  return p.mf;
}
/* a mai nap sora; az első íráskor a MEGF.napok-nál régebbi napok törlődnek */
function megfMa(p) {
  var t = megfTar(p), k = megfNapKulcs();
  if (!t[k]) {
    var hatar = megfNapKulcs(new Date(Date.now() - MEGF.napok * 86400000));
    Object.keys(t).forEach(function (n) { if (n < hatar) delete t[n]; });
    t[k] = {};
  }
  return t[k];
}
function megfNo(o, kulcs, db) { o[kulcs] = (o[kulcs] || 0) + (db || 1); }
function megfAl(d, mezo) { return d[mezo] || (d[mezo] = {}); }

/* az esemeny() hívja: palya_start / palya_end / palya_kilep (a többit nem nézi) */
function megfEsemeny(tipus, adat) {
  try {
    if (typeof P !== "function" || !P() || !adat || !adat.palyaId) return;
    var pid = String(adat.palyaId);
    if (tipus === "palya_start") {
      var d = megfMa();
      var ismert = !!(P().palyak && P().palyak[pid]) || megfVoltMar(pid);
      if (_megfUtan) megfUtanJegyez(d, pid === _megfUtan.pid ? "ujra" : ismert ? "masik" : "uj");
      megfNo(megfAl(d, "i"), pid);
      if (!ismert) megfAl(d, "nu")[pid] = 1;
    } else if (tipus === "palya_end") {
      var d2 = megfMa(), v = megfAl(d2, "v"), s = v[pid] || (v[pid] = {});
      megfNo(s, "n"); megfNo(s, "e", +adat.elsore || 0); megfNo(s, "f", +adat.feladat || 0);
      if (adat.teljes) megfNo(s, "t");
      megfNo(s, "mp", Math.round(+adat.idoMp || 0));
      _megfUtan = { pid: pid, ms: Date.now() };
    } else if (tipus === "palya_kilep") {
      var d3 = megfMa(), k = megfAl(d3, "k"), sk = k[pid] || (k[pid] = {});
      megfNo(sk, String((+adat.allomas || 0) + 1));
      _megfUtan = null;
    }
  } catch (e) { /* a megfigyelés soha ne akassza meg a játékot */ }
}
/* volt-e már ez a pálya a naplóban (a P().palyak csak a végigvitt pályákat ismeri) */
function megfVoltMar(pid) {
  var t = megfTar();
  return Object.keys(t).some(function (n) { var d = t[n]; return (d.i && d.i[pid]) || (d.v && d.v[pid]); });
}
function megfUtanJegyez(d, cel) {
  if (!_megfUtan) return;
  if (Date.now() - _megfUtan.ms <= MEGF.utanPerc * 60000) megfNo(megfAl(d, "u"), cel);
  _megfUtan = null;
}
/* a mutat() hívja minden képernyőváltáskor */
function megfKepernyo(id) {
  try {
    if (!_megfUtan || typeof P !== "function" || !P()) return;
    var cel = MEGF_KEPERNYO[id];
    if (cel) megfUtanJegyez(megfMa(), cel);
    else if (id === "kepernyo-profil") _megfUtan = null;   /* unikornis-váltás: ez már nem a pálya „utána” */
  } catch (e) {}
}
/* az idomeroInd hívja másodpercenként (a jatekMp mellett) */
function megfMasodperc() {
  try { megfNo(megfMa(), "mp"); } catch (e) {}
}

/* ============ 3e) ⚡ VILLÁMKÖR — a sprint közös alapja (terv/villamkor-terv.html, terv/villamkor-rajzterv.html) ============
   Egy perc futás: csak a gyerek által már TUDOTT tények (doboz ≥ 3), felolvasás nélkül, saját rekord ellen.
   2. kör (2026-10-07): a közös alap, LÁTHATATLANUL — halmazok és kinyílás, a kör sorrendje (villamSor), a rekord és az
     árnyék ugrás-idői, a mentés és a lekérdezés. A gyereknek még semmi nem változik (nincs kártya, nincs képernyő).
     A tény-motor bővítése a teny.js-ben: forma "v" (vh előzmény + szelíd botlás).
   3. kör (még hátra): a kártya a 💖 Neked készült ligetben + a gyors képernyő (B kanyargó ösvény, nap-óra, árnyék),
     a prototípus a terv/villamkor-rajzterv.sablon.html-ben.

   Halmazok (VILLAM_HALMAZOK): 🌷 ok = + − a 20-as körben (ok10 + ok20 tábla) · 🪻 sd = × ÷ a 10 × 10-es táblában
     (s + d) · 🌈 vegyes = mind a négy, ha mindkettő nyitva van (és a pult nem rejti). A 100-as kör kimarad.
     Egy halmaz akkor nyílik ki, ha legalább VILLAM_ALAP.nyit (10) tudott ténye van a bekapcsolt táblákban.
   A kör sorrendje (villamKorEpit + villamKov, a feladatot a villamFeladat adja):
     • az első 3 feladat villám-tény, köztük véletlenül (lendületes kezdés); ha nincs 3, a leggyorsabb „tudja”;
     • utána nagyjából fele „gyorsítandó” (doboz 3, vagy villám, de az utolsó eredménye lassú J), fele villám;
     • egy tény legfeljebb kétszer egy körben (ha minden elfogyott, akkor a legkevesebbszer jött), és sosem
       kétszer egymás után; a rossz válasz tényét 4–6 feladattal később még egyszer visszaküldjük (villamRossz).
   Mentés: P().villam = {
       rek:   { "ok_b": { p: ugrások, t: [az ugrások ideje a kör elejétől, ms], n: a rekord napja }, … }
              (halmaz × bevitel: b = beírás ⌨️, h = hangos 🎤 — a hangos kör külön rekordot kap, mert lassabb)
       nap:   { d: tenyNap, db: a mai számított körök száma } — a napi első 3 körben jár ✨
       rh:    { "ok_b": az a nap, amikor utoljára járt +3 💧 új rekordért } — naponta egyszer halmazonként
       napok: hány különböző napon futott (a ⚡ Villám-futó jelvényhez: 7) · un: az utolsó futós nap
       korok: [ { n: nap, h: halmaz, m: "b"|"h", p: ugrás, j: jó, r: rossz, ms: átlagos válaszidő } … ] (az utolsó 120; a pult görbéje) }
   A pult ugyanezt a fájlt töltheti be (4. kör): ahol P() kellene, ott a tar átadható. */

var VILLAM_HALMAZOK = [
  { id: "ok", ikon: "🌷", nev: "Összeadó villám", tablak: ["ok10", "ok20"] },
  { id: "sd", ikon: "🪻", nev: "Szorzó villám", tablak: ["s", "d"] },
  { id: "vegyes", ikon: "🌈", nev: "Vegyes villám", tablak: ["ok10", "ok20", "s", "d"] }
];
var VILLAM_ALAP = { hossz: 60, nyit: 10, vegyes: true, latszik: true };   /* a pult felülírja (4. kör): FELULIR.teny.villam */
var VILLAM_ELSO_VILLAM = 3;      /* lendületes kezdés: az első ennyi feladat villám-tény */
var VILLAM_MAX_ISMETLES = 2;     /* egy tény legfeljebb ennyiszer egy körben (amíg van más) */
var VILLAM_KOROK_MAX = 120;      /* ennyi kört őrzünk meg a pult görbéjéhez */
var VILLAM_JUTALMAS_KOR = 3;     /* a nap első ennyi körében jár ✨ (utána „csak a buli kedvéért”) */
var VILLAM_REKORD_HARMAT = 3;    /* új rekord: +3 💧, naponta egyszer halmazonként */

function villamBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.teny && FELULIR.teny.villam) || {};
  var b = {}, k;
  for (k in VILLAM_ALAP) b[k] = VILLAM_ALAP[k];
  for (k in f) if (f[k] != null) b[k] = f[k];
  return b;
}
function villamTar(p) {
  p = p || P();
  var v = p.villam;
  if (!v || typeof v !== "object") v = p.villam = {};
  if (!v.rek) v.rek = {};
  if (!v.nap) v.nap = { d: 0, db: 0 };
  if (!v.rh) v.rh = {};
  if (!Array.isArray(v.korok)) v.korok = [];
  if (!v.napok) v.napok = 0;
  return v;
}

/* ── halmazok és kinyílás ──────────────────────────────────────────────── */
/* a halmaz tudott tényei (doboz ≥ 3), csak a bekapcsolt táblákból; tar: a pult saját tény-tára */
function villamTudott(hid, tar) {
  var h = VILLAM_HALMAZOK.filter(function (x) { return x.id === hid; })[0];
  if (!h) return [];
  var aktiv = tar ? null : tenyTablakAktiv(), ki = [];
  tenyMind("ok").concat(tenyMind("sd")).forEach(function (k) {
    var t = tenyTabla(k), s = tenySorBarmi(k, tar);
    if (h.tablak.indexOf(t) < 0 || (aktiv && aktiv.indexOf(t) < 0)) return;
    if (s && s.d >= 3) ki.push(k);
  });
  return ki;
}
/* a választó (és a halvány kártya) adatai: halmazonként nyitva-e, hány tudott ténye van, mennyi kell */
function villamHalmazok(tar) {
  var B = villamBeall(), ki = [];
  VILLAM_HALMAZOK.forEach(function (h) {
    if (h.id === "vegyes") return;
    var db = villamTudott(h.id, tar).length;
    ki.push({ id: h.id, ikon: h.ikon, nev: h.nev, db: db, kell: B.nyit, nyitva: db >= B.nyit });
  });
  var mind = ki.every(function (x) { return x.nyitva; });
  var v = VILLAM_HALMAZOK[2];
  ki.push({ id: v.id, ikon: v.ikon, nev: v.nev, db: ki[0].db + ki[1].db, kell: B.nyit, nyitva: mind && B.vegyes !== false, rejtve: B.vegyes === false });
  return ki;
}
/* a ⚡ kártya élő-e (legalább egy halmaz nyitva) — és látszik-e egyáltalán (pult) */
function villamNyitva() {
  if (villamBeall().latszik === false) return false;
  return villamHalmazok().some(function (h) { return h.nyitva; });
}

/* ── a kör sorrendje ───────────────────────────────────────────────────── */
/* villám (doboz ≥ 4, az utolsó eredménye nem lassú) · gyorsítandó (doboz 3, vagy villám, de utoljára lassú J) */
function villamFajta(s) { return s.d >= 4 && (s.h || "").slice(-1) !== "J" ? "vi" : "gy"; }
function villamKorEpit(hid) {
  var K = { h: hid, vi: [], gy: [], volt: {}, utolso: null, db: 0, vissza: [] };
  villamTudott(hid).forEach(function (k) { K[villamFajta(tenySorBarmi(k))].push(k); });
  return K;
}
/* a leggyorsabb elöl (utolsó idő, tized mp; mérés nélkül hátra) */
function villamGyorsSor(lista) {
  return tenyKever(lista.slice()).sort(function (x, y) {
    var a = tenySorBarmi(x).m || 999, b = tenySorBarmi(y).m || 999;
    return a - b;
  });
}
/* a következő tény kulcsa (a kör minden feladatánál) */
function villamKov(K) {
  var k = null, i;
  /* 1. a rossz válasz után visszaküldött tény, ha elérkezett az ideje */
  for (i = 0; i < K.vissza.length; i++) {
    if (K.vissza[i].hol <= K.db && K.vissza[i].k !== K.utolso) { k = K.vissza.splice(i, 1)[0].k; break; }
  }
  if (!k) {
    var var_ = {}; K.vissza.forEach(function (x) { var_[x.k] = 1; });   /* a visszaküldött tény csak a maga idejében jön */
    var szabad = function (x) { return x !== K.utolso && !var_[x] && (K.volt[x] || 0) < VILLAM_MAX_ISMETLES; };
    if (K.db < VILLAM_ELSO_VILLAM) {
      /* 2. lendületes kezdés: villám-tények, véletlen sorrendben (hogy ne mindig ugyanaz a 3 nyisson);
         ha elfogytak, a leggyorsabb „tudja” */
      var elso = tenyKever(K.vi.slice()).filter(function (x) { return szabad(x) && !K.volt[x]; });
      if (!elso.length) elso = villamGyorsSor(K.gy).filter(function (x) { return szabad(x) && !K.volt[x]; });
      k = elso[0] || null;
    }
    if (!k) {
      /* 3. fele-fele: gyorsítandó vagy villám (amelyikből van még); előbb a még nem látott tények */
      var gy = K.gy.filter(szabad), vi = K.vi.filter(szabad), lista;
      lista = (gy.length && (!vi.length || Math.random() < 0.5)) ? gy : vi;
      if (lista.length) {
        var uj = lista.filter(function (x) { return !K.volt[x]; });
        k = veletlenElem(uj.length ? uj : lista);
      }
    }
    if (!k) {
      /* 4. minden tény elérte a kétszert: a legkevesebbszer jött (csak az előző nem) */
      var mind = K.vi.concat(K.gy).filter(function (x) { return x !== K.utolso; });
      if (!mind.length) mind = K.vi.concat(K.gy);
      mind = tenyKever(mind).sort(function (x, y) { return (K.volt[x] || 0) - (K.volt[y] || 0); });
      k = mind[0] || null;
    }
  }
  if (!k) return null;
  K.volt[k] = (K.volt[k] || 0) + 1;
  K.utolso = k;
  K.db++;
  return k;
}
/* rossz válasz: a tény 4–6 feladattal később még egyszer visszajön (egy körben egyszer) */
function villamRossz(K, k) {
  if (!K || !k || K.vissza.some(function (x) { return x.k === k; }) || (K.volt[k] || 0) > VILLAM_MAX_ISMETLES) return;
  K.vissza.push({ k: k, hol: K.db + veletlen(3, 5) });
}
/* egy tényből sprint-feladat: a megszokott alak, „v” formával (a tenyJegyez erről ismeri fel) */
function villamFeladat(k) {
  var f = tenyFeladat(k);
  f.villam = true;
  if (f.naplo) f.naplo.forma = "v";
  return f;
}

/* ── rekord, árnyék, jutalom-számítás (a kör végén) ────────────────────── */
function villamRekKulcs(hid, mod) { return hid + "_" + (mod === "h" ? "h" : "b"); }
/* az árnyék-unikornis ugrás-idői (ms a kör elejétől), vagy null (első kör: nincs árnyék) */
function villamArnyek(hid, mod) {
  var r = villamTar().rek[villamRekKulcs(hid, mod)];
  return r && Array.isArray(r.t) ? r.t.slice() : null;
}
/* a kör vége. e = { h: halmaz, m: "b"|"h", jo, rossz, idok: [a jó válaszok ideje, ms], msOssz: a válaszidők összege,
   tetlen: true, ha a gyerek elment a géptől (10 mp semmi) }.
   Visszaad: { szamit, p, uj (új rekord), eddig (az előző rekord vagy null), csillag (✨), harmat (💧), jutalmas, napiKor, napok }.
   A jutalom JÓVÁÍRÁSA a hívó dolga (3. kör: a meglévő jutalom-motoron át) — ez csak kiszámolja és elmenti a kört. */
function villamKorZar(e, ma) {
  var T = villamTar(), kulcs = villamRekKulcs(e.h, e.m), p = e.jo || 0;
  ma = ma == null ? tenyNap() : ma;
  var ki = { szamit: false, p: p, uj: false, eddig: null, csillag: 0, harmat: 0, jutalmas: false, napiKor: T.nap.d === ma ? T.nap.db : 0, napok: T.napok };
  if (e.tetlen) return ki;   /* elment a géptől: nem számít a rekordba, a jutalomba, a görbébe */
  ki.szamit = true;
  if (T.nap.d !== ma) T.nap = { d: ma, db: 0 };
  T.nap.db++;
  ki.napiKor = T.nap.db;
  if (T.un !== ma) { T.un = ma; T.napok++; }
  ki.napok = T.napok;
  ki.jutalmas = T.nap.db <= VILLAM_JUTALMAS_KOR;
  if (ki.jutalmas) ki.csillag = p;
  var r = T.rek[kulcs];
  ki.eddig = r ? r.p : null;
  if (p > 0 && (!r || p > r.p)) {
    ki.uj = true;
    T.rek[kulcs] = { p: p, t: (e.idok || []).slice(0, p), n: ma };
    if (T.rh[kulcs] !== ma) { T.rh[kulcs] = ma; ki.harmat = VILLAM_REKORD_HARMAT; }
  }
  var valasz = (e.jo || 0) + (e.rossz || 0);
  T.korok.push({ n: ma, h: e.h, m: e.m === "h" ? "h" : "b", p: p, j: e.jo || 0, r: e.rossz || 0, ms: valasz ? Math.round((e.msOssz || 0) / valasz) : 0 });
  if (T.korok.length > VILLAM_KOROK_MAX) T.korok.splice(0, T.korok.length - VILLAM_KOROK_MAX);
  return ki;
}

/* ── lekérdezés: a pultnak, az intelligens pultnak és a „gyereket ismerő” játéknak ──
   halmazonként (és bevitelenként): rekord, a hét átlaga (a napok legjobbjaiból, utolsó 7 nap), az előző hét átlaga,
   emelkedik-e (legalább 1 ugrással jobb), a körök száma; + napok (a jelvényhez), ma hány kört futott. */
function villamAllapot(tar, ma) {
  var T = tar || villamTar(), ki = { halmazok: {}, napok: T.napok || 0, ma: 0 };
  ma = ma == null ? tenyNap() : ma;
  ki.ma = T.nap && T.nap.d === ma ? T.nap.db : 0;
  VILLAM_HALMAZOK.forEach(function (h) {
    ["b", "h"].forEach(function (m) {
      var kor = (T.korok || []).filter(function (x) { return x.h === h.id && x.m === m; });
      if (!kor.length) return;
      var legjobb = {};   /* nap → a nap legjobb köre */
      kor.forEach(function (x) { if (!legjobb[x.n] || x.p > legjobb[x.n]) legjobb[x.n] = x.p; });
      function atlag(tol, ig) {
        var l = Object.keys(legjobb).filter(function (n) { return +n > tol && +n <= ig; }).map(function (n) { return legjobb[n]; });
        return l.length ? Math.round(l.reduce(function (a, b) { return a + b; }, 0) / l.length * 10) / 10 : null;
      }
      var het = atlag(ma - 7, ma), elozo = atlag(ma - 14, ma - 7), r = (T.rek || {})[villamRekKulcs(h.id, m)];
      ki.halmazok[villamRekKulcs(h.id, m)] = { rek: r ? r.p : 0, het: het, elozoHet: elozo,
        emelkedik: het != null && elozo != null ? het >= elozo + 1 : null, korok: kor.length };
    });
  });
  return ki;
}

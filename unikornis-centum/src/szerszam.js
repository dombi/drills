/* ============ 3f) 🧰 SZERSZÁM-LÉTRÁK — közös alap: 🛗 lift + 🧰 láda-statisztika + napló + pult-beállítás ============
   Terv: Matekos\szerszam-letrak-terv.html (✅ 2026-10-09) · rajz: …-rajzterv.html · tartalom: …-tartalom.html
   1. kör (2026-10-09): LÁTHATATLAN alap. A gyerek ebből még semmit sem lát; a pályák a 2. körtől kötik be
   (📌 KOTOTT létra), utána a régi 3 kocka is (lakat ki, lift be). Egy darab modul, nem pályánként külön.

   🛗 LIFT (lakat helyett, terv 5. pont). A pálya egy lift-állapotot kér a NAGY feladathoz (📜 Tekercs / 🔮 Kristálygömb / 🏅 Mesterpróba),
   és jelenti, mi történt; a modul megmondja, mi jöjjön. A pálya adja a kicsinyített testvért (ugyanabban a mese-keretben).
     var L = liftUj({ sz:"KOTOTT", palya:"…", fok:"tekercs"|"gomb"|"mester", fid:"…", ae:false })
     liftRossz(L)        → "ujra" (1. rossz) · "lift" (2. rossz: indul a lift) · "vegig" (a lift után is 2. rossz)
     liftSegitseg(L, s)  → 🙋 s. sora: 1 = „Mit kérdeznek?” (még önálló) → "semmi"; 2+ → "lift" (ha még nem volt)
     liftKer(L)          → a gyerek kérte („🔎 Nézzük kicsiben”) → "lift" · "semmi", ha a pult kikapcsolta
     liftKicsi(L, jo)    → egy kicsi vége: "kicsi" (jöhet még egy) · "vissza" (2 jó → vissza a nagyra; L.kicsiJoKell felülírja) · "vegig" (3 kicsi után)
     liftVegig(L)        → a pálya végigvezette a nagyot (együtt oldották meg)
     liftNagyKesz(L, jo) → a nagy feladat vége: könyvel (napló + láda) → { e, onallo, ladaba, mester } (L.nagy: számít-e a ládába)
   A kicsi BESZÁMÍT abba a pályába, ahol a gyerek tart, teljes jutalommal (ezt a pálya intézi); a menüsor sem mutatja.
   Mondatok: liftMondat("indul" | "vissza", { kicsi, nagy }) — a tiltott szavakat (LIFT_TILOS) a modul kiszűri.

   🧰 LÁDA (terv 6. pont). Az utolsó n NAGY feladatból k ÖNÁLLÓ (alap 4 az 5-ből; a pult állítja).
     Önálló = nem volt lift, és a 🙋-ból legfeljebb a „Mit kérdeznek?” kellett. Kicsi (lift, Mesekönyv) nem számít.
     A–E-s Mesterpróba csak elsőre jó válasszal önálló, és egymagában sosem tesz ládába: az ablakban legfeljebb
     EGY A–E-s önálló számít. Nincs nap-feltétel. A ládából nem lehet kiesni. A gyerek a számlálót nem látja,
     csak a szerszám ikonja fényesedik (szerszamFeny 0–1).
   🏅 Mesterpróba: minden befejezett feladat elhasználódik (szerszamMesterKov a következő még nem látottat adja;
     lifttel / végigvezetéssel oldott → legközelebb másikat); elsőre jó, önálló → „mester” szalag (st.m = nap).

   Állapot: P().szerszam = {
     t: { KOTOTT: { h: [ {e, ae?, d} … az utolsó 8 nagy ], l: láda napja | "", m: mester-szalag napja | "",
                    mh: { fid: { d, e } } elhasznált Mesterpróbák } },
     n: [ … feladat-napló, az utolsó 200 ],  li: [ … lift-napló, az utolsó 60 ] }
   Eredmény-betűk (e): o önálló · l lifttel (utána maga oldotta) · s segítséggel (🙋 2+, lift nélkül) · v végigvezetéssel ·
     2 A–E, a második próbára jó (nem önálló) · r A–E, rossz (a végigvezetés megmutatta)
   A napló minden sora az eseménynaplóba is megy (events: szerszam_feladat / szerszam_lift / szerszam_lada) dátummal,
   feladatonként — így a hosszú távú „intelligens pult” átalakítás nélkül tudja használni. */

var SZERSZAMOK = [
  { id: "KOTOTT", ikon: "📌", nev: "Ahol csak egyféle lehet", kartya: "Ott kezdem, ahol csak egyféle lehet." },
  { id: "EGESZ",  ikon: "🧺", nev: "Előbb az egész",          kartya: "Összeszámolom, mennyi van összesen." },
  { id: "MIT",    ikon: "🔍", nev: "Mit számolok?",           kartya: "Megnézem, mit számolok egynek." }
];
/* 📚 az OLVASÓ-POLC két polca (olvaso-polc.js; terv: Matekosegi-kockak-konyvtar-terv.html ✅) — ugyanaz a lift + láda, mint a
   szerszámoknál (egy közös láda, egy közös pult-küszöb); a kocka: a régi építőkocka, ami a Kockavárban gyűlik */
var OLVASO_POLCOK = [
  { id: "KERES",  ikon: "🔎", nev: "Mire felelsz?",    kartya: "Megkeresem, mit kérdeznek – és pont arra felelek.", kocka: "K1" },
  { id: "VALASZ", ikon: "✋", nev: "Ez már a válasz?", kartya: "Megnézem: ez már a válasz, vagy csak egy lépcső?",  kocka: "K3" }
];
var SZERSZAM_FOKOK = { mese: "📖 Mesekönyv", tekercs: "📜 Varázstekercs", gomb: "🔮 Kristálygömb", mester: "🏅 Mesterpróba", kicsi: "🛗 kicsi" };
var LIFT_KICSI_JO = 2;     /* ennyi jó kicsi után vissza a nagyra */
var LIFT_KICSI_MAX = 3;    /* legfeljebb ennyi kicsi; utána a végigvezetés oldja meg együtt */
var SZERSZAM_H_MAX = 8, SZERSZAM_N_MAX = 200, SZERSZAM_LI_MAX = 60;
var SZERSZAM_ALAP = { k: 4, n: 5, latszik: { KOTOTT: true, EGESZ: false, MIT: false }, liftKer: true };

/* ── a pult beállításai ────────────────────────────────────────────────────
   producerConfig/{uid}.szerszam és groups/{gid}.szerszam = { k?, n?, latszik?: { KOTOTT?, EGESZ?, MIT? }, liftKer? }
     k / n     a láda-küszöb: az utolsó n nagy feladatból k önálló (n 3–8, k 1–n; alap 4 az 5-ből)
     latszik   melyik létra látszik a könyvtárban (alap: csak a 📌 KOTOTT)
     liftKer   false = a 🙋-ban nincs „🔎 Nézzük kicsiben” (a lift magától akkor is jön)
   Sorrend: alap < csoport(ok) < egyéni. Több csoportnál az ENGEDÉKENYEBB nyer: a kisebb arányú küszöb (egyenlőnél a
   rövidebb ablak), a létra látszik, ha bármelyik csoport megnyitja; a lift-kérés ki, ha bármelyik kikapcsolja.
   A pult (admin/index.html) ugyanezt a fájlt tölti be, így a két oldal szabálya nem válhat el. */
function szerszamKuszob(o) {
  if (!o) return null;
  var n = +o.n, k = +o.k;
  if (!(n >= 3 && n <= 8 && n % 1 === 0)) n = null;
  if (!(k >= 1 && k <= 8 && k % 1 === 0)) k = null;
  if (n == null && k == null) return null;
  n = n || SZERSZAM_ALAP.n; k = Math.min(k || SZERSZAM_ALAP.k, n);
  return { k: k, n: n };
}
function szerszamOsszevon(egyeni, csoportok) {
  var ki = {};
  (csoportok || []).forEach(function (c) {
    if (!c) return;
    var q = szerszamKuszob(c);
    if (q && (ki.k == null || q.k / q.n < ki.k / ki.n || (q.k / q.n === ki.k / ki.n && q.n < ki.n))) { ki.k = q.k; ki.n = q.n; }
    if (c.latszik) SZERSZAMOK.forEach(function (s) { if (c.latszik[s.id] === true) (ki.latszik = ki.latszik || {})[s.id] = true; });
    if (c.liftKer === false) ki.liftKer = false;
  });
  var e = egyeni || {}, q = szerszamKuszob(e);
  if (q) { ki.k = q.k; ki.n = q.n; }
  if (e.latszik) SZERSZAMOK.forEach(function (s) { if (typeof e.latszik[s.id] === "boolean") (ki.latszik = ki.latszik || {})[s.id] = e.latszik[s.id]; });
  if (typeof e.liftKer === "boolean") ki.liftKer = e.liftKer;
  return ki;
}
/* az érvényes beállítás (alap + a pult összevont felülírása: FELULIR.szerszam) */
function szerszamBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.szerszam) || {};
  var b = { k: SZERSZAM_ALAP.k, n: SZERSZAM_ALAP.n, latszik: {}, liftKer: SZERSZAM_ALAP.liftKer };
  SZERSZAMOK.forEach(function (s) { b.latszik[s.id] = SZERSZAM_ALAP.latszik[s.id]; });
  if (f.k != null && f.n != null) { b.k = f.k; b.n = f.n; }
  if (f.latszik) for (var id in f.latszik) if (typeof f.latszik[id] === "boolean") b.latszik[id] = f.latszik[id];
  if (typeof f.liftKer === "boolean") b.liftKer = f.liftKer;
  return b;
}
function szerszamLatszik(sz) { return !!szerszamBeall().latszik[sz]; }

/* ── állapot ── */
function szerszamTar(p) {
  p = p || P();
  var s = p.szerszam;
  if (!s || typeof s !== "object") s = p.szerszam = {};
  if (!s.t || typeof s.t !== "object") s.t = {};
  if (!Array.isArray(s.n)) s.n = [];
  if (!Array.isArray(s.li)) s.li = [];
  return s;
}
function szerszamT(sz, p) {
  var s = szerszamTar(p), t = s.t[sz];
  if (!t || typeof t !== "object") t = s.t[sz] = {};
  if (!Array.isArray(t.h)) t.h = [];
  if (typeof t.l !== "string") t.l = "";
  if (typeof t.m !== "string") t.m = "";
  if (!t.mh || typeof t.mh !== "object") t.mh = {};
  return t;
}
function szerszamNap() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }   /* = helyiNap() */
function szerszamVeg(lista, max) { if (lista.length > max) lista.splice(0, lista.length - max); }
function szerszamEsemeny(tipus, adat) { if (typeof esemeny === "function") esemeny(tipus, adat); }

/* ── 🧰 láda ── */
/* hány önálló az ablakban (A–E-s önállóból legfeljebb egy számít) — a pult is ezt hívja a gyerek mentett adatán */
function szerszamOnalloDb(h, n) {
  var ae = 0, db = 0;
  (h || []).slice(-n).forEach(function (x) {
    if (x.e !== "o") return;
    if (x.ae) { if (ae) return; ae = 1; }
    db++;
  });
  return db;
}
function szerszamLadaban(sz, p) { return !!szerszamT(sz, p).l; }
/* 0–1: mennyire fényes a szerszám ikonja (a gyerek számlálót nem lát) */
function szerszamFeny(sz, p) {
  var t = szerszamT(sz, p), b = szerszamBeall();
  if (t.l) return 1;
  return Math.min(1, szerszamOnalloDb(t.h, b.n) / b.k);
}
function szerszamLadaNez(sz, p) {
  var t = szerszamT(sz, p), b = szerszamBeall();
  if (t.l) return false;
  if (szerszamOnalloDb(t.h, b.n) < b.k) return false;
  t.l = szerszamNap();
  szerszamEsemeny("szerszam_lada", { sz: sz, k: b.k, n: b.n });
  return true;
}

/* ── napló ── */
/* minden befejezett feladat (nagy, Mesekönyv, kicsi): r = { sz, palya, fok, fid, e, kicsi?, seg?, mp? } */
function szerszamNaplo(r) {
  var s = szerszamTar(), sor = { d: szerszamNap(), ts: Date.now(), sz: r.sz, p: r.palya || "", f: r.fok, id: r.fid || "", e: r.e };
  if (r.kicsi) sor.k = r.kicsi;
  if (r.seg) sor.s = r.seg;
  if (r.mp != null) sor.mp = r.mp;
  s.n.push(sor); szerszamVeg(s.n, SZERSZAM_N_MAX);
  szerszamEsemeny("szerszam_feladat", sor);
  return sor;
}
/* a Mesekönyv és a lift kicsijei csak a naplóba mennek, a ládába nem */
function szerszamKicsiJegyez(sz, palya, fok, fid, jo) { szerszamNaplo({ sz: sz, palya: palya, fok: fok, fid: fid, e: jo ? "o" : "r" }); }

/* ── 🏅 Mesterpróba-készlet ── */
function szerszamMesterKov(sz, lista) {
  var mh = szerszamT(sz).mh;
  for (var i = 0; i < (lista || []).length; i++) if (!mh[lista[i]]) return lista[i];
  return null;                                   /* elfogyott: a pálya dönti el (pl. számváltozat) */
}
/* friss-e még a feladat ennél a gyereknél (a Rejtélyterem nem adja „friss”-ként, ha Mesterpróba volt) */
function szerszamFeladatFriss(fid, p) {
  var t = szerszamTar(p).t;
  for (var sz in t) if (t[sz] && t[sz].mh && t[sz].mh[fid]) return false;
  return true;
}

/* ── 🛗 lift ── */
var LIFT_TILOS = /könnyebb|könnyű|mesekönyv|visszalép|egyszerűbben|egyszerűbb|szint|osztály/i;
var LIFT_MONDATOK = {
  indul: ["Nézzük kicsiben – a matekosok is így csinálják.", "Nézzük meg kicsiben – a matekosok is így csinálják."],
  vissza: ["Ügyes! Ugyanaz, csak {nagy}.", "Ügyes! Most ugyanez jön, csak {nagy}."]
};
/* „indul” / „vissza”; m = { kicsi: „Most csak három kutya fut…”, nagy: „öt kutyával” } — a pálya adja a mese-részt */
function liftMondat(mi, m) {
  m = m || {};
  var L = LIFT_MONDATOK[mi] || [""], s = L[Math.floor(Math.random() * L.length)];
  if (mi === "vissza") s = m.nagy ? s.replace("{nagy}", m.nagy) : "Ügyes! Most jöhet a nagy feladat.";
  if (mi === "indul" && m.kicsi) s += " " + m.kicsi;
  if (mi === "vissza" && m.utana) s += " " + m.utana;
  return LIFT_TILOS.test(s) ? (mi === "indul" ? LIFT_MONDATOK.indul[0] : "Ügyes! Most jöhet a nagy feladat.") : s;
}
function liftUj(o) {
  o = o || {};
  return { sz: o.sz, palya: o.palya || "", fok: o.fok || "tekercs", fid: o.fid || "", ae: !!o.ae,
           rossz: 0, elso: null, seg: 0, lift: false, ok: "", bent: false, kicsi: 0, kicsiJo: 0, vegig: false, kesz: false, t0: Date.now() };
}
function liftIndul(L, ok) {
  L.lift = true; L.bent = true; L.ok = ok; L.rossz = 0;
  return "lift";
}
function liftRossz(L) {
  if (L.kesz || L.bent) return "semmi";
  if (L.elso === null) L.elso = false;
  L.rossz++;
  if (L.rossz < 2) return "ujra";
  if (!L.lift) return liftIndul(L, "auto");
  L.vegig = true; return "vegig";                /* a lift után is elakadt: együtt oldják meg, a pálya megy tovább */
}
function liftJo(L) { if (L.elso === null) L.elso = true; }
function liftSegitseg(L, szint) {
  if (L.kesz) return "semmi";
  L.seg = Math.max(L.seg, szint || 1);
  if (szint >= 2 && !L.lift && !L.bent) return liftIndul(L, "seg");
  return "semmi";
}
function liftKer(L) {
  if (L.kesz || L.lift || L.bent || !szerszamBeall().liftKer) return "semmi";
  return liftIndul(L, "kert");
}
function liftKicsi(L, jo) {
  if (!L.bent) return "semmi";
  L.kicsi++; if (jo) L.kicsiJo++;
  szerszamKicsiJegyez(L.sz, L.palya, "kicsi", L.fid, jo);
  if (L.kicsiJo >= (L.kicsiJoKell || LIFT_KICSI_JO)) { L.bent = false; return "vissza"; }   /* polc: 1 (generált) vagy 2 (Mesterpróba-testvér) */
  if (L.kicsi >= LIFT_KICSI_MAX) { L.bent = false; L.vegig = true; return "vegig"; }
  return "kicsi";
}
function liftVegig(L) { L.bent = false; L.vegig = true; }
/* a nagy feladat vége — jo: a gyerek végül maga oldotta-e meg (végigvezetésnél false) */
function liftNagyKesz(L, jo) {
  if (L.kesz) return null;
  L.kesz = true;
  if (L.elso === null) L.elso = !!jo;
  var e = L.vegig || !jo ? (L.ae && !L.lift && !L.vegig ? "r" : "v") : L.lift ? "l" : L.seg >= 2 ? "s" : "o";
  if (L.ae && e === "o" && !L.elso) e = "2";     /* A–E: csak elsőre jó számít önállónak (tippelni is lehet) */
  var nagy = L.nagy != null ? !!L.nagy : (L.fok === "tekercs" || L.fok === "gomb" || L.fok === "mester"), ki = { e: e, onallo: e === "o", ladaba: false, mester: false };
  szerszamNaplo({ sz: L.sz, palya: L.palya, fok: L.fok, fid: L.fid, e: e, kicsi: L.kicsi || 0, seg: L.seg || 0, mp: Math.round((Date.now() - L.t0) / 1000) });
  if (L.lift) {
    var s = szerszamTar(), li = { d: szerszamNap(), sz: L.sz, p: L.palya, f: L.fok, id: L.fid, ok: L.ok, k: L.kicsi, kj: L.kicsiJo, siker: e === "l" ? 1 : 0 };
    s.li.push(li); szerszamVeg(s.li, SZERSZAM_LI_MAX);
    szerszamEsemeny("szerszam_lift", li);
  }
  if (nagy && L.sz) {
    var t = szerszamT(L.sz), sor = { e: e, d: szerszamNap() };
    if (L.ae) sor.ae = 1;
    t.h.push(sor); szerszamVeg(t.h, SZERSZAM_H_MAX);
    if (L.fok === "mester" && L.fid) {
      t.mh[L.fid] = { d: szerszamNap(), e: e };
      if (e === "o" && L.elso && !t.m) { t.m = szerszamNap(); ki.mester = true; }
    }
    ki.ladaba = szerszamLadaNez(L.sz);
  }
  if (typeof ment === "function") ment();
  return ki;
}
/* a pultnak: egy gyerek mentett szerszám-adatából (u.unicorns[leny].szerszam) egy sor szerszámonként */
function szerszamOsszegzes(adat, beall) {
  var b = szerszamBeall(beall), t = (adat && adat.t) || {}, li = (adat && adat.li) || [];
  return SZERSZAMOK.concat(OLVASO_POLCOK).map(function (s) {
    var x = t[s.id] || {}, h = Array.isArray(x.h) ? x.h : [], sl = li.filter(function (l) { return l.sz === s.id; });
    return { id: s.id, ikon: s.ikon, nev: s.nev, utolso: h.slice(-b.n), onallo: szerszamOnalloDb(h, b.n), k: b.k, n: b.n,
             lada: x.l || "", mester: x.m || "", mesterek: x.mh || {}, liftek: sl.length, liftSiker: sl.filter(function (l) { return l.siker; }).length,
             latszik: s.kocka ? true : !!b.latszik[s.id], polc: !!s.kocka };
  });
}

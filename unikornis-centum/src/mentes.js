/* ============ 4) MENTÉS ============ */
var KULCS = "unikornis_centum_v1";
var mentes;
function alapOdu() { return { napszak: "este", ido: "tiszta", van: { napszak: { este: 1 }, ido: { tiszta: 1 } }, szint: alapButorSzint(), vanButor: {}, disz: {}, vanDisz: {}, vitrin: {} }; }
function alapButorSzint() { return { fal: 1, szonyeg: 1, ablak: 1, fuggony: 1, agy: 1, fuzer: 1, kalyha: 1, polc: 1, asztal: 1 }; }
function alapOltozet() { return { fej: null, nyak: null, hat: null, lab: null, oldal: null, farok: null, van: {} }; }
function alapKinezet() { return { sorenySzin: 0, szemSzin: null, vanSoreny: { 0: 1 }, vanSzem: { "0": 1 }, frizura: "egyenes" }; }
function alapKapu() { return { nyitvaEddig: 0, kulcsKesz: {} }; }   /* 12 órás rejtett kapu (6.4) */
function alapKert() { return { nyitva: 0, trukkok: {}, keszlet: {}, elemek: [] }; }
function alapSzalon() { return { nyitva: 0, kefek: {} }; }   /* Fodrászat: nyitva=megvett szalon-belépő; kefek=megvett kefe-képességek (gondor/egyenes) */   /* Kert/udvar: nyitva=megvett kertkapu-kulcs; trukkok=séta-trükkök (2. fázis); keszlet=fészer (megvett, még le nem tett tárgyak, id→db); elemek=lerakott tárgyak [{tip,x,y}] (berendezés, 3. fázis) */
function alapJelvSzam() { return { felmondasOk: 0, beszedFeladat: 0, kuzdottGyozelem: 0, keruloTargy: 0, hibatlanAllomas: 0, vettMar: 0 }; }   /* jelvény-feloldás számlálók (10c) */
function alapProfil() { return { csillampor: 0, tunderharmat: 0, becenev: "", palyak: {}, naplo: [], jatekMp: 0, odu: alapOdu(), oltozet: alapOltozet(), jelvenyek: {}, streakRekord: 0, dropUres: 0, sorozat: { hossz: 0, utolsoPalya: null }, kinezet: alapKinezet(), kapu: alapKapu(), kert: alapKert(), szalon: alapSzalon(), jelvSzam: alapJelvSzam(), napok: {}, napiKiemelt: { datum: "", teljesitve: false } }; }
function alapMentes() { var pr = {}; LENY_SORREND.forEach(function (k) { pr[k] = alapProfil(); }); return { verzio: 1, leny: "ragyogas", hang: true, valaszmod: "beszed", profilok: pr }; }
function ment() { try { localStorage.setItem(KULCS, JSON.stringify(mentes)); } catch (e) {} felhoMentJelez(); }   /* felhő: no-op, ha nincs belépve */
/* egy profil hiányzó/régi mezőinek pótlása — a localStorage-ból ÉS a felhőből betöltött adatra is fut */
function profilNormal(p) {
  if (typeof p.csillampor !== "number") p.csillampor = 0;
  if (typeof p.tunderharmat !== "number") p.tunderharmat = 0;   /* kitartás-valuta (7.2) — új mentésekhez 0-ról */
  if (!p.palyak) p.palyak = {}; if (!p.naplo) p.naplo = [];
  if (typeof p.jatekMp !== "number") p.jatekMp = 0;
  if (!p.odu) p.odu = alapOdu();
  if (!p.odu.van) p.odu.van = { napszak: {}, ido: {} };
  if (!p.odu.van.napszak) p.odu.van.napszak = {};
  if (!p.odu.van.ido) p.odu.van.ido = {};
  p.odu.van.napszak.este = 1; p.odu.van.ido.tiszta = 1;   /* az alap mindig birtokolt */
  if (!p.odu.napszak) p.odu.napszak = "este";
  if (!p.odu.ido) p.odu.ido = "tiszta";
  if (!p.odu.szint) p.odu.szint = alapButorSzint();
  else { var asz = alapButorSzint(), hk; for (hk in asz) if (typeof p.odu.szint[hk] !== "number") p.odu.szint[hk] = asz[hk]; }
  if (!p.odu.vanButor) p.odu.vanButor = {};
  if (!p.odu.disz) p.odu.disz = {};
  if (!p.odu.vanDisz) p.odu.vanDisz = {};
  if (!p.odu.vitrin) p.odu.vitrin = {};
  if (!p.oltozet) p.oltozet = alapOltozet();
  if (!p.oltozet.van) p.oltozet.van = {};
  ["fej", "nyak", "hat", "lab", "oldal", "farok"].forEach(function (h) { if (p.oltozet[h] === undefined) p.oltozet[h] = null; });
  if (!p.jelvenyek) p.jelvenyek = {};
  if (!p.jelvSzam) p.jelvSzam = alapJelvSzam();
  else { var ajsz = alapJelvSzam(), jk; for (jk in ajsz) if (typeof p.jelvSzam[jk] !== "number") p.jelvSzam[jk] = ajsz[jk]; }
  if (!p.napok) p.napok = {};
  if (typeof p.streakRekord !== "number") p.streakRekord = 0;
  if (typeof p.dropUres !== "number") p.dropUres = 0;
  p.sorozat = { hossz: 0, utolsoPalya: null };   /* egy leülés = egy sorozat: minden betöltéskor nullázódik (7.1b) */
  if (!p.kinezet) p.kinezet = alapKinezet();
  if (typeof p.kinezet.sorenySzin !== "number") p.kinezet.sorenySzin = 0;
  if (!p.kinezet.vanSoreny) p.kinezet.vanSoreny = { 0: 1 };
  if (!p.kinezet.vanSzem) p.kinezet.vanSzem = { "0": 1 };
  if (!p.kinezet.frizura) p.kinezet.frizura = "egyenes";   /* FODRÁSZAT */
  p.kinezet.vanSoreny[0] = 1; p.kinezet.vanSzem["0"] = 1;
  if (!p.kapu) p.kapu = alapKapu();
  if (typeof p.kapu.nyitvaEddig !== "number") p.kapu.nyitvaEddig = 0;
  if (!p.kapu.kulcsKesz) p.kapu.kulcsKesz = {};
  if (!p.kert) p.kert = alapKert();
  if (typeof p.kert.nyitva !== "number") p.kert.nyitva = 0;
  if (!p.kert.trukkok) p.kert.trukkok = {};
  if (!p.kert.keszlet) p.kert.keszlet = {};      /* fészer: megvett, még le nem tett tárgyak */
  if (!p.kert.elemek) p.kert.elemek = [];        /* lerakott kerti tárgyak */
  if (!p.szalon) p.szalon = alapSzalon();        /* FODRÁSZAT */
  if (typeof p.szalon.nyitva !== "number") p.szalon.nyitva = 0;
  if (!p.szalon.kefek) p.szalon.kefek = {};
  if (typeof p.tkNyitva !== "number") p.tkNyitva = 0;   /* ÉGI TÜNEMÉNYKERT: egyszeri feloldás 💧-ért */
  if (!p.napiKiemelt) p.napiKiemelt = { datum: "", teljesitve: false };
  return p;
}
function betolt() {
  try {
    var m = JSON.parse(localStorage.getItem(KULCS));
    if (m && m.profilok) {
      mentes = m;
      LENY_SORREND.forEach(function (k) {
        if (!mentes.profilok[k]) mentes.profilok[k] = alapProfil();
        var p = mentes.profilok[k];
        profilNormal(p);
      });
      if (mentes.hang == null) mentes.hang = true;
      if (!mentes.valaszmod) mentes.valaszmod = "beszed";
      if (!mentes.ragyogasNulla20260906) {                 /* egyszeri visszaállítás: Ragyogás pont + megvásárolt eszközök nullázása */
        var rg = mentes.profilok.ragyogas;
        if (rg) { rg.csillampor = 0; rg.oltozet = alapOltozet(); rg.odu = alapOdu(); }
        mentes.ragyogasNulla20260906 = 1;
        ment();
      }
      return;
    }
  } catch (e) {}
  mentes = alapMentes();
}
function P() { return mentes.profilok[mentes.leny]; }

/* ── NAPI KIEMELT PÁLYA ──────────────────────────────────────────────────────
   Naponta 1 pálya kiemelve: +3 💧 extra tündérharmat a teljesítésért (naponta 1×).
   Determinisztikus random: dátum-alapú seed → mindenkinél ugyanaz, frissítéskor stabil. */
function napiKiemeltId() {
  var d = new Date(), ev = d.getFullYear(), ho = d.getMonth(), nap = d.getDate();
  var napSorsz = Math.floor((d - new Date(ev, 0, 0)) / 86400000);
  var jatszhatoIds = [];
  PALYAK.forEach(function (p) { if (!p.hamarosan && !palyaRejtve(p)) jatszhatoIds.push(p.id); });
  if (!jatszhatoIds.length) return null;
  var idx = ((ev * 367 + napSorsz * 13 + ho * 7) & 0x7FFFFFFF) % jatszhatoIds.length;
  return jatszhatoIds[idx];
}
function napiKiemeltMa() { return new Date().toISOString().slice(0, 10); }
function napiKiemeltTeljesitve() {
  var nk = P().napiKiemelt;
  return nk && nk.datum === napiKiemeltMa() && nk.teljesitve;
}
var NAPI_KIEMELT_HARMAT = 3;

/* ── JUTALOM-MOTOR (rendszerterv 7.1a) — egy helyen számol a régi beégetett 2/5/3/20 helyett.
   feladat = 1+szint (2→9) · tipp után helyes = 1 · felmondás = 42 (egy „produkció") ·
   állomás = 3 (állandó) · pálya vége = 10×(szint+1) (20→90). Hibázás sosem von le. */
function palyaSzint(palya) { return (palya && palya.szint) || 1; }
function jutalom(mit, palya) {
  var p = palya || (J && J.palya) || null, sz = palyaSzint(p), alap = 0;
  switch (mit) {
    case "feladat":   alap = sz >= 5 ? 2 : 1; break;   /* H7.1a: 1 ✨ (1–4. szint) · 2 ✨ (5–8) */
    case "tipp":      alap = 1; break;                 /* nem skálázódik – állandó horgony */
    case "felmondas": alap = 9; break;                 /* bontás / szorzótábla felmondása */
    case "allomas":   alap = 1; break;                 /* állomás kész – állandó horgony */
    case "palyavege": alap = 5 * sz; break;            /* 5 × szint (5 → 40) */
  }
  return Math.round(alap * palyaSzorzo(p));            /* producer extra-jutalma (×1,5 / ×2), alapból ×1 */
}
/* a pálya teljes becsült értéke (a „végig ≈ X ✨" kártya-sorhoz, 7.1d) — szorzó/teljes-ösvény nélkül.
   Az effektív tipus/darab az alap-ból öröklődik, ha az állomás nem írja felül. */
function palyaBecsultErtek(palya) {
  var alap = palya.alap || {}, n = palya.allomasok.length, feladatErtek = 0, allo = 0;
  var fDarab = +palyaFelulir(palya.id).darab;       /* producer feladatszáma (4. fázis) — ugyanúgy, mint a nehezsegAlkalmaz */
  for (var i = 1; i < n; i++) {
    var a = palya.allomasok[i], tip = a.tipus || alap.tipus;
    allo++;
    if (tip === "szambontas" || tip === "szorzotabla-felmondas") feladatErtek += jutalom("felmondas", palya);
    else feladatErtek += (fDarab >= 1 && fDarab <= 12 ? fDarab : (a.darab || alap.darab || 5)) * jutalom("feladat", palya);
  }
  return feladatErtek + allo * jutalom("allomas", palya) + jutalom("palyavege", palya);
}


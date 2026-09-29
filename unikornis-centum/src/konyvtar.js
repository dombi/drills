/* ============ 6d) 📚 BAGOLYKÖNYVTÁR — Zrínyi építőkocka-pályák (I. család: a kérdés elolvasása) ============
   Terv: Matekos\epitokocka-palyak-terv.html · rajz: …-rajzterv.html · tartalom (18 asztal-sablon): …-tartalom.html
   A pályák a constants.js SZARNYAK táblájából jönnek (szárny = egy osztály; új szárny = új sor). Egy állomás cfg-je:
     { tipus:"konyvtar", sablon, g (osztály: 3 / 5), kocka ("K1"…), darab, [odu, vegyes] }.
   Minden sablon a szárny osztályából veszi a számkört és a nehézséget (3. o.: ≤ 100, 1–2 lépés; 5. o.: ≤ 1000, 2–3 lépés),
   és minden feladattal együtt legyártja a CSAPDA-számokat + a csapda-mondatot (tiszta csapda: ha ütközne, új számok).
   Segítés: szóban 1. rossz → célzott csapda-mondat (vagy „Olvassuk el újra a kérdést!”) · 2. rossz → végigvezetés,
   mindig „Mit kérdeznek?”-kel kezdve. Koppintásnál: piros + billeg → halvány; a 2. rossz után a kérdés-keret felvillan,
   a döntő szó aranyba kerül. A lánc / ikerkérdés / lépcsőfok a meglévő „lanc” úton megy (egy pötty).
   Kocka-nap: az aznapi ELSŐ végigjárásban a pöttyök ≥ 80%-a elsőre jó → ◼ (3 nap → stabil; a Mesterpróba az 5b lépés). */

/* ── szereplők (csak a 10 állat — producer, 2026-09-28) és tárgyak ── */
var EK_SZ = [
  { e: "🐿️", n: "Mia", tel: "Mókus Mia", a: "a mókus", nak: "Miának", nal: "Miánál" },
  { e: "🦔", n: "Samu", tel: "Sün Samu", a: "a sün", nak: "Samunak", nal: "Samunál" },
  { e: "🐻", n: "Brumi", tel: "Medve Brumi", a: "a medve", nak: "Bruminak", nal: "Bruminál" },
  { e: "🐭", n: "Cincin", tel: "Egér Cincin", a: "az egér", nak: "Cincinnek", nal: "Cincinnél" },
  { e: "🐸", n: "Brekus", tel: "Béka Brekus", a: "a béka", nak: "Brekusnak", nal: "Brekusnál" },
  { e: "🦆", n: "Kata", tel: "Kacsa Kata", a: "a kacsa", nak: "Katának", nal: "Katánál" },
  { e: "🐢", n: "Tas", tel: "Teknős Tas", a: "a teknős", nak: "Tasnak", nal: "Tasnál" },
  { e: "🐷", n: "Pötyi", tel: "Malac Pötyi", a: "a malac", nak: "Pötyinek", nal: "Pötyinél" },
  { e: "🦡", n: "Bence", tel: "Borz Bence", a: "a borz", nak: "Bencének", nal: "Bencénél" },
  { e: "🐞", n: "Kitti", tel: "Katica Kitti", a: "a katica", nak: "Kittinek", nal: "Kittinél" }
];
var EK_TARGY = [
  { e: "🌰", n: "dió", t: "diót", ige: "gyűjtött", i: "diói" },
  { e: "🍄", n: "gomba", t: "gombát", ige: "talált", i: "gombái" },
  { e: "🍎", n: "alma", t: "almát", ige: "szedett", i: "almái" },
  { e: "🌼", n: "virág", t: "virágot", ige: "szedett", i: "virágai" },
  { e: "📿", n: "gyöngy", t: "gyöngyöt", ige: "fűzött fel", i: "gyöngyei" },
  { e: "⭐", n: "matrica", t: "matricát", ige: "kapott", i: "matricái" },
  { e: "🍪", n: "süti", t: "sütit", ige: "sütött", i: "sütijei" },
  { e: "🥚", n: "tojás", t: "tojást", ige: "talált", i: "tojásai" }
];
var EK_KET_LAB = [{ e: "🐔", n: "tyúk", k: "tyúkok", nak: "tyúkoknak" }, { e: "🐦", n: "galamb", k: "galambok", nak: "galamboknak" }, { e: "🦢", n: "gólya", k: "gólyák", nak: "gólyáknak" }];
var EK_NEGY_LAB = [{ e: "🐐", n: "kecske", k: "kecskék", nak: "kecskéknek" }, { e: "🐑", n: "bárány", k: "bárányok", nak: "bárányoknak" },
  { e: "🐕", n: "kutya", k: "kutyák", nak: "kutyáknak" }, { e: "🐈", n: "macska", k: "macskák", nak: "macskáknak" }];
var EK_NAPOK = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"];

/* ── két külön tengely (producer, 2026-09-29): SZERKEZET és SZÁMKÖR ──
   ekO(cfg): összetett szerkezet? → a 📜 Varázstekercs (cfg.ossz) és az 5. o. (g ≥ 5): zavaró „hány”-mondat, 3 szereplő, több réteg,
             vegyes egység, 2–3 lépéses lánc. A 📖 Mesekönyv (3. o.) az egyszerű ágat kapja.
   ekKis(cfg): 3. osztályos számkör (cfg.g < 5) → minden szám ≤ 100 (ekMax); a GEN.konyvtar a végén ellenőrzi is (ekTulNagy). */
function ekO(cfg) { return cfg.g >= 5 || !!cfg.ossz; }
function ekKis(cfg) { return cfg.g < 5; }
function ekMax(cfg) { return cfg.g < 5 ? 100 : 1000; }

/* ── véletlen + ragozás ── */
function ekR(a, b) { return veletlen(a, b); }
function ekE(t) { return t[veletlen(0, t.length - 1)]; }
function ekSzereplok(db) { return mKever(EK_SZ).slice(0, db); }
/* számok ragja a képernyőn („5-tel”, „12-t”, „3-szor”) — a szám utolsó nem-nulla helyiértéke dönt */
var EK_RAG = {
  t:    { e: ["", "et", "t", "at", "et", "öt", "ot", "et", "at", "et"], t: ["", "et", "at", "at", "et", "et", "at", "et", "at", "et"], sz: "at", ez: "et" },
  val:  { e: ["", "gyel", "vel", "mal", "gyel", "tel", "tal", "tel", "cal", "cel"], t: ["", "zel", "szal", "cal", "nel", "nel", "nal", "nel", "nal", "nel"], sz: "zal", ez: "rel" },
  nal:  { e: ["", "nél", "nél", "nál", "nél", "nél", "nál", "nél", "nál", "nél"], t: ["", "nél", "nál", "nál", "nél", "nél", "nál", "nél", "nál", "nél"], sz: "nál", ez: "nél" },
  szor: { e: ["", "szer", "szer", "szor", "szer", "ször", "szor", "szer", "szor", "szer"], t: ["", "szer", "szor", "szor", "szer", "szer", "szor", "szer", "szor", "szer"], sz: "szor", ez: "szer" },
  os:   { e: ["", "es", "es", "as", "es", "ös", "os", "es", "as", "es"], t: ["", "es", "as", "as", "es", "es", "as", "es", "as", "es"], sz: "as", ez: "es" }
};
function ekRagVeg(n, r) {
  var R = EK_RAG[r]; n = Math.abs(n);
  if (n % 10) return R.e[n % 10];
  if (n % 100) return R.t[(n % 100) / 10];
  if (n % 1000) return R.sz;
  return R.ez;
}
function ekRag(n, r) { return n + "-" + ekRagVeg(n, r); }
function ekOsaval(n) { var v = ekRagVeg(n, "os"); return n + "-" + v + (/[ao]/.test(v) ? "ával" : "ével"); }   /* „6-osával”, „4-esével” */
function ekA(n, nagy) { var a = mAz(n); return (nagy ? a.charAt(0).toUpperCase() + a.slice(1) : a) + " " + n; }   /* „az 5” / „A 12” */
function ekNagy(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
/* felolvasás: a ragos számokat szóval („5-tel” → „öttel”), a Ft/cm-t kiírva — a TTS így nem botlik meg */
function ekSzoRag(n, rag) {
  var b = mSzamSzo(n);
  if (/gy$/.test(b) && /^gy/.test(rag)) b = b.slice(0, -2) + "g";
  else if (/három$/.test(b) && /^a/.test(rag)) b = b.slice(0, -5) + "hárm";
  else if (/hét$/.test(b) && /^e/.test(rag)) b = b.slice(0, -3) + "het";
  else if (/tíz$/.test(b) && /^e/.test(rag)) b = b.slice(0, -3) + "tiz";
  else if (/kettő$/.test(b) && /^e/.test(rag)) b = b.slice(0, -5) + "kett";
  else if (/kettő$/.test(b) && /^sz/.test(rag)) b = b.slice(0, -5) + "két";
  return b + rag;
}
function ekSima(h) { return String(h == null ? "" : h).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " "); }
function ekKiejt(s) {
  return ekSima(s)
    .replace(/\bFt-/g, "forint").replace(/\bFt\b/g, "forint")
    .replace(/ cm-es/g, " centiméteres").replace(/ cm-t(?=[\s.,!?]|$)/g, " centimétert").replace(/ cm(?=[\s.,!?)]|$)/g, " centiméter").replace(/ dm(?=[\s.,!?)]|$)/g, " deciméter").replace(/ m(?=[\s.,!?)]|$)/g, " méter")
    .replace(/ · /g, " szorozva ").replace(/ : /g, " osztva ").replace(/ − /g, " mínusz ").replace(/ \+ /g, " meg ").replace(/ = /g, " az ").replace(/ → /g, ", ")
    .replace(/(\d+)–(\d+)/g, "$1-$2")
    .replace(/(\d+)-(\d+)/g, function (x, a, b) { return mSzamSzo(+a) + "-" + mSzamSzo(+b); })
    .replace(/(\d+)-([a-záéíóöőúüű]+)/gi, function (x, n, r) { return ekSzoRag(+n, r); })
    .replace(/\s+/g, " ").trim();
}

/* ── HTML-darabok (a rajzterv jóváhagyott elemei) ── */
function ekSok(e, n) { if (n > 8) return e; var s = ""; for (var i = 0; i < n; i++) s += e; return s; }
function ekErem(e, sz, c, o) {
  o = o || {};
  return '<div class="ek-erem"><div class="e' + (o.sok ? ' sok' : '') + '">' + e + '</div>' +
    (sz == null ? '' : '<div class="sz' + (sz === "?" ? ' q' : '') + '">' + sz + '</div>') + (c ? '<div class="c">' + c + '</div>' : '') + '</div>';
}
function ekSzamsor(t) { return '<div class="ek-szamsor">' + t.map(function (x) { return '<span>' + x + '</span>'; }).join("") + '</div>'; }
function ekBub(o) {
  return '<div class="ek-bub">' + (o.kep ? '<div class="ek-kep">' + o.kep + '</div>' : '') +
    (o.tort && o.tort.length ? '<div class="ek-tort">' + o.tort.map(function (t) { return '<p>' + t + '</p>'; }).join("") + '</div>' : '') +
    (o.kerdes != null ? '<div class="ek-kk' + (o.villan ? ' villan' : '') + '">' + o.kerdes + '</div>' : '') + (o.lepes || '') + '</div>';
}
function ekKi(s) { return '<b class="ek-ki">' + s + '</b>'; }   /* kis szó / kérdezett szó a kérdésben (rózsaszín) */
function ekTk(e, c, al, fent) { return (fent || "") + (e ? '<span class="e">' + e + '</span>' : '') + '<span class="cimke">' + c + '</span>' + (al ? '<span class="al">' + al + '</span>' : ''); }

/* ── feladat-építők ──
   csap: [[szám, mondat, fajta], …] — fajta: masik · egyseg · mind · elozo · kisszo · hatar · egyforma · resz · alkerdes · egyeb */
function ekCsap(lista, helyes) {
  var o = {};
  for (var i = 0; i < (lista || []).length; i++) {
    var c = lista[i], n = c[0];
    if (n == null) continue;
    if (n === helyes || n < 0 || n % 1) return null;          /* nem tiszta csapda → új számok */
    if (o[n] && o[n].m !== c[1]) return null;
    o[n] = { m: c[1], t: c[2] || "egyeb" };
  }
  return o;
}
function ekSzob(cfg, o) {
  var csap = ekCsap(o.csap, o.helyes);
  if (!csap || !(o.helyes >= 0) || o.helyes % 1) return null;
  var lanc = null;
  if (o.lanc) {
    lanc = [];
    for (var i = 0; i < o.lanc.length; i++) {
      var li = o.lanc[i], x = li.kopp ? li.kopp : ekSzob(cfg, { sablon: o.sablon, kep: o.kep, tort: o.tort, kerdes: li.kerdes, helyes: li.helyes, csap: li.csap,
        arany: li.arany, vezet: li.vezet, megoldas: li.megoldas, villan: true, olvas: false, elo: li.elo || "Ügyes! " });
      if (!x) return null;
      lanc.push(x);
    }
  }
  return {
    csalad: "egyenkent", nagySzam: cfg.g >= 5, jegyMax: cfg.g >= 5 ? 4 : 3,
    ek: { sablon: o.sablon, csap: csap, arany: o.arany || "", vezet: o.vezet || null, kerdes: o.kerdes, bub: { kep: o.kep, tort: o.tort } },
    kartyaHTML: ekBub({ kep: o.kep, tort: o.tort, kerdes: o.kerdes, villan: o.villan }),
    szoveg: ekSima(o.kerdes), felolvas: ekKiejt((o.elo || "") + " " + (o.olvas === false ? "" : (o.tort || []).join(" ")) + " " + ekSima(o.kerdes)),
    helyes: o.helyes, keplet: "", megoldas: o.megoldas || String(o.helyes), tipp: "", lanc: lanc, kulcs: o.kulcs,
    naplo: { tipus: "ek-" + o.sablon, kerdes: ekSima(o.kerdes).slice(0, 60), helyes: o.helyes, atlepes: false }
  };
}
/* koppintós: o.kopp = { tipus: "valaszt" | "mondat" | "tobb", kartyak: [{ h, jo, m, t, cls, … }], elo, hatarM } */
function ekKopp(cfg, o) {
  var f = {
    csalad: "koppint", nagySzam: cfg.g >= 5, jegyMax: cfg.g >= 5 ? 4 : 3,
    ek: { sablon: o.sablon, kopp: o.kopp, arany: o.arany || "", sug: o.sug || "", kerdes: o.kerdes, felolvasK: o.felolvasK || ekSima(o.kerdes), bub: { kep: o.kep, tort: o.tort }, vezetLepes: !!o.vezetLepes },
    kartyaHTML: ekBub({ kep: o.kep, tort: o.tort, kerdes: o.kerdes, villan: o.villan, lepes: o.lepes }),
    szoveg: ekSima(o.kerdes), felolvas: ekKiejt(o.felolvas != null ? o.felolvas : ((o.elo || "") + " " + (o.olvas === false ? "" : (o.tort || []).join(" ")) + " " + ekSima(o.kerdes))),
    helyes: 1, joKiir: o.joKiir || "", keplet: "", megoldas: o.joKiir || "", tipp: "", lanc: null, kulcs: o.kulcs,
    naplo: { tipus: "ek-" + o.sablon, kerdes: (ekSima(o.kerdes) || o.sablon).slice(0, 60), helyes: o.joKiir || "", atlepes: false }
  };
  if (o.lanc) f.lanc = o.lanc;
  return f;
}
/* A–E (Odú-küszöb, a Zrínyi-forma): v = [[érték, csapda-mondat|null], …] — a jó az o.helyes */
function ekAE(cfg, o) {
  var ertek = [o.helyes];
  o.v.forEach(function (x) { if (ertek.indexOf(x[0]) < 0 && x[0] >= 0) ertek.push(x[0]); });
  var tolt = 1;
  while (ertek.length < 5) { var c = o.helyes + tolt * (tolt % 2 ? 1 : -1) * (cfg.g >= 5 ? 10 : 1); tolt++; if (c > 0 && ertek.indexOf(c) < 0) ertek.push(c); }
  ertek = ertek.slice(0, 5).sort(function (a, b) { return a - b; });
  var M = {}; o.v.forEach(function (x) { M[x[0]] = x; });
  var K = ertek.map(function (n, i) {
    var betu = "ABCDE".charAt(i), c = M[n];
    return { h: '<span class="betu">' + betu + '</span><span class="cimke">' + n + '</span>', cls: "ek-ae", jo: n === o.helyes, m: c && c[1] ? c[1] : null, t: c && c[2] || "egyeb", betu: betu };
  });
  var jo = K.filter(function (k) { return k.jo; })[0];
  return ekKopp(cfg, { sablon: "ae-" + o.sablon, kep: o.kep, tort: o.tort, kerdes: o.kerdes, arany: o.arany, joKiir: "(" + jo.betu + ") " + o.helyes,
    kopp: { tipus: "valaszt", kartyak: K, elo: '<div class="ek-ae-cim">Válaszd ki a jó betűt — mint a versenyen!</div>' }, kulcs: o.kulcs });
}
function ekMondatKartyak(mondatok, joIdx, alIdx, alMondat) {
  return mondatok.map(function (s, i) {
    return { h: '<span class="sorsz">' + (i + 1) + '</span><span class="cimke">' + s + '</span>', cls: "ek-mk", jo: i === joIdx, szoveg: s,
      m: i === alIdx ? alMondat : null, t: "alkerdes" };
  });
}
function ekBeszur(tenyek, kerdes, hova) { var t = tenyek.slice(); t.splice(hova, 0, kerdes); return t; }

/* ═════════════════ 🔎 1. PÁLYA: KIT KÉRDEZNEK? ═════════════════ */
function ekNagyito(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), A = S[0], B = S[1], m, jo, al = -1, alM = null, kep, T = ekR(0, 2);
  if (g < 5) {
    var t = ekE(EK_TARGY), a = ekR(6, 20), b = ekR(2, 9), q;
    if (T === 0) { q = "Hány " + t.t + " " + t.ige + " " + B.n + "?"; m = [A.tel + " " + a + " " + t.t + " " + t.ige + ".", B.tel + " " + ekRag(b, "val") + " többet " + t.ige + "."]; kep = ekErem(A.e, a, A.n) + ekErem(B.e, "?", B.n); }
    else if (T === 1) { t = ekE([EK_TARGY[1], EK_TARGY[7]]); q = "Hány " + t.t + " talált " + A.n + "?"; m = [A.tel + " " + a + " " + t.t + " a fa alatt talált.", ekNagy(ekRag(b, "t")) + " a kő mellett talált."]; kep = ekErem(A.e, "?", A.n); }
    else { q = "Hány könyv maradt a polcon?"; m = ["A polcon " + a + " könyv áll.", A.tel + " elvitt belőle " + ekRag(b, "t") + "."]; kep = ekErem("📚", a, "a polcon") + ekErem(A.e, b, A.n); }
    jo = ekR(0, 2); m = ekBeszur(m, q, jo);
    var kulcs = "nagy" + T + a + b + jo;
  } else {
    var a5 = ekR(30, 90), p = ekR(8, a5 - 10), e = ekR(3, 6), fo = ekR(12, 24), su = ekR(18, 40), ad = ekR(4, su - 6);
    if (T === 0) { m = [A.tel + " " + a5 + " gyöngyöt fűzött fel.", A.n + " megszámolta, hány piros van köztük.", p + " piros volt, a többi kék."]; al = 1; q = "Hány kék gyöngyöt fűzött fel " + A.n + "?"; kep = ekErem(A.e, a5, A.n) + ekErem("📿", "?", "kék"); }
    else if (T === 1) { m = [A.tel + " felmászott a toronyba.", B.tel + " megkérdezte, hány emeletes a torony.", "A torony " + e + " emeletes, emeletenként " + fo + " fok."]; al = 1; q = "Számold ki, hány lépcsőfokot tett meg " + A.n + "!"; kep = ekErem(A.e, null, A.n) + ekErem("🗼", e, "emelet"); }
    else { m = [A.tel + " " + su + " sütit sütött.", B.n + " megkérdezte, hány süti jut neki.", A.n + " " + ekRag(ad, "t") + " adott " + B.nak + "."]; al = 1; q = "Hány sütije maradt " + A.nak + "?"; kep = ekErem(A.e, su, A.n) + ekErem(B.e, ad, B.n); }
    jo = ekE([0, 2, 3]); if (jo <= al) al++;
    m = ekBeszur(m, q, jo);
    alM = "Ebben is van „hány”, de ez csak elmeséli, mit csinált " + (T === 0 ? A.n : B.n) + ". Nekünk melyikre kell felelni?";
    kulcs = "nagy5" + T + a5 + p + e + su + jo;
  }
  var K = ekMondatKartyak(m, jo, al, alM);
  return ekKopp(cfg, { sablon: "nagyito", kep: kep, tort: [], kerdes: '<span class="kis">Koppints a kérdésre!</span>', joKiir: "ez a kérdés",
    felolvas: "Keresd meg a kérdést! Koppints arra a mondatra, amelyik a kérdés!", felolvasK: "Koppints arra a mondatra, amelyik a kérdés!",
    sug: "A kérdés az a mondat, amire felelnünk kell. Keresd a kérdőjelet" + (T === 1 && g >= 5 ? " vagy a felkiáltójelet!" : "!"),
    kopp: { tipus: "mondat", kartyak: K }, kulcs: kulcs });
}
var EK_KET_DOLOG = [
  { intro: "{A} két tortát sütött.", adat: "Az epreshez {a} tojás kellett, a csokishoz {b}.", k: ["Hány tojás kellett az <b>epres</b> tortához?", "Hány tojás kellett a <b>csokis</b> tortához?"], ar: ["epres", "csokis"], kartya: [["🍓", "epres torta"], ["🍫", "csokis torta"]], ki: ["🍓", "🍫"], nev: ["epres", "csokis"] },
  { intro: "{A} két kunyhót épített.", adat: "A szalmakunyhót {a} nap alatt, a fakunyhót {b} nap alatt építette.", k: ["Hány napig épült a <b>szalmakunyhó</b>?", "Hány napig épült a <b>fakunyhó</b>?"], ar: ["szalmakunyhó", "fakunyhó"], kartya: [["🛖", "szalmakunyhó"], ["🏠", "fakunyhó"]], ki: ["🛖", "🏠"], nev: ["szalma", "fa"] },
  { intro: "{A} két kertet ültetett be.", adat: "A virágoskertbe {a} tövet, a zöldségeskertbe {b} tövet ültetett.", k: ["Hány tövet ültetett a <b>virágoskertbe</b>?", "Hány tövet ültetett a <b>zöldségeskertbe</b>?"], ar: ["virágoskertbe", "zöldségeskertbe"], kartya: [["🌷", "virágoskert"], ["🥕", "zöldségeskert"]], ki: ["🌷", "🥕"], nev: ["virág", "zöldség"] }
];
function ekKirol(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), T = g < 5 ? ekR(0, 1) : ekR(0, 2), a = ekR(3, 20), b = ekR(3, 20), c = ekR(3, 20);
  if (a === b || b === c || a === c) return null;
  var S = ekSzereplok(3), K, kerdes, arany, kep, tort, jo = ekR(0, 1), kulcs = "kirol" + g + T + a + b;
  if (g < 5 && T === 0) {
    var t = ekE(EK_TARGY), Q = S[jo];
    tort = [S[0].tel + " " + a + " " + t.t + ", " + S[1].tel + " " + b + " " + t.t + " " + t.ige + "."];
    kerdes = "Hány " + t.t + " " + t.ige + " <b>" + Q.n + "</b>?"; arany = Q.n;
    kep = ekErem(S[0].e, a, S[0].n) + ekErem(S[1].e, b, S[1].n);
    K = [0, 1].map(function (i) { return { h: ekTk(S[i].e, S[i].n), jo: i === jo }; });
    kulcs += S[0].n + S[1].n + jo;
  } else if (g < 5) {
    var D = ekE(EK_KET_DOLOG);
    tort = [D.intro.replace("{A}", S[0].tel), D.adat.replace("{a}", a).replace("{b}", b)];
    kerdes = D.k[jo]; arany = D.ar[jo];
    kep = ekErem(D.ki[0], a, D.nev[0]) + ekErem(D.ki[1], b, D.nev[1]);
    K = [0, 1].map(function (i) { return { h: ekTk(D.kartya[i][0], D.kartya[i][1]), jo: i === jo }; });
    kulcs += D.nev[0] + jo;
  } else if (T < 2) {
    var t5 = ekE(EK_TARGY), n5 = [a, b, c]; jo = ekR(0, 2); var Q5 = S[jo];
    tort = [S[0].n + " " + a + ", " + S[1].n + " " + b + ", " + S[2].n + " " + c + " " + t5.t + " " + t5.ige + "."];
    kerdes = "Hány " + t5.t + " " + t5.ige + " <b>" + Q5.a + "</b>?"; arany = Q5.a;
    kep = S.map(function (s, i) { return ekErem(s.e, n5[i], s.n); }).join("");
    K = [0, 1, 2].map(function (i) { return { h: ekTk(S[i].e, S[i].n), jo: i === jo }; });
    kulcs += S[0].n + S[1].n + S[2].n + jo;
  } else {
    jo = ekR(0, 2); var ol = ["első", "hátsó", "oldalsó"], olK = ["az <b>első</b> oldal", "a <b>hátsó</b> oldal", "egy <b>oldalsó</b> oldal"];
    tort = [S[0].tel + " kerítést fest.", "Az első oldalt " + a + " nap alatt, a hátsót " + b + " nap alatt, a két oldalsót " + c + "–" + c + " nap alatt festi le."];
    kerdes = "Hány napig tart " + olK[jo] + " festése?"; arany = ol[jo];
    kep = ekErem("⬆️", a, "első") + ekErem("⬇️", b, "hátsó") + ekErem("↔️", c, "oldalsó");
    K = [0, 1, 2].map(function (i) { return { h: ekTk(["⬆️", "⬇️", "↔️"][i], ol[i] + " oldal"), jo: i === jo }; });
    kulcs += "ker" + c + jo;
  }
  return ekKopp(cfg, { sablon: "kirol", kep: kep, tort: tort, kerdes: kerdes + '<span class="kis">Kiről (miről) kérdez? Koppints rá! Számolni nem kell.</span>', arany: arany,
    felolvasK: ekSima(kerdes), sug: "Figyeld meg a kérdésben, kiről vagy miről szól!", joKiir: ekSima(K.filter(function (k) { return k.jo; })[0].h),
    kopp: { tipus: "valaszt", kartyak: mKever(K) }, kulcs: kulcs });
}
function ekMit(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), A = ekE(EK_SZ), P;
  if (g < 5) {
    var n = ekR(3, 9), d = ekR(2, 6), c = d * ekR(2, 6), s = ekR(3, 8);
    P = ekE([
      { tort: "A padon " + n + " galamb ül.", k: "Hány <b>lábuk</b> van összesen?", ar: "lábuk", K: [["🐦", "galambok", n], ["🦶", "lábak"]], jo: 1 },
      { tort: "Az utcán " + n + " autó parkol.", k: "Hány <b>kereke</b> van összesen az autóknak?", ar: "kereke", K: [["🚗", "autók", n], ["🛞", "kerekek"]], jo: 1 },
      { tort: A.tel + " " + n + " hétig olvasott egy könyvet.", k: "Hány <b>napig</b> olvasta?", ar: "napig", K: [["🗓️", "hetek", n], ["☀️", "napok"]], jo: 1 },
      { tort: A.tel + " " + n + " pár kesztyűt kapott.", k: "Hány <b>darab</b> kesztyűt kapott?", ar: "darab", K: [["🧤", "kesztyűpárok", n], ["✋", "kesztyűk (darab)"]], jo: 1 },
      { tort: c + " ceruzát " + ekOsaval(d) + " dobozokba rakunk.", k: "Hány <b>doboz</b> kell?", ar: "doboz", K: [["✏️", "ceruzák", c], ["📦", "dobozok"]], jo: 1 },
      { tort: "A teremben " + s + " sor szék áll, soronként " + n + ".", k: "Hány <b>szék</b> van a teremben?", ar: "szék", K: [["🪑", "székek"], ["↔️", "sorok", s]], jo: 0 }
    ]);
    var kulcs = "mit" + P.ar;      /* kulcs számok nélkül: egy asztalon ne jöjjön kétszer ugyanaz a kérdés */
  } else {
    var k = ekR(4, 9), so = ekR(6, 12), u = ekR(2, 4), h = ekR(1, 3), pe = ekE([10, 15, 20, 30, 45]), km = ekR(2, 5), e = ekR(3, 9), l = ekR(2, 6), ab = ekR(2, 5), fe = ekR(4, 9), ol = ekR(12, 30);
    P = ekE([
      { tort: "Egy vonat " + k + " kocsiból áll. Minden kocsiban " + so + " sor van, soronként " + u + " ülés.", k: "Hány <b>ülés</b> van egy kocsiban?", ar: "ülés", K: [["🚃", "kocsik", k], ["↔️", "sorok", so], ["💺", "ülések"]], jo: 2 },
      { tort: A.tel + " " + h + " óra " + pe + " percig sétált, óránként " + km + " km-t tett meg.", k: "Hány <b>percig</b> sétált?", ar: "percig", K: [["🕐", "órák", h], ["⏱️", "percek"], ["🛤️", "kilométerek"]], jo: 1 },
      { tort: "Egy " + e + " emeletes házban emeletenként " + l + " lakás van, lakásonként " + ab + " ablak.", k: "Hány <b>ablak</b> van a házban?", ar: "ablak", K: [["🏢", "emeletek", e], ["🚪", "lakások"], ["🪟", "ablakok"]], jo: 2 },
      { tort: "Egy könyv " + fe + " fejezetből áll, fejezetenként " + ol + " oldal. " + A.n + " naponta egy fejezetet olvas el.", k: "Hány <b>napig</b> olvassa a könyvet?", ar: "napig", K: [["📑", "fejezetek", fe], ["📄", "oldalak"], ["☀️", "napok"]], jo: 2 },
      { tort: "Egy dobozban " + e + " sor bonbon van, soronként " + l + ".", k: "Hány <b>sor</b> van a dobozban?", ar: "sor", K: [["📦", "dobozok"], ["↔️", "sorok"], ["🍬", "bonbonok"]], jo: 1 }
    ]);
    kulcs = "mit5" + P.ar;
  }
  var K = P.K.map(function (x, i) {
    return { h: ekTk(x[0], x[1]), jo: i === P.jo, m: x[2] != null ? ekNagy(x[1]) + " számát már tudjuk: " + x[2] + ". De mit kérdeztek?" : null, t: "egyseg" };
  });
  return ekKopp(cfg, { sablon: "mit", kep: ekErem(P.K[0][0], P.K[0][2] != null ? P.K[0][2] : "?", P.K[0][1]), tort: [P.tort], kerdes: P.k + '<span class="kis">Mit kell megszámolni? Koppints rá!</span>',
    felolvasK: ekSima(P.k), arany: P.ar, joKiir: P.K[P.jo][1], sug: "Nézd meg a kérdésben a kiemelt szót!", kopp: { tipus: "valaszt", kartyak: mKever(K) }, kulcs: kulcs });
}
function ekLanc(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), A = S[0], B = S[1], T = g < 5 ? ekR(0, 3) : ekR(0, 2), o;
  if (g < 5 && T === 0) {
    var n = ekR(2, 5), p = ekR(2, 9), d = ekR(1, 5), np = n * p;
    o = { kep: ekErem("✏️", np + " Ft", n + " ceruza", { sok: 0 }) + ekErem("🧽", "?", "1 radír"), tort: [n + " egyforma ceruza " + np + " Ft.", "Egy radír " + d + " Ft-tal drágább, mint egy ceruza."],
      kerdes: "Mennyibe kerül <b>1 ceruza</b>?", helyes: p, arany: "1 ceruza", megoldas: np + " : " + n + " = " + p,
      csap: [[np, ekA(np, true) + " a " + n + " ceruza együtt. De mennyibe kerül EGY?", "egyseg"]],
      lanc: [{ kerdes: "És mennyibe kerül <b>1 radír</b>?", helyes: p + d, arany: "radír", megoldas: p + " + " + d + " = " + (p + d),
        csap: [[p, ekA(p, true) + " a ceruza ára. Most a radírról kérdeztünk!", "elozo"], [np, ekA(np, true) + " a " + n + " ceruza együtt.", "mind"], [np + d, ekA(np + d, true) + " a " + n + " ceruza ára és még " + d + ". De EGY radírról kérdeztünk!", "egyseg"]],
        vezet: { mit: ["egy radír árát", "egy ceruza árát", "a " + n + " ceruza árát"], lepesek: [["Mennyibe kerül 1 ceruza?", p, np + " : " + n + " = " + p], ["Mennyivel drágább a radír?", d, d + " Ft-tal"]] } }], kulcs: "lc" + n + p + d };
  } else if (g < 5 && T === 1) {
    var K2 = ekE(EK_KET_LAB), K4 = ekE(EK_NEGY_LAB), t = ekR(2, 9), k = ekR(2, 8);
    o = { kep: ekErem(K2.e, t, K2.n) + ekErem(K4.e, k, K4.n), tort: ["Az udvaron " + t + " " + K2.n + " és " + k + " " + K4.n + " van."],
      kerdes: "Hány lába van a <b>" + K2.nak + "</b>?", helyes: 2 * t, arany: K2.nak, megoldas: t + " · 2 = " + 2 * t,
      csap: [[t, ekA(t, true) + " a " + K2.k + " száma. De a lábukról kérdeztünk!", "egyseg"]],
      lanc: [{ kerdes: "És a <b>" + K4.nak + "</b>?", helyes: 4 * k, arany: K4.nak, megoldas: k + " · 4 = " + 4 * k,
        csap: [[2 * t, "Ez a " + K2.k + " lába volt. Most a " + K4.k + "ról kérdeztünk!", "elozo"], [k, ekA(k, true) + " a " + K4.k + " száma. De a lábukról kérdeztünk!", "egyseg"], [2 * t + 4 * k, ekA(2 * t + 4 * k, true) + " mindenki lába együtt.", "mind"]],
        vezet: { mit: ["a " + K4.k + " lábait", "a " + K2.k + " lábait", "mindenki lábát"], lepesek: [["Hány " + K4.n + " van az udvaron?", k, k + " " + K4.n], ["Egy " + K4.n + "nak hány lába van?", 4, "4 láb"]] } }], kulcs: "ll" + t + k + K2.n };
  } else if (g < 5 && T === 2) {
    var h = ekR(1, 3), dd = ekR(3, 7 * h - 1);
    if (dd === h || 7 * h - dd === h) return null;
    o = { kep: ekErem(A.e, h + " hét", A.n) + ekErem(B.e, dd + " nap", B.n), tort: [A.tel + " " + h + " hétig nyaralt, " + B.tel + " " + dd + " napig."],
      kerdes: "Hány <b>napig</b> nyaralt " + A.n + "?", helyes: 7 * h, arany: "napig", megoldas: h + " · 7 = " + 7 * h,
      csap: [[h, ekA(h, true) + " a hetek száma. De hány NAPIG nyaralt?", "egyseg"]],
      lanc: [{ kerdes: "Mennyivel <b>többet</b> nyaralt " + A.n + ", mint " + B.n + "?", helyes: 7 * h - dd, arany: "többet", megoldas: 7 * h + " − " + dd + " = " + (7 * h - dd),
        csap: [[7 * h, ekA(7 * h, true) + " " + A.n + " nyaralása. Most azt kérdeztük, mennyivel több.", "elozo"], [dd > h ? dd - h : null, "Itt a " + h + " még hetet jelent. Hány nap is a " + h + " hét?", "egyseg"]],
        vezet: { mit: ["mennyivel nyaralt többet", "hány napig nyaralt " + A.n, "hány napig nyaralt " + B.n], lepesek: [["Hány napig nyaralt " + A.n + "?", 7 * h, h + " · 7 = " + 7 * h], ["Hány napig nyaralt " + B.n + "?", dd, dd + " nap"]] } }], kulcs: "ln" + h + dd };
  } else if (g < 5) {
    var t2 = ekE(EK_TARGY), a = ekR(5, 30), kk = ekR(2, 9);
    if (2 * a + kk > 100) return null;
    o = { kep: ekErem(A.e, a, A.n) + ekErem(B.e, "?", B.n), tort: [A.tel + " " + a + " " + t2.t + " " + t2.ige + ", " + B.tel + " " + ekRag(kk, "val") + " többet."],
      kerdes: "Hány " + t2.t + " " + t2.ige + " <b>" + B.n + "</b>?", helyes: a + kk, arany: B.n, megoldas: a + " + " + kk + " = " + (a + kk),
      csap: [[a, ekA(a, true) + " " + A.n + " " + t2.i + ". De kiről kérdeztünk?", "masik"], [kk, ekA(kk, true) + " csak azt mondja, mennyivel több. Hányat " + t2.ige + " " + B.n + "?", "egyeb"]],
      lanc: [{ kerdes: "És <b>ketten együtt</b>?", helyes: 2 * a + kk, arany: "ketten együtt", megoldas: a + " + " + (a + kk) + " = " + (2 * a + kk),
        csap: [[a + kk, ekA(a + kk, true) + " " + B.n + " " + t2.i + ". Most kettejükről kérdeztünk!", "elozo"], [a, ekA(a, true) + " " + A.n + " " + t2.i + ".", "masik"]],
        vezet: { mit: ["kettejük együtt", "csak " + B.n, "csak " + A.n], lepesek: [["Hányat " + t2.ige + " " + A.n + "?", a, a + ""], ["Hányat " + t2.ige + " " + B.n + "?", a + kk, a + " + " + kk + " = " + (a + kk)]] } }], kulcs: "ld" + a + kk };
  } else if (T === 0) {
    var nf = ekR(3, 6), pf = k3 ? ekR(3, 12) : ekR(6, 25), m = ekR(2, k3 ? 3 : 4), c = ekR(2, k3 ? 3 : 4), np2 = nf * pf;
    if (c * m * pf > ekMax(cfg) || np2 > ekMax(cfg)) return null;
    o = { kep: ekErem("📓", np2 + " Ft", nf + " füzet") + ekErem("📕", "?", c + " könyv"), tort: [nf + " füzet " + np2 + " Ft.", "Egy könyv " + ekRag(m, "szor") + " annyiba kerül, mint egy füzet."],
      kerdes: "Mennyibe kerül <b>1 füzet</b>?", helyes: pf, arany: "1 füzet", megoldas: np2 + " : " + nf + " = " + pf,
      csap: [[np2, ekA(np2, true) + " a " + nf + " füzet együtt. De mennyibe kerül EGY?", "egyseg"]],
      lanc: [{ kerdes: "És <b>" + c + " könyv</b>?", helyes: c * m * pf, arany: c + " könyv", megoldas: pf + " · " + m + " = " + m * pf + ", " + m * pf + " · " + c + " = " + c * m * pf,
        csap: [[m * pf, ekA(m * pf, true) + " EGY könyv ára. Hány könyvről kérdeztünk?", "egyseg"], [np2 * m, ekA(np2 * m, true) + " a " + nf + " füzet ára " + ekRag(m, "szor") + ". De a könyvet EGY füzethez mérjük!", "masik"], [pf, ekA(pf, true) + " a füzet ára. Most a könyvekről kérdeztünk!", "elozo"]],
        vezet: { mit: [c + " könyv árát", "egy könyv árát", "egy füzet árát"], lepesek: [["Mennyibe kerül 1 füzet?", pf, np2 + " : " + nf + " = " + pf], ["Mennyibe kerül 1 könyv?", m * pf, pf + " · " + m + " = " + m * pf]] } }], kulcs: "l5f" + nf + pf + m + c };
  } else if (T === 1) {
    var e = k3 ? ekR(2, 5) : ekR(3, 9), l = k3 ? ekR(2, 4) : ekR(2, 6), ab = k3 ? ekR(2, 4) : ekR(2, 5);
    if (e * l * ab > ekMax(cfg) || l * ab === e * ab || l * ab === e * l) return null;
    o = { kep: ekErem("🏢", e, "emelet") + ekErem("🚪", l, "lakás / emelet") + ekErem("🪟", ab, "ablak / lakás"), tort: ["Egy " + e + " emeletes házban emeletenként " + l + " lakás, lakásonként " + ab + " ablak van."],
      kerdes: "Hány <b>lakás</b> van a házban?", helyes: e * l, arany: "lakás", megoldas: e + " · " + l + " = " + e * l,
      csap: [[l, ekA(l, true) + " csak egy emelet lakásai.", "egyseg"], [e, ekA(e, true) + " az emeletek száma. De a lakásokról kérdeztünk!", "egyseg"]],
      lanc: [{ kerdes: "És hány <b>ablak</b>?", helyes: e * l * ab, arany: "ablak", megoldas: e * l + " · " + ab + " = " + e * l * ab,
        csap: [[e * l, ekA(e * l, true) + " a lakások száma. Most az ablakokról kérdeztünk!", "elozo"], [l * ab, ekA(l * ab, true) + " csak egy emelet ablakai.", "egyseg"], [e * ab, ekA(e * ab, true) + " az egy-egy lakás ablakai minden emeleten. Hány lakás van egy emeleten?", "egyseg"]],
        vezet: { mit: ["az összes ablakot", "a lakásokat", "egy emelet ablakait"], lepesek: [["Hány lakás van a házban?", e * l, e + " · " + l + " = " + e * l], ["Hány ablaka van egy lakásnak?", ab, ab + " ablak"]] } }], kulcs: "l5h" + e + l + ab };
  } else {
    var hh = ekR(2, 4), d2 = ekR(1, 6), k2 = ekR(2, 6), ossz = 7 * hh + d2;
    if (k2 === d2) return null;
    o = { kep: ekErem(A.e, hh + " hét " + d2 + " nap", A.n) + ekErem(B.e, "?", B.n), tort: [A.tel + " " + hh + " hétig és még " + d2 + " napig táborozott, " + B.tel + " " + k2 + " nappal kevesebbet."],
      kerdes: "Hány <b>napig</b> táborozott " + A.n + "?", helyes: ossz, arany: "napig", megoldas: hh + " · 7 + " + d2 + " = " + ossz,
      csap: [[hh + d2, "A hét nem 1 nap! Hány nap egy hét?", "egyseg"], [7 * hh, "A " + d2 + " napot is hozzá kell adni!", "egyeb"]],
      lanc: [{ kerdes: "És <b>" + B.n + "</b>?", helyes: ossz - k2, arany: B.n, megoldas: ossz + " − " + k2 + " = " + (ossz - k2),
        csap: [[ossz, ekA(ossz, true) + " " + A.n + " napjai. Most " + B.n + " felől kérdeztünk!", "elozo"], [ossz + k2, B.n + " KEVESEBBET táborozott, nem többet!", "egyeb"]],
        vezet: { mit: [B.n + " napjait", A.n + " napjait", "kettejük napjait együtt"], lepesek: [["Hány napig táborozott " + A.n + "?", ossz, hh + " · 7 + " + d2 + " = " + ossz], ["Hány nappal kevesebbet " + B.n + "?", k2, k2 + " nap"]] } }], kulcs: "l5t" + hh + d2 + k2 };
  }
  o.sablon = "lanc";
  return ekSzob(cfg, o);
}
function ekNyomoz(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(3), A = S[0], B = S[1], C = S[2], T = ekR(0, 3), o;
  if (g < 5 && T === 0) {
    var H = ekE([{ h1: "a tónál", h2: "a hídnál", al: "kacsa", ige: "úszik", e: "🦆" }, { h1: "a fán", h2: "a bokron", al: "veréb", ige: "ül", e: "🐦" }, { h1: "az erdőben", h2: "a réten", al: "nyuszi", ige: "ugrál", e: "🐇" }]);
    var a = ekR(5, 40), k = ekR(2, 9);
    if (2 * a + k > 100) return null;
    o = { kep: ekErem(H.e, a, H.h1.replace(/^az? /, "")) + ekErem(H.e, "?", H.h2.replace(/^az? /, "")), tort: [ekNagy(H.h1) + " " + a + " " + H.al + " " + H.ige + ", " + H.h2 + " " + ekRag(k, "val") + " több."],
      kerdes: "Hány " + H.al + " " + H.ige + " <b>" + H.h2 + "</b>?", helyes: a + k, arany: H.h2, megoldas: a + " + " + k + " = " + (a + k),
      csap: [[a, ekA(a, true) + " azt mondja, hány " + H.al + " " + H.ige + " " + H.h1 + ". De hol kérdeztük?", "masik"], [k, ekA(k, true) + " csak azt mondja, mennyivel több. Hány " + H.al + " " + H.ige + " " + H.h2 + "?", "egyeb"],
        [2 * a + k, ekA(2 * a + k, true) + " a két helyen együtt.", "mind"], [a - k > 0 ? a - k : null, "Ez kivonás lett. De " + H.h2 + " TÖBB " + H.al + " " + H.ige + "!", "egyeb"]],
      vezet: { mit: ["akik " + H.h2 + " vannak", "akik " + H.h1 + " vannak", "mindenkit együtt"], lepesek: [["Hány " + H.al + " " + H.ige + " " + H.h1 + "?", a, a + ""], [ekNagy(H.h2) + " " + ekRag(k, "val") + " több. Mennyi " + a + " + " + k + "?", a + k, a + " + " + k + " = " + (a + k)]] }, kulcs: "ny" + a + k + H.al };
  } else if (g < 5 && T === 1) {
    var K2 = ekE(EK_KET_LAB), K4 = ekE(EK_NEGY_LAB), x = ekR(2, 9), y = ekR(2, 8), kerd4 = ekR(0, 1) === 1;
    var Q = kerd4 ? K4 : K2, M = kerd4 ? K2 : K4, qn = kerd4 ? y : x, mn = kerd4 ? x : y, ql = kerd4 ? 4 : 2, ml = kerd4 ? 2 : 4;
    o = { kep: ekErem(K2.e, x, K2.n) + ekErem(K4.e, y, K4.n), tort: ["A réten " + x + " " + K2.n + " és " + y + " " + K4.n + " áll."],
      kerdes: "Hány lába van a <b>" + Q.nak + "</b>?", helyes: qn * ql, arany: Q.nak, megoldas: qn + " · " + ql + " = " + qn * ql,
      csap: [[mn * ml, ekA(mn * ml, true) + " a " + M.k + " lába. De kiről kérdeztünk?", "masik"], [2 * x + 4 * y, ekA(2 * x + 4 * y, true) + " mindenki lába együtt.", "mind"],
        [qn, ekA(qn, true) + " a " + Q.k + " száma. De a lábukról kérdeztünk!", "egyseg"], [x + y, ekA(x + y, true) + " az összes állat.", "mind"]],
      vezet: { mit: ["a " + Q.k + " lábait", "a " + M.k + " lábait", "az összes állatot"], lepesek: [["Hány " + Q.n + " áll a réten?", qn, qn + ""], ["Egy " + Q.n + "nak hány lába van?", ql, ql + " láb"]] }, kulcs: "nyl" + x + y + kerd4 };
  } else if (g < 5 && T === 2) {
    var n = ekR(2, 5), p = ekR(3, 12), d = ekR(1, 5), dragabb = ekR(0, 1) === 1, np = n * p, v = dragabb ? p + d : p - d;
    if (v <= 0 || np > 100) return null;
    o = { kep: ekErem("🍎", np + " Ft", n + " alma") + ekErem("🍐", "?", "1 körte"), tort: [n + " alma " + np + " Ft.", "Egy körte " + d + " Ft-tal " + (dragabb ? "drágább" : "olcsóbb") + ", mint egy alma."],
      kerdes: "Mennyibe kerül <b>egy körte</b>?", helyes: v, arany: "egy körte", megoldas: np + " : " + n + " = " + p + ", " + p + (dragabb ? " + " : " − ") + d + " = " + v,
      csap: [[p, ekA(p, true) + " egy alma ára. De miről kérdeztünk?", "masik"], [dragabb ? np + d : (np - d > 0 ? np - d : null), "Ez a " + n + " alma árából jött ki. A körte EGY almához képest " + (dragabb ? "drágább" : "olcsóbb") + ".", "egyseg"], [np, ekA(np, true) + " a " + n + " alma együtt.", "mind"]],
      vezet: { mit: ["egy körte árát", "egy alma árát", "a " + n + " alma árát"], lepesek: [["Mennyibe kerül egy alma?", p, np + " : " + n + " = " + p], ["A körte " + d + " Ft-tal " + (dragabb ? "drágább" : "olcsóbb") + ". Mennyi " + p + (dragabb ? " + " : " − ") + d + "?", v, p + (dragabb ? " + " : " − ") + d + " = " + v]] }, kulcs: "nyar" + n + p + d + dragabb };
  } else if (g < 5) {
    var aa = ekR(2, 9), m = ekR(2, 5);
    if (aa * m > 50 || aa === m) return null;
    o = { kep: ekErem("🍓", aa, "epres üveg") + ekErem("🫐", "?", "málnás üveg"), tort: [A.tel + " az epres lekvárt " + aa + " üvegbe, a málnást " + ekRag(m, "szor") + " annyiba töltötte."],
      kerdes: "Hány üveg <b>málnalekvár</b> lett?", helyes: aa * m, arany: "málnalekvár", megoldas: aa + " · " + m + " = " + aa * m,
      csap: [[aa, ekA(aa, true) + " az epres üvegek száma. De melyik lekvárról kérdeztünk?", "masik"], [aa + aa * m, ekA(aa + aa * m, true) + " az összes üveg.", "mind"], [aa + m, "A „" + ekRag(m, "szor") + " annyi” nem " + ekRag(m, "val") + " több!", "egyeb"]],
      vezet: { mit: ["a málnás üvegeket", "az epres üvegeket", "az összes üveget"], lepesek: [["Hány epres üveg van?", aa, aa + ""], ["A málnás " + ekRag(m, "szor") + " annyi. Mennyi " + aa + " · " + m + "?", aa * m, aa + " · " + m + " = " + aa * m]] }, kulcs: "nym" + aa + m };
  } else if (T <= 1) {
    var a5 = 2 * (k3 ? ekR(5, 30) : ekR(10, 100)), k5 = k3 ? ekR(2, 15) : ekR(3, 30), fel = a5 / 2;
    o = { kep: ekErem(A.e, a5, A.n) + ekErem(B.e, "?", B.n) + ekErem(C.e, "?", C.n), tort: [A.tel + " " + a5 + " diót gyűjtött.", B.tel + " feleannyit, " + C.tel + " " + ekRag(k5, "val") + " többet, mint " + B.n + "."],
      kerdes: "Hány diót gyűjtött <b>" + C.n + "</b>?", helyes: fel + k5, arany: C.n, megoldas: a5 + " : 2 = " + fel + ", " + fel + " + " + k5 + " = " + (fel + k5),
      csap: [[fel, ekA(fel, true) + " " + B.n + " diói. De kiről kérdeztünk?", "masik"], [a5 + k5, C.n + " nem " + A.nal + ", hanem " + B.nal.toUpperCase() + " gyűjtött " + ekRag(k5, "val") + " többet.", "masik"], [a5 + fel + fel + k5, ekA(a5 + fel + fel + k5, true) + " mindhárman együtt.", "mind"]],
      vezet: { mit: [C.n + " dióit", B.n + " dióit", "mindhármuk dióit"], lepesek: [["Hány diót gyűjtött " + B.n + "?", fel, a5 + " : 2 = " + fel], [C.n + " " + ekRag(k5, "val") + " többet, mint " + B.n + ". Mennyi " + fel + " + " + k5 + "?", fel + k5, fel + " + " + k5 + " = " + (fel + k5)]] }, kulcs: "ny5d" + a5 + k5 };
  } else if (T === 2) {
    var pp = ekR(2, 4), kp = ekR(25, 90), dp = ekR(8, kp - 5), ord = ["", "", "", "harmadik", "negyedik", "ötödik"][pp + 1];
    o = { kep: ekErem("📚", kp, "egy teli polc") + ekErem("📕", "?", ord + " polc"), tort: ["A könyvtárban " + pp + " polcon " + kp + "-" + kp + " könyv áll.", "A " + ord + " polcon " + ekRag(dp, "val") + " kevesebb, mint egy teli polcon."],
      kerdes: "Hány könyv van a <b>" + ord + "</b> polcon?", helyes: kp - dp, arany: ord, megoldas: kp + " − " + dp + " = " + (kp - dp),
      csap: [[kp, ekA(kp, true) + " egy teli polc. De melyik polcról kérdeztünk?", "masik"], [pp * kp + kp - dp, ekA(pp * kp + kp - dp, true) + " az összes könyv.", "mind"], [pp * kp - dp, "Egy teli polchoz mérjük, nem mind a " + pp + "-höz!", "egyseg"]],
      vezet: { mit: ["a " + ord + " polc könyveit", "egy teli polc könyveit", "az összes könyvet"], lepesek: [["Hány könyv van egy teli polcon?", kp, kp + ""], ["A " + ord + " polcon " + ekRag(dp, "val") + " kevesebb. Mennyi " + kp + " − " + dp + "?", kp - dp, kp + " − " + dp + " = " + (kp - dp)]] }, kulcs: "ny5p" + pp + kp + dp };
  } else {
    var K2b = ekE(EK_KET_LAB), L = mKever(EK_NEGY_LAB).slice(0, 2), t = k3 ? ekR(3, 12) : ekR(5, 30), k1 = k3 ? ekR(2, 12) : ekR(3, 20), k2 = k3 ? ekR(2, 12) : ekR(3, 20);
    if (k1 === k2 || 4 * (k1 + k2) > ekMax(cfg)) return null;
    o = { kep: ekErem(K2b.e, t, K2b.n) + ekErem(L[0].e, k1, L[0].n) + ekErem(L[1].e, k2, L[1].n), tort: ["Az udvaron " + t + " " + K2b.n + ", " + k1 + " " + L[0].n + " és " + k2 + " " + L[1].n + " van."],
      kerdes: "Hány lába van a <b>" + L[0].nak + " és a " + L[1].nak + "</b> együtt?", helyes: 4 * (k1 + k2), arany: L[0].nak + " és a " + L[1].nak, megoldas: "(" + k1 + " + " + k2 + ") · 4 = " + 4 * (k1 + k2),
      csap: [[4 * k1, ekA(4 * k1, true) + " csak a " + L[0].k + " lába. A " + L[1].k + " is kellenek!", "masik"], [4 * k2, ekA(4 * k2, true) + " csak a " + L[1].k + " lába. A " + L[0].k + " is kellenek!", "masik"],
        [2 * t + 4 * (k1 + k2), ekA(2 * t + 4 * (k1 + k2), true) + " mindenki lába — a " + K2b.k + " is. De róluk nem kérdeztünk!", "mind"], [k1 + k2, ekA(k1 + k2, true) + " az állatok száma. De a lábukról kérdeztünk!", "egyseg"]],
      vezet: { mit: ["a " + L[0].k + " és a " + L[1].k + " lábait", "mindenki lábát", "a " + K2b.k + " lábait"], lepesek: [["Hány " + L[0].n + " és " + L[1].n + " van együtt?", k1 + k2, k1 + " + " + k2 + " = " + (k1 + k2)], ["Mindegyiknek 4 lába van. Mennyi " + (k1 + k2) + " · 4?", 4 * (k1 + k2), (k1 + k2) + " · 4 = " + 4 * (k1 + k2)]] }, kulcs: "ny5l" + t + k1 + k2 };
  }
  o.sablon = "nyomoz";
  return ekSzob(cfg, o);
}
function ekAeK1(cfg) {
  if (!ekO(cfg)) {
    var K2 = ekE(EK_KET_LAB), K4 = ekE(EK_NEGY_LAB), t = ekR(4, 9), m = ekR(2, 6);
    return ekAE(cfg, { sablon: "K1", kep: ekErem(K2.e, t, K2.n) + ekErem(K4.e, m, K4.n), tort: ["A kertben " + t + " " + K2.n + " és " + m + " " + K4.n + " van."], kerdes: "Hány lába van a <b>" + K4.nak + "</b> összesen?", arany: K4.nak, helyes: 4 * m,
      v: [[m, ekA(m, true) + " a " + K4.k + " száma. De a lábukról kérdeztünk!", "egyseg"], [t + m, ekA(t + m, true) + " az összes állat.", "mind"], [2 * t, ekA(2 * t, true) + " a " + K2.k + " lába. De kiről kérdeztünk?", "masik"], [2 * t + 4 * m, ekA(2 * t + 4 * m, true) + " mindenki lába együtt.", "mind"]], kulcs: "ae1" + t + m });
  }
  var S = ekSzereplok(2), h = ekR(2, 4), d = ekR(1, 6), k = ekR(3, 9), ossz = 7 * h + d;
  if (k === d) return null;
  return ekAE(cfg, { sablon: "K1", kep: ekErem(S[0].e, h + " hét " + d + " nap", S[0].n) + ekErem(S[1].e, "?", S[1].n), tort: [S[0].tel + " " + h + " hét és " + d + " nap alatt olvasta el a könyvet, " + S[1].tel + " " + k + " nappal hamarabb végzett."],
    kerdes: "Hány napig olvasott <b>" + S[1].n + "</b>?", arany: S[1].n, helyes: ossz - k,
    v: [[k, "A " + k + " csak az, hogy mennyivel hamarabb végzett.", "egyeb"], [7 * h - k, "A " + d + " nap kimaradt!", "egyeb"], [ossz, ekA(ossz, true) + " " + S[0].n + " napjai. De kiről kérdeztünk?", "masik"], [ossz + k, S[1].n + " HAMARABB végzett — kevesebb napig olvasott!", "egyeb"]], kulcs: "ae15" + h + d + k });
}

/* ═════════════════ 🔤 2. PÁLYA: KIS SZAVAK ═════════════════ */
function ekIker(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), T = g < 5 ? ekR(0, 3) : ekR(0, 1), o;
  if (g < 5 && T === 0) {
    var SZ = [["piros", "🎈"], ["kék", "🔵"], ["sárga", "🟡"]], n = [ekR(1, 6), ekR(1, 6), ekR(1, 6)], i = ekR(0, 2), ossz = n[0] + n[1] + n[2], j = (i + 1) % 3, k = (i + 2) % 3;
    o = { kep: SZ.map(function (s, x) { return ekErem(ekSok(s[1], n[x]), n[x], s[0], { sok: 1 }); }).join(""), tort: ["Panka lufikat vett a vásárban."],
      kerdes: "Hány <b>" + SZ[i][0] + "</b> lufit vett?", helyes: n[i], megoldas: n[i] + "",
      lanc: [{ kerdes: "És hány " + ekKi("NEM") + " " + SZ[i][0] + " lufit?", helyes: ossz - n[i], arany: "NEM", megoldas: n[j] + " + " + n[k] + " = " + (ossz - n[i]),
        csap: [[n[i], ekA(n[i], true) + " a " + SZ[i][0].toUpperCase() + " lufik száma. De a második kérdésben ott a „nem” szó!", "kisszo"], [ossz, ekA(ossz, true) + " az összes lufi. A NEM " + { piros: "pirosakat", "kék": "kékeket", "sárga": "sárgákat" }[SZ[i][0]] + " kérdeztük.", "mind"]],
        vezet: { mit: ["a nem " + SZ[i][0] + " lufikat", "a " + SZ[i][0] + " lufikat", "az összes lufit"], lepesek: [["Hány " + SZ[j][0] + " lufi van?", n[j], n[j] + ""], ["Hány " + SZ[k][0] + " lufi van?", n[k], n[k] + ""]] } }], kulcs: "ik" + n.join("") + i };
  } else if (g < 5 && T === 1) {
    var paros = ekR(0, 1) === 1, par = paros ? "páros" : "páratlan", jegy = [], ism = null;
    for (var q = 0; q < 6; q++) jegy.push(ekR(0, 9));
    var celok = jegy.filter(function (x) { return (x % 2 === 0) === paros; });
    celok.forEach(function (x, ix) { if (celok.indexOf(x) !== ix) ism = x; });
    var kul = celok.filter(function (x, ix) { return celok.indexOf(x) === ix; }).length;
    if (ism == null || celok.length < 3) return null;
    o = { kep: ekSzamsor(jegy), tort: ["Számkártyák: " + jegy.join(", ") + "."], kerdes: "Hány <b>" + par + "</b> számjegy van a kártyákon?", helyes: celok.length, megoldas: celok.join(", ") + " → " + celok.length,
      lanc: [{ kerdes: "És hány " + ekKi("KÜLÖNBÖZŐ") + " " + par + "?", helyes: kul, arany: "KÜLÖNBÖZŐ", megoldas: celok.filter(function (x, ix) { return celok.indexOf(x) === ix; }).join(", ") + " → " + kul,
        csap: [[celok.length, ekA(ism, true) + " többször is ott van a kártyákon. A KÜLÖNBÖZŐKET kérdeztük: ami egyforma, az egynek számít!", "egyforma"], [6, "A 6 az összes kártya.", "mind"]],
        vezet: { mit: ["hányféle " + par + " szám van", "hány " + par + " kártya van", "hány kártya van"], lepesek: [["Hány " + par + " kártya van?", celok.length, celok.join(", ")], ["Hány " + par + " kártya ismétlődik (egy korábbi másolata)?", celok.length - kul, (celok.length - kul) + ""]] } }], kulcs: "ij" + jegy.join("") };
  } else if (g < 5 && T === 2) {
    var GY = mKever([["🍎", "alma"], ["🍐", "körte"], ["🍌", "banán"], ["🍊", "narancs"]]).slice(0, ekR(2, 4)), kosar = [];
    GY.forEach(function (x) { for (var r = ekR(1, 3); r > 0; r--) kosar.push(x[0]); });
    kosar = mKever(kosar);
    if (kosar.length === GY.length) return null;
    o = { kep: '<div class="ek-kosar">' + kosar.join("") + '</div>', tort: ["A kosárban gyümölcsök vannak."], kerdes: "Hány gyümölcs van a kosárban?", helyes: kosar.length, megoldas: kosar.length + "",
      lanc: [{ kerdes: "És hány " + ekKi("KÜLÖNBÖZŐ") + " fajta?", helyes: GY.length, arany: "KÜLÖNBÖZŐ", megoldas: GY.map(function (x) { return x[1]; }).join(", ") + " → " + GY.length,
        csap: [[kosar.length, ekA(kosar.length, true) + " az összes gyümölcs. Hányféle van?", "mind"]], vezet: null }], kulcs: "ig" + kosar.join("") };
  } else if (g < 5) {
    var mm = ekR(2, 9), sz = ekR(1, 6), at = ekR(1, 5), ossz2 = mm + sz + at;
    o = { kep: ekErem("📘", mm, "mesekönyv") + ekErem("📙", sz, "szótár") + ekErem("🗺️", at, "atlasz"), tort: ["A polcon " + mm + " mesekönyv, " + sz + " szótár és " + at + " atlasz áll."],
      kerdes: "Hány könyv van a polcon?", helyes: ossz2, megoldas: mm + " + " + sz + " + " + at + " = " + ossz2,
      lanc: [{ kerdes: "És hány " + ekKi("NEM") + " mesekönyv?", helyes: sz + at, arany: "NEM", megoldas: sz + " + " + at + " = " + (sz + at),
        csap: [[mm, ekA(mm, true) + " a mesekönyvek száma — pont azok, amik NEM kellenek!", "kisszo"], [ossz2, ekA(ossz2, true) + " az összes könyv.", "elozo"]],
        vezet: { mit: ["ami nem mesekönyv", "a mesekönyveket", "az összes könyvet"], lepesek: [["Hány szótár van?", sz, sz + ""], ["Hány atlasz van?", at, at + ""]] } }], kulcs: "ip" + mm + sz + at };
  } else if (T === 0) {
    var L = [], dup = ekR(10, 99);
    L.push(dup, dup);
    var ketj = ekR(1, 3), egyj = k3 ? ekR(2, 3) : ekR(1, 2), harj = k3 ? 0 : ekR(1, 2), r2;
    for (r2 = 0; r2 < ketj; r2++) L.push(ekR(10, 99)); for (r2 = 0; r2 < egyj; r2++) L.push(ekR(1, 9)); for (r2 = 0; r2 < harj; r2++) L.push(ekR(100, 999));
    L = mKever(L);
    var kj = L.filter(function (x) { return x >= 10 && x <= 99; }), kjk = kj.filter(function (x, ix) { return kj.indexOf(x) === ix; }).length;
    if (kjk === kj.length) return null;
    o = { kep: ekSzamsor(L), tort: ["A táblán ezek a számok állnak: " + L.join(", ") + "."], kerdes: "Hány <b>kétjegyű</b> szám van a táblán?", helyes: kj.length, megoldas: kj.join(", ") + " → " + kj.length,
      lanc: [{ kerdes: "És hány " + ekKi("KÜLÖNBÖZŐ") + " kétjegyű?", helyes: kjk, arany: "KÜLÖNBÖZŐ", megoldas: kj.filter(function (x, ix) { return kj.indexOf(x) === ix; }).join(", ") + " → " + kjk,
        csap: [[kj.length, ekA(dup, true) + " kétszer szerepel. A különbözőket kérdeztük!", "egyforma"], [L.length, ekA(L.length, true) + " az összes szám a táblán.", "mind"]],
        vezet: { mit: ["hányféle kétjegyű szám van", "hány kétjegyű szám áll a táblán", "hány szám van a táblán"], lepesek: [["Hány kétjegyű szám áll a táblán?", kj.length, kj.join(", ")], ["Ebből hány ismétlés?", kj.length - kjk, (kj.length - kjk) + ""]] } }], kulcs: "i5k" + L.join("") };
  } else {
    var h = ekR(15, 60), L2 = [h];
    if (ekR(0, 1)) L2.push(h);
    while (L2.length < 6) L2.push(ekR(h - 14, h + 20));
    L2 = mKever(L2);
    var nagy = L2.filter(function (x) { return x > h; }).length, nemkis = L2.filter(function (x) { return x >= h; }).length;
    if (nagy === 0 || nemkis === L2.length) return null;
    o = { kep: ekSzamsor(L2), tort: ["A táblán: " + L2.join(", ") + "."], kerdes: "Hány szám <b>nagyobb</b> " + ekRag(h, "nal") + "?", helyes: nagy, megoldas: nagy + "",
      lanc: [{ kerdes: "És hány " + ekKi("NEM KISEBB") + " " + ekRag(h, "nal") + "?", helyes: nemkis, arany: "NEM KISEBB", megoldas: L2.filter(function (x) { return x >= h; }).join(", ") + " → " + nemkis,
        csap: [[nagy, "A " + h + " sem kisebb " + ekRag(h, "nal") + " — ő is számít!", "hatar"], [L2.length, ekA(L2.length, true) + " az összes szám.", "mind"]],
        vezet: { mit: ["ami " + h + " vagy annál nagyobb", "ami " + ekRag(h, "nal") + " nagyobb", "az összes számot"], lepesek: [["Hány szám nagyobb " + ekRag(h, "nal") + "?", nagy, nagy + ""], ["Hányszor szerepel maga " + ekA(h) + "?", nemkis - nagy, (nemkis - nagy) + ""]] } }], kulcs: "i5n" + L2.join("") };
  }
  o.sablon = "iker";
  return ekSzob(cfg, o);
}
function ekNemKopp(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), L = [], jo;
  if (g < 5) {
    var paratlanKell = ekR(0, 1) === 1;            /* „Melyik szám NEM páros?” → a páratlan a jó */
    while (L.length < 3) { var x = 2 * ekR(1, 10) - (paratlanKell ? 0 : 1); if (L.indexOf(x) < 0) L.push(x); }
    jo = 2 * ekR(1, 10) - (paratlanKell ? 1 : 0); if (L.indexOf(jo) >= 0) return null;
    var szo = paratlanKell ? "páros" : "páratlan";
    var K = L.map(function (n) { return { h: '<span class="cimke nagy">' + n + '</span>', m: ekA(n, true) + " " + szo + " — a NEM " + (paratlanKell ? "párosat" : "páratlant") + " keressük!", t: "kisszo" }; });
    K.push({ h: '<span class="cimke nagy">' + jo + '</span>', jo: true });
    return ekKopp(cfg, { sablon: "nem", kep: "", tort: [], kerdes: "Melyik szám " + ekKi("NEM") + " " + szo + "?", arany: "NEM", joKiir: jo + "", kopp: { tipus: "valaszt", kartyak: mKever(K) }, kulcs: "nk" + L.join("") + jo });
  }
  while (L.length < 3) { var y = 3 * ekR(4, 33); if (L.indexOf(y) < 0) L.push(y); }
  jo = ekR(10, 99); if (jo % 3 === 0) return null;
  var K5 = L.map(function (n) { return { h: '<span class="cimke nagy">' + n + '</span>', m: ekA(n, true) + " osztható 3-mal (" + n + " : 3 = " + n / 3 + "). A NEM oszthatót keressük!", t: "kisszo" }; });
  K5.push({ h: '<span class="cimke nagy">' + jo + '</span>', jo: true });
  return ekKopp(cfg, { sablon: "nem", kep: "", tort: [], kerdes: "Melyik szám " + ekKi("NEM") + " osztható 3-mal?", arany: "NEM", joKiir: jo + "", kopp: { tipus: "valaszt", kartyak: mKever(K5) }, kulcs: "nk5" + L.join("") + jo });
}
function ekNem(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), T = ekR(0, 3), o;
  if (T === 1) return ekNemKopp(cfg);
  if (g < 5 && T === 0) {
    var SZ = mKever(["piros", "kék", "zöld", "sárga", "lila"]).slice(0, ekR(2, 4)), zok = [];
    SZ.forEach(function (s) { zok.push(s); });
    while (zok.length < 6) zok.push(ekE(SZ));
    zok = mKever(zok);
    o = { kep: zok.map(function (s) { return ekErem("🧦", null, s); }).join(""), tort: ["A fiókban 6 zokni van: " + zok.join(", ") + "."],
      kerdes: "Hány " + ekKi("KÜLÖNBÖZŐ") + " színű zokni van a fiókban?", helyes: SZ.length, arany: "KÜLÖNBÖZŐ", megoldas: SZ.join(", ") + " → " + SZ.length,
      csap: [[6, "A 6 az összes zokni. Hányféle SZÍN van?", "mind"]], kulcs: "nz" + zok.join("") };
  } else if (g < 5 && T === 2) {
    var n = ekR(5, 10), s = ekR(2, n - 2);
    o = { kep: ekErem("🐾", n, "kis állat") + ekErem("🧢", s, "sapkás"), tort: ["A tisztáson " + n + " kis állat játszik, " + s + " közülük sapkát visel."],
      kerdes: "Hány kis állat " + ekKi("NEM") + " visel sapkát?", helyes: n - s, arany: "NEM", megoldas: n + " − " + s + " = " + (n - s),
      csap: [[s, ekA(s, true) + " a sapkások száma. Mi a NEM sapkásokat kérdeztük!", "kisszo"], [n, ekA(n, true) + " az összes kis állat.", "mind"]],
      vezet: { mit: ["akin nincs sapka", "akin van sapka", "az összes kis állatot"], lepesek: [["Hány kis állat van összesen?", n, n + ""], ["Ebből hányon van sapka?", s, s + ""]] }, kulcs: "ns" + n + s };
  } else if (g < 5) {
    var h = ekR(4, 9), L = [h], fel = ekR(0, 1) === 1;
    while (L.length < 5) { var x = ekR(1, 12); if (L.indexOf(x) < 0) L.push(x); }
    L = mKever(L);
    var jo = L.filter(function (v) { return fel ? v >= h : v <= h; }).length;
    o = { kep: ekSzamsor(L), tort: ["Számok: " + L.join(", ") + "."], kerdes: "Hány szám " + ekKi("NEM " + (fel ? "kisebb" : "nagyobb")) + " " + ekRag(h, "nal") + "?", helyes: jo, arany: "NEM " + (fel ? "kisebb" : "nagyobb"), megoldas: L.filter(function (v) { return fel ? v >= h : v <= h; }).join(", ") + " → " + jo,
      csap: [[jo - 1, "A " + h + " nem " + (fel ? "kisebb" : "nagyobb") + " " + ekRag(h, "nal") + " — őt is számold!", "hatar"], [L.length - jo, "Ezek a " + (fel ? "kisebbek" : "nagyobbak") + ". A NEM " + (fel ? "kisebbeket" : "nagyobbakat") + " kérdeztük!", "kisszo"]], kulcs: "nn" + L.join("") + fel };
  } else if (T === 0) {
    var N = ekR(9, 20), jo5 = 0, ptl = 0;
    for (var i = 1; i <= N; i++) { if (i % 2) ptl++; if (i % 2 && i % 3) jo5++; }
    o = { kep: ekSzamsor(["1", "2", "3", "…", String(N)]), tort: ["Az 1, 2, 3, … " + N + " számokat nézzük."], kerdes: "Hány szám " + ekKi("NEM") + " osztható " + ekKi("SEM") + " 2-vel, " + ekKi("SEM") + " 3-mal?", helyes: jo5, arany: "SEM",
      megoldas: (function () { var r = []; for (var i = 1; i <= N; i++) if (i % 2 && i % 3) r.push(i); return r.join(", ") + " → " + jo5; })(),
      csap: [[ptl, ekA(ptl, true) + " csak a 2-vel nem oszthatók. A 3-mal oszthatókat is ki kell venni!", "kisszo"], [N - Math.floor(N / 2) - Math.floor(N / 3), "Ami 2-vel is és 3-mal is osztható (például a 6), azt kétszer vetted el — de az csak egy szám!", "egyforma"]],
      vezet: { mit: ["ami se 2-vel, se 3-mal nem osztható", "ami 2-vel nem osztható", "ami 3-mal nem osztható"], lepesek: [["Hány páratlan szám van " + N + "-ig?", ptl, ptl + ""], ["A páratlanok közül hány osztható 3-mal?", ptl - jo5, (ptl - jo5) + ""]] }, kulcs: "n5s" + N };
  } else {
    var S = ekE(EK_SZ), n5 = ekR(4, 9), e = ekR(2, 3);
    o = { kep: ekErem(S.e, n5, "ruha"), tort: [S.tel + " " + n5 + " ruhát próbált fel, " + (e === 2 ? "kettő" : "három") + " közülük egyforma volt."],
      kerdes: "Hány " + ekKi("KÜLÖNBÖZŐ") + " ruhát próbált fel?", helyes: n5 - e + 1, arany: "KÜLÖNBÖZŐ", megoldas: n5 + " − " + (e - 1) + " = " + (n5 - e + 1),
      csap: [[n5, "Az egyformák egynek számítanak!", "egyforma"], [n5 - e, "Az egyformák közül EGY megmarad — az is egy különböző ruha!", "egyforma"]], kulcs: "n5r" + n5 + e };
  }
  o.sablon = "nem";
  return ekSzob(cfg, o);
}
var EK_REL = [
  { szo: "LEGALÁBB", f: function (v, h) { return v >= h; }, hm: "Akinek pont {h} van, annak is van legalább {h}!" },
  { szo: "LEGFELJEBB", f: function (v, h) { return v <= h; }, hm: "Akinek pont {h} van, annak legfeljebb {h} van — őt is jelöld!" },
  { szo: "TÖBB, MINT", f: function (v, h) { return v > h; }, hm: "Akinek {h} van, annak nem több, mint {h} — pont annyi." },
  { szo: "KEVESEBB, MINT", f: function (v, h) { return v < h; }, hm: "Akinek {h} van, annak nem kevesebb, mint {h} — pont annyi." },
  { szo: "PONTOSAN", f: function (v, h) { return v === h; }, hm: null }
];
function ekLegalabb(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(g < 5 ? 5 : 6), T = ekE([["⭐", "matricája", "matrica"], ["🍎", "almája", "alma"], ["✏️", "ceruzája", "ceruza"]]);
  if (g >= 5 && (J.feladatKesz % 5 === 1 || J.feladatKesz % 5 === 3)) {       /* 5. o.: szóbeli „legalább hány kell, hogy TÖBB legyen” */
    var a = ekR(5, 60), b = a + ekR(3, 40), A = S[0], B = S[1];
    return ekSzob(cfg, { sablon: "legalabb", kep: ekErem(A.e, a, A.n) + ekErem(B.e, b, B.n), tort: [A.nak + " " + a + ", " + B.nak + " " + b + " diója van."],
      kerdes: ekKi("LEGALÁBB") + " hány diót kell még " + A.nak + " szereznie, hogy " + ekKi("TÖBB") + " legyen neki, mint " + B.nak + "?", helyes: b - a + 1, arany: "TÖBB",
      megoldas: b + " − " + a + " = " + (b - a) + ", és még 1 → " + (b - a + 1),
      csap: [[b - a, "Ha csak " + ekRag(b - a, "t") + " szerez, neki is " + b + " lenne — az egyenlő, nem több!", "hatar"], [b, ekA(b, true) + " " + B.n + " diói. Mennyit kell még SZEREZNIE?", "masik"]],
      vezet: { mit: ["hány kell, hogy több legyen", "hány kell, hogy ugyanannyi legyen", "hány diója van " + B.nak], lepesek: [["Hány kell, hogy ugyanannyi legyen? " + b + " − " + a + " = ?", b - a, b + " − " + a + " = " + (b - a)], ["És hogy TÖBB legyen, még egy. Mennyi " + (b - a) + " + 1?", b - a + 1, (b - a) + " + 1 = " + (b - a + 1)]] }, kulcs: "lsz" + a + b });
  }
  var h, h2, rel, V = [], igaz;
  if (g < 5) {
    rel = ekE(EK_REL); h = ekR(3, 6);
    V = S.map(function () { return ekR(1, 8); });
    V[ekR(0, 4)] = h;
    igaz = function (v) { return rel.f(v, h); };
  } else {
    h = ekR(8, 14); h2 = h + ekR(3, 6);
    V = S.map(function () { return ekR(5, 22); });
    V[0] = h; V[1] = h2; V = mKever(V);
    igaz = function (v) { return v >= h && v <= h2; };
  }
  var db = V.filter(igaz).length, hatarDb = V.filter(function (v) { return v === h || v === h2; }).length;
  if (db === 0 || db === V.length) return null;
  var K = S.map(function (s, i) {
    return { h: '<span class="e">' + s.e + '</span><span class="matr">' + ekSok(T[0], V[i]) + '</span><span class="cimke">' + s.n + '</span><span class="al">' + V[i] + " " + T[2] + '</span>', cls: "ek-gy", jo: igaz(V[i]), hatar: V[i] === h || V[i] === h2 };
  });
  var kerd = g < 5 ? "Kinek van " + ekKi(rel.szo) + " " + h + " " + T[1] + "?" : "Kinek van " + ekKi("LEGALÁBB") + " " + h + ", de " + ekKi("LEGFELJEBB") + " " + h2 + " " + T[1] + "?";
  var hatarM = g < 5 ? (rel.hm ? rel.hm.replace(/\{h\}/g, h) : null) : "A " + h + " és a " + h2 + " is benne van!";
  var csDb = g < 5 ? (rel.szo === "LEGALÁBB" || rel.szo === "LEGFELJEBB" ? db - V.filter(function (v) { return v === h; }).length : (rel.hm ? db + V.filter(function (v) { return v === h; }).length : null)) : db - hatarDb;
  var szob = ekSzob(cfg, { sablon: "legalabb", kep: "", tort: [], kerdes: kerd + " Hányan vannak?", helyes: db, arany: g < 5 ? rel.szo : "LEGALÁBB",
    megoldas: db + "", csap: [[csDb, hatarM || "Nézd meg újra a határt!", "hatar"], [V.length, "Ennyien vannak összesen. Csak akikre igaz!", "mind"]], olvas: false, elo: "Ügyes! És hányan vannak?", villan: true });
  if (!szob) return null;
  return ekKopp(cfg, { sablon: "legalabb", kep: "", tort: [], kerdes: kerd + '<span class="kis">Koppints mindenkire, akire igaz, aztán: Kész!</span>', felolvasK: kerd, arany: g < 5 ? rel.szo : "LEGALÁBB", joKiir: "",
    kopp: { tipus: "tobb", kartyak: K, hatarM: hatarM }, lanc: [szob], kulcs: "lg" + V.join("") + h });
}
function ekNapKopp(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), ma = ekR(0, 6), kerd, jo, tort, kep, tipus, K = [];
  if (g < 5) {
    var V = ekE([["holnap", 1, "lesz"], ["holnapután", 2, "lesz"], ["tegnap", -1, "volt"], ["tegnapelőtt", -2, "volt"]]), fordit = ekR(0, 2) === 0 && Math.abs(V[1]) === 2;
    if (fordit) { var ismert = (ma + V[1] + 7) % 7; tort = [ekNagy(V[0]) + " " + EK_NAPOK[ismert] + " " + V[2] + "."]; kerd = "Milyen nap van " + ekKi("MA") + "?"; jo = ma; tipus = [V[0], ismert, -V[1]]; }
    else { tort = ["Ma " + EK_NAPOK[ma] + " van."]; kerd = "Milyen nap " + V[2] + " " + ekKi(V[0].toUpperCase()) + "?"; jo = (ma + V[1] + 7) % 7; tipus = [V[0], ma, V[1]]; }
    var tav = [0, 1, -1, 2, -2, 3].map(function (d) { return (jo + d + 7) % 7; });
    var cel = tav.filter(function (x, i) { return tav.indexOf(x) === i; }).slice(0, 4);
    K = cel.map(function (n) {
      var m = null, alap = tipus[1];
      if (n !== jo) {
        if (n === alap) m = fordit ? ekNagy(EK_NAPOK[n]) + " volt " + tipus[0] + ". Ma melyik nap van?" : "Ez a mai nap. De " + tipus[0] + "?";
        else if (!fordit && n === (alap + (tipus[2] > 0 ? 1 : -1) + 7) % 7 && Math.abs(tipus[2]) === 2) m = ekNagy(EK_NAPOK[n]) + " a " + (tipus[2] > 0 ? "holnap" : "tegnap") + ". " + ekNagy(tipus[0]) + " még egy nappal " + (tipus[2] > 0 ? "később" : "korábban") + " van!";
        else m = "Számold napról napra!";
      }
      return { h: '<span class="cimke">' + EK_NAPOK[n] + '</span>', jo: n === jo, m: m, t: "kisszo" };
    });
    kep = ekErem("📅", null, fordit ? tipus[0] + ": " + EK_NAPOK[tipus[1]] : "ma: " + EK_NAPOK[ma]);
  } else {
    var k = ekR(8, 20); if (k % 7 === 0) return null;
    jo = (ma + k) % 7; tort = ["Ma " + EK_NAPOK[ma] + " van."]; kerd = "Milyen nap lesz " + ekKi(k + " nap múlva") + "?";
    var het = Math.floor(k / 7) * 7, cel5 = [jo, (jo + 1) % 7, (jo + 6) % 7, (ma + k % 7 + 1) % 7].filter(function (x, i, a) { return a.indexOf(x) === i; });
    if (cel5.length < 3) return null;
    K = cel5.map(function (n) { return { h: '<span class="cimke">' + EK_NAPOK[n] + '</span>', jo: n === jo, m: n === jo ? null : "Számold meg újra: " + het + " nap múlva megint " + EK_NAPOK[ma] + " van, és még " + (k - het) + " nap…", t: "kisszo" }; });
    kep = ekErem("📅", null, "ma: " + EK_NAPOK[ma]);
  }
  return ekKopp(cfg, { sablon: "par", kep: kep, tort: tort, kerdes: kerd, arany: g < 5 ? (tipus && tipus[0] ? (fordit ? "MA" : tipus[0].toUpperCase()) : "") : k + " nap múlva", joKiir: EK_NAPOK[jo], kopp: { tipus: "valaszt", kartyak: mKever(K) }, kulcs: "pn" + ma + kerd });
}
function ekPar(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), sor = g < 5 ? ["par", "nap", "szomsz", "het", "tucat"] : ["nap", "szomsz", "tabor", "het", "par"];
  var fajta = sor[ekRot("par", sor.length)], o;
  if (fajta === "nap") return ekNapKopp(cfg);
  if (fajta === "par") {
    var P = ekE([["cipő", "👟"], ["zokni", "🧦"], ["kesztyű", "🧤"]]), n = g < 5 ? ekR(2, 9) : ekR(12, 45);
    o = { kep: ekErem(P[1], n + " pár", P[0]), tort: [], kerdes: n + " " + ekKi("pár") + " " + P[0] + " hány darab " + P[0] + "?", helyes: 2 * n, arany: "pár", megoldas: n + " · 2 = " + 2 * n,
      csap: [[n, ekA(n, true) + " a párok száma. Egy párban hány " + P[0] + " van?", "kisszo"]], kulcs: "pp" + n + P[0] };
  } else if (fajta === "szomsz") {
    var sz = k3 ? ekR(11, 24) : ekR(102, 245);
    if (sz % 10 === 0 || sz === 17 || sz === 23 || sz === 34) return null;
    var t = Math.floor(sz / 10) * 10, egy = 2 * sz, tiz = 2 * t + 10;
    o = { kep: ekErem("🔢", sz, "a szám"), tort: [], kerdes: "Mennyi a " + sz + " " + ekKi("EGYES") + " és " + ekKi("TÍZES") + " számszomszédainak az összege?", helyes: egy + tiz, arany: "TÍZES",
      megoldas: (sz - 1) + " + " + (sz + 1) + " + " + t + " + " + (t + 10) + " = " + (egy + tiz),
      csap: [[egy, ekA(egy, true) + " csak az egyes számszomszédok összege. A tízeseket is kérdeztük!", "kisszo"], [tiz, ekA(tiz, true) + " csak a tízes szomszédoké. Az egyeseket is kérdeztük!", "kisszo"]],
      vezet: { mit: ["mind a négy szomszéd összegét", "csak az egyes szomszédokat", "csak a tízes szomszédokat"], lepesek: [["A " + sz + " egyes szomszédai: " + (sz - 1) + " és " + (sz + 1) + ". Mennyi az összegük?", egy, (sz - 1) + " + " + (sz + 1) + " = " + egy], ["A tízes szomszédai: " + t + " és " + (t + 10) + ". Mennyi az összegük?", tiz, t + " + " + (t + 10) + " = " + tiz]] }, kulcs: "ps" + sz };
  } else if (fajta === "het") {
    var h = g < 5 ? ekR(1, 3) : ekR(4, 12), d = ekR(1, 6);
    o = { kep: ekErem("🗓️", h + " hét " + d + " nap", ""), tort: [], kerdes: h + " " + ekKi("hét") + " és " + d + " nap hány nap?", helyes: 7 * h + d, arany: "hét", megoldas: h + " · 7 + " + d + " = " + (7 * h + d),
      csap: [[h + d, "A hét nem 1 nap! Hány nap egy hét?", "kisszo"], [7 * h, "A " + d + " napot is hozzá kell adni!", "egyeb"]], kulcs: "ph" + h + d };
  } else if (fajta === "tucat") {
    if (ekR(0, 1)) o = { kep: ekErem("🥚", "½ tucat", "tojás"), tort: [], kerdes: ekKi("Fél") + " tucat tojás hány tojás?", helyes: 6, arany: "Fél", megoldas: "12 : 2 = 6", csap: [[12, "A 12 egy egész tucat. Mi a FELÉT kérdeztük.", "kisszo"]], kulcs: "pt0" };
    else { var tu = ekR(2, 4); o = { kep: ekErem("🥚", tu + " tucat", "tojás"), tort: [], kerdes: tu + " " + ekKi("tucat") + " tojás hány tojás?", helyes: 12 * tu, arany: "tucat", megoldas: tu + " · 12 = " + 12 * tu, csap: [[tu, ekA(tu, true) + " a tucatok száma. Egy tucat hány darab?", "kisszo"]], kulcs: "pt" + tu }; }
  } else {
    var hh = ekR(2, 5), dd = ekR(2, 6);
    o = { kep: ekErem("⛺", hh + " hét", "tábor"), tort: ["A tábor " + hh + " hétig tart, de az " + ekKi("utolsó") + " héten csak " + dd + " nap van."], kerdes: "Hány napos a tábor?", helyes: 7 * (hh - 1) + dd, arany: "utolsó",
      megoldas: (hh - 1) + " · 7 + " + dd + " = " + (7 * (hh - 1) + dd), csap: [[7 * hh, "Az utolsó hét csak " + dd + " napos!", "kisszo"], [hh + dd, "A hét nem 1 nap! Hány nap egy hét?", "kisszo"]], kulcs: "pb" + hh + dd };
  }
  o.sablon = "par";
  return ekSzob(cfg, o);
}
function ekMindketto(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), o;
  if (g < 5) {
    var S = ekSzereplok(6), L = S.map(function () { return ekR(0, 3); });   /* 0 egyik sem · 1 alma · 2 körte · 3 mindkettő */
    var db = [0, 0, 0, 0]; L.forEach(function (x) { db[x]++; });
    if (!db[1] || !db[2] || !db[3]) return null;
    var fo = ekR(0, 1) ? ["az almát", "alma", 1, "a körtét", 2] : ["a körtét", "körte", 2, "az almát", 1];
    var egyAll = db[fo[2]] + db[3], masAll = db[fo[4]] + db[3], csak = db[fo[2]];
    var fajta = ekRot("mindk", 4), jel = ["–", "🍎", "🍐", "🍎🍐"];
    var kep = S.map(function (s, i) { return ekErem(s.e, jel[L[i]], s.n); }).join("");
    var tort = ["Ki melyik gyümölcsöt szereti? A képen látod: 🍎 = alma, 🍐 = körte."];
    if (fajta === 0) o = { kerdes: "Hányan szeretik " + ekKi("MINDKÉT") + " gyümölcsöt?", helyes: db[3], arany: "MINDKÉT", csap: [[egyAll, ekA(egyAll, true) + " mindenki, aki " + fo[0] + " szereti. Mindkettőt kérdeztük!", "kisszo"], [masAll, ekA(masAll, true) + " mindenki, aki " + fo[3] + " szereti. Mindkettőt kérdeztük!", "kisszo"]] };
    else if (fajta === 1) o = { kerdes: "Hányan szeretik " + ekKi("CSAK") + " " + fo[0] + "?", helyes: csak, arany: "CSAK", csap: [[egyAll, "Aki " + fo[3] + " is szereti, az nem CSAK " + fo[0] + " szereti!", "kisszo"]] };
    else if (fajta === 2) o = { kerdes: "Hányan szeretik " + fo[0] + "?", helyes: egyAll, arany: fo[0], csap: [[csak, "Itt nincs „csak” — aki mindkettőt szereti, az is szereti " + fo[0] + "!", "kisszo"]] };
    else { if (!db[0]) return null; o = { kerdes: "Hányan " + ekKi("NEM") + " szeretik " + ekKi("EGYIKET SEM") + "?", helyes: db[0], arany: "EGYIKET SEM", csap: [[6 - db[0], "Ennyien szeretnek valamit. Akik EGYIKET SEM szeretik?", "kisszo"]] }; }
    o.kep = kep; o.tort = tort; o.megoldas = o.helyes + ""; o.kulcs = "mk" + L.join("") + fajta;
  } else {
    var fajta5 = ekRot("mindk5", 4), S5 = ekE(EK_SZ);
    if (fajta5 === 0) {
      var a = ekR(3, 9), q = ekR(3, 12), r = ekR(1, a - 1), p = a * q + r;
      if (p > 100) return null;
      o = { kep: ekErem(S5.e, p + " Ft", S5.n) + ekErem("⭐", a + " Ft", "1 matrica"), tort: [S5.nak + " " + p + " Ft-ja van. Egy matrica " + a + " Ft."], kerdes: ekKi("LEGFELJEBB") + " hány matricát vehet?", helyes: q, arany: "LEGFELJEBB",
        megoldas: q + " · " + a + " = " + q * a + " (még belefér), " + (q + 1) + " · " + a + " = " + (q + 1) * a + " (már nem)", csap: [[q + 1, (q + 1) + " matrica " + (q + 1) * a + " Ft lenne — arra nincs elég pénze.", "hatar"]], kulcs: "m5m" + p + a };
    } else if (fajta5 === 1) {
      var n = ekR(20, 30), both = ekR(2, 8), u = ekR(both + 3, n - 3), f = n - u + both;
      if (f <= both || f > n) return null;
      o = { kep: ekErem("🏊", u, "úszás") + ekErem("⚽", f, "foci"), tort: ["Az erdei iskolában " + n + " tanuló van. " + u + " szeret úszni, " + f + " focizni, és mindenki legalább az egyiket szereti."],
        kerdes: "Hányan szeretik " + ekKi("MINDKETTŐT") + "?", helyes: both, arany: "MINDKETTŐT", megoldas: u + " + " + f + " − " + n + " = " + both,
        csap: [[u + f, (u + f) + " tanuló nincs is! Akik mindkettőt szeretik, kétszer lettek megszámolva.", "egyforma"], [n, ekA(n, true) + " az összes tanuló.", "mind"]],
        vezet: { mit: ["akik mindkettőt szeretik", "akik úszni szeretnek", "az összes tanulót"], lepesek: [["Ha összeadjuk: " + u + " + " + f + " = ?", u + f, u + " + " + f + " = " + (u + f)], ["Ez több, mint " + n + ". Mennyivel?", u + f - n, (u + f) + " − " + n + " = " + (u + f - n)]] }, kulcs: "m5u" + n + u + f };
    } else if (fajta5 === 2) {
      var m = ekR(3, 9), s = ekR(10, 60);
      if (s % m === 0) return null;
      var qq = Math.floor(s / m);
      o = { kep: ekErem("🍪", s, "süti") + ekErem("🍽️", "?", "tányér"), tort: [s + " sütit tányérokra rakunk, mindegyikre " + ekKi("LEGALÁBB") + " " + ekRag(m, "t") + "."], kerdes: ekKi("LEGFELJEBB") + " hány tányér kell?", helyes: qq, arany: "LEGFELJEBB",
        megoldas: qq + " · " + m + " = " + qq * m + " (belefér), " + (qq + 1) + " · " + m + " = " + (qq + 1) * m + " (már nem)", csap: [[qq + 1, (qq + 1) + " tányérra legalább " + (qq + 1) * m + " süti kellene.", "hatar"]], kulcs: "m5t" + s + m };
    } else {
      var V = ekE([
        ["Mi a " + ekKi("LEHETŐ LEGNAGYOBB") + " kétjegyű szám, amelynek a számjegyei " + ekKi("KÜLÖNBÖZŐK") + "?", 98, [[99, "A 99 két jegye egyforma!", "egyforma"]]],
        ["Mi a " + ekKi("LEHETŐ LEGNAGYOBB") + " kétjegyű " + ekKi("PÁRATLAN") + " szám, amelynek a számjegyei " + ekKi("KÜLÖNBÖZŐK") + "?", 97, [[99, "A 99 két jegye egyforma!", "egyforma"], [98, "A 98 páros!", "kisszo"]]],
      ].concat(k3 ? [] : [
        ["Mi a " + ekKi("LEHETŐ LEGKISEBB") + " háromjegyű szám, amelynek a számjegyei " + ekKi("KÜLÖNBÖZŐK") + "?", 102, [[100, "A 100-ban két 0 van — azok egyformák!", "egyforma"], [101, "A 101-ben két 1-es van!", "egyforma"], [123, "Van ennél kisebb is — a 0 is lehet számjegy, csak elöl nem!", "egyeb"]]],
        ["Mi a " + ekKi("LEHETŐ LEGNAGYOBB") + " háromjegyű szám, amelynek a számjegyei " + ekKi("KÜLÖNBÖZŐK") + "?", 987, [[999, "A 999 jegyei egyformák!", "egyforma"], [998, "A 998-ban két 9-es van!", "egyforma"]]]
      ]));
      o = { kep: "", tort: [], kerdes: V[0], helyes: V[1], arany: "KÜLÖNBÖZŐK", megoldas: V[1] + "", csap: V[2], kulcs: "m5sz" + V[1] };
    }
  }
  o.sablon = "mindketto";
  return ekSzob(cfg, o);
}
function ekAeK2(cfg) {
  if (!ekO(cfg)) {
    var L = [], dup = 2 * ekR(0, 4) + 1;
    L.push(dup, dup); while (L.length < 6) L.push(ekR(1, 9));
    L = mKever(L);
    var ptl = L.filter(function (x) { return x % 2; }), kul = ptl.filter(function (x, i) { return ptl.indexOf(x) === i; }).length, osszKul = L.filter(function (x, i) { return L.indexOf(x) === i; }).length;
    return ekAE(cfg, { sablon: "K2", kep: ekSzamsor(L), tort: [], kerdes: "A " + L.join(", ") + " számkártyák közül hány " + ekKi("KÜLÖNBÖZŐ") + " páratlan szám van?", arany: "KÜLÖNBÖZŐ", helyes: kul,
      v: [[ptl.length, ekA(dup, true) + " többször szerepel — a különbözőket kérdeztük!", "egyforma"], [osszKul, "Ezek a különböző számok — de csak a PÁRATLANOK kellenek!", "kisszo"], [6, "A 6 az összes kártya.", "mind"]], kulcs: "ae2" + L.join("") });
  }
  var h = ekR(10, 30), L5 = [h, h];
  while (L5.length < 7) L5.push(ekR(h - 9, h + 25));
  L5 = mKever(L5);
  var nk = L5.filter(function (x) { return x >= h; }), nkk = nk.filter(function (x, i) { return nk.indexOf(x) === i; }).length;
  return ekAE(cfg, { sablon: "K2", kep: ekSzamsor(L5), tort: [], kerdes: "A " + L5.join(", ") + " számok közül hány " + ekKi("NEM KISEBB") + " " + ekRag(h, "nal") + "?", arany: "NEM KISEBB", helyes: nk.length,
    v: [[L5.filter(function (x) { return x > h; }).length, "A " + h + "-esek is számítanak: ők sem kisebbek!", "hatar"], [nkk, "Itt nem a különbözőket kérdeztük — mindegyik szám számít!", "egyforma"], [7, "A 7 az összes szám.", "mind"]], kulcs: "ae25" + L5.join("") });
}

/* ═════════════════ ✋ 3. PÁLYA: EZ MÁR A VÁLASZ? ═════════════════ */
function ekTabla(cfg, spec, i, B) {       /* a ✋ tábla egy lépés után (koppintós láncszem) */
  var l = spec.lep[i], utolso = i === spec.lep.length - 1;
  var K = [
    { h: ekTk("👍", "Igen"), cls: "ek-in igen", jo: utolso, m: utolso ? null : "Még nem! A kérdés: „" + ekSima(spec.fo) + "” — ez még csak " + l.nev + ".", t: "resz" },
    { h: ekTk("✋", "Nem"), cls: "ek-in nem", jo: true, nemElsore: utolso, utan: utolso ? "Pedig ez már az! Épp ezt kérdezték. Felértél a lépcső tetejére!" : "Így van! Mit kell még kiszámolni?" }
  ];
  if (!utolso) K[1].nemElsore = false;
  if (utolso) K[0].utan = "Igen! Felértél a lépcső tetejére!";
  return ekKopp(cfg, { sablon: "lepcso", kep: B.kep, tort: B.tort, kerdes: spec.fo, arany: spec.arany, joKiir: utolso ? "Igen" : "Nem", felolvas: "Ez már a válasz?",
    kopp: { tipus: "valaszt", kartyak: K, elo: '<div class="ek-tabla"><span class="ek-kez">✋</span>' + ekA(l.v, true) + ' — ez már a válasz?</div>' } });
}
function ekLepcsoSpec(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), A = S[0], B = S[1], T = ekR(0, g < 5 ? 3 : 2);
  if (g < 5 && T === 0) { var K2 = ekE(EK_KET_LAB), K4 = ekE(EK_NEGY_LAB), t = ekR(2, 9), k = ekR(2, 8);
    return { kep: ekErem(K2.e, t, K2.n) + ekErem(K4.e, k, K4.n), tort: ["Az udvaron " + t + " " + K2.n + " és " + k + " " + K4.n + " van."], fo: "Hány láb van " + ekKi("összesen") + "?", arany: "összesen",
      lep: [{ k: "Hány lába van a " + K2.nak + "?", v: 2 * t, nev: "a " + K2.k + " lába", m: t + " · 2 = " + 2 * t }, { k: "És a " + K4.nak + "?", v: 4 * k, nev: "a " + K4.k + " lába", m: k + " · 4 = " + 4 * k }, { k: "Mennyi összesen?", v: 2 * t + 4 * k, m: 2 * t + " + " + 4 * k + " = " + (2 * t + 4 * k) }], kulcs: "sl" + t + k }; }
  if (g < 5 && T === 1) { var a = ekR(10, 45), kk = ekR(2, 9);
    return { kep: ekErem(A.e, a, A.n) + ekErem(B.e, "?", B.n), tort: [A.tel + " " + a + " diót gyűjtött, " + B.tel + " " + ekRag(kk, "val") + " kevesebbet."], fo: "Hány diót gyűjtöttek " + ekKi("együtt") + "?", arany: "együtt",
      lep: [{ k: "Hány diót gyűjtött " + B.n + "?", v: a - kk, nev: B.n + " diói", m: a + " − " + kk + " = " + (a - kk) }, { k: "És együtt?", v: 2 * a - kk, m: a + " + " + (a - kk) + " = " + (2 * a - kk) }], kulcs: "sd" + a + kk }; }
  if (g < 5 && T === 2) { var d = ekR(2, 5), c = ekR(3, 9), e = ekR(2, d * c - 2);
    if (d * c > 60) return null;
    return { kep: ekErem("📦", d, "doboz") + ekErem("✏️", c, "egy dobozban"), tort: [d + " dobozban " + c + "-" + c + " ceruza van.", A.tel + " elvitt " + ekRag(e, "t") + "."], fo: "Hány ceruza " + ekKi("maradt") + "?", arany: "maradt",
      lep: [{ k: "Hány ceruza volt a dobozokban?", v: d * c, nev: "az összes ceruza", m: d + " · " + c + " = " + d * c }, { k: "Mennyi maradt?", v: d * c - e, m: d * c + " − " + e + " = " + (d * c - e) }], kulcs: "sc" + d + c + e }; }
  if (g < 5) { var n = ekR(2, 5), ar = ekR(2, 8), p = n * ar + ekR(2, 20);
    if (p > 50) return null;
    return { kep: ekErem(A.e, p + " Ft", A.n) + ekErem("🥐", ar + " Ft", "1 kifli"), tort: [A.tel + " " + p + " Ft-tal ment a boltba, és " + n + " kiflit vett, darabját " + ar + " Ft-ért."], fo: "Mennyi pénze " + ekKi("maradt") + "?", arany: "maradt",
      lep: [{ k: "Mennyibe került a " + n + " kifli?", v: n * ar, nev: "a kiflik ára", m: n + " · " + ar + " = " + n * ar }, { k: "Mennyi maradt?", v: p - n * ar, m: p + " − " + n * ar + " = " + (p - n * ar) }], kulcs: "sk" + n + ar + p }; }
  if (T === 0) { var f = k3 ? ekR(2, 3) : ekR(3, 5), nap = ekR(5, 10), o = nap * ekR(2, Math.floor((k3 ? 30 : 40) / nap)), olv = ekR(1, 4) * nap, x = f * o - olv;
    if (x <= 0 || x % nap || f * o > ekMax(cfg)) return null;
    return { kep: ekErem("📖", f, "fejezet") + ekErem(A.e, olv, "már elolvasott"), tort: ["Egy könyv " + f + " fejezetből áll, mindegyik " + o + " oldalas.", A.tel + " már " + olv + " oldalt elolvasott, és naponta " + nap + " oldalt olvas."],
      fo: "Hány nap alatt végez a " + ekKi("többivel") + "?", arany: "többivel",
      lep: [{ k: "Hány oldalas a könyv?", v: f * o, nev: "az egész könyv oldalszáma", m: f + " · " + o + " = " + f * o }, { k: "Hány oldal van még hátra?", v: x, nev: "a hátralévő oldalak száma", m: f * o + " − " + olv + " = " + x }, { k: "Hány nap alatt olvassa el?", v: x / nap, m: x + " : " + nap + " = " + x / nap }], kulcs: "s5k" + f + o + olv + nap }; }
  if (T === 1) { var cs = k3 ? ekR(2, 5) : ekR(3, 8), gy = ekE(k3 ? [10, 12, 15, 20] : [20, 25, 30, 40, 50]), l = ekR(2, k3 ? 4 : 5), m = ekE(k3 ? [5, 8, 10, 12, 15] : [20, 30, 40, 50, 60]), mar = cs * gy - l * m;
    if (mar <= 0 || cs * gy > ekMax(cfg)) return null;
    return { kep: ekErem("📿", cs, "csomag") + ekErem("💎", l, "nyaklánc"), tort: [A.tel + " " + cs + " csomag gyöngyöt vett, csomagonként " + ekRag(gy, "t") + ".", l + " nyakláncot fűz, mindegyikre " + m + " gyöngyöt."], fo: "Hány gyöngy " + ekKi("marad") + "?", arany: "marad",
      lep: [{ k: "Hány gyöngyöt vett?", v: cs * gy, nev: "az összes gyöngy", m: cs + " · " + gy + " = " + cs * gy }, { k: "Hányat fűz fel?", v: l * m, nev: "a felfűzött gyöngyök száma", m: l + " · " + m + " = " + l * m }, { k: "Hány marad?", v: mar, m: cs * gy + " − " + l * m + " = " + mar }], kulcs: "s5g" + cs + gy + l + m }; }
  var ko = 2 * (k3 ? ekR(10, 50) : ekR(20, 150)), e5 = ekR(k3 ? 2 : 5, ko / 2 - (k3 ? 2 : 5));
  return { kep: ekErem("🧺", ko, "alma"), tort: ["Egy kosárban " + ko + " alma van.", A.tel + " a felét elvitte, " + B.tel + " a maradékból " + ekRag(e5, "t") + "."], fo: "Hány alma " + ekKi("maradt") + " a kosárban?", arany: "maradt",
    lep: [{ k: "Hány alma maradt " + A.n + " után?", v: ko / 2, nev: "ami " + A.n + " után maradt", m: ko + " : 2 = " + ko / 2 }, { k: "És " + B.n + " után?", v: ko / 2 - e5, m: ko / 2 + " − " + e5 + " = " + (ko / 2 - e5) }], kulcs: "s5a" + ko + e5 };
}
function ekLepcso(cfg) {
  var sp = ekLepcsoSpec(cfg); if (!sp) return null;
  var B = { kep: sp.kep, tort: sp.tort.concat(['<span class="ek-fokerdes">A kérdés: ' + sp.fo + '</span>']) }, n = sp.lep.length, lanc = [];
  var lepK = function (i) { return (i === n - 1 ? "A csúcs: " : (i + 1) + ". lépcsőfok: ") + sp.lep[i].k; };
  for (var i = 0; i < n; i++) {
    if (i > 0) {
      var csap = [];
      if (i === n - 1) sp.lep.slice(0, -1).forEach(function (l) { csap.push([l.v, "Ez csak egy lépcsőfok: " + l.nev + ". " + ekSima(sp.fo), "resz"]); });
      lanc.push({ kerdes: lepK(i), helyes: sp.lep[i].v, megoldas: sp.lep[i].m, csap: csap, elo: " " });
    }
    lanc.push({ tabla: i });
  }
  /* a láncszemek: szóbeli lépések + ✋ táblák (koppintós) */
  var root = ekSzob(cfg, { sablon: "lepcso", kep: B.kep, tort: B.tort, kerdes: lepK(0), helyes: sp.lep[0].v, megoldas: sp.lep[0].m, kulcs: sp.kulcs, arany: sp.arany,
    lanc: lanc.map(function (x) { return x.tabla != null ? { kopp: ekTabla(cfg, sp, x.tabla, B) } : x; }) });
  if (root) root.felolvas = ekKiejt(sp.tort.join(" ") + " A kérdés: " + ekSima(sp.fo) + " Lépésről lépésre! " + ekSima(lepK(0)));
  return root;
}
function ekKinekSpec(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), A = S[0], T = ekR(0, g < 5 ? 3 : 2);
  if (g < 5 && T === 0) { var o = ekR(20, 60), m = ekR(5, 15); if (o - 2 * m <= 0) return null;
    return { kep: ekErem("📚", o, "könyv") + ekErem("📘", m, "mesekönyv"), tort: ["A polcon " + o + " könyv van: " + m + " mesekönyv, a többi verseskötet."], fo: "Mennyivel " + ekKi("több") + " a verseskötet, mint a mesekönyv?", arany: "több",
      jo: o - 2 * m, megoldas: o + " − " + m + " = " + (o - m) + ", " + (o - m) + " − " + m + " = " + (o - 2 * m), cs: [{ v: o - m, nev: "a verseskötetek száma" }, { v: o + m, nev: "az összeadás eredménye — de itt el kell venni" }], kulcs: "kv" + o + m }; }
  if (g < 5 && T === 1) { var z = ekR(2, 5), c = ekR(4, 10), e = ekR(2, 9); if (e >= z * c) return null;
    return { kep: ekErem("🍬", z, "zacskó") + ekErem("🍭", c, "szem / zacskó"), tort: [A.tel + " " + z + " zacskó cukrot vett, mindegyikben " + c + " szem.", ekNagy(ekRag(e, "t")) + " megevett."], fo: "Hány szem " + ekKi("maradt") + "?", arany: "maradt",
      jo: z * c - e, megoldas: z + " · " + c + " = " + z * c + ", " + z * c + " − " + e + " = " + (z * c - e), cs: [{ v: z * c, nev: "a megevés előtti szám" }, { v: z + c - e > 0 ? z + c - e : z * c + e, nev: z + c - e > 0 ? "rossz számolás: összeadta a zacskót és a szemeket" : "a megevett szemeket hozzáadta" }], kulcs: "kc" + z + c + e }; }
  if (g < 5 && T === 2) { var a = ekR(2, 8), s = ekR(2, 8); if (a === s) return null;
    return { kep: ekErem("🪑", s, "szék") + ekErem("🟫", a, "asztal"), tort: [a + " asztalnak és " + s + " széknek is 4-4 lába van."], fo: "Hány láb van " + ekKi("összesen") + "?", arany: "összesen",
      jo: 4 * (a + s), megoldas: "(" + a + " + " + s + ") · 4 = " + 4 * (a + s), cs: [{ v: 4 * a, nev: "csak az asztalok lába" }, { v: 4 * s, nev: "csak a székek lába" }], kulcs: "ka" + a + s }; }
  if (g < 5) { var h = ekR(1, 3), d = ekR(1, 6);
    return { kep: ekErem(A.e, h + " hét " + d + " nap", A.n), tort: [A.tel + " " + h + " hét és " + d + " nap alatt olvasott ki egy könyvet."], fo: "Hány " + ekKi("napig") + " olvasta?", arany: "napig",
      jo: 7 * h + d, megoldas: h + " · 7 + " + d + " = " + (7 * h + d), cs: [{ v: h + d, nev: "a heteket napnak számolta" }, { v: 7 * h, nev: "a " + d + " napot kihagyta" }], kulcs: "kh" + h + d }; }
  if (T === 0) { var ol = 6 * (k3 ? ekR(3, 16) : ekR(10, 60)), r = ekR(0, 1) ? 3 : 2, fel = ol / 2, m2 = fel / r;
    return { kep: ekErem("📖", ol, "oldal"), tort: ["Egy " + ol + " oldalas könyvnek " + A.tel + " először a felét olvasta el, másnap a maradék " + (r === 3 ? "harmadát" : "felét") + "."], fo: "Hány oldal van még " + ekKi("hátra") + "?", arany: "hátra",
      jo: fel - m2, megoldas: ol + " : 2 = " + fel + ", " + fel + " : " + r + " = " + m2 + ", " + fel + " − " + m2 + " = " + (fel - m2), cs: [{ v: fel, nev: "az első nap után maradt oldalak" }, { v: m2, nev: "a második nap elolvasott oldalak" }], kulcs: "k5o" + ol + r }; }
  if (T === 1) { var n = ekR(k3 ? 2 : 3, k3 ? 4 : 6), ar = ekE(k3 ? [10, 15, 20, 25] : [75, 100, 125, 150]), k = ekE(k3 ? [5, 10, 15, 20] : [50, 100, 150, 200]); if (n * ar - k <= 0 || n * ar > ekMax(cfg)) return null;
    return { kep: ekErem("🍯", n, "üveg méz") + ekErem("🪙", ar + " Ft", "üvegenként"), tort: [A.tel + " " + n + " üveg mézet adott el, üvegenként " + ar + " Ft-ért, aztán " + k + " Ft-ot elköltött."], fo: "Mennyi pénze " + ekKi("maradt") + "?", arany: "maradt",
      jo: n * ar - k, megoldas: n + " · " + ar + " = " + n * ar + ", " + n * ar + " − " + k + " = " + (n * ar - k), cs: [{ v: n * ar, nev: "a költés előtti pénz" }, { v: n * ar + k, nev: "a költést hozzáadta" }], kulcs: "k5m" + n + ar + k }; }
  var so = k3 ? ekR(3, 8) : ekR(4, 9), db = k3 ? ekR(4, 10) : ekR(5, 12), e1 = ekR(3, 12), e2 = ekR(3, 12), B = S[1]; if (so * db - e1 - e2 <= 0 || so * db > ekMax(cfg) || e1 === e2) return null;
  return { kep: ekErem("🍫", so, "sor") + ekErem("🍬", db, "egy sorban"), tort: ["Egy dobozban " + so + " sor, soronként " + db + " bonbon van.", A.tel + " megevett " + ekRag(e1, "t") + ", " + B.tel + " " + ekRag(e2, "t") + "."], fo: "Hány bonbon " + ekKi("maradt") + "?", arany: "maradt",
    jo: so * db - e1 - e2, megoldas: so + " · " + db + " = " + so * db + ", " + so * db + " − " + e1 + " − " + e2 + " = " + (so * db - e1 - e2), cs: [{ v: so * db, nev: "az összes bonbon evés előtt" }, { v: so * db - e1, nev: "ami " + A.n + " után maradt" }], kulcs: "k5b" + so + db + e1 + e2 };
}
function ekKinek(cfg) {
  var sp = ekKinekSpec(cfg); if (!sp || sp.cs[0].v === sp.cs[1].v || sp.cs[0].v === sp.jo || sp.cs[1].v === sp.jo) return null;
  var mod = ekR(0, 3) === 0 ? 2 : ekR(0, 1), NEV = ["Pali", "Juli"], EM = ["🐰", "🦊"], mond = [], csap = [];
  if (mod === 2) { mond = mKever([sp.cs[0], sp.cs[1]]); }
  else { mond[mod] = { v: sp.jo }; mond[1 - mod] = ekE(sp.cs); }
  var K = [0, 1].map(function (i) {
    var x = mond[i], jo = mod === i;
    return { h: ekTk(EM[i], NEV[i], null, '<span class="mond">' + x.v + '</span>'), cls: "ek-fig", jo: jo,
      m: jo ? null : NEV[i] + " " + ekRag(x.v, "t") + " mondott. " + ekA(x.v, true) + ": " + x.nev + ". Ezt kérdezték?", t: "resz",
      utan: jo ? NEV[1 - i] + " tévedett: " + ekA(mond[1 - i].v) + " " + mond[1 - i].nev + "." : null };
  });
  K.push({ h: ekTk("🤷", "Senkinek", "és megmondom a jót"), jo: mod === 2, m: mod === 2 ? null : "Nézd meg újra — valamelyikük jól számolt!", t: "egyeb" });
  sp.cs.forEach(function (c) { csap.push([c.v, ekA(c.v, true) + ": " + c.nev + ". De mit kérdeztek?", "resz"]); });
  var lanc = null;
  if (mod === 2) {
    var sz = ekSzob(cfg, { sablon: "kinek", kep: sp.kep, tort: sp.tort, kerdes: "Senkinek sincs igaza! Mennyi a jó válasz? " + sp.fo, helyes: sp.jo, arany: sp.arany, megoldas: sp.megoldas, csap: csap, olvas: false, elo: "Így van, mindketten tévedtek! ", villan: true });
    if (!sz) return null;
    lanc = [sz];
  }
  return ekKopp(cfg, { sablon: "kinek", kep: sp.kep, tort: sp.tort, kerdes: sp.fo + '<span class="kis">Kinek van igaza?</span>', arany: sp.arany, felolvasK: ekSima(sp.fo),
    joKiir: mod === 2 ? "Senkinek" : NEV[mod], kopp: { tipus: "valaszt", kartyak: K }, lanc: lanc, kulcs: sp.kulcs + mod });
}
function ekFelut(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(1), A = S[0], T = ekR(0, g < 5 ? 3 : 2), o;
  var fm = function (nev) { return "Ez csak félút — ez " + nev + ". De mit kérdeztek?"; };
  if (g < 5 && T === 0) { var h = ekR(20, 60), n = ekR(2, 3), d = ekR(3, 9); if (h - n * d <= 0) return null;
    o = { kep: ekErem("🎀", h + " cm", "szalag") + ekErem("✂️", n + " × " + d + " cm", "levágva"), tort: ["Egy szalag " + h + " cm hosszú. Levágtak belőle " + n + " darab " + d + " cm-es darabot."], kerdes: "Hány cm " + ekKi("maradt") + "?", helyes: h - n * d, arany: "maradt",
      megoldas: n + " · " + d + " = " + n * d + ", " + h + " − " + n * d + " = " + (h - n * d), csap: [[n * d, fm("a levágott darabok hossza"), "resz"], [h - d, n + " darabot vágtak le, nem egyet!", "egyeb"]],
      vezet: { mit: ["mennyi maradt", "mennyit vágtak le", "milyen hosszú volt"], lepesek: [["Hány cm-t vágtak le összesen?", n * d, n + " · " + d + " = " + n * d]] }, kulcs: "fs" + h + n + d };
  } else if (g < 5 && T === 1) { var k = ekR(4, 9), kn = ekR(2, 5), e = ekR(2, 9); if (k * kn > 60) return null;
    o = { kep: ekErem("🧺", kn, "kosár") + ekErem("🍎", k, "egy kosárban"), tort: ["Egy kosárba " + k + " alma fér. " + kn + " teli kosárból " + e + " almát megettünk."], kerdes: "Hány alma " + ekKi("maradt") + "?", helyes: k * kn - e, arany: "maradt",
      megoldas: kn + " · " + k + " = " + k * kn + ", " + k * kn + " − " + e + " = " + (k * kn - e), csap: [[k * kn, fm("az összes alma az evés előtt"), "resz"], [k - e > 0 ? k - e : null, "Nem egy kosárból, hanem " + kn + " kosárból ettünk!", "egyeb"]],
      vezet: { mit: ["a megmaradt almákat", "az összes almát", "a megevett almákat"], lepesek: [["Hány alma volt a " + kn + " kosárban?", k * kn, kn + " · " + k + " = " + k * kn]] }, kulcs: "fk" + k + kn + e };
  } else if (g < 5 && T === 2) { var a = ekR(2, 4), b = ekR(2, 5), nn = ekR(2, 3);
    o = { kep: ekErem("🫖", 1, "nagy kanna") + ekErem("🥤", b, "pohár / kis kanna"), tort: ["1 nagy kanna = " + a + " kis kanna.", "1 kis kanna = " + b + " pohár víz."], kerdes: "Hány pohár víz fér " + ekKi(nn + " nagy") + " kannába?", helyes: nn * a * b, arany: nn + " nagy",
      megoldas: a + " · " + b + " = " + a * b + ", " + a * b + " · " + nn + " = " + nn * a * b, csap: [[a * b, fm("ennyi fér EGY nagy kannába"), "resz"], [nn * a, fm("a kis kannák száma"), "resz"]],
      vezet: { mit: ["hány pohár fér " + nn + " nagy kannába", "hány pohár fér egy nagy kannába", "hány kis kanna van"], lepesek: [["Hány pohár fér EGY nagy kannába?", a * b, a + " · " + b + " = " + a * b]] }, kulcs: "fn" + a + b + nn };
  } else if (g < 5) { var ev = ekR(4, 9), k2 = ekR(2, 6);
    o = { kep: ekErem(A.e, ev, A.n) + ekErem("👧", "?", "nővére"), tort: [A.tel + " " + ev + " éves, a nővére " + k2 + " évvel idősebb."], kerdes: "Hány évesek " + ekKi("együtt") + "?", helyes: 2 * ev + k2, arany: "együtt",
      megoldas: ev + " + " + k2 + " = " + (ev + k2) + ", " + ev + " + " + (ev + k2) + " = " + (2 * ev + k2), csap: [[ev + k2, fm("ennyi idős a nővére"), "resz"]],
      vezet: { mit: ["kettejük életkorát együtt", "a nővére életkorát", A.n + " életkorát"], lepesek: [["Hány éves a nővére?", ev + k2, ev + " + " + k2 + " = " + (ev + k2)]] }, kulcs: "fe" + ev + k2 };
  } else if (T === 0) { var ol = 3 * (k3 ? ekR(8, 30) : ekR(8, 40)), e5 = ekR(3, 15), har = ol / 3; if (ol - har - e5 <= 0) return null;
    o = { kep: ekErem("📓", ol, "oldal"), tort: ["Egy " + ol + " oldalas füzetnek " + A.tel + " a harmadát teleírta, aztán még " + e5 + " oldalt."], kerdes: "Hány oldal maradt " + ekKi("üresen") + "?", helyes: ol - har - e5, arany: "üresen",
      megoldas: ol + " : 3 = " + har + ", " + har + " + " + e5 + " = " + (har + e5) + ", " + ol + " − " + (har + e5) + " = " + (ol - har - e5),
      csap: [[har, "Ez csak az első rész.", "resz"], [har + e5, fm("ennyit írt tele"), "resz"], [ol - har, "Az " + e5 + " oldalt is teleírta!", "egyeb"]],
      vezet: { mit: ["az üres oldalakat", "a teleírt oldalakat", "az összes oldalt"], lepesek: [["Mennyi a " + ol + " harmada?", har, ol + " : 3 = " + har], ["Hány oldalt írt tele összesen?", har + e5, har + " + " + e5 + " = " + (har + e5)]] }, kulcs: "f5f" + ol + e5 };
  } else if (T === 1) { var q = ekE([2, 3, 4]), r = q * (k3 ? ekR(5, 25) : ekR(10, 80)), d2 = k3 ? ekR(3, 20) : ekR(10, 90), res = r - r / q - d2; if (res <= 0 || r > ekMax(cfg)) return null;
    var tn = { 2: "felük", 3: "harmaduk", 4: "negyedük" }[q];
    o = { kep: ekErem("🥐", r, "kifli reggel"), tort: ["A pékségben reggel " + r + " kiflit sütöttek.", "Délelőtt a " + tn + " elfogyott, délután még " + d2 + "."], kerdes: "Hány kifli maradt " + ekKi("estére") + "?", helyes: res, arany: "estére",
      megoldas: r + " : " + q + " = " + r / q + ", " + r + " − " + r / q + " = " + (r - r / q) + ", " + (r - r / q) + " − " + d2 + " = " + res,
      csap: [[r / q, "Ez a délelőtt eladott kiflik száma.", "resz"], [r - r / q, fm("ennyi maradt délre"), "resz"], [r / q + d2, "Ez az összes eladott kifli.", "resz"]],
      vezet: { mit: ["ami estére maradt", "ami délre maradt", "amit eladtak"], lepesek: [["Hány kifli fogyott el délelőtt?", r / q, r + " : " + q + " = " + r / q], ["Hány maradt délre?", r - r / q, r + " − " + r / q + " = " + (r - r / q)]] }, kulcs: "f5k" + r + q + d2 };
  } else { var a5 = k3 ? ekR(2, 3) : ekR(3, 5), b5 = k3 ? ekR(2, 4) : ekR(4, 8), c5 = k3 ? ekR(2, 5) : ekR(5, 20), n5 = ekR(2, k3 ? 3 : 4); if (n5 * a5 * b5 * c5 > ekMax(cfg)) return null;
    o = { kep: ekErem("🛢️", 1, "hordó") + ekErem("🪣", a5, "vödör / hordó"), tort: ["1 hordó = " + a5 + " vödör, 1 vödör = " + b5 + " kanna, 1 kanna = " + c5 + " pohár."], kerdes: "Hány pohár fér " + ekKi(n5 + " hordóba") + "?", helyes: n5 * a5 * b5 * c5, arany: n5 + " hordóba",
      megoldas: a5 + " · " + b5 + " = " + a5 * b5 + " kanna, " + a5 * b5 + " · " + c5 + " = " + a5 * b5 * c5 + " pohár, · " + n5 + " = " + n5 * a5 * b5 * c5,
      csap: [[a5 * b5 * c5, fm("ennyi fér EGY hordóba"), "resz"], [a5 * b5, fm("egy hordó kannáinak száma"), "resz"], [n5 * a5 * b5, fm("a kannák száma"), "resz"]],
      vezet: { mit: ["hány pohár fér " + n5 + " hordóba", "hány pohár fér egy hordóba", "hány kanna fér egy hordóba"], lepesek: [["Hány kanna fér egy hordóba?", a5 * b5, a5 + " · " + b5 + " = " + a5 * b5], ["Hány pohár fér egy hordóba?", a5 * b5 * c5, a5 * b5 + " · " + c5 + " = " + a5 * b5 * c5]] }, kulcs: "f5h" + a5 + b5 + c5 + n5 };
  }
  o.sablon = "felut";
  return ekSzob(cfg, o);
}
function ekLepcsoSvg(n) {
  var s = '<svg viewBox="0 0 70 46" class="ek-lk">';
  for (var i = 0; i < n; i++) s += '<rect x="' + (6 + i * 20) + '" y="' + (40 - (i + 1) * 12) + '" width="' + (58 - i * 20) + '" height="12" rx="2" fill="' + ["#a7d99a", "#8cc585", "#6fb36a"][i] + '"/>';
  return s + '<path d="M' + (10 + n * 20) + ' ' + (36 - n * 12) + ' v-10 l8 3 l-8 3" stroke="#6b5442" stroke-width="1.5" fill="#e2589b"/></svg>';
}
function ekHanyPar(cfg) {       /* egy pár: 1 lépéses + hasonló, de több lépéses feladat */
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), A = S[0], B = S[1], T = ekR(0, 1);
  if (g < 5 && T === 0) { var a = ekR(5, 30), b = ekR(3, 30), k = ekR(2, 9); if (2 * a + k > 100) return null;
    return [{ kep: ekErem(A.e, a, A.n) + ekErem(B.e, b, B.n), tort: [A.tel + " " + a + " diót gyűjtött, " + B.tel + " " + ekRag(b, "t") + "."], fo: "Hány diót gyűjtöttek együtt?", lepes: 1, v: a + b, megoldas: a + " + " + b + " = " + (a + b), lep: ["Add össze kettejük dióit!"], csap: [] },
            { kep: ekErem(A.e, a, A.n) + ekErem(B.e, "?", B.n), tort: [A.tel + " " + a + " diót gyűjtött, " + B.tel + " " + ekRag(k, "val") + " többet, mint " + A.n + "."], fo: "Hány diót gyűjtöttek együtt?", lepes: 2, v: 2 * a + k, megoldas: a + " + " + k + " = " + (a + k) + ", " + a + " + " + (a + k) + " = " + (2 * a + k), lep: ["Hány diót gyűjtött " + B.n + "?", "Mennyi kettejüké együtt?"], csap: [[a + k, "Ez csak félút — ennyi " + B.n + " diója. De mit kérdeztek?", "resz"]] }]; }
  if (g < 5) { var gy = ekR(2, 6), p = ekR(2, 8), al = ekR(2, 9); if (gy * p + al > 100) return null;
    return [{ kep: ekErem("🪑", p, "pad") + ekErem("🐾", gy, "egy padon"), tort: ["Egy padon " + gy + " kis állat ül."], fo: "Hányan ülnek " + p + " ilyen padon?", lepes: 1, v: gy * p, megoldas: gy + " · " + p + " = " + gy * p, lep: ["Szorozd meg: padonként " + gy + ", " + p + " pad."], csap: [] },
            { kep: ekErem("🪑", p, "pad") + ekErem("🧍", al, "áll"), tort: [p + " padon " + gy + "-" + gy + " kis állat ül, és " + al + " még áll."], fo: "Hányan vannak ott összesen?", lepes: 2, v: gy * p + al, megoldas: gy + " · " + p + " = " + gy * p + ", " + gy * p + " + " + al + " = " + (gy * p + al), lep: ["Hányan ülnek a padokon?", "Mennyi az állókkal együtt?"], csap: [[gy * p, "Ez csak félút — ennyien ülnek. De az állók is ott vannak!", "resz"]] }]; }
  if (T === 0) { var ar = ekE(k3 ? [20, 25, 30, 40, 50] : [150, 200, 250, 300, 400]), kd = ekE(k3 ? [5, 10, 15] : [20, 30, 40, 50]), n = ekR(2, 3);
    if ((ar - kd) * n > ekMax(cfg)) return null;
    return [{ kep: ekErem("📕", ar + " Ft", "könyv") + ekErem("🏷️", kd + " Ft", "kedvezmény"), tort: ["Egy " + ar + " Ft-os könyvre " + kd + " Ft kedvezményt kaptunk."], fo: "Mennyit fizettünk?", lepes: 1, v: ar - kd, megoldas: ar + " − " + kd + " = " + (ar - kd), lep: ["Vedd el a kedvezményt!"], csap: [] },
            { kep: ekErem("📕", ar + " Ft", "könyv") + ekErem("🏷️", kd + " Ft", "kedvezmény / könyv"), tort: ["Egy " + ar + " Ft-os könyvre " + kd + " Ft kedvezményt kaptunk."], fo: "Mennyit fizettünk " + n + " ilyen könyvért?", lepes: 2, v: (ar - kd) * n, megoldas: ar + " − " + kd + " = " + (ar - kd) + ", " + (ar - kd) + " · " + n + " = " + (ar - kd) * n, lep: ["Mennyibe került EGY könyv?", "Mennyi " + n + " könyvért?"], csap: [[ar - kd, "Ez csak félút — ennyi EGY könyv ára.", "resz"]] }]; }
  var gn = ekE(k3 ? [5, 6, 8, 10, 12] : [15, 20, 25, 30]), nn = ekR(2, k3 ? 3 : 4), sz = ekR(2, 3);
  return [{ kep: ekErem("📿", gn, "naponta"), tort: [A.tel + " " + nn + " napon át naponta " + gn + " gyöngyöt fűzött."], fo: "Hányat fűzött összesen?", lepes: 1, v: nn * gn, megoldas: nn + " · " + gn + " = " + nn * gn, lep: ["Szorozd meg!"], csap: [] },
          { kep: ekErem("📿", gn, "naponta"), tort: [A.tel + " " + nn + " napon át naponta " + gn + " gyöngyöt fűzött, a következő napon " + (sz === 2 ? "kétszer" : "háromszor") + " annyit, mint egy napon addig."], fo: "Hányat fűzött összesen?", lepes: 3, v: nn * gn + sz * gn,
            megoldas: nn + " · " + gn + " = " + nn * gn + ", " + gn + " · " + sz + " = " + sz * gn + ", " + nn * gn + " + " + sz * gn + " = " + (nn * gn + sz * gn), lep: ["Hányat fűzött az első " + nn + " napon?", "Hányat az utolsó napon?", "Mennyi összesen?"], csap: [[nn * gn, "Ez csak az első " + nn + " nap.", "resz"], [sz * gn, "Ez csak az utolsó nap.", "resz"]] }];
}
function ekHanylepes(cfg) {
  var par;
  if (J.feladatKesz % 2 === 0 || !J.ekPar) { par = ekHanyPar(cfg); if (!par) return null; if (ekR(0, 1)) par.reverse(); J.ekPar = par[1]; par = par[0]; }
  else { par = J.ekPar; J.ekPar = null; }
  var lepesSor = '<small>' + par.lep.map(function (l, i) { return (i + 1) + ". " + l; }).join(" · ") + '</small>';
  var K = [1, 2, 3].map(function (n) {
    return { h: '<span class="lkt">' + ekLepcsoSvg(n) + '</span><span class="cimke">' + n + ' lépés</span>', jo: n === par.lepes,
      m: n === par.lepes ? null : "Nézzük meg együtt: mit kell tudnunk, mielőtt a kérdezett számot megkapjuk?" + lepesSor, t: "egyeb" };
  });
  var sz = ekSzob(cfg, { sablon: "hanylepes", kep: par.kep, tort: par.tort, kerdes: par.fo, helyes: par.v, megoldas: par.megoldas, csap: par.csap, olvas: false, elo: "Ügyes! Most oldd meg!", villan: true });
  if (!sz) return null;
  return ekKopp(cfg, { sablon: "hanylepes", kep: par.kep, tort: par.tort, kerdes: par.fo + '<span class="kis">Hány lépés kell? Előbb csak ezt döntsd el!</span>', felolvasK: par.fo, joKiir: par.lepes + " lépés",
    kopp: { tipus: "valaszt", kartyak: K }, lanc: [sz], kulcs: "hl" + par.megoldas });
}
function ekSzakaszKep(alap, m, n, cimk, egys) {      /* szakaszos kép: alap, m-szeres, n-szeres oszlop; a különbség „?” */
  var H = 150, u = H / n, x = [40, 120, 200], h = [u, m * u, n * u], sz = ["#c9a8e6", "#9ec9f0", "#a7d99a"];
  var s = '<svg viewBox="0 0 300 190" class="ek-szakasz">';
  for (var i = 0; i < 3; i++) {
    s += '<rect x="' + x[i] + '" y="' + (170 - h[i]) + '" width="44" height="' + h[i] + '" rx="4" fill="' + sz[i] + '" stroke="#6a5a9a" stroke-width="1.5"/>';
    for (var k = 1; k < [1, m, n][i]; k++) s += '<path d="M' + x[i] + ' ' + (170 - k * u) + ' h44" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>';
    s += '<text x="' + (x[i] + 22) + '" y="186" font-size="12" text-anchor="middle" fill="#4a3b7a" font-weight="700">' + cimk[i] + '</text>';
  }
  s += '<text x="' + (x[0] + 22) + '" y="' + (164 - u) + '" font-size="12" text-anchor="middle" fill="#4a3b7a" font-weight="800">' + alap + (egys ? " " + egys : "") + '</text>';
  s += '<path d="M' + (x[2] + 50) + ' ' + (170 - n * u) + ' h10 v' + ((n - m) * u) + ' h-10" stroke="#e2589b" stroke-width="2.5" fill="none"/><path d="M' + (x[1] + 44) + ' ' + (170 - m * u) + ' H' + (x[2]) + '" stroke="#e2589b" stroke-width="1.5" stroke-dasharray="4 3"/>';
  s += '<text x="' + (x[2] + 66) + '" y="' + (174 - (n + m) / 2 * u) + '" font-size="18" fill="#e2589b" font-weight="800">?</text>';
  return s + '</svg>';
}
function ekKakas(cfg) {
  var g = ekO(cfg) ? 5 : 3, k3 = ekKis(cfg), S = ekSzereplok(2), T = ekR(0, g < 5 ? 2 : 1), m = ekR(2, 4), n = m + ekR(1, 3), o, a, P;
  if (g < 5) {
    if (T === 0) { a = ekE([10, 20, 30]); P = { cimk: ["bokor", "kerítés", "fa"], egys: "cm", tort: ["A bokor " + a + " cm magas.", "A kerítés " + ekRag(m, "szor") + " olyan magas, mint a bokor, a fa " + ekRag(n, "szor") + " olyan magas."], kerd: "Mennyivel " + ekKi("magasabb") + " a fa a kerítésnél?", ar: "magasabb", mnev: "a kerítés magassága", nnev: "a fa magassága" }; }
    else if (T === 1) { a = ekR(2, 6); P = { cimk: ["zsiráf", "fa", "torony"], egys: "m", tort: ["A zsiráf " + a + " m magas.", "A fa " + ekRag(m, "szor") + ", a torony " + ekRag(n, "szor") + " olyan magas, mint a zsiráf."], kerd: "Mennyivel " + ekKi("magasabb") + " a torony a fánál?", ar: "magasabb", mnev: "a fa magassága", nnev: "a torony magassága" }; }
    else { a = ekR(4, 9); var A = S[0], B = S[1]; P = { cimk: [A.n, B.n, "nagypapa"], egys: "", tort: [A.tel + " " + a + " éves.", B.tel + " " + ekRag(m, "szor") + " annyi idős, a nagypapa " + ekRag(n, "szor") + " annyi."], kerd: "Hány évvel " + ekKi("idősebb") + " a nagypapa " + B.nal + "?", ar: "idősebb", mnev: B.n + " életkora", nnev: "a nagypapa életkora" }; }
    if (n * a > 100) return null;
  } else {
    if (T === 0) { a = k3 ? ekR(4, 15) : ekR(8, 40); P = { cimk: ["csiga", "hangya", "bogár"], egys: "cm", tort: ["Egy csiga " + a + " cm-t mászott.", "A hangya " + ekRag(m, "szor") + ", a bogár " + ekRag(n, "szor") + " ennyit."], kerd: "Mennyivel " + ekKi("többet") + " mászott a bogár, mint a hangya?", ar: "többet", mnev: "ennyit mászott a hangya", nnev: "ennyit mászott a bogár" }; }
    else { var dm = k3 ? 1 : ekR(1, 2), cm = k3 ? ekR(1, 5) : ekR(1, 9); a = dm * 10 + cm; m = k3 ? ekR(2, 3) : ekR(3, 5); n = m + ekR(k3 ? 1 : 2, k3 ? 3 : 4);
      P = { cimk: ["1 fok", "létra", "padlás"], egys: "cm", tort: ["Egy lépcsőfok " + dm + " dm " + cm + " cm magas.", "A létra teteje " + m + " lépcsőfoknyi, a padlás " + n + " lépcsőfoknyi magasan van."], kerd: "Hány cm van a létra teteje és a padlás " + ekKi("között") + "?", ar: "között", mnev: "ilyen magas a létra teteje", nnev: "ilyen magasan van a padlás", dmcm: [dm, cm] }; }
    if (n * a > ekMax(cfg)) return null;
  }
  var cs = [[m * a, "Ez csak félút — " + P.mnev + ".", "resz"], [n * a, "Ez " + P.nnev + ". A kettő közti részt kérdeztük!", "resz"]];
  if (P.dmcm) cs.push([(n - m) * (P.dmcm[0] + P.dmcm[1]), "A " + P.dmcm[0] + " dm " + P.dmcm[1] + " cm az " + a + " cm, nem " + (P.dmcm[0] + P.dmcm[1]) + "!", "egyseg"]);
  o = { sablon: "kakas", kep: ekSzakaszKep(a, m, n, P.cimk, P.egys), tort: P.tort, kerdes: P.kerd, helyes: (n - m) * a, arany: P.ar,
    megoldas: n + " · " + a + " − " + m + " · " + a + " = " + n * a + " − " + m * a + " = " + (n - m) * a, csap: cs,
    vezet: { mit: ["a kettő közti különbséget", P.nnev.replace(/^ez /i, ""), P.mnev.replace(/^ez /i, "")], lepesek: [[ekNagy(P.cimk[1]) + ": " + m + " · " + a + " = ?", m * a, m + " · " + a + " = " + m * a], [ekNagy(P.cimk[2]) + ": " + n + " · " + a + " = ?", n * a, n + " · " + a + " = " + n * a]] }, kulcs: "kk" + T + a + m + n };
  return ekSzob(cfg, o);
}
function ekAeK3(cfg) {
  if (!ekO(cfg)) {
    var s = ekR(3, 6), d = ekR(4, 8), e = ekR(3, 12), S = ekE(EK_SZ);
    if (e >= s * d || s + d === e || s * d + e > 100) return null;
    return ekAE(cfg, { sablon: "K3", kep: ekErem("🍫", s, "sor") + ekErem("🟫", d, "egy sorban"), tort: ["Egy dobozban " + s + " sor csoki van, soronként " + d + ".", S.tel + " megevett " + ekRag(e, "t") + "."], kerdes: "Hány csoki " + ekKi("maradt") + "?", arany: "maradt", helyes: s * d - e,
      v: [[s * d, "Ez csak félút — ez az összes csoki.", "resz"], [s + d, "A sort és a darabot nem összeadni kell, hanem szorozni!", "egyeb"], [e, ekA(e, true) + " a megevett csokik száma.", "masik"], [s * d + e, "Megette — el kell venni, nem hozzáadni!", "egyeb"]], kulcs: "ae3" + s + d + e });
  }
  var k3 = ekKis(cfg), p = k3 ? ekR(2, 4) : ekR(3, 6), k = k3 ? ekR(10, 25) : ekR(20, 60), x = k3 ? 5 * ekR(1, 6) : 10 * ekR(2, 8);
  if (x >= p * k || p * k > ekMax(cfg) || (!k3 && p * k + x > 1000)) return null;
  return ekAE(cfg, { sablon: "K3", kep: ekErem("📚", p, "polc") + ekErem("📕", k, "polconként"), tort: [p + " polcon " + k + "-" + k + " könyv áll. " + ekNagy(ekRag(x, "t")) + " kikölcsönöztek."], kerdes: "Hány könyv " + ekKi("maradt") + " a polcokon?", arany: "maradt", helyes: p * k - x,
    v: [[p * k, "Ez csak félút — ez az összes könyv.", "resz"], [x, ekA(x, true) + " a kikölcsönzött könyvek száma.", "masik"], [p * k + x, "Kikölcsönözték — el kell venni, nem hozzáadni!", "egyeb"]], kulcs: "ae35" + p + k + x });
}

/* ═════════════════ GENERÁTOR-DISZPÉCSER ═════════════════ */
/* számkör-őr: 3. o.-ban (a Varázstekercsen is) semmi ne legyen 100 fölött — szöveg, kártyák, jó válasz, lánc, végigvezetés */
function ekTulNagy(cfg, f) {
  var M = ekMax(cfg), tul = false;
  function nez(t) { (ekSima(t).match(/\d+/g) || []).forEach(function (d) { if (+d > M) tul = true; }); }
  (function jar(x) {
    if (!x || tul) return;
    nez(x.kartyaHTML); if (typeof x.helyes === "number" && x.helyes > M) tul = true;
    if (x.ek && x.ek.kopp) x.ek.kopp.kartyak.forEach(function (k) { nez(k.h); });
    if (x.ek && x.ek.vezet) x.ek.vezet.lepesek.forEach(function (l) { nez(l[0]); if (l[1] > M) tul = true; });
    (x.lanc || []).forEach(jar);
  })(f);
  return tul;
}
var EK_GEN = { nagyito: ekNagyito, kirol: ekKirol, mit: ekMit, lanc: ekLanc, nyomoz: ekNyomoz,
  iker: ekIker, nem: ekNem, legalabb: ekLegalabb, par: ekPar, mindketto: ekMindketto,
  lepcso: ekLepcso, kinek: ekKinek, felut: ekFelut, hanylepes: ekHanylepes, kakas: ekKakas,
  aeK1: ekAeK1, aeK2: ekAeK2, aeK3: ekAeK3 };
var EK_INTRO = { nagyito: "Keresd meg a kérdést!", kirol: "Kiről kérdez?", mit: "Mit kell megszámolni?", lanc: "Figyelj, a második kérdés más!", nyomoz: "Nyomozzunk!",
  iker: "Két kérdés — keresd a különbséget!", nem: "Figyelj a NEM szóra!", legalabb: "Legalább, legfeljebb — benne van-e a határ?", par: "Rejtett számok a szavakban!", mindketto: "Mindkettő, csak az egyik, egyik sem!",
  lepcso: "Lépésről lépésre, a tetejéig!", kinek: "Pali és Juli megint vitatkozik!", felut: "Ne állj meg félúton!", hanylepes: "Hány lépés kell?", kakas: "Mi van a kettő között?",
  odu: "Az Odú-küszöbön vegyesen jönnek — a végén egy igazi versenyfeladat!" };
var EK_DICSER = { K1: ["Pontosan ezt kérdezték!", "Jó nyomozó vagy!", "Megtaláltad, kiről szól!"], K2: ["Ügyes, észrevetted a kis szót!", "Pontosan! A kis szó mindent eldönt.", "Szemfüles vagy!"],
  K3: ["Felértél a lépcső tetejére!", "Nem álltál meg félúton — ügyes!", "Ez már tényleg a válasz!"] };
/* sorban forgó változat (egy asztalon ne jöjjön kétszer egymás után ugyanaz a fajta) */
function ekRot(kulcs, n) { var R = J.ekRot || (J.ekRot = {}); R[kulcs] = (R[kulcs] == null ? ekR(0, n - 1) : R[kulcs] + 1) % n; return R[kulcs]; }
GEN.konyvtar = function (cfg, kerultMar) {
  J.ekHibas = false;                                   /* új pötty: még nem volt hiba */
  var sab = cfg.sablon, elso = J.feladatKesz === 0;
  if (cfg.odu) sab = (J.feladatKesz >= J.feladatDb - 1) ? "ae" + cfg.kocka : cfg.vegyes[J.feladatKesz % cfg.vegyes.length];
  var gen = EK_GEN[sab], f = null;
  for (var k = 0; k < 200; k++) {
    var x = gen(cfg);
    if (!x || ekTulNagy(cfg, x)) continue;
    f = x;
    if (!x.kulcs || !kerultMar[x.kulcs]) break;
  }
  for (k = 0; !f && k < 200; k++) f = EK_GEN[cfg.odu ? cfg.vegyes[0] : sab](cfg);
  if (!f) f = ekNagyito(cfg);
  if (f.kulcs) kerultMar[f.kulcs] = true;
  f.ekKocka = cfg.kocka;
  if (elso) {
    var intro = EK_INTRO[cfg.odu ? "odu" : cfg.sablon];
    if (intro) { f.felolvas = ekKiejt(intro) + " " + f.felolvas; setTimeout(function () { bagolyMondat(intro); }, 50); }
  }
  return f;
};

/* ═════════════════ MOTOR-KAPCSOLÓK (engine-logic / meres.js hívja) ═════════════════ */
function ekIndit() { J.ekPotty = { ossz: 0, jo: 0 }; J.ekCsapda = {}; J.ekHibas = false; J.ekPar = null; }
function ekCsapdaSzamol(t) { if (J && J.ekCsapda && t) J.ekCsapda[t] = (J.ekCsapda[t] || 0) + 1; }
function ekPottyKesz() { if (!J.ekPotty) ekIndit(); J.ekPotty.ossz++; if (!J.ekHibas) J.ekPotty.jo++; J.ekHibas = false; }
function ekDicser(f, elsore) {
  if (f.vezet) return "Most már megy!";
  if (!elsore) return "Így már jó!";
  var L = EK_DICSER[f.ekKocka || (J.palya && J.palya.kocka)] || ["Ez az!"];
  return ekE(L);
}
function ekVillant(arany) {
  var kk = document.querySelector("#buborek-feladat .ek-kk"); if (!kk) return;
  if (arany && kk.innerHTML.indexOf("<mark>") < 0) { var h = kk.innerHTML, i = h.indexOf(arany); if (i >= 0) kk.innerHTML = h.slice(0, i) + "<mark>" + arany + "</mark>" + h.slice(i + arany.length); }
  kk.classList.remove("villan"); void kk.offsetWidth; kk.classList.add("villan");
}
/* koppintós kártyák (a mérés #valasz-kartyak panelját használja; a kattintást a mKoppKatt ide adja tovább) */
function ekKoppMutat(f) {
  var p = mKoppPanel(), K = f.ek.kopp;
  J.kopp = { f: f, kesz: false, hiba: 0 };
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  p.innerHTML = (K.elo || "") + '<div class="kartyak ek-kartyak' + (K.tipus === "mondat" ? " ek-oszlop" : "") + '">' +
    K.kartyak.map(function (k, i) { return '<button class="ek-tk ' + (k.cls || "") + '" data-i="' + i + '">' + k.h + '</button>'; }).join("") + '</div>' +
    (K.tipus === "tobb" ? '<button class="ek-kesz" data-i="kesz">Kész, ennyi ✓</button>' : "");
  p.hidden = false;
}
function ekKoppJo(f, k) {
  J.kopp.kesz = true;
  if (k && k.nemElsore) J.ekHibas = true;
  if (k && k.utan) f.utoMondat = k.utan;
  setTimeout(function () { if (J && J.feladat === f) ertekel(f.helyes); }, 380);
}
function ekKoppRossz(f, cimke, msg, fajta) {
  J.probak++; J.allomasHibatlan = false; J.ekHibas = true; J.kopp.hiba++;
  streakLep(false); naplozz(f.naplo, false, cimke); hangHiba();
  var v = $("visszajelzes"), sug = f.ek.sug || "Olvassuk el újra a kérdést!";
  if (msg) ekCsapdaSzamol(fajta);
  if (J.kopp.hiba >= 2) {
    ekVillant(f.ek.arany);
    var joB = document.querySelector('#valasz-kartyak .ek-tk.ek-mk[data-i="' + f.ek.kopp.kartyak.map(function (k) { return !!k.jo; }).indexOf(true) + '"]');
    if (joB) joB.classList.add("ek-sug");
    v.className = "visszajelzes " + (msg ? "ek-csapda" : "rossz"); v.innerHTML = msg || sug;
    mondd(ekKiejt(msg || sug) + " " + ekKiejt(f.ek.felolvasK || ""));
  } else if (msg) { v.className = "visszajelzes ek-csapda"; v.innerHTML = msg; mondd(ekKiejt(msg)); }
  else { v.className = "visszajelzes rossz"; v.textContent = "Nem ez. Próbáld újra!"; mondd("Nem ez. Próbáld újra!"); }
  ment();
}
function ekKoppKatt(ev) {
  var b = ev.target.closest ? ev.target.closest("[data-i]") : null;
  if (!b || !J || !J.kopp || J.kopp.kesz || !J.feladat || !J.feladat.ek) return;
  if (b.classList.contains("kiszurkul") || b.classList.contains("jo") || b.classList.contains("rossz")) return;
  var f = J.feladat, K = f.ek.kopp, d = b.getAttribute("data-i"), p = $("valasz-kartyak");
  hangGomb();
  if (K.tipus === "tobb") {
    if (d !== "kesz") { b.classList.toggle("valasztva"); return; }
    var gombok = p.querySelectorAll(".ek-tk"), jo = true, hatarHiba = false, valDb = 0;
    Array.prototype.forEach.call(gombok, function (x, i) {
      var v = x.classList.contains("valasztva"), kell = !!K.kartyak[i].jo;
      if (v) valDb++;
      if (v !== kell) { jo = false; if (K.kartyak[i].hatar) hatarHiba = true; }
    });
    if (!valDb) { $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "Előbb koppints azokra, akikre igaz!"; return; }
    if (jo) { Array.prototype.forEach.call(gombok, function (x, i) { x.classList.add(K.kartyak[i].jo ? "jo" : "kiszurkul"); }); b.hidden = true; ekKoppJo(f); }
    else ekKoppRossz(f, "kijelölés", hatarHiba ? K.hatarM : "Nézd meg újra a számokat!", hatarHiba ? "hatar" : "egyeb");
    return;
  }
  var k = K.kartyak[+d];
  if (!k) return;
  if (k.jo) {
    b.classList.add("jo");
    Array.prototype.forEach.call(p.querySelectorAll(".ek-tk"), function (x) { if (x !== b) x.classList.add("kiszurkul"); });
    if (K.tipus === "mondat") {
      var kk = document.querySelector("#buborek-feladat .ek-kk");
      if (kk) { kk.innerHTML = k.szoveg; kk.classList.remove("villan"); void kk.offsetWidth; kk.classList.add("villan"); }
      b.style.visibility = "hidden";
    }
    ekKoppJo(f, k);
  } else {
    mBillegHalvany(b);
    ekKoppRossz(f, ekSima(k.h).slice(0, 40), k.m, k.t);
  }
}
/* szóbeli rossz válasz (az ertekel hívja): 1. → csapda-mondat / „Olvassuk el újra…”, 2. → végigvezetés */
function ekHiba(f, valasz) {
  J.ekHibas = true;
  var v = $("visszajelzes"), c = f.ek.csap && f.ek.csap[valasz];
  if (f.ek.vezetLepes) {
    if (J.probak === 1) { v.className = "visszajelzes rossz"; v.textContent = "Nem " + valasz + ". Számold ki újra!"; mondd("Nem talált. Számold ki újra!", kezNelkulUjra); }
    else { v.className = "visszajelzes rossz"; v.textContent = "✘ " + f.megoldas; mondd("Nézd: " + ekKiejt(f.megoldas) + ". Most mondd te!", kezNelkulUjra); }
    return;
  }
  if (J.probak === 1) {
    if (c) { ekCsapdaSzamol(c.t); v.className = "visszajelzes ek-csapda"; v.innerHTML = c.m; mondd(ekKiejt(c.m), kezNelkulUjra); }
    else { v.className = "visszajelzes rossz"; v.textContent = "Nem " + valasz + ". Olvassuk el újra a kérdést!"; ekVillant(f.ek.arany); mondd("Olvassuk el újra a kérdést! " + ekKiejt(f.ek.kerdes), kezNelkulUjra); }
    return;
  }
  if (c) ekCsapdaSzamol(c.t);
  if (f.ek.vezet && !f.vezet) { ekVezet(f, valasz); return; }
  v.className = "visszajelzes rossz"; v.textContent = "✘ " + f.megoldas;
  mondd("Nézd meg: " + ekKiejt(f.megoldas) + ". Most mondd te!", kezNelkulUjra);
}
function ekLepesDoboz(cim, szoveg, vegso) { return '<div class="ek-lepes' + (vegso ? ' vegso' : '') + '"><span class="ek-lepes-cim">' + cim + '</span> ' + szoveg + '</div>'; }
function ekVezetSzob(f, lepesH, kerdesSzov, helyes, megoldas, veg) {
  var B = f.ek.bub;
  return { csalad: "egyenkent", nagySzam: f.nagySzam, jegyMax: f.jegyMax, vezet: true, ekKocka: f.ekKocka,
    ek: { sablon: f.ek.sablon, csap: {}, arany: "", kerdes: f.ek.kerdes, bub: B, vezetLepes: true },
    kartyaHTML: ekBub({ kep: B.kep, tort: B.tort, kerdes: f.ek.kerdes, lepes: lepesH }),
    szoveg: ekSima(kerdesSzov), felolvas: ekKiejt(kerdesSzov), helyes: helyes, keplet: "", megoldas: megoldas || String(helyes), tipp: "", lanc: null,
    naplo: { tipus: f.naplo.tipus + veg, kerdes: ekSima(kerdesSzov).slice(0, 60), helyes: helyes, atlepes: false } };
}
function ekVezet(f, valasz) {
  var V = f.ek.vezet, B = f.ek.bub, sor = [];
  var mitK = mKever(V.mit.map(function (t, i) { return { h: '<span class="cimke">' + t + '</span>', jo: i === 0, cls: "ek-mit" }; }));
  sor.push({ csalad: "koppint", vezet: true, ekKocka: f.ekKocka,
    ek: { sablon: f.ek.sablon, kopp: { tipus: "valaszt", kartyak: mitK }, arany: f.ek.arany, kerdes: f.ek.kerdes, felolvasK: ekSima(f.ek.kerdes), bub: B, vezetLepes: true, sug: "Olvasd el újra a kérdést: mire kell felelni?" },
    kartyaHTML: ekBub({ kep: B.kep, tort: B.tort, kerdes: f.ek.kerdes, lepes: ekLepesDoboz("1. lépés", "Mit kérdeznek?") }),
    szoveg: "Mit kérdeznek?", felolvas: "Első lépés: mit kérdeznek?", helyes: 1, joKiir: V.mit[0], megoldas: V.mit[0], tipp: "", lanc: null,
    naplo: { tipus: f.naplo.tipus + "-lepes", kerdes: "Mit kérdeznek?", helyes: V.mit[0], atlepes: false } });
  V.lepesek.forEach(function (l, i) { sor.push(ekVezetSzob(f, ekLepesDoboz((i + 2) + ". lépés", l[0]), l[0], l[1], l[2], "-lepes")); });
  var vege = ekVezetSzob(f, ekLepesDoboz("Most újra a kérdés:", ekSima(f.ek.kerdes), true), "Most újra a kérdés: " + ekSima(f.ek.kerdes), f.helyes, f.megoldas, "-ujra");
  vege.lanc = f.lanc; vege.ek.vezetLepes = false; vege.ek.csap = f.ek.csap;
  sor.push(vege);
  sor[0].lanc = sor.slice(1);
  J.lancKov = sor[0];
  figyelStop();
  $("visszajelzes").className = "visszajelzes rossz";
  $("visszajelzes").textContent = "Nem " + valasz + ". Nézzük meg lépésenként!";
  mondd("Nézzük meg lépésenként!", function () { if (J && J.lancKov === sor[0]) ujFeladat(); });
}

/* ═════════════════ KOCKA-NAPOK („stabil”) — pálya végén ═════════════════ */
var EK_STABIL = { nap: 3, arany: 0.8 };             /* 5b: a pult 🧱 füle állíthatja */
function ekAllapot() { var p = P(); if (!p.ek) p.ek = { napok: {}, maElso: {}, mester: {} }; if (!p.ek.napok) p.ek.napok = {}; if (!p.ek.maElso) p.ek.maElso = {}; if (!p.ek.mester) p.ek.mester = {}; return p.ek; }
function ekNapDb(pid) { var n = (P().ek && P().ek.napok && P().ek.napok[pid]) || []; return n.length; }
function ekKockaSor(db) { var s = ""; for (var i = 0; i < EK_STABIL.nap; i++) s += i < db ? "◼" : "▢"; return s; }
function ekPalyaVege() {
  var st = ekAllapot(), pid = J.palya.id, ma = helyiNap(), E = J.ekPotty || { ossz: 0, jo: 0 };
  if (J.palya.fok !== "tekercs") {                     /* 📖 Mesekönyv: nincs kocka-nap — az első végigjárás a 📜 Varázstekercset nyitja */
    if (!st.meseKesz) st.meseKesz = {};
    var uj = !st.meseKesz[pid]; st.meseKesz[pid] = true; ment();
    var m0 = uj ? "Kinyílt a 📜 Varázstekercs! Ott már csavarosabbak a kérdések — és ott gyűlnek a kocka-napok." : "Szép munka! A kocka-napok a 📜 Varázstekercsen gyűlnek.";
    return { html: '<br><span class="ek-vege">' + m0 + '</span>', mondat: " " + m0.replace(/📜 /g, ""),
      adat: { kocka: J.palya.kocka, szarny: J.palya.szarny, fok: "mese", potty: E.ossz, elsore: E.jo, nap: false, napDb: 0, csapdak: J.ekCsapda || {} } };
  }
  var elsoMa = st.maElso[pid] !== ma, nap = false, arany = E.ossz ? E.jo / E.ossz : 0;
  if (elsoMa) {
    st.maElso[pid] = ma;
    if (E.ossz && arany >= EK_STABIL.arany) { var L = st.napok[pid] || (st.napok[pid] = []); if (L.indexOf(ma) < 0) { L.push(ma); nap = true; } }
  }
  var db = Math.min(EK_STABIL.nap, ekNapDb(pid)), mondat;
  if (nap) mondat = db >= EK_STABIL.nap ? ekKockaSor(db) + " — Ez a kocka stabil! Hamarosan jön a 🏅 Mesterpróba." : "Ma is ügyes voltál: " + ekKockaSor(db) + " — még " + (EK_STABIL.nap - db) + " nap, és jöhet a Mesterpróba!";
  else if (elsoMa || db < EK_STABIL.nap) mondat = "Szép munka! " + (elsoMa ? "Holnap újra gyűjthetsz kocka-napot." : "Kocka-napot naponta az első végigjárás ad.") + " " + ekKockaSor(db);
  else mondat = "Ez a kocka már stabil: " + ekKockaSor(db);
  ment();
  return { html: '<br><span class="ek-vege">🧱 ' + mondat + '</span>', mondat: " " + mondat.replace(/[◼▢]+/g, "").replace(/🏅/g, ""),
    adat: { kocka: J.palya.kocka, szarny: J.palya.szarny, fok: "tekercs", potty: E.ossz, elsore: E.jo, nap: nap, napDb: db, csapdak: J.ekCsapda || {} } };
}

/* ═════════════════ A LIGET a pályaválasztóban ═════════════════ */
function ekSzarnyPalyak(sz) { return PALYAK.filter(function (p) { return p.konyvtar && p.szarny === sz; }); }
/* lakat: a 📜 Varázstekercset a saját 📖 Mesekönyve nyitja; a kockák Mesekönyvei a szárnyon belül sorban nyílnak (az előző Mesekönyv egyszeri végigjárása kell) */
function ekLakat(pa) {
  if (!pa.konyvtar) return null;
  var L = ekSzarnyPalyak(pa.szarny).filter(function (x) { return !palyaRejtve(x); }), elozo = null;
  if (pa.fok === "tekercs") elozo = L.filter(function (x) { return x.kocka === pa.kocka && x.fok !== "tekercs"; })[0] || null;
  else { var M = L.filter(function (x) { return x.fok !== "tekercs"; }), i = M.indexOf(pa); elozo = i > 0 ? M[i - 1] : null; }
  if (!elozo) return null;
  var pr = P().palyak[elozo.id];
  return pr && pr.kesz ? null : elozo;
}
function ekLakatMondat(pa) {
  var e = ekLakat(pa); if (!e) return "";
  return pa.fok === "tekercs" ? "A Varázstekercs még zárva. Előbb olvasd végig a Mesekönyvet!" : "Ez a kocka még zárva. Előbb járd végig ezt: " + e.kockaNev + ", Mesekönyv!";
}
function ekKartyaDisz(pa, kart, zarva) {
  var pn = kart.querySelector(".pnev"); if (pn && EK_FOK[pa.fok]) pn.textContent = EK_FOK[pa.fok].nev;
  kart.classList.add("ek-fok-" + (pa.fok || "mese"));
  if (pa.fok === "tekercs") {                          /* a kocka-napok ▢▢▢ csak a Varázstekercsen gyűlnek */
    var db = Math.min(EK_STABIL.nap, ekNapDb(pa.id)), mester = !!ekAllapot().mester[pa.id], s = "";
    for (var i = 0; i < EK_STABIL.nap; i++) s += '<i class="' + (i < db ? "teli" : "") + '"></i>';
    var sor = el("div", "ek-kockak"); sor.innerHTML = s + (mester ? '<span class="erem">🏅</span>' : '');
    sor.title = "Kocka-napok: " + db + " / " + EK_STABIL.nap;
    kart.insertBefore(sor, kart.querySelector(".also"));
  }
  var e = zarva && ekLakat(pa);
  if (e) { var pc = kart.querySelector(".palcim"); if (pc) pc.textContent = pa.fok === "tekercs" ? "🔒 Előbb: Mesekönyv" : "🔒 Előbb: " + e.kockaNev; }
}
/* a menü egy sora = egy kocka: [📖 Mesekönyv] → [📜 Varázstekercs ▢▢▢] → 🏅 (a Mesterpróba az 5b lépés) */
function ekMenuSor(palyak, kartya) {
  var p0 = palyak[0], sor = el("div", "ek-kocka-sor");
  sor.appendChild(el("div", "ek-kocka-cim", p0.kockaIkon + " " + p0.kockaNev));
  var lepcso = el("div", "ek-lepcso");
  palyak.forEach(function (pa, i) { if (i) lepcso.appendChild(el("span", "ek-nyil", "→")); lepcso.appendChild(kartya(pa)); });
  var tek = palyak.filter(function (x) { return x.fok === "tekercs"; })[0], mester = tek && !!ekAllapot().mester[tek.id];
  var db = tek ? Math.min(EK_STABIL.nap, ekNapDb(tek.id)) : 0;
  lepcso.appendChild(el("span", "ek-nyil", "→"));
  var erem = el("button", "ek-mester-hely" + (mester ? " kesz" : db >= EK_STABIL.nap ? " kozel" : ""), "🏅");
  erem.title = "Mesterpróba";
  erem.addEventListener("click", function () {
    hangGomb();
    mondd(mester ? "Ezt a Mesterpróbát már kiálltad! Ügyes vagy!" : db >= EK_STABIL.nap ? "Ez a kocka stabil! Hamarosan jön a Mesterpróba." : "Mesterpróba: ha a Varázstekercsen három külön napon ügyes vagy, itt vár rád egy igazi versenyfeladat!");
  });
  lepcso.appendChild(erem);
  sor.appendChild(lepcso);
  return sor;
}
function ekSzarnyNev(sz, ikonnal) { for (var i = 0; i < SZARNYAK.length; i++) if (SZARNYAK[i].id === sz) return (ikonnal && SZARNYAK[i].ikon ? SZARNYAK[i].ikon + " " : "") + SZARNYAK[i].nev; return sz; }
var EK_KOCKAK = [["🔎", "#9ec9f0"], ["🔤", "#f6a5c0"], ["✋", "#a7d99a"], ["📋", "#fce49a"], ["🎲", "#c9a8e6"], ["🌳", "#b6e0a8"], ["📊", "#f7c59f"],
  ["🏆", "#ffd35c"], ["🤔", "#d8cdf0"], ["🚶", "#f3cfe0"], ["📅", "#9fd8e0"], ["📏", "#e8d6b0"], ["🔁", "#c3d7f7"], ["🧩", "#f6b8a6"]];   /* a 14 építőkocka-pálya (jóváhagyott sorrend) */
var EK_VAR_HELY = [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [-2, 2], [0, 2], [2, 2], [0, 3]].map(function (x) { return [60 + x[0] * 20.5, 100 - x[1] * 16]; });
function ekKockaDb() { var m = ekAllapot().mester, n = 0; for (var k in m) if (m[k]) n++; return Math.min(14, n); }
function ekKockavarKicsi(n, x, y, s) {
  var g = '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-70 40 Q0 10 70 40 V60 H-70Z" fill="#b6e0a8"/>';
  EK_VAR_HELY.forEach(function (h, i) {
    g += i < n ? '<rect x="' + (h[0] - 60) + '" y="' + (h[1] - 118) + '" width="19" height="15" rx="2" fill="' + EK_KOCKAK[i][1] + '" stroke="#fff" stroke-width="1.2"/>'
      : '<rect x="' + (h[0] - 60) + '" y="' + (h[1] - 118) + '" width="19" height="15" rx="2" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 2" opacity=".7"/>';
  });
  if (n >= 14) g += '<path d="M0 -58 V-80" stroke="#6b5442" stroke-width="2"/><path d="M0 -80 L16 -75 L0 -70Z" fill="#e2589b"/>';
  return g + '</g>';
}
function ekBagoly(x, y, s) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-40,52 Q0,40 40,52" stroke="#6b5442" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="0" rx="34" ry="42" fill="#c9a8e6"/><ellipse cx="0" cy="8" rx="22" ry="30" fill="#e9ddf3"/>' +
    '<path d="M-34,-6 Q-46,10 -34,30 Q-30,10 -30,-6 Z" fill="#b48fd6"/><path d="M34,-6 Q46,10 34,30 Q30,10 30,-6 Z" fill="#b48fd6"/>' +
    '<path d="M-26,-40 l10,-14 l6,14 Z" fill="#c9a8e6"/><path d="M26,-40 l-10,-14 l-6,14 Z" fill="#c9a8e6"/>' +
    '<circle cx="-13" cy="-14" r="14" fill="#fdfdfd"/><circle cx="13" cy="-14" r="14" fill="#fdfdfd"/>' +
    '<g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .1;1 1" keyTimes="0;.94;.97;1" dur="4.5s" repeatCount="indefinite" additive="sum"/>' +
    '<circle cx="-11" cy="-12" r="6.5" fill="#4a3b7a"/><circle cx="11" cy="-12" r="6.5" fill="#4a3b7a"/></g>' +
    '<circle cx="-13" cy="-15" r="2" fill="#fff"/><circle cx="9" cy="-15" r="2" fill="#fff"/><path d="M-5,-2 L5,-2 L0,10 Z" fill="#ffcf6b"/>' +
    '<path d="M-30,44 l-6,10 M-22,46 l-2,10 M22,46 l2,10 M30,44 l6,10" stroke="#ffcf6b" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="-13" cy="-14" r="17" fill="none" stroke="#8a6a4a" stroke-width="2.5"/><circle cx="13" cy="-14" r="17" fill="none" stroke="#8a6a4a" stroke-width="2.5"/><path d="M-1,-16 h2" stroke="#8a6a4a" stroke-width="2.5"/></g>';
}
var EK_KSZIN = ["#c9a8e6", "#9ec9f0", "#f6a5c0", "#a7d99a", "#f7c59f", "#fce49a", "#b48fd6", "#e8b27c", "#8fc3c7"];
function ekPolc(x0, x1, yTop, yAlj, sorok, r) {
  var s = '<rect x="' + (x0 - 6) + '" y="' + (yTop - 8) + '" width="' + (x1 - x0 + 12) + '" height="' + (yAlj - yTop + 8) + '" fill="#a8744a"/><rect x="' + x0 + '" y="' + yTop + '" width="' + (x1 - x0) + '" height="' + (yAlj - yTop) + '" fill="#7a5134"/>';
  var h = (yAlj - yTop) / sorok;
  for (var i = 1; i <= sorok; i++) {
    var y = yTop + i * h, x = x0 + 3;
    while (x < x1 - 8) {
      var w = 6 + r() * 8, bh = h * (.55 + r() * .32), c = EK_KSZIN[Math.floor(r() * EK_KSZIN.length)];
      if (r() < .1 && x < x1 - 24) { s += '<rect x="' + (x + 4).toFixed(1) + '" y="' + (y - bh * .9).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (bh * .9).toFixed(1) + '" fill="' + c + '" transform="rotate(-16 ' + (x + 4).toFixed(1) + ' ' + y.toFixed(1) + ')"/>'; x += w + 12; continue; }
      if (r() < .06) { x += 10; continue; }
      s += '<rect x="' + x.toFixed(1) + '" y="' + (y - bh).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="1.5" fill="' + c + '"/>';
      x += w + .8;
    }
    s += '<rect x="' + (x0 - 6) + '" y="' + (y - 1).toFixed(1) + '" width="' + (x1 - x0 + 12) + '" height="6" fill="#b98652"/>';
  }
  return s;
}
/* a könyvtárterem (menü-háttér és pálya-jelenet közös rajza): W széles, fal magas fal, H teljes magasság */
function ekKonyvtarSVG(W, H, fal, id) {
  var rnd = 7, r = function () { rnd = (rnd * 16807) % 2147483647; return (rnd - 1) / 2147483646; };
  var n = ekKockaDb(), cx = W / 2, sorok = fal > 300 ? 7 : 3, wb = Math.min(154, fal - 16);
  var s = '<defs><linearGradient id="kf' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8ecd9"/><stop offset="1" stop-color="#efdcc0"/></linearGradient>' +
    '<linearGradient id="eg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f7"/><stop offset="1" stop-color="#fbe4ef"/></linearGradient>' +
    '<radialGradient id="fg' + id + '"><stop offset="0" stop-color="#fff2b0" stop-opacity=".75"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#kf' + id + ')"/>';
  for (var x = 22; x < W; x += 48) s += '<rect x="' + x + '" y="0" width="4" height="' + fal + '" fill="rgba(190,140,90,.10)"/>';
  var pw = Math.min(248, W * .28);
  s += ekPolc(14, 14 + pw, 10, fal - 6, sorok, r) + ekPolc(W - 14 - pw, W - 14, 10, fal - 6, sorok, r);
  s += '<g><path d="M' + (cx - 78) + ' ' + wb + ' V64 Q' + cx + ' -6 ' + (cx + 78) + ' 64 V' + wb + 'Z" fill="#a8744a"/><path d="M' + (cx - 68) + ' ' + (wb - 6) + ' V68 Q' + cx + ' 8 ' + (cx + 68) + ' 68 V' + (wb - 6) + 'Z" fill="url(#eg' + id + ')"/>' +
    '<ellipse cx="' + (cx - 30) + '" cy="60" rx="22" ry="7" fill="#fff" opacity=".8"><animate attributeName="cx" values="' + (cx - 40) + ';' + (cx - 10) + ';' + (cx - 40) + '" dur="22s" repeatCount="indefinite"/></ellipse>' +
    ekKockavarKicsi(n, cx, wb - 4, .55) +
    '<path d="M' + cx + ' 18 V' + (wb - 6) + ' M' + (cx - 68) + ' 100 H' + (cx + 68) + '" stroke="#a8744a" stroke-width="5"/><rect x="' + (cx - 84) + '" y="' + (wb - 6) + '" width="168" height="10" rx="3" fill="#c99b6d"/></g>';
  [cx - 150, cx + 146].forEach(function (lx, i) {
    s += '<path d="M' + lx + ' 0 V40" stroke="#6b5442" stroke-width="2"/><ellipse cx="' + lx + '" cy="70" rx="46" ry="40" fill="url(#fg' + id + ')"><animate attributeName="opacity" values=".8;1;.85;1;.8" dur="' + (5 + i) + 's" repeatCount="indefinite"/></ellipse>' +
      '<path d="M' + (lx - 18) + ' 58 L' + (lx - 10) + ' 40 H' + (lx + 10) + ' L' + (lx + 18) + ' 58Z" fill="#f2c46b" stroke="#c9953a" stroke-width="2"/><ellipse cx="' + lx + '" cy="59" rx="9" ry="3" fill="#fff6c8"/>';
  });
  var lx0 = W - 14 - pw - 28;
  s += '<g opacity=".95"><path d="M' + lx0 + ' ' + (fal + 2) + ' L' + (lx0 + 56) + ' 6 M' + (lx0 + 24) + ' ' + (fal + 2) + ' L' + (lx0 + 80) + ' 6" stroke="#8a5a36" stroke-width="5" stroke-linecap="round"/>';
  for (var i = 1; i < 8; i++) { var t = i / 8; s += '<path d="M' + (lx0 + 56 * t) + ' ' + (fal + 2 - (fal - 4) * t) + ' H' + (lx0 + 24 + 56 * t) + '" stroke="#8a5a36" stroke-width="4"/>'; }
  s += '</g>' + ekBagoly(14 + pw * .8, 38, .42);
  s += '<rect y="' + fal + '" width="' + W + '" height="' + (H - fal) + '" fill="#e3c29a"/>';
  for (var y = fal + 22; y < H; y += 30) s += '<path d="M0 ' + y + ' H' + W + '" stroke="#d2ad80" stroke-width="2"/>';
  for (var y2 = fal, k = 0; y2 < H; y2 += 30, k++) for (var x2 = (k % 2) * 90; x2 < W; x2 += 180) s += '<path d="M' + x2 + ' ' + y2 + ' v22" stroke="#d2ad80" stroke-width="2"/>';
  s += '<rect y="' + (fal - 4) + '" width="' + W + '" height="8" fill="#b98652"/>';
  for (var p = 0; p < 9; p++) { var px = cx - 170 + r() * 340, py = 60 + r() * 120; s += '<circle cx="' + px.toFixed(0) + '" cy="' + py.toFixed(0) + '" r="1.6" fill="#fff6c8" opacity=".8"><animate attributeName="cy" values="' + py.toFixed(0) + ';' + (py - 18).toFixed(0) + ';' + py.toFixed(0) + '" dur="' + (6 + r() * 5).toFixed(1) + 's" repeatCount="indefinite"/></circle>'; }
  return s;
}
/* a menü-liget háttere: a liget arányához igazodik, hogy a polcok mindig látszódjanak */
function ekLigetHatter(szek) {
  var bg = szek.querySelector(".palya-regio-hatter");
  if (!bg) { bg = el("div", "palya-regio-hatter"); szek.insertBefore(bg, szek.firstChild); }
  function rajz() {
    var w = szek.offsetWidth || 900, h = szek.offsetHeight || 620, W = 900, H = Math.max(460, Math.round(W * h / w));
    bg.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' + ekKonyvtarSVG(W, H, Math.min(H - 30, 420), "m") + '</svg>';
  }
  rajz();
  requestAnimationFrame(rajz);
}

/* ═════════════════ A PÁLYA-JELENET: könyvtár padlója, 5 olvasóasztal + Odú-küszöb ═════════════════ */
var EK_SZIN = { K1: ["#6aa9dc", "#9ec9f0"], K2: ["#e07aa0", "#f6a5c0"], K3: ["#6fb36a", "#a7d99a"] };
function ekAsztal(x, y, P, nev, i) {
  var w = Math.max(84, nev.length * 7.6 + 20);
  return '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(1.3)"><ellipse cx="0" cy="16" rx="50" ry="13" fill="#c9a079" opacity=".55"/>' +
    '<rect x="-40" y="-14" width="8" height="30" fill="#8a5a36"/><rect x="32" y="-14" width="8" height="30" fill="#8a5a36"/>' +
    '<rect x="-46" y="-24" width="92" height="11" rx="4" fill="#b07a4c"/>' +
    '<path d="M-26 -24 Q-13 -36 0 -28 Q13 -36 26 -24 L26 -22 L-26 -22Z" fill="#fffaf0" stroke="' + P[0] + '" stroke-width="2.5"/>' +
    '<path d="M-20 -28 h14 M-20 -25 h12 M6 -28 h14 M8 -25 h12" stroke="#d8cbb8" stroke-width="1.3"/>' +
    (i % 2 ? '<g transform="translate(34,-30)"><path d="M-2 6 V-10" stroke="#8a6a4a" stroke-width="2"/><path d="M-9 -8 L-4 -18 H4 L9 -8Z" fill="#f2c46b"/></g>'
           : '<rect x="28" y="-34" width="10" height="10" rx="2" fill="' + P[1] + '"/><rect x="30" y="-42" width="10" height="8" rx="2" fill="' + P[0] + '"/>') +
    '<rect x="' + (-w / 2) + '" y="-8" width="' + w + '" height="28" rx="11" fill="#fffaf0" stroke="' + P[1] + '" stroke-width="2.5"/>' +
    '<text x="0" y="11" font-size="13.5" ' + MR.F + ' fill="#6a4a3a" text-anchor="middle">' + kiiras(nev) + '</text></g>';
}
function konyvtarJelenetSVG(palya, c) {
  var n = palya.allomasok.length, SZ = EK_SZIN[palya.kocka] || EK_SZIN.K1, px = [], py = [];
  for (var k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var d = "M " + px[0].toFixed(1) + " " + py[0].toFixed(1);
  for (var i = 1; i < n; i++) { var dx = px[i] - px[i - 1]; d += " C " + (px[i - 1] + dx / 2).toFixed(1) + " " + py[i - 1].toFixed(1) + " " + (px[i] - dx / 2).toFixed(1) + " " + py[i].toFixed(1) + " " + px[i].toFixed(1) + " " + py[i].toFixed(1); }
  var s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + ekKonyvtarSVG(1200, 560, 150, "j");
  s += '<g id="kamera"><path d="' + d + '" fill="none" stroke="#b79fd4" stroke-width="52" stroke-linecap="round" opacity=".55"/><path d="' + d + '" fill="none" stroke="#e9ddf3" stroke-width="42" stroke-linecap="round"/>' +
    '<path d="' + d + '" fill="none" stroke="#c9a8e6" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>';
  s += '<g transform="translate(' + px[0] + ',' + py[0] + ')"><ellipse cx="0" cy="10" rx="44" ry="16" fill="#d8c3ea"/><ellipse cx="0" cy="8" rx="36" ry="12" fill="#fff" opacity=".45"/>' +
    '<path d="M0 -24 L0 -2" stroke="#8f6a3e" stroke-width="3"/><path d="M0 -24 L15 -17 L0 -10 Z" fill="' + SZ[1] + '"/></g>';
  var ox = px[n - 1] + 62, oy = py[n - 1] - 6;
  s += '<g transform="translate(' + ox.toFixed(1) + ',' + oy.toFixed(1) + ')"><ellipse cx="0" cy="34" rx="60" ry="16" fill="#6b4a2a" opacity=".22"/>' +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    '<g transform="translate(0,-100)"><rect x="-56" y="-15" width="112" height="30" rx="12" fill="#fffaf0" stroke="' + SZ[1] + '" stroke-width="2.5"/><text x="0" y="5" font-size="14" ' + MR.F + ' fill="#6a4a3a" text-anchor="middle">Odú-küszöb</text></g>' +
    csillagSVG(0, -128, 8, "#ffe08a") + '</g>';
  s += '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g>';
  for (var a = 1; a < n - 1; a++) s += ekAsztal(px[a] + 18, py[a] + 22, SZ, palya.allomasok[a].nev, a);
  for (var b = 0; b < n; b++) {
    var w = Math.max(84, palya.allomasok[b].nev.length * 7.6 + 20);
    var pxx = b > 0 && b < n - 1 ? px[b] + 18 + (w / 2 - 2) * 1.3 : px[b], pyy = b > 0 && b < n - 1 ? py[b] + 22 - 8 * 1.3 : py[b];
    s += '<g class="allomas-pipa" id="pipa-' + b + '" transform="translate(' + pxx.toFixed(1) + ',' + pyy.toFixed(1) + ')" opacity="0"><circle r="13" fill="#a7d99a" stroke="#fff" stroke-width="2"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  return s + '</g></svg>';
}

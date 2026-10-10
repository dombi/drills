/* ============ 6s) 📚 OLVASÓ-POLC — a 🔎 „Mire felelsz?” és a ✋ „Ez már a válasz?” polc pályái az olvasópulton ============
   Terv: Matekos\regi-kockak-konyvtar-terv.html (✅) · rajz: …-rajzterv.html (✅) · tartalom: …-tartalom.html (✅ döntések).
   2. kód-kör (2026-10-10): a két polc 3-3 pályája (📖 Mesekönyv 20 · 📜 Varázstekercs 20 · 🏅 Mesterpróba 1) a közös motoron:
   palyaInditas → GEN.polc → feladatMutat (polcMutat) → ertekel (polcJo / polcHiba) → palyaVege (polcPalyaVege).
   A mesék: polc-mesek.js (PM_KERET). A 🔎/✋ jelzés: olvaso-ellenor.js. A lift + láda + napló: szerszam.js (sz = "KERES" / "VALASZ").

   Egy pötty = egy lánc a motor „lanc” útján (nem új pötty): [elő-lépés] → … → a NAGY beírás (polcSzerep "nagy").
     elő-lépések: 👀 Kiről? / 🧮 Mit számolunk? (3 kártya) · 🔢 Hány lépés? (1 / 2 / 3) · 🐰🦊 Kinek van igaza? · 🔗 a lánc 1. kérdése ·
                  🪜 lépcsőfok (lépés-beírás → ✋ „Ez már a válasz?” Igen / Nem, a végén a csúcs).
   🔎 kérdés-keret (2. döntés: csak ha kell): 🔍 formában mindig · a pálya első feladatánál · a liftben · 🙋-ból · ha másik mennyiségre felelt.
     A Mesterpróbán előre nem kérdez (az segítség lenne).
   🛗 LIFT a nagy beíráson: 1. rossz → konkrét tipp (kiemelt mondat) · 2. rossz → „Nézzük kicsiben!” (🔎: a mese első lépése más kérdéssel;
     ✋: ugyanaz a mese 🪜 lépcsőfokkal, kisebb számokkal; 🏅: a 2 testvér), beszámít, teljes jutalommal → vissza a nagyra ·
     ha a nagy a lift után is kétszer rossz → végigvezetés a könyv második lapján („Mit kérdeznek?” → lépések → „Most újra a kérdés”).
   🧰 LÁDA: a kör utolsó 5 pöttye (a Mesterpróba-keretek) és a Mesterpróba számít (L.nagy); önálló = lift nélkül, 🙋-ból legfeljebb a
     „Mit kérdeznek?”; a ✋/🔎 jelzés utáni jó = önjavítás = önálló (3. döntés ✅).
   🏅 MESTERPRÓBA: a Fejtörő-feladat szövege (felhő, FT) az olvasópulton, beírással, 🙋 nélkül; rossz → nem zár be, jön a lift;
     elsőre jó (a jelzés utáni javítás is) → a polc kockája a 🏰 Kockavárba (ekKockaBe) + mester-szalag a polc tábláján.
   FOLYTATÁS: P().polcAll[pályaId] = { d: nap, k: kész pöttyök } — kilépés után ugyanazon a napon onnan folytatja. */

var POLC_REND = {
  KERES: {
    mese: ["kopp", "sima", "kirol", "sima", "mit", "kopp", "sima", "kirol", "sima", "mit", "sima", "kirol", "sima", "kopp", "sima", "sima", "kirol", "sima", "kopp", "sima"],
    tekercs: ["lanc", "nyomoz", "lanc", "nyomoz", "lanc", "nyomoz", "lanc", "nyomoz", "lanc", "nyomoz", "lanc", "nyomoz", "lanc", "nyomoz", "lanc", "lanc", "nyomoz", "lanc", "nyomoz", "lanc"],
    elso: ["gyujt", "udvar", "het", "bolt"], vegso: ["haz", "csere"]
  },
  VALASZ: {
    mese: ["lepcso", "felut", "hl", "hl2", "felut", "lepcso", "felut", "hl", "hl2", "felut", "felut", "lepcso", "felut", "hl1", "felut", "felut", "felut", "lepcso", "felut", "felut"],
    tekercs: ["harom", "harom", "kinek", "harom", "kinek", "harom", "harom", "kinek", "harom", "harom", "kinek", "harom", "harom", "kinek", "harom", "harom", "kinek", "harom", "harom", "kinek"],
    elso: ["kosar", "szalag", "eletkor", "vasar"], vegso: ["padlo", "kanna"]
  }
};
var POLC_DICSER = { KERES: ["Pontosan ezt kérdezték!", "Jó nyomozó vagy!", "Megtaláltad, mire kell felelni!"], VALASZ: ["Felértél a lépcső tetejére!", "Nem álltál meg félúton – ügyes!", "Ez már tényleg a válasz!"] };
var POLC_M = {
  kirol: "Kiről (miről) kérdeznek? Koppints rá! Számolni még nem kell.", mit: "Mit kell megszámolni? Koppints rá!", hl: "Hány lépés kell? Előbb csak ezt döntsd el!",
  kinek: "Kinek van igaza?", lepcso: "Ez már a válasz?", mester: "Ez a Mesterpróba. Olvasd el nyugodtan!", liftKicsi: "Nézzük kicsiben!",
  liftValasz: "Ügyes! Most a nagyot is így: minden lépés után kérdezd meg, ez már a válasz?", vezet: "Nézzük meg együtt, lépésenként!",
  hlRossz: "Nézzük meg együtt: mit kell tudnunk, mielőtt a kérdezett számot megkapjuk?", tippJo: "Így már jó – most a kérdésre feleltél!"
};

/* ── a 4 Mesterpróba didaktikai rétege (a SZÖVEG a felhőben van: FT.feladatok; itt csak a számok jelentése + a testvérek) ──
   tartalom-lap 4.5 és 5.5 (✅). jelol: [null, "rész"] → a mondatot a rész alapján keresi meg. kicsi.mondatok: "{0}" = az eredeti 1. mondata. */
var POLC_MESTER = {
  "zrinyi-2021-3-M-11": { polc: "KERES", szo: "egy csokigolyó", rajz: [["🥨", 4, "perec"], ["⚖️", "=", "ugyanannyi"], ["🍫", 10, "csokigolyó"]],
    oe: { masik: { 5: { m: "Az 5 tallér egy PEREC ára. De a kérdés egy csokigolyó ára!" } }, koztes: { 20: { m: "Ez egy lépcsőfok volt: ennyibe kerül a 10 csokigolyó együtt. De mit kérdeztek?" } },
          csap: { 10: { m: "A 10 a csokigolyók SZÁMA, nem az áruk. Mennyibe kerül egy?" }, 4: { m: "A 4 a perecek száma. A kérdés egy csokigolyó ára." } } },
    mit: ["egy csokigolyó árát", "egy perec árát", "a 10 csokigolyó árát"],
    kicsi: [{ mondatok: [], kerdes: "Hány tallérba kerül egy csokigolyó, ha 5 csokigolyó 15 tallérba kerül?", helyes: 3, oe: { csap: { 5: { m: "Az 5 a csokigolyók száma, nem az áruk." } } } },
            { mondatok: [], kerdes: "Hány tallérba kerül egy csokigolyó, ha 3 kerek perec ára ugyanannyi, mint 6 csokigolyó ára, és 3 kerek perec 24 tallérba kerül?", helyes: 4,
              oe: { koztes: { 24: { m: "Ez egy lépcsőfok volt: ennyibe kerül a 6 csokigolyó együtt. De mit kérdeztek?" } }, masik: { 8: { m: "A 8 egy PEREC ára. De a kérdés egy csokigolyó ára!" } } } }],
    vissza: "Ügyes! Ugyanaz, csak több perec és több csokigolyó. Most is előbb azt nézd meg: mennyibe kerül az összes csokigolyó?" },
  "zrinyi-2020-3-M-13": { polc: "KERES", szo: "a faház", rajz: [["🧱", "6 hét", "tégla"], ["🌾", "?", "szalma"], ["🪵", "?", "fa"]],
    oe: { masik: { 14: { m: "A 14 nap a SZALMAHÁZ ideje. A kérdés a faház!" }, 42: { m: "A 42 nap a TÉGLAHÁZ ideje. A kérdés a faház!" }, 2: { m: "A 2 hét a szalmaház ideje, hétben. A faházat kérdezték, napban." } },
          koztes: { 56: { m: "Ez egy lépcsőfok volt: a tégla- és a szalmaház együtt. Mennyi maradt a faházra?" }, 35: { m: "Ez egy lépcsőfok volt: csak a téglaházat vetted el. A szalmaházat is!" },
                    63: { m: "Ez egy lépcsőfok volt: csak a szalmaházat vetted el. A téglaházat is!" } },
          csap: { 69: { m: "Hetet és napot nem vonhatunk ki egymásból! Előbb mindent napra kell váltani.", jelol: [null, "6 hét"] }, 3: { m: "3 hét – ez igaz! De a kérdés NAPBAN kérdez." } } },
    mit: ["hány nap alatt épült a faház", "hány nap alatt épült a téglaház", "hány nap kellett összesen"],
    kicsi: [{ mondatok: ["Röfi, a kismalac egy téglaházat épített.", "2 hét alatt építette fel."], kerdes: "Hány nap alatt építette fel?", helyes: 14, oe: { masik: { 2: { m: "A 2 a hetek száma. Napokat kérdeztünk!" } } } },
            { mondatok: ["Röfi, a kismalac egymás után egy téglaházat és egy faházat épített.", "A téglaházat 1 hét alatt építette fel."], kerdes: "Hány nap alatt építette fel a faházat, ha a két ház építéséhez 12 napra volt szüksége?", helyes: 5,
              oe: { masik: { 7: { m: "A 7 a téglaház ideje. A faházat kérdeztük!" } }, csap: { 11: { m: "Az 1 hét nem 1 nap! Előbb váltsd napra.", jelol: [null, "1 hét"] } } } }],
    vissza: "Ügyes! Ugyanaz, csak három házzal. Most is előbb mindent napra váltasz." },
  "zrinyi-2021-3-O-4": { polc: "VALASZ", szo: "mennyivel több fehér", padlo: 1,
    oe: { koztes: { 38: { m: "Ez egy lépcsőfok volt: ennyi a fehér lap. De mennyivel használt többet, mint szürkét?" }, 49: { m: "Ez egy lépcsőfok volt: ennyi lap van az egész padlón." } },
          masik: { 11: { m: "A 11 a szürke lapok száma." } }, csap: { 60: { m: "A szürke lapok is benne vannak a 49-ben: elvenni kell, nem hozzáadni." }, 7: { m: "A 7 csak egy sor." } } },
    mit: ["mennyivel több a fehér, mint a szürke", "hány fehér lap van", "hány lap van az egész padlón"],
    elso: "Ne számold meg egyenként a sok fehér lapot! Hány lap van az egész padlón, ha minden sorban ugyanannyi? Ebből a kevés szürkét kell elvenned.",
    kicsi: [{ mondatok: ["Mekk Elek fehér és szürke lapokkal fedte be a kamrája padlóját: 3 sor, minden sorban 3 lap.", "Ebből 2 szürke."], kerdes: "Hány fehér lap van?", helyes: 7, padlo: [3, 2],
              oe: { koztes: { 9: { m: "Ez egy lépcsőfok volt: ennyi lap van az egész padlón. De a fehéreket kérdeztük!" } } } },
            { mondatok: ["Mekk Elek fehér és szürke lapokkal fedte be a konyhája padlóját: 5 sor, minden sorban 5 lap.", "Ebből 7 szürke."], kerdes: "Hány fehér lappal használt többet, mint szürkét?", helyes: 11, padlo: [5, 7],
              oe: { koztes: { 25: { m: "Ez egy lépcsőfok volt: ennyi lap van az egész padlón." }, 18: { m: "Ez egy lépcsőfok volt: ennyi a fehér lap. De mennyivel több, mint a szürke?" } } } }],
    vissza: "Ügyes! Ugyanaz, csak nagyobb szobában. Minden lépés után kérdezd meg: ez már a válasz?" },
  "zrinyi-2024-3-M-10": { polc: "VALASZ", szo: "hány aprócska", rajz: [["📏", 1, "icike = 4 picike"], ["📏", 1, "picike = 5 aprócska"], ["❓", 10, "icike"]],
    oe: { koztes: { 20: { m: "Ez egy lépcsőfok volt: ennyi aprócska EGY icike. De 10 icikét kérdeztek!" }, 40: { m: "Ez egy lépcsőfok volt: a 10 icike 40 picike. De aprócskában kérdezték!" } },
          csap: { 50: { m: "A picikéket kihagytad: egy icikében 4 picike van.", jelol: [null, "1 icike = 4 picike"] }, 9: { m: "Ezt összeadtad. De 1 icike 4 picike, és mindegyik picike 5 aprócska." },
                  90: { m: "Ezt összeadtad. De 1 icike 4 picike, és mindegyik picike 5 aprócska." } } },
    mit: ["hány aprócska a 10 icike", "hány aprócska egy icike", "hány picike a 10 icike"],
    elso: "Kezdd egyetlen icikével! Hány picike az? És az hány aprócska? Ha egy icikét már tudod, a 10 icike könnyű.",
    kicsi: [{ mondatok: ["A törpök a picikét és az aprócskát is használják."], kerdes: "Hány aprócskával egyenlő 3 picike, ha 1 picike = 5 aprócska?", helyes: 15, oe: { csap: { 8: { m: "Ezt összeadtad. De minden picike 5 aprócska." } } } },
            { mondatok: ["{0}"], kerdes: "Hány aprócskával egyenlő 2 icike, ha 1 icike = 2 picike és 1 picike = 3 aprócska?", helyes: 12,
              oe: { koztes: { 6: { m: "Ez egy lépcsőfok volt: ennyi aprócska EGY icike. De 2 icikét kérdeztek!" }, 4: { m: "Ez egy lépcsőfok volt: a 2 icike 4 picike. De aprócskában kérdezték!" } } } }],
    vissza: "Ügyes! Ugyanaz, csak 10 icikével. Haladj lépcsőről lépcsőre, és csak a végén mondd ki!" }
};
/* Mekk Elek padlója: 7 × 7, a 11 szürke egy „3”-ast rajzol (az eredeti ábra szerint) */
var POLC_MEKK = [[1, 2], [1, 3], [1, 4], [2, 4], [3, 2], [3, 3], [3, 4], [4, 4], [5, 2], [5, 3], [5, 4]];
function polcRacs(r, c, szurke) {
  var s = '<svg class="op-rajz pm-padlo" viewBox="0 0 ' + (c * 22 + 8) + ' ' + (r * 22 + 8) + '">';
  for (var y = 0; y < r; y++) for (var x = 0; x < c; x++) {
    var sz = szurke.some(function (p) { return p[0] === y && p[1] === x; });
    s += '<rect x="' + (4 + x * 22) + '" y="' + (4 + y * 22) + '" width="22" height="22" fill="' + (sz ? "#b4b4b4" : "#fff") + '" stroke="#7a6a5a" stroke-width="1.4"/>';
  }
  return s + '</svg>';
}

/* ═════════════════ állapot + folytatás ═════════════════ */
function polcAllapot() { var p = P(); if (!p.polcAll || typeof p.polcAll !== "object") p.polcAll = {}; return p.polcAll; }
function polcFolytat() {                               /* kovAllomas hívja: ugyanazon a napon ott folytatja, ahol abbahagyta */
  var r = polcAllapot()[J.palya.id];
  if (r && r.d === helyiNap() && r.k > 0 && r.k < J.feladatDb) J.feladatKesz = r.k;
}
function polcHaladas(k) { if (J.palya.fok === "mester") return; polcAllapot()[J.palya.id] = { d: helyiNap(), k: k }; }
function polcIdx(id) { for (var i = 0; i < OLVASO_POLCOK.length; i++) if (OLVASO_POLCOK[i].id === id) return OLVASO_POLCOK[i]; return null; }
function polcMesterLista(polc) { var d = polcIdx(polc); return d && typeof ekMesterLista === "function" ? ekMesterLista(d.kocka).filter(function (id) { return !!POLC_MESTER[id]; }) : []; }
function polcSzalag(polc) { var d = polcIdx(polc); return !!(szerszamT(polc).m || (d && ekRegiMester(d.kocka))); }

/* ═════════════════ GENERÁLÁS ═════════════════ */
GEN.polc = function (cfg) {
  if (!J.polc || J.polc.palya !== J.palya.id) J.polc = { palya: J.palya.id, eredm: [], elozo: null, par: null, kezd: J.feladatKesz };
  return cfg.fok === "mester" ? polcMesterFeladat(cfg.polc) : polcPotty(cfg.polc, cfg.fok, J.feladatKesz);
};
function polcKeretek(polc) { return Object.keys(PM_KERET[polc]); }
function polcKeretValaszt(polc, fok, i, forma) {
  var R = POLC_REND[polc], L;
  if (i >= 15) L = [R.vegso[(i + (J.polc.vegsoEltol || 0)) % 2]];
  else L = (i < 5 ? R.elso : polcKeretek(polc)).filter(function (k) { return k !== J.polc.elozo; });
  if (polc === "KERES" && fok === "tekercs" && forma === "nyomoz") L = L.filter(function (k) { return k !== "het" && k !== "haz"; }).concat(i >= 15 ? ["csere"] : []);
  if (polc === "KERES" && fok === "tekercs" && forma === "lanc") L = L.filter(function (k) { return k !== "csere"; }).concat(i >= 15 ? ["haz"] : []);
  return ekE(L.length ? L : R.elso);
}
function polcPotty(polc, fok, i) {
  var R = POLC_REND[polc], forma = R[fok][i % 20], M = null, o, keret = null;
  if (J.polc.vegsoEltol == null) J.polc.vegsoEltol = ekR(0, 1);
  if (forma === "hl2" && !J.polc.par) forma = "hl";
  for (var t = 0; t < 80 && !M; t++) {
    if (forma === "hl2") { M = J.polc.par; keret = M.keret; break; }
    keret = polcKeretValaszt(polc, fok, i, forma);
    o = { tek: fok === "tekercs", lanc: forma === "lanc", nyomoz: forma === "nyomoz", egy: (forma === "hl" || forma === "hl1") && ekR(0, 1) === 1 };
    var x = pmKesz(o, PM_KERET[polc][keret](o));
    if (!x) continue;
    if (forma === "kirol" && !x.kirol) continue;
    if (forma === "mit" && !x.mitK) continue;
    M = x;
  }
  if (!M) { forma = "sima"; keret = R.elso[0]; for (t = 0; t < 200 && !M; t++) M = pmKesz({}, PM_KERET[polc][keret]({})); }
  if (forma === "hl") {                                  /* a pár másik tagja (ugyanaz a keret, a másik lépésszám) a következő pöttybe */
    var oo = { egy: !o.egy }, y = null;
    for (t = 0; t < 60 && !y; t++) y = pmKesz(oo, PM_KERET[polc][keret](oo));
    J.polc.par = y;
  } else if (forma === "hl2") J.polc.par = null;
  J.polc.elozo = keret;
  var L = liftUj({ sz: polc, palya: J.palya.id, fok: fok, fid: keret });
  L.nagy = i >= 15; L.kicsiJoKell = 1;
  J.polc.L = L; J.polc.kicsiHiba = 0;
  var N = polcNagy(M, polc, fok, L, forma);
  if (forma === "kopp") { N.op.kerdesHely = ekR(0, M.mondatok.length); N.op.rejt = true; N.keresKell = true; }
  if (forma === "nyomoz" && M.al) { N.keresAl = M.al; N.op.kerdes = pmFelszolit(M.kerdes); if (ekR(0, 1)) N.op.kerdesHely = Math.min(1, M.mondatok.length); }
  else if (forma === "nyomoz") { N.op.kerdesHely = Math.min(1, M.mondatok.length); }
  N.kartyaHTML = opKonyv(N.op);
  if (i === J.polc.kezd && i === 0) N.keresKell = true;    /* a pálya első feladata (2. döntés) */
  var elso = N;
  if (forma === "kirol" || forma === "mit") elso = polcKartyaLepes(N, forma === "kirol" ? POLC_M.kirol : POLC_M.mit, mKever((forma === "kirol" ? M.kirol : M.mitK).map(function (k) { return { h: k.h, jo: !!k.jo }; })), N);
  else if (forma === "hl" || forma === "hl1" || forma === "hl2") {
    var n = M.lep.length, lepK = '<small>' + M.lep.map(function (l, j) { return (j + 1) + ". " + l.k; }).join(" · ") + '</small>';
    elso = polcKartyaLepes(N, POLC_M.hl, [1, 2, 3].map(function (x) { return { h: '<span class="cimke">' + x + ' lépés</span>', jo: x === n, m: POLC_M.hlRossz + " " + lepK }; }), N);
  } else if (forma === "lanc" && M.lanc) elso = polcLancLepes(N, M);
  else if (forma === "lepcso") elso = polcLepcso(N, M, N, false);
  else if (forma === "kinek") elso = polcKinek(N, M);
  if (N.keresKell && elso !== N) { elso.keresKell = true; N.keresKell = forma === "kopp"; }
  return elso;
};
/* a NAGY beírás (a pötty fő kérdése) */
function polcNagy(M, polc, fok, L, forma) {
  var utolso = M.lep && M.lep.length ? M.lep[M.lep.length - 1] : null;
  var f = { csalad: "egyenkent", polc: polc, polcSzerep: "nagy", polcVeg: true, polcL: L, M: M, helyes: M.helyes, oe: M.oe, jegyMax: 3, lanc: null,
    op: { mondatok: M.mondatok, kerdes: M.kerdes, rajz: M.rajz, segit: true },
    szoveg: ekSima(M.kerdes), megoldas: utolso && utolso.m ? utolso.m : String(M.helyes), keplet: "", tipp: "",
    naplo: { tipus: "polc-" + polc.toLowerCase() + "-" + fok + "-" + M.keret + (forma ? "-" + forma : ""), kerdes: ekSima(M.kerdes).slice(0, 60), helyes: M.helyes, atlepes: false } };
  f.felolvas = ekKiejt(M.mondatok.concat([M.kerdes]).join(" "));
  f.kartyaHTML = opKonyv(f.op);
  return f;
}
/* koppintós elő-lépés (kártyák a válasz helyén), utána a nagy beírás jön (lanc) */
function polcKartyaLepes(N, cim, kartyak, kov) {
  var jo = kartyak.filter(function (k) { return k.jo; })[0];
  return { csalad: "egyenkent", polc: N.polc, polcSzerep: "kartya", polcN: N, kartyak: kartyak, cim: cim, helyes: 1, joKiir: jo ? ekSima(jo.h) : "", op: N.op, kartyaHTML: N.kartyaHTML,
    szoveg: cim, felolvas: N.felolvas, megoldas: jo ? ekSima(jo.h) : "", keplet: "", tipp: "", lanc: kov ? [kov] : null,
    naplo: { tipus: N.naplo.tipus + "-kartya", kerdes: cim.slice(0, 60), helyes: jo ? ekSima(jo.h) : "", atlepes: false } };
}
/* 🔗 a lánc 1. kérdése: ugyanaz a mese, a nagy a 2. kérdés */
function polcLancLepes(N, M) {
  var L2 = M.lanc, q1 = { csalad: "egyenkent", polc: N.polc, polcSzerep: "lanc1", polcN: N, helyes: M.helyes, oe: M.oe, jegyMax: 3, op: { mondatok: M.mondatok, kerdes: M.kerdes, rajz: M.rajz, kerdesHely: N.op.kerdesHely },
    szoveg: ekSima(M.kerdes), felolvas: N.felolvas, megoldas: M.lep && M.lep[0] && M.lep[0].m ? M.lep[0].m : String(M.helyes), keplet: "", tipp: "", lanc: [N],
    naplo: { tipus: N.naplo.tipus + "-1", kerdes: ekSima(M.kerdes).slice(0, 60), helyes: M.helyes, atlepes: false } };
  q1.kartyaHTML = opKonyv(q1.op);
  N.helyes = L2.helyes; N.oe = L2.oe; N.M = { mondatok: M.mondatok, kerdes: L2.kerdes, helyes: L2.helyes, lep: (M.lep || []).concat(L2.lep || []), mit: L2.mit || M.mit, keret: M.keret, rajz: M.rajz,
    kicsi: { mondatok: M.mondatok, kerdes: M.kerdes, helyes: M.helyes, oe: M.oe, vissza: "Ügyes! És most a második kérdés: " + ekSima(L2.kerdes).replace(/^És /, "") } };   /* a lánc kicsije = az 1. kérdés */
  N.op = { mondatok: M.mondatok, kerdes: L2.kerdes, rajz: M.rajz, segit: true, lepcso: '<p class="op-lepcso-kesz">1. ' + M.kerdes + ' <b>✓ ' + M.helyes + '</b></p>' };
  N.szoveg = ekSima(L2.kerdes); N.felolvas = ekKiejt("Ügyes! És most: " + ekSima(L2.kerdes)); N.opCsakKerdes = true;
  var ul = L2.lep && L2.lep.length ? L2.lep[L2.lep.length - 1] : null; N.megoldas = ul && ul.m ? ul.m : String(L2.helyes);
  N.naplo.kerdes = ekSima(L2.kerdes).slice(0, 60); N.naplo.helyes = L2.helyes;
  N.kartyaHTML = opKonyv(N.op);
  return q1;
}
/* 🪜 lépcsőfok: minden lépés beírás → ✋ „Ez már a válasz?” — a végén a csúcs. kov: ahova a csúcs után megy (a nagy, vagy a lift után vissza) */
function polcLepcso(N, M, vegCel, fuzet) {
  var n = M.lep.length, lanc = [], kesz = [];
  function sor(j, most) {
    return M.lep.slice(0, j).map(function (l, x) { return '<p class="op-lepcso-kesz">' + (x + 1) + '. ' + l.k + ' <b>✓ ' + l.v + '</b> <span class="op-nem">✋ még nem</span></p>'; }).join("") +
      (most ? '<p class="op-lepcso-most">' + (j + 1) + '. ' + M.lep[j].k + '</p>' : "");
  }
  for (var j = 0; j < n; j++) {
    var l = M.lep[j], utolso = j === n - 1, opS = polcOpFuzet(N, M, fuzet, sor(j, true));
    var S = { csalad: "egyenkent", polc: N.polc, polcSzerep: fuzet ? "kicsi" : "lepes", polcN: N, helyes: l.v, oe: utolso ? M.oe : null, jegyMax: 3, op: opS,
      szoveg: ekSima(l.k), felolvas: ekKiejt((j === 0 ? M.mondatok.join(" ") + " A kérdés: " + ekSima(M.kerdes) + " Lépésről lépésre! " : "") + l.k), lepFel: ekKiejt(l.k),
      megoldas: l.m || String(l.v), keplet: "", tipp: "", lanc: null, naplo: { tipus: N.naplo.tipus + "-lepcso", kerdes: ekSima(l.k).slice(0, 60), helyes: l.v, atlepes: false } };
    if (j > 0) S.csakLepes = true;
    S.kartyaHTML = opKonyv(S.op);
    var opT = polcOpFuzet(N, M, fuzet, sor(j, false) + '<p class="op-lepcso-most">' + (j + 1) + '. ' + l.k + ' <b>✓ ' + l.v + '</b></p>');
    var K = [{ h: ekTk("👍", "Igen"), cls: "ek-in igen", jo: utolso, m: utolso ? null : "Még nem! A kérdés: „" + ekSima(M.kerdes) + "” — " + ekA(l.v) + " még csak " + (l.nev || "egy lépcsőfok") + "." },
             { h: ekTk("✋", "Nem"), cls: "ek-in nem", jo: !utolso, nemUtolso: utolso, utan: utolso ? null : "Így van! Mit kell még kiszámolni?" }];
    var C = polcKartyaLepes(N, '<span class="ek-kez">✋</span> ' + ekA(l.v, true) + ' — ' + POLC_M.lepcso, K, null);
    C.op = opT; C.kartyaHTML = opKonyv(opT); C.polcSzerep = fuzet ? "kicsi" : "kartya"; C.csakLepes = true; C.lepFel = POLC_M.lepcso;
    if (utolso) { C.utoSiker = "Igen! Felértél a lépcső tetejére!"; if (vegCel === N && !fuzet) { C.polcVeg = true; C.polcL = N.polcL; } }
    lanc.push(S, C);
  }
  for (j = 0; j < lanc.length - 1; j++) lanc[j].lanc = [lanc[j + 1]];
  var veg = lanc[lanc.length - 1];
  if (fuzet) { veg.polcKicsiVeg = true; veg.lanc = null; }
  else if (vegCel !== N) veg.lanc = [vegCel];
  return lanc[0];
}
function polcOpFuzet(N, M, fuzet, lepcso) {
  if (!fuzet) return { mondatok: M.mondatok, kerdes: M.kerdes, rajz: M.rajz, lepcso: lepcso };
  return { mondatok: N.op.mondatok, kerdes: N.op.kerdes, rajz: M.rajz || N.op.rajz, fuzet: { mondatok: M.mondatok, kerdes: M.kerdes, lepcso: lepcso } };
}
/* 🐰🦊 Kinek van igaza? — Pali és Juli a rajz-lapon; kb. minden negyedikben senkinek */
function polcKinek(N, M) {
  var kz = Object.keys(M.oe.koztes).map(Number), cs = Object.keys(M.oe.csap).map(Number);
  if (!kz.length) return N;
  var mod = ekR(0, 3) === 0 && kz.length + cs.length >= 2 ? 2 : ekR(0, 1), mond = [], NEV = ["Pali", "Juli"], EM = [FIGURA.pali.e, FIGURA.juli.e];
  function jel(v) { var k = M.oe.koztes[v]; if (k) return typeof k === "string" ? k : ekSima(k.m).replace(/^Ez egy lépcsőfok volt: /, "").replace(/\..*$/, ""); var c = M.oe.csap[v]; return c ? "tévedés" : ""; }
  if (mod === 2) { var a = kz[0], b = kz[1] != null ? kz[1] : cs[0]; mond = mKever([a, b]); }
  else { mond[mod] = M.helyes; mond[1 - mod] = ekE(kz); }
  var K = [0, 1].map(function (i) {
    var v = mond[i], jo = mod === i;
    return { h: ekTk(EM[i], NEV[i], null, '<span class="mond">' + v + '</span>'), cls: "ek-fig", jo: jo,
      m: jo ? null : NEV[i] + " " + ekRag(v, "t") + " mondott. Mi " + ekA(v) + "? " + ekNagy(jel(v) || "Nem ezt kérdezték") + ". Ezt kérdezték?",
      utan: jo ? NEV[1 - i] + " félúton megállt: " + ekA(mond[1 - i]) + " " + (jel(mond[1 - i]) || "nem a válasz") + "." : null };
  });
  K.push({ h: ekTk("🤷", "Senkinek", "és megmondom a jót"), jo: mod === 2, m: mod === 2 ? null : "Nézd meg újra – valamelyikük jól számolt!" });
  var C = polcKartyaLepes(N, M.kerdes + '<span class="kis"> ' + POLC_M.kinek + '</span>', K, mod === 2 ? N : null);
  if (mod === 2) { N.op.kerdes = "Senkinek sincs igaza! Mennyi a jó válasz? " + M.kerdes; N.kartyaHTML = opKonyv(N.op); N.opElo = "Így van, mindketten tévedtek!"; N.opCsakKerdes = true; }
  else { C.polcVeg = true; C.polcL = N.polcL; }
  C.kinek = true;
  return C;
}

/* ═════════════════ 🏅 MESTERPRÓBA ═════════════════ */
function polcMesterKiv(polc) { var L = polcMesterLista(polc); return L.length ? szMesterValaszt(polc, L) : null; }
function polcMondatok(sz) { return String(sz).replace(/\s+/g, " ").trim().split(/(?<=[.?!])\s+(?=[A-ZÁÉÍÓÖŐÚÜŰ0-9(„])/); }
function polcMesterFeladat(polc) {
  var fid = polcMesterKiv(polc), F = fid && FT.feladatok[fid], D = POLC_MESTER[fid];
  if (!F || !D) { J.polc.nincsMester = true; return polcPotty(polc, "mese", 15); }
  var S = polcMondatok(F.szoveg), qi = -1;
  for (var i = S.length - 1; i >= 0; i--) if (/\?$/.test(S[i])) { qi = i; break; }
  if (qi < 0) qi = S.length - 1;
  var kerdes = S[qi], mondatok = S.filter(function (x, i) { return i !== qi; });
  var helyes = +String(F.valaszok[F.helyes]).replace(/\D/g, "");
  var oe = { szo: D.szo, koztes: D.oe.koztes || {}, masik: D.oe.masik || {}, csap: {} };
  for (var n in D.oe.csap || {}) { var c = D.oe.csap[n], jl = c.jelol; oe.csap[n] = { m: c.m, jelol: jl && jl[0] == null ? polcJelolKeres(mondatok, jl[1]) : jl }; }
  var lep = (F.lepesek || []).map(function (l) { var e = +String(l.eredmeny).replace(/\D/g, ""); return { k: l.szoveg, v: e, m: String(l.muvelet || "").replace("?", l.eredmeny) }; }).filter(function (l) { return l.v > 0; });
  var rajz = D.padlo ? polcRacs(7, 7, POLC_MEKK) : pmRajz(D.rajz || []);
  var M = { keret: "mester", mondatok: mondatok, kerdes: kerdes, helyes: helyes, oe: oe, lep: lep, mit: D.mit, rajz: rajz, fid: fid };
  var L = liftUj({ sz: polc, palya: J.palya.id, fok: "mester", fid: fid });
  L.nagy = true; L.kicsiJoKell = 2; J.polc.L = L; J.polc.mesterFid = fid; J.polc.kicsiHiba = 0;
  var N = polcNagy(M, polc, "mester", L);
  N.mester = D; N.op.segit = false; N.op.mester = true; N.kartyaHTML = opKonyv(N.op);
  N.opElo = POLC_M.mester; N.jegyMax = 4;
  return N;
}
function polcJelolKeres(mondatok, resz) { for (var i = 0; i < mondatok.length; i++) if (mondatok[i].indexOf(resz) >= 0) return [i, resz]; return null; }

/* ═════════════════ MEGJELENÍTÉS (feladatMutat hívja) ═════════════════ */
function polcMutat(f) {
  opMod(true);
  $("buborek-feladat").innerHTML = opKonyv(f.op);
  if (f.vezetSor) { opLepesLap(); f.vezetSor.forEach(function (h) { opLepes(h); }); if (f.vezetMost) opLepes("<b>" + f.vezetMost + "</b>"); }
  opLapol();
  mKoppRejt();
  var v = $("visszajelzes");
  if (f.opElo) { v.className = "visszajelzes"; v.textContent = "🦉 " + f.opElo; }
  if (f.kartyak) polcKartyaMutat(f); else modBeallit();
  var utana = function () { if (!J || J.feladat !== f) return; if (polcKeresKell(f)) polcKeres(f); };
  if (f.vezetSor) { mondd(ekKiejt((f.opElo ? f.opElo + " " : "") + (f.vezetMost || "")), utana); f.opElo = null; return; }
  if (f.csakLepes || f.opCsakKerdes) { mondd(ekKiejt((f.opElo ? f.opElo + " " : "") + (f.lepFel || ekSima(f.op.kerdes))), utana); f.opElo = null; return; }
  opFelolvas(f, function () { if (f.lepFel && !f.csakLepes) mondd(f.lepFel, utana); else if (f.kartyak && f.cim) mondd(ekKiejt(f.cim), utana); else utana(); });
}
function polcKeresKell(f) { return !f.oeKeresVolt && !f.vezet && (f.keresKell || f.liftKeres); }
function polcKeres(f) {
  if (!J || J.feladat !== f) return;
  oeKeres(f, { szo: (f.oe && f.oe.szo) || (f.M && f.M.szo) || "", al: f.keresAl || (f.polcN && f.polcN.keresAl) || null });
}
/* ertekel elejéről: amíg a 🔎 kérdés-keret vár, nem lehet válaszolni */
function polcZar(f) {
  if (!f || !f.polc) return false;
  if (oeKeresFut() && OE.keres && !OE.keres.o.lagy) { mondd("Előbb koppints a kérdésre!"); return true; }
  if (polcKeresKell(f)) { opOlvasAll(); polcKeres(f); return true; }   /* a felolvasás alatt gyorsan válaszolt: előbb a kérdés */
  return false;
}
function polcKartyaMutat(f) {
  var p = mKoppPanel();
  if (!p.__polc) { p.__polc = true; p.addEventListener("click", polcKartyaKatt); }
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  $("mondom-gomb").style.display = "none"; $("beiras-valt").style.display = "none";
  J.polcKartya = { f: f, hiba: 0, kesz: false };
  p.innerHTML = '<div class="ek-tabla">' + f.cim + '</div><div class="kartyak ek-kartyak">' +
    f.kartyak.map(function (k, i) { return '<button class="ek-tk ' + (k.cls || "") + '" data-i="' + i + '">' + k.h + '</button>'; }).join("") + '</div>';
  p.hidden = false;
}
function polcKartyaKatt(ev) {
  var b = ev.target.closest ? ev.target.closest("[data-i]") : null, K = J && J.polcKartya;
  if (!b || !K || K.kesz || !J.feladat || J.feladat !== K.f || b.classList.contains("kiszurkul")) return;
  if (polcZar(K.f)) return;
  var f = K.f, k = f.kartyak[+b.getAttribute("data-i")], v = $("visszajelzes"), p = $("valasz-kartyak");
  hangGomb();
  if (k.jo || k.nemUtolso) {
    K.kesz = true; b.classList.add("jo");
    Array.prototype.forEach.call(p.querySelectorAll(".ek-tk"), function (x) { if (x !== b) x.classList.add("kiszurkul"); });
    if (k.nemUtolso) {                                   /* a csúcson a „Nem”: nem hiba, csak nem elsőre jó */
      J.probak = Math.max(J.probak, 1); f.utoMondat = "Pedig ez már az! Épp ezt kérdezték. Felértél a lépcső tetejére!";
    } else if (k.utan) f.utoMondat = k.utan;
    else if (f.utoSiker) f.utoMondat = f.utoSiker;
    f.joKiir = ekSima(k.h);
    setTimeout(function () { if (J && J.feladat === f) ertekel(f.helyes); }, 380);
    return;
  }
  mBillegHalvany(b);
  rosszValaszKonyvel(f, ekSima(k.h).slice(0, 40)); K.hiba++; J.polc.kicsiHiba++;
  if (f.polcN && f.polcN.polcL && f.polcSzerep !== "kicsi") f.polcN.polcL.seg = Math.max(f.polcN.polcL.seg, 2);
  var msg = k.m || "Nézd meg újra!";
  if (K.hiba >= 2) {
    var jb = p.querySelector('.ek-tk[data-i="' + f.kartyak.map(function (x) { return !!x.jo; }).indexOf(true) + '"]'); if (jb) jb.classList.add("ek-sug");
    opKerdesVillan();
  }
  v.className = "visszajelzes ek-csapda"; v.innerHTML = msg; mondd(ekKiejt(msg));
  figArc("gondol"); ment();
}

/* ═════════════════ JÓ VÁLASZ (ertekel hívja, mielőtt a láncot nézi) ═════════════════ */
function polcDicser(f, elsore) {
  if (f.vezet) return "Most már megy!";
  var oj = oeDicser(f); if (oj) return oj;
  if (f.polcSzerep !== "nagy" && !f.polcVeg) return elsore ? "Ez az!" : "Így már jó!";
  if (!elsore) return POLC_M.tippJo;
  return ekE(POLC_DICSER[f.polc] || ["Ez az!"]);
}
function polcJo(f, elsore) {
  if (!elsore && f.polcN && f.polcN.polcL && f.polcSzerep !== "kicsi" && f.polcSzerep !== "nagy" && !f.vezet) f.polcN.polcL.seg = Math.max(f.polcN.polcL.seg, 2);
  if (f.polcKicsiVeg) {                                  /* a lift kicsije kész → még egy testvér, vagy vissza a nagyra */
    var N = f.polcN, L = N.polcL, r = liftKicsi(L, !J.polc.kicsiHiba && elsore);
    J.polc.kicsiHiba = 0;
    var tv = N.mester && N.mester.kicsi, kov = tv && L.kicsi < tv.length ? L.kicsi : -1;
    if (r === "kicsi" && kov >= 0) { var k2 = polcKicsiFeladat(N, kov); k2.opElo = "Még egy ilyen!"; f.lanc = [k2]; return; }
    L.bent = false;
    if (r === "vegig") { f.lanc = [polcVegigLanc(N)]; return; }
    N.opElo = N.polcVissza || "Ügyes! Most jöhet a nagy feladat."; N.liftKeres = false; f.lanc = [N];
    return;
  }
  if (f.polcVeg) {
    var L2 = f.polcL || (f.polcN && f.polcN.polcL);
    if (L2) { if (!f.vezet) liftJo(L2); var ki = liftNagyKesz(L2, !f.vegigVolt); if (ki) J.polc.eredm.push(ki); }
    polcHaladas(J.feladatKesz + 1);
  }
}

/* ═════════════════ ROSSZ VÁLASZ (ertekel hívja, a 🔎/✋ jelzés után) ═════════════════ */
function polcHiba(f, valasz) {
  var v = $("visszajelzes");
  if (f.vezet) {
    if (J.probak === 1) { v.className = "visszajelzes rossz"; v.textContent = "Nem " + valasz + ". Számold ki újra!"; mondd("Nem talált. Számold ki újra!", kezNelkulUjra); }
    else { v.className = "visszajelzes rossz"; v.textContent = "Nézd: " + f.megoldas + ". Most írd be te!"; mondd(ekKiejt("Nézd: " + f.megoldas + ". Most írd be te!"), kezNelkulUjra); }
    return;
  }
  if (f.polcSzerep === "kicsi" || f.polcSzerep === "lanc1" || f.polcSzerep === "lepes") J.polc.kicsiHiba++;
  if (f.polcSzerep === "lepes" && f.polcN && f.polcN.polcL) f.polcN.polcL.seg = Math.max(f.polcN.polcL.seg, 2);
  if (f.polcSzerep === "nagy" && f.polcL && !f.vegigVolt) {
    var r = liftRossz(f.polcL);
    if (r === "lift") { polcLiftIndul(f); return; }
    if (r === "vegig") { polcVegig(f); return; }
  } else if (J.probak >= 2) {                         /* kicsi, lépcsőfok, lánc 1. kérdése: a 2. rossz után megmutatja */
    v.className = "visszajelzes rossz"; v.textContent = "Semmi baj! Nézd: " + f.megoldas + ". Most írd be te!";
    mondd(ekKiejt("Semmi baj! Nézd: " + f.megoldas + ". Most írd be te!"), kezNelkulUjra);
    return;
  }
  polcTipp(f, valasz);
}
function polcTipp(f, valasz) {
  var v = $("visszajelzes"), o = oeOsztaly(f, valasz);
  if (!f.oe) o = { fajta: "ismeretlen", m: "Nem " + valasz + ". Számold ki újra!" };
  opJelolTorol();
  if (o.fajta === "csap" || o.fajta === "koztes" || o.fajta === "masik") {
    if (o.jelol && o.jelol[0] != null) opJelol(o.jelol[0], o.jelol[1]);
    v.className = "visszajelzes ek-csapda"; v.innerHTML = o.m; mondd(ekKiejt(o.m.replace(/^🔎\s*/, "")), kezNelkulUjra);
  } else {
    var m = f.oe ? "Nem " + valasz + ". " + (o.m || OE_M.ism) : o.m;
    v.className = "visszajelzes rossz"; v.textContent = m; opKerdesVillan();
    mondd(ekKiejt(m + (f.oe ? " " + ekSima(f.op.fuzet ? f.op.fuzet.kerdes : f.op.kerdes) : "")), kezNelkulUjra);
  }
}

/* ═════════════════ 🛗 LIFT ═════════════════ */
function polcKicsiFeladat(N, idx) {
  var M = N.M, K;
  if (N.mester) {
    var T = N.mester.kicsi[idx], mon = (T.mondatok || []).map(function (s) { return s === "{0}" ? (N.M.mondatok[0] || "") : s; }).filter(Boolean);
    K = { mondatok: mon, kerdes: T.kerdes, helyes: T.helyes, oe: { szo: "", koztes: (T.oe && T.oe.koztes) || {}, masik: (T.oe && T.oe.masik) || {}, csap: {} }, rajz: T.padlo ? pmPadlo(T.padlo[0], T.padlo[0], [[T.padlo[1], "#b4b4b4"]]) : null };
    for (var n in (T.oe && T.oe.csap) || {}) { var c = T.oe.csap[n]; K.oe.csap[n] = { m: c.m, jelol: c.jelol && c.jelol[0] == null ? polcJelolKeres(mon, c.jelol[1]) : c.jelol }; }
    N.polcVissza = N.mester.vissza;
  } else if (N.polc === "VALASZ") {
    var Mk = null, o = { kis: true };
    for (var t = 0; t < 80 && !Mk; t++) Mk = pmKesz(o, PM_VALASZ[M.keret](o));
    if (!Mk) Mk = M;
    N.polcVissza = POLC_M.liftValasz;
    var e = polcLepcso(N, Mk, N, true);
    e.liftKeres = true;
    return e;
  } else {
    K = M.kicsi; N.polcVissza = K.vissza;
  }
  var f = { csalad: "egyenkent", polc: N.polc, polcSzerep: "kicsi", polcKicsiVeg: true, polcN: N, helyes: K.helyes, oe: K.oe, jegyMax: 3, lanc: null, liftKeres: true,
    op: { mondatok: N.op.mondatok, kerdes: N.op.kerdes, rajz: K.rajz || N.op.rajz, fuzet: { mondatok: K.mondatok, kerdes: K.kerdes } },
    szoveg: ekSima(K.kerdes), megoldas: String(K.helyes), keplet: "", tipp: "",
    naplo: { tipus: N.naplo.tipus + "-kicsi", kerdes: ekSima(K.kerdes).slice(0, 60), helyes: K.helyes, atlepes: false } };
  f.felolvas = ekKiejt(K.mondatok.concat([K.kerdes]).join(" "));
  f.kartyaHTML = opKonyv(f.op);
  return f;
}
function polcLiftIndul(N) {
  opOlvasAll(); figyelStop();
  J.polc.kicsiHiba = 0;
  var k = polcKicsiFeladat(N, 0);
  k.opElo = liftMondat("indul");
  J.lancKov = k;
  $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "";
  setTimeout(function () { if (J && J.lancKov === k) ujFeladat(); }, 350);
}

/* ═════════════════ VÉGIGVEZETÉS — a könyv második lapján ═════════════════ */
function polcVegigLanc(N) {
  if (N.polcL) liftVegig(N.polcL);
  N.vegigVolt = true;
  var M = N.M, sor = [], mit = (M.mit || []).slice(0, 3), lep = (M.lep || []).slice(0, -1);
  var kozos = { vezetSor: sor };
  function vez(f) { f.vezet = true; f.vezetSor = sor; f.op = N.op; f.kartyaHTML = N.kartyaHTML; return f; }
  var lanc = [];
  if (mit.length) {
    var K = mKever(mit.map(function (t, i) { return { h: '<span class="cimke">' + t + '</span>', jo: i === 0, cls: "ek-mit" }; }));
    var C = vez(polcKartyaLepes(N, "Mit kérdeznek?", K, null)); C.vezetMost = "1. Mit kérdeznek?"; C.utoSor = "1. Mit kérdeznek? <b>" + mit[0] + "</b>";
    lanc.push(C);
  }
  if (N.mester && N.mester.elso) lanc.length && (lanc[0].opElo = N.mester.elso);
  lep.forEach(function (l, i) {
    var S = vez({ csalad: "egyenkent", polc: N.polc, polcSzerep: "vezet", polcN: N, helyes: l.v, oe: null, jegyMax: 4, lanc: null, szoveg: ekSima(l.k), felolvas: ekKiejt(l.k),
      megoldas: l.m || String(l.v), keplet: "", tipp: "", naplo: { tipus: N.naplo.tipus + "-lepes", kerdes: ekSima(l.k).slice(0, 60), helyes: l.v, atlepes: false } });
    S.vezetMost = (lanc.length + 1) + ". " + l.k; S.utoSor = S.vezetMost + " <b>" + (l.m || l.v) + "</b> <span class=\"op-nem\">✋ még nem a válasz</span>";
    lanc.push(S);
  });
  N.vezet = true; N.vezetSor = sor; N.vezetMost = "Most újra a kérdés: " + ekSima(N.op.kerdes); N.opElo = null; N.liftKeres = false;
  lanc.push(N);
  for (var i = 0; i < lanc.length - 1; i++) lanc[i].lanc = [lanc[i + 1]];
  lanc[0].opElo = lanc[0].opElo || POLC_M.vezet;
  void kozos;
  return lanc[0];
}
function polcVegig(N) {
  opOlvasAll(); figyelStop();
  var e = polcVegigLanc(N);
  J.lancKov = e;
  var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 " + POLC_M.vezet;
  setTimeout(function () { if (J && J.lancKov === e) ujFeladat(); }, 350);
}
/* a végigvezetés egy lépése kész → beíródik a lap sorába (ertekel jó ágából, a lánc előtt) */
function polcVezetJo(f) { if (f.vezetSor && f.utoSor) f.vezetSor.push(f.utoSor); }

/* ═════════════════ 🙋 a könyv fejlécében ═════════════════ */
function polcSegitMenu(menu) {
  var f = J && J.feladat, L = f && f.polcL; if (!f || !menu) return;
  if (!menu.hidden) { menu.hidden = true; return; }
  var h = '<button type="button" class="kis-gomb" data-s="mit">🔎 Mit kérdeznek?</button>';
  if (f.polcSzerep === "nagy" && L && !L.lift && !f.vegigVolt && szerszamBeall().liftKer) h += '<button type="button" class="kis-gomb" data-s="kicsi">🔎 Nézzük kicsiben</button>';
  menu.innerHTML = h; menu.hidden = false;
}
(function () {
  function bekot() {
    var b = $("buborek-feladat"); if (!b || b.__polc) return; b.__polc = true;
    b.addEventListener("click", function (ev) {
      var f = J && J.feladat; if (!f || !f.polc) return;
      var t = ev.target.closest ? ev.target.closest("button") : null; if (!t) return;
      var menu = b.querySelector(".op-segitmenu");
      if (t.classList.contains("op-segit")) { hangGomb(); polcSegitMenu(menu); return; }
      var s = t.getAttribute("data-s"); if (!s || !menu || !menu.contains(t)) return;
      hangGomb(); menu.hidden = true;
      if (s === "mit") { if (f.polcL && f.polcSzerep === "nagy") liftSegitseg(f.polcL, 1); opOlvasAll(); oeKeres(f, { szo: (f.oe && f.oe.szo) || "", al: f.keresAl || null }); }
      else if (s === "kicsi" && f.polcL && liftKer(f.polcL) === "lift") polcLiftIndul(f);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bekot); else setTimeout(bekot, 0);
})();

/* ═════════════════ A PÁLYA VÉGE (palyaVege hívja) ═════════════════ */
function polcPalyaVege() {
  var pa = J.palya, E = (J.polc && J.polc.eredm) || [], d = polcIdx(pa.polc), html = "", mondat = "", mesterKocka = false, ujKocka = false;
  delete polcAllapot()[pa.id];
  var lada = E.some(function (x) { return x && x.ladaba; });
  if (pa.fok === "mester") {
    var x = E[0] || null, L = J.polc && J.polc.L;
    if (x && x.e === "o" && L && L.elso !== false) {
      mesterKocka = true; ujKocka = ekKockaBe(d.kocka);
      if (!szerszamT(pa.polc).m) { szerszamT(pa.polc).m = szerszamNap(); }
      P().csillampor += EK_MESTER_CSILLA; J.futoCsilla += EK_MESTER_CSILLA;
      P().tunderharmat = (P().tunderharmat || 0) + EK_MESTER_HARMAT;
      var lista = ekKockaLista();
      html += '<div class="ek-var-nagy">' + ekKockavarNagySVG(lista, ujKocka ? lista.length - 1 : -1) + '</div>' +
        '<span class="ek-vege">🏅 Mesterpróba kész!' + (ujKocka ? " Új kocka repült a Kockavárba!" : " A kockád ott ragyog a Kockavárban.") + ' +' + EK_MESTER_CSILLA + ' ✨ · 💧 +' + EK_MESTER_HARMAT + '</span>';
      mondat += " Mesterpróba kész!" + (ujKocka ? " Új kocka repült a Kockavárba!" : "");
    } else if (J.polc && J.polc.nincsMester) {
      html += '<br><span class="ek-vege">🏅 A Mesterpróba hamarosan kinyílik. Addig ez is jó gyakorlás volt!</span>';
    } else {
      html += '<br><span class="ek-vege">🏅 Ügyes, együtt sikerült! A kocka a következő Mesterpróbánál vár rád.</span>';
      mondat += " Ügyes, együtt sikerült! A kocka a következő Mesterpróbánál vár rád.";
    }
  } else {
    var t = pa.fok === "tekercs" ? "📜 Kész a varázstekercs!" : "📖 Kész a mesekönyv!";
    html += '<br><span class="ek-vege">' + t + " " + (lada ? "" : d.ikon + " A „" + d.nev + "” tábla fényesebb lett.") + '</span>';
    mondat += " " + t.replace(/^\S+ /, "") + (lada ? "" : " A " + d.nev + " tábla fényesebb lett.");
  }
  if (lada) {
    szerszamTar().ujLada = pa.polc;
    html += '<br><span class="ek-vege">🧰 Ezt már tudod! A ' + d.ikon + ' a ládába került.</span>';
    mondat += " Ezt már tudod! A " + d.nev + " a ládába került.";
  }
  ment();
  return { html: html, mondat: mondat, kocka: ujKocka, adat: { polc: pa.polc, fok: pa.fok, eredm: E.map(function (x) { return x ? x.e : ""; }).join(""), mester: mesterKocka ? 1 : 0, lada: lada ? 1 : 0, fid: (J.polc && J.polc.mesterFid) || "" } };
}
/* a vége-képernyő „következő” gombja: 📖 → 📜 → 🏅, a Mesterpróba után vissza a polchoz */
function polcKovetkezo(id) {
  var pa = palyaKeres(id); if (!pa) return null;
  var fok = { mese: "tekercs", tekercs: "mester" }[pa.fok]; if (!fok) return null;
  if (fok === "mester" && !polcMesterLista(pa.polc).length) return null;
  var k = palyaKeres("polc-" + pa.polc.toLowerCase() + "-" + fok);
  return k && !palyaRejtve(k) ? k.id : null;
}

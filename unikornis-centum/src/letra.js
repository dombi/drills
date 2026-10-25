/* ============ 6h3) 🪜 ROKON-LÉTRA — a létra képe és játékmenete (Pálya-hely B kör, 2026-10-25) ============
   Terv: terv/palyahely-targykeret-terv.html 8. pont + terv/eletszeru-100-as-palyak-terv.html 4. pont · rajz: terv/palyahely-rajzterv.html 6. pont
   (✅ jóváhagyva; a létra menete a producer döntése, 2026-10-24). A feladatot a szamkor100.js gyártja (rokonLetraMenet, rokonSegit,
   rokonSajatEll), itt csak a kép és a kezelés van; a keretek (fok, tábla, ugrás) a közös keret.js-ből jönnek.
   MIT TANÍT? A 100-as körben nem kell elölről számolni: ha a 7 + 5 = 12 megvan, a 47 + 5 ugyanaz az ugrás, a tízes csak „utazik”,
   még az átlépés is öröklődik (67 + 5 = 72, nem 62). A létra a százas tábla egy oszlopa: egy fok = egy tízes.
   MIT CSINÁL A GYEREK A KÉPEN? A ház oldalán álló létra fokait tölti ki: ① az alap (7 + 5) · ② egy távoli rokon (47 + 5) ·
   ③ a létra magától kitölt néhány fokot, egyenként · ④ 3 hiányzó a távoli fölött, alulról felfelé (⬆️ csak felfelé — a producer,
   2026-10-25) · minden jó fok után az unikornis fellép oda · ⑤ végigvilágít,
   az unikornis felmászik. 5 válasz = 1 állomás (a gyerekek hamar elunják a 9 beírást). A válasz helye a tábla a létra mellett.
   Állomások (constants.js): Összeadás-létra (ugrás képével) · Más alappal (az ugrás csak hibánál) · Kivonás-létra (12 − 5 → 42 − 5)
   · Melyik segít? (3 fokból a rokon, aztán a nagy feladat) · Odú-küszöb (rövid létra · melyik segít · a csúcs: „Válassz te egy rokont!”:
   a gyerek egy üres fokra koppint — az lesz az ő rokona —, a fok kigyullad (39 + 6 = ?), és az eredményt írja a táblára; a producer
   döntése 2026-10-25: a beírós változat nem volt érthető, a gyerek az eredményt írta a fok eleje helyett).
   HIBÁNÁL a megoldást nem írjuk ki: 1. hiba → a fok mellett az ugrás alakja (a kerek tízes látszik, a cél „?”), és az alap fok
   felfénylik · 2. hibától → lépésenként: az első ugrás megérkezik, a második halad, a hang elmondja a lépéseket, a számot a gyerek mondja ki.
   🔒 Kiskapu: a fokok nem ismétlik a választ; a magától kitöltött fokért nem jár semmi; a választásért (melyik segít?) sem, csak a
   nagy feladat beírásáért; a „saját rokon” csak egész tízessel arrébb, a 100-on belül fogadható el.
   A kép a közös jelenet-motoron ül (jelenet.js: JELENETEK.letra — C kör 2. menet, 2026-10-25): a panelt, a táblát, a beírást, a
   billentyűzetet, a jót/rosszat a motor adja; itt csak a létra rajza, a menet és a két választás van. Napló: a tény-motor „r” formája. */

/* az ösvény sátrai (a pálya-kép a vásártér: vasar.js vasarJelenetSVG) — a létra-ház türkize */
VS_SZIN.rl1 = { teto: "#8fd6cf", csik: "#fff", sotet: "#3f8a85", cimer: "🪜" };
VS_SZIN.rl2 = { teto: "#a7d99a", csik: "#fff", sotet: "#5e9a52", cimer: "🪜" };
VS_SZIN.rl3 = { teto: "#c9a8e6", csik: "#fff", sotet: "#7a5ea8", cimer: "🪜" };
VS_SZIN.rl4 = { teto: "#fce49a", csik: "#fff", sotet: "#c9953a", cimer: "💡" };

var RL_FOK_X = 315, RL_UNI_X = 432, RL_UGRAS_X = 472, RL_TABLA = [690, 250, 122, 78];   /* az unikornis a jobb szár mellett mászik, az ugrás ezért jobbrább */
function rlY(i) { return 446 - i * 48; }
/* az állomás állapota a motor jlAllapot()-jában (J.jl): a létra menete, a kész fokok, a magától kitöltés */
function rlAllapot() {
  var st = jlAllapot();
  if (!st.letra) { st.letra = true; st.menet = null; st.kesz = {}; st.kitolt = -1; }
  return st;
}
function rlOpSzo(op) { return op === "-" ? " mínusz " : " meg "; }
/* a választás hibája (rossz kis fok, nem rokon fok) a pult naplójába kerül, de a tény-motorba NEM: a gyerek a nagy feladatot még
   meg sem próbálta (a „rokon” típust a tenyKulcs nem ismeri, így kimarad) */
function rlValasztNaplo(szoveg) { return { naplo: { tipus: "rokon", kerdes: szoveg, forma: "r" } }; }

/* ═════════════════ FELADAT (GEN.letra) ═════════════════
   cfg.forma: "letra" | "segit" | "vegyes" (Odú-küszöb: létra · létra · létra · segít · saját) · cfg.op: "+" | "-" | "vegyes" · cfg.kep: ugrás-kép az első kettőnél */
GEN.letra = function (cfg) {
  var st = rlAllapot(), i = J.feladatKesz, forma = cfg.forma, odu = forma === "vegyes", x, fk, M;
  if (odu) forma = i < 3 ? "letra" : i === 3 ? "segit" : "sajat";
  var op = cfg.op === "vegyes" ? (Math.random() < .5 ? "+" : "-") : cfg.op;
  if (forma === "letra") {
    if (!st.menet) st.menet = rokonLetraMenet({ op: op, hiany: odu ? 1 : 3 });
    M = st.menet; var k = Math.min(i, M.kerdes.length - 1);
    fk = M.fokok[M.kerdes[k]];
    x = { forma: "letra", lep: k, fok: M.kerdes[k], kep: !!cfg.kep && k <= 1, utolso: k === M.kerdes.length - 1 };
    return rlFeladat(x, fk, k === 0 ? "Kezdjük alulról: mennyi " + kfMuv(fk.a, fk.op, fk.b) + "?" : "Mennyi " + kfMuv(fk.a, fk.op, fk.b) + "?",
      (k === 0 ? "Kezdjük alulról! " : "") + "Mennyi " + szo(fk.a) + rlOpSzo(fk.op) + szo(fk.b) + "?");
  }
  if (forma === "segit") {
    var s = rokonSegit(cfg.op === "+" || cfg.op === "-" ? { op: cfg.op } : {});
    x = { forma: "segit", s: s, valasztva: false, kiesett: {} };
    return rlFeladat(x, { a: s.a, b: s.b, op: s.op, c: s.c, ugras: sk100Ugras(s.a, s.op, s.b), naplo: s.naplo },
      "Melyik kis feladat segít?", "Melyik kis feladat segít kiszámolni: " + szo(s.a) + rlOpSzo(s.op) + szo(s.b) + "?");
  }
  /* ✍️ saját rokon: egy új, üres létra, csak az alja van kint; a gyerek egy üres fokra koppint (rlSajatValaszt), a helyes szám a
     választott fokból jön — addig egy mintaérték áll ott (a 3. fok), hogy a feladatnak mindig legyen száma (gépi matek-őr) */
  M = st.sajat = rokonLetraMenet({ op: op, hiany: 0 });
  fk = M.fokok[0];
  x = { forma: "sajat", alap: fk, valasztott: null };
  return rlFeladat(x, { naplo: rlValasztNaplo("rokon: " + kfMuv(fk.a, fk.op, fk.b)).naplo, c: M.fokok[3].c }, "Válassz te egy rokont a létrán!", "Itt a " + szo(fk.a) + rlOpSzo(fk.op) + szo(fk.b) + ". Koppints egy üres fokra: az lesz a te rokonod!");
};
function rlFeladat(x, fk, kerdes, felolvas) {
  if (fk.ugras) { x.a = fk.a; x.b = fk.b; x.op = fk.op; x.c = fk.c; x.ugras = fk.ugras; }
  return { csalad: "jelenet", jelenet: "letra", rl: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(kerdes) + '</span>', szoveg: kerdes, felolvas: felolvas,
    helyes: fk.c, keplet: kerdes, tipp: "", naplo: fk.naplo };
}

/* ═════════════════ A KÉP (JELENETEK.letra — a váz a jelenet-motoré: panel, tábla, beírás, billentyűzet, jó/rossz) ═════════════════
   📱 keskeny kijelzőn (telefon, álló) a ház fala lemarad: a létra, az ugrás és a tábla nagyobb. Az unikornis a tábla alatt áll
   (nem takarja az ugrást), balra néz; kész létra után a következő feladatnál újra lent (JL.vege). */
JELENETEK.letra = {
  kep: function (L) { return { vb: L.keskeny ? "205 24 575 476" : "0 0 800 520", tabla: RL_TABLA, uni: [664, 496, .4, -1] }; },
  /* ③ a távoli rokon után: a létra magától kitölt, egyenként — a kezdést (rajz + felolvasás) a kép maga végzi */
  indit: function (L) {
    var f = L.f, x = f.rl, st = L.st, M = st.menet;
    if (x.forma === "segit") { L.ux = 664; L.uy = 496; }   /* a polcnál nincs létra: az unikornis a tábla alatt */
    else if (x.forma === "sajat") { L.ux = RL_UNI_X; L.uy = rlY(0) - 14; }   /* új létra: az alján áll, a kész alapon */
    if (!(x.forma === "letra" && x.lep >= 2 && st.kitolt < 0 && M.magatol.length)) return false;
    L.lezart = true; st.kitolt = 0;
    (function tolt() {
      if (JL !== L) return;
      jlRajz();
      if (st.kitolt < M.magatol.length) { st.kitolt++; if (!lkCsokkent()) hangCsilla(); setTimeout(tolt, lkCsokkent() ? 0 : 340); }
      else { L.lezart = false; jlRajz(); mondd(f.felolvas); jlFokusz(); }
    })();
    return true;
  },
  /* előbb választ (kis fok / saját fok), a tábla addig pihen */
  tablaAll: function (L) { var x = L.f.rl; return (x.forma === "segit" && !x.valasztva) || (x.forma === "sajat" && x.valasztott == null) ? "var" : ""; },
  tablaVarMondat: function (L) { return L.f.rl.forma === "segit" ? "Előbb koppints a kis feladatra, amelyik segít!" : "Előbb koppints egy üres fokra a létrán!"; },
  rajz: function (L) { return rlHaz() + (L.f.rl.forma === "segit" ? rlSegitRajz(L) : rlSzarak() + rlLetraRajz(L)); },
  katt: function (L, t) {
    var x = L.f.rl, k = t.closest ? t.closest(".rl-kartya") : null;
    if (k && x.forma === "segit" && !x.valasztva) { hangGomb(); rlValaszt(+k.getAttribute("data-i"), k); return; }
    var fo = t.closest ? t.closest(".rl-fok") : null;
    if (fo && x.forma === "sajat" && x.valasztott == null) { hangGomb(); rlSajatValaszt(+fo.getAttribute("data-i")); }
  },
  bekuld: function (L, v) {
    var f = L.f, x = f.rl, st = L.st;
    if (v === f.helyes) {
      var fok = x.forma === "letra" ? x.fok : x.forma === "sajat" ? x.valasztott : null;
      if (x.forma === "letra") st.kesz[x.fok] = true;
      if (x.forma === "letra" && x.utolso) { L.vege = true; jlJo(null, null, function (tovabb) { rlFelmaszik(L, fok, st.menet.fokok.length, tovabb); }); return; }
      if (fok != null) jlJo(null, null, function (tovabb) { jlUniSetal(RL_UNI_X, rlY(fok) - 14, tovabb); });   /* ⬆️ a jó fok mellé fellép (a létra jobb szárán: a fokok felirata látszik) */
      else jlJo();
      return;
    }
    L.rossz = String(v);
    jlRossz(v);
    jlRajz();
    var vj = $("visszajelzes"); vj.className = "visszajelzes rossz";
    if (L.seg >= 2) { vj.textContent = "Lépésenként!"; mondd(rlLepesMondat(x)); }
    else { vj.textContent = "Nézd meg az ugrást!"; mondd("Nézd meg az ugrást, és próbáld újra!"); }
    jlFokusz();
  },
  /* a gépi próba (kiskapu-őr): „melyik segít?”: a rokon kis fok · „válassz te egy rokont”: a 3. fok · különben a szám a táblára */
  gepi: function (L) {
    var f = L.f, x = f.rl, ks = function (i) { return '#jl-svg .rl-kartya[data-i="' + i + '"] rect'; };
    if (x.forma === "segit" && !x.valasztva) return { katt: [ks(x.s.jo)], rossz: ks((x.s.jo + 1) % 3) };
    if (x.forma === "sajat" && x.valasztott == null) return { katt: ['#jl-svg .rl-fok[data-i="3"] rect'] };
    return { gepel: f.helyes };
  }
};

/* ═════════════════ RAJZ ═════════════════ */
function rlHaz() {   /* a Rokon-létra türkiz tetős, magas háza, közelről (piac.js piacHaz „letra” színei) */
  return '<rect width="800" height="520" fill="url(#lt-gEgA)"/><path d="M0 478Q400 452 800 478V520H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>' +
    '<g transform="translate(120 486)" filter="url(#lt-firka)"><path d="' + pcFal(76, 404) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.4"/></g>' +
    '<g filter="url(#lt-firka)"><path d="M24 86Q78 44 120 18Q162 44 216 86Q120 78 24 86Z" fill="url(#lt-gTetoT)" stroke="#3f8a85" stroke-width="2.4" stroke-linejoin="round"/></g>' +
    pcAblak(94, 130, 52, 40, "url(#lt-gAblak)") + pcAblak(94, 236, 52, 40, "#cfe2f2") + pcAblak(94, 342, 52, 40, "url(#lt-gAblak)");
}
function rlSzarak() { return '<g filter="url(#lt-firka)"><path d="M222 492Q236 270 250 38M408 492Q394 270 380 38" stroke="#b08a68" stroke-width="8" stroke-linecap="round" fill="none"/></g>'; }
function rlFokSzel(i) { return 168 - i * 2; }
function rlRosszLat(L) { return L.rossz != null && !L.beirt; }
/* egy fok állapota a létra-képen */
function rlFokAll(L, i) {
  var x = L.f.rl, st = L.st, M = st.menet, vege = !!L.vege;
  if (x.forma === "sajat") {
    if (i === 0) return [L.seg >= 1 ? "alap" : "kesz", x.alap.c];
    if (i === x.valasztott) return [rlRosszLat(L) ? "rossz" : "kerdez", rlRosszLat(L) ? L.rossz : ""];
    return ["ures", ""];
  }
  var e = M.fokok[i], kerdezett = i === x.fok && !L.lezart && !vege;
  if (kerdezett) return [rlRosszLat(L) ? "rossz" : "kerdez", rlRosszLat(L) ? L.rossz : ""];
  if (st.kesz[i]) return [vege ? "fenyes" : i === 0 && L.seg >= 1 ? "alap" : "kesz", e.c];
  if (st.kitolt > 0 && M.magatol.slice(0, st.kitolt).indexOf(i) >= 0) return [vege ? "fenyes" : "magatol", e.c];
  return [vege ? "fenyes" : "ures", vege ? e.c : ""];
}
function rlLetraRajz(L) {
  var x = L.f.rl, st = L.st, M = x.forma === "sajat" ? st.sajat : st.menet, s = '', i;
  for (i = 0; i < M.fokok.length; i++) {
    var e = M.fokok[i], all = rlFokAll(L, i), bal;
    if (x.forma === "sajat" && i > 0 && i !== x.valasztott) {   /* üres fok: koppintásra ez lesz a gyerek rokona; amíg nem választott, halkan hív */
      s += '<g class="rl-fok' + (x.valasztott == null ? ' rl-hiv' : '') + '" data-i="' + i + '"><rect x="' + (RL_FOK_X - 90) + '" y="' + (rlY(i) - 22) + '" width="180" height="44" fill="transparent"/>' +
        kfFok(RL_FOK_X, rlY(i), rlFokSzel(i), "…", null, "ures") + '</g>';
      continue;
    }
    bal = kfMuv(e.a, e.op, e.b) + " =";
    s += kfFok(RL_FOK_X, rlY(i), rlFokSzel(i), bal, String(all[1] === "" ? "" : all[1]), all[0]);
  }
  if (L.vege || L.lezart) return s;
  /* az ugrás képe: az első kettőnél (képes állomáson) mindig; különben csak hiba után — a cél sosem látszik */
  var most = x.forma === "sajat" ? x.valasztott : x.fok;
  if (most == null) return s;
  var e2 = M.fokok[most], mod = L.seg >= 2 ? "lepes" : "alak";
  if (x.kep && x.lep === 1 && L.seg < 1) s += '<g opacity=".32">' + kfUgras(M.fokok[0].ugras, M.fokok[0].op, RL_UGRAS_X, rlY(0) + 2, 14, "alak").svg + '</g>';   /* halványan az alapé is */
  if (x.kep || L.seg >= 1) s += kfUgras(e2.ugras, e2.op, RL_UGRAS_X, rlY(most) + 2, 14, mod).svg;
  return s;
}
function rlSegitRajz(L) {
  var x = L.f.rl, s = '';
  /* a nagy feladat egy fokon, alatta a fa polcon három kis fok (a létra-ház tartalék fokai): az egyik a rokona */
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(236, 362, 604, 376, 3) + '" fill="#d9b07a" stroke="#8a6a52" stroke-width="2"/>' +
       '<path d="M262 376L276 404M578 376L564 404" stroke="#8a6a52" stroke-width="5" stroke-linecap="round"/></g>';
  var rossz = x.valasztva && rlRosszLat(L);
  s += kfFok(420, 150, 250, kfMuv(x.a, x.op, x.b) + " =", rossz ? L.rossz : "", x.valasztva ? (rossz ? "rossz" : "kerdez") : "magatol");
  x.s.kartyak.forEach(function (k, i) {   /* a három kis fok: koppintásra választ */
    var cx = 300 + i * 120, jo = x.valasztva && i === x.s.jo, ki = x.kiesett[i] || (x.valasztva && !jo);
    s += '<g class="rl-kartya" data-i="' + i + '"' + (ki ? ' opacity=".3"' : '') + '><rect x="' + (cx - 56) + '" y="314" width="112" height="48" fill="transparent"/>' +
      kfFok(cx, 340, 104, k.szoveg, null, jo ? "alap" : "magatol") + '</g>';
  });
  if (x.valasztva && L.seg >= 1) s += kfUgras(x.ugras, x.op, 312, 220, 14, L.seg >= 2 ? "lepes" : "alak").svg;
  return s;
}

/* ═════════════════ KEZELÉS (a két választás; a beírást, a billentyűzetet és a Kész gombot a motor adja) ═════════════════ */
function rlValaszt(i, g) {
  var x = JL.f.rl;
  if (x.kiesett[i]) return;
  if (i === x.s.jo) { x.valasztva = true; J.probak = 0; jlRajz(); $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = ""; mondd("Ez segít! Mennyi " + szo(x.a) + rlOpSzo(x.op) + szo(x.b) + "?"); jlFokusz(); return; }
  x.kiesett[i] = true;
  rosszValaszKonyvel(rlValasztNaplo("segít: " + x.s.kartyak[i].szoveg), "kártya " + x.s.kartyak[i].szoveg);
  pcRezeg(g); jlRajz();
  var v = $("visszajelzes"); v.className = "visszajelzes rossz"; v.textContent = "Ez nem segít. Nézd meg az egyeseket!";
  mondd("Ez nem segít. Nézd meg az egyeseket!");
  ment();
}
/* 2. hibától: a lépések szóban, a cél nélkül (47 + 5: „Negyvenhét, ötven: ez három lépés. Onnan még kettő. Hová érsz?”) */
function rlLepesMondat(x) {
  var p = x.ugras.pontok, l = x.ugras.lepesek, irany = x.op === "-" ? "vissza " : "";
  if (p.length === 2) return szo(p[0]) + ", és még " + irany + szo(l[0]) + ". Hová érsz?";
  return szo(p[0]) + ", " + szo(p[1]) + ": ez " + szo(l[0]) + " lépés. Onnan még " + irany + szo(l[1]) + ". Hová érsz?";
}
function rlSajatValaszt(i) {   /* ✍️ „Válassz te egy rokont!”: a koppintott fok lesz a gyerek rokona, kigyullad, és jön a számolás */
  var f = JL.f, x = f.rl, fk = JL.st.sajat.fokok[i];
  if (!fk || i < 1) return;
  x.valasztott = i;
  f.helyes = fk.c; f.naplo = fk.naplo; x.a = fk.a; x.b = fk.b; x.op = fk.op; x.c = fk.c; x.ugras = fk.ugras;
  JL.rossz = null; JL.beirt = ""; JL.seg = 0;
  f.szoveg = f.keplet = "Mennyi " + kfMuv(fk.a, fk.op, fk.b) + "?";
  $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(f.szoveg) + '</span>';   /* a felirat is a választott fokot kérdezi */
  hangCsilla(); jlRajz();
  mondd("Mennyi " + szo(fk.a) + rlOpSzo(fk.op) + szo(fk.b) + "?"); jlFokusz();
}
function rlFelmaszik(L, tol, n, kesz) {   /* ⑤ kész a létra: végigvilágít, az unikornis az utolsó jó foktól fokról fokra a tetejéig mászik */
  var i = tol;
  hangCsilla();
  (function lep() {
    if (JL !== L || !L.svg.isConnected) return;
    jlUniAllit(RL_FOK_X + 4, rlY(i) - 14);
    if (++i < n) setTimeout(lep, lkCsokkent() || window.__UC_GYORS ? 0 : 120);
    else setTimeout(kesz, lkCsokkent() || window.__UC_GYORS ? 0 : 450);
  })();
}

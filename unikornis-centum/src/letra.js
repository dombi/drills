/* ============ 6h3) 🪜 ROKON-LÉTRA — a létra képe és játékmenete (Pálya-hely B kör, 2026-10-25) ============
   Terv: terv/palyahely-targykeret-terv.html 8. pont + terv/eletszeru-100-as-palyak-terv.html 4. pont · rajz: terv/palyahely-rajzterv.html 6. pont
   (✅ jóváhagyva; a létra menete a producer döntése, 2026-10-24). A feladatot a szamkor100.js gyártja (rokonLetraMenet, rokonSegit,
   rokonSajatEll), itt csak a kép és a kezelés van; a keretek (fok, tábla, ugrás) a közös keret.js-ből jönnek.
   MIT TANÍT? A 100-as körben nem kell elölről számolni: ha a 7 + 5 = 12 megvan, a 47 + 5 ugyanaz az ugrás, a tízes csak „utazik”,
   még az átlépés is öröklődik (67 + 5 = 72, nem 62). A létra a százas tábla egy oszlopa: egy fok = egy tízes.
   MIT CSINÁL A GYEREK A KÉPEN? A ház oldalán álló létra fokait tölti ki: ① az alap (7 + 5) · ② egy távoli rokon (47 + 5) ·
   ③ a létra magától kitölt néhány fokot, egyenként · ④ 2–3 hiányzó, nem sorban (egynek a szomszédja is üres) · ⑤ végigvilágít,
   az unikornis felmászik. 5 válasz = 1 állomás (a gyerekek hamar elunják a 9 beírást). A válasz helye a tábla a létra mellett.
   Állomások (constants.js): Összeadás-létra (ugrás képével) · Más alappal (az ugrás csak hibánál) · Kivonás-létra (12 − 5 → 42 − 5)
   · Melyik segít? (3 fokból a rokon, aztán a nagy feladat) · Odú-küszöb (rövid létra · melyik segít · a csúcs: „Válassz te egy rokont!”:
   a gyerek egy üres fokra koppint — az lesz az ő rokona —, a fok kigyullad (39 + 6 = ?), és az eredményt írja a táblára; a producer
   döntése 2026-10-25: a beírós változat nem volt érthető, a gyerek az eredményt írta a fok eleje helyett).
   HIBÁNÁL a megoldást nem írjuk ki: 1. hiba → a fok mellett az ugrás alakja (a kerek tízes látszik, a cél „?”), és az alap fok
   felfénylik · 2. hibától → lépésenként: az első ugrás megérkezik, a második halad, a hang elmondja a lépéseket, a számot a gyerek mondja ki.
   🔒 Kiskapu: a fokok nem ismétlik a választ; a magától kitöltött fokért nem jár semmi; a választásért (melyik segít?) sem, csak a
   nagy feladat beírásáért; a „saját rokon” csak egész tízessel arrébb, a 100-on belül fogadható el.
   A motorral a bolt útján beszél (bolt-kep.js): rossz → rosszValaszKonyvel, jó → ertekel(f.helyes). Napló: a tény-motor „r” formája. */

/* az ösvény sátrai (a pálya-kép a vásártér: vasar.js vasarJelenetSVG) — a létra-ház türkize */
VS_SZIN.rl1 = { teto: "#8fd6cf", csik: "#fff", sotet: "#3f8a85", cimer: "🪜" };
VS_SZIN.rl2 = { teto: "#a7d99a", csik: "#fff", sotet: "#5e9a52", cimer: "🪜" };
VS_SZIN.rl3 = { teto: "#c9a8e6", csik: "#fff", sotet: "#7a5ea8", cimer: "🪜" };
VS_SZIN.rl4 = { teto: "#fce49a", csik: "#fff", sotet: "#c9953a", cimer: "💡" };

var RL = null;   /* a kirakott kép: { J, svg, f, st, beirt, rossz, lezart, ux, uy } */
var RL_FOK_X = 315, RL_TABLA = [690, 250, 122, 78];
function rlY(i) { return 446 - i * 48; }
function rlAllapot() {
  if (!J.rl || J.rl.all !== J.allomasIdx) J.rl = { all: J.allomasIdx, menet: null, kesz: {}, kitolt: -1, seg: 0 };
  return J.rl;
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
  st.seg = 0;
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
  return { csalad: "letra", rl: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(kerdes) + '</span>', szoveg: kerdes, felolvas: felolvas,
    helyes: fk.c, keplet: kerdes, tipp: "", naplo: fk.naplo };
}

/* ═════════════════ A PANEL (a buborékban, mint a bolt képe) ═════════════════ */
function rlPanel() {
  var p = $("rl-panel");
  if (!p) {
    p = el("div", "bk-panel rl-panel"); p.id = "rl-panel";
    p.innerHTML = '<div class="rl-kep"><svg id="rl-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" aria-hidden="true"></svg>' +
      '<input id="rl-beiras" class="rl-beiras" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="a válasz a táblára"></div>' +
      '<div id="rl-gombok" class="bk-gombok"><button class="nagy-gomb bk-kesz" data-g="kesz">Kész ✓</button></div>';
    $("bagoly-buborek").insertBefore(p, $("halld-ujra"));
    p.querySelector("svg").addEventListener("click", rlKatt);
    $("rl-gombok").addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-g]"); if (b && rlAktiv()) { hangGomb(); rlBekuld(); } });
    var be = $("rl-beiras");
    be.addEventListener("input", function () { if (!rlAktiv()) { be.value = ""; return; } RL.beirt = be.value.replace(/[^0-9]/g, "").slice(0, 3); be.value = RL.beirt; RL.rossz = null; rlTablaRajz(); });
    be.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (rlAktiv()) rlBekuld(); } });
  }
  return p;
}
function rlRejt() {
  var p = $("rl-panel"); if (p) p.hidden = true;
  var k = $("kepernyo-jatek"); if (k) k.classList.remove("bk-be");
  document.removeEventListener("keydown", rlBillentyu);
}
function rlMutat(f) {
  var p = rlPanel(), st = rlAllapot();
  p.hidden = false; $("kepernyo-jatek").classList.add("bk-be");
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  var marad = RL && RL.J === J && RL.all === J.allomasIdx && !RL.vege;   /* az állomáson belül ott marad, ahol volt; kész létra után újra lent */
  RL = { J: J, all: J.allomasIdx, svg: $("rl-svg"), f: f, st: st, beirt: "", rossz: null, lezart: false, ux: marad ? RL.ux : 664, uy: marad ? RL.uy : 496 };   /* a tábla alatt áll, nem takarja az ugrást */
  $("rl-beiras").value = "";
  document.removeEventListener("keydown", rlBillentyu); document.addEventListener("keydown", rlBillentyu);
  var x = f.rl, M = st.menet;
  if (x.forma === "letra" && x.lep >= 2 && st.kitolt < 0 && M.magatol.length) {   /* ③ a távoli rokon után: a létra magától kitölt, egyenként */
    RL.lezart = true; st.kitolt = 0;
    (function tolt() {
      if (!RL || RL.f !== f) return;
      rlRajz();
      if (st.kitolt < M.magatol.length) { st.kitolt++; if (!lkCsokkent()) hangCsilla(); setTimeout(tolt, lkCsokkent() ? 0 : 340); }
      else { RL.lezart = false; rlRajz(); mondd(f.felolvas); rlFokusz(); }
    })();
    return;
  }
  rlRajz(); mondd(f.felolvas); rlFokusz();
}
function rlFokusz() { try { if (!(window.matchMedia && matchMedia("(pointer: coarse)").matches)) $("rl-beiras").focus({ preventScroll: true }); } catch (e) {} }

/* ═════════════════ RAJZ ═════════════════ */
function rlHaz() {   /* a Rokon-létra türkiz tetős, magas háza, közelről (piac.js piacHaz „letra” színei) */
  return '<rect width="800" height="520" fill="url(#lt-gEgA)"/><path d="M0 478Q400 452 800 478V520H0Z" fill="#c4e6bc" stroke="#9fcf98" stroke-width="1.6"/>' +
    '<g transform="translate(120 486)" filter="url(#lt-firka)"><path d="' + pcFal(76, 404) + '" fill="url(#lt-gFal)" stroke="#8a6a7e" stroke-width="2.4"/></g>' +
    '<g filter="url(#lt-firka)"><path d="M24 86Q78 44 120 18Q162 44 216 86Q120 78 24 86Z" fill="url(#lt-gTetoT)" stroke="#3f8a85" stroke-width="2.4" stroke-linejoin="round"/></g>' +
    pcAblak(94, 130, 52, 40, "url(#lt-gAblak)") + pcAblak(94, 236, 52, 40, "#cfe2f2") + pcAblak(94, 342, 52, 40, "url(#lt-gAblak)");
}
function rlSzarak() { return '<g filter="url(#lt-firka)"><path d="M222 492Q236 270 250 38M408 492Q394 270 380 38" stroke="#b08a68" stroke-width="8" stroke-linecap="round" fill="none"/></g>'; }
function rlFokSzel(i) { return 168 - i * 2; }
/* 📱 keskeny kijelzőn (telefon, álló) a ház fala lemarad: a létra, az ugrás és a tábla nagyobb; a beíró mező a táblán marad */
var RL_KEP = { teljes: { vb: "0 0 800 520", mezo: [77.5, 38.8, 17.5, 18.5] }, keskeny: { vb: "205 24 575 476", mezo: [70.6, 35.5, 27.5, 24] } };
function rlKepMeret() {
  var k = RL_KEP[RL.svg.parentNode.clientWidth && RL.svg.parentNode.clientWidth < 520 ? "keskeny" : "teljes"], m = k.mezo, be = $("rl-beiras");
  RL.svg.setAttribute("viewBox", k.vb);
  be.style.left = m[0] + "%"; be.style.top = m[1] + "%"; be.style.width = m[2] + "%"; be.style.height = m[3] + "%";
}
function rlRajz() {
  var f = RL.f, x = f.rl, st = RL.st, s = LT_DEFS, i;
  rlKepMeret();
  s += rlHaz();
  if (x.forma === "segit") s += rlSegitRajz(f);
  else s += rlSzarak() + rlLetraRajz(f);
  s += '<g class="rl-tabla-hely"></g>';
  s += '<g class="pc-uni" pointer-events="none"><g class="pc-uni-irany" style="--dir:-1;transform:scale(var(--dir,1),1)">' + unikornisSVG("rl-uni", LENYEK[mentes.leny], .4, P().oltozet) + '</g></g>';
  RL.svg.innerHTML = s;
  RL.uni = RL.svg.querySelector(".pc-uni"); rlUniAllit(RL.ux, RL.uy);
  uniNezoAdat(RL.svg.querySelector(".pc-uni-irany"), { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  rlTablaRajz();
}
function rlUniAllit(x, y) { RL.ux = x; RL.uy = y; if (RL.uni) RL.uni.setAttribute("transform", "translate(" + pcF(x) + " " + pcF(y) + ")"); }
function rlTablaRajz() {
  var g = RL.svg.querySelector(".rl-tabla-hely"); if (!g) return;
  var T = RL_TABLA, f = RL.f, x = f.rl, var_ = (x.forma === "segit" && !x.valasztva) || (x.forma === "sajat" && x.valasztott == null);   /* előbb választ (kis fok / saját fok), a tábla addig pihen */
  g.innerHTML = kfTabla(T[0], T[1], T[2], T[3], RL.rossz != null && !RL.beirt ? RL.rossz : RL.beirt, RL.joMost ? "jo" : RL.rossz != null && !RL.beirt ? "rossz" : var_ ? "var" : "");
}
/* egy fok állapota a létra-képen */
function rlFokAll(i, f) {
  var x = f.rl, st = RL.st, M = st.menet, vege = !!RL.vege;
  if (x.forma === "sajat") {
    if (i === 0) return [st.seg >= 1 ? "alap" : "kesz", x.alap.c];
    if (i === x.valasztott) return [RL.rossz != null && !RL.beirt ? "rossz" : "kerdez", RL.rossz != null && !RL.beirt ? RL.rossz : ""];
    return ["ures", ""];
  }
  var e = M.fokok[i], kerdezett = i === x.fok && !RL.lezart && !vege;
  if (kerdezett) return [RL.rossz != null && !RL.beirt ? "rossz" : "kerdez", RL.rossz != null && !RL.beirt ? RL.rossz : ""];
  if (st.kesz[i]) return [vege ? "fenyes" : i === 0 && st.seg >= 1 ? "alap" : "kesz", e.c];
  if (st.kitolt > 0 && M.magatol.slice(0, st.kitolt).indexOf(i) >= 0) return [vege ? "fenyes" : "magatol", e.c];
  return [vege ? "fenyes" : "ures", vege ? e.c : ""];
}
function rlLetraRajz(f) {
  var x = f.rl, st = RL.st, M = x.forma === "sajat" ? st.sajat : st.menet, s = '', i;
  for (i = 0; i < M.fokok.length; i++) {
    var e = M.fokok[i], all = rlFokAll(i, f), bal;
    if (x.forma === "sajat" && i > 0 && i !== x.valasztott) {   /* üres fok: koppintásra ez lesz a gyerek rokona; amíg nem választott, halkan hív */
      s += '<g class="rl-fok' + (x.valasztott == null ? ' rl-hiv' : '') + '" data-i="' + i + '"><rect x="' + (RL_FOK_X - 90) + '" y="' + (rlY(i) - 22) + '" width="180" height="44" fill="transparent"/>' +
        kfFok(RL_FOK_X, rlY(i), rlFokSzel(i), "…", null, "ures") + '</g>';
      continue;
    }
    bal = kfMuv(e.a, e.op, e.b) + " =";
    s += kfFok(RL_FOK_X, rlY(i), rlFokSzel(i), bal, String(all[1] === "" ? "" : all[1]), all[0]);
  }
  if (RL.vege || RL.lezart) return s;
  /* az ugrás képe: az első kettőnél (képes állomáson) mindig; különben csak hiba után — a cél sosem látszik */
  var most = x.forma === "sajat" ? x.valasztott : x.fok;
  if (most == null) return s;
  var e2 = M.fokok[most], mod = st.seg >= 2 ? "lepes" : "alak";
  if (x.kep && x.lep === 1 && st.seg < 1) s += '<g opacity=".32">' + kfUgras(M.fokok[0].ugras, M.fokok[0].op, 428, rlY(0) + 2, 14, "alak").svg + '</g>';   /* halványan az alapé is */
  if (x.kep || st.seg >= 1) s += kfUgras(e2.ugras, e2.op, 428, rlY(most) + 2, 14, mod).svg;
  return s;
}
function rlSegitRajz(f) {
  var x = f.rl, s = '', st = RL.st;
  /* a nagy feladat egy fokon, alatta a fa polcon három kis fok (a létra-ház tartalék fokai): az egyik a rokona */
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(236, 362, 604, 376, 3) + '" fill="#d9b07a" stroke="#8a6a52" stroke-width="2"/>' +
       '<path d="M262 376L276 404M578 376L564 404" stroke="#8a6a52" stroke-width="5" stroke-linecap="round"/></g>';
  var rossz = x.valasztva && RL.rossz != null && !RL.beirt;
  s += kfFok(420, 150, 250, kfMuv(x.a, x.op, x.b) + " =", rossz ? RL.rossz : "", x.valasztva ? (rossz ? "rossz" : "kerdez") : "magatol");
  x.s.kartyak.forEach(function (k, i) {   /* a három kis fok: koppintásra választ */
    var cx = 300 + i * 120, jo = x.valasztva && i === x.s.jo, ki = x.kiesett[i] || (x.valasztva && !jo);
    s += '<g class="rl-kartya" data-i="' + i + '"' + (ki ? ' opacity=".3"' : '') + '><rect x="' + (cx - 56) + '" y="314" width="112" height="48" fill="transparent"/>' +
      kfFok(cx, 340, 104, k.szoveg, null, jo ? "alap" : "magatol") + '</g>';
  });
  if (x.valasztva && st.seg >= 1) s += kfUgras(x.ugras, x.op, 312, 220, 14, st.seg >= 2 ? "lepes" : "alak").svg;
  return s;
}

/* ═════════════════ KEZELÉS ═════════════════ */
function rlAktiv() { return RL && J && J.feladat === RL.f && RL.f && RL.f.rl && J.joVolt !== RL.f && !RL.lezart; }
function rlKatt(ev) {
  if (!rlAktiv()) return;
  var t = ev.target, x = RL.f.rl;
  var k = t.closest ? t.closest(".rl-kartya") : null;
  if (k && x.forma === "segit" && !x.valasztva) { hangGomb(); rlValaszt(+k.getAttribute("data-i"), k); return; }
  var fo = t.closest ? t.closest(".rl-fok") : null;
  if (fo && x.forma === "sajat" && x.valasztott == null) { hangGomb(); rlSajatValaszt(+fo.getAttribute("data-i")); return; }
  rlFokusz();
}
function rlBillentyu(e) {
  if (!rlAktiv() || document.activeElement === $("rl-beiras")) return;   /* a mező maga kezeli a számjegyeket */
  var d = /^Digit[0-9]$/.test(e.code) ? e.code.charAt(5) : /^Numpad[0-9]$/.test(e.code) ? e.code.charAt(6) : /^[0-9]$/.test(e.key) ? e.key : null;   /* a fizikai hely (magyar kiosztás), mint events.js */
  if (d !== null) { e.preventDefault(); if (RL.beirt.length < 3) { RL.beirt += d; RL.rossz = null; hangGomb(); rlTablaRajz(); } }
  else if (e.key === "Backspace") { e.preventDefault(); RL.beirt = RL.beirt.slice(0, -1); rlTablaRajz(); }
  else if (e.key === "Enter") { e.preventDefault(); rlBekuld(); }
}
function rlValaszt(i, g) {
  var f = RL.f, x = f.rl;
  if (x.kiesett[i]) return;
  if (i === x.s.jo) { x.valasztva = true; J.probak = 0; rlRajz(); $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = ""; mondd("Ez segít! Mennyi " + szo(x.a) + rlOpSzo(x.op) + szo(x.b) + "?"); rlFokusz(); return; }
  x.kiesett[i] = true;
  rosszValaszKonyvel(rlValasztNaplo("segít: " + x.s.kartyak[i].szoveg), "kártya " + x.s.kartyak[i].szoveg);
  pcRezeg(g); rlRajz();
  var v = $("visszajelzes"); v.className = "visszajelzes rossz"; v.textContent = "Ez nem segít. Nézd meg az egyeseket!";
  mondd("Ez nem segít. Nézd meg az egyeseket!");
  ment();
}
function rlBekuld() {
  var f = RL.f, x = f.rl, st = RL.st;
  if (x.forma === "segit" && !x.valasztva) { mondd("Előbb koppints a kis feladatra, amelyik segít!"); return; }
  if (x.forma === "sajat" && x.valasztott == null) { RL.beirt = ""; $("rl-beiras").value = ""; rlTablaRajz(); mondd("Előbb koppints egy üres fokra a létrán!"); return; }
  if (RL.beirt === "") { rlFokusz(); return; }
  var v = parseInt(RL.beirt, 10);
  RL.beirt = ""; $("rl-beiras").value = "";
  if (v === f.helyes) { rlJo(v); return; }
  RL.rossz = String(v);
  rosszValaszKonyvel(f, v);
  st.seg = Math.min(2, J.probak);
  rlRajz();
  var vj = $("visszajelzes"); vj.className = "visszajelzes rossz";
  if (st.seg >= 2) { vj.textContent = "Lépésenként!"; mondd(rlLepesMondat(x)); }
  else { vj.textContent = "Nézd meg az ugrást!"; mondd("Nézd meg az ugrást, és próbáld újra!"); }
  rlFokusz(); ment();
}
/* 2. hibától: a lépések szóban, a cél nélkül (47 + 5: „Negyvenhét, ötven: ez három lépés. Onnan még kettő. Hová érsz?”) */
function rlLepesMondat(x) {
  var p = x.ugras.pontok, l = x.ugras.lepesek, irany = x.op === "-" ? "vissza " : "";
  if (p.length === 2) return szo(p[0]) + ", és még " + irany + szo(l[0]) + ". Hová érsz?";
  return szo(p[0]) + ", " + szo(p[1]) + ": ez " + szo(l[0]) + " lépés. Onnan még " + irany + szo(l[1]) + ". Hová érsz?";
}
function rlSajatValaszt(i) {   /* ✍️ „Válassz te egy rokont!”: a koppintott fok lesz a gyerek rokona, kigyullad, és jön a számolás */
  var f = RL.f, x = f.rl, st = RL.st, fk = st.sajat.fokok[i];
  if (!fk || i < 1) return;
  x.valasztott = i;
  f.helyes = fk.c; f.naplo = fk.naplo; x.a = fk.a; x.b = fk.b; x.op = fk.op; x.c = fk.c; x.ugras = fk.ugras;
  RL.rossz = null; RL.beirt = ""; st.seg = 0;
  f.szoveg = f.keplet = "Mennyi " + kfMuv(fk.a, fk.op, fk.b) + "?";
  $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(f.szoveg) + '</span>';   /* a felirat is a választott fokot kérdezi */
  hangCsilla(); rlRajz();
  mondd("Mennyi " + szo(fk.a) + rlOpSzo(fk.op) + szo(fk.b) + "?"); rlFokusz();
}
function rlJo(v) {
  var f = RL.f, x = f.rl, st = RL.st;
  RL.lezart = true; RL.joMost = true; RL.rossz = null;
  if (x.forma === "letra") st.kesz[x.fok] = true;
  if (x.forma === "letra" && x.utolso) { RL.vege = true; rlRajz(); rlFelmaszik(st.menet.fokok.length, function () { if (J && J.feladat === f) ertekel(f.helyes); }); return; }
  rlRajz();
  setTimeout(function () { if (J && J.feladat === f) ertekel(f.helyes); }, lkCsokkent() ? 0 : 350);
}
function rlFelmaszik(n, kesz) {   /* ⑤ kész a létra: végigvilágít, az unikornis fokról fokra felmászik */
  var i = -1, f = RL.f;
  hangCsilla();
  (function lep() {
    if (!RL || RL.f !== f || !RL.svg.isConnected) return;
    if (i < 0) rlUniAllit(RL_FOK_X + 4, 494); else rlUniAllit(RL_FOK_X + 4, rlY(i) - 14);
    if (++i < n) setTimeout(lep, lkCsokkent() || window.__UC_GYORS ? 0 : 120);
    else setTimeout(kesz, lkCsokkent() || window.__UC_GYORS ? 0 : 450);
  })();
}

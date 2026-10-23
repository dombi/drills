/* ============ 7c) 🦄 BELÉPŐ LEGELŐ — a választó (1. kör, 2026-10-23) ============
   Terv: terv/belepo-legelo-rendszerterv.html (✅) + terv/belepo-legelo-rajzterv.html (✅, a prototípus innen jött át).
   A LEGELŐ A VÁLASZTÓ: mind az öt unikornis a réten. Véletlen, ki alszik, ki legel, ki sétál (egyszerre legfeljebb egy
   sétál, egy hajol le a fűhöz; nyugi módban senki sem mozog). Mindegyik a gyerek által beállított kinézetében áll.
     • Amelyikkel még sosem játszott, annak a feje fölött szív-buborék („vár rád”).
     • A fehér koppints-gyűrű minden választható unikornis lába alatt; az egyikük megkérdezi: „Kivel játszol ma, Petra?”;
       ha a gyerek vár, pár másodpercenként egy-egy legelő felugrik.
     • Koppintás: felébred és nyújtózik / felkapja a fejét → odaüget a kép közepére → köszön, és megmondja, hol jártak
       legutóbb („Szia, Petra! Megyünk vissza a Szorzós ligetbe?”) → térkép. A legutóbb használt elöl áll, de nincs kiemelve.
     • Az újonc első két hetében (nyitasHely("unikornisok") === "alszik") a többiek mélyen alszanak: felhő-paplan + hold,
       koppintásra „Ő még alszik. Hamarosan felébred!”.
   EGY KÖZÖS RAJZOLÓ (legeloRajzol) három helyre: a nyitókép és a 🦄 Váltás (mod "valaszt", #nyito-szin), valamint az első
   perc ① lépése (mod "ujonc", #elsoperc-szin: mindenki ébren, jel nélkül). A régi kártyás választó (renderProfil) megszűnt.
   Telefonon (álló kép) a két elöl álló nagyobb, a többi hátrébb a dombon (LEGELO_ELR.allo).
   A következő körök: 2. belépés a legelőn (üres tábla, belépő mező, csillámfelhő) + a kis kapu kilépéssel — addig a
   „👋 Másik gyerek” tábla a kijárat; 3. a titkos képes lakat a tábla oszlopán + a pult. */

var LEGELO = { host: null, mod: null, elr: null, svg: null, tok: 0, valaszt: false, kesz: null, sor: null, allapot: null, legelT: null, nogatT: null, masikT: null };
/* elrendezések a kép egységeiben — hely: [x, y (a pata), méret, irány]; az első kettő elöl áll */
var LEGELO_ELR = {
  fekvo: { w: 800, h: 460, hz: 150, cim: function () { return nyCim(66, 42); },
    hely: [[110, 430, .78, 1], [600, 438, .8, -1], [395, 352, .62, 1], [262, 318, .54, -1], [520, 312, .54, 1]],
    tabla: [300, 458, .8], masik: [700, 290, .55], kozep: [420, 440, 1],
    fu: function () { return [nyFu(60, 446), nyFu(350, 452), nyFu(480, 444), nyFu(745, 452), nyViragok([[40, 432], [190, 450], [370, 440], [470, 456], [560, 448], [680, 452], [790, 444]])].join(""); } },
  allo: { w: 400, h: 760, hz: 300, cim: function () { return '<g transform="translate(200 0) scale(.78) translate(-400 0)">' + nyCim(150, 44) + '</g>'; },
    hely: [[105, 704, .78, 1], [290, 696, .76, -1], [165, 450, .44, -1], [70, 468, .44, 1], [258, 470, .44, -1]],
    tabla: [175, 585, .7], masik: [330, 560, .42], kozep: [200, 706, .95],
    fu: function () { return [nyFu(30, 740), nyFu(200, 752), nyFu(370, 744), nyFu(330, 600), nyViragok([[20, 724], [150, 748], [250, 740], [380, 728], [60, 600], [300, 612]])].join(""); } }
};
var LEGELO_ALAP_SOR = ["ragyogas", "vihar", "csillamharmat", "tuz", "ejfeny"];   /* ki melyik helyen áll alapból (a rajzterv szerint) */
/* hová mennek vissza (P().utolsoLiget → a köszönés vége); ami nincs itt, ott csak köszön */
var LEGELO_HOVA = { osszeado: "az Összeadó ligetbe", szorzo: "a Szorzós ligetbe", szabo: "a Szabóműhelybe", bajital: "a Bájitalkonyhába",
                    pekseg: "a Mézes pékségbe", konyvtar: "a Bagolykönyvtárba", vasar: "a Tündérvásárba", fejtoro: "a Fejtörő-hegyre" };
var LEGELO_MONDAT = {
  kerdez: "Kivel játszol ma, {n}?", kerdezN: "Kivel játszol ma?",
  vissza: "Szia, {n}! Megyünk vissza {h}?", visszaN: "Szia! Megyünk vissza {h}?",
  uj: "Szia, {n}! De jó, hogy velem jössz!", ujN: "Szia! De jó, hogy velem jössz!",
  mely: "Ő még alszik. Hamarosan felébred!"
};

/* ── nyitás: a nyitókép és a 🦄 Váltás (megtart: ugyanaz a kép marad, csak a felhő adatai frissültek) ── */
function legeloNyit(megtart) {
  var host = $("nyito-szin");
  NYITO.mod = "sajat"; NYITO.tovabb = false; NYITO.varKezd = 0;
  clearTimeout(NYITO.varT);
  belepoRejt();
  legeloRajzol(host, "valaszt", function (l) { nyitoTovabb(l); }, megtart && LEGELO.host === host);
  $("nyito-szuloi").hidden = false;
  mutat("kepernyo-nyito");
}
/* mod: "valaszt" | "ujonc"; kesz(leny): a választott unikornis odaért és köszönt */
function legeloRajzol(host, mod, kesz, megtart) {
  var L = LEGELO;
  L.tok++; clearInterval(L.legelT); clearInterval(L.nogatT); clearTimeout(L.masikT); L.masikT = null;
  var allo = window.innerHeight > window.innerWidth * 1.15;
  host.classList.toggle("allo", allo);
  if (!megtart || !L.sor || L.mod !== mod) { L.sor = legeloSor(mod); L.allapot = legeloKever(L.sor, mod); }
  L.host = host; L.mod = mod; L.kesz = kesz; L.valaszt = false; L.elr = LEGELO_ELR[allo ? "allo" : "fekvo"];
  var E = L.elr, nev = nyitoNev(), s = '<svg viewBox="0 0 ' + E.w + ' ' + E.h + '" class="uni-terep" xmlns="http://www.w3.org/2000/svg">' + nyDefs() + nyRetHatter(E.w, E.h, E.hz);
  s += E.cim() + E.fu();
  var tetel = L.sor.map(function (l, i) { return [E.hely[i][1], legeloUniG(l, E.hely[i])]; });
  if (mod === "valaszt" || nev) tetel.push([E.tabla[1], '<g class="lg-tabla-g" transform="translate(' + E.tabla[0] + ' ' + E.tabla[1] + ') scale(' + E.tabla[2] + ')">' + nyTabla(0, 0, nev) + '<rect x="-70" y="-110" width="140" height="116" fill="transparent"/></g>']);
  tetel.sort(function (a, b) { return a[0] - b[0]; });
  s += tetel.map(function (t) { return t[1]; }).join("");
  if (mod === "valaszt") s += '<g class="ny-masik" transform="translate(' + E.masik[0] + ' ' + E.masik[1] + ') scale(' + E.masik[2] + ')">' + nyTabla(0, 0, "👋 Másik gyerek") + '<rect x="-140" y="-110" width="280" height="116" fill="transparent"/></g>';
  host.innerHTML = nySajatId(s + '<g class="lg-felso"></g></svg>') + '<div class="ny-atfed"></div>';
  L.svg = host.querySelector("svg");
  L.svg.querySelectorAll(".lg-uni").forEach(function (g) {
    var l = g.dataset.l, p = mentes.profilok[l] || {};
    uniNezoAdat(g.querySelector(".irany"), { rajz: LENYEK[l].rajz, kinezet: p.kinezet || null, oltozet: p.oltozet || null });   /* a fordulás szemből-képéhez */
    legeloAllapot(g, L.allapot[l]);
    g.addEventListener("click", function () { legeloKopp(g); });
  });
  var t = L.svg.querySelector(".lg-tabla-g");
  if (t) t.addEventListener("click", function () { hangGomb(); legeloBillent(t); });
  var masik = L.svg.querySelector(".ny-masik");
  if (masik) masik.addEventListener("click", legeloMasik);
  var tok = L.tok;
  legeloKesobb(function () {
    var m = mod === "ujonc" ? EP_MONDAT.valaszt : nev ? LEGELO_MONDAT.kerdez.replace("{n}", nev) : LEGELO_MONDAT.kerdezN;
    legeloSzolEgy(m);
  }, 700);
  if (nyugiMod()) return;
  L.legelT = setInterval(function () {   /* legelés: egyszerre csak egyikük hajol le a fűhöz */
    if (tok !== L.tok || !L.svg.isConnected) { clearInterval(L.legelT); return; }
    if (L.valaszt || L.svg.querySelector(".irany.uni-mozd-eszik")) return;
    var gk = legeloAkik("legel"); if (!gk.length) return;
    var ir = veletlenElem(gk).querySelector(".irany");
    ir.classList.add("uni-mozd-eszik"); setTimeout(function () { ir.classList.remove("uni-mozd-eszik"); }, 1700);
  }, 1500);
  L.nogatT = setInterval(function () {   /* ha a gyerek vár: egyikük felugrik a helyén („engem!”) */
    if (tok !== L.tok || !L.svg.isConnected) { clearInterval(L.nogatT); return; }
    if (L.valaszt || L.svg.querySelector(".irany.uni-mozd-eszik")) return;
    var gk = legeloAkik("legel"); if (gk.length) legeloUgrik(veletlenElem(gk).querySelector(".irany"));
  }, 5000);
}
/* ki melyik helyre: alapból a rajzterv sorrendje; a legutóbb használt elöl áll (ha hátul lenne, helyet cserél az elsővel) */
function legeloSor(mod) {
  var sor = LEGELO_ALAP_SOR.filter(function (l) { return LENYEK[l]; });
  LENY_SORREND.forEach(function (l) { if (sor.indexOf(l) < 0) sor.push(l); });
  sor = sor.slice(0, LEGELO_ELR.fekvo.hely.length);
  var i = sor.indexOf(mentes.leny);
  if (mod === "valaszt" && i >= 2) { sor[i] = sor[0]; sor[0] = mentes.leny; }
  return sor;
}
/* véletlen állapot: alszik / legel / sétál (legfeljebb egy sétál); az újonc első perce: mindenki ébren;
   az újonc első két hetében a többiek mélyen alszanak */
function legeloKever(sor, mod) {
  var ny = mod === "valaszt" && nyitasMenet(), mely = ny && nyitasHely("unikornisok") === "alszik", setal = 0, st = {};
  sor.forEach(function (l) {
    if (mely && l !== ny.k) { st[l] = "mely"; return; }
    var r = Math.random(), a = mod === "ujonc" ? (r < .8 ? "legel" : "setal") : r < .4 ? "alszik" : r < .82 ? "legel" : "setal";
    if (a === "setal" && setal++) a = "legel";
    st[l] = a;
  });
  return st;
}
/* még sosem játszott vele: se pálya, se játékidő, se csillámpor */
function legeloSosem(l) {
  var p = mentes.profilok[l]; if (!p) return false;
  return !p.jatekMp && !(p.naplo || []).length && !Object.keys(p.palyak || {}).length && !p.csillampor;
}
function legeloKesobb(fn, ms) { var tok = LEGELO.tok; setTimeout(function () { if (tok === LEGELO.tok && LEGELO.svg && LEGELO.svg.isConnected) fn(); }, window.__UC_GYORS ? 0 : ms); }
function legeloHelyez(g, x, y, s) { g.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")"; g.dataset.x = x; }
function legeloAkik(a) { return [].filter.call(LEGELO.svg.querySelectorAll(".lg-uni"), function (g) { return g.dataset.all === a; }); }

/* egy unikornis: mozgatható keret (hely) > irány (--dir) > gyűrű + alvás-réteg (rajz) + jelek (vele fordulnak) */
function legeloUniG(l, p) {
  var pr = mentes.profilok[l] || {};
  return '<g class="lg-uni ny-mozgo" data-l="' + l + '" data-x="' + p[0] + '" style="transform:translate(' + p[0] + 'px,' + p[1] + 'px) scale(' + p[2] + ')">' +
    '<g class="irany" style="--dir:' + p[3] + ';transform:scale(var(--dir,1),1)"><g class="lg-gyuru"></g><g class="lg-alv"><g class="lg-rajz">' +
    unikornisSVG("lg-" + l + "-" + LEGELO.tok, LENYEK[l], 1, pr.oltozet || null, pr.kinezet || null) + '</g></g><g class="lg-jel"></g></g>' +
    '<rect x="-100" y="-150" width="200" height="162" fill="transparent"/></g>';
}
function legeloAllapot(g, a) {
  var alv = g.querySelector(".lg-alv");
  g.dataset.all = a;
  g.classList.toggle("valaszthato", a !== "mely");
  if (a === "alszik" || a === "mely") { alv.classList.add("fekszik-all"); uniElalszik(alv, true); }
  if (a === "setal") legeloSeta(g);
  legeloJel(g);
}
/* a jelek: mély alvás (felhő-paplan + hold), „vár rád” szív-buborék, és a fehér gyűrű a lába alatt */
function legeloJel(g) {
  var L = LEGELO, l = g.dataset.l, a = g.dataset.all, s = "", fekve = a === "alszik" || a === "mely";
  if (a === "mely") {
    s += '<g transform="translate(0 6)"><g class="lg-paplan"><path d="M-88 -6q-8 -22 10 -30q2 -20 24 -18q10 -16 30 -8q16 -8 26 6q16 -2 18 14q14 6 6 24q-6 14 -24 12h-74q-12 0 -16 0z" fill="#ffffff" stroke="#c9b8e8" stroke-width="3" opacity=".97"/>' +
      '<path d="M-70 -20q20 6 40 0q20 -6 40 0" fill="none" stroke="#e6dcf5" stroke-width="3" stroke-linecap="round"/>' + csillagSVG(-50, -32, 4, "#fce49a") + csillagSVG(-8, -24, 3.4, "#f6a5c0") + csillagSVG(28, -34, 3.6, "#c9a8e6") + '</g></g>' +
      '<g class="lg-hold"><path d="M-60 -150a17 17 0 1 0 15 24a13 13 0 1 1 -15 -24z" fill="#fce49a" stroke="#d9a93a" stroke-width="2"/>' + csillagSVG(-30, -158, 4, "#fff4c2") + csillagSVG(-76, -118, 3, "#fff4c2") + '</g>';
  } else if (L.mod === "valaszt" && legeloSosem(l)) {
    s += '<g transform="translate(58 ' + (fekve ? -118 : -158) + ')"><g class="lg-varad"><circle r="21" fill="#ffffff" stroke="#f3c2d6" stroke-width="2.5"/><circle cx="-14" cy="25" r="5" fill="#ffffff" stroke="#f3c2d6" stroke-width="2"/><circle cx="-22" cy="34" r="3" fill="#ffffff" stroke="#f3c2d6" stroke-width="1.6"/>' +
      '<path d="M0 12C-14 3 -15 -5 -11 -9c3 -4 9 -3 11 2c2 -5 8 -6 11 -2c4 4 3 12 -11 21z" fill="#f08bb0" stroke="#c0567f" stroke-width="1.6"/></g></g>';
  }
  g.querySelector(".lg-jel").innerHTML = s;
  g.querySelector(".lg-gyuru").innerHTML = !L.valaszt && a !== "mely"
    ? '<ellipse class="ny-koppints" cx="0" cy="6" rx="94" ry="22" fill="none" stroke="#ffffff" stroke-width="5"/>' : "";
}
/* séta: lassan oda-vissza a helye körül */
function legeloSeta(g) {
  if (nyugiMod()) return;
  var L = LEGELO, tok = L.tok, i = L.sor.indexOf(g.dataset.l), p = L.elr.hely[i], ir = g.querySelector(".irany"), x = p[0], cel = [p[0] - 55, p[0] + 55], k = Math.random() < .5 ? 0 : 1;
  function lep() {
    if (tok !== L.tok || g.dataset.all !== "setal" || !g.isConnected) return;
    var tx = cel[k]; k = 1 - k;
    uniFordul(ir, tx > x ? 1 : -1, function () {
      if (tok !== L.tok || g.dataset.all !== "setal") return;
      var mp = Math.abs(tx - x) / (22 * p[2] / .6);
      uniJar(ir, { mod: "seta", tempo: 1 });
      g.style.transition = "transform " + mp.toFixed(2) + "s linear";
      legeloHelyez(g, tx, p[1], p[2]); x = tx;
      g._setaT = setTimeout(function () {
        if (g.dataset.all !== "setal") return;
        uniAll(ir); g.style.transition = ""; g._setaT = setTimeout(lep, 2200 + Math.random() * 3000);
      }, mp * 1000);
    });
  }
  g._setaT = setTimeout(lep, 700 + Math.random() * 1500);
}

/* ── buborék (a kép egységeiben; a mondat el is hangzik) ── */
function legeloBub(x, y, szoveg, mp) {
  var L = LEGELO, host = L.host, b = host.querySelector(".ny-bub");
  if (!b) { b = el("div", "ny-bub"); host.appendChild(b); }
  clearTimeout(b._t); b.classList.remove("lat");
  b.textContent = szoveg;
  var W = host.clientWidth || L.elr.w, px = x / L.elr.w * W, bw = b.offsetWidth, bal = Math.max(bw / 2 + 6, Math.min(W - bw / 2 - 6, px));
  b.style.left = bal + "px"; b.style.top = Math.max(12, y / L.elr.h * 100) + "%";
  b.style.setProperty("--nyil", Math.max(18, Math.min(bw - 18, px - bal + bw / 2)) + "px");
  void b.offsetWidth; b.classList.add("lat");
  if (mp) b._t = setTimeout(function () { b.classList.remove("lat"); }, mp * 1000);
  mondd(szoveg);
}
function legeloFolott(g) { var p = LEGELO.elr.hely[LEGELO.sor.indexOf(g.dataset.l)], fekve = /alszik|mely/.test(g.dataset.all); return [+g.dataset.x, p[1] - (fekve ? 105 : 150) * p[2]]; }
/* egy ébren lévő unikornis mondja (ha mind alszik, bármelyik) */
function legeloSzolEgy(mondat, mp) {
  var gk = [].slice.call(LEGELO.svg.querySelectorAll(".lg-uni")), eb = gk.filter(function (g) { return !/alszik|mely/.test(g.dataset.all); });
  var f = legeloFolott(veletlenElem(eb.length ? eb : gk));
  legeloBub(f[0], f[1], mondat, mp);
}
function legeloBillent(t) { var tb = t.querySelector(".ny-tabla"); if (!tb) return; tb.classList.remove("ebred"); void tb.getBoundingClientRect(); tb.classList.add("ebred"); }
function legeloUgrik(ir) {
  if (!ir || nyugiMod()) return;
  ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); void ir.getBoundingClientRect();
  ir.classList.add("uni-mozd-ugras", "ny-ugrik");
  setTimeout(function () { ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); }, 1150);
}

/* ── koppintás egy unikornisra: a mélyen alvó csak megrezzen; a többi felébred / felkapja a fejét, odaüget, köszön ── */
function legeloKopp(g) {
  var L = LEGELO;
  if (L.valaszt) return;
  var l = g.dataset.l, a = g.dataset.all, ir = g.querySelector(".irany"), alv = g.querySelector(".lg-alv"), E = L.elr;
  if (a === "mely") {
    hangGomb();
    var f = legeloFolott(g); legeloBub(f[0], f[1], LEGELO_MONDAT.mely, 3);
    var pp = g.querySelector(".lg-paplan"); if (pp) { pp.classList.remove("rezzen"); void pp.getBoundingClientRect(); pp.classList.add("rezzen"); }
    return;
  }
  L.valaszt = true; hangGomb();
  clearTimeout(g._setaT); g.style.transition = ""; g.dataset.all = "ebren";
  var bb = L.host.querySelector(".ny-bub"); if (bb) bb.classList.remove("lat");
  L.svg.querySelectorAll(".lg-gyuru").forEach(function (r) { r.innerHTML = ""; });
  g.querySelector(".lg-jel").innerHTML = "";
  L.svg.querySelectorAll(".lg-uni").forEach(function (m) { if (m !== g) m.classList.add("halvany"); });
  mentes.leny = l; ment();
  var indul = function () {
    var k = E.kozep, x = +g.dataset.x;
    g.parentNode.insertBefore(g, L.svg.querySelector(".lg-felso"));   /* előre kerül */
    uniFordul(ir, k[0] >= x ? 1 : -1, function () {
      if (!nyugiMod()) uniJar(ir, { mod: "uget", tempo: 1.2 });
      g.style.transition = "transform 1.1s ease-in-out";
      legeloHelyez(g, k[0], k[1], k[2]);
      legeloKesobb(function () {
        uniAll(ir); legeloUgrik(ir);
        if (L.mod === "ujonc") { legeloKesobb(function () { L.kesz(l); }, 1500); return; }   /* az első percben a név-felhők jönnek */
        legeloBub(k[0], k[1] - 150 * k[2], legeloKoszon(l));
        legeloKesobb(function () { var b = L.host.querySelector(".ny-bub"); if (b) b.classList.remove("lat"); L.kesz(l); }, 2800);
      }, nyugiMod() ? 0 : 1100);
    });
  };
  if (a === "alszik") {
    alv.classList.remove("fekszik-all"); uniFelebred(alv);
    legeloKesobb(function () { uniNyujtozik(alv, function () { legeloKesobb(indul, 150); }); }, 650);
  } else { uniAll(ir); ir.classList.remove("uni-mozd-eszik"); legeloKesobb(indul, 300); }
}
/* köszönés: hol jártak legutóbb; akivel még sosem játszott, az örül */
function legeloKoszon(l) {
  var n = nyitoNev(), p = mentes.profilok[l] || {}, h = LEGELO_HOVA[p.utolsoLiget];
  if (h) return (n ? LEGELO_MONDAT.vissza.replace("{n}", n) : LEGELO_MONDAT.visszaN).replace("{h}", h);
  if (legeloSosem(l)) return n ? LEGELO_MONDAT.uj.replace("{n}", n) : LEGELO_MONDAT.ujN;
  return n ? veletlenElem(NYITO_KOSZON).replace("{n}", n) : veletlenElem(NYITO_KOSZON_N);
}

/* „👋 Másik gyerek” (átmeneti kijárat a 2. kör kis kapujáig): belépve két koppintás — az első csak kérdez (a gyerek
   véletlenül ne lépjen ki), a második kilép (felhoKilep → belépő); kód nélkül egyből a belépő kártya jön */
function legeloMasik() {
  var L = LEGELO;
  if (L.valaszt) return;
  hangGomb();
  var kod = FELHO.aktiv ? FELHO.kod : FELHO.offline && FELHO.offline.kod;
  var b = L.host.querySelector(".ny-bub"); if (b) b.classList.remove("lat");
  if (!kod) { belepoMutat(null); return; }
  if (L.masikT) { clearTimeout(L.masikT); L.masikT = null; felhoKilep(); return; }
  legeloBub(L.elr.masik[0], L.elr.masik[1] - 90 * L.elr.masik[2], "Kilépsz, " + jatekosNev(kod) + "? Koppints még egyszer!", 5);
  L.masikT = setTimeout(function () { L.masikT = null; }, 5000);
}

/* elfordították a telefont: a legelő újrarajzolódik a másik elrendezésben (ugyanazokkal az állapotokkal) */
window.addEventListener("resize", function () {
  var L = LEGELO;
  if (!L.host || L.valaszt || !L.svg || !L.svg.isConnected || !L.host.closest(".kepernyo.aktiv")) return;
  var allo = window.innerHeight > window.innerWidth * 1.15;
  if (allo === L.host.classList.contains("allo")) return;
  clearTimeout(L.forgT);
  L.forgT = setTimeout(function () { if (!L.valaszt) legeloRajzol(L.host, L.mod, L.kesz, true); }, 200);
});

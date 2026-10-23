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
   🚪 BELÉPÉS ÉS KILÉPÉS A LEGELŐN (2. kör, 2026-10-23):
     • Senki nincs belépve (mod "belepo", legeloBelepo): mind az öt unikornis ALAP kinézetben, a tábla üres, a fehér gyűrű
       a táblát hívja. A táblára vagy bármelyik unikornisra koppintva a képen nyílik a belépő mező (auth.js belepoProbal);
       rossz belépőre a tábla mondja: „Ezt nem ismerem. Nézd meg még egyszer!”. A gép többi gyerekének neve sehol sem látszik.
     • Belépéskor (a felhő / 📴 a hátizsák megjött: nyitoFrissit) csillámfelhő száll át a réten balról jobbra: ahol elhalad,
       ott az unikornis felveszi a gyerek kinézetét, a táblára a neve kerül — aztán jön a választás ("valaszt").
     • A kis kapu a rét jobb szélén, mögötte ösvény ki a képből: csak a kilépésé. Belépés előtt csak megbillen; belépve az első
       koppintás kérdez („Tényleg kilépsz, Petra?”), a második kinyitja és kilép (felhoKilep → üres tábla).
       Felhő nélkül játszva (a „felhő nélkül játszom” után) a kapu a belépő legelőre visz.
   A következő kör: 3. a titkos képes lakat a tábla oszlopán + a pult. */

var LEGELO = { host: null, mod: null, elr: null, svg: null, tok: 0, valaszt: false, kesz: null, sor: null, allapot: null, legelT: null, nogatT: null, kapuT: null, kapuKerd: false, felho: false };
/* elrendezések a kép egységeiben — hely: [x, y (a pata), méret, irány]; az első kettő elöl áll */
var LEGELO_ELR = {
  fekvo: { w: 800, h: 460, hz: 150, cim: function () { return nyCim(66, 42); },
    hely: [[110, 430, .78, 1], [600, 438, .8, -1], [395, 352, .62, 1], [262, 318, .54, -1], [520, 312, .54, 1]],
    tabla: [300, 458, .8], kapu: [700, 772, 428], kozep: [420, 440, 1], felhoY: 300, felhoS: 1.7,
    fu: function () { return [nyFu(60, 446), nyFu(350, 452), nyFu(480, 444), nyFu(745, 452), nyViragok([[40, 432], [190, 450], [370, 440], [470, 456], [560, 448], [680, 452], [790, 444]])].join(""); } },
  allo: { w: 400, h: 760, hz: 300, cim: function () { return '<g transform="translate(200 0) scale(.78) translate(-400 0)">' + nyCim(150, 44) + '</g>'; },
    hely: [[105, 704, .78, 1], [290, 696, .76, -1], [165, 450, .44, -1], [70, 468, .44, 1], [258, 470, .44, -1]],
    tabla: [175, 585, .7], kapu: [322, 388, 560], kozep: [200, 706, .95], felhoY: 560, felhoS: 1.3,
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
  mely: "Ő még alszik. Hamarosan felébred!",
  belepo: "Írd be a belépődet!", kilep: "Tényleg kilépsz, {n}?", kilepN: "Tényleg kilépsz?"
};

/* ── nyitás: a nyitókép és a 🦄 Váltás (megtart: ugyanaz a kép marad, csak a felhő adatai frissültek) ── */
function legeloNyit(megtart) {
  var host = $("nyito-szin");
  NYITO.mod = "sajat"; NYITO.tovabb = false; NYITO.varKezd = 0;
  clearTimeout(NYITO.varT);
  belepoRejt();
  legeloRajzol(host, "valaszt", function (l) { nyitoTovabb(l); }, megtart && LEGELO.host === host && LEGELO.mod === "valaszt");
  $("nyito-szuloi").hidden = false;
  mutat("kepernyo-nyito");
}
/* 🚪 senki nincs belépve (auth.js belepoMutat): alap kinézet, üres tábla — a tábla kéri a belépőt */
function legeloBelepo() {
  var host = $("nyito-szin");
  if (NYITO.mod === "belepo" && LEGELO.mod === "belepo" && LEGELO.svg && LEGELO.svg.isConnected && $("kepernyo-nyito").classList.contains("aktiv")) return;   /* már ott van (talán épp gépel) */
  NYITO.mod = "belepo"; NYITO.tovabb = false; NYITO.kihagy = false;
  clearTimeout(NYITO.varT);
  legeloRajzol(host, "belepo", null);
  $("nyito-szuloi").hidden = true;   /* belépés előtt a gépen lévő mentés nem a belépőé */
  mutat("kepernyo-nyito");
}
/* mod: "belepo" | "valaszt" | "ujonc"; kesz(leny): a választott unikornis odaért és köszönt */
function legeloRajzol(host, mod, kesz, megtart) {
  var L = LEGELO;
  L.tok++; clearInterval(L.legelT); clearInterval(L.nogatT); clearTimeout(L.kapuT); L.kapuKerd = false; L.felho = false;
  var allo = window.innerHeight > window.innerWidth * 1.15;
  host.classList.toggle("allo", allo);
  if (!megtart || !L.sor || L.mod !== mod) { L.sor = legeloSor(mod); L.allapot = legeloKever(L.sor, mod); }
  L.host = host; L.mod = mod; L.kesz = kesz; L.valaszt = false; L.elr = LEGELO_ELR[allo ? "allo" : "fekvo"];
  var E = L.elr, nev = mod === "belepo" ? "" : nyitoNev(), s = '<svg viewBox="0 0 ' + E.w + ' ' + E.h + '" class="uni-terep" xmlns="http://www.w3.org/2000/svg">' + nyDefs() + nyRetHatter(E.w, E.h, E.hz);
  s += E.cim() + E.fu();
  var tetel = L.sor.map(function (l, i) { return [E.hely[i][1], legeloUniG(l, E.hely[i])]; });
  if (mod !== "ujonc" || nev) tetel.push([E.tabla[1], '<g class="lg-tabla-g" transform="translate(' + E.tabla[0] + ' ' + E.tabla[1] + ') scale(' + E.tabla[2] + ')">' + legeloTablaBelso(nev) + '</g>']);
  if (mod !== "ujonc") tetel.push([E.kapu[2] - 1, legeloKapuG(E)]);
  tetel.sort(function (a, b) { return a[0] - b[0]; });
  s += tetel.map(function (t) { return t[1]; }).join("");
  var mezo = host.querySelector(".lg-mezo");   /* a belépő mező túléli az újrarajzolást (telefon elfordítása gépelés közben) */
  host.innerHTML = nySajatId(s + '<g class="lg-felso"></g></svg>') + '<div class="ny-atfed"></div>';
  if (mezo && mod === "belepo") host.appendChild(mezo);
  L.svg = host.querySelector("svg");
  L.svg.querySelectorAll(".lg-uni").forEach(function (g) {
    legeloNezoAdat(g);
    legeloAllapot(g, L.allapot[g.dataset.l]);
    g.addEventListener("click", function () { legeloKopp(g); });
  });
  var t = L.svg.querySelector(".lg-tabla-g");
  if (t) t.addEventListener("click", function () { hangGomb(); if (L.mod === "belepo") legeloBelepoKer(); else legeloBillent(t); });
  var k = L.svg.querySelector(".lg-kapu-fog");
  if (k) k.addEventListener("click", legeloKapu);
  if (mod !== "belepo") legeloKesobb(function () { legeloKerdez(); }, 700);
  legeloMozgat();
}
/* a háttérmozgás: egyszerre csak egyikük hajol le a fűhöz; ha a gyerek vár, egyikük felugrik (belépés előtt nem) */
function legeloMozgat() {
  var L = LEGELO, tok = L.tok;
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
    if (L.valaszt || L.felho || L.mod === "belepo" || L.svg.querySelector(".irany.uni-mozd-eszik")) return;
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
  return '<g class="lg-uni ny-mozgo" data-l="' + l + '" data-x="' + p[0] + '" style="transform:translate(' + p[0] + 'px,' + p[1] + 'px) scale(' + p[2] + ')">' +
    '<g class="irany" style="--dir:' + p[3] + ';transform:scale(var(--dir,1),1)"><g class="lg-gyuru"></g><g class="lg-alv"><g class="lg-rajz">' +
    legeloUniRajz(l, "") + '</g></g><g class="lg-jel"></g></g>' +
    '<rect x="-100" y="-150" width="200" height="162" fill="transparent"/></g>';
}
/* belépés előtt alap kinézet (a gépen lévő mentés nem a belépőé); utána a gyerek beállításai */
function legeloKinezet(l) { var p = LEGELO.mod === "belepo" ? {} : mentes.profilok[l] || {}; return { oltozet: p.oltozet || null, kinezet: p.kinezet || null }; }
function legeloUniRajz(l, ut) { var k = legeloKinezet(l); return unikornisSVG("lg-" + l + "-" + LEGELO.tok + ut, LENYEK[l], 1, k.oltozet, k.kinezet); }
function legeloNezoAdat(g) {   /* a fordulás szemből-képéhez (a hívó adja a színeket, különben a Tűz színeit kapná) */
  var l = g.dataset.l, k = legeloKinezet(l);
  uniNezoAdat(g.querySelector(".irany"), { rajz: LENYEK[l].rajz, kinezet: k.kinezet, oltozet: k.oltozet });
}
/* a tábla: a játszó gyerek neve; belépés előtt üres, és a fehér gyűrű hívja (ide kell koppintani) */
function legeloTablaBelso(nev) {
  return nyTabla(0, 0, nev) + (LEGELO.mod === "belepo" ? '<ellipse class="ny-koppints" cx="0" cy="-79" rx="72" ry="38" fill="none" stroke="#ffffff" stroke-width="4"/>' : "") +
    '<rect x="-70" y="-110" width="140" height="116" fill="transparent"/>';
}
/* a kis kapu a rét jobb szélén (K: [bal oszlop x, jobb oszlop x, talaj y]); mögötte ösvény vezet ki a képből */
function legeloKapuG(E) {
  var K = E.kapu, x1 = K[0], x2 = K[1], yb = K[2], W = E.w, h = 96, s = "";
  var oszlop = function (x) { return '<rect x="' + (x - 7) + '" y="' + (yb - h) + '" width="14" height="' + h + '" rx="3" fill="#a4734a" stroke="#6e4a36" stroke-width="2"/><path d="M' + (x - 10) + ' ' + (yb - h + 1) + 'l10 -10l10 10z" fill="#8a6248" stroke="#6e4a36" stroke-width="2" stroke-linejoin="round"/>'; };
  var lec = function (xa, xb) { return '<path d="M' + xa + ' ' + (yb - 66) + 'H' + xb + 'M' + xa + ' ' + (yb - 30) + 'H' + xb + '" stroke="#b98a5e" stroke-width="7" stroke-linecap="round"/>'; };
  var karo = function (x) { return '<path d="M' + (x - 5) + ' ' + yb + 'V' + (yb - 78) + 'l5 -8l5 8V' + yb + 'z" fill="#c99a6a" stroke="#6e4a36" stroke-width="1.6"/>'; };
  s += '<g class="lg-kapu"><path d="M' + (x1 + 4) + ' ' + (yb + 8) + 'Q' + ((x1 + x2) / 2) + ' ' + (yb - 6) + ' ' + (W + 10) + ' ' + (yb - 26) + 'V' + (yb - 6) + 'Q' + ((x1 + x2) / 2 + 10) + ' ' + (yb + 12) + ' ' + (x1 + 4) + ' ' + (yb + 22) + 'Z" fill="#ecd9b4" stroke="#d2b98e" stroke-width="1.6"/>' +
    '<circle cx="' + (x2 + 4) + '" cy="' + (yb - 4) + '" r="2.4" fill="#cdb48a"/><circle cx="' + (x1 + 30) + '" cy="' + (yb + 10) + '" r="2" fill="#cdb48a"/>' +
    '<g filter="url(#lt-firka)">' + lec(x2, W + 10) + lec(x1 - 64, x1) + karo(x1 - 48) + karo(x1 - 24) + (W - x2 > 24 ? karo(x2 + 22) : "") + oszlop(x2);
  var aw = x2 - x1 - 14, ax = x1 + 7;
  s += '<g class="lg-ajto"><rect x="' + ax + '" y="' + (yb - 84) + '" width="' + aw + '" height="72" rx="4" fill="rgba(233,201,160,.35)" stroke="#8a6248" stroke-width="5"/>';
  for (var i = 1; i < 4; i++) s += '<path d="M' + (ax + aw * i / 4) + ' ' + (yb - 82) + 'V' + (yb - 14) + '" stroke="#b98a5e" stroke-width="4"/>';
  s += '<path d="M' + (ax + 4) + ' ' + (yb - 16) + 'L' + (ax + aw - 4) + ' ' + (yb - 80) + '" stroke="#8a6248" stroke-width="5" stroke-linecap="round"/></g>' + oszlop(x1) + '</g>';
  s += ltRozsa(x1 - 12, yb + 2, 5, "#f6a5c0") + ltRozsa(x2 + 12, yb + 4, 4, "#fce49a") + ltRozsa(x1 + 30, yb + 6, 4, "#c9a8e6");
  return s + '<rect class="lg-kapu-fog" x="' + (x1 - 6) + '" y="' + (yb - 100) + '" width="' + (x2 - x1 + 14) + '" height="104" fill="transparent"/></g>';
}
/* „Kivel játszol ma, Petra?” (az első percben: „Melyikünk legyen a barátod?”) */
function legeloKerdez() {
  var nev = nyitoNev(), m = LEGELO.mod === "ujonc" ? EP_MONDAT.valaszt : nev ? LEGELO_MONDAT.kerdez.replace("{n}", nev) : LEGELO_MONDAT.kerdezN;
  legeloSzolEgy(m);
}
function legeloAllapot(g, a) {
  var alv = g.querySelector(".lg-alv");
  g.dataset.all = a;
  g.classList.toggle("valaszthato", a !== "mely" && LEGELO.mod !== "belepo");
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
  g.querySelector(".lg-gyuru").innerHTML = !L.valaszt && !L.felho && L.mod !== "belepo" && a !== "mely"
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
  if (L.valaszt || L.felho) return;
  var l = g.dataset.l, a = g.dataset.all, ir = g.querySelector(".irany"), alv = g.querySelector(".lg-alv"), E = L.elr;
  if (L.mod === "belepo") { hangGomb(); if (a === "legel") legeloUgrik(ir); legeloBelepoKer(); return; }   /* belépés előtt az unikornis is a belépőt kéri */
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

/* ── 🚪 a belépő mező a képen (a tábla fölött); a belépés maga: auth.js belepoProbal ── */
function legeloTablaSzol(szoveg, mp) { var T = LEGELO.elr.tabla; legeloBub(T[0], T[1] - 92 * T[2], szoveg, mp); }
function legeloMezo() {
  var host = $("nyito-szin"), m = host.querySelector(".lg-mezo");
  if (m) return m;
  m = el("div", "lg-mezo"); m.hidden = true;
  m.innerHTML = '<input maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="pl. CSILLAG-42" aria-label="Belépő">' +
    '<button class="be">Belépek ➜</button><button class="masod megse">Mégse</button><button class="lg-kihagy" hidden>most felhő nélkül játszom</button>';
  host.appendChild(m);
  var inp = m.querySelector("input"), be = m.querySelector(".be");
  function kuld() {
    if (be.disabled) return;
    var v = inp.value.trim();
    if (!v) { inp.focus(); return; }
    hangGomb(); nyBubEl(host);
    be.disabled = true; be.textContent = "Egy pillanat…";
    belepoProbal(v, function (szoveg) { legeloMezoGomb(); legeloTablaSzol(szoveg, 4); try { inp.select(); } catch (e) {} });
  }
  be.addEventListener("click", kuld);
  inp.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") kuld(); });
  m.querySelector(".megse").addEventListener("click", function () { hangGomb(); belepoRejt(); nyBubEl(host); });
  m.querySelector(".lg-kihagy").addEventListener("click", function () { hangGomb(); NYITO.kihagy = true; legeloNyit(); });   /* csak ahol még senki nem lépett be kóddal */
  return m;
}
function legeloMezoGomb() { var b = $("nyito-szin").querySelector(".lg-mezo .be"); if (b) { b.disabled = false; b.textContent = "Belépek ➜"; } }
/* a tábla (vagy egy unikornis) megkoppintva: a tábla megbillen, kéri a belépőt, és megnyílik a mező */
function legeloBelepoKer() {
  var L = LEGELO;
  if (L.mod !== "belepo" || L.valaszt) return;
  var t = L.svg.querySelector(".lg-tabla-g"), m = legeloMezo(), inp = m.querySelector("input");
  if (t) legeloBillent(t);
  legeloTablaSzol(LEGELO_MONDAT.belepo, 4);
  m.querySelector(".lg-kihagy").hidden = gepJatekosok().length > 0;   /* ahol már léptek be kóddal, a felhő nélküli játék csak elveszne */
  if (m.hidden) { legeloMezoGomb(); inp.value = ""; }
  m.hidden = false;
  setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 50);
}
function legeloMezoRejt() { var m = $("nyito-szin").querySelector(".lg-mezo"); if (m) { m.hidden = true; try { m.querySelector("input").blur(); } catch (e) {} } }

/* ── ✨ csillámfelhő: belépéskor balról jobbra átszáll a réten; ahol elhalad, ott az unikornis felveszi a gyerek kinézetét,
   a táblára a neve kerül (az újonc első két hetében a többiek közben mély álomba merülnek); utána jön a választás ── */
function legeloFelho() {
  var L = LEGELO, E = L.elr, tok = L.tok;
  NYITO.mod = "sajat"; NYITO.tovabb = false; NYITO.varKezd = 0;
  belepoRejt(); nyBubEl(L.host);
  L.mod = "valaszt"; L.kesz = function (l) { nyitoTovabb(l); }; L.felho = true; L.kapuKerd = false;
  $("nyito-szuloi").hidden = false;
  var ny = nyitasMenet(), mely = ny && nyitasHely("unikornisok") === "alszik", sc = E.felhoS, cs = "";
  var puff = [[-60, 10, 34], [-26, -14, 42], [16, -20, 46], [56, -4, 36], [84, 16, 26], [-84, 22, 24], [0, 18, 40], [40, 22, 30]];
  for (var i = 0; i < 14; i++) cs += csillagSVG(-110 + Math.random() * 220, -60 + Math.random() * 110, 3 + Math.random() * 5, ["#ffd24d", "#f6a5c0", "#c9a8e6", "#9ec9f0", "#ffffff"][i % 5]);
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "lg-csf");
  g.innerHTML = '<g opacity=".93">' + puff.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + (p[1] + 4) + '" r="' + p[2] + '" fill="#e6dcf5"/>'; }).join("") +
    puff.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="#ffffff"/>'; }).join("") + '</g><g class="cs">' + cs + '</g>';
  L.svg.querySelector(".lg-felso").appendChild(g);
  var ki = [].map.call(L.svg.querySelectorAll(".lg-uni"), function (u) { return { el: u, x: +u.dataset.x, kesz: false }; });
  var tabla = { x: E.tabla[0], kesz: false };
  var x0 = -170 * sc, x1 = E.w + 170 * sc, ido = nyugiMod() || window.__UC_GYORS ? 1 : 2700, t0 = performance.now();
  (function lep(most) {
    if (tok !== L.tok || !L.svg.isConnected) { L.felho = false; return; }
    var q = Math.min(1, Math.max(0, (most - t0) / ido)), x = x0 + (x1 - x0) * q;
    g.setAttribute("transform", "translate(" + x.toFixed(1) + " " + (E.felhoY + Math.sin(q * 6) * 8).toFixed(1) + ") scale(" + sc + ")");
    ki.forEach(function (u) { if (!u.kesz && x >= u.x) { u.kesz = true; legeloCsere(u.el, mely && u.el.dataset.l !== ny.k); } });
    if (!tabla.kesz && x >= tabla.x) {
      tabla.kesz = true;
      var tg = L.svg.querySelector(".lg-tabla-g");
      if (tg) { tg.innerHTML = nySajatId(legeloTablaBelso(nyitoNev())); legeloBillent(tg); }
      legeloRobban(E.tabla[0], E.tabla[1] - 80 * E.tabla[2]);
    }
    if (q < 1) { requestAnimationFrame(lep); return; }
    g.remove(); L.felho = false;
    L.svg.querySelectorAll(".lg-uni").forEach(legeloJel);   /* most kerül a fehér gyűrű a lábuk alá */
    legeloKesobb(legeloKerdez, 400);
  })(t0);
}
function legeloCsere(g, melyLesz) {
  var L = LEGELO, l = g.dataset.l, alv = g.querySelector(".lg-alv"), ir = g.querySelector(".irany"), p = L.elr.hely[L.sor.indexOf(l)];
  if (melyLesz && g.dataset.all !== "mely") {   /* az újonc első két hetében a többiek mélyen alszanak */
    clearTimeout(g._setaT); g.style.transition = ""; legeloHelyez(g, p[0], p[1], p[2]);
    uniAll(ir); ir.classList.remove("uni-mozd-eszik");
    L.allapot[l] = "mely";
  }
  g.querySelector(".lg-rajz").innerHTML = legeloUniRajz(l, "b");
  legeloNezoAdat(g);
  if (melyLesz) legeloAllapot(g, "mely");
  else {
    if (/alszik|mely/.test(g.dataset.all)) uniElalszik(alv, true);
    g.classList.toggle("valaszthato", g.dataset.all !== "mely");
    legeloJel(g);
  }
  legeloRobban(+g.dataset.x, p[1] - 70 * p[2]);
}
function legeloRobban(x, y) {
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g"), s = "";
  for (var i = 0; i < 7; i++) { var a = i * 2 * Math.PI / 7; s += csillagSVG(Math.cos(a) * 30, Math.sin(a) * 30, 7, ["#ffd24d", "#f6a5c0", "#c9a8e6", "#9ec9f0"][i % 4]); }
  g.setAttribute("transform", "translate(" + x + " " + y + ")");
  g.innerHTML = '<g class="ny-robban">' + s + '</g>';
  LEGELO.svg.querySelector(".lg-felso").appendChild(g);
  setTimeout(function () { g.remove(); }, 1200);
}

/* ── 🚪 a kis kapu: belépés előtt csak megbillen; belépve az első koppintás kérdez (egy kisebb gyerek ne lépjen ki
   véletlenül), a második kinyitja → kilépés (felhoKilep: mentés a hátizsákba → üres tábla). Felhő nélkül játszva a
   belépő legelőre visz. ── */
function legeloKapu() {
  var L = LEGELO;
  if (L.valaszt || L.felho) return;
  hangGomb();
  var a = L.svg.querySelector(".lg-ajto"), K = L.elr.kapu, kod = FELHO.aktiv ? FELHO.kod : FELHO.offline && FELHO.offline.kod;
  if (L.mod === "belepo" || !kod && !FELHO.be) { a.classList.remove("billeg"); void a.getBoundingClientRect(); a.classList.add("billeg"); return; }
  if (!L.kapuKerd) {
    L.kapuKerd = true; a.classList.add("nyikordul");
    legeloBub((K[0] + K[1]) / 2, K[2] - 108, kod ? LEGELO_MONDAT.kilep.replace("{n}", jatekosNev(kod)) : LEGELO_MONDAT.kilepN, 5);
    clearTimeout(L.kapuT);
    L.kapuT = setTimeout(function () { L.kapuKerd = false; a.classList.remove("nyikordul"); }, 5000);
    return;
  }
  clearTimeout(L.kapuT); L.kapuKerd = false; L.valaszt = true; nyBubEl(L.host);
  L.svg.querySelectorAll(".lg-gyuru").forEach(function (r) { r.innerHTML = ""; });
  a.classList.remove("nyikordul"); a.classList.add("nyit");
  var f = L.host.querySelector(".ny-atfed");
  legeloKesobb(function () {
    if (f) f.classList.add("be");
    legeloKesobb(function () { if (kod) felhoKilep(); else legeloBelepo(); }, 520);
  }, 900);
}

/* elfordították a telefont: a legelő újrarajzolódik a másik elrendezésben (ugyanazokkal az állapotokkal) */
window.addEventListener("resize", function () {
  var L = LEGELO;
  if (!L.host || L.valaszt || L.felho || !L.svg || !L.svg.isConnected || !L.host.closest(".kepernyo.aktiv")) return;
  var allo = window.innerHeight > window.innerWidth * 1.15;
  if (allo === L.host.classList.contains("allo")) return;
  clearTimeout(L.forgT);
  L.forgT = setTimeout(function () { if (!L.valaszt) legeloRajzol(L.host, L.mod, L.kesz, true); }, 200);
});

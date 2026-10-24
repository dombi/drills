/* ============ 6h2) 🏪 TÜSKE NÉNI BOLTJA — a bolt képe és játékmenete (Piactér 3. kör, 2026-10-23) ============
   Terv: terv/eletszeru-100-as-palyak-terv.html 3. pont · rajz: terv/piacter-rajzterv.html 4–6. pont (✅ mind jóváhagyva 2026-10-23).
   A feladatot a bolt.js gyártja és ellenőrzi (kép nélkül); itt csak a kép és a kezelés van. Egy pálya (constants.js):
     Rajt → 🪙 Fizesd ki! → 💰 Visszajáró → 🦊 A róka blokkja → Odú-küszöb (vegyesen).
   MIT CSINÁL A GYEREK A KÉPEN?
     ① Fizesd ki! — a vevő erszényéből érmét koppint: az unikornisa szarvával átlebegteti a pultra (a pult NEM írja ki az
        összeget). „Kész” → Tüske néni érménként, hangosan összeszámolja. Pósa-folyam ugyanarra az árra: fizesd ki ·
        másképp is · a legkevesebb érmével; aztán egy új ár, rögtön a legkevesebbel. Kevés: üres hely a cédula mellett,
        Tüske néni vár. Sok: a vevő visszatol egy érmét.
     ② Visszajáró — a vevő nagyobbal fizet; a gyerek a kasszából a vevő tenyerébe lebegtet, és a szalag vele lép
        (37 → 40 → 50). Fokok: tízesre · tízesből · teljes · százból. Kevés: a vevő a tenyerére néz, és vár. Sok: „Ez sok!”, visszaad egyet.
     ③ A róka blokkja — Zsivány felírja, a gyerek előbb becsül („körülbelül stimmel?”), aztán az unikornis szarva pecsétet üt
        az eredményre: ✓ vagy ✗. 🔒 A ✗ csak jó javítással ér, a ✓ csak pontos blokkon. Hibás blokkra ✓: a vevő hazaér, és a tízes
        rudakon látszik, mi hiányzik — a szám nem.
   2 hiba után sincs kiírt megoldás: a kép segít tovább (① a pulton megjelenik az eddigi összeg, ② a szalagon a cél
   zászlója, ③ a két szám tízes rudakban).
   A motorral a mérés koppintós kártyáinak útján beszél: rossz → rosszValaszKonyvel, jó → ertekel(f.helyes) (engine-logic.js).
   A kép a buborékban van (#bk-panel); a pálya ösvénye az állomások között látszik.
   🐉 KISSÁRKÁNY A BOLTBAN (2026-10-24, terv/kissarkany-a-boltban-terv.html + kissarkany-bolt-rajzterv.html): ha a gyereknek van
   kísérő kölyke (lenyKiserVan), a kölyök átveszi Brekus és Kata helyét a vevők között (①② kb. minden második vevő), és
   ③ a róka blokkját mindig ő hozza. A gyerek saját kölyke, a saját nevével és ruháiban (kolyok-mozdul.js KolyokFig), az odú
   arányában kisebb az unikornisnál: a pult mögött zsámolyon áll, ②-nél kis fatálat tart, ③-nál a pult előtt áll.
   A róka neve mindenhol Zsivány (constants.js FIGURA.juli; a belső kulcs „juli” maradt).
   🔥 BEVÁLTÁS SÁRKÁNYTŰZZEL (2026-10-24, terv/bevaltas-sarkanytuz-terv.html + bevaltas-rajzterv.html): a visszajáró „tízesből”
   fokánál (kb. minden negyediknél, az Odú-küszöbön nem) előbb elfogy a tízes. A gyerek a tízes-keretbe rakja a kassza tallérjait
   (mindegyik annyi helyet foglal, amennyit ér; ami nem fér, visszapattan), aztán megkoppintja a kölyköt (kölyök nélkül az
   unikornisát): tele keretnél tűz + egy tízessé olvad, félig töltöttnél füstpöff. A pálya első két beváltása csak egyesekkel,
   utána vegyesen (1, 2, 5). 🔒 A beváltás nem ad jutalmat és nem könyvelődik: ✨ csak a jó visszajáró után jár. */

var BK_ARUK = [["🍎", "alma"], ["🧀", "sajt"], ["🍯", "méz"], ["🥕", "répa"], ["🍞", "kenyér"], ["🍐", "körte"], ["🧈", "vaj"], ["🍓", "eper"], ["🥛", "tej"], ["🍪", "keksz"]];
var BK_VEVOK = ["brumi", "mia", "cincin", "brekus", "kata", "potyi", "tas", "kitti"];
var BK_VEVOK_KOLYOKKEL = BK_VEVOK.filter(function (v) { return v !== "brekus" && v !== "kata"; });   /* a kölyök a béka és a katica helyére jön */
var BK_K_HELY = [650, 268], BK_K_BLOKK = [690, 396], BK_K_VB = [650, 140], BK_K_BB = [680, 258], BK_TAL = [600, 288];   /* a kölyök talppontja, buborékja, tálja */
var BK_ER = { 1: 14, 2: 15, 5: 16.5, 10: 18.5, 20: 20, 50: 22, 100: 24 };   /* az érme sugara: a nagyobb érték nagyobb korong */
var BK_KASSZA = [1, 2, 5, 10, 20, 50];
var BK_TB = [118, 46], BK_VB = [656, 54];   /* Tüske néni és a vevő buborékjának helye */
var BK_TARGY = [452, 318], BK_TENYER = [652, 300];
var BK_BLOKK_X = 296, BK_PECSET_Y = 372;
var BK_DEFS = '<linearGradient id="bkFa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9c193"/><stop offset="1" stop-color="#d6a46f"/></linearGradient>';
var BK_F = 'font-family="Fredoka,Segoe UI,sans-serif"';
var BK = null;   /* a kirakott kép állapota: { J, forma, svg, tuske, uni, juli, f, ermek, lezart, … } */
/* az ösvény sátrai (a pálya-kép a vásártér: vasar.js vasarJelenetSVG) */
VS_SZIN.fizet = { teto: "#fce49a", csik: "#fff", sotet: "#c9953a", cimer: "🪙" };
VS_SZIN.vissza = { teto: "#a7d99a", csik: "#fff", sotet: "#5e9a52", cimer: "💰" };
VS_SZIN.blokk = { teto: "#f7b98a", csik: "#fff", sotet: "#b35f28", cimer: "🦊" };

/* ── a tallér: arany korong, rajta a helyi érték színe (HE_SZIN: egyes rózsaszín, tízes kék, a százas arany marad) ── */
function tallerBelso(v, k) {
  var r = BK_ER[v] * (k || 1), arany = HE_SZIN[100], c = HE_SZIN[heHely(v)], sajat = heHely(v) !== 100;
  return '<circle r="' + r.toFixed(1) + '" fill="url(#' + arany.g + ')" stroke="' + arany.k + '" stroke-width="2.2"/>' +
    (sajat ? '<circle r="' + r.toFixed(1) + '" fill="url(#' + c.g + ')" stroke="' + c.k + '" stroke-width="2.2"/>' : '') +
    '<circle r="' + (r - 4).toFixed(1) + '" fill="none" stroke="#fff8dc" stroke-width="1.2" stroke-dasharray="2 2.4" opacity=".9"/>' +
    '<text y="' + (r * .34).toFixed(1) + '" text-anchor="middle" font-size="' + (r * (v >= 100 ? .78 : v >= 10 ? .95 : 1.1)).toFixed(1) + '" ' + BK_F + ' font-weight="600" fill="' + c.sz + '">' + v + '</text>';
}

/* ═════════════════ FELADAT (GEN.bolt) — állomásonként a bolt.js gyártójából ═════════════════
   cfg.allomas: "fizet" | "vissza" | "blokk" | "vegyes" (Odú-küszöb: fizet · vissza · blokk · blokk).
   Az állomás közös állapota J.bolt-ban (a Pósa-folyam ugyanarra az árra, a róka-sor, a vevő). */
function bkAllapot() {
  if (!J.bolt || J.bolt.all !== J.allomasIdx) J.bolt = { all: J.allomasIdx, megold: [], bi: 0, sor: null };
  return J.bolt;
}
/* újoncnak a bolt az előtudás szerint ébred (rajzterv 8. pont); Lilinek, Fanninak (menet nélkül) minden nyitva */
function bkTud(id) { return typeof nyitasMenet !== "function" || !nyitasMenet() || nyitasTudasN(id).length > 0; }
function bkAllomasok(lista) {
  if (bkTud("erdo-melye")) return lista;
  return lista.filter(function (a) { return a.allomas !== "blokk"; }).map(function (a) {   /* a róka blokkja kétjegyű + kétjegyű: még alszik */
    if (a.allomas !== "vegyes") return a;
    var o = {}, k; for (k in a) o[k] = a[k]; o.nelkulBlokk = true; return o;
  });
}
function bkVisszaFok(i) {
  var fok = VISSZA_FOK[i % 4];
  if (fok === "szazbol" && !bkTud("szazas-bujocska")) fok = "teljes";   /* 63 → 100: a Százas bújócska után */
  return fok;
}
/* a vevő erszénye: a legkevesebb érme + a két legkisebb felváltva, hogy legyen „másképp” is (legfeljebb 11 érme) */
var BK_FELVALT = { 50: [20, 20, 10], 20: [10, 10], 10: [5, 5], 5: [2, 2, 1], 2: [1, 1], 1: [] };
function bkTarca(legk) {
  var W = legk.slice(), kicsik = legk.slice().sort(function (a, b) { return a - b; }), db = 0;
  for (var i = 0; i < kicsik.length && db < 2; i++) {
    var f = BK_FELVALT[kicsik[i]];
    if (!f.length || W.length + f.length > 11) continue;
    W = W.concat(f); db++;
  }
  return W.sort(function (a, b) { return b - a; });
}
function bkFizet(st, i, kuszob) {
  /* négyesével: ugyanaz az ár három kérdéssel (fizesd ki · másképp · a legkevesebbel), aztán egy új ár rögtön a legkevesebbel */
  var r = i % 4, lepes = kuszob || r === 3 ? 3 : r + 1, g;
  if (kuszob || r === 0 || r === 3 || !st.g) {
    g = !kuszob && r === 0 ? boltFizetKerek(veletlenElem([30, 40, 60, 70, 80, 90])) : boltFizet({ min: 21, max: 99 });   /* az első ár kerek tízes */
    st.g = g; st.tarca = bkTarca(g.legkevesebb); st.megold = []; st.vevo = bkVevoValaszt("fizet");
  }
  g = st.g;
  var kerd = lepes === 1 ? "Fizesd ki!" : lepes === 2 ? "Másképp is ki lehet?" : "Most a legkevesebb érmével!";
  return { forma: "fizet", g: g, ar: g.ar, lepes: lepes, tarca: st.tarca, elozo: lepes === 2 ? st.megold[0] || null : null, vevo: st.vevo, kerd: kerd,
    naplo: { tipus: "bolt", kerdes: "fizet " + g.ar + " (" + lepes + ")", forma: "b", helyes: g.ar }, helyes: g.ar };
}
function boltFizetKerek(ar) {
  var legk = tallerLegkevesebb(ar, [1, 2, 5, 10, 20, 50]);
  return { forma: "fizet", ar: ar, talca: [1, 2, 5, 10, 20, 50], legkevesebb: legk, minDarab: legk.length, naplo: { tipus: "bolt", kerdes: "fizet " + ar, forma: "b" } };
}
function bkBlokkGen(st, db) {
  var tud = bkTud("erdo-szive"), B = boltBeall(), pontos;
  if (!st.sor) st.sor = rokaSor(Math.max(2, db), B);
  pontos = st.sor[st.bi % st.sor.length]; st.bi++;
  for (var p = 0; p < 60; p++) {   /* az Erdő szíve előtt átvitel nélküli blokkok (rajzterv 8. pont) */
    var b = rokaBlokk(pontos, { tetelek: B.tetelek, hibak: tud ? null : ["tizes", "csere", "egy"] });
    var egyes = 0; b.tetelek.forEach(function (v) { egyes += v % 10; });
    if (tud || egyes < 10) break;
  }
  var aruk = mKever(BK_ARUK).slice(0, b.tetelek.length);
  return { forma: "blokk", b: b, aruk: aruk, vevo: bkVevoValaszt("blokk"), helyes: b.helyes,
    naplo: { tipus: b.naplo.tipus, kerdes: b.naplo.kerdes, forma: "b", helyes: b.helyes } };
}
GEN.bolt = function (cfg) {
  var st = bkAllapot(), i = J.feladatKesz, all = cfg.allomas, kuszob = all === "vegyes", x;
  if (kuszob) all = (cfg.nelkulBlokk ? ["fizet", "vissza", "vissza", "fizet"] : ["fizet", "vissza", "blokk", "blokk"])[i % 4];
  if (all === "fizet") x = bkFizet(st, i, kuszob);
  else if (all === "vissza") {
    var v = boltVissza(kuszob ? "teljes" : bkVisszaFok(i));
    x = { forma: "vissza", v: v, vevo: bkVevoValaszt("vissza"), helyes: v.vissza, bevalt: !kuszob && v.fok === "tizesbol",   /* 🔥 előbb beváltás */
      naplo: { tipus: "kivonas", kerdes: v.naplo.kerdes, forma: "b", helyes: v.vissza } };
  } else x = bkBlokkGen(st, kuszob ? 2 : J.feladatDb);
  var vn = bkVevoNev(x.vevo), kerdes, felolvas;
  if (x.forma === "fizet") { kerdes = x.kerd; felolvas = x.lepes === 1 ? vn + " " + szo(x.ar) + " tallért fizet. Segíts neki kifizetni!" : x.kerd; }
  else if (x.forma === "vissza") { kerdes = "Mennyi jár vissza?"; felolvas = vn + " " + szo(x.v.fizet) + " tallérral fizet egy " + szo(x.v.ar) + " tallérosért. Add vissza a különbséget!"; }
  else {   /* tervlap 2A: az első találkozáskor „Zsivány, a róka”, utána csak „Zsivány” */
    var elso = !J.bkRokaLatta; J.bkRokaLatta = true;
    kerdes = "Jó a róka blokkja?"; felolvas = FIGURA.juli.n + (elso ? ", a róka felírta: " : " felírta: ") + x.b.tetelek.map(szo).join(" meg ") + ", összesen " + szo(x.b.irt) + ". Körülbelül stimmel?";
  }
  return { csalad: "bolt", bolt: x, kartyaHTML: '<span class="bk-kerdes">' + kerdes + '</span>', szoveg: kerdes, felolvas: felolvas,
    helyes: x.helyes, keplet: kerdes, tipp: "", naplo: x.naplo };
};

/* 🐉 a vevő: van kísérő kölyök → ③-nál mindig ő, ①②-nél kb. minden második; nincs → a régi vevők (Brekus és Kata is) */
function bkKolyokVan() { return typeof lenyKiserVan === "function" && lenyKiserVan(); }
function bkVevoValaszt(forma) {
  if (!bkKolyokVan()) return veletlenElem(BK_VEVOK);
  return forma === "blokk" || Math.random() < .5 ? "kolyok" : veletlenElem(BK_VEVOK_KOLYOKKEL);
}
function bkVevoNev(v) { return v === "kolyok" ? lenyTar().nev || "a kölyök" : FIGURA[v].n; }
function bkKolyok() { return !!(BK && BK.f && BK.f.bolt.vevo === "kolyok"); }
function bkVevoBub(szoveg) { var p = bkKolyok() ? (BK.forma === "blokk" ? BK_K_BB : BK_K_VB) : BK_VB; bkBub(p[0], p[1], szoveg, "vevo"); }
function bkTenyerHely() { return bkKolyok() ? BK_TAL : BK_TENYER; }

/* ═════════════════ A PANEL (a buborékban) ═════════════════ */
function bkPanel() {
  var p = $("bk-panel");
  if (!p) {
    p = el("div", "bk-panel"); p.id = "bk-panel";
    p.innerHTML = '<svg id="bk-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" aria-hidden="true"></svg><div id="bk-gombok" class="bk-gombok"></div>';
    var bb = $("bagoly-buborek"); bb.insertBefore(p, $("halld-ujra"));
    p.querySelector("svg").addEventListener("click", bkKatt);
    $("bk-gombok").addEventListener("click", bkGombKatt);
  }
  return p;
}
function bkRejt() {
  var p = $("bk-panel"); if (p) p.hidden = true;
  var k = $("kepernyo-jatek"); if (k) k.classList.remove("bk-be");
  document.removeEventListener("keydown", bkBillentyu);
}
function bkMutat(f) {
  var p = bkPanel(), x = f.bolt, forma = x.forma === "blokk" ? "blokk" : "bolt";
  p.hidden = false; $("kepernyo-jatek").classList.add("bk-be");
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  var svg = $("bk-svg");
  if (!BK || BK.J !== J || BK.forma !== forma || !svg.isConnected || !svg.firstChild) {
    BK = { J: J, forma: forma, svg: svg };
    svg.setAttribute("viewBox", forma === "blokk" ? "0 0 800 400" : "0 0 800 460");
    if (forma === "blokk") bkRokaAlap(); else bkBoltAlap();
  }
  BK.f = f; BK.lezart = false; BK.ermek = []; BK.szam = 0; BK.fazis = null; BK.rajz = {}; BK.jegyzett = false;
  document.removeEventListener("keydown", bkBillentyu); document.addEventListener("keydown", bkBillentyu);
  if (forma === "blokk") bkRokaIndit(f); else bkBoltIndit(f);
}
function bkQ(s) { return BK.svg.querySelector(s); }
function bkGombok(h) { $("bk-gombok").innerHTML = h || ""; }
/* buborék a képen: ki = "tuske" | "vevo" | "juli"; üres szöveg = eltűnik */
function bkBub(x, y, szoveg, ki) {
  var g = bkQ(".bk-bub"); if (!g) return;
  var r = g.querySelector('[data-ki="' + ki + '"]'); if (r) r.remove();
  if (!szoveg) return;
  var w = Math.max(60, szoveg.length * 8.2 + 24);
  x = Math.max(w / 2 + 6, Math.min(800 - w / 2 - 6, x));
  g.insertAdjacentHTML("beforeend", '<g data-ki="' + ki + '" transform="translate(' + x + ' ' + y + ')"><rect x="' + (-w / 2) + '" y="-18" width="' + w + '" height="32" rx="14" fill="#fff" stroke="#c9b6dc" stroke-width="1.6"/><path d="M-6 13L0 24L6 13Z" fill="#fff" stroke="#c9b6dc" stroke-width="1.6"/><path d="M-5 12.5H5" stroke="#fff" stroke-width="3"/>' +
    '<text y="4" text-anchor="middle" font-size="15" ' + BK_F + ' font-weight="500" fill="#2a2140">' + szoveg + '</text></g>');
  var uj = g.lastChild;
  setTimeout(function () { if (uj.parentNode) uj.remove(); }, Math.max(2600, szoveg.length * 90));   /* a buborék nem marad a képen (ne takarjon) */
}
/* rossz válasz: a motor könyvelése (mint a mérés koppintós kártyáinál), a kép felel, a sor csak röviden */
/* szoveg = "": nincs kiírás — amit a kép mutat (a vevő visszatol, a tenyerére néz, hazaér), azt nem meséljük el (producer, 2026-10-24) */
function bkRossz(f, cimke, szoveg, kimond) {
  rosszValaszKonyvel(f, cimke);
  var v = $("visszajelzes"); v.className = "visszajelzes" + (szoveg ? " rossz" : ""); v.textContent = szoveg;
  if (kimond) mondd(kimond);
  ment();
}
function bkJo(f, kes, joKiir) {
  BK.lezart = true; f.joKiir = joKiir;
  setTimeout(function () { if (J && J.feladat === f) ertekel(f.helyes); }, kes || 0);
}
/* arc: vidam | ujjong | gondol (a régi vevők arca); a kölyöknél a megfelelő mozdulat, kpoz-zal felülírható (pl. visszatol) */
var BK_K_POZ = { vidam: null, ujjong: "orul", gondol: "gondol" };
function bkVevoRajz(arc, kpoz) {
  var g = bkQ(".bk-vevo"); if (!g || !BK.f) return;
  if (bkKolyok()) {
    g.innerHTML = "";
    var n = kpoz || BK_K_POZ[arc || "vidam"];
    if (BK.kolyok) { if (n) BK.kolyok.poz(n, 1900); else BK.kolyok.poz(BK.kolyok.alap); }
    return;
  }
  if (BK.forma === "blokk") return;   /* a blokknál csak a kölyök áll a képen */
  bkKolyokEl();
  var F = {}, k, src = FIG_RAJZ[BK.f.bolt.vevo] || FIG_RAJZ.brumi; for (k in src) F[k] = src[k]; F.tart = null;   /* a boltban üres kézzel jön */
  g.innerHTML = fgAlak(F, arc || "vidam");
}

/* a kölyök a képen: a bolt-képen a pult mögött (zsámolyon), a blokknál a pult előtt. Visszaadja, hová sétáljon be,
   ha most érkezik (false, ha már ott áll). */
function bkKolyokRak() {
  var g = bkQ(".bk-kolyok"); if (!g) return false;
  if (BK.kolyok && BK.kolyok.g.isConnected) return false;
  var blokk = BK.forma === "blokk", h = blokk ? BK_K_BLOKK : BK_K_HELY;
  g.innerHTML = "";
  BK.kolyok = new KolyokFig(g, { x: 860, y: h[1], s: (blokk ? 1.58 * 1.15 : 1.64) * KM_ARANY, dir: -1 });   /* az unikornis mérete × az odú aránya (a blokknál közelebb áll) */
  return h[0];
}
function bkKolyokEl() { if (BK && BK.kolyok) { var g = bkQ(".bk-kolyok"); if (g) g.innerHTML = ""; BK.kolyok = null; } }

/* ═════════════════ ① ② A BOLT ═════════════════ */
function bkPult(y0, y1, alj) {
  var s = '<path d="M0 ' + y0 + 'H800V' + y1 + 'H0Z" fill="url(#bkFa)"/><path d="M0 ' + y0 + 'H800" stroke="#a87a4e" stroke-width="4"/><path d="M0 ' + (y0 + 5) + 'H800" stroke="#f3d6ac" stroke-width="2" opacity=".8"/>';
  for (var x = 70; x < 800; x += 140) s += '<path d="M' + x + ' ' + (y0 + 10) + ' Q' + (x + 30) + ' ' + ((y0 + y1) / 2) + ' ' + (x - 10) + ' ' + y1 + '" stroke="#c99a6a" stroke-width="1.2" fill="none" opacity=".6"/>';
  return s + '<path d="M0 ' + y1 + 'H800V' + alj + 'H0Z" fill="#b07a4c"/><path d="M0 ' + y1 + 'H800" stroke="#7a4f2c" stroke-width="3"/>';
}
function bkFal(h) {
  var s = '<rect width="800" height="' + h + '" fill="#f8ecd9"/>';
  for (var x = 0; x < 800; x += 26) s += '<rect x="' + x + '" y="0" width="13" height="262" fill="#f3e2c6" opacity=".55"/>';
  return s;
}
function bkBoltAlap() {
  var s = '<defs>' + HE_DEFS + SZV_DEFS + BK_DEFS + '</defs>' + bkFal(460);
  /* polc a falon, Tüske néni mögött */
  s += '<g transform="translate(14 36)">' + [0, 76, 152].map(function (y) { return '<rect x="0" y="' + (y + 54) + '" width="250" height="10" rx="3" fill="#e9c193" stroke="#a87a4e" stroke-width="2"/>'; }).join("") +
       '<text font-size="28" y="50" x="12">🍯🍎🧀🥕🍐</text><text font-size="28" y="126" x="16">🍞🥛🍪🧈</text><text font-size="28" y="202" x="12">🍓🥕🍯🍎</text>' +
       '<rect x="0" y="0" width="8" height="250" fill="#d6a46f"/><rect x="242" y="0" width="8" height="250" fill="#d6a46f"/></g>';
  /* ablak a térre, a kúttal */
  s += '<g transform="translate(392 34)"><rect width="150" height="132" rx="10" fill="#cfe6fb" stroke="#b08a68" stroke-width="6"/><path d="M0 96Q40 80 75 92T150 86V132H0Z" fill="#c4e6bc"/><ellipse cx="75" cy="124" rx="62" ry="11" fill="#efe0c4"/>' +
       '<path d="M71 120V100H79V120Z" fill="#d9cbb4"/><path class="bk-viz" d="M75 100Q66 90 61 116M75 100Q84 90 89 116" fill="none" stroke="#9ec9f0" stroke-width="2" stroke-dasharray="4 3"/>' +
       '<path d="M75 0V132M0 66H150" stroke="#b08a68" stroke-width="4"/><path d="M-8 -6H158" stroke="#f6a5c0" stroke-width="12" stroke-linecap="round"/></g>';
  s += '<g transform="translate(770 10)"><path d="M0 0V14" stroke="#6e4a36" stroke-width="2"/><path d="M-10 28Q-10 14 0 14Q10 14 10 28Z" fill="#fce49a" stroke="#d1a23a" stroke-width="1.6"/><circle cx="0" cy="30" r="2.6" fill="#d1a23a"/></g>';
  s += '<g class="bk-tuske" transform="translate(-34 58) scale(.82)"></g>';
  s += '<g class="bk-uni" transform="translate(252 322)"></g>';
  s += '<g transform="translate(560 84) scale(1.6)"><g class="bk-vevo"></g></g><g class="bk-kolyok"></g>';
  s += bkPult(262, 440, 460);
  s += '<g class="bk-kassza"></g><g class="bk-szalag"></g><g class="bk-targy"></g><g class="bk-tenyer"></g><g class="bk-ermek"></g><g class="bk-szikra" pointer-events="none"></g><g class="bk-bub" pointer-events="none"></g>';
  BK.svg.innerHTML = s;
  BK.tuske = new Lako(bkQ(".bk-tuske"), "tuske", { poz: "koszon", elet: true });
  BK.uni = uniPult(bkQ(".bk-uni"), { meret: 1.64, alap: "figyel" });
}
function bkTarcaX(i, n) { return Math.round(540 - (n - 1) * 22 + i * 44); }
function bkErmeUj(v, x, y, hol) { var e = { id: "bke" + (BK.szam++), v: v, x: x, y: y, hol: hol }; BK.ermek.push(e); return e; }
/* az érmék kirakása: ami máshová került, a szarvától ívben átlebeg */
function bkErmekRajz() {
  var g = bkQ(".bk-ermek"), mozgott = false;
  BK.ermek.forEach(function (e) {
    var el = g.querySelector('[data-id="' + e.id + '"]');
    if (!el) {
      g.insertAdjacentHTML("beforeend", '<g class="bk-erme' + (e.hol === "fizetett" ? " all" : "") + '" data-id="' + e.id + '" data-v="' + e.v + '" data-hol="' + e.hol + '" data-x="' + e.x + '" data-y="' + e.y + '" style="transform:translate(' + e.x + 'px,' + e.y + 'px)">' +
        '<circle r="' + (BK_ER[e.v] + 8) + '" fill="transparent"/>' + tallerBelso(e.v) + '</g>');   /* a láthatatlan nagyobb kör: könnyebb eltalálni */
      if (e.hol === "zar") g.lastChild.classList.add("all");   /* 🔥 a beváltásnál most nem használható tallér (halvány) */
    } else if (+el.getAttribute("data-x") !== e.x || +el.getAttribute("data-y") !== e.y) {
      el.setAttribute("data-hol", e.hol);   /* hol van most (a gépi próba is ebből keresi) */
      szarvVarazs(el, +el.getAttribute("data-x"), +el.getAttribute("data-y"), e.x, e.y, { nyom: bkQ(".bk-szikra") });
      el.setAttribute("data-x", e.x); el.setAttribute("data-y", e.y); mozgott = true;
    }
  });
  Array.prototype.slice.call(g.children).forEach(function (el) { if (!BK.ermek.some(function (e) { return e.id === el.getAttribute("data-id"); })) el.remove(); });
  if (mozgott && !BK.lezart) BK.uni.poz("szarvvar", 800);
}
function bkTargyRajz(ar) {
  bkQ(".bk-targy").innerHTML = '<g transform="translate(' + BK_TARGY[0] + ' ' + BK_TARGY[1] + ')"><g class="bk-aru"><g transform="translate(0 30) scale(1.2) translate(0 -30)"><path d="M-18 30V4Q-18 -4 -12 -6H12Q18 -4 18 4V30Q0 36 -18 30Z" fill="#f5b942" stroke="#a8741c" stroke-width="2"/><rect x="-16" y="-14" width="32" height="10" rx="3" fill="#e0a13a" stroke="#a8741c" stroke-width="1.6"/><ellipse cx="0" cy="14" rx="10" ry="7" fill="#fff6d8"/><text y="18" text-anchor="middle" font-size="9" ' + BK_F + ' font-weight="600" fill="#a8741c">méz</text></g></g>' +
    '<path d="M20 -8Q28 -6 34 2" fill="none" stroke="#8a6a52" stroke-width="1.4"/><g transform="translate(48 10) rotate(8)"><path d="M-16 -14H16V14H-16Z" fill="#fffaf0" stroke="#8a6a52" stroke-width="2"/><circle cx="-11" cy="-9" r="2" fill="none" stroke="#8a6a52" stroke-width="1.2"/>' +
    '<text y="7" text-anchor="middle" font-size="18" ' + BK_F + ' font-weight="700" fill="#4a3b7a">' + ar + '</text></g><g class="bk-ures"></g><g class="bk-eddig"></g></g>';
}
/* ② a kölyök kis fatála: a mancsai a peremén, a kölyök méretében (a mancsa kisebb az érménél, ezért kell a tál) */
function bkTalSVG() {
  var p = lenyPal(), m = (1.64 * KM_ARANY).toFixed(2), s = '<g transform="translate(' + BK_TAL[0] + ' ' + BK_TAL[1] + ')">';
  s += '<path d="M-58 -8Q-54 22 -24 26H24Q54 22 58 -8Z" fill="#d9a46c" stroke="#7a4f2c" stroke-width="2.4" stroke-linejoin="round"/>';
  s += '<ellipse cx="0" cy="-8" rx="58" ry="9" fill="#b9814f" stroke="#7a4f2c" stroke-width="2.4"/><ellipse cx="0" cy="-7" rx="50" ry="5.5" fill="#a06d40"/><path d="M-44 8Q0 18 44 8" fill="none" stroke="#f0c896" stroke-width="2" opacity=".7"/>';
  [-30, 30].forEach(function (cx) {
    s += '<g transform="translate(' + cx + ' -12) scale(' + m + ')"><circle r="6.2" fill="' + p.b + '" stroke="' + p.d + '" stroke-width="2"/>' +
      [[-3.5, 3.5], [0, 4.8], [3.5, 3.5]].map(function (t) { return '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="1.9" fill="' + p.has + '" stroke="' + p.d + '" stroke-width="1.1"/>'; }).join("") + '</g>';
  });
  return s + '</g>';
}
function bkTenyerRajz(lathato) {
  if (lathato && bkKolyok()) { bkQ(".bk-tenyer").innerHTML = bkTalSVG(); return; }
  bkQ(".bk-tenyer").innerHTML = lathato ? '<g transform="translate(' + BK_TENYER[0] + ' ' + BK_TENYER[1] + ')"><path d="M60 -40Q70 -10 58 6" fill="none" stroke="#6e472c" stroke-width="20" stroke-linecap="round"/><path d="M60 -40Q70 -10 58 6" fill="none" stroke="#bd8759" stroke-width="15" stroke-linecap="round"/>' +
    '<ellipse rx="58" ry="22" fill="#bd8759" stroke="#6e472c" stroke-width="2.4"/><ellipse cx="0" cy="2" rx="44" ry="14" fill="#efd3ae"/>' +
    [-38, -13, 13, 38].map(function (x) { return '<ellipse cx="' + x + '" cy="-20" rx="9" ry="6" fill="#bd8759" stroke="#6e472c" stroke-width="2"/><ellipse cx="' + x + '" cy="-19" rx="5" ry="3.2" fill="#efd3ae"/>'; }).join("") + '</g>' : "";
}
function bkKasszaRajz(mod) {
  var vn = bkVevoNev(BK.f.bolt.vevo), k = bkKolyok();   /* a kölyöké bőr erszény */
  bkQ(".bk-kassza").innerHTML = mod === "vissza"
    ? '<rect x="22" y="388" width="290" height="50" rx="10" fill="#b07a4c" stroke="#7a4f2c" stroke-width="3"/><rect x="30" y="394" width="274" height="38" rx="7" fill="#c9915e"/><text x="166" y="383" text-anchor="middle" font-size="12" ' + BK_F + ' fill="#7a4f2c">kassza</text>'
    : '<path d="M268 392Q520 384 790 392L786 438Q520 444 272 438Z" fill="' + (k ? "#c98a5a" : "#a7c9e8") + '" stroke="' + (k ? "#6e472c" : "#5f84b0") + '" stroke-width="2.4"/><path d="M280 398Q520 391 778 398" fill="none" stroke="' + (k ? "#e7b48a" : "#cfe5fa") + '" stroke-width="2" stroke-dasharray="6 5"/>' +
      '<text x="540" y="385" text-anchor="middle" font-size="12" ' + BK_F + ' fill="' + (k ? "#6e472c" : "#5f84b0") + '">' + vn + ' erszénye</text>';
}
function bkSzalagRajz() {
  var g = bkQ(".bk-szalag"), x = BK.f.bolt; if (BK.fazis === "bevalt") return;   /* a beváltás alatt a keret van a helyén */
  if (x.forma !== "vissza") { g.innerHTML = ""; return; }
  var V = x.v, lo = V.ar - 2, hi = Math.min(105, V.fizet + 5), x0 = 336, x1 = 770, Y = 414;
  function X(n) { return x0 + (n - lo) / (hi - lo) * (x1 - x0); }
  var s = '<rect x="' + (x0 - 14) + '" y="' + (Y - 16) + '" width="' + (x1 - x0 + 28) + '" height="30" rx="6" fill="#fffaf0" stroke="#c9b6dc" stroke-width="1.6"/>';
  s += '<path d="M' + x0 + ' ' + Y + 'H' + x1 + '" stroke="#4a3b7a" stroke-width="2"/>';
  for (var n = lo; n <= hi; n++) s += '<path d="M' + X(n).toFixed(1) + ' ' + (Y - (n % 10 ? 4 : 8)) + 'V' + (Y + (n % 10 ? 4 : 8)) + '" stroke="#4a3b7a" stroke-width="' + (n % 10 ? 1 : 2) + '"/>';
  if (J.probak >= 2) {   /* 2 hiba után: a cél zászlója (ide kell érni) — a szám nem, csak a hely */
    var c = X(V.fizet).toFixed(1);
    s += '<path d="M' + c + ' ' + (Y - 8) + 'V' + (Y - 40) + '" stroke="#3f9e6a" stroke-width="2.4"/><path d="M' + c + ' ' + (Y - 40) + 'l18 6l-18 6z" fill="#7fd19a" stroke="#3f9e6a" stroke-width="1.4"/>';
  }
  var most = V.ar, adott = BK.ermek.filter(function (e) { return e.hol === "tenyer"; });
  s += '<circle cx="' + X(most).toFixed(1) + '" cy="' + Y + '" r="4.4" fill="#e0417a"/><text x="' + X(most).toFixed(1) + '" y="' + (Y - 18) + '" text-anchor="middle" font-size="12" ' + BK_F + ' font-weight="700" fill="#e0417a">' + most + '</text>';
  adott.forEach(function (e) {
    var a = X(most), b = X(Math.min(hi, most + e.v)), m = (a + b) / 2, hgt = Math.min(30, 10 + (b - a) * .35);
    s += '<path d="M' + a.toFixed(1) + ' ' + (Y - 2) + 'Q' + m.toFixed(1) + ' ' + (Y - 2 - hgt).toFixed(1) + ' ' + b.toFixed(1) + ' ' + (Y - 2) + '" fill="none" stroke="#8a4fd0" stroke-width="2.4"/>' +
      (b - a < 16 ? '' : '<text x="' + m.toFixed(1) + '" y="' + (Y - 6 - hgt * .55).toFixed(1) + '" text-anchor="middle" font-size="11" ' + BK_F + ' font-weight="600" fill="#8a4fd0">+' + e.v + '</text>');
    most += e.v;
    s += '<circle cx="' + b.toFixed(1) + '" cy="' + Y + '" r="4" fill="#8a4fd0"/><text x="' + b.toFixed(1) + '" y="' + (Y + 24) + '" text-anchor="middle" font-size="11" ' + BK_F + ' font-weight="700" fill="#4a3b7a">' + most + '</text>';
  });
  g.innerHTML = s;
}
function bkKeszGomb() { bkGombok('<button class="nagy-gomb bk-kesz" data-g="kesz">Kész ✓</button>'); }
function bkBoltIndit(f) {
  var x = f.bolt;
  bkQ(".bk-bub").innerHTML = ""; bkQ(".bk-ermek").innerHTML = "";
  BK.tuske.megszakit(); BK.uni.alap = "figyel"; BK.uni.poz("figyel");
  if (J.bkKoszont) BK.tuske.poz("var");
  else { J.bkKoszont = true; BK.tuske.sorLe([["koszon", 1700], ["var", 0]]); bkBub(BK_TB[0], BK_TB[1], LK_MONDAT.tuske.koszon, "tuske"); }   /* a pálya első feladatánál köszön */
  if (x.vevo === "kolyok") {   /* új érkezésnél besétál, köszön, és Tüske néni a nevén szólítja */
    var be = bkKolyokRak();
    BK.kolyok.alap = x.forma === "vissza" ? "mancs" : "var";
    if (be !== false) BK.kolyok.setal(be, 1300, function () {
      if (!BK || BK.f !== f) return;
      BK.kolyok.poz("koszon", 1400);
      if (J.bkKoszont) bkBub(BK_TB[0], BK_TB[1], "Szia, " + bkVevoNev("kolyok") + "!", "tuske");
    });
    else BK.kolyok.poz(BK.kolyok.alap);
  }
  bkVevoRajz("vidam"); bkKasszaRajz(x.forma);
  if (x.forma === "vissza" && x.bevalt && !x.bevaltKesz) { bkBevaltIndit(f); return; }
  if (x.forma === "fizet") {
    bkTargyRajz(x.ar); bkTenyerRajz(false);
    x.tarca.forEach(function (v, i) { bkErmeUj(v, bkTarcaX(i, x.tarca.length), 415, "tarca").hely = i; });
    bkVevoBub(x.lepes === 1 ? "Segítesz kifizetni?" : x.kerd);
  } else {
    var V = x.v;
    bkTargyRajz(V.ar); bkTenyerRajz(true);
    V.fizetErmek.forEach(function (v, i) { bkErmeUj(v, 372 + i * 46, 360, "fizetett"); });
    BK_KASSZA.forEach(function (v, i) { bkErmeUj(v, 52 + i * 46, 413, "kassza"); });
    bkVevoBub(V.fizetErmek.length > 1 ? "Itt van " + V.fizet + "!" : "Tessék, egy " + V.fizet + "-es!");
  }
  bkSzalagRajz(); bkErmekRajz(); bkKeszGomb(); bkOsszegRajz();
}
/* 2 hiba után (① Fizesd ki!): a pult széle megmutatja, mennyi van már kint — a választ nem */
function bkOsszegRajz() {
  var u = bkQ(".bk-eddig"); if (!u) return;
  var x = BK.f.bolt, s = "";
  if (x.forma === "fizet" && J.probak >= 2) {
    var o = 0; BK.ermek.forEach(function (e) { if (e.hol === "pult") o += e.v; });
    s = '<g transform="translate(-342 -18)"><rect x="-34" y="-14" width="68" height="24" rx="8" fill="#fff3dc" stroke="#d1a23a" stroke-width="1.4"/><text y="4" text-anchor="middle" font-size="13" ' + BK_F + ' font-weight="600" fill="#8a5a1a">eddig: ' + o + '</text></g>';
  }
  u.innerHTML = s;
}
function bkPultraHelyez() {
  /* a pulton is úgy sorakoznak, mint az erszényben: balra a legnagyobb, jobbra csökken (élő próba, 2026-10-24) */
  var p = BK.ermek.filter(function (e) { return e.hol === "pult"; }).sort(function (a, b) { return b.v - a.v || (a.t || 0) - (b.t || 0); });
  p.forEach(function (e, i) { e.x = i < 6 ? 186 + i * 42 : 207 + (i - 6) * 42; e.y = i < 6 ? 364 : 330; });
  var t = BK.ermek.filter(function (e) { return e.hol === "tarca"; }), n = BK.f.bolt.tarca.length;
  t.forEach(function (e) { e.x = bkTarcaX(e.hely, n); e.y = 415; });   /* minden érme a saját helyére megy vissza */
}
function bkTenyerbeHelyez() {
  var T = bkTenyerHely(), k = bkKolyok();
  BK.ermek.filter(function (e) { return e.hol === "tenyer"; }).forEach(function (e, i) {
    if (k) { e.x = T[0] - 36 + (i % 4) * 24; e.y = T[1] - 10 - Math.floor(i / 4) * 9; }   /* a kölyök tálkájába */
    else { e.x = T[0] - 33 + (i % 4) * 22; e.y = T[1] - 2 - Math.floor(i / 4) * 8 - (i % 2) * 4; }
  });
}
function bkErmeKatt(id) {
  var e = BK.ermek.filter(function (x) { return x.id === id; })[0], x = BK.f.bolt; if (!e) return;
  if (BK.fazis === "bevalt") { bkBevaltKatt(e); return; }
  bkBub(0, 0, "", "tuske");
  if (x.forma === "fizet") {
    if (e.hol === "tarca") { e.hol = "pult"; e.t = ++BK.szam; } else if (e.hol === "pult") e.hol = "tarca"; else return;   /* e.t: mikor tette le */
    hangGomb(); bkPultraHelyez(); bkOsszegRajz();
    var u = bkQ(".bk-ureshely"); if (u) u.remove();   /* a „még hiányzik” jele, amíg nem nyom újra Kész-t */
  } else {
    if (e.hol === "kassza") { bkErmeUj(e.v, e.x, e.y, "kassza"); e.hol = "tenyer"; BK.ermek.push(BK.ermek.splice(BK.ermek.indexOf(e), 1)[0]); }
    else if (e.hol === "tenyer") BK.ermek.splice(BK.ermek.indexOf(e), 1);
    else return;
    hangGomb(); bkTenyerbeHelyez(); bkSzalagRajz();
  }
  bkErmekRajz();
}
function bkFizetKesz() {
  var f = BK.f, x = f.bolt, p = BK.ermek.filter(function (e) { return e.hol === "pult"; }).sort(function (a, b) { return b.v - a.v; });
  if (!p.length) { bkBub(BK_TB[0], BK_TB[1], "Tegyél egy érmét a pultra!", "tuske"); mondd("Tegyél egy érmét a pultra!"); return; }
  BK.lezart = true; bkGombok(""); BK.tuske.megszakit(); BK.tuske.poz("szamol"); BK.uni.poz("figyel");
  var ossz = 0, sor = [], lep = lkCsokkent() ? 120 : 700;
  p.forEach(function (e) { ossz += e.v; sor.push(ossz); });
  mondd(sor.map(szo).join(", "));   /* Tüske néni hangosan számol, érménként */
  ossz = 0;
  p.forEach(function (e, i) {
    setTimeout(function () {
      if (!BK || BK.f !== f) return;
      ossz += e.v;
      var g = bkQ('[data-id="' + e.id + '"]');
      if (g && g.animate && !lkCsokkent()) g.animate([{ transform: "translate(" + e.x + "px," + e.y + "px)" }, { transform: "translate(" + e.x + "px," + (e.y - 10) + "px)" }, { transform: "translate(" + e.x + "px," + e.y + "px)" }], { duration: 380 });
      bkBub(BK_TB[0], BK_TB[1], ossz + "…", "tuske");
      if (i === p.length - 1) setTimeout(function () { if (BK && BK.f === f) bkFizetVege(f, p.map(function (q) { return q.v; }), p); }, lep + 50);
    }, lep * i + 300);
  });
}
function bkFizetVege(f, l, p) {
  var x = f.bolt, ell = boltFizetEll(x.g, l, x.lepes, x.elozo);
  if (ell.jo) {
    bkAllapot().megold.push(l.slice());
    BK.tuske.poz("orul"); BK.uni.alap = "orul"; BK.uni.poz("orul"); bkVevoRajz("ujjong");
    bkBub(BK_TB[0], BK_TB[1], "Pont " + x.ar + "! Szép munka!", "tuske"); bkVevoBub("Köszönöm!");
    var aru = bkQ(".bk-aru"), ak = bkKolyok();
    if (aru) szarvVarazs(aru, 0, 0, ak ? 160 : 238, ak ? -60 : -82, { emel: 60, ido: 900, nyom: bkQ(".bk-szikra") });   /* az áru átlebeg a vevőhöz */
    bkJo(f, 1100, l.join(" + ") + " = " + x.ar);
    return;
  }
  BK.lezart = false; bkKeszGomb();
  if (ell.ok === "ugyanaz") {
    BK.tuske.pozIdeig("gondol", 2200); BK.uni.poz("gondol", 2000);
    bkBub(BK_TB[0], BK_TB[1], "Ez ugyanaz, mint az előbb. Van más út is?", "tuske");
    bkRossz(f, "ugyanaz", "Ez ugyanaz, mint az előbb. Másképp is ki lehet?", "Ez ugyanaz, mint az előbb. Van más út is?");
  } else if (ell.ok === "tobb-erme") {
    BK.tuske.pozIdeig("gondol", 2200); BK.uni.poz("gondol", 2000);
    bkBub(BK_TB[0], BK_TB[1], "Kifizetted! De kevesebb érmével is lehet.", "tuske");
    bkRossz(f, l.length + " érme", "Kifizetted! De kevesebb érmével is lehet.", "Kifizetted! De kevesebb érmével is lehet.");
  } else if (ell.ok === "keves") {
    BK.tuske.pozIdeig("gondol", 2200); BK.uni.poz("gondol", 2200);
    bkBub(BK_TB[0], BK_TB[1], "Hmm, még nem fizettünk ki mindent.", "tuske");
    var u = bkQ(".bk-ures"); if (u) u.insertAdjacentHTML("beforeend", '<circle class="bk-ureshely" cx="90" cy="14" r="16" fill="none" stroke="#e0417a" stroke-width="2.4" stroke-dasharray="5 4"/>');
    bkRossz(f, "kevés", "Még nem fizettünk ki mindent.", "Hmm, még nem fizettünk ki mindent.");
  } else {
    BK.tuske.pozIdeig("meglep", 1800); bkVevoRajz("gondol", "visszatol"); bkVevoBub("Ez sok lesz!"); bkBub(0, 0, "", "tuske");
    /* 🔒 a vevő az UTOLJÁRA letett érmét tolja vissza (nem a „pont jót”: különben a Kész nyomkodása magától kihozná a megoldást) */
    var utso = p.slice().sort(function (a, b) { return (b.t || 0) - (a.t || 0); })[0];
    utso.hol = "tarca"; bkPultraHelyez(); bkErmekRajz(); BK.uni.poz("gondol", 1800);
    setTimeout(function () { if (BK && BK.f === f) bkVevoRajz("vidam"); }, 1800);
    bkRossz(f, "sok", "", "Ez sok lesz!");
  }
  bkOsszegRajz();
}
function bkVisszaKesz() {
  var f = BK.f, x = f.bolt, adott = BK.ermek.filter(function (e) { return e.hol === "tenyer"; });
  if (!adott.length) { var tm = bkKolyok() ? "Tegyél érmét a tálkájába!" : "Tegyél érmét a tenyerébe!"; bkBub(BK_TB[0], BK_TB[1], tm, "tuske"); mondd(tm); return; }
  var ell = boltVisszaEll(x.v, adott.map(function (e) { return e.v; }));
  BK.lezart = true; bkGombok(""); BK.uni.poz("tenyer");
  setTimeout(function () {
    if (!BK || BK.f !== f) return;
    if (ell.jo) {
      bkVevoRajz("ujjong"); BK.tuske.poz("orul"); BK.uni.alap = "orul"; BK.uni.poz("orul");
      bkVevoBub("Köszönöm szépen!"); bkBub(BK_TB[0], BK_TB[1], "Pont annyi, ügyes vagy!", "tuske");
      bkJo(f, 900, x.v.ar + " → " + x.v.fizet + ": " + x.v.vissza + " tallér");
      return;
    }
    BK.lezart = false; bkKeszGomb();
    if (ell.ok === "keves") {
      bkVevoRajz("gondol"); bkVevoBub("…"); BK.tuske.pozIdeig("gondol", 2200); BK.uni.poz("gondol", 2200);
      bkRossz(f, "kevés", "", null);
    } else {
      bkVevoRajz("gondol", "visszatol"); bkVevoBub("Ez sok!"); BK.tuske.pozIdeig("meglep", 1800); BK.uni.poz("gondol", 1800);
      var utso = adott[adott.length - 1]; BK.ermek.splice(BK.ermek.indexOf(utso), 1); bkTenyerbeHelyez(); bkErmekRajz();
      bkRossz(f, "sok", "", "Ez sok!");
    }
    bkSzalagRajz();
  }, lkCsokkent() ? 0 : 900);
}

/* ═════════════════ ③ A RÓKA BLOKKJA ═════════════════ */
function bkRokaAlap() {
  var s = '<defs>' + HE_DEFS + SZV_DEFS + BK_DEFS + '</defs>' + bkFal(400);
  s += '<g class="bk-uni" transform="translate(164 327)"></g>';
  s += '<g transform="translate(806 40) scale(-1.05 1.05)"><g class="bk-juli"></g></g>';
  s += bkPult(262, 380, 400);
  s += '<g class="bk-blokk"></g><g class="bk-pecsetek"></g><g class="bk-kolyok"></g><g class="bk-szikra" pointer-events="none"></g><g class="bk-bub" pointer-events="none"></g><g class="bk-otthon"></g><g class="bk-vevo"></g>';
  BK.svg.innerHTML = s;
  BK.uni = uniPult(bkQ(".bk-uni"), { meret: 1.58, alap: "figyel" });
  BK.juli = new Lako(bkQ(".bk-juli"), "juli", { poz: "koszon", elet: true });
  var p = "";
  [["ok", "✓", "#3f9e6a", "#dff3e7", 112, "jó"], ["x", "✗", "#e0417a", "#ffd6ea", 196, "hibás"]].forEach(function (b) {
    p += '<g class="bk-pecset" data-v="' + b[0] + '" transform="translate(' + b[4] + ' ' + BK_PECSET_Y + ')"><rect x="-38" y="-96" width="76" height="120" fill="transparent"/><g class="bk-pecset-mozog"><rect x="-10" y="-74" width="20" height="40" rx="8" fill="#c99272" stroke="#8a5a3a" stroke-width="2"/><ellipse cx="0" cy="-76" rx="16" ry="9" fill="#d9a873" stroke="#8a5a3a" stroke-width="2"/>' +
      '<rect x="-30" y="-36" width="60" height="16" rx="4" fill="#b07a4c" stroke="#7a4f2c" stroke-width="2"/><rect x="-28" y="-20" width="56" height="20" rx="4" fill="' + b[3] + '" stroke="' + b[2] + '" stroke-width="2.4"/>' +
      '<text y="-4" text-anchor="middle" font-size="18" font-weight="700" fill="' + b[2] + '">' + b[1] + '</text></g><text y="20" text-anchor="middle" font-size="13" ' + BK_F + ' font-weight="600" fill="#fffaf0">' + b[5] + '</text></g>';
  });
  bkQ(".bk-pecsetek").innerHTML = p;
}
/* a pecsét helye a blokkon: az eredmény sorában, az „összesen:” és a szám között (ott a ✓/✗ jól látszik) — élő próba, producer 2026-10-24 */
function bkEredmenyHely(n) { return [141, 76 + (n - 1) * (n > 2 ? 34 : 44) + 22 + 26]; }
function bkBlokkRajz() {
  var o = BK.rajz, x = BK.f.bolt, b = x.b, s = "", n = b.tetelek.length, dy = n > 2 ? 34 : 44;
  s += '<g transform="translate(' + BK_BLOKK_X + ' 24)"><path d="M0 0H240V250' + Array.apply(null, { length: 12 }).map(function (_, i) { return "L" + (240 - (i * 20 + 10)) + " " + (i % 2 ? 250 : 260) + "L" + (240 - (i + 1) * 20) + " 250"; }).join("") + 'Z" fill="#fffef6" stroke="#c9b6dc" stroke-width="1.8"/>';
  s += '<text x="120" y="28" text-anchor="middle" font-size="14" ' + BK_F + ' font-weight="600" fill="#8a7a9e">Tüske néni boltja · blokk</text><path d="M20 40H220" stroke="#e7dcef" stroke-width="1.6"/>';
  b.tetelek.forEach(function (v, i) {
    var y = 76 + i * dy, a = x.aruk[i];
    s += '<text x="22" y="' + y + '" font-size="20">' + a[0] + '</text><text x="52" y="' + y + '" font-size="19" ' + BK_F + ' fill="#3b4a8a">' + a[1] + '</text>';
    s += '<path d="M118 ' + (y - 6) + 'H170" stroke="#c9b6dc" stroke-width="2" stroke-dasharray="2 4"/><text x="212" y="' + y + '" text-anchor="end" font-size="26" ' + BK_F + ' font-weight="600" fill="#3b4a8a">' + v + '</text>';
  });
  var yv = 76 + (n - 1) * dy + 22;
  s += '<path d="M150 ' + yv + 'H222" stroke="#3b4a8a" stroke-width="2.2"/><text x="22" y="' + (yv + 36) + '" font-size="19" ' + BK_F + ' fill="#3b4a8a">összesen:</text>';
  s += '<text x="212" y="' + (yv + 38) + '" text-anchor="end" font-size="34" ' + BK_F + ' font-weight="700" fill="#3b4a8a">' + b.irt + '</text>';
  if (o.kihuz) s += '<path d="M160 ' + (yv + 28) + 'L216 ' + (yv + 20) + '" stroke="#e0417a" stroke-width="3.4" stroke-linecap="round"/>';
  if (o.javit != null) s += '<text x="212" y="' + (yv + 74) + '" text-anchor="end" font-size="30" ' + BK_F + ' font-weight="700" fill="#7a5ca8">' + o.javit + '</text>';
  if (o.becsles) s += '<g transform="translate(16 ' + (yv + 56) + ')"><rect width="118" height="24" rx="6" fill="#fff3dc" stroke="#d1a23a" stroke-width="1.2" transform="rotate(-3)"/><text x="59" y="16" text-anchor="middle" font-size="13" ' + BK_F + ' fill="#8a5a1a" transform="rotate(-3)">' + o.becsles + '</text></g>';
  var ph = bkEredmenyHely(n);
  if (o.pecset) s += '<g transform="translate(' + ph[0] + ' ' + ph[1] + ') rotate(-10) scale(.68)" opacity=".85"><rect x="-36" y="-22" width="72" height="44" rx="8" fill="none" stroke="' + (o.pecset === "ok" ? "#3f9e6a" : "#e0417a") + '" stroke-width="4"/><text y="13" text-anchor="middle" font-size="34" font-weight="700" fill="' + (o.pecset === "ok" ? "#3f9e6a" : "#e0417a") + '">' + (o.pecset === "ok" ? "✓" : "✗") + '</text></g>';
  s += '</g>';
  if (o.rudak) {   /* 2 hiba után: a tételek tízes rudakban és egyes kockákban, kirakva a pultra (a blokk mellett) — az összeg nem */
    var rw = n > 2 ? 82 : 118;
    s += '<g transform="translate(' + (n > 2 ? 548 : 556) + ' 296)">';
    b.tetelek.forEach(function (v, i) {
      s += '<g transform="translate(' + (i * rw) + ' 0)"><rect x="-6" y="-4" width="' + (rw - 8) + '" height="76" rx="8" fill="#fffaf0" stroke="#c9b6dc" stroke-width="1.4" opacity=".92"/>' +
        '<text x="0" y="10" font-size="12" ' + BK_F + ' fill="#6b6280">' + x.aruk[i][0] + ' ' + v + '</text>' + bkRudak(v, 0, 14, n > 2 ? .62 : .72) + '</g>';
    });
    s += '</g>';
  }
  bkQ(".bk-blokk").innerHTML = s;
}
/* tízes rudak (kék) + egyes kockák (rózsaszín): a közös helyiérték-színekkel (HE_SZIN) */
function bkRudak(n, x, y, k) {
  k = k || 1;
  var s = "", t = Math.floor(n / 10), e = n % 10, i, j, T = HE_SZIN[10], E = HE_SZIN[1], w = 11 * k, h = 7 * k;
  for (i = 0; i < t; i++) { s += '<g transform="translate(' + (x + i * 15 * k).toFixed(1) + ' ' + y + ')">'; for (j = 0; j < 10; j++) s += '<rect x="0" y="' + (j * h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + T.l + '" stroke="' + T.k + '" stroke-width=".8"/>'; s += '</g>'; }
  for (i = 0; i < e; i++) s += '<rect x="' + (x + t * 15 * k + 4 + (i % 3) * 9 * k).toFixed(1) + '" y="' + (y + 7 * h - Math.floor(i / 3) * 9 * k).toFixed(1) + '" width="' + h.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + E.l + '" stroke="' + E.k + '" stroke-width=".8"/>';
  return s;
}
function bkRokaIndit(f) {
  BK.fazis = "becsles"; BK.rajz = {};
  bkQ(".bk-otthon").innerHTML = ""; bkQ(".bk-bub").innerHTML = "";
  bkBlokkRajz(); BK.juli.megszakit(); BK.juli.sorLe([["szamol", 1300], ["mutat", 1400], ["var", 0]]);
  if (f.bolt.vevo === "kolyok") {   /* a kölyök hozza a blokkot: besétál (az első blokknál), odanyújtja, és kérdez */
    var be = bkKolyokRak(), kerd = function () { if (!BK || BK.f !== f) return; BK.kolyok.poz("mancs", 1400); bkVevoBub("Megnézed, jó-e?"); };
    if (be !== false) BK.kolyok.setal(be, 1400, kerd); else { BK.kolyok.setal(BK_K_BLOKK[0], 500); kerd(); }
  } else bkKolyokEl();
  BK.uni.alap = "figyel"; BK.uni.poz("figyel");
  bkBecslesGombok();
}
function bkBecslesGombok() {
  bkGombok('<span class="bk-kerd">Körülbelül stimmel?</span><button class="kis-gomb bk-g" data-g="keves">Túl kevés</button><button class="kis-gomb bk-g" data-g="jo">Stimmelhet</button><button class="kis-gomb bk-g" data-g="sok">Túl sok</button>');
}
function bkBecsles(v) {
  var b = BK.f.bolt.b, kerek = b.tetelek.map(kerekTizes), k = 0; kerek.forEach(function (q) { k += q; });
  var elter = b.irt - k, val = elter < -5 * b.tetelek.length ? "keves" : elter > 5 * b.tetelek.length ? "sok" : "jo";
  BK.rajz.becsles = "kb. " + kerek.join(" + ") + " = " + k;
  bkBlokkRajz();
  BK.fazis = "pecset";
  var jo = v === val;
  BK.uni.poz(jo ? "orul" : "gondol", 1400);
  var m = (jo ? "Jó becslés! " : "Nézd a kerek számokat a cetlin! ") + "Most nyomj pecsétet: jó vagy hibás?";
  $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = m; mondd(m);   /* a becslés nem hiba és nem jutalom: csak a gondolkodás iránya */
  bkGombok('<span class="bk-kerd">Koppints a pecsétre: ✓ jó · ✗ hibás</span>');
}
/* a pecsétet az unikornis szarva emeli fel, átviszi a blokkra, ráüti, és visszateszi */
function bkPecsetRepul(p, kesz) {
  var m = p.querySelector(".bk-pecset-mozog"), px = +p.getAttribute("transform").match(/translate\(([-\d.]+)/)[1];
  var ph = bkEredmenyHely(BK.f.bolt.b.tetelek.length), dx = BK_BLOKK_X + ph[0] - px, dy = 24 + ph[1] + 34 - BK_PECSET_Y;
  function T(x, y) { return { transform: "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)" }; }
  BK.uni.poz("szarvvar");
  if (lkCsokkent() || !m.animate) { kesz(); BK.uni.poz(BK.uni.alap); return; }
  BK.mozog = true;
  m.animate([T(0, 0), T(dx * .25, dy * .55), T(dx * .6, dy - 70), T(dx, dy - 36), T(dx, dy), T(dx, dy - 30), T(dx * .6, dy - 70), T(dx * .25, dy * .55), T(0, 0)], { duration: 1700, easing: "ease-in-out" });
  szarvVarazs(document.createElementNS(SZV_NS, "g"), px, BK_PECSET_Y - 40, px + dx, BK_PECSET_Y + dy - 40, { emel: 70, ido: 800, nyom: bkQ(".bk-szikra") });
  setTimeout(kesz, 850);
  setTimeout(function () { BK.mozog = false; if (BK.uni.nev === "szarvvar") BK.uni.poz(BK.uni.alap); }, 1700);
}
function bkJegyez(ell) { if (!BK.jegyzett) { BK.jegyzett = true; rokaJegyez(BK.f.bolt.b, ell); } }   /* 🦊 napló: csak az első ítélet számít */
function bkPecsetKatt(v) {
  var f = BK.f, b = f.bolt.b;
  if (BK.fazis === "becsles") BK.fazis = "pecset";
  if (BK.fazis !== "pecset" || BK.mozog) return;
  hangGomb(); bkGombok("");
  bkPecsetRepul(bkQ('.bk-pecset[data-v="' + v + '"]'), function () {
    if (!BK || BK.f !== f) return;
    BK.rajz.pecset = v; bkBlokkRajz();
    if (v === "ok" && b.pontos) {
      BK.fazis = "kesz"; bkJegyez({ jo: true, ok: "jo" });
      BK.juli.megszakit(); BK.juli.poz("orul"); BK.uni.alap = "orul"; setTimeout(function () { if (BK && BK.f === f) BK.uni.poz("orul"); }, 900);
      bkBub(640, 40, LK_MONDAT.juli.orul, "juli"); bkVevoRajz("ujjong");
      bkJo(f, 1500, "✓ a blokk jó: " + b.tetelek.join(" + ") + " = " + b.helyes);
    } else if (v === "x" && !b.pontos) {
      BK.fazis = "javit"; BK.rajz.kihuz = true; bkBlokkRajz();
      BK.juli.megszakit(); BK.juli.poz("meglep"); bkBub(640, 40, LK_MONDAT.juli.meglep, "juli");
      BK.javit = ""; bkJavitGombok();
      var m = "Kihúztad a rossz számot. Írd be a helyeset!"; $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = m; mondd(m);
    } else if (v === "x") {   /* gyanakodott: a blokk jó volt */
      bkJegyez({ jo: false, ok: "gyanu" });
      BK.juli.pozIdeig("gondol", 2200); setTimeout(function () { if (BK && BK.f === f) BK.uni.poz("gondol", 2000); }, 900);
      setTimeout(function () { if (BK && BK.f === f) { BK.rajz.pecset = null; bkBlokkRajz(); bkGombok('<span class="bk-kerd">Koppints a pecsétre: ✓ jó · ✗ hibás</span>'); } }, 1300);
      bkBub(640, 40, "Biztos? Számold csak meg még egyszer!", "juli");
      bkRossz(f, "✗", FIGURA.juli.n + ": „Biztos? Számold csak meg még egyszer!”", "Biztos? Számold csak meg még egyszer!");
    } else {   /* hibás blokkra ✓: a vevő hazaér, kirakja a kosarát */
      bkJegyez({ jo: false, ok: "nem-vette-eszre" });
      BK.fazis = "otthon";
      bkRossz(f, "✓", "", null);
      setTimeout(function () { if (BK && BK.f === f) bkOtthonRajz(); }, 1000);
    }
  });
}
/* a javítás a BILLENTYŰZETRŐL jön (élő próba, 2026-10-24): nincs képernyős számsor. A mező valódi beviteli mező
   (tableten a rendszer számbillentyűzete jön fel), de a gép billentyűzete akkor is ide ír, ha a fókusz máshol van. */
function bkJavitGombok() {
  bkGombok('<span class="bk-kerd">Írd be a jót a billentyűzeten:</span><input id="bk-beiras" class="bk-beiras" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="a javított összeg" value="' + (BK.javit || "") + '"><button class="nagy-gomb bk-kesz" data-g="javok">OK</button>');
  var be = $("bk-beiras");
  be.addEventListener("input", function () { BK.javit = be.value.replace(/[^0-9]/g, "").slice(0, 3); be.value = BK.javit; });
  try { if (!(window.matchMedia && matchMedia("(pointer: coarse)").matches)) be.focus(); } catch (e) {}
}
function bkJavitBe(jel) {
  if (BK.fazis !== "javit" || BK.lezart) return;
  if (jel === "del") BK.javit = BK.javit.slice(0, -1);
  else if (BK.javit.length < 3) BK.javit += jel;
  var b = $("bk-beiras"); if (b) b.value = BK.javit;
}
function bkJavitOk() {
  var f = BK.f, b = f.bolt.b; if (BK.fazis !== "javit" || BK.lezart || !BK.javit) return;
  var be = parseInt(BK.javit, 10), ell = rokaPecsetEll(b, "x", be);
  bkJegyez(ell);
  if (ell.jo) {
    BK.rajz.javit = be; bkBlokkRajz(); BK.fazis = "kesz"; bkGombok("");
    BK.juli.megszakit(); BK.juli.sorLe([["kacsint", 1500], ["orul", 1600], ["var", 0]]); bkBub(640, 40, LK_MONDAT.juli.kacsint, "juli");
    BK.uni.alap = "orul"; BK.uni.poz("orul"); bkVevoRajz("ujjong");
    bkJo(f, 1300, b.irt + " helyett " + b.helyes);
    return;
  }
  BK.juli.pozIdeig("gondol", 2000); BK.uni.poz("gondol", 2000);
  BK.javit = "";
  if (J.probak >= 1) {   /* a 2. hibától a kép segít: a tételek rudakban (a motor itt még 1-nél tart) */
    BK.rajz.rudak = true;
    if (BK.kolyok) BK.kolyok.setal(778, 700);   /* a kölyök hátrébb lép, hogy ne takarja a rudakat (rajzterv 6. döntés) */
  }
  bkBlokkRajz(); bkJavitGombok();
  bkRossz(f, String(be), "Még nem jó. Számold össze újra: előbb a tízeseket, aztán az egyeseket!", "Még nem jó. Előbb a tízeseket, aztán az egyeseket!");
}
function bkOtthonRajz() {
  var f = BK.f, x = f.bolt, b = x.b, jo = b.helyes, s = "", kol = x.vevo === "kolyok", F = {}, k, src = FIG_RAJZ[x.vevo] || FIG_RAJZ.brumi;
  for (k in src) F[k] = src[k]; F.tart = null;
  s += '<rect x="0" y="0" width="800" height="400" fill="#fdf0d0"/><rect x="0" y="0" width="800" height="400" fill="none" stroke="#e0c9a0" stroke-width="8"/>';
  /* a mesélő cím („… hazaért, és kirakta a kosarát”) nincs: amit a kép mutat, nem írjuk ki (producer, 2026-10-24) */
  s += kol ? '<g class="bk-otthon-kolyok"></g>' : '<g transform="translate(30 70) scale(1.5)">' + fgAlak(F, "gondol") + '</g>';
  s += '<rect x="230" y="300" width="540" height="14" rx="4" fill="#d6a46f"/>';
  s += '<text x="240" y="76" font-size="14" ' + BK_F + ' fill="#6b6280">Amit hazavitt (' + x.aruk.map(function (a) { return a[0]; }).join(" + ") + '):</text>' + bkRudak(jo, 240, 88);
  s += '<text x="240" y="196" font-size="14" ' + BK_F + ' fill="#6b6280">Amit a blokk szerint fizetett:</text>' + bkRudak(b.irt, 240, 208);
  var tj = Math.floor(jo / 10), tb = Math.floor(b.irt / 10), uz;
  if (tj !== tb) {
    var kev = Math.min(tj, tb), tob = Math.max(tj, tb), yy = tb < tj ? 208 : 88;
    for (var i = kev; i < tob; i++) s += '<rect class="bk-villog" x="' + (240 + i * 15 - 2) + '" y="' + (yy - 2) + '" width="15" height="74" rx="3" fill="none" stroke="#e0417a" stroke-width="2.4" stroke-dasharray="4 3"/>';
    uz = tb < tj ? ((tj - tb === 1 ? "Egy tízes" : (tj - tb) + " tízes") + " lemaradt a blokkról!") : ("A blokk " + (tb - tj === 1 ? "egy" : tb - tj) + " tízessel többet kért!");
  } else uz = "Az egyesek nem stimmelnek!";
  s += '<text x="560" y="150" font-size="16" ' + BK_F + ' font-weight="600" fill="#e0417a">' + uz + '</text>';
  bkQ(".bk-otthon").innerHTML = s;
  if (kol) { var kg = bkQ(".bk-otthon-kolyok"); if (kg) new KolyokFig(kg, { x: 120, y: 300, s: 1.58 * KM_ARANY * 1.4, dir: 1, poz: "gondol" }); }
  BK.uni.poz("gondol");
  bkGombok('<button class="nagy-gomb bk-kesz" data-g="vissza">← Vissza a blokkhoz</button>');
  mondd(uz);
}
function bkVisszaBlokk() {
  bkQ(".bk-otthon").innerHTML = ""; BK.fazis = "pecset"; BK.rajz.pecset = null; bkBlokkRajz(); BK.uni.poz("figyel");
  bkGombok('<span class="bk-kerd">Koppints a pecsétre: ✓ jó · ✗ hibás</span>');
  var m = "Vissza a blokkhoz: nyomj új pecsétet!"; $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = m; mondd(m);
}

/* ═════════════════ 🔥 BEVÁLTÁS SÁRKÁNYTŰZZEL (a visszajáró közjátéka) ═════════════════ */
var BK_KR = { x0: 432, y: 296, w: 32, k: 2, h: 40 };   /* a tízes-keret: 10 hely egy sorban, a szalag helyén (a tárgy ilyenkor nincs kint) */
var BK_KASSZA_X = function (v) { return 52 + BK_KASSZA.indexOf(v) * 46; };
function bkKrX(i) { return BK_KR.x0 + i * (BK_KR.w + BK_KR.k); }
function bkKeretben() { return BK.ermek.filter(function (e) { return e.hol === "keret"; }).sort(function (a, b) { return a.k - b.k; }); }
function bkKeretFoglalt() { var n = 0; bkKeretben().forEach(function (e) { n += e.v; }); return n; }
function bkBevaltIndit(f) {
  var x = f.bolt, fok = (J.bkBevDb || 0) < 2 ? 1 : 2, kol = bkKolyok();   /* 1. döntés: az első két beváltás csak egyesekkel */
  BK.fazis = "bevalt"; BK.bevFok = fok;
  BK_KASSZA.forEach(function (v) { if (v !== 10) bkErmeUj(v, BK_KASSZA_X(v), 413, v <= 5 && (fok === 2 || v === 1) ? "kassza" : "zar"); });
  x.v.fizetErmek.forEach(function (v, i) { bkErmeUj(v, 372 + i * 46, 360, "fizetett"); });
  bkQ(".bk-kassza").insertAdjacentHTML("beforeend", '<circle class="bk-ures-tizes" cx="' + BK_KASSZA_X(10) + '" cy="413" r="' + BK_ER[10] + '" fill="none" stroke="' + HE_SZIN[10].k + '" stroke-width="2" stroke-dasharray="4 4"/>');
  bkQ(".bk-targy").innerHTML = ""; bkTenyerRajz(false); bkKeretRajz();
  var kopp = kol ? [588, 150, 124, 124] : [220, 210, 220, 110];   /* a koppintható kölyök / unikornis (nagy, láthatatlan célterület) */
  bkQ(".bk-bub").insertAdjacentHTML("beforebegin", '<rect class="bk-kopp" x="' + kopp[0] + '" y="' + kopp[1] + '" width="' + kopp[2] + '" height="' + kopp[3] + '" fill="transparent"/>');
  bkErmekRajz();
  bkVevoBub(x.v.fizetErmek.length > 1 ? "Itt van " + x.v.fizet + "!" : "Tessék, egy " + x.v.fizet + "-es!");
  var m = "Elfogyott a tízesem! Váltsunk be egyet?";
  setTimeout(function () { if (BK && BK.f === f) { bkBub(BK_TB[0], BK_TB[1], m, "tuske"); BK.tuske.pozIdeig("gondol", 1600); } }, kol ? 1500 : 300);
  mondd(m + (fok === 1 ? " Tegyél tíz egyest a keretbe!" : " Töltsd meg a keretet tallérokkal!"));
  bkGombok('<span class="bk-kerd">' + (fok === 1 ? "Tíz egyest a keretbe" : "Töltsd meg a keretet") + ", aztán koppints " + (kol ? "a kölyködre" : "az unikornisodra") + '!</span>');
}
function bkKeretRajz() {
  var T = HE_SZIN[10], E = HE_SZIN[1], s = '<g class="bk-keret"><rect x="' + (BK_KR.x0 - 8) + '" y="' + (BK_KR.y - 8) + '" width="' + (10 * (BK_KR.w + BK_KR.k) + 14) + '" height="' + (BK_KR.h + 16) + '" rx="10" fill="#fffaf0" stroke="' + T.k + '" stroke-width="2.6"/>';
  for (var i = 0; i < 10; i++) s += '<rect x="' + bkKrX(i) + '" y="' + BK_KR.y + '" width="' + BK_KR.w + '" height="' + BK_KR.h + '" rx="6" fill="none" stroke="#c9b6dc" stroke-width="1.6" stroke-dasharray="4 4"/>';
  var j = 0;   /* a tallérok alatt a helyeik: az egyes rózsaszínjében, annyi hely, amennyit érnek */
  bkKeretben().forEach(function (e) { s += '<rect x="' + bkKrX(j) + '" y="' + BK_KR.y + '" width="' + (e.v * (BK_KR.w + BK_KR.k) - BK_KR.k) + '" height="' + BK_KR.h + '" rx="6" fill="' + E.l + '" stroke="' + E.k + '" stroke-width="1.6"/>'; j += e.v; });
  s += '<text x="' + (BK_KR.x0 + 170) + '" y="' + (BK_KR.y + BK_KR.h + 24) + '" text-anchor="middle" font-size="13" ' + BK_F + ' fill="' + T.k + '">tízes-keret</text></g>';
  bkQ(".bk-szalag").innerHTML = s;
}
function bkKeretHelyez() {
  var j = 0;
  bkKeretben().forEach(function (e) { e.x = bkKrX(j) + (e.v * (BK_KR.w + BK_KR.k) - BK_KR.k) / 2; e.y = BK_KR.y + BK_KR.h / 2; j += e.v; });
  bkKeretRajz();
}
function bkBevaltKatt(e) {
  bkBub(0, 0, "", "tuske");
  if (e.hol === "kassza") {
    var szabad = 10 - bkKeretFoglalt();
    if (e.v > szabad) {   /* nem fér be: odalebeg, visszapattan — nem hiba, nem könyvelődik */
      hangGomb(); bkBub(BK_TB[0], BK_TB[1], "Ez már nem fér be.", "tuske"); BK.tuske.pozIdeig("gondol", 1600);
      var g = bkQ('[data-id="' + e.id + '"]'); if (!g || lkCsokkent()) return;
      var x1 = bkKrX(10 - szabad) + 12, y1 = BK_KR.y - 8;
      szarvVarazs(g, e.x, e.y, x1, y1, { ido: 450, nyom: bkQ(".bk-szikra") });
      setTimeout(function () { if (g.isConnected) szarvVarazs(g, x1, y1, e.x, e.y, { ido: 450 }); }, 470);
      return;
    }
    hangGomb(); bkErmeUj(e.v, e.x, e.y, "kassza");   /* a kasszában mindig marad (pótolja magát) */
    e.hol = "keret"; e.k = ++BK.szam; BK.ermek.push(BK.ermek.splice(BK.ermek.indexOf(e), 1)[0]);
    BK.uni.poz("szarvvar", 700);
  } else if (e.hol === "keret") { hangGomb(); BK.ermek.splice(BK.ermek.indexOf(e), 1); }   /* visszavette */
  else return;
  bkKeretHelyez(); bkErmekRajz();
}
/* a koppintás a kölyökre (kölyök nélkül az unikornisra): tele keret → tűz + egy tízes; félig töltött → füstpöff */
function bkOlvaszt() {
  var f = BK.f, kol = bkKolyok() && BK.kolyok, gs = bkQ(".bk-szikra"), kozep = [BK_KR.x0 + 170, BK_KR.y + BK_KR.h / 2];
  var forras = kol ? BK.kolyok.orr() : [360, 135], csok = lkCsokkent();
  if (bkKeretFoglalt() < 10) {
    if (kol) { BK.kolyok.poz("fuj", 700); setTimeout(function () { kmPoff(gs, forras[0] - 6, forras[1] + 6); }, 250); }
    else { BK.uni.poz("szarvvar", 600); kmPoff(gs, forras[0], forras[1]); }
    return;
  }
  BK.lezart = true; bkGombok(""); bkBub(0, 0, "", "tuske");
  var benn = bkKeretben(), T1 = csok ? 0 : 950, T2 = csok ? 0 : 900, T3 = csok ? 0 : 470;
  if (kol) { BK.kolyok.poz("fuj", 1500); setTimeout(function () { kmTuz(gs, forras[0] - 6, forras[1] + 8, kozep[0], kozep[1]); }, 300); }
  else { BK.uni.poz("szarvvar", 1500); setTimeout(function () { kmTuz(gs, forras[0], forras[1], kozep[0], kozep[1], ["#fff3a8", "#f6a5c0", "#9ec9f0", "#ffffff"]); }, 300); }
  setTimeout(function () {
    if (!BK || BK.f !== f) return;
    benn.forEach(function (e) { var g = bkQ('[data-id="' + e.id + '"]'); if (g) g.classList.add("bk-izzik"); });
    setTimeout(function () {
      if (!BK || BK.f !== f) return;
      benn.forEach(function (e) {   /* középre csúsznak, és eltűnnek */
        var g = bkQ('[data-id="' + e.id + '"]');
        if (g && g.animate && !csok) g.animate([{ transform: "translate(" + e.x + "px," + e.y + "px) scale(1)" }, { transform: "translate(" + kozep[0] + "px," + kozep[1] + "px) scale(.2)", opacity: .2 }], { duration: 450, easing: "ease-in", fill: "forwards" });
      });
      setTimeout(function () {
        if (!BK || BK.f !== f) return;
        benn.forEach(function (e) { BK.ermek.splice(BK.ermek.indexOf(e), 1); });
        var t = bkErmeUj(10, kozep[0], kozep[1], "uj"); bkKeretRajz(); bkErmekRajz();
        var tg = bkQ('[data-id="' + t.id + '"]');
        if (tg && tg.animate && !csok) tg.animate([{ transform: "translate(" + kozep[0] + "px," + kozep[1] + "px) scale(.2)" }, { transform: "translate(" + kozep[0] + "px," + (kozep[1] - 14) + "px) scale(1.35)" }, { transform: "translate(" + kozep[0] + "px," + kozep[1] + "px) scale(1)" }], { duration: 520 });
        BK.tuske.pozIdeig("orul", 1800); BK.uni.poz("orul", 1800); bkVevoRajz("ujjong");
        var m = "Most már van tízesünk!"; bkBub(BK_TB[0], BK_TB[1], m, "tuske"); mondd(m + " Mennyi jár vissza?");
        setTimeout(function () {   /* az új tízes a kassza üres helyére lebeg, és jön a megszokott visszajáró */
          if (!BK || BK.f !== f) return;
          t.x = BK_KASSZA_X(10); t.y = 413; t.hol = "kassza"; bkErmekRajz();
          setTimeout(function () { if (BK && BK.f === f) bkBevaltVege(f, t); }, csok ? 0 : 800);
        }, csok ? 0 : 800);
      }, T3);
    }, T2);
  }, T1);
}
function bkBevaltVege(f, t) {
  var x = f.bolt;
  x.bevaltKesz = true; J.bkBevDb = (J.bkBevDb || 0) + 1; BK.fazis = null; BK.lezart = false;
  var u = bkQ(".bk-ures-tizes"); if (u) u.remove();
  var k = bkQ(".bk-kopp"); if (k) k.remove();
  BK.ermek.filter(function (e) { return e.hol === "zar"; }).forEach(function (e) { e.hol = "kassza"; var g = bkQ('[data-id="' + e.id + '"]'); if (g) { g.setAttribute("data-hol", "kassza"); g.classList.remove("all"); } });
  bkTargyRajz(x.v.ar); bkTenyerRajz(true); if (BK.kolyok) BK.kolyok.poz("mancs");
  bkQ(".bk-szalag").innerHTML = ""; bkSzalagRajz(); bkErmekRajz(); bkKeszGomb(); bkOsszegRajz();
}

/* ═════════════════ KEZELÉS ═════════════════ */
function bkAktiv() { return BK && J && J.feladat === BK.f && BK.f && BK.f.bolt && J.joVolt !== BK.f; }
function bkKatt(ev) {
  if (!bkAktiv()) return;
  var t = ev.target;
  var er = t.closest ? t.closest(".bk-erme") : null;
  if (er && !BK.lezart && !er.classList.contains("all")) { bkErmeKatt(er.getAttribute("data-id")); return; }
  var pe = t.closest ? t.closest(".bk-pecset") : null;
  if (pe && !BK.lezart) bkPecsetKatt(pe.getAttribute("data-v"));
  if (BK.fazis === "bevalt" && !BK.lezart && t.closest && t.closest(".bk-kopp")) bkOlvaszt();
}
function bkGombKatt(ev) {
  var b = ev.target.closest ? ev.target.closest("[data-g]") : null;
  if (!b || !bkAktiv()) return;
  var g = b.getAttribute("data-g"), x = BK.f.bolt;
  if (g === "kesz" && !BK.lezart) { hangGomb(); if (x.forma === "fizet") bkFizetKesz(); else bkVisszaKesz(); }
  else if ((g === "keves" || g === "jo" || g === "sok") && BK.fazis === "becsles") { hangGomb(); bkBecsles(g); }
  else if (g.charAt(0) === "d" && g.length === 2) { hangGomb(); bkJavitBe(g.charAt(1)); }
  else if (g === "del") { hangGomb(); bkJavitBe("del"); }
  else if (g === "javok") { hangGomb(); bkJavitOk(); }
  else if (g === "vissza" && BK.fazis === "otthon") { hangGomb(); bkVisszaBlokk(); }
}
function bkBillentyu(e) {
  if (!bkAktiv() || BK.fazis !== "javit") return;
  if (document.activeElement === $("bk-beiras")) { if (e.key === "Enter") { e.preventDefault(); bkJavitOk(); } return; }   /* a mező maga kezeli a számjegyeket */
  var d = /^Digit[0-9]$/.test(e.code) ? e.code.charAt(5) : /^Numpad[0-9]$/.test(e.code) ? e.code.charAt(6) : /^[0-9]$/.test(e.key) ? e.key : null;   /* a fizikai hely (magyar kiosztás), mint events.js */
  if (d !== null) { e.preventDefault(); bkJavitBe(d); }
  else if (e.key === "Backspace") { e.preventDefault(); bkJavitBe("del"); }
  else if (e.key === "Enter") { e.preventDefault(); bkJavitOk(); }
}

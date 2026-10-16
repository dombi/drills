/* ============ 6s2) 🧺 KÖZÖS KOSÁR — az „Előbb az egész” szerszám rajza az olvasópult jobb lapján ============
   Rajz: Matekos\szerszam-letrak-egesz-rajzterv.html (✅ 2026-10-16) · átnézés: …-egesz-mit-atnezes.html (✅ 5. döntés:
   a rajz a VÁLASZRA reagál, a gyerek nem rakosgat). Egy darab modul: a 🧺 polc minden feladata ezt használja.

   Felépítés (mindig ugyanaz): fent a szereplők, alattuk a saját kupacuk, lent középen a kosár.
   Három mozdulat, mindig ebben a sorrendben:
     ① kosárba  — minden a kosárba gurul, a kosáron megjelenik az összeg
     ② oszt     — a kosárból egyforma kupacok lesznek, aztán mindenki kupaca visszamegy, és a szereplők alatt
                  halvány, szaggatott „cél-golyók” maradnak (ennyi kell legyen)
     ③ vegso    — ami sok, átrepül oda, ahol kevés van: mindenkinek a cél-helyére
   Pénzes keret: a golyó érme (felirata: 10 / 20). A közös perselyes feladatnál (Tekercs b) minden a kosárban kezd,
   a szereplőknek nincs saját kupacuk; a ③ maga a kiosztás (k.kioszt: szereplőnként az érmék sorszáma).

   Az állapot (K) a feladathoz tartozik, és a lánc minden lépése UGYANAZT az objektumot látja (f.kosar, vagy a nagyé:
   f.polcN.kosar) — így a következő lépés képe már a mozdulat utáni állapotban rajzolódik ki, mozgás nélkül.
     K = { gy: [{ nev, n }], ermek: [felirat…] | null, egy (golyó / szereplő), egyseg: "10" | "", kezd: "kupac" | "kosar",
           vOssz, vEgy: a két lépcsőfok VÁLASZA (pénznél forintban, ezért nem a golyók száma), szamOssz, szamEgy: a kosár felirata,
           tobb: { válasz: felirat } (pénz: „6 érme”), cimkeEgy: a „kell: …” felirat,
           kioszt: [[érme-index…]…] | null, allapot: "kupac" | "kosar" | "cel" | "kesz", cel: bool, szam: "" }
   A jó válasz (olvaso-polc.js polcJo → kosarJo) az érték alapján dönt: összes → ①, egy főre → ②, a nagy kérdés → ③. */

var KOSAR_SZIN = ["#f4a6c0", "#a9d4f5", "#ffd27a", "#b9e3a8", "#d4b8f3", "#ffb98a"];
var KOSAR_GESZT = ["#a0663b", "#8a5530", "#b5753f"];
var KOSAR_HAJ = ["#f2c14e", "#6b4a2b", "#e07b39", "#3b2f2a", "#c98b5a", "#9b5d3a"];
var KOSAR_G = 17;            /* a golyók távolsága (px) */
var KOSAR_M = { segit: "🧺 Tedd mindet a kosárba, aztán oszd el egyformán!" };   /* 🖊️ lektorra */

/* a jobb lap HTML-je (a generátor teszi az op.rajz-ba); a kirajzolás a kosarMutat dolga */
function kosarHTML() { return '<div class="kosar-jel"></div>'; }

/* egy gyerek-fej (egyszerű, a szín a sorszámból) */
function kosarFej(i) {
  var h = KOSAR_HAJ[i % KOSAR_HAJ.length];
  return '<svg class="kosar-fej" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="22" r="13" fill="#f6d7b8" stroke="#8a6a4a" stroke-width="1.6"/>' +
    '<path d="M7,20 Q8,6 20,6 Q32,6 33,20 Q27,12 20,13 Q13,12 7,20 Z" fill="' + h + '" stroke="#5a4430" stroke-width="1.2"/>' +
    '<circle cx="15.5" cy="23" r="1.6" fill="#3a3040"/><circle cx="24.5" cy="23" r="1.6" fill="#3a3040"/>' +
    '<path d="M16,28 Q20,31 24,28" stroke="#a05a4a" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';
}

/* ── kirajzolás (polcMutat hívja, a könyv után) ── */
var KOSAR = null;            /* { K, el, golyok, szellem, idok } — az éppen látható jelenet */
function kosarAllapot(f) { return f ? (f.kosar || (f.polcN && f.polcN.kosar) || null) : null; }
function kosarMutat(f) {
  kosarIdoStop();
  KOSAR = null;
  var K = kosarAllapot(f), el = document.querySelector("#buborek-feladat .op-jobb .kosar-jel");
  if (!K || !el) return;
  if (!K.allapot) K.allapot = K.kezd || "kupac";
  var lap = el.closest(".op-jobb"); if (lap) lap.classList.add("kosar-lap");   /* telefonon a szöveg ALATT (rajzterv 1. pont) */
  var n = K.gy.length, h = "";
  K.gy.forEach(function (g, i) { h += '<div class="kosar-gy">' + kosarFej(i) + '<span>' + g.nev + '</span></div>'; });
  h += '<div class="kosar-kosar"><span class="kosar-szam"></span></div>';
  el.innerHTML = h;
  el.classList.add("kosar-csendes");                      /* az első kép mozgás nélkül */
  var J_ = { K: K, el: el, golyok: [], szellem: [], felirat: [], idok: [] };
  /* a golyók: szereplőnként (vagy a közös perselyben) — a b[] a golyó gazdája (-1: a közösé) */
  var ermek = K.ermek, db = 0;
  if (K.kezd === "kosar") {
    ermek.forEach(function (e) { J_.golyok.push(kosarGolyo(el, K, db++, e)); J_.golyok[J_.golyok.length - 1].gazda = -1; });
  } else K.gy.forEach(function (g, k) {
    for (var i = 0; i < g.n; i++) { var b = kosarGolyo(el, K, db++, K.egyseg ? K.egyseg : null); b.gazda = k; J_.golyok.push(b); }
  });
  var celDb = K.kioszt ? K.kioszt.map(function (x) { return x.length; }) : K.gy.map(function () { return K.egy; });
  K.gy.forEach(function (g, k) {
    for (var j = 0; j < celDb[k]; j++) { var s = document.createElement("div"); s.className = "kosar-szellem"; s.k = k; s.j = j; el.appendChild(s); J_.szellem.push(s); }
    var fl = document.createElement("div"); fl.className = "kosar-cel"; fl.textContent = "kell: " + (K.cimkeEgy || K.egy); el.appendChild(fl); J_.felirat.push(fl);
  });
  KOSAR = J_;
  kosarMagassag(el, K);
  kosarRendez();
  void el.offsetWidth;
  setTimeout(function () { if (KOSAR === J_) el.classList.remove("kosar-csendes"); }, 30);
  if (!el.__kosarMeret) { el.__kosarMeret = true; window.addEventListener("resize", function () { if (KOSAR && KOSAR.el.isConnected) { kosarMagassag(KOSAR.el, KOSAR.K); kosarRendez(); } }); }
}
function kosarGolyo(el, K, i, felirat) {
  var b = document.createElement("div");
  b.className = "kosar-golyo" + (K.gesztenye ? " geszt" : "") + (felirat ? " erme" + (felirat === "20" ? " nagy" : "") : "");
  if (felirat) b.textContent = felirat;
  else b.style.background = K.gesztenye ? KOSAR_GESZT[i % 3] : KOSAR_SZIN[i % KOSAR_SZIN.length];
  el.appendChild(b);
  return b;
}
/* helyek (a jobb lap mért méretéből) */
function kosarMeret(el) { return { W: el.clientWidth || 300, H: Math.max(el.clientHeight || 260, 240) }; }
function kosarSor(W, n) { return Math.max(3, Math.min(n > 12 ? 6 : 4, Math.floor((W / n - 10) / KOSAR_G))); }
function kosarGx(M, n, k) { return M.W * (k + 0.5) / n; }
function kosarKupacXY(M, n, k, i, sor) { return [kosarGx(M, n, k) + ((i % sor) - (sor - 1) / 2) * KOSAR_G, 70 + Math.floor(i / sor) * KOSAR_G]; }
function kosarCelY(M, K) {
  var sor = kosarSor(M.W, K.gy.length), max = 0;
  K.gy.forEach(function (g) { max = Math.max(max, g.n || 0); });
  return 70 + Math.ceil(max / sor) * KOSAR_G + 30;
}
/* a jelenet magassága: a kupacok + a cél-helyek + a kosár mindig elférjen egymás alatt (ne csússzanak egymásra) */
function kosarMagassag(el, K) {
  var W = el.clientWidth || 300, sor = kosarSor(W, K.gy.length), cel = K.kioszt ? Math.max.apply(null, K.kioszt.map(function (x) { return x.length; })) : K.egy;
  var kell = kosarCelY({ W: W }, K) + Math.ceil(cel / sor) * KOSAR_G + 92;
  el.style.minHeight = Math.max(230, kell) + "px";
}
function kosarCelXY(M, K, k, j) { var sor = kosarSor(M.W, K.gy.length); return [kosarGx(M, K.gy.length, k) + ((j % sor) - (sor - 1) / 2) * KOSAR_G, kosarCelY(M, K) + Math.floor(j / sor) * KOSAR_G]; }
function kosarKosarXY(M, i, ossz) { var sor = Math.min(10, Math.max(5, Math.ceil(ossz / 3))); return [M.W / 2 + ((i % sor) - (sor - 1) / 2) * 16, M.H - 50 + Math.floor(i / sor) * 15]; }
function kosarTesz(b, p) { b.style.transform = "translate(" + (p[0] - 8) + "px," + (p[1] - 8) + "px)"; }

/* ki hol áll — A: a kirajzolt kép (a mozgókép köztes képei), alapból a feladat állapota. A K.allapot MINDIG a mozdulat
   utáni állapot (a mozgás csak látvány): ha a gyerek közben továbblép, a következő lap már a jó képpel nyílik. */
function kosarRendez(A) {
  var S = KOSAR; if (!S) return;
  var K = S.K, el = S.el, M = kosarMeret(el), n = K.gy.length, sor = kosarSor(M.W, n);
  A = A || K.allapot;
  Array.prototype.forEach.call(el.querySelectorAll(".kosar-gy"), function (d, k) { d.style.left = kosarGx(M, n, k) + "px"; });
  var szam = A === "kupac" ? "" : (S.szam != null ? S.szam : K.szam) || "";
  el.querySelector(".kosar-szam").textContent = szam;
  el.querySelector(".kosar-szam").classList.toggle("lat", !!szam);
  var cel = A === "cel";
  S.szellem.forEach(function (s) { kosarTesz(s, kosarCelXY(M, K, s.k, s.j)); s.classList.toggle("lat", cel); });
  S.felirat.forEach(function (fl, k) { var p = kosarCelXY(M, K, k, 0); fl.style.left = kosarGx(M, n, k) + "px"; fl.style.top = (p[1] - 26) + "px"; fl.classList.toggle("lat", cel); });
  var hely = kosarHelyek(S, K, A);
  S.golyok.forEach(function (b, i) {
    var p;
    if (A === "kosar" || (K.kezd === "kosar" && A !== "kesz")) p = kosarKosarXY(M, i, S.golyok.length);
    else if (A === "kesz" || A === "oszt") p = kosarCelXY(M, K, hely[i][0], hely[i][1]);
    else p = kosarKupacXY(M, n, b.gazda, hely[i][1], sor);
    kosarTesz(b, p);
  });
}
/* golyónként: [szereplő, hányadik hely] — kupacban a saját sorszáma; a végén / osztáskor a cél-helyek kitöltése */
function kosarHelyek(S, K, A) {
  var H = [], n = K.gy.length;
  if (A !== "kesz" && A !== "oszt") {
    var szaml = K.gy.map(function () { return 0; });
    S.golyok.forEach(function (b) { var k = b.gazda < 0 ? 0 : b.gazda; H.push([k, szaml[k]++]); });
    return H;
  }
  if (K.kioszt) {                                           /* a közös perselyből: a megadott kiosztás */
    K.kioszt.forEach(function (lista, k) { lista.forEach(function (gi, j) { H[gi] = [k, j]; }); });
    return H;
  }
  if (A === "oszt") {                                       /* ② egyforma kupacok, sorban kitöltve */
    S.golyok.forEach(function (b, i) { H.push([Math.min(n - 1, Math.floor(i / K.egy)), i % K.egy]); });
    return H;
  }
  /* ③ a vége: mindenki a sajátjából a cél-helyére (legfeljebb K.egy), a többlet a hiányzókhoz */
  var tele = K.gy.map(function () { return 0; }), tobblet = [];
  S.golyok.forEach(function (b, i) { if (tele[b.gazda] < K.egy) H[i] = [b.gazda, tele[b.gazda]++]; else tobblet.push(i); });
  tobblet.forEach(function (i) { for (var k = 0; k < n; k++) if (tele[k] < K.egy) { H[i] = [k, tele[k]++]; return; } H[i] = [0, 0]; });
  return H;
}
function kosarIdoStop() { if (KOSAR) KOSAR.idok.forEach(clearTimeout); }
/* képsor: [[állapot, ms], …] — a K.allapot közben már a végső */
function kosarKepsor(sor) {
  var S = KOSAR; if (!S) return;
  kosarIdoStop(); S.idok = [];
  sor.forEach(function (x) { S.idok.push(setTimeout(function () { if (KOSAR === S) kosarRendez(x[0]); }, x[1])); });
}
var KOSAR_SORREND = { kupac: 0, kosar: 1, oszt: 2, cel: 3, kesz: 4 };

/* ── a három mozdulat (a K.allapot rögtön a végső; a képsor csak a látvány) ── */
function kosarBa(szam) {
  var S = KOSAR; if (!S) return;
  var K = S.K;
  if (szam) K.szam = szam;
  if (KOSAR_SORREND[K.allapot] < 1) K.allapot = "kosar";
  kosarKepsor([["kosar", 0]]);
}
function kosarOszt(szam) {
  var S = KOSAR; if (!S) return;
  var K = S.K, volt = K.allapot;
  if (szam) K.szam = szam;
  if (K.kioszt) { kosarRendez(); return; }                  /* a közös perselyben a ② csak felirat; a kiosztás a ③ */
  K.allapot = "cel";
  kosarKepsor(volt === "kosar" ? [["oszt", 0], ["cel", 1300]] : [["kosar", 0], ["oszt", 800], ["cel", 2100]]);
}
function kosarVegso() {
  var S = KOSAR; if (!S) return;
  var K = S.K, volt = K.allapot;
  K.allapot = "kesz";
  if (K.kioszt || volt === "cel") { kosarKepsor([["kesz", 0]]); return; }
  kosarKepsor(volt === "kosar" ? [["oszt", 0], ["cel", 1300], ["kesz", 2300]] : [["kosar", 0], ["oszt", 800], ["cel", 2100], ["kesz", 3100]]);
}
/* a teljes mozgókép: 🙋 „Tedd a kosárba!” (a ③ nélkül) és a nagy jó válasza után az összefoglaló (vegig: a ③ is) */
function kosarFut(vegig) {
  var S = KOSAR; if (!S) return;
  var K = S.K, volt = K.allapot;
  if (volt === "kesz") return;
  K.szam = K.kioszt ? K.szamEgy : K.szamEgy || K.szam;
  if (K.kioszt) { K.allapot = vegig ? "kesz" : "kosar"; kosarKepsor(vegig ? [["kosar", 0], ["kesz", 1200]] : [["kosar", 0]]); return; }
  if (vegig) { kosarVegso(); return; }
  if (volt === "cel") return;
  K.allapot = "cel";
  kosarKepsor([["kosar", 0], ["oszt", 900], ["cel", 2200]]);
}

/* ── a jó válasz (polcJo hívja, mielőtt a lánc továbbmegy): az érték mondja meg, melyik mozdulat jön ── */
function kosarJo(f) {
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  var v = f.helyes;
  if (f.polcKicsiVeg || f.polcVeg || f.kosarVeg) { if (f.polcSzerep === "nagy" || f.kosarOsszefog) kosarFut(true); else kosarVegso(); return; }
  if (v === K.vOssz) kosarBa(K.szamOssz);
  else if (v === K.vEgy) kosarOszt(K.szamEgy);
  else if (K.tobb && K.tobb[v]) { K.szam = K.tobb[v]; kosarRendez(); }   /* pénz: „6 érme” — csak felirat */
}
/* 🙋 „🧺 Tedd a kosárba!” — a Tekercsben (2. döntés ✅: utána a jó válasz nem önálló) */
function kosarSegit(f) {
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  if (f.polcL) f.polcL.seg = Math.max(f.polcL.seg || 0, 2);
  f.kosarSegitVolt = true;
  kosarFut(false);
  var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 " + KOSAR_M.segit;
  mondd(ekKiejt(KOSAR_M.segit.replace(/^🧺\s*/, "")));
}

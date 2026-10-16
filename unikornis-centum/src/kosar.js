/* ============ 6s2) 🧺 KÖZÖS KOSÁR — az „Előbb az egész” szerszám jelenete az olvasópulton ============
   Rajz: Matekos\szerszam-letrak-egesz-grafika.html (✅ 2026-10-16: „A” változat, a „B” a pulton választható) ·
   előtte: …-egesz-rajzterv.html (✅) · átnézés: …-egesz-mit-atnezes.html (✅ 5. döntés: a rajz a VÁLASZRA reagál, nem rakosgat).
   Miért új rajz: az első élő próbán a gyerek azonnal elkattintott (szövegfal + pöttyök) → most a játék saját szereplői
   (FIGURA-rajzok, figurak.js) ülnek egy réten a piknik-plédon, előttük a tálkájuk, középen lent a fonott kosár.

   Felépítés: 640 × 320-as logikai vászon, a helyhez méretezve (kosarMeretez). Három mozdulat, mindig ebben a sorrendben:
     ① kosárba  — a golyók egyenként, ívben a kosárba ugranak, a kosár megbillen, kiírja az összeget
     ② oszt     — a kosárból egyforma kupacok lesznek a tálkákon, aztán mindenki kupaca visszamegy: AMI SOK, sárgán lüktet,
                  az ÜRES hely lila szaggatott karika (a gyerek látja, kinél sok, kinél kevés), fölötte „kell: 5”
     ③ vegso    — a többlet átrepül oda, ahol kevés van; mindenki örül (a motor figArc-ja: a FIGURA-rajzok ujjonganak)
   Pénzes keret: a golyó érme (10 / 20). A közös perselyes feladatnál (Tekercs b) minden a kosárban kezd, a ③ a kiosztás.
   Az első kép: a szereplők beugranak, a golyók a tálkára gurulnak (feladatonként egyszer: K.intro).

   Az állapot (K) a feladathoz tartozik; a lánc minden lépése UGYANAZT az objektumot látja (f.kosar, vagy f.polcN.kosar).
   A K.allapot MINDIG a mozdulat utáni állapot — a mozgás csak látvány —, így ha a gyerek közben továbblép, jó képpel nyílik.
     K = { gy: [{ nev, k (FIGURA-kulcs), n }], ermek: [felirat…] | null, egy (golyó / szereplő), egyseg: "10" | "", kezd: "kupac" | "kosar",
           vOssz, vEgy: a két lépcsőfok VÁLASZA (pénznél forintban), szamOssz, szamEgy: a kosár felirata, tobb: { válasz: felirat },
           cimkeEgy, kioszt: [[érme-index…]…] | null, allapot, szam, intro }
   A jó válasz (olvaso-polc.js polcJo → kosarJo) az érték alapján dönt: összes → ①, egy főre → ②, a nagy kérdés → ③. */

var KOSAR_SZIN = [["#ff9fbf", "#e05a86"], ["#8fd0ff", "#3a8fd0"], ["#ffd56a", "#d79a1c"], ["#a7e39a", "#4f9f42"], ["#cfb2ff", "#7d55c9"], ["#ffb58a", "#d9703a"]];
var KOSAR_GESZT = [["#c98a52", "#7a4a22"], ["#b57a44", "#6a3f1c"], ["#d09660", "#85532a"]];
var KOSAR_W = 640, KOSAR_H = 320;
var KOSAR_ALSO = 284;       /* a könyv alatt ennyi hely kell: a bagoly sora (~80) + a beíró sor beíró módban (~210) */
var KOSAR_M = { segit: "🧺 Tedd mindet a kosárba, aztán oszd el egyformán!" };   /* 🖊️ lektorra */

/* a jobb lap HTML-je (a generátor teszi az op.rajz-ba); a kirajzolás a kosarMutat dolga */
function kosarHTML() { return '<div class="kosar-jel"></div>'; }

/* ── a díszlet: rét, ég, piknik-pléd — és a fonott kosár két rétege (hátul a fül, elöl a fonás: a golyók közé esnek) ── */
var KOSAR_HATTER = '<svg class="ksz-hatter" viewBox="0 0 640 320" preserveAspectRatio="none" aria-hidden="true"><defs>' +
  '<linearGradient id="ksz-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8f7"/><stop offset="1" stop-color="#f3f8e8"/></linearGradient>' +
  '<linearGradient id="ksz-ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3a2"/><stop offset="1" stop-color="#94cc78"/></linearGradient>' +
  '<pattern id="ksz-pled" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#fbe7ec"/><rect width="14" height="14" fill="#f4b8c6"/><rect x="14" y="14" width="14" height="14" fill="#f4b8c6"/></pattern></defs>' +
  '<rect width="640" height="320" fill="url(#ksz-eg)"/><circle cx="572" cy="44" r="24" fill="#ffe7a0" opacity=".9"/>' +
  '<g fill="#fff" opacity=".9"><ellipse cx="110" cy="40" rx="36" ry="13"/><ellipse cx="136" cy="33" rx="24" ry="13"/><ellipse cx="400" cy="28" rx="28" ry="10"/></g>' +
  '<path d="M0,128 Q160,100 320,120 T640,112 L640,320 L0,320 Z" fill="url(#ksz-ret)"/>' +
  '<path d="M0,150 Q200,130 380,146 T640,140" stroke="#a9d48c" stroke-width="3" fill="none"/>' +
  '<g fill="#fff" opacity=".85"><circle cx="30" cy="176" r="3"/><circle cx="612" cy="190" r="3"/><circle cx="240" cy="160" r="2.5"/><circle cx="470" cy="166" r="2.5"/></g>' +
  '<path d="M40,214 L600,214 L636,318 L4,318 Z" fill="url(#ksz-pled)" stroke="#e79aae" stroke-width="2"/></svg>';
function kosarRajz(elo) {
  var s = '<svg viewBox="0 0 170 110" aria-hidden="true">';
  if (!elo) return s + '<path d="M38,40 Q85,-14 132,40" stroke="#b07a3e" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M38,40 Q85,-14 132,40" stroke="#d9a25e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="85" cy="48" rx="72" ry="13" fill="#7a4e24"/></svg>';
  var w = "", i;
  for (i = 0; i < 9; i++) w += '<path d="M' + (20 + i * 16) + ',52 Q' + (26 + i * 16) + ',76 ' + (24 + i * 15) + ',100" stroke="#b9823f" stroke-width="2" fill="none" opacity=".6"/>';
  for (i = 0; i < 4; i++) w += '<path d="M' + (16 + i * 4) + ',' + (60 + i * 11) + ' Q85,' + (70 + i * 11) + ' ' + (154 - i * 4) + ',' + (60 + i * 11) + '" stroke="#f3cf8e" stroke-width="3" fill="none" opacity=".7"/>';
  return s + '<path d="M13,48 Q85,64 157,48 L146,98 Q85,112 24,98 Z" fill="#e2ad66" stroke="#9c6a32" stroke-width="3"/>' + w +
    '<path d="M13,48 Q85,64 157,48" stroke="#c48a45" stroke-width="7" fill="none" stroke-linecap="round"/></svg>';
}
var KOSAR_TAL = '<svg viewBox="0 0 120 26" aria-hidden="true"><ellipse cx="60" cy="14" rx="58" ry="11" fill="#fff" stroke="#c9b9e6" stroke-width="2.5"/><ellipse cx="60" cy="12" rx="44" ry="6" fill="#f3eefb"/></svg>';

/* ── helyek a 640 × 320-as vásznon ── */
function kosarFx(n, k) { return n === 2 ? [168, 472][k] : KOSAR_W * (k + 0.5) / n; }        /* a szereplő közepe */
var KOSAR_TAL_Y = 210;                                                                          /* a tálka közepe */
function kosarTalXY(n, k, i) { return [kosarFx(n, k) - 8 + ((i % 6) - 2.5) * 16, KOSAR_TAL_Y - 10 - Math.floor(i / 6) * 13]; }
function kosarKosarXY(i) { return [320 - 8 + ((i % 8) - 3.5) * 14, 290 - Math.floor(i / 8) * 11]; }
function kosarCimkeXY(n, k) { return [kosarFx(n, k), KOSAR_TAL_Y + 12]; }

/* ── kirajzolás (polcMutat hívja, a könyv után) ── */
var KOSAR = null;            /* { K, el, vaszon, golyok, szellem, felirat, idok } — az éppen látható jelenet */
function kosarAllapot(f) { return f ? (f.kosar || (f.polcN && f.polcN.kosar) || null) : null; }
function kosarMutat(f) {
  kosarIdoStop();
  KOSAR = null;
  var K = kosarAllapot(f), el = document.querySelector("#buborek-feladat .op-jobb .kosar-jel");
  if (!K || !el) return;
  if (!K.allapot) K.allapot = K.kezd || "kupac";
  var lap = el.closest(".op-jobb"); if (lap) lap.classList.add("kosar-lap");
  var n = K.gy.length, intro = !K.intro; K.intro = true;
  var h = '<div class="ksz-vaszon">' + KOSAR_HATTER;
  K.gy.forEach(function (g, k) {
    h += '<div class="ksz-fig' + (intro ? " ksz-be" : "") + '" style="left:' + (kosarFx(n, k) - 56) + 'px;' + (intro ? "animation-delay:" + (k * 0.22) + "s" : "") + '">' +
      '<span class="ksz-nev">' + (FIGURA[g.k] ? FIGURA[g.k].tel : g.nev) + '</span>' + figuraSVG(g.k, "vidam", "alak") + '</div>' +
      '<div class="ksz-tal" style="left:' + (kosarFx(n, k) - 60) + 'px">' + KOSAR_TAL + '</div>';
  });
  h += '<div class="ksz-kosar-hat">' + kosarRajz(false) + '</div><div class="ksz-kosar-elo">' + kosarRajz(true) + '</div><span class="ksz-szam"></span></div>';
  el.innerHTML = h;
  var v = el.firstChild, S = { K: K, el: el, vaszon: v, golyok: [], szellem: [], felirat: [], idok: [] };
  var db = 0;
  if (K.kezd === "kosar") K.ermek.forEach(function (e) { var b = kosarGolyo(v, K, db++, e); b.gazda = -1; S.golyok.push(b); });
  else K.gy.forEach(function (g, k) { for (var i = 0; i < g.n; i++) { var b = kosarGolyo(v, K, db++, K.egyseg || null); b.gazda = k; S.golyok.push(b); } });
  var celDb = K.kioszt ? K.kioszt.map(function (x) { return x.length; }) : K.gy.map(function () { return K.egy; });
  K.gy.forEach(function (g, k) {
    for (var j = 0; j < celDb[k]; j++) { var s = document.createElement("div"); s.className = "ksz-szellem"; s.k = k; s.j = j; v.appendChild(s); S.szellem.push(s);
      var p = kosarTalXY(n, k, j); s.style.transform = "translate(" + (p[0] - 2) + "px," + (p[1] - 2) + "px)"; }
    var fl = document.createElement("div"); fl.className = "ksz-cel"; fl.textContent = "kell: " + (K.cimkeEgy || K.egy);
    var c = kosarCimkeXY(n, k); fl.style.left = c[0] + "px"; fl.style.top = c[1] + "px"; v.appendChild(fl); S.felirat.push(fl);
  });
  KOSAR = S;
  kosarMeretez();
  if (intro && K.kezd !== "kosar") {                      /* az első kép: a golyók oldalról a tálkára gurulnak */
    var sz = K.gy.map(function () { return 0; });
    S.golyok.forEach(function (b) { b.hely = [b.gazda < n / 2 ? -30 : KOSAR_W + 30, KOSAR_TAL_Y - 10]; kosarTesz(b, b.hely); sz[b.gazda]++; });
    kosarKepsor([[K.allapot, 600]], 70);
  } else kosarRendez(null, true);
  if (!window.__kosarMeret) { window.__kosarMeret = true; window.addEventListener("resize", function () { if (KOSAR && KOSAR.el.isConnected) kosarMeretez(); }); }
}
function kosarGolyo(v, K, i, felirat) {
  var b = document.createElement("div");
  b.className = "ksz-golyo" + (felirat ? " erme" + (felirat === "20" ? " nagy" : "") : "") + (K.gesztenye && !felirat ? " geszt" : "");
  if (felirat) b.textContent = felirat;
  else { var c = (K.gesztenye ? KOSAR_GESZT : KOSAR_SZIN)[i % (K.gesztenye ? 3 : KOSAR_SZIN.length)]; b.style.background = "radial-gradient(circle at 35% 30%, #fff 0 8%, " + c[0] + " 32%, " + c[1] + " 100%)"; }
  v.appendChild(b);
  return b;
}
/* a vászon a helyhez méretezve: a teljes szélesség, de legfeljebb ~36%-nyi képernyőmagasság (laptopon is egy képen maradjon) */
function kosarMeretez() {
  var S = KOSAR; if (!S) return;
  var felul = !!S.el.closest(".op-felul") && window.innerWidth < 900;      /* „A” keskeny képernyőn: a jelenet a szöveg fölött */
  var w = S.el.clientWidth || 320, maxH = Math.max(170, Math.round(window.innerHeight * (felul ? 0.36 : 0.52)));
  var s = Math.min(w / KOSAR_W, maxH / KOSAR_H);
  kosarSkala(S, w, s);
  /* a válasz mindig férjen a képernyőre (1366 × 660-as laptopon is, beíró módban is): a könyv alatt kell ~290 px a bagolynak
     és a beíró sornak — ha nincs meg, a jelenet annyival kisebb lesz (legalább 130 px) */
  var kv = S.el.closest(".op-konyv"), tul = kv ? kv.getBoundingClientRect().bottom + KOSAR_ALSO - window.innerHeight : 0;
  if (tul > 0 && window.innerWidth >= 640) kosarSkala(S, w, Math.max(110 / KOSAR_H, (KOSAR_H * s - tul) / KOSAR_H));
}
function kosarSkala(S, w, s) {
  S.vaszon.style.transform = "translateX(" + Math.max(0, (w - KOSAR_W * s) / 2) + "px) scale(" + s + ")";
  S.el.style.height = Math.round(KOSAR_H * s) + "px";
}
function kosarTesz(b, p) { b.style.transform = "translate(" + p[0] + "px," + p[1] + "px)"; }

/* ki hol áll — A: a kirajzolt kép (a mozgókép köztes képei), alapból a feladat állapota. csendes: mozgás nélkül */
function kosarRendez(A, csendes, kes) {
  var S = KOSAR; if (!S) return;
  var K = S.K, v = S.vaszon, n = K.gy.length;
  A = A || K.allapot;
  var szam = A === "kupac" ? "" : (K.szam || "");
  var sz = v.querySelector(".ksz-szam"); sz.textContent = szam; sz.classList.toggle("lat", !!szam);
  var cel = A === "cel", hely = kosarHelyek(S, K, A), van = K.gy.map(function () { return 0; });
  if (cel) S.golyok.forEach(function (b, i) { if (hely[i][2]) van[hely[i][0]]++; });
  S.szellem.forEach(function (s) { s.classList.toggle("lat", cel && s.j >= van[s.k]); });          /* csak az ÜRES hely karikája */
  S.felirat.forEach(function (fl) { fl.classList.toggle("lat", cel); });
  var tele = K.gy.map(function () { return 0; });
  S.golyok.forEach(function (b, i) {
    var p, h = hely[i];
    if (h[0] < 0) p = kosarKosarXY(h[1]);
    else p = kosarTalXY(n, h[0], h[1]);
    var tobb = cel && h[2] && ++tele[h[0]] > (K.kioszt ? K.kioszt[h[0]].length : K.egy);
    b.classList.toggle("tobblet", !!tobb);                                                         /* ami sok: lüktet */
    kosarRepit(b, p, (kes || 0) * i, csendes);
  });
}
/* golyónként: [szereplő (-1 = kosár), hányadik hely, a sajátja-e] */
function kosarHelyek(S, K, A) {
  var H = [], n = K.gy.length, i;
  if (A === "kosar" || (K.kezd === "kosar" && A !== "kesz")) { S.golyok.forEach(function (b, i) { H.push([-1, i, false]); }); return H; }
  if (A === "kupac" || A === "cel") {
    var szaml = K.gy.map(function () { return 0; });
    S.golyok.forEach(function (b) { H.push([b.gazda, szaml[b.gazda]++, true]); });
    return H;
  }
  if (K.kioszt) { K.kioszt.forEach(function (lista, k) { lista.forEach(function (gi, j) { H[gi] = [k, j, false]; }); }); return H; }
  if (A === "oszt") { S.golyok.forEach(function (b, i) { H.push([Math.min(n - 1, Math.floor(i / K.egy)), i % K.egy, false]); }); return H; }
  /* ③ a vége: mindenki a sajátjából (legfeljebb K.egy), a többlet a hiányzókhoz */
  var tele = K.gy.map(function () { return 0; }), tobblet = [];
  S.golyok.forEach(function (b, i) { if (tele[b.gazda] < K.egy) H[i] = [b.gazda, tele[b.gazda]++, false]; else tobblet.push(i); });
  tobblet.forEach(function (i) { for (var k = 0; k < n; k++) if (tele[k] < K.egy) { H[i] = [k, tele[k]++, false]; return; } H[i] = [0, 0, false]; });
  return H;
}
/* egy golyó ívben repül a helyére (ha már ott van, nem mozdul) */
function kosarRepit(b, p, kes, csendes) {
  var a = b.hely;
  if (a && a[0] === p[0] && a[1] === p[1]) return;
  b.hely = p;
  if (!a || csendes || !b.animate || kosarCsendesE()) { kosarTesz(b, p); return; }
  var mx = (a[0] + p[0]) / 2, my = Math.min(a[1], p[1]) - (Math.abs(a[0] - p[0]) > 200 ? 110 : 60);
  try {
    b.animate([{ transform: "translate(" + a[0] + "px," + a[1] + "px)" }, { transform: "translate(" + mx + "px," + my + "px)", offset: .5 },
      { transform: "translate(" + p[0] + "px," + p[1] + "px)" }], { duration: 650, delay: kes || 0, easing: "ease-in-out", fill: "backwards" });
  } catch (e) {}
  kosarTesz(b, p);
}
function kosarCsendesE() { return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function kosarIdoStop() { if (KOSAR) KOSAR.idok.forEach(clearTimeout); }
/* képsor: [[állapot, ms], …] — a K.allapot közben már a végső. kes: golyónkénti késleltetés (ms) */
function kosarKepsor(sor, kes) {
  var S = KOSAR; if (!S) return;
  kosarIdoStop(); S.idok = [];
  sor.forEach(function (x) { S.idok.push(setTimeout(function () { if (KOSAR === S) { kosarRendez(x[0], false, kes != null ? kes : 45); if (x[0] === "kosar") kosarBillen(); } }, x[1])); });
}
function kosarBillen() { var e = KOSAR && KOSAR.vaszon.querySelector(".ksz-kosar-elo"); if (!e) return; e.classList.remove("ksz-billen"); void e.offsetWidth; e.classList.add("ksz-billen"); }
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
  kosarKepsor(volt === "kosar" ? [["oszt", 0], ["cel", 1700]] : [["kosar", 0], ["oszt", 1300], ["cel", 3000]]);
}
function kosarVegso() {
  var S = KOSAR; if (!S) return;
  var K = S.K, volt = K.allapot;
  K.allapot = "kesz";
  if (K.kioszt || volt === "cel") { kosarKepsor([["kesz", 0]], 180); return; }
  kosarKepsor(volt === "kosar" ? [["oszt", 0], ["cel", 1700], ["kesz", 2900]] : [["kosar", 0], ["oszt", 1300], ["cel", 3000], ["kesz", 4200]]);
}
/* a teljes mozgókép: 🙋 „Tedd a kosárba!” (a ③ nélkül) és a nagy jó válasza után az összefoglaló (vegig: a ③ is) */
function kosarFut(vegig) {
  var S = KOSAR; if (!S) return;
  var K = S.K, volt = K.allapot;
  if (volt === "kesz") return;
  K.szam = K.szamEgy || K.szam;
  if (K.kioszt) { K.allapot = vegig ? "kesz" : "kosar"; kosarKepsor(vegig ? [["kosar", 0], ["kesz", 1300]] : [["kosar", 0]]); return; }
  if (vegig) { kosarVegso(); return; }
  if (volt === "cel") return;
  K.allapot = "cel";
  kosarKepsor([["kosar", 0], ["oszt", 1300], ["cel", 3000]]);
}

/* ── a jó válasz (polcJo hívja, mielőtt a lánc továbbmegy): az érték mondja meg, melyik mozdulat jön ── */
function kosarJo(f) {
  if (f.egAbra) { if (f.polcVeg) segAbraFut(f, true); return; }   /* 🏅 a Mesterpróba ábrája a válaszig (szerszam-egesz-mester.js) */
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  var v = f.helyes;
  if (f.polcKicsiVeg || f.polcVeg || f.kosarVeg) { if (f.polcSzerep === "nagy" || f.kosarOsszefog) kosarFut(true); else kosarVegso(); return; }
  if (v === K.vOssz) kosarBa(K.szamOssz);
  else if (v === K.vEgy) kosarOszt(K.szamEgy);
  else if (K.tobb && K.tobb[v]) { K.szam = K.tobb[v]; kosarRendez(); }   /* pénz: „6 érme” — csak felirat */
}
/* 🙋 „🧺 Tedd a kosárba!” — a Tekercsben (2. döntés ✅: utána a jó válasz nem önálló) */
function kosarSegit(f) {
  if (f.egAbra) { segAbraSegit(f); return; }               /* 🏅 a Mesterpróba ábrája a „?”-ig */
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  if (f.polcL) f.polcL.seg = Math.max(f.polcL.seg || 0, 2);
  f.kosarSegitVolt = true;
  kosarFut(false);
  var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 " + KOSAR_M.segit;
  mondd(ekKiejt(KOSAR_M.segit.replace(/^🧺\s*/, "")));
}

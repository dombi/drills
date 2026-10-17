/* ============ 6s2) 🧺 KÖZÖS KOSÁR — az „Előbb az egész” szerszám jelenete: a gyerek ÖNT és OSZT ============
   Terv: Matekos\szerszam-letrak-egesz-ont-oszt-rajzterv.html (✅ 2026-10-17, mind a 9 döntés) ·
   kipróbálható: …-egesz-ont-oszt-probalap.html (✅ 2026-10-17) · háttér: Matekos\pedagogia-cselekvo-tanulas.html.
   Előtte a kosár csak a VÁLASZRA mozdult (a gyerek nézte). Most a gyerek keze dolgozik (vezérelv: a kép a gondolkodás helye):
     👆 tálkára koppint  → a tálka golyói ívben a kosárba ömlenek (ÖNT)
     👆 kosárra koppint  → egy kör: mindenki kap egyet a kosárból — ha lehet, a sajátját (OSZT)
     👆 zacskóra koppint → ha nem jut mindenkinek zacskó, kibomlik: 10 golyó a kosárban (BONT; a 📜 Tekercs nagy számainál)
   📖 Mesekönyv (és a 🛗 lift kicsije): előbb önt / oszt, AZTÁN felel — amíg nem öntött, nem lehet felelni (kosarZar).
   📜 Tekercs: előbb felel, a kosár választható; a 🎯 jó válasza után a kiosztás ellenőriz (kosarVegso).
   Rossz válaszra a KÉP felel (kosarRossz): eljátssza, mi lenne, ha a gyerek számának lenne igaza.
   A kép NEM írja ki, amit a gyereknek kell kiszámolnia (producer, 2026-10-17): a kosár fölött „?”, amíg nem mondta ki;
   a tányér alatt a darabszám látszik, de osztás után „?”, amíg nem felelt a „hány jut egynek?” kérdésre.
   Állandó helyek: minden golyó a kupacában egy sorszámot kap (az első szabadot), így ha egy elmegy, a többi nem rendeződik át.
   Első találkozás (8. döntés): a legelső Mesekönyv-feladat előtt szabad játék a „Kezdjük!” gombig (P().kosarIsmer).

   K (a feladathoz tartozó állapot; a lánc minden lépése UGYANAZT látja, f.kosar vagy f.polcN.kosar):
     gy: [{ nev, k (FIGURA-kulcs), n }], ermek | null, egy, egyseg ("10" = 10 forintos érme), gesztenye, kezd ("kupac" | "kosar"),
     vOssz, vEgy, szamOssz, kezi (az új, kézi kosár), mese (a Mesekönyv első lánca: szabad játék), zacsko (10-es zacskók), ad: { g, r }
     — futás közben: e (elemek), e0 (a kezdő állapot), osztva, szamKi, dbKi, kesz, szabad */

var KOSAR_SZIN = [["#ff9fbf", "#e05a86"], ["#8fd0ff", "#3a8fd0"], ["#ffd56a", "#d79a1c"], ["#a7e39a", "#4f9f42"], ["#cfb2ff", "#7d55c9"], ["#ffb58a", "#d9703a"]];
var KOSAR_GESZT = [["#c98a52", "#7a4a22"], ["#b57a44", "#6a3f1c"], ["#d09660", "#85532a"]];
var KOSAR_W = 640, KOSAR_H = 320;
var KOSAR_ALSO = 284;       /* a könyv alatt ennyi hely kell: a bagoly sora (~80) + a beíró sor beíró módban (~210) */
var KOSAR_SZAMSZO = ["", "", "ketten", "hárman", "négyen"];
/* 🖊️ lektorra — a bagoly mondatai a kosárnál */
var KOSAR_M = {
  segit: "🧺 Tedd mindet a kosárba, aztán oszd el egyformán!",
  segitKez: "Koppints a tálkákra: a golyók a kosárba ömlenek. Aztán koppints a kosárra: minden koppintásra mindenki kap egyet.",
  ontKell: "Előbb öntsd a kosárba: koppints a tálkákra!",
  ontMeg: "Még van a tálkákon. Azt is öntsd a kosárba!",
  osztKell: "Most oszd szét: koppints a kosárra! Minden koppintásra mindenki kap egyet.",
  kor: function (n) { return n + ". kör: mindenki kapott egyet."; },
  nemJut: "Ennyi már nem jut mindenkinek.",
  zacskoNem: function (z, n) { return z + " zacskó maradt, de " + (KOSAR_SZAMSZO[n] || n + "-an") + " vannak. Nem jut mindenkinek! Koppints egy zacskóra: bontsd ki!"; },
  zacskoMeg: "Még jut mindenkinek zacskó: előbb azokat oszd ki, koppints a kosárra!",
  bontva: "Kibomlott: 10 golyó a kosárban.",
  ures: "🧺 ide öntheted",
  szabad: "Ez a kosár. Ha mindent beleöntesz, igazságosan szét tudod osztani. Próbáld ki!",
  szabadZar: "Előbb próbáld ki a kosarat, aztán koppints: Kezdjük!",
  kezdjuk: "Kezdjük! ▶",
  probald: "Próbáld ki a kosarat!",
  szabadJo: "Ügyes! Így működik a kosár. Ha készen állsz, koppints: Kezdjük!"
};

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
var KOSAR_ZACSKO = '<svg viewBox="-18 -18 36 40" aria-hidden="true"><path d="M-15,15 Q-19,-3 -8,-9 L-5,-15 L5,-15 L8,-9 Q19,-3 15,15 Q0,21 -15,15 Z" fill="#f3dcb0" stroke="#a77b45" stroke-width="2"/>' +
  '<path d="M-8,-9 Q0,-6 8,-9" stroke="#c0504d" stroke-width="2.5" fill="none"/><text y="9" text-anchor="middle" font-family="Fredoka, system-ui, sans-serif" font-weight="700" font-size="12" fill="#7a4e24">10</text></svg>';

/* ── helyek a 640 × 320-as vásznon (a bal felső sarok; golyó 16 px, kicsi golyó 13 px, zacskó 28 × 32) ── */
function kosarFx(n, k) { return n === 2 ? [168, 472][k] : n === 3 ? [100, 320, 540][k] : KOSAR_W * (k + 0.5) / n; }   /* a szereplő közepe */
var KOSAR_TAL_Y = 190;                                          /* a tálka teteje */
/* egy elem helye a sorszáma (s) szerint — ötösével csoportosítva, hogy a szem megszámolhassa */
function kosarPont(n, h, t, s) {
  if (h === "k") {
    if (t === "z") return [320 - 14 + ((s % 4) - 1.5) * 32, 224 - Math.floor(s / 4) * 24];
    var c = s % 10, r = Math.floor(s / 10);
    return [320 - 6 + (c - 4.5) * 11 + (c >= 5 ? 3 : -3), 247 - r * 11];
  }
  var fx = kosarFx(n, h);
  if (t === "z") return [fx - 58 + s * 20, 158];
  if (n === 2) { var c2 = s % 5, r2 = Math.floor(s / 5); return [fx - 8 + (c2 - 2) * 17, 193 - r2 * 13]; }
  var c3 = s % 10, r3 = Math.floor(s / 10);
  return [fx - 6 + (c3 - 4.5) * 10.5 + (c3 >= 5 ? 3 : -3), 196 - r3 * 11];
}

/* ── az elemek (a feladat első megjelenésekor egyszer) ── */
function kosarElemek(K) {
  var E = [], id = 0;
  if (K.kezd === "kosar") (K.ermek || []).forEach(function (f) { E.push({ id: ++id, t: "g", c: -1, f: f, h: "k" }); });
  else K.gy.forEach(function (g, k) {
    var n = g.n, z = K.zacsko ? Math.floor(n / 10) : 0, i;
    for (i = 0; i < z; i++) E.push({ id: ++id, t: "z", c: k, f: "", h: k });
    for (i = 0; i < n - z * 10; i++) E.push({ id: ++id, t: "g", c: k, f: K.egyseg || "", h: k });
  });
  E.forEach(function (e) { e.s = -1; });
  K.uid = id;
  kosarHelyKioszt(K, E);
  return E;
}
/* aki most érkezett, az első szabad helyet kapja (a többi a helyén marad) */
function kosarHelyKioszt(K, E) {
  var fogl = {};
  E.forEach(function (e) { if (e.s >= 0 && e.sh === e.h) (fogl[e.h + "|" + e.t] = fogl[e.h + "|" + e.t] || {})[e.s] = 1; });
  E.forEach(function (e) {
    if (e.s >= 0 && e.sh === e.h) return;
    var f = fogl[e.h + "|" + e.t] = fogl[e.h + "|" + e.t] || {}, s = 0;
    while (f[s]) s++;
    f[s] = 1; e.s = s; e.sh = e.h;
  });
}
function kosarItt(K, h, t) { return K.e.filter(function (e) { return e.h === h && e.h !== "x" && (!t || e.t === t); }); }
function kosarErtek(L) { return L.reduce(function (a, e) { return a + (e.t === "z" ? 10 : e.f ? +e.f : 1); }, 0); }
function kosarTalonVan(K) { return K.gy.some(function (g, k) { return kosarItt(K, k).length > 0; }); }
function kosarEgyforma(K) {
  if (kosarItt(K, "k").length) return false;
  var v = kosarErtek(kosarItt(K, 0)), db = kosarItt(K, 0).length;
  return K.gy.every(function (g, k) { var L = kosarItt(K, k); return kosarErtek(L) === v && (!K.kezd || K.kezd !== "kosar" || L.length === db); });
}

/* ── kirajzolás (polcMutat hívja, a könyv után) ── */
var KOSAR = null;            /* { K, f, el, vaszon, el: {id: div}, idok, fut } — az éppen látható jelenet */
function kosarAllapot(f) { return f ? (f.kosar || (f.polcN && f.polcN.kosar) || null) : null; }
function kosarMutat(f) {
  kosarIdoStop();
  KOSAR = null;
  var K = kosarAllapot(f), el = document.querySelector("#buborek-feladat .op-jobb .kosar-jel");
  if (!K || !el) return;
  var lap = el.closest(".op-jobb"); if (lap) lap.classList.add("kosar-lap");
  var n = K.gy.length, intro = !K.intro; K.intro = true;
  if (!K.e) {
    K.e = kosarElemek(K); K.e0 = JSON.parse(JSON.stringify(K.e));
    if (K.mese && K.kezi && !P().kosarIsmer) K.szabad = true;      /* első találkozás: szabad játék (8. döntés ✅) */
  }
  var h = '<div class="ksz-vaszon' + (n > 2 ? " ksz-sok" : "") + '">' + KOSAR_HATTER;
  K.gy.forEach(function (g, k) {
    h += '<div class="ksz-fig' + (intro ? " ksz-be" : "") + '" data-k="' + k + '" style="left:' + (kosarFx(n, k) - 56) + 'px;' + (intro ? "animation-delay:" + (k * 0.22) + "s" : "") + '">' +
      '<span class="ksz-nev">' + (FIGURA[g.k] ? FIGURA[g.k].tel : g.nev) + '</span>' + figuraSVG(g.k, "vidam", "alak") + '</div>' +
      '<div class="ksz-tal" data-k="' + k + '" style="left:' + (kosarFx(n, k) - 60) + 'px;top:' + KOSAR_TAL_Y + 'px">' + KOSAR_TAL + '</div>' +
      '<span class="ksz-db" data-k="' + k + '" style="left:' + (kosarFx(n, k) + (n > 2 ? 46 : 54)) + 'px"></span>';
  });
  h += '<div class="ksz-kosar-hat" data-kosar="1">' + kosarRajz(false) + '</div><div class="ksz-kosar-elo" data-kosar="1">' + kosarRajz(true) + '</div>' +
    '<span class="ksz-szam"></span><span class="ksz-ujj" aria-hidden="true">👆</span>' +
    (K.szabad ? '<span class="ksz-probald">' + KOSAR_M.probald + '</span><button type="button" class="ksz-kezdjuk">' + KOSAR_M.kezdjuk + '</button>' : "") + '</div>';
  el.innerHTML = h;
  var v = el.firstChild, S = { K: K, f: f, el: el, vaszon: v, elem: {}, idok: [], fut: false, alt: null };
  K.e.forEach(function (e) { if (e.h !== "x") kosarElemDiv(S, e); });
  v.addEventListener("click", kosarKatt);
  KOSAR = S;
  if (K.dbKi && !K.kesz) kosarAtadott();                   /* a nagy kérdés lapja: Miától jött golyók lüktetnek */
  kosarMeretez();
  if (intro && K.kezd !== "kosar") {                      /* az első kép: a golyók oldalról a tálkára gurulnak */
    K.e.forEach(function (e) { var d = S.elem[e.id]; if (d && e.h !== "k") { d.hely = [e.h < n / 2 ? -30 : KOSAR_W + 30, KOSAR_TAL_Y]; kosarTesz(d, d.hely); } });
    kosarRajzol(70);
  } else kosarRajzol(0, true);
  if (K.szabad && f.opElo && f.opElo !== KOSAR_M.szabad) { K.kuldEl = f.opElo; f.opElo = KOSAR_M.szabad; }   /* a polcMutat ezt írja ki: előbb a kosár, a küldetés a „Kezdjük!” után */
  if (!window.__kosarMeret) { window.__kosarMeret = true; window.addEventListener("resize", function () { if (KOSAR && KOSAR.el.isConnected) kosarMeretez(); }); }
}
function kosarElemDiv(S, e) {
  var K = S.K, d = document.createElement("div");
  if (e.t === "z") { d.className = "ksz-zacsko"; d.innerHTML = KOSAR_ZACSKO; }
  else {
    d.className = "ksz-golyo" + (e.f ? " erme" + (e.f === "20" ? " nagy" : "") : "") + (K.gesztenye && !e.f ? " geszt" : "");
    if (e.f) d.textContent = e.f;
    else { var c = (K.gesztenye ? KOSAR_GESZT : KOSAR_SZIN)[(e.c < 0 ? 0 : e.c) % (K.gesztenye ? 3 : KOSAR_SZIN.length)]; d.style.background = "radial-gradient(circle at 35% 30%, #fff 0 8%, " + c[0] + " 32%, " + c[1] + " 100%)"; }
  }
  d.setAttribute("data-e", e.id);
  S.vaszon.appendChild(d); S.elem[e.id] = d;
  return d;
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

/* minden elem a helyére (ívben, e.kes késleltetéssel), a feliratok, az ujj. csendes: mozgás nélkül.
   felulir: {id: [hely, sorszám]} — a rossz válasz eljátszásához (a K nem változik) */
function kosarRajzol(kes, csendes, felulir) {
  var S = KOSAR; if (!S) return;
  var K = S.K, n = K.gy.length;
  kosarHelyKioszt(K, K.e);
  var i = 0;
  K.e.forEach(function (e) {
    var d = S.elem[e.id]; if (!d) { if (e.h === "x") return; d = kosarElemDiv(S, e); if (e.szul) { d.hely = e.szul; kosarTesz(d, d.hely); } }
    if (e.h === "x") { d.classList.add("ksz-el"); return; }
    var hol = felulir && felulir[e.id] ? felulir[e.id] : [e.h, e.s];
    var p = kosarPont(n, hol[0], e.t, hol[1]);
    d.classList.toggle("kicsi", e.t === "g" && !e.f && (hol[0] === "k" || n > 2));
    d.classList.toggle("bent", hol[0] === "k");
    d.classList.toggle("tobblet", !!(S.fenyl && S.fenyl[e.id]));
    kosarRepit(d, p, e.kes != null ? e.kes : (kes || 0) * i++, csendes);
    e.kes = null;
  });
  /* a tányér alatti szám: osztás után „?”, amíg a gyerek nem felelt a „hány jut egynek?” kérdésre */
  K.gy.forEach(function (g, k) {
    var c = S.vaszon.querySelector('.ksz-db[data-k="' + k + '"]'); if (!c) return;
    var L = felulir ? K.e.filter(function (e) { return felulir[e.id] && felulir[e.id][0] === k; }) : kosarItt(K, k);
    var rejt = K.osztva && !K.dbKi && !K.szabad && !felulir, ert = kosarErtek(L);
    c.textContent = rejt ? "?" : ert + (K.egyseg || K.kezd === "kosar" ? " Ft" : "");
    c.classList.toggle("rossz", !!(felulir && S.altRossz && S.altRossz[k]));
  });
  /* a kosár felirata: „?”, amíg a gyerek ki nem mondta az összeget; üresen: ide öntheted */
  var sz = S.vaszon.querySelector(".ksz-szam"), bent = kosarItt(K, "k").length, t = "";
  if (K.kesz) t = "";
  else if (!bent && !K.osztva && K.kezd !== "kosar") t = KOSAR_M.ures;
  else if (bent && K.mod !== "tek" && K.kezd !== "kosar") t = K.szamKi ? K.szamOssz : "?";
  sz.textContent = t; sz.classList.toggle("lat", !!t); sz.classList.toggle("kicsi", t === KOSAR_M.ures);
  kosarUjjRajz();
}
/* hova mutasson az ujj (csak a Mesekönyvben, és ha a 🙋 kérte) */
function kosarUjjRajz() {
  var S = KOSAR; if (!S) return;
  var K = S.K, u = S.vaszon.querySelector(".ksz-ujj"), hol = null, n = K.gy.length;
  if (!K.kesz && !K.szabad && !S.fut && (K.mod !== "tek" || S.segit)) {
    var tk = -1; K.gy.forEach(function (g, k) { if (tk < 0 && kosarItt(K, k).length && !K.osztva) tk = k; });
    if (tk >= 0 && K.kezd !== "kosar") hol = [kosarFx(n, tk) - 16, KOSAR_TAL_Y + 22];
    else if (kosarItt(K, "k").length && (K.szamKi || K.mod === "tek" || K.kezd === "kosar")) hol = [392, 262];
  }
  u.classList.toggle("lat", !!hol);
  if (hol) { u.style.left = hol[0] + "px"; u.style.top = hol[1] + "px"; }
}
/* egy elem ívben repül a helyére (ha már ott van, nem mozdul) */
function kosarRepit(b, p, kes, csendes) {
  var a = b.hely;
  if (a && a[0] === p[0] && a[1] === p[1]) return;
  b.hely = p;
  if (!a || csendes || !b.animate || kosarCsendesE()) { kosarTesz(b, p); return; }
  var tav = Math.abs(a[0] - p[0]) + Math.abs(a[1] - p[1]);
  if (tav < 30) { kosarTesz(b, p); return; }
  var mx = (a[0] + p[0]) / 2, my = Math.min(a[1], p[1]) - (Math.abs(a[0] - p[0]) > 200 ? 90 : 50);
  try {
    b.animate([{ transform: "translate(" + a[0] + "px," + a[1] + "px)" }, { transform: "translate(" + mx + "px," + my + "px)", offset: .5 },
      { transform: "translate(" + p[0] + "px," + p[1] + "px)" }], { duration: 560, delay: kes || 0, easing: "ease-in-out", fill: "backwards" });
  } catch (e) {}
  kosarTesz(b, p);
}
function kosarCsendesE() { return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function kosarIdoStop() { if (KOSAR) { KOSAR.idok.forEach(clearTimeout); KOSAR.idok = []; } }
function kosarKesobb(S, fn, ms) { S.idok.push(setTimeout(function () { if (KOSAR === S) fn(); }, ms)); }
function kosarBillen() { var e = KOSAR && KOSAR.vaszon.querySelector(".ksz-kosar-elo"); if (!e) return; e.classList.remove("ksz-billen"); void e.offsetWidth; e.classList.add("ksz-billen"); }
/* a bagoly szól a kép alatt (beszed: fel is mondja) */
function kosarMond(m, beszed) {
  var v = $("visszajelzes"); if (!v) return;
  v.className = "visszajelzes"; v.textContent = "🦉 " + m;
  if (beszed && typeof mondd === "function") mondd(ekKiejt(m.replace(/^🧺\s*/, "")));
}

/* ═════════════════ a gyerek keze ═════════════════ */
function kosarKatt(ev) {
  var S = KOSAR; if (!S || S.fut || S.alt) return;
  var K = S.K, t = ev.target;
  if (!J || !J.feladat || kosarAllapot(J.feladat) !== K || K.kesz) return;
  if (t.closest(".ksz-kezdjuk")) { kosarKezdjuk(); return; }
  var z = t.closest(".ksz-zacsko");
  if (z) { var ez = K.e.filter(function (e) { return e.id === +z.getAttribute("data-e"); })[0]; if (ez && ez.h === "k") { kosarBont(ez); return; } if (ez) { kosarOnt(ez.h); return; } }
  var g = t.closest(".ksz-golyo");
  if (g) { var eg = K.e.filter(function (e) { return e.id === +g.getAttribute("data-e"); })[0]; if (eg) { if (eg.h === "k") kosarKor(); else kosarOnt(eg.h); } return; }
  var tk = t.closest("[data-k]");
  if (tk) { kosarOnt(+tk.getAttribute("data-k")); return; }
  if (t.closest("[data-kosar]") || t.closest(".ksz-szam")) kosarKor();
}
/* ÖNT: a tálka golyói ívben a kosárba */
function kosarOnt(k) {
  var S = KOSAR, K = S.K, L = kosarItt(K, k);
  if (!L.length || K.kezd === "kosar") return;
  if (K.osztva && !K.szabad && K.mod !== "tek") { kosarMond(KOSAR_M.osztKell); return; }   /* a Mesekönyvben osztás után már nem öntünk vissza */
  hangGomb();
  L.forEach(function (e, j) { e.h = "k"; e.kes = j * 45; });
  if (!K.szabad) S.f.kosarKezi = true;
  kosarBillen(); kosarRajzol();
  if (K.szabad) return;
  if (K.mod !== "tek") kosarMond(kosarTalonVan(K) ? KOSAR_M.ontMeg : (K.szamKi ? KOSAR_M.osztKell : "Minden a kosárban. " + ekSima(S.f.op.letra ? S.f.op.letra.k[S.f.op.letra.most] : S.f.op.kerdes)));
}
/* OSZT: egy kör — mindenki kap egyet (zacskóból, ha van; pénznél a nagyobb érméből, ha jut belőle mindenkinek) */
function kosarKor() {
  var S = KOSAR, K = S.K, n = K.gy.length, bent = kosarItt(K, "k");
  if (!bent.length) { if (!K.szabad && kosarTalonVan(K)) kosarMond(KOSAR_M.ontKell); return; }
  if (K.mod !== "tek" && !K.szabad && kosarTalonVan(K) && !K.osztva) { kosarMond(KOSAR_M.ontMeg); return; }
  if (K.mod !== "tek" && !K.szabad && !K.szamKi && K.kezd !== "kosar") { kosarMond("Előbb mondd meg: hány van a kosárban?"); return; }
  var r = kosarKorLep(K);
  if (r === "zacsko") { S.fenyl = {}; kosarItt(K, "k", "z").forEach(function (e) { S.fenyl[e.id] = 1; }); kosarRajzol(); kosarMond(KOSAR_M.zacskoNem(kosarItt(K, "k", "z").length, n)); return; }
  if (r === "nem") { kosarMond(KOSAR_M.nemJut); return; }
  hangGomb();
  if (!K.szabad) { S.f.kosarKezi = true; K.osztva = true; }
  S.fenyl = null; S.kor = (S.kor || 0) + 1;
  kosarRajzol();
  if (K.szabad) { if (!kosarItt(K, "k").length) kosarMond(KOSAR_M.szabadJo); return; }
  if (!kosarItt(K, "k").length) { kosarMond(K.mod === "tek" ? "Kiosztottad! Most felelj a kérdésre." : "Elfogyott a kosár! " + ekSima(S.f.op.letra ? S.f.op.letra.k[S.f.op.letra.most] : S.f.op.kerdes)); return; }
  kosarMond(KOSAR_M.kor(S.kor));
}
/* egy kör a K-ban (a kirajzolás nélkül): "ok" | "zacsko" (nem jut mindenkinek zacskó) | "nem" (nem jut mindenkinek) */
function kosarKorLep(K, gyors) {
  var n = K.gy.length, zs = kosarItt(K, "k", "z"), k;
  if (zs.length) {
    if (zs.length < n) return "zacsko";
    for (k = 0; k < n; k++) { zs[k].h = k; zs[k].kes = gyors ? 0 : k * 160; }
    return "ok";
  }
  var gs = kosarItt(K, "k", "g"), fajta = {};
  gs.forEach(function (e) { (fajta[e.f || "1"] = fajta[e.f || "1"] || []).push(e); });
  var mit = Object.keys(fajta).filter(function (f) { return fajta[f].length >= n; }).sort(function (a, b) { return +b - +a; })[0];
  if (!mit) return "nem";
  for (k = 0; k < n; k++) {
    var M = kosarItt(K, "k", "g").filter(function (e) { return (e.f || "1") === mit; }), sajat = M.filter(function (e) { return e.c === k; });
    var L = sajat.length ? sajat : M, vit = L.reduce(function (a, e) { return e.s > a.s ? e : a; }, L[0]);   /* a kupac tetejéről */
    vit.h = k; vit.kes = gyors ? 0 : k * 160;
  }
  return "ok";
}
/* BONT: ha nem jut mindenkinek zacskó, a zacskóból 10 golyó lesz a kosárban */
function kosarBont(e) {
  var S = KOSAR, K = S.K;
  if (kosarItt(K, "k", "z").length >= K.gy.length) { kosarMond(KOSAR_M.zacskoMeg); return; }
  hangGomb();
  kosarBontLep(K, e, S.elem[e.id] && S.elem[e.id].hely);
  if (!K.szabad) S.f.kosarKezi = true;
  S.fenyl = {}; kosarItt(K, "k", "z").forEach(function (x) { S.fenyl[x.id] = 1; });
  kosarBillen(); kosarRajzol();
  kosarMond(KOSAR_M.bontva + (kosarItt(K, "k", "z").length ? "" : " " + KOSAR_M.osztKell));
}
function kosarBontLep(K, e, hely) {
  e.h = "x";
  for (var i = 0; i < 10; i++) K.e.push({ id: ++K.uid, t: "g", c: e.c, f: "", h: "k", s: -1, szul: hely ? [hely[0] + 6, hely[1] + 6] : null, kes: i * 30 });
}
/* első találkozás: „Kezdjük!” → a kezdő állapot vissza, és indul a feladat */
function kosarKezdjuk() {
  var S = KOSAR, K = S.K;
  K.e = JSON.parse(JSON.stringify(K.e0)); K.szabad = false; K.osztva = false;
  P().kosarIsmer = true; ment();
  var f = S.f; kosarMutat(f);
  kosarMond((K.kuldEl ? K.kuldEl + " " : "") + KOSAR_M.ontKell, true);
}

/* ═════════════════ a motor felől ═════════════════ */
/* polcZar hívja (ertekel eleje): a Mesekönyvben előbb önt / oszt, aztán felel. true = most nem értékelünk (nem fogy próba) */
function kosarZar(f) {
  var K = kosarAllapot(f);
  if (!K || !K.kezi || f.vezet || f.egAbra || !KOSAR || KOSAR.K !== K) return false;
  if (window.__GEPI_EVAL) { kosarGepi(f, K); return false; }   /* 🤖 gépi próba: a kéz munkáját a játék végzi el (a koppintásokat a böngészős próba nézi) */
  if (K.szabad) { kosarMond(KOSAR_M.szabadZar, true); return true; }
  if (f.polcSzerep === "nagy" || KOSAR.alt) return false;
  var kell = kosarKell(f, K);
  if (!kell) return false;
  kosarMond(kell === "ont" ? (kosarItt(K, "k").length ? KOSAR_M.ontMeg : KOSAR_M.ontKell) : KOSAR_M.osztKell, true);
  kosarUjjRajz();
  return true;
}
function kosarFajta(f, K) { return f.helyes === K.vOssz && K.kezd !== "kosar" && !f.polcVeg && !f.polcKicsiVeg ? "ossz" : "tobbi"; }
function kosarKell(f, K) {
  if (kosarFajta(f, K) === "ossz") return kosarTalonVan(K) ? "ont" : null;
  if (!K.osztva && kosarTalonVan(K) && K.kezd !== "kosar") return "ont";
  return kosarItt(K, "k").length ? "oszt" : null;
}
/* 🤖 gépi próba: amit a feladat kér, azt a játék elvégzi (öntés, osztás, bontás), mozgás nélkül */
function kosarGepi(f, K) {
  var kell = f.polcSzerep === "nagy" ? null : kosarKell(f, K);
  if (kell) { K.osztva = K.osztva || kell === "oszt"; kosarMindOszt(K, kell === "ont" && kosarFajta(f, K) === "ossz"); kosarRajzol(0, true); }
}
/* mindent a kosárba (csakOnt), vagy mindent ki (osztással, bontással) — a K-ban, kirajzolás nélkül */
function kosarMindOszt(K, csakOnt) {
  if (!K.osztva) K.e.forEach(function (e) { if (e.h !== "k" && e.h !== "x") e.h = "k"; });
  if (csakOnt) return;
  K.osztva = true;
  for (var t = 0; t < 200; t++) {
    var r = kosarKorLep(K, true);
    if (r === "zacsko") { kosarBontLep(K, kosarItt(K, "k", "z")[0], null); continue; }
    if (r !== "ok") break;
  }
}

/* ── a jó válasz (polcJo hívja, mielőtt a lánc továbbmegy) ── */
function kosarJo(f) {
  if (f.egAbra) { if (f.polcVeg) segAbraFut(f, true); return; }   /* 🏅 a Mesterpróba ábrája a válaszig (szerszam-egesz-mester.js) */
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  var S = KOSAR;
  kosarAltVege();
  if (f.polcKicsiVeg || f.polcVeg || f.kosarVeg) { kosarVegso(); return; }
  if (kosarFajta(f, K) === "ossz") {
    if (kosarTalonVan(K)) { K.e.forEach(function (e, j) { if (e.h !== "k" && e.h !== "x") { e.h = "k"; e.kes = j * 30; } }); kosarBillen(); }   /* végigvezetés: a kosár önt */
    K.szamKi = true;
  } else if (f.helyes === K.vEgy) {
    if (kosarItt(K, "k").length || !K.osztva) { kosarAutoOszt(); return; }
    K.dbKi = true; kosarAtadott();
  }
  kosarRajzol();
  S.segit = false; kosarUjjRajz();
}
/* akié nem a saját golyója: sárgán lüktet (a nagy kérdés előtt: kié vándorolt át?) */
function kosarAtadott() {
  var S = KOSAR, K = S.K; S.fenyl = {};
  K.e.forEach(function (e) { if (e.t === "g" && e.c >= 0 && typeof e.h === "number" && e.h !== e.c) S.fenyl[e.id] = 1; });
}
/* végigvezetés / a 🎯 vége: a kosár magától önt és oszt, körönként */
function kosarAutoOszt(vegen) {
  var S = KOSAR, K = S.K; S.fut = true;
  var ont = false, v0 = kosarErtek(kosarItt(K, 0));
  var egyenlo = K.gy.every(function (g, k) { return kosarErtek(kosarItt(K, k)) === v0; });   /* már osztott, és eddig egyformán: onnan folytatja */
  K.e.forEach(function (e, j) { if (e.h !== "k" && e.h !== "x" && (!K.osztva || (vegen && !egyenlo))) { e.h = "k"; e.kes = j * 25; ont = true; } });
  K.osztva = true;
  if (ont) { kosarBillen(); kosarRajzol(); }
  var kor = function () {
    var r = kosarKorLep(K);
    if (r === "zacsko") { kosarBontLep(K, kosarItt(K, "k", "z")[0], null); kosarRajzol(); kosarKesobb(S, kor, 320); return; }
    if (r === "ok") { kosarRajzol(); kosarKesobb(S, kor, 320); return; }
    S.fut = false; K.dbKi = true;
    if (vegen) { K.kesz = true; S.fenyl = null; } else kosarAtadott();
    kosarRajzol();
  };
  kosarKesobb(S, kor, ont ? K.e.length * 25 + 500 : 200);
}
/* a 🎯 jó válasza: ha még nem egyforma, a kiosztás ellenőriz (📜 Tekercs: 5. döntés ✅) */
function kosarVegso() {
  var S = KOSAR, K = S.K;
  K.dbKi = true; K.szamKi = true;
  if (kosarEgyforma(K)) { K.kesz = true; S.fenyl = null; kosarRajzol(); return; }
  kosarAutoOszt(true);
}

/* ── rossz válasz: a KÉP felel (6. döntés ✅) — eljátssza a gyerek számát, aztán visszaáll ── */
function kosarRossz(f, v) {
  var K = kosarAllapot(f), S = KOSAR;
  if (!K || !K.kezi || f.vezet || f.egAbra || !S || S.K !== K || S.fut || f.polcSzerep === "nagy") return;
  kosarAltVege();
  var n = K.gy.length, fajta = kosarFajta(f, K), F = {};
  if (fajta === "ossz") { S.fenyl = {}; kosarItt(K, "k").forEach(function (e) { S.fenyl[e.id] = 1; }); kosarRajzol(); S.alt = kosarKesobb(S, kosarAltVege, 2600) || 1; return; }
  if (typeof v !== "number" || v < 0 || v > 60) return;
  var gs = K.e.filter(function (e) { return e.t === "g" && e.h !== "x"; });
  if (gs.some(function (e) { return e.f && e.f !== (K.egyseg || ""); }) || K.e.some(function (e) { return e.t === "z" && e.h !== "x"; })) return;   /* vegyes érmék, zacskók: csak szöveg */
  var egysz = K.egyseg ? 10 : 1, db = Math.round(v / egysz), rossz = {}, ures = [];
  if (f.helyes === K.vEgy && v !== K.vEgy) {                       /* „hány jut egynek?” — mindenki annyit kap, amennyit mondott */
    var marad = gs.slice();
    for (var k = 0; k < n; k++) {
      for (var j = 0; j < db && marad.length; j++) {
        var si = -1; marad.forEach(function (e, x) { if (si < 0 && e.c === k) si = x; });
        F[marad.splice(si >= 0 ? si : 0, 1)[0].id] = [k, j];
      }
      if (j < db) { ures.push([k, j, Math.min(6, db - j)]); rossz[k] = 1; }
    }
    marad.forEach(function (e, x) { F[e.id] = ["k", x]; });
    S.fenyl = {}; marad.forEach(function (e) { S.fenyl[e.id] = 1; });
  } else if ((f.polcVeg || f.polcKicsiVeg) && n === 2 && K.ad && db >= 0) {   /* „hányat ad A B-nek?” — a kép odaadja */
    var g = K.ad.g, r = 1 - g, sajat = gs.filter(function (e) { return e.c === g; }).length, maradA = Math.max(0, sajat - db);
    var cA = 0, cB = 0;
    gs.forEach(function (e) { if (e.c === g && cA < maradA) F[e.id] = [g, cA++]; else F[e.id] = [r, cB++]; });
    rossz[0] = rossz[1] = 1;
  } else return;
  S.altRossz = rossz; S.alt = true;
  kosarRajzol(40, false, F);
  ures.forEach(function (u) { for (var q = 0; q < u[2]; q++) { var p = kosarPont(n, u[0], "g", u[1] + q), s = document.createElement("div"); s.className = "ksz-szellem lat"; s.style.transform = "translate(" + (p[0] - 2) + "px," + (p[1] - 2) + "px)"; S.vaszon.appendChild(s); } });
  kosarKesobb(S, kosarAltVege, 3400);
}
function kosarAltVege() {
  var S = KOSAR; if (!S || !S.alt) return;
  S.alt = null; S.altRossz = null; S.fenyl = null;
  Array.prototype.forEach.call(S.vaszon.querySelectorAll(".ksz-szellem"), function (x) { x.remove(); });
  if (S.K.dbKi && !S.K.kesz) kosarAtadott();
  kosarRajzol(20);
}

/* 🙋 „🧺 Tedd a kosárba!” — a Tekercsben (2. döntés ✅: utána a jó válasz nem önálló): megmutatja, hova koppintson */
function kosarSegit(f) {
  if (f.egAbra) { segAbraSegit(f); return; }               /* 🏅 a Mesterpróba ábrája a „?”-ig */
  var K = kosarAllapot(f); if (!K || !KOSAR || KOSAR.K !== K) return;
  if (f.polcL) f.polcL.seg = Math.max(f.polcL.seg || 0, 2);
  f.kosarSegitVolt = true;
  KOSAR.segit = true; kosarUjjRajz();
  kosarMond(K.kezi ? KOSAR_M.segitKez : KOSAR_M.segit, true);
}

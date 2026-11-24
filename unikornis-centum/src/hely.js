/* ═════════════════ 6j0) 🐴 HELY-KERET: a világkép (Thinking horses) és a közelképek közös modulja ═════════════════
   Terv: terv/vilagkep-rendszerterv.html 1–3. pont (✅ jóváhagyva 2026-11-23), 1. kör. Egy kép = egy hely-tábla (helyek.js).
   • Teljes képernyő, „cover”: a kép kitölti az ablakot, a biztonsági zóna (kep.zona) sosem vágódik le (helyNezet).
     A rajz a széleken túl is ki van festve (kep.kifestve): ahol a zóna miatt a nézet nagyobb a képnél, ott is rajz látszik.
   • Koppintás egy helyre → az unikornis odasétál (útkereső az utak hálóján, patakon csak a hídon), a neve fatáblán
     megjelenik és felolvasódik → ráközelítés a hely téglalapjára (~0,6 mp; nyugalmas mód: áttűnés) → a cél (helyCel).
     Séta közben még egy koppintás a helyre = azonnal ott van. A „←” (közelképben) visszafelé játssza.
   • 🐴 Szabad séta (mint a kertben): járható földre koppint → odasétál; máshová → a legközelebbi járható pontig.
     Hely mellett megállva: a neve kiíródik és felolvasódik. Díszlet: koppintásra él, jutalom nélkül.
   • Nincs szabad nagyítás (két ujj, Ctrl+görgő). Sarok-gombok: bal felső a saját unikornis portréja (koppintás = legelő,
     2 mp nyomva = 👪 Szülőknek) / közelképben „←”; jobb felső erszény ✨💧 + 🔊 hang ki/be.
   • 2. kör: ha a táblának van kep.mappa-ja, a rajz FÁJLOKBÓL jön (helyFajl): rétegek <image>-ként (egyszer rasztereződnek),
     a hely képe az állapota szerint <kep>-epul / -kesz / -viragos (/ -kod), a mozgó réteg (víz, felhők, malom, madarak, fű)
     beágyazva (helyMozgoBetolt), és a leszálló madár mindig a „következő” helyre száll (helyMadar). Tábla kep.mappa nélkül
     (a Kézművesek ideiglenes közelképe): a régi rajz (helyKepRajz, helyHatter) — a 4. körben az is fájl lesz.
     A jelek, az újonc-köd, az ébredés, a 🐉 ugyanaz, mint a régi térképen (terkep.js renderLigetTerkep — a 8. hullámban törlődik). */

var VILAG_M = null;        /* a kirajzolt kép (helyRajzol eredménye) */
var VILAG_KIZOOM = null;   /* visszatérés egy helyről: a kép onnan nagyít ki (terkepNyit állítja) */
var VILAG_UTOLSO = null;   /* { leny, hely, regio }: melyik helyen át ment be utoljára (több hely is vihet ugyanabba a ligetbe) */
var HELY_ZOOM_MS = 600;

/* ── segédek: arány → képpont, sokszög, legközelebbi pont ── */
function helyPx(H, p) { return [p[0] * H.kep.w, p[1] * H.kep.h]; }
function helyKeres(H, id) { for (var i = 0; i < H.helyek.length; i++) if (H.helyek[i].id === id) return H.helyek[i]; return null; }
function helyNevOf(id) { return HELY_NEV[id] || (LIGET_NEV[id] || ["", id])[1]; }
function helyBenne(poli, p) {   /* páros-páratlan szabály */
  var be = false;
  for (var i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    var a = poli[i], b = poli[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) be = !be;
  }
  return be;
}
function helySzakaszPont(a, b, p) {   /* a legközelebbi pont az a–b szakaszon: [pont, t] */
  var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, t = L2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return [[a[0] + dx * t, a[1] + dy * t], t];
}
function helyTav(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

/* ── „cover” nézet: a képernyő (W×Hh képpont) melyik része látszik a képből — a zóna mindig egészen ── */
function helyNezet(H, W, Hh) {
  var iw = H.kep.w, ih = H.kep.h, z = H.kep.zona;
  var s = Math.max(W / iw, Hh / ih);
  s = Math.min(s, W / (z[2] * iw), Hh / (z[3] * ih));
  var vw = W / s, vh = Hh / s;
  var cx = (z[0] + z[2] / 2) * iw, cy = (z[1] + z[3] / 2) * ih;
  var k = H.kep.kifestve || [0, 0, iw, ih];   /* a kifestett tartomány: a nézet ezen belül marad (a zóna kedvéért nagyobb nézet is rajzot lát) */
  s = Math.max(s, W / k[2], Hh / k[3]);
  vw = W / s; vh = Hh / s;
  var x = Math.max(Math.min(cx - vw / 2, k[0] + k[2] - vw), k[0]), y = Math.max(Math.min(cy - vh / 2, k[1] + k[3] - vh), k[1]);
  if (vw > k[2]) x = k[0] + (k[2] - vw) / 2;
  if (vh > k[3]) y = k[1] + (k[3] - vh) / 2;
  return [x, y, vw, vh];
}
/* a hely téglalapja (talppont alul középen), a képernyő arányára bővítve, kis ráhagyással */
function helyCelNezet(M, h) {
  var H = M.H, w = h.w * H.kep.w * 1.25, hh = h.h * H.kep.h * 1.25, cx = h.x * H.kep.w, cy = (h.y - h.h / 2) * H.kep.h;
  var ar = M.nezet[2] / M.nezet[3];
  if (w / hh > ar) hh = w / ar; else w = hh * ar;
  return [cx - w / 2, cy - hh / 2, w, hh];
}
function helyViewBox(M, v) { M.vb = v; M.svg.setAttribute("viewBox", v.map(function (n) { return n.toFixed(1); }).join(" ")); }
/* nagyítás a → b nézetbe (lágy indulás és megállás); halvanyul: a végén elhalványul */
function helyZoom(M, a, b, o, kesz) {
  o = o || {};
  if (nyugiMod() || window.__UC_GYORS) {   /* nyugalmas mód: áttűnés, nagyítás nélkül */
    if (o.halvanyul) M.svg.style.opacity = "0";
    else { helyViewBox(M, b); }
    setTimeout(kesz, window.__UC_GYORS ? 0 : 300);
    return;
  }
  var t0 = performance.now(), tok = M.zoomTok = {};
  if (M.H.kep.mappa && M.svg.clientWidth) {   /* 2. kör: a kép a TÁGABB nézetben rajzolódik ki egyszer, a mozgás alatt csak
       a kész képet nagyítjuk (GPU-transzformáció) — így a firka-szűrő nem fut minden képkockán; a végén élesen újrarajzol */
    var alap = a[2] >= b[2] ? a : b, W = M.svg.clientWidth, k0 = W / alap[2], st = M.svg.style;
    helyViewBox(M, alap); st.transformOrigin = "0 0"; st.willChange = "transform";
    requestAnimationFrame(function lep2(most) {
      if (M.zoomTok !== tok || !M.svg.isConnected) { st.transform = ""; st.willChange = ""; return; }
      var t = Math.min(1, (most - t0) / HELY_ZOOM_MS), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var v = a.map(function (n, i) { return n + (b[i] - n) * e; }), kv = W / v[2];
      st.transform = "translate(" + ((alap[0] - v[0]) * kv).toFixed(1) + "px," + ((alap[1] - v[1]) * kv).toFixed(1) + "px) scale(" + (kv / k0).toFixed(4) + ")";
      if (o.halvanyul) st.opacity = String(t < .6 ? 1 : 1 - (t - .6) / .4);
      if (o.elotunik) st.opacity = String(Math.min(1, .3 + t));
      if (t < 1) { requestAnimationFrame(lep2); return; }
      st.transform = ""; st.willChange = ""; helyViewBox(M, b); kesz();
    });
    return;
  }
  requestAnimationFrame(function lep(most) {
    if (M.zoomTok !== tok || !M.svg.isConnected) return;
    var t = Math.min(1, (most - t0) / HELY_ZOOM_MS), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    helyViewBox(M, a.map(function (n, i) { return n + (b[i] - n) * e; }));
    if (o.halvanyul) M.svg.style.opacity = String(t < .6 ? 1 : 1 - (t - .6) / .4);
    if (o.elotunik) M.svg.style.opacity = String(Math.min(1, .3 + t));
    if (t < 1) requestAnimationFrame(lep); else kesz();
  });
}

/* ── az utak hálója: csomópontok (helyek állóhelye + útkereszteződések) és törött vonalak ── */
function helyHalo(H) {
  var pont = {}, el = [];
  H.helyek.forEach(function (h) { pont[h.id] = helyPx(H, h.all); });
  Object.keys(H.pontok || {}).forEach(function (k) { pont[k] = helyPx(H, H.pontok[k]); });
  (H.utak || []).forEach(function (u) {
    if (!pont[u[0]] || !pont[u[1]]) return;
    var p = [pont[u[0]]].concat((u[2] || []).map(function (q) { return helyPx(H, q); })).concat([pont[u[1]]]), cum = [0];
    for (var i = 1; i < p.length; i++) cum.push(cum[i - 1] + helyTav(p[i - 1], p[i]));
    el.push({ a: u[0], b: u[1], p: p, cum: cum, L: cum[cum.length - 1] });
  });
  return { pont: pont, el: el };
}
function helyHaloraVetit(N, p) {   /* a legközelebbi pont a hálón: { e, s (távolság az él elejétől), pt, d } */
  var leg = null;
  N.el.forEach(function (e) {
    for (var i = 1; i < e.p.length; i++) {
      var r = helySzakaszPont(e.p[i - 1], e.p[i], p), d = helyTav(r[0], p);
      if (!leg || d < leg.d) leg = { e: e, s: e.cum[i - 1] + r[1] * (e.cum[i] - e.cum[i - 1]), pt: r[0], d: d };
    }
  });
  return leg;
}
function helyElDarab(e, s1, s2) {   /* az él pontjai s1 → s2 (visszafelé is) */
  var p = [helyElPont(e, s1)], i;
  if (s1 < s2) { for (i = 0; i < e.p.length; i++) if (e.cum[i] > s1 && e.cum[i] < s2) p.push(e.p[i]); }
  else { for (i = e.p.length - 1; i >= 0; i--) if (e.cum[i] < s1 && e.cum[i] > s2) p.push(e.p[i]); }
  p.push(helyElPont(e, s2));
  return p;
}
function helyElPont(e, s) {
  for (var i = 1; i < e.p.length; i++) if (s <= e.cum[i] || i === e.p.length - 1) {
    var r = e.cum[i] > e.cum[i - 1] ? (s - e.cum[i - 1]) / (e.cum[i] - e.cum[i - 1]) : 0;
    r = Math.max(0, Math.min(1, r));
    return [e.p[i - 1][0] + (e.p[i][0] - e.p[i - 1][0]) * r, e.p[i - 1][1] + (e.p[i][1] - e.p[i - 1][1]) * r];
  }
  return e.p[0];
}
function helyDijkstra(N, honnan, hova) {   /* csomópont → csomópont: [csomópontok], hossz */
  var tav = {}, elozo = {}, nyitott = Object.keys(N.pont);
  nyitott.forEach(function (k) { tav[k] = Infinity; }); tav[honnan] = 0;
  while (nyitott.length) {
    nyitott.sort(function (a, b) { return tav[a] - tav[b]; });
    var u = nyitott.shift(); if (u === hova || tav[u] === Infinity) break;
    N.el.forEach(function (e) {
      var v = e.a === u ? e.b : e.b === u ? e.a : null; if (!v) return;
      if (tav[u] + e.L < tav[v]) { tav[v] = tav[u] + e.L; elozo[v] = { n: u, e: e }; }
    });
  }
  if (tav[hova] === Infinity) return null;
  var ut = []; for (var k = hova; k !== honnan; k = elozo[k].n) ut.unshift(elozo[k]);
  return { ut: ut, hossz: tav[hova] };
}
/* melyik járható sokszögben van (−1: egyikben sem) */
function helyFold(M, p) {
  var H = M.H, q = [p[0] / H.kep.w, p[1] / H.kep.h];
  for (var i = 0; i < (H.jarhato || []).length; i++) if (helyBenne(H.jarhato[i], q)) return i;
  return -1;
}
/* nem járható pont → a legközelebbi járható pont (kicsit beljebb) */
function helyJarhatoPont(M, p) {
  if (helyFold(M, p) >= 0 || !(M.H.jarhato || []).length) return p;
  var H = M.H, leg = null, sajat = helyFold(M, M.pos);   /* a saját partja előnyben (a patakba koppintva ne menjen át a túlsóra) */
  H.jarhato.forEach(function (poli, pi) {
    var pp = poli.map(function (q) { return helyPx(H, q); }), kx = 0, ky = 0;
    pp.forEach(function (q) { kx += q[0] / pp.length; ky += q[1] / pp.length; });
    for (var i = 0; i < pp.length; i++) {
      var r = helySzakaszPont(pp[i], pp[(i + 1) % pp.length], p), d = helyTav(r[0], p) * (pi === sajat ? .6 : 1);
      if (!leg || d < leg.d) leg = { d: d, pt: r[0], k: [kx, ky] };
    }
  });
  var dx = leg.k[0] - leg.pt[0], dy = leg.k[1] - leg.pt[1], L = Math.hypot(dx, dy) || 1;
  return [leg.pt[0] + dx / L * 8, leg.pt[1] + dy / L * 8];
}
/* átvág-e a patakon a p → q egyenes (a hídnál szabad) */
function helyPatakonAt(M, p, q) {
  var H = M.H; if (!H.patak) return false;
  var pp = M.patakPx || (M.patakPx = H.patak.map(function (t) { return helyPx(H, t); })), hid = H.pontok && H.pontok.hid && helyPx(H, H.pontok.hid);
  for (var k = 0; k <= 16; k++) {
    var t = [p[0] + (q[0] - p[0]) * k / 16, p[1] + (q[1] - p[1]) * k / 16];
    if (hid && helyTav(t, hid) < 44) continue;
    for (var i = 1; i < pp.length; i++) if (helyTav(helySzakaszPont(pp[i - 1], pp[i], t)[0], t) < 20) return true;
  }
  return false;
}
/* a háló közeli pontjai p-hez, ahová egyenesen (patakon át nem) el lehet jutni: [{ e, s, pt, d }] */
function helyBelepok(M, p) {
  var ki = [];
  M.N.el.forEach(function (e) {
    var leg = null;
    for (var i = 1; i < e.p.length; i++) {
      var r = helySzakaszPont(e.p[i - 1], e.p[i], p), d = helyTav(r[0], p);
      if (!leg || d < leg.d) leg = { e: e, s: e.cum[i - 1] + r[1] * (e.cum[i] - e.cum[i - 1]), pt: r[0], d: d };
    }
    if (leg && (leg.d < 6 || !helyPatakonAt(M, p, leg.pt))) ki.push(leg);
  });
  return ki.sort(function (a, b) { return a.d - b.d; }).slice(0, 5);
}
/* útvonal p → q: ugyanazon a földdarabon egyenesen (ha nem vág át a patakon), különben az utak hálóján át —
   a legrövidebb (be- és kilépés a háló bármelyik közeli pontján) */
function helyUtvonal(M, p, q) {
  var f = helyFold(M, p);
  if (f >= 0 && f === helyFold(M, q) && !helyPatakonAt(M, p, q)) {
    var jo = true;
    for (var k = 1; k < 12 && jo; k++) if (helyFold(M, [p[0] + (q[0] - p[0]) * k / 12, p[1] + (q[1] - p[1]) * k / 12]) !== f) jo = false;
    if (jo) return [p, q];
  }
  var N = M.N, As = helyBelepok(M, p), Bs = helyBelepok(M, q), cache = {}, leg = null;
  function dij(a, b) { var k = a + ">" + b; if (!(k in cache)) cache[k] = helyDijkstra(N, a, b); return cache[k]; }
  As.forEach(function (A) {
    Bs.forEach(function (B) {
      if (A.e === B.e) { var h0 = A.d + Math.abs(A.s - B.s) + B.d; if (!leg || h0 < leg.h) leg = { h: h0, A: A, B: B }; return; }
      [[A.e.a, 0], [A.e.b, A.e.L]].forEach(function (ka) {
        [[B.e.a, 0], [B.e.b, B.e.L]].forEach(function (kb) {
          var d = dij(ka[0], kb[0]); if (!d) return;
          var h = A.d + Math.abs(A.s - ka[1]) + d.hossz + Math.abs(B.s - kb[1]) + B.d;
          if (!leg || h < leg.h) leg = { h: h, A: A, B: B, ka: ka, kb: kb, d: d };
        });
      });
    });
  });
  if (!leg) return [p, q];
  var pts;
  if (!leg.d) pts = helyElDarab(leg.A.e, leg.A.s, leg.B.s);
  else {
    pts = helyElDarab(leg.A.e, leg.A.s, leg.ka[1]);
    leg.d.ut.forEach(function (lp) {
      var e = lp.e, elore = e.a === lp.n;
      pts = pts.concat(helyElDarab(e, elore ? 0 : e.L, elore ? e.L : 0).slice(1));
    });
    pts = pts.concat(helyElDarab(leg.B.e, leg.kb[1], leg.B.s).slice(1));
  }
  var ki = [p].concat(pts).concat([q]), tiszta = [ki[0]];
  ki.forEach(function (t) { if (helyTav(t, tiszta[tiszta.length - 1]) > 4) tiszta.push(t); });
  if (tiszta.length < 2) tiszta.push(q);
  return tiszta;
}

/* ── az unikornis a képen ── */
function helyUniAllit(M, x, y) { M.pos = [x, y]; M.uni.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")"); }
function helyEgyseg(M) { var m = M.svg.getScreenCTM && M.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; }
function helyAllOldal(h) { return h.all[0] >= h.x ? 1 : -1; }   /* melyik oldalán áll a háznak (+1 jobbra) — felé fordul */
/* SÉTA egy pontra; kesz() a végén. Új séta közben: az előző csendben abbamarad. */
function helySetalPont(M, q, o, kesz) {
  o = o || {};
  var en = M.fut = { hely: o.hely || null, kesz: kesz };
  var pts = helyUtvonal(M, M.pos, q);
  function vege() {
    if (M.fut !== en) return;
    M.fut = null; helyUniAllit(M, q[0], q[1]);
    if (o.hely) { M.all = o.hely.id; uniFordul(M.el, -helyAllOldal(o.hely), function () { if (kesz) kesz(); }); }
    else { M.all = null; if (kesz) kesz(); }
  }
  if (nyugiMod() || helyTav(M.pos, q) < 6) { helyUniAllit(M, q[0], q[1]); vege(); return; }
  var g = pts.length > 2 ? uniGorbePontok(uniSimaGorbe(pts)) : pts;
  uniUtvonal({ el: M.el, allit: function (x, y) { helyUniAllit(M, x, y); }, egyseg: function () { return helyEgyseg(M); } },
    g, { ido: 2.4 }, vege);
}
/* SÉTA egy helyhez (a régi terkepSetal megfelelője): séta közben újra hívva = azonnal a mostani célnál áll, és kész */
function helySetal(M, id, kesz) {
  if (M.fut && M.fut.hely) {
    var f = M.fut, h0 = f.hely; M.fut = null; uniUtvonalAll(M.el);
    var p0 = helyPx(M.H, h0.all); helyUniAllit(M, p0[0], p0[1]); M.all = h0.id; uniFordul(M.el, -helyAllOldal(h0));
    if (f.kesz) f.kesz(); return;
  }
  var h = helyKeres(M.H, id); if (!h) return;
  helySetalPont(M, helyPx(M.H, h.all), { hely: h }, kesz);
}

/* ── a fatábla a képernyő tetején (a hely neve) ── */
function helyNevTabla(M, nev, marad) {   /* marad: amíg az egér a helyen áll, nem tűnik el (helyNevEger) */
  var t = M.host.querySelector(".hely-nevtabla"); if (!t) return;
  if (!(marad && t.textContent === nev && t.classList.contains("lat"))) { t.textContent = nev; t.classList.remove("lat"); void t.offsetWidth; t.classList.add("lat"); }
  clearTimeout(M.tablaT); if (!marad) M.tablaT = setTimeout(function () { t.classList.remove("lat"); }, 2600);
}
/* 🖱️ egérrel egy hely fölé állva a neve kiíródik (felolvasás nélkül), és ott marad, amíg az egér ott van — a producer kérése (11-24) */
function helyNevEger(M) {
  var most = null;
  M.svg.addEventListener("pointerover", function (e) {
    if (e.pointerType !== "mouse") return;
    var g = e.target.closest && e.target.closest(".terkep-hely"); if (!g || g === most) return;
    most = g; helyNevTabla(M, helyNevOf(g.getAttribute("data-id")), true);
  });
  M.svg.addEventListener("pointerout", function (e) {
    if (e.pointerType !== "mouse" || !most) return;
    var ide = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".terkep-hely");
    if (ide === most) return;
    most = null; clearTimeout(M.tablaT);
    M.tablaT = setTimeout(function () { var t = M.host.querySelector(".hely-nevtabla"); if (t) t.classList.remove("lat"); }, 600);
  });
}

/* ── RAJZ ── */
function helyKepRajz(kep) {   /* a hely rajza (1. kör: a mai jelkép; talppont 0,0, felfelé) */
  if (Array.isArray(kep)) return kep.map(function (k, i) { return '<g transform="translate(' + ((i - (kep.length - 1) / 2) * 52) + ' ' + (i === 1 ? -6 : 0) + ') scale(.66)">' + helyKepRajz(k) + '</g>'; }).join("");
  if (HELY_KEP_IDEIGLENES[kep]) return HELY_KEP_IDEIGLENES[kep]();
  return LT_JELKEP[kep] ? LT_JELKEP[kep]() : "";
}
var HELY_KEP_IDEIGLENES = {   /* a két új hely, amelynek ma nincs saját jelképe (a 2. körben mind fájl lesz) */
  osszeadoUtca: function () {
    return ltArnyek(46) + [[-26, "url(#lt-gTetoT)", "#3f8a85", .9], [4, "url(#lt-gTetoM)", "#c9862a", 1], [30, "url(#lt-gTetoR)", "#b5607e", .8]].map(function (h) {
      return '<g transform="translate(' + h[0] + ' 0) scale(' + h[3] + ')">' + ltFalHaz(h[1], "M-33 -32Q-14 -58 0 -66Q14 -58 33 -33Q0 -38 -33 -32Z", h[2]) + '</g>';
    }).join("");
  },
  csucs: function () {
    return ltArnyek(46) + '<path d="M-50 2Q-30 -40 -4 -96Q14 -60 22 -48Q30 -56 50 2Q0 6 -50 2Z" fill="#cfd8e8" stroke="#6f7fa8" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M-18 -66Q-10 -84 -4 -96Q4 -82 10 -70Q5 -64 1 -70Q-5 -62 -10 -70Q-14 -64 -18 -66Z" fill="#fff" stroke="#c9d3e6" stroke-width="1.2"/>' +
      '<path d="M-30 2L-30 -14L-22 -20L-14 -14V2Z" fill="#8fbf8a" stroke="#4f7f5a" stroke-width="1.4"/><path d="M16 2V-22L24 -30L32 -22V2Z" fill="#6fa77a" stroke="#4f7f5a" stroke-width="1.4"/>' +
      '<circle cx="-4" cy="-100" r="4" fill="#ffb347"><animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite"/></circle>';
  }
};
var HELY_MAGAS = 92;   /* a jelképek átlagos magassága (saját egységben) — a köd és a fénykör méretéhez */
function helyJelRajz(j, x, y, k) {   /* ⭐ kész/összes, legfeljebb 2 jelvény, alvó hold — a hely tetején */
  if (!j || j.ny === "alszik") return "";
  var s = "", ikonok = (j.jelzes || []).slice(0, 2), sz = (j.ossz ? 50 : 0) + ikonok.length * 28, bx = -sz / 2;
  s += '<g class="hely-jel" pointer-events="none" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + k + ')">';
  if (j.ossz) {
    var tele = j.kesz >= j.ossz;
    s += '<rect x="' + bx + '" y="-11" width="46" height="22" rx="11" fill="' + (tele ? "#fff1b8" : "#ffffff") + '" stroke="' + (tele ? "#e3a92a" : "#3f9e6a") + '" stroke-width="1.6"/>' +
         '<text x="' + (bx + 23) + '" y="4.5" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (tele ? "#b07a10" : "#3f9e6a") + '">' + (tele ? "🌟" : "⭐") + ' ' + j.kesz + '/' + j.ossz + '</text>';
    bx += 50;
  }
  ikonok.forEach(function (ik) {
    s += '<g transform="translate(' + (bx + 12) + ' 0)"><circle r="12" fill="#fff" stroke="' + (ik === "💧" ? "#29a3dd" : ik === "🏦" ? "#b07a10" : ik === "🦋" ? "#8a6fc0" : "#e0417a") + '" stroke-width="2"/>' +
         '<text y="4.5" text-anchor="middle" font-size="13">' + ik + '</text>' + ltAnim("opacity", "1;.75;1", "2.2s") + '</g>';
    bx += 28;
  });
  if (j.alszik) s += '<g transform="translate(' + (bx + 12) + ' 0)"><path d="M-8 -10A11 11 0 1 0 4 8A8 8 0 1 1 -8 -10Z" fill="#fff1b8" stroke="#b07a10" stroke-width="1.4"/>' +
                     '<text x="10" y="-6" font-size="11" font-weight="700" fill="#6b6280">z' + ltAnim("opacity", "0;1;0", "2.4s") + '</text></g>';
  return s + '</g>';
}
/* ── 2. kör: a rajz fájlokból (kepek/vilag/…) ── */
function helyKifestve(H) {   /* a rétegfájlok helye arányban: [0,0,1,1], ha a rajz nincs kifestve */
  var k = H.kep.kifestve; return k ? [k[0] / H.kep.w, k[1] / H.kep.h, k[2] / H.kep.w, k[3] / H.kep.h] : [0, 0, 1, 1];
}
function helyFajl(H, nev) { return H.kep.mappa + nev + ".svg" + (H.kep.v ? "?v=" + H.kep.v : ""); }
function helyKepElem(H, nev, d, osztaly) {   /* d = [x, y, w, h] arányban → <image> a kép egységében; nem koppintható (a téglalap az) */
  return '<image' + (osztaly ? ' class="' + osztaly + '"' : '') + ' href="' + helyFajl(H, nev) + '" x="' + (d[0] * H.kep.w).toFixed(1) + '" y="' + (d[1] * H.kep.h).toFixed(1) +
         '" width="' + (d[2] * H.kep.w).toFixed(1) + '" height="' + (d[3] * H.kep.h).toFixed(1) + '" preserveAspectRatio="none" pointer-events="none"/>';
}
/* a hely képének állapota: köd (Felvételi) · épül (alszik / rejtett) · virágos (minden pálya csillagos) · kész */
function helyKepAllapot(h, j, rejt) {
  if (h.cel.kod) return "kod";
  if (rejt || (j && j.ny === "alszik")) return "epul";
  if (j && j.ossz && j.kesz >= j.ossz) return "viragos";
  return "kesz";
}
var HELY_MOZGO = {};   /* fájl → a betöltött mozgó réteg (Document), hogy ne töltse le minden rajzoláskor */
function helyMozgoBetolt(M) {
  var H = M.H, u = helyFajl(H, H.mozgo);
  function beepit(doc) {
    if (!M.svg.isConnected || !doc) return;
    var defs = doc.querySelector("defs"), also = doc.getElementById("vm-also"), felso = doc.getElementById("vm-felso");
    var d0 = M.svg.querySelector("defs");
    if (defs && d0) Array.prototype.forEach.call(defs.childNodes, function (n) { d0.appendChild(document.importNode(n, true)); });
    var a = M.svg.querySelector(".hely-mozgo-also"), f = M.svg.querySelector(".hely-mozgo-felso");
    if (also && a) a.appendChild(document.importNode(also, true));
    if (felso && f) f.appendChild(document.importNode(felso, true));
    helyMadar(M);
    if (nyugiMod() && M.svg.pauseAnimations) M.svg.pauseAnimations();
  }
  if (HELY_MOZGO[u]) { beepit(HELY_MOZGO[u]); return; }
  fetch(u).then(function (v) { return v.ok ? v.text() : ""; }).then(function (s) {
    if (!s) return;
    var doc = new DOMParser().parseFromString(s, "image/svg+xml");
    if (doc.querySelector("parsererror")) return;
    HELY_MOZGO[u] = doc; beepit(doc);
  }).catch(function () {});   /* net nélkül, tárban sincs: a táj mozgás nélkül is teljes */
}
/* 🐦 a leszálló madár: a „következő” hely (az újonc-fény helye) jel-horgonya mellé száll, megpihen, szökken, továbbrepül.
   (Döntés 2026-11-23, A.) Ha nincs újonc-fény: a tér (ott fut össze minden ösvény). A rajza a mozgó réteg vm-madar / vm-ulo jele. */
function helyMadar(M) {
  var H = M.H, cel = null, f = M.svg.querySelector(".hely-mozgo-felso");
  if (!f || !M.svg.querySelector("#vm-ulo")) return;
  H.helyek.forEach(function (h) { var j = M.jel[h.id]; if (!cel && j && j.ny === "vil" && M.halo.lathato[h.id]) cel = h; });
  if (!cel) cel = helyKeres(H, "ter");
  if (!cel) return;
  var j = M.jel[cel.id] || {}, k = H.jk * .9, sz = (j.ossz ? 50 : 0) + Math.min((j.jelzes || []).length, 2) * 28 + (j.alszik ? 28 : 0);
  var tx = cel.jel[0] * H.kep.w + (sz ? sz / 2 - 12 : 0) * k, ty = cel.jel[1] * H.kep.h - (sz ? 11 * k + 1 : 0);   /* a jelvény tetején ül (jelvény nélkül: a tetőn) */
  var be = "M-40,260 C300,170 " + (tx - 190).toFixed(0) + "," + (ty - 140).toFixed(0) + " " + tx.toFixed(0) + "," + ty.toFixed(0);
  var ki = "M" + tx.toFixed(0) + "," + ty.toFixed(0) + " C" + (tx + 107).toFixed(0) + "," + (ty - 104).toFixed(0) + " 1300,380 1720,300";
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "hely-madar"); g.setAttribute("data-hely", cel.id);
  g.innerHTML =
    '<g stroke="#6a5f8a" stroke-width="1.8" fill="none" stroke-linecap="round"><g><use href="#vm-madar"/>' +
      '<animateMotion path="' + be + '" keyPoints="0;1;1" keyTimes="0;.35;1" calcMode="linear" dur="50s" repeatCount="indefinite"/>' +
      '<animate attributeName="opacity" values="1;0" keyTimes="0;.35" calcMode="discrete" dur="50s" repeatCount="indefinite"/></g>' +
    '<g opacity="0"><use href="#vm-madar"/>' +
      '<animateMotion path="' + ki + '" keyPoints="0;0;1" keyTimes="0;.7;1" calcMode="linear" dur="50s" repeatCount="indefinite"/>' +
      '<animate attributeName="opacity" values="0;1" keyTimes="0;.7" calcMode="discrete" dur="50s" repeatCount="indefinite"/></g></g>' +
    '<g opacity="0" transform="translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')"><g><use href="#vm-ulo"/>' +
      '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;3,-3;0,0;0,0" keyTimes="0;.5;.52;.54;1" dur="50s" repeatCount="indefinite"/></g>' +
      '<animate attributeName="opacity" values="0;1;0" keyTimes="0;.35;.7" calcMode="discrete" dur="50s" repeatCount="indefinite"/></g>';
  f.appendChild(g);
}
/* az ideiglenes háttér (tábla kep.mappa nélkül: a Kézművesek közelképe a 4. körig) */
function helyHatter(M) {
  var H = M.H, w = H.kep.w, h = H.kep.h, s = "", i;
  var patak = function (pp) { return uniGorbePontok(uniSimaGorbe(pp.map(function (q) { return helyPx(H, q); }))).map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(""); };
  s += '<rect x="' + (-w) + '" y="' + (-h) + '" width="' + (3 * w) + '" height="' + (h * 1.3) + '" fill="#cfe6f7"/>';
  s += '<rect x="' + (-w) + '" y="' + (h * .3) + '" width="' + (3 * w) + '" height="' + (h * 1.7) + '" fill="#b9e0aa"/>';
  s += '<rect x="0" y="0" width="' + w + '" height="' + (h * .5) + '" fill="url(#lt-gEgA)"/>';
  if (H.kep.hatter === "vilag") {
    s += '<circle cx="' + (w * .12) + '" cy="' + (h * .14) + '" r="70" fill="url(#lt-gNap)"/><circle cx="' + (w * .12) + '" cy="' + (h * .14) + '" r="28" fill="#fff4c2"/>';
    s += '<path d="M' + (w * .45) + ' ' + (h * .5) + 'L' + (w * .62) + ' ' + (h * .2) + 'L' + (w * .70) + ' ' + (h * .28) + 'L' + (w * .80) + ' ' + (h * .08) + 'L' + (w * .90) + ' ' + (h * .18) + 'L' + (w * .96) + ' ' + (h * .06) + 'L' + (w * 1.1) + ' ' + (h * .3) + 'V' + (h * .6) + 'Z" fill="#d9cbef" stroke="#b7a6d8" stroke-width="2"/>';
    s += '<path d="M' + (w * .78) + ' ' + (h * .11) + 'L' + (w * .80) + ' ' + (h * .08) + 'L' + (w * .82) + ' ' + (h * .11) + 'Z M' + (w * .94) + ' ' + (h * .09) + 'L' + (w * .96) + ' ' + (h * .06) + 'L' + (w * .98) + ' ' + (h * .09) + 'Z" fill="#fff"/>';
    s += '<path d="M' + (-w * .1) + ' ' + (h * .62) + 'Q' + (w * .15) + ' ' + (h * .40) + ' ' + (w * .35) + ' ' + (h * .50) + 'Q' + (w * .45) + ' ' + (h * .36) + ' ' + (w * .62) + ' ' + (h * .40) + 'Q' + (w * .80) + ' ' + (h * .48) + ' ' + (w * 1.1) + ' ' + (h * .55) + 'V' + (h * 2) + 'H' + (-w * .1) + 'Z" fill="#d8eec8"/>';
    s += '<path d="M' + (-w * .1) + ' ' + (h * .74) + 'Q' + (w * .3) + ' ' + (h * .60) + ' ' + (w * .6) + ' ' + (h * .66) + 'T' + (w * 1.1) + ' ' + (h * .64) + 'V' + (h * 2) + 'H' + (-w * .1) + 'Z" fill="url(#lt-gRetA)"/>';
    s += '<path d="' + patak(H.patak) + '" fill="none" stroke="#7fb8d8" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<path d="' + patak(H.patak) + '" fill="none" stroke="#a9d6ef" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<path d="' + patak(H.patak) + '" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="10 40" opacity=".8">' + ltAnim("stroke-dashoffset", "0;-50", "2.4s") + '</path>';
    var r = ltVeletlen(11);
    for (i = 0; i < 40; i++) {   /* fák, bokrok — nem a helyekre, nem az útra */
      var x = (0.03 + r() * .94) * w, y = (0.42 + r() * .55) * h, sz = 1.4 + r() * .8;
      if (H.helyek.some(function (hh) { return Math.abs(x - hh.x * w) < hh.w * w * .75 && y > (hh.y - hh.h) * h - 20 && y < hh.y * h + 30; })) continue;
      if (helyHaloraVetit(M.N, [x, y]).d < 28) continue;
      s += r() < .5 ? ltBokor(x, y, sz, "#a8dc9c", "#6fae74") : ltKisfa(x, y, sz, "#9fd49a", "#6fae74");
    }
  } else {   /* közelkép: rét, a háttérben domb és malom */
    s += '<path d="M' + (-w * .1) + ' ' + (h * .66) + 'Q' + (w * .5) + ' ' + (h * .5) + ' ' + (w * 1.1) + ' ' + (h * .64) + 'V' + (h * 2) + 'H' + (-w * .1) + 'Z" fill="url(#lt-gRetA)"/>';
    s += '<g transform="translate(' + (w * .06) + ' ' + (h * .62) + ')"><circle r="60" fill="none" stroke="#9a6f52" stroke-width="8"/>' +
         '<g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="14s" repeatCount="indefinite"/>' +
         [0, 1, 2, 3, 4, 5].map(function (k) { return '<path d="M0 0L' + (Math.cos(k * Math.PI / 3) * 60).toFixed(1) + ' ' + (Math.sin(k * Math.PI / 3) * 60).toFixed(1) + '" stroke="#9a6f52" stroke-width="6"/>'; }).join("") + '</g></g>';
  }
  return s;
}
function helyUtakRajz(M) {
  var d = M.N.el.map(function (e) { var g = e.p.length > 2 ? uniGorbePontok(uniSimaGorbe(e.p)) : e.p; return g.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(""); }).join("");
  return '<path d="' + d + '" fill="none" stroke="#d9bf94" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>' +
         '<path d="' + d + '" fill="none" stroke="#f5e6c6" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>';
}
function helyDiszletRajz(M, elol) {
  var H = M.H, w = H.kep.w, h = H.kep.h, fajl = !!H.kep.mappa;
  return (H.diszlet || []).filter(function (d) { return !fajl || !d.elol === !elol; }).map(function (d) {
    var x = d.x * w, y = d.y * h, b = '';
    if (fajl) {   /* a rajz a rétegekben / saját fájlban van; itt csak a felirat (betű) és a mozduló rész */
      if (d.kep) b = '<g transform="translate(' + (-x).toFixed(1) + ' ' + (-y).toFixed(1) + ')">' + helyKepElem(H, d.kep, d.doboz) + '</g>';
      if (d.felirat) b = '<text x="' + d.felirat[0] + '" y="' + d.felirat[1] + '" text-anchor="middle" font-size="12.5" fill="#5a4a7a" font-family="Fredoka,sans-serif" pointer-events="none">' + htmlVed(VILAG_NEV) + '</text>';
      if (d.mozdul === "rebben") b = '<g class="hely-madarak">' + [[-30, -10], [0, -24], [26, -6]].map(function (q) { return '<path d="M' + (q[0] - 8) + ' ' + q[1] + 'q4 -5 8 0q4 -5 8 0" fill="none" stroke="#6a5f8a" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>'; }).join("") + '</g>';
    }
    else if (d.id === "tabla") b = '<path d="M0 0V-60" stroke="#8a6a52" stroke-width="6"/><rect x="-74" y="-104" width="148" height="46" rx="8" fill="#e8cfa4" stroke="#8a6a52" stroke-width="4"/>' +
                              '<text y="-74" text-anchor="middle" font-size="20" font-weight="700" fill="#6e4a36" font-family="Fredoka,sans-serif">' + htmlVed(VILAG_NEV) + '</text>';
    else if (d.id === "hid") b = '<path d="M-44 -6Q0 -26 44 -6" fill="none" stroke="#9a6f52" stroke-width="12" stroke-linecap="round"/><path d="M-44 -6Q0 -26 44 -6" fill="none" stroke="#c99a6a" stroke-width="7" stroke-linecap="round"/>' +
                             '<path d="M-36 -10V-26M0 -16V-34M36 -10V-26M-36 -26Q0 -44 36 -26" fill="none" stroke="#8a6a52" stroke-width="3"/>';
    else if (d.id === "madarak") b = '<g class="hely-madarak">' + [[-30, -10], [0, -24], [26, -6]].map(function (q) { return '<path d="M' + (q[0] - 9) + ' ' + q[1] + 'q5 -6 9 0q4 -6 9 0" fill="none" stroke="#6b6280" stroke-width="2.4" stroke-linecap="round"/>'; }).join("") + '</g>';
    return '<g class="hely-diszlet" data-id="' + d.id + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')">' +
           '<rect x="' + (-d.w * w / 2).toFixed(1) + '" y="' + (-d.h * h).toFixed(1) + '" width="' + (d.w * w).toFixed(1) + '" height="' + (d.h * h).toFixed(1) + '" fill="transparent"/>' + b + '</g>';
  }).join("");
}
/* o = { tabla (HELYEK kulcsa), jel: {id: {kesz, ossz, alszik, jelzes, ny}}, lathato: {id: true}, all: hely-id | null, pont: [x,y] arány, koppint(id) } */
function helyRajzol(host, o) {
  var H = HELYEK[o.tabla], w = H.kep.w, h = H.kep.h, k = H.jk, fajl = !!H.kep.mappa;
  host.innerHTML = "";
  host.classList.add("hely-host");
  var M = { H: H, tabla: o.tabla, host: host, jel: o.jel || {}, halo: { lathato: o.lathato || {} }, fut: null, all: null, vilag: true };
  M.N = helyHalo(H);
  var sor = H.helyek.slice().sort(function (a, b) { return a.y - b.y; });
  var helyek = sor.map(function (hh) {
    var j = M.jel[hh.id] || {}, rejt = !M.halo.lathato[hh.id], px = hh.x * w, py = hh.y * h;
    var bw = hh.w * w / k, bh = hh.h * h / k, kod = j.ny === "alszik" || rejt;
    var fej = '<g class="terkep-hely' + (j.alszik ? " alszik" : "") + (kod ? " ny-kod" : "") + (rejt ? " rejtett" : "") + '" data-id="' + hh.id + '" role="button" tabindex="0" aria-label="' + htmlVed(helyNevOf(hh.id)) + '">';
    if (fajl) {   /* 2. kör: a hely képe fájlból, az állapota szerint; a koppintható téglalap a táblából */
      var all = helyKepAllapot(hh, j, rejt);
      return fej + '<rect x="' + (px - hh.w * w / 2).toFixed(1) + '" y="' + (py - hh.h * h).toFixed(1) + '" width="' + (hh.w * w).toFixed(1) + '" height="' + (hh.h * h + 12).toFixed(1) + '" fill="transparent"/>' +
        (j.ny === "vil" ? '<g transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') scale(' + k + ')">' + ltNyHalo(HELY_MAGAS) + '</g>' : "") +
        '<g class="hb' + (j.ny === "vil" ? " ny-vilagit" : "") + '" data-all="' + all + '">' + helyKepElem(H, hh.kep + "-" + all, hh.doboz) + '</g>' +
        (kod && all !== "kod" ? '<g transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') scale(' + k + ')">' + ltNyKod(HELY_MAGAS) + '</g>' : "") + '</g>';
    }
    return fej +
      '<g transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') scale(' + k + ')">' +
      '<rect x="' + (-bw / 2).toFixed(1) + '" y="' + (-bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (bh + 10).toFixed(1) + '" fill="transparent"/>' +
      (j.ny === "vil" ? ltNyHalo(HELY_MAGAS) : "") +
      '<g class="hb' + (j.ny === "vil" ? " ny-vilagit" : "") + '">' + helyKepRajz(hh.kep) + '</g>' + (kod ? ltNyKod(HELY_MAGAS) : "") + '</g></g>';
  }).join("");
  var jelek = sor.map(function (hh) { return helyJelRajz(M.jel[hh.id], hh.jel[0] * w, hh.jel[1] * h, k * .9); }).join("");
  host.innerHTML =
    '<svg class="hely-svg" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + LT_DEFS +
      (fajl
        ? '<g class="hely-fold">' + H.retegek.map(function (r) { return helyKepElem(H, r, helyKifestve(H), "hely-reteg"); }).join("") + '</g><g class="hely-mozgo-also"></g>'
        : '<g class="hely-fold">' + helyHatter(M) + '<g filter="url(#lt-firka)">' + helyUtakRajz(M) + '</g></g>') +
      helyDiszletRajz(M) + helyek + (fajl ? '<g class="hely-mozgo-felso"></g>' : jelek) +
      '<g class="terkep-uni" pointer-events="none"><g class="terkep-uni-irany" style="--dir:1;transform:scale(var(--dir,1),1)">' +
        unikornisSVG("hl-uni", LENYEK[mentes.leny], H.uni, P().oltozet) + '</g></g>' +
      (fajl ? (H.eloter ? helyKepElem(H, H.eloter, helyKifestve(H), "hely-reteg") : "") + helyDiszletRajz(M, true) + jelek : '') +
    '</svg>' +
    '<div class="hely-nevtabla" aria-live="polite"></div>' +
    '<div class="hely-sarok hely-bal"></div>' +
    '<div class="hely-sarok hely-jobb"><button class="hely-gomb hely-erszeny" aria-label="Erszény"><span>✨ <b class="hely-csilla"></b></span><span class="harmat-jel"> 💧 <b class="hely-harmat"></b></span></button>' +
      '<button class="hely-gomb hely-hang" aria-label="Hang ki/be"></button></div>';
  M.svg = host.querySelector(".hely-svg");
  M.uni = M.svg.querySelector(".terkep-uni"); M.el = M.svg.querySelector(".terkep-uni-irany");
  uniNezoAdat(M.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  M.nezet = helyNezet(H, host.clientWidth || 800, host.clientHeight || 450);
  helyViewBox(M, M.nezet);
  /* az unikornis helye: egy hely mellett, vagy egy szabad ponton */
  var kh = o.all && helyKeres(H, o.all);
  if (kh) { var ap = helyPx(H, kh.all); helyUniAllit(M, ap[0], ap[1]); M.all = kh.id; uniFordul(M.el, -helyAllOldal(kh)); }
  else if (o.pont) { var pp = helyPx(H, o.pont); helyUniAllit(M, pp[0], pp[1]); }
  else { var p0 = helyPx(H, H.helyek[0].all); helyUniAllit(M, p0[0], p0[1]); M.all = H.helyek[0].id; }
  helySarokGombok(M, o);
  if (fajl && H.mozgo) helyMozgoBetolt(M);
  /* koppintás: hely → o.koppint; díszlet → él; föld → szabad séta */
  M.svg.addEventListener("click", function (e) {
    var g = e.target.closest(".terkep-hely"); if (g) { o.koppint(g.getAttribute("data-id")); return; }
    var d = e.target.closest(".hely-diszlet"); if (d) { helyDiszletKoppint(M, d); return; }
    var m = M.svg.getScreenCTM(); if (!m) return;
    var pt = M.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; pt = pt.matrixTransform(m.inverse());
    helySzabadSeta(M, [pt.x, pt.y]);
  });
  helyNevEger(M);
  M.svg.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var g = e.target.closest && e.target.closest(".terkep-hely"); if (!g) return;
    e.preventDefault(); o.koppint(g.getAttribute("data-id"));
  });
  host.addEventListener("wheel", function (e) { if (e.ctrlKey) e.preventDefault(); }, { passive: false });   /* nincs szabad nagyítás */
  return M;
}
function helyDiszletKoppint(M, d) {
  var dd = (M.H.diszlet || []).filter(function (x) { return x.id === d.getAttribute("data-id"); })[0]; if (!dd) return;
  hangGomb();
  d.classList.remove("el"); void d.getBoundingClientRect(); d.classList.add("el");
  setTimeout(function () { d.classList.remove("el"); }, 900);
  var m = typeof dd.mondat === "function" ? dd.mondat() : dd.mondat;
  if (m) mondd(m);
}
/* szabad séta: járható pontra oda, különben a legközelebbi járható pontig; hely mellett megállva a neve */
function helySzabadSeta(M, p) {
  var q = helyJarhatoPont(M, p);
  helySetalPont(M, q, {}, function () {
    var H = M.H, leg = null;
    H.helyek.forEach(function (h) { var d = helyTav(helyPx(H, h.all), q); if (d < H.kep.w * .05 && (!leg || d < leg.d)) leg = { h: h, d: d }; });
    if (M.tabla === "vilag") TERKEP_HOL = { leny: mentes.leny, id: leg ? leg.h.id : null, pont: [q[0] / H.kep.w, q[1] / H.kep.h], tabla: M.tabla };
    if (leg) { var n = helyNevOf(leg.h.id); helyNevTabla(M, n); mondd(n); }
  });
}
/* ── sarok-gombok ── */
function helyPortre() {   /* a saját, öltöztetett unikornis feje kerek keretben */
  return '<svg class="hely-portre-svg" viewBox="-8 -130 76 76" xmlns="http://www.w3.org/2000/svg">' + unikornisSVG("hl-portre", LENYEK[mentes.leny], 1, P().oltozet) + '</svg>';
}
function helySarokFrissit(M) {
  var c = M.host.querySelector(".hely-csilla"), hm = M.host.querySelector(".hely-harmat"), hg = M.host.querySelector(".hely-hang");
  if (c) c.textContent = P().csillampor || 0;
  if (hm) hm.textContent = P().tunderharmat || 0;
  if (hg) { hg.textContent = mentes.hang ? "🔊" : "🔇"; hg.classList.toggle("ki", !mentes.hang); }
}
function helySarokGombok(M, o) {
  var bal = M.host.querySelector(".hely-bal");
  if (HELYEK[M.tabla].vissza) {   /* közelkép: „←” vissza a tájra */
    var v = el("button", "hely-gomb hely-vissza", "←"); v.setAttribute("aria-label", "Vissza: " + VILAG_NEV);
    v.addEventListener("click", function () { hangGomb(); if (o.vissza) o.vissza(); });
    bal.appendChild(v);
  } else {                         /* a tájon: a saját unikornis — koppintás = legelő, 2 mp nyomva = 👪 */
    var b = el("button", "hely-gomb hely-portre"); b.setAttribute("aria-label", "Unikornis-váltás"); b.innerHTML = helyPortre();
    var t = null, hosszu = false;
    b.addEventListener("pointerdown", function (e) { e.preventDefault(); hosszu = false; b.classList.add("nyomva"); t = setTimeout(function () { hosszu = true; b.classList.remove("nyomva"); belepSzuloi(); }, 2000); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { b.addEventListener(ev, function () { clearTimeout(t); b.classList.remove("nyomva"); }); });
    b.addEventListener("click", function () { if (hosszu) { hosszu = false; return; } hangGomb(); sorozatMegtor(); legeloNyit(); });
    bal.appendChild(b);
  }
  M.host.querySelector(".hely-erszeny").addEventListener("click", function () {
    hangGomb();
    var h = P().tunderharmat || 0, cs = P().csillampor || 0;
    mondd(cs + " csillámpor" + (nyitasHarmatRejtett() ? "." : ", és " + h + " tündérharmat."));
  });
  M.host.querySelector(".hely-hang").addEventListener("click", function () {
    mentes.hang = !mentes.hang; ment();
    if (!mentes.hang) { try { speechSynthesis.cancel(); } catch (e) {} } else hangGomb();
    helySarokFrissit(M);
  });
  helySarokFrissit(M);
}

/* ── RÁKÖZELÍTÉS egy helyre, aztán kesz (a hívó nyitja a célt) ── */
function helyBelep(M, id, kesz) {
  var h = helyKeres(M.H, id); if (!h) { kesz(); return; }
  helyZoom(M, M.vb, helyCelNezet(M, h), { halvanyul: true }, kesz);
}
/* ── KINAGYÍTÁS: a kép a hely közelképéből nyílik ki (visszatérés egy helyről) ── */
function helyKinagyit(M, id) {
  var h = helyKeres(M.H, id); if (!h) return;
  var cel = M.nezet; helyViewBox(M, helyCelNezet(M, h));
  if (nyugiMod() || window.__UC_GYORS) { M.svg.style.opacity = "0"; helyViewBox(M, cel); setTimeout(function () { M.svg.style.transition = "opacity .3s"; M.svg.style.opacity = "1"; }, 20); return; }
  M.svg.style.opacity = ".3";
  helyZoom(M, M.vb, cel, { elotunik: true }, function () { M.svg.style.opacity = "1"; });
}

/* ═════ A VILÁGKÉP a főképernyőn (a régi renderLigetTerkep helyén; ugyanazok a jelek, köd, ébredés) ═════ */
/* a hely céljának ligetei (a beköltözött lakókkal: a Piactéren a Vásár is) */
function helyCelRegiok(h) {
  var c = h.cel;
  if (c.regio) return terkepLakok(c.regio);
  if (c.kozelkep) return [].concat.apply([], HELYEK[c.kozelkep].helyek.map(helyCelRegiok));
  return [];
}
/* melyik hely viszi a ligetet (az első a táblában; a Vásár a Piactér lakója) — tabla: "vilag" vagy közelkép */
function helyRegiobol(r, tabla) {
  var H = HELYEK[tabla || "vilag"], g = terkepGazda(r);
  for (var i = 0; i < H.helyek.length; i++) {
    var c = H.helyek[i].cel;
    if (c.regio === g || (c.kozelkep && helyRegiobol(r, c.kozelkep))) return H.helyek[i].id;
  }
  return null;
}
/* a hely id-je (TERKEP_HOL: hely-id vagy liget-id) — ha több hely viszi ugyanazt a ligetet, az, amelyiken át bement */
function vilagHelyId(id) {
  if (!id) return null;
  if (helyKeres(HELYEK.vilag, id)) return id;
  var U = VILAG_UTOLSO;
  if (U && U.leny === mentes.leny && terkepGazda(U.regio) === terkepGazda(id) && helyKeres(HELYEK.vilag, U.hely)) return U.hely;
  return helyRegiobol(id, "vilag");
}
/* a helyek állapota (⭐, jelzések, köd, fény) — a régi renderLigetTerkep szabályai szerint, helyenként */
function helyAllapot(H, L) {
  var jel = {}, lathato = {}, minden = [];
  Object.keys(L.regiok).forEach(function (r) { minden = minden.concat(L.regiok[r]); });
  var elso = {};   /* liget → az első hely, amelyik viszi (az újonc-fény csak ott ég) */
  H.helyek.forEach(function (h) {
    var c = h.cel;
    if (c.kepernyo) { lathato[h.id] = true; return; }
    if (c.kod) { jel[h.id] = { ny: "alszik" }; return; }
    var rs = helyCelRegiok(h).filter(function (r) { return L.regiok[r]; });
    if (!rs.length) return;   /* a pulton rejtve: ködben, nem nyílik */
    lathato[h.id] = true;
    var j = null;
    if (h.palyak) {
      var lista = minden.filter(function (rec) { return h.palyak.indexOf(rec.pa.id) >= 0; });
      if (lista.length) j = ligetOsszegzo(c.regio || rs[0], lista);
    } else rs.forEach(function (r) { j = ligetOsszegzoOssze(j, ligetOsszegzo(r, L.regiok[r])); });
    j = j || { kesz: 0, ossz: 0, jelzes: [] };
    if (rs.some(function (r) { return kuldLigetJel(r).length; })) j.jelzes = ["🐉"].concat(j.jelzes || []).slice(0, 2);
    var ny = null, RANG = { vil: 3, nyitva: 2, vers: 2, alszik: 1 };
    rs.forEach(function (r) { var a = nyitasLiget(r); if (a && (!ny || RANG[a] > RANG[ny])) ny = a; });
    var fo = rs.some(function (r) { if (elso[r]) return false; elso[r] = h.id; return true; });
    if (ny && !fo && ny !== "alszik") ny = null;   /* a második hely ugyanarra a ligetre: nem világít */
    if (ny) j.ny = ny;
    if (ny === "alszik") j = { ny: "alszik" };
    jel[h.id] = j;
  });
  return { jel: jel, lathato: lathato };
}
function renderVilag(racs, L) {
  var host = el("div", "terkep-host hely-host uni-terep");
  racs.appendChild(host);
  var hol0 = TERKEP_HOL && TERKEP_HOL.leny === mentes.leny ? TERKEP_HOL : null;
  /* közelképből jött (pl. a Szabóműhelyből): a közelkép nyílik, ott áll az unikornis */
  var kozel = hol0 && !helyKeres(HELYEK.vilag, hol0.id) && hol0.id && helyRegiobol(hol0.id, "vilag");
  var kozelH = kozel && helyKeres(HELYEK.vilag, kozel);
  if (kozelH && kozelH.cel.kozelkep && VILAG_KIZOOM) { renderKozelkep(host, L, kozelH.cel.kozelkep, helyRegiobol(hol0.id, kozelH.cel.kozelkep), true); return; }
  var A = helyAllapot(HELYEK.vilag, L), jel = A.jel, lathato = A.lathato;
  /* 🚪 ma felébredt liget (nyitas.js): előbb ködben, aztán felébred */
  var ebredR = nyitasFrissit(L.regiok).filter(function (r) { return L.regiok[r] && helyRegiobol(r); });
  var ebred = ebredR.map(function (r) { return helyRegiobol(r); }).filter(function (g, i, a) { return a.indexOf(g) === i; });
  ebred.forEach(function (g) { if (jel[g]) jel[g] = { ny: "alszik", _j: jel[g] }; });
  jel.kert = { jelzes: (tenyKertVar() ? ["🦋"] : []).concat(lenyKertJel()).concat(kuldKertJel()).slice(0, 2) };
  jel.odu = { jelzes: lenyTerkepJel() };
  var hEbred = null;
  ["utca", "kert"].forEach(function (h) {
    var a = nyitasHely(h); if (!a) return;
    if (a === "ebred" && !hEbred) hEbred = h;
    jel[h] = { ny: "alszik" };
  });
  if (!jel.utca && nyitasUtcaVar()) jel.utca = { ny: "vil" };
  var hol = vilagHelyId(hol0 && hol0.id), pont = !hol && hol0 && hol0.pont && hol0.tabla === "vilag" ? hol0.pont : null;
  if (!pont && (!hol || !lathato[hol] || (jel[hol] && jel[hol].ny === "alszik"))) hol = "odu";
  var M = LIGET_M = VILAG_M = helyRajzol(host, { tabla: "vilag", jel: jel, lathato: lathato, all: pont ? null : hol, pont: pont, koppint: vilagKoppint });
  M.mod = utcaMod(host.clientWidth, host.clientHeight);   /* a régi térkép forgatás-figyelője (terkep.js) csak elrendezés-váltáskor rajzol újra */
  M.helyId = function (r) { return helyRegiobol(r) || r; };
  M.setal = helySetal;
  if (VILAG_KIZOOM) { var kz = vilagHelyId(VILAG_KIZOOM); VILAG_KIZOOM = null; if (kz) helyKinagyit(M, kz); }
  bemutat("terkep");
  if (P().bemutatva.terkep && !NYITO.seta) bemutat("vasarKoltozott");
  if (NYITO.seta) nyitoSeta(M);
  else if (hEbred) {
    nyitasHelyLatta(hEbred);
    if (hEbred === "utca") { P().bemutatva.ujoncBolt = 1; ment(); }
    jel[hEbred] = {};
    setTimeout(function () { if (VILAG_M === M && M.svg.isConnected) helyEbreszt(M, hEbred, NYITAS_BEMUTAT[hEbred].mondat); }, 700);
  }
  else if (!ebred.length && !nyitasJelenet("terkep", "kepernyo-fomenu")) bemutat("ujoncBolt");
  if (ebred.length) {
    var id = ebred[0], lako = ebredR.filter(function (r) { return helyRegiobol(r) === id && TERKEP_GAZDA[r]; })[0];
    ebredR.forEach(nyitasLatta);
    ebred.forEach(function (g) { if (jel[g] && jel[g]._j) jel[g] = jel[g]._j; });
    var ebMondat = lako ? "Nézd, felébredt " + nevelo(LIGET_NEV[lako][1]) + " " + LIGET_NEV[lako][1] + "!" : null;
    setTimeout(function () { if (VILAG_M === M && M.svg.isConnected) helyEbreszt(M, id, ebMondat); }, 700);
  }
}
/* a hely felébred: a köd felszáll, kigyúl a fény, az unikornis odasétál és szól (a régi ltNyEbreszt) */
function helyEbreszt(M, id, mondat) {
  var g = M.svg.querySelector('.terkep-hely[data-id="' + id + '"]'); if (!g) return;
  var kod = g.querySelector(".ny-kodfelho"), j = M.jel[id] || {};
  if (kod) kod.classList.add("felszall");
  g.classList.remove("ny-kod", "rejtett");
  setTimeout(function () {
    if (!M.svg.isConnected) return;
    var tr = g.firstElementChild, hb = tr.querySelector(".hb"), tmp = document.createElementNS("http://www.w3.org/2000/svg", "g");
    if (M.H.kep.mappa) {   /* 2. kör: az állvány eltűnik, kész a ház (a kép a mostani állapota szerint) */
      var h = helyKeres(M.H, id), uj = helyKepAllapot(h, j, false), im = g.querySelector(".hb image");
      if (im && uj !== "epul") { im.setAttribute("href", helyFajl(M.H, h.kep + "-" + uj)); im.parentNode.setAttribute("data-all", uj); }
      if (j.ny === "vil" || !j.ny) {
        tmp.innerHTML = '<g transform="translate(' + (h.x * M.H.kep.w).toFixed(1) + ' ' + (h.y * M.H.kep.h).toFixed(1) + ') scale(' + M.H.jk + ')">' + ltNyHalo(HELY_MAGAS) + '</g>';
        var hb2 = g.querySelector(".hb"); g.insertBefore(tmp.firstChild, hb2); hb2.classList.add("ny-vilagit");
      }
    }
    else if (j.ny === "vil" || !j.ny) { tmp.innerHTML = ltNyHalo(HELY_MAGAS); tr.insertBefore(tmp.firstChild, hb); hb.classList.add("ny-vilagit"); }
    if (kod && kod.parentNode) kod.parentNode.removeChild(kod);
    var nev = helyNevOf(id);
    helyNevTabla(M, nev);
    mondd(mondat || "Nézd, felébredt " + nevelo(nev) + " " + nev + "!");
    helySetal(M, id);
  }, nyugiMod() ? 0 : 900);
}
/* koppintás egy helyre a tájon */
function vilagKoppint(id) {
  var M = VILAG_M; if (!M || !M.svg.isConnected) return;
  if (M.fut && M.fut.hely) { helySetal(M, id); return; }   /* második koppintás séta közben: azonnal ott van */
  hangGomb();
  var h = helyKeres(M.H, id), j = M.jel[id] || {}, nev = helyNevOf(id);
  helyNevTabla(M, nev);
  if (!M.halo.lathato[id] || j.ny === "alszik") {   /* ködben alszik: odasétál, de nem lehet bemenni */
    mondd(h.cel.kod ? nev + ". Ez még ködben alszik." : NYITAS_MONDAT.alszik);
    helySetal(M, id); return;
  }
  mondd(id === "utca" ? "Irány az utca!" : id === "odu" ? "Haza, az odúba!" : id === "kert" ? "Irány a kert!" : (j.alszik ? zarvaMondat() : nev + "!"));
  helySetal(M, id, function () {
    TERKEP_HOL = { leny: mentes.leny, id: id };
    helyBelep(M, id, function () {
      if (!$("kepernyo-fomenu").classList.contains("aktiv") || VILAG_M !== M) return;   /* közben máshová ment */
      helyCel(M, h);
    });
  });
}
function helyCel(M, h) {
  var c = h.cel;
  if (c.regio) VILAG_UTOLSO = { leny: mentes.leny, hely: h.id, regio: c.regio };
  if (c.kepernyo === "utca") utcaNyit();
  else if (c.kepernyo === "odu") oduNyit("fomenu");
  else if (c.kepernyo === "kert") kertNyit();
  else if (c.kozelkep) { var host = M.host, L = fomenuLigetek(); renderKozelkep(host, L, c.kozelkep, null, false); }
  else if (c.regio) ligetbeLep(c.regio);
}
/* ── KÖZELKÉP (1. kör: a Kézművesek ideiglenes képe a három mai műhellyel) ── */
function renderKozelkep(host, L, tabla, hol, kifele) {
  var A = helyAllapot(HELYEK[tabla], L), H = HELYEK[tabla];
  var M = LIGET_M = VILAG_M = helyRajzol(host, { tabla: tabla, jel: A.jel, lathato: A.lathato, all: hol || null, pont: hol ? null : H.pontok.kapu, koppint: kozelKoppint,
    vissza: function () {
      var gazda = HELYEK.vilag.helyek.filter(function (h) { return h.cel.kozelkep === tabla; })[0];
      TERKEP_HOL = { leny: mentes.leny, id: gazda.id };
      helyZoom(M, M.vb, [M.vb[0] + M.vb[2] * .2, M.vb[1] + M.vb[3] * .2, M.vb[2] * .6, M.vb[3] * .6], { halvanyul: true }, function () {
        if (VILAG_M !== M) return;
        VILAG_KIZOOM = gazda.id; FOMENU_LIGET = null; renderFomenu();
      });
    } });
  M.mod = utcaMod(host.clientWidth, host.clientHeight);
  M.setal = helySetal; M.helyId = function (r) { return helyRegiobol(r, tabla) || r; };
  if (!kifele) { M.svg.style.opacity = "0"; requestAnimationFrame(function () { M.svg.style.transition = "opacity .35s"; M.svg.style.opacity = "1"; }); }
  else { VILAG_KIZOOM = null; if (hol) helyKinagyit(M, hol); }
  var nev = HELYEK[tabla].nev; helyNevTabla(M, nev); if (!kifele) mondd(nev + "!");
}
function kozelKoppint(id) {
  var M = VILAG_M; if (!M || !M.svg.isConnected) return;
  if (M.fut && M.fut.hely) { helySetal(M, id); return; }
  hangGomb();
  var h = helyKeres(M.H, id), j = M.jel[id] || {}, nev = helyNevOf(id);
  helyNevTabla(M, nev);
  if (!M.halo.lathato[id] || j.ny === "alszik") { mondd(NYITAS_MONDAT.alszik); helySetal(M, id); return; }
  mondd(j.alszik ? zarvaMondat() : nev + "!");
  helySetal(M, id, function () {
    TERKEP_HOL = { leny: mentes.leny, id: h.cel.regio };
    helyBelep(M, id, function () {
      if (!$("kepernyo-fomenu").classList.contains("aktiv") || VILAG_M !== M) return;
      helyCel(M, h);
    });
  });
}
window.addEventListener("resize", function () {   /* az ablak mérete változott: a „cover” nézet újra (a zóna egészen) */
  var M = VILAG_M; if (!M || !M.svg || !M.svg.isConnected || M.fut) return;
  M.nezet = helyNezet(M.H, M.host.clientWidth, M.host.clientHeight); helyViewBox(M, M.nezet);
});

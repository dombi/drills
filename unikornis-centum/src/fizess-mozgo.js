/* ============ 6h8) 💰 FIZESS PONTOSAN — a ④ „Biztos, lehetséges, lehetetlen” elmagyarázó mozgóképe (2026-11-08) ============
   Recept-lap: terv/fizess-pontosan-recept-lap.html (a forgatókönyv és a döntések ✅ a producertől, 11-08). Motor: meres-mozgo.js (mkTw,
   mkLejatszik: 800×420-as színpad, koppintásra a végére ugrik, a végén magától továbbmegy). Zsivány a saját rigjével (lakok.js „juli”),
   a gyerek saját unikornisa a bal sarokban: a szarva világít végig Zsivány füzetének sorain.
   A kép a gondolkodás helye: az ÖSSZES pontos fizetés egy füzetlapon, soronként ✓ / ✗ — a tál a sorok mintájából következik:
     minden sorban ✓ → Biztos · van ✓ és van ✗ → Lehet · egyikben sincs ✓ → Lehetetlen.
   Két változat (ugyanaz a klip, FPM_BLN):
     🎬 bemutató — gyerekenként egyszer, az első ④ feladat előtt (P().mkLatott["fizess-bln"]). 12 tallér, erszény 10, 5, 5, 2, 1, 1, 4 út;
        3 állítás: „Adsz kettest is.” (Lehet) · „Kevesebb, mint 5 érmét adsz.” (Biztos) · „Ötnél több érmét adsz.” (Lehetetlen, nagy hangsúllyal),
        a végén a zárókép: a 3 tál a szabállyal. Kb. 45 mp hanggal (a beszédet megvárja).
     ❌ rossz tál után — a feladat saját számaival (erszény, ár, az összes pontos fizetés, a soron lévő állítás), zárókép nélkül; utána a
        gyerek ugyanazt az állítást újra a tálba teszi. Ez VÁLTJA a régi ellenpéldát / ✓✗-listát a pulton (fpBlnTesz). */

var FPM_TAL = [["b", "Biztos", "#3f9e6a", "#e3f4e8"], ["l", "Lehetséges", "#5f84b0", "#e4edf8"], ["n", "Lehetetlen", "#b5607e", "#f8e3ea"]];
var FPM_BX = { b: 312, l: 430, n: 548 }, FPM_TY = 350;          /* a tálak közepe, pereme */
var FPM_U = { x: 100, y: 402, s: 1 };                            /* a gyerek unikornisa (lábpont) */
var FPM_SZ = 'font-family="Fredoka,Segoe UI,sans-serif" font-weight="700"';
var FPM_SZABALY = { b: "Mindig igaz.", l: "Van, amikor igaz.", n: "Akárhogy fizetsz, ez nem lesz igaz." };
function fpmSor(r) { return 136 + r * 46; }                      /* a füzet r-edik sorának közepe */
function fpmErsz(i) { return [32 + i * 38, 168]; }               /* az erszényből kiugró érmék helye */
function fpmSorX(j, n) { return 294 + j * (n > 4 ? 44 : 54); }
function fpmSorM(n) { return n > 4 ? .7 : .82; }               /* a sorban az érme nagysága */
function fpmDb(a) { return a.t !== "van" && a.t !== "nincs" && a.t !== "csak"; }   /* érmeszám-állítás (a sor mellé a darabszám) */
function fpmT(g, x, y, s) { mkAttr(g, { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" + (s != null ? " scale(" + s.toFixed(3) + ")" : "") }); }

/* a beszéd: kiírja, kimondja, és megvárja a végét (legalább min ms-ig áll) — átugrásnál nem vár */
function fpmSzol(ctx, fel, t, min, felirat) {
  if (!ctx.el()) return Promise.reject("stop");
  if (fel) fel(felirat || t);
  if (ctx.skip) return Promise.resolve();
  var gyors = !!window.__UC_GYORS;
  return new Promise(function (res, rej) {
    var kesz = gyors, t0 = performance.now(), m = (min || 0) * ctx.lassu;
    mondd(t, function () { kesz = true; });
    var iv = setInterval(function () {
      if (!ctx.el()) { clearInterval(iv); rej("stop"); return; }
      if (ctx.skip || kesz && performance.now() - t0 >= m) { clearInterval(iv); res(); }
    }, 40);
  });
}
function fpmZs(svg, poz) { var L = svg.__fpmZs; if (L && L.root.isConnected) { L.megszakit(); L.poz(poz); } }

/* az adatok: bemutató vagy a feladatból */
function fpmBemutatoAdat() {
  var e = [10, 5, 5, 2, 1, 1];
  return { bem: true, ar: 12, erszeny: e, fiz: [[10, 2], [10, 1, 1], [5, 5, 2], [5, 5, 1, 1]],
    allit: [{ t: "van", c: 2, szoveg: "Adsz kettest is.", ert: "l" }, { t: "kevesebb", n: 5, szoveg: "Kevesebb, mint 5 érmét adsz.", ert: "b" },
            { t: "legalabb", n: 6, szoveg: "Ötnél több érmét adsz.", ert: "n" }] };
}
function fpmHibaAdat(d, a) {
  var fiz = d.fiz.map(function (f) { return f.slice().sort(fpCsokk); }).sort(function (p, q) { return p.length - q.length || q[0] - p[0]; });
  return { bem: false, ar: d.ar, erszeny: d.erszeny.slice(), fiz: fiz, allit: [a] };
}
/* melyik erszény-érme megy a sorba (index szerint, hogy a repülés onnan induljon) */
function fpmHonnan(e, f) {
  var h = []; f.forEach(function (v) { for (var i = 0; i < e.length; i++) if (e[i] === v && h.indexOf(i) < 0) { h.push(i); return; } });
  return h;
}

var FPM_BLN = {
  render: function (o) {
    var s = '<defs>' + HE_DEFS + '</defs>' + mkBelso("pekseg"), i;
    /* a cédula és az erszény (bal fent) */
    s += '<g class="fpm-ced">' + kfCedula(58, 14, o.ar, 1.7) + '</g>';
    s += '<g class="fpm-ersz">' + kfErszeny(158, 128, 1.45, "") + '</g>';
    o.erszeny.forEach(function (v, i) { var E = fpmErsz(i); s += '<g class="fpm-ec" opacity="0" transform="translate(158 104) scale(.3)"><g>' + tallerBelso(v, .9) + '</g></g>'; });
    /* Zsivány füzete: spirál, margó, sorok */
    s += '<g class="fpm-fuzet"><rect x="252" y="76" width="356" height="248" rx="8" fill="#fffef6" stroke="#c9b6dc" stroke-width="2.4"/>' +
         '<path d="M278 80V320" stroke="#f2b8c6" stroke-width="2"/>';
    for (i = 270; i <= 596; i += 22) s += '<circle cx="' + i + '" cy="76" r="5" fill="none" stroke="#8a7a9e" stroke-width="2"/>';
    s += '<text x="292" y="108" font-size="18" ' + FPM_SZ + ' fill="#b35f28">Pontosan ' + o.ar + ' tallér:</text>';
    for (i = 0; i < 4; i++) s += '<path d="M256 ' + (fpmSor(i) + 23) + 'H604" stroke="#dbe8f6" stroke-width="1.6"/>';
    o.fiz.forEach(function (f, r) {
      var y = fpmSor(r);
      s += '<rect class="fpm-sorfeny" x="282" y="' + (y - 21) + '" width="322" height="42" rx="10" fill="#fff3a0" opacity="0"/>';
      f.forEach(function (v, j) {
        var x = fpmSorX(j, f.length);
        if (j) s += '<text class="fpm-plusz" data-r="' + r + '" x="' + (x - (f.length > 4 ? 22 : 27)) + '" y="' + (y + 6) + '" text-anchor="middle" font-size="18" ' + FPM_SZ + ' fill="#8a7a9e" opacity="0">+</text>';
        s += '<g class="fpm-sc" data-r="' + r + '" data-v="' + v + '" opacity="0"><circle class="fpm-ragy" r="19" fill="#ffe27a" opacity="0"/><g>' + tallerBelso(v, fpmSorM(f.length)) + '</g></g>';
      });
      s += '<text class="fpm-db" data-r="' + r + '" x="554" y="' + (y + 6) + '" text-anchor="middle" font-size="17" ' + FPM_SZ + ' fill="#5f84b0" opacity="0">' + f.length + ' érme</text>';
      s += '<text class="fpm-jel" data-r="' + r + '" x="594" y="' + (y + 10) + '" text-anchor="middle" font-size="30" ' + FPM_SZ + ' opacity="0"></text>';
    });
    s += '</g>';
    /* a három tál (lent) */
    FPM_TAL.forEach(function (t) {
      var x = FPM_BX[t[0]];
      s += '<g class="fpm-tal" data-t="' + t[0] + '"><g class="fpm-talb" transform="translate(' + x + ' ' + FPM_TY + ')">' +
           '<ellipse class="fpm-talfeny" cx="0" cy="8" rx="60" ry="30" fill="' + t[3] + '" opacity="0"/>' +
           '<path d="M-48 0Q0 36 48 0Z" fill="#fbf3e4" stroke="' + t[2] + '" stroke-width="2.4"/><ellipse cx="0" cy="0" rx="48" ry="9" fill="#fffaf0" stroke="' + t[2] + '" stroke-width="2.4"/></g>' +
           '<text x="' + x + '" y="404" text-anchor="middle" font-size="17" ' + FPM_SZ + ' fill="' + t[2] + '">' + t[1] + '</text></g>';
    });
    /* az állítás-kártyák (egymás után jönnek, a tálba repülnek) */
    o.allit.forEach(function (a, k) {
      s += '<g class="fpm-all" data-k="' + k + '" opacity="0" transform="translate(430 42)"><rect x="-176" y="-25" width="352" height="50" rx="11" fill="#fffaf0" stroke="#7a5ca8" stroke-width="2.6"/>' +
           '<text y="8" text-anchor="middle" font-size="' + (a.szoveg.length > 26 ? 20 : 23) + '" ' + FPM_SZ + ' fill="#4a3b7a">„' + a.szoveg + '”</text></g>';
    });
    /* a szarv fénye */
    s += '<path class="fpm-feny" d="M0 0" stroke="#fff3a0" stroke-width="7" stroke-linecap="round" opacity="0"/>';
    s += mkUni(FPM_U.x, FPM_U.y, FPM_U.s);
    s += '<g class="fpm-zs" transform="translate(612 148) scale(.8)"></g>';
    /* a zárókép (csak a bemutatóban): a 3 tál a szabállyal */
    if (o.bem) {
      var z = '<g class="fpm-zaro" opacity="0"><rect x="232" y="8" width="380" height="404" rx="18" fill="#fff8ea" stroke="#efd2a8" stroke-width="3"/>' +
              '<text x="422" y="52" text-anchor="middle" font-size="22" ' + FPM_SZ + ' fill="#4a3b7a">Nézd meg az összes pontos fizetést!</text>';
      var sz = { b: ["minden", "sorban ✓"], l: ["van ✓", "és van ✗"], n: ["egyikben", "sincs ✓"] };
      FPM_TAL.forEach(function (t, i) {
        var x = 296 + i * 126;
        z += '<text x="' + x + '" y="118" text-anchor="middle" font-size="22" ' + FPM_SZ + ' fill="' + t[2] + '">' + t[1] + '</text>' +
             '<g transform="translate(' + x + ' 180)"><rect x="-34" y="-30" width="68" height="24" rx="5" fill="#fffaf0" stroke="#7a5ca8" stroke-width="2" transform="rotate(-6)"/>' +
             '<path d="M-54 0Q0 40 54 0Z" fill="#fbf3e4" stroke="' + t[2] + '" stroke-width="2.6"/><ellipse rx="54" ry="10" fill="#fffaf0" stroke="' + t[2] + '" stroke-width="2.6"/></g>' +
             '<text x="' + x + '" y="262" text-anchor="middle" font-size="20" ' + FPM_SZ + ' fill="#4a3b7a">' + sz[t[0]][0] + '</text>' +
             '<text x="' + x + '" y="290" text-anchor="middle" font-size="20" ' + FPM_SZ + ' fill="#4a3b7a">' + kiiras(sz[t[0]][1]).replace("✓", '<tspan fill="#3f9e6a">✓</tspan>').replace("✗", '<tspan fill="#c0465a">✗</tspan>') + '</text>';
      });
      s += z + '</g>';
    }
    return s + '<g class="fx"></g>';
  },
  init: function (svg) {
    var h = mkQ(svg, ".fpm-zs");
    if (h && typeof Lako === "function") svg.__fpmZs = new Lako(h, "juli", { poz: "koszon", elet: false });
  },
  play: async function (ctx, svg, fel, o) {
    var ec = mkQQ(svg, ".fpm-ec"), cards = mkQQ(svg, ".fpm-all"), i, r;
    /* 1. a cédula és az erszény */
    var ced = mkQ(svg, ".fpm-ced");
    await mkTw(ctx, 380, function (p) { mkAttr(ced, { transform: "rotate(" + (6 * Math.sin(p * Math.PI * 3) * (1 - p)) + " 58 14)" }); }, mkLin);
    await fpmSzol(ctx, fel, zsCap(szo(o.ar)) + " tallér.", 500, o.ar + " tallér");
    fpmZs(svg, "mutat");
    for (i = 0; i < ec.length; i++) (function (g, E) {
      mkTw(ctx, 300, function (p) { fpmT(g, mkLerp(158, E[0], p), mkLerp(104, E[1], p) - 34 * Math.sin(Math.PI * p), mkLerp(.3, 1, p)); mkAttr(g, { opacity: Math.min(1, p * 3) }); }, mkEaseOut).catch(function () {});
    })(ec[i], fpmErsz(i));
    await mkVar(ctx, 420);
    await fpmSzol(ctx, fel, o.bem ? "Pontosan kell fizetned. Hányféleképpen lehet?" : "Nézzük meg az összes pontos fizetést!", 600);
    /* 2. a fizetések utanként beugranak a füzetbe; a bemutatóban Zsivány hangosan összeszámolja */
    fpmZs(svg, "szamol");
    for (r = 0; r < o.fiz.length; r++) {
      var f = o.fiz[r], h = fpmHonnan(o.erszeny, f), sc = mkQQ(svg, '.fpm-sc[data-r="' + r + '"]'), pl = mkQQ(svg, '.fpm-plusz[data-r="' + r + '"]'), y = fpmSor(r);
      for (var j = 0; j < sc.length; j++) {
        var E = fpmErsz(h[j]), x = fpmSorX(j, f.length), g = sc[j], src = ec[h[j]];
        mkAttr(g, { opacity: 1 }); if (src) mkAttr(src, { opacity: .45 });
        await mkTw(ctx, o.bem ? 230 : 150, function (p) { fpmT(g, mkLerp(E[0], x, p), mkLerp(E[1], y, p) - 40 * Math.sin(Math.PI * p)); });
        if (src) mkAttr(src, { opacity: 1 });
        if (pl[j - 1]) mkAttr(pl[j - 1], { opacity: 1 });
      }
      if (o.bem) await fpmSzol(ctx, fel, fpSzamol(f.slice()), 250, f.join(" + ") + " = " + o.ar);
      else { fel(f.join(" + ") + " = " + o.ar); await mkVar(ctx, 160); }
    }
    fpmZs(svg, "mutat");
    await fpmSzol(ctx, fel, o.bem ? "Ennyiféleképpen lehet, más nincs." : "Ennyiféleképpen lehet pontosan fizetni, más nincs.", 500);
    /* 3–5. az állítások: a szarv végigvilágít a sorokon, ✓ / ✗, a kártya a tálba */
    for (var k = 0; k < o.allit.length; k++) await fpmAllitas(ctx, svg, fel, o, k, cards[k]);
    /* 6. zárókép (a bemutatóban) */
    if (o.bem) {
      var zr = mkQ(svg, ".fpm-zaro");
      fpmZs(svg, "orul");
      await mkTw(ctx, 500, function (p) { mkAttr(zr, { opacity: p }); });
      var zm = "Biztos: minden sorban igaz. Lehetséges: van, ahol igaz, és van, ahol nem. Lehetetlen: egyikben sem igaz.";
      mkSzikra(ctx, svg, 422, 150, 10, ["#ffe27a", "#f6a5c0", "#9ec9f0", "#fff"]);
      if (ctx.skip) { fel("Biztos: minden sorban ✓ · Lehetséges: van ✓ és van ✗ · Lehetetlen: egyikben sincs ✓"); mkMond(ctx, zm, true); }   /* az átugró gyerek is hallja */
      else await fpmSzol(ctx, fel, zm, 3000, "Biztos: minden sorban ✓ · Lehetséges: van ✓ és van ✗ · Lehetetlen: egyikben sincs ✓");
      await mkVar(ctx, 800);
    }
  }
};
/* egy állítás végigvizsgálása: kártya be → soronként a szarv fénye, kiemelés (érme ragyog / darabszám), ✓ / ✗ → a kártya a jó tálba */
async function fpmAllitas(ctx, svg, fel, o, k, card) {
  var a = o.allit[k], db = fpmDb(a), jelek = mkQQ(svg, ".fpm-jel"), feny = mkQ(svg, ".fpm-feny"), sorF = mkQQ(svg, ".fpm-sorfeny"), r;
  var tip = [FPM_U.x + 116 * FPM_U.s * .5, FPM_U.y - 248 * FPM_U.s * .5], utolso = k === o.allit.length - 1 && o.bem;
  jelek.forEach(function (j) { mkAttr(j, { opacity: 0 }); j.textContent = ""; });
  if (!db) mkQQ(svg, ".fpm-db").forEach(function (t) { mkAttr(t, { opacity: 0 }); });
  fpmZs(svg, "var");
  await mkTw(ctx, 320, function (p) { mkAttr(card, { opacity: p, transform: "translate(430 " + (42 - 16 * (1 - p)) + ")" }); }, mkEaseOut);
  await fpmSzol(ctx, fel, a.szoveg, 400, "„" + a.szoveg + "”");
  for (r = 0; r < o.fiz.length; r++) {
    var y = fpmSor(r), igaz = fpAllitIgaz(a, o.fiz[r]), jel = jelek[r];
    mkSzarvVarazs(ctx, svg, FPM_U);
    mkAttr(feny, { d: "M" + tip[0] + " " + tip[1] + "L284 " + y, opacity: .8 }); mkAttr(sorF[r], { opacity: .6 });
    if (db) {
      var dt = mkQ(svg, '.fpm-db[data-r="' + r + '"]');
      if (dt.getAttribute("opacity") !== "1") { mkAttr(dt, { opacity: 1 }); if (o.bem && k === 1) await fpmSzol(ctx, null, szo(o.fiz[r].length) + ".", 150); }
    } else {
      mkQQ(svg, '.fpm-sc[data-r="' + r + '"]').forEach(function (g) {
        if (+g.getAttribute("data-v") !== a.c) return;
        var rg = mkQ(g, ".fpm-ragy");
        mkTw(ctx, 520, function (p) { mkAttr(rg, { opacity: .85 * Math.sin(Math.PI * Math.min(1, p * 1.6)) + (p > .6 ? .5 : 0) }); }, mkLin).catch(function () {});
      });
    }
    await mkVar(ctx, utolso ? 260 : 420);
    jel.textContent = igaz ? "✓" : "✗"; mkAttr(jel, { fill: igaz ? "#3f9e6a" : "#c0465a" });
    await mkTw(ctx, 180, function (p) { mkAttr(jel, { opacity: p, transform: "translate(594 " + y + ") scale(" + (1.6 - .6 * p) + ") translate(-594 " + (-y) + ")" }); }, mkEaseBack);
    mkAttr(sorF[r], { opacity: 0 });
    await mkVar(ctx, 160);
  }
  mkAttr(feny, { opacity: 0 });
  mkQQ(svg, ".fpm-ragy").forEach(function (g) { mkAttr(g, { opacity: 0 }); });
  /* a kártya a tálba */
  var bx = FPM_BX[a.ert], tal = mkQ(svg, '.fpm-tal[data-t="' + a.ert + '"]'), tb = mkQ(tal, ".fpm-talb"), tf = mkQ(tal, ".fpm-talfeny"), dx = (k % 3 - 1) * 4;
  fpmZs(svg, a.ert === "n" ? "vallatvon" : "orul");
  await mkTw(ctx, 520, function (p) { fpmT(card, mkLerp(430, bx + dx, p), mkLerp(42, FPM_TY - 12, p) - 60 * Math.sin(Math.PI * p), mkLerp(1, .25, p)); });
  hangCsilla();
  var nagy = a.ert === "n" && o.bem;   /* a Lehetetlen NAGY hangsúllyal */
  mkTw(ctx, nagy ? 1300 : 700, function (p) {
    var s = 1 + (nagy ? .28 : .12) * Math.sin(Math.PI * Math.min(1, p * (nagy ? 1.2 : 1)));
    mkAttr(tb, { transform: "translate(" + bx + " " + FPM_TY + ") scale(" + s.toFixed(3) + ")" }); mkAttr(tf, { opacity: p < .9 ? .95 : 0 });
  }, mkLin).catch(function () {});
  if (nagy) mkSzikra(ctx, svg, bx, FPM_TY - 20, 10, ["#f6a5c0", "#b5607e", "#fff"]);
  var mondat = o.bem ? FPM_SZABALY[a.ert] : { b: "Minden sorban igaz. Ez biztos.", l: "Van, ahol igaz, és van, ahol nem. Ez lehetséges.", n: "Egyikben sem igaz. Ez lehetetlen." }[a.ert];
  await fpmSzol(ctx, fel, mondat, nagy ? 1400 : 700, mondat);
  mkAttr(tf, { opacity: 0 });
  await mkVar(ctx, nagy ? 500 : 250);
}

/* 🎬 a bemutató: az első ④ feladat ELŐTT, gyerekenként egyszer (engine-logic ujFeladat) — true = most fut, a tovabb() a végén */
function fpmElottKell(f, tovabb) {
  if (!f || f.jelenet !== "fizess" || !f.zs || !f.zs.d || f.zs.d.forma !== "bln" || !J) return false;
  var p = P(); p.mkLatott = p.mkLatott || {};
  if (p.mkLatott["fizess-bln"]) return false;
  p.mkLatott["fizess-bln"] = 1; ment();
  mkLejatszik({ klip: FPM_BLN, o: fpmBemutatoAdat() }, "Biztos, lehetséges, vagy lehetetlen?", tovabb);
  return true;
}
/* ❌ rossz tál után: a hiba könyvelve, aztán a mozgókép a feladat számaival; utána ugyanaz az állítás újra a tálba */
function fpmHiba(x, tal) {
  var d = x.d, a = d.allit[x.ai], f = JL.f, vj = $("visszajelzes"), cimke = { b: "biztos", l: "lehet", n: "lehetetlen" }[tal];
  JL.rossz = cimke; jlRossz(cimke, d.naplo); JL.seg = Math.min(2, ++x.hib);
  x.pult = []; x.mutat = null; x.lep = "var"; jlRajz();
  vj.className = "visszajelzes rossz"; vj.textContent = "Nézzük meg együtt!";
  if (typeof figyelStop === "function") figyelStop();
  zsZsivany("mutat", null, 1600);
  mondd("Nézzük meg együtt!", function () {
    if (!J || J.feladat !== f || JL.f !== f) return;
    mkLejatszik({ klip: FPM_BLN, o: fpmHibaAdat(d, a) }, "„" + a.szoveg + "”", function () {
      if (!J || J.feladat !== f || JL.f !== f) return;
      x.lep = "bln"; JL.rossz = null; jlRajz();
      vj.className = "visszajelzes"; vj.textContent = "Most te: tedd a tálba!";
      mondd(a.szoveg + " Most te: tedd a tálba!");
    });
  });
}

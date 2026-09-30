/* ============ 6i) 🧺 TÜNDÉRVÁSÁR — a 3 mozgókép (rajzterv 6. rész, jóváhagyva 2026-09-30) ============
   A mérés-mozgóképek lejátszóján (meres-mozgo.js mkLejatszik: koppintás = ugrás a végére, „⏭ Átugrom”, a végén magától megy),
   800×420-as színpadon, MINDIG az adott feladat számaival (vasar.js vsMozgoJatszik):
     🏷️ arcedula  — a közös ár érmékben, körbe-körbe kerül a tárgyakra, amíg el nem fogy → „1 darab ennyi”
     🔀 tobbszor  — a szalag-ábra: „-val több” = egy kis darab hozzánő · „-szor annyi” = ugyanaz a szalag megismétlődik
     📦 doboz     — az áru a tartókba potyog; a teli tartók, a maradék, és a „kell még egy” utolsó
   (A 6. o. ⚖️ fordított arányosság csak terv — nincs a játékban.) Minden rajz saját, licenc-kérdés nincs. */
function vsmHatter() {
  return '<defs><linearGradient id="vsm-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dcc0"/><stop offset=".6" stop-color="#f6ead8"/><stop offset="1" stop-color="#e2cfae"/></linearGradient></defs>' +
    '<rect width="800" height="420" fill="url(#vsm-h)"/>' + vsFuzer(10, 800, 16) + '<rect y="386" width="800" height="34" fill="#e2cfae"/><g class="fx"></g>';
}
function vsmT(x, y, t, o) {
  o = o || {};
  return '<text' + (o.cls ? ' class="' + o.cls + '"' : '') + ' x="' + x + '" y="' + y + '" font-size="' + (o.m || 18) + '" ' + VS_F + ' fill="' + (o.szin || "#4a3b7a") + '" text-anchor="' + (o.anchor || "middle") + '" font-weight="' + (o.w || 700) + '"' + (o.op != null ? ' opacity="' + o.op + '"' : '') + '>' + t + '</text>';
}
/* a felosztás „érméi”: a darabonkénti rész (e) legfeljebb 10 körben; egy érme értéke c */
function vsmKorok(e) {
  if (e <= 10) return { R: e, c: 1 };
  for (var R = 10; R >= 2; R--) if (e % R === 0) return { R: R, c: e / R };
  return { R: 1, c: e };
}

/* ═════════════════ 🏷️ SZÉTOSZTÓS ÁRCÉDULA ═════════════════ */
var VSM_ARCEDULA = {
  cim: function (o) { return "🏷️ " + o.T + " Ft · " + o.a + " " + (o.kg ? "kg " : "") + o.A.n; },
  render: function (o) {
    var a = o.a, w = 680 / a, K = vsmKorok(o.e), s = vsmHatter();
    s += '<rect x="310" y="30" width="180" height="46" rx="12" fill="#fde8f2" stroke="#b85a80" stroke-width="2.5"/>' + vsmT(400, 62, o.T + " Ft", { cls: "vsm-ossz", m: 24, szin: "#7a2e55" });
    for (var i = 0; i < a; i++) {
      var x = 60 + w * (i + .5);
      s += vsTargy(o.A, x, 170, Math.min(46, w * .7)) +
        '<rect class="vsm-cd-' + i + '" x="' + (x - 30) + '" y="190" width="60" height="30" rx="8" fill="#fff" stroke="#b85a80" stroke-dasharray="5 3"/>' +
        vsmT(x, 211, "0 Ft", { cls: "vsm-kap-" + i, m: 15, szin: "#7a2e55" });
      for (var r = 0; r < K.R; r++) s += '<g class="vsm-erme vsm-e-' + r + '-' + i + '" opacity="0" transform="translate(400,78)"><circle r="10" fill="#ffd35c" stroke="#c9953a" stroke-width="2"/>' +
        (K.c > 1 ? vsmT(0, 4, K.c, { m: 9, szin: "#6a4a12" }) : '') + '</g>';
    }
    return s;
  },
  play: async function (ctx, svg, fel, o) {
    var a = o.a, w = 680 / a, K = vsmKorok(o.e), marad = o.T, egy = "1 " + (o.kg ? "kg " : "") + o.A.n;
    fel(o.a + " " + (o.kg ? "kg " : "") + o.A.n + " együtt " + o.T + " forint. Szétosztjuk!"); mkMond(ctx, "Szétosztjuk a " + o.T + " forintot, körbe-körbe!");
    await mkVar(ctx, 900);
    for (var r = 0; r < K.R; r++) {
      if (r === 1) fel("Körbe-körbe, mindegyiknek ugyanannyit…");
      var L = [];
      for (var i = 0; i < a; i++) (function (i) {
        var g = mkQ(svg, ".vsm-e-" + r + "-" + i), tx = 60 + w * (i + .5) + (r % 2 ? 8 : -8), ty = 250 + Math.floor(r / 2) * 20;
        mkAttr(g, { opacity: 1 });
        L.push(mkTw(ctx, r < 2 ? 700 : 380, function (p) { mkAttr(g, { transform: "translate(" + mkLerp(400, tx, p) + "," + (mkLerp(78, ty, p) - Math.sin(p * Math.PI) * 40) + ")" }); }));
      })(i);
      await Promise.all(L);
      marad -= K.c * a;
      mkQ(svg, ".vsm-ossz").textContent = marad + " Ft";
      for (var j = 0; j < a; j++) mkQ(svg, ".vsm-kap-" + j).textContent = (K.c * (r + 1)) + " Ft";
      await mkVar(ctx, r < 2 ? 350 : 120);
    }
    fel("…amíg el nem fogy."); await mkVar(ctx, 700);
    for (var k = 0; k < a; k++) { mkAttr(mkQ(svg, ".vsm-cd-" + k), { fill: "#dff3d6", "stroke-dasharray": "", stroke: "#5e9a52" }); mkAttr(mkQ(svg, ".vsm-kap-" + k), { fill: "#2e7d4f" }); }
    mkSzikra(ctx, svg, 400, 205, 10, ["#ffe27a", "#f6a5c0", "#a7d99a", "#fff"]);
    fel("Mindegyiknek " + o.e + " Ft jutott: " + egy + " " + o.e + " forint.   " + o.T + " : " + o.a + " = " + o.e);
    mkMond(ctx, "Mindegyiknek " + o.e + " forint jutott. " + egy + " " + o.e + " forint.", true);
    await mkVar(ctx, 2600);
  }
};

/* ═════════════════ 🔀 TÖBB VAGY -SZOR? ═════════════════ */
var VSM_TOBBSZOR = {
  cim: function (o) { return "🔀 Több vagy -szor?"; },
  render: function (o) {
    var tot = Math.max(o.a * o.k, o.a + o.d), u = 500 / tot, s = vsmHatter(), x0 = 220;
    var egys = (o.egys || "").trim();
    [[o.x, 70], [ekRag(o.d, "val") + " több", 170], [ekRag(o.k, "szor") + " annyi", 270]].forEach(function (r, i) {
      s += vsmT(x0 - 14, r[1] + 26, r[0], { anchor: "end", m: 18, szin: i === 1 ? "#2e7d4f" : i === 2 ? "#6a4fa8" : "#4a3b7a" });
    });
    s += '<rect class="vsm-kiem" x="' + (x0 - 196) + '" y="0" width="' + (560 + 196 - 10) + '" height="56" rx="14" fill="#ffe58a" opacity="0"/>';
    s += '<rect x="' + x0 + '" y="70" width="' + (o.a * u) + '" height="40" rx="8" fill="#fde8f2" stroke="#fff" stroke-width="2"/>' + vsmT(x0 + o.a * u / 2, 97, o.a + (egys ? " " + egys : ""), { m: 17 });
    s += '<g class="vsm-sor2" opacity="0"><rect class="vsm-b2" x="' + x0 + '" y="170" width="0" height="40" rx="8" fill="#dff3d6" stroke="#fff" stroke-width="2"/>' + vsmT(x0 + o.a * u / 2, 197, o.a, { cls: "vsm-t2", m: 17, op: 0 }) +
      '<rect class="vsm-p2" x="' + (x0 + o.a * u) + '" y="170" width="0" height="40" rx="8" fill="#a7d99a" stroke="#fff" stroke-width="2"/>' + vsmT(x0 + o.a * u + Math.max(o.d * u, 34) / 2, 197, "+" + o.d, { cls: "vsm-tp", m: 16, op: 0 }) +
      vsmT(x0 + (o.a + o.d) * u + 14, 197, "= " + (o.a + o.d), { cls: "vsm-e2", anchor: "start", m: 19, szin: "#2e7d4f", op: 0 }) + '</g>';
    s += '<g class="vsm-sor3" opacity="0">';
    for (var i = 0; i < o.k; i++) s += '<rect class="vsm-b3-' + i + '" x="' + (x0 + i * o.a * u) + '" y="270" width="0" height="40" rx="8" fill="#ece2fb" stroke="#fff" stroke-width="2"/>' + vsmT(x0 + (i + .5) * o.a * u, 297, o.a, { cls: "vsm-t3-" + i, m: 17, op: 0 });
    s += vsmT(x0 + o.a * o.k * u + 14, 297, "= " + (o.a * o.k), { cls: "vsm-e3", anchor: "start", m: 19, szin: "#6a4fa8", op: 0 }) + '</g>';
    return s;
  },
  play: async function (ctx, svg, fel, o) {
    var tot = Math.max(o.a * o.k, o.a + o.d), u = 500 / tot, egys = (o.egys || "").trim();
    fel(o.x + ": " + o.a + (egys ? " " + egys : "") + "."); mkMond(ctx, "Nézd meg a két szót: több, és szor!");
    await mkVar(ctx, 1100);
    mkAttr(mkQ(svg, ".vsm-sor2"), { opacity: 1 });
    fel("„" + ekRag(o.d, "val") + " több”: ugyanakkora darab…");
    await mkTw(ctx, 700, function (p) { mkAttr(mkQ(svg, ".vsm-b2"), { width: o.a * u * p }); });
    mkAttr(mkQ(svg, ".vsm-t2"), { opacity: 1 });
    await mkVar(ctx, 300);
    fel("…és hozzánő egy kis darab: " + o.d + ".");
    await mkTw(ctx, 600, function (p) { mkAttr(mkQ(svg, ".vsm-p2"), { width: Math.max(o.d * u, 34) * p }); });
    mkAttr(mkQ(svg, ".vsm-tp"), { opacity: 1 }); mkAttr(mkQ(svg, ".vsm-e2"), { opacity: 1 });
    fel(o.a + " + " + o.d + " = " + (o.a + o.d)); mkMond(ctx, "Több: hozzáteszünk.");
    await mkVar(ctx, 1500);
    mkAttr(mkQ(svg, ".vsm-sor3"), { opacity: 1 });
    fel("„" + ekRag(o.k, "szor") + " annyi”: ugyanaz a szalag…");
    for (var i = 0; i < o.k; i++) {
      var b = mkQ(svg, ".vsm-b3-" + i);
      await mkTw(ctx, i < 2 ? 650 : 380, function (p) { mkAttr(b, { width: o.a * u * p }); });
      mkAttr(mkQ(svg, ".vsm-t3-" + i), { opacity: 1 });
      if (i === o.k - 1) fel("…" + ekRag(o.k, "szor") + " egymás után.");
    }
    mkAttr(mkQ(svg, ".vsm-e3"), { opacity: 1 });
    mkMond(ctx, "Szor: megismételjük.");
    await mkVar(ctx, 900);
    mkAttr(mkQ(svg, ".vsm-kiem"), { y: o.szor ? 262 : 162, opacity: .45 });
    mkSzikra(ctx, svg, 760, o.szor ? 290 : 190, 10, ["#ffe27a", "#f6a5c0", "#a7d99a", "#fff"]);
    fel((o.szor ? o.a + " · " + o.k + " = " + (o.a * o.k) : o.a + " + " + o.d + " = " + (o.a + o.d)) + "   Több: hozzáteszünk. -szor: megismételjük.");
    mkMond(ctx, "Most " + (o.szor ? ekRag(o.k, "szor") + " annyi kell." : ekRag(o.d, "val") + " több kell."), true);
    await mkVar(ctx, 2600);
  }
};

/* ═════════════════ 📦 AZ UTOLSÓ DOBOZ ═════════════════ */
function vsmTarto(cls, x, y, s, ures, id) {
  return '<g class="' + id + '" transform="translate(' + x + ',' + y + ') scale(' + s + ')"' + (ures ? ' opacity=".35"' : '') + '>' + vsTartoAlak(cls, ures) + '</g>';
}
var VSM_DOBOZ = {
  cim: function (o) { return "📦 Az utolsó " + o.T.n; },
  render: function (o) {
    var sok = o.b > 9 || o.n > 60, s = vsmHatter(), db = sok ? Math.min(o.q, 5) : o.q, lep = 700 / (db + (sok ? 2 : 1)), sc = Math.min(.9, lep / 110);
    s += vsmT(400, 58, o.n + " " + o.A.n, { cls: "vsm-szam", m: 22, szin: "#8a5a12" });
    for (var d = 0; d <= db; d++) {
      var x = 50 + d * lep + (sok && d === db ? lep : 0);
      s += vsmTarto(o.T.cls, x, 190, sc, d === db, "vsm-d-" + d);
      if (sok) s += vsmT(x + 50 * sc, 190 + 84 * sc, d === db ? o.r : o.b, { cls: "vsm-dl-" + d, m: 17, op: 0 });
    }
    if (sok && o.q > db) s += vsmT(50 + db * lep + lep / 2, 190 + 70 * sc, "…", { m: 30, szin: "#6a4fa8" });
    if (!sok) for (var i = 0; i < o.n; i++) {
      var dd = Math.floor(i / o.b), j = i % o.b, cols = o.b <= 3 ? o.b : (o.b <= 6 ? 3 : (o.b <= 8 ? 4 : 5)), m = 17;
      var tx = 50 + dd * lep + (50 + ((j % cols) - (cols - 1) / 2) * (m + 1)) * sc, ty = 190 + (110 - Math.floor(j / cols) * (m + 3)) * sc;
      s += '<g class="vsm-a-' + i + '" opacity="0" transform="translate(' + tx.toFixed(1) + ',' + (ty - 120).toFixed(1) + ')">' + vsTargy(o.A, 0, 0, m * sc * 1.2) + '</g>';
    }
    return s;
  },
  play: async function (ctx, svg, fel, o) {
    var sok = o.b > 9 || o.n > 60, db = sok ? Math.min(o.q, 5) : o.q, lep = 700 / (db + (sok ? 2 : 1)), sc = Math.min(.9, lep / 110), szam = mkQ(svg, ".vsm-szam");
    fel(o.n + " " + o.A.n + ", egy " + o.T.ba + " " + o.b + " fér."); mkMond(ctx, "Egy " + o.T.ba + " " + o.b + " fér. Rakjuk bele!");
    await mkVar(ctx, 900);
    if (!sok) {
      for (var i = 0; i < o.n; i++) {
        var g = mkQ(svg, ".vsm-a-" + i), tr = g.getAttribute("transform").match(/translate\(([-\d.]+),([-\d.]+)\)/), tx = +tr[1], ty = +tr[2];
        if (i === o.q * o.b) mkAttr(mkQ(svg, ".vsm-d-" + o.q), { opacity: 1 });
        mkAttr(g, { opacity: 1 });
        await mkTw(ctx, i < o.b ? 260 : 110, function (p) { mkAttr(g, { transform: "translate(" + tx + "," + (ty + 120 * p) + ")" }); }, mkEaseOut);
        szam.textContent = (o.n - i - 1) + " " + o.A.n;
      }
    } else {
      for (var d = 0; d < db; d++) {
        mkAttr(mkQ(svg, ".vsm-dl-" + d), { opacity: 1 });
        szam.textContent = (o.n - (d + 1) * o.b) + " " + o.A.n;
        await mkVar(ctx, 500);
      }
      if (o.q > db) { szam.textContent = o.r + " " + o.A.n; fel("…és így tovább: " + o.q + " " + o.T.n + " telik meg."); await mkVar(ctx, 1200); }
      mkAttr(mkQ(svg, ".vsm-d-" + db), { opacity: 1 }); mkAttr(mkQ(svg, ".vsm-dl-" + db), { opacity: 1 });
    }
    fel(o.q + " " + o.T.n + " megtelt, " + o.r + " " + o.A.n + " kimaradt."); mkMond(ctx, o.q + " " + o.T.n + " megtelt, " + o.r + " kimaradt.");
    await mkVar(ctx, 1600);
    var ut = mkQ(svg, ".vsm-d-" + (sok ? db : o.q));
    ut.querySelectorAll("path,rect").forEach(function (x) { x.setAttribute("stroke", "#e2589b"); });
    mkSzikra(ctx, svg, 50 + (sok ? db * lep + lep : o.q * lep) + 50 * sc, 190, 10, ["#ffe27a", "#f6a5c0", "#fff"]);
    fel(o.q + " teli " + o.T.n + ", " + o.r + " marad — de hogy mind elférjen, " + (o.q + 1) + " " + o.T.n + " kell.");
    mkMond(ctx, "De hogy mind elférjen, " + (o.q + 1) + " " + o.T.n + " kell.", true);
    await mkVar(ctx, 2600);
  }
};
var VSM = { arcedula: VSM_ARCEDULA, tobbszor: VSM_TOBBSZOR, doboz: VSM_DOBOZ };

/* Rajzlap-generátor: a mostani bolt (valódi boltSzinterSVG) és az új polc-szabály makettje.
   Csak a rajzlaphoz — nem játékkód. */
(function () {
  var B = window.__B, KI = [];
  function ki(nev, svg) { KI.push({ nev: nev, svg: svg }); }

  /* ── profil: Ragyogás, kevés holmi, 140 ✨, 18 💧 ── */
  var m = B.mentes();
  m.leny = "ragyogas"; m.hang = false;
  var p = B.P();
  p.csillampor = 140; p.tunderharmat = 18;
  p.kert.nyitva = true;

  /* ═══ 1) MOSTANI Kellékek: minden oldal ═══ */
  B.setFul("kellekek");
  var old = B.boltOldalak();
  old.forEach(function (o, i) {
    var e = o.tetelek[0];
    B.setVal("kellekek", { g: e.cs.kulcs, id: e.t.id });
    ki("most-kellekek-" + (i + 1) + "-" + old.length + "|" + o.nev, B.boltSzinterSVG());
  });
  B.setFul("kert");
  var oldK = B.boltOldalak();
  oldK.forEach(function (o, i) {
    var e = o.tetelek[0];
    B.setVal("kert", { g: e.cs.kulcs, id: e.t.id });
    ki("most-kert-" + (i + 1) + "-" + oldK.length + "|" + o.nev, B.boltSzinterSVG());
  });

  /* ═══ 2) ÚJ: egy polc = egy csoport + „hova kerül" tábla ═══ */
  var FULEK_UJ = [
    { id: "holmik", nev: "Holmik" }, { id: "kinezet", nev: "Kinézet" }, { id: "butorok", nev: "Bútorok" },
    { id: "diszek", nev: "Díszek" }, { id: "ido", nev: "Időjárás" }, { id: "kristaly", nev: "Kristály" }, { id: "kert", nev: "Kert" }
  ];
  /* a hely, ahova a tárgy kerül — odú-koordinátában (680×540) */
  var ODU_FOLT = {
    "b:fal": [340, 215, 250, 120], "b:ablak": [190, 180, 82, 82], "b:fuggony": [190, 176, 96, 88],
    "b:agy": [140, 418, 72, 42], "b:kalyha": [546, 398, 52, 64], "b:polc": [470, 288, 62, 34],
    "b:asztal": [345, 410, 82, 36], "b:szonyeg": [340, 488, 176, 50], "b:fuzer": [340, 128, 250, 34],
    "d:fal-bal": [145, 268, 46, 46], "d:fal-jobb": [500, 205, 46, 46], "d:mennyezet": [410, 128, 52, 42],
    "d:ablak": [205, 200, 64, 78], "d:asztal": [458, 380, 46, 36], "d:polc": [470, 284, 60, 34],
    "d:agy": [145, 398, 64, 36], "d:padlo-bal": [180, 488, 48, 36], "d:padlo-jobb": [510, 488, 48, 36]
  };
  /* testrész az unikornison — figura-koordinátában (380×300) */
  var UNI_FOLT = {
    fej: [292, 92, 56, 50], nyak: [252, 146, 34, 40], hat: [196, 122, 74, 26],
    lab: [190, 252, 110, 42], oldal: [176, 182, 64, 40], farok: [76, 196, 46, 66]
  };
  var tablaSorszam = 0;
  function reflektor(svgBelso, vb, folt) {
    /* a rajz elhalványítva, csak a folt világít + arany gyűrű */
    var id = "rf" + (++tablaSorszam);
    return '<svg x="__X" y="__Y" width="__W" height="__H" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" overflow="hidden">' +
      svgBelso +
      '<defs><mask id="' + id + '"><rect x="-50" y="-50" width="2000" height="2000" fill="#fff"/>' +
      '<ellipse cx="' + folt[0] + '" cy="' + folt[1] + '" rx="' + folt[2] + '" ry="' + folt[3] + '" fill="#000"/></mask></defs>' +
      '<rect x="-50" y="-50" width="2000" height="2000" fill="#4a3b7a" opacity="0.5" mask="url(#' + id + ')"/>' +
      '<ellipse cx="' + folt[0] + '" cy="' + folt[1] + '" rx="' + folt[2] + '" ry="' + folt[3] + '" fill="none" stroke="#ffd24d" stroke-width="' + (vb.indexOf("600") > 0 ? 9 : 6) + '"/>' +
      '</svg>';
  }
  function belsoSvg(h) { return h.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""); }
  function odu(cs) {
    /* a gyerek SAJÁT szobája (mostani berendezés), elsötétítve, a hely kivilágítva */
    var o = JSON.parse(JSON.stringify(p.odu));
    o.napszak = "del";
    if (cs) { o.szint = o.szint || {}; o.szint[cs[0]] = cs[1]; }
    return belsoSvg(B.oduSVG(m.leny, o, true));
  }
  /* a tábla: lógó fakeret a polc bal végén, benne a kis kép */
  function tabla(x, y, w, h, kepTipus, kulcs) {
    var kep;
    if (kepTipus === "odu") kep = reflektor(odu(), "40 70 600 470", ODU_FOLT[kulcs]);
    else if (kepTipus === "uni") kep = reflektor('<rect width="380" height="300" fill="#fdf4e2"/><g transform="translate(190,272) scale(2)">' + B.unikornisSVG("tb" + tablaSorszam, B.LENYEK[m.leny], 1, {}) + '</g>', "0 0 380 300", UNI_FOLT[kulcs]);
    else kep = kepTipus;   /* kész SVG-darab (pl. valuta-jel) */
    var cid = "tk" + (++tablaSorszam), cx = x + w / 2, talp = (arguments[6] || (y + h + 10));
    return '<g class="hova-tabla">' +
      '<ellipse cx="' + cx + '" cy="' + talp + '" rx="10" ry="3" fill="#3b2f66" opacity="0.18"/>' +
      '<rect x="' + (cx - 4) + '" y="' + (y + h) + '" width="8" height="' + (talp - y - h) + '" rx="2" fill="#c19a72" stroke="#8f6a3e" stroke-width="1.2"/>' +
      '<g transform="rotate(-4 ' + cx + ' ' + (y + h / 2) + ')">' +
      '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="' + (w + 12) + '" height="' + (h + 12) + '" rx="12" fill="#f6a5c0" stroke="#d9789f" stroke-width="2.2"/>' +
      '<circle cx="' + (x - 1) + '" cy="' + (y - 1) + '" r="2.2" fill="#fff2c4"/><circle cx="' + (x + w + 1) + '" cy="' + (y - 1) + '" r="2.2" fill="#fff2c4"/>' +
      '<defs><clipPath id="' + cid + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7"/></clipPath></defs>' +
      '<g clip-path="url(#' + cid + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fdf4e2"/>' +
      kep.replace("__X", x).replace("__Y", y).replace("__W", w).replace("__H", h) + '</g>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="none" stroke="#fff2c4" stroke-width="1.6"/>' +
      '</g></g>';
  }
  function valutaKep(v) {
    /* nagy ✨ vagy 💧 a táblán (a Kert fülön a hely helyett a pénz a különbség) */
    var s = '<svg x="__X" y="__Y" width="__W" height="__H" viewBox="0 0 80 64" preserveAspectRatio="xMidYMid slice">';
    if (v === "✨") s += '<rect width="80" height="64" fill="#fff6d8"/><path d="M40 10 l6 15 l15 6 l-15 6 l-6 15 l-6 -15 l-15 -6 l15 -6 Z" fill="#ffd24d" stroke="#e0a82e" stroke-width="2"/><path d="M62 12 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/>';
    else s += '<rect width="80" height="64" fill="#e3f4fd"/><path d="M40 8 Q56 30 56 40 Q56 54 40 54 Q24 54 24 40 Q24 30 40 8 Z" fill="#8fd0f2" stroke="#2f7fa6" stroke-width="2"/><ellipse cx="34" cy="40" rx="4" ry="7" fill="#fff" opacity="0.6"/>';
    return s + '</svg>';
  }

  var POLC_F = 250, POLC_A = 430;
  /* bútor a polcon: a szobának csak az a része, ahol a bútor áll (közeli), nem az egész szoba */
  function kozeliTargy(cs, t, hely, kival) {
    var f = ODU_FOLT["b:" + cs.kulcs], x = hely.x, y = hely.y, emel = kival ? 14 : 0, ty = y - emel;
    var hw = Math.max(f[2] * 1.25, 50), hh = hw * 72 / 76;
    if (hh < f[3] * 1.25) { hh = f[3] * 1.25; hw = hh * 76 / 72; }
    var vb = (f[0] - hw) + " " + (f[1] - hh) + " " + (2 * hw) + " " + (2 * hh);
    var s2 = "";
    if (kival) s2 += '<ellipse cx="' + x + '" cy="' + (ty - 46) + '" rx="54" ry="50" fill="#ffe9ad" opacity="0.5"/>';
    s2 += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="22" ry="4" fill="#3b2f66" opacity="0.15"/>';
    s2 += '<rect x="' + (x - 42) + '" y="' + (ty - 84) + '" width="84" height="84" rx="7" fill="#f7ecd8" stroke="#c9a06a" stroke-width="2.6"/>';
    s2 += '<svg x="' + (x - 38) + '" y="' + (ty - 78) + '" width="76" height="72" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice">' + odu([cs.kulcs, t.id]) + '</svg>';
    if (kival) s2 += '<path d="M' + (x - 34) + ' ' + (ty - 74) + ' l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6 Z" fill="#ffe08a"/>';
    var ar = (t.ar === 0) ? "alap" : (t.ar + " ✨"), w = kival ? 46 : 42;
    s2 += '<g class="bolt-cedula"><path d="M' + x + ' ' + (y + 19) + ' v9" stroke="' + (kival ? "#ffb300" : "#c9a06a") + '" stroke-width="1.6"/>' +
      '<rect x="' + (x - w / 2) + '" y="' + (y + 28) + '" width="' + w + '" height="20" rx="6" fill="' + (kival ? "#fff3cf" : "#fdf4d8") + '" stroke="' + (kival ? "#ffb300" : "#e6d3a8") + '" stroke-width="' + (kival ? 2 : 1.3) + '"/>' +
      '<text x="' + x + '" y="' + (y + 42) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7a5a2a">' + ar + '</text></g>';
    return s2;
  }
  /* felül: tábla + max 4 tárgy; alul (a bagoly mellett): tábla + max 3 tárgy */
  function helyekUj(n, felso) {
    var ki2 = [], i;
    if (felso) for (i = 0; i < n; i++) ki2.push({ x: 228 + i * 88, y: POLC_F, felso: true });
    else for (i = 0; i < n; i++) ki2.push({ x: 320 + i * 86, y: POLC_A, felso: false });
    return ki2;
  }
  /* árcédula-szín a valutához: ✨ = krém/arany (mint most), 💧 = halványkék */
  function cedulaSzinez(s, val) {
    if (val !== "💧") return s;
    return s.replace(/fill="#fdf4d8" stroke="#e6d3a8"/g, 'fill="#e3f4fd" stroke="#8fc6e6"')
            .replace(/fill="#fff3cf" stroke="#ffb300"/g, 'fill="#d4eefc" stroke="#2f7fa6"')
            .replace(/fill="#7a5a2a">(\d+) 💧/g, 'fill="#2f6f96">$1 💧');
  }
  function polcRajz(y) {
    return '<rect x="70" y="' + y + '" width="470" height="13" rx="3" fill="#d9b48a"/>' +
      '<rect x="70" y="' + (y + 13) + '" width="470" height="6" rx="2" fill="#c19a72"/>' +
      '<path d="M100 ' + (y + 19) + ' l0 12 M508 ' + (y + 19) + ' l0 12" stroke="#c19a72" stroke-width="5"/>';
  }

  /* cfg: { ful, felso:{cs, tetelek, tabla:[tipus,kulcs], val}, also:{...}, kival:{cs,t,rang}, lap:"2 / 5", buborek } */
  function ujSzinter(cfg) {
    var s = '<svg class="bolt-szinter-svg" viewBox="0 0 880 520" xmlns="http://www.w3.org/2000/svg">';
    s += '<rect width="880" height="520" fill="#2e2350"/>';
    s += '<path d="M20 520 L20 150 Q20 40 440 24 Q860 40 860 150 L860 520 Z" fill="#b79fd4"/>';
    s += '<path d="M52 520 L52 165 Q52 66 440 52 Q828 66 828 165 L828 520 Z" fill="#cbb6e6"/>';
    s += '<g stroke="#ab90cf" stroke-width="2.5" opacity="0.4" fill="none"><path d="M170 150 Q178 300 170 500"/><path d="M330 130 Q338 300 332 500"/><path d="M620 130 Q613 300 620 500"/><path d="M770 150 Q763 300 770 500"/></g>';
    s += '<path d="M170 84 Q440 112 710 84" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
    s += '<g><path d="M232 96 l14 0 l-7 12 Z" fill="#f6a5c0"/><path d="M286 101 l14 0 l-7 12 Z" fill="#a7d99a"/><path d="M340 104 l14 0 l-7 12 Z" fill="#fce49a"/><path d="M526 104 l14 0 l-7 12 Z" fill="#c3a5e0"/><path d="M580 101 l14 0 l-7 12 Z" fill="#9ec9f0"/><path d="M634 96 l14 0 l-7 12 Z" fill="#f6a5c0"/></g>';
    s += '<rect x="376" y="46" width="128" height="38" rx="10" fill="#a88fce" stroke="#8f7ab8" stroke-width="1.6"/>';
    s += '<text x="440" y="71" font-size="17" font-weight="700" fill="#fdf0d0" text-anchor="middle">Csillagbolt</text>';
    /* 7 fül — kicsit keskenyebb fatáblák, hogy elférjenek */
    FULEK_UJ.forEach(function (f, i) {
      var akt = (f.id === cfg.ful), fx = 58 + i * 74;
      s += '<g' + (akt ? "" : ' opacity="0.62"') + '><path d="M' + (fx + 33) + ' 118 v10" stroke="#8f6a3e" stroke-width="2"/>' +
        '<rect x="' + fx + '" y="128" width="66" height="26" rx="7" fill="' + (akt ? "#e0b47e" : "#d3c0ea") + '" stroke="' + (akt ? "#8f6a3e" : "#a88fce") + '" stroke-width="' + (akt ? 1.8 : 1.5) + '"/>' +
        '<text x="' + (fx + 33) + '" y="146" font-size="11.5" font-weight="700" fill="' + (akt ? "#4a3b2a" : "#6a5f88") + '" text-anchor="middle">' + f.nev + '</text></g>';
    });
    var k = cfg.kival, also = "", idx = 0;
    function tetelek(pc, felso) {
      if (!pc) return "";
      var h = helyekUj(pc.tetelek.length, felso), out = "";
      pc.tetelek.forEach(function (t, i) {
        var kv = !!(k && k.t === t);
        out += cedulaSzinez(pc.cs.fajta === "butor" ? kozeliTargy(pc.cs, t, h[i], kv) : B.boltPolcTargy(pc.cs, t, h[i], kv, idx++), pc.val);
      });
      return out;
    }
    s += polcRajz(POLC_F);
    if (cfg.felso) s += tabla(84, 168, 84, 64, cfg.felso.tabla[0], cfg.felso.tabla[1], POLC_F);
    s += tetelek(cfg.felso, true);
    s += polcRajz(POLC_A);
    s += B.boltBagolySVG(cfg.bagoly || "fel");
    if (cfg.also) also += tabla(194, 370, 70, 50, cfg.also.tabla[0], cfg.also.tabla[1], POLC_A);
    also += tetelek(cfg.also, false);
    s += also;
    var bub = cfg.buborek || "Nézz csak körül nyugodtan!";
    s += '<g class="bolt-buborek"><rect class="bolt-buborek-tabla" x="196" y="300" width="298" height="54" rx="16" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
      '<path class="bolt-buborek-csor" d="M252 352 L226 370 L234 352 Z" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
      '<text class="bolt-buborek-szo" x="345" y="331" font-size="15" font-weight="700" fill="#7a5a2a" text-anchor="middle">' + bub + '</text>' +
      '<text class="bolt-buborek-hang" x="474" y="321" font-size="13" text-anchor="middle" opacity="0.5">🔊</text></g>';
    if (cfg.lap) s += '<g fill="#e0b47e" stroke="#8f6a3e" stroke-width="1.6"><path d="M56 336 l-14 13 l14 13 Z"/><path d="M554 336 l14 13 l-14 13 Z"/></g>';
    s += B.boltCedulaSVG(k);
    s += '<path d="M0 488 Q440 472 880 488 L880 520 L0 520 Z" fill="#c197bf"/>';
    s += '<path d="M0 488 Q440 472 880 488 L880 498 Q440 482 0 498 Z" fill="#d9b8d6"/>';
    s += '<g><path d="M60 500 l3.2 7.6 l7.6 3.2 l-7.6 3.2 l-3.2 7.6 l-3.2 -7.6 l-7.6 -3.2 l7.6 -3.2 Z" fill="#ffd878"/>' +
      '<text x="84" y="513" font-size="15.5" font-weight="800" fill="#fdf0d0">' + p.csillampor + '</text>' +
      (cfg.harmat ? '<text x="140" y="513" font-size="15.5" font-weight="800" fill="#bfe6fb">💧 ' + p.tunderharmat + '</text>' : "") +
      (cfg.lap ? '<text x="440" y="513" font-size="12.5" font-weight="700" fill="#fdf0d0" text-anchor="middle" opacity="0.8">' + cfg.lap + '</text>' : "") + '</g>';
    return s + '</svg>';
  }

  /* — csoportok a mostani adatból — */
  B.setFul("kellekek");
  var kell = B.boltCsoportok();
  var butor = kell.filter(function (c) { return c.fajta === "butor"; });
  var disz = kell.filter(function (c) { return c.fajta === "disz"; }).map(function (c) {
    /* javaslat: az „Üres" nem tárgy, nem áll a polcon (a cédulán „Leszedem" gomb lesz) */
    return { kulcs: c.kulcs, nev: c.nev, fajta: c.fajta, tetelek: c.tetelek.filter(function (t) { return t.id !== "nincs"; }) };
  });
  function pc(cs, tip, kulcs, val) { return { cs: cs, tetelek: cs.tetelek, tabla: [tip, kulcs], val: val }; }
  function kv(cs, i) { return { cs: cs, t: cs.tetelek[i], rang: i }; }
  /* lapolás: egy polc = egy csoport; a 4 tételes csoport a felső polcra kerül */
  function lapol(csk, elo, tip) {
    var lapok = [], maradt = csk.slice();
    while (maradt.length) {
      var f = null, a = null, i;
      for (i = 0; i < maradt.length; i++) if (maradt[i].tetelek.length <= 4) { f = maradt.splice(i, 1)[0]; break; }
      for (i = 0; i < maradt.length; i++) if (maradt[i].tetelek.length <= 3) { a = maradt.splice(i, 1)[0]; break; }
      lapok.push({ f: f, a: a });
    }
    return lapok.map(function (l) { return { felso: l.f && pc(l.f, tip, elo + l.f.kulcs), also: l.a && pc(l.a, tip, elo + l.a.kulcs) }; });
  }
  var butorLapok = lapol(butor, "b:", "odu"), diszLapok = lapol(disz, "d:", "odu");
  KI.push({ nev: "lapolas", svg: JSON.stringify({
    butor: butorLapok.map(function (l) { return [l.felso && l.felso.cs.nev + " (" + l.felso.tetelek.length + ")", l.also && l.also.cs.nev + " (" + l.also.tetelek.length + ")"]; }),
    disz: diszLapok.map(function (l) { return [l.felso && l.felso.cs.nev + " (" + l.felso.tetelek.length + ")", l.also && l.also.cs.nev + " (" + l.also.tetelek.length + ")"]; }),
    mostOldalak: old.map(function (o) { return o.nev + " (" + o.tetelek.length + ")"; })
  }) });

  butorLapok.forEach(function (l, i) {
    var sel = l.felso.cs.tetelek[1] ? kv(l.felso.cs, 1) : kv(l.felso.cs, 0);
    ki("uj-butor-" + (i + 1) + "-" + butorLapok.length, ujSzinter({ ful: "butorok", felso: l.felso, also: l.also, kival: sel, lap: (i + 1) + " / " + butorLapok.length }));
  });
  diszLapok.forEach(function (l, i) {
    var sel = kv(l.felso.cs, 0);
    ki("uj-disz-" + (i + 1) + "-" + diszLapok.length, ujSzinter({ ful: "diszek", felso: l.felso, also: l.also, kival: sel, lap: (i + 1) + " / " + diszLapok.length }));
  });

  /* — Kert: ✨ polc felül (kulcs), 💧 polc alul (trükkök) — */
  B.setFul("kert");
  var kertCs = B.boltCsoportok();
  var kert0 = kertCs[0];
  var csKulcs = { kulcs: "kert", nev: "Kert", fajta: "kert", tetelek: kert0.tetelek.filter(function (t) { return t.id === "kulcs"; }) };
  var csTrukk = { kulcs: "kert", nev: "Kert", fajta: "kert", tetelek: kert0.tetelek.filter(function (t) { return t.id !== "kulcs"; }) };
  ki("uj-kert-1", ujSzinter({ ful: "kert", harmat: true,
    felso: { cs: csKulcs, tetelek: csKulcs.tetelek, tabla: [valutaKep("✨")], val: "✨" },
    also: { cs: csTrukk, tetelek: csTrukk.tetelek.slice(0, 3), tabla: [valutaKep("💧")], val: "💧" },
    kival: { cs: csTrukk, t: csTrukk.tetelek[0], rang: 1 }, lap: "1 / " + (1 + Math.ceil((csTrukk.tetelek.length - 3) / 3) + (kertCs.length - 1)) }));
  KI.push({ nev: "kert-info", svg: JSON.stringify({ trukkok: csTrukk.tetelek.map(function (t) { return t.nev; }), csoportok: kertCs.map(function (c) { return c.nev + " (" + c.tetelek.length + ")"; }) }) });

  /* — Holmik: unikornis-sziluett a táblán — */
  B.setFul("holmik");
  var holm = B.boltCsoportok();
  var hFej = holm.filter(function (c) { return c.kulcs === "fej"; })[0], hNyak = holm.filter(function (c) { return c.kulcs === "nyak"; })[0];
  ki("uj-holmik-1", ujSzinter({ ful: "holmik", felso: pc(hFej, "uni", "fej"), also: pc(hNyak, "uni", "nyak"), kival: kv(hFej, 1), lap: "1 / 3" }));

  /* — a tábla-család: mind a 9 bútor + 9 dísz + 6 testrész, nagyban — */
  var csalad = [];
  B.BUTOR_HELY.forEach(function (h) { csalad.push(["b", h.kulcs, h.nev]); });
  B.DISZ_ZONA.forEach(function (z) { csalad.push(["d", z.kulcs, z.nev]); });
  B.RUHA_HELY.forEach(function (h) { csalad.push(["u", h.kulcs, h.nev]); });
  csalad.forEach(function (c) {
    var t = (c[0] === "u") ? tabla(5, 5, 120, 96, "uni", c[1]) : tabla(5, 5, 120, 96, "odu", c[0] + ":" + c[1]);
    ki("tabla-" + c[0] + "-" + c[1] + "|" + c[2], '<svg viewBox="0 0 130 106" xmlns="http://www.w3.org/2000/svg">' + t + '</svg>');
  });

  /* ── kirakás + igazítás ── */
  var host = document.createElement("div");
  host.id = "kimenet";
  document.body.innerHTML = "";
  document.body.appendChild(host);
  KI.forEach(function (e) {
    var d = document.createElement("div");
    d.className = "ki"; d.setAttribute("data-nev", e.nev);
    if (e.svg.charAt(0) === "<") d.innerHTML = e.svg; else d.textContent = e.svg;
    d.style.width = "880px";
    host.appendChild(d);
    var svg = d.querySelector("svg");
    if (svg) B.boltIgazit(svg);
  });
  document.title = "KESZ " + KI.length;
})();

/* ============ 6f) 📚 BAGOLYKÖNYVTÁR — a 3 bemutató-mozgókép (rajzterv 5. rész, jóváhagyva 2026-09-28) ============
   Kockánként egy, gyerekenként EGYSZER (P().ekLatott[kocka]) — a kocka első feladata előtt (Mesekönyv vagy Varázstekercs,
   amelyiket előbb kezdi). A lejátszó a mérés-mozgóképeké (meres-mozgo.js mkLejatszik: koppintás = ugrás a végére,
   „⏭ Átugrom”, a végén magától továbbmegy). Színpad: 800×420, a gyerek saját unikornisa.
     🔎 K1 nagyító   — elolvassa a történetet, megkeresi a kérdőjelet, bekeretezi, KIRŐL kérdeznek
                       (a rajzterv Röfi-háza helyett kacsák: Röfi a Mesterpróba-feladat, azt nem gyakoroltatjuk előre)
     🔤 K2 „NEM”     — 4 piros lufi; berepül a NEM szó, és a többi 5 lesz a válasz
     ✋ K3 lépcső     — galambok lába → ✋ „Ez még nem a csúcs!” → kutyák lába → összesen a csúcson */
function ekmHatter() {
  var s = '<rect width="800" height="420" fill="#f8ecd9"/>';
  for (var x = 22; x < 800; x += 48) s += '<rect x="' + x + '" y="0" width="4" height="360" fill="rgba(190,140,90,.08)"/>';
  return s + '<rect y="360" width="800" height="60" fill="#e3c29a"/><rect y="356" width="800" height="6" fill="#b98652"/>' + bagolyRajz("konyvtaros", 752, 58, .5);
}
var EKM_F = 'font-family="Fredoka,Segoe UI,sans-serif"';
function ekmUni(id, x, y, s) { return '<g class="' + id + '" transform="translate(' + x + ',' + y + ')">' + mkUni(0, 0, s) + '</g>'; }
function ekmHova(g, x, y, s) { mkAttr(g, { transform: "translate(" + x + "," + y + ")" + (s != null ? " scale(" + s + ")" : "") }); }
/* g mozgatása (x0,y0) → (x1,y1) */
function ekmMegy(ctx, g, x0, y0, x1, y1, ms, s) {
  return mkTw(ctx, ms, function (p) { ekmHova(g, mkLerp(x0, x1, p), mkLerp(y0, y1, p), s); });
}
function ekmErem(cls, x, y, emo, szam, cimke, szin) {
  return '<g class="' + cls + '" transform="translate(' + x + ',' + y + ')"><g class="bel"><circle r="46" fill="#fffaf0" stroke="' + szin + '" stroke-width="5"/>' +
    '<text y="16" font-size="44" text-anchor="middle">' + emo + '</text>' +
    '<circle cx="36" cy="-36" r="19" fill="' + szin + '" stroke="#fff" stroke-width="3"/><text x="36" y="-28" font-size="22" font-weight="800" fill="#fff" text-anchor="middle" ' + EKM_F + '>' + szam + '</text></g>' +
    '<text y="76" font-size="19" font-weight="700" fill="#6a4a3a" text-anchor="middle" ' + EKM_F + '>' + cimke + '</text></g>';
}

/* ═════════════════ 🔎 K1 — a nagyító ═════════════════ */
var EKM_K1 = {
  cim: "🔎 Kit kérdeznek? — a nagyító",
  render: function () {
    return ekmHatter() + ekmUni("ekm-u", 112, 400, .95) +
      ekmErem("ekm-to", 360, 96, "🦆", "8", "a tónál", "#9ec9f0") + ekmErem("ekm-hid", 580, 96, "🦆", "?", "a hídnál", "#6aa9dc") +
      '<rect x="236" y="196" width="540" height="146" rx="16" fill="#fffaf0" stroke="#e2c9a0" stroke-width="3"/>' +
      '<rect class="ekm-sor" x="250" y="288" width="512" height="42" rx="10" fill="#ffe58a" opacity="0"/>' +
      '<text x="256" y="234" font-size="22" fill="#5a4a6a" ' + EKM_F + '>A tónál 8 kacsa úszik.</text>' +
      '<text x="256" y="268" font-size="22" fill="#5a4a6a" ' + EKM_F + '>A hídnál 5-tel több kacsa úszik.</text>' +
      '<text x="256" y="318" font-size="24" font-weight="700" fill="#2f4f7a" ' + EKM_F + '>Hány kacsa úszik <tspan class="ekm-kulcs">a hídnál</tspan>?</text>' +
      '<rect class="ekm-keret" x="0" y="0" width="0" height="0" rx="8" fill="none" stroke="#e2589b" stroke-width="4" opacity="0"/>' +
      '<g class="ekm-nagyito" transform="translate(200,250)"><circle r="28" fill="rgba(200,230,255,.45)" stroke="#8a5a36" stroke-width="6"/><path d="M20 20 L42 42" stroke="#8a5a36" stroke-width="9" stroke-linecap="round"/></g>' +
      '<g class="fx"></g>';
  },
  play: async function (ctx, svg, fel) {
    var n = mkQ(svg, ".ekm-nagyito");
    fel("Olvassuk el a történetet!"); mkMond(ctx, "Olvassuk el a történetet!");
    await ekmMegy(ctx, n, 200, 250, 430, 228, 1100);
    await ekmMegy(ctx, n, 430, 228, 640, 262, 1100);
    await mkVar(ctx, 300);
    fel("Hol a kérdés? Itt a kérdőjel!"); mkMond(ctx, "Hol a kérdés? Itt a kérdőjel!");
    await ekmMegy(ctx, n, 640, 262, 700, 312, 900);
    mkAttr(mkQ(svg, ".ekm-sor"), { opacity: .8 });
    await mkVar(ctx, 1200);
    var t = mkQ(svg, ".ekm-kulcs"), b = t.getBBox(), k = mkQ(svg, ".ekm-keret");
    mkAttr(k, { x: b.x - 6, y: b.y - 3, width: b.width + 12, height: b.height + 8, opacity: 1 }); mkAttr(t, { fill: "#c0306a" });
    await ekmMegy(ctx, n, 700, 312, b.x + b.width / 2 + 34, 350, 700);
    fel("Kiről kérdeznek? A hídnál úszó kacsákról!"); mkMond(ctx, "Kiről kérdeznek? A hídnál úszó kacsákról!");
    await mkVar(ctx, 1400);
    mkAttr(mkQ(svg, ".ekm-to"), { opacity: .35 });
    mkQ(svg, ".ekm-hid .bel").classList.add("ekm-rezeg");
    mkSzikra(ctx, svg, 580, 96, 10, ["#ffe27a", "#9ec9f0", "#f6a5c0", "#fff"]);
    await mkVar(ctx, 900);
    fel("A tónál úszók most nem kellenek. Mindig nézd meg: kiről kérdeznek?");
    mkMond(ctx, "A tónál úszók most nem kellenek. Mindig nézd meg: kiről kérdeznek?", true);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    await mkVar(ctx, 2600);
  }
};

/* ═════════════════ 🔤 K2 — a „NEM” beröppen ═════════════════ */
var EKM_LUFI = [["#f26d7d", "p"], ["#f26d7d", "p"], ["#f26d7d", "p"], ["#f26d7d", "p"], ["#6aa9dc", "m"], ["#6aa9dc", "m"], ["#6aa9dc", "m"], ["#f5c84c", "m"], ["#f5c84c", "m"]];
var EKM_K2 = {
  cim: "🔤 Kis szavak — a „NEM” beröppen",
  render: function () {
    var s = ekmHatter() + ekmUni("ekm-u", 112, 400, .95);
    EKM_LUFI.forEach(function (l, i) {
      s += '<g class="ekm-lf ekm-lf-' + l[1] + '" transform="translate(' + (262 + i * 54) + ',' + (104 + (i % 2) * 16) + ')"><g class="lfb">' +
        '<path d="M0 34 Q6 60 -4 86" stroke="#8a7ba8" stroke-width="1.5" fill="none"/><ellipse cx="0" cy="0" rx="23" ry="29" fill="' + l[0] + '"/>' +
        '<ellipse cx="-8" cy="-10" rx="6" ry="9" fill="#fff" opacity=".5"/><path d="M-4 29 L4 29 L0 35Z" fill="' + l[0] + '"/></g></g>';
    });
    return s + '<rect x="236" y="244" width="540" height="70" rx="16" fill="#eef6ff" stroke="#9ec9f0" stroke-width="3"/>' +
      '<text class="ekm-m1" x="506" y="288" font-size="28" font-weight="700" fill="#2f4f7a" text-anchor="middle" ' + EKM_F + '>Hány piros lufi van?</text>' +
      '<text class="ekm-m2" x="506" y="288" font-size="28" font-weight="700" fill="#2f4f7a" text-anchor="middle" opacity="0" ' + EKM_F + '>Hány <tspan class="ekm-nem" fill="#c0306a">NEM</tspan> piros lufi van?</text>' +
      '<g class="ekm-szamlalo" opacity="0"><circle cx="186" cy="84" r="32" fill="#fff3cf" stroke="#e8b43a" stroke-width="3"/><text class="ekm-szamt" x="186" y="96" font-size="32" font-weight="800" fill="#4a3b7a" text-anchor="middle" ' + EKM_F + '>4</text></g>' +
      '<g class="ekm-repul" transform="translate(506,-60)"><rect x="-40" y="-24" width="80" height="42" rx="12" fill="#fde3e8" stroke="#e2589b" stroke-width="3"/><text x="0" y="8" font-size="25" font-weight="800" fill="#c0306a" text-anchor="middle" ' + EKM_F + '>NEM</text></g>' +
      '<g class="fx"></g>';
  },
  play: async function (ctx, svg, fel) {
    var P_ = mkQQ(svg, ".ekm-lf-p"), M_ = mkQQ(svg, ".ekm-lf-m"), sz = mkQ(svg, ".ekm-szamlalo");
    function pulz(l, be) { l.forEach(function (g) { mkQ(g, ".lfb").classList.toggle("ekm-pulzal", be); }); }
    fel("Hány piros lufi van?"); mkMond(ctx, "Hány piros lufi van?");
    await mkVar(ctx, 1500);
    pulz(P_, true); M_.forEach(function (g) { mkAttr(g, { opacity: .3 }); }); mkAttr(sz, { opacity: 1 });
    fel("Négy piros lufi."); mkMond(ctx, "Négy piros lufi.");
    await mkVar(ctx, 2200);
    M_.forEach(function (g) { mkAttr(g, { opacity: 1 }); }); mkAttr(sz, { opacity: 0 }); pulz(P_, false);
    fel("De most berepül egy kis szó…"); mkMond(ctx, "De most berepül egy kis szó!");
    var nb = mkQ(svg, ".ekm-nem").getBBox(), r = mkQ(svg, ".ekm-repul");
    await ekmMegy(ctx, r, 506, -60, nb.x + nb.width / 2, 286, 1300);
    await mkVar(ctx, 300);
    mkAttr(r, { opacity: 0 }); mkAttr(mkQ(svg, ".ekm-m1"), { opacity: 0 }); mkAttr(mkQ(svg, ".ekm-m2"), { opacity: 1 });
    fel("Hány NEM piros lufi van?"); mkMond(ctx, "Hány nem piros lufi van?");
    mkSzikra(ctx, svg, nb.x + nb.width / 2, 276, 10, ["#f6a5c0", "#ffe27a", "#fff"]);
    await mkVar(ctx, 1600);
    P_.forEach(function (g) { mkAttr(g, { opacity: .25 }); }); pulz(M_, true);
    mkQ(svg, ".ekm-szamt").textContent = "5"; mkAttr(sz, { opacity: 1 });
    fel("Most a többi számít: öt lufi. Egy kis szó — és más a válasz!");
    mkMond(ctx, "Most a többi számít: öt lufi. Egy kis szó, és más a válasz!", true);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    await mkVar(ctx, 2800);
  }
};

/* ═════════════════ ✋ K3 — a lépcső a csúcsig ═════════════════ */
var EKM_FOK = [[290, 318, "galambok lába", "16"], [460, 258, "kutyák lába", "12"], [630, 198, "összesen", "28"]];
var EKM_K3 = {
  cim: "✋ Ez már a válasz? — a lépcső a csúcsig",
  render: function () {
    var s = ekmHatter();
    EKM_FOK.forEach(function (f, i) {
      s += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + (760 - f[0]) + '" height="' + (360 - f[1]) + '" fill="' + ["#c8e8c0", "#a7d99a", "#8cc585"][i] + '" stroke="#6fb36a" stroke-width="2.5"/>' +
        '<g class="ekm-fc' + i + '" opacity="0"><rect x="' + (f[0] + 10) + '" y="' + (f[1] + 8) + '" width="150" height="46" rx="10" fill="#fffaf0" stroke="#e2c9a0" stroke-width="2"/>' +
        '<text x="' + (f[0] + 85) + '" y="' + (f[1] + 27) + '" font-size="14" fill="#6a4a3a" text-anchor="middle" ' + EKM_F + '>' + f[2] + '</text>' +
        '<text x="' + (f[0] + 85) + '" y="' + (f[1] + 48) + '" font-size="20" font-weight="800" fill="#4a3b7a" text-anchor="middle" ' + EKM_F + '>' + f[3] + '</text></g>';
    });
    return s + '<path d="M740 198 V120" stroke="#6b5442" stroke-width="4"/><path d="M740 122 L784 134 L740 146Z" fill="#e2589b"/>' +
      '<text x="250" y="48" font-size="21" fill="#5a4a6a" ' + EKM_F + '>Az udvaron 8 galamb és 3 kutya van.</text>' +
      '<text x="250" y="84" font-size="24" font-weight="700" fill="#2f4f7a" ' + EKM_F + '>Hány láb van <tspan fill="#c0306a">összesen</tspan>?</text>' +
      ekmUni("ekm-u", 130, 360, .62) +
      '<g class="ekm-kez" transform="translate(420,190) scale(0)"><circle r="44" fill="#fde3e8" stroke="#e07aa0" stroke-width="5"/><text y="14" font-size="42" text-anchor="middle">✋</text><rect x="-8" y="44" width="16" height="50" fill="#b07a4c"/></g>' +
      '<g class="ekm-kezsz" opacity="0"><rect x="480" y="112" width="220" height="42" rx="12" fill="#fff" stroke="#e07aa0" stroke-width="2.5"/><text x="590" y="140" font-size="19" font-weight="700" fill="#c0306a" text-anchor="middle" ' + EKM_F + '>Ez még nem a csúcs!</text></g>' +
      '<g class="fx"></g>';
  },
  play: async function (ctx, svg, fel) {
    var u = mkQ(svg, ".ekm-u"), kez = mkQ(svg, ".ekm-kez"), kezsz = mkQ(svg, ".ekm-kezsz");
    fel("Első lépcsőfok: a galambok lába."); mkMond(ctx, "Első lépcsőfok: a galambok lába.");
    await ekmMegy(ctx, u, 130, 360, 360, 318, 1100);
    mkAttr(mkQ(svg, ".ekm-fc0"), { opacity: 1 });
    await mkVar(ctx, 1200);
    await mkTw(ctx, 350, function (p) { ekmHova(kez, 420, 190, p); }, mkEaseBack);
    mkAttr(kezsz, { opacity: 1 });
    fel("Ez már a válasz? Nem! Ez még nem a csúcs!"); mkMond(ctx, "Ez már a válasz? Nem! Ez még nem a csúcs!");
    await mkVar(ctx, 2300);
    ekmHova(kez, 420, 190, 0); mkAttr(kezsz, { opacity: 0 });
    fel("Második lépcsőfok: a kutyák lába."); mkMond(ctx, "Második lépcsőfok: a kutyák lába.");
    await ekmMegy(ctx, u, 360, 318, 530, 258, 1100);
    mkAttr(mkQ(svg, ".ekm-fc1"), { opacity: 1 });
    await mkVar(ctx, 1300);
    fel("És a csúcs: összesen huszonnyolc!"); mkMond(ctx, "És a csúcs: összesen huszonnyolc!");
    await ekmMegy(ctx, u, 530, 258, 700, 198, 1100);
    var fc2 = mkQ(svg, ".ekm-fc2"); mkAttr(fc2, { opacity: 1 }); fc2.classList.add("ekm-pulzal");
    mkSzikra(ctx, svg, 715, 170, 12, ["#ffe27a", "#a7d99a", "#f6a5c0", "#fff"]);
    mkUgrik(ctx, svg, 16).then(function () { return mkUgrik(ctx, svg, 10); }).catch(function () {});
    await mkVar(ctx, 1400);
    fel("Csak a csúcson állunk meg — ott van a válasz."); mkMond(ctx, "Csak a csúcson állunk meg: ott van a válasz.", true);
    await mkVar(ctx, 2400);
  }
};

var EK_MOZGO = { K1: EKM_K1, K2: EKM_K2, K3: EKM_K3 };
/* a kocka első feladata ELŐTT (engine-logic ujFeladat): true = most fut a bemutató, a tovabb() a végén mutatja a feladatot */
function ekElottKell(f, tovabb) {
  if (!f || !f.ek || f.vezet || !J || !J.palya || !J.palya.konyvtar) return false;
  var k = J.palya.kocka, p = P();
  if (!EK_MOZGO[k]) return false;
  p.ekLatott = p.ekLatott || {};
  if (p.ekLatott[k]) return false;
  p.ekLatott[k] = 1; ment();
  mkLejatszik({ klip: EK_MOZGO[k] }, EK_MOZGO[k].cim, tovabb);
  return true;
}

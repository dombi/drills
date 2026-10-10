/* ============ 6f) 📚 BAGOLYKÖNYVTÁR — a két olvasó-polc bemutató-mozgóképe (4. kód-kör, 2026-10-10) ============
   Rajz: Matekos
egi-kockak-konyvtar-rajzterv.html 6. pont (✅): legfeljebb kb. 15 mp, három 4 mp-es jelenet, aztán a ZÁRÓKÉP:
   a polc névtáblája nagyban + a célmondat (kimondva is), és megáll az „Indulhatunk! ➜” gombnál (nem megy tovább magától).
     🔎 K1 nagyító — a mese → hol a „?” → kiről kérdeznek? (kacsák; Röfi a Mesterpróba-feladat, azt nem gyakoroltatjuk előre)
     ✋ K3 lépcső  — galambok lába → ✋ „Ez még nem a csúcs!” → kutyák lába → összesen a csúcson
   A 🔤 „NEM”-es mozgókép kimaradt (a 🔤 polc megszűnt). Magától csak a polc 📖 Mesekönyvének első feladata előtt indul,
   gyerekenként egyszer (P().bktLatott[polc]); utána a teremben a polc névtáblájára koppintva bármikor újranézhető (bktMozgoNez).
   A lejátszó a mérés-mozgóképeké (meres-mozgo.js mkLejatszik; klip.megall: a „⏭ Átugrom” jobb fent, a végén koppintásra vár);
   koppintás a képre = ugrás a záróképre. Színpad: 800×420, a gyerek saját unikornisa. */
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

/* a zárókép: a polc névtáblája nagyban + a célmondat — minden mozgókép ide fut ki (render: rejtve, ekmZaro: megjelenik) */
function ekmZaroSVG(polc) {
  var d = polcIdx(polc) || { ikon: "📚", nev: "", kartya: "" }, j = d.kartya.indexOf(" – "), m;
  if (j > 0) m = [d.kartya.slice(0, j + 2), d.kartya.slice(j + 3)];          /* két sorba: a gondolatjel / kettőspont után törik */
  else { j = d.kartya.indexOf(": "); m = j > 0 ? [d.kartya.slice(0, j + 1), d.kartya.slice(j + 2)] : [d.kartya]; }
  return '<g class="ekm-zaro" opacity="0"><rect width="800" height="420" fill="#f8ecd9"/><rect y="360" width="800" height="60" fill="#e3c29a"/>' +
    '<rect x="230" y="70" width="460" height="128" rx="20" fill="#c99a6a" stroke="#8a6140" stroke-width="5"/>' +
    '<rect x="244" y="84" width="432" height="100" rx="14" fill="#fff3d6"/>' +
    '<text x="460" y="152" font-size="46" font-weight="800" fill="#6a4a3a" text-anchor="middle" ' + EKM_F + '>' + d.ikon + ' ' + d.nev + '</text>' +
    '<path d="M330 70 L310 30 M590 70 L610 30" stroke="#8a6140" stroke-width="5"/>' +
    '<text x="460" y="262" font-size="30" font-weight="700" fill="#4a3b7a" text-anchor="middle" ' + EKM_F + '>' + m[0] + '</text>' +
    (m.length > 1 ? '<text x="460" y="304" font-size="30" font-weight="700" fill="#4a3b7a" text-anchor="middle" ' + EKM_F + '>' + m[1] + '</text>' : '') +
    ekmUni("ekm-zu", 120, 400, .9) + '</g>';
}
async function ekmZaro(ctx, svg, fel, polc) {
  var d = polcIdx(polc) || { kartya: "" };
  mkAttr(mkQ(svg, ".ekm-zaro"), { opacity: 1 });
  fel(d.kartya); mkMond(ctx, d.kartya, true);       /* a célmondatot az átugró gyerek is hallja */
  mkSzikra(ctx, svg, 460, 130, 10, ["#ffe27a", "#f6a5c0", "#9ec9f0", "#fff"]);
  await mkVar(ctx, 400);
}

/* ═════════════════ 🔎 K1 — a nagyító (a mese 4 mp · a „?” 4 mp · kiről? 4 mp · zárókép) ═════════════════ */
var EKM_K1 = {
  cim: "🔎 Mire felelsz?", megall: true, gombVege: "Indulhatunk! ➜",
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
      ekmZaroSVG("KERES") + '<g class="fx"></g>';
  },
  play: async function (ctx, svg, fel) {
    var n = mkQ(svg, ".ekm-nagyito");
    fel("Olvassuk el a mesét!"); mkMond(ctx, "Olvassuk el a mesét!");
    await ekmMegy(ctx, n, 200, 250, 640, 262, 1500);
    await mkVar(ctx, 800);
    fel("Hol a kérdőjel? Ott a kérdés!"); mkMond(ctx, "Hol a kérdőjel? Ott a kérdés!");
    await ekmMegy(ctx, n, 640, 262, 700, 312, 700);
    mkAttr(mkQ(svg, ".ekm-sor"), { opacity: .8 });
    await mkVar(ctx, 1600);
    var t = mkQ(svg, ".ekm-kulcs"), b = t.getBBox(), k = mkQ(svg, ".ekm-keret");
    mkAttr(k, { x: b.x - 6, y: b.y - 3, width: b.width + 12, height: b.height + 8, opacity: 1 }); mkAttr(t, { fill: "#c0306a" });
    mkAttr(mkQ(svg, ".ekm-to"), { opacity: .35 });
    mkQ(svg, ".ekm-hid .bel").classList.add("ekm-rezeg");
    fel("Kiről kérdeznek? A hídnál úszó kacsákról!"); mkMond(ctx, "Kiről kérdeznek? A hídnál úszó kacsákról!");
    await ekmMegy(ctx, n, 700, 312, b.x + b.width / 2 + 34, 350, 600);
    mkSzikra(ctx, svg, 580, 96, 10, ["#ffe27a", "#9ec9f0", "#f6a5c0", "#fff"]);
    await mkVar(ctx, 1700);
    await ekmZaro(ctx, svg, fel, "KERES");
  }
};

/* ═════════════════ ✋ K3 — a lépcső a csúcsig (galambok 4 mp · ✋ 4 mp · kutyák → csúcs 4 mp · zárókép) ═════════════════ */
var EKM_FOK = [[290, 318, "galambok lába", "16"], [460, 258, "kutyák lába", "12"], [630, 198, "összesen", "28"]];
var EKM_K3 = {
  cim: "✋ Ez már a válasz?", megall: true, gombVege: "Indulhatunk! ➜",
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
      ekmZaroSVG("VALASZ") + '<g class="fx"></g>';
  },
  play: async function (ctx, svg, fel) {
    var u = mkQ(svg, ".ekm-u"), kez = mkQ(svg, ".ekm-kez"), kezsz = mkQ(svg, ".ekm-kezsz");
    fel("Első lépcsőfok: a galambok lába."); mkMond(ctx, "Első lépcsőfok: a galambok lába.");
    await ekmMegy(ctx, u, 130, 360, 360, 318, 1000);
    mkAttr(mkQ(svg, ".ekm-fc0"), { opacity: 1 });
    await mkVar(ctx, 1300);
    await mkTw(ctx, 350, function (p) { ekmHova(kez, 420, 190, p); }, mkEaseBack);
    mkAttr(kezsz, { opacity: 1 });
    fel("Ez már a válasz? Nem! Ez még nem a csúcs!"); mkMond(ctx, "Ez már a válasz? Nem! Ez még nem a csúcs!");
    await mkVar(ctx, 1950);
    ekmHova(kez, 420, 190, 0); mkAttr(kezsz, { opacity: 0 });
    fel("A kutyák lába, és fel a csúcsra: összesen huszonnyolc!"); mkMond(ctx, "A kutyák lába, és fel a csúcsra: összesen huszonnyolc!");
    await ekmMegy(ctx, u, 360, 318, 530, 258, 700);
    mkAttr(mkQ(svg, ".ekm-fc1"), { opacity: 1 });
    await mkVar(ctx, 300);
    await ekmMegy(ctx, u, 530, 258, 700, 198, 700);
    var fc2 = mkQ(svg, ".ekm-fc2"); mkAttr(fc2, { opacity: 1 }); fc2.classList.add("ekm-pulzal");
    mkSzikra(ctx, svg, 715, 170, 12, ["#ffe27a", "#a7d99a", "#f6a5c0", "#fff"]);
    await mkVar(ctx, 900);
    await ekmZaro(ctx, svg, fel, "VALASZ");
  }
};

var EK_MOZGO = { KERES: EKM_K1, VALASZ: EKM_K3 };   /* polc → mozgókép (a 🔤 K2 kimaradt) */
/* a polc 📖 Mesekönyvének első feladata ELŐTT (engine-logic ujFeladat), gyerekenként egyszer: true = most fut, a tovabb() a végén */
function ekElottKell(f, tovabb) {
  if (!f || f.vezet || !J || !J.palya || !J.palya.polc || J.palya.fok !== "mese") return false;   /* folytatásnál is (aki a mozgókép előtt kezdte) */
  var polc = J.palya.polc, p = P();
  if (!EK_MOZGO[polc]) return false;
  p.bktLatott = p.bktLatott || {};
  if (p.bktLatott[polc]) return false;
  p.bktLatott[polc] = 1; ment();
  mkLejatszik({ klip: EK_MOZGO[polc] }, EK_MOZGO[polc].cim, tovabb);
  return true;
}
/* a teremben: koppintás a polc névtáblájára → a mozgókép újra (szerszam-polc.js szpBekot) */
function bktMozgoNez(polc) {
  if (!EK_MOZGO[polc]) return false;
  mkLejatszik({ klip: EK_MOZGO[polc] }, EK_MOZGO[polc].cim, function () {});
  return true;
}

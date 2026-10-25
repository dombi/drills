/* ============ 10g2) 📸 FOTÓALBUM: a gyerek saját albuma (borító + lapok), szabad elrendezés felvesz–letesz módon ============
   Tervlap 3.d + rajzterv 4–6 (✅ 2026-10-25). Az odúban a polcon a könyv (fotoOduKonyv), rajta a gyerek borítója kicsiben.
   • Az album a GYEREKÉ, magának csinálja: nincs automatikus felirat, nincs értékelés, osztály/szint/eredmény sehol.
   • A lap 420 × 315; az első lap a „Borító” (5 vászonszín), utána a lapok (3 háttér). Új lap bármikor, ingyen.
   • Tálca 7 füllel: 🖼️ Fotóim · 🐉 Matricák · 🃏 Kártyáim · 💌 Képeslapok · ⭐ Díszek · Aa Felirat · 🎨 Háttér.
     Koppint a tálcán → az elem a mutatóhoz tapad (felvesz.js fvPont) → koppint a lapon → ott marad. Húzni nem kell.
   • A lapon lévő elemre koppintva gombsor: ↻ forgat · ＋/－ méret · ⬆ előre · ✋ áthelyez · ↩ vissza a tálcára (+ fotónál 🖼️ keret).
   • A kártyák és képeslapok másolatként kerülnek a lapra (az eredeti helyükről nem tűnnek el).
   • A FOTÓ viszont, mint egy igazi kép, elfogy: ami már valamelyik lapon van, az nem látszik a Fotóim között; ↩-val
     (vagy a lap törlésével) visszakerül (producer, 10-25). Ezt nem tároljuk külön, a lapokból számoljuk (albumFotoBent).
   • ⬇️ Letöltés: a lap PNG-képként (beágyazott Fredoka betűvel, ha elérhető). 🗑️ lap törlése: „Biztos?”.
   Adat: P().foto.lapok = [{ borito?: 1, hatter, elemek: [{ tip, ref, x, y, rot, m, keret?, szoveg?, szin?, meret? }] }]
   (a rajzolás sorrendje = a tömb sorrendje; ⬆ a végére teszi). */
var ALB = null;   /* a nyitott album: { lap, ful, fog: { elem, i? }, kival, fedo, svg, mut: {x,y} } */
var ALB_FULEK = [
  { id: "foto", nev: "🖼️ Fotóim" }, { id: "matrica", nev: "🐉 Matricák" }, { id: "kartya", nev: "🃏 Kártyáim" }, { id: "lap", nev: "💌 Képeslapok" },
  { id: "disz", nev: "⭐ Díszek" }, { id: "felirat", nev: "Aa Felirat" }, { id: "hatter", nev: "🎨 Háttér" }
];
var ALB_FELIRAT = { szoveg: "", szin: ALBUM_FELIRAT_SZIN[0], meret: 2 };
var ALB_KONYV = [316, 536];   /* a könyv helye az odúban (talppont): a 📒 Képeslapok (LENY_ODU.album, x 262) jobbján, mint a rajzterven */

function albumAlap(f) {
  if (!f.lapok.length) f.lapok = [{ borito: 1, hatter: "menta", elemek: [] }, { hatter: "potty", elemek: [] }];
}

/* ═════════════════ RAJZ ═════════════════ */
/* az azonosítók egyedivé tétele egy beágyazott rajzban (a kártyák/képeslapok saját defs-ei ne ütközzenek) */
function albumIdEgyedi(s, elo) {
  var idk = {};
  s.replace(/\sid="([^"]+)"/g, function (m, x) { idk[x] = 1; return m; });
  return s.replace(/(id="|#)([A-Za-z_][\w.:-]*)/g, function (m, p, x) { return idk[x] ? p + elo + x : m; });
}
function albumKartyak() {   /* a gyerek megszerzett kártyái: holmik, kristályok, jelvények */
  var p = P(), ki = [];
  RUHA_HELY.forEach(function (h) { (RUHAK[h.kulcs] || []).forEach(function (t) { if (p.oltozet.van[t.id]) ki.push({ ref: "r:" + h.kulcs + ":" + t.id, nev: t.nev }); }); });
  KRISTALY.forEach(function (t) { if (p.odu.vitrin[t.id]) ki.push({ ref: "k:" + t.id, nev: t.nev }); });
  JELVENYEK.forEach(function (j) { if (p.jelvenyek[j.id]) ki.push({ ref: "j:" + j.id, nev: j.nev }); });
  return ki;
}
function albumKartyaRajz(ref) {
  var r = String(ref).split(":"), kep = "", nev = "";
  if (r[0] === "r") {
    var t = (RUHAK[r[1]] || []).filter(function (x) { return String(x.id) === r[2]; })[0];
    if (t) { kep = boltThumb({ fajta: "ruha", kulcs: r[1] }, t); nev = t.nev; }
  } else if (r[0] === "k") {
    var k = KRISTALY.filter(function (x) { return String(x.id) === r[1]; })[0];
    if (k) { kep = boltThumb({ fajta: "vitrin" }, k); nev = k.nev; }
  } else if (r[0] === "j") {
    var j = JELVENYEK.filter(function (x) { return x.id === r[1]; })[0];
    if (j) { kep = jelvenyMedalSVG(j, true); nev = j.nev; }
  }
  kep = kep.replace(/^\s*<svg/, '<svg x="-25" y="-35" width="50" height="50"');
  return '<g filter="url(#ae-arnyek)"><rect x="-30" y="-40" width="60" height="80" rx="6" fill="#fff3c4" stroke="#e0a800" stroke-width="1.6"/></g>' + kep +
    '<text y="29" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="7.5" font-weight="600" fill="#8a6a00">' + kiiras(String(nev).slice(0, 18)) + '</text>';
}
/* egy elem belseje (a közép a 0,0); kep = { id: dataURL } */
function albumElemBelso(e, kep) {
  if (e.tip === "foto") {
    var d = kep[e.ref], w = 140, h = 105;
    var img = d ? '<image href="' + d + '" x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid slice"/>'
                : '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" fill="#efe8f6"/>';
    return albumKeret(e.keret || "polaroid").rajz(img, w, h);
  }
  if (e.tip === "matrica") {
    var m = albumMatricaMeret(e.ref), dm = kep[e.ref];
    return dm ? '<image href="' + dm + '" x="' + (-m.w / 2) + '" y="' + (-m.h / 2) + '" width="' + m.w + '" height="' + m.h + '" filter="url(#ae-matrica)"/>'
              : '<rect x="' + (-m.w / 2) + '" y="' + (-m.h / 2) + '" width="' + m.w + '" height="' + m.h + '" rx="10" fill="#efe8f6"/>';
  }
  if (e.tip === "kartya") return albumKartyaRajz(e.ref);
  if (e.tip === "lap") return '<g filter="url(#ae-arnyek)">' + kalandLapSVG(e.ref).replace(/^\s*<svg/, '<svg x="-64" y="-42" width="128" height="84"') + '</g>';
  if (e.tip === "disz") return '<g transform="scale(1.7)">' + albumDiszRajz(e.ref, e.szoveg) + '</g>';
  if (e.tip === "felirat") {
    var px = (ALBUM_FELIRAT_MERET.filter(function (x) { return x.id === e.meret; })[0] || ALBUM_FELIRAT_MERET[1]).px;
    return '<text y="' + (px * .35) + '" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="' + px + '" font-weight="600" fill="' + (e.szin || "#3f8a68") + '">' + kiiras(e.szoveg || "") + '</text>';
  }
  return "";
}
function albumMatricaMeret(id) {
  var k = (P().foto.kepek || []).filter(function (x) { return x.id === id; })[0] || { w: 100, h: 100 }, s = 110 / Math.max(k.w, k.h);
  return { w: k.w * s, h: k.h * s };
}
function albumElemG(e, i, kep, extra) {
  return '<g class="alb-elem" data-i="' + i + '" transform="translate(' + pcF(e.x) + ' ' + pcF(e.y) + ') rotate(' + pcF(e.rot || 0) + ') scale(' + pcF(e.m || 1) + ')"' + (extra || "") + '>' +
    albumIdEgyedi(albumElemBelso(e, kep), "a" + i + "-") + '</g>';
}
/* a lap teljes belseje (defs + háttér + elemek) — a szerkesztő, a könyv és a letöltés is ezt rajzolja */
function albumLapBelso(lap, kep, rejt) {
  var s = '<defs>' + ALBUM_DEFS + '</defs>' + albumHatterRajz(lap);
  lap.elemek.forEach(function (e, i) { if (i !== rejt) s += albumElemG(e, i, kep); });
  return s;
}
function albumFotoBent() {   /* a lapokon már bent lévő fotók: { id: 1 } */
  var bent = {};
  P().foto.lapok.forEach(function (l) { l.elemek.forEach(function (e) { if (e.tip === "foto") bent[e.ref] = 1; }); });
  return bent;
}
function albumLapKepIdk(lap) { return lap.elemek.filter(function (e) { return e.tip === "foto" || e.tip === "matrica"; }).map(function (e) { return e.ref; }); }

/* ═════════════════ 📖 A KÖNYV AZ ODÚBAN ═════════════════ */
function fotoOduKonyv(svg) {
  var f = P().foto;
  if (!svg || !f || !f.gep) return;
  albumAlap(f);
  var b = f.lapok[0], kep = {}, hiany = [];
  albumLapKepIdk(b).forEach(function (id) { var d = fotoKepCache(id); if (d) kep[id] = d; else hiany.push(id); });
  var regi = svg.querySelector("#foto-konyv"); if (regi) regi.remove();
  svg.insertAdjacentHTML("beforeend", fotoKonyvSVG(ALB_KONYV[0], ALB_KONYV[1], albumVaszon(b.hatter), albumIdEgyedi(albumLapBelso(b, kep), "ok-"), !b.elemek.length));
  svg.querySelector("#foto-konyv").addEventListener("click", function (e) { e.stopPropagation(); hangGomb(); albumNyit(); });
  if (hiany.length) fotoKepekKer(hiany, function (m) { if (Object.keys(m).length && svg.isConnected) fotoOduKonyv(svg); });
}

/* ═════════════════ A SZERKESZTŐ ═════════════════ */
function albumNyit() {
  var f = fotoTar(); if (!f.gep) return;
  albumAlap(f);
  var d = document.getElementById("album-fedo");
  if (!d) { d = document.createElement("div"); d.id = "album-fedo"; document.body.appendChild(d); }
  d.className = "album-fedo"; d.hidden = false;
  d.innerHTML = '<div class="alb-ablak"><div class="alb-fej">' +
    '<button class="kt-gomb" id="alb-zar">← Odú</button><b class="alb-cim">📸 Fotóalbum</b>' +
    '<span class="alb-lapozo"><button class="kt-gomb" id="alb-elo" aria-label="Előző lap">◀</button><span id="alb-lapszam"></span><button class="kt-gomb" id="alb-kov" aria-label="Következő lap">▶</button></span>' +
    '<span class="alb-fej-jobb"><button class="kt-gomb" id="alb-uj">＋ Új lap</button><button class="kt-gomb" id="alb-le" aria-label="Letöltés">⬇️</button><button class="kt-gomb" id="alb-torol" aria-label="Lap törlése">🗑️</button></span></div>' +
    '<div class="alb-test"><div class="alb-lap-hely" id="alb-lap-hely"><svg id="alb-lap" class="alb-lap" viewBox="0 0 ' + ALBUM_W + ' ' + ALBUM_H + '" xmlns="http://www.w3.org/2000/svg"></svg>' +
    '<div class="alb-gombsor" id="alb-gombsor" hidden></div></div>' +
    '<div class="alb-talca"><div class="alb-fulek" id="alb-fulek"></div><div class="alb-racs" id="alb-racs"></div></div></div></div>';
  ALB = { lap: 0, ful: "foto", fog: null, kival: null, fedo: d, svg: d.querySelector("#alb-lap"), kep: {} };
  d.querySelector("#alb-zar").addEventListener("click", function () { hangGomb(); albumZar(); });
  d.querySelector("#alb-elo").addEventListener("click", function () { albumLapoz(-1); });
  d.querySelector("#alb-kov").addEventListener("click", function () { albumLapoz(1); });
  d.querySelector("#alb-uj").addEventListener("click", function () {
    hangGomb(); f.lapok.push({ hatter: "potty", elemek: [] }); ment(); ALB.lap = f.lapok.length - 1; albumMegse(); albumRajz(); albumTalca();
  });
  d.querySelector("#alb-le").addEventListener("click", function () { hangGomb(); albumLetolt(); });
  d.querySelector("#alb-torol").addEventListener("click", albumTorolKatt);
  ALB.svg.addEventListener("click", albumLapKatt);
  ALB.svg.addEventListener("pointermove", albumMozog);
  /* minden kép betöltése (a tálca és a lapok is ebből rajzol) */
  fotoKepekKer(f.kepek.map(function (k) { return k.id; }), function (m) { if (!ALB) return; ALB.kep = m; albumRajz(); albumTalca(); });
  albumRajz(); albumTalca();
}
function albumZar() {
  var d = document.getElementById("album-fedo"); if (d) { d.hidden = true; d.innerHTML = ""; }
  ALB = null;
  if (oduAktiv()) fotoOduKonyv($("odu-szoba").querySelector("svg"));   /* a polcon az új borító */
}
function albumAktLap() { return P().foto.lapok[ALB.lap]; }
function albumLapoz(ir) {
  var n = P().foto.lapok.length; hangGomb();
  ALB.lap = (ALB.lap + ir + n) % n; albumMegse(); albumRajz(); albumTalca();
}
function albumMegse() { ALB.fog = null; ALB.kival = null; }
function albumRajz() {
  if (!ALB) return;
  var lap = albumAktLap(), n = P().foto.lapok.length;
  ALB.svg.innerHTML = albumLapBelso(lap, ALB.kep, ALB.fog && ALB.fog.i != null ? ALB.fog.i : -1) + '<g id="alb-fog-reteg" pointer-events="none"></g>';
  if (ALB.kival != null) {
    var g = ALB.svg.querySelector('.alb-elem[data-i="' + ALB.kival + '"]');
    if (g) { var b = g.getBBox(); g.insertAdjacentHTML("beforeend", '<rect x="' + (b.x - 6) + '" y="' + (b.y - 6) + '" width="' + (b.width + 12) + '" height="' + (b.height + 12) + '" rx="10" fill="none" stroke="#8a4fd0" stroke-width="' + pcF(2 / ((lap.elemek[ALB.kival] || {}).m || 1)) + '" stroke-dasharray="6 4" pointer-events="none"/>'); }
  }
  $("alb-lapszam").textContent = lap.borito ? "Borító" : ALB.lap + ". lap / " + (n - 1);
  $("alb-torol").hidden = !!lap.borito;
  albumFogRajz(); albumGombsor();
}
function albumFogRajz() {
  var g = ALB && ALB.svg.querySelector("#alb-fog-reteg"); if (!g) return;
  if (!ALB.fog) { g.innerHTML = ""; return; }
  var p = ALB.mut || { x: ALBUM_W / 2, y: ALBUM_H / 2 }, e = ALB.fog.elem, k = {}; for (var x in e) k[x] = e[x];
  k.x = p.x; k.y = p.y;
  g.innerHTML = '<g opacity=".85">' + albumElemG(k, "fog", ALB.kep) + '</g><text x="' + pcF(p.x + 8) + '" y="' + pcF(p.y + 30) + '" font-size="20">👆</text>';
}
function albumMozog(ev) {
  if (!ALB || !ALB.fog || ev.pointerType === "touch") return;
  ALB.mut = fvPont(ALB.svg, ev); albumFogRajz();
}
function albumLapKatt(ev) {
  var lap = albumAktLap();
  if (ALB.fog) {   /* a második koppintás leteszi, oda, ahová koppint (szabad helyre tevés) */
    var p = fvPont(ALB.svg, ev), e = ALB.fog.elem;
    e.x = Math.max(0, Math.min(ALBUM_W, p.x)); e.y = Math.max(0, Math.min(ALBUM_H, p.y));
    if (ALB.fog.i != null) lap.elemek[ALB.fog.i] = e; else lap.elemek.push(e);
    ALB.kival = ALB.fog.i != null ? ALB.fog.i : lap.elemek.length - 1;
    ALB.fog = null; ALB.mut = null;
    beep(520, .05, "sine", 0, .07); ment(); albumRajz(); albumTalca();
    return;
  }
  var g = ev.target.closest && ev.target.closest(".alb-elem");
  ALB.kival = g ? +g.getAttribute("data-i") : null;
  if (g) hangGomb();
  albumRajz();
}
/* a kijelölt elem fölötti gombsor (HTML, hogy telefonon is nagy maradjon) */
function albumGombsor() {
  var gs = $("alb-gombsor"); if (!gs) return;
  var lap = albumAktLap(), e = ALB.kival != null && lap.elemek[ALB.kival];
  if (!e || ALB.fog) { gs.hidden = true; return; }
  var g = ALB.svg.querySelector('.alb-elem[data-i="' + ALB.kival + '"]'), hely = $("alb-lap-hely");
  if (!g) { gs.hidden = true; return; }
  var r = g.getBoundingClientRect(), h = hely.getBoundingClientRect();
  gs.innerHTML = [["forgat", "↻"], ["nagyobb", "＋"], ["kisebb", "－"], ["elore", "⬆"], ["athelyez", "✋"], ["vissza", "↩"]]
    .concat(e.tip === "foto" ? [["keret", "🖼️"]] : [])
    .map(function (b) { return '<button data-mit="' + b[0] + '">' + b[1] + "</button>"; }).join("");
  gs.hidden = false;
  var gw = gs.offsetWidth, x = Math.max(4, Math.min(h.width - gw - 4, r.left - h.left + r.width / 2 - gw / 2)), y = r.top - h.top - gs.offsetHeight - 6;
  if (y < 2) y = Math.min(h.height - gs.offsetHeight - 2, r.bottom - h.top + 6);
  gs.style.left = x + "px"; gs.style.top = y + "px";
  [].forEach.call(gs.querySelectorAll("button"), function (b) { b.addEventListener("click", function (ev) { ev.stopPropagation(); albumGomb(b.getAttribute("data-mit")); }); });
}
function albumGomb(mit) {
  var lap = albumAktLap(), i = ALB.kival, e = lap.elemek[i]; if (!e) return;
  hangGomb();
  if (mit === "forgat") e.rot = ((e.rot || 0) + 15) % 360;
  else if (mit === "nagyobb") e.m = Math.min(3, (e.m || 1) * 1.15);
  else if (mit === "kisebb") e.m = Math.max(.4, (e.m || 1) / 1.15);
  else if (mit === "elore") { lap.elemek.splice(i, 1); lap.elemek.push(e); ALB.kival = lap.elemek.length - 1; }
  else if (mit === "athelyez") { ALB.fog = { elem: e, i: i }; ALB.kival = null; }
  else if (mit === "vissza") { lap.elemek.splice(i, 1); ALB.kival = null; if (e.tip === "foto") albumTalca(); }   /* a fotó visszakerül a Fotóim közé */
  else if (mit === "keret") { var ks = ALBUM_KERET.map(function (k) { return k.id; }); e.keret = ks[(ks.indexOf(e.keret || "polaroid") + 1) % ks.length]; }
  ment(); albumRajz();
}
/* 🗑️ lap törlése — kétlépéses: „Biztos?” (3 mp-ig) */
function albumTorolKatt() {
  var b = $("alb-torol"), f = P().foto;
  if (!b.classList.contains("biztos")) {
    hangGomb(); b.classList.add("biztos"); b.textContent = "Biztos? 🗑️";
    setTimeout(function () { if (b.isConnected) { b.classList.remove("biztos"); b.textContent = "🗑️"; } }, 3000);
    return;
  }
  if (albumAktLap().borito) return;
  f.lapok.splice(ALB.lap, 1);
  if (f.lapok.length < 2) f.lapok.push({ hatter: "potty", elemek: [] });
  ALB.lap = Math.min(ALB.lap, f.lapok.length - 1);
  b.classList.remove("biztos"); b.textContent = "🗑️";
  beep(300, .08, "sine", 0, .07); ment(); albumMegse(); albumRajz(); albumTalca();
}

/* ═════════════════ A TÁLCA ═════════════════ */
function albumTalca() {
  if (!ALB) return;
  var fl = $("alb-fulek"), r = $("alb-racs"), f = P().foto, lap = albumAktLap();
  fl.innerHTML = ALB_FULEK.map(function (u) { return '<button class="alb-ful' + (u.id === ALB.ful ? " aktiv" : "") + '" data-ful="' + u.id + '">' + u.nev + "</button>"; }).join("");
  [].forEach.call(fl.querySelectorAll(".alb-ful"), function (b) { b.addEventListener("click", function () { hangGomb(); ALB.ful = b.getAttribute("data-ful"); albumTalca(); }); });
  var s = "", ures = "";
  var fogRef = ALB.fog && ALB.fog.i == null ? ALB.fog.elem.tip + ":" + ALB.fog.elem.ref : "";
  function tetel(tip, ref, belso, cim) {
    return '<button class="alb-tetel' + (fogRef === tip + ":" + ref ? " fogva" : "") + '" data-tip="' + tip + '" data-ref="' + htmlVed(ref) + '"' + (cim ? ' title="' + htmlVed(cim) + '"' : "") + ">" + belso + "</button>";
  }
  if (ALB.ful === "foto" || ALB.ful === "matrica") {
    var bent = ALB.ful === "foto" ? albumFotoBent() : {}, mind = f.kepek.filter(function (k) { return k.tip === ALB.ful; });
    mind.filter(function (k) { return !bent[k.id]; }).slice().reverse().forEach(function (k) {
      var d = ALB.kep[k.id];
      s += tetel(k.tip, k.id, d ? '<img alt="" src="' + d + '">' : '<span class="alb-tolt">…</span>');
    });
    ures = ALB.ful === "foto" && mind.length ? "Minden fotód bent van az albumban. Ha egyet visszaveszel (↩), újra itt lesz."
         : ALB.ful === "foto" ? "Még nincs fotód. Az odúban, a kertben, a fodrásznál és a kalandtérképen a 📷 gombbal fotózhatsz."
                              : "Ha az unikornisod vagy a kissárkány is rajta van a fotón, itt matrica lesz belőle.";
  } else if (ALB.ful === "kartya") {
    albumKartyak().forEach(function (k) { s += tetel("kartya", k.ref, '<svg viewBox="-32 -42 64 84">' + albumIdEgyedi(albumKartyaRajz(k.ref), "t" + k.ref.replace(/\W/g, "") + "-") + "</svg>", k.nev); });
    ures = "Itt lesznek a kártyáid: a holmik, a kristályok és a jelvények, amiket már megszereztél.";
  } else if (ALB.ful === "lap") {
    (lenyTar().kepeslap || []).forEach(function (id) { s += tetel("lap", id, kalandLapSVG(id)); });
    ures = "Még nincs képeslapod. A kissárkány nyomában találsz majd.";
  } else if (ALB.ful === "disz") {
    ALBUM_DISZ.forEach(function (id) { s += tetel("disz", id, '<svg viewBox="-26 -18 52 36"><defs>' + ALBUM_DEFS + "</defs>" + albumDiszRajz(id) + "</svg>"); });
  } else if (ALB.ful === "hatter") {
    if (lap.borito) ALBUM_VASZON.forEach(function (v) {
      s += '<button class="alb-tetel alb-hatter' + (lap.hatter === v.id ? " aktiv" : "") + '" data-hatter="' + v.id + '"><svg viewBox="0 0 84 63"><rect width="84" height="63" rx="5" fill="' + v.szin + '" stroke="' + v.szel + '" stroke-width="2"/><rect x="1" y="1" width="9" height="61" rx="4" fill="' + v.gerinc + '"/></svg><small>' + v.nev + "</small></button>";
    });
    else ALBUM_HATTER.forEach(function (h) {
      s += '<button class="alb-tetel alb-hatter' + (lap.hatter === h.id ? " aktiv" : "") + '" data-hatter="' + h.id + '"><svg viewBox="0 0 84 63"><defs>' + ALBUM_DEFS + "</defs>" + h.rajz(84, 63) + "</svg><small>" + h.nev + "</small></button>";
    });
  } else if (ALB.ful === "felirat") {
    r.innerHTML = '<div class="alb-felirat"><input id="alb-felirat-be" maxlength="40" placeholder="Írd ide…" value="' + htmlVed(ALB_FELIRAT.szoveg) + '">' +
      '<div class="alb-szinek">' + ALBUM_FELIRAT_SZIN.map(function (c) { return '<button class="alb-szin' + (c === ALB_FELIRAT.szin ? " aktiv" : "") + '" data-szin="' + c + '" style="background:' + c + '" aria-label="szín"></button>'; }).join("") + "</div>" +
      '<div class="alb-meretek">' + ALBUM_FELIRAT_MERET.map(function (m) { return '<button class="alb-meret' + (m.id === ALB_FELIRAT.meret ? " aktiv" : "") + '" data-meret="' + m.id + '" style="font-size:' + (10 + m.id * 5) + 'px">Aa</button>'; }).join("") + "</div>" +
      '<button class="nagy-gomb kiemelt" id="alb-felirat-fel">Felveszem ✋</button></div>';
    var be = $("alb-felirat-be");
    be.addEventListener("input", function () { ALB_FELIRAT.szoveg = be.value; });
    be.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") $("alb-felirat-fel").click(); });
    [].forEach.call(r.querySelectorAll(".alb-szin"), function (b) { b.addEventListener("click", function () { hangGomb(); ALB_FELIRAT.szin = b.getAttribute("data-szin"); albumTalca(); $("alb-felirat-be").focus(); }); });
    [].forEach.call(r.querySelectorAll(".alb-meret"), function (b) { b.addEventListener("click", function () { hangGomb(); ALB_FELIRAT.meret = +b.getAttribute("data-meret"); albumTalca(); }); });
    $("alb-felirat-fel").addEventListener("click", function () {
      var t = ALB_FELIRAT.szoveg.trim(); if (!t) { be.focus(); return; }
      hangGomb(); ALB.fog = { elem: { tip: "felirat", ref: "", szoveg: t, szin: ALB_FELIRAT.szin, meret: ALB_FELIRAT.meret, rot: 0, m: 1 } };
      ALB_FELIRAT.szoveg = ""; ALB.kival = null; albumRajz(); albumTalca();
    });
    return;
  }
  r.innerHTML = s || '<p class="alb-ures">' + ures + "</p>";
  [].forEach.call(r.querySelectorAll(".alb-tetel[data-tip]"), function (b) {
    b.addEventListener("click", function () { albumFelvesz(b.getAttribute("data-tip"), b.getAttribute("data-ref")); });
  });
  [].forEach.call(r.querySelectorAll(".alb-tetel[data-hatter]"), function (b) {
    b.addEventListener("click", function () { hangGomb(); albumAktLap().hatter = b.getAttribute("data-hatter"); ment(); albumRajz(); albumTalca(); });
  });
}
/* koppintás a tálcán: az elem a mutatóhoz tapad (újra koppintva ugyanarra: elengedi) */
function albumFelvesz(tip, ref) {
  hangGomb();
  if (ALB.fog && ALB.fog.i == null && ALB.fog.elem.tip === tip && ALB.fog.elem.ref === ref) { ALB.fog = null; albumRajz(); albumTalca(); return; }
  var e = { tip: tip, ref: ref, rot: Math.round(Math.random() * 12 - 6), m: 1 };
  if (tip === "foto") e.keret = "polaroid";
  if (tip === "disz" && ref === "datum") e.szoveg = albumMaiDatum();   /* a letevés napja: a gyerek teszi fel, ha akarja */
  ALB.fog = { elem: e }; ALB.kival = null;
  albumRajz(); albumTalca();
}

/* ═════════════════ ⬇️ LETÖLTÉS (PNG) ═════════════════ */
var _albumBetu = null;   /* a Fredoka beágyazva (@font-face base64) — egyszer töltjük le */
function albumBetuKer(cb) {
  if (_albumBetu !== null) { cb(_albumBetu); return; }
  var kesz = false, vege = function (v) { if (kesz) return; kesz = true; _albumBetu = v || null; cb(v); };   /* ha nem jött le, legközelebb újra próbálja */
  setTimeout(function () { vege(""); }, 6000);
  try {
    /* a Google a betűt nyelvi darabokra (unicode-range) bontja: mindegyik darab beágyazva, különben az ő/ű hiányozna */
    fetch("https://fonts.googleapis.com/css2?family=Fredoka:wght@600&display=swap").then(function (r) { return r.text(); }).then(function (css) {
      var urlek = css.match(/https:[^)]+\.woff2/g) || []; if (!urlek.length) { vege(""); return; }
      return Promise.all(urlek.map(function (u) {
        return fetch(u).then(function (r) { return r.blob(); }).then(function (b) {
          return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { ok([u, fr.result]); }; fr.onerror = function () { ok([u, ""]); }; fr.readAsDataURL(b); });
        });
      })).then(function (parok) { parok.forEach(function (p) { if (p[1]) css = css.split(p[0]).join(p[1]); }); vege(css); });
    }).catch(function () { vege(""); });
  } catch (e) { vege(""); }
}
function albumLetolt() {
  var lap = albumAktLap(), sz = 3, idx = ALB.lap;
  albumBetuKer(function (betu) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + ALBUM_W * sz + '" height="' + ALBUM_H * sz + '" viewBox="0 0 ' + ALBUM_W + " " + ALBUM_H + '">' +
      (betu ? "<style>" + betu + "</style>" : "") + albumLapBelso(lap, ALB ? ALB.kep : {}) + "</svg>";
    var img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas"); c.width = ALBUM_W * sz; c.height = ALBUM_H * sz;
      var ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
      c.toBlob(function (b) {
        if (!b) return;
        var a = document.createElement("a"); a.href = URL.createObjectURL(b);
        a.download = "fotoalbum-" + (lap.borito ? "borito" : idx + "-lap") + ".png";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        hangCsilla();
      }, "image/png");
    };
    img.onerror = function () { mondd("Most nem sikerült a letöltés."); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

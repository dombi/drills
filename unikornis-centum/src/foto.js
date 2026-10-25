/* ============ 10g) 📸 FOTÓGÉP: gép a Boltban, 📷 gomb a fotózható helyeken, kereső, pillanatkép, film, képtár ============
   Tervlap: Matekos/fotogep-album-terv.html (✅ 2026-10-25), rajzterv: fotogep-album-rajzterv.html (✅). Az album: album.js.
   • A gép a Bolt „Fotó” fülén, 💧-ért (FOTO_AR). Vele jár az induló film (FOTO_INDULO kocka) és egy üres album (borító + 1 lap).
   • Fotózni csak a játék világában lehet (FOTO_HELYEK: odú, kert, kalandtérkép, fodrász), feladat közben nem.
     📷 → kereső (koppintós célzás, ＋/－, 🦄/🐉/🏠 közelkép) → kattan → villanás + a kép berepül a gombba = 1 kocka. A ✕ bezárja, ilyenkor nem fogy film.
   • A fotó a kép PILLANATKÉPE (nem képernyőkép): a hely minden SVG-rétege egy vászonra, a CSS-ből számolt színekkel,
     megállított mozgással (fotoLefotoz). Ha az unikornis vagy a kissárkány a keretben van, magától matrica is lesz belőle
     (a figura kivágva, átlátszó háttérrel), külön kocka nélkül.
   • Film: CSAK küldetésből (💧-ért nem). 1. kód-kör: minden VÉGIGJÁRT pálya számít (palyaVege → fotoPalyaVege),
     3 pálya → 6 kocka (FOTO_KULD), mindig fut egy. A pult kézi listája, az ajánlott pályák és a 🎞️ térkép-jel: 2. kód-kör.
   • 0 film nem büntetés: az album mindig szerkeszthető. A film nem jár le. Nincs „Lefotózod?” ajánlat.
   • Tárolás: a képek NEM a fő mentésben vannak (az nagyra nőne): helyben IndexedDB („uc_album”), felhőben a
     users/{uid}/albumKep/{lény_id} dokumentumok (firestore.rules!). A P().foto csak kicsi adatot tart:
     { gep, film, kuld: { kesz, uj }, kepek: [{ id, tip: "foto"|"matrica", hely, d, w, h }], lapok: [...] (album.js) } */
var FOTO_AR = 20, FOTO_INDULO = 8, FOTO_KULD = { palyak: 3, kocka: 6 };
var FOTO_KEP_W = 640, FOTO_KEP_H = 480;   /* a fotó 4:3, JPEG (egy kép ~40–90 kB) */
/* a fotózható helyek: a kép tartója + a matricává váló figurák (ha a keretben vannak) + (fokusz) ha a kereső ne az egész
   helyet fogja, hanem egy részét (a fodrásznál a tükör előtti unikornist, a festékpolc nélkül). Új hely = egy sor ide
   + egy fotoGombTesz("id") hívás a hely rajzolása után. */
var FOTO_HELYEK = {
  odu:    { host: "odu-szoba",      matrica: { uni: "#odu-uni-flip", sarkany: "#ln-fioka-flip" } },
  kert:   { host: "kert-szinter",   matrica: { uni: ".kert-uni-svg", sarkany: "#ln-kert-tanc" } },
  kaland: { host: "kt-terkep",      matrica: {} },
  szalon: { host: "szalon-szinter", matrica: { uni: "#szalon-uni-forg" }, fokusz: "#szalon-uni-forg" }
};
var FOTO_HELY_NEV = { odu: "az odú", kert: "a kert", kaland: "a kalandtérkép", szalon: "a fodrász" };

function fotoTar(p) {
  p = p || P();
  if (!p.foto || typeof p.foto !== "object") p.foto = {};
  var f = p.foto;
  if (typeof f.gep !== "number") f.gep = 0;
  if (typeof f.film !== "number") f.film = 0;
  if (!f.kuld || typeof f.kuld !== "object") f.kuld = { kesz: 0, uj: 0 };
  if (!Array.isArray(f.kepek)) f.kepek = [];
  if (!Array.isArray(f.lapok)) f.lapok = [];
  return f;
}
/* a gép a Boltban: ébren van-e már (újoncnál a 12. naptól, nyitas.js) */
function fotoNyitva() { return nyitasHely("foto") !== "alszik"; }

/* ═════════════════ 🏪 A BOLT „Fotó” FÜLE (kert.js hívja: boltCsoportok, boltBirt, boltVegrehajt…) ═════════════════ */
var FOTO_BOLT = [{ id: "fotogep", nev: "Fotógép", ar: FOTO_AR }];
function fotoBoltCsoportok() { return [{ kulcs: "foto", nev: "Fotó", fajta: "foto", tetelek: FOTO_BOLT }]; }
function fotoGepVesz(t) {
  if ((P().tunderharmat || 0) < t.ar) { renderOduPanel(); return; }
  P().tunderharmat -= t.ar; vasarlasNaplo(t.id, t.ar, "tunderharmat");
  var f = fotoTar();
  f.gep = 1; f.film += FOTO_INDULO;
  albumAlap(f);   /* üres album: borító + egy lap (album.js) */
  hangCsilla(); hangJo(); ment();
  renderOduPanel();
}
function fotoBoltSzoveg(k) {
  if (P().foto && P().foto.gep) return "Ez már a tiéd! Az odúban, a kertben, a fodrásznál és a kalandtérképen fotózhatsz vele.";
  var pk = P().tunderharmat || 0;
  if (pk < FOTO_AR) return "Még " + (FOTO_AR - pk) + " 💧 kell hozzá — gyűjts egy kicsit!";
  return "Fotógép, " + FOTO_INDULO + " kocka film és egy album jár hozzá!";
}

/* ═════════════════ 🎞️ FILM-KÜLDETÉS (1. kód-kör: minden végigjárt pálya számít) ═════════════════ */
function fotoPalyaVege() {
  var f = P().foto;
  if (!f || !f.gep) return;
  f.kuld.kesz++;
  if (f.kuld.kesz >= FOTO_KULD.palyak) { f.kuld.kesz = 0; f.film += FOTO_KULD.kocka; f.kuld.uj = 1; }   /* a buborék a 📷 gombnál jön */
}

/* ═════════════════ 📷 A GOMB (a hely jobb alsó sarkában) ═════════════════ */
function fotoGombTesz(helyId) {
  var H = FOTO_HELYEK[helyId], host = H && document.getElementById(H.host);
  if (!host) return;
  var regi = host.querySelector(".foto-gomb-hely"); if (regi) regi.remove();
  var f = P().foto;
  if (!f || !f.gep) return;
  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  var d = document.createElement("div");
  d.className = "foto-gomb-hely";
  var nincs = f.film <= 0;
  d.innerHTML = (nincs ? '<span class="foto-film-jel">🎞️ ' + f.kuld.kesz + "/" + FOTO_KULD.palyak + "</span>" : "") +
    '<button class="foto-gomb' + (nincs ? " ures" : "") + '" aria-label="Fotó">📷' + (nincs ? "" : '<b class="foto-db">' + f.film + "</b>") + "</button>";
  host.appendChild(d);
  d.querySelector(".foto-gomb").addEventListener("click", function (e) {
    e.stopPropagation();
    if (P().foto.film <= 0) { hangGomb(); mondd("Elfogyott a film. Három végigjárt ösvény után új filmet kapsz!"); return; }
    hangGomb(); fotoKereso(helyId);
  });
  if (f.kuld.uj) {   /* „Új film: 6 kocka!” — a filmtekercs a gomb fölött, csilingelés */
    f.kuld.uj = 0; ment();
    var b = document.createElement("div");
    b.className = "foto-uj-film";
    b.innerHTML = '<svg viewBox="-16 -16 52 32" width="40" height="25">' + FOTO_FILM_SVG + "</svg> Új film: " + FOTO_KULD.kocka + " kocka!";
    d.appendChild(b);
    setTimeout(function () { hangCsilla(); }, 300);
    setTimeout(function () { b.classList.add("el"); }, 3800);
    setTimeout(function () { b.remove(); }, 4400);
  }
}

/* ═════════════════ 🔲 A KERESŐ (koppintós célzás + 3 méret + közelkép-gombok, egy kattintás) ═════════════════
   • Koppintás bárhová a képen → oda ugrik a keret (a hely szélein belül marad).
   • ＋ közelebb (kisebb keret), － messzebb: 3 méret (FOTO_MERET, a hely szélességének arányában).
   • Közelkép-gombok: 🦄 / 🐉 a figurára áll (ha látszik a helyen), 🏠 az egész kép. A fodrásznál a 🦄 az induló állás.
   • A gombok egy fix sávban, a képernyő alján: a keret mozog, a kattintó gomb nem ugrál. */
var FOTO_KERESO = null;
var FOTO_MERET = [.42, .62, .86];
var FOTO_KOZEL = [{ alak: "uni", jel: "🦄", nev: "Az unikornis" }, { alak: "sarkany", jel: "🐉", nev: "A kissárkány" }];
function fotoKeresoKeret(r, f, cx, cy, w) {   /* 4:3 keret: w szélesség, (cx, cy) közép; f: figura köré (1,35-szörös, hogy a szarv is beférjen); a helyen belül */
  if (!w) w = r.width * FOTO_MERET[2];
  if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
  if (f && f.width) { w = Math.max(f.width * 1.35, f.height * 1.35 * 4 / 3); cx = f.left + f.width / 2; cy = f.top + f.height / 2; }
  var h = w * 3 / 4;
  if (w > r.width * .96) { w = r.width * .96; h = w * 3 / 4; }
  if (h > r.height * .96) { h = r.height * .96; w = h * 4 / 3; }
  var x = Math.max(r.left, Math.min(r.right - w, cx - w / 2)), y = Math.max(r.top, Math.min(r.bottom - h, cy - h / 2));
  return { left: x, top: y, width: w, height: h };
}
function fotoFigura(H, host, alak) {   /* a figura képernyő-téglalapja, ha látszik a helyen (különben null) */
  var sel = H.matrica && H.matrica[alak], e = sel && host.querySelector(sel);
  if (!e || !fotoLathato(e, host)) return null;
  var f = e.getBoundingClientRect();
  return f.width >= 8 && f.height >= 8 ? f : null;
}
function fotoMeretek(r) { return FOTO_MERET.map(function (m) { return fotoKeresoKeret(r, null, 0, 0, r.width * m).width; }); }   /* a 3 méret valódi szélessége */
function fotoKereso(helyId) {
  var H = FOTO_HELYEK[helyId], host = document.getElementById(H.host);
  if (!host || FOTO_KERESO) return;
  var r = host.getBoundingClientRect();
  if (r.width < 40 || r.height < 40) return;   /* a hely most nem látszik (másik képernyő) */
  var kozel = FOTO_KOZEL.filter(function (z) { return fotoFigura(H, host, z.alak); });
  var d = document.createElement("div");   /* az egész képernyőt fedi: közben máshová nem lehet koppintani */
  d.className = "foto-kereso";
  d.innerHTML = '<svg width="100%" height="100%"></svg>' +
    '<button class="foto-zar" aria-label="Mégse">✕</button>' +
    '<div class="foto-sav">' +
      kozel.map(function (z) { return '<button class="foto-kozel" data-alak="' + z.alak + '" aria-label="' + z.nev + '">' + z.jel + "</button>"; }).join("") +
      '<button class="foto-kozel" data-alak="egesz" aria-label="Az egész kép">🏠</button>' +
      '<span class="foto-sav-koz"></span>' +
      '<button class="foto-zoom" data-z="-1" aria-label="Messzebb">－</button><button class="foto-zoom" data-z="1" aria-label="Közelebb">＋</button>' +
      '<span class="foto-sav-koz"></span>' +
      '<button class="foto-kattan" aria-label="Kattintás"><span></span></button><b class="foto-kereso-db">' + P().foto.film + "</b>" +
    "</div>";
  document.body.appendChild(d);
  var K = FOTO_KERESO = { d: d, hely: helyId, r: r, k: null };
  var fok = H.fokusz && host.querySelector(H.fokusz);
  fotoKeresoAll(fotoKeresoKeret(r, fok && fok.getBoundingClientRect()));
  d.querySelector(".foto-zar").addEventListener("click", function (e) { e.stopPropagation(); hangGomb(); fotoKeresoZar(); });
  d.querySelector(".foto-kattan").addEventListener("click", function (e) { e.stopPropagation(); fotoKattan(helyId, K.k); });
  d.querySelector(".foto-sav").addEventListener("click", function (e) { e.stopPropagation(); });   /* a sávra koppintás ne mozdítsa a keretet */
  [].forEach.call(d.querySelectorAll(".foto-kozel"), function (b) {
    b.addEventListener("click", function () {
      if (K.fut) return;
      hangGomb();
      var a = b.getAttribute("data-alak");
      fotoKeresoAll(fotoKeresoKeret(K.r, a === "egesz" ? null : fotoFigura(H, host, a)));
    });
  });
  [].forEach.call(d.querySelectorAll(".foto-zoom"), function (b) {
    b.addEventListener("click", function () { if (!K.fut) fotoKeresoZoom(+b.getAttribute("data-z")); });
  });
  d.addEventListener("click", function (e) {   /* koppintás a képen: oda ugrik a keret, a mérete marad */
    if (K.fut) return;
    beep(900, .03, "sine", 0, .04);
    fotoKeresoAll(fotoKeresoKeret(K.r, null, e.clientX, e.clientY, K.k.width));
  });
}
/* a 3 méret közül a következő (z = 1: közelebb = kisebb keret; -1: messzebb); a figura-közelkép után is a legközelebbire lép */
function fotoKeresoZoom(z) {
  var K = FOTO_KERESO, w = K.k.width, l = fotoMeretek(K.r), uj = null;
  if (z > 0) { for (var i = l.length - 1; i >= 0; i--) if (l[i] < w * .97) { uj = l[i]; break; } }
  else { for (var j = 0; j < l.length; j++) if (l[j] > w * 1.03) { uj = l[j]; break; } }
  if (uj == null) return;
  hangGomb();
  fotoKeresoAll(fotoKeresoKeret(K.r, null, K.k.left + K.k.width / 2, K.k.top + K.k.height / 2, uj));
}
/* a keret kirajzolása: sötét fátyol a kereten kívül + fehér sarkok; a ✕ a keret jobb felső sarkánál; a ＋/－ szürke, ha arra nincs több méret */
function fotoKeresoAll(k) {
  var K = FOTO_KERESO, d = K.d, W = window.innerWidth, Hh = window.innerHeight;
  K.k = k;
  var x = k.left, y = k.top, w = k.width, h = k.height, s = Math.min(26, w * .12);
  var svg = d.querySelector("svg");
  svg.setAttribute("viewBox", "0 0 " + W + " " + Hh);
  svg.innerHTML = '<path d="M0 0H' + W + "V" + Hh + "H0z M" + x + " " + y + "V" + (y + h) + "H" + (x + w) + "V" + y + 'z" fill="#2a2140" opacity=".45" fill-rule="evenodd"/>' +
    '<path d="M' + x + " " + (y + s) + "V" + y + "h" + s + "M" + (x + w - s) + " " + y + "h" + s + "v" + s + "M" + (x + w) + " " + (y + h - s) + "v" + s + "h" + (-s) +
    "M" + (x + s) + " " + (y + h) + "H" + x + "v" + (-s) + '" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>';
  var zr = d.querySelector(".foto-zar");
  zr.style.left = Math.min(x + w - 10, W - 50) + "px"; zr.style.top = Math.max(4, y - 18) + "px";
  var l = fotoMeretek(K.r);
  d.querySelector('.foto-zoom[data-z="1"]').disabled = w <= l[0] * 1.03;
  d.querySelector('.foto-zoom[data-z="-1"]').disabled = w >= l[2] * .97;
}
function fotoKeresoZar() { if (FOTO_KERESO) { FOTO_KERESO.d.remove(); FOTO_KERESO = null; } }

/* kattanás: villanás + hang, a pillanatkép elkészül, a kép berepül a 📷 gombba (5 → 4) */
function fotoKattan(helyId, keret) {
  var K = FOTO_KERESO; if (!K || K.fut) return;
  K.fut = 1;
  K.d.style.visibility = "hidden";   /* a kereső ne kerüljön a képre (külön réteg, de biztos, ami biztos) */
  beep(2200, .03, "square", 0, .05); beep(700, .06, "triangle", .04, .08);
  fotoLefotoz(helyId, keret, function (kep, matricak) {
    fotoKeresoZar();
    var vill = document.createElement("div"); vill.className = "foto-villanas"; document.body.appendChild(vill);
    setTimeout(function () { vill.remove(); }, 450);
    if (!kep) { mondd("Most nem sikerült a kép. Próbáld újra!"); return; }
    var f = fotoTar(), most = Date.now(), id = "f" + most.toString(36);
    f.film = Math.max(0, f.film - 1);
    f.kepek.push({ id: id, tip: "foto", hely: helyId, d: most, w: FOTO_KEP_W, h: FOTO_KEP_H });
    fotoKepMent(id, kep);
    matricak.forEach(function (m, i) {
      var mid = id + "m" + i;
      f.kepek.push({ id: mid, tip: "matrica", hely: helyId, alak: m.alak, d: most, w: m.w, h: m.h, szulo: id });
      fotoKepMent(mid, m.kep);
    });
    ment();
    fotoBerepul(helyId, keret, kep);
  });
}
function fotoBerepul(helyId, keret, kep) {
  var H = FOTO_HELYEK[helyId], host = document.getElementById(H.host), g = host && host.querySelector(".foto-gomb");
  var p = document.createElement("div");
  p.className = "foto-repulo";
  var w = Math.min(160, keret.width * .4);
  p.style.cssText = "left:" + (keret.left + keret.width / 2 - w / 2) + "px;top:" + (keret.top + keret.height / 2 - w / 2) + "px;width:" + w + "px";
  p.innerHTML = '<img alt="" src="' + kep + '">';
  document.body.appendChild(p);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var gr = g ? g.getBoundingClientRect() : { left: keret.left + keret.width, top: keret.top + keret.height, width: 0, height: 0 };
      p.style.transform = "translate(" + (gr.left + gr.width / 2 - (keret.left + keret.width / 2)) + "px," + (gr.top + gr.height / 2 - (keret.top + keret.height / 2)) + "px) rotate(-14deg) scale(.18)";
      p.style.opacity = ".2";
    });
  });
  setTimeout(function () { p.remove(); fotoGombTesz(helyId); }, 900);
}

/* ═════════════════ 📸 A PILLANATKÉP ═════════════════
   A hely minden legfelső <svg>-je (DOM-sorrendben) egy vászonra kerül, a saját képernyő-transzformációjával
   (getScreenCTM: a CSS-tükrözés és -nagyítás is benne van). A klónba beíródnak a CSS-ből számolt színek, és a
   máshonnan (pl. index.html) hivatkozott defs-ek; a mozgás megáll (a klón CSS nélkül, nyugalmi pózban rajzolódik). */
var FOTO_STILUS = ["fill", "stroke", "opacity", "fill-opacity", "stroke-opacity", "stroke-width", "visibility", "font-family", "font-size", "font-weight"];
var FOTO_DEFS_TAG = { defs: 1, clippath: 1, mask: 1, pattern: 1, symbol: 1, marker: 1, filter: 1, lineargradient: 1, radialgradient: 1 };
function fotoKlon(svg, jelolt) {
  var klon = svg.cloneNode(true), eredeti = svg.querySelectorAll("*"), masolt = klon.querySelectorAll("*"), torol = [];
  for (var i = 0; i < eredeti.length; i++) {
    var e = eredeti[i], m = masolt[i];
    if (e.closest && e.parentNode && fotoDefsben(e, svg)) continue;
    var cs = getComputedStyle(e);
    if (cs.display === "none") { torol.push(m); continue; }
    var st = "";
    for (var j = 0; j < FOTO_STILUS.length; j++) { var v = cs.getPropertyValue(FOTO_STILUS[j]); if (v) st += FOTO_STILUS[j] + ":" + v + ";"; }
    m.setAttribute("style", (m.getAttribute("style") || "").replace(/animation[^;]*;?/g, "") + ";" + st);
    if (jelolt && e === jelolt) m.setAttribute("data-foto-jel", "1");
  }
  torol.forEach(function (m) { if (m.parentNode) m.parentNode.removeChild(m); });
  /* a hivatkozott, de a klónban nem lévő defs-ek (url(#…), href="#…") átmásolása — láncban is */
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"), volt = {}, kor = 0, uj = true;
  klon.insertBefore(defs, klon.firstChild);
  while (uj && kor++ < 6) {
    uj = false;
    var str = new XMLSerializer().serializeToString(klon), re = /url\(\s*["']?#([^"')\s]+)["']?\s*\)|href="#([^"]+)"/g, t;
    while ((t = re.exec(str))) {
      var idd = t[1] || t[2];
      if (volt[idd]) continue;
      volt[idd] = 1;
      var bent = false; try { bent = !!klon.querySelector("#" + CSS.escape(idd)); } catch (e) { bent = true; }
      if (bent) continue;
      var kint = document.getElementById(idd);
      if (kint) { defs.appendChild(kint.cloneNode(true)); uj = true; }
    }
  }
  return klon;
}
function fotoDefsben(e, gyoker) {
  for (var p = e; p && p !== gyoker; p = p.parentNode) if (p.tagName && FOTO_DEFS_TAG[p.tagName.toLowerCase()]) return true;
  return false;
}
/* egy SVG-réteg képe: { img, ctm, vb } — q-szoros felbontással rajzolva */
function fotoReteg(svg, klon, q, kesz) {
  var vb = svg.viewBox && svg.viewBox.baseVal, ctm = svg.getScreenCTM();
  if (!ctm) { kesz(null); return; }
  var x = 0, y = 0, w = svg.clientWidth || svg.getBoundingClientRect().width, h = svg.clientHeight || svg.getBoundingClientRect().height;
  if (vb && vb.width) { x = vb.x; y = vb.y; w = vb.width; h = vb.height; }
  else klon.setAttribute("viewBox", "0 0 " + w + " " + h);
  var pix = Math.max(w, h) * q; if (pix > 2400) q = q * 2400 / pix;   /* a nagy viewBox-ot se rajzoljuk óriásira */
  klon.setAttribute("width", w * q); klon.setAttribute("height", h * q);
  klon.setAttribute("preserveAspectRatio", "none");
  klon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  klon.removeAttribute("class"); klon.style.removeProperty && klon.style.removeProperty("transform");
  var img = new Image();
  img.onload = function () { kesz({ img: img, ctm: ctm, x: x, y: y, q: q }); };
  img.onerror = function () { kesz(null); };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(klon));
}
function fotoRajzol(ctx, R, k, ox, oy) {   /* képernyő → vászon: k-szoros nagyítás, (ox, oy) a keret bal felső sarka */
  var m = R.ctm;
  ctx.setTransform(k, 0, 0, k, -ox * k, -oy * k);
  ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  ctx.translate(R.x, R.y); ctx.scale(1 / R.q, 1 / R.q);
  ctx.drawImage(R.img, 0, 0);
}
function fotoLathato(e, host) {
  var a = 1;
  for (var p = e; p && p !== document.body; p = p.parentElement) {
    var cs = getComputedStyle(p);
    if (cs.display === "none" || cs.visibility === "hidden") return 0;
    a *= +cs.opacity;
    if (p === host) break;
  }
  return a;
}
function fotoLefotoz(helyId, keret, kesz) {
  var H = FOTO_HELYEK[helyId], host = document.getElementById(H.host);
  var retegek = [].filter.call(host.querySelectorAll("svg"), function (s) {
    if (s.parentElement && s.parentElement.closest("svg")) return false;   /* csak a legfelsők (a beágyazottak velük jönnek) */
    if (s.closest(".foto-gomb-hely")) return false;
    var r = s.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.right > keret.left && r.left < keret.left + keret.width && r.bottom > keret.top && r.top < keret.top + keret.height;
  });
  var vaszon = document.createElement("canvas"); vaszon.width = FOTO_KEP_W; vaszon.height = FOTO_KEP_H;
  var ctx = vaszon.getContext("2d"), k = FOTO_KEP_W / keret.width;
  var hatter = getComputedStyle(host).backgroundColor;
  ctx.fillStyle = (!hatter || hatter === "rgba(0, 0, 0, 0)" || hatter === "transparent") ? "#fdf0d0" : hatter;
  ctx.fillRect(0, 0, FOTO_KEP_W, FOTO_KEP_H);
  var kepek = new Array(retegek.length), hatra = retegek.length, alfa = retegek.map(function (s) { return fotoLathato(s, host); });
  /* a matrica-figurák: ami a keretben van és látszik */
  var figurak = [];
  Object.keys(H.matrica).forEach(function (alak) {
    var e = host.querySelector(H.matrica[alak]); if (!e) return;
    var r = e.getBoundingClientRect();
    if (r.width < 8 || r.height < 8 || !fotoLathato(e, host)) return;
    var bx = Math.max(r.left, keret.left), by = Math.max(r.top, keret.top), jx = Math.min(r.right, keret.left + keret.width), jy = Math.min(r.bottom, keret.top + keret.height);
    if ((jx - bx) * (jy - by) < r.width * r.height * .5) return;   /* legalább a fele a keretben legyen */
    figurak.push({ alak: alak, e: e, r: r });
  });
  if (!hatra) { kesz(vaszon.toDataURL("image/jpeg", .85), []); return; }
  retegek.forEach(function (s, i) {
    fotoReteg(s, fotoKlon(s), 2 * Math.max(1, k), function (R) {
      kepek[i] = R;
      if (--hatra) return;
      kepek.forEach(function (R2, j) { if (R2 && alfa[j] > 0) { ctx.globalAlpha = alfa[j]; fotoRajzol(ctx, R2, k, keret.left, keret.top); } });
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      var kep = null; try { kep = vaszon.toDataURL("image/jpeg", .85); } catch (e) {}
      fotoMatricak(figurak, function (m) { kesz(kep, m); });
    });
  });
}
/* matrica: a figura saját rétegéből CSAK a figura (minden más elem visibility:hidden, a figura ősei nem rajzolnak maguk) */
function fotoMatricak(figurak, kesz) {
  var ki = [], hatra = figurak.length;
  if (!hatra) { kesz(ki); return; }
  figurak.forEach(function (F) {
    var svg = F.e.tagName.toLowerCase() === "svg" ? F.e : F.e.ownerSVGElement;
    while (svg && svg.parentElement && svg.parentElement.closest("svg")) svg = svg.parentElement.closest("svg");
    var klon = fotoKlon(svg, F.e === svg ? null : F.e), jel = klon.querySelector('[data-foto-jel="1"]');
    if (jel) [].forEach.call(klon.querySelectorAll("*"), function (m) {   /* a figurán kívül minden rejtve (a defs-ek maradnak) */
      if (m !== jel && !jel.contains(m) && !m.contains(jel) && !fotoDefsben(m, klon)) m.style.visibility = "hidden";
    });
    var pad = 4, max = 360, sk = Math.min(3, max / Math.max(F.r.width, F.r.height));
    var w = Math.round((F.r.width + 2 * pad) * sk), h = Math.round((F.r.height + 2 * pad) * sk);
    fotoReteg(svg, klon, 2 * sk, function (R) {
      if (R) {
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        fotoRajzol(c.getContext("2d"), R, sk, F.r.left - pad, F.r.top - pad);
        try { ki.push({ alak: F.alak, w: w, h: h, kep: c.toDataURL("image/png") }); } catch (e) {}
      }
      if (!--hatra) kesz(ki);
    });
  });
}

/* ═════════════════ 🗄️ KÉPTÁR: IndexedDB helyben + felhő (users/{uid}/albumKep) ═════════════════ */
var FOTO_CACHE = {}, _fotoDb = null, _fotoDbVar = [];
function fotoKulcs(id) { return (FELHO.uid || (FELHO.offline && FELHO.offline.uid) || "helyi") + "/" + mentes.leny + "/" + id; }
function fotoIdb(cb) {
  if (_fotoDb) { cb(_fotoDb); return; }
  _fotoDbVar.push(cb);
  if (_fotoDbVar.length > 1) return;
  var kesz = function (db) { _fotoDb = db; var v = _fotoDbVar; _fotoDbVar = []; v.forEach(function (f) { f(db); }); };
  try {
    var r = indexedDB.open("uc_album", 1);
    r.onupgradeneeded = function () { r.result.createObjectStore("kep"); };
    r.onsuccess = function () { kesz(r.result); };
    r.onerror = function () { kesz(null); };
  } catch (e) { kesz(null); }
}
function fotoKepMent(id, data) {
  var kulcs = fotoKulcs(id);
  FOTO_CACHE[kulcs] = data;
  fotoIdb(function (db) { if (!db) return; try { db.transaction("kep", "readwrite").objectStore("kep").put(data, kulcs); } catch (e) {} });
  if (FELHO.aktiv && FELHO.db && FELHO.uid) {
    try { felhoUserRef().collection("albumKep").doc(mentes.leny + "_" + id).set({ d: data, t: Date.now() }).catch(function () {}); } catch (e) {}
  }
}
function fotoKepKer(id, cb) {
  var kulcs = fotoKulcs(id);
  if (FOTO_CACHE[kulcs]) { cb(FOTO_CACHE[kulcs]); return; }
  fotoIdb(function (db) {
    var felhobol = function () {
      if (!(FELHO.aktiv && FELHO.db && FELHO.uid)) { cb(null); return; }
      try {
        felhoUserRef().collection("albumKep").doc(mentes.leny + "_" + id).get().then(function (d) {
          var v = d.exists ? d.data().d : null;
          if (v) { FOTO_CACHE[kulcs] = v; if (db) try { db.transaction("kep", "readwrite").objectStore("kep").put(v, kulcs); } catch (e) {} }
          cb(v);
        }).catch(function () { cb(null); });
      } catch (e) { cb(null); }
    };
    if (!db) { felhobol(); return; }
    try {
      var r = db.transaction("kep").objectStore("kep").get(kulcs);
      r.onsuccess = function () { if (r.result) { FOTO_CACHE[kulcs] = r.result; cb(r.result); } else felhobol(); };
      r.onerror = felhobol;
    } catch (e) { felhobol(); }
  });
}
/* több kép egyszerre: cb({ id: data }) — a hiányzó képek kimaradnak */
function fotoKepekKer(idk, cb) {
  var ki = {}, hatra = idk.length;
  if (!hatra) { cb(ki); return; }
  idk.forEach(function (id) { fotoKepKer(id, function (v) { if (v) ki[id] = v; if (!--hatra) cb(ki); }); });
}
function fotoKepVan(id) { return !!FOTO_CACHE[fotoKulcs(id)]; }
function fotoKepCache(id) { return FOTO_CACHE[fotoKulcs(id)] || null; }

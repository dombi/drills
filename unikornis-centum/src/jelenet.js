/* ============ 6h4) 🎬 JELENET-MOTOR — a kép-panel közös váza (Pálya-recept C kör 1. menet, 2026-10-25) ============
   Terv: terv/palya-recept-terv.html 4. + 7. pont (✅ a stúdió döntése). A bolt (bolt-kep.js) és a Rokon-létra (letra.js) képe
   ugyanezt a vázat külön írta meg; az új képek már erre épülnek: 🏡 Számcsalád (csalad.js, 1. menet) · 🪜 Rokon-létra (letra.js, 2. menet).
   EGY KÉP ennyit ad (JELENETEK[név], a feladaton f.jelenet = név):
     kep(JL)          → { vb: "0 0 800 430", tabla: [x, y, w, h] | null, uni: [x, y, nagyság, irány?] } — az elrendezés (JL.keskeny: telefon,
                        álló; irány −1: balra néz)
     indit(JL)        — a feladat kezdete (a felolvasást a motor mondja: f.felolvas); ha true-t ad, a kezdést a kép maga rajzolja és
                        mondja el (a létra előbb magától kitölt)
     rajz(JL)         → SVG: a kép saját része (a táblát, az unikornist és a kézben lévő követ a motor rajzolja)
     felvesz(JL, id)  → szám | null — a .jl-fog[data-fog=id] felvehető-e (ha igen, a kép kiveszi a helyéről)
     letesz(JL, id, n, hova) — a kő letétele: hova = a legközelebbi .jl-hely data-hely-je, vagy null (vissza, ahonnan jött)
     katt(JL, t)      — más koppintás a képen · bekuld(JL, v) — a táblára írt szám · tablaAll(JL) → "" | "var" (még nem ide írunk)
     gepi(JL)         → a gépi próba helyes bevitele (probacsapat/gepi/kiskapu.js)
   A MOTOR ADJA: panel a buborékban · tábla + átlátszó beíró mező (a helyét a tábla és a viewBox adja) · fizikai billentyűzet ·
   Kész gomb · 🪨 FELVESZ–LETESZ koppintással (nincs húzás: a gyerekek touchpadot használnak — a producer, 2026-10-24): egy koppintás
   felveszi, egérrel/touchpaddal a kő követi a mutatót, érintésnél a helye fölött vár; a második koppintás a legközelebbi körbe teszi,
   ha nincs kör a közelben, oda, ahonnan jött (Esc ugyanígy) · unikornis a képen (jlUniSetal) · jó/rossz a motornak:
   jlJo → ertekel(f.helyes), jlRossz → rosszValaszKonyvel, és JL.seg a hiba-lépcső (1. hiba · 2. hibától) · állomásonként megmaradó
   állapot (jlAllapot: J.jl) · JL.vege = a kép végigért (a következő feladatnál az unikornis újra a kezdő helyén áll). */

var JELENETEK = {};
var JL = null;   /* a kirakott kép: { J, all, f, def, svg, st, keskeny, beirt, rossz, joMost, lezart, vege, seg, fog, ux, uy } */

function jlAllapot() {
  if (!J.jl || J.jl.all !== J.allomasIdx) J.jl = { all: J.allomasIdx };
  return J.jl;
}

/* ═════════════════ A PANEL (a buborékban, mint a bolt és a létra képe) ═════════════════ */
function jlPanel() {
  var p = $("jl-panel");
  if (!p) {
    p = el("div", "bk-panel jl-panel"); p.id = "jl-panel";
    p.innerHTML = '<div class="jl-kep"><svg id="jl-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 430" aria-hidden="true"></svg>' +
      '<input id="jl-beiras" class="jl-beiras" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="a válasz a táblára"></div>' +
      '<div id="jl-gombok" class="bk-gombok"><button class="nagy-gomb bk-kesz" data-g="kesz">Kész ✓</button></div>';
    $("bagoly-buborek").insertBefore(p, $("halld-ujra"));
    var svg = p.querySelector("svg");
    svg.addEventListener("click", jlKatt);
    svg.addEventListener("pointermove", jlMozog);
    $("jl-gombok").addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-g]"); if (b && jlAktiv()) { hangGomb(); jlBekuld(); } });
    var be = $("jl-beiras");
    be.addEventListener("input", function () { if (!jlAktiv() || !jlTablaNyitva()) { be.value = ""; return; } JL.beirt = be.value.replace(/[^0-9]/g, "").slice(0, 3); be.value = JL.beirt; JL.rossz = null; jlTablaRajz(); });
    be.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (jlAktiv()) jlBekuld(); } });
  }
  return p;
}
function jlRejt() {
  var p = $("jl-panel"); if (p) p.hidden = true;
  if (JL) JL.fog = null;
  var k = $("kepernyo-jatek"); if (k) k.classList.remove("bk-be");
  document.removeEventListener("keydown", jlBillentyu);
}
function jelenetMutat(f) {
  var def = JELENETEK[f.jelenet], p = jlPanel();
  p.hidden = false; $("kepernyo-jatek").classList.add("bk-be");
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  var marad = JL && JL.J === J && JL.all === J.allomasIdx && !JL.vege;   /* az állomáson belül az unikornis ott marad, ahol volt */
  JL = { J: J, all: J.allomasIdx, f: f, def: def, svg: $("jl-svg"), st: jlAllapot(), beirt: "", rossz: null, joMost: false, lezart: false, seg: 0, fog: null,
         ux: marad ? JL.ux : null, uy: marad ? JL.uy : null };
  $("jl-beiras").value = "";
  document.removeEventListener("keydown", jlBillentyu); document.addEventListener("keydown", jlBillentyu);
  if (def.indit && def.indit(JL)) return;
  jlRajz(); mondd(f.felolvas); jlFokusz();
}
function jlFokusz() { try { if (jlTablaNyitva() && !(window.matchMedia && matchMedia("(pointer: coarse)").matches)) $("jl-beiras").focus({ preventScroll: true }); } catch (e) {} }

/* ═════════════════ RAJZ ═════════════════ */
function jlKep() { return JL.def.kep(JL); }
function jlRajz() {
  if (!JL) return;
  JL.keskeny = !!(JL.svg.parentNode.clientWidth && JL.svg.parentNode.clientWidth < 520);   /* 📱 telefon, álló: a kép saját, magas elrendezése */
  var k = jlKep(), vb = k.vb.split(" ").map(Number);
  JL.svg.setAttribute("viewBox", k.vb);
  JL.svg.parentNode.style.setProperty("--jl-arany", (vb[2] / vb[3]).toFixed(3));
  var s = LT_DEFS + KF_DEFS + JL.def.rajz(JL) + '<g class="jl-tabla-hely"></g>';
  if (JL.ux == null) { JL.ux = k.uni[0]; JL.uy = k.uni[1]; }
  s += '<g class="pc-uni" pointer-events="none"><g class="pc-uni-irany" style="--dir:' + (k.uni[3] || 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG("jl-uni", LENYEK[mentes.leny], k.uni[2], P().oltozet) + '</g></g>';
  s += '<g class="jl-fog-reteg" pointer-events="none"></g>';
  JL.svg.innerHTML = kfSajatId(s, "jl");
  JL.uni = JL.svg.querySelector(".pc-uni"); jlUniAllit(JL.ux, JL.uy);
  if (JL.def.utan) JL.def.utan(JL);   /* a kép élő szereplői (pl. Zsivány) a rajz után a helyükre kerülnek, és mozognak tovább */
  uniNezoAdat(JL.svg.querySelector(".pc-uni-irany"), { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  /* a beíró mező a táblán ül (a tábla helye a viewBox %-ában); ha nincs tábla, vagy még nem ide írunk, a mező nincs útban */
  var be = $("jl-beiras"), T = k.tabla;
  be.hidden = !T; $("jl-gombok").hidden = !T;
  if (T) {
    be.style.left = ((T[0] - T[2] / 2 - 9 - vb[0]) / vb[2] * 100) + "%"; be.style.top = ((T[1] - T[3] / 2 - 9 - vb[1]) / vb[3] * 100) + "%";
    be.style.width = ((T[2] + 18) / vb[2] * 100) + "%"; be.style.height = ((T[3] + 18) / vb[3] * 100) + "%";
    be.style.pointerEvents = jlTablaNyitva() ? "" : "none";
  }
  jlTablaRajz();
  if (JL.fog) jlFogRajz();
}
function jlTablaNyitva() { var k = JL && JL.def.kep(JL); return !!(k && k.tabla) && !(JL.def.tablaAll && JL.def.tablaAll(JL) === "var"); }
function jlTablaRajz() {
  var g = JL.svg.querySelector(".jl-tabla-hely"), T = jlKep().tabla; if (!g) return;
  if (!T) { g.innerHTML = ""; return; }
  var rossz = JL.rossz != null && !JL.beirt;
  g.innerHTML = kfSajatId(kfTabla(T[0], T[1], T[2], T[3], rossz ? JL.rossz : JL.beirt, JL.joMost ? "jo" : rossz ? "rossz" : jlTablaNyitva() ? "" : "var"), "jl");
}
function jlUniAllit(x, y) { JL.ux = x; JL.uy = y; if (JL.uni) JL.uni.setAttribute("transform", "translate(" + pcF(x) + " " + pcF(y) + ")"); }
/* az unikornis odasétál (x, y)-ra, aztán kesz() */
function jlUniSetal(x, y, kesz) {
  var x0 = JL.ux, y0 = JL.uy, n = lkCsokkent() || window.__UC_GYORS ? 1 : 14, i = 0, f = JL.f, ir = JL.svg.querySelector(".pc-uni-irany");
  if (ir) ir.style.setProperty("--dir", x < x0 ? -1 : 1);
  (function lep() {
    if (!JL || JL.f !== f || !JL.svg.isConnected) return;
    i++; jlUniAllit(x0 + (x - x0) * i / n, y0 + (y - y0) * i / n - (i < n ? Math.abs(Math.sin(i * 1.3)) * 4 : 0));
    if (i < n) setTimeout(lep, 55); else kesz();
  })();
}

/* ═════════════════ 🪨 FELVESZ – LETESZ ═════════════════ */
function jlPont(e) { var p = JL.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(JL.svg.getScreenCTM().inverse()); }
/* a legközelebbi letehető hely a mutató alatt (képernyő-px-ben: a hely köre és még egy fél kör) */
function jlLegkozelebbi(e) {
  var cel = null, legjobb = Infinity;
  [].forEach.call(JL.svg.querySelectorAll(".jl-hely"), function (h) {
    var r = h.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
    if (d < Math.max(r.width, r.height) * .85 && d < legjobb) { legjobb = d; cel = h.getAttribute("data-hely"); }
  });
  return cel;
}
function jlJeloles(cel) {   /* a kör, ahova most esne, kiemelődik */
  [].forEach.call(JL.svg.querySelectorAll(".jl-hely"), function (h) { h.classList.toggle("jl-cel", h.getAttribute("data-hely") === cel); });
}
function jlFogRajz() {
  var g = JL.svg.querySelector(".jl-fog-reteg"), F = JL.fog; if (!g) return;
  if (JL.def.fogRajz) { g.innerHTML = JL.def.fogRajz(JL, F); return; }   /* a kép maga rajzolja a kézben lévőt (pl. tallér) */
  g.innerHTML = kfSajatId('<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 6) + ') scale(1.15)"><ellipse cx="0" cy="' + pcF(22 * F.m) + '" rx="' + pcF(20 * F.m) + '" ry="5" fill="#3c2a50" opacity=".2"/>' + kfKavics(0, 0, F.n, F.m, '', '') + '</g>', "jl");
}
function jlKatt(ev) {
  if (!jlAktiv()) return;
  var t = ev.target;
  if (JL.fog) {   /* a második koppintás leteszi */
    var F = JL.fog, hova = jlLegkozelebbi(ev);
    JL.fog = null; jlJeloles(null);
    JL.def.letesz(JL, F.id, F.n, hova);
    if (JL.fog == null && JL.svg.querySelector(".jl-fog-reteg")) JL.svg.querySelector(".jl-fog-reteg").innerHTML = "";
    return;
  }
  var k = t.closest ? t.closest(".jl-fog") : null;
  if (k && JL.def.felvesz) {
    var id = k.getAttribute("data-fog"), r = k.getBoundingClientRect(), m = +(k.getAttribute("data-m") || 1);
    var hely = jlPont({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }), n = JL.def.felvesz(JL, id);
    if (n == null) return;
    hangGomb();
    var p = ev.pointerType === "touch" || !ev.clientX ? { x: hely.x, y: hely.y - 30 * m } : jlPont(ev);   /* érintésnél a helye fölött vár */
    JL.fog = { id: id, n: n, m: m, x: p.x, y: p.y };
    jlRajz();
    return;
  }
  if (JL.def.katt) JL.def.katt(JL, t);
  jlFokusz();
}
function jlMozog(e) {
  if (!JL || !JL.fog || e.pointerType === "touch") return;
  var p = jlPont(e); JL.fog.x = p.x; JL.fog.y = p.y; jlFogRajz(); jlJeloles(jlLegkozelebbi(e));
}

/* ═════════════════ BEÍRÁS + VÁLASZ ═════════════════ */
function jlAktiv() { return JL && J && J.feladat === JL.f && JL.f && JL.f.jelenet && J.joVolt !== JL.f && !JL.lezart; }
function jlBillentyu(e) {
  if (!jlAktiv()) return;
  if (e.key === "Escape" && JL.fog) { e.preventDefault(); var F = JL.fog; JL.fog = null; jlJeloles(null); JL.def.letesz(JL, F.id, F.n, null); jlRajz(); return; }
  if (!jlTablaNyitva() || document.activeElement === $("jl-beiras")) return;   /* a mező maga kezeli a számjegyeket */
  var d = /^Digit[0-9]$/.test(e.code) ? e.code.charAt(5) : /^Numpad[0-9]$/.test(e.code) ? e.code.charAt(6) : /^[0-9]$/.test(e.key) ? e.key : null;   /* a fizikai hely (magyar kiosztás), mint events.js */
  if (d !== null) { e.preventDefault(); if (JL.beirt.length < 3) { JL.beirt += d; JL.rossz = null; hangGomb(); jlTablaRajz(); } }
  else if (e.key === "Backspace") { e.preventDefault(); JL.beirt = JL.beirt.slice(0, -1); jlTablaRajz(); }
  else if (e.key === "Enter") { e.preventDefault(); jlBekuld(); }
}
function jlBekuld() {
  if (!jlTablaNyitva()) { if (JL.def.tablaVarMondat) mondd(JL.def.tablaVarMondat(JL)); return; }
  if (JL.beirt === "") { jlFokusz(); return; }
  var v = parseInt(JL.beirt, 10);
  JL.beirt = ""; $("jl-beiras").value = "";
  JL.def.bekuld(JL, v);
}
/* a visszajelző sor + a hang (a kép a saját szavaival szól, nem meséli el, amit mutat) */
function jlSzol(szoveg, rossz) {
  var v = $("visszajelzes"); v.className = "visszajelzes" + (rossz ? " rossz" : ""); v.textContent = rossz ? szoveg : "";
  mondd(szoveg);
}
/* jó válasz: a kép lezár, és a motor értékel (✨, pötty, következő feladat). joKiir: ami a visszajelzésben áll („8 + 5 = 13”);
   naplo: ha a kép másik tényt kérdezett, mint amivel a feladat indult; elotte(kesz): a kép ünneplése az értékelés előtt */
function jlJo(joKiir, naplo, elotte) {
  var f = JL.f;
  JL.lezart = true; JL.joMost = true; JL.rossz = null;
  if (joKiir != null) f.joKiir = joKiir;
  if (naplo) f.naplo = naplo;
  jlRajz();
  var tovabb = function () { if (J && J.feladat === f) ertekel(f.helyes); };
  if (elotte) elotte(tovabb); else setTimeout(tovabb, lkCsokkent() ? 0 : 350);
}
/* rossz válasz: könyvelés (próbaszám, napló, hiba-hang) + a hiba-lépcső foka (1. hiba → 1 · 2. hibától → 2). naplo: a hibás tény */
function jlRossz(cimke, naplo) {
  rosszValaszKonyvel(naplo ? { naplo: naplo } : JL.f, cimke);
  JL.seg = Math.min(2, J.probak);
  ment();
}

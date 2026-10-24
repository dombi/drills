/* ============ 6k2) 🐉 KÖLYÖK AZ ÖSVÉNYEN — a megtalált kölyöksárkány elkíséri az unikornist ============
   Terv: terv/kolyok-osveny-terv.html (✅ jóváhagyva 2026-10-14: mögötte-fölötte; pult-kapcsoló, alapból be; nincs külön rajzterv).
     • Csak a megtalált kölyök kísér (P().leny2.fazis === "kolyok"), mindig a saját unikornisé (lenyTar, lenyPal).
       Új mentés nem kell. Amíg a sárkány nem nő (LENY_NAP.kolyok = 0), fióka-méretű (lenyKolyokAlak).
     • A közös ösvény-rajzoló (osveny.js) adja a helyét: osvenyVaz → lenyKiserSVG (az unikornis mögé rajzolva),
       osvenyIndul → lenyKiserIndul, osvenyOrom → lenyKiserOrom, osvenyOduba → lenyKiserOduba. Így mind a négy
       pályacsaládon (erdő, mérés, vásár, könyvtár) egyszerre él.
     • Kis késéssel követi az unikornist (saját rAF-hurok, csillapított közelítés), mögötte és fölötte lebeg,
       puhán csapkod; ha az unikornis megfordul, átrepül a másik oldalára, és ő is megfordul.
     • Jó válasz: szikrát tüsszent és röppen egyet (az örömugrással egyszerre); 3 jó egymás után: buborék is.
       Rossz válasz: semmi (tiltólista). Koppintás: tüsszent, jutalom nélkül.
     • Nyugodt mód (kevesebb mozgás): ott van és követ, de nem lebeg, nem tüsszent.
   PULT: producerConfig/{uid}.leny és groups/{gid}.leny = { kiser: bool } — alap < csoport < egyéni; több csoportnál
   a bekapcsolt nyer (mint a 📋 tábla). A pult (admin/index.html) ugyanezt a fájlt tölti be: itt csak függvény-definíció
   lehet, felső szinten semmi nem futhat, ami a játék globálisaira épül. */

/* kuld: 🐉 sárkány-küldetés (kuldetes.js, 2026-10-17) — ugyanebben a pult-ágban, ugyanezzel a szabállyal.
   4. kör (2026-10-18): + kuldLiget (melyik ligetből kér; egyéni > az első csoport, amelyik megadja), kuldPalyak (kézi
   pályalista bármelyik ligetből; egyéni > a csoportok listáinak uniója; nincs = a játék rakja össze), megsem (csak
   egyéni: { "leny|palyaId": időbélyeg } — a „mégsem megy” gomb; a tudás-napló egyszer veszi át, tudas.js tudasPultVissza).
   Pult-változás csak a KÖVETKEZŐ küldetésre hat (a futó nem változik, 4. döntés). */
var LENY_BEALL_ALAP = { kiser: true, kuld: true };
var LENY_KULD_LIGET_ALAP = "gepi";   /* a játék választ (kuldetes.js kuldGepiLiget; producer 2026-10-20 — előtte "szorzo") */
/* a pult beállításainak összevonása — a pult is ezt hívja (lenyHatas) */
function lenyBeallOsszevon(egyeni, csoportok) {
  var ki = {};
  Object.keys(LENY_BEALL_ALAP).forEach(function (k) {
    (csoportok || []).forEach(function (c) {
      if (!c) return;
      if (c[k] === true) ki[k] = true; else if (c[k] === false && ki[k] !== true) ki[k] = false;
    });
    if (egyeni && typeof egyeni[k] === "boolean") ki[k] = egyeni[k];
  });
  var cs = (csoportok || []).filter(Boolean);
  cs.forEach(function (c) { if (typeof c.kuldLiget === "string" && !ki.kuldLiget) ki.kuldLiget = c.kuldLiget; });
  if (egyeni && typeof egyeni.kuldLiget === "string") ki.kuldLiget = egyeni.kuldLiget;
  cs.forEach(function (c) {
    if (!Array.isArray(c.kuldPalyak)) return;
    ki.kuldPalyak = ki.kuldPalyak || [];
    c.kuldPalyak.forEach(function (id) { if (ki.kuldPalyak.indexOf(id) < 0) ki.kuldPalyak.push(id); });
  });
  if (egyeni && Array.isArray(egyeni.kuldPalyak)) ki.kuldPalyak = egyeni.kuldPalyak.slice();
  if (egyeni && egyeni.megsem && typeof egyeni.megsem === "object") ki.megsem = egyeni.megsem;
  return ki;
}
function lenyBeall(f) {
  f = f || (typeof FELULIR !== "undefined" && FELULIR.leny) || {};
  var ki = {};
  Object.keys(LENY_BEALL_ALAP).forEach(function (k) { ki[k] = typeof f[k] === "boolean" ? f[k] : LENY_BEALL_ALAP[k]; });
  ki.kuldLiget = typeof f.kuldLiget === "string" && f.kuldLiget ? f.kuldLiget : LENY_KULD_LIGET_ALAP;
  ki.kuldPalyak = Array.isArray(f.kuldPalyak) && f.kuldPalyak.length ? f.kuldPalyak.slice() : null;   /* null = a játék rakja össze */
  ki.megsem = f.megsem && typeof f.megsem === "object" ? f.megsem : {};
  return ki;
}

/* ── hol és mekkora: pálya-egységben, az unikornis talppontjához képest (az unikornis 0.62-es méretű az ösvényen) ── */
var KISER = { hatra: 74, fel: 118, meret: 0.5, tau: 0.32, halo: 6 };
var _ks = null;   /* a futó kíséret: { x, y, nez, oduba, t, el } */

function lenyKiserVan() {
  if (typeof P !== "function" || !P()) return false;
  var l = lenyTar();
  return l.fazis === "kolyok" && lenyBeall().kiser && nyitasEbren("kolyok");   /* 🚪 újonc: a kölyök a menet napján kezd kísérni (nyitas.js) */
}
/* az osvenyVaz rajzolja, közvetlenül az unikornis ELÉ a rétegsorban (így az unikornis takarja, ha összeérnek) */
function lenyKiserSVG(x, y) {
  if (!lenyKiserVan()) return "";
  var l = lenyTar(), kx = x - KISER.hatra, ky = y - KISER.fel;
  return '<g id="kiser-hely" transform="translate(' + kx.toFixed(1) + "," + ky.toFixed(1) + ')" role="button" aria-label="' + htmlVed(l.nev || "Kölyök") + '">' +
    '<g id="kiser-flip" style="transform:scale(1,1)"><g class="kiser-lebeg"><g id="kiser-rebben"><g transform="scale(' + KISER.meret + ')">' +
    (lenyKolyokAlak() === "fioka" ? shKolyokRajz(lenyPal(), { cls: "kiser" }) : lenyRajz(lenyKolyokAlak(), lenyPal(), { cls: "kiser" })) + '</g></g></g></g>' +
    '<rect x="-30" y="-58" width="62" height="64" fill="transparent"/></g>';
}
/* pálya-indításkor (osvenyIndul): a helyére teszi, és elindítja a követést */
function lenyKiserIndul() {
  var el = document.querySelector("#szinpad #kiser-hely");
  _ks = null;
  if (!el) return;
  _ks = { el: el, x: OSV.x - KISER.hatra, y: OSV.y - KISER.fel, nez: 1, oduba: null, t: performance.now() };
  el.addEventListener("click", function (e) { e.stopPropagation(); lenyKiserKopp(); });
  var ks = _ks;
  requestAnimationFrame(function lep(most) {
    if (ks !== _ks || !ks.el.isConnected) return;
    lenyKiserLep(ks, most);
    requestAnimationFrame(lep);
  });
}
/* egy képkocka: a cél az unikornis mögött-fölött; csillapítva közelít (kis késéssel repül utána) */
function lenyKiserLep(ks, most) {
  var dt = Math.min(0.1, (most - ks.t) / 1000); ks.t = most;
  var uel = document.getElementById("uni-irany"), dir = typeof uniIrany === "function" ? uniIrany(uel) : 1;
  var tx = OSV.x - dir * KISER.hatra, ty = OSV.y - KISER.fel, op = 1, sk = 1;
  if (ks.oduba) {   /* pálya vége: az unikornis után berepül az odú ajtaján */
    tx = ks.oduba.x; ty = ks.oduba.y;
    var e = Math.min(1, Math.max(0, (most - ks.oduba.t0 - 250) / 700));
    op = 1 - e; sk = 1 - 0.55 * e;
  }
  if (nyugiMod() || window.__UC_GYORS) { ks.x = tx; ks.y = ty; }
  else { var k = 1 - Math.exp(-dt / KISER.tau); ks.x += (tx - ks.x) * k; ks.y += (ty - ks.y) * k; }
  ks.x = Math.max(36, Math.min(1164, ks.x)); ks.y = Math.max(64, ks.y);
  /* merre néz: amerre repül; ha már a helyén van, amerre az unikornis */
  var dx = tx - ks.x, nez = Math.abs(dx) > KISER.halo ? (dx < 0 ? -1 : 1) : dir;
  if (nez !== ks.nez) { ks.nez = nez; lenyFordul(ks.el.querySelector("#kiser-flip"), nez); }   /* felénk fordul, nem lapul össze */
  ks.el.setAttribute("transform", "translate(" + ks.x.toFixed(1) + "," + ks.y.toFixed(1) + ")" + (sk < 1 ? " scale(" + sk.toFixed(3) + ")" : ""));
  if (ks.oduba) ks.el.setAttribute("opacity", op.toFixed(3));
}
/* jó válasz (osvenyOrom): szikra + röppenés; minden 3. jó egymás után buborék is */
function lenyKiserOrom() {
  if (!_ks || !_ks.el.isConnected || nyugiMod()) return;
  var el = _ks.el;
  lenyTusszent(el);
  var r = el.querySelector("#kiser-rebben");
  if (r) { r.classList.remove("ki"); void r.getBBox(); r.classList.add("ki"); }
  var sor = (typeof J !== "undefined" && J.streak) || 0;
  if (sor >= 3 && sor % 3 === 0) Array.prototype.forEach.call(el.querySelectorAll("[data-bub]"), function (b, i) {
    b.classList.remove("ki"); b.style.animationDelay = (0.25 + i * 0.3) + "s"; void b.getBBox(); b.classList.add("ki");
  });
}
/* koppintás: csak játék — tüsszent, nincs jutalom */
function lenyKiserKopp() {
  if (!_ks || nyugiMod()) return;
  lenyTusszent(_ks.el);
  if (typeof hangGomb === "function") hangGomb();
}
/* pálya vége (osvenyOduba): az ajtó felé repül, és eltűnik benne */
function lenyKiserOduba(x, y) {
  if (!_ks || !_ks.el.isConnected) return;
  if (nyugiMod() || window.__UC_GYORS) { _ks.el.setAttribute("opacity", "0"); return; }
  var vitt = kuldKiserDarab(_ks.el);   /* 🐉 ha ez a pálya a sárkány kérése: felkap egy darabot, és azt viszi be (sarkany-holmi.js) */
  _ks.oduba = { x: x, y: y - 30, t0: performance.now() + (vitt ? 700 : 0) };   /* a darabbal kicsit tovább látszik */
}

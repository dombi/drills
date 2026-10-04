/* fordulas-proto.js — PRÓBA a 4. lépéshez (közös fordulás, pörgés, indulás/megállás).
   Csak a mozgó előnézet (terv/fordulas-build.py) tölti be. Jóváhagyás után a renderer.js-be költözik,
   ez a fájl megszűnik (mint a 3. lépésnél a jaras-proto.js).

   Egy unikornis-elem (el) = az a HTML/SVG elem, amelyiken a --dir (irány: 1 jobbra, -1 balra) ül,
   és amelyikben a unikornisSVG() rajza van. A nézet-képhez (szemből/hátulról) kell a lény adata:
   uniNezoAdat(el, {rajz, kinezet, oltozet}) — rajzoláskor egyszer. */
var UNI_FORDUL = {
  ido: .34,            /* mp: ennyi ideig látszik a köztes nézet (szemből vagy hátulról) */
  nezet: "elol",       /* "elol" = felénk fordul · "hatul" = elfordul · "valt" = jobbra fordulva szemből, balra hátulról */
  porges: [0, 6, 0, 10, 0, 6, 0, 10],   /* pörgés: a nézetenkénti kis ugrás (rajz-egység, a .uni-magas réteggel) */
  simit: .22           /* mp: megálláskor a lábak ennyi idő alatt simulnak álló helyzetbe */
};
var _uniNezoSzam = 0;
function uniNezoAdat(el, adat) { if (el) { el._uniNezo = adat; el._uniNezoPfx = "nz" + (++_uniNezoSzam); } }
function uniIrany(el) { return el && +el.style.getPropertyValue("--dir") < 0 ? -1 : 1; }
/* a köztes nézet (szemből/hátulról) rárakása az oldalrajz helyére; null → vissza az oldalrajzra */
function uniNezetMutat(el, nezet) {
  var reteg = el.querySelector(".uni-nezet-reteg");
  if (reteg) reteg.parentNode.removeChild(reteg);
  el.classList.toggle("uni-nezetben", !!nezet);
  if (!nezet) return;
  var magas = el.querySelector(".uni-magas"), a = el._uniNezo || {};
  if (!magas) return;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "uni-magas uni-nezet-reteg");
  g.innerHTML = '<g class="uni-elo">' + unikornisNezetArt(nezet, a.rajz || "korall", a.kinezet || null, el._uniNezoPfx, a.oltozet || null) + '</g>';
  magas.parentNode.appendChild(g);
}
/* FORDULÁS: oldalról → (szemből vagy hátulról) → a másik oldalra. kesz() a végén. */
function uniFordul(el, dir, kesz) {
  if (!el) { if (kesz) kesz(); return; }
  dir = dir < 0 ? -1 : 1;
  clearTimeout(el._fordulTimer);
  if (uniIrany(el) === dir) { uniNezetMutat(el, null); if (kesz) kesz(); return; }
  if (typeof nyugiMod === "function" && nyugiMod()) { el.style.setProperty("--dir", dir); if (kesz) kesz(); return; }
  var n = UNI_FORDUL.nezet === "valt" ? (dir < 0 ? "hatul" : "elol") : UNI_FORDUL.nezet;
  uniAll(el);
  uniNezetMutat(el, n);
  el.style.setProperty("--dir", dir);   /* a köztes nézet takarásában tükrözünk: nem látszik */
  el._fordulTimer = setTimeout(function () { uniNezetMutat(el, null); if (kesz) kesz(); }, UNI_FORDUL.ido * 1000);
}
/* PÖRGÉS: kétszer körbe (oldal → szemből → másik oldal → hátulról), minden nézetben kis ugrás.
   Ugyanez a kertben, a felhőkertben (a saját és a többiek unikornisán is). */
function uniPorog(el, ms, kesz) {
  if (!el) { if (kesz) kesz(); return; }
  var d0 = uniIrany(el), kockak = UNI_FORDUL.porges, i = 0, km = ms / kockak.length;
  clearTimeout(el._fordulTimer);
  uniAll(el);
  if (typeof nyugiMod === "function" && nyugiMod()) { el._fordulTimer = setTimeout(function () { if (kesz) kesz(); }, ms); return; }
  el.classList.add("uni-porog");
  (function kocka() {
    if (i >= kockak.length) {
      uniNezetMutat(el, null); el.style.setProperty("--dir", d0);
      el.style.removeProperty("--uni-magas"); el.classList.remove("uni-porog");
      if (kesz) kesz(); return;
    }
    var f = i % 4;   /* 0: oldal, 1: szemből, 2: a másik oldal, 3: hátulról */
    uniNezetMutat(el, f === 1 ? "elol" : f === 3 ? "hatul" : null);
    el.style.setProperty("--dir", f === 2 ? -d0 : d0);
    el.style.setProperty("--uni-magas", kockak[i]);
    i++;
    el._fordulTimer = setTimeout(kocka, km);
  })();
}
/* INDULÁS: a lépésciklus abból a pillanatából indul, ahol a lábak a legközelebb vannak az álló helyzethez
   (gép keresi meg) → nincs nagy rándulás. MEGÁLLÁS: a lábak, a test, a fej és a farok simán állnak vissza. */
var UNI_JARAS_INDUL = {};
function uniJarasIndul(nev) {
  if (UNI_JARAS_INDUL[nev] != null) return UNI_JARAS_INDUL[nev];
  var md = UNI_JARAS[nev], legjobb = 0, min = 1e9;
  for (var k = 0; k < UNI_JARAS_LEPES; k++) {
    var a = uniJarasAllas(md, k / UNI_JARAS_LEPES), s = 0;
    a.lab.forEach(function (l) { s += l[0] * l[0] + l[1] * l[1]; });
    s += a.t[0] * a.t[0] * 40 + a.t[2] * a.t[2] * 4 + a.fe * a.fe;
    if (s < min) { min = s; legjobb = k / UNI_JARAS_LEPES; }
  }
  return (UNI_JARAS_INDUL[nev] = legjobb);
}
function uniJarSima(el, ut) {
  if (!el) return;
  el.style.setProperty("--jar-kezd", (-uniJarasIndul(ut.mod) * UNI_JARAS[ut.mod].ido / ut.tempo).toFixed(3) + "s");
  uniJar(el, ut);
}
function uniAllSima(el) {
  if (!el || !(el.classList.contains("uni-jar-seta") || el.classList.contains("uni-jar-uget"))) { uniAll(el); return; }
  var reszek = el.querySelectorAll(UNI_IZ_CSOPORT), most = [];
  for (var i = 0; i < reszek.length; i++) most.push(getComputedStyle(reszek[i]).transform);
  for (i = 0; i < reszek.length; i++) { reszek[i].style.transition = "none"; reszek[i].style.transform = most[i]; }
  uniAll(el);
  void el.getBoundingClientRect();
  for (i = 0; i < reszek.length; i++) { reszek[i].style.transition = "transform " + UNI_FORDUL.simit + "s ease-out"; reszek[i].style.transform = ""; }
  clearTimeout(el._simitTimer);
  el._simitTimer = setTimeout(function () { for (var j = 0; j < reszek.length; j++) reszek[j].style.transition = ""; }, UNI_FORDUL.simit * 1000 + 50);
}
function uniForduloCSS() {
  return ".uni-nezetben .uni-magas:not(.uni-nezet-reteg){visibility:hidden}\n" +
         ".uni-porog .uni-magas{transition:transform .08s ease-out}\n" +
         ".uni-porog .uni-arnyek{display:inline}\n";
}

/* ============ 6k4) 🐉 KÖLYÖK-MOZDULATOK — a kölyök egész alakban, mozdulatokkal (Kissárkány a boltban, 2026-10-24) ============
   Terv: terv/kissarkany-a-boltban-terv.html · rajz: terv/kissarkany-bolt-rajzterv.html (✅ mindkettő jóváhagyva 2026-10-24).
   A kölyök UGYANAZ a rajz, mint az odúban, a kertben és az ösvényen (sarkany-holmi.js shKolyokRajz: a saját színe, a rajta
   lévő ruhák); ez a modul csak megmozgatja. A testrészek a meglévő csoportjaikkal forognak (sz-fej, sz-szarny, sz-farok),
   a mai rövid kar helyett hosszabb BOLTI MANCS kerül a ruhák fölé (a sál eltakarta volna).
     var K = new KolyokFig(gElem, { x, y, s, dir, poz });   — x, y: talppont az SVG-ben; dir: 1 jobbra, -1 balra néz
     K.poz("orul", ms) — ms után vissza az alaphoz (K.alap) · K.setal(x1, ms, kesz) — besétál, billegve
   Pózok: var · koszon · orul · gondol · mancs · visszatol (új póz = egy sor a KM_POZ-ban). Minden pózváltás átmenettel megy.
   ARÁNY (producer, 2026-10-24): a kölyök mindig kisebb az unikornisnál, az odú arányában — KM_ARANY × az unikornis mérete.
   Mozgáscsökkentésnél (lkCsokkent) a póz azonnal vált, nincs ugrálás, nincs séta; a pislogás marad.
   🔒 A kölyök soha nem súg: a hívó csak a gyerek lépése UTÁN vált pózt (amíg a gyerek számol: „var”). */

var KM_ARANY = LENY_ODU.s / 1.28;   /* az odúban: unikornis 1 × 1.28 (odu.js), kölyök LENY_ODU.s */
var KM_POZ = {
  "var":     { fej: 0,   szarny: 0,   farok: 0,  kar: 30,   lean: 0 },
  koszon:    { fej: -8,  szarny: -6,  farok: 6,  kar: -115, lean: -2, integet: 1 },
  orul:      { fej: -14, szarny: -26, farok: 12, kar: -100, lean: -4, ugrik: 1, rebben: 1 },
  gondol:    { fej: 20,  szarny: 0,   farok: -4, kar: -112, lean: 3 },
  mancs:     { fej: 12,  szarny: -4,  farok: 4,  kar: -22,  lean: -7 },
  visszatol: { fej: 6,   szarny: 0,   farok: 0,  kar: -8,   lean: -9, tol: 1 }
};
var KM_PIVOT = { fej: [8, -42], szarny: [-4, -40], farok: [-20, -16], kar: [12, -30] };   /* a fióka-alak ízületei (LENY_RAJZ.fioka) */
var KM_NS = "http://www.w3.org/2000/svg";
var _kmLista = [], _kmFut = false, _kmUtso = 0;

function KolyokFig(szulo, o) {
  o = o || {};
  this.x = o.x || 0; this.y = o.y || 0; this.s = o.s || 1; this.dir = o.dir || 1;
  this.g = document.createElementNS(KM_NS, "g"); this.g.setAttribute("class", "km-kolyok"); szulo.appendChild(this.g);
  this.alap = o.poz || "var"; this.nev = this.alap; this.pt = 0; this.seta = null; this.setaV = 0;
  this.v = {}; for (var k in KM_POZ["var"]) this.v[k] = KM_POZ[this.alap][k];
  this.t0 = performance.now(); this.pislog = this.t0 + 1500 + Math.random() * 1500;
  this.rajzol(); _kmLista.push(this); kmIndit();
}
KolyokFig.prototype.rajzol = function () {
  var self = this, p = lenyPal();
  this.g.innerHTML = '<g class="km-test">' + shKolyokRajz(p) + '</g>';
  this.test = this.g.firstChild; this.r = {};
  function fog(el, nev) { if (!el) return; var w = document.createElementNS(KM_NS, "g"); el.parentNode.insertBefore(w, el); w.appendChild(el); self.r[nev] = w; }
  fog(this.test.querySelector(".sz-fej"), "fej");
  fog(this.test.querySelector(".sz-szarny"), "szarny");
  fog(this.test.querySelector(".sz-farok"), "farok");
  /* a bolti mancs: a fióka rövid karja (M14 -28…) helyett, a ruhák FÖLÖTT */
  Array.prototype.forEach.call(this.test.querySelectorAll("path"), function (q) { if (/^M14 -28q/.test(q.getAttribute("d") || "")) q.setAttribute("display", "none"); });
  var w = document.createElementNS(KM_NS, "g"), kd = "M12 -30q9 6 19 5";
  w.innerHTML = '<path d="' + kd + '" fill="none" stroke="' + p.d + '" stroke-width="12.8" stroke-linecap="round"/><path d="' + kd + '" fill="none" stroke="' + p.b + '" stroke-width="8" stroke-linecap="round"/>' +
    '<circle cx="31" cy="-25" r="6.2" fill="' + p.b + '" stroke="' + p.d + '" stroke-width="2.2"/>' +
    [[35.5, -28.5], [37, -24.5], [35.5, -20.5]].map(function (t) { return '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="2" fill="' + p.has + '" stroke="' + p.d + '" stroke-width="1.2"/>'; }).join("");
  (this.test.querySelector(".sh-kolyok") || this.test).appendChild(w); this.r.kar = w;
  this.szemek = Array.prototype.slice.call(this.test.querySelectorAll(".sz-szem"));
  this.kirak();
};
KolyokFig.prototype.poz = function (nev, ms) {
  var self = this; clearTimeout(this.vt);
  this.nev = KM_POZ[nev] ? nev : "var"; this.pt = performance.now();
  if (lkCsokkent()) { var c = KM_POZ[this.nev]; for (var k in KM_POZ["var"]) this.v[k] = c[k]; this.kirak(); }
  if (ms) this.vt = setTimeout(function () { self.poz(self.alap); }, ms);
};
KolyokFig.prototype.setal = function (x1, ms, kesz) {
  if (lkCsokkent()) { this.x = x1; this.seta = null; this.kirak(); if (kesz) kesz(); return; }
  this.seta = { x0: this.x, x1: x1, t0: performance.now(), ms: ms || 1200, kesz: kesz };
};
KolyokFig.prototype.kirak = function () {
  var v = this.v, R = this.r;
  this.g.setAttribute("transform", "translate(" + this.x.toFixed(1) + " " + this.y.toFixed(1) + ") scale(" + (this.s * this.dir).toFixed(3) + " " + this.s.toFixed(3) + ")");
  this.test.setAttribute("transform", "translate(0 " + ((v.dy || 0) + this.setaV).toFixed(2) + ") rotate(" + v.lean.toFixed(2) + ")");
  ["fej", "szarny", "farok", "kar"].forEach(function (n) { if (R[n]) R[n].setAttribute("transform", "rotate(" + v[n].toFixed(2) + " " + KM_PIVOT[n][0] + " " + KM_PIVOT[n][1] + ")"); });
};
KolyokFig.prototype.lep = function (most, dt) {
  var c = KM_POZ[this.nev], v = this.v, csok = lkCsokkent(), k = csok ? 1 : Math.min(1, dt * 7), t = (most - this.t0) / 1000, pt = (most - this.pt) / 1000;
  for (var n in KM_POZ["var"]) v[n] += (c[n] - v[n]) * k;
  v.dy = 0;
  if (!csok) {
    v.farok += 5 * Math.sin(t * 1.8) * k;                                   /* a farok mindig lassan leng */
    v.szarny += (c.rebben ? 16 * Math.sin(t * 16) : 2.5 * Math.sin(t * 2.3)) * k;
    if (c.ugrik && pt < 1.6) v.dy = -9 * Math.abs(Math.sin(pt * 7));     /* kis ugrások, aztán áll */
    if (c.tol && pt < 1.4) v.kar += 14 * Math.sin(pt * 9) * k;            /* kétszer előretol */
    if (c.integet && pt < 1.6) v.kar += 22 * Math.sin(pt * 11) * k;       /* integet */
  }
  if (this.seta) {                                                        /* besétál: billeg, a lépésekre bólint */
    var S = this.seta, u = Math.min(1, (most - S.t0) / S.ms);
    this.x = S.x0 + (S.x1 - S.x0) * (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    this.setaV = -4 * Math.abs(Math.sin(u * Math.PI * 6)); v.lean = 3 * Math.sin(u * Math.PI * 6);
    if (u >= 1) { this.seta = null; this.setaV = 0; if (S.kesz) S.kesz(); }
  }
  if (most > this.pislog && this.szemek.length) {                         /* pislogás (mozgáscsökkentésnél is) */
    var sz = this.szemek;
    try {
      sz.forEach(function (e) { var b = e.getBBox(), cy = (b.y + b.height / 2).toFixed(1); e.setAttribute("transform", "translate(0 " + cy + ") scale(1 .12) translate(0 " + (-cy) + ")"); });
      setTimeout(function () { sz.forEach(function (e) { e.removeAttribute("transform"); }); }, 130);
    } catch (e) {}
    this.pislog = most + 2400 + Math.random() * 2600;
  }
  this.kirak();
};
/* egy közös képkocka-hurok; magától leáll, ha egyetlen kölyök sincs a lapon (mint a lakók hurka) */
function kmIndit() {
  if (_kmFut) return; _kmFut = true; _kmUtso = performance.now();
  requestAnimationFrame(function lep(most) {
    var dt = Math.min(.05, (most - _kmUtso) / 1000); _kmUtso = most;
    _kmLista = _kmLista.filter(function (k) { return k.g.isConnected; });
    if (!_kmLista.length) { _kmFut = false; return; }
    _kmLista.forEach(function (k) { k.lep(most, dt); });
    requestAnimationFrame(lep);
  });
}

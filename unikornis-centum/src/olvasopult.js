/* ============ 6n) 📖 OLVASÓPULT — a hosszú szöveges feladatok közös „nyitott könyve” ============
   Rajz: Matekos\szerszam-letrak-rajzterv.html 3. pont (✅ 2026-10-09; producer: BAL = szöveg + kérdés, JOBB = rajz,
   telefonon a rajz fent, a szöveg alatta). Most a 🧰 szerszám-létrák használják (szerszam-palya.js); a régi könyvtári
   pályák később ugyanezt kapják — ezért egy darab modul, a feladattól független.

   Mit tud:
     opKonyv(o)        → a könyv HTML-je (a feladat kartyaHTML-je): fent vékony ösvény-csík + 3 betűméret (A A A),
                         bal lap: mondatonként külön sor + a kérdés (lilával, legnagyobb betűvel), jobb lap: a rajz.
                         o = { mondatok: [html…], kerdes: html, rajz: html, fuzet: { mondatok, kerdes } | null, halvany }
                         A 🛗 lift kis füzete (o.fuzet) rózsaszín szélű lapként fekszik a bal lapon, ferdén; alatta
                         halványan látszik a nagy feladat. Felirat nincs rajta (se „Mesekönyv”, se „könnyebb”).
     opLapol()         → ha a bal lap szövege nem fér el, előbb egy fokkal kisebb betű, és csak utána lapokra bontja
                         (sarok-fül →); a kérdés mindig az utolsó lapon. A 🔊 „Halld újra” a könyv fejlécében van.
                         Nincs görgetés. A rajz lapozáskor is a helyén marad.
     opFelolvas(f, k)  → mondatonként felolvas, és közben kiemeli a sort, amit mond (a lapot is odalapozza).
     opJelol(i, resz)  → egy mondat kiemelése (rossz válasznál: „ez a mondat nem stimmel”); opJelolTorol().
     opLepesLap(), opLepes(html) → a végigvezetés a könyv második lapjára kerül: „a bagoly lapoz egyet”.
     A 📚 olvasó-polc (olvaso-polc.js, 2026-10-10) még: o.kerdesHely (a kérdés a mese közepén / elején), o.rejt (a kérdés addig
     nem lila, amíg a gyerek meg nem találja), o.lepcso (🪜 lépcsőfok-sor a kérdés alatt), o.segit (🙋 a fejlécben), o.mester (arany szegély).
   A betűméret (1–3) gyerekenként megmarad: P().opBetu. */

var OP_SORSZ = ["első", "második", "harmadik", "negyedik", "ötödik", "hatodik"];

function opBetu() { var b = +(P().opBetu || 2); return b >= 1 && b <= 3 ? b : 2; }
function opBetuAllit(b) {
  P().opBetu = b; ment();
  var k = $("kepernyo-jatek"); if (!k) return;
  k.classList.remove("op-b1", "op-b2", "op-b3"); k.classList.add("op-b" + b);
  Array.prototype.forEach.call(document.querySelectorAll(".op-betu button"), function (x) { x.classList.toggle("akt", +x.getAttribute("data-b") === b); });
  opLapol();
}
/* a lapozó-állapot: melyik lapon áll a bal oldal */
var OP = { lap: 0, lapDb: 1, olvasTok: 0 };

/* vékony ösvény-csík: annyi pötty, ahány feladat, az unikornis a mostaninál */
function opCsik() {
  if (!J || !J.feladatDb) return "";
  var s = "";
  for (var i = 0; i < J.feladatDb; i++) s += '<i class="' + (i < J.feladatKesz ? "kesz" : i === J.feladatKesz ? "most" : "") + '">' + (i === J.feladatKesz ? "🦄" : "") + '</i>';
  return '<div class="op-csik" aria-hidden="true"><span class="op-csik-ut"></span>' + s + '</div>';
}
function opSorok(mondatok, cls) {
  return mondatok.map(function (m, i) { return '<p class="op-m' + (cls ? " " + cls : "") + '" data-m="' + i + '">' + m + '</p>'; }).join("");
}
/* a szöveg: mondatok + a kérdés (hely: hányadik mondat elé kerül — a 📚 olvasó-polc 🔍 formájában véletlen; alap: a végén)
   + a 🪜 lépcsőfok-sor a kérdés alatt (lepcso: kész html) */
function opSzoveg(mondatok, kerdes, hely, lepcso) {
  var M = mondatok.map(function (m, i) { return '<p class="op-m" data-m="' + i + '">' + m + '</p>'; }), q = '<p class="op-kerdes" data-m="k">' + kerdes + '</p>';
  if (hely != null && hely >= 0 && hely < M.length) M.splice(hely, 0, q); else M.push(q);
  return M.join("") + (lepcso ? '<div class="op-lepcso">' + lepcso + '</div>' : "");
}
function opKonyv(o) {
  var b = opBetu(), fz = o.fuzet;
  var bal = '<div class="op-szoveg' + (fz ? " op-alatta" : "") + '">' + opSzoveg(o.mondatok, o.kerdes, o.kerdesHely, fz ? "" : o.lepcso) + '</div>';
  if (fz) bal += '<div class="op-fuzet"><div class="op-szoveg">' + opSzoveg(fz.mondatok, fz.kerdes, fz.kerdesHely, fz.lepcso) + '</div></div>';
  bal += '<div class="op-lepesek" hidden></div>' +
    '<div class="op-lapozo" hidden><button class="op-lapoz-vissza" type="button" aria-label="vissza">←</button><span class="op-lapszam"></span><button class="op-lapoz-elore" type="button" aria-label="tovább">→</button></div>';
  return '<div class="op-konyv' + (fz ? " op-liftes" : "") + (o.rejt ? " op-rejtett" : "") + (o.mester ? " op-mester" : "") + '">' +
    '<div class="op-fej">' + opCsik() + (o.segit ? '<button type="button" class="op-segit" aria-label="Segítség">🙋</button>' : '') +
    '<button type="button" class="op-halld" aria-label="Halld újra">🔊</button><div class="op-betu" role="group" aria-label="betűméret">' +
      [1, 2, 3].map(function (x) { return '<button type="button" data-b="' + x + '" class="' + (x === b ? "akt" : "") + '">A</button>'; }).join("") + '</div></div>' +
    (o.segit ? '<div class="op-segitmenu" hidden></div>' : '') +
    '<div class="op-lapok"><div class="op-lap op-bal">' + bal + '</div><div class="op-gerinc"></div><div class="op-lap op-jobb">' + (o.rajz || "") + '</div></div>' +
  '</div>';
}
/* a bal lap aktív szövege: a füzet, ha van, különben a fő szöveg */
function opAktivSzoveg() {
  var bal = document.querySelector("#buborek-feladat .op-bal"); if (!bal) return null;
  return bal.querySelector(".op-fuzet .op-szoveg") || bal.querySelector(".op-szoveg");
}
/* lapokra bontás mérés alapján: a sorok addig kerülnek egy lapra, amíg elférnek.
   Előbb egy fokkal kisebb betűvel próbálja (op-szuk), és csak ha úgy sem fér el, akkor lapoz —
   a gyerek lássa egyszerre az egész szöveget (dobogó-javítás 3/4: a kötött mondat ne lapozódjon el). */
function opLapol() {
  var sz = opAktivSzoveg(), lapozo = document.querySelector("#buborek-feladat .op-lapozo"), konyv = document.querySelector("#buborek-feladat .op-konyv");
  if (!sz || !lapozo) return;
  var sorok = Array.prototype.slice.call(sz.children);
  sorok.forEach(function (x) { x.hidden = false; x.removeAttribute("data-lap"); });
  if (konyv) { konyv.classList.remove("op-szuk"); if (sz.scrollHeight > sz.clientHeight + 2) konyv.classList.add("op-szuk"); }
  if (!sorok.length || sz.scrollHeight <= sz.clientHeight + 2) { OP.lapDb = 1; OP.lap = 0; lapozo.hidden = true; sorok.forEach(function (x) { x.setAttribute("data-lap", 0); }); return; }
  var max = sz.clientHeight - 34, lap = 0, kezd = sorok[0].offsetTop;   /* 34: hely a lapozó-fülnek */
  sorok.forEach(function (x) {
    if (x.offsetTop > kezd && x.offsetTop + x.offsetHeight - kezd > max) { lap++; kezd = x.offsetTop; }
    x.setAttribute("data-lap", lap);
  });
  OP.lapDb = lap + 1; OP.lap = Math.min(OP.lap, lap);
  lapozo.hidden = false;
  opLapra(OP.lap);
}
function opLapra(n) {
  var sz = opAktivSzoveg(); if (!sz) return;
  OP.lap = Math.max(0, Math.min(OP.lapDb - 1, n));
  Array.prototype.forEach.call(sz.children, function (x) { var l = x.getAttribute("data-lap"); x.hidden = l != null && +l !== OP.lap; });
  var lsz = document.querySelector("#buborek-feladat .op-lapszam"); if (lsz) lsz.textContent = (OP.lap + 1) + " / " + OP.lapDb;
  var v = document.querySelector("#buborek-feladat .op-lapoz-vissza"), e = document.querySelector("#buborek-feladat .op-lapoz-elore");
  if (v) v.disabled = OP.lap === 0;
  if (e) e.disabled = OP.lap >= OP.lapDb - 1;
}
function opSorElem(i) { var sz = opAktivSzoveg(); return sz ? sz.querySelector('[data-m="' + i + '"]') : null; }
function opMutatSor(x) { if (x && x.getAttribute("data-lap") != null) opLapra(+x.getAttribute("data-lap")); }

/* felolvasás mondatonként, kiemeléssel. elo: ami előtte hangzik el (pl. a bagoly lift-mondata) */
function opFelolvas(f, kesz) {
  var tok = ++OP.olvasTok, sz = opAktivSzoveg();
  var lista = [];
  if (f.opElo) { lista.push({ t: f.opElo }); f.opElo = null; }
  var O = f.op.fuzet || f.op, M = O.mondatok, kh = O.kerdesHely != null && O.kerdesHely >= 0 && O.kerdesHely < M.length ? O.kerdesHely : M.length;
  M.forEach(function (m, i) { if (i === kh) lista.push({ t: O.kerdes, i: "k" }); lista.push({ t: m, i: i }); });
  if (kh === M.length) lista.push({ t: O.kerdes, i: "k" });
  if (O.lepcsoFel) lista.push({ t: O.lepcsoFel });   /* 🪜 a lépcsőfok kérdése (olvaso-polc.js) */
  var i = 0;
  (function kov() {
    if (tok !== OP.olvasTok || !J || J.feladat !== f) return;
    Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .op-m.olvas, #buborek-feladat .op-kerdes.olvas"), function (x) { x.classList.remove("olvas"); });
    if (i >= lista.length) { if (kesz) kesz(); return; }
    var e = lista[i++], x = e.i != null ? opSorElem(e.i) : null;
    if (x) { x.classList.add("olvas"); opMutatSor(x); }
    mondd(ekKiejt(e.t), kov);
  })();
  return sz;
}
function opOlvasAll() { OP.olvasTok++; Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .olvas"), function (x) { x.classList.remove("olvas"); }); }

/* egy mondat kiemelése a lapon (resz: a mondat egy darabja, ami nem stimmel) */
function opJelolTorol() {
  Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .op-m.nem, #buborek-feladat .op-kerdes.nem"), function (x) {
    x.classList.remove("nem"); if (x.getAttribute("data-eredeti") != null) { x.innerHTML = x.getAttribute("data-eredeti"); x.removeAttribute("data-eredeti"); }
  });
}
function opJelol(i, resz) {
  opJelolTorol();
  var x = opSorElem(i); if (!x) return;
  if (resz) {
    var h = x.innerHTML, j = h.indexOf(resz);
    if (j >= 0) { x.setAttribute("data-eredeti", h); x.innerHTML = h.slice(0, j) + "<mark>" + resz + "</mark>" + h.slice(j + resz.length); }
  }
  x.classList.add("nem"); opMutatSor(x);
  x.classList.remove("villan"); void x.offsetWidth; x.classList.add("villan");
}
function opKerdesVillan() {
  var x = opSorElem("k"); if (!x) return;
  opMutatSor(x); x.classList.remove("villan"); void x.offsetWidth; x.classList.add("villan");
}
/* végigvezetés: „a bagoly lapoz egyet” — a bal lapon a lépések sora (a szöveg a hátsó lapra kerül) */
function opLepesLap(cim) {
  var bal = document.querySelector("#buborek-feladat .op-bal"); if (!bal) return null;
  var L = bal.querySelector(".op-lepesek");
  bal.classList.add("op-masodik");
  L.hidden = false; L.innerHTML = '<p class="op-lepes-cim">' + (cim || "🦉 Nézzük meg együtt, lépésenként!") + '</p>';
  var lz = bal.querySelector(".op-lapozo"); if (lz) lz.hidden = true;
  return L;
}
function opLepes(h) {
  var L = document.querySelector("#buborek-feladat .op-lepesek"); if (!L) return null;
  var p = el("p", "op-lepes"); p.innerHTML = h; L.appendChild(p);
  try { p.scrollIntoView({ block: "nearest" }); } catch (e) {}
  return p;
}

/* a könyv gombjai (betűméret, lapozás) — egy delegált figyelő a feladat-buborékon */
(function () {
  function bekot() {
    var b = $("buborek-feladat"); if (!b || b.__op) return; b.__op = true;
    b.addEventListener("click", function (ev) {
      var t = ev.target.closest ? ev.target.closest("button") : null; if (!t || !b.querySelector(".op-konyv")) return;
      if (t.hasAttribute("data-b")) { hangGomb(); opBetuAllit(+t.getAttribute("data-b")); }
      else if (t.classList.contains("op-halld")) { var h = $("halld-ujra"); if (h) h.click(); }
      else if (t.classList.contains("op-lapoz-elore")) { hangGomb(); opLapra(OP.lap + 1); }
      else if (t.classList.contains("op-lapoz-vissza")) { hangGomb(); opLapra(OP.lap - 1); }
    });
    window.addEventListener("resize", function () { if (b.querySelector(".op-konyv")) opLapol(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bekot); else setTimeout(bekot, 0);
})();

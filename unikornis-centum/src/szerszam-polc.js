/* ============ 6q) 🧰 SZERSZÁM-SZEKRÉNY — a Holdfény-szárnyban: szerszám = polc, 3 tárgy, névtábla-fény, 🧰 láda ============
   Rajz: Matekos\szerszam-letrak-rajzterv.html 1–2. + 7. pont (✅ 2026-10-09). Nem kártyasor, hanem könyvespolc:
     - egy szerszám = egy polc; elöl réz névtábla az ikonnal és a mondattal; a tábla FÉNYE mutatja, mennyire közel a láda
       (szerszamFeny 0–1) — számot, csíkot a gyerek nem lát;
     - a polcon balról jobbra: 📖 mesekönyv · 📜 tekercs a tartójában · 🏅 aranykötésű könyv szalaggal (a szalag dísz, nem zár:
       koppintásra lecsúszik). Mindhárom mindig levehető: nincs nyíl, nincs lakat, nincs ▢▢▢;
     - elsőre jó Mesterpróba → rózsaszín mester-szalag a táblán; ládában → a tábla teljes fénnyel ég, kis másolata a ládában ül;
     - a még nem nyitott szerszám polca NEM látszik (nincs üres, poros, lezárt polc) — a pult nyitja (szerszamLatszik).
   A láda pillanata (7. pont): a pálya vége után, a szekrényhez visszatérve az ikon csillámcsíkon a ládába repül,
   a fedél kinyílik, majd becsukódik (szerszamTar().ujLada jelzi, egyszer). */

var SZP_TARGY = {
  mese: '<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M8,12 Q20,6 30,12 L30,50 Q20,44 8,50 Z" fill="#9ec9f0" stroke="#4a6a9a" stroke-width="2"/><path d="M52,12 Q40,6 30,12 L30,50 Q40,44 52,50 Z" fill="#c3d7f7" stroke="#4a6a9a" stroke-width="2"/><path d="M13,20 Q20,17 26,20 M13,27 Q20,24 26,27 M34,20 Q40,17 47,20 M34,27 Q40,24 47,27" stroke="#4a6a9a" stroke-width="1.4" fill="none" opacity=".6"/></svg>',
  tekercs: '<svg viewBox="0 0 60 56" aria-hidden="true"><rect x="10" y="44" width="40" height="7" rx="3" fill="#a8743c" stroke="#6e4a22" stroke-width="1.6"/><path d="M14,44 L18,36 M46,44 L42,36" stroke="#6e4a22" stroke-width="2.2"/><rect x="12" y="10" width="36" height="28" rx="2" fill="#fbecc4" stroke="#b98a3a" stroke-width="2"/><ellipse cx="12" cy="24" rx="5" ry="14" fill="#f3d99a" stroke="#b98a3a" stroke-width="2"/><ellipse cx="48" cy="24" rx="5" ry="14" fill="#f3d99a" stroke="#b98a3a" stroke-width="2"/><path d="M20,18 H40 M20,24 H38 M20,30 H36" stroke="#b98a3a" stroke-width="1.4" opacity=".6"/></svg>',
  mester: '<svg viewBox="0 0 60 56" aria-hidden="true"><ellipse cx="30" cy="50" rx="24" ry="5" fill="#c9a8e6"/><rect x="12" y="10" width="36" height="38" rx="3" fill="#f5c542" stroke="#a8741c" stroke-width="2"/><rect x="16" y="14" width="28" height="30" rx="2" fill="none" stroke="#fff3c4" stroke-width="1.6"/><path d="M30,20 l2.4,5 5.4,.8 -3.9,3.8 .9,5.4 -4.8,-2.5 -4.8,2.5 .9,-5.4 -3.9,-3.8 5.4,-.8 Z" fill="#fff3c4"/>' +
    '<g class="szp-szalag-kep"><rect x="27" y="8" width="6" height="42" fill="#f07aa8"/><path d="M24,4 Q30,10 36,4 Q34,12 30,10 Q26,12 24,4 Z" fill="#f07aa8" stroke="#c0447e" stroke-width="1"/></g></svg>'
};
var SZP_LADA = '<svg class="szp-lada-svg" viewBox="0 0 120 80" aria-hidden="true"><rect x="10" y="34" width="100" height="40" rx="6" fill="#b47a44" stroke="#6e4a22" stroke-width="3"/><rect x="10" y="48" width="100" height="6" fill="#d8a45a"/><rect x="52" y="44" width="16" height="16" rx="3" fill="#f5c542" stroke="#a8741c" stroke-width="2"/>' +
  '<g class="szp-fedel"><path d="M10,36 Q10,14 60,14 Q110,14 110,36 Z" fill="#c98a4b" stroke="#6e4a22" stroke-width="3"/><path d="M14,30 Q60,18 106,30" stroke="#e8b06a" stroke-width="3" fill="none"/></g></svg>';

function szpPolc(s) {
  var t = szerszamT(s.id), feny = szerszamFeny(s.id), L = PALYAK.filter(function (p) { return p.szerszam === s.id && !palyaRejtve(p); });
  var targy = ["mese", "tekercs", "mester"].map(function (fok) {
    var pa = L.filter(function (p) { return p.fok === fok; })[0]; if (!pa) return "";
    return '<button type="button" class="szp-t szp-' + fok + '" data-pid="' + pa.id + '" title="' + SZERSZAM_FOKOK[fok] + '">' + SZP_TARGY[fok] +
      '<span class="szp-tnev">' + SZERSZAM_FOKOK[fok].replace(/^\S+\s/, "") + '</span></button>';
  }).join("");
  return '<div class="szp-polc' + (t.l ? " lada" : "") + '" data-sz="' + s.id + '">' +
    '<div class="szp-tabla" style="--feny:' + feny.toFixed(2) + '"><span class="szp-ikon">' + s.ikon + '</span><span class="szp-nev">' + s.nev + '</span>' +
      (t.m ? '<span class="szp-szalag" title="mester-szalag">🎀</span>' : '') + '</div>' +
    '<div class="szp-targyak">' + targy + '</div><div class="szp-deszka"></div></div>';
}
/* a szekrény (ui.js hívja a Holdfény-szárny kocka-sorai alatt); null, ha egy szerszám sem látszik */
function szSzekreny() {
  var lista = SZERSZAMOK.filter(function (s) { return PALYAK.some(function (p) { return p.szerszam === s.id && !palyaRejtve(p); }); });
  if (!lista.length) return null;
  var benn = SZERSZAMOK.filter(function (s) { return szerszamLadaban(s.id); });
  var sz = el("div", "szp-szekreny");
  sz.innerHTML = '<div class="szp-tetej">🧰 Szerszámok</div>' + lista.map(szpPolc).join("") +
    '<div class="szp-lab"><div class="szp-lada">' + SZP_LADA + '<span class="szp-lada-ikonok">' + benn.map(function (s) { return '<i data-sz="' + s.id + '">' + s.ikon + '</i>'; }).join("") + '</span></div></div>';
  Array.prototype.forEach.call(sz.querySelectorAll(".szp-t"), function (b) {
    b.addEventListener("click", function () {
      hangGomb();
      var pa = palyaKeres(b.getAttribute("data-pid")); if (!pa) return;
      if (palyaElfogyott(pa)) { mondd(elfogyottMondat()); return; }
      if (b.classList.contains("szp-mester")) b.classList.add("szp-nyit");   /* a szalag lecsúszik */
      ligetUget(b, function () { palyaInditas(pa.id); });
    });
  });
  setTimeout(function () { szpLadaPillanat(sz); }, 500);
  return sz;
}
/* 🧰 a láda pillanata: a névtábla ikonja egy csillámcsíkon a ládába repül, a fedél kinyílik, majd becsukódik */
function szpLadaPillanat(sz) {
  var T = szerszamTar(), id = T.ujLada; if (!id || !sz.isConnected) return;
  T.ujLada = ""; ment();
  var tabla = sz.querySelector('.szp-polc[data-sz="' + id + '"] .szp-ikon'), lada = sz.querySelector(".szp-lada"), cel = sz.querySelector('.szp-lada-ikonok i[data-sz="' + id + '"]');
  if (!tabla || !lada) return;
  if (cel) cel.style.visibility = "hidden";
  try { tabla.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) {}
  setTimeout(function () {
    var a = tabla.getBoundingClientRect(), b = (cel || lada).getBoundingClientRect();
    var r = el("span", "szp-repulo", tabla.textContent);
    r.style.left = a.left + "px"; r.style.top = a.top + "px";
    document.body.appendChild(r);
    lada.classList.add("nyit");
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      r.style.transform = "translate(" + (b.left - a.left) + "px," + (b.top - a.top) + "px) scale(.8)";
    }); });
    setTimeout(function () { r.remove(); if (cel) cel.style.visibility = ""; lada.classList.remove("nyit"); hangCsilla(); }, 1500);
  }, nyugiMod() ? 0 : 450);
}

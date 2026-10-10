/* ============ 6q) 🧰 SZERSZÁM-SZEKRÉNY — a Bagolykönyvtár termében (konyvtar-terem.js): szerszám = polc, 3 tárgy, névtábla-fény, 🧰 láda ============
   Rajz: Matekos\szerszam-letrak-rajzterv.html 1–2. + 7. pont (✅ 2026-10-09). Nem kártyasor, hanem könyvespolc:
     - egy szerszám = egy polc; elöl réz névtábla az ikonnal és a mondattal; a tábla FÉNYE mutatja, mennyire közel a láda
       (szerszamFeny 0–1) — számot, csíkot a gyerek nem lát;
     - a polcon balról jobbra: 📖 mesekönyv · 📜 tekercs a tartójában · 🔮 kristálygömb (2026-10-10) · 🏅 aranykötésű könyv szalaggal (a szalag dísz, nem zár:
       koppintásra lecsúszik). Mindhárom mindig levehető: nincs nyíl, nincs lakat, nincs ▢▢▢;
     - elsőre jó Mesterpróba → rózsaszín mester-szalag a táblán; ládában → a tábla teljes fénnyel ég, kis másolata a ládában ül;
     - a még nem nyitott szerszám polca NEM látszik (nincs üres, poros, lezárt polc) — a pult nyitja (szerszamLatszik).
   A láda pillanata (7. pont): a pálya vége után, a szekrényhez visszatérve az ikon csillámcsíkon a ládába repül,
   a fedél kinyílik, majd becsukódik (szerszamTar().ujLada jelzi, egyszer). */

var SZP_TARGY = {
  mese: '<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M8,12 Q20,6 30,12 L30,50 Q20,44 8,50 Z" fill="#9ec9f0" stroke="#4a6a9a" stroke-width="2"/><path d="M52,12 Q40,6 30,12 L30,50 Q40,44 52,50 Z" fill="#c3d7f7" stroke="#4a6a9a" stroke-width="2"/><path d="M13,20 Q20,17 26,20 M13,27 Q20,24 26,27 M34,20 Q40,17 47,20 M34,27 Q40,24 47,27" stroke="#4a6a9a" stroke-width="1.4" fill="none" opacity=".6"/></svg>',
  tekercs: '<svg viewBox="0 0 60 56" aria-hidden="true"><rect x="10" y="44" width="40" height="7" rx="3" fill="#a8743c" stroke="#6e4a22" stroke-width="1.6"/><path d="M14,44 L18,36 M46,44 L42,36" stroke="#6e4a22" stroke-width="2.2"/><rect x="12" y="10" width="36" height="28" rx="2" fill="#fbecc4" stroke="#b98a3a" stroke-width="2"/><ellipse cx="12" cy="24" rx="5" ry="14" fill="#f3d99a" stroke="#b98a3a" stroke-width="2"/><ellipse cx="48" cy="24" rx="5" ry="14" fill="#f3d99a" stroke="#b98a3a" stroke-width="2"/><path d="M20,18 H40 M20,24 H38 M20,30 H36" stroke="#b98a3a" stroke-width="1.4" opacity=".6"/></svg>',
  gomb: '<svg viewBox="0 0 60 56" aria-hidden="true"><ellipse cx="30" cy="51" rx="20" ry="4" fill="#c9a8e6" opacity=".7"/><path d="M17,50 L21,40 H39 L43,50 Z" fill="#a8743c" stroke="#6e4a22" stroke-width="2"/>' +
    '<circle cx="30" cy="23" r="17" fill="#e6dafb" stroke="#7a5aa8" stroke-width="2.4"/><circle cx="25" cy="25" r="4" fill="#e2589b" opacity=".8"/><circle cx="35" cy="27" r="4" fill="#6fbf5a" opacity=".85"/>' +
    '<ellipse cx="23" cy="15" rx="6" ry="3.5" fill="#fff" opacity=".8" transform="rotate(-30 23 15)"/><path d="M40,11 l1,2.5 2.5,1 -2.5,1 -1,2.5 -1,-2.5 -2.5,-1 2.5,-1 Z" fill="#fff"/></svg>',
  mester: '<svg viewBox="0 0 60 56" aria-hidden="true"><ellipse cx="30" cy="50" rx="24" ry="5" fill="#c9a8e6"/><rect x="12" y="10" width="36" height="38" rx="3" fill="#f5c542" stroke="#a8741c" stroke-width="2"/><rect x="16" y="14" width="28" height="30" rx="2" fill="none" stroke="#fff3c4" stroke-width="1.6"/><path d="M30,20 l2.4,5 5.4,.8 -3.9,3.8 .9,5.4 -4.8,-2.5 -4.8,2.5 .9,-5.4 -3.9,-3.8 5.4,-.8 Z" fill="#fff3c4"/>' +
    '<g class="szp-szalag-kep"><rect x="27" y="8" width="6" height="42" fill="#f07aa8"/><path d="M24,4 Q30,10 36,4 Q34,12 30,10 Q26,12 24,4 Z" fill="#f07aa8" stroke="#c0447e" stroke-width="1"/></g></svg>'
};
var SZP_LADA = '<svg class="szp-lada-svg" viewBox="0 0 120 80" aria-hidden="true"><rect x="10" y="34" width="100" height="40" rx="6" fill="#b47a44" stroke="#6e4a22" stroke-width="3"/><rect x="10" y="48" width="100" height="6" fill="#d8a45a"/><rect x="52" y="44" width="16" height="16" rx="3" fill="#f5c542" stroke="#a8741c" stroke-width="2"/>' +
  '<g class="szp-fedel"><path d="M10,36 Q10,14 60,14 Q110,14 110,36 Z" fill="#c98a4b" stroke="#6e4a22" stroke-width="3"/><path d="M14,30 Q60,18 106,30" stroke="#e8b06a" stroke-width="3" fill="none"/></g></svg>';

function szpPolc(s) {
  var t = szerszamT(s.id), feny = szerszamFeny(s.id), polc = !!s.kocka;   /* 📚 olvasó-polc (s.kocka): ugyanaz a polc, 🔮 nélkül (olvaso-polc.js) */
  var L = PALYAK.filter(function (p) { return (polc ? p.polc : p.szerszam) === s.id && !palyaRejtve(p); });
  var targy = ["mese", "tekercs", "gomb", "mester"].map(function (fok) {
    var pa = L.filter(function (p) { return p.fok === fok; })[0]; if (!pa) return "";
    return '<button type="button" class="szp-t szp-' + fok + '" data-pid="' + pa.id + '" title="' + SZERSZAM_FOKOK[fok] + '">' + SZP_TARGY[fok] +
      '<span class="szp-tnev">' + SZERSZAM_FOKOK[fok].replace(/^\S+\s/, "") + '</span></button>';
  }).join("");
  return '<div class="szp-polc' + (t.l ? " lada" : "") + '" data-sz="' + s.id + '">' +
    '<div class="szp-tabla" style="--feny:' + feny.toFixed(2) + '"><span class="szp-ikon">' + s.ikon + '</span><span class="szp-nev">' + s.nev + '</span>' +
      ((polc ? polcSzalag(s.id) : t.m) ? '<span class="szp-szalag" title="mester-szalag">🎀</span>' : '') + '</div>' +
    '<div class="szp-targyak">' + targy + '</div><div class="szp-deszka"></div></div>';
}
/* a polcok tárgyai (📖 📜 🔮 🏅) a teremben (konyvtar-terem.js bktTerem): koppintás → az unikornis odaüget, a könyv kinyílik;
   🏅 → a szalag lecsúszik, és a Mesterpróba-kapun át indul (bktMesterKapu). Utána a láda pillanata, ha van új. */
function szpBekot(sz) {
  Array.prototype.forEach.call(sz.querySelectorAll(".szp-t"), function (b) {
    b.addEventListener("click", function () {
      hangGomb();
      var pa = palyaKeres(b.getAttribute("data-pid")); if (!pa) return;
      if (palyaElfogyott(pa)) { mondd(elfogyottMondat()); return; }
      if (pa.polc && pa.fok === "mester" && !polcMesterLista(pa.polc).length) { mondd("Ez a Mesterpróba hamarosan kinyílik!"); return; }   /* a szöveg a felhőben van */
      var mester = pa.fok === "mester";
      if (mester) b.classList.add("szp-nyit");   /* a szalag lecsúszik */
      ligetUget(b, function () { if (mester) bktMesterKapu(function () { palyaInditas(pa.id); }); else palyaInditas(pa.id); });
    });
  });
  /* 📚 olvasó-polc: a névtáblára koppintva a bemutató-mozgókép újra (konyvtar-mozgo.js) */
  Array.prototype.forEach.call(sz.querySelectorAll(".szp-polc"), function (pl) {
    var id = pl.getAttribute("data-sz"), t = pl.querySelector(".szp-tabla");
    if (!t || typeof EK_MOZGO === "undefined" || !EK_MOZGO[id]) return;
    t.classList.add("szp-tabla-mozgo"); t.setAttribute("role", "button"); t.setAttribute("tabindex", "0"); t.setAttribute("aria-label", "Nézd meg újra: " + polcIdx(id).nev);
    t.addEventListener("click", function () { hangGomb(); bktMozgoNez(id); });
  });
  setTimeout(function () { szpLadaPillanat(sz); }, 500);
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

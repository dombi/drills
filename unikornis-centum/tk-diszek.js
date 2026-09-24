/* ============ ÉGI TÜNEMÉNYKERT — a közös felhőkert díszei (5d) ============
   EZ AZ EGYETLEN HELY, ahol a díszek élnek: a játék (index.html) és a producer-pult (admin/) is
   ezt a fájlt tölti be. ÚJ DÍSZ = egy új sor a listában:
     { id: "rovid-azonosito", nev: "Név", nevRag: "Nevű" ("Lili virága"), rajz: function () { return '<g>…</g>'; } }
   • az id csak kisbetű/szám lehet (max 16), és MEGJELENÉS UTÁN NE NEVEZD ÁT (a lerakott díszek erre hivatkoznak);
   • a rajz SVG-részlet, a (0,0) pont a dísz TALPA (itt áll a felhőn), felfelé negatív y;
     kb. 60 széles × 70 magas területen legyen (viewBox: -40 -80 80 84);
   • csak saját rajz (CC0-tiszta), pasztell színek.
   Az ár közös, a pulton állítható (kertBeall.diszAr, alap 12 💧). */
(function () {
  function sziromKor(cx, cy, r, db, rs, szin) {
    var s = "";
    for (var i = 0; i < db; i++) {
      var a = (i / db) * Math.PI * 2;
      s += '<ellipse cx="' + (cx + Math.cos(a) * r).toFixed(1) + '" cy="' + (cy + Math.sin(a) * r).toFixed(1) + '" rx="' + rs + '" ry="' + (rs * 0.72).toFixed(1) +
        '" transform="rotate(' + (a * 180 / Math.PI).toFixed(0) + ' ' + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1) + ')" fill="' + szin + '"/>';
    }
    return s;
  }
  function csillag5(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R;
      p.push((cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1));
    }
    return p.join(" ");
  }
  window.TK_DISZEK = [
    { id: "virag", nev: "Virág", nevRag: "virága", rajz: function () {
      return '<ellipse cx="0" cy="0" rx="16" ry="4" fill="#d9c8ff" opacity=".6"/>' +
        '<path d="M0 0 C-2 -16 3 -26 0 -40" stroke="#6fbf73" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M0 -14 C-14 -18 -16 -28 -14 -30 C-6 -28 -2 -22 0 -14 Z" fill="#8fd694"/>' +
        '<path d="M1 -22 C12 -26 16 -34 15 -37 C7 -35 3 -30 1 -22 Z" fill="#8fd694"/>' +
        sziromKor(0, -48, 10, 6, 8, "#ffb3d1") + sziromKor(0, -48, 5, 6, 4.5, "#ffd1e4") +
        '<circle cx="0" cy="-48" r="5.5" fill="#ffd96b"/><circle cx="-1.6" cy="-49.6" r="1.6" fill="#fff6c9"/>';
    } },
    { id: "csillag", nev: "Csillag", nevRag: "csillaga", rajz: function () {
      return '<ellipse cx="0" cy="0" rx="14" ry="3.5" fill="#d9c8ff" opacity=".6"/>' +
        '<path d="M0 0 L0 -22" stroke="#c9b4f2" stroke-width="2.5" stroke-linecap="round"/>' +
        '<polygon points="' + csillag5(0, -44, 24, 10) + '" fill="#ffe27a" stroke="#f3c24d" stroke-width="2" stroke-linejoin="round"/>' +
        '<polygon points="' + csillag5(0, -44, 12, 5) + '" fill="#fff4bf"/>' +
        '<circle cx="-5" cy="-45" r="1.8" fill="#8a5a2a"/><circle cx="5" cy="-45" r="1.8" fill="#8a5a2a"/>' +
        '<path d="M-3.5 -40 Q0 -37 3.5 -40" stroke="#8a5a2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="-9" cy="-40" r="2.4" fill="#ffb3c8" opacity=".8"/><circle cx="9" cy="-40" r="2.4" fill="#ffb3c8" opacity=".8"/>';
    } },
    { id: "barany", nev: "Felhőbárány", nevRag: "felhőbáránya", rajz: function () {
      return '<ellipse cx="0" cy="0" rx="22" ry="4" fill="#d9c8ff" opacity=".6"/>' +
        '<rect x="-13" y="-12" width="4.5" height="12" rx="2.2" fill="#b7a2e6"/><rect x="6" y="-12" width="4.5" height="12" rx="2.2" fill="#b7a2e6"/>' +
        '<circle cx="-12" cy="-20" r="10" fill="#ffffff"/><circle cx="-2" cy="-26" r="12" fill="#ffffff"/><circle cx="10" cy="-21" r="10" fill="#ffffff"/>' +
        '<circle cx="0" cy="-15" r="10" fill="#ffffff"/><circle cx="-14" cy="-13" r="6" fill="#f4eeff"/>' +
        '<ellipse cx="20" cy="-24" rx="8" ry="7.5" fill="#e8dcff"/>' +
        '<circle cx="22" cy="-26" r="1.6" fill="#4a3a70"/><ellipse cx="16" cy="-29" rx="3" ry="1.8" fill="#d2c1f5"/>' +
        '<circle cx="23" cy="-21.5" r="1.8" fill="#ffc2d6" opacity=".9"/>';
    } },
    { id: "szivarvany", nev: "Szivárványív", nevRag: "szivárványa", rajz: function () {
      var s = '<ellipse cx="0" cy="0" rx="30" ry="4" fill="#d9c8ff" opacity=".6"/>';
      ["#ff9ec7", "#ffcf8a", "#fff09a", "#a8ecb9", "#a6d8ff", "#cdb2ff"].forEach(function (c, i) {
        var r = 28 - i * 3.6;
        s += '<path d="M' + (-r) + ' -4 A' + r + ' ' + r + ' 0 0 1 ' + r + ' -4" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
      });
      s += '<circle cx="-24" cy="-5" r="7" fill="#fff"/><circle cx="-30" cy="-3" r="5" fill="#fff"/><circle cx="-18" cy="-2" r="5" fill="#f4eeff"/>' +
        '<circle cx="24" cy="-5" r="7" fill="#fff"/><circle cx="30" cy="-3" r="5" fill="#fff"/><circle cx="18" cy="-2" r="5" fill="#f4eeff"/>';
      return s;
    } }
  ];
  /* a teljes <svg> egy díszhez (a játék és a pult is ezt használja) */
  window.tkDiszSVG = function (id, osztaly) {
    var d = null;
    for (var i = 0; i < window.TK_DISZEK.length; i++) if (window.TK_DISZEK[i].id === id) d = window.TK_DISZEK[i];
    if (!d) return "";
    return '<svg class="' + (osztaly || "") + '" viewBox="-40 -80 80 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + d.rajz() + "</svg>";
  };
})();

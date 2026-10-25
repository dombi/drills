/* ============ 6j5) 📸 ALBUM-ELEMEK: a Fotóalbum rajzkészlete (keretek, hátterek, borító-vásznak, díszek, gép, film, könyv) ============
   Forrás: Matekos/fotogep-album-rajzterv.html (✅ 2026-10-25) közös <defs>-e. Minden rajz EGY helyen él, a foto.js és az
   album.js csak megnevezi (mint a keret.js-nél). Új dísz/háttér/keret = egy sor ide + egy sor a terv/elemkatalogus.md-be.
   Az azonosítók „ae-” előtaggal: a játék többi rajzával nem ütköznek. A lap 420 × 315 (laptopon és telefonon ugyanaz). */
var ALBUM_W = 420, ALBUM_H = 315;

/* a lap közös defs-e: matrica-szegély (fehér, mint egy igazi matrica), árnyék, hátterek mintái, díszek */
var ALBUM_DEFS =
  '<filter id="ae-matrica" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="v"/><feFlood flood-color="#fff"/><feComposite in2="v" operator="in" result="feher"/>' +
    '<feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#3b2f66" flood-opacity=".25"/>' +
    '<feMerge><feMergeNode/><feMergeNode in="feher"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<filter id="ae-arnyek" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2.5" stdDeviation="2" flood-color="#3b2f66" flood-opacity=".22"/></filter>' +
  '<pattern id="ae-potty" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#c8ecd9"/><circle cx="9" cy="9" r="2.4" fill="#fff" opacity=".7"/></pattern>' +
  '<pattern id="ae-kocka" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#fdf3dc"/><path d="M16 0H0V16" fill="none" stroke="#f0d9a8" stroke-width="1"/></pattern>' +
  '<linearGradient id="ae-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f7"/><stop offset="1" stop-color="#eaf5fd"/></linearGradient>' +
  '<pattern id="ae-vaszon" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#fff" stroke-width="1" opacity=".22"/></pattern>' +
  '<polygon id="ae-csillag" points="0,-11 2.7,-3.72 10.46,-3.4 4.37,1.42 6.47,8.9 0,4.6 -6.47,8.9 -4.37,1.42 -10.46,-3.4 -2.7,-3.72" fill="#fcd34d" stroke="#e0a800" stroke-width="1.4" stroke-linejoin="round"/>' +
  '<g id="ae-virag"><g fill="#f7a3b8" stroke="#e07aa3" stroke-width="1"><circle cy="-6" r="5"/><circle cx="5.7" cy="-1.9" r="5"/><circle cx="3.5" cy="4.9" r="5"/><circle cx="-3.5" cy="4.9" r="5"/><circle cx="-5.7" cy="-1.9" r="5"/></g><circle r="3.6" fill="#fcd34d"/></g>' +
  '<path id="ae-sziv" d="M0 9C-14 0-10-10-4-10C-1.5-10 0-7.5 0-6C0-7.5 1.5-10 4-10C10-10 14 0 0 9z" fill="#f27aa0" stroke="#d1507e" stroke-width="1.2"/>' +
  '<g id="ae-level"><path d="M-10 9C-10-6 0-11 11-11C11 2 4 10-10 9z" fill="#8fd19e" stroke="#5fae7a" stroke-width="1.3"/><path d="M-10 9L6-6" stroke="#5fae7a" stroke-width="1.2"/></g>' +
  '<g id="ae-pillango"><ellipse cx="-6" cy="-4" rx="6" ry="7" fill="#c9a8e6" stroke="#8a6cc0" stroke-width="1"/><ellipse cx="6" cy="-4" rx="6" ry="7" fill="#9ec9f0" stroke="#5f93c7" stroke-width="1"/><ellipse cx="-4.5" cy="6" rx="4" ry="4.5" fill="#f7a3b8"/><ellipse cx="4.5" cy="6" rx="4" ry="4.5" fill="#fcd38b"/><path d="M0-8v18M0-8l-3-4M0-8l3-4" stroke="#4a3d78" stroke-width="1.6" stroke-linecap="round"/></g>' +
  '<g id="ae-szivarvany" fill="none" stroke-width="3" stroke-linecap="round"><path d="M-12 6a12 12 0 0 1 24 0" stroke="#f7a3b8"/><path d="M-9 6a9 9 0 0 1 18 0" stroke="#fcd38b"/><path d="M-6 6a6 6 0 0 1 12 0" stroke="#a8dcb0"/><path d="M-3 6a3 3 0 0 1 6 0" stroke="#9ec9f0"/></g>' +
  '<g id="ae-felho"><g fill="#fff" stroke="#b9d4ee" stroke-width="1.3"><circle cx="-6" cy="2" r="6"/><circle cx="1" cy="-3" r="7.5"/><circle cx="7" cy="3" r="5.5"/></g><rect x="-11" y="2" width="22" height="6" fill="#fff"/></g>';

/* 3 lap-háttér (alapkészlet) + 5 borító-vászon (a borítót a gyerek tervezi) */
var ALBUM_HATTER = [
  { id: "potty", nev: "menta pöttyös", rajz: function (w, h) { return '<rect width="' + w + '" height="' + h + '" rx="6" fill="url(#ae-potty)"/>'; } },
  { id: "kocka", nev: "krém kockás", rajz: function (w, h) { return '<rect width="' + w + '" height="' + h + '" rx="6" fill="url(#ae-kocka)"/>'; } },
  { id: "eg", nev: "égkék felhős", rajz: function (w, h) {
      return '<rect width="' + w + '" height="' + h + '" rx="6" fill="url(#ae-eg)"/><use href="#ae-felho" transform="translate(' + w * .18 + ' ' + h * .2 + ') scale(2.2)"/>' +
        '<use href="#ae-felho" transform="translate(' + w * .78 + ' ' + h * .32 + ') scale(1.6)"/><use href="#ae-felho" transform="translate(' + w * .5 + ' ' + h * .86 + ') scale(1.3)"/>'; } }
];
var ALBUM_VASZON = [
  { id: "menta", nev: "menta", szin: "#a8dcb0", gerinc: "#8fd1b0", szel: "#3f8a68" },
  { id: "rozsa", nev: "rózsa", szin: "#f7b8d0", gerinc: "#e99bb9", szel: "#c0567f" },
  { id: "levendula", nev: "levendula", szin: "#d9c4f0", gerinc: "#c9a8e6", szel: "#7d5bb5" },
  { id: "egkek", nev: "égkék", szin: "#b9dcf5", gerinc: "#9ec9f0", szel: "#3f7fb0" },
  { id: "mez", nev: "méz", szin: "#f6d48a", gerinc: "#ecc067", szel: "#b8862c" }
];
function albumVaszon(id) { return ALBUM_VASZON.filter(function (v) { return v.id === id; })[0] || ALBUM_VASZON[0]; }
function albumHatter(id) { return ALBUM_HATTER.filter(function (v) { return v.id === id; })[0] || ALBUM_HATTER[0]; }
/* a lap alja: borítónál vászon + gerinc, máskor a választott háttér */
function albumHatterRajz(lap) {
  if (!lap.borito) return albumHatter(lap.hatter).rajz(ALBUM_W, ALBUM_H);
  var v = albumVaszon(lap.hatter);
  return '<rect width="' + ALBUM_W + '" height="' + ALBUM_H + '" rx="14" fill="' + v.szin + '" stroke="' + v.szel + '" stroke-width="4"/>' +
    '<rect width="' + ALBUM_W + '" height="' + ALBUM_H + '" rx="14" fill="url(#ae-vaszon)"/>' +
    '<rect x="2" y="2" width="40" height="' + (ALBUM_H - 4) + '" rx="12" fill="' + v.gerinc + '"/><path d="M42 6V' + (ALBUM_H - 6) + '" stroke="' + v.szel + '" stroke-width="2" opacity=".5"/>';
}

/* 2 ingyenes fotó-keret (polaroid + ragasztószalag) + a keret nélküli. A fotó 4:3, alapméretben 140 × 105.
   keretRajz(kep, w, h): a kép (egy <image>) köré rajzol, a közép a (0, 0) */
var ALBUM_KERET = [
  { id: "polaroid", nev: "polaroid", rajz: function (kep, w, h) {
      var m = 8, alul = 26;
      return '<g filter="url(#ae-arnyek)"><rect x="' + (-w / 2 - m) + '" y="' + (-h / 2 - m) + '" width="' + (w + 2 * m) + '" height="' + (h + m + alul) + '" rx="2" fill="#fff"/>' + kep + '</g>'; } },
  { id: "szalag", nev: "ragasztószalag", rajz: function (kep, w, h) {
      var m = 4;
      return '<g filter="url(#ae-arnyek)"><rect x="' + (-w / 2 - m) + '" y="' + (-h / 2 - m) + '" width="' + (w + 2 * m) + '" height="' + (h + 2 * m) + '" fill="#fff"/>' + kep + '</g>' +
        '<rect x="' + (-w / 2 - 16) + '" y="' + (-h / 2 - 2) + '" width="38" height="13" fill="#fcd38b" opacity=".75" transform="rotate(-35 ' + (-w / 2) + ' ' + (-h / 2) + ')"/>' +
        '<rect x="' + (w / 2 - 22) + '" y="' + (h / 2 - 11) + '" width="38" height="13" fill="#fcd38b" opacity=".75" transform="rotate(-35 ' + (w / 2) + ' ' + (h / 2) + ')"/>'; } },
  { id: "nincs", nev: "keret nélkül", rajz: function (kep) { return '<g filter="url(#ae-arnyek)">' + kep + '</g>'; } }
];
function albumKeret(id) { return ALBUM_KERET.filter(function (v) { return v.id === id; })[0] || ALBUM_KERET[0]; }

/* 8 dísz (alapkészlet); a 📅 dátum-bélyegző a letevés napját kapja (a gyerek maga teszi fel, nem a játék írja rá) */
var ALBUM_DISZ = ["csillag", "virag", "sziv", "level", "pillango", "szivarvany", "felho", "datum"];
var HONAP_ROVID = ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."];
function albumMaiDatum() { var d = new Date(); return HONAP_ROVID[d.getMonth()] + " " + d.getDate() + "."; }
function albumDiszRajz(id, szoveg) {
  if (id === "datum") return '<rect x="-24" y="-10" width="48" height="20" rx="3" fill="#fff5f8" stroke="#e0417a" stroke-width="1.4" stroke-dasharray="3 2"/>' +
    '<text y="4.5" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="12" font-weight="600" fill="#e0417a">' + kiiras(szoveg || albumMaiDatum()) + '</text>';
  return '<use href="#ae-' + id + '"/>';
}

/* a felirat 6 színe és 3 mérete (rajzterv: „Aa” panel) */
var ALBUM_FELIRAT_SZIN = ["#3f8a68", "#e0417a", "#8a4fd0", "#29a3dd", "#e8b04a", "#5a4b80"];
var ALBUM_FELIRAT_MERET = [{ id: 1, px: 16 }, { id: 2, px: 24 }, { id: 3, px: 34 }];

/* 📷 a gép: B) levendula „azonnali gép” (✅) — alul kibújik a kép. Bolti bélyegképnek és a szerkesztő fejlécének. */
var FOTO_GEP_SVG =
  '<ellipse cx="80" cy="122" rx="58" ry="6" fill="#3b2f66" opacity=".12"/>' +
  '<rect x="50" y="104" width="60" height="20" fill="#fff" stroke="#d6cce6" stroke-width="1.5"/><rect x="54" y="107" width="52" height="13" fill="#bfe6d0"/>' +
  '<rect x="20" y="28" width="120" height="80" rx="16" fill="#e2d2f6" stroke="#7d5bb5" stroke-width="3"/>' +
  '<path d="M21.5 44a14.5 14.5 0 0 1 14.5-14.5h88a14.5 14.5 0 0 1 14.5 14.5v8h-117z" fill="#c9a8e6"/>' +
  '<rect x="32" y="54" width="6" height="52" fill="#f7a3b8"/><rect x="38" y="54" width="6" height="52" fill="#fcd38b"/><rect x="44" y="54" width="6" height="52" fill="#a8dcb0"/><rect x="50" y="54" width="6" height="52" fill="#9ec9f0"/>' +
  '<rect x="120" y="21" width="15" height="9" rx="3" fill="#e0417a"/>' +
  '<rect x="30" y="34" width="17" height="11" rx="3" fill="#4a3d78"/><rect x="110" y="34" width="22" height="12" rx="3" fill="#fff7d6" stroke="#7d5bb5" stroke-width="2"/>' +
  '<circle cx="96" cy="76" r="26" fill="#fffaf0" stroke="#7d5bb5" stroke-width="3"/><circle cx="96" cy="76" r="17" fill="#4a3d78"/><circle cx="96" cy="76" r="9" fill="#6b5fa8"/><circle cx="90" cy="70" r="4" fill="#fff" opacity=".85"/>' +
  '<rect x="36" y="106" width="88" height="5" rx="2" fill="#7d5bb5"/>';
/* 🎞️ filmtekercs (a „8 kocka jár hozzá” és az „Új film!” pillanat) — a közép (0, 0) */
var FOTO_FILM_SVG =
  '<path d="M8-6h26v12H8z" fill="#e8b04a"/><g fill="#fdf0d0"><rect x="11" y="-4.5" width="3" height="2.4" rx=".6"/><rect x="18" y="-4.5" width="3" height="2.4" rx=".6"/><rect x="25" y="-4.5" width="3" height="2.4" rx=".6"/>' +
  '<rect x="11" y="2.1" width="3" height="2.4" rx=".6"/><rect x="18" y="2.1" width="3" height="2.4" rx=".6"/><rect x="25" y="2.1" width="3" height="2.4" rx=".6"/></g>' +
  '<rect x="-12" y="-13" width="22" height="26" rx="4" fill="#6b5fa8" stroke="#4a3d78" stroke-width="2"/><rect x="-14" y="-15" width="26" height="5" rx="2" fill="#4a3d78"/><rect x="-14" y="10" width="26" height="5" rx="2" fill="#4a3d78"/><rect x="-7" y="-6" width="12" height="9" rx="2" fill="#fcd38b"/>';
/* a bolti bélyegkép: a gép, a sarkában a filmtekercs */
function fotoGepIkon() {
  return '<svg viewBox="0 0 160 134" xmlns="http://www.w3.org/2000/svg">' + FOTO_GEP_SVG + '<g transform="translate(132 112) scale(.9)">' + FOTO_FILM_SVG + '</g></svg>';
}

/* 📸 a könyv az odúban: menta vászonkönyv, a borítóján a gyerek borítója kicsiben (boritoKep = a borító SVG belseje 420×315-ben).
   Odú-koordinátában (x, y) a talppont. A képeslap-albumnál (36 × 28) nagyobb: 56 × 44. */
function fotoKonyvSVG(x, y, v, boritoBelso, ures) {
  /* az alap-borító (még üres): egy fehér fotó-hely és egy csillag, mint a rajzterven — hogy könyvnek látsszon, ne doboznak */
  var alap = ures ? '<g transform="translate(-10 -36) rotate(-6)"><rect width="28" height="30" fill="#fff" stroke="#cfd8d0" stroke-width=".8"/><rect x="3" y="3" width="22" height="18" fill="#bfe0f7"/></g>' +
    '<g transform="translate(20 -8) scale(.55)"><polygon points="0,-11 2.7,-3.72 10.46,-3.4 4.37,1.42 6.47,8.9 0,4.6 -6.47,8.9 -4.37,1.42 -10.46,-3.4 -2.7,-3.72" fill="#fcd34d" stroke="#e0a800" stroke-width="1.4"/></g>' : "";
  return '<g id="foto-konyv" transform="translate(' + x + ' ' + y + ') rotate(4)" role="button" aria-label="Fotóalbum">' +
    '<ellipse cx="0" cy="3" rx="32" ry="5" fill="#3b2f66" opacity=".14"/>' +
    '<rect x="-28" y="-42" width="56" height="44" rx="4" fill="' + v.szin + '" stroke="' + v.szel + '" stroke-width="2.2"/>' +
    '<svg x="-28" y="-42" width="56" height="44" viewBox="0 0 ' + ALBUM_W + ' ' + ALBUM_H + '" preserveAspectRatio="none">' + boritoBelso + '</svg>' +
    '<rect x="-28" y="-42" width="56" height="44" rx="4" fill="none" stroke="' + v.szel + '" stroke-width="2.2"/>' + alap +
    '<rect x="-34" y="-50" width="68" height="58" fill="transparent"/></g>';
}

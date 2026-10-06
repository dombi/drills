/* ═════════════ RAJZTERV-PROTOTÍPUS: Térkép mint központ (terv/terkep-kozpont-rajzterv.html) ═════════════
   Csak a próbaoldalon él (terv/terkep-kozpont-build.py fűzi a main.js elé). ?uj=1 nélkül a mai játék látszik.
   A rajzok a játék stílusában készülnek, hogy a kódkörökben szinte változatlanul átkerülhessenek a src/-be.
   ⚠️ A 2. kör óta a Kert, a szökőkút és a térkép-jel a src/-ben él (a térkép útjai elrendezésenként: utak.szeles/allo) — ez a
   prototípus a jóváhagyott rajzterv pillanatképe; újragyártás előtt igazítani kellene (a ?uj=1 ág a régi, tömb-utakra épül). */
var RT = (function () {
  var q = new URLSearchParams(location.search || location.hash.slice(1));   /* az összehasonlító lap a #-ben adja át (blob-keret) */
  return { mind: q.get("mind") === "1", uj: q.get("uj") === "1", valt: q.get("valt") || "C", kep: q.get("kep") || "terkep", leny: q.get("leny"), lepke: q.get("lepke") === "1" };
})();

/* ─────────────── 1. A KERT A TÉRKÉPEN ───────────────
   Jelkép: rózsaíves kertkapu sövénnyel, mögötte napfényes rét, mellette kis patak-kanyar tavirózsával
   (a C2 patakparti kert kicsiben). Talppont 0,0, felfelé rajzolva, mint a többi LT_JELKEP. */
function ltRozsa(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#c0567f" stroke-width="1"/><path d="M' + (x - r * .4) + ' ' + y + 'q' + (r * .4) + ' ' + (-r * .5) + ' ' + (r * .7) + ' 0" stroke="#c0567f" stroke-width=".9" fill="none"/>'; }
LT_JELKEP.kert = function () {
  var ny = "M-15 1V-40Q-15 -60 0 -61Q15 -60 15 -40V1Z";   /* a kapu nyílása */
  return ltArnyek(46) +
    '<defs><clipPath id="lt-kertNyilas"><path d="' + ny + '"/></clipPath></defs>' +
    /* a kapun át: ég, napsütés, a túlpart két virágágyása (rózsaszín +−, lila ×÷), mint a C2 kertben */
    '<g clip-path="url(#lt-kertNyilas)"><rect x="-16" y="-62" width="32" height="64" fill="#cfe9fa"/><circle cx="7" cy="-44" r="6" fill="#fff4c2"/>' +
    '<path d="M-16 -22Q0 -30 16 -22V2H-16Z" fill="#a8dc9c"/>' +
    '<ellipse cx="-7" cy="-20" rx="7" ry="2.6" fill="#f6a5c0"/><ellipse cx="7" cy="-20" rx="7" ry="2.6" fill="#c9a8e6"/>' +
    '<circle cx="-9" cy="-21.5" r="1.2" fill="#fff"/><circle cx="-5" cy="-21" r="1.1" fill="#f28ab8"/><circle cx="5" cy="-21.5" r="1.1" fill="#fff"/><circle cx="9" cy="-21" r="1.2" fill="#7a5ea8"/>' +
    '<path d="M-16 -12Q0 -16 16 -12V2H-16Z" fill="#8ecf6e"/><path d="M-4 -9H4" stroke="#a9d6ef" stroke-width="2.4" stroke-linecap="round"/></g>' +
    /* sövény a kapu két oldalán, virágokkal */
    '<path d="M-46 2Q-50 -18 -40 -30Q-30 -40 -20 -32Q-17 -29 -17 -20V2Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="1.8"/>' +
    '<path d="M17 2V-20Q17 -30 26 -34Q36 -38 43 -28Q50 -16 45 2Z" fill="url(#lt-gFa)" stroke="#5f9e6a" stroke-width="1.8"/>' +
    '<circle cx="-36" cy="-20" r="2.6" fill="#fff"/><circle cx="-27" cy="-10" r="2.2" fill="#fce49a"/><circle cx="-40" cy="-6" r="2" fill="#f6a5c0"/><circle cx="-26" cy="-26" r="2" fill="#f6a5c0"/>' +
    '<circle cx="28" cy="-22" r="2.4" fill="#fff"/><circle cx="36" cy="-10" r="2.2" fill="#f6a5c0"/><circle cx="25" cy="-8" r="2" fill="#fce49a"/>' +
    /* a kiskapu: fehér léckapu, a jobb szárnya kitárva */
    '<path d="M-14 2V-18H0V2Z" fill="#fffaf0" stroke="#b5a08a" stroke-width="1.4"/><path d="M-9.5 -18V2M-5 -18V2M-14 -9H0" stroke="#d9cbb4" stroke-width="1.1"/>' +
    '<path d="M2 2L10 -1V-21L2 -18Z" fill="#f3ead8" stroke="#b5a08a" stroke-width="1.3"/><path d="M6 0V-19.5" stroke="#d9cbb4" stroke-width="1"/>' +
    /* a fehér fa rózsaív */
    '<path d="' + ny + '" fill="none" stroke="#b5a08a" stroke-width="7.5" stroke-linejoin="round"/>' +
    '<path d="' + ny + '" fill="none" stroke="#fffaf0" stroke-width="4.5" stroke-linejoin="round"/>' +
    '<path d="M-15 -4Q-19 -14 -14 -22Q-19 -32 -14 -42Q-12 -54 -4 -59Q4 -63 10 -57Q17 -50 15 -40Q19 -30 14 -20Q18 -12 15 -4" fill="none" stroke="#6fae74" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M-19 -26q-5 -2 -7 2q4 2 7 -2zM19 -30q5 -2 7 2q-4 2 -7 -2zM-8 -60q-2 -5 2 -7q2 4 -2 7zM18 -12q5 -1 6 3q-4 1 -6 -3z" fill="#8fd18f" stroke="#5f9e6a" stroke-width=".8"/>' +
    ltRozsa(-15, -36, 4.4, "#f6a5c0") + ltRozsa(-11, -52, 4.8, "#fbc4d8") + ltRozsa(1, -61, 5.4, "#f28ab8") + ltRozsa(13, -51, 4.6, "#f6a5c0") + ltRozsa(16, -34, 4.2, "#fbc4d8") +
    ltRozsa(-16, -19, 3.8, "#f28ab8") + ltRozsa(16, -17, 3.6, "#f6a5c0") +
    /* patak-kanyar jobbra elöl, tavirózsával */
    '<path d="M18 5Q34 -2 50 4Q56 8 48 11Q34 14 20 11Z" fill="#a9d6ef" stroke="#7fb8d8" stroke-width="1.6"/>' +
    '<path d="M27 6h10M41 8h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>' +
    '<ellipse cx="44" cy="6.5" rx="5" ry="2" fill="#8fd18f" stroke="#5f9e6a" stroke-width=".8"/><circle cx="44" cy="5" r="1.8" fill="#f6a5c0"/>' +
    /* tulipánok elöl balra */
    '<path d="M-31 4V-6M-25 4V-8" stroke="#5f9e6a" stroke-width="1.4"/><path d="M-34 -6q3 -6 6 0q-3 2 -6 0z" fill="#f2708f"/><path d="M-28 -8q3 -6 6 0q-3 2 -6 0z" fill="#c9a8e6"/>' +
    ltCsillam(28, -46, 4.2, "#fff3a8", "2.4s", .5) + ltCsillam(-30, -40, 3.2, "#ffffff", "2.9s", 1.2);
};
if (RT.uj) {
  /* a Kert az Odú mellé kerül. Fekvő: a „Neked készült” a térkép alsó közepére költözik (ma az Odúnál álló unikornis
     eltakarja), a helyére jön a Kert; az Összeadó liget kicsit feljebb, hogy a Kert rózsaíve ne érjen a nevéhez.
     Álló: a Kert az utca-kapu helyére, az utca-kapu egy lépéssel beljebb, az Összeadó és a Szorzós liget közé. */
  var H = LIGET_TERKEP.helyek;
  H.kert = { szeles: [245, 428], allo: [195, 700], magas: 66, szel: 56 };
  H.egyeni.szeles = [450, 425];
  H.osszeado.szeles = [300, 340];
  H.utca.allo = [215, 602];
  /* az útlista elrendezésenként (a térkép-modul kis bővítése: T.utakMod[mod], ha van) */
  function utak(ki, be) { return LIGET_TERKEP.utak.filter(function (u) { return !ki.some(function (k) { return (u[0] === k[0] && u[1] === k[1]) || (u[0] === k[1] && u[1] === k[0]); }); }).concat(be); }
  LIGET_TERKEP.utakMod = {
    szeles: utak([["odu", "egyeni"]], [["odu", "kert", 14], ["osszeado", "egyeni", -14]]),
    allo: utak([["odu", "egyeni"], ["odu", "utca"], ["osszeado", "szorzo"]], [["odu", "kert", 10], ["kert", "egyeni", -10], ["osszeado", "utca", 12], ["utca", "szorzo", -12]])
  };
  LIGET_TERKEP.oldal.szeles.kert = -1; LIGET_TERKEP.oldal.allo.kert = -1; LIGET_TERKEP.oldal.allo.utca = 1;
}
var _rtLtNev = ltNev;
ltNev = function (id) { return id === "kert" ? "Kert" : _rtLtNev(id); };
var _rtRenderLigetTerkep = renderLigetTerkep;
renderLigetTerkep = function (racs, L) {
  if (RT.mind) {   /* próba: minden hely látszik (a „Neked készült” és a Fejtörő-hegy csak belépve) */
    ["egyeni", "fejtoro"].forEach(function (r) { if (L.sorrend.indexOf(r) < 0) { L.sorrend.push(r); L.regiok[r] = []; } });
  }
  if (!RT.uj) return _rtRenderLigetTerkep(racs, L);
  var host = el("div", "terkep-host uni-terep");
  racs.appendChild(host);
  var mod = utcaMod(host.clientWidth, host.clientHeight);
  LIGET_TERKEP.utak = LIGET_TERKEP.utakMod[mod];
  var lathato = { odu: true, utca: true, kert: true }, jel = {};
  L.sorrend.forEach(function (r) { if (LIGET_TERKEP.helyek[r]) { lathato[r] = true; jel[r] = ligetOsszegzo(r, L.regiok[r]); } });
  jel.kert = { jelzes: (RT.lepke || tenyKertVar()) ? ["🦋"] : [] };   /* 🦋 ha a kertben új dolog vár (ma az odú kertkapuján ül) */
  var halo = terkepHalo(LIGET_TERKEP, lathato);
  var hol = TERKEP_HOL && TERKEP_HOL.leny === mentes.leny ? TERKEP_HOL.id : P().utolsoLiget;
  if (!lathato[hol]) hol = "odu";
  LIGET_M = terkepRajzol(host, LIGET_TERKEP, { mod: mod, all: hol, halo: halo, nev: ltNev, jelzes: jel, koppint: ligetTerkepKoppint });
  LIGET_M.jel = jel;
};
var _rtLigetTerkepKoppint = ligetTerkepKoppint;
ligetTerkepKoppint = function (id) {
  if (id !== "kert") return _rtLigetTerkepKoppint(id);
  var M = LIGET_M; if (!M || !M.svg.isConnected) return;
  if (M.fut) { terkepSetal(M, id); return; }
  hangGomb(); mondd("Irány a kert!");
  terkepSetal(M, id, function () {
    TERKEP_HOL = { leny: mentes.leny, id: id };
    terkepBelep(M, id, function () { if ($("kepernyo-fomenu").classList.contains("aktiv")) kertNyit(); });
  });
};

/* ─────────────── 2. AZ UTCA (kertkapu és odú-ház nélkül) ───────────────
   Három változat (?valt=A|B|C). Mindháromban az unikornis LÁTSZIK az utcán: ott áll, ahová a szivárványkapuból
   érkezett, és onnan indul vissza is (ma az odú-ház ajtajából lépett ki — az odú-ház megszűnik).
   A: Rövid utca — csak a 3 ház, nagyobban.   B: „Hamarosan” telkek a két üres helyen.
   C: Szökőkutas tér — a kert helyén szökőkút (az unikornis mellette áll), az odú helyén holdfényes pad alvó cicával;
      a fodrász, a bolt és a bank a mai helyén marad. Koppintásra kedves apróság történik, de nem visz sehová. */
function utcaHaz(id, x, talp, s) {
  var D = { fodrasz: ["utca-fodrasz", 54, function () { return utcaFodraszRajz(!P().szalon.nyitva, '<g transform="translate(54,368) scale(0.125)">' + unikornisSVG("utca-kirakat-uni", LENYEK[mentes.leny], 1, P().oltozet) + '</g>'); }, "fodrász"],
            bolt: ["utca-bolt", 150, utcaBoltRajz, "csillagbolt"],
            bank: ["utca-bank", 200, function () { return utcaBankRajz(bankZarva()); }, "tündérbank"] }[id];
  return utcaHely(D[0], [x, talp, s], D[1], D[2](), D[3]);
}
/* ⛲ szökőkút (talppont: x, talp; s = méret). Koppintásra magasabbra szökik a víz. */
function utcaKutRajz(x, talp, s) {
  var g = '<g id="utca-kut" class="utca-epulet" transform="translate(' + x + ' ' + talp + ') scale(' + s + ')">';
  g += '<rect x="-62" y="-96" width="124" height="104" fill="transparent"/>';
  g += '<circle class="u-feny" cx="0" cy="-40" r="66" fill="url(#u-izz)"/>';
  g += '<ellipse cx="0" cy="2" rx="60" ry="9" fill="#0a0f3a" opacity=".55"/>';
  g += '<path d="M-56 -14Q-55 0 -44 3H44Q55 0 56 -14Z" fill="#6f66b0"/><path d="M-56 -14Q-55 0 -44 3H44Q55 0 56 -14" fill="none" stroke="#4d4590" stroke-width="2"/>';
  g += '<ellipse cx="0" cy="-14" rx="56" ry="10" fill="#b9b0e6"/><ellipse cx="0" cy="-14" rx="49" ry="7.5" fill="#7fd0f0"/>';
  g += '<path d="M-30 -14h14M8 -12h18" stroke="#e6faff" stroke-width="2" stroke-linecap="round" opacity=".8"/>';
  g += '<rect x="-6" y="-58" width="12" height="44" rx="4" fill="#b9b0e6"/><rect x="-6" y="-58" width="4" height="44" fill="#d9d2f6"/>';
  g += '<path d="M-26 -60Q-24 -50 -12 -48H12Q24 -50 26 -60Z" fill="#8f86c9"/><ellipse cx="0" cy="-60" rx="26" ry="5.5" fill="#b9b0e6"/><ellipse cx="0" cy="-60" rx="21" ry="3.8" fill="#7fd0f0"/>';
  /* a lehulló vízfüggöny a felső tálból (folyik: a szaggatás eltolása) */
  g += '<g fill="none" stroke="#bfeeff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="5 7" opacity=".85">' +
    '<path d="M-22 -59Q-36 -54 -40 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".8s" repeatCount="indefinite"/></path>' +
    '<path d="M22 -59Q36 -54 40 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".8s" repeatCount="indefinite"/></path>' +
    '<path d="M-12 -59Q-20 -50 -22 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".9s" repeatCount="indefinite"/></path>' +
    '<path d="M12 -59Q20 -50 22 -18"><animate attributeName="stroke-dashoffset" values="24;0" dur=".9s" repeatCount="indefinite"/></path></g>';
  /* a felszökő sugár + cseppek */
  g += '<g id="utca-kut-sugar"><path d="M0 -62V-84" stroke="#dff7ff" stroke-width="3.4" stroke-linecap="round"><animate attributeName="d" values="M0 -62V-80;M0 -62V-86;M0 -62V-80" dur="1.2s" repeatCount="indefinite"/></path>';
  [[-6, 0], [5, .4], [-2, .8]].forEach(function (c) {
    g += '<circle cx="' + c[0] + '" cy="-84" r="2" fill="#dff7ff" opacity="0"><animate attributeName="cy" values="-84;-62" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/><animate attributeName="cx" values="0;' + (c[0] * 3) + '" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="' + c[1] + 's" repeatCount="indefinite"/></circle>';
  });
  g += '</g>';
  g += uCsillam(-34, -18, 3.4, "#fff6a8", .3) + uCsillam(30, -16, 2.8, "#fff6a8", 1.4) + uCsillam(0, -96, 4, "#ffd24d", .8);
  return g + '</g>';
}
/* 🌙 holdfényes pad egy virágzó fa alatt, rajta alvó cica (koppintásra felébred, csóválja a farkát) */
function utcaPadRajz(x, talp, s) {
  var g = '<g id="utca-pad" class="utca-epulet" transform="translate(' + x + ' ' + talp + ') scale(' + s + ')">';
  g += '<rect x="-58" y="-150" width="116" height="158" fill="transparent"/>';
  g += '<rect x="-4" y="-104" width="9" height="106" rx="3" fill="#6b4a7a"/>';
  g += '<g class="u-lomb"><circle cx="0" cy="-118" r="38" fill="#b46aa8"/><circle cx="-28" cy="-104" r="22" fill="#c27bb6"/><circle cx="28" cy="-106" r="22" fill="#c27bb6"/>' +
    '<circle cx="-12" cy="-130" r="4" fill="#ffd0ea"/><circle cx="14" cy="-122" r="3.4" fill="#ffd0ea"/><circle cx="-24" cy="-110" r="3" fill="#ffd0ea"/><circle cx="26" cy="-102" r="3.2" fill="#ffd0ea"/><circle cx="2" cy="-104" r="2.6" fill="#ffd0ea"/></g>';
  g += '<circle class="u-feny" cx="-40" cy="-62" r="26" fill="url(#u-izz)"/><path d="M-40 -48V2" stroke="#2a2a5e" stroke-width="3"/><rect x="-46" y="-64" width="12" height="15" rx="4" fill="#fff2a0" stroke="#2a2a5e" stroke-width="2.4"/>';
  g += '<rect x="-30" y="-30" width="62" height="7" rx="3" fill="#a4734a"/><rect x="-30" y="-20" width="62" height="7" rx="3" fill="#b9845a"/>';
  g += '<path d="M-26 -13V2M28 -13V2" stroke="#6b4a33" stroke-width="4" stroke-linecap="round"/>';
  g += '<g id="utca-cica-alszik"><ellipse cx="8" cy="-38" rx="15" ry="9" fill="#f3c08a"/><circle cx="-5" cy="-40" r="7.5" fill="#f3c08a"/><path d="M-10 -46l2 -6l4 5M-3 -47l3 -6l2 6" fill="#f3c08a"/>' +
    '<path d="M-8 -40q2 1.6 4 0M-3 -40q2 1.6 4 0" stroke="#7a4a2a" stroke-width="1" fill="none"/><path d="M20 -34q8 2 6 -8" stroke="#f3c08a" stroke-width="4.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M2 -42q4 -2 8 0M8 -34q4 -2 8 0" stroke="#d9925a" stroke-width="1.6" fill="none"/>' +
    '<text x="4" y="-56" font-size="10" font-weight="700" fill="#cfd6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></text>' +
    '<text x="12" y="-66" font-size="8" font-weight="700" fill="#cfd6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin=".6s" repeatCount="indefinite"/></text></g>';
  g += '<g id="utca-cica-ebren" style="display:none"><ellipse cx="8" cy="-36" rx="13" ry="10" fill="#f3c08a"/><circle cx="-4" cy="-48" r="8" fill="#f3c08a"/><path d="M-10 -54l2 -7l4 5M-1 -55l3 -7l2 7" fill="#f3c08a"/>' +
    '<circle cx="-7" cy="-49" r="1.6" fill="#2a2140"/><circle cx="-1" cy="-49" r="1.6" fill="#2a2140"/><path d="M-5 -45q1 1 2 0" stroke="#7a4a2a" stroke-width="1" fill="none"/>' +
    '<path d="M20 -32q10 -4 8 -20" stroke="#f3c08a" stroke-width="4.6" fill="none" stroke-linecap="round"><animate attributeName="d" values="M20 -32q10 -4 8 -20;M20 -32q14 -2 14 -18;M20 -32q10 -4 8 -20" dur=".8s" repeatCount="indefinite"/></path>' +
    '<text x="10" y="-62" font-size="9" font-weight="700" fill="#ffd0ea">♥</text></g>';
  return g + '</g>';
}
/* 🚧 „hamarosan” telek: alacsony léckerítés, tábla, egy kis csemete és egy láda */
function utcaTelekRajz(x, talp, s) {
  var g = '<g class="utca-telek utca-epulet" transform="translate(' + x + ' ' + talp + ') scale(' + s + ')">';
  g += '<rect x="-50" y="-96" width="100" height="104" fill="transparent"/>';
  g += '<path d="M-46 0Q0 -14 46 0Z" fill="#2c2a6e"/>';
  g += '<path d="M-6 -2V-26" stroke="#5a8a5a" stroke-width="2.4"/><circle cx="-6" cy="-32" r="8" fill="#4f8f5f"/><circle cx="-12" cy="-27" r="5" fill="#5fa06f"/>';
  g += '<rect x="14" y="-18" width="22" height="16" rx="2" fill="#8a6a4a"/><path d="M14 -10h22M25 -18v16" stroke="#6b4f33" stroke-width="1.4"/>';
  for (var i = -44; i <= 44; i += 11) g += '<path d="M' + i + ' 0V-20l3 -4l3 4V0Z" fill="#cfc6ea" opacity=".85"/>';
  g += '<path d="M-46 -8H48M-46 -15H48" stroke="#b9b0e6" stroke-width="2.4"/>';
  g += '<path d="M-30 -24V-62" stroke="#8a6a4a" stroke-width="3"/><rect x="-62" y="-84" width="66" height="24" rx="5" fill="#f3e2c0" stroke="#8a6a4a" stroke-width="2"/>';
  g += '<text x="-29" y="-67.5" text-anchor="middle" font-size="11.5" font-weight="800" fill="#8a4fd0">hamarosan</text>';
  return g + '</g>';
}
var UTCA_UJ = {
  A: { szeles: { hazak: [["fodrasz", 150, 430, 1.45], ["bolt", 400, 430, 1.45], ["bank", 650, 430, 1.45]], lampak: [[525, 430]], uni: [272, 432, .46] },
       allo:   { fold: 268, hazak: [["fodrasz", 68, 560, 1.08], ["bolt", 200, 560, 1.08], ["bank", 332, 560, 1.08]], jardak: [560, 728], lampak: [[100, 728], [300, 728]], uni: [200, 730, .5] } },
  B: { szeles: { hazak: [["fodrasz", 88, 430, 1.32], ["bolt", 244, 430, 1.32], ["bank", 712, 430, 1.32]], extra: [["telek", 400, 430, 1.3], ["telek", 556, 430, 1.3]], lampak: [[166, 430], [322, 430], [634, 430]], uni: [478, 432, .42] },
       allo:   { hazak: [["fodrasz", 70, 470, 1], ["bolt", 200, 470, 1], ["bank", 330, 470, 1]], extra: [["telek", 90, 728, 1.25], ["telek", 310, 728, 1.25]], lampak: [[135, 470], [265, 470]], uni: [200, 730, .44] } },
  C: { szeles: { hazak: [["fodrasz", 88, 430, 1.32], ["bolt", 244, 430, 1.32], ["bank", 712, 430, 1.32]], extra: [["kut", 392, 430, 1.25], ["pad", 556, 430, 1.25]], lampak: [[166, 430], [322, 430], [634, 430]], uni: [468, 432, .42] },
       allo:   { hazak: [["fodrasz", 70, 470, 1], ["bolt", 200, 470, 1], ["bank", 330, 470, 1]], extra: [["kut", 112, 728, 1.15], ["pad", 318, 728, 1.05]], lampak: [[135, 470], [265, 470]], uni: [222, 730, .44] } }
};
var _rtUtcaSVG = utcaSVG;
utcaSVG = function (mod) {
  if (!RT.uj) return _rtUtcaSVG(mod);
  var B = UTCA_ELR[mod] || UTCA_ELR.szeles, V = UTCA_UJ[RT.valt][mod] || UTCA_UJ[RT.valt].szeles;
  var L = { w: B.w, h: B.h, fold: V.fold || B.fold, hold: B.hold, portal: B.portal, tk: B.tk, csillagok: B.csillagok, jardak: V.jardak || B.jardak };
  var w = L.w, h = L.h;
  var s = '<svg class="utca-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">' + utcaDefs();
  s += '<rect x="-400" y="-600" width="' + (w + 800) + '" height="' + (600 + L.fold) + '" fill="#12194f"/>';
  s += '<rect x="-400" y="0" width="' + (w + 800) + '" height="' + L.fold + '" fill="url(#utca-eg)"/>';
  L.csillagok.forEach(function (p, i) { s += '<circle class="u-pisl" style="animation-delay:' + (i * 0.43).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.6 : 2.2) + '" fill="#fff"/>'; });
  var hx = L.hold[0], hy = L.hold[1];
  s += '<circle class="u-feny" cx="' + hx + '" cy="' + hy + '" r="44" fill="url(#u-hold)"/><circle cx="' + hx + '" cy="' + hy + '" r="20" fill="#fdf3c4"/><circle cx="' + (hx - 8) + '" cy="' + (hy - 6) + '" r="20" fill="#1c2560" opacity="0.55"/>';
  s += '<g transform="translate(' + (L.portal[0] - 200) + ',' + (L.portal[1] - 158) + ')">' + utcaPortalSVG() +
    /* a szivárvány a térképre visz: a „Matek” tábla alatt egy „Térkép” tábla (producer, 2026-10-06) */
    '<g id="utca-portal-terkep" class="utca-portal"><rect x="148" y="194" width="104" height="24" rx="12" fill="#e8f6e2" stroke="#3f9e6a" stroke-width="1.6"/>' +
    '<text x="200" y="211" text-anchor="middle" font-size="13" font-weight="800" fill="#2f7a50">🗺️ Térkép</text></g></g>';
  s += '<g transform="translate(' + L.tk[0] + ',' + L.tk[1] + ')">' + tkLepcsoSVG() + '</g>';
  s += '<rect x="-400" y="' + L.fold + '" width="' + (w + 800) + '" height="' + (h - L.fold + 600) + '" fill="url(#utca-fold)"/>';
  L.jardak.forEach(function (y) { s += utcaJarda(w, y); });
  V.lampak.forEach(function (p) { s += utcaLampa(p[0], p[1]); });
  var elemek = V.hazak.map(function (e) { return { y: e[2], svg: utcaHaz(e[0], e[1], e[2], e[3]) }; });
  (V.extra || []).forEach(function (e) {
    var f = { kut: utcaKutRajz, pad: utcaPadRajz, telek: utcaTelekRajz }[e[0]];
    elemek.push({ y: e[2], svg: f(e[1], e[2], e[3]) });
  });
  elemek.sort(function (a, b) { return a.y - b.y; }).forEach(function (e) { s += e.svg; });
  /* az unikornis az utcán: itt érkezett a szivárványkapuból, innen indul vissza */
  var u = V.uni;
  s += '<g id="utca-uni-all" pointer-events="none" transform="translate(' + u[0] + ' ' + u[1] + ') scale(' + u[2] + ')"><g style="--dir:' + (u[3] || 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG("utca-all-uni", LENYEK[mentes.leny], 1, P().oltozet) + '</g></g>';
  s += '<g id="utca-hid" pointer-events="none"></g><g id="utca-uni-hely" pointer-events="none"></g><g id="utca-hid-szikra" pointer-events="none"></g>';
  for (var i = 0; i < 7; i++) {
    var fx = (w / 7) * i + 26, fy = L.fold + 18 + ((i * 37) % 60);
    s += '<circle class="u-szentj" style="animation-delay:' + (i * 0.7).toFixed(1) + 's" cx="' + fx.toFixed(0) + '" cy="' + fy + '" r="2.2" fill="#fff6a8"/>';
  }
  return s + '</svg>';
};
var _rtRenderUtca = renderUtca;
renderUtca = function () {
  _rtRenderUtca();
  if (!RT.uj) return;
  var bolt = document.getElementById("utca-bolt");   /* a bolt az utca fölött nyílik (nem dob át az odúba) */
  if (bolt) { var uj = bolt.cloneNode(true); bolt.parentNode.replaceChild(uj, bolt); utcaKot("utca-bolt", function () { hangGomb(); utcaBoltNyit(); }); }
  utcaKot("utca-kut", function () {
    hangCsilla(); mondd("Csobb!");
    var sug = document.getElementById("utca-kut-sugar");
    if (sug) { sug.style.transition = "transform .3s"; sug.style.transformBox = "fill-box"; sug.style.transformOrigin = "50% 100%"; sug.style.transform = "scaleY(1.9)"; setTimeout(function () { sug.style.transform = ""; }, 700); }
  });
  utcaKot("utca-pad", function () {
    hangGomb(); mondd("Miaú!");
    var a = document.getElementById("utca-cica-alszik"), e = document.getElementById("utca-cica-ebren");
    if (!a || !e) return;
    a.style.display = "none"; e.style.display = "";
    clearTimeout(renderUtca._cica); renderUtca._cica = setTimeout(function () { a.style.display = ""; e.style.display = "none"; }, 2600);
  });
  utcaKot("utca-portal-terkep", utcaTavozik);
  [].forEach.call(document.querySelectorAll(".utca-telek"), function (t) { t.style.cursor = "pointer"; t.addEventListener("click", function () { hangGomb(); mondd("Ide még épül valami szép!"); }); });
};
/* a szivárványos távozás onnan indul, ahol az unikornis áll (ma: az odú-ház ajtajából) */
var _rtUtcaTavozik = utcaTavozik;
utcaTavozik = function () {
  if (!RT.uj) return _rtUtcaTavozik();
  if (_utcaTavozas) { utcaTavozasVege(); return; }
  var hely = $("utca-uni-hely"); if (!hely) return;
  hangGomb(); mondd("Induljunk matekozni!");
  var tok = _utcaTavozas = {};
  var L = UTCA_ELR[UTCA_ELR_MOST] || UTCA_ELR.szeles, u = (UTCA_UJ[RT.valt][UTCA_ELR_MOST] || UTCA_UJ[RT.valt].szeles).uni, k = u[2];
  var all = $("utca-uni-all"); if (all) all.style.display = "none";
  var ajto = [u[0], u[1]], kapu = [L.portal[0], L.portal[1] - 18];
  var ut = szivarvanyGorbe(ajto, [ajto[0], ajto[1] - 140], [kapu[0] + (ajto[0] < kapu[0] ? -110 : 110), kapu[1] + 20], kapu, 40);
  hely.innerHTML = '<g id="utca-uni-mozgo" style="transform:translate(' + ajto[0] + 'px,' + ajto[1] + 'px) scale(' + k + ')">' +
    '<g id="utca-uni-flip" style="--dir:' + (kapu[0] < ajto[0] ? -1 : 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG("utca-uni", LENYEK[mentes.leny], 1, P().oltozet) + '</g></g>';
  var m = $("utca-uni-mozgo"), fl = $("utca-uni-flip");
  uniNezoAdat(fl, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  hangCsilla();
  szivarvanyNo($("utca-hid"), ut, 34 * k / .42, 10 * k / .42, function () {
    if (_utcaTavozas !== tok) return;
    uniSzivarvanyba({ mozgo: m, el: fl, talp: [0, 0], ut: ut, skala: [k, k * 0.3], szikra: $("utca-hid-szikra") }, function () { if (_utcaTavozas === tok) utcaTavozasVege(); });
  });
};
/* 🛍️ a Bolt az utca fölött: ugyanaz a bolt-panel, csak az utca képernyőjén nyílik; bezárva az utcán maradsz */
function utcaBoltNyit() {
  var panel = $("odu-panel"), utca = $("kepernyo-utca");
  if (panel.parentNode !== utca) utca.appendChild(panel);
  mondd("Csillagbolt!");
  oduPanelNyit("holmik");
}
var _rtOduPanelZar = oduPanelZar;
oduPanelZar = function () {
  if (RT.uj && $("kepernyo-utca").classList.contains("aktiv")) { $("odu-panel").hidden = true; return; }
  _rtOduPanelZar();
};

/* ─────────────── 3. AZ ODÚ (kertkapu és utca-ajtó nélkül, a Bolt-jel helyén 🧺 Szekrény) ─────────────── */
function szekrenySVG(cx, cy) {
  var s = '<g transform="translate(' + cx + ',' + cy + ')">';
  s += '<ellipse cx="0" cy="16" rx="40" ry="8" fill="#3b2f66" opacity="0.16"/>';
  s += '<rect x="-30" y="8" width="7" height="9" rx="2" fill="#a88fce"/><rect x="23" y="8" width="7" height="9" rx="2" fill="#a88fce"/>';   /* lábak */
  s += '<path d="M-34 10V-48Q-34 -58 -24 -58H24Q34 -58 34 -48V10Z" fill="#e9d6f0" stroke="#a88fce" stroke-width="2.4"/>';   /* törzs */
  s += '<path d="M-38 -56Q0 -78 38 -56Q38 -52 34 -52H-34Q-38 -52 -38 -56Z" fill="#c9a8e6" stroke="#a88fce" stroke-width="2"/>';   /* korona */
  s += '<g stroke="#a88fce" stroke-width="1.4" stroke-linejoin="round">' + csillagSVG(0, -64, 5.5, "#ffd878") + '</g>';
  s += '<rect x="-29" y="-48" width="27" height="52" rx="4" fill="#f7d6ea" stroke="#c197bf" stroke-width="1.8"/>';   /* bal ajtó */
  s += '<path d="M-15.5 -32c-3 -4 -8 -1 -5 3l5 5l5 -5c3 -4 -2 -7 -5 -3z" fill="#f6a5c0"/><circle cx="-6" cy="-14" r="2.2" fill="#ffd24d" stroke="#c9a06a" stroke-width="1"/>';
  /* a jobb ajtó résnyire nyitva: kilóg egy csíkos sál, bent egy csillag ragyog */
  s += '<rect x="2" y="-48" width="27" height="52" rx="4" fill="#5e4a8a"/>';
  s += csillagSVG(18, -30, 5, "#ffe9ad");
  s += '<path d="M6 -40q6 8 2 18q-3 8 2 16" stroke="#f6a5c0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6 -40q6 8 2 18q-3 8 2 16" stroke="#fce49a" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="4 5"/>';
  s += '<path d="M14 -49L31 -53V7L14 5Z" fill="#f7d6ea" stroke="#c197bf" stroke-width="1.8"/><circle cx="18" cy="-16" r="2" fill="#ffd24d" stroke="#c9a06a" stroke-width="1"/>';
  s += '<path d="M23 -36c-2 -3 -6 -1 -4 2l4 4l4 -4c2 -3 -2 -5 -4 -2z" fill="#f6a5c0"/>';
  s += '<g class="odu-bolt-szikra" fill="#fff2c4">' + csillagSVG(-40, -24, 2.6, "#fff2c4") + csillagSVG(40, -40, 2.2, "#fff2c4") + '</g>';
  return s + '</g>';
}
var _rtOduSVG = oduSVG;
oduSVG = function (lenyKulcs, o, elonezet, arany) {
  if (!RT.uj || elonezet) return _rtOduSVG(lenyKulcs, o, elonezet, arany);
  var k1 = kertKapuSVG, k2 = tenyKertKapuLepke, k3 = utcaAjtoSVG, k4 = boltStandSVG;
  kertKapuSVG = function () { return ""; }; tenyKertKapuLepke = function () { return ""; }; utcaAjtoSVG = function () { return ""; }; boltStandSVG = szekrenySVG;
  try {
    return _rtOduSVG(lenyKulcs, o, elonezet, arany)
      .replace('<ellipse cx="326" cy="439" rx="48" ry="6" fill="#3b2f66" opacity="0.16"/>', "")
      .replace('<rect x="286" y="434" width="80" height="9" rx="4.5" fill="#a7d99a"/><path d="M292 438.5 h68" stroke="#d8f5b8" stroke-width="2"/>', "");
  } finally { kertKapuSVG = k1; tenyKertKapuLepke = k2; utcaAjtoSVG = k3; boltStandSVG = k4; }
};
if (RT.uj) {
  for (var _i = ODU_CELOK.length - 1; _i >= 0; _i--) if (ODU_CELOK[_i].id === "utca" || ODU_CELOK[_i].id === "kapu") ODU_CELOK.splice(_i, 1);
  ODU_CELOK.forEach(function (c) { if (c.id === "bolt") { c.felirat = "Szekrény"; c.fy = 426; } });
  ODU_CEL_TETT.bolt = { szo: function () { return "Szekrény"; }, nyit: function () { renderSzekreny(); $("odu-lap").hidden = false; } };
  ODU_UNI_HAZA = 346;   /* a kertkapu nélkül az unikornis újra a szőnyeg közepén vár */
  ODU_UNI.x = ODU_UNI_HAZA;
}
/* 🧺 a Szekrény: csak a MÁR MEGVETT holmik, ár nélkül; koppintásra felveszed / kirakod. A mai Gyűjtemény-kártyák,
   a bolt csoportjaiból (boltCsoportok + boltBirt + boltAktiv) — a Kert fül nincs benne (a kerti tárgyak a fészerben várnak). */
var SZEKRENY_SZAK = { holmik: "👗 Holmik", kinezet: "🎨 Kinézet", butorok: "🛋️ Bútorok", diszek: "🎀 Díszek", ido: "🌦 Időjárás", kristaly: "💎 Kristályok" };
function renderSzekreny() {
  $("odu-lap-cim").textContent = "🧺 Szekrény";
  var host = $("odu-lap-tartalom"); host.innerHTML = "";
  host.appendChild(el("div", "jelveny-osszeg", "Ezek a te holmijaid. Koppints rájuk!"));
  var regiFul = ODU_FUL;
  BOLT_FULEK.forEach(function (f) {
    if (!SZEKRENY_SZAK[f.id]) return;
    ODU_FUL = f.id;
    var racs = el("div", "gyujt-racs"), db = 0;
    boltCsoportok().forEach(function (cs) {
      cs.tetelek.forEach(function (t) {
        if (!boltBirt(cs, t)) return;
        db++;
        var aktiv = boltAktiv(cs, t);
        var allap = cs.fajta === "vitrin" ? "a vitrinben" : aktiv ? (cs.fajta === "ruha" || cs.fajta === "kinezet" ? "✓ rajtad" : "✓ kint") : (cs.fajta === "ruha" ? "koppints: felveszed" : "koppints: kirakod");
        var k = el("div", "gyujt-kartya van" + (aktiv ? " rajta" : "") + " kattint");
        k.innerHTML = '<div class="gkep">' + boltThumb(cs, t) + '</div><div class="gnev">' + kiiras(t.nev) + '</div><div class="gallap">' + allap + '</div>';
        k.addEventListener("click", function () {
          if (cs.fajta === "ruha") { oduRuhaVisel(cs.kulcs, aktiv ? null : t.id); mondd(aktiv ? "Levéve" : "Felvéve"); }
          else if (cs.fajta === "vitrin") { hangGomb(); mondd("Ez a Kincsvitrinben ragyog!"); }
          else if (aktiv) hangGomb();
          else {
            if (cs.fajta === "butor") oduButorBeallit(cs.kulcs, t.id);
            else if (cs.fajta === "disz") oduDiszBeallit(cs.kulcs, t.id);
            else if (cs.fajta === "kinezet") oduKinezetBeallit(cs.kulcs, t.id, false);
            else oduBeallit(cs.kulcs, t.id);
            mondd("Kirakva");
          }
          renderSzekreny();
        });
        racs.appendChild(k);
      });
    });
    var blk = el("div", "gyujt-szakasz");
    blk.appendChild(el("div", "gyujt-szakasz-cim", SZEKRENY_SZAK[f.id]));
    if (db) blk.appendChild(racs);
    else blk.appendChild(el("div", "szekreny-ures", "Még üres. Ezt a Boltban veheted meg, az utcán!"));
    host.appendChild(blk);
  });
  ODU_FUL = regiFul;
}

/* ─────────────── 4. A KERT KIJÁRATA: térkép-jel a füves part bal szélén (producer, 2026-10-06: nem kert-jel, hanem térkép) ───────────────
   Fa oszlopon álló, hajtogatott kis térkép: zöld rét, kék patak, pöttyös ösvény, piros tű; alatta „Térkép” tábla. */
function terkepJelSVG() {
  return '<svg viewBox="-50 -92 100 104" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="0" cy="6" rx="30" ry="5" fill="#3c2a50" opacity=".16"/>' +
    '<rect x="-4" y="-30" width="8" height="36" rx="2" fill="#a4734a" stroke="#6b4a33" stroke-width="1.6"/>' +
    '<path d="M-40 -84L-14 -78L14 -86L40 -80V-30L14 -36L-14 -28L-40 -34Z" fill="#fff6e0" stroke="#b5a08a" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M-14 -78V-28M14 -86V-36" stroke="#d9cbb4" stroke-width="1.6"/>' +
    '<path d="M-38 -60Q-26 -70 -14 -62Q0 -54 14 -64Q26 -72 38 -62V-32L14 -38L-14 -30L-38 -36Z" fill="#c4e6bc"/>' +
    '<path d="M-38 -44Q-20 -50 -6 -42Q8 -34 38 -44" stroke="#a9d6ef" stroke-width="3.4" fill="none"/>' +
    '<path d="M-30 -40Q-24 -60 -6 -58Q10 -56 12 -70Q16 -78 26 -74" stroke="#c9862a" stroke-width="2" fill="none" stroke-dasharray="1.5 4" stroke-linecap="round"/>' +
    '<path d="M-31 -72l-3 6h6z M-22 -76l-3 6h6z" fill="#8fc98a"/><path d="M28 -54h6v-5l-3 -3l-3 3z" fill="#f6a5c0" stroke="#b5607e" stroke-width=".8"/>' +
    '<path d="M26 -74q0 -9 0 0" /><circle cx="26" cy="-78" r="4.6" fill="#e0417a" stroke="#fff" stroke-width="1.4"/><path d="M26 -74v7" stroke="#e0417a" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="-30" y="-24" width="60" height="18" rx="9" fill="#ffffff" stroke="#e6d8f0"/><text y="-11" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2a2140" font-family="Fredoka,sans-serif">Térkép</text>' +
    '</svg>';
}
var _rtRenderKert = renderKert;
renderKert = function () {
  _rtRenderKert();
  if (!RT.uj) return;
  var kam = $("kert-kamera"); if (!kam) return;
  var d = el("div", "rt-kert-kapu");
  d.setAttribute("role", "button"); d.setAttribute("aria-label", "Térkép");
  d.innerHTML = terkepJelSVG();
  d.addEventListener("click", function (e) { e.stopPropagation(); kertKilep(); });
  kam.appendChild(d);
};
function kertKilep() {
  hangGomb(); mondd("Térkép!");
  kertSetalIde(7, function () {
    TERKEP_HOL = { leny: mentes.leny, id: "kert" };
    kertLepesHang(false); kertTajMozgasStop(); terkepNyit();
  });
}

/* ─────────────── 5. A FELHŐKERT az utcán MARAD. A próbaoldalon nincs belépés és pult-beállítás, ezért bekapcsoljuk, hogy látsszon. ─────────────── */
tkKapu = function () { return { nyitva: true }; };
tkLepcsoKoppint = function () { hangGomb(); mondd("Felhőkert!"); };

/* ══ VEZÉRLŐ ══ */
(function () {
  mentes.hang = false;
  window.RTX = { J: LT_JELKEP, D: LT_DEFS, T: LIGET_TERKEP, rf: renderFomenu, P: P, utca: renderUtca, odu: renderOdu };
  var k = RT.leny || LENY_SORREND[0];
  mentes.leny = k;
  P().csillampor = 320; P().tunderharmat = 40;
  /* bemutató holmik, hogy a Szekrényben legyen mit rakosgatni */
  try {
    RUHA_HELY.forEach(function (h) { (RUHAK[h.kulcs] || []).slice(0, 2).forEach(function (t) { P().oltozet.van[t.id] = 1; }); });
    BUTOR_HELY.forEach(function (h) { var t = (ODU_BUTOR[h.kulcs] || [])[1]; if (t) { P().odu.vanButor[h.kulcs] = P().odu.vanButor[h.kulcs] || {}; P().odu.vanButor[h.kulcs][t.id] = 1; } });
    Object.keys(DISZ_TARGY).slice(0, 3).forEach(function (id) { P().odu.vanDisz[id] = 1; });
    KRISTALY.slice(0, 2).forEach(function (t) { P().odu.vitrin[t.id] = 1; });
    ODU_KAT.ido.slice(0, 3).forEach(function (t) { P().odu.van.ido[t.id] = 1; });
  } catch (e) { console.warn("bemutató holmik", e); }
  if (RT.uj) {
    var st = document.createElement("style");
    st.textContent = ".rt-kert-kapu{position:absolute;left:1%;bottom:5%;width:min(11%,110px);z-index:900;cursor:pointer;filter:drop-shadow(0 3px 4px rgba(0,0,0,.18))}" +
      ".rt-kert-kapu:hover{transform:translateY(-3px)}.rt-kert-kapu svg{width:100%;display:block}" +
      ".szekreny-ures{color:#8a7aa8;font-style:italic;padding:6px 4px 14px}";
    document.head.appendChild(st);
    $("fomenu-odu").hidden = true;   /* a térkép fejlécéből kikerül az „🏠 Odú” (az Odú a térképen van) */
    $("odu-vissza").textContent = "← Térkép"; $("odu-valto").hidden = true;
    $("kert-vissza").textContent = "← Térkép"; $("utca-vissza").textContent = "← Térkép";
  }
  terkepNyit();
  setTimeout(function () {
    if (RT.kep === "utca") utcaNyit();
    else if (RT.kep === "odu") oduNyit("fomenu");
    else if (RT.kep === "kert") kertNyit();
    else if (RT.kep === "bolt") { utcaNyit(); if (RT.uj) utcaBoltNyit(); else { oduNyit(); oduPanelNyit(); } }
    else if (RT.kep === "szekreny") { oduNyit("fomenu"); if (RT.uj) { renderSzekreny(); $("odu-lap").hidden = false; } }
    window.__RT_KESZ = true;
  }, 60);
})();

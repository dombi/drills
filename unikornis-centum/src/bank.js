/* ============ 10f) 🏦 TÜNDÉRBANK — ✨ → 💧 váltás az utcán ============
   Terv: terv/bank-rendszerterv.html (jóváhagyva 2026-09-30, bővítve 2026-10-01), terv/bank-rajzterv.html
   (a gyerekek rajza), terv/utca-kepernyoterv.html (a bank a jobb szélen).
   - A bank nem tudja előre, mit vált: mindent a VALUTAK és a VALTASOK táblából olvas (a FESTEKEK mintájára).
     Új váltás = új sor → magától új gomb a bankban ÉS új sor a pulton (admin/index.html BANK_VALTASOK — együtt!).
   - Ár / napi korlát / ki-be / nyitás módja / kijelölt pályák: a pultról (config.js bankOsszevon → FELULIR.bank).
     NINCS alapérték: amíg sehol nincs ár, a bank ZÁRVA („🌙 hamarosan”).
   - Mentés: P().bank = { nap, valtva: { valtasId: N } (aznapi beváltások), jegy: { valtasId: N } (pályával
     szerzett, még be nem váltott váltások — megmarad másnapra) }. */
var VALUTAK = [
  { id: "csillampor",   nev: "csillámpor",   ikon: "✨", mezo: "csillampor",   targyeset: "csillámport",   ert: "csillámporért" },
  { id: "tunderharmat", nev: "tündérharmat", ikon: "💧", mezo: "tunderharmat", targyeset: "tündérharmatot", ert: "tündérharmatért" }
];
var VALUTA_BY = {}; VALUTAK.forEach(function (v) { VALUTA_BY[v.id] = v; });
/* ad: a gyerek ezt adja (valuta-id, az ár a pultról jön) · kap: ezt kapja, kapDb darabot.
   Előkészítve (még nincs kódja): tárgy → pénz váltásnál ad = { targy: "<tárgy-id>" } — a bank az ilyen sort átugorja. */
var VALTASOK = [
  { id: "csilla-harmat", ad: "csillampor", kap: "tunderharmat", kapDb: 1 }
];
function bankValtasok() { return VALTASOK.filter(function (v) { return typeof v.ad === "string" && VALUTA_BY[v.ad] && VALUTA_BY[v.kap]; }); }

/* ── állapot ── */
function bankMent() { var b = P().bank || (P().bank = alapBank()); if (!b.valtva) b.valtva = {}; if (!b.jegy) b.jegy = {}; return b; }
function bankNapi() {   /* éjfélkor új nap: az aznapi beváltás-számláló nullázódik (a jegyek megmaradnak) */
  var b = bankMent(), ma = helyiNap();
  if (b.nap !== ma) { b.nap = ma; b.valtva = {}; }
  return b;
}
function bankBeall(vid) { return (FELULIR.bank || {})[vid] || {}; }
/* egy váltás állapota a gyerek szemével */
function bankAllapot(v) {
  var b = bankBeall(v.id), ar = +b.ar;
  if (!(ar >= 1) || b.ki === true) return { zarva: true };
  var m = bankNapi(), ma = m.valtva[v.id] || 0;
  var korlat = typeof b.korlat === "number" && b.korlat >= 0 ? b.korlat : null;
  var korlatMaradt = korlat === null ? Infinity : Math.max(0, korlat - ma);
  var palyas = b.mod === "palya", jegy = m.jegy[v.id] || 0;
  return { zarva: false, ar: ar, korlat: korlat, korlatMaradt: korlatMaradt, palyas: palyas, jegy: jegy,
    maradt: palyas ? Math.min(jegy, korlatMaradt) : korlatMaradt,
    elegPenz: (P()[VALUTA_BY[v.ad].mezo] || 0) >= ar, palyak: palyas ? (b.palyak || []) : [] };
}
function bankZarva() { return !bankValtasok().some(function (v) { return !bankAllapot(v).zarva; }); }
/* pálya vége (engine-logic.js palyaVege): kijelölt pálya → +1 váltás. Visszaad: hány jegy jött. */
function bankPalyaKesz(pid) {
  var db = 0;
  bankValtasok().forEach(function (v) {
    var b = bankBeall(v.id);
    if (b.mod !== "palya" || b.ki === true || !(+b.ar >= 1) || (b.palyak || []).indexOf(pid) < 0) return;
    var m = bankMent(); m.jegy[v.id] = (m.jegy[v.id] || 0) + 1; db++;
  });
  return db;
}
/* a kijelölt pályák neve (csak amit a gyerek lát), a bagoly mondatához */
function bankPalyaNevek(ids) {
  var l = [];
  (ids || []).forEach(function (id) { var pa = palyaKeres(id); if (pa && !palyaRejtve(pa)) l.push(pa.nev); });
  return l;
}

/* ── a bankár bagoly (rajzterv: karamell, szemüveg, pink csokornyakkendő, pislog) — 0,0 a test közepe ── */
function bankarBagoly(x, y, s) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="46" rx="34" ry="6" fill="#000" opacity=".18"/>' +
    '<path d="M-26,-40 l8,-16 l8,15 Z" fill="#c98d55"/><path d="M26,-40 l-8,-16 l-8,15 Z" fill="#c98d55"/>' +
    '<ellipse cx="0" cy="0" rx="34" ry="44" fill="#e2b07a"/>' +
    '<ellipse cx="0" cy="12" rx="22" ry="29" fill="#fbe6c8"/>' +
    '<path d="M-10,14 q3,4 6,0 M2,22 q3,4 6,0 M-6,30 q3,4 6,0" stroke="#e2b07a" stroke-width="2" fill="none"/>' +
    '<path d="M-34,-4 Q-48,14 -33,34 Q-28,14 -29,-4 Z" fill="#c98d55"/><path d="M34,-4 Q48,14 33,34 Q28,14 29,-4 Z" fill="#c98d55"/>' +
    '<circle cx="-13" cy="-15" r="13" fill="#fffaf0"/><circle cx="13" cy="-15" r="13" fill="#fffaf0"/>' +
    '<g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .1;1 1" keyTimes="0;.93;.965;1" dur="4.2s" repeatCount="indefinite" additive="sum"/>' +
    '<circle cx="-11" cy="-13" r="6" fill="#4a3b7a"/><circle cx="11" cy="-13" r="6" fill="#4a3b7a"/></g>' +
    '<circle cx="-13" cy="-16" r="2" fill="#fff"/><circle cx="9" cy="-16" r="2" fill="#fff"/>' +
    '<circle cx="-13" cy="-15" r="16" fill="none" stroke="#7a5230" stroke-width="2.5"/><circle cx="13" cy="-15" r="16" fill="none" stroke="#7a5230" stroke-width="2.5"/><path d="M-2,-17 h4" stroke="#7a5230" stroke-width="2.5"/>' +
    '<path d="M-5,-3 L5,-3 L0,8 Z" fill="#ffb347"/>' +
    '<g transform="translate(0,17)"><path d="M0,0 L-13,-7 L-13,7 Z" fill="#f06aa8"/><path d="M0,0 L13,-7 L13,7 Z" fill="#f06aa8"/><circle r="3.5" fill="#d84f96"/></g>' +
    '<path d="M-14,44 l-4,8 M-8,45 l-1,8 M8,45 l1,8 M14,44 l4,8" stroke="#ffb347" stroke-width="4" stroke-linecap="round"/>' +
    '</g>';
}

/* ── a bank háza az utcán (rajzterv külső jelenete, ég nélkül): 0,4-re kicsinyítve, középen x=200, talp 432
   (az utca régi koordinátáiban — szalon.js utcaHely teszi a helyére) ── */
function utcaBankRajz(zarva) {
  var h = '<g filter="url(#u-firka)">' +
    '<rect x="86" y="52" width="228" height="20" rx="4" fill="#56709e"/>' +
    '<path d="M92 70 H308 V412 H92 Z" fill="url(#u-b-fal)"/>' +
    '<path d="M92 70 H308 V78 H92Z" fill="#000" opacity=".12"/>';
  for (var y = 96; y < 400; y += 26) h += '<path d="M92 ' + y + ' H308" stroke="#fff" stroke-opacity=".06" stroke-width="2"/>';
  [[114, 104], [218, 104]].forEach(function (a, i) {
    h += '<circle class="u-feny" style="animation-delay:' + i + 's" cx="' + (a[0] + 34) + '" cy="' + (a[1] + 35) + '" r="62" fill="url(#u-izz)"/>' +
      '<rect x="' + (a[0] - 5) + '" y="' + (a[1] - 5) + '" width="78" height="80" rx="5" fill="#c9bde6"/>' +
      '<rect x="' + a[0] + '" y="' + a[1] + '" width="68" height="70" rx="3" fill="url(#u-b-ablak)"/>' +
      '<path d="M' + a[0] + ' ' + a[1] + ' q18 22 10 70 H' + a[0] + 'Z" fill="#f6a5c0" opacity=".75"/>' +
      '<path d="M' + (a[0] + 68) + ' ' + a[1] + ' q-18 22 -10 70 H' + (a[0] + 68) + 'Z" fill="#f6a5c0" opacity=".75"/>' +
      '<rect x="' + (a[0] - 8) + '" y="' + (a[1] + 72) + '" width="84" height="7" rx="2" fill="#b3a4d6"/>';
  });
  h += '</g>';
  /* a bagoly néha kikukucskál a bal ablakon */
  h += '<g clip-path="url(#u-b-bal)"><g><animateTransform attributeName="transform" type="translate" values="0 60;0 60;0 0;0 0;0 60" keyTimes="0;.55;.62;.85;1" dur="9s" repeatCount="indefinite"/>' +
    bankarBagoly(148, 160, .62) + '</g></g>';
  h += '<g filter="url(#u-firka)"><rect x="126" y="196" width="148" height="62" rx="6" fill="#f7b8d0"/><rect x="131" y="201" width="138" height="52" rx="4" fill="url(#u-b-tabla)"/></g>' +
    '<text x="200" y="240" text-anchor="middle" font-family="Comic Sans MS, Fredoka, Segoe UI, sans-serif" font-size="38" font-style="italic" font-weight="700" fill="#eef0ff" stroke="#4a5ad8" stroke-width="5" paint-order="stroke">bank</text>' +
    uCsillam(140, 206, 6, "#fff", 0) + uCsillam(262, 248, 5, "#ffe08a", 1.1);
  h += '<g filter="url(#u-firka)">';
  [150, 250].forEach(function (lx, i) {
    h += '<circle class="u-feny" style="animation-delay:' + (i * .8) + 's" cx="' + lx + '" cy="316" r="22" fill="url(#u-izz)"/>' +
      '<path d="M' + lx + ' 300 v6" stroke="#4a3b7a" stroke-width="3"/><rect x="' + (lx - 7) + '" y="306" width="14" height="18" rx="4" fill="#fff2a0" stroke="#4a3b7a" stroke-width="2.5"/>';
  });
  h += '<rect x="167" y="290" width="66" height="122" rx="4" fill="#c9bde6"/><rect x="172" y="295" width="56" height="117" rx="3" fill="#a24aa3"/>' +
    '<rect x="178" y="304" width="44" height="40" rx="3" fill="#8e3a90"/><rect x="178" y="352" width="44" height="50" rx="3" fill="#8e3a90"/>' +
    '<path d="M180 360 h14 v8" stroke="#3f4fd0" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<rect x="156" y="410" width="88" height="9" rx="3" fill="#56709e"/></g>';
  return '<rect x="152" y="276" width="96" height="182" fill="transparent"/>' +
    '<g transform="translate(120,264.4) scale(0.4)">' + h + '</g>' +
    (zarva ? utcaZarCimke(200, "🌙 hamarosan") : "");
}

/* ── a bank belseje (rajzterv): levendula fal, kék padló, pult, széf, két felhő, bagoly ── */
function bankBelsoSVG() {
  var s = '<svg class="bank-svg" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<filter id="bk-firka" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>' +
    '<linearGradient id="bk-fal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4c9ee"/><stop offset="1" stop-color="#c3b6e4"/></linearGradient>' +
    '<linearGradient id="bk-padlo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6886b8"/><stop offset="1" stop-color="#7c9bcc"/></linearGradient>' +
    '<linearGradient id="bk-pult" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2835b"/><stop offset="1" stop-color="#a86c47"/></linearGradient>' +
    '<linearGradient id="bk-szef" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3354"/><stop offset="1" stop-color="#1f1a30"/></linearGradient>' +
    '<radialGradient id="bk-arany"><stop offset="0" stop-color="#fff0a0"/><stop offset=".6" stop-color="#ffd23f"/><stop offset="1" stop-color="#f4b400"/></radialGradient>' +
    '<radialGradient id="bk-harmat"><stop offset="0" stop-color="#e6f8ff"/><stop offset=".6" stop-color="#a8e0f0"/><stop offset="1" stop-color="#7cc8e2"/></radialGradient>' +
    '<radialGradient id="bk-izz"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '</defs>';
  /* fal és padló a képernyő széléig (a viewBox-on túl is) */
  s += '<rect x="-600" y="-600" width="1600" height="862" fill="#d4c9ee"/><rect x="-600" y="258" width="1600" height="800" fill="#7c9bcc"/>';
  s += '<g filter="url(#bk-firka)">';
  s += '<rect x="-600" width="1600" height="262" fill="url(#bk-fal)"/>';
  for (var x = -590; x < 1000; x += 38) s += '<path d="M' + x + ' 0 V262" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>';
  s += '<rect x="-600" y="244" width="1600" height="18" fill="#b3a4d6"/>';
  s += '<rect x="-600" y="258" width="1600" height="202" fill="url(#bk-padlo)"/>';
  for (var i = -6; i <= 6; i++) s += '<path d="M' + (200 + i * 22) + ' 262 L' + (200 + i * 70) + ' 460" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>';
  [300, 350, 410].forEach(function (y) { s += '<path d="M-600 ' + y + ' H1000" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>'; });
  /* széf a pult mögött (a gyerekek fekete doboza) */
  s += '<rect x="150" y="34" width="100" height="128" rx="8" fill="url(#bk-szef)"/>';
  s += '<rect x="158" y="42" width="84" height="112" rx="5" fill="none" stroke="#5a5078" stroke-width="3"/>';
  s += '<path d="M156 60 h-8 M156 136 h-8" stroke="#8a80a8" stroke-width="5" stroke-linecap="round"/>';
  s += '</g>';
  s += '<g class="bk-tarcsa"><circle cx="200" cy="64" r="15" fill="#c9c3dc" stroke="#8a80a8" stroke-width="3"/><path d="M200 51 V58 M213 64 H206 M200 77 V70 M187 64 H194" stroke="#5a5078" stroke-width="2.5"/><circle cx="200" cy="64" r="4" fill="#ffd24d"/></g>';
  s += uCsillam(236, 48, 5, "#ffe08a", .4);
  /* sárga csillámpor-felhő (bal) */
  s += '<g class="bk-lebeg"><g transform="translate(-30,-10)"><circle cx="100" cy="112" r="44" fill="url(#bk-izz)" class="u-feny"/>' +
    '<g filter="url(#bk-firka)"><path d="M62 124 q-16 -2 -12 -18 q2 -16 20 -14 q4 -20 26 -18 q18 -12 34 4 q20 -2 20 18 q14 10 2 24 q-4 12 -22 8 q-14 10 -32 2 q-20 6 -36 -6 Z" fill="url(#bk-arany)"/></g>' +
    uCsillam(80, 100, 6, "#fff", 0) + uCsillam(116, 94, 5, "#fff", .7) + uCsillam(128, 122, 4, "#fff8d0", 1.3) + uCsillam(92, 130, 4, "#fff", .3) +
    '<text x="100" y="164" text-anchor="middle" font-size="13" font-weight="800" fill="#8a6a1e">✨ csillámpor</text></g></g>';
  /* világoskék harmat-felhő (jobb) */
  s += '<g class="bk-lebeg2"><g transform="translate(30,-10)"><circle cx="300" cy="108" r="44" fill="url(#bk-izz)" class="u-feny"/>' +
    '<g filter="url(#bk-firka)"><path d="M262 118 q-14 -4 -8 -18 q6 -14 22 -10 q6 -20 28 -16 q20 -6 28 12 q18 4 12 22 q6 14 -10 18 q-10 10 -26 4 q-16 8 -30 0 q-18 2 -16 -12 Z" fill="url(#bk-harmat)"/></g>' +
    '<path d="M288 96 q-4 6 0 9 q4 -3 0 -9Z M312 108 q-4 6 0 9 q4 -3 0 -9Z M298 120 q-4 6 0 9 q4 -3 0 -9Z" fill="#fff" opacity=".85"/>' +
    '<path d="M300 140 q-5 8 0 12 q5 -4 0 -12Z" fill="#7cc8e2"><animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 40;0 40" keyTimes="0;.6;.95;1" dur="3.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.6;.9;1" dur="3.6s" repeatCount="indefinite"/></path>' +
    '<text x="300" y="164" text-anchor="middle" font-size="13" font-weight="800" fill="#2f7ea0">💧 tündérharmat</text></g></g>';
  /* bagoly a pult mögött, a széf előtt */
  s += bankarBagoly(200, 124, .78);
  /* pult (a gyerekek barna doboza) */
  s += '<g filter="url(#bk-firka)">';
  s += '<ellipse cx="200" cy="266" rx="112" ry="9" fill="#000" opacity=".15"/>';
  s += '<ellipse cx="200" cy="330" rx="120" ry="30" fill="#f6a5c0"/><ellipse cx="200" cy="330" rx="104" ry="23" fill="none" stroke="#fdf0d0" stroke-width="3" stroke-dasharray="6 5"/>';
  s += '<rect x="96" y="160" width="208" height="16" rx="5" fill="#d99f75"/>';
  s += '<rect x="104" y="174" width="192" height="90" rx="4" fill="url(#bk-pult)"/>';
  s += '<rect x="118" y="186" width="74" height="64" rx="4" fill="#9a6240" opacity=".55"/><rect x="208" y="186" width="74" height="64" rx="4" fill="#9a6240" opacity=".55"/>';
  s += '</g>';
  s += '<g transform="translate(200,218)"><rect x="-34" y="-15" width="68" height="30" rx="10" fill="#fdf0d0" stroke="#b98652" stroke-width="2.5"/><text y="6" text-anchor="middle" font-size="15">✨ → 💧</text></g>';
  /* csengő a pulton */
  s += '<g transform="translate(248,160)"><path d="M-9 0 q0 -14 9 -14 q9 0 9 14 Z" fill="#ffd24d" stroke="#b98652" stroke-width="1.5"/><rect x="-12" y="-1" width="24" height="4" rx="2" fill="#b98652"/><circle cy="-16" r="2.5" fill="#b98652"/></g>';
  s += '<g id="bank-reszecskek"></g>';
  return s + '</svg>';
}

/* ── képernyő ── */
var BANK_DLG = null;    /* a megerősítésre váró váltás id-je */
function bankNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  BANK_DLG = null;
  var host = $("bank-szinter");
  if (host) host.innerHTML = bankBelsoSVG() +
    '<div class="bank-hud" id="bank-hud"></div><div class="bank-buborek" id="bank-buborek"></div>' +
    '<div class="bank-gombok" id="bank-gombok"></div><div id="bank-ablak-hely"></div>';
  bankFrissit();
  mutat("kepernyo-bank");
  setTimeout(function () { bankMond(bankZarva() ? "A bank még nem nyitott ki, nemsokára gyere vissza!" : "Üdv a Tündérbankban!"); }, 350);
}
function bankMond(t) {
  mondd(t);
  var b = $("bank-buborek"); if (!b) return;
  b.textContent = "🦉 " + t; b.classList.add("lat");
  clearTimeout(bankMond.t); bankMond.t = setTimeout(function () { b.classList.remove("lat"); }, 3400);
}
/* a felső sor szövege: mennyi váltás van még (az első nyitott váltásé) */
function bankHudSzoveg() {
  var l = bankValtasok().map(bankAllapot).filter(function (a) { return !a.zarva; });
  if (!l.length) return "🌙 zárva";
  var a = l[0];
  if (a.palyas) return "Váltható: " + a.maradt;
  return a.korlat === null ? "" : "Ma még váltható: " + a.maradt;
}
function bankFrissit() {
  var cp = $("bank-csillampor"); if (cp) cp.textContent = P().csillampor;
  var hp = $("bank-harmat"); if (hp) hp.textContent = (P().tunderharmat || 0);
  var hud = $("bank-hud");
  if (hud) { var t = bankHudSzoveg(); hud.textContent = t; hud.style.display = t ? "" : "none"; }
  var g = $("bank-gombok");
  if (g) {
    g.innerHTML = bankValtasok().map(function (v) {
      var a = bankAllapot(v), ad = VALUTA_BY[v.ad], kap = VALUTA_BY[v.kap];
      var halv = a.zarva || a.maradt <= 0 || !a.elegPenz;
      var felirat = a.zarva ? "🌙 Hamarosan nyitunk" : a.ar + " " + ad.ikon + " → " + v.kapDb + " " + kap.ikon;
      return '<button class="bank-valto' + (halv ? " halvany" : "") + '" data-v="' + v.id + '">' + felirat + "</button>";
    }).join("");
    g.querySelectorAll(".bank-valto").forEach(function (b) { b.addEventListener("click", function () { bankValtoKoppint(b.getAttribute("data-v")); }); });
  }
  var hely = $("bank-ablak-hely");
  if (hely) {
    var v = BANK_DLG && bankValtasok().filter(function (x) { return x.id === BANK_DLG; })[0];
    if (!v) hely.innerHTML = "";
    else {
      var a = bankAllapot(v), ad = VALUTA_BY[v.ad], kap = VALUTA_BY[v.kap];
      hely.innerHTML = '<div class="bank-ablak"><div class="bank-doboz">Odaadsz ' + a.ar + " " + ad.targyeset + "<br>" + v.kapDb + " " + kap.ert + "?" +
        '<div class="bank-nagy">' + ad.ikon + " " + a.ar + " → " + kap.ikon + " " + v.kapDb + "</div>" +
        '<div class="bank-dlg-gombok"><button class="bank-igen" id="bank-igen">Igen</button><button class="bank-nem" id="bank-nem">Nem</button></div></div></div>';
      $("bank-igen").addEventListener("click", bankValt);
      $("bank-nem").addEventListener("click", function () { hangGomb(); BANK_DLG = null; bankFrissit(); bankMond("Rendben, majd legközelebb!"); });
    }
  }
  var sugo = $("bank-sugo");
  if (sugo) sugo.textContent = bankZarva() ? "A bank hamarosan kinyit. 🌙" : "Koppints a rózsaszín gombra, és válts! 🏦";
}
function bankValtoKoppint(vid) {
  hangGomb();
  var v = bankValtasok().filter(function (x) { return x.id === vid; })[0]; if (!v) return;
  var a = bankAllapot(v), ad = VALUTA_BY[v.ad], kap = VALUTA_BY[v.kap];
  if (a.zarva) { bankMond("A bank még nem nyitott ki, nemsokára gyere vissza!"); return; }
  if (a.palyas && a.jegy <= 0) {
    var nevek = bankPalyaNevek(a.palyak);
    if (!nevek.length) bankMond("A bank még nem nyitott ki, nemsokára gyere vissza!");
    else if (nevek.length === 1) bankMond("Járd végig ezt a pályát: " + nevek[0] + "! Utána válthatsz.");
    else bankMond("Járd végig az egyik pályát: " + nevek[0] + " vagy " + nevek[1] + "! Utána válthatsz.");
    return;
  }
  if (a.maradt <= 0) { bankMond("Mára ennyi, holnap újra jöhetsz!"); return; }
  if (!a.elegPenz) { bankMond("Még " + (a.ar - (P()[ad.mezo] || 0)) + " " + ad.nev + " kell."); return; }
  BANK_DLG = v.id; bankFrissit();
  mondd("Odaadsz " + a.ar + " " + ad.targyeset + " " + v.kapDb + " " + kap.ert + "?");
}
function bankValt() {
  var v = bankValtasok().filter(function (x) { return x.id === BANK_DLG; })[0]; BANK_DLG = null;
  if (!v) { bankFrissit(); return; }
  var a = bankAllapot(v), ad = VALUTA_BY[v.ad], kap = VALUTA_BY[v.kap];
  if (a.zarva || a.maradt <= 0 || !a.elegPenz) { hangGomb(); bankFrissit(); return; }
  var m = bankNapi();
  P()[ad.mezo] -= a.ar; P()[kap.mezo] = (P()[kap.mezo] || 0) + v.kapDb;
  m.valtva[v.id] = (m.valtva[v.id] || 0) + 1;
  if (a.palyas) m.jegy[v.id] = Math.max(0, (m.jegy[v.id] || 0) - 1);
  vasarlasNaplo("bank-" + v.id, a.ar, ad.id);
  hangCsilla(); ment();
  bankFrissit(); bankRepul();
  var utana = bankAllapot(v);
  setTimeout(function () {
    hangJo();
    bankMond(utana.maradt <= 0 && !utana.palyas ? "Tessék a " + kap.nev + "! Mára ennyi, holnap újra jöhetsz!" : "Tessék, itt a " + kap.nev + "od!");
  }, 400);
}
/* váltáskor: ✨ szemcsék repülnek a sárga felhőből a kékbe, a kék felhőből kiesik egy 💧 */
function bankRepul() {
  var g = document.getElementById("bank-reszecskek"); if (!g) return;
  var NS = "http://www.w3.org/2000/svg", t0 = performance.now();
  function emoji(t, meret) { var p = document.createElementNS(NS, "text"); p.textContent = t; p.setAttribute("font-size", meret); p.setAttribute("text-anchor", "middle"); g.appendChild(p); return p; }
  for (var i = 0; i < 7; i++) (function (i) {
    var p = emoji("✨", 16), x0 = 60 + Math.random() * 24, y0 = 94 + Math.random() * 20, x1 = 330, y1 = 100, k = i * 70;
    (function lep(now) {
      var u = Math.min(1, Math.max(0, (now - t0 - k) / 700)), e = u * u * (3 - 2 * u);
      p.setAttribute("x", x0 + (x1 - x0) * e); p.setAttribute("y", y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 70);
      p.setAttribute("opacity", u >= 1 ? 0 : 1);
      if (u < 1) requestAnimationFrame(lep); else p.remove();
    })(t0);
  })(i);
  setTimeout(function () {
    var d = emoji("💧", 26), t1 = performance.now();
    (function lep(now) {
      var u = Math.min(1, (now - t1) / 650), e = u * u;
      d.setAttribute("x", 330 + 40 * e); d.setAttribute("y", 120 - 100 * e - Math.sin(u * Math.PI) * 20); d.setAttribute("opacity", 1 - Math.max(0, u - .8) * 5);
      if (u < 1) requestAnimationFrame(lep); else d.remove();
    })(t1);
  }, 1100);
}

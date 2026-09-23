/* ============ 10d) KERT / UDVAR (1. fázis: séta) ============
   Teljesen additív: saját mentés-ág P().kert, saját DOM #kepernyo-kert + .kert-* CSS.
   Belépés az odú kertkapuján (csak P().kert.nyitva esetén). Séta: koppints a fűre → odasétál. */
var KERT_UNI_X = 50;   /* az unikornis vízszintes helye, % */
function kertNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  kertHangokBetolt();                    /* kerti hangklipek dekódolása (egyszer) */
  KERT_UNI_X = 50;
  KERT_MOD = null; KERT_RAK_TIP = null;   /* friss belépéskor séta-mód */
  renderKert();
  mutat("kepernyo-kert");
}
function renderKert() {
  var cel = $("kert-csillampor"); if (cel) cel.textContent = P().csillampor;
  var harmatEl = $("kert-harmat"); if (harmatEl) harmatEl.textContent = (P().tunderharmat || 0);   /* 💧 kitartás-valuta */
  var host = $("kert-szinter"); if (!host) return;
  var c = LENYEK[mentes.leny];
  host.innerHTML =
    kertHatterSVG() +
    '<div id="kert-elemek" class="kert-elemek"></div>' +                    /* lerakott tárgyak rétege (mélység szerint sorolva) */
    '<div id="kert-uni-doboz" class="kert-uni-doboz"><div class="kert-uni-flip">' +
      '<svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' +
        unikornisSVG("kert-uni", c, 1, P().oltozet) +
      '</svg></div></div>';
  var doboz = $("kert-uni-doboz");
  doboz.style.left = KERT_UNI_X + "%";
  doboz.style.setProperty("--dir", 1);
  doboz.style.zIndex = 870;   /* talajpontja ~87%: a lentebb (y>87) tett tárgyak elé, a fentebbiek mögé kerül */
  KERT_UL = false; KERT_FEKSZIK = false;   /* friss belépéskor áll (a doboz DOM újraépült, a pihenő-pózok eltűntek) */
  host.onclick = kertSzinterKlikk;
  kertElemekRender();
  kertEszkozsorRender();
  kertFeszerRender();
  kertTrukksorRender();
}
/* a színtérre koppintás: berendezés-módban lerakás, egyébként séta */
function kertSzinterKlikk(e) {
  var host = $("kert-szinter"); if (!host) return;
  if (KERT_TRUKK_FUT) return;                                            /* egyszeri trükk közben nem történik semmi */
  if (KERT_MOD === "pakol") {
    var pe = e.target.closest && e.target.closest(".kt-elem");
    if (pe) kertElemPakol(parseInt(pe.getAttribute("data-i"), 10));
    return;
  }
  var r = host.getBoundingClientRect();
  if (KERT_MOD === "rak") {
    if (!KERT_RAK_TIP) { var s0 = $("kert-sugo"); if (s0) s0.textContent = "Válassz lentről egy tárgyat, majd koppints a fűre! 🧺"; return; }
    kertElemRak(KERT_RAK_TIP, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    return;
  }
  /* séta mód (alap) */
  if (e.target.closest && e.target.closest("#kert-uni-doboz")) { kertNyihog(); return; }   /* magára az unikornisra koppintva nem lép, hanem nyihog */
  var etelDiv = e.target.closest && e.target.closest(".kt-etel-elem");   /* letett ÉTEL-re koppintva: Evés (vagy súgó) */
  if (etelDiv) { kertEtelKoppint(parseInt(etelDiv.getAttribute("data-i"), 10)); return; }
  var agyDiv = e.target.closest && e.target.closest(".kt-agy-elem");     /* letett ÁGY-ra koppintva: Befekvés (vagy súgó) */
  if (agyDiv) { kertAgyKoppint(parseInt(agyDiv.getAttribute("data-i"), 10)); return; }
  var novenyDiv = e.target.closest && e.target.closest(".kt-noveny-elem");   /* letett NÖVÉNY-re: megszagolom */
  if (novenyDiv) { kertNovenyKoppint(parseInt(novenyDiv.getAttribute("data-i"), 10)); return; }
  if (KERT_UL || KERT_FEKSZIK) { kertAll(); return; }                    /* ha ül vagy fekszik, a fűre koppintás előbb felállítja */
  kertSetal(((e.clientX - r.left) / r.width) * 100);
}

/* ── BERENDEZÉS-MÓD (3. fázis, 1. lépés): a fészerből a fűre lerakhatók a megvett tárgyak ── */
var KERT_MOD = null;       /* null = séta · "rak" = berendezés */
var KERT_RAK_TIP = null;   /* a fészerből kiválasztott tárgy id-je, amit épp lerakunk */

/* alsó eszközsor: Berendezés (be/ki) + Elpakolás (csak ha van már lerakott tárgy) */
function kertEszkozsorRender() {
  var sor = $("kert-eszkozsor"); if (!sor) return;
  var host = $("kert-szinter");
  var pakolVan = (P().kert.elemek || []).length > 0;
  var html = '<button class="kert-eszkoz-gomb' + (KERT_MOD === "rak" ? ' aktiv' : '') + '" data-mod="rak">' +
    '<span class="kesz-emoji">🧺</span> Berendezés</button>';
  if (pakolVan) html += '<button class="kert-eszkoz-gomb' + (KERT_MOD === "pakol" ? ' aktiv' : '') + '" data-mod="pakol">' +
    '<span class="kesz-emoji">🧹</span> Elpakolás</button>';
  sor.innerHTML = html;
  sor.hidden = false;
  sor.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".kert-eszkoz-gomb"); if (!b) return;
    hangGomb(); kertModValt(b.getAttribute("data-mod"));
  };
  if (host) { host.classList.toggle("rak", KERT_MOD === "rak"); host.classList.toggle("pakol", KERT_MOD === "pakol"); }
}
function kertModValt(mod) {
  KERT_MOD = (KERT_MOD === mod) ? null : mod;   /* ugyanarra koppintva kikapcsol */
  if (KERT_MOD !== "rak") KERT_RAK_TIP = null;
  if ((KERT_UL || KERT_FEKSZIK) && KERT_MOD) kertAll();   /* berendezés közben ne maradjon ülve/fekve */
  var sugo = $("kert-sugo");
  if (sugo) sugo.textContent = (KERT_MOD === "rak")
    ? "Válassz egy tárgyat, majd koppints a fűre, hová tegyem! 🧺"
    : (KERT_MOD === "pakol")
    ? "Koppints egy tárgyra — visszakerül a fészerbe. 🧹"
    : "Koppints a fűre — az unikornis odasétál. 🚶";
  kertEszkozsorRender(); kertFeszerRender(); kertElemekRender();
}
/* elpakolás: egy lerakott tárgyra koppintva visszakerül a fészerbe (semmi nem vész el) */
function kertElemPakol(i) {
  var o = P().kert.elemek[i]; if (!o) return;
  P().kert.elemek.splice(i, 1);
  P().kert.keszlet[o.tip] = (P().kert.keszlet[o.tip] || 0) + 1;
  hangGomb(); ment();
  if ((P().kert.elemek || []).length === 0) KERT_MOD = null;   /* elfogytak a tárgyak → vissza séta-módba */
  kertElemekRender(); kertEszkozsorRender(); kertFeszerRender();
  var sugo = $("kert-sugo");
  if (sugo) sugo.textContent = (KERT_MOD === "pakol")
    ? "Visszatettem a fészerbe! Koppints másikra, vagy lépj ki. 🧹"
    : "Koppints a fűre — az unikornis odasétál. 🚶";
}
/* a fészer: a megvett, még le nem tett tárgyak (id→db). Berendezés-módban látszik. */
function kertFeszerRender() {
  var sor = $("kert-feszer"); if (!sor) return;
  if (KERT_MOD !== "rak") { sor.hidden = true; sor.innerHTML = ""; return; }
  var kesz = P().kert.keszlet || {}, chips = "", van = false;
  KERT_TARGYAK.forEach(function (t) {
    var db = kesz[t.id] || 0; if (db <= 0) return;
    van = true;
    chips += '<button class="kert-feszer-chip' + (KERT_RAK_TIP === t.id ? ' valasztott' : '') + '" data-tip="' + t.id + '" aria-label="' + t.nev + '">' +
      '<span class="kfc-ikon">' + kertTargyIkon(t.id) + '</span><span class="kfc-db">' + db + '</span></button>';
  });
  sor.innerHTML = van ? chips
    : '<span class="kert-feszer-ures">A fészer üres — a boltban vegyél kerti tárgyat 💧-ért!</span>';
  sor.hidden = false;
  sor.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".kert-feszer-chip"); if (!b) return;
    hangGomb();
    var tip = b.getAttribute("data-tip");
    KERT_RAK_TIP = (KERT_RAK_TIP === tip) ? null : tip;
    var sugo = $("kert-sugo");
    if (sugo) sugo.textContent = KERT_RAK_TIP ? "Koppints a fűre, hová tegyem! 🧺" : "Válassz egy tárgyat lentről! 🧺";
    kertFeszerRender();
  };
}
/* a lerakott tárgyak kirajzolása — mélység szerint (lentebb = előrébb, nagyobb z-index) */
function kertElemekRender() {
  var reteg = $("kert-elemek"); if (!reteg) return;
  var el = P().kert.elemek || [], html = "", lepkeDb = 0;
  for (var i = 0; i < el.length; i++) {
    var o = el[i], def = kertTargyDef(o.tip); if (!def) continue;
    var z = Math.round(o.y * 10);
    var etel = (def.csoport === "etel");
    var agy = (o.tip === "agy");
    var noveny = (def.csoport === "noveny");
    var vb = agy ? "-54 -62 108 70" : "-50 -90 100 96";
    var hitRect = noveny ? '<rect x="-50" y="-90" width="100" height="96" fill="none" pointer-events="all"/>' : '';
    html += '<div class="kt-elem' + (etel ? ' kt-etel-elem' : '') + (agy ? ' kt-agy-elem' : '') + (noveny ? ' kt-noveny-elem' : '') + '" data-i="' + i + '" style="left:' + o.x + '%;top:' + o.y + '%;z-index:' + z + '">' +
      '<svg class="kt-el-svg" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + hitRect + kertTargyBelso(o.tip) + '</svg>';
    if (noveny && o.tip !== "gombak" && lepkeDb < 3) {
      html += '<svg class="kt-lepke" style="animation-delay:' + (lepkeDb * 2.6).toFixed(1) + 's" viewBox="0 0 28 18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M14 9 Q6 2 2 6 Q6 14 14 10 Z" fill="#ff9ec4"/>' +
        '<path d="M14 9 Q22 2 26 6 Q22 14 14 10 Z" fill="#b6a7f2"/>' +
        '<circle cx="14" cy="9" r="1.8" fill="#4a3f6b"/></svg>';
      lepkeDb++;
    }
    html += '</div>';
  }
  reteg.innerHTML = html;
}
/* egy tárgy lerakása a fészerből a (x%,y%) helyre */
function kertElemRak(tip, x, y) {
  if ((P().kert.keszlet[tip] || 0) <= 0) return;
  x = Math.max(4, Math.min(96, x));
  y = Math.max(48, Math.min(95, y));   /* csak a füves sávba, ne az égre */
  P().kert.keszlet[tip]--;
  P().kert.elemek.push({ tip: tip, x: Math.round(x), y: Math.round(y) });
  hangCsilla(); ment();
  if ((P().kert.keszlet[tip] || 0) <= 0) KERT_RAK_TIP = null;   /* elfogyott → válassz másikat */
  kertElemekRender(); kertFeszerRender();
  var sugo = $("kert-sugo");
  if (sugo) sugo.textContent = (P().kert.keszlet[tip] > 0)
    ? "Szuper! Tehetsz le még egyet, vagy válassz mást. 🧺"
    : "Letéve! 🌿 Berendezésből kilépni: koppints a 🧺 gombra.";
}
/* A megvett trükkökhöz 1-1 gomb a kert alján (adatvezérelt: KERT_BOLT trükk-sorai).
   Rákoppintva az unikornis eljátssza. Ha még nincs trükk, a sor rejtve. */
function kertTrukksorRender() {
  var sor = $("kert-trukksor"); if (!sor) return;
  var tr = P().kert.trukkok || {}, chips = "";
  KERT_BOLT.forEach(function (t) {
    if (t.id === "kulcs" || !t.perc || !tr[t.id]) return;
    var ulAkt = (t.id === "ules" && KERT_UL);   /* ül épp → a gomb „Feláll"-ra vált */
    chips += '<button class="kert-trukk-chip' + (ulAkt ? ' aktiv' : '') + '" data-id="' + t.id + '" aria-label="' + t.nev + '">' +
      '<span class="ktr-emoji">' + t.emoji + '</span><span class="ktr-nev">' + (ulAkt ? "Feláll" : t.nev) + '</span></button>';
  });
  sor.innerHTML = chips;
  sor.hidden = !chips;
  sor.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".kert-trukk-chip"); if (!b) return;
    hangGomb(); kertTrukkGomb(b.getAttribute("data-id"));
  };
}
/* egy trükk-gomb megnyomása: az ülés TARTÓS állapot (leül/feláll toggle), a többi EGYSZERI
   trükk (lejátszik, majd feláll). Ha ül, minden más trükk előbb felállítja. */
function kertTrukkGomb(id) {
  if (KERT_FEKSZIK) kertAll();   /* fekvésből előbb feláll (egyszerre csak egy pihenő-póz) */
  if (id === "ules") { if (KERT_UL) kertAll(); else kertUl(); return; }
  if (KERT_UL) kertAll();
  kertTrukkJatszik(id);
}
/* 🛋️ Ülés = tartós állapot: az „ules-all" osztály tartja a pózt, amíg a gyerek fel nem állítja. */
var KERT_UL = false;
/* 😴 Befekvés = tartós pihenő-póz az ágyon („fekszik-all"); egyszerre csak egy pihenő-póz lehet. */
var KERT_FEKSZIK = false;
function kertUl() {
  if (KERT_TRUKK_FUT) return;
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  doboz.classList.remove("jar"); kertLepesHang(false); clearTimeout(doboz._jarTimer);
  doboz.classList.add("ules-all");
  KERT_UL = true;
  hangCsilla();
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "🛋️ Ül — koppints a gombra vagy a fűre, hogy felálljon.";
  kertTrukksorRender();
}
function kertAll() {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  doboz.classList.remove("ules-all");
  doboz.classList.remove("fekszik-all");
  doboz.style.zIndex = 870;        /* vissza az alap mélységre (fekvéskor az ágy fölé emeltük) */
  kertZzzTorol();                  /* alvó-Zzz eltakarítása */
  KERT_UL = false; KERT_FEKSZIK = false;
  hangGomb();
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "Koppints a fűre — az unikornis odasétál. 🚶";
  kertTrukksorRender();
}
/* egy EGYSZERI trükk lejátszása: a meglévő figurára tesz egy .trukk-<id> osztályt (a mozgást a CSS
   végzi, újrarajzolás nincs), majd a trükk hossza után leveszi. Egyszerre egy trükk fut. */
var KERT_TRUKK_FUT = false;
function kertTrukkAdat(id) { var r = null; KERT_BOLT.forEach(function (t) { if (t.id === id) r = t; }); return r; }
function kertTrukkJatszik(id) {
  var t = kertTrukkAdat(id); if (!t || !t.perc) return;
  var doboz = $("kert-uni-doboz"); if (!doboz || KERT_TRUKK_FUT) return;
  KERT_TRUKK_FUT = true;
  doboz.classList.remove("jar"); kertLepesHang(false); clearTimeout(doboz._jarTimer);
  /* 🌀 Pörgés: 4 nézetes sprite-swap forgás (nem CSS-animáció) */
  if (id === "porges") {
    hangCsilla();
    var sugo0 = $("kert-sugo"); if (sugo0) sugo0.textContent = t.emoji + " " + t.nev + "!";
    kertPorgesForgas(doboz, t.perc, function () {
      KERT_TRUKK_FUT = false;
      var s2 = $("kert-sugo"); if (s2) s2.textContent = "Koppints a fűre — az unikornis odasétál. 🚶";
    });
    return;
  }
  var cls = "trukk-" + id;
  doboz.classList.add(cls);
  hangCsilla();
  /* ✨ Csillámszórás effekt: szikrák + konfetti a szarv fölött */
  var csillamElemek = [];
  if (id === "csillam") {
    var kont = doboz.parentNode;
    var szinek = ["#ffd24d","#ff9ec4","#b39af0","#fff","#ffd24d"];
    var konfSzin = ["#ffd24d","#ff9ec4","#b39af0","#87cc66","#a7d8f2","#fff"];
    for (var si = 0; si < 5; si++) {
      var sz = document.createElement("span");
      sz.className = "csillam-szikra csillam-sz-" + si;
      sz.style.color = szinek[si];
      kont.appendChild(sz);
      csillamElemek.push(sz);
    }
    for (var ki = 0; ki < 6; ki++) {
      var ko = document.createElement("span");
      ko.className = "csillam-konf csillam-ko-" + ki;
      ko.style.background = konfSzin[ki];
      kont.appendChild(ko);
      csillamElemek.push(ko);
    }
  }
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = t.emoji + " " + t.nev + "!";
  clearTimeout(doboz._trukkTimer);
  doboz._trukkTimer = setTimeout(function () {
    doboz.classList.remove(cls);
    csillamElemek.forEach(function (e) { e.parentNode && e.parentNode.removeChild(e); });
    KERT_TRUKK_FUT = false;
    var s2 = $("kert-sugo"); if (s2) s2.textContent = "Koppints a fűre — az unikornis odasétál. 🚶";
  }, t.perc + 80);
}
/* 🌀 4 nézetes pörgés: sprite-swap motor + szikrák */
function kertPorgesForgas(doboz, idoMs, cb) {
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    var flip = doboz.querySelector(".kert-uni-flip");
    if (flip) flip.style.setProperty("--dir", "-1");
    setTimeout(function () { if (flip) flip.style.setProperty("--dir", "1"); if (cb) cb(); }, idoMs);
    return;
  }
  var c = P().karakter, rajz = (c && c.rajz) || "korall";
  var kinezet = P().kinezet || null;
  var gondor = !!(kinezet && kinezet.frizura === "gondor");
  var sz = forgatoSzinek(rajz, kinezet);
  var svg = doboz.querySelector(".kert-uni-svg");
  var flip = doboz.querySelector(".kert-uni-flip");
  if (!svg || !flip) { if (cb) cb(); return; }
  var eredeti = svg.innerHTML;
  var eredetiDir = flip.style.getPropertyValue("--dir") || "1";
  var wrapArt = function (art) {
    return '<g id="kert-uni" transform="scale(1)"><g transform="scale(0.5) translate(-190,-272)"><g class="uni-elo">' + art + '</g></g></g>';
  };
  var frontHtml = wrapArt(unikornisFrontArt(sz, gondor));
  var backHtml = wrapArt(unikornisBackArt(sz, gondor));
  var keretek = [
    { html: eredeti, dir: "1" },
    { html: frontHtml, dir: "1" },
    { html: eredeti, dir: "-1" },
    { html: backHtml, dir: "1" }
  ];
  var total = 8, keretMs = Math.floor(idoMs / total), i = 0;
  var bounce = [0, -4, 0, -6, 0, -4, 0, -6];
  var kont = doboz.parentNode, szikrak = [];
  var szikraEmoji = ["✨","⭐","💫","🌟"];
  function szikra() {
    var sp = document.createElement("span");
    sp.className = "forgato-szikra";
    sp.textContent = szikraEmoji[Math.floor(Math.random() * 4)];
    sp.style.left = (30 + Math.random() * 40) + "%";
    sp.style.top = (20 + Math.random() * 50) + "%";
    kont.appendChild(sp);
    szikrak.push(sp);
    setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 600);
  }
  function koviKeret() {
    if (i >= total) {
      svg.innerHTML = eredeti;
      flip.style.setProperty("--dir", eredetiDir);
      doboz.style.transform = "";
      szikrak.forEach(function (sp) { if (sp.parentNode) sp.parentNode.removeChild(sp); });
      if (cb) cb();
      return;
    }
    var k = keretek[i % 4];
    svg.innerHTML = k.html;
    flip.style.setProperty("--dir", k.dir);
    doboz.style.transform = "translateY(" + bounce[i] + "px)";
    szikra();
    i++;
    setTimeout(koviKeret, keretMs);
  }
  koviKeret();
}
function kertSetal(celX) {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  celX = Math.max(13, Math.min(87, celX));
  var tav = Math.abs(celX - KERT_UNI_X);
  if (tav < 1.2) return;
  doboz.style.setProperty("--dir", (celX < KERT_UNI_X) ? -1 : 1);
  var mp = Math.max(0.5, Math.min(3.2, tav * 0.045));   /* közel állandó sétatempó */
  doboz.style.transition = "left " + mp.toFixed(2) + "s linear, transform .45s ease";   /* a leülés/felállás simasága séta után is */
  doboz.classList.add("jar"); kertLepesHang(true);
  KERT_UNI_X = celX;
  doboz.style.left = celX + "%";
  clearTimeout(doboz._jarTimer);
  doboz._jarTimer = setTimeout(function () { doboz.classList.remove("jar"); kertLepesHang(false); }, mp * 1000 + 80);
}

/* ── Evés (3. lépés): a letett ételre koppintva az unikornis odasétál és megeszi.
   Ha még nincs meg az Evés képesség, kedves súgó irányít a boltba. Az étel NEM fogy el. */
function kertEtelKoppint(i) {
  if (KERT_TRUKK_FUT) return;                       /* épp eszik/trükközik → nem indítunk újat */
  var o = P().kert.elemek[i]; if (!o) return;
  var def = kertTargyDef(o.tip); if (!def || def.csoport !== "etel") return;
  var sugo = $("kert-sugo");
  if (!(P().kert.trukkok && P().kert.trukkok.eves)) {   /* nincs meg az Evés → súgó */
    hangGomb();
    if (sugo) sugo.textContent = "😋 Vedd meg a boltban az Evés képességet, és az unikornis idesétál falatozni!";
    return;
  }
  if (KERT_UL || KERT_FEKSZIK) kertAll();
  kertSetalEszik(Math.max(13, Math.min(87, o.x)), o);
}
/* odasétál a falathoz (a séta-motor tempójával), majd megeszi */
function kertSetalEszik(celX, o) {
  var doboz = $("kert-uni-doboz"); if (!doboz) { return; }
  KERT_TRUKK_FUT = true;                             /* az evés végéig más interakció nem indul */
  var tav = Math.abs(celX - KERT_UNI_X);
  var mp = (tav < 1.2) ? 0 : Math.max(0.5, Math.min(3.2, tav * 0.045));
  if (mp > 0) {
    doboz.style.setProperty("--dir", (celX < KERT_UNI_X) ? -1 : 1);
    doboz.style.transition = "left " + mp.toFixed(2) + "s linear, transform .45s ease";
    doboz.classList.add("jar"); kertLepesHang(true);
    KERT_UNI_X = celX;
    doboz.style.left = celX + "%";
  }
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "🚶 Megyek a finom falatért…";
  clearTimeout(doboz._jarTimer);
  doboz._jarTimer = setTimeout(function () { doboz.classList.remove("jar"); kertLepesHang(false); kertEszik(o); }, mp * 1000 + 90);
}
/* az evés-animáció: fejlehajtás + csámcsogás (CSS .eszik) + kis szikra az étel fölött. Az étel marad. */
function kertEszik(o) {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  doboz.classList.add("eszik");
  hangCsilla(); kertNyihog();                    /* halk nyihogás a falatnak (terv: 3. döntés) */
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "😋 Nyami-nyami… csámcsog!";
  var host = $("kert-szinter");
  if (host && o) {
    var sz = document.createElement("div");
    sz.className = "kert-eszikszikra";
    sz.style.left = o.x + "%";
    sz.style.top = (o.y - 7) + "%";
    sz.innerHTML = '<span>✨</span><span>💛</span><span>✨</span>';
    host.appendChild(sz);
    setTimeout(function () { if (sz.parentNode) sz.parentNode.removeChild(sz); }, 1450);
  }
  clearTimeout(doboz._eszikTimer);
  doboz._eszikTimer = setTimeout(function () {
    doboz.classList.remove("eszik");
    KERT_TRUKK_FUT = false;
    var s2 = $("kert-sugo"); if (s2) s2.textContent = "Finom volt! 🌿 Koppints a fűre, vagy másik falatra.";
  }, 1650);
}

/* ── Megszagolom (5. lépés): séta-módban a letett növényre koppintva az unikornis odasétál
   és megszagolja (fejét lehajtja, kis szikra száll fel). Nem kell képesség, díszítő interakció. */
function kertNovenyKoppint(i) {
  if (KERT_TRUKK_FUT) return;
  var o = P().kert.elemek[i]; if (!o) return;
  var def = kertTargyDef(o.tip); if (!def || def.csoport !== "noveny") return;
  if (KERT_UL || KERT_FEKSZIK) kertAll();
  kertSetalSzagol(Math.max(13, Math.min(87, o.x)), o);
}
function kertSetalSzagol(celX, o) {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  KERT_TRUKK_FUT = true;
  var tav = Math.abs(celX - KERT_UNI_X);
  var mp = (tav < 1.2) ? 0 : Math.max(0.5, Math.min(3.2, tav * 0.045));
  if (mp > 0) {
    doboz.style.setProperty("--dir", (celX < KERT_UNI_X) ? -1 : 1);
    doboz.style.transition = "left " + mp.toFixed(2) + "s linear, transform .45s ease";
    doboz.classList.add("jar"); kertLepesHang(true);
    KERT_UNI_X = celX;
    doboz.style.left = celX + "%";
  }
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "🚶 Megyek megszagolni…";
  clearTimeout(doboz._jarTimer);
  doboz._jarTimer = setTimeout(function () { doboz.classList.remove("jar"); kertLepesHang(false); kertSzagol(o); }, mp * 1000 + 90);
}
function kertSzagol(o) {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  doboz.classList.add("szagol");
  hangCsilla();
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "🌸 Milyen finom illat!";
  var host = $("kert-szinter");
  if (host && o) {
    var sz = document.createElement("div");
    sz.className = "kert-szagolszikra";
    sz.style.left = o.x + "%";
    sz.style.top = (o.y - 7) + "%";
    sz.innerHTML = '<span>🌸</span><span>✨</span>';
    host.appendChild(sz);
    setTimeout(function () { if (sz.parentNode) sz.parentNode.removeChild(sz); }, 1300);
  }
  clearTimeout(doboz._szagolTimer);
  doboz._szagolTimer = setTimeout(function () {
    doboz.classList.remove("szagol");
    KERT_TRUKK_FUT = false;
    var s2 = $("kert-sugo"); if (s2) s2.textContent = "Micsoda illat! 🌿 Koppints a fűre, vagy szagolgass tovább.";
  }, 1300);
}

/* ── Befekvés (4. lépés): a letett ÁGY-ra koppintva az unikornis odasétál és belefekszik.
   Ha még nincs meg a Befekvés képesség, kedves súgó irányít a boltba. Az ágy tárgy — a helyén marad.
   A fekvés TARTÓS pihenő-póz (mint az ülés): koppintásra (ágyra vagy fűre) feláll. */
function kertAgyKoppint(i) {
  var o = P().kert.elemek[i]; if (!o || o.tip !== "agy") return;
  if (KERT_FEKSZIK) { kertAll(); return; }           /* már fekszik → az ágyra koppintva feláll */
  if (KERT_TRUKK_FUT) return;                          /* épp sétál/eszik → nem indítunk újat */
  var sugo = $("kert-sugo");
  if (!(P().kert.trukkok && P().kert.trukkok.befekves)) {   /* nincs meg a Befekvés → súgó */
    hangGomb();
    if (sugo) sugo.textContent = "😴 Vedd meg a boltban a Befekvés képességet, és az unikornis lepihen ide!";
    return;
  }
  if (KERT_UL) kertAll();
  kertSetalFekszik(Math.max(13, Math.min(87, o.x)));
}
/* odasétál az ágyhoz (a séta-motor tempójával), majd belefekszik */
function kertSetalFekszik(celX) {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  KERT_TRUKK_FUT = true;                               /* az odaérésig más interakció nem indul */
  var tav = Math.abs(celX - KERT_UNI_X);
  var mp = (tav < 1.2) ? 0 : Math.max(0.5, Math.min(3.2, tav * 0.045));
  if (mp > 0) {
    doboz.style.setProperty("--dir", (celX < KERT_UNI_X) ? -1 : 1);
    doboz.style.transition = "left " + mp.toFixed(2) + "s linear, transform .45s ease";
    doboz.classList.add("jar"); kertLepesHang(true);
    KERT_UNI_X = celX;
    doboz.style.left = celX + "%";
  }
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "🚶 Megyek lepihenni…";
  clearTimeout(doboz._jarTimer);
  doboz._jarTimer = setTimeout(function () { doboz.classList.remove("jar"); kertLepesHang(false); kertFekszik(); }, mp * 1000 + 90);
}
/* a befekvés: a test rásüllyed, a lábak behajlanak (CSS .fekszik-all), lágy Zzz száll fel;
   az elégedett pislogás/lélegzés a meglévő élő-animációkból jön. Tartós póz — koppintásra feláll. */
function kertFekszik() {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  KERT_TRUKK_FUT = false;                              /* a fekvés tartós állapot, nem „fut" (lehet rá koppintani) */
  doboz.classList.remove("jar"); kertLepesHang(false); clearTimeout(doboz._jarTimer);
  doboz.style.zIndex = 940;                            /* az ágy fölé, mintha rajta feküdne */
  doboz.classList.add("fekszik-all");
  KERT_FEKSZIK = true;
  kertZzzTesz(doboz);
  hangCsilla();
  var sugo = $("kert-sugo"); if (sugo) sugo.textContent = "😴 Pihen az ágyon — koppints, hogy felkeljen.";
}
/* lágy „z z z" az unikornis fölé (a dobozban, így követi a helyét); felállásnál eltakarítjuk */
function kertZzzTesz(doboz) {
  kertZzzTorol();
  var z = document.createElement("div");
  z.className = "kert-zzz"; z.setAttribute("aria-hidden", "true");
  z.innerHTML = '<span>z</span><span>z</span><span>z</span>';
  doboz.appendChild(z);
}
function kertZzzTorol() {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  var z = doboz.querySelector(".kert-zzz"); if (z && z.parentNode) z.parentNode.removeChild(z);
}

/* napfényes rét — festett, rétegelt SVG + ambient (a fű/porszem/lepke a CSS-ben mozog).
   Könnyen bővíthető: új elemet a megfelelő réteghez adva. viewBox 1000×620, slice-olva tölti a teret. */
function kertHatterSVG() {
  var s = '<svg class="kert-hatter" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs>' +
    '<linearGradient id="k-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3fb"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient>' +
    '<radialGradient id="k-nap" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff7d2"/><stop offset="55%" stop-color="#ffe987"/><stop offset="100%" stop-color="#ffe987" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="k-tavdomb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6f0c2"/><stop offset="1" stop-color="#bfe6a8"/></linearGradient>' +
    '<linearGradient id="k-koztes" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9dd8c"/><stop offset="1" stop-color="#8ecf6e"/></linearGradient>' +
    '<linearGradient id="k-fu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#87cc66"/><stop offset="1" stop-color="#5fae49"/></linearGradient>' +
    '</defs>';
  /* 1) ég + nap + felhők */
  s += '<rect x="0" y="0" width="1000" height="620" fill="url(#k-eg)"/>';
  s += '<circle cx="820" cy="92" r="74" fill="url(#k-nap)"/><circle cx="820" cy="92" r="24" fill="#fff3b0"/>';
  s += '<g fill="#ffffff" opacity="0.85"><ellipse cx="215" cy="92" rx="60" ry="24"/><ellipse cx="262" cy="80" rx="46" ry="21"/>' +
    '<ellipse cx="560" cy="66" rx="50" ry="20"/><ellipse cx="600" cy="74" rx="38" ry="17"/></g>';
  /* 2) távoli dombok (parallax hátsó) */
  s += '<path d="M0 300 Q230 250 480 292 T1000 276 V620 H0 Z" fill="url(#k-tavdomb)"/>';
  /* 3) középső rét (ide jön később fa/kerítés/tavacska) */
  s += '<path d="M0 356 Q300 300 620 350 T1000 344 V620 H0 Z" fill="url(#k-koztes)"/>';
  /* 4) előtér-fű */
  s += '<path d="M0 400 Q500 360 1000 404 V620 H0 Z" fill="url(#k-fu)"/>';
  /* 5) virágok az előtérben */
  s += kertVirag(150, 470, "#ff9ec4") + kertVirag(760, 500, "#b6a7f2") + kertVirag(430, 540, "#ffd24d") + kertVirag(880, 452, "#ff9ec4");
  /* 6) ambient: lengő fűszálak + szálló porszemek + lepke (a CSS mozgatja) */
  s += '<g stroke-linecap="round" fill="none">';
  var blades = [[70,600,-30],[130,604,26],[540,606,-24],[700,600,-34],[900,604,-22],[300,604,24],[420,600,-28]];
  for (var i = 0; i < blades.length; i++) { var bl = blades[i];
    s += '<path class="kb-blade" style="animation-delay:' + (i * 0.4).toFixed(1) + 's" d="M' + bl[0] + ' ' + bl[1] + ' q' + (bl[2]/6).toFixed(0) + ' -34 ' + (bl[2]/9).toFixed(0) + ' -52" stroke="' + (i % 2 ? "#5aa843" : "#4f9c3a") + '" stroke-width="6"/>';
  }
  s += '</g>';
  s += '<g fill="#fff6c8"><circle class="kb-mote" cx="760" cy="230" r="4"/><circle class="kb-mote" style="animation-delay:2.4s" cx="700" cy="280" r="3"/><circle class="kb-mote" style="animation-delay:4s" cx="820" cy="190" r="3.4"/></g>';
  s += '<g class="kb-fly" transform="translate(540 190)"><path d="M0 0 q-14 -12 -22 0 q8 12 22 5 Z" fill="#ff9ec4"/><path d="M0 0 q14 -12 22 0 q-8 12 -22 5 Z" fill="#b6a7f2"/><circle r="2.6" fill="#4a3f6b"/></g>';
  s += '</svg>';
  return s;
}
function kertVirag(x, y, szin) {
  return '<g transform="translate(' + x + ' ' + y + ')"><circle r="7" fill="#ffd24d"/>' +
    '<circle cx="-11" r="5" fill="' + szin + '"/><circle cx="11" r="5" fill="' + szin + '"/><circle cy="-11" r="5" fill="' + szin + '"/><circle cy="11" r="5" fill="' + szin + '"/></g>';
}
function oduPanelNyit(fulKezd) { ODU_FUL = fulKezd || "ido"; BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null; $("odu-panel").hidden = false; renderOduPanel(); }
function oduPanelZar() { $("odu-panel").hidden = true; var l = $("odu-lap"); if (l) l.hidden = true; }
/* a bolt körüli sötét sávra koppintva is bezárul (a boltra koppintva nem) */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var pan = document.getElementById("odu-panel");
    if (pan) pan.addEventListener("click", function (e) { if (e.target === pan) { hangGomb(); oduPanelZar(); } });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   A BOLT — „Kincseskamra + dumáló bagoly"
   A grafikai session végleges terve (mockup-bolt-vegleges.html, 2026-09-08).

   Diagnózis volt: a rajzolt Csillagbolt a UI MÖGÖTT ült, és átlátszatlan kártyák
   takarták — ezért nem segített a háttér halványítása, a KÁRTYÁKAT kellett
   megszüntetni. Itt az egész bolt EGYETLEN 880×520 SVG:
     · a tárgyak fizikailag a fapolcon állnak, saját talaj-árnyékkal
     · lógó árcédulák a polc éléről (a kiválasztotté arany) — szöveg nélkül is „bolt"
     · a kiválasztott tárgy megemelkedik és felragyog (nem keret, nem pipa)
     · az adatlap falra tűzött papírcédula, nem UI-panel
     · előtér-pult alul → mélység
     · bagoly-boltos a bal alsó sarokban: FIXEN ül, csak a szárnya és a pupillái
       fordulnak (producer-döntés: a boltos szereplő, nem kurzor)
   ═══════════════════════════════════════════════════════════════════════════ */

var BOLT_W = 880, BOLT_H = 520;
var BOLT_POLC_FELSO = 250, BOLT_POLC_ALSO = 430;
var BOLT_LAP = {};             /* fülönként: hányadik oldalon (csoporton) állunk */
var BOLT_BAGOLY_EXTRA = null;  /* átmeneti bagoly-mondat (pl. vásárlás után) */

/* ── oldalak: egy csoport = egy oldal; a 7-nél nagyobb csoport több oldalra bomlik ── */
function boltOldalak() {
  var lapok = [], most = [];
  boltCsoportok().forEach(function (cs) {
    cs.tetelek.forEach(function (t) {
      most.push({ cs: cs, t: t });
      if (most.length === 7) { lapok.push(most); most = []; }
    });
  });
  if (most.length) lapok.push(most);
  return lapok.map(function (tetelek) {
    var nevek = [];
    tetelek.forEach(function (e) { if (nevek.indexOf(e.cs.nev) < 0) nevek.push(e.cs.nev); });
    return { nev: nevek.join(" · "), tetelek: tetelek };
  });
}
/* az aktuális oldal indexe — mindig a kiválasztott tételt tartalmazó oldal */
function boltAktOldal() {
  var old = boltOldalak(), sel = BOLT_VAL[ODU_FUL], i, j;
  if (sel) for (i = 0; i < old.length; i++)
    for (j = 0; j < old[i].tetelek.length; j++) {
      var e = old[i].tetelek[j];
      if (e.cs.kulcs === sel.g && String(e.t.id) === String(sel.id)) return i;
    }
  var l = BOLT_LAP[ODU_FUL] || 0;
  return Math.max(0, Math.min(l, old.length - 1));
}
/* 7 polchely: felül max 4, alul max 3 (a bal alsó sarok a bagolyé) */
function boltHelyek(n) {
  var f = (n <= 4) ? n : (n <= 6 ? Math.ceil(n / 2) : 4), a = n - f, ki = [], i;
  for (i = 0; i < f; i++) ki.push({ x: 305 - (f - 1) * 50 + i * 100, y: BOLT_POLC_FELSO, felso: true });
  for (i = 0; i < a; i++) ki.push({ x: 385 - (a - 1) * 52.5 + i * 105, y: BOLT_POLC_ALSO, felso: false });
  return ki;
}

/* ── a bagoly-boltos: 3 póz, csak a szárny-path és a pupillák térnek el ── */
var BOLT_BAGOLY_POZ = {
  nyugalmi: { szarny: "M28 -40 Q40 -30 35 -16 Q26 -24 26 -38 Z", bal: [-11, -43], jobb: [11, -43] },
  fel:      { szarny: "M28 -44 Q52 -54 66 -66 Q56 -44 34 -34 Z", bal: [-10, -47], jobb: [12, -47] },
  oldal:    { szarny: "M28 -34 Q54 -34 70 -30 Q54 -22 32 -24 Z", bal: [-7, -43],  jobb: [15, -43] }
};
function boltBagolySVG(poz) {
  var p = BOLT_BAGOLY_POZ[poz] || BOLT_BAGOLY_POZ.nyugalmi;
  function szem(c) {   /* a fénypötty mindig 2 px-szel balra és 3 px-szel fölé */
    return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="#4a3b2a"/>' +
           '<circle cx="' + (c[0] - 2) + '" cy="' + (c[1] - 3) + '" r="1.8" fill="#fff"/>';
  }
  return '<g class="bolt-bagoly" transform="translate(140,430)">' +
    '<ellipse cx="0" cy="3" rx="32" ry="5" fill="#3b2f66" opacity="0.18"/>' +
    '<g stroke="#e8a23d" stroke-width="3.4" stroke-linecap="round" fill="none">' +
      '<path d="M-11 -8 v10"/><path d="M11 -8 v10"/><path d="M-15 2 h9 M-11 2 v3"/><path d="M7 2 h9 M11 2 v3"/></g>' +
    '<ellipse cx="0" cy="-36" rx="31" ry="35" fill="#c9a06a" stroke="#222" stroke-width="2.2"/>' +
    '<ellipse cx="0" cy="-28" rx="21" ry="25" fill="#e9d3ad"/>' +
    '<path d="M-28 -62 l10 18 l11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
    '<path d="M28 -62 l-10 18 l-11 -11 Z" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
    '<circle cx="-11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
    '<circle cx="11" cy="-44" r="11.5" fill="#fff" stroke="#222" stroke-width="2"/>' +
    '<g class="bolt-bagoly-szem">' + szem(p.bal) + szem(p.jobb) + '</g>' +
    '<path d="M0 -34 l-5 7 l10 0 Z" fill="#e8a23d" stroke="#222" stroke-width="1.6"/>' +
    '<path d="M-19 -16 Q0 -21 19 -16 Q21 -4 18 4 Q0 9 -18 4 Q-21 -4 -19 -16 Z" fill="#f7b8d0" stroke="#e79ac0" stroke-width="1.8"/>' +
    '<path d="M-8 -10 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#fff2c4"/>' +
    '<path class="bolt-bagoly-szarny" d="' + p.szarny + '" fill="#c9a06a" stroke="#222" stroke-width="2"/>' +
  '</g>';
}
/* mit mond a boltos — ez nem dísz: egy 6-7 éves nem tud fejben kivonni,
   a bagoly mondja meg, futja-e (és a buborékra koppintva fel is olvassa) */
function boltBagolySzoveg(k) {
  if (BOLT_BAGOLY_EXTRA) return BOLT_BAGOLY_EXTRA;
  if (!k) return "Nézz csak körül nyugodtan!";
  var cs = k.cs, t = k.t, p = P().csillampor;
  var kint = (cs.fajta === "ruha" || cs.fajta === "kinezet");
  if (cs.fajta === "kertdisz") {
    var pk = P().tunderharmat || 0, meglevo = (P().kert.keszlet[t.id] || 0) + kertElemDb(t.id);
    if (pk < t.ar) return "Még " + (t.ar - pk) + " 💧 kell hozzá — gyűjts egy kicsit!";
    return (meglevo ? "Már van " + meglevo + " belőle. " : "") + "Vedd meg, aztán a kertben rakd le!";
  }
  if (boltAktiv(cs, t)) return kint ? "Ez van most rajtad — jól áll!" : "Ez van most kint — jól néz ki!";
  if (cs.fajta === "vitrin" && boltBirt(cs, t)) return "Ez már a vitrinedben ragyog!";
  if (cs.fajta === "kert" && t.id === "eves" && boltBirt(cs, t)) return "Ez megvan! A kertben koppints egy letett ételre — odasétál és eszik. 😋";
  if (cs.fajta === "kert" && boltBirt(cs, t)) return "A kert kapuja nyitva áll — menj, sétáltasd meg!";
  if (boltBirt(cs, t)) return "Ez már a tiéd! " + (kint ? "Fel is veheted." : "Ki is teheted.");
  var val = boltValuta(cs, t), penz = boltPenz(cs, t);
  if (penz >= t.ar) return "Van rá elég! Marad " + (penz - t.ar) + " " + val;
  return "Még " + (t.ar - penz) + " " + val + " kell hozzá — gyűjts egy kicsit!";
}

/* ── a nagy gomb állapota (a régi boltGombRajzol döntési fája, SVG-hez) ── */
function boltGombAllapot(cs, t, birt, aktiv, eleg) {
  if (birt) {
    if (cs.fajta === "ruha") return aktiv
      ? { szoveg: "Leveszem", szin: "le", mit: function () { oduRuhaVisel(cs.kulcs, null); } }
      : { szoveg: "Felveszem", szin: "fel", mit: function () { oduRuhaVisel(cs.kulcs, t.id); } };
    if (cs.fajta === "vitrin") return { szoveg: "✓ a vitrinben", szin: "kesz", mit: null };
    if (cs.fajta === "kert") return { szoveg: "✓ megvan", szin: "kesz", mit: null };
    if (aktiv) return { szoveg: (cs.fajta === "kinezet") ? "✓ ez van rajta" : "✓ ez van kint", szin: "kesz", mit: null };
    if (cs.fajta === "butor") return { szoveg: "Berendezem", szin: "fel", mit: function () { oduButorBeallit(cs.kulcs, t.id); } };
    if (cs.fajta === "disz") return (t.id === "nincs")
      ? { szoveg: "Leszedem", szin: "le", mit: function () { oduDiszBeallit(cs.kulcs, "nincs"); } }
      : { szoveg: "Kirakom", szin: "fel", mit: function () { oduDiszBeallit(cs.kulcs, t.id); } };
    if (cs.fajta === "kinezet") return { szoveg: "Beállítom", szin: "fel", mit: function () { oduKinezetBeallit(cs.kulcs, t.id); } };
    return { szoveg: "Beállítom", szin: "fel", mit: function () { oduBeallit(cs.kulcs, t.id); } };
  }
  if (!eleg) return { szoveg: "még " + (t.ar - boltPenz(cs, t)) + " " + boltValuta(cs, t) + " kell", szin: "keves", mit: null };
  return { szoveg: "Megveszem " + boltValuta(cs, t) + t.ar, szin: "vesz", mit: function () {
    if (t.ar >= 60) { BOLT_MEGEROSIT = true; renderOduPanel(); } else boltVegrehajt(cs, t);
  } };
}
var BOLT_LAPSZAM = "";        /* „2 / 3" — a pult sarkára kerül, nem az árcédulákra */
var BOLT_MEGEROSIT = false;   /* a drága tételnél a „Biztos?" lépés fut-e épp */

/* ── a tárgy a polcon ── */
function boltPolcTargy(cs, t, hely, kival, idx) {
  var x = hely.x, y = hely.y, emel = kival ? 14 : 0, ty = y - emel, s = "";
  if (kival) s += '<ellipse cx="' + x + '" cy="' + (ty - 46) + '" rx="54" ry="50" fill="#ffe9ad" opacity="0.5"/>';
  s += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="' + (kival ? 22 : 20) + '" ry="4" fill="#3b2f66" opacity="' + (kival ? 0.13 : 0.16) + '"/>';
  var belso = boltThumbBelso(cs, t);
  if (cs.fajta === "butor" || cs.fajta === "ido") {
    /* a szoba- és ég-minta nem tárgy: keretezett bolti minta, ami a polcon áll */
    var cid = "boltkeret-" + ODU_FUL + "-" + idx;
    s += '<g transform="translate(' + x + ',' + ty + ')">' +
      '<defs><clipPath id="' + cid + '"><rect x="-38" y="-78" width="76" height="72" rx="5"/></clipPath></defs>' +
      '<rect x="-42" y="-84" width="84" height="84" rx="7" fill="#f7ecd8" stroke="#c9a06a" stroke-width="2.6"/>' +
      '<g clip-path="url(#' + cid + ')"><g transform="translate(0,-42)"><g data-fit="76,72" data-fit-mod="kozep">' + belso + '</g></g></g>' +
      '</g>';
  } else {
    s += '<g transform="translate(' + x + ',' + ty + ')"><g data-fit="78,80">' + belso + '</g></g>';
  }
  if (kival) {
    s += '<path d="M' + (x - 34) + ' ' + (ty - 74) + ' l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6 Z" fill="#ffe08a"/>';
    s += '<path d="M' + (x + 38) + ' ' + (ty - 42) + ' l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/>';
  }
  /* lógó árcédula a polc éléről */
  var ar = (t.ar === 0) ? "alap" : (t.ar + " " + boltValuta(cs, t)), w = kival ? 46 : 42;
  s += '<g class="bolt-cedula">' +
    '<path d="M' + x + ' ' + (y + 19) + ' v9" stroke="' + (kival ? "#ffb300" : "#c9a06a") + '" stroke-width="' + (kival ? 1.8 : 1.4) + '"/>' +
    '<rect x="' + (x - w / 2) + '" y="' + (y + 28) + '" width="' + w + '" height="20" rx="6" fill="' + (kival ? "#fff3cf" : "#fdf4d8") + '" stroke="' + (kival ? "#ffb300" : "#e6d3a8") + '" stroke-width="' + (kival ? 2 : 1.3) + '"/>' +
    '<text x="' + x + '" y="' + (y + 42) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7a5a2a">' + ar + '</text></g>';
  return s;
}
/* a meglévő boltThumb <svg> burkolat nélkül — a méretezést a getBBox-os igazítás végzi */
function boltThumbBelso(cs, t) {
  if (cs.fajta === "ido") {   /* négyzetes ég-minta, hogy kitöltse a keretet */
    var o = P().odu;
    return (cs.kulcs === "napszak" ? oduEgSVG(t.id, 96, 88) : oduEgSVG(o.napszak, 96, 88) + oduIdoSVG(t.id, 96, 88, 8));
  }
  var h = boltThumb(cs, t);
  return h.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/* ── a teljes bolt-színtér ── */
function boltSzinterSVG() {
  var oldalak = boltOldalak(), oi = boltAktOldal(), o = oldalak[oi];
  var k = boltKivalasztott();
  var s = '<svg class="bolt-szinter-svg" viewBox="0 0 880 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';
  /* háttér: bolt-belső, boltív */
  s += '<rect width="880" height="520" fill="#2e2350"/>';
  s += '<path d="M20 520 L20 150 Q20 40 440 24 Q860 40 860 150 L860 520 Z" fill="#b79fd4"/>';
  s += '<path d="M52 520 L52 165 Q52 66 440 52 Q828 66 828 165 L828 520 Z" fill="#cbb6e6"/>';
  s += '<g stroke="#ab90cf" stroke-width="2.5" opacity="0.4" fill="none">' +
    '<path d="M170 150 Q178 300 170 500"/><path d="M330 130 Q338 300 332 500"/>' +
    '<path d="M620 130 Q613 300 620 500"/><path d="M770 150 Q763 300 770 500"/></g>';
  s += '<ellipse cx="300" cy="300" rx="270" ry="230" fill="#ffd9ec" opacity="0.06"/>';
  /* cégér + zászlófüzér */
  s += '<path d="M170 84 Q440 112 710 84" stroke="#8f7ab8" stroke-width="2" fill="none"/>';
  s += '<g><path d="M232 96 l14 0 l-7 12 Z" fill="#f6a5c0"/><path d="M286 101 l14 0 l-7 12 Z" fill="#a7d99a"/>' +
    '<path d="M340 104 l14 0 l-7 12 Z" fill="#fce49a"/><path d="M526 104 l14 0 l-7 12 Z" fill="#c3a5e0"/>' +
    '<path d="M580 101 l14 0 l-7 12 Z" fill="#9ec9f0"/><path d="M634 96 l14 0 l-7 12 Z" fill="#f6a5c0"/></g>';
  s += '<rect x="376" y="46" width="128" height="38" rx="10" fill="#a88fce" stroke="#8f7ab8" stroke-width="1.6"/>';
  s += '<path d="M396 66 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fdf0d0"/>';
  s += '<path d="M484 66 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fdf0d0"/>';
  s += '<text x="440" y="71" font-size="17" font-weight="700" fill="#fdf0d0" text-anchor="middle">Csillagbolt</text>';
  /* fülek: lógó fatáblák */
  BOLT_FULEK.forEach(function (f, i) {
    var akt = (f.id === ODU_FUL), fx = 62 + i * 80;
    s += '<g class="bolt-ful-jel"' + (akt ? "" : ' opacity="0.62"') + '>' +
      '<path d="M' + (fx + 35) + ' 118 v10" stroke="#8f6a3e" stroke-width="2"/>' +
      '<rect x="' + fx + '" y="128" width="70" height="26" rx="7" fill="' + (akt ? "#e0b47e" : "#d3c0ea") + '" stroke="' + (akt ? "#8f6a3e" : "#a88fce") + '" stroke-width="' + (akt ? 1.8 : 1.5) + '"/>' +
      '<text x="' + (fx + 35) + '" y="146" font-size="11.5" font-weight="700" fill="' + (akt ? "#4a3b2a" : "#6a5f88") + '" text-anchor="middle">' + f.nev + '</text></g>';
  });
  /* a polc neve (melyik csoportban vagyunk) */
  /* felső polc */
  s += '<rect x="70" y="250" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="263" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 269 l0 12 M508 269 l0 12" stroke="#c19a72" stroke-width="5"/>';
  /* a tárgyak — a felső polcra tartozók */
  var helyek = o ? boltHelyek(o.tetelek.length) : [], also = "";
  if (o) o.tetelek.forEach(function (e, i) {
    var kival = !!(k && k.cs.kulcs === e.cs.kulcs && String(k.t.id) === String(e.t.id));
    var darab = boltPolcTargy(e.cs, e.t, helyek[i], kival, i);
    if (helyek[i].felso) s += darab; else also += darab;
  });
  /* alsó polc */
  s += '<rect x="70" y="430" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="443" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 449 l0 12 M508 449 l0 12" stroke="#c19a72" stroke-width="5"/>';
  s += boltBagolySVG(!k ? "nyugalmi" : (boltKivalHelye(o, k, helyek) ? "fel" : "oldal"));
  s += also;
  /* beszéd-buborék (a szélességét a második menet igazítja a szöveghez) */
  s += '<g class="bolt-buborek" pointer-events="none">' +
    '<rect class="bolt-buborek-tabla" x="196" y="300" width="298" height="54" rx="16" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<path class="bolt-buborek-csor" d="M252 352 L226 370 L234 352 Z" fill="#fffdf6" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<text class="bolt-buborek-szo" x="345" y="331" font-size="15" font-weight="700" fill="#7a5a2a" text-anchor="middle">' + kiiras(boltBagolySzoveg(k)) + '</text>' +
    '<text class="bolt-buborek-hang" x="474" y="321" font-size="13" text-anchor="middle" opacity="0.5">🔊</text></g>';
  /* lapozó fa-nyilak */
  if (oldalak.length > 1) {
    s += '<g class="bolt-nyil-jel" fill="#e0b47e" stroke="#8f6a3e" stroke-width="1.6">' +
      '<path d="M56 336 l-14 13 l14 13 Z"/><path d="M554 336 l14 13 l-14 13 Z"/></g>';
    BOLT_LAPSZAM = (oi + 1) + " / " + oldalak.length;
  } else { BOLT_LAPSZAM = ""; }
  if (0) {
  }
  /* adatlap: falra tűzött cédula */
  s += boltCedulaSVG(k);
  /* előtér: a pult széle → mélység */
  s += '<path d="M0 488 Q440 472 880 488 L880 520 L0 520 Z" fill="#c197bf"/>';
  s += '<path d="M0 488 Q440 472 880 488 L880 498 Q440 482 0 498 Z" fill="#d9b8d6"/>';
  s += '<g><path d="M60 500 l3.2 7.6 l7.6 3.2 l-7.6 3.2 l-3.2 7.6 l-3.2 -7.6 l-7.6 -3.2 l7.6 -3.2 Z" fill="#ffd878"/>' +
    '<text x="84" y="513" font-size="15.5" font-weight="800" fill="#fdf0d0">' + P().csillampor + '</text>' +
    (BOLT_LAPSZAM ? '<text x="440" y="513" font-size="12.5" font-weight="700" fill="#fdf0d0" text-anchor="middle" opacity="0.8">' + BOLT_LAPSZAM + '</text>' : "") + '</g>';
  /* ── legfelső réteg: a láthatatlan találati zónák (a tárgyak szabálytalanok) ── */
  if (o) o.tetelek.forEach(function (e, i) {
    var h = helyek[i];
    s += '<rect class="bolt-fogo" x="' + (h.x - 48) + '" y="' + (h.y - 92) + '" width="96" height="140" fill="transparent"' +
      ' data-mit="valaszt" data-g="' + e.cs.kulcs + '" data-id="' + e.t.id + '"/>';
  });
  BOLT_FULEK.forEach(function (f, i) {
    s += '<rect class="bolt-fogo" x="' + (62 + i * 80) + '" y="118" width="70" height="40" fill="transparent" data-mit="ful" data-ful="' + f.id + '"/>';
  });
  if (oldalak.length > 1) {
    s += '<rect class="bolt-fogo" x="26" y="322" width="44" height="54" fill="transparent" data-mit="lap" data-ir="-1"/>';
    s += '<rect class="bolt-fogo" x="540" y="322" width="44" height="54" fill="transparent" data-mit="lap" data-ir="1"/>';
  }
  s += '<rect class="bolt-fogo" x="196" y="300" width="298" height="54" fill="transparent" data-mit="mondd"/>';
  if (k) s += boltCedulaFogok(k);
  s += '</svg>';
  return s;
}
/* a kiválasztott a FELSŐ polcon van-e (ettől függ a bagoly póza) */
function boltKivalHelye(o, k, helyek) {
  if (!o || !k) return false;
  for (var i = 0; i < o.tetelek.length; i++)
    if (o.tetelek[i].cs.kulcs === k.cs.kulcs && String(o.tetelek[i].t.id) === String(k.t.id))
      return !!(helyek[i] && helyek[i].felso);
  return false;
}

/* ── az adatlap: falra tűzött papírcédula ── */
function boltCedulaSVG(k) {
  var s = '<g class="bolt-cedula-lap">' +
    '<path d="M580 162 Q706 152 832 162 Q840 300 832 456 Q706 468 580 456 Q572 300 580 162 Z" fill="#fdf4e2" stroke="#e6d3a8" stroke-width="2.2"/>' +
    '<circle cx="706" cy="160" r="7.5" fill="#f6a5c0" stroke="#222" stroke-width="1.5"/>';
  if (!k) {
    s += '<text x="706" y="310" font-size="13.5" fill="#a08a6a" text-anchor="middle">Válassz valamit a polcról!</text></g>';
    return s;
  }
  var cs = k.cs, t = k.t, birt = boltBirt(cs, t), aktiv = boltAktiv(cs, t), eleg = boltPenz(cs, t) >= t.ar;
  var rang = (t.ar === 0 || cs.fajta === "kert" || cs.fajta === "kertdisz") ? 0 : (k.rang >= cs.tetelek.length - 1 ? 2 : 1);
  if (rang > 0) s += '<g><rect x="646" y="180" width="120" height="20" rx="10" fill="' + (rang === 2 ? "#ffd24d" : "#f0c869") + '"/>' +
    '<text x="706" y="194" font-size="11" font-weight="800" fill="#7a5a1e" text-anchor="middle">' + (rang === 2 ? "★ RITKA" : "✦ KÜLÖNLEGES") + '</text></g>';
  s += '<text x="706" y="' + (rang > 0 ? 222 : 210) + '" font-size="15.5" font-weight="800" fill="#7a5a2a" text-anchor="middle">' + kiiras(t.nev) + '</text>';
  s += '<text x="706" y="' + (rang > 0 ? 240 : 228) + '" font-size="11" font-weight="700" fill="#c2a887" text-anchor="middle">' + kiiras(cs.nev) + '</text>';
  s += '<text x="706" y="' + (rang > 0 ? 256 : 244) + '" font-size="11.5" fill="#a08a6a" text-anchor="middle">' + kiiras(BOLT_TIPP[t.id] || "") + '</text>';
  /* „így áll rajtad" előnézet a papíron */
  s += '<ellipse cx="706" cy="318" rx="94" ry="66" fill="#fff8e8"/>';
  s += '<defs><clipPath id="bolt-lap-vago"><ellipse cx="706" cy="318" rx="92" ry="64"/></clipPath></defs>';
  s += '<g clip-path="url(#bolt-lap-vago)"><g transform="translate(706,318)"><g data-fit="176,124" data-fit-mod="kozep">' +
    boltElonezetBelso(cs, t) + '</g></g></g>';
  var cimke = (cs.fajta === "ruha" || cs.fajta === "kinezet") ? "így áll rajtad"
            : (cs.fajta === "ido" ? "ilyen lesz az ég"
            : (cs.fajta === "kert" ? (t.id === "kulcs" ? "a kert kulcsa" : t.id === "eves" ? "új képesség" : "trükk a kertben")
            : (cs.fajta === "kertdisz" ? "így néz ki a kertben"
            : "így néz ki a szobád")));
  s += '<text x="706" y="398" font-size="11" fill="#a08a6a" text-anchor="middle">' + cimke + '</text>';
  /* ár */
  if (t.ar > 0 && harmatTetel(cs, t)) {   /* trükk / berendezési tárgy: 💧 tündérharmat-ár (kitartás-valuta) */
    s += '<text x="706" y="422" font-size="17" font-weight="800" fill="#2f7fa6" text-anchor="middle">💧 ' + t.ar + '</text>';
  } else if (t.ar > 0) {
    s += '<path d="M664 406 l2.8 6.8 l6.8 2.8 l-6.8 2.8 l-2.8 6.8 l-2.8 -6.8 l-6.8 -2.8 l6.8 -2.8 Z" fill="#ffd24d"/>' +
      '<text x="700" y="422" font-size="18" font-weight="800" fill="#7a5a2a">' + t.ar + '</text>';
  } else {
    s += '<text x="706" y="421" font-size="13" font-weight="700" fill="#a08a6a" text-anchor="middle">alap – ingyen</text>';
  }
  /* nagy gomb (vagy a „Biztos?" megerősítés drága tételnél) */
  var g = boltGombAllapot(cs, t, birt, aktiv, eleg);
  var szin = { vesz: ["#a7d99a", "#7bbd7a", "#2f5f2b"], fel: ["#9ec9f0", "#6fa8d8", "#1e3f5f"],
               le: ["#efe3f7", "#cdbce6", "#6a5a90"], kesz: ["#e9e2d2", "#d5c9b0", "#8a7a5a"],
               keves: ["#ecdfe2", "#d8c2c8", "#8a6a72"] }[g.szin] || ["#e9e2d2", "#d5c9b0", "#8a7a5a"];
  if (BOLT_MEGEROSIT && !birt) {
    s += '<rect x="610" y="410" width="192" height="32" rx="16" fill="#a7d99a" stroke="#7bbd7a" stroke-width="2"/>' +
      '<text x="706" y="431" font-size="13.5" font-weight="800" fill="#2f5f2b" text-anchor="middle">Biztos? Megveszem</text>' +
      '<rect x="610" y="448" width="192" height="26" rx="13" fill="#efe3f7" stroke="#cdbce6" stroke-width="1.8"/>' +
      '<text x="706" y="466" font-size="12.5" font-weight="700" fill="#6a5a90" text-anchor="middle">Mégse</text>';
  } else {
    s += '<rect x="610" y="428" width="192" height="36" rx="18" fill="' + szin[0] + '" stroke="' + szin[1] + '" stroke-width="2"' + (g.mit ? "" : ' opacity="0.75"') + '/>' +
      '<text x="706" y="452" font-size="14.5" font-weight="800" fill="' + szin[2] + '" text-anchor="middle">' + kiiras(g.szoveg) + '</text>';
  }
  return s + '</g>';
}
function boltCedulaFogok(k) {
  var cs = k.cs, t = k.t;
  if (BOLT_MEGEROSIT && !boltBirt(cs, t))
    return '<rect class="bolt-fogo" x="610" y="410" width="192" height="32" fill="transparent" data-mit="megerosit"/>' +
           '<rect class="bolt-fogo" x="610" y="448" width="192" height="26" fill="transparent" data-mit="megse"/>';
  return '<rect class="bolt-fogo" x="610" y="428" width="192" height="36" fill="transparent" data-mit="gomb"/>';
}
/* az adatlap előnézete: a régi boltAdatlapRajzol tartalma, <svg> burkolat nélkül */
function boltElonezetBelso(cs, t) {
  var h;
  if (cs.fajta === "ruha") { var pr = {}; pr[cs.kulcs] = t.id; h = unikornisSVG("bap", LENYEK[mentes.leny], 1, pr); }
  else if (cs.fajta === "butor") h = oduSVG(mentes.leny, butorPreviewOdu(cs.kulcs, t.id), true);
  else if (cs.fajta === "disz") h = oduSVG(mentes.leny, diszPreviewOdu(cs.kulcs, t.id), true);
  else if (cs.fajta === "vitrin") h = oduSVG(mentes.leny, vitrinPreviewOdu(t.id), true);
  else if (cs.fajta === "kinezet") h = unikornisSVG("bkp", LENYEK[mentes.leny], 1, P().oltozet, kinezetPreview(cs.kulcs, t.id));
  else if (cs.fajta === "kert") return t.svg;   /* a kert-tétel (kulcs) ikonja, mint előnézet */
  else if (cs.fajta === "kertdisz") return kertTargyBelso(t.id);   /* a berendezési tárgy rajza (talajpont-origó, a fit középre igazít) */
  else {
    var o2 = P().odu;
    h = (cs.kulcs === "napszak" ? oduEgSVG(t.id, 144, 96) : oduEgSVG(o2.napszak, 144, 96) + oduIdoSVG(t.id, 144, 96, 10));
  }
  return h.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/* ── második menet: mindent a helyére igazítunk (getBBox alapján) ── */
function boltIgazit(gyoker) {
  var volt = false;
  [].forEach.call(gyoker.querySelectorAll("[data-fit]"), function (g) {
    var b; try { b = g.getBBox(); } catch (e) { return; }
    if (!b || b.width <= 0 || b.height <= 0) return;
    volt = true;
    var m = g.getAttribute("data-fit").split(","), sz = +m[0], ma = +(m[1] || m[0]);
    var s = Math.min(sz / b.width, ma / b.height);
    var dx = -(b.x + b.width / 2) * s;
    var dy = (g.getAttribute("data-fit-mod") === "kozep") ? -(b.y + b.height / 2) * s : -(b.y + b.height) * s;
    g.setAttribute("transform", "translate(" + dx.toFixed(1) + "," + dy.toFixed(1) + ") scale(" + s.toFixed(4) + ")");
  });
  /* a buborék a szöveghez igazodik, legfeljebb 2 sorban */
  var szo = gyoker.querySelector(".bolt-buborek-szo"), tab = gyoker.querySelector(".bolt-buborek-tabla"),
      csor = gyoker.querySelector(".bolt-buborek-csor"), hang = gyoker.querySelector(".bolt-buborek-hang"),
      fogo = gyoker.querySelector('[data-mit="mondd"]');
  if (szo && tab) {
    var sz = 0; try { sz = szo.getComputedTextLength(); } catch (e) {}
    if (sz) {
      var w = Math.max(200, Math.min(320, sz + 62)), bal = 345 - w / 2;
      tab.setAttribute("x", bal.toFixed(1)); tab.setAttribute("width", w.toFixed(1));
      if (hang) hang.setAttribute("x", (bal + w - 20).toFixed(1));
      if (csor) csor.setAttribute("d", "M" + (bal + 56) + " 352 L" + (bal + 30) + " 370 L" + (bal + 38) + " 352 Z");
      if (fogo) { fogo.setAttribute("x", bal.toFixed(1)); fogo.setAttribute("width", w.toFixed(1)); }
    }
  }
  return volt;
}

/* ── a bolt kirajzolása + a koppintások bekötése ── */
var BOLT_FULEK = [
  { id: "holmik", nev: "Holmik" }, { id: "kinezet", nev: "Kinézet" },
  { id: "kellekek", nev: "Kellékek" }, { id: "ido", nev: "Időjárás" },
  { id: "kristaly", nev: "Kristály" }, { id: "kert", nev: "Kert" }
];
function renderOduPanel() {
  var host = $("odu-bolt-szinter");
  if (!host) return;
  host.innerHTML = boltSzinterSVG();
  var svg = host.querySelector("svg");
  if (!svg) return;
  if (!boltIgazit(svg)) requestAnimationFrame(function () { boltIgazit(svg); });   /* ha még nem volt látható */
  [].forEach.call(svg.querySelectorAll(".bolt-fogo"), function (r) {
    r.addEventListener("click", function () { boltKoppint(r); });
  });
}
function boltKoppint(r) {
  var mit = r.getAttribute("data-mit");
  if (mit === "valaszt") {
    BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    boltValaszt(r.getAttribute("data-g"), boltTetelId(r.getAttribute("data-g"), r.getAttribute("data-id")));
    return;
  }
  if (mit === "ful") {
    hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    ODU_FUL = r.getAttribute("data-ful"); renderOduPanel(); return;
  }
  if (mit === "lap") {
    hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null;
    var old = boltOldalak(), i = boltAktOldal() + (+r.getAttribute("data-ir"));
    i = (i + old.length) % old.length;
    BOLT_LAP[ODU_FUL] = i;
    var o = old[i];
    if (o && o.tetelek[0]) BOLT_VAL[ODU_FUL] = { g: o.tetelek[0].cs.kulcs, id: o.tetelek[0].t.id };
    renderOduPanel(); return;
  }
  if (mit === "mondd") { hangGomb(); mondd(boltBagolySzoveg(boltKivalasztott())); return; }
  if (mit === "megse") { hangGomb(); BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null; renderOduPanel(); return; }
  var k = boltKivalasztott(); if (!k) return;
  if (mit === "megerosit") { BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = "Jó választás! Csomagolom is."; boltVegrehajt(k.cs, k.t); return; }
  if (mit === "gomb") {
    var g = boltGombAllapot(k.cs, k.t, boltBirt(k.cs, k.t), boltAktiv(k.cs, k.t), boltPenz(k.cs, k.t) >= k.t.ar);
    if (!g.mit) { hangGomb(); BOLT_BAGOLY_EXTRA = null; renderOduPanel(); mondd(boltBagolySzoveg(k)); return; }
    /* a „Csomagolom is." csak a friss vétel után áll meg — minden más gomb visszaadja a szót a helyzetnek */
    BOLT_BAGOLY_EXTRA = (g.szin === "vesz" && k.t.ar < 60) ? "Jó választás! Csomagolom is." : null;
    g.mit();
  }
}
/* a data-id attribútumból a tétel eredeti típusú azonosítója (szám vagy szöveg) */
function boltTetelId(gk, id) {
  var csk = boltCsoportok(), i, j;
  for (i = 0; i < csk.length; i++) if (csk[i].kulcs === gk)
    for (j = 0; j < csk[i].tetelek.length; j++) if (String(csk[i].tetelek[j].id) === String(id)) return csk[i].tetelek[j].id;
  return id;
}


/* ── a bolt polcos böngészője (Holmik / Időjárás) ── */
/* egy fül tétel-csoportjai: [{ kulcs, nev, fajta, tetelek:[...] }] */
function boltCsoportok() {
  if (ODU_FUL === "holmik")
    return RUHA_HELY.map(function (h) { return { kulcs: h.kulcs, nev: h.nev, fajta: "ruha", tetelek: RUHAK[h.kulcs] || [] }; });
  if (ODU_FUL === "ido")
    return [
      { kulcs: "napszak", nev: "Napszak", fajta: "ido", tetelek: ODU_KAT.napszak },
      { kulcs: "ido", nev: "Időjárás", fajta: "ido", tetelek: ODU_KAT.ido }
    ];
  if (ODU_FUL === "kellekek")
    return BUTOR_HELY.map(function (h) { return { kulcs: h.kulcs, nev: h.nev, fajta: "butor", tetelek: ODU_BUTOR[h.kulcs] || [] }; })
      .concat(DISZ_ZONA.map(function (z) { return { kulcs: z.kulcs, nev: z.nev, fajta: "disz", tetelek: diszZonaTetelek(z.kulcs) }; }));
  if (ODU_FUL === "kristaly")
    return [{ kulcs: "vitrin", nev: "Kincsvitrin", fajta: "vitrin", tetelek: KRISTALY }];
  if (ODU_FUL === "kert") {
    /* a kulcs mindig látszik; a séta-trükkök csak ha a kert már nyitva (különben nincs hol lejátszani) */
    var kertTet = KERT_BOLT.filter(function (t) { return t.id === "kulcs" || P().kert.nyitva; });
    /* + a berendezési tárgyak (darabra, 💧-ért) — csak nyitott kertnél */
    return [{ kulcs: "kert", nev: "Kert", fajta: "kert", tetelek: kertTet }].concat(kertTargyBoltCsoportok());
  }
  if (ODU_FUL === "kinezet") {
    var rajz = LENYEK[mentes.leny].rajz;
    return [
      { kulcs: "soreny", nev: "Sörény színe", fajta: "kinezet", tetelek: (SORENY_SZIN[rajz] || []).map(function (v, i) { return { id: i, nev: v.nev, ar: i === 0 ? 0 : 60 }; }) },
      { kulcs: "szem", nev: "Szemszín", fajta: "kinezet", tetelek: SZEM_SZIN.map(function (v, i) { return { id: i, nev: v.nev, ar: i === 0 ? 0 : 30 }; }) }
    ];
  }
  return [];
}
function boltBirt(cs, t) {
  if (cs.fajta === "ruha") return !!P().oltozet.van[t.id];
  if (cs.fajta === "butor") return t.id === 1 || !!(P().odu.vanButor[cs.kulcs] && P().odu.vanButor[cs.kulcs][t.id]);
  if (cs.fajta === "disz") return t.id === "nincs" || !!P().odu.vanDisz[t.id];
  if (cs.fajta === "kinezet") { var v = cs.kulcs === "soreny" ? P().kinezet.vanSoreny : P().kinezet.vanSzem; return t.id === 0 || !!(v && v[t.id]); }
  if (cs.fajta === "vitrin") return !!P().odu.vitrin[t.id];
  if (cs.fajta === "kert") return t.id === "kulcs" ? !!P().kert.nyitva : !!P().kert.trukkok[t.id];
  if (cs.fajta === "kertdisz") return false;   /* darabra vehető: sosem „megvan" állapot, mindig újra vehető */
  return !!P().odu.van[cs.kulcs][t.id];
}
function boltAktiv(cs, t) {
  if (cs.fajta === "ruha") return P().oltozet[cs.kulcs] === t.id;
  if (cs.fajta === "butor") return ((P().odu.szint && P().odu.szint[cs.kulcs]) || 1) === t.id;
  if (cs.fajta === "disz") return (P().odu.disz[cs.kulcs] || "nincs") === t.id;
  if (cs.fajta === "kinezet") {
    if (cs.kulcs === "soreny") return (P().kinezet.sorenySzin || 0) === t.id;
    return (P().kinezet.szemSzin || null) === (SZEM_SZIN[t.id] ? SZEM_SZIN[t.id].hex || null : null);
  }
  if (cs.fajta === "vitrin") return false;         /* nincs „kint/rajta" állapot: ha megvan, a vitrinben áll */
  if (cs.fajta === "kert") return false;           /* nincs „kint/rajta" állapot */
  if (cs.fajta === "kertdisz") return false;       /* a lerakás a kertben történik, nem a boltban */
  return P().odu[cs.kulcs] === t.id;
}
/* a kiválasztott tétel érvényesítése / alapértelmezése az aktív fülön */
function boltKivalasztott() {
  var csk = boltCsoportok(), sel = BOLT_VAL[ODU_FUL], i, j;
  if (sel) for (i = 0; i < csk.length; i++) if (csk[i].kulcs === sel.g)
    for (j = 0; j < csk[i].tetelek.length; j++) if (csk[i].tetelek[j].id === sel.id)
      return { cs: csk[i], t: csk[i].tetelek[j], rang: j };
  if (csk[0] && csk[0].tetelek[0]) {
    BOLT_VAL[ODU_FUL] = { g: csk[0].kulcs, id: csk[0].tetelek[0].id };
    return { cs: csk[0], t: csk[0].tetelek[0], rang: 0 };
  }
  return null;
}
function boltValaszt(gk, id) { BOLT_VAL[ODU_FUL] = { g: gk, id: id }; hangGomb(); renderOduPanel(); }

/* A 18 ruha „polc-pózban" — a tárgy MAGA, a bolti polcon fekve/lógva (nem mini-unikornison).
   Visszaállítva 2026-09-06, producer-kérésre (a mini-unikornisos bélyegkép helyett). */
var POLC_POZ = {
  "fej-a":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M80 110 Q105 88 130 110" fill="none" stroke="#a7d99a" stroke-width="1.6" opacity="0.6"/>' +
    '<g stroke="#222" stroke-width="0.7"><circle cx="80" cy="110" r="4.5" fill="#f6a5c0"/><circle cx="92" cy="98" r="4.5" fill="#fce49a"/><circle cx="105" cy="93" r="4.5" fill="#a7d99a"/><circle cx="118" cy="98" r="4.5" fill="#9ec9f0"/><circle cx="130" cy="110" r="4.5" fill="#c9a8e6"/></g>' +
    '<g fill="#ffd24d" stroke="none"><circle cx="80" cy="110" r="1.6"/><circle cx="92" cy="98" r="1.6"/><circle cx="105" cy="93" r="1.6"/><circle cx="118" cy="98" r="1.6"/><circle cx="130" cy="110" r="1.6"/></g>',
  "fej-k":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M80 108 Q105 90 130 108" fill="none" stroke="#e6c34d" stroke-width="3.5"/>' +
    '<path d="M105 82 l3.5 9 l9.5 0.7 l-7.5 6 l2.8 9.2 l-8.3 -5.4 l-8.3 5.4 l2.8 -9.2 l-7.5 -6 l9.5 -0.7 Z" fill="#ffd24d" stroke="#222" stroke-width="1"/>',
  "fej-r":
    '<path d="M84 172 Q74 172 74 148 Q74 106 105 96 Q136 106 136 148 Q136 172 126 172 Z" fill="#d7c4ee" stroke="#222" stroke-width="1.3"/>' +
    '<path d="M78 112 Q80 90 91 89 l4 8 l7 -11 l7 11 l4 -8 Q120 90 122 112 Z" fill="#d9c7ec" stroke="#222" stroke-width="1.2"/>' +
    '<path d="M108 82 a10 10 0 1 0 7 17 a8 8 0 1 1 -7 -17 Z" fill="#fdf0d0" stroke="#c9a8e6" stroke-width="1"/>' +
    '<circle cx="88" cy="103" r="2" fill="#ffd24d"/><circle cx="122" cy="103" r="2" fill="#9ec9f0"/>',
  "nyak-a":
    '<rect x="92" y="66" width="26" height="7" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1"/><circle cx="120" cy="69.5" r="4" fill="#cbb6e6" stroke="#222" stroke-width="1"/>' +
    '<path d="M96 74 C82 92 82 138 105 148 C128 138 128 92 114 74" fill="none" stroke="#8a6a4a" stroke-width="3.4"/>' +
    '<circle cx="86" cy="98" r="2.6" fill="#a9814e"/><circle cx="124" cy="98" r="2.6" fill="#a9814e"/>' +
    '<ellipse cx="105" cy="152" rx="8" ry="10" fill="#c08a52" stroke="#222" stroke-width="1.2"/>' +
    '<path d="M96 148 q9 -7 18 0 l0 -4 q-9 -6 -18 0 Z" fill="#8a6a4a" stroke="#222" stroke-width="1"/><path d="M105 140 v-5" stroke="#8a6a4a" stroke-width="2.4"/>',
  "nyak-k": /* polc-poz-mintak.svg mintája */
    '<rect x="96" y="96" width="30" height="8" rx="4" fill="#b79fd4" stroke="#222" stroke-width="1.4"/><circle cx="128" cy="100" r="5" fill="#cbb6e6" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M104 104 C90 124 90 176 118 190 C146 176 146 124 132 104" fill="none" stroke="#c9a06a" stroke-width="1.4" opacity="0.5"/>' +
    '<g fill="#ffd24d"><circle cx="103" cy="107" r="2.6"/><circle cx="97" cy="124" r="2.6"/><circle cx="96" cy="142" r="2.6"/><circle cx="100" cy="160" r="2.6"/><circle cx="108" cy="176" r="2.6"/><circle cx="118" cy="184" r="2.6"/><circle cx="128" cy="176" r="2.6"/><circle cx="136" cy="160" r="2.6"/><circle cx="140" cy="142" r="2.6"/><circle cx="139" cy="124" r="2.6"/><circle cx="133" cy="107" r="2.6"/></g>' +
    '<path d="M118 186 v6" stroke="#ffd24d" stroke-width="2"/>' +
    '<path d="M118 192 c-4 -3.4 -9 -1.4 -9 3 c0 5.6 9 11 9 11 c0 0 9 -5.4 9 -11 c0 -4.4 -5 -6.4 -9 -3 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M133 182 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill="#fff2c4" stroke="none"/>',
  "nyak-r":
    '<rect x="92" y="66" width="26" height="7" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1"/><circle cx="120" cy="69.5" r="4" fill="#cbb6e6" stroke="#222" stroke-width="1"/>' +
    '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
    '<path d="M97 74 Q104 68 111 74" fill="none" stroke="#f6a5c0" stroke-width="6"/>' +
    '<path d="M86 76 Q80 120 76 168 L90 168 Q94 120 98 78 Z" fill="#f6a5c0"/><path d="M124 76 Q130 120 134 168 L120 168 Q116 120 112 78 Z" fill="#f6a5c0"/>' +
    '<path d="M84 90 Q105 80 126 90" fill="none" stroke="#fce49a" stroke-width="3"/><path d="M85 98 Q105 90 125 98" fill="none" stroke="#a7d99a" stroke-width="2.4"/>' +
    '</g><path d="M80 168 l2 10 l5 -8 Z" fill="#9ec9f0"/><path d="M128 168 l3 9 l4 -9 Z" fill="#c9a8e6"/>',
  "hat-a":
    '<rect x="20" y="172" width="170" height="11" rx="3" fill="#d9b48a"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<rect x="55" y="150" width="100" height="18" rx="3" fill="#cbbde6"/><rect x="59" y="134" width="92" height="18" rx="3" fill="#dcd0ec"/><rect x="63" y="118" width="84" height="18" rx="3" fill="#e9ddf3"/>' +
    '<path d="M63 118 q-7 25 0 50" fill="none" stroke="#8f7ab8" stroke-width="1.2"/><path d="M70 126 q40 -5 74 0" fill="none" stroke="#c9b8e0" stroke-width="1.6"/>' +
    '</g>',
  "hat-k": /* polc-poz-mintak.svg mintája */
    '<rect x="66" y="188" width="110" height="18" rx="3" fill="#b58fd8" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<rect x="70" y="172" width="102" height="18" rx="3" fill="#c9a8e6" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<rect x="74" y="156" width="94" height="18" rx="3" fill="#d7c4ee" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M74 156 q-8 24 0 50" fill="none" stroke="#8f7ab8" stroke-width="1.4"/><path d="M84 164 q37 -6 66 0" fill="none" stroke="#ffd24d" stroke-width="2" stroke-dasharray="5 3"/>' +
    '<path d="M117 158 l2.5 6 l6.5 0.6 l-5 4.4 l1.6 6.4 l-5.6 -3.6 l-5.6 3.6 l1.6 -6.4 l-5 -4.4 l6.5 -0.6 Z" fill="#fff6d8"/>',
  "hat-r":
    '<rect x="20" y="172" width="170" height="11" rx="3" fill="#d9b48a"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<rect x="55" y="150" width="100" height="18" rx="3" fill="#4f4590"/><rect x="59" y="134" width="92" height="18" rx="3" fill="#5a4fa0"/><rect x="63" y="118" width="84" height="18" rx="3" fill="#6a5fb0"/>' +
    '<path d="M82 124 l1.6 4 l4 0.4 l-3 2.8 l1 4 l-3.6 -2.3 l-3.6 2.3 l1 -4 l-3 -2.8 l4 -0.4 Z" fill="#fff6d8" stroke="none"/><circle cx="122" cy="126" r="1.6" fill="#fff6d8" stroke="none"/><circle cx="103" cy="115" r="3" fill="#ffd24d"/>' +
    '</g>',
  "lab-a":
    '<path d="M55 92 h100 M60 92 v-9 M150 92 v-9" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.2" stroke-linejoin="round">' +
    '<rect x="78" y="98" width="24" height="30" rx="4" fill="#a7d99a"/><path d="M90 98 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>' +
    '<rect x="112" y="98" width="24" height="30" rx="4" fill="#a7d99a"/><path d="M124 98 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>' +
    '</g>',
  "lab-k": /* polc-poz-mintak.svg mintája */
    '<ellipse cx="128" cy="177" rx="30" ry="7" fill="#c9b8e0" stroke="#222" stroke-width="1.4"/>' +
    '<rect x="123" y="107" width="10" height="70" rx="3" fill="#b79fd4" stroke="#222" stroke-width="1.4"/>' +
    '<path d="M128 107 q14 0 14 12" fill="none" stroke="#b79fd4" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M130 123 Q130 143 146 143 Q162 143 162 123" fill="none" stroke="#cfd6de" stroke-width="6" stroke-linecap="round"/>' +
    '<g fill="#eef2f6" stroke="none"><circle cx="134" cy="137" r="1.4"/><circle cx="146" cy="143" r="1.4"/><circle cx="158" cy="137" r="1.4"/></g>' +
    '<path d="M92 167 a10 9 0 0 1 20 0" fill="none" stroke="#f4b8d8" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M102 153 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#fff6d8" stroke="none"/>',
  "lab-r":
    '<path d="M55 92 h100 M60 92 v-9 M150 92 v-9" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke-linecap="round">' +
    '<path d="M78 122 a14 12 0 0 1 28 0" fill="none" stroke="#f4b8d8" stroke-width="5"/><path d="M92 98 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>' +
    '<path d="M114 122 a14 12 0 0 1 28 0" fill="none" stroke="#f4b8d8" stroke-width="5"/><path d="M128 98 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>' +
    '</g>',
  "oldal-a": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
    '<path d="M150 148 Q36 130 52 28 Q112 66 148 92 Q206 122 168 184 Q98 176 150 148 Z" fill="#a7d99a"/>' +
    '<path d="M118 86 Q78 58 42 36 M108 128 Q76 138 50 172 M132 108 Q100 112 70 128" fill="none" stroke="#7fb872" stroke-width="2"/>' +
    '</g><circle cx="150" cy="146" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "oldal-k": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' +
    '<path d="M150 118 Q56 26 22 78 Q54 140 146 132 Z" fill="#c9a8e6"/>' +
    '<path d="M146 132 Q84 172 46 186 Q128 168 152 136 Z" fill="#b58fd8"/>' +
    '<circle cx="58" cy="80" r="7" fill="#f6a5c0"/><circle cx="72" cy="98" r="5" fill="#fce49a"/><circle cx="80" cy="158" r="5.5" fill="#fce49a"/>' +
    '</g><circle cx="149" cy="128" r="3.6" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "oldal-r": /* NAGYÍTOTT, spec-szarny-nagyitas.html */
    '<ellipse cx="112" cy="106" rx="92" ry="78" fill="#ffe9ad" opacity="0.28"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M150 128 Q86 40 26 46 Q66 92 122 122 Z" fill="#ffffff"/><path d="M148 140 Q78 108 20 130 Q74 166 132 152 Z" fill="#fff6e0"/><path d="M144 150 Q94 176 58 186 Q112 172 150 156 Z" fill="#ffffff"/>' +
    '</g><path d="M150 66 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffd24d"/><circle cx="148" cy="146" r="3.6" fill="#8f7ab8" stroke="#222" stroke-width="1"/>',
  "farok-a":
    '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M105 48 Q78 34 70 48 Q78 64 105 48 Z" fill="#f6a5c0"/><path d="M105 48 Q132 34 140 48 Q132 64 105 48 Z" fill="#f6a5c0"/>' +
    '<circle cx="105" cy="48" r="5" fill="#e88bb4"/><path d="M100 54 l-8 20 M110 54 l8 20" fill="none" stroke="#f6a5c0" stroke-width="3"/>' +
    '</g>',
  "farok-k":
    '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
    '<path d="M90 40 Q105 32 120 40" fill="none" stroke="#c9a8e6" stroke-width="4"/>' +
    '<path d="M97 46 q-8 0 -8 10 l0 7 l18 0 l0 -7 q0 -10 -8 -10 Z" fill="#ffd24d"/><circle cx="97.5" cy="66" r="2.6" fill="#e0a52e"/><circle cx="97" cy="42" r="2.6" fill="#ffe6a0"/>' +
    '</g>',
  "farok-r":
    '<path d="M105 20 v12 M105 20 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g stroke-linejoin="round">' +
    '<path d="M105 34 Q84 62 68 96" fill="none" stroke="#fff2c4" stroke-width="12" stroke-linecap="round" opacity="0.5"/>' +
    '<path d="M105 34 Q86 60 72 94" fill="none" stroke="#ffe08a" stroke-width="5" stroke-linecap="round" opacity="0.9"/>' +
    '<path d="M68 96 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffe08a" stroke="#222" stroke-width="1.3"/>' +
    '</g>'
};
function boltThumb(cs, t) {
  if (cs.fajta === "ruha") {
    /* a tárgy maga a polcon (POLC_POZ), nem mini-unikornison — producer-kérés (2026-09-06) */
    var poz = POLC_POZ[t.id];
    if (poz) return '<svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">' + poz + '</svg>';
    var p = {}; p[cs.kulcs] = t.id;
    return '<svg viewBox="-92 -150 184 172" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("bt-" + t.id, LENYEK[mentes.leny], 1, p) + '</svg>';
  }
  if (cs.fajta === "butor") return oduSVG(mentes.leny, butorPreviewOdu(cs.kulcs, t.id), true);   /* mini-szoba a szinttel */
  if (cs.fajta === "kinezet") {
    var kn = kinezetPreview(cs.kulcs, t.id);
    return '<svg viewBox="-84 -150 168 168" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("bk-" + cs.kulcs + t.id, LENYEK[mentes.leny], 1, null, kn) + '</svg>';
  }
  if (cs.fajta === "disz") {
    if (t.id === "nincs") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="26" fill="none" stroke="#b08d5e" stroke-width="3.4" stroke-dasharray="5 5"/><path d="M30 30 L50 50 M50 30 L30 50" stroke="#b08d5e" stroke-width="3.4" stroke-linecap="round"/></svg>';
    if (t.id === "extrafuzer") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 30 Q40 46 70 30" stroke="#c9a8e6" stroke-width="1.6" fill="none"/><path d="M15 32 l11 1 l-6 13 Z" fill="#f6a5c0"/><path d="M28 36 l11 1 l-6 13 Z" fill="#fce49a"/><path d="M41 37 l11 0 l-6 13 Z" fill="#a7d99a"/><path d="M54 34 l11 -1 l-6 13 Z" fill="#9ec9f0"/></svg>';
    return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' + DISZ_TARGY[t.id].svg + '</svg>';   /* maga az ikon */
  }
  if (cs.fajta === "vitrin") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' + t.svg + '</svg>';   /* a kristály-dísz ikonja */
  if (cs.fajta === "kert") return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' + t.svg + '</svg>';   /* a kert-tétel ikonja (kulcs) */
  if (cs.fajta === "kertdisz") return kertTargyIkon(t.id);   /* berendezési tárgy: maga a kertbeli rajz kicsiben */
  var o = P().odu;
  return '<svg viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">' +
    (cs.kulcs === "napszak" ? oduEgSVG(t.id, 120, 64) : oduEgSVG(o.napszak, 120, 64) + oduIdoSVG(t.id, 120, 64, 9)) + '</svg>';
}
/* kinézet-előnézet: a jelenlegi kinézet, de a kérdéses tulajdonság a kért értéken */
function kinezetPreview(kulcs, id) {
  var k = P().kinezet, uj = { sorenySzin: k.sorenySzin || 0, szemSzin: k.szemSzin || null };
  if (kulcs === "soreny") uj.sorenySzin = id;
  else uj.szemSzin = SZEM_SZIN[id] ? (SZEM_SZIN[id].hex || null) : null;
  return uj;
}
/* előnézet-odú: a jelenlegi állapot, de a kérdéses hely a kért szinten */
function butorPreviewOdu(hely, level) {
  var o = P().odu, uj = {}, k; for (k in o) uj[k] = o[k];
  uj.szint = {}; for (k in (o.szint || {})) uj.szint[k] = o.szint[k];
  uj.szint[hely] = level; return uj;
}

var BOLT_TIPP = {
  "fej-a": "Erdei virágokból font koszorú.", "fej-k": "Csillagszikra a szarv köré.", "fej-r": "Vékony holdsarló-korona.",
  "nyak-a": "Makkokból fűzött lánc.", "nyak-k": "Rózsaszín szív-medál aranyláncon.", "nyak-r": "Puha, színes sál a hidegre.",
  "hat-a": "Könnyű takaró a hátra.", "hat-k": "Hímzett nyeregtakaró.", "hat-r": "Csillagmintás köpeny.",
  "lab-a": "Fűzöld pánt mind a négy bokára.", "lab-k": "Fényes ezüst patkó.", "lab-r": "Kristályból csiszolt patkó.",
  "oldal-a": "Levél alakú kis szárnyak.", "oldal-k": "Pillangó-szárny a röptetéshez.", "oldal-r": "Ragyogó fény-szárny.",
  "farok-a": "Szalagcsokor a farok tövére.", "farok-k": "Csengettyűk, halkan csilingelnek.", "farok-r": "Fénycsóvás üstökös-farok.",
  "este": "Csendes esti égbolt, telihold.", "reggel": "Rózsás hajnal, puha felhők.", "del": "Ragyogó déli napsütés.", "eclipse": "Ritka napfogyatkozás, csillagokkal.",
  "tiszta": "Derült, felhőtlen idő.", "eso": "Szelíd eső kopog az ablakon.", "ho": "Nagy pihékben hull a hó.", "szivarvany": "Eső után szivárvány ível az égen.",
  "k-gomb": "Fénytörő kristálygömb — a vitrin dísze.", "k-roka": "Csiszolt kristályróka figura.", "k-bagoly": "Csiszolt kristálybagoly figura.",
  "k-terkep": "Pici csillagtérkép-gömb, benne az égbolt.", "k-zene": "Zenélő doboz forgó unikornissal.", "k-lampas": "Meleg fényű tündérlámpás.",
  "kulcs": "Kinyitja a kertkaput az odúdban — ott sétáltathatod az unikornist.",
  "eves": "Ezután a letett ételre koppintva az unikornis odasétál és eszik.",
  "ropi": "Ropogós alma és répa — tedd a fűre, aztán etesd meg!",
  "eper": "Kosárnyi friss eper — édes falat a kertben.",
  "torta": "Ünnepi torta gyertyával — ritka csemege!"
};
function boltVegrehajt(cs, t) {
  if (P().jelvSzam && boltPenz(cs, t) >= t.ar) P().jelvSzam.vettMar = 1;   /* jelvény: Első vásárlás (csak ha tényleg futja, bármelyik valutából) */
  if (cs.fajta === "ruha") oduRuhaVesz({ kulcs: cs.kulcs }, t);
  else if (cs.fajta === "butor") oduButorVesz(cs.kulcs, t);
  else if (cs.fajta === "disz") oduDiszVesz(cs.kulcs, t);
  else if (cs.fajta === "kinezet") oduKinezetVesz(cs.kulcs, t);
  else if (cs.fajta === "vitrin") oduVitrinVesz(t);
  else if (cs.fajta === "kert") oduKertVesz(t);
  else if (cs.fajta === "kertdisz") kertTargyVesz(t);
  else oduVesz(cs.kulcs, t);
  jelvenyEllenoriz();                          /* bolti jelvények azonnal (Első vásárlás, Otthonteremtő, Gyűjtő) */
}
function oduKinezetVesz(kulcs, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  var van = kulcs === "soreny" ? P().kinezet.vanSoreny : P().kinezet.vanSzem;
  van[t.id] = 1;
  oduKinezetBeallit(kulcs, t.id, true);     /* vétel után rögtön fel is vesszük */
}
function oduKinezetBeallit(kulcs, id, vetel) {
  if (kulcs === "soreny") P().kinezet.sorenySzin = id;
  else P().kinezet.szemSzin = SZEM_SZIN[id] ? (SZEM_SZIN[id].hex || null) : null;
  if (vetel) { hangCsilla(); hangJo(); } else hangGomb();
  ment(); renderOdu(); renderOduPanel();
}
function oduDiszVesz(zona, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  P().odu.vanDisz[t.id] = 1;
  P().odu.disz[zona] = t.id;                /* vétel után rögtön ki is rakjuk */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduDiszBeallit(zona, id) {
  P().odu.disz[zona] = (id === "nincs") ? null : id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}
function oduButorVesz(hely, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  if (!P().odu.vanButor[hely]) P().odu.vanButor[hely] = {};
  P().odu.vanButor[hely][t.id] = 1;
  P().odu.szint[hely] = t.id;              /* vétel után rögtön ki is tesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduButorBeallit(hely, id) {
  P().odu.szint[hely] = id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}
function oduRuhaVesz(hely, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  P().oltozet.van[t.id] = 1;
  P().oltozet[hely.kulcs] = t.id;          /* vétel után rögtön fel is vesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduRuhaVisel(kulcs, itemId) {
  P().oltozet[kulcs] = itemId;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}
function oduVesz(kat, t) {
  if (P().csillampor < t.ar) { renderOduPanel(); return; }
  P().csillampor -= t.ar; vasarlasNaplo(t.id, t.ar, "csillampor");
  P().odu.van[kat][t.id] = 1;
  P().odu[kat] = t.id;                 /* vétel után rögtön ki is tesszük */
  hangCsilla(); hangJo(); ment();
  renderOdu(); renderOduPanel();
}
function oduBeallit(kat, id) {
  P().odu[kat] = id;
  hangGomb(); ment();
  renderOdu(); renderOduPanel();
}


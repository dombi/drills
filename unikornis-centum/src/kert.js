/* ============ 10d) KERT / UDVAR (1. fázis: séta) ============
   Teljesen additív: saját mentés-ág P().kert, saját DOM #kepernyo-kert + .kert-* CSS.
   Belépés az odú kertkapuján (2026-10: ingyenes, nincs kulcs — kertKulcsRendez). Séta: koppints a fűre → odasétál. */
var KERT_UNI_X = 50;   /* az unikornis vízszintes helye, % */
var KERT_SUGO_SETA = "Koppints a fűre, vagy a túlparton egy virágágyásra! 🌷";   /* séta-módban ez a súgó */
function kertSugo(t) { var s = $("kert-sugo"); if (s) s.textContent = t; }
function kertNyit() {
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  kertHangokBetolt();                    /* kerti hangklipek dekódolása (egyszer) */
  KERT_UNI_X = 50;
  KERT_MOD = null; KERT_RAK_TIP = null;   /* friss belépéskor séta-mód */
  kertKulcsRendez();                     /* a kert ingyenes: a régi kulcs árát egyszer visszaadjuk */
  tenyKertAlaphelyzet();                 /* 🌷 Tény-kert: a fűben kezdünk (teny-kert.js) */
  var bimboHir = tenyKertBelep();        /* első belépés: a meglévő tudás bimbóként jelenik meg */
  mutat("kepernyo-kert");                /* előbb látható legyen, hogy a színtér aránya mérhető (fekvő/álló kép) */
  renderKert();
  tenyKertErkezik(bimboHir);             /* 🌷 hírek, üdvözlés, szomjúság, napi meglepetés (teny-kert.js, 5. kör) */
}
/* ── A KERT INGYENES (Tamagocsi-kert 2. kör): a kertkapu-kulcs megszűnt. Aki megvette, EGYSZER
   visszakapja a 150 ✨-t, kedves üzenettel. A kulcsVissza jel őrzi, hogy kétszer ne kapja meg.
   Futásidőben (odú / utca / kert nyitásakor) fut, nem a betöltéskor: addigra a felhő-állapot is
   megérkezett, így egy másik gépen már megkapott visszatérítést is látja. ── */
var KERT_KULCS_AR = 150;
function kertKulcsRendez() {
  var k = P().kert; if (k.kulcsVissza) return;
  var vette = !!k.nyitva;
  k.kulcsVissza = 1; k.nyitva = 1;
  if (vette) {
    P().csillampor += KERT_KULCS_AR;
    esemeny("kertKulcsVissza", { ar: KERT_KULCS_AR });
    kertHir("🌿 A kertkapu mostantól mindenkinek nyitva áll. Visszaadtuk a " + KERT_KULCS_AR + " csillámport! ✨");
  }
  ment();
}
/* kedves hír-szalag a képernyő tetején (néhány másodpercig), felolvasva is; a Tény-kert hírei is ezt használják */
function kertHir(szoveg) {
  var h = $("kert-hir");
  if (!h) { h = document.createElement("div"); h.id = "kert-hir"; h.className = "kert-hir"; h.setAttribute("role", "status"); document.body.appendChild(h); }
  h.textContent = szoveg;
  h.classList.remove("lat"); void h.offsetWidth; h.classList.add("lat");
  clearTimeout(kertHir._t); kertHir._t = setTimeout(function () { h.classList.remove("lat"); }, 6000);
  h.onclick = function () { h.classList.remove("lat"); };
  try { if (mentes.hang) mondd(szoveg.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, "")); } catch (e) {}
}
function renderKert() {
  var cel = $("kert-csillampor"); if (cel) cel.textContent = P().csillampor;
  var harmatEl = $("kert-harmat"); if (harmatEl) harmatEl.textContent = (P().tunderharmat || 0);   /* 💧 kitartás-valuta */
  var host = $("kert-szinter"); if (!host) return;
  var c = LENYEK[mentes.leny];
  host.innerHTML =
    '<div id="kert-kamera" class="kert-kamera">' +                          /* 🌷 a ráközelítés rétege: az ágyásra koppintva ez nagyít (teny-kert.js) */
    kertHatterSVG(kertTajOrient(host)) +                                    /* a patakparti C2 kert (kert-tajkep.js), fekvő vagy álló */
    '<div id="kert-elemek" class="kert-elemek"></div>' +                    /* lerakott tárgyak rétege (mélység szerint sorolva) */
    '<div id="kert-uni-doboz" class="kert-uni-doboz"><div class="kert-uni-flip">' +
      '<svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' +
        unikornisSVG("kert-uni", c, 1, P().oltozet) +
      '</svg></div></div></div>';
  var doboz = $("kert-uni-doboz");
  doboz.style.left = KERT_UNI_X + "%";
  doboz.style.setProperty("--dir", 1);
  uniNezoAdat(doboz, { rajz: c.rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });   /* a fordulás/pörgés szemből-képéhez */
  doboz.style.zIndex = 870;   /* talajpontja ~87%: a lentebb (y>87) tett tárgyak elé, a fentebbiek mögé kerül */
  KERT_UL = false; KERT_FEKSZIK = false;   /* friss belépéskor áll (a doboz DOM újraépült, a pihenő-pózok eltűntek) */
  host.onclick = kertSzinterKlikk;
  kertElemekRender();
  kertEszkozsorRender();
  kertFeszerRender();
  kertTrukksorRender();
  kertTajIgazit(host);                   /* a kép kivágása: az ágyások mindig látszanak (kert-tajkep.js) */
  kertTajMozgasIndit();                  /* hal + szitakötő */
  tenyKertTavol();                       /* 🌷 a virágok a túlparti ágyásokban (teny-kert.js) */
}
/* ha a színtér aránya átbillen (telefon elforgatása), csak a háttér cserélődik a másik elrendezésre */
window.addEventListener("resize", function () {
  var host = $("kert-szinter"), k = $("kepernyo-kert");
  if (!host || !k || !k.classList.contains("aktiv")) return;
  var o = kertTajOrient(host);
  if (o === KERT_ORIENT) {               /* ugyanaz az elrendezés: csak a kivágás igazodik az új mérethez */
    kertTajIgazit(host);
    if (TVK.allapot === "bent") tvkKamera(TVK.agy, 0);
    return;
  }
  if (TVK.allapot) { tenyKertAlaphelyzet(); renderKert(); kertSugo(KERT_SUGO_SETA); return; }   /* a Tény-kertben (séta, közeli kép) elforgatva: vissza a fűre */
  var regi = host.querySelector(".kert-hatter"); if (!regi) return;
  var t = document.createElement("div"); t.innerHTML = kertHatterSVG(o);
  regi.parentNode.replaceChild(t.firstChild, regi);
  kertTajIgazit(host);
  kertTajMozgasIndit();
  tenyKertTavol();
});
/* a színtérre koppintás: berendezés-módban lerakás, egyébként séta */
function kertSzinterKlikk(e) {
  var host = $("kert-szinter"); if (!host) return;
  if (KERT_TRUKK_FUT || TVK.allapot) return;                             /* egyszeri trükk, ill. a Tény-kert sétája / közeli képe közben nem történik semmi */
  if (KERT_MOD === "pakol") {
    var pe = e.target.closest && e.target.closest(".kt-elem");
    if (pe) kertElemPakol(parseInt(pe.getAttribute("data-i"), 10));
    return;
  }
  var r = host.getBoundingClientRect();
  if (KERT_MOD === "rak") {
    if (!KERT_RAK_TIP) { kertSugo("Válassz lentről egy tárgyat, majd koppints a fűre! 🧺"); return; }
    kertElemRak(KERT_RAK_TIP, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    return;
  }
  /* séta mód (alap) */
  var meglep = e.target.closest && e.target.closest(".kc-meglep");        /* 🎁 a napi meglepetés: a látogató köszön, a kincset felveszi (teny-kert.js) */
  if (meglep) { tenyKertMeglepKlikk(meglep); return; }
  var agyas = e.target.closest && e.target.closest(".kc-agyas");          /* 🌷 a túlparti ágyásra: átsétál a hídon, és ráközelít (teny-kert.js) */
  if (agyas) { tenyKertBesetal(agyas.getAttribute("data-agy")); return; }
  if (e.target.closest && e.target.closest("#kert-uni-doboz")) { if (KERT_FEKSZIK) kertAll(true); else kertNyihog(); return; }   /* magára az unikornisra koppintva nem lép, hanem nyihog (fekve: felkel) */
  var etelDiv = e.target.closest && e.target.closest(".kt-etel-elem");   /* letett ÉTEL-re koppintva: Evés (vagy súgó) */
  if (etelDiv) { kertEtelKoppint(parseInt(etelDiv.getAttribute("data-i"), 10)); return; }
  var agyDiv = e.target.closest && e.target.closest(".kt-agy-elem");     /* letett ÁGY-ra koppintva: Befekvés (vagy súgó) */
  if (agyDiv) { kertAgyKoppint(parseInt(agyDiv.getAttribute("data-i"), 10)); return; }
  var novenyDiv = e.target.closest && e.target.closest(".kt-noveny-elem");   /* letett NÖVÉNY-re: megszagolom */
  if (novenyDiv) { kertNovenyKoppint(parseInt(novenyDiv.getAttribute("data-i"), 10)); return; }
  if (KERT_UL || KERT_FEKSZIK) { kertAll(true); return; }                /* ha ül vagy fekszik, a fűre koppintás előbb felállítja (fekvésből nyújtózik is) */
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
  kertSugo((KERT_MOD === "rak")
    ? "Válassz egy tárgyat, majd koppints a fűre, hová tegyem! 🧺"
    : (KERT_MOD === "pakol")
    ? "Koppints egy tárgyra — visszakerül a fészerbe. 🧹"
    : KERT_SUGO_SETA);
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
  kertSugo((KERT_MOD === "pakol")
    ? "Visszatettem a fészerbe! Koppints másikra, vagy lépj ki. 🧹"
    : KERT_SUGO_SETA);
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
    kertSugo(KERT_RAK_TIP ? "Koppints a fűre, hová tegyem! 🧺" : "Válassz egy tárgyat lentről! 🧺");
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
    var vb = agy ? KERT_AGY_VB : "-50 -90 100 96";
    var hitRect = noveny ? '<rect x="-50" y="-90" width="100" height="96" fill="none" pointer-events="all"/>' : '';
    html += '<div class="kt-elem' + (etel ? ' kt-etel-elem' : '') + (agy ? ' kt-agy-elem' + ((KERT_FEKSZIK && KERT_AGY_I === i) ? ' terhelt' : '') : '') + (noveny ? ' kt-noveny-elem' : '') + '" data-i="' + i + '" style="left:' + o.x + '%;top:' + o.y + '%;z-index:' + z + '">' +
      '<svg class="kt-el-svg" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + hitRect + kertTargyBelso(o.tip) + '</svg>';
    if (noveny && o.tip !== "gombak" && lepkeDb < 3) {
      html += '<svg class="kt-lepke" style="animation-delay:' + (lepkeDb * 2.6).toFixed(1) + 's" viewBox="0 0 28 18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M14 9 Q6 2 2 6 Q6 14 14 10 Z" fill="#ff9ec4"/>' +
        '<path d="M14 9 Q22 2 26 6 Q22 14 14 10 Z" fill="#b6a7f2"/>' +
        '<circle cx="14" cy="9" r="1.8" fill="#4a3f6b"/></svg>';
      lepkeDb++;
    }
    html += '</div>';
    if (agy) html += '<div class="kt-elem kt-agy-elol' + ((KERT_FEKSZIK && KERT_AGY_I === i) ? ' terhelt' : '') + '" data-i="' + i + '" style="left:' + o.x + '%;top:' + o.y + '%;z-index:' + (z + 8) + '">' +
      '<svg class="kt-el-svg" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + kertTargyBelso("agy-elol") + '</svg></div>';   /* matrac-perem az unikornis elé */
  }
  reteg.innerHTML = html;
}
/* egy tárgy lerakása a fészerből a (x%,y%) helyre */
function kertElemRak(tip, x, y) {
  if ((P().kert.keszlet[tip] || 0) <= 0) return;
  x = Math.max(4, Math.min(96, x));
  y = Math.max(KERT_TARGY_MIN_Y, Math.min(95, y));   /* csak az innenső, füves partra (a patak és a túlpart a kert képe) */
  P().kert.keszlet[tip]--;
  P().kert.elemek.push({ tip: tip, x: Math.round(x), y: Math.round(y) });
  hangCsilla(); ment();
  if ((P().kert.keszlet[tip] || 0) <= 0) KERT_RAK_TIP = null;   /* elfogyott → válassz másikat */
  kertElemekRender(); kertFeszerRender();
  kertSugo((P().kert.keszlet[tip] > 0)
    ? "Szuper! Tehetsz le még egyet, vagy válassz mást. 🧺"
    : "Letéve! 🌿 Berendezésből kilépni: koppints a 🧺 gombra.");
}
/* A megvett trükkökhöz 1-1 gomb a kert alján (adatvezérelt: KERT_BOLT trükk-sorai).
   Rákoppintva az unikornis eljátssza. Ha még nincs trükk, a sor rejtve. */
function kertTrukksorRender() {
  var sor = $("kert-trukksor"); if (!sor) return;
  var tr = P().kert.trukkok || {}, chips = "";
  KERT_BOLT.forEach(function (t) {
    if (!t.perc || !tr[t.id]) return;
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
var KERT_AGY_I = -1;   /* melyik ágyon fekszik (a kert.elemek indexe) — az a matrac süpped be */
function kertUl() {
  if (KERT_TRUKK_FUT) return;
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  kertJarKi(doboz);
  doboz.classList.add("ules-all");
  KERT_UL = true;
  hangCsilla();
  kertSugo("🛋️ Ül — koppints a gombra vagy a fűre, hogy felálljon.");
  kertTrukksorRender();
}
/* nyujt = true: ha fekvésből kel, a fűre érve nyújtózik és ásít egyet (uniNyujtozik, renderer.js) — csak ha a felkelés maga a cél,
   nem amikor egy másik mozdulat (trükk, séta) előtt áll fel */
function kertAll(nyujt) {
  var doboz = $("kert-uni-doboz"); if (!doboz) return;
  var fekudt = KERT_FEKSZIK;
  doboz.classList.remove("ules-all");
  doboz.classList.remove("fekszik-all");
  if (KERT_FEKSZIK) {              /* leugrik az ágyról vissza a fűre, a matrac kipuffad */
    doboz.style.transition = "left .5s ease, bottom .5s ease, transform .45s ease";
    doboz.style.bottom = "";
    doboz.style.left = KERT_UNI_X + "%";
    var agyak = document.querySelectorAll(".kt-agy-elem.terhelt, .kt-agy-elol.terhelt");
    for (var ai = 0; ai < agyak.length; ai++) agyak[ai].classList.remove("terhelt");
  }
  KERT_AGY_I = -1;
  doboz.style.zIndex = 870;        /* vissza az alap mélységre (fekvéskor az ágy fölé emeltük) */
  uniFelebred(doboz);              /* felébred: kinyitja a szemét, a Zzz eltűnik (renderer.js) */
  KERT_UL = false; KERT_FEKSZIK = false;
  hangGomb();
  kertSugo(KERT_SUGO_SETA);
  kertTrukksorRender();
  if (nyujt && fekudt) {
    KERT_TRUKK_FUT = true;                         /* nyújtózás közben nem indul új mozdulat */
    setTimeout(function () {                       /* előbb leér a fűre (.5 s) */
      if (!doboz.isConnected || KERT_FEKSZIK || KERT_UL) { KERT_TRUKK_FUT = false; return; }
      uniNyujtozik(doboz, function () { KERT_TRUKK_FUT = false; });
    }, 520);
  }
}
/* egy EGYSZERI trükk lejátszása: a meglévő figurára tesz egy .trukk-<id> osztályt (a mozgást a CSS
   végzi, újrarajzolás nincs), majd a trükk hossza után leveszi. Egyszerre egy trükk fut. */
var KERT_TRUKK_FUT = false;
function kertTrukkAdat(id) { var r = null; KERT_BOLT.forEach(function (t) { if (t.id === id) r = t; }); return r; }
function kertTrukkJatszik(id) {
  var t = kertTrukkAdat(id); if (!t || !t.perc) return;
  var doboz = $("kert-uni-doboz"); if (!doboz || KERT_TRUKK_FUT) return;
  KERT_TRUKK_FUT = true;
  kertJarKi(doboz);
  /* 🌀 Pörgés: a közös, 4 nézetes pörgés (uniPorog, renderer.js) — ugyanaz, mint a felhőkertben */
  if (id === "porges") {
    hangCsilla();
    kertSugo(t.emoji + " " + t.nev + "!");
    uniPorog(doboz, t.perc, function () {
      KERT_TRUKK_FUT = false;
      kertSugo(KERT_SUGO_SETA);
    });
    return;
  }
  /* ugrás a kert szélén: előbb megfordul (közös fordulás), csak utána ugrik */
  var fordul = id === "ugras" ? kertUgrasElore(doboz) : 0;
  if (fordul) { kertSugo(t.emoji + " " + t.nev + "!"); setTimeout(function () { kertTrukkMozdul(doboz, id, t); }, fordul); }
  else kertTrukkMozdul(doboz, id, t);
}
function kertTrukkMozdul(doboz, id, t) {
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
  kertSugo(t.emoji + " " + t.nev + "!");
  clearTimeout(doboz._trukkTimer);
  doboz._trukkTimer = setTimeout(function () {
    doboz.classList.remove(cls);
    csillamElemek.forEach(function (e) { e.parentNode && e.parentNode.removeChild(e); });
    KERT_TRUKK_FUT = false;
    kertSugo(KERT_SUGO_SETA);
  }, t.perc + 80);
}
/* 🦘 az ugrás ELŐRE visz (amerre néz) — a vízszintes elmozdulás csak a levegőben töltött szakaszra
   esik (a CSS-ben 26%→50% = ~0,28 s-tól ~0,27 s-ig). Ha a kert széle útban van, megfordul és
   arra ugrik (előbb megfordul: a visszaadott ms után indul az ugrás). Mozgáskímélő módban helyben marad. */
var KERT_UGRAS_TAV = 12;   /* ennyi %-ot ugrik előre */
function kertUgrasElore(doboz) {
  if (nyugiMod()) return 0;
  var dir = uniIrany(doboz);
  var cel = KERT_UNI_X + KERT_UGRAS_TAV * dir;
  if (cel < 13 || cel > 87) { dir = -dir; cel = KERT_UNI_X + KERT_UGRAS_TAV * dir; }
  KERT_UNI_X = cel;
  return uniFordul(doboz, dir, function () {
    doboz.style.transition = "left .27s ease-in-out .28s, transform .45s ease";
    doboz.style.left = cel + "%";
  });
}
function kertSetal(celX) { kertSetalIde(celX); }
/* a kert EGYETLEN séta-útja (koppintás, étel, növény, ágy): odamegy celX-re (%), utána kesz().
   A mozgásmód (séta/ügetés), a tempó és az időtartam a közös járásból jön (uniUt, renderer.js). */
function kertSetalIde(celX, kesz) {
  var doboz = $("kert-uni-doboz"), host = $("kert-szinter"); if (!doboz) return;
  celX = Math.max(13, Math.min(87, celX));
  clearTimeout(doboz._jarTimer);
  if (uniJarFut(doboz) && host && host.clientWidth) {   /* menet közben új cél: onnan indul, ahol épp jár */
    KERT_UNI_X = parseFloat(getComputedStyle(doboz).left) / host.clientWidth * 100;
    doboz.style.transition = "none"; doboz.style.left = KERT_UNI_X + "%";
  }
  if (Math.abs(celX - KERT_UNI_X) < 1.2) { kertJarKi(doboz); if (kesz) kesz(); return; }
  var dir = celX < KERT_UNI_X ? -1 : 1;
  if (uniIrany(doboz) !== dir) kertJarKi(doboz);
  uniFordul(doboz, dir, function () {   /* előbb megfordul (közös fordulás), csak utána lép */
    var ut = uniUt(doboz, Math.abs(celX - KERT_UNI_X) / 100 * (host ? host.clientWidth : 1000)), mp = ut.mp;
    doboz.style.transition = "left " + mp.toFixed(2) + "s linear, transform .45s ease";   /* a leülés/felállás simasága séta után is */
    uniJar(doboz, ut); kertLepesHang(true, ut);
    KERT_UNI_X = celX;
    doboz.style.left = celX + "%";
    doboz._jarTimer = setTimeout(function () { kertJarKi(doboz); if (kesz) kesz(); }, mp * 1000 + 90);
  });
}
function kertJarKi(doboz) { uniAll(doboz); kertLepesHang(false); clearTimeout(doboz._jarTimer); }

/* ── Evés (3. lépés): a letett ételre koppintva az unikornis odasétál és megeszi.
   Ha még nincs meg az Evés képesség, kedves súgó irányít a boltba. Az étel NEM fogy el. */
function kertEtelKoppint(i) {
  if (KERT_TRUKK_FUT) return;                       /* épp eszik/trükközik → nem indítunk újat */
  var o = P().kert.elemek[i]; if (!o) return;
  var def = kertTargyDef(o.tip); if (!def || def.csoport !== "etel") return;
  if (!(P().kert.trukkok && P().kert.trukkok.eves)) {   /* nincs meg az Evés → súgó */
    hangGomb();
    kertSugo("😋 Vedd meg a boltban az Evés képességet, és az unikornis idesétál falatozni!");
    return;
  }
  if (KERT_UL || KERT_FEKSZIK) kertAll();
  kertSetalEszik(Math.max(13, Math.min(87, o.x)), o);
}
/* odasétál a falathoz (a séta-motor tempójával), majd megeszi */
function kertSetalEszik(celX, o) {
  if (!$("kert-uni-doboz")) return;
  KERT_TRUKK_FUT = true;                             /* az odaérésig (és utána a mozdulat végéig) más interakció nem indul */
  kertSugo("🚶 Megyek a finom falatért…");
  kertSetalIde(celX, function () { kertEszik(o); });
}
/* az evés-animáció: fejlehajtás + csámcsogás (CSS .eszik) + kis szikra az étel fölött. Az étel marad. */
function kertEszik(o) {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  doboz.classList.add("eszik");
  hangCsilla(); kertNyihog();                    /* halk nyihogás a falatnak (terv: 3. döntés) */
  kertSugo("😋 Nyami-nyami… csámcsog!");
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
    kertSugo("Finom volt! 🌿 Koppints a fűre, vagy másik falatra.");
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
  if (!$("kert-uni-doboz")) return;
  KERT_TRUKK_FUT = true;                             /* az odaérésig (és utána a mozdulat végéig) más interakció nem indul */
  kertSugo("🚶 Megyek megszagolni…");
  kertSetalIde(celX, function () { kertSzagol(o); });
}
function kertSzagol(o) {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  doboz.classList.add("szagol");
  hangCsilla();
  kertSugo("🌸 Milyen finom illat!");
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
    kertSugo("Micsoda illat! 🌿 Koppints a fűre, vagy szagolgass tovább.");
  }, 1300);
}

/* ── Befekvés (4. lépés): a letett ÁGY-ra koppintva az unikornis odasétál és belefekszik.
   Ha még nincs meg a Befekvés képesség, kedves súgó irányít a boltba. Az ágy tárgy — a helyén marad.
   A fekvés TARTÓS pihenő-póz (mint az ülés): koppintásra (ágyra vagy fűre) feláll. */
function kertAgyKoppint(i) {
  var o = P().kert.elemek[i]; if (!o || o.tip !== "agy") return;
  if (KERT_FEKSZIK) { kertAll(true); return; }       /* már fekszik → az ágyra koppintva feláll és nyújtózik */
  if (KERT_TRUKK_FUT) return;                          /* épp sétál/eszik → nem indítunk újat */
  if (!(P().kert.trukkok && P().kert.trukkok.befekves)) {   /* nincs meg a Befekvés → súgó */
    hangGomb();
    kertSugo("😴 Vedd meg a boltban a Befekvés képességet, és az unikornis lepihen ide!");
    return;
  }
  if (KERT_UL) kertAll();
  kertSetalFekszik(i);
}
/* odasétál az ágyhoz (a séta-motor tempójával), majd belefekszik */
function kertSetalFekszik(i) {
  if (!$("kert-uni-doboz")) return;
  KERT_TRUKK_FUT = true;                               /* az odaérésig más interakció nem indul */
  kertSugo("🚶 Megyek lepihenni…");
  kertSetalIde(P().kert.elemek[i].x, function () { kertFekszik(i); });
}
/* a befekvés: az unikornis felhuppan az ágyra (a doboz a matrac tetejére ugrik, fejjel a párna felé),
   a lábak behajlanak, a has a matracra kerül (UNI_POZ.fekszik), aztán elalszik (uniElalszik); a matrac a súlyától besüpped és vele együtt lélegzik (.kt-agy-elem.terhelt).
   Tartós póz — koppintásra leugrik és feláll. A hely a választott ágy AGY_FEKVES pontjából jön (odu.js, közös ágyrajz). */
var KERT_AGY_VB = "-46 -54 92 62";   /* a kerti ágy SVG-doboza (tárgy-egység); a CSS szélesség 212px → KERT_AGY_PX px/egység */
var KERT_AGY_PX = 212 / 92;
var KERT_UNI_TALP = 25;   /* px: a kerti unikornis-doboz alja ennyivel van a rajz origója alatt (viewBox alja 26 egység × ~0,95 px) */
function kertAgyHely() {   /* {jobbra, fel} px az ágy talajpontjától: ide kerül az unikornis-doboz alja-közepe */
  var f = AGY_FEKVES[agyFajta((P().odu.szint && P().odu.szint.agy) || 1)], k = KERT_AGY_SKALA * KERT_AGY_PX;
  return { jobbra: Math.round((f.x - 155) * k), fel: Math.round((452 - f.y) * k - KERT_UNI_TALP) };
}
function kertFekszik(i) {
  var doboz = $("kert-uni-doboz");
  if (!doboz) { KERT_TRUKK_FUT = false; return; }
  KERT_TRUKK_FUT = false;                              /* a fekvés tartós állapot, nem „fut" (lehet rá koppintani) */
  kertJarKi(doboz);
  var o = P().kert.elemek[i];
  if (o) {
    KERT_AGY_I = i;
    doboz.style.zIndex = Math.round(o.y * 10) + 5;     /* közvetlenül az ágy fölé (mélységben is azon fekszik) */
    uniFordul(doboz, -1);                              /* fejjel a párna (bal) felé — felhuppanás közben fordul */
    doboz.style.transition = "left .55s ease-out, bottom .55s cubic-bezier(.3,1.7,.55,1), transform .45s ease";   /* kis ív: felhuppan */
    var hely = kertAgyHely();
    doboz.style.left = "calc(" + o.x + "% + " + hely.jobbra + "px)";
    doboz.style.bottom = "calc(" + (100 - o.y) + "% + " + hely.fel + "px)";
    var agyEl = document.querySelectorAll('.kt-agy-elem[data-i="' + i + '"], .kt-agy-elol[data-i="' + i + '"]');   /* matrac + elülső pereme együtt */
    setTimeout(function () {
      if (!KERT_FEKSZIK || KERT_AGY_I !== i) return;
      for (var ai = 0; ai < agyEl.length; ai++) agyEl[ai].classList.add("terhelt");
    }, 380);   /* a landoláskor süpped be */
  }
  doboz.classList.add("fekszik-all");
  KERT_FEKSZIK = true;
  uniElalszik(doboz);              /* álmos pislogás → alszik, a fej a mellkasra hajlik, Zzz (renderer.js) */
  hangCsilla();
  kertSugo("😴 Pihen az ágyon — koppints, hogy felkeljen.");
}
function oduPanelNyit(fulKezd) { ODU_FUL = fulKezd || "ido"; BOLT_MEGEROSIT = false; BOLT_BAGOLY_EXTRA = null; $("odu-panel").hidden = false; renderOduPanel(); }
function oduPanelZar() { $("odu-panel").hidden = true; var l = $("odu-lap"); if (l) l.hidden = true; oduUniHaza(); }
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

/* ── oldalak: egy polc = egy csoport (bolt-polc rajzterv, 2026-10-01) ──
   Felül max 4, alul max 3 tárgy (a bal alsó sarok a bagolyé). Egy oldal = felső + alsó polc.
   A felső polcra a soron következő csoport (első 4 tárgya) kerül; az alsóra is a soron következő:
   ha elfér (≤3), egészben; ha több polcra nyúlik (>4), az első 3 tárgya. Csak a pont 4 tárgyas
   csoportot ugorjuk át (az felső polcra való). A csoporton belüli sorrend sosem bomlik meg. */
function boltOldalak() {
  var sor = [], lapok = [];
  boltCsoportok().forEach(function (cs) { if (cs.tetelek.length) sor.push({ cs: cs, maradt: cs.tetelek.slice() }); });
  function levesz(i, n) {
    var d = { cs: sor[i].cs, tetelek: sor[i].maradt.splice(0, n) };
    if (!sor[i].maradt.length) sor.splice(i, 1);
    return d;
  }
  while (sor.length) {
    var f = levesz(0, 4), a = null, i;
    for (i = 0; i < sor.length && !a; i++) if (sor[i].maradt.length !== 4) a = levesz(i, 3);
    lapok.push({ felso: f, also: a });
  }
  return lapok.map(function (l) {
    var tetelek = [], helyek = [], nevek = [], tablak = [];
    [l.felso, l.also].forEach(function (d, polc) {
      if (!d) return;
      nevek.push(d.cs.nev);
      var tabla = boltTablaKulcs(d.cs);
      if (tabla) tablak.push({ kulcs: tabla, felso: polc === 0 });
      var h = boltHelyek(d.tetelek.length, polc === 0, !!tabla);
      d.tetelek.forEach(function (t, i) { tetelek.push({ cs: d.cs, t: t }); helyek.push(h[i]); });
    });
    return { nev: nevek.join(" · "), tetelek: tetelek, helyek: helyek, tablak: tablak };
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
/* egy polc helyei: felül max 4, alul max 3 (a bal alsó sarok a bagolyé);
   ha a polc bal végén „hova kerül" tábla áll, a tárgyak jobbra húzódnak */
function boltHelyek(n, felso, tablas) {
  var ki = [], i;
  if (tablas) {
    for (i = 0; i < n; i++) ki.push(felso ? { x: 228 + i * 88, y: BOLT_POLC_FELSO, felso: true } : { x: 320 + i * 86, y: BOLT_POLC_ALSO, felso: false });
    return ki;
  }
  for (i = 0; i < n; i++) ki.push(felso
    ? { x: 305 - (n - 1) * 50 + i * 100, y: BOLT_POLC_FELSO, felso: true }
    : { x: 385 - (n - 1) * 52.5 + i * 105, y: BOLT_POLC_ALSO, felso: false });
  return ki;
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
  if (cs.fajta === "kert" && boltBirt(cs, t)) return "Ez megvan! Menj a kertbe, és próbáld ki!";
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
    if (aktiv && cs.fajta === "disz") return { szoveg: "Leszedem", szin: "le", mit: function () { oduDiszBeallit(cs.kulcs, "nincs"); } };
    if (aktiv) return { szoveg: (cs.fajta === "kinezet") ? "✓ ez van rajta" : "✓ ez van kint", szin: "kesz", mit: null };
    if (cs.fajta === "butor") return { szoveg: "Berendezem", szin: "fel", mit: function () { oduButorBeallit(cs.kulcs, t.id); } };
    if (cs.fajta === "disz") return { szoveg: "Kirakom", szin: "fel", mit: function () { oduDiszBeallit(cs.kulcs, t.id); } };
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
  if (cs.fajta === "butor") {
    /* a bútor KÖZELRŐL: a szobának csak az a része, ahol a bútor áll (bolt-polc rajzterv B pont);
       az egész szoba a cédulán látszik. A kivágás a „hova kerül" tábla foltja köré készül. */
    var f = BOLT_ODU_FOLT["b:" + cs.kulcs] || [340, 300, 300, 240];
    var hw = Math.max(f[2] * 1.25, 50), hh = hw * 72 / 76;
    if (hh < f[3] * 1.25) { hh = f[3] * 1.25; hw = hh * 76 / 72; }
    var o = butorPreviewOdu(cs.kulcs, t.id); o.napszak = "del";   /* nappali fényben, mint a táblán */
    var kid = "boltkozel-" + ODU_FUL + "-" + idx;   /* a játék CSS-e a belső svg-ket nem vágja → saját vágómaszk */
    s += '<rect x="' + (x - 42) + '" y="' + (ty - 84) + '" width="84" height="84" rx="7" fill="#f7ecd8" stroke="#c9a06a" stroke-width="2.6"/>' +
      '<defs><clipPath id="' + kid + '"><rect x="' + (x - 38) + '" y="' + (ty - 78) + '" width="76" height="72" rx="5"/></clipPath></defs>' +
      '<g clip-path="url(#' + kid + ')"><svg x="' + (x - 38) + '" y="' + (ty - 78) + '" width="76" height="72" viewBox="' + (f[0] - hw) + ' ' + (f[1] - hh) + ' ' + (2 * hw) + ' ' + (2 * hh) + '" preserveAspectRatio="xMidYMid slice">' +
      oduSVG(mentes.leny, o, true).replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "") + '</svg></g>';
  } else if (cs.fajta === "ido") {
    var belso = boltThumbBelso(cs, t);
    /* a szoba- és ég-minta nem tárgy: keretezett bolti minta, ami a polcon áll */
    var cid = "boltkeret-" + ODU_FUL + "-" + idx;
    s += '<g transform="translate(' + x + ',' + ty + ')">' +
      '<defs><clipPath id="' + cid + '"><rect x="-38" y="-78" width="76" height="72" rx="5"/></clipPath></defs>' +
      '<rect x="-42" y="-84" width="84" height="84" rx="7" fill="#f7ecd8" stroke="#c9a06a" stroke-width="2.6"/>' +
      '<g clip-path="url(#' + cid + ')"><g transform="translate(0,-42)"><g data-fit="76,72" data-fit-mod="kozep">' + belso + '</g></g></g>' +
      '</g>';
  } else {
    s += '<g transform="translate(' + x + ',' + ty + ')"><g data-fit="78,80">' + boltThumbBelso(cs, t) + '</g></g>';
  }
  if (kival) {
    s += '<path d="M' + (x - 34) + ' ' + (ty - 74) + ' l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6 Z" fill="#ffe08a"/>';
    s += '<path d="M' + (x + 38) + ' ' + (ty - 42) + ' l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/>';
  }
  /* lógó árcédula a polc éléről */
  var ar = (t.ar === 0) ? "alap" : (t.ar + " " + boltValuta(cs, t)), w = kival ? 46 : 42;
  /* ✨ = krém/arany cédula, 💧 = halványkék (bolt-polc rajzterv) */
  var c = harmatTetel(cs, t)
    ? { szal: kival ? "#2f7fa6" : "#8fc6e6", fill: kival ? "#d4eefc" : "#e3f4fd", keret: kival ? "#2f7fa6" : "#8fc6e6", szo: "#2f6f96" }
    : { szal: kival ? "#ffb300" : "#c9a06a", fill: kival ? "#fff3cf" : "#fdf4d8", keret: kival ? "#ffb300" : "#e6d3a8", szo: "#7a5a2a" };
  s += '<g class="bolt-cedula">' +
    '<path d="M' + x + ' ' + (y + 19) + ' v9" stroke="' + c.szal + '" stroke-width="' + (kival ? 1.8 : 1.4) + '"/>' +
    '<rect x="' + (x - w / 2) + '" y="' + (y + 28) + '" width="' + w + '" height="20" rx="6" fill="' + c.fill + '" stroke="' + c.keret + '" stroke-width="' + (kival ? 2 : 1.3) + '"/>' +
    '<text x="' + x + '" y="' + (y + 42) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + c.szo + '">' + ar + '</text></g>';
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
  /* fülek: lógó fatáblák (7 fül → kicsit keskenyebbek, hogy a cédula előtt elférjenek) */
  BOLT_FULEK.forEach(function (f, i) {
    var akt = (f.id === ODU_FUL), fx = 58 + i * 74;
    s += '<g class="bolt-ful-jel"' + (akt ? "" : ' opacity="0.62"') + '>' +
      '<path d="M' + (fx + 33) + ' 118 v10" stroke="#8f6a3e" stroke-width="2"/>' +
      '<rect x="' + fx + '" y="128" width="66" height="26" rx="7" fill="' + (akt ? "#e0b47e" : "#d3c0ea") + '" stroke="' + (akt ? "#8f6a3e" : "#a88fce") + '" stroke-width="' + (akt ? 1.8 : 1.5) + '"/>' +
      '<text x="' + (fx + 33) + '" y="146" font-size="11.5" font-weight="700" fill="' + (akt ? "#4a3b2a" : "#6a5f88") + '" text-anchor="middle">' + f.nev + '</text></g>';
  });
  /* a polc neve (melyik csoportban vagyunk) */
  /* felső polc */
  s += '<rect x="70" y="250" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="263" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 269 l0 12 M508 269 l0 12" stroke="#c19a72" stroke-width="5"/>';
  /* a tárgyak — a felső polcra tartozók */
  var helyek = o ? o.helyek : [], also = "";
  if (o) o.tablak.forEach(function (tb) { if (tb.felso) s += boltHovaTabla(tb.kulcs, true); else also += boltHovaTabla(tb.kulcs, false); });
  if (o) o.tetelek.forEach(function (e, i) {
    var kival = !!(k && k.cs.kulcs === e.cs.kulcs && String(k.t.id) === String(e.t.id));
    var darab = boltPolcTargy(e.cs, e.t, helyek[i], kival, i);
    if (helyek[i].felso) s += darab; else also += darab;
  });
  /* alsó polc */
  s += '<rect x="70" y="430" width="470" height="13" rx="3" fill="#d9b48a"/>';
  s += '<rect x="70" y="443" width="470" height="6" rx="2" fill="#c19a72"/>';
  s += '<path d="M100 449 l0 12 M508 449 l0 12" stroke="#c19a72" stroke-width="5"/>';
  s += bagolyRajz("boltos", !k ? "nyugalmi" : (boltKivalHelye(o, k, helyek) ? "fel" : "oldal"));
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
    (ODU_FUL === "kert" ? '<text x="' + (84 + String(P().csillampor).length * 10 + 22) + '" y="513" font-size="15.5" font-weight="800" fill="#bfe6fb">💧 ' + (P().tunderharmat || 0) + '</text>' : "") +
    (BOLT_LAPSZAM ? '<text x="440" y="513" font-size="12.5" font-weight="700" fill="#fdf0d0" text-anchor="middle" opacity="0.8">' + BOLT_LAPSZAM + '</text>' : "") + '</g>';
  /* ── legfelső réteg: a láthatatlan találati zónák (a tárgyak szabálytalanok) ── */
  if (o) o.tetelek.forEach(function (e, i) {
    var h = helyek[i];
    s += '<rect class="bolt-fogo" x="' + (h.x - 48) + '" y="' + (h.y - 92) + '" width="96" height="140" fill="transparent"' +
      ' data-mit="valaszt" data-g="' + e.cs.kulcs + '" data-id="' + e.t.id + '"/>';
  });
  BOLT_FULEK.forEach(function (f, i) {
    s += '<rect class="bolt-fogo" x="' + (58 + i * 74) + '" y="118" width="66" height="40" fill="transparent" data-mit="ful" data-ful="' + f.id + '"/>';
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
/* ── „hova kerül" tábla a polc bal végén (bolt-polc rajzterv, 2026-10-01) ──
   A gyerek SAJÁT szobája (vagy unikornisa) elhalványítva; csak az a hely világít, ahová a
   tárgy kerül. Rózsaszín, ferde, karón áll — hogy ne lehessen árunak nézni. */
/* a hely az odúban (680×540-es odú-koordináta): [cx, cy, rx, ry]
   (az asztal a makettben 345-ön állt, de az odú a bútor-asztalt translate(115,0)-val rajzolja → 460) */
var BOLT_ODU_FOLT = {
  "b:fal": [340, 215, 250, 120], "b:ablak": [190, 180, 82, 82], "b:fuggony": [190, 176, 96, 88],
  "b:agy": [140, 418, 72, 42], "b:kalyha": [546, 398, 52, 64], "b:polc": [470, 288, 62, 34],
  "b:asztal": [460, 404, 82, 36], "b:szonyeg": [340, 488, 176, 50], "b:fuzer": [340, 128, 250, 34],
  "d:fal-bal": [145, 268, 46, 46], "d:fal-jobb": [500, 205, 46, 46], "d:mennyezet": [410, 128, 52, 42],
  "d:ablak": [205, 200, 64, 78], "d:asztal": [458, 380, 46, 36], "d:polc": [470, 284, 60, 34],
  "d:agy": [145, 398, 64, 36], "d:padlo-bal": [180, 488, 48, 36], "d:padlo-jobb": [510, 488, 48, 36]
};
/* a testrész az unikornison (380×300-as figura-koordináta) */
var BOLT_UNI_FOLT = {
  fej: [292, 92, 56, 50], nyak: [252, 146, 34, 40], hat: [196, 122, 74, 26],
  lab: [190, 252, 110, 42], oldal: [176, 182, 64, 40], farok: [76, 196, 46, 66]
};
var BOLT_TABLA_N = 0;   /* egyedi mask/clip azonosítókhoz */
/* melyik csoport kap táblát: bútor, dísz (a szobában), ruha (az unikornison) */
function boltTablaKulcs(cs) {
  if (cs.fajta === "butor" && BOLT_ODU_FOLT["b:" + cs.kulcs]) return "b:" + cs.kulcs;
  if (cs.fajta === "disz" && BOLT_ODU_FOLT["d:" + cs.kulcs]) return "d:" + cs.kulcs;
  if (cs.fajta === "ruha" && BOLT_UNI_FOLT[cs.kulcs]) return "u:" + cs.kulcs;
  /* a Kert fülön a hely helyett a PÉNZ a különbség: ✨ vagy 💧 tábla */
  if ((cs.fajta === "kert" || cs.fajta === "kertdisz") && cs.tetelek[0]) return "v:" + boltValuta(cs, cs.tetelek[0]);
  return null;
}
/* a rajz elhalványítva, csak a folt világít + arany gyűrű */
function boltReflektor(belso, vb, folt, x, y, w, h) {
  var id = "bolt-rf" + (++BOLT_TABLA_N);
  return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" overflow="hidden">' +
    belso +
    '<defs><mask id="' + id + '"><rect x="-50" y="-50" width="2000" height="2000" fill="#fff"/>' +
    '<ellipse cx="' + folt[0] + '" cy="' + folt[1] + '" rx="' + folt[2] + '" ry="' + folt[3] + '" fill="#000"/></mask></defs>' +
    '<rect x="-50" y="-50" width="2000" height="2000" fill="#4a3b7a" opacity="0.5" mask="url(#' + id + ')"/>' +
    '<ellipse cx="' + folt[0] + '" cy="' + folt[1] + '" rx="' + folt[2] + '" ry="' + folt[3] + '" fill="none" stroke="#ffd24d" stroke-width="' + (vb.indexOf("600") > 0 ? 9 : 6) + '"/>' +
    '</svg>';
}
function boltHovaTabla(kulcs, felso) {
  /* felül nagyobb tábla; alul kisebb, a bagoly és a tárgyak között */
  var x = felso ? 84 : 194, y = felso ? 168 : 370, w = felso ? 84 : 70, h = felso ? 64 : 50;
  var talp = felso ? BOLT_POLC_FELSO : BOLT_POLC_ALSO, kep;
  if (kulcs.charAt(0) === "v") {
    /* nagy ✨ vagy 💧 a táblán */
    kep = '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 80 64" preserveAspectRatio="xMidYMid slice">' +
      (kulcs === "v:💧"
        ? '<rect width="80" height="64" fill="#e3f4fd"/><path d="M40 8 Q56 30 56 40 Q56 54 40 54 Q24 54 24 40 Q24 30 40 8 Z" fill="#8fd0f2" stroke="#2f7fa6" stroke-width="2"/><ellipse cx="34" cy="40" rx="4" ry="7" fill="#fff" opacity="0.6"/>'
        : '<rect width="80" height="64" fill="#fff6d8"/><path d="M40 10 l6 15 l15 6 l-15 6 l-6 15 l-6 -15 l-15 -6 l15 -6 Z" fill="#ffd24d" stroke="#e0a82e" stroke-width="2"/><path d="M62 12 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/>') +
      '</svg>';
  } else if (kulcs.charAt(0) === "u") {
    kep = boltReflektor('<rect width="380" height="300" fill="#fdf4e2"/><g transform="translate(190,272) scale(2)">' +
      unikornisSVG("bolt-tb" + (BOLT_TABLA_N + 1), LENYEK[mentes.leny], 1, {}) + '</g>', "0 0 380 300", BOLT_UNI_FOLT[kulcs.slice(2)], x, y, w, h);
  } else {
    var o = JSON.parse(JSON.stringify(P().odu));   /* a gyerek saját szobája, nappali fényben */
    o.napszak = "del";
    kep = boltReflektor(oduSVG(mentes.leny, o, true).replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""),
      "40 70 600 470", BOLT_ODU_FOLT[kulcs], x, y, w, h);
  }
  var cid = "bolt-tk" + (++BOLT_TABLA_N), cx = x + w / 2;
  return '<g class="bolt-hova-tabla" pointer-events="none">' +
    '<ellipse cx="' + cx + '" cy="' + talp + '" rx="10" ry="3" fill="#3b2f66" opacity="0.18"/>' +
    '<rect x="' + (cx - 4) + '" y="' + (y + h) + '" width="8" height="' + (talp - y - h) + '" rx="2" fill="#c19a72" stroke="#8f6a3e" stroke-width="1.2"/>' +
    '<g transform="rotate(-4 ' + cx + ' ' + (y + h / 2) + ')">' +
    '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="' + (w + 12) + '" height="' + (h + 12) + '" rx="12" fill="#f6a5c0" stroke="#d9789f" stroke-width="2.2"/>' +
    '<circle cx="' + (x - 1) + '" cy="' + (y - 1) + '" r="2.2" fill="#fff2c4"/><circle cx="' + (x + w + 1) + '" cy="' + (y - 1) + '" r="2.2" fill="#fff2c4"/>' +
    '<defs><clipPath id="' + cid + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7"/></clipPath></defs>' +
    '<g clip-path="url(#' + cid + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fdf4e2"/>' + kep + '</g>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="none" stroke="#fff2c4" stroke-width="1.6"/>' +
    '</g></g>';
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
            : (cs.fajta === "kert" ? (t.id === "eves" ? "új képesség" : "trükk a kertben")
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
  { id: "butorok", nev: "Bútorok" }, { id: "diszek", nev: "Díszek" }, { id: "ido", nev: "Időjárás" },
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
  /* a régi Kellékek fül kettévágva (bolt-polc rajzterv, 2026-10-01): amit lecserélsz | amit hozzáteszel */
  if (ODU_FUL === "butorok")
    return BUTOR_HELY.map(function (h) { return { kulcs: h.kulcs, nev: h.nev, fajta: "butor", tetelek: ODU_BUTOR[h.kulcs] || [] }; });
  /* az „Üres" nem tárgy, nem áll a polcon — a kint lévő dísz céduláján „Leszedem" gomb van helyette */
  if (ODU_FUL === "diszek")
    return DISZ_ZONA.map(function (z) { return { kulcs: z.kulcs, nev: z.nev, fajta: "disz", tetelek: diszZonaTetelek(z.kulcs).filter(function (t) { return t.id !== "nincs"; }) }; });
  if (ODU_FUL === "kristaly")
    return [{ kulcs: "vitrin", nev: "Kincsvitrin", fajta: "vitrin", tetelek: KRISTALY }];
  if (ODU_FUL === "kert") {
    /* a kert ingyenes (nincs kulcs): a séta-trükkök (💧) egy polcon, utánuk a berendezési tárgyak (darabra, 💧-ért) */
    return [{ kulcs: "kert", nev: "Kert", fajta: "kert", tetelek: KERT_BOLT }].concat(kertTargyBoltCsoportok());
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
  if (cs.fajta === "kert") return !!P().kert.trukkok[t.id];
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
  /* hát-takarók: ugyanaz a rajz, mint az unikornison (renderer.js HAT_DISZ), rúdra akasztva */
  "hat-a": '<rect x="14" y="30" width="182" height="8" rx="4" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><circle cx="18" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/><circle cx="192" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/>' + '<g transform="translate(105 36) scale(1.2) translate(-155 -103)">' + HAT_DISZ["hat-a"] + '</g>',
  "hat-k": '<rect x="14" y="30" width="182" height="8" rx="4" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><circle cx="18" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/><circle cx="192" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/>' + '<g transform="translate(105 36) scale(1.2) translate(-155 -103)">' + HAT_DISZ["hat-k"] + '</g>',
  "hat-r": '<rect x="14" y="30" width="182" height="8" rx="4" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><circle cx="18" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/><circle cx="192" cy="34" r="6" fill="#c9a07a" stroke="#222" stroke-width="1.2"/>' + '<g transform="translate(105 36) scale(1.2) translate(-155 -103)">' + HAT_DISZ["hat-r"] + '</g>',
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
  /* szárnyak: ugyanaz a rajz, mint az unikornison (renderer.js SZARNY_DISZ), kis fa tartón állva */
  "oldal-a": '<path d="M150 172 h58 v8 h-58 Z" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><path d="M179 172 v-9" stroke="#c9a07a" stroke-width="5" stroke-linecap="round"/>' + '<g transform="translate(102 100) scale(1.2) translate(-100 -56)">' + SZARNY_DISZ["oldal-a"] + '</g>',
  "oldal-k": '<path d="M150 172 h58 v8 h-58 Z" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><path d="M179 172 v-9" stroke="#c9a07a" stroke-width="5" stroke-linecap="round"/>' + '<g transform="translate(102 100) scale(1.2) translate(-100 -56)">' + SZARNY_DISZ["oldal-k"] + '</g>',
  "oldal-r": '<path d="M150 172 h58 v8 h-58 Z" fill="#d9b48a" stroke="#222" stroke-width="1.4"/><path d="M179 172 v-9" stroke="#c9a07a" stroke-width="5" stroke-linecap="round"/>' + '<g transform="translate(102 100) scale(1.2) translate(-100 -56)">' + SZARNY_DISZ["oldal-r"] + '</g>',
  /* farokdíszek: ugyanaz a rajz, mint az unikornison (renderer.js FAROK_DISZ), kampóra akasztva, nagyítva */
  "farok-a": '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' + '<g transform="translate(105 40) scale(2) translate(-63 -180)">' + FAROK_DISZ["farok-a"] + '</g>',
  "farok-k": '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' + '<g transform="translate(105 40) scale(2.2) translate(-62 -186)">' + FAROK_DISZ["farok-k"] + '</g>',
  "farok-r": '<path d="M105 22 v14 M105 22 q-8 0 -8 -8" stroke="#b79fd4" stroke-width="3" fill="none" stroke-linecap="round"/>' + '<g transform="translate(108 30) scale(1.32) translate(-56 -181)">' + FAROK_DISZ["farok-r"] + '</g>'
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
  "oldal-a": "Hófehér, pihe-puha tollszárny.", "oldal-k": "Minden tolla más szivárványszín.", "oldal-r": "Aranyvégű, ragyogó tollszárny.",
  "farok-a": "Szalagcsokor a farok tövére.", "farok-k": "Csengettyűk, halkan csilingelnek.", "farok-r": "Fénycsóvás üstökös-farok.",
  "este": "Csendes esti égbolt, telihold.", "reggel": "Rózsás hajnal, puha felhők.", "del": "Ragyogó déli napsütés.", "eclipse": "Ritka napfogyatkozás, csillagokkal.",
  "tiszta": "Derült, felhőtlen idő.", "eso": "Szelíd eső kopog az ablakon.", "ho": "Nagy pihékben hull a hó.", "szivarvany": "Eső után szivárvány ível az égen.",
  "k-gomb": "Fénytörő kristálygömb — a vitrin dísze.", "k-roka": "Csiszolt kristályróka figura.", "k-bagoly": "Csiszolt kristálybagoly figura.",
  "k-terkep": "Pici csillagtérkép-gömb, benne az égbolt.", "k-zene": "Zenélő doboz forgó unikornissal.", "k-lampas": "Meleg fényű tündérlámpás.",
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


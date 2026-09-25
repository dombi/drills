/* ============ 12h) FEJTÖRŐ-HEGY — versenyfeladat-állomások (Zrínyi-állomás, tesztpálya) ============
   Rendszerterv: Matekos\zrinyi-allomas-rendszerterv.html · tartalom: zrinyi-allomas-tartalom.html
   Egy állomás = egy eredeti versenyfeladat (A–E). A feladatszöveg SOHA nem íródik át — csak a segítség
   és a magyarázat alakítható. A szövegek a FELHŐBEN vannak (a repó nyilvános):
     versenyFeladatok/{id} = { verseny, ev, osztaly, fordulo, sorszam, szoveg, valaszok{A..E}, helyes, valaszMod,
                               kerdes{kiemel[], mondat}, lepesek[{szoveg, muvelet, eredmeny, kepSvg?}],
                               csapdak{betű:{mondat, csalad}}, osszefoglalo[], trukk, felolvasCsere? }
     versenyPalyak/{id}    = { nev, ikon, liget:"fejtoro", sorrend, feladatok:[id…] }
   Olvasni csak belépett játékos tud, írni csak a pult (firestore.rules). Belépés nélkül a liget nem látszik.
   Menet: ✏️ papír-ceruza → (🔁 visszatérők) → állomások fix sorrendben → pálya vége (✨ + 💧).
   Válasz: koppintás = azonnal érvényes (nincs „Biztos?”, nincs 2. próba). 🙋 fokozatos segítség válasz ELŐTT:
   1. „Mit kérdeznek?”, aztán a megoldás lépései egyenként — MIND, a füzetlap minden sora (a betűt a gyerek koppintja).
   Rossz válasz → csapda-mondat (a helyes betű nélkül) → „Mit kérdeznek?” → minden lépés → füzet-összefoglaló + trükk.
   Rossz vagy segítséggel jó → a feladat egy KÉSŐBBI napon „🔁 Emlékszel erre?” állomásként visszajön.
   Nincs időmérő a gyereknek; a gondolkodási időt csak a pult látja (events: fejtoro_valasz). */
var FT_ALLOMAS_CSILLA = 5;     /* minden befejezett állomás (segítséggel / magyarázattal is) */
var FT_ELSORE_PLUSZ = 3;       /* + elsőre jó, segítség nélkül */
var FT_ZARO_CSILLA = 10;       /* pálya vége */
var FT_ZARO_HARMAT = 2;        /* 1 + teljes ösvény (itt nincs kerülő, így mindig teljes) */
var FT_VISSZA_MAX = 2;         /* ennyi visszatérő feladat jön egy pálya elé */
var FT_BETUK = ["A", "B", "C", "D", "E"];

var FT = { feladatok: {}, palyak: [], helyi: false, leir: [] };
var FTJ = null;                /* a futó pálya: { pa, sor:[{fid, vissza}], i, csilla, osszes, elsore, indult } */

/* ── adat: élő figyelés belépés után (felhoBelepve hívja) ── */
function fejtoroFigyel() {
  fejtoroLeiratkozik();
  var db = FELHO.db;
  function hiba(e) { console.warn("[fejtörő] betöltés hiba:", e.code || e); }
  FT.leir.push(db.collection("versenyPalyak").onSnapshot(function (snap) {
    var l = [];
    snap.forEach(function (d) { var x = d.data(); x.id = d.id; if (x.aktiv !== false && x.liget === "fejtoro") l.push(x); });
    l.sort(function (a, b) { return (a.sorrend || 0) - (b.sorrend || 0); });
    FT.palyak = l; fejtoroFrissul();
  }, hiba));
  /* most minden feladat letöltődik (a tesztpálya 7 feladat); sok száz feladatnál pályánként kell majd kérni */
  FT.leir.push(db.collection("versenyFeladatok").onSnapshot(function (snap) {
    var m = {}; snap.forEach(function (d) { m[d.id] = d.data(); });
    FT.feladatok = m; fejtoroFrissul();
  }, hiba));
}
function fejtoroLeiratkozik() { FT.leir.forEach(function (f) { try { f(); } catch (e) {} }); FT.leir = []; }
/* teszthez / felhő nélkül: a pult JSON-fájljának tartalma közvetlenül */
function fejtoroBetoltHelyi(adat) {
  FT.helyi = true; FT.feladatok = {}; FT.palyak = [];
  (adat.feladatok || []).forEach(function (f) { FT.feladatok[f.id] = f; });
  (adat.palyak || []).forEach(function (p) { FT.palyak.push(p); });
  fejtoroFrissul();
}
function fejtoroFrissul() {
  var fm = $("kepernyo-fomenu");
  if (fm && fm.classList.contains("aktiv")) renderFomenu();
}
/* a menüben látható pályák: csak belépve, és csak aminek megvan legalább egy feladata */
function fejtoroPalyak() {
  if (!FT.helyi && !FELHO.aktiv) return [];
  return FT.palyak.filter(function (p) { return ftPalyaFeladatok(p).length > 0; });
}
function ftPalyaFeladatok(pa) { return (pa.feladatok || []).filter(function (id) { return !!FT.feladatok[id]; }); }
function ftAllapot() { var p = P(); if (!p.fejtoro) p.fejtoro = { palyak: {}, vissza: {} }; return p.fejtoro; }
function ftMa() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate(); }
/* esedékes visszatérők: amit egy KORÁBBI napon rontott el / segítséggel oldott meg */
function ftEsedekesVissza() {
  var v = ftAllapot().vissza, ma = ftMa();
  return Object.keys(v).filter(function (id) { return FT.feladatok[id] && v[id].nap < ma; })
    .sort(function (a, b) { return v[a].nap < v[b].nap ? -1 : v[a].nap > v[b].nap ? 1 : 0; });
}

/* ── menü: a „🏔️ Fejtörő-hegy” liget kártyája ── */
var FEJTORO_HATTER = '<svg class="hatter" viewBox="0 0 1120 760" preserveAspectRatio="none" aria-hidden="true">' +
  '<defs><linearGradient id="ftg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfeefc"/><stop offset="1" stop-color="#f4ecfb"/></linearGradient></defs>' +
  '<rect width="1120" height="760" fill="url(#ftg)"/>' +
  '<path d="M0 760 L0 520 L180 330 L300 450 L520 170 L700 420 L820 300 L1120 560 L1120 760 Z" fill="#d9d0ef"/>' +
  '<path d="M470 235 L520 170 L570 238 L545 225 L520 245 L495 226 Z" fill="#fff"/>' +
  '<path d="M0 760 L0 610 L260 470 L480 590 L760 440 L1120 640 L1120 760 Z" fill="#cfe8d4"/>' +
  '<path d="M140 760 C260 680 380 700 480 640 C580 580 640 560 760 500" stroke="#f3e2b8" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="2 34"/>' +
  '</svg>';
function fejtoroKartya(pa) {
  var st = ftAllapot().palyak[pa.id] || {}, n = ftPalyaFeladatok(pa).length, poz = Math.min(st.poz || 0, n);
  var vDb = ftEsedekesVissza().length;
  var kart = el("div", "palya-kartya ft-kartya" + (st.kesz ? " kesz" : ""));
  kart.innerHTML =
    '<div class="allapot">' + (st.kesz ? "⭐" : "") + '</div>' +
    (vDb ? '<div class="napi-badge" title="Visszatérő feladat">🔁</div>' : '') +
    '<div class="ikon">' + (pa.ikon || "🏔️") + '</div>' +
    '<div class="pnev">' + kiiras(pa.nev || "Fejtörő-ösvény") + '</div>' +
    '<div class="palcim">' + n + ' fejtörő' + (poz ? ' · ' + poz + '/' + n + ' kész' : '') + '</div>' +
    '<div class="also"><span class="jutalom">✨ + 💧</span><button class="palya-felolvas" title="Olvasd fel">🔊</button></div>';
  kart.addEventListener("click", function () { hangGomb(); fejtoroInditas(pa.id); });
  kart.querySelector(".palya-felolvas").addEventListener("click", function (e) {
    e.stopPropagation(); hangGomb();
    ftMondd(kiiras(pa.nev || "Fejtörő-ösvény") + ". " + n + " versenyfeladat. Papírral és ceruzával kell megoldani, és nem kell sietni." +
      (poz ? " Ott folytatod, ahol abbahagytad." : "") + (vDb ? " Vár rád egy régi ismerős feladat is!" : ""));
  });
  return kart;
}

/* ── pálya indítása ── */
function fejtoroInditas(pid) {
  var pa = null;
  FT.palyak.forEach(function (p) { if (p.id === pid) pa = p; });
  if (!pa) return;
  var ids = ftPalyaFeladatok(pa), all = ftAllapot();
  var st = all.palyak[pid] || (all.palyak[pid] = { poz: 0, kesz: 0 });
  if ((st.poz || 0) >= ids.length) st.poz = 0;
  /* visszatérők a pálya ELŐTT; ha ezen a pályán is sorra kerülne, a futásban nem jön még egyszer */
  var visz = ftEsedekesVissza().slice(0, FT_VISSZA_MAX);
  var sor = visz.map(function (id) { return { fid: id, vissza: true }; });
  ids.forEach(function (id, i) { if (i >= (st.poz || 0) && visz.indexOf(id) < 0) sor.push({ fid: id, vissza: false, idx: i }); });
  FTJ = { pa: pa, ids: ids, sor: sor, i: 0, csilla: 0, osszes: 0, elsore: 0, indult: Date.now() };
  sorozatMegtor();
  $("ft-cim").textContent = kiiras(pa.nev || "Fejtörő-hegy");
  $("ft-csillampor").textContent = P().csillampor;
  ment();
  esemeny("palya_start", { palyaId: pid, fejtoro: true, poz: st.poz || 0, vissza: visz.length });
  mutat("kepernyo-fejtoro");
  ftPapir();
}
function ftTartalom() { var t = $("ft-tartalom"); t.innerHTML = ""; t.scrollTop = 0; return t; }
function ftPapir() {
  var t = ftTartalom();
  ftKovek(null);
  var k = el("div", "ft-kartya ft-papir");
  k.innerHTML = '<div class="ft-papir-ikon">✏️📄</div><h2>Vegyél elő papírt és ceruzát!</h2>' +
    '<p>A fejtörőket papíron számold ki, ahogy a versenyen. Nem kell sietni — gondolkodj nyugodtan!</p>';
  var b = el("button", "nagy-gomb kiemelt", "✅ Megvan!");
  b.addEventListener("click", function () { hangGomb(); ftKovetkezo(); });
  k.appendChild(b); t.appendChild(k);
  ftMondd("Vegyél elő papírt és ceruzát! A fejtörőket papíron számold ki, ahogy a versenyen. Nem kell sietni. Ha megvan, koppints a Megvan gombra!");
}
/* haladás-kövek a pálya tetején (a visszatérő állomásnál 🔁) */
function ftKovek(akt) {
  var h = FTJ.ids.map(function (id, i) {
    var st = ftAllapot().palyak[FTJ.pa.id] || {}, kesz = i < (st.poz || 0);
    return '<span class="ft-ko' + (kesz ? " kesz" : "") + (akt && !akt.vissza && akt.idx === i ? " most" : "") + '">' + (i + 1) + '</span>';
  }).join("");
  $("ft-kovek").innerHTML = (akt && akt.vissza ? '<span class="ft-ko vissza most">🔁</span>' : '') + h;
}
function ftKovetkezo() {
  if (FTJ.i >= FTJ.sor.length) { ftVege(); return; }
  ftAllomas(FTJ.sor[FTJ.i]);
}

/* ── egy állomás ── */
function ftFelolvasSzoveg(f) {
  var s = f.szoveg;
  (f.felolvasCsere || []).forEach(function (c) { if (c && c.mit) s = s.split(c.mit).join(c.mire); });
  return s + " A válaszok: " + FT_BETUK.map(function (b) { return b + ": " + f.valaszok[b]; }).join(", ") + ".";
}
/* felolvasás: a szám utáni pontot a gép sorszámnak olvassa („50.” → „ötvenedik”) — ezért kivesszük */
function ftKiejt(s) { return String(s).replace(/(\d)\.(?=\s|$|[”"'])/g, "$1"); }
function ftMondd(s, kesz) { mondd(ftKiejt(s), kesz); }
function ftEsc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function ftKiemel(szoveg, szavak) {
  var h = ftEsc(szoveg);
  (szavak || []).slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (w) {
    var e = ftEsc(w); h = h.split(e).join("\u0001" + e + "\u0002");
  });
  return h.replace(/\u0001/g, "<mark>").replace(/\u0002/g, "</mark>");
}
function ftAllomas(tetel) {
  var f = FT.feladatok[tetel.fid];
  var A = FTJ.a = { f: f, tetel: tetel, segit: 0, lepesDb: 0, lepesHiba: 0, kezd: Date.now(), valaszolt: false, fuggo: false };
  ftKovek(tetel);
  var t = ftTartalom();
  if (tetel.vissza) t.appendChild(el("div", "ft-vissza-cim", "🔁 Emlékszel erre? Próbáld meg újra!"));
  var fk = el("div", "ft-kartya ft-feladat");
  fk.innerHTML = '<div class="ft-szoveg" id="ft-szoveg">' + ftEsc(f.szoveg) + '</div>';
  t.appendChild(fk);
  var vs = el("div", "ft-valaszok"); vs.id = "ft-valaszok";
  FT_BETUK.forEach(function (b) {
    var g = el("button", "ft-betu");
    g.dataset.b = b;
    g.innerHTML = '<b>' + b + '</b><span>' + ftEsc(f.valaszok[b]) + '</span>';
    g.addEventListener("click", function () { ftValasz(b); });
    vs.appendChild(g);
  });
  t.appendChild(vs);
  var seg = el("div", "ft-segitseg"); seg.id = "ft-segit"; t.appendChild(seg);
  var also = el("div", "ft-also"); also.id = "ft-also";
  var fel = el("button", "kis-gomb", "🔊 Olvasd fel újra");
  fel.addEventListener("click", function () { hangGomb(); ftMondd(ftFelolvasSzoveg(f)); });
  var sg = el("button", "kis-gomb ft-segit-gomb", "🙋 Segítséget kérek"); sg.id = "ft-segit-gomb";
  sg.addEventListener("click", function () { hangGomb(); ftSegit(); });
  also.appendChild(fel); also.appendChild(sg); t.appendChild(also);
  ftMondd((tetel.vissza ? "Emlékszel erre? Próbáld meg újra! " : "") + ftFelolvasSzoveg(f));
}
/* 🙋 fokozatos segítség: 1 = Mit kérdeznek?, 2.. = a lépések egyenként — mind (producer, 2026-09-25: ne maradjon ki semmi) */
function ftSegitMaxSzint(f) { return 1 + f.lepesek.length; }
function ftSegitGombAllit() {
  var A = FTJ.a, g = $("ft-segit-gomb");
  if (!g) return;
  var van = A.segit < ftSegitMaxSzint(A.f);
  g.hidden = !van || A.fuggo || A.valaszolt;
  if (!van && !A.valaszolt && !A.fuggo && !$("ft-te-jossz")) {
    var m = el("div", "ft-te-jossz", "Most már te jössz! Melyik betű a jó?"); m.id = "ft-te-jossz";
    $("ft-segit").appendChild(m);
    ftMondd("Most már te jössz! Melyik betű a jó?");
  }
}
function ftSegit() {
  var A = FTJ.a, f = A.f;
  if (A.valaszolt || A.fuggo || A.segit >= ftSegitMaxSzint(f)) return;
  A.segit++;
  if (A.segit === 1) {
    ftKerdesKartya(f, $("ft-segit"), null);
    ftSegitGombAllit();
    return;
  }
  var li = A.segit - 2;
  A.fuggo = true; ftSegitGombAllit();
  ftLepesKartya(f.lepesek[li], li, $("ft-segit"), function () {
    A.fuggo = false; A.lepesDb = li + 1; ftSegitGombAllit();
  });
}
/* „Mit kérdeznek?” — kiemeli a kulcsszavakat az EREDETI szövegben, és kimondja, mire kell a végén válaszolni */
function ftKerdesKartya(f, hova, tovabb) {
  $("ft-szoveg").innerHTML = ftKiemel(f.szoveg, f.kerdes && f.kerdes.kiemel);
  var k = el("div", "ft-kartya ft-kerdes");
  k.innerHTML = '<div class="ft-lepes-fej">🔎 Mit kérdeznek?</div><p>' + ftEsc(f.kerdes && f.kerdes.mondat) + '</p>';
  if (tovabb) {
    var b = el("button", "nagy-gomb kiemelt", "Értem! ➜");
    b.addEventListener("click", function () { hangGomb(); b.remove(); tovabb(); });
    k.appendChild(b);
  }
  hova.appendChild(k);
  ftGorget(k);
  ftMondd("Mit kérdeznek? " + (f.kerdes && f.kerdes.mondat || ""));
}
function ftGorget(elem) { setTimeout(function () { try { elem.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {} }, 60); }
/* művelet felolvasása: 6 − 1 = ? → „6 mínusz 1 egyenlő mennyi?” */
function ftMuveletFelolvas(m) {
  return String(m).replace(/−/g, " mínusz ").replace(/·/g, " szorozva ").replace(/ : /g, " osztva ")
    .replace(/\+/g, " meg ").replace(/=/g, " egyenlő ").replace(/\?/g, " mennyi?").replace(/→/g, ", ");
}
function ftSzamKi(szoveg) {
  var d = String(szoveg).match(/\d+/);
  if (d) return parseInt(d[0], 10);
  var n = elsoSzam(szoveg); return n == null ? null : n;
}
/* egy megoldás-lépés: a művelet felíródik, a gyerek kimondja vagy beírja az eredményt */
function ftLepesKartya(l, li, hova, kesz) {
  var k = el("div", "ft-kartya ft-lepes");
  var elotte = ftEsc(l.muvelet).split("?");
  k.innerHTML = '<div class="ft-lepes-fej">' + (li + 1) + '. lépés</div><p>' + ftEsc(l.szoveg) + '</p>' +
    (l.kepSvg ? '<div class="ft-kep">' + l.kepSvg + '</div>' : '') +
    '<div class="ft-muvelet">' + elotte[0] + '<span class="ft-ures">?</span>' + (elotte[1] || "") + '</div>' +
    '<div class="ft-lepes-valasz"></div><div class="ft-lepes-jel"></div>';
  var vz = k.querySelector(".ft-lepes-valasz"), jel = k.querySelector(".ft-lepes-jel"), ures = k.querySelector(".ft-ures");
  var cel = ftSzamKi(l.eredmeny), lezart = false;
  function lezar(jo, mit) {
    if (lezart) return; lezart = true;
    figyelStop();
    ures.textContent = l.eredmeny; ures.classList.add(jo ? "jo" : "mutat");
    vz.innerHTML = "";
    if (jo) { hangJo(); jel.textContent = "✅ Így van!"; ftMondd("Így van! " + l.eredmeny + ".", function () { kesz(true); }); }
    else {
      FTJ.a.lepesHiba++;
      jel.textContent = (mit != null ? "Majdnem! " : "") + "Nézd: " + l.eredmeny + ".";
      ftMondd((mit != null ? "Majdnem! " : "") + "Az eredmény: " + l.eredmeny + ".", function () { kesz(false); });
    }
  }
  if (cel == null) {   /* nem szám az eredmény: csak megmutatjuk */
    var mb = el("button", "kis-gomb", "Megnézem ➜");
    mb.addEventListener("click", function () { hangGomb(); lezar(true); });
    vz.appendChild(mb);
  } else {
    function ellenoriz(n) { if (n == null) return; lezar(n === cel, n); }
    if (beszedTamogatott) {
      var mg = el("button", "nagy-gomb mikrofon ft-mondom", "🎤 Mondom");
      mg.addEventListener("click", function () {
        if (lezart) return;
        hangGomb(); mg.classList.add("figyel"); jel.textContent = "hallgatlak…";
        figyelj(function (alt) {
          mg.classList.remove("figyel");
          var n = null;
          for (var i = 0; i < alt.length && n == null; i++) n = ftSzamKi(alt[i]);
          if (n == null) { jel.textContent = "Nem értettem. Mondd újra, vagy írd be!"; return; }
          ellenoriz(n);
        }, function () { mg.classList.remove("figyel"); jel.textContent = "Nem hallottam. Mondd újra, vagy írd be!"; });
      });
      vz.appendChild(mg);
    }
    var mezo = el("input", "ft-mezo");
    mezo.type = "text"; mezo.inputMode = "numeric"; mezo.autocomplete = "off"; mezo.placeholder = "⌨"; mezo.maxLength = 4;
    mezo.addEventListener("input", function () { mezo.value = mezo.value.replace(/[^0-9]/g, "").slice(0, 4); });
    var ok = el("button", "kis-gomb", "OK");
    function bekuld() { if (!lezart && mezo.value) ellenoriz(parseInt(mezo.value, 10)); }
    mezo.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); bekuld(); } });
    ok.addEventListener("click", function () { hangGomb(); bekuld(); });
    vz.appendChild(mezo); vz.appendChild(ok);
  }
  hova.appendChild(k);
  ftGorget(k);
  ftMondd(l.szoveg + " " + ftMuveletFelolvas(l.muvelet));
}

/* ── válasz: koppintás = azonnal érvényes ── */
function ftValasz(b) {
  var A = FTJ && FTJ.a;
  if (!A || A.valaszolt) return;
  var f = A.f;
  A.valaszolt = true;
  figyelStop();
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  /* egy félbehagyott segítség-lépés lezárul (a magyarázat onnan folytatja) */
  Array.prototype.forEach.call($("ft-segit").querySelectorAll(".ft-lepes-valasz"), function (x) { x.innerHTML = ""; });
  var jo = (b === f.helyes), c = (!jo && f.csapdak) ? f.csapdak[b] : null;
  var ido = Math.round((Date.now() - A.kezd) / 1000);
  Array.prototype.forEach.call($("ft-valaszok").children, function (g) {
    g.disabled = true;
    if (g.dataset.b === b) g.classList.add(jo ? "jo" : "rossz");   /* rossznál a helyes betű még NEM látszik */
  });
  var gs = $("ft-segit-gomb"); if (gs) gs.hidden = true;
  var tj = $("ft-te-jossz"); if (tj) tj.remove();
  A.elsore = jo && A.segit === 0;
  /* visszatérő lista: elsőre jó → lekerül; rossz vagy segítséggel jó → egy későbbi napon újra */
  var v = ftAllapot().vissza;
  if (A.elsore) delete v[A.tetel.fid];
  else { var fid = A.tetel.fid, reg = v[fid] || {}; v[fid] = { nap: ftMa(), db: (reg.db || 0) + 1 }; }
  FTJ.osszes++; if (A.elsore) FTJ.elsore++;
  esemeny("fejtoro_valasz", {
    feladatId: A.tetel.fid, palyaId: FTJ.pa.id, betu: b, helyes: f.helyes, jo: jo, segitseg: A.segit,
    lepesDb: A.lepesDb, csapda: c ? (c.csalad || "?") : null, idoMp: ido, vissza: !!A.tetel.vissza
  });
  ment();
  var hova = $("ft-segit");
  if (A.elsore) {
    hangJo();
    var k = el("div", "ft-kartya ft-dicser");
    k.innerHTML = '<div class="ft-nagy">🎉 Nagyszerű!</div><p>Elsőre, segítség nélkül!</p>';
    hova.appendChild(k); ftGorget(k);
    ftMondd("Nagyszerű! Elsőre, segítség nélkül sikerült!", function () { ftTovabbGomb(k); });
  } else if (jo) {
    hangJo();
    var k2 = el("div", "ft-kartya ft-dicser");
    k2.innerHTML = '<div class="ft-nagy">👏 Ügyes!</div><p>Segítséggel sikerült. Nézzük meg az egészet a füzetben!</p>';
    hova.appendChild(k2); ftGorget(k2);
    ftMondd("Ügyes! Segítséggel sikerült. Nézzük meg az egészet a füzetben!", function () { ftOsszefoglalo(); });
  } else {
    hangHiba();
    var mondat = c ? c.mondat : "Nézzük meg együtt, lépésről lépésre!";
    var k3 = el("div", "ft-kartya ft-csapda");
    k3.innerHTML = '<div class="ft-nagy">🤔 Ez most nem jó.</div><p>' + ftEsc(mondat) + '</p>';
    hova.appendChild(k3); ftGorget(k3);
    ftMondd("Ez most nem jó. " + mondat, function () { ftMagyarazat(); });
  }
}
/* végigvezetett magyarázat: Mit kérdeznek? → a még hátralévő lépések → összefoglaló */
function ftMagyarazat() {
  var A = FTJ.a, f = A.f, hova = $("ft-segit");
  function lepesek(i) {
    if (i >= f.lepesek.length) { ftOsszefoglalo(); return; }
    ftLepesKartya(f.lepesek[i], i, hova, function () { lepesek(i + 1); });
  }
  if (A.segit >= 1) lepesek(A.lepesDb);   /* amit a segítségben már végigcsinált, nem kérjük újra */
  else ftKerdesKartya(f, hova, function () { lepesek(0); });
}
function ftOsszefoglalo() {
  var A = FTJ.a, f = A.f, hova = $("ft-segit");
  Array.prototype.forEach.call($("ft-valaszok").children, function (g) { if (g.dataset.b === f.helyes) g.classList.add("helyes"); });
  var k = el("div", "ft-kartya ft-fuzet-kartya");
  k.innerHTML = '<div class="ft-lepes-fej">📓 A füzetben így néz ki</div><div class="ft-fuzet">' +
    (f.osszefoglalo || []).map(function (s) {
      return /^Válasz:/.test(s) ? '<b class="ft-valasz-sor">' + ftEsc(s) + '</b>' : ftEsc(s);
    }).join("<br>") + '</div>' +
    (f.trukk ? '<div class="ft-trukk">💡 ' + ftEsc(f.trukk) + '</div>' : '');
  hova.appendChild(k); ftGorget(k);
  ftMondd("A helyes válasz: " + f.helyes + ", " + f.valaszok[f.helyes] + ". " + (f.trukk ? "Jegyezd meg: " + f.trukk : ""), function () { ftTovabbGomb(k); });
}
function ftTovabbGomb(k) {
  if (k.querySelector(".ft-tovabb")) return;
  var b = el("button", "nagy-gomb kiemelt ft-tovabb", FTJ.i + 1 >= FTJ.sor.length ? "🏁 Célba érek" : "Tovább ➜");
  b.addEventListener("click", function () { hangGomb(); b.disabled = true; ftAllomasKesz(); });
  k.appendChild(b); ftGorget(b);
}
/* állomás kész: ✨ jár (a munkáért), a haladás mentődik — kilépés után innen folytatja */
function ftAllomasKesz() {
  var A = FTJ.a, tetel = A.tetel;
  var cs = FT_ALLOMAS_CSILLA + (A.elsore ? FT_ELSORE_PLUSZ : 0);
  P().csillampor += cs; FTJ.csilla += cs;
  $("ft-csillampor").textContent = P().csillampor;
  hangCsilla();
  if (!tetel.vissza) ftAllapot().palyak[FTJ.pa.id].poz = tetel.idx + 1;
  ment();
  FTJ.i++;
  ftKovetkezo();
}
function ftVege() {
  var pid = FTJ.pa.id, st = ftAllapot().palyak[pid];
  st.poz = 0; st.kesz = (st.kesz || 0) + 1;
  P().csillampor += FT_ZARO_CSILLA; FTJ.csilla += FT_ZARO_CSILLA;
  P().tunderharmat = (P().tunderharmat || 0) + FT_ZARO_HARMAT;
  tkNapPalya();
  ment();
  esemeny("palya_end", { palyaId: pid, fejtoro: true, feladat: FTJ.osszes, elsore: FTJ.elsore,
    idoMp: Math.round((Date.now() - FTJ.indult) / 1000), teljes: true, csillampor: FTJ.csilla, harmat: FT_ZARO_HARMAT });
  $("vege-szoveg").innerHTML =
    "Célba értél: <b>" + kiiras(FTJ.pa.nev || "Fejtörő-ösvény") + "</b>!<br>" +
    "<b>" + FTJ.osszes + "</b> fejtörőből <b>" + FTJ.elsore + "</b> sikerült elsőre, segítség nélkül.<br>" +
    "Gyűjtöttél: <b>" + FTJ.csilla + " ✨</b> csillámport." +
    '<br><span style="color:#2f7fb0;font-weight:800">💧 +' + FT_ZARO_HARMAT + ' tündérharmat</span>';
  $("vege-kovetkezo").style.display = "none";
  konfettiSzor(); hangVege();
  mutat("kepernyo-vege");
  ftMondd("Megmásztad a hegyet! " + FTJ.osszes + " fejtörőt oldottál meg. Szép munka volt!");
  FTJ = null;
}
function fejtoroKilep() {
  figyelStop();
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  if (FTJ) esemeny("palya_kilep", { palyaId: FTJ.pa.id, fejtoro: true, allomas: FTJ.i });
  FTJ = null;
  renderFomenu(); mutat("kepernyo-fomenu");
}

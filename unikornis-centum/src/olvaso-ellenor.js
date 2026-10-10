/* ============ 6n2) 🔎/✋ OLVASÓ-ELLENŐR — „Mire felelsz?” előtte, „Ez már a válasz?” utána ============
   Terv: Matekos\regi-kockak-konyvtar-terv.html 5. pont (✅ 2026-10-10) · rajz: …-rajzterv.html 3. pont (✅) ·
   tartalom: …-tartalom.html 3., 6. és 8. pont (✅ döntések). 1. kód-kör (2026-10-10): a modul + bekötés
   a 📌 KOTOTT szerszám-feladatokba és a régi könyvtári sablonokba (azok generátorai lift-anyagként élnek tovább).
   Egy darab modul, a feladattól független: az olvasópult (op-…) és a régi könyvtári buborék (ek-…) is ezt használja.

   A feladat „étlapja” (f.oe — a generátor adja; a régi sablonoknál oeEtlap() építi az f.ek.csap-ból):
     { szo:    "ketten együtt"                            a kérdezett szó (🔎 jó koppintás: „Igen, ez a kérdés: …”)
       koztes: { 13: "ennyi diót gyűjtött Samu" }         ✋ köztes számok és jelentésük (vagy { m: teljes mondat })
       masik:  { 8: "Mia diói" }                          🔎 a mesében szereplő MÁSIK mennyiség
       csap:   { 5: { m: "tipp", jelol: [mondat, "rész"] } }   konkrét csapda: kiemelt mondat(rész) + tipp
       ism:    "A tucat 12 darab."                        ha a szám semmire nem illik (különben „Olvassuk el újra…”)
       ismJelol: ".ek-kosar" }                             ilyenkor ez a rajz-rész sárgán kiemelődik
   A régi csapda-fajták: resz → ✋ köztes · masik, elozo → 🔎 másik mennyiség · minden más → konkrét csapda.

   Mit tud:
     oeOsztaly(f, n)       → { fajta: "koztes" | "masik" | "csap" | "ismeretlen", m, jelol }
     oeJelzes(f, n, ujra)  → köztes / másik mennyiség: NEM „rossz” (nincs hiba-hang, nem fogy próba), hanem
                             ✋ meleg sárga tábla vagy 🔎 „Mit kérdeznek?” + a kérdés felvillan. Feladatonként EGYSZER;
                             ha utána jó → önjavítás (3. döntés ✅: önállónak számít; mondat: oeDicser). true = kezelte.
     oeKeres(f, o)         → 🔎 kérdés-keret: a kérdés lila szaggatott keretben lüktet, a gyerek megkoppintja.
                             Rossz mondatra: megbillen, a kérdés felvillan, nincs „rossz” hang. o = { kesz, mondat, szo }
     oeKeresFut()          → épp a kérdést keresi-e (a pálya addig zárva tarthatja a választ)
     oeTorol()             → új feladatnál (feladatMutat) minden jelzés le.
   Mikor kérdez a 🔎 (2. döntés ✅ „csak ha kell”): a pálya első feladatánál · a liftben · a 🙋 „Mit kérdeznek?”-ből ·
   ha a gyerek egy másik mennyiségre felelt. Ezt a hívó dönti el; a modul csak a keretet adja. */

var OE_M = {
  keres: "🔎 Mire felelsz? Koppints a kérdésre!",
  keresJo: "Igen, ez a kérdés",
  keresMas: "Ez a mese egy része. Melyik mondat kérdez?",
  koztes: function (jel) { return "Ez egy lépcsőfok volt: " + jel + ". De mit kérdeztek?"; },
  masik: function (n, jel) { return "🔎 " + ekA(n, true) + " " + jel + ". Mit kérdeznek?"; },
  kozBagoly: "Nézd meg még egyszer a kérdést!",
  onjav: { koztes: "Megálltál, és továbbmentél!", masik: "Így már jó – most a kérdésre feleltél!" },
  ism: "Olvassuk el újra a kérdést!"
};

/* ── az étlap: a generátoré (f.oe), vagy a régi csapda-táblából (f.ek.csap) ── */
function oeEtlap(f) {
  if (!f) return null;
  if (f.oe) return f.oe;
  if (!f.ek) return null;
  var o = { szo: ekSima(f.ek.arany || "").toLowerCase(), koztes: {}, masik: {}, csap: {}, ism: f.ek.ism || "", ismJelol: f.ek.ismJelol || "" };
  var C = f.ek.csap || {};
  for (var n in C) {
    var c = C[n], t = c.t;
    if (t === "resz") o.koztes[n] = { m: c.m };
    else if (t === "masik" || t === "elozo") o.masik[n] = { m: c.m };
    else o.csap[n] = { m: c.m, t: t };
  }
  return (f.oe = o);
}
function oeOsztaly(f, n) {
  var E = oeEtlap(f); if (!E) return { fajta: "ismeretlen", m: OE_M.ism };
  var k = E.koztes && E.koztes[n], m = E.masik && E.masik[n], c = E.csap && E.csap[n];
  if (k) return { fajta: "koztes", m: typeof k === "string" ? OE_M.koztes(k) : k.m };
  if (m) return { fajta: "masik", m: typeof m === "string" ? OE_M.masik(n, m) : m.m };
  if (c) return { fajta: "csap", m: c.m, t: c.t, jelol: c.jelol || null };
  return { fajta: "ismeretlen", m: E.ism || OE_M.ism, ism: true, jelol: E.ismJelol ? { rajz: E.ismJelol } : null };
}

/* ── ✋ / 🔎 jelzés egy beírt számra (az ertekel rossz ágából) ── */
function oeJelzes(f, n, ujra) {
  if (!f || f.oeJel || f.vezet) return false;           /* feladatonként egyszer; a végigvezetett lépésen nincs */
  var o = oeOsztaly(f, n);
  if (o.fajta !== "koztes" && o.fajta !== "masik") return false;
  f.oeJel = o.fajta;
  if (f.naplo) f.naplo.oe = (o.fajta === "koztes" ? "✋" : "🔎") + n;   /* a pult a jó válasz sorában látja (naplozz) */
  var v = $("visszajelzes");
  v.className = "visszajelzes " + (o.fajta === "koztes" ? "oe-tabla" : "oe-mit");
  v.innerHTML = (o.fajta === "koztes" ? '<span class="oe-kez">✋</span> ' : "") + o.m;
  oeKerdesVillan();
  figArc("gondol");
  var mond = ekKiejt(o.m.replace(/^🔎\s*/, "")) + (o.fajta === "koztes" ? " " + OE_M.kozBagoly : "");
  if (o.fajta === "masik") oeKeres(f, { lagy: true, csendes: true });   /* a 4. eset: másik mennyiségre felelt → a kérdés-keret (nem zár) */
  mondd(mond, ujra);
  return true;
}
/* dicséret a jó válasz után, ha előtte jelzés volt (önjavítás) — különben null */
function oeDicser(f) { return f && f.oeJel ? OE_M.onjav[f.oeJel] : null; }

/* ── a kérdés és a mese-mondatok a lapon (olvasópult vagy a régi buborék) ── */
function oeKerdesEl() {
  var sz = typeof opAktivSzoveg === "function" ? opAktivSzoveg() : null;
  if (sz) return sz.querySelector(".op-kerdes");
  return document.querySelector("#buborek-feladat .ek-kk");
}
function oeMondatEl(t) { return t.closest ? t.closest(".op-m, .ek-tort p") : null; }
function oeKerdesVillan() {
  var x = oeKerdesEl(); if (!x) return;
  if (x.classList.contains("op-kerdes")) { opKerdesVillan(); return; }
  x.classList.remove("villan"); void x.offsetWidth; x.classList.add("villan");
}
function oeIsmJelol(sel) {
  var x = sel && document.querySelector("#buborek-feladat " + sel); if (!x) return;
  x.classList.remove("oe-kiemel"); void x.offsetWidth; x.classList.add("oe-kiemel");
}

/* ── 🔎 kérdés-keret ── */
var OE = { keres: null };
function oeKeresFut() { return !!(OE.keres && J && OE.keres.f === J.feladat); }
function oeKeres(f, o) {
  o = o || {};
  var q = oeKerdesEl(); if (!q) { if (o.kesz) o.kesz(); return; }
  oeKeresVege();
  OE.keres = { f: f, o: o, hiba: 0 };
  if (typeof opMutatSor === "function" && q.classList.contains("op-kerdes")) opMutatSor(q);
  q.classList.add("oe-keret");
  var bub = $("buborek-feladat"); if (bub) bub.classList.add("oe-keres");
  if (!o.lagy) $("valaszter").classList.add("oe-var");
  if (!o.csendes) {
    var v = $("visszajelzes"); v.className = "visszajelzes oe-mit"; v.textContent = OE_M.keres;
    mondd(ekKiejt(OE_M.keres.replace(/^🔎\s*/, "")));
  }
}
function oeKeresVege() {
  var bub = $("buborek-feladat"); if (bub) bub.classList.remove("oe-keres");
  Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .oe-keret"), function (x) { x.classList.remove("oe-keret"); });
  var vt = $("valaszter"); if (vt) vt.classList.remove("oe-var");
  OE.keres = null;
}
function oeTorol() {
  oeKeresVege();
  Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .oe-megvan, #buborek-feladat .oe-kiemel"), function (x) { x.classList.remove("oe-megvan", "oe-kiemel"); });
}
function oeKeresKatt(ev) {
  if (!oeKeresFut()) return false;
  var K = OE.keres, f = K.f, t = ev.target, q = oeKerdesEl(); if (!q) return false;
  if (q.contains(t)) {
    hangGomb();
    var szo = K.o.szo != null ? K.o.szo : (oeEtlap(f) || {}).szo;
    var m = OE_M.keresJo + (szo ? ": " + szo + "." : "!") + (K.o.mondat ? " " + K.o.mondat : "");
    oeKeresVege();
    q.classList.add("oe-megvan");
    f.oeKeresVolt = true;
    var v = $("visszajelzes"); v.className = "visszajelzes oe-mit"; v.textContent = "🔎 " + m;
    var kesz = K.o.kesz;
    mondd(ekKiejt(m), function () { if (kesz && J && J.feladat === f) kesz(); });
    return true;
  }
  var mon = oeMondatEl(t);
  if (mon) {
    K.hiba++;
    mon.classList.remove("oe-billen"); void mon.offsetWidth; mon.classList.add("oe-billen");
    oeKerdesVillan();
    var v2 = $("visszajelzes"); v2.className = "visszajelzes oe-mit"; v2.textContent = OE_M.keresMas;
    mondd(OE_M.keresMas);
    return true;
  }
  return false;
}
(function () {
  function bekot() {
    var b = $("buborek-feladat"); if (!b || b.__oe) return; b.__oe = true;
    b.addEventListener("click", function (ev) { if (oeKeresKatt(ev)) ev.stopPropagation(); });
    /* a régi kosaras feladat: „Koppints egyenként minden gyümölcsre” — a megkoppintott gyümölcs kap egy sorszámot */
    b.addEventListener("click", function (ev) {
      var g = ev.target.closest ? ev.target.closest(".ek-gy") : null; if (!g) return;
      var kos = g.parentNode, db = kos.querySelectorAll(".ek-gy.szamolt").length;
      if (g.classList.contains("szamolt")) return;
      hangGomb(); g.classList.add("szamolt"); g.setAttribute("data-n", db + 1);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bekot); else setTimeout(bekot, 0);
})();

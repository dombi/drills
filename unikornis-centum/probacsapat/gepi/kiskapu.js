/* 🤖 Gépi próba — ⑤ Kiskapu-őr segédei (a böngészőben; a kiskapu.py tölti be minden lap-betöltés után).
   Csak NÉZ (állapot, helyes válasz); a billentyűt és a kattintást a kiskapu.py adja, valódi bemenetként. */
window.__KK = (function () {
  var G = window.__GEPI_EVAL;   /* a játék belseje (motor.py kémlelője): P(), polcZar, lepesErtekek … */
  function lat(sel) {
    var e = document.querySelector(sel);
    return !!(e && e.getClientRects().length && getComputedStyle(e).visibility !== "hidden");
  }
  /* várja-e most a játék a gyerek válaszát (és milyen formában) */
  function valaszKesz() {
    var J = UC.J; if (!J || !J.feladat || !document.querySelector("#kepernyo-jatek.aktiv")) return false;
    var f = J.feladat;
    if (J.joVolt === f || f.vsKesz) return false;
    if (f.csalad === "felmondas") return !!J.lepesAktiv && !!document.querySelector("#felmond-lista .felmond-sor.most .dob-be");
    if (f.csalad === "maradekos") return lat("#mar-h");
    if (f.csalad === "koppint") return !!(J.kopp && !J.kopp.kesz) && lat("#valasz-kartyak [data-i]");
    if (f.csalad === "dobogo") return !!G("DOB && !DOB.zar && DOB.f === J.feladat") && lat('#dobogo-panel [data-g="kesz"]');
    if (f.kartyak) return lat("#valasz-kartyak .ek-tk");   /* 📚 olvasó-polc: „Kiről kérdeznek?” kártyák */
    if (f.polc && G("oeKeresFut() && OE.keres && !OE.keres.o.lagy")) return false;   /* a 🔎 kérdés-keret vár (a polcZar-t NEM hívjuk: beszél és keretet nyit) */
    if (document.querySelector("#buborek-feladat .eg-kartya.szabad")) return lat("#buborek-feladat .eg-kartya.szabad");   /* 👆 🧺 csere koppintással */
    return lat("#beiro-doboz");
  }
  function allapot() {
    var J = UC.J || {}, p = G("P()");
    return { ossz: J.futoOssz || 0, csilla: J.futoCsilla || 0, csp: p.csillampor || 0, harmat: p.tunderharmat || 0,
             kesz: J.feladatKesz || 0, all: J.allomasIdx || 0, aktiv: (document.querySelector(".kepernyo.aktiv") || {}).id,
             csalad: J.feladat && J.feladat.csalad, valaszKesz: valaszKesz(), palya: J.palya && J.palya.id,
             tovabb: lat("#tovabb-megoldas-nelkul") || lat("#tovabb-megoldas-nelkul-f") };
  }
  /* a helyes válasz bevitele:
     {mod:"gepel", sor:"4 2"}                  — számjegyek (a végére a hívó tesz Entert)
     {mod:"felmond", sor:"1 9 1 0 …"}          — a felmondás hátralévő sorai (az utolsó mező magától ellenőriz)
     {mod:"mar", h:"7", m:"2"}                 — maradékos osztás: két mező
     {mod:"katt", sel:[…], rossz:"…"}          — koppintós kártya(k), sorrendben; rossz: egy nem-jó kártya
     {mod:"dobogo", lep:[[szereplő, hely]…], kesz:"…", rossz:[…]} — 🏆 dobogó: két koppintás szereplőnként, aztán „Kész”
     null                                      — ezt a gép nem tudja megválaszolni */
  function jegyek(n) { return String(n).split("").join(" "); }
  function helyes() {
    var J = UC.J, f = J && J.feladat; if (!f) return null;
    if (f.csalad === "felmondas") {
      var d = [];
      for (var i = J.lepesSor, n = G("lepesSorok()"); i < n; i++) G("lepesErtekek(" + i + ")").forEach(function (v) { d.push(jegyek(v)); });
      return { mod: "felmond", sor: d.join(" ") };
    }
    if (f.csalad === "maradekos") return { mod: "mar", h: jegyek(f.helyes.h), m: jegyek(f.helyes.m) };
    if (f.csalad === "koppint") {
      var ek = !!f.ek, o = ek ? f.ek.kopp : f.kopp, sel = function (i) { return '#valasz-kartyak [data-i="' + i + '"]'; };
      var mind = [].map.call(document.querySelectorAll("#valasz-kartyak [data-i]"), function (e) { return e.getAttribute("data-i"); });
      var jo;
      if (ek) jo = String(o.kartyak.map(function (k) { return !!k.jo; }).indexOf(true));
      else if (o.tipus === "sorba") return { mod: "katt", sel: o.rend.map(sel), rossz: null };
      else jo = String(o.jo);
      var rossz = mind.filter(function (x) { return x !== jo; })[0];
      return { mod: "katt", sel: [sel(jo)], rossz: rossz != null ? sel(rossz) : null };
    }
    if (f.csalad === "dobogo") {
      var D = f.dob, lep = [], fel = [];
      D.jo.forEach(function (sor, r) { sor.forEach(function (id, i) {
        lep.push(['.dob-d:not(.bent)[data-r="' + r + '"][data-id="' + id + '"]', '.dob-h[data-r="' + r + '"][data-i="' + i + '"]']);
      }); });
      /* rossz elrendezés: az első sor első két szereplője helyet cserél (a többi jó helyen) */
      var jo0 = D.jo[0], cs = jo0.length > 1 ? [jo0[1], jo0[0]].concat(jo0.slice(2)) : null;
      if (cs) cs.forEach(function (id, i) { fel.push(['.dob-d:not(.bent)[data-r="0"][data-id="' + id + '"]', '.dob-h[data-r="0"][data-i="' + i + '"]']); });
      D.jo.slice(1).forEach(function (sor, r) { sor.forEach(function (id, i) {
        fel.push(['.dob-d:not(.bent)[data-r="' + (r + 1) + '"][data-id="' + id + '"]', '.dob-h[data-r="' + (r + 1) + '"][data-i="' + i + '"]']);
      }); });
      return { mod: "dobogo", lep: lep, kesz: '#dobogo-panel [data-g="kesz"]', ujra: '#dobogo-panel [data-g="ujra"]', rossz: cs ? fel : null };
    }
    if (f.kartyak) {
      var jk = String(f.kartyak.map(function (k) { return !!k.jo; }).indexOf(true)), sk = function (i) { return '#valasz-kartyak .ek-tk[data-i="' + i + '"]'; };
      var mk = [].map.call(document.querySelectorAll("#valasz-kartyak .ek-tk"), function (e) { return e.getAttribute("data-i"); }).filter(function (x) { return x !== jk; });
      return { mod: "katt", sel: [sk(jk)], rossz: mk.length ? sk(mk[0]) : null };
    }
    var kk = [].slice.call(document.querySelectorAll("#buborek-feladat .eg-kartya.szabad"));   /* 👆 🧺 csere koppintással: a helyes számú kártya */
    if (kk.length) {
      var ks = function (e) { return '#buborek-feladat .eg-kartya.szabad[data-i="' + e.getAttribute("data-i") + '"][data-j="' + e.getAttribute("data-j") + '"]'; };
      var kj = kk.filter(function (e) { return +e.textContent === f.helyes; })[0], kr = kk.filter(function (e) { return +e.textContent !== f.helyes; })[0];
      if (kj) return { mod: "katt", sel: [ks(kj)], rossz: kr ? ks(kr) : null };
    }
    if (typeof f.helyes !== "number") return null;
    return { mod: "gepel", sor: jegyek(f.helyes), szam: f.helyes, max: G("beirMax()") };
  }
  /* ami a válasz előtt koppintást kér: a 🔎 kérdés-keret (olvasó-polc), a vásár „Tovább ▶” gombja,
     a mozgókép (mérés / könyvtár bemutató, hiba utáni magyarázat) „Tovább” gombja, a kész felmondás gombja */
  function akadaly() {
    var l = ["#mk-reteg .mk-tovabb", "#buborek-feladat .oe-keret", "#vs-tovabb", "#bontas-kesz-gomb"];
    for (var i = 0; i < l.length; i++) { var e = document.querySelector(l[i]); if (e && !e.hidden && e.getClientRects().length) return l[i]; }
    return null;
  }
  return { allapot: allapot, helyes: helyes, valaszKesz: valaszKesz, akadaly: akadaly };
})();

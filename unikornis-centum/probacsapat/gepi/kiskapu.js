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
    if (f.csalad === "bolt") {   /* 🏪 Tüske néni boltja (bolt-kep.js): a kép vár, ha nincs lezárva, és van mit koppintani */
      var B = UC.bk && UC.bk(); if (!B || B.f !== f || B.lezart || B.mozog || B.fazis === "otthon") return false;
      if (B.fazis === "bevalt") return lat("#bk-svg .bk-kopp");   /* 🔥 beváltás: a keret és a koppintható kölyök / unikornis */
      return B.forma === "blokk" ? (B.fazis === "javit" ? lat('#bk-gombok [data-g="javok"]') : lat("#bk-svg .bk-pecset")) : lat('#bk-gombok [data-g="kesz"]');
    }
    if (f.csalad === "letra") {   /* 🪜 Rokon-létra (letra.js): amíg a létra magától tölt / felmászik, nem vár */
      var R = UC.rl && UC.rl(); if (!R || R.f !== f || R.lezart) return false;
      return f.rl.forma === "segit" && !f.rl.valasztva ? lat("#rl-svg .rl-kartya") : lat('#rl-gombok [data-g="kesz"]');
    }
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
    if (f.csalad === "bolt") {   /* 🏪 érmék a tárcából / kasszából (a legkevesebb), aztán Kész · a róka blokkja: pecsét, ✗ után a javítás */
      var x = f.bolt, B = UC.bk(), kesz = '#bk-gombok [data-g="kesz"]', es = function (hol, v) { return '#bk-svg .bk-erme[data-hol="' + hol + '"][data-v="' + v + '"]'; };
      var legk = function (n) { var l = []; [50, 20, 10, 5, 2, 1].forEach(function (v) { while (n >= v) { l.push(v); n -= v; } }); return l; };
      var le = function (hol) { return B.ermek.filter(function (e) { return e.hol === hol; }).map(function () { return '#bk-svg .bk-erme[data-hol="' + hol + '"]'; }); };   /* előbb vissza, ami kint maradt */
      if (x.forma === "fizet") {
        var cel = legk(x.ar);
        if (x.lepes === 2 && x.elozo) {   /* „másképp”: az erszényből egy másik összeállítás (mélységi keresés) */
          var W = x.tarca.slice().sort(function (a, b) { return b - a; }), kulcs = x.elozo.slice().sort().join(","), talalt = null;
          (function rek(i, o, l) { if (talalt || o > x.ar) return; if (o === x.ar) { if (l.slice().sort().join(",") !== kulcs) talalt = l.slice(); return; }
            for (var j = i; j < W.length; j++) { if (j > i && W[j] === W[j - 1]) continue; l.push(W[j]); rek(j + 1, o + W[j], l); l.pop(); } })(0, 0, []);
          if (talalt) cel = talalt;
        }
        return { mod: "katt", sel: le("pult").concat(cel.map(function (v) { return es("tarca", v); })).concat([kesz]), rossz: kesz };   /* rossz: üres pult + Kész */
      }
      if (B.fazis === "bevalt") {   /* 🔥 a keret megtöltése (1. fok: tíz egyes, 2. fok: két ötös), aztán koppintás · rossz: koppintás üres kerettel */
        var kt = (B.bevFok === 1 ? [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] : [5, 5]).map(function (v) { return es("kassza", v); });
        return { mod: "katt", sel: le("keret").concat(kt).concat(["#bk-svg .bk-kopp"]), rossz: "#bk-svg .bk-kopp" };
      }
      if (x.forma === "vissza") return { mod: "katt", sel: le("tenyer").concat(legk(x.v.vissza).map(function (v) { return es("kassza", v); })).concat([kesz]), rossz: kesz };
      var ps = function (v) { return '#bk-svg .bk-pecset[data-v="' + v + '"] rect'; };
      if (B.fazis === "javit") return { mod: "gepel", sor: jegyek(x.b.helyes), szam: x.b.helyes, max: 3 };   /* a javítás billentyűzetről */
      return { mod: "katt", sel: [ps(x.b.pontos ? "ok" : "x")], rossz: ps(x.b.pontos ? "x" : "ok") };
    }
    if (f.csalad === "letra") {   /* 🪜 „melyik segít?”: a rokon kis fok · „írj te egy rokont”: a 3. fok (alap + 30) · különben a szám a táblára */
      var x = f.rl, ks = function (i) { return '#rl-svg .rl-kartya[data-i="' + i + '"] rect'; };
      if (x.forma === "segit" && !x.valasztva) return { mod: "katt", sel: [ks(x.s.jo)], rossz: ks((x.s.jo + 1) % 3) };
      if (x.forma === "sajat" && x.valasztott == null) return { mod: "gepel", sor: jegyek(x.alap.a + 30), szam: x.alap.a + 30, max: 3 };
      return { mod: "gepel", sor: jegyek(f.helyes), szam: f.helyes, max: 3 };
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
    var l = ["#mk-reteg .mk-tovabb", "#buborek-feladat .oe-keret", "#vs-tovabb", "#bontas-kesz-gomb", '#bk-gombok [data-g="vissza"]'];   /* 🏪 hibás ✓ után: „Vissza a blokkhoz” */
    for (var i = 0; i < l.length; i++) { var e = document.querySelector(l[i]); if (e && !e.hidden && e.getClientRects().length) return l[i]; }
    return null;
  }
  return { allapot: allapot, helyes: helyes, valaszKesz: valaszKesz, akadaly: akadaly };
})();

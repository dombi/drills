/* 🤖 Gépi próba — ⑨ újonc-menet (ujonc.py): a játék BELSEJÉBEN fut (l.belul), a nyitas.js saját függvényeivel.
   window.__UJ: állapot-fotó, a mai pályák kiválasztása, egy pálya „végigjátszása” (palyaInditas mezői + palyaVege —
   a feladatok nélkül, ezeket a ⑥b végigjátszás-őr nézi), és a kiskapu-kérdések (alvó pálya indítható-e). */
(function () {
  var LIGETEK = NYITAS_TANULO.filter(function (id) { return id !== "egyeni"; });
  function lathato(sel) { return [].some.call(document.querySelectorAll(sel), function (e) { return e.getClientRects().length > 0; }); }
  window.__UJ = {
    allapot: function () {
      var m = nyitasMenet();
      if (!m) return { menet: false };
      var r = m.r, lig = {}, alap = {}, hely = {}, dom = {}, van = [];
      LIGETEK.forEach(function (id) { lig[id] = nyitasLiget(id); alap[id] = nyitasLigetAllapot(r, m.sor, id, nyitasEgyeniVan()); });
      var ligT = {}, reg = fomenuLigetek().regiok;   /* 🧺 a térkép-hely fénye: a benne lakó ligetekkel együtt (TERKEP_GAZDA, piac.js) */
      LIGETEK.forEach(function (id) { if (terkepGazda(id) === id) ligT[id] = terkepNyitas(id, reg); });
      NYITAS_NAPOK.forEach(function (x) { hely[x[0]] = nyitasHely(x[0]); });
      [].forEach.call(document.querySelectorAll("#kepernyo-fomenu .terkep-hely[data-id]"), function (e) {
        var id = e.getAttribute("data-id"); if (van.indexOf(id) < 0) van.push(id);
        if (e.classList.contains("ny-kod")) dom[id] = "kod";
        else if (e.querySelector(".hb.ny-vilagit")) dom[id] = "vil";
      });
      return { menet: true, o: m.o, nap: nyitasNapja(r, m.p), napok: r.napok, nyilt: r.nyilt, fel: r.fel, fv: r.fv, elakad: r.elakad,
               lig: lig, ligT: ligT, alap: alap, hely: hely, dom: dom, van: van, terkep: !!document.querySelector("#kepernyo-fomenu.aktiv") && !!document.querySelector("#kepernyo-fomenu .terkep-hely"),
               rejtett: document.body.classList.contains("harmat-rejtett"), harmatLatszik: lathato(".harmat-jel, .csilla-szamlalo.harmat"),
               csp: m.p.csillampor || 0, harmat: m.p.tunderharmat || 0, leny: typeof lenyTar === "function" ? lenyTar(m.p).fazis || null : null,
               boltFulek: nyitasBoltFulek(), sor: NYITAS_OSZTALY[m.o], gy: gyakNap(m.p),
               pult: (function () { var s = nyitasPultAllapot(mentes.profilok, nyitasBeall()); return { menet: s.menet, nap: s.nap }; })() };
    },
    /* a mai pályák: amire az unikornis hív (a sorban következő világító pálya + a világító vers), különben az első ébren lévő */
    celok: function (db) {
      var ki = [], tartalek = [];
      PALYAK.forEach(function (pa) {
        if (pa.hamarosan || palyaRejtve(pa) || palyaZarva(pa) || nyitasPalyaAlszik(pa) || palyaElfogyott(pa)) return;
        if (pa.konyvtar || pa.szerszam || pa.polc || pa.fejtoro || pa.teny || pa.villam) return;   /* a saját sorrendű / külön motoros pályákat a menet nem sorolja */
        var lg = palyaLiget(pa); if (LIGETEK.indexOf(lg) < 0) return;
        if (nyitasPalyaVilagit(pa)) ki.push(pa.id);
        else if (nyitasLiget(lg) !== "alszik" && !(P().palyak[pa.id] || {}).kesz) tartalek.push(pa.id);
      });
      return ki.concat(tartalek).slice(0, db);
    },
    /* a pálya „végigjátszva”: a palyaInditas mezői (zárt pályánál ugyanúgy nem indul), aztán palyaVege */
    jatszik: function (id, kerulo) {
      var pa = palyaKeres(id);
      if (!pa || palyaZarva(pa) || palyaElfogyott(pa)) return "zarva";
      ligetJegyez(palyaLiget(pa));
      var rovid = nyitasRovidElso(pa);
      var s = P().sorozat || (P().sorozat = { hossz: 0, utolsoPalya: null });
      if (id === s.utolsoPalya) { s.hossz = 0; s.utolsoPalya = null; }
      var ma = new Date().toISOString().slice(0, 10); if (!P().napok) P().napok = {}; P().napok[ma] = 1;
      J = { palya: pa, allomasok: pa.allomasok || [], allomasIdx: 0, feladat: null, feladatDb: 10, feladatKesz: 10, probak: 0, kerultKulcsok: {},
            futoElsore: kerulo ? 6 : 10, futoOssz: 10, futoCsilla: 0, lepesSor: 0, beirt: "", kezCsend: 0, kezBeiras: false,
            keruloVolt: !!kerulo, sorozatBan: s.hossz >= 1, indultMs: Date.now(), rovid: rovid };
      if (pa.vasar) vsIndit();
      esemeny("palya_start", { palyaId: id });
      palyaVege();
      return rovid ? "rovid" : "ok";
    },
    /* félbehagyás (a pálya közben kilép) — az elakadás másik jele */
    kilep: function (id) { esemeny("palya_kilep", { palyaId: id }); },
    /* kiskapu: alvó pálya, ami mégis indítható (palyaZarva hamis) — a játék ezt kérdezi minden indításnál */
    alvoNyitva: function () {
      return PALYAK.filter(function (pa) { return !pa.hamarosan && nyitasPalyaAlszik(pa) && !palyaZarva(pa); }).map(function (pa) { return pa.id; });
    }
  };
})();

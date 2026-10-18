/* 🤖 Gépi próba — ⑥ „teli” mentés gyártása (a mentes_gyarto.py futtatja a JÁTÉK BELSEJÉBEN, __GEPI_EVAL-lal).
   Kitalált, „sokat játszott gyerek” mentése (3A döntés: semmilyen valódi gyerekadat). A játék épp betöltött
   változatának SAJÁT katalógusaiból tölt: ami abban a változatban még nem volt (pl. szalon, Tény-kert), az kimarad —
   pont úgy, ahogy egy akkori gyerek mentésében sem volt benne. Minden rész külön próbálkozás: egy hiányzó katalógus
   nem rontja el a többit. Vissza: a localStorage-ba írt mentés szövege. */
(function () {
  function van(nev) { try { return eval("typeof " + nev) !== "undefined"; } catch (e) { return false; } }
  function probal(f) { try { f(); } catch (e) {} }
  var NEVEK = { ragyogas: "Csillagka", tuz: "Lángocska", csillamharmat: "Harmatka" };
  LENY_SORREND.forEach(function (lk, li) {
    var p = mentes.profilok[lk] || (mentes.profilok[lk] = alapProfil());
    p.csillampor = 1234 + li * 111;
    if ("tunderharmat" in p || van("alapBank")) p.tunderharmat = 321 + li * 11;
    p.becenev = NEVEK[lk] || "Pötty"; p.jatekMp = 54321 + li;
    probal(function () {   /* minden pálya kész, minden második aranyos, rekord */
      PALYAK.forEach(function (pa, i) { if (!pa.hamarosan) p.palyak[pa.id] = { kesz: true, rekordElsore: 3 + (i % 9), arany: i % 2 === 0 }; });
    });
    probal(function () {   /* ruhák: mind megvéve, helyenként az első felvéve */
      Object.keys(RUHAK).forEach(function (h) { RUHAK[h].forEach(function (t) { p.oltozet.van[t.id] = 1; }); p.oltozet[h] = RUHAK[h][0].id; });
    });
    probal(function () {   /* bútorok: mind megvéve, a legszebb kitéve */
      Object.keys(ODU_BUTOR).forEach(function (h) {
        var L = ODU_BUTOR[h]; if (!p.odu.vanButor) p.odu.vanButor = {}; p.odu.vanButor[h] = {};
        L.forEach(function (t) { if (t.ar) p.odu.vanButor[h][t.id] = 1; }); p.odu.szint[h] = L[L.length - 1].id;
      });
    });
    probal(function () {   /* díszek: mind megvéve, zónánként egy kitéve */
      Object.keys(DISZ_TARGY).forEach(function (id) { p.odu.vanDisz[id] = 1; var t = DISZ_TARGY[id]; if (t.hova && !p.odu.disz[t.hova]) p.odu.disz[t.hova] = id; });
    });
    probal(function () { KRISTALY.forEach(function (t) { p.odu.vitrin[t.id] = 1; }); });            /* ✨ kristály-díszek */
    probal(function () {   /* napszak / időjárás: mind megvéve */
      ["napszak", "ido"].forEach(function (g) { ODU_KAT[g].forEach(function (t) { p.odu.van[g][t.id] = 1; }); p.odu[g] = ODU_KAT[g][1].id; });
    });
    probal(function () { JELVENYEK.forEach(function (j) { p.jelvenyek[j.id] = 1; }); });             /* 🏅 minden jelvény */
    probal(function () {   /* kert: nyitva, trükkök, fészer, lerakott tárgyak */
      p.kert.nyitva = 1;
      KERT_BOLT.forEach(function (t) { p.kert.trukkok[t.id] = 1; });
    });
    probal(function () {
      KERT_TARGYAK.forEach(function (t, i) {
        if (i % 2) p.kert.keszlet[t.id] = 1 + (i % 3);
        else p.kert.elemek.push({ tip: t.id, x: 10 + (i * 7) % 80, y: 75 + (i * 3) % 20 });
      });
    });
    probal(function () {   /* fodrászat: nyitva, minden festék, lakk, szőrfesték, kefe; néhány felvéve */
      p.szalon.nyitva = 1;
      FESTEKEK.forEach(function (f) { p.szalon.festekek[f.id] = 1; }); p.kinezet.festek.soreny = FESTEKEK[0].id;
      LAKKOK.forEach(function (f) { p.szalon.lakkok[f.id] = 1; }); p.kinezet.lakk = [LAKKOK[0].id, null, LAKKOK[0].id, null];
      SZORFESTEKEK.forEach(function (f) { p.szalon.szorfestekek[f.id] = 1; }); p.kinezet.szor = SZORFESTEKEK[0].id;
      p.szalon.kefek.gondor = 1; p.szalon.kefek.egyenes = 1; p.kinezet.frizura = "gondor";
    });
    probal(function () { if (p.jelvSzam) Object.keys(p.jelvSzam).forEach(function (k) { p.jelvSzam[k] = 3; }); });
    probal(function () { p.napok = { "2026-09-01": 1, "2026-09-02": 1, "2026-09-03": 1 }; });
    probal(function () { if ("tkNyitva" in p || van("TK")) p.tkNyitva = 1; });
    probal(function () {   /* 🌸 tény-motor: néhány tény, a változat SAJÁT rögzítőjével (tenyJegyez — a P()-be ír) */
      if (!van("tenyJegyez")) return;
      var tip = Object.keys(TENY_TIPUSOK)[0], el = mentes.leny; mentes.leny = lk;
      ["3 + 4", "5 + 5", "7 + 2", "8 + 6", "9 − 4", "37 + 63", "45 + 8"].forEach(function (k, i) {
        for (var n = 0; n < 3; n++) probal(function () { tenyJegyez({ tipus: tip, kerdes: k }, n > 0, 1500 + i * 400); });
      });
      mentes.leny = el;
    });
  });
  ment();
  return localStorage.getItem(KULCS);
})()

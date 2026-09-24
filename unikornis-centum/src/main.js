/* ============ 11) INDÍTÁS ============ */
betolt();
felhoIndit();   /* felhő (1. fázis): csak ?felho kapcsolóval él */
document.querySelector(".jatekter").insertAdjacentHTML("beforeend", bagolySVG());
esemenyek();
renderProfil();
mutat("kepernyo-profil");
document.addEventListener("pointerdown", function egyszer() {
  var c = ac(); if (c && c.state === "suspended") c.resume();
  document.removeEventListener("pointerdown", egyszer);
});

/* fejlesztői teszt-fogantyú (éles használatot nem zavar) */
window.UC = {
  get TK() { return TK; }, tkKapu: tkKapu, tkBelep: tkBelep, tkKilep: tkKilep, tkNap: tkNap,   /* ÉGI TÜNEMÉNYKERT */
  get J() { return J; }, get mentes() { return mentes; },
  ertekel: ertekel, felmondErtekel: felmondErtekel, bontasFelmondOk: bontasFelmondOk,
  bontasEloFogyaszt: bontasEloFogyaszt, szorzoEloFogyaszt: szorzoEloFogyaszt, palyaInditas: palyaInditas,
  kovAllomas: kovAllomas, ujFeladat: ujFeladat, bontasLepesNyit: bontasLepesNyit, felmondHangVissza: felmondHangVissza,
  kapuAllapot: kapuAllapot, kapuNyitva: kapuNyitva, kapuKulcsTeljesult: kapuKulcsTeljesult,
  GEN: GEN, szamokKinyer: szamokKinyer, szo: szo,
  oduNyit: oduNyit, ODU_KAT: ODU_KAT, unikornisSVG: unikornisSVG, LENYEK: LENYEK,
  oduVesz: function (kat, id) { var t = null; ODU_KAT[kat].forEach(function (x) { if (x.id === id) t = x; }); if (t) oduVesz(kat, t); },
  oduBeallit: oduBeallit, RUHAK: RUHAK,
  oduRuhaVesz: function (kulcs, id) { var t = null; (RUHAK[kulcs] || []).forEach(function (x) { if (x.id === id) t = x; }); if (t) oduRuhaVesz({ kulcs: kulcs }, t); },
  oduRuhaVisel: oduRuhaVisel,
  anchorViz: anchorViz, ANCHOR_ZONAK: ANCHOR_ZONAK,
  get FB() { return FB; },
  bontasEloStart: bontasEloStart, bontasEloBotlas: bontasEloBotlas, bontasEloVege: bontasEloVege,
  bontasEloChunk: bontasEloChunk,
  JELVENYEK: JELVENYEK, jelvenyEllenoriz: jelvenyEllenoriz, dropProbal: dropProbal, dropUnnepel: dropUnnepel,
  renderJelveny: renderJelveny, renderGyujtemeny: renderGyujtemeny,
  jutalom: jutalom, palyaBecsultErtek: palyaBecsultErtek, renderFomenu: renderFomenu,
  PALYAK: PALYAK,
  ODU_BUTOR: ODU_BUTOR,
  oduButorVesz: function (hely, id) { var t = null; (ODU_BUTOR[hely] || []).forEach(function (x) { if (x.id === id) t = x; }); if (t) oduButorVesz(hely, t); },
  oduButorBeallit: oduButorBeallit, oduSVG: function () { return oduSVG(mentes.leny, P().odu); },
  DISZ_TARGY: DISZ_TARGY, DISZ_ZONA: DISZ_ZONA,
  oduDiszVesz: function (id) {
    if (id === "extrafuzer") { oduDiszVesz("mennyezet", { id: id, ar: 30 }); return; }
    var d = DISZ_TARGY[id]; if (d) oduDiszVesz(d.hova, { id: id, ar: d.ar });
  },
  oduDiszBeallit: oduDiszBeallit,
  SORENY_SZIN: SORENY_SZIN, SZEM_SZIN: SZEM_SZIN,
  oduKinezetVesz: oduKinezetVesz, oduKinezetBeallit: oduKinezetBeallit,
  KRISTALY: KRISTALY, oduPanelNyit: oduPanelNyit,
  oduVitrinVesz: function (id) { var t = null; KRISTALY.forEach(function (x) { if (x.id === id) t = x; }); if (t) oduVitrinVesz(t); },
  KERT_BOLT: KERT_BOLT, kertNyit: kertNyit, renderKert: renderKert, kertSetal: kertSetal,
  kertTrukkJatszik: kertTrukkJatszik, kertTrukkGomb: kertTrukkGomb, kertUl: kertUl, kertAll: kertAll,
  kertPorgesForgas: kertPorgesForgas, forgatoSzinek: forgatoSzinek,
  kertAgyKoppint: kertAgyKoppint,
  utcaNyit: utcaNyit, szalonNyit: szalonNyit, szalonKefe: szalonKefe,           /* FODRÁSZAT */
  frizuraGondorArt: frizuraGondorArt,
  kertNyihog: kertNyihog, kertLepesHang: kertLepesHang,           /* kerti hangok (teszt/diagnosztika) */
  kertHangBufferek: function () { return KERT_BUF; }, kertLepesSzol: function () { return !!KERT_LEPES; },
  oduKertVesz: function (id) { var t = null; KERT_BOLT.forEach(function (x) { if (x.id === id) t = x; }); if (t) oduKertVesz(t); },
  napiKiemeltId: napiKiemeltId, napiKiemeltTeljesitve: napiKiemeltTeljesitve,
  /* producer-felülírások (4. fázis) — teszthez felhő nélkül is beállítható */
  get FELULIR() { return FELULIR; }, felulirOsszevon: felulirOsszevon,
  felulirBeallit: function (egyeni, csoportok, egyeniP, csoportP) { FELULIR.egyeni = egyeni || {}; FELULIR.csoportok = csoportok || {}; FELULIR.egyeniP = egyeniP || {}; FELULIR.csoportP = csoportP || {}; felulirSzamol(); },
  egyeniPalyak: egyeniPalyak, palyaKeres: palyaKeres, palyaInditas: palyaInditas,
  palyaRejtve: palyaRejtve, palyaAjanlott: palyaAjanlott, palyaSzorzo: palyaSzorzo,
  nehezsegAlkalmaz: nehezsegAlkalmaz,
  palyaAllomasok: function (id) { var pa = palyaKeres(id); return nehezsegAlkalmaz(pa, pa.allomasok.map(function (a) { var o = {}, k; for (k in pa.alap) o[k] = pa.alap[k]; for (k in a) o[k] = a[k]; return o; })); }
};


/* ============ 11) INDÍTÁS ============ */
betolt();
felhoIndit();   /* felhő (1. fázis): csak ?felho kapcsolóval él */
document.querySelector(".jatekter").insertAdjacentHTML("beforeend", bagolyRajz("kabala"));
esemenyek();
renderProfil();
mutat("kepernyo-profil");
document.addEventListener("pointerdown", function egyszer() {
  var c = ac(); if (c && c.state === "suspended") c.resume();
  document.removeEventListener("pointerdown", egyszer);
});

/* fejlesztői teszt-fogantyú (éles használatot nem zavar) */
window.UC = {
  villamHalmazok: villamHalmazok, villamNyitva: villamNyitva, villamTudott: villamTudott, villamKorEpit: villamKorEpit, villamKov: villamKov, villamRossz: villamRossz,
  villamFeladat: villamFeladat, villamArnyek: villamArnyek, villamKorZar: villamKorZar, villamAllapot: villamAllapot, villamTar: villamTar, villamBeall: villamBeall,   /* ⚡ VILLÁMKÖR (2. kör) */
  tenyKulcs: tenyKulcs, tenyJegyez: tenyJegyez, tenyLepcso: tenyLepcso, tenyEsedekes: tenyEsedekes, tenyValaszt: tenyValaszt,   /* 🌸 TÉNY-MOTOR */
  gyakNap: gyakNap, gyakLep: gyakLep, gyakPalyaVege: gyakPalyaVege, igeny: igeny, meglepetesSor: meglepetesSor, erik: erik,   /* 🌱 GONDOZÁS */
  visszaHir: visszaHir, VISSZA_HIR: VISSZA_HIR, napiHatar: napiHatar, napiMarad: napiMarad, visszaTar: visszaTar, hetAzon: hetAzon, hetPecset: hetPecset, visszaAllapot: visszaAllapot,   /* 💌 VISSZAHÍVÁS (2. kör) */
  lenyTar: lenyTar, lenyPalyaVege: lenyPalyaVege, lenyHirek: lenyHirek, lenyRajz: lenyRajz, lenyPal: lenyPal, lenyOduMod: lenyOduMod, lenyKikeles: lenyKikeles, LENY_NAP: LENY_NAP,   /* 🐣 VISSZAHÍVÁS (3. kör): tojás + fióka */
  lenyElroppenes: lenyElroppenes, kalandNyit: kalandNyit, kalandZar: kalandZar, kalandAlbum: kalandAlbum, kalandTar: kalandTar, kalandFelhoJar: kalandFelhoJar, KALAND_TAJ: KALAND_TAJ, get KT() { return KT; }, ktFelhoKatt: ktFelhoKatt, ktHelyKatt: ktHelyKatt, lenyTerkepJel: lenyTerkepJel, lenyKertKopp: lenyKertKopp, lenyKertErkezik: lenyKertErkezik, lenyKertJel: lenyKertJel, hetVegeMutat: hetVegeMutat, hetNagy: hetNagy, hetFuzet: hetFuzet, hetPecset: hetPecset, hetDb: hetDb, get HET_UJ() { return HET_UJ; },   /* 🗺️ kalandtérkép (4. kör) */
  tenyKertTar: tenyKertTar, tenyKertHajt: tenyKertHajt, tenyKertNyit: tenyKertNyit, tenyViragFazis: tenyViragFazis,   /* 🌷 Tamagocsi-kert */
  tenyKertTovek: tenyKertTovek, tenyKertBelep: tenyKertBelep, tenyKertTavol: tenyKertTavol, tenyKertBesetal: tenyKertBesetal, tenyKertHirek: tenyKertHirek,
  tenyKertErkezik: tenyKertErkezik, tenyKertMeglepetes: tenyKertMeglepetes, tenyKertVar: tenyKertVar, tvkLocsol: tvkLocsol, TVK: TVK,   /* 🌷 gondozás (5. kör) */
  tenyKertRitkaAjandek: tenyKertRitkaAjandek, tenyKertRitkaErik: tenyKertRitkaErik, RITKA_VIRAGOK: RITKA_VIRAGOK, ritkaRajz: ritkaRajz, tvRitkaUltet: tvRitkaUltet,   /* 🌰 ritka mag (6. kör) */
  tenyKertPultSVG: tenyKertPultSVG, TVK: TVK, tvkSzagol: tvkSzagol, tvkKozelZar: tvkKozelZar, tvkMasikAgy: tvkMasikAgy, viragKinezet: viragKinezet, VIRAG_FORMAK: VIRAG_FORMAK,   /* 🌷 Tény-kert (4. kör) */
  tenyKertAllapot: tenyKertAllapot, tenyMind: tenyMind, tenyNap: tenyNap, tenyOraMs: tenyOraMs, TO: TO, tenyBeall: tenyBeall, tenyOsszevon: tenyOsszevon, tenyTabla: tenyTabla,
  tenyPalya: tenyPalya, tenyTablakAktiv: tenyTablakAktiv, tenyHalmaz: tenyHalmaz, tenyKorEpit: tenyKorEpit, tenyFeladat: tenyFeladat, tenyKeretben: tenyKeretben, tenyNehez: tenyNehez,
  tovabbMehetE: tovabbMehetE,
  meresSzamok: meresSzamok, meresLathato: meresLathato, mSzamSzo: mSzamSzo, MR: MR, mkLejatszik: mkLejatszik, mkBemutatoValaszt: mkBemutatoValaszt, mkHibaValaszt: mkHibaValaszt, mkBezar: mkBezar, MKJ: MKJ, MK_KIEG: MK_KIEG, MK_KUL: MK_KUL, mkKulAdat: mkKulAdat, mkKiegDarabok: mkKiegDarabok,   /* MÉRÉS-LIGETEK */
  EK_GEN: EK_GEN, ekPalyaVege: ekPalyaVege, ekLakat: ekLakat, ekKiejt: ekKiejt, SZARNYAK: SZARNYAK,   /* 📚 BAGOLYKÖNYVTÁR */
  VS_GEN: VS_GEN, VSM: VSM, vsPalyaVege: vsPalyaVege, vsTovabbNyom: vsTovabbNyom, FIGURA: FIGURA, figuraSVG: figuraSVG, figArc: figArc,   /* 🧺 TÜNDÉRVÁSÁR */
  ekAllapot: ekAllapot, ekMesterAllapot: ekMesterAllapot, ekMesterKatt: ekMesterKatt, ekKockaLista: ekKockaLista, ekKockavarNagySVG: ekKockavarNagySVG,
  ekStabil: ekStabil, EK_MOZGO: EK_MOZGO, EK_KOCKA_DEF: EK_KOCKA_DEF, ekElottKell: ekElottKell, ekValaszMondat: ekValaszMondat, felulirSzamol: felulirSzamol,   /* 🏅 MESTERPRÓBA (5b) */
  get TK() { return TK; }, tkKapu: tkKapu, tkBelep: tkBelep, tkKilep: tkKilep, tkNap: tkNap,   /* ÉGI TÜNEMÉNYKERT */
  get FELHO() { return FELHO; }, tkGesztusIndit: tkGesztusIndit, tkGesztusJott: tkGesztusJott, tkPacsiIndit: tkPacsiIndit, tkMasikJott: tkMasikJott, tkGesztussor: tkGesztussor,
  tkDiszLerak: tkDiszLerak, tkTalcaValt: tkTalcaValt, tkDiszKintSajat: tkDiszKintSajat, tkDiszZsak: tkDiszZsak, tkValtozott: tkValtozott, tkVisszaJott: tkVisszaJott,
  get J() { return J; }, get mentes() { return mentes; },
  ertekel: ertekel, felmondErtekel: felmondErtekel, bontasFelmondOk: bontasFelmondOk,
  bontasEloFogyaszt: bontasEloFogyaszt, szorzoEloFogyaszt: szorzoEloFogyaszt, palyaInditas: palyaInditas,
  kovAllomas: kovAllomas, ujFeladat: ujFeladat, bontasLepesNyit: bontasLepesNyit, felmondHangVissza: felmondHangVissza,
  kapuAllapot: kapuAllapot, kapuNyitva: kapuNyitva, kapuKulcsTeljesult: kapuKulcsTeljesult,
  kapuKulcsok: kapuKulcsok, palyaZarva: palyaZarva, palyaElfogyott: palyaElfogyott, palyaVege: palyaVege,
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
  OSV: OSV, OSV_KERULO: OSV_KERULO, osvenyAllomasra: osvenyAllomasra, osvenyKerulo: osvenyKerulo, osvenyOduba: osvenyOduba, osvenyOrom: osvenyOrom, keruloUt: keruloUt,
  uniPorog: uniPorog, uniFordul: uniFordul, uniNezoAdat: uniNezoAdat, UNI_FORDUL: UNI_FORDUL, forgatoSzinek: forgatoSzinek, unikornisNezetArt: unikornisNezetArt, UNI_SZIN: UNI_SZIN,
  kertAgyKoppint: kertAgyKoppint,
  VISSZA: VISSZA, visszaUgrik: visszaUgrik, terkepNyit: terkepNyit, terkepHol: function () { return TERKEP_HOL; }, terkepAll: function () { return LIGET_M && LIGET_M.all; }, BEMUTATAS: BEMUTATAS, bemutat: bemutat,   /* TÉRKÉP MINT KÖZPONT */
  renderSzekreny: renderSzekreny, utcaBoltNyit: utcaBoltNyit, renderUtca: renderUtca,   /* 3. kör: Szekrény + Bolt az utcán */
  utcaNyit: utcaNyit, szalonNyit: szalonNyit, szalonKefe: szalonKefe, szalonTegely: szalonTegely, szalonFestekVesz: szalonFestekVesz, szalonFest: szalonFest, FESTEKEK: FESTEKEK, szalonLakk: szalonLakk, szalonLakkoz: szalonLakkoz, LAKKOK: LAKKOK, szalonSzor: szalonSzor, szalonSzorFest: szalonSzorFest, SZORFESTEKEK: SZORFESTEKEK, jelKozel: jelKozel,           /* FODRÁSZAT */
  bankNyit: bankNyit, bankValtoKoppint: bankValtoKoppint, bankValt: bankValt, bankAllapot: bankAllapot, bankZarva: bankZarva, bankPalyaKesz: bankPalyaKesz, bankPalyaNyit: bankPalyaNyit,
  bankOsszevon: bankOsszevon, VALTASOK: VALTASOK, VALUTAK: VALUTAK, FELULIR: FELULIR, utcaMod: utcaMod,   /* 🏦 TÜNDÉRBANK */
  frizuraGondorArt: frizuraGondorArt,
  kertNyihog: kertNyihog, kertLepesHang: kertLepesHang,           /* kerti hangok (teszt/diagnosztika) */
  kertHangBufferek: function () { return KERT_BUF; }, kertLepesSzol: function () { return !!KERT_LEPES; },
  oduKertVesz: function (id) { var t = null; KERT_BOLT.forEach(function (x) { if (x.id === id) t = x; }); if (t) oduKertVesz(t); },
  napiKiemeltId: napiKiemeltId, napiKiemeltTeljesitve: napiKiemeltTeljesitve,
  /* producer-felülírások (4. fázis) — teszthez felhő nélkül is beállítható */
  get FELULIR() { return FELULIR; }, felulirOsszevon: felulirOsszevon,
  felulirBeallit: function (egyeni, csoportok, egyeniP, csoportP, egyeniOrak, csoportOrak) { FELULIR.egyeni = egyeni || {}; FELULIR.csoportok = csoportok || {}; FELULIR.egyeniP = egyeniP || {}; FELULIR.csoportP = csoportP || {}; FELULIR.egyeniOrak = egyeniOrak == null ? null : egyeniOrak; FELULIR.csoportOrak = csoportOrak || {}; felulirSzamol(); },
  egyeniPalyak: egyeniPalyak, palyaKeres: palyaKeres, palyaInditas: palyaInditas,
  palyaRejtve: palyaRejtve, palyaAjanlott: palyaAjanlott, palyaSzorzo: palyaSzorzo,
  nehezsegAlkalmaz: nehezsegAlkalmaz,
  /* Fejtörő-hegy — teszthez felhő nélkül is: UC.fejtoroBetoltHelyi(json) */
  get FT() { return FT; }, get FTJ() { return FTJ; }, fejtoroBetoltHelyi: fejtoroBetoltHelyi, fejtoroInditas: fejtoroInditas,
  fejtoroPalyak: fejtoroPalyak, ftValasz: ftValasz, ftSegit: ftSegit, ftMa: ftMa,
  palyaAllomasok: function (id) { var pa = palyaKeres(id); return nehezsegAlkalmaz(pa, pa.allomasok.map(function (a) { var o = {}, k; for (k in pa.alap) o[k] = pa.alap[k]; for (k in a) o[k] = a[k]; return o; })); }
};


/* ============ 6p) 🧰 SZERSZÁM-PÁLYA — egy létra-fok lefutása: olvasópult + válaszforma + 🛗 lift + végigvezetés ============
   Terv: Matekos\szerszam-letrak-terv.html (✅) · rajz: …-rajzterv.html (✅) · tartalom: …-tartalom.html (✅ döntések).
   2. kör (2026-10-09): a 📌 KOTOTT létra — 📖 Mesekönyv (5) · 📜 Varázstekercs (4) · 🏅 Mesterpróba (1), mind 🏆 dobogóval.
   A közös motoron fut (palyaInditas → GEN.szerszam → feladatMutat → ertekel → palyaVege); a pálya a játék-képernyő
   „olvasópult-módjában” (op-mod) jelenik meg: fent vékony ösvény-csík, középen a nyitott könyv, alatta közvetlenül a válasz.
   A tartalmat szerszámonként egy tábla adja (SZ_TARTALOM; most: SZK_TART a szerszam-kotott.js-ben):
     general(fok, i) → a pálya i. generált feladata · kicsi(nagy, k) → a 🛗 lift k. kicsije · mester(id) · mesterLista()
   🛗 LIFT (szerszam.js): csak a NAGY feladaton (📜 / 🏅). 1. rossz → a bagoly a nem stimmelő mondatot emeli ki;
   2. rossz → „Nézzük kicsiben” (a kicsi ugyanabban a mesében, a könyv bal lapjára csúszó kis füzetként, teljes jutalommal,
   beszámít); 2 jó kicsi → vissza ugyanarra a nagyra („Ügyes! Ugyanaz, csak öt kutyával.”); 3 kicsi után, vagy ha a nagy
   a lift után is kétszer rossz → a bagoly végigvezeti (a könyv második lapján), a pálya megy tovább.
   A 🙋 gomb: „🔎 Mit kérdeznek?” (még önálló) · „🔎 Nézzük kicsiben” (a pult kikapcsolhatja → „💡 Segíts még”, ez is liftet indít).
   A gyerek sosem hallja: könnyebb, Mesekönyv, visszalépés (a liftMondat ki is szűri). Nincs piros, nincs lefokozás. */

var SZ_TARTALOM = { KOTOTT: SZK_TART };
/* saját motorral futó szerszám: a feladatot maga adja (🧺 EGESZ: beírás az olvasó-polc motorján — szerszam-egesz.js) */
var SZ_SAJAT = {};
var SZ_KICSI_MEG = "Még egy ilyen!";

GEN.szerszam = function (cfg) {
  if (SZ_SAJAT[cfg.sz]) return SZ_SAJAT[cfg.sz](cfg);
  var T = SZ_TARTALOM[cfg.sz];
  if (!J.sz) J.sz = { sz: cfg.sz, eredm: [], L: null };
  var f = cfg.fok === "mester" ? T.mester(szMesterKiv(T.mesterLista()).fid) : T.general(cfg.fok, J.feladatKesz);
  var F = szFeladatKesz(f, cfg.sz, cfg.fok === "mese" ? "mese" : "nagy", null);
  if (cfg.fok === "mester") { F.op.mester = true; F.kartyaHTML = opKonyv(F.op); F.opElo = POLC_M.mester; }   /* 🏅 arany szegélyű pult (rajzterv 4. pont) */
  return F;
};
/* a tartalom-modul feladatából motor-feladat: mondatok (ismétlés nélkül), ellenőrzők, könyv, napló */
function szFeladatKesz(f, sz, szerep, nagy) {
  var lista = [], felt = [];
  f.mon.forEach(function (m) {
    if (!lista.length || lista[lista.length - 1] !== m.s) lista.push(m.s);
    if (m.f) felt.push({ mi: lista.length - 1, resz: m.resz || "", ki: m.ki || "", f: m.f, rend: m.rend != null ? m.rend : 99, sor: felt.length, tab: m.tab || 1 });
  });
  /* a hibajelzés a GONDOLATMENET sorrendjében keres (a kötött mondat az első), nem a szöveg sorrendjében
     (dobogó-javítás 3/1: a Tekercsben a kötött mondat szándékosan a végén van) */
  felt.sort(function (a, b) { return a.rend - b.rend || a.sor - b.sor; });
  f.sz = sz; f.szerep = szerep; f.csalad = "dobogo"; f.helyes = 1; f.lanc = null; f.felt = felt;
  f.op = { mondatok: lista, kerdes: f.kerdes, rajz: "" };       /* a jobb lapra maga a kirakó kerül (dobogo.js) */
  if (f.tabla && f.lepT) { f.lep = f.lepT; f.lepKezi = true; }  /* 📋 táblás feladatnál a végigvezetés tábla nyelven (✓ · kihúzás · ✗) */
  if (szerep === "kicsi") { f.nagy = nagy; f.op.fuzet = { mondatok: lista, kerdes: f.kerdes }; f.op.mondatok = nagy.op.mondatok; f.op.kerdes = nagy.op.kerdes; }
  f.kartyaHTML = opKonyv(f.op);
  f.szoveg = f.kerdes; f.felolvas = ekKiejt(lista.concat([f.kerdes]).join(" "));
  f.megoldas = f.joKiir; f.keplet = ""; f.tipp = "";
  f.naplo = { tipus: "sz-" + sz.toLowerCase() + "-" + f.fok, kerdes: f.kerdes.slice(0, 60), helyes: f.joKiir, atlepes: false };
  if (szerep === "nagy") J.sz.L = liftUj({ sz: sz, palya: J.palya.id, fok: f.fok, fid: f.fid });
  return f;
}
/* 🏅 melyik Mesterpróba, eredetiben vagy számváltozatban — a közös szabály (mester-valtozat.js): előbb a még nem látottak sorban,
   utána a legrégebben látott változatban; ha esedékes egy visszatérő ebből a listából, az jön. Pályánként egyszer választ. */
function szMesterKiv(lista) {
  if (J.sz.mv) return J.sz.mv;
  var V = mvValaszt(lista) || { fid: lista[0], F: null, valt: null, vissza: false };
  J.sz.mv = V; mvLatta(V);
  return V;
}
function szKicsi(nagy) {
  var k = SZ_TARTALOM[nagy.sz].kicsi(nagy, J.sz.L ? J.sz.L.kicsi : 0);
  if (nagy.tabla && k.dob) k.tabla = { auto: true };           /* 📋 kicsiben is tábla (a két sávos táblánál is), a bagoly segít kihúzni */
  return szFeladatKesz(k, nagy.sz, "kicsi", nagy);
}

/* ── megjelenítés (a feladatMutat hívja, miután a könyv a buborékba került) ── */
function szMutat(f) {
  opMod(true);
  opLetraCimke(null);                                     /* a 🧺 „N. kérdés:” felirat nem marad itt */
  var mester = f.fok === "mester" && f.szerep === "nagy";   /* 🏅 a Mesterpróbán nincs 🙋 és nincs előre 🔎 (rajzterv 4. pont, mint az olvasó-polcon) */
  dobogoMutat(f, { kesz: szKesz, segit: mester && !f.rakodas ? null : szSegitMenu, tabla: f.tabla || null, zarKatt: oeNoszog });   /* 📋 f.tabla: a Nyomozótábla (2. kör: a 📋 fok adja) */     /* előbb a kirakó a jobb lapra, utána a bal lap mérése */
  opLapol();
  if (f.opVegig) { f.opVegig = false; szVegigFut(f); return; }
  if (f.opElo) { var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 " + f.opElo; }   /* a lift / visszatérés mondata a könyv alatt is */
  if (szKeresKell(f)) { opFelolvas(f, function () { if (!szRakottMar()) szKeres(f); }); return; }   /* a kép felolvasás alatt is él (producer, 2026-10-18, A) */
  opFelolvas(f);
}
/* 🔎 „Mire felelsz?” (olvaso-ellenor.js) — 2. döntés: csak ha kell: a pálya első feladatánál és a liftben (a 🙋 a menüből) */
function szKeresKell(f) { return !f.oeKeresVolt && (f.szerep === "kicsi" || (J.feladatKesz === 0 && f.szerep !== "kicsi" && f.fok !== "mester")); }
function szKeres(f, mondat) {
  if (!J || J.feladat !== f) return;
  oeKeres(f, { szo: "", mondat: mondat || f.mitKerdez || "", kesz: function () { dobogoZar(false); } });
}
var SZ_KESZ_UJRA = "Ha minden a helyén van, koppints újra a Kész gombra!";   /* 🖊️ lektorra (A5) */
/* A5 (producer, 2026-10-18, A): a kép soha nem zár a „Mire felelsz?” miatt — a gyerek felolvasás közben is rakhat.
   Ha a felolvasás végén már rakott valamit, a kérdés-keret nem szakítja félbe: a Kész gombnál jön (szKesz). */
function szRakottMar() { return !!(DOB && (DOB.kez || DOB.hely.some(function (s) { return s.some(function (x) { return x != null; }); }))); }
function opMod(be) {
  var k = $("kepernyo-jatek"); if (!k) return;
  k.classList.toggle("op-mod", !!be);
  if (!be) { k.classList.remove("nt-mod"); opLetraCimke(null); }
  k.classList.remove("op-b1", "op-b2", "op-b3");
  if (be) k.classList.add("op-b" + opBetu());
  opBagsor(!!be);
}
/* 🦉 EGY HANG (tervlap 8/3, rajzterv 3. pont): az olvasópulton csak a bagoly beszél, és mindig a könyv alatt, jobbra ül;
   a buboréka a könyv szélén van, soha nem a kérdésen. A buborékba költözik minden, amit a bagoly mond: a visszajelzés sora
   (tipp, ✋ tábla, dicséret), a rövid bagoly-mondat és a talált holmi — nincs felugró ablak a feladat közben.
   Az elemek az azonosítójukkal együtt költöznek (a többi modul ugyanúgy írja őket); kilépéskor visszakerülnek a helyükre. */
function opBagsor(be) {
  var jt = document.querySelector("#kepernyo-jatek .jatekter"), sor = $("op-bagsor"); if (!jt) return;
  var bagoly = document.querySelector(".bagoly-figura");
  if (be) {
    if (!sor) {
      sor = el("div", "op-bagsor"); sor.id = "op-bagsor";
      sor.innerHTML = '<div id="op-bub" class="op-bub"></div><span class="op-bagoly-hely"></span>';
    }
    if (sor.parentNode !== jt || sor.previousElementSibling !== $("bagoly-buborek")) jt.insertBefore(sor, $("valaszter"));
    var bub = $("op-bub");
    ["talalt-buborek", "bagoly-mondat", "visszajelzes"].forEach(function (id) { var x = $(id); if (x && x.parentNode !== bub) bub.appendChild(x); });
    if (bagoly && bagoly.parentNode !== sor.lastChild) sor.lastChild.appendChild(bagoly);
    return;
  }
  if (!sor) return;
  var hely = $("vj-hely"); if (hely) hely.parentNode.insertBefore($("visszajelzes"), hely);
  jt.insertBefore($("talalt-buborek"), $("bagoly-buborek"));
  jt.insertBefore($("bagoly-mondat"), $("bagoly-buborek"));
  if (bagoly) jt.appendChild(bagoly);
  sor.remove();
}

/* ── a gyerek a „Kész!” gombra koppintott ── */
function szKesz(jo, A) {
  var f = J && J.feladat; if (!f || f.csalad !== "dobogo") return;
  if (oeKeresFut()) { oeNoszog(); return; }                   /* A5: a kérdés még nincs megkoppintva → előbb a kérdés */
  if (szKeresKell(f) && !f.vegigVolt) { opOlvasAll(); szKeres(f, SZ_KESZ_UJRA); return; }   /* A5: felolvasás közben rakta ki → most kéri a kérdést */
  opJelolTorol(); opOlvasAll();
  if (f.rakodas && segRakKesz(f, jo)) return;               /* 🐪 két megoldás: „Ez jó! De van még egy másik is.” (szerszam-egesz-mester.js) */
  if (jo) { dobogoZar(true); szJo(f); return; }
  szRossz(f, A);
}
function szJo(f) {
  var L = J.sz && J.sz.L, jo1 = J.probak < 2 && !f.vegigVolt;
  if (f.szerep === "kicsi") {
    var r = liftKicsi(L, jo1), nagy = f.nagy;
    if (r === "kicsi") { var k = szKicsi(nagy); k.opElo = SZ_KICSI_MEG; f.lanc = [k]; }
    else if (r === "vissza") { nagy.opElo = liftMondat("vissza", { nagy: nagy.tobb, utana: szAtadMondat(nagy) || nagy.vissza }); f.lanc = [nagy]; }
    else { nagy.opVegig = true; f.lanc = [nagy]; }               /* 3 kicsi után: együtt oldják meg a nagyot */
  } else if (f.szerep === "nagy") {
    liftJo(L);
    var ki = liftNagyKesz(L, !f.vegigVolt);
    if (ki) J.sz.eredm.push(ki);
    if (f.indok && !f.vegigVolt) f.utoMondat = f.indok;       /* „Válaszodat indokold!” → a bagoly elmondja (tartalom-lap 8/5) */
  } else szerszamKicsiJegyez(f.sz, J.palya.id, "mese", f.fid, jo1);
  ertekel(1);
}
/* 📋 próbacsapat 4. (🟡3): a bagoly eddig kihúzott (a kicsiben / a 📋 fok első 2 feladatában), most már a gyerek húz ki —
   ezt egyszer, pályánként egyszer kimondja. Visszaad: a mondat, vagy "" (nem táblás / már elhangzott / a bagoly húz ki). */
var SZ_ATAD = "Eddig én húztam ki a sort és az oszlopot. Most te húzod ki: egy koppintás, és ott a ✗!";   /* 🖊️ lektorra */
function szAtadMondat(f) {
  if (!f || !f.tabla || f.tabla.auto || !J.sz || J.sz.atadVolt) return "";
  J.sz.atadVolt = true;
  return SZ_ATAD;
}
/* az első mondat (vagy mondatrész), ami a gyerek elrendezésére nem igaz */
function szElsoHiba(f, A) {
  var V = f.nezet(A);
  for (var i = 0; i < f.felt.length; i++) { var c = f.felt[i]; try { if (!c.f(V)) return c; } catch (e) { return c; } }
  return null;
}
function szRossz(f, A) {
  rosszValaszKonyvel(f, "sorrend");
  var c = szElsoHiba(f, A);
  if (f.szerep === "nagy" && !f.vegigVolt) {
    var r = liftRossz(J.sz.L);
    if (r === "lift") { szLiftIndul(f); return; }
    if (r === "vegig") { szVegigFut(f); return; }
  } else if (J.probak >= 2) { szVegigFut(f); return; }
  szHibaMutat(f, c);
  figArc("gondol");
  ment();
}
function szHibaMutat(f, c) {
  if (f.rakodas) { segRakHiba(f); return; }                  /* 🐪 rakodás: senki nem ugrik vissza, a kosár-tipp jön */
  if (DOB && DOB.nt) dobogoHibaJelol(c && c.ki, c && c.tab); else dobogoVisszaRossz();   /* 📋 táblánál senki nem ugrik vissza, a hibás kocka kap keretet */
  var v = $("visszajelzes"), msg;
  if (c) {
    opJelol(c.mi, c.resz);
    msg = (c.resz ? "Nézd a kiemelt részt: „" + c.resz + "”." : "Nézd: " + (f.op.fuzet ? f.op.fuzet.mondatok : f.op.mondatok)[c.mi]) +
      (f.dob.sorok.length > 1 || !c.ki ? " Stimmel ez nálad?" : DOB && DOB.nt ? " A táblában hová tetted " + c.ki + " ✓-ét?" : " A te sorrendedben hol van " + c.ki + "?");
  } else msg = "Nézd meg újra a mondatokat, egyenként!";
  v.className = "visszajelzes ek-csapda"; v.textContent = msg;
  mondd(ekKiejt(msg));
}
/* 🛗 „Nézzük kicsiben” — a kicsi a nagy feladat helyére jön (a motor lanc-ja: nem új pötty) */
function szLiftIndul(nagy) {
  dobogoZar(true); opOlvasAll(); figyelStop();
  var k = szKicsi(nagy); k.opElo = liftMondat("indul");
  J.lancKov = k;
  $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "";
  setTimeout(function () { if (J && J.lancKov === k) ujFeladat(); }, 350);
}
/* végigvezetés: „a bagoly lapoz egyet”, és lépésenként a helyére teszi a szereplőket; a végén a gyerek koppint a Kész gombra */
function szVegigFut(f) {
  f.vegigVolt = true; J.probak = Math.max(J.probak, 2);
  if (f.szerep === "nagy" && J.sz && J.sz.L) liftVegig(J.sz.L);
  dobogoUrit(); dobogoZar(true); opOlvasAll(); opJelolTorol();
  opLepesLap();
  var i = 0, v = $("visszajelzes");
  v.className = "visszajelzes"; v.textContent = "🦉 Nézzük meg együtt, lépésenként!";
  function kov() {
    if (!J || J.feladat !== f) return;
    if (i >= f.lep.length) {
      var m = "Most már mindenki a helyén van. Koppints a Kész gombra!";
      opLepes("<b>" + m + "</b>"); dobogoZar(false);
      v.textContent = "🦉 " + m; mondd(m);
      return;
    }
    var l = f.lep[i++];
    opLepes(l.t);
    if (l.kosar && f.rakodas) rakKosarMutat(f);                  /* 🐪 „Előbb az összes súly” → a kis kosár előjön */
    (l.x2 || []).forEach(function (q) { dobogoNtXPar(q[0], q[1]); });   /* 📋 „X nem úszik.” → ✗ a pár-sávban */
    (l.tesz || []).forEach(function (t) { dobogoTesz(t[0], t[1], t[2]); if (!f.lepKezi) dobogoNtKihuzTesz(t[0], t[2]); });   /* 🔮/🏅: minden ✓ után kihúz */
    (l.ki || []).forEach(function (id) { dobogoNtKihuz(id); });   /* 📋 tábla nyelven: kihúzás és ✗ (sárgán felvillan) */
    (l.x || []).forEach(function (q) { dobogoNtX(q[0], q[1]); });
    mondd(ekKiejt(l.t), function () { setTimeout(kov, 350); });
  }
  mondd("Nézzük meg együtt, lépésenként!", kov);
}
/* 🙋 a dobogó alatt: első sor „Mit kérdeznek?”, mellette a lift („Nézzük kicsiben”) — csak a nagy feladaton */
function szSegitMenu(menu) {
  var f = J && J.feladat, L = J && J.sz && J.sz.L; if (!f || !menu) return;
  if (!menu.hidden) { menu.hidden = true; return; }
  var h = '<button type="button" class="kis-gomb" data-s="mit">🔎 Mit kérdeznek?</button>';
  if (f.rakodas && !f.rakodas.sulyLat && !f.vegigVolt) h = '<button type="button" class="kis-gomb" data-s="kosar">🧺 Tedd a kosárba!</button>' + h;   /* 🐪 a 🙋 első sora (rajzterv 2. döntés) */
  if (f.szerep === "nagy" && L && !L.lift && !f.vegigVolt) h += szerszamBeall().liftKer ? '<button type="button" class="kis-gomb" data-s="kicsi">🔎 Nézzük kicsiben</button>' : '<button type="button" class="kis-gomb" data-s="tovabb">💡 Segíts még</button>';
  menu.innerHTML = h; menu.hidden = false;
  Array.prototype.forEach.call(menu.querySelectorAll("button"), function (b) {
    b.addEventListener("click", function (ev) {
      ev.stopPropagation(); hangGomb(); menu.hidden = true;
      var s = b.getAttribute("data-s");
      if (s === "mit") {
        if (f.szerep === "nagy" && L) liftSegitseg(L, 1);            /* a ládában ez még önálló */
        opOlvasAll();
        oeKeres(f, { szo: "", mondat: f.mitKerdez || "", kesz: function () { dobogoZar(false); } });
      } else if (s === "kosar") segRakSegit(f);
      else if (s === "kicsi") { if (liftKer(L) === "lift") szLiftIndul(f); }
      else if (s === "tovabb") { if (liftSegitseg(L, 2) === "lift") szLiftIndul(f); }
    });
  });
}

/* ── a pálya vége (palyaVege hívja): 🏅 mester-szalag + jutalom, 🧰 láda ── */
function szPalyaVege() {
  var E = (J.sz && J.sz.eredm) || [], sz = J.palya.szerszam, html = "", mondat = "";
  var mester = E.some(function (x) { return x && x.mester; }), lada = E.some(function (x) { return x && x.ladaba; });
  var fok = J.palya.fok, d = SZERSZAMOK.filter(function (s) { return s.id === sz; })[0] || { ikon: "🧰", nev: "" }, sorok = [];   /* a közös végképernyőnek (bktVege) */
  var cim = fok === "mester" ? (mester ? "🏅 Mesterpróba kész!" : "🏅 Ügyes munka!") : { mese: "📖 Kész a mesekönyv!", tekercs: "📜 Kész a varázstekercs!", tabla: "📋 Kész a nyomozótábla!", gomb: "🔮 Kész a kristálygömb!" }[fok] || "🧰 Kész!";
  var V = fok === "mester" && J.sz ? J.sz.mv : null, x0 = E[0] || null, onallo = !!(x0 && x0.e === "o"), visszaJo = false, fenyes = null, plusz = 0;
  if (V && V.fid) {                                          /* 🏅 a közös szabály naplója (mester-valtozat.js) */
    if (V.vissza && onallo && !mester) {
      /* visszatérő, önállóan: fél jutalom, és ha van saját kockája, az kifényesedik (✦) — mint az olvasó-polcon */
      var fv = mvEredmeny(V.fid, true, true);
      visszaJo = true; fenyes = d.vkocka != null && ekKockaLista().indexOf(d.vkocka) >= 0 ? d.vkocka : null;   /* csak a már megszerzett kocka fényesedhet */
      P().csillampor += MV_VISSZA_CSILLA; J.futoCsilla += MV_VISSZA_CSILLA;
      P().tunderharmat = (P().tunderharmat || 0) + MV_VISSZA_HARMAT; plusz = MV_VISSZA_HARMAT;
      cim = "🏅 Emlékeztél a trükkre!";
      var tobbszor = fv > 10 ? " Már sokszor sikerült!" : fv > 1 ? " Már " + szorSzo(fv) + "." : "";
      sorok.push((fenyes != null ? "✦ A kockád kifényesedett a Kockavárban!" : szerszamT(sz).m ? "✦ A mester-szalagod kifényesedett!" : "✦ Ügyes! Ezt már tudod.") + tobbszor);
      html += '<br><span class="ek-vege">🏅 Emlékeztél a trükkre! +' + MV_VISSZA_CSILLA + ' ✨ · 💧 +' + MV_VISSZA_HARMAT + '</span>';
      mondat += " Emlékeztél a trükkre!";
    } else if (V.vissza) {
      mvEredmeny(V.fid, onallo, true);
      if (!mester) {
        cim = "🏅 Együtt sikerült!";
        sorok.push(d.vkocka != null && ekKockaLista().indexOf(d.vkocka) >= 0 ? "A kockád megmaradt a Kockavárban. Legközelebb újra visszajön." : "Legközelebb újra visszajön.");
      }
    } else mvEredmeny(V.fid, onallo);
  }
  if (mester) {
    P().csillampor += EK_MESTER_CSILLA; J.futoCsilla += EK_MESTER_CSILLA;
    P().tunderharmat = (P().tunderharmat || 0) + EK_MESTER_HARMAT;
    html += '<br><span class="ek-vege">🏅 Mesterpróba elsőre! A szerszámod mester-szalagot kapott. +' + EK_MESTER_CSILLA + ' ✨ · 💧 +' + EK_MESTER_HARMAT + '</span>';
    mondat += " Mesterpróba elsőre! A szerszámod mester-szalagot kapott.";
    sorok.push("🎀 A szerszámod mester-szalagot kapott.");
    if (d.vkocka != null) {                                  /* a szerszám saját kockája a Kockavárba (producer, 2026-10-10) */
      var ujKocka = ekVarBe(d.vkocka, true);
      sorok.push(ujKocka ? "Új kocka repült a Kockavárba!" : "A kockád ott ragyog a Kockavárban.");
    }
  }
  if (lada) {
    szerszamTar().ujLada = sz;                              /* a szekrényben a láda-pillanat (szerszam-polc.js) */
    html += '<br><span class="ek-vege">🧰 Ez a szerszám most már a tiéd. Bármikor elő tudod venni.</span>';
    mondat += " Ez a szerszám most már a tiéd. Bármikor elő tudod venni.";
    sorok.push("🧰 Ez a szerszám most már a tiéd: a " + d.ikon + " a ládába került.");
  }
  if (!sorok.length && fok !== "mester") sorok.push(d.ikon + " " + (/^[aeiouáéíóöőúüű]/i.test(d.nev) ? "Az" : "A") + " „" + d.nev + "” tábla fényesebb lett.");   /* „Az „Előbb az egész”” */
  ment();
  return { html: html, mondat: mondat, cim: cim, sorok: sorok, mesterKesz: mester || visszaJo, harmat: mester ? EK_MESTER_HARMAT : plusz, kocka: !!ujKocka, fenyes: fenyes,
    varKocka: d.vkocka != null && (mester || fenyes != null), adat: { sz: sz, fok: J.palya.fok, eredm: E.map(function (x) { return x ? x.e : ""; }).join(""), mester: mester ? 1 : 0, lada: lada ? 1 : 0,
    fid: V ? V.fid : "", valtozat: V && V.valt ? V.valt.id : "", vissza: V && V.vissza ? 1 : 0 } };
}
/* a vége-képernyő „következő” gombja: 📖 → 📜 → 📋 → 🔮 → 🏅 (a rejtett fokot átugorja), a Mesterpróba után vissza a szekrényhez */
var SZ_FOK_SOR = ["mese", "tekercs", "tabla", "gomb", "mester"];
function szKovetkezo(id) {
  var pa = palyaKeres(id); if (!pa) return null;
  for (var i = SZ_FOK_SOR.indexOf(pa.fok) + 1; i > 0 && i < SZ_FOK_SOR.length; i++) {
    var k = PALYAK.filter(function (x) { return x.szerszam === pa.szerszam && x.fok === SZ_FOK_SOR[i]; })[0];
    if (k && !palyaRejtve(k)) return k.id;
  }
  return null;
}

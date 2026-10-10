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
var SZ_KICSI_MEG = "Még egy ilyen!";

GEN.szerszam = function (cfg) {
  var T = SZ_TARTALOM[cfg.sz];
  if (!J.sz) J.sz = { sz: cfg.sz, eredm: [], L: null };
  var f = cfg.fok === "mester" ? T.mester(szMesterValaszt(cfg.sz, T.mesterLista())) : T.general(cfg.fok, J.feladatKesz);
  return szFeladatKesz(f, cfg.sz, cfg.fok === "mese" ? "mese" : "nagy", null);
};
/* a tartalom-modul feladatából motor-feladat: mondatok (ismétlés nélkül), ellenőrzők, könyv, napló */
function szFeladatKesz(f, sz, szerep, nagy) {
  var lista = [], felt = [];
  f.mon.forEach(function (m) {
    if (!lista.length || lista[lista.length - 1] !== m.s) lista.push(m.s);
    if (m.f) felt.push({ mi: lista.length - 1, resz: m.resz || "", ki: m.ki || "", f: m.f, rend: m.rend != null ? m.rend : 99, sor: felt.length });
  });
  /* a hibajelzés a GONDOLATMENET sorrendjében keres (a kötött mondat az első), nem a szöveg sorrendjében
     (dobogó-javítás 3/1: a Tekercsben a kötött mondat szándékosan a végén van) */
  felt.sort(function (a, b) { return a.rend - b.rend || a.sor - b.sor; });
  f.sz = sz; f.szerep = szerep; f.csalad = "dobogo"; f.helyes = 1; f.lanc = null; f.felt = felt;
  f.op = { mondatok: lista, kerdes: f.kerdes, rajz: "" };       /* a jobb lapra maga a kirakó kerül (dobogo.js) */
  if (szerep === "kicsi") { f.nagy = nagy; f.op.fuzet = { mondatok: lista, kerdes: f.kerdes }; f.op.mondatok = nagy.op.mondatok; f.op.kerdes = nagy.op.kerdes; }
  f.kartyaHTML = opKonyv(f.op);
  f.szoveg = f.kerdes; f.felolvas = ekKiejt(lista.concat([f.kerdes]).join(" "));
  f.megoldas = f.joKiir; f.keplet = ""; f.tipp = "";
  f.naplo = { tipus: "sz-" + sz.toLowerCase() + "-" + f.fok, kerdes: f.kerdes.slice(0, 60), helyes: f.joKiir, atlepes: false };
  if (szerep === "nagy") J.sz.L = liftUj({ sz: sz, palya: J.palya.id, fok: f.fok, fid: f.fid });
  return f;
}
function szMesterValaszt(sz, lista) { return szerszamMesterKov(sz, lista) || lista[veletlen(0, lista.length - 1)]; }   /* elfogyott: újra egy régi */
function szKicsi(nagy) {
  var k = SZ_TARTALOM[nagy.sz].kicsi(nagy, J.sz.L ? J.sz.L.kicsi : 0);
  return szFeladatKesz(k, nagy.sz, "kicsi", nagy);
}

/* ── megjelenítés (a feladatMutat hívja, miután a könyv a buborékba került) ── */
function szMutat(f) {
  opMod(true);
  dobogoMutat(f, { kesz: szKesz, segit: szSegitMenu });     /* előbb a kirakó a jobb lapra, utána a bal lap mérése */
  opLapol();
  if (f.opVegig) { f.opVegig = false; szVegigFut(f); return; }
  if (f.opElo) { var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "🦉 " + f.opElo; }   /* a lift / visszatérés mondata a könyv alatt is */
  opFelolvas(f);
}
function opMod(be) {
  var k = $("kepernyo-jatek"); if (!k) return;
  k.classList.toggle("op-mod", !!be);
  k.classList.remove("op-b1", "op-b2", "op-b3");
  if (be) k.classList.add("op-b" + opBetu());
}

/* ── a gyerek a „Kész!” gombra koppintott ── */
function szKesz(jo, A) {
  var f = J && J.feladat; if (!f || f.csalad !== "dobogo") return;
  opJelolTorol(); opOlvasAll();
  if (jo) { dobogoZar(true); szJo(f); return; }
  szRossz(f, A);
}
function szJo(f) {
  var L = J.sz && J.sz.L, jo1 = J.probak < 2 && !f.vegigVolt;
  if (f.szerep === "kicsi") {
    var r = liftKicsi(L, jo1), nagy = f.nagy;
    if (r === "kicsi") { var k = szKicsi(nagy); k.opElo = SZ_KICSI_MEG; f.lanc = [k]; }
    else if (r === "vissza") { nagy.opElo = liftMondat("vissza", { nagy: nagy.tobb, utana: nagy.vissza }); f.lanc = [nagy]; }
    else { nagy.opVegig = true; f.lanc = [nagy]; }               /* 3 kicsi után: együtt oldják meg a nagyot */
  } else if (f.szerep === "nagy") {
    liftJo(L);
    var ki = liftNagyKesz(L, !f.vegigVolt);
    if (ki) J.sz.eredm.push(ki);
    if (f.indok && !f.vegigVolt) f.utoMondat = f.indok;       /* „Válaszodat indokold!” → a bagoly elmondja (tartalom-lap 8/5) */
  } else szerszamKicsiJegyez(f.sz, J.palya.id, "mese", f.fid, jo1);
  ertekel(1);
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
  dobogoVisszaRossz();
  var v = $("visszajelzes"), msg;
  if (c) {
    opJelol(c.mi, c.resz);
    msg = (c.resz ? "Nézd a kiemelt részt: „" + c.resz + "”." : "Nézd: " + (f.op.fuzet ? f.op.fuzet.mondatok : f.op.mondatok)[c.mi]) +
      (f.dob.sorok.length > 1 || !c.ki ? " Stimmel ez nálad?" : " A te sorrendedben hol van " + c.ki + "?");
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
    (l.tesz || []).forEach(function (t) { dobogoTesz(t[0], t[1], t[2]); });
    mondd(ekKiejt(l.t), function () { setTimeout(kov, 350); });
  }
  mondd("Nézzük meg együtt, lépésenként!", kov);
}
/* 🙋 a dobogó alatt: első sor „Mit kérdeznek?”, mellette a lift („Nézzük kicsiben”) — csak a nagy feladaton */
function szSegitMenu(menu) {
  var f = J && J.feladat, L = J && J.sz && J.sz.L; if (!f || !menu) return;
  if (!menu.hidden) { menu.hidden = true; return; }
  var h = '<button type="button" class="kis-gomb" data-s="mit">🔎 Mit kérdeznek?</button>';
  if (f.szerep === "nagy" && L && !L.lift && !f.vegigVolt) h += szerszamBeall().liftKer ? '<button type="button" class="kis-gomb" data-s="kicsi">🔎 Nézzük kicsiben</button>' : '<button type="button" class="kis-gomb" data-s="tovabb">💡 Segíts még</button>';
  menu.innerHTML = h; menu.hidden = false;
  Array.prototype.forEach.call(menu.querySelectorAll("button"), function (b) {
    b.addEventListener("click", function (ev) {
      ev.stopPropagation(); hangGomb(); menu.hidden = true;
      var s = b.getAttribute("data-s");
      if (s === "mit") {
        if (f.szerep === "nagy" && L) liftSegitseg(L, 1);
        opKerdesVillan();
        mondd("Mit kérdeznek? " + ekKiejt(f.op.fuzet ? f.op.fuzet.kerdes : f.op.kerdes) + " " + f.mitKerdez);
      } else if (s === "kicsi") { if (liftKer(L) === "lift") szLiftIndul(f); }
      else if (s === "tovabb") { if (liftSegitseg(L, 2) === "lift") szLiftIndul(f); }
    });
  });
}

/* ── a pálya vége (palyaVege hívja): 🏅 mester-szalag + jutalom, 🧰 láda ── */
function szPalyaVege() {
  var E = (J.sz && J.sz.eredm) || [], sz = J.palya.szerszam, html = "", mondat = "";
  var mester = E.some(function (x) { return x && x.mester; }), lada = E.some(function (x) { return x && x.ladaba; });
  if (mester) {
    P().csillampor += EK_MESTER_CSILLA; J.futoCsilla += EK_MESTER_CSILLA;
    P().tunderharmat = (P().tunderharmat || 0) + EK_MESTER_HARMAT;
    html += '<br><span class="ek-vege">🏅 Mesterpróba elsőre! A szerszámod mester-szalagot kapott. +' + EK_MESTER_CSILLA + ' ✨ · 💧 +' + EK_MESTER_HARMAT + '</span>';
    mondat += " Mesterpróba elsőre! A szerszámod mester-szalagot kapott.";
  }
  if (lada) {
    szerszamTar().ujLada = sz;                              /* a szekrényben a láda-pillanat (szerszam-polc.js) */
    html += '<br><span class="ek-vege">🧰 Ez a szerszám most már a tiéd. Bármikor elő tudod venni.</span>';
    mondat += " Ez a szerszám most már a tiéd. Bármikor elő tudod venni.";
  }
  ment();
  return { html: html, mondat: mondat, adat: { sz: sz, fok: J.palya.fok, eredm: E.map(function (x) { return x ? x.e : ""; }).join(""), mester: mester ? 1 : 0, lada: lada ? 1 : 0 } };
}
/* a vége-képernyő „következő” gombja: 📖 → 📜 → 🏅, a Mesterpróba után vissza a szekrényhez */
function szKovetkezo(id) {
  var pa = palyaKeres(id); if (!pa) return null;
  var fok = { mese: "tekercs", tekercs: "mester" }[pa.fok]; if (!fok) return null;
  var k = PALYAK.filter(function (x) { return x.szerszam === pa.szerszam && x.fok === fok; })[0];
  return k && !palyaRejtve(k) ? k.id : null;
}

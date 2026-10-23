/* ============ 7) KÉPERNYŐK ============ */
function mutat(id) {
  var volt = document.querySelector(".kepernyo.aktiv");
  if (volt) volt.classList.remove("aktiv");
  $(id).classList.add("aktiv");
  document.body.classList.toggle("harmat-rejtett", nyitasHarmatRejtett());   /* 💧 újonc: a harmat a „harmat” napjáig nem látszik (nyitas.js) */
  if (id === "kepernyo-jatek" || id === "kepernyo-fejtoro") idomeroInd(); else idomeroAll();
  if (id === "kepernyo-vege") vegeGombok();
  megfKepernyo(id);   /* 🔍 pálya után hová ment (megf-naplo.js, láthatatlan) */
  if (FELHO.offline && HATIZSAK_BIZTOS[id]) felhoCsendesBelep();   /* 📴 net nélkül belépve: a térképen / profilválasztón próbál visszalépni a felhőbe */
}
/* (a kártyás unikornis-választó — renderProfil — 2026-10-23-án megszűnt: a választó a Belépő legelő, legelo.js) */
/* ── Ligetválasztó: a főképernyő két szintje ──
   FOMENU_LIGET = null → a festett ligettérkép (src/terkep.js: renderLigetTerkep — az unikornis odasétál a ligethez);
   különben annak a ligetnek a belseje, csak a saját kártyáival. Pálya / „← Liget” / Fejtörő után
   ugyanide jön vissza (a palyaInditas / fejtoroInditas jegyzi fel); odúból, utcáról, profilváltás
   után a választó jön (terkepNyit). A P().utolsoLiget gyerekenként mentve: ott áll az unikornis. */
var FOMENU_LIGET = null;
var LIGET_NEV = { egyeni: ["💖", "Neked készült"], fejtoro: ["🏔️", "Fejtörő-hegy"], osszeado: ["🌳", "Összeadó liget"], szorzo: ["🌙", "Szorzós liget"],
                  szabo: ["🧵", "Szabóműhely"], bajital: ["🧪", "Bájitalkonyha"], pekseg: ["🧁", "Mézes pékség"], konyvtar: ["📚", "Bagolykönyvtár"], vasar: ["🧺", "Tündérvásár"],
                  piac: ["🏪", "Piactér"] };   /* a falu csírája (piac.js) */
function palyaLiget(pa) { return pa.egyeni ? "egyeni" : (pa.regio || "osszeado"); }
function ligetJegyez(r) {
  FOMENU_LIGET = r; TERKEP_HOL = { leny: mentes.leny, id: r };   /* a térképen is itt áll majd */
  if (P().utolsoLiget !== r) { P().utolsoLiget = r; ment(); }
}
/* a térkép; ha hol adott (odu / utca / kert / egy liget), az unikornis ott áll majd — onnan jött ki (TERKEP_HOL) */
function terkepNyit(hol) {
  if (hol) TERKEP_HOL = { leny: mentes.leny, id: hol };
  FOMENU_LIGET = null; renderFomenu(); mutat("kepernyo-fomenu");
}
/* ── KÖZÖS „VISSZA” SZABÁLY (Térkép mint központ, 1. kör): minden helynek egy sor — ki a szülője, és mi a
   gomb felirata. A „Vissza” mindig egy szinttel feljebb visz, a felirat a célt mondja. Új helynél ide kerül egy sor.
   (A kivonulás-animációk — odú: szivárványhíd, utca: szivárványkapu, felhőkert: kilépés — a végén visszaUgrik-ot hívnak.) */
var VISSZA = {
  liget:   { szulo: "terkep", felirat: "← Térkép", gomb: "fomenu-vissza" },   /* a liget belseje (a gomb a térképen „🦄 Váltás”) */
  palya:   { szulo: "liget",  felirat: "← Liget",  gomb: "jatek-haza" },
  fejtoro: { szulo: "liget",  felirat: "← Liget",  gomb: "ft-haza" },
  odu:     { szulo: "terkep", felirat: "← Térkép", gomb: "odu-vissza" },
  kert:    { szulo: "terkep", felirat: "← Térkép", gomb: "kert-vissza" },
  utca:    { szulo: "terkep", felirat: "← Térkép", gomb: "utca-vissza" },
  szalon:  { szulo: "utca",   felirat: "← Utca",   gomb: "szalon-vissza" },
  bank:    { szulo: "utca",   felirat: "← Utca",   gomb: "bank-vissza" },
  tunemenykert: { szulo: "utca", felirat: "← Utca", gomb: "tk-vissza" }
};
function visszaFeliratok() {   /* indításkor: minden vissza-gomb a táblából kapja a feliratát */
  Object.keys(VISSZA).forEach(function (h) { var g = $(VISSZA[h].gomb); if (g && h !== "liget") g.textContent = VISSZA[h].felirat; });
}
/* egy szinttel feljebb a helyről: a térképen a hely mellett áll az unikornis, a ligetbe / utcára / odúba vissza */
function visszaUgrik(hely) {
  var sz = (VISSZA[hely] || {}).szulo || "terkep";
  if (sz === "liget") { renderFomenu(); mutat("kepernyo-fomenu"); }   /* FOMENU_LIGET még az a liget, ahonnan indult */
  else if (sz === "utca") utcaNyit();
  else if (sz === "odu") oduNyit(hely);
  else terkepNyit(hely === "liget" ? FOMENU_LIGET : hely);
}
/* ── EGYSZERI BEMUTATÁS (Térkép mint központ, 4. kör): az unikornis egyszer elmondja, mi változott, közben a
   szóban forgó hely felragyog. Gyerekenként mentve (P().bemutatva). Új bemutatás: egy sor ide + egy bemutat(kulcs) hívás. */
var BEMUTATAS = {
  terkep:   { kepernyo: "kepernyo-fomenu", ragyog: ['.terkep-hely[data-id="kert"] .hb', '.terkep-hely[data-id="utca"] .hb'],
              mondat: "Nézd, a kertünk mostantól itt van, a házunk mellett! A boltot az utcán találod." },
  szekreny: { kepernyo: "kepernyo-odu", ragyog: ["#odu-szekreny"],
              mondat: "Itt vannak a holmijaid. Vásárolni az utcai boltban lehet!" },
  /* 🚪 újonc (tervlap 4.③): az első végigjátszott pálya után az utca felragyog, az utcán a Bolt — a ✨ így kap értelmet */
  ujoncBolt: { kepernyo: "kepernyo-fomenu", ragyog: ['.terkep-hely[data-id="utca"] .hb'], feltetel: ujoncElsoBolt,
               mondat: "Gyere, vegyünk valamit a csillámporodból!" },
  ujoncBoltUtca: { kepernyo: "kepernyo-utca", ragyog: ["#utca-bolt"], feltetel: ujoncElsoBolt,
                   mondat: "Itt a Csillagbolt! Koppints rá!" }
};
/* az újonc már végigvitt egy pályát, és van ✨-je (nyitas.js) */
function ujoncElsoBolt() {
  var m = nyitasMenet(); if (!m || !(P().csillampor >= 15)) return false;
  var pk = P().palyak || {};
  return Object.keys(pk).some(function (id) { return pk[id] && pk[id].kesz; });
}
function bemutat(kulcs) {
  var b = BEMUTATAS[kulcs], leny = mentes.leny;
  if (!b || P().bemutatva[kulcs] || (b.feltetel && !b.feltetel())) return;
  setTimeout(function () {   /* előbb rendeződjön be a kép (és elhallgasson a belépő mondat) */
    if (!$(b.kepernyo).classList.contains("aktiv") || mentes.leny !== leny || P().bemutatva[kulcs]) return;
    if (b.feltetel && !b.feltetel()) return;
    if (kulcs === "terkep" && FOMENU_LIGET) return;   /* a liget belsejében nem — majd a térképen */
    P().bemutatva[kulcs] = 1; ment();
    b.ragyog.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (e) {
        e.classList.add("bemutat-ragyog"); setTimeout(function () { e.classList.remove("bemutat-ragyog"); }, 6500);
      });
    });
    mondd(typeof b.mondat === "function" ? b.mondat(P()) : b.mondat);
  }, 900);
}
/* 🚪 újonc-menet: ha ezen a képernyőn ma kinyílt valami, az unikornis egyszer elmondja, és a hely felragyog (nyitas.js NYITAS_BEMUTAT).
   hol: "terkep" | "odu" | "utca". Igaz, ha szólt (akkor más bemutatás ne szóljon egyszerre). */
function nyitasJelenet(hol, kepernyo) {
  var k = nyitasBemutatKell(hol); if (!k) return false;
  var leny = mentes.leny;
  setTimeout(function () {
    if (!$(kepernyo).classList.contains("aktiv") || mentes.leny !== leny) return;
    nyitasBemutatLatta(k);   /* csak ha tényleg elhangzik (ha közben elkoppintott, legközelebb újra) */
    (k.b.ragyog || []).forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (e) {
        e.classList.add("bemutat-ragyog"); setTimeout(function () { e.classList.remove("bemutat-ragyog"); }, 6500);
      });
    });
    mondd(typeof k.b.mondat === "function" ? k.b.mondat(P()) : k.b.mondat);
    if (k.id === "harmat") document.body.classList.remove("harmat-rejtett");   /* most bukkan elő a zsebből */
  }, 900);
  return true;
}
/* a pálya vége: „Tovább a ligetben” (a liget jelével) + „🗺️ Térkép” */
function vegeGombok() {
  var ln = LIGET_NEV[FOMENU_LIGET], bkt = BKT_VEGE;
  BKT_VEGE = false;                                /* 📚 a közös könyvtári végképernyő csak arra az egy megjelenésre (bktVege) */
  $("kepernyo-vege").classList.toggle("bkt-vege", bkt);
  $("vege-meg").hidden = !bkt;
  $("vege-terkep").hidden = bkt;
  if (!bkt) document.querySelector("#kepernyo-vege h2").textContent = "Megérkeztél!";
  $("vege-fomenu").textContent = bkt ? "📚 Vissza a polchoz" : (ln ? ln[0] + " " : "") + "Tovább a ligetben";
}
function ligetbeLep(r) { ligetJegyez(r); renderFomenu(); fomenuFelulre(); }
function fomenuFelulre() { var r = $("palya-racs"); if (r) r.scrollTop = 0; }
/* a fomenü pályái ligetenként, a megjelenítés sorrendjében (a választó és a liget-belső is ezt használja) */
function fomenuLigetek() {
  /* régiónként csoportosítunk, a PALYAK sorrendjét megtartva; a producer által elrejtett pálya nincs ott,
     a sorszámozás folyamatos marad (a gyerek ne lásson hézagot). Az egyéni pályák (4b) a saját ligetükben
     legfölül vannak, sorszám nélkül — így a közös pályák számai nem tolódnak el. */
  var regiok = {}, regioSorrend = [], lathato = 0;
  egyeniPalyak().concat(PALYAK).forEach(function (pa) {
    if (palyaRejtve(pa)) return;
    var idx = (pa.egyeni || pa.konyvtar || pa.szerszam || pa.polc) ? null : lathato++, r = palyaLiget(pa);   /* könyvtár: szárnyonként saját sorszám (ekKartyaDisz) */
    if (!regiok[r]) { regiok[r] = []; regioSorrend.push(r); }
    regiok[r].push({ pa: pa, idx: idx });
  });
  /* 🏔️ Fejtörő-hegy (versenyfeladatok, csak belépve): a „Neked készült” után, mindig nyitva, sorszám nélkül */
  var ftL = fejtoroPalyak();
  if (ftL.length) {
    regiok.fejtoro = ftL.map(function (pa) { return { pa: pa, idx: null }; });
    regioSorrend.splice(regioSorrend[0] === "egyeni" ? 1 : 0, 0, "fejtoro");
  }
  /* 📚 Bagolykönyvtár közvetlenül a Fejtörő-hegy előtt („itt tanulunk, ott versenyzünk”) */
  var kvI = regioSorrend.indexOf("konyvtar");
  if (kvI >= 0) {
    regioSorrend.splice(kvI, 1);
    var ftI = regioSorrend.indexOf("fejtoro");
    regioSorrend.splice(ftI >= 0 ? ftI : (regioSorrend[0] === "egyeni" ? 1 : 0), 0, "konyvtar");
  }
  return { regiok: regiok, sorrend: regioSorrend };
}
/* egy liget összesítője a térképhez: ⭐ kész/összes, legfeljebb 2 jelzés, alszik-e (minden ösvénye zárva) */
function ligetOsszegzo(r, lista) {
  var napiId = napiKiemeltId(), napiKesz = napiKiemeltTeljesitve();
  var kesz = 0, ossz = 0, nyitott = 0, j = { napi: false, ajanlott: false, bank: false };
  lista.forEach(function (rec) {
    var pa = rec.pa;
    if (r === "fejtoro") { ossz++; nyitott++; if ((ftAllapot().palyak[pa.id] || {}).kesz) kesz++; return; }
    if (pa.hamarosan) return;
    ossz++;
    var prc = P().palyak[pa.id]; if (prc && prc.kesz) kesz++;
    if (!palyaZarva(pa) && !palyaElfogyott(pa)) nyitott++;
    if (pa.id === napiId && !napiKesz) j.napi = true;
    if (palyaAjanlott(pa)) j.ajanlott = true;
    if (bankPalyaNyit(pa.id) && nyitasEbren("bank")) j.bank = true;
  });
  var jelzes = [];   /* fontossági sorrend (tervlap 2.): 💧 napi → 💖 ajánlott → 🏦 bank → 💖 egyéni */
  if (j.napi && !nyitasHarmatRejtett()) jelzes.push("💧");
  if (j.ajanlott) jelzes.push("💖");
  if (j.bank) jelzes.push("🏦");
  if (r === "egyeni" && jelzes.indexOf("💖") < 0) jelzes.push("💖");
  return { kesz: kesz, ossz: ossz, alszik: ossz > 0 && nyitott === 0, jelzes: jelzes.slice(0, 2) };
}
function renderFomenu() {
  $("fomenu-csillampor").textContent = P().csillampor;
  var hb = $("fomenu-hatter"); if (hb && !hb.innerHTML) hb.innerHTML = FOMENU_HATTER;
  var racs = $("palya-racs"); racs.innerHTML = "";
  var REGIO_HATTER = { osszeado: FOMENU_HATTER, szorzo: SZORZOS_HATTER, fejtoro: FEJTORO_HATTER,
                      szabo: MERES_HATTER.szabo, bajital: MERES_HATTER.bajital, pekseg: MERES_HATTER.pekseg, vasar: VASAR_HATTER };   /* mérés-ligetek: réteges műhely-háttér (meres.js) */   /* mindkét liget saját jelenetet kap */
  var L = fomenuLigetek(), regiok = L.regiok;
  if (FOMENU_LIGET && !regiok[FOMENU_LIGET]) FOMENU_LIGET = null;   /* közben elrejtették a pulton → vissza a választóra */
  var bent = FOMENU_LIGET;
  $("kepernyo-fomenu").classList.toggle("liget-bent", !!bent);
  $("kepernyo-fomenu").classList.toggle("terkep-mod", !bent);
  if (!bent) $("kepernyo-fomenu").classList.remove("bkt-mod");
  $("fomenu-vissza").textContent = bent ? VISSZA.liget.felirat : "🦄 Váltás";
  $("fomenu-cim").textContent = bent ? (LIGET_NEV[bent] || ["", ""]).join(" ").trim() : "Hová menjünk ma?";
  var ossz = 0, jo = 0;
  (P().naplo || []).forEach(function (r) { ossz++; if (r.elsore) jo++; });
  $("ma-statisztika").textContent = ossz ? ("Eddig " + ossz + " feladatot próbáltál, " + jo + " sikerült elsőre.") : "";
  ligetUniReteg();                               /* bent: az unikornis a kártyák alatt (terkep.js); a térképen nincs réteg */
  if (!bent) { renderLigetTerkep(racs, L); return; }
  var _napiId = napiKiemeltId(), _napiKesz = napiKiemeltTeljesitve();
  function keszitKartya(pa, idx) {
    var prc = P().palyak[pa.id];
    var kesz = prc && prc.kesz, arany = prc && prc.arany;
    var bontas = (pa.id === "bontas-felmondas");
    var feladatErtek = bontas ? jutalom("felmondas", pa) : jutalom("feladat", pa);
    var vegig = pa.hamarosan ? 0 : palyaBecsultErtek(pa);
    var mat = PALYA_MAT[pa.id] || pa.palcim;
    var zarva = palyaZarva(pa);
    var alszikNy = zarva && nyitasPalyaAlszik(pa);   /* 🚪 újonc-menet: sorban ébrednek (nyitas.js) — 💤, nem lakat */
    var elfogyott = !zarva && palyaElfogyott(pa);   /* darabkorlát (pult): erre a szakaszra elég volt */
    var napiEz = (pa.id === _napiId);
    var kart = el("div", "palya-kartya" + (pa.hamarosan ? " hamarosan" : "") + (zarva ? " zarva" : "") + (alszikNy ? " ny-alszik" : "") + (elfogyott ? " elfogyott" : "") + (arany ? " arany" : (kesz ? " kesz" : ""))
      + (napiEz ? (_napiKesz ? " napi-kiemelt-kesz" : " napi-kiemelt") : "") + (!zarva && nyitasPalyaVilagit(pa) ? " ny-vilagit" : ""));
    var napiBadge = napiEz
      ? '<div class="napi-badge">' + (_napiKesz ? "✓" : nyitasHarmatRejtett() ? "⭐" : "💧+" + NAPI_KIEMELT_HARMAT) + '</div>'
      : "";
    var ajanlott = !pa.hamarosan && palyaAjanlott(pa);   /* producer ajánlása (4. fázis) — befejezéskor +AJANLOTT_HARMAT 💧 */
    if (ajanlott) kart.classList.add("ajanlott");
    var bankos = !pa.hamarosan && nyitasEbren("bank") && bankPalyaNyit(pa.id);   /* 🏦 Tündérbank: kijelölt pálya → végigvitele 1 váltást ér */
    kart.innerHTML =
      (idx == null ? '' : '<div class="sorszam">' + (idx + 1) + '</div>') +
      '<div class="allapot">' + (alszikNy ? "💤" : zarva ? "🔒" : elfogyott ? "🌙" : (arany ? "🌟" : (kesz ? "⭐" : (pa.hamarosan ? "🔜" : "")))) + '</div>' +
      napiBadge +
      (ajanlott ? '<div class="ajanlott-badge" title="Neked ajánlom">💖</div>' : '') +
      kuldKartyaJel(pa) +   /* 🐉 pikkely: ezt kéri a kis sárkány (sarkany-holmi.js) */
      '<div class="ikon">' + (PALYA_IKON[pa.id] ? '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' + PALYA_IKON[pa.id] + '</svg>' : pa.ikon) + '</div>' +
      '<div class="pnev">' + kiiras(pa.nev) + '</div>' +
      '<div class="palcim">' + kiiras(mat) + '</div>' +
      (bankos ? '<div class="bank-badge" title="Ha végigviszed, válthatsz a Tündérbankban">🏦 bankot nyit</div>' : '') +
      (pa.hamarosan ? "" :
        '<div class="also"><span class="jutalom">≈ ' + vegig + ' ✨</span><button class="palya-felolvas" title="Olvasd fel">🔊</button></div>');
    kart.addEventListener("click", function () {
      hangGomb();
      if (pa.hamarosan) { mondd("Ez az ösvény hamarosan nyílik meg!"); return; }
      if (zarva) { mondd(alszikNy ? NYITAS_MONDAT.palyaAlszik : pa.konyvtar ? ekLakatMondat(pa) : zarvaMondat()); return; }
      if (elfogyott) { mondd(elfogyottMondat()); return; }
      ligetUget(kart, function () { palyaInditas(pa.id); });   /* odaüget a kártyához, aztán indul */
    });
    var fbtn = kart.querySelector(".palya-felolvas");
    if (fbtn) fbtn.addEventListener("click", function (e) {
      e.stopPropagation(); hangGomb();
      var mondat = kiiras(pa.nev) + ". " + mat + ". Az egész pálya körülbelül " + vegig + " csillámpor." +
        " Ha egy állomást sem hagysz ki, arany csillagszilánk jár és dupla záró-jutalom.";
      var rejt = nyitasHarmatRejtett();   /* 💧 újonc: a harmatot még nem emlegetjük */
      if (ajanlott) mondat += " Ezt most neked ajánlom!" + (rejt ? "" : " Plusz " + AJANLOTT_HARMAT + " tündérharmat jár érte.");
      if (pa.teny) mondat += " Ezt az ösvényt a tündérek mindig a te feladataidból rakják össze, minden alkalommal újat!";
      else if (pa.egyeni) mondat += " Ezt az ösvényt csak neked készítették!";
      if (bankos) mondat += " Ha végigviszed, a Tündérbankban válthatsz!";
      if (napiEz && !_napiKesz) mondat += " Ez a mai kiemelt pálya!" + (rejt ? "" : " Plusz " + NAPI_KIEMELT_HARMAT + " tündérharmat jár érte.");
      if (kuldKertPalya(pa.id)) mondat += " Ezt kéri a kis sárkány!";
      mondd(mondat);
    });
    if (pa.konyvtar) ekKartyaDisz(pa, kart, zarva);   /* kocka-napok ▢▢▢, 🏅, sorszám, lakat-felirat */
    return kart;
  }
  var hivMondat = nyitasVersHivas(bent);         /* 🌰🎵 elakadás után: „Mondjuk el együtt a bontásokat!” (nyitas.js) */
  if (hivMondat) setTimeout(function () { if (FOMENU_LIGET === bent) mondd(hivMondat); }, 900);
  (function (regio) {                            /* a liget belseje: a mai régió-panel, egyedül */
    var szek = el("div", "palya-regio r-" + regio);
    $("kepernyo-fomenu").classList.toggle("bkt-mod", regio === "konyvtar");   /* 📚 a terem kitölti a képernyőt */
    if (REGIO_HATTER[regio]) { var bgEl = el("div", "palya-regio-hatter"); bgEl.innerHTML = REGIO_HATTER[regio]; szek.appendChild(bgEl); }
    szek.appendChild(el("div", "palya-regio-cim", (LIGET_NEV[regio] || ["", ""]).join(" ").trim()));
    if (regio === "konyvtar") {                    /* 📚 egy terem: olvasó-polc · ablak + Kockavár + olvasópult · szekrény + láda · Csillagtorony-ajtó (konyvtar-terem.js) */
      szek.querySelector(".palya-regio-cim").textContent = "📚 Bagolykönyvtár · 🌙 Holdfény-terem";
      szek.appendChild(bktTerem());
      racs.appendChild(szek);
      setTimeout(ligetUniAlap, 0);                   /* az unikornis az olvasópult mellé áll (terkep.js) */
      return;
    }
    if (regio === "piac") {                        /* 🏪 a kis falutérkép: a bolt háza = a pálya, az unikornis odasétál (piac.js) */
      szek.appendChild(piacTer(regiok.piac));
      racs.appendChild(szek);
      return;
    }
    var grid = el("div", "palya-regio-grid");
    regiok[regio].forEach(function (rec) { grid.appendChild(regio === "fejtoro" ? fejtoroKartya(rec.pa) : keszitKartya(rec.pa, rec.idx)); });
    szek.appendChild(grid);
    racs.appendChild(szek);
  })(bent);
}

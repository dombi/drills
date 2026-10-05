/* ============ 7) KÉPERNYŐK ============ */
function mutat(id) {
  var volt = document.querySelector(".kepernyo.aktiv");
  if (volt) volt.classList.remove("aktiv");
  $(id).classList.add("aktiv");
  if (id === "kepernyo-jatek" || id === "kepernyo-fejtoro") idomeroInd(); else idomeroAll();
}
function renderProfil() {
  var lista = $("profil-lista"); lista.innerHTML = "";
  LENY_SORREND.forEach(function (k) {
    var c = LENYEK[k], p = mentes.profilok[k];
    var keszDb = PALYAK.filter(function (x) { return !x.hamarosan && !palyaRejtve(x) && p.palyak[x.id] && p.palyak[x.id].kesz; }).length;
    var palyaOssz = PALYAK.filter(function (x) { return !x.hamarosan && !palyaRejtve(x); }).length;
    var jelvDb = Object.keys(p.jelvenyek || {}).length;
    var kart = el("div", "profil-kartya");
    kart.innerHTML =
      '<svg viewBox="-78 -132 156 150" xmlns="http://www.w3.org/2000/svg">' +
      unikornisSVG("p" + k, c, 0.9, p.oltozet, p.kinezet || null) + '</svg>' +
      '<div class="nev">' + (p.becenev ? kiiras(p.becenev) + " · " : "") + c.nev + '</div>' +
      '<div class="adat">✨ ' + p.csillampor + ' &nbsp;·&nbsp; 🌟 ' + keszDb + '/' + palyaOssz +
      (jelvDb ? ' &nbsp;·&nbsp; 🏅 ' + jelvDb : '') + '</div>';
    kart.addEventListener("click", function () { hangGomb(); mentes.leny = k; ment(); terkepNyit(); });
    lista.appendChild(kart);
  });
}
/* ── Ligetválasztó: a főképernyő két szintje ──
   FOMENU_LIGET = null → a festett ligettérkép (src/terkep.js: renderLigetTerkep — az unikornis odasétál a ligethez);
   különben annak a ligetnek a belseje, csak a saját kártyáival. Pálya / Haza / Fejtörő után
   ugyanide jön vissza (a palyaInditas / fejtoroInditas jegyzi fel); odúból, utcáról, profilváltás
   után a választó jön (terkepNyit). A P().utolsoLiget gyerekenként mentve: ott áll az unikornis. */
var FOMENU_LIGET = null;
var LIGET_NEV = { egyeni: ["💖", "Neked készült"], fejtoro: ["🏔️", "Fejtörő-hegy"], osszeado: ["🌳", "Összeadó liget"], szorzo: ["🌙", "Szorzós liget"],
                  szabo: ["🧵", "Szabóműhely"], bajital: ["🧪", "Bájitalkonyha"], pekseg: ["🧁", "Mézes pékség"], konyvtar: ["📚", "Bagolykönyvtár"], vasar: ["🧺", "Tündérvásár"] };
function palyaLiget(pa) { return pa.egyeni ? "egyeni" : (pa.regio || "osszeado"); }
function ligetJegyez(r) {
  FOMENU_LIGET = r; TERKEP_HOL = { leny: mentes.leny, id: r };   /* a térképen is itt áll majd */
  if (P().utolsoLiget !== r) { P().utolsoLiget = r; ment(); }
}
function terkepNyit() { FOMENU_LIGET = null; renderFomenu(); mutat("kepernyo-fomenu"); }
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
    var idx = (pa.egyeni || pa.konyvtar) ? null : lathato++, r = palyaLiget(pa);   /* könyvtár: szárnyonként saját sorszám (ekKartyaDisz) */
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
    if (bankPalyaNyit(pa.id)) j.bank = true;
  });
  var jelzes = [];   /* fontossági sorrend (tervlap 2.): 💧 napi → 💖 ajánlott → 🏦 bank → 💖 egyéni */
  if (j.napi) jelzes.push("💧");
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
  $("fomenu-vissza").textContent = bent ? "← Térkép" : "🦄 Váltás";
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
    var elfogyott = !zarva && palyaElfogyott(pa);   /* darabkorlát (pult): erre a szakaszra elég volt */
    var napiEz = (pa.id === _napiId);
    var kart = el("div", "palya-kartya" + (pa.hamarosan ? " hamarosan" : "") + (zarva ? " zarva" : "") + (elfogyott ? " elfogyott" : "") + (arany ? " arany" : (kesz ? " kesz" : ""))
      + (napiEz ? (_napiKesz ? " napi-kiemelt-kesz" : " napi-kiemelt") : ""));
    var napiBadge = napiEz
      ? '<div class="napi-badge">' + (_napiKesz ? "✓" : "💧+" + NAPI_KIEMELT_HARMAT) + '</div>'
      : "";
    var ajanlott = !pa.hamarosan && palyaAjanlott(pa);   /* producer ajánlása (4. fázis) — befejezéskor +AJANLOTT_HARMAT 💧 */
    if (ajanlott) kart.classList.add("ajanlott");
    var bankos = !pa.hamarosan && bankPalyaNyit(pa.id);   /* 🏦 Tündérbank: kijelölt pálya → végigvitele 1 váltást ér */
    kart.innerHTML =
      (idx == null ? '' : '<div class="sorszam">' + (idx + 1) + '</div>') +
      '<div class="allapot">' + (zarva ? "🔒" : elfogyott ? "🌙" : (arany ? "🌟" : (kesz ? "⭐" : (pa.hamarosan ? "🔜" : "")))) + '</div>' +
      napiBadge +
      (ajanlott ? '<div class="ajanlott-badge" title="Neked ajánlom">💖</div>' : '') +
      '<div class="ikon">' + (PALYA_IKON[pa.id] ? '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' + PALYA_IKON[pa.id] + '</svg>' : pa.ikon) + '</div>' +
      '<div class="pnev">' + kiiras(pa.nev) + '</div>' +
      '<div class="palcim">' + kiiras(mat) + '</div>' +
      (bankos ? '<div class="bank-badge" title="Ha végigviszed, válthatsz a Tündérbankban">🏦 bankot nyit</div>' : '') +
      (pa.hamarosan ? "" :
        '<div class="also"><span class="jutalom">≈ ' + vegig + ' ✨</span><button class="palya-felolvas" title="Olvasd fel">🔊</button></div>');
    kart.addEventListener("click", function () {
      hangGomb();
      if (pa.hamarosan) { mondd("Ez az ösvény hamarosan nyílik meg!"); return; }
      if (zarva) { mondd(pa.konyvtar ? ekLakatMondat(pa) : zarvaMondat()); return; }
      if (elfogyott) { mondd(elfogyottMondat()); return; }
      ligetUget(kart, function () { palyaInditas(pa.id); });   /* odaüget a kártyához, aztán indul */
    });
    var fbtn = kart.querySelector(".palya-felolvas");
    if (fbtn) fbtn.addEventListener("click", function (e) {
      e.stopPropagation(); hangGomb();
      var mondat = kiiras(pa.nev) + ". " + mat + ". Az egész pálya körülbelül " + vegig + " csillámpor." +
        " Ha egy állomást sem hagysz ki, arany csillagszilánk jár és dupla záró-jutalom.";
      if (ajanlott) mondat += " Ezt most neked ajánlom! Plusz " + AJANLOTT_HARMAT + " tündérharmat jár érte.";
      if (pa.egyeni) mondat += " Ezt az ösvényt csak neked készítették!";
      if (bankos) mondat += " Ha végigviszed, a Tündérbankban válthatsz!";
      if (napiEz && !_napiKesz) mondat += " Ez a mai kiemelt pálya! Plusz " + NAPI_KIEMELT_HARMAT + " tündérharmat jár érte.";
      mondd(mondat);
    });
    if (pa.konyvtar) ekKartyaDisz(pa, kart, zarva);   /* kocka-napok ▢▢▢, 🏅, sorszám, lakat-felirat */
    return kart;
  }
  (function (regio) {                            /* a liget belseje: a mai régió-panel, egyedül */
    var szek = el("div", "palya-regio r-" + regio);
    if (REGIO_HATTER[regio]) { var bgEl = el("div", "palya-regio-hatter"); bgEl.innerHTML = REGIO_HATTER[regio]; szek.appendChild(bgEl); }
    szek.appendChild(el("div", "palya-regio-cim", (LIGET_NEV[regio] || ["", ""]).join(" ").trim()));
    if (regio === "konyvtar") {                    /* szárnyanként (🌙 Holdfény-szárny, ✨ Csillagtorony) egy sor, fejléccel */
      var szSor = [];
      regiok[regio].forEach(function (rec) { if (szSor.indexOf(rec.pa.szarny) < 0) szSor.push(rec.pa.szarny); });
      szSor.forEach(function (sz) {
        szek.appendChild(el("div", "ek-szarny-cim", ekSzarnyNev(sz, true)));
        var kSor = [], kP = {};                    /* kockánként egy sor: 📖 Mesekönyv → 📜 Varázstekercs → 🏅 */
        regiok[regio].forEach(function (rec) { if (rec.pa.szarny !== sz) return; if (!kP[rec.pa.kocka]) { kP[rec.pa.kocka] = []; kSor.push(rec.pa.kocka); } kP[rec.pa.kocka].push(rec.pa); });
        var g = el("div", "ek-kocka-sorok");
        kSor.forEach(function (k) { g.appendChild(ekMenuSor(kP[k], function (pa) { return keszitKartya(pa, null); })); });
        szek.appendChild(g);
      });
      racs.appendChild(szek);
      ekLigetHatter(szek);
      return;
    }
    var grid = el("div", "palya-regio-grid");
    regiok[regio].forEach(function (rec) { grid.appendChild(regio === "fejtoro" ? fejtoroKartya(rec.pa) : keszitKartya(rec.pa, rec.idx)); });
    szek.appendChild(grid);
    racs.appendChild(szek);
  })(bent);
}

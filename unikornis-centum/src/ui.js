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
    kart.addEventListener("click", function () { hangGomb(); mentes.leny = k; ment(); renderFomenu(); mutat("kepernyo-fomenu"); });
    lista.appendChild(kart);
  });
}
function renderFomenu() {
  $("fomenu-csillampor").textContent = P().csillampor;
  var hb = $("fomenu-hatter"); if (hb && !hb.innerHTML) hb.innerHTML = FOMENU_HATTER;
  var racs = $("palya-racs"); racs.innerHTML = "";
  var REGIO_CIM = { egyeni: "💖 Neked készült", fejtoro: "🏔️ Fejtörő-hegy", osszeado: "🌳 Összeadó liget", szorzo: "🌙 Szorzós liget" };
  var REGIO_HATTER = { osszeado: FOMENU_HATTER, szorzo: SZORZOS_HATTER, fejtoro: FEJTORO_HATTER };   /* mindkét liget saját jelenetet kap */
  /* régiónként csoportosítunk, a PALYAK sorrendjét megtartva; a producer által elrejtett pálya nincs ott,
     a sorszámozás folyamatos marad (a gyerek ne lásson hézagot). Az egyéni pályák (4b) a saját ligetükben
     legfölül vannak, sorszám nélkül — így a közös pályák számai nem tolódnak el. */
  var regiok = {}, regioSorrend = [], lathato = 0;
  egyeniPalyak().concat(PALYAK).forEach(function (pa) {
    if (palyaRejtve(pa)) return;
    var idx = pa.egyeni ? null : lathato++, r = pa.regio || "osszeado";
    if (!regiok[r]) { regiok[r] = []; regioSorrend.push(r); }
    regiok[r].push({ pa: pa, idx: idx });
  });
  /* 🏔️ Fejtörő-hegy (versenyfeladatok, csak belépve): a „Neked készült” után, mindig nyitva, sorszám nélkül */
  var ftL = fejtoroPalyak();
  if (ftL.length) {
    regiok.fejtoro = ftL.map(function (pa) { return { pa: pa, idx: null }; });
    regioSorrend.splice(regioSorrend[0] === "egyeni" ? 1 : 0, 0, "fejtoro");
  }
  var _napiId = napiKiemeltId(), _napiKesz = napiKiemeltTeljesitve();
  function keszitKartya(pa, idx) {
    var prc = P().palyak[pa.id];
    var kesz = prc && prc.kesz, arany = prc && prc.arany;
    var bontas = (pa.id === "bontas-felmondas");
    var feladatErtek = bontas ? jutalom("felmondas", pa) : jutalom("feladat", pa);
    var vegig = pa.hamarosan ? 0 : palyaBecsultErtek(pa);
    var mat = PALYA_MAT[pa.id] || pa.palcim;
    var zarva = palyaZarva(pa);
    var napiEz = (pa.id === _napiId);
    var kart = el("div", "palya-kartya" + (pa.hamarosan ? " hamarosan" : "") + (zarva ? " zarva" : "") + (arany ? " arany" : (kesz ? " kesz" : ""))
      + (napiEz ? (_napiKesz ? " napi-kiemelt-kesz" : " napi-kiemelt") : ""));
    var napiBadge = napiEz
      ? '<div class="napi-badge">' + (_napiKesz ? "✓" : "💧+" + NAPI_KIEMELT_HARMAT) + '</div>'
      : "";
    var ajanlott = !pa.hamarosan && palyaAjanlott(pa);   /* producer ajánlása (4. fázis) — befejezéskor +AJANLOTT_HARMAT 💧 */
    if (ajanlott) kart.classList.add("ajanlott");
    kart.innerHTML =
      (idx == null ? '' : '<div class="sorszam">' + (idx + 1) + '</div>') +
      '<div class="allapot">' + (zarva ? "🔒" : (arany ? "🌟" : (kesz ? "⭐" : (pa.hamarosan ? "🔜" : "")))) + '</div>' +
      napiBadge +
      (ajanlott ? '<div class="ajanlott-badge" title="Neked ajánlom">💖</div>' : '') +
      '<div class="ikon">' + (PALYA_IKON[pa.id] ? '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' + PALYA_IKON[pa.id] + '</svg>' : pa.ikon) + '</div>' +
      '<div class="pnev">' + kiiras(pa.nev) + '</div>' +
      '<div class="palcim">' + kiiras(mat) + '</div>' +
      (pa.hamarosan ? "" :
        '<div class="also"><span class="jutalom">≈ ' + vegig + ' ✨</span><button class="palya-felolvas" title="Olvasd fel">🔊</button></div>');
    kart.addEventListener("click", function () {
      hangGomb();
      if (pa.hamarosan) { mondd("Ez az ösvény hamarosan nyílik meg!"); return; }
      if (zarva) { mondd("Ez az ösvény most alszik. Mondd fel a bontásokat és a szorzódallamot kerülő nélkül, és kinyílik az egész erdő!"); return; }
      palyaInditas(pa.id);
    });
    var fbtn = kart.querySelector(".palya-felolvas");
    if (fbtn) fbtn.addEventListener("click", function (e) {
      e.stopPropagation(); hangGomb();
      var mondat = kiiras(pa.nev) + ". " + mat + ". Az egész pálya körülbelül " + vegig + " csillámpor." +
        " Ha egy állomást sem hagysz ki, arany csillagszilánk jár és dupla záró-jutalom.";
      if (ajanlott) mondat += " Ezt most neked ajánlom! Plusz " + AJANLOTT_HARMAT + " tündérharmat jár érte.";
      if (pa.egyeni) mondat += " Ezt az ösvényt csak neked készítették!";
      if (napiEz && !_napiKesz) mondat += " Ez a mai kiemelt pálya! Plusz " + NAPI_KIEMELT_HARMAT + " tündérharmat jár érte.";
      mondd(mondat);
    });
    return kart;
  }
  regioSorrend.forEach(function (regio) {
    var szek = el("div", "palya-regio r-" + regio);
    if (REGIO_HATTER[regio]) { var bgEl = el("div", "palya-regio-hatter"); bgEl.innerHTML = REGIO_HATTER[regio]; szek.appendChild(bgEl); }
    szek.appendChild(el("div", "palya-regio-cim", REGIO_CIM[regio] || ""));
    var grid = el("div", "palya-regio-grid");
    regiok[regio].forEach(function (rec) { grid.appendChild(regio === "fejtoro" ? fejtoroKartya(rec.pa) : keszitKartya(rec.pa, rec.idx)); });
    szek.appendChild(grid);
    racs.appendChild(szek);
  });
  var ossz = 0, jo = 0;
  (P().naplo || []).forEach(function (r) { ossz++; if (r.elsore) jo++; });
  $("ma-statisztika").textContent = ossz ? ("Eddig " + ossz + " feladatot próbáltál, " + jo + " sikerült elsőre.") : "";
}


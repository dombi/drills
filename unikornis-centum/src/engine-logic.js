/* ============ 8) JÁTÉK-LOGIKA ============ */
var J = null;
var curX = allomasX(0), curY = allomasY(0);

/* ── 12 ÓRÁS REJTETT KAPU (rendszerterv 6.4) ─────────────────────────────────
   A két kulcs-pálya (Mondd el a bontásokat + Szorzódallam) KERÜLŐ NÉLKÜLI végig-
   vitele → 12 órára megnyílik minden más pálya. A két kulcs mindig játszható;
   nincs látható óra/számláló. Utána visszazárul, újra kell mindkettő. */
var KAPU_KULCSOK = ["bontas-felmondas", "szorzo-dallam"];
var KAPU_MS = 12 * 60 * 60 * 1000;
function kapuKulcsPalya(id) { return KAPU_KULCSOK.indexOf(id) >= 0; }
function kapuNyitva() { var k = P().kapu; return !!(k && k.nyitvaEddig > Date.now()); }
function palyaZarva(pa) { return !pa.hamarosan && !pa.egyeni && !kapuKulcsPalya(pa.id) && !kapuNyitva(); }   /* egyéni pálya (4b): mindig nyitva */
function kapuAllapot() { var k = P().kapu || {}; return { nyitva: kapuNyitva(), nyitvaEddig: k.nyitvaEddig || 0, kulcsKesz: k.kulcsKesz || {} }; }
/* egy kulcs-pálya kerülő nélküli teljesítése → élesítés; ha mindkettő éles → nyílik a kapu.
   Visszaadja, hogy MOST nyílt-e ki (az ünneplő üzenethez). */
function kapuKulcsTeljesult(id) {
  var k = P().kapu || (P().kapu = alapKapu());
  if (!k.kulcsKesz) k.kulcsKesz = {};
  k.kulcsKesz[id] = true;
  var mind = KAPU_KULCSOK.every(function (x) { return k.kulcsKesz[x]; });
  if (mind) {
    k.nyitvaEddig = Date.now() + KAPU_MS;
    KAPU_KULCSOK.forEach(function (x) { k.kulcsKesz[x] = false; });   /* legközelebb újra kell mindkettő */
    return true;
  }
  return false;
}

function palyaInditas(id) {
  var pa = palyaKeres(id);                          /* beépített vagy egyéni (4b) */
  if (!pa || pa.hamarosan) return;
  if (palyaZarva(pa)) return;                       /* zárt kapu: csak a két kulcs-pálya játszható */
  var maJelv = new Date().toISOString().slice(0, 10);   /* jelvény: Visszatérő – hány külön napon játszott */
  if (!P().napok) P().napok = {};
  if (!P().napok[maJelv]) { P().napok[maJelv] = 1; ment(); }
  var allomasok = pa.allomasok.map(function (a) {
    var o = {}, k; for (k in (pa.alap || {})) o[k] = pa.alap[k];
    for (k in a) o[k] = a[k]; return o;
  });
  allomasok = nehezsegAlkalmaz(pa, allomasok);     /* producer nehézség-állítása (config.js) */
  /* ── sorozat erre a futásra (7.2): a ✨-szorzó megszűnt; a sorozat már csak a tündérharmat +1-hez számít ── */
  var s = P().sorozat || (P().sorozat = { hossz: 0, utolsoPalya: null });
  if (id === s.utolsoPalya) { s.hossz = 0; s.utolsoPalya = null; }   /* farmolás-védelem: ugyanaz a pálya nem viszi tovább */
  var sorozatBan = (s.hossz >= 1);   /* ez a pálya sorozatban van (2. vagy további egymás után) */

  J = { palya: pa, allomasok: allomasok, allomasIdx: 0, feladat: null, feladatDb: 0, feladatKesz: 0,
        probak: 0, kerultKulcsok: {}, futoElsore: 0, futoOssz: 0, futoCsilla: 0, lepesSor: 0, beirt: "",
        kezCsend: 0, kezBeiras: false, keruloVolt: false, sorozatBan: sorozatBan, indultMs: Date.now() };
  esemeny("palya_start", { palyaId: id });
  $("jatek-palyanev").textContent = pa.nev;
  $("jatek-csillampor").textContent = P().csillampor;
  $("szinpad").innerHTML = jelenetSVG(pa, mentes.leny);
  curX = allomasX(0); curY = allomasY(0);
  kameraAllit(0, true);
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  var tovabbMehet0 = (mentes.leny === "csillamharmat");
  $("tovabb-megoldas-nelkul").hidden = !tovabbMehet0;
  $("tovabb-megoldas-nelkul-f").hidden = !tovabbMehet0;
  var szil = $("jatek-szilank"); if (szil) { szil.classList.remove("halvany"); szil.hidden = !!pa.egyeni; }   /* egyéni pályán nincs égi szilánk */
  var szB = $("jatek-szorzo"); if (szB) szB.hidden = true;   /* a ✨ sorozat-szorzó megszűnt (7.2) */
  mutat("kepernyo-jatek");
  /* ösvény-indító szöveg: a gyerekek únták a hosszú bevezetőt → csak ennyi (2026-09-14) */
  setTimeout(function () { mondd("Induljunk!", function () { kovAllomas(); }); }, 400);
}
function kameraAllit(i, azonnal) {
  var kam = document.querySelector("#szinpad #kamera");
  if (!kam) return;
  if (SCENE_TELJES) { kam.style.transition = "none"; kam.style.transform = "translateX(0)"; if (J) J.kameraX = 0; return; }
  var n = J.allomasok.length;
  var szelesseg = allomasX(n - 1) + 260;
  var cel = -(allomasX(i) - NEZ_SZ * 0.42);
  var minPan = -(szelesseg - NEZ_SZ + 40);
  if (cel < minPan) cel = minPan;
  if (cel > 40) cel = 40;
  if (J) J.kameraX = cel;
  kam.style.transition = azonnal ? "none" : "transform 1.1s ease";
  kam.style.transform = "translateX(" + cel + "px)";
}
function unikornisOda(i, dur, kesz) {
  var u = document.querySelector("#szinpad #unikornis-hely");
  var ko = document.getElementById("mosti-ko");
  if (!u) { if (kesz) kesz(); return; }
  var x0 = curX, y0 = curY, x1 = allomasX(i), y1 = allomasY(i);
  if (window.__UC_GYORS) { curX = x1; curY = y1; u.setAttribute("transform", "translate(" + x1 + "," + y1 + ")"); if (ko) { ko.setAttribute("cx", x1); ko.setAttribute("cy", y1 + 8); } if (kesz) setTimeout(kesz, 0); return; }
  var t0 = performance.now();
  function lep(now) {
    var t = Math.min(1, (now - t0) / dur);
    var e = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    var x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(t * Math.PI * 4) * 5;
    u.setAttribute("transform", "translate(" + x + "," + y + ")");
    if (t < 1) requestAnimationFrame(lep);
    else {
      curX = x1; curY = y1;
      u.setAttribute("transform", "translate(" + x1 + "," + y1 + ")");
      if (ko) { ko.setAttribute("cx", x1); ko.setAttribute("cy", y1 + 8); }
      if (kesz) kesz();
    }
  }
  requestAnimationFrame(lep);
}
function kovAllomas() {
  J.allomasIdx++;
  var i = J.allomasIdx, a = J.allomasok[i];
  kameraAllit(i);
  unikornisOda(i, 1200, function () {
    J.probak = 0; J.feladatKesz = 0; J.kerultKulcsok = {};
    J.allomasHibatlan = true;                 /* jelvény: „Hibátlan állomás" – egy hibás válasz kikapcsolja */
    var felmondosE = (a.tipus === "szambontas" || a.tipus === "szorzotabla-felmondas");
    J.feladatDb = felmondosE ? 1 : (a.darab || 5);
    /* állomás-szintű sorsolás: a „nehéz" állomás egy fókusz-számot kap az egész állomásra */
    J.allomasSzorzo = a.szorzo_keszlet ? veletlenElem(a.szorzo_keszlet) : null;
    $("kerulo-gomb").style.display = "block";
    ujFeladat();
  });
}
function ujFeladat() {
  var a = J.allomasok[J.allomasIdx];
  J.probak = 0; J.lepesSor = 0; J.lepesMezo = 0; J.lepesAktiv = false;
  if (a.tipus === "szambontas") J.feladat = GEN.szambontas(a);
  else if (a.tipus === "szorzotabla-felmondas") J.feladat = GEN["szorzotabla-felmondas"](a);
  else {
    var eff = a;
    if (a.szorzo_keszlet != null && J.allomasSzorzo != null) {
      eff = {}; for (var kk in a) eff[kk] = a[kk]; eff.szorzo = J.allomasSzorzo;
    }
    J.feladat = GEN[a.tipus](eff, J.kerultKulcsok);
  }
  var f = J.feladat;
  J.parokKesz = 0;
  $("bagoly-buborek").hidden = false;
  $("buborek-cim").hidden = true;
  $("buborek-feladat").hidden = false;
  $("buborek-feladat").innerHTML = f.kartyaHTML || kiiras(f.szoveg);
  $("felmond-lista").hidden = true; $("felmond-lista").innerHTML = "";
  $("felmond-megvan").hidden = true;
  if (FB.aktiv) bontasEloElhallgat();
  $("pipa-sor").hidden = true;
  $("hallgat-e").hidden = true; $("hallgat-f").hidden = true;
  $("bontas-kesz-gomb").hidden = true;
  $("valaszter").style.visibility = "visible";
  $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  var tovabbMehet = (mentes.leny === "csillamharmat");
  $("tovabb-megoldas-nelkul").hidden = !tovabbMehet;
  $("tovabb-megoldas-nelkul-f").hidden = !tovabbMehet;
  if (f.csalad === "felmondas") {
    $("valasz-egyenkent").hidden = true;
    $("valasz-felmondas").hidden = false;
    $("bontas-lepes").hidden = true;
    $("szambillentyuzet").hidden = true;
    $("beiro-doboz").hidden = true;
    var felKn = felmondKezNelkulE();
    $("mondom-bontas-gomb").style.display = (beszedTamogatott && !felKn) ? "" : "none";
    $("mondom-bontas-gomb").textContent = felmondMondomSzo();
    $("halld-ujra-f").style.display = beszedTamogatott ? "" : "none";
    var bbUj = $("bontas-beiras");
    bbUj.textContent = "⌨ Beírom lépésenként";
    bbUj.style.display = beszedTamogatott ? "" : "none";
    if (!beszedTamogatott || mentes.valaszmod === "beiras") { mondd(f.felolvas, function () { bontasLepesNyit(); }); return; }
    if (felKn) { felmondKezNelkulKor(); return; }
  } else {
    $("valasz-felmondas").hidden = true;
    $("valasz-egyenkent").hidden = false;
    renderPottyok(); beiroReset();
    J.kezCsend = 0; J.kezBeiras = false;
    if (f.csalad === "maradekos") maradekosBekosd();
    if (kezNelkulE()) { kezNelkulModUI(); kezNelkulKor(); return; }
    modBeallit();
  }
  mondd(f.felolvas);
}
/* bontás: átváltás a VÁLASZ (hallgatás) állapotra */
function frissitMegvan() {
  var rows = lepesSorok(), minta = lepesMintaDb(), kesz = J.lepesSor || 0, p = "";
  for (var i = 0; i < rows; i++) {
    var cls = i < minta ? "minta" : (i < kesz ? "zold" : (i === kesz ? "most" : ""));
    p += '<i class="' + cls + '"></i>';
  }
  var teMar = Math.max(0, kesz - minta), teOssz = rows - minta;
  $("felmond-megvan").innerHTML = minta + " minta · " + teMar + " / " + teOssz +
    " sort te töltesz ki <span class=\"pontok\">" + p + "</span>";
}
function bagolyMondat(txt) {
  var b = $("bagoly-mondat");
  b.textContent = txt; b.hidden = false;
  clearTimeout(bagolyMondat._t);
  bagolyMondat._t = setTimeout(function () { b.hidden = true; }, 2200);
}
function csillagRepul(honnanEl) {
  var cel = $("jatek-csillampor");
  if (!cel || !honnanEl) return;
  var r1 = honnanEl.getBoundingClientRect(), r2 = cel.getBoundingClientRect();
  var s = el("div", "repulo-csillag", "✨");
  s.style.left = (r1.left + r1.width / 2) + "px";
  s.style.top = (r1.top + 20) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(function () {
    s.style.left = (r2.left + r2.width / 2) + "px";
    s.style.top = (r2.top + r2.height / 2) + "px";
    s.style.transform = "scale(.4)"; s.style.opacity = "0.2";
  });
  setTimeout(function () { s.remove(); }, 950);
}
function renderPottyok() {
  var box = $("haladas-pottyok"); box.innerHTML = "";
  for (var i = 0; i < J.feladatDb; i++)
    box.appendChild(el("span", "potty" + (i < J.feladatKesz ? " kesz" : (i === J.feladatKesz ? " most" : ""))));
}
/* ── lépésenkénti beírás segédei (2026-09-14) ──────────────────────────────
   Az 1. és 2. sor MINTA (készen adva, az irány megmutatása); onnantól a sorban
   csak a művelet jele marad, minden számot a gyerek ír be, balról jobbra.
   A megoldó-ellenőrzés ugyanaz; csak a megjelenés változott. */
function lepesSorok() { return (J.feladat.felmod === "szorzotabla") ? 10 : (J.feladat.N + 1); }
function lepesMintaDb() { return Math.min(2, lepesSorok() - 1); }   /* mindig marad legalább 1 megoldandó sor */
function lepesErtekek(i) {
  var N = J.feladat.N;
  if (J.feladat.felmod === "szorzotabla") { var k = i + 1; return [k, N, k * N]; }
  return [i, N - i, N];               /* bontás: bal + jobb = N (az eredmény is beírandó) */
}
function lepesJelek() { return (J.feladat.felmod === "szorzotabla") ? ["×", "="] : ["+", "="]; }
function lepesSorSzoveg(i) {
  var e = lepesErtekek(i), j = lepesJelek();
  return e[0] + " " + j[0] + " " + e[1] + " " + j[1] + " " + e[2];
}
/* egy sor DOM-ban: minta/kész → kiírt számok; aktív → igazi beíró-mezők (fizikai
   billentyűzet, Enter ellenőrzi az egész sort); jövő → üres helyőrzők */
function lepesSorEl(allapot, ertekek, jelek) {
  var sorEl = el("div", "felmond-sor " + allapot);
  for (var b = 0; b < ertekek.length; b++) {
    if (b > 0) sorEl.appendChild(el("span", "jel", jelek[b - 1]));
    if (allapot === "pelda" || allapot === "kesz") {
      sorEl.appendChild(el("span", "dob", "" + ertekek[b]));
    } else if (allapot === "most") {
      var inp = document.createElement("input");
      inp.className = "dob-be"; inp.type = "text"; inp.inputMode = "numeric";
      inp.setAttribute("maxlength", "3"); inp.setAttribute("aria-label", "beírómező");
      inp.setAttribute("data-idx", b);
      inp.setAttribute("data-jegy", String(ertekek[b]).length);   /* hány számjegy a jó válasz → csak utána ugrik */
      inp.addEventListener("input", lepesInputAdvance);
      sorEl.appendChild(inp);
    } else {
      sorEl.appendChild(el("span", "ub", ""));   /* jövő: üres helyőrző */
    }
  }
  if (allapot === "pelda") sorEl.appendChild(el("span", "tag", "minta"));
  else if (allapot === "kesz") sorEl.appendChild(el("span", "pipa", ""));
  return sorEl;
}
function renderFelmondLista(sor) {
  var box = $("felmond-lista"); box.innerHTML = "";
  var rows = lepesSorok(), minta = lepesMintaDb(), jelek = lepesJelek();
  for (var i = 0; i < rows; i++) {
    var allapot = i < minta ? "pelda" : (i < sor ? "kesz" : (i === sor ? "most" : "jovo"));
    box.appendChild(lepesSorEl(allapot, lepesErtekek(i), jelek));
  }
}
/* egy számjegy beírása után: ha a mező megkapta a kellő számjegyet (kétjegyűnél
   2-t), ugrás a következő mezőre; az utolsó mező kitöltésekor a sor ellenőrzése */
function lepesInputAdvance(e) {
  var inp = e.target;
  inp.value = inp.value.replace(/[^0-9]/g, "").slice(0, 3);
  inp.classList.remove("hibas");
  var kell = parseInt(inp.getAttribute("data-jegy"), 10) || 1;
  if (inp.value.length < kell) return;
  var mezok = $("felmond-lista").querySelectorAll(".felmond-sor.most .dob-be");
  var idx = parseInt(inp.getAttribute("data-idx"), 10);
  if (idx < mezok.length - 1) { var kov = mezok[idx + 1]; mezoFokusz(kov); }
  else bontasSorEllenoriz();
}
/* Fókuszáljunk AZONNAL (a legtöbb böngésző elfogadja → nincs elcsúszás gyors
   gépelésnél) ÉS késleltetve is (tartalék: egyes böngészők az `input` eseményen
   belüli focus()-t figyelmen kívül hagyják, ettől „nem ugrott" a mező). */
function mezoFokusz(el) {
  if (!el) return;
  try { el.focus(); el.select && el.select(); } catch (e) {}
  setTimeout(function () { try { el.focus(); el.select && el.select(); } catch (e) {} }, 0);
}
/* az aktív sor összes mezőjének ellenőrzése (auto az utolsó mezőnél, vagy Enter) */
function bontasSorEllenoriz() {
  var mezok = $("felmond-lista").querySelectorAll(".felmond-sor.most .dob-be");
  if (!mezok.length) return;
  var ertekek = lepesErtekek(J.lepesSor), rows = lepesSorok(), i, ures = -1;
  for (i = 0; i < mezok.length; i++) { mezok[i].classList.remove("hibas"); if (mezok[i].value === "" && ures < 0) ures = i; }
  if (ures >= 0) {
    mezoFokusz(mezok[ures]);
    $("visszajelzes-f").className = "visszajelzes";
    $("visszajelzes-f").textContent = "Írd be a hiányzó számot!";
    return;
  }
  var jo = true, elsoHibas = -1;
  for (i = 0; i < mezok.length; i++) {
    if (parseInt(mezok[i].value, 10) !== ertekek[i]) { jo = false; mezok[i].classList.add("hibas"); if (elsoHibas < 0) elsoHibas = i; }
  }
  if (jo) {
    J.mezoHiba = 0; hangCsilla();
    $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
    J.lepesSor++;
    if (J.lepesSor >= rows) { felmondSiker(); return; }
    bontasLepesMutat();
  } else {
    J.mezoHiba = (J.mezoHiba || 0) + 1;
    hangHiba();
    var mostRow = $("felmond-lista").querySelector(".felmond-sor.most");
    if (mostRow) { mostRow.classList.remove("razas"); void mostRow.offsetWidth; mostRow.classList.add("razas"); }
    $("visszajelzes-f").className = "visszajelzes rossz";
    $("visszajelzes-f").textContent = (J.mezoHiba >= 2) ? ("A jó sor: " + lepesSorSzoveg(J.lepesSor)) : "Nézd meg még egyszer!";
    for (i = 0; i < mezok.length; i++) { mezok[i].value = ""; mezok[i].classList.remove("hibas"); }
    mezoFokusz(mezok[0]);                             /* tiszta lappal, az első mezőtől */
  }
}
function modBeallit() {
  var beiras = (mentes.valaszmod === "beiras") || !beszedTamogatott;
  $("mondom-gomb").style.display = (beszedTamogatott && !beiras) ? "" : "none";
  $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
  $("beiras-valt").textContent = beiras ? "🎤 Inkább mondom" : "⌨ Inkább beírom";
  $("szambillentyuzet").hidden = true;             /* a képernyős számgrid megszűnt – üres négyzet van helyette */
  if (J && J.feladat && J.feladat.csalad === "maradekos") {
    $("beiro-doboz").hidden = true;
    maradekosBeirosMod(beiras);
  } else {
    $("beiro-doboz").hidden = !beiras;
    if (beiras) beiroReset();
  }
}
function beiroReset() { J.beirt = ""; if ($("beiro-kijelzo")) $("beiro-kijelzo").textContent = ""; if ($("beiro-mezo")) $("beiro-mezo").value = ""; }
function billentyuzetEpit() {
  var box = $("szambillentyuzet"); box.innerHTML = "";
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(function (k) {
    var b = el("button", (k === "⌫" || k === "✓") ? "spec" : "", k);
    b.addEventListener("click", function () {
      hangGomb();
      if (k === "⌫") J.beirt = J.beirt.slice(0, -1);
      else if (k === "✓") { billentyuBekuld(); return; }
      else if (J.beirt.length < 3) J.beirt += k;
      $("beiro-kijelzo").textContent = J.beirt;
    });
    box.appendChild(b);
  });
}
function billentyuBekuld() {
  if (J.feladat.csalad === "felmondas") { bontasSorEllenoriz(); return; }
  if (J.feladat.csalad === "maradekos") { maradekosBekuld(); return; }
  if (J.beirt === "") return;
  var v = parseInt(J.beirt, 10);
  J.beirt = ""; $("beiro-kijelzo").textContent = "";
  if ($("beiro-mezo")) $("beiro-mezo").value = "";
  ertekel(v);
}
/* üres négyzet (2026-09-18): a fizikai billentyűzetet a fenti document-keydown kezeli
   (magyar-kiosztás-biztos). Ez a mező CSAK a tabletet szolgálja: a négyzetre koppintva
   feljön a rendszer-számbillentyűzete, és ide gépel; onnan tükrözzük a kijelzőre. */
function bekotUresNegyzet() {
  var mezo = $("beiro-mezo"), box = $("beiro-box");
  if (mezo) {
    mezo.addEventListener("input", function () {
      J.beirt = mezo.value.replace(/[^0-9]/g, "").slice(0, 3);
      mezo.value = J.beirt;
      $("beiro-kijelzo").textContent = J.beirt;
    });
    mezo.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); billentyuBekuld(); }
    });
  }
  if (box) {
    box.addEventListener("click", function () {
      /* csak érintőn kérjük a rendszer-billentyűzetet; egéren a fizikai billentyűzet megy */
      try { if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) $("beiro-mezo").focus(); } catch (e) {}
    });
  }
}
function ertekel(valasz) {
  var f = J.feladat;
  var mar = (f.csalad === "maradekos");
  var helyesE = mar ? (valasz.h === f.helyes.h && valasz.m === f.helyes.m) : (valasz === f.helyes);
  if (helyesE) {
    naplozz(f.naplo, J.probak === 0, mar ? (valasz.h + "m" + valasz.m) : valasz);
    J.futoOssz++; if (J.probak === 0) J.futoElsore++;
    streakLep(J.probak === 0);
    hangJo(); hangCsilla();
    var jar = (J.probak >= 2) ? jutalom("tipp") : jutalom("feladat");   /* tipp után 1, egyébként 1+szint (7.1a) */
    P().csillampor += jar; J.futoCsilla += jar;
    $("jatek-csillampor").textContent = P().csillampor;
    $("visszajelzes").className = "visszajelzes jo";
    $("visszajelzes").textContent = mar
      ? ("Ez az! " + f.helyes.h + " maradék " + f.helyes.m + "  (+" + jar + " ✨)")
      : ("Ez az! " + f.helyes + "  (+" + jar + " ✨)");
    if (mar) maradekosKitolt(true);
    csillagRepul($("bagoly-buborek")); J.feladatKesz++;
    if (P().jelvSzam) {                        /* jelvény-számlálók */
      if (mentes.valaszmod === "beszed") P().jelvSzam.beszedFeladat = (P().jelvSzam.beszedFeladat || 0) + 1;
      if (J.probak >= 2) P().jelvSzam.kuzdottGyozelem = 1;
    }
    dropUnnepel(dropProbal(0.15));
    jelvenyEllenoriz();
    ment();
    setTimeout(function () { if (J.feladatKesz >= J.feladatDb) allomasKesz(); else ujFeladat(); }, 900);
  } else {
    J.probak++;
    J.allomasHibatlan = false;                 /* egy hibás válasz → az állomás már nem hibátlan */
    streakLep(false);
    naplozz(f.naplo, false, mar ? (valasz.h + "m" + valasz.m) : valasz);
    hangHiba();
    $("visszajelzes").className = "visszajelzes rossz";
    if (mar) {
      maradekosKitolt(false);
      if (J.probak === 1) { $("visszajelzes").textContent = "Nem talált. Próbáld újra!"; mondd("Nem talált. Próbáld újra!", maradekosUjra); }
      else { $("visszajelzes").textContent = "💡 " + f.tipp; mondd(f.tipp, maradekosUjra); }
    } else {
      if (J.probak === 1) { $("visszajelzes").textContent = "Nem " + valasz + ". Nézd meg még egyszer!"; mondd("Nem talált. Próbáld újra!", kezNelkulUjra); }
      else { $("visszajelzes").textContent = "✘ " + f.keplet + " = " + f.helyes; mondd(f.tipp, kezNelkulUjra); }
    }
    ment();
  }
}
/* ── maradékos osztás segédfüggvények (mi-maradt pálya) ── */
function maradekosBekosd() {
  var mh = document.getElementById("mar-h"), mm = document.getElementById("mar-m");
  if (!mh || !mm) return;
  function szur(e) { e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2); }
  mh.addEventListener("input", szur);
  mm.addEventListener("input", szur);
  mh.addEventListener("input", function () { if (mh.value.length >= 2) mezoFokusz(mm); });
  mh.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); maradekosBekuld(); }
    else if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); mezoFokusz(mm); }
  });
  mm.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); maradekosBekuld(); }
    else if (e.key === "Tab" && e.shiftKey) { e.preventDefault(); mezoFokusz(mh); }
  });
}
function maradekosBeirosMod(aktival) {
  var mh = document.getElementById("mar-h"), mm = document.getElementById("mar-m");
  if (!mh || !mm) return;
  mh.readOnly = !aktival; mm.readOnly = !aktival;
  if (aktival) { mh.value = ""; mm.value = ""; mezoFokusz(mh); }
}
function maradekosKitolt(jo) {
  var mh = document.getElementById("mar-h"), mm = document.getElementById("mar-m");
  if (!mh || !mm) return;
  if (jo) {
    mh.value = J.feladat.helyes.h; mm.value = J.feladat.helyes.m;
    mh.className = "mar-mezo jo"; mm.className = "mar-mezo mar-m-off jo";
    mh.readOnly = true; mm.readOnly = true;
  } else {
    mh.classList.add("rossz"); mm.classList.add("rossz");
    setTimeout(function () {
      mh.classList.remove("rossz"); mm.classList.remove("rossz");
      mh.value = ""; mm.value = "";
    }, 500);
  }
}
function maradekosUjra() {
  var mh = document.getElementById("mar-h");
  if (mh && !mh.readOnly) mezoFokusz(mh);
}
function maradekosBekuld() {
  var mh = document.getElementById("mar-h"), mm = document.getElementById("mar-m");
  if (!mh || !mm) return;
  var vh = mh.value.trim(), vm = mm.value.trim();
  if (vh === "" || vm === "") {
    if (vh === "") mezoFokusz(mh); else mezoFokusz(mm);
    return;
  }
  ertekel({ h: parseInt(vh, 10), m: parseInt(vm, 10) });
}
/* hibás válasz után kézmentes pályán: pittyentés + újra figyelés (máshol no-op) */
function kezNelkulUjra() {
  if (!kezNelkulE()) return;
  beep(1046, 0.1, "sine", 0, 0.16);
  setTimeout(kezNelkulFigyel, 240);
}
/* ═══════════════════════════════════════════════════════════════════════════════
   A „MONDD EL A BONTÁST" FELADAT ELFOGADÁSI SZABÁLYA
   ═══════════════════════════════════════════════════════════════════════════════
   A gép ad egy N számot (1 ≤ N ≤ 10). A gyereknek EGYBEN, EGYFOLYTÁBAN,
   LENTRŐL FÖLFELÉ fel kell mondania N minden bontását:

        0 + N,  1 + (N−1),  2 + (N−2),  … ,  N + 0        →  összesen N+1 sor

   Csak a KIMONDOTT SZÁMOK és a SORRENDJÜK számít. Minden más szó – „meg",
   „plusz", „és", „hozzá", „egyenlő", „az", „lesz", „is", szünet, vessző –
   figyelmen kívül marad (a szamokKinyer() eleve csak a számokat szedi ki).

   EGY SOR elfogadható alakjai (a gyerek szabadon választ, soronként külön):
        „nulla meg öt"              →  csak a két tag              →  [0, 5]
        „nulla meg öt az öt"        →  két tag + kimondott összeg  →  [0, 5, 5]
        „nulla plusz öt egyenlő öt" →  bármilyen kötőszóval        →  [0, 5, 5]
   A kimondott összeg (mindig N) elhagyható, soronként vegyesen is.

   A teljes felmondás AKKOR JÓ, ha a kimondott számlista pontosan ez:
        i = 0 … N-re egymás után:   [ i , N−i ]   és utána OPCIONÁLISAN   [ N ]
   Tehát: egyetlen sor sem hiányozhat, a sorrend kötött (lentről), a két tag
   összege minden sorban N, és nem lóghat ki „idegen" szám.

   Visszatérés: { ok, sorok } – a `sorok` az elejéről hibátlanul elmondott sorok
   száma (ez megy a „Eddig 3 sor jó volt" visszajelzésbe).
   ═══════════════════════════════════════════════════════════════════════════════ */
function bontasFelmondOk(nums, N) {
  var p = 0;
  for (var i = 0; i <= N; i++) {
    // a sor két kötelező tagja, ebben a sorrendben:  i , majd  N−i
    if (nums[p] !== i)     return { ok: false, sorok: i };
    p++;
    if (nums[p] !== N - i) return { ok: false, sorok: i };
    p++;
    // a sor végén OPCIONÁLISAN elhangozhat a kimondott összeg (N):
    if (i < N - 1) {
      // a következő sor első tagja (i+1) biztosan nem N → minden itt álló N csak összeg
      while (nums[p] === N) p++;
    } else if (i === N - 1) {
      // az utolsó előtti sor: a következő sor első tagja épp N, ezért abból
      // az egymást követő N-ekből egyet meg kell hagyni a záró „N + 0" sornak
      var db = 0; while (nums[p + db] === N) db++;
      while (db-- > 1) p++;
    }
  }
  while (nums[p] === N) p++;              // a legutolsó sor kimondott összege
  if (p !== nums.length) return { ok: false, sorok: N };   // idegen szám maradt a végén
  return { ok: true, sorok: N + 1 };
}
function felmondErtekel(altList) {
  var N = J.feladat.N, legjobbSor = 0, siker = false;
  altList.forEach(function (sz) {
    var r = bontasFelmondOk(szamokKinyer(sz), N);
    if (r.ok) siker = true;
    if (r.sorok > legjobbSor) legjobbSor = r.sorok;
  });
  $("hallgat-f").hidden = true;

  if (siker) { felmondSiker(); return; }

  J.probak++;
  var jutott = Math.min(legjobbSor, N);      // hány sort mondott jól a felmondás elejéről
  J.parokKesz = jutott;                       // csak visszajelzésnek, nem gyűlik
  $("felmond-lista").hidden = false; $("felmond-megvan").hidden = true;
  renderFelmondLista(jutott);
  naplozz(J.feladat.naplo, false, "hiányos felmondás");
  $("visszajelzes-f").className = "visszajelzes rossz";
  if (J.probak >= 2) {
    $("visszajelzes-f").textContent = "Nézzük lépésenként!";
    mondd("Nézzük lépésenként. " + J.feladat.tipp, function () { bontasLepesNyit(); });
  } else {
    hangHiba();
    $("visszajelzes-f").textContent = jutott > 0
      ? ("Eddig jó volt " + jutott + " sor. Mondd el újra az egészet, lentről kezdve!")
      : "Kezdd lentről: nulla meg " + N + ", egy meg " + (N - 1) + " …";
    mondd("Majdnem! Mondd el az egész bontást még egyszer, lentről kezdve.");
  }
  ment();
}
function felmondSiker() {
  naplozz(J.feladat.naplo, J.probak === 0, "helyes felmondás");
  J.futoOssz++; if (J.probak === 0) J.futoElsore++;
  streakLep(J.probak === 0);
  if (P().jelvSzam) {                          /* jelvény: Bontás-mester + hibátlan állomás + küzdés */
    if (J.probak === 0) P().jelvSzam.felmondasOk = (P().jelvSzam.felmondasOk || 0) + 1;
    else J.allomasHibatlan = false;
    if (J.probak >= 2) P().jelvSzam.kuzdottGyozelem = 1;
  }
  hangJo(); hangCsilla();
  dropUnnepel(dropProbal(0.30));
  jelvenyEllenoriz();
  var szt = (J.feladat.felmod === "szorzotabla");
  var keszSzo = szt ? "Kész a szorzótábla!" : "Kész a bontás!";
  var jar = jutalom("felmondas");        /* egy teljes felmondás = 9 ✨ (7.1a) */
  P().csillampor += jar; J.futoCsilla += jar;
  $("hallgat-f").hidden = true; $("bontas-kesz-gomb").hidden = true;
  J.parokKesz = szt ? 10 : (J.feladat.N + 1);
  /* a piros-kék gyöngyös lista jutalomként jelenik meg (nem a szöveges);
     a gyereknek NEM kell újra felmondania — a Tovább gomb visz tovább */
  $("felmond-lista").hidden = true;
  $("felmond-megvan").hidden = true;
  renderGolyoLista();
  $("pipa-sor").hidden = false;
  $("visszajelzes-f").className = "visszajelzes jo";
  $("visszajelzes-f").textContent = keszSzo + "  (+" + jar + " ✨)";
  csillagRepul($("bagoly-buborek"));
  setTimeout(function () { $("jatek-csillampor").textContent = P().csillampor; }, 500);
  J.feladatKesz++; ment();
  /* NEM lépünk tovább magunktól — a Tovább gomb vár a gyerekre. */
  var tg = $("bontas-kesz-gomb");
  tg.textContent = "Tovább →"; tg.className = "nagy-gomb tovabb-kesz"; tg.hidden = false;
  bagolyMondat("Szuper! " + keszSzo + " 🌟");
  mondd("Szuper! " + keszSzo);
}
function bontasLepesNyit() {
  J.lepesAktiv = true;                             /* AZONNAL: innentől tilos a hang-visszakapcsolás */
  bontasEloElhallgat();                            /* állítsuk le a folyamatban lévő hangfigyelést */
  try { speechSynthesis.cancel(); } catch (e) {}   /* és a folyamatban lévő felolvasást is */
  $("hallgat-f").hidden = true; $("bontas-kesz-gomb").hidden = true;
  $("mondom-bontas-gomb").style.display = "none";
  $("halld-ujra-f").style.display = beszedTamogatott ? "" : "none";
  $("buborek-feladat").hidden = true;
  $("buborek-cim").hidden = false;
  $("buborek-cim").innerHTML = (J.feladat.felmod === "szorzotabla")
    ? ('A <b>' + J.feladat.N + '</b>-es szorzótábla – lépésenként')
    : ('A <b>' + J.feladat.N + '</b> bontásai – lépésenként');
  $("felmond-lista").hidden = false; $("felmond-megvan").hidden = false;
  $("bontas-lepes").hidden = true;               /* a régi külön beíró-sor megszűnt */
  $("szambillentyuzet").hidden = true;           /* nincs képernyős számológép */
  $("beiro-doboz").hidden = true;
  J.lepesAktiv = true; J.mezoHiba = 0;
  var rows = lepesSorok(), minta = lepesMintaDb();
  J.lepesSor = Math.max(minta, J.parokKesz || 0);
  var bb = $("bontas-beiras");                    /* a kapcsoló: most vissza a hangra */
  if (beszedTamogatott) { bb.style.display = ""; bb.textContent = "🎤 Inkább mondom"; }
  else bb.style.display = "none";
  if (J.lepesSor >= rows) { felmondSiker(); return; }   /* minden sor kész volt már */
  bontasLepesMutat();
}
function bontasLepesMutat() {
  renderFelmondLista(J.lepesSor);
  J.parokKesz = J.lepesSor;
  frissitMegvan();
  $("bontas-lepes").hidden = true;
  $("szambillentyuzet").hidden = true;           /* nincs képernyős számológép */
  $("beiro-doboz").hidden = true;
  var elso = $("felmond-lista").querySelector(".felmond-sor.most .dob-be");
  if (elso) mezoFokusz(elso);                       /* rögtön a sor első mezőjébe (késleltetve) */
}
/* beírásból vissza a hangos módba (⌨ ⇄ 🎤 kapcsoló, 2026-09-14) */
function felmondHangVissza() {
  J.lepesAktiv = false;
  figyelStop();
  $("szambillentyuzet").hidden = true;
  $("beiro-doboz").hidden = true;
  $("bontas-lepes").hidden = true;
  $("felmond-lista").hidden = true;
  $("felmond-megvan").hidden = true;
  $("buborek-cim").hidden = true;
  $("buborek-feladat").hidden = false;
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  var bb = $("bontas-beiras");
  bb.textContent = "⌨ Beírom lépésenként"; bb.style.display = "";
  var felKn = felmondKezNelkulE();
  $("mondom-bontas-gomb").style.display = (beszedTamogatott && !felKn) ? "" : "none";
  $("mondom-bontas-gomb").textContent = felmondMondomSzo();
  $("halld-ujra-f").style.display = beszedTamogatott ? "" : "none";
  J.parokKesz = 0;
  if (felKn) felmondKezNelkulKor();
  else mondd(J.feladat.felolvas);
}
function allomasKesz() {
  var a = J.allomasok[J.allomasIdx];
  var pipa = $("pipa-" + J.allomasIdx); if (pipa) pipa.setAttribute("opacity", "1");
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  hangAllomas();
  var allJar = jutalom("allomas"); P().csillampor += allJar; J.futoCsilla += allJar;   /* +3, állandó (7.1a) */
  $("jatek-csillampor").textContent = P().csillampor; ment();
  if (J.allomasHibatlan && P().jelvSzam) P().jelvSzam.hibatlanAllomas = 1;   /* jelvény: minden feladat elsőre jó volt */
  jelvenyEllenoriz();
  if (a.cel) { palyaVege(); return; }
  mondd("Ügyes! Mehetünk tovább.", function () { kovAllomas(); });
}
function keruloUt() {
  hangGomb(); figyelStop();
  J.keruloVolt = true;                 /* teljes ösvény: egyetlen kerülő is elrontja (7.1c) */
  keruloSzilankHalvanyit();
  $("bagoly-buborek").hidden = true;
  $("valaszter").style.visibility = "hidden";
  $("kerulo-gomb").style.display = "none";
  var a = J.allomasok[J.allomasIdx];
  var pipa = $("pipa-" + J.allomasIdx);
  if (pipa) { var kr = pipa.querySelector("circle"); if (kr) kr.setAttribute("fill", "#cdbfe0"); pipa.setAttribute("opacity", "1"); }
  mondd("Menjünk a hosszú úton.");
  var u = document.querySelector("#szinpad #unikornis-hely");
  var x0 = curX, y0 = curY, t0 = performance.now(), TART = 15000;
  function lep(now) {
    var t = Math.min(1, (now - t0) / TART);
    var x = x0 + 120 * Math.sin(t * Math.PI * 2) * (1 - t) + 60 * t;
    var y = y0 + 70 * Math.sin(t * Math.PI) + Math.sin(t * 30) * 4;
    if (u) u.setAttribute("transform", "translate(" + x + "," + y + ")");
    if (t < 1) requestAnimationFrame(lep);
    else {
      curX = x0 + 60; curY = y0;
      var kd = dropProbal(0.25);           /* kerülőn: állomásonként 25% talált tárgy */
      if (kd && kd.talalt && P().jelvSzam) P().jelvSzam.keruloTargy = (P().jelvSzam.keruloTargy || 0) + 1;
      dropUnnepel(kd);
      jelvenyEllenoriz();
      if (a.cel) { palyaVege(); return; }
      kovAllomas();
    }
  }
  requestAnimationFrame(lep);
}
function palyaVege() {
  var id = J.palya.id;
  if (!P().palyak[id]) P().palyak[id] = { kesz: false, rekordElsore: 0 };
  var pr = P().palyak[id];
  pr.kesz = true;
  var ujRekord = J.futoElsore > (pr.rekordElsore || 0);
  if (ujRekord) pr.rekordElsore = J.futoElsore;

  /* ── záró jutalom (7.2): pálya-vége bónusz + teljes-ösvény extra; a ✨ sorozat-szorzó MEGSZŰNT ── */
  var zaroBonusz = jutalom("palyavege");
  var teljes = !J.keruloVolt;                       /* egyetlen kerülő sem volt → teljes ösvény */
  var teljesExtra = teljes ? zaroBonusz : 0;        /* a záró bónusz kétszerezése */
  var zaroOssz = zaroBonusz + teljesExtra;
  P().csillampor += zaroOssz; J.futoCsilla += zaroOssz;
  if (teljes) pr.arany = true;                      /* ami egyszer arany, az arany marad */

  /* ── tündérharmat (kitartás-valuta, 7.2): 1 minden befejezett pályáért, +1 ha sorozatban VAGY teljes ösvényen ── */
  var harmat = 1 + ((J.sorozatBan || teljes) ? 1 : 0);

  /* ── napi kiemelt pálya: +3 💧 extra, naponta 1× ── */
  var napiId = napiKiemeltId(), napiMa = napiKiemeltMa();
  var napiExtra = 0;
  if (id === napiId) {
    var nk = P().napiKiemelt || (P().napiKiemelt = { datum: "", teljesitve: false });
    if (nk.datum !== napiMa || !nk.teljesitve) {
      napiExtra = NAPI_KIEMELT_HARMAT;
      nk.datum = napiMa; nk.teljesitve = true;
    }
  }
  harmat += napiExtra;
  P().tunderharmat = (P().tunderharmat || 0) + harmat;
  tkNapPalya();   /* Égi Tüneménykert: napi ösvény-számláló (belépési feltétel) */

  /* ── 12 órás kapu (6.4): kulcs-pálya kerülő nélkül → élesítés; mindkettő éles → nyílik ── */
  var kapuMostNyilt = false;
  if (teljes && kapuKulcsPalya(id)) kapuMostNyilt = kapuKulcsTeljesult(id);

  /* ── sorozat frissítése a KÖVETKEZŐ pályához ── */
  P().sorozat.hossz = (P().sorozat.hossz || 0) + 1;
  P().sorozat.utolsoPalya = id;

  $("jatek-csillampor").textContent = P().csillampor;
  ment();
  esemeny("palya_end", { palyaId: id, feladat: J.futoOssz, elsore: J.futoElsore, idoMp: Math.round((Date.now() - (J.indultMs || Date.now())) / 1000),
    teljes: teljes, csillampor: J.futoCsilla, harmat: harmat });
  var ujJelv = jelvenyEllenoriz();

  var egyeniP = !!J.palya.egyeni;                   /* egyéni pálya (4b): ✨ + 💧 jár, égi szilánk nem */
  var teljesSor = teljes
    ? '<br><span style="color:#8a6a1e;font-weight:800">🌟 Teljes ösvény! +' + teljesExtra + ' ✨' + (egyeniP ? '' : ', arany szilánk az égedre') + '</span>'
    : "";
  var napiSor = napiExtra
    ? '<br><span style="color:#6a3bc0;font-weight:800">🌟 Napi kiemelt pálya! +' + napiExtra + ' 💧</span>'
    : "";
  var harmatSor = '<br><span style="color:#2f7fb0;font-weight:800">💧 +' + harmat + ' tündérharmat</span>'
    + (napiExtra ? '' : '<br><span style="color:#6a8296;font-size:13px">Gyűlik a tündérharmat! Hamarosan különleges tárgyakra költheted.</span>');
  var kapuSor = kapuMostNyilt
    ? '<br><span style="color:#5a3d8a;font-weight:800">🗝️ Kinyílt az egész erdő! Most minden ösvényt bejárhatsz!</span>'
    : "";
  $("vege-szoveg").innerHTML =
    "<b>" + J.futoOssz + "</b> feladatból <b>" + J.futoElsore + "</b> sikerült elsőre.<br>" +
    "Gyűjtöttél: <b>" + J.futoCsilla + " ✨</b> csillámport." +
    teljesSor + napiSor + harmatSor + kapuSor +
    (ujRekord ? '<br><span style="color:#c86bb0;font-weight:800">✨ ÚJ SAJÁT REKORD! ✨</span>' : "") +
    (egyeniP ? '' : '<br>Megvan egy újabb <b>' + (teljes ? "arany " : "") + 'csillagszilánk</b> 🌟') +
    (ujJelv.length ? '<br><span style="color:#8a6a1e;font-weight:800">🏅 Új jelvény: ' + ujJelv.map(function (j) { return j.nev; }).join(", ") + '</span>' : "");
  var kov = kovetkezoJatszhato(id);
  $("vege-kovetkezo").style.display = kov ? "" : "none";
  $("vege-kovetkezo").onclick = function () { hangGomb(); if (kov) palyaInditas(kov); };
  konfettiSzor(); hangVege();
  mutat("kepernyo-vege");
  /* bagoly: a következő pálya szorzóját mondja, hogy a gyerek dönthessen (7.1b) */
  var buzd = kov ? " Ha most rögtön nekiindulsz egy másik pályának, még több tündérharmatot gyűjtesz!" : "";
  if (kapuMostNyilt) buzd = " Kinyílt az egész erdő! Most minden ösvényt bejárhatsz." + buzd;
  var napiSzov = napiExtra ? " Ez volt a mai kiemelt pálya, kaptál plusz " + napiExtra + " tündérharmatot!" : "";
  mondd("Megérkeztünk! " + J.futoOssz + " feladatot oldottál meg." + napiSzov + buzd);
}
function keruloSzilankHalvanyit() { var s = $("jatek-szilank"); if (s) s.classList.add("halvany"); }
/* a sorozat megtörése (pálya félbehagyása cél előtt, profilváltás) — néma, nincs felirat (7.1b) */
function sorozatMegtor() { if (P().sorozat) { P().sorozat.hossz = 0; P().sorozat.utolsoPalya = null; ment(); } }
function kovetkezoJatszhato(id) {
  var L = egyeniPalyak().concat(PALYAK), idx = -1;   /* a menü sorrendje: egyéniek (4b) elöl */
  L.forEach(function (p, i) { if (p.id === id) idx = i; });
  for (var i = idx + 1; i < L.length; i++)
    if (!L[i].hamarosan && !palyaZarva(L[i]) && !palyaRejtve(L[i])) return L[i].id;
  return null;
}
function naplozz(alap, elsore, valasz) {
  P().naplo.push({ t: Date.now(), palya: J.palya.id, kerdes: alap.kerdes, valasz: String(valasz),
    helyes: alap.helyes, elsore: !!elsore, atlepes: !!alap.atlepes, tipus: alap.tipus });
  if (P().naplo.length > 80) P().naplo.shift();
}
var idomeroTimer = null;
function idomeroInd() { if (idomeroTimer) return; idomeroTimer = setInterval(function () { P().jatekMp += 1; }, 1000); }
function idomeroAll() { if (idomeroTimer) { clearInterval(idomeroTimer); idomeroTimer = null; ment(); } }
function csillaBuborek() {
  var b = el("div", null, "+✨");
  b.style.cssText = "position:absolute;left:50%;top:30%;font-size:30px;font-weight:800;color:#c86bb0;pointer-events:none;transition:all 1s ease;transform:translate(-50%,0);z-index:6";
  var jt = document.querySelector(".jatekter"); if (!jt) return;
  jt.appendChild(b);
  requestAnimationFrame(function () { b.style.top = "10%"; b.style.opacity = "0"; });
  setTimeout(function () { b.remove(); }, 1000);
}
function konfettiSzor() {
  var box = $("konfetti"); box.innerHTML = "";
  var szinek = ["#f6a5c0", "#a7d99a", "#9ec9f0", "#ffe08a", "#c3a5e0"];
  for (var i = 0; i < 46; i++) {
    var s = el("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = szinek[i % szinek.length];
    s.style.animationDuration = (2 + Math.random() * 2) + "s";
    s.style.animationDelay = (Math.random() * 0.6) + "s";
    box.appendChild(s);
  }
}


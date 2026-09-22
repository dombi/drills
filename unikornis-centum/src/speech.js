var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var beszedTamogatott = !!SR;
var felismero = null;
function figyelj(siker, hiba) {
  if (!SR) { hiba && hiba("nincs"); return; }
  try { if (felismero) felismero.abort(); } catch (e) {}
  var sajat = new SR();
  felismero = sajat;
  sajat.lang = "hu-HU"; sajat.interimResults = false; sajat.maxAlternatives = 3; sajat.continuous = false;
  var kaptunk = false, lezart = false;
  var ido = setTimeout(function () { try { sajat.stop(); } catch (e) {} }, 7000);
  /* védelem: ez a felismerő csak EGYSZER adhat eredményt/hibát, és a saját 7 mp-es
     időzítője csak a SAJÁT (nem egy időközben elindult újabb) felismerőt állíthatja le
     — előfordulhat, hogy a böngésző kétszer sül el egy elhangzott válaszra. */
  sajat.onresult = function (ev) {
    if (lezart) return; lezart = true; kaptunk = true; clearTimeout(ido);
    var alt = []; for (var i = 0; i < ev.results[0].length; i++) alt.push(ev.results[0][i].transcript);
    siker(alt);
  };
  sajat.onerror = function (ev) {
    if (lezart) return; lezart = true; clearTimeout(ido);
    hiba && hiba(ev.error === "no-speech" ? "nincs-hang" : ev.error);
  };
  sajat.onend = function () { clearTimeout(ido); if (!kaptunk && !lezart) { lezart = true; hiba && hiba("nincs-hang"); } };
  try { sajat.start(); } catch (e) { hiba && hiba("start"); }
}
function figyelStop() { FB.aktiv = false; clearTimeout(FB.timer); try { if (felismero) felismero.stop(); } catch (e) {} }

/* ── ÉLŐ FELMONDÁS: folyamatos hallgatás, soronkénti pipa + csilingelés ──────
   A gyerek egyben mondja a bontást, de a gép SORONKÉNT nyugtáz: minden jól
   kimondott sor után zöld pipa pukkan + csilingelés. A sorok tartalma NEM
   látszik (memóriajáték: fejben kell tartani, hol jár) — csak a pipák.     */
var FB = { aktiv: false, sor: 0, puffer: [], N: 0, sorHibak: 0, timer: null };

function figyeljElo(onChunk, onHiba) {
  if (!SR) { onHiba && onHiba("nincs"); return; }
  try { if (felismero) felismero.abort(); } catch (e) {}
  felismero = new SR();
  felismero.lang = "hu-HU"; felismero.interimResults = false;
  felismero.maxAlternatives = 3; felismero.continuous = true;
  felismero.onresult = function (ev) {
    for (var r = ev.resultIndex; r < ev.results.length; r++) {
      if (!ev.results[r].isFinal) continue;
      var alt = []; for (var i = 0; i < ev.results[r].length; i++) alt.push(ev.results[r][i].transcript);
      onChunk(alt);
    }
  };
  felismero.onerror = function (ev) {
    if (ev.error === "no-speech" || ev.error === "aborted") return; /* az onend újraindít */
    onHiba && onHiba(ev.error);
  };
  /* a böngésző csendnél magától leáll — amíg a felmondás él, újraindítjuk */
  felismero.onend = function () {
    if (FB.aktiv) setTimeout(function () { if (FB.aktiv) { try { felismero.start(); } catch (e) {} } }, 180);
  };
  try { felismero.start(); } catch (e) { onHiba && onHiba("start"); }
}

/* Fogyasztó: a hallott számokat az elvárt sorrendhez illeszti.
   Elvárt sorok: i + (N−i), i = 0…N, lentről; soronként opcionális kimondott
   összeg (N). Visszaadja az új állapotot + hány ÚJ sor lett kész + hiba volt-e. */
function bontasEloFogyaszt(sor, puffer, N) {
  puffer = puffer.slice();
  var uj = 0, hiba = false, megy = true;
  while (megy) {
    megy = false;
    if (sor > N) { /* minden sor kész — már csak záró összeg jöhet */
      while (puffer.length && puffer[0] === N) puffer.shift();
      if (puffer.length) hiba = true;
      break;
    }
    if (!puffer.length) break;
    if (puffer[0] === sor) {
      if (puffer.length < 2) break;                 /* várjuk a sor második tagját */
      if (puffer[1] === N - sor) { puffer.shift(); puffer.shift(); sor++; uj++; megy = true; continue; }
      if (sor === N && puffer[1] === N) { puffer.shift(); megy = true; continue; } /* ez az N még az előző sor összege volt */
      hiba = true; break;
    }
    if (puffer[0] === N && sor > 0) { puffer.shift(); megy = true; continue; }     /* előző sor kimondott összege */
    hiba = true; break;
  }
  return { sor: sor, puffer: puffer, uj: uj, hiba: hiba };
}

/* Szorzótábla-fogyasztó (a bontás mintájára, spec-hang 2.2b): a hallott számokat a
   k·N szorzatokhoz illeszti sorban. Elvárt sorok: k·N (k = 1…10), lentről. Egy szorzat
   előtt opcionálisan elhangozhat a k (sorszorzó) és az N (tábla) tag — ezeket átugorja;
   maga a szorzat kötelező. `sor` a következő szorzat 0-alapú indexe (kész, ha sor === 10). */
function szorzoEloFogyaszt(sor, puffer, szorzatok, N) {
  puffer = puffer.slice();
  var uj = 0, hiba = false;
  while (puffer.length) {
    if (sor >= szorzatok.length) { hiba = true; break; }   /* minden sor kész, mégis jött szám */
    var cel = szorzatok[sor], k = sor + 1;
    if (puffer[0] === cel) { puffer.shift(); sor++; uj++; continue; }   /* megvan a szorzat */
    if (puffer[0] === k || puffer[0] === N) { puffer.shift(); continue; }  /* opcionális sorszorzó / tábla */
    hiba = true; break;
  }
  return { sor: sor, puffer: puffer, uj: uj, hiba: hiba };
}

/* A felismerő az "öt meg egy"-et gyakran "ötvenegy"-nek (51) hallja, a
   "hat meg nulla"-t "hatvan"-nak. Ebben a feladatban 10-nél nagyobb szám nem
   hangozhat el legitim módon → minden 10 feletti számból szétbontott jelöltet
   is képzünk (51 → 5,1; 60 → 6,0 vagy 6), és a pontozó választ. */
function szetbont(szamok, nullaval) {
  var out = [];
  szamok.forEach(function (v) {
    if (v > 10) {
      out.push(Math.floor(v / 10));
      var e = v % 10;
      if (e > 0 || nullaval) out.push(e);
    } else out.push(v);
  });
  return out;
}

function bontasEloChunk(altList) {
  if (!FB.aktiv) return;
  var N = FB.N, szorzo = (FB.felmod === "szorzotabla"), legjobb = null, jeloltek = [];
  altList.forEach(function (sz) {
    var n = szamokKinyer(sz);
    if (!n.length) return;
    jeloltek.push(n);
    /* a "51 → 5,1" szétbontó heurisztika CSAK a bontásnál kell (ott nincs 10-nél nagyobb
       legitim szám); a szorzótáblánál a szorzatok maguk 10 fölöttiek, nem szabad szétvágni */
    if (!szorzo && n.some(function (v) { return v > 10; })) {
      jeloltek.push(szetbont(n, true));
      jeloltek.push(szetbont(n, false));
    }
  });
  jeloltek.forEach(function (szamok) {
    var proba = szorzo
      ? szorzoEloFogyaszt(FB.sor, FB.puffer.concat(szamok), FB.szorzatok, N)
      : bontasEloFogyaszt(FB.sor, FB.puffer.concat(szamok), N);
    var pont = proba.uj * 10 + (proba.hiba ? 0 : 5);   /* több kész sor > hibátlanság */
    if (!legjobb || pont > legjobb.pont) { legjobb = proba; legjobb.pont = pont; }
  });
  if (!legjobb) return;

  if (legjobb.uj > 0) {
    for (var k = 0; k < legjobb.uj; k++)
      setTimeout(function () { hangCsilla(); }, k * 200);
    FB.sor = legjobb.sor;
    FB.sorHibak = 0;                                  /* új sor: nulláról indul az elakadás-számláló */
    J.parokKesz = Math.min(FB.sor, FB.sorDb);
    renderPipaSor();
  }
  if (FB.sor >= FB.sorDb) { FB.puffer = legjobb.puffer; bontasEloSiker(); return; }
  if (legjobb.hiba) {
    FB.puffer = [];                                   /* a rossz próbálkozást eldobjuk – de a pipák maradnak */
    hangHiba();
    var ps = $("pipa-sor");
    ps.classList.remove("razas"); void ps.offsetWidth; ps.classList.add("razas");
    bontasEloBotlas();                                /* ugyanabból az FB.sor-ból folytatjuk, NINCS reset */
    return;
  }
  FB.puffer = legjobb.puffer;                         /* jó (esetleg félbehagyott) sor: várunk a folytatásra */
  if (legjobb.uj > 0) {
    inaktivUjra();
    /* a csilingelés után egy felszólító pittyegés: „jöhet a következő pár” */
    setTimeout(function () { if (FB.aktiv) pittyKovetkezo(); }, legjobb.uj * 200 + 160);
  }
}
function pittyKovetkezo() { beep(880, 0.08, "sine", 0, 0.12); }
/* Elakadás UGYANAZON a soron (csend vagy félrehallott pár): a haladás megmarad,
   a bagoly megmutatja a soron következő párt + pittyegés, és ugyanabból az FB.sor-ból
   figyel tovább. Csak sok egymás utáni elakadás után adjuk fel (→ lépésenkénti beírás). */
function bontasEloBotlas() {
  if (!FB.aktiv) return;
  FB.sorHibak++;
  if (FB.sorHibak >= 4) { bontasEloVege(); return; }
  if (FB.felmod === "szorzotabla") bagolyMondat("Most ezt mondd: " + szorSzo(FB.sor + 1) + " " + FB.N + ".");
  else bagolyMondat("Most ezt mondd: " + FB.sor + " meg " + (FB.N - FB.sor) + ".");
  setTimeout(function () { if (FB.aktiv) pittyKovetkezo(); }, 900);
  inaktivUjra();
}

/* Felmondás KÖZBEN csak pipák látszanak (a tartalom a fejben van) —
   a golyós lista a legvégén jelenik meg, jutalomként. */
function renderPipaSor() {
  var box = $("pipa-sor"); box.hidden = false; box.innerHTML = "";
  var sor = el("div", "pipa-hatra");
  var db = FB.sorDb || (FB.N + 1);
  for (var i = 0; i < db; i++)
    sor.appendChild(el("span", "pipa-hely" + (i < FB.sor ? " kesz" : "")));
  box.appendChild(sor);
}

/* A VÉGÉN: az összes bontás golyóhuzogatós ábrával (2+4=6 → 2 piros + 4 kék
   golyó a rúdon), képlettel és pipával. */
function renderGolyoLista() {
  if (J.feladat.felmod === "szorzotabla") { renderSzorzoLista(); return; }
  var box = $("pipa-sor"); box.hidden = false; box.innerHTML = "";
  var N = J.feladat.N;
  for (var i = 0; i <= N; i++) {
    var sorEl = el("div", "golyo-sor uj");
    sorEl.style.animationDelay = (i * 90) + "ms";
    var g = "";
    for (var p = 0; p < i; p++) g += '<i class="golyo piros"></i>';
    for (var k = 0; k < N - i; k++) g += '<i class="golyo kek"></i>';
    sorEl.innerHTML =
      '<span class="golyok">' + g + '</span>' +
      '<span class="golyo-keplet">' + i + ' + ' + (N - i) + ' = ' + N + '</span>' +
      '<span class="golyo-pipa">✓</span>';
    box.appendChild(sorEl);
  }
}

/* Szorzótábla jutalom-lista a végén: 1×N … 10×N a szorzatokkal + pipa (nincs golyó). */
function renderSzorzoLista() {
  var box = $("pipa-sor"); box.hidden = false; box.innerHTML = "";
  var N = J.feladat.N;
  for (var k = 1; k <= 10; k++) {
    var sorEl = el("div", "golyo-sor szorzo-sor uj");
    sorEl.style.animationDelay = ((k - 1) * 80) + "ms";
    sorEl.innerHTML =
      '<span class="golyo-keplet">' + k + ' × ' + N + ' = ' + (k * N) + '</span>' +
      '<span class="golyo-pipa">✓</span>';
    box.appendChild(sorEl);
  }
}

function inaktivUjra() {
  clearTimeout(FB.timer);
  FB.timer = setTimeout(function () {
    if (!FB.aktiv) return;
    bontasEloBotlas();                                /* csend: ugyanaz a segítés, mint a félrehallásnál – NINCS reset */
  }, 12000);
}

/* CSAK a feladat legelső indításakor hívjuk – ez nullázza a haladást (FB.sor = 0). */
/* a felmondás típusától függő gombfelirat (bontás vs. szorzótábla) */
function felmondMondomSzo() {
  return (J && J.feladat && J.feladat.felmod === "szorzotabla") ? "🎤 Mondom a szorzótáblát" : "🎤 Mondom a bontását";
}
function bontasEloStart() {
  if (J.lepesAktiv) return;                          /* beírós módban ne kapcsoljon vissza hangra */
  var szt = (J.feladat.felmod === "szorzotabla");
  FB = { aktiv: true, sor: 0, puffer: [], N: J.feladat.N, sorDb: szt ? 10 : (J.feladat.N + 1),
         felmod: J.feladat.felmod || "bontas", szorzatok: J.feladat.szorzatok || null, sorHibak: 0, timer: null };
  J.parokKesz = 0;
  var g = $("mondom-bontas-gomb");
  g.classList.add("figyel"); g.textContent = "⏹ Kész vagyok";
  $("hallgat-f").hidden = false;
  $("felmond-lista").hidden = true; $("felmond-lista").innerHTML = "";
  $("felmond-megvan").hidden = true;
  $("visszajelzes-f").textContent = ""; $("visszajelzes-f").className = "visszajelzes";
  renderPipaSor();
  try { speechSynthesis.cancel(); } catch (e) {}     /* a felolvasást ne hallja a mikrofon */
  inaktivUjra();
  figyeljElo(bontasEloChunk, bontasEloHibaAg);
}
/* Elakadás UTÁNI folytatás – a haladást (FB.sor, pipák, J.parokKesz) NEM nullázza,
   csak újraindítja a hallgatást ugyanabból a pontból. Soha ne kezdje elölről. */
function bontasEloFolytat() {
  if (!J || !J.feladat || J.feladat.csalad !== "felmondas") return;
  FB.aktiv = true;
  FB.puffer = [];
  var g = $("mondom-bontas-gomb");
  g.classList.add("figyel"); g.textContent = "⏹ Kész vagyok";
  $("hallgat-f").hidden = false;
  inaktivUjra();
  figyeljElo(bontasEloChunk, bontasEloHibaAg);
}
function bontasEloHibaAg(hiba) {
  bontasEloElhallgat();
  if (hiba === "nincs" || hiba === "not-allowed" || hiba === "service-not-allowed") {
    beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
    $("visszajelzes-f").textContent = "Most beírással játszunk.";
    bontasLepesNyit();
  } else if (felmondKezNelkulE()) {
    $("visszajelzes-f").textContent = "Egy pillanat — figyelek tovább…";
    setTimeout(function () { if (felmondKezNelkulE()) bontasEloFolytat(); }, 600);
  } else {
    $("visszajelzes-f").textContent = "Nyomd meg a gombot, és folytasd onnan!";
  }
}

function bontasEloElhallgat() {
  FB.aktiv = false; clearTimeout(FB.timer);
  try { if (felismero) felismero.abort(); } catch (e) {}
  var g = $("mondom-bontas-gomb");
  g.classList.remove("figyel"); g.textContent = felmondMondomSzo();
  $("hallgat-f").hidden = true;
}

function bontasEloSiker() {
  bontasEloElhallgat();
  felmondSiker();                        /* a gyöngyös lista + „mondd el még egyszer” benne */
}

/* Végszükség: „Kész vagyok" gomb, vagy ugyanazon a soron 4× elakadás.
   NINCS újrakezdés – a meglévő pipáktól folytatjuk lépésenkénti beírással. */
function bontasEloVege() {
  bontasEloElhallgat();
  if (FB.sor >= FB.sorDb) return;                     /* minden sor kész — nincs mit beírni */
  J.parokKesz = FB.sor;                               /* a beírás innen folytatódik (bontasLepesNyit) */
  $("visszajelzes-f").className = "visszajelzes";
  $("visszajelzes-f").textContent = FB.sor > 0
    ? ("Eddig " + FB.sor + " pipa megvan — fejezzük be beírással!")
    : "Nézzük lépésenként!";
  mondd((FB.sor > 0 ? "Fejezzük be beírással. " : "Nézzük lépésenként. ") + J.feladat.tipp, function () { bontasLepesNyit(); });
  ment();
}


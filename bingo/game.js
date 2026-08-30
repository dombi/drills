/* ============================================================================
 * Szorzótábla Bingó — POC
 * ----------------------------------------------------------------------------
 * A játékos szelvényt kap: 5×5 rács, közepén ★ (ajándék-mező). Rajta az adott
 * szorzótábla MIND A 10 szorzata + 14 zavaró szám (közeli számok, más táblák
 * szorzatai). A játékvezető bemondja a szorzást (pl. 4 × 6) — a játékos
 * ceruzával kiikszeli a 24-et. Mind a 10 szorzat kiikszelve = BINGÓ!
 * Idő számít; rekord táblánként. Rossz kattintás: tanító üzenet + hiba-számláló.
 * ========================================================================== */
(function () {
  "use strict";

  var state = {
    tabla: 6,
    calls: [],           /* a bemondások sorrendje: [szorzó1..10 keverve] */
    idx: 0,              /* hányadik bemondásnál járunk */
    cells: [],           /* 25 mező: { num, star, crossed } */
    hibak: 0,
    startedAt: null,
    over: false,
  };

  var elRacs = document.getElementById("racs");
  var elUzenet = document.getElementById("uzenet");
  var uzenetTimer = null, oraTimer = null, arcTimer = null, bubTimer = null;

  /* ---- a porondmester szövegei (a buborékban mondja) ---- */
  var DICSERET = [
    "Bravó! Ilyet még a nagykönyv se látott!",
    "Hölgyeim és uraim: egy zseni ül a teremben!",
    "Telitalálat! A bajszom is beleremegett!",
    "Kiiiváló! A gömb meg se mert mukkanni!",
    "Ez igen! Taps a művésznek!",
  ];
  var SZIDAS = [
    "Ejnye-bejnye! A gömb bizony mást mondott!",
    "Hoppá! Ezt a golyót azonnal visszakérem!",
    "Ó, a cilinderem! Nézd csak meg újra!",
    "Hohó! A számok nem hazudnak, kedves játékos!",
    "Majdnem! De a bingóban a majdnem nem pont!",
  ];
  function pickLine(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------------------------------------------------------------- segéd */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function currentProduct() { return state.calls[state.idx] * state.tabla; }

  /* ------------------------------------------------------- szelvény-gyártás */
  function makeCard() {
    var products = [];
    for (var k = 1; k <= 10; k++) products.push(k * state.tabla);

    /* zavarók: más táblák szorzatai + szomszéd-számok, ami NEM a tábla szorzata */
    var inTable = {};
    products.forEach(function (p) { inTable[p] = true; });
    var pool = {};
    for (var m = 1; m <= 10; m++)
      for (var n = 1; n <= 10; n++)
        if (!inTable[m * n]) pool[m * n] = true;
    products.forEach(function (p) {
      [p - 2, p - 1, p + 1, p + 2].forEach(function (v) {
        if (v > 0 && !inTable[v]) pool[v] = true;
      });
    });
    var distract = shuffle(Object.keys(pool).map(Number)).slice(0, 14);

    var nums = shuffle(products.concat(distract));
    state.cells = [];
    for (var i = 0; i < 25; i++) {
      if (i === 12) state.cells.push({ num: null, star: true, crossed: false });
      else state.cells.push({ num: nums.pop(), star: false, crossed: false });
    }
  }

  /* ------------------------------------------------------------ játékmenet */
  function newRound() {
    state.calls = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    state.idx = 0;
    state.hibak = 0;
    state.over = false;
    state.startedAt = null;
    clearInterval(oraTimer);
    makeCard();
    document.getElementById("szelveny-cim").textContent = state.tabla + "-os tábla";
    document.getElementById("hibak").textContent = "0";
    document.getElementById("ora").textContent = "0:00";
    document.getElementById("vege").classList.add("rejtett");
    setFace(null);
    renderCard();
    renderProgress();
    renderRekord();
    announce();
  }

  /* a buborék átmenetileg a porondmester szövegét mondja, majd visszaáll */
  function speakLine(line, ms, restoreCall) {
    clearTimeout(bubTimer);
    var el = document.getElementById("hivas");
    el.textContent = line;
    el.classList.add("hivas-szoveg");
    popBubble();
    if (restoreCall) {
      bubTimer = setTimeout(function () {
        el.classList.remove("hivas-szoveg");
        el.textContent = state.calls[state.idx] + " × " + state.tabla;
      }, ms);
    }
  }

  function popBubble() {
    var bub = document.getElementById("buborek");
    bub.classList.remove("buborek-pukkan");
    void bub.offsetWidth;
    bub.classList.add("buborek-pukkan");
  }

  function announce() {
    var call = state.calls[state.idx];
    var szoveg = call + " × " + state.tabla;
    clearTimeout(bubTimer);
    var el = document.getElementById("hivas");
    el.classList.remove("hivas-szoveg");
    el.textContent = szoveg;
    popBubble();
    /* a golyó kigurul a gömbből */
    var golyo = document.getElementById("golyo");
    document.getElementById("golyo-szoveg").textContent = szoveg;
    golyo.classList.remove("rejtett", "golyo-gurul");
    void golyo.offsetWidth;
    golyo.classList.add("golyo-gurul");
    /* a gömb megpördül */
    var gomb = document.getElementById("gomb");
    gomb.classList.remove("gomb-porog");
    void gomb.offsetWidth;
    gomb.classList.add("gomb-porog");
  }

  function clickCell(i) {
    var cell = state.cells[i];
    if (state.over || cell.star || cell.crossed) return;
    startClock();
    var jo = currentProduct();

    if (cell.num === jo) {
      cell.crossed = true;
      crossCell(i);
      setFace("orul", 2400);               /* öröm + tapsoló kezek */
      speakLine(pickLine(DICSERET), 2400, false);
      state.idx += 1;
      renderProgress();
      if (state.idx >= 10) { win(); return; }
      flash("✔ " + state.calls[state.idx - 1] + " × " + state.tabla + " = " + jo, true);
      setTimeout(function () { if (!state.over) announce(); }, 2500);
    } else {
      state.hibak += 1;
      document.getElementById("hibak").textContent = state.hibak;
      /* véletlen vicces reakció: morcos fej / kinevetés / megrökönyödés */
      var arcok = ["morcos", "nevet", "oo"];
      setFace(arcok[Math.floor(Math.random() * arcok.length)], 2600);
      speakLine(pickLine(SZIDAS), 2600, true);   /* utána visszaáll a feladat */
      flash("✘ " + state.calls[state.idx] + " × " + state.tabla + " = " + jo +
            " — az pedig " + cell.num + "!");
      var el = document.getElementById("mezo-" + i);
      if (el) { el.classList.add("mezo-razas");
        setTimeout(function () { el.classList.remove("mezo-razas"); }, 350); }
    }
  }

  function win() {
    state.over = true;
    clearInterval(oraTimer);
    var ms = Date.now() - state.startedAt;
    var best = getBest();
    var ujRekord = best === null || ms < best;
    if (ujRekord) { try { localStorage.setItem(bestKey(), String(ms)); } catch (e) {} }
    document.getElementById("vege-szoveg").innerHTML =
      "A(z) <b>" + state.tabla + "-os tábla</b> mind a 10 szorzata megvan!<br>" +
      "Idő: <b>" + fmtIdo(ms) + "</b> · Hibák: <b>" + state.hibak + "</b>" +
      (ujRekord ? ' <br><span class="uj-rekord">🏆 ÚJ REKORD!</span>'
                : "<br>(rekordod: " + fmtIdo(best) + ")");
    document.getElementById("vege").classList.remove("rejtett");
    renderRekord();
  }

  /* ------------------------------------------------------------ időmérés */
  function fmtIdo(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function startClock() {
    if (state.startedAt !== null) return;
    state.startedAt = Date.now();
    oraTimer = setInterval(function () {
      document.getElementById("ora").textContent = fmtIdo(Date.now() - state.startedAt);
    }, 500);
  }
  function bestKey() { return "bingo:best:" + state.tabla; }
  function getBest() {
    try { var v = localStorage.getItem(bestKey()); return v ? +v : null; }
    catch (e) { return null; }
  }
  function renderRekord() {
    var best = getBest();
    document.getElementById("rekord").textContent =
      best !== null ? "🏆 rekord: " + fmtIdo(best) : "";
  }

  /* ------------------------------------------------------------ rajzolás */
  function renderCard() {
    elRacs.innerHTML = "";
    state.cells.forEach(function (cell, i) {
      var el = document.createElement("button");
      el.id = "mezo-" + i;
      el.className = "mezo" + (cell.star ? " mezo-csillag" : "") +
                     (cell.crossed ? " mezo-kihuzva" : "");
      el.innerHTML = cell.star
        ? "★"
        : '<span class="mezo-szam">' + cell.num + '</span>' +
          '<svg class="iksz" viewBox="0 0 60 60">' +
          '<path class="iksz-1" d="M12 14 L48 48" transform="rotate(' + (Math.random() * 8 - 4) + ' 30 30)"/>' +
          '<path class="iksz-2" d="M48 12 L14 48" transform="rotate(' + (Math.random() * 8 - 4) + ' 30 30)"/>' +
          '</svg>';
      if (!cell.star) el.onclick = function () { clickCell(i); };
      elRacs.appendChild(el);
    });
  }

  function crossCell(i) {
    var el = document.getElementById("mezo-" + i);
    if (el) el.classList.add("mezo-kihuzva");
  }

  function renderProgress() {
    document.getElementById("halad").textContent = state.idx + "/10";
  }

  /* a játékvezető arca: null = normál, "orul" (tapssal), "oo", "morcos", "nevet" */
  var ARCOK = ["orul", "oo", "morcos", "nevet"];
  function setFace(face, ms) {
    clearTimeout(arcTimer);
    var h = document.getElementById("hoszt");
    ARCOK.forEach(function (a) { h.classList.remove(a); });
    if (face) {
      h.classList.add(face);
      arcTimer = setTimeout(function () {
        ARCOK.forEach(function (a) { h.classList.remove(a); });
      }, ms || 1000);
    }
  }

  function flash(msg, ok) {
    elUzenet.textContent = msg;
    elUzenet.className = "uzenet lathato" + (ok ? " uzenet-ok" : "");
    clearTimeout(uzenetTimer);
    uzenetTimer = setTimeout(function () { elUzenet.className = "uzenet"; }, 1800);
  }

  /* ------------------------------------------------------------- vezérlők */
  function renderTablaSor() {
    var sor = document.getElementById("tabla-sor");
    sor.innerHTML = "";
    for (var n = 1; n <= 10; n++) {
      (function (n) {
        var b = document.createElement("button");
        b.className = "tabla" + (n === state.tabla ? " tabla-on" : "");
        b.textContent = n;
        b.onclick = function () { state.tabla = n; renderTablaSor(); newRound(); };
        sor.appendChild(b);
      })(n);
    }
  }

  document.getElementById("btn-uj").onclick = newRound;
  document.getElementById("btn-ujra").onclick = newRound;

  renderTablaSor();
  newRound();
})();

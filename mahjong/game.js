/* ============================================================================
 * Bontás-Mahjong — POC
 * ----------------------------------------------------------------------------
 * Mahjong-szabály: egy kő akkor SZABAD, ha nem fedi felülről kő, ÉS a bal vagy
 * a jobb oldala üres. Két szabad kő levehető, ha az értékük összege a főszám
 * (pl. 7-es játékban 2+5, 0+7, 3+4 …). Cél: lepakolni az egész asztalt.
 *
 * Elrendezés fél-egység rácson: egy kő 2 egység széles, 2 magas. A rétegek
 * igazítva ülnek egymáson (POC-egyszerűsítés).
 * ========================================================================== */
(function () {
  "use strict";

  /* ---- elrendezés: {x, y, z} fél-egységekben; kő = 2×2 egység ---- */
  var LAYOUT = (function () {
    var pos = [];
    /* alsó réteg: 7×4 */
    for (var r = 0; r < 4; r++)
      for (var c = 0; c < 7; c++)
        pos.push({ x: c * 2, y: r * 2, z: 0 });
    /* középső réteg: 3×2, középre igazítva */
    for (r = 0; r < 2; r++)
      for (c = 0; c < 3; c++)
        pos.push({ x: 4 + c * 2, y: 2 + r * 2, z: 1 });
    return pos; /* 28 + 6 = 34 kő (páros ✓) */
  })();

  var TILE_W = 66, TILE_H = 88;    /* px; fél-egység = W/2, H/2 */
  var Z_SHIFT = 7;                 /* felsőbb réteg vizuális eltolása */

  var state = {
    fo: 7,               /* főszám */
    tiles: [],           /* { id, val, x, y, z, alive } */
    selected: null,
    found: [],           /* megtalált bontások: "2+5" */
    startedAt: null,     /* időmérés: az ELSŐ kattintásnál indul */
    finalMs: null,
  };

  var elAsztal = document.getElementById("asztal");
  var elUzenet = document.getElementById("uzenet");
  var uzenetTimer = null;
  var idoTimer = null;

  /* ------------------------------------------------------------ időmérés */
  function fmtIdo(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function bestKey() { return "mahjong:best:" + state.fo; }
  function getBest() {
    try { var v = localStorage.getItem(bestKey()); return v ? +v : null; }
    catch (e) { return null; }
  }
  function setBest(ms) {
    try { localStorage.setItem(bestKey(), String(ms)); } catch (e) {}
  }
  function renderIdo() {
    var el = document.getElementById("ido");
    el.textContent = state.finalMs !== null ? fmtIdo(state.finalMs)
      : state.startedAt ? fmtIdo(Date.now() - state.startedAt) : "0:00";
    var best = getBest();
    document.getElementById("rekord").textContent =
      best !== null ? " · 🏆 rekord: " + fmtIdo(best) : "";
  }
  function startClock() {
    if (state.startedAt !== null) return;
    state.startedAt = Date.now();
    idoTimer = setInterval(renderIdo, 500);
  }
  function stopClock() {
    clearInterval(idoTimer);
    idoTimer = null;
  }

  /* ---------------------------------------------------------------- segéd */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function overlaps(a, b) {  /* két kő footprintje fedi-e egymást (x/y-ban) */
    return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
  }

  function isFree(tile) {
    if (!tile.alive) return false;
    var left = false, right = false, covered = false;
    state.tiles.forEach(function (t) {
      if (!t.alive || t.id === tile.id) return;
      if (t.z === tile.z + 1 && overlaps(t, tile)) covered = true;
      if (t.z === tile.z && Math.abs(t.y - tile.y) < 2) {
        if (t.x === tile.x - 2) left = true;
        if (t.x === tile.x + 2) right = true;
      }
    });
    return !covered && (!left || !right);
  }

  function freeTiles() { return state.tiles.filter(isFree); }

  function freePair() {  /* van-e levehető pár? visszaadja az elsőt */
    var free = freeTiles();
    for (var i = 0; i < free.length; i++)
      for (var j = i + 1; j < free.length; j++)
        if (free[i].val + free[j].val === state.fo) return [free[i], free[j]];
    return null;
  }

  /* ------------------------------------------------------------ új játék */
  function newGame() {
    var pairs = LAYOUT.length / 2;
    var types = [];                       /* bontás-típusok: [0,fo],[1,fo-1]… */
    for (var k = 0; k <= Math.floor(state.fo / 2); k++) types.push([k, state.fo - k]);
    var values = [];
    for (var p = 0; p < pairs; p++) {
      var t = types[p % types.length];    /* egyenletesen minden bontásból */
      values.push(t[0], t[1]);
    }
    shuffle(values);
    state.tiles = LAYOUT.map(function (pos, i) {
      return { id: i, val: values[i], x: pos.x, y: pos.y, z: pos.z, alive: true };
    });
    state.selected = null;
    state.found = [];
    stopClock();
    state.startedAt = null;
    state.finalMs = null;
    render();
    renderFound();
    renderIdo();
    hideWin();
  }

  /* keverés: a megmaradt kövek értékeit újraosztja ugyanazokra a helyekre */
  function reshuffle() {
    var alive = state.tiles.filter(function (t) { return t.alive; });
    var vals = shuffle(alive.map(function (t) { return t.val; }));
    alive.forEach(function (t, i) { t.val = vals[i]; });
    state.selected = null;
    render();
    flash("Megkevertem a köveket! 🔀");
  }

  /* -------------------------------------------------------------- játék */
  function clickTile(tile) {
    startClock();  /* az óra az első érintésre indul */
    if (!isFree(tile)) { flash("Ez a kő még nem szabad — előbb szabadítsd ki!"); return; }

    if (state.selected === null) {
      state.selected = tile.id;
      render();
      return;
    }
    if (state.selected === tile.id) {     /* kijelölés visszavonása */
      state.selected = null;
      render();
      return;
    }

    var first = state.tiles[state.selected];
    var sum = first.val + tile.val;
    if (sum === state.fo) {
      first.alive = false;
      tile.alive = false;
      state.selected = null;
      var kis = Math.min(first.val, tile.val), nagy = Math.max(first.val, tile.val);
      var key = kis + "+" + nagy;
      if (state.found.indexOf(key) === -1) state.found.push(key);
      render();
      renderFound();
      flash("✔ " + kis + " + " + nagy + " = " + state.fo, true);
      checkEnd();
    } else {
      flash("✘ " + first.val + " + " + tile.val + " = " + sum +
            " — nekünk " + state.fo + " kell!");
      shakeTile(tile.id);
      shakeTile(first.id);
      state.selected = null;
      setTimeout(render, 350);
    }
  }

  function checkEnd() {
    var alive = state.tiles.filter(function (t) { return t.alive; });
    if (alive.length === 0) { showWin(); return; }
    if (!freePair()) flash("Nincs több lépés — nyomd meg a Keverést! 🔀");
  }

  function hint() {
    var pair = freePair();
    if (!pair) { flash("Most nincs levehető pár — keverj!"); return; }
    pair.forEach(function (t) {
      var el = document.getElementById("ko-" + t.id);
      if (el) { el.classList.add("ko-tipp"); setTimeout(function () { el.classList.remove("ko-tipp"); }, 1400); }
    });
  }

  /* ------------------------------------------------------------ rajzolás */
  function tileHTML(t) {
    var sticks = "";
    for (var i = 0; i < t.val; i++) sticks += '<i class="palcika"></i>';
    return '<span class="ko-szam">' + t.val + '</span>' +
           '<span class="ko-palcikak">' + (t.val === 0 ? '<em class="ures">üres</em>' : sticks) + '</span>';
  }

  function render() {
    elAsztal.innerHTML = "";
    /* rétegek szerint rendezve, hogy a felső kő rajzolódjon felülre */
    var sorted = state.tiles.slice().sort(function (a, b) {
      return a.z - b.z || a.y - b.y || a.x - b.x;
    });
    sorted.forEach(function (t) {
      if (!t.alive) return;
      var el = document.createElement("button");
      el.className = "ko" + (isFree(t) ? " ko-szabad" : " ko-fedett") +
                     (state.selected === t.id ? " ko-kijelolt" : "");
      el.id = "ko-" + t.id;
      el.style.left = (t.x * TILE_W / 2 - t.z * Z_SHIFT) + "px";
      el.style.top = (t.y * TILE_H / 2 - t.z * Z_SHIFT) + "px";
      el.style.zIndex = t.z * 100 + t.y * 10 + t.x;
      el.innerHTML = tileHTML(t);
      el.onclick = function () { clickTile(t); };
      elAsztal.appendChild(el);
    });
    /* az asztal mérete az elrendezéshez */
    elAsztal.style.width = (7 * TILE_W + Z_SHIFT) + "px";
    elAsztal.style.height = (4 * TILE_H + Z_SHIFT) + "px";
  }

  function renderFound() {
    var el = document.getElementById("bontas-lista");
    el.innerHTML = state.found.length
      ? state.found.map(function (f) { return '<span class="bontas">' + f + '</span>'; }).join(" ")
      : '<span class="bontas-ures">még nincs</span>';
  }

  function shakeTile(id) {
    var el = document.getElementById("ko-" + id);
    if (el) el.classList.add("ko-razas");
  }

  function flash(msg, ok) {
    elUzenet.textContent = msg;
    elUzenet.className = "uzenet lathato" + (ok ? " uzenet-ok" : "");
    clearTimeout(uzenetTimer);
    uzenetTimer = setTimeout(function () { elUzenet.className = "uzenet"; }, 1800);
  }

  function showWin() {
    state.finalMs = state.startedAt ? Date.now() - state.startedAt : 0;
    stopClock();
    var best = getBest();
    var ujRekord = best === null || state.finalMs < best;
    if (ujRekord) setBest(state.finalMs);
    renderIdo();

    var lista = [];
    for (var k = 0; k <= Math.floor(state.fo / 2); k++) lista.push(k + "+" + (state.fo - k));
    document.getElementById("gyozelem-szoveg").innerHTML =
      "Idő: <b>" + fmtIdo(state.finalMs) + "</b>" +
      (ujRekord
        ? ' <span class="uj-rekord">🏆 ÚJ REKORD!</span>'
        : " (rekordod: " + fmtIdo(best) + ")") +
      "<br><br>A(z) <b>" + state.fo + "</b> minden bontása a fejedben van:<br><b>" +
      lista.join(" &nbsp;·&nbsp; ") + "</b>";
    document.getElementById("gyozelem").classList.remove("rejtett");
  }
  function hideWin() { document.getElementById("gyozelem").classList.add("rejtett"); }

  /* ------------------------------------------------------------- vezérlők */
  function renderFoszamSor() {
    var sor = document.getElementById("foszam-sor");
    sor.innerHTML = "";
    [5, 6, 7, 8, 9, 10].forEach(function (n) {
      var b = document.createElement("button");
      b.className = "foszam" + (n === state.fo ? " foszam-on" : "");
      b.textContent = n;
      b.onclick = function () { state.fo = n; renderFoszamSor(); newGame(); };
      sor.appendChild(b);
    });
    document.getElementById("cel-szam").textContent = state.fo;
  }

  document.getElementById("btn-uj").onclick = newGame;
  document.getElementById("btn-ujra").onclick = newGame;
  document.getElementById("btn-kever").onclick = reshuffle;
  document.getElementById("btn-segit").onclick = hint;

  renderFoszamSor();
  newGame();
})();

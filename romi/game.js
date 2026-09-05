/* ============================================================================
 * Számrömi — POC
 * ----------------------------------------------------------------------------
 * 20 lap a posztón: 5 érvényes HÁRMAS (X + Y = Z), azaz 5×3 = 15 lap, plusz
 * TROMBITA (zavaró) lapok. Egy hármas felvétele: koppints a három lapra,
 * aminél a legnagyobb érték a másik kettő összege. Ha megvan mind az 5 hármas
 * → új osztás. Időre megy; rekord szintenként.
 *
 * Paraméterek (később hangolható): HARMASOK, ZAVARO, a szint = max összeg.
 * ========================================================================== */
(function () {
  "use strict";

  var HARMASOK = 5;              /* ennyi érvényes hármas van egy osztásban */
  var ZAVARO = 5;               /* ennyi zavaró lap (később beparaméterezzük) */
  var ROUND_MS = 120 * 1000;

  var SUITS = [
    { jel: "♠", szin: "fekete" }, { jel: "♥", szin: "piros" },
    { jel: "♦", szin: "piros" },  { jel: "♣", szin: "fekete" },
  ];

  var state = {
    szint: 20,           /* max összeg (Z felső korlátja) */
    cards: [],           /* { id, val, suit, alive } */
    selected: [],
    score: 0,            /* összes felvett hármas a körben */
    osztasKesz: 0,       /* ebben az osztásban felvett hármasok */
    startedAt: null,
    over: false,
  };

  var elPoszto = document.getElementById("poszto");
  var elUzenet = document.getElementById("uzenet");
  var uzenetTimer = null, oraTimer = null, nextId = 0;

  /* ---------------------------------------------------------------- segéd */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function randSuit() { return SUITS[randInt(0, 3)]; }

  /* -------------------------------------------------- osztás-generátor */
  function genValues() {
    var S = state.szint, vals = [];
    for (var t = 0; t < HARMASOK; t++) {
      var x = randInt(1, S - 1);
      var y = randInt(1, S - x);           /* x + y ≤ S */
      vals.push(x, y, x + y);              /* a két tag és az összeg */
    }
    for (var d = 0; d < ZAVARO; d++) vals.push(randInt(1, S));
    return shuffle(vals);
  }

  function newDeal() {
    state.cards = genValues().map(function (v) {
      return { id: nextId++, val: v, suit: randSuit(), alive: true };
    });
    state.selected = [];
    state.osztasKesz = 0;
    renderOsztas();
    render();
  }

  /* ------------------------------------------------------------- szabály */
  function aliveCards() { return state.cards.filter(function (c) { return c.alive; }); }

  function harmasE(vals) {                 /* a legnagyobb == másik kettő összege? */
    var s = vals.slice().sort(function (a, b) { return a - b; });
    return s[0] + s[1] === s[2];
  }

  function vanMegHarmas() {                /* létezik-e még érvényes hármas a lapokból */
    var a = aliveCards();
    for (var i = 0; i < a.length; i++)
      for (var j = i + 1; j < a.length; j++)
        for (var k = j + 1; k < a.length; k++)
          if (harmasE([a[i].val, a[j].val, a[k].val])) return true;
    return false;
  }

  function clickCard(card) {
    if (state.over || !card.alive) return;
    startClock();

    var idx = state.selected.indexOf(card.id);
    if (idx !== -1) { state.selected.splice(idx, 1); render(); return; }
    if (state.selected.length >= 3) return;
    state.selected.push(card.id);
    render();
    if (state.selected.length < 3) return;

    /* megvan a 3 lap → kiértékelés */
    var picked = state.selected.map(function (id) {
      return state.cards.find(function (c) { return c.id === id; });
    });
    var vals = picked.map(function (c) { return c.val; });

    if (harmasE(vals)) {
      picked.forEach(function (c) { c.alive = false; });
      state.selected = [];
      state.score += 1;
      state.osztasKesz += 1;
      document.getElementById("pont").textContent = state.score;
      renderOsztas();
      var s = vals.slice().sort(function (a, b) { return a - b; });
      flash("✔ " + s[0] + " + " + s[1] + " = " + s[2], true);
      render();

      if (state.osztasKesz >= HARMASOK) {              /* megvan mind az 5 → új osztás */
        flash("Mind az 5 hármas megvan — új osztás! 🃏", true);
        setTimeout(function () { if (!state.over) newDeal(); }, 900);
      } else if (!vanMegHarmas()) {                     /* elakadt → keverés */
        flash("Nincs több hármas — keverek! 🔀", true);
        setTimeout(function () { if (!state.over) reshuffle(); }, 900);
      }
    } else {
      var s2 = vals.slice().sort(function (a, b) { return a - b; });
      flash("✘ " + s2[0] + " + " + s2[1] + " = " + (s2[0] + s2[1]) + ", nem " + s2[2] + "!");
      picked.forEach(function (c) { shakeCard(c.id); });
      state.selected = [];
      setTimeout(render, 350);
    }
  }

  /* keverés: a megmaradt lapok értékeit újraosztja, garantáltan megoldhatóra */
  function reshuffle() {
    var alive = aliveCards();
    var kell = HARMASOK - state.osztasKesz;             /* még ennyi hármas kell */
    var vals = [];
    for (var t = 0; t < kell; t++) {
      var x = randInt(1, state.szint - 1);
      var y = randInt(1, state.szint - x);
      vals.push(x, y, x + y);
    }
    while (vals.length < alive.length) vals.push(randInt(1, state.szint));
    shuffle(vals);
    alive.forEach(function (c, i) { c.val = vals[i]; c.suit = randSuit(); });
    state.selected = [];
    render();
    flash("Megkevertem a lapokat! 🔀");
  }

  /* ------------------------------------------------------------ időmérés */
  function fmtIdo(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function startClock() {
    if (state.startedAt !== null) return;
    state.startedAt = Date.now();
    oraTimer = setInterval(tick, 250);
  }
  function tick() {
    var left = ROUND_MS - (Date.now() - state.startedAt);
    var el = document.getElementById("ora");
    el.textContent = fmtIdo(left);
    el.classList.toggle("ora-veszes", left < 15000);
    if (left <= 0) endRound();
  }
  function bestKey() { return "romi:best:" + state.szint; }
  function getBest() {
    try { var v = localStorage.getItem(bestKey()); return v ? +v : null; }
    catch (e) { return null; }
  }
  function renderRekord() {
    var best = getBest();
    document.getElementById("rekord").textContent =
      best !== null ? "🏆 rekord: " + best : "";
  }

  function endRound() {
    state.over = true;
    clearInterval(oraTimer);
    var best = getBest();
    var ujRekord = best === null || state.score > best;
    if (ujRekord) { try { localStorage.setItem(bestKey(), String(state.score)); } catch (e) {} }
    document.getElementById("vege-szoveg").innerHTML =
      "<b>" + state.score + " hármast</b> gyűjtöttél 2 perc alatt!" +
      (ujRekord ? ' <span class="uj-rekord">🏆 ÚJ REKORD!</span>'
                : " (rekordod: " + best + ")");
    document.getElementById("vege").classList.remove("rejtett");
    renderRekord();
  }

  function newRound() {
    state.score = 0;
    state.over = false;
    state.startedAt = null;
    clearInterval(oraTimer);
    document.getElementById("pont").textContent = "0";
    document.getElementById("ora").textContent = fmtIdo(ROUND_MS);
    document.getElementById("ora").classList.remove("ora-veszes");
    document.getElementById("vege").classList.add("rejtett");
    renderRekord();
    newDeal();
  }

  /* ------------------------------------------------------------ rajzolás */
  function cardHTML(c) {
    return '<span class="lap-sarok">' + c.val + '<em>' + c.suit.jel + '</em></span>' +
           '<span class="lap-fo">' + c.val + '</span>' +
           '<span class="lap-sarok lap-sarok-lent">' + c.val + '<em>' + c.suit.jel + '</em></span>';
  }
  function render() {
    elPoszto.innerHTML = "";
    state.cards.forEach(function (c) {
      var el = document.createElement("button");
      el.className = "lap lap-" + c.suit.szin +
                     (c.alive ? "" : " lap-ures") +
                     (state.selected.indexOf(c.id) !== -1 ? " lap-kijelolt" : "");
      el.id = "lap-" + c.id;
      if (c.alive) {
        el.innerHTML = cardHTML(c);
        el.onclick = function () { clickCard(c); };
      }
      elPoszto.appendChild(el);
    });
  }
  function renderOsztas() {
    document.getElementById("osztas").textContent = state.osztasKesz + "/" + HARMASOK;
  }
  function shakeCard(id) {
    var el = document.getElementById("lap-" + id);
    if (el) el.classList.add("lap-razas");
  }
  function flash(msg, ok) {
    elUzenet.textContent = msg;
    elUzenet.className = "uzenet lathato" + (ok ? " uzenet-ok" : "");
    clearTimeout(uzenetTimer);
    uzenetTimer = setTimeout(function () { elUzenet.className = "uzenet"; }, 1600);
  }

  /* ------------------------------------------------------------- vezérlők */
  function renderSzintSor() {
    var sor = document.getElementById("szint-sor");
    sor.innerHTML = "";
    [15, 20, 30, 50].forEach(function (n) {
      var b = document.createElement("button");
      b.className = "szint" + (n === state.szint ? " szint-on" : "");
      b.textContent = "≤" + n;
      b.onclick = function () { state.szint = n; renderSzintSor(); newRound(); };
      sor.appendChild(b);
    });
  }

  document.getElementById("btn-uj").onclick = newRound;
  document.getElementById("btn-ujra").onclick = newRound;
  document.getElementById("btn-kever").onclick = function () {
    if (!state.over) reshuffle();
  };

  renderSzintSor();
  newRound();
})();

/* ============================================================================
 * Teríték — POC
 * ----------------------------------------------------------------------------
 * Az osztó bemond egy célszámot (11..20) és terít N lapot (1..10 értékek,
 * kártya-színekkel). Vedd fel azt a KÉT lapot, aminek az összege a célszám!
 * Ha nincs több érvényes pár, az osztó söpör, ÚJ célszámot mond és újra terít.
 * 90 mp-es kör; pont = begyűjtött párok; rekord lapméretenként.
 *
 * A COMBO konstans a jövőnek: 3/4/5 lapos összegek (Rummy-mód) — a kiértékelés
 * már most kombó-méret szerint megy, csak a generátor páros még.
 * ========================================================================== */
(function () {
  "use strict";

  var ROUND_MS = 90 * 1000;
  var COMBO = 2;                    /* hány lap ad ki egy összeget (v1: pár) */
  var SUITS = [
    { jel: "♠", szin: "fekete" }, { jel: "♥", szin: "piros" },
    { jel: "♦", szin: "piros" },  { jel: "♣", szin: "fekete" },
  ];

  var state = {
    meret: 8,            /* terített lapok száma: 6 / 8 / 10 */
    target: 0,
    cards: [],           /* { id, val, suit, alive } */
    selected: [],
    score: 0,
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

  /* ---------------------------------------------------- terítés-generátor */
  function pickTarget() {
    /* édes zóna (13–17, tízesátlépés) súlyozva; 11-12 könnyű, 18-20 csemege.
     * Az osztó sosem ismétli az előző célszámot. */
    var pool = [11, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 19, 20];
    var t;
    do { t = pool[randInt(0, pool.length - 1)]; } while (t === state.target);
    return t;
  }

  function pairTypes(T) {          /* az összes (a, T-a), ahol 1<=a<=T-a<=10 */
    var out = [];
    for (var a = Math.max(1, T - 10); a <= Math.floor(T / 2); a++)
      out.push([a, T - a]);
    return out;
  }

  /* arcváltás: null = normál, "csalodott", "nevet" */
  var faceTimer = null;
  function setPlayersFace(face) {
    clearTimeout(faceTimer);
    var els = document.querySelectorAll(".jatekos");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("csalodott", "nevet");
      if (face) els[i].classList.add(face);
    }
  }
  function laughBriefly() {
    setPlayersFace("nevet");
    faceTimer = setTimeout(function () { setPlayersFace(null); }, 1300);
  }

  function newDeal() {
    setPlayersFace(null);            /* új terítés → visszatér a jókedv */
    state.target = pickTarget();
    var types = shuffle(pairTypes(state.target).slice());
    var seededPairs = state.meret / 2 - 1;      /* 6→2, 8→3, 10→4 pár */
    var vals = [];
    for (var p = 0; p < seededPairs; p++) {
      var t = types[p % types.length];
      vals.push(t[0], t[1]);
    }
    while (vals.length < state.meret) vals.push(randInt(1, 10)); /* 2 zavaró */
    shuffle(vals);
    state.cards = vals.map(function (v) {
      return { id: nextId++, val: v, suit: randSuit(), alive: true };
    });
    state.selected = [];
    announce();
    render();
  }

  function announce() {
    document.getElementById("cel-szam").textContent = state.target;
    var bub = document.getElementById("buborek");
    bub.classList.remove("buborek-pukkan");
    void bub.offsetWidth;            /* animáció újraindítása */
    bub.classList.add("buborek-pukkan");
  }

  /* ------------------------------------------------------------- szabály */
  function aliveCards() { return state.cards.filter(function (c) { return c.alive; }); }

  function combosRemain() {          /* van-e még COMBO lap, ami kiadja a célt */
    var alive = aliveCards();
    function seek(start, left, sum) {
      if (left === 0) return sum === state.target;
      for (var i = start; i < alive.length; i++)
        if (seek(i + 1, left - 1, sum + alive[i].val)) return true;
      return false;
    }
    return seek(0, COMBO, 0);
  }

  function clickCard(card) {
    if (state.over || !card.alive) return;
    startClock();

    var idx = state.selected.indexOf(card.id);
    if (idx !== -1) { state.selected.splice(idx, 1); render(); return; }
    state.selected.push(card.id);
    if (state.selected.length < COMBO) { render(); return; }

    /* megvan a COMBO darab lap → kiértékelés */
    var picked = state.selected.map(function (id) {
      return state.cards.find(function (c) { return c.id === id; });
    });
    var sum = picked.reduce(function (s, c) { return s + c.val; }, 0);
    var kifejezes = picked.map(function (c) { return c.val; }).join(" + ");

    if (sum === state.target) {
      picked.forEach(function (c) { c.alive = false; });
      state.score += 1;
      document.getElementById("pont").textContent = state.score;
      state.selected = [];
      flash("✔ " + kifejezes + " = " + state.target, true);
      render();
      if (!combosRemain()) {
        /* mindent lesöpört → a játékostársak viccesen csalódottak */
        setPlayersFace("csalodott");
        flash("Mindent elvittél — a róka és a bagoly hoppon maradt! 😄", true);
        setTimeout(function () { if (!state.over) newDeal(); }, 1600);
      }
    } else {
      flash("✘ " + kifejezes + " = " + sum + " — nekünk " + state.target + " kell!");
      laughBriefly();               /* a társak viccesen kinevetik a mellényúlást */
      picked.forEach(function (c) { shakeCard(c.id); });
      state.selected = [];
      setTimeout(render, 350);
    }
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

  function bestKey() { return "teritek:best:" + state.meret; }
  function getBest() {
    try { var v = localStorage.getItem(bestKey()); return v ? +v : null; }
    catch (e) { return null; }
  }
  function renderRekord() {
    var best = getBest();
    document.getElementById("rekord").textContent =
      best !== null ? "🏆 rekord: " + best + " pár" : "";
  }

  function endRound() {
    state.over = true;
    clearInterval(oraTimer);
    var best = getBest();
    var ujRekord = best === null || state.score > best;
    if (ujRekord) { try { localStorage.setItem(bestKey(), String(state.score)); } catch (e) {} }
    document.getElementById("vege-szoveg").innerHTML =
      "<b>" + state.score + " párt</b> gyűjtöttél 90 másodperc alatt!" +
      (ujRekord ? ' <span class="uj-rekord">🏆 ÚJ REKORD!</span>'
                : " (rekordod: " + best + " pár)");
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
    var pips = "";
    for (var i = 0; i < c.val; i++) pips += "<i>" + c.suit.jel + "</i>";
    return '<span class="lap-sarok">' + c.val + '<em>' + c.suit.jel + '</em></span>' +
           '<span class="lap-pips">' + pips + '</span>' +
           '<span class="lap-sarok lap-sarok-lent">' + c.val + '<em>' + c.suit.jel + '</em></span>';
  }

  function render() {
    elPoszto.innerHTML = "";
    elPoszto.className = "poszto poszto-" + state.meret;
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

  function shakeCard(id) {
    var el = document.getElementById("lap-" + id);
    if (el) el.classList.add("lap-razas");
  }

  function flash(msg, ok) {
    elUzenet.textContent = msg;
    elUzenet.className = "uzenet lathato" + (ok ? " uzenet-ok" : "");
    clearTimeout(uzenetTimer);
    uzenetTimer = setTimeout(function () { elUzenet.className = "uzenet"; }, 1500);
  }

  /* ------------------------------------------------------------- vezérlők */
  function renderMeretSor() {
    var sor = document.getElementById("meret-sor");
    sor.innerHTML = "";
    [6, 8, 10].forEach(function (n) {
      var b = document.createElement("button");
      b.className = "meret" + (n === state.meret ? " meret-on" : "");
      b.textContent = n;
      b.onclick = function () { state.meret = n; renderMeretSor(); newRound(); };
      sor.appendChild(b);
    });
  }

  document.getElementById("btn-uj").onclick = newRound;
  document.getElementById("btn-ujra").onclick = newRound;

  renderMeretSor();
  newRound();
})();

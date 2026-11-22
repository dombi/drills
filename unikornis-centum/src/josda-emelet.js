/* ============ 6j4g2) 🔭 JÓSDA · 1. EMELET — „Lámpás-ösvény” (1000-ig) (2. kör, 2026-11-22) ============
   Tervlap: terv/josda-tervlap.html ④ 2. pálya (✅ mind A). Az előszoba (josda.js) képe, kövei, lámpásai, Tikije ugyanaz; ez a fájl
   a 3. o.-os anyagot adja hozzá (3TB 73–75., 93–94.; 3TC 16., 19–20., 34.; 3MC 6., 52.):
     ① Kerekítsd tízesre / százasra! (kerek) — a lencse (tízes / százas) mondja, mire; a kő a közelebbi lámpáshoz. Csapdák: 5-ös / 50-es vég
        (felfelé: az első hibánál Tiki elmondja a szabályt, utána a hiba-kép egy nyíllal mutat fölfelé), kerek szám (ott marad: a kő
        alatt már ég a lámpás). Halványítás: lépés-pöttyök (1–2. feladat) → csak lámpások. Rossz letevés: hosszú séta, a rövidebb irány
        halványan; utána lépegetni kell (az állomás 2. hibája után a következő kettőnél is).
     ② ≈ a cetlin (cetli) — a kerekített szám a táblára; az ösvény csak hiba után jelenik meg.
     ③ Kik kerekednek 400-ra? (sav) — a gyerek kijelöli a fény két szélét (a pöttyre koppint), aztán beírja a legnagyobb számot.
        Túl széles: a kilógó kő a másik lámpáshoz gurul; túl keskeny: a kimaradt kő is a középső lámpáshoz gurul.
     ④ Jósolj, mielőtt összeadsz! (jos) — két kő a lámpásához, a táblára a kerek számok összege; beteljesülés: a pontos összeg köve.
        A 2. feladat ugyanaz a másik lencsével, és a végén mindkét jóslat köve ott áll a pontos mellett („Melyik lett közelebb?”, nem pontozzuk).
     ⑤ Elég lesz? (eleg) — Tüske néni pultján 3 dolog; becslés százasra, aztán: elég · nem elég · nem tudom biztosan (ilyenkor a kassza kiszámolja).
     ⑥ Hova esik a szorzat? (szor) — 122 → 100, a táblára 100 · 4 = 400; beteljesülés: a 400-as lámpásnál a jóslat, mellette a valódi 488.
     ⑦ Hány csillag van az égen? (eg) — pár mp, aztán pára; kártyás becslés (se ✨, se hiba); egy szeletben megszámolja (koppintás = pötty),
        aztán a javított becslés: a szelet · 10 (egy jó válasz). Beteljesülés: Tiki megmondja a pontos számot.
     🦊 ⑧ Zsivány kiszámolta (zsiv) — előbb becslés százasra (≈), csak utána pecsét: ✓ lehet / ✗ ez nem lehet.
     Odú-küszöb (vegyes1): felváltva ② ④ ⑧, segítő kövek nélkül.
   🔒 Kiskapu: a lámpás-választás 50% → rossz letevés után lépegetés; 5-ös vég ≤ 1/5, le és fel fele-fele; a kártyák / pecsét csak
   jó becslés után választhatók; a „nem tudom biztosan” csak ott jó, ahol a becslés 100-nál közelebb van a pénzhez (a kerekítés
   legnagyobb hibája 3 tételnél 150, ezért a 100–200 közötti sávot a gyártó kihagyja); a csillag-kártyáért nincs semmi.
   A bekötés: GEN.josda és JELENETEK.josda a forma szerint ide ad át (JE[forma]); a többi forma az előszobáé marad. */

var JE = {};
function jeE(f) { return !!JE[f] || f === "vegyes1"; }
function jeHelyNev(h) { return h === 10 ? "tízes" : h === 100 ? "százas" : "ezres"; }
function jeHelyRa(h) { return h === 10 ? "tízesre" : h === 100 ? "százasra" : "ezresre"; }
function jeKesk() { return !!(JL && JL.keskeny); }
function jeVar(f) { return lkCsokkent() || window.__UC_GYORS ? 0 : f; }

/* ═════════ GYÁRTÓ: a szám a lencséhez (le / fel fele-fele, középső és kerek ritkán) ═════════ */
function jeSzam(h, fajta) {
  var T, o;
  if (h === 10) { T = veletlen(11, 98) * 10; o = fajta === "le" ? veletlen(1, 4) : fajta === "fel" ? veletlen(6, 9) : fajta === "otos" ? 5 : 0; }
  else {
    T = veletlen(1, 8) * 100;
    if (fajta === "le") o = veletlen(1, 49); else if (fajta === "fel") o = veletlen(51, 99); else o = fajta === "otos" ? 50 : 0;
    if ((fajta === "le" || fajta === "fel") && o % 10 === 0) o += fajta === "le" ? -3 : 3;   /* ne legyen kerek tízes: az összemosná a két lencsét */
  }
  return { n: T + o, T: T };
}
function jeNemKerek(a, b) { var v = veletlen(a, b); while (v % 10 === 0) v = veletlen(a, b); return v; }

/* ═════════ KIS RAJZOK ═════════ */
/* a távcső lencséje: mire kerekítünk (Tiki állítja be) */
function jeLencse(x, y, h, k) {
  var F = pcF;
  return '<g transform="translate(' + F(x) + ' ' + F(y) + ') scale(' + (k || 1) + ')"><g filter="url(#lt-firka)"><circle r="27" fill="#e9c27a" stroke="#8a5a1a" stroke-width="2.6"/></g>' +
    '<circle r="19" fill="#eaf6ff" stroke="#c9962a" stroke-width="2"/><path d="M-11 -9Q-6 -14 1 -14" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<text y="6" text-anchor="middle" font-size="' + (h >= 100 ? 15 : 17) + '"' + JS_FR + ' fill="#3d5a9e">' + h + '</text>' +
    '<text y="46" text-anchor="middle" font-size="14"' + JS_FR + ' fill="#5f6fa8">' + jeHelyNev(h) + '</text></g>';
}
function jeCetli(x, y, t, fs, attr, szin) {
  var F = pcF; fs = fs || 24;
  var w = Math.max(80, String(t).length * fs * .56 + 30), h = fs * 1.9;
  return '<g' + (attr || '') + ' transform="translate(' + F(x) + ' ' + F(y) + ') rotate(-3)"><g filter="url(#lt-firka)"><rect x="' + F(-w / 2) + '" y="' + F(-h / 2) + '" width="' + F(w) + '" height="' + F(h) + '" rx="6" fill="' + (szin || "#fffef4") + '" stroke="#b8a27a" stroke-width="1.8"/></g>' +
    '<path d="M' + F(-w / 2 + 10) + ' ' + F(-h / 2) + 'v-7h14v7" fill="#f6c4d2" stroke="#b5607e" stroke-width="1.2"/>' +
    '<text y="' + F(fs * .36) + '" text-anchor="middle" font-size="' + fs + '"' + JS_FR + ' fill="#4a3b7a">' + kiiras(t) + '</text></g>';
}
function jeKozel(x, y, fs) { return '<text x="' + pcF(x) + '" y="' + pcF(y) + '" text-anchor="middle" font-size="' + (fs || 40) + '"' + JS_FR + ' fill="#4a3b7a">≈</text>'; }
/* kártyák: lista (a sortörés „\n”), C = { x: [], y: [], w, h }, val = a választott, aktiv = koppintható */
function jeKartyak(lista, C, val, aktiv, fs) {
  var s = '';
  lista.forEach(function (t, k) {
    var v = val === k, sorok = t.split("\n");
    s += '<g' + (aktiv ? ' class="je-kartya" data-k="' + k + '" style="cursor:pointer"' : '') + ' transform="translate(' + C.x[k] + ' ' + C.y[k] + ')"' + (val != null && !v ? ' opacity=".35"' : '') + '>' +
         '<g filter="url(#lt-firka)"><rect x="' + (-C.w / 2) + '" y="' + (-C.h / 2) + '" width="' + C.w + '" height="' + C.h + '" rx="9" fill="' + (v ? "#fff1a8" : "#fffaf0") + '" stroke="' + (v ? "#d1a23a" : "#c9ad85") + '" stroke-width="2"/></g>';
    sorok.forEach(function (sr, j) { s += '<text y="' + pcF(5 + (j - (sorok.length - 1) / 2) * (fs + 3)) + '" text-anchor="middle" font-size="' + fs + '"' + JS_FR + ' fill="#4a3b7a">' + kiiras(sr) + '</text>'; });
    s += '</g>';
  });
  return s;
}
/* egy szakasz két lámpással: T és T + h; X(v) a helye */
function jeSeg(T, h, x0, x1) { return { T: T, h: h, x0: x0, x1: x1, X: function (v) { return x0 + (v - T) * (x1 - x0) / h; } }; }
/* a lépések a kőtől: b = lefelé (a végén a kisebb lámpás), j = felfelé (a végén a nagyobb) */
function jeLepesek(n, T, h) {
  var lp = h / 10, b = [], j = [], k;
  for (k = 9; k >= 1; k--) if (T + k * lp < n) b.push(T + k * lp);
  if (T < n) b.push(T);
  for (k = 1; k <= 9; k++) if (T + k * lp > n) j.push(T + k * lp);
  j.push(T + h);
  return { b: b, j: j };
}
/* egy kis szakasz (④ ⑥ sorai, ② hiba-képe): o = { n, id, lh, pottyok, tesz (a helyek előtagja), fog (felvehető), hol ("b" | "j"), razkod, m } */
function jeSegRajz(JL, S, y, o) {
  var s = jsUt(S.x0 - 26, S.x1 + 26, y), lp = S.h / 10, k, v;
  if (o.pottyok) for (k = 1; k < 10; k++) { v = S.T + k * lp; if (v !== o.n) s += jsPotty(S.X(v), y, ""); }
  ["b", "j"].forEach(function (sd) {
    var lv = sd === "b" ? S.T : S.T + S.h;
    s += jsLampas(S.X(lv), y, o.lh, o.hol === sd ? "lobban" : o.n === lv ? "eg" : "", lv, o.tesz ? ' class="jl-hely" data-hely="' + o.tesz + sd + '"' : '');
  });
  if (!(JL.fog && JL.fog.id === o.id)) {
    var kx = o.hol ? S.X(o.hol === "b" ? S.T : S.T + S.h) + (o.hol === "b" ? 16 : -16) : S.X(o.n);
    s += '<g' + (o.razkod && !lkCsokkent() ? ' class="js-razkod"' : '') + '>' + jsKo(kx, y - 4, o.n, o.m || .8, o.fog ? ' class="jl-fog js-lukt" data-fog="' + o.id + '"' : '', o.fog || o.hol ? "fenyes" : "") + '</g>';
  }
  return s;
}
/* beteljesülés-sor: kerek százas lámpások, rajta a jóslat(ok) és a pontos érték köve, köztük tízesenként a pöttyök */
function jeBeteljesul(JL, x0, x1, y, jos, pontos, lo, hi) {
  var s = jsUt(x0, x1, y), X = function (v) { return x0 + (v - lo) * (x1 - x0) / (hi - lo); }, v, kk = jeKesk(), lepes = (hi - lo) / 100 > 6 && kk ? 200 : 100;
  for (v = lo; v <= hi; v += 100) s += jsLampas(X(v), y, 30, "", v % lepes === 0 ? v : null, '');
  jos.forEach(function (j) {
    var a = Math.min(j, pontos), b = Math.max(j, pontos);
    for (v = Math.ceil((a + 1) / 10) * 10; v < b; v += 10) s += jsPotty(X(v), y, "halvany");
  });
  jos.forEach(function (j, i) { s += jsKo(X(j), y - 26 - i * 34, j, .6, '', ''); });
  return s + jsKo(X(pontos), y - 26, pontos, .7, '', "fenyes");
}
function jeTartomany(lista) {
  var lo = Math.floor(Math.min.apply(null, lista) / 100) * 100, hi = Math.ceil(Math.max.apply(null, lista) / 100) * 100;
  if (hi === lo) hi += 100;
  while (hi - lo < 300) { if (lo > 0) lo -= 100; hi += 100; if (hi - lo < 300) hi += 100; }
  return [lo, hi];
}
function jeFeladat(x, helyes, kerdes, felolvas, naplo) { return jsFeladat(x, helyes, kerdes, felolvas || kerdes, naplo || jsNaplo(x.forma)); }
/* a hiba-kép utáni mondat: a kerekEll hibája szerint */
function jeHibaMondat(e, n, h, seg) {
  if (e.hiba === "otos") return "Pont középen van. Ilyenkor felfelé lépünk!";
  if (e.hiba === "kerek") return "Ez kerek szám: kerekítve is ugyanannyi marad!";
  var also = Math.floor(n / h) * h;
  if (seg >= 2) return "Melyik két " + jeHelyNev(h) + " között van a " + n + "? A " + also + " és a " + (also + h) + " között. Melyikhez van közelebb?";
  return e.hiba === "tav" ? "Melyik két " + jeHelyNev(h) + " lámpás között van? Ahhoz a kettőhöz nézd!" : "Hm. Nézd meg az ösvényt: melyik lámpás van közelebb?";
}

/* ═════════ Tüske néni és Zsivány: élő figura a képen (mint a Zsibvásárban) ═════════ */
var JE_LAKO = null;
function jeLakoHely(x, y, k, tukor) { return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ') scale(' + (tukor ? -k : k) + ' ' + k + ')"><g class="je-lako-hely"></g></g>'; }
function jeLakoRak(JL, kicsoda, poz) {
  var h = JL.svg.querySelector(".je-lako-hely"); if (!h) return;
  if (!JE_LAKO || JE_LAKO.k !== kicsoda || LAKOK.indexOf(JE_LAKO.lako) < 0) {
    JE_LAKO = { k: kicsoda, g: document.createElementNS("http://www.w3.org/2000/svg", "g") };
    h.appendChild(JE_LAKO.g); JE_LAKO.lako = new Lako(JE_LAKO.g, kicsoda, { poz: poz || "koszon", elet: true }); JE_LAKO.poz = poz;
  } else h.appendChild(JE_LAKO.g);
  if (poz && JE_LAKO.poz !== poz) { JE_LAKO.poz = poz; try { JE_LAKO.lako.poz(poz); } catch (e) {} }
}

/* ═════════════════ ① KEREKÍTSD TÍZESRE / SZÁZASRA! ═════════════════ */
JE.kerek = {
  gen: function (cfg, st, i, halv) {
    if (!st.sor) {   /* 🔒 le / fel fele-fele, a középső (5-ös vég) 1/5, egy kerek szám; az első sosem csapda */
      st.sor = keverTomb(["le", "fel", "otos", veletlenElem(["le", "fel"])]);
      if (st.sor[0] === "otos") { st.sor[0] = st.sor[1]; st.sor[1] = "otos"; }
      st.sor.splice(veletlen(2, 4), 0, "kerek");
    }
    var fajta = st.sor[i % st.sor.length];
    var h = i === 0 ? 10 : i === 1 ? 100 : veletlenElem([10, 100]), z = jeSzam(h, fajta);
    var lep = !halv && st.lepKell > 0 && fajta !== "kerek" && st.lepKell-- > 0;
    var x = { forma: "kerek", n: z.n, T: z.T, h: h, fajta: fajta, pottyok: !halv && (i < 2 || lep), lep: lep, L: 0, R: 0, irany: lep ? "b" : null, feny: {}, hol: null };
    var k = "Kerekítsd " + jeHelyRa(h) + "! ";
    return jeFeladat(x, kerekit(z.n, h), lep ? k + "Előbb lépegess a kisebb lámpásig! Koppints a villogó karikára!" : k + "Vidd a követ a közelebbi lámpáshoz!",
      k + (lep ? "Előbb lépegess: koppints a lépésekre, egészen a kisebb lámpásig!" : "Vidd a követ a közelebbi lámpáshoz!"), jsNaplo("kerekítés " + jeHelyRa(h) + " " + z.n));
  },
  S: function (x) { var K = jsK(); return jeSeg(x.T, x.h, K.koz[0], K.koz[1]); },
  kep: function (JL) { var K = jsK(), x = JL.f.js; return { vb: "0 0 " + K.W + " " + (jeKesk() ? 540 : K.H), tabla: null, uni: [JE.kerek.S(x).X(x.n), K.uy, K.um, 1] }; },
  indit: function (JL) { var x = JL.f.js; jsKeskenyNez(JL); JL.ux = JE.kerek.S(x).X(x.n); JL.uy = jsK().uy; return false; },
  rajz: function (JL) {
    var x = JL.f.js, K = jsK(), S = JE.kerek.S(x), y = K.py, s = jsHatter(JL), Ls = jeLepesek(x.n, x.T, x.h), jo = kerekit(x.n, x.h) === x.T ? "b" : "j", kk = jeKesk();
    s += jsUt(S.x0 - 40, S.x1 + 40, y);
    s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2] * .9, x.tiki || (x.irany ? "mutat" : "var"));
    s += jeLencse(kk ? 340 : 186, kk ? 70 : 92, x.h, kk ? .9 : 1);
    if (x.pottyok || x.irany || x.villan || x.ut) {
      Ls.b.slice(0, -1).concat(Ls.j.slice(0, -1)).forEach(function (v) {
        var eg = (v < x.n && Ls.b.indexOf(v) < x.L) || (v > x.n && Ls.j.indexOf(v) < x.R) || (x.ut && (x.ut === "b" ? v < x.n : v > x.n));
        var vil = x.villan && (x.villan.hosszu === "b" ? v < x.n : v > x.n), hal = x.villan && !vil;
        s += jsPotty(S.X(v), y, eg || vil ? "eg" : hal ? "halvany" : "");
      });
    }
    ["b", "j"].forEach(function (o) {
      var lv = o === "b" ? x.T : x.T + x.h, tesz = !x.irany && x.hol == null && !JL.lezart;
      s += jsLampas(S.X(lv), y, K.lh, x.feny[o] || (x.hol === o ? "lobban" : x.n === lv ? "eg" : ""), lv, tesz ? ' class="jl-hely" data-hely="' + o + '"' : '');
    });
    if (x.nyil) {   /* pont középen: a nyíl fölfelé mutat */
      var ax = S.X(x.n), ay = y - (kk ? 64 : 76);
      s += '<g pointer-events="none"><path d="M' + pcF(ax - 30) + ' ' + ay + 'H' + pcF(ax + 34) + '" stroke="#e0417a" stroke-width="5" stroke-linecap="round"/><path d="M' + pcF(ax + 26) + ' ' + (ay - 11) + 'L' + pcF(ax + 42) + ' ' + ay + 'L' + pcF(ax + 26) + ' ' + (ay + 11) + '" fill="none" stroke="#e0417a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>';
    }
    if (x.irany && !JL.lezart) {
      var nv = x.irany === "b" ? Ls.b[x.L] : Ls.j[x.R], nx = S.X(nv);
      s += '<g class="js-lep" style="cursor:pointer"><circle cx="' + pcF(nx) + '" cy="' + y + '" r="22" fill="transparent"/><circle cx="' + pcF(nx) + '" cy="' + y + '" r="9" fill="none" stroke="#e0417a" stroke-width="2.6">' +
           (lkCsokkent() ? '' : '<animate attributeName="r" values="7;13;7" dur="1.1s" repeatCount="indefinite"/>') + '</circle></g>';
    }
    if (JL.fog) return s;
    var kx = x.hol == null ? S.X(x.n) : S.X(x.hol === "b" ? x.T : x.T + x.h) + (x.hol === "b" ? 18 : -18), szabad = !x.irany && x.hol == null && !JL.lezart;
    s += jsKo(kx, y - 4, x.n, kk ? .9 : 1, szabad ? ' class="jl-fog js-lukt" data-fog="ko"' : '', x.hol === jo || szabad ? "fenyes" : "");
    return s;
  },
  felvesz: function (JL, id) { var x = JL.f.js; return id === "ko" && !x.irany && x.hol == null ? x.n : null; },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.js, f = JL.f, K = jsK(), S = JE.kerek.S(x), st = JL.st;
    if (!hova) { jlRajz(); return; }
    var jo = kerekit(x.n, x.h) === x.T ? "b" : "j", lv = hova === "b" ? x.T : x.T + x.h;
    if (hova === jo) {
      x.hol = hova; x.ut = x.fajta === "kerek" ? null : hova; x.tiki = "orul"; x.nyil = false; hangCsilla();
      jlJo(x.n + " ≈ " + lv, null, function (tovabb) { jsSetal(S.X(lv), K.uy, function () { setTimeout(tovabb, jeVar(500)); }, 12); });
      return;
    }
    var e = kerekEll(x.n, x.h, lv);
    JL.lezart = true; x.hol = hova;
    jlRossz(String(lv), jsNaplo("kerekítés " + jeHelyRa(x.h) + " " + x.n));
    st.rossz = (st.rossz || 0) + 1;
    if (st.rossz >= 2) st.lepKell = Math.max(st.lepKell || 0, 2);   /* 🔒 az állomás 2. hibája után a következő kettő lépegetős */
    var mondat;
    if (e.hiba === "otos") {
      x.nyil = true;
      mondat = P().bemutatva.josdaOtos ? "Pont középen: felfelé!" : "Pont középen van. Ilyenkor felfelé lépünk!";
      P().bemutatva.josdaOtos = 1; ment();
    } else if (e.hiba === "kerek") mondat = "Ez kerek szám: kerekítve is ugyanannyi marad! A kő már a lámpásnál áll.";
    else { x.villan = { hosszu: hova }; mondat = JL.seg >= 2 ? "Számold meg a lépéseket! Előbb a kisebb lámpásig, aztán a nagyobbig. Merre kevesebb?" : "Hm. Lépegess, és nézd meg, merre rövidebb az út!"; }
    jlRajz();
    jsSetal(S.X(lv), K.uy, function () {
      setTimeout(function () {
        if (!JL || JL.f !== f) return;
        x.hol = null; x.villan = null; JL.lezart = false;
        if (e.hiba === "szomszed" || e.hiba === "tav") { x.lep = true; x.pottyok = true; x.L = x.R = 0; x.irany = "b"; x.feny = {}; jsFelirat("Lépegess a kisebb lámpásig! Koppints a villogó karikára!"); }
        jlRajz(); jsSetal(S.X(x.n), K.uy, null, 10);
        jlSzol(mondat, true);
      }, jeVar(700));
    }, 14);
  },
  katt: function (JL, t) {
    var x = JL.f.js; if (!x.irany || !t.closest(".js-lep")) return;
    var S = JE.kerek.S(x), Ls = jeLepesek(x.n, x.T, x.h), f = JL.f, K = jsK(), v;
    hangGomb();
    if (x.irany === "b") { x.L++; v = Ls.b[x.L - 1]; } else { x.R++; v = Ls.j[x.R - 1]; }
    var vissza = function () { setTimeout(function () { if (JL && JL.f === f) jsSetal(S.X(x.n), K.uy, null, 10); }, 250); };
    if (x.irany === "b" && x.L === Ls.b.length) {
      x.feny.b = "eg"; x.irany = "j"; hangCsilla(); jsFelirat("Most lépegess a nagyobb lámpásig! Koppints a villogó karikára!");
      jlRajz(); jsSetal(S.X(v), K.uy, vissza); return;
    }
    if (x.irany === "j" && x.R === Ls.j.length) {
      x.feny.j = "eg"; x.irany = null; hangCsilla(); jsFelirat("Melyik lámpás van közelebb? Vidd oda a követ!");
      jlRajz(); jsSetal(S.X(v), K.uy, vissza); mondd("Melyik lámpás van közelebb? Vidd oda a követ!"); return;
    }
    jlRajz(); jsSetal(S.X(v), K.uy);
  },
  gepi: function (JL) {
    var x = JL.f.js, Ls = jeLepesek(x.n, x.T, x.h), sel = [], k;
    if (x.irany === "b") for (k = x.L; k < Ls.b.length; k++) sel.push('#jl-svg .js-lep');
    if (x.irany) for (k = x.irany === "j" ? x.R : 0; k < Ls.j.length; k++) sel.push('#jl-svg .js-lep');
    sel.push('#jl-svg .jl-fog[data-fog="ko"]', '#jl-svg .jl-hely[data-hely="' + (kerekit(x.n, x.h) === x.T ? "b" : "j") + '"]');
    return { katt: sel };
  }
};

/* ═════════════════ ② ≈ A CETLIN ═════════════════ */
JE.cetli = {
  gen: function (cfg, st, i, halv) {
    if (!st.sorC) st.sorC = keverTomb(["le", "fel", veletlenElem(["le", "fel"]), "otos"]);
    var fajta = halv ? veletlenElem(["le", "fel", "le", "fel", "otos"]) : st.sorC[i % st.sorC.length];
    var h = halv ? veletlenElem([10, 100]) : i % 2 ? 10 : 100, z = jeSzam(h, fajta);
    var x = { forma: "cetli", n: z.n, T: z.T, h: h, ut: false };
    return jeFeladat(x, kerekit(z.n, h), "Kerekítsd " + jeHelyRa(h) + "! Írd a táblára!", "Kerekítsd " + jeHelyRa(h) + " ezt a számot: " + szo(z.n) + "! Írd a táblára!", jsNaplo("≈ " + jeHelyRa(h) + " " + z.n));
  },
  jegyek: function () { return 4; },
  kep: function (JL) {
    var K = jsK(), kk = jeKesk();
    return { vb: "0 0 " + K.W + " " + K.H, tabla: kk ? [300, 150, 120, 62] : [560, 150, 124, 62], uni: kk ? [352, 650, K.um, -1] : [K.uniM[0], K.uniM[1], K.um, 1] };
  },
  tablaAll: function () { return ""; },
  rajz: function (JL) {
    var x = JL.f.js, K = jsK(), kk = jeKesk(), s = jsHatter(JL);
    s += jsTiki(kk ? 58 : K.tiki[0], kk ? 300 : K.tiki[1], K.tiki[2] * .9, x.tiki || "cetli");
    s += jeLencse(kk ? 60 : 186, kk ? 62 : 70, x.h, kk ? .85 : 1);
    s += jeCetli(kk ? 150 : 380, 150, String(x.n), kk ? 26 : 30) + jeKozel(kk ? 226 : 470, 164, kk ? 34 : 42);
    if (x.ut) {   /* a hiba után: a szám az ösvényen, a két lámpással */
      var S = jeSeg(x.T, x.h, kk ? 60 : 250, kk ? 340 : 722);
      s += jeSegRajz(JL, S, kk ? 440 : 330, { n: x.n, id: "x", lh: kk ? 60 : 70, pottyok: true, m: .85 });
    }
    return s;
  },
  bekuld: function (JL, v) {
    var x = JL.f.js, jo = kerekit(x.n, x.h);
    if (v === jo) { x.tiki = "orul"; JL.beirt = String(v); hangCsilla(); jlJo(x.n + " ≈ " + v); return; }
    var e = kerekEll(x.n, x.h, v);
    x.ut = true; JL.rossz = String(v); jlRossz(String(v), jsNaplo("≈ " + jeHelyRa(x.h) + " " + x.n)); jlRajz();
    jlSzol(jeHibaMondat(e, x.n, x.h, JL.seg), true); jlFokusz();
  },
  gepi: function (JL) { var x = JL.f.js; return { gepel: kerekit(x.n, x.h) }; }
};

/* ═════════════════ ③ KIK KEREKEDNEK 400-RA? (a fény-sáv) ═════════════════ */
JE.sav = {
  gen: function (cfg, st, i) {
    var h = i === 0 ? 100 : 10, C = h === 100 ? veletlen(2, 8) * 100 : veletlen(12, 98) * 10;
    var x = { forma: "sav", h: h, C: C, lo: C, hi: C, fazis: "bal", kovek: [], kis: i === 0 };
    var k = "Kik kerekednek " + C + "-" + jsRa(C) + "? (" + jeHelyRa(h) + ") ";
    return jeFeladat(x, C + h / 2 - 1, k + "Koppints oda, ahol a fény kezdődik!", "Mely számokat kerekítjük " + jeHelyRa(h) + " " + jsRaSzo(C) + "? Koppints oda az ösvényen, ahol a lámpás fénye kezdődik!", jsNaplo("sáv " + C));
  },
  jegyek: function () { return 4; },
  X: function (x, v) { var K = jsK(); return K.sor[0] + (v - (x.C - x.h)) * (K.sor[1] - K.sor[0]) / (2 * x.h); },
  kep: function (JL) { var K = jsK(); return { vb: "0 0 " + K.W + " " + (jeKesk() ? 540 : K.H), tabla: JL.f.js.fazis === "max" || JL.f.js.fazis === "kesz" ? K.tabla : null, uni: [K.uniM[0], K.uniM[1], K.um, 1] }; },
  tablaAll: function (JL) { return JL.f.js.fazis === "max" ? "" : "var"; },
  tablaVarMondat: function () { return "Előbb koppints a fény szélére!"; },
  rajz: function (JL) {
    var x = JL.f.js, K = jsK(), y = K.py, s = jsHatter(JL), lp = x.h / 10, v, X = function (w) { return JE.sav.X(x, w); }, kk = jeKesk();
    s += jsUt(K.sor[0], K.sor[1], y);
    s += jsTiki(K.tiki[0], K.tiki[1], K.tiki[2] * .85, x.tiki || "mutat");
    s += jeLencse(kk ? 340 : 186, kk ? 70 : 92, x.h, kk ? .9 : 1);
    /* a fény: a középső lámpástól a jelölt szélekig */
    var lo = X(x.lo), hi = x.fazis === "max" || x.fazis === "kesz" ? X(x.C + x.h / 2) - 6 : X(x.hi);
    s += '<rect x="' + pcF(Math.min(lo, X(x.C) - 14)) + '" y="' + (y - 16) + '" width="' + pcF(Math.max(hi, X(x.C) + 14) - Math.min(lo, X(x.C) - 14)) + '" height="32" rx="14" fill="#fff1a8" opacity=".85"/>';
    var bat = (x.fazis === "bal" || x.fazis === "jobb") && !JL.lezart;
    for (v = x.C - x.h + lp; v < x.C + x.h; v += lp) {
      if (v === x.C) continue;
      var px = X(v), bent = v >= x.lo && v <= x.hi;
      s += x.kis ? jsLampas(px, y, 24, bent ? "eg" : "", null, '') : jsPotty(px, y, bent ? "eg" : "");
      if (bat) s += '<rect class="je-pont" data-v="' + v + '" x="' + pcF(px - (X(lp) - X(0)) / 2) + '" y="' + (y - 40) + '" width="' + pcF(X(lp) - X(0)) + '" height="64" fill="transparent" style="cursor:pointer"/>';
    }
    [x.C - x.h, x.C, x.C + x.h].forEach(function (lv) { s += jsLampas(X(lv), y, K.lh * .8, lv === x.C ? "lobban" : "", lv, ''); });
    /* a kövek: bent maradók és elguruló kövek */
    x.kovek.forEach(function (k) {
      var kx = X(k.v), cx = X(k.cel), anim = k.gurul && !lkCsokkent() ? '<animateTransform class="je-gurul" attributeName="transform" type="translate" values="0 0;' + pcF((cx - kx) * .8) + ' 0" dur=".9s" fill="freeze"/>' : '';
      s += '<g' + (k.gurul && lkCsokkent() ? ' transform="translate(' + pcF((cx - kx) * .8) + ' 0)"' : '') + '>' + anim + jsKo(kx, y - 30, k.v, .62, '', k.bent ? "fenyes" : "") + '</g>';
    });
    return s;
  },
  katt: function (JL, t) {
    var x = JL.f.js, e = t.closest(".je-pont"); if (!e || (x.fazis !== "bal" && x.fazis !== "jobb")) return;
    var v = +e.getAttribute("data-v"), lp = x.h / 10, f = JL.f, bal = x.fazis === "bal", cel = bal ? x.C - x.h / 2 : x.C + x.h / 2;
    hangGomb();
    if (bal ? !(v < x.C) : !(v > x.C)) { mondd(bal ? "A fény elejét keresd: a lámpástól balra!" : "A fény végét keresd: a lámpástól jobbra!"); return; }
    if (v === cel) {
      if (bal) {
        x.lo = v; x.kovek.push({ v: v, cel: x.C, bent: true }); x.fazis = "jobb"; hangCsilla();
        jsFelirat("Most koppints oda, ahol a fény véget ér!"); jlRajz(); mondd("Most koppints oda, ahol a fény véget ér!");
      } else {
        x.hi = v - 1; x.kovek.push({ v: v, cel: x.C + x.h, gurul: true }); x.fazis = "max"; hangCsilla();
        jsFelirat("A " + v + " már továbbgurult. Melyik a legnagyobb szám, ami még " + x.C + " lesz? Írd a táblára!");
        jlRajz(); jlFokusz(); mondd(zsCap(zsAz(v)) + " pont középen van: az már felfelé gurul. Melyik a legnagyobb szám, amit még " + jsRaSzo(x.C) + " kerekítünk?");
      }
      return;
    }
    /* rossz szél: túl széles → a kilógó kő a másik lámpáshoz gurul; túl keskeny → a kimaradt kő is a középsőhöz gurul */
    var tul = bal ? v < cel : v > cel, kv = tul ? v : v + (bal ? -lp / 2 : lp / 2), kc = tul ? (bal ? x.C - x.h : x.C + x.h) : x.C;
    JL.lezart = true;
    if (bal) x.lo = v; else x.hi = v;
    x.kovek.push({ v: kv, cel: kc, gurul: true, ideig: true });
    jlRossz(String(v), jsNaplo("sáv " + x.C));
    jlRajz();
    var mondat = tul ? "Ez a kő a másik lámpáshoz gurult: ahhoz van közelebb!" : "Ez a kő is a " + x.C + "-" + jsHoz(x.C) + " gurult! Odáig is ér a fény.";
    if (JL.seg >= 2) mondat += " Hol van a félút a két lámpás között?";
    jlSzol(mondat, true);
    setTimeout(function () {
      if (!JL || JL.f !== f) return;
      x.kovek = x.kovek.filter(function (k) { return !k.ideig; });
      if (bal) x.lo = x.C; else x.hi = x.C; JL.lezart = false; jlRajz();
    }, jeVar(1400));
  },
  bekuld: function (JL, v) {
    var x = JL.f.js, jo = x.C + x.h / 2 - 1;
    if (v === jo) {
      x.fazis = "kesz"; x.kovek.push({ v: v, cel: x.C, bent: true }); x.tiki = "orul"; JL.beirt = String(v); hangCsilla();
      jlJo((x.C - x.h / 2) + " … " + v + " ≈ " + x.C, null, jsMutatEltart); return;
    }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("sáv " + x.C)); jlRajz();
    jlSzol(v === jo + 1 ? "A " + (jo + 1) + " már továbbgurult. Ami előtte van, az még marad!" : JL.seg >= 2 ? "Nézd meg a köveket! Melyik szám van közvetlenül a továbbgurult kő előtt?" : "Nézd meg az ösvényt: meddig ér a fény?", true);
    jlFokusz();
  },
  gepi: function (JL) {
    var x = JL.f.js;
    if (x.fazis === "bal") return { katt: ['#jl-svg .je-pont[data-v="' + (x.C - x.h / 2) + '"]'] };
    if (x.fazis === "jobb") return { katt: ['#jl-svg .je-pont[data-v="' + (x.C + x.h / 2) + '"]'] };
    return { gepel: x.C + x.h / 2 - 1 };
  }
};
/* „400-ra”, „-hoz”: a szám kiejtése szerint (négyszáz-ra, hetven-re) */
function jsRa(n) { return /[aáoóuú][^aáoóuúeéiíöőüű]*$/.test(szo(n).replace(/[ií]/g, "")) ? "ra" : "re"; }
function jsHoz(n) { var w = szo(n).replace(/[ií]/g, ""), m = w.match(/[aáoóuúeéöőüű](?=[^aáoóuúeéöőüű]*$)/); return m && /[aáoóuú]/.test(m[0]) ? "hoz" : m && /[öőüű]/.test(m[0]) ? "höz" : "hez"; }
function jsRaSzo(n) { return szo(n) + jsRa(n); }

/* ═════════════════ ④ JÓSOLJ, MIELŐTT ÖSSZEADSZ! ═════════════════ */
JE.jos = {
  gen: function (cfg, st, i, halv) {
    var a, b, h;
    if (!halv && i === 1 && st.jos) { a = st.jos.a; b = st.jos.b; h = st.jos.h === 10 ? 100 : 10; }   /* ugyanaz a feladat a másik lencsével (3TB 93.) */
    else {
      for (var p = 0; p < 300; p++) {   /* a két lencse jóslata különbözzön, és egyik se legyen telitalálat (különben nincs mit összevetni) */
        a = jeNemKerek(120, 680); b = jeNemKerek(110, 980 - a);
        var j10 = kerekit(a, 10) + kerekit(b, 10), j100 = kerekit(a, 100) + kerekit(b, 100);
        if (a + b <= 990 && a % 100 !== 50 && b % 100 !== 50 && Math.abs(j100 - j10) >= 30 && j10 !== a + b && j100 !== a + b) break;
      }
      h = halv ? veletlenElem([10, 100]) : veletlenElem([10, 100]);
    }
    var x = { forma: "jos", a: a, b: b, h: h, halv: halv, tesz: {}, fazis: halv ? "becs" : "rak", elozo: !halv && i === 1 && st.jos ? st.jos : null };
    if (!halv) st.jos = { a: a, b: b, h: h };
    var k = "Kerekítsd " + jeHelyRa(h) + " mindkét számot! ";
    return jeFeladat(x, kerekit(a, h) + kerekit(b, h), halv ? "Kerekítsd " + jeHelyRa(h) + " a tagokat, és add össze! Írd a táblára!" : k + "Vidd a köveket a közelebbi lámpáshoz!",
      halv ? "Becsülj! Kerekítsd " + jeHelyRa(h) + " a két számot, és add össze őket! Írd a táblára!" : "Mielőtt összeadunk, jósoljunk! " + k + "Vidd a köveket a közelebbi lámpáshoz!", jsNaplo("jóslat " + a + " + " + b + " " + jeHelyRa(h)));
  },
  jegyek: function () { return 4; },
  H: function () { return jeKesk() ? { rows: [116, 262], s: [70, 330], tab: [270, 410, 112, 62], cet: [150, 340], koz: [178, 422], ered: [560, 40, 360], tiki: [52, 470, .36], lenc: [352, 470] } :
    { rows: [104, 238], s: [262, 562], tab: [712, 196, 112, 62], cet: [700, 104], koz: [628, 210], ered: [370, 180, 760], tiki: [84, 300, .56], lenc: [186, 70] }; },
  kep: function (JL) { var K = jsK(), H = JE.jos.H(); return { vb: "0 0 " + K.W + " " + K.H, tabla: H.tab, uni: jeKesk() ? [352, 650, K.um, -1] : [K.uniD[0], K.uniD[1], K.um, -1] }; },
  tablaAll: function (JL) { var x = JL.f.js; return x.fazis === "becs" ? "" : "var"; },
  tablaVarMondat: function () { return "Előbb vidd a köveket a lámpásokhoz!"; },
  rajz: function (JL) {
    var x = JL.f.js, H = JE.jos.H(), s = jsHatter(JL), kk = jeKesk();
    s += jsTiki(H.tiki[0], H.tiki[1], H.tiki[2], x.tiki || "var") + jeLencse(H.lenc[0], H.lenc[1], x.h, kk ? .8 : 1);
    if (!x.halv) [["a", x.a], ["b", x.b]].forEach(function (r, k) {
      var S = jeSeg(Math.floor(r[1] / x.h) * x.h, x.h, H.s[0], H.s[1]);
      s += jeSegRajz(JL, S, H.rows[k], { n: r[1], id: r[0], lh: kk ? 44 : 44, tesz: x.fazis === "rak" && x.tesz[r[0]] == null && !JL.lezart ? r[0] : null, fog: x.fazis === "rak" && x.tesz[r[0]] == null && !JL.lezart, hol: x.tesz[r[0]], razkod: x.razkod === r[0], m: .78 });
    });
    s += jeCetli(H.cet[0], H.cet[1], x.a + " + " + x.b, kk ? 22 : 24) + jeKozel(H.koz[0], H.koz[1], kk ? 30 : 36);
    if (x.fazis === "kesz") {
      var jos = (x.elozo ? [kerekit(x.elozo.a, x.elozo.h) + kerekit(x.elozo.b, x.elozo.h)] : []).concat([kerekit(x.a, x.h) + kerekit(x.b, x.h)]), e = x.a + x.b, t = jeTartomany(jos.concat([e]));
      s += jeBeteljesul(JL, H.ered[1], H.ered[2], H.ered[0], jos, e, t[0], t[1]);
    }
    return s;
  },
  felvesz: function (JL, id) { var x = JL.f.js; if (x.fazis !== "rak" || x.tesz[id] != null) return null; return id === "a" ? x.a : id === "b" ? x.b : null; },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.js, f = JL.f;
    if (!hova || hova.charAt(0) !== id) { jlRajz(); return; }
    var v = id === "a" ? x.a : x.b, T = Math.floor(v / x.h) * x.h, lv = hova.charAt(1) === "b" ? T : T + x.h;
    if (lv === kerekit(v, x.h)) {
      x.tesz[id] = hova.charAt(1); hangCsilla();
      if (x.tesz.a != null && x.tesz.b != null) { x.fazis = "becs"; jsFelirat("Add össze a két lámpás számát! Írd a táblára!"); mondd("Most add össze a két lámpás számát! Írd a táblára!"); }
      jlRajz(); jlFokusz(); return;
    }
    JL.lezart = true; x.razkod = id;
    jlRossz(String(lv), jsNaplo("kerekítés " + jeHelyRa(x.h) + " " + v)); jlRajz();
    jlSzol(jeHibaMondat(kerekEll(v, x.h, lv), v, x.h, JL.seg), true);
    setTimeout(function () { if (!JL || JL.f !== f) return; x.razkod = null; JL.lezart = false; jlRajz(); }, jeVar(750));
  },
  bekuld: function (JL, v) {
    var x = JL.f.js, ka = kerekit(x.a, x.h), kb = kerekit(x.b, x.h);
    if (v === ka + kb) {
      x.fazis = "kesz"; x.tiki = "orul"; JL.beirt = String(v); hangCsilla();
      mondd("A pontos összeg: " + szo(x.a + x.b) + "." + (x.elozo ? " Melyik jóslat lett közelebb?" : ""));
      if (x.elozo) jsFelirat("Melyik jóslat lett közelebb: a tízes vagy a százas?");
      jlJo(x.a + " + " + x.b + " ≈ " + v, null, function (tovabb) { setTimeout(tovabb, jeVar(x.elozo ? 4200 : 2600)); });
      return;
    }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("jóslat " + x.a + " + " + x.b)); jlRajz();
    jlSzol(JL.seg >= 2 || x.halv ? "Kerekítsd " + jeHelyRa(x.h) + ": " + szo(x.a) + " körülbelül " + szo(ka) + ". És a másik?" : "Add össze a két lámpás számát: " + szo(ka) + " meg " + szo(kb) + "!", true);
    jlFokusz();
  },
  gepi: function (JL) {
    var x = JL.f.js, sel = [];
    if (x.fazis === "becs") return { gepel: kerekit(x.a, x.h) + kerekit(x.b, x.h) };
    [["a", x.a], ["b", x.b]].forEach(function (r) {
      if (x.tesz[r[0]] != null) return;
      var T = Math.floor(r[1] / x.h) * x.h;
      sel.push('#jl-svg .jl-fog[data-fog="' + r[0] + '"]', '#jl-svg .jl-hely[data-hely="' + r[0] + (kerekit(r[1], x.h) === T ? "b" : "j") + '"]');
    });
    return { katt: sel };
  }
};

/* ═════════════════ ⑤ ELÉG LESZ? (Tüske néni boltja) ═════════════════ */
var JE_ARU = [["🧺", "kosár"], ["🍯", "méz"], ["🕯️", "gyertya"], ["🧣", "sál"], ["🪁", "sárkány"], ["📚", "könyv"], ["🧸", "maci"], ["🎈", "lufi"]];
JE.eleg = {
  gen: function (cfg, st, i) {
    if (!st.sorE) st.sorE = keverTomb([veletlenElem([0, 1]), 2]);
    var eset = st.sorE[i % st.sorE.length], arak, R, P, S, p;
    for (p = 0; p < 500; p++) {
      arak = [jeNemKerek(110, 420), jeNemKerek(110, 420), jeNemKerek(110, 420)];
      if (arak.some(function (a) { return a % 100 === 50; })) continue;
      R = arak.reduce(function (s, a) { return s + kerekit(a, 100); }, 0); S = arak[0] + arak[1] + arak[2];
      P = eset === 0 ? R + veletlen(2, 4) * 100 : eset === 1 ? R - veletlen(2, 3) * 100 : R + veletlenElem([-100, 0, 100]);
      if (P < 400 || P > 1000) continue;
      if (eset === 2 && Math.abs(S - P) < 15) continue;
      break;
    }
    var aruk = keverTomb(JE_ARU.slice()).slice(0, 3);
    var x = { forma: "eleg", arak: arak, aruk: aruk, R: R, P: P, S: S, eset: eset, fazis: "becs", val: null };
    return jeFeladat(x, R, "Elég lesz a " + P + " tallér? Kerekítsd százasra az árakat, és add össze! Írd a táblára!",
      "Elég lesz a " + szo(P) + " talléred? Becsülj! Kerekítsd százasra az árakat, és add össze! Írd a táblára!", jsNaplo("elég? " + arak.join(" + ") + " / " + P));
  },
  jegyek: function () { return 4; },
  H: function () { return jeKesk() ? { lako: [10, 60, .62], pult: [20, 380, 360], aru: [[70, 352], [200, 352], [330, 352]], er: [300, 230], kassza: [200, 452], kar: { x: [70, 200, 330], y: [566, 566, 566], w: 118, h: 66 }, tab: [300, 74, 112, 62], koz: [216, 88] } :
    { lako: [-6, 116, 1], pult: [180, 330, 420], aru: [[250, 298], [370, 298], [490, 298]], er: [560, 178], kassza: [300, 190], kar: { x: [700, 700, 700], y: [168, 232, 296], w: 168, h: 54 }, tab: [700, 72, 112, 62], koz: [618, 86] }; },
  kep: function (JL) { var K = jsK(); return { vb: "0 0 " + K.W + " " + K.H, tabla: JE.eleg.H().tab, uni: jeKesk() ? [352, 650, K.um, -1] : [K.uniD[0], K.uniD[1], K.um, -1] }; },
  tablaAll: function (JL) { return JL.f.js.fazis === "becs" ? "" : "var"; },
  tablaVarMondat: function () { return "Koppints egy kártyára!"; },
  rajz: function (JL) {
    var x = JL.f.js, H = JE.eleg.H(), s = jsHatter(JL), F = pcF, kk = jeKesk();
    s += jeLakoHely(H.lako[0], H.lako[1], H.lako[2], false);
    /* a pult, rajta a három dolog árcédulával */
    s += '<g filter="url(#lt-firka)"><rect x="' + H.pult[0] + '" y="' + H.pult[1] + '" width="' + H.pult[2] + '" height="26" rx="6" fill="#d9a877" stroke="#8a5a3a" stroke-width="2.4"/></g>';
    x.aruk.forEach(function (a, k) {
      var p = H.aru[k];
      s += '<text x="' + p[0] + '" y="' + p[1] + '" text-anchor="middle" font-size="' + (kk ? 38 : 46) + '">' + a[0] + '</text>';
      s += '<g transform="translate(' + p[0] + ' ' + (p[1] + (kk ? -58 : -66)) + ') rotate(-5)"><g filter="url(#lt-firka)"><rect x="-30" y="-14" width="60" height="26" rx="6" fill="#fffaf0" stroke="#c9ad85" stroke-width="1.6"/></g><text y="6" text-anchor="middle" font-size="16"' + JS_FR + ' fill="#6e4a36">' + x.arak[k] + '</text></g>';
    });
    /* az erszény a pénzzel */
    s += '<g transform="translate(' + H.er[0] + ' ' + H.er[1] + ')"><g filter="url(#lt-firka)"><path d="M-30 -6Q-36 30 0 32Q36 30 30 -6Q24 -18 0 -18Q-24 -18 -30 -6Z" fill="#c99272" stroke="#8a5a3a" stroke-width="2.4"/></g><path d="M-18 -16Q0 -26 18 -16" stroke="#8a5a3a" stroke-width="2.4" fill="none"/>' +
         '<text y="14" text-anchor="middle" font-size="17"' + JS_FR + ' fill="#fff">' + x.P + '</text><text y="52" text-anchor="middle" font-size="13"' + JS_FR + ' fill="#6e4a36">tallér</text></g>';
    s += jeKozel(H.koz[0], H.koz[1], kk ? 30 : 36);
    if (x.fazis === "dont" || x.fazis === "kesz") s += jeKartyak(kk ? ["Elég", "Nem elég", "Nem tudom\nbiztosan"] : ["Elég", "Nem elég", "Nem tudom biztosan"], H.kar, x.val, x.fazis === "dont" && !JL.lezart, kk ? 15 : 16);
    if (x.kassza) {   /* a kassza kiszámolta */
      s += '<g transform="translate(' + H.kassza[0] + ' ' + H.kassza[1] + ')"><g filter="url(#lt-firka)"><rect x="-62" y="-26" width="124" height="52" rx="8" fill="#e7f3ff" stroke="#5f84b0" stroke-width="2.4"/></g><text y="9" text-anchor="middle" font-size="24"' + JS_FR + ' fill="#3d5a9e">= ' + x.S + '</text></g>';
    }
    return s;
  },
  utan: function (JL) { jeLakoRak(JL, "tuske", JL.f.js.poz || "koszon"); },
  bekuld: function (JL, v) {
    var x = JL.f.js;
    if (v === x.R) { x.fazis = "dont"; JL.beirt = String(v); hangCsilla(); jsFelirat("≈ " + v + ". Elég lesz a " + x.P + " tallér? Válassz kártyát!"); jlRajz(); mondd("Elég lesz a " + szo(x.P) + " talléred? Válassz egy kártyát!"); return; }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("elég? becslés")); jlRajz();
    jlSzol(JL.seg >= 2 ? "Előbb az első ár: " + szo(x.arak[0]) + ". Melyik százashoz van közelebb? Aztán a másik kettő, és add össze!" : "Kerekítsd mindhárom árat százasra, és add össze a kerek számokat!", true);
    jlFokusz();
  },
  katt: function (JL, t) {
    var x = JL.f.js, e = t.closest(".je-kartya"); if (!e || x.fazis !== "dont") return;
    var k = +e.getAttribute("data-k"), f = JL.f;
    hangGomb(); x.val = k;
    if (k === x.eset) {
      x.fazis = "kesz"; x.poz = "orul"; x.tiki = "orul"; hangCsilla();
      if (x.eset === 2) {
        x.kassza = true; x.poz = "szamol";
        mondd("A kassza kiszámolta: " + szo(x.S) + " tallér. " + (x.S <= x.P ? "Elég!" : "Nem elég!"));
        jlJo("≈ " + x.R + " → nem tudom biztosan · = " + x.S + (x.S <= x.P ? " (elég)" : " (nem elég)"), null, function (tovabb) { setTimeout(tovabb, jeVar(3600)); });
      } else jlJo("≈ " + x.R + " → " + (k === 0 ? "elég" : "nem elég"), null, jsMutatEltart);
      return;
    }
    JL.lezart = true; jlRossz(["elég", "nem elég", "nem tudom"][k], jsNaplo("elég? döntés")); jlRajz();
    var m;
    if (x.eset === 2) m = "A becslés nagyon közel van a pénzedhez. Kerekítéskor egy kicsit elcsúszik: lehet egy kicsit több vagy kevesebb is!";
    else if (k === 2) m = "Nézd meg: a becslés messze van a pénzedtől. " + (JL.seg >= 2 ? "Ennyi kerekítéstől sem lesz annyival több vagy kevesebb." : "Biztosan tudhatod!");
    else m = "A becslés " + szo(x.R) + ", a pénzed " + szo(x.P) + ". Melyik a nagyobb?";
    jlSzol(m, true);
    setTimeout(function () { if (!JL || JL.f !== f) return; x.val = null; JL.lezart = false; jlRajz(); }, jeVar(900));
  },
  gepi: function (JL) { var x = JL.f.js; return x.fazis === "becs" ? { gepel: x.R } : { katt: ['#jl-svg .je-kartya[data-k="' + x.eset + '"]'] }; }
};

/* ═════════════════ ⑥ HOVA ESIK A SZORZAT? ═════════════════ */
JE.szor = {
  gen: function (cfg, st, i) {
    var a, b, p;
    for (p = 0; p < 300; p++) { a = jeNemKerek(104, 296); b = veletlen(2, 8); if (a * b <= 999 && kerekit(a, 100) * b <= 1000 && a % 100 !== 50) break; }
    var x = { forma: "szor", a: a, b: b, fazis: "rak", hol: null };
    return jeFeladat(x, kerekit(a, 100) * b, "Becsüld meg a szorzatot! Vidd a " + a + " kövét a közelebbi százashoz!",
      "Hova esik a szorzat? Előbb kerekítsd százasra az első számot! Vidd a követ a közelebbi lámpáshoz!", jsNaplo("szorzat " + a + " · " + b));
  },
  jegyek: function () { return 4; },
  H: function () { return jeKesk() ? { row: 170, s: [70, 330], cet: [200, 62], becs: [140, 300], tab: [300, 300, 112, 62], ered: [470, 24, 376], tiki: [52, 600, .36], lenc: [352, 600] } :
    { row: 170, s: [262, 562], cet: [420, 54], becs: [400, 254], tab: [580, 244, 112, 62], ered: [372, 70, 760], tiki: [84, 300, .5], lenc: [186, 70] }; },
  kep: function (JL) { var K = jsK(); return { vb: "0 0 " + K.W + " " + K.H, tabla: JL.f.js.fazis === "rak" ? null : JE.szor.H().tab, uni: jeKesk() ? [352, 650, K.um, -1] : [K.uniD[0], K.uniD[1], K.um, -1] }; },
  tablaAll: function (JL) { return JL.f.js.fazis === "becs" ? "" : "var"; },
  tablaVarMondat: function () { return "Előbb vidd a követ a közelebbi lámpáshoz!"; },
  rajz: function (JL) {
    var x = JL.f.js, H = JE.szor.H(), s = jsHatter(JL), kk = jeKesk(), ka = kerekit(x.a, 100);
    s += jsTiki(H.tiki[0], H.tiki[1], H.tiki[2], x.tiki || "var") + jeLencse(H.lenc[0], H.lenc[1], 100, kk ? .8 : 1);
    s += jeCetli(H.cet[0], H.cet[1], x.a + " · " + x.b, kk ? 24 : 28);
    var S = jeSeg(Math.floor(x.a / 100) * 100, 100, H.s[0], H.s[1]), tesz = x.fazis === "rak" && !JL.lezart;
    s += jeSegRajz(JL, S, H.row, { n: x.a, id: "a", lh: kk ? 50 : 56, tesz: tesz ? "a" : null, fog: tesz, hol: x.hol, razkod: x.razkod, m: .82 });
    if (x.fazis !== "rak") s += '<text x="' + H.becs[0] + '" y="' + (H.becs[1] + 10) + '" text-anchor="middle" font-size="' + (kk ? 24 : 28) + '"' + JS_FR + ' fill="#4a3b7a">' + kiiras(ka + " · " + x.b + " =") + '</text>';
    if (x.fazis === "kesz") s += jeBeteljesul(JL, H.ered[1], H.ered[2], H.ered[0], [ka * x.b], x.a * x.b, 0, 1000);
    return s;
  },
  felvesz: function (JL, id) { var x = JL.f.js; return id === "a" && x.fazis === "rak" ? x.a : null; },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.js, f = JL.f;
    if (!hova || hova.charAt(0) !== "a") { jlRajz(); return; }
    var T = Math.floor(x.a / 100) * 100, lv = hova.charAt(1) === "b" ? T : T + 100;
    if (lv === kerekit(x.a, 100)) {
      x.hol = hova.charAt(1); x.fazis = "becs"; hangCsilla();
      jsFelirat("Mennyi " + lv + " · " + x.b + "? Írd a táblára!"); jlRajz(); jlFokusz(); mondd("Mennyi " + szorSzo(x.b) + " " + szo(lv) + "? Írd a táblára!"); return;
    }
    JL.lezart = true; x.razkod = true;
    jlRossz(String(lv), jsNaplo("kerekítés százasra " + x.a)); jlRajz();
    jlSzol(jeHibaMondat(kerekEll(x.a, 100, lv), x.a, 100, JL.seg), true);
    setTimeout(function () { if (!JL || JL.f !== f) return; x.razkod = false; JL.lezart = false; jlRajz(); }, jeVar(750));
  },
  bekuld: function (JL, v) {
    var x = JL.f.js, ka = kerekit(x.a, 100);
    if (v === ka * x.b) {
      x.fazis = "kesz"; x.tiki = "orul"; JL.beirt = String(v); hangCsilla();
      mondd("A pontos szorzat: " + szo(x.a * x.b) + ".");
      jlJo(x.a + " · " + x.b + " ≈ " + ka + " · " + x.b + " = " + v, null, function (tovabb) { setTimeout(tovabb, jeVar(2800)); });
      return;
    }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("szorzat " + x.a + " · " + x.b)); jlRajz();
    jlSzol(JL.seg >= 2 ? "Számold százasokkal: " + szorSzo(x.b) + " " + szo(ka / 100) + " százas. Hány százas az?" : "Mennyi " + szorSzo(x.b) + " " + szo(ka) + "?", true);
    jlFokusz();
  },
  gepi: function (JL) {
    var x = JL.f.js, T = Math.floor(x.a / 100) * 100;
    if (x.fazis === "rak") return { katt: ['#jl-svg .jl-fog[data-fog="a"]', '#jl-svg .jl-hely[data-hely="a' + (kerekit(x.a, 100) === T ? "b" : "j") + '"]'] };
    return { gepel: kerekit(x.a, 100) * x.b };
  }
};

/* ═════════════════ ⑦ HÁNY CSILLAG VAN AZ ÉGEN? ═════════════════ */
var JE_EG_KARTYA = ["100-nál kevesebb", "100-nál több,\nde 300-nál kevesebb", "300-nál több"], JE_EG_KARTYA_K = ["100-nál\nkevesebb", "100 és 300\nközött", "300-nál\ntöbb"];
function jeCsillagok() {
  var alap = veletlen(9, 16), szel = [], cs = [], k, p;
  for (k = 0; k < 10; k++) szel.push(Math.max(6, alap + veletlen(-2, 2)));
  for (k = 0; k < 10; k++) {
    var a0 = -Math.PI / 2 + k * Math.PI / 5, d = .12, db = 0;
    for (p = 0; db < szel[k] && p < 4000; p++) {
      if (p % 1000 === 999) d *= .85;
      var a = a0 + .07 + Math.random() * (Math.PI / 5 - .14), r = .16 + Math.sqrt(Math.random()) * .78, u = Math.cos(a) * r, v = Math.sin(a) * r;
      if (cs.some(function (c) { return Math.hypot(c.u - u, c.v - v) < d; })) continue;
      cs.push({ u: u, v: v, sz: k, m: .7 + Math.random() * .6 }); db++;
    }
    szel[k] = db;
  }
  return { szel: szel, cs: cs, ossz: cs.length };
}
JE.eg = {
  gen: function (cfg, st, i) {
    var E = jeCsillagok(), s = veletlen(0, 9);
    var x = { forma: "eg", E: E, s: s, c: E.szel[s], fazis: "nez", becsK: null, jel: {} };
    return jeFeladat(x, E.szel[s] * 10, "Nézd meg jól!", "Nézd meg jól! Hány csillag van az égen?", jsNaplo("csillagok " + E.ossz));
  },
  jegyek: function () { return 4; },
  H: function () { return jeKesk() ? { L: [200, 250, 150], kar: { x: [70, 200, 330], y: [566, 566, 566], w: 122, h: 70 }, ered: [470, 30, 370], tiki: [52, 650, .34], fs: 13 } :
    { L: [430, 188, 155], kar: { x: [700, 700, 700], y: [168, 230, 292], w: 168, h: 54 }, ered: [398, 210, 650], tiki: [84, 300, .5], fs: 15 }; },
  kep: function (JL) {
    var K = jsK(), x = JL.f.js, kk = jeKesk(), T = x.fazis === "szelet" || x.fazis === "javit" || x.fazis === "kesz" ? K.tabla : null;
    return { vb: "0 0 " + K.W + " " + K.H, tabla: T, uni: kk ? [352, 650, K.um, -1] : [K.uniD[0], K.uniD[1], K.um, -1] };
  },
  indit: function (JL) {
    var x = JL.f.js, f = JL.f; jsKeskenyNez(JL); JL.ux = null;
    JL.lezart = true; jlRajz(); mondd("Nézd meg jól! Hány csillag van az égen?");
    setTimeout(function () {
      if (!JL || JL.f !== f) return;
      x.fazis = "becs"; JL.lezart = false;
      jsFelirat("Körülbelül hány csillag van? Válassz kártyát!"); jlRajz(); mondd("Körülbelül hány csillag volt? Válassz egy kártyát!");
    }, window.__UC_GYORS ? 30 : 3500);
    return true;
  },
  tablaAll: function (JL) { var f = JL.f.js.fazis; return f === "szelet" || f === "javit" ? "" : "var"; },
  tablaVarMondat: function () { return "Koppints egy kártyára!"; },
  rajz: function (JL) {
    var x = JL.f.js, H = JE.eg.H(), s = jsHatter(JL), L = H.L, cx = L[0], cy = L[1], r = L[2], F = pcF, k;
    s += '<g filter="url(#lt-firka)"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 12) + '" fill="#e9c27a" stroke="#8a5a1a" stroke-width="3"/></g>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#2c3466" stroke="#c9962a" stroke-width="2"/>';
    var ek = function (k) { var a = -Math.PI / 2 + k * Math.PI / 5; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    for (k = 0; k < 10; k++) { var p = ek(k); s += '<path d="M' + cx + ' ' + cy + 'L' + F(p[0]) + ' ' + F(p[1]) + '" stroke="#8d9bd0" stroke-width="1.4" opacity=".7"/>'; }
    var kopp = x.fazis === "szelet" && !JL.lezart;
    x.E.cs.forEach(function (c, i) {
      var px = cx + c.u * r, py = cy + c.v * r, mi = c.sz === x.s, R = 4.4 * c.m;
      s += '<g' + (kopp && mi ? ' class="je-csill" data-i="' + i + '" style="cursor:pointer"' : '') + '>' + (kopp && mi ? '<circle cx="' + F(px) + '" cy="' + F(py) + '" r="10" fill="transparent"/>' : '') +
           (x.jel[i] ? '<circle cx="' + F(px) + '" cy="' + F(py) + '" r="9" fill="#f6a5c0" stroke="#e0417a" stroke-width="1.4"/>' : '') +
           '<path d="M' + F(px) + ' ' + F(py - R * 1.8) + 'L' + F(px + R * .5) + ' ' + F(py - R * .5) + 'L' + F(px + R * 1.8) + ' ' + F(py) + 'L' + F(px + R * .5) + ' ' + F(py + R * .5) + 'L' + F(px) + ' ' + F(py + R * 1.8) + 'L' + F(px - R * .5) + ' ' + F(py + R * .5) + 'L' + F(px - R * 1.8) + ' ' + F(py) + 'L' + F(px - R * .5) + ' ' + F(py - R * .5) + 'Z" fill="#fff3a8"/></g>';
    });
    /* pára: a becslés alatt mindenhol; a számolásnál csak a választott szelet tiszta */
    if (x.fazis !== "nez" && x.fazis !== "kesz") {
      s += '<g pointer-events="none">';
      for (k = 0; k < 10; k++) {
        if ((x.fazis === "szelet" || x.fazis === "javit") && k === x.s) continue;
        var p0 = ek(k), p1 = ek(k + 1);
        s += '<path d="M' + cx + ' ' + cy + 'L' + F(p0[0]) + ' ' + F(p0[1]) + 'A' + r + ' ' + r + ' 0 0 1 ' + F(p1[0]) + ' ' + F(p1[1]) + 'Z" fill="#e6ebf5" stroke="#e6ebf5" stroke-width="1"/>';
      }
      s += '</g>';
      if (x.fazis === "szelet" || x.fazis === "javit") { var q0 = ek(x.s), q1 = ek(x.s + 1); s += '<path d="M' + cx + ' ' + cy + 'L' + F(q0[0]) + ' ' + F(q0[1]) + 'A' + r + ' ' + r + ' 0 0 1 ' + F(q1[0]) + ' ' + F(q1[1]) + 'Z" fill="none" stroke="#ffd84d" stroke-width="3" pointer-events="none"/>'; }
    }
    if (x.fazis === "becs" || (x.becsK != null && x.fazis !== "kesz")) s += jeKartyak(jeKesk() ? JE_EG_KARTYA_K : JE_EG_KARTYA, H.kar, x.becsK, x.fazis === "becs" && !JL.lezart, H.fs);
    if (x.fazis === "kesz") {
      var j = x.c * 10, t = jeTartomany([j, x.E.ossz]);
      s += '<g transform="translate(0 0)">' + jeBeteljesul(JL, H.ered[1], H.ered[2], H.ered[0], [j], x.E.ossz, t[0], t[1]) + '</g>';
    }
    s += jsTiki(H.tiki[0], H.tiki[1], H.tiki[2], x.tiki || "var");
    return s;
  },
  katt: function (JL, t) {
    var x = JL.f.js, e;
    if (x.fazis === "becs" && (e = t.closest(".je-kartya"))) {   /* a becslésért se ✨, se hiba (5. döntés A) */
      hangGomb(); x.becsK = +e.getAttribute("data-k"); x.fazis = "szelet";
      jsFelirat("Számold meg a csillagokat a sárga szeletben! Koppints rájuk, aztán írd a táblára, hány van!");
      jlRajz(); jlFokusz(); mondd("Most számold meg a csillagokat a sárga szeletben! Koppints rájuk egyenként, aztán írd a táblára, hány van!");
      return;
    }
    if (x.fazis === "szelet" && (e = t.closest(".je-csill"))) { var i = +e.getAttribute("data-i"); if (x.jel[i]) delete x.jel[i]; else x.jel[i] = 1; hangGomb(); jlRajz(); }
  },
  bekuld: function (JL, v) {
    var x = JL.f.js;
    if (x.fazis === "szelet") {
      if (v === x.c) { x.fazis = "javit"; hangCsilla(); jsFelirat("Tíz ilyen szelet van. Körülbelül hány csillag van az egész égen? Írd a táblára!"); jlRajz(); jlFokusz(); mondd("Tíz ilyen szelet van. Körülbelül hány csillag van az egész égen?"); return; }
      JL.rossz = String(v); jlRossz(String(v), jsNaplo("csillag-szelet")); jlRajz();
      jlSzol(JL.seg >= 2 ? "Koppints minden csillagra a sárga szeletben! Minden koppintás egy pötty. Aztán számold meg a pöttyöket!" : "Számold meg újra! Koppints a csillagokra, hogy ne maradjon ki egy sem.", true);
      jlFokusz(); return;
    }
    if (v === x.c * 10) {
      x.fazis = "kesz"; x.tiki = "orul"; JL.beirt = String(v); hangCsilla();
      mondd("Az egész égen pontosan " + szo(x.E.ossz) + " csillag van.");
      jlJo("≈ " + v + " (" + x.c + " · 10)", null, function (tovabb) { setTimeout(tovabb, jeVar(3000)); });
      return;
    }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("csillag · 10")); jlRajz();
    jlSzol(JL.seg >= 2 ? "Tízszer " + szo(x.c) + ". Mennyi az?" : "Egy szeletben " + szo(x.c) + " csillag van, és tíz szelet van. Mennyi az összesen, körülbelül?", true);
    jlFokusz();
  },
  gepi: function (JL) {
    var x = JL.f.js;
    if (x.fazis === "becs") return { katt: ['#jl-svg .je-kartya[data-k="1"]'] };
    if (x.fazis === "szelet") return { gepel: x.c };
    return { gepel: x.c * 10 };
  }
};

/* ═════════════════ 🦊 ⑧ ZSIVÁNY KISZÁMOLTA ═════════════════ */
function jeZsivCetli() {
  var p, a, b, op, e, w, becs;
  for (p = 0; p < 500; p++) {
    op = veletlenElem(["+", "+", "-"]);
    if (op === "+") { a = jeNemKerek(110, 860); b = jeNemKerek(110, 980 - a); e = a + b; }
    else { a = jeNemKerek(320, 980); b = jeNemKerek(110, a - 120); e = a - b; }
    if (kerekit(a, 100) === a || kerekit(b, 100) === b || a % 100 === 50 || b % 100 === 50) continue;
    becs = op === "+" ? kerekit(a, 100) + kerekit(b, 100) : kerekit(a, 100) - kerekit(b, 100);
    if (becs <= 0) continue;
    return { a: a, b: b, op: op, e: e, becs: becs };
  }
  return { a: 312, b: 489, op: "+", e: 801, becs: 800 };
}
function jeZsivRossz(c) {   /* nagy hiba: helyiérték-csúszás (az egyik tag elcsúszik), rossz százas, vagy összeadott a kivonás helyett */
  var l = [], d;
  if (c.op === "+") { l.push(c.a + c.b * 10, c.a * 10 + c.b); }
  else l.push(c.a + c.b);
  for (d = 3; d <= 5; d++) { l.push(c.e + d * 100); if (c.e - d * 100 > 0) l.push(c.e - d * 100); }
  l = l.filter(function (w) { return w > 0 && w <= 9999 && Math.abs(w - c.becs) >= 250 && Math.abs(w - c.e) >= 250; });
  return l.length ? veletlenElem(l) : c.e + 400;
}
JE.zsiv = {
  gen: function (cfg, st, i, halv) {
    if (!st.sorZ) st.sorZ = keverTomb([true, false, veletlenElem([true, false])]);
    var jo = halv ? veletlenElem([true, false]) : st.sorZ[i % st.sorZ.length], c = jeZsivCetli();
    c.w = jo ? c.e : jeZsivRossz(c); c.jo = jo;
    var x = { forma: "zsiv", c: c, fazis: "becs", val: null, poz: "mutat" };
    var t = c.a + (c.op === "+" ? " + " : " − ") + c.b + " = " + c.w;
    return jeFeladat(x, c.becs, "Zsivány kiszámolta. Becsülj százasra kerekítve! Írd a táblára!", "Zsivány kiszámolta. Jó lehet? Előbb becsülj: kerekítsd százasra a két számot! Írd a táblára!", jsNaplo("Zsivány: " + t));
  },
  jegyek: function () { return 4; },
  H: function () { return jeKesk() ? { lako: [404, 28, .6], cet: [160, 128], koz: [118, 278], tab: [210, 262, 112, 62], pe: [[110, 420], [290, 420]], tiki: [52, 610, .34] } :
    { lako: [800, 110, 1], cet: [390, 110], koz: [318, 238], tab: [420, 224, 124, 62], pe: [[300, 352], [490, 352]], tiki: [84, 300, .5] }; },
  kep: function (JL) { var K = jsK(); return { vb: "0 0 " + K.W + " " + K.H, tabla: JE.zsiv.H().tab, uni: jeKesk() ? [352, 650, K.um, -1] : [K.uniM[0], K.uniM[1], K.um, 1] }; },
  tablaAll: function (JL) { return JL.f.js.fazis === "becs" ? "" : "var"; },
  tablaVarMondat: function () { return "Pecsételj: lehet, vagy nem lehet?"; },
  rajz: function (JL) {
    var x = JL.f.js, c = x.c, H = JE.zsiv.H(), s = jsHatter(JL), kk = jeKesk(), F = pcF;
    s += jeLakoHely(H.lako[0], H.lako[1], H.lako[2], true);
    s += jsTiki(H.tiki[0], H.tiki[1], H.tiki[2], x.tiki || "var");
    var t = c.a + (c.op === "+" ? " + " : " − ") + c.b + " = " + c.w;
    s += '<g' + (x.vissza ? ' opacity=".45"' : '') + '>' + jeCetli(H.cet[0], H.cet[1], t, kk ? 20 : 28) + '</g>';
    if (x.pecset != null) s += '<g transform="translate(' + (H.cet[0] + (kk ? 92 : 150)) + ' ' + (H.cet[1] + 4) + ') rotate(-12)"><circle r="' + (kk ? 20 : 26) + '" fill="none" stroke="' + (x.pecset ? "#3f9e6a" : "#d0435a") + '" stroke-width="4"/><text y="' + (kk ? 9 : 11) + '" text-anchor="middle" font-size="' + (kk ? 24 : 30) + '"' + JS_FR + ' fill="' + (x.pecset ? "#3f9e6a" : "#d0435a") + '">' + (x.pecset ? "✓" : "✗") + '</text></g>';
    s += jeKozel(H.koz[0], H.koz[1], kk ? 30 : 36);
    if (x.fazis !== "becs") {
      var aktiv = x.fazis === "pecset" && !JL.lezart;
      [[true, "✓", "lehet", "#3f9e6a"], [false, "✗", "nem lehet", "#d0435a"]].forEach(function (b, k) {
        var p = H.pe[k], v = x.val === b[0];
        s += '<g' + (aktiv ? ' class="je-pecset" data-p="' + (b[0] ? 1 : 0) + '" style="cursor:pointer"' : '') + ' transform="translate(' + p[0] + ' ' + p[1] + ')"' + (x.val != null && !v ? ' opacity=".35"' : '') + '>' +
             '<g filter="url(#lt-firka)"><rect x="-64" y="-34" width="128" height="68" rx="14" fill="' + (v ? "#fff1a8" : "#fffaf0") + '" stroke="' + b[3] + '" stroke-width="2.6"/></g>' +
             '<text y="-2" text-anchor="middle" font-size="28"' + JS_FR + ' fill="' + b[3] + '">' + b[1] + '</text><text y="24" text-anchor="middle" font-size="15"' + JS_FR + ' fill="#4a3b7a">' + b[2] + '</text></g>';
      });
    }
    return s;
  },
  utan: function (JL) { jeLakoRak(JL, "juli", JL.f.js.poz || "mutat"); },
  bekuld: function (JL, v) {
    var x = JL.f.js, c = x.c;
    if (v === c.becs) { x.fazis = "pecset"; JL.beirt = String(v); hangCsilla(); jsFelirat("≈ " + v + ". Lehet jó Zsivány eredménye? Pecsételj!"); jlRajz(); mondd("Lehet jó Zsivány eredménye? Pecsételj!"); return; }
    JL.rossz = String(v); jlRossz(String(v), jsNaplo("Zsivány: becslés")); jlRajz();
    jlSzol(JL.seg >= 2 ? "Kerekítsd százasra: " + szo(c.a) + " körülbelül " + szo(kerekit(c.a, 100)) + ". És a másik? Aztán " + (c.op === "+" ? "add össze" : "vond ki") + "!" : "Kerekítsd százasra a két számot, és " + (c.op === "+" ? "add össze" : "vond ki") + " a kerek számokat!", true);
    jlFokusz();
  },
  katt: function (JL, t) {
    var x = JL.f.js, e = t.closest(".je-pecset"), f = JL.f; if (!e || x.fazis !== "pecset") return;
    var p = e.getAttribute("data-p") === "1";
    hangGomb(); x.val = p;
    if (p === x.c.jo) {
      x.fazis = "kesz"; x.pecset = p; x.tiki = "orul"; hangCsilla();
      if (!p) { x.vissza = true; x.poz = "lebukik"; } else x.poz = "kacsint";
      jlJo((p ? "✓ " : "✗ ") + x.c.w + " (≈ " + x.c.becs + ")", null, function (tovabb) { setTimeout(tovabb, jeVar(1800)); });
      return;
    }
    JL.lezart = true; x.poz = "vallatvon"; jlRossz(p ? "lehet" : "nem lehet", jsNaplo("Zsivány: pecsét")); jlRajz();
    jlSzol(p ? "Nézd meg: a becslés " + szo(x.c.becs) + ", a cetlin " + szo(x.c.w) + " áll. Ez nagyon messze van!" : "A becslés " + szo(x.c.becs) + ", a cetlin " + szo(x.c.w) + ". Ez közel van, lehet jó!", true);
    setTimeout(function () { if (!JL || JL.f !== f) return; x.val = null; x.poz = "mutat"; JL.lezart = false; jlRajz(); }, jeVar(1000));
  },
  gepi: function (JL) { var x = JL.f.js; return x.fazis === "becs" ? { gepel: x.c.becs } : { katt: ['#jl-svg .je-pecset[data-p="' + (x.c.jo ? 1 : 0) + '"]'] }; }
};

/* ═════════════════ BEKÖTÉS: GEN.josda és JELENETEK.josda a forma szerint ═════════════════ */
(function () {
  var genAlap = GEN.josda;
  GEN.josda = function (cfg) {
    if (!jeE(cfg.forma)) return genAlap(cfg);
    var st = jlAllapot(), i = J.feladatKesz, forma = cfg.forma, h = !!cfg.halvany;
    if (forma === "vegyes1") forma = ["cetli", "jos", "zsiv"][i % 3];
    return JE[forma].gen(cfg, st, i, h);
  };
  var A = JELENETEK.josda;
  ["kep", "indit", "tablaAll", "tablaVarMondat", "rajz", "felvesz", "letesz", "katt", "bekuld", "gepi", "utan", "jegyek"].forEach(function (m) {
    var regi = A[m];
    A[m] = function (JL) {
      var x = JL && JL.f && JL.f.js, E = x && JE[x.forma];
      if (!E) return regi ? regi.apply(null, arguments) : undefined;
      if (m === "utan") [].forEach.call(JL.svg.querySelectorAll(".je-gurul"), function (a) { try { a.beginElement(); } catch (e) {} });   /* a guruló kövek most induljanak */
      if (E[m]) return E[m].apply(E, arguments);
      if (m === "indit") { jsKeskenyNez(JL); JL.ux = null; return false; }
      if (m === "tablaVarMondat") return "Nézd meg a képet!";
      if (m === "tablaAll") return "var";
      return undefined;
    };
  });
})();

/* ═════════ 🏠 A ház közelképe a Piactéren (piac.js PC_TARGY): lent az ajtó = előszoba, fent az ablakok = 1. emelet ═════════ */
PC_TARGY.josda = {
  kep: function () { return jsTerkepHaz(5, { all: "folyik" }); }, k: 2.3, tx: 400, ty: 432,
  t: { "josda-eloszoba": { hely: [-26, -46, 52, 48], ceger: [-112, -14, .42], szo: "a lenti ajtót" },
       "josda-1em":      { hely: [-48, -70, 96, 34], ceger: [112, -58, .42], szo: "a fenti emeletet" } }
};

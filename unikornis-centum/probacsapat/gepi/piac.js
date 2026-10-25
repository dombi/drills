/* 🤖 Gépi próba — ⑩ Piac-őr (🏪 Piactér 2. kör, 2026-10-23; a böngészőben fut, a gepi_proba.py tölti be, a PIAC_N helyére
   a gyártónkénti minta-szám kerül). A láthatatlan közös alap (src/bolt.js, src/szamkor100.js) minden gyártójából
   PIAC_N feladatot kér, és mindegyiket ellenőrzi:
     • a tallér: a mohó „legkevesebb érme” = a DP-vel számolt legkevesebb (1–100, többféle tálcával); beváltás/felváltás nem változtat összeget;
     • ① Fizesd ki: az ár a határon belül, a 3 Pósa-kérdés ellenőrzője jól dönt (ugyanaz / több érme / kevés / sok);
     • ② Visszajáró: a szalag megállói hézag nélkül érnek az árból a fizetésig, a fokok azt adják, amit ígérnek;
     • ③ 🦊 blokk: a hibás blokk tényleg az ígért hibát hordja, a pontos blokkra a becslés sosem mond „nem stimmel”-t,
       🔒 kiskapu: „mindig ✗ javítás nélkül” sosem ér, a „mindig ✓” legfeljebb a pontos blokkok arányáig;
     • 🪜 Rokon-létra / segít: ugyanaz az ugrás minden fokon, a rokon = a tény-motor rokona; 🏡 Számcsalád: 4 igaz ablak,
       a kakukktojással is csak EGY család; ⚙️ Varázsgép: minden próba a szabályt követi, 0–100 között;
     • minden naplo-mező tény-kulcsot ad (a tény-motor könyveli), a forma-betűvel.
   Vissza: { hibak: [{suly, kulcs, szoveg, pelda}], stat: {gyártó: db} }. */
(function () {
  var N = PIAC_N, hibak = [], stat = {}, volt = {};
  function hiba(suly, kulcs, szoveg, pelda) {
    if (volt[kulcs]) return; volt[kulcs] = 1;   /* egy hibafajtából egy példa elég */
    hibak.push({ suly: suly, kulcs: "piac:" + kulcs, szoveg: szoveg, pelda: String(pelda || "").slice(0, 300) });
  }
  function J(x) { try { return JSON.stringify(x); } catch (e) { return String(x); } }
  function egesz(v) { return typeof v === "number" && isFinite(v) && v % 1 === 0; }
  function db(k) { stat[k] = (stat[k] || 0) + 1; }
  function nyomoz(nev, fn) { try { fn(); } catch (e) { hiba("piros", nev + ":kivetel", nev + ": a gyártó kivételt dobott: " + e.message, e.stack); } }
  function naploEll(nev, f, betu) {
    var n = f.naplo;
    if (!n || n.forma !== betu) return hiba("piros", nev + ":forma", nev + ": a naplo forma-betűje nem „" + betu + "”", J(f));
    if (n.tipus === "bolt") return;
    var tk = UC.tenyKulcs(n);
    if (!tk) hiba("piros", nev + ":tenykulcs", nev + ": a tény-motor nem kap kulcsot a naplóból (" + n.kerdes + ")", J(f));
  }
  var T = UC.TALLER;

  /* ── tallér ── */
  nyomoz("taller", function () {
    [T, [1, 2, 5, 10, 20, 50], [1, 5, 10, 50], [1, 2, 10, 20]].forEach(function (talca) {
      var dp = [0];
      for (var n = 1; n <= 100; n++) { dp[n] = Infinity; talca.forEach(function (v) { if (v <= n) dp[n] = Math.min(dp[n], dp[n - v] + 1); }); }
      for (n = 1; n <= 100; n++) {
        var l = UC.tallerLegkevesebb(n, talca);
        if (!l || UC.tallerOsszeg(l) !== n || l.length !== dp[n]) hiba("piros", "taller:legkevesebb", "A „legkevesebb érme” nem a legkevesebb (" + n + ", tálca " + talca + ")", J(l) + " — DP: " + dp[n]);
      }
    });
    for (var i = 0; i < N; i++) {
      var l = []; for (var j = 0, m = 1 + Math.floor(Math.random() * 25); j < m; j++) l.push(T[Math.floor(Math.random() * 6)]);
      [1, 10].forEach(function (h) {
        var b = UC.tallerBevalt(l, h);
        if (b && (UC.tallerOsszeg(b) !== UC.tallerOsszeg(l) || b.length !== l.length - 9)) hiba("piros", "taller:bevalt", "A beváltás megváltoztatta az összeget", J(l) + " → " + J(b));
        var c = UC.tallerFelvalt(l, h * 10);
        if (c && (UC.tallerOsszeg(c) !== UC.tallerOsszeg(l) || c.length !== l.length + 9)) hiba("piros", "taller:felvalt", "A felváltás megváltoztatta az összeget", J(l) + " → " + J(c));
      });
      db("tallér");
    }
    [1, 2, 5, 10, 20, 50, 100].forEach(function (v) { if (!UC.HE_SZIN[UC.heHely(v)]) hiba("piros", "heszin", "Nincs helyiérték-szín: " + v); });
  });

  /* ── ① Fizesd ki! ── */
  nyomoz("fizet", function () {
    for (var i = 0; i < N; i++) {
      var f = UC.boltFizet(i % 3 ? null : { min: 20, max: 60 });
      var min = i % 3 ? 3 : 20, max = i % 3 ? 99 : 60;
      if (!egesz(f.ar) || f.ar < min || f.ar > max) hiba("piros", "fizet:ar", "Az ár a határon kívül", J(f));
      if (UC.tallerOsszeg(f.legkevesebb) !== f.ar || f.legkevesebb.length !== f.minDarab || f.minDarab < 2) hiba("piros", "fizet:legk", "A legkevesebb érme nem az ár, vagy egyetlen érme", J(f));
      var e1 = UC.boltFizetEll(f, f.legkevesebb, 1);
      if (!e1.jo) hiba("piros", "fizet:jo1", "A pontos fizetést nem fogadja el", J(f));
      if (UC.boltFizetEll(f, f.legkevesebb, 2, f.legkevesebb.slice().reverse()).ok !== "ugyanaz") hiba("piros", "fizet:ugyanaz", "A „másképp” kérdésre ugyanazt (más sorrendben) is elfogadja", J(f));
      var egyesek = []; for (var j = 0; j < f.ar; j++) egyesek.push(1);
      var e2 = UC.boltFizetEll(f, egyesek, 2, f.legkevesebb), e3 = UC.boltFizetEll(f, egyesek, 3);
      if (!e2.jo) hiba("piros", "fizet:mas", "A más úton fizetést nem fogadja el", J(f));
      if (e3.jo !== (f.ar === f.minDarab)) hiba("piros", "fizet:tobb", "A „legkevesebb érmével” kérdésre a sok egyest is elfogadja", J(f));
      if (UC.boltFizetEll(f, f.legkevesebb.slice(1), 1).ok !== "keves") hiba("piros", "fizet:keves", "A kevés fizetést nem jelzi", J(f));
      var sok = UC.boltFizetEll(f, f.legkevesebb.concat([5]), 1);
      if (sok.ok !== "sok" || sok.elteres !== 5 || !(sok.visszatol > 0 && sok.visszatol <= 5)) hiba("piros", "fizet:sok", "A sok fizetésnél rossz a visszatolt érme", J(f) + " " + J(sok));
      naploEll("fizet", f, "b"); db("① fizet");
    }
  });

  /* ── ② Visszajáró ── */
  nyomoz("vissza", function () {
    UC.VISSZA_FOK.forEach(function (fok) {
      for (var i = 0; i < N; i++) {
        var f = UC.boltVissza(fok), L = f.lepesek;
        if (!(f.vissza > 0) || f.fizet > 100 || f.ar < 1 || f.fizet - f.ar !== f.vissza) hiba("piros", "vissza:szam", "Visszajáró: rossz számok (" + fok + ")", J(f));
        if (UC.tallerOsszeg(f.fizetErmek) !== f.fizet) hiba("piros", "vissza:fizetermek", "A vevő érméi nem a fizetett összeg", J(f));
        if (!L.length || L[0][0] !== f.ar || L[L.length - 1][1] !== f.fizet || L.some(function (s, k) { return s[1] <= s[0] || (k && s[0] !== L[k - 1][1]); }))
          hiba("piros", "vissza:szalag", "A szalag megállói nem érnek hézag nélkül az árból a fizetésig", J(f));
        if (L.length === 2 && L[0][1] % 10) hiba("piros", "vissza:tizes", "A szalag első megállója nem kerek tízes", J(f));
        var ok = fok === "tizesre" ? L.length === 1 && f.vissza < 10 && f.fizet % 10 === 0
          : fok === "tizesbol" ? f.ar % 10 === 0 && L.length === 1
          : fok === "teljes" ? L.length === 2
          : f.fizet === 100 && f.ar % 10 !== 0 && L.length === 2;
        if (!ok) hiba("piros", "vissza:fok:" + fok, "A „" + fok + "” fok nem azt adja, amit ígér", J(f));
        var jo = UC.tallerLegkevesebb(f.vissza);
        if (!UC.boltVisszaEll(f, jo).jo || UC.boltVisszaEll(f, jo.slice(1)).ok !== "keves" || UC.boltVisszaEll(f, jo.concat([1])).ok !== "sok")
          hiba("piros", "vissza:ell", "A visszajáró ellenőrzője rosszul dönt", J(f));
        naploEll("vissza", f, "b"); db("② vissza");
      }
    });
  });

  /* ── ③ 🦊 Róka blokkja ── */
  nyomoz("blokk", function () {
    var hibaDb = {}, mindigX = 0, mindigOk = 0, ossz = 0, pontosDb = 0;
    [2, 3].forEach(function (n) {
      for (var i = 0; i < N; i++) {
        var pontos = Math.random() < 0.4, b = UC.rokaBlokk(pontos, { tetelek: n }), h = UC.tallerOsszeg(b.tetelek);
        if (b.tetelek.length !== n || h !== b.helyes || h > 100 || b.tetelek.some(function (v) { return v % 10 === 0 || v < 1; }))
          hiba("piros", "blokk:tetel", "A blokk tételei rosszak", J(b));
        if (b.pontos !== pontos) hiba("sarga", "blokk:pontos", "A kért pontos/hibás blokk helyett másikat adott (a gyártó kifogyott)", J(b));
        if (b.pontos && b.irt !== h) hiba("piros", "blokk:pontosirt", "A pontos blokkon nem a helyes összeg áll", J(b));
        if (!b.pontos) {
          hibaDb[b.hiba] = (hibaDb[b.hiba] || 0) + 1;
          var egyesek = 0; b.tetelek.forEach(function (v) { egyesek += v % 10; });
          var ok = b.irt !== h && b.irt > 0 && b.irt <= 100 && (
            b.hiba === "atvitel" ? egyesek >= 10 && h - b.irt === 10 * Math.floor(egyesek / 10)
            : b.hiba === "tizes" ? b.tetelek.some(function (v) { return v >= 20 && h - b.irt === Math.floor(v / 10) * 10; })
            : b.hiba === "csere" ? b.irt === (h % 10) * 10 + Math.floor(h / 10)
            : b.hiba === "egy" ? Math.abs(b.irt - h) === 1 : false);
          if (!ok) hiba("piros", "blokk:hiba:" + b.hiba, "A róka hibája nem az, aminek a gyártó mondja (" + b.hiba + ")", J(b));
        }
        if (b.pontos && !b.kbStimmel) hiba("piros", "blokk:becsles", "Pontos blokkra a becslés azt mondaná: nem stimmel", J(b));
        if (n === 2 && !b.tenyTipus) hiba("piros", "blokk:tipus", "A két tételes blokknak nincs 100-as típusa (tény-motor)", J(b));
        /* 🔒 kiskapu: a vaktában stratégiák */
        if (UC.rokaPecsetEll(b, "x").jo) mindigX++;
        if (UC.rokaPecsetEll(b, "ok").jo) mindigOk++;
        if (!UC.rokaPecsetEll(b, b.pontos ? "ok" : "x", b.helyes).jo) hiba("piros", "blokk:jopecset", "A jó pecsétet (és javítást) nem fogadja el", J(b));
        if (!b.pontos && UC.rokaPecsetEll(b, "x", b.irt).jo) hiba("piros", "blokk:rosszjav", "A ✗ a róka saját (rossz) számával is ér", J(b));
        ossz++; if (b.pontos) pontosDb++;
        naploEll("blokk", b, "b"); db("③ blokk");
      }
    });
    if (mindigX) hiba("piros", "blokk:kiskapu-x", "🔒 Kiskapu: a „mindig ✗, javítás nélkül” " + mindigX + "-szor ért", "");
    if (mindigOk > pontosDb) hiba("piros", "blokk:kiskapu-ok", "🔒 Kiskapu: a „mindig ✓” többször ér, mint ahány pontos blokk volt", mindigOk + " > " + pontosDb);
    Object.keys(UC.ROKA_HIBA).forEach(function (k) { if (!hibaDb[k]) hiba("sarga", "blokk:nincs:" + k, "A róka „" + k + "” hibája egyszer sem jött elő", J(hibaDb)); });
    [[5, 2], [2, 1], [10, 4], [1, null]].forEach(function (p) {
      var s = UC.rokaSor(p[0]), t = s.filter(Boolean).length;
      if (p[1] != null && t !== p[1]) hiba("piros", "blokk:sor", "A róka-sorban nem annyi a pontos, amennyi kell (" + p[0] + " → " + p[1] + ")", J(s));
    });
  });

  /* ── 🪜 Rokon-létra ── */
  nyomoz("rokon", function () {
    [{ op: "+" }, { op: "-" }, { op: "+", atlepes: false }, { op: "-", atlepes: false }, { op: "+", fokok: 4 }].forEach(function (cfg) {
      for (var i = 0; i < N; i++) {
        var r = UC.rokonLetra(cfg), F = r.fokok, al = F[0];
        if (F.length !== (cfg.fokok || 3)) hiba("piros", "rokon:fokszam", "Nem annyi fok, amennyi kell", J(r));
        if (al.a > (cfg.op === "-" && cfg.atlepes !== false ? 18 : 9) || al.b > 9) hiba("piros", "rokon:also", "Az alsó fok nem egyjegyű tény", J(al));
        var at = cfg.atlepes !== false;
        F.forEach(function (f, k) {
          if (f.c < 0 || f.c > 100 || f.c !== (f.op === "+" ? f.a + f.b : f.a - f.b)) hiba("piros", "rokon:szam", "Rossz szám a létrán", J(f));
          if (k && (f.a <= F[k - 1].a || (f.a - al.a) % 10)) hiba("piros", "rokon:tolas", "A fokok nem egész tízessel feljebb vannak", J(r));
          if (J(f.ugras.lepesek) !== J(al.ugras.lepesek)) hiba("piros", "rokon:ugras", "Nem ugyanaz az ugrás a fokokon", J(r));
          if ((f.ugras.lepesek.length === 2) !== at) hiba("piros", "rokon:atlepes", "Az átlépés nem az, amit a beállítás kér", J(f));
          if (k && f.c === F[k - 1].c) hiba("piros", "rokon:ismetel", "🔒 Két fok válasza ugyanaz", J(r));
          if (k && f.c === al.c) hiba("piros", "rokon:ismetel2", "🔒 Egy felső fok válasza az alsóé", J(r));
          var tk = UC.tenyKulcs(f.naplo), ta = UC.tenyKulcs(al.naplo);
          if (k && tk && ta && tk.tipus && tk.rokon !== ta.kulcs) hiba("piros", "rokon:teny", "A létra rokona nem az, amit a tény-motor rokonnak tart", J(f) + " " + J(tk) + " vs " + ta.kulcs);
          naploEll("rokon", f, "r");
        });
        db("🪜 rokon");
      }
    });
    for (var i = 0; i < N; i++) {
      var s = UC.rokonSegit();
      var tk = UC.tenyKulcs(s.naplo), jo = s.kartyak[s.jo];
      if (s.kartyak.length !== 3 || s.jo < 0) hiba("piros", "segit:kartya", "Nincs 3 kártya, vagy nincs köztük rokon", J(s));
      else {
        var kul = {}; s.kartyak.forEach(function (k) { kul[k.szoveg] = 1; });
        if (Object.keys(kul).length !== 3) hiba("piros", "segit:egyforma", "Két egyforma kártya", J(s));
        if (!tk || !tk.rokon || UC.tenyKulcs({ tipus: s.op === "+" ? "osszeadas" : "kivonas", kerdes: jo.szoveg }).kulcs !== tk.rokon)
          hiba("piros", "segit:rokon", "A „jó” kártya nem a tény-motor rokona", J(s) + " " + J(tk));
        s.kartyak.forEach(function (k, n) {
          if (n !== s.jo && (k.op === "+" ? k.a + k.b : k.a - k.b) === (jo.op === "+" ? jo.a + jo.b : jo.a - jo.b) && k.a % 10 === jo.a % 10)
            hiba("sarga", "segit:ketjo", "Egy csali is jónak látszhat", J(s));
          if (k.b < 1 || (k.op === "-" && k.a - k.b < 0)) hiba("piros", "segit:csali", "Hibás csali-kártya", J(s));
        });
      }
      naploEll("segit", s, "r"); db("🪜 segít");
    }
  });

  /* ── 🪜 Rokon-létra: egy létra menete (Pálya-hely B kör, letra.js) — 9 fok, alap · távoli (3–4.) · hiányzók a távoli fölött, alulról felfelé ── */
  nyomoz("letramenet", function () {
    [{ op: "+" }, { op: "-" }, { op: "+", hiany: 1 }, { op: "-", hiany: 1 }].forEach(function (cfg) {
      for (var i = 0; i < N; i++) {
        var m = UC.rokonLetraMenet(cfg), F = m.fokok, K = m.kerdes, H = K.slice(2), hiany = cfg.hiany == null ? 3 : cfg.hiany;
        if (F.length !== 9) hiba("piros", "letramenet:fokszam", "Nem 9 fokos a létra (egy fok = egy tízes, ami belefér a 100-ba)", J(m.alap));
        if (K[0] !== 0 || K[1] < 3 || K.length !== 2 + hiany) hiba("piros", "letramenet:rend", "A kérdések rendje nem: alap · távoli rokon (3. foktól) · hiányzók", J(K));
        if (F[F.length - 1].c > 100 || F.some(function (f) { return f.c < 0 || f.c !== (f.op === "+" ? f.a + f.b : f.a - f.b) || J(f.ugras.lepesek) !== J(F[0].ugras.lepesek); })) hiba("piros", "letramenet:szam", "Rossz szám vagy nem ugyanaz az ugrás a létrán", J(F));
        var mind = {}; K.concat(m.magatol).forEach(function (k) { mind[k] = (mind[k] || 0) + 1; });
        if (Object.keys(mind).length !== 9 || Object.keys(mind).some(function (k) { return mind[k] !== 1; })) hiba("piros", "letramenet:fedes", "A kérdezett + magától kitöltött fokok nem fedik pontosan a létrát", J(m));
        if (K[1] > 4 || H.some(function (k, j) { return k <= K[1] || (j && k <= H[j - 1]); })) hiba("piros", "letramenet:felfele", "⬆️ Nem csak felfelé: a távoli rokon nem a 3–4. fok, vagy a hiányzók nem a fölötte, alulról felfelé jönnek", J(K));
        var s = UC.rokonSajatEll(F[0], F[0].a + 30), s2 = UC.rokonSajatEll(F[0], F[0].a + 31), s3 = UC.rokonSajatEll(F[0], F[0].a);
        if (!s.jo || s.c !== F[3].c || s2.jo || s3.jo) hiba("piros", "letramenet:sajat", "Az „Írj te egy rokont!” ellenőrzője rosszul dönt", J([F[0], s, s2, s3]));
        F.forEach(function (f) { naploEll("letramenet", f, "r"); });
        db("🪜 létra-menet");
      }
    });
  });

  /* ── 🏡 Számcsalád ── */
  nyomoz("csalad", function () {
    var nincsKakukk = 0;
    [{ max: 20 }, { max: 100 }, { max: 20, kakukk: true }, { max: 100, kakukk: true }].forEach(function (cfg) {
      for (var i = 0; i < N; i++) {
        var c = UC.szamCsalad(cfg);
        if (c.x === c.y || c.x + c.y !== c.z || c.z > cfg.max || c.x < 1 || c.y < 1) hiba("piros", "csalad:szam", "Rossz számcsalád", J(c));
        var keszek = [];
        c.ablakok.forEach(function (w) {
          var e = UC.csaladAblakEll(c, w[0], w[1], w[2], w[3], keszek);
          if (!e.jo) hiba("piros", "csalad:ablak", "Egy helyes ablakot nem fogad el", J(c) + " " + J(w));
          keszek.push(w);
        });
        if (UC.csaladAblakEll(c, c.ablakok[0][0], "+", c.ablakok[0][2], c.z, keszek).ok !== "megvan") hiba("piros", "csalad:megvan", "Ugyanazt az ablakot kétszer is elfogadja", J(c));
        if (UC.csaladAblakEll(c, c.y, "−", c.z, c.x, []).jo) hiba("piros", "csalad:nemigaz", "Az 5 − 13 alakot is elfogadja", J(c));
        if (cfg.kakukk) {
          if (c.kakukk == null) nincsKakukk++;
          else if (c.kavicsok.length !== 4 || UC.csaladokSzama(c.kavicsok) !== 1) hiba("piros", "csalad:kakukk", "A kakukktojással nem egyértelmű, melyik a család", J(c));
          if (c.kakukk != null && UC.csaladAblakEll(c, c.kakukk, "+", c.y, c.kakukk + c.y, []).jo) hiba("piros", "csalad:kakukkablak", "A kakukktojás befér egy ablakba", J(c));
        } else if (UC.csaladokSzama(c.kavicsok) !== 1) hiba("piros", "csalad:egy", "A 3 kavics nem pontosan egy család", J(c));
        naploEll("csalad", c, "c"); db("🏡 család");
      }
    });
    if (nincsKakukk) hiba("piros", "csalad:nincskakukk", "A Kakukktojás-állomáson elmaradt a kakukktojás (" + nincsKakukk + "×) — a C kör óta újrasorsol", "");
    /* 🧺🧺 Két kosár (C kör 1. menet): 3 + 3 szám, mind különböző, bármely pár összege 100 alatt; a párból 4 ablakos család lesz */
    for (var k = 0; k < N; k++) {
      var K = UC.csaladKosarak(), m = K.a.concat(K.b);
      if (K.a.length !== 3 || K.b.length !== 3 || m.some(function (n, i) { return m.indexOf(n) !== i || n < 1; })) hiba("piros", "csalad:kosar", "A két kosár számai nem 3 + 3 különböző szám", J(K));
      K.a.forEach(function (a) { K.b.forEach(function (b) {
        if (a + b >= 100) hiba("piros", "csalad:kosar100", "Egy pár összege nem fér a 100 alá", J(K));
        var c = UC.csaladBol(a, b, 100, null);
        if (c.ablakok.length !== 4 || UC.csaladokSzama(c.kavicsok) !== 1) hiba("piros", "csalad:kosarcsalad", "A választott párból nem 4 ablakos család lesz", J(c));
      }); });
      db("🧺 két kosár");
    }
  });

  /* ── ⚙️ Varázsgép ── */
  nyomoz("gep", function () {
    [{}, { op: "-" }, { forditott: true }, { max: 20, probak: 2 }].forEach(function (cfg) {
      for (var i = 0; i < N; i++) {
        var g = UC.varazsGep(cfg), S = g.szabaly;
        function ki(v) { return S.op === "+" ? v + S.k : v - S.k; }
        var lat = {};
        g.probak.forEach(function (p) {
          lat[p[0]] = 1;
          if (p[1] !== ki(p[0]) || p[0] < 0 || p[1] < 0 || p[1] > 100) hiba("piros", "gep:proba", "Egy próba nem követi a szabályt / kilóg 0–100-ból", J(g));
        });
        if (Object.keys(lat).length !== g.probak.length || g.probak.length !== (cfg.probak || 3)) hiba("piros", "gep:probaszam", "Egyforma vagy hiányzó próbák", J(g));
        var be = g.forditott ? g.valasz : g.kerdes;
        if (lat[be]) hiba("piros", "gep:ismetel", "A kérdés egy már mutatott próba", J(g));
        if (ki(be) !== (g.forditott ? g.kerdes : g.valasz) || g.valasz < 0 || g.valasz > 100) hiba("piros", "gep:valasz", "A gép válasza nem a szabály szerinti", J(g));
        naploEll("gep", g, "g"); db("⚙️ gép");
      }
    });
  });

  return { hibak: hibak, stat: stat };
})();

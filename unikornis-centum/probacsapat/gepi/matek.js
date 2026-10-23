/* 🤖 Gépi próba — ③ Matek-őr (a böngészőben fut; a gepi_proba.py tölti be, a MATEK_N helyére a minta-szám kerül).
   Minden pályát elindít (UC.palyaInditas — így a pult nehézsége is érvényes), aztán a pálya állomásairól
   a játékkal azonos módon sorsol (GEN[tipus], állomásonként új kerultMar), és mindegyik feladatot ellenőrzi:
     • a helyes válasz tényleg helyes (a kiírt képletből / a megoldás-sorból újraszámolva; mértékegység-váltás is);
     • a számok a pálya határain belül; nincs negatív, NaN, üres feladat;
     • nincs két egyforma feladat egymás után;
     • hang = kép: a képernyőn látható minden szám (≤ 100) elhangzik a felolvasásban.
   Vissza: { hibak: [{suly, kulcs, szoveg, pelda}], szovegek: [{hol, s}] (a szöveg-őrnek), stat,
            tipusok: {pályaId: pályatípus-kulcs} (a ② méret- és ⑤ kiskapu-őrnek) }.
   A TIPUS_KULCS függvényt a gepi_proba.py fűzi elé (tipus.js). */
(async function () {
  var N = MATEK_N;
  var hibak = [], szovegek = {}, stat = {}, tipusok = {};
  function hiba(suly, kulcs, szoveg, pelda) { hibak.push({ suly: suly, kulcs: kulcs, szoveg: szoveg, pelda: pelda || "" }); }
  function pihen(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  async function varj(f, ms) { var t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (f()) return true; } catch (e) {} await pihen(30); } return false; }

  /* a kártya látható szövege (a rajzok nélkül) */
  var tpl = document.createElement("template");
  function lathato(f) {   /* a „Mi bújt el?” elbújt száma (.buj) és a gombok nem látható szöveg */
    if (!f.kartyaHTML) return String(f.szoveg || "");
    tpl.innerHTML = f.kartyaHTML;
    [].forEach.call(tpl.content.querySelectorAll("svg, style, script, [hidden], .buj, button, .op-betu"), function (e) { e.remove(); });
    [].forEach.call(tpl.content.querySelectorAll("div, p, li, br"), function (e) { e.after(" "); });
    return (tpl.content.textContent || "").replace(/\s+/g, " ").trim();
  }
  function htmlTelen(s) { tpl.innerHTML = String(s || ""); return (tpl.content.textContent || "").replace(/\s+/g, " ").trim(); }
  /* „27 350” → 27350 (ezres tagolás); a lépés-sorszám („1. Hány…”) nem feladat-szám */
  function egybe(s) { var r = String(s), e; do { e = r; r = r.replace(/(\d) (\d{3})(?!\d)/g, "$1$2"); } while (r !== e); return r; }
  function szamok(s) { return (egybe(s).replace(/(^|\s)\d+\.\s(?=[A-ZÁÉÍÓÖŐÚÜŰ])/g, " ").match(/\d+/g) || []).map(Number); }

  /* ── a felolvasásban elhangzó számok 0–100: számjegy vagy számnév, ragozva is (tízzel, ötször, néggyel, hússzal, hetet) ── */
  var EGYES = ["egy", "kettő", "két", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"];
  var VALTOZAT = [];   /* [n, tő] — a szó ezzel a tővel kezdődik */
  for (var n0 = 0; n0 <= 100; n0++) {
    var w = UC.szo(n0).toLowerCase(), tovek = [w];
    if (/kettő$/.test(w)) tovek.push(w.replace(/kettő$/, "két"), w.replace(/kettő$/, "kett"));
    if (/gy$/.test(w)) tovek.push(w.replace(/gy$/, "ggy"));
    if (/sz$/.test(w)) tovek.push(w.replace(/sz$/, "ssz"), w.replace(/úsz$/, "usz"));
    if (/hét$/.test(w)) tovek.push(w.replace(/hét$/, "het"));
    if (/tíz$/.test(w)) tovek.push(w.replace(/tíz$/, "tiz"));
    if (/három$/.test(w)) tovek.push(w.replace(/három$/, "hárm"));
    tovek.forEach(function (t) { VALTOZAT.push([n0, t]); });
  }
  function hangSzamok(s) {
    var ki = {};
    egybe(s).toLowerCase().split(/[^a-záéíóöőúüű0-9]+/).forEach(function (tok) {
      if (!tok) return;
      if (/^\d+$/.test(tok)) { ki[+tok] = 1; return; }
      VALTOZAT.forEach(function (v) {
        if (tok.indexOf(v[1]) !== 0) return;
        var mar = tok.slice(v[1].length);
        if (EGYES.some(function (e) { return mar.indexOf(e) === 0; })) return;   /* „harmincnégy” nem 30 */
        ki[v[0]] = 1;
      });
    });
    return ki;
  }

  /* ── számolás: „5 + 3 = 8, 6 · 8 = 48”, „440 : 6 = 73, maradék 2”, „50 + 2 + 1 = 53 dkg” ── */
  function kiertekel(kif) {   /* csak számok és + − - · × ÷ : ( ) */
    var t = kif.replace(/−/g, "-").replace(/[·×]/g, "*").replace(/[÷:]/g, "/");
    if (!/^[\d\s+\-*/()]+$/.test(t)) return null;
    try { return Function('"use strict"; return (' + t + ");")(); } catch (e) { return null; }
  }
  var EGYENLET = /((?:\(?\d+\)?\s*[+−\-·×÷:]\s*)+\(?\d+\)?)\s*=\s*(\d+)(\s*,?\s*maradék\s*(\d+))?/g;
  function egyenletek(s) {   /* [{kif, ert, jo}] */
    var ki = [], m; EGYENLET.lastIndex = 0;
    while ((m = EGYENLET.exec(String(s)))) {
      var v = kiertekel(m[1]), ert = +m[2], jo;
      if (m[4] != null) {   /* maradékos: a = b · q + r, r < b */
        var p = m[1].split(/[÷:]/);
        var a = kiertekel(p[0]), b = kiertekel(p[1]), r = +m[4];
        jo = a != null && b != null && p.length === 2 && a === b * ert + r && r < b;
      } else jo = v != null && Math.abs(v - ert) < 1e-9;
      ki.push({ kif: m[0], ert: ert, jo: jo });
    }
    return ki;
  }
  /* mértékegységek: „27 dm = 2 m 7 dm”, „3 t 1 q = 31 q” — a két oldal ugyanannyi */
  var EGYSEG = { mm: [1, "h"], cm: [10, "h"], dm: [100, "h"], m: [1000, "h"], km: [1000000, "h"],
                 ml: [1, "u"], cl: [10, "u"], dl: [100, "u"], l: [1000, "u"], hl: [100000, "u"],
                 g: [1, "t"], dkg: [10, "t"], kg: [1000, "t"], q: [100000, "t"], t: [1000000, "t"],
                 mp: [1, "i"], perc: [60, "i"], óra: [3600, "i"], nap: [86400, "i"] };
  /* „2 m 7 dm” → 2700 (alapegységben); a mennyiségek közti műveleti jelek maradnak: „5 l − 49 dl” → „5000 − 4900” */
  function alapra(s) {
    var fajta = null, rossz = false;
    var ki = egybe(s).replace(/(?:\d+\s*[a-zó]+\s*)+/g, function (csop) {
      var re = /(\d+)\s*([a-zó]+)/g, m, ossz = 0;
      while ((m = re.exec(csop))) {
        var e = EGYSEG[m[2]]; if (!e || (fajta && fajta !== e[1])) { rossz = true; return csop; }
        fajta = e[1]; ossz += +m[1] * e[0];
      }
      return " " + ossz + " ";
    });
    return rossz || !fajta ? null : ki;
  }
  function valtasJo(megoldas) {   /* null = nem mértékegységes sor; true/false = jó-e */
    var p = htmlTelen(megoldas).split("=");
    if (p.length !== 2) return null;
    var a = alapra(p[0]), b = alapra(p[1]);
    if (a == null || b == null) return null;
    var va = kiertekel(a), vb = kiertekel(b);
    if (va == null || vb == null) return null;
    return Math.abs(va - vb) < 1e-9;
  }

  /* ── egy feladat ellenőrzése ── */
  function ellenoriz(f, cfg, pid, hol, lancban) {
    var pelda = pid + " · " + hol + " · " + (f && (f.keplet || f.szoveg || "")).toString().slice(0, 80);
    if (!f || typeof f !== "object") { hiba("piros", "matek:ures:" + pid, "Üres feladat — " + pid, pid + " · " + hol); return null; }
    var lat = lathato(f), fel = String(f.felolvas || "");
    [["kép", lat], ["hang", fel], ["tipp", f.tipp], ["megoldás", f.megoldas]].forEach(function (x) {
      if (x[1]) szovegek[x[1]] = szovegek[x[1]] || (pid + " · " + x[0]);   /* a „hang” és a „tipp” elhangzik */
    });
    if (!lat && !fel) hiba("piros", "matek:ures:" + pid, "Üres feladat (nincs se kép, se felolvasás) — " + pid, pelda);
    /* helyes válasz */
    var h = f.helyes;
    if (f.csalad === "felmondas") h = f.N;
    else if (f.csalad === "maradekos") {
      var mm = /^(\d+) ÷ (\d+)$/.exec(f.keplet || ""), hh = f.helyes || {};
      if (!mm || +mm[1] !== +mm[2] * hh.h + hh.m || hh.m >= +mm[2] || hh.m < 0)
        hiba("piros", "matek:maradekos:" + pid, "Rossz maradékos osztás — " + pid, pelda + " → " + JSON.stringify(hh));
      return f;
    }
    if (f.csalad === "dobogo") {   /* sorba rakás: a megoldás minden szereplőt tartalmaz */
      if (!f.megoldas || (f.nevek || []).some(function (n) { return String(f.megoldas).indexOf(n) < 0; }))
        hiba("piros", "matek:dobogo:" + pid, "A sorba rakás megoldásából hiányzik szereplő — " + pid, pelda + " → " + f.megoldas);
      return f;
    }
    if (f.csalad === "koppint" && f.kopp) {   /* mérés: koppintós kártya — a „jó” kártya tényleg jó-e */
      var o = f.kopp, ert = function (k) { var e = EGYSEG[k.u]; return e ? k.n * e[0] : null; };
      if (o.tipus === "osszeh") {
        var v0 = ert(o.kartyak[0]), v1 = ert(o.kartyak[1]);
        var varJo = v0 == null || v1 == null ? o.jo : (v0 === v1 ? "=" : (v0 > v1 ? 0 : 1));
        if (varJo !== o.jo) hiba("piros", "matek:osszeh:" + pid, "Rossz összehasonlítás (melyik több?) — " + pid, pelda + " → jó: " + o.jo + ", a gép szerint " + varJo);
      } else if (o.tipus === "sorba") {
        var vs = (o.rend || []).map(function (i) { return ert(o.kartyak[i]); });
        if (vs.every(function (x) { return x != null; }) && vs.some(function (x, i) { return i && x < vs[i - 1]; }) &&
            vs.some(function (x, i) { return i && x > vs[i - 1]; }))
          hiba("piros", "matek:sorba:" + pid, "Rossz sorrend a sorba rakásban — " + pid, pelda + " → " + vs.join(", "));
      } else if (o.opciok && !(o.jo >= 0 && o.jo < o.opciok.length)) {
        hiba("piros", "matek:kopp:" + pid, "A koppintós feladatnak nincs jó kártyája — " + pid, pelda + " → jo=" + o.jo);
      }
      return f;
    }
    if (h == null || typeof h !== "number" || isNaN(h)) {
      hiba("piros", "matek:helyes:" + pid, "Nincs (vagy nem szám) a helyes válasz — " + pid, pelda + " → " + JSON.stringify(h));
      return f;
    }
    if (h < 0) hiba("piros", "matek:negativ:" + pid, "Negatív a helyes válasz — " + pid, pelda + " → " + h);
    if (h !== Math.round(h)) hiba("sarga", "matek:tort:" + pid, "Nem egész a helyes válasz — " + pid, pelda + " → " + h);
    if (/NaN|undefined|Infinity/.test(lat + fel)) hiba("piros", "matek:nan:" + pid, "„NaN / undefined” a feladatban — " + pid, pelda + " → " + (lat + " | " + fel).slice(0, 160));
    /* 1) tiszta képlet: „24 + 9”, „50 + 2 + 1 = ?” */
    var kep = String(f.keplet || "").replace(/=\s*\?\s*$/, "").trim();
    if (f.hianyzo) {
      var q = f.hianyzo, v = kiertekel(q.a + q.op + q.b);
      if (v !== q.c || h !== (q.hol === "a" ? q.a : q.b))
        hiba("piros", "matek:hianyzo:" + pid, "Rossz „Mi bújt el?” feladat — " + pid, pelda + " → " + JSON.stringify(q) + " helyes=" + h);
    } else if (/^[\d\s+−\-·×÷:()]+$/.test(kep) && /[+−\-·×÷:]/.test(kep)) {
      var e = kiertekel(kep);
      if (e !== h) hiba("piros", "matek:keplet:" + pid, "Rossz helyes válasz — " + pid, pelda + " → a gép szerint " + e + ", a játék szerint " + h);
    }
    /* 2) megoldás-sor: minden egyenlet jó, és az utolsó eredménye a helyes válasz */
    var mo = htmlTelen(f.megoldas);
    if (mo && mo.indexOf("=") >= 0) {
      var eq = egyenletek(egybe(mo));
      eq.forEach(function (x) { if (!x.jo) hiba("piros", "matek:megoldas:" + pid, "Rossz számolás a megoldás-sorban — " + pid, pelda + " → " + x.kif); });
      var vj = valtasJo(mo);
      if (vj === false) hiba("piros", "matek:valtas:" + pid, "Rossz mértékegység-számolás a megoldásban — " + pid, pelda + " → " + mo);
      if (szamok(mo).indexOf(h) < 0)
        hiba("sarga", "matek:megoldas-nincs:" + pid, "A megoldás-sorban nem szerepel a helyes válasz — " + pid, pelda + " → " + mo + " / helyes " + h);
    }
    /* 3) határok (az alapműveletes pályák beállításai) */
    var nk = /^\s*(\d+)\s*([+−×÷])\s*(\d+)\s*$/.exec(String((f.naplo || {}).kerdes || "").replace("×", " × ").replace("÷", " ÷ "));
    if (nk && !f.meres && !f.vs) {
      var a = +nk[1], op = nk[2], b = +nk[3], c = kiertekel(a + op + b);
      if (c > 100 || c < 0) hiba("piros", "matek:100:" + pid, "100 fölötti vagy negatív eredmény — " + pid, pelda + " → " + a + op + b + "=" + c);
      if ((cfg.tipus === "osszeadas" || cfg.tipus === "kivonas") && cfg.a_min != null) {
        var kiv = op === "−", amin = cfg.a_min, amax = cfg.a_max, bmin = cfg.b_min, bmax = cfg.b_max;
        var kint = a < amin || a > amax || b < bmin || b > (kiv ? Math.min(bmax, a) : bmax) || (!kiv && cfg.eredmeny_max && c > cfg.eredmeny_max);
        if (kint) hiba("sarga", "matek:hatar:" + pid, "A feladat kilóg a pálya beállításaiból — " + pid,
                       pelda + " → " + a + op + b + " (a " + amin + "–" + amax + ", b " + bmin + "–" + bmax + (cfg.eredmeny_max ? ", max " + cfg.eredmeny_max : "") + ")");
        if (cfg.atlepes === "kell" || cfg.atlepes === "nincs") {
          var at = op === "+" ? (a % 10) + (b % 10) >= 10 : (a % 10) - (b % 10) < 0;
          if (at !== (cfg.atlepes === "kell")) hiba("sarga", "matek:atlepes:" + pid, "Az átlépés nem a pálya szerint — " + pid, pelda + " → " + a + op + b + " (atlepes: " + cfg.atlepes + ")");
        }
      }
    }
    /* 4) hang = kép: minden látható szám (≤ 100) elhangzik */
    if (fel && lat && !lancban) {   /* a lánc 2. kérdése szándékosan visszautal („És az hány milliméter?”) */
      var hang = hangSzamok(fel), kepSz = szamok(lat).filter(function (n) { return n <= 100; });
      var hiany = kepSz.filter(function (n) { return !hang[n]; });
      if (hiany.length) hiba("sarga", "matek:hang-kep:" + pid, "Hang ≠ kép: a képen lévő szám nem hangzik el — " + pid,
                             pelda + " → hiányzik: " + hiany.join(", ") + " · kép: „" + lat.slice(0, 120) + "” · hang: „" + fel.slice(0, 120) + "”");
    }
    return f;
  }

  if (document.querySelector("#kepernyo-nyito.aktiv")) UC.terkepNyit();   /* a legelőről (a választó) egyenesen a térképre */
  await pihen(300);
  var palyak = UC.PALYAK.filter(function (p) { return !p.hamarosan; });
  for (var pi = 0; pi < palyak.length; pi++) {
    var pa = palyak[pi], pid = pa.id, db = 0, dupla = 0;
    console.info("GEPI-HOL", "matek-őr · " + pid);
    try { UC.palyaInditas(pid); } catch (e) { hiba("piros", "matek:indul:" + pid, "Nem indul a pálya — " + pid, e.message); continue; }
    if (!UC.J || UC.J.palya.id !== pid) { hiba("sarga", "matek:zarva:" + pid, "A pálya nem indult el (zárva?) — " + pid, ""); continue; }
    /* az „Induljunk!” után az első feladat megjelenik-e (és az időzítő lefusson, mielőtt a következőt indítjuk) */
    if (!(await varj(function () { return UC.J.feladat && document.querySelector("#kepernyo-jatek.aktiv"); }, 8000)))
      hiba("piros", "matek:elso:" + pid, "A pálya nem jut el az első feladatig — " + pid, "8 mp után sincs feladat");
    await pihen(150);
    tipusok[pid] = TIPUS_KULCS(pa, UC.J.feladat);   /* a ② méret- és ⑤ kiskapu-őr pályatípusonként egy képviselőt néz */
    blokkSzovegek(document.getElementById("kepernyo-jatek")).forEach(function (kt) {   /* blokk.js (elé fűzve) */
      szovegek[kt] = szovegek[kt] || (pid + " · képernyő");
    });
    var all = UC.J.allomasok, kor = 0;
    while (db < N && kor < 200) {
      kor++;
      for (var i = 1; i < all.length && db < N; i++) {
        var a = all[i], ker = {}, elozo = null, eff = a;
        if (a.szorzo_keszlet) { eff = {}; for (var k in a) eff[k] = a[k]; eff.szorzo = a.szorzo_keszlet[Math.floor(Math.random() * a.szorzo_keszlet.length)]; }
        var darab = (a.tipus === "szambontas" || a.tipus === "szorzotabla-felmondas") ? 1 : (a.darab || 5);
        for (var j = 0; j < darab && db < N; j++) {
          var f;
          UC.J.allomasIdx = i; UC.J.feladatKesz = j;   /* mint a játékban: a generátor az állomást és a sorszámot is nézi (pl. vásár-stand sora) */
          try { f = UC.GEN[a.tipus](eff, ker); }
          catch (e) { hiba("piros", "matek:kivetel:" + pid, "A feladat-generátor hibát dob — " + pid, i + ". állomás: " + e.message); db++; continue; }
          var lanc = [f]; (f && f.lanc || []).forEach(function (x) { lanc.push(x); });
          lanc.forEach(function (g, gi) { ellenoriz(g, eff, pid, a.nev + (gi ? " (lánc " + gi + ")" : ""), gi > 0); });
          db++;
          var sig = f && (String(f.kartyaHTML || f.keplet || "") + "|" + String(f.felolvas || f.szoveg || "") + "|" + JSON.stringify(f.helyes));
          if (elozo && sig === elozo && f.csalad !== "felmondas") { dupla++;
            hiba("sarga", "matek:dupla:" + pid, "Ugyanaz a feladat kétszer egymás után — " + pid, a.nev + ": " + String(f.keplet || f.szoveg).slice(0, 80)); }
          elozo = sig;
        }
      }
    }
    stat[pid] = db;
  }
  /* a végén vissza a térképre, a következő őr tiszta lappal kezdjen */
  if (document.getElementById("jatek-haza")) document.getElementById("jatek-haza").click();
  await pihen(300);
  console.info("GEPI-HOL", "matek-őr · vége");
  return { hibak: hibak, szovegek: Object.keys(szovegek).map(function (s) { var h = szovegek[s];
    return { hol: h, s: s, hang: / · (hang|tipp)$/.test(h) }; }), stat: stat, tipusok: tipusok };
})()

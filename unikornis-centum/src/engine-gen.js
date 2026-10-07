/* ============ 3) FELADATGENERÁTOR ============ */
function tippOsszeadas(a, b) {
  if (atlepesE(a, b, "+") && a % 10 !== 0) {
    var kell = 10 - (a % 10);
    if (b > kell) return "Told fel kerek tízesig: " + szo(a) + " meg " + szo(kell) + " az " + szo(a + kell) + ". Mennyi van még hátra?";
  }
  return "Előbb add össze a tízeseket, aztán az egyeseket.";
}
function tippKivonas(a, b) {
  if (atlepesE(a, b, "-") && a % 10 !== 0) {
    return "Előbb vegyél el " + szo(a % 10) + "-t: " + szo(a) + " mínusz " + szo(a % 10) + " az " + szo(a - (a % 10)) + ". Mennyi van még hátra?";
  }
  return "Előbb vedd el a tízeseket, aztán az egyeseket.";
}
/* kerek tízes sorsolás a megadott [min,max] értéktartományban (a min/max maga értékben van megadva) */
function veletlenTizes(min, max) { return veletlen(Math.ceil(min / 10), Math.floor(max / 10)) * 10; }
/* ── Szorzós liget: magyar toldalékok + tippek (2026-09-11) ── */
function veletlenElem(arr) { return arr[veletlen(0, arr.length - 1)]; }
var SZOR_SZO = { 1: "egyszer", 2: "kétszer", 3: "háromszor", 4: "négyszer", 5: "ötször",
                 6: "hatszor", 7: "hétszer", 8: "nyolcszor", 9: "kilencszer", 10: "tízszer" };
var OSZT_VAL = { 2: "kettővel", 3: "hárommal", 4: "néggyel", 5: "öttel", 6: "hattal",
                 7: "héttel", 8: "nyolccal", 9: "kilenccel", 10: "tízzel" };
function szorSzo(n) { return SZOR_SZO[n] || (szo(n) + "-szer"); }
function azSzo(n) { return "aáeéiíoóöőuúüű".indexOf(szo(n).charAt(0)) >= 0 ? "az" : "a"; }
function osztVal(n) { return OSZT_VAL[n] || (szo(n) + "-vel"); }
/* a szorzótábla-felmondás bevezetőjéhez: „a hetes szorzótáblát" (spec-hang 2.2b) */
var TABLA_SZO = { 2: "kettes", 3: "hármas", 4: "négyes", 5: "ötös", 6: "hatos",
                  7: "hetes", 8: "nyolcas", 9: "kilences", 10: "tízes" };
function tablaSzo(n) { return TABLA_SZO[n] || szo(n); }
/* a tipp-szövegek a spec-hang-es-beszed.html kánonját követik (Szorzós liget tippek) */
function tippSzorzas(nagy, kis) {
  if (kis <= 1) return "Gondolj a szorzótáblára: " + szorSzo(1) + " " + szo(nagy) + " az " + szo(nagy) + ".";
  return "Gondolj a szorzótáblára: " + szorSzo(kis - 1) + " " + szo(nagy) + " az " + szo(nagy * (kis - 1)) +
         ", meg még egy " + szo(nagy) + ". Mennyi az?";
}
function tippOsztas(osztando, oszto, hanyados) {
  return "Fordítva gondold: hányszor van meg " + szo(oszto) + " " + azSzo(osztando) + " " + szo(osztando) +
         " számban? Segít a szorzótábla — " + szorSzo(hanyados) + " " + szo(oszto) + " " + azSzo(osztando * 1) + " " + szo(osztando) + ".";
}
function tippMaradekos(osztando, d, q, r) {
  if (r === 0) return szorSzo(q) + " " + szo(d) + " az " + szo(osztando) + ", pont kijön, maradék nulla.";
  return szorSzo(q) + " " + szo(d) + " az " + szo(q * d) + ". " + szo(osztando) + " mínusz " + szo(q * d) + " az " + szo(r) + ".";
}
/* a négy alapművelet feladat-alakja EGY helyen: a generátorok, a 🌸 Neked szóló ösvény és a becsempészés
   (teny.js) is ezekkel épít feladatot, így a kártya, a felolvasás, a tipp és a napló mindenhol ugyanaz */
function feladatOsszeadas(a, b) {
  return { csalad: "egyenkent", keplet: a + " + " + b, szoveg: a + " + " + b + " = ?",
    kartyaHTML: '<span class="k-nagy">' + a + ' + ' + b + ' = <b>?</b></span>',
    felolvas: "Mennyi " + szo(a) + " meg " + szo(b) + "?", helyes: a + b, tipp: tippOsszeadas(a, b),
    naplo: { tipus: "osszeadas", kerdes: a + " + " + b, helyes: a + b, atlepes: atlepesE(a, b, "+") } };
}
function feladatKivonas(a, b) {
  return { csalad: "egyenkent", keplet: a + " − " + b, szoveg: a + " − " + b + " = ?",
    kartyaHTML: '<span class="k-nagy">' + a + ' − ' + b + ' = <b>?</b></span>',
    felolvas: szo(a) + " mínusz " + szo(b) + ". Mennyi?", helyes: a - b, tipp: tippKivonas(a, b),
    naplo: { tipus: "kivonas", kerdes: a + " − " + b, helyes: a - b, atlepes: atlepesE(a, b, "-") } };
}
function feladatSzorzas(N, a) {
  return { csalad: "egyenkent", keplet: N + " × " + a, szoveg: N + " × " + a + " = ?",
    kartyaHTML: '<span class="k-nagy">' + N + ' × ' + a + ' = <b>?</b></span>',
    felolvas: szorSzo(N) + " " + szo(a) + ". Mennyi?", helyes: N * a, tipp: tippSzorzas(N, a),
    naplo: { tipus: "szorzas", kerdes: N + "×" + a, helyes: N * a, atlepes: false } };
}
function feladatOsztas(d, q) {
  var osztando = d * q;
  return { csalad: "egyenkent", keplet: osztando + " ÷ " + d, szoveg: osztando + " ÷ " + d + " = ?",
    kartyaHTML: '<span class="k-nagy">' + osztando + ' ÷ ' + d + ' = <b>?</b></span>',
    felolvas: szo(osztando) + " osztva " + osztVal(d) + ". Mennyi?", helyes: q, tipp: tippOsztas(osztando, d, q),
    naplo: { tipus: "osztas", kerdes: osztando + "÷" + d, helyes: q, atlepes: false } };
}

/* ── 🌿 „Mi bújt el?” (terv/mi-bujt-el-terv.html): az alapfeladat hiányzó-szám változata, EGY helyen ──
   feladatHianyzo(f, hol): f a fenti négy feladat* egyike (a tény: a op b = c), hol "a" | "b": melyik szám
   bújik el (7 + ? = 12 → "b"; ? − 5 = 7 → "a"; 42 ÷ ? = 6 → "b"). A naplo.kerdes a TELJES tény marad
   ("7 + 5"), mellé forma "h" — így a tény-motor ugyanazt a tényt lépteti, és külön jegyzi a „mi bújt el”
   előzményt (hh). A kérdőjel helyén Cincin bújik a takaró mögött (bujHTML, src/bujocska.js; takaro: "level" |
   "felho", alap a levél). A pályák (GEN.hianyzo), a becsempészés és a Neked szóló ösvény is ezt hívja. */
/* magyar rag a szám szavához: a hangrend az utolsó nem-i magánhangzóból (tíz → tíztől, harminc → harminctól) */
function hangRend(w) {
  for (var i = w.length - 1; i >= 0; i--) {
    var c = w.charAt(i);
    if ("aáoóuú".indexOf(c) >= 0) return "mely";
    if ("öőüű".indexOf(c) >= 0) return "kerek";
    if ("eé".indexOf(c) >= 0) return "magas";
  }
  return "magas";
}
function ragTol(n) { var w = szo(n); return w + (hangRend(w) === "mely" ? "tól" : "től"); }
function ragHoz(n) { var w = szo(n), h = hangRend(w); return w + (h === "mely" ? "hoz" : h === "kerek" ? "höz" : "hez"); }
/* jelzői alak főnév előtt: „két ujjat”, „két tízes” (nem „kettő ujjat”) */
function szoJelzo(n) { return szo(n).replace(/kettő$/, "két"); }
function elsoNagy(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
/* pótlás-tipp: ismert + ? = cel (a kivonandó-forma is erre vezet vissza, ha a szám nagy) */
function tippPotlas(ismert, cel) {
  var T = Math.ceil(ismert / 10) * 10;
  if (cel === 10 && ismert < 10) return "Mutass " + szoJelzo(ismert) + " ujjat. Hány ujj hiányzik a tízhez?";
  if (ismert % 10 === 0 && cel % 10 === 0)
    return "Számold tízesekben: " + szoJelzo(ismert / 10) + " tízes meg hány tízes az " + szoJelzo(cel / 10) + " tízes?";
  if (ismert % 10 !== 0 && cel === T) return "Nézd az egyeseket: " + szo(ismert % 10) + " meg mennyi az tíz?";
  if (ismert % 10 !== 0 && cel > T)
    return "Előbb " + szo(T) + "ig: " + szo(ismert) + " meg " + szo(T - ismert) + " az " + szo(T) + ". " +
           elsoNagy(ragTol(T)) + " " + szo(cel) + "ig még " + szo(cel - T) + ". " + elsoNagy(szo(T - ismert)) + " meg " + szo(cel - T) + "?";
  if (cel - ismert >= 10) return "Előbb pótold a tízeseket, aztán az egyeseket.";
  return "Számolj fölfelé " + ragTol(ismert) + " " + szo(cel) + "ig.";
}
function tippHianyzo(a, op, b, c, hol) {
  if (op === "+") return tippPotlas(hol === "b" ? a : b, c);
  if (op === "−") {
    if (hol === "a") return "Ami maradt, meg amit elvettünk: " + szo(c) + " meg " + szo(b) + ".";
    if (a <= 20) return "Számolj fölfelé " + ragTol(c) + " " + szo(a) + "ig.";
    return "Gondold pótlásként: " + szo(c) + " meg mennyi az " + szo(a) + "? " + tippPotlas(c, a);
  }
  if (op === "×") {
    var tsz = tablaSzo(hol === "b" ? a : b);
    return "Mondd " + ("aáeéiíoóöőuúüű".indexOf(tsz.charAt(0)) >= 0 ? "az " : "a ") + tsz + " sort, amíg " + azSzo(c) + " " + ragHoz(c) + " érsz.";
  }
  if (hol === "b") return elsoNagy(szorSzo(c)) + " mennyi az " + szo(a) + "?";
  return elsoNagy(szorSzo(c)) + " " + szo(b) + ". Mennyi az?";
}
function feladatHianyzo(f, hol, takaro) {
  var m = /^\s*(\d+)\s*([+−×÷])\s*(\d+)\s*$/.exec(String(f.naplo.kerdes));
  if (!m) return f;
  var a = +m[1], op = m[2], b = +m[3], c = f.helyes;
  hol = hol === "a" ? "a" : "b";
  var rejtett = hol === "a" ? a : b;
  var A = hol === "a" ? "?" : a, Bs = hol === "b" ? "?" : b;
  var fel;
  if (op === "+") fel = hol === "b" ? szo(a) + " meg mennyi az " + szo(c) + "?" : "Mennyi meg " + szo(b) + " az " + szo(c) + "?";
  else if (op === "−") fel = hol === "b" ? szo(a) + " mínusz mennyi az " + szo(c) + "?" : "Mennyi mínusz " + szo(b) + " az " + szo(c) + "?";
  else if (op === "×") fel = hol === "b" ? szorSzo(a) + " mennyi az " + szo(c) + "?" : "Hányszor " + szo(b) + " az " + szo(c) + "?";
  else fel = hol === "b" ? szo(a) + " osztva mennyivel az " + szo(c) + "?" : "Mennyi osztva " + osztVal(b) + " az " + szo(c) + "?";
  var hely = bujHTML(rejtett, takaro);
  var naplo = {}, k;
  for (k in f.naplo) naplo[k] = f.naplo[k];
  naplo.forma = "h"; naplo.hol = hol; naplo.helyes = rejtett;
  naplo.lathato = A + " " + op + " " + Bs + " = " + c;   /* a válasznaplóba ez kerül (a kerdes a tény marad) */
  var ki = { csalad: "egyenkent", keplet: naplo.lathato, szoveg: naplo.lathato,
    kartyaHTML: '<span class="k-nagy hi-k">' + (hol === "a" ? hely : a) + " " + op + " " + (hol === "b" ? hely : b) + " = " + c + "</span>",
    felolvas: elsoNagy(fel), helyes: rejtett, tipp: tippHianyzo(a, op, b, c, hol),
    megoldas: a + " " + op + " " + b + " = " + c,
    hianyzo: { hol: hol, ertek: rejtett, a: a, op: op, b: b, c: c },
    naplo: naplo };
  if (f.tenyK) ki.tenyK = f.tenyK;
  return ki;
}
var GEN = {
  osszeadas: function (cfg, kerultMar) {
    var emax = cfg.eredmeny_max || 100, a, b, kulcs, kor = 0;
    do {
      if (cfg.csak_tizes) { a = veletlenTizes(cfg.a_min, cfg.a_max); b = veletlenTizes(cfg.b_min, cfg.b_max); }
      else {
        a = veletlen(cfg.a_min, cfg.a_max);
        b = cfg.b_tizes ? veletlenTizes(cfg.b_min, cfg.b_max) : veletlen(cfg.b_min, cfg.b_max);
      }
      kulcs = Math.min(a, b) + "|" + Math.max(a, b); kor++;
    } while (kor < 500 && (a + b > emax || !atlepesOK(a, b, "+", cfg.atlepes) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return feladatOsszeadas(a, b);
  },
  kivonas: function (cfg, kerultMar) {
    var a, b, kulcs, kor = 0;
    do {
      if (cfg.csak_tizes) { a = veletlenTizes(cfg.a_min, cfg.a_max); b = veletlenTizes(cfg.b_min, cfg.b_max); }
      else {
        a = veletlen(cfg.a_min, cfg.a_max);
        b = cfg.b_tizes ? veletlenTizes(cfg.b_min, cfg.b_max) : veletlen(cfg.b_min, Math.min(cfg.b_max, a));
      }
      kulcs = a + "|" + b; kor++;
    } while (kor < 500 && (b > a || !atlepesOK(a, b, "-", cfg.atlepes) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return feladatKivonas(a, b);
  },
  szambontas: function (cfg) {
    var N = (cfg.szam != null) ? cfg.szam
          : (cfg.szam_keszlet ? veletlenElem(cfg.szam_keszlet) : veletlen(cfg.szam_min || 4, cfg.szam_max || 8));   /* szam_keszlet: egyéni pálya (4b) */
    var lapos = []; for (var i = 0; i <= N; i++) { lapos.push(i); lapos.push(N - i); }
    return { csalad: "felmondas", N: N, szoveg: "Mondd el a(z) " + N + " összes bontását!",
      kartyaHTML: 'Mondd el a <span class="szam-jelveny">' + N + '</span> összes bontását!',
      felolvas: "Mondd el " + szo(N) + " összes bontását. Kezdd lentről: nulla meg " + szo(N) + ", egy meg " + szo(N - 1) + ", és így tovább.",
      lapos: lapos, tipp: "Kezdd lentről: nulla meg " + szo(N) + ". Aztán egy meg " + szo(N - 1) + ". Folytasd!",
      naplo: { tipus: "szambontas", kerdes: N + " bontása", helyes: N, atlepes: false } };
  },
  /* szorzótábla-felmondás: egy egész N-es tábla hangos felmondása (a szambontas mintája,
     spec-hang 2.2b). Elvárt sorok: 1×N … 10×N; a sorszorzó és a tábla-szám elhagyható. */
  "szorzotabla-felmondas": function (cfg) {
    cfg = cfg || {};
    var N = (cfg.tabla != null) ? cfg.tabla
          : (cfg.tabla_keszlet ? veletlenElem(cfg.tabla_keszlet)
          : (cfg.szorzo != null ? cfg.szorzo : veletlenElem(cfg.tablak || [2, 3, 4, 5, 6, 7, 8, 9, 10])));
    var szorzatok = []; for (var k = 1; k <= 10; k++) szorzatok.push(k * N);
    return {
      csalad: "felmondas", felmod: "szorzotabla", N: N, szorzatok: szorzatok,
      szoveg: "Mondd fel a(z) " + N + "-es szorzótáblát!",
      kartyaHTML: 'Mondd fel a <span class="szam-jelveny">' + N + '</span>-es szorzótáblát!',
      felolvas: "Mondd fel a " + tablaSzo(N) + " szorzótáblát. " + szorSzo(1) + " " + szo(N) + " az " + szo(N) +
                ", " + szorSzo(2) + " " + szo(N) + " az " + szo(2 * N) + ", és így tovább.",
      tipp: "Kezdd az elején: " + szorSzo(1) + " " + szo(N) + " az " + szo(N) + ". Aztán " + szorSzo(2) + " " + szo(N) + " az " + szo(2 * N) + ". Folytasd!",
      naplo: { tipus: "szorzotabla-felmondas", kerdes: N + "-es szorzótábla", helyes: N, atlepes: false }
    };
  },
  /* szorzás: a×b ≤ 100; a fókusz N a cfg.szorzo, vagy a cfg.tablak-ból sorsolt tábla */
  szorzas: function (cfg, kerultMar) {
    var N = (cfg.szorzo != null) ? cfg.szorzo : veletlenElem(cfg.tablak), a, kulcs, kor = 0;
    do { a = veletlen(1, 10); kulcs = "sz" + Math.min(N, a) + "x" + Math.max(N, a); kor++; }
    while (kor < 200 && (N * a > 100 || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return feladatSzorzas(N, a);
  },
  /* osztás mindig maradék nélkül: hányadosból építve, d = osztó, q = hányados (1–10) */
  osztas: function (cfg, kerultMar) {
    var d = (cfg.oszto != null) ? cfg.oszto
          : (cfg.osztok ? veletlenElem(cfg.osztok)
          : (cfg.szorzo != null ? cfg.szorzo : veletlenElem(cfg.tablak)));
    var q, kulcs, kor = 0;
    do { q = veletlen(1, 10); kulcs = "o" + d + "/" + q; kor++; }
    while (kor < 200 && (d * q > 100 || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return feladatOsztas(d, q);
  },
  /* maradékos osztás: a hányadosból + maradékból építve (mi-maradt pálya, maradekos-osztas-terv.html) */
  maradekos_osztas: function (cfg, kerultMar) {
    var d = veletlenElem(cfg.osztok);
    var q, r, osztando, kulcs, kor = 0;
    var maxO = cfg.max || 99, minO = cfg.min || (d + 1);
    do {
      q = veletlen(1, 10);
      r = (veletlen(1, 5) === 1) ? 0 : veletlen(1, d - 1);
      osztando = d * q + r;
      kulcs = "m" + d + "/" + osztando;
      kor++;
    } while (kor < 500 && (osztando > maxO || osztando < minO || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    return {
      csalad: "maradekos",
      keplet: osztando + " ÷ " + d,
      szoveg: osztando + " ÷ " + d,
      kartyaHTML: '<span class="k-nagy">' + osztando + ' ÷ ' + d + '</span>' +
        '<div class="mar-valasz">' +
        '<span class="mar-eq">=</span>' +
        '<input class="mar-mezo" id="mar-h" type="text" inputmode="numeric" maxlength="2" placeholder="?" aria-label="hányados" />' +
        '<span class="mar-szo">maradék</span>' +
        '<input class="mar-mezo mar-m-off" id="mar-m" type="text" inputmode="numeric" maxlength="2" placeholder="?" aria-label="maradék" />' +
        '</div>',
      felolvas: szo(osztando) + " osztva " + osztVal(d) + ".",
      helyes: { h: q, m: r },
      tipp: tippMaradekos(osztando, d, q, r),
      naplo: { tipus: "maradekos_osztas", kerdes: osztando + "÷" + d, helyes: q + " m " + r, atlepes: false }
    };
  },
  /* vegyes: állomáson belül szorzás és osztás ~fele-fele (B és D pálya) */
  szorzasosztas: function (cfg, kerultMar) {
    return (veletlen(0, 1) ? GEN.szorzas : GEN.osztas)(cfg, kerultMar);
  },
  /* Teljes tízesek 100-ig: kerek tízes ± kerek tízes, nincs átlépés, nem megy 0 alá. */
  tizesek: function (cfg, kerultMar) {
    var a, b, op, kulcs, kor = 0;
    do {
      op = cfg.muvelet || (veletlen(0, 1) ? "+" : "-");
      a = veletlen(cfg.a_min || 2, cfg.a_max || 9) * 10;
      b = veletlen(cfg.b_min || 1, cfg.b_max || 8) * 10;
      kulcs = op + Math.min(a, b) + "|" + Math.max(a, b); kor++;
    } while (kor < 400 && ((op === "+" && a + b > 100) || (op === "-" && a - b < 0) || (op === "-" && a === b) || kerultMar[kulcs]));
    kerultMar[kulcs] = true;
    var keplet = op === "+" ? (a + " + " + b) : (a + " − " + b);
    var helyes = op === "+" ? a + b : a - b;
    var ta = a / 10, tb = b / 10, th = helyes / 10;
    return {
      csalad: "egyenkent", keplet: keplet, szoveg: keplet + " = ?",
      kartyaHTML: '<span class="k-nagy">' + keplet + ' = <b>?</b></span>',
      felolvas: op === "+" ? ("Mennyi " + szo(a) + " meg " + szo(b) + "?") : ("Mennyi " + szo(a) + " mínusz " + szo(b) + "?"),
      helyes: helyes,
      tipp: op === "+"
        ? ("Számold a tízeseket: " + ta + " meg " + tb + " az " + th + " tízes, vagyis " + szo(helyes) + ".")
        : ("Számold a tízeseket: " + ta + " mínusz " + tb + " az " + th + " tízes, vagyis " + szo(helyes) + "."),
      naplo: { tipus: "tizesek", kerdes: keplet, helyes: helyes, atlepes: false }
    };
  }
};


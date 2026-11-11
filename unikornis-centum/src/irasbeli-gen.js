/* ============ 6j4b) ✍️ ÍRÁSBELI MŰVELETEK — a mondóka-gyártó (Garas tornya, 1. kör: 2026-11-09) ============
   Terv: terv/irasbeli-haz-recept-lap.html (⑥ recept, ⑦ hiányzó elem) · könyvek: OH-MAT03TB 157–161, 04TB 76–81 + 100–104,
   04TA, 04TC, 05TB 34–35 (memória: irasbeli-szorzas-osztas-palyak).
   Egy feladatból (a · b, a : b) kiszámolja a FÜZETLAPOT (fuzet.js), ahogy a tankönyv leírja:
     • kiosztás: sor, oszlop, E sz t e fejléc, a gép előre felírt része (a művelet, „B:”, a jelek)
     • célok: amit a gyereknek kell írnia — jegy a helyére (helyiérték!), pont, felső vessző, vonal; kell / szabadon hagyható (opc)
     • lépések: a tankönyvi sorrend; mindegyikhez a mondóka (m: a lapra írt rövid alak, h: amit a felolvasóhang mond)
       és a tallér-tálca mozdulatai (talca: elotte / muv / utana)
   Tananyag-szabály (recept-lap ②): szorzás jobbról, az egyesekkel; a tízeseknél a 0 leírása szabad (Kata: el is hagyható);
   a részletszorzatok sorrendje szabad (TC: a tízesekkel is lehet kezdeni) → csere-csoport; osztás balról: becslés → pontozás →
   felső vessző → hosszú forma; a 0 maradék leírása szabad (TB leírja). A mondóka HELYIÉRTÉK-NÉVVEL szól (11-08-i döntés).
   ⏭️ Később (2–3. kör): rövid forma, mellékszámítás (34·5 / 34·6), hiányos szorzás, hibakereső változat. */

var IR_HELY = [   /* helyiérték: rövid jel (a fejléc) · név · tárgyeset · „-ban/-ben” · „-sal/-sel” · többes szám (a mondóka teljes névvel szól) */
  { j: "e", n: "egyes", t: "egyest", ban: "egyesben", sal: "egyessel", ek: "egyesek", hoz: "egyesekhez", hoz1: "egyeshez" },
  { j: "t", n: "tízes", t: "tízest", ban: "tízesben", sal: "tízessel", ek: "tízesek", hoz: "tízesekhez", hoz1: "tízeshez" },
  { j: "sz", n: "százas", t: "százast", ban: "százasban", sal: "százassal", ek: "százasok", hoz: "százasokhoz", hoz1: "százashoz" },
  { j: "E", n: "ezres", t: "ezrest", ban: "ezresben", sal: "ezressel", ek: "ezresek", hoz: "ezresekhez", hoz1: "ezreshez" },
  { j: "tE", n: "tízezres", t: "tízezrest", ban: "tízezresben", sal: "tízezressel", ek: "tízezresek", hoz: "tízezresekhez", hoz1: "tízezreshez" },
  { j: "szE", n: "százezres", t: "százezrest", ban: "százezresben", sal: "százezressel", ek: "százezresek", hoz: "százezresekhez", hoz1: "százezreshez" }
];
/* névelő a szám elé, a kiejtés szerint: az 1, 5, 50, 500, 1000 („egy”, „öt”, „ötven”, „ezer”) — a 10, 100 elé „a” */
function irAz(n) { var s = String(n); return (s[0] === "5" || (s[0] === "1" && (s.length === 1 || s.length === 4 || s.length === 7))) ? "az" : "a"; }
function irNagy(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
/* a lapra írt mondóka → a kimondott: a jelek szóval, a rövid helyiérték-jel teljes névvel */
function irKimond(s) {
  return s.replace(/ · /g, " szorozva ").replace(/ : /g, " osztva ").replace(/ = /g, " az ").replace(/ − /g, " mínusz ")
    .replace(/ \+ /g, " meg ").replace(/ ≈ /g, " kerekítve ").replace(/ ≤ /g, " kisebb vagy egyenlő, mint ").replace(/ < /g, " kisebb, mint ");
}
function irJegyek(n) { return String(n).split("").map(Number); }
/* kerekítés a legnagyobb helyiértékre (a becsléshez: 156 ≈ 200, 92 ≈ 90; egyjegyű marad) */
function irKerekit(n) { if (n < 10) return n; var h = Math.pow(10, String(n).length - 1); return Math.round(n / h) * h; }

/* ── a lap-építő: minden generátor ezzel rakja össze a tervet ── */
function IrTerv(muv, a, b) {
  this.muv = muv; this.a = a; this.b = b;
  this.sor = 0; this.osz = 0; this.fej = []; this.gep = []; this.celok = []; this.mezok = []; this.lepesek = []; this.csere = [];
  this.lep = muv === "oszt" ? 1 : -1;
  this.kesobb = null;   /* ha szám: a gép ezt a részt csak ennél a lépésnél írja fel (az ellenőrzés váza ne álljon ott az elején) */   /* beírás után a ceruza merre lép (szorzás: balra, osztás: jobbra) */
}
IrTerv.prototype.hely = function (r, c) { if (r + 1 > this.sor) this.sor = r + 1; if (c + 1 > this.osz) this.osz = c + 1; };
/* a gép előre felírja — T.kesobb esetén csak attól a lépéstől (tip: "szam" jegyenként · "jel" egy kockában · "szoveg" kockákon átfolyó felirat) */
IrTerv.prototype.gepIr = function (r, c, s, tip) {
  var T = this; s = String(s);
  if (tip === "szoveg") { T.gep.push({ r: r, c: c, v: s, tip: "szoveg", lepes: T.kesobb }); T.hely(r, c); return; }
  s.split("").forEach(function (ch, i) { if (ch !== " ") { T.gep.push({ r: r, c: c + i, v: ch, tip: tip || (/\d/.test(ch) ? "szam" : "jel"), lepes: T.kesobb }); T.hely(r, c + i); } });
};
IrTerv.prototype.gepJobbra = function (r, cVeg, s, tip) { this.gepIr(r, cVeg - String(s).length + 1, s, tip); };
IrTerv.prototype.gepVonal = function (r, c0, c1) { this.gep.push({ r: r, c: c0, c1: c1, tip: "vonal", lepes: this.kesobb }); this.hely(r, c1); };
IrTerv.prototype.fejlec = function (r, cVeg, db) { for (var i = 0; i < db; i++) { this.fej.push({ r: r, c: cVeg - i, hely: i }); this.hely(r, cVeg - i); } };
/* új lépés: m = a lapra írt mondóka, h = kimondva (ha nincs, m-ből), fazis: becsles · pont · vesszo · szamol · ellenoriz
   k = a KÉRDÉS-alak: amit a lépés ELEJÉN mutat (1–2. asztal), az eredmény nélkül — a teljes mondóka csak a 2. hibától jön
   (a producer, 11-10: „nem lesz ott mindig a megoldás?”). Ha nincs megadva: a mondóka az első „=”-ig, utána „?”. */
IrTerv.prototype.lepes = function (m, fazis, h, k) {
  this.lepesek.push({ m: m, h: h || irKimond(m), k: k || irKerdesAlak(m), fazis: fazis || "szamol", celok: [], talca: null });
  return this.lepesek.length - 1;
};
function irKerdesAlak(m) { var i = m.indexOf(" = "); return i > 0 ? m.slice(0, i) + " = ?" : m; }
/* a mellékszámítás helye (5TB: 34 · 5, 34 · 6 a lap szélén): szabad terület, a füzet nem ellenőrzi */
IrTerv.prototype.szabadTer = function (r0, r1, c0, c1) { (this.szabad = this.szabad || []).push({ r0: r0, r1: r1, c0: c0, c1: c1 }); this.hely(r1, c1); };
IrTerv.prototype.cel = function (r, c, v, tip, o) {
  o = o || {};
  var k = this.lepesek.length - 1, x = { id: this.celok.length, r: r, c: c, v: v == null ? null : String(v), tip: tip || "szam", lepes: k,
    kell: o.kell !== undefined ? o.kell : (tip || "szam") === "szam", opc: !!o.opc, mezo: o.mezo == null ? null : o.mezo, auto: !!o.auto };
  if (o.c1 != null) x.c1 = o.c1;
  if (x.opc) x.kell = false;
  this.celok.push(x); if (k >= 0) this.lepesek[k].celok.push(x.id);
  this.hely(r, o.c1 != null ? o.c1 : c);
  return x;
};
/* egy szám jegyei balról jobbra (ahogy kézzel leírjuk), a végük a cVeg oszlopban */
IrTerv.prototype.celSzam = function (r, cVeg, n, o) {
  var s = String(n), T = this;
  var g = s.length > 1 ? (T.grpN = (T.grpN || 0) + 1) : null;   /* többjegyű szám: a ceruza az elejére ugrik, onnan jobbra (fuzet.js) */
  s.split("").forEach(function (ch, i) { var x = T.cel(r, cVeg - s.length + 1 + i, ch, "szam", o); if (g) x.grp = g; });
};
/* szabad helyű szám (becslés): a span bármely kockáiba írhatja, egybeolvasva kell egyezzen; a célok a javasolt helyek */
IrTerv.prototype.mezo = function (r, c0, c1, n, cVeg) {
  var id = this.mezok.length; this.mezok.push({ id: id, r: r, c0: c0, c1: c1, v: String(n) });
  this.celSzam(r, cVeg, n, { mezo: id }); this.hely(r, c1);
  return id;
};
IrTerv.prototype.talca = function (elotte, muv) {   /* az utolsó lépés tálca-mozdulatai; az „utana” állapotot kiszámolja */
  var u = irTalcaLep(elotte, muv);
  this.lepesek[this.lepesek.length - 1].talca = { elotte: irTalcaMasol(elotte), muv: muv, utana: u };
  return u;
};
function irTalcaMasol(t) { var o = {}; for (var k in t) o[k] = t[k]; return o; }
/* tálca-állapot: { 0: egyesek, 1: tízesek, 2: százasok, … } — a mozdulatok: köteg (10 → 1 balra), felvált (1 → 10 jobbra), hozzáad, elvesz */
function irTalcaLep(t, muv) {
  t = irTalcaMasol(t);
  (muv || []).forEach(function (m) {
    var p = m.p;
    if (m.t === "hozzaad") t[p] = (t[p] || 0) + m.n;
    else if (m.t === "elvesz") t[p] = (t[p] || 0) - m.n;
    else if (m.t === "koteg") { t[p] -= 10; t[p + 1] = (t[p + 1] || 0) + 1; }
    else if (m.t === "felvalt") { t[p] -= 1; t[p - 1] = (t[p - 1] || 0) + 10; }
  });
  return t;
}

/* ═════════════════ ✖️ ÍRÁSBELI SZORZÁS ═════════════════
   o: { becsles (alap: igen), ellenoriz (alap: igen — kétjegyű szorzónál a tényezők felcserélésével, egyjegyűnél ≤ 4-ig
   összeadással), talca (alap: egyjegyű szorzónál igen) } */
function irSzorzas(a, b, o) {
  o = o || {};
  var T = new IrTerv("szor", a, b), bd = irJegyek(b), m = bd.length, ered = a * b, W = String(ered).length, U = W;   /* U: az egyesek oszlopa */
  T.ered = ered; T.U = U;
  var r = 0;
  if (o.becsles !== false) {
    var ra = irKerekit(a), rb = m > 1 ? irKerekit(b) : b, bec = ra * rb, bh = String(bec).length;
    T.gepIr(r, 0, "B:", "szoveg");
    T.lepes("Becslés: " + a + " ≈ " + ra + (m > 1 ? ", " + b + " ≈ " + rb : "") + ", " + ra + " · " + rb + " = " + bec + ". Leírom: " + bec + ".", "becsles", null,
      "Becslés: kerekítsd " + (m > 1 ? "mindkét számot" : irAz(a) + " " + a + "-" + (/[1245790]$/.test(String(a)) ? "et" : "at")) + ", és szorozd össze! Írd a B: sorba.");
    T.mezo(r, 1, Math.max(U, bh) + 2 + m, bec, Math.max(U, bh));
    T.becsles = bec; r++;
  }
  T.fejlec(r, U, W); r++;
  var muvSor = r;
  T.gepJobbra(r, U, a); T.gepIr(r, U + 1, "·"); T.gepIr(r, U + 2, String(b));
  T.gepVonal(r, U - Math.max(String(a).length, 1) + 1, U + 1 + m); r++;
  T.muvSor = muvSor;
  var talca = o.talca !== undefined ? o.talca : m === 1;
  var reszSorok = irSzorzasReszek(T, a, bd, r, U, talca);
  r += m;
  if (m > 1) {
    T.csere.push(reszSorok);
    T.cel(r - 1, 0, "+", "jel", { auto: true, kell: false });
    T.lepes("Végül összeadom a részletszorzatokat. Előbb aláhúzom.", "szamol");
    T.cel(r - 1, 1, null, "vonal", { c1: U, kell: false });
    irOsszeadas(T, reszSorok.map(function (_, j) { return a * bd[m - 1 - j] * Math.pow(10, j); }), r, U);
    r++;
  }
  T.lepes("Kész: " + a + " · " + b + " = " + ered + ".", "szamol");
  if (o.ellenoriz !== false) {
    r++;
    if (m > 1) {   /* a tényezők felcserélésével (TA, TB): b · a, ugyanígy */
      T.kesobb = T.lepes("Ellenőrzés: felcserélem a tényezőket: " + b + " · " + a + ".", "ellenoriz");
      T.gepIr(r, 0, "ell.", "szoveg"); r++;
      var ad = irJegyek(a), n2 = ad.length, U2 = U;
      T.gepJobbra(r, U2, b); T.gepIr(r, U2 + 1, "·"); T.gepIr(r, U2 + 2, String(a)); T.gepVonal(r, U2 - String(b).length + 1, U2 + 1 + n2); r++;
      var rs2 = irSzorzasReszek(T, b, ad, r, U2, false, true); r += n2;
      if (n2 > 1) {
        T.csere.push(rs2);
        T.cel(r - 1, 0, "+", "jel", { auto: true, kell: false });
        T.lepes("Összeadom a részletszorzatokat.", "ellenoriz");
        T.cel(r - 1, 1, null, "vonal", { c1: U2, kell: false });
        irOsszeadas(T, rs2.map(function (_, j) { return b * ad[n2 - 1 - j] * Math.pow(10, j); }), r, U2, true);
        r++;
      }
      T.lepes("Ugyanannyi lett: " + ered + ". Jó a számolás.", "ellenoriz");
    } else if (b <= 4 && b >= 2) {   /* egyjegyű szorzó: összeadással (3TB, TA) */
      T.kesobb = T.lepes("Ellenőrzés összeadással: " + b + "-szer adom össze " + irAz(a) + " " + a + "-" + (/[1245790]$/.test(String(a)) ? "et" : "at") + ".", "ellenoriz");
      T.gepIr(r, 0, "ell.", "szoveg"); r++;
      for (var i = 0; i < b; i++) { T.gepJobbra(r, U, a); if (i === b - 1) { T.gepIr(r, 0, "+"); T.gepVonal(r, 1, U); } r++; }
      var tagok = []; for (i = 0; i < b; i++) tagok.push(a);
      irOsszeadas(T, tagok, r, U, true); r++;
      T.lepes("Ugyanannyi lett: " + ered + ". Jó a számolás.", "ellenoriz");
    }
  }
  T.hely(r - 1, 0);
  return T;
}
/* a részletszorzatok sorai (az egyesekkel kezdve); vissza: a sorok listája */
function irSzorzasReszek(T, a, bd, r0, U, talca, ell) {
  var m = bd.length, ad = irJegyek(a), n = ad.length, sorok = [], fazis = ell ? "ellenoriz" : "szamol";
  for (var j = 0; j < m; j++) {
    var d = bd[m - 1 - j], r = r0 + j, atv = 0, tal = talca && j === 0 ? {} : null;
    sorok.push(r);
    if (j > 0) {
      var nul = j === 1 ? "a 0-t" : j + " db 0-t", hol = j === 1 ? "az egyesek" : "az alsóbb helyiértékek";
      T.lepes("Most a " + d + " " + IR_HELY[j].sal + " szorzunk: " + hol + " helyére leírom " + nul + ", ez a tízszerezés jele.", fazis, null, "Most a " + d + " " + IR_HELY[j].sal + " szorzunk. Mi kerül " + hol + " helyére?");
      for (var z = 0; z < j; z++) T.cel(r, U - z, "0", "szam", { opc: true });
    }
    if (d === 0) { T.lepes("0-szor bármi 0: ebbe a sorba csupa 0 kerül.", fazis, null, "0-szor bármi mennyi?"); for (var q = 0; q < n; q++) T.cel(r, U - j - q, "0"); continue; }
    for (var i = 0; i < n; i++) {
      var ai = ad[n - 1 - i], p = i + j, x = ai * d + atv, utolso = i === n - 1, H = IR_HELY[i], Hk = IR_HELY[i + 1] || IR_HELY[i];
      var mm, hh, tiz = Math.floor(x / 10), egy = x % 10;
      if (j === 0) {   /* helyiérték-névvel (TB 76–77., TA): „4-szer 7 egyes = 28 egyes. Leírom a 8 egyest, a 2 tízest hozzáadom a tízesek szorzatához.” */
        mm = d + "-szer " + ai + " " + H.n + " = " + (ai * d) + " " + H.n + (atv ? ", meg " + atv + " " + H.n + " = " + x + " " + H.n : "") + ".";
        if (utolso && x >= 10) mm += " Leírom: " + tiz + " " + Hk.n + " és " + egy + " " + H.n + ".";
        else if (x >= 10) mm += " Leírom " + irAz(egy) + " " + egy + " " + H.t + ", " + irAz(tiz) + " " + tiz + " " + Hk.t + " hozzáadom a " + Hk.ek + " szorzatához.";
        else mm += " Leírom " + irAz(x) + " " + x + " " + H.t + ".";
      } else {         /* a tízessel szorzott sor: puszta számokkal (TC), a helyet a 0 már kijelölte */
        mm = d + "-szer " + ai + " = " + (ai * d) + (atv ? ", meg " + atv + " = " + x : "") + ".";
        if (utolso) mm += " Leírom " + irAz(x) + " " + x + "-" + (/[1245790]$/.test(String(x)) ? "et" : "at") + ".";
        else if (x >= 10) mm += " Leírom " + irAz(egy) + " " + egy + "-" + (/[1245790]$/.test(String(egy)) ? "et" : "at") + ", " + irAz(tiz) + " " + tiz + "-" + (/[1245790]$/.test(String(tiz)) ? "et" : "at") + " továbbviszem.";
        else mm += " Leírom.";
      }
      T.lepes(mm, fazis, null, d + "-szer " + ai + (j === 0 ? " " + H.n : "") + (atv ? ", meg " + atv + (j === 0 ? " " + H.n : "") : "") + " = ?");
      if (utolso) T.celSzam(r, U - p, x); else T.cel(r, U - p, egy);
      if (tal) {
        var muv = [{ t: "hozzaad", p: i, n: ai * d }];
        for (var k = 0; k < tiz; k++) muv.push({ t: "koteg", p: i });
        tal = T.talca(tal, muv);
      }
      atv = utolso ? 0 : Math.floor(x / 10);
    }
  }
  return sorok;
}
/* oszlopos összeadás a cVeg-hez igazítva (a részletszorzatok összege, ellenőrzés): jobbról, átvitellel, helyiérték-névvel */
function irOsszeadas(T, tagok, r, U, ell) {
  var ossz = tagok.reduce(function (s, x) { return s + x; }, 0), W = String(ossz).length, atv = 0;
  for (var p = 0; p < W; p++) {
    var jegyek = tagok.map(function (x) { return Math.floor(x / Math.pow(10, p)) % 10; }).filter(function (d, i) { return tagok[i] >= Math.pow(10, p); });
    var x = jegyek.reduce(function (s, d) { return s + d; }, 0) + atv, H = IR_HELY[p] || IR_HELY[0], Hk = IR_HELY[p + 1] || H, utolso = Math.pow(10, p + 1) > ossz;
    var tag = jegyek.join(" + ") + (atv ? " + " + atv : "");
    var tiz = Math.floor(x / 10), egy = x % 10, mm = tag + " = " + x + " " + H.n + ".";
    if (jegyek.length + (atv ? 1 : 0) <= 1) mm = "Leírom " + irAz(x) + " " + x + " " + H.t + ".";
    else if (utolso && x >= 10) mm += " Leírom: " + tiz + " " + Hk.n + " és " + egy + " " + H.n + ".";
    else if (x >= 10) mm += " Leírom " + irAz(egy) + " " + egy + " " + H.t + ", " + irAz(tiz) + " " + tiz + " " + Hk.t + " továbbviszem.";
    else mm += " Leírom.";
    T.lepes(mm, ell ? "ellenoriz" : "szamol", null, jegyek.length + (atv ? 1 : 0) <= 1 ? (jegyek.length ? "Ebben az oszlopban csak egy jegy van: írd le alá!" : "Ide az kerül, amit továbbvittél.") : tag + " = ?");
    if (utolso) T.celSzam(r, U - p, x); else T.cel(r, U - p, x % 10);
    atv = Math.floor(x / 10);
    if (utolso) break;
  }
}

/* ═════════════════ ➗ ÍRÁSBELI OSZTÁS (hosszú forma; o.rovid: „Röviden:”, a kivonás fejben) ═════════════════
   o: { becsles (alap: igen), pontoz (alap: igen), ellenoriz (alap: igen), talca (alap: egyjegyű osztónál igen),
        rovid (TA, TB „Röviden:”: a szorzat nem kerül le, csak a maradék), mellek (5TB: a lap jobb szélén szabad hely a 34 · 5 / 34 · 6-nak) } */
function irOsztas(a, b, o) {
  o = o || {};
  var T = new IrTerv("oszt", a, b), D = irJegyek(a), n = D.length, q = Math.floor(a / b), mar = a % b, qs = String(q), qn = qs.length, bs = String(b);
  T.ered = q; T.mar = mar; T.rovid = !!o.rovid;
  var cA = 1, cB = n + 2, cQ = n + 3 + bs.length;   /* az osztandó első jegye · az osztó · a hányados első jegye */
  var r = 0;
  if (o.becsles !== false) {
    var d1 = Number(qs[0]), h = Math.pow(10, qn - 1), also = d1 * h, felso = (d1 + 1) * h, ah = String(also).length, fh = String(felso).length;
    var kisebb = q === also ? "≤" : "<";
    T.gepIr(r, 0, "B:", "szoveg");
    var c = 1 + ah; T.gepIr(r, c, kisebb); T.gepIr(r, c + 1, "hányados", "szoveg"); T.gepIr(r, c + 4, "<");
    T.lepes("Becslés: " + (also * b) + " : " + b + " = " + also + ", " + (felso * b) + " : " + b + " = " + felso + ". A hányados " + also + " és " + felso + " között van: " + also + " " + kisebb + " hányados < " + felso + ".", "becsles", null,
      "Becslés: melyik két kerek szám közé esik a hányados? Szorozd vissza őket az osztóval!");
    T.mezo(r, 1, ah, also, ah);
    T.mezo(r, c + 5, c + 4 + fh, felso, c + 4 + fh);
    T.also = also; T.felso = felso; r++;
  }
  T.fejlec(r, cA + n - 1, n); T.fejlec(r, cQ + qn - 1, qn); r++;
  var R = r; T.muvSor = R;
  T.gepIr(R, cA, String(a)); T.gepIr(R, cA + n, ":"); T.gepIr(R, cB, bs); T.gepIr(R, cB + bs.length, "=");
  r++;
  /* hány jegyből indulunk */
  var k = 1, cur = D[0];
  while (cur < b && k < n) { cur = cur * 10 + D[k]; k++; }
  var hely = n - k, tal = (o.talca !== undefined ? o.talca : b < 10) ? {} : null;
  if (tal) { for (var i = 0; i < n; i++) tal[n - 1 - i] = D[i]; }
  if (o.pontoz !== false) {
    T.lepes("A hányados " + qn + " jegyű lesz: kipontozom a helyét.", "pont", null, "Hány jegyű lesz a hányados? Pontozd ki a helyét!");
    for (i = 0; i < qn; i++) T.cel(R, cQ + i, null, "pont", { kell: false });
  }
  var H = IR_HELY[hely];
  if (k > 1) {
    var elo = D.slice(0, k - 1).join(""), He = IR_HELY[hely + 1];
    T.lepes(irNagy(irAz(elo)) + " " + elo + " " + He.ban + " " + irAz(b) + " " + b + " nincs meg, ezért " + (k === 2 ? "két" : k + "") + " jegyből indulunk: " + cur + " " + H.n + ". Vesszőt teszek " + irAz(D[k - 1]) + " " + D[k - 1] + " fölé.", "vesszo", null,
      "Megvan " + irAz(b) + " " + b + " " + irAz(elo) + " " + elo + " " + He.ban + "? Hány jegyből indulunk? Tegyél vesszőt!");
    if (tal) tal = T.talca(tal, irFelvaltSor(hely + 1, D.slice(0, k - 1).join("")));
  } else T.lepes("Az első jegyből indulunk: " + cur + " " + H.n + ". Vesszőt teszek fölé.", "vesszo", null, "Hány jegyből indulunk? Tegyél vesszőt!");
  T.cel(R, cA + k - 1, null, "vesszo", { kell: false });
  if (o.mellek) {   /* 5TB 34–35.: melléírja a k és k+1 szorzatot — a lap jobb szélén, szabad hely (a füzet nem nézi) */
    var mc = cQ + qn + 1;
    T.gepIr(R + 1, mc, "mellék:", "szoveg");
    T.szabadTer(R + 2, R + 2 + 2 * (n - k + 1) + 1, mc, mc + bs.length + 5);
    T.mellek = { r: R + 2, c: mc };
  }
  var curRow = R, curEnd = cA + k - 1, qi = 0;
  for (var di = k - 1; di < n; di++) {
    hely = n - 1 - di; H = IR_HELY[hely];
    var qd = Math.floor(cur / b), prod = qd * b, rem = cur - prod, ps = String(prod);
    if (qd > 0 && T.rovid) {   /* TB 103.: „Röviden:” — a szorzat és a kivonás fejben, csak a maradék kerül le */
      T.lepes(cur + " " + H.n + " : " + b + " = " + qd + " " + H.n + ", mert " + qd + " · " + b + " = " + prod + ", " + cur + " − " + prod + " = " + rem + ". Leírom a maradékot: " + rem + " " + H.n + ".", "szamol", null,
        cur + " " + H.n + " : " + b + " = ? Mennyi marad? A maradékot írd alá!");
      T.cel(R, cQ + qi, qd);
      curRow = curRow + 1;
      if (rem === 0) T.cel(curRow, curEnd, "0", "szam", { opc: di < n - 1 });
      else T.celSzam(curRow, curEnd, rem);
      if (tal) tal = T.talca(tal, [{ t: "elvesz", p: hely, n: prod }]);
    } else if (qd > 0) {
      T.lepes(cur + " " + H.n + " : " + b + " = " + qd + " " + H.n + ", mert " + qd + " " + H.n + " · " + b + " = " + prod + " " + H.n + ".", "szamol");
      T.cel(R, cQ + qi, qd);
      T.lepes("Leírom alá " + irAz(prod) + " " + prod + " " + H.t + ", és kivonom: " + cur + " " + H.n + " − " + prod + " " + H.n + " = " + rem + " " + H.n + ". A maradék " + rem + " " + H.n + ".", "szamol", null,
        "Szorozd vissza: " + qd + " " + H.n + " · " + b + " = ? Írd alá, és vond ki!");
      var pr = curRow + 1;
      T.cel(pr, curEnd - ps.length, "−", "jel", { auto: true, kell: false });
      T.celSzam(pr, curEnd, prod);
      T.cel(pr, curEnd - ps.length + 1, null, "vonal", { c1: curEnd, kell: false });
      curRow = pr + 1;
      if (rem === 0) T.cel(curRow, curEnd, "0", "szam", { opc: di < n - 1 });   /* a 0 maradék leírása szabad — a végén a maradék kell */
      else T.celSzam(curRow, curEnd, rem);
      if (tal) tal = T.talca(tal, [{ t: "elvesz", p: hely, n: prod }]);
    } else {
      rem = cur;   /* ⚠️ (11-10) eddig itt a régi maradék maradt: 618 : 3-nál 18 helyett 8-cal számolt tovább */
      T.lepes(irNagy(irAz(cur)) + " " + cur + " " + H.ban + " " + irAz(b) + " " + b + " nincs meg, ezért a hányadosba 0 " + H.t + " írok. A maradék " + cur + " " + H.n + ".", "szamol", null,
        "Megvan " + irAz(b) + " " + b + " " + irAz(cur) + " " + cur + " " + H.ban + "? Mit írsz a hányadosba?");
      T.cel(R, cQ + qi, 0);
    }
    qi++;
    if (di < n - 1) {
      var kov = D[di + 1], Hl = IR_HELY[hely - 1], uj = rem * 10 + kov;
      T.lepes("Leírom " + irAz(rem) + " " + rem + " " + H.n + " mellé " + irAz(kov) + " " + kov + " " + Hl.t + ". " + rem + " " + H.n + " + " + kov + " " + Hl.n + " = " + uj + " " + Hl.n + ".", "szamol", null,
        "Hozd le a következő jegyet: írd a maradék mellé!");
      T.cel(curRow, curEnd + 1, kov);
      T.cel(R, cA + di + 1, null, "vesszo", { kell: false });
      if (tal) { var fv = []; for (var x = 0; x < rem; x++) fv.push({ t: "felvalt", p: hely }); tal = T.talca(tal, fv); }
      cur = uj; curEnd++;
    }
  }
  T.lepes("Kész: " + a + " : " + b + " = " + q + (mar ? ", a maradék " + mar : "") + "." + (mar ? " A maradék kisebb az osztónál." : ""), "szamol");
  if (o.ellenoriz !== false) {   /* hányados · osztó (+ maradék) = osztandó (TB: 23 · 7 + 2) */
    r = curRow + 2;
    var U = cA + n - 1, szor = q * b;
    T.kesobb = T.lepes("Ellenőrzés: " + q + " · " + b + " = " + szor + ".", "ellenoriz");
    T.gepIr(r, 0, "ell.", "szoveg"); r++;
    T.gepJobbra(r, U, q); T.gepIr(r, U + 1, "·"); T.gepIr(r, U + 2, bs); T.gepVonal(r, U - qs.length + 1, U + 1 + bs.length); r++;
    if (bs.length > 1 && qn > 1 && b % 10) {   /* (a kerek tízes osztónál egy sor: ·4, mögé a 0) kétjegyű · kétjegyű: írásban, részletszorzatokkal (mint a szorzás-pályán), aztán összeadás */
      var bd2 = irJegyek(b), rs = irSzorzasReszek(T, q, bd2, r, U, false, true); r += bd2.length;
      T.csere.push(rs);
      T.cel(r - 1, 0, "+", "jel", { auto: true, kell: false });
      T.lepes("Összeadom a részletszorzatokat.", "ellenoriz");
      T.cel(r - 1, 1, null, "vonal", { c1: U, kell: false });
      irOsszeadas(T, rs.map(function (_, j) { return q * bd2[bd2.length - 1 - j] * Math.pow(10, j); }), r, U, true); r++;
    } else { T.celSzam(r, U, szor); r++; }
    if (mar) {
      T.kesobb = T.lepes("Hozzáadom a maradékot: " + szor + " + " + mar + " = " + a + ".", "ellenoriz");
      T.gepIr(r, 0, "+"); T.gepJobbra(r, U, mar); T.gepVonal(r, 1, U); r++;
      T.celSzam(r, U, a); r++;
    }
    T.lepes("Visszakaptam az osztandót: " + a + ". Jó a számolás.", "ellenoriz");
    T.hely(r - 1, 0);
  }
  return T;
}
/* a két (több) jegyből indulás felváltásai: az elöl álló „nincs meg” jegyek lefelé, egészen a kezdő helyig */
function irFelvaltSor(fent, elo) {
  var muv = [], db = Number(elo), p = fent;
  /* elo pl. "1" az ezresen: 1 ezres → 10 százas */
  for (var i = 0; i < db; i++) muv.push({ t: "felvalt", p: p });
  return muv;
}

/* ═════════════════ ➕➖ ÍRÁSBELI ÖSSZEADÁS ÉS KIVONÁS (Déli vásár, 1. kör: 2026-11-11) ═════════════════
   Terv: terv/deli-vasar-fuzet-tervlap.html (② könyvek, ⑦ hiányzó elem; döntések: 1A pótlás, 2A a gyerek ír alá, 3A terv-sor).
   A lap sorai: [terv-sor] · [B: becslés] · E sz t e fejléc · a tagok (a GYEREK írja egymás alá: „ala” lépés tagonként) · vonal · eredmény.
   o: { terv (true: üres terv-sor, a füzet másolja bele a gyerek írását · szöveg: a gép írja, pl. bemutatásnál),
        becsles (alap: igen — százasra, 100 alatt tízesre: 4TA/4TC), talca (összeadásnál a köteg-átvitel; alap: igen) }
   Kivonás: PÓTLÁSSAL (3TB, 4TB, 4TC, 4TA Manó): „8 egyeshez, hogy 15 egyes legyen, kell 7 egyes…” — az elvétel jegyei ugyanazok,
   a segédjegyek (fuzet.js ¹) nem számítanak, így azt is elfogadja. A szám elején a 0-t nem írjuk ki (3TB: 1000 − 925 = 75). */
function irNev(s) { return (/^[aeiouáéíóöőúüű]/i.test(s) ? "az " : "a ") + s; }
function irLapFej(T, tagok, jel, o) {   /* terv-sor, becslés, fejléc, alá-írás; vissza: az eredmény sora */
  var U = T.U, W = T.W, r = 0;
  if (o.terv) { T.terv = { r: 0 }; if (typeof o.terv === "string") T.gepIr(0, 1, o.terv); r++; }
  if (o.becsles !== false) {
    var max = Math.max.apply(null, tagok), h = max < 100 ? 10 : 100, kt = tagok.map(function (n) { return Math.round(n / h) * h; });
    var bec = kt.slice(1).reduce(function (s, x) { return jel === "+" ? s + x : s - x; }, kt[0]), bs = String(bec).length, hn = h === 10 ? "tízesre" : "százasra";
    T.gepIr(r, 0, "B:", "szoveg");
    T.lepes("Becslés " + hn + ": " + tagok.map(function (n, i) { return n + " ≈ " + kt[i]; }).join(", ") + ". " + kt.join(" " + jel + " ") + " = " + bec + ". Leírom: " + bec + ".", "becsles", null,
      "Becslés: kerekítsd a számokat " + hn + ", és " + (jel === "+" ? "add össze" : "vond ki") + "! Írd a B: sorba.");
    T.mezo(r, 1, Math.max(U, bs) + 1, bec, Math.max(U, bs));
    T.becsles = bec; r++;
  }
  T.fejlec(r, U, W); r++;
  T.alaSorok = [];
  tagok.forEach(function (n, i) {
    var s = String(n), nev = irJegyek(n).map(function (d, j) { return d + " " + IR_HELY[s.length - 1 - j].n; }).join(", ");
    T.lepes("Leírom: " + n + ". " + nev + " — mindegyik a maga oszlopába, az egyesek az egyesek alá.", "ala", null,
      "Írd le a " + (i ? "következő " : "") + "számot: " + n + ". Az egyesek az egyesek alá!");
    T.celSzam(r, U, n);
    T.alaSorok.push(r);
    if (i === tagok.length - 1) { T.cel(r, 0, jel, "jel", { auto: true, kell: false }); T.cel(r, 1, null, "vonal", { c1: U, kell: false }); }
    r++;
  });
  return r;
}
function irOsszeadasLap(tagok, o) {
  o = o || {};
  var T = new IrTerv("ossz", tagok[0], tagok[1]), ered = tagok.reduce(function (s, x) { return s + x; }, 0);
  T.tagok = tagok.slice(); T.ered = ered; T.W = String(Math.max(ered, Math.max.apply(null, tagok))).length; T.U = T.W;
  var r = irLapFej(T, tagok, "+", o), U = T.U, atv = 0, tal = o.talca !== false ? {} : null;
  for (var p = 0; p < T.W; p++) {
    var jegyek = tagok.filter(function (x) { return x >= Math.pow(10, p); }).map(function (x) { return Math.floor(x / Math.pow(10, p)) % 10; });
    var sum = jegyek.reduce(function (s, d) { return s + d; }, 0), x = sum + atv, H = IR_HELY[p], Hk = IR_HELY[p + 1] || H, utolso = Math.pow(10, p + 1) > ered;
    var tag = jegyek.join(" + ") + (atv ? " + " + atv : ""), tiz = Math.floor(x / 10), egy = x % 10, db = jegyek.length + (atv ? 1 : 0), mm, kk;
    if (db <= 1) { mm = "Leírom " + irAz(x) + " " + x + " " + H.t + "."; kk = irNagy(H.ek) + ": " + (jegyek.length ? "itt csak egy jegy van. Mi kerül alá?" : "csak a továbbvitt szám. Mi kerül alá?"); }
    else {
      mm = tag + " = " + x + " " + H.n + (x >= 10 ? " = " + tiz + " " + Hk.n + " + " + egy + " " + H.n : "") + ".";
      if (utolso && x >= 10) mm += " Leírom: " + tiz + " " + Hk.n + " és " + egy + " " + H.n + ".";
      else if (x >= 10) mm += " Leírom " + irAz(egy) + " " + egy + " " + H.t + ", " + irAz(tiz) + " " + tiz + " " + Hk.t + " továbbviszem " + irNev(Hk.hoz) + ".";
      else mm += " Leírom.";
      kk = irNagy(H.ek) + ": " + tag + " = ?";
    }
    T.lepes(mm, "szamol", null, kk);
    if (utolso) T.celSzam(r, U - p, x); else T.cel(r, U - p, egy);
    if (tal) { var muv = [{ t: "hozzaad", p: p, n: sum }]; for (var k = 0; k < tiz && !utolso; k++) muv.push({ t: "koteg", p: p }); tal = T.talca(tal, muv); }
    atv = tiz;
    if (utolso) break;
  }
  T.lepes("Kész: " + tagok.join(" + ") + " = " + ered + ".", "szamol");
  T.hely(r, 0);
  return T;
}
function irKivonasLap(a, b, o) {
  o = o || {};
  var T = new IrTerv("kiv", a, b), ered = a - b;
  T.tagok = [a, b]; T.ered = ered; T.W = String(a).length; T.U = T.W;
  var r = irLapFej(T, [a, b], "−", o), U = T.U, atv = 0;
  for (var p = 0; p < T.W; p++) {
    var ap = Math.floor(a / Math.pow(10, p)) % 10, bp = b >= Math.pow(10, p) ? Math.floor(b / Math.pow(10, p)) % 10 : null;
    var H = IR_HELY[p], Hk = IR_HELY[p + 1] || H, L = (bp || 0) + atv, d, mm, kk, eleje = p > 0 && Math.pow(10, p) > ered;
    var lki = bp != null && atv ? bp + " + " + atv : String(L);
    if (bp == null && !atv) {
      d = ap; mm = "Itt alul nincs semmi: leírom " + irAz(ap) + " " + ap + " " + H.t + ".";
      kk = irNagy(H.ek) + ": alul nincs semmi. Mi kerül alá?";
    } else {
      var cel = L <= ap ? ap : ap + 10; d = cel - L;
      mm = (bp != null && atv ? bp + " + " + atv + " = " + L + " " + H.n + ". " : "") + L + " " + H.hoz1 + ", hogy " + cel + " " + H.n + " legyen, kell " + d + " " + H.n + ".";
      mm += eleje && d === 0 ? " A szám elejére 0-t nem írunk." : " Leírom " + irAz(d) + " " + d + " " + H.t + (cel > 9 ? "," : ".");
      if (cel > 9) mm += (eleje && d === 0 ? " Az" : " az") + " 1 " + Hk.t + " hozzáadom a kivonandóban " + irNev(Hk.hoz) + ".";
      kk = irNagy(H.ek) + ": alul " + lki + ", fent " + ap + ". Mennyi kell még?";
      atv = cel > 9 ? 1 : 0;
    }
    T.lepes(mm, "szamol", null, kk);
    if (eleje && d === 0) T.cel(r, U - p, "0", "szam", { opc: true });
    else T.cel(r, U - p, d);
  }
  T.lepes("Kész: " + a + " − " + b + " = " + ered + ".", "szamol");
  T.hely(r, 0);
  return T;
}
/* a TERV-SOR (fuzet.js): üres sor, a gyerek írja a tervet jellel (3845 + 2850 =); o.ered: fejben számolt lépés — az eredmény az = után */
function irTervLap(o) {
  o = o || {};
  var T = new IrTerv("terv", 0, 0);
  T.terv = { r: 0, nyitott: o.ered == null }; T.lep = 1;
  T.hely(0, (o.osz || 16) - 1);
  if (o.ered != null) {
    T.ered = o.ered; T.tervEredCel = true;
    T.lepes("Fejben: " + o.ered + ".", "szamol", null, "Számold ki fejben, és írd az = után!");
    T.celSzam(0, o.eredC + String(o.ered).length - 1, o.ered);
  }
  return T;
}

/* egy helyen hívható gyártó: muv "szor" | "oszt" (a, b) · "ossz" (a: a tagok listája) · "kiv" (a, b) */
function irGyart(muv, a, b, o) {
  if (muv === "ossz") return irOsszeadasLap(a, o);
  if (muv === "kiv") return irKivonasLap(a, b, o);
  return muv === "oszt" ? irOsztas(a, b, o) : irSzorzas(a, b, o);
}

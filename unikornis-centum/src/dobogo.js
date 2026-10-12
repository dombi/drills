/* ============ 6o) 🏆 DOBOGÓ — a 📌 KOTOTT válaszformája: a szereplőket koppintással a helyükre rakja ============
   Rajz: Matekos\szerszam-letrak-rajzterv.html 4. pont (✅ 2026-10-09) + tartalom-lap 8/2 (kétsoros dobogó ✅)
   + dobogó-javítás (Matekos\szerszam-letrak-dobogo-javitas.html, ✅ 2026-10-10).
   BÁRKI BÁRHOVA, BÁRMILYEN SORRENDBEN (producer): a gyerek a kötött szereplővel kezdhet, bárhol is van a helye.
     KÉT KOPPINTÁS: szereplő → „kézbe veszi” (felemelkedik) → hely → oda kerül. Fordítva is: üres hely → szereplő.
     Felrakott szereplőre koppintva kézbe veszi: másik helyre koppintva átteszi (ha ott áll valaki, helyet cserélnek),
     a tálra koppintva visszateszi. Üres helyek bárhol maradhatnak. Kétsoros táblán (zöldség / sport) a darab csak a saját
     sorába mehet — rossz sorra koppintva a hely csak finoman megrázkódik. Húzás nincs: laptopon, tableten, telefonon ugyanígy.
   EGY KÉPEN: ha a feladat az olvasópult könyvében van, a kirakó maga a könyv JOBB LAPJA (a rajz = a kirakó); a könyv alatt
   egyetlen sáv: a tál (a még fel nem rakott szereplők) + 🙋 · ↺ · Kész. Könyv nélkül a kirakó a sáv fölé kerül.
   A mese-keret szerint más a rajz, a működés ugyanaz (egy közös elem, öt rajz):
     (🔮 Kristálygömb: a dobogó, a sor és a polc is lehet kétsoros — a pár a szereplő alatt / mellett, zöld hellyel)
     dobogo  verseny: 3 helynél dobogó (2–1–3), 4–5 helynél lépcsősor
     sor     sorban állás (fagyis pult / vacsoratálak): az 1. hely a pultnál
     polc    könyvespolc: polcok fentről lefelé
     haz     emeletes ház: emeletek alulról felfelé (haz2: emeletenként két hely, pl. barát + sport)
     tabla   táblázat: oszlop-fejlécek (pl. magasságok), soronként egy darab-fajta (gyerek, zöldség)
   A feladat (f.dob) = { keret, n, cimkek: [html…], sorok: [ { nev, darabok: [ { id, nev, kep } ] } ], jo: [ [id…] soronként ] }
   Az ellenőrzést (jó / rossz) a feladat gazdája végzi: dobogoMutat(f, { kesz(jo, allas), segit(menu) }) — a szerszam-palya.js.
   Rossz válasznál nincs piros: a jó helyen állók maradnak, a többiek visszaugranak (dobogoVisszaRossz).
   📋 NYOMOZÓTÁBLA (o.tabla, nyomozotabla.js — rajzterv: Matekos\nyomozotabla-rajzterv.html ✅ 2026-10-11):
     EGY ÁLLÁS, KÉT NÉZET: a DOB.hely a tábla ✓-einek forrása is. A tábla a könyv mellé kerül (#nt-oszlop; 1100 px fölött
     jobbra, alatta a könyv alá, telefonon minden egymás alá). Ilyenkor nincs külön tál: aki még nincs a helyén, az a rajz
     alján vár (dob-varo: fű / járda / szőnyeg), a helyek mellett annyi kis ✗, ahány szereplőt a táblában kizártak (R4),
     és a szereplők átsétálnak a helyükre (dobSetal). Rossz válasznál senki nem ugrik vissza: a hibás mondat szereplőjének
     kockája rózsaszín keretet kap (dobogoHibaJelol). */

var DOB = null;     /* { f, o, hely: [[id|null]…] soronként, zar, kez: {r,id,honnan}|null, cel: {r,i}|null, uj: {r,i}|null, razo, nt: bool } */
/* a tábla fejlécei keretenként (rajzterv 3. pont): oszlop = hely, a rajz sorrendjében (0-tól);
   ki(X, i, n): a bagoly mondata, amikor egy ✓ után kihúzza a sort és az oszlopot (3. döntés: kimondja, miért) */
function dobAz(i) { return i === 0 || i === 4 ? "az " : "a "; }                /* „az 1.”, „az 5.”, „a 2.” */
var DOB_NT = {
  dobogo: { cim: "Ki hányadik lett?", osz: function (i) { return (i + 1) + "."; },
            ki: function (X, i) { return "Ha " + X + " " + (i + 1) + ". lett, más helyezést nem kaphatott, és " + (i + 1) + ". más nem lehetett."; } },
  sor:    { cim: "Ki hányadik a sorban?", osz: function (i, n, D) { return i ? (i + 1) + "." : '<span class="nt-pult">' + (D.pult || "🍦") + '</span>1.'; },
            ki: function (X, i) { return "Ha " + X + " " + (i + 1) + ". a sorban, máshol nem állhat, és ott más nem állhat."; } },
  polc:   { cim: "Ki melyik polcon ül?", osz: function (i, n) { return i === 0 ? "fent" : i === n - 1 ? "lent" : n === 3 ? "közép" : (i + 1) + "."; },
            ki: function (X, i, n) { return "Ha " + X + " " + (i === 0 ? "a legfelső" : i === n - 1 ? "a legalsó" : n === 3 ? "a középső" : "fentről " + dobAz(i) + (i + 1) + ".") + " polcon ül, máshol nem ülhet, és ott más nem ülhet."; } },
  haz:    { cim: "Ki hol lakik?", osz: function (i) { return (i + 1) + ". em."; },
            ki: function (X, i) { return "Ha " + X + " " + dobAz(i) + (i + 1) + ". emeleten lakik, máshol nem lakhat, és ott más nem lakhat."; } },
  tabla:  { cim: "Ki hol?", osz: function (i, n, D) { return (D.cimkek || [])[i] || (i + 1) + "."; },
            ki: function (X, i, n, D) { return "Ha " + X + " helye " + ((D.cimkek || [])[i] || (i + 1) + ".") + ", máshol nem lehet, és ott más nem lehet."; } }
};
DOB_NT.haz2 = DOB_NT.haz;

function dobPanel() {
  var p = $("dobogo-panel");
  if (!p) {
    p = el("div", "dobogo-panel"); p.id = "dobogo-panel";
    var v = $("vj-hely"); v.parentNode.insertBefore(p, v.nextSibling);   /* a visszajelzés olvasópult-módban a bagoly buborékában van (opBagsor) */
    p.addEventListener("click", dobKatt);
  }
  return p;
}
/* a könyv jobb lapja, ha a feladat az olvasópultban van — ide kerül a kirakó */
function dobKonyvLap() {
  var j = document.querySelector("#buborek-feladat .op-jobb");
  if (j && !j.__dob) { j.__dob = true; j.addEventListener("click", dobKatt); }
  return j;
}
function dobogoRejt() {
  var p = $("dobogo-panel"); if (p) { p.hidden = true; p.innerHTML = ""; }
  ntRejt(); var k = $("kepernyo-jatek"); if (k) k.classList.remove("nt-mod");
  DOB = null;
}
function dobDarab(D, r, id) { var L = D.sorok[r].darabok; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
function dobToken(d, r, hol) {
  var kez = DOB.kez && DOB.kez.r === r && DOB.kez.id === d.id;
  return '<button type="button" class="dob-d' + (hol ? " bent" : "") + (kez ? " kez" : "") + '" data-r="' + r + '" data-id="' + htmlVed(d.id) + '"' +
    (kez ? ' aria-pressed="true"' : '') + '><span class="dob-kep">' + d.kep + '</span><span class="dob-nev">' + d.nev + '</span></button>';
}
/* egy hely: data-r (sor), data-i (sorszám); benne a szereplő vagy egy halvány üres jel (az is koppintható) */
function dobHely(r, i, cimke, extra) {
  var id = DOB.hely[r][i], d = id != null ? dobDarab(DOB.f.dob, r, id) : null, c = extra ? " " + extra : "";
  if (DOB.cel && DOB.cel.r === r && DOB.cel.i === i) c += " cel";
  else if (DOB.kez && DOB.kez.r === r && DOB.kez.honnan !== i) c += " var";     /* ide teheti, ami a kezében van */
  if (DOB.uj && DOB.uj.r === r && DOB.uj.i === i) c += " dob-uj";
  if (DOB.razo && DOB.razo.r === r && DOB.razo.i === i) c += " dob-razo";
  var xdb = DOB.nt && r === 0 ? Math.min(ntXDb(i), 4) : 0, xek = "";        /* 📋 R4: minden kizárt szereplőért egy egyforma kis ✗ */
  if (xdb) { xek = '<span class="dob-xek" aria-hidden="true">'; for (var x = 0; x < xdb; x++) xek += '<i>✗</i>'; xek += '</span>'; }
  return '<div class="dob-h' + (d ? " teli" : "") + c + '" data-r="' + r + '" data-i="' + i + '">' +
    (d ? dobToken(d, r, true) : '<button type="button" class="dob-ures" aria-label="üres hely">?</button>') +
    (cimke != null ? '<span class="dob-cimke">' + cimke + '</span>' : '') + xek + '</div>';
}
function dobTerRajz() {
  var D = DOB.f.dob, n = D.n, h = "", r, i;
  var C = D.cimkek || [];
  if (D.keret === "dobogo") {
    var sor = n === 3 ? [1, 0, 2] : Array.apply(null, { length: n }).map(function (x, j) { return j; });
    h = '<div class="dob-dobogo n' + n + '">' + sor.map(function (j) {
      var mag = n === 3 ? [3, 2, 1][j] : n - j;
      return '<div class="dob-fok" style="--m:' + mag + '">' + dobHely(0, j, null) + (D.sorok.length > 1 ? dobHely(1, j, null, "dob-attr") : "") +
        '<div class="dob-kocka"><b>' + (j + 1) + '.</b></div></div>';
    }).join("") + '</div>';
  } else if (D.keret === "sor") {
    h = '<div class="dob-sor"><div class="dob-pult">' + (D.pult || "🍦") + '</div>' +
      Array.apply(null, { length: n }).map(function (x, j) {
        return D.sorok.length > 1 ? '<div class="dob-oszlop">' + dobHely(0, j, null) + dobHely(1, j, (j + 1) + ".", "dob-attr") + '</div>' : dobHely(0, j, (j + 1) + ".");
      }).join("") + '</div>';
  } else if (D.keret === "polc") {
    h = '<div class="dob-polc">' + Array.apply(null, { length: n }).map(function (x, j) {
      return '<div class="dob-polcsor"><span class="dob-oldal">' + (j === 0 ? "fent" : j === n - 1 ? "lent" : "") + '</span>' + dobHely(0, j, null) + (D.sorok.length > 1 ? dobHely(1, j, null, "dob-attr") : "") + '</div>';
    }).join("") + '</div>';
  } else if (D.keret === "haz" || D.keret === "haz2") {
    var em = [];
    for (i = n - 1; i >= 0; i--) {
      var b = '<div class="dob-emelet"><span class="dob-emszam">' + (i + 1) + '.</span>';
      for (r = 0; r < D.sorok.length; r++) b += dobHely(r, i, null, r ? "dob-attr" : "");
      em.push(b + '<span class="dob-ablak"></span></div>');
    }
    h = '<div class="dob-haz' + (D.sorok.length > 1 ? " ket" : "") + '"><div class="dob-teto"></div>' + em.join("") + '<div class="dob-fold"></div></div>';
  } else {                                                     /* tabla */
    h = '<div class="dob-tabla" style="--n:' + n + '"><div class="dob-tfej">' + C.map(function (c) { return '<span>' + c + '</span>'; }).join("") + '</div>';
    for (r = 0; r < D.sorok.length; r++) {
      h += '<div class="dob-tsor">';
      for (i = 0; i < n; i++) h += dobHely(r, i, null, r ? "dob-attr" : "");
      h += '</div>';
    }
    h += '</div>';
  }
  return '<div class="dob-ter k-' + D.keret + (D.sorok.length > 1 ? " ket" : "") + (DOB.nt ? " nt" : "") + '">' + h + (DOB.nt ? dobTalak(" dob-varo") : "") + '</div>';
}
/* a még fel nem rakott szereplők (soronként külön tál); ha egy üres hely ki van jelölve, az ő soruk tála „vár”.
   📋 táblás feladatnál ez a rajz alja (a várakozók a füvön / a járdán / a szőnyegen), nem külön sáv. */
function dobTalak(extra) {
  var D = DOB.f.dob, tal = "", r;
  for (r = 0; r < D.sorok.length; r++) {
    var kint = D.sorok[r].darabok.filter(function (d) { return DOB.hely[r].indexOf(d.id) < 0; });
    var varo = (DOB.cel && DOB.cel.r === r) || (DOB.kez && DOB.kez.r === r && DOB.kez.honnan != null);
    tal += '<div class="dob-tal' + (extra || "") + (r ? " dob-attr" : "") + (varo ? " var" : "") + '" data-r="' + r + '">' + (D.sorok.length > 1 && D.sorok[r].nev ? '<span class="dob-talnev">' + D.sorok[r].nev + '</span>' : '') +
      (kint.length ? kint.map(function (d) { return dobToken(d, r, false); }).join("") : (extra ? '' : '<span class="dob-mind">✓</span>')) + '</div>';
  }
  return tal;
}
function dobRajz() {
  var p = $("dobogo-panel"); if (!p || !DOB) return;
  var D = DOB.f.dob;
  if (DOB.nt) ntEgyeztet();                                    /* 📋 előbb a tábla igazodik az álláshoz (R3, 🦉 kihúzás), utána rajzol minden */
  var tal = DOB.nt ? "" : dobTalak(), elotte = DOB.nt ? dobHolVan() : null;
  var gomb = '<div class="dob-gombok">' +
    (DOB.o.segit ? '<button type="button" class="kis-gomb dob-segit" data-g="segit">🙋 Segítség</button>' : '') +
    '<button type="button" class="kis-gomb dob-ujra" data-g="ujra">↺ Újra</button>' +
    '<button type="button" class="nagy-gomb kiemelt dob-kesz" data-g="kesz">Kész! ✓</button></div>';
  var lap = dobKonyvLap(), ter = dobTerRajz();
  if (!p.querySelector(".dob-also"))                          /* a váz egyszer készül: a 🙋 menü (és a gombjai) megmarad */
    p.innerHTML = '<div class="dob-kulon"></div><div class="dob-also"></div><div class="dob-segitmenu" hidden></div>';
  if (lap) { lap.innerHTML = ter; lap.classList.add("dob-lap"); lap.classList.toggle("zar", !!DOB.zar); }
  var ku = p.querySelector(".dob-kulon"); ku.innerHTML = lap ? "" : ter; ku.hidden = !!lap;
  var also = p.querySelector(".dob-also");
  also.innerHTML = (tal ? '<div class="dob-talak">' + tal + '</div>' : '') + gomb;
  also.classList.toggle("ket", D.sorok.length > 1);           /* két tál (gyerek + zöldség): tömörebb, hogy egy sorba férjen a gombokkal */
  p.classList.toggle("zar", !!DOB.zar);
  if (DOB.nt) { ntRajz(); dobSetal(elotte); }
  DOB.uj = null; DOB.razo = null;
}
/* 🚶 a szereplők átsétálnak az új helyükre (újrarajzolás után a régi helyükről indulnak: FLIP) — csak táblás feladatnál */
function dobHolVan() {
  var H = {};
  Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .dob-d, #dobogo-panel .dob-d"), function (b) {
    var k = b.getAttribute("data-r") + "|" + b.getAttribute("data-id"), q = b.getBoundingClientRect(); if (q.width) H[k] = q;
  });
  return H;
}
function dobSetal(elotte) {
  if (!elotte) return;
  var lassu = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  Array.prototype.forEach.call(document.querySelectorAll("#buborek-feladat .dob-d, #dobogo-panel .dob-d"), function (b) {
    var a = elotte[b.getAttribute("data-r") + "|" + b.getAttribute("data-id")]; if (!a || !lassu) return;
    var q = b.getBoundingClientRect(), dx = a.left - q.left, dy = a.top - q.top;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
    b.parentNode.classList.remove("dob-uj");
    b.style.transition = "none"; b.style.transform = "translate(" + dx + "px," + dy + "px)"; b.classList.add("setal");
    void b.offsetWidth;
    b.style.transition = ""; b.style.transform = "";
    setTimeout(function () { b.classList.remove("setal"); }, 900);
  });
}
/* o = { kesz: function (jo, allas) {}, segit: function (menu) {} | null,
         tabla: { auto: bool, cim?: html, mondat?: function (nev, oszlop) → szöveg, rejtve?: bool } | null — 📋 Nyomozótábla } */
function dobogoMutat(f, o) {
  var D = f.dob;
  ntRejt();
  DOB = { f: f, o: o || {}, zar: false, kez: null, cel: null, uj: null, razo: null, nt: false,
    hely: D.sorok.map(function () { var a = []; for (var i = 0; i < D.n; i++) a.push(null); return a; }) };
  var p = dobPanel();
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  p.hidden = false; p.innerHTML = "";
  if (DOB.o.tabla) dobNtIndul(DOB.o.tabla);
  var k = $("kepernyo-jatek"); if (k) k.classList.toggle("nt-mod", DOB.nt);
  dobRajz();
}
/* 📋 a tábla a „Ki hol?” sorra (0. sor). A kétsoros „Ki mit?” tábla a 3. kód-kör. */
function dobNtIndul(t) {
  var D = DOB.f.dob, S = D.sorok[0].darabok, F = DOB_NT[D.keret] || DOB_NT.tabla, hova = $("nt-oszlop");
  if (!hova) {
    hova = el("div", "nt-oszlop"); hova.id = "nt-oszlop";
    var jt = document.querySelector("#kepernyo-jatek .jatekter"), bub = $("bagoly-buborek");
    jt.insertBefore(hova, bub.nextSibling);                       /* könyv → tábla → bagoly → gombok */
  }
  DOB.nt = true;
  ntUj({ hova: hova, cim: t.cim || F.cim, auto: !!t.auto, rejtve: !!t.rejtve,
    sorok: S.map(function (d) { return { id: d.id, nev: d.nev, kep: d.kep }; }),
    oszlopok: Array.apply(null, { length: D.n }).map(function (x, i) { return F.osz(i, D.n, D); }),
    hol: function (r) { return DOB.hely[0].indexOf(S[r].id); },
    tesz: function (r, c) { dobNtTesz(S[r].id, c); },
    levesz: function (r) { var j = DOB.hely[0].indexOf(S[r].id); if (j >= 0) DOB.hely[0][j] = null; DOB.kez = null; DOB.cel = null; dobRajz(); },
    valt: function () { dobRajz(); },
    mondat: function (r, c) { return t.mondat ? t.mondat(S[r].nev, c) : F.ki(S[r].nev, c, D.n, D) + " Ezeket kihúztam."; } });
}
/* a táblából: id a c. helyre; aki ott állt, visszamegy a várakozók közé (tervlap 4. pont) */
function dobNtTesz(id, c) {
  var s = DOB.hely[0], j = s.indexOf(id);
  if (j >= 0) s[j] = null;
  s[c] = id; DOB.kez = null; DOB.cel = null;
  dobRajz();
}
/* Kész után, rossz válasznál (táblás feladat): senki nem ugrik vissza, a hibás mondat szereplőjének kockája kap keretet */
function dobogoHibaJelol(id) {
  if (!DOB || !DOB.nt) return;
  DOB.kez = null; DOB.cel = null;
  dobRajz(); ntHiba(dobNtSor(id));
}
function dobTeli() { return DOB.hely.every(function (s) { return s.every(function (x) { return x != null; }); }); }
function dobJoE() {
  var J0 = DOB.f.dob.jo;
  return DOB.hely.every(function (s, r) { return s.every(function (x, i) { return x === J0[r][i]; }); });
}
/* a jó helyen állók maradnak, a többiek visszaugranak; visszaadja, hány ugrott vissza */
function dobogoVisszaRossz() {
  var J0 = DOB.f.dob.jo, db = 0;
  DOB.kez = null; DOB.cel = null;
  DOB.hely.forEach(function (s, r) { s.forEach(function (x, i) { if (x != null && x !== J0[r][i]) { s[i] = null; db++; } }); });
  dobRajz();
  return db;
}
/* a gyerek elrendezése a feladat-ellenőrzőknek: A.s[r] = az r. sor helyei; A.hol(id) = hányadik helyen van (0-tól) */
function dobAllas() {
  var H = DOB.hely.map(function (s) { return s.slice(); });
  return { s: H, hol: function (id) { for (var r = 0; r < H.length; r++) { var i = H[r].indexOf(id); if (i >= 0) return i; } return -1; },
           attr: function (id) { var i = H[0].indexOf(id); return i >= 0 && H[1] ? H[1][i] : null; },
           kie: function (a) { var i = H[1] ? H[1].indexOf(a) : -1; return i >= 0 ? H[0][i] : null; } };
}
/* a végigvezetés: a bagoly maga teszi a helyére (a hívó adja a sorrendet) */
function dobogoTesz(r, i, id) {
  if (!DOB) return;
  var s = DOB.hely[r], j = s.indexOf(id);
  if (j >= 0) s[j] = null;
  s[i] = id; DOB.kez = null; DOB.cel = null; DOB.uj = { r: r, i: i };
  if (DOB.nt && r === 0) NT.uj[dobNtSor(id) + "," + i] = 1;    /* 📋 a bagoly ✓-e egyszer sárgán felvillan */
  dobRajz();
}
/* 📋 a végigvezetés tábla nyelven (szerszam-palya.js szVegigFut): id sorának és oszlopának kihúzása · egy ✗ */
function dobNtSor(id) { var r = -1; DOB.f.dob.sorok[0].darabok.forEach(function (d, i) { if (d.id === id) r = i; }); return r; }
function dobogoNtKihuz(id) { if (DOB && DOB.nt) { ntKihuz(dobNtSor(id)); dobRajz(); } }
function dobogoNtX(id, i) { if (DOB && DOB.nt) { ntX(dobNtSor(id), i); dobRajz(); } }
function dobogoZar(z) {
  if (!DOB) return;
  DOB.zar = !!z; DOB.kez = null; DOB.cel = null;
  if (DOB.nt) NT.zar = !!z;
  dobRajz();
}
function dobogoUrit() { if (!DOB) return; DOB.kez = null; DOB.cel = null; DOB.hely.forEach(function (s) { for (var i = 0; i < s.length; i++) s[i] = null; }); if (DOB.nt) ntUrit(); dobRajz(); }

/* ── koppintások ── */
/* id letétele az r. sor i. helyére. honnan: ha egy másik helyről jön, az ott állóval helyet cserél;
   ha a tálból jön, az ott álló visszamegy a tálba. */
function dobLetesz(r, i, id, honnan) {
  var s = DOB.hely[r], regi = s[i];
  if (honnan != null) s[honnan] = regi === id ? null : regi;
  s[i] = id;
  DOB.uj = { r: r, i: i };
}
function dobHelyKatt(r, i) {
  var K = DOB.kez, bent = DOB.hely[r][i];
  if (K) {
    if (K.r !== r) { DOB.razo = { r: r, i: i }; return; }           /* zöldség a gyerek-sorba: nem megy */
    if (K.honnan !== i) dobLetesz(r, i, K.id, K.honnan);
    DOB.kez = null;
  } else if (bent != null) { DOB.kez = { r: r, id: bent, honnan: i }; DOB.cel = null; }
  else DOB.cel = DOB.cel && DOB.cel.r === r && DOB.cel.i === i ? null : { r: r, i: i };
}
function dobTalKatt(r, id) {
  if (DOB.cel && DOB.cel.r === r) { dobLetesz(r, DOB.cel.i, id, null); DOB.cel = null; DOB.kez = null; return; }
  DOB.kez = DOB.kez && DOB.kez.id === id && DOB.kez.r === r ? null : { r: r, id: id, honnan: null };
  DOB.cel = null;
}
function dobKatt(ev) {
  if (!DOB) return;
  var t = ev.target.closest ? ev.target.closest("button, .dob-h, .dob-tal") : null; if (!t) return;
  var g = t.getAttribute("data-g");
  if (g === "segit") { hangGomb(); if (DOB.o.segit) DOB.o.segit($("dobogo-panel").querySelector(".dob-segitmenu")); return; }
  if (DOB.zar || !g && t.closest(".dob-segitmenu")) return;
  if (g === "ujra") { hangGomb(); dobogoUrit(); return; }
  if (g === "kesz") {
    hangGomb();
    if (!dobTeli()) { var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "Előbb tedd mindenkit a helyére!"; mondd("Előbb tedd mindenkit a helyére!"); return; }
    DOB.kez = null; DOB.cel = null;
    if (DOB.o.kesz) DOB.o.kesz(dobJoE(), dobAllas());
    return;
  }
  var hely = ev.target.closest(".dob-h"), tal = ev.target.closest(".dob-tal");
  if (hely) dobHelyKatt(+hely.getAttribute("data-r"), +hely.getAttribute("data-i"));
  else if (t.classList.contains("dob-d")) dobTalKatt(+t.getAttribute("data-r"), t.getAttribute("data-id"));
  else if (tal) {                                              /* a tál üres részére: a kézben lévőt visszateszi */
    var K = DOB.kez;
    if (K && K.honnan != null && K.r === +tal.getAttribute("data-r")) DOB.hely[K.r][K.honnan] = null;
    DOB.kez = null;
  } else return;
  hangGomb();
  $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
  dobRajz();
}

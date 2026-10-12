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
     kockája rózsaszín keretet kap (dobogoHibaJelol).
   📋 EGY KÖZÖS TÁBLA, KÉT SÁV (rajzterv: Matekos
yomozotabla-egytabla-rajzterv.html, ✅ K1–K3, 2026-10-12): fent a nevek,
     alattuk a 🏠 hely-sáv (DOB.ntHol: szereplő × hely) és a ⚽ pár-sáv (DOB.ntMit: szereplő × pár) — a kétsoros feladatnál
     (🔮 Kristálygömb, 🏅 szendvics / emeletek) mindkettő, a csak-pár feladatnál (🔮 1. fajta, D.csak) csak a pár-sáv.
     A hely-sáv sorai a rajzzal egy irányban mennek (K3: a ház legfelső emelete fent).
     A PÁR A SZEREPLŐHÖZ TARTOZIK: ha a szereplő máshová kerül (táblából vagy a rajzon), a párja vele megy (dobParok →
     dobParIgazit); aki még vár, a kezében tartja (DOB.fog). Üres helyre is tehető pár (R2): azé lesz, aki odaköltözik — ha az
     már hoz magával egyet, a hely párja visszakerül a többi közé. A pár-sáv ✗-e csak a táblában látszik, a rajzon nem. */

var DOB = null;     /* { f, o, hely: [[id|null]…] soronként, zar, kez: {r,id,honnan}|null, cel: {r,i}|null, uj: {r,i}|null, razo, nt: bool,
                       ntHol / ntMit: a hely- / pár-sáv (nyomozotabla.js) | null, fog: { szereplő: pár } (aki még vár, kézben tartja) } */
/* a hely-sáv keretenként: cim = a sáv címe (kérdés, a nevekre: „Hol lakik?”), osz = a sáv sorai (a helyek, 0-tól);
   fordit: a sorok a rajz irányában (K3: a ház legfelső emelete fent);
   ki(X, i, n): a bagoly mondata, amikor egy ✓ után kihúzza a sort és az oszlopot (3. döntés: kimondja, miért) */
function dobAz(i) { return i === 0 || i === 4 ? "az " : "a "; }                /* „az 1.”, „az 5.”, „a 2.” */
var DOB_NT = {
  dobogo: { cim: "🏁 Hányadik lett?", osz: function (i) { return (i + 1) + "."; },
            ki: function (X, i) { return "Ha " + X + " " + (i + 1) + ". lett, más helyezést nem kaphatott, és " + (i + 1) + ". más nem lehetett."; } },
  sor:    { cim: "🧍 Hányadik a sorban?", osz: function (i, n, D) { return i ? (i + 1) + "." : '<span class="nt-pult">' + (D.pult || "🍦") + '</span>1.'; },
            ki: function (X, i) { return "Ha " + X + " " + (i + 1) + ". a sorban, máshol nem állhat, és ott más nem állhat."; } },
  polc:   { cim: "📚 Melyik polcon ül?", osz: function (i, n) { return i === 0 ? "fent" : i === n - 1 ? "lent" : n === 3 ? "közép" : (i + 1) + "."; },
            ki: function (X, i, n) { return "Ha " + X + " " + (i === 0 ? "a legfelső" : i === n - 1 ? "a legalsó" : n === 3 ? "a középső" : "fentről " + dobAz(i) + (i + 1) + ".") + " polcon ül, máshol nem ülhet, és ott más nem ülhet."; } },
  haz:    { cim: "🏠 Hol lakik?", fordit: true, osz: function (i) { return (i + 1) + ". em."; },
            ki: function (X, i) { return "Ha " + X + " " + dobAz(i) + (i + 1) + ". emeleten lakik, máshol nem lakhat, és ott más nem lakhat."; } },
  tabla:  { cim: "📍 Hol a helye?", osz: function (i, n, D) { return (D.cimkek || [])[i] || (i + 1) + "."; },
            ki: function (X, i, n, D) { return "Ha " + X + " helye " + ((D.cimkek || [])[i] || (i + 1) + ".") + ", máshol nem lehet, és ott más nem lehet."; } }
};
DOB_NT.haz2 = DOB_NT.haz;
/* a pár-sáv címe a pár fajtája szerint (D.sorok[…].nev) — 🖊️ lektorra */
var DOB_NT_PAR = { "nyakörv": "🏷️ Milyen a nyakörve?", "fagyi": "🍨 Milyen fagyit kér?", "kezében": "🎈 Mi van a kezében?",
  "sport": "⚽ Mit sportol?", "zöldség": "🥪 Mit eszik?" };

/* 📋 a tábla fölötti súgó-sor (próbacsapat 4., 🟡2: a bemutató mondat a kérdés-keresés mellett elsikkadt) — 🖊️ lektorra */
var DOB_NT_SUGO = '<span class="nt-si">1 koppintás: <span class="nt-sk x">✗</span> ide nem</span><span class="nt-si">2 koppintás: <span class="nt-sk v">✓</span> ide kerül</span>';

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
  dobNtRejt();
  DOB = null;
}
function dobNtRejt() {
  ntRejt();
  var lap = document.querySelector("#buborek-feladat .op-jobb"); if (lap) lap.style.minHeight = "";
  var o = $("nt-oszlop"); if (o) { o.hidden = true; o.innerHTML = ""; }
  var k = $("kepernyo-jatek"); if (k) k.classList.remove("nt-mod", "nt-ket");
}
function dobDarab(D, r, id) { var L = D.sorok[r].darabok; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
function dobToken(d, r, hol) {
  var kez = DOB.kez && DOB.kez.r === r && DOB.kez.id === d.id;
  var fog = !hol && r === 0 && DOB.fog[d.id] != null ? dobDarab(DOB.f.dob, 1, DOB.fog[d.id]) : null;   /* 📋 aki vár, a párját a kezében tartja */
  return '<button type="button" class="dob-d' + (hol ? " bent" : "") + (kez ? " kez" : "") + (fog ? " fog" : "") + '" data-r="' + r + '" data-id="' + htmlVed(d.id) + '"' +
    (kez ? ' aria-pressed="true"' : '') + '><span class="dob-kep">' + d.kep + '</span><span class="dob-nev">' + d.nev + '</span>' +
    (fog ? '<span class="dob-fog" aria-label="' + htmlVed(fog.nev) + '">' + fog.kep + '</span>' : '') + '</button>';
}
/* egy hely: data-r (sor), data-i (sorszám); benne a szereplő vagy egy halvány üres jel (az is koppintható) */
function dobHely(r, i, cimke, extra) {
  var id = DOB.hely[r][i], d = id != null ? dobDarab(DOB.f.dob, r, id) : null, c = extra ? " " + extra : "";
  if (DOB.cel && DOB.cel.r === r && DOB.cel.i === i) c += " cel";
  else if (DOB.kez && DOB.kez.r === r && DOB.kez.honnan !== i) c += " var";     /* ide teheti, ami a kezében van */
  if (DOB.uj && DOB.uj.r === r && DOB.uj.i === i) c += " dob-uj";
  if (DOB.razo && DOB.razo.r === r && DOB.razo.i === i) c += " dob-razo";
  var xdb = DOB.ntHol && r === 0 ? Math.min(ntXDb(i, DOB.ntHol), 4) : 0, xek = "";   /* 📋 R4: minden kizárt szereplőért egy egyforma kis ✗ (csak a hely-sáv) */
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
    var kint = D.sorok[r].darabok.filter(function (d) { return DOB.hely[r].indexOf(d.id) < 0 && !(r === 1 && dobFogja(d.id)); });
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
  if (lap) { lap.innerHTML = ter; lap.classList.add("dob-lap"); lap.classList.toggle("zar", !!DOB.zar); if (DOB.nt) dobLapMagas(lap); }
  var ku = p.querySelector(".dob-kulon"); ku.innerHTML = lap ? "" : ter; ku.hidden = !!lap;
  var also = p.querySelector(".dob-also");
  also.innerHTML = (tal ? '<div class="dob-talak">' + tal + '</div>' : '') + gomb;
  also.classList.toggle("ket", D.sorok.length > 1);           /* két tál (gyerek + zöldség): tömörebb, hogy egy sorba férjen a gombokkal */
  p.classList.toggle("zar", !!DOB.zar);
  if (DOB.nt) { ntRajz(); dobSetal(elotte); }
  DOB.uj = null; DOB.razo = null;
}
/* 📋 próbacsapat 4. (🟡7): ahogy a várakozók a helyükre sétálnak, a rajz alja (a várakozók sora) összemehetne, és a könyv
   alatti / melletti tábla elcsúszna a gyerek ujja alól. Ezért a lap csak nőhet egy feladaton belül (méretváltáskor újramér). */
function dobLapMagas(lap) {
  var sz = window.innerWidth + "x" + window.innerHeight;
  if (DOB.lapSz !== sz) { DOB.lapSz = sz; DOB.lapMin = 0; lap.style.minHeight = ""; }
  var h = lap.offsetHeight;
  if (h > (DOB.lapMin || 0)) DOB.lapMin = h;
  lap.style.minHeight = DOB.lapMin + "px";
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
/* o = { kesz: function (jo, allas) {}, segit: function (menu) {} | null, zarKatt?: function () (zárt kirakóra / táblára koppintott),
         tabla: { auto: bool, cim?: html, mondat?: function (nev, oszlop) → szöveg, rejtve?: bool, sugo?: html } | null — 📋 Nyomozótábla } */
function dobogoMutat(f, o) {
  var D = f.dob;
  dobNtRejt();
  DOB = { f: f, o: o || {}, zar: false, kez: null, cel: null, uj: null, razo: null, nt: false, ntHol: null, ntMit: null, fog: {},
    hely: D.sorok.map(function () { var a = []; for (var i = 0; i < D.n; i++) a.push(null); return a; }) };
  var p = dobPanel();
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  p.hidden = false; p.innerHTML = "";
  if (DOB.o.tabla) dobNtIndul(DOB.o.tabla);
  var k = $("kepernyo-jatek"); if (k) { k.classList.toggle("nt-mod", DOB.nt); k.classList.toggle("nt-ket", !!(DOB.ntHol && DOB.ntMit)); }
  dobRajz();
}
/* 📋 a közös tábla: hely-sáv (0. sor: szereplő × hely) és / vagy pár-sáv (szereplő × pár: kétsoros feladat 1. sora, vagy a csak-pár
   feladat egyetlen sora, ahol a helyek maguk a szereplők — D.csak). Mindkét sáv ugyanabba az elembe kerül: egy tábla, fent a nevek.
   t.auto: a bagoly húz ki (a 📋 fok első 2 feladata, a 🛗 kicsik). */
function dobNtIndul(t) {
  var D = DOB.f.dob, F = DOB_NT[D.keret] || DOB_NT.tabla, oszlop = $("nt-oszlop");
  if (!oszlop) {
    oszlop = el("div", "nt-oszlop"); oszlop.id = "nt-oszlop";
    var jt = document.querySelector("#kepernyo-jatek .jatekter"), bub = $("bagoly-buborek");
    jt.insertBefore(oszlop, bub.nextSibling);                     /* könyv → tábla → bagoly → gombok */
  }
  oszlop.hidden = false; oszlop.innerHTML = "";
  var csak = !!D.csak, ket = !csak && D.sorok.length > 1;
  var S = csak ? D.csak : D.sorok[0].darabok, A = csak ? D.sorok[0].darabok : ket ? D.sorok[1].darabok : null;
  var sorok = S.map(function (d) { return { id: d.id, nev: d.nev, kep: d.kep }; });
  var hova = el("div", "nt-egy"); oszlop.appendChild(hova);
  DOB.nt = true;
  var zk = DOB.o.zarKatt || null, sugo = t.sugo ? DOB_NT_SUGO : "";
  if (!csak) DOB.ntHol = ntUj({ hova: hova, cim: t.cim || D.ntCim || F.cim, sav: "hely", fordit: !!F.fordit, auto: !!t.auto, rejtve: !!t.rejtve, sorok: sorok, zarKatt: zk, sugo: sugo,
    oszlopok: Array.apply(null, { length: D.n }).map(function (x, i) { return F.osz(i, D.n, D); }),
    hol: function (r) { return DOB.hely[0].indexOf(S[r].id); },
    tesz: function (r, c) { dobNtTesz(S[r].id, c); },
    levesz: function (r) { var P = dobParok(), j = DOB.hely[0].indexOf(S[r].id); if (j >= 0) DOB.hely[0][j] = null; dobParIgazit(P); DOB.kez = null; DOB.cel = null; dobRajz(); },
    valt: function () { dobRajz(); },
    mondat: function (r, c) { return t.mondat ? t.mondat(S[r].nev, c) : F.ki(S[r].nev, c, D.n, D) + " Ezeket kihúztam."; } });
  if (A) DOB.ntMit = ntUj({ hova: hova, cim: DOB_NT_PAR[D.sorok[csak ? 0 : 1].nev] || "🔗 Mi az övé?", sav: "par", auto: !!t.auto, rejtve: !!t.rejtve, sorok: sorok, zarKatt: zk, sugo: csak ? sugo : "",
    oszlopok: A.map(function (a) { return '<span class="nt-okep">' + a.kep + '</span><span class="nt-onev">' + a.nev + '</span>'; }),
    hol: function (r) { var a = dobParja(S[r].id); return a == null ? -1 : dobAIdx(a); },
    tesz: function (r, c) { dobNtParTesz(S[r].id, A[c].id); },
    levesz: function (r) { dobNtParTesz(S[r].id, null); },
    valt: function () { dobRajz(); },
    mondat: function (r) { return "Ha ez " + S[r].nev + " párja, neki más nem jut, és ez másé nem lehet. Ezeket kihúztam."; } });   /* 🖊️ lektorra */
}
/* ── a pár a szereplőhöz tartozik (két táblánál) ── */
function dobParSor() { return DOB.f.dob.csak ? 0 : 1; }
function dobAIdx(a) { var L = DOB.f.dob.sorok[dobParSor()].darabok; for (var i = 0; i < L.length; i++) if (L[i].id === a) return i; return -1; }
function dobFogja(a) { for (var k in DOB.fog) if (DOB.fog[k] === a) return k; return null; }
function dobCsakIdx(id) { var k = -1; DOB.f.dob.csak.forEach(function (d, i) { if (d.id === id) k = i; }); return k; }
/* a szereplő párja: csak-pár feladatnál az ő oszlopa; kétsorosnál a helye alatti pár, vagy ami a kezében van */
function dobParja(id) {
  var D = DOB.f.dob;
  if (D.csak) { var k = dobCsakIdx(id); return k >= 0 ? DOB.hely[0][k] : null; }
  var i = DOB.hely[0].indexOf(id);
  return i >= 0 ? DOB.hely[1][i] : DOB.fog[id] != null ? DOB.fog[id] : null;
}
/* kié a pár (a pár-sáv oszlopa): a hely szereplője, vagy aki a kezében tartja */
function dobParGazda(a) {
  var D = DOB.f.dob;
  if (D.csak) { var j = DOB.hely[0].indexOf(a); return j >= 0 ? D.csak[j].id : null; }
  var i = DOB.hely[1].indexOf(a);
  return i >= 0 ? DOB.hely[0][i] : dobFogja(a);
}
function dobParok() {
  if (!DOB.ntMit || DOB.f.dob.csak) return null;
  var P = {};
  DOB.f.dob.sorok[0].darabok.forEach(function (d) { var a = dobParja(d.id); if (a != null) P[d.id] = a; });
  return P;
}
/* a szereplők mozgása után: mindenki párja vele megy; a gazdátlan pár a helyén marad, ha senki nem hoz magával másikat */
function dobParIgazit(P) {
  if (!P) return;
  var H0 = DOB.hely[0], H1 = DOB.hely[1], uj = H1.map(function () { return null; }), van = {}, fog = {}, i;
  DOB.f.dob.sorok[0].darabok.forEach(function (d) {
    var a = P[d.id]; if (a == null) return;
    var j = H0.indexOf(d.id);
    if (j >= 0) uj[j] = a; else fog[d.id] = a;
    van[a] = 1;
  });
  for (i = 0; i < H1.length; i++) if (uj[i] == null && H1[i] != null && !van[H1[i]]) { uj[i] = H1[i]; van[H1[i]] = 1; }
  for (i = 0; i < H1.length; i++) H1[i] = uj[i];
  DOB.fog = fog;
}
/* a pár-sávból: a pár (a) a szereplőé (id) lesz — a == null: elveszi tőle. A pár onnan jön, ahol eddig volt;
   ami a szereplőnél volt, visszakerül a többi közé. */
function dobNtParTesz(id, a) {
  var D = DOB.f.dob, s = DOB.hely[dobParSor()], j;
  if (a != null) { j = s.indexOf(a); if (j >= 0) s[j] = null; var g = dobFogja(a); if (g != null) delete DOB.fog[g]; }
  if (D.csak) { var k = dobCsakIdx(id); if (k >= 0) s[k] = a; }
  else {
    var i = DOB.hely[0].indexOf(id);
    if (i >= 0) s[i] = a;
    else if (a != null) DOB.fog[id] = a; else delete DOB.fog[id];
  }
  DOB.kez = null; DOB.cel = null;
  dobRajz();
}
/* a táblából: id a c. helyre; aki ott állt, visszamegy a várakozók közé (tervlap 4. pont) — a párjaik velük mennek */
function dobNtTesz(id, c) {
  var P = dobParok(), s = DOB.hely[0], j = s.indexOf(id);
  if (j >= 0) s[j] = null;
  s[c] = id; DOB.kez = null; DOB.cel = null;
  dobParIgazit(P);
  dobRajz();
}
/* Kész után, rossz válasznál (táblás feladat): senki nem ugrik vissza, a hibás mondat szereplőjének kockája kap keretet */
function dobogoHibaJelol(id, tab) {
  if (!DOB || !DOB.nt) return;
  DOB.kez = null; DOB.cel = null;
  dobRajz();
  var r = dobNtSor(id);                                         /* tab: 1 = a hely mondata · 2 = a páré · 3 = mindkettőé (összekötő) */
  if (DOB.ntHol) ntHiba(tab === 2 ? -1 : r, DOB.ntHol);
  if (DOB.ntMit) ntHiba(tab === 2 || tab === 3 || !DOB.ntHol ? r : -1, DOB.ntMit);
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
  var P = r === 0 ? dobParok() : null, s = DOB.hely[r], j = s.indexOf(id);
  if (j >= 0) s[j] = null;
  if (DOB.ntMit && r === dobParSor()) { var g = dobFogja(id); if (g != null) delete DOB.fog[g]; }
  s[i] = id; DOB.kez = null; DOB.cel = null; DOB.uj = { r: r, i: i };
  dobParIgazit(P);
  dobNtVillan(r, id);                                           /* 📋 a bagoly ✓-e egyszer sárgán felvillan */
  dobRajz();
}
function dobNtVillan(r, id) {
  if (!DOB || !DOB.nt) return;
  var D = DOB.f.dob, gazda = DOB.ntMit && r === dobParSor() ? dobParGazda(id) : id;
  if (r === 0 && !D.csak && DOB.ntHol) { var c = DOB.hely[0].indexOf(id); if (c >= 0) DOB.ntHol.uj[dobNtSor(id) + "," + c] = 1; }
  if (DOB.ntMit && gazda != null) { var a = dobParja(gazda), rm = dobNtSor(gazda); if (a != null && rm >= 0) DOB.ntMit.uj[rm + "," + dobAIdx(a)] = 1; }
}
/* 📋 a végigvezetés tábla nyelven (szerszam-palya.js szVegigFut): id sorának és oszlopának kihúzása · egy ✗ ·
   dobogoNtKihuzTesz: egy bagoly-✓ után a hozzá tartozó kihúzás mindkét sávban (a 🔮/🏅 végigvezetése) ·
   dobogoNtXPar: egy ✗ a pár-sávban („Gergő nem úszik.”) */
function dobNtSor(id) { var D = DOB.f.dob, L = D.csak || D.sorok[0].darabok, r = -1; L.forEach(function (d, i) { if (d.id === id) r = i; }); return r; }
function dobogoNtKihuz(id) { if (DOB && DOB.ntHol) { ntKihuz(dobNtSor(id), DOB.ntHol); dobRajz(); } }
function dobogoNtX(id, i) { if (DOB && DOB.ntHol) { ntX(dobNtSor(id), i, DOB.ntHol); dobRajz(); } }
function dobogoNtKihuzTesz(r, id) {
  if (!DOB || !DOB.nt) return;
  var gazda = DOB.ntMit && r === dobParSor() ? dobParGazda(id) : id;
  if (r === 0 && !DOB.f.dob.csak && DOB.ntHol) ntKihuz(dobNtSor(id), DOB.ntHol);
  if (DOB.ntMit && gazda != null) ntKihuz(dobNtSor(gazda), DOB.ntMit);
  dobRajz();
}
function dobogoNtXPar(id, a) { if (DOB && DOB.ntMit) { var c = dobAIdx(a); if (c >= 0) ntX(dobNtSor(id), c, DOB.ntMit); dobRajz(); } }
function dobogoZar(z) {
  if (!DOB) return;
  DOB.zar = !!z; DOB.kez = null; DOB.cel = null;
  if (DOB.nt) ntMind(function (T) { T.zar = !!z; });
  dobRajz();
}
function dobogoUrit() { if (!DOB) return; DOB.kez = null; DOB.cel = null; DOB.fog = {}; DOB.hely.forEach(function (s) { for (var i = 0; i < s.length; i++) s[i] = null; }); if (DOB.nt) ntUrit(); dobRajz(); }

/* ── koppintások ── */
/* id letétele az r. sor i. helyére. honnan: ha egy másik helyről jön, az ott állóval helyet cserél;
   ha a tálból jön, az ott álló visszamegy a tálba. */
function dobLetesz(r, i, id, honnan) {
  var P = r === 0 ? dobParok() : null, s = DOB.hely[r], regi = s[i];
  if (honnan != null) s[honnan] = regi === id ? null : regi;
  s[i] = id;
  dobParIgazit(P);
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
  var t = ev.target.closest ? ev.target.closest("button, .dob-h, .dob-tal") : null;
  var g = t ? t.getAttribute("data-g") : null;
  if (g === "segit") { hangGomb(); if (DOB.o.segit) DOB.o.segit($("dobogo-panel").querySelector(".dob-segitmenu")); return; }
  if (DOB.zar) { if (DOB.o.zarKatt && !(ev.target.closest && ev.target.closest(".dob-segitmenu"))) DOB.o.zarKatt(); return; }   /* 🟡1: a zár ne legyen néma */
  if (!t || !g && t.closest(".dob-segitmenu")) return;
  if (g === "ujra") { hangGomb(); dobogoUrit(); return; }
  if (g === "kesz") {
    hangGomb();
    if (!dobTeli()) { var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "Előbb tedd mindenkit a helyére!"; mondd("Előbb tedd mindenkit a helyére!"); return; }
    DOB.kez = null; DOB.cel = null;
    var kulcs = JSON.stringify(DOB.hely), most = Date.now();   /* 📋 táblánál senki nem ugrik vissza: a gyors dupla koppintás ne számítson két próbának */
    if (DOB.nt && DOB.keszKulcs === kulcs && most - DOB.keszIdo < 2000) return;
    DOB.keszKulcs = kulcs; DOB.keszIdo = most;
    if (DOB.o.kesz) DOB.o.kesz(dobJoE(), dobAllas());
    return;
  }
  var hely = ev.target.closest(".dob-h"), tal = ev.target.closest(".dob-tal");
  if (hely) dobHelyKatt(+hely.getAttribute("data-r"), +hely.getAttribute("data-i"));
  else if (t.classList.contains("dob-d")) dobTalKatt(+t.getAttribute("data-r"), t.getAttribute("data-id"));
  else if (tal) {                                              /* a tál üres részére: a kézben lévőt visszateszi */
    var K = DOB.kez;
    if (K && K.honnan != null && K.r === +tal.getAttribute("data-r")) { var P = K.r === 0 ? dobParok() : null; DOB.hely[K.r][K.honnan] = null; dobParIgazit(P); }
    DOB.kez = null;
  } else return;
  hangGomb();
  $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
  dobRajz();
}

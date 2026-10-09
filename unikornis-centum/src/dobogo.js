/* ============ 6o) 🏆 DOBOGÓ — a 📌 KOTOTT válaszformája: a szereplőket koppintással sorba rakja ============
   Rajz: Matekos\szerszam-letrak-rajzterv.html 4. pont (✅ 2026-10-09) + tartalom-lap 8/2 (kétsoros dobogó ✅).
   KOPPINTÁS, nem húzás: a szereplőre koppintva a következő üres helyre ugrik (a helyek SORSZÁM szerint telnek: 1. → 2. → 3.);
   egy felrakott szereplőre koppintva visszajön. Laptopon, tableten, telefonon ugyanígy megy.
   A mese-keret szerint más a rajz, a működés ugyanaz (egy közös elem, öt rajz):
     dobogo  verseny: 3 helynél dobogó (2–1–3), 4–5 helynél lépcsősor
     sor     sorban állás (fagyis pult / vacsoratálak): az 1. hely a pultnál
     polc    könyvespolc: polcok fentről lefelé
     haz     emeletes ház: emeletek alulról felfelé (haz2: emeletenként két hely, pl. barát + sport)
     tabla   táblázat: oszlop-fejlécek (pl. magasságok), soronként egy darab-fajta (gyerek, zöldség)
   A feladat (f.dob) = { keret, n, cimkek: [html…], sorok: [ { nev, darabok: [ { id, nev, kep } ] } ], jo: [ [id…] soronként ] }
   Az ellenőrzést (jó / rossz) a feladat gazdája végzi: dobogoMutat(f, { kesz(jo, rosszak), segit }) — a szerszam-palya.js.
   Rossz válasznál nincs piros: a jó helyen állók maradnak, a többiek visszaugranak (dobogoVisszaRossz). */

var DOB = null;     /* { f, hely: [[id|null]…] soronként, zar, h } */

function dobPanel() {
  var p = $("dobogo-panel");
  if (!p) {
    p = el("div", "dobogo-panel"); p.id = "dobogo-panel";
    var v = $("visszajelzes"); v.parentNode.insertBefore(p, v.nextSibling);
    p.addEventListener("click", dobKatt);
  }
  return p;
}
function dobogoRejt() { var p = $("dobogo-panel"); if (p) { p.hidden = true; p.innerHTML = ""; } DOB = null; }
function dobDarab(D, r, id) { var L = D.sorok[r].darabok; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
function dobToken(d, r, hol) {
  return '<button type="button" class="dob-d' + (hol ? " bent" : "") + '" data-r="' + r + '" data-id="' + htmlVed(d.id) + '">' +
    '<span class="dob-kep">' + d.kep + '</span><span class="dob-nev">' + d.nev + '</span></button>';
}
/* egy hely: data-r (sor), data-i (sorszám); benne a szereplő vagy egy halvány üres jel */
function dobHely(r, i, cimke, extra) {
  var id = DOB.hely[r][i], d = id != null ? dobDarab(DOB.f.dob, r, id) : null;
  return '<div class="dob-h' + (d ? " teli" : "") + (extra ? " " + extra : "") + '" data-r="' + r + '" data-i="' + i + '">' +
    (d ? dobToken(d, r, true) : '<span class="dob-ures">?</span>') + (cimke != null ? '<span class="dob-cimke">' + cimke + '</span>' : '') + '</div>';
}
function dobRajz() {
  var p = $("dobogo-panel"); if (!p || !DOB) return;
  var D = DOB.f.dob, n = D.n, h = "", r, i;
  var C = D.cimkek || [];
  if (D.keret === "dobogo") {
    var sor = n === 3 ? [1, 0, 2] : Array.apply(null, { length: n }).map(function (x, j) { return j; });
    h = '<div class="dob-dobogo n' + n + '">' + sor.map(function (j) {
      var mag = n === 3 ? [3, 2, 1][j] : n - j;
      return '<div class="dob-fok" style="--m:' + mag + '">' + dobHely(0, j, null) + '<div class="dob-kocka"><b>' + (j + 1) + '.</b></div></div>';
    }).join("") + '</div>';
  } else if (D.keret === "sor") {
    h = '<div class="dob-sor"><div class="dob-pult">' + (D.pult || "🍦") + '</div>' +
      Array.apply(null, { length: n }).map(function (x, j) { return dobHely(0, j, (j + 1) + "."); }).join("") + '</div>';
  } else if (D.keret === "polc") {
    h = '<div class="dob-polc">' + Array.apply(null, { length: n }).map(function (x, j) {
      return '<div class="dob-polcsor"><span class="dob-oldal">' + (j === 0 ? "fent" : j === n - 1 ? "lent" : "") + '</span>' + dobHely(0, j, null) + '<div class="dob-deszka"></div></div>';
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
  /* a még fel nem rakott szereplők (soronként külön tál) */
  var tal = "";
  for (r = 0; r < D.sorok.length; r++) {
    var kint = D.sorok[r].darabok.filter(function (d) { return DOB.hely[r].indexOf(d.id) < 0; });
    tal += '<div class="dob-tal' + (r ? " dob-attr" : "") + '">' + (D.sorok.length > 1 && D.sorok[r].nev ? '<span class="dob-talnev">' + D.sorok[r].nev + '</span>' : '') +
      (kint.length ? kint.map(function (d) { return dobToken(d, r, false); }).join("") : '<span class="dob-mind">✓</span>') + '</div>';
  }
  var gomb = '<div class="dob-gombok">' +
    (DOB.o.segit ? '<button type="button" class="kis-gomb dob-segit" data-g="segit">🙋 Segítség</button>' : '') +
    '<button type="button" class="kis-gomb dob-ujra" data-g="ujra">↺ Újra</button>' +
    '<button type="button" class="nagy-gomb kiemelt dob-kesz" data-g="kesz">Kész! ✓</button></div>' +
    '<div class="dob-segitmenu" hidden></div>';
  p.innerHTML = '<div class="dob-fo"><div class="dob-ter k-' + D.keret + '">' + h + '</div><div class="dob-talak">' + tal + '</div></div>' + gomb;   /* széles kijelzőn a tál a dobogó mellett */
  p.classList.toggle("zar", !!DOB.zar);
}
/* o = { kesz: function (jo, rosszak) {}, segit: function (menu) {} | null } */
function dobogoMutat(f, o) {
  var D = f.dob;
  DOB = { f: f, o: o || {}, zar: false, hely: D.sorok.map(function () { var a = []; for (var i = 0; i < D.n; i++) a.push(null); return a; }) };
  var p = dobPanel();
  $("valasz-egyenkent").classList.add("koppint");
  $("beiro-doboz").hidden = true; $("szambillentyuzet").hidden = true; $("hallgat-e").hidden = true;
  p.hidden = false;
  dobRajz();
}
function dobTeli() { return DOB.hely.every(function (s) { return s.every(function (x) { return x != null; }); }); }
function dobJoE() {
  var J0 = DOB.f.dob.jo;
  return DOB.hely.every(function (s, r) { return s.every(function (x, i) { return x === J0[r][i]; }); });
}
/* a jó helyen állók maradnak, a többiek visszaugranak; visszaadja, hány ugrott vissza */
function dobogoVisszaRossz() {
  var J0 = DOB.f.dob.jo, db = 0;
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
  s[i] = id; dobRajz();
  var x = document.querySelector('#dobogo-panel .dob-h[data-r="' + r + '"][data-i="' + i + '"]');
  if (x) { x.classList.add("dob-uj"); }
}
function dobogoZar(z) { if (DOB) { DOB.zar = !!z; var p = $("dobogo-panel"); if (p) p.classList.toggle("zar", !!z); } }
function dobogoUrit() { if (!DOB) return; DOB.hely.forEach(function (s) { for (var i = 0; i < s.length; i++) s[i] = null; }); dobRajz(); }
function dobKatt(ev) {
  if (!DOB) return;
  var t = ev.target.closest ? ev.target.closest("button, .dob-h") : null; if (!t) return;
  var g = t.getAttribute("data-g");
  if (g === "segit") { hangGomb(); if (DOB.o.segit) DOB.o.segit(t.parentNode.nextSibling); return; }
  if (DOB.zar) return;
  if (g === "ujra") { hangGomb(); dobogoUrit(); return; }
  if (g === "kesz") {
    hangGomb();
    if (!dobTeli()) { var v = $("visszajelzes"); v.className = "visszajelzes"; v.textContent = "Előbb tedd mindenkit a helyére!"; mondd("Előbb tedd mindenkit a helyére!"); return; }
    if (DOB.o.kesz) DOB.o.kesz(dobJoE(), dobAllas());
    return;
  }
  if (t.classList.contains("dob-d")) {
    hangGomb();
    var r = +t.getAttribute("data-r"), id = t.getAttribute("data-id"), s = DOB.hely[r], j = s.indexOf(id);
    if (j >= 0) s[j] = null;                                   /* felrakott → vissza a tálba */
    else { var u = s.indexOf(null); if (u < 0) return; s[u] = id; }
    $("visszajelzes").textContent = ""; $("visszajelzes").className = "visszajelzes";
    dobRajz();
  }
}

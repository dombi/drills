/* ============ 7b) 🚪 NYITÓKÉP + AZ ELSŐ PERC (Újonc-bevezetés 2. kör, 2026-10-20) ============
   Terv: terv/ujonc-bevezetes-rendszerterv.html 4.⓪–② (✅) + terv/ujonc-bevezetes-rajzterv.html 1–2. (✅ A · Jelenet).
   NYITÓKÉP — minden indulás ezen a kapun át (Lili és Fanni is ezt kapja, nem újonc-dolog):
     • 🦄 BELÉPŐ LEGELŐ (1. kör, 2026-10-23, legelo.js): belépve (vagy felhő nélkül) a nyitókép maga a legelő — mind az öt
       unikornis a réten, a gyerek azt koppintja meg, amelyikkel játszani akar; a 🦄 Váltás is ide hoz vissza.
     • 🚪 BELÉPÉS (a legelő 2. köre): ha senki nincs belépve (NYITO.mod "belepo"), a legelőn alap kinézetű unikornisok és
       üres tábla — a tábla kéri a belépőt, belépéskor csillámfelhő (legeloFelho), kilépés a kis kapun. Közös gépen is ugyanez:
       a gép gyerekeinek neve sehol nem látszik, mindenki beírja a belépőjét (a belépés a böngésző bezárásáig él, auth.js).
   AZ ELSŐ PERC (újonc: nyitas.js nyitasSzuz, még nincs P().uj rekord, a pult nem kapcsolta ki) — három koppintás a képen:
     ① választás: a legelő (legelo.js, mod "ujonc"): mindenki ébren, a koppintott odaüget és ugrik, a többi elhalványul;
     ② név: 3 felhő 3 névvel (koppintásra felolvassa) + „✏️ Saját nevet adok” (mező) → P().becenev;
     ③ osztály: 6 lufi egy cölöphöz kötve → a koppintott elszáll → nyitasIndit(o) (a pult osztálya esetén ez a lépés kimarad).
     Utána a térkép: az unikornis a világító helyhez sétál, és segítséget kér (NYITAS_ELSO_LIGET, terkep.js). */

var NYITO = { mod: null, kihagy: false, tovabb: false, varT: null, varKezd: 0, seta: null };
var NYITO_KOSZON = ["Szia, {n}! Már vártalak!", "Hurrá, itt vagy, {n}!", "Szia, {n}! Épp rólad álmodtam!"];
var NYITO_KOSZON_N = ["Szia! Már vártalak!", "Hurrá, itt vagy!", "Szia! Épp rólad álmodtam!"];
var NYITO_VAR_MS = 6000;   /* ennyit vár a felhő-mentésre ébredés után (net nélkül utána a helyi mentéssel megy tovább) */

/* ── közös rajzelemek (a rajzterv prototípusaiból; a térkép tájának színeivel: LT_DEFS, ltFelho, ltRozsa) ── */
function nyRetHatter(w, h, hz) {
  return '<rect width="' + w + '" height="' + h + '" fill="url(#lt-gEgA)"/>' +
    '<circle cx="' + (w * .9) + '" cy="52" r="54" fill="url(#lt-gNap)"/><circle cx="' + (w * .9) + '" cy="52" r="21" fill="#fff4c2"/>' +
    '<path d="M0 ' + (hz - 10) + 'Q' + (w * .18) + ' ' + (hz - 58) + ' ' + (w * .38) + ' ' + (hz - 28) + 'T' + (w * .78) + ' ' + (hz - 40) + 'T' + w + ' ' + (hz - 22) + 'V' + h + 'H0Z" fill="#d9cbef"/>' +
    '<path d="M0 ' + (hz + 18) + 'Q' + (w * .24) + ' ' + (hz - 20) + ' ' + (w * .5) + ' ' + (hz + 8) + 'T' + w + ' ' + hz + 'V' + h + 'H0Z" fill="#c4e6bc"/>' +
    '<path d="M0 ' + (hz + 44) + 'Q' + (w * .3) + ' ' + (hz + 20) + ' ' + (w * .62) + ' ' + (hz + 40) + 'T' + w + ' ' + (hz + 30) + 'V' + h + 'H0Z" fill="url(#lt-gRetA)"/>' +
    ltFelho(0, 46, 1.2, 80, 10, "#ffffff", w) + ltFelho(0, 90, .8, 110, 70, "#ffffff", w);
}
function nyFu(x, y) { return '<path d="M' + (x - 8) + ' ' + y + 'q2 -10 4 -12q0 8 3 10q1 -12 5 -14q0 10 2 12q3 -8 6 -9q-2 7 -2 13z" fill="#8fcf86"/>'; }
function nyViragok(l) { return l.map(function (v, i) { return '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="3" fill="' + ["#f6a5c0", "#fce49a", "#ffffff", "#c9a8e6"][i % 4] + '"/>'; }).join(""); }
function nyCim(y, m) {
  return '<text x="400" y="' + y + '" text-anchor="middle" font-family="Fredoka, Comic Sans MS, sans-serif" font-size="' + m + '" font-weight="700" fill="url(#ny-cim)" stroke="#ffffff" stroke-width="9" paint-order="stroke" stroke-linejoin="round">Unikornis Centum</text>' +
    csillagSVG(400 - m * 4.4, y - m * .55, 9, "#ffd24d") + csillagSVG(400 + m * 4.5, y - m * .7, 7, "#f6a5c0") + csillagSVG(400 + m * 4.2, y - m * .05, 5, "#c9a8e6");
}
function nyDefs() {
  return LT_DEFS + '<defs><linearGradient id="ny-cim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e0417a"/><stop offset=".5" stop-color="#8a4fd0"/><stop offset="1" stop-color="#29a3dd"/></linearGradient></defs>';
}
/* fatábla a fűben: oszlop + deszka a névvel (a hosszú név kisebb betűvel) */
function nyTabla(x, y, nev, extra) {
  var t = kiiras(nev), fm = nev.length > 9 ? 22 : 27, sz = Math.max(104, nev.length * fm * .7 + 36);
  return '<g class="ny-tabla' + (extra ? " " + extra : "") + '" transform="translate(' + x + ' ' + y + ')"><g filter="url(#lt-firka)">' +
    '<path d="M-5 2V-58h10V2Z" fill="#a4734a" stroke="#6e4a36" stroke-width="2"/>' +
    '<rect x="' + (-sz / 2) + '" y="-104" width="' + sz + '" height="50" rx="10" fill="#e8c9a0" stroke="#8a6248" stroke-width="2.4"/>' +
    '<path d="M' + (-sz / 2 + 8) + ' -88H' + (sz / 2 - 8) + 'M' + (-sz / 2 + 8) + ' -70H' + (sz / 2 - 8) + '" stroke="#d1ab80" stroke-width="1.6"/></g>' +
    '<text y="-70" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="' + fm + '" font-weight="700" fill="#5a3a22">' + t + '</text>' +
    ltRozsa(-12, -2, 5, "#f6a5c0") + ltRozsa(10, 0, 4, "#fce49a") + '</g>';
}
/* buborék a kép fölött (x, y a kép egységeiben); a mondatot a játék ki is mondja */
function nyBuborek(host, x, y, szoveg, mp) {
  var b = host.querySelector(".ny-bub");
  if (!b) { b = el("div", "ny-bub"); host.appendChild(b); }
  clearTimeout(b._t); b.classList.remove("lat");
  b.textContent = szoveg;
  var W = host.clientWidth || 800, px = x / 800 * W, bw = b.offsetWidth, l = Math.max(bw / 2 + 6, Math.min(W - bw / 2 - 6, px));
  b.style.left = l + "px"; b.style.top = (y / 460 * 100) + "%";
  b.style.setProperty("--nyil", Math.max(18, Math.min(bw - 18, px - l + bw / 2)) + "px");
  void b.offsetWidth; b.classList.add("lat");
  if (mp) b._t = setTimeout(function () { b.classList.remove("lat"); }, mp * 1000);
}
function nyBubEl(host) { var b = host && host.querySelector(".ny-bub"); if (b) b.classList.remove("lat"); }

/* ── a gyerek neve a táblára: a belépőkódból (DAVID-… → Dávid). Amíg a felhő tölt, a gép egyetlen gyereke —
   de csak ha a gépen lévő mentés az övé (kilépés után a tábla üres) ── */
function nyitoNev() {
  var kod = FELHO.kod || (FELHO.offline && FELHO.offline.kod) || null;
  if (!kod) { var l = gepJatekosok(); if (l.length === 1 && l[0].uid && l[0].uid === felhoGazda()) kod = l[0].kod; }
  return kod ? jatekosNev(kod) : "";
}

/* ── indítás (main.js): ha a gépen senkinek a mentése nincs (kilépés után / új gép), egyből a belépő legelő —
   különben a legelő, amíg a felhő megérkezik; az újonc egyből az első perccel kezd ── */
function nyitoIndul() {
  if (NYITO.mod === "belepo") return;   /* közös gépen a felhoIndit már a belépőt mutatja */
  if (FELHO.be && !FELHO.offline && !felhoGazda()) { legeloBelepo(); return; }
  if (elsoPercKell()) { elsoPercIndit(); return; }
  legeloNyit();
}
/* a felhő megjött / változott (db.js felhoKepernyoFrissit), miközben a nyitókép látszik */
function nyitoFrissit() {
  if (NYITO.tovabb || LEGELO.felho || LEGELO.valaszt && LEGELO.host === $("nyito-szin")) return;   /* választás közben nem rajzoljuk újra (a végén úgyis megvárja) */
  if (NYITO.mod === "belepo") {
    if (!(FELHO.kesz || FELHO.offline)) return;   /* üres tábla, amíg valaki be nem lép */
    if (lakatKapu()) return;   /* 🔒 van titkos kódja: előbb a lakat (lakat.js) */
    if (elsoPercKell()) { belepoRejt(); elsoPercIndit(); return; }   /* az újoncnak nincs mit felvenni: egyből az első perc */
    legeloFelho(); return;   /* most lépett be: csillámfelhő, mindenki felveszi a kinézetét */
  }
  if (elsoPercKell()) { elsoPercIndit(); return; }
  legeloNyit(NYITO.mod === "sajat");   /* ugyanaz a kép marad, csak a kinézetek frissülnek */
}
/* mod: "sajat" (a legelő mint választó) | "belepo" (senki nincs belépve: üres tábla) — legelo.js */
function nyitoRajzol(mod) { if (mod === "belepo") legeloBelepo(); else legeloNyit(); }
/* a legelőn választott unikornissal tovább a térképre (az újoncnál az első percre) — ha a felhő-mentés még úton van,
   egy kicsit megvárjuk; ha közben megjött, a választás marad (a felhő a régi aktív unikornist hozná) */
function nyitoTovabb(leny) {
  if (NYITO.tovabb) return;
  if (FELHO.be && !FELHO.kesz && !FELHO.offline) {
    if (!NYITO.varKezd) NYITO.varKezd = Date.now();
    if (Date.now() - NYITO.varKezd < NYITO_VAR_MS) { clearTimeout(NYITO.varT); NYITO.varT = setTimeout(function () { nyitoTovabb(leny); }, 250); return; }
  }
  if (!$("kepernyo-nyito").classList.contains("aktiv")) return;   /* közben máshová ment (pl. a felhő az első percre vitte) */
  NYITO.tovabb = true;
  nyBubEl($("nyito-szin"));
  if (leny && mentes.profilok[leny] && mentes.leny !== leny) { mentes.leny = leny; ment(); }
  if (elsoPercKell()) elsoPercIndit(); else terkepNyit();
}

/* ════════════ AZ ELSŐ PERC ════════════ */
var EP = { lepes: 0, tok: 0, leny: null, nev: "" };
/* a név-felhők: 3 véletlen a listából (koppintásra felolvassa) — rövid, könnyen kimondható, kedves nevek */
var EP_NEVEK = ["Pötty", "Csillag", "Bogyó", "Mazsola", "Pille", "Szellő", "Bársony", "Szikra", "Málna", "Gyöngy", "Füge", "Hópihe"];
var EP_LUFI = [[470, 150, "#f6a5c0"], [548, 120, "#fce49a"], [626, 150, "#a7d99a"], [494, 228, "#9ec9f0"], [572, 204, "#c9a8e6"], [650, 232, "#f7c59f"]];
var EP_OSZTALY_SZO = { 1: "elsős", 2: "másodikos", 3: "harmadikos", 4: "negyedikes", 5: "ötödikes", 6: "hatodikos" };   /* szóval: a felolvasó a mondatkezdő számot félreolvashatja */
var EP_MONDAT = {
  valaszt: "Szia! Melyikünk legyen a barátod?",
  nev: "Milyen nevet adsz nekem?",
  sajat: "Írd be, mi legyen a nevem!",
  nevKesz: "Szuper, mostantól {n} vagyok!",
  osztaly: "Hányadikos vagy?",
  osztalyKesz: "Jó, {o}! Gyere, megmutatom!",
  segits: "Segítesz nekem? Koppints a világító helyre, és együtt végigmegyünk!"
};

/* kell-e az első perc: újonc (egyik unikornisánál sincs végigjátszott pálya), még nincs menet-rekord, a pult nem kapcsolta ki,
   és a mentés biztosan megjött (különben egy új gépen Lili is újonc lenne) */
function elsoPercKell() {
  if (typeof mentes !== "object" || !mentes || !mentes.profilok) return false;
  var b = nyitasBeall();
  if (b.menet === false || nyitasRekordKeres(mentes.profilok)) return false;
  if (b.menet !== true && !nyitasSzuz(mentes.profilok)) return false;
  return nyitasMentesKesz();
}
function elsoPercIndit() {
  EP = { lepes: 0, tok: 0, leny: null, nev: "" };
  NYITO.tovabb = true;
  esemeny("elso_perc", { lepes: "indul" });
  epSajatKot();
  mutat("kepernyo-elsoperc");
  epLepes(1);
}
function epHost() { return $("elsoperc-szin"); }
/* a térkép színátmenetei (LT_DEFS: lt-gFa, lt-gTorzs…) saját néven: ha a rejtett nyitókép a térképével azonos id-ket
   hordozna, a böngésző a térképen is a rejtett példányt keresné, és a térkép rajzai átlátszóak maradnának */
function nySajatId(s) { return s.replace(/id="lt-/g, 'id="nyk-').replace(/#lt-/g, "#nyk-"); }
function epVaz(belso) {
  return nySajatId('<svg viewBox="0 0 800 460" class="uni-terep" xmlns="http://www.w3.org/2000/svg">' + nyDefs() + nyRetHatter(800, 460, 150) +
    [nyFu(60, 446), nyFu(330, 452), nyFu(470, 440), nyFu(760, 448), nyViragok([[40, 430], [190, 448], [300, 432], [610, 452], [660, 430], [770, 440]])].join("") +
    belso + '</svg>') + '<div class="ny-atfed"></div>';
}
/* unikornis egy mozgatható keretben: kulso (hely, méret) > irany (--dir) > rajz */
function epUni(id, leny, x, y, s, dir, extra) {
  var p = mentes.profilok[leny] || {};
  return '<g class="ny-mozgo ' + (extra || "") + '" data-leny="' + leny + '" style="transform:translate(' + x + 'px,' + y + 'px) scale(' + s + ')">' +
    '<g class="irany" style="--dir:' + (dir || 1) + ';transform:scale(var(--dir,1),1)">' + unikornisSVG(id, LENYEK[leny], 1, p.oltozet || null, p.kinezet || null) + '</g></g>';
}
function epUgrik(g) {
  var ir = g && g.querySelector(".irany"); if (!ir || nyugiMod()) return;
  ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); void ir.getBoundingClientRect();
  ir.classList.add("uni-mozd-ugras", "ny-ugrik");
  setTimeout(function () { ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); }, 1150);
}
function epKesobb(fn, ms) { var tok = EP.tok; setTimeout(function () { if (tok === EP.tok && $("kepernyo-elsoperc").classList.contains("aktiv")) fn(); }, window.__UC_GYORS ? 0 : ms); }
function epLepes(n) {
  EP.lepes = n; EP.tok++;
  var host = epHost(); nyBubEl(host);
  if (n > 1) host.classList.remove("allo");   /* a ① legelő állva is lehet; a név-felhők és a lufik fekvő képek */
  $("ep-sajat").hidden = true;
  ({ 1: epValaszt, 2: epNev, 3: epOsztaly })[n](host);
}
function epAtvalt(n) {   /* lágy áttűnés a következő lépésre */
  var f = epHost().querySelector(".ny-atfed");
  if (f) f.classList.add("be");
  epKesobb(function () { epLepes(n); }, 520);
}
function epSzol(x, y, mondat, mp) { nyBuborek(epHost(), x, y, mondat, mp); mondd(mondat); }

/* ① választás: a legelő (legelo.js, mod "ujonc") — mindenki ébren; a koppintott odaüget, ugrik, a többi elhalványul */
function epValaszt(host) {
  var tok = EP.tok;
  legeloRajzol(host, "ujonc", function (l) { if (tok !== EP.tok) return; EP.leny = l; epAtvalt(2); });
}

/* ② név: 3 felhő (koppintásra felolvassa) + „✏️ Saját nevet adok” */
function epFelho(i, cx, cy, s, felirat, kicsi) {
  var forma = function (f) { return '<rect x="-62" y="-6" width="124" height="34" rx="17" fill="' + f + '"/>' +
    [[-40, 0, 24], [-12, -14, 30], [22, -18, 32], [48, -2, 24]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + f + '"/>'; }).join(""); };
  return '<g class="ny-felho" data-i="' + i + '"><g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')"><g transform="scale(' + (kicsi ? 1.5 : 1) + ' 1)">' +
    '<g transform="scale(1.06)">' + forma("#d9c8f0") + '</g>' + forma("#ffffff") + '<ellipse cx="-20" cy="-22" rx="16" ry="6" fill="#fff" opacity=".9"/></g>' +
    '<text y="' + (kicsi ? 14 : 16) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="' + (kicsi ? 20 : 27) + '" font-weight="700" fill="' + (kicsi ? "#8a4fd0" : "#4a3b7a") + '">' + kiiras(felirat) + '</text></g></g>';
}
function epNevek() {   /* 3 különböző név, nem az unikornis „igazi” neve */
  var l = EP_NEVEK.filter(function (n) { return n !== LENYEK[EP.leny].nev; }).slice(), ki = [];
  while (ki.length < 3 && l.length) ki.push(l.splice(Math.floor(Math.random() * l.length), 1)[0]);
  return ki;
}
function epNev(host) {
  var nevek = epNevek(), s = epUni("ep-nev-u", EP.leny, 400, 418, 1.15, 1);
  s += epFelho(0, 200, 150, 1, nevek[0]) + epFelho(1, 400, 96, 1, nevek[1]) + epFelho(2, 600, 150, 1, nevek[2]) + epFelho(3, 660, 262, .8, "✏️ Saját nevet adok", true);
  s += '<g class="ny-nevtabla"><rect x="330" y="424" width="140" height="30" rx="15" fill="#ffffff" stroke="#e3d4f5" stroke-width="2"/><text class="ny-nevfelirat" x="400" y="446" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="19" font-weight="700" fill="#4a3b7a"></text></g>';
  host.innerHTML = epVaz(s);
  epKesobb(function () { epSzol(400, 250, EP_MONDAT.nev); }, 300);
  var fk = host.querySelectorAll(".ny-felho"), kesz = false;
  function nevKesz(nev) {
    kesz = true; EP.nev = nev;
    P().becenev = nev; ment();
    esemeny("elso_perc", { lepes: "nev", sajat: fk[3].classList.contains("valasztott") });
    host.querySelector(".ny-nevfelirat").textContent = nev; host.querySelector(".ny-nevtabla").classList.add("lat");
    epUgrik(host.querySelector(".ny-mozgo"));
    epSzol(400, 250, EP_MONDAT.nevKesz.replace("{n}", nev));
    var o = nyitasBeall().osztaly;
    epKesobb(function () { if (o) epVege(o); else epAtvalt(3); }, 2600);
  }
  fk.forEach(function (f) {
    f.addEventListener("click", function () {
      if (kesz || f.classList.contains("valasztott")) return;
      var i = +f.getAttribute("data-i");
      hangGomb();
      fk.forEach(function (m) { m.classList.toggle("halvanyul", m !== f); m.classList.remove("valasztott"); });
      f.classList.add("valasztott");
      if (i < 3) { $("ep-sajat").hidden = true; epSzol(400, 250, nevek[i] + "?", 1); epKesobb(function () { nevKesz(nevek[i]); }, 1100); return; }
      epSajat(nevKesz, function () { fk.forEach(function (m) { m.classList.remove("halvanyul", "valasztott"); }); });
    });
  });
}
/* saját név: mező a kép alján; 2–14 betű (ékezetes is), szóköz, kötőjel */
function epNevTisztit(s) {
  s = String(s || "").replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű \-]/g, "").replace(/\s+/g, " ").trim().slice(0, 14).trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}
function epSajat(kesz, megse) {
  var d = $("ep-sajat"), m = $("ep-sajat-mezo");
  d.hidden = false; m.value = ""; $("ep-sajat-hiba").textContent = "";
  epSzol(400, 250, EP_MONDAT.sajat);
  setTimeout(function () { try { m.focus(); } catch (e) {} }, 50);
  d._kesz = function () {
    var n = epNevTisztit(m.value);
    if (n.length < 2) { $("ep-sajat-hiba").textContent = "Írj legalább két betűt!"; return; }
    d.hidden = true; m.blur(); kesz(n);
  };
  d._megse = function () { d.hidden = true; m.blur(); nyBubEl(epHost()); megse(); };
}

function epSajatKot() {
  var d = $("ep-sajat"); if (d._kotve) return; d._kotve = true;
  $("ep-sajat-kesz").addEventListener("click", function () { hangGomb(); if (d._kesz) d._kesz(); });
  $("ep-sajat-megse").addEventListener("click", function () { hangGomb(); if (d._megse) d._megse(); });
  $("ep-sajat-mezo").addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter" && d._kesz) d._kesz(); });
}

/* ③ osztály: 6 lufi egy cölöphöz kötve; a koppintott elszáll */
function epOsztaly(host) {
  var s = epUni("ep-o-u", EP.leny, 220, 418, 1.1, 1);
  s += '<g transform="translate(560 438)"><path d="M-7 2V-96h14V2Z" fill="#a4734a" stroke="#6e4a36" stroke-width="2"/><ellipse cx="0" cy="-96" rx="7" ry="3" fill="#c79e76" stroke="#6e4a36" stroke-width="1.6"/></g>';
  EP_LUFI.forEach(function (l, i) {
    var x = l[0], y = l[1];
    s += '<path class="ny-zsinor" data-i="' + i + '" d="M' + x + ' ' + (y + 40) + 'C' + (x + (560 - x) * .2) + ' ' + (y + 90) + ' ' + (560 + (x - 560) * .3) + ' 300 560 342" fill="none" stroke="#8a7fa0" stroke-width="1.6"/>';
  });
  EP_LUFI.forEach(function (l, i) {
    var x = l[0], y = l[1];
    s += '<g class="ny-lufi" data-i="' + i + '" style="animation-delay:' + (-i * .55) + 's">' +
      '<path d="M' + (x - 5) + ' ' + (y + 42) + 'L' + x + ' ' + (y + 35) + 'L' + (x + 5) + ' ' + (y + 42) + 'Z" fill="' + l[2] + '" stroke="#6b6280" stroke-width="1.2"/>' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="32" ry="37" fill="' + l[2] + '" stroke="#6b6280" stroke-width="1.6"/>' +
      '<ellipse cx="' + (x - 12) + '" cy="' + (y - 16) + '" rx="7" ry="11" fill="#fff" opacity=".55" transform="rotate(25 ' + (x - 12) + ' ' + (y - 16) + ')"/>' +
      '<text x="' + x + '" y="' + (y + 12) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#2a2140">' + (i + 1) + '</text>' +
      '<rect x="' + (x - 36) + '" y="' + (y - 40) + '" width="72" height="84" fill="transparent"/></g>';
  });
  host.innerHTML = epVaz(s);
  epKesobb(function () { epSzol(220, 250, EP_MONDAT.osztaly); }, 300);
  var kesz = false;
  host.querySelectorAll(".ny-lufi").forEach(function (g) {
    g.addEventListener("click", function () {
      if (kesz) return; kesz = true;
      var i = +g.getAttribute("data-i"), o = i + 1;
      hangGomb(); nyBubEl(host);
      host.querySelector('.ny-zsinor[data-i="' + i + '"]').classList.add("el");
      host.querySelectorAll(".ny-lufi").forEach(function (m) { if (m !== g) m.classList.add("halvanyul"); });
      g.classList.add("repul");
      epSzol(220, 250, EP_MONDAT.osztalyKesz.replace("{o}", EP_OSZTALY_SZO[o] || o + ". osztályos"));
      epKesobb(function () { epVege(o); }, 2400);
    });
  });
}
/* a menet elindul, és a térképen az unikornis a világító helyhez sétál (renderLigetTerkep → nyitoSeta) */
function epVege(o) {
  EP.tok++;
  nyitasIndit(o);
  esemeny("elso_perc", { lepes: "kesz", osztaly: o, leny: mentes.leny });
  NYITO.seta = mentes.leny;
  terkepNyit("odu");
}
/* a térkép hívja rajzolás után: az első perc végén az unikornis odasétál a világító helyhez, és segítséget kér */
function nyitoSeta(M) {
  if (!NYITO.seta || NYITO.seta !== mentes.leny || !M) return;
  NYITO.seta = null;
  var m = nyitasMenet(); if (!m) return;
  var id = terkepGazda(NYITAS_ELSO_LIGET[m.o]);   /* 🧺 a beköltözött liget a gazdája helyén (piac.js) */
  if (!M.halo.lathato[id] || (M.jel[id] || {}).ny !== "vil") id = m.sor.vil.map(terkepGazda).filter(function (r) { return M.halo.lathato[r] && (M.jel[r] || {}).ny === "vil"; })[0];
  if (!id) return;
  setTimeout(function () {
    if (LIGET_M !== M || !M.svg.isConnected) return;
    terkepSetal(M, id, function () {
      TERKEP_HOL = { leny: mentes.leny, id: id };
      if (LIGET_M === M) mondd(EP_MONDAT.segits);
    });
  }, window.__UC_GYORS ? 0 : 700);
}

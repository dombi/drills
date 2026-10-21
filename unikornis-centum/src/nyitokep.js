/* ============ 7b) 🚪 NYITÓKÉP + AZ ELSŐ PERC (Újonc-bevezetés 2. kör, 2026-10-20) ============
   Terv: terv/ujonc-bevezetes-rendszerterv.html 4.⓪–② (✅) + terv/ujonc-bevezetes-rajzterv.html 1–2. (✅ A · Jelenet).
   NYITÓKÉP — minden indulás ezen a kapun át (Lili és Fanni is ezt kapja, nem újonc-dolog):
     • a rét, a cím, az odú, és a gyerek unikornisa szunyókál a fűben, mellette fatábla a gyerek nevével;
     • koppintásra felébred (uniFelebred), nyújtózik (uniNyujtozik), köszön („Szia, Petra! Már vártalak!” — napszak nélkül),
       aztán a térkép jön (az újoncnál az első perc). Ez a belépés: nem kell hozzá olvasni.
     • SAJÁT GÉP: a kódot csak az első belépéskor kell beírni (a belépő kártya, auth.js) — aki most írta be, annak nem kell
       még egyszer ébresztenie (NYITO.belepett).
     • KÖZÖS GÉP (auth.js kozosGep): a jelenetben a gép összes gyereke alszik, mindegyik a saját táblájával; koppintásra
       felébred és köszön, utána jön a kód (belepoMutat(kod)). „✏️ Új vagyok” tábla: kód névkártya nélkül.
   AZ ELSŐ PERC (újonc: nyitas.js nyitasSzuz, még nincs P().uj rekord, a pult nem kapcsolta ki) — három koppintás a képen:
     ① választás: az 5 unikornis legel (számok nélkül), a koppintott odaüget és ugrik, a többi visszahúzódik;
     ② név: 3 felhő 3 névvel (koppintásra felolvassa) + „✏️ Saját nevet adok” (mező) → P().becenev;
     ③ osztály: 6 lufi egy cölöphöz kötve → a koppintott elszáll → nyitasIndit(o) (a pult osztálya esetén ez a lépés kimarad).
     Utána a térkép: az unikornis a világító helyhez sétál, és segítséget kér (NYITAS_ELSO_LIGET, terkep.js). */

var NYITO = { mod: null, ebren: false, belepett: false, tovabb: false, varT: null, varKezd: 0, seta: null };
var NYITO_KOSZON = ["Szia, {n}! Már vártalak!", "Hurrá, itt vagy, {n}!", "Szia, {n}! Épp rólad álmodtam!"];
var NYITO_KOSZON_N = ["Szia! Már vártalak!", "Hurrá, itt vagy!", "Szia! Épp rólad álmodtam!"];
var NYITO_KOD_KER = "Szia, {n}! Írd be a kódodat!";
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
/* alvó unikornis a fűben (koppintható; a fehér gyűrű hívogat) */
function nyAlvoUni(i, x, y, s, gy) {
  return '<g class="ny-alvo" data-i="' + i + '" data-x="' + x + '" data-y="' + y + '" data-s="' + s + '">' +
    '<ellipse class="ny-koppints" cx="' + x + '" cy="' + (y - 34 * s) + '" rx="' + (78 * s) + '" ry="' + (52 * s) + '" fill="none" stroke="#ffffff" stroke-width="4"/>' +
    '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="uni-alvas">' + unikornisSVG("ny-u" + i, LENYEK[gy.leny] || LENYEK[LENY_SORREND[0]], 1, gy.oltozet || null, gy.kinezet || null) + '</g></g>' +
    '<rect x="' + (x - 100 * s) + '" y="' + (y - 110 * s) + '" width="' + (200 * s) + '" height="' + (124 * s) + '" fill="transparent"/></g>';
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

/* ── a gyerek neve a táblára: a belépőkódból (DAVID-… → Dávid); felhő nélkül az unikornis beceneve / neve ── */
function nyitoNev() {
  var kod = FELHO.kod || (FELHO.offline && FELHO.offline.kod) || null;
  if (!kod) { var l = gepJatekosok(); if (l.length === 1) kod = l[0].kod; }
  return kod ? jatekosNev(kod) : "";
}

/* ── indítás (main.js): közös gépen a belépő már a jelenetet mutatja; az újonc egyből az első perccel kezd ── */
function nyitoIndul() {
  renderProfil();
  if (NYITO.mod === "kozos") return;
  if (elsoPercKell()) { elsoPercIndit(); return; }
  nyitoRajzol("sajat");
}
/* a felhő megjött / változott (db.js felhoKepernyoFrissit), miközben a nyitókép látszik */
function nyitoFrissit() {
  if (NYITO.tovabb) return;
  if (NYITO.belepett && (FELHO.kesz || FELHO.offline)) { nyitoTovabb(); return; }   /* most írta be a kódot: nem kell még egyszer ébreszteni */
  if (NYITO.ebren || NYITO.mod === "kozos") return;                               /* ébredés közben nem rajzoljuk újra (a végén úgyis megvárja) */
  if (elsoPercKell()) { elsoPercIndit(); return; }
  nyitoRajzol("sajat");
}
/* mod: "sajat" (egy gyerek: az aktív unikornis) | "kozos" (a gép gyerekei, gepJatekosok) */
function nyitoRajzol(mod) {
  NYITO.mod = mod; NYITO.ebren = false; NYITO.tovabb = false;
  clearTimeout(NYITO.varT);
  var gy;
  if (mod === "kozos") {
    gy = gepJatekosok().slice().reverse().slice(0, 4).map(function (j) { return { nev: jatekosNev(j.kod), kod: j.kod, leny: j.leny, oltozet: j.oltozet, kinezet: j.kinezet }; });
  } else {
    var p = P(), n = nyitoNev();
    gy = [{ nev: n || p.becenev || LENYEK[mentes.leny].nev, cimzett: n, leny: mentes.leny, oltozet: p.oltozet, kinezet: p.kinezet }];
  }
  var host = $("nyito-szin"), k = gy.length, s = '<svg viewBox="0 0 800 460" class="uni-terep" xmlns="http://www.w3.org/2000/svg">' + nyDefs() + nyRetHatter(800, 460, 150);
  s += nyCim(78, k > 2 ? 44 : 50);
  s += '<g transform="translate(' + (k === 1 ? 150 : 70) + ' 432) scale(' + (k === 1 ? 2.5 : 1.8) + ')">' + LT_JELKEP.odu() + '</g>';
  s += [nyFu(300, 440), nyFu(740, 446), nyFu(520, 452), nyViragok([[280, 420], [560, 436], [700, 430], [380, 450], [620, 452]])].join("");
  var lep = k === 1 ? 0 : k === 2 ? 275 : k === 3 ? 200 : 158, x0 = k === 1 ? 430 : k === 2 ? 270 : k === 3 ? 240 : 205, sc = k === 1 ? 1.25 : k === 2 ? .95 : k === 3 ? .82 : .7;
  gy.forEach(function (g, i) {   /* a tábla az unikornis mögött, a feje előtt (nem takarja a szarvat) */
    var ux = x0 + i * lep, tx = ux + (k === 1 ? 210 : 112 * sc / .82);
    s += nyTabla(tx, 414, g.nev) + nyAlvoUni(i, ux, 426, sc, g);
  });
  if (mod === "kozos") s += '<g class="ny-uj" transform="translate(728 300) scale(.62)">' + nyTabla(0, 0, "✏️ Új vagyok") + '<rect x="-80" y="-110" width="160" height="116" fill="transparent"/></g>';
  host.innerHTML = nySajatId(s + '</svg>');
  host.querySelectorAll(".ny-alvo").forEach(function (h) {
    uniElalszik(h.querySelector(".uni-alvas"), true);
    h.addEventListener("click", function () { nyitoEbreszt(h, gy[+h.dataset.i]); });
  });
  var uj = host.querySelector(".ny-uj");
  if (uj) uj.addEventListener("click", function () { hangGomb(); nyBubEl(host); belepoMutat(null); });
  mutat("kepernyo-nyito");
}
function nyitoEbreszt(h, gy) {
  if (NYITO.ebren) return;
  NYITO.ebren = true; hangGomb();
  var host = $("nyito-szin"), u = h.querySelector(".uni-alvas"), k = h.querySelector(".ny-koppints");
  if (k) k.remove();
  uniFelebred(u);
  var tabla = h.previousElementSibling;
  if (tabla && tabla.classList.contains("ny-tabla")) tabla.classList.add("ebred");
  var x = +h.dataset.x, y = +h.dataset.y - 150 * +h.dataset.s, kozos = NYITO.mod === "kozos";
  var mondat = kozos ? NYITO_KOD_KER.replace("{n}", gy.nev)
    : (gy.cimzett ? veletlenElem(NYITO_KOSZON).replace("{n}", gy.cimzett) : veletlenElem(NYITO_KOSZON_N));
  setTimeout(function () {
    if (!h.isConnected) return;
    uniNyujtozik(u, function () {
      if (!h.isConnected) return;
      nyBuborek(host, x, y, mondat);
      mondd(mondat);
      if (kozos) { setTimeout(function () { if (h.isConnected) belepoMutat(gy.kod); }, 900); return; }
      setTimeout(nyitoTovabb, 1500);
    });
  }, 500);
}
/* a közös gép kártyájáról visszalépett („← Vissza”): a gyerekek újra alszanak */
function nyitoKozosVissza() { if (NYITO.mod === "kozos" && !NYITO.tovabb) nyitoRajzol("kozos"); }
/* tovább a térképre (az újoncnál az első percre) — ha a felhő-mentés még úton van, egy kicsit megvárjuk */
function nyitoTovabb() {
  if (NYITO.tovabb) return;
  if (FELHO.be && !FELHO.kesz && !FELHO.offline) {
    if (!NYITO.varKezd) NYITO.varKezd = Date.now();
    if (Date.now() - NYITO.varKezd < NYITO_VAR_MS) { clearTimeout(NYITO.varT); NYITO.varT = setTimeout(nyitoTovabb, 250); return; }
  }
  if (!$("kepernyo-nyito").classList.contains("aktiv")) return;   /* közben máshová ment (pl. a felhő az első percre vitte) */
  NYITO.tovabb = true;
  nyBubEl($("nyito-szin"));
  if (elsoPercKell()) elsoPercIndit(); else terkepNyit();
}

/* ════════════ AZ ELSŐ PERC ════════════ */
var EP = { lepes: 0, tok: 0, leny: null, nev: "", legel: null };
var EP_X = [100, 250, 400, 550, 700];
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
  EP = { lepes: 0, tok: 0, leny: null, nev: "", legel: null };
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
function epHelyez(g, x, y, s) { g.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")"; }
function epUget(g, x, y, s, kesz) {
  var ir = g.querySelector(".irany"), tok = EP.tok;
  if (!nyugiMod()) uniJar(ir, { mod: "uget", tempo: 1.2 });
  epHelyez(g, x, y, s);
  setTimeout(function () { uniAll(ir); if (kesz && tok === EP.tok) kesz(); }, nyugiMod() || window.__UC_GYORS ? 0 : 1100);
}
function epUgrik(g) {
  var ir = g && g.querySelector(".irany"); if (!ir || nyugiMod()) return;
  ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); void ir.getBoundingClientRect();
  ir.classList.add("uni-mozd-ugras", "ny-ugrik");
  setTimeout(function () { ir.classList.remove("uni-mozd-ugras", "ny-ugrik"); }, 1150);
}
function epKesobb(fn, ms) { var tok = EP.tok; setTimeout(function () { if (tok === EP.tok && $("kepernyo-elsoperc").classList.contains("aktiv")) fn(); }, window.__UC_GYORS ? 0 : ms); }
function epLepes(n) {
  EP.lepes = n; EP.tok++; clearInterval(EP.legel);
  var host = epHost(); nyBubEl(host);
  $("ep-sajat").hidden = true;
  ({ 1: epValaszt, 2: epNev, 3: epOsztaly })[n](host);
}
function epAtvalt(n) {   /* lágy áttűnés a következő lépésre */
  var f = epHost().querySelector(".ny-atfed");
  if (f) f.classList.add("be");
  epKesobb(function () { epLepes(n); }, 520);
}
function epSzol(x, y, mondat, mp) { nyBuborek(epHost(), x, y, mondat, mp); mondd(mondat); }

/* ① választás: az unikornisok legelnek; a koppintott odaüget, ugrik, a többi visszahúzódik */
function epValaszt(host) {
  var s = "";
  LENY_SORREND.forEach(function (l, i) { s += epUni("ep-u" + i, l, EP_X[i % 5], 412, .84, i % 2 ? -1 : 1, "ny-kattinthato"); });
  host.innerHTML = epVaz(s);
  epKesobb(function () { epSzol(400, 236, EP_MONDAT.valaszt); }, 300);
  var gk = host.querySelectorAll(".ny-mozgo"), valasztva = false;
  if (!nyugiMod()) EP.legel = setInterval(function () {   /* legelés: egyikük lehajol a fűhöz (a játék „eszik” mozdulata) */
    var g = gk[Math.floor(Math.random() * gk.length)].querySelector(".irany");
    if (valasztva || g.classList.contains("uni-mozd-eszik")) return;
    g.classList.add("uni-mozd-eszik"); setTimeout(function () { g.classList.remove("uni-mozd-eszik"); }, 1700);
  }, 1300);
  gk.forEach(function (g) {
    g.addEventListener("click", function () {
      if (valasztva) return; valasztva = true;
      clearInterval(EP.legel); nyBubEl(host); hangGomb();
      EP.leny = g.getAttribute("data-leny");
      mentes.leny = EP.leny; ment();
      gk.forEach(function (m) { if (m !== g) m.classList.add("hatra"); });
      var ir = g.querySelector(".irany"), x = +((g.style.transform.match(/translate\(([-\d.]+)/) || [0, 400])[1]);
      ir.classList.remove("uni-mozd-eszik");
      ir.style.setProperty("--dir", x <= 400 ? 1 : -1);   /* a kép közepe felé néz */
      epUget(g, 400, 418, 1.15, function () { epUgrik(g); epKesobb(function () { epAtvalt(2); }, 1500); });
    });
  });
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
  var id = NYITAS_ELSO_LIGET[m.o];
  if (!M.halo.lathato[id] || (M.jel[id] || {}).ny !== "vil") id = m.sor.vil.filter(function (r) { return M.halo.lathato[r] && (M.jel[r] || {}).ny === "vil"; })[0];
  if (!id) return;
  setTimeout(function () {
    if (LIGET_M !== M || !M.svg.isConnected) return;
    terkepSetal(M, id, function () {
      TERKEP_HOL = { leny: mentes.leny, id: id };
      if (LIGET_M === M) mondd(EP_MONDAT.segits);
    });
  }, window.__UC_GYORS ? 0 : 700);
}

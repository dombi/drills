/* ============ 6o0) 📋 NYOMOZÓTÁBLA — a pipás (✓/✗) tábla, közös modul ============
   Terv: Matekos\nyomozotabla-terv.html (✅ 7/7) · rajz: Matekos\nyomozotabla-rajzterv.html (✅ R1–R4, 2026-10-11).
   A tábla semmit nem tud a mese-keretekről: sorok (szereplők: id, név, fej-rajz) × oszlopok (helyek), és a GAZDA
   (most a 🏆 dobogo.js) mondja meg, ki hol áll. EGY ÁLLÁS, KÉT NÉZET (4. döntés): a ✓ nem a táblában él, hanem a gazda
   állásából jön (o.hol), ezért a rajz és a tábla soha nem mondhat mást. A táblában csak a ✗-ek élnek.
     Koppintás egy kockára: üres → ✗ → ✓ → üres (körbe). A ✓-t a gazda teszi meg (o.tesz → a rajzon odasétál az alak;
     ha ott már állt valaki, ő visszamegy a várakozók közé); a ✓ levétele: o.levesz.
     🦉 o.auto (3. döntés: a 📋 fok első 2 feladatában): minden új ✓ után a bagoly kihúzza a sor és az oszlop többi üres
     kockáját, egyszer sárgán felvillantja őket, és kimondja, miért (o.mondat). R3: ha a ✓ eltűnik, a miatta tett bagoly-✗-ek
     is eltűnnek; a gyerek saját ✗-ei maradnak. A ✓ helyén soha nincs ✗.
   ⚠️ KISKAPU-VÉDELEM: a pipálás semmit nem árul el arról, jó-e (nincs zöld villanás, nincs hang, nincs ✨); csak a Kész után.
   Rejtve is indítható (o.rejtve: az állás él, de nem látszik) és utólag előhívható (ntElohiv) — a Fejtörő-hegyen majd a
   gyerek veszi elő a szerszámosládából (producer, 2026-10-11).
   API: ntUj(o) → NT · ntEgyeztet() (a gazda állása változott) · ntRajz() · ntXDb(c) (a rajz ✗-eihez) · ntHiba(r) · ntZar(z) ·
        ntUrit() · ntRejt() · ntElohiv()
   o = { hova: elem, cim: html, sorok: [{ id, nev, kep }], oszlopok: [html], auto: bool, rejtve: bool,
         hol: function (r) → oszlop | -1, tesz: function (r, c), levesz: function (r), mondat: function (r, c) → szöveg } */

var NT = null;     /* { o, X: [[0|1|3]], O: [["r,c"|null]], elo: [oszlop…], uj: {"r,c":1}, hiba: {r,c}|null, zar, lathato } */

function ntUj(o) {
  var n = o.sorok.length, m = o.oszlopok.length, X = [], O = [];
  for (var r = 0; r < n; r++) { X.push([]); O.push([]); for (var c = 0; c < m; c++) { X[r].push(0); O[r].push(null); } }
  NT = { o: o, X: X, O: O, elo: o.sorok.map(function () { return -1; }), uj: {}, hiba: null, zar: false, lathato: !o.rejtve };
  if (o.hova && !o.hova.__nt) { o.hova.__nt = true; o.hova.addEventListener("click", ntKatt); }
  ntEgyeztet(true);
  ntRajz();
  return NT;
}
function ntHol(r) { var c = NT.o.hol(r); return c == null ? -1 : c; }
/* a gazda állása változott: a ✓ helyén nincs ✗; a gazdátlan bagoly-✗-ek eltűnnek (R3); új ✓ → 🦉 kihúzás (ha auto és nincs zárva) */
function ntEgyeztet(csend) {
  if (!NT) return;
  var X = NT.X, O = NT.O, n = X.length, m = n ? X[0].length : 0, H = [], r, c, uj = [];
  for (r = 0; r < n; r++) H.push(ntHol(r));
  for (r = 0; r < n; r++) for (c = 0; c < m; c++) {
    if (H[r] === c) { X[r][c] = 0; O[r][c] = null; continue; }
    if (X[r][c] === 3) { var q = O[r][c].split(","); if (H[+q[0]] !== +q[1]) { X[r][c] = 0; O[r][c] = null; } }
  }
  for (r = 0; r < n; r++) if (H[r] >= 0 && H[r] !== NT.elo[r]) uj.push(r);
  NT.elo = H;
  if (csend || NT.zar || !NT.o.auto || !uj.length) return;
  var mondat = "";
  uj.forEach(function (r0) {
    var c0 = H[r0], db = 0;
    function ki(rr, cc) { if (H[rr] !== cc && !X[rr][cc]) { X[rr][cc] = 3; O[rr][cc] = r0 + "," + c0; NT.uj[rr + "," + cc] = 1; db++; } }
    for (c = 0; c < m; c++) if (c !== c0) ki(r0, c);
    for (r = 0; r < n; r++) if (r !== r0) ki(r, c0);
    if (db && NT.o.mondat) mondat = NT.o.mondat(r0, c0);
  });
  if (mondat) {
    var v = $("visszajelzes"); if (v) { v.className = "visszajelzes"; v.textContent = "🦉 " + mondat; }
    mondd(ekKiejt(mondat));
  }
}
/* hány szereplő van kizárva a c. helyről (a rajz kis ✗-eihez, R4) */
function ntXDb(c) {
  if (!NT) return 0;
  var db = 0; NT.X.forEach(function (s) { if (s[c]) db++; });
  return db;
}
function ntKocka(r, c) {
  var S = NT.o.sorok[r], v = ntHol(r) === c ? 2 : NT.X[r][c], k = "nt-k" + (v === 2 ? " v" : v ? " x" : "");
  if (NT.uj[r + "," + c]) k += " uj";
  if (NT.hiba && NT.hiba.r === r && NT.hiba.c === c) k += " hiba";
  var cim = String(NT.o.oszlopok[c]).replace(/<[^>]*>/g, "");
  return '<td><button type="button" class="' + k + '" data-r="' + r + '" data-c="' + c + '" aria-label="' + htmlVed(S.nev + ", " + cim + ": " + (v === 2 ? "ide" : v ? "ide nem" : "üres")) + '">' +
    (v === 2 ? "✓" : v ? "✗" : "") + '</button></td>';
}
function ntRajz() {
  if (!NT || !NT.o.hova) return;
  var o = NT.o, h = o.hova;
  h.hidden = !NT.lathato;
  if (!NT.lathato) { h.innerHTML = ""; return; }
  var t = '<tr><th></th>' + o.oszlopok.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join("") + '</tr>';
  o.sorok.forEach(function (S, r) {
    t += '<tr><th scope="row" class="nt-sf' + (NT.hiba && NT.hiba.r === r && NT.hiba.c < 0 ? " hiba" : "") + '"><span class="nt-fej">' + S.kep + '</span><span class="nt-nev">' + S.nev + '</span></th>';
    for (var c = 0; c < o.oszlopok.length; c++) t += ntKocka(r, c);
    t += '</tr>';
  });
  var m = o.oszlopok.length;
  h.innerHTML = '<div class="nt-iro' + (NT.zar ? " zar" : "") + '"><div class="nt-papir">' + (o.cim ? '<div class="nt-cim">' + o.cim + '</div>' : '') +
    '<table class="nt-tabla m' + Math.min(m, 5) + '">' + t + '</table></div></div>';
  NT.uj = {};
}
function ntKatt(ev) {
  if (!NT || NT.zar) return;
  var b = ev.target.closest ? ev.target.closest(".nt-k") : null; if (!b) return;
  var r = +b.getAttribute("data-r"), c = +b.getAttribute("data-c");
  hangGomb();
  NT.hiba = null;
  var vj = $("visszajelzes"); if (vj) { vj.textContent = ""; vj.className = "visszajelzes"; }
  if (ntHol(r) === c) { NT.o.levesz(r); return; }                 /* ✓ → üres: az alak visszamegy a várakozók közé */
  if (NT.X[r][c]) { NT.X[r][c] = 0; NT.O[r][c] = null; NT.o.tesz(r, c); return; }   /* ✗ → ✓: az alak odasétál */
  NT.X[r][c] = 1; NT.O[r][c] = null;                               /* üres → ✗ (a gyereké) */
  if (NT.o.valt) NT.o.valt(); else ntRajz();
}
/* Kész után: rózsaszín keret a hibás mondat szereplőjének ✓-e köré (ha nincs ✓-e, a sorfejléce kap jelet) */
function ntHiba(r) {
  if (!NT) return;
  NT.hiba = r != null && r >= 0 ? { r: r, c: ntHol(r) } : null;
  ntRajz();
}
function ntZar(z) { if (!NT) return; NT.zar = !!z; ntRajz(); }
function ntUrit() {
  if (!NT) return;
  NT.X.forEach(function (s, r) { for (var c = 0; c < s.length; c++) { s[c] = 0; NT.O[r][c] = null; } });
  NT.hiba = null; NT.uj = {};
}
function ntRejt() { if (NT && NT.o.hova) { NT.o.hova.hidden = true; NT.o.hova.innerHTML = ""; } NT = null; }
function ntElohiv() { if (!NT) return; NT.lathato = true; ntRajz(); }

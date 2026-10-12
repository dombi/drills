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
   EGY KÖZÖS TÁBLA, SÁVOKKAL (rajzterv: Matekos
yomozotabla-egytabla-rajzterv.html, ✅ K1–K3, 2026-10-12): a NEVEK FENT
   vannak (oszlopok), alattuk sávonként a tulajdonságok (sorok). Minden ntUj egy sávot ad (NT_L); az azonos o.hova-ba tett
   sávok EGY táblát alkotnak (🔮/🏅: 🏠 hely-sáv + ⚽ pár-sáv; a 📋 fokon egy sáv). Belül minden sáv a régi szereplő × hely
   rács (X[r][c]: r = szereplő, c = hely) — a kihúzás, R3, a hibakeret és a „csak egy maradt” sávonként számol; csak a rajz
   fordul el. o.fordit: a sáv sorai fordított sorrendben (K3: a ház legfelső emelete fent, ahogy a rajzon). Az NT az első sáv.
   A függvények utolsó paramétere a sáv (elhagyva: NT); ntEgyeztet / ntRajz / ntZar / ntUrit / ntElohiv paraméter nélkül
   mindegyikre hat, az ntRejt mindet eltünteti.
   API: ntUj(o) → T · ntEgyeztet() (a gazda állása változott) · ntRajz() · ntXDb(c, T) (a rajz ✗-eihez) · ntHiba(r, T) · ntZar(z) ·
        ntUrit() · ntRejt() · ntElohiv() · ntKihuz(r, T) / ntX(r, c, T) (a végigvezetés: a bagoly húz ki, sárga villanással)
   o = { hova: elem (azonos elem = közös tábla), cim: html (a sáv címe: „🏠 Hol lakik?”), sav?: "hely"|"par" (a sáv színe),
         fordit?: bool, sorok: [{ id, nev, kep }] (a nevek: a tábla oszlopai), oszlopok: [html] (a sáv sorai), auto: bool, rejtve: bool,
         hol: function (r) → oszlop | -1, tesz: function (r, c), levesz: function (r), mondat: function (r, c) → szöveg } */

var NT = null;     /* az első tábla: { o, X: [[0|1|3]], O: [["r,c"|null]], elo: [oszlop…], uj: {"r,c":1}, hiba: {r,c}|null, zar, lathato } */
var NT_L = [];     /* minden élő sáv (🔮/🏅: hely-sáv + pár-sáv, egy táblában) */

function ntUj(o) {
  var n = o.sorok.length, m = o.oszlopok.length, X = [], O = [];
  for (var r = 0; r < n; r++) { X.push([]); O.push([]); for (var c = 0; c < m; c++) { X[r].push(0); O[r].push(null); } }
  var T = { o: o, X: X, O: O, elo: o.sorok.map(function () { return -1; }), uj: {}, hiba: null, zar: false, lathato: !o.rejtve };
  NT_L.push(T); if (!NT) NT = T;
  if (o.hova && !o.hova.__nt) { o.hova.__nt = true; o.hova.addEventListener("click", ntKatt); }
  ntEgyeztet(true, T);
  ntRajz(T);
  return T;
}
function ntMind(fn) { NT_L.slice().forEach(fn); }
function ntHol(r, T) { T = T || NT; var c = T.o.hol(r); return c == null ? -1 : c; }
/* a gazda állása változott: a ✓ helyén nincs ✗; a gazdátlan bagoly-✗-ek eltűnnek (R3); új ✓ → 🦉 kihúzás (ha auto és nincs zárva) */
function ntEgyeztet(csend, T) {
  if (!T) { ntMind(function (t) { ntEgyeztet(csend, t); }); return; }
  var X = T.X, O = T.O, n = X.length, m = n ? X[0].length : 0, H = [], r, c, uj = [];
  for (r = 0; r < n; r++) H.push(ntHol(r, T));
  for (r = 0; r < n; r++) for (c = 0; c < m; c++) {
    if (H[r] === c) { X[r][c] = 0; O[r][c] = null; continue; }
    if (X[r][c] === 3) { var q = O[r][c].split(","); if (H[+q[0]] !== +q[1]) { X[r][c] = 0; O[r][c] = null; } }
  }
  for (r = 0; r < n; r++) if (H[r] >= 0 && H[r] !== T.elo[r]) uj.push(r);
  T.elo = H;
  if (csend || T.zar || !T.o.auto || !uj.length) return;
  var mondat = "";
  uj.forEach(function (r0) { if (ntKihuz(r0, T) && T.o.mondat) mondat = T.o.mondat(r0, H[r0]); });
  if (mondat) {
    var v = $("visszajelzes"); if (v) { v.className = "visszajelzes"; v.textContent = "🦉 " + mondat; }
    mondd(ekKiejt(mondat));
  }
}
/* 🦉 a bagoly kihúzza az r. sor ✓-ének sorát és oszlopát (az üres kockákat); a ✗-ek a ✓-hez tartoznak (R3). Visszaad: hányat húzott ki */
function ntKihuz(r0, T) {
  T = T || NT;
  if (!T || r0 < 0) return 0;
  var X = T.X, O = T.O, n = X.length, m = X[0].length, c0 = ntHol(r0, T), db = 0, r, c;
  if (c0 < 0) return 0;
  function ki(rr, cc) { if (ntHol(rr, T) !== cc && !X[rr][cc]) { X[rr][cc] = 3; O[rr][cc] = r0 + "," + c0; T.uj[rr + "," + cc] = 1; db++; } }
  for (c = 0; c < m; c++) if (c !== c0) ki(r0, c);
  for (r = 0; r < n; r++) if (r !== r0) ki(r, c0);
  return db;
}
/* 🦉 egy ✗ a bagolytól (a végigvezetés: „Bori nem a legalsó emeleten lakik.”) — ugyanaz, mint a gyereké, csak felvillan */
function ntX(r, c, T) {
  T = T || NT;
  if (!T || r < 0 || c < 0 || ntHol(r, T) === c) return;
  if (!T.X[r][c]) { T.X[r][c] = 1; T.O[r][c] = null; }
  T.uj[r + "," + c] = 1;
}
/* hány szereplő van kizárva a c. helyről (a rajz kis ✗-eihez, R4) */
function ntXDb(c, T) {
  T = T || NT;
  if (!T) return 0;
  var db = 0; T.X.forEach(function (s) { if (s[c]) db++; });
  return db;
}
function ntKocka(T, r, c, b) {
  var S = T.o.sorok[r], v = ntHol(r, T) === c ? 2 : T.X[r][c], k = "nt-k" + (v === 2 ? " v" : v ? " x" : "");
  if (T.uj[r + "," + c]) k += " uj";
  if (T.hiba && T.hiba.r === r && T.hiba.c === c) k += " hiba";
  var cim = String(T.o.oszlopok[c]).replace(/<[^>]*>/g, "");
  return '<td><button type="button" class="' + k + '" data-t="' + b + '" data-r="' + r + '" data-c="' + c + '" aria-label="' + htmlVed(S.nev + ", " + cim + ": " + (v === 2 ? "ide" : v ? "ide nem" : "üres")) + '">' +
    (v === 2 ? "✓" : v ? "✗" : "") + '</button></td>';
}
/* a közös tábla sávjai (az ugyanabba az elembe tett sávok), a létrehozás sorrendjében */
function ntSavok(h) { return NT_L.filter(function (t) { return t.o.hova === h; }); }
function ntRajz(T) {
  if (!T) { var volt = []; ntMind(function (t) { if (volt.indexOf(t.o.hova) < 0) { volt.push(t.o.hova); ntRajz(t); } }); return; }
  if (!T.o.hova) return;
  var h = T.o.hova, G = ntSavok(h), E = G[0] || T, S = E.o.sorok, n = S.length;
  h.hidden = !E.lathato;
  if (!E.lathato) { h.innerHTML = ""; return; }
  var t = '<tr><th class="nt-sarok"></th>' + S.map(function (s, r) {           /* fent a nevek (K2: a 📋 fokon is) */
    var hiba = G.some(function (g) { return g.hiba && g.hiba.r === r && g.hiba.c < 0; });
    return '<th scope="col" class="nt-sf' + (hiba ? " hiba" : "") + '"><span class="nt-fej">' + s.kep + '</span><span class="nt-nev">' + s.nev + '</span></th>';
  }).join("") + '</tr>';
  G.forEach(function (g, b) {
    var o = g.o, m = o.oszlopok.length, sav = " nt-" + (o.sav || (b ? "par" : "hely"));
    t += '<tr class="nt-savcim' + sav + (b ? " nt-tovabbi" : "") + '"><th colspan="' + (n + 1) + '">' + (o.cim || "") + '</th></tr>';
    for (var j = 0; j < m; j++) {
      var c = o.fordit ? m - 1 - j : j;
      t += '<tr class="nt-savsor' + sav + '"><th scope="row" class="nt-sl">' + o.oszlopok[c] + '</th>';
      for (var r = 0; r < n; r++) t += ntKocka(g, r, c, b);
      t += '</tr>';
    }
  });
  h.innerHTML = '<div class="nt-iro' + (E.zar ? " zar" : "") + '"><div class="nt-papir">' +
    '<table class="nt-tabla n' + Math.min(Math.max(n, 3), 5) + (G.length > 1 ? " s2" : "") + '">' + t + '</table></div></div>';
  G.forEach(function (g) { g.uj = {}; });
}
function ntKatt(ev) {
  var b = ev.target.closest ? ev.target.closest(".nt-k") : null; if (!b) return;
  var T = ntSavok(this)[+b.getAttribute("data-t") || 0];
  if (!T || T.zar) return;
  var r = +b.getAttribute("data-r"), c = +b.getAttribute("data-c");
  hangGomb();
  ntMind(function (t) { t.hiba = null; });
  var vj = $("visszajelzes"); if (vj) { vj.textContent = ""; vj.className = "visszajelzes"; }
  if (ntHol(r, T) === c) { T.o.levesz(r); return; }               /* ✓ → üres: az alak visszamegy a várakozók közé */
  if (T.X[r][c]) { T.X[r][c] = 0; T.O[r][c] = null; T.o.tesz(r, c); return; }   /* ✗ → ✓: az alak odasétál */
  T.X[r][c] = 1; T.O[r][c] = null;                                 /* üres → ✗ (a gyereké) */
  if (T.o.valt) T.o.valt(); else ntRajz(T);
}
/* Kész után: rózsaszín keret a hibás mondat szereplőjének ✓-e köré (ha nincs ✓-e, a sorfejléce kap jelet); r < 0: nincs jel */
function ntHiba(r, T) {
  T = T || NT;
  if (!T) return;
  T.hiba = r != null && r >= 0 ? { r: r, c: ntHol(r, T) } : null;
  ntRajz(T);
}
function ntZar(z) { ntMind(function (T) { T.zar = !!z; }); ntRajz(); }
function ntUrit() {
  ntMind(function (T) {
    T.X.forEach(function (s, r) { for (var c = 0; c < s.length; c++) { s[c] = 0; T.O[r][c] = null; } });
    T.hiba = null; T.uj = {};
  });
}
function ntRejt() {
  ntMind(function (T) { if (T.o.hova) { T.o.hova.hidden = true; T.o.hova.innerHTML = ""; } });
  NT_L = []; NT = null;
}
function ntElohiv() { ntMind(function (T) { T.lathato = true; }); ntRajz(); }

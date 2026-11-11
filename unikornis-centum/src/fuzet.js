/* ============ 6j4c) 📓 A FÜZET — közös írásbeli füzet-modul (Garas tornya, 1. kör: 2026-11-09) ============
   Terv: terv/irasbeli-haz-recept-lap.html (⑦ hiányzó elem: füzet-modul + tallér-tálca) · a lapot az irasbeli-gen.js gyártja.
   EGY helyen megírva, bárhová átvehető (a producer kérése, 11-08): később a Déli vásár, a Bagolykönyvtár, a Fejtörő-hegy is ezt kapja
   (a konyvtar-fuzet.js helyére). A pálya csak megmondja: melyik lap (terv), ki ír (gép / gyerek), hogyan ellenőriz.

   fzLap(hova, T, o) → F    hova: a doboz, ahová a füzet kerül · T: irGyart(…) terve
     o.mod      "gyerek" (alap) | "gep" (a gép írja végig, mondókával: Rajt, bemutatás)
     o.ell      "lepes" (rossz jegynél azonnal jelez) | "vegen" (Kész gomb → a hibás OSZLOPOK gyulladnak ki)
     o.jelol    true: a kocka, ahová most írni kell, halványan jelöl (1–2. asztal)
     o.talca    true: a tallér-tálca a füzet mellett (kfTalca, keret.js) — a 10-es köteg átvitele / a felváltás kézzel
     o.mondoka  "mindig" (minden lépésnél kiírja + mondja, a megoldással) | "kerdes" (minden lépésnél, de csak a kérdés-alak: „… = ?”) | "hiba" (alap: a 2. hibától) | "nincs"
     o.hang     a mondókát a felolvasóhang is mondja (alap: mentes.hang)
     o.tempo    a gépi írás sebessége (1 = rendes)
     o.onKesz(F) · o.onHiba(F, {cel, n, oszlopok}) → true: a pálya intézi a segítséget · o.onLepes(F, k)
     o.elotolt  { "r,c": jegy } — a lap már teleírva (Garas írása), a gyerek ezeket is radírozhatja és átírhatja
     o.hibakeres "r,c" — HIBAKERESŐ (Odú-küszöb): Garas egy jegyet elrontott; előbb azt kell kiradírozni (más jegy radírozása = hiba,
                visszakerül), aztán jól beírni. Így a „melyik oszlop rossz?” nem tippelhető ki koppintgatással (recept-lap ⑤ kiskapu)
     o.csendesHiba  a hiba-pittyenés a pályáé (a motor hangHiba-ja szól), a füzet nem pittyen rá
     o.oldalt   széles képernyőn: a lap balra, a képernyő magasságában; jobbra egymás alatt a .fz-oldal (a pálya ide teheti a képét és a
                gombjait: F.oldal), a felirat, a tálca, az eszközök — így egy képernyőn elfér, nincs görgetés (a producer, 11-10)
   Eszközök (FELVESZ–LETESZ, nincs húzás): ✏️ ceruza (koppintás a kockára = oda ír, a hegye abba a kockába mutat; a jegyet — mint a
   játék többi részén — a gép billentyűzete adja, érintőn a rendszer számbillentyűzete; képernyős számgomb nincs),
   a ceruza a jegyen kívül: · pont (a hányados helye) · ' felső vessző · ▁ vonal (▁, aztán koppintás a vonal végére) · 🧽 radír
   (koppintás a kockára: mindent töröl, ami ott van — utána a ceruza ugyanoda ír). Billentyűzet: 0–9 · . · ' · _ · ⌫ (az utoljára írt jegy) · Del · nyilak · Esc · Enter.
   Csak a JEGYEK számítanak a jó/rossz-ba; a pont, a vessző és a vonal a lap formája (a végén halványan megmutatja, ami hiányzik). */

var FZ_S = 40, FZ_M = 8;   /* kocka-méret és lapszél (SVG-egység) */
var FZ_TINTA = "#6a3f9a", FZ_CERUZA = "#363c57";
var FZ_HE = [   /* a fejléc és a tálca színei: e · t · sz (a játék HE_SZIN-je) · E · tE */
  { j: "e", l: "#f9c9d9", k: "#c0567f", sz: "#7a2f4c" }, { j: "t", l: "#c4def5", k: "#5f84b0", sz: "#2f4f7a" },
  { j: "sz", l: "#f8e0a0", k: "#b5842c", sz: "#7a5420" }, { j: "E", l: "#ddccf5", k: "#7d55b8", sz: "#4b2a7a" },
  { j: "tE", l: "#c8ead8", k: "#4c9a72", sz: "#2c5e44" }, { j: "szE", l: "#f3d0b8", k: "#b8703c", sz: "#6e3c18" }
];
var FZ_AKT = null;   /* a billentyűzet ehhez a füzethez szól */

function fzKulcs(r, c) { return r + "," + c; }
function fzLap(hova, T, o) {
  o = o || {};
  var F = { o: o, idok: [], fut: false, jegyzet: [] };
  fzTBe(F, T);
  fzDoboz(F, hova);
  F.ujLap = function (T2, o2) { fzLapCsere(F, T2, o2 || {}); };
  F.render = function () { fzRajz(F); };
  F.lejatsz = function (kesz) { fzLejatsz(F, kesz); };
  F.allj = function () { F.idok.forEach(clearTimeout); F.idok = []; F.fut = false; };
  F.torol = function () { F.allj(); if (FZ_AKT === F) FZ_AKT = null; if (F.gyoker && F.gyoker.parentNode) F.gyoker.parentNode.removeChild(F.gyoker); };
  F.ellenoriz = function () { return fzVegenEll(F); };
  F.mondoka = function (k) { fzMondoka(F, k); };
  F.felirat = function (s, cls) { fzFelirat(F, s, cls); };
  if (o.elotolt) for (var ek in o.elotolt) F.k[ek] = { v: String(o.elotolt[ek]), ki: "gep" };
  if (o.mod !== "gep") { F.eszkoz = "ceruza"; FZ_AKT = F; fzLepesFrissit(F); F.akt = fzKezdoHely(F); }
  fzRajz(F);
  return F;
}
/* a lap (T) állapota — új lapnál (lapozás, terv → írásbeli lap) újra */
function fzTBe(F, T) {
  F.T = T; F.k = {}; F.vonalak = []; F.akt = null; F.vonalKezd = null; F.hibas = {}; F.hibaOszl = {}; F.hibaDb = {}; F.vilagit = {}; F.uj = {};
  F.hiany = []; F.kesz = false; F.lepesMost = -1; F.lepesKesz = -1; F.talca = null; F.talcaFog = null; F.talcaVillog = null; F.becsOk = !T.mezok.length; F.segMod = false;
  /* az ellenőrzés (a végén ellenőrző módban külön kör): az első ellenőrző lépés és a sora */
  F.ellKezd = -1; T.lepesek.some(function (l, i) { if (l.fazis === "ellenoriz") { F.ellKezd = i; return true; } });
  F.ellSor = Infinity; T.gep.forEach(function (g) { if (F.ellKezd >= 0 && g.lepes === F.ellKezd && g.r < F.ellSor) F.ellSor = g.r; });
  F.ellFazis = F.ellKezd < 0;
  F.gepK = {}; T.gep.forEach(function (g) { if (g.tip !== "vonal") F.gepK[fzKulcs(g.r, g.c)] = g; });
  F.vart = {}; F.jelK = {}; F.mezoK = {};
  T.celok.forEach(function (c) {
    if (c.tip === "szam") F.vart[fzKulcs(c.r, c.c)] = c;
    if (c.tip === "jel" && c.auto) F.jelK[fzKulcs(c.r, c.c)] = c;
  });
  T.mezok.forEach(function (m) { for (var c = m.c0; c <= m.c1; c++) F.mezoK[fzKulcs(m.r, c)] = m; });
  F.szabadK = {}; (T.szabad || []).forEach(function (z) { for (var r = z.r0; r <= z.r1; r++) for (var c = z.c0; c <= z.c1; c++) F.szabadK[fzKulcs(r, c)] = true; });   /* mellékszámítás: ide szabadon ír, a füzet nem nézi */
  F.tervK = {}; if (T.terv && T.terv.nyitott) for (var c = 1; c < T.osz; c++) F.tervK[fzKulcs(T.terv.r, c)] = true;   /* a nyitott terv-sor: szabad írás, jelekkel */
  F.alaK = {}; T.celok.forEach(function (c) { if (c.tip === "szam" && T.lepesek[c.lepes] && T.lepesek[c.lepes].fazis === "ala") F.alaK[c.r] = true; });   /* az alá-írás sorai */
}
/* hol áll a ceruza egy új lap elején: a terv-sor eleje · a fejben-eredmény helye · a becslés · az első alá-írás sor eleje */
function fzKezdoHely(F) {
  var T = F.T;
  if (T.terv && T.terv.nyitott) return { r: T.terv.r, c: 1 };
  if (T.tervEredCel) { var e = T.celok.filter(function (c) { return c.tip === "szam"; })[0]; return e ? { r: e.r, c: e.c } : null; }
  if (!T.alaSorok) return null;   /* a torony lapjain marad a régi: a ceruza az egeret követi, amíg nem koppint */
  if (T.mezok.length) return { r: T.mezok[0].r, c: T.mezok[0].c0 };
  return { r: T.alaSorok[0], c: 1 };
}

/* ═════════════════ A DOBOZ: felirat · lap (+ tálca) · eszközök + számbillentyű ═════════════════ */
function fzDoboz(F, hova) {
  var d = el("div", "fz" + (F.o.mod === "gep" ? " fz-gep" : "") + (F.o.oldalt ? " fz-oldalt" : ""));
  var jelek = F.o.jelek || !!F.T.terv;   /* a terv-sor jelei (+ − · : =) — csak ahol a pálya tervet írat */
  d.innerHTML = (F.o.oldalt ? '<div class="fz-oldal"></div>' : '') + '<div class="fz-jegyzet"></div><div class="fz-felirat" aria-live="polite"></div>' +
    '<div class="fz-asztal"><div class="fz-lapdoboz"><svg class="fz-lap" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="füzetlap"></svg></div>' +
    (F.o.talca ? '<div class="fz-talcadoboz"><svg class="fz-talca" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="tallér-tálca"></svg></div>' : '') + '</div>' +
    (F.o.mod === "gep" ? '' :
    '<div class="fz-alul"><div class="fz-eszk">' +
      '<button type="button" class="fz-eszkoz" data-eszk="ceruza" aria-label="ceruza">' + fzCeruzaSVG() + '</button>' +
      '<button type="button" class="fz-eszkoz" data-eszk="radir" aria-label="radír">' + fzRadirSVG() + '</button></div>' +
    '<div class="fz-bill">' +
      (jelek ? '<span class="fz-jelek">' + [["+", "plusz"], ["−", "mínusz"], ["·", "szorozva"], [":", "osztva"], ["=", "egyenlő"]].map(function (j) {
        return '<button type="button" class="fz-jelgomb fz-muvjel" data-j="' + j[0] + '" aria-label="' + j[1] + '">' + j[0] + '</button>'; }).join("") + '</span>' : '') +
      '<button type="button" class="fz-jelgomb" data-b="pont" aria-label="pont">·</button><button type="button" class="fz-jelgomb" data-b="vesszo" aria-label="felső vessző">\'</button>' +
      '<button type="button" class="fz-jelgomb" data-b="vonal" aria-label="vonal">▁</button>' +
      '<button type="button" class="fz-jelgomb fz-seggomb" data-b="seg" aria-label="kis segédjegy (nem számít)">¹</button></div>' +
    (F.o.ell === "vegen" ? '<button type="button" class="nagy-gomb fz-kesz">Kész ✓</button>' : '') + '</div>' +
    '<input class="fz-be" inputmode="numeric" enterkeyhint="done" autocomplete="off" tabindex="-1" aria-label="a számjegy">');
  hova.appendChild(d);
  F.gyoker = d; F.svg = d.querySelector(".fz-lap"); F.tsvg = d.querySelector(".fz-talca"); F.oldal = d.querySelector(".fz-oldal");
  F.svg.addEventListener("click", function (e) { fzKatt(F, e); });
  F.svg.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") { F.mut = fvPont(F.svg, e); fzKurzor(F); } });
  /* a számjegy úgy jön, mint a játék többi részén (events.js, üres négyzet): egéren a gép billentyűzete (fzBill, e.code — magyar
     kiosztáson is), érintőn a kockára koppintva a rendszer számbillentyűzete ebbe a rejtett mezőbe ír; képernyős számgomb nincs */
  F.be = d.querySelector(".fz-be");
  if (F.be) {
    F.be.addEventListener("input", function () {
      var v = F.be.value.replace(/[^0-9]/g, ""); F.be.value = "";
      v.split("").forEach(function (ch) { fzJegy(F, ch); });
    });
    F.be.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); if (F.o.ell === "vegen") fzVegenEll(F); }
      else if (e.key === "Backspace" && !F.be.value) { e.preventDefault(); fzVissza(F); }
    });
  }
  F.svg.addEventListener("pointerleave", function () { F.mut = null; fzKurzor(F); });
  if (F.tsvg) F.tsvg.addEventListener("click", function (e) { var t = e.target.closest && e.target.closest("[data-rek]"); if (t) fzTalcaKatt(F, Number(t.getAttribute("data-rek"))); });
  var alul = d.querySelector(".fz-alul");
  if (alul) alul.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button"); if (!b || F.kesz) return;
    FZ_AKT = F;
    if (b.dataset.eszk) { hangGomb(); fzEszkoz(F, b.dataset.eszk); return; }
    if (b.classList.contains("fz-kesz")) { hangGomb(); fzVegenEll(F); return; }
    if (b.dataset.j) { fzTervJel(F, b.dataset.j); return; }
    var v = b.dataset.b; if (v == null) return;
    if (v === "seg") { F.segMod = !F.segMod; fzFelirat(F, F.segMod ? "Kis segédjegy: koppints a kockára, és írd be (nem számít bele az eredménybe)." : ""); fzRajz(F); return; }
    if (v === "pont" && F.akt && F.tervK[fzKulcs(F.akt.r, F.akt.c)]) { fzTervJel(F, "·"); return; }   /* a terv-sorban a · a szorzás jele */
    if (/^\d$/.test(v)) fzJegy(F, v); else if (v === "pont" || v === "vesszo") fzJel(F, v); else if (v === "vonal") fzVonalIndit(F);
  });
}
function fzFelirat(F, s, cls) {
  var f = F.gyoker && F.gyoker.querySelector(".fz-felirat"); if (!f) return;
  f.textContent = s || ""; f.className = "fz-felirat" + (cls ? " " + cls : "");
}
/* a ceruza és a radír rajza (a gombon és a lapon, a mutató helyén) */
function fzCeruzaSVG() {
  return '<svg viewBox="-30 -10 60 20" aria-hidden="true"><g transform="rotate(-20)"><path d="M-24 -5H14L24 0L14 5H-24Z" fill="#f7cf4f" stroke="#a87a1e" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M-24 -1.7H14M-24 1.7H14" stroke="#e0ad2e" stroke-width="1"/><path d="M14 -5L24 0L14 5Z" fill="#f1d6ae" stroke="#a87a1e" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M20.5 -1.7L24 0L20.5 1.7Z" fill="#3b3f52"/><path d="M-24 -5h-5v10h5Z" fill="#c9c3d6" stroke="#7d7591" stroke-width="1.4"/></g></svg>';
}
function fzRadirSVG() {
  return '<svg viewBox="-30 -14 60 28" aria-hidden="true"><g transform="rotate(-12)"><rect x="-20" y="-9" width="40" height="18" rx="4" fill="#f6b3c6" stroke="#b4587a" stroke-width="1.6"/>' +
    '<path d="M-4 -9h24v18h-24Z" fill="#9ccbe9" stroke="#4f7fa8" stroke-width="1.6" stroke-linejoin="round"/><path d="M-16 -4h8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></g></svg>';
}

/* ═════════════════ RAJZ ═════════════════ */
function fzX(c) { return FZ_M + c * FZ_S; }
function fzY(r) { return FZ_M + r * FZ_S; }
function fzRajz(F) {
  var T = F.T, S = FZ_S, W = T.osz * S + 2 * FZ_M, H = T.sor * S + 2 * FZ_M, s = "", r, c;
  F.svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  s += '<rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" rx="10" fill="#fffef7" stroke="#e7dcc4" stroke-width="2"/>';
  for (c = 0; c <= T.osz; c++) s += '<path d="M' + fzX(c) + ' ' + FZ_M + 'V' + (H - FZ_M) + '" stroke="#d3e4f4" stroke-width="1"/>';
  for (r = 0; r <= T.sor; r++) s += '<path d="M' + FZ_M + ' ' + fzY(r) + 'H' + (W - FZ_M) + '" stroke="#d3e4f4" stroke-width="1"/>';
  s += '<path d="M' + fzX(1) + ' ' + FZ_M + 'V' + (H - FZ_M) + '" stroke="#f2b8c6" stroke-width="1.4"/>';   /* a füzet margója */
  /* fejléc: E sz t e, a helyiérték színével */
  T.fej.forEach(function (f) {
    var h = FZ_HE[f.hely] || FZ_HE[0];
    s += '<rect x="' + (fzX(f.c) + 1) + '" y="' + (fzY(f.r) + 1) + '" width="' + (S - 2) + '" height="' + (S - 2) + '" fill="' + h.l + '" opacity=".75"/>' +
      '<text x="' + (fzX(f.c) + S / 2) + '" y="' + (fzY(f.r) + 27) + '" text-anchor="middle" font-size="19" font-weight="600" fill="' + h.sz + '" class="fz-t">' + h.j + '</text>';
  });
  if (T.terv) {   /* a terv-sor: halvány sáv + „terv” a margón */
    if (T.terv.nyitott) s += '<rect x="' + (fzX(1) + 1) + '" y="' + (fzY(T.terv.r) + 1) + '" width="' + (W - FZ_M - fzX(1) - 2) + '" height="' + (S - 2) + '" fill="#f3ecfb" opacity=".8"/>';
    s += '<text x="' + (fzX(0) + S / 2) + '" y="' + (fzY(T.terv.r) + 25) + '" text-anchor="middle" font-size="12" fill="#9a86b8" class="fz-t">terv</text>';
  }
  /* kiemelések: a gép épp ezt a lépést írja · a hibás oszlop · a jelölt kocka */
  for (c in F.hibaOszl) s += '<rect x="' + (fzX(+c) + 2) + '" y="' + (FZ_M + 2) + '" width="' + (S - 4) + '" height="' + (H - 2 * FZ_M - 4) + '" rx="6" fill="#ffd6d6" opacity=".7"/>';
  for (var kv in F.vilagit) { var p = kv.split(","); s += '<rect x="' + (fzX(+p[1]) + 2) + '" y="' + (fzY(+p[0]) + 2) + '" width="' + (S - 4) + '" height="' + (S - 4) + '" rx="6" fill="#fff0a8"/>'; }
  var kov = F.o.jelol && !F.kesz && F.o.mod !== "gep" ? fzKovetkezo(F) : null;
  if (kov) s += '<rect class="fz-jelol" x="' + (fzX(kov.c) + 3) + '" y="' + (fzY(kov.r) + 3) + '" width="' + (S - 6) + '" height="' + (S - 6) + '" rx="6" fill="#fff6c7" stroke="#e8c650" stroke-width="2" stroke-dasharray="5 4"/>';
  /* a gép előre felírt része (az ellenőrzés váza csak a maga lépésétől) */
  T.gep.forEach(function (g) {
    if (g.lepes != null && !(F.o.mod === "gep" ? F.gepLepes > g.lepes : F.kesz || F.ellFazis || F.lepesMost >= g.lepes)) return;
    if (g.tip === "vonal") s += fzVonalSVG(g.r, g.c, g.c1, FZ_TINTA, false);
    else if (g.tip === "szoveg") s += '<text x="' + (fzX(g.c) + 5) + '" y="' + (fzY(g.r) + 27) + '" font-size="' + (g.v.length > 3 ? 19 : 21) + '" fill="' + FZ_TINTA + '" class="fz-t">' + g.v + '</text>';
    else s += fzJegySVG(g.r, g.c, g.v, g.ceruza ? FZ_CERUZA : FZ_TINTA, false);   /* ceruza: a gyerek elfogadott terv-sora (lezárva) */
  });
  /* automatikus jel (− a kivonás elé, + az összeadás elé): ha a sorban már van írás */
  for (kv in F.jelK) {
    var j = F.jelK[kv], van = false;
    for (var k2 in F.k) if (F.k[k2].v && +k2.split(",")[0] === j.r) { van = true; break; }
    if (van || F.k[kv]) s += fzJegySVG(j.r, j.c, j.v, FZ_TINTA, !!F.uj[kv]);
  }
  F.vonalak.forEach(function (v) { s += fzVonalSVG(v.r, v.c0, v.c1, v.ki === "gyerek" ? FZ_CERUZA : FZ_TINTA, v.uj); v.uj = false; });
  for (kv in F.k) {
    var x = F.k[kv], q = kv.split(","), rr = +q[0], cc = +q[1], szin = x.ki === "gyerek" ? FZ_CERUZA : FZ_TINTA, uj = !!F.uj[kv];
    if (x.v != null && x.v !== "") s += fzJegySVG(rr, cc, x.v, szin, uj);
    else if (x.pont) s += '<circle cx="' + (fzX(cc) + S / 2) + '" cy="' + (fzY(rr) + 26) + '" r="3.4" fill="' + (x.pontKi === "gyerek" ? FZ_CERUZA : FZ_TINTA) + '"' + (uj ? ' class="fz-uj"' : '') + '/>';
    if (x.seg) s += '<text x="' + (fzX(cc) + 4) + '" y="' + (fzY(rr) + 13) + '" font-size="13" font-weight="500" fill="' + FZ_CERUZA + '" opacity=".8" class="fz-t' + (uj ? ' fz-uj' : '') + '">' + x.seg + '</text>';
    if (x.vesszo) s += '<path d="M' + (fzX(cc) + S - 7) + ' ' + (fzY(rr) + 4) + 'q2 5 -2 10" fill="none" stroke="' + (x.vesszoKi === "gyerek" ? FZ_CERUZA : FZ_TINTA) + '" stroke-width="2.6" stroke-linecap="round"' + (uj ? ' class="fz-uj"' : '') + '/>';
  }
  F.uj = {};
  /* a végén: halványan, ami a formából hiányzik (pont, vessző, vonal) */
  F.hiany.forEach(function (h) {
    if (h.tip === "vonal") s += '<path d="M' + (fzX(h.c) + 4) + ' ' + (fzY(h.r) + S - 2) + 'H' + (fzX(h.c1 + 1) - 4) + '" stroke="#b9a7d6" stroke-width="2.4" stroke-dasharray="4 4"/>';
    else if (h.tip === "pont") s += '<circle cx="' + (fzX(h.c) + S / 2) + '" cy="' + (fzY(h.r) + 26) + '" r="3.4" fill="none" stroke="#b9a7d6" stroke-width="1.6"/>';
    else s += '<path d="M' + (fzX(h.c) + S - 7) + ' ' + (fzY(h.r) + 4) + 'q2 5 -2 10" fill="none" stroke="#b9a7d6" stroke-width="2" stroke-dasharray="2 2"/>';
  });
  for (kv in F.hibas) { q = kv.split(","); s += '<rect x="' + (fzX(+q[1]) + 2) + '" y="' + (fzY(+q[0]) + 2) + '" width="' + (S - 4) + '" height="' + (S - 4) + '" rx="6" fill="none" stroke="#e0475b" stroke-width="3"/>'; }
  if (F.vonalKezd) s += '<rect x="' + (fzX(F.vonalKezd.c) + 2) + '" y="' + (fzY(F.vonalKezd.r) + S - 8) + '" width="' + (S - 4) + '" height="6" rx="3" fill="#8a4fd0" opacity=".55"/>';
  if (F.akt && !F.kesz && F.o.mod !== "gep") s += '<rect class="fz-akt" x="' + (fzX(F.akt.c) + 1.5) + '" y="' + (fzY(F.akt.r) + 1.5) + '" width="' + (S - 3) + '" height="' + (S - 3) + '" rx="6" fill="none" stroke="#8a4fd0" stroke-width="3"/>';
  s += '<g class="fz-kurzor" pointer-events="none"></g>';
  F.svg.innerHTML = s;
  fzKurzor(F);
  if (F.gyoker) [].forEach.call(F.gyoker.querySelectorAll(".fz-eszkoz"), function (b) { b.classList.toggle("kezben", b.dataset.eszk === F.eszkoz); });
  if (F.gyoker) { var sg = F.gyoker.querySelector(".fz-seggomb"); if (sg) sg.classList.toggle("kezben", !!F.segMod); }
  fzJegyzetRajz(F);
  if (F.tsvg) { F.tsvg.parentNode.style.display = T.lepesek.some(function (l) { return l.talca; }) ? "" : "none"; fzTalcaRajz(F); }   /* a terv-lapon nincs tálca */
}
function fzJegySVG(r, c, v, szin, uj) {
  return '<text x="' + (fzX(c) + FZ_S / 2) + '" y="' + (fzY(r) + 29) + '" text-anchor="middle" font-size="27" font-weight="500" fill="' + szin + '" class="fz-t' + (uj ? ' fz-uj' : '') + '">' + v + '</text>';
}
function fzVonalSVG(r, c0, c1, szin, uj) {
  var x0 = fzX(c0) + 4, x1 = fzX(c1 + 1) - 4, y = fzY(r) + FZ_S - 2;
  return '<path d="M' + x0 + ' ' + y + 'Q' + ((x0 + x1) / 2) + ' ' + (y + 1.2) + ' ' + x1 + ' ' + (y - .4) + '" stroke="' + szin + '" stroke-width="2.6" stroke-linecap="round" fill="none"' +
    (uj ? ' class="fz-vonal-uj" style="--h:' + (x1 - x0 + 4) + '"' : '') + '/>';
}
/* a kézben lévő eszköz a lapon. A CERUZA HEGYE abban a kockában áll, ahová a következő jegy kerül (a producer, 11-09);
   ha még nincs kiválasztott kocka, a hegy az egeret követi. A radír az egér alatt (azt a kockát radírozza), különben az aktív kockán. */
function fzCeruzaHegySVG() {   /* a hegy a (0, 0) pontban, a test jobbra nyúlik */
  return '<path d="M12 -6L0 0L12 6Z" fill="#f1d6ae" stroke="#a87a1e" stroke-width="1.4" stroke-linejoin="round"/><path d="M4.6 -2.3L0 0L4.6 2.3Z" fill="#3b3f52"/>' +
    '<path d="M12 -6H52V6H12Z" fill="#f7cf4f" stroke="#a87a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 -2H52M12 2H52" stroke="#e0ad2e" stroke-width="1"/>' +
    '<path d="M52 -6h7v12h-7Z" fill="#c9c3d6" stroke="#7d7591" stroke-width="1.4"/><path d="M59 -6h5a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-5Z" fill="#f6b3c6" stroke="#b4587a" stroke-width="1.4"/>';
}
function fzKurzor(F) {
  var g = F.svg && F.svg.querySelector(".fz-kurzor"); if (!g) return;
  if (!F.eszkoz || F.kesz || F.o.mod === "gep") { g.innerHTML = ""; return; }
  var x, y;
  if (F.eszkoz === "radir") {
    if (F.mut) { x = F.mut.x; y = F.mut.y; } else if (F.akt) { x = fzX(F.akt.c) + FZ_S / 2; y = fzY(F.akt.r) + FZ_S / 2; } else { g.innerHTML = ""; return; }
    g.innerHTML = '<g transform="translate(' + x + ' ' + y + ') scale(.9)" opacity=".92">' + fzRadirSVG().replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + '</g>';
    return;
  }
  if (F.akt) { x = fzX(F.akt.c) + FZ_S * .8; y = fzY(F.akt.r) + FZ_S * .82; }   /* a hegy a kocka jobb alsó részén, a jegy helyét nem takarja */
  else if (F.mut) { x = F.mut.x; y = F.mut.y; }
  else { g.innerHTML = ""; return; }
  g.innerHTML = '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(-38)">' + fzCeruzaHegySVG() + '</g>';
}

/* ═════════════════ ÍRÁS (a gyerek) ═════════════════ */
function fzKatt(F, e) {
  if (F.o.mod === "gep" || F.kesz) return;
  FZ_AKT = F;
  var p = fvPont(F.svg, e), c = Math.floor((p.x - FZ_M) / FZ_S), r = Math.floor((p.y - FZ_M) / FZ_S);
  if (r < 0 || c < 0 || r >= F.T.sor || c >= F.T.osz) return;
  if (F.vonalKezd) { fzVonalVeg(F, r, c); return; }
  if (F.eszkoz === "radir") { fzRadiroz(F, r, c); return; }
  F.eszkoz = "ceruza"; F.akt = { r: r, c: c };
  fzRajz(F);
  if (F.be && fzErinto()) { try { F.be.focus({ preventScroll: true }); } catch (x) { F.be.focus(); } }   /* érintőn: feljön a rendszer számbillentyűzete */
}
function fzErinto() { try { return window.matchMedia && window.matchMedia("(pointer: coarse)").matches; } catch (e) { return false; } }
/* Backspace (mint a játék üres négyzeténél): ha az aktív kockában van valami, azt törli; ha üres, az utoljára írt jegyet, és oda áll vissza */
function fzVissza(F) {
  if (!F.akt || F.kesz) return;
  var kv = fzKulcs(F.akt.r, F.akt.c), x = F.k[kv];
  if (x && (x.v || x.pont || x.vesszo || x.seg)) { fzRadiroz(F, F.akt.r, F.akt.c); return; }
  if (F.tervK[kv]) { for (var c = F.akt.c - 1; c >= 1; c--) { var y = F.k[fzKulcs(F.akt.r, c)]; if (y && y.v) { fzRadiroz(F, F.akt.r, c); return; } } return; }   /* a terv-sorban: mint egy szövegmezőben, balra töröl */
  if (F.utolso && F.k[fzKulcs(F.utolso.r, F.utolso.c)]) fzRadiroz(F, F.utolso.r, F.utolso.c);
}
function fzEszkoz(F, mi) {
  F.vonalKezd = null;
  F.eszkoz = F.eszkoz === mi && mi === "radir" ? "ceruza" : mi;   /* a radír visszatehető: újra koppintás → a ceruza van kézben */
  fzFelirat(F, F.eszkoz === "radir" ? "Koppints a kockára, amit kiradírozol!" : "");
  fzRajz(F);
}
function fzRadiroz(F, r, c) {
  var kv = fzKulcs(r, c), volt = !!F.k[kv];
  if (F.o.hibakeres && !F.hkMegvan && F.k[kv] && F.k[kv].v) {   /* hibakereső: csak a rossz jegyet lehet kiradírozni */
    if (kv !== F.o.hibakeres) { F.hibas[kv] = true; fzRajz(F); fzHiba(F, { hk: true }); F.ido = setTimeout(function () { delete F.hibas[kv]; fzRajz(F); }, 900); F.eszkoz = "ceruza"; return; }
    F.hkMegvan = true; fzFelirat(F, "Megvan! Írd be jól.", "jo");
  }
  delete F.k[kv]; delete F.hibas[kv]; delete F.hibaOszl[c];
  var n0 = F.vonalak.length;
  F.vonalak = F.vonalak.filter(function (v) { return !(v.r === r && c >= v.c0 && c <= v.c1); });
  if (volt || F.vonalak.length !== n0) { ceruzaSerceg(.25); fzMezoUjra(F, r, c); }
  F.eszkoz = "ceruza"; F.akt = { r: r, c: c };   /* kiradíroz és javít — nem kezd elölről */
  if (!(F.o.hibakeres && kv === F.o.hibakeres)) fzFelirat(F, "");
  fzLepesFrissit(F); fzRajz(F);
}
function fzGepTartalom(F, kv) { var g = F.gepK[kv]; return g && g.tip !== "vonal"; }
function fzJegy(F, d) {
  if (!F.akt || F.kesz) return;
  var kv = fzKulcs(F.akt.r, F.akt.c);
  if (F.segMod && !F.tervK[kv] && !fzGepTartalom(F, kv)) {   /* ¹ kis segédjegy (továbbvitel, pótlás): a kocka sarkába, nem számít */
    var y = F.k[kv] || {}; y.seg = String(d); F.k[kv] = y; F.uj[kv] = true; F.segMod = false; ceruzaSerceg(.2); fzFelirat(F, ""); fzRajz(F); return;
  }
  if (F.tervK[kv]) { fzTervIr(F, String(d)); return; }
  if (fzGepTartalom(F, kv) || F.jelK[kv]) { fzRazkod(F); return; }
  if (F.T.alaSorok && !F.alaK[F.akt.r] && !F.mezoK[kv] && !fzAlaKesz(F)) { fzFelirat(F, "Előbb írd egymás alá a számokat, a fejléc alá!", "kerd"); fzRazkod(F); return; }   /* elcsúszott tagokkal nem lehet számolni (kiskapu) */
  if (F.o.hibakeres && !F.hkMegvan) { fzFelirat(F, "Előbb keresd meg, melyik jegy rossz, és radírozd ki!", "kerd"); fzRazkod(F); return; }
  if (!F.becsOk && !F.mezoK[kv]) { fzFelirat(F, F.T.muv === "oszt" ? "Előbb becsülj: írd a B: sorba, mettől meddig lehet a hányados!" : "Előbb becsülj: írd a B: sorba, mennyi lesz körülbelül!", "kerd"); fzRazkod(F); return; }
  var x = F.k[kv] || {}; x.v = String(d); x.ki = "gyerek"; F.k[kv] = x; F.uj[kv] = true;
  delete F.hibas[kv]; delete F.hibaOszl[F.akt.c];
  ceruzaSerceg(.3);
  var r = F.akt.r, c = F.akt.c, jo = true;
  F.utolso = { r: r, c: c };
  if (F.szabadK[kv]) { if (c + 1 < F.T.osz && F.szabadK[fzKulcs(r, c + 1)]) F.akt = { r: r, c: c + 1 }; fzRajz(F); return; }   /* mellékszámítás: nincs jó/rossz */
  if (F.mezoK[kv]) jo = fzMezoEll(F, F.mezoK[kv], true);   /* a becslést mindig azonnal nézi: rossz becsléssel nem indul a számolás (kiskapu) */
  else if (F.o.ell === "lepes") jo = fzLepesEll(F, kv);
  else if (F.vart[kv] && F.vart[kv].v === x.v && F.vart[kv].lepes > F.lepesKesz) F.lepesKesz = F.vart[kv].lepes;
  /* tovább MAGÁTÓL a következő kockába (a producer, 11-10): a becslés-sorban mindig jobbra, amíg a szám tart (akárhol kezdte);
     jelölésnél a következő kijelölt helyre; különben a szorzás balra, az osztás jobbra lép. Rossz jegy után helyben marad (ott javít). */
  if (jo) {
    var m = F.mezoK[kv], mKesz = m && fzMezoSzam(F, m).length >= m.v.length;
    var kov = F.o.jelol && (!m || mKesz) ? fzKovetkezo(F) : null;
    if (m && !mKesz) { if (c + 1 <= m.c1 && !fzGepTartalom(F, fzKulcs(r, c + 1))) F.akt = { r: r, c: c + 1 }; }
    else if (m && F.T.alaSorok && !F.o.jelol) F.akt = { r: F.T.alaSorok[0], c: 1 };   /* ➕➖ a becslés után: az első szám sorának eleje */
    else if (kov && kov.tip === "szam") F.akt = { r: kov.r, c: kov.c };
    else if (kov && F.T.alaSorok) { var ks = F.T.celok.filter(function (x) { return x.tip === "szam" && x.kell && x.mezo == null && !fzCelJo(F, x); })[0]; if (ks) F.akt = { r: ks.r, c: ks.c }; }   /* ➕➖ a (nem kötelező) vonal-kérés mellett a ceruza már a következő jegynél */
    else if (!F.o.jelol || m) { var nc = c + (m ? 1 : F.T.lep); if (nc >= 0 && nc < F.T.osz && !fzGepTartalom(F, fzKulcs(r, nc)) && !F.mezoK[fzKulcs(r, nc)] === !m) F.akt = { r: r, c: nc }; }
    if (!m && !(F.o.jelol && kov)) fzCsoportLep(F, r, c);   /* többjegyű szám (pl. 4-szer 6, meg 2 = 26): az elejére, onnan jobbra (a producer, 11-10) */
    if (!m && !F.o.jelol && F.alaK[r]) fzAlaTovabb(F, r, c);
  }
  fzLepesFrissit(F);
  fzRajz(F);
  if (F.o.ell === "lepes") fzKeszE(F);
}
/* ── ➕➖ alá-írás: kész-e, és hová lép a ceruza egy tag után (jelölés nélkül: a következő sor ELEJÉRE — a helyet a gyerek találja meg) ── */
function fzAlaKesz(F) { return F.T.celok.every(function (c) { return !(c.tip === "szam" && c.kell && F.alaK[c.r]) || fzCelJo(F, c); }); }
function fzAlaTovabb(F, r, c) {
  var most = F.vart[fzKulcs(r, c)]; if (!most) return;
  var sor = F.T.celok.filter(function (x) { return x.tip === "szam" && x.r === r; });
  if (!sor.every(function (x) { return fzCelJo(F, x); })) return;   /* a szám még nincs kész */
  F.akt = F.alaK[r + 1] ? { r: r + 1, c: 1 } : (fzAlaKesz(F) ? { r: r + 1, c: F.T.U } : F.akt);   /* az utolsó tag után: az eredmény sorában az egyesek */
}

/* ═════════════════ 📝 A TERV-SOR: a gyerek írja (3845 + 2850 =), az = után a pálya dönt (o.onTerv) ═════════════════
   o.onTerv(F, terv) → { lap: T } (írásbeli lap: a terv-sor lezárva fölé kerül) · { fejben: n } (az eredményt az = után írja) ·
   { hiba: "mondat" } (csapda: a pálya szövege) · semmi → „nézd meg még egyszer”. terv: { tagok, jelek, kif, szoveg, eqC }. */
function fzTervIr(F, v) {
  var a = F.akt, kv = fzKulcs(a.r, a.c), x = F.k[kv] || {};
  x.v = v; x.ki = "gyerek"; F.k[kv] = x; F.uj[kv] = true; F.utolso = { r: a.r, c: a.c };
  for (var h in F.hibas) if (F.tervK[h]) delete F.hibas[h];
  ceruzaSerceg(.3);
  if (a.c + 1 < F.T.osz) F.akt = { r: a.r, c: a.c + 1 };
  fzRajz(F);
  if (v === "=") fzTervEll(F);
}
function fzTervJel(F, j) {
  if (!F.akt || F.kesz || F.o.mod === "gep") return;
  if (!F.tervK[fzKulcs(F.akt.r, F.akt.c)]) { fzFelirat(F, "A jeleket a terv-sorba írd!", "kerd"); fzRazkod(F); return; }
  fzTervIr(F, j);
}
function fzTervOlvas(F) {   /* a terv-sor cellái balról jobbra: szám (egymás melletti jegyek) · jel; üres kocka = szóköz */
  var T = F.T, r = T.terv.r, tok = [], szam = "", eqC = -1, uresVolt = false, hiba = null;
  for (var c = 1; c < T.osz; c++) {
    var x = F.k[fzKulcs(r, c)], v = x && x.v ? x.v : "";
    if (/^\d$/.test(v)) { if (szam && uresVolt) { hiba = "jel"; } szam += v; uresVolt = false; continue; }
    if (szam && !v) { uresVolt = true; continue; }
    if (szam) { tok.push(Number(szam)); szam = ""; uresVolt = false; }
    if (v) { tok.push(v); if (v === "=") { eqC = c; break; } }
  }
  if (szam) tok.push(Number(szam));
  var tagok = [], jelek = [];
  tok.forEach(function (t, i) { if (i % 2 === 0) { if (typeof t === "number") tagok.push(t); else hiba = hiba || "szam"; } else if (t !== "=") { if (typeof t === "string") jelek.push(t); else hiba = hiba || "jel"; } });
  if (!hiba && (tok[tok.length - 1] !== "=" || tagok.length < 2 || jelek.length !== tagok.length - 1)) hiba = tagok.length < 2 ? "ketszam" : "szam";
  return { tagok: tagok, jelek: jelek, eqC: eqC, hiba: hiba, kif: tagok.map(function (t, i) { return (i ? jelek[i - 1] + " " : "") + t; }).join(" "),
           szoveg: tagok.map(function (t, i) { return (i ? " " + jelek[i - 1] + " " : "") + t; }).join("") + " =" };
}
function fzTervEll(F) {
  var t = fzTervOlvas(F);
  if (t.eqC < 0) { fzFelirat(F, "A terv végére írd az = jelet!", "kerd"); return false; }
  if (t.hiba) {
    fzTervHiba(F, t.hiba === "jel" ? "A két szám közé jel kell: + − · vagy :" : t.hiba === "ketszam" ? "A tervbe legalább két szám és egy jel kell, a végére =." : "Nézd meg a terv-sort: szám, jel, szám… a végén =.");
    return false;
  }
  var v = F.o.onTerv ? F.o.onTerv(F, t) : null;
  if (v && v.lap) { fzLapCsere(F, v.lap, { tervTok: t }); return true; }
  if (v && v.fejben != null) { fzLapCsere(F, irTervLap({ osz: F.T.osz, ered: v.fejben, eredC: t.eqC + 1 }), { tervTok: t }); return true; }
  fzTervHiba(F, v && v.hiba ? v.hiba : "Nézd meg még egyszer: ez a terv nem a kérdésre felel.", v && v.csendes);
  return false;
}
function fzTervHiba(F, s, csendes) {
  for (var kv in F.tervK) if (F.k[kv] && F.k[kv].v) F.hibas[kv] = true;
  F.tervHibaDb = (F.tervHibaDb || 0) + 1;
  if (!csendes && !F.o.csendesHiba) beep(220, .14, "triangle", 0, .05);
  if (!(F.o.onHiba && F.o.onHiba(F, { terv: true, n: F.tervHibaDb, uzenet: s }) === true)) fzFelirat(F, s + " Radírozd ki, amit javítanál.", "kerd");
  fzRajz(F);
}
/* új lap ugyanabban a füzetben: terv → írásbeli lap (a gyerek terv-sora lezárva fölé kerül) · lapozás többlépéses feladatnál (o.jegyzet:
   az előző lap terv-sora és eredménye a jegyzetbe — egy lépés = egy lap, így minden lap elfér egy képernyőn) */
function fzLapCsere(F, T2, o) {
  var regi = F.T;
  if (o.tervTok && T2.terv) {
    var r0 = regi.terv.r, eq = -1;
    for (var c = 1; c < regi.osz; c++) {
      var x = F.k[fzKulcs(r0, c)]; if (!x || !x.v) continue;
      T2.gep.push({ r: T2.terv.r, c: c, v: x.v, tip: /\d/.test(x.v) ? "szam" : "jel", lepes: null, ceruza: true }); T2.hely(T2.terv.r, c);
      if (x.v === "=") { eq = c; break; }
    }
    T2.tervEq = eq; T2.tervSzoveg = o.tervTok.szoveg;
    if (T2.ered != null && !T2.tervEredCel) T2.hely(T2.terv.r, eq + String(T2.ered).length);
  }
  if (o.jegyzet) F.jegyzet.push(o.jegyzet);
  fzTBe(F, T2);
  if (F.o.mod !== "gep") { F.eszkoz = "ceruza"; FZ_AKT = F; fzLepesFrissit(F); F.akt = fzKezdoHely(F); }
  fzFelirat(F, "");
  fzRajz(F);
  if (F.o.onLap) F.o.onLap(F, T2);
}
function fzJegyzetRajz(F) {
  var d = F.gyoker && F.gyoker.querySelector(".fz-jegyzet"); if (!d) return;
  d.innerHTML = F.jegyzet.map(function (s) { return '<span class="fz-jegyzet-sor">' + s + '</span>'; }).join("");
  d.classList.toggle("van", !!F.jegyzet.length);
}
function fzJel(F, mi) {
  if (!F.akt || F.kesz) return;
  var kv = fzKulcs(F.akt.r, F.akt.c), x = F.k[kv] || {};
  if (mi === "pont") { if (x.v || fzGepTartalom(F, kv)) { fzRazkod(F); return; } x.pont = !x.pont; x.pontKi = "gyerek"; }
  else { x.vesszo = !x.vesszo; x.vesszoKi = "gyerek"; }
  F.k[kv] = x; F.uj[kv] = true; ceruzaSerceg(.15);
  fzLepesFrissit(F); fzRajz(F);
}
function fzVonalIndit(F) {
  if (F.kesz) return;
  if (F.akt) { F.vonalKezd = { r: F.akt.r, c: F.akt.c }; fzFelirat(F, "Koppints oda, ahol a vonal véget ér!"); }
  else fzFelirat(F, "Koppints előbb arra a kockára, ahol a vonal kezdődik, aztán a ▁ gombra!");
  fzRajz(F);
}
function fzVonalVeg(F, r, c) {
  var k = F.vonalKezd, c0 = Math.min(k.c, c), c1 = Math.max(k.c, c);
  F.vonalKezd = null; F.vonalak.push({ r: k.r, c0: c0, c1: c1, ki: "gyerek", uj: true });
  ceruzaSerceg(.5); fzFelirat(F, "");
  F.akt = { r: k.r, c: c };
  fzLepesFrissit(F); fzRajz(F);
}
function fzRazkod(F) { beep(180, .12, "triangle", 0, .05); var a = F.svg.querySelector(".fz-akt"); if (a) { a.classList.remove("fz-razkod"); void a.getBBox(); a.classList.add("fz-razkod"); } }
function fzBill(e) {
  var F = FZ_AKT; if (!F || F.kesz || F.o.mod === "gep" || !F.gyoker || !document.body.contains(F.gyoker) || !F.gyoker.offsetParent) return;
  var t = e.target && e.target.tagName; if ((t === "INPUT" || t === "TEXTAREA") && e.target !== F.be) return;
  if (e.target === F.be && (/^\d$/.test(e.key) || e.key === "Backspace" || e.key === "Enter")) return;   /* ezt a rejtett mező maga kezeli */
  var d = null;
  if (!e.shiftKey && /^(Digit|Numpad)\d$/.test(e.code || "")) d = e.code.slice(-1);
  else if (/^\d$/.test(e.key)) d = e.key;
  if (d != null) { e.preventDefault(); fzJegy(F, d); return; }
  if (F.akt && F.tervK[fzKulcs(F.akt.r, F.akt.c)]) {   /* a terv-sorban a jelek: + - * : = (a magyar billentyűzeten is az e.key számít) */
    var jm = { "+": "+", "-": "−", "−": "−", "*": "·", "·": "·", "x": "·", ":": ":", "/": ":", "=": "=" }[e.key];
    if (jm) { e.preventDefault(); fzTervJel(F, jm); return; }
  }
  if (e.key === "." || e.key === "," || e.key === "*") { e.preventDefault(); fzJel(F, "pont"); return; }
  if (e.key === "'" || e.key === "`") { e.preventDefault(); fzJel(F, "vesszo"); return; }
  if (e.key === "_" || e.key === "-") { e.preventDefault(); fzVonalIndit(F); return; }
  if (e.key === "Backspace" && F.akt) { e.preventDefault(); fzVissza(F); return; }
  if (e.key === "Delete" && F.akt) { e.preventDefault(); fzRadiroz(F, F.akt.r, F.akt.c); return; }
  if (e.key === "Escape") { F.vonalKezd = null; F.eszkoz = "ceruza"; fzFelirat(F, ""); fzRajz(F); return; }
  if (e.key === "Enter" && F.o.ell === "vegen") { e.preventDefault(); fzVegenEll(F); return; }
  var ny = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
  if (ny) {
    e.preventDefault();
    var a = F.akt || { r: F.T.muvSor || 0, c: 1 };
    F.akt = { r: Math.max(0, Math.min(F.T.sor - 1, a.r + ny[0])), c: Math.max(0, Math.min(F.T.osz - 1, a.c + ny[1])) };
    fzRajz(F);
  }
}
document.addEventListener("keydown", fzBill);

/* ═════════════════ ELLENŐRZÉS ═════════════════ */
function fzMezoSzam(F, m) { var s = ""; for (var c = m.c0; c <= m.c1; c++) { var x = F.k[fzKulcs(m.r, c)]; if (x && x.v) s += x.v; } return s; }
function fzMezoEll(F, m, azonnal) {
  var s = fzMezoSzam(F, m);
  if (s.length < m.v.length) return true;   /* még írja */
  if (s === m.v) { fzBecsUjra(F); return true; }
  if (!azonnal) return false;
  for (var c = m.c0; c <= m.c1; c++) { var kv = fzKulcs(m.r, c); if (F.k[kv] && F.k[kv].v) F.hibas[kv] = true; }
  fzHiba(F, { cel: F.T.celok.filter(function (x) { return x.mezo === m.id; })[0] || null });
  return false;
}
function fzMezoUjra(F, r, c) { var m = F.mezoK[fzKulcs(r, c)]; if (m) { for (var cc = m.c0; cc <= m.c1; cc++) delete F.hibas[fzKulcs(m.r, cc)]; fzBecsUjra(F); } }
function fzBecsUjra(F) {
  var ok = F.T.mezok.every(function (m) { return fzMezoSzam(F, m) === m.v; });
  if (ok && !F.becsOk) fzFelirat(F, "");
  F.becsOk = ok;
}
function fzCelJo(F, cel) { var x = F.k[fzKulcs(cel.r, cel.c)]; return !!(x && x.v === cel.v); }
function fzLepesEll(F, kv) {
  var cel = F.vart[kv], x = F.k[kv];
  if (cel && x.v === cel.v) { if (cel.lepes > F.lepesKesz) F.lepesKesz = cel.lepes; return true; }
  F.hibas[kv] = true;
  fzHiba(F, { cel: cel || null, ala: !!F.alaK[+kv.split(",")[0]] || !!(cel && F.alaK[cel.r]) });
  return false;
}
/* hiba-lépcső (recept-lap ④ 6.): 1. hiba — piros szél, a tálcán a kupac villog · 2. hibától — a mondóka; megoldást sosem ír ki */
function fzHiba(F, info) {
  var id = info.cel ? info.cel.id : "x" + (info.oszlopok ? "o" : "");
  info.n = F.hibaDb[id] = (F.hibaDb[id] || 0) + 1;
  if (!F.o.csendesHiba) beep(220, .14, "triangle", 0, .05);
  if (F.o.onHiba && F.o.onHiba(F, info) === true) return;
  if (info.hk) { fzFelirat(F, "Ez jó volt, visszaírtam. Keresd tovább: számold újra " + (F.T.muv === "oszt" ? "lépésenként" : "oszloponként") + "!", "kerd"); return; }
  if (info.oszlopok) { fzFelirat(F, "Nézd meg még egyszer a kiszínezett oszlopokat! Radírozd ki, ami nem jó, és javítsd.", "kerd"); return; }
  var L = info.cel ? F.T.lepesek[info.cel.lepes] : null;
  if (info.ala && (!info.cel || info.n < 2)) { fzFelirat(F, "Nézd meg a fejlécet: az egyesek az egyesek alá, a tízesek a tízesek alá! Radírozd ki, és írd a helyére.", "kerd"); return; }
  if (!info.cel) { fzFelirat(F, "Ebbe a kockába most nem kell írni.", "kerd"); return; }
  if (info.n >= 2 && F.o.mondoka !== "nincs") fzMondoka(F, info.cel.lepes);
  else {
    fzFelirat(F, info.cel.mezo != null ? "Nézd meg még egyszer: mire kerekítesz?" : "Nem talált. Számold meg még egyszer!", "kerd");
    if (L && L.talca && F.talca) { F.talcaVillog = L.talca.muv.length ? L.talca.muv[0].p : null; fzTalcaRajz(F); }
  }
}
function fzMondoka(F, k, kerd) {   /* kerd: csak a kérdés-alak (a lépés elején), a megoldás nélkül — a teljes mondóka a 2. hibától */
  var L = F.T.lepesek[k]; if (!L) return;
  var m = kerd && L.k ? L.k : L.m;
  fzFelirat(F, m, "mondoka");
  if (F.o.hang !== false && typeof mondd === "function") mondd(kerd && L.k ? irKimond(L.k) : L.h);
}
/* a végén: minden jegy a helyén? (a részletszorzatok sorrendje szabad: csere-csoport) — a hibás OSZLOPOK gyulladnak ki */
function fzVegenEll(F) {
  if (F.kesz) return true;
  if (F.T.terv && F.T.terv.nyitott) return fzTervEll(F);
  var T = F.T, hibak = {}, rossz = false;
  if (!T.mezok.every(function (m) { return fzMezoSzam(F, m) === m.v; })) {
    T.mezok.forEach(function (m) { if (fzMezoSzam(F, m) !== m.v) for (var c = m.c0; c <= m.c1; c++) hibak[c] = true; });
    rossz = true;
  }
  /* sor-csere: a csoport soraihoz a legjobban illő sorrend */
  var sorMap = {};
  T.csere.forEach(function (sorok) {
    var legjobb = null, lh = Infinity;
    fzPermutaciok(sorok).forEach(function (perm) {
      var h = 0; sorok.forEach(function (rv, i) { h += fzSorHiba(F, perm[i], rv).length; });
      if (h < lh) { lh = h; legjobb = perm; }
    });
    sorok.forEach(function (rv, i) { sorMap[legjobb[i]] = rv; });   /* a gyerek sora (legjobb[i]) ← a várt sor (rv) */
  });
  var sorVeg = F.ellFazis ? T.sor : Math.min(T.sor, F.ellSor);   /* előbb csak a számolás, aztán az ellenőrzés */
  for (var r = 0; r < sorVeg; r++) {
    fzSorHiba(F, r, sorMap[r] != null ? sorMap[r] : r).forEach(function (c) { hibak[c] = true; rossz = true; });
  }
  F.hibaOszl = hibak; F.hibas = {};
  if (rossz) { fzHiba(F, { oszlopok: Object.keys(hibak).map(Number) }); fzRajz(F); return false; }
  if (!F.ellFazis) {
    F.ellFazis = true; F.akt = { r: Math.min(T.sor - 1, F.ellSor + 2), c: T.U || 1 }; F.eszkoz = "ceruza";
    fzFelirat(F, "Jó! Most ellenőrizd: " + (T.lepesek[F.ellKezd] ? (T.lepesek[F.ellKezd].k || T.lepesek[F.ellKezd].m).replace(/^Ellenőrzés:?\s*/, "") : ""), "jo");
    fzRajz(F); return false;
  }
  fzKesz(F); return true;
}
/* a gyerek r. sora a várt rv. sorhoz mérve: a hibás oszlopok (hiányzó, rossz vagy fölösleges jegy); a becslés-sor külön (mezo) */
function fzSorHiba(F, r, rv) {
  var T = F.T, ki = [], c, cel, x;
  for (c = 0; c < T.osz; c++) {
    if (F.mezoK[fzKulcs(r, c)] || F.mezoK[fzKulcs(rv, c)]) continue;
    if (F.szabadK[fzKulcs(r, c)] || F.szabadK[fzKulcs(rv, c)]) continue;
    cel = F.vart[fzKulcs(rv, c)]; x = F.k[fzKulcs(r, c)];
    var v = x && x.v ? x.v : null;
    if (cel) { if (cel.opc ? (v != null && v !== cel.v) : v !== cel.v) ki.push(c); }
    else if (v != null) ki.push(c);
  }
  return ki;
}
function fzPermutaciok(a) {
  if (a.length <= 1) return [a.slice()];
  var ki = []; a.forEach(function (x, i) { fzPermutaciok(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (p) { ki.push([x].concat(p)); }); });
  return ki;
}
function fzKeszE(F) {
  if (F.kesz || !F.becsOk || (F.T.terv && F.T.terv.nyitott)) return;
  var mind = F.T.celok.every(function (c) { return c.tip !== "szam" || !c.kell || c.mezo != null || fzCelJo(F, c); });   /* a becslés szabad helyű: azt a becsOk nézi (11-11: a javasolt helytől eltérő becslésnél nem lett kész) */
  if (mind) fzKesz(F);
}
function fzKesz(F) {
  F.kesz = true; F.akt = null; F.eszkoz = null; F.hibaOszl = {}; F.hibas = {}; F.talcaVillog = null;
  F.hiany = fzHianyzoJelek(F);
  var T = F.T;
  if (T.terv && !T.tervEredCel && T.ered != null && T.tervEq >= 0) {   /* a végeredmény a terv-sor végére: 5488 − 2826 = 2662 */
    String(T.ered).split("").forEach(function (ch, i) { var kv = fzKulcs(T.terv.r, T.tervEq + 1 + i); F.k[kv] = { v: ch, ki: "gyerek" }; F.uj[kv] = true; });
  }
  fzFelirat(F, F.hiany.length ? "Kész! A halvány jelek is a füzetbe valók." : "Kész!", "jo");
  fzRajz(F);
  if (F.o.onKesz) F.o.onKesz(F);
}
function fzHianyzoJelek(F) {
  var ki = [];
  F.T.celok.forEach(function (c) {
    var x = F.k[fzKulcs(c.r, c.c)];
    if (c.tip === "pont" && !(x && (x.pont || x.v))) ki.push(c);
    else if (c.tip === "vesszo" && !(x && x.vesszo)) ki.push(c);
    else if (c.tip === "vonal" && !F.vonalak.some(function (v) { return v.r === c.r && v.c0 <= c.c && v.c1 >= c.c1 - 1; })) ki.push(c);
  });
  return ki;
}
/* a következő hely, ahová írni kell (a jelöléshez): az első hiányzó jegy; a pont, a vessző és a vonal csak a még előttünk álló lépésekből */
function fzKovetkezo(F) {
  var T = F.T;
  for (var i = 0; i < T.celok.length; i++) {
    var c = T.celok[i], x = F.k[fzKulcs(c.r, c.c)];
    if (c.tip === "szam" && c.mezo != null) {   /* a becslés: szabad helyű szám — ha már egyezik, kész; ha félig írta, az utolsó jegye utáni kocka */
      var m = T.mezok[c.mezo], ms = fzMezoSzam(F, m);
      if (ms === m.v) continue;
      if (ms.length && ms.length < m.v.length) { for (var cc = m.c1; cc >= m.c0; cc--) { var y = F.k[fzKulcs(m.r, cc)]; if (y && y.v) return { r: m.r, c: Math.min(m.c1, cc + 1), tip: "szam", lepes: c.lepes, mezo: c.mezo }; } }
      return c;
    }
    if (c.tip === "szam") { if (!F.becsOk) continue; if (!(x && x.v === c.v) && !(c.opc && F.lepesKesz > c.lepes)) return c; }
    else if (c.lepes >= F.lepesKesz) {   /* a már lezárt lépések jelei nem tartják fel (nem kötelezők) */
      if (c.tip === "pont" && !(x && (x.pont || x.v))) return c;
      if (c.tip === "vesszo" && !(x && x.vesszo)) return c;
      if (c.tip === "vonal" && !F.vonalak.some(function (v) { return v.r === c.r && v.c0 <= c.c && v.c1 >= c.c1 - 1; })) return c;
    }
  }
  return null;
}
/* melyik lépésnél tart a gyerek → a tálca és (ha kell) a mondóka ehhez igazodik */
function fzLepesFrissit(F) {
  if (F.o.mod === "gep") return;
  var kov = fzKovetkezo(F), k = kov ? kov.lepes : F.T.lepesek.length;
  if (F.jelKerd) { F.jelKerd = false; fzFelirat(F, ""); }   /* a pont / vessző / vonal felszólítás csak addig áll, amíg aktuális */
  if (kov && F.o.jelol && kov.tip !== "szam") {
    F.jelKerd = true;
    fzFelirat(F, kov.tip === "pont" ? "Pontozd ki a hányados helyét: koppints a kockára, aztán a · gombra!" :
      kov.tip === "vesszo" ? "Tegyél felső vesszőt a jegy fölé: koppints rá, aztán a ' gombra!" :
      "Húzz vonalat: koppints a kezdő kockára, a ▁ gombra, aztán a vonal végére!", "kerd");
  }
  if (k === F.lepesMost) return;
  F.lepesMost = k;
  if ((F.o.mondoka === "mindig" || F.o.mondoka === "kerdes") && F.T.lepesek[k] && kov && kov.tip === "szam") fzMondoka(F, k, F.o.mondoka === "kerdes");
  if (F.o.talca) {   /* a lépés elején a tálcán ott a kupac (a szorzat / a maradék); a köteg-átvitel és a felváltás a gyereké */
    var L = null; for (var i = k; i >= 0; i--) if (F.T.lepesek[i] && F.T.lepesek[i].talca) { L = F.T.lepesek[i]; break; }
    if (L) {
      var auto = L.talca.muv.filter(function (m) { return m.t === "hozzaad"; });   /* a kivonás (elvesz) a lépés végén: a következő lépés kezdő állapota már tartalmazza */
      F.talca = irTalcaLep(L.talca.elotte, auto);
    } else if (!F.talca) F.talca = fzTalcaKezdo(F);
    F.talcaFog = null; F.talcaVillog = null;
  }
  if (F.o.onLepes) F.o.onLepes(F, k);
}
function fzTalcaKezdo(F) {
  var L = F.T.lepesek.filter(function (l) { return l.talca; })[0];
  return L ? irTalcaMasol(L.talca.elotte) : {};
}

/* ═════════════════ GÉP ÍR: a lap végigírása mondókával (Rajt, bemutatás) ═════════════════ */
function fzLejatsz(F, kesz) {
  F.allj(); F.fut = true; F.k = {}; F.vonalak = []; F.kesz = false; F.gepLepes = 0;
  var T = F.T, i = 0, tempo = F.o.tempo || 1, gyors = window.__UC_GYORS ? 0.15 : 1;
  function ido(fn, ms) { F.idok.push(setTimeout(fn, ms * gyors / tempo)); }
  if (F.o.talca) F.talca = fzTalcaKezdo(F);
  fzRajz(F);
  function lepes() {
    if (!F.fut) return;
    if (i >= T.lepesek.length) { F.fut = false; F.vilagit = {}; fzFelirat(F, "Kész a lap.", "jo"); fzRajz(F); if (kesz) kesz(); return; }
    F.gepLepes = i + 1;
    var L = T.lepesek[i++], celok = L.celok.map(function (id) { return T.celok[id]; }), j = 0, irasKesz = false, beszKesz = false;
    F.vilagit = {}; celok.forEach(function (c) { if (c.tip !== "vonal") F.vilagit[fzKulcs(c.r, c.c)] = true; else for (var x = c.c; x <= c.c1; x++) F.vilagit[fzKulcs(c.r, x)] = true; });
    fzFelirat(F, L.m, "mondoka");
    fzRajz(F);
    function tovabb() { if (irasKesz && beszKesz) ido(lepes, 450); }
    if (F.o.hang !== false && typeof mondd === "function" && !window.__UC_GYORS) mondd(L.h, function () { beszKesz = true; tovabb(); });
    else ido(function () { beszKesz = true; tovabb(); }, 900 + L.m.length * 25);
    var tm = L.talca ? L.talca.muv.slice() : [];
    if (L.talca) { F.talca = irTalcaMasol(L.talca.elotte); fzTalcaRajz(F); }
    function talcaLep() {
      if (!tm.length) return ir();
      var m = tm.shift(); F.talca = irTalcaLep(F.talca, [m]); F.talcaVillog = m.p; fzTalcaRajz(F); beep(m.t === "koteg" ? 660 : 520, .06, "sine", 0, .04);
      ido(talcaLep, m.t === "hozzaad" || m.t === "elvesz" ? 700 : 420);
    }
    function ir() {
      F.talcaVillog = null; if (F.tsvg) fzTalcaRajz(F);
      if (j >= celok.length) { irasKesz = true; tovabb(); return; }
      var c = celok[j++], kv = fzKulcs(c.r, c.c), x = F.k[kv] || {};
      if (c.tip === "szam" || c.tip === "jel") { x.v = c.v; x.ki = "gep"; }
      else if (c.tip === "pont") { x.pont = true; x.pontKi = "gep"; }
      else if (c.tip === "vesszo") { x.vesszo = true; x.vesszoKi = "gep"; }
      if (c.tip === "vonal") F.vonalak.push({ r: c.r, c0: c.c, c1: c.c1, ki: "gep", uj: true });
      else { F.k[kv] = x; F.uj[kv] = true; }
      ceruzaSerceg(c.tip === "vonal" ? .5 : .25);
      fzRajz(F);
      ido(ir, c.tip === "vonal" ? 650 : 380);
    }
    ido(talcaLep, 600);
  }
  lepes();
}

/* ═════════════════ 🪙 A TALLÉR-TÁLCA (a kép: kfTalca, keret.js) ═════════════════
   Felvesz–letesz: koppintás egy rekeszre → ha van benne 10, egy 10-es KÖTEG kerül a kézbe (letenni a bal szomszédba: 1 nagyobb
   tallér lesz belőle); ha kevesebb, 1 tallér (letenni a jobb szomszédba: FELVÁLTJA 10 kisebbre). Máshova koppintás: vissza. */
function fzTalcaRajz(F) {
  if (!F.tsvg) return;
  var db = F.talca || {}, max = 2, p;
  for (p in db) if (+p > max && db[p]) max = +p;
  F.T.lepesek.forEach(function (l) { if (l.talca) for (var q in l.talca.elotte) if (+q > max && l.talca.elotte[q]) max = +q; });
  var n = max + 1, w = n * 116 + 8;
  F.tsvg.setAttribute("viewBox", "0 0 " + w + " 210");
  F.tsvg.innerHTML = '<defs>' + HE_DEFS + '</defs>' + kfTalca(4, 4, n, db, { fog: F.talcaFog, villog: F.talcaVillog });
}
function fzTalcaKatt(F, p) {
  if (F.o.mod === "gep" || F.kesz || !F.talca) return;
  var db = F.talca, fog = F.talcaFog;
  if (fog) {
    if (fog.t === "koteg" && p === fog.p + 1) { db[fog.p] -= 10; db[p] = (db[p] || 0) + 1; beep(660, .07, "sine", 0, .05); }
    else if (fog.t === "egy" && p === fog.p - 1) { db[fog.p] -= 1; db[p] = (db[p] || 0) + 10; beep(520, .07, "sine", 0, .05); }
    F.talcaFog = null;
  } else if ((db[p] || 0) >= 10) F.talcaFog = { t: "koteg", p: p };
  else if ((db[p] || 0) >= 1 && p > 0) F.talcaFog = { t: "egy", p: p };
  F.talcaVillog = null;
  fzTalcaRajz(F);
}

/* ═════════════════ 🧪 PRÓBALAP: ?fuzetproba — egy szorzás és egy osztás, „gép ír” és „gyerek ír” módban ═════════════════ */
var FZ_PROBA = /[?&]fuzetproba\b/.test(location.search);
var FZ_PROBA_SOR = [["szor", 156, 4], ["szor", 42, 92], ["oszt", 756, 3], ["oszt", 1771, 7], ["oszt", 618, 3], ["oszt", 1942, 34],
  /* ➕➖ Déli vásár, 1. kör (11-11): a gyerek-módban terv-sorral kezd */
  ["ossz", [3845, 2850]], ["ossz", [179, 288, 376]], ["ossz", [3208, 375, 88]], ["kiv", 5488, 2826], ["kiv", 403, 168], ["kiv", 1000, 925],
  ["fejben", [40, 25]], ["ket", [310, 375, 240], 1000]];
function fzProbaCim(p) {
  if (p[0] === "ossz" || p[0] === "fejben") return p[1].join(" + ") + (p[0] === "fejben" ? " (fejben)" : "");
  if (p[0] === "ket") return "🪙 Visszajáró: 2 lap";
  return p[1] + ({ szor: " · ", oszt: " : ", kiv: " − " })[p[0]] + p[2];
}
/* a próba „pályája”: jó-e a gyerek terve (a + sorrendje szabad), és melyik lap jön utána */
function fzProbaTerv(P0, F, t) {
  function osszeg(tagok) { return t.jelek.every(function (j) { return j === "+"; }) && t.tagok.slice().sort().join() === tagok.slice().sort().join(); }
  if (P0[0] === "ossz") return osszeg(P0[1]) ? { lap: irGyart("ossz", t.tagok, null, { terv: true }) } : { hiba: "Ez nem az a terv: add össze a két számot!" };
  if (P0[0] === "fejben") return osszeg(P0[1]) ? { fejben: P0[1][0] + P0[1][1] } : { hiba: "Ez nem az a terv." };
  if (P0[0] === "kiv") return t.jelek.join() === "−" && t.tagok[0] === P0[1] && t.tagok[1] === P0[2] ? { lap: irGyart("kiv", P0[1], P0[2], { terv: true }) } : { hiba: "Ez nem az a terv: a nagyobbik számból vond ki a kisebbet!" };
  /* ket: 1. lap az ár (összeadás), 2. lap a visszajáró (kivonás) */
  var ar = P0[1].reduce(function (s, x) { return s + x; }, 0);
  if (!F.jegyzet.length) return osszeg(P0[1]) ? { lap: irGyart("ossz", t.tagok, null, { terv: true, becsles: false }) } :
    { hiba: t.jelek.indexOf("−") >= 0 ? "Hoppá: még nem tudjuk, mennyit kell fizetni. Előbb azt számold ki, mennyibe kerül összesen!" : "Ez nem az a terv." };
  return t.jelek.join() === "−" && t.tagok[0] === P0[2] && t.tagok[1] === ar ? { lap: irGyart("kiv", P0[2], ar, { terv: true, becsles: false }) } : { hiba: "Ez nem az a terv: mennyi jár vissza a " + P0[2] + "-ből?" };
}
var FZ_PR = { i: 0, mod: "gep", ell: "lepes", jelol: true, talca: true, mondoka: "hiba", F: null };
function fzProbaNyit() {
  var d = $("fz-proba");
  if (!d) { d = el("div", "fz-proba"); d.id = "fz-proba"; document.body.appendChild(d); }
  var P0 = FZ_PROBA_SOR[FZ_PR.i];
  function gomb(csop, ert, felirat, akt) { return '<button type="button" class="fzp-g' + (akt ? ' akt' : '') + '" data-cs="' + csop + '" data-e="' + ert + '">' + felirat + '</button>'; }
  d.innerHTML = '<div class="fzp-fej"><b>🧪 Füzet-próba</b> <span class="fzp-kicsi">(Garas tornya + Déli vásár, 1. kör)</span><button type="button" class="fzp-g fzp-zar" data-cs="zar">✕ vissza a játékba</button></div>' +
    '<div class="fzp-sor">' + FZ_PROBA_SOR.map(function (p, i) { return gomb("fel", i, fzProbaCim(p), i === FZ_PR.i); }).join("") + '</div>' +
    '<div class="fzp-sor">' + gomb("mod", "gep", "▶ a gép ír", FZ_PR.mod === "gep") + gomb("mod", "gyerek", "✏️ én írok", FZ_PR.mod === "gyerek") +
    (FZ_PR.mod === "gyerek" ? ' <span class="fzp-v">|</span>' + gomb("ell", "lepes", "lépésenként", FZ_PR.ell === "lepes") + gomb("ell", "vegen", "a végén", FZ_PR.ell === "vegen") +
      ' <span class="fzp-v">|</span>' + gomb("jelol", FZ_PR.jelol ? 0 : 1, (FZ_PR.jelol ? "☑" : "☐") + " jelöl", false) + gomb("mondoka", FZ_PR.mondoka === "mindig" ? "hiba" : "mindig", (FZ_PR.mondoka === "mindig" ? "☑" : "☐") + " mondóka minden lépésnél", false) : '') +
    ' <span class="fzp-v">|</span>' + gomb("talca", FZ_PR.talca ? 0 : 1, (FZ_PR.talca ? "☑" : "☐") + " tálca", false) + gomb("hang", mentes.hang ? 0 : 1, mentes.hang ? "🔊" : "🔇", false) + '</div>' +
    '<div class="fzp-lap"></div>';
  if (FZ_PR.F) FZ_PR.F.torol();
  var uj = P0[0] !== "szor" && P0[0] !== "oszt", gepLap = P0[0] === "ket" ? ["kiv", P0[2], 925] : P0[0] === "fejben" ? ["ossz", P0[1]] : P0;
  var T = uj && FZ_PR.mod === "gyerek" ? irTervLap({}) : irGyart(gepLap[0], gepLap[1], gepLap[2], uj ? { terv: (gepLap[0] === "ossz" ? gepLap[1].join(" + ") : gepLap[1] + " − " + gepLap[2]) + " =" } : null);
  FZ_PR.F = fzLap(d.querySelector(".fzp-lap"), T, { mod: FZ_PR.mod, ell: FZ_PR.ell, jelol: FZ_PR.jelol, talca: FZ_PR.talca && (uj || !!T.lepesek.some(function (l) { return l.talca; })), mondoka: FZ_PR.mondoka,
    jelek: uj, onTerv: function (F, t) { return fzProbaTerv(P0, F, t); },
    onKesz: function (F) {
      if (FZ_PR.mod !== "gyerek") return;
      beep(880, .12, "sine", 0, .06);
      if (P0[0] === "ket" && !F.jegyzet.length) F.idok.push(setTimeout(function () {   /* lapozás: az előző lap terv-sora + eredménye a jegyzetbe */
        F.ujLap(irTervLap({}), { jegyzet: F.T.tervSzoveg + " " + F.T.ered });
        F.felirat("Jó lépés! Ez az ár. De mennyi jár vissza az " + P0[2] + "-esből? Írd fel a tervet!", "jo");
      }, window.__UC_GYORS ? 50 : 1400));
    } });
  window.__fzProba = FZ_PR; window.__fzGyart = irGyart; window.__fzMentes = mentes;   /* a gépi próbának */
  if (FZ_PR.mod === "gep") FZ_PR.F.lejatsz();
  else if (uj) FZ_PR.F.felirat(P0[0] === "ket" ? "Mia: kenyér 310, tej 375, vaj 240 tallér. 1000-essel fizet. Mennyi jár vissza? Írd fel a tervet: számok, jel, a végére =." :
    "Írd fel a tervet: " + fzProbaCim(P0).replace(" (fejben)", "") + " — a végére = jel (billentyűn: + - * : =).");
  else FZ_PR.F.felirat(T.muv === "oszt" ? "Előbb becsülj: a B: sorba írd, mettől meddig lehet a hányados!" : "Előbb becsülj: a B: sorba írd, mennyi lesz körülbelül!");
  d.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".fzp-g"); if (!b) return;
    var cs = b.dataset.cs, v = b.dataset.e; hangGomb();
    if (cs === "zar") { if (FZ_PR.F) FZ_PR.F.torol(); FZ_PR.F = null; d.parentNode.removeChild(d); if (typeof speechSynthesis !== "undefined") try { speechSynthesis.cancel(); } catch (x) {} return; }
    if (cs === "fel") FZ_PR.i = +v; else if (cs === "mod") FZ_PR.mod = v; else if (cs === "ell") FZ_PR.ell = v;
    else if (cs === "jelol") FZ_PR.jelol = v === "1"; else if (cs === "talca") FZ_PR.talca = v === "1"; else if (cs === "mondoka") FZ_PR.mondoka = v;
    else if (cs === "hang") { mentes.hang = v === "1"; }
    try { speechSynthesis.cancel(); } catch (x) {}
    fzProbaNyit();
  };
}
/* a ceruza a többjegyű számon (irasbeli-gen.js celSzam: grp): ha a most írt jegy egy szám közepén van, a következő jegye jobbra jön;
   ha a ceruza egy többjegyű szám (pl. az utolsó részletszorzat „26”-ja) valamelyik kockájára lépne, a szám ELEJÉRE ugrik — ahogy kézzel írjuk */
function fzCsoportLep(F, r, c) {
  var most = F.vart[fzKulcs(r, c)];
  function csop(g) { return F.T.celok.filter(function (x) { return x.grp === g && x.tip === "szam"; }).sort(function (a, b) { return a.c - b.c; }); }
  if (most && most.grp != null) {
    var g = csop(most.grp), i = g.indexOf(most);
    if (i >= 0 && i < g.length - 1) { F.akt = { r: g[i + 1].r, c: g[i + 1].c }; return; }
  }
  var cel = F.akt && F.vart[fzKulcs(F.akt.r, F.akt.c)];
  if (cel && cel.grp != null && cel !== most && !(most && most.grp === cel.grp)) {
    var g2 = csop(cel.grp), elso = g2.filter(function (x) { var y = F.k[fzKulcs(x.r, x.c)]; return !(y && y.v); })[0] || g2[0];
    if (elso.c < cel.c) F.akt = { r: elso.r, c: elso.c };
  }
}

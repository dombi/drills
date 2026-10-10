/* ============ 6t) 📚 A BAGOLYKÖNYVTÁR TERME — egy terem a kártyasorok helyett (3. kód-kör, 2026-10-10) ============
   Terv: Matekos\regi-kockak-konyvtar-terv.html 3. + 8. pont (✅) · rajz: …-rajzterv.html 1., 1b., 4., 7. pont (✅, világos színek).
   A teremben négy dolog van (fekvő képernyőn balról jobbra):
     📚 OLVASÓ-POLC (bal fal, nyitott fali polc, világosabb fa): 🔎 és ✋ — ugyanaz a polc, mint a szekrényben (szpPolc), 🔮 nélkül;
     🪟 KÖZÉP: ablakfülke, a párkányon a 🏰 Kockavár kicsiben (koppintásra nagyban) + alatta a 📖 olvasópult a könyvtáros bagollyal;
     🧰 SZERSZÁM-SZEKRÉNY (jobb fal) + a lábánál a KÖZÖS láda (szerszam-polc.js) — egy szekrényben legfeljebb BKT_POLC_MAX polc,
        a többi egy második szekrénybe kerül mellé (rajzterv 1b.: a terem nő, a polc mérete fix; 9+ polcnál galéria — ha odaérünk);
     ✨ CSILLAGTORONY ajtaja (jobb szél): látszik, zárva, „Hamarosan” — koppintásra a bagoly: „Ez a torony még épül.”
   Üres polc soha nem látszik (a pult nyitja a létrákat). Álló tableten a három fal egymás alá kerül, telefonon egy oszlop
   (a terem-lista görgethető, a feladat-képernyő soha). 🏅 Mesterpróba-kapu: bktMesterKapu (a szalag lecsúszik → arany kapu 1–2 mp). */

var BKT_POLC_MAX = 4;          /* egy szekrényben / egy falon legfeljebb ennyi polc (rajzterv 1b.) */
var BKT_KAPU_MS = 1500;        /* az arany kapu pillanata (rajzterv 4. pont: 1–2 mp, átugorható) */

/* az ablakfülke: alkonyi égbolt, vándorló hold, a párkányon a Kockavár kicsiben */
function bktAblakSVG() {
  var kl = ekKockaLista();
  return '<svg viewBox="0 0 200 210" aria-hidden="true"><defs><linearGradient id="bkt-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9b3ea"/><stop offset="1" stop-color="#fbe4ef"/></linearGradient></defs>' +
    '<path d="M18 196 V84 Q100 -8 182 84 V196Z" fill="#a87b52"/>' +
    '<path d="M28 190 V88 Q100 8 172 88 V190Z" fill="url(#bkt-eg)"/>' +
    '<g class="bkt-hold"><circle cx="70" cy="62" r="15" fill="#fdf3c4"/><circle cx="63" cy="57" r="13.5" fill="#c7c0ee"/></g>' +
    '<g fill="#fff6cf"><circle class="bkt-cs" cx="128" cy="52" r="1.8"/><circle class="bkt-cs k2" cx="150" cy="92" r="1.5"/><circle class="bkt-cs k3" cx="46" cy="104" r="1.6"/><circle class="bkt-cs" cx="104" cy="34" r="1.3"/></g>' +
    '<ellipse cx="140" cy="128" rx="22" ry="6" fill="#fff" opacity=".7"/>' +
    ekKockavarKicsi(kl, 100, 178, .8) +
    '<path d="M100 22 V190 M28 120 H172" stroke="#a87b52" stroke-width="4" opacity=".55"/>' +
    '<rect x="8" y="188" width="184" height="14" rx="4" fill="#c99a6a"/><rect x="8" y="200" width="184" height="5" rx="2" fill="#8a6140"/></svg>';
}
/* az olvasópult a könyvtáros bagollyal; a nyitott könyv néha lapoz egyet (a mozdulatlanság ellen) */
function bktPultSVG() {
  return '<svg viewBox="0 0 200 150" aria-hidden="true"><defs><linearGradient id="bkt-fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87b52"/><stop offset="1" stop-color="#8a6140"/></linearGradient></defs>' +
    '<ellipse cx="86" cy="144" rx="58" ry="6" fill="#7a5638" opacity=".45"/>' +
    '<rect x="72" y="66" width="28" height="76" fill="#8a6140"/>' +
    '<path d="M18 50 H154 L166 74 H6Z" fill="url(#bkt-fa)" stroke="#6e4a22" stroke-width="2"/>' +
    '<path d="M24 48 Q52 34 84 48 V62 Q52 50 24 62Z" fill="#fffaf0" stroke="#c9a27a" stroke-width="1.5"/>' +
    '<path d="M148 48 Q120 34 88 48 V62 Q120 50 148 62Z" fill="#fffaf0" stroke="#c9a27a" stroke-width="1.5"/>' +
    '<path class="bkt-lap" d="M86 48 Q116 34 146 48 V62 Q116 50 86 62Z" fill="#fff6e4" stroke="#c9a27a" stroke-width="1.2"/>' +
    '<path d="M32 50 Q52 44 74 50 M32 55 Q52 49 72 55 M98 50 Q118 44 138 50" stroke="#c9a27a" stroke-width="1.2" fill="none" opacity=".7"/>' +
    bagolyRajz("konyvtaros", 168, 40, .56) + '</svg>';
}
/* a Csillagtorony zárt ajtaja (5. döntés ✅: látszik, „Hamarosan”; nincs lakat, nincs szürkeség) */
function bktAjtoSVG() {
  return '<svg viewBox="0 0 80 200" aria-hidden="true">' +
    '<path d="M6 196 V70 Q40 22 74 70 V196Z" fill="#9b8fe0" stroke="#6f63b8" stroke-width="4"/>' +
    '<path d="M14 192 V74 Q40 36 66 74 V192Z" fill="#aca2ea"/>' +
    '<g fill="#fff6cf"><circle class="bkt-cs" cx="28" cy="96" r="2"/><circle class="bkt-cs k2" cx="52" cy="122" r="1.7"/><circle class="bkt-cs k3" cx="34" cy="160" r="1.8"/></g>' +
    '<path d="M40 58 l3.5 8 8.5 1.2 -6.2 5.8 1.6 8.4 -7.4 -4 -7.4 4 1.6 -8.4 -6.2 -5.8 8.5 -1.2Z" fill="#fff3b0"/>' +
    '<circle cx="62" cy="140" r="4" fill="#f3d08a" stroke="#c99a45" stroke-width="1.5"/>' +
    '<path d="M24 120 L40 106 L56 120" stroke="#8a6140" stroke-width="2" fill="none"/></svg>';
}

/* ── a terem (ui.js hívja a 📚 liget belsejében) ── */
function bktTerem() {
  var olvaso = OLVASO_POLCOK.filter(function (s) { return PALYAK.some(function (p) { return p.polc === s.id && !palyaRejtve(p); }); }).slice(0, BKT_POLC_MAX);
  var lista = SZERSZAMOK.filter(function (s) { return PALYAK.some(function (p) { return p.szerszam === s.id && !palyaRejtve(p); }); });
  var benn = OLVASO_POLCOK.concat(SZERSZAMOK).filter(function (s) { return szerszamLadaban(s.id); });   /* egy KÖZÖS láda (rajzterv 3. döntés ✅) */
  var szekr = [];
  for (var i = 0; i < lista.length; i += BKT_POLC_MAX) szekr.push(lista.slice(i, i + BKT_POLC_MAX));
  var db = ekKockaDb();
  var t = el("div", "bkt-terem" + (szekr.length > 1 ? " bkt-ket-szekreny" : ""));
  t.innerHTML =
    '<div class="bkt-bal">' + (olvaso.length ? '<div class="bkt-nyitott"><div class="bkt-iv"><span>📚 Olvasó-polc</span></div>' + olvaso.map(szpPolc).join("") + '</div>' : '') + '</div>' +
    '<div class="bkt-kozep">' +
      '<button type="button" class="bkt-ablak" aria-label="Kockavár: ' + db + ' kocka. Koppints, és nagyban látod.">' + bktAblakSVG() + '<span class="bkt-cimke">🏰 Kockavár</span></button>' +
      '<div class="bkt-pult" aria-hidden="true">' + bktPultSVG() + '</div>' +
    '</div>' +
    '<div class="bkt-jobb">' +
      (szekr.length ? '<div class="bkt-szekrenyek">' + szekr.map(function (sor, i) {
        return '<div class="szp-szekreny bkt-szekreny"><div class="szp-tetej">🧰 Szerszámok' + (szekr.length > 1 ? " " + (i + 1) + "." : "") + '</div>' + sor.map(szpPolc).join("") + '</div>';
      }).join("") + '</div>' : '') +
      '<div class="szp-lab"><div class="szp-lada" role="img" aria-label="A közös láda: amit már tudsz">' + SZP_LADA + '<span class="szp-lada-ikonok">' +
        benn.map(function (s) { return '<i data-sz="' + s.id + '">' + s.ikon + '</i>'; }).join("") + '</span></div></div>' +
    '</div>' +
    '<button type="button" class="bkt-ajto" aria-label="Csillagtorony: hamarosan">' + bktAjtoSVG() + '<span class="bkt-cimke">✨ Csillagtorony</span><span class="bkt-hamarosan">Hamarosan</span></button>';
  szpBekot(t);
  t.querySelector(".bkt-ablak").addEventListener("click", function () { hangGomb(); bktVarNagy(); });
  t.querySelector(".bkt-ajto").addEventListener("click", function () { hangGomb(); mondd("Ez a torony még épül."); });
  return t;
}

/* ── 🏰 a Kockavár nagyban (koppintás az ablakra, vagy a Mesterpróba végképernyőjén „Megnézem a várat”) ── */
function bktVarNagy(uj) {
  var regi = $("bkt-var-reteg"); if (regi) regi.remove();
  var lista = ekKockaLista(), n = lista.length;
  var r = el("div", "bkt-var-reteg"); r.id = "bkt-var-reteg";
  r.innerHTML = '<div class="bkt-var-doboz" role="dialog" aria-label="Kockavár"><div class="ek-var-nagy">' + ekKockavarNagySVG(lista, uj ? n - 1 : -1) + '</div>' +
    '<div class="bkt-var-sor">' + (n >= EK_KOCKAK.length ? "🏰 Kész a Kockavár!" : n ? "🏰 " + n + " kocka a várban" : "🏰 Még üres a vár. Minden 🏅 Mesterpróba hoz egy kockát!") + '</div>' +
    '<button type="button" class="nagy-gomb">✓ Megnéztem</button></div>';
  document.body.appendChild(r);
  function zar() { hangGomb(); r.remove(); }
  r.querySelector("button").addEventListener("click", zar);
  r.addEventListener("click", function (e) { if (e.target === r) zar(); });
  if (uj) ekKockaBerepul();
  mondd(n ? (n >= EK_KOCKAK.length ? "Kész a Kockavár!" : n + " kocka van a várban.") : "Még üres a vár. Minden Mesterpróba hoz egy kockát!");
}

/* ── 🏅 Mesterpróba-kapu (rajzterv 4. pont): a szalag lecsúszik → rövid arany kapu, az unikornis átlép → arany szegélyű pult ──
   Koppintás bárhová = azonnal indul (nincs várakoztatás). Nyugalmi módban és a gyors-tesztben a kapu kimarad. */
function bktMesterKapu(indit) {
  if (nyugiMod() || window.__UC_GYORS) { indit(); return; }
  var r = el("div", "bkt-kapu-reteg");
  r.setAttribute("aria-hidden", "true");
  r.innerHTML = '<svg viewBox="0 0 300 220"><defs><linearGradient id="bkt-arany" x1="0" x2="1"><stop offset="0" stop-color="#f7d36b"/><stop offset=".5" stop-color="#ffe9a8"/><stop offset="1" stop-color="#e6ad2e"/></linearGradient>' +
      '<radialGradient id="bkt-kfeny"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="150" cy="120" rx="120" ry="100" fill="url(#bkt-kfeny)"/>' +
      '<path d="M88 208 V96 Q150 18 212 96 V208Z" fill="#fff3b0" opacity=".6"/>' +
      '<path d="M80 210 V92 Q150 6 220 92 V210" fill="none" stroke="url(#bkt-arany)" stroke-width="14" stroke-linecap="round"/>' +
      '<path d="M80 210 V92 Q150 6 220 92 V210" fill="none" stroke="#fff3c4" stroke-width="3" stroke-dasharray="3 11" stroke-linecap="round"/>' +
      '<g fill="#f0a800"><circle class="bkt-cs" cx="112" cy="70" r="3"/><circle class="bkt-cs k2" cx="190" cy="62" r="3"/><circle class="bkt-cs k3" cx="150" cy="120" r="3.4"/></g>' +
      '<circle cx="150" cy="40" r="17" fill="#fff6d8" stroke="#e8b43a" stroke-width="3"/><text x="150" y="47" font-size="19" text-anchor="middle">🏅</text>' +
      '<g transform="translate(150 200)"><g class="bkt-kapu-uni">' + unikornisSVG("bkt-kapu-uni", LENYEK[mentes.leny], .5, P().oltozet, P().kinezet || null) + '</g></g></svg>';
  document.body.appendChild(r);
  var kesz = false;
  function tovabb() { if (kesz) return; kesz = true; r.classList.add("ki"); setTimeout(function () { r.remove(); }, 250); indit(); }
  r.addEventListener("click", tovabb);
  hangCsilla();
  setTimeout(tovabb, BKT_KAPU_MS);
}

/* ── közös végképernyő minden könyvtári pályán (rajzterv 5. pont; palyaVege hívja a polc- és a szerszám-pályák végén) ──
   Legfeljebb 3 sor + a jutalom + 2 gomb: „Még egyet” (ugyanaz a könyv, új mesék) · „📚 Vissza a polchoz”. A Mesterpróba után,
   ha kész: a kocka berepül a kis várba (ugyanebben a dobozban), a gomb „🏰 Megnézem a várat”. A pöttyök: arany = önálló, lila =
   segítséggel; számot nem írunk ki. A doboz 768 px magasságon is elfér. V: a polcPalyaVege / szPalyaVege eredménye. */
var BKT_VEGE = false;          /* a vegeGombok (ui.js) olvassa, egy megjelenésre */
var BKT_GOMB = { mese: "📖 Még egyet", tekercs: "📜 Még egyet", gomb: "🔮 Még egyet", mester: "🏅 Még egyszer" };
function bktVege(V, o) {
  var pa = J.palya, mester = pa.fok === "mester";
  var sorok = (V.sorok || []).concat(o.extra || []).slice(0, 3);
  var pottyok = mester ? [o.potty.length ? o.potty[o.potty.length - 1] : true] : o.potty;
  var kep = "";
  var var_ = mester && V.mesterKesz && (!!pa.polc || !!V.varKocka);   /* Mesterpróba (polc + szerszám): a kis vár, benne (ha új) a berepülő kocka */
  if (var_) { var L = ekKockaLista(); kep = '<div class="ek-var-nagy bkt-var">' + ekKockavarNagySVG(L, V.kocka ? L.length - 1 : -1) + '</div>'; }
  else kep = '<div class="bkt-pottyok' + (mester ? " mester" : "") + '" aria-hidden="true">' + pottyok.map(function (x) { return '<i class="' + (x ? "o" : "s") + '"></i>'; }).join("") + '</div>';
  document.querySelector("#kepernyo-vege h2").textContent = V.cim || "Kész!";
  $("vege-szoveg").innerHTML = kep + sorok.map(function (s) { return '<span class="bkt-sor">' + s + '</span>'; }).join("") +
    '<span class="bkt-jut">+ ' + o.csilla + ' ✨ · + ' + o.harmat + ' 💧</span>';
  var meg = $("vege-meg");
  if (var_) { meg.textContent = "🏰 Megnézem a várat"; meg.onclick = function () { hangGomb(); bktVarNagy(); }; }
  else { meg.textContent = BKT_GOMB[pa.fok] || "📖 Még egyet"; meg.onclick = function () { hangGomb(); if (mester) bktMesterKapu(function () { palyaInditas(pa.id); }); else palyaInditas(pa.id); }; }
  BKT_VEGE = true;
}

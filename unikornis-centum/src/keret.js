/* ============ 6j4) 🪧 TÁRGY-KERET — a feladat egy tárgyon él a képben, nem téglalap kártyán (Pálya-hely B kör, 2026-10-25) ============
   Terv: terv/palyahely-targykeret-terv.html 7. pont · rajz: terv/palyahely-rajzterv.html 6. pont (✅ jóváhagyva; A: világos, fa-keretes tábla).
   EGY KÖZÖS KÉSZLET: a pálya csak megnevezi, melyik keretet kéri, a rajz itt van (a szél a phLap hullámos lapja, palyahely.js).
     kfFok    🪜 létrafok: fa deszka, rajta a feladat és a válasz helye (Rokon-létra)
     kfTabla  🖍️ a válasz helye: tábla fa kerettel, rá írja a gyerek a számot (egy pályán belül mindig ugyanott)
     kfUgras  ↷ számvonal-darab az ugrással a kerek tízesen át (7 → 10 → 12); a végét a gyerek mondja ki, a kép nem írja ki
     kfAblak  🪟 ablak három kavics-hellyel és a jellel (Számcsalád; C kör) · kfKavics 🪨 kerek kő a számmal · kfKosar 🧺 fonott kosár
     🦊 Zsivány zsibvására (2026-10-25, rajz: Matekos/zsibvasar-rajzterv.html ✅): kfTaller 🪙 tallér · kfBecsles ≈ cetli a kis szalaggal ·
     kfCedula 🏷️ árcédula (maszatos is) · kfBlokk 🧾 blokk · kfErszeny 👛 erszény. A Tüske-bolt is ezekre állhat át (recept-lap 3. kör).
   A régi pályák belső kártyái is ide állnak át. */

var KF_FR = 'font-family="Fredoka,sans-serif" font-weight="600"';
/* a térkép színátmenetei (LT_DEFS: lt-gFal, lt-gTetoM…) a képen saját néven: ha a rejtett Piactér ugyanazokat az id-ket hordozza,
   a böngésző a rejtett példányt keresi, és a ház fala, teteje, az ég átlátszó marad (mint a nyitókép nySajatId-je) */
function kfSajatId(s, elotag) { return s.replace(/id="lt-/g, 'id="' + elotag + '-lt-').replace(/#lt-/g, "#" + elotag + "-lt-"); }
function kfMuv(a, op, b) { return a + (op === "-" ? " − " : " + ") + b; }

/* 🖍️ tábla: (x, y) a közepe, w × h a belseje; tartalom: a beírt szám ("" = üres, villogó kurzor); allapot: "" | "jo" | "rossz" | "var" (halvány, még nem ide írunk) */
function kfTabla(x, y, w, h, tartalom, allapot) {
  var F = pcF, s = '<g class="kf-tabla" transform="translate(' + F(x) + ' ' + F(y) + ')"' + (allapot === "var" ? ' opacity=".55"' : '') + '>';
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(-w / 2 - 9, -h / 2 - 9, w / 2 + 9, h / 2 + 9, 9) + '" fill="#c99a6a" stroke="#8a5a3a" stroke-width="2.4"/>' +
       '<path d="' + phLap(-w / 2, -h / 2, w / 2, h / 2, 5) + '" fill="#fffaf0" stroke="#e3cfae" stroke-width="1.6"/></g>';
  if (allapot === "jo") s += '<path d="' + phLap(-w / 2 + 3, -h / 2 + 3, w / 2 - 3, h / 2 - 3, 5) + '" fill="#bfe9b8" opacity=".6"/>';
  if (tartalom !== "" && tartalom != null) s += '<text y="' + F(h * .2) + '" text-anchor="middle" font-size="' + F(h * .55) + '" ' + KF_FR + ' fill="#4a3b7a"' + (allapot === "rossz" ? ' opacity=".5"' : '') + '>' + kiiras(tartalom) + '</text>';
  else if (allapot !== "var") s += '<path d="M0 ' + F(-h * .24) + 'V' + F(h * .24) + '" stroke="#8a4fd0" stroke-width="3" stroke-linecap="round">' + (lkCsokkent() ? '' : ltAnim("opacity", "1;0;1", "1s")) + '</path>';
  s += '<path d="M' + F(w / 2 - 34) + ' ' + F(h / 2 + 4) + 'h22" stroke="#f6a5c0" stroke-width="5" stroke-linecap="round"/>';   /* filc a keret alján */
  return s + '</g>';
}

/* 🪜 létrafok: (x, y) a közepe, w a szélessége; bal = a feladat („47 + 5 =”), valasz = ami a válasz helyén áll;
   allapot: ures (még üres, halvány „…”) · kerdez (ezt kérdezzük: rózsaszín szél, „?”) · rossz · kesz (a gyerek írta, ⭐) ·
   magatol (a létra töltötte ki, halványabb szám) · fenyes (kész létra, végigvilágít) · alap (halványan kiemelt: „nézd meg az alapot!”)
   valasz === null: a fokon csak a feladat van, középen (választható kis fok, pl. „Melyik segít?”) */
function kfFok(x, y, w, bal, valasz, allapot) {
  var F = pcF, s = '<g class="kf-fok" transform="translate(' + F(x) + ' ' + F(y) + ')">', kerdez = allapot === "kerdez" || allapot === "rossz";
  if (allapot === "kesz" || allapot === "fenyes" || allapot === "alap") s += '<ellipse cx="0" cy="0" rx="' + F(w * .66) + '" ry="24" fill="url(#lt-gHalo)" opacity="' + (allapot === "fenyes" ? .95 : allapot === "alap" ? .9 : .55) + '"/>';
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(-w / 2, -16, w / 2, 16, 7) + '" fill="' + (allapot === "fenyes" ? "#fff1c8" : kerdez ? "#fbe7c2" : allapot === "ures" ? "#ead9c0" : "#f6dcb2") + '" stroke="' + (kerdez ? "#e0417a" : allapot === "alap" ? "#e3a92a" : "#8a6a52") + '" stroke-width="' + (kerdez || allapot === "alap" ? 3.2 : 2.2) + '"/>' +
       '<path d="M' + F(-w / 2 + 8) + ' -10Q0 -12 ' + F(w / 2 - 8) + ' -9.5" stroke="#fff6e2" stroke-width="2" fill="none" opacity=".8"/></g>';
  var szin = allapot === "ures" ? "#b3a492" : "#6e4a36", vSzin = allapot === "magatol" ? "#9a8fb0" : allapot === "rossz" ? "#b3a492" : "#4a3b7a";
  if (valasz === null) return s + '<text y="8" text-anchor="middle" font-size="22" ' + KF_FR + ' fill="' + szin + '">' + kiiras(bal) + '</text></g>';
  s += '<text x="' + F(w * .13) + '" y="8" text-anchor="end" font-size="22" ' + KF_FR + ' fill="' + szin + '">' + kiiras(bal) + '</text>';
  s += '<text x="' + F(w * .32) + '" y="8" text-anchor="middle" font-size="22" ' + KF_FR + ' fill="' + (kerdez && !valasz ? "#e0417a" : vSzin) + '">' + kiiras(valasz || (kerdez ? "?" : allapot === "ures" ? "…" : "")) + '</text>';
  if (allapot === "kesz") s += '<text x="' + F(w / 2 + 6) + '" y="7" font-size="15">⭐</text>';
  return s + '</g>';
}

/* ↷ az ugrás a számvonalon: ug = sk100Ugras (pontok [a, kerek tízes, cél], lépések), op; (x0, y) a vonal bal eleje, egys = 1 egység px-ben.
   mod: "alak" (a lépések és a kerek tízes, a cél üres) · "lepes" (2. hiba után: az első ugrás megérkezik, a második szaggatottan
   halad, a célnál „?”) — a végső számot a kép SOSEM írja ki (a gyerek mondja ki). Vissza: { svg, w } (w = a darab szélessége) */
function kfUgras(ug, op, x0, y, egys, mod) {
  var F = pcF, p = ug.pontok, lo = Math.min.apply(null, p) - 2, hi = Math.max.apply(null, p) + 2, i, s = '<g class="kf-ugras">';
  var px = function (n) { return x0 + (n - lo) * egys; };
  s += '<path d="M' + F(px(lo)) + ' ' + y + 'H' + F(px(hi)) + '" stroke="#8a6a7e" stroke-width="2" stroke-linecap="round"/>';
  for (i = lo + 1; i < hi; i++) s += '<path d="M' + F(px(i)) + ' ' + F(y - (i % 10 === 0 ? 7 : 4)) + 'V' + F(y + (i % 10 === 0 ? 7 : 4)) + '" stroke="#8a6a7e" stroke-width="' + (i % 10 === 0 ? 2 : 1.2) + '"/>';
  var szinek = ["#f2708f", "#5f92d0"], jel = op === "-" ? "−" : "+";
  for (i = 0; i < p.length - 1; i++) {   /* az ívek: rózsaszín a kerek tízesig, kék onnan tovább */
    var x1 = px(p[i]), x2 = px(p[i + 1]), d = Math.abs(p[i + 1] - p[i]), cy = y - 18 - d * egys * .2, utolso = i === p.length - 2, halad = mod === "lepes" && utolso;
    s += '<path d="M' + F(x1) + ' ' + F(y - 3) + 'Q' + F((x1 + x2) / 2) + ' ' + F(cy) + ' ' + F(x2) + ' ' + F(y - 3) + '" fill="none" stroke="' + szinek[i % 2] + '" stroke-width="3" stroke-linecap="round"' +
      (halad ? ' stroke-dasharray="5 4">' + (lkCsokkent() ? '' : '<animate attributeName="stroke-dashoffset" values="18;0" dur=".9s" repeatCount="indefinite"/>') + '</path>' : '/>');
    s += '<text x="' + F((x1 + x2) / 2) + '" y="' + F(cy + 4) + '" text-anchor="middle" font-size="14" ' + KF_FR + ' fill="' + szinek[i % 2] + '">' + jel + d + '</text>';
  }
  for (i = 0; i < p.length; i++) {
    var vege = i === p.length - 1;
    s += '<text x="' + F(px(p[i])) + '" y="' + F(y + 22) + '" text-anchor="middle" font-size="15" ' + KF_FR + ' fill="' + (vege ? "#e0417a" : "#4a3b7a") + '">' + (vege ? "?" : p[i]) + '</text>';
  }
  return { svg: s + '</g>', w: (hi - lo) * egys };
}

/* 🪨 kavics: mindig egyforma kerek kő, rajta a szám (rajzterv 6. pont). (x, y) a közepe, m = nagyság (1 = 44 px átmérő a 800-as képen;
   telefonon nagyobb, hogy ujjnyi legyen). attr: a kezelő adatai (pl. a jelenet-motor felvehető jele). allapot: "" | "fenyes" | "halvany" */
function kfKavics(x, y, n, m, attr, allapot) {
  var F = pcF;
  return '<g' + (attr || '') + ' transform="translate(' + F(x) + ' ' + F(y) + ') scale(' + (m || 1) + ')"' + (allapot === "halvany" ? ' opacity=".35"' : '') + '><g class="kf-ic">' +
    (allapot === "fenyes" ? '<ellipse rx="34" ry="30" fill="url(#lt-gHalo)" opacity=".95"/>' : '') +
    '<ellipse cx="0" cy="14" rx="22" ry="5" fill="#3c2a50" opacity=".12"/>' +
    '<path d="M-22 0Q-23 -17 -2 -18Q22 -19 22 -2Q23 15 0 16Q-21 17 -22 0Z" fill="#d9cbe6" stroke="' + (allapot === "fenyes" ? "#e3a92a" : "#7a5ea8") + '" stroke-width="' + (allapot === "fenyes" ? 3 : 2) + '"/>' +
    '<path d="M-12 -10Q-4 -14 6 -13" stroke="#fff" stroke-width="2.4" opacity=".6" fill="none" stroke-linecap="round"/>' +
    '<text y="7" text-anchor="middle" font-size="19" ' + KF_FR + ' fill="#4a3b7a">' + n + '</text></g></g>';
}
/* 🪟 ablak: fakeretes ablak, benne a művelet három kavics-hellyel (p op q = r). (x, y) a közepe, m = nagyság.
   tart: a három hely tartalma — szám (kavics ül benne) · null (üres kör) · "?" (ide írunk: a tábla felel érte);
   allapot: "" · "jo" (meleg fény) · "csalad" (halvány fény: a kakukk-tippnél „itt lakik a családja”) · "most" (ezt kérdezzük);
   helyAttr(j) / kavicsAttr(j): a kezelő adatai a j. helyhez és a benne ülő kavicshoz */
function kfAblak(x, y, m, op, tart, allapot, helyAttr, kavicsAttr) {
  var F = pcF, s = '<g class="kf-ablak" transform="translate(' + F(x) + ' ' + F(y) + ') scale(' + m + ')">', jo = allapot === "jo";
  if (jo || allapot === "csalad") s += '<ellipse rx="150" ry="66" fill="url(#lt-gHalo)" opacity="' + (jo ? .55 : .35) + '" pointer-events="none"/>';
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(-120, -42, 120, 42, 10) + '" fill="' + (jo ? "url(#kf-ablakfeny)" : allapot === "csalad" ? "#f6ecc4" : "#cfe2f2") + '" stroke="' + (allapot === "most" ? "#e0417a" : "#8a6a7e") + '" stroke-width="' + (allapot === "most" ? 4 : 3) + '"/>' +
       '<path d="' + phLap(-128, 42, 128, 52, 3) + '" fill="#c99272" stroke="#8a5a3a" stroke-width="1.8"/></g>';
  [-76, 0, 78].forEach(function (hx, j) {
    var v = tart[j];
    s += '<g' + (helyAttr ? helyAttr(j) : '') + ' transform="translate(' + hx + ' 0)"><path d="M-24 0Q-25 -18 0 -19Q25 -19 24 0Q25 18 0 19Q-24 19 -24 0Z" fill="#fff" fill-opacity="' + (v === "?" ? .9 : .55) + '" stroke="' + (v === "?" ? "#e0417a" : "#9a8fb0") + '" stroke-width="' + (v === "?" ? 2.6 : 1.6) + '"' + (v === "?" ? '' : ' stroke-dasharray="4 3"') + '/>' +
      (v === "?" ? '<text y="8" text-anchor="middle" font-size="22" ' + KF_FR + ' fill="#e0417a">?</text>' : '') + '</g>';
    if (typeof v === "number") s += kfKavics(hx, 0, v, 1, kavicsAttr ? kavicsAttr(j) : '');
  });
  s += '<text x="-38" y="9" text-anchor="middle" font-size="26" ' + KF_FR + ' fill="#4a3b7a">' + op + '</text><text x="39" y="9" text-anchor="middle" font-size="26" ' + KF_FR + ' fill="#4a3b7a">=</text>';
  return s + '</g>';
}
var KF_DEFS = '<defs><radialGradient id="kf-ablakfeny" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff2b8"/><stop offset="1" stop-color="#ffd26e"/></radialGradient></defs>';
/* 🧺 fonott kosár (a kakukktojás félretevő helye, a „Két kosár” számsorai): (x, y) az alja közepe, w a szélessége; felirat a kosár előtt */
function kfKosar(x, y, w, felirat, attr) {
  var F = pcF, h = w * .42, s = '<g' + (attr || '') + '><g class="kf-kosar" transform="translate(' + F(x) + ' ' + F(y) + ')">';
  s += '<rect x="' + F(-w / 2 - 6) + '" y="' + F(-h - 30) + '" width="' + F(w + 12) + '" height="' + F(h + 40) + '" fill="transparent"/>';
  s += '<g filter="url(#lt-firka)"><path d="M' + F(-w / 2) + ' ' + F(-h) + 'Q0 ' + F(-h - 16) + ' ' + F(w / 2) + ' ' + F(-h) + 'L' + F(w / 2 - 10) + ' 0Q0 8 ' + F(-w / 2 + 10) + ' 0Z" fill="#e3b77e" stroke="#8a5a3a" stroke-width="2.2"/>' +
       '<path d="M' + F(-w / 2 + 6) + ' ' + F(-h * .5) + 'Q0 ' + F(-h * .5 + 8) + ' ' + F(w / 2 - 6) + ' ' + F(-h * .5) + 'M' + F(-w / 4) + ' ' + F(-h - 6) + 'L' + F(-w / 4 + 4) + ' 2M' + F(w / 4) + ' ' + F(-h - 6) + 'L' + F(w / 4 - 4) + ' 2" stroke="#b5804a" stroke-width="1.6" fill="none"/></g>';
  if (felirat) s += '<text y="' + F(22) + '" text-anchor="middle" font-size="14" ' + KF_FR + ' fill="#6e4a36">' + felirat + '</text>';
  return s + '</g></g>';
}

/* 🪙 tallér (a bolt-kép tallerBelso rajza): (x, y) a közepe, k = nagyság, attr: a kezelő adatai */
function kfTaller(x, y, v, k, attr) { return '<g' + (attr || '') + ' transform="translate(' + pcF(x) + ' ' + pcF(y) + ')"><g class="kf-ic">' + tallerBelso(v, k) + '</g></g>'; }
/* 🏷️ árcédula madzagon: (x, y) a madzag teteje; maszat: az ár elmaszatolódott (ha nincs ár, csak a maszat látszik) */
function kfCedula(x, y, ar, m, maszat) {
  var s = '<g class="kf-cedula" transform="translate(' + pcF(x) + ' ' + pcF(y) + ') scale(' + (m || 1) + ') rotate(4)">';
  s += '<path d="M0 0V10" stroke="#8a7a6e" stroke-width="1.4"/><rect x="-26" y="10" width="52" height="30" rx="4" fill="#fffef6" stroke="#8a7a6e" stroke-width="1.6"/><circle cy="15" r="2" fill="#8a7a6e"/>';
  if (maszat) s += '<path d="M-20 22Q-8 14 4 22T22 26Q14 36 0 32T-20 30Z" fill="#b9a6c9" opacity=".55"/>';
  if (ar !== "" && ar != null) s += '<text y="33" text-anchor="middle" font-size="17" ' + KF_FR + ' fill="#4a3b7a">' + kiiras(ar) + '</text>';
  return s + '</g>';
}
/* ≈ cetli a kis szalaggal (rajzterv 4. pont): (x, y) a bal felső sarka, m = nagyság (a cetli 300 × 150).
   all: "ures" (a gyerek koppint) · "jo" (a jó tízes kivilágít, beirt = a kerekített) · "hiba" (két ív + lépés-pöttyök; 5-re végződőnél zöld nyíl
   felfelé) · "halvany" (Odú-küszöb: nincs szalag, a gyerek írja). A két tízes koppintható: .kf-veg[data-v] (ha koppint igaz).
   A szalag megállóinál nincs szám, csak a két szomszéd kerek tízes; kerek tízes árnál a jel magán a tízesen áll (maga marad). */
function kfBecsles(x, y, m, ar, all, beirt, koppint) {
  var F = pcF, also = ar % 10 === 0 ? ar : Math.floor(ar / 10) * 10, felso = also + 10, X0 = 40, X1 = 260, px = X0 + (ar - also) / 10 * (X1 - X0), y0 = 104, i;
  var jo = kerekTizes(ar), van = beirt !== "" && beirt != null, s = '<g class="kf-becsles" transform="translate(' + F(x) + ' ' + F(y) + ') scale(' + m + ')">';
  s += '<g filter="url(#lt-firka)"><path d="M18 14H282V140H18Z" fill="#fffdf3" stroke="#c9b48a" stroke-width="1.8" transform="rotate(-1.2 150 77)"/></g><circle cx="150" cy="18" r="5" fill="#e8505b" stroke="#a83a44" stroke-width="1.4"/>';
  s += '<text x="118" y="62" text-anchor="end" font-size="30" ' + KF_FR + ' fill="#4a3b7a">' + ar + '</text><text x="138" y="62" text-anchor="middle" font-size="30" ' + KF_FR + ' fill="#8a4fd0">≈</text>';
  s += '<rect x="156" y="34" width="62" height="38" rx="7" fill="#fff" stroke="' + (all === "jo" ? "#3f9e6a" : "#b9a6d6") + '" stroke-width="2" stroke-dasharray="' + (van ? "0" : "5 4") + '"/>';
  if (van) s += '<text x="187" y="63" text-anchor="middle" font-size="26" ' + KF_FR + ' fill="' + (all === "jo" ? "#3f9e6a" : "#4a3b7a") + '">' + beirt + '</text>';
  if (all === "halvany") return s + '</g>';
  s += '<path d="M' + X0 + ' ' + y0 + 'H' + X1 + '" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/>';
  for (i = 1; i < 10; i++) { var tx = X0 + i * (X1 - X0) / 10; s += '<path d="M' + F(tx) + ' ' + (y0 - (i === 5 ? 7 : 4)) + 'V' + (y0 + (i === 5 ? 7 : 4)) + '" stroke="#c9b48a" stroke-width="' + (i === 5 ? 2 : 1.4) + '"/>'; }
  if (all === "hiba" && ar % 10) {   /* a két távolság: ív és lépés-pöttyök a jeltől mindkét tízesig (szám nincs kiírva) */
    var st = (X1 - X0) / 10, nl = ar - also;
    [X0, X1].forEach(function (b) { s += '<path d="M' + F(px) + ' ' + (y0 - 8) + 'Q' + F((px + b) / 2) + ' ' + F(y0 - 20 - Math.abs(b - px) * .12) + ' ' + b + ' ' + (y0 - 8) + '" fill="none" stroke="#5f84b0" stroke-width="2" stroke-dasharray="4 3"/>'; });
    for (i = 0; i < 10; i++) s += '<circle cx="' + F(i < nl ? px - st * (i + .5) : px + st * (i - nl + .5)) + '" cy="' + (y0 + 16) + '" r="4" fill="#f6a5c0" stroke="#c0567f" stroke-width="1"/>';
    if (nl === 5) s += '<path d="M' + (X1 - 30) + ' ' + (y0 - 34) + 'l14 0m-5 -5l5 5l-5 5" fill="none" stroke="#3f9e6a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  [[also, X0], [felso, X1]].forEach(function (t) {
    if (all === "jo" && t[0] === jo) s += '<circle cx="' + t[1] + '" cy="' + y0 + '" r="26" fill="#fff3a0" opacity=".85"/>';
    s += '<g' + (koppint ? ' class="kf-veg" data-v="' + t[0] + '" style="cursor:pointer"' : '') + '><circle cx="' + t[1] + '" cy="' + y0 + '" r="' + (koppint ? 22 : 17) + '" fill="url(#heTizes)" stroke="' + HE_SZIN[10].k + '" stroke-width="2.2"/>' +
      '<text x="' + t[1] + '" y="' + (y0 + 6) + '" text-anchor="middle" font-size="16" ' + KF_FR + ' fill="' + HE_SZIN[10].sz + '">' + t[0] + '</text></g>';
  });
  return s + '<path d="M' + F(px) + ' ' + (y0 - 6) + 'l-7 -12h14Z" fill="#c0567f" stroke="#7a2f4c" stroke-width="1.2"/></g>';
}
/* 🧾 blokk: (x, y) a bal felső sarka, w a szélessége; sorok: [[ikon-SVG, ár]], irt: az „összesen” (amit a boltos írt);
   o: { cim, pecset: "ok" | "x", kihuz } */
function kfBlokk(x, y, w, sorok, irt, o) {
  var F = pcF, n = sorok.length, dy = n > 3 ? 30 : 36, h = 62 + n * dy + 50, s = '<g class="kf-blokk" transform="translate(' + F(x) + ' ' + F(y) + ')">', i, cik = "";
  o = o || {};
  for (i = 0; i < Math.round(w / 20); i++) cik += "L" + F(w - (i * 20 + 10)) + " " + (i % 2 ? h : h + 9) + "L" + F(Math.max(0, w - (i + 1) * 20)) + " " + h;
  s += '<path d="M0 0H' + w + 'V' + h + cik + 'Z" fill="#fffef6" stroke="#c9b6dc" stroke-width="1.8"/>';
  s += '<text x="' + F(w / 2) + '" y="22" text-anchor="middle" font-size="12" ' + KF_FR + ' fill="#8a7a9e">' + (o.cim || "blokk") + '</text><path d="M12 32H' + (w - 12) + '" stroke="#e7dcef" stroke-width="1.6"/>';
  sorok.forEach(function (r, i) {
    var yy = 58 + i * dy;
    s += '<g transform="translate(26 ' + (yy + 2) + ') scale(.62)">' + r[0] + '</g><path d="M50 ' + (yy - 6) + 'H' + (w - 64) + '" stroke="#c9b6dc" stroke-width="2" stroke-dasharray="2 4"/>' +
      '<text x="' + (w - 16) + '" y="' + yy + '" text-anchor="end" font-size="22" ' + KF_FR + ' fill="#3b4a8a">' + r[1] + '</text>';
  });
  var yv = 58 + (n - 1) * dy + 16;
  s += '<path d="M' + (w - 76) + ' ' + yv + 'H' + (w - 12) + '" stroke="#3b4a8a" stroke-width="2.2"/><text x="14" y="' + (yv + 30) + '" font-size="16" ' + KF_FR + ' fill="#3b4a8a">összesen:</text>' +
       '<text x="' + (w - 16) + '" y="' + (yv + 32) + '" text-anchor="end" font-size="28" ' + KF_FR + ' fill="#3b4a8a">' + irt + '</text>';
  if (o.kihuz) s += '<path d="M' + (w - 66) + ' ' + (yv + 24) + 'L' + (w - 14) + ' ' + (yv + 16) + '" stroke="#e0417a" stroke-width="3.4" stroke-linecap="round"/>';
  if (o.pecset) { var c = o.pecset === "ok" ? "#3f9e6a" : "#e0417a"; s += '<g transform="translate(' + F(w * .42) + ' ' + (yv + 22) + ') rotate(-10) scale(.6)" opacity=".85"><rect x="-36" y="-22" width="72" height="44" rx="8" fill="none" stroke="' + c + '" stroke-width="4"/><text y="13" text-anchor="middle" font-size="34" font-weight="700" fill="' + c + '">' + (o.pecset === "ok" ? "✓" : "✗") + '</text></g>'; }
  return s + '</g>';
}
/* 👛 erszény: (x, y) az alja közepe, m = nagyság; osszeg: a felirata (ennyi van benne — ez adott, nem a gyerek mondja ki) */
function kfErszeny(x, y, m, osszeg) {
  return '<g class="kf-erszeny" transform="translate(' + pcF(x) + ' ' + pcF(y) + ') scale(' + (m || 1) + ')"><g filter="url(#lt-firka)"><path d="M-30 -40Q-36 -2 0 0Q36 -2 30 -40Z" fill="#c9aee6" stroke="#7a5ca8" stroke-width="2.2"/>' +
    '<path d="M-26 -40Q0 -56 26 -40" fill="none" stroke="#7a5ca8" stroke-width="2.6"/><circle cx="-6" cy="-46" r="3" fill="#f7d57a" stroke="#b5842c"/><circle cx="6" cy="-46" r="3" fill="#f7d57a" stroke="#b5842c"/></g>' +
    '<text y="-14" text-anchor="middle" font-size="17" ' + KF_FR + ' fill="#4a3b7a">' + osszeg + '</text></g>';
}

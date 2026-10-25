/* ============ 6j4) 🪧 TÁRGY-KERET — a feladat egy tárgyon él a képben, nem téglalap kártyán (Pálya-hely B kör, 2026-10-25) ============
   Terv: terv/palyahely-targykeret-terv.html 7. pont · rajz: terv/palyahely-rajzterv.html 6. pont (✅ jóváhagyva; A: világos, fa-keretes tábla).
   EGY KÖZÖS KÉSZLET: a pálya csak megnevezi, melyik keretet kéri, a rajz itt van (a szél a phLap hullámos lapja, palyahely.js).
     kfFok    🪜 létrafok: fa deszka, rajta a feladat és a válasz helye (Rokon-létra)
     kfTabla  🖍️ a válasz helye: tábla fa kerettel, rá írja a gyerek a számot (egy pályán belül mindig ugyanott)
     kfUgras  ↷ számvonal-darab az ugrással a kerek tízesen át (7 → 10 → 12); a végét a gyerek mondja ki, a kép nem írja ki
     kfAblak  🪟 ablak három kavics-hellyel és a jellel (Számcsalád; C kör) · kfKavics 🪨 kerek kő a számmal · kfKosar 🧺 fonott kosár
   Később 🧾 cetli (a róka blokkja). A régi pályák belső kártyái is ide állnak át. */

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

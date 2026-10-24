/* ============ 6k3) 🐉 SÁRKÁNY-HOLMI — a 12 holmi rajza, a kívánság-tábla, az odú-réteg, a kérés ============
   Terv: terv/sarkany-kuldetesek-rajzterv.html (✅ jóváhagyva 2026-10-17, a prototípus innen került át). Motor: kuldetes.js.
   1. kód-kör (2026-10-17): az ágy-küldetés végig az odúban.
     • SH_HOLMI: 12 holmi × 10 részlet (4 ágy, 4 kisház, 4 ruhadarab — a 2–3. körig csak az ágy kerül elő). Egy részlet:
       [réteg, svg (szöveg vagy függvény a sárkány palettájával), „mit hoztunk” tárgyeset]; réteg h = a sárkány mögött,
       e = előtte, f = a fejen. Az építés sorrendje: sor. Hiányzó részlet = halvány, szaggatott lila körvonal.
     • A fióka-méretű, összegömbölyödött alvó póz: LENY_RAJZ.fAlvo (a leny.js rajzolója rajzolja).
     • Az odúban (leny.js lenyOduBelso hívja): a fészek helyén az épülő vagy a kész ágy; mellette a kívánság-tábla
       (koppintásra nagyban, a helyekre koppintva a kölyök megmondja, hova kell még menni); előtte a darab-kupac
       (koppintásra az unikornis odasétál, és felrakja); 💭, ha a kérést „Majd később”-re tette.
     • A kérés: fedőlap 3 ágy-rajzzal + „Majd később” (az odúba lépve, naponta egyszer magától).
     • Kész: a kölyök beleugrik, összegömbölyödik, Zzz — „Az enyém! Köszönöm!”. Ha az unikornis lefekszik, a kölyök is
       az ágyában alszik (rajzterv 3. kérdés A). Több ágynál az ágyra koppintva vált (9. döntés).
   2. kód-kör (2026-10-17): a KISHÁZ a kertben (rajzterv 9. rész; producer: „minden a kertben”).
     • A kert-rétegen (leny.js lenyKertRajzol, #ln-kert-reteg) a napozó szikla mellett: az épülő vagy a kész ház, a ház
       építése alatt mellette a kívánság-tábla és előtte a darab-kupac. A felrakás ugyanúgy megy, mint az odúban: koppintás
       a kupacra → az unikornis odasétál → a darab a helyére repül → egy rész kiszíneződik, a tábla pecsétet kap.
     • Az odúban a ház építése alatt a fészek fölött egy 🏡-buborék emlékeztet (benne a félkész ház); koppintásra a tábla.
     • Kész: a kölyök beszalad a házába, és kikukucskál — „Az enyém! Köszönöm!”. Ettől kezdve, ha a gyerek a kertbe megy,
       a kölyök is jön, és a házából kukucskál (rajzterv 2. kérdés A). A házra koppintva kiszalad és köszön; több háznál
       a koppintás vált (9. döntés).
   3. kód-kör (2026-10-17): a RUHA az odúban (rajzterv 8. rész).
     • A ruha a kölyökön készül: a tábla és a kupac ugyanott, mint az ágynál, a felrakott darab a kölyökre repül, és a
       készülő ruha hiányzó részletei halványan látszanak rajta (shKolyokRajz — ezt rajzolja az odú, a kert és a kísérő).
     • Kész: felveszi és megpördül — „Az enyém! Köszönöm!”. Az első ruhával a fészek mellé kerül a ruhaláda (SH_ODU.lada):
       koppintásra a fedele hátrabillen, és nagyban nyílik az öltöző (kuldOltozo; a rajzterv kis belső paneljét gyerekujjnyi
       gombokra cseréltem, ahogy a tábla is nagyban nyílik): fent a kölyök, alatta a megszerzett ruhák; egy ruhára koppintva
       felveszi (megpördül), újra koppintva leveszi. Helyenként (nyak, fej, láb, hát) egy lehet rajta; az új ugyanarra a
       helyre a régit leveszi, a régi a ládában marad.
   Javítás (2026-10-18, producer): a KÉSZ ágy (ház) az új építése alatt sem tűnik el. Ha már van kész, az marad a helyén
     (a kölyök abban alszik, abból kukucskál), az új MELLETTE épül (SH_ODU.agyUj, SH_KERT.hazUj); elkészülve az új kerül
     a régi helyére, a régi koppintással visszaváltható (9. döntés).
   Tiltólista: nincs szám („4/10”), nincs határidő, a felrakott darab soha nem tűnik el. */

/* ── a fióka-méretű alvó póz (rajzterv) ── */
LENY_RAJZ.fAlvo = { test: [0, -17, 31, 17], fej: [27, -18, 0.86], nyak: null, alszik: true,
  labak: { w: 0, kozel: [], tavol: [] }, szarny: { x: -6, y: -27, s: 0.42, ket: false, fekvo: true },
  farok: { p: [[-26, -6], [-44, 4], [-14, 12], [16, 6]], w: [12, 4], sziv: 6, tuske: [0.3, 0.5], elol: true },
  hatTuske: [200, 222, 246], szarv: 0.7, kar: null };

/* ── apró rajzoló segédek ── */
function shF(n) { return (+n).toFixed(1); }
function shSk(c, w) { return ' stroke="' + c + '" stroke-width="' + (w || 2.4) + '" stroke-linejoin="round" stroke-linecap="round"'; }
var SH_FA = "#7c5636";
function shFonat(y, x0, x1, c, h) { h = h || 5; var s = "M" + x0 + " " + y; for (var x = x0; x < x1; x += 12) s += "q3 " + (-h) + " 6 0t6 0"; return '<path d="' + s + '" fill="none"' + shSk(c, 2.2) + "/>"; }
function shLampas(x, y) {
  return '<path d="M' + x + " " + y + "v-44q0 -6 8 -6h6" + '" fill="none"' + shSk("#8d6440", 3) + "/>" +
    '<circle cx="' + (x + 15) + '" cy="' + (y - 38) + '" r="13" fill="#fff3b0" class="hr-lang hr-nincs" opacity=".7"/>' +
    '<path d="M' + (x + 10) + " " + (y - 46) + "h10l2 4v10l-2 3h-10l-2 -3v-10z" + '" fill="#ffe08a"' + shSk("#c99a3a", 1.8) + "/>" +
    '<path d="M' + (x + 12) + " " + (y - 49) + 'h6" ' + shSk("#8d6440", 2) + "/>";
}
function shCsillag(x, y, r, c) { return lnCsillag(x, y, r, c); }
/* 👢 a csizma oldalról: a láb (lnLab, w = 12) körvonala egy hajszállal vastagabban, előre néző orral;
   a perem a láb tetejénél lejjebb ül. Az 5 részlet: talp, szár, perem, pöttyök, csat. */
function shCsizmaOldal(x) {
  var w = 12, t = 0.8;
  return [
    '<path d="M' + shF(x - w / 2) + " .4H" + shF(x + w * 0.55) + "Q" + shF(x + w * 0.82 + t) + " .4 " + shF(x + w * 0.62 + t) + " " + shF(-w * 0.36) + '" fill="none"' + shSk("#6a4f9e", 3.4) + "/>",
    '<path d="M' + shF(x - w / 2 - t) + " -11V" + shF(-w * 0.3) + "Q" + shF(x - w / 2 - t) + " " + t + " " + shF(x - w / 4) + " " + t + "H" + shF(x + w * 0.55) + "Q" + shF(x + w * 0.82 + t) + " " + t + " " + shF(x + w * 0.62 + t) + " " + shF(-w * 0.36) +
      "Q" + shF(x + w / 2 + t) + " " + shF(-w * 0.46) + " " + shF(x + w / 2 + t) + " " + shF(-w * 0.6) + 'V-11Z" fill="#8fc8f0"' + shSk("#3f6f9e", 2) + "/>",
    '<rect x="' + shF(x - w / 2 - 1.8) + '" y="-14" width="' + shF(w + 3.6) + '" height="4.6" rx="2.3" fill="#fff"' + shSk("#3f6f9e", 1.6) + "/>",
    '<circle cx="' + shF(x - 2.6) + '" cy="-6.5" r="1.5" fill="#fff"/><circle cx="' + shF(x + 3.4) + '" cy="-8.4" r="1.3" fill="#fff"/><circle cx="' + shF(x + 6) + '" cy="-2.6" r="1.4" fill="#fff"/><circle cx="' + shF(x - 1.6) + '" cy="-2.2" r="1.3" fill="#fff"/>',
    '<rect x="' + shF(x + 0.8) + '" y="-6.6" width="5" height="3.4" rx="1" fill="#ffd86b"' + shSk("#c99a3a", 1.1) + "/>"];
}
function shTengeriCsillag(x, y, r, c) {
  var s = "M"; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; s += shF(x + rr * Math.cos(a)) + " " + shF(y + rr * Math.sin(a)) + (i < 9 ? "L" : "Z"); }
  return '<path d="' + s + '" fill="' + c + '"' + shSk("#d0775a", 1.6) + "/>";
}
function shMancs(x, y, r, c) {   /* sárkánymancs-pecsét */
  return '<g transform="translate(' + x + " " + y + ") scale(" + r / 10 + ')"><ellipse cx="0" cy="3" rx="5.2" ry="4.4" fill="' + c + '"/>' +
    '<ellipse cx="-5.6" cy="-3.6" rx="2.3" ry="3" fill="' + c + '" transform="rotate(-22 -5.6 -3.6)"/><ellipse cx="0" cy="-6" rx="2.3" ry="3" fill="' + c + '"/><ellipse cx="5.6" cy="-3.6" rx="2.3" ry="3" fill="' + c + '" transform="rotate(22 5.6 -3.6)"/></g>';
}
function shPikkely(x, y, s, p) {   /* a kért pálya kapuján: egy csillogó sárkány-pikkely */
  return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><path d="M0 -12C9 -12 12 -4 10 3C8 9 3 12 0 14C-3 12 -8 9 -10 3C-12 -4 -9 -12 0 -12Z" fill="' + p.b + '"' + shSk(p.d, 2) + "/>" +
    '<path d="M-6 -2C-3 2 3 2 6 -2M-4 5C-1 8 1 8 4 5" fill="none"' + shSk(p.s, 1.6) + '/><path d="M-5 -7C-3 -9 0 -9 2 -8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>';
}
function shKever(l) { l = l.slice(); for (var i = l.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = l[i]; l[i] = l[j]; l[j] = t; } return l; }

/* ════════════ SH_HOLMI: 12 holmi × 10 részlet (a rajzterv jóváhagyott rajza) ════════════
   Egység: a fióka rajzának egysége (talp y = 0, közép x = 0). Ágy: fek = hova kerül az alvó kölyök talppontja.
   Kisház: ajto = az ajtónyílás (ebből kukucskál ki). Ruha: hely = nyak | fej | lab | hat. */
var SH_HOLMI = [
/* ── 🛏️ ÁGYAK ── */
{ id: "bolcso", tip: "agy", nev: "Fonott bölcső", fek: [-8, -46], cls: "hr-hinta", r: [
  ["e", '<path d="M-74 -8Q0 14 74 -8" fill="none"' + shSk("#a8794c", 6) + '/><path d="M-74 -8Q0 14 74 -8" fill="none"' + shSk("#d9a86c", 3) + "/>", "egy ringatót"],
  ["h", '<path d="M42 -38Q38 -98 64 -100Q86 -98 80 -38Z" fill="#e2b77c"' + shSk(SH_FA) + '/><path d="M48 -56h28M46 -70h30M50 -84h24" fill="none"' + shSk("#b07a44", 2) + "/>", "egy fejtámlát"],
  ["h", '<path d="M-66 -38Q-64 -52 -48 -52H48Q64 -52 66 -38Z" fill="#fff4dc"' + shSk("#d8b98a", 2) + "/>", "egy puha matracot"],
  ["h", '<ellipse cx="42" cy="-52" rx="22" ry="10" fill="#f8c6d8"' + shSk("#d98aa8", 2) + '/><path d="M28 -54q14 -6 28 0" fill="none"' + shSk("#fbe0ea", 2) + "/>", "egy párnát"],
  ["e", '<path d="M-72 -38Q-70 -8 -44 -6H44Q70 -8 72 -38Z" fill="#e2b77c"' + shSk(SH_FA) + "/>", "egy fonott oldalt"],
  ["e", shFonat(-16, -62, 62, "#b07a44"), "egy vesszőt"],
  ["e", shFonat(-27, -66, 66, "#b07a44"), "még egy vesszőt"],
  ["e", '<rect x="-76" y="-44" width="152" height="10" rx="5" fill="#c99257"' + shSk(SH_FA) + '/><path d="M-68 -39h136" fill="none"' + shSk("#e8c08a", 2) + ' stroke-dasharray="6 5"/>', "egy peremet"],
  ["e", '<path d="M-62 -42Q-60 -66 -30 -66Q0 -64 14 -52Q18 -46 14 -42Z" fill="#a9d3f3"' + shSk("#6f9fc8", 2.2) + '/><circle cx="-40" cy="-54" r="2.6" fill="#fff"/><circle cx="-18" cy="-58" r="2.6" fill="#fff"/><circle cx="-4" cy="-50" r="2.6" fill="#fff"/><circle cx="-52" cy="-46" r="2.6" fill="#fff"/>', "egy takarót"],
  ["e", shCsillag(-62, -39, 9, "#ffd24d"), "egy csillagot"]
], sor: [0, 4, 5, 6, 7, 1, 2, 3, 8, 9] },
{ id: "kagylo", tip: "agy", nev: "Kagyló-ágy", fek: [-8, -40], r: [
  ["h", '<path d="M-74 -32Q-86 -118 0 -126Q86 -118 74 -32Q0 -44 -74 -32Z" fill="#fde3d8"' + shSk("#c97a68") + "/>", "egy nagy kagylóhéjat"],
  ["h", '<path d="M-56 -38Q-62 -100 0 -106Q62 -100 56 -38Q0 -46 -56 -38Z" fill="#fff6f0" opacity=".9"/>', "egy gyöngyházat"],
  ["h", function () { var s = ""; for (var i = 0; i < 7; i++) { var a = Math.PI * (1.08 + i * 0.14); s += "M" + shF(58 * Math.cos(a)) + " " + shF(-38 + 62 * Math.sin(a)) + "L" + shF(76 * Math.cos(a)) + " " + shF(-36 + 82 * Math.sin(a)); } return '<path d="' + s + '" fill="none"' + shSk("#eab3a2", 2.2) + "/>"; }, "kagyló-bordákat"],
  ["h", '<path d="M-64 -32Q-62 -46 -40 -46H40Q62 -46 64 -32Z" fill="#c9ecdf"' + shSk("#7fbfa6", 2) + "/>", "egy tengeri matracot"],
  ["h", '<circle cx="44" cy="-50" r="12" fill="#fffaf2"' + shSk("#d8c3b0", 2) + '/><circle cx="40" cy="-54" r="4" fill="#fff" opacity=".9"/>', "egy gyöngy-párnát"],
  ["e", '<path d="M-52 -2q-4 -10 6 -10q10 0 6 10zM40 -2q-4 -10 6 -10q10 0 6 10z" fill="#f59bb0"' + shSk("#d0778f", 2) + "/>", "két korall-lábat"],
  ["e", '<path d="M-74 -32Q-72 -4 0 -4Q72 -4 74 -32Q36 -24 0 -24Q-36 -24 -74 -32Z" fill="#fbd3c4"' + shSk("#c97a68") + "/>", "egy alsó kagylóhéjat"],
  ["e", '<path d="M-50 -28Q-40 -14 -30 -7M-20 -25Q-14 -14 -10 -5M20 -25Q14 -14 10 -5M50 -28Q40 -14 30 -7" fill="none"' + shSk("#e7a796", 2.2) + "/>", "még kagyló-bordákat"],
  ["e", '<path d="M-62 -36Q-60 -62 -34 -62Q-10 -62 12 -48Q16 -42 12 -36Z" fill="#b7e3f2"' + shSk("#6fb2cc", 2.2) + '/><path d="M-50 -48q5 -4 10 0t10 0t10 0" fill="none"' + shSk("#fff", 1.8) + "/>", "egy hab-takarót"],
  ["e", shTengeriCsillag(-58, -18, 9, "#f7b08a"), "egy tengeri csillagot"]
], sor: [6, 5, 7, 0, 1, 2, 3, 4, 8, 9] },
{ id: "felho", tip: "agy", nev: "Felhő-ágy", fek: [-8, -44], r: [
  ["h", '<path d="M14 -92a18 18 0 0 1 32 -8M10 -84a26 26 0 0 1 44 -12" fill="none" stroke="#f6a5c0" stroke-width="4" stroke-linecap="round"/><path d="M6 -76a34 34 0 0 1 56 -16" fill="none" stroke="#9ec9f0" stroke-width="4" stroke-linecap="round"/>', "egy kis szivárványt"],
  ["h", '<circle cx="60" cy="-64" r="24" fill="#fff"' + shSk("#b9c6e8", 2.2) + '/><circle cx="40" cy="-76" r="16" fill="#fff"' + shSk("#b9c6e8", 2.2) + "/>", "egy fejtámla-felhőt"],
  ["h", '<circle cx="-62" cy="-54" r="16" fill="#fff"' + shSk("#b9c6e8", 2.2) + "/>", "egy lábtámla-felhőt"],
  ["h", '<ellipse cx="0" cy="-42" rx="62" ry="10" fill="#f4f7ff"' + shSk("#c9d3ee", 2) + "/>", "egy felhő-matracot"],
  ["h", '<ellipse cx="42" cy="-50" rx="20" ry="9" fill="#e4d7fb"' + shSk("#ac90d8", 2) + "/>", "egy levendula-párnát"],
  ["e", '<rect x="-60" y="-14" width="8" height="14" rx="3" fill="#d2a676"' + shSk(SH_FA, 2) + '/><rect x="-42" y="-14" width="8" height="14" rx="3" fill="#d2a676"' + shSk(SH_FA, 2) + "/>", "két lábat"],
  ["e", '<rect x="34" y="-14" width="8" height="14" rx="3" fill="#d2a676"' + shSk(SH_FA, 2) + '/><rect x="52" y="-14" width="8" height="14" rx="3" fill="#d2a676"' + shSk(SH_FA, 2) + "/>", "még két lábat"],
  ["e", '<path d="M-70 -12Q-82 -28 -64 -36Q-52 -48 -32 -40Q-16 -52 2 -42Q20 -52 38 -40Q58 -48 68 -32Q82 -24 70 -12Z" fill="#fff"' + shSk("#b9c6e8") + "/>", "egy nagy felhőt"],
  ["e", '<path d="M-62 -40Q-58 -64 -30 -64Q-2 -62 12 -50Q16 -44 12 -40Z" fill="#cfb6ee"' + shSk("#8f73c2", 2.2) + "/>" + shCsillag(-40, -52, 4, "#fff6c0") + shCsillag(-16, -56, 3.4, "#fff6c0") + shCsillag(-2, -48, 3, "#fff6c0"), "egy csillagos takarót"],
  ["e", shCsillag(-46, -22, 4, "#ffd24d") + shCsillag(10, -24, 3.4, "#9ec9f0") + shCsillag(50, -22, 4, "#f6a5c0"), "csillagszemeket"]
], sor: [5, 6, 7, 3, 1, 2, 4, 8, 9, 0] },
{ id: "level", tip: "agy", nev: "Levél-függőágy", fek: [-6, -50], fugg: true, r: [
  ["h", '<path d="M-90 0L-84 -114L-75 -114L-78 0Z" fill="#b98a5c"' + shSk(SH_FA) + '/><path d="M-82 -114q-8 -10 -2 -16M-78 -114q6 -12 14 -10" fill="none"' + shSk("#6fae6a", 2.6) + "/>", "egy bal oldali ágat"],
  ["h", '<path d="M90 0L84 -114L75 -114L78 0Z" fill="#b98a5c"' + shSk(SH_FA) + '/><path d="M82 -114q8 -10 2 -16M78 -114q-6 -12 -14 -10" fill="none"' + shSk("#6fae6a", 2.6) + "/>", "egy jobb oldali ágat"],
  ["h", '<path d="M-80 -104Q-74 -84 -64 -70" fill="none"' + shSk("#c9a87a", 3) + "/>", "egy kötelet"],
  ["h", '<path d="M80 -104Q74 -84 64 -70" fill="none"' + shSk("#c9a87a", 3) + "/>", "még egy kötelet"],
  ["h", '<path d="M-66 -68Q-30 -80 0 -74Q34 -68 66 -68Q34 -42 0 -38Q-34 -40 -66 -68Z" fill="#b6e2a8"' + shSk("#4f9a55", 2.2) + "/>", "egy nagy levelet"],
  ["h", '<ellipse cx="40" cy="-64" rx="18" ry="8" fill="#ffd1dc"' + shSk("#e38aa3", 2) + "/>", "egy szirom-párnát"],
  ["e", '<path d="M-66 -68Q-30 -30 0 -30Q34 -32 66 -68Q34 -46 0 -46Q-30 -46 -66 -68Z" fill="#8fcf86"' + shSk("#4f9a55", 2.2) + "/>", "egy levélszélt"],
  ["e", '<path d="M-50 -52Q0 -36 50 -52M-30 -44l-6 -8M0 -40l-4 -10M30 -44l2 -9" fill="none"' + shSk("#d9f2cf", 1.8) + "/>", "levélereket"],
  ["e", '<path d="M-56 -58Q-50 -78 -24 -76Q2 -72 12 -60Q14 -54 8 -50Q-30 -48 -56 -58Z" fill="#f3e48a"' + shSk("#c9b23a", 2) + '/><path d="M-50 -60Q-20 -66 8 -54" fill="none"' + shSk("#c9b23a", 1.6) + "/>", "egy levél-takarót"],
  ["e", '<g class="hr-leng">' + shLampas(84, -60).replace('v-44q0 -6 8 -6h6', 'v-14q0 -6 8 -6h6') + "</g>", "egy lámpást"]
], sor: [0, 1, 2, 3, 4, 6, 7, 5, 8, 9] },

/* ── 🏡 KISHÁZAK (2. kód-kör) ── */
{ id: "gomba", tip: "haz", nev: "Gomba-ház", ajto: "M-20 0V-46Q-20 -66 0 -66Q20 -66 20 -46V0Z", r: [
  ["h", '<ellipse cx="0" cy="-2" rx="90" ry="10" fill="#a8dc9c"' + shSk("#6fae6a", 2) + "/>", "egy fűpárnát"],
  ["h", '<path d="M-50 0Q-56 -60 -42 -98H42Q56 -60 50 0Z" fill="#fff4e0"' + shSk("#c9a87a") + "/>", "egy gombatönköt"],
  ["h", '<path d="M-20 0V-46Q-20 -66 0 -66Q20 -66 20 -46V0Z" fill="#5a3e5e"/><path d="M-20 0V-46Q-20 -66 0 -66Q20 -66 20 -46V0" fill="none"' + shSk("#a8794c", 5) + "/>", "egy ajtót"],
  ["h", '<circle cx="34" cy="-62" r="9" fill="#fff3b0"' + shSk("#a8794c", 3) + '/><path d="M34 -71v18M25 -62h18" fill="none"' + shSk("#a8794c", 1.6) + "/>", "egy kerek ablakot"],
  ["h", '<path d="M-100 -88Q-104 -178 0 -184Q104 -178 100 -88Q50 -76 0 -78Q-50 -76 -100 -88Z" fill="#f08a8a"' + shSk("#b75a68") + "/>", "egy gombakalapot"],
  ["h", '<path d="M-92 -86Q0 -66 92 -86Q0 -78 -92 -86Z" fill="#fde0c8"' + shSk("#d8a88a", 1.8) + "/>", "egy kalap-szegélyt"],
  ["h", '<ellipse cx="-50" cy="-130" rx="14" ry="10" fill="#fff"/><ellipse cx="10" cy="-158" rx="12" ry="8" fill="#fff"/><ellipse cx="54" cy="-118" rx="10" ry="8" fill="#fff"/><ellipse cx="-12" cy="-112" rx="8" ry="6" fill="#fff"/><ellipse cx="-76" cy="-102" rx="7" ry="5" fill="#fff"/>', "fehér pöttyöket"],
  ["h", '<path d="M50 -150v-26h14v22Z" fill="#c98f6a"' + shSk("#8d5a3e", 2) + '/><circle cx="58" cy="-184" r="6" fill="#fff" class="hr-fust hr-nincs" opacity=".8"/><circle cx="58" cy="-184" r="5" fill="#fff" class="hr-fust k2 hr-nincs" opacity=".8"/>', "egy kéményt"],
  ["e", '<ellipse cx="-4" cy="6" rx="14" ry="5" fill="#d8cfe6"' + shSk("#a99bc4", 1.8) + '/><ellipse cx="20" cy="12" rx="12" ry="4.5" fill="#d8cfe6"' + shSk("#a99bc4", 1.8) + "/>", "lépőköveket"],
  ["e", shLampas(-74, 4), "egy lámpást"]
], sor: [0, 1, 2, 4, 5, 3, 6, 7, 8, 9] },
{ id: "tok", tip: "haz", nev: "Tök-ház", ajto: "M-18 0V-40Q-18 -60 0 -60Q18 -60 18 -40V0Z", r: [
  ["h", '<ellipse cx="0" cy="-2" rx="92" ry="10" fill="#a8dc9c"' + shSk("#6fae6a", 2) + "/>", "egy fűpárnát"],
  ["h", '<path d="M18 -126q-6 -24 8 -34" fill="none"' + shSk("#6d8a3a", 7) + '/><path d="M26 -150q26 -18 42 2q-24 10 -42 -2Z" fill="#9fd48a"' + shSk("#5a9a4a", 2) + "/>", "egy szárat levéllel"],
  ["h", '<ellipse cx="-50" cy="-62" rx="44" ry="60" fill="#f2a45e"' + shSk("#c7783d") + "/>", "egy tök-gerezdet"],
  ["h", '<ellipse cx="50" cy="-62" rx="44" ry="60" fill="#f2a45e"' + shSk("#c7783d") + "/>", "még egy tök-gerezdet"],
  ["h", '<ellipse cx="0" cy="-64" rx="46" ry="64" fill="#f8b673"' + shSk("#c7783d") + "/>", "a középső gerezdet"],
  ["h", '<path d="M-18 0V-40Q-18 -60 0 -60Q18 -60 18 -40V0Z" fill="#5a3e5e"/><path d="M-18 0V-40Q-18 -60 0 -60Q18 -60 18 -40V0" fill="none"' + shSk("#8d5a3e", 5) + "/>", "egy ajtót"],
  ["h", '<circle cx="58" cy="-80" r="10" fill="#fff3b0"' + shSk("#8d5a3e", 3) + '/><path d="M58 -90v20M48 -80h20" fill="none"' + shSk("#8d5a3e", 1.6) + "/>", "egy ablakot"],
  ["h", '<path d="M-80 -110q-14 4 -12 -8q2 -10 10 -4q4 4 -2 6" fill="none"' + shSk("#6d8a3a", 2.4) + '/><path d="M-96 -40q-12 -2 -8 -12q4 -6 9 -1" fill="none"' + shSk("#6d8a3a", 2.4) + "/>", "kacsokat"],
  ["e", '<rect x="-24" y="-2" width="48" height="8" rx="4" fill="#d8cfe6"' + shSk("#a99bc4", 1.8) + '/><rect x="-30" y="5" width="60" height="7" rx="3.5" fill="#d8cfe6"' + shSk("#a99bc4", 1.8) + "/>", "lépcsőket"],
  ["e", shLampas(72, 4), "egy lámpást"]
], sor: [0, 2, 3, 4, 1, 5, 6, 7, 8, 9] },
{ id: "ko", tip: "haz", nev: "Kő-barlangocska", ajto: "M-24 0V-44Q-24 -70 0 -70Q24 -70 24 -44V0Z", r: [
  ["h", '<path d="M-84 0Q-96 -70 -54 -98Q-34 -106 -18 -98L-20 0Z" fill="#d9d1c6"' + shSk("#958a7e") + '/><path d="M-70 -40q8 -4 14 2M-60 -70q8 -4 12 2" fill="none"' + shSk("#b8ad9f", 2) + "/>", "egy bal kőfalat"],
  ["h", '<path d="M84 0Q96 -70 54 -98Q34 -106 18 -98L20 0Z" fill="#e2dbd0"' + shSk("#958a7e") + '/><path d="M62 -30q8 -4 12 2M50 -66q8 -4 14 2" fill="none"' + shSk("#c2b8aa", 2) + "/>", "egy jobb kőfalat"],
  ["h", '<path d="M-64 -88Q-44 -144 8 -142Q72 -140 72 -88Q10 -74 -64 -88Z" fill="#cfc6b9"' + shSk("#958a7e") + "/>", "egy tető-sziklát"],
  ["h", '<path d="M-24 0V-44Q-24 -70 0 -70Q24 -70 24 -44V0Z" fill="#4a3a5e"/><path d="M-30 0V-44Q-30 -76 0 -76Q30 -76 30 -44V0" fill="none"' + shSk("#b0a596", 7) + ' stroke-dasharray="10 3"/>', "egy kőívet"],
  ["h", '<path d="M-90 4Q-60 -8 -30 2M30 2Q60 -8 90 4" fill="none"' + shSk("#b0a596", 8) + "/>", "alsó köveket"],
  ["h", '<path d="M-58 -96Q-40 -116 -10 -108Q10 -126 40 -118Q62 -116 66 -100Q30 -90 -58 -96Z" fill="#a8dc9c"' + shSk("#6fae6a", 2) + "/>", "egy mohát"],
  ["h", '<circle cx="-36" cy="-104" r="3.4" fill="#f6a5c0"/><circle cx="2" cy="-114" r="3.4" fill="#fff"/><circle cx="34" cy="-108" r="3.4" fill="#ffd24d"/><circle cx="52" cy="-104" r="3" fill="#f6a5c0"/>', "virágokat"],
  ["h", '<path d="M28 -128l6 -26l7 26ZM40 -126l8 -18l5 18ZM20 -124l4 -14l5 14Z" fill="#bfe3f7"' + shSk("#6fa8cc", 1.8) + "/>", "egy kristályt"],
  ["h", '<path d="M-44 -118v-34" fill="none"' + shSk("#8d6440", 3) + '/><path d="M-43 -152l22 6l-22 7Z" fill="#f2a45e"' + shSk("#c7783d", 1.6) + ' class="hr-zaszlo"/>', "egy zászlót"],
  ["e", shLampas(-76, 4), "egy lámpást"]
], sor: [4, 0, 1, 3, 2, 5, 6, 7, 8, 9] },
{ id: "kereg", tip: "haz", nev: "Kéreg-kunyhó", ajto: "M-18 0V-38Q-18 -56 0 -56Q18 -56 18 -38V0Z", r: [
  ["h", '<ellipse cx="0" cy="-2" rx="90" ry="10" fill="#a8dc9c"' + shSk("#6fae6a", 2) + "/>", "egy fűpárnát"],
  ["h", '<path d="M-58 0V-72H58V0Z" fill="#c99a6a"' + shSk(SH_FA) + '/><path d="M-44 -6v-60M-28 -8v-58M28 -8v-58M44 -6v-60" fill="none"' + shSk("#a77a4c", 2) + "/>", "kéreg-falat"],
  ["h", '<path d="M-18 0V-38Q-18 -56 0 -56Q18 -56 18 -38V0Z" fill="#5a3e5e"/><path d="M-18 0V-38Q-18 -56 0 -56Q18 -56 18 -38V0" fill="none"' + shSk("#8d5a3e", 5) + "/>", "egy ajtót"],
  ["h", '<rect x="28" y="-52" width="18" height="16" rx="3" fill="#fff3b0"' + shSk("#8d5a3e", 3) + '/><path d="M37 -52v16M28 -44h18" fill="none"' + shSk("#8d5a3e", 1.6) + "/>", "egy ablakot"],
  ["h", '<path d="M40 -104v-30h14v20Z" fill="#a8794c"' + shSk(SH_FA, 2) + '/><circle cx="47" cy="-140" r="6" fill="#fff" class="hr-fust hr-nincs" opacity=".8"/><circle cx="47" cy="-140" r="5" fill="#fff" class="hr-fust k2 hr-nincs" opacity=".8"/>', "egy kéményt"],
  ["h", '<path d="M-82 -58L2 -152L10 -144L-70 -50Z" fill="#9a6a44"' + shSk(SH_FA) + '/><path d="M-62 -68l20 -22M-40 -92l20 -22M-18 -116l14 -16" fill="none"' + shSk("#7a5234", 2) + "/>", "egy tetőfelet"],
  ["h", '<path d="M82 -58L-2 -152L-10 -144L70 -50Z" fill="#a8774c"' + shSk(SH_FA) + '/><path d="M62 -68l-20 -22M40 -92l-20 -22M18 -116l-14 -16" fill="none"' + shSk("#7a5234", 2) + "/>", "még egy tetőfelet"],
  ["h", '<path d="M-56 -66q8 -12 18 -6q6 -8 12 0q-14 10 -30 6Z" fill="#a8dc9c"' + shSk("#6fae6a", 1.8) + '/><path d="M30 -98q8 -10 16 -2q-8 6 -16 2Z" fill="#a8dc9c"' + shSk("#6fae6a", 1.8) + "/>", "mohát a tetőre"],
  ["h", '<path d="M-30 -62q0 -6 6 -6h4" fill="none"' + shSk("#8d6440", 2) + '/><ellipse cx="-20" cy="-56" rx="6" ry="7" fill="#e2a95e"' + shSk("#a8794c", 1.8) + '/><path d="M-26 -60q6 -6 12 0" fill="#8d6440"' + shSk("#6d4a2a", 1.6) + "/>", "egy makk-lámpát"],
  ["e", '<ellipse cx="-2" cy="7" rx="13" ry="5" fill="#e3c29a"' + shSk("#b08a5c", 1.8) + '/><ellipse cx="22" cy="13" rx="11" ry="4.5" fill="#e3c29a"' + shSk("#b08a5c", 1.8) + "/>", "fakorong-lépcsőt"]
], sor: [0, 1, 5, 6, 2, 3, 4, 7, 8, 9] },

/* ── 👕 RUHADARABOK (3. kód-kör; a kölyökön, f = fej-koordináta: a fej csoportjába kerül) ── */
{ id: "sal", tip: "ruha", hely: "nyak", nev: "Csillagos sál", r: (function () {
  var C = [[-6, -38], [2, -30], [18, -30], [28, -40]], szin = ["#7fd0c8", "#ffd86b"], r = [];
  for (var i = 0; i < 5; i++) {
    var a = lnBez(C, i / 5), b = lnBez(C, (i + 0.5) / 5), c = lnBez(C, (i + 1) / 5);
    r.push(["e", '<path d="M' + shF(a[0]) + " " + shF(a[1]) + "Q" + shF(b[0]) + " " + shF(b[1]) + " " + shF(c[0]) + " " + shF(c[1]) + '" fill="none"' + shSk("#3f7f86", 11.5) + '/><path d="M' + shF(a[0]) + " " + shF(a[1]) + "Q" + shF(b[0]) + " " + shF(b[1]) + " " + shF(c[0]) + " " + shF(c[1]) + '" fill="none" stroke="' + szin[i % 2] + '" stroke-width="7.5" stroke-linecap="round"/>', i ? "még egy kötött csíkot" : "egy kötött csíkot"]);
  }
  var V = [[2, -32], [-4, -24], [-10, -16], [-12, -8]];
  for (var j = 0; j < 3; j++) r.push(["e", '<path d="M' + V[j][0] + " " + V[j][1] + "L" + V[j + 1][0] + " " + V[j + 1][1] + '" fill="none"' + shSk("#3f7f86", 11) + '/><path d="M' + V[j][0] + " " + V[j][1] + "L" + V[j + 1][0] + " " + V[j + 1][1] + '" fill="none" stroke="' + szin[(j + 1) % 2] + '" stroke-width="7" stroke-linecap="round"/>', "egy sálvéget"]);
  r.push(["e", '<path d="M-17 -6l-2 6M-13 -5l-1 7M-9 -5l1 6" fill="none"' + shSk("#e0a800", 2) + "/>", "rojtokat"]);
  r.push(["e", shCsillag(-6, -20, 5, "#fff6c0").replace("/>", ' stroke="#e0a800" stroke-width="1"/>'), "egy csillagot"]);
  return r;
})() },
{ id: "sapka", tip: "ruha", hely: "fej", nev: "Bojtos sapka", r: [
  ["f", '<path d="M-21 -17Q2 -11 25 -19L24 -25Q2 -18 -20 -23Z" fill="#c95f86"' + shSk("#8a3a5e", 2) + "/>", "egy sapka-karimát"],
  ["f", function (p) {   /* a sapka teteje; a szarvak két lyukon át kibújnak belőle */
    var kv = shSk(p.d, 2.4);
    return '<path d="M-19 -22Q-18 -42 3 -43Q24 -42 24 -24Q2 -17 -19 -22Z" fill="#f6a5c0"' + shSk("#8a3a5e", 2.2) + "/>" +
      '<g transform="translate(0 -5)"><path d="M-7 -23C-10 -34 -5 -40 -1 -42C0 -36 1 -30 1 -24Z" fill="' + p.szarv + '"' + kv + '/><path d="M7 -25C6 -36 11 -41 16 -42C16 -36 14 -30 13 -24Z" fill="' + p.szarv + '"' + kv + "/></g>";
  }, "egy sapka-tetőt"],
  ["f", '<path d="M-17 -29Q3 -24 23 -30" fill="none"' + shSk("#e07aa3", 2) + "/>", "egy kötött sort"],
  ["f", '<path d="M-14 -35Q3 -31 20 -36" fill="none"' + shSk("#e07aa3", 2) + "/>", "még egy kötött sort"],
  ["f", '<path d="M-8 -40Q3 -38 13 -41" fill="none"' + shSk("#e07aa3", 2) + "/>", "még egy kötött sort"],
  ["f", '<path d="M-15 -23l3 -3l3 3l3 -3l3 3M14 -24l3 -3l3 3" fill="none"' + shSk("#fff", 1.5) + "/>", "egy mintát"],
  ["f", '<path d="M-17 -22Q-24 -11 -19 -1Q-12 -9 -11 -21Z" fill="#c95f86"' + shSk("#8a3a5e", 2) + "/>", "egy fülvédőt"],
  ["f", '<path d="M-17 -2v8" fill="none"' + shSk("#8a3a5e", 1.8) + '/><circle cx="-17" cy="8" r="3.4" fill="#ffd86b"' + shSk("#c99a3a", 1.4) + "/>", "egy kis bojtot"],
  ["f", '<circle cx="-17" cy="-41" r="7.5" fill="#ffd86b"' + shSk("#c99a3a", 2) + '/><path d="M-22 -43l3 2M-16 -47l1 3M-13 -41l-3 1" fill="none"' + shSk("#fff3b0", 1.6) + "/>", "egy nagy bojtot"],
  ["f", '<path d="M3 -31c-3 -4 -8 0 0 5c8 -5 3 -9 0 -5Z" fill="#fff"' + shSk("#c95f86", 1.4) + "/>", "egy szívet"]
] },
{ id: "csizma", tip: "ruha", hely: "lab", nev: "Pöttyös csizma", r: (function () {   /* 2026-10-24: a láb körvonalát követi (terv/sarkany-test-rajzterv.html) */
  var r = [];
  LENY_HORGONY.oldal.lab.forEach(function (q, k) {
    var nev = k ? "a másik csizma " : "egy csizma ", d = shCsizmaOldal(q[0]);
    ["talpát", "szárát", "peremét", "pöttyeit", "csatját"].forEach(function (n, i) { r.push(["e", d[i], nev + n]); });
  });
  return r;
})() },
{ id: "kopeny", tip: "ruha", hely: "hat", nev: "Hőscsillag-köpeny", r: (function () {
  var r = [], szin = ["#e3646f", "#ef7f86", "#e3646f", "#ef7f86", "#e3646f"];
  r.push(["h", '<g class="hr-kopeny"><path d="M12 -46Q-28 -52 -52 -30Q-62 -10 -54 6Q-30 -14 4 -32Z" fill="#9b3a55"' + shSk("#7a2a42", 2) + '/></g>', "egy bélést"]);
  for (var i = 0; i < 5; i++) {
    var a = (172 + i * 13) * Math.PI / 180, L = 58 + (i === 2 ? 6 : 0), bx = 10, by = -44;
    var tx = bx + L * Math.cos(a), ty = by + L * Math.sin(a) * -1;
    var nx = Math.sin(a) * 9, ny = Math.cos(a) * 9;
    r.push(["h", '<g class="hr-kopeny"><path d="M' + shF(bx + nx * 0.4) + " " + shF(by + ny * 0.4) + "Q" + shF((bx + tx) / 2 + nx) + " " + shF((by + ty) / 2 + ny) + " " + shF(tx) + " " + shF(ty) +
      "Q" + shF((bx + tx) / 2 - nx) + " " + shF((by + ty) / 2 - ny) + " " + shF(bx - nx * 0.4) + " " + shF(by - ny * 0.4) + 'Z" fill="' + szin[i] + '"' + shSk("#9b3a55", 2) + "/></g>", i ? "még egy köpeny-darabot" : "egy köpeny-darabot"]);
  }
  r.push(["h", '<g class="hr-kopeny">' + shCsillag(-30, -30, 6, "#ffd24d") + "</g>", "egy aranycsillagot"]);
  r.push(["h", '<g class="hr-kopeny">' + shCsillag(-44, -14, 4.5, "#fff6c0") + shCsillag(-40, -40, 4, "#fff6c0") + "</g>", "kis csillagokat"]);
  r.push(["e", '<path d="M0 -40Q12 -34 24 -42" fill="none"' + shSk("#9b3a55", 7) + '/><path d="M0 -40Q12 -34 24 -42" fill="none"' + shSk("#e3646f", 4) + "/>", "egy gallért"]);
  r.push(["e", shCsillag(12, -36, 5.5, "#ffd24d").replace("/>", ' stroke="#c99a3a" stroke-width="1.2"/>'), "egy csillag-csatot"]);
  return r;
})(), sor: [1, 2, 3, 4, 5, 0, 8, 9, 6, 7] }
];
var SH_HOLMI_BY = {}; SH_HOLMI.forEach(function (h) { SH_HOLMI_BY[h.id] = h; });

/* ════════════ A RUHÁK SZEMBŐL ÉS HÁTULRÓL (terv/sarkany-test-rajzterv.html, jóváhagyva 2026-10-24) ════════════
   SH_NEZET[id][nezet] = a részletek rajzolási sorrendben: [r, rés, rajz, takar]. r = az oldalrajz részletének sorszáma (h.r indexe;
   tömb = több részlet együtt: akkor kész, ha mind kész); amelyik részlet abból a nézetből nem látszik, annak nincs sora.
   rés: hatso | test | nyak | fej (a fej csoportjában) | elol; rajz: szöveg vagy függvény (p, R); takar: készen eltakarja a tarkó tüskéit.
   2. kódkör (2026-10-24): részletenként → a készülő ruha szemből és hátulról ugyanannyira kész, mint oldalról. A ruha a testrész alakját követi. */
function shQ(A, C, B, t) { var u = 1 - t; return [u * u * A[0] + 2 * u * t * C[0] + t * t * B[0], u * u * A[1] + 2 * u * t * C[1] + t * t * B[1]]; }
function shQResz(A, C, B, t0, t1) {   /* a másodfokú görbe [t0, t1] szakasza, pontosan */
  var a = shQ(A, C, B, t0), b = shQ(A, C, B, t1), m = [(1 - t0) * (1 - t1), (1 - t0) * t1 + t0 * (1 - t1), t0 * t1];
  return "M" + shF(a[0]) + " " + shF(a[1]) + "Q" + shF(m[0] * A[0] + m[1] * C[0] + m[2] * B[0]) + " " + shF(m[0] * A[1] + m[1] * C[1] + m[2] * B[1]) + " " + shF(b[0]) + " " + shF(b[1]);
}
function shSalDarab(d, w, c) { return '<path d="' + d + '" fill="none"' + shSk("#3f7f86", w + 4) + '/><path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
/* a sál: 5 kötött csík a nyakon, 3 darab sálvég, rojt, csillag — a csíkok színe váltakozik, mint oldalról */
function shSalNezet(nyak, veg, rojt, csillag) {
  var szin = ["#7fd0c8", "#ffd86b"], o = [], i;
  for (i = 0; i < 5; i++) o.push([i, "nyak", shSalDarab(shQResz(nyak[0], nyak[1], nyak[2], i / 5, (i + 1) / 5), 7.5, szin[i % 2])]);
  for (i = 0; i < 3; i++) o.push([5 + i, "nyak", shSalDarab("M" + veg[i].join(" ") + "L" + veg[i + 1].join(" "), 7, szin[(i + 1) % 2])]);
  o.push([8, "nyak", '<path d="' + rojt + '" fill="none"' + shSk("#e0a800", 2) + "/>"]);
  if (csillag) o.push([9, "nyak", csillag]);
  return o;
}
function shCsizmaSzem(x, csat) {   /* szemből / hátulról: [talp, szár, perem, pöttyök, csat] — a talp lekerekített, a szár a láb két oldalát követi */
  return ['<path d="M' + shF(x - 6.6) + " .3H" + shF(x + 6.6) + '" fill="none"' + shSk("#6a4f9e", 3.4) + "/>",
    '<path d="M' + shF(x - 7.6) + " -11V-4Q" + shF(x - 7.6) + " .6 " + shF(x - 3.2) + " .6H" + shF(x + 3.2) + "Q" + shF(x + 7.6) + " .6 " + shF(x + 7.6) + ' -4V-11Z" fill="#8fc8f0"' + shSk("#3f6f9e", 2) + "/>",
    '<rect x="' + shF(x - 8.6) + '" y="-14" width="17.2" height="4.6" rx="2.3" fill="#fff"' + shSk("#3f6f9e", 1.6) + "/>",
    '<circle cx="' + shF(x - 3.6) + '" cy="-6.5" r="1.5" fill="#fff"/><circle cx="' + shF(x + 3.8) + '" cy="-3.2" r="1.5" fill="#fff"/><circle cx="' + shF(x + 3.4) + '" cy="-8.6" r="1.3" fill="#fff"/><circle cx="' + shF(x - 3) + '" cy="-2" r="1.3" fill="#fff"/>',
    csat ? '<rect x="' + shF(x - 2.6) + '" y="-7.4" width="5.2" height="3.6" rx="1" fill="#ffd86b"' + shSk("#c99a3a", 1.1) + "/>" : ""];
}
function shCsizmaNezet(nezet) {   /* a két láb ugyanabban a sorrendben, mint oldalról (r = láb × 5 + részlet); hátulról a csat nem látszik */
  var o = [];
  LENY_HORGONY[nezet].lab.forEach(function (q, k) { shCsizmaSzem(q[0], nezet === "elol").forEach(function (d, i) { if (d) o.push([k * 5 + i, nezet === "elol" ? "elol" : "hatso", d]); }); });
  return o;
}
function shSapkaNezet(nezet) {
  var o = [
    [6, "fej", lnPar('<path d="M-24 -9Q-30 3 -23 12Q-17 3 -17 -9Z" fill="#c95f86"' + shSk("#8a3a5e", 2) + "/>")],
    [7, "fej", lnPar('<path d="M-23 11v6" fill="none"' + shSk("#8a3a5e", 1.8) + '/><circle cx="-23" cy="19" r="3.4" fill="#ffd86b"' + shSk("#c99a3a", 1.4) + "/>")],
    [8, "fej", '<circle cx="0" cy="-40" r="7" fill="#ffd86b"' + shSk("#c99a3a", 2) + '/><path d="M-5 -42l3 2M1 -46l1 3M4 -40l-3 1" fill="none"' + shSk("#fff3b0", 1.6) + "/>"],
    [1, "fej", '<path d="M-23 -14Q-23 -35 0 -36Q23 -35 23 -14Q0 -9 -23 -14Z" fill="#f6a5c0"' + shSk("#8a3a5e", 2.2) + "/>", 1],
    [2, "fej", '<path d="M-20 -24Q0 -19 20 -24" fill="none"' + shSk("#e07aa3", 2) + "/>"],
    [3, "fej", '<path d="M-15 -30Q0 -26 15 -30" fill="none"' + shSk("#e07aa3", 2) + "/>"],
    [4, "fej", '<path d="M-10 -33Q0 -31 10 -33" fill="none"' + shSk("#e07aa3", 2) + "/>"],
    [0, "fej", nezet === "elol" ? '<path d="M-25 -14Q0 -9 25 -14L24 -19Q0 -14 -24 -19Z" fill="#c95f86"' + shSk("#8a3a5e", 2) + "/>" : '<path d="M-25 -13Q0 -6 25 -13L24 -19Q0 -12 -24 -19Z" fill="#c95f86"' + shSk("#8a3a5e", 2) + "/>"],
    [5, "fej", '<path d="M-13 -21l3 -3l3 3l3 -3l3 3l3 -3l3 3l3 -3l3 3" fill="none"' + shSk("#fff", 1.5) + "/>"]
  ];
  if (nezet === "elol") o.push([9, "fej", '<path d="M0 -26c-3 -4 -8 0 0 5c8 -5 3 -9 0 -5Z" fill="#fff"' + shSk("#c95f86", 1.4) + "/>"]);
  o.push([1, "fej", function (p, R) { return lnNzSzarvak(p, R, -9); }]);   /* a sapka-tető része: a szarvak két lyukon át kibújnak */
  return o;
}
function shKopenyElol() {   /* szemből a köpeny két széle a váll mögül (a középső csík a test mögött: mindkét szélhez tartozik) */
  var szel = '<path d="M-12 -44Q-34 -32 -33 -2Q-28 2 -21 -2Q-24 -24 -6 -42Z" fill="#e3646f"' + shSk("#9b3a55", 2) + "/>";
  return [[[1, 2, 3], "hatso", szel], [[3, 4, 5], "hatso", '<g transform="scale(-1 1)">' + szel + "</g>"], [7, "hatso", lnPar(shCsillag(-27, -14, 4, "#fff6c0"))],
    [8, "nyak", '<path d="M-15 -41Q0 -34 15 -41" fill="none"' + shSk("#9b3a55", 7) + '/><path d="M-15 -41Q0 -34 15 -41" fill="none"' + shSk("#e3646f", 4) + "/>"],
    [9, "nyak", shCsillag(0, -37, 5.5, "#ffd24d").replace("/>", ' stroke="#c99a3a" stroke-width="1.2"/>')]];
}
function shKopenyHatul() {   /* hátulról a köpeny öt csíkja (váltakozó szín, mint oldalról), a két szélen a köpeny íve */
  var T = function (t) { return shQ([-13, -46], [0, -41], [13, -46], t); },
    B = function (u) { return u < 0.5 ? shQ([-31, -9], [-16, -4], [0, -7], u * 2) : shQ([0, -7], [16, -4], [31, -9], u * 2 - 1); },
    szin = ["#e3646f", "#ef7f86"], o = [];
  function pt(q) { return shF(q[0]) + " " + shF(q[1]); }
  function ut(f, a, b) { var s = ""; for (var j = 1; j <= 4; j++) s += "L" + pt(f(a + (b - a) * j / 4)); return s; }
  for (var k = 0; k < 5; k++) {
    var a = k / 5, b = (k + 1) / 5, d = "M" + pt(T(a)) + ut(T, a, b) + (k === 4 ? "Q36 -28 31 -9" : "L" + pt(B(b))) + ut(B, b, a) + (k === 0 ? "Q-36 -28 -13 -46Z" : "Z");
    o.push([k + 1, "test", '<path d="' + d + '" fill="' + szin[k % 2] + '"' + shSk("#9b3a55", 2) + "/>"]);
  }
  o.push([6, "test", shCsillag(-12, -24, 6, "#ffd24d")], [7, "test", shCsillag(14, -16, 4, "#fff6c0") + shCsillag(12, -34, 3.5, "#fff6c0")],
    [8, "test", '<path d="M-14 -45Q0 -50 14 -45" fill="none"' + shSk("#9b3a55", 7) + '/><path d="M-14 -45Q0 -50 14 -45" fill="none"' + shSk("#e3646f", 4) + "/>"]);
  return o;
}
var SH_NEZET = {
  sal: {
    elol: shSalNezet([[-19, -42], [0, -32], [19, -42]], [[-9, -37], [-10.3, -31], [-11.7, -25.5], [-13, -20]], "M-17 -15l-1 5M-13 -14l0 6M-9 -15l1 5", shCsillag(-11, -27, 5, "#fff6c0")),
    hatul: shSalNezet([[-20, -39], [0, -44], [20, -39]], [[5, -40], [6.7, -34.7], [8.4, -29.3], [10, -24]], "M6 -19l-1 5M10 -18l0 6M14 -19l1 5", null)
  },
  sapka: { elol: shSapkaNezet("elol"), hatul: shSapkaNezet("hatul") },
  csizma: { elol: shCsizmaNezet("elol"), hatul: shCsizmaNezet("hatul") },
  kopeny: { elol: shKopenyElol(), hatul: shKopenyHatul() }
};
/* a nézet-rajzoló (leny.js lenyNezetRajz) hívja: a ruhák rajza egy rés számára. ruhak: [{ id, kesz: {r: 1}, uj }] (shNezetRuhak) vagy csak id (= kész) */
function shNezetRes(ruhak, nezet, res, p, R) {
  return ruhak.map(function (t) {
    if (typeof t === "string") t = { id: t };
    var l = SH_NEZET[t.id] && SH_NEZET[t.id][nezet];
    return (l || []).filter(function (e) { return e[1] === res; }).map(function (e) {
      var ri = [].concat(e[0]), kesz = !t.kesz || ri.every(function (i) { return t.kesz[i]; }), uj = t.uj != null && ri.indexOf(t.uj) >= 0;
      return '<g class="' + (kesz ? "hr-kesz" : "hr-halv") + (uj ? " hr-uj" : "") + '"' + (kesz && e[3] ? ' data-takar="1"' : "") + ">" + (typeof e[2] === "function" ? e[2](p, R) : e[2]) + "</g>";
    }).join("");
  }).join("");
}
/* ami most a kölyökön látszik, az oldalrajzról (o) olvasva: a nézet pontosan azt mutatja, amit oldalról látunk —
   az odúban a készülő ruhát is, részletenként (a kész részletek telten, a hiányzók halványan) */
function shNezetRuhak(o) {
  var m = {}, l = [];
  if (o) Array.prototype.forEach.call(o.querySelectorAll(".hr[data-h]"), function (g) {
    var id = g.getAttribute("data-h"), i = +g.getAttribute("data-r");
    if (!SH_HOLMI_BY[id] || SH_HOLMI_BY[id].tip !== "ruha") return;
    if (!m[id]) l.push(m[id] = { id: id, kesz: {}, uj: null });
    if (g.classList.contains("hr-kesz")) m[id].kesz[i] = 1;
    if (g.classList.contains("hr-uj")) m[id].uj = i;
  });
  return l.sort(function (x, y) { return SH_RUHA_REND.indexOf(SH_HOLMI_BY[x.id].hely) - SH_RUHA_REND.indexOf(SH_HOLMI_BY[y.id].hely); });
}
var SH_TIP_NEV = { agy: "ágya", haz: "kisháza", ruha: "ruhája" };
var SH_TIP_HOZ = { agy: "ágyához", haz: "kisházához", ruha: "ruhájához" };
var SH_VB = { agy: "-112 -134 224 150", haz: "-110 -196 220 214", ruha: "-80 -112 160 124" };   /* viewBox típusonként (kártyák) */

/* ── a részletek: az építés sorrendje, és hogy n felrakott részletnél melyik rajz-részlet kész ── */
function shSor(h) { return h.sor || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; }
function shKeszE(h, n) { var s = shSor(h), k = {}; for (var i = 0; i < n; i++) k[s[i]] = 1; return k; }
function shResz(h, i, p) { var r = h.r[i]; return typeof r[1] === "function" ? r[1](p) : r[1]; }
/* a részletek rétegenként: { h, e, f }; uj = az épp felrakott részlet építési sorszáma (felvillan) */
function shReszek(h, n, uj, p) {
  var kesz = shKeszE(h, n), uji = uj != null ? shSor(h)[uj] : -1, o = { h: "", e: "", f: "" };
  h.r.forEach(function (r, i) {
    o[r[0]] += '<g class="hr ' + (kesz[i] ? "hr-kesz" : "hr-halv") + (i === uji ? " hr-uj" : "") + '" data-h="' + h.id + '" data-r="' + i + '">' + shResz(h, i, p) + "</g>";
  });
  return o;
}
/* egy holmi képe (fióka-egységben). opt: p (paletta), alvo (az ágyban alszik), kukucs (a házból kikukucskál), uj */
var _shId = 0;
function shHolmiSVG(h, n, opt) {
  opt = opt || {}; var p = opt.p || lenyPal(), R = shReszek(h, n, opt.uj, p), s = "";
  if (h.tip === "agy") {
    s = R.h;
    if (opt.alvo) s += '<g class="sh-alvo" transform="translate(' + h.fek[0] + " " + h.fek[1] + ')">' + lenyRajz("fAlvo", p) +
      '<text x="30" y="-36" class="hr-zzz" font-size="13" font-weight="700" fill="#8a4fd0">z</text><text x="38" y="-44" class="hr-zzz k2" font-size="16" font-weight="700" fill="#8a4fd0">Z</text></g>';
    s += R.e;
    if (h.fugg) s = '<g class="hr-fugg">' + s + "</g>";
    if (h.cls && n >= KULD_RESZ) s = '<g class="' + h.cls + '">' + s + "</g>";   /* a bölcső csak készen ring */
  } else if (h.tip === "haz") {
    s = R.h;
    if (opt.kukucs) {
      var id = "sh-ajto" + (++_shId);
      s += '<clipPath id="' + id + '"><path d="' + h.ajto + '"/></clipPath><g clip-path="url(#' + id + ')"><g class="hr-kukucs"><g transform="translate(-16 24)">' + shKolyokRajz(p) + "</g></g></g>";
    }
    s += R.e;
  } else {
    var fej = R.f, k = lenyRajz("fioka", p, { cls: opt.cls || "" });
    if (fej) { var i = k.indexOf('</g></g><g class="ln-szikra"'); if (i > 0) k = k.slice(0, i) + fej + k.slice(i); }
    s = R.h + k + R.e;
  }
  return s;
}
/* 👕 a kölyök (fióka-alak) azzal, ami most rajta van (kuldetes.js kuldRajta). opt: epul (az odúban a készülő ruha is,
   halvány körvonallal), uj (a készülő ruha épp felrakott részlete), cls; lista = [{ h, n }] a mentés helyett (póz-próbapad).
   Az odú, a kert és a kísérő ezt rajzolja. */
function shKolyokRajz(p, opt) {
  opt = opt || {}; p = p || lenyPal();
  var R = { h: "", e: "", f: "" }, l = opt.lista ? opt.lista.slice().sort(function (x, y) { return SH_RUHA_REND.indexOf(x.h.hely) - SH_RUHA_REND.indexOf(y.h.hely); }) : kuldRajta(opt.epul);
  l.forEach(function (t) {
    var r = shReszek(t.h, t.n, t.n < KULD_RESZ ? opt.uj : null, p);
    R.h += r.h; R.e += r.e; R.f += r.f;
  });
  var k = lenyRajz("fioka", p, { cls: opt.cls || "" });
  if (R.f) { var i = k.indexOf('</g></g><g class="ln-szikra"'); if (i > 0) k = k.slice(0, i) + R.f + k.slice(i); }
  return '<g class="sh-kolyok">' + R.h + k + R.e + "</g>";
}
function shSzikra(x, y, r) {
  return '<g class="hr-szikra" transform="translate(' + shF(x) + " " + shF(y) + ')">' + [[0, -r, 5, "#ffd24d"], [r, 0, 4, "#f6a5c0"], [0, r, 4, "#9ec9f0"], [-r, 0, 3.5, "#fff"], [r * 0.7, -r * 0.7, 3, "#fff6c0"]].map(function (c) { return shCsillag(c[0], c[1], c[2], c[3]); }).join("") + "</g>";
}
/* egy részlet önmagában, a saját talppontjára igazítva (kupac, ösvény): a getBBox a beillesztés után igazít.
   data-fit="szél mag": akkorára nagyít/kicsinyít, hogy beleférjen (a lapos „két láb” és a nagy kagylóhéj is jól látsszon) */
function shReszKozepre(gyoker) {
  Array.prototype.forEach.call(gyoker.querySelectorAll(".hr-kozep"), function (g) {
    try {
      var b = g.getBBox(), fit = (g.getAttribute("data-fit") || "").split(" "), s = 1;
      if (fit.length === 2 && b.width && b.height) s = Math.min(+fit[0] / b.width, +fit[1] / b.height, 1.2);
      g.setAttribute("transform", "scale(" + s.toFixed(3) + ") translate(" + shF(-(b.x + b.width / 2)) + " " + shF(-(b.y + b.height)) + ")");
    } catch (e) {}
  });
}

/* ════════════ A KÍVÁNSÁG-TÁBLA (rajzterv 4.): fent a holmi a saját állapotában, alatta a helyek ════════════
   Egy oszlop = egy pálya (fent és lent a két helye); a pecsétes helyen sárkánymancs. Nincs szám, nincs „×2”. */
function shPalya(id) { var pa = null; PALYAK.forEach(function (x) { if (x.id === id) pa = x; }); return pa; }
function shTablaSVG(a, opt) {
  opt = opt || {};
  var p = lenyPal(), h = SH_HOLMI_BY[a.id], pecset = kuldPecsetes(a);
  var s = '<g><path d="M60 286L80 230M300 286L280 230" stroke="#8d6440" stroke-width="10" stroke-linecap="round"/>' +
    '<rect x="16" y="10" width="328" height="240" rx="18" fill="#e9c896" stroke="#8d6440" stroke-width="4"/>' +
    '<rect x="28" y="22" width="304" height="216" rx="12" fill="#f6e2bd" stroke="#d2a676" stroke-width="2"/>';
  var vb = { agy: [0.62, 180, 116], haz: [0.44, 180, 118], ruha: [0.8, 180, 118] }[h.tip];
  s += '<g transform="translate(' + vb[1] + " " + vb[2] + ") scale(" + vb[0] + ')">' + shHolmiSVG(h, a.felrakva, { p: p }) + "</g>";
  var oszlop = [], d = Math.min(54, 290 / Math.max(1, new Set(a.helyek.map(function (x) { return x.p; })).size));
  a.helyek.forEach(function (x) { if (oszlop.indexOf(x.p) < 0) oszlop.push(x.p); });
  var hanyadik = {};
  a.helyek.forEach(function (x, i) {
    var osz = oszlop.indexOf(x.p), k = hanyadik[x.p] = (hanyadik[x.p] || 0) + 1, kesz = !!pecset[i];
    var cx = 180 + (osz - (oszlop.length - 1) / 2) * d, cy = 150 + (k - 1) * 46, pa = shPalya(x.p);
    s += '<g class="sh-hely" data-i="' + i + '" transform="translate(' + shF(cx) + " " + cy + ')">';
    var hozva = !kesz && !!x.kesz;   /* végigjárta, a darab a kupacon vár: folytonos keret, még nincs pecsét */
    s += '<circle r="19" fill="' + (kesz ? p.b : "#fffaf0") + '" stroke="' + (kesz || hozva ? p.d : "#c9a87a") + '" stroke-width="' + (hozva ? 3 : 2.4) + '"' + (kesz || hozva ? "" : ' stroke-dasharray="4 3"') + "/>";
    s += '<text y="6" text-anchor="middle" font-size="17"' + (kesz ? ' opacity=".5"' : "") + ">" + (pa ? pa.ikon : "?") + "</text>";
    if (kesz) s += '<g class="' + (opt.ujPecset === i ? "hr-pecset-uj" : "") + '" opacity=".78">' + shMancs(0, 1, 12, p.d) + "</g>";
    s += "</g>";
  });
  return s + "</g>";
}

/* ════════════ AZ ODÚBAN (odú-koordinátában; leny.js lenyOduBelso hívja) ════════════ */
var SH_ODU = { agy: [180, 518, 0.8], agyUj: [690, 532, 0.66], tabla: [-80, 446, 0.27], kupac: [296, 534], gondolat: [238, 470], hazjel: [204, 350], uniKupac: 360, lada: [52, 544, 0.8] };
var SH_LADA_NYIT = false;   /* a ruhaláda nyitva van (nem mentődik) */
var SH_ALSZIK = false;   /* a kölyök épp az ágyában alszik (kész pillanat, koppintás, az unikornis is alszik) — nem mentődik */
var _shFut = false;      /* felrakás / beugrás közben nincs új koppintás */
/* mi áll a fészek helyén: a kint lévő kész ágy, vagy (ha még nincs kész ágy) az épülő (akt) — vagy semmi (marad a fészek) */
function kuldOduAgy() {
  if (!kuldVan()) return null;
  var k = kuldTar(), a = k.akt, id = k.kint.agy;
  if (id && SH_HOLMI_BY[id]) return { h: SH_HOLMI_BY[id], n: KULD_RESZ, epul: false };
  return a && a.tip === "agy" ? { h: SH_HOLMI_BY[a.id], n: a.felrakva, epul: true } : null;
}
/* az új ágy, ha már van kész: a kész marad a fészek helyén, az új a szoba jobb sarkában épül (SH_ODU.agyUj) */
function kuldOduAgyUj() {
  if (!kuldVan()) return null;
  var k = kuldTar(), a = k.akt, id = k.kint.agy;
  return a && a.tip === "agy" && id && SH_HOLMI_BY[id] ? { h: SH_HOLMI_BY[a.id], n: a.felrakva, epul: true, A: SH_ODU.agyUj, uj: true } : null;
}
/* hova kerül a felrakott ágy-darab: [x, y, méret] */
function kuldOduEpuloHely() { var u = kuldOduAgyUj(); return u ? u.A : SH_ODU.agy; }
function shOduAgySVG(agy, opt) {
  opt = opt || {};
  var A = agy.A || SH_ODU.agy;
  return '<g id="' + (agy.uj ? "sh-agy-uj" : "sh-agy") + '" transform="translate(' + A[0] + " " + A[1] + ") scale(" + A[2] + ')" role="button" aria-label="' + htmlVed(agy.h.nev) + '">' +
    '<ellipse cx="0" cy="2" rx="80" ry="9" fill="#3b2f66" opacity=".14"/>' + shHolmiSVG(agy.h, agy.n, { alvo: opt.alvo, uj: opt.uj }) +
    '<rect x="-92" y="-118" width="184" height="124" fill="transparent"/></g>';
}
/* a többi a fészek körül: a tábla, a darab-kupac, a 💭 */
function kuldOduExtra() {
  if (!kuldVan()) return "";
  var k = kuldTar(), a = k.akt, uj = kuldOduAgyUj(), s = uj ? shOduAgySVG(uj) : "";
  if (a && a.tip === "haz") {   /* 🏡 a kisház a kertben épül: itt csak egy buborék emlékeztet (benne a félkész ház) */
    var G0 = SH_ODU.hazjel, hh = SH_HOLMI_BY[a.id], var_ = a.hozott > a.felrakva;
    s += '<g id="sh-hazjel" class="' + (var_ ? "hr-kupac" : "") + '" transform="translate(' + G0[0] + " " + G0[1] + ')" role="button" aria-label="A kölyök kisháza"><g class="hr-jel"><g>' +
      '<circle r="32" fill="#fffaf0" stroke="#c9a8e6" stroke-width="2.6"/><circle cx="-22" cy="38" r="7" fill="#fffaf0" stroke="#c9a8e6" stroke-width="2.2"/><circle cx="-32" cy="52" r="4" fill="#fffaf0" stroke="#c9a8e6" stroke-width="1.8"/>' +
      '<g transform="translate(0 21) scale(.23)">' + shHolmiSVG(hh, a.felrakva, {}) + "</g>" +
      '<rect x="-36" y="-36" width="72" height="94" fill="transparent"/></g></g></g>';
  } else if (a) {
    var T = SH_ODU.tabla;
    s += '<g id="sh-tabla" transform="translate(' + T[0] + " " + T[1] + ") scale(" + T[2] + ')" role="button" aria-label="Kívánság-tábla">' +
      shTablaSVG(a) + '<rect x="0" y="0" width="360" height="300" fill="transparent"/></g>';
    if (a.hozott > a.felrakva) s += shKupacSVG(a, "sh-kupac", SH_ODU.kupac, 1);
  } else if (kuldKesobbVan()) {
    var G = SH_ODU.gondolat;
    s += '<g id="sh-gondolat" class="hr-jel" transform="translate(' + G[0] + " " + G[1] + ')" role="button" aria-label="A kölyök kívánsága">' +
      '<circle r="20" fill="#fff" stroke="#e6d8f0" stroke-width="2"/><circle cx="-14" cy="24" r="5" fill="#fff" stroke="#e6d8f0" stroke-width="2"/>' +
      '<text y="8" text-anchor="middle" font-size="20">💭</text><rect x="-26" y="-26" width="52" height="58" fill="transparent"/></g>';
  }
  if (k.holmi.ruha.length) s += shLadaSVG(k);
  return s;
}
/* 👕 a ruhaláda (rajzterv 8.): az első ruhával jön, a fészek mellett. Koppintásra a fedél hátrabillen, belül dereng,
   és nagyban nyílik az öltöző (kuldOltozo) — a ruhák ott gyerekujjnyi gombok (a tábla is így nyílik nagyban) */
function shLadaSVG(k) {
  var L = SH_ODU.lada;
  return '<g id="sh-lada" class="sh-lada' + (SH_LADA_NYIT ? " hr-lada-nyit" : "") + '" transform="translate(' + L[0] + " " + L[1] + ") scale(" + L[2] + ')" role="button" aria-label="Ruhaláda">' +
    '<ellipse cx="0" cy="4" rx="66" ry="8" fill="#3b2f66" opacity=".14"/>' +
    '<g class="hr-lada-belso"><ellipse cx="0" cy="-50" rx="50" ry="22" fill="#fff3b0" opacity=".75"/>' + shCsillag(-22, -66, 5, "#ffd24d") + shCsillag(18, -74, 4, "#f6a5c0") + shCsillag(2, -86, 3.5, "#9ec9f0") + "</g>" +
    '<rect x="-56" y="-46" width="112" height="48" rx="6" fill="#c98f6a" stroke="#7c5636" stroke-width="2.6"/><path d="M-56 -26h112" stroke="#a8794c" stroke-width="2"/>' +
    shCsillag(-36, -14, 5, "#ffd24d") + shCsillag(36, -14, 5, "#ffd24d") + '<rect x="-8" y="-36" width="16" height="14" rx="3" fill="#ffd86b" stroke="#c99a3a" stroke-width="1.8"/>' +
    '<g class="hr-lada-fedel"><path d="M-58 -44Q-58 -70 0 -70Q58 -70 58 -44Z" fill="#d9a07a" stroke="#7c5636" stroke-width="2.6"/>' + shMancs(0, -56, 10, "#a8794c") + "</g>" +
    '<rect x="-60" y="-72" width="120" height="78" fill="transparent"/></g>';
}
/* egy ruhadarab önmagában (a kölyök nélkül), a ládából kivett képhez — viewBox -20 -20 40 40 */
var SH_RUHA_KEP = { sal: "translate(-1 19) scale(.5)", sapka: "translate(-10 41) scale(.53)", csizma: "translate(-1 7) scale(.72)", kopeny: "translate(10 14) scale(.38)" };
function shRuhaKep(h, p) {
  var R = shReszek(h, KULD_RESZ, null, p);
  var fej = R.f ? '<g transform="translate(' + LENY_RAJZ.fioka.fej[0] + " " + LENY_RAJZ.fioka.fej[1] + ')">' + R.f + "</g>" : "";
  return '<g transform="' + (SH_RUHA_KEP[h.id] || "scale(.5)") + '">' + R.h + fej + R.e + "</g>";
}
/* a darab-kupac (a hozott, még fel nem rakott darabok): levél-tálcán dereng; K = talppont, sc = méret */
function shKupacSVG(a, id, K, sc) {
  var h = SH_HOLMI_BY[a.id], resz = shResz(h, shSor(h)[a.felrakva], lenyPal()), tobb = a.hozott - a.felrakva > 1;
  return '<g id="' + id + '" class="hr-kupac" transform="translate(' + K[0] + " " + K[1] + ")" + (sc !== 1 ? " scale(" + sc + ")" : "") + '" role="button" aria-label="Hozott darab">' +
    '<ellipse cx="0" cy="2" rx="34" ry="8" fill="#9fd48a" stroke="#5a9a4a" stroke-width="2"/><path d="M-34 2q-8 -4 -4 -10M34 2q8 -4 4 -10" fill="none" stroke="#5a9a4a" stroke-width="2"/>' +
    (tobb ? '<g transform="translate(16 -2) rotate(12)" opacity=".85"><g class="hr-kozep" data-fit="40 26">' + shResz(h, shSor(h)[a.felrakva + 1], lenyPal()) + "</g></g>" : "") +
    '<g transform="translate(-4 -3)"><g class="hr-kozep" data-fit="58 40">' + resz + '</g></g><rect x="-42" y="-54" width="84" height="64" fill="transparent"/></g>';
}
/* a lenyOduKot hívja minden rajzoláskor: koppintások */
function kuldOduKot(svg) {
  _shFut = false;   /* újrarajzolás (ablakméret) egy jelenet közben: a lnIdoTorol már leállította, tiszta lap */
  if (!svg || !kuldVan()) return;
  shReszKozepre(svg.querySelector("#leny-odu") || svg);
  var t = svg.querySelector("#sh-tabla"), kp = svg.querySelector("#sh-kupac"), g = svg.querySelector("#sh-gondolat"), ag = svg.querySelector("#sh-agy"), hj = svg.querySelector("#sh-hazjel");
  if (hj) hj.addEventListener("click", function () {
    if (_shFut || _lnFut) return;
    var a = kuldAkt(); hangGomb();
    kuldTablaNagy(a && a.hozott > a.felrakva ? "Megjöttek a kisházam darabjai! A kertben várnak, a szikla mellett." : "A kisházam a kertben épül, a szikla mellett.");
  });
  if (t) t.addEventListener("click", function () { if (!_shFut && !_lnFut) { hangGomb(); kuldTablaNagy(); } });
  if (kp) kp.addEventListener("click", function () { if (!_shFut && !_lnFut) kuldFelrakJelenet(); });
  if (g) g.addEventListener("click", function () { if (!_shFut && !_lnFut) { hangGomb(); kuldKeresMutat(); } });
  if (ag) ag.addEventListener("click", function () { if (!_shFut && !_lnFut) kuldAgyKopp(); });
  var au = svg.querySelector("#sh-agy-uj");   /* az épülő új ágy (a kész mellett): koppintásra a tábla */
  if (au) au.addEventListener("click", function () { if (!_shFut && !_lnFut) { hangGomb(); kuldTablaNagy(); } });
  var ld = svg.querySelector("#sh-lada");
  if (ld) ld.addEventListener("click", function () {
    if (_shFut || _lnFut) return;
    hangGomb();
    SH_LADA_NYIT = true; ld.classList.add("hr-lada-nyit");
    _shFut = true;
    lnIdo(nyugiMod() ? 0 : 550, function () { _shFut = false; if (oduAktiv()) kuldOltozo(); });
  });
}
/* 👕 az öltöző (a nyitott láda nagyban): fent a kölyök abban, ami rajta van, alatta a megszerzett ruhák.
   Egy ruhára koppintva felveszi (megpördül), újra koppintva leveszi; helyenként egy lehet rajta. */
function kuldOltozo() {
  var k = kuldTar(), p = lenyPal(), nev = lenyTar().nev || "A kölyök", valtott = false;
  var ruhak = SH_HOLMI.filter(function (h) { return k.holmi.ruha.indexOf(h.id) >= 0; });
  var d = lenyFedo('<div class="leny-fogo"></div><div class="kuld-tabla-lap kuld-oltozo"><svg class="kuld-oltozo-kep" viewBox="-80 -112 160 124" xmlns="http://www.w3.org/2000/svg"></svg>' +
    '<div class="kuld-ruhak">' + ruhak.map(function (h) {
      return '<button class="kuld-ruha" data-id="' + h.id + '" aria-label="' + htmlVed(h.nev) + '"><svg viewBox="-20 -20 40 40" xmlns="http://www.w3.org/2000/svg">' + shRuhaKep(h, p) + "</svg><span>" + htmlVed(h.nev) + "</span></button>";
    }).join("") + '</div><p class="kuld-tabla-mondat" id="kuld-oltozo-mondat">🔊 Koppints egy ruhára!</p><button class="kuld-tabla-zar">✓ Kész</button></div>');
  function rajzol(porog) {
    var kep = d.querySelector(".kuld-oltozo-kep");
    kep.innerHTML = '<ellipse cx="0" cy="2" rx="34" ry="6" fill="#3b2f66" opacity=".14"/><g class="sh-oltozo-nezo" style="transform:scale(1,1)"><g>' + shKolyokRajz(p) + "</g></g>";
    Array.prototype.forEach.call(d.querySelectorAll(".kuld-ruha"), function (b) { var h = SH_HOLMI_BY[b.getAttribute("data-id")]; b.classList.toggle("rajta", k.rajta[h.hely] === h.id); });
    if (porog) lenyPorog(kep.querySelector(".sh-oltozo-nezo"), 1600);   /* körbefordul: szemből, oldalról, hátulról is megmutatja */
  }
  rajzol(false);
  mondd(nev + ": Ezek az én ruháim! Koppints egyre, és felveszem.");
  Array.prototype.forEach.call(d.querySelectorAll(".kuld-ruha"), function (b) {
    b.addEventListener("click", function () {
      var h = SH_HOLMI_BY[b.getAttribute("data-id")], on = kuldRuhaValt(h.id); if (on === null) return;
      valtott = true; hangGomb();
      rajzol(on);
      var m = on ? h.nev + "! Jól áll?" : "Leveszem, és visszateszem a ládába.";
      $("kuld-oltozo-mondat").textContent = "🐉 „" + m + "”";
      if (on) hangCsilla();
      mondd(nev + ": " + m);
    });
  });
  d.querySelector(".kuld-tabla-zar").addEventListener("click", function () {
    hangGomb(); lenyFedoZar();
    SH_LADA_NYIT = false;
    var ld = document.querySelector("#odu-szoba #sh-lada"); if (ld) ld.classList.remove("hr-lada-nyit");
    lnIdo(nyugiMod() ? 0 : 500, function () { if (!oduAktiv()) return; lenyOduFrissit(); if (valtott) kuldPorog(); });
  });
}
/* a kölyök megpördül (a ruha felvételekor) */
function kuldPorog() {
  lenyPorog(document.querySelector("#odu-szoba #ln-fioka-flip"), 1600);   /* 4 nézettel (leny.js), nem összenyomva */
}
/* hol áll most a kölyök az odúban (a totyogás közben is): [x, y] odú-koordinátában */
function kuldKolyokHol() {
  var f = document.querySelector("#odu-szoba #ln-fioka-poz"); if (!f) return null;
  var m = /translate\(([-\d.]+)px,\s*([-\d.]+)px/.exec(f.style.transform || "");
  try { var t = getComputedStyle(f).transform, mm = /matrix\(([^)]+)\)/.exec(t); if (mm) { var v = mm[1].split(","); return [+v[4], +v[5]]; } } catch (e) {}
  return m ? [+m[1], +m[2]] : null;
}
/* az oduNyit hívja (lenyOduNyit): ha ma még nem kért, most kér */
function kuldOduNyit() {
  SH_LADA_NYIT = false;   /* belépéskor a láda csukva */
  var ld = document.querySelector("#odu-szoba #sh-lada"); if (ld) ld.classList.remove("hr-lada-nyit");
  if (!kuldMagatolKer()) return false;
  lnIdo(1100, function () { if (oduAktiv() && !_lnFut) kuldKeresMutat(); });
  return true;
}

/* ── a kérés: fedőlap, 3 rajz + „Majd később” ── */
function kuldKeresMutat() {
  if (!oduAktiv()) return;
  var op = kuldKeresOpciok(); if (!op.length) return;
  var l = lenyTar(), nev = l.nev || "A kölyök";
  var d = lenyFedo('<div class="leny-fogo"></div><div class="kuld-keres"><div class="kuld-keres-cim">🐉 ' + htmlVed(nev) + ': „Van egy nagy kívánságom! Melyik legyen?”</div>' +
    '<div class="kuld-kartyak">' + op.map(function (id) {
      var h = SH_HOLMI_BY[id];
      return '<button class="kuld-kartya" data-id="' + id + '" aria-label="' + htmlVed(h.nev) + '"><svg viewBox="' + SH_VB[h.tip] + '" xmlns="http://www.w3.org/2000/svg">' +
        shHolmiSVG(h, KULD_RESZ, h.tip === "agy" ? { alvo: 1 } : h.tip === "haz" ? { kukucs: 1 } : {}) + '</svg><span>' + htmlVed(h.nev) + "</span></button>";
    }).join("") + '</div><button class="kuld-kesobb">Majd később</button></div>');
  mondd(nev + ": Van egy nagy kívánságom! Melyik legyen? " + op.map(function (id) { return SH_HOLMI_BY[id].nev; }).join(", vagy ") + "?");
  Array.prototype.forEach.call(d.querySelectorAll(".kuld-kartya"), function (b) {
    b.addEventListener("click", function () {
      hangGomb();
      var a = kuldValaszt(b.getAttribute("data-id"));
      lenyFedoZar();
      if (!a) return;
      lenyOduFrissit();
      var f = document.querySelector("#odu-szoba #ln-fioka-poz"); if (f) lenyTusszent(f);
      mondd(a.tip === "haz" ? "Ez lesz az! A kisházam a kertbe kerül, a napozó szikla mellé. Ehhez kell egy kis segítség " + kuldHonnan(a) + "!"
        : "Ez lesz az! Ehhez kell egy kis segítség " + kuldHonnan(a) + ". Nézd meg a táblát!");
    });
  });
  d.querySelector(".kuld-kesobb").addEventListener("click", function () {
    hangGomb(); kuldKesobb(); lenyFedoZar(); lenyOduFrissit();
    mondd("Jó, majd szólj!");
  });
}

/* ── a tábla nagyban: a helyekre koppintva a kölyök megmondja, hova kell még menni ── */
function kuldTablaNagy(elo) {   /* elo: a kölyök első mondata (az odú 🏡-buborékjáról: hol épül a ház) */
  var a = kuldAkt(); if (!a) return;
  var l = lenyTar(), nev = l.nev || "A kölyök";
  var d = lenyFedo('<div class="leny-fogo"></div><div class="kuld-tabla-lap"><svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg">' + shTablaSVG(a) + '</svg>' +
    '<p class="kuld-tabla-mondat" id="kuld-tabla-mondat">🔊 Koppints egy helyre!</p><button class="kuld-tabla-zar">✓ Rendben</button></div>');
  var tobb = a.helyek.filter(function (x) { return !x.kesz; }).length;
  if (elo) $("kuld-tabla-mondat").textContent = "🐉 „" + elo + "”";
  mondd(nev + ": " + (elo ? elo + " " : "") + (tobb ? "Ezek a pályák kellenek még " + { agy: "az ágyamhoz", haz: "a kisházamhoz", ruha: "a ruhámhoz" }[a.tip] + ". Koppints egy helyre!" : "Minden darab megvan! Rakjuk fel őket!"));
  Array.prototype.forEach.call(d.querySelectorAll(".sh-hely"), function (g) {
    g.addEventListener("click", function () {
      var x = a.helyek[+g.getAttribute("data-i")], pa = shPalya(x.p), pn = pa ? kiiras(pa.nev) : "";
      var hiany = a.helyek.filter(function (y) { return y.p === x.p && !y.kesz; }).length;
      var pv = /[?!.]$/.test(pn) ? pn : pn + "!";
      var m = hiany >= 2 ? "Ide még kétszer menjünk: " + pv : hiany === 1 ? "Ide még egyszer menjünk: " + pv : pn + ": ez már megvan, köszönöm!";
      hangGomb();
      $("kuld-tabla-mondat").textContent = "🐉 „" + m + "”";
      mondd(nev + ": " + m);
    });
  });
  d.querySelector(".kuld-tabla-zar").addEventListener("click", function () { hangGomb(); lenyFedoZar(); });
}

/* ── felrakás: az unikornis odasétál a kupachoz, a darab a helyére repül, egy rész kiszíneződik, a tábla pecsétet kap ── */
function kuldFelrakJelenet() {
  var svg = document.querySelector("#odu-szoba svg"), kp = svg && svg.querySelector("#sh-kupac"); if (!kp) return;
  _shFut = true; hangGomb();
  var ruha = (kuldAkt() || {}).tip === "ruha";
  function tovabb() {
    var H0 = lenyHelyek()[0];
    if (ruha) {   /* 👕 a kölyök a helyére totyog (ott marad az újrarajzolás után is), hogy a darab rá repülhessen */
      lnIdoTorol();
      var f = document.querySelector("#odu-szoba #ln-fioka-poz"), hol = kuldKolyokHol(), flip = document.querySelector("#odu-szoba #ln-fioka-flip"), hop = document.querySelector("#odu-szoba #ln-fioka-hop");
      if (f) {
        if (flip && hol) lenyFordul(flip, H0[0] < hol[0] ? -1 : 1);
        if (hop && !nyugiMod()) hop.setAttribute("class", "ln-hop");
        f.style.transition = "transform .8s linear";
        f.style.transform = "translate(" + H0[0] + "px," + H0[1] + "px)";
        lnIdo(850, function () { if (hop) hop.setAttribute("class", ""); lenyFordul(flip, 1); });
      }
    }
    var A = ruha ? [H0[0], H0[1] - 10] : kuldOduEpuloHely(), dir = A[0] > SH_ODU.uniKupac ? 1 : -1;   /* az épülő ágyra, vagy a ruha a kölyökre repül */
    oduUniSetal(SH_ODU.uniKupac, function () {
      ODU_UNI.dir = dir; uniFordul(document.getElementById("odu-uni-flip"), dir);
      var K = SH_ODU.kupac, kp2 = document.querySelector("#odu-szoba #sh-kupac");
      if (kp2 && kp2.animate && !nyugiMod()) {
        kp2.classList.remove("hr-kupac");
        kp2.animate([{ transform: "translate(" + K[0] + "px," + K[1] + "px)" }, { transform: "translate(" + ((K[0] + A[0]) / 2) + "px," + (A[1] - 90) + "px) scale(.8)" },
          { transform: "translate(" + A[0] + "px," + (A[1] - 40) + "px) scale(.5)", opacity: 0.2 }], { duration: 800, easing: "ease-in-out", fill: "forwards" }).onfinish = rak;
      } else rak();
    });
  }
  function rak() {
    var a = kuldAkt(); if (!a) { _shFut = false; return; }
    var uj = a.felrakva, h = SH_HOLMI_BY[a.id], elso = a.tip === "ruha" && !kuldTar().holmi.ruha.length, ki = kuldFelrak();
    if (!oduAktiv()) { _shFut = false; return; }
    var a2 = kuldAkt();
    if (ki === "kesz" && h.tip === "ruha") { lenyOduFrissit(); kuldUjResz(uj, h); hangCsilla(); lnIdo(700, function () { kuldRuhaKeszJelenet(h, elso); }); return; }
    if (ki === "kesz") { SH_ALSZIK = false; lenyOduFrissit(); kuldUjResz(uj, h); hangCsilla(); lnIdo(800, kuldKeszJelenet); return; }
    lenyOduFrissit(); kuldUjResz(uj, h);
    var pecset = a2 ? kuldPecsetes(a2) : {}, ujP = null;
    if (a2) ujP = kuldUjPecset(a2);
    if (ujP != null) kuldTablaPecsetFeny(ujP);
    hangCsilla();
    mondd(a2 && a2.felrakva < a2.hozott ? "Még egy darab vár!" : "Egy újabb rész a helyére került!");
    _shFut = false;
  }
  if (ODU_FEKSZIK) { oduFelkel(false, tovabb); return; }
  tovabb();
}
function kuldPecsetesN(a, n) { var x = { helyek: a.helyek, felrakva: n }; return kuldPecsetes(x); }
/* melyik hely kapott épp most pecsétet (az utolsó felrakással) — vagy null */
function kuldUjPecset(a) {
  var most = kuldPecsetes(a), elotte = kuldPecsetesN(a, a.felrakva - 1), uj = null;
  Object.keys(most).forEach(function (i) { if (!elotte[i]) uj = +i; });
  return uj;
}
/* az épp felrakott részlet felvillan + szikra */
function kuldUjResz(uj, h) { shUjResz(document.querySelector(h.tip === "ruha" ? "#odu-szoba #ln-fioka-poz" : "#odu-szoba #sh-agy-uj") || document.querySelector("#odu-szoba #sh-agy"), h, uj); }
function shUjResz(gyoker, h, uj) {
  var g = gyoker && gyoker.querySelector(".hr[data-h='" + h.id + "'][data-r='" + shSor(h)[uj] + "']");
  if (!g || !g.animate || nyugiMod()) return;
  try {
    var b = g.getBBox();
    g.animate([{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1.12)", opacity: 1, offset: 0.7 }, { transform: "scale(1)" }], { duration: 600, easing: "ease-out" });
    g.parentNode.insertAdjacentHTML("beforeend", shSzikra(b.x + b.width / 2, b.y + b.height / 2, 16));
  } catch (e) {}
}
function kuldTablaPecsetFeny(i, sel) {
  var g = document.querySelector((sel || "#odu-szoba #sh-tabla") + " .sh-hely[data-i='" + i + "'] g[opacity]");
  if (g) g.classList.add("hr-pecset-uj");
}
/* kész: a kölyök beleugrik az új ágyba, összegömbölyödik — „Az enyém! Köszönöm!” */
function kuldKeszJelenet() {
  _shFut = true;
  var nev = lenyTar().nev || "A kölyök";
  kuldBeugrik(function () {
    mondd(nev + ": Az enyém! Köszönöm!");
    kuldBuborek("Az enyém! Köszönöm!");
    _shFut = false;
    lnIdo(2500, oduUniHaza);
  });
}
/* 👕 kész a ruha: a kölyök megpördül benne — „Az enyém! Köszönöm!”; az elsővel megjön a ruhaláda is */
function kuldRuhaKeszJelenet(h, elso) {
  if (!oduAktiv()) return;
  _shFut = true;
  var nev = lenyTar().nev || "A kölyök", hol = lenyHelyek()[0];
  kuldPorog();
  var f = document.querySelector("#odu-szoba #ln-fioka-poz"); if (f) f.insertAdjacentHTML("beforeend", shSzikra(0, -40, 34));
  mondd(nev + ": Az enyém! Köszönöm!");
  var g = document.querySelector("#odu-szoba #leny-odu"); if (g) shBuborek(g, hol[0] + 40, hol[1] - 70, "Az enyém! Köszönöm!", 1, lnIdo);
  lnIdo(elso ? 2600 : 1200, function () {
    if (elso && oduAktiv()) {
      var ld = document.querySelector("#odu-szoba #sh-lada");
      if (ld) ld.insertAdjacentHTML("beforeend", shSzikra(0, -40, 50));
      mondd(nev + ": Nézd, egy ruhaláda! Ebben tartom a ruháimat. Ha koppintasz rá, kinyílik.");
    }
    _shFut = false;
    lnIdo(2500, oduUniHaza);
  });
}
/* a kölyök a helyéről az ágyba ugrik, aztán alszik (SH_ALSZIK) */
function kuldBeugrik(kesz) {
  var svg = document.querySelector("#odu-szoba svg"), f = svg && svg.querySelector("#ln-fioka-poz"), ag = kuldOduAgy();
  if (!ag) { if (kesz) kesz(); return; }
  var A = SH_ODU.agy, cel = [A[0] + ag.h.fek[0] * A[2], A[1] + ag.h.fek[1] * A[2]];
  function vege() { SH_ALSZIK = true; lenyOduFrissit(); var s2 = document.querySelector("#odu-szoba #sh-agy"); if (s2) s2.insertAdjacentHTML("beforeend", shSzikra(ag.h.fek[0], ag.h.fek[1] - 30, 30)); if (kesz) kesz(); }
  if (!f || nyugiMod()) { vege(); return; }
  lnIdoTorol();   /* a totyogás álljon meg */
  var hop = svg.querySelector("#ln-fioka-hop"), flip = svg.querySelector("#ln-fioka-flip");
  var m = /translate\(([-\d.]+)px,\s*([-\d.]+)px/.exec(f.style.transform || "") || [0, cel[0], cel[1]];
  if (flip) lenyFordul(flip, cel[0] < +m[1] ? -1 : 1);
  if (hop) hop.setAttribute("class", "ln-rebben");
  f.style.transition = "transform 1s cubic-bezier(.4,0,.4,1)";
  f.style.transform = "translate(" + shF(cel[0]) + "px," + shF(cel[1]) + "px)";
  lnIdo(1050, vege);
}
function kuldBuborek(t) {
  var svg = document.querySelector("#odu-szoba svg"), g = svg && svg.querySelector("#leny-odu"); if (!g) return;
  var A = SH_ODU.agy;
  shBuborek(g, A[0] + 40, A[1] - 96, t, 1, lnIdo);
}
/* beszéd-buborék egy svg-csoportba (x, y = a csücske fölött), sc méretben; ido = a réteg időzítője (eltűnik) */
function shBuborek(g, x, y, t, sc, ido) {
  var w = t.length * 8.6 + 34;
  var b = document.createElementNS("http://www.w3.org/2000/svg", "g");
  b.setAttribute("class", "sh-bub"); b.setAttribute("pointer-events", "none");
  b.innerHTML = '<rect x="' + shF(x - w / 2) + '" y="' + (y - 34) + '" width="' + shF(w) + '" height="34" rx="14" fill="#fff" stroke="#e6d8f0" stroke-width="2"/>' +
    '<path d="M' + (x - 22) + " " + (y - 1) + "l-8 14l18 -14" + '" fill="#fff" stroke="#e6d8f0" stroke-width="2" stroke-linejoin="round"/><rect x="' + (x - 28) + '" y="' + (y - 4) + '" width="24" height="4" fill="#fff"/>' +
    '<text x="' + x + '" y="' + (y - 11) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#2a2140">' + htmlVed(t) + "</text>";
  if (sc && sc !== 1) b.setAttribute("transform", "translate(" + shF(x * (1 - sc)) + " " + shF(y * (1 - sc)) + ") scale(" + sc + ")");
  g.appendChild(b);
  ido(3600, function () { if (b.parentNode) b.parentNode.removeChild(b); });
}
/* koppintás az ágyra: alszik → felébred; több ágy → vált (csillámfelhő); egy ágy → beleugrik */
function kuldAgyKopp() {
  var ag = kuldOduAgy(); if (!ag) return;
  hangGomb();
  if (ag.epul) { kuldTablaNagy(); return; }
  if (SH_ALSZIK) { SH_ALSZIK = false; lenyOduFrissit(); var f = document.querySelector("#odu-szoba #ln-fioka-poz"); if (f) lenyTusszent(f); mondd("Jó reggelt, " + (lenyTar().nev || "kicsi") + "!"); return; }
  var k = kuldTar();
  if (k.holmi.agy.length > 1) {
    var uj = SH_HOLMI_BY[kuldValt("agy")];
    lenyOduFrissit();
    var s = document.querySelector("#odu-szoba #sh-agy");
    if (s) s.insertAdjacentHTML("beforeend", shSzikra(0, -50, 40) + shSzikra(-40, -30, 26) + shSzikra(40, -70, 26));
    mondd(uj.nev + "!");
    return;
  }
  _shFut = true;
  kuldBeugrik(function () { _shFut = false; });
}
/* az unikornis lefekszik / felkel (odu.js): ha van ágya, a kölyök is az ágyában alszik (rajzterv 3. kérdés A) */
function kuldUniAlszik(alszik) {
  if (!kuldVan()) return;
  var ag = kuldOduAgy();
  if (!ag || ag.epul || SH_ALSZIK === !!alszik) return;
  SH_ALSZIK = !!alszik;
  lenyOduFrissit();
}

/* ── az ösvény végén (leny-kiser.js lenyKiserOduba): a kísérő kölyök felkapja a darabot. Visszaad: vitt-e ── */
function kuldKiserDarab(el) {
  if (!el || typeof J === "undefined" || !J.palya || !kuldKertPalya(J.palya.id)) return false;
  var a = kuldAkt(), h = SH_HOLMI_BY[a.id]; if (!h || a.hozott >= KULD_RESZ) return false;
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "kiser-darab");
  g.innerHTML = '<g transform="translate(12 -6)"><g class="hr-kozep" data-fit="24 18">' + shResz(h, shSor(h)[a.hozott], lenyPal()) + "</g></g>";
  el.appendChild(g);
  shReszKozepre(g);
  return true;
}
/* a liget-belső kártyáján: kis pikkely a kért pálya kapuján */
function kuldKartyaJel(pa) {
  if (pa.hamarosan || !kuldKertPalya(pa.id)) return "";
  return '<div class="kuld-pikkely" title="Ezt kéri a kis sárkány"><svg viewBox="-14 -14 28 30" xmlns="http://www.w3.org/2000/svg">' + shPikkely(0, 0, 1, lenyPal()) + "</svg></div>";
}

/* ════════════ 🏡 A KERTBEN: a kisház a napozó szikla mellett (2. kód-kör) ════════════
   A kert-rétegen (#ln-kert-reteg, KERT_LAY-koordináta), a szikla (LENY_KERT) bal oldalán. haz = a ház talppontja és
   mérete; tabla = a tábla talppontja (a szikla előtt) és mérete; kupac = a darab-kupac talppontja és mérete;
   uni = ennyivel arrébb áll meg az unikornis a kupactól (kert-egységben; fekvőn a tábla mögött, hogy ne takarja), aztán
   dir felé, a ház felé fordul. Álló képen (telefon) a tábla a szikla tetején áll, a kupac bal elöl. */
var SH_KERT = {
  f: { haz: [628, 474, 0.6], hazUj: [560, 590, 0.44], tabla: [792, 500, 0.2], kupac: [714, 512, 1.25], uni: 170, dir: -1 },
  a: { haz: [146, 502, 0.42], hazUj: [312, 604, 0.34], tabla: [300, 456, 0.14], kupac: [64, 548, 0.85], uni: 184, dir: -1 }   /* telefon: az unikornis se a kupacot, se a táblát ne takarja */
};   /* hazUj: az új ház itt épül, ha már van kész (az a helyén marad), elöl a fűben */
var SH_KERT_KINT = false;           /* a kölyök épp a háza előtt áll (kiszaladt, megérkezett) — nem mentődik */
var _shKFut = false, _shKGen = 0;   /* jelenet a kertben; a gen minden teljes újrarajzoláskor nő (a régi időzítők elhalnak) */
function kuldKertVan() {
  if (!kuldVan()) return false;
  var k = kuldTar();
  return !!((k.akt && k.akt.tip === "haz") || (k.kint.haz && SH_HOLMI_BY[k.kint.haz]));
}
/* mi áll a szikla mellett: a kint lévő kész ház, vagy (ha még nincs kész ház) az épülő (akt) — vagy semmi */
function kuldKertHaz() {
  var k = kuldTar(), a = k.akt, id = k.kint.haz;
  if (id && SH_HOLMI_BY[id]) return { h: SH_HOLMI_BY[id], n: KULD_RESZ, epul: false };
  return a && a.tip === "haz" ? { h: SH_HOLMI_BY[a.id], n: a.felrakva, epul: true, a: a } : null;
}
/* az épülő ház, akár a szikla mellett (nincs még kész), akár elöl a fűben (a kész mellett, SH_KERT.hazUj) — vagy null */
function kuldKertEpulo() {
  var k = kuldTar(), a = k.akt; if (!a || a.tip !== "haz") return null;
  var uj = !!(k.kint.haz && SH_HOLMI_BY[k.kint.haz]);
  return { h: SH_HOLMI_BY[a.id], n: a.felrakva, epul: true, a: a, uj: uj, H: SH_KERT[KERT_ORIENT][uj ? "hazUj" : "haz"] };
}
/* a lenyKertRajzol hívja minden teljes rajzolás előtt: félbeszakadt jelenet (kilépés, forgatás) → tiszta lap */
function kuldKertTorol() {
  _shKGen++;
  if (_shKFut) { _shKFut = false; KERT_TRUKK_FUT = false; }
  SH_KERT_KINT = false;
}
function kuldKertSVG() {
  var hz = kuldKertHaz(); if (!hz) return "";
  var L = SH_KERT[KERT_ORIENT], H = L.haz, kint = SH_KERT_KINT && !hz.epul, s = '<g id="sh-kert">';
  s += '<g id="sh-haz" class="sh-kert-kopp" transform="translate(' + H[0] + " " + H[1] + ") scale(" + H[2] + ')" role="button" aria-label="' + htmlVed(hz.h.nev) + '">' +
    '<ellipse cx="0" cy="4" rx="96" ry="12" fill="#3c2a50" opacity=".12"/>' + shHolmiSVG(hz.h, hz.n, { kukucs: !hz.epul && !kint }) +
    '<rect x="-100" y="-190" width="200" height="200" fill="transparent"/></g>';
  if (kint) s += '<g transform="translate(' + H[0] + " " + H[1] + ") scale(" + H[2] + ')" pointer-events="none"><g id="sh-kfuto" transform="translate(84 0)">' +
    '<ellipse cx="0" cy="2" rx="30" ry="6" fill="#3c2a50" opacity=".14"/><g id="sh-kflip" style="transform:scale(-1,1)"><g class="ln-hop">' + shKolyokRajz(lenyPal()) + "</g></g></g></g>";   /* néző-elem: lenyFordul */
  var ep = kuldKertEpulo();
  if (ep) {
    if (ep.uj) {   /* az új ház elöl a fűben épül, a kész a helyén marad */
      var U = ep.H;
      s += '<g id="sh-haz-uj" class="sh-kert-kopp" transform="translate(' + U[0] + " " + U[1] + ") scale(" + U[2] + ')" role="button" aria-label="' + htmlVed(ep.h.nev) + '">' +
        '<ellipse cx="0" cy="4" rx="96" ry="12" fill="#3c2a50" opacity=".12"/>' + shHolmiSVG(ep.h, ep.n, {}) + '<rect x="-100" y="-190" width="200" height="200" fill="transparent"/></g>';
    }
    var T = L.tabla;
    s += '<g id="sh-ktabla" class="sh-kert-kopp" transform="translate(' + shF(T[0] - 180 * T[2]) + " " + shF(T[1] - 286 * T[2]) + ") scale(" + T[2] + ')" role="button" aria-label="Kívánság-tábla">' +
      shTablaSVG(ep.a) + '<rect x="0" y="0" width="360" height="300" fill="transparent"/></g>';
    if (ep.a.hozott > ep.a.felrakva) s += shKupacSVG(ep.a, "sh-kkupac", L.kupac, L.kupac[2]).replace('class="hr-kupac"', 'class="hr-kupac sh-kert-kopp"');
  }
  return s + "</g>";
}
/* koppintások (a réteg maga átengedi a kattintást, csak ezek fognak) */
function kuldKertKot(svg) {
  var g = svg && svg.querySelector("#sh-kert"); if (!g) return;
  shReszKozepre(g);
  function kot(id, fn) {
    var e = g.querySelector("#" + id); if (!e) return;
    e.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (_shKFut || KERT_TRUKK_FUT || KERT_MOD || (typeof TVK !== "undefined" && TVK.allapot)) return;
      fn();
    });
  }
  kot("sh-haz", kuldHazKopp);
  kot("sh-haz-uj", function () { hangGomb(); kuldTablaNagy(); });
  kot("sh-ktabla", function () { hangGomb(); kuldTablaNagy(); });
  kot("sh-kkupac", kuldKertFelrakJelenet);
}
/* csak a ház-csoport rajzolódik újra (jelenet közben: a futó jelenet nem szakad meg) */
function kuldKertFrissit() {
  var svg = $("ln-kert-reteg"), g = svg && svg.querySelector("#sh-kert"); if (!g) return;
  g.insertAdjacentHTML("afterend", kuldKertSVG());
  g.parentNode.removeChild(g);
  kuldKertKot(svg);
}
function shKertPct(x) { var nz = kertTajNezet($("kert-szinter")); return ((x - nz.vb[0]) * nz.s) / (nz.w || 1) * 100; }
function shKertBub(t) {
  var g = $("sh-kert"), H = SH_KERT[KERT_ORIENT].haz; if (!g) return;
  shBuborek(g, H[0] + 30 * H[2], H[1] - 196 * H[2], t, KERT_ORIENT === "f" ? 1.2 : 0.9, lkIdo);
}
/* a kertbe lépve (kertNyit): ha a kisház egy darabja vár, a súgó odairányít */
function kuldKertErkezik() {
  if (!kuldVan()) return;
  var a = kuldAkt();
  if (a && a.tip === "haz" && a.hozott > a.felrakva) kertSugo("🐉 Megjöttek a kisház darabjai! Koppints rájuk a szikla mellett!");
}

/* ── felrakás a kertben: az unikornis a kupachoz sétál, a darab a házra repül, egy rész kiszíneződik, a tábla pecsétet kap ── */
function kuldKertFelrakJelenet() {
  var a = kuldAkt(); if (!a || a.tip !== "haz" || a.hozott <= a.felrakva) return;
  _shKFut = true; KERT_TRUKK_FUT = true; hangGomb();
  var gen = _shKGen, L = SH_KERT[KERT_ORIENT], K = L.kupac, H = kuldKertEpulo().H, doboz = $("kert-uni-doboz");
  var dir = H[0] > K[0] + L.uni ? 1 : L.dir;   /* az unikornis az épülő ház felé fordul */
  function el() { return gen === _shKGen && lkKertben(); }
  function vege() { if (gen === _shKGen) { _shKFut = false; KERT_TRUKK_FUT = false; } }
  function rak() {
    if (!el()) return;
    var uj = kuldAkt().felrakva, h = SH_HOLMI_BY[a.id], ki = kuldFelrak();
    if (ki === "kesz") SH_KERT_KINT = true;   /* a kész háznál a kölyök is megérkezik (kuldKertKeszJelenet) */
    kuldKertFrissit();
    shUjResz($("sh-haz-uj") || $("sh-haz"), h, uj);
    hangCsilla();
    if (ki === "kesz") { lkIdo(700, function () { if (el()) kuldKertKeszJelenet(); }); return; }
    var a2 = kuldAkt(), ujP = a2 ? kuldUjPecset(a2) : null;
    if (ujP != null) kuldTablaPecsetFeny(ujP, "#ln-kert-reteg #sh-ktabla");
    var tobb = a2 && a2.felrakva < a2.hozott;
    mondd(tobb ? "Még egy darab vár!" : "Egy újabb rész a helyére került!");
    if (!tobb) kertSugo(KERT_SUGO_SETA);
    vege();
  }
  if (KERT_UL || KERT_FEKSZIK) kertAll(false);
  kertSetalIde(shKertPct(K[0] + L.uni), function () {
    if (!el()) return;
    uniFordul(doboz, dir, function () {
      if (!el()) return;
      var kp = $("sh-kkupac"), cy = H[1] - 70 * H[2];
      if (kp && kp.animate && !nyugiMod()) {
        kp.classList.remove("hr-kupac");
        kp.animate([{ transform: "translate(" + K[0] + "px," + K[1] + "px) scale(" + K[2] + ")" },
          { transform: "translate(" + ((K[0] + H[0]) / 2) + "px," + (cy - 70 * H[2]) + "px) scale(" + (K[2] * 0.8) + ")" },
          { transform: "translate(" + H[0] + "px," + cy + "px) scale(" + (K[2] * 0.5) + ")", opacity: 0.2 }], { duration: 800, easing: "ease-in-out", fill: "forwards" }).onfinish = rak;
      } else rak();
    });
  });
}
/* kész: a kölyök megérkezik, beszalad az új házába, és kikukucskál — „Az enyém! Köszönöm!” */
function kuldKertKeszJelenet() {
  var gen = _shKGen, f = $("sh-kfuto"), nev = lenyTar().nev || "A kölyök";
  _shKFut = true; KERT_TRUKK_FUT = true;
  if (f && f.animate && !nyugiMod()) f.animate([{ transform: "translate(320px,0px)", opacity: 0 }, { transform: "translate(270px,0px)", opacity: 1, offset: 0.15 }, { transform: "translate(84px,0px)" }],
    { duration: 1300, easing: "ease-out", fill: "forwards" });
  lkIdo(nyugiMod() ? 300 : 1500, function () {
    if (gen !== _shKGen) return;
    kuldKertBeszalad(function () {
      shKertBub("Az enyém! Köszönöm!");
      mondd(nev + ": Az enyém! Köszönöm!");
      var s = $("sh-haz"); if (s) s.insertAdjacentHTML("beforeend", shSzikra(0, -100, 70) + shSzikra(-70, -60, 44) + shSzikra(70, -140, 44));
      _shKFut = false; KERT_TRUKK_FUT = false;
      kertSugo(KERT_SUGO_SETA);
    });
  });
}
/* a kölyök az ajtóhoz szalad, eltűnik benne, aztán kikukucskál */
function kuldKertBeszalad(kesz) {
  var gen = _shKGen, f = $("sh-kfuto");
  function be() {
    if (gen !== _shKGen) return;
    SH_KERT_KINT = false; kuldKertFrissit();
    var k = document.querySelector("#sh-haz .hr-kukucs");
    if (k && k.animate && !nyugiMod()) k.animate([{ transform: "translate(0,46px)" }, { transform: "translate(0,-4px)", offset: 0.7 }, { transform: "translate(0,0)" }], { duration: 900, easing: "ease-out" });
    if (kesz) lkIdo(nyugiMod() ? 0 : 900, function () { if (gen === _shKGen) kesz(); });
  }
  if (!f || !f.animate || nyugiMod()) { be(); return; }
  f.animate([{ transform: "translate(84px,0px)", opacity: 1 }, { transform: "translate(6px,0px)", opacity: 1, offset: 0.85 }, { transform: "translate(0px,0px) scale(.85)", opacity: 0 }],
    { duration: 1000, easing: "ease-in", fill: "forwards" }).onfinish = be;
}
/* koppintás a házra: épül → a tábla; több ház → vált (csillámfelhő); egy ház → a kölyök kiszalad és köszön */
function kuldHazKopp() {
  var hz = kuldKertHaz(); if (!hz) return;
  hangGomb();
  if (hz.epul) { kuldTablaNagy(); return; }
  var k = kuldTar();
  if (k.holmi.haz.length > 1) {
    var uj = SH_HOLMI_BY[kuldValt("haz")];
    kuldKertFrissit();
    var s = $("sh-haz"); if (s) s.insertAdjacentHTML("beforeend", shSzikra(0, -90, 70) + shSzikra(-60, -50, 44) + shSzikra(60, -130, 44));
    mondd(uj.nev + "!");
    return;
  }
  var gen = _shKGen, nev = lenyTar().nev || "A kölyök";
  _shKFut = true; KERT_TRUKK_FUT = true;
  SH_KERT_KINT = true; kuldKertFrissit();
  var f = $("sh-kfuto"), kfl = $("sh-kflip");
  lenyIranyAll(kfl, 1);   /* kifelé szalad (jobbra), aztán felénk fordulva köszön */
  if (f && f.animate && !nyugiMod()) f.animate([{ transform: "translate(0px,0px)", opacity: 0 }, { transform: "translate(34px,-34px)", opacity: 1, offset: 0.4 }, { transform: "translate(84px,0px)" }], { duration: 900, easing: "ease-out" });
  lkIdo(900, function () {
    if (gen !== _shKGen) return;
    lenyFelenk($("sh-kflip"), 0);
    shKertBub("Szia! Ez az én házam!");
    mondd(nev + ": Szia! Ez az én házam!");
    lkIdo(2600, function () {
      if (gen !== _shKGen) return;
      lkIdo(lenyFordul($("sh-kflip"), -1), function () {   /* visszafordul a ház felé */
        if (gen === _shKGen) kuldKertBeszalad(function () { _shKFut = false; KERT_TRUKK_FUT = false; });
      });
    });
  });
}

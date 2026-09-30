/* ══ 🎨 FIGURÁK — az állandó szereplők saját rajza (producer jóváhagyta: 2026-09-30) ══
   Tervlap: Matekos\figurak-rajzterv.html — a rajzoló-kód onnan jött át változtatás nélkül (csak fg- előtaggal).
   A FIGURA-tábla (constants.js) `e` mezője betöltéskor a VIDÁM fej-érem SVG-re cserélődik; az emoji `emo`-ban marad.
   Így a 📚 Bagolykönyvtár és a 🧺 Tündérvásár minden képe egy lépésben rajzolt lett.
   Három arc: vidam (alap) · gondol (ő kérdez / „?”-es érem / rossz válasz után) · ujjong (jó válasznál, aztán vissza).
   Új szereplő = egy sor a FIG_RAJZ-ba + egy sor a FIGURA-ba. */
var FIG_RAJZ = {
  mia:    { b: "#eda06a", d: "#a8603a", l: "#fde6cc", ful: "mokus", pofa: "kicsi", farok: "mokus", tart: "makk" },
  samu:   { b: "#ecd0ad", d: "#7a5a46", l: "#fbeede", tu: "#8a6650", ful: "sun", pofa: "orr", farok: "sun", fej: "alma" },
  brumi:  { b: "#bd8759", d: "#6e472c", l: "#efd3ae", ful: "kerek", pofa: "medve", tart: "mez" },
  cincin: { b: "#cbc1da", d: "#7d6f96", l: "#f3eef8", ful: "eger", pofa: "eger", farok: "eger", tart: "sajt" },
  brekus: { b: "#9ed686", d: "#4f8f42", l: "#e5f6d3", ful: "beka", pofa: "beka", test: "csokor" },
  kata:   { b: "#fde8a0", d: "#c3953a", l: "#fff8dc", ful: "kacsa", pofa: "csor", test: "kendo" },
  tas:    { b: "#b9de96", d: "#5f8c45", l: "#f3e6ad", ful: "", pofa: "semmi", farok: "pancel", fej: "sapka" },
  potyi:  { b: "#f9c3cf", d: "#cf7890", l: "#fde3ea", ful: "malac", pofa: "malac", farok: "malac", fej: "masni", ruha: "#f4889c", test: "potty" },
  bence:  { b: "#adb2ba", d: "#555b64", l: "#f2f3f5", ful: "kerek", pofa: "borz", tart: "lapat" },
  kitti:  { b: "#fde6d8", d: "#a8403a", l: "#fde6d8", ful: "katica", pofa: "orr", ruha: "#f0766a", test: "katica", tart: "virag" },
  pali:   { b: "#ece6f0", d: "#9187a3", l: "#fbf8fd", ful: "nyul", pofa: "nyul", tart: "repa" },
  juli:   { b: "#f4a15e", d: "#b35f28", l: "#fff4e8", ful: "roka", pofa: "roka", farok: "roka", test: "sal" },
  tuske:  { b: "#ecd0ad", d: "#6d5446", l: "#fbeede", tu: "#a8988e", ful: "sun", pofa: "orr", farok: "sun", fej: "kendo", ruha: "#9ec9f0", test: "koteny" }
};
/* pislogás-eltolás: ne pislogjon egyszerre az egész csapat */
Object.keys(FIG_RAJZ).forEach(function (k, i) { FIG_RAJZ[k].kes = +(i * 0.73 % 4.2).toFixed(2); });

/* ── rajzoló — fej: 100×100-as rács, a fej közepe (50,58); alak: 120×150, a fej eltolva (10,0) ── */
var FG_INK = "#3b2f4a";
function fgTk(s, w) { return s + '<g transform="matrix(-1 0 0 1 ' + (w || 100) + ' 0)">' + s + '</g>'; }
function fgKv(d, w) { return ' stroke="' + d + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"'; }
function fgTuskek(cx, cy, r1, r2, a0, a1, n, fill, d) {
  var p = [], st = (a1 - a0) / (2 * n);
  for (var i = 0; i <= 2 * n; i++) { var a = (a0 + i * st) * Math.PI / 180, r = i % 2 ? r2 : r1; p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1)); }
  return '<polygon points="' + p.join(" ") + '" fill="' + fill + '"' + fgKv(d, 1.8) + '/>';
}

function fgFej(F, arc) {
  var s = "", b = F.b, d = F.d, beka = F.ful === "beka";
  /* a fej MÖGÖTT: fülek, tüskék, csápok */
  if (F.ful === "sun") s += fgTuskek(50, 58, 25, 41, 150, 390, 11, F.tu, d);
  if (F.ful === "kerek") s += fgTk('<circle cx="28" cy="36" r="10" fill="' + b + '"' + fgKv(d) + '/><circle cx="28" cy="36" r="5" fill="' + F.l + '"/>');
  if (F.ful === "eger") s += fgTk('<circle cx="25" cy="38" r="15" fill="' + b + '"' + fgKv(d) + '/><circle cx="25" cy="38" r="9" fill="#f7b6c8"/>');
  if (F.ful === "mokus") s += fgTk('<path d="M28,44 L23,12 Q38,20 42,36 Z" fill="' + b + '"' + fgKv(d) + '/><path d="M29,38 L26,20 Q35,25 37,34 Z" fill="' + F.l + '"/><path d="M23,13 Q18,6 24,3 Q23,8 27,12 Z" fill="' + d + '"/>');
  if (F.ful === "roka") s += fgTk('<path d="M26,46 L20,14 L46,34 Z" fill="' + b + '"' + fgKv(d) + '/><path d="M28,40 L25,23 L39,34 Z" fill="' + F.l + '"/><path d="M20,14 L22,24 L30,20 Z" fill="#5a3a2a"/>');
  if (F.ful === "nyul") s += fgTk('<g transform="rotate(-10 38 40)"><ellipse cx="38" cy="22" rx="8" ry="19" fill="' + b + '"' + fgKv(d) + '/><ellipse cx="38" cy="24" rx="4" ry="14" fill="#f7b6c8"/></g>');
  if (F.ful === "malac") s += fgTk('<path d="M30,42 L25,21 L45,33 Z" fill="' + b + '"' + fgKv(d) + '/><path d="M31,37 L28,26 L40,33 Z" fill="#f58fa8"/>');
  if (F.ful === "katica") s += fgTk('<path d="M42,34 Q36,19 30,14" fill="none" stroke="' + FG_INK + '" stroke-width="2.2" stroke-linecap="round"/><circle cx="30" cy="14" r="3.4" fill="' + FG_INK + '"/>');
  if (beka) s += fgTk('<circle cx="36" cy="38" r="12" fill="' + b + '"' + fgKv(d) + '/>');
  /* maga a fej */
  s += beka ? '<ellipse cx="50" cy="61" rx="33" ry="24" fill="' + b + '"' + fgKv(d) + '/>' : '<ellipse cx="50" cy="58" rx="30" ry="27" fill="' + b + '"' + fgKv(d) + '/>';
  if (beka) s += fgTk('<circle cx="36" cy="38" r="8.5" fill="#fff"/>');
  /* arc-díszek */
  if (F.pofa === "borz") s += '<path d="M44.5,32 Q50,30 55.5,32 L53.5,64 Q50,66 46.5,64 Z" fill="#f7f7f7"/>' + fgTk('<ellipse cx="38" cy="55" rx="7.5" ry="11" fill="#3e434b" transform="rotate(20 38 55)"/><circle cx="39" cy="56" r="6" fill="#fff"/>') + '<ellipse cx="50" cy="72" rx="11" ry="8" fill="#f2f3f5"/>';
  if (F.pofa === "roka") s += '<path d="M21,62 Q36,58 50,70 Q64,58 79,62 Q72,85 50,85 Q28,85 21,62 Z" fill="' + F.l + '"/>';
  if (F.ful === "katica") s += '<path d="M20.3,54 A30,27 0 0 1 79.7,54 Q50,44 20.3,54 Z" fill="#f0766a"' + fgKv(d) + '/><circle cx="37" cy="42" r="3.4" fill="' + FG_INK + '"/><circle cx="58" cy="37" r="3" fill="' + FG_INK + '"/><circle cx="68" cy="47" r="2.6" fill="' + FG_INK + '"/>';
  if (F.fej === "kendo") s += '<path d="M16,61 Q11,17 50,16 Q89,17 84,61 Q67,41 50,41 Q33,41 16,61 Z" fill="#c9aee6"' + fgKv("#7a5ca8") + '/><circle cx="34" cy="29" r="1.8" fill="#fff"/><circle cx="50" cy="23" r="1.8" fill="#fff"/><circle cx="66" cy="29" r="1.8" fill="#fff"/><circle cx="43" cy="37" r="1.5" fill="#fff"/><circle cx="57" cy="37" r="1.5" fill="#fff"/>';
  if (F.fej === "sapka") s += '<path d="M21,50 Q22,27 50,27 Q78,27 79,50 Q50,44 21,50 Z" fill="#fcd66a"' + fgKv("#c9a032") + '/><path d="M74,48 Q90,46 93,53 Q82,56 70,52 Z" fill="#fcd66a"' + fgKv("#c9a032") + '/><circle cx="50" cy="28" r="2.5" fill="#f5a54a"/>';
  if (F.ful === "kacsa") s += '<path d="M47,33 Q43,19 53,15 Q48,23 54,32 Z" fill="' + b + '"' + fgKv(d) + '/>';
  /* pofi */
  var py = beka ? 66 : 67, px = beka ? 26 : 31;
  s += fgTk('<ellipse cx="' + px + '" cy="' + py + '" rx="5" ry="3.2" fill="#f59bb0" opacity=".55"/>');
  /* szemek */
  var ey = beka ? 38 : 56, xs = beka ? [36, 64] : [39, 61], sz = "";
  if (arc === "ujjong") xs.forEach(function (x) { sz += '<path d="M' + (x - 4.5) + ',' + (ey + 1.5) + ' Q' + x + ',' + (ey - 4.5) + ' ' + (x + 4.5) + ',' + (ey + 1.5) + '" fill="none" stroke="' + FG_INK + '" stroke-width="2.6" stroke-linecap="round"/>'; });
  else {
    var dx = arc === "gondol" ? 1.4 : 0, dy = arc === "gondol" ? -1.8 : 0;
    xs.forEach(function (x) { sz += '<ellipse cx="' + (x + dx) + '" cy="' + (ey + dy) + '" rx="4.3" ry="5.3" fill="' + FG_INK + '"/><circle cx="' + (x + dx + 1.6) + '" cy="' + (ey + dy - 2) + '" r="1.7" fill="#fff"/>'; });
  }
  s += '<g class="fg-szem" style="animation-delay:' + (F.kes || 0) + 's">' + sz + '</g>';
  if (arc === "gondol") s += '<path d="M' + (xs[1] - 5) + ',' + (ey - 10) + ' Q' + xs[1] + ',' + (ey - 14) + ' ' + (xs[1] + 5) + ',' + (ey - 10.5) + '" fill="none" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/>';
  if (F.fej === "kendo") s += fgTk('<circle cx="39" cy="56" r="7.8" fill="none" stroke="#7a5ca8" stroke-width="1.8"/>') + '<path d="M46.8,55 Q50,52 53.2,55" fill="none" stroke="#7a5ca8" stroke-width="1.8"/>';
  /* orr / pofa */
  var my = 73, hw = 6;
  if (F.pofa === "kicsi") { s += '<ellipse cx="50" cy="69" rx="10" ry="7.5" fill="' + F.l + '"/><ellipse cx="50" cy="65" rx="3.4" ry="2.6" fill="#5a3a2e"/>'; }
  if (F.pofa === "medve") { s += '<ellipse cx="50" cy="70" rx="13" ry="10" fill="' + F.l + '"' + fgKv(d, 1.5) + '/><ellipse cx="50" cy="65" rx="5" ry="3.6" fill="#4a3228"/>'; my = 74; }
  if (F.pofa === "eger") { s += fgTk('<path d="M40,68 L26,64 M40,70.5 L26,72" stroke="' + d + '" stroke-width="1.2" stroke-linecap="round"/>') + '<circle cx="50" cy="65" r="3.2" fill="#f28aa5"/>'; my = 71; }
  if (F.pofa === "orr") { s += '<circle cx="50" cy="66" r="3.4" fill="#4a3a3a"/>'; }
  if (F.pofa === "semmi") { s += '<circle cx="48" cy="66" r="1" fill="' + d + '"/><circle cx="52" cy="66" r="1" fill="' + d + '"/>'; my = 72; }
  if (F.pofa === "malac") { s += '<ellipse cx="50" cy="69" rx="10" ry="7" fill="#f597ad"' + fgKv(d, 1.5) + '/><ellipse cx="46.5" cy="69" rx="1.6" ry="2.6" fill="#b35c73"/><ellipse cx="53.5" cy="69" rx="1.6" ry="2.6" fill="#b35c73"/>'; my = 80; hw = 5; }
  if (F.pofa === "borz") { s += '<ellipse cx="50" cy="67" rx="4" ry="3" fill="#2f2a33"/>'; my = 74; }
  if (F.pofa === "nyul") { s += '<path d="M47.5,64 L52.5,64 L50,67 Z" fill="#f28aa5"/>'; my = 71; }
  if (F.pofa === "roka") { s += '<ellipse cx="50" cy="68" rx="3.6" ry="2.8" fill="#3a2a2a"/>'; my = 74; }
  if (F.pofa === "beka") { my = 69; hw = 12; }
  /* száj */
  if (F.pofa === "csor") {
    if (arc === "ujjong") s += '<ellipse cx="50" cy="71" rx="9" ry="6" fill="#b8475f"/><ellipse cx="50" cy="66.5" rx="13" ry="4.8" fill="#f5a54a"' + fgKv("#c46f1f", 1.5) + '/><ellipse cx="50" cy="76" rx="10" ry="3.8" fill="#f5a54a"' + fgKv("#c46f1f", 1.5) + '/>';
    else s += '<ellipse cx="50" cy="69" rx="13" ry="5.5" fill="#f5a54a"' + fgKv("#c46f1f", 1.5) + '/><path d="M38.5,69 Q50,' + (arc === "gondol" ? 69 : 72.5) + ' 61.5,69" fill="none" stroke="#c46f1f" stroke-width="1.4"/>';
  } else if (arc === "ujjong") {
    s += '<path d="M' + (50 - hw - 1) + ',' + (my - .5) + ' Q50,' + (my + 11) + ' ' + (50 + hw + 1) + ',' + (my - .5) + ' Z" fill="#b8475f"' + fgKv(FG_INK, 1.6) + '/><ellipse cx="50" cy="' + (my + 5) + '" rx="3.2" ry="2" fill="#f59bb0"/>';
  } else if (arc === "gondol") {
    s += '<path d="M' + (50 - hw * .6) + ',' + (my + 1) + ' Q' + (50 + hw * .2) + ',' + (my + 3.2) + ' ' + (50 + hw * .9) + ',' + (my - .8) + '" fill="none" stroke="' + FG_INK + '" stroke-width="2.2" stroke-linecap="round"/>';
  } else {
    s += '<path d="M' + (50 - hw) + ',' + my + ' Q50,' + (my + 5.5) + ' ' + (50 + hw) + ',' + my + '" fill="none" stroke="' + FG_INK + '" stroke-width="2.2" stroke-linecap="round"/>';
  }
  if (F.pofa === "nyul" && arc !== "ujjong") s += '<rect x="47.6" y="' + (my + 2) + '" width="4.8" height="4" rx="1" fill="#fff"' + fgKv(d, 1) + '/>';
  /* fejen hordott kellékek */
  if (F.fej === "alma") s += '<path d="M69,20 L70,15" stroke="#6e472c" stroke-width="1.6"/><circle cx="69" cy="26" r="7" fill="#e8505b"' + fgKv("#a82f3a", 1.5) + '/><path d="M70,18 Q75,13 79,16 Q75,20 70,18 Z" fill="#6fbf5a"/><circle cx="66.5" cy="23.5" r="1.8" fill="#fff" opacity=".6"/>';
  if (F.fej === "masni") s += '<g transform="translate(66,35) rotate(15)"><path d="M0,0 L-11,-7 L-11,7 Z M0,0 L11,-7 L11,7 Z" fill="#ec6b80"' + fgKv("#b53f57", 1.5) + '/><circle r="3" fill="#ec6b80"' + fgKv("#b53f57", 1.5) + '/><circle cx="-7" cy="-1" r="1.3" fill="#fff"/><circle cx="7" cy="1" r="1.3" fill="#fff"/><circle cx="-8" cy="4" r="1" fill="#fff"/><circle cx="8" cy="-4" r="1" fill="#fff"/></g>';
  if (F.fej === "kendo") s += '<ellipse cx="81" cy="60" rx="4" ry="3" fill="#c9aee6"' + fgKv("#7a5ca8", 1.5) + '/><path d="M82,62 L85,70 L80,68 Z" fill="#c9aee6"' + fgKv("#7a5ca8", 1.3) + '/>';
  return s;
}

function fgTartott(t, x, y) {
  var g = '<g transform="translate(' + x + ',' + y + ')">';
  if (t === "makk") g += '<ellipse cy="3" rx="5.5" ry="6.5" fill="#c98a4b"' + fgKv("#7a4f28", 1.5) + '/><path d="M-7,-1 Q0,-8 7,-1 Q0,2 -7,-1 Z" fill="#8a5a33"' + fgKv("#5e3b1e", 1.2) + '/><path d="M0,-5 L1,-9" stroke="#5e3b1e" stroke-width="1.6"/>';
  if (t === "mez") g += '<path d="M-7,-6 H7 Q11,-2 10,5 Q9,11 0,11 Q-9,11 -10,5 Q-11,-2 -7,-6 Z" fill="#f5b942"' + fgKv("#a8741c", 1.5) + '/><rect x="-8.5" y="-10" width="17" height="4.5" rx="2" fill="#e0a13a"' + fgKv("#a8741c", 1.2) + '/><ellipse cx="0" cy="3" rx="5.5" ry="3.8" fill="#fff6d8"/><path d="M4,-5.5 Q5,-1 3.5,1" stroke="#e0a13a" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
  if (t === "sajt") g += '<path d="M-9,5 L9,5 L9,-5 L-9,1 Z" fill="#fcd66a"' + fgKv("#c9a032", 1.5) + '/><path d="M-9,1 L9,-5 L4,-7 Z" fill="#fde79a"' + fgKv("#c9a032", 1.2) + '/><circle cx="-3" cy="2.5" r="1.4" fill="#e3b93e"/><circle cx="4" cy="0" r="1.8" fill="#e3b93e"/>';
  if (t === "lapat") g += '<path d="M-3,-15 L1,4" stroke="#9a6a3c" stroke-width="3" stroke-linecap="round"/><path d="M-3,3 L6,1 L8,11 Q3,16 -2,12 Z" fill="#b8c2cc"' + fgKv("#6b7580", 1.4) + '/>';
  if (t === "virag") g += '<path d="M0,2 Q2,10 -1,16" stroke="#5aa04c" stroke-width="2" fill="none"/><g transform="translate(0,-3)"><circle cx="0" cy="-5" r="3.6" fill="#fff"' + fgKv("#e0c24a", 1) + '/><circle cx="5" cy="-1" r="3.6" fill="#fff"' + fgKv("#e0c24a", 1) + '/><circle cx="3" cy="5" r="3.6" fill="#fff"' + fgKv("#e0c24a", 1) + '/><circle cx="-3" cy="5" r="3.6" fill="#fff"' + fgKv("#e0c24a", 1) + '/><circle cx="-5" cy="-1" r="3.6" fill="#fff"' + fgKv("#e0c24a", 1) + '/><circle r="3.2" fill="#fcd24a"/></g>';
  if (t === "repa") g += '<g transform="rotate(-20)"><path d="M-4,-4 L4,-4 L0,14 Z" fill="#f59a3c"' + fgKv("#c46f1f", 1.4) + '/><path d="M0,-4 Q-5,-12 -2,-14 M0,-4 Q0,-13 3,-14 M0,-4 Q5,-10 7,-9" stroke="#5aa04c" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  return g + '</g>';
}

function fgKar(p, F, veg) {
  return '<path d="' + p + '" fill="none" stroke="' + F.d + '" stroke-width="10" stroke-linecap="round"/><path d="' + p + '" fill="none" stroke="' + F.b + '" stroke-width="6.5" stroke-linecap="round"/><circle cx="' + veg[0] + '" cy="' + veg[1] + '" r="4.6" fill="' + F.b + '"' + fgKv(F.d, 1.5) + '/>';
}

function fgAlak(F, arc) {
  var s = "", d = F.d, ruha = F.ruha || F.b;
  /* farok / páncél / hát-tüskék */
  if (F.farok === "mokus") s += '<path d="M76,132 C104,138 122,112 116,86 C112,66 96,58 86,66 C80,72 84,80 92,80 C100,84 100,100 90,108 C84,114 78,116 76,120 Z" fill="' + F.b + '"' + fgKv(d) + '/><path d="M104,76 C112,88 110,104 100,114" fill="none" stroke="' + F.l + '" stroke-width="5" stroke-linecap="round" opacity=".8"/>';
  if (F.farok === "roka") s += '<path d="M80,130 C110,132 114,104 104,94 C100,112 90,118 80,118 Z" fill="' + F.b + '"' + fgKv(d) + '/><path d="M104,94 C110,100 111,108 108,114 C104,110 101,104 104,94 Z" fill="#fff"' + fgKv(d, 1.5) + '/>';
  if (F.farok === "eger") s += '<path d="M82,132 Q110,136 106,114 Q103,100 111,94" fill="none" stroke="#f2a3b8" stroke-width="3" stroke-linecap="round"/>';
  if (F.farok === "malac") s += '<path d="M84,124 Q95,123 93,115 Q91,109 86,112 Q83,116 89,118" fill="none" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>';
  if (F.farok === "sun") s += fgTuskek(60, 113, 24, 34, 150, 390, 10, F.tu, d);
  if (F.farok === "pancel") s += '<ellipse cx="60" cy="111" rx="33" ry="30" fill="#a9864f"' + fgKv("#6d5530") + '/><ellipse cx="29" cy="104" rx="3.5" ry="6" fill="#c9a46a"/><ellipse cx="91" cy="104" rx="3.5" ry="6" fill="#c9a46a"/><ellipse cx="31" cy="124" rx="3.5" ry="6" fill="#c9a46a"/><ellipse cx="89" cy="124" rx="3.5" ry="6" fill="#c9a46a"/>';
  /* lábak */
  s += '<ellipse cx="48" cy="141" rx="10" ry="5.5" fill="' + F.b + '"' + fgKv(d) + '/><ellipse cx="72" cy="141" rx="10" ry="5.5" fill="' + F.b + '"' + fgKv(d) + '/>';
  /* test */
  s += '<ellipse cx="60" cy="113" rx="25" ry="28" fill="' + ruha + '"' + fgKv(d) + '/>';
  if (F.farok === "pancel") s += '<ellipse cx="60" cy="116" rx="17" ry="21" fill="#f3e6ad"' + fgKv("#c9b26a", 1.5) + '/><path d="M45,108 H75 M44,120 H76 M60,96 V137" stroke="#c9b26a" stroke-width="1.3"/>';
  else if (F.test === "katica") s += '<path d="M60,88 V141" stroke="' + FG_INK + '" stroke-width="1.8"/><circle cx="47" cy="104" r="4" fill="' + FG_INK + '"/><circle cx="73" cy="104" r="4" fill="' + FG_INK + '"/><circle cx="45" cy="122" r="3.5" fill="' + FG_INK + '"/><circle cx="75" cy="122" r="3.5" fill="' + FG_INK + '"/><circle cx="53" cy="134" r="3" fill="' + FG_INK + '"/><circle cx="67" cy="134" r="3" fill="' + FG_INK + '"/>';
  else if (F.test === "potty") s += [[46, 100], [74, 102], [40, 118], [80, 120], [52, 124], [68, 114], [58, 104], [48, 136], [72, 134], [60, 132]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#fff" opacity=".9"/>'; }).join("");
  else if (F.test === "koteny") s += '<path d="M44,97 L76,97 L79,136 Q60,141 41,136 Z" fill="#fff"' + fgKv("#e38aa6") + '/><rect x="52" y="115" width="16" height="10" rx="3" fill="none" stroke="#e38aa6" stroke-width="1.6"/><path d="M44,98 Q38,94 36,98 M76,98 Q82,94 84,98" stroke="#e38aa6" stroke-width="1.6" fill="none"/>';
  else s += '<ellipse cx="60" cy="118" rx="16" ry="18" fill="' + F.l + '"/>';
  /* karok + tartott tárgy */
  if (arc === "ujjong") {
    s += fgKar("M41,97 Q28,86 27,72", F, [27, 72]) + fgKar("M79,97 Q92,86 93,72", F, [93, 72]);
    if (F.tart) s += fgTartott(F.tart, 95, 64);
  } else if (arc === "gondol") {
    s += fgKar("M40,100 Q30,112 32,122", F, [32, 122]);
    if (F.tart) s += fgTartott(F.tart, 29, 126);
  } else {
    s += fgKar("M40,100 Q31,112 33,124", F, [33, 124]) + fgKar("M80,100 Q90,110 88,121", F, [88, 121]);
    if (F.tart) s += fgTartott(F.tart, 91, 125);
  }
  /* fej */
  s += '<g transform="translate(10,0)">' + fgFej(F, arc) + '</g>';
  /* gondolkodó kéz az állon — a fej ELŐTT */
  if (arc === "gondol") s += fgKar("M80,100 Q90,92 72,85", F, [72, 85]);
  /* nyakon hordott kellék */
  if (F.test === "csokor") s += '<path d="M60,89 L49,83 L49,95 Z M60,89 L71,83 L71,95 Z" fill="#e8505b"' + fgKv("#a82f3a", 1.5) + '/><circle cx="60" cy="89" r="3.2" fill="#e8505b"' + fgKv("#a82f3a", 1.5) + '/>';
  if (F.test === "kendo") s += '<path d="M45,85 Q60,91 75,85 L60,103 Z" fill="#7fb2e8"' + fgKv("#3f74b0", 1.6) + '/>';
  if (F.test === "sal") s += '<path d="M66,92 L69,113 L76,111 L73,91 Z" fill="#8fd18a"' + fgKv("#4f8f42", 1.5) + '/><path d="M42,85 Q60,94 78,85 L78,92 Q60,101 42,92 Z" fill="#8fd18a"' + fgKv("#4f8f42", 1.5) + '/>';
  return '<g class="fg-test' + (arc === "ujjong" ? " fg-ujj" : "") + '" style="animation-delay:' + (F.kes || 0) / 2 + 's">' + s + '</g>';
}

/* forma: "fej" (érem, kártya) vagy "alak" (egész alak — Tüske néni a vásárban) · alapArc: ahová az ujjongás után visszaáll */
function figuraSVG(k, arc, forma, alapArc) {
  var F = FIG_RAJZ[k]; if (!F) return (FIGURA[k] && FIGURA[k].emo) || "";
  arc = arc || "vidam"; forma = forma || "fej";
  var fe = forma === "fej", nev = FIGURA[k] ? FIGURA[k].tel : k;
  return '<svg class="fg fg-' + forma + (fe && arc === "ujjong" ? " fg-ugr" : "") + '" data-fig="' + k + '" data-forma="' + forma + '" data-arc="' + arc + '" data-alap="' + (alapArc || arc) + '"' +
    ' viewBox="' + (fe ? "6 2 88 88" : "0 0 120 150") + '" role="img" aria-label="' + nev + '">' + (fe ? fgFej(F, arc) : fgAlak(F, arc)) + '</svg>';
}
/* egy HTML-darabban (pl. az érem képe) minden szereplő-rajzot a megadott arcra vált — a „?”-es érem így „gondolkodik” */
function figArcCsere(html, arc) {
  if (!html || html.indexOf("data-fig=") < 0) return html;
  return html.replace(/<svg class="fg[^"]*" data-fig="(\w+)" data-forma="(\w+)"[^>]*>[\s\S]*?<\/svg>/g, function (m, k, forma) { return figuraSVG(k, arc, forma); });
}
/* a képernyőn lévő szereplők arca: jó válasz → ujjong (egyet ugrik), aztán vissza az alap-arcra; rossz → gondolkodik */
function figArc(arc) {
  var scr = document.getElementById("kepernyo-jatek") || document;
  Array.prototype.forEach.call(scr.querySelectorAll("svg[data-fig]"), function (el) {
    var alap = el.getAttribute("data-alap") || "vidam", cel = arc === "alap" ? alap : arc;
    if (el.getAttribute("data-arc") !== cel) el.outerHTML = figuraSVG(el.getAttribute("data-fig"), cel, el.getAttribute("data-forma"), alap);
  });
  clearTimeout(figArc._t);
  if (arc === "ujjong") figArc._t = setTimeout(function () { figArc("alap"); }, 1600);
}

/* a közös tábla képe: emoji → rajz (az emoji tartaléknak megmarad) */
Object.keys(FIGURA).forEach(function (k) {
  if (!FIG_RAJZ[k]) return;
  FIGURA[k].emo = FIGURA[k].e;
  FIGURA[k].e = figuraSVG(k, "vidam", "fej");
});

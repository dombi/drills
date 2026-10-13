/* 🤖 Gépi próba — ② Méret-őr mérője (a böngészőben; a meret.py hívja minden képernyőn, minden méreten).
   Az aktív képernyő (vagy a rajta nyitott lap) FONTOS elemeit nézi:
     kilog    — kilóg a képernyőből, és görgetéssel sem érhető el;
     levagva  — egy szülője (overflow: hidden) levágja egy darabját;
     takarja  — a közepére koppintva nem ő kapja a koppintást, hanem valami más;
     gorget   — az egész oldal oldalra görgethető.
   kivetel: CSS-szelektorok (kepernyok.py MERET_KIVETEL) — ami ezekre illik, azt szándékosan nem nézzük
            (se mint fontos elemet, se mint takarót: pl. a kalandtérkép felhői szándékosan takarják a helyeket).
   Vissza: [{f, e, d}] — fajta, elem leírása, részlet. */
function meretVizsgal(kivetel) {
  var KIV = (kivetel || []).join(", ");
  function kivett(e) { try { return !!(KIV && e && e.closest && e.closest(KIV)); } catch (x) { return false; } }
  var W = innerWidth, H = innerHeight, ki = [];
  var FONTOS = "button, input:not([type=hidden]), select, textarea, .terkep-hely, #buborek-feladat, #beiro-doboz, #valasz-kartyak, .profil-kartya, .palya-kartya, [role=button]";
  var FEDO = '[id$="-fedo"], #odu-lap, #odu-panel, #het-fuzet, .bank-ablak, #kert-feszer';
  var de = document.documentElement;
  if (de.scrollWidth > W + 2) ki.push({ f: "gorget", e: "az egész oldal", d: de.scrollWidth + " px széles (képernyő: " + W + " px)" });
  var akt = document.querySelector(".kepernyo.aktiv"); if (!akt) return ki;

  function stilus(e) { return getComputedStyle(e); }
  function lathato(e) {
    if (!e.getClientRects().length) return false;
    var r = e.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return false;
    var s = stilus(e); if (s.visibility === "hidden" || s.display === "none") return false;
    for (var a = e, op = 1; a && a.nodeType === 1; a = a.parentElement) { op *= +stilus(a).opacity; if (op < 0.05) return false; }
    return true;
  }
  function leir(e) {
    var t = (e.getAttribute("aria-label") || e.textContent || e.value || "").replace(/\s+/g, " ").trim().slice(0, 28);
    var c = e.getAttribute("class"); c = c && typeof c === "string" ? "." + c.trim().split(/\s+/)[0] : "";
    return (e.id ? "#" + e.id : e.tagName.toLowerCase() + c) + (t ? " „" + t + "”" : "");
  }
  function gorgetheto(e, irany) {   /* irany: "y" | "x" */
    var s = stilus(e), ov = irany === "y" ? s.overflowY : s.overflowX;
    var tobb = irany === "y" ? e.scrollHeight > e.clientHeight + 1 : e.scrollWidth > e.clientWidth + 1;
    return tobb && (ov === "auto" || ov === "scroll");
  }
  function elerheto(e, irany) {   /* van-e görgethető szülő (vagy maga az oldal) ebben az irányban */
    for (var a = e.parentElement; a && a !== document.body && a !== de; a = a.parentElement) if (gorgetheto(a, irany)) return true;
    var bs = stilus(document.body), hs = stilus(de);
    if (irany === "y") return de.scrollHeight > H + 2 && bs.overflowY !== "hidden" && hs.overflowY !== "hidden";
    return false;   /* oldalra görgetni úgysem kéne */
  }

  var fedok = [].filter.call(document.querySelectorAll(FEDO), lathato);
  var gyokerek = fedok.length ? fedok : [akt];   /* ha egy lap nyitva van, csak azt nézzük: ami alatta van, szándékosan takart */
  var elemek = [];
  gyokerek.forEach(function (g) { [].forEach.call(g.querySelectorAll(FONTOS), function (e) { if (elemek.indexOf(e) < 0 && !kivett(e) && lathato(e)) elemek.push(e); }); });

  elemek.forEach(function (e) {
    var r = e.getBoundingClientRect(), nev = leir(e), kint = [];
    if (r.left < -2) kint.push("balra " + Math.round(-r.left) + " px");
    if (r.right > W + 2) kint.push("jobbra " + Math.round(r.right - W) + " px");
    if ((r.top < -2 || r.bottom > H + 2) && !elerheto(e, "y"))
      kint.push(r.top < -2 ? "felül " + Math.round(-r.top) + " px" : "alul " + Math.round(r.bottom - H) + " px");
    if (kint.length) { ki.push({ f: "kilog", e: nev, d: kint.join(", ") }); return; }
    /* levágja egy szülő (overflow: hidden / clip), és nem görgethető. Ha egy szülő görgethető abban az irányban,
       az elem görgetéssel elérhető: a feljebb lévő szülőknél abban az irányban már nem nézzük. */
    var gx = false, gy = false;
    for (var a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      var s = stilus(a);
      if (s.overflowX === "visible" && s.overflowY === "visible") continue;
      var ar = a.getBoundingClientRect(), lev = [];
      if (!gx && (r.left < ar.left - 4 || r.right > ar.right + 4) && !gorgetheto(a, "x")) lev.push("oldalt");
      if (!gy && (r.top < ar.top - 4 || r.bottom > ar.bottom + 4) && !gorgetheto(a, "y") && !elerheto(a, "y")) lev.push("alul/felül");
      if (lev.length) { ki.push({ f: "levagva", e: nev, d: lev.join(", ") + " levágja: " + leir(a) }); return; }
      gx = gx || gorgetheto(a, "x"); gy = gy || gorgetheto(a, "y");
    }
    /* takarás: a közepére (a feladatkártyánál 5 pontra) koppintva ki kapja? */
    var pontok = [[r.left + r.width / 2, r.top + r.height / 2]];
    if (e.id === "buborek-feladat") pontok.push([r.left + 6, r.top + 6], [r.right - 6, r.top + 6], [r.left + 6, r.bottom - 6], [r.right - 6, r.bottom - 6]);
    for (var i = 0; i < pontok.length; i++) {
      var p = pontok[i]; if (p[0] < 0 || p[1] < 0 || p[0] >= W || p[1] >= H) continue;
      var h = document.elementFromPoint(p[0], p[1]);
      if (!h || e.contains(h) || h.contains(e) || kivett(h)) continue;
      if (e.tagName === "LABEL" || (e.labels && [].some.call(e.labels, function (lb) { return lb.contains(h); }))) continue;
      ki.push({ f: "takarja", e: nev, d: "rajta van: " + leir(h) }); return;
    }
  });
  return ki;
}

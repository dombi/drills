#!/usr/bin/env python3
"""izuletek-build.py — PRÓBALAP az ízületekhez (unikornis pózok, 2. lépés).

Mit csinál: a VALÓDI rajzkódot (src/renderer.js) egy önálló lapra teszi, és mellé egy PRÓBA-csontvázat
(térd/csánk, pata, a lábdísz a lábon), majd minden pózt kirajzol „ma” és „új” párban, mindhárom lényen,
díszekben. Fölötte a rajzterv szövege (terv/izuletek-rajzterv.html <main> része).
A próba-csontváz még NEM a játék kódja — jóváhagyás után kerül a renderer.js-be.

Használat:  python terv/izuletek-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-izuletek.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-izuletek.html (a matekos-teszt szerver)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-izuletek.html"
rd = lambda f: open(os.path.join(SRC, f), encoding="utf-8").read()

PAD = r"""<style>
body{ margin:0; background:#fffaf3; color:#3b2f55; font-family:Fredoka,"Segoe UI",sans-serif; }
#iz{ padding:18px 16px 60px; max-width:1180px; margin:0 auto; }
#iz h2{ margin:28px 0 8px; font-size:20px; color:#6a3fb8; border-bottom:2px solid #eadcf7; padding-bottom:4px; }
#iz .iz-sor{ display:flex; flex-wrap:wrap; gap:12px; }
#iz figure{ margin:0; background:#fff; border:2px solid #eadcf7; border-radius:14px; overflow:hidden; }
#iz figure.uj{ border-color:#9fd89a; } #iz figure.ma{ border-color:#f3c3cc; }
#iz .iz-par{ display:flex; background:linear-gradient(#eaf6ff,#e3f3d6 72%,#cfe8b8); }
#iz .iz-par > div{ position:relative; }
#iz .iz-par svg{ width:210px; height:170px; display:block; }
#iz .iz-par .cim{ position:absolute; left:8px; top:6px; font-size:12px; font-weight:800; border-radius:999px; padding:1px 8px; }
#iz .cim.ma{ background:#ffe1e6; color:#b0263e; } #iz .cim.uj{ background:#e2f6dc; color:#2f7a2e; }
#iz figcaption{ padding:6px 10px 8px; font-size:13.5px; max-width:400px; } #iz figcaption b{ display:block; font-size:15px; }
#iz .iz-lenyek button{ font:inherit; font-weight:700; border:2px solid #c9a8e6; background:#fff; color:#6a3fb8; border-radius:999px; padding:4px 14px; margin:6px 6px 0 0; cursor:pointer; }
#iz .iz-lenyek button.aktiv{ background:#8a4fd0; color:#fff; border-color:#8a4fd0; }
#iz .iz-nagy svg{ width:420px; height:330px; display:block; }
</style>
<script>
/* ════ PRÓBA-CSONTVÁZ (2. lépés terve) ════════════════════════════════════════════
   Láb = 2 rész + pata. A felső rész (comb / alkar) a csípőn/vállon fordul, az alsó rész
   (lábszár + csüd + pata + LÁBDÍSZ) a térden/csánkon. A dísz az alsó részben van → vele mozog.
   Ízület-pont: a láb közepe az IZ_Y magasságban; a hajlásnál egy láb-színű „ízület-gömb” tölti ki a rést. */
var IZ_Y = [248, 252, 252, 248];          /* hátsó: csánk (0,1) · elülső: térd (2,3) — a 380×300-as keretben */
function izPont(i) { var L = UNI_LABAK[i], k = labSzel(L, IZ_Y[i]); return [(k[0] + k[1]) / 2, IZ_Y[i], (k[1] - k[0]) / 2, k]; }
function csipo(i) { var L = UNI_LABAK[i]; return [(L[0][0] + L[1][0]) / 2, L[0][1]]; }
function izLabSVG(i, sz, szog, labDisz) {
  var L = UNI_LABAK[i], yb = L[2][1], yt = yb - PATA_MAG, sz0 = labSzel(L, yt), fy = labSzel(L, yt + 3);
  var p = izPont(i), k = p[3], ky = p[1], c = csipo(i), a = szog || [0, 0];
  function P(x, y) { return uniK(x) + " " + uniK(y); }
  var felso = '<path d="M' + P(L[0][0], L[0][1]) + " L" + P(L[1][0], L[1][1]) + " L" + P(k[1], ky + 1) + " L" + P(k[0], ky + 1) + ' Z" fill="' + sz.lab + '" stroke="none"/>' +
              '<path d="M' + P(L[0][0], L[0][1]) + " L" + P(k[0], ky) + " M" + P(L[1][0], L[1][1]) + " L" + P(k[1], ky) + '" fill="none" stroke-width="4"/>';
  var also = '<path d="M' + P(k[0], ky) + " L" + P(k[1], ky) + " L" + P(L[2][0], L[2][1]) + " L" + P(L[3][0], L[3][1]) + ' Z" fill="' + sz.lab + '" stroke="none"/>' +
             '<path d="M' + P(k[0], ky) + " L" + P(L[3][0], L[3][1]) + " L" + P(L[2][0], L[2][1]) + " L" + P(k[1], ky) + '" fill="none" stroke-width="4"/>' +
             '<path class="uni-pata" d="' + pataD(sz0[0], sz0[1], yt, yb + 1) + '" fill="' + sz.pata + '" stroke-width="3.2"/>' +
             '<path d="M' + uniK(fy[1] - 4) + " " + uniK(yt + 4) + " L" + uniK(L[2][0] - 3) + " " + uniK(yb - 2) + '" fill="none" stroke="#fff" stroke-width="2.4" opacity=".55"/>' +
             (labDisz ? '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">' + labDiszSVG(labDisz, L) + '</g>' : "");
  return '<g class="uni-lab" transform="rotate(' + a[0] + ' ' + P(c[0], c[1]) + ')">' +
           '<circle cx="' + uniK(p[0]) + '" cy="' + ky + '" r="' + uniK(p[2] + 1) + '" fill="' + sz.lab + '" stroke-width="4"/>' +
           '<g transform="rotate(' + a[1] + ' ' + P(p[0], ky) + ')">' + also + '</g>' + felso +
         '</g>';
}
/* PÓZ = { lab: [[comb°, alsó°] ×4], test: "SVG transform a 380×300-as keretben" }   (+° = óramutató iránya) */
var POZOK = {
  all:    { lab: [[0, 0], [0, 0], [0, 0], [0, 0]], test: "" },
  lepes:  { lab: [[14, 0], [-12, 30], [-14, 0], [-22, 58]], test: "translate(0 -2)" },
  guggol: { lab: [[-14, 28], [-14, 28], [16, -28], [16, -28]], test: "translate(0 7)" },
  ul:     { lab: [[-50, 120], [-50, 120], [26, 0], [26, 0]], test: "rotate(-26 215 288) translate(0 6)" },   /* A: kutyás ülés */
  ulB:    { lab: [[-30, 120], [-30, 120], [18, 0], [18, 0]], test: "rotate(-18 215 288) translate(0 12)" },  /* B: félig ül */
  fekszik:{ lab: [[-70, 140], [-70, 140], [64, -150], [64, -150]], test: "translate(0 62)" },
  eszik:  { lab: [[0, 0], [0, 0], [10, -14], [10, -14]], test: "translate(0 2)" }
};
function izArt(rajz, poz, olt) {
  var sz = UNI_SZIN[rajz], pz = POZOK[poz] || POZOK.all, ld = olt && olt.lab;
  var ertek = { s0: sz.s[0], s1: sz.s[1], s2: sz.s[2], k0: sz.szikra[0], k1: sz.szikra[1], k2: sz.szikra[2], jel: UNI_JEL[rajz] };
  for (var i = 0; i < 4; i++) ertek["lab" + i] = izLabSVG(i, sz, pz.lab[i], ld);
  var art = UNI_SABLON.replace(/\{(\w+)\}/g, function (m, k) { return k in ertek ? ertek[k] : sz[k]; });
  return '<g transform="' + pz.test + '">' + art + diszek(olt, art, true) + '</g>';
}
function diszek(olt, art, labNelkul) {
  var r = "";
  if (olt) ["hat", "farok", "oldal", "lab", "nyak", "fej"].forEach(function (h) {
    if (!olt[h] || (labNelkul && h === "lab")) return;
    r += ruhaSVG(olt[h]);
    if (h === "hat") { var sor = art.match(/<g class="ucg uni-soreny">[\s\S]*?<\/g>/); if (sor) r += sor[0]; }
  });
  return r;
}
/* „MA” = a mai CSS viselkedése (style.css): séta = egész láb ±12°, ül = láb scaleY(.5) + lejjebb, fekszik = scaleY(.3) + 13°,
   guggol (ugrás előtt) = scaleY(.48), eszik = elülső láb scaleY(.82). A lábdísz a régi helyén marad (ruhaSVG). */
var MA = {
  all: [[1, 0], [1, 0], [1, 0], [1, 0], ""], lepes: [[1, 12], [1, -12], [1, 12], [1, -12], ""],
  guggol: [[.48, 0], [.48, 0], [.48, 0], [.48, 0], "translate(0 40)"], ulB: [[.5, 0], [.5, 0], [.5, 0], [.5, 0], "translate(0 39)"], ul: [[.5, 0], [.5, 0], [.5, 0], [.5, 0], "translate(0 39)"],
  fekszik: [[.3, 0], [.3, 0], [.3, 0], [.3, 0], "translate(0 55) rotate(13 91 207)"], eszik: [[1, 0], [1, 0], [.82, 0], [.82, 0], "translate(0 7) rotate(4 91 207)"]
};
function maArt(rajz, poz, olt) {
  var art = UNI_RAJZ[rajz], m = MA[poz], i = 0;
  art = art.replace(/<g class="uni-lab[^"]*">/g, function () {
    var L = UNI_LABAK[i], c = csipo(i), t = m[i++];
    return '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + t[1] + ') scale(1 ' + t[0] + ') translate(' + (-c[0]) + ' ' + (-c[1]) + ')">';
  });
  return '<g transform="' + m[4] + '">' + art + diszek(olt, art) + '</g>';
}
function keret(belso) { return '<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">' + belso + '</svg>'; }

(function () {
  var LENY = [["korall", "Tűz"], ["kek", "Ragyogás"], ["rozsa", "Csillámharmat"]], akt = "korall";
  var OLT1 = { lab: "lab-a", farok: "farok-a", hat: "hat-k", oldal: "oldal-k", nyak: "nyak-k", fej: "fej-k" };
  var OLT2 = { lab: "lab-r", farok: "farok-k", hat: "hat-r", oldal: "oldal-r", nyak: "nyak-r", fej: "fej-r" };
  var PZ = [["all", "Áll", "Nem változik: ugyanaz a rajz, csak most már ízületekkel."],
            ["lepes", "Lépés (egy pillanat)", "Ma az egész láb egy darabban leng. Új: az emelt láb térdben behajlik, a pata hátrafelé fordul."],
            ["guggol", "Guggolás (ugrás előtt)", "Ma a láb összenyomódik, a lábdísz lebeg. Új: térd és csánk behajlik."],
            ["ul", "Ül — A változat (javasolt)", "Ma a láb fele akkorára zsugorodik, a lábdísz a levegőben marad. Új A: „kutyás ülés” — a far leül, a hátsó lábak összecsukódnak, az elülső lábak egyenesek, a fej felemelkedik."],
            ["ulB", "Ül — B változat", "Új B: „félig ül” — kevésbé dől hátra, a far csak leereszkedik. Visszafogottabb, de kevésbé olvasható ülésnek."],
            ["fekszik", "Fekszik", "Ma a láb összenyomódik és a figura megdől. Új: mind a négy láb a test alá hajlik (a szép alvó póz a 8. lépés)."],
            ["eszik", "Eszik / szagol", "Ma az elülső láb rövidül. Új: az elülső térd kicsit rogy."]];
  function kartya(poz, cim, szoveg, olt) {
    return '<figure><div class="iz-par"><div><span class="cim ma">ma</span>' + keret(maArt(akt, poz, olt)) + '</div>' +
           '<div><span class="cim uj">új</span>' + keret(izArt(akt, poz, olt)) + '</div></div>' +
           '<figcaption><b>' + cim + '</b>' + szoveg + '</figcaption></figure>';
  }
  function csontvaz() {
    var s = "";
    for (var i = 0; i < 4; i++) { var c = csipo(i), p = izPont(i), L = UNI_LABAK[i];
      s += '<path d="M' + c.join(" ") + ' L' + p[0] + ' ' + p[1] + ' L' + ((L[2][0] + L[3][0]) / 2) + ' ' + (L[2][1] - PATA_MAG) + '" stroke="#6a3fb8" stroke-width="3" fill="none" stroke-dasharray="6 4"/>';
      [c, [p[0], p[1]], [(L[2][0] + L[3][0]) / 2, L[2][1] - PATA_MAG]].forEach(function (q, j) {
        s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (j === 2 ? 4 : 6) + '" fill="' + ["#ffd24d", "#ff6fae", "#8ad0ff"][j] + '" stroke="#6a3fb8" stroke-width="2"/>'; }); }
    /* 2b: fej (nyak-tő), farok-tő, szárny-váll */
    [[236, 146, "fej"], [94, 152, "farok"], [176, 118, "szárny"]].forEach(function (q) {
      s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="7" fill="#b9f0b0" stroke="#2f7a2e" stroke-width="2"/>'; });
    return keret(izArt(akt, "all", null) + '<g opacity=".95">' + s + '</g>');
  }
  var animIdo = null;
  function animal() {
    var hely = document.getElementById("iz-anim"); if (!hely) return;
    var sor = ["all", "ul", "ul", "all", "guggol", "all", "fekszik", "fekszik", "all", "lepes", "all"], i = 0;
    clearInterval(animIdo);
    function lep() { hely.innerHTML = keret(izArt(akt, sor[i % sor.length], OLT1)).replace("<svg ", '<svg style="width:420px;height:330px" '); i++; }
    lep(); animIdo = setInterval(lep, 900);
  }
  function rajzol() {
    var h = '<div class="iz-lap">' + (window.__IZ_LAP || "") + '</div>';
    h += '<h2>Próbalap — a valódi rajzkódból</h2><div class="iz-lenyek">' + LENY.map(function (l) {
      return '<button data-l="' + l[0] + '"' + (l[0] === akt ? ' class="aktiv"' : '') + '>' + l[1] + '</button>'; }).join("") + '</div>';
    h += '<h2>Az ízület-térkép</h2><div class="iz-sor"><figure class="iz-nagy">' + csontvaz() + '<figcaption><b>Az ízületek</b>Sárga = csípő és váll · rózsaszín = térd (elöl) és csánk (hátul) · kék = a pata fölött (csüd, itt a bokapánt) · zöld = 2b: fej, farok-tő, szárny-váll.</figcaption></figure>' +
         '<figure class="iz-nagy"><div id="iz-anim"></div><figcaption><b>Pózváltás díszben</b>áll → ül → guggol → fekszik → lép. Figyeld a bokapántot: mindig a lábon marad.</figcaption></figure></div>';
    h += '<h2>Ma és új — Fűzöld bokapánt + szalagcsokor + szív-medál + csillag-szarvdísz</h2><div class="iz-sor">' + PZ.map(function (p) { return kartya(p[0], p[1], p[2], OLT1); }).join("") + '</div>';
    h += '<h2>Ma és új — Kristály-patkó + csengettyű + szivárvány-sál + hold-korona</h2><div class="iz-sor">' + PZ.map(function (p) { return kartya(p[0], p[1], "", OLT2); }).join("") + '</div>';
    h += '<h2>Dísz nélkül</h2><div class="iz-sor">' + PZ.map(function (p) { return kartya(p[0], p[1], "", null); }).join("") + '</div>';
    document.getElementById("iz").innerHTML = h;
    document.querySelectorAll(".iz-lenyek button").forEach(function (b) { b.onclick = function () { akt = b.getAttribute("data-l"); rajzol(); }; });
    animal();
  }
  window.addEventListener("load", rajzol);
})();
</script>"""

lap, css = "", ""
p = os.path.join(HERE, "izuletek-rajzterv.html")
if os.path.exists(p):
    t = open(p, encoding="utf-8").read()
    m = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
    st = re.search(r"<style>([\s\S]*?)</style>", t)
    if st:
        css = "<style>" + re.sub(r"(^|\})\s*([^{}@]+)\{", lambda x: x.group(1) + "\n" + ",".join("#iz .iz-lap " + s.strip() for s in x.group(2).split(",")) + "{", st.group(1)) + "</style>"
    lap = css + (m.group(1) if m else "")
h = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     '<title>Ízületek próbalap</title><script>' + rd("src/renderer.js").replace("</script>", "<\\/script>") + '</script>'
     "<script>window.__IZ_LAP=" + json.dumps(lap).replace("</", "<\\/") + ";</script>" + PAD + '</head><body><div id="iz"></div></body></html>')
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

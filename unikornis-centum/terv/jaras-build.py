#!/usr/bin/env python3
"""jaras-build.py — MOZGÓ ELŐNÉZET a járáshoz (unikornis pózok, 3. lépés: élethű mozgás).

Mit csinál: a VALÓDI unikornis-rajz (a munkapéldány src/renderer.js-e) járni kezd egy futószalagon.
Soronként: „ma” (a 3. lépés előtti kerti lábmozgás és tempó), „séta”, „ügetés” (a közös járás-tábla,
UNI_JARAS a renderer.js-ben). A talaj a valódi haladási tempóval fut alattuk, így látszik,
csúszik-e a pata. Lassítás gomb, lábsorrend-ábra. Fölötte a mozgásterv szövege
(terv/jaras-rajzterv.html <main> része, ha már megvan).

Használat:  python terv/jaras-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-jaras.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-jaras.html (a matekos-teszt szerver)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-jaras.html"
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js"))

LENYEK = [["korall", None, "Tűz, dísz nélkül"],
          ["kek", {"lab": "lab-a", "farok": "farok-a", "hat": "hat-k", "oldal": "oldal-k", "nyak": "nyak-k", "fej": "fej-k"}, "Ragyogás, teljes díszben"],
          ["rozsa", {"lab": "lab-r", "farok": "farok-k", "hat": "hat-r", "oldal": "oldal-r", "nyak": "nyak-r", "fej": "fej-r"}, "Csillámharmat, teljes díszben"]]

LAP = r"""
<section id="jp">
  <div class="gombok">Tempó:
    <button data-r="1" class="be">valódi</button><button data-r="0.5">fél</button><button data-r="0.2">lassított (⅕)</button>
    <button data-r="0">megállít</button>
  </div>
  <div id="sorok"></div>
  <h3>Kockánként — egy lépésciklus 8 megállított pillanata</h3>
  <p class="kis">Balról jobbra telik az idő. Figyeld a hajló térdet (elöl) és csánkot (hátul), és hogy a földön lévő pata mindig a vonalon marad.</p>
  <div id="film"></div>
  <h3>Lábsorrend — mikor van a pata a földön</h3>
  <p class="kis">Egy sáv = egy láb, egy teljes lépésciklus. Teli = a földön, üres = a levegőben (lendül előre).</p>
  <div id="sorrend"></div>
</section>
<script>
(function () {
  var LENYEK = __LENYEK__;
  var PX = 190 / 200 * 0.5;   /* a kertben: 190 px széles doboz, 200-as viewBox, a rajz fél méretben → px / rajz-egység */
  var MA_PX = 1366 * 0.222;   /* ma a kertben: a szélesség 22,2%-a / mp, egy 1366 px széles laptopon */
  var SOROK = [
    { cls: "ma", nev: "Ma", v: MA_PX, szoveg: "Mindhárom helyszínen ez fut: a lábak egy darabban lengenek, két-két láb egyszerre, a test fel-le ugrál. A talaj a mostani kerti tempóval fut: a paták csúsznak." },
    { cls: "uni-jar-seta", nev: "Új: séta", v: uniJarasSebesseg("seta") * PX, szoveg: "Négy ütem: hátsó – elülső – másik hátsó – másik elülső. A térd és a csánk behajlik, a test enyhén billen, a fej minden elülső lépésre bólint." },
    { cls: "uni-jar-uget", nev: "Új: ügetés", v: uniJarasSebesseg("uget") * PX, szoveg: "Két ütem: az átlós lábpárok együtt lépnek, nagyobb lendülettel és magasabbra emelt lábbal; a farok kicsit felemelkedik." }
  ];
  var h = "";
  SOROK.forEach(function (s, i) {
    h += '<div class="sor"><div class="cim"><b>' + s.nev + '</b><span>' + Math.round(s.v) + ' px/mp</span><p>' + s.szoveg + '</p></div>' +
         '<div class="szalag ' + s.cls + '"><div class="fold" style="animation-duration:' + (240 / s.v).toFixed(3) + 's"></div>';
    LENYEK.forEach(function (l, j) {
      h += '<div class="uni' + (s.cls === "ma" ? " ma-bob" : "") + '"><svg viewBox="-100 -150 200 176">' + unikornisSVG("u" + i + "-" + j, { rajz: l[0] }, 1, l[1], null) + '</svg></div>';
    });
    h += '</div></div>';
  });
  document.getElementById("sorok").innerHTML = h;
  /* lábsorrend-ábra a táblából */
  var NEV = ["hátsó 1", "hátsó 2", "elülső 1", "elülső 2"], s2 = "";
  Object.keys(UNI_JARAS).forEach(function (k) {
    var md = UNI_JARAS[k];
    s2 += '<div class="lr"><b>' + (k === "seta" ? "Séta" : "Ügetés") + '</b><svg viewBox="0 0 420 104">';
    [0, 2, 1, 3].forEach(function (i, r) {
      var y = r * 26, a = md.fazis[i], b = a + md.talaj;
      s2 += '<text x="0" y="' + (y + 16) + '" font-size="13" fill="#3b2f55">' + NEV[i] + '</text><rect x="70" y="' + (y + 4) + '" width="340" height="16" rx="8" fill="#fff" stroke="#c9b6ea"/>';
      [[a, Math.min(b, 1)], b > 1 ? [0, b - 1] : null].forEach(function (sz) {
        if (sz) s2 += '<rect x="' + (70 + sz[0] * 340) + '" y="' + (y + 4) + '" width="' + ((sz[1] - sz[0]) * 340) + '" height="16" rx="8" fill="' + (i < 2 ? "#b48be0" : "#f4a6c6") + '"/>';
      });
    });
    s2 += '</svg></div>';
  });
  document.getElementById("sorrend").innerHTML = s2;
  var s3 = "";
  Object.keys(UNI_JARAS).forEach(function (k) {
    s3 += '<div class="film uni-jar-' + k + '"><b>' + (k === "seta" ? "Séta" : "Ügetés") + '</b>';
    for (var i = 0; i < 8; i++) s3 += '<svg viewBox="-60 -150 140 176" style="--d:' + (-i / 8 * UNI_JARAS[k].ido).toFixed(3) + 's">' + unikornisSVG("f" + k + i, { rajz: "kek" }, 1, LENYEK[1][1], null) + '<line x1="-60" x2="80" y1="8.9" y2="8.9" stroke="#9fcd84" stroke-width="1.5"/></svg>';
    s3 += '</div>';
  });
  document.getElementById("film").innerHTML = s3;
  var st = document.createElement("style"); st.textContent = uniJarasCSS(); document.head.appendChild(st);
  document.querySelectorAll("#jp .gombok button").forEach(function (b) {
    b.onclick = function () {
      var r = +b.dataset.r;
      document.querySelectorAll("#jp .gombok button").forEach(function (x) { x.classList.toggle("be", x === b); });
      document.getAnimations().forEach(function (a) { if (r === 0) a.pause(); else { a.playbackRate = r; a.play(); } });
    };
  });
})();
</script>"""

CSS = r"""<style>
#jp .gombok{ margin:10px 0 14px; font-weight:700; }
#jp .gombok button{ font:inherit; border:2px solid #c9b6ea; background:#fff; color:#6a3fb8; border-radius:999px; padding:4px 12px; margin-left:6px; cursor:pointer; }
#jp .gombok button.be{ background:#6a3fb8; color:#fff; }
#jp .sor{ display:flex; gap:12px; align-items:stretch; margin-bottom:14px; }
#jp .cim{ width:230px; flex:none; font-size:14px; }
#jp .cim b{ display:block; font-size:18px; color:#6a3fb8; }
#jp .cim span{ display:inline-block; font-size:12px; background:#eadcf7; border-radius:999px; padding:1px 8px; margin:2px 0; }
#jp .cim p{ margin:4px 0 0; }
#jp .szalag{ position:relative; flex:1 1 auto; min-width:0; height:190px; border-radius:14px; overflow:hidden; display:flex; justify-content:space-around; align-items:flex-start;
  background:linear-gradient(#eaf6ff, #f3fbff 60%); border:2px solid #eadcf7; }
#jp .fold{ position:absolute; left:0; right:0; top:150px; bottom:0; background-color:#cfe8b8; border-top:3px solid #9fcd84;
  background-image:repeating-linear-gradient(90deg, transparent 0 52px, #8fc173 52px 56px, transparent 56px 120px, #a9d68f 120px 126px, transparent 126px 240px);
  background-size:240px 100%; animation:jp-fold 1s linear infinite; }
@keyframes jp-fold{ from{ background-position-x:0; } to{ background-position-x:-240px; } }
#jp .uni{ position:relative; width:190px; flex:none; }
#jp .uni svg{ width:190px; height:167px; display:block; overflow:visible; }
#jp .uni-farok{ transform-box:view-box; transform-origin:0 0; animation:uni-farok 2.8s ease-in-out infinite; }
@keyframes uni-farok{ 0%,100%{ transform:rotate(3.5deg); } 50%{ transform:rotate(-3.5deg); } }
/* ma: a mostani kerti szabályok (style.css) */
#jp .ma .uni-lab{ transform-box:fill-box; transform-origin:50% 0%; }
#jp .ma .uni-lab-a{ animation:kert-lab-a .44s ease-in-out infinite; }
#jp .ma .uni-lab-b{ animation:kert-lab-b .44s ease-in-out infinite; }
#jp .ma-bob{ animation:kert-bob .44s ease-in-out infinite; }
@keyframes kert-lab-a{ 0%,100%{ transform:rotate(12deg); } 50%{ transform:rotate(-12deg); } }
@keyframes kert-lab-b{ 0%,100%{ transform:rotate(-12deg); } 50%{ transform:rotate(12deg); } }
@keyframes kert-bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
#jp .lr{ display:inline-block; width:440px; margin:0 20px 10px 0; vertical-align:top; } #jp .lr b{ color:#6a3fb8; }
#jp .film{ display:flex; align-items:center; gap:2px; margin-bottom:6px; } #jp .film b{ width:70px; flex:none; color:#6a3fb8; }
#jp .film svg{ width:12%; min-width:0; background:#fff; border-radius:8px; }
#jp .film svg *{ animation-play-state:paused!important; animation-delay:var(--d)!important; }
#jp .kis{ font-size:13px; color:#6b5f80; margin:2px 0 8px; }
@media (max-width:900px){ #jp .sor{ flex-direction:column; } #jp .cim{ width:auto; } }
</style>"""

lap, alapstil = "", "body{font-family:Fredoka,'Segoe UI',sans-serif;background:#fffaf3;color:#3b2f55;margin:0} main{max-width:1180px;margin:0 auto;padding:18px 16px 60px}"
terv = os.path.join(HERE, "jaras-rajzterv.html")
if os.path.exists(terv):
    t = rd(terv)
    m, st = re.search(r"<main[^>]*>([\s\S]*?)</main>", t), re.search(r"<style>([\s\S]*?)</style>", t)
    alapstil, lap = st.group(1), m.group(1)
    lap = lap.replace("<!--ELONEZET-->", LAP.replace("__LENYEK__", json.dumps([[l[0], l[1]] for l in LENYEK])))
else:
    lap = "<h1>Járás — mozgó előnézet</h1>" + LAP.replace("__LENYEK__", json.dumps([[l[0], l[1]] for l in LENYEK]))

h = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     '<title>Járás előnézet</title><style>' + alapstil + '</style>' + CSS +
     '<script>window.P=function(){return{}};</script><script>' + renderer.replace("</script>", "<\\/script>") + '</script>'
     '</head><body><main>' + lap + '</main></body></html>')
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

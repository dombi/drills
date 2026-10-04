#!/usr/bin/env python3
"""fordulas-build.py — MOZGÓ ELŐNÉZET a 4. lépéshez (közös fordulás, pörgés, indulás/megállás).

Mit csinál: a VALÓDI unikornis-rajz (src/renderer.js: uniFordul, uniPorog, uniJar/uniAll)
egy sávon oda-vissza sétál, a végén megfordul. Soronként: „ma” (pillanatszerű tükrözés, a láb bekattan),
és az új fordulás három változata. Alatta a pörgés: a mai felhőkerti és az új, közös pörgés.
Fölötte a terv szövege (terv/fordulas-rajzterv.html <main> része, ha már megvan).

Használat:  python terv/fordulas-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-fordulas.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-fordulas.html (a matekos-teszt szerver)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-fordulas.html"
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js"))
proto = "function nyugiMod(){ return false; }"   # a játék helpers.js-éből csak ez kell

OLT = {"kek": {"lab": "lab-a", "farok": "farok-a", "hat": "hat-k", "oldal": "oldal-k", "nyak": "nyak-k", "fej": "fej-k"},
       "rozsa": {"lab": "lab-r", "farok": "farok-k", "hat": "hat-r", "oldal": "oldal-r", "nyak": "nyak-r", "fej": "fej-r"},
       "korall": None}

LAP = r"""
<section id="fp">
  <div class="gombok">Tempó:
    <button data-t="1" class="be">valódi</button><button data-t="3">lassított (⅓)</button>
  </div>
  <div id="sorok"></div>
  <h3>Pörgés 🌀</h3>
  <p class="kis">Koppints egy unikornisra, vagy várj: 3 mp-enként maguktól is pörögnek.</p>
  <div id="porgesek"></div>
</section>
<script>
(function () {
  var OLT = __OLT__, T = 1;
  var SOROK = [
    { id: "ma", nev: "Ma", rajz: "kek", szoveg: "Mindhárom helyszínen: a végén egy pillanat alatt átfordul (tükörkép), induláskor és megálláskor a láb bekattan." },
    { id: "elol", nev: "Új: felénk fordul", rajz: "kek", szoveg: "Oldalról → szemből (ránk néz) → a másik oldalra. Indulás és megállás simán. (Producer döntése: A.)" },
    { id: "elol2", nev: "", rajz: "rozsa", szoveg: "Csillámharmat" },
    { id: "elol3", nev: "", rajz: "korall", szoveg: "Tűz, dísz nélkül" }
  ];
  function rajzol(el, id, rajz) {
    el.innerHTML = '<div class="kert-uni-flip"><svg viewBox="-100 -150 200 176">' + unikornisSVG(id, { rajz: rajz }, 1, OLT[rajz], null) + '</svg></div>';
    uniNezoAdat(el, { rajz: rajz, kinezet: null, oltozet: OLT[rajz] });
  }
  var h = "";
  SOROK.forEach(function (s) {
    h += '<div class="sor"><div class="cim"><b>' + s.nev + '</b>' + (s.jav ? '<span class="javasolt">javasolt</span>' : '') + '<p>' + s.szoveg + '</p></div>' +
         '<div class="szalag"><div class="fold"></div><div class="uni" id="u-' + s.id + '"></div></div></div>';
  });
  document.getElementById("sorok").innerHTML = h;
  SOROK.forEach(function (s) {
    var el = document.getElementById("u-" + s.id), sz = el.parentNode, x = 0, cel = 1;
    rajzol(el, "r-" + s.id, s.rajz);
    el.style.setProperty("--dir", 1);
    function hely(p) { return 10 + p * (Math.max(sz.clientWidth, 520) - 210); }   /* rejtett lapon a szélesség 0 lehet */
    el.style.left = hely(0) + "px";
    function lep() {
      var tav = Math.abs(hely(cel) - hely(x)), dir = cel > x ? 1 : -1;
      function indul() {
        var ut = uniUt(el, tav); ut.mp *= T; ut.tempo /= T;
        el.style.transition = "left " + ut.mp.toFixed(2) + "s linear";
        if (s.id === "ma") { el.classList.add("uni-jar-" + ut.mod); el.style.setProperty("--jar-tempo", ut.tempo); } else uniJar(el, ut);
        el.style.left = hely(cel) + "px";
        setTimeout(function () {
          if (s.id === "ma") el.classList.remove("uni-jar-seta", "uni-jar-uget"); else uniAll(el);
          x = cel; cel = 1 - cel;
          setTimeout(lep, 900 * T);
        }, ut.mp * 1000);
      }
      if (s.id === "ma") { el.style.setProperty("--dir", dir); indul(); return; }
      uniFordul(el, dir, indul);
    }
    setTimeout(lep, 600);
  });
  /* pörgés */
  var P2 = [{ id: "tk", nev: "Ma a felhőkertben", rajz: "kek", szoveg: "Összenyomott oldalkép, mint egy papírcsík." },
            { id: "uj", nev: "Új: mindenhol így", jav: true, rajz: "kek", szoveg: "Ragyogás" },
            { id: "uj2", nev: "", rajz: "rozsa", szoveg: "Csillámharmat" },
            { id: "uj3", nev: "", rajz: "korall", szoveg: "Tűz" }];
  var h2 = "";
  P2.forEach(function (p) {
    h2 += '<div class="pdoboz"><b>' + (p.nev || "&nbsp;") + '</b>' + (p.jav ? '<span class="javasolt">javasolt</span>' : '') + '<div class="pszin"><div class="uni" id="p-' + p.id + '"></div></div><p class="kis">' + p.szoveg + '</p></div>';
  });
  document.getElementById("porgesek").innerHTML = h2;
  P2.forEach(function (p) {
    var el = document.getElementById("p-" + p.id), fut = false;
    rajzol(el, "p" + p.id, p.rajz);
    el.style.setProperty("--dir", 1);
    function porog() {
      if (fut) return; fut = true;
      if (p.id === "tk") {
        el.style.setProperty("--tk-ido", (1.4 * T) + "s");
        el.classList.remove("tk-porog"); void el.offsetWidth; el.classList.add("tk-porog");
        setTimeout(function () { el.classList.remove("tk-porog"); fut = false; }, 1400 * T);
      } else uniPorog(el, 1400 * T, function () { fut = false; });
    }
    el.onclick = porog;
    setInterval(porog, 3000 * T);
  });
  document.querySelectorAll("#fp .gombok button").forEach(function (b) {
    b.onclick = function () {
      T = +b.dataset.t;
      UNI_FORDUL.ido = .34 * T; UNI_FORDUL.simit = .22 * T;
      document.querySelectorAll("#fp .gombok button").forEach(function (x) { x.classList.toggle("be", x === b); });
    };
  });
  var st = document.createElement("style");
  st.textContent = "";   /* a póz-, járás- és fordulás-CSS-t a renderer.js maga teszi a lapra */
  document.head.appendChild(st);
})();
</script>"""

CSS = r"""<style>
#fp .gombok{ margin:10px 0 14px; font-weight:700; }
#fp .gombok button{ font:inherit; border:2px solid #c9b6ea; background:#fff; color:#6a3fb8; border-radius:999px; padding:4px 12px; margin-left:6px; cursor:pointer; }
#fp .gombok button.be{ background:#6a3fb8; color:#fff; }
#fp .sor{ display:flex; gap:12px; align-items:stretch; margin-bottom:14px; }
#fp .cim{ width:230px; flex:none; font-size:14px; }
#fp .cim b{ display:block; font-size:18px; color:#6a3fb8; }
#fp .cim p{ margin:4px 0 0; }
#fp .szalag{ position:relative; flex:1 1 auto; min-width:0; height:190px; border-radius:14px; overflow:hidden;
  background:linear-gradient(#eaf6ff, #f3fbff 60%); border:2px solid #eadcf7; }
#fp .fold{ position:absolute; left:0; right:0; top:150px; bottom:0; background:#cfe8b8; border-top:3px solid #9fcd84; }
#fp .uni{ position:absolute; top:0; width:190px; cursor:pointer; }
#fp .uni svg{ width:190px; height:167px; display:block; overflow:visible; }
#fp .kert-uni-flip{ transform:scaleX(var(--dir,1)); transform-origin:50% 50%; }
#fp .uni-farok{ transform-box:view-box; transform-origin:0 0; animation:uni-farok 2.8s ease-in-out infinite; }
#fp .uni-elo{ animation:uni-lebeg 3.8s ease-in-out infinite; }
@keyframes uni-farok{ 0%,100%{ transform:rotate(3.5deg); } 50%{ transform:rotate(-3.5deg); } }
@keyframes uni-lebeg{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
#fp #porgesek{ display:flex; flex-wrap:wrap; gap:12px; }
#fp .pdoboz{ flex:1 1 220px; background:#fff; border:2px solid #eadcf7; border-radius:14px; padding:8px 10px; }
#fp .pdoboz b{ color:#6a3fb8; margin-right:6px; }
#fp .pszin{ position:relative; height:190px; border-radius:10px; background:linear-gradient(#eaf6ff 79%, #cfe8b8 79%); }
#fp .pszin .uni{ left:50%; margin-left:-95px; }
/* a mai felhőkerti pörgés (style.css tk-porges) */
#fp .tk-porog .kert-uni-flip{ animation:tk-porges var(--tk-ido,1.4s) ease-in-out 1; }
#fp .tk-porog svg{ animation:tk-porges-hop var(--tk-ido,1.4s) ease-in-out 1; }
@keyframes tk-porges{
  0%{ transform:scaleX(var(--dir,1)); } 12.5%{ transform:scaleX(0); } 25%{ transform:scaleX(calc(-1 * var(--dir,1))); }
  37.5%{ transform:scaleX(0); } 50%{ transform:scaleX(var(--dir,1)); } 62.5%{ transform:scaleX(0); }
  75%{ transform:scaleX(calc(-1 * var(--dir,1))); } 87.5%{ transform:scaleX(0); } 100%{ transform:scaleX(var(--dir,1)); }
}
@keyframes tk-porges-hop{ 0%,100%{ transform:translateY(0); } 25%,75%{ transform:translateY(-10px); } 50%{ transform:translateY(-4px); } }
#fp .kis{ font-size:13px; color:#6b5f80; margin:2px 0 8px; }
@media (max-width:900px){ #fp .sor{ flex-direction:column; } #fp .cim{ width:auto; } }
</style>"""

lap, alapstil = "", "body{font-family:Fredoka,'Segoe UI',sans-serif;background:#fffaf3;color:#3b2f55;margin:0} main{max-width:1180px;margin:0 auto;padding:18px 16px 60px}"
blokk = LAP.replace("__OLT__", json.dumps(OLT))
terv = os.path.join(HERE, "fordulas-rajzterv.html")
if os.path.exists(terv):
    t = rd(terv)
    m, st = re.search(r"<main[^>]*>([\s\S]*?)</main>", t), re.search(r"<style>([\s\S]*?)</style>", t)
    alapstil, lap = st.group(1), m.group(1).replace("<!--ELONEZET-->", blokk)
else:
    lap = "<h1>Fordulás — mozgó előnézet</h1>" + blokk

h = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     '<title>Fordulás előnézet</title><style>' + alapstil + '</style>' + CSS +
     '<script>window.P=function(){return{}};</script><script>' + (renderer + "\n" + proto).replace("</script>", "<\\/script>") + '</script>'
     '</head><body><main>' + lap + '</main></body></html>')
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

#!/usr/bin/env python3
"""diszek-nezetek-build.py — PRÓBALAP a díszek három nézetéhez (unikornis pózok, 1b lépés).

Mit csinál: a játékot (index.html + style.css + game.js) egyetlen önálló HTML-be fűzi, és rátesz
egy réteget, amely a VALÓDI játékkódból rajzolja ki mind a 18 díszt oldalról, szemből és hátulról
(unikornisSVG + unikornisNezetArt), mindhárom lényen, plusz egy teljes díszben pörgő unikornist.
Fölötte a rajzterv szövege (terv/diszek-nezetek-rajzterv.html <main> része).

Használat:  python terv/diszek-nezetek-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-diszek-nezetek.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-diszek-nezetek.html (a matekos-teszt szerver)

Biztonság: semmit nem ment (a localStorage-írás ki van kapcsolva), néma, felhőhöz nem csatlakozik.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-diszek-nezetek.html"
rd = lambda f: open(os.path.join(SRC, f), encoding="utf-8").read()

PRE = r"""<script>
window.__UC_GYORS = true;
try { Storage.prototype.setItem = function () {}; } catch (e) {}          /* a próbalap SOHA nem ment */
class FakeSR { constructor() { this.lang = "hu-HU"; } start() {} stop() { var s = this; setTimeout(function () { s.onend && s.onend(); }, 0); } abort() { this.stop(); } }
window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
try { speechSynthesis.speak = function (u) { setTimeout(function () { u.onstart && u.onstart(); u.onend && u.onend(); }, 5); };
      speechSynthesis.getVoices = function () { return [{ lang: "hu-HU", name: "Teszt", localService: true }]; }; } catch (e) {}
try { window.AudioContext = window.webkitAudioContext = undefined; } catch (e) {}
</script>"""

PAD = r"""<style>
#dn{ position:fixed; inset:0; z-index:2147483000; overflow:auto; background:#fffaf3; color:#3b2f55;
  font-family:Fredoka,"Segoe UI",sans-serif; padding:18px 16px 60px; }
#dn h2{ margin:28px 0 8px; font-size:20px; color:#6a3fb8; border-bottom:2px solid #eadcf7; padding-bottom:4px; }
#dn .dn-sor{ display:flex; flex-wrap:wrap; gap:12px; }
#dn figure{ margin:0; background:#fff; border:2px solid #eadcf7; border-radius:14px; overflow:hidden; }
#dn .dn-harom{ display:flex; background:linear-gradient(#eaf6ff,#e3f3d6 70%,#cfe8b8); }
#dn .dn-harom svg{ width:150px; height:132px; display:block; }
#dn .dn-nagy svg{ width:300px; height:264px; }
#dn figcaption{ padding:6px 10px 8px; font-size:13.5px; } #dn figcaption b{ font-size:15px; }
#dn .dn-fej{ display:flex; font-size:11.5px; color:#7a6d92; } #dn .dn-fej span{ width:150px; text-align:center; padding-top:3px; }
#dn .dn-lenyek button{ font:inherit; font-weight:700; border:2px solid #c9a8e6; background:#fff; color:#6a3fb8; border-radius:999px; padding:4px 14px; margin:6px 6px 0 0; cursor:pointer; }
#dn .dn-lenyek button.aktiv{ background:#8a4fd0; color:#fff; border-color:#8a4fd0; }
#dn .dn-lap{ max-width:980px; }
</style>
<script>
(function () {
  var TELJES = { fej: "fej-r", nyak: "nyak-k", hat: "hat-r", lab: "lab-r", oldal: "oldal-r", farok: "farok-r" };
  var N = 0, porgesIdo = null;
  function lenyC() { return UC.LENYEK[UC.mentes.leny]; }
  function rajz() { return (lenyC() && lenyC().rajz) || "korall"; }
  function keret(belso) { return '<svg viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' + belso + '</svg>'; }
  function oldal(olt) { return keret(UC.unikornisSVG("dn" + (++N), lenyC(), 1, olt, null)); }
  function nezet(nz, olt) {
    return keret('<g transform="scale(0.5) translate(-190,-272)">' + UC.unikornisNezetArt(nz, rajz(), null, "dn" + (++N), olt) + '</g>');
  }
  function harom(olt) { return '<div class="dn-harom">' + oldal(olt) + nezet("elol", olt) + nezet("hatul", olt) + '</div>'; }
  function rajzol() {
    var dn = document.getElementById("dn");
    var h = '<div class="dn-lap">' + (window.__DN_LAP || "") + '</div>';
    h += '<h2>Próbalap — a valódi kódból</h2><div class="dn-lenyek">' + Object.keys(UC.LENYEK).map(function (k) {
      return '<button data-l="' + k + '"' + (k === UC.mentes.leny ? ' class="aktiv"' : '') + '>' + UC.LENYEK[k].nev + '</button>'; }).join("") + '</div>';
    h += '<h2>Teljes díszben — pörgés (mint a kertben)</h2><div class="dn-sor"><figure class="dn-nagy"><div class="dn-harom" id="dn-porges"></div><figcaption><b>Pörög</b>oldal → szemből → másik oldal → hátulról</figcaption></figure>' +
         '<figure><div class="dn-fej"><span>oldalról</span><span>szemből</span><span>hátulról</span></div>' + harom(TELJES) + '<figcaption><b>Mind a 6 dísz egyszerre</b>a legszebbik (ritka) mindenből</figcaption></figure></div>';
    Object.keys(UC.RUHAK).forEach(function (hely) {
      h += '<h2>' + { fej: "Fej", nyak: "Nyak", hat: "Hát", lab: "Láb", oldal: "Szárny", farok: "Farok" }[hely] + '</h2><div class="dn-sor">';
      UC.RUHAK[hely].forEach(function (t) {
        var olt = {}; olt[hely] = t.id;
        h += '<figure><div class="dn-fej"><span>oldalról</span><span>szemből</span><span>hátulról</span></div>' + harom(olt) + '<figcaption><b>' + t.nev + '</b></figcaption></figure>';
      });
      h += '</div>';
    });
    h += '<h2>Dísz nélkül (ellenőrzés: ugyanaz, mint eddig)</h2><div class="dn-sor"><figure>' + harom(null) + '</figure></div>';
    dn.innerHTML = h;
    dn.querySelectorAll(".dn-lenyek button").forEach(function (b) { b.onclick = function () { UC.mentes.leny = b.getAttribute("data-l"); rajzol(); }; });
    var kepek = [oldal(TELJES), nezet("elol", TELJES), '<div style="transform:scaleX(-1)">' + oldal(TELJES) + '</div>', nezet("hatul", TELJES)], i = 0, hely = document.getElementById("dn-porges");
    clearInterval(porgesIdo);
    function lep() { hely.innerHTML = kepek[i % 4].replace('<svg ', '<svg style="width:300px;height:264px" '); i++; }
    lep(); porgesIdo = setInterval(lep, 650);
  }
  function indul() {
    var dn = document.createElement("div"); dn.id = "dn"; document.body.appendChild(dn);
    rajzol();
  }
  if (document.readyState === "complete") setTimeout(indul, 300); else window.addEventListener("load", function () { setTimeout(indul, 300); });
})();
</script>"""

h = rd("index.html")
h = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda m: "<style>" + rd("style.css") + "</style>", h)
for f in ["kert-hangok.js", "tk-diszek.js", "game.js"]:
    h = re.sub(r'<script src="%s[^"]*"></script>' % re.escape(f),
               lambda m, f=f: (PRE if f == "kert-hangok.js" else "") + "<script>" + rd(f).replace("</script>", "<\\/script>") + "</script>", h)
lap = ""
t = open(os.path.join(HERE, "diszek-nezetek-rajzterv.html"), encoding="utf-8").read()
m = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
st = re.search(r"<style>([\s\S]*?)</style>", t)
if m:
    css = ("<style>" + re.sub(r"(^|\})\s*([^{}@]+)\{", lambda x: x.group(1) + "\n" + ",".join("#dn .dn-lap " + s.strip() for s in x.group(2).split(",")) + "{", st.group(1)) + "</style>") if st else ""
    lap = css + m.group(1)
h = h.replace("</body>", "<script>window.__DN_LAP=" + json.dumps(lap).replace("</", "<\\/") + ";</script>" + PAD + "</body>")
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

#!/usr/bin/env python3
"""agy-build.py — ÖSSZEHASONLÍTÓ LAP a 7. lépéshez (új ágy, unikornis pózok terve).

Mit csinál: a játékot (index.html + style.css + game.js) egyetlen önálló HTML-be fűzi, és rátesz egy
réteget, amely a VALÓDI odú-rajzba (oduSVG) a mai ágy helyére sorban a 3 új ágyváltozatot teszi
(terv/agy-valtozatok.js), mindegyikben a valódi, fekvő unikornissal — teljes szobában, közelről,
a 3 bolti szinttel, és a kertben is. Fölötte a terv szövege (terv/agy-rajzterv.html <main> része).

Használat:  python terv/agy-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-agy.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-agy.html (a matekos-teszt szerver)

Biztonság: semmit nem ment (localStorage-írás ki), néma, felhőhöz nem csatlakozik.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-agy.html"
rd = lambda f: open(os.path.join(SRC, f), encoding="utf-8").read()

PRE = r"""<script>
window.__UC_GYORS = true;
try { Storage.prototype.setItem = function () {}; } catch (e) {}
class FakeSR { constructor() { this.lang = "hu-HU"; } start() {} stop() { var s = this; setTimeout(function () { s.onend && s.onend(); }, 0); } abort() { this.stop(); } }
window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
try { speechSynthesis.speak = function (u) { setTimeout(function () { u.onstart && u.onstart(); u.onend && u.onend(); }, 5); };
      speechSynthesis.getVoices = function () { return [{ lang: "hu-HU", name: "Teszt", localService: true }]; }; } catch (e) {}
try { window.AudioContext = window.webkitAudioContext = undefined; } catch (e) {}
</script>"""

OLT = {"lab": "lab-r", "nyak": "nyak-r", "fej": "fej-r"}

PAD = r"""<style>
#ap{ position:fixed; inset:0; z-index:2147483000; overflow:auto; background:#fffaf3; color:#3b2f55;
  font-family:Fredoka,"Segoe UI",sans-serif; padding:18px 16px 60px; }
#ap *{ transition:none !important; }
#ap .ap-wrap{ max-width:1180px; margin:0 auto; }
#ap .valt{ background:#fff; border:2px solid #eadcf7; border-radius:16px; padding:12px 14px; margin:0 0 16px; }
#ap .valt h3{ margin:0 0 2px; color:#6a3fb8; font-size:20px; }
#ap .valt .kis{ margin:0 0 8px; font-size:14px; color:#6b5f80; }
#ap .kepek{ display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:10px; }
#ap figure{ margin:0; }
#ap figure svg{ width:100%; height:auto; display:block; border-radius:10px; background:#efe6fa; }
#ap figcaption{ font-size:13px; color:#6b5f80; margin-top:3px; }
#ap .uni-elo{ animation:none !important; }
</style>
<div id="ap"><div class="ap-wrap">__LAP__</div></div>
<script>
(function () {
  var OLT = __OLT__, n = 0, A = window.__AP, unikornisSVG = A.unikornisSVG, oduSVG = A.oduSVG, alapOdu = A.alapOdu,
      kertTargyBelso = A.kertTargyBelso, __agyMa = A.agyMa, AGY_VALTOZAT = A.V;
  function uni(x, y, sk, rajz) {
    n++;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (-sk) + ',' + sk + ')"><g class="uni-poz-fekszik">' +
           unikornisSVG("ap" + n, { rajz: rajz || "rozsa" }, 1, OLT, null) + '</g></g>';
  }
  function odu(agyFn, sz, vb, u) {
    var o = alapOdu(); o.napszak = "este"; o.szint.agy = sz;
    window.__AGY_ODU = function (oo) { return agyFn(oo) + "<!--UNI-->"; };
    var s = oduSVG("ragyogas", o, true);
    window.__AGY_ODU = null;
    s = s.replace("<!--UNI-->", u);
    if (vb) s = s.replace(/viewBox="[^"]*"/, 'viewBox="' + vb + '"');
    return s;
  }
  var KERT_HATTER = '<defs><linearGradient id="ap-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9ff"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient></defs>' +
    '<rect x="-20" y="200" width="380" height="300" fill="url(#ap-eg)"/><path d="M-20 400 Q100 380 200 398 Q280 410 360 392 L360 500 L-20 500 Z" fill="#a9d98a"/>' +
    '<rect x="-20" y="420" width="380" height="80" fill="#93cf74"/>';
  function kert(belso) { return '<svg viewBox="-10 222 340 248" xmlns="http://www.w3.org/2000/svg">' + KERT_HATTER + belso + '</svg>'; }
  var KOZEL = "0 222 330 248", TELJES = "0 0 680 540";

  function sor(cim, kis, kepek) {
    return '<div class="valt"><h3>' + cim + '</h3><p class="kis">' + kis + '</p><div class="kepek">' +
      kepek.map(function (k) { return '<figure>' + k[0] + '<figcaption>' + k[1] + '</figcaption></figure>'; }).join("") + '</div></div>';
  }
  var h = "";
  /* MA */
  var maOdu = function (oo) { return __agyMa(oo); };
  h += sor("Ma", "A mai felhő-ágy. Az odúban a valódi méretű fekvő unikornis nem fér bele; a kertben kisebb unikornissal van, a szivárvány-ív a fej mögött áll.", [
    [odu(maOdu, 1, TELJES, uni(160, 404, 1.28)), "Odú — teljes szoba (a fekvő unikornis valódi méretben)"],
    [odu(maOdu, 1, KOZEL, uni(160, 404, 1.28)), "Odú — közelről"],
    [odu(maOdu, 3, KOZEL, uni(160, 404, 1.28)), "Odú — 3. szint (baldachin)"],
    [kert('<g transform="translate(130,455) scale(2.2222)">' + kertTargyBelso("agy") + '</g>' + uni(172, 410, 0.89) +
          '<g transform="translate(130,455) scale(2.2222)">' + kertTargyBelso("agy-elol") + '</g>'), "Kert — ma (kisebb unikornis)"]
  ]);
  Object.keys(AGY_VALTOZAT).forEach(function (k) {
    var V = AGY_VALTOZAT[k];
    function fn(sz) { return function () { return V.hatso(sz); }; }
    function elol(sz) { return V.elol(sz); }
    function o(sz, vb) {
      var o2 = alapOdu(); o2.napszak = "este"; o2.szint.agy = 1;   /* a régi szint-rárajzolások NE kerüljenek rá: azokat az új rajz hozza */
      window.__AGY_ODU = function () { return V.hatso(sz) + "<!--UNI-->" + V.elol(sz); };
      var s = oduSVG("ragyogas", o2, true); window.__AGY_ODU = null;
      s = s.replace("<!--UNI-->", uni(V.uni.x, V.uni.y, 1.28));
      return s.replace(/viewBox="[^"]*"/, 'viewBox="' + vb + '"');
    }
    h += sor(V.nev, V.rovid, [
      [o(1, TELJES), "Odú — teljes szoba"],
      [o(1, KOZEL), "1. szint (alap)"],
      [o(2, KOZEL), "2. szint — szivárványos takaró"],
      [o(3, KOZEL), "3. szint — csillagbaldachin"],
      [kert(V.hatso(1) + uni(V.uni.x, V.uni.y, 1.28) + V.elol(1)), "Kert — ugyanaz a rajz"]
    ]);
  });
  document.getElementById("ap-sorok").innerHTML = h;
  /* ?nagy=5,6 → csak ezek a képek, nagyban (gyors ellenőrzéshez) */
  var nq = /[?&]nagy=([\d,]+)/.exec(location.search);
  if (nq) {
    var f = document.querySelectorAll("#ap figure"), d = document.createElement("div");
    d.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:6px";
    d.innerHTML = nq[1].split(",").map(function (i) { return f[+i] ? f[+i].querySelector("svg").outerHTML : ""; }).join("");
    document.body.appendChild(d);
  }
})();
</script>"""

h = rd("index.html")
h = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda m: "<style>" + rd("style.css") + "</style>", h)

game = rd("game.js")
m = re.search(r"(  /\* ── FELHŐ-ÁGY \(bal\) ── \*/\n)([\s\S]*?)(  /\* ── GYÖKÉRPOLC)", game)
assert m, "nem találom a FELHŐ-ÁGY blokkot a game.js-ben"
game = game[:m.start()] + "  s += (window.__AGY_ODU || __agyMa)(o);\n" + m.group(3) + game[m.end():]
game = game.replace("function oduSVG(", "function __agyMa(o) { var s = \"\";\n" + m.group(2) + "  return s; }\nfunction oduSVG(", 1)
valt = open(os.path.join(HERE, "agy-valtozatok.js"), encoding="utf-8").read()

for f in ["kert-hangok.js", "tk-diszek.js", "game.js"]:
    kod = game if f == "game.js" else rd(f)
    if f == "game.js":   # a game.js egy zárt függvény → a változatok BELÜL futnak, és kiadjuk, ami a laphoz kell
        i = kod.rstrip().rfind("})();")
        kod = (kod[:i] + valt + "\nwindow.__AP = { unikornisSVG: unikornisSVG, oduSVG: oduSVG, alapOdu: alapOdu, "
               "kertTargyBelso: kertTargyBelso, agyMa: __agyMa, V: AGY_VALTOZAT };\n" + kod[i:])
    h = re.sub(r'<script src="%s[^"]*"></script>' % re.escape(f),
               lambda mm, f=f, kod=kod: (PRE if f == "kert-hangok.js" else "") + "<script>" + kod.replace("</script>", "<\\/script>") + "</script>", h)

lap = '<h1>Új ágy — összehasonlító lap</h1><div id="ap-sorok"></div>'
lp = os.path.join(HERE, "agy-rajzterv.html")
if os.path.exists(lp):
    t = open(lp, encoding="utf-8").read()
    mm = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
    st = re.search(r"<style>([\s\S]*?)</style>", t)
    if mm:
        css = ("<style>" + re.sub(r"(^|\})\s*([^{}@]+)\{", lambda x: x.group(1) + "\n" + ",".join("#ap .ap-lap " + s.strip() for s in x.group(2).split(",")) + "{", st.group(1)) + "</style>") if st else ""
        lap = css + '<div class="ap-lap">' + mm.group(1).replace("<!--ELONEZET-->", '<div id="ap-sorok"></div>') + "</div>"
pad = PAD.replace("__OLT__", json.dumps(OLT)).replace("__LAP__", lap)
h = h.replace("</body>", pad + "</body>")
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

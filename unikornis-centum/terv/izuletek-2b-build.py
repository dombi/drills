#!/usr/bin/env python3
"""izuletek-2b-build.py — ÖSSZEHASONLÍTÓ LAP a fej, a farok és a szárny ízületéhez (unikornis pózok, 2b).

Mit csinál: két oszlop egymás mellett, soronként egy póz. Bal = „ma” (a legutóbbi commit rajzkódja,
git HEAD:src/renderer.js), jobb = „új” (a munkapéldány src/renderer.js-e). Mindkettő a VALÓDI
unikornisSVG-t rajzolja a valódi póz-CSS-sel (uniPozCSS), megállítva. Fölötte a rajzterv szövege
(terv/izuletek-rajzterv.html <main> része).

Használat:  python terv/izuletek-2b-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-izuletek-2b.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-izuletek-2b.html (a matekos-teszt szerver)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re, json, subprocess, html

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-izuletek-2b.html"
uj = open(os.path.join(SRC, "src", "renderer.js"), encoding="utf-8").read()
ma = subprocess.run(["git", "show", "HEAD:./src/renderer.js"], cwd=SRC, capture_output=True).stdout.decode("utf-8")

POZOK = [["", "Áll", "Álló pózban semmi sem változik."],
         ["uni-poz-ul", "Ül", "Új: a fej kiegyenesedik (nem néz az ég felé), a farok a földre simul (nem lóg bele a fűbe)."],
         ["uni-mozd-eszik", "Eszik / szagol", "Új: a fej és a nyak lehajol az étel felé. Ma csak a térd rogy, a fej fent marad."],
         ["uni-poz-guggol", "Guggol (ugrás előtt)", "Új: a fej kicsit lebiccen, a farok és a szárny fölemelkedik — nekirugaszkodik."],
         ["uni-poz-fekszik", "Fekszik", "Új: a fej kicsit lejjebb, a farok a test mellé simul."]]
LENYEK = [["korall", None, "Tűz, dísz nélkül"],
          ["kek", {"lab": "lab-a", "farok": "farok-a", "hat": "hat-k", "oldal": "oldal-k", "nyak": "nyak-k", "fej": "fej-k"}, "Ragyogás: szárny, csokor, medál, csillag"],
          ["rozsa", {"lab": "lab-r", "farok": "farok-k", "hat": "hat-r", "oldal": "oldal-r", "nyak": "nyak-r", "fej": "fej-r"}, "Csillámharmat: fény-szárny, csengő, sál, korona"]]

RAJZ = r"""<script>
(function () {
  var POZOK = __POZOK__, LENYEK = __LENYEK__, h = "";
  POZOK.forEach(function (p, i) {
    h += '<div class="sor">';
    LENYEK.forEach(function (l, j) {
      h += '<svg viewBox="-116 -146 232 160" class="' + p[0] + '">' + unikornisSVG("u" + i + "-" + j, { rajz: l[0] }, 1, l[1], null) + '</svg>';
    });
    h += '</div>';
  });
  document.body.innerHTML = h;
  /* a mozdulatot a csúcsán állítjuk meg (eszik: 16–80% között teljes) */
  setTimeout(function () { document.getAnimations().forEach(function (a) { a.pause(); a.currentTime = (a.effect.getTiming().duration || 0) * .5; }); }, 30);
})();
</script>"""
CSS = "<style>*{transition:none!important} body{margin:0;background:linear-gradient(#eaf6ff,#e3f3d6 72%,#cfe8b8);} .sor{display:flex;height:170px;border-bottom:2px solid #fff} svg{width:220px;height:160px}</style>"

def keret(js):
    belso = ('<!doctype html><html><head><meta charset="utf-8">' + CSS + '<script>window.P=function(){return{}};</script><script>' +
             js.replace("</script>", "<\\/script>") + '</script></head><body>' +
             RAJZ.replace("__POZOK__", json.dumps(POZOK)).replace("__LENYEK__", json.dumps([[l[0], l[1]] for l in LENYEK])) + '</body></html>')
    return '<iframe srcdoc="' + html.escape(belso, quote=True) + '"></iframe>'

lap = ""
p = os.path.join(HERE, "izuletek-rajzterv.html")
t = open(p, encoding="utf-8").read()
m = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
st = re.search(r"<style>([\s\S]*?)</style>", t)
lap = "<style>" + st.group(1) + "</style>" + m.group(1)

feliratok = "".join('<div class="f"><b>' + p[1] + '</b>' + p[2] + '</div>' for p in POZOK)
h = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     '<title>Ízületek 2b próbalap</title><style>main{max-width:1640px!important}'
     '#ossz{display:flex;gap:10px;align-items:flex-start;overflow-x:auto} #ossz iframe{border:3px solid #f3c3cc;border-radius:12px;width:672px;height:' + str(170 * len(POZOK) + 4) + 'px;flex:none}'
     '#ossz iframe.uj{border-color:#9fd89a} .fej{display:flex;gap:10px;font-weight:800} .fej div{width:672px;flex:none;text-align:center;border-radius:999px;padding:2px}'
     '.fel{width:230px;flex:none} .f{height:170px;font-size:13.5px;box-sizing:border-box;padding:8px 6px} .f b{display:block;font-size:16px;color:#6a3fb8}'
     '</style></head><body><main>' + lap +
     '<h2>Ma és új — a valódi rajzkódból</h2><p>Oszloponként: ' + " · ".join(l[2] for l in LENYEK) + '.</p>'
     '<div class="fej"><div class="fel"></div><div style="background:#ffe1e6;color:#b0263e">ma</div><div style="background:#e2f6dc;color:#2f7a2e">új</div></div>'
     '<div id="ossz"><div class="fel">' + feliratok + '</div>' + keret(ma) + keret(uj).replace("<iframe", '<iframe class="uj"') + '</div>'
     '</main></body></html>')
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

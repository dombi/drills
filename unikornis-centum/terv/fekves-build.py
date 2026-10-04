#!/usr/bin/env python3
"""fekves-build.py — ÖSSZEHASONLÍTÓ LAP a szép fekvő pózhoz (unikornis pózok, 8. lépés).

Mit csinál: két keret egymás alatt. Fent = „ma” (a legutóbbi commit kódja: git HEAD src/renderer.js,
src/odu.js ágy-blokkja, style.css), lent = „új” (a munkapéldány ugyanezen fájljai). Mindkettőben a
kerti jelenet: a három ágy (Felhőfészek, Holdbölcső, Lótuszágy), rajtuk a három unikornis díszekkel,
a kerti elhelyezéssel (kertAgyHely képlete). Gombok: „Lefekszik” / „Felkel” — a teljes mozdulatsor élőben.
Alatta közeli kép a fejről. Fölötte a rajzterv szövege (terv/fekves-rajzterv.html <main> része).

Használat:  python terv/fekves-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-fekves.html  (helyi, NEM kerül a repóba)
Böngészőben: http://localhost:8802/uc-fekves.html (a matekos-teszt szerver)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re, json, subprocess, html

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-fekves.html"


def olvas(ut, head):
    if head:
        return subprocess.run(["git", "show", "HEAD:./" + ut], cwd=SRC, capture_output=True).stdout.decode("utf-8")
    return open(os.path.join(SRC, ut), encoding="utf-8").read()


def agy_blokk(odu):
    a = odu.index("var AGY_FAJTA")
    b = odu.index("function agyRajz")
    b = odu.index("\n", b) + 1
    return odu[a:b]


LENYEK = [["korall", {"lab": "lab-a", "farok": "farok-a", "nyak": "nyak-k"}, "Tűz"],
          ["kek", {"lab": "lab-a", "farok": "farok-a", "hat": "hat-k", "oldal": "oldal-k", "nyak": "nyak-k", "fej": "fej-k"}, "Ragyogás"],
          ["rozsa", {"lab": "lab-r", "farok": "farok-k", "hat": "hat-r", "oldal": "oldal-r", "nyak": "nyak-r", "fej": "fej-r"}, "Csillámharmat"]]

RAJZ = r"""<script>
var LENYEK = __LENYEK__, SZINT = 1;
window.P = function () { return { odu: { szint: { agy: SZINT } }, kert: {}, kinezet: null }; };
function agyTargy(szint, reteg) {   /* = kertTargyBelso("agy"/"agy-elol") */
  return '<g transform="scale(' + KERT_AGY_SKALA + ') translate(-155,-452)"><g class="kt-agy-matrac">' + AGY_KERET + agyRajz(szint, reteg) + '</g></g>';
}
function hely(szint) {   /* = kertAgyHely() */
  var f = AGY_FEKVES[agyFajta(szint)], k = KERT_AGY_SKALA * (212 / 92);
  return { jobbra: Math.round((f.x - 155) * k), fel: Math.round((452 - f.y) * k - 25) };
}
var h = '<div class="gombok"><button id="le">😴 Lefekszik</button><button id="fel">☀️ Felkel</button><span id="ido"></span></div><div id="kert-szinter" class="sorok">';
LENYEK.forEach(function (l, j) {
  var szint = j + 1, hl = hely(szint);
  h += '<div class="jelenet" data-j="' + j + '">' +
    '<div class="kt-elem kt-agy-elem" style="left:50%;top:84%;z-index:10"><svg class="kt-el-svg" viewBox="-46 -54 92 62">' + agyTargy(szint, "hatso") + '</svg></div>' +
    '<div id="kert-uni-doboz" class="kert-uni-doboz" style="--dir:-1;left:calc(50% + ' + hl.jobbra + 'px);bottom:calc(16% + ' + hl.fel + 'px);z-index:15;transition:none">' +
      '<div class="kert-uni-flip"><svg class="kert-uni-svg" viewBox="-100 -150 200 176">' + unikornisSVG("u" + j, { rajz: l[0] }, 1, l[1], null) + '</svg></div></div>' +
    '<div class="kt-elem kt-agy-elol" style="left:50%;top:84%;z-index:20"><svg class="kt-el-svg" viewBox="-46 -54 92 62">' + agyTargy(szint, "elol") + '</svg></div>' +
  '</div>';
});
h += '</div><div class="kozel" id="kert-szinter2"></div>';
document.body.innerHTML = h;
var dobozok = document.querySelectorAll(".kert-uni-doboz"), agyak = document.querySelectorAll(".kt-agy-elem, .kt-agy-elol");
function le() {
  dobozok.forEach(function (d) {
    d.classList.add("fekszik-all");
    if (typeof uniElalszik === "function") uniElalszik(d);
    else {   /* ma: kertFekszik + kertZzzTesz */
      d.classList.add("fekszik-all");
      if (!d.querySelector(".kert-zzz")) { var z = document.createElement("div"); z.className = "kert-zzz"; z.innerHTML = "<span>z</span><span>z</span><span>z</span>"; d.appendChild(z); }
    }
  });
  agyak.forEach(function (a) { a.classList.add("terhelt"); });
}
function fel() {
  dobozok.forEach(function (d) {
    d.classList.remove("fekszik-all");
    if (typeof uniFelebred === "function") { uniFelebred(d); if (typeof uniNyujtozik === "function") setTimeout(function () { uniNyujtozik(d); }, 520); }
    else { d.classList.remove("fekszik-all"); var z = d.querySelector(".kert-zzz"); if (z) z.remove(); }
  });
  agyak.forEach(function (a) { a.classList.remove("terhelt"); });
}
document.getElementById("le").onclick = le;
document.getElementById("fel").onclick = fel;
/* indulás: már fekszik, minden átmenet nélkül; az „ébren fekvés” szakaszt átugorjuk */
document.querySelectorAll("*").forEach(function (e) { e.style.transition = "none"; });
le();
if (typeof uniFelebred === "function") dobozok.forEach(function (d) { uniFelebred(d); d.classList.add("uni-alszik"); uniZzz(d, true); });
requestAnimationFrame(function () { requestAnimationFrame(function () { document.querySelectorAll("*").forEach(function (e) { e.style.transition = ""; }); }); });
</script>"""

CSS = ("<style>body{margin:0;background:#fffaf3;font-family:Fredoka,'Segoe UI',sans-serif}"
       ".gombok{padding:6px 10px} .gombok button{font:inherit;font-weight:700;border:2px solid #c9b6ea;background:#fff;color:#6a3fb8;border-radius:999px;padding:4px 14px;margin-right:8px;cursor:pointer}"
       ".sorok{display:flex;gap:8px;padding:0 8px} .jelenet{position:relative;flex:1 1 0;height:250px;border-radius:14px;overflow:hidden;"
       "background:linear-gradient(#cfeafc,#eaf6ff 52%,#bfe3a3 52%,#a9d68f)}"
       "</style>")


def keret(head, cls):
    rend = olvas("src/renderer.js", head)
    odu = agy_blokk(olvas("src/odu.js", head))
    stil = olvas("style.css", head)
    belso = ('<!doctype html><html><head><meta charset="utf-8"><style>' + stil + '</style>' + CSS +
             '<script>window.P=function(){return{odu:{szint:{agy:1}},kert:{}}};window.nyugiMod=function(){return false};</script><script>' +
             (rend + "\n" + odu).replace("</script>", "<\\/script>") + '</script></head><body>' +
             RAJZ.replace("__LENYEK__", json.dumps([[l[0], l[1]] for l in LENYEK])) + '</body></html>')
    return '<iframe class="' + cls + '" srcdoc="' + html.escape(belso, quote=True) + '"></iframe>'


p = os.path.join(HERE, "fekves-rajzterv.html")
if os.path.exists(p):
    t = open(p, encoding="utf-8").read()
    m = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
    st = re.search(r"<style>([\s\S]*?)</style>", t)
    lap = "<style>" + st.group(1) + "</style>" + m.group(1)
else:
    lap = "<h1>Fekvő póz — összehasonlítás</h1><!--ELONEZET-->"

osszeh = ('<p>Balról jobbra: ' + " · ".join("%s a %s" % (l[2], ["Felhőfészekben", "Holdbölcsőben", "Lótuszágyban"][i]) for i, l in enumerate(LENYEK)) +
          '. A gombokkal a teljes mozdulatsor lejátszható.</p>'
          '<div class="cimke ma">ma</div>' + keret(True, "ma") +
          '<div class="cimke uj">új</div>' + keret(False, "uj"))
lap = lap.replace("<!--ELONEZET-->", osszeh)
h = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     '<title>Fekvő póz próbalap</title><style>'
     'iframe{display:block;width:100%;height:310px;border:3px solid #f3c3cc;border-radius:12px;margin-bottom:14px} iframe.uj{border-color:#9fd89a}'
     '.cimke{display:inline-block;font-weight:800;border-radius:999px;padding:1px 14px;margin:4px 0} .cimke.ma{background:#ffe1e6;color:#b0263e} .cimke.uj{background:#e2f6dc;color:#2f7a2e}'
     '</style></head><body><main>' + lap + '</main></body></html>')
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kesz:", DST, len(h), "bajt")

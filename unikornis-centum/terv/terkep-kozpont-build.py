#!/usr/bin/env python3
"""terkep-kozpont-build.py — ÖSSZEHASONLÍTÓ LAP a „Térkép mint központ” rajztervéhez.

Mit csinál: a VALÓDI játékot (index.html + style.css + src/ modulok, a build.py sorrendjében) egyetlen
próbaoldallá fűzi, és a main.js elé beteszi a prototípus-réteget (terv/terkep-kozpont-proto.js). A réteg
csak akkor kapcsol be, ha a címben ?uj=1 áll — így ugyanaz az oldal mutatja a „ma” és az „új” képet.
Az összehasonlító lap ezt az oldalat tölti be keretekbe (fekvő laptop- és álló telefonméretben),
fölötte a rajzterv szövegével (terv/terkep-kozpont-rajzterv.html <main> része).

Használat:  python terv/terkep-kozpont-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-terkep-kozpont.html        (az összehasonlító lap)
            C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-terkep-kozpont-proba.html  (a próbaoldal, a keretek ezt töltik)
            (helyi fájlok, NEM kerülnek a repóba)

Biztonság: a próbaoldal NEM ír a gép valódi mentésébe (a localStorage helyett memóriában tárol),
nem szól (a felolvasás néma), és nem kapcsolódik a felhőhöz.
"""
import os, re, sys, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
UC = os.path.dirname(HERE)
DST_DIR = r"C:\Users\Dombi-NyárádiGabriel\Matekos"
PROBA = os.path.join(DST_DIR, "uc-terkep-kozpont-proba.html")
LAP = os.path.join(DST_DIR, "uc-terkep-kozpont.html")


def olvas(ut):
    with open(ut, encoding="utf-8") as f:
        return f.read()


def modulok():
    spec = importlib.util.spec_from_file_location("ucbuild", os.path.join(UC, "build.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.MODULES


ELOJATEK = r"""<script>
/* próbaoldal: memóriabeli mentés (a gép valódi mentése érintetlen), néma felolvasás, látható animáció */
(function () {
  var m = {};
  var tar = { getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; },
    clear: function () { m = {}; }, key: function (i) { return Object.keys(m)[i] || null; },
    get length() { return Object.keys(m).length; } };
  try { Object.defineProperty(window, "localStorage", { value: tar, configurable: true }); } catch (e) {}
  try { speechSynthesis.speak = function () {}; } catch (e) {}
  window.SpeechRecognition = window.webkitSpeechRecognition = function () { this.start = function () {}; this.stop = this.abort = function () {}; };
  if (document.hidden) window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
})();
</script>
"""


def proba():
    # a proto két része: a rajzok (a main.js ELÉ, hogy az indításkor már éljenek) + a vezérlő (a main.js UTÁN)
    rajz, vezerlo = olvas(os.path.join(HERE, "terkep-kozpont-proto.js")).split("/* ══ VEZÉRLŐ ══ */", 1)
    js = ['(function () {\n"use strict";\n']
    for mod in modulok():
        if mod == "main.js":
            js.append(rajz + "\n")
        js.append(olvas(os.path.join(UC, "src", mod)) + "\n")
        if mod == "main.js":
            js.append(vezerlo + "\n")
    js.append("})();\n")
    js = "".join(js)
    h = olvas(os.path.join(UC, "index.html"))
    h = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda _: "<style>\n" + olvas(os.path.join(UC, "style.css")) + "\n</style>", h)
    h = re.sub(r'<script src="kert-hangok\.js[^"]*"></script>', lambda _: "<script>\n" + olvas(os.path.join(UC, "kert-hangok.js")) + "\n</script>", h)
    h = re.sub(r'<script src="tk-diszek\.js[^"]*"></script>', lambda _: "<script>\n" + olvas(os.path.join(UC, "tk-diszek.js")) + "\n</script>", h)
    h = re.sub(r'<script src="game\.js[^"]*"></script>', lambda _: ELOJATEK + "<script>\n" + js + "\n</script>", h)
    h = h.replace('href="../index.html"', 'href="#"')
    with open(PROBA, "w", encoding="utf-8", newline="\n") as f:
        f.write(h)


def lap():
    t = olvas(os.path.join(HERE, "terkep-kozpont-rajzterv.html"))
    fej = t.split("<body>", 1)[0]
    test = t.split("<main>", 1)[1].split("</main>", 1)[0]
    keretek = olvas(os.path.join(HERE, "terkep-kozpont-keretek.html"))
    # a próbaoldal BELE a lapba (egy fájl): a keretek blob-címről töltik, így dupla kattintással és előnézetben is megy
    import json
    beagy = json.dumps(olvas(PROBA)).replace("</", "<\\/")
    keretek += ('<script type="application/json" id="proba-oldal">' + beagy + '</script>\n<script>(function () {\n'
                '  var u = URL.createObjectURL(new Blob([JSON.parse(document.getElementById("proba-oldal").textContent)], { type: "text/html" }));\n'
                '  [].forEach.call(document.querySelectorAll("iframe[data-q]"), function (f) { f.src = u + "#" + f.getAttribute("data-q"); });\n'
                '})();</script>\n')
    with open(LAP, "w", encoding="utf-8", newline="\n") as f:
        f.write(fej + "<body>\n<main>\n" + test.replace("<!--KERETEK-->", keretek) + "\n</main>\n</body>\n</html>\n")


if __name__ == "__main__":
    proba()
    lap()
    print("kész:", PROBA, LAP)

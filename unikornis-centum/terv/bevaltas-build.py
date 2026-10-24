#!/usr/bin/env python3
"""bevaltas-build.py — a „Beváltás sárkánytűzzel” rajzterve a VALÓDI bolttal, unikornissal, lakókkal és kölyökkel.

Mit csinál: a terv/bevaltas-rajzterv.sablon.html-be (tervlap: terv/bevaltas-sarkanytuz-terv.html) beilleszti a munkapéldány src/ moduljait (constants, helpers,
renderer, figurak, lakok, szarv-varazs, bolt-kep, leny, sarkany-holmi) és a style.css-t, így a bolt képe, Tüske néni,
a róka, a gyerek unikornisa és a kölyök (kolyok-mozdul.js) pontosan úgy néz ki és mozog, mint a játékban. A tízes-keret, a tűz, a füstpöff és a „fuj” mozdulat
(vár, köszön, örül, gondol, mancs előre, visszatol), a besétálás, az erszény és a mancs a sablonban még PROTOTÍPUS —
a kódolás körében kerülnek át a src/-be (tervlap: terv/kissarkany-a-boltban-terv.html).

Használat:  python terv/kissarkany-bolt-build.py
Kimenet:    terv/bevaltas-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\bevaltas-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
js = lambda n: rd(os.path.join(SRC, "src", n)).replace("</script>", "<\\/script>")
MODULOK = ["constants.js", "helpers.js", "renderer.js", "figurak.js", "lakok.js", "szarv-varazs.js", "bolt-kep.js", "leny.js", "sarkany-holmi.js", "kolyok-mozdul.js"]
sablon = rd(os.path.join(HERE, "bevaltas-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__STYLE__*/</style>", "<style>" + rd(os.path.join(SRC, "style.css")) + "</style>")
           .replace("<script>/*__MODULOK__*/</script>", "".join("<script>" + js(n) + "</script>\n" for n in MODULOK)))
for dst in (os.path.join(HERE, "bevaltas-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\bevaltas-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

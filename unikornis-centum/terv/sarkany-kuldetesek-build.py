#!/usr/bin/env python3
"""sarkany-kuldetesek-build.py — a Sárkány-küldetések rajzterve a VALÓDI sárkány- és unikornis-rajzzal.

Mit csinál: a terv/sarkany-kuldetesek-rajzterv.sablon.html-be beilleszti a munkapéldány src/renderer.js-ét
(unikornis), src/leny.js-ét (kölyöksárkány, fészek, napozó szikla) és a style.css sárkány-mozgásait, így a
szereplők pontosan úgy néznek ki és mozognak, mint a játékban. A 12 sárkány-holmi (HOLMI tábla), az alvó fióka-póz,
a tábla és a kipróbálás-mozdulatok a sablonban még PROTOTÍPUS — a kódolás köreiben kerülnek át a
src/sarkany-holmi.js-be (tervlap: terv/sarkany-kuldetesek-rendszerterv.html).

Használat:  python terv/sarkany-kuldetesek-build.py
Kimenet:    terv/sarkany-kuldetesek-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\sarkany-kuldetesek-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
js = lambda n: rd(os.path.join(SRC, "src", n)).replace("</script>", "<\\/script>")
css = rd(os.path.join(SRC, "style.css"))
# a sárkány rétegeinek mozgása: a „🐣 A KIS LÉNY” blokk a style.css-ben (a .ln-hop soráig)
m = re.search(r"/\* ── 🐣 A KIS LÉNY[\s\S]*?@keyframes lnHop[^\n]*\n", css)
leny_css = m.group(0) if m else ""
leny_css += "".join(l + "\n" for l in css.splitlines() if l.startswith(".sarkany.kiser"))
# a LENYEK tábla (melyik unikornisnak milyen rajza van) a constants.js elejéről
lenyek = re.search(r"var LENYEK = \{[\s\S]*?\n\};\n", rd(os.path.join(SRC, "src", "constants.js"))).group(0)
sablon = rd(os.path.join(HERE, "sarkany-kuldetesek-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__LENY_CSS__*/</style>", "<style>" + leny_css + "</style>")
           .replace("<script>/*__RENDERER__*/</script>", "<script>" + lenyek + "</script><script>" + js("renderer.js") + "</script>")
           .replace("<script>/*__LENY__*/</script>", "<script>" + js("leny.js") + "</script>"))
for dst in (os.path.join(HERE, "sarkany-kuldetesek-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\sarkany-kuldetesek-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

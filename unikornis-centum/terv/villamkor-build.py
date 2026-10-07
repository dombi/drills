#!/usr/bin/env python3
r"""villamkor-build.py — a Villámkör rajzterve a VALÓDI unikornis-rajzzal (src/renderer.js).

Mit csinál: a terv/villamkor-rajzterv.sablon.html-be beilleszti a munkapéldány src/renderer.js-ét és a
style.css „életre keltés” blokkját (lebegés, pislogás, lengő sörény), így az unikornis pontosan úgy néz ki
és úgy ugrik/fordul/pörög, mint a játékban. A pálya, a nap-óra és az árnyék a sablonban még PROTOTÍPUS —
a kódolás körében kerül át a src/villam.js-be.

Használat:  python terv/villamkor-build.py
Kimenet:    terv/villamkor-rajzterv.html (repó) + C:\Users\Dombi-NyárádiGabriel\Matekos\villamkor-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment a játék mentésébe, nem szól (csak egy rövid csengés).
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js")).replace("</script>", "<\\/script>")
style = rd(os.path.join(SRC, "style.css"))
a = style.index("#szinpad .uni-elo,   #odu-szoba .uni-elo")
b = style.index("/* pálya: jó válasznál")
elo_css = style[a:b]
sablon = rd(os.path.join(HERE, "villamkor-rajzterv.sablon.html"))
h = sablon.replace("<script>/*__RENDERER__*/</script>", "<script>" + renderer + "</script>").replace("/*__ELO_CSS__*/", elo_css)
for dst in (os.path.join(HERE, "villamkor-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\villamkor-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

#!/usr/bin/env python3
"""ragyogas-karcsu-build.py — Ragyogás karcsúbb alkatának rajzterve a VALÓDI unikornis-rajzzal (src/renderer.js).

Mit csinál: a terv/ragyogas-karcsu-rajzterv.sablon.html-be beilleszti a munkapéldány src/renderer.js-ét és a
LENYEK táblát (src/constants.js), így Ragyogás pontosan úgy néz ki, mint a játékban. A karcsúsítás
(karcsuOldal / karcsuNezet) a sablonban még PROTOTÍPUS — a kódolás körében kerül át a renderer.js-be.

Használat:  python terv/ragyogas-karcsu-build.py
Kimenet:    terv/ragyogas-karcsu-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\ragyogas-karcsu-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js")).replace("</script>", "<\\/script>")
lenyek = re.search(r"var LENYEK = \{.*?\n\};", rd(os.path.join(SRC, "src", "constants.js")), re.S).group(0)
sablon = rd(os.path.join(HERE, "ragyogas-karcsu-rajzterv.sablon.html"))
h = sablon.replace("<script>/*__RENDERER__*/</script>",
                   "<script>window.P=function(){return{}};window.nyugiMod=function(){return false};" + lenyek +
                   "</script><script>" + renderer + "</script>")
for dst in (os.path.join(HERE, "ragyogas-karcsu-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\ragyogas-karcsu-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

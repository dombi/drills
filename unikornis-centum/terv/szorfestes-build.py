#!/usr/bin/env python3
"""szorfestes-build.py — a szőrfestés rajzterve a VALÓDI unikornis-rajzzal (src/renderer.js).

Mit csinál: a terv/szorfestes-rajzterv.sablon.html-be beilleszti a munkapéldány src/renderer.js-ét,
így a 3 unikornis pontosan úgy néz ki, mint a játékban. A szőrfesték-tábla (SZORFESTEKEK), a szorSzinek és a jel-szegély
a sablonban még PROTOTÍPUS — a kódolás körében kerül át a renderer.js-be.

Használat:  python terv/szorfestes-build.py
Kimenet:    terv/szorfestes-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\szorfestes-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js")).replace("</script>", "<\\/script>")
sablon = rd(os.path.join(HERE, "szorfestes-rajzterv.sablon.html"))
h = sablon.replace("<script>/*__RENDERER__*/</script>",
                   "<script>window.P=function(){return{}};</script><script>" + renderer + "</script>")
for dst in (os.path.join(HERE, "szorfestes-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\szorfestes-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

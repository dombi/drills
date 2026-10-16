#!/usr/bin/env python3
"""unikornis-fajtak-build.py — az Unikornis-fajták rajzterve a VALÓDI unikornis-rajzzal (src/renderer.js).

Mit csinál: a terv/unikornis-fajtak-rajzterv.sablon.html-be beilleszti a munkapéldány src/renderer.js-ét,
így a régi három unikornis pontosan úgy néz ki, mint a játékban. Éjfény, Vihar, az erős alkat, a határozott
szem, a taréj, a 7 kalandos holmi, a 8 festék és az örömmozdulatok a sablonban még PROTOTÍPUS — a kódolás
köreiben kerülnek át a renderer.js-be (tervlap: terv/unikornis-fajtak-rendszerterv.html).

Használat:  python terv/unikornis-fajtak-build.py
Kimenet:    terv/unikornis-fajtak-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\unikornis-fajtak-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
renderer = rd(os.path.join(SRC, "src", "renderer.js")).replace("</script>", "<\\/script>")
sablon = rd(os.path.join(HERE, "unikornis-fajtak-rajzterv.sablon.html"))
h = sablon.replace("<script>/*__RENDERER__*/</script>",
                   "<script>window.P=function(){return{}};window.nyugiMod=function(){return false};</script><script>" + renderer + "</script>")
for dst in (os.path.join(HERE, "unikornis-fajtak-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\unikornis-fajtak-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

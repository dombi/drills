#!/usr/bin/env python3
"""belepo-legelo-build.py — a Belépő legelő rajzterve a VALÓDI rajzokkal.

Mit csinál: a terv/belepo-legelo-rajzterv.sablon.html-be beilleszti a munkapéldány rajzoló kódját
(src/renderer.js: unikornis, alvás, fekvés, nyújtózás, járás, legelés · src/terkep.js: a táj színei, felhők ·
src/nyitokep.js: a rét, a cím, a fatábla, a buborék) és a style.css hozzájuk tartozó szabályait. Így a rét, a fatábla
és az unikornisok pontosan úgy néznek ki, mint a játékban; az új rajzok (csillámfelhő, „vár rád” jel, mély alvás,
kis kapu, lakat, a 9 kép) a sablonban még PROTOTÍPUSOK — a kódolás köreiben kerülnek át a src/-be
(tervlap: terv/belepo-legelo-rendszerterv.html, 9. pont).

Használat:  python terv/belepo-legelo-build.py
Kimenet:    terv/belepo-legelo-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\belepo-legelo-rajzterv.html
            (a chat csak a Matekos mappából nyit meg fájlt)

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
rd = lambda p: open(p, encoding="utf-8").read()
js = lambda n: rd(os.path.join(SRC, "src", n)).replace("</script>", "<\\/script>")


def blokkok(s):
    """a CSS legfelső szintű blokkjai: [(fejléc, belső), …]"""
    res, i = [], 0
    while True:
        j = s.find("{", i)
        if j < 0:
            return res
        d, k = 1, j + 1
        while d:
            d += {"{": 1, "}": -1}.get(s[k], 0)
            k += 1
        res.append((s[i:j].strip(), s[j + 1:k - 1]))
        i = k


MINTA = (".uni-", ".ucg", ".ny-", "uni-terep", ".fekszik")


def css_szur(css):
    """csak az unikornis- és nyitókép-szabályok + minden @keyframes (a lap többi részét nem bántja)"""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    ki = []
    for fej, bel in blokkok(css):
        if fej.startswith("@keyframes"):
            ki.append(fej + "{" + bel + "}")
        elif fej.startswith("@media"):
            b = [f + "{" + x + "}" for f, x in blokkok(bel) if f.startswith("@keyframes") or any(m in f for m in MINTA)]
            if b:
                ki.append(fej + "{" + "".join(b) + "}")
        elif not fej.startswith("@") and any(m in fej for m in MINTA):
            ki.append(fej + "{" + bel + "}")
    return "\n".join(ki)


konst = rd(os.path.join(SRC, "src", "constants.js"))
lenyek = re.search(r"var LENYEK = \{[\s\S]*?\n\};\n", konst).group(0) + re.search(r"var LENY_SORREND = .*\n", konst).group(0)
liget_nev = re.search(r"var LIGET_NEV = \{[\s\S]*?\};\n", rd(os.path.join(SRC, "src", "ui.js"))).group(0)
ELO = ("window.P = function () { return PSTUB; }; var PSTUB = { oltozet: null, kinezet: null, szalon: { nyitva: true } };\n"
       "var mentes = { leny: 'ragyogas', profilok: {} };\n"
       "function hangSzuszog() {} function hangGomb() {} function mondd() {} function tkLepcsoSVG() { return ''; }\n")
kod = ("<script>" + ELO + lenyek + liget_nev + "</script>" +
       "".join("<script>" + js(n) + "</script>" for n in ("helpers.js", "renderer.js", "terkep.js", "nyitokep.js")))
sablon = rd(os.path.join(HERE, "belepo-legelo-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__JATEK_CSS__*/</style>", "<style>" + css_szur(rd(os.path.join(SRC, "style.css"))) + "</style>")
           .replace("<script>/*__JATEK_JS__*/</script>", kod))
for dst in (os.path.join(HERE, "belepo-legelo-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\belepo-legelo-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

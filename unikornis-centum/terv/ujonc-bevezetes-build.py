#!/usr/bin/env python3
"""ujonc-bevezetes-build.py — az Újonc-bevezetés rajzterve a VALÓDI rajzokkal.

Mit csinál: a terv/ujonc-bevezetes-rajzterv.sablon.html-be beilleszti a munkapéldány rajzoló kódját
(src/renderer.js: unikornis, alvás, nyújtózás, járás · src/terkep.js: a ligettérkép · src/szalon.js +
src/bank.js + src/bagoly.js: az utca) és a style.css hozzájuk tartozó szabályait (unikornis-mozgás,
térkép, utca). Így a térkép, az utca és az unikornisok pontosan úgy néznek ki, mint a játékban; az új
rajzok (nyitókép, név-felhők, osztály-lufik, köd, spaletta, világítás) a sablonban még PROTOTÍPUSOK —
a kódolás köreiben kerülnek át a src/-be (tervlap: terv/ujonc-bevezetes-rendszerterv.html, 9. pont).

Használat:  python terv/ujonc-bevezetes-build.py
Kimenet:    terv/ujonc-bevezetes-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\ujonc-bevezetes-rajzterv.html
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


MINTA = (".uni-", ".ucg", ".u-", ".terkep-", ".utca-", "uni-terep")


def css_szur(css):
    """csak az unikornis-, térkép- és utca-szabályok + minden @keyframes (a lap többi részét nem bántja)"""
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
       "function hangSzuszog() {} function hangGomb() {} function tkLepcsoSVG() { return ''; }\n")
kod = ("<script>" + ELO + lenyek + liget_nev + "</script>" +
       "".join("<script>" + js(n) + "</script>" for n in ("helpers.js", "renderer.js", "terkep.js", "bagoly.js", "bank.js", "szalon.js")) +
       "<script>bankZarva = function () { return false; };</script>")
sablon = rd(os.path.join(HERE, "ujonc-bevezetes-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__JATEK_CSS__*/</style>", "<style>" + css_szur(rd(os.path.join(SRC, "style.css"))) + "</style>")
           .replace("<script>/*__JATEK_JS__*/</script>", kod))
for dst in (os.path.join(HERE, "ujonc-bevezetes-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\ujonc-bevezetes-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

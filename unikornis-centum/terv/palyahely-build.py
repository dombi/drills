#!/usr/bin/env python3
"""palyahely-build.py — a „Pálya-hely és tárgy-keret” rajzterve a VALÓDI rajzkészlettel.

Mit csinál: a terv/palyahely-rajzterv.sablon.html-be (tervlap: terv/palyahely-targykeret-terv.html ✅) beilleszti a
munkapéldány rajzoló kódját (src/renderer.js: unikornis · src/terkep.js: a térkép rajzkészlete, firka-szűrő, LT_DEFS ·
src/figurak.js + src/lakok.js: Tüske néni · src/vasar.js: a vásári sátor és háttér · src/piac.js: a Piactér házai)
és a style.css hozzájuk tartozó szabályait (unikornis-mozgás + a mai pálya-kártya, hogy a „MA” kép a valódi legyen).
A pálya-helyek (bódé, ház-jelek, gombaház), a jelek (cégér, zászló, lakat, cetli, csengő, kulcs, jel-tábla) és a
tárgy-keretek (fok, ablak, kavics, tábla, cetli) a sablonban még PROTOTÍPUSOK — a kódolás köreiben kerülnek át a
src/palyahely.js-be és a src/keret.js-be.

Használat:  python terv/palyahely-build.py
Kimenet:    terv/palyahely-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\palyahely-rajzterv.html
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


MINTA = (".uni-", ".ucg", "uni-terep", ".palya-kartya", ":root")


def css_szur(css):
    """csak az unikornis- és pálya-kártya-szabályok + minden @keyframes (a lap többi részét nem bántja)"""
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
ikonok = re.search(r"var PALYA_IKON = \{[\s\S]*?\n\};\n", konst).group(0)
liget_nev = re.search(r"var LIGET_NEV = \{[\s\S]*?\};",rd(os.path.join(SRC, "src", "ui.js"))).group(0)
ELO = ("window.P = function () { return PSTUB; }; var PSTUB = { oltozet: null, kinezet: null, szalon: { nyitva: true }, palyak: {}, piac: { haz: {} } };\n"
       "var mentes = { leny: 'ragyogas', profilok: {} };\n"
       "function hangSzuszog() {} function hangGomb() {} function mondd() {} function ment() {} function tkLepcsoSVG() { return ''; } var GEN = {}, FIGURA = {};\n")
kod = ("<script>" + ELO + lenyek + ikonok + liget_nev + "\n</script>\n" +
       "".join("<script>" + js(n) + "</script>\n" for n in ("helpers.js", "renderer.js", "figurak.js", "lakok.js", "terkep.js", "vasar.js", "piac.js")))
sablon = rd(os.path.join(HERE, "palyahely-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__JATEK_CSS__*/</style>", "<style>" + css_szur(rd(os.path.join(SRC, "style.css"))) + "</style>")
           .replace("<script>/*__JATEK_JS__*/</script>", kod))
for dst in (os.path.join(HERE, "palyahely-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\palyahely-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

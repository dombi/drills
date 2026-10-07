#!/usr/bin/env python3
"""mi-bujt-el-build.py — RAJZTERV a „Mi bújt el?” kártyához (terv/mi-bujt-el-terv.html, 1. kör).

Mit csinál: három változat egymás alatt (A levél · B bokor · C felhő), mindegyik a játék valódi
feladat-buborékában (style.css .bagoly-buborek / .k-nagy méretei), Egér Cincin a valódi rajzával
(src/figurak.js, változtatás nélkül beemelve). Gombok: Jó válasz / Rossz válasz / Újra, példa-választó
(7 + ? = 10 · ? − 5 = 8 · 37 + ? = 100 · ? × 6 = 42) és laptop/telefon méret.

Használat:  python terv/mi-bujt-el-build.py
Kimenet:    terv/mi-bujt-el-rajzterv.html  +  C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\mi-bujt-el-rajzterv.html

Biztonság: csak rajzol — nem tölti be a játékot, nem ment, nem szól.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = [os.path.join(HERE, "mi-bujt-el-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\mi-bujt-el-rajzterv.html"]


def olvas(ut):
    return open(os.path.join(SRC, ut), encoding="utf-8").read()


figurak = olvas("src/figurak.js")
const = olvas("src/constants.js")
cincin_sor = re.search(r"^\s*cincin:\s*\{[^\n]*\},?\s*$", const[const.index("var FIGURA = {"):], re.M).group(0).strip().rstrip(",")
style = olvas("style.css")
a = style.index("svg.fg{")
b = style.index("\n", style.index("@media (prefers-reduced-motion: reduce){ .fg-szem")) + 1
fg_css = style[a:b]

SABLON = open(os.path.join(HERE, "mi-bujt-el-rajzterv.sablon.html"), encoding="utf-8").read()
ki = (SABLON.replace("/*__FG_CSS__*/", fg_css)
            .replace("/*__FIGURA__*/", "var FIGURA = { " + cincin_sor + " };")
            .replace("/*__FIGURAK_JS__*/", figurak))
for d in DST:
    with open(d, "w", encoding="utf-8", newline="\n") as f:
        f.write(ki)
    print("kész:", d)

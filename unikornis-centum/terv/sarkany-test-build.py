#!/usr/bin/env python3
"""sarkany-test-build.py — a kissárkány „teste” (szemből és hátulról nézet + közös fordulás) rajzterve,
a VALÓDI sárkány-rajzzal.

Mit csinál: a terv/sarkany-test-rajzterv.sablon.html-be beilleszti a munkapéldány src/leny.js-ét (a sárkány
rajzolója), src/sarkany-holmi.js-ét (a 4 ruha oldalnézete) és a style.css sárkány-mozgásait, így az oldalnézet
pontosan olyan, mint a játékban. A szemből- és hátulról-nézet, a horgonypontok és a fordulás a sablonban még
PROTOTÍPUS — a kódolás köreiben kerülnek át a src/leny.js-be.

Használat:  python terv/sarkany-test-build.py
Kimenet:    terv/sarkany-test-rajzterv.html (repó) + C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\sarkany-test-rajzterv.html
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
sablon = rd(os.path.join(HERE, "sarkany-test-rajzterv.sablon.html"))
h = (sablon.replace("<style>/*__LENY_CSS__*/</style>", "<style>" + leny_css + "</style>")
           .replace("<script>/*__LENY__*/</script>", "<script>" + js("leny.js") + "</script><script>" + js("sarkany-holmi.js") + "</script>"))
for dst in (os.path.join(HERE, "sarkany-test-rajzterv.html"), r"C:\Users\Dombi-NyárádiGabriel\Matekos\sarkany-test-rajzterv.html"):
    open(dst, "w", encoding="utf-8", newline="\n").write(h)
    print("kesz:", dst, len(h), "bajt")

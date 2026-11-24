#!/usr/bin/env python3
"""figura-pillanatkep.py — a szereplők MAI rajza (src/figurak.js fgAlak, „vidam” arc) pillanatképként a terv/figurak-alak.json-ba.

Miért: a közelkép-rajzok (terv/kozelkep-export.py) a lakókat a játék saját figura-rajzával mutatják (Világkép 5. kör, 2026-11-24),
a Python viszont nem futtat JS-t. Ez a szkript a gépi próba láthatatlan Edge-jében (probacsapat/gepi/motor.py) lefuttatja a
figurak.js-t, és kiírja az egész alakos rajzokat (120×150-es rács, a talppont ~ (60,147)).
Ha a figurák rajza változik: futtasd újra, aztán a kozelkep-export.py-t.

Használat: py terv/figura-pillanatkep.py
"""
import json, os, sys

ITT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ITT)
sys.path.insert(0, os.path.join(REPO, "probacsapat", "gepi"))
import motor

KELL = ["mia", "kitti", "brekus", "cincin", "tas", "samu", "bence", "potyi", "juli", "kata", "pali", "cirmi", "bogyo", "brumi"]
js = open(os.path.join(REPO, "src", "figurak.js"), encoding="utf8").read()
kod = ("(function(){ var FIGURA = {};\n" + js + "\nvar ki = {}; " + json.dumps(KELL) +
       ".forEach(function (k) { ki[k] = fgAlak(FIG_RAJZ[k], 'vidam'); }); return JSON.stringify(ki); })()")
E = motor.Edge()
try:
    adat = json.loads(E.uj_lap().js(kod))
finally:
    E.leall()
cel = os.path.join(ITT, "figurak-alak.json")
json.dump(adat, open(cel, "w", encoding="utf8", newline="\n"), ensure_ascii=False, indent=0, sort_keys=True)
print("%d figura -> %s" % (len(adat), cel))

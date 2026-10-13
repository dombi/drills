"""🤖 Gépi próba — ② Méret-őr (terv/gepi-proba-terv.html).

Minden képernyőn (kepernyok.py) és pályatípusonként egy pályán, 4 méreten megnézi (meret.js):
kilóg-e fontos elem, levágja-e valami, takarja-e valami (pl. a feladatkártyát), görgethető-e oldalra.
A képernyőt egyszer nyitja meg, és ott váltja végig a 4 méretet. Képet csak ott készít, ahol baj van
(gepi-jelentesek\\kepek\\ — nem kerül a git-be); ezeket Claude nézi meg.
"""
import json, os, re
import indulas, kiskapu
from kepernyok import KEPERNYOK, MERET_KIVETEL

OR = "méret"
ITT = os.path.dirname(os.path.abspath(__file__))
MERET_JS = open(os.path.join(ITT, "meret.js"), encoding="utf-8").read()
MERETEK = [("kis laptop", 1280, 720, False), ("laptop", 1366, 768, False),
           ("tablet", 768, 1024, True), ("telefon", 375, 812, True)]
ALAP = (1366, 768)
KEP_MAX = 40          # ennyi képnél többet egy futás nem készít
FAJTA = {"kilog": "kilóg a képernyőből", "levagva": "le van vágva", "takarja": "eltakarja valami", "gorget": "oldalra görgethető"}


def _fajlnev(s):
    return re.sub(r"[^0-9A-Za-záéíóöőúüűÁÉÍÓÖŐÚÜŰ_-]+", "-", s).strip("-")[:50]


class Gyujto:
    """(fajta, hely, elem) → mely méreteken; a végén egy-egy sor a jelentésbe."""
    def __init__(self, kepmappa):
        self.t = {}; self.kepmappa = kepmappa; self.kepek = 0

    def merj(self, l, hely):
        for nev, w, h, mobil in MERETEK:
            l.meret(w, h, mobil); l.pihen(0.45)
            kiv = MERET_KIVETEL.get("*", []) + MERET_KIVETEL.get(hely, [])
            try: r = l.js(MERET_JS + "\nmeretVizsgal(%s)" % json.dumps(kiv)) or []
            except Exception as e: r = [{"f": "hiba", "e": "a mérő", "d": str(e)[:120]}]
            for x in r:
                k = (x["f"], hely, x["e"])
                self.t.setdefault(k, []).append((nev, w, h, x["d"]))
            if r and self.kepek < KEP_MAX:
                os.makedirs(self.kepmappa, exist_ok=True)
                fajl = os.path.join(self.kepmappa, "%s_%dx%d.png" % (_fajlnev(hely), w, h))
                try: l.kep(fajl); self.kepek += 1
                except Exception: pass
        l.meret(*ALAP); l.pihen(0.3)

    def jelent(self, J):
        for (f, hely, elem), hol in self.t.items():
            meretek = ", ".join(dict.fromkeys("%s %d×%d" % (n, w, h) for n, w, h, _ in hol))
            J.hiba(OR, "sarga", "meret:%s:%s:%s" % (f, hely, elem[:40]),
                   "%s — %s %s (%s)" % (hely, elem, FAJTA.get(f, f), meretek),
                   "; ".join("%d×%d: %s" % (w, h, d) for _, w, h, d in hol))


def illik(hol, *nevek):
    """hol: None = mindent nézünk; különben a nevek egyike tartalmazza valamelyik darabot."""
    return hol is None or any(h in n.lower() for h in hol for n in nevek if n)


def futtat(l, cim, J, tipusok, kepmappa, hol=None):
    G = Gyujto(kepmappa)
    t0 = len(l.hibak)
    l.meret(*ALAP)
    l.hol = "méret · Profilválasztó"
    l.betolt(cim); l.pihen(0.8)
    if illik(hol, "Profilválasztó"): G.merj(l, "Profilválasztó")
    indulas.profil_valaszt(l)
    db = 1
    for nev, lepesek, var, latszik in KEPERNYOK:
        if nev == "Profilválasztó" or not illik(hol, nev): continue
        l.hol = "méret · " + nev
        if not indulas.terkepre(l):
            l.betolt(cim); indulas.profil_valaszt(l)
        if all(indulas.lepes(l, lp) for lp in lepesek):
            l.pihen(0.3); G.merj(l, nev); db += 1
    # pályatípusonként egy pálya, az első feladatnál (beírós módban: a beíró-négyzet is látszik)
    kep = {}
    for pid, t in tipusok.items(): kep.setdefault(t, pid)
    for t, pid in sorted(kep.items()):
        if not illik(hol, pid, t, "pálya"): continue
        l.hol = "méret · " + pid
        indulas.terkepre(l)
        l.js(kiskapu.INDIT % json.dumps(pid))
        if l.varj("UC.J && UC.J.feladat && document.querySelector('#kepernyo-jatek.aktiv')", 10):
            l.pihen(1.2); G.merj(l, "Pálya: %s (%s)" % (pid, t)); db += 1
        l.katt("#jatek-haza"); l.varj("!document.querySelector('#kepernyo-jatek.aktiv')", 5); l.pihen(0.3)
    for h in l.hibak[t0:]:
        J.hiba(OR, "piros", "meret:konzol:%s:%s" % (h["hol"], h["szoveg"][:60]),
               "Konzolhiba (méret-próba) — %s: %s" % (h["hol"], h["szoveg"][:140]), h.get("verem", h["szoveg"])[:600])
    G.jelent(J)
    J.naplo.append("méret-őr: %d képernyő × %d méret, %d kép a hibás helyekről" % (db, len(MERETEK), G.kepek))

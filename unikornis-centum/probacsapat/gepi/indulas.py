"""🤖 Gépi próba — ① Indulás-őr (terv/gepi-proba-terv.html).

Friss böngésző, üres mentés → profilválasztó → minden képernyő egyszer (kepernyok.py), valódi kattintással.
Közben figyeli a konzolhibákat; a végén szól, ha van olyan képernyő, amit senki nem néz.
A pályák indítását (mind) a matek-őr végzi — annak a hibái is ide, a konzol-figyelőbe futnak be.
Vissza: a képernyők szövegei és az elhangzott mondatok (a szöveg-őrnek).
"""
import json, os
from kepernyok import KEPERNYOK, NEM_NEZI, VISSZA_GOMBOK

OR = "indulás"
# a képernyő látható szövege BLOKKONKÉNT (egy gomb, egy felirat, egy bekezdés = egy szöveg), hogy a szomszédos
# feliratok ne olvadjanak össze („Nagyobb lépés” + „Lépés visszafelé” ≠ dupla szó). A matek-őr is ezt használja.
BLOKK_JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "blokk.js"), encoding="utf-8").read()


def _terkepen(l):
    return l.aktiv() == "kepernyo-fomenu" and "Váltás" in (l.js("(document.getElementById('fomenu-vissza')||{}).textContent||''") or "")


# „hol állunk”: az aktív képernyő + a térkép/liget felirat + a nyitott lapok száma — fix várakozás helyett ennek a változását várjuk
ALLAPOT = ("[(document.querySelector('.kepernyo.aktiv')||{}).id, (document.getElementById('fomenu-vissza')||{}).textContent,"
           " [].filter.call(document.querySelectorAll('[id$=\"-fedo\"], #odu-lap, #odu-panel, #het-fuzet'),"
           " function(e){ return e.getClientRects().length > 0; }).length].join('|')")


def allapot(l):
    return l.js(ALLAPOT)


def terkepre(l):
    """A vissza-gombokkal fel a térképre (legfeljebb 6 lépés)."""
    for _ in range(6):
        if _terkepen(l): return True
        for v in VISSZA_GOMBOK:
            if v == "fomenu-vissza" and _terkepen(l): continue      # a térképen ez a „🦄 Váltás” → profilválasztó
            e = allapot(l)
            if l.katt("#" + v):
                l.varj(ALLAPOT + " !== " + json.dumps(e), 3); l.pihen(0.2)   # kivonulás-animáció
                break
        else:
            l.pihen(0.5)
    return _terkepen(l)


def profil_valaszt(l):
    l.katt("#profil-lista .profil-kartya", 1.0)
    return l.varj("document.querySelector('#kepernyo-fomenu.aktiv')", 5)


def szovegek_most(l, hol):
    """Az aktív képernyő látható szövege + az azóta elhangzott mondatok."""
    b = l.js(BLOKK_JS + "\nblokkSzovegek(document.querySelector('.kepernyo.aktiv'))") or []
    m = l.js("window.__mondatok.splice(0)") or []
    ki = [{"hol": hol + " · képernyő", "s": s, "hang": False} for s in b]
    return ki + [{"hol": hol + " · hang", "s": x, "hang": True} for x in m if x]


def lepes(l, lp):
    fajta, _, arg = lp.partition(":")
    if fajta == "hely":
        e = allapot(l)
        ok = l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"] .hb' % arg) or \
             l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"]' % arg)
        if ok: l.varj(ALLAPOT + " !== " + json.dumps(e), 5); l.pihen(0.4)   # az unikornis odasétál
        return ok
    if fajta == "katt":   # az odúban az unikornis előbb odasétál a tárgyhoz → a lap nyílását várjuk
        e = allapot(l); ok = l.katt(arg)
        if ok: l.varj(ALLAPOT + " !== " + json.dumps(e), 4); l.pihen(0.4)
        return ok
    if fajta == "nyom": return l.nyom(arg, 2.3, 1.0)        # a játék 2 mp-es nyomást vár
    if fajta == "js": l.js(arg); l.pihen(1.0); return True
    raise ValueError("ismeretlen lépés: " + lp)


def futtat(l, cim, jelentes):
    szovegek, latott = [], set()

    def konzol(tol, nev):
        for h in l.hibak[tol:]:
            jelentes.hiba(OR, "piros", "indulas:konzol:%s:%s" % (nev, h["szoveg"][:60]),
                          "Konzolhiba — %s: %s" % (nev, h["szoveg"][:140]), h.get("verem", h["szoveg"])[:600])

    l.hol = "Profilválasztó"
    l.betolt(cim)
    if l.js("localStorage.length") not in (0, 1):
        jelentes.naplo.append("⚠️ a mentés nem volt üres induláskor")
    l.pihen(0.8)
    for nev, lepesek, var, latszik in KEPERNYOK:
        tol = len(l.hibak); l.hol = nev
        if nev == "Profilválasztó":
            pass
        elif nev == "Térkép":
            profil_valaszt(l)
        else:
            if not terkepre(l):
                jelentes.hiba(OR, "sarga", "indulas:vissza:" + nev, "Nem jut vissza a térképre (%s előtt)" % nev, "aktív: %s" % l.aktiv())
                l.betolt(cim); profil_valaszt(l)
            ok = True
            for lp in lepesek:
                if not lepes(l, lp):
                    ok = False
                    jelentes.hiba(OR, "piros", "indulas:elem:" + nev, "Nem található / nem látszik, amire koppintani kell — %s" % nev, lp)
                    break
            if not ok:
                konzol(tol, nev); continue
        if var:
            if not l.varj("document.querySelector('#%s.aktiv')" % var, 6):
                jelentes.hiba(OR, "piros", "indulas:nyit:" + nev, "Nem nyílik meg: %s" % nev, "várt: %s, aktív: %s" % (var, l.aktiv()))
        if latszik and not l.js("[].some.call(document.querySelectorAll(%s), function(e){ return e.getClientRects().length > 0; })" % json.dumps(latszik)):
            jelentes.hiba(OR, "sarga", "indulas:latszik:" + nev, "Megnyílt, de nem látszik benne, aminek kéne — %s" % nev, latszik)
        l.pihen(0.3)
        a = l.aktiv()
        if a: latott.add(a)
        szovegek += szovegek_most(l, nev)
        konzol(tol, nev)
    jelentes.naplo.append("indulás-őr: %d képernyő bejárva" % len(KEPERNYOK))

    # lefedettség: van-e olyan képernyő, amit senki nem néz
    minden = l.js("[].map.call(document.querySelectorAll('.kepernyo[id]'), function(e){ return e.id; })") or []
    for k in minden:
        if k not in latott and k not in NEM_NEZI:
            jelentes.hiba(OR, "sarga", "indulas:lefedes:" + k, "Van olyan képernyő, amit a gépi próba nem néz: %s (kepernyok.py: új sor kell)" % k, "")
    terkepre(l)
    return szovegek

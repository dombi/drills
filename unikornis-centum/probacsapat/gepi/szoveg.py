"""🤖 Gépi próba — ④ Szöveg-őr (terv/gepi-proba-terv.html).

Bemenet: [{"hol": "…", "s": "…", "hang": bool}] — a matek-őr mintái (kép, felolvasás, tipp, megoldás)
és az indulás-őr képernyő-szövegei + elhangzott mondatai. Csak gépies hibát keres; hogy egy mondat érthető-e,
azt a lektor és az élő próba dönti el.
"""
import os, re

BETU = "a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ"
KERDOSZO = ("Hány", "Hányan", "Hányszor", "Hányadik", "Mennyi", "Mennyivel", "Mennyibe", "Melyik", "Mit", "Miért",
            "Mikor", "Hol", "Hova", "Hová", "Honnan", "Kit", "Kinek", "Hogyan", "Mekkora", "Milyen", "Meddig", "Kik")


def maganhangzos(szam):
    """A szám kiejtése magánhangzóval kezdődik-e (egy, öt, ötven…, ötszáz…, ezer…) → „az” kell elé."""
    s = szam.split(",")[0]
    return s == "1" or s.startswith("5") or (len(s) == 4 and s.startswith("1"))


NEVELO = re.compile(r"(?<![%s\d])(a|A|az|Az)\s+(\d{1,3}(?:[  ]\d{3})+|\d+(?:,\d+)?)(?![\d])" % BETU)
DUPLA = re.compile(r"(?<![%s])([%s]{2,})[ \t,:;]+\1(?![%s])" % (BETU, BETU, BETU), re.IGNORECASE)
GEPI = re.compile(r"undefined|NaN|\[object|\bnull\b|\$\{|\{[a-zA-Z_]+\}")
URES_HELY = re.compile(r"[%s]\s+[,.!;](?:\s|$)|„\s*”|\(\s*\)" % BETU)
MONDAT = re.compile(r"[^.!?]+[.!?]*")


def tiltott_minták(fajl):
    ki = []
    for sor in open(fajl, encoding="utf-8"):
        sor = sor.split("#", 1)[0].strip()
        if sor: ki.append(re.compile(sor, re.IGNORECASE))
    return ki


def futtat(szovegek, jelentes, gepi_mappa):
    tiltott = tiltott_minták(os.path.join(gepi_mappa, "tiltolista.txt"))
    OR = "szöveg"
    for t in szovegek:
        s, hol, hang = t["s"], t["hol"], t.get("hang")
        hely = hol.split(" · ")[0]
        pelda = "%s: „%s”" % (hol, s[:220])
        # névelő a szám előtt
        for m in NEVELO.finditer(s):
            nev, szam = m.group(1), m.group(2).replace(" ", "").replace(" ", "")
            kell = "az" if maganhangzos(szam) else "a"
            if nev.lower() != kell:
                jelentes.hiba(OR, "sarga", "szoveg:nevelo:%s:%s %s" % (hely, nev.lower(), szam[:1]),
                              "„%s %s” → „%s %s” — %s" % (nev, m.group(2), kell if nev.islower() else kell.capitalize(), m.group(2), hely), pelda)
        if "a(z)" in s or "A(z)" in s:
            jelentes.hiba(OR, "sarga", "szoveg:az-zarojel:" + hely, "„a(z)” a szövegben — " + hely, pelda)
        for m in DUPLA.finditer(s):
            jelentes.hiba(OR, "sarga", "szoveg:dupla:%s:%s" % (hely, m.group(1).lower()), "Dupla szó: „%s” — %s" % (m.group(0), hely), pelda)
        m = GEPI.search(s)
        if m:
            jelentes.hiba(OR, "piros", "szoveg:gepi:%s:%s" % (hely, m.group(0)), "„%s” a játék szövegében — %s" % (m.group(0), hely), pelda)
        m = URES_HELY.search(s)
        if m:
            jelentes.hiba(OR, "sarga", "szoveg:ures:" + hely, "Üresen maradt hely a mondatban — " + hely, pelda)
        for r in tiltott:
            m = r.search(s)
            if m:
                jelentes.hiba(OR, "sarga", "szoveg:tilos:%s:%s" % (hely, m.group(0).lower()),
                              "Tiltólistás szó: „%s” — %s" % (m.group(0), hely), pelda)
        for mondat in MONDAT.findall(s):
            mo = mondat.strip()
            if not mo: continue
            elso = re.split(r"[\s,:]", mo, 1)[0]
            if elso in KERDOSZO and not mo.endswith("?") and not mo.endswith(":") and mo[-1:] in ".!":
                jelentes.hiba(OR, "sarga", "szoveg:kerdojel:" + hely, "Kérdés kérdőjel nélkül — " + hely, "%s: „%s”" % (hol, mo[:160]))
            if hang and re.search(r"\d\.$", mo) and not re.search(r"\d\.\d", mo):
                jelentes.hiba(OR, "sarga", "szoveg:szampont:" + hely,
                              "Felolvasott mondat számra + pontra végződik (a felolvasó sorszámnak olvashatja) — " + hely,
                              "%s: „%s”" % (hol, mo[-120:]))
            if hang and len(mo.split()) > 28:
                jelentes.hiba(OR, "zold", "szoveg:hosszu:" + hely, "Nagyon hosszú mondat (> 28 szó) — " + hely, "%s: „%s”" % (hol, mo[:200]))
        if hang and "  " in s:
            jelentes.hiba(OR, "zold", "szoveg:szokoz:" + hely, "Dupla szóköz a felolvasott szövegben — " + hely, pelda)

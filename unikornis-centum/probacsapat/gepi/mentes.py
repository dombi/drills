"""🤖 Gépi próba — ⑥ Mentés-őr (terv/gepi-proba-terv.html; 3A: csak kitalált mentésekkel).

A játék évekig kíséri a gyereket, a mentése is évekig él. Az őr a gepi\\mentesek\\ kitalált „teli” mentéseit
(a játék régi változataival gyártva, mentes_gyarto.py) tölti be, és megnézi:
  1. betöltődik-e konzolhiba nélkül, és a térképig el lehet-e jutni;
  2. nem tűnt-e el semmi: minden, ami a régi mentésben megvolt (✨, 💧, ruha, bútor, dísz, jelvény, pálya, kert…),
     megvan-e ugyanúgy a betöltés után (a szándékos átalakítások a mentes.js ENGEDETT listájában, indokkal);
  3. mentés + újratöltés után is ugyanaz-e (nem nullázódik, nem duplázódik semmi — pl. Ragyogás-nullázás);
  4. ☁️ a felhőbe menő alak visszaalakítva ugyanaz-e, és a felhő-összefésülés nem veszít-e;
  5. a teli mentéssel a fő képernyők (odú, kert, bolt, szalon…) konzolhiba nélkül nyílnak-e.
Külön: friss (üres) mentés → kitalált vásárlások mindhárom unikornisnál → kétszeri újratöltés → megmaradt-e.
⚠️ Ami eltűnik vagy csökken: mindig 🔴 (a kulcs „mentes:” kezdetű).
A végén a mentést üríti (a többi őr üres mentéssel számol).
"""
import glob, json, os
import indulas

OR = "mentés"
ITT = os.path.dirname(os.path.abspath(__file__))
MO_JS = open(os.path.join(ITT, "mentes.js"), encoding="utf-8").read()
# a teli mentéssel bejárt képernyők (a kepernyok.py nevei): ahol a sok tárgy / jelvény / festék megjelenik
TELI_KEPERNYOK = ["Térkép", "Odú", "Odú: szekrény", "Odú: jelvények", "Odú: gyűjtemény", "Kert", "Kert: fészer", "Tény-kert",
                  "Utca: bolt", "Fodrászat", "Tündérbank"]


def mentesek():
    return sorted(glob.glob(os.path.join(ITT, "mentesek", "*.json")))


def betolt_mentessel(l, cim, m):
    """Üres lap → a mentés a localStorage-ba → újratöltés (a játék a betolt()-tel olvassa be, mint a gyerek gépén)."""
    l.betolt(cim)
    l.js("localStorage.clear(); localStorage.setItem('unikornis_centum_v1', %s)" % json.dumps(json.dumps(m)))
    l.betolt(cim); l.js(MO_JS)


def ujratolt(l, cim):
    l.betolt(cim); l.js(MO_JS)


def jelent_diff(J, kulcs_elo, nev, diffek, mit):
    """Egy sor egy hibafajta: a profil (ragyogas/tuz/…) és a tárgy-azonosító nélkül csoportosít (pl. „jelvenyek”,
    „oltozet.van”), a konkrét utak a példák közé kerülnek."""
    for d in diffek:
        suly = "piros" if d["fajta"] in ("eltunt", "csokkent", "nem jött meg") else "sarga"
        szo = {"eltunt": "eltűnt", "csokkent": "csökkent", "valtozott": "megváltozott", "nem jött meg": "nem jött meg"}[d["fajta"]]
        ut = d["ut"].split(".", 2)[2] if d["ut"].startswith("profilok.") and d["ut"].count(".") >= 2 else d["ut"]
        csop = ".".join(ut.split(".")[:2]) if ut.split(".")[0] in ("odu", "oltozet", "kert", "szalon", "kinezet", "tenyKert", "bank") else ut.split(".")[0]
        J.hiba(OR, suly, "mentes:%s:%s:%s" % (kulcs_elo, d["fajta"], csop), "MENTÉS: %s %s — %s" % (mit, szo, csop),
               "%s · %s: %s → %s" % (nev, d["ut"], d["regi"], d["uj"]))


def egy_mentes(l, cim, fajl, J, naplo, kepernyok):
    adat = json.load(open(fajl, encoding="utf-8"))
    nev = "%s mentés (%s)" % (adat["datum"], adat["commit"])
    m = adat["mentes"]
    t0 = len(l.hibak); l.hol = "mentés · " + nev
    betolt_mentessel(l, cim, m)
    # 1–2. betöltés: semmi nem tűnt el
    s1 = l.js("__MO.most()")
    jelent_diff(J, "betolt", nev, l.js("__MO.osszevet(%s, __MO.most())" % json.dumps(m)), "betöltés után")
    if not indulas.profil_valaszt(l):
        J.hiba(OR, "piros", "mentes:profil:" + adat["datum"], "MENTÉS: a régi mentéssel nem lehet profilt választani — " + nev, "aktív: %s" % l.aktiv())
    # 3. mentés + újratöltés (kétszer: az egyszeri átalakítások se fussanak le újra)
    for kor in (1, 2):
        l.belul("ment()"); ujratolt(l, cim)
        jelent_diff(J, "ujra", nev, l.js("__MO.osszevet(%s, __MO.most())" % json.dumps(s1)), "mentés + újratöltés után")
    # 4. felhő
    jelent_diff(J, "felho", nev, l.js("__MO.felhoKor()"), "a felhőbe menő alakból visszaalakítva")
    jelent_diff(J, "fesul", nev, l.js("__MO.felhoFesul()"), "felhő-összefésüléskor")
    # 5. képernyők a teli mentéssel
    if kepernyok:
        indulas.profil_valaszt(l)
        for knev, lepesek, var, _ in indulas.KEPERNYOK:
            if knev not in TELI_KEPERNYOK: continue
            k0 = len(l.hibak); l.hol = "mentés · %s · %s" % (adat["datum"], knev)
            if not indulas.terkepre(l): ujratolt(l, cim); indulas.profil_valaszt(l)
            ok = all(indulas.lepes(l, lp) for lp in lepesek)
            if ok and var and not l.varj("document.querySelector('#%s.aktiv')" % var, 6): ok = False
            if not ok:
                J.hiba(OR, "sarga", "mentes:kepernyo:" + knev, "A teli (régi) mentéssel nem nyílik meg: " + knev, "%s · aktív: %s" % (nev, l.aktiv()))
            l.pihen(0.3)
            for h in l.hibak[k0:]:
                J.hiba(OR, "piros", "mentes:konzol:%s:%s" % (knev, h["szoveg"][:60]), "Konzolhiba a teli (régi) mentéssel — %s: %s" % (knev, h["szoveg"][:140]),
                       "%s · %s" % (nev, h.get("verem", h["szoveg"])[:500]))
        indulas.terkepre(l)
    for h in l.hibak[t0:]:
        if h["hol"].startswith("mentés · " + nev):
            J.hiba(OR, "piros", "mentes:konzol:betolt:%s" % h["szoveg"][:60], "Konzolhiba a régi mentés betöltésekor: %s" % h["szoveg"][:140],
                   "%s · %s" % (nev, h.get("verem", h["szoveg"])[:500]))
    naplo.append("mentés-őr: %s — %s" % (nev, json.dumps(l.js("__MO.szamok(__MO.most())")["tuz"], ensure_ascii=False)))


# friss mentés: kitalált vásárlások mindhárom unikornisnál (a játék saját vásárló mezőivel), aztán kétszeri újratöltés
FRISS_VASAROL = """(function(){ LENY_SORREND.forEach(function(lk, i){ var p = mentes.profilok[lk];
  p.csillampor = 50 + i; p.tunderharmat = 7 + i; p.oltozet.van[RUHAK.fej[0].id] = 1; p.oltozet.fej = RUHAK.fej[0].id;
  p.odu.vanDisz[Object.keys(DISZ_TARGY)[0]] = 1; p.jelvenyek[JELVENYEK[0].id] = 1;
  p.palyak[PALYAK[0].id] = { kesz: true, rekordElsore: 4 }; });
  ment(); return true; })()"""


def friss(l, cim, J, naplo):
    l.hol = "mentés · friss"
    l.betolt(cim); l.js("localStorage.clear()"); ujratolt(l, cim)
    indulas.profil_valaszt(l)
    l.belul(FRISS_VASAROL)
    s1 = l.js("__MO.most()")
    for kor in (1, 2):
        ujratolt(l, cim)
        jelent_diff(J, "friss", "friss mentés, %d. újratöltés" % kor, l.js("__MO.osszevet(%s, __MO.most())" % json.dumps(s1)),
                    "friss (új gyerek) mentésnél újratöltés után")
        indulas.profil_valaszt(l)
    naplo.append("mentés-őr: friss mentés, 3 unikornis vásárlásai, 2 újratöltés — %s" %
                 json.dumps({k: v["✨"] for k, v in l.js("__MO.szamok(__MO.most())").items()}, ensure_ascii=False))


def futtat(l, cim, J, teljes=False):
    """Gyors: a legrégebbi és a legújabb mentés, képernyők nélkül; teljes: minden mentés, mindegyikkel a képernyők."""
    naplo = J.naplo
    L = mentesek()
    if not L:
        J.hiba(OR, "sarga", "mentes:nincs", "Nincs kitalált mentés a gepi\\mentesek mappában (mentes_gyarto.py)", ""); return
    valaszt = L if teljes else sorted({L[0], L[-1]})
    try:
        for f in valaszt:
            try:
                egy_mentes(l, cim, f, J, naplo, teljes)
            except Exception as e:
                J.hiba(OR, "sarga", "mentes:motor:" + os.path.basename(f), "A mentés-próba elakadt — " + os.path.basename(f), str(e)[:200])
        try:
            friss(l, cim, J, naplo)
        except Exception as e:
            J.hiba(OR, "sarga", "mentes:motor:friss", "A mentés-próba elakadt — friss mentés", str(e)[:200])
    finally:   # a többi őr üres mentéssel számol
        l.betolt(cim); l.js("localStorage.clear()"); l.betolt(cim)
    naplo.append("mentés-őr: %d kitalált mentés (%s)" % (len(valaszt), ", ".join(os.path.basename(f)[:10] for f in valaszt)))

"""🤖 Gépi próba — token nélküli ellenőrző program (terv: terv/gepi-proba-terv.html, ✅ 1A 2A 3A).

Használat (a drills mappából):
    py -3 unikornis-centum\\probacsapat\\gepi_proba.py            gyors próba (minden kód-kör után, commit előtt)
    py -3 unikornis-centum\\probacsapat\\gepi_proba.py --teljes   teljes próba (élesítés előtt)
    … --n 50          kevesebb feladat-minta pályánként (alap: 300)
    … --csak matek,szoveg   csak a megnevezett őrök (verzio, indulas, matek, szoveg)

A láthatatlan Edge üres, ideiglenes profillal fut, a felhő elzárva; semmi nem marad utána.
Kimenet: egy-két sor összegzés ide, a részletek a gepi-jelentesek\\ mappába.
Kilépési kód: 1, ha van új 🔴 hiba (a gepi\\ismert.txt-ben nem szereplő).

Az őrök (1. kód-kör): ① indulás · ③ matek · ④ szöveg · ⑦ verzió.
Még hátra: ② méret + ⑤ kiskapu (2. kör), ⑥ mentés + végigjátszás (3. kör).
"""
import argparse, os, sys, time

ITT = os.path.dirname(os.path.abspath(__file__))
GEPI = os.path.join(ITT, "gepi")
sys.path.insert(0, GEPI)
import motor, indulas, szoveg, verzio   # noqa: E402

OROK = ["verzio", "indulas", "matek", "szoveg"]


def main():
    ap = argparse.ArgumentParser(description="🤖 Gépi próba")
    ap.add_argument("--teljes", action="store_true", help="teljes próba (élesítés előtt)")
    ap.add_argument("--n", type=int, default=300, help="feladat-minta pályánként (alap: 300)")
    ap.add_argument("--csak", default="", help="vesszővel: " + ",".join(OROK))
    a = ap.parse_args()
    try: sys.stdout.reconfigure(encoding="utf-8")
    except Exception: pass
    fajta = "teljes" if a.teljes else "gyors"
    csak = set(x.strip() for x in a.csak.split(",") if x.strip()) or set(OROK)
    if csak != set(OROK): fajta += " (csak: %s)" % ", ".join(sorted(csak))
    t0 = time.time()
    J = motor.Jelentes(os.path.join(GEPI, "ismert.txt"))
    szovegek = []

    if "verzio" in csak:
        t = time.time(); verzio.futtat(motor.UC, J); J.naplo.append("verzió-őr: %.0f mp" % (time.time() - t))

    if csak & {"indulas", "matek", "szoveg"}:
        k = motor.Kiszolgalo(); e = None
        try:
            e = motor.Edge(); l = e.uj_lap(); l.meret(1366, 768)
            if "indulas" in csak or "szoveg" in csak:
                t = time.time(); szovegek += indulas.futtat(l, k.cim(), J)
                J.naplo.append("indulás-őr: %.0f mp" % (time.time() - t))
            if "matek" in csak or "szoveg" in csak:
                t = time.time(); tol = len(l.hibak)
                if "indulas" not in csak and "szoveg" not in csak: l.betolt(k.cim())
                kod = indulas.BLOKK_JS + "\n" + \
                      open(os.path.join(GEPI, "matek.js"), encoding="utf-8").read().replace("MATEK_N", str(a.n))
                r = l.js(kod)
                for h in r["hibak"]:
                    J.hiba("matek", h["suly"], h["kulcs"], h["szoveg"], h["pelda"])
                for h in l.hibak[tol:]:   # a pályák indítása közben jött konzolhibák
                    J.hiba("indulás", "piros", "indulas:konzol:%s:%s" % (h["hol"], h["szoveg"][:60]),
                           "Konzolhiba — %s: %s" % (h["hol"], h["szoveg"][:140]), h.get("verem", h["szoveg"])[:600])
                szovegek += r["szovegek"]
                J.naplo.append("matek-őr: %d pálya, %d feladat, %.0f mp" % (len(r["stat"]), sum(r["stat"].values()), time.time() - t))
        except Exception as hiba:
            J.hiba("motor", "piros", "motor:%s" % type(hiba).__name__, "A gépi próba maga akadt el: %s" % str(hiba)[:200], "")
        finally:
            if e: e.leall()
            k.leall()

    if "szoveg" in csak:
        t = time.time(); szoveg.futtat(szovegek, J, GEPI)
        J.naplo.append("szöveg-őr: %d szöveg, %.0f mp" % (len(szovegek), time.time() - t))

    ido = time.time() - t0
    mappa = os.path.join(ITT, "gepi-jelentesek"); os.makedirs(mappa, exist_ok=True)
    fajl = os.path.join(mappa, time.strftime("%Y-%m-%d_%H%M") + "_" + fajta.split()[0] + ("-resz" if "csak" in fajta else "") + ".md")
    if a.teljes: J.naplo.append("(1. kód-kör: a teljes még ugyanaz, mint a gyors; a ② méret, ⑤ kiskapu, ⑥ mentés a 2–3. körben jön)")
    with open(fajl, "w", encoding="utf-8", newline="\n") as f:
        f.write(J.markdown(fajta, ido))
    print(J.osszegzes(fajta))
    print("(%.0f mp · részletek: %s)" % (ido, os.path.relpath(fajl, os.path.dirname(motor.UC))))
    return 1 if any(t["suly"] == "piros" for t in J.uj()) else 0


if __name__ == "__main__":
    sys.exit(main())

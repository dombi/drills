"""🤖 Gépi próba — ⑥ mentés-gyártó: kitalált „teli” mentés a játék egy RÉGI változatával (3A döntés).

Használat (a drills mappából), egyszer egy-egy változatra — a kész mentés a gepi\\mentesek\\ mappába kerül (git-be is):
    py -3 unikornis-centum\\probacsapat\\gepi\\mentes_gyarto.py 2026-09-12        az aznapi utolsó változattal
    py -3 unikornis-centum\\probacsapat\\gepi\\mentes_gyarto.py 78feda8            egy commit-tal
    py -3 unikornis-centum\\probacsapat\\gepi\\mentes_gyarto.py HEAD               a mostanival

Menete: a régi változat (git archive) egy ideiglenes mappába → láthatatlan Edge → üres mentés → a mentes_tolto.js
a régi játék SAJÁT katalógusaiból „sokat játszott gyereket” tölt (minden ruha, bútor, dísz, jelvény, pálya…) →
a régi játék ment() függvénye írja a localStorage-ba → ezt mentjük el. Így a mentés pontosan olyan alakú,
amilyet akkor egy gyerek gépe tárolt. Valódi gyerekadat nem kerül bele.
"""
import json, os, re, shutil, subprocess, sys, tarfile, tempfile, io

ITT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ITT)
import motor, indulas   # noqa: E402

DRILLS = os.path.dirname(motor.UC)
MAPPA = os.path.join(ITT, "mentesek")


def git(*a):
    return subprocess.run(["git", "-C", DRILLS] + list(a), capture_output=True, check=True).stdout


def commit_keres(mi):
    if re.match(r"^\d{4}-\d{2}-\d{2}$", mi):
        c = git("rev-list", "-1", "--before=%s 23:59:59" % mi, "HEAD").decode().strip()
        if not c: raise SystemExit("nincs commit ezen a napon vagy előtte: " + mi)
        return c
    return git("rev-parse", mi).decode().strip()


def kicsomagol(commit, cel):
    tar = git("archive", "--format=tar", commit, "unikornis-centum")
    with tarfile.open(fileobj=io.BytesIO(tar)) as t:
        t.extractall(cel)
    return os.path.join(cel, "unikornis-centum")


def gyart(mi):
    commit = commit_keres(mi)
    datum = git("show", "-s", "--format=%ad", "--date=short", commit).decode().strip()
    tmp = tempfile.mkdtemp(prefix="uc-gyarto-")
    k = e = None
    try:
        mappa = kicsomagol(commit, tmp)
        k = motor.Kiszolgalo(mappa); e = motor.Edge(); l = e.uj_lap(); l.meret(1366, 768)
        l.betolt(k.cim(), "window.__GEPI_EVAL && __GEPI_EVAL('typeof mentes') === 'object'"); l.pihen(0.5)
        l.katt("#profil-lista .profil-kartya", 1.0)          # a régi változatban is létrehozza a mentést
        tolto = open(os.path.join(ITT, "mentes_tolto.js"), encoding="utf-8").read()
        szoveg = l.belul(tolto)
        if not szoveg: raise SystemExit("a régi játék nem írt mentést")
        m = json.loads(szoveg)
        m["ragyogasNulla20260906"] = 1   # 2026-09-06 óta minden valódi mentésben benne van (a régiekbe az akkori betöltés írta)
        if l.hibak: print("⚠️ konzolhibák a régi változatban:", [h["szoveg"][:100] for h in l.hibak[:3]])
    finally:
        if e: e.leall()
        if k: k.leall()
        shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(MAPPA, exist_ok=True)
    nev = "%s-%s.json" % (datum, commit[:7])
    with open(os.path.join(MAPPA, nev), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"leiras": "Kitalált teli mentés — a játék %s-i változatával (%s) gyártva, mentes_tolto.js" % (datum, commit[:7]),
                   "commit": commit[:7], "datum": datum, "mentes": m}, f, ensure_ascii=False, indent=1)
    p = m["profilok"]["ragyogas"]
    print("✅ %s — ✨ %s, ruha %d, jelvény %d, pálya %d, profil-mezők %d" % (nev, p.get("csillampor"), len((p.get("oltozet") or {}).get("van") or {}),
          len(p.get("jelvenyek") or {}), len(p.get("palyak") or {}), len(p)))


if __name__ == "__main__":
    try: sys.stdout.reconfigure(encoding="utf-8")
    except Exception: pass
    if len(sys.argv) < 2: raise SystemExit(__doc__)
    for mi in sys.argv[1:]:
        gyart(mi)

"""🤖 Gépi próba — ⑦ Verzió-őr (terv/gepi-proba-terv.html).

1. A game.js tényleg a friss src/ modulokból készült-e (a build.py osszerak()-ja, fájlírás nélkül),
   és minden src/*.js benne van-e a build listájában.
2. Ha egy betöltött fájl (game.js, style.css, …) változott, lépett-e a ?v= száma az index.html-ben —
   különben a gyerekek gépén a régi változat marad. Az alap: az a commit, amelyik a mostani ?v=-t bevezette.
"""
import importlib.util, os, re, subprocess

OR = "verzió"


def git(uc, *args):
    r = subprocess.run(["git"] + list(args), cwd=uc, capture_output=True, text=True, encoding="utf-8")
    return r.returncode, r.stdout.strip()


def futtat(uc, jelentes):
    # 1) a game.js a src/-ből
    spec = importlib.util.spec_from_file_location("uc_build", os.path.join(uc, "build.py"))
    build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)
    friss = build.osszerak()
    meglevo = open(os.path.join(uc, "game.js"), encoding="utf-8", newline="").read()
    if friss != meglevo:
        jelentes.hiba(OR, "piros", "verzio:build", "A game.js nem a mostani src/ modulokból készült — futtasd: py -3 build.py", "")
    kimaradt = sorted(set(f for f in os.listdir(os.path.join(uc, "src")) if f.endswith(".js")) - set(build.MODULES))
    for f in kimaradt:
        jelentes.hiba(OR, "sarga", "verzio:modul:" + f, "src/%s nincs a build.py listájában (nem kerül a játékba)" % f, "")

    # 2) ?v= léptetés
    index = open(os.path.join(uc, "index.html"), encoding="utf-8").read()
    for fajl, v in re.findall(r'(?:src|href)="([\w./-]+\.(?:js|css))\?v=([^"]+)"', index):
        minta = "%s?v=%s" % (fajl, v)
        _, c = git(uc, "log", "-n1", "--format=%H", "-S", minta, "--", "index.html")
        if not c:
            continue                                  # a ?v= még nincs commitolva → épp most léptettük
        kod, _ = git(uc, "diff", "--quiet", c, "--", fajl)
        if kod == 1:
            jelentes.hiba(OR, "sarga", "verzio:v:" + fajl,
                          "A %s változott, de a ?v= (%s) nem lépett — a gyerekek gépén a régi maradna" % (fajl, v),
                          "alap: %s" % c[:7])

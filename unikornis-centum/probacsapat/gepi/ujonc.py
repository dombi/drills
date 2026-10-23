"""🤖 Gépi próba — ⑨ Újonc-menet (Újonc-bevezetés 4. kör, terv/ujonc-bevezetes-rendszerterv.html 9. pont).

Egy új gyerek első két hete, minden osztállyal: üres mentés → az első perc (az osztály lufija) → 14 gyakorlós nap.
A napok a játék órájának eltolásával telnek (Date, minden betöltéskor — a játék nem tudja, hogy a gép siet).
Minden nap: belépés a nyitóképen → térkép-fotó → a mai pályák „végigjátszva” (palyaInditas mezői + palyaVege, a feladatok
nélkül: azokat a ⑥b nézi) → utca / odú, ha ott nyílt valami → esti fotó. Közben figyeli:
  • naponta legfeljebb 1 új dolog; a sárkány napján semmi más;
  • a térkép rajza egyezik-e a menettel (köd = alszik, fénykör = világít), és mindig van-e hova hívni;
  • kiskapu: alvó pálya nem indul, alvó ligetbe nem lehet belépni (valódi kattintás), felfelé csak a „megy” nyit;
  • 💧 rejtett zseb: a „harmat” napjáig se a pálya végén, se a fejlécen nem látszik, utána előkerül;
  • a pult ugyanazt a napot látja; konzolhiba nincs;
  • régi játékos (kitalált teli mentés): nála nincs menet, köd, rejtett harmat.
Külön menetek: 2. o. februárban (🎵 szorzótábla-vers), elakadás (2 kerülős kör → másnap oldalra nyílik), 3 kihagyott nap.
A napok táblázata a jelentés „Menet” részébe kerül (a producernek), az elhangzott mondatok a szöveg-őrhöz (és a lektorhoz).
Gyors próbában nem fut (≈ 8–10 perc); --teljes vagy --csak ujonc.
"""
import json, os
import motor, mentes

OR = "újonc-menet"
ITT = os.path.dirname(os.path.abspath(__file__))
UJ_JS = open(os.path.join(ITT, "ujonc.js"), encoding="utf-8").read()
NAPOK = 14
NAP_MS = 86400000
# a játék órája: a lap minden betöltésekor, a játék előtt — a sessionStorage-ból olvasott napnyi eltolással
ORA_JS = r"""(function(){ var k = +(sessionStorage.getItem('__gepi_eltol') || 0); if (!k) return; var D = Date, off = k * 86400000;
function ND(){ var a = [].slice.call(arguments); if (!(this instanceof ND)) return D(); if (!a.length) return new D(D.now() + off);
  return new (Function.prototype.bind.apply(D, [null].concat(a)))(); }
ND.prototype = D.prototype; ND.now = function(){ return D.now() + off; }; ND.UTC = D.UTC; ND.parse = D.parse; window.Date = ND; })();"""
# osztály → a menetek: (név, kezdő eltolás napban, extrák)
def menetek():
    import datetime
    ma = datetime.date.today()
    feb = datetime.date(ma.year + (1 if ma.month > 2 else 0), 2, 10)
    L = [("%d. o." % o, o, 0, {}) for o in range(1, 7)]
    L[0] = ("1. o. (3 nap kihagyás a 7. előtt)", 1, 0, {"kihagy": {7: 3}})
    L[1] = ("2. o. (elakadás az 5. napon)", 2, 0, {"elakad": 5})
    L.append(("2. o. februárban", 2, (feb - ma).days, {}))
    return L


def belep(l, o, elso):
    """A nyitókép / az első perc (az osztály lufija) → térkép."""
    if elso:
        if not l.varj("document.querySelector('#kepernyo-elsoperc.aktiv')", 8): return "nem az első perc jött üres mentéssel (%s)" % l.aktiv()
        l.katt("#elsoperc-szin .ny-mozgo", 0.3)
        if not l.varj("document.querySelector('#elsoperc-szin .ny-felho')", 8): return "nincs név-felhő"
        l.katt('#elsoperc-szin .ny-felho[data-i="0"]', 0.3)
        if not l.varj("document.querySelector('#elsoperc-szin .ny-lufi')", 8): return "nincs lufi"
        l.katt('#elsoperc-szin .ny-lufi[data-i="%d"]' % (o - 1), 0.3)
    else:
        if not l.varj("document.querySelector('#kepernyo-nyito.aktiv, #kepernyo-fomenu.aktiv')", 8): return "nem a nyitókép jött (%s)" % l.aktiv()
        if l.aktiv() == "kepernyo-nyito":
            l.legelo_valaszt()
    if not l.varj("document.querySelector('#kepernyo-fomenu.aktiv')", 12): return "nem jutott a térképre (%s)" % l.aktiv()
    l.pihen(1.6)   # séta, köd felszáll, bemutató mondat
    return ""


def hely(l, id, kepernyo):
    if not (l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"] .hb' % id) or l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"]' % id)):
        return False
    ok = l.varj("document.querySelector('#%s.aktiv')" % kepernyo, 6); l.pihen(1.4)
    return ok


LATSZIK = "[].some.call(document.querySelectorAll(%s), function(e){ return e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden'; })"


def odu_jelenet(l):
    """Az odúban, ami a sárkánnyal vár: a patakparti lelet „Hazavisszük!” gombja, a kikelés után a név — ahogy egy gyerek koppint."""
    for _ in range(3):
        if not l.varj(LATSZIK % json.dumps("#leny-haza, #leny-fedo .leny-nev"), 9): return
        if l.js(LATSZIK % json.dumps("#leny-fedo .leny-nev")): l.katt("#leny-fedo .leny-nev")
        else: l.katt("#leny-haza")
        l.pihen(1.2)


def terkepre(l):
    for _ in range(4):
        if l.js("!!document.querySelector('#kepernyo-fomenu.aktiv .terkep-hely')"): return True
        for v in ("vege-terkep", "utca-vissza", "odu-vissza", "kert-vissza", "fomenu-vissza"):
            if v == "fomenu-vissza" and "Váltás" in (l.js("(document.getElementById('fomenu-vissza')||{}).textContent||''") or ""): continue
            if l.katt("#" + v): l.pihen(1.2); break
    return l.js("!!document.querySelector('#kepernyo-fomenu.aktiv .terkep-hely')")


def egy_menet(e, J, nev, o, kezd, extra, szovegek, tabla):
    k = motor.Kiszolgalo(); l = None   # saját port = saját mentés (a többi őr lapjától független)
    try:
        l = e.uj_lap(); l.meret(1366, 768)
        l.parancs("Page.addScriptToEvaluateOnNewDocument", {"source": ORA_JS})
        cim = k.cim()
        l.betolt(cim); l.js("localStorage.clear(); sessionStorage.clear()")
        szunet, sorok, elozo = 0, [], None
        for n in range(1, NAPOK + 1):
            l.hol = "%s · %d. nap" % (nev, n)
            szunet += (extra.get("kihagy") or {}).get(n, 0)
            eltol = kezd + n - 1 + szunet
            l.js("sessionStorage.setItem('__gepi_eltol', %s)" % json.dumps(str(eltol)))
            t0 = len(l.hibak)
            l.betolt(cim)
            hiba = belep(l, o, n == 1)
            if hiba:
                J.hiba(OR, "piros", "ujonc:belep:%s" % ("elso" if n == 1 else "nap"), "ÚJONC: nem jut be a térképre — %s" % l.hol, hiba)
                break
            l.belul(UJ_JS)
            s = l.belul("__UJ.allapot()")
            if not s.get("menet"):
                J.hiba(OR, "piros", "ujonc:nincsmenet", "ÚJONC: az első perc után nem indult el a menet — %s" % nev, l.hol); break
            ellenoriz_reggel(l, J, nev, n, o, s)
            # a mai pályák
            jatszott = []
            cel = l.belul("__UJ.celok(2)")
            if not cel and not any(a == "vil" for a in s["lig"].values()):   # ahol csak a Bagolykönyvtár világít, azt a próba nem játssza (saját sorrend)
                J.hiba(OR, "sarga", "ujonc:nincscel", "ÚJONC: nincs ébren lévő, végig nem vitt pálya, ahova menni lehetne", l.hol)
            for i, pid in enumerate(cel):
                kerulo = extra.get("elakad") == n
                if kerulo and i == 0:   # elakadás: ugyanaz a pálya kétszer kerülővel
                    for _ in range(2):
                        l.belul("__UJ.jatszik(%s, true)" % json.dumps(pid)); l.pihen(0.6); terkepre(l)
                    jatszott.append(pid + " (2× kerülő)")
                    continue
                r = l.belul("__UJ.jatszik(%s, false)" % json.dumps(pid))
                if r == "zarva":
                    J.hiba(OR, "piros", "ujonc:celzarva", "ÚJONC: amire az unikornis hív, az zárva van", "%s: %s" % (l.hol, pid)); continue
                l.pihen(0.8)
                if s["nyilt"].get("harmat") is None and l.js("[].some.call(document.querySelectorAll('#kepernyo-vege .harmat-jel'), function(e){ return e.getClientRects().length > 0; })"):
                    J.hiba(OR, "piros", "ujonc:harmatvege", "ÚJONC: a 💧 a „harmat” napja előtt látszik a pálya végén", l.hol)
                szovegek += [{"hol": l.hol + " · hang", "s": x, "hang": True} for x in (l.js("window.__mondatok.splice(0)") or []) if x]
                jatszott.append(pid + (" (rövid)" if r == "rovid" else ""))
                terkepre(l); l.pihen(0.9)
            # ahol ma nyílt valami: utca / odú (a nyílás bemutatója ott hangzik el)
            s2 = l.belul("__UJ.allapot()")
            if s2["hely"].get("utca") != "alszik" and l.belul("nyitasUtcaVar() || !!nyitasBemutatKell('utca') || nyitasHely('utca') === 'ebred'"):
                if hely(l, "utca", "kepernyo-utca"): terkepre(l)
            # az odú: a gyerek naponta benéz (ott kel ki a tojás, ott röppen el a fióka, ott a heti kártya)
            if hely(l, "odu", "kepernyo-odu"):
                odu_jelenet(l); terkepre(l)
            l.pihen(1.0)
            szovegek += [{"hol": l.hol + " · hang", "s": x, "hang": True} for x in (l.js("window.__mondatok.splice(0)") or []) if x]
            s3 = l.belul("__UJ.allapot()")
            ellenoriz_este(l, J, nev, n, s, s3, elozo)
            for h in l.hibak[t0:]:
                J.hiba(OR, "piros", "ujonc:konzol:%s" % h["szoveg"][:60], "Konzolhiba az újonc-menetben — %s: %s" % (l.hol, h["szoveg"][:140]),
                       h.get("verem", h["szoveg"])[:600])
            sorok.append((n, eltol, s, s3, jatszott))
            elozo = s3
        if sorok and sorok[-1][3]["leny"] in (None, "tojas"):
            J.hiba(OR, "sarga", "ujonc:tojas", "ÚJONC: két hét alatt sem kelt ki a sárkány-tojás", nev)
        tabla.append((nev, sorok))
    finally:
        if l:
            try: l.js("localStorage.clear(); sessionStorage.clear()")
            except Exception: pass
        k.leall()


def ellenoriz_reggel(l, J, nev, n, o, s):
    hol = l.hol
    # térkép rajza = menet
    for id, a in s["lig"].items():
        d = s["dom"].get(id)
        if id not in s["van"]:   # a térképen nincs ilyen hely (a Fejtörő-hegy a liget-belsőből nyílik) → nem nézzük
            continue
        if (a == "alszik") != (d == "kod") or (a == "vil") != (d == "vil"):
            J.hiba(OR, "piros", "ujonc:dom:%s" % id, "ÚJONC: a térkép rajza nem egyezik a menettel (köd / fény)", "%s: %s — menet: %s, rajz: %s" % (hol, id, a, d))
    if not any(a == "vil" for a in s["lig"].values()):
        J.hiba(OR, "sarga", "ujonc:nincsvil", "ÚJONC: a térképen nem világít semmi (az unikornis nem hív sehova)", hol)
    if n == 1:
        for id in s["sor"]["vil"]:
            if s["lig"].get(id) != "vil":
                J.hiba(OR, "piros", "ujonc:elsonap:%s" % id, "ÚJONC: az első napon nem világít, aminek kéne", "%s: %s → %s" % (hol, id, s["lig"].get(id)))
        for id in s["sor"]["fel"]:   # a „vers”-liget (csak a vers ébren, pl. 2. o. februárban a Szorzós) nem számít ébrennek
            if s["alap"].get(id) not in ("alszik", "vers", None):
                J.hiba(OR, "piros", "ujonc:elsofel:%s" % id, "ÚJONC: az első napon ébren van egy magasabb liget", "%s: %s → %s" % (hol, id, s["lig"].get(id)))
        for id in s["sor"]["nyitva"]:
            if s["lig"].get(id) == "alszik":
                J.hiba(OR, "piros", "ujonc:elsonyitva:%s" % id, "ÚJONC: a nagyobbnak a könnyebb liget alszik (nyitva kéne)", "%s: %s" % (hol, id))
        if s["hely"].get("utca") != "alszik":
            J.hiba(OR, "sarga", "ujonc:utca1", "ÚJONC: az 1. napon az utca már az első pálya előtt ébren", hol)
        # valódi kattintás egy alvó ligetre: nem léphet be
        alvo = [id for id, a in s["lig"].items() if a == "alszik" and s["dom"].get(id) == "kod"]
        if alvo:
            l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"] .hb' % alvo[0]) or l.katt('#kepernyo-fomenu .terkep-hely[data-id="%s"]' % alvo[0])
            l.pihen(2.0)
            if not l.js("!!document.querySelector('#kepernyo-fomenu.aktiv .terkep-hely')") or l.js("[].some.call(document.querySelectorAll('#palya-racs .palya-kartya'), function(e){ return e.getClientRects().length > 0; })"):
                J.hiba(OR, "piros", "ujonc:kodbelep", "ÚJONC KISKAPU: ködös (alvó) ligetbe be lehet lépni", "%s: %s" % (hol, alvo[0]))
                terkepre(l)
            l.js("window.__mondatok.splice(0)")
    a = l.belul("__UJ.alvoNyitva()")
    if a:
        J.hiba(OR, "piros", "ujonc:alvonyitva", "ÚJONC KISKAPU: alvó pálya mégis indítható (palyaZarva hamis)", "%s: %s" % (hol, ", ".join(a[:8])))
    if s["rejtett"] != (s["nyilt"].get("harmat") is None):
        J.hiba(OR, "piros", "ujonc:rejtett", "ÚJONC: a 💧 rejtett zseb rossz napon rejt / mutat", "%s: rejtett=%s, harmat nyílt: %s" % (hol, s["rejtett"], s["nyilt"].get("harmat")))
    if s["rejtett"] and s["harmatLatszik"]:
        J.hiba(OR, "piros", "ujonc:harmatlatszik", "ÚJONC: a rejtett 💧 mégis látszik valahol a térképen", hol)
    if s["pult"]["nap"] != s["nap"]:
        J.hiba(OR, "sarga", "ujonc:pult", "ÚJONC: a pult más napot lát, mint a játék", "%s: játék %s, pult %s" % (hol, s["nap"], s["pult"]["nap"]))


def ellenoriz_este(l, J, nev, n, s, s3, elozo):
    hol = l.hol
    ujak = [k for k, v in s3["nyilt"].items() if v == s3["nap"]]
    if len(ujak) > 1:
        J.hiba(OR, "piros", "ujonc:egynap", "ÚJONC: egy napon több új dolog nyílt", "%s: %s" % (hol, ", ".join(ujak)))
    if s3["napok"].get(str(s3["nap"])) == "sarkany" and ujak:
        J.hiba(OR, "piros", "ujonc:sarkany", "ÚJONC: a sárkány napján más is nyílt", "%s: %s" % (hol, ", ".join(ujak)))
    # az elakadás miatt OLDALRA nyílt liget (1–3. o.: a mérés-ligetek) nem felfelé-lépés; a valóban magasabb ligetek száma
    # legfeljebb annyi, ahány liget „megy”
    fel_ebren = [id for id in s3["sor"]["fel"] if s3["alap"].get(id) not in ("alszik", "vers", None) and id not in s3["sor"]["oldal"]]
    if len(fel_ebren) > len(s3["fel"]):
        J.hiba(OR, "piros", "ujonc:felfele", "ÚJONC KISKAPU: felfelé több liget ébredt, mint ahány „megy”", "%s: ébren %s, megy %s" % (hol, fel_ebren, s3["fel"]))
    if s3["harmat"] < s["harmat"] or s3["csp"] < s["csp"]:
        J.hiba(OR, "piros", "ujonc:fogy", "ÚJONC: a nap végére kevesebb ✨/💧 lett (vásárlás nélkül)", "%s: ✨ %s→%s, 💧 %s→%s" % (hol, s["csp"], s3["csp"], s["harmat"], s3["harmat"]))
    if elozo:
        for k, v in elozo["nyilt"].items():
            if s3["nyilt"].get(k) is None:
                J.hiba(OR, "piros", "ujonc:visszaalszik", "ÚJONC: ami már kinyílt, visszaaludt", "%s: %s" % (hol, k))


def napi_sor(n, eltol, s, s3, jatszott):
    nyilt = s3["napok"].get(str(s3["nap"])) or "—"
    vil = [id for id, a in s3["lig"].items() if a == "vil"]
    ebren = [id for id, a in s3["lig"].items() if a in ("vil", "nyitva", "vers")]
    return "| %d | %s | %s | %s | %s | %s | %s | %s |" % (
        s3["nap"], "+%d" % eltol, nyilt, ", ".join(vil) or "—", len(ebren), ", ".join(jatszott) or "—",
        "%d ✨ · %d 💧%s" % (s3["csp"], s3["harmat"], " (rejtve)" if s3["rejtett"] else ""), s3["leny"] or "—")


def regi_jatekos(e, J):
    """Kitalált teli mentés (Lili/Fanni-féle): nála a menet nem indul el."""
    L = mentes.mentesek()
    if not L: return
    k = motor.Kiszolgalo(); l = None
    try:
        l = e.uj_lap(); l.meret(1366, 768); l.hol = "újonc-menet · régi játékos"
        cim = k.cim()
        m = json.load(open(L[-1], encoding="utf-8"))
        mentes.betolt_mentessel(l, cim, m)
        if l.aktiv() == "kepernyo-nyito": l.legelo_valaszt()
        l.varj("document.querySelector('#kepernyo-fomenu.aktiv')", 12); l.pihen(1.5)
        r = l.belul("[!!nyitasMenet(), document.body.classList.contains('harmat-rejtett'), document.querySelectorAll('#kepernyo-fomenu .terkep-hely.ny-kod').length,"
                    " nyitasRekordKeres(mentes.profilok) ? 1 : 0]")
        if any(r):
            J.hiba(OR, "piros", "ujonc:regi", "ÚJONC: egy régi játékosnál (teli mentés) elindult a menet / köd / rejtett harmat",
                   "%s: menet %s, rejtett 💧 %s, köd %s, rekord %s" % (os.path.basename(L[-1]), r[0], r[1], r[2], r[3]))
        J.naplo.append("újonc-menet: régi játékos (%s) — menet: %s" % (os.path.basename(L[-1]), "nincs ✓" if not any(r) else "VAN ✗"))
    finally:
        if l:
            try: l.js("localStorage.clear()")
            except Exception: pass
        k.leall()


def futtat(e, J):
    szovegek, tabla = [], []
    csak = [x.strip() for x in os.environ.get("GEPI_UJONC_CSAK", "").split(",") if x.strip()]   # pl. "3. o.,4. o." — csak ezek a menetek
    for nev, o, kezd, extra in menetek():
        if csak and not any(nev.startswith(c) for c in csak): continue
        try:
            egy_menet(e, J, nev, o, kezd, extra, szovegek, tabla)
        except Exception as h:
            J.hiba(OR, "sarga", "ujonc:motor:%s" % nev, "Az újonc-próba elakadt — %s" % nev, str(h)[:300])
    try: regi_jatekos(e, J)
    except Exception as h: J.hiba(OR, "sarga", "ujonc:motor:regi", "Az újonc-próba elakadt — régi játékos", str(h)[:300])
    for nev, sorok in tabla:
        J.naplo.append("újonc-menet **%s** — %d nap:\n\n| nap | óra | ma nyílt | világít | ébren (liget) | játszott | ✨ · 💧 | sárkány |\n|---|---|---|---|---|---|---|---|\n%s\n"
                       % (nev, len(sorok), "\n".join(napi_sor(*x) for x in sorok)))
    return szovegek

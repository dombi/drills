"""🤖 Gépi próba — ⑤ Kiskapu-őr (terv/gepi-proba-terv.html).

Pályatípusonként egy képviselőn (tipus.js), VALÓDI billentyűkkel és kattintással, ahogy egy kapkodó gyerek:
  • „4 Enter 4 Enter 4 Enter” → csak egy feladatot léphet, csak egyszer adhat ✨-t;
  • üres Enter, „alma”, 250, −3, 2,5 → nem léphet tovább, nem adhat jutalmat;
  • 5 rossz válasz egymás után → nem fagy le, nem ad jutalmat, utána a jó válasz még működik;
  • kilépés és visszalépés pálya közben → újraindul, nem omlik össze;
  • a „Tovább megoldás nélkül” gomb sima profilnál nem látszik.
Egyszer a futás alatt: újratöltés pálya közben (a ✨ se nem duplázódik, se nem vész el),
bolt és bank: dupla kattintás a vásárlásra / váltásra → csak egyszer von le.
⚠️ Ami megoldás nélkül ad jutalmat vagy haladást: mindig 🔴 (a kulcs „kiskapu:” kezdetű).
"""
import json, os
import indulas

OR = "kiskapu"
ITT = os.path.dirname(os.path.abspath(__file__))
KK_JS = open(os.path.join(ITT, "kiskapu.js"), encoding="utf-8").read()


def telepit(l):
    l.js(KK_JS)


def allapot(l):
    return l.js("__KK.allapot()")


def akadaly(l):
    """Ha a válasz előtt koppintás kell (🔎 kérdés-keret, vásár „Tovább ▶”), megkoppintja. True, ha volt ilyen."""
    s = l.js("window.__KK && __KK.akadaly()")
    if s and l.katt(s): l.pihen(0.6); return True
    return False


def kesz(l, mp=8):
    """Vár, amíg a játék választ vár (közben a keretre / Tovább gombra koppint, mint a gyerek)."""
    for _ in range(int(mp)):
        if l.varj("window.__KK && __KK.valaszKesz()", 1): return True
        akadaly(l)
    return l.varj("window.__KK && __KK.valaszKesz()", 0.5)


def fokusz_le(l):
    l.js("document.activeElement && document.activeElement.blur && document.activeElement.blur()")


def bevisz(l, h, dupla=False):
    """A helyes válasz bevitele valódi billentyűkkel / kattintással. dupla: ahogy a kapkodó gyerek (3× Enter, dupla katt)."""
    if h["mod"] == "gepel":
        fokusz_le(l)
        l.gombok(" ".join([h["sor"] + " Enter"] * (3 if dupla else 1)))
        l.pihen(0.3)
        if l.js("!!document.querySelector('#buborek-feladat .oe-keret')"):   # olvasó-polc: „előbb koppints a kérdésre”
            akadaly(l); fokusz_le(l); l.gombok(" ".join([h["sor"] + " Enter"] * (3 if dupla else 1)))
    elif h["mod"] == "felmond":   # a mezők között a fókusz ugrik: kapkodó, de emberi tempó (a gépi tempó a mezőváltást előzi)
        l.katt("#felmond-lista .felmond-sor.most .dob-be")
        l.gombok(h["sor"], 0.06)
        if dupla: l.gombok("Enter Enter Enter")
    elif h["mod"] == "mar":
        l.katt("#mar-h"); l.gombok(h["h"]); l.katt("#mar-m")
        l.gombok(h["m"] + (" Enter Enter Enter" if dupla else " Enter"))
    elif h["mod"] == "katt":
        for s in h["sel"]:
            (l.duplakatt if dupla and len(h["sel"]) == 1 else l.katt)(s); l.pihen(0.25)
    elif h["mod"] == "dobogo":
        dobogo_rak(l, h, h["lep"])
        (l.duplakatt if dupla else l.katt)(h["kesz"])
        l.pihen(0.3)
        if l.js("!!document.querySelector('#buborek-feladat .oe-keret')"):   # A5 (2026-10-18): a 🔎 „Mire felelsz?” a Kész gombnál kér
            akadaly(l); l.pihen(0.3); l.katt(h["kesz"])


def dobogo_rak(l, h, lepesek):
    """🏆 dobogó: tiszta tábla (↺), aztán szereplőnként két koppintás — a szereplő, majd a helye."""
    l.katt(h["ujra"]); l.pihen(0.15)
    for tok, hely in lepesek:
        l.katt(tok); l.katt(hely); l.pihen(0.1)


def rossz_bevitelek(h):
    """[(név, művelet)] — rossz / értelmetlen bevitel a feladat formája szerint."""
    if h["mod"] == "gepel":
        jo, ki = str(h["szam"]), []
        for nev, sor in (("üres Enter", "Enter"), ("„alma”", "a l m a Enter"), ("250", "2 5 0 Enter"),
                         ("−3", "- 3 Enter"), ("2,5", "2 , 5 Enter")):
            jegy = "".join(c for c in sor.replace("Enter", "") if c.isdigit())[:h["max"]]
            if jegy == jo: sor = " ".join(str(h["szam"] + 1)) + " Enter"
            ki.append((nev, ("gepel", sor)))
        return ki
    if h["mod"] == "felmond":
        return [("üres Enter", ("felmond", "Enter")), ("„alma”", ("felmond", "a l m a Enter")),
                ("csupa 9", ("felmond", "9 9 9 9 9 9 9 9 9"))]
    if h["mod"] == "mar":
        return [("üres Enter", ("mar", ("", "Enter"))), ("rossz hányados", ("mar", ("9 9", "9 9 Enter")))]
    if h["mod"] == "katt" and h.get("rossz"):
        return [("rossz kártya", ("katt", h["rossz"])), ("rossz kártya duplán", ("dupla", h["rossz"]))]
    if h["mod"] == "dobogo":
        ki = [("üres tábla + Kész", ("dobogo", (h, []))), ("félig rakott tábla + Kész", ("dobogo", (h, h["lep"][:1])))]
        if h.get("rossz"): ki.append(("két szereplő felcserélve + dupla Kész", ("dobogo2", (h, h["rossz"]))))
        return ki
    return []


def rossz_egy(l, mit):
    fajta, arg = mit
    if fajta == "gepel": fokusz_le(l); l.gombok(arg)
    elif fajta == "felmond": l.katt("#felmond-lista .felmond-sor.most .dob-be"); l.gombok(arg, 0.06)
    elif fajta == "mar":
        l.katt("#mar-h"); arg[0] and l.gombok(arg[0]); l.katt("#mar-m"); l.gombok(arg[1])
    elif fajta == "katt": l.katt(arg)
    elif fajta == "dupla": l.duplakatt(arg)
    elif fajta in ("dobogo", "dobogo2"):
        dobogo_rak(l, arg[0], arg[1]); (l.duplakatt if fajta == "dobogo2" else l.katt)(arg[0]["kesz"])


def haladt(a0, a1):
    """Kapott-e jutalmat / haladást a két állapot között (a ✨-t a futó pályán mérjük, a véletlen ajándék nem zavar)."""
    ok = []
    if a1["ossz"] > a0["ossz"]: ok.append("megoldottnak számolta (%d → %d)" % (a0["ossz"], a1["ossz"]))
    if a1["csilla"] > a0["csilla"]: ok.append("✨-t adott (+%d)" % (a1["csilla"] - a0["csilla"]))
    if a1["kesz"] > a0["kesz"] or a1["all"] > a0["all"]: ok.append("továbblépett")
    return ok


# pálya indítása a próbából: előtte az előző pálya esetleg nyitva maradt mozgóképe le (a gyerek kézzel nem tudna úgy
# pályát váltani, hogy az nyitva marad — a gépi UC.palyaInditas igen, és a réteg mindent eltakarna)
INDIT = "UC.mkBezar && UC.mkBezar(); UC.mentes.valaszmod = 'beiras'; UC.palyaInditas(%s)"


def indit(l, pid):
    l.js(INDIT % json.dumps(pid))
    return kesz(l, 12)


def egy_palya(l, pid, tipus, J, naplo):
    hol = "%s (%s)" % (pid, tipus)
    if not indit(l, pid):
        naplo.append("kiskapu: %s — nem jutott el a válaszadásig (más beviteli mód), kimarad" % hol); return
    if allapot(l)["tovabb"]:
        J.hiba(OR, "piros", "kiskapu:tovabb:" + pid, "KISKAPU: a „Tovább megoldás nélkül” gomb sima profilnál is látszik — " + hol, "")
    h = l.js("__KK.helyes()")
    if not h:
        naplo.append("kiskapu: %s — a helyes választ a gép nem tudja beadni, csak a kilépést nézi" % hol)
    else:
        # 1) kapkodó gyerek: a jó válasz háromszor gyorsan (dupla Enter / dupla koppintás)
        a0 = allapot(l); bevisz(l, h, dupla=True); l.pihen(2.5); a1 = allapot(l)
        d = a1["ossz"] - a0["ossz"]
        if d == 0:
            naplo.append("kiskapu: %s — a gép jó válasza nem ment át (%s), a dupla-Enter próba kimaradt" % (hol, h["mod"]))
        elif d > 1:
            J.hiba(OR, "piros", "kiskapu:dupla:" + pid, "KISKAPU: gyors ismétléssel (dupla Enter / dupla koppintás) több feladatot ad — " + hol,
                   "%d feladat, +%d ✨ egy válaszra" % (d, a1["csilla"] - a0["csilla"]))
        # 2) rossz / értelmetlen bevitel a következő feladaton
        if kesz(l, 15):
            h = l.js("__KK.helyes()") or h
            for nev, mit in rossz_bevitelek(h):
                if not kesz(l, 6): break
                a0 = allapot(l); rossz_egy(l, mit); l.pihen(0.8); a1 = allapot(l)
                k = haladt(a0, a1)
                if k: J.hiba(OR, "piros", "kiskapu:rossz:%s:%s" % (pid, nev), "KISKAPU: rossz bevitel (%s) után a játék %s — %s" % (nev, ", ".join(k), hol), "")
            # 3) öt rossz válasz egymás után: nem fagy le, nem ad jutalmat, utána a jó válasz működik
            h = l.js("__KK.helyes()") or h
            rossz = None
            if h["mod"] == "gepel": rossz = ("gepel", " ".join(str(h["szam"] + 1)) + " Enter")
            elif h["mod"] == "katt" and h.get("rossz"): rossz = ("katt", h["rossz"])
            elif h["mod"] == "felmond": rossz = ("felmond", "9 9 9 9 9 9 9 9 9")
            elif h["mod"] == "dobogo" and h.get("rossz"): rossz = ("dobogo", (h, h["rossz"]))
            if rossz:
                a0 = allapot(l)
                for _ in range(5):
                    kesz(l, 4); rossz_egy(l, rossz); l.pihen(0.9)
                a1 = allapot(l); k = haladt(a0, a1)
                if k: J.hiba(OR, "piros", "kiskapu:otrossz:" + pid, "KISKAPU: 5 rossz válasz után a játék %s — %s" % (", ".join(k), hol), "")
                if not kesz(l, 10):
                    J.hiba(OR, "sarga", "kiskapu:fagy:" + pid, "5 rossz válasz után nem vár újra választ (beragadt?) — " + hol, "aktív: %s" % allapot(l)["aktiv"])
                else:
                    a0 = allapot(l); bevisz(l, l.js("__KK.helyes()") or h); l.pihen(2.0); a1 = allapot(l)
                    if a1["ossz"] <= a0["ossz"]:
                        naplo.append("kiskapu: %s — 5 rossz után a gép jó válasza nem ment át (végigvezetés?)" % hol)
        else:
            J.hiba(OR, "sarga", "kiskapu:kov:" + pid, "Jó válasz után nem jön a következő feladat (15 mp) — " + hol, "aktív: %s" % allapot(l)["aktiv"])
    # 4) kilépés pálya közben, és vissza
    if not l.katt("#jatek-haza"):
        J.hiba(OR, "sarga", "kiskapu:haza:" + pid, "Pálya közben nem látszik a kilépő (haza) gomb — " + hol, ""); return
    l.varj("!document.querySelector('#kepernyo-jatek.aktiv')", 5); l.pihen(0.5)
    if not indit(l, pid):
        J.hiba(OR, "sarga", "kiskapu:vissza:" + pid, "Kilépés után a pálya nem indul újra — " + hol, "aktív: %s" % allapot(l)["aktiv"]); return
    a = allapot(l)   # (az olvasó-polc szándékosan ott folytatja, ahol abbahagyta: a feladatKesz maradhat — a jutalom nem)
    if a["ossz"] != 0 or a["csilla"] != 0:
        J.hiba(OR, "piros", "kiskapu:visszaszamol:" + pid, "KISKAPU: kilépés-visszalépés után a pálya megoldott feladattal / ✨-tal indul — " + hol, json.dumps(a))
    l.katt("#jatek-haza"); l.varj("!document.querySelector('#kepernyo-jatek.aktiv')", 5); l.pihen(0.3)


def ujratoltes(l, cim, pid, J, naplo):
    """Újratöltés pálya közben: a ✨ a mentésből jön vissza, se nem duplázódik, se nem vész el."""
    if not indit(l, pid): naplo.append("kiskapu: az újratöltés-próba kimaradt (%s nem indult)" % pid); return
    h = l.js("__KK.helyes()")
    if h: bevisz(l, h); l.pihen(1.5)
    leny = l.js("UC.mentes.leny")
    elotte = l.belul("[P().csillampor||0, P().tunderharmat||0]")
    l.betolt(cim); telepit(l)
    # ugyanannak az unikornisnak a mentését nézzük, akivel előtte játszott — a belépés előtt (2026-10-25: a próba eleje kikapcsolja
    # az újonc-menetet; ha a futásban még nincs végigvitt pálya, újratöltés után az „első perc” jön, és a belépés EGY MÁSIK unikornist
    # kap 0 ✨-tal — ez a próba műterméke volt, nem pénzvesztés; valódi gyereknél az első perc osztályt ad, így nem ismétlődik)
    utana = l.js("(function(p){ return p ? [p.csillampor||0, p.tunderharmat||0] : null; })(UC.mentes.profilok[%s])" % json.dumps(leny))
    if not indulas.profil_valaszt(l):
        J.hiba(OR, "piros", "kiskapu:ujratolt", "Pálya közbeni újratöltés után nem lehet profilt választani", ""); return
    if utana != elotte:
        J.hiba(OR, "piros", "kiskapu:ujratolt:penz", "KISKAPU: pálya közbeni újratöltés után megváltozott a ✨/💧 (előtte %s, utána %s)" % (elotte, utana), pid)
    if not indit(l, pid):
        J.hiba(OR, "sarga", "kiskapu:ujratolt:indul", "Pálya közbeni újratöltés után a pálya nem indul újra — " + pid, "")
    l.katt("#jatek-haza"); l.varj("!document.querySelector('#kepernyo-jatek.aktiv')", 5); l.pihen(0.3)
    naplo.append("kiskapu: újratöltés pálya közben (%s) — ✨/💧 előtte %s, utána %s" % (pid, elotte, utana))


def bolt(l, J, naplo):
    """Bolt: dupla kattintás a „Megveszem” gombra → csak egyszer von le; a drága tételnél a „Biztos?” ne ugorjon át."""
    l.belul("P().csillampor = 2000; P().tunderharmat = 2000")
    if not (indulas.terkepre(l) and indulas.lepes(l, "hely:utca") and indulas.lepes(l, "katt:#utca-bolt")):
        J.hiba(OR, "sarga", "kiskapu:bolt:nyit", "A bolt nem nyílik meg (kiskapu-próba)", ""); return
    l.js("[].forEach.call(document.querySelectorAll('.bolt-fogo[data-mit=\"valaszt\"]'), function(r,i){ r.setAttribute('data-gepi', i); })")
    n = l.js("document.querySelectorAll('[data-gepi]').length") or 0
    vett = {"olcso": False, "draga": False}
    ALL = ("(function(){ var k=boltKivalasztott(); if(!k) return null; var g=boltGombAllapot(k.cs,k.t,boltBirt(k.cs,k.t),boltAktiv(k.cs,k.t),boltPenz(k.cs,k.t)>=k.t.ar);"
           " return {id:k.t.id, ar:k.t.ar, szin:g.szin, penz:(P().csillampor||0)+(P().tunderharmat||0), biztos:BOLT_MEGEROSIT}; })()")
    for i in range(n):
        if all(vett.values()): break
        l.js("[].forEach.call(document.querySelectorAll('.bolt-fogo[data-mit=\"valaszt\"]'), function(r,i){ r.setAttribute('data-gepi', i); })")
        if not l.katt('[data-gepi="%d"]' % i): continue
        l.pihen(0.3); a = l.belul(ALL)
        if not a or a["szin"] != "vesz": continue
        fajta = "draga" if a["ar"] >= 60 else "olcso"
        if vett[fajta]: continue
        vett[fajta] = True
        l.duplakatt('.bolt-fogo[data-mit="gomb"]'); l.pihen(0.6); b = l.belul(ALL)
        if fajta == "draga":
            if b["penz"] < a["penz"]:
                J.hiba(OR, "sarga", "kiskapu:bolt:biztos", "A drága tételnél a „Biztos?” kérdést egy dupla koppintás átugorja (azonnal megveszi)",
                       "%s, ár %d" % (a["id"], a["ar"]))
            elif b["biztos"]:
                l.duplakatt('.bolt-fogo[data-mit="megerosit"]'); l.pihen(0.6); b = l.belul(ALL)
        levont = a["penz"] - b["penz"]
        if levont > a["ar"]:
            J.hiba(OR, "piros", "kiskapu:bolt:dupla", "KISKAPU: dupla kattintással a bolt kétszer von le", "%s: ár %d, levont %d" % (a["id"], a["ar"], levont))
        naplo.append("kiskapu: bolt, %s tétel (%s, %d) dupla kattintással — levont %d" % (fajta, a["id"], a["ar"], levont))
    if not any(vett.values()): naplo.append("kiskapu: a boltban nem talált megvehető tételt")
    indulas.terkepre(l)


def bank(l, J, naplo):
    """Bank: dupla kattintás az „Igen”-re → csak egyszer vált. A próba idejére a gép nyit egy váltást 5 ✨ áron."""
    vid = l.belul("(function(){ var v=bankValtasok()[0]; if(!v) return null; FELULIR.bank = {}; FELULIR.bank[v.id] = {ar:5}; P().csillampor = 500; return v.id; })()")
    if not vid: naplo.append("kiskapu: nincs bank-váltás, kimarad"); return
    try:
        if not (indulas.terkepre(l) and indulas.lepes(l, "hely:utca") and indulas.lepes(l, "katt:#utca-bank")):
            J.hiba(OR, "sarga", "kiskapu:bank:nyit", "A bank nem nyílik meg (kiskapu-próba)", ""); return
        PENZ = "[P().csillampor||0, P().tunderharmat||0]"
        a = l.belul(PENZ)
        l.duplakatt('.bank-valto[data-v="%s"]' % vid); l.pihen(0.4)
        if not l.duplakatt("#bank-igen"):
            naplo.append("kiskapu: a bankban nem jött fel az „Igen” ablak"); return
        l.pihen(0.8); b = l.belul(PENZ)
        if a[0] - b[0] > 5:
            J.hiba(OR, "piros", "kiskapu:bank:dupla", "KISKAPU: dupla kattintással a bank kétszer vált", "✨ %d → %d, 💧 %d → %d" % (a[0], b[0], a[1], b[1]))
        naplo.append("kiskapu: bank, dupla kattintás — ✨ %d → %d, 💧 %d → %d" % (a[0], b[0], a[1], b[1]))
    finally:
        l.belul("FELULIR.bank = {}")
        indulas.terkepre(l)


def kepviselok(tipusok, teljes, hol=()):
    """{típus: pálya}. Teljes: pályatípusonként egy; gyors: válaszformánként egy (beírás, felmondás, maradékos,
    koppintós kártya — a típuskulcs 2. tagja) + a --hol helyekre illő pályák (azok saját magukkal)."""
    ki, forma = {}, set()
    for pid, t in sorted(tipusok.items(), key=lambda x: x[1]):
        f = t.split("/")[1] if "/" in t else t
        if not teljes and f in forma: continue
        forma.add(f); ki.setdefault(t, pid)
    if not teljes:
        for pid, t in sorted(tipusok.items()):
            if any(h in pid.lower() or h in t.lower() for h in hol) and pid not in ki.values():
                ki[t + " · " + pid] = pid
    return ki


def futtat(l, cim, J, tipusok, teljes=False, hol=()):
    naplo = J.naplo
    tol = len(l.hibak)
    l.hol = "kiskapu"
    if not l.js("!!document.querySelector('#kepernyo-fomenu.aktiv')"):
        indulas.profil_valaszt(l)
    telepit(l)
    kep = kepviselok(tipusok, teljes, hol)

    def konzol(tol, nev):
        for h in l.hibak[tol:]:
            J.hiba(OR, "piros", "kiskapu:konzol:%s:%s" % (nev, h["szoveg"][:60]), "Konzolhiba (kiskapu-próba) — %s: %s" % (nev, h["szoveg"][:140]),
                   h.get("verem", h["szoveg"])[:600])

    elso_beiros = None
    for t, pid in sorted(kep.items()):
        t0 = len(l.hibak); l.hol = "kiskapu · " + pid
        try:
            egy_palya(l, pid, t, J, naplo)
        except Exception as e:
            J.hiba(OR, "sarga", "kiskapu:motor:" + pid, "A kiskapu-próba elakadt — %s (%s)" % (pid, t), str(e)[:200])
            try: l.katt("#jatek-haza"); l.pihen(0.5)
            except Exception: pass
        konzol(t0, pid)
        if elso_beiros is None and "/egyenkent" in t and "konyvtar" not in t and "vasar" not in t: elso_beiros = pid
    for nev, fv in (("bolt", lambda: bolt(l, J, naplo)), ("bank", lambda: bank(l, J, naplo)),
                    ("újratöltés", lambda: elso_beiros and ujratoltes(l, cim, elso_beiros, J, naplo))):
        t0 = len(l.hibak); l.hol = "kiskapu · " + nev
        try: fv()
        except Exception as e:
            J.hiba(OR, "sarga", "kiskapu:motor:" + nev, "A kiskapu-próba elakadt — " + nev, str(e)[:200])
        konzol(t0, nev)
    naplo.append("kiskapu-őr: %d pályatípus (%s)" % (len(kep), ", ".join(sorted(kep.values()))))

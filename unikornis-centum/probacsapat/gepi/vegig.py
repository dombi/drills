"""🤖 Gépi próba — ⑥b Végigjátszás (terv/gepi-proba-terv.html, 3. kód-kör).

A pályát a gép az elejétől a vége-képernyőig végigjátssza, valódi billentyűkkel és koppintással (a kiskapu-őr
kezeivel: kiskapu.js / kiskapu.py — egy közös modul), minden feladatra elsőre jó választ adva, kerülő nélkül. Megnézi:
  • eljut-e a vége-képernyőig (nem akad el, nem fagy le, nincs konzolhiba);
  • annyi ✨-t ad-e, amennyit a terv mond: a pálya „végig ≈ X ✨” értéke (palyaBecsultErtek) + a teljes ösvény
    záró bónusza (jutalom("palyavege"), 7.2) + a Mesterpróba ✨-a; a különbség okát (pl. a lánc-kérdések) is kiírja;
  • a vége-képernyő ugyanannyit mutat-e, amennyit a gyerek tényleg kapott;
  • a 💧: 1 + 1 (teljes ösvény) + a napi kiemelt / ajánlott pálya extrája;
  • a pálya „kész” és arany lett-e, és újratöltés után is az maradt-e (mentés).
Gyors: egy rövid pálya + a --hol helyek pályái. Teljes: pályatípusonként egy (tipus.js — mint a ⑤), + a --hol pályái;
a ✨-terv képletből jön (palyaBecsultErtek, jutalom), így egy típus egy pályája az egész típusért beszél.
A vége-képernyő szövegei a szöveg-őrhöz mennek.
"""
import json
import indulas, kiskapu

OR = "végigjátszás"
VEGE = "!!document.querySelector('#kepernyo-vege.aktiv')"
GYORS_PALYA = "oszkiv-10"   # a gyors próba füstpróbája: rövid, beírós pálya
TEMPO = 5                   # a végigjátszás alatt a játék várakozásai (setTimeout) ennyiszer rövidebbek — a sorrend nem változik,
                            # csak a gép nem várja ki minden dicséret és séta teljes idejét (a kiskapu-őr valódi tempóval megy)
GYORSIT = ("(function(t){ if (!window.__GEPI_ST) { window.__GEPI_ST = window.setTimeout;"
           " window.setTimeout = function(f, ms){ var a = [].slice.call(arguments); a[1] = (+ms || 0) / (window.__GEPI_TEMPO || 1); return __GEPI_ST.apply(window, a); }; }"
           " window.__GEPI_TEMPO = t; })(%s)")

# a pálya induló állapota + a várt 💧 (a játék saját függvényeivel számolva, a pálya ELŐTT — a napi kiemelt egyszer jár)
ELOTTE = ("(function(pa){ var nk = P().napiKiemelt || {}, napi = pa.id === napiKiemeltId() && !(nk.datum === napiKiemeltMa() && nk.teljesitve);"
          " return { csp: P().csillampor || 0, harmat: P().tunderharmat || 0, vartHarmat: 2 + (napi ? NAPI_KIEMELT_HARMAT : 0)"
          " + (palyaAjanlott(pa) ? AJANLOTT_HARMAT : 0), becsult: palyaBecsultErtek(pa), zaro: jutalom('palyavege', pa),"
          " mester: (pa.polc || pa.szerszam) && /mester/.test(pa.id) ? EK_MESTER_CSILLA : 0 }; })(PALYAK.filter(function(p){ return p.id === %s; })[0])")
UTANA = ("(function(){ var pr = P().palyak[J.palya.id] || {};"
         " return { csilla: J.futoCsilla, ossz: J.futoOssz, elsore: J.futoElsore, kesz: J.feladatKesz, csp: P().csillampor || 0,"
         " harmat: P().tunderharmat || 0, prKesz: !!pr.kesz, prArany: !!pr.arany,"
         " szoveg: document.getElementById('kepernyo-vege').textContent.replace(/\\s+/g, ' ').trim() }; })()")


def jatszik(l, pid, mp=240):
    """Végigjátssza: válasz, ha a játék vár; koppintás, ha valami „Tovább”-ot kér. Vissza: (eljutott-e, válaszok száma, megjegyzés)."""
    if not kiskapu.indit(l, pid): return False, 0, "nem jutott el az első válaszig"
    lepes, ures = 0, 0
    t0 = l.js("Date.now()")
    while l.js("Date.now()") - t0 < mp * 1000:
        if l.js(VEGE): return True, lepes, ""
        if not l.varj("window.__KK && __KK.valaszKesz() || " + VEGE, 1.5):
            if not kiskapu.akadaly(l):
                ures += 1
                if ures > 8: return False, lepes, "elakadt (12 mp-ig se kérdés, se Tovább) — %s" % json.dumps(kiskapu.allapot(l), ensure_ascii=False)
            continue
        if l.js(VEGE): return True, lepes, ""
        ures = 0
        h = l.js("__KK.helyes()")
        if not h: return False, lepes, "a gép nem tudja megválaszolni ezt a feladatot (%s)" % kiskapu.allapot(l).get("csalad")
        elotte = kiskapu.allapot(l)["ossz"]
        kiskapu.bevisz(l, h); lepes += 1
        l.varj("window.__KK && __KK.allapot().ossz > %d || %s" % (elotte, VEGE), 3)
    return False, lepes, "nem ért véget %d mp alatt" % mp


def egy_palya(l, cim, pid, J, naplo, szovegek, ujratoltessel):
    l.hol = "végigjátszás · " + pid
    l.js(GYORSIT % TEMPO)
    t0 = len(l.hibak)
    e = l.belul(ELOTTE % json.dumps(pid))
    ok, lepes, megj = jatszik(l, pid)
    for h in l.hibak[t0:]:
        J.hiba(OR, "piros", "vegig:konzol:%s:%s" % (pid, h["szoveg"][:60]), "Konzolhiba végigjátszás közben — %s: %s" % (pid, h["szoveg"][:140]),
               h.get("verem", h["szoveg"])[:600])
    if not ok:
        J.hiba(OR, "piros", "vegig:elakad:" + pid, "VÉGIGJÁTSZÁS: a pálya nem jut el a vége-képernyőig — " + pid, "%d válasz után: %s" % (lepes, megj))
        l.js(GYORSIT % 1)
        try: l.katt("#jatek-haza"); l.pihen(0.5)
        except Exception: pass
        return
    l.pihen(0.6)
    u = l.belul(UTANA)
    vart = e["becsult"] + e["zaro"] + e["mester"]
    if u["csilla"] != vart:
        lanc = u["ossz"] - u["kesz"]
        ok_ = "; a különbség a lánc-kérdésekből jöhet (%d válasz, %d feladat-pötty)" % (u["ossz"], u["kesz"]) if lanc > 0 else ""
        J.hiba(OR, "sarga" if abs(u["csilla"] - vart) <= max(10, vart // 3) else "piros", "vegig:csilla:" + pid,
               "VÉGIGJÁTSZÁS: a pálya másik ✨-t ad, mint amennyit a terv mond — " + pid,
               "terv: %d (kártya „végig ≈ %d” + teljes ösvény %d%s), kapott: %d%s" % (vart, e["becsult"], e["zaro"],
               " + Mesterpróba %d" % e["mester"] if e["mester"] else "", u["csilla"], ok_))
    if u["csp"] - e["csp"] < u["csilla"]:
        J.hiba(OR, "piros", "vegig:csp:" + pid, "VÉGIGJÁTSZÁS: a ✨-számláló kevesebbet nőtt, mint amennyit a pálya kiírt — " + pid,
               "kiírt %d, a számláló %d → %d" % (u["csilla"], e["csp"], u["csp"]))
    if u["harmat"] - e["harmat"] != e["vartHarmat"]:
        J.hiba(OR, "sarga", "vegig:harmat:" + pid, "VÉGIGJÁTSZÁS: a pálya végén másik 💧 jár, mint a terv szerint — " + pid,
               "várt +%d, kapott +%d" % (e["vartHarmat"], u["harmat"] - e["harmat"]))
    if str(u["csilla"]) not in u["szoveg"]:
        J.hiba(OR, "sarga", "vegig:kiir:" + pid, "VÉGIGJÁTSZÁS: a vége-képernyő nem mutatja, hány ✨-t gyűjtött — " + pid, u["szoveg"][:200])
    if not u["prKesz"] or not u["prArany"]:
        J.hiba(OR, "piros", "vegig:kesz:" + pid, "VÉGIGJÁTSZÁS: kerülő nélkül végigjátszva a pálya nem lett kész / arany — " + pid,
               "kész: %s, arany: %s" % (u["prKesz"], u["prArany"]))
    szovegek += indulas.szovegek_most(l, "Vége-képernyő · " + pid)
    naplo.append("végigjátszás: %s — %d válasz, ✨ %d (terv %d), 💧 +%d" % (pid, lepes, u["csilla"], vart, u["harmat"] - e["harmat"]))
    l.js(GYORSIT % 1)
    if ujratoltessel:   # a végigjátszás eredménye a mentésben is megmarad-e
        csp = u["csp"]; l.betolt(cim); kiskapu.telepit(l); indulas.profil_valaszt(l)
        v = l.belul("[P().csillampor || 0, !!(P().palyak[%s] || {}).kesz, !!(P().palyak[%s] || {}).arany]" % (json.dumps(pid), json.dumps(pid)))
        if v != [csp, True, True]:
            J.hiba(OR, "piros", "vegig:mentes:" + pid, "VÉGIGJÁTSZÁS: újratöltés után elveszett a pálya eredménye — " + pid,
                   "előtte ✨ %d, kész, arany · utána ✨ %d, kész %s, arany %s" % (csp, v[0], v[1], v[2]))
    else:
        l.katt("#vege-terkep"); l.pihen(0.4)


def palyak(tipusok, teljes, hol):
    if teljes:   # pályatípusonként egy (a legelső id szerint), mint a kiskapu-őr teljes próbája
        ki = sorted({t: pid for pid, t in sorted(tipusok.items(), reverse=True)}.values())
    else:
        ki = [GYORS_PALYA] if GYORS_PALYA in tipusok else sorted(tipusok)[:1]
    for pid, t in sorted(tipusok.items()):
        if any(h in pid.lower() or h in t.lower() for h in hol) and pid not in ki: ki.append(pid)
    return ki


def futtat(l, cim, J, tipusok, teljes=False, hol=()):
    szovegek = []
    if not l.js("!!document.querySelector('#kepernyo-fomenu.aktiv')"): indulas.profil_valaszt(l)
    kiskapu.telepit(l)
    L = palyak(tipusok or {}, teljes, hol)
    for i, pid in enumerate(L):
        try:
            egy_palya(l, cim, pid, J, J.naplo, szovegek, i == 0)
        except Exception as e:
            J.hiba(OR, "sarga", "vegig:motor:" + pid, "A végigjátszás-próba elakadt — " + pid, str(e)[:200])
            try: l.js(GYORSIT % 1)
            except Exception: pass
            try: l.betolt(cim); kiskapu.telepit(l); indulas.profil_valaszt(l)
            except Exception: pass
    indulas.terkepre(l)
    J.naplo.append("végigjátszás: %d pálya" % len(L))
    return szovegek

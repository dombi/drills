#!/usr/bin/env python3
"""build.py — src/ modulok összefűzése IIFE-be → game.js.

Használat: python build.py
A game.js a build után is egyetlen fájl marad (a böngésző azt tölti).
A forráskód a src/ alatt él.

A SORREND KÖTÖTT: az eredeti game.js szekció-sorrendjét tükrözi.
A var-inicializálások és a load-time kód (pl. SZOTAR IIFE, speechSynthesis
onvoiceschanged, 11. szekció betolt()) egymásra épülnek — ne rendezd át!
"""
import os, sys

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "game.js")

MODULES = [
    # ── Adatok ──
    "constants.js",       # 1) PALYAK, LENYEK, paletta, ikon SVG-k
    "receptek.js",        # 1b) 🧱 pálya-receptek: RECEPT() → a PALYAK-ba (az új pályák egy rövid adatsorból; első: 🏡 Számcsalád)

    # ── Segédek ──
    "helpers.js",         # 2) $, el, veletlen, szo(), szamokKinyer()

    # ── Motor (1/2) ──
    "engine-gen.js",      # 3) feladatgenerátor
    "teny.js",            # 3b) 🌸 tény-motor: tény-kulcsok, rejtett óra, doboz-szabály, választó, kert-összegzés
    "bujocska.js",        # 3d) 🌿 Mi bújt el?: a bújócska-pályák generátora (GEN.hianyzo) — a feladat-alak a feladatHianyzo (engine-gen.js)
    "bolt.js",            # 3h) 🏪 Tüske néni boltja: tallér-modell, ① Fizesd ki ② Visszajáró ③ 🦊 Róka blokkja — feladatgyártó + ellenőrző, kép nélkül (P().roka)
    "szamkor100.js",      # 3i) 🪜🏡⚙️ a 100-as kör új pályái: Rokon-létra, „melyik segít?”, Számcsalád (+ kakukktojás), Varázsgép — kép nélkül
    "villam.js",          # 3e) ⚡ Villámkör: halmazok + kinyílás, a kör sorrendje (első 3 villám), rekord + árnyék, P().villam, villamAllapot
    "szerszam.js",        # 3f) 🧰 szerszám-létrák közös alapja: 🛗 lift, 🧰 láda (5-ből 4), napló, pult-beállítás (P().szerszam)
    "mester-valtozat.js", # 3f2) 🏅 Mesterpróba-változatok közös szabálya: eredeti / számváltozat, visszatérés-számláló, melyik jön vissza (P().mv)
    "gondozas.js",        # 3c) 🌱 gondozás: gyakorlós nap, igény, napi meglepetés, érés — a visszatérés közös alapja
    "tudas.js",           # 3c2) 📒 tudás-napló: pályánként a tiszta napok, „megy-e már” (láthatatlan; P().tud)
    "nyitas.js",          # 3c2b) 🚪 újonc-menet: mi mikor ébred (osztály, gyakorlós nap, napi 1 új dolog), „ébren vagyok?” — P().uj
    "megf-naplo.js",      # 3c4) 🔍 megfigyelő napló: napi összesítő (indít, végigvisz, kilép, idő, pálya után hová megy; P().mf) — a pult jellemzéséhez
    "megfigyeles.js",     # 3c5) 🔍 megfigyelés: a gyerek-jellemzés mondatai (🧭 😊 🌳🌿🌱) a napi naplóból + tudás-naplóból + tény-motorból — közös a pulttal (tiszta függvények)
    "kuldetes.js",        # 3c3) 🐉 sárkány-küldetés motor: összeállítás (10 hely), pályavég, felrakás, kérés (P().kuld)

    # ── Perzisztencia ──
    "mentes.js",          # 4) localStorage mentés/betöltés, jutalom-motor

    # ── Hang ──
    "audio.js",           # 5a) AudioContext, beep, TTS (mondd), kert-hangok
    "speech.js",          # 5b) SpeechRecognition, felmondás-logika

    # ── Grafika ──
    "renderer.js",        # 6) SVG: unikornis, jelenet, tárgyak, díszek
    "osveny.js",          # 6-) a pálya-kép közös váza (út, Cél-odú, pipák) + az unikornis útja rajta (séta, kerülő, odúba)
    "figurak.js",         # 6a) 🎨 az állandó szereplők rajza (FIGURA.e → SVG fej-érem), 3 arc: vidám / gondol / ujjong
    "bagoly.js",          # 6a2) 🦉 a négy bagoly (kabala, könyvtáros, bankár, boltos) egy közös rajzolóval
    "lakok.js",           # 6a3) 🦔🦊 lakók: Tüske néni + Róka Juli egész alakban — csontváz (kéz-célpont + könyök), pózok átmenettel, élet a házban
    "szarv-varazs.js",    # 6a4) ✨ szarvvarázs: a tárgy ívben lebeg a szarvtól (szikra-nyom) + a gyerek unikornisa a pult mögött (uniPult, pózok)
    "meres.js",           # 6b) mérés-ligetek: mértékegység-motor, generátorok, műhely-jelenet, liget-hátterek
    "meres-mozgo.js",     # 6c) mérés-mozgóképek: bájital / szabó / pékség / lépcső + csoportos (rossz válasz után)
    "konyvtar.js",        # 6d) 📚 Bagolykönyvtár: Zrínyi építőkocka-pályák (sablonok, csapdák, végigvezetés, liget, jelenet)
    "konyvtar-mester.js", # 6e) 🏅 Mesterpróba-kapu + 🏰 Kockavár (a Fejtörő-motorral), stabil-küszöb
    "konyvtar-mozgo.js",  # 6f) 📚 a 2 polc bemutató-mozgóképe (🔎 nagyító · ✋ lépcső): ≤ 15 mp, zárókép = névtábla + célmondat
    "olvasopult.js",      # 6n) 📖 olvasópult: a hosszú szöveg nyitott könyve (bal: szöveg + kérdés, jobb: rajz), lapozás, 3 betűméret, kiemelő felolvasás
    "olvaso-ellenor.js",  # 6n2) 🔎/✋ olvasó-ellenőr: „Mire felelsz?” kérdés-keret + „Ez már a válasz?” köztes-szám tábla, konkrét tippek (közös modul)
    "nyomozotabla.js",    # 6o0) 📋 Nyomozótábla: pipás ✓/✗ tábla (közös modul; a ✓ a gazda állásából jön, a ✗ a tábláé, 🦉 kihúzás, R3)
    "dobogo.js",          # 6o) 🏆 dobogó: koppintós sorba rakás (verseny / sor / polc / ház / táblázat, kétsoros is)
    "rakodas.js",         # 6o2) 🐪 rakodás: a dobogó testvére — csomagok a tevék hátára, a szabály dönt (egyforma teher), kosár-tipp után látszik a súly
    "szerszam-kotott.js", # 3g) 📌 KOTOTT tartalom: 4 mese-keret, szereplő-rajzok, sablon-generátor egyértelműség-próbával, 4 Mesterpróba + testvérek
    "szerszam-palya.js",  # 6p) 🧰 szerszám-pálya: GEN.szerszam, jó/rossz, 🛗 lift, végigvezetés, pálya vége (mester-szalag, láda)
    "polc-mesek.js",      # 6r) 📚 olvasó-polc mesék: 🔎 hat keret (gyűjtés, udvar, hét, bolt, házsor, csere) + ✋ hat keret (kosár, szalag, életkor, vásár, padló, kannák)
    "olvaso-polc.js",     # 6s) 📚 olvasó-polc motor: 20 pötty sorrendje, formák, 🛗 lift, végigvezetés, 🏅 Mesterpróba beírással, folytatás
    "kosar.js",           # 6s2) 🧺 közös kosár: szereplők + kupacok + kosár a jobb lapon; ① kosárba ② egyforma kupac + cél-golyók ③ átrepül (a válaszra mozdul)
    "szerszam-egesz.js",  # 6s3) 🧺 „Előbb az egész” tartalom: 📖 🪜🪜🎯 lánc, 📜 a/b (közös persely), 🛗 kicsi lépcsőfokokkal — az olvasó-polc motorján
    "szerszam-egesz-gomb.js", # 6s5) 🧺 3. kör: 🔮 Kristálygömb — kerítés, 3 teve, 2×2 teve (néha 2 megoldás), két sor csere (generált)
    "szerszam-egesz-mester.js", # 6s4) 🧺 2. kör: 📜 (c) 🐪 rakodás + 🏅 3 Mesterpróba (kerítés, bűvös tábla, tevék) + testvérek + ábra-mozgókép
    "szerszam-polc.js",   # 6q) 🧰 szerszám-szekrény a Holdfény-szárnyban: polc + 3 tárgy + névtábla-fény + láda-pillanat
    "konyvtar-terem.js",  # 6t) 📚 a Bagolykönyvtár terme: olvasó-polc · ablak + 🏰 Kockavár + olvasópult · szekrény + láda · ✨ Csillagtorony-ajtó · 🏅 Mesterpróba-kapu
    "konyvtar-fuzet.js",  # 6g) 📓 végigvezetés-füzet: több lépéses pöttynél a lépések beíródnak (csendes írás + ceruza-sercegés)
    "vasar.js",           # 6h) 🧺 Tündérvásár: szöveges ×/÷ (sablonok, részeredmény, csapdák, végigvezetés, füzet + Tovább, sátrak)
    "vasar-mozgo.js",     # 6i) 🧺 a 3 vásár-mozgókép (🏷️ árcédula · 🔀 több vagy -szor · 📦 az utolsó doboz)
    "bolt-kep.js",        # 6h2) 🏪 Tüske néni boltja: a bolt képe és játékmenete (① Fizesd ki ② Visszajáró ③ 🦊 Róka blokkja), GEN.bolt, tallér-rajz
    "felvesz.js",         # 6h3b) 🪨 felvesz – letesz: a közös számolás (fvPont, fvLegkozelebbi) — a jelenet-motor és a 📸 album is ezt használja
    "jelenet.js",         # 6h4) 🎬 jelenet-motor: a kép-panel közös váza (tábla + beírás, billentyűzet, 🪨 felvesz–letesz, unikornis, jó/rossz) — JELENETEK
    "csalad.js",          # 6h5) 🏡 Számcsalád: a ház képe és menete (4 ablak, kavicsok, kakukktojás, két kosár, beírás), GEN.csalad
    "letra.js",           # 6h3) 🪜 Rokon-létra: a létra képe és játékmenete (egy fok = egy tízes; alap · távoli rokon · magától · hiányzók · felmászik), GEN.letra
    "zsib.js",            # 6h6) 🦊 Zsivány zsibvására: a nehezebb bolt (szekér-stand, ≈ becslés a könyv szabálya szerint, maszatos ár, elég lesz?, ravasz blokk), GEN.zsib
    "leny.js",            # 6k) 🐣 a kis lény: varázstojás → fióka (rajzoló, odú-fészek, kikelés, névadás) — visszahívás 3. kör
    "leny-kiser.js",      # 6k2) 🐉 kölyök az ösvényen: a megtalált kölyök kíséri az unikornist (osveny.js hívja) + pult-kapcsoló
    "sarkany-holmi.js",   # 6k3) 🐉 sárkány-holmi: 12 holmi × 10 részlet, kívánság-tábla, odú-réteg (ágy, kupac, felrakás), kérés
    "kolyok-mozdul.js",   # 6k4) 🐉 kölyök-mozdulatok: a kölyök egész alakban (KolyokFig — pózok, bolti mancs, séta, pislogás); először a boltban
    "terkep.js",          # 6j) 🗺️ közös térkép-modul (helyek, utak, útkereső, séta) + a festett ligettérkép + az unikornis a liget-belsőben
    "piac.js",            # 6j2) 🏪 Piactér: a hely a nagy térképen + a kis falutérkép (bolt-ház állapotai, épülő utca, Dallam-tér helye)
    "palyahely.js",       # 6j3) 🛖 pálya-hely: palyaJelek (a pálya jelei EGY helyen) + a hely-készlet (cégér, bódé…) — a liget csak megnevezi (LIGET_HELY)
    "keret.js",           # 6j4) 🪧 tárgy-keret: a feladat egy tárgyon a képben (🪜 fok, 🖍️ tábla, ↷ ugrás) — közös készlet, a pálya csak megnevezi
    "album-elemek.js",    # 6j5) 📸 album-elemek: a Fotóalbum rajzkészlete (keretek, hátterek, borító-vásznak, díszek, gép, film, könyv)
    "het.js",             # 6m) 📅 heti kártya: patkó-pecsétek, az ösvény végén és az odú falán, füzet — visszahívás 5. kör
    "kaland.js",          # 6l) 🗺️ kalandtérkép: a kissárkány nyomában (12 táj, felhőfújás, nyomok, képeslap-album, bagoly) — visszahívás 4. kör

    # ── Képernyők ──
    "ui.js",              # 7) mutat(), renderFomenu
    "nyitokep.js",        # 7b) 🚪 nyitókép (közös gépen az alvó gyerekek + fatábla) + az újonc első perce (választás, név-felhők, osztály-lufik)
    "legelo.js",          # 7c) 🦄 Belépő legelő: a választó (mind az öt unikornis a réten; nyitókép, 🦄 Váltás, az első perc ①)

    # ── Motor (2/2) ──
    "engine-logic.js",    # 8) játékmenet: pontok, állomások, kapu

    # ── Szülői nézet ──
    "parent.js",          # 9) szülői statisztika-oldal

    # ── Események ──
    "events.js",          # 10) kattintások, gombok, kézmentes hang

    # ── Helyszínek ──
    "odu.js",             # 10b) odú + bolt (napszak, időjárás, bútorok, díszek, ruhák, kristályok)
    "odu-elet.js",        # 10b2) élet az odúban: élénk szoba (A), élő polc (B), kis élet (F)
    "kert-tajkep.js",     # 10c2) 🌿 a patakparti C2 kert képe (fekvő/álló), hal + szitakötő — a Tény-kert is erre épül
    "teny-kert.js",       # 10c3) 🌷 Tény-kert: virág-modul (12 forma), tövek a spirálon, belesétálás + ráközelítés, közeli kép, hír
    "kert.js",            # 10d) kert/udvar (séta, trükkök, berendezés, ételek)
    "szalon.js",          # 10e) fodrászat/szépségszalon + utca-hub
    "foto.js",            # 10g) 📸 fotógép: Bolt „Fotó” fül, 📷 gomb a helyeken, kereső, pillanatkép + matrica, film, képtár (IndexedDB + felhő)
    "album.js",           # 10g2) 📸 Fotóalbum: borító + lapok, tálca 7 füllel, felvesz–letesz, gombsor, felirat, PNG-letöltés
    "bank.js",            # 10f) 🏦 Tündérbank: ✨→💧 váltás (VALUTAK/VALTASOK tábla, pályás nyitás)

    # ── Gyűjtemény ──
    "badges.js",          # 10c) jelvények, gyűjtemény-könyv, talált tárgyak

    # ── Felhő (backend 1. fázis — csak ?felho kapcsolóval él) ──
    "firebase-config.js", # 12) Firebase config, FELHO állapot, kapcsoló
    "auth.js",            # 12b) belépés kóddal, belépő képernyő
    "db.js",              # 12c) Firestore betöltés, első feltöltés, élő figyelés
    "sync.js",            # 12d) delta-küldés + 3-utas összefésülés
    "hatizsak.js",        # 12d2) 📴 közös gép net nélkül: hátizsák gyerekenként, net nélküli belépés, csendes visszalépés
    "lakat.js",           # 12d3) 🔒 titkos kód: a lakat a legelő tábláján (beállítás, belépéskor, pult-levétel)
    "analytics.js",       # 12e) eseménynapló (events)
    "config.js",          # 12f) producer-felülírások + csoportok (4. fázis)
    "tunemenykert.js",    # 12g) Égi Tüneménykert: RTDB jelenlét + közös tér (5. fázis)
    "fejtoro.js",         # 12h) Fejtörő-hegy: versenyfeladat-állomások (Zrínyi, felhőből)

    # ── Indítás ──
    "main.js",            # 11) betolt(), esemenyek(), nyitoIndul(), window.UC
]

HEADER = '/* AmbitusNumerorum: Unicornis Centum — MVP-A. Vanilla JS, függőség nélkül, file:// alól fut. */\n'
GENERATED = '/* ⚠️ GENERÁLT FÁJL — NE SZERKESZD! Forrás: src/ · Build: python build.py */\n'

def osszerak():
    """A game.js tartalma a src/ modulokból (a gépi próba verzió-őre is ezt hívja, fájlírás nélkül)."""
    parts = [HEADER, GENERATED, '\n(function () {\n"use strict";\n\n']
    for mod in MODULES:
        path = os.path.join(SRC, mod)
        if not os.path.isfile(path):
            print(f"HIBA: {path} nem található!", file=sys.stderr)
            sys.exit(1)
        with open(path, "r", encoding="utf-8") as f:
            parts.append(f.read())
        if not parts[-1].endswith("\n"):
            parts.append("\n")
    parts.append("\n})();\n")
    return "".join(parts)

def build():
    tartalom = osszerak()
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(tartalom)
    total = tartalom.count("\n")
    print(f"✓ game.js built — {len(MODULES)} modul, {total} sor")

if __name__ == "__main__":
    build()

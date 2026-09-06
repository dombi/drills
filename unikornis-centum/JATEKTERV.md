# AmbitusNumerorum: Unicornis Centum — játékterv

*Élő dokumentum. Minden ülés végén frissül. A részletes tervek: a `Matekos` mappában a
`rendszerterv-osszeadas-kivonas-100.html` és a hat `spec-*.html`.*

## Mi ez

Nyugodt, gyűjtögetős tanulójáték. A gyerek egy **unikornist** vezet végig egy erdei ösvényen,
állomásról állomásra, és közben **összead–kivon**, illetve **felmondja a számbontásokat**.
Elsősorban **hangosan** válaszol (a gép figyel), a képernyős számbillentyűzet csak kisegítő.
A jó válaszért **csillámport** kap. Keret: elveszett **csillagszilánkokat** gyűjt vissza az erdő
éjszakai egére — minden teljesített pálya egy szilánk.

## Kinek

8–18 éves gyerekeknek, de a belépő szint egészen alacsony. **Egy gépen két gyerek** játszik,
egymástól függetlenül: **Ragyogás** (hófehér unikornis) és **Csillámharmat** (ezüstszürke).
Mindegyiknek saját csillámpora, ruhái, kész pályái, naplója.

**A három unikornis** (a `UnicorniCentum unikornis képek.png` alapján):
- **Ragyogás** — fehér test, sárga-rózsaszín sörény, csillag-jel.
- **Tűz** — barackszín test, vörös-narancs-sárga „tűz" sörény, láng-jel. (Ez a „vörös unikornis".)
- **Csillámharmat** — világoskék test, kék-magenta sörény, hópehely-jel.
Naiv, rajzolt karakterstílus: egyszerű forma, sötét körvonal, ecsetvonásos sörény-farok.

## Mit tanít

Az „Összeadás-kivonás" témacsomag gyakorló része:

1. **Számbontás felmondása** (számok ≤ 10 teljes bontása, hangosan).
2. **Összeadás-kivonás 10-ig** — tízesátlépés nélkül.
3. **Összeadás-kivonás 20-ig** — megjelenik a tízesátlépés.
4. **…100-ig** — teljes tízesek, majd kétjegyű ± egyjegyű, kétjegyű ± kerek tízes, kétjegyű ± kétjegyű.

Összesen **7 pálya**, mind ugyanazon a közös erdő-grafikán. A számkör csak beállítás, nem külön
játékmód.

## Didaktikai elvek

- A művelet maga a játék — nem kvíz, ami megszakítja.
- Elsőre nem megy — az a normális. A kudarc nem büntet, nem szégyen.
- Rossz válasznál láthatóvá válik a teljes igazság, tanító formában.
- A feladat mindig megoldható; van szégyenmentes kiút (kerülő, „tovább megoldás nélkül").
- Nincs időnyomás, nincs pontlevonás, nincs visszalökés. Az időt csak a szülői napló méri, csendben.

## Hogy néz ki

Pasztell „mesevilág" — a `Matekos` mappa SVG-i adják az irányt (`odu-belso.svg`, `bolt.svg`,
`palya-alap-hangos.svg`). Rajzolt unikornis, oldalnézetben; egy **bagoly-kabala** ül az ösvény
szélén, ő „mondja" a feladatot beszédbuborékban és ő ad tippet. A grafikát a stúdió rajzolja
(beágyazott vektor).

## Játékmenet (a kör)

1. A bagoly felolvassa a feladatot.
2. A gyerek választ: **megoldja itt**, vagy megy a **hosszú kerülőn** (~15 mp séta, feladat nélkül).
3. Megoldásnál kimondja a választ (vagy beírja). Jó → csengő + csillámpor. Rossz → kedves jelzés,
   újra próbálhatja; a 2. hibánál a bagoly megmutatja a helyes megoldást és rávezet.
4. Egy állomáson több kis feladat van sorban; a végén az unikornis továbbsétál.
5. Célba érés → pálya kész = **csillagszilánk**, összegző képernyő.

## Katalógus (bolt) — később, az MVP-B-ben

4 polc a `bolt.svg` szerint: **Holmik** (ruhák) · **Kinézet** (az unikornis szemszíne, sörénye) ·
**Kellékek** (odú-berendezés + tárgyak a saját helyükre) · **Időjárás** (napszak + eső/hó/szivárvány).

## Állapot

- **2026-08-29 — MVP-A KÉSZ (első játszható build):** profilválasztó (Ragyogás / Csillámharmat),
  főképernyő 7 pálya-kártyával (1–3 játszható, 4–7 „hamarosan"), közös erdő-térkép kameramozgással,
  rajzolt unikornis + bagoly-kabala, pálya 1–3 matek (számbontás felmondás, ±10, ±20) a
  `spec-palya-adatlap-1-3` állomásaival, beszéd-válasz + 0–9 számbillentyűzet (mikrofon hiányában
  automatikus váltás), felolvasás, csillámpor-számláló (2/feladat · 5/bontás · 3/állomás · 20/pálya),
  „tovább megoldás nélkül" végig elérhető, ~15 mp kerülő út, pálya vége + saját rekord, csendes
  szülői napló (idő, hibák, tízesátlépés- és bontás-hibaarány), localStorage mentés gyerekenként külön.
  **Bolt/odú/öltöztetés még nincs — az az MVP-B.**
- **Tesztelve:** generátor-korlátok (900 kör hiba nélkül), magyar számfelismerő 0–100,
  teljes végigjátszás pálya 1 és 2, rossz válasz → teljes igazság, kerülő, profil-elkülönítés.
- **Ismert hiányosság:** az unikornis-rajz még nyers (placeholder vektor) — a következő körben szépítjük.

- **2026-09-03 — playtest-javítások:**
  - A felolvasás után a játék nem akad meg többé: a `mondd()` mostantól magát a
    beszéd-állapotot figyeli, nem egyetlen (a Chrome által gyakran elmulasztott) eseményre vár.
  - A bontás-felmondás elfogadási szabálya tiszta lapról újraírva (`bontasFelmondOk`):
    a gyerek egyben, lentről mondja `0+N … N+0`; csak a számok + sorrend számít; a kötőszó
    mind mindegy; a kimondott összeg soronként külön elhagyható; „tíz egy" ≠ 11.
    (Teljes leírás: rendszerterv 4.3.1 + `spec-hang-es-beszed.html` 2.2.)

- **2026-09-03 — ODÚ v0 + v1 KÉSZ:**
  - **v0:** új „🏠 Odú" gomb a főmenüben és a pálya-vége képen → hazamehető odú-nézet:
    rajzfilmszerű fa-szoba (fal, padló, ablak, zászlófüzér, felhő-ágy, kályha, polc, asztal,
    szivárvány-szőnyeg) + a profil unikornisa a szőnyegen + csillámpor-számláló + „🦄 Váltás".
  - **v1:** „🛍 Katalógus" → Időjárás fül: **Napszak** (Este 0 · Reggel 40 · Dél 40 ·
    Napfogyatkozás 120) és **Időjárás** (Tiszta 0 · Eső 35 · Hó 45 · Szivárvány 60),
    egymástól függetlenül. Kártyánként mini ég-előnézet; állapot: megvehető / „✨ kevés" /
    „✓ ez van kint" / „Beállítom". Vétel: „Megveszem" → megerősítés → levonás → azonnal kint is.
    Az ablak mögötti ég és a szoba fénye követi a napszakot; eső/hó a szobában is hull.
  - Teljesen additív: a pálya-motor egyetlen függvénye sem változott; saját mentés-ág `P().odu`,
    saját `.odu-` CSS. **Tesztelve:** pálya 1 és 2 hiánytalanul végigjátszható az odú-kód mellett;
    v0 belépés + v1 teljes vásárlási kör hibamentes.
  - **Az odú-szoba rajza az `odu-belso.svg` mintájára** készült (a Matekos mappa referencia-képe):
    kerek hold-ablak bal fönt (ez változik a napszakkal), zászlófüzér, keretezett szivárvány-kép,
    mennyezeti csillag-lámpa, szivárványos felhő-ágy csillag-párnával, pasztell kályha lánggal,
    gyökérpolc üvegcsékkel, kerek asztal csillag-befőttel, gomba, szivárvány-szőnyeg — rajta az
    unikornis. Nem fotórealisztikus, de a referencia hangulatát viszi.
- **2026-09-04 — ODÚ v2 (öltöztető – Holmik) + bolt-átépítés Round 1:**
  - **v2 Holmik:** 6 hely (Fej / Nyak / Hát / Láb / Oldal-szárny / Farok), helyenként 3 tétel
    (alap / különleges / ritka). A tárgyak a `ruhaSVG` testre-illesztett rajzaival kerülnek az
    unikornisra; vétel után rögtön fel is kerül, külön „Felveszem ⇄ Leveszem".
  - **Bolt = polcos böngésző + adatlap** (nem kártya-rács): bal oldalt fülcsoportonként egy
    rajzolt fapolc a tételek bélyegképével + ✨ ár-cédulával; megvett tétel a polcon marad
    halványan + zöld pipa. Jobbra adatlap: ritkaság-szalag, „így áll rajtad" előnézet
    (Holmik → tárgy az unikornison · Időjárás → ablak-korong), cím + tipp + ár, egy nagy gomb.
    60 ✨ felett „Biztos?" kérdés, alatta azonnal.
  - **Tesztelve:** Holmik + Időjárás vásárlás, felvesz/levesz, beállít, megerősítő és „még kevés"
    ág, odú-stand újranyitás, pálya 1 regresszió – mind hibamentes, konzol tiszta.
- **2026-09-04 — bolt Round 2 kész, ruha-horgonypontok + szárnyak javítva, kézmentes hang mind
  az 5 játszható pályán:** a 18 ruha polc-póza beépítve (a rajzoló session anyagából); a fej/nyak/
  oldal ruha-zónák újrapozicionálva (a producer visszajelzése alapján); a 3 szárny-tétel nagyítva
  és teljesen láthatóvá téve; Fredoka betűtípus; a kézmentes hangfelismerés minden pályán fut
  (Erdei bontás, Összeadás-kivonás 10/20, Tízesek ösvénye, **Aprók a tízeshez**) – sehol nem kell
  gombot nyomni a válaszadáshoz.
- **„Aprók a tízeshez" (5. pálya) elkészült:** kétjegyű ± egyjegyű 100-ig, a meglévő
  `GEN.osszeadas/kivonas` generátorral, 9 hangya-témájú állomással, fokozatosan táguló
  tartománnyal és átlépés-fokozattal. Kézmentes hang a kezdetektől.
- **2026-09-04 — MIND A 7 PÁLYA JÁTSZHATÓ, mind kézmentes hanggal.** „Tízes-lépegető" (kétjegyű ±
  kerek tízes) és „Erdő mélye" (kétjegyű ± kétjegyű) elkészült, ugyanazzal a mintával mint az
  Aprók a tízeshez. Tesztelés közben egy valódi hibát találtunk és javítottunk: a kézmentes
  hangfelismerő ritkán duplán számolhatta egy válaszra a böngésző kétszeres eseményét, ami
  átugorhatott egy állomást – ez most minden pályán javítva van.
- **2026-09-05 — 9 PÁLYÁS MŰVELET-LOGIKA.** A 7 helyett 9 pálya, benne 2 új (Tízes-átlépő,
  Erdő szíve), és a többi átszabva (a 20-ig pálya végig tízesátlépéssel, a Tízesek ösvénye csak
  kerek tízes, az Erdő mélye csak átlépés nélkül). Az 1. pálya (bontás-felmondás) érintetlen.
  A generátor `csak_tizes` / `b_tizes` kapcsolót kapott. Minden pálya kézmentes, minden generált
  feladat a pálya szabályának megfelel (tesztelve). A szám-tartományok javaslatok, élesben
  hangolhatók.
- **2026-09-06 — „tovább megoldás nélkül" áthelyezve + Ragyogás nullázva + térkép-teszt:**
  A „tovább megoldás nélkül" gomb mostantól **csak Csillámharmatnál** látszik (eddig csak
  Ragyogásnál). A **Ragyogás** profil csillámpora és megvásárolt holmija egyszer, automatikusan
  **visszaáll a kiindulópontra** (kész pályák / napló / becenév marad). **TESZT:** a 2. pálya
  („Összeadás-kivonás 10-ig") kamera nélküli, **egyképernyős térkép-nézetet** kapott — a teljes
  ösvény a Cél-odúig egyszerre látszik, de az unikornis továbbra is állomásról állomásra sétál.
  A többi pálya változatlanul kamerás. Tesztelve: 2. pálya végigjátszva (út látszik, séta,
  pipák, kerülő), 1. + 3. pálya regresszió zöld, konzol tiszta.
- **2026-09-06 — Egységes bolti bélyegképek:** a bolt-polcon minden holmi-kép mostantól ugyanaz a
  mini-unikornis (a gyerek saját bőrén), ugyanabból a szögből, csak az adott holmi felöltve —
  a kevert „polcon fekvő / akasztott / lebegő ikon" képek helyett. A fej-koszorú, csillag-szarvdísz,
  holdkorona és a Szivárvány-sál (csíkos háromszög-kendő) újrarajzolva, élénkebb, elütő színekkel.
  Tesztelve: mind a 18 bélyegkép, vásárlás + felvétel, adatlap-előnézet, odú-szoba, pálya-indítás — zöld.
- **2026-09-06 — Bontás-felmondás: türelmesebb, pár-onkénti mód.** A kézmentes felmondás minden jól
  kimondott sor után pipát + csilingelést + egy halk „jöhet a következő" pittyegést ad. Elakadásnál
  (csend vagy félrehallás) **a haladás soha nem vész el**: a bagoly kiírja a soron következő párt,
  ad egy pittyegést, és onnan folytatódik — nincs elölről kezdés. Lépésenkénti beírásra csak akkor
  vált, ha a gyerek a „⏹ Kész vagyok" gombot nyomja, vagy ugyanazon a soron 4× elakad — és akkor is
  a meglévő pipáktól. Tesztelve fake felismerővel (teljes felmondás, elakadások, „Kész vagyok",
  mikrofon-tiltás) + regresszió. A `bontasFelmondOk` szabály és a golyós jutalom + „Tovább →" marad.
- **2026-09-06 — Jelvények + Gyűjtemény-könyv + Talált tárgy.** Három kis „játék-érzés" elem az
  odúban: **🏅 Jelvények** (7 feloldható kitüntetés a haladásért — pályák, elsőre-jó sorozat,
  gyűjtés), **📖 Gyűjtemény** (minden bolti holmi egy lapon: mi van meg, mi hiányzik), és
  **talált tárgy** (helyes válaszért / felmondásért / kerülőn 15–30% eséllyel egy holmi is pottyan
  a ✨ mellé; „pity"-védelem 12 üres dobás után). Mind a meglévő adatokból, a pálya-motor
  számítása változatlan. Tesztelve (drop-arányok, mind a 7 jelvény, gyűjtemény-render, teljes
  pálya + felmondás + kerülő). A `bontasFelmondOk` és a golyós jutalom érintetlen.
- **Térkép-teszt:** marad a 2. pályán tesztként (producer-döntés), a többi pálya kamerás.
- **Következő:** ODÚ v3 (berendező – Kellékek), majd v4 (kinézet). A grafikai session a v3 első
  szeletét már leadta (`Matekos/mockup-odu-szintek.html`).

## Megnyitás

Élő verzió: `https://dombi.github.io/drills/unikornis-centum/index.html` (a `drills` repóból).
Helyben: `drills/unikornis-centum/index.html` böngészőben (Chrome ajánlott a hangos válasz miatt),
internet nem kell. 3 fájl: `index.html` + `style.css` + `game.js`.

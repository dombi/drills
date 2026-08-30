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
- **Következő:** rajzolás-csiszolás; majd MVP-B (katalógus 4 polccal + öltöztetés + kinézet + odú);
  majd pálya 4–7 (100-as számkör).

## Megnyitás

`jatekok/unikornis-centum/unikornis-centum.html` — dupla kattintásra megnyílik a böngészőben
(Chrome ajánlott a hangos válasz miatt), internet nem kell. Egyetlen önálló fájl.

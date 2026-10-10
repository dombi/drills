# Próbacsapat — Bagolykönyvtár kérdései (rész vagy egész, miért) — 2026-10-10

Rövid próba: Dani (3. o., 🔎 polc + 📌) és Bence (5. o., ✋ polc + 📌), ~10 kérdés/fő. Csak a kérdések érthetősége.
Mindkettő: a terem 1 kattintással megtalálható; a 📌 sorba-rakósnál „Nézzük kicsiben” nem jött (hibára tipp, 2. hibára végigvezetés).

## Összefésült hibalista
🔴
1. 📌 végigvezetés után jutalom (+1 ✨) és „Nem adom fel” jelvény jár, megoldás nélkül (Dani, kód: szVegigFut → szJo → ertekel(1)). A jelvény feltétele: „oldj meg 3+ próba után” — itt nem ő oldotta meg.
🟡
2. A nagy kérdés és az „1.” részkérdés egy dobozban, egyforma kérdőmondatként — nem látszik, melyik a végső (Bence, ✋ Kitti).
3. Az utolsó lépés szövege szó szerint a nagy kérdés („2. Mennyi pénze maradt?”) — nem derül ki, hogy ez a csúcs (Bence).
4. „Hány lépés kell? Előbb csak ezt döntsd el!” — nem mondja, miért kérdezi; a lépés-választás után a lépéslista eltűnik (Bence).
5. ✋ „De mit kérdeztek?” — kérdés, de nem mondja ki, mire feleljen most; beszédnél a 🎤-t újra kell nyomni (Dani).
6. 🔎 koppintás után nincs jel, hogy most már SZÁMMAL kell felelni (Dani).
7. Koppintás előtti beírás: csak hangban „Előbb koppints a kérdésre!”, a képen semmi; a mező némán kiürül (Bence; kód: olvaso-polc.js:295).
8. 📌: a 🙋 „Mit kérdeznek?” után újra kell koppintani a kérdésre, miért — nem mondja (Bence).
9. Köztes szám (részlépés) jó válaszára ✨ + új holmi jön, mielőtt kiderül, hogy nem ez a végső (Bence).
10. Tyúk-lábak feladat: nincs „?”-kártya és nincs 🔎, a lap nem mutatja, mit keresünk (Dani).
11. 📌 emeletes ház: a felső szint száma nem olvasható (Dani, képernyőfotó).
🟢
12. „Megálltál, és továbbmentél!” jó válasz után hibát sugall (Dani).
13. Kirakó helyek irányai pályánként mások (balról / felülről), a sorszám a hely mellett (Bence).
14. A 🔎-kérdés szövege váltakozik („Kiről kérdeznek?” / „Mit kell megszámolni?” / „Mire felelsz?”) (Dani).

Folyamat-hiba: `window.__mondatok` mindkét agentnél undefined → a hallott szöveg nem volt ellenőrizhető (build_teszt.py POSTLUDE: `mondd` nem globális függvény a beillesztés pillanatában? — vizsgálandó).

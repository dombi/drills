# 5. próba — 📚 egységes Bagolykönyvtár (2026-10-12/13)

Indult: Dani, Bence, Zsófi, hibavadász, lektor (Sonnet). **Csak a lektor ért végig** (160 e token):
a másik négy félúton leállt — elfogyott a munkamenet-keret (HTTP 429). A producer döntése (2026-10-13):
a négyet NEM folytatjuk, a próbacsapat átalakul (lásd README „Új rend”), jöhet az élő próba.

Teszthez: a Mesterpróba-feladatok a felhőből jönnek → helyi másolat (`fejtoro-tesztpalya.json` +
`fejtoro-mesterproba*.json` összefésülve) + `UC.fejtoroBetoltHelyi(json)` — így a 🏅 is kipróbálható.

## Lektor — talált és javított (`polc-mesek.js`, `olvaso-polc.js`, `olvaso-ellenor.js`)
- 🟡 Névelő a szám előtt: „a 5 galamb”, „A 54 tallér”, „a 1 hét” … (sok sablonban) → **egy közös igazító**
  (`pmAzIgazit`, a kész mese minden szövegén); gépi ellenőrzés: 7349 mintaszöveg, 0 hiba.
- 🟡 „Ügyes! És most: És hány…” (dupla „És” a felolvasásban) → a kérdés elejéről levágva.
- 🟡 „— a 7 még csak ennyi idős a nővére.” → „Még nem! A 7 csak egy lépcsőfok: ennyi idős a nővére. A kérdés: „…””
- 🟡 Hang ≠ kép a polcon: „Nem talált.” → „Ez még nem jó. Számold ki újra!”
- 🟡 „nem alma-darab” → „csak a különbség”; „Mennyivel többet kérdeztünk.” → „Mi azt kérdeztük: mennyivel több?”
- 🟡 „mit kell tudnunk, mielőtt a kérdezett számot megkapjuk?” → „mit kell előbb kiszámolni?”
- 🟡 „A Mire felelsz? a ládába került” (hallva) → „A „Mire felelsz?” szerszám a ládába került.”
- 🟡 „Hány nap a 1 hét?” → „Hány nap van 1 hétben?”
- 🟢 harmadannyi · „… ára együtt” · „A matrica árát” · „Mi kettejük almáit együtt kérdeztük!” · „4 volt” („lett a vége” helyett) ·
  „Ügyes, kijavítottad!” · „Ez nem a kérdés. Melyik mondat kérdez?” · „Csak a pirosakkal hasonlítsd össze…”
- ✅ Jó: bátorító hibaszövegek, a ragok (5-tel, 3-mal…) helyesek, a matek a mintákban jó, a terem-feliratok rövidek.

Nem mérve (a leállt agentek miatt): terem 4 méreten, kilépés/újratöltés, Mesterpróba-kocka újrapróbálásnál, kiskapu → élő próba + gépi próba.

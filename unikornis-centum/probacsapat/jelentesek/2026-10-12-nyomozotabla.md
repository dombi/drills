# 4. próba — 📋 Nyomozótábla (📌 KOTOTT: 📋 fok, 🔮 két tábla, 🏅 Mesterpróba) — 2026-10-12

Agentek: Dani (📋 4 + 🔮 1 feladat, 8811), Bence (📋 2 + 🔮 3 + 🏅 1, 8812). Kód: `2521f2d`.

## Ami jól működik (mindkét gyerek)
- Egy állás, két nézet: a tábla és a rajz mindkét irányban egyezett, eltérés nem volt; a „Ki mit?” pár a szereplővel együtt mozog.
- A hibaüzenet tábla nyelvű, és rámutat a mondatra: „Nézd: Dani nem áll legelöl. A táblában hová tetted Dani ✓-ét?” — a félreolvasott „nem”-et 4/4 esetben elkapta (Bence).
- Kiskapu nincs: a Kész dupla/tripla koppintása, az üres vagy félig kész tábla nem ad jutalmat. Konzolhiba nincs.
- Megtalálás: profil → Térkép → Bagolykönyvtár → 📋, 3 koppintás (Dani).

## 🟡 Zavaró
1. **Kérdés-zár visszajelzés nélkül** (mindkettő): amíg a gyerek nem koppint a kérdés-mondatra, a tábla, a rajz és a Kész halott; a súgóra („🔎 Mire felelsz? Koppints a kérdésre!”) koppintva sem történik semmi. Bence 3× koppintott hiába. Minden feladatnál, a Segítség után és a kicsik között újra.
2. **A ✗/✓ koppintás nem derül ki** (Dani): egy koppintás ✗, kettő ✓ — Dani az első ✗-et jelölésnek hitte. Van bemutató mondat (`SZK_TABLA_ELSO`), de nem vette észre (valószínűleg a kérdés-zár mellett elsikkad).
3. **Az automatikus kihúzás megszűnik, a gyerek nem tudja, miért** (mindkettő): az első 2 feladatban és a kicsikben a ✓ után a bagoly kihúz, utána nem. Ez a terv (3. döntés), de nincs átadó mondat („Most már te húzod ki!”).
4. **„Ügyes! Ugyanaz, csak három gyerekkel.”** (Dani, kódban ellenőrizve): a 📋 első két (3 szereplős) feladatánál a kicsi is 3 szereplős → a mondat hamis. `szkFeladatGen` `tobb: g.K.tobb[g.n - 3]`, `liftMondat("vissza")`.
5. **A kicsi füzet levágja a kérdést** (Dani, 2.–3. feladat = kicsik): a bal lapra csúszó füzet (234 px) magasabb, mint a lap (198 px), a kérdés félig takarva, nem görgethető.
6. **Kész gomb kilóg 1024×768-on** a 4×4 emeletes feladatnál (Dani) — mérni kell.
7. **Séta közbeni koppintás mellé megy** (Dani): amíg a figura sétál, a tábla elmozdul, a koppintás rossz cellára esik — mérni kell.

## 🟢 Apró / megjegyzés
- A kicsik teljes ✨-t adnak (Bence +1, +1) a nagy előtt — terv szerint („teljes jutalommal”), és mindegyik valódi megoldás; nagyonként legfeljebb 3 kicsi → nem kiskapu.
- 800×600-on a 🔮 két tábla kicsi, de olvasható; a 🏅 5×5 tábla olvasható.
- Teszt-eszköz: Dani szerint a `window.__mondatok` nem létezett (a build_teszt létrehozza — valószínűleg túl korán nézte).

## Javaslat (a producer dönt)
- Javítás egy körben (közepes): 1 (zárt koppintásra a kérdés-mondat felvillan + a súgó is feloldjon), 2 (a ✗/✓ mondat a tábla fölött maradjon az első feladat végéig), 3 (átadó bagolymondat a 3. feladatnál — 🖊️ lektor), 4 (3 szereplősnél más vissza-mondat), 5–7 mérés + igazítás.
- Utána élő próba a gyerekekkel.

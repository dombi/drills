# 1. próba — 🍃 Bújócska-rét (2026-10-10) — összefésült jelentés

Csapat: Dani, Bence, Zsófi, hibavadász, lektor (mind Sonnet). Összesen ≈ 540 e token (`../meresek.md`).

## 🔴 Akadály
1. **Friss (üres mentésű) gépen az első profilkattintás után összeomlik a térkép** —
   `TypeError: Cannot read properties of undefined (reading 'terkep')` a `bemutat()`-ban (ui.js).
   Ok (kódból ellenőrizve): üres localStorage-nál a `betolt()` → `alapMentes()` → `alapProfil()`
   profilNormal NÉLKÜL, így hiányzik a `bemutatva` ág. Újratöltés után jó (akkor már normalizál).
   Javítás: `alapMentes`-ben `profilNormal(alapProfil())`. Találta: Bence, Zsófi (a hibavadász nem).

## 🟡 Zavaró
2. **Beírásnál a mező nem kap fókuszt** az „⌨ Inkább beírom” után; az Enter az „Inkább mondom”
   gombot nyomja. (Bence)
3. **2. hiba után nyers visszajelzés**: „✘ 7 + 3 = 10” — nincs kedves szó; mérges gyereknek szidásnak
   hathat. (Dani) — Az 1. hibánál „Nem 9. Nézd meg még egyszer!” jó.
4. **Nem mondja ki a kép, hogy a levél mögötti számot kérdezi**; az összeg beírására (félreolvasás)
   csak az általános „Nézd meg még egyszer!” jön. (Bence; a lektor is javasolja: „Melyik szám bújt el?”)
5. **Túl korai beszéd**: a „hallgatlak…” már látszik, amíg a kérdés szól; a korán mondott válasz elvész,
   3 után beírásra vált. (Zsófi; részben tesztkörnyezet-hatás lehet — élő próbán figyelni)
6. Felolvasás, legnehezebb forma: „Mennyi mínusz öt az nyolc?” fülre nehéz. (lektor)
7. Gazdaság (tervezési kérdés): a könnyű Tízes barátok ismételgetése és a tippelés is ugyanannyi ✨-t ad. (Zsófi)

## 🟢 Apróság
- Jelvény-felirat rácsúszik a feladatkártyára (Dani). · Szakaszbónusz nincs kiírva; 💧 erről a pályán semmi (Zsófi).
- 🚶 kerülőnél ~10 mp üres térkép (Zsófi). · Hang ≠ kép: „Nem talált. Próbáld újra!” vs „Nem 9. Nézd meg…” (egész játék).
- `palcim`: „pótlás” szó (lektor). · „x meg mennyi az y” helyett „…, hogy y legyen?” (lektor; az „az” nem hiba, csak javaslat).
- A rejtett szám benne van az oldal szövegében (képernyőolvasóval kiderülne) — gyereknél nem számít.

## ✅ Jól működik
Matek 5 szakasz × 60 minta: 0 hiba. Dupla beküldés nem ad dupla jutalmat. Hiba után azonnal újra lehet próbálni,
✨ nem vész el, „Nem adom fel!” jelvény. Odatalálás 3–5 kattintás. Kedves állomásnevek. Konzol tiszta (az 1. ponton kívül).

## Az 1. próba kérdése
A gyerek-játékosok találtak olyat, amit a hibavadász nem (1., 2., 3., 4.) → **maradnak**.

## Javítások állapota (2026-10-10, 2. kör)
- ✅ 1. térkép-összeomlás (`f49f929`)
- ✅ 2. „Inkább beírom” után a gomb elengedi a fókuszt (Enter = beküldés); érintőn a négyzet kap fókuszt (`beiroFokuszba`, events.js)
- ✅ 3. 2. hiba után: „Semmi baj! Nézd: 7 + 3 = 10” (az egész játékban, a „✘” helyett)
- ✅ 4. a kártyán „Melyik szám bújt el?”; ha az eredményt írja be: „Ez az eredmény. Melyik szám bújt el?”
- ✅ 6. kisebbítendő: „Melyik számból marad nyolc, ha öt elmegy belőle?”
- ⏳ 5. korai beszéd — élő próbán figyelni · ⏳ 7. ✨-farmolás — producer-döntés

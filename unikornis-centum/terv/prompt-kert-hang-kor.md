# Kert hang-kör — fűropogás + nyihogás (CC0 / Web Audio)

A `drills\unikornis-centum\` játékban (game.js) van egy kert-helyszín, ahol az unikornis sétál (koppintásra odasétál a célpontra, CSS transition + `requestAnimationFrame` séta-animáció). Ehhez kell hangeffekt:

1. **Fűropogás a paták alatt** — rövid, halk, ismétlődő hang a séta közben (léptenkénti vagy folyamatos loop, ami a séta végén megáll)
2. **Nyihogás** — alkalmi hang, pl. koppintásra az unikornisra, vagy séta indulásakor

## Szabályok

- **Kizárólag CC0 / közkincs** hangok — semmilyen attribúciós kötelezettség nem lehet (nem elég a CC-BY sem!)
- Web Audio API (nem `<audio>` tag)
- A hangfájlok legyenek kicsik (pár KB, rövid clip)

## Fázisok (ebben a sorrendben)

1. **Hang-választás:** keress 2-3 konkrét CC0 hangforrást (freesound.org CC0 szűrővel, pixabay, stb.), írd le melyiket miért ajánlod (hossz, méret, hangulat). NE tölts le semmit, csak mutasd az opciókat.
2. **Időzítés-terv:** írd le, mikor melyik hang szólal meg, hogyan kapcsolódik a séta-animációhoz (start/stop/loop/fade), milyen hangerő-viszonyok. Kb. 5-10 mondat.
3. **Várd meg a jóváhagyásomat** az 1-2. pontra, és CSAK UTÁNA kódolj.

## Kontextus

- Munkamásolat: `C:\Users\Dombi-NyárádiGabriel\drills\unikornis-centum\`
- A kánon a `dombi/drills` repo — kód előtt `git fetch`, utána commit+push
- A game.js nagy fájl (~4500+ sor), a kert-séta logika külön szekcióban van
- A játék gyerekeknek szól (6-8 év), pasztell hangulat — a hangok legyenek kedvesek, nem ijesztőek

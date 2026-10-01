# Tündérbank: kódolás-prompt

Bemásolható nyitómondat egy friss beszélgetéshez:

> Tündérbank kódolása. Olvasd el a `unikornis-centum/terv/bank-rendszerterv.html`-t, a jóváhagyott `bank-rajzterv.html`-t és a `bank-kodolas-prompt.md`-t, aztán kódold le a drills repóban.

## Jóváhagyott tartalom (2026-09-30 / 10-01)

- **Mit:** ✨ csillámport lehet 💧 tündérharmatra váltani, egy irányba. Egy koppintás = 1 💧.
- **Hol:** 5. épület az utca-hubon (`utcaSVG`, src/szalon.js). Most 4 épület áll egy sorban, mind az 5 keskenyebb lesz. Ingyenes belépés.
- **Pult:** váltásonként ár (✨ / 1 💧), napi korlát (opcionális, üres = nincs) és ki/be. Gyerekenként ÉS csoportra, egyéni > csoport.
  - **Nincs alapérték:** amíg sehol nincs ár, a bank ZÁRVA. Kívül „Hamarosan nyitunk” tábla, belül a bagoly: „A bank még nem nyitott ki, nemsokára gyere vissza!”
  - **Csoport-ütközés:** a szigorúbb nyer (magasabb ár, kisebb korlát, a kikapcsolt nyer). Ezt a pult szövegében is írd le.
- **Biztos?-ablak** váltás előtt, felolvasva: „Odaadsz 100 csillámport 1 tündérharmatért?” Igen / Nem.
- **Halvány gomb** esetén a bagoly megmondja, miért: „Még N csillámpor kell.” / „Mára ennyi, holnap újra jöhetsz!” / zárva-mondat.
- **Bankár:** karamellszínű, szemüveges, pink csokornyakkendős bagoly (`bankarBagoly` a rajztervben). Más figura, mint a könyvtár lila baglya (`ekBagoly`).
- **Rajz:** a gyerekek rajza alapján (`bank-rajzok/gyerekrajz-bank.png`). Kívül kékesszürke ház, két izzó sárga ablak, lila „bank” tábla, lila ajtó; belül levendula fal, kék padló, barna pult, mögötte széf forgó tárcsával, balra ✨ aranyfelhő, jobbra 💧 harmatfelhő. Váltáskor ✨ repül a sárgából a kékbe, és leesik egy 💧. Ambient mozgás a rajzterv szerint.

## Bővíthetőség (a producer kifejezett kérése)

- `VALUTAK` tábla (id, név, ikon, mentés-mező) és `VALTASOK` tábla (id, mit ad, mit kap). A `FESTEKEK` mintáját kövesd.
- Egy új sor magától jelenjen meg a bankban (új gomb) és a pulton (új sor ár/korlát/ki-be mezőkkel).
- A tárgy → pénz váltás a tábla formájában legyen előkészítve, kódja még nem kell.

## Technikai jegyzet

- **Pult-beállítás:** a `kapuOrak` / `ekStabil` mintájára külön mező a gyerek- és a csoport-dokumentumon (pl. `bank: { "csilla-harmat": { ar, korlat, ki } }`). Külön összevonó függvény (`bankOsszevon`) a `src/config.js`-ben ÉS az `admin/index.html`-ben, a kettő legyen azonos.
- **Mentés:** `P().bank = { nap: "YYYY-MM-DD", valtva: { "csilla-harmat": N } }` a napi számlálóhoz; migráció a `mentes.js`-ben (`alapProfil` + `betolt`).
- **Napló:** `vasarlasNaplo("bank-csilla-harmat", ar, "csillampor")`.
- A rajzterv JS-e kész referencia: `kulsoSVG`, `belsoSVG`, `bankarBagoly`, `repul`, a firka-szűrő.
- Új fájl javasolt: `src/bank.js`, majd `python build.py`. Teszt: `build_teszt.py` → `_teszt_uc.html`, NÉMÍTVA; a végén töröld.
- Kód előtt `git fetch`, szerző mrzslf. Kód után frissítsd a rendszertervet (a „Kód” állapotra).

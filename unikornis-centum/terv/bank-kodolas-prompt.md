# Tündérbank: kódolás-prompt

Bemásolható nyitómondat egy friss beszélgetéshez:

> Tündérbank kódolása. Olvasd el a `unikornis-centum/terv/bank-rendszerterv.html`-t, a jóváhagyott `bank-rajzterv.html`-t, `utca-kepernyoterv.html`-t és a `bank-kodolas-prompt.md`-t, aztán kódold le a drills repóban.

## Jóváhagyott tartalom (2026-09-30 / 10-01)

- **Mit:** ✨ csillámport lehet 💧 tündérharmatra váltani, egy irányba. Egy koppintás = 1 💧.
- **Hol:** 5. épület az utca-hubon, a **jobb szélen** (fodrász · csillagbolt · kert · odú · bank). Ingyenes belépés.
- **Megújult utca** (`terv/utca-kepernyoterv.html`, jóváhagyva 2026-10-01): a lap `<script>` része KÉSZ referencia-kód (`UTCA_ELR`, `utcaMod`, `utcaHely`, `utcaFodraszRajz` … `utcaBankRajz`, `utcaJarda`, `utcaLampa`, `utcaSVG(mod, a)`) és a `u-*` animációs CSS. Ezt vidd át a `src/szalon.js` `utcaSVG()` helyére:
  - `renderUtca()` a `#utca-szinter` méretéből választ (`utcaMod(w,h)`: fekvő → `szeles` 800×460, álló → `allo` 400×760), és `resize`-ra újrarajzol, ha a mód változott.
  - `a.uniSVG` = a mostani kirakat-unikornis (`<g transform="translate(54,368) scale(0.125)">' + unikornisSVG(...) + '</g>`), `a.portalSVG` = `utcaPortalSVG()`, `a.tkSVG` = `tkLepcsoSVG()`, `a.szalonZarva` = `!P().szalon.nyitva`, `a.bankZarva` = a bank zárt-állapota.
  - A terv-lap mock `portalSVG`/`tkSVG`/`csillagSVG` NEM kell (a játékban megvannak). A `.utca-svg`-re `overflow:visible` + `preserveAspectRatio="xMidYMax meet"`, a `.utca-szinter` háttere `#12194f`.
  - Az új `id="utca-bank"` koppintása → bank-belső.
- **Pult:** váltásonként ár (✨ / 1 💧), napi korlát (opcionális, üres = nincs), ki/be, **nyitás módja** (naponta / kijelölt pályák után) és a **kijelölt pályák** listája (egyéni pálya is). Gyerekenként ÉS csoportra, egyéni > csoport. A három állapotú mezők (ki/be, mód) a pulton legördülővel: „— (öröklött)” / érték.
- **Pályás nyitás (2026-10-01):** minden végigvitt (nem csak elindított) kijelölt pálya +1 váltási lehetőség (`P().bank.jegy[valtasId]`), csak amíg a pálya ki van jelölve és a mód „pályák után”. **Megmarad másnapra.** Ha van napi korlát, az is érvényes (naponta legfeljebb annyi beváltás). Nincs jegy → halvány gomb, bagoly: „Vidd végig a(z) X-et, és válthatsz!” (max. 2 pályanév). HUD: „Váltható: N”.
  - **Nincs alapérték:** amíg sehol nincs ár, a bank ZÁRVA. Kívül „Hamarosan nyitunk” tábla, belül a bagoly: „A bank még nem nyitott ki, nemsokára gyere vissza!”
  - **Csoport-ütközés:** a szigorúbb nyer (magasabb ár, kisebb korlát, a kikapcsolt nyer, a pályás mód nyer a napi felett; a kijelölt pályák listája összeadódik). Ezt a pult szövegében is írd le.
- **Biztos?-ablak** váltás előtt, felolvasva: „Odaadsz 100 csillámport 1 tündérharmatért?” Igen / Nem.
- **Halvány gomb** esetén a bagoly megmondja, miért: „Még N csillámpor kell.” / „Mára ennyi, holnap újra jöhetsz!” / zárva-mondat.
- **Bankár:** karamellszínű, szemüveges, pink csokornyakkendős bagoly (`bankarBagoly` a rajztervben). Más figura, mint a könyvtár lila baglya (`ekBagoly`).
- **Rajz:** a gyerekek rajza alapján (`bank-rajzok/gyerekrajz-bank.png`). Kívül kékesszürke ház, két izzó sárga ablak, lila „bank” tábla, lila ajtó; belül levendula fal, kék padló, barna pult, mögötte széf forgó tárcsával, balra ✨ aranyfelhő, jobbra 💧 harmatfelhő. Váltáskor ✨ repül a sárgából a kékbe, és leesik egy 💧. Ambient mozgás a rajzterv szerint.

## Bővíthetőség (a producer kifejezett kérése)

- `VALUTAK` tábla (id, név, ikon, mentés-mező) és `VALTASOK` tábla (id, mit ad, mit kap). A `FESTEKEK` mintáját kövesd.
- Egy új sor magától jelenjen meg a bankban (új gomb) és a pulton (új sor ár/korlát/ki-be mezőkkel).
- A tárgy → pénz váltás a tábla formájában legyen előkészítve, kódja még nem kell.

## Technikai jegyzet

- **Pult-beállítás:** a `kapuOrak` / `ekStabil` mintájára külön mező a gyerek- és a csoport-dokumentumon (pl. `bank: { "csilla-harmat": { ar, korlat, ki, mod: "nap"|"palya", palyak: [id…] } }`). A `src/config.js`-ben `FELULIR.egyeniBank` / `csoportBank` / `bank` + gyorsítótár, a `felulirFigyel()` és `felulirSzamol()` mintájára. Külön összevonó függvény (`bankOsszevon`) a `src/config.js`-ben ÉS az `admin/index.html`-ben, a kettő legyen azonos.
- **Mentés:** `P().bank = { nap: "YYYY-MM-DD", valtva: { "csilla-harmat": N }, jegy: { "csilla-harmat": N } }` (napi számláló + pályával szerzett váltások); a jegyet a pálya végén (`palyaVege()`, src/engine-logic.js ~766, ahol a darabkorlát is számol) kell növelni; migráció a `mentes.js`-ben (`alapProfil` + `betolt`).
- **Napló:** `vasarlasNaplo("bank-csilla-harmat", ar, "csillampor")`.
- A rajzterv JS-e kész referencia: `kulsoSVG`, `belsoSVG`, `bankarBagoly`, `repul`, a firka-szűrő.
- Új fájl javasolt: `src/bank.js`, majd `python build.py`. Teszt: `build_teszt.py` → `_teszt_uc.html`, NÉMÍTVA; a végén töröld.
- Kód előtt `git fetch`, szerző mrzslf. Kód után frissítsd a rendszertervet (a „Kód” állapotra).

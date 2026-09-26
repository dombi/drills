# Fodrászat 2. fázis: sörény- és farokfestés, kódolás-prompt

Bemásolható nyitómondat egy friss beszélgetéshez:

> Fodrászat 2. fázis kódolása: sörény- és farokfestés. Olvasd el a `unikornis-centum/terv/fodraszat-festes-rendszerterv.html`-t és a jóváhagyott `fodraszat-festes-rajzterv.html`-t, aztán kódold le a drills repóban.

## Jóváhagyott tartalom (2026-09-26)

- **17 festék**, mind **12 💧**, egyszer kell megvenni, utána ingyen, mindhárom részre:
  - 7 különleges: Arany csillagos, Pöttyös, Szivárványos, Naplemente, Galaxis, Nyalóka, Jégkristály
  - 4 a producer rajzából (`fodraszat-rajzok/kulonleges-sorenyek.png`, sima rajzstílusban, NEM pixelesen): Tengerkék csillagos (kétszínű), Menta csillagos, Vanília csillagos, Éjszakai csillámpor
  - 6 egyszerű: Pink, Türkiz, Zöld, Levendula, Barack, Ezüst
- **Részek külön:** sörény / farok / homloktincs, részenként más festék lehet.
- **🧽 Lemosó szivacs** ingyen, a bolti sörényszín (60 ✨) marad, a festék fölé kerül.
- **Vásárlás előtt rákérdez**, nincs elég 💧 → kedves mondat.
- **Nagyobb unikornis + 3 gomb** festés közben; göndörön is megmarad; mindenhol látszik.
- **BŐVÍTHETŐ:** a gyerekek később még kérnek színeket → festéklista = adat-tábla, lapozós szekrény (8 tégely/oldal), festékenként saját ár.

## Technikai jegyzet

- A rajzterv JS-e kész referencia: `festekDef`, `reszFest`, `ketszinDef`, `csillagMinta`, `IRANY`, szekrény-lapozó.
- Mentés: `P().kinezet.festek = { soreny, farok, tincs }` (festék-id vagy null), `P().szalon.festekek = { id:1 }`; `mentes.js` migráció.
- A minta-id-k példányonként egyediek (egy képernyőn több unikornis). A Tüneménykert `forgatoSzinek` külön kezelést kér.
- Kód: `src/szalon.js`, `src/renderer.js`, `src/mentes.js`, aztán `build.py`. Teszt: build_teszt.py → `_teszt_uc.html`, némítva.

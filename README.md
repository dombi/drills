# 🎲 Matekjátékok

Kis matekos játékok gyerekeknek — böngészőben futnak, telepítés nélkül.
Közös műhely: Gergő + Gabi.

## Játék!

A főoldal a **Casino** — onnan nyílik minden terem:
- 🀄 **Bontás-Mahjong** — számbontások (pl. a 7 összes bontása) mahjong-szabályokkal
- 🃏 **Teríték** — az osztó mond egy számot, te megkeresed a lapokat hozzá (összeadás tízesátlépéssel)
- 🎱 **Szorzótábla Bingó** — a porondmester bemondja a szorzást, te kiikszeled a szelvényen
- 🦄 **Unikornis Centum** — végigvezeted az unikornist egy erdei ösvényen, és állomásonként
  hangosan felmondod a számbontásokat / megoldod az összeadás-kivonást 100-ig. Csillámpor-jutalom,
  bagoly-kabala, nyugodt tempó (nincs időnyomás). *(Chrome ajánlott a hangos válaszhoz.)*

A legtöbb játék méri az időt, és a gyerek a **saját rekordját** kergeti.

## Fejlesztőknek (nekünk)

- Minden játék egy mappa: `<jatek>/index.html + style.css + game.js` — sima
  HTML/CSS/JS, semmi függőség, semmi build. Lokálisan: `open <jatek>/index.html`.
- Új játék hozzáadása: új mappa + egy ajtó-kártya a főoldali `index.html`-ben.
- A `.claude/skills/studio/` mappában van a **stúdió-skill**: Claude Code-ban
  producer-módú játékfejlesztés (a skill leírja a teljes munkafolyamatot).
- A rekordok a böngésző localStorage-ában élnek — gépenként/böngészőnként külön.

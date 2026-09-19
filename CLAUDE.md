# Drills — közös műhely (Gergő + Gabi)

Kis böngészős matekjátékok gyerekeknek. Részletek: `README.md`.
Mindketten Claude Code-dal dolgozunk (Gergő: Mac, Gabi: Windows).

## Modellválasztás: tervezés vs. implementálás

- **Tervezés** (rendszerterv, spec, rajzterv, kódolás-prompt, döntések):
  az adott előfizetésen **elérhető legjobb modellel**. Tervezésnél a
  gondolkodás minősége számít, nem a tokenár.
- **Implementálás** (kódolás a kész terv alapján, bugfix, apró módosítás):
  a **legtokenhatékonyabb erős modellel** (pl. Opus 4.8; nem a legdrágább
  csúcsmodell). Itt a terv már megvan, a végrehajtás legyen olcsó és gyors.
- **Designer-munka ugyanígy:** a *rajzterv* (mi legyen a képen, stílus, színek,
  koncepciórajzok elbírálása) tervezés → csúcsmodell. A jóváhagyott rajzterv
  *kirajzolása* SVG-be/CSS-be már implementálás → tokenhatékony modell.
- **KÖTELEZŐ MEGÁLLÓ a terv jóváhagyása után:** ha a jóváhagyás egy tervező
  (csúcs-) modellen érkezik, Claude NEM kezd kódolni. Megáll, és MINDIG kifejezetten
  kéri a modellváltást: „Terv jóváhagyva. Kódolás előtt válts: `/model` → Opus 4.8
  (vagy a nálad elérhető tokenhatékony erős modell), aztán írd: mehet.” Csak
  ezután implementál. Ha a producer a váltás nélkül újra azt mondja, hogy mehet,
  az az ő döntése — akkor kódolhat, de ezt egy mondatban rögzítse.
- Fordítva is: ha Claude tervezési feladatot kap egy „implementáló” modellen,
  egy mondatban jelezze, és javasolja a csúcsmodellre váltást, aztán csinálja
  tovább, amit kértek.

## Munkamenet

- A kánon a `dombi/drills` repo, `main` ág. Kód előtt `git fetch`, utána
  commit + push.
- Tervek a játék mappájában, `<jatek>/terv/` alatt (pl. `unikornis-centum/terv/`).
- A stúdió-skill (`.claude/skills/studio/`) írja le a producer-módú
  játékfejlesztés menetét.

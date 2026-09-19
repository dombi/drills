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
- Ha Claude tervezési feladatot kap egy „implementáló” modellen (vagy
  fordítva), egy mondatban jelezze, és javasolja a modellváltást (`/model`),
  aztán csinálja tovább, amit kértek.

## Munkamenet

- A kánon a `dombi/drills` repo, `main` ág. Kód előtt `git fetch`, utána
  commit + push.
- Tervek a játék mappájában, `<jatek>/terv/` alatt (pl. `unikornis-centum/terv/`).
- A stúdió-skill (`.claude/skills/studio/`) írja le a producer-módú
  játékfejlesztés menetét.

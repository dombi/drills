# 🧪 Agent-próbacsapat — futtatási kézikönyv (Claude-nak)

Tervlap (jóváhagyva 2026-10-10): `Matekos\agent-probacsapat-terv.html`.
Az agentek **előszűrők az élő próba előtt**: a működést mérik, nem azt, hogy tetszik-e.
A siker fő mérője a gyerekek viselkedése (játékadatok + élő próba).

## Szint — minden élesítés előtt egy mondatban megmondom a producernek, ő rábólint

| Változás | Ki fut |
|---|---|
| 🟢 apró (szín, egy szó, egy szám) | senki |
| 🟡 új szöveg / kártya | `lektor.md` |
| 🟠 közepes (egy pálya módosul, új gomb) | `hibavadasz.md` (+ `lektor.md`, ha új szöveg) |
| 🔴 nagy (új pálya, új helyszín) | Dani + Bence + Zsófi + hibavadász (+ lektor, ha új szöveg) |

Ördögügyvéd (`ordogugyved.md`, Opus): tervlapnál, ha a producer kéri (ellenvéleményt mondhatok), ha én
javaslom, és emlékeztetem, ha ~1 hónapja / 3 jóváhagyott tervlap óta nem futott.

## Menet

1. `git fetch` + pull a `drills` repóban.
2. Teszt-build: `py -3 unikornis-centum\probacsapat\build_teszt.py` → `unikornis-centum\_teszt_uc.html`
   (gitignore-ban). (`python` nincs a gépen, `py -3` kell; konzolhoz `PYTHONIOENCODING=utf-8`.)
3. Szerverek (Matekos `.claude\launch.json`): `preview_start` `uc-proba-1` … `uc-proba-4`
   (8811–8814). ⚠️ **A böngészőben legfeljebb ~9 fül lehet** („tab cap reached”): a `preview_start`
   által nyitott füleket (és minden más fölösleges fület) zárd be az indítás előtt, egyet hagyj meg,
   különben a pane bezárul. Egyszerre legfeljebb 5 agent fusson. **Minden játékos-agent saját portot kap** → külön localStorage, nem írják felül
   egymás mentését. A lektor a `127.0.0.1:8811`-et használja (az is külön origin).

   | Agent | Cím | Válaszmód |
   |---|---|---|
   | Dani | `http://localhost:8811/_teszt_uc.html` | beszéd (`__say`) |
   | Bence | `http://localhost:8812/_teszt_uc.html` | beírás |
   | Zsófi | `http://localhost:8813/_teszt_uc.html` | beszéd (`__say`) |
   | Hibavadász | `http://localhost:8814/_teszt_uc.html` | mindkettő |
   | Lektor | `http://127.0.0.1:8811/_teszt_uc.html` | — (csak generátor + szöveg) |

4. Agentek indítása **egyszerre, háttérben**, `Agent` eszközzel, `subagent_type: general-purpose`,
   `model: sonnet` (az ördögügyvéd: `opus`). A prompt összerakása:
   `kozos-szabalyok.md` + (játékosnál `jatekos-alap.md` + a személy-kártya) / a szerep fájlja
   + a **feladatlap**: melyik pálya (id), mi változott, melyik port, mire figyeljen külön.
   A fájlokat olvastasd be az agenttel (abszolút útvonal), ne másold be — így rövidebb a prompt.
5. Összefésülés (én, Opus): duplikátumok össze, súly szerint sorba, „biztos / feltételezés” megtartva.
   Producernek: egy rövid lista (🔴 → 🟡 → 🟢) + javaslat, mit javítsunk. Ő dönt.
6. Mérés: minden agent `subagent_tokens` értékét feljegyzem (`meresek.md`).
7. Zárás: `preview_stop` mind, `_teszt_uc.html` törlése, fülek bezárva.

## Az első próba kérdése (2026-10-10, Bújócska-rét)

Találnak-e a gyerek-játékosok olyat, amit a hibavadász nem? Ha nem → a gyerek-játékosokat elhagyjuk.

## Fájlok

- `kozos-szabalyok.md` — mindenkinek
- `jatekos-alap.md` — a gyerek-játékosok közös játékszabálya
- `dani.md`, `bence.md`, `zsofi.md` — személy-kártyák („most tudja” sor: a producer szólására frissítendő)
- `hibavadasz.md`, `lektor.md`, `ordogugyved.md` — szerepek
- `build_teszt.py` — a teszt-build (hamis beszéd, néma hang, rAF→setTimeout)
- `meresek.md` — token-mérések futásonként

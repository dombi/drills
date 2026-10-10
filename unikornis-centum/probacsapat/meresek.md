# Token-mérések (futásonként)

| Dátum | Pálya / változás | Szint | Agent | Modell | Token | Idő |
|---|---|---|---|---|---|---|
| 2026-10-10 | (technikai próba: böngésző elérhető-e) | — | próba | sonnet | 65 625 | 14 s |
| 2026-10-10 | Bújócska-rét (1. próba) | 🔴 | lektor | sonnet | 107 533 | 113 s (fül nélkül, a kódból — tab cap) |
| 2026-10-10 | Bújócska-rét (1. próba) | 🔴 | Dani | sonnet | 85 797 | 174 s (44 hívás, ~13 feladat) |
| 2026-10-10 | Bújócska-rét (1. próba) | 🔴 | Bence | sonnet | 117 454 | 265 s (120 hívás, ~12 feladat) |
| 2026-10-10 | Bújócska-rét (1. próba) | 🔴 | Zsófi | sonnet | 109 050 | 296 s (72 hívás, 8 feladat + újrakezdés) |
| 2026-10-10 | Bújócska-rét (1. próba) | 🔴 | hibavadász | sonnet | 120 495 | 314 s (50 hívás) |
| | **1. próba összesen (5 agent)** | 🔴 | | | **≈ 540 000** | ~5 perc (párhuzamosan) + összefésülés |

Tanulság (1. próba): egy agent ~85–120 e token — a becsült 300–800 e-nél jóval kevesebb.
A gyerek-játékosok találtak olyat, amit a hibavadász nem (első-betöltéses térkép-összeomlás, beíró-mező fókusz)
→ a gyerek-játékosok MARADNAK. Hibák a folyamatban: a hibavadász egyszer más fülére küldött billentyűt
(→ `kozos-szabalyok.md`: minden hívásnál tabId); a lektor nem kapott fület (tab cap → README).

| 2026-10-10 | Régi építőkockák (2. próba) | 🔴 | Dani | sonnet | 272 974 | 1693 s (435 hívás, 2 Mesekönyv végig + Tekercsek) |
| 2026-10-10 | Régi építőkockák (2. próba) | 🔴 | Bence | sonnet | 239 242 | 1188 s (326 hívás) |
| 2026-10-10 | Régi építőkockák (2. próba) | 🔴 | hibavadász | sonnet | ≈ 223 000 + megszakadt 1. futás | API-korlát miatt megállt, folytatva; mobile mérés elveszett |
| 2026-10-10 | Régi építőkockák (2. próba) | 🔴 | ördögügyvéd | opus | 156 393 | 240 s (csak olvasás) |
| | **2. próba összesen (4 agent)** | 🔴 | | | **≈ 900 000+** | ~30 perc |

Tanulság (2. próba): a régi kockák 29–43 feladatos pályák → a gyerek-agentek végigjátszották (a Tekercs nyitásáért),
ezért kétszer annyiba kerültek, mint a Bújócskán. Legközelebb: a zárt pályát a feladatlap nyissa ki előre (mentésbe írva),
és „legfeljebb N feladat” határ. A hibavadász az 5. agent-kör alatt a session-korlátba futott → nagy próbát ne indíts
kevés maradék kerettel. A lefagyott/leállt 8814-es szerver a mobile mérést vitte el.

| 2026-10-10 | Bagolykönyvtár kérdései (rész/egész) | 🟡 rövid | Dani | sonnet | 115 401 | 352 s (112 hívás, ~13 kérdés) |
| 2026-10-10 | Bagolykönyvtár kérdései (rész/egész) | 🟡 rövid | Bence | sonnet | 161 452 | 545 s (203 hívás, ~12 kérdés) |
| | **3. próba összesen (2 agent)** | | | | **≈ 277 000** | ~9 perc |

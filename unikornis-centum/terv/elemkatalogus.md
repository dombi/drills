# 🧱 Elemkatalógus — amiből egy pálya-recept választ

Új pályánál ezt olvasd, ne a nagy modulokat (terv: `terv/palya-recept-terv.html` 4. pont). Egy sor = egy kész elem: mit tud, mit kér.
A recept a `src/receptek.js`-ben él (`RECEPT({...})`, csak adat). Új elem → kis elem-lap + rajz csak hozzá + kód, és ide egy sor.

## 📍 Helyek (a pálya háza / bódéja)
- **bódé** (Vásár-sátor) — `palyahely.js` `phBode`, `LIGET_HELY.vasar` · a ligetben sorban
- **ház** a Piactéren — `piac.js` `PIAC_HAZAK[hely]` (bolt · letra · csalad · zsib = szekér-stand, `PH_HAZ.zsib.cel`: hová sétál az unikornis) + `palyahely.js` `phHaz` · recept: `regio: "piac", hely: "<kulcs>"`
- később: tönk, gombaház, pavilon (rajzterv kész: `terv/palyahely-rajzterv.html`)

## 🪧 Tárgyak (`src/keret.js`, mind SVG-szöveget ad)
- `kfFok(x, y, w, bal, valasz, allapot)` — létrafok (ures · kerdez · rossz · kesz · magatol · fenyes · alap)
- `kfTabla(x, y, w, h, tartalom, allapot)` — tábla, ide ír a gyerek ("" · jo · rossz · var)
- `kfUgras(ug, op, x0, y, egys, mod)` — ugrás a számvonalon a kerek tízesen át; a célt sosem írja ki (alak · lepes)
- `kfAblak(x, y, m, op, tart[3], allapot, helyAttr, kavicsAttr)` — ablak 3 kavics-hellyel (tart: szám · null · "?"; jo · csalad · most)
- `kfKavics(x, y, n, m, attr, allapot)` — kerek kő a számmal ("" · fenyes · halvany); telefonon m ≥ 1.25 → ≥ 44 px
- `kfKosar(x, y, w, felirat, attr)` — fonott kosár (félretevő hely, számsor)
- `kfTaller(x, y, v, k, attr)` — tallér (helyiérték-színben, a bolt rajza); felvehető, ha attr `.jl-fog` · a tallér-színek a képen saját néven (zsib.js `zsHe`)
- `kfBecsles(x, y, m, ar, all, beirt, koppint)` — ≈ cetli a kis szalaggal; a két szomszéd tízes koppintható (`.kf-veg[data-v]`) · ures · jo · hiba (ív + pöttyök, 5-ös végnél nyíl fel) · halvany (nincs szalag, a gyerek írja)
- `kfCedula(x, y, ar, m, maszat)` — árcédula madzagon · `kfBlokk(x, y, w, sorok, irt, o)` — blokk (o: cim, pecset ok|x, kihuz) · `kfErszeny(x, y, m, osszeg)` — erszény a felirattal
- `kfSajatId(svg, elotag)` — KÖTELEZŐ minden pálya-képen: a térkép-id-k saját néven (különben a rejtett Piactér miatt átlátszó a kép)

## ⚙️ Feladatgyártók (tiszta adat, kép nélkül)
- `rokonLetraMenet`, `rokonSegit`, `rokonSajatEll` — Rokon-létra (`szamkor100.js`)
- `szamCsalad({max, kakukk})`, `csaladBol(x, y, max, kakukk)`, `csaladKosarak()`, `csaladAblakEll` — Számcsalád
- `becslesEll(ar, v)` (hiba: szomszed · otos · kerek · tav), `becslesOsszeg(l)` — a könyv szabálya: 5-ös vég felfelé, kerek marad, előbb tagonként · `zsMaszat`, `zsEleg(o, hatar)`, `zsValassz`, `zsBlokk(o, pontos, trukk)` (osszeg · egy · polcar · dupla) — `zsib.js`
- `varazsGep` — Varázsgép (kész, vár) · bolt: fizetés, visszajáró, blokk (`bolt.js`)
- `sk100Ugras(a, op, b)`, `sk100Naplo(a, op, b, forma)` — közös: ugrás-pontok, tény-napló

## 🖼️ Képek (`JELENETEK[név]`, a jelenet-motoron) — ez az egyetlen pályánként saját rész (~150–250 sor)
- **csalad** (`src/csalad.js`) — ház 4 ablakkal; módok: rak (kavicsok) · kakukk · kosar · beir · két elrendezés (teljes / keskeny)
- **letra** (`src/letra.js`) — a létra fokai (egy fok = egy tízes) + tábla; formák: letra (magától kitölt az `indit`-ben, felmászik) · segit (3 kis fok, választás) · sajat (üres fokra koppint) · két elrendezés
- **zsib** (`src/zsib.js`) — Zsivány szekér-standja (Zsivány él: `utan`), munka-doboz balra (telefonon alul); formák: maszat (érmék a szalagra) · eleg (+ valassz) · blokk (✓/✗ + javítás) · halvany
- később **bolt** (`bolt-kep.js`) a közös ≈ cetlire

## 🎬 Jelenet-motor (`src/jelenet.js`) — a kép csak ezeket adja
`kep` (viewBox, tábla, unikornis [x, y, nagyság, irány]) · `rajz` · `utan` (a rajz után: élő szereplő a helyére) · `fogRajz` (a kézben lévő tárgy rajza) · `indit` (true = a kezdést a kép maga rajzolja és mondja el) · `felvesz` / `letesz` (🪨 felvesz–letesz: `.jl-fog[data-fog]` → `.jl-hely[data-hely]`)
· `katt` · `bekuld` · `tablaAll` · `gepi` (a kiskapu-őrnek). A motor adja: panel, tábla + beírás, billentyűzet, Kész,
unikornis (`jlUniSetal`), `jlJo(joKiir, naplo, ünneplés)`, `jlRossz(cimke, naplo)` + `JL.seg` (hiba-lépcső), `jlSzol`, állapot: `jlAllapot()`.

## 🪜 Segítség-lépcsők (a recept `segit` mezője)
- **kep** — 1. hiba: a kép mutat (ugrás alakja a „?” céllal · az egész felfénylik)
- **lepesenkent** — 2. hibától: a hang mondja a lépéseket (`rlLepesMondat`), a számot / utolsó kavicsot a gyerek adja
- halványítás: kép → semmi · kavics → beírás (Számcsalád Odú-küszöb)

## 🧱 Recept-mezők (rövid emlékeztető)
`id, nev, ikon, palcim · regio, hely · nyit {utan, osztaly} · alap {tipus} · darabFix · segit · allomasok [{nev, darab, cel, …a gyártó beállításai}]`
A `RECEPT()` adja hozzá: `egyutt, szint, osztaly, jelenet, stand (<tipus><n> / odu)`; a sátor-színek `VS_SZIN[<tipus><n>]` a kép moduljában.

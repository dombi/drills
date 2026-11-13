# 🧱 Elemkatalógus — amiből egy pálya-recept választ

Új pályánál ezt olvasd, ne a nagy modulokat (terv: `terv/palya-recept-terv.html` 4. pont). Egy sor = egy kész elem: mit tud, mit kér.
A recept a `src/receptek.js`-ben él (`RECEPT({...})`, csak adat). Új elem → kis elem-lap + rajz csak hozzá + kód, és ide egy sor.

## 📍 Helyek (a pálya háza / bódéja)
- **bódé** (Vásár-sátor) — `palyahely.js` `phBode`, `LIGET_HELY.vasar` · a ligetben sorban
- **ház** a Piactéren — `piac.js` `PIAC_HAZAK[hely]` (bolt · letra · csalad · zsib = szekér-stand · irasbeli = Garas tornya · josda = 🔭 kupolás kőház (`jsTerkepHaz`), szalag = 🎀 fa műhely orsó-cégérrel (`szlTerkepHaz`), `PH_HAZ.zsib.cel`: hová sétál az unikornis) + `palyahely.js` `phHaz` · recept: `regio: "piac", hely: "<kulcs>"`
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
- `kfCedula(x, y, ar, m, maszat)` — árcédula madzagon · `kfBlokk(x, y, w, sorok, irt, o)` — blokk (o: cim, pecset ok|x, kihuz; fiz + vissza + kihuzV: alul „fizetve / vissza”) · `kfErszeny(x, y, m, osszeg)` — erszény a felirattal · `kfKassza(x, y, m, db, vilagit)` — 🧰 pléhkassza címletenként rekesszel (db: {címlet: darab}, 0 = üres rekesz szaggatottan; vilagit: kivilágító üres rekeszek) — Zsivány zsibvására 2. kör
- `kfTalca(x, y, n, db, o)` — 🪙 tallér-tálca: n rekesz helyiérték szerint (balra a nagyobb), 10-es oszlopok, a teli oszlop papírszalagos köteg; o.fog {t: koteg|egy, p} felemelve + a letehető szomszéd kivilágít · o.villog p. A koppintást a `fuzet.js` kezeli (köteg balra = átvitel, 1 tallér jobbra = felváltás) — Garas tornya 1. kör
- `kfSajatId(svg, elotag)` — KÖTELEZŐ minden pálya-képen: a térkép-id-k saját néven (különben a rejtett Piactér miatt átlátszó a kép)

- 🔭 Jósda (`src/josda.js`, 1. kör 2026-11-13): `jsLampas(x, y, h, eg, cimke, attr)` lámpás (eg: "" · eg · lobban; a tábláján a szám) · `jsKo(x, y, t, m, attr, all)` ✨ csillagkő · `jsPotty` lépés-pötty (eg · halvany) · `jsUt` az egyenes ösvény · `jsCetli` cetli (+ „= eredmény”) · a távcső-lencse pára + gyöngy-gyűrűk (`jsDarabRajz`) · cm-vonalzó takaróval (`jsMeresRajz`) — még a josda.js-ben; ha más pálya is kéri, a keret.js-be költözik
- 🎀 Szalagműhely (`src/szalag.js`, 1. kör 2026-11-13): `szlDarab(x, y, w, szin, c, o)` szalagdarab (o: sz szaggatott · ism ? · rov rovátkák · jelolt kiszínezve · hiba · n felirat alatta · attr) · `szlKapocs(x0, x1, y, c, o)` kapcsos zárójel számmal · `szlTekercs` / `szlKapocsKartya` a polc tárgyai (darab · egész) · `szlRudTarto` rovátkás rudak egymás alatt · `szlSin` mérőléc · `szlNev` a sor neve (koppintható) · `szlKocsi` postakocsi · `hodSVG(o)` 🦫 a hód mester (var · mutat · orul) — még a szalag.js-ben; a tervlap szerinti kfSin / kfSzalag nevekkel a keret.js-be költözik, ha más pálya is kéri
- 🐢 `tikiSVG({poz})` — Tiki, az idős teknős (var · mutat · cetli · orul), 200 × 240-es doboz, talp (100, 232) · `jsTiki(x, y, k, poz)`

## ⚙️ Feladatgyártók (tiszta adat, kép nélkül)
- `rokonLetraMenet`, `rokonSegit`, `rokonSajatEll` — Rokon-létra (`szamkor100.js`)
- `szamCsalad({max, kakukk})`, `csaladBol(x, y, max, kakukk)`, `csaladKosarak()`, `csaladAblakEll` — Számcsalád
- 🔭 `kerekit(n, hely)`, `kerekEll(n, hely, v)` (hiba: kerek · otos · szomszed · tav) — a közös kerekítés-szabály (`josda.js`); `jsMuv()` művelet a cetlire, `jsSzemek(n)`
- `becslesEll(ar, v)` (= `kerekEll(ar, 10, v)`) (hiba: szomszed · otos · kerek · tav), `becslesOsszeg(l)` — a könyv szabálya: 5-ös vég felfelé, kerek marad, előbb tagonként · `zsMaszat`, `zsEleg(o, hatar)`, `zsValassz`, `zsBlokk(o, pontos, trukk)` (osszeg · egy · polcar · dupla) — `zsib.js`
- `varazsGep` — Varázsgép (kész, vár) · bolt: fizetés, visszajáró, blokk (`bolt.js`)
- `sk100Ugras(a, op, b)`, `sk100Naplo(a, op, b, forma)` — közös: ugrás-pontok, tény-napló

## 📓 A közös füzet (`src/fuzet.js`) + az írásbeli lap-gyártó (`src/irasbeli-gen.js`) — Garas tornya 1. kör (2026-11-09)
- `irGyart("szor" | "oszt", a, b, o)` → a füzetlap terve: kiosztás (sor, osz, E sz t e fejléc), a gép előre írt része, a gyerek céljai (jegy a helyén · pont · felső vessző · vonal; kell / opc), a tankönyvi lépések mondókával (m: lapra, h: kimondva) és tálca-mozdulatokkal. Szorzás: becslés → részletszorzatok (az egyesekkel; a 0 szabad; a sorrend szabad = csere-csoport) → összeg → ellenőrzés (felcserélve / ≤ 4-es szorzónál összeadással). Osztás: becslés (alsó < hányados < felső) → pontozás → felső vessző → hosszú forma (a 0 maradék szabad) → ellenőrzés (q · b + m). ⏭️ rövid forma, mellékszámítás, hiányos szorzás, hibakereső: 2–3. kör.
- `fzLap(hova, T, o)` → F — a füzet bárhová: o.mod gyerek | gep · o.ell lepes | vegen (előbb a számolás, aztán az ellenőrzés; a hibás OSZLOP gyullad ki) · o.jelol · o.talca · o.mondoka mindig | hiba | nincs · onKesz / onHiba / onLepes. F.lejatsz(kesz) a gép végigírja (sercegés + mondóka + tálca). Ceruza / radír felvesz–letesz, a ceruza hegye az aktív kockába mutat; a számjegy úgy jön, mint a játék többi részén (gép billentyűzete e.code szerint, érintőn a rendszer számbillentyűzete; képernyős számgomb nincs, csak · ' ▁), ⌫ az utoljára írt jegyet törli; a becslés zár (rossz becsléssel nem indul a számolás); csak a jegyek számítanak, a forma hiánya a végén halványan.
- `o.oldalt` (széles képernyőn a lap balra, jobbra a pálya képe = F.oldal, a felirat, a tálca, az eszközök: egy képernyőn elfér) · `o.elotolt` (Garas írása a lapon) · `o.hibakeres` (előbb a rossz jegyet kell kiradírozni) · `o.csendesHiba`
- 🐾 `garasSVG(o)` / `garasPoz(név)` — Garas, a nyest (var · valt · ujj · ir · hm · orul · mutat · csibesz) · `gaTorony(all, eg)` — a torony kívül (zart · uj · folyik · kesz) · `GA_DEFS` (`src/garas.js`)
- 🪧 `phBurok(…, { x, y, k, ceger })` — a cégér saját nagysága (Tüske néni boltja .7)
- 🧪 Próbalap: `index.html?fuzetproba` (156·4, 42·92, 756:3, 1771:7, 618:3, 1942:34 · gép ír / én írok · lépésenként / a végén · jelöl · tálca · hang)

## 🖼️ Képek (`JELENETEK[név]`, a jelenet-motoron) — ez az egyetlen pályánként saját rész (~150–250 sor)
- **csalad** (`src/csalad.js`) — ház 4 ablakkal; módok: rak (kavicsok) · kakukk · kosar · beir · két elrendezés (teljes / keskeny)
- **letra** (`src/letra.js`) — a létra fokai (egy fok = egy tízes) + tábla; formák: letra (magától kitölt az `indit`-ben, felmászik) · segit (3 kis fok, választás) · sajat (üres fokra koppint) · két elrendezés
- **zsib** (`src/zsib.js`) — Zsivány szekér-standja (Zsivány él: `utan`), munka-doboz balra (telefonon alul); formák: maszat (érmék a szalagra) · eleg (+ valassz) · blokk (✓/✗ + javítás) · halvany
- **szalag** (`src/szalag.js`) — 🎀 Rudak a sínen; formák: egyforma (toldás vagy vágás, szám nélkül) · kendo (rúd a kendő alá → beírás; később csak beírás) · kirak (mondatonként tekercs / kapocs a sorba → kiszínezi a kérdezett részt → beírja; `szlFeladat(tipus)`: valt-ered · valt-valt · valt-kiind · resz-ered · resz-resz · ossz-ered · ossz-kul · vonat-tobb · vonat-keves) · hossz (előbb „kinek van több?”, aztán kirak, fordított szöveg) · busz (visszafelé a megállókon) · vegyes
- **josda** (`src/josda.js`) — 🔭 Lámpás-utca; formák: kozel (lépegetés → kő a közelebbi lámpáshoz) · koze (kő a két lámpás közé; szám vagy művelet a cetlin) · darab (lencse, pára, kártya / becslés, fűzés tízesével, „Megszámoltam”) · meres (becsül → takaró le → mér · „vágj kb. 20 cm-t”) · vegyes; ⚠️ a recept-állomáson a fajta a `forma`, a `cel` az Odú-küszöb jele
- később **bolt** (`bolt-kep.js`) a közös ≈ cetlire

## 🎬 Jelenet-motor (`src/jelenet.js`) — a kép csak ezeket adja
`kep` (viewBox, tábla, unikornis [x, y, nagyság, irány]) · `rajz` · `utan` (a rajz után: élő szereplő a helyére) · `fogRajz` (a kézben lévő tárgy rajza) · `indit` (true = a kezdést a kép maga rajzolja és mondja el) · `felvesz` / `letesz` (🪨 felvesz–letesz: `.jl-fog[data-fog]` → `.jl-hely[data-hely]`)
· `katt` · `bekuld` · `tablaAll` · `gepi` (a kiskapu-őrnek). A motor adja: panel, tábla + beírás, billentyűzet, Kész,
unikornis (`jlUniSetal`), `jlJo(joKiir, naplo, ünneplés)`, `jlRossz(cimke, naplo)` + `JL.seg` (hiba-lépcső), `jlSzol`, állapot: `jlAllapot()`.

🪨 A felvesz–letesz közös számolása (`fvPont`, `fvLegkozelebbi`) a `src/felvesz.js`-ben él: a jelenet-motor és a 📸 album is ezt használja.

## 📸 Album-elemek (`src/album-elemek.js`) — a Fotóalbum rajzkészlete
- **Lap-hátterek** (`ALBUM_HATTER`): menta pöttyös · krém kockás · égkék felhős — **Borító-vásznak** (`ALBUM_VASZON`): menta, rózsa, levendula, égkék, méz
- **Fotó-keretek** (`ALBUM_KERET`): polaroid · ragasztószalag · keret nélkül
- **Díszek** (`ALBUM_DISZ`, `<use href="#ae-…">`): csillag, virág, szív, levél, pillangó, szivárvány, felhő, 📅 dátum-bélyegző (a letevés napja)
- **Felirat**: 6 szín (`ALBUM_FELIRAT_SZIN`), 3 méret (`ALBUM_FELIRAT_MERET`)
- **Gép, film, könyv**: `FOTO_GEP_SVG` (levendula azonnali gép), `FOTO_FILM_SVG`, `fotoKonyvSVG` (a könyv az odúban, a borító kicsiben)
- A 💧-ért vehető extrák (csipke, szív, bélyeg keret; háttér- és díszcsomagok) a 2. kód-körben jönnek ide.

## 🪜 Segítség-lépcsők (a recept `segit` mezője)
- **kep** — 1. hiba: a kép mutat (ugrás alakja a „?” céllal · az egész felfénylik)
- **lepesenkent** — 2. hibától: a hang mondja a lépéseket (`rlLepesMondat`), a számot / utolsó kavicsot a gyerek adja
- halványítás: kép → semmi · kavics → beírás (Számcsalád Odú-küszöb)

## 🧱 Recept-mezők (rövid emlékeztető)
`id, nev, ikon, palcim · regio, hely · nyit {utan, osztaly} · alap {tipus} · darabFix · segit · allomasok [{nev, darab, cel, …a gyártó beállításai}]`
A `RECEPT()` adja hozzá: `egyutt, szint, osztaly, jelenet, stand (<tipus><n> / odu)`; a sátor-színek `VS_SZIN[<tipus><n>]` a kép moduljában.

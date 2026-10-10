# 🔧 Hibavadász

Szándékosan „rosszul” használod a játékot, hogy kiderüljön, hol akad meg vagy romlik el.
Felnőtt tesztelő vagy: **szabad** a `window.UC` fogantyúkat használni (pl. `UC.palyaInditas(id)`,
`UC.J.feladat`, `UC.mentes`), és a helyes válasz kiolvasása is (`UC.J.feladat.helyes`, SZÁM).
**A kódot olvashatod** (`C:\Users\Dombi-NyárádiGabriel\drills\unikornis-centum\src\`), de csak azért,
hogy megértsd, mit nézz — a jelentés a **kipróbált** viselkedésről szóljon.

Profil: amelyiket a feladatlap mondja (alap: Ragyogás). Válaszmód: beszéd (`window.__say("13")`) és
beírás (⌨ Inkább beírom) is — mindkettőt próbáld ki.

## Mit próbálj ki (a feladatlapon megadott pályán / változáson)

1. **Dupla és gyors kattintás**: gombok kétszer gyorsan, válasz kétszer egymás után, válasz a
   következő feladat megjelenése előtt (a jó válasz után ~900 ms szünet van).
2. **Rossz válasz sorozatban** (3–5 egymás után), üres válasz, nem szám („alma”), túl nagy szám (`250`),
   negatív, tizedes.
3. **Félbehagyás**: kilépés pálya közben (vissza / térkép gomb), majd újra be — folytatja vagy elölről?
   Elveszett-e jutalom, vagy duplán jár-e?
4. **Újratöltés pálya közben** (`navigate` ugyanarra a címre, új `?x=`-szel) — mi marad meg a mentésből?
5. **Képernyőméret**: `resize_window` 1280×720 (kis laptop), 1366×768, 768×1024 (tablet), és
   `preset: "mobile"` (telefon). Kilóg-e fontos elem, takarja-e valami a feladatot / a gombokat?
   (Méretezés + képernyőfotó egy `browser_batch`-ben, mert a méret elveszhet. A végén `preset: "desktop"`.)
6. **Matek-helyesség**: a pálya generátorából mintázz 30–50 feladatot
   (`UC.GEN.hianyzo` vagy a feladatlapon megadott módon), és ellenőrizd: a helyes válasz tényleg jó,
   a számok a megadott határokon belül vannak, nincs negatív / 0 / ismétlődő gyanús feladat.
7. **Konzolhibák** minden lépés után: `read_console_messages` `onlyErrors: true`.

## A jelentésben

Minden hibához: **lépésről lépésre, hogyan lehet újra előidézni** (melyik gomb, melyik válasz, hányadik
feladat), és mit vártál helyette.

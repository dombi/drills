# Közös szabályok — minden próbacsapat-tagnak

Egy magyar gyerekeknek (3. és 5. osztály) készült matekjáték, az **Unikornis Centum** próbacsapatában
dolgozol. A dolgod: **megfigyelni és jelenteni**. A jelentésedet Claude (a fejlesztő) összefésüli,
és a producer dönt a javításokról.

## Szigorú tilalmak

- **Semmit nem módosítasz**: nem szerkesztesz fájlt, nem futtatsz git-et, nem javítasz.
- **Nem lépsz be belépőkóddal**, nem használod a „Szülőknek” / pult részt (kivéve, ha a feladatlapod kéri).
  A helyi, kód nélküli profilokkal játszol (Ragyogás / Tűz / Csillámharmat).
- **Nem küldesz semmit sehova**, nem nyitsz meg más weboldalt, csak a feladatlapon megadott címet.
- **Csend**: a teszt-változat némítva van; minden betöltés után az első JavaScript-hívásod legyen
  `UC.mentes.hang = false`.

## Böngésző

- A beépített böngészőt használod (`mcp__Claude_Browser__*`). **Saját fület nyitsz** (`tabs_create`),
  és **minden egyes hívásnál** megadod a `tabId`-t (a `computer key`/`type`-nál is! — tabId nélkül
  más tag fülére megy a billentyű).
- **Ne írd felül** a teszt-segédeket (`window.__say`, `window.__mondatok`, `window.requestAnimationFrame`). Mások fülét nem érinted. A végén bezárod a fületeket.
- Betöltés: a feladatlapon kapott cím, a végén mindig új `?x=<szám>` (pl. `?x=101`), hogy friss legyen.
- Szöveget `get_page_text` / `read_page` / `find` eszközzel olvass; **képernyőfotót csak akkor**,
  ha a kinézetet kell megnézni (kilóg-e, látszik-e, átfedik-e egymást), és akkor `scale: 0.5`-tel.
- Egy `javascript_tool`-hívás legfeljebb ~40 másodpercig tarthat. Animációt nem kell kivárnod sokáig:
  1–2 másodperc várakozás általában elég.
- Ha a fül megakad („local file”, régi kép, időtúllépés): zárd be, nyiss újat, új `?x=`-szel.

## A jelentés formája (ezt add vissza, mást ne)

```
## <a neved> — <pálya>

### Megfigyelések
| # | Mi történt | Hol (képernyő / szakasz / lépés) | Súly | Biztos vagy feltételezés |
|---|---|---|---|---|
| 1 | ... | ... | 🔴/🟡/🟢 | biztos (kipróbáltam) / feltételezés |

### Ami jól működött (legfeljebb 3 pont)
- ...

### Mit csináltam (röviden, lépésszámmal)
- ...
```

Súly: 🔴 **akadály** (nem lehet továbbmenni, rossz a matek, hiba a konzolban, adat elveszik) ·
🟡 **zavaró** (a gyerek elakadhat, félreérthet, bosszankodhat) · 🟢 **apróság**.

- **Biztos** = magad kipróbáltad és láttad. **Feltételezés** = úgy gondolod, de nem láttad.
- Legyél konkrét: idézd a szöveget, írd le a lépést. Ne általánosíts („a játék túl nehéz”).
- Ha nincs hibád, azt írd: nincs. Ne találj ki problémát, hogy legyen mit jelenteni.
- A konzolhibákat a végén nézd meg: `read_console_messages` `onlyErrors: true`.

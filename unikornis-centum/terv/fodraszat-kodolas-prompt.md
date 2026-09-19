# Unikornis Centum — FODRÁSZAT, 1. FÁZIS kódolása (göndör↔egyenes)

> **ÁLLAPOT: KÉSZ (2026-09-19).** Implementálva Opus 4.8-cal a jóváhagyott terv szerint;
> game.js (frizura + utca-hub + szalon) + index.html + style.css. Részletek: DONTESEK.md.

**Cél:** az új „fodrászat/szépségszalon" helyszín 1. fázisa, a jóváhagyott terv szerint.
A teljes terv és a jóváhagyott rajz készen van, kódolni kell. Használj **Opus** modellt
(a közös unikornis-rajzot és a navigációt érinti — nem könnyű meló).

## FONTOS a kezdés előtt
- A **KÁNON** a drills repó: `unikornis-centum/` (game.js + style.css + index.html).
  A Matekos-másolatokat NE szerkeszd.
- Claude intézi a gitet. **ELŐSZÖR: git fetch + git pull** (a neten lévő `main` a cél).
- **Párhuzamos kódolás tilos** ugyanezen a game.js-en. Ha a munkamásolat piszkos, vagy egy
  másik beszélgetés épp kódol (pl. „Kert berendezés"), NE kezdj — előbb egyeztess a producerrel.
- Kódolás előtt nézd meg, nem nyúlt-e valaki a közös `unikornisSVG`-hez.

## Mit kell megépíteni (1. FÁZIS = CSAK A FORMA)
1. **Frizura mint az unikornis ELMENTETT tulajdonsága** (mint a „kinezet"/ruha):
   `frizura = "egyenes"` (alap) | `"gondor"`. A közös `unikornisSVG` (game.js:1038) rajzolja
   be, hogy a három ucg-csoport (`uni-farok` / `uni-soreny` / `uni-tincs`, lásd game.js:1067)
   göndör vagy egyenes formájú legyen. Így **mindenhol egységesen** látszik (pálya/odú/kert/
   kirakat/gyűjtemény). A göndör = fürtös buborékok, **ugyanabban a színben** (a szín NEM
   változik, csak a forma). Definiáld EGY helyen, hogy a fürtsűrűség később 1 ponton hangolható.
2. **Utca-hub:** az odúból „Ki az utcára" gomb → éjszakai utca-nézet. Innen koppintással
   érhető el: fodrász, csillagbolt, kert/zöldséges, odú, és az **égi matek-portál**. Az utca
   KIEGÉSZÍTI a menüt (nem váltja ki). Kint = „hova megyek", odú = otthoni dolgok.
3. **Égi matek-portál:** szivárványhíd az égbe a csillagszilánkokhoz; koppintásra a MEGLÉVŐ
   pályaválasztóba visz + rövid hang („Induljunk matekozni!").
4. **Belépő a fodrászba:** egyszeri „Szalon belépő" kulcs **150✨** (Kertkapu mintára). Az utca
   ingyen, a fodrász-ajtó zárva, amíg meg nincs véve.
5. **Szalon-belső:** az unikornis a csillag-foltra áll; a két kefe a pulton:
   🌀 **Göndörítő kefe** és 〰️ **Egyenesítő kefe** — egyszeri KÉPESSÉG 💧 tündérharmatért,
   **12💧 + 12💧**. Ha megvan a kefe → szabad, ingyenes váltás. Ha nincs → koppintásra
   felajánlja a vételt 12💧-ért (mint a boltban), és rögtön alkalmazza. Hangos, kevés szöveg.
   „Kész ✓" → vissza az utcára.
   *(A körömlakk / festék-szekrény / szőrfesték a **2. FÁZIS** — most NEM kell.)*

## Tervlapok (ebben a mappában)
- `fodraszat-rendszerterv.html` — a 7 döntés + technikai háttér
- `fodraszat-rajzterv.html` — utca-hub, fodrász-belső, göndör↔egyenes a VALÓDI unikornison
- `fodraszat-rajzok/` — boltok2.png, fodraszat-belso.png, gonderites.png (a producer koncepciórajzai)

## Teszt + zárás
- Böngészőben teszteld az „uc-teszt-modszer" szerint (build_teszt.py → _teszt_uc.html,
  window.UC fogantyúk), a végén töröld a `_teszt_uc.html`-t.
- Ha kész és a konzol tiszta: **git commit + push** (main). Deploynál bumpold a game.js `?v=` jelet.
- game.js már ~4670+ soros — ha közben indokolttá válik, jelezd a külön fájlokra bontást.

---
*A 7 döntés jóváhagyva: 2026-09-18. Ez a prompt egy friss beszélgetésben indítja a kódolást.*

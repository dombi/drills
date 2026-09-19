# Kert hang-kör — hangválasztás + időzítés-terv (jóváhagyásra vár)

Készült: 2026-09-19, a `prompt-kert-hang-kor.md` 1–2. fázisa. Kód még NINCS.

## 1. Hangválasztás (csak CC0)

### Licenc-szűrés eredménye
- **BigSoundBank.com** (Joseph Sardin): a teljes gyűjtemény **CC0 1.0 Universal**, attribúció
  nem kötelező — ellenőrizve a license oldalon. Pro felvételek (mono, 48 kHz/24 bit).
- **OpenGameArt „Fantozzi's Footsteps"**: **CC0**, 12 egyedi lépés (fű/homok/kő), OGG+FLAC.
- **Pixabay**: NEM CC0. Saját „Pixabay Content License" (attribúció nem kell, de nem közkincs,
  van pár tiltás). A szabály szerint („kizárólag CC0/közkincs") kihagyjuk.
- **Freesound.org**: a keresés napján (2026-09-19) 502-es hibával nem volt elérhető, a
  találatok licencét nem tudtam ellenőrizni → nem ajánlok onnan.

### Fűropogás (séta-loop) — 3 opció
| # | Forrás | Hossz | Méret (nyers) | Miért |
|---|--------|-------|---------------|-------|
| **A (ajánlott)** | BigSoundBank „Steps in the Grass, Slow" — https://bigsoundbank.com/steps-in-the-grass-slow-s1253.html | 24 s, „easy to loop" | OGG 778 KB → **~2 s kivágat, mono 48 kbps MP3 ≈ 12 KB** | Kifejezetten loopolásra készült, tiszta, halk, lassú tempójú fű-ropogás. A legkevesebb kód: egy loopoló buffer. |
| B | BigSoundBank „Horse Walking on a Path" — https://bigsoundbank.com/horse-walking-on-a-path-s1854.html (vagy „Horse Trotting, Tall Grass" s1852) | 48 s / 55 s | kivágat ≈ 12–15 KB | Igazi ló-paták, 4-ütemű lépés — „hitelesebb" unikornishoz. Hátrány: az ösvényes inkább földes, nem ropogó; a füves viszont ügetés (gyors, dobogós), ami erősebb hang, mint amit a pasztell hangulat kér. |
| C | OpenGameArt „Fantozzi's Footsteps" — https://opengameart.org/content/fantozzis-footsteps-grasssand-stone | 12 egyedi lépés | 4 fű-lépés OGG ≈ 3–5 KB/db | Léptenkénti lejátszás (véletlen választás 4 lépésből), nincs loop-varrat, természetes variáció. Hátrány: kicsit több kód (ütemező), és a lépésütemet nekünk kell a lábmozgáshoz igazítani. |

### Nyihogás — 3 opció
| # | Forrás | Hossz | Méret | Miért |
|---|--------|-------|-------|-------|
| **1 (ajánlott)** | BigSoundBank „Little neighing call #4" — https://www.bigsoundbank.com/little-neighing-call-4-s1215.html | 2 s | OGG 65 KB → MP3 ≈ 10 KB | „Nagyon halkan nyihog, hogy a gazdájától kérje a kajáját" — halk, kedves, hívogató. Pont a pasztell hangulat. |
| 2 | BigSoundBank „Little neighing call #1" — https://www.bigsoundbank.com/little-neighing-call-1-s1212.html (a sorozat: s1212–s1218, 7 változat) | 2 s | ≈ 10 KB | Ugyanannak a lónak (Thorgal) más halk nyihogása. Javaslat: az 1-es MELLÉ egy másodikat is bevenni, és véletlenszerűen váltogatni → nem gépies. |
| 3 | BigSoundBank „Neighing of a Horse #1" (DenisChardonnet) — https://www.bigsoundbank.com/neighing-of-a-horse-1-s0284.html | 2 s | ≈ 10 KB | „Klasszikus", teltebb nyihogás. Ha a halk hívogatás túl visszafogott, ez a B-terv — de hangosabb, drámaibb. |

Kerülendők: „Horse Neighing #3" (4 s, hangos, realista), „Neighing Horse #2" (9 s, 3 nyihogás).

## 2. Időzítés-terv

**Fűropogás.** A kertben a séta a `kertSetal()` (és három testvére: `kertSetalEszik / Szagol / Fekszik`)
CSS-transition-je: hossza `mp` másodperc (0,5–3,2 s, a távolságból), közben a figurán a `.jar`
osztály lengeti a lábakat, és egy `_jarTimer` veszi le `mp·1000+80 ms` után. A hang ehhez tapad:
ahol a `.jar` felmegy, ott indul a loop (80 ms fade-in, hogy ne kattanjon), ahol lejön, ott
áll meg (150 ms fade-out). Mind a négy hívóhely egy közös `kertLepesHang(be/ki)` segédfüggvényt
hív, így egy helyen van a logika. A loop véletlen pozícióból indul a bufferben, hogy két
egymás utáni séta ne szóljon egyformán. Ha séta közben új helyre koppint a gyerek, a loop nem
indul újra, csak a leállítás időzítője tolódik. Ülés/fekvés/trükk (ezek is leveszik a `.jar`-t)
szintén leállítják.

**Nyihogás.** Séta-módban ma az unikornisra koppintva nem történik semmi (a kód kifejezetten
kihagyja). Ez lesz a nyihogás triggere: koppintás az unikornisra → egy nyihogás, ~2,5 s
lehűléssel, hogy a sorozatos bökdösés ne torlódjon. Séta indulásakor NEM nyihog (3 mp-es sétánál
percenként sokszor szólna, idegesítő lenne); opcionálisan az ételhez érve (evés kezdetén) egy
halk nyihogás jöhet — ez producer-döntés.

**Hangerő.** A meglévő `beep()` csippanások 0,22-es gain körül szólnak. A fűropogás ehhez képest
halk háttér: **~0,12**; a nyihogás előtérben, de nem harsány: **~0,30**. Mindkettő tiszteli a
`mentes.hang` (Hang: be/ki) kapcsolót. A kertben nincs felolvasás, így a TTS-sel nem ütközik.

**Betöltés és formátum.** A játék `file://`-ról is fut (`open index.html`), ahol a `fetch()`
hangfájlra Chrome-ban tiltott. Ezért a két-három klip **base64-ben ágyazva** egy külön
`kert-hangok.js`-ben él (nem a 4900 soros game.js-ben), és `decodeAudioData` bontja ki első
kertbe lépésnél (az AudioContext ekkor már fel van oldva a koppintással). Formátum: **mono MP3,
48 kbps** — ezt minden böngésző dekódolja (az OGG-ot Safari nem). Összméret ≈ 30–35 KB base64.
Sikertelen dekódolásnál csendben marad, a játék nem áll meg.

## Döntésre vár
1. Fűropogás: **A** (emberi lépés fűben, loop) / B (ló-paták) / C (léptenkénti)?
2. Nyihogás: **1 + 2 váltogatva** / csak 1 / 3?
3. Evés kezdetén is nyihogjon? (alap: nem)

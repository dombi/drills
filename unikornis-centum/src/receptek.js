/* ============ 1b) 🧱 PÁLYA-RECEPTEK — az új pálya egy rövid adatsor (Pálya-recept C kör 1. menet, 2026-10-25) ============
   Terv: terv/palya-recept-terv.html 3. pont (✅ a stúdió döntése). A recept NEM új adatforma: a RECEPT() kitölti az alapértékeket,
   és beteszi a sort a PALYAK-ba — a PALYAK-ot olvasó modulok (mentés, pult, nyitás, jelvények, sárkány…) nem tudnak róla.
   Szabály: a recept csak adat (nincs benne függvény), így később egy lépésben JSON-ná alakítható, ha a pult szerkeszteni akarja.
   A régi pályák maradnak, ahol vannak; a didaktika (mit csinál a gyerek, könyv, húzószó-csíra) a recept-lapon van, nem itt.
   Mezők: id, nev, ikon, palcim · regio + hely (a ház a Piactér falutérképén: piac.js PIAC_HAZAK) · nyit { utan, osztaly } (egy másik
   pálya első végigvitele után ébred, ezekben az osztályokban; feljebb nyitva — nyitas.js) · alap { tipus } (= a gyártó GEN[tipus] és a
   kép JELENETEK[tipus]) · darabFix (a kép szabja a darabszámot, a pult feladatszáma nem írja felül — config.js) · segit (a segítség-lépcsők
   neve, a recept-lapnak) · allomasok (Rajt + állomások; darab = feladat / állomás; cel: true = Odú-küszöb).
   A RECEPT() teszi hozzá: egyutt (a ligettel ébred, nem a liget sorában), szint, osztaly, jelenet, stand (a kép sátor-színei az ösvényen:
   <tipus><sorszám>, a célé odu). A bekötést és az ellenőrzést a betöltés végén a receptBekot() végzi (main.js). */

var RECEPTEK = [];
function RECEPT(r) {
  var pa = {}, k, n = 0;
  for (k in r) pa[k] = r[k];
  pa.recept = true; pa.egyutt = true; pa.jelenet = r.alap.tipus;
  if (pa.szint == null) pa.szint = 6;
  if (pa.osztaly == null) pa.osztaly = r.nyit && r.nyit.osztaly ? r.nyit.osztaly[0] : 1;
  pa.allomasok = r.allomasok.map(function (o, i) {
    var c = {}; for (var kk in o) c[kk] = o[kk];
    if (i > 0 && !c.stand) c.stand = c.cel ? "odu" : r.alap.tipus + (++n);
    return c;
  });
  RECEPTEK.push(pa); PALYAK.push(pa);
  return pa;
}
/* a betöltés végén: a ház a Piactéren a recept pályáját kapja; ami hiányzik (gyártó, kép, ház, sátor-szín), az a konzolba */
function receptBekot() {
  RECEPTEK.forEach(function (pa) {
    var h = [];
    if (!GEN[pa.alap.tipus]) h.push("nincs gyártó: GEN." + pa.alap.tipus);
    if (!JELENETEK[pa.jelenet]) h.push("nincs kép: JELENETEK." + pa.jelenet);
    if (pa.regio === "piac") { var hz = PIAC_HAZAK[pa.hely]; if (hz) hz.palya = pa.id; else h.push("nincs ilyen ház a Piactéren: " + pa.hely); }
    if (pa.nyit && !PALYAK.some(function (p) { return p.id === pa.nyit.utan; })) h.push("nincs ilyen pálya a nyitáshoz: " + pa.nyit.utan);
    pa.allomasok.forEach(function (o) { if (o.stand && o.stand !== "odu" && !VS_SZIN[o.stand]) h.push("nincs sátor-szín: " + o.stand); });
    if (h.length && window.console) console.warn("🧱 recept " + pa.id + ": " + h.join(" · "));
  });
}

/* ══ 🪜 ROKON-LÉTRA — receptre állt (C kör 2. menet; kép: letra.js · feladat: szamkor100.js rokonLetraMenet) ══
   A gyerek a képen: a ház oldalán álló létra fokait tölti ki (egy fok = egy tízes: 7 + 5 → 47 + 5); 5 válasz = 1 létra.
   A Piactérrel együtt ébred (2–3. o.), a bolt mellett. Az ösvény sátrai a saját türkiz színek (rl1–rl4, letra.js). */
RECEPT({
  id: "rokon-letra", nev: "Rokon-létra", ikon: "🪜", regio: "piac", hely: "letra", osztaly: 2,
  palcim: "100-ig · ugyanaz az ugrás, egy tízessel arrébb",
  alap: { tipus: "letra" },
  darabFix: true,
  segit: ["ugras", "lepesenkent"],
  allomasok: [
    { nev: "Rajt" },
    { nev: "Összeadás-létra", stand: "rl1", forma: "letra", op: "+", kep: true, darab: 5 },
    { nev: "Más alappal", stand: "rl2", forma: "letra", op: "+", darab: 5 },
    { nev: "Kivonás-létra", stand: "rl3", forma: "letra", op: "-", kep: true, darab: 5 },
    { nev: "Melyik segít?", stand: "rl4", forma: "segit", op: "vegyes", darab: 4 },
    { nev: "Odú-küszöb", stand: "odu", forma: "vegyes", op: "vegyes", darab: 5, cel: true }
  ]
});

/* ══ 🦊 ZSIVÁNY ZSIBVÁSÁRA — a nehezebb bolt, a 2. receptes pálya (kép + feladat: zsib.js · recept-lap: terv/zsibvasar-recept-lap.html) ══
   A gyerek a képen: Zsivány árul, az unikornis vásárol; előbb körülbelül (≈ cetli: a közelebbi tízesre koppint), aztán pontosan.
   Tüske néni boltjának első végigvitele után ébred (2–3. o.), 4. o.-tól nyitva. 1. kör: 🫧 🎒 🧾 + Odú-küszöb; a 🪙 Nincs aprópénz a 2. körben jön. */
RECEPT({
  id: "zsibvasar", nev: "Zsivány zsibvására", ikon: "🦊", regio: "piac", hely: "zsib",
  palcim: "100-ig · előbb körülbelül, aztán pontosan",
  nyit: { utan: "tuske-bolt", osztaly: [2, 3] },
  alap: { tipus: "zsib" },
  segit: ["kep", "lepesenkent"],
  allomasok: [
    { nev: "Rajt" },
    { nev: "Maszatos ár", stand: "zsib1", forma: "maszat", darab: 4 },
    { nev: "Elég lesz?", stand: "zsib2", forma: "eleg", darab: 4, hatar: 1 },
    { nev: "Ravasz blokk", stand: "zsib3", forma: "blokk", darab: 5 },
    { nev: "Odú-küszöb", forma: "vegyes", darab: 5, cel: true, halvany: true }
  ]
});

/* ══ 🏡 SZÁMCSALÁD — az első receptes pálya (kép: csalad.js · feladat: szamkor100.js) ══
   A gyerek a képen: a háznak 4 ablaka van (+, +, −, −), mindegyikben 3 kavics-hely; koppint egy kavicsra, aztán egy helyre. 1 ház = 4 ablak.
   Könyv: OH 2. o. 85. o. (két kosár), 31. o. (kakukktojás) · húzószó-csíra: előbb az egész. A Rokon-létra első végigvitele után ébred
   (2–3. o.), 4. o.-tól nyitva (a Piactérrel). */
RECEPT({
  id: "szamcsalad", nev: "Számcsalád", ikon: "🏡", regio: "piac", hely: "csalad",
  palcim: "100-ig · előbb az egész, aztán a részei",
  nyit: { utan: "rokon-letra", osztaly: [2, 3] },
  alap: { tipus: "csalad" },
  darabFix: true,
  segit: ["kep", "lepesenkent"],
  allomasok: [
    { nev: "Rajt" },
    { nev: "Család 20-ig", max: 20, darab: 4 },
    { nev: "Család 100-ig", max: 100, darab: 4 },
    { nev: "Kakukktojás", max: 100, kakukk: true, darab: 4 },
    { nev: "Két kosár", max: 100, kosar: true, darab: 5 },
    { nev: "Odú-küszöb", max: 100, beir: true, darab: 4, cel: true }
  ]
});

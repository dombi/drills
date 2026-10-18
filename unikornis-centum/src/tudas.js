/* ============ 3c2) 📒 TUDÁS-NAPLÓ — „megy-e már?” pályánként, gyerekenként (LÁTHATATLAN) ============
   Terv: terv/sarkany-kuldetesek-rendszerterv.html, 5. szakasz (✅ jóváhagyva 2026-10-17). Sárkány-küldetések 1. kör.
   A játék pályánként feljegyzi, melyik NAPOKON volt tiszta (kerülő nélküli) végigjátszás. Ebből:
     • megy = TUDAS.megyNap (3) KÜLÖNBÖZŐ napon tiszta végigjátszás (egy napon háromszor nem számít háromnak);
     • fok, esed: az emlék-próbák helye (1 hét → 3 hét → 2 hónap, utána ≈ 4 havonta) — az 5. kód-körben élesedik,
       addig a „megy” pálya egyszerűen kimarad a küldetésből.
   A gyerek ebből SEMMIT nem lát (nincs szám, nincs minősítés); a küldetés-motor (kuldetes.js), később az intelligens
   pult, a játékadatok és a Neked szóló ösvény olvassa. Mentés: P().tud[palyaId] = { n: [tenyNap…], megy: nap|null,
   fok: 0..3, esed: nap|null, ut: utolsó végigjátszás napja }.
   A pult is betöltheti: itt csak függvény-definíció van, a P()-t használók saját tárat is kaphatnak.
   4. kör (2026-10-18): a pult „mégsem megy” gombja (FELULIR.leny.megsem["leny|palyaId"] = időbélyeg) → tudasPultVissza:
   a „megy” csendben visszavonódik, és a kattintás napja UTÁN TUDAS.visszaNap (2) újabb tiszta nap kell (s.vissza = az a
   nap, s.vk = az átvett időbélyeg, így egy kattintás csak egyszer hat). Ugyanezt használja majd a kerülős emlék-próba. */

var TUDAS = { megyNap: 3, visszaNap: 2, probaNap: [7, 21, 60], nagyonNap: 120 };   /* a számok később a pultról állíthatók */

function tudasTar(p) {
  p = p || P();
  if (!p.tud || typeof p.tud !== "object") p.tud = {};
  return p.tud;
}
function tudasSor(id, p) {
  var t = tudasTar(p), s = t[id];
  if (!s || typeof s !== "object") s = t[id] = {};
  if (!Array.isArray(s.n)) s.n = [];
  if (typeof s.megy !== "number") s.megy = null;
  if (typeof s.fok !== "number") s.fok = 0;
  if (typeof s.esed !== "number") s.esed = null;
  if (typeof s.vissza !== "number") s.vissza = null;
  return s;
}
/* a pult „mégsem megy” kattintását egyszer átveszi (csak a játékban, a saját unikornisnál) */
function tudasPultVissza(id, p) {
  if (p || typeof FELULIR === "undefined" || !FELULIR.leny || !FELULIR.leny.megsem || typeof mentes !== "object") return;
  var ts = FELULIR.leny.megsem[mentes.leny + "|" + id];
  if (typeof ts !== "number") return;
  var s = tudasSor(id);
  if (ts <= (s.vk || 0)) return;
  s.vk = ts;
  if (s.megy == null) return;
  s.megy = null; s.fok = 0; s.esed = null; s.vissza = tenyNap(ts);
}
/* hány tiszta nap számít a „megy”-hez: visszavonás után csak az azutáni napok */
function tudasTisztaNapok(s) { return s.vissza == null ? s.n.length : s.n.filter(function (d) { return d > s.vissza; }).length; }
/* a palyaVege hívja: teljes = kerülő nélkül ért végig. A nap egyszer számít; a 3. tiszta napon „megy”. */
function tudasPalyaVege(id, teljes, p) {
  if (!id) return null;
  tudasPultVissza(id, p);
  var s = tudasSor(id, p), ma = tenyNap();
  s.ut = ma;
  if (!teljes) return s;
  if (s.n.indexOf(ma) < 0) { s.n.push(ma); if (s.n.length > 40) s.n.shift(); }
  if (s.megy == null && tudasTisztaNapok(s) >= (s.vissza == null ? TUDAS.megyNap : TUDAS.visszaNap)) { s.megy = ma; s.fok = 0; s.esed = ma + TUDAS.probaNap[0]; }
  return s;
}
function tudasMegy(id, p) { tudasPultVissza(id, p); var s = tudasTar(p)[id]; return !!(s && typeof s.megy === "number"); }
function tudasNapok(id, p) { var s = tudasTar(p)[id]; return s && Array.isArray(s.n) ? s.n.length : 0; }
function tudasUtolso(id, p) { var s = tudasTar(p)[id]; return s && typeof s.ut === "number" ? s.ut : -1; }
/* esedékes-e emlék-próba (az 5. kód-körben a küldetés-motor ebből tesz vissza 1 helyet) */
function tudasEsedekes(id, p) { var s = tudasTar(p)[id]; return !!(s && s.megy != null && typeof s.esed === "number" && s.esed <= tenyNap()); }

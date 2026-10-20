/* ============ 3c2) 📒 TUDÁS-NAPLÓ — „megy-e már?” pályánként, gyerekenként (LÁTHATATLAN) ============
   Terv: terv/sarkany-kuldetesek-rendszerterv.html, 5. szakasz (✅ jóváhagyva 2026-10-17). Sárkány-küldetések 1. kör.
   A játék pályánként feljegyzi, melyik NAPOKON volt tiszta (kerülő nélküli) végigjátszás. Ebből:
     • megy = TUDAS.megyNap (3) KÜLÖNBÖZŐ napon tiszta végigjátszás (egy napon háromszor nem számít háromnak);
     • fok, esed: az emlék-próbák (5. kód-kör, 2026-10-20): a „megy” után TUDAS.probaNap (1 hét → 3 hét → 2 hónap), a 3.
       sikeres próba után „nagyon megy” (fok 3), és TUDAS.nagyonNap (≈ 4 hónap) múlva még visszajön. Esedékességkor az
       első végigjátszás a próba — akár a küldetés helyén (kuldetes.js visszateszi 1 helyre), akár magától játssza:
       tiszta → sikerült (fok + 1, új esed); kerülős → a „megy” csendben visszavonódik, és TUDAS.visszaNap új tiszta
       nap kell (s.vm = "proba"; a pultról jövő visszavonásnál s.vm = "pult"). A gyerek ebből semmit nem lát.
   A gyerek ebből SEMMIT nem lát (nincs szám, nincs minősítés); a küldetés-motor (kuldetes.js), később az intelligens
   pult, a játékadatok és a Neked szóló ösvény olvassa. Mentés: P().tud[palyaId] = { n: [tenyNap…], megy: nap|null,
   fok: 0..3, esed: nap|null, ut: utolsó végigjátszás napja, pr: az utolsó sikeres emlék-próba napja,
   vissza / vm: a visszavonás napja és oka }.
   A pult is betöltheti: itt csak függvény-definíció van, a P()-t használók saját tárat is kaphatnak.
   4. kör (2026-10-18): a pult „mégsem megy” gombja (FELULIR.leny.megsem["leny|palyaId"] = időbélyeg) → tudasPultVissza:
   a „megy” csendben visszavonódik, és a kattintás napja UTÁN TUDAS.visszaNap (2) újabb tiszta nap kell (s.vissza = az a
   nap, s.vk = az átvett időbélyeg, így egy kattintás csak egyszer hat). Ugyanezt használja a kerülős emlék-próba (5. kör). */

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
  tudasVisszavon(s, tenyNap(ts), "pult");
}
/* a „megy” csendben visszavonódik: a nap UTÁN TUDAS.visszaNap új tiszta nap kell */
function tudasVisszavon(s, nap, ok) { s.megy = null; s.fok = 0; s.esed = null; s.vissza = nap; s.vm = ok; }
/* a következő emlék-próba napja a fok-adik sikeres próba után */
function tudasKovProba(fok, nap) { return nap + (fok < TUDAS.probaNap.length ? TUDAS.probaNap[fok] : TUDAS.nagyonNap); }
/* hány tiszta nap számít a „megy”-hez: visszavonás után csak az azutáni napok */
function tudasTisztaNapok(s) { return s.vissza == null ? s.n.length : s.n.filter(function (d) { return d > s.vissza; }).length; }
/* a palyaVege hívja: teljes = kerülő nélkül ért végig. A nap egyszer számít; a 3. tiszta napon „megy”.
   Esedékes emlék-próbánál ez a végigjátszás a próba: tiszta → a következő próba később; kerülős → visszavonás. */
function tudasPalyaVege(id, teljes, p) {
  if (!id) return null;
  tudasPultVissza(id, p);
  var s = tudasSor(id, p), ma = tenyNap();
  s.ut = ma;
  if (s.megy != null && s.esed != null && s.esed <= ma) {
    if (teljes) { s.fok = Math.min(s.fok + 1, TUDAS.probaNap.length); s.esed = tudasKovProba(s.fok, ma); s.pr = ma; }
    else tudasVisszavon(s, ma, "proba");
  }
  if (!teljes) return s;
  if (s.n.indexOf(ma) < 0) { s.n.push(ma); if (s.n.length > 40) s.n.shift(); }
  if (s.megy == null && tudasTisztaNapok(s) >= (s.vissza == null ? TUDAS.megyNap : TUDAS.visszaNap)) { s.megy = ma; s.fok = 0; s.esed = tudasKovProba(0, ma); }
  return s;
}
function tudasMegy(id, p) { tudasPultVissza(id, p); var s = tudasTar(p)[id]; return !!(s && typeof s.megy === "number"); }
function tudasNapok(id, p) { var s = tudasTar(p)[id]; return s && Array.isArray(s.n) ? s.n.length : 0; }
function tudasUtolso(id, p) { var s = tudasTar(p)[id]; return s && typeof s.ut === "number" ? s.ut : -1; }
/* esedékes-e emlék-próba (a küldetés-motor ebből tesz vissza 1 helyet) */
function tudasEsedekes(id, p) { tudasPultVissza(id, p); var s = tudasTar(p)[id]; return !!(s && s.megy != null && typeof s.esed === "number" && s.esed <= tenyNap()); }

/* ============ 12e) FELHŐ — eseménynapló (events gyűjtemény) ============
   A producer a 3. fázis admin-felületén ebből látja a használatot. Belépés nélkül no-op.
   Offline is gyűlik: a Firestore sorba állítja, és visszatéréskor felküldi. */
var ESEMENY_HIBA_DB = 0;
function esemeny(tipus, adat) {
  if (!FELHO.aktiv || !FELHO.db) return;
  try {
    FELHO.db.collection("events").add({
      uid: FELHO.uid,
      unicornId: mentes.leny,
      type: tipus,
      ts: firebase.firestore.FieldValue.serverTimestamp(),
      data: JSON.parse(JSON.stringify(adat || {}))
    }).catch(function () {});
  } catch (e) {}
}
function vasarlasNaplo(targyId, ar, valuta) { esemeny("vasarlas", { targyId: String(targyId), ar: ar, valuta: valuta }); }
window.addEventListener("error", function (e) {
  if (++ESEMENY_HIBA_DB > 20) return;       /* egy munkamenetben legfeljebb 20 hiba-esemény */
  esemeny("error", { msg: String(e.message || "").slice(0, 300), fajl: String(e.filename || "").split("/").pop(), sor: e.lineno || 0 });
});

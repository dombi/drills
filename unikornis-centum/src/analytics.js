/* ============ 12e) FELHŐ — eseménynapló (events gyűjtemény) ============
   A producer a 3. fázis admin-felületén ebből látja a használatot. Belépés nélkül no-op.
   Offline is gyűlik: belépve a Firestore sorba állítja; 📴 ha a felhő még nem él (nincs net, nem jött le az SDK),
   a gép uc_esemeny_sor-jába kerül (max. ESEMENY_SOR_MAX), és a következő belépéskor tsKliens-szel felmegy. */
var ESEMENY_HIBA_DB = 0;
function esemeny(tipus, adat) {
  megfEsemeny(tipus, adat);   /* 🔍 megfigyelő napló (megf-naplo.js): felhő nélkül is gyűlik, a mentéssel megy fel */
  if (!FELHO.aktiv || !FELHO.db) { esemenySorba(tipus, adat); return; }
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
/* 📴 net nélküli esemény a gép sorába — csak felhő-módban, és csak ha tudjuk, kié a helyi mentés */
function esemenySorOlvas() {
  try { var l = JSON.parse(localStorage.getItem(FELHO_ESEMENY_SOR) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}
function esemenySorIr(l) {
  try { if (l.length) localStorage.setItem(FELHO_ESEMENY_SOR, JSON.stringify(l)); else localStorage.removeItem(FELHO_ESEMENY_SOR); }
  catch (e) { try { localStorage.setItem(FELHO_ESEMENY_SOR, JSON.stringify(l.slice(-Math.floor(l.length / 2)))); } catch (e2) {} }   /* tele a tár: a régebbi fele kiesik */
}
function esemenySorba(tipus, adat) {
  if (!FELHO.be) return;
  var uid = felhoGazda(); if (!uid) return;
  try {
    var l = esemenySorOlvas();
    l.push({ uid: uid, u: mentes.leny, t: tipus, ts: Date.now(), d: JSON.parse(JSON.stringify(adat || {})) });
    if (l.length > ESEMENY_SOR_MAX) l = l.slice(l.length - ESEMENY_SOR_MAX);   /* a legrégebbi esik ki */
    esemenySorIr(l);
  } catch (e) {}
}
/* belépés után: a saját sorát felküldi (batch-enként ≤ 400), a másik gyerekét (közös gép) meghagyja. Visszaad: { db, palya } */
function esemenySorKuld() {
  var ki = { db: 0, palya: 0 };
  if (!FELHO.aktiv || !FELHO.db) return ki;
  var l = esemenySorOlvas(); if (!l.length) return ki;
  var sajat = l.filter(function (x) { return x && x.uid === FELHO.uid; });
  if (!sajat.length) return ki;
  esemenySorIr(l.filter(function (x) { return !(x && x.uid === FELHO.uid); }));   /* előbb kivesszük: újratöltésnél se menjen fel kétszer */
  var FV = firebase.firestore.FieldValue;
  try {
    for (var i = 0; i < sajat.length; i += 400) {
      var b = FELHO.db.batch();
      sajat.slice(i, i + 400).forEach(function (x) {
        b.set(FELHO.db.collection("events").doc(), { uid: FELHO.uid, unicornId: x.u || null, type: String(x.t), ts: FV.serverTimestamp(), tsKliens: +x.ts || Date.now(), offline: true, data: x.d || {} });
      });
      b.commit().catch(function (e) { console.warn("[felhő] net nélküli események feltöltése:", e.code || e); });
    }
  } catch (e) {}
  ki.db = sajat.length;
  sajat.forEach(function (x) { if (x.t === "palya_end") ki.palya++; });
  return ki;
}
function vasarlasNaplo(targyId, ar, valuta) { esemeny("vasarlas", { targyId: String(targyId), ar: ar, valuta: valuta }); }
window.addEventListener("error", function (e) {
  if (++ESEMENY_HIBA_DB > 20) return;       /* egy munkamenetben legfeljebb 20 hiba-esemény */
  esemeny("error", { msg: String(e.message || "").slice(0, 300), fajl: String(e.filename || "").split("/").pop(), sor: e.lineno || 0 });
});

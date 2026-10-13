/* 🤖 Gépi próba — pályatípus-kulcs (a böngészőben; a matek.js elé és a ②/⑤ őrhöz fűzve).
   Két pálya ugyanolyan típusú, ha ugyanabban a ligetben van, és az első feladata ugyanúgy kér választ
   (beírás / felmondás / maradékos / koppintós kártya / dobogó) ugyanazzal a különleges menettel
   (vásár, könyvtár, olvasó-polc, „Mi bújt el?”, kéz nélküli). A ② méret- és ⑤ kiskapu-őr típusonként egyet néz. */
function TIPUS_KULCS(pa, f) {
  f = f || {};
  return [pa.regio || "osszeado", f.csalad || "?", f.vs && "vasar", f.ek && "konyvtar", f.polc && "polc",
          f.hianyzo && "bujocska", f.naplo && /^meres-/.test(f.naplo.tipus || "") && "meres", pa.kez_nelkul && "kez"].filter(Boolean).join("/");
}
/* ha a matek-őr nem futott (--csak meret,kiskapu): minden pályát elindít, és megnézi az első feladatát */
async function tipusokGyujt() {
  var ki = {};
  function pihen(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var pf = document.querySelector("#profil-lista .profil-kartya"); if (pf && document.querySelector("#kepernyo-profil.aktiv")) { pf.click(); await pihen(300); }
  var palyak = UC.PALYAK.filter(function (p) { return !p.hamarosan; });
  for (var i = 0; i < palyak.length; i++) {
    try { UC.palyaInditas(palyak[i].id); } catch (e) { continue; }
    var t0 = Date.now();
    while (Date.now() - t0 < 8000 && !(UC.J && UC.J.palya.id === palyak[i].id && UC.J.feladat)) await pihen(40);
    if (UC.J && UC.J.feladat && UC.J.palya.id === palyak[i].id) ki[palyak[i].id] = TIPUS_KULCS(palyak[i], UC.J.feladat);
    await pihen(150);
  }
  if (document.getElementById("jatek-haza")) document.getElementById("jatek-haza").click();
  await pihen(300);
  return ki;
}

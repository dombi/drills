/* ============ 9) SZÜLŐI NÉZET ============ */
var szuloiFul = "ragyogas";
function renderSzuloi() {
  var fbox = $("szuloi-fulek"); fbox.innerHTML = "";
  LENY_SORREND.forEach(function (k) {
    var f = el("div", "szuloi-ful" + (k === szuloiFul ? " aktiv" : ""), LENYEK[k].nev);
    f.addEventListener("click", function () { szuloiFul = k; renderSzuloi(); });
    fbox.appendChild(f);
  });
  var p = mentes.profilok[szuloiFul];
  var keszDb = 0, jatszhato = 0;
  PALYAK.forEach(function (pa) { if (!pa.hamarosan && !palyaRejtve(pa)) { jatszhato++; if (p.palyak[pa.id] && p.palyak[pa.id].kesz) keszDb++; } });
  var perc = Math.round(p.jatekMp / 60);
  var perPalya = "";
  PALYAK.forEach(function (pa) {
    if (pa.hamarosan) return;
    var sorok = p.naplo.filter(function (r) { return r.palya === pa.id; });
    var ossz = sorok.length, jo = sorok.filter(function (r) { return r.elsore; }).length;
    perPalya += "<tr><td>" + kiiras(pa.nev) + "</td><td>" + (ossz ? Math.round(jo / ossz * 100) + "%  (" + jo + "/" + ossz + ")" : "—") + "</td></tr>";
  });
  var atl = p.naplo.filter(function (r) { return r.atlepes; });
  var atlJo = atl.filter(function (r) { return r.elsore; }).length;
  var bont = p.naplo.filter(function (r) { return r.tipus === "szambontas"; });
  var bontJo = bont.filter(function (r) { return r.elsore; }).length;
  var szt = p.naplo.filter(function (r) { return r.tipus === "szorzotabla-felmondas"; });
  var sztJo = szt.filter(function (r) { return r.elsore; }).length;
  $("szuloi-osszegzes").innerHTML =
    "<h3>Összegzés — " + LENYEK[szuloiFul].nev + (p.becenev ? " (" + kiiras(p.becenev) + ")" : "") + "</h3><table>" +
    "<tr><td>Játékidő összesen</td><td>" + (perc >= 1 ? perc + " perc" : (p.jatekMp + " mp")) + "</td></tr>" +
    "<tr><td>Kész pályák</td><td>" + keszDb + " / " + jatszhato + " elérhető</td></tr>" +
    "<tr><td>Tízesátlépéses feladatok</td><td>" + (atl.length ? Math.round(atlJo / atl.length * 100) + "% elsőre (" + atlJo + "/" + atl.length + ")" : "még nincs adat") + "</td></tr>" +
    "<tr><td>Számbontás felmondás</td><td>" + (bont.length ? Math.round(bontJo / bont.length * 100) + "% elsőre (" + bontJo + "/" + bont.length + ")" : "még nincs adat") + "</td></tr>" +
    "<tr><td>Szorzótábla felmondás</td><td>" + (szt.length ? Math.round(sztJo / szt.length * 100) + "% elsőre (" + sztJo + "/" + szt.length + ")" : "még nincs adat") + "</td></tr>" +
    "</table><h3 style='margin-top:14px'>Pályánként (elsőre jó)</h3><table>" + (perPalya || "<tr><td>—</td></tr>") + "</table>";
  var hibak = p.naplo.filter(function (r) { return !r.elsore; }).slice(-20).reverse();
  var hs = hibak.map(function (r) { return "<tr><td>" + kiiras(r.kerdes) + "</td><td>" + kiiras(r.valasz) + "</td><td>" + r.helyes + "</td></tr>"; }).join("");
  $("szuloi-hibak").innerHTML = "<h3>Legutóbbi tévesztések</h3>" +
    (hs ? "<table><tr><th>Feladat</th><th>Amit mondott</th><th>Helyes</th></tr>" + hs + "</table>" : "<p>Még nincs tévesztés a naplóban.</p>");
  $("beall-hang").checked = !!mentes.hang;
  $("beall-valaszmod").value = mentes.valaszmod;
  $("beall-becenev").value = p.becenev || "";
  $("beszed-tamogatas").textContent = beszedTamogatott
    ? "A beszédfelismerés ebben a böngészőben működik."
    : "Ebben a böngészőben a beszéd nem elérhető — a gyerek a számbillentyűzettel játszik. (Chrome ajánlott.)";
}


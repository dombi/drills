/* ============ 6o2) 🐪 RAKODÁS — a dobogó testvére: csomagok a tevék hátára, koppintással ============
   Rajz: Matekos\szerszam-letrak-egesz-rajzterv.html 4. pont (✅ 2026-10-16) · átnézés: …-egesz-mit-atnezes.html 4. döntés (✅).
   Ugyanaz a koppintós elem, mint a 🏆 dobogó (dobogo.js: két koppintás, bárki bárhova, a tál a föld), csak más a rajz:
   a helyek a tevék hátán vannak (D.keret = "teve"). A tevén már fent lévő csomag sötétebb, és nem mozdul (nem is gomb).
   A jó elrendezést nem egy lista adja, hanem a szabály (rakJo): minden csomag fent van, és minden tevén ugyanakkora a teher —
   így a két megoldású feladatnál (🏅 tevék) bármelyik jó. A D.jo csak a végigvezetésnek és a gépi próbának kell (egy jó megoldás).
   A tevék terhe rakodás közben NEM látszik (rajzterv 3. döntés ✅): csak a kosár-tipp után (R.sulyLat), amikor jobbra fent
   a kis kosár is megjelenik („🧺 14 kg → 7 + 7”).

   A feladat rakodás-része: f.rakodas = R = {
     tevek: ["Fuvi", "Nuvi"], fix: [[2], [4]] (ami már fent van), uj: [3, 5] (a földön), per: 1 (tevénként ennyi új csomag),
     megold: [ [[5], [3]] , … ] (tevénként az új csomagok; az elsőt kapja a D.jo), sulyLat: false }
   A helyek sorrendje: az i. hely a (i % tevék száma). teve (i / tevék száma). helye — így a szomszédos helyek más tevén vannak. */

var RAK_SZIN = ["#f4a6c0", "#a9d4f5", "#b9e3a8", "#ffd27a"];               /* a tevék takarója */
var RAK_DOBOZ = { 1: "#e9c79a", 2: "#dcb98c", 3: "#f0cf9e", 4: "#d8b07a", 5: "#e6c28e", 6: "#d4a874", 7: "#ecc996", 8: "#dbb27e", 9: "#cf9f68" };

function rakOssz(R) { var s = 0; R.fix.forEach(function (t) { t.forEach(function (x) { s += x; }); }); R.uj.forEach(function (x) { s += x; }); return s; }
function rakEgy(R) { return rakOssz(R) / R.tevek.length; }
function rakId(kg) { return "k" + kg; }
function rakKg(id) { return +String(id).slice(1); }
function rakHelyTeve(R, i) { return i % R.tevek.length; }
/* a dobogó-feladat (f.dob) a rakodásból */
function rakDob(R) {
  var T = R.tevek.length, n = T * R.per, jo = [];
  for (var i = 0; i < n; i++) jo.push(rakId(R.megold[0][i % T][Math.floor(i / T)]));
  return { keret: "teve", n: n, R: R, cimkek: null, teliM: "Előbb rakd fel az összes csomagot!", joFn: rakJo,
    sorok: [{ nev: "csomag", darabok: R.uj.slice().sort(function (a, b) { return a - b; }).map(function (kg) { return { id: rakId(kg), nev: kg + " kg", kep: rakDobozSVG(kg) }; }) }],
    jo: [jo] };
}
/* tevénként a teher (kg) az állás szerint (hely: a 0. sor) */
function rakTeher(R, hely) {
  var t = R.fix.map(function (L) { return L.reduce(function (a, b) { return a + b; }, 0); });
  hely.forEach(function (id, i) { if (id != null) t[rakHelyTeve(R, i)] += rakKg(id); });
  return t;
}
function rakJo(hely) {
  var R = DOB && DOB.f.dob.R; if (!R || hely.some(function (x) { return x == null; })) return false;
  var t = rakTeher(R, hely);
  return t.every(function (x) { return x === t[0]; });
}
/* egy elrendezés kulcsa (tevénként a csomagok, sorban) — a „van még egy” ezzel hasonlít */
function rakKulcs(R, hely) {
  var L = R.tevek.map(function () { return []; });
  hely.forEach(function (id, i) { if (id != null) L[rakHelyTeve(R, i)].push(rakKg(id)); });
  return L.map(function (x) { return x.sort(function (a, b) { return a - b; }).join("+"); }).join("|");
}
function rakMegoldKulcs(m) { return m.map(function (x) { return x.slice().sort(function (a, b) { return a - b; }).join("+"); }).join("|"); }

/* ── rajzok ── */
function rakDobozSVG(kg, fix) {
  var c = fix ? "#b98a55" : (RAK_DOBOZ[kg] || "#e2bf8c"), w = 34 + Math.min(kg, 9) * 1.6;
  return '<svg viewBox="0 0 60 46" aria-hidden="true"><rect x="' + (30 - w / 2) + '" y="8" width="' + w + '" height="34" rx="4" fill="' + c + '" stroke="#7a5230" stroke-width="2"/>' +
    '<path d="M' + (30 - w / 2) + ',18 H' + (30 + w / 2) + '" stroke="#7a5230" stroke-width="1.2" opacity=".5"/><path d="M30,8 V42" stroke="#a8743c" stroke-width="3" opacity=".55"/>' +
    '<text x="30" y="37" text-anchor="middle" font-family="Fredoka,system-ui,sans-serif" font-size="19" font-weight="700" fill="' + (fix ? "#fff3dc" : "#4a3020") + '">' + kg + '</text></svg>';
}
/* a teve oldalról (balra néz), a púpja fölött a teher helye; a takaró színe a sorszámból */
function rakTeveSVG(k) {
  var t = RAK_SZIN[k % RAK_SZIN.length];
  return '<svg class="rak-teve-kep" viewBox="0 0 120 92" aria-hidden="true">' +
    '<g stroke="#8a6a3e" stroke-width="2" stroke-linecap="round" fill="#e8c48a">' +
    '<path class="rak-lab1" d="M44,60 L42,88 M54,62 L55,88" fill="none" stroke-width="6"/><path class="rak-lab2" d="M84,60 L86,88 M94,58 L97,88" fill="none" stroke-width="6"/>' +
    '<path d="M36,46 Q36,26 58,24 Q66,8 78,22 Q96,24 100,42 Q104,62 86,64 L48,64 Q34,62 36,46 Z"/>' +
    '<path d="M40,46 Q30,34 26,22 Q24,12 16,12 Q6,12 6,20 Q6,26 14,26 Q20,28 22,36 Q26,50 36,56 Z"/>' +
    '<path d="M100,40 Q110,46 108,58" fill="none" stroke-width="3"/></g>' +
    '<circle cx="12" cy="18" r="1.8" fill="#3a3040"/><path d="M6,22 Q8,24 10,22" stroke="#8a6a3e" stroke-width="1.4" fill="none"/>' +
    '<path d="M18,12 Q19,6 22,8" stroke="#8a6a3e" stroke-width="2" fill="#e8c48a"/>' +
    '<path d="M50,30 Q58,20 70,24 Q80,22 90,32 L90,48 Q70,52 50,48 Z" fill="' + t + '" stroke="#8a6a3e" stroke-width="1.6" opacity=".95"/>' +
    '<path d="M54,48 L54,54 M64,49 L64,56 M74,49 L74,56 M84,48 L84,54" stroke="' + t + '" stroke-width="3" stroke-linecap="round"/></svg>';
}
/* a jobb lap (dobogo.js dobTerRajz hívja, ha D.keret === "teve") */
function rakTerRajz(D) {
  var R = D.R, T = R.tevek.length, teher = rakTeher(R, DOB.hely[0]), h = "";
  R.tevek.forEach(function (nev, k) {
    var helyek = "";
    for (var p = R.per - 1; p >= 0; p--) helyek += dobHely(0, p * T + k, null, "rak-h");
    var fix = R.fix[k].map(function (kg) { return '<span class="rak-fix" aria-label="' + kg + ' kg, már fent van">' + rakDobozSVG(kg, true) + '</span>'; }).join("");
    h += '<div class="rak-teve" data-k="' + k + '"><div class="rak-teher">' + helyek + fix + '</div>' + rakTeveSVG(k) +
      '<span class="rak-nev">' + nev + '</span>' + (R.sulyLat ? '<span class="rak-suly' + (teher[k] === rakEgy(R) ? " jo" : "") + '">' + teher[k] + ' kg</span>' : '') + '</div>';
  });
  var kos = R.sulyLat ? '<div class="rak-kosar" aria-label="az összes súly">🧺 ' + rakOssz(R) + ' kg → ' + R.tevek.map(function () { return rakEgy(R); }).join(" + ") + '</div>' : '';
  var elso = "";                                                 /* 🏅 két megoldásnál: az első jó elosztás kicsiben fölötte marad */
  if (R.talalt) elso = '<div class="rak-elso">✓ ' + R.talalt.split("|").map(function (x, k) { return R.tevek[k] + ": " + R.fix[k].concat(x.split("+")).join(" + "); }).join(" · ") + '</div>';
  return '<div class="dob-ter k-teve t' + T + '">' + elso + kos + '<div class="rak-tevek">' + h + '</div><div class="rak-homok"></div></div>';
}
/* a kosár-tipp: a kis kosár + a tevék terhe (onnantól látszik). Visszaadja a bagoly mondatát. */
function rakKosarMutat(f) {
  var R = f && f.rakodas; if (!R) return "";
  R.sulyLat = true;
  if (DOB && DOB.f === f) dobRajz();
  var lap = document.querySelector("#buborek-feladat .rak-kosar"); if (lap) { lap.classList.remove("uj"); void lap.offsetWidth; lap.classList.add("uj"); }
  var dar = R.fix.reduce(function (a, t) { return a.concat(t); }, []).concat(R.uj);
  return "Előbb az összes súly: " + dar.join(" + ") + ". Mennyi jut egy tevére?";   /* 🖊️ lektorra (rajzterv 4. pont) */
}
/* a gyerek magára a tevére koppintott (nem egy helyre): ami a kezében van, az első üres helyére kerül; ha a teve tele van,
   a legfelső új csomaggal cserél (dobogo.js dobKatt hívja). false = nem történt semmi. */
function rakTeveKatt(k) {
  var R = DOB && DOB.f.dob.R, K = DOB && DOB.kez; if (!R || !K || K.r !== 0) return false;
  var T = R.tevek.length, ures = -1, felso = -1;
  for (var p = 0; p < R.per; p++) { var i = p * T + k; if (DOB.hely[0][i] == null) { if (ures < 0) ures = i; } else felso = i; }
  var cel = ures >= 0 ? ures : felso;
  if (cel < 0 || cel === K.honnan) { DOB.kez = null; return true; }
  if (K.honnan != null && rakHelyTeve(R, K.honnan) === k) { DOB.kez = null; return true; }   /* a saját tevéjére tenné vissza */
  dobHelyKatt(0, cel);
  return true;
}

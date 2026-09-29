/* ═════════════════ 📓 VÉGIGVEZETÉS-FÜZET (Bagolykönyvtár) ═════════════════
   Terv: Matekos/vegigvezetes-fuzet-rajzterv.html · döntések 2026-09-29 (A✅ B✅ C✅ D✅).
   Több lépéses pöttynél (végigvezetés VAGY lánc-kérdés) minden jó rész-válasz után egy füzetlapra
   „íródik be” a lépés — ahogy a papíron kell: ❓ mit kérdeznek → műveletsorok → „Válasz: …” mondat.
   A gép ír, a gyerek nem. A füzet NEM beszél: csendes írás + halk ceruza-sercegés (Web Audio zaj,
   némítás = mentes.hang). Beszéd csak végigvezetés végén, 1 mondat (EKF_MONDAT).
   Széles képernyőn a füzet balra, a feladat mellett; keskenyen a buborékba, a feladat alá kerül.
   Az engine-logic ertekel() hívja: ekFuzetJo(f) · a GEN.konyvtar új pöttynél: ekFuzetTorol(). */
var EKF_MONDAT = "Nézd, így kell leírni a füzetbe!";
var EKF_SZELES = 960;                         /* px: e fölött a füzet a feladat mellett, balra */
var EKF_SOR_KESL = 250;                       /* ms két egyszerre beíródó sor között */
var EKF_NEZI = 2200;                          /* ms: a kész füzetlap ennyi ideig látszik a következő feladat előtt (a mondat után is) */

function ekFuzetTorol() {
  J.ekFuzet = { sorok: [], aktiv: false, vezetett: false, sor: 0 };
  var d = document.getElementById("ek-fuzet");
  if (d) { d.hidden = true; d.querySelector(".ekf-sorok").innerHTML = ""; }
}
function ekFuzetDoboz() {
  var d = document.getElementById("ek-fuzet");
  if (!d) {
    d = el("div", "ek-fuzet");
    d.id = "ek-fuzet"; d.hidden = true;
    d.innerHTML = '<div class="ekf-spiral"></div><div class="ekf-fej">📓 Füzetem</div><div class="ekf-sorok"></div><div class="ekf-ceruza">✏️</div>';
  }
  ekFuzetHelyez(d);
  return d;
}
/* széles: a játéktérben balra · keskeny: a buborékban, a feladat alatt (a kérdés és a válasz marad felül) */
function ekFuzetHelyez(d) {
  d = d || document.getElementById("ek-fuzet"); if (!d) return;
  var szeles = window.innerWidth >= EKF_SZELES;
  var hova = szeles ? document.querySelector("#kepernyo-jatek .jatekter") : $("bagoly-buborek");
  if (!hova) return;
  d.classList.toggle("benn", !szeles);
  if (szeles) { if (d.parentNode !== hova) hova.appendChild(d); }
  else if (d.parentNode !== hova || d.previousElementSibling !== $("buborek-feladat")) hova.insertBefore(d, $("buborek-feladat").nextSibling);
}
window.addEventListener("resize", function () { ekFuzetHelyez(); });

/* egy sor beírása (a füzet sorában villan, balról jobbra „íródik”, közben ceruza-sercegés) */
function ekFuzetIr(sorok) {
  var d = ekFuzetDoboz(), S = d.querySelector(".ekf-sorok"), kesl = 0;
  sorok.forEach(function (s) {
    var hossz = Math.max(0.5, Math.min(1.4, ekSima(s.h).length * 0.055));
    setTimeout(function () {
      if (!J || !J.ekFuzet) return;
      S.querySelectorAll(".ekf-sor.uj").forEach(function (x) { x.classList.remove("uj"); });
      var r = el("div", "ekf-sor uj " + (s.cls || ""));
      r.innerHTML = s.h; r.style.animationDuration = hossz + "s";
      S.appendChild(r);
      d.hidden = false;
      if (d.classList.contains("benn")) r.scrollIntoView({ block: "nearest" });
      else S.scrollTop = S.scrollHeight;
      ceruzaSerceg(hossz);
    }, kesl);
    kesl += hossz * 1000 + EKF_SOR_KESL;
  });
  return kesl;                                /* ms, amíg minden sor beíródik */
}

/* a feladat megoldás-sora → füzet-sorok: „24 : 4 = 6, 6 + 5 = 11” két sor lesz; a már beírtat nem írja újra;
   művelet nélküli sor („5 Ft-tal”, „4 láb”) elé halvány címkét tesz: a kérdést */
function ekFuzetMuveletSorok(f) {
  var m = String(f.megoldas == null ? f.helyes : f.megoldas), R = J.ekFuzet.sorok, ki = [];
  var reszek = m.split(", ");
  if (reszek.length < 2 || reszek.some(function (x) { return x.indexOf("=") < 0; })) reszek = [m];
  reszek.forEach(function (r) {
    if (r.indexOf("=") >= 0 && R.indexOf(r) >= 0) return;   /* a végén újra kérdezett, már leírt művelet nem kerül be kétszer */
    R.push(r);
    var cimk = (/[=→]/.test(r) || !f.szoveg) ? "" : '<span class="ekf-cimk">' + ekSima(f.szoveg).replace(/^Most újra a kérdés:\s*/, "") + '</span> ';
    ki.push({ h: cimk + r, cls: cimk ? "cimkes" : "" });
  });
  return ki;
}

/* „Válasz:” mondat a kérdésből: a kérdőszó helyére a szám kerül („Hány napig nyaralt Anna?” → „21 napig nyaralt Anna.”) */
var EKF_KERDOSZO = [
  [/(^|\s)mennyibe(?=\s)/i, function (n) { return n + " Ft-ba"; }],
  [/(^|\s)mennyivel(?=\s)/i, function (n) { return ekRag(n, "val"); }],
  [/(^|\s)hányféle(?=\s)/i, function (n) { return n + "-féle"; }],
  [/(^|\s)hányat(?=\s)/i, function (n) { return ekRag(n, "t"); }],
  [/(^|\s)hányan(?=\s)/i, function (n) { return n + "-" + (n % 10 ? "eeaeeaeae"[n % 10 - 1] : "eaaeeaeae"[(n % 100) / 10 - 1] || "e") + "n"; }],   /* „3-an”, „2-en”, „20-an” */
  [/(^|\s)hány(?=\s)/i, function (n) { return String(n); }],
  [/(^|\s)mennyit(?=\s)/i, function (n) { return ekRag(n, "t"); }]
];
function ekValaszMondat(kerdes, n) {
  var s = ekSima(kerdes).replace(/\s+/g, " ").trim()
    .replace(/^(Most újra a kérdés:|A csúcs:|\d+\. lépcsőfok:)\s*/i, "").replace(/^És\s+/, "")
    .replace(/[A-ZÁÉÍÓÖŐÚÜŰ]{2,}/g, function (w) { return w.toLowerCase(); });
  var mond = s.split(/(?<=[.?!])\s+/);         /* több mondat („Senkinek sincs igaza! … Hány bonbon maradt?”) → az utolsó kérdő mondat */
  for (var m = mond.length - 1; m > 0; m--) if (EKF_KERDOSZO.some(function (K) { return K[0].test(mond[m]); })) { s = mond[m]; break; }
  if (n === 1) s = s.replace(/(^|\s)hányan vannak/i, "$1csak 1 ilyen van");   /* nem „1-en vannak” */
  var mm = s.match(/^mennyi (.+?)\s*\?$/i);   /* „Mennyi a … összege?” → „A … összege 58.” */
  if (mm) return ekNagy(mm[1]) + " " + n + ".";
  for (var i = 0; i < EKF_KERDOSZO.length; i++) {
    var K = EKF_KERDOSZO[i];
    if (K[0].test(s)) {
      s = s.replace(K[0], function (x, elo) { return elo + K[1](n); }).replace(/\s*\?\s*$/, ".");
      return ekNagy(s);
    }
  }
  return n + ".";
}

/* jó válasz után (engine-logic ertekel) */
function ekFuzetJo(f) {
  if (!f.ek) return;
  if (!J.ekFuzet) ekFuzetTorol();
  var F = J.ekFuzet, tovabbLanc = !!(f.lanc && f.lanc.length);
  if (f.vezet) { F.aktiv = true; F.vezetett = true; }
  if (tovabbLanc) F.aktiv = true;
  if (!F.aktiv) return;                       /* egyetlen kérdéses pötty: nincs füzet */
  var ki = [];
  if (f.ek.fuzetMit) ki.push({ h: '❓ <span class="ekf-alahuz">' + f.megoldas + '</span>', cls: "kerd" });
  else if (f.csalad !== "koppint") ki = ekFuzetMuveletSorok(f);
  if (!tovabbLanc && f.csalad !== "koppint") {
    ki.push({ h: "Válasz: " + ekValaszMondat(f.ek.teljes || f.ek.kerdes, f.helyes), cls: "valasz" });
    if (F.vezetett) f.utoMondat = (f.utoMondat ? f.utoMondat + " " : "") + EKF_MONDAT;
    f.fuzetVar = ekFuzetIr(ki) + (F.vezetett ? 0 : EKF_NEZI);   /* a kész lapot a gyerek még megnézheti, mielőtt jön a következő */
  } else if (ki.length) ekFuzetIr(ki);
}

/* ✏️ ceruza-sercegés: szűrt fehérzaj apró húzásokban — generált hang, nincs licenc-kérdés */
var EKF_ZAJ = null;
function ceruzaSerceg(mp) {
  if (!mentes.hang) return;
  var c = ac(); if (!c) return;
  if (c.state === "suspended") { try { c.resume(); } catch (e) {} }
  if (!EKF_ZAJ) {
    EKF_ZAJ = c.createBuffer(1, c.sampleRate, c.sampleRate);
    var a = EKF_ZAJ.getChannelData(0);
    for (var i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  }
  var src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(), t0 = c.currentTime + 0.02;
  src.buffer = EKF_ZAJ; src.loop = true;
  bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = 0.9;
  g.gain.setValueAtTime(0.0001, t0);
  for (var t = 0; t < mp; ) {                 /* húzások: 50–130 ms, közöttük rövid szünet */
    var h = 0.05 + Math.random() * 0.08, v = 0.03 + Math.random() * 0.025;
    g.gain.setTargetAtTime(v, t0 + t, 0.012);
    g.gain.setTargetAtTime(0.0001, t0 + t + h, 0.02);
    bp.frequency.setValueAtTime(2600 + Math.random() * 1400, t0 + t);
    t += h + 0.03 + Math.random() * 0.05;
  }
  src.connect(bp); bp.connect(g); g.connect(c.destination);
  src.start(t0, Math.random() * 0.5); src.stop(t0 + mp + 0.15);
}

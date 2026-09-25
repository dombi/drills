/* ============ 10) ESEMÉNYEK ============ */
function hosszuNyomas(gomb, kesz) {
  var t = null;
  function ind(e) { e.preventDefault(); gomb.classList.add("nyomva"); t = setTimeout(function () { gomb.classList.remove("nyomva"); kesz(); }, 2000); }
  function vege() { if (t) clearTimeout(t); t = null; gomb.classList.remove("nyomva"); }
  gomb.addEventListener("pointerdown", ind);
  gomb.addEventListener("pointerup", vege);
  gomb.addEventListener("pointerleave", vege);
  gomb.addEventListener("pointercancel", vege);
}
/* ── KÉZMENTES HANG (Tízesek ösvénye): felolvas → pittyentés → magától figyel ── */
function kezNelkulE() {
  return !!(J && J.palya && J.palya.kez_nelkul && beszedTamogatott
    && mentes.valaszmod !== "beiras" && !J.kezBeiras
    && J.feladat && J.feladat.csalad === "egyenkent");
}
function kezNelkulModUI() {
  $("mondom-gomb").style.display = "none";
  $("szambillentyuzet").hidden = true;
  $("beiro-doboz").hidden = true;
  $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
  $("beiras-valt").textContent = "⌨ Inkább beírom";
}
function kezNelkulKor() {
  if (!kezNelkulE()) return;
  $("hallgat-e").hidden = true;
  $("visszajelzes").className = "visszajelzes";
  $("visszajelzes").textContent = "";
  mondd(J.feladat.felolvas, function () {
    if (!kezNelkulE()) return;
    beep(1046, 0.12, "sine", 0, 0.18);                 /* „vége a kérdésnek" pittyentés */
    setTimeout(kezNelkulFigyel, 280);
  });
}
function kezNelkulFigyel() {
  if (!kezNelkulE()) return;
  $("hallgat-e").hidden = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelj(function (alt) {
    $("hallgat-e").hidden = true;
    var n = elsoSzam(alt.join(" "));
    if (n == null) { kezNelkulCsend(); return; }
    J.kezCsend = 0;
    ertekel(n);
  }, function (hiba) {
    $("hallgat-e").hidden = true;
    if (hiba === "not-allowed" || hiba === "service-not-allowed" || hiba === "nincs") {
      beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
      $("visszajelzes").className = "visszajelzes";
      $("visszajelzes").textContent = "Most beírással játszunk.";
      J.kezBeiras = true; modBeallit();
      return;
    }
    kezNelkulCsend();
  });
}
function kezNelkulCsend() {
  if (!kezNelkulE()) return;
  J.kezCsend = (J.kezCsend || 0) + 1;
  var f = J.feladat;
  if (J.kezCsend === 1) {
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Halljam a választ! 🎤";
    mondd("Mondd bátran a választ!", function () {
      if (kezNelkulE()) { beep(1046, 0.1, "sine", 0, 0.16); setTimeout(kezNelkulFigyel, 240); }
    });
  } else if (J.kezCsend === 2) {
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Figyelj a kérdésre!";
    mondd(f.felolvas, function () {
      if (kezNelkulE()) { beep(1046, 0.12, "sine", 0, 0.18); setTimeout(kezNelkulFigyel, 280); }
    });
  } else {
    /* 3. csönd → előjön a számbillentyűzet (szégyenmentes kiút) */
    J.kezBeiras = true; J.kezCsend = 0;
    $("visszajelzes").className = "visszajelzes";
    $("visszajelzes").textContent = "Írd be a választ, ha így könnyebb 🙂";
    $("mondom-gomb").style.display = "none";
    $("szambillentyuzet").hidden = true;
    $("beiro-doboz").hidden = false; beiroReset();
    $("beiras-valt").style.display = beszedTamogatott ? "" : "none";
    $("beiras-valt").textContent = "🎤 Inkább mondom";
  }
}
/* ── KÉZMENTES HANG a felmondás-pályán (Erdei bontás): felolvas → pittyentés →
   magától indul az élő hallgatás (bontasEloStart, CSAK a legelső indításnál nulláz).
   Pár-onként: pipa + csilingelés + felszólító pittyegés. Elakadásnál (csend/félrehallás)
   NINCS reset: bontasEloBotlas() megmutatja a soron következő párt és bontasEloFolytat()
   figyel tovább ugyanabból az FB.sor-ból; csak 4× elakadás vagy „Kész vagyok" → beírás. ── */
function felmondKezNelkulE() {
  return !!(J && J.palya && J.palya.kez_nelkul && beszedTamogatott
    && mentes.valaszmod !== "beiras" && !J.lepesAktiv   /* beírós módban NINCS auto-hangfigyelés */
    && J.feladat && J.feladat.csalad === "felmondas");
}
function felmondKezNelkulKor() {
  if (!felmondKezNelkulE()) return;
  mondd(J.feladat.felolvas, function () {
    if (!felmondKezNelkulE()) return;
    beep(1046, 0.12, "sine", 0, 0.18);
    setTimeout(function () { if (felmondKezNelkulE()) bontasEloStart(); }, 280);
  });
}
function mikrofonInd() {
  var felm = J.feladat.csalad === "felmondas";
  /* a bontás-felmondás ÉLŐ hallgatással megy: a gomb indít, majd „Kész vagyok"-ként zár */
  if (felm) {
    if (FB.aktiv) bontasEloVege(); else bontasEloStart();
    return;
  }
  var g = $("mondom-gomb");
  var hj = $("hallgat-e");
  g.classList.add("figyel"); g.textContent = "🎤 Hallgatlak…";
  hj.hidden = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelj(function (alt) {
    g.classList.remove("figyel"); g.textContent = felm ? "🎤 Mondom a bontását" : "🎤 Mondom a megoldást";
    hj.hidden = true;
    if (felm) felmondErtekel(alt);
    else if (J.feladat.csalad === "maradekos") {
      var szamok = szamokKinyer(alt.join(" "));
      if (szamok.length >= 2) ertekel({ h: szamok[0], m: szamok[1] });
      else { $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = szamok.length === 1 ? "Mondd a maradékot is!" : "Nem hallottam — mondd még egyszer!"; }
    } else {
      var n = elsoSzam(alt.join(" "));
      if (n == null) { $("visszajelzes").className = "visszajelzes"; $("visszajelzes").textContent = "Nem hallottam — mondd még egyszer!"; }
      else ertekel(n);
    }
  }, function (hiba) {
    g.classList.remove("figyel"); g.textContent = felm ? "🎤 Mondom a bontását" : "🎤 Mondom a megoldást";
    hj.hidden = true;
    var cel = felm ? "visszajelzes-f" : "visszajelzes";
    $(cel).className = "visszajelzes";
    if (hiba === "nincs" || hiba === "not-allowed" || hiba === "service-not-allowed") {
      beszedTamogatott = false; mentes.valaszmod = "beiras"; ment();
      $(cel).textContent = "Most beírással játszunk.";
      if (felm) bontasLepesNyit(); else modBeallit();
    } else { $(cel).textContent = "Nem hallottam — mondd még egyszer!"; }
  });
}
function belepSzuloi() { hangGomb(); szuloiFul = mentes.leny; renderSzuloi(); mutat("kepernyo-szuloi"); }
/* „tovább megoldás nélkül": csak Csillámharmattal ÉS csak a producer MRZS tesztkódjával (2026-09-24).
   Minden más játékosnál — és belépés nélkül is — rejtve marad. */
function tovabbMehetE() {
  return mentes.leny === "csillamharmat" && FELHO.aktiv && /^MRZS/.test(FELHO.kod || "");
}
function tovabbMegoldasNelkul() {
  if (!J || !tovabbMehetE()) return;
  hangGomb(); figyelStop();
  if (J.feladat && J.feladat.csalad === "felmondas") { $("bontas-lepes").hidden = true; J.feladatKesz++; allomasKesz(); return; }
  J.feladatKesz++;
  if (J.feladatKesz >= J.feladatDb) allomasKesz(); else ujFeladat();
}
function esemenyek() {
  billentyuzetEpit();
  bekotUresNegyzet();
  hosszuNyomas($("profil-szuloi"), belepSzuloi);
  hosszuNyomas($("fomenu-szuloi"), belepSzuloi);
  $("fomenu-vissza").addEventListener("click", function () { hangGomb(); sorozatMegtor(); renderProfil(); mutat("kepernyo-profil"); });
  $("jatek-haza").addEventListener("click", function () { hangGomb(); figyelStop();
    if (J && J.palya) esemeny("palya_kilep", { palyaId: J.palya.id, allomas: J.allomasIdx, feladat: J.futoOssz, idoMp: Math.round((Date.now() - (J.indultMs || Date.now())) / 1000) });
    sorozatMegtor(); try { speechSynthesis.cancel(); } catch (e) {} renderFomenu(); mutat("kepernyo-fomenu"); });
  $("mondom-gomb").addEventListener("click", mikrofonInd);
  $("mondom-bontas-gomb").addEventListener("click", mikrofonInd);
  $("bontas-kesz-gomb").addEventListener("click", function () {
    hangGomb(); $("bontas-kesz-gomb").hidden = true; allomasKesz();
  });
  $("halld-ujra").addEventListener("click", function () {
    if (!J || !J.feladat) return;
    if (kezNelkulE()) { figyelStop(); kezNelkulKor(); return; }
    mondd(J.feladat.felolvas);
  });
  $("halld-ujra-f").addEventListener("click", function () { if (J && J.feladat) mondd(J.feladat.felolvas); });
  $("beiras-valt").addEventListener("click", function () {
    hangGomb(); figyelStop();
    if (J && J.kezBeiras) {                 /* kézmentes pályán vissza a hangra */
      J.kezBeiras = false; J.kezCsend = 0;
      $("szambillentyuzet").hidden = true; $("beiro-doboz").hidden = true;
      kezNelkulModUI(); kezNelkulKor();
      return;
    }
    mentes.valaszmod = (mentes.valaszmod === "beiras") ? "beszed" : "beiras";
    if (!beszedTamogatott) mentes.valaszmod = "beiras";
    ment(); modBeallit();
  });
  $("bontas-beiras").addEventListener("click", function () { hangGomb(); if (J && J.lepesAktiv) felmondHangVissza(); else bontasLepesNyit(); });
  /* Enter globális tartalék a beírós módban: akkor is ellenőriz, ha a fókusz épp nincs mezőn */
  document.addEventListener("keydown", function (e) {
    var kj = $("kepernyo-jatek");
    if (!kj || !kj.classList.contains("aktiv") || !J || !J.feladat) return;
    /* felmondós lépésenkénti beírás: Enter ellenőrzi az aktív sort (a számjegyeket
       maguk a valódi <input>-mezők kezelik) */
    if (J.lepesAktiv) {
      if (e.key === "Enter") { e.preventDefault(); bontasSorEllenoriz(); }
      return;
    }
    /* egyenkénti beírós mód: a gép FIZIKAI billentyűzete írja az ÜRES NÉGYZETET.
       Számjegy = beír, Backspace = töröl, Enter = ellenőriz. A négyzet (#beiro-doboz)
       csak beírós módban látszik, felmondásnál rejtve. Tableten a négyzetre koppintva
       a rendszer-számbillentyűzete írja a #beiro-mezo-t (ilyenkor ez a kezelő kimarad). */
    var sb = $("beiro-doboz");
    if (!sb || sb.hidden) return;
    var ae = document.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) return;
    /* a számjegyet a billentyű FIZIKAI helyéből olvassuk ki (e.code), nem a leütött
       karakterből (e.key) — így a magyar kiosztáson is megy, ahol a felső számsor
       Shift nélkül nem sima számot ad; a numerikus billentyűzet is jó. Tartalék: e.key. */
    var d = null;
    if (/^Digit[0-9]$/.test(e.code)) d = e.code.charAt(5);
    else if (/^Numpad[0-9]$/.test(e.code)) d = e.code.charAt(6);
    else if (e.key && e.key.length === 1 && e.key >= "0" && e.key <= "9") d = e.key;
    if (d !== null) {
      if (J.beirt.length < 3) { J.beirt += d; $("beiro-kijelzo").textContent = J.beirt; hangGomb(); }
      e.preventDefault();
    } else if (e.key === "Backspace") {
      if (J.beirt) { J.beirt = J.beirt.slice(0, -1); $("beiro-kijelzo").textContent = J.beirt; }
      e.preventDefault();
    } else if (e.key === "Enter") {
      billentyuBekuld(); e.preventDefault();
    }
  });
  $("tovabb-megoldas-nelkul").addEventListener("click", tovabbMegoldasNelkul);
  $("tovabb-megoldas-nelkul-f").addEventListener("click", tovabbMegoldasNelkul);
  $("kerulo-gomb").addEventListener("click", keruloUt);
  $("ft-haza").addEventListener("click", function () { hangGomb(); fejtoroKilep(); });
  $("vege-fomenu").addEventListener("click", function () { hangGomb(); renderFomenu(); mutat("kepernyo-fomenu"); });
  $("szuloi-vissza").addEventListener("click", function () { hangGomb(); renderProfil(); mutat("kepernyo-profil"); });
  $("beall-hang").addEventListener("change", function () { mentes.hang = $("beall-hang").checked; ment(); });
  $("beall-valaszmod").addEventListener("change", function () { mentes.valaszmod = $("beall-valaszmod").value; ment(); });
  $("beall-becenev").addEventListener("input", function () { mentes.profilok[szuloiFul].becenev = $("beall-becenev").value.trim(); ment(); });
  $("beall-naplo-torles").addEventListener("click", function () {
    if (confirm("Biztos törlöd " + LENYEK[szuloiFul].nev + " naplóját? A díszek megmaradnak.")) {
      mentes.profilok[szuloiFul].naplo = []; mentes.profilok[szuloiFul].jatekMp = 0; ment(); renderSzuloi();
    }
  });
  $("fomenu-odu").addEventListener("click", function () { hangGomb(); oduNyit("fomenu"); });
  $("vege-odu").addEventListener("click", function () { hangGomb(); oduNyit("vege"); });
  $("odu-vissza").addEventListener("click", function () { hangGomb(); renderFomenu(); mutat("kepernyo-fomenu"); });
  $("odu-valto").addEventListener("click", function () { hangGomb(); sorozatMegtor(); oduPanelZar(); renderProfil(); mutat("kepernyo-profil"); });
  $("odu-osveny-nyit").addEventListener("click", function () { hangGomb(); mondd("Ösvények"); renderFomenu(); mutat("kepernyo-fomenu"); });
  $("odu-utca-nyit").addEventListener("click", function () { hangGomb(); mondd("Kimegyünk az utcára!"); utcaNyit(); });
  $("odu-katalogus-nyit").addEventListener("click", function () { hangGomb(); mondd("Bolt"); oduPanelNyit(); });
  $("odu-panel-zar").addEventListener("click", function () { hangGomb(); oduPanelZar(); });
  $("odu-jelveny-nyit").addEventListener("click", function () { hangGomb(); mondd("Jelvények"); renderJelveny(); $("odu-lap").hidden = false; });
  $("odu-gyujtemeny-nyit").addEventListener("click", function () { hangGomb(); mondd("Gyűjtemény"); renderGyujtemeny(); $("odu-lap").hidden = false; });
  $("odu-lap-zar").addEventListener("click", function () { hangGomb(); $("odu-lap").hidden = true; });
  $("kert-vissza").addEventListener("click", function () { hangGomb(); kertLepesHang(false); oduNyit("kert"); });
  $("utca-vissza").addEventListener("click", function () { hangGomb(); oduNyit(); });
  $("tk-vissza").addEventListener("click", function () { hangGomb(); tkKilep(true); });
  $("szalon-vissza").addEventListener("click", function () { hangGomb(); mondd("Kész! Szuper lettél."); utcaNyit(); });
}


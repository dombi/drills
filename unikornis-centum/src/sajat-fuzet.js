/* ============ 6j4c2) 📓 A SAJÁT FÜZET — mindenhol elővehető szabad firkalap (1. kódkör, 2026-11-27) ============
   Tervlap: terv/mindenhol-fuzet-tervlap.html (✅ 2026-11-27, mind a 10 döntés A) · memória: „Füzet kötetlen, csak a gyakorlópálya szigorú”.
   A gyerek saját füzete: a feladat-kép bal alsó sarkában fekszik (rajzolt tárgy, ceruzával a gerincén — nem gomb). Koppintásra
   kinyílik (széles képernyőn a bal ≈45%, a feladat jobbra húzódik és végig látszik; telefonon, álló helyzetben az alsó fél), újabb
   koppintásra a sarkán (vagy Esc) visszacsúszik. A lap a fuzet.js fzLap-ja, o.szabad = true: nincs cél, ellenőrzés, Kész gomb,
   mondóka, hibajelzés; számok és jelek (+ − · : =, vonal) bármelyik kockába, radír.
   🔒 A FÜZET SOSEM VÁLASZHELY. Ami a füzetbe kerül, sehová nem jut el; a válasz mindig a pályán megy (tábla, üres négyzet, cetli).
   ⌨ BILLENTYŰ-GAZDA: BILL_GAZDA = "palya" | "fuzet". A számjegy oda megy, ahova a gyerek utoljára koppintott (és a ceruza csak ott
   látszik). Kinyitáskor a füzeté, elrakáskor a pályáé. A füzetben az Enter új sort kezd, a pályán beküld, mint eddig.
   Akik figyelnek rá: fzBill (fuzet.js, csak a szabad lapnál) · events.js (üres négyzet) · jelenet.js (tábla) · bolt-kep.js · vasar.js (Enter = Tovább).
   A lap a feladat végéig megmarad (J.fuzetLap), új feladatnál tiszta (a mérés kérdés-láncán — f.sfFolytat — ugyanaz a lap marad).
   NINCS OTT: f.fuzet === false (✍️ Garas tornya: GEN.irszor; 🔭 a Jósda becslő feladatai: josda-emelet.js), a pálya / állomás
   fuzet: false jelzője, és a ☀️ Déli vásár (saját füzete van; 2. kör: vasar-fuzet.js ki, ez a füzet be).
   Senki nem szól róla: a pálya első feladatánál a tárgy egyszer megbillen; az első kinyitáskor (gyerekenként egyszer) egy felirat;
   2 rossz válasz után egy írásbeli méretű feladaton még egyszer megbillen (nem nyílik ki magától).
   Mérés (láthatatlan): megfFuzet (megf-naplo.js) — feladatonként kínálva / elővette / hány jegyet írt. */

var BILL_GAZDA = "palya";
var SF = { J: null, nyitva: false, F: null, f: null, el: null, panel: null, targy: null, elovette: false, jegy0: 0, pid: null };
var SF_ELSO_FELIRAT = "A füzetbe azt írsz, amit akarsz. A választ a feladatnál add meg.";

/* ═════════════════ A TÁRGY (rajz) ═════════════════ */
function sfTargySVG() {
  return '<svg viewBox="0 0 86 76" aria-hidden="true">' +
    '<ellipse cx="44" cy="69" rx="33" ry="4.5" fill="#5a4a80" opacity=".16"/>' +
    '<g transform="rotate(-9 44 40)">' +
      '<path d="M16 17H69a5 5 0 0 1 5 5V60a5 5 0 0 1 -5 5H16Z" fill="#fffef7" stroke="#cdb894" stroke-width="2"/>' +
      '<path d="M18 61.5H70M18 58.5H71" stroke="#e7dcc4" stroke-width="1.2"/>' +
      '<path d="M13 13H65a5 5 0 0 1 5 5V57a5 5 0 0 1 -5 5H13a4 4 0 0 1 -4 -4V17a4 4 0 0 1 4 -4Z" fill="#bfa9e8" stroke="#6f55a8" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M9 17a4 4 0 0 1 4 -4H20V62H13a4 4 0 0 1 -4 -4Z" fill="#9479cf" stroke="#6f55a8" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M31 25H59V41H31Z" fill="#fff6dc" stroke="#c9a86a" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M38 25V41M45 25V41M52 25V41M31 33H59" stroke="#d3e4f4" stroke-width="1"/>' +
      '<path d="M41 37.5l3 -8 3 8M42.2 34.5h3.6" stroke="#6a3f9a" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M62 13V62" stroke="#f093b4" stroke-width="3.4"/>' +
      /* a ceruza a gerincen */
      '<g transform="translate(14.5 6) rotate(90)"><path d="M0 -3.6H44L51 0L44 3.6H0Z" fill="#f7cf4f" stroke="#a87a1e" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M44 -3.6L51 0L44 3.6Z" fill="#f1d6ae" stroke="#a87a1e" stroke-width="1.3" stroke-linejoin="round"/><path d="M48.6 -1.2L51 0L48.6 1.2Z" fill="#3b3f52"/>' +
      '<path d="M0 -3.6h-5v7.2h5Z" fill="#f6b3c6" stroke="#b4587a" stroke-width="1.3"/></g>' +
    '</g></svg>';
}

/* ═════════════════ KELL-E? ═════════════════ */
function sfKell(f) {
  if (!J || !f || !J.palya) return false;
  if (f.fuzet === false || J.palya.fuzet === false) return false;
  var a = J.allomasok && J.allomasok[J.allomasIdx]; if (a && a.fuzet === false) return false;
  if (f.jelenet === "vsfuzet" || f.jelenet === "irszor" || f.jelenet === "irosz") return false;   /* ☀️ a Déli vásár saját füzete (2. kör) · ✍️ a torony szigorú lapja */
  return true;
}
/* írásbeli méretű-e a feladat (a 2. rossz válasz utáni billenéshez): van benne legalább háromjegyű szám */
function sfIrasbeliMeret(f) {
  if (typeof f.helyes === "number" && Math.abs(f.helyes) >= 100) return true;
  var s = String(f.szoveg || "").replace(/<[^>]*>/g, " ").replace(/(\d)[\s ](\d{3})/g, "$1$2");
  return (s.match(/\d+/g) || []).some(function (n) { return +n >= 100; });
}

/* ═════════════════ A DOBOZ: tárgy a sarokban + panel ═════════════════ */
function sfEpit() {
  var kj = $("kepernyo-jatek"); if (!kj) return false;
  if (SF.targy && SF.targy.isConnected) return true;
  var t = el("div", "sf-targy"); t.setAttribute("role", "button"); t.setAttribute("aria-label", "a füzeted"); t.tabIndex = -1;
  t.innerHTML = sfTargySVG(); t.hidden = true;
  t.addEventListener("click", function (e) { e.stopPropagation(); sfValt(); });
  var p = el("div", "sf-panel"); p.hidden = true;
  p.innerHTML = '<div class="sf-sarok" role="button" aria-label="füzet elrakása">' + sfTargySVG() + '</div><div class="sf-lap"></div>';
  p.querySelector(".sf-sarok").addEventListener("click", function (e) { e.stopPropagation(); sfZar(); });
  kj.appendChild(p); kj.appendChild(t);
  SF.targy = t; SF.panel = p;
  return true;
}
function sfKeskeny() { try { return window.matchMedia("(max-width:700px) and (orientation:portrait)").matches; } catch (e) { return false; } }
/* a panel helye: a fejléc alatt; telefonon az alsó fél */
function sfMeretek() {
  var kj = $("kepernyo-jatek"), fej = kj && kj.querySelector(".fejlec"); if (!kj) return;
  var fh = fej ? fej.offsetHeight : 52, h = kj.clientHeight || window.innerHeight;
  kj.style.setProperty("--sf-fej", fh + "px");
  kj.style.setProperty("--sf-alj", Math.round((h - fh) * 0.5) + "px");
}

/* ═════════════════ FELADAT-VÁLTÁS (engine-logic.js feladatMutat hívja) ═════════════════ */
function sfFeladat(f) {
  if (!sfEpit()) return;
  if (SF.J !== J) {   /* új pálya: a régi lap és a nyitott füzet el */
    sfNaploZar(); SF.J = J; SF.pid = J && J.palya ? J.palya.id : null; J.sfBillent = false;
    if (SF.nyitva) sfZar(true);
  }
  var folyt = f && f.sfFolytat && SF.f && J.fuzetLap;   /* mérés: ugyanannak a feladatnak a következő kérdése — a lap marad */
  if (!folyt) { sfNaploZar(); sfLapTorol(); }
  SF.f = f;
  var kell = sfKell(f);
  SF.kinal = kell;
  if (!kell) { if (SF.nyitva) sfZar(true); SF.targy.hidden = true; return; }
  SF.targy.hidden = SF.nyitva;
  if (SF.nyitva) sfLapKell();   /* nyitva maradt: tiszta lap */
  if (!J.sfBillent) { J.sfBillent = true; sfBillen(900); }
}
function sfLapTorol() {
  if (SF.F) { SF.F.torol(); SF.F = null; }
  if (J) J.fuzetLap = null;
  SF.elovette = SF.nyitva; SF.jegy0 = 0;
}
function sfLapKell() {
  if (SF.F && J.fuzetLap === SF.F) return SF.F;
  var hova = SF.panel.querySelector(".sf-lap"); hova.innerHTML = "";
  var osz, sor;
  if (sfKeskeny()) { osz = 8; sor = 5; }
  else {
    var w = Math.max(240, hova.clientWidth - 8), h = Math.max(200, hova.clientHeight - 84);
    osz = 12; sor = Math.max(5, Math.min(14, Math.floor(h / (w / osz))));
  }
  var T = new IrTerv("szabad", 0, 0); T.lep = 1; T.hely(sor - 1, osz - 1);
  SF.F = fzLap(hova, T, { szabad: true, jelek: true, csendesHiba: true, mondoka: "nincs", onIr: sfIrt });
  SF.F.jegyDb = 0;
  J.fuzetLap = SF.F;
  return SF.F;
}

/* ═════════════════ NYIT · ZÁR ═════════════════ */
function sfValt() { if (SF.nyitva) sfZar(); else sfNyit(); }
function sfNyit() {
  if (!J || !SF.f || !sfKell(SF.f) || SF.nyitva) return;
  hangGomb(); ceruzaSerceg(.15);
  sfMeretek();
  SF.nyitva = true; SF.elovette = true;
  var kj = $("kepernyo-jatek"), jt = kj.querySelector(".jatekter");
  kj.classList.add("sf-be"); if (jt) jt.classList.add("fuzet-nyitva");
  kj.classList.toggle("sf-keskeny", sfKeskeny());
  SF.panel.hidden = false; SF.targy.hidden = true;
  SF.panel.classList.remove("sf-csuszik"); void SF.panel.offsetWidth; SF.panel.classList.add("sf-csuszik");
  var F = sfLapKell();
  sfGazda("fuzet");
  if (!P().bemutatva.sajatFuzet) { P().bemutatva.sajatFuzet = 1; ment(); F.felirat(SF_ELSO_FELIRAT, "jo"); SF.feliratKint = true; }
  sfPalyaUjra();
}
function sfZar(csendben) {
  if (!SF.nyitva) return;
  if (!csendben) { hangGomb(); ceruzaSerceg(.12); }
  SF.nyitva = false;
  var kj = $("kepernyo-jatek"), jt = kj && kj.querySelector(".jatekter");
  if (kj) kj.classList.remove("sf-be", "sf-keskeny"); if (jt) jt.classList.remove("fuzet-nyitva");
  SF.panel.hidden = true;
  SF.targy.hidden = !(SF.f && sfKell(SF.f));
  sfGazda("palya");
  sfPalyaUjra();
}
/* a pálya képe a szélességéből dönti el az elrendezését (jlRajz: JL.keskeny) — nyitáskor / záráskor újra */
function sfPalyaUjra() {
  try { if (typeof JL !== "undefined" && JL && jlAktiv()) jlRajz(); } catch (e) {}
}
function sfBillen(kesik) {
  var t = SF.targy; if (!t) return;
  setTimeout(function () { if (t.hidden) return; t.classList.remove("sf-billen"); void t.offsetWidth; t.classList.add("sf-billen"); }, kesik || 0);
}

/* ═════════════════ ⌨ BILLENTYŰ-GAZDA ═════════════════ */
function sfGazda(g) {
  BILL_GAZDA = g === "fuzet" && SF.nyitva ? "fuzet" : "palya";
  if (SF.panel) SF.panel.classList.toggle("sf-gazda", BILL_GAZDA === "fuzet");
  var ae = document.activeElement;
  if (BILL_GAZDA === "fuzet") {
    if (SF.F) FZ_AKT = SF.F;
    if (ae && ae !== (SF.F && SF.F.be) && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "BUTTON")) ae.blur();   /* a pálya mezője ne kapja a számjegyet */
  } else {
    if (SF.F && ae === SF.F.be) ae.blur();
    if (SF.nyitva === false || ae === document.body) { try { if (typeof JL !== "undefined" && JL && jlAktiv()) jlFokusz(); } catch (e) {} }
  }
}
/* oda megy a billentyű, ahova a gyerek utoljára koppintott: a füzetre → füzet; a feladatra (kép, tábla, négyzet, gombok) → pálya */
document.addEventListener("pointerdown", function (e) {
  if (!SF.nyitva || !SF.panel) return;
  var t = e.target;
  if (SF.panel.contains(t)) { if (!(t.closest && t.closest(".sf-sarok"))) sfGazda("fuzet"); return; }
  var kj = $("kepernyo-jatek"); if (kj && kj.contains(t) && !(t.closest && t.closest(".fejlec"))) sfGazda("palya");
}, true);
document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape" || !SF.nyitva) return;
  var kj = $("kepernyo-jatek"); if (!kj || !kj.classList.contains("aktiv")) return;
  if (BILL_GAZDA !== "fuzet" && typeof JL !== "undefined" && JL && JL.fog) return;   /* a pályán a kézben lévő követ az Esc teszi vissza */
  if (SF.F && SF.F.vonalKezd) return;   /* a füzetben a félbehagyott vonalat az Esc csak elengedi */
  e.preventDefault(); sfZar();
});
window.addEventListener("resize", function () { if (SF.nyitva) { sfMeretek(); var kj = $("kepernyo-jatek"); if (kj) kj.classList.toggle("sf-keskeny", sfKeskeny()); } });

/* ═════════════════ RÁNÉZÉS: 2 rossz válasz egy írásbeli méretű feladaton (engine-logic.js rosszValaszKonyvel hívja) ═════════════════ */
function sfRossz(f) {
  if (!f || f !== SF.f || SF.nyitva || f.sfBillent || !SF.kinal) return;
  if ((J.probak || 0) >= 2 && sfIrasbeliMeret(f)) { f.sfBillent = true; sfBillen(700); }
}
/* az első jegy után az első-kinyitás felirata eltűnik (ne takarja a lapot) */
function sfIrt() { if (SF.feliratKint && SF.F) { SF.feliratKint = false; SF.F.felirat(""); } }

/* a pálya vége / kilépés (megf-naplo.js megfEsemeny hívja): a jel a naplóba, a füzet el, a lap tiszta */
function sfPalyaVege() {
  sfNaploZar();
  if (SF.nyitva) sfZar(true);
  if (SF.F) { SF.F.torol(); SF.F = null; }
  if (J) J.fuzetLap = null;
  SF.f = null; SF.kinal = false; SF.elovette = false;
  if (SF.targy) SF.targy.hidden = true;
}

/* ═════════════════ MÉRÉS: feladatonként egy jel (a pultnak; se jutalom, se büntetés) ═════════════════ */
function sfNaploZar() {
  if (!SF.pid || !SF.f) return;
  if (SF.kinal && typeof megfFuzet === "function") megfFuzet(SF.pid, SF.elovette, SF.F ? SF.F.jegyDb || 0 : 0);
  SF.kinal = false; SF.elovette = SF.nyitva;
}

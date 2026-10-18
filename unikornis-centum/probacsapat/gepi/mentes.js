/* 🤖 Gépi próba — ⑥ Mentés-őr segédei (a böngészőben; a mentes.py tölti be minden lap-betöltés után).
   __MO.osszevet(regi, uj): mi tűnt el / csökkent / változott a régi mentéshez képest (levélről levélre).
   A szándékos, ismert átalakítások (ENGEDETT) nem számítanak — mindegyik mellett ott a miért. */
window.__MO = (function () {
  var G = window.__GEPI_EVAL;
  /* út-minták: a „*” egy tetszőleges kulcs (profil, tárgy, sorszám). Ami ide kerül, azt a betöltés szándékosan alakítja át. */
  var ENGEDETT = [
    ["profilok.*.sorozat.**", "egy leülés = egy sorozat: minden betöltéskor nullázódik (7.1b)"],
    ["profilok.*.kert.elemek.*.y", "C2 kert (2026-10): a régi tárgyak egyszer a füves partra tolódnak (kert.attolva)"],
    ["profilok.*.kinezet.lakk.**", "patalakk: a régi {2:\"id\"} alak tömbbé alakul"],
    ["profilok.*.odu.van.napszak.este", "az alap napszak mindig birtokolt"],
    ["profilok.*.odu.van.ido.tiszta", "az alap időjárás mindig birtokolt"]
  ];
  function minta(m) {
    return new RegExp("^" + m.split(".").map(function (d) { return d === "**" ? ".*" : d === "*" ? "[^.]+" : d.replace(/[$^()+?[\]{}|\\]/g, "\\$&"); }).join("\\.") + "$");
  }
  var ENG = ENGEDETT.map(function (e) { return [minta(e[0]), e[1]]; });
  function engedett(ut) { for (var i = 0; i < ENG.length; i++) if (ENG[i][0].test(ut)) return ENG[i][1]; return null; }
  function tipus(x) { return x === null ? "null" : Array.isArray(x) ? "tomb" : typeof x; }
  /* regi → uj: minden, ami a régiben megvolt, megvan-e az újban (az új mezők nem számítanak: azokat a betöltés pótolja) */
  function osszevet(regi, uj) {
    var ki = [];
    (function jar(a, b, ut) {
      var ta = tipus(a), tb = tipus(b);
      if (ta === "object" || ta === "tomb") {
        if (tb !== ta) { if (!engedett(ut)) ki.push({ ut: ut, fajta: b == null ? "eltunt" : "valtozott", regi: kurta(a), uj: kurta(b) }); return; }
        Object.keys(a).forEach(function (k) { jar(a[k], b[k], ut ? ut + "." + k : k); });
        return;
      }
      if (a === b || a === undefined) return;
      if (engedett(ut)) return;
      if (b === undefined || (b === null && a !== null)) ki.push({ ut: ut, fajta: "eltunt", regi: a, uj: b === undefined ? "—" : b });
      else if (ta === "number" && tb === "number" && b < a) ki.push({ ut: ut, fajta: "csokkent", regi: a, uj: b });
      else ki.push({ ut: ut, fajta: "valtozott", regi: kurta(a), uj: kurta(b) });
    })(regi, uj, "");
    return ki;
  }
  function kurta(x) { var s = JSON.stringify(x); return s && s.length > 80 ? s.slice(0, 77) + "…" : s; }
  /* a játék memóriájában lévő mentés (a betöltés után, normalizálva) */
  function most() { return JSON.parse(JSON.stringify(G("mentes"))); }
  function tarolt() { try { return JSON.parse(localStorage.getItem(G("KULCS"))); } catch (e) { return null; } }
  /* ☁️ felhő-kör: a profil felhőbe menő alakja (felhoTiszta) → vissza (profilNormal) — ugyanaz-e, mint a helyi */
  function felhoKor() {
    var ki = [];
    G("LENY_SORREND").forEach(function (lk) {
      var p = G("mentes.profilok")[lk], vissza = G("profilNormal")(JSON.parse(JSON.stringify(G("felhoTiszta")(p))));
      osszevet(JSON.parse(JSON.stringify(p)), vissza).forEach(function (d) { d.ut = "profilok." + lk + "." + d.ut; ki.push(d); });
    });
    return ki;
  }
  /* ☁️ összefésülés: a felhőben közben +5 ✨ és egy új jelvény jött (másik gépen játszott) → a helyi mentésbe megérkezik-e,
     és nem vész-e el semmi a helyiből */
  function felhoFesul() {
    var lk = G("LENY_SORREND")[1], p = G("mentes.profilok")[lk], alap = G("felhoTiszta")(p), tavoli = JSON.parse(JSON.stringify(alap));
    tavoli.csillampor = (tavoli.csillampor || 0) + 5;
    (tavoli.jelvenyek || (tavoli.jelvenyek = {}))["gepi-proba-jelveny"] = 1;
    var helyi = JSON.parse(JSON.stringify(alap)), elotte = JSON.parse(JSON.stringify(alap));
    G("felhoOsszefesul")(helyi, alap, tavoli, true);
    var ki = osszevet(elotte, helyi).filter(function (d) { return d.ut !== "csillampor"; });
    if (helyi.csillampor !== (elotte.csillampor || 0) + 5) ki.push({ ut: "csillampor", fajta: "nem jött meg", regi: elotte.csillampor, uj: helyi.csillampor });
    if (!(helyi.jelvenyek && helyi.jelvenyek["gepi-proba-jelveny"])) ki.push({ ut: "jelvenyek.(új)", fajta: "nem jött meg", regi: "—", uj: "—" });
    return ki;
  }
  /* egy profil fő számai (az összegzéshez és a gyors összevetéshez) */
  function szamok(m) {
    var o = {};
    Object.keys(m.profilok || {}).forEach(function (lk) {
      var p = m.profilok[lk], db = function (x) { return x ? Object.keys(x).length : 0; };
      o[lk] = { "✨": p.csillampor || 0, "💧": p.tunderharmat || 0, ruha: db(p.oltozet && p.oltozet.van), jelveny: db(p.jelvenyek),
                palya: db(p.palyak), disz: db(p.odu && p.odu.vanDisz), kert: ((p.kert && p.kert.elemek) || []).length, teny: db(p.tenyek) };
    });
    return o;
  }
  return { osszevet: osszevet, most: most, tarolt: tarolt, felhoKor: felhoKor, felhoFesul: felhoFesul, szamok: szamok };
})();

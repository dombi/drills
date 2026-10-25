/* ============ 6h6) 🦊 ZSIVÁNY ZSIBVÁSÁRA — a nehezebb bolt (2. receptes pálya, 1. kör, 2026-10-25) ============
   Recept-lap: terv/zsibvasar-recept-lap.html (✅ 1A 2A 3A) · rajz: Matekos/zsibvasar-rajzterv.html (✅ szekér-stand, lebukik A, vállat von A,
   ≈ cetli hibánál ív + pöttyök). A sora a receptek.js-ben, a kép a jelenet-motoron (jelenet.js), a keretek a keret.js-ből
   (kfBecsles ≈ cetli, kfBlokk, kfCedula, kfErszeny, kfTaller, kfTabla), Zsivány a lakok.js rigje (juli).
   MIT TANÍT? Előbb körülbelül, aztán pontosan. A becslés a könyv szabálya szerint (OH 3. o. 74., 93–94. o.; 4. o. 11., 18. o.): a szám a közelebbi
   kerek tízesre kerekedik, az 5-re végződő felfelé, a kerek tízes maga marad; összegnél ELŐBB minden tagot kerekítünk, aztán a kerekítetteket
   adjuk össze. Tűrés nincs. 2. o.: 2 tétel, nincs 5-re végződő és kerek ár · 3. o.-tól: 3 tétel, csapdának kerek és 5-re végződő ár is.
   MIT CSINÁL A GYEREK A KÉPEN? Szerepcsere Tüske nénihez képest: Zsivány árul, az unikornis vásárol.
     🫧 Maszatos ár — a visszajáró érméket egyenként a számszalagra teszi (felvesz–letesz); mindegyik akkorát ugrik vissza a fizetett összegtől,
        amennyit ér; a szalag a megállót mutatja, a számot nem. Az árat a cédulára (táblára) írja.
     🎒 Elég lesz? — a lista minden tételéhez ≈ cetli: a közelebbi tízesre koppint; a kerekítettek összegét írja; dönt (elég / nem elég) a becslés
        alapján; végül pontosan kiszámolja. Egy határeset állomásonként (a becslés szerint elég, pontosan mégsem → visszanézés). Az állomás utolsó
        feladata fordított: „válassz két dolgot, amelyek együtt ≈ T”.
     🧾 Ravasz blokk — a kosár tételeit becsli (≈ cetlik), aztán ✓ vagy ✗ pecsét; ✗ után (és rossz pecsét után is) a pontos összeget írja.
        Zsivány trükkjei: összeadási hiba · ±1 (a becslés nem fogja ki) · más ár a blokkon, mint a cédulán · dupla tétel.
     🏠 Odú-küszöb — vegyesen, halványítva: nincs szalag (a kerekítettet a gyerek írja a cetlire, a maszatos árnál nincs ugró érme).
   HIBÁNÁL a megoldást nem írjuk ki: 1. hiba → a kép mutat (cetlin a két távolság, a szalagon a kerek tízesek felirata) · 2. hibától → lépésenként,
   az utolsó számot a gyerek adja. 🔒 Kiskapu: jutalom csak a feladat végén, a pontos számra; a döntés és a pecsét önmagában nem ér semmit;
   rossz pecsét után is ki kell számolni a pontos összeget. A becslési hibafajták a P().zsib.becs naplóba (a pult ≈ sora a 2. körben). */

VS_SZIN.zsib1 = { teto: "#d9cbe6", csik: "#fffaf0", sotet: "#7a5ea8", cimer: "🫧" };
VS_SZIN.zsib2 = { teto: "#8fd18a", csik: "#fffaf0", sotet: "#4f8f42", cimer: "🎒" };
VS_SZIN.zsib3 = { teto: "#f7b98a", csik: "#fff", sotet: "#b35f28", cimer: "🧾" };

var ZS_ARU = [["teafozo", "teáskanna"], ["ora", "ébresztőóra"], ["lampas", "lámpás"], ["konyvek", "könyvek"], ["csizma", "csizma"], ["kalap", "kalap"], ["virag", "virágcserép"]];
var ZS_TALCA = [1, 2, 5, 10, 20, 50];
/* a két elrendezés: a munka-rész (lista, cetli, szalag, gombok) egy 290 × 430-as dobozban él; telefonon a stand fent, a doboz alatta, nagyobban */
var ZS_KEP = {
  teljes:  { vb: "0 0 800 450", stand: "translate(80 40) scale(.92)", m: [6, 10, 1], uni: [336, 448, .6] },
  keskeny: { vb: "0 0 400 820", stand: "translate(-121 -35) scale(.62)", m: [12, 250, 1.3], uni: [46, 242, .38] }
};
function zsK() { return ZS_KEP[JL && JL.keskeny ? "keskeny" : "teljes"]; }
function zsT(x, y, w, h) { var M = zsK().m; return [M[0] + M[2] * x, M[1] + M[2] * y, M[2] * w, M[2] * h]; }   /* a tábla helye a munka-dobozból a kép koordinátáiba */
function zsHe(s) { return s.replace(/id="he/g, 'id="zs-he').replace(/url\(#he/g, "url(#zs-he"); }   /* a tallér-színek saját néven (mint kfSajatId) */
function zsOsztaly() { var m = typeof nyitasMenet === "function" ? nyitasMenet() : null, p = P(); return (m && m.o) || (p.uj && p.uj.o) || 3; }
function zsCap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function zsKet(n) { return n === 2 ? "két" : szo(n); }   /* főnév előtt: „két lépés” */
function zsAz(n) { return (/^[aeiouáéíóöőúüű]/i.test(szo(n)) ? "az " : "a ") + szo(n); }
/* „-ból/-ből” a szám szavához: az utolsó magánhangzó dönt (az i, í semleges: harmincból, tízből, huszonegyből) */
function zsBol(n) { var w = szo(n), m = w.replace(/[ií]/g, "").match(/[aáoóuúeéöőüű](?=[^aáoóuúeéöőüű]*$)/); return w + (m && /[aáoóuú]/.test(m[0]) ? "ból" : "ből"); }

/* ═════════════════ FELADATGYÁRTÓK (tiszta adat — a piac-őr ezeket ellenőrzi) ═════════════════ */
/* a becslés ellenőrzője: v a gyerek kerekítése. hiba: szomszed (a távolabbi tízes) · otos (5-re végződőt lefelé) · kerek (kerek tízest elmozdított) · tav */
function becslesEll(ar, v) {
  var jo = kerekTizes(ar), also = Math.floor(ar / 10) * 10;
  if (v === jo) return { jo: true };
  if (ar % 10 === 0) return { jo: false, hiba: "kerek" };
  if (ar % 10 === 5 && v === also) return { jo: false, hiba: "otos" };
  return { jo: false, hiba: v === also || v === also + 10 ? "szomszed" : "tav" };
}
function becslesOsszeg(l) { var s = 0; l.forEach(function (v) { s += kerekTizes(v); }); return s; }
function zsAr(o, lo, hi) {
  for (var p = 0; p < 100; p++) {
    var v = veletlen(lo, hi), e = v % 10;
    if (o < 3 && (e === 0 || e === 5)) continue;
    if (e === 0 && Math.random() < .75) continue;   /* kerek ár ritkán (csapda: maga marad) */
    return v;
  }
  return lo + 1;
}
/* n különböző ár, összegük és a becslés is ≤ 100; 3. o.-tól három tételből többnyire az egyik csapda (5-re végződő vagy kerek) */
function zsArak(n, o) {
  for (var p = 0; p < 400; p++) {
    var l = [], i;
    for (i = 0; i < n; i++) l.push(zsAr(o, 11, n === 2 ? 69 : 44));
    if (tallerOsszeg(l) > 100 || becslesOsszeg(l) > 100 || l.some(function (v, j) { return l.indexOf(v) !== j; })) continue;
    if (o >= 3 && !l.some(function (v) { return v % 10 === 5 || v % 10 === 0; }) && Math.random() < .6) continue;
    return l;
  }
  return n === 2 ? [23, 46] : [12, 27, 35];
}
function zsAruk(n) { return keverTomb(ZS_ARU.slice()).slice(0, n); }
function zsNaplo(l) { return l.length === 2 ? sk100Naplo(l[0], "+", l[1], "z") : { tipus: "bolt", kerdes: l.join(" + "), forma: "z" }; }
/* 🫧 maszatos ár: fizetett (kerek) − visszajáró (legkevesebb érme, 2–4 db) = ár */
function zsMaszat(o) {
  for (var p = 0; p < 300; p++) {
    var ar = veletlen(12, 88);
    if (ar % 10 === 0) continue;
    var fiz = veletlenElem([Math.ceil(ar / 10) * 10 + (Math.random() < .5 ? 10 : 0), ar < 50 ? 50 : 100]);
    var v = fiz - ar, er = tallerLegkevesebb(v, ZS_TALCA);
    if (fiz > 100 || v < 3 || v > (o < 3 ? 30 : 40) || !er || er.length < 2 || er.length > 4) continue;
    return { forma: "maszat", ar: ar, fiz: fiz, vissza: v, ermek: keverTomb(er), aru: zsAruk(1)[0], naplo: sk100Naplo(fiz, "-", v, "z") };
  }
  return { forma: "maszat", ar: 27, fiz: 50, vissza: 23, ermek: [20, 2, 1], aru: ZS_ARU[0], naplo: sk100Naplo(50, "-", 23, "z") };
}
/* 🎒 elég lesz? hatar: a becslés szerint elég, pontosan mégsem (becslés ≤ erszény < összeg). Különben a kettő egyezik. */
function zsEleg(o, hatar) {
  var n = o < 3 ? 2 : 3;
  for (var p = 0; p < 400; p++) {
    var l = zsArak(n, o), h = tallerOsszeg(l), b = becslesOsszeg(l), E;
    if (hatar) { if (b >= h || b < 20 || h > 100) continue; E = b; }
    else if (Math.random() < .5) { E = Math.ceil(Math.max(h, b) / 10) * 10 + (Math.random() < .5 ? 10 : 0); if (E > 100) continue; }
    else { E = Math.floor((Math.min(h, b) - 1) / 10) * 10 - (Math.random() < .5 ? 10 : 0); if (E < 10) continue; }
    return { forma: "eleg", tetelek: l, aruk: zsAruk(n), erszeny: E, osszeg: h, becsles: b, eleg: h <= E, becsEleg: b <= E, hatar: !!hatar, naplo: zsNaplo(l) };
  }
  return zsEleg(o, false);
}
/* 🎒 válassz te (fordított): 4 tárgy a polcon, cél: két tárgy, amelyek együtt ≈ T (több jó pár is lehet) */
function zsValassz(o) {
  for (var p = 0; p < 300; p++) {
    var l = zsArak(2, o).concat(zsArak(2, o));
    if (l.some(function (v, j) { return l.indexOf(v) !== j; })) continue;
    var T = kerekTizes(l[0]) + kerekTizes(l[1]);
    if (T > 100) continue;
    return { forma: "valassz", polc: l, aruk: zsAruk(4), cel: T, naplo: zsNaplo([l[0], l[1]]) };
  }
  return { forma: "valassz", polc: [23, 41, 18, 36], aruk: zsAruk(4), cel: 60, naplo: zsNaplo([23, 41]) };
}
/* 🧾 ravasz blokk. pontos: true/false (rokaSor); trukk: osszeg (ROKA_HIBA összeadási hibái) · egy (±1) · polcar (a blokkon más ár, mint a cédulán) · dupla */
var ZS_TRUKK = ["osszeg", "egy", "polcar", "dupla"];
function zsBlokk(o, pontos, trukk) {
  var n = o < 3 ? 2 : 3;
  for (var p = 0; p < 400; p++) {
    var l = zsArak(n, o), h = tallerOsszeg(l), sorok = l.map(function (v, i) { return { i: i, ar: v }; }), irt = h, j = veletlen(0, n - 1);
    if (!pontos) {
      if (trukk === "osszeg") irt = rokaHibaz(l, veletlenElem(["atvitel", "tizes", "csere"]));
      else if (trukk === "egy") irt = h + (Math.random() < .5 ? 1 : -1);
      else if (trukk === "polcar") { var q = l[j] + (l[j] > 20 && Math.random() < .5 ? -10 : 10); sorok[j] = { i: j, ar: q }; irt = h - l[j] + q; }
      else { sorok.splice(j + 1, 0, { i: j, ar: l[j] }); irt = h + l[j]; }
      if (irt == null || irt < 1 || irt > 100 || irt === h) continue;
    }
    var b = becslesOsszeg(l);
    return { forma: "blokk", tetelek: l, aruk: zsAruk(n), sorok: sorok, irt: irt, osszeg: h, becsles: b, pontos: !!pontos, trukk: pontos ? null : trukk,
             kbStimmel: Math.abs(irt - b) < 10, naplo: zsNaplo(l) };
  }
  return zsBlokk(o, true);
}

/* ═════════════════ FELADAT (GEN.zsib) ═════════════════
   cfg.forma: maszat · eleg · blokk · vegyes (Odú-küszöb, halványítva). Egy feladat több lépés (x.lep), a jutalom csak a végén (jlJo). */
var ZS_ODU = ["maszat", "eleg", "blokk", "maszat", "blokk"];
GEN.zsib = function (cfg) {
  var st = jlAllapot(), i = J.feladatKesz, o = zsOsztaly(), forma = cfg.forma, halvany = !!cfg.halvany, d, x;
  if (forma === "vegyes") forma = ZS_ODU[i % ZS_ODU.length];
  if (forma === "maszat") d = zsMaszat(o);
  else if (forma === "eleg") {
    if (st.hatarI == null) st.hatarI = cfg.hatar ? veletlen(0, Math.max(0, (cfg.darab || 4) - 2)) : -1;
    d = !halvany && cfg.forma === "eleg" && i === (cfg.darab || 4) - 1 ? zsValassz(o) : zsEleg(o, i === st.hatarI);
  } else {
    if (!st.sor) { st.sor = rokaSor(cfg.darab || 5); st.trukk = keverTomb(ZS_TRUKK.slice()); st.tn = 0; }
    var pontos = st.sor[i % st.sor.length];
    d = zsBlokk(o, pontos, pontos ? null : st.trukk[st.tn++ % st.trukk.length]);
  }
  x = { d: d, halvany: halvany, hib: 0, kerek: [], becsHiba: false };
  if (d.forma === "maszat") { x.lep = halvany ? "ar" : "rak"; x.rakott = []; }
  else if (d.forma === "valassz") { x.lep = "valaszt"; x.valasztott = []; }
  else { x.lep = "kerek"; x.i = 0; x.lista = d.tetelek; }
  var k = zsKerdes(x);
  return { csalad: "jelenet", jelenet: "zsib", zs: x, kartyaHTML: '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>', szoveg: k[0], felolvas: k[1],
    helyes: d.forma === "maszat" ? d.ar : d.forma === "valassz" ? d.cel : d.osszeg, keplet: k[0], tipp: "", naplo: d.naplo };
};
/* a lépés kérdése: [felirat, felolvasás] */
function zsKerdes(x) {
  var d = x.d, L = x.lep;
  if (L === "rak") return ["Tedd vissza az érméket a szalagra!", "Zsivány cédulája elmaszatolódott. " + szo(d.fiz) + " tallérral fizettünk, ennyit adott vissza. Tedd vissza az érméket a szalagra, egyenként!"];
  if (L === "ar") return ["Mennyi volt az ár?", x.halvany ? szo(d.fiz) + " tallérral fizettünk, ennyit kaptunk vissza. Mennyi volt az ár?" : "Mennyi volt az ár? Írd a cédulára!"];
  if (L === "valaszt") return ["Válassz két dolgot: együtt ≈ " + d.cel, "Válassz két dolgot, amelyek együtt körülbelül " + szo(d.cel) + " tallérba kerülnek!"];
  if (L === "kerek") { var v = x.lista[x.i]; return [v + " ≈ ?", x.halvany ? "Kerekítsd tízesre: " + szo(v) + ". Írd a cetlire!" : (x.i ? "" : (d.forma === "blokk" ? "Előbb becsüljük meg, mennyi lesz! " : "Előbb körülbelül! ")) + szo(v) + ": melyik kerek tízes van közelebb?"]; }
  if (L === "becs") return ["≈ " + x.kerek.join(" + ") + " = ?", "Add össze a kerekített számokat!"];
  if (L === "dont") return ["Elég lesz?", "Az erszényben " + szo(d.erszeny) + " tallér van. A becslés szerint elég lesz?"];
  if (L === "pontos") return ["Pontosan: " + x.lista.join(" + ") + " = ?", "Most pontosan: mennyi " + x.lista.map(szo).join(" meg ") + "?"];
  if (L === "pecset") return ["Jó a blokk?", "Zsivány " + szo(d.irt) + " tallért írt. Jó a blokk? Nyomj pecsétet!"];
  return ["Mennyi pontosan?", "Számold ki pontosan: mennyi az összesen?"];
}
function zsLep(x, lep, csendben) {
  x.lep = lep; x.hib = 0; JL.seg = 0; JL.rossz = null;
  var k = zsKerdes(x), f = JL.f;
  f.szoveg = f.keplet = k[0]; $("buborek-feladat").innerHTML = '<span class="bk-kerdes">' + kiiras(k[0]) + '</span>';
  if (!csendben) { var vj = $("visszajelzes"); vj.className = "visszajelzes"; vj.textContent = ""; }   /* az előző lépés hibaüzenete ne maradjon kint */
  jlRajz(); if (!csendben) mondd(k[1]); jlFokusz();
}
/* a becslési hibák naplója (a pult ≈ sora, 2. kör): J jó · S távolabbi szomszéd · O 5-re végződőt lefelé · K kerek tízest elmozdított ·
   T nem szomszéd · Ö a kerekítettek összege rossz · P a pontos összeget kerekítette a tagok helyett */
function zsBecsJegyez(betu) { var p = P(), z = p.zsib || (p.zsib = {}); z.becs = ((z.becs || "") + betu).slice(-16); ment(); }

/* ═════════════════ ZSIVÁNY (a lakok.js rigje; a kép újrarajzolása után ugyanaz a figura kerül vissza, és mozog tovább) ═════════════════ */
var ZS = null;
function zsZsivany(poz, mondat, ms) { if (ZS && ZS.lako) ZS.lako.pozIdeig(poz, ms || 2400); if (mondat) mondd(mondat); }

/* ═════════════════ A KÉP (JELENETEK.zsib) ═════════════════ */
JELENETEK.zsib = {
  kep: function (JL) {
    var K = zsK(), x = JL.f.zs, L = x.lep, T = null, bl = x.d.forma === "blokk";
    if (L === "rak" || L === "ar") T = zsT(150, 70, 96, 52);
    else if (L === "kerek" && x.halvany) T = zsT(10 + 187 * .9, (bl ? 240 : 158) + 53 * .9, 62 * .9, 38 * .9);
    else if (L === "becs") T = zsT(244, bl ? 262 : 250, 72, 44);
    else if (L === "pontos" || L === "javit") T = zsT(244, bl ? 326 : 310, 72, 44);
    return { vb: K.vb, tabla: T, uni: K.uni };
  },
  tablaAll: function (JL) { return JL.f.zs.lep === "rak" ? "var" : ""; },
  tablaVarMondat: function () { return "Előbb tedd vissza az érméket a szalagra!"; },
  rajz: function (JL) {
    var K = zsK(), x = JL.f.zs, s = '<defs>' + HE_DEFS + '</defs>' + zsHatter(JL);
    s += '<g transform="' + K.stand + '">' + zsStand(true) + '</g>';
    s += '<g transform="translate(' + K.m[0] + ' ' + K.m[1] + ') scale(' + K.m[2] + ')">' + (x.d.forma === "maszat" ? zsMaszatRajz(JL) : x.d.forma === "blokk" ? zsBlokkRajz(JL) : zsElegRajz(JL)) + '</g>';
    return zsHe(s);
  },
  utan: function (JL) {   /* Zsivány a helyére (ugyanaz a figura: a pózok nem ugranak vissza minden koppintásnál) */
    var h = JL.svg.querySelector(".zs-juli-hely"); if (!h) return;
    if (!ZS || LAKOK.indexOf(ZS.lako) < 0) { ZS = { g: document.createElementNS("http://www.w3.org/2000/svg", "g") }; h.appendChild(ZS.g); ZS.lako = new Lako(ZS.g, "juli", { poz: "koszon", elet: true }); }
    else h.appendChild(ZS.g);
  },
  fogRajz: function (JL, F) { return zsHe('<g transform="translate(' + pcF(F.x) + ' ' + pcF(F.y - 6) + ')">' + tallerBelso(F.n, 1) + '</g>'); },
  felvesz: function (JL, id) {
    var x = JL.f.zs, i = +id.split("-")[1];
    if (x.lep !== "rak" || x.rakott.indexOf(i) >= 0) return null;
    x.fog = i; return x.d.ermek[i];
  },
  letesz: function (JL, id, n, hova) {
    var x = JL.f.zs, i = +id.split("-")[1];
    x.fog = null;
    if (hova === "szalag" && x.rakott.indexOf(i) < 0) { x.rakott.push(i); hangGomb(); }
    if (x.rakott.length === x.d.ermek.length) { zsLep(x, "ar"); return; }
    jlRajz();
  },
  katt: function (JL, t) {
    var x = JL.f.zs, v = t.closest ? t.closest(".kf-veg") : null, g = t.closest ? t.closest(".zs-gomb") : null, a = t.closest ? t.closest(".zs-valaszt") : null;
    if (v && x.lep === "kerek" && !x.halvany) { zsKerekit(x, +v.getAttribute("data-v")); return; }
    if (g && x.lep === "dont") { zsDont(x, g.getAttribute("data-g") === "eleg"); return; }
    if (g && x.lep === "pecset") { zsPecset(x, g.getAttribute("data-g")); return; }
    if (a && x.lep === "valaszt") zsValaszt(x, +a.getAttribute("data-i"));
  },
  bekuld: function (JL, v) {
    var x = JL.f.zs, d = x.d, L = x.lep;
    if (L === "kerek") { zsKerekit(x, v); return; }
    if (L === "becs") { zsBecs(x, v); return; }
    if (L === "ar") {
      if (v === d.ar) { jlJo(d.fiz + " − " + d.vissza + " = " + d.ar, null, function (k) { zsZsivany("orul", "Pontosan ennyi volt! Köszönöm, hogy kisilabizáltad."); zsVar(k, 1500); }); return; }
      zsRossz(x, String(v), d.naplo, x.hib === 0 ? (x.halvany ? "Ennyivel fizettünk: " + szo(d.fiz) + ". Ennyit kaptunk vissza: " + szo(d.vissza) + ". Mennyi maradt Zsiványnál?" : "Nézd meg a szalagot: hol álltak meg az érmék?") :
        zsMaszatLepesek(x));
      return;
    }
    if (L === "pontos" || L === "javit") {
      if (v === d.osszeg) { zsVege(x); return; }
      zsRossz(x, String(v), d.naplo, x.hib === 0 ? "Előbb a tízeseket add össze, aztán az egyeseket!" : zsOsszegLepesek(x.lista));
    }
  },
  gepi: function (JL) {   /* a gépi próba (kiskapu-őr) helyes bevitele lépésenként */
    var x = JL.f.zs, d = x.d, L = x.lep, q = function (s) { return "#jl-svg " + s; };
    if (L === "rak") { var sel = []; d.ermek.forEach(function (v, i) { if (x.rakott.indexOf(i) < 0) sel.push(q('.jl-fog[data-fog="e-' + i + '"]'), q('.jl-hely[data-hely="szalag"]')); }); return { katt: sel }; }
    if (L === "ar") return { gepel: d.ar };
    if (L === "kerek") { var ar = x.lista[x.i], jo = kerekTizes(ar), mas = ar % 10 === 0 ? ar + 10 : jo === Math.floor(ar / 10) * 10 ? jo + 10 : jo - 10; return x.halvany ? { gepel: jo } : { katt: [q('.kf-veg[data-v="' + jo + '"]')], rossz: q('.kf-veg[data-v="' + mas + '"]') }; }
    if (L === "becs") return { gepel: becslesOsszeg(x.lista) };
    if (L === "dont") return { katt: [q('.zs-gomb[data-g="' + (d.becsEleg ? "eleg" : "nem") + '"]')], rossz: q('.zs-gomb[data-g="' + (d.becsEleg ? "nem" : "eleg") + '"]') };
    if (L === "valaszt") { var p = zsJoPar(d); return { katt: x.valasztott.length ? [] : [q('.zs-valaszt[data-i="' + p[0] + '"]'), q('.zs-valaszt[data-i="' + p[1] + '"]')] }; }
    if (L === "pecset") return { katt: [q('.zs-gomb[data-g="' + (d.pontos ? "ok" : "x") + '"]')], rossz: q('.zs-gomb[data-g="' + (d.pontos ? "x" : "ok") + '"]') };
    return { gepel: d.osszeg };
  }
};
function zsJoPar(d) { for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (kerekTizes(d.polc[i]) + kerekTizes(d.polc[j]) === d.cel) return [i, j]; return [0, 1]; }
function zsVar(k, ms) { var f = JL.f; setTimeout(function () { if (JL && JL.f === f) k(); }, lkCsokkent() || window.__UC_GYORS ? 0 : ms); }

/* ═════════════════ JÁTÉKMENET ═════════════════ */
/* rossz válasz egy lépésben: könyvelés (naplo: a hibás tény, vagy a becslés — az nem tény), a lépés saját hiba-lépcsője, a kép felel */
function zsRossz(x, cimke, naplo, mondat) {
  JL.rossz = cimke; jlRossz(cimke, naplo);
  JL.seg = Math.min(2, ++x.hib);
  jlRajz(); jlSzol(mondat, true); jlFokusz();
}
function zsBecsNaplo(mit) { return { tipus: "becsles", kerdes: "≈ " + mit, forma: "z" }; }
/* ≈ egy tétel kerekítése (koppintás a cetli tízesére, vagy halványítva beírás) */
function zsKerekit(x, v) {
  var ar = x.lista[x.i], e = becslesEll(ar, v);
  if (!x.hib) zsBecsJegyez(e.jo ? "J" : { szomszed: "S", otos: "O", kerek: "K", tav: "T" }[e.hiba]);
  if (!e.jo) {
    var also = Math.floor(ar / 10) * 10;
    zsRossz(x, "≈ " + v, zsBecsNaplo(ar),
      e.hiba === "kerek" ? szo(ar) + ": ez már kerek tízes. Maga marad." :
      e.hiba === "otos" ? "Pont középen van. Ilyenkor felfelé kerekítünk." :
      x.hib === 0 && !x.halvany ? "Melyik tízes van közelebb? Számold meg a lépéseket!" :
      zsCap(szo(ar)) + " " + zsAz(also) + " és " + zsAz(also + 10) + " között van. " + zsCap(zsAz(also)) + "ig " + zsKet(ar - also) + " lépés, " + zsAz(also + 10) + "ig " + zsKet(also + 10 - ar) + ". Melyik van közelebb?");
    return;
  }
  hangCsilla(); x.kerek.push(v); x.i++;
  if (x.i < x.lista.length) { zsLep(x, "kerek"); return; }
  zsLep(x, "becs");
}
/* a kerekítettek összege — a könyv módszere: előbb minden tag kerekítve, aztán összeadva */
function zsBecs(x, v) {
  var b = becslesOsszeg(x.lista), d = x.d;
  if (v !== b) {
    var p = v === kerekTizes(tallerOsszeg(x.lista));
    if (!x.hib) zsBecsJegyez(p ? "P" : "Ö");
    zsRossz(x, "≈ " + v, zsBecsNaplo(x.kerek.join(" + ")), p ? "Előbb minden tagot kerekítünk, aztán a kerekítetteket adjuk össze." :
      x.hib === 0 ? "Add össze a kerekített számokat: " + x.kerek.map(szo).join(" meg ") + "." : zsOsszegLepesek(x.kerek));
    return;
  }
  hangCsilla(); x.becsles = v;
  if (d.forma === "valassz") {
    if (v === d.cel) { zsVege(x); return; }
    zsRossz(x, "≈ " + v, zsBecsNaplo("válassz " + d.cel), "Ez körülbelül " + szo(v) + ", nem " + szo(d.cel) + ". Válassz két másikat!");
    x.valasztott = []; x.kerek = []; x.becsles = null; zsLep(x, "valaszt", true);   /* a hang már szólt; a polc újra választható */
    return;
  }
  zsLep(x, d.forma === "eleg" ? "dont" : "pecset");
}
/* 🎒 a döntés a becslés alapján (önmagában nem ér jutalmat) */
function zsDont(x, eleg) {
  var d = x.d;
  hangGomb();
  if (eleg !== d.becsEleg) { zsRossz(x, eleg ? "elég" : "nem elég", zsBecsNaplo("elég? " + d.erszeny), "Nézd a becslést: körülbelül " + szo(x.becsles) + ". Az erszényben " + szo(d.erszeny) + " van."); return; }
  x.dontes = eleg; zsLep(x, "pontos");
}
/* 🧾 a pecsét: ✓ csak pontos blokkon jó; rossz pecsét után is ki kell számolni a pontos összeget (nem lehet kitalálással továbbjutni) */
function zsPecset(x, p) {
  var d = x.d; hangGomb(); x.pecset = p;
  if ((p === "ok") === d.pontos) { if (d.pontos) { zsVege(x); return; } zsZsivany("meglep", null, 1800); zsLep(x, "javit"); return; }
  zsRossz(x, p === "ok" ? "✓" : "✗", zsBecsNaplo("blokk " + d.irt), p === "ok" ? (d.kbStimmel ? "Közel van a becsléshez, de attól még lehet hibás. A becslés a kis hibát nem fogja ki. Számold ki pontosan!" : "Nézd a becslést: körülbelül " + szo(x.becsles) + ". Zsivány ezt írta: " + szo(d.irt) + ".") :
    "Számold ki pontosan, mennyi az összesen!");
  x.pecset = null; zsLep(x, "javit", true);   /* rossz pecsét után is a pontos összeg jön: kitalálással nem lehet továbbjutni */
}
/* 🎒 válassz te: két tárgyra koppint (a második után jönnek a cetlik) */
function zsValaszt(x, i) {
  var k = x.valasztott.indexOf(i); hangGomb();
  if (k >= 0) x.valasztott.splice(k, 1); else if (x.valasztott.length < 2) x.valasztott.push(i);
  if (x.valasztott.length < 2) { jlRajz(); return; }
  x.lista = x.valasztott.map(function (j) { return x.d.polc[j]; }); x.i = 0; x.kerek = [];
  var f = JL.f; f.helyes = x.d.cel; f.naplo = zsNaplo(x.lista);
  zsLep(x, "kerek");
}
/* a feladat vége: jó pontos összeg (vagy válassz-te: jó becslés) → jutalom; Zsivány reagál, határesetnél visszanézés */
function zsVege(x) {
  var d = x.d, sz = x.lista.join(" + ") + " = " + tallerOsszeg(x.lista), mondat = null, poz = "orul";
  if (d.forma === "valassz") { sz = "≈ " + x.kerek.join(" + ") + " = " + d.cel; mondat = "Igen, ez körülbelül " + szo(d.cel) + "!"; }
  else if (d.forma === "eleg") {
    mondat = d.eleg !== d.becsEleg ? "A becslés szerint elég volt, pontosan mégsem! Közel volt a határhoz: ilyenkor számolj pontosan." : d.eleg ? "Elég lesz. Megvesszük!" : "Ez most nem elég. Majd legközelebb!";
    if (d.eleg !== d.becsEleg) poz = "kacsint";
  } else if (!d.pontos) { poz = "lebukik"; mondat = LK_MONDAT.juli.lebukik; }
  else mondat = LK_MONDAT.juli.orul;
  jlJo(sz, null, function (k) { zsZsivany(poz, mondat, 2600); zsVar(k, mondat && mondat.length > 40 ? 3400 : 1700); });
}
/* 2. hibától: lépésenként, az utolsó számot a gyerek adja */
function zsOsszegLepesek(l) {
  var t = 0, e = 0; l.forEach(function (v) { t += Math.floor(v / 10) * 10; e += v % 10; });
  if (!e) return "A tízesek: " + l.map(function (v) { return szo(Math.floor(v / 10) * 10); }).join(" meg ") + ". Mennyi együtt?";
  return "A tízesek együtt " + szo(t) + ". Az egyesek együtt " + szo(e) + ". Mennyi " + szo(t) + " meg " + szo(e) + "?";
}
function zsMaszatLepesek(x) {
  var d = x.d, l = x.halvany ? d.ermek : x.rakott.map(function (i) { return d.ermek[i]; }), p = d.fiz, s = "";
  l.forEach(function (v, k) { s += zsCap(zsBol(p)) + " vissza " + szo(v) + (k < l.length - 1 ? ": " + szo(p - v) + ". " : ": hová érsz?"); p -= v; });
  return s;
}

/* ═════════════════ RAJZ ═════════════════ */
function zsHatter(JL) {
  var sz = JL.keskeny, W = sz ? 400 : 800, H = sz ? 820 : 450;
  return '<rect width="' + W + '" height="' + H + '" fill="url(#lt-gEgA)"/>' +
    (sz ? '<path d="M0 214Q200 196 400 210V820H0Z" fill="#d7eec8"/><path d="M0 250Q200 236 400 246V820H0Z" fill="#b9e3a8"/>'
        : '<path d="M0 330Q200 290 420 316T800 300V450H0Z" fill="#d7eec8"/><path d="M0 392Q300 372 800 388V450H0Z" fill="#b9e3a8"/>');
}
/* a kacatok (rajzterv 1. pont); ar: a cédula (0 / null: nincs) */
function zsKacat(tipus, x, y, ar) {
  var s = '<g transform="translate(' + x + ' ' + y + ')">';
  if (tipus === "teafozo") s += '<path d="M-16 0Q-20 -22 0 -24Q20 -22 16 0Z" fill="#a7d4e8" stroke="#4f7f9a" stroke-width="2"/><path d="M16 -14Q28 -16 26 -4" fill="none" stroke="#4f7f9a" stroke-width="3"/><path d="M-16 -16L-28 -22" stroke="#4f7f9a" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-27" r="4" fill="#f7d57a" stroke="#b5842c" stroke-width="1.5"/>';
  if (tipus === "csizma") s += '<path d="M-8 -30H6V-8H18Q22 -8 22 -2V0H-8Z" fill="#b07a4c" stroke="#6d4a2c" stroke-width="2"/><path d="M-8 -26H6" stroke="#e8b27a" stroke-width="2"/>';
  if (tipus === "lampas") s += '<rect x="-10" y="-26" width="20" height="24" rx="3" fill="#fff3c4" stroke="#8a6a3a" stroke-width="2"/><path d="M-12 -26H12L8 -32H-8Z" fill="#8a6a3a"/><path d="M0 -38V-32" stroke="#8a6a3a" stroke-width="2"/><circle cx="0" cy="-41" r="3" fill="none" stroke="#8a6a3a" stroke-width="2"/><ellipse cx="0" cy="-13" rx="3.5" ry="5.5" fill="#f7a95e"/><rect x="-11" y="-3" width="22" height="3" fill="#8a6a3a"/>';
  if (tipus === "ora") s += '<circle cx="0" cy="-16" r="15" fill="#fffef6" stroke="#c0567f" stroke-width="2.4"/><path d="M0 -16V-26M0 -16L7 -12" stroke="#2a2140" stroke-width="2" stroke-linecap="round"/><path d="M-10 -1L-13 3M10 -1L13 3" stroke="#c0567f" stroke-width="2.4" stroke-linecap="round"/><circle cx="-10" cy="-31" r="4" fill="#f6a5c0" stroke="#c0567f" stroke-width="1.5"/><circle cx="10" cy="-31" r="4" fill="#f6a5c0" stroke="#c0567f" stroke-width="1.5"/>';
  if (tipus === "konyvek") s += '<rect x="-16" y="-8" width="32" height="8" rx="1.5" fill="#9ec9f0" stroke="#5f84b0" stroke-width="1.6"/><rect x="-13" y="-16" width="28" height="8" rx="1.5" fill="#f6a5c0" stroke="#c0567f" stroke-width="1.6"/><rect x="-15" y="-24" width="26" height="8" rx="1.5" fill="#a7d99a" stroke="#5e9a52" stroke-width="1.6"/>';
  if (tipus === "virag") s += '<path d="M-10 -12H10L7 0H-7Z" fill="#e8b27a" stroke="#8a5a3a" stroke-width="1.8"/><path d="M0 -12V-24" stroke="#5e9a52" stroke-width="2"/><circle cx="0" cy="-28" r="5" fill="#fce49a" stroke="#d1a23a" stroke-width="1.4"/><circle cx="-7" cy="-24" r="3.5" fill="#f6a5c0"/><circle cx="7" cy="-24" r="3.5" fill="#f6a5c0"/>';
  if (tipus === "kalap") s += '<ellipse cx="0" cy="-3" rx="22" ry="5" fill="#7a5ca8" stroke="#4a3b7a" stroke-width="1.8"/><path d="M-12 -4Q-12 -24 0 -24Q12 -24 12 -4Z" fill="#9b7cc8" stroke="#4a3b7a" stroke-width="1.8"/><path d="M-12 -9H12" stroke="#fce49a" stroke-width="3"/>';
  if (ar) s += '<g transform="translate(14 -6) rotate(8)"><path d="M0 -10V-2" stroke="#8a7a6e" stroke-width="1"/><rect x="-11" y="-2" width="22" height="14" rx="2" fill="#fffef6" stroke="#8a7a6e" stroke-width="1.3"/><text y="9" text-anchor="middle" font-size="10" ' + KF_FR + ' fill="#4a3b7a">' + ar + '</text></g>';
  return s + '</g>';
}
/* a szekér-stand (rajzterv 1. pont, oldalnézet): hátfal + polc + kacatok, Zsivány helye, ponyva + cégér, elöl a pult és a kerék.
   zsivany: a figura helye (a pályán él; a térképen nincs) */
function zsStand(zsivany) {
  var s = '<g filter="url(#lt-firka)"><rect x="408" y="140" width="292" height="170" fill="#e9c193" stroke="#8a5a3a" stroke-width="2.4"/>', i;
  for (i = 0; i < 7; i++) s += '<path d="M' + (450 + i * 42) + ' 140V310" stroke="#d6a46f" stroke-width="1.6"/>';
  s += '<rect x="414" y="214" width="280" height="8" rx="2" fill="#b07a4c" stroke="#7a4f2c" stroke-width="1.6"/>' +
       '<rect x="398" y="66" width="12" height="330" rx="3" fill="#c9915e" stroke="#7a4f2c" stroke-width="2"/><rect x="698" y="66" width="12" height="330" rx="3" fill="#c9915e" stroke="#7a4f2c" stroke-width="2"/></g>';
  s += zsKacat("teafozo", 438, 212) + zsKacat("ora", 490, 212) + zsKacat("lampas", 540, 212) + zsKacat("konyvek", 678, 212) + zsKacat("csizma", 436, 300) + zsKacat("kalap", 668, 300);
  if (zsivany) s += '<g transform="translate(752 62) scale(-1.1 1.1)"><g class="zs-juli-hely"></g></g>';
  /* ponyva: zöld–krém csíkok, cakkos szél (Zsivány füle elé kerül) */
  s += '<g transform="translate(0 -26)"><g filter="url(#lt-firka)"><path d="M380 104L728 104L742 132L366 132Z" fill="#fffaf0" stroke="#4f8f42" stroke-width="2.4"/>';
  for (i = 0; i < 9; i++) { var x0 = 380 + i * 38.7, x1 = x0 + 19.3; s += '<path d="M' + pcF(x0) + ' 104L' + pcF(x1) + ' 104L' + pcF(x1 - 7 + i * 1.7) + ' 132L' + pcF(x0 - 14 + i * 1.7) + ' 132Z" fill="#8fd18a"/>'; }
  var cakk = "M366 132"; for (i = 0; i < 12; i++) { var a = 366 + i * 31.3; cakk += "Q" + pcF(a + 15.6) + " 150 " + pcF(a + 31.3) + " 132"; }
  s += '<path d="' + cakk + 'Z" fill="#8fd18a" stroke="#4f8f42" stroke-width="2.2"/><path d="M380 104Q554 76 728 104" fill="#a7d99a" stroke="#4f8f42" stroke-width="2.2"/></g></g>';
  s += '<g filter="url(#lt-firka)"><path d="M404 74H300" stroke="#7a4f2c" stroke-width="5" stroke-linecap="round"/><path d="M318 76V86M386 76V86" stroke="#7a4f2c" stroke-width="2"/>' +
       '<rect x="292" y="86" width="118" height="48" rx="10" fill="#fff4e8" stroke="#b35f28" stroke-width="2.6"/>' +
       '<path d="M298 128C320 140 360 140 378 126C366 128 350 126 340 122" fill="#f4a15e" stroke="#b35f28" stroke-width="1.6"/><path d="M372 126C378 124 384 120 386 116C382 124 378 128 372 130Z" fill="#fff"/></g>' +
       '<text x="351" y="106" text-anchor="middle" font-size="13" ' + KF_FR + ' fill="#b35f28">Zsivány</text><text x="351" y="121" text-anchor="middle" font-size="12" ' + KF_FR + ' fill="#b35f28">zsibvására</text>';
  s += '<g filter="url(#lt-firka)"><rect x="390" y="306" width="330" height="18" rx="4" fill="#c9915e" stroke="#7a4f2c" stroke-width="2.4"/><rect x="400" y="322" width="310" height="62" fill="#e0ad78" stroke="#7a4f2c" stroke-width="2.4"/>' +
       '<path d="M400 343H710M400 363H710" stroke="#c9915e" stroke-width="2"/><path d="M410 330L700 378M700 330L410 378" stroke="#c9915e" stroke-width="1.6" opacity=".6"/>' +
       '<circle cx="452" cy="390" r="34" fill="none" stroke="#7a4f2c" stroke-width="7"/><circle cx="452" cy="390" r="34" fill="none" stroke="#c9915e" stroke-width="4"/>';
  for (i = 0; i < 8; i++) { var w = i * Math.PI / 4; s += '<path d="M452 390L' + pcF(452 + 31 * Math.cos(w)) + ' ' + pcF(390 + 31 * Math.sin(w)) + '" stroke="#7a4f2c" stroke-width="3"/>'; }
  s += '<circle cx="452" cy="390" r="6" fill="#b07a4c" stroke="#7a4f2c" stroke-width="2"/><rect x="672" y="384" width="12" height="38" rx="3" fill="#c9915e" stroke="#7a4f2c" stroke-width="2"/>' +
       '<path d="M716 360L770 392" stroke="#7a4f2c" stroke-width="6" stroke-linecap="round"/><path d="M716 360L770 392" stroke="#c9915e" stroke-width="3" stroke-linecap="round"/></g>';
  return s;
}
/* a stand a Piactér térképén (rajzterv 2. pont): kicsiben, Zsivány nélkül; (0, 0) a talppont */
function zsTerkepStand() { return '<ellipse cx="0" cy="3" rx="66" ry="10" fill="#3c2a50" opacity=".14"/><g transform="scale(.3) translate(-555 -410)">' + zsStand(false) + '</g>'; }

function zsSzoveg(x, y, t, m, szin, anchor) { return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + ' font-size="' + (m || 18) + '" ' + KF_FR + ' fill="' + (szin || "#4a3b7a") + '">' + kiiras(t) + '</text>'; }
function zsPapir(x, y, w, h) { return '<g filter="url(#lt-firka)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#fffdf3" stroke="#c9b48a" stroke-width="1.8"/></g>'; }
function zsGomb(x, y, w, g, t, szin) {
  return '<g class="zs-gomb" data-g="' + g + '" style="cursor:pointer" transform="translate(' + x + ' ' + y + ')"><g filter="url(#lt-firka)"><rect x="' + (-w / 2) + '" y="-22" width="' + w + '" height="44" rx="12" fill="#fffaf0" stroke="' + szin + '" stroke-width="3"/></g>' +
    '<text y="7" text-anchor="middle" font-size="19" ' + KF_FR + ' fill="' + szin + '">' + t + '</text></g>';
}
/* a soron lévő ≈ cetli (munka-doboz: y0 a teteje) */
function zsCetli(JL, x, y0) {
  if (x.lep !== "kerek") return "";
  var ar = x.lista[x.i], all = x.halvany ? "halvany" : JL.seg >= 1 ? "hiba" : "ures";
  return kfBecsles(10, y0, .9, ar, all, "", !x.halvany && !JL.lezart);
}
/* a becslés és a pontos sor (a tábla mellett) */
function zsSorok(x, yb, yp) {
  var s = "", L = x.lep;
  if (L === "becs" || x.becsles != null) s += zsSzoveg(14, yb + 8, "≈ " + x.kerek.join(" + ") + " =" + (x.becsles != null ? " " + x.becsles : ""), 20);
  if (L === "pontos" || L === "javit") s += zsSzoveg(14, yp + 8, (L === "javit" ? "pontosan: " : "") + x.lista.join(" + ") + " =", 20);
  return s;
}

/* 🫧 maszatos ár: a tárgy a maszatos cédulával (a tábla), a szalag, Zsivány tálja a visszajáróval */
function zsMaszatRajz(JL) {
  var x = JL.f.zs, d = x.d, s = '', i;
  s += zsKacat(d.aru[0], 56, 92, 0) + '<path d="M72 70Q100 40 104 54" fill="none" stroke="#8a7a6e" stroke-width="1.4"/>';
  if (x.lep === "rak") s += '<path d="M120 58Q150 44 178 62T200 84Q170 96 140 88T120 58Z" fill="#b9a6c9" opacity=".5"/>';
  s += zsSzoveg(150, 128, x.halvany ? "fizettünk: " + d.fiz : "", 16, "#6e4a36", "middle");
  /* Zsivány tálja: a visszajáró érmék (felvehetők, amíg a szalagra kerülnek) */
  s += '<g filter="url(#lt-firka)"><ellipse cx="145" cy="372" rx="118" ry="26" fill="#e6f4f1" stroke="#3f7f75" stroke-width="2.2"/></g>' + zsSzoveg(145, 420, "ennyit adott vissza", 14, "#3f7f75", "middle");
  d.ermek.forEach(function (v, j) {
    if (x.rakott && x.rakott.indexOf(j) >= 0 || x.fog === j) return;
    var cx = 145 + (j - (d.ermek.length - 1) / 2) * 58;
    s += kfTaller(cx, 364, v, 1, x.lep === "rak" && !JL.lezart ? ' class="jl-fog" data-fog="e-' + j + '" data-m="1"' : '');
  });
  if (x.halvany) return s;
  /* a számszalag: a fizetett összegtől visszafelé; szám csak a fizetett összegnél (és 1. hiba után a kerek tízeseknél) */
  var hi = d.fiz, lo = Math.max(0, d.fiz - d.vissza - 4), x0 = 14, x1 = 276, e = (x1 - x0) / (hi - lo), Y = 252, px = function (n) { return x0 + (n - lo) * e; };
  s += '<rect class="jl-hely" data-hely="szalag" x="6" y="150" width="278" height="130" rx="14" fill="#fff" fill-opacity="' + (x.lep === "rak" ? .35 : 0) + '" stroke="' + (x.lep === "rak" ? "#c9b6dc" : "none") + '" stroke-dasharray="6 5"/>';
  s += '<path d="M' + x0 + ' ' + Y + 'H' + x1 + '" stroke="#c9b48a" stroke-width="5" stroke-linecap="round"/>';
  for (i = lo + 1; i <= hi; i++) { var t = i % 10 === 0; if (e >= 3.5 || t) s += '<path d="M' + pcF(px(i)) + ' ' + (Y - (t ? 9 : 4)) + 'V' + (Y + (t ? 9 : 4)) + '" stroke="#a8936a" stroke-width="' + (t ? 2.2 : 1.2) + '"/>'; if (t && JL.seg >= 1 && i !== hi) s += zsSzoveg(pcF(px(i)), Y + 28, String(i), 13, "#5f84b0", "middle"); }
  s += zsSzoveg(pcF(px(hi)), Y + 28, String(hi), 16, "#4a3b7a", "middle");
  var p = hi;
  (x.rakott || []).forEach(function (j, k) {   /* az érmék visszaugranak: ív a régi helytől az újig, az érme az ív tetején */
    var v = d.ermek[j], a = px(p), b = px(p - v), cy = Y - 16 - Math.min(70, 14 + v * e * .3);
    s += '<path d="M' + pcF(a) + ' ' + (Y - 4) + 'Q' + pcF((a + b) / 2) + ' ' + pcF(cy) + ' ' + pcF(b) + ' ' + (Y - 4) + '" fill="none" stroke="' + (k % 2 ? "#5f92d0" : "#f2708f") + '" stroke-width="3" stroke-linecap="round"/>';
    s += kfTaller((a + b) / 2, (Y - 4 + cy) / 2 - 4, v, .72, '');
    p -= v;
  });
  if (x.rakott && x.rakott.length === d.ermek.length) s += '<path d="M' + pcF(px(p)) + ' ' + (Y + 4) + 'l-7 13h14Z" fill="#e0417a" stroke="#a83a44" stroke-width="1.2"/>';   /* a megálló: jel, szám nélkül */
  return s;
}
/* 🎒 elég lesz? / válassz te: a lista (vagy a polc), a cetli, a sorok, a döntés gombjai, az erszény */
function zsElegRajz(JL) {
  var x = JL.f.zs, d = x.d, s = '', n, i;
  if (d.forma === "valassz") {
    s += zsPapir(4, 4, 282, 150) + zsSzoveg(145, 28, "Együtt ≈ " + d.cel, 18, "#8a4fd0", "middle");
    d.polc.forEach(function (v, j) {
      var cx = 40 + j * 70, val = x.valasztott.indexOf(j) >= 0, ki = x.lep !== "valaszt";
      s += '<g' + (ki ? '' : ' class="zs-valaszt" data-i="' + j + '" style="cursor:pointer"') + (ki && !val ? ' opacity=".35"' : '') + '><rect x="' + (cx - 32) + '" y="40" width="64" height="108" rx="10" fill="' + (val ? "#fff3a0" : "#fff") + '" fill-opacity="' + (val ? .9 : .01) + '" stroke="' + (val ? "#e3a92a" : "none") + '" stroke-width="2.4"/>' +
        zsKacat(d.aruk[j][0], cx, 100, 0) + kfCedula(cx, 104, v, .8) + '</g>';
    });
  } else {
    n = d.tetelek.length;
    var kol = typeof lenyKiserVan === "function" && lenyKiserVan() ? (lenyTar().nev || "A kölyök") + " listája" : "Tüske néni listája";
    s += zsPapir(4, 4, 282, 34 + n * 38) + zsSzoveg(145, 26, kol, 15, "#8a7a9e", "middle");
    for (i = 0; i < n; i++) {
      var y = 44 + i * 38, most = x.lep === "kerek" && x.i === i;
      if (most) s += '<rect x="8" y="' + (y - 18) + '" width="274" height="36" rx="8" fill="#fff3a0" opacity=".7"/>';
      s += '<g transform="translate(26 ' + (y + 14) + ') scale(.62)">' + zsKacat(d.aruk[i][0], 0, 0, 0) + '</g>' + zsSzoveg(48, y + 6, d.aruk[i][1], 15) + zsSzoveg(196, y + 7, String(d.tetelek[i]), 20, "#4a3b7a", "end");
      if (x.kerek[i] != null) s += zsSzoveg(214, y + 7, "≈ " + x.kerek[i], 20, "#3f9e6a");
    }
  }
  s += zsCetli(JL, x, 158) + zsSorok(x, 250, 310);
  if (x.lep === "dont") s += zsGomb(160, 372, 92, "eleg", "Elég", "#3f9e6a") + zsGomb(252, 372, 84, "nem", "Nem elég", "#e0417a");
  if (d.forma === "eleg") s += kfErszeny(44, 428, 1.25, d.erszeny);
  return s;
}
/* 🧾 ravasz blokk: a kosár tételei a cédulával, Zsivány blokkja, a cetli, a sorok, a pecsétek */
function zsBlokkRajz(JL) {
  var x = JL.f.zs, d = x.d, s = '', n = d.tetelek.length, dy = n > 2 ? 66 : 90;
  s += '<g filter="url(#lt-firka)"><path d="M6 ' + (20 + n * dy) + 'Q76 ' + (30 + n * dy) + ' 146 ' + (20 + n * dy) + 'L140 12Q76 4 12 12Z" fill="#f3e2c2" fill-opacity=".6" stroke="#b5804a" stroke-width="1.8"/></g>';
  d.tetelek.forEach(function (v, i) {
    var y = 18 + i * dy, most = x.lep === "kerek" && x.i === i;
    if (most) s += '<rect x="10" y="' + (y - 2) + '" width="134" height="' + (dy - 6) + '" rx="8" fill="#fff3a0" opacity=".7"/>';
    s += zsKacat(d.aruk[i][0], 34, y + 46, 0) + kfCedula(90, y, v, 1);
    if (x.kerek[i] != null) s += zsSzoveg(90, y + 60, "≈ " + x.kerek[i], 16, "#3f9e6a", "middle");
  });
  var sorok = d.sorok.map(function (r) { return [zsKacat(d.aruk[r.i][0], 0, 0, 0), r.ar]; });
  s += kfBlokk(154, 4, 132, sorok, d.irt, { cim: "Zsivány · blokk", pecset: x.pecset === "ok" && d.pontos ? "ok" : x.pecset === "x" && !d.pontos ? "x" : null, kihuz: x.lep === "javit" && !d.pontos });
  s += zsCetli(JL, x, 240) + zsSorok(x, 262, 326);
  if (x.lep === "pecset") s += zsGomb(82, 396, 110, "ok", "✓ jó", "#3f9e6a") + zsGomb(212, 396, 110, "x", "✗ hibás", "#e0417a");
  return s;
}

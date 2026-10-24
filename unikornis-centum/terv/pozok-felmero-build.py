#!/usr/bin/env python3
"""pozok-felmero-build.py — ÉLŐ PÓZ-PRÓBAPAD az unikornis pózaihoz (unikornis pózok, 0. lépés).

Mit csinál: a játékot (index.html + style.css + game.js) egyetlen önálló HTML-be fűzi, és rátesz
egy "próbapad" réteget, amely a VALÓDI játékkódból rajzolja ki az unikornis összes pózát egymás
mellett, minden díszben (fej, nyak, hát, láb, szárny, farok). Alatta a felmérő lap szövege
(terv/unikornis-pozok-felmero.html <main> része) jelenik meg.

Használat:  python terv/pozok-felmero-build.py
Kimenet:    C:\\Users\\Dombi-NyárádiGabriel\\Matekos\\uc-felmero-pozok.html  (helyi, NEM kerül a repóba)

Biztonság: a próbapad semmit nem ment (a localStorage-írás ki van kapcsolva), néma (a felolvasás
és a hangfelismerés ál-objektum), felhőhöz nem csatlakozik. A játék mentéseit nem érinti.
Későbbi lépésekben (1–9.) ugyanez a próbapad mutatja az előtte/utána állapotot.

5. sor — 🐉 a kissárkány (kissárkány teste, 3. kör): oldalról / szemből / hátulról × a 4 ruha (kész és készülő)
× a mozdulatok (lélegzés, totyogás, kísérő-lebegés, repülés), a horgonypontokkal; a valódi lenyFordul és lenyPorog
lefényképezve. Minden új sárkány-képesség előtte/utána képe itt készül (terv/sarkany-test-rajzterv.html).
A gép méri: kilóg-e a rajz a képből, a talp a földön van-e (y = 0), fordulás után nem marad-e nézet-réteg.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DST = r"C:\Users\Dombi-NyárádiGabriel\Matekos\uc-felmero-pozok.html"
rd = lambda f: open(os.path.join(SRC, f), encoding="utf-8").read()

PRE = r"""<script>
window.__UC_GYORS = true;
try { Storage.prototype.setItem = function () {}; } catch (e) {}          /* a próbapad SOHA nem ment */
class FakeSR { constructor() { this.lang = "hu-HU"; } start() {} stop() { var s = this; setTimeout(function () { s.onend && s.onend(); }, 0); } abort() { this.stop(); } }
window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
try { speechSynthesis.speak = function (u) { setTimeout(function () { u.onstart && u.onstart(); u.onend && u.onend(); }, 5); };
      speechSynthesis.getVoices = function () { return [{ lang: "hu-HU", name: "Teszt", localService: true }]; }; } catch (e) {}
try { window.AudioContext = window.webkitAudioContext = undefined; } catch (e) {}   /* csilingelés se szóljon */
</script>"""

PAD = r"""<style>
#fm{ position:fixed; inset:0; z-index:2147483000; overflow:auto; background:#fffaf3; color:#3b2f55;
  font-family:Fredoka,"Segoe UI",sans-serif; padding:18px 16px 60px; }
#fm *{ transition:none !important; }
#fm h1{ margin:0 0 4px; font-size:26px; color:#6a3fb8; }
#fm h2{ margin:28px 0 8px; font-size:20px; color:#6a3fb8; border-bottom:2px solid #eadcf7; padding-bottom:4px; }
#fm .fm-sor{ display:flex; flex-wrap:wrap; gap:12px; }
#fm figure{ margin:0; width:230px; background:#fff; border:2px solid #eadcf7; border-radius:14px; overflow:hidden; }
#fm figure.hiba{ border-color:#f08a9a; }
#fm figure.gyanu{ border-color:#f3c35a; }
#fm .fm-szin{ position:relative !important; width:230px !important; height:230px !important; overflow:hidden; background:linear-gradient(#eaf6ff,#e3f3d6 70%,#cfe8b8) !important; }
#fm .fm-szin.felho{ background:linear-gradient(#f3ecff,#fdf6ff 70%,#efe6ff) !important; }
#fm figcaption{ padding:7px 10px 9px; font-size:13.5px; line-height:1.35; }
#fm figcaption b{ display:block; font-size:15px; }
#fm .cimke{ display:inline-block; font-size:11px; font-weight:800; border-radius:999px; padding:1px 8px; margin-top:4px; }
#fm .cimke.hiba{ background:#ffe1e6; color:#b0263e; } #fm .cimke.gyanu{ background:#fff1cc; color:#8a5a00; } #fm .cimke.ok{ background:#e2f6dc; color:#2f7a2e; }
#fm .fm-lenyek button{ font:inherit; font-weight:700; border:2px solid #c9a8e6; background:#fff; color:#6a3fb8; border-radius:999px; padding:4px 14px; margin:6px 6px 0 0; cursor:pointer; }
#fm .fm-lenyek button.aktiv{ background:#8a4fd0; color:#fff; border-color:#8a4fd0; }
#fm .fm-lap{ max-width:980px; margin-top:34px; }
#fm .fm-odu{ width:470px !important; }
#fm .fm-odu .fm-szin{ width:470px !important; height:260px !important; }
#fm .fm-odu svg{ width:100%; height:100%; }
#fm .fm-ln-sor{ display:flex; flex-wrap:wrap; gap:10px; align-items:stretch; margin-bottom:10px; }
#fm .fm-ln-cim{ width:150px; font-size:14px; line-height:1.35; align-self:center; }
#fm .fm-ln-cim b{ display:block; font-size:15px; }
#fm .fm-ln-sor figure{ width:170px; }
#fm .fm-lnszin{ width:170px; height:132px; background:linear-gradient(#fff6e8,#f6ead6 78%,#e9d6b8); }
#fm .fm-lnszin svg{ width:100%; height:100%; display:block; }
#fm .fm-hg{ display:none; } #fm.horgony .fm-hg{ display:inline; }
#fm .fm-kapcs{ font-size:14px; margin:4px 0 10px; display:block; }
#fm h3{ margin:18px 0 8px; font-size:16px; color:#8a4fd0; }
</style>
<script>
(function () {
  var OLTOZET = { fej: "fej-k", nyak: "nyak-k", hat: "hat-k", lab: "lab-a", oldal: "oldal-k", farok: "farok-a", van: {} };
  var POZ_ANIM = /^(uni-m-|uni-j-|trukk-|kert-eszik|kert-szagol|kert-alszik|tk-porges|eszik|szagol)/;
  function lenyC() { return UC.LENYEK[UC.mentes.leny]; }
  function felold() {
    var pr = UC.mentes.profilok[UC.mentes.leny];
    pr.oltozet = JSON.parse(JSON.stringify(OLTOZET));
  }
  /* minden animáció megáll: a póz-animáció a megadott fázisban, az "élet" (lélegzés, sörény) az elején */
  function fagyaszt(root, frac) {
    root.getAnimations({ subtree: true }).forEach(function (a) {
      var t = a.effect.getTiming(), d = typeof t.duration === "number" ? t.duration : 0;
      a.pause(); a.currentTime = POZ_ANIM.test(a.animationName || "") ? d * frac : 0;
    });
  }
  function kertUni(id, osztaly, dir) {
    return '<div id="kert-szinter" class="fm-szin"><div id="kert-uni-doboz" class="kert-uni-doboz ' + (osztaly || "") + '" style="--dir:' + (dir || 1) + '">' +
      '<div class="kert-uni-flip"><svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' +
      UC.unikornisSVG(id, lenyC(), 1, UC.mentes.profilok[UC.mentes.leny].oltozet) + '</svg></div></div></div>';
  }
  function tkUni(id, osztaly) {
    var pr = UC.mentes.profilok[UC.mentes.leny];
    return '<div id="tk-szinter" class="fm-szin felho"><div class="tk-uni ' + (osztaly || "") + '" style="left:50%;bottom:8%;--dir:1">' +
      '<div class="tk-bob"><div class="kert-uni-flip"><svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' +
      UC.unikornisSVG(id, lenyC(), 1, pr.oltozet, pr.kinezet || null) + '</svg></div></div></div></div>';
  }
  function kartya(html, cim, megj, allapot) {
    var c = allapot ? '<span class="cimke ' + allapot + '">' + ({ hiba: "HIBA", gyanu: "FURCSA", ok: "rendben" })[allapot] + '</span>' : "";
    return '<figure class="' + (allapot || "") + '">' + html + '<figcaption><b>' + cim + '</b>' + (megj || "") + '<br>' + c + '</figcaption></figure>';
  }
  var N = 0;
  function uid() { return "fm" + (++N); }
  var KERT_POZOK = [
    ["", 0, 1, "Áll", "Alap oldalnézet, minden díszben. Külön pata, a bokapánt a csüdön (1a).", "ok"],
    ["uni-jar-seta", 0, 1, "Séta – 1. fázis", "Négy ütem (3. lépés): a hátsó láb most ér le, az elülső a levegőben, a térd behajlik.", "ok"],
    ["uni-jar-seta", 0.5, 1, "Séta – 2. fázis", "A test enyhén billen, a fej bólint; a földön lévő pata a talajon (gépi). A lábdísz a lábon.", "ok"],
    ["uni-jar-uget", 0.3, 1, "Ügetés", "Két ütem: az átlós lábpárok együtt, magasabbra emelt láb, felemelt farok (3. lépés).", "ok"],
    ["uni-jar-seta", 0.25, -1, "Séta balra (helyesen)", "Pörgés ELŐTT így megy balra.", "ok"],
    ["ules-all", 0, 1, "Ül", "Kutyás ülés (2a): a hátsó láb összecsukódik, a lábdísz a lábon marad. A fej előre néz, a farok a földre simul (2b).", "ok"],
    ["fekszik-all", 0, 1, "Fekszik (ágy nélkül)", "A lábak a test alá hajlanak (2a); a test az ágy magasságán marad. Szép alvó póz: 8. lépés.", "gyanu"],
    ["eszik", 0.4, 1, "Eszik", "Az elülső térd rogy (2a), a fej és a nyak lehajol (2b).", "ok"],
    ["szagol", 0.4, 1, "Szagol", "Mint az evés, kisebb mértékben.", "ok"],
    ["trukk-ugras", 0.2, 1, "Ugrás – guggol", "Térd előre, csánk hátra (2a).", "ok"],
    ["trukk-ugras", 0.42, 1, "Ugrás – levegőben", "", ""],
    ["trukk-csillam", 0.5, 1, "Csillámszórás", "", ""]
  ];
  function rajzol() {
    felold();
    var h = '<h1>🦄 Unikornis pózok — élő próbapad</h1>' +
      '<div>Minden kép a valódi játékkódból készül, ugyanabban a díszben (korona, medál, takaró, bokapánt, szárny, szalagcsokor). ' +
      'A pózok „meg vannak állítva” egy jellemző pillanatban.</div>' +
      '<div class="fm-lenyek">' + Object.keys(UC.LENYEK).map(function (k) {
        return '<button data-l="' + k + '" class="' + (k === UC.mentes.leny ? "aktiv" : "") + '">' + UC.LENYEK[k].nev + '</button>';
      }).join("") + '</div>';
    h += '<h2>1. Kert — a pózok</h2><div class="fm-sor" id="fm-kert">';
    KERT_POZOK.forEach(function (p) { h += kartya(kertUni(uid(), p[0], p[2]), p[3], p[4], p[5]); });
    h += '</div>';
    h += '<h2>2. Pörgés (közös: kert és felhőkert) és a séta utána</h2><div class="fm-sor" id="fm-porges"><figure><div class="fm-szin" id="fm-porges-gyujto">' + '</div><figcaption>pörgés készül…</figcaption></figure></div>';
    h += '<h2>3. Felhőkert</h2><div class="fm-sor" id="fm-tk">' +
      kartya(tkUni(uid(), ""), "Áll", "Ugyanaz a rajz, mint a kertben.", "ok") +
      kartya(tkUni(uid(), "uni-jar-seta"), "Séta", "Ugyanaz a közös járás (3. lépés), fordulás és pörgés (4. lépés), mint a kertben.", "ok") +
      '</div>';
    h += '<h2>4. Odú és a többi helyszín</h2><div class="fm-sor" id="fm-tobbi">' +
      '<figure class="fm-odu gyanu"><div class="fm-szin" id="odu-szoba">' + UC.oduSVG() + '</div><figcaption><b>Odú — séta közben</b>A közös járás (3. lépés); a tempót az oduUniSetal a közös út-tervezőtől kéri. Az ágyba még nem lehet belefeküdni (9. lépés).<br><span class="cimke gyanu">FURCSA</span></figcaption></figure>' +
      kartya('<div class="fm-szin"><svg viewBox="-80 -110 160 130" width="230" height="200">' + UC.unikornisSVG(uid(), lenyC(), 0.62, UC.mentes.profilok[UC.mentes.leny].oltozet) + '</svg></div>',
        "Pályán (ösvényen)", "Nincs séta: a figura merev, kis pattogással „csúszik” állomásról állomásra. Nem fordul, a lába nem mozog.", "hiba") +
      '</div>';
    h += lnSzakasz();
    var fm = document.getElementById("fm");
    fm.innerHTML = h + '<div class="fm-lap">' + (window.__FM_LAP || "") + '</div>';
    fm.querySelectorAll(".fm-lenyek button").forEach(function (b) {
      b.onclick = function () { UC.mentes.leny = b.getAttribute("data-l"); rajzol(); };
    });
    /* fázisok beállítása */
    var kartyak = fm.querySelectorAll("#fm-kert figure");
    KERT_POZOK.forEach(function (p, i) { fagyaszt(kartyak[i], p[1]); });
    var tk = fm.querySelectorAll("#fm-tk figure");
    [0, 0.5].forEach(function (f, i) { fagyaszt(tk[i], f); });
    var odu = fm.querySelector("#odu-szoba #odu-uni-mozgo");
    if (odu) odu.classList.add("uni-jar-seta");
    fagyaszt(fm.querySelector("#fm-tobbi"), 0.5);
    porgesFelvesz();
    lnBeallit(fm);
  }

  /* ════ 5. 🐉 KISSÁRKÁNY — a valódi shKolyokRajz + lenyNezetMutat + lenyFordul + lenyPorog (kissárkány teste, 3. kör) ════ */
  var LN_VB = [-80, -112, 160, 124];   /* fióka-egység: talp y = 0, közép x = 0 (mint a ruha-kártyákon) */
  var LN_RUHAK = ["sal", "sapka", "csizma", "kopeny"];
  var LN_NEZETEK = ["oldal", "elol", "hatul"], LN_NEV = { oldal: "oldalról", elol: "szemből", hatul: "hátulról" };
  function lnMind(n) { return LN_RUHAK.map(function (r) { return [r, n]; }); }
  var LN_SOROK = [   /* [cím, megj., ruhák [[id, felrakott részlet]], a sarkany osztálya, a burok osztálya, fázis] */
    ["Csupasz", "", [], "", "", 0],
    ["Csillagos sál", "", [["sal", 10]], "", "", 0],
    ["Bojtos sapka", "Hátulról a sapka eltakarja a tarkó tüskéit.", [["sapka", 10]], "", "", 0],
    ["Pöttyös csizma", "A láb körvonalát követi, hátulról is látszik.", [["csizma", 10]], "", "", 0],
    ["Hőscsillag-köpeny", "Hátulról öt csík, mint oldalról.", [["kopeny", 10]], "", "", 0],
    ["Mind a négy", "", lnMind(10), "", "", 0],
    ["Készülőben 3/10", "Mint az odúban: a kész részletek telten, a hiányzók halványan — a nézet is ezt mutatja.", lnMind(3), "", "", 0],
    ["Készülőben 6/10", "", lnMind(6), "", "", 0]
  ];
  var LN_MOZDULAT = [
    ["Lélegzik, rebben", "Az élet-animáció félúton: a testrész-csoportok (sz-test, sz-szarny, sz-farok, sz-fej) mindhárom nézetben ugyanazok.", [], "", "", 0.5],
    ["Totyog (odú)", "ln-hop a burkon: a kis ugrás.", [], "", "ln-hop", 0.5],
    ["Kísérő (ösvény)", "kiser: gyors szárnycsapás, lebegés.", [["sal", 10]], "kiser", "kiser-lebeg", 0.4],
    ["Repül", "repul: szárnycsapás, a test nem lélegzik.", [], "repul", "", 0.3]
  ];
  function lnHorgonyok(nezet) {
    var H = UC.LENY_HORGONY[nezet], s = "";
    Object.keys(H).forEach(function (k) {
      if (!H[k]) return;
      (typeof H[k][0] === "number" ? [H[k]] : H[k]).forEach(function (q) {
        s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2.6" fill="#e0306a" stroke="#fff" stroke-width="1"/>' +
          '<text x="' + (q[0] + 3.5) + '" y="' + (q[1] - 3) + '" font-size="7" font-weight="700" fill="#b0263e">' + k + '</text>';
      });
    });
    return '<g class="fm-hg">' + s + '</g>';
  }
  function lnKep(nezet, ruhak, cls, burok) {
    var lista = ruhak.map(function (r) { return { h: UC.SH_HOLMI_BY[r[0]], n: r[1] }; });
    var uj = ruhak.length && ruhak[0][1] < UC.KULD_RESZ ? ruhak[0][1] - 1 : null;   /* a legutóbb felrakott részlet felvillan */
    return '<div class="fm-lnszin"><svg viewBox="' + LN_VB.join(" ") + '" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="-80" y1="0" x2="80" y2="0" stroke="#c9a77a" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<ellipse cx="0" cy="2" rx="30" ry="6" fill="#3c2a50" opacity=".14"/>' +
      '<g class="fm-ln-flip" data-nezet="' + nezet + '" style="transform:scale(1,1)"><g class="' + (burok || "") + '">' +
      UC.shKolyokRajz(UC.lenyPal(), { lista: lista, cls: cls || "", uj: uj }) + '</g></g>' + lnHorgonyok(nezet) + '</svg></div>';
  }
  function lnSor(s) {
    return '<div class="fm-ln-sor" data-fazis="' + s[5] + '"><div class="fm-ln-cim"><b>' + s[0] + '</b>' + s[1] + '</div>' +
      LN_NEZETEK.map(function (nz) { return '<figure>' + lnKep(nz, s[2], s[3], s[4]) + '<figcaption><b>' + LN_NEV[nz] + '</b><span class="fm-meres"></span></figcaption></figure>'; }).join("") + '</div>';
  }
  function lnSzakasz() {
    return '<h2>5. 🐉 Kissárkány — nézetek, ruhák, mozdulatok</h2>' +
      '<div>A valódi játékkódból: oldalról a <code>lenyRajz</code> + ruhák, szemből és hátulról a <code>lenyNezetMutat</code> rakja rá a nézetet, ' +
      'ugyanúgy, mint fordulásnál. A színt a fenti unikornis-gomb adja (menta / levendula / barack). A gép méri: kilóg-e a rajz, a talp a földön van-e.</div>' +
      '<label class="fm-kapcs"><input type="checkbox" id="fm-hg-kapcs"> horgonypontok mutatása (LENY_HORGONY — ruha, kellék, új képesség csak ezekhez kapaszkodik)</label>' +
      '<h3>Ruhák</h3><div id="fm-ln">' + LN_SOROK.map(lnSor).join("") +
      '<h3>Mozdulatok</h3>' + LN_MOZDULAT.map(lnSor).join("") + '</div>' +
      '<h3>Fordulás és pörgés (a valódi lenyFordul / lenyPorog, sapkában és köpenyben)</h3>' +
      '<div class="fm-ln-sor" id="fm-ln-fordul"><figure><div class="fm-lnszin"></div><figcaption>fordulás készül…</figcaption></figure></div>' +
      '<div class="fm-ln-sor" id="fm-ln-porog"><figure><div class="fm-lnszin"></div><figcaption>pörgés készül…</figcaption></figure></div>';
  }
  /* a sárkány minden animációja megáll a megadott fázisban (a pislogás nyitott szemmel) */
  function lnFagyaszt(root, frac) {
    root.getAnimations({ subtree: true }).forEach(function (a) {
      var t = a.effect.getTiming(), d = typeof t.duration === "number" ? t.duration : 0;
      a.pause(); a.currentTime = a.animationName === "szPislog" ? 0 : d * frac;
    });
  }
  function lnCimke(fig, allapot, szoveg) {
    fig.className = allapot === "ok" ? "" : allapot;
    fig.querySelector(".fm-meres").innerHTML = (szoveg ? '<br>' + szoveg : "") + '<br><span class="cimke ' + allapot + '">' + ({ hiba: "HIBA", gyanu: "FURCSA", ok: "rendben" })[allapot] + '</span>';
  }
  /* mérés: a látható rajz (nézet-réteg, ill. oldalrajz) befoglaló doboza — a tüsszentés-szikra és a buborék nélkül */
  function lnMer(fig) {
    var el = fig.querySelector(".fm-ln-flip"), g = el.querySelector(".ln-nezet-reteg") || el.querySelector(".sh-kolyok");
    var rejt = g.querySelectorAll("[data-szikra], .ln-buborek");
    Array.prototype.forEach.call(rejt, function (e) { e.style.display = "none"; });
    var b = g.getBBox();
    Array.prototype.forEach.call(rejt, function (e) { e.style.display = ""; });
    var al = b.y + b.height, baj = [];
    if (b.x < LN_VB[0] || b.y < LN_VB[1] || b.x + b.width > LN_VB[0] + LN_VB[2] || al > LN_VB[1] + LN_VB[3]) baj.push("kilóg a képből");
    if (Math.abs(al) > 2.5) baj.push("a talp " + al.toFixed(1) + "-en, nem a földön");
    if (el.getAttribute("data-nezet") !== "oldal" && !el.querySelector(".ln-nezet-reteg")) baj.push("nincs nézet-réteg");
    lnCimke(fig, baj.length ? (baj[0] === "kilóg a képből" ? "hiba" : "gyanu") : "ok", baj.join(", "));
  }
  function lnBeallit(fm) {
    var k = fm.querySelector("#fm-hg-kapcs");
    k.checked = fm.classList.contains("horgony");
    k.onchange = function () { fm.classList.toggle("horgony", k.checked); };
    Array.prototype.forEach.call(fm.querySelectorAll("#fm-ln .fm-ln-sor"), function (sor) {
      Array.prototype.forEach.call(sor.querySelectorAll(".fm-ln-flip"), function (el) {
        var nz = el.getAttribute("data-nezet");
        if (nz !== "oldal") UC.lenyNezetMutat(el, nz);
      });
      lnFagyaszt(sor, +sor.getAttribute("data-fazis"));
      Array.prototype.forEach.call(sor.querySelectorAll("figure"), lnMer);
    });
    lnFordulFelvesz();
    lnPorogFelvesz();
  }
  function lnKartya(html, cim, allapot, szoveg) {
    return '<figure class="' + (allapot === "ok" ? "" : allapot) + '">' + html + '<figcaption><b>' + cim + '</b>' + (szoveg ? '<br>' + szoveg : "") +
      '<br><span class="cimke ' + allapot + '">' + ({ hiba: "HIBA", gyanu: "FURCSA", ok: "rendben" })[allapot] + '</span></figcaption></figure>';
  }
  function lnVan(el) { return { reteg: el.querySelector(".ln-nezet-reteg"), oldalLatszik: el.querySelector(".sh-kolyok").style.visibility !== "hidden", dir: /scale\(\s*-1/.test(el.style.transform) ? -1 : 1 }; }
  var LN_FELVETEL = [["sapka", 10], ["kopeny", 10]];
  /* FORDULÁS jobbról balra: közben felénk néz (1A), utána balra néz, és nem marad nézet-réteg */
  function lnFordulFelvesz() {
    var hely = document.getElementById("fm-ln-fordul"), gy = hely.querySelector(".fm-lnszin");
    gy.outerHTML = lnKep("oldal", LN_FELVETEL, "", "");
    gy = hely.querySelector(".fm-lnszin");
    var el = gy.querySelector(".fm-ln-flip"), kozben = null;
    var ms = UC.lenyFordul(el, -1, function () {
      var v = lnVan(el), jo = !v.reteg && v.oldalLatszik && v.dir === -1;
      var out = (kozben ? lnKartya(kozben.html, "Fordulás közben", kozben.nezet === UC.LENY_FORDUL.nezet ? "ok" : "hiba", "felénk néz (" + LN_NEV[kozben.nezet] + "), " + ms + " ms") : "") +
        lnKartya(gy.outerHTML, "Fordulás után", jo ? "ok" : "hiba", jo ? "balra néz, a nézet-réteg eltűnt" : "maradt nézet-réteg, rejtett oldalrajz vagy rossz irány");
      if (!ms) out = lnKartya(gy.outerHTML, "Fordulás", "gyanu", "a gépen be van kapcsolva a mozgás-csökkentés: rögtön tükröz (ez így helyes)");
      hely.innerHTML = out;
      lnFagyaszt(hely, 0);
    });
    var r = el.querySelector(".ln-nezet-reteg .sarkany");
    if (r) kozben = { nezet: r.getAttribute("data-nezet"), html: gy.outerHTML };
  }
  /* PÖRGÉS: a 4 nézet lefényképezve (oldal → szemből → a másik oldal → hátulról), a végén vissza az eredeti irányba */
  function lnPorogFelvesz() {
    var hely = document.getElementById("fm-ln-porog"), gy = hely.querySelector(".fm-lnszin");
    gy.outerHTML = lnKep("oldal", LN_FELVETEL, "", "");
    gy = hely.querySelector(".fm-lnszin");
    var el = gy.querySelector(".fm-ln-flip"), keretek = [], utolso = "";
    var mo = new MutationObserver(function () {
      var v = lnVan(el), nz = v.reteg ? v.reteg.querySelector(".sarkany").getAttribute("data-nezet") : "oldal", kulcs = nz + v.dir;
      if (kulcs !== utolso && keretek.length < 4) { keretek.push({ nz: nz, dir: v.dir, html: gy.outerHTML }); utolso = kulcs; }
    });
    mo.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    UC.lenyPorog(el, 800, function () {
      mo.disconnect();
      var vart = ["oldal1", "elol1", "oldal-1", "hatul1"], v = lnVan(el), out = "";
      keretek.forEach(function (k, i) {
        var jo = k.nz + k.dir === vart[i];
        out += lnKartya(k.html, "Pörgés " + (i + 1) + ".", jo ? "ok" : "hiba", LN_NEV[k.nz] + (k.nz === "oldal" ? (k.dir < 0 ? " (balra)" : " (jobbra)") : ""));
      });
      if (!keretek.length) out = lnKartya(gy.outerHTML, "Pörgés", "gyanu", "nem pörgött (mozgás-csökkentés a gépen?)");
      var jo = !v.reteg && v.oldalLatszik && v.dir === 1;
      out += lnKartya(gy.outerHTML, "Pörgés után", jo ? "ok" : "hiba", jo ? "jobbra néz, mint előtte; nem maradt nézet-réteg" : "maradt nézet-réteg vagy rossz irány");
      hely.innerHTML = out;
      lnFagyaszt(hely, 0);
    });
  }
  /* a VALÓDI közös pörgés-függvényt (uniPorog) futtatjuk egy rejtett figurán, és lefényképezzük a 4 nézetét */
  function porgesFelvesz() {
    var gy = document.getElementById("fm-porges-gyujto");
    gy.innerHTML = kertUni("kert-uni", "", 1).replace(/^<div id="kert-szinter" class="fm-szin">|<\/div>$/g, "");
    var doboz = gy.querySelector(".kert-uni-doboz"), svg = doboz.querySelector(".kert-uni-svg"), flip = doboz.querySelector(".kert-uni-flip");
    doboz.style.setProperty("--dir", 1);
    UC.uniNezoAdat(doboz, { rajz: lenyC().rajz, kinezet: null, oltozet: UC.mentes.profilok[UC.mentes.leny].oltozet });
    var keretek = [], utolso = "";
    var mo = new MutationObserver(function () {
      var k = { html: svg.innerHTML, dir: doboz.style.getPropertyValue("--dir"), nezet: doboz.classList.contains("uni-nezetben") };
      var kulcs = k.dir + k.nezet + (svg.querySelector(".uni-nezet-reteg") ? svg.querySelector(".uni-nezet-reteg").innerHTML.length : 0);
      if (kulcs !== utolso && doboz.classList.contains("uni-porog")) { keretek.push(k); utolso = kulcs; }
    });
    mo.observe(doboz, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    UC.uniPorog(doboz, 800, function () {
      mo.disconnect();
      var nev = ["Pörgés — oldalról", "Pörgés — szemből", "Pörgés — balról", "Pörgés — hátulról"];
      var megj = ["", "Színek, pata és festék a közös színtáblából (1a), a díszek a NEZET_DISZ-ből (1b).", "", "Színek, pata és festék a közös színtáblából (1a), a díszek a NEZET_DISZ-ből (1b)."];
      var all = ["ok", "ok", "ok", "ok"];
      var out = "";
      for (var i = 0; i < 4 && i < keretek.length; i++) {
        out += kartya('<div id="kert-szinter" class="fm-szin"><div class="kert-uni-doboz' + (keretek[i].nezet ? " uni-nezetben" : "") + '" style="--dir:' + (keretek[i].dir || 1) + '"><div class="kert-uni-flip">' +
          '<svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' + keretek[i].html + '</svg></div></div></div>', nev[i], megj[i], all[i]);
      }
      /* ugyanez a figura a pörgés UTÁN, balra indítva — a cimkét MÉRJÜK: marad-e irány a belső rétegen (D1 javította) */
      doboz.style.setProperty("--dir", -1); doboz.classList.add("uni-jar-seta");
      var ragad = !!flip.style.getPropertyValue("--dir") || doboz.classList.contains("uni-nezetben");
      var bizonyit = '<figure class="' + (ragad ? "hiba" : "") + '"><div class="fm-szin" id="kert-szinter">' + gy.innerHTML + '</div><figcaption><b>Séta balra — pörgés UTÁN</b>' +
        (ragad ? 'Ugyanaz a parancs, mint fent a „Séta balra” — de jobbra néz, tehát hátrafelé megy. A pörgés „jobbra” irányt hagy a belső rétegen.<br><span class="cimke hiba">HIBA</span>'
               : 'A pörgés nem hagy irányt a belső rétegen: balra néz, előre megy (D1).<br><span class="cimke ok">rendben</span>') + '</figcaption></figure>';
      var hely = document.getElementById("fm-porges");
      hely.innerHTML = out + bizonyit;
      fagyaszt(hely, 0.25);
    });
  }
  function indul() {
    var k = document.querySelector("#profil-lista .profil-kartya");
    if (k) k.click();
    try { speechSynthesis.cancel(); } catch (e) {}
    if (UC.mentes) UC.mentes.hang = false;
    var fm = document.createElement("div"); fm.id = "fm"; document.body.appendChild(fm);
    rajzol();
  }
  if (document.readyState === "complete") setTimeout(indul, 300); else window.addEventListener("load", function () { setTimeout(indul, 300); });
})();
</script>"""

h = rd("index.html")
h = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda m: "<style>" + rd("style.css") + "</style>", h)
for f in ["kert-hangok.js", "tk-diszek.js", "game.js"]:
    h = re.sub(r'<script src="%s[^"]*"></script>' % re.escape(f),
               lambda m, f=f: (PRE if f == "kert-hangok.js" else "") + "<script>" + rd(f).replace("</script>", "<\\/script>") + "</script>", h)
lap = ""
lp = os.path.join(HERE, "unikornis-pozok-felmero.html")
if os.path.exists(lp):
    t = open(lp, encoding="utf-8").read()
    m = re.search(r"<main[^>]*>([\s\S]*?)</main>", t)
    st = re.search(r"<style>([\s\S]*?)</style>", t)
    if m:
        css = ("<style>" + re.sub(r"(^|\})\s*([^{}@]+)\{", lambda x: x.group(1) + "\n" + ",".join("#fm .fm-lap " + s.strip() for s in x.group(2).split(",")) + "{", st.group(1)) + "</style>") if st else ""
        lap = css + "<main>" + m.group(1) + "</main>"
import json
h = h.replace("</body>", "<script>window.__FM_LAP=" + json.dumps(lap).replace("</", "<\\/") + ";</script>" + PAD + "</body>")
open(DST, "w", encoding="utf-8", newline="\n").write(h)
print("kész:", DST, len(h), "bájt")

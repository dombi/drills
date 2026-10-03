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
</style>
<script>
(function () {
  var OLTOZET = { fej: "fej-k", nyak: "nyak-k", hat: "hat-k", lab: "lab-a", oldal: "oldal-k", farok: "farok-a", van: {} };
  var POZ_ANIM = /^(kert-lab|kert-bob|trukk-|kert-eszik|kert-szagol|kert-alszik|tk-porges|eszik|szagol)/;
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
    ["jar", 0, 1, "Séta – 1. fázis", "A 4 láb egy darabban leng (±12°).", "gyanu"],
    ["jar", 0.5, 1, "Séta – 2. fázis", "Figyeld a lábdíszt: helyben marad, a láb kileng alóla.", "hiba"],
    ["jar", 0.25, -1, "Séta balra (helyesen)", "Pörgés ELŐTT így megy balra.", "ok"],
    ["ules-all", 0, 1, "Ül", "A láb fele olyan hosszú lesz (összenyomás) — a lábdísz lent marad a fűben.", "hiba"],
    ["fekszik-all", 0, 1, "Fekszik (ágy nélkül)", "Láb 30%-ra nyomva + az egész figura 13°-ot billen.", "hiba"],
    ["eszik", 0.4, 1, "Eszik", "Fejlehajtás csak a teljes rajz billentésével.", "gyanu"],
    ["szagol", 0.4, 1, "Szagol", "", "gyanu"],
    ["trukk-ugras", 0.2, 1, "Ugrás – guggol", "", ""],
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
    h += '<h2>2. Kert — pörgés (4 nézet) és a hátrafelé menés</h2><div class="fm-sor" id="fm-porges"><figure><div class="fm-szin" id="fm-porges-gyujto">' + '</div><figcaption>pörgés készül…</figcaption></figure></div>';
    h += '<h2>3. Felhőkert — ugyanaz a pörgés, másik kóddal</h2><div class="fm-sor" id="fm-tk">' +
      kartya(tkUni(uid(), ""), "Áll", "Ugyanaz a rajz, mint a kertben.", "ok") +
      kartya(tkUni(uid(), "jar"), "Séta", "Ugyanaz a lábmozgás — de külön kód másolata.", "gyanu") +
      kartya(tkUni(uid(), "g-porges"), "Pörgés — 1/8", "Nem fordul, hanem vízszintesen összenyomódik.", "hiba") +
      kartya(tkUni(uid(), "g-porges"), "Pörgés — 1/16", "", "hiba") +
      kartya(tkUni(uid(), "g-porges"), "Pörgés — 1/4", "Tükörkép: ez a „hátulnézet” helyett.", "hiba") +
      '</div>';
    h += '<h2>4. Odú és a többi helyszín</h2><div class="fm-sor" id="fm-tobbi">' +
      '<figure class="fm-odu gyanu"><div class="fm-szin" id="odu-szoba">' + UC.oduSVG() + '</div><figcaption><b>Odú — séta közben</b>Harmadik külön séta-kód (oduUniSetal). Az ágyba nem lehet belefeküdni.<br><span class="cimke gyanu">FURCSA</span></figcaption></figure>' +
      kartya('<div class="fm-szin"><svg viewBox="-80 -110 160 130" width="230" height="200">' + UC.unikornisSVG(uid(), lenyC(), 0.62, UC.mentes.profilok[UC.mentes.leny].oltozet) + '</svg></div>',
        "Pályán (ösvényen)", "Nincs séta: a figura merev, kis pattogással „csúszik” állomásról állomásra. Nem fordul, a lába nem mozog.", "hiba") +
      '</div>';
    var fm = document.getElementById("fm");
    fm.innerHTML = h + '<div class="fm-lap">' + (window.__FM_LAP || "") + '</div>';
    fm.querySelectorAll(".fm-lenyek button").forEach(function (b) {
      b.onclick = function () { UC.mentes.leny = b.getAttribute("data-l"); rajzol(); };
    });
    /* fázisok beállítása */
    var kartyak = fm.querySelectorAll("#fm-kert figure");
    KERT_POZOK.forEach(function (p, i) { fagyaszt(kartyak[i], p[1]); });
    var tk = fm.querySelectorAll("#fm-tk figure");
    [0, 0, 0.0625, 0.03, 0.25].forEach(function (f, i) { fagyaszt(tk[i], i === 1 ? 0.5 : f); });
    var odu = fm.querySelector("#odu-szoba #odu-uni-mozgo");
    if (odu) odu.classList.add("jar");
    fagyaszt(fm.querySelector("#fm-tobbi"), 0.5);
    porgesFelvesz();
  }
  /* a VALÓDI kerti pörgés-függvényt futtatjuk egy rejtett figurán, és lefényképezzük a 4 nézetét */
  function porgesFelvesz() {
    var gy = document.getElementById("fm-porges-gyujto");
    gy.innerHTML = kertUni("kert-uni", "", 1).replace(/^<div id="kert-szinter" class="fm-szin">|<\/div>$/g, "");
    var doboz = gy.querySelector(".kert-uni-doboz"), svg = doboz.querySelector(".kert-uni-svg"), flip = doboz.querySelector(".kert-uni-flip");
    var keretek = [];
    var mo = new MutationObserver(function () { keretek.push({ html: svg.innerHTML, dir: flip.style.getPropertyValue("--dir") }); });
    mo.observe(svg, { childList: true });
    UC.kertPorgesForgas(doboz, 800, function () {
      mo.disconnect();
      var nev = ["Pörgés — oldalról", "Pörgés — szemből", "Pörgés — balról", "Pörgés — hátulról"];
      var megj = ["", "Színek, pata és festék a közös színtáblából (1a). A díszek még hiányoznak → 1b.", "", "Színek, pata és festék a közös színtáblából (1a). A díszek még hiányoznak → 1b."];
      var all = ["ok", "gyanu", "ok", "gyanu"];
      var out = "";
      for (var i = 0; i < 4 && i < keretek.length; i++) {
        out += kartya('<div id="kert-szinter" class="fm-szin"><div class="kert-uni-doboz" style="--dir:1"><div class="kert-uni-flip" style="--dir:' + (keretek[i].dir || 1) + '">' +
          '<svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' + keretek[i].html + '</svg></div></div></div>', nev[i], megj[i], all[i]);
      }
      /* ugyanez a figura a pörgés UTÁN, balra indítva — a cimkét MÉRJÜK: marad-e irány a belső rétegen (D1 javította) */
      doboz.style.setProperty("--dir", -1); doboz.classList.add("jar");
      var ragad = !!flip.style.getPropertyValue("--dir");
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

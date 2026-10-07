/* ============ 3d) 🌿 MI BÚJT EL? — a bújócska-pályák generátora (terv/mi-bujt-el-terv.html) ============
   2. kör (2026-10-07): a közös alap (GEN.hianyzo + a feladat-alak, a feladatHianyzo az engine-gen.js-ben).
   3. kör (2026-10-07): élesben — 🍃 Bújócska-rét + 🌙 Holdfény-bújócska (constants.js), a bújó Cincin a kártyán
     (bujHTML / bujJo / bujRossz + 5 mp-es kukucs, terv/mi-bujt-el-rajzterv.html: levél az Összeadó, felhő a Holdfény
     pályán), a pálya legelső feladata előtt „Cincin elbújt!”, és a becsempészés „mi bújt el” formában (hianyzoKeretben,
     a teny.js tenyKeretben-je hívja, ha az állomás tipusa "hianyzo").
   4. kör (2026-10-07): 🍂 Százas bújócska + pult 🌿 jel + Bújócska-bajnok jelvény.
   5. kör (2026-10-07): a 🌸 Neked szóló ösvény is kérdez így (hiNekedJelol / hiNekedForma, a fájl végén).

   Az állomás beállítása: { tipus: "hianyzo", formak: [...], max, min, b_min, b_max, atlepes, elobb_nem, hol, tablak, muvelet, takaro }
     formak     amiből az állomás sorsol (feladatonként egyet):
                tizesbarat   7 + ? = 10 · ? + 4 = 10
                tag          12 + ? = 17 · ? + 6 = 14   (hiányzó tag; a 100-as körben is: 45 + ? = 52)
                kivonando    13 − ? = 8 · 100 − ? = 64
                kisebbitendo ? − 5 = 8                   (a legnehezebb: csak az Odú-küszöbön)
                kerekszaz    30 + ? = 100
                kerektizes   37 + ? = 40
                szazasbarat  37 + ? = 100 · 100 − ? = 64
                tenyezo      6 × ? = 42 · ? × 7 = 42
                oszto        42 ÷ ? = 6
                osztando     ? ÷ 6 = 7
     max / min  a legnagyobb szám (összeg, kisebbítendő) felső / alsó határa — alap 20 / 2
     b_min/b_max a rejtett szám határai a tag / kivonando / kisebbitendo formánál — alap 1 / max − 1
     atlepes    "nem" | "kell" | "lehet" (alap) — a tízes átlépése; elobb_nem: N → az állomás első N feladata átlépés nélkül
     hol        "a" | "b": a tag-formánál rögzített hely (alap: véletlen)
     tablak     × ÷: az ismert tábla (a 6 × ? = 42-ben a 6, a 42 ÷ ? = 6-ban az osztó) — alap 2–10
     muvelet    szazasbarat: "+" vagy "-" (alap: vegyesen)
     takaro     ami mögé Cincin bújik: "level" (alap) | "felho" */
var HI_TABLAK = [2, 3, 4, 5, 6, 7, 8, 9, 10];
function hiHol(cfg) { return cfg.hol || (Math.random() < 0.5 ? "a" : "b"); }
/* egy forma → [alapfeladat, hol], vagy null, ha a beállításba nem fér */
var HI_FORMA = {
  tizesbarat: function () { var x = veletlen(1, 9); return [feladatOsszeadas(x, 10 - x), hiHol({})]; },
  tag: function (cfg, at) {
    var max = cfg.max || 20, c = veletlen(Math.max(2, cfg.min || 2), max);
    var h = veletlen(cfg.b_min || 1, Math.min(cfg.b_max || max - 1, c - 1)), k = c - h, hol = hiHol(cfg);
    if (h < 1 || k < 1 || !atlepesOK(k, h, "+", at)) return null;
    return [hol === "b" ? feladatOsszeadas(k, h) : feladatOsszeadas(h, k), hol];
  },
  kivonando: function (cfg, at) {
    var max = cfg.max || 20, c = veletlen(Math.max(2, cfg.min || 2), max);
    var h = veletlen(cfg.b_min || 1, Math.min(cfg.b_max || max - 1, c - 1));
    if (h < 1 || c - h < 1 || !atlepesOK(c, h, "-", at)) return null;
    return [feladatKivonas(c, h), "b"];
  },
  kisebbitendo: function (cfg, at) {
    var r = HI_FORMA.kivonando(cfg, at);
    return r && [r[0], "a"];
  },
  kerekszaz: function (cfg) { var T = veletlen(1, 9) * 10; return [feladatOsszeadas(T, 100 - T), cfg.hol || "b"]; },
  kerektizes: function (cfg) {
    var a = veletlen(Math.max(11, cfg.min || 11), Math.min(99, cfg.max || 99));
    if (a % 10 === 0) return null;
    return [feladatOsszeadas(a, 10 - a % 10), "b"];
  },
  szazasbarat: function (cfg) {
    var n = veletlen(1, 8) * 10 + veletlen(1, 9), op = cfg.muvelet || (Math.random() < 0.5 ? "+" : "-");
    return [op === "+" ? feladatOsszeadas(n, 100 - n) : feladatKivonas(100, 100 - n), "b"];
  },
  tenyezo: function (cfg) {
    var N = veletlenElem(cfg.tablak || HI_TABLAK), x = veletlen(1, 10);
    if (N * x > 100) return null;
    return Math.random() < 0.5 ? [feladatSzorzas(N, x), "b"] : [feladatSzorzas(x, N), "a"];
  },
  oszto: function (cfg) {
    var d = veletlenElem(cfg.tablak || HI_TABLAK), q = veletlen(1, 10);
    return d * q > 100 ? null : [feladatOsztas(d, q), "b"];
  },
  osztando: function (cfg) {
    var d = veletlenElem(cfg.tablak || HI_TABLAK), q = veletlen(1, 10);
    return d * q > 100 ? null : [feladatOsztas(d, q), "a"];
  }
};
/* a „volt már” jel: egy tény egy szakaszban egyszer, akármelyik száma bújik el (7 + ? = 12 és ? + 5 = 12 ugyanaz) */
function hiKulcs(f) {
  var m = /^\s*(\d+)\s*([+−×÷])\s*(\d+)\s*$/.exec(f.naplo.kerdes), a = +m[1], b = +m[3];
  return "h" + m[2] + ((m[2] === "+" || m[2] === "×") ? Math.min(a, b) + "|" + Math.max(a, b) : a + "|" + b);
}
/* az átlépés-szabály most: az állomás első elobb_nem feladata átlépés nélkül */
function hiAtlepes(cfg) {
  return (cfg.elobb_nem && typeof J !== "undefined" && J && (J.feladatKesz || 0) < cfg.elobb_nem) ? "nem" : cfg.atlepes;
}
/* a pálya legelső bújós feladata előtt egyszer: „Cincin elbújt!” (tervlap: A három pálya) */
function hiBemutat(f) {
  if (typeof J !== "undefined" && J && !J.cincinVolt) { J.cincinVolt = true; f.felolvas = "Cincin elbújt! " + f.felolvas; }
  return f;
}
GEN.hianyzo = function (cfg, kerultMar) {
  var formak = (cfg.formak || ["tag"]).filter(function (x) { return HI_FORMA[x]; });
  if (!formak.length) formak = ["tag"];
  var at = hiAtlepes(cfg);
  var r = null, kulcs, tartalek = null;
  for (var i = 0; i < 300; i++) {
    r = HI_FORMA[veletlenElem(formak)](cfg, at);
    if (!r) continue;
    tartalek = tartalek || r;
    kulcs = hiKulcs(r[0]);
    if (!kerultMar[kulcs]) break;
    r = null;
  }
  r = r || tartalek || [feladatOsszeadas(7, 3), "b"];   /* (nem fordul elő) */
  kerultMar[hiKulcs(r[0])] = true;
  return hiBemutat(feladatHianyzo(r[0], r[1], cfg.takaro));
};

/* ── 🌸 becsempészés „mi bújt el” formában: az esedékes tény belefér-e az állomás valamelyik formájába ──
   (a teny.js tenyKeretben-je hívja, ha az állomás tipusa "hianyzo"). A keret ugyanaz, mint a sorsolásnál: a
   Csillagszem csak a 2-es, 5-ös, 10-es tábla tényét kérheti, a Lombsátor csak a 20-as kör pótlását stb.
   Csak a 20-as kör és a szorzótábla tényei (o, k, s, d); a 100-as kör típusai nem csempészhetők. */
var HI_KERET = {
  tizesbarat: function (op, x, y) {
    if (op !== "o" || x + y !== 10) return [];
    return [[feladatOsszeadas(x, y), "a"], [feladatOsszeadas(x, y), "b"], [feladatOsszeadas(y, x), "a"], [feladatOsszeadas(y, x), "b"]];
  },
  tag: function (op, x, y, cfg, at) {
    if (op !== "o") return [];
    var max = cfg.max || 20, c = x + y, ki = [];
    if (c < Math.max(2, cfg.min || 2) || c > max) return [];
    [[x, y], [y, x]].forEach(function (p) {
      ["a", "b"].forEach(function (hol) {
        var h = hol === "b" ? p[1] : p[0], k = hol === "b" ? p[0] : p[1];
        if (cfg.hol && cfg.hol !== hol) return;
        if (h < (cfg.b_min || 1) || h > Math.min(cfg.b_max || max - 1, c - 1) || !atlepesOK(k, h, "+", at)) return;
        ki.push([feladatOsszeadas(p[0], p[1]), hol]);
      });
    });
    return ki;
  },
  kivonando: function (op, x, y, cfg, at) {
    var max = cfg.max || 20;
    if (op !== "k" || x < Math.max(2, cfg.min || 2) || x > max) return [];
    if (y < (cfg.b_min || 1) || y > Math.min(cfg.b_max || max - 1, x - 1) || !atlepesOK(x, y, "-", at)) return [];
    return [[feladatKivonas(x, y), "b"]];
  },
  kisebbitendo: function (op, x, y, cfg, at) {
    return HI_KERET.kivonando(op, x, y, cfg, at).map(function (r) { return [r[0], "a"]; });
  },
  tenyezo: function (op, x, y, cfg) {
    if (op !== "s") return [];
    var T = cfg.tablak || HI_TABLAK, ki = [];
    if (T.indexOf(x) >= 0) ki.push([feladatSzorzas(x, y), "b"], [feladatSzorzas(y, x), "a"]);
    if (x !== y && T.indexOf(y) >= 0) ki.push([feladatSzorzas(y, x), "b"], [feladatSzorzas(x, y), "a"]);
    return ki;
  },
  oszto: function (op, x, y, cfg) {
    return op === "d" && (cfg.tablak || HI_TABLAK).indexOf(y) >= 0 ? [[feladatOsztas(y, x / y), "b"]] : [];
  },
  osztando: function (op, x, y, cfg) {
    return op === "d" && (cfg.tablak || HI_TABLAK).indexOf(y) >= 0 ? [[feladatOsztas(y, x / y), "a"]] : [];
  }
};
function hianyzoKeretben(k, cfg, kerult) {
  var m = /^([okds])(\d+)_(\d+)$/.exec(k || "");
  if (!m) return null;
  var at = hiAtlepes(cfg), jelolt = [];
  (cfg.formak || ["tag"]).forEach(function (fo) {
    if (HI_KERET[fo]) jelolt = jelolt.concat(HI_KERET[fo](m[1], +m[2], +m[3], cfg, at));
  });
  jelolt = jelolt.filter(function (r) { return !kerult[hiKulcs(r[0])]; });
  if (!jelolt.length) return null;
  var r = veletlenElem(jelolt);
  kerult[hiKulcs(r[0])] = true;
  return hiBemutat(feladatHianyzo(r[0], r[1], cfg.takaro));
}

/* ══ 🐭 A BÚJÓ CINCIN a kártyán (terv/mi-bujt-el-rajzterv.html, jóváhagyva 2026-10-07) ══
   bujHTML(szam, takaro) a kérdőjel helye: Cincin a takaró (levél / felhő) mögött, a szám-tábla, a szálló darabkák
   és a kis fej, ami a végén integet. Az állapotokat osztály adja (style.css „🐭 MI BÚJT EL?” blokk):
     kukucs  kb. 5 mp-enként magától kikukucskál (lent, egy közös időzítő)
     rossz   gondolkodó arccal kinéz, megrázza a fejét, visszabújik (bujRossz)
     nyit    a takaró el, Cincin előugrik, maga előtt tartja a számot (bujJo)
     kesz    a szám a helyén, Cincin lebukik, a kis feje a sarokból integet a következő feladatig
   Az arcot a közös figArc is cseréli (jó → ujjong, rossz → gondol); a takaró pontosan akkora, mint a szám. */
var BUJ_TAKARO = {
  level: '<svg viewBox="0 0 100 80" preserveAspectRatio="none"><path d="M6,74 C0,34 36,4 94,6 C99,46 64,82 6,74 Z" fill="#9ed686" stroke="#4f8f42" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M10,70 Q48,44 90,10" fill="none" stroke="#4f8f42" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M34,54 Q30,40 34,28 M52,42 Q50,30 56,18 M44,48 Q58,52 70,46 M62,36 Q74,38 84,30" fill="none" stroke="#6fae5c" stroke-width="2" stroke-linecap="round"/>' +
    '<ellipse cx="30" cy="40" rx="7" ry="4" fill="#fff" opacity=".35" transform="rotate(-30 30 40)"/></svg>',
  felho: '<svg viewBox="0 0 100 80" preserveAspectRatio="none"><path d="M14,77 C1,77 1,52 18,50 C15,29 40,15 54,26 C62,9 93,18 86,42 C100,45 99,77 84,77 Z" fill="#ffffff" stroke="#c9b8e8" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M18,50 Q26,46 32,52 M54,26 Q60,30 60,38 M86,42 Q80,44 78,50" fill="none" stroke="#c9b8e8" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M14,70 Q50,76 86,70" fill="none" stroke="#ece4f8" stroke-width="5" stroke-linecap="round"/><ellipse cx="40" cy="40" rx="9" ry="5" fill="#f6f1fc"/></svg>'
};
var BUJ_RESZ = {   /* szálló darabkák: levél → harmatcseppek · felhő → pamacsok */
  level: ['<svg viewBox="0 0 10 10"><path d="M5,0 C8,4 9,7 5,10 C1,7 2,4 5,0 Z" fill="#bfe8ff" stroke="#6fb8e0" stroke-width="1"/></svg>', 2],
  felho: ['<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.2" fill="#fff" stroke="#c9b8e8" stroke-width="1"/></svg>', 5]
};
var BUJ_IRANY = [["-.9em", "-.7em", "-120deg"], [".95em", "-.6em", "140deg"], ["-.6em", "-1.2em", "60deg"], [".7em", "-1.25em", "-80deg"], ["0em", "-1.5em", "30deg"]];
function bujHTML(szam, takaro) {
  takaro = BUJ_TAKARO[takaro] ? takaro : "level";
  var r = BUJ_RESZ[takaro], s = '<span class="buj buj-' + takaro + '" style="--n:' + String(szam).length + '">' +
    '<span class="buj-ablak"><span class="buj-cin">' + figuraSVG("cincin", "vidam", "alak") + '</span></span>' +
    '<span class="buj-tabla">' + szam + '</span>' +
    '<span class="buj-takaro">' + BUJ_TAKARO[takaro] + '</span>';
  for (var i = 0; i < r[1]; i++) s += '<span class="buj-resz" style="--dx:' + BUJ_IRANY[i][0] + ';--dy:' + BUJ_IRANY[i][1] + ';--r:' + BUJ_IRANY[i][2] + '">' + r[0] + '</span>';
  return s + '<span class="buj-fej">' + figuraSVG("cincin", "ujjong", "fej") + '</span></span>';
}
function bujMost() { return document.querySelector("#buborek-feladat .buj"); }
var bujIdoz = null;
function bujJo() {
  var b = bujMost(); if (!b || b.classList.contains("kesz")) return;
  b.classList.remove("kukucs", "rossz"); b.classList.add("nyit");
  clearTimeout(bujIdoz);
  bujIdoz = setTimeout(function () { b.classList.add("kesz"); }, 900);
}
function bujRossz() {
  var b = bujMost(); if (!b || b.classList.contains("nyit")) return;
  b.classList.remove("kukucs", "rossz"); void b.offsetWidth;
  b.classList.add("rossz");
  clearTimeout(bujIdoz);
  bujIdoz = setTimeout(function () {
    b.classList.remove("rossz");
    var c = b.querySelector(".buj-cin"); if (c) c.innerHTML = figuraSVG("cincin", "vidam", "alak");
  }, 1500);
}
/* magától kikukucskál kb. 5 mp-enként, amíg a kártya a képernyőn van (a gyerekek kinevetik, ami mozdulatlan) */
setInterval(function () {
  var b = bujMost();
  if (!b || !b.offsetParent || /nyit|kesz|rossz|kukucs/.test(b.className)) return;
  b.classList.add("kukucs");
  setTimeout(function () { b.classList.remove("kukucs"); }, 1100);
}, 5200);

/* ══ 🌸 A NEKED SZÓLÓ ÖSVÉNY „mi bújt el” formában (5. kör, 2026-10-07; tervlap: „A Neked szóló ösvény is kérdezhet így”) ══
   A kör összerakásakor (teny.js tenyKorEpit) kb. minden ötödik feladat (20-ból 4) „mi bújt el” jelet kap (x.h), a
   tenyGen pedig így kérdezi (hiNekedForma). Szabályok:
     • csak abban a családban, amelyikben a gyerek már végigjárt egy bújócska-pályát, hogy ne érje váratlanul:
         + − a 20-as körben  ← 🍃 Bújócska-rét vagy 🍂 Százas bújócska · a 100-as kör típusai ← 🍂 Százas bújócska
         × ÷                 ← 🌙 Holdfény-bújócska
     • új tény soha (először rendes formában ismerje meg), és a kör legelső feladata sem (jó kezdés);
     • előnyben a fordítva már jól menő, de így még nem kérdezett tények (magas doboz, nincs / kevés hh);
     • két bújós feladat nem jön egymás után; a botlás után visszajövő tény ugyanabban a formában jön vissza;
     • a kivonásnál és az osztásnál a második szám bújik (13 − ? = 8, 42 ÷ ? = 6) — a ? − 5 = 8 és a ? ÷ 6 = 7
       a pályákon is csak a küszöbön / később jön. */
var HI_NEKED_ARANY = 5;   /* kb. minden ötödik */
function hiNekedNyitva() {
  var pk = (typeof P === "function" && P() && P().palyak) || {};
  function kesz(id) { return !!(pk[id] && pk[id].kesz); }
  var kor = kesz("szazas-bujocska");
  return { ok: kesz("bujocska-ret") || kor, kor: kor, sd: kesz("holdfeny-bujocska") };
}
function hiNekedCsalad(k) {
  var c = k.charAt(0);
  if (/^[okds]\d/.test(k)) return (c === "o" || c === "k") ? "ok" : "sd";
  return "kor";   /* a 100-as kör típusai (t10, e1a, sb …) */
}
function hiNekedJelol(sor) {
  var ny = hiNekedNyitva();
  if (!ny.ok && !ny.kor && !ny.sd) return;
  var db = Math.round(sor.length / HI_NEKED_ARANY), jelolt = [];
  sor.forEach(function (x, i) {
    if (i === 0 || x.f === "uj" || !ny[hiNekedCsalad(x.k)]) return;
    var s = tenySorBarmi(x.k) || {}, hh = s.hh || "", jo = (hh.match(/[VJS]/g) || []).length;
    jelolt.push({ i: i, k: x.k, p: (s.d || 0) + (hh ? 0 : 3) - jo * 0.5 + Math.random() });
  });
  jelolt.sort(function (a, b) { return b.p - a.p; });
  var volt = {}, n = 0;
  [true, false].forEach(function (egyszer) {   /* előbb különböző tények, aztán ha kell, ismétlés is */
    jelolt.forEach(function (j) {
      if (n >= db || sor[j.i].h || (egyszer && volt[j.k])) return;
      if ((sor[j.i - 1] && sor[j.i - 1].h) || (sor[j.i + 1] && sor[j.i + 1].h)) return;
      sor[j.i].h = true; volt[j.k] = 1; n++;
    });
  });
}
function hiNekedForma(f) {
  var m = /^\s*(\d+)\s*([+−×÷])\s*(\d+)\s*$/.exec(String(f.naplo && f.naplo.kerdes));
  if (!m) return f;
  var op = m[2], hol = (op === "+" || op === "×") ? (Math.random() < 0.5 ? "a" : "b") : "b";
  return hiBemutat(feladatHianyzo(f, hol, (op === "×" || op === "÷") ? "felho" : "level"));
}

/* ============ 3d) 🌿 MI BÚJT EL? — a bújócska-pályák generátora (terv/mi-bujt-el-terv.html) ============
   2. kör (2026-10-07): a közös alap LÁTHATATLANUL. Még egy pálya sem használja; a gyereknek semmi nem változik.
   A feladat-alak (kártya, felolvasás, tipp, napló) a feladatHianyzo-ban van (engine-gen.js), itt csak az dől el,
   melyik tény jöjjön és melyik száma bújjon el. A 3. körben ide jön a bújó lény (Cincin a levél / felhő mögött).

   Az állomás beállítása: { tipus: "hianyzo", formak: [...], max, min, b_min, b_max, atlepes, elobb_nem, hol, tablak, muvelet }
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
     muvelet    szazasbarat: "+" vagy "-" (alap: vegyesen) */
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
GEN.hianyzo = function (cfg, kerultMar) {
  var formak = (cfg.formak || ["tag"]).filter(function (x) { return HI_FORMA[x]; });
  if (!formak.length) formak = ["tag"];
  var at = cfg.atlepes;
  if (cfg.elobb_nem && typeof J !== "undefined" && J && (J.feladatKesz || 0) < cfg.elobb_nem) at = "nem";
  var r = null, kulcs, tartalek = null;
  for (var i = 0; i < 300; i++) {
    r = HI_FORMA[veletlenElem(formak)](cfg, at);
    if (!r) continue;
    tartalek = tartalek || r;
    kulcs = "h" + r[0].naplo.kerdes + r[1];
    if (!kerultMar[kulcs]) break;
    r = null;
  }
  r = r || tartalek || [feladatOsszeadas(7, 3), "b"];   /* (nem fordul elő) */
  kerultMar["h" + r[0].naplo.kerdes + r[1]] = true;
  return feladatHianyzo(r[0], r[1]);
};

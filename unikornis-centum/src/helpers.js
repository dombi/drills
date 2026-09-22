/* ============ 2) SEGÉDEK ============ */
function $(id) { return document.getElementById(id); }
function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function veletlen(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

var EGYES = ["nulla", "egy", "kettő", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"];
var TIZES = { 10: "tíz", 20: "húsz", 30: "harminc", 40: "negyven", 50: "ötven", 60: "hatvan", 70: "hetven", 80: "nyolcvan", 90: "kilencven" };
var TIZ_ELOTAG = { 10: "tizen", 20: "huszon", 30: "harminc", 40: "negyven", 50: "ötven", 60: "hatvan", 70: "hetven", 80: "nyolcvan", 90: "kilencven" };
function szo(n) {
  n = Math.round(n);
  if (n === 100) return "száz";
  if (n < 10) return EGYES[n];
  if (n === 10) return "tíz";
  var t = Math.floor(n / 10) * 10, e = n % 10;
  if (e === 0) return TIZES[t];
  return TIZ_ELOTAG[t] + EGYES[e];
}
var SZOTAR = (function () {
  var m = {}; for (var i = 0; i <= 100; i++) m[szo(i)] = i;
  m["ketto"] = 2; m["harom"] = 3; m["negy"] = 4; m["ot"] = 5; m["het"] = 7; m["ket"] = 2;
  return m;
})();
var TIZES_SZO = { "tiz": 10, "tíz": 10, "husz": 20, "húsz": 20, "harminc": 30, "negyven": 40, "otven": 50, "ötven": 50, "hatvan": 60, "hetven": 70, "nyolcvan": 80, "kilencven": 90 };
var EGYES_SZO = { "nulla": 0, "egy": 1, "ketto": 2, "kettő": 2, "ket": 2, "harom": 3, "három": 3, "negy": 4, "négy": 4, "ot": 5, "öt": 5, "hat": 6, "het": 7, "hét": 7, "nyolc": 8, "kilenc": 9 };
function tokenek(szoveg) { return String(szoveg).toLowerCase().replace(/[^a-zá-ű0-9\s]/gi, " ").split(/\s+/).filter(Boolean); }
function szamokKinyer(szoveg) {
  var tk = tokenek(szoveg), out = [], i;
  for (i = 0; i < tk.length; i++) {
    var w = tk[i];
    if (/^\d+$/.test(w)) { var v = parseInt(w, 10); if (v >= 0 && v <= 100) out.push(v); continue; }
    if (TIZES_SZO[w] != null) {
      // "húsz egy" → 21 összevonás CSAK 20-tól: a "tíz egy" nem 11, hanem két külön
      // szám (a bontás felmondásában gyakori: "…tíz, egy meg kilenc…").
      var nx = tk[i + 1];
      if (TIZES_SZO[w] >= 20 && nx && EGYES_SZO[nx] != null && EGYES_SZO[nx] > 0) { out.push(TIZES_SZO[w] + EGYES_SZO[nx]); i++; }
      else out.push(TIZES_SZO[w]);
      continue;
    }
    if (SZOTAR[w] != null) { out.push(SZOTAR[w]); continue; }
    if (EGYES_SZO[w] != null) out.push(EGYES_SZO[w]);
  }
  return out;
}
function elsoSzam(szoveg) { var a = szamokKinyer(szoveg); return a.length ? a[0] : null; }
function atlepesE(a, b, op) { if (op === "+") return (a % 10) + (b % 10) >= 10; return (a % 10) - (b % 10) < 0; }
function atlepesOK(a, b, op, mode) { if (!mode || mode === "lehet") return true; var e = atlepesE(a, b, op); return mode === "kell" ? e : !e; }


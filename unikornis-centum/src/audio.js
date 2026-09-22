/* ============ 5) HANG ============ */
var AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
function beep(freq, hossz, tipus, kesl, vol) {
  if (!mentes.hang) return;
  var c = ac(); if (!c) return;
  var o = c.createOscillator(), g = c.createGain();
  o.type = tipus || "sine"; o.frequency.value = freq;
  var t0 = c.currentTime + (kesl || 0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.22, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + hossz);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + hossz + 0.03);
}
function hangJo() { beep(660, 0.13, "sine", 0); beep(880, 0.13, "sine", 0.1); beep(1174, 0.2, "sine", 0.2); }
function hangCsilla() { beep(1600, 0.09, "triangle", 0, 0.16); beep(2100, 0.09, "triangle", 0.07, 0.12); }
function hangHiba() { beep(200, 0.14, "sine", 0, 0.14); }
function hangAllomas() { beep(523, 0.12, "triangle", 0); beep(659, 0.12, "triangle", 0.11); beep(784, 0.12, "triangle", 0.22); beep(1046, 0.26, "triangle", 0.33); }
function hangVege() { [523, 587, 659, 784, 880, 1046, 1318].forEach(function (f, i) { beep(f, 0.16, "triangle", i * 0.11, 0.18); }); }
function hangGomb() { beep(420, 0.05, "sine", 0, 0.06); }

/* ── KERTI HANGKLIPEK (terv/kert-hang-kor-terv.md, 2026-09-19). CC0 minták base64-ben a
   kert-hangok.js-ben (KERT_HANGOK). Első kertbe lépésnél dekódoljuk (kertNyit → kertHangokBetolt,
   ekkor az AudioContext már fel van oldva a koppintással). Ha a fájl hiányzik vagy a dekódolás
   elbukik, csend marad — a játék nem áll meg. */
var KERT_BUF = {};                 /* dekódolt AudioBuffer-ek: lepes, nyih0, nyih1, … */
var KERT_BUF_INDULT = false;
var KERT_LEPES_RATE = 1.35;        /* a felvétel ~1 lépés/mp; kicsit gyorsítva könnyedebb, jobban tapad a .44s-os lábmozgáshoz */
var KERT_LEPES_VOL = 0.45;         /* halk háttér-ropogás (a beep-ek ~0.22-es szinusza alá) */
var KERT_NYIH_VOL = 0.4;           /* halk, kedves — producer 2026-09-19: a 0.9 túl hangos volt */
var KERT_NYIH_RATE = 1.18;         /* kicsit magasabbra hangolva → kisebb, rajzfilmesebb állat */
var KERT_NYIH_HP = 260, KERT_NYIH_LP = 2600;   /* Hz: a mély mellkasi moraj ki, a fényes él le → tompított, puha hang */
var KERT_NYIH_LEHUL = 2500;        /* ms — bökdösésre se torlódjon */
function kertHangokBetolt() {
  if (KERT_BUF_INDULT || typeof KERT_HANGOK === "undefined") return;
  var c = ac(); if (!c) return;
  KERT_BUF_INDULT = true;
  function dek(kulcs, b64) {
    try {
      var bin = atob(b64), n = bin.length, u8 = new Uint8Array(n);
      for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);
      var pr = c.decodeAudioData(u8.buffer, function (buf) { KERT_BUF[kulcs] = buf; }, function () {});
      if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
  }
  dek("lepes", KERT_HANGOK.lepes);
  (KERT_HANGOK.nyih || []).forEach(function (b, i) { dek("nyih" + i, b); });
}
function kertAudioKesz() { var c = AC; if (!c) return null; if (c.state === "suspended") { try { c.resume(); } catch (e) {} } return c; }
/* Fűropogás-loop: be=true indít (ha még nem szól), be=false leállít (fade-out). A .jar osztállyal együtt
   kapcsolják a séta-függvények. Véletlen pozícióból indul, hogy két séta ne szóljon egyformán. */
var KERT_LEPES = null;             /* {src, g} amíg szól */
function kertLepesHang(be) {
  if (be) {
    if (KERT_LEPES || !mentes.hang) return;
    var c = kertAudioKesz(); if (!c || !KERT_BUF.lepes) { kertHangokBetolt(); return; }
    var src = c.createBufferSource(), g = c.createGain();
    src.buffer = KERT_BUF.lepes; src.loop = true; src.playbackRate.value = KERT_LEPES_RATE;
    var t0 = c.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(KERT_LEPES_VOL, t0 + 0.08);
    src.connect(g); g.connect(c.destination);
    src.start(t0, Math.random() * src.buffer.duration);
    KERT_LEPES = { src: src, g: g };
  } else {
    var L = KERT_LEPES; KERT_LEPES = null;
    if (!L || !AC) return;
    var t1 = AC.currentTime;
    try {
      L.g.gain.cancelScheduledValues(t1);
      L.g.gain.setValueAtTime(Math.max(0.0001, L.g.gain.value), t1);
      L.g.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.15);
      L.src.stop(t1 + 0.18);
    } catch (e) {}
  }
}
/* Nyihogás: a klipek közül váltogat (soha nem ugyanaz kétszer egymás után), lehűlési idővel. */
var KERT_NYIH_UTOLSO = 0, KERT_NYIH_IDX = -1;
function kertNyihog() {
  if (!mentes.hang) return;
  var most = performance.now();
  if (most - KERT_NYIH_UTOLSO < KERT_NYIH_LEHUL) return;
  var c = kertAudioKesz(); if (!c) { kertHangokBetolt(); return; }
  var db = 0; while (KERT_BUF["nyih" + db]) db++;
  if (!db) { kertHangokBetolt(); return; }
  var i = db > 1 ? (KERT_NYIH_IDX + 1 + Math.floor(Math.random() * (db - 1))) % db : 0;
  KERT_NYIH_IDX = i; KERT_NYIH_UTOLSO = most;
  var src = c.createBufferSource(), g = c.createGain();
  var hp = c.createBiquadFilter(), lp = c.createBiquadFilter();
  hp.type = "highpass"; hp.frequency.value = KERT_NYIH_HP;
  lp.type = "lowpass"; lp.frequency.value = KERT_NYIH_LP; lp.Q.value = 0.5;
  src.buffer = KERT_BUF["nyih" + i]; src.playbackRate.value = KERT_NYIH_RATE;
  var t0 = c.currentTime;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(KERT_NYIH_VOL, t0 + 0.06);   /* lágy indítás, ne „csattanjon" */
  src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(c.destination); src.start(t0);
}

var huHang = null;
function hangokBetolt() { try { var vs = speechSynthesis.getVoices(); huHang = vs.filter(function (v) { return /hu(-|_)?/i.test(v.lang); })[0] || null; } catch (e) {} }
if (window.speechSynthesis) { hangokBetolt(); speechSynthesis.onvoiceschanged = hangokBetolt; }
function mondd(szoveg, kesz) {
  bagolyAnimal(true);
  var lefutott = false, orzo = null, fig = null;
  function befejez() {
    if (lefutott) return;
    lefutott = true;
    if (orzo) clearTimeout(orzo);
    if (fig) clearInterval(fig);
    bagolyAnimal(false);
    if (kesz) kesz();
  }
  if (!window.speechSynthesis || !mentes.hang) { setTimeout(befejez, 350); return; }
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(szoveg);
    u.lang = "hu-HU"; u.rate = 0.95; u.pitch = 1.0;
    if (huHang) u.voice = huHang;
    u.onend = befejez;
    u.onerror = befejez;
    speechSynthesis.speak(u);
    /* A Chrome sokszor nem süti el az onend-et (főleg cancel() után, vagy háttérfülnél),
       ilyenkor a callback nélkül a játék végleg megállna. Ezért magát a speechSynthesis-t
       figyeljük: ha elindult a beszéd, megvárjuk míg elhallgat; ha ~1,5 mp alatt el sem
       indult (a bug egyik formája), továbblépünk; és van egy 12 mp-es végső határ is. */
    var kezdet = Date.now(), beszeltMar = false;
    fig = setInterval(function () {
      var telt = Date.now() - kezdet;
      if (speechSynthesis.speaking) beszeltMar = true;
      var elhallgatott = beszeltMar && !speechSynthesis.speaking && !speechSynthesis.pending;
      var elSemIndult = !beszeltMar && telt > 1500;
      if (elhallgatott || elSemIndult || telt > 12000) befejez();
    }, 200);
  } catch (e) { befejez(); }
}
function bagolyAnimal(be) { var b = document.querySelector(".bagoly-figura"); if (b) b.classList.toggle("beszel", be); }


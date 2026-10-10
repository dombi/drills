import os, re
SRC = r"C:\Users\Dombi-NyárádiGabriel\drills\unikornis-centum"
DST = os.path.join(SRC, "_teszt_uc.html")
html = open(os.path.join(SRC, "index.html"), encoding="utf-8").read()
css = open(os.path.join(SRC, "style.css"), encoding="utf-8").read()
js = open(os.path.join(SRC, "game.js"), encoding="utf-8").read()
PRELUDE = r"""<script>
window.__UC_GYORS = /gyors/.test(location.search);
window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
function FakeSR(){ this.lang="hu-HU"; this.continuous=false; this.interimResults=false; }
FakeSR.prototype.start=function(){ window.__activeSR=this; if(this.onstart) this.onstart(); };
FakeSR.prototype.stop=function(){ if(this.onend) this.onend(); };
FakeSR.prototype.abort=function(){ if(this.onend) this.onend(); };
window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
window.__say=function(t){ var r=window.__activeSR; if(!r) return; var it=[{transcript:t,confidence:0.95}]; it.isFinal=true; r.onresult&&r.onresult({resultIndex:0,results:[it]}); };
try {
  var ss = window.speechSynthesis;
  ss.speak = function (u) { window.__utolsoMondat = (window.__mondatok = window.__mondatok || []).push(u.text) && u.text; setTimeout(function(){ if(u.onstart) u.onstart(); if(u.onend) u.onend(); }, 5); };
  ss.cancel = function(){}; 
  ss.getVoices = function(){ return [{ lang:"hu-HU", name:"Szabolcs", voiceURI:"hu" }]; };
} catch(e) {}
</script>"""
# a próbacsapatnak: amit a játék kimondana (mondd), az a window.__mondatok-ba is bekerül — akkor is,
# ha a hang ki van kapcsolva (UC.mentes.hang = false), mert ilyenkor a speechSynthesis meg sem hívódik
POSTLUDE = r"""<script>
(function () {
  if (typeof mondd !== "function") return;
  var eredeti = mondd;
  window.__mondatok = window.__mondatok || [];
  mondd = function (szoveg) { try { window.__mondatok.push(String(szoveg)); } catch (e) {} return eredeti.apply(this, arguments); };
})();
</script>"""
html = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*"\s*/?>', lambda m: "<style>" + css + "</style>", html)
html = re.sub(r'<script src="game\.js[^"]*"></script>', lambda m: PRELUDE + "<script>" + js + "</script>" + POSTLUDE, html)
open(DST, "w", encoding="utf-8", newline="\n").write(html)
print("ok", len(html))

/* ============ 6) SVG ============ */
var KOR = "#3a2f2a"; // körvonal
function csillagSVG(x, y, r, fill) {
  var p = [];
  for (var i = 0; i < 10; i++) {
    var ang = Math.PI / 5 * i - Math.PI / 2;
    var rr = i % 2 ? r * 0.42 : r;
    p.push((x + Math.cos(ang) * rr).toFixed(1) + "," + (y + Math.sin(ang) * rr).toFixed(1));
  }
  return '<path d="M' + p.join(" L") + ' Z" fill="' + fill + '"/>';
}
/* A három lény kész rajza (Matekos: unikornis-korall/kek/rozsa.svg — a gyerekek
   rajza alapján). Eredeti keret: 0..380 × 0..300, a talp ~y288, a vízszintes
   közép ~x190. A közös motor-koordinátába illesztve: scale(0.5) translate(-190,-272)
   → talp ~y8, közép ~x0, kb. 135 magas (mint a régi figura). */
var UNI_KORALL = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#f2662b" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#d83b22" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffb43a" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffb43a" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#f2662b" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#d83b22" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#f8c6a1" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#f2a877" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#f8c6a1" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#f2662b" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#f2662b" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#f2662b" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#d83b22" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#d83b22" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#f2662b" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#d83b22" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffb43a" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#f2a877" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#3a2a20" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#f2662b" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#d83b22" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffb43a" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#f2a877" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#f28a2e" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#c9531a" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#c9531a" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#c9531a" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#c9531a" stroke-width="3"/> <g stroke="none"> <ellipse cx="120" cy="166" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="133" cy="174" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="128" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="112" cy="189" rx="6" ry="8" fill="#d63a3a"/> <ellipse cx="107" cy="174" rx="6" ry="8" fill="#d63a3a"/> <circle cx="120" cy="178" r="4.5" fill="#ffd24d"/> </g> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f2662b"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#d94fb0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffb43a"/> </g> </g>';
var UNI_KEK = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#29a3dd" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#7a3bc0" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#c98fe6" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#c98fe6" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#29a3dd" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#7a3bc0" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#ecf6fe" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#d7ebfb" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ecf6fe" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#29a3dd" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#29a3dd" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#29a3dd" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#7a3bc0" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#7a3bc0" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#29a3dd" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#7a3bc0" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#c98fe6" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#d7ebfb" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.45" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#2ea8e0" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#29a3dd" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#7a3bc0" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#c98fe6" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#d7ebfb" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#6a6fd6" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#454bb0" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#454bb0" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#454bb0" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#454bb0" stroke-width="3"/> <g stroke="#2b7fd0" stroke-width="3" stroke-linecap="round"> <path d="M120 162 V190"/> <path d="M108 169 L132 183"/> <path d="M132 169 L108 183"/> <path d="M120 167 l-5 5 M120 167 l5 5"/> <path d="M120 185 l-5 -5 M120 185 l5 -5"/> </g> <circle cx="120" cy="176" r="3" fill="#7a3bc0" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#29a3dd"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#7a3bc0"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#b06be0"/> </g> </g>';
var UNI_ROZSA = '<g stroke="#222222" stroke-linejoin="round" stroke-linecap="round"> <g class="ucg"><path d="M96 148 Q56 148 40 188 Q54 182 64 190 Q48 206 40 234 Q60 216 72 220 Q58 244 46 270 Q40 284 44 290 Q80 252 92 218 Q96 182 96 148 Z" fill="#ffcf4d" stroke="none"/> <path d="M92 156 Q64 160 52 196 Q66 190 74 198 Q62 220 54 246 Q50 264 52 274 Q78 238 86 206 Q90 180 92 156 Z" fill="#e6a92e" stroke="none"/> <path d="M94 158 Q62 176 46 224" fill="none" stroke="#ffe6a0" stroke-width="6"/> <path d="M96 176 Q70 206 54 264" fill="none" stroke="#ffe6a0" stroke-width="5"/> <path d="M92 150 Q78 172 82 214" fill="none" stroke="#ffcf4d" stroke-width="5"/> <path d="M90 190 Q66 234 58 278" fill="none" stroke="#e6a92e" stroke-width="5"/> </g><path d="M102 208 L121 208 L114 286 L92 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M135 216 L154 216 L152 288 L130 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M177 216 L197 216 L202 288 L180 288 Z" fill="#ffffff" stroke-width="4"/> <path d="M212 208 L232 208 L256 286 L232 286 Z" fill="#ffffff" stroke-width="4"/> <path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176 C268 218 232 240 168 240 C108 240 74 214 74 172 Z" fill="#fdf3f7" stroke-width="5"/> <path d="M92 198 C112 226 226 226 246 198 C236 234 104 234 92 198 Z" fill="#ffffff" stroke="none"/> <g class="ucg"><path d="M252 76 Q214 92 194 132 Q176 168 170 200 Q164 218 162 232 Q182 200 200 186 Q192 214 186 234 Q210 198 224 160 Q238 120 246 90 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 90 Q242 70 244 52 Q252 74 254 88 Z" fill="#ffcf4d" stroke="none"/> <path d="M240 96 Q236 78 234 62 Q244 82 246 96 Z" fill="#ffcf4d" stroke="none"/> <path d="M248 80 Q214 114 198 172" fill="none" stroke="#e6a92e" stroke-width="8"/> <path d="M254 86 Q226 126 210 186" fill="none" stroke="#e6a92e" stroke-width="7"/> <path d="M242 94 Q220 138 208 196" fill="none" stroke="#ffcf4d" stroke-width="6"/> <path d="M238 100 Q214 150 202 208" fill="none" stroke="#e6a92e" stroke-width="5"/> <path d="M250 82 Q224 108 208 158" fill="none" stroke="#ffe6a0" stroke-width="4"/> </g><path d="M229 120 C229 92 256 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C251 170 229 150 229 120 Z" fill="#fdf3f7" stroke="none"/> <path d="M232 117.5 C233.6 90.8 259 72 292 72 C328 72 344 96 344 122 C344 152 322 170 288 170 C280 170 273.6 169.1 267.5 167.5" fill="none" stroke-width="5"/> <ellipse cx="337" cy="133" rx="4" ry="5" fill="#222222" opacity="0.4" stroke="none"/> <g stroke="#222" stroke-linejoin="round" stroke-linecap="round"> <path d="M291 114 Q296 105 303 105 Q311 105 313 114 Q308 120 300 120 Q293 120 291 114 Z" fill="#ffffff" stroke-width="1.7"/> <circle cx="301" cy="112.5" r="5" fill="#e67ba6" stroke="none"/> <circle cx="301" cy="112.5" r="3" fill="#222" stroke="none"/> <circle cx="299" cy="110.4" r="1.6" fill="#fff" stroke="none"/> <circle cx="303" cy="115" r="0.9" fill="#fff" opacity="0.85" stroke="none"/> <path d="M289 113 Q297 103 314 110" fill="none" stroke-width="2.6"/> <path d="M290 112 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/> <path d="M293 108 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/> <path d="M297 105 q-1 -4 0 -9" fill="none" stroke-width="2.2"/> <path d="M294 117 Q301 121 310 116" fill="none" stroke-width="1.1" opacity="0.5"/> </g> <g class="ucg"><path d="M270 78 Q258 106 264 138 Q272 118 282 130 Q290 100 292 78 Q280 86 270 78 Z" fill="#ffcf4d" stroke="none"/> <path d="M272 82 Q264 108 268 136" fill="none" stroke="#e6a92e" stroke-width="6"/> <path d="M288 84 Q284 104 286 120" fill="none" stroke="#ffe6a0" stroke-width="4"/> </g><path d="M250 92 L266 92 L258 58 Z" fill="#fdf3f7" stroke-width="4"/> <path d="M268 92 L285 84 L306 24 Z" fill="#ffcf4d" stroke-width="4"/> <path d="M270 84 L285 79" stroke="#e0a52e" stroke-width="3"/> <path d="M275 68 L291 62" stroke="#e0a52e" stroke-width="3"/> <path d="M281 50 L296 44" stroke="#e0a52e" stroke-width="3"/> <path d="M287 36 L300 31" stroke="#e0a52e" stroke-width="3"/> <path d="M120 162 l3 10 l10 4 l-10 4 l-3 10 l-3 -10 l-10 -4 l10 -4 Z" fill="#f4a6c6" stroke="none"/> <path d="M136 186 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#f28ab8" stroke="none"/> <g stroke="none"> <path d="M312 42 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 Z" fill="#f4a6c6"/> <path d="M300 20 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="#f28ab8"/> <path d="M324 64 l1.6 3.6 l3.6 1.6 l-3.6 1.6 l-1.6 3.6 l-1.6 -3.6 l-3.6 -1.6 l3.6 -1.6 Z" fill="#ffd24d"/> </g> </g>';
var UNI_RAJZ = { korall: UNI_KORALL, kek: UNI_KEK, rozsa: UNI_ROZSA };

/* A közös felület: a hívók unikornisSVG(id, c, meret, oltozet)-et kérnek.
   Az `oltozet` (opcionális) a felvett ruhák: { fej, nyak, hat, lab, oldal, farok }.
   A ruhák a kész rajz saját (380×300) koordinátájában rajzolódnak. */
/* v4 „Kinézet": a sörény/farok színhármasa + a szemszín, bőrönként (spec-odu-v4-kinezet.html).
   Az 1. mindig a jelenlegi alap. A hossz-változatok KÉSŐBB jönnek (most csak szín + szem). */
var SORENY_SZIN = {
  kek:    [{ nev: "Alap", c: ["#29a3dd", "#7a3bc0", "#c98fe6"] }, { nev: "Jégkék", c: ["#4ec3e0", "#3f6fd0", "#a7d9f0"] }, { nev: "Magenta-hajnal", c: ["#4aa8dd", "#b03bc0", "#f0a5d8"] }],
  korall: [{ nev: "Alap", c: ["#f2662b", "#d83b22", "#ffb43a"] }, { nev: "Parázs", c: ["#ff8a3d", "#c22e2e", "#ffd08a"] }, { nev: "Naplemente", c: ["#f2662b", "#b0347a", "#ffc45c"] }],
  rozsa:  [{ nev: "Alap", c: ["#ffcf4d", "#e6a92e", "#ffe6a0"] }, { nev: "Rózsaarany", c: ["#f7b6c8", "#e08aa8", "#ffe0ea"] }, { nev: "Holdezüst", c: ["#e8e4f0", "#a49cc0", "#f7f5fb"] }]
};
var SZEM_SZIN = [
  { nev: "Alap", hex: null }, { nev: "Égkék", hex: "#2ea8e0" }, { nev: "Rózsa", hex: "#e67ba6" }, { nev: "Sötétbarna", hex: "#3a2a20" },
  { nev: "Mohazöld", hex: "#3f9e6a" }, { nev: "Borostyán", hex: "#b5762e" }, { nev: "Ametiszt", hex: "#7a5bc0" }
];
var SZEM_ALAP = { korall: "#3a2a20", kek: "#2ea8e0", rozsa: "#e67ba6" };
/* a sörény/farok recolor: csak a <g class="ucg"> csoportokon belül cseréli a C1/C2/C3-at */
function ucgSzinez(art, defC, ujC) {
  return art.replace(/<g class="ucg">([\s\S]*?)<\/g>/g, function (m, inner) {
    inner = inner.split(defC[0]).join("").split(defC[1]).join("").split(defC[2]).join("")
                 .split("").join(ujC[0]).split("").join(ujC[1]).split("").join(ujC[2]);
    return '<g class="ucg">' + inner + '</g>';
  });
}
function kinezetAlkalmaz(art, rajz, kinezet) {
  if (!kinezet) return art;
  var sz = kinezet.sorenySzin || 0, lista = SORENY_SZIN[rajz];
  if (sz && lista && lista[sz]) art = ucgSzinez(art, lista[0].c, lista[sz].c);
  if (kinezet.szemSzin) {
    var alap = SZEM_ALAP[rajz] || "#3a2a20";
    art = art.split('r="5" fill="' + alap + '"').join('r="5" fill="' + kinezet.szemSzin + '"');
  }
  return art;
}
/* ── FODRÁSZAT (1. fázis): frizura göndör ↔ egyenes ─────────────────────────
   A göndör a 3 „ucg" csoportot (farok/sörény/homloktincs) fürtös buborékokra cseréli,
   a rajz saját színhármasában (SORENY_SZIN[rajz][0].c = [C1,C2,C3]) — így a kinezet-recolor
   és az élő-animáció ugyanúgy fut, mint az egyenesen. Buborék-pozíciók: fodraszat-rajzterv.html.
   ► A FÜRTÖK EGY HELYEN hangolhatók: az alábbi CURLY tábla [cx, cy, r, szín-slot]. */
var CURLY = {                          /* slot: 0=C1, 1=C2, 2=C3 (csillám) */
  farok:  [[86,164,18,1],[72,180,17,0],[82,198,18,0],[66,212,16,1],[74,230,18,0],[58,246,16,0],[66,264,16,1],[54,282,15,0],
           [80,176,5,2],[72,206,5,2],[64,238,5,2],[58,272,4.5,2]],
  soreny: [[244,94,17,1],[232,114,18,0],[239,136,17,0],[224,154,18,1],[229,176,18,0],[212,192,17,0],[216,214,17,1],[199,227,16,0],[187,235,15,0],
           [237,106,5,2],[231,146,5,2],[221,184,5,2],[206,220,4.5,2]],
  tincs:  [[276,92,11,0],[287,102,10,1],[272,110,10,0],[284,120,9,0],
           [280,98,3.5,2],[277,116,3.2,2]]
};
function furtCsoport(lista, szinek) {
  var s = '<g class="ucg">';
  for (var i = 0; i < lista.length; i++) { var b = lista[i]; s += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + szinek[b[3]] + '" stroke="none"/>'; }
  return s + '</g>';
}
function frizuraGondorArt(rajz) {
  var alap = UNI_RAJZ[rajz] || UNI_KORALL;
  var lista = SORENY_SZIN[rajz] || SORENY_SZIN.korall, szinek = lista[0].c;
  var parts = [furtCsoport(CURLY.farok, szinek), furtCsoport(CURLY.soreny, szinek), furtCsoport(CURLY.tincs, szinek)], i = 0;
  return alap.replace(/<g class="ucg">[\s\S]*?<\/g>/g, function () { return parts[i++]; });
}
/* ── FODRÁSZAT (2. fázis): sörény-, farok- és tincsfestés ────────────────────
   Terv: terv/fodraszat-festes-rendszerterv.html + fodraszat-festes-rajzterv.html (jóváhagyva 2026-09-26).
   Mentés: P().kinezet.festek = { soreny, farok, tincs } (festék-id vagy null); megvett: P().szalon.festekek.
   A festés a bolti sörényszín (kinezetAlkalmaz) UTÁN fut, tehát a festék a bolti szín fölé kerül.
   ► ÚJ SZÍN = ÚJ SOR a FESTEKEK táblában (id, nev, em, ar, és egy rajz-típus: minta / grad / ketszin).
     A mentés csak az id-t tárolja; ismeretlen id → nincs festés. harom = 3 jellemző szín (a kerti
     forgató-nézetekhez, ahol csak színhármas van). */
function festekCsillag(x, y, r, fill) {   /* négyágú csillag */
  var p = [];
  for (var i = 0; i < 8; i++) { var a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; p.push((x + Math.cos(a) * rr).toFixed(1) + "," + (y + Math.sin(a) * rr).toFixed(1)); }
  return '<path d="M' + p.join(" L") + 'Z" fill="' + fill + '"/>';
}
function festekPehely(x, y, r) {
  var s = '<g stroke="#fff" stroke-width="1.4" stroke-linecap="round">';
  for (var i = 0; i < 3; i++) { var a = Math.PI / 3 * i, dx = Math.cos(a) * r, dy = Math.sin(a) * r; s += '<line x1="' + (x - dx).toFixed(1) + '" y1="' + (y - dy).toFixed(1) + '" x2="' + (x + dx).toFixed(1) + '" y2="' + (y + dy).toFixed(1) + '"/>'; }
  return s + '<circle cx="' + x + '" cy="' + y + '" r="1.3" fill="#fff" stroke="none"/></g>';
}
/* rózsaszín négyágú csillagok fehér szívvel (a producer rajzáról); bg=null → átlátszó réteg */
function festekCsillagMinta(p, bg, szin, folt) {
  return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="40" height="40">' +
    (bg ? '<rect width="40" height="40" fill="' + bg + '"/>' : '') + (folt ? '<ellipse cx="28" cy="12" rx="13" ry="7" fill="' + folt + '" opacity=".7"/>' : '') +
    festekCsillag(11, 12, 7.5, szin) + '<circle cx="11" cy="12" r="1.6" fill="#fff"/>' +
    festekCsillag(29, 30, 7, szin) + '<circle cx="29" cy="30" r="1.5" fill="#fff"/>' +
    festekCsillag(34, 7, 3.6, szin) + festekCsillag(6, 33, 3.4, szin) + '</pattern>';
}
function festekSima(id, nev, em, a, b) {   /* egyszerű szín: két árnyalat lágy átmenettel */
  return { id: id, nev: nev, em: em, ar: 12, csik: ["#ffffff", 0.4], fenyp: "#ffffff", grad: [[a, 0], [b, 1]], harom: [a, b, "#ffffff"] };
}
var FESTEKEK = [
  /* ── 7 különleges ── */
  { id: "arany", nev: "Arany csillagos", em: "✨", ar: 12, csik: ["#fff3a8", 0.85], fenyp: "#fffbe0", harom: ["#f2b90f", "#f7c928", "#fffbe0"],
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(-12)">' +
        '<rect width="34" height="34" fill="#f2b90f"/><rect x="0" y="0" width="17" height="34" fill="#f7c928"/>' +
        festekCsillag(8, 9, 4.6, "#fffbe0") + festekCsillag(25, 24, 3.6, "#fff6b0") + '<circle cx="23" cy="6" r="1.4" fill="#fff"/><circle cx="6" cy="27" r="1.2" fill="#fff"/></pattern>'; } },
  { id: "pottyos", nev: "Pöttyös", em: "⚫", ar: 12, csik: ["#3b3b46", 1], fenyp: "#ffffff", harom: ["#1b1b1f", "#3b3b46", "#ffffff"],
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="20" height="20">' +
        '<rect width="20" height="20" fill="#1b1b1f"/><circle cx="5" cy="5" r="3.3" fill="#fff"/><circle cx="15" cy="15" r="3.3" fill="#fff"/></pattern>'; } },
  { id: "szivarvany", nev: "Szivárványos", em: "🌈", ar: 12, csik: ["#ffffff", 0.35], fenyp: "#ffffff", harom: ["#e94b4b", "#3ba3dd", "#f5dc3b"],
    grad: [["#e94b4b", 0], ["#e94b4b", 0.15], ["#f5a13b", 0.19], ["#f5a13b", 0.32], ["#f5dc3b", 0.36], ["#f5dc3b", 0.49], ["#5cc85c", 0.53], ["#5cc85c", 0.66], ["#3ba3dd", 0.70], ["#3ba3dd", 0.83], ["#8a5bd0", 0.87], ["#8a5bd0", 1]] },
  { id: "naplemente", nev: "Naplemente", em: "🌅", ar: 12, csik: ["#ffd9b0", 0.5], fenyp: "#ffe2c4", harom: ["#b0509f", "#6f45b8", "#ff9a3d"],
    grad: [["#6f45b8", 0], ["#b0509f", 0.35], ["#e8649a", 0.55], ["#ff9a3d", 0.85], ["#ffb85c", 1]] },
  { id: "galaxis", nev: "Galaxis", em: "🌌", ar: 12, csik: ["#b58cff", 0.55], fenyp: "#ffffff", harom: ["#1a2350", "#8a4fd0", "#ffffff"],
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="72" height="72">' +
        '<rect width="72" height="72" fill="#1a2350"/><ellipse cx="44" cy="26" rx="30" ry="15" fill="#8a4fd0" opacity=".5"/>' +
        '<ellipse cx="14" cy="58" rx="18" ry="10" fill="#e05aa8" opacity=".35"/><ellipse cx="60" cy="60" rx="12" ry="8" fill="#3fa0e0" opacity=".3"/>' +
        '<circle cx="10" cy="12" r="1.4" fill="#fff"/><circle cx="30" cy="44" r="1.2" fill="#fff"/><circle cx="62" cy="10" r="1" fill="#fff"/>' +
        '<circle cx="52" cy="40" r="1.3" fill="#fff"/><circle cx="22" cy="30" r=".9" fill="#fff"/><circle cx="40" cy="66" r="1.1" fill="#fff"/>' +
        festekCsillag(36, 22, 3.8, "#fff") + festekCsillag(8, 46, 2.8, "#ffe9ff") + '</pattern>'; } },
  { id: "nyaloka", nev: "Nyalóka", em: "🍭", ar: 12, csik: ["#ffffff", 0.4], fenyp: "#ffffff", harom: ["#f27aa8", "#ffffff", "#ffc0d8"],
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(40)">' +
        '<rect width="18" height="18" fill="#fff"/><rect width="9" height="18" fill="#f27aa8"/></pattern>'; } },
  { id: "jeg", nev: "Jégkristály", em: "❄️", ar: 12, csik: ["#ffffff", 0.9], fenyp: "#ffffff", harom: ["#b8e2f5", "#e6f7fd", "#ffffff"],
    minta: function (p) {
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="42" height="42">' +
        '<rect width="42" height="42" fill="#b8e2f5"/><ellipse cx="30" cy="12" rx="14" ry="8" fill="#e6f7fd" opacity=".8"/>' +
        festekPehely(12, 13, 6) + festekPehely(31, 31, 4.2) + '<circle cx="34" cy="8" r="1.2" fill="#fff"/><circle cx="8" cy="34" r="1.4" fill="#fff"/></pattern>'; } },
  /* ── 4 a producer rajzából (terv/fodraszat-rajzok/kulonleges-sorenyek.png), sima rajzstílusban ── */
  { id: "tengerkek", nev: "Tengerkék csillagos", em: "🌊", ar: 12, csik: ["#ffffff", 0.3], fenyp: "#ffffff", harom: ["#12bfe6", "#8ef0f7", "#ff5fbf"],
    ketszin: ["#12bfe6", "#8ef0f7"], csillag: "#ff5fbf" },
  { id: "menta", nev: "Menta csillagos", em: "🍃", ar: 12, csik: ["#ffffff", 0.35], fenyp: "#ffffff", harom: ["#86f0cc", "#b8f7e2", "#d46fe6"],
    minta: function (p) { return festekCsillagMinta(p, "#86f0cc", "#d46fe6", "#b8f7e2"); } },
  { id: "vanilia", nev: "Vanília csillagos", em: "🍦", ar: 12, csik: ["#fff8e0", 0.6], fenyp: "#ffffff", harom: ["#efdfb0", "#f8eccb", "#ff2fa8"],
    minta: function (p) { return festekCsillagMinta(p, "#efdfb0", "#ff2fa8", "#f8eccb"); } },
  { id: "ejcsillam", nev: "Éjszakai csillámpor", em: "🌠", ar: 12, csik: ["#2a2f7a", 0.9], fenyp: "#ffffff", harom: ["#0b0f4a", "#2a2f7a", "#ffffff"],
    minta: function (p) {
      var d = [[3, 4, 1.1], [11, 2, 0.8], [18, 7, 1.2], [7, 11, 0.9], [15, 14, 1], [2, 17, 0.8], [21, 19, 1.1], [10, 21, 0.9], [13, 9, 0.6], [20, 1, 0.7], [5, 23, 0.7]];
      return '<pattern id="' + p + '" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#0b0f4a"/>' +
        d.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fff"/>'; }).join("") + '</pattern>'; } },
  /* ── 6 egyszerű ── */
  festekSima("pink", "Pink", "💗", "#ff5fa8", "#ff9fcf"),
  festekSima("turkiz", "Türkiz", "🐬", "#1fc0c0", "#7fe6e0"),
  festekSima("zold", "Zöld", "🌿", "#4fc07a", "#b8ecc8"),
  festekSima("levendula", "Levendula", "💜", "#a98be0", "#d9c8f5"),
  festekSima("barack", "Barack", "🍑", "#ff9f7a", "#ffd0b0"),
  festekSima("ezust", "Ezüst", "🥈", "#a8b0c0", "#eef1f6")
];
var FESTEK_BY = {};
FESTEKEK.forEach(function (f) { FESTEK_BY[f.id] = f; });
var FESTEK_RESZEK = ["farok", "soreny", "tincs"];   /* a 3 ucg csoport sorrendje a rajzban */
/* részenkénti irány (a hajszál hossza mentén) a színátmenetes festékekhez; FESTEK_FEL = a kétszínű osztás fél-szélessége */
var FESTEK_IRANY = { farok: [96, 146, 46, 292], soreny: [254, 52, 168, 238], tincs: [282, 76, 266, 140] };
var FESTEK_FEL = { farok: 26, soreny: 30, tincs: 12 };
function festekKetszinDef(f, pid, resz) {
  var d = FESTEK_IRANY[resz], mx = (d[0] + d[2]) / 2, my = (d[1] + d[3]) / 2, dx = d[2] - d[0], dy = d[3] - d[1], L = Math.sqrt(dx * dx + dy * dy), w = FESTEK_FEL[resz];
  var px = -dy / L * w, py = dx / L * w;
  return '<linearGradient id="' + pid + '" gradientUnits="userSpaceOnUse" x1="' + (mx - px).toFixed(1) + '" y1="' + (my - py).toFixed(1) + '" x2="' + (mx + px).toFixed(1) + '" y2="' + (my + py).toFixed(1) + '">' +
    '<stop offset="0" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[1] + '"/><stop offset="1" stop-color="' + f.ketszin[1] + '"/></linearGradient>' +
    festekCsillagMinta(pid + "-r", null, f.csillag);
}
/* a festék kitöltés-definíciója egy részre (pid példányonként egyedi) */
function festekDef(f, pid, resz) {
  if (f.ketszin) return festekKetszinDef(f, pid, resz);
  if (f.minta) return f.minta(pid);
  var d = FESTEK_IRANY[resz], s = '<linearGradient id="' + pid + '" gradientUnits="userSpaceOnUse" x1="' + d[0] + '" y1="' + d[1] + '" x2="' + d[2] + '" y2="' + d[3] + '">';
  f.grad.forEach(function (g) { s += '<stop offset="' + g[1] + '" stop-color="' + g[0] + '"/>'; });
  return s + '</linearGradient>';
}
/* kis festékfolt (tégely teteje, gomb-ikon, vásárlás-ablak): saját 0..1 koordinátában */
function festekFoltDef(f, id) {
  if (f.ketszin) return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset=".5" stop-color="' + f.ketszin[0] + '"/><stop offset=".5" stop-color="' + f.ketszin[1] + '"/></linearGradient>';
  if (f.minta) return f.minta(id);
  var s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">';
  f.grad.forEach(function (g) { s += '<stop offset="' + g[1] + '" stop-color="' + g[0] + '"/>'; });
  return s + '</linearGradient>';
}
/* egy rész kifestése: a fő kitöltés → festék, a fénycsíkok/fénypöttyök → festékhez illő árnyalat */
function festekReszFest(inner, f, pid) {
  return inner.replace(/<(path|circle)([^>]*?)\/>/g, function (m, tag, attr) {
    var rm = tag === "circle" && /\br="([\d.]+)"/.exec(attr);
    var kicsiFeny = !!rm && parseFloat(rm[1]) <= 5.5;
    if (/fill="none"/.test(attr)) return '<' + tag + attr.replace(/stroke="#[0-9a-fA-F]{6}"/, 'stroke="' + f.csik[0] + '" stroke-opacity="' + f.csik[1] + '"') + '/>';
    if (kicsiFeny) return '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="' + f.fenyp + '" fill-opacity=".9"') + '/>';
    var fo = '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="url(#' + pid + ')"') + '/>';
    return f.ketszin ? fo + '<' + tag + attr.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="url(#' + pid + '-r)"') + '/>' : fo;
  });
}
var FESTEK_SORSZAM = 0;   /* a minta-id-k példányonként egyediek (egy képernyőn több unikornis is lehet) */
function festekAlkalmaz(art, festek, pfx) {
  if (!festek || !(FESTEK_BY[festek.soreny] || FESTEK_BY[festek.farok] || FESTEK_BY[festek.tincs])) return art;
  var p = "fs" + (++FESTEK_SORSZAM) + "-" + String(pfx || "u").replace(/[^A-Za-z0-9_-]/g, ""), defs = "", k = 0;
  art = art.replace(/<g class="ucg">([\s\S]*?)<\/g>/g, function (m, inner) {
    var resz = FESTEK_RESZEK[k++], f = FESTEK_BY[festek[resz]];
    if (f) { var pid = p + "-" + resz; defs += festekDef(f, pid, resz); inner = festekReszFest(inner, f, pid); }
    return '<g class="ucg">' + inner + '</g>';
  });
  return '<defs>' + defs + '</defs>' + art;
}
function unikornisSVG(id, c, meret, oltozet, kinezet) {
  var s = meret || 1;
  var rajz = (c && c.rajz) || "korall";
  var art = UNI_RAJZ[rajz] || UNI_KORALL;
  if (kinezet === undefined) kinezet = (typeof P === "function" && P() && P().kinezet) || null;
  if (kinezet && kinezet.frizura === "gondor") art = frizuraGondorArt(rajz);   /* FODRÁSZAT: göndör forma (a recolor/anim ugyanúgy fut rá) */
  art = kinezetAlkalmaz(art, rajz, kinezet);
  art = festekAlkalmaz(art, kinezet && kinezet.festek, id);   /* FODRÁSZAT 2.: festék a bolti szín fölé */
  art = eloAnimHorgony(art);
  var ruha = "";
  if (oltozet) ["hat", "farok", "oldal", "lab", "nyak", "fej"].forEach(function (h) { if (oltozet[h]) ruha += ruhaSVG(oltozet[h]); });
  return '<g id="' + id + '" transform="scale(' + s + ')">' +
    '<g transform="scale(0.5) translate(-190,-272)">' +
      '<g class="uni-elo">' + art + ruha + '</g>' +
      (window.__UC_ANCHOR ? anchorVizSVG() : "") +
    '</g>' +
  '</g>';
}
/* ── 4 NÉZETES FORGATÓ MOTOR (sprite-swap rotation) ────────────────────────
   Bármilyen figurát/tárgyat körbeforgathatunk 4 nézettel (jobb/elöl/bal/hátul).
   A kert 🌀 Pörgés trükk ezt használja — így sosem lesz papírvékony csík. */
var FORGATO_PALETTA = {
  korall: { test:"#f2a877",has:"#f8c6a1",lab:"#f8c6a1",s1:"#f2662b",s2:"#d83b22",s3:"#ffb43a",szarv:"#f28a2e",szarvCs:"#c9531a",szem:"#3a2a20" },
  kek:    { test:"#d7ebfb",has:"#ecf6fe",lab:"#ecf6fe",s1:"#29a3dd",s2:"#7a3bc0",s3:"#c98fe6",szarv:"#6a6fd6",szarvCs:"#454bb0",szem:"#2ea8e0" },
  rozsa:  { test:"#fdf3f7",has:"#ffffff",lab:"#ffffff",s1:"#ffcf4d",s2:"#e6a92e",s3:"#ffe6a0",szarv:"#ffcf4d",szarvCs:"#e0a52e",szem:"#e67ba6" }
};
function forgatoSzinek(rajz, kinezet) {
  var a = FORGATO_PALETTA[rajz] || FORGATO_PALETTA.korall, sz = {};
  for (var k in a) if (a.hasOwnProperty(k)) sz[k] = a[k];
  if (kinezet && kinezet.sorenySzin) {
    var lista = SORENY_SZIN[rajz];
    if (lista && lista[kinezet.sorenySzin]) { var c = lista[kinezet.sorenySzin].c; sz.s1 = c[0]; sz.s2 = c[1]; sz.s3 = c[2]; }
  }
  if (kinezet && kinezet.szemSzin) sz.szem = kinezet.szemSzin;
  /* FODRÁSZAT 2.: a forgató-nézetek csak színhármast ismernek → a festett sörény 3 jellemző színe */
  var fs = kinezet && kinezet.festek && FESTEK_BY[kinezet.festek.soreny];
  if (fs) { sz.s1 = fs.harom[0]; sz.s2 = fs.harom[1]; sz.s3 = fs.harom[2]; }
  return sz;
}
function unikornisFrontArt(sz, gondor) {
  var s = '<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">';
  s += '<path d="M172 228 Q158 256 156 278" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/>';
  s += '<path d="M208 228 Q222 256 224 278" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/>';
  s += '<path d="M148 220 L140 286 L162 286 L156 222" fill="' + sz.lab + '" stroke-width="4" opacity=".7"/>';
  s += '<path d="M232 220 L240 286 L218 286 L224 222" fill="' + sz.lab + '" stroke-width="4" opacity=".7"/>';
  s += '<path d="M110 174 C110 130 142 118 190 118 C238 118 270 130 270 174 C270 218 242 236 190 236 C138 236 110 218 110 174 Z" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="190" cy="200" rx="52" ry="26" fill="' + sz.has + '" stroke="none"/>';
  s += '<path d="M158 224 L150 286 L174 286 L166 226" fill="' + sz.lab + '" stroke-width="4"/>';
  s += '<path d="M222 224 L230 286 L206 286 L214 226" fill="' + sz.lab + '" stroke-width="4"/>';
  s += '<ellipse cx="162" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += '<ellipse cx="218" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  if (gondor) {
    s += '<g class="ucg"><circle cx="138" cy="82" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="128" cy="112" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="122" cy="146" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="120" cy="178" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="126" cy="206" r="12" fill="' + sz.s1 + '" stroke="none"/><circle cx="132" cy="94" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="124" cy="162" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
    s += '<g class="ucg"><circle cx="242" cy="82" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="252" cy="112" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="258" cy="146" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="260" cy="178" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="254" cy="206" r="12" fill="' + sz.s1 + '" stroke="none"/><circle cx="248" cy="94" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="256" cy="162" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M154 56 Q124 82 118 124 Q114 160 122 200 Q128 224 134 240" fill="none" stroke="' + sz.s1 + '" stroke-width="9"/><path d="M156 62 Q130 92 124 134 Q120 168 128 210" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M158 54 Q136 78 132 116 Q128 148 134 180" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
    s += '<g class="ucg"><path d="M226 56 Q256 82 262 124 Q266 160 258 200 Q252 224 246 240" fill="none" stroke="' + sz.s1 + '" stroke-width="9"/><path d="M224 62 Q250 92 256 134 Q260 168 252 210" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M222 54 Q244 78 248 116 Q252 148 246 180" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
  }
  s += '<circle cx="190" cy="88" r="42" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="153" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(-15,153,56)"/>';
  s += '<ellipse cx="227" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(15,227,56)"/>';
  s += '<polygon points="190,12 176,62 204,62" fill="' + sz.szarv + '" stroke-width="4"/>';
  s += '<path d="M180 52 L200 52" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M183 40 L197 40" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M186 28 L194 28" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  if (gondor) {
    s += '<g class="ucg"><circle cx="178" cy="78" r="9" fill="' + sz.s1 + '" stroke="none"/><circle cx="202" cy="78" r="9" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="74" r="7" fill="' + sz.s2 + '" stroke="none"/><circle cx="184" cy="86" r="3" fill="' + sz.s3 + '" stroke="none"/><circle cx="196" cy="86" r="3" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M180 64 Q174 80 178 96" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/><path d="M186 62 Q180 78 184 94" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/><path d="M194 62 Q200 78 196 94" fill="none" stroke="' + sz.s1 + '" stroke-width="5"/><path d="M200 64 Q206 80 202 96" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/></g>';
  }
  s += '<path d="M165 86 Q172 76 180 76 Q188 76 191 86 Q186 92 178 92 Q170 92 165 86 Z" fill="#fff" stroke-width="1.7"/>';
  s += '<circle cx="178" cy="85" r="5.5" fill="' + sz.szem + '" stroke="none"/><circle cx="178" cy="85" r="3.2" fill="#222" stroke="none"/><circle cx="176" cy="83" r="1.6" fill="#fff" stroke="none"/>';
  s += '<path d="M189 86 Q196 76 204 76 Q212 76 215 86 Q210 92 202 92 Q194 92 189 86 Z" fill="#fff" stroke-width="1.7"/>';
  s += '<circle cx="202" cy="85" r="5.5" fill="' + sz.szem + '" stroke="none"/><circle cx="202" cy="85" r="3.2" fill="#222" stroke="none"/><circle cx="200" cy="83" r="1.6" fill="#fff" stroke="none"/>';
  s += '<path d="M165 84 q-3 -3 -5 -8" fill="none" stroke-width="2.2"/><path d="M169 80 q-2 -4 -3 -9" fill="none" stroke-width="2.2"/>';
  s += '<path d="M215 84 q3 -3 5 -8" fill="none" stroke-width="2.2"/><path d="M211 80 q2 -4 3 -9" fill="none" stroke-width="2.2"/>';
  s += '<path d="M183 104 Q190 110 197 104" fill="none" stroke="#e088b0" stroke-width="2"/>';
  s += '<ellipse cx="162" cy="98" rx="8" ry="5" fill="#f0b8d8" opacity=".35" stroke="none"/>';
  s += '<ellipse cx="218" cy="98" rx="8" ry="5" fill="#f0b8d8" opacity=".35" stroke="none"/>';
  s += '<path d="M148 24 l1.8 4 l4 1.8 l-4 1.8 l-1.8 4 l-1.8 -4 l-4 -1.8 l4 -1.8 Z" fill="' + sz.s1 + '" stroke="none"/>';
  s += '<path d="M234 18 l1.4 3.2 l3.2 1.4 l-3.2 1.4 l-1.4 3.2 l-1.4 -3.2 l-3.2 -1.4 l3.2 -1.4 Z" fill="' + sz.s2 + '" stroke="none"/>';
  return s + '</g>';
}
function unikornisBackArt(sz, gondor) {
  var s = '<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">';
  if (gondor) {
    s += '<g class="ucg"><circle cx="176" cy="238" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="248" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="204" cy="238" r="14" fill="' + sz.s2 + '" stroke="none"/><circle cx="170" cy="264" r="13" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="272" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="210" cy="264" r="13" fill="' + sz.s1 + '" stroke="none"/><circle cx="180" cy="286" r="11" fill="' + sz.s2 + '" stroke="none"/><circle cx="200" cy="286" r="11" fill="' + sz.s2 + '" stroke="none"/><circle cx="184" cy="254" r="4" fill="' + sz.s3 + '" stroke="none"/><circle cx="196" cy="254" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M190 222 Q164 252 156 274 Q150 288 156 294" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M190 220 Q190 258 188 280 Q186 292 190 296" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M190 222 Q216 252 224 274 Q230 288 224 294" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M190 218 Q176 248 170 270 Q166 284 170 292" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/><path d="M190 218 Q204 248 210 270 Q214 284 210 292" fill="none" stroke="' + sz.s3 + '" stroke-width="5"/></g>';
  }
  s += '<path d="M148 220 L140 286 L162 286 L156 222" fill="' + sz.lab + '" stroke-width="4" opacity=".7"/>';
  s += '<path d="M232 220 L240 286 L218 286 L224 222" fill="' + sz.lab + '" stroke-width="4" opacity=".7"/>';
  s += '<path d="M110 174 C110 130 142 118 190 118 C238 118 270 130 270 174 C270 218 242 236 190 236 C138 236 110 218 110 174 Z" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="190" cy="200" rx="52" ry="26" fill="' + sz.has + '" stroke="none"/>';
  s += '<path d="M158 224 L150 286 L174 286 L166 226" fill="' + sz.lab + '" stroke-width="4"/>';
  s += '<path d="M222 224 L230 286 L206 286 L214 226" fill="' + sz.lab + '" stroke-width="4"/>';
  s += '<ellipse cx="162" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += '<ellipse cx="218" cy="288" rx="12" ry="3.5" fill="#baa0d0" stroke="none"/>';
  s += '<circle cx="190" cy="88" r="42" fill="' + sz.test + '" stroke-width="5"/>';
  s += '<ellipse cx="153" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(-15,153,56)"/>';
  s += '<ellipse cx="227" cy="56" rx="10" ry="18" fill="' + sz.test + '" stroke-width="3" transform="rotate(15,227,56)"/>';
  s += '<ellipse cx="153" cy="58" rx="5.5" ry="12" fill="#f0b8d8" stroke="none" transform="rotate(-15,153,58)"/>';
  s += '<ellipse cx="227" cy="58" rx="5.5" ry="12" fill="#f0b8d8" stroke="none" transform="rotate(15,227,58)"/>';
  s += '<polygon points="190,18 180,58 200,58" fill="' + sz.szarv + '" stroke-width="4"/>';
  s += '<path d="M183 48 L197 48" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  s += '<path d="M185 36 L195 36" stroke="' + sz.szarvCs + '" stroke-width="3"/>';
  if (gondor) {
    s += '<g class="ucg"><circle cx="172" cy="76" r="15" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="82" r="16" fill="' + sz.s1 + '" stroke="none"/><circle cx="208" cy="76" r="15" fill="' + sz.s2 + '" stroke="none"/><circle cx="166" cy="110" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="116" r="15" fill="' + sz.s1 + '" stroke="none"/><circle cx="214" cy="110" r="14" fill="' + sz.s1 + '" stroke="none"/><circle cx="172" cy="142" r="12" fill="' + sz.s2 + '" stroke="none"/><circle cx="190" cy="146" r="13" fill="' + sz.s2 + '" stroke="none"/><circle cx="208" cy="142" r="12" fill="' + sz.s2 + '" stroke="none"/><circle cx="180" cy="92" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="200" cy="92" r="4.5" fill="' + sz.s3 + '" stroke="none"/><circle cx="178" cy="128" r="4" fill="' + sz.s3 + '" stroke="none"/><circle cx="202" cy="128" r="4" fill="' + sz.s3 + '" stroke="none"/></g>';
  } else {
    s += '<g class="ucg"><path d="M172 60 Q156 100 154 148 Q152 188 160 224" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/><path d="M180 56 Q168 100 166 150 Q164 196 172 236" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M190 52 Q190 100 190 150 Q190 196 190 240" fill="none" stroke="' + sz.s3 + '" stroke-width="6"/><path d="M200 56 Q212 100 214 150 Q216 196 208 236" fill="none" stroke="' + sz.s2 + '" stroke-width="7"/><path d="M208 60 Q224 100 226 148 Q228 188 220 224" fill="none" stroke="' + sz.s1 + '" stroke-width="8"/></g>';
  }
  s += '<g class="ucg">';
  if (gondor) {
    s += '<circle cx="182" cy="52" r="8" fill="' + sz.s1 + '" stroke="none"/><circle cx="198" cy="52" r="8" fill="' + sz.s1 + '" stroke="none"/><circle cx="190" cy="48" r="6" fill="' + sz.s2 + '" stroke="none"/>';
  } else {
    s += '<path d="M182 52 Q178 36 180 24" fill="none" stroke="' + sz.s1 + '" stroke-width="4"/><path d="M198 52 Q202 36 200 24" fill="none" stroke="' + sz.s2 + '" stroke-width="4"/>';
  }
  s += '</g>';
  return s + '</g>';
}
/* ── ÉLETRE KELTÉS (idle animáció) ──────────────────────────────────────────
   Csak CLASS-eket tesz a meglévő rajzra — a geometriát/színt NEM érinti. A tényleges
   mozgást a style.css végzi, és CSAK a "hős" konténerekben (#szinpad, #odu-szoba,
   #profil-lista); a pici bélyegképek (menü-kártyák, bolt-előnézet, jelvények) mozdulatlanok.
   FONTOS: ez kinezetAlkalmaz UTÁN fut, mert az a szó szerinti <g class="ucg">-re épül és
   visszaírja azt. A három "ucg" csoport sorrendben: 1) farok, 2) sörény, 3) homloktincs;
   a szem az egyetlen 3-jegyű #222-es csoport. */
function eloAnimHorgony(art) {
  art = art.replace('<g stroke="#222" stroke-linejoin="round" stroke-linecap="round">',
                    '<g class="uni-szem" stroke="#222" stroke-linejoin="round" stroke-linecap="round">');
  var n = 0;
  art = art.replace(/<g class="ucg">/g, function () {
    n++;
    return '<g class="ucg ' + (n === 1 ? "uni-farok" : n === 2 ? "uni-soreny" : "uni-tincs") + '">';
  });
  /* a 4 láb (mindhárom színnél azonos d-koordináták) — osztály a séta-animációhoz;
     A/B csoport ellenfázisban leng a csípőnél (kertben, .jar alatt). Máshol nem mozdul. */
  art = art.replace('<path d="M102 208', '<path class="uni-lab uni-lab-a" d="M102 208');
  art = art.replace('<path d="M135 216', '<path class="uni-lab uni-lab-b" d="M135 216');
  art = art.replace('<path d="M177 216', '<path class="uni-lab uni-lab-a" d="M177 216');
  art = art.replace('<path d="M212 208', '<path class="uni-lab uni-lab-b" d="M212 208');
  return art;
}
/* ── FEJLESZTŐI ANCHOR-VIZUALIZÁLÓ (nem éles): a 380×300 rajz-keretben kirajzolja a
   ruha-zónák borítékát + a horgonypontokat, hogy élesben látszódjon, hova esik minden ruha.
   Bekapcsolás: URL-ben ?anchor=1 VAGY konzolból UC.anchorViz(true). */
var ANCHOR_ZONAK = [
  { nev: "fej",   x: 244, y: 54,  w: 88,  h: 48, hx: 288, hy: 73,  szin: "#e0417a" },
  { nev: "nyak",  x: 232, y: 145, w: 80,  h: 68, hx: 266, hy: 160, szin: "#1f9e6b" },
  { nev: "hát",   x: 104, y: 96,  w: 152, h: 78, hx: 180, hy: 118, szin: "#8a4fd0" },
  { nev: "oldal", x: 40,  y: 26,  w: 172, h: 136, hx: 172, hy: 106, szin: "#c98a1e" },
  { nev: "farok", x: 54,  y: 128, w: 76,  h: 46, hx: 92,  hy: 150, szin: "#c0407a" }
];
function anchorVizSVG() {
  var s = '<g class="anchor-viz" pointer-events="none" font-family="sans-serif">';
  /* testtető-ív referencia (a hát-takarók alsó éle ezt követhesse) */
  s += '<path d="M74 172 C74 130 110 106 172 106 C236 106 268 132 268 176" fill="none" stroke="#ff2fa0" stroke-width="1.6" stroke-dasharray="5 3" opacity="0.9"/>';
  ANCHOR_ZONAK.forEach(function (z) {
    s += '<rect x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" fill="' + z.szin + '" fill-opacity="0.10" stroke="' + z.szin + '" stroke-width="1.4" stroke-dasharray="6 4"/>';
    s += '<circle cx="' + z.hx + '" cy="' + z.hy + '" r="4" fill="' + z.szin + '" stroke="#fff" stroke-width="1.2"/>';
    s += '<text x="' + (z.x + 3) + '" y="' + (z.y + 12) + '" font-size="10" font-weight="700" fill="' + z.szin + '">' + z.nev + '</text>';
  });
  /* a 4 láb-horgony */
  [103, 141, 191, 244].forEach(function (cx) {
    s += '<circle cx="' + cx + '" cy="270" r="3.4" fill="#2b6ad8" stroke="#fff" stroke-width="1"/>';
  });
  s += '<text x="90" y="286" font-size="10" font-weight="700" fill="#2b6ad8">láb ×4</text>';
  /* oldal-szárny csúcsirány jelző */
  s += '<line x1="172" y1="106" x2="85" y2="40" stroke="#c98a1e" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.8"/>';
  return s + '</g>';
}
function anchorViz(on) {
  window.__UC_ANCHOR = (on !== false);
  var aktiv = (document.querySelector(".kepernyo.aktiv") || {}).id;
  try {
    if (aktiv === "kepernyo-profil") renderProfil();
    else if (aktiv === "kepernyo-odu") renderOdu();
    else if (aktiv === "kepernyo-fomenu") renderFomenu();
    var op = $("odu-panel"); if (op && !op.hidden) renderOduPanel();
  } catch (e) {}
  return "anchor-viz: " + (window.__UC_ANCHOR ? "BE" : "KI") + " (a pálya-térképen a következő képernyőváltáskor frissül)";
}
if (/[?&]anchor=1\b/.test(location.search)) window.__UC_ANCHOR = true;
/* Egy ruhadarab rajza a kész unikornis-rajz 380×300 koordinátájában.
   Horgonypontok: fej ~(288,121) / szarv-tő ~(272,90), nyak/mell ~(236,200). */
function ruhaSVG(itemId) {
  var s;
  switch (itemId) {
    case "fej-a": /* Virágkoszorú – a fej TETEJÉN ívelve (zóna: fej-korona, y≤96); egységes bélyegkép-spec: élénk, elütő színű szirmok */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M254 98 Q288 70 322 98" fill="none" stroke="#a7d99a" stroke-width="2" opacity="0.7"/>' +
        '<circle cx="256" cy="96" r="7" fill="#f6a5c0"/><circle cx="272" cy="80" r="7" fill="#fce49a"/>' +
        '<circle cx="290" cy="74" r="7.5" fill="#a7d99a"/><circle cx="308" cy="80" r="7" fill="#9ec9f0"/>' +
        '<circle cx="324" cy="96" r="7" fill="#c9a8e6"/>' +
        '</g><g fill="#ffd24d"><circle cx="256" cy="96" r="2.3"/><circle cx="272" cy="80" r="2.3"/>' +
        '<circle cx="290" cy="74" r="2.4"/><circle cx="308" cy="80" r="2.3"/><circle cx="324" cy="96" r="2.3"/></g>';
    case "fej-k": /* Csillag-szarvdísz – szikra-csóva a szarv felé + csillag a csúcsnál (egységes bélyegkép-spec) */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M270 86 Q288 78 296 62" fill="none" stroke="#e6c34d" stroke-width="4.5"/>' +
        '<path d="M278 68 Q294 60 300 46" fill="none" stroke="#e6c34d" stroke-width="4"/>' +
        '</g><path d="M298 40 l3.5 9 l9.5 0.7 l-7.5 6 l2.8 9.2 l-8.3 -5.4 l-8.3 5.4 l2.8 -9.2 l-7.5 -6 l9.5 -0.7 Z" fill="#ffd24d" stroke="#222" stroke-width="1"/>';
    case "fej-r": /* Hold-korona – recés pánt a fej tetején + holdsarló a közepén (egységes bélyegkép-spec) */
      return '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M258 100 Q262 82 272 80 l4 8 l8 -11 l8 11 l4 -8 Q316 82 318 100 Z" fill="#d9c7ec"/>' +
        '<path d="M292 76 a9 9 0 1 0 6.2 15.4 a7.2 7.2 0 1 1 -6.2 -15.4 Z" fill="#fdf0d0" stroke="#c9a8e6" stroke-width="1"/>' +
        '</g><circle cx="264" cy="92" r="2.2" fill="#ffd24d"/><circle cx="312" cy="92" r="2.2" fill="#9ec9f0"/>';
    case "nyak-a": /* Makk-lánc – a fej alatti nyak-öbölben (zóna: nyak-öböl, y150–210), makk-medál lóg le */
      return '<g stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M238 158 Q266 196 294 172" fill="none" stroke="#8a6a4a" stroke-width="4.5"/>' +
        '<circle cx="246" cy="168" r="2.6" fill="#a9814e"/><circle cx="286" cy="178" r="2.6" fill="#a9814e"/>' +
        '<ellipse cx="266" cy="200" rx="8.5" ry="10.5" fill="#c08a52"/>' +
        '<path d="M256 194 q10 -8 20 0 l0 -4 q-10 -6 -20 0 Z" fill="#8a6a4a"/><path d="M266 188 v-5" stroke="#8a6a4a" stroke-width="2.4"/>' +
        '</g>';
    case "nyak-k": /* Szív-medál – arany gyöngysor a nyak-öbölben + szív lóg le (ua. zóna, mint nyak-a) */
      return '<g stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M236 150 Q266 192 296 168" fill="none" stroke="#c9a06a" stroke-width="2" opacity="0.4"/>' +
        '<circle cx="236" cy="150" r="3" fill="#ffd24d"/><circle cx="246.1" cy="162.2" r="3" fill="#ffd24d"/><circle cx="256" cy="170.7" r="3" fill="#ffd24d"/><circle cx="266" cy="175.5" r="3" fill="#ffd24d"/><circle cx="276" cy="176.7" r="3" fill="#ffd24d"/><circle cx="286.1" cy="174.2" r="3" fill="#ffd24d"/><circle cx="296" cy="168" r="3" fill="#ffd24d"/>' +
        '<path d="M266 177.5 L266 187.5" stroke="#222" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M266 178.5 L266 186.5" stroke="#ffd24d" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M266 191.5 C263 186.5 255 187.5 255 193.5 C255 200.5 266 207.5 266 207.5 C266 207.5 277 200.5 277 193.5 C277 187.5 269 186.5 266 191.5 Z" fill="#f6a5c0" stroke="#222" stroke-width="1.6"/>' +
        '<ellipse cx="261" cy="195.5" rx="2.4" ry="3.6" fill="#fdf4d8" opacity="0.9" stroke="none"/>' +
        '<path d="M279 189 l1.5 3.6 l3.6 1.5 l-3.6 1.5 l-1.5 3.6 l-1.5 -3.6 l-3.6 -1.5 l3.6 -1.5 Z" fill="#fff2c4" stroke="none"/>' +
        '<path d="M243 160 l1.1 2.8 l2.8 1.1 l-2.8 1.1 l-1.1 2.8 l-1.1 -2.8 l-2.8 -1.1 l2.8 -1.1 Z" fill="#fff2c4" stroke="none"/>' +
        '</g>';
    case "nyak-r": /* Szivárvány-sál – ÚJRARAJZOLVA (egységes bélyegkép-spec): egy csíkos háromszög-kendő
                      a nyak alatt (horgony-y 166-tól, hogy ne a szájnál lógjon), nem két hosszú lebeny */
      return '<g stroke="#222" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M244 166 Q272 148 300 166 Q290 178 272 176 Q254 178 244 166 Z" fill="#f6a5c0"/>' +
        '<path d="M259 175 L272 210 L285 175 Z" fill="#f6a5c0"/>' +
        '<path d="M261 182 L283 182" stroke="#fce49a" stroke-width="3.4"/>' +
        '<path d="M263 191 L281 191" stroke="#a7d99a" stroke-width="3.2"/>' +
        '<path d="M265 200 L279 200" stroke="#9ec9f0" stroke-width="3"/>' +
        '</g>';

    /* ── HÁT ── a test tetejére simuló takaró/köpeny, közös sziluett-sablonon, a testtető-ívre
       igazítva, -8°-kal döntve (a rajzoló session anyaga, 2026-09-05; spec-grafikai-eszkozlista §3.1). */
    case "hat-a": /* Pillekönnyű takaró */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#e9ddf3"/>' +
        '<path d="M128 132 Q186 108 238 132 Q234 120 186 116 Q138 120 128 132 Z" fill="#dcd0ec"/>' +
        '<path d="M138 154 Q186 168 232 154 L228 168 Q186 180 142 168 Z" fill="#cbbde6"/>' +
        '</g>';
    case "hat-k": /* Hímzett nyeregtakaró */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#d9b48a"/>' +
        '<path d="M124 140 Q186 118 242 140" fill="none" stroke="#f6ecd8" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>' +
        '<path d="M160 116 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#f6a5c0"/>' +
        '<path d="M212 116 l2.2 5.4 l5.4 2.2 l-5.4 2.2 l-2.2 5.4 l-2.2 -5.4 l-5.4 -2.2 l5.4 -2.2 Z" fill="#a7d99a"/>' +
        '<circle cx="186" cy="150" r="6" fill="#fce49a" stroke="#222" stroke-width="1"/>' +
        '</g>';
    case "hat-r": /* Csillagköpeny */
      return '<ellipse cx="186" cy="177" rx="62" ry="7" fill="#4a3b7a" opacity="0.14" transform="rotate(-8 186 150)"/>' +
        '<g transform="rotate(-8 186 150)" stroke="#222" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M118 143 Q130 105 186 99 Q242 105 248 143 Q252 157 244 169 L236 185 Q186 195 136 185 L128 169 Q114 157 118 143 Z" fill="#5a4fa0"/>' +
        '<path d="M128 132 Q186 108 238 132 Q234 120 186 116 Q138 120 128 132 Z" fill="#6a5fb0"/>' +
        '<path d="M150 128 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff6d8"/>' +
        '<path d="M222 130 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#fff6d8"/>' +
        '<circle cx="186" cy="150" r="3.4" fill="#ffd24d"/>' +
        '</g>';

    /* ── LÁB ── mind a 4 lábra */
    case "lab-a": case "lab-k": case "lab-r":
      s = '<g stroke="#222" stroke-width="1.5" stroke-linejoin="round">';
      [103, 141, 191, 244].forEach(function (cx) {
        if (itemId === "lab-a")
          s += '<rect x="' + (cx - 11) + '" y="264" width="22" height="8" rx="2.5" fill="#a7d99a"/><path d="M' + cx + ' 264 l-4 -6 l4 -1 l4 1 Z" fill="#8cc47c"/>';
        else if (itemId === "lab-k")
          s += '<path d="M' + (cx - 10) + ' 288 a 10 9 0 0 1 20 0" fill="none" stroke="#cfd6de" stroke-width="4.5"/><circle cx="' + (cx - 8) + '" cy="285" r="1.6" fill="#eef2f6"/><circle cx="' + (cx + 8) + '" cy="285" r="1.6" fill="#eef2f6"/>';
        else
          s += '<path d="M' + (cx - 10) + ' 288 a 10 9 0 0 1 20 0" fill="none" stroke="#f4b8d8" stroke-width="4.5"/><path d="M' + cx + ' 270 l2 4 l4 1 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -1 Z" fill="#fff6d8"/>';
      });
      return s + '</g>';

    /* ── OLDAL (szárny) ── a vállon, a nyak-tő mögött, felfelé-hátra álló kis szárnyként (zóna: váll, x166–216 y84–152) */
    /* NAGYÍTOTT + JÓVÁHAGYOTT IRÁNY (2026-09-04, spec-szarny-nagyitas.html): tő a hát-tetőn
       ~(172,106), a csúcs hátrafelé-fölfelé dől a farok irányába (~(85,40)), kb. 2,3× a korábbi
       méretnek, teljesen LÁTHATÓAN a test/sörény előtt (nem bújik el mögötte). */
    case "oldal-a": /* Levél-szárny — egy nagy, hegyes levél */
      return '<g stroke="#222" stroke-width="1.8" stroke-linejoin="round">' +
        '<path d="M172 106 Q116 90 82 42 Q146 66 180 96 Q198 108 188 118 Q178 122 172 106 Z" fill="#a7d99a"/>' +
        '<path d="M172 104 Q142 90 96 52 M164 100 Q144 100 118 84" fill="none" stroke="#7fb872" stroke-width="2.2"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';
    case "oldal-k": /* Pillangó-szárny — két lebeny, pöttyökkel */
      return '<g stroke="#222" stroke-width="1.7" stroke-linejoin="round">' +
        '<path d="M172 106 Q112 76 76 36 Q108 44 140 60 Q168 78 178 98 Q182 104 172 106 Z" fill="#c9a8e6"/>' +
        '<path d="M172 110 Q135 128 108 165 Q112 138 140 118 Q160 108 172 110 Z" fill="#b58fd8"/>' +
        '<circle cx="118" cy="66" r="5.5" fill="#f6a5c0"/><circle cx="140" cy="86" r="4" fill="#fce49a"/><circle cx="128" cy="145" r="4.5" fill="#fce49a"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';
    case "oldal-r": /* Fény-szárny — glóriás, csillanó */
      return '<g stroke-linejoin="round">' +
        '<ellipse cx="128" cy="86" rx="92" ry="78" fill="#ffe9ad" opacity="0.26"/>' +
        '<g stroke="#222" stroke-width="1.6">' +
        '<path d="M170 108 Q120 82 85 40 Q140 55 175 62 Q195 62 205 82 Q220 78 205 100 Q190 108 170 108 Z" fill="#ffffff"/>' +
        '<path d="M172 104 Q130 84 100 50 M178 90 Q160 78 145 64" fill="none" stroke="#f0d9a0" stroke-width="1.6"/>' +
        '</g>' +
        '<path d="M96 46 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffd24d"/>' +
        '<circle cx="176" cy="112" r="4" fill="#8f7ab8" stroke="#222" stroke-width="1.2"/>' +
        '</g>';

    /* ── FAROK ── a farok tövénél (hátul-balra) */
    /* a farok-tő ~(92,150) köré, -15°-kal a farok irányába döntve (rajzoló session, 2026-09-05; §3.1.3) */
    case "farok-a": /* Szalagcsokor */
      return '<g transform="rotate(-15 92 150)" stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M92 150 Q78 138 66 148 Q76 158 92 150 Z" fill="#f6a5c0"/>' +
        '<path d="M92 150 Q106 138 118 148 Q108 158 92 150 Z" fill="#f6a5c0"/>' +
        '<circle cx="92" cy="150" r="5" fill="#e88bb4"/>' +
        '<path d="M88 155 l-8 20 M96 155 l8 20" fill="none" stroke="#f6a5c0" stroke-width="3"/>' +
        '</g>';
    case "farok-k": /* Csengettyűs farokdísz */
      return '<g transform="rotate(-15 92 150)" stroke="#222" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M76 144 Q92 134 108 144" fill="none" stroke="#c9a8e6" stroke-width="4"/>' +
        '<path d="M83 150 q-9 0 -9 10 l0 7 l18 0 l0 -7 q0 -10 -9 -10 Z" fill="#ffd24d"/>' +
        '<circle cx="92" cy="170" r="2.6" fill="#e0a52e"/><circle cx="90" cy="146" r="2.6" fill="#ffe6a0"/>' +
        '</g>';
    case "farok-r": /* Üstökös-farok */
      return '<g transform="rotate(-15 92 150)" stroke-linejoin="round">' +
        '<path d="M92 150 Q70 172 55 200" fill="none" stroke="#fff2c4" stroke-width="12" stroke-linecap="round" opacity="0.5"/>' +
        '<path d="M92 150 Q72 170 58 198" fill="none" stroke="#ffe08a" stroke-width="5" stroke-linecap="round" opacity="0.9"/>' +
        '<path d="M55 200 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffe08a" stroke="#222" stroke-width="1.3"/>' +
        '</g>';
  }
  return "";
}
function bagolySVG() {
  return '<svg class="bagoly-figura" viewBox="-52 -60 104 126" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M-40,52 Q0,40 40,52" stroke="#6b5442" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<g class="bagoly-test">' +
      '<ellipse cx="0" cy="0" rx="34" ry="42" fill="#c9a8e6"/>' +
      '<ellipse cx="0" cy="8" rx="22" ry="30" fill="#e9ddf3"/>' +
      '<path d="M-34,-6 Q-46,10 -34,30 Q-30,10 -30,-6 Z" fill="#b48fd6"/>' +
      '<path d="M34,-6 Q46,10 34,30 Q30,10 30,-6 Z" fill="#b48fd6"/>' +
      '<path d="M-26,-40 l10,-14 l6,14 Z" fill="#c9a8e6"/>' +
      '<path d="M26,-40 l-10,-14 l-6,14 Z" fill="#c9a8e6"/>' +
      '<circle cx="-13" cy="-14" r="14" fill="#fdfdfd"/>' +
      '<circle cx="13" cy="-14" r="14" fill="#fdfdfd"/>' +
      '<circle class="bagoly-pupilla" cx="-11" cy="-12" r="6.5" fill="#4a3b7a"/>' +
      '<circle class="bagoly-pupilla" cx="11" cy="-12" r="6.5" fill="#4a3b7a"/>' +
      '<circle cx="-13" cy="-15" r="2" fill="#fff"/><circle cx="9" cy="-15" r="2" fill="#fff"/>' +
      '<path d="M-5,-2 L5,-2 L0,10 Z" fill="#ffcf6b"/>' +
      '<path d="M-30,44 l-6,10 M-22,46 l-2,10 M22,46 l2,10 M30,44 l6,10" stroke="#ffcf6b" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M18,-44 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2 Z" fill="#fff2c4"/>' +
    '</g>' +
  '</svg>';
}

var NEZ_SZ = 900, NEZ_MA = 460;
/* TESZT (pálya 2): kamera nélküli, teljes-út nézet. A jelenet-render állítja be. */
var SCENE_TELJES = false, SCENE_N = 8;
var TU_X0 = 78, TU_X1 = 1092;
function allomasX(i) {
  if (SCENE_TELJES) return TU_X0 + i * (TU_X1 - TU_X0) / Math.max(1, SCENE_N - 1);
  return 150 + i * 260;
}
function allomasY(i) {
  if (SCENE_TELJES) {
    var t = SCENE_N > 1 ? i / (SCENE_N - 1) : 0;
    return (418 - t * 176) + (i % 2 ? 40 : -40);   /* fölfelé sodródó cikk-cakk a 200–460 sávban */
  }
  return 262 + 20 * Math.sin(i * 0.9);
}
/* kamera nélküli, egyképernyős térkép — a teljes út (Rajt → Cél) egyszerre látszik,
   az unikornis továbbra is állomásról állomásra sétál rajta (mockup-terkep-teljes-ut.html). */
function jelenetSVGteljes(palya, c) {
  var n = palya.allomasok.length;
  var px = [], py = [];
  for (var k = 0; k < n; k++) { px.push(allomasX(k)); py.push(allomasY(k)); }
  var utD = "M " + px[0].toFixed(1) + " " + py[0].toFixed(1);
  for (var i = 1; i < n; i++) {
    var dx = px[i] - px[i - 1];
    utD += " C " + (px[i - 1] + dx / 2).toFixed(1) + " " + py[i - 1].toFixed(1) +
           " " + (px[i] - dx / 2).toFixed(1) + " " + py[i].toFixed(1) +
           " " + px[i].toFixed(1) + " " + py[i].toFixed(1);
  }
  /* háttér: ég + nap + felhők + dombsávok */
  var s = '<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="tu-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdeaf7"/><stop offset="0.6" stop-color="#dff2e2"/><stop offset="1" stop-color="#eaf6df"/></linearGradient></defs>' +
    '<rect x="0" y="0" width="1200" height="560" fill="url(#tu-eg)"/>' +
    '<circle cx="1086" cy="72" r="66" fill="#fff6d0" opacity="0.5"/><circle cx="1086" cy="72" r="26" fill="#fff2b8" opacity="0.9"/>' +
    '<g fill="#ffffff" opacity="0.55"><ellipse cx="220" cy="70" rx="46" ry="16"/><ellipse cx="255" cy="62" rx="30" ry="13"/><ellipse cx="640" cy="50" rx="38" ry="14"/><ellipse cx="670" cy="58" rx="24" ry="10"/></g>' +
    '<path d="M0 335 Q150 305 300 330 Q460 355 620 325 Q800 295 960 330 Q1100 353 1200 330 L1200 560 L0 560 Z" fill="#cdeac0" opacity="0.7"/>' +
    '<path d="M0 378 Q200 353 420 383 Q650 413 880 378 Q1050 353 1200 383 L1200 560 L0 560 Z" fill="#bfe3a0"/>' +
    '<path d="M0 420 Q220 400 460 425 Q700 450 940 418 Q1080 400 1200 422 L1200 560 L0 560 Z" fill="#aedb8e" opacity="0.85"/>';
  /* fák CSAK a kereten (fönt/oldalt), középen szabad az út */
  function fa(x, y, m) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + m + ')">' +
      '<rect x="-8" y="14" width="16" height="46" fill="#a9805e"/>' +
      '<circle cx="0" cy="0" r="36" fill="#5a9a4a"/><circle cx="-24" cy="16" r="27" fill="#6bb156"/><circle cx="24" cy="16" r="27" fill="#4f8f42"/>' +
      '<circle cx="-10" cy="-14" r="14" fill="#a8d998"/></g>';
  }
  s += fa(80, 150, 1.15) + fa(150, 300, 0.8) + fa(60, 470, 1) +
       fa(1130, 130, 1.1) + fa(1150, 330, 0.85) + fa(1120, 500, 1) +
       fa(430, 250, 0.62) + fa(720, 235, 0.6) + fa(980, 250, 0.66);
  /* bagoly beljebb egy ágon */
  s += '<g transform="translate(190,220)">' +
    '<path d="M0 4 Q-40 10 -76 2" stroke="#8f6a3e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="-16" rx="17" ry="19" fill="#c9a06a"/><ellipse cx="0" cy="-10" rx="12" ry="12" fill="#e9d3ad"/>' +
    '<path d="M-15 -28 l6 10 l6 -6 Z" fill="#c9a06a"/><path d="M15 -28 l-6 10 l-6 -6 Z" fill="#c9a06a"/>' +
    '<circle cx="-6" cy="-20" r="5" fill="#fff"/><circle cx="6" cy="-20" r="5" fill="#fff"/>' +
    '<circle cx="-6" cy="-20" r="2.3" fill="#4a3b2a"/><circle cx="6" cy="-20" r="2.3" fill="#4a3b2a"/>' +
    '<path d="M0 -14 l-3 4 l6 0 Z" fill="#e8a23d"/></g>';
  /* az út: árnyék + test + világos szegély */
  s += '<g id="kamera">' +
    '<path d="' + utD + '" transform="translate(4,10)" fill="none" stroke="#3b6a30" stroke-width="34" stroke-linecap="round" opacity="0.16"/>' +
    '<path d="' + utD + '" fill="none" stroke="#d9b48a" stroke-width="30" stroke-linecap="round"/>' +
    '<path d="' + utD + '" fill="none" stroke="#f0dcb0" stroke-width="20" stroke-linecap="round"/>';
  /* állomások + Rajt-zászló + Cél-odú */
  for (var s2 = 0; s2 < n; s2++) {
    var ax = px[s2], ay = py[s2], utolso = (s2 === n - 1);
    if (s2 === 0) {
      s += '<g transform="translate(' + ax + ',' + ay + ')"><circle r="15" fill="#a7d99a" stroke="#222" stroke-width="2"/>' +
        '<path d="M0 -24 L0 -2" stroke="#8f6a3e" stroke-width="3"/><path d="M0 -24 L15 -17 L0 -10 Z" fill="#f6a5c0"/></g>';
    } else if (!utolso) {
      s += '<g transform="translate(' + ax + ',' + (ay - 44) + ')">' +
        '<rect x="-58" y="-16" width="116" height="32" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
        '<text x="0" y="5" font-size="14" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[s2].nev) + '</text></g>' +
        '<rect x="' + (ax - 4) + '" y="' + (ay - 30) + '" width="8" height="30" fill="#b79c86"/>' +
        '<circle cx="' + ax + '" cy="' + ay + '" r="14" fill="#f6c85a" stroke="#222" stroke-width="2"/>';
    }
    s += '<g class="allomas-pipa" id="pipa-' + s2 + '" transform="translate(' + ax + ',' + ay + ')" opacity="0"><circle r="12" fill="#a7d99a"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  /* Cél-odú az utolsó pont mögött-fölött */
  var cx = px[n - 1] + 62, cy = py[n - 1] - 6;
  s += '<g transform="translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ')">' +
    '<ellipse cx="0" cy="34" rx="60" ry="16" fill="#2f4a3a" opacity="0.3"/>' +
    '<path d="M-44,40 C-44,-30 -28,-70 0,-78 C28,-70 44,-30 44,40 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="-6" rx="23" ry="30" fill="#3a2a20"/><ellipse cx="0" cy="0" rx="16" ry="23" fill="#ffe9ad"/><ellipse cx="0" cy="8" rx="9" ry="13" fill="#fff6d8"/>' +
    csillagSVG(0, -86, 9, "#ffe08a") + '</g>';
  s += '<ellipse id="mosti-ko" cx="' + px[0].toFixed(1) + '" cy="' + (py[0] + 8).toFixed(1) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
    '<g id="unikornis-hely" transform="translate(' + px[0].toFixed(1) + ',' + py[0].toFixed(1) + ')">' + unikornisSVG("uni", c, 0.62, P().oltozet) + '</g>' +
    '</g></svg>';
  return s;
}
function jelenetSVG(palya, lenyKulcs) {
  /* MINDEN pálya a kamera nélküli, egyképernyős teljes-út nézetet kapja (producer-döntés,
     2026-09-06). A régi kamerás nézet csak akkor fut, ha egy pálya kifejezetten teljes_ut:false. */
  SCENE_TELJES = (palya.teljes_ut !== false);
  SCENE_N = palya.allomasok.length;
  if (SCENE_TELJES) return jelenetSVGteljes(palya, LENYEK[lenyKulcs]);
  var n = palya.allomasok.length;
  var szelesseg = allomasX(n - 1) + 260;
  var c = LENYEK[lenyKulcs];
  var utD = "M " + allomasX(0) + " " + (allomasY(0) + 4);
  for (var i = 1; i < n; i++) {
    var mx = (allomasX(i - 1) + allomasX(i)) / 2, my = (allomasY(i - 1) + allomasY(i)) / 2 + 30;
    utD += " Q " + mx + " " + my + " " + allomasX(i) + " " + (allomasY(i) + 4);
  }
  var fak = "";
  for (var f = 0; f < szelesseg; f += 200) {
    var fx = f + ((f / 200) % 2 ? 70 : 130), fy = 210 + ((f / 200) % 3) * 12;
    fak += '<g transform="translate(' + fx + ',' + fy + ')">' +
      '<rect x="-7" y="18" width="14" height="40" fill="#a9805e"/>' +
      '<circle cx="0" cy="0" r="34" fill="#8fca7e"/><circle cx="-22" cy="16" r="26" fill="#8fca7e"/><circle cx="22" cy="16" r="26" fill="#8fca7e"/>' +
      '<circle cx="-10" cy="-12" r="13" fill="#a8d998"/>' +
      '</g>';
  }
  var allomasok = "";
  for (var s = 0; s < n; s++) {
    var ax = allomasX(s), ay = allomasY(s);
    allomasok +=
      '<ellipse cx="' + ax + '" cy="' + (ay + 8) + '" rx="30" ry="14" fill="#cbb6e6" stroke="#b298da" stroke-width="2.5"/>' +
      '<rect x="' + (ax - 4) + '" y="' + (ay - 36) + '" width="8" height="42" fill="#b79c86"/>' +
      '<g transform="translate(' + ax + ',' + (ay - 46) + ')">' +
        '<rect x="-58" y="-16" width="116" height="32" rx="12" fill="#fdf4d8" stroke="#c9a8e6" stroke-width="2.5"/>' +
        '<text x="0" y="5" font-size="14" font-family="Fredoka,sans-serif" fill="#6a4a8a" text-anchor="middle">' + kiiras(palya.allomasok[s].nev) + '</text>' +
      '</g>' +
      '<g class="allomas-pipa" id="pipa-' + s + '" transform="translate(' + ax + ',' + (ay - 2) + ')" opacity="0"><circle r="12" fill="#a7d99a"/><path d="M-5,0 l3,4 l7,-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  }
  var celX = allomasX(n - 1) + 150, celY = allomasY(n - 1) + 6;
  var cel =
    '<g transform="translate(' + celX + ',' + celY + ')">' +
      '<ellipse cx="0" cy="36" rx="72" ry="18" fill="#2f4a3a" opacity="0.35"/>' +
      '<path d="M-48,42 C-48,-32 -30,-74 0,-82 C30,-74 48,-32 48,42 Z" fill="#8a6242" stroke="' + KOR + '" stroke-width="2.5"/>' +
      '<ellipse cx="0" cy="-6" rx="25" ry="33" fill="#3a2a20"/>' +
      '<ellipse cx="0" cy="0" rx="18" ry="25" fill="#ffe9ad"/>' +
      '<ellipse cx="0" cy="8" rx="10" ry="14" fill="#fff6d8"/>' +
      csillagSVG(0, -92, 9, "#ffe08a") +
    '</g>';
  return '' +
  '<svg viewBox="0 0 ' + NEZ_SZ + ' ' + NEZ_MA + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="0" y="0" width="' + NEZ_SZ + '" height="' + NEZ_MA + '" fill="#d6e6f6"/>' +
    '<circle cx="' + (NEZ_SZ - 90) + '" cy="70" r="46" fill="#fdeeb6" opacity="0.5"/>' +
    '<g id="kamera">' +
      '<path d="M-100 284 Q ' + (szelesseg / 2) + ' 252 ' + (szelesseg + 100) + ' 284 L ' + (szelesseg + 100) + ' 460 L -100 460 Z" fill="#bfe0a6"/>' +
      '<path d="M-100 322 Q ' + (szelesseg / 2) + ' 294 ' + (szelesseg + 100) + ' 322 L ' + (szelesseg + 100) + ' 460 L -100 460 Z" fill="#a9d68f"/>' +
      fak +
      '<path d="' + utD + '" fill="none" stroke="#dcc79a" stroke-width="48" stroke-linecap="round"/>' +
      '<path d="' + utD + '" fill="none" stroke="#ead9b0" stroke-width="38" stroke-linecap="round"/>' +
      allomasok + cel +
      '<ellipse id="mosti-ko" cx="' + allomasX(0) + '" cy="' + (allomasY(0) + 8) + '" rx="40" ry="20" fill="none" stroke="#ffe08a" stroke-width="4" opacity="0.9"/>' +
      '<g id="unikornis-hely" transform="translate(' + allomasX(0) + ',' + allomasY(0) + ')">' + unikornisSVG("uni", c, 0.66, P().oltozet) + '</g>' +
    '</g>' +
  '</svg>';
}
function kiiras(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }


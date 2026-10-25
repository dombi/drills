/* ============ 6h3b) 🪨 FELVESZ – LETESZ: a közös rész (a jelenet-motor és a 📸 Fotóalbum is ezt használja) ============
   Húzás sehol nincs (touchpad): az első koppintás felveszi, a második leteszi. Ez a modul csak a közös számolást adja:
     • fvPont(svg, e)  — a mutató helye az SVG saját koordinátáiban (a viewBox szerint, CSS-transzformokkal együtt)
     • fvLegkozelebbi(svg, sel, attr, e) — a mutató alatti legközelebbi letehető hely (a jelenet-motor köreihez:
       a hely köre és még egy fél kör számít), visszaadja a hely `attr` attribútumát, vagy null
   A „szabad helyre tevés” (album) nem keres helyet: oda kerül, ahová a gyerek koppint (fvPont). */
function fvPont(svg, e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function fvLegkozelebbi(svg, sel, attr, e) {
  var cel = null, legjobb = Infinity;
  [].forEach.call(svg.querySelectorAll(sel), function (h) {
    var r = h.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
    if (d < Math.max(r.width, r.height) * .85 && d < legjobb) { legjobb = d; cel = h.getAttribute(attr); }
  });
  return cel;
}

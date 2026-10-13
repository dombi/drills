/* 🤖 Gépi próba — egy képernyő látható szövege blokkonként (a szöveg-őrnek). A szöveg a legközelebbi
   blokk-szülőhöz tartozik; a gomb / beíró mező / felirat külön blokk, a soron belüli kiemelés (span, b) nem. */
function blokkSzovegek(gyoker) {
  if (!gyoker) return [];
  var tabla = new Map(), sor = [], w = document.createTreeWalker(gyoker, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) {
    var p = n.parentElement;
    if (!n.nodeValue.trim() || !p || !p.getClientRects().length || p.closest("svg, script, style")) continue;
    var b = p;
    while (b !== gyoker && !/^(BUTTON|LABEL|SELECT|OPTION|LI|TD|TH)$/.test(b.tagName) &&
           /^inline/.test(getComputedStyle(b).display)) b = b.parentElement;
    if (!tabla.has(b)) { tabla.set(b, []); sor.push(b); }
    tabla.get(b).push(n.nodeValue);
  }
  var ki = [];
  sor.forEach(function (b) { var s = tabla.get(b).join("").replace(/\s+/g, " ").trim(); if (s && ki.indexOf(s) < 0) ki.push(s); });
  return ki;
}

// Wytłaczanka w hero: +1 / −1 jak na ekranie „Dziś” w aplikacji. Teksty z atrybutów data-* (EN/PL).
(function () {
  var box = document.querySelector('[data-carton]');
  if (!box) return;
  var cells = box.querySelectorAll('.cell');
  var out = box.querySelector('output');
  var label = box.querySelector('[data-label]');
  var foot = box.querySelector('[data-foot]');
  var minus = box.querySelector('[data-minus]');
  var plus = box.querySelector('[data-plus]');
  var colors = ['brown', 'cream', 'white', 'olive', 'brown', 'dark', 'cream', 'white', 'brown', 'olive', 'cream', 'dark'];
  var max = cells.length;
  var count = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function plural(n) {
    if (box.dataset.lang === 'pl') {
      if (n === 1) return box.dataset.one;
      var d = n % 10, h = n % 100;
      return d >= 2 && d <= 4 && (h < 12 || h > 14) ? box.dataset.few : box.dataset.many;
    }
    return n === 1 ? box.dataset.one : box.dataset.many;
  }

  function render(added) {
    out.value = count;
    out.textContent = count;
    label.textContent = plural(count);
    minus.disabled = count === 0;
    plus.disabled = count === max;
    foot.innerHTML = count === max ? box.dataset.full : box.dataset.hint;
    if (added) {
      var cell = cells[count - 1];
      var egg = document.createElement('span');
      egg.className = 'egg' + (reduce ? '' : ' drop');
      egg.style.background = 'var(--egg-' + colors[count - 1] + ')';
      cell.appendChild(egg);
    }
  }

  var timer = null;
  function stopIntro() { if (timer) { clearInterval(timer); timer = null; } }
  plus.addEventListener('click', function () { stopIntro(); if (count < max) { count++; render(true); } });
  minus.addEventListener('click', function () {
    stopIntro();
    if (count > 0) { var e = cells[count - 1].firstChild; if (e) e.remove(); count--; render(false); }
  });

  // Jedno uruchomienie przy wejściu: siedem jajek, jak w zwykły poranek.
  var start = Number(box.dataset.start || 7);
  if (reduce) { while (count < start) { count++; render(true); } return; }
  render(false);
  timer = setInterval(function () {
    if (count >= start || count >= max) { stopIntro(); return; }
    count++; render(true);
  }, 140);
})();

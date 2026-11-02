// YoursTutor — site behaviour
(function () {
  document.documentElement.classList.add('js');

  var WHATSAPP_NUMBER = '917907041628';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('nav-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header border once the page is scrolled; timeline progress
  var timeline = document.getElementById('timeline');
  var tlFill = document.getElementById('tl-fill');
  var tlSteps = timeline ? timeline.querySelectorAll('.tl-step') : [];
  function onScroll() {
    document.body.classList.toggle('scrolled', window.scrollY > 8);
    if (!timeline) return;
    // fill the line up to the point 60% down the viewport
    var rect = timeline.getBoundingClientRect();
    var mark = window.innerHeight * 0.6;
    var progress = Math.max(0, Math.min(1, (mark - rect.top) / rect.height));
    tlFill.style.height = progress * 100 + '%';
    tlSteps.forEach(function (step) {
      step.classList.toggle('active', step.getBoundingClientRect().top + 28 < mark);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Marquees: duplicate the content so the loop is seamless
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  });

  // Count-up numbers in the stats bar
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    if (reduceMotion) return;
    var start = null;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  // Hero transformation wheel
  var orbit = document.getElementById('orbit');
  if (orbit) {
    var oItems = orbit.querySelectorAll('.o-item');
    var story = document.getElementById('orbit-story');
    var n = oItems.length;
    var stepDeg = 360 / n;
    var turn = 0; // total steps taken; keeps growing so the wheel never spins backwards to wrap
    var current = 0;
    var timer = null;
    var paused = false;

    oItems.forEach(function (item, i) {
      item.style.setProperty('--a', i * stepDeg + 'deg');
      item.setAttribute('aria-label', item.dataset.name + ', ' + item.dataset.grade + ': ' +
        item.dataset.before + ' to ' + item.dataset.after);
      item.addEventListener('click', function () { goTo(i); restart(); });
    });

    function show(i) {
      var d = oItems[i].dataset;
      oItems.forEach(function (it, j) { it.classList.toggle('is-active', j === i); });
      story.classList.add('swap');
      setTimeout(function () {
        story.querySelector('.os-name').textContent = d.name;
        story.querySelector('.os-grade').textContent = d.grade;
        story.querySelector('.os-before').textContent = d.before;
        story.querySelector('.os-after').textContent = d.after;
        story.classList.remove('swap');
      }, reduceMotion ? 0 : 350);
    }

    function goTo(i) {
      // shortest way round to bring photo i to the top
      var delta = ((i - current) % n + n) % n;
      if (delta > n / 2) delta -= n;
      turn += delta;
      current = i;
      orbit.style.setProperty('--rot', -turn * stepDeg + 'deg');
      show(i);
    }

    function next() { if (!paused) goTo((current + 1) % n); }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(next, 3200);
    }

    orbit.addEventListener('mouseenter', function () { paused = true; });
    orbit.addEventListener('mouseleave', function () { paused = false; });
    orbit.addEventListener('focusin', function () { paused = true; });
    orbit.addEventListener('focusout', function () { paused = false; });

    // swipe left/right on touch screens
    var startX = null;
    orbit.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    orbit.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      goTo((current + (dx < 0 ? 1 : n - 1)) % n);
      restart();
    });

    show(0);
    restart();
  }

  // Programme tabs
  var tabs = document.querySelectorAll('[role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  // Video testimonials (list lives in js/testimonials.js)
  var videos = window.TESTIMONIALS || [];
  var videoRow = document.getElementById('video-row');
  if (videos.length && videoRow) {
    videos.forEach(function (t) { videoRow.appendChild(videoCard(t)); });
    document.getElementById('videos').hidden = false;
  }

  function youtubeId(url) {
    var m = String(url).match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/|live\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(url) ? url : null);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function videoCard(t) {
    var ytId = t.youtube ? youtubeId(t.youtube) : null;
    // Shorts and video files are usually phone-shaped; normal YouTube videos are wide
    var shape = t.shape || (ytId && !/shorts\//.test(t.youtube) ? 'horizontal' : 'vertical');
    var card = el('article', 'v-card reveal ' + (shape === 'horizontal' ? 'v-horizontal' : 'v-vertical'));
    var media = el('button', 'v-media');
    media.type = 'button';
    media.setAttribute('aria-label', 'Play video: ' + (t.name || 'testimonial'));

    if (ytId) {
      var img = el('img');
      img.src = 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg';
      img.alt = '';
      img.loading = 'lazy';
      media.appendChild(img);
    } else if (t.poster) {
      var poster = el('img');
      poster.src = t.poster;
      poster.alt = '';
      poster.loading = 'lazy';
      media.appendChild(poster);
    } else if (t.video) {
      // no cover image: show the first frame of the file
      var preview = el('video');
      preview.src = t.video + '#t=0.1';
      preview.preload = 'metadata';
      preview.muted = true;
      preview.setAttribute('playsinline', '');
      media.appendChild(preview);
    }
    media.appendChild(el('span', 'v-play'));

    media.addEventListener('click', function () {
      var player;
      if (ytId) {
        player = el('iframe');
        player.src = 'https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0&playsinline=1';
        player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
        player.title = t.name || 'Video testimonial';
      } else {
        player = el('video');
        player.src = t.video;
        if (t.poster) player.poster = t.poster;
        player.controls = true;
        player.autoplay = true;
        player.setAttribute('playsinline', '');
      }
      player.className = 'v-player';
      media.replaceWith(player);
    });

    card.appendChild(media);
    var info = el('div', 'v-info');
    if (t.quote) info.appendChild(el('p', 'v-quote', '“' + t.quote + '”'));
    info.appendChild(el('h4', null, t.name));
    if (t.detail) info.appendChild(el('p', 'v-detail', t.detail));
    card.appendChild(info);
    return card;
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // stagger siblings that enter together
        var siblings = Array.prototype.filter.call(entry.target.parentElement.children, function (el) {
          return el.classList.contains('reveal');
        });
        var i = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo form -> WhatsApp message
  var form = document.getElementById('demo-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var lines = [
      'Hi YoursTutor, I would like to book a FREE demo class.',
      '',
      'Name: ' + d.get('name'),
      'Class / course: ' + d.get('class'),
      'Subject(s): ' + (d.get('subject') || '-'),
      'Mode: ' + d.get('mode'),
      'Phone: ' + d.get('phone')
    ];
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* ═══════════════════════════════════════════════
   BAWISH WEDS MAHALAXSHMI — main.js (Enhanced)
═══════════════════════════════════════════════ */

/* ─── FLOATING PETALS (landing screen) ──────── */
function spawnPetals() {
  const landing = document.getElementById('landing');
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 6 + Math.random() * 8;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size * 1.5}px;
      opacity: ${0.2 + Math.random() * 0.4};
      animation-duration: ${8 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 12}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    `;
    landing.appendChild(p);
  }
}
spawnPetals();

/* ─── ENVELOPE OPEN ─────────────────────────── */
const landing   = document.getElementById('landing');
const mainSite  = document.getElementById('mainSite');
const openBtn   = document.getElementById('openEnvelope');

function openSite() {
  // Burst extra petals on click
  const burstPetals = 22;
  for (let i = 0; i < burstPetals; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 5 + Math.random() * 10;
    p.style.cssText = `
      left: ${30 + Math.random() * 40}%;
      top: ${20 + Math.random() * 40}%;
      width: ${size}px;
      height: ${size * 1.6}px;
      opacity: ${0.4 + Math.random() * 0.5};
      animation-duration: ${3 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 0.8}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
      position: absolute;
    `;
    landing.appendChild(p);
  }

  // Begin slow fade sequence
  landing.classList.add('fade-out');

  // Reveal main site after the long dissolve
  setTimeout(() => {
    landing.style.display = 'none';
    mainSite.classList.remove('hidden');

    // Stagger hero elements with slow, graceful delays
    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el, i) => {
      el.style.animationDelay = `${0.3 + i * 0.45}s`;
      el.style.animationPlayState = 'running';
    });

    startCountdown();
    observeReveal();
    initGallery();
  }, 3400);
}

openBtn.addEventListener('click', openSite);
openBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') openSite();
});

/* ─── COUNTDOWN ─────────────────────────────── */
function startCountdown() {
  const wedding = new Date('2026-06-18T06:00:00');
  let prevVals = {};

  const tick = () => {
    const now  = new Date();
    const diff = wedding - now;
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<span style="font-family:var(--font-serif);font-style:italic;color:var(--gold-lt);font-size:1.4rem">Today is the day! 🎉</span>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const vals = { days: d, hours: h, mins: m, secs: s };
    const ids  = { days: 'cd-days', hours: 'cd-hours', mins: 'cd-mins', secs: 'cd-secs' };

    for (const key in vals) {
      const el = document.getElementById(ids[key]);
      const val = String(vals[key]).padStart(2, '0');
      if (val !== prevVals[key]) {
        el.textContent = val;
        const item = el.closest('.cd-item');
        item.classList.remove('tick');
        void item.offsetWidth; // reflow
        item.classList.add('tick');
        prevVals[key] = val;
      }
    }
  };
  tick();
  setInterval(tick, 1000);
}

/* ─── NAV SCROLL ────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── HAMBURGER ─────────────────────────────── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('mobileNavClose').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── SCROLL REVEAL ─────────────────────────── */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('visible');
        }, idx * 90);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
}

/* ─── GALLERY / LIGHTBOX ────────────────────── */
const galleryImages = [
  { src: 'images/embrace.jpg',  alt: 'Close' },
  { src: 'images/forest.jpg',   alt: 'Forest Walk' },
  { src: 'images/hands.jpg',    alt: 'Together' },
  { src: 'images/hero.jpg',     alt: 'Facing Forever' },
  { src: 'images/lawn.jpg',     alt: 'Sunlit Days' },
  { src: 'images/playful.jpg',  alt: 'Playful Hearts' },
  { src: 'images/portrait.jpg', alt: 'Us' },
];

let currentImg = 0;

function initGallery() {
  const items   = document.querySelectorAll('.gallery-item');
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');

  function animateImg(src, alt) {
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      lbImg.src = src;
      lbImg.alt = alt;
      lbImg.style.transition = 'opacity 0.3s, transform 0.3s';
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    }, 180);
  }

  const showLb = (idx) => {
    currentImg = idx;
    lbImg.src  = galleryImages[idx].src;
    lbImg.alt  = galleryImages[idx].alt;
    lbImg.style.opacity = '1';
    lbImg.style.transform = 'scale(1)';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const hideLb = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => showLb(parseInt(item.dataset.index ?? i)));
  });
  lbClose.addEventListener('click', hideLb);
  lb.addEventListener('click', e => { if (e.target === lb) hideLb(); });

  lbPrev.addEventListener('click', e => {
    e.stopPropagation();
    currentImg = (currentImg - 1 + galleryImages.length) % galleryImages.length;
    animateImg(galleryImages[currentImg].src, galleryImages[currentImg].alt);
  });
  lbNext.addEventListener('click', e => {
    e.stopPropagation();
    currentImg = (currentImg + 1) % galleryImages.length;
    animateImg(galleryImages[currentImg].src, galleryImages[currentImg].alt);
  });

  // Swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      currentImg = dx < 0
        ? (currentImg + 1) % galleryImages.length
        : (currentImg - 1 + galleryImages.length) % galleryImages.length;
      animateImg(galleryImages[currentImg].src, galleryImages[currentImg].alt);
    }
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') hideLb();
    if (e.key === 'ArrowLeft') {
      currentImg = (currentImg - 1 + galleryImages.length) % galleryImages.length;
      animateImg(galleryImages[currentImg].src, galleryImages[currentImg].alt);
    }
    if (e.key === 'ArrowRight') {
      currentImg = (currentImg + 1) % galleryImages.length;
      animateImg(galleryImages[currentImg].src, galleryImages[currentImg].alt);
    }
  });
}

/* ─── DOWNLOAD INVITATION ───────────────────── */
document.getElementById('downloadInvBtn').addEventListener('click', async function () {
  const btn  = this;
  const card = document.getElementById('invitationCard');

  btn.textContent = '⏳ Preparing…';
  btn.classList.add('downloading');
  btn.disabled = true;

  try {
    // Wait a tick so button state renders
    await new Promise(r => setTimeout(r, 60));

    if (typeof html2canvas === 'undefined') {
      throw new Error('html2canvas not loaded');
    }

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F0E8D8',
      logging: false,
      removeContainer: true,
      imageTimeout: 8000,
      onclone: (doc) => {
        // Make sure invitation card is fully visible in clone
        const clonedCard = doc.getElementById('invitationCard');
        if (clonedCard) {
          clonedCard.style.transform = 'none';
          clonedCard.style.boxShadow = 'none';
        }
      }
    });

    canvas.toBlob(blob => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'Bawish-Mahalakshmi-Invitation.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }, 'image/png');

    btn.textContent = '✓ Downloaded!';
    setTimeout(() => {
      btn.textContent = '⬇ Download Invitation';
      btn.classList.remove('downloading');
      btn.disabled = false;
    }, 2500);

  } catch (err) {
    console.error('Download error:', err);
    btn.textContent = '⬇ Download Invitation';
    btn.classList.remove('downloading');
    btn.disabled = false;
    alert('Screenshot the invitation or right-click the card to save the image directly. (html2canvas may not be loaded yet — try refreshing.)');
  }
});

/* ─── PARALLAX ON HERO IMAGES ───────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroImgs = document.querySelectorAll('.hero-img img');
  heroImgs.forEach(img => {
    img.style.transform = `translateY(${scrolled * 0.08}px)`;
  });
}, { passive: true });

/* ─── MUSIC PLAYER ───────────────────────────── */
(function () {
  /* 
    Tracks: Free-to-use Tamil/Indian classical wedding music from
    public domain / CC sources via archive.org streams.
    Using direct mp3 links that work without CORS issues.
  */
  const tracks = [
    {
      label: 'Wedding',
      title: 'Wedding Song',
      sub: 'Bawish & Mahalakshmi',
      src: 'assets/audio/Wedding.mp3',
    },
  ];

  const fallbackSrc = 'assets/audio/Wedding.mp3';

  let currentTrack = 0;
  let isPlaying = false;

  // Build player HTML
  const player = document.createElement('div');
  player.className = 'music-player';
  player.id = 'musicPlayer';
  player.innerHTML = `
    <button class="music-btn" id="musicPlayBtn" aria-label="Play / Pause music" title="Play / Pause">
      <span class="btn-icon">♪</span>
    </button>
    <div class="music-info">
      <span class="music-title" id="musicTitle">${tracks[0].title}</span>
      <span class="music-subtitle" id="musicSub">${tracks[0].sub}</span>
    </div>
    <div class="music-eq" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="music-vol">
      <span class="music-vol-icon" id="muteBtn" title="Mute">🔊</span>
      <input class="music-vol-slider" id="volSlider" type="range" min="0" max="1" step="0.05" value="0.5" aria-label="Volume"/>
    </div>
  `;
  document.body.appendChild(player);

  // Audio element
  const audio = new Audio();
  audio.volume = 0.5;
  audio.loop = true;
  audio.preload = 'none';

  function loadTrack(idx, autoplay) {
    currentTrack = idx;
    audio.src = tracks[idx].src;
    document.getElementById('musicTitle').textContent = tracks[idx].title;
    document.getElementById('musicSub').textContent   = tracks[idx].sub;

    // Update pill selection if track pills exist
    document.querySelectorAll('.track-pill').forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    if (autoplay) {
      playAudio();
    }
  }

  function playAudio() {
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isPlaying = true;
          player.classList.add('playing');
          document.getElementById('musicPlayBtn').querySelector('.btn-icon').textContent = '❚❚';
        })
        .catch(() => {
          // Autoplay blocked or src failed — try fallback
          if (audio.src !== fallbackSrc) {
            audio.src = fallbackSrc;
            audio.play().then(() => {
              isPlaying = true;
              player.classList.add('playing');
              document.getElementById('musicPlayBtn').querySelector('.btn-icon').textContent = '❚❚';
              document.getElementById('musicTitle').textContent = 'Ambient Piano';
              document.getElementById('musicSub').textContent = 'Wedding Mood';
            }).catch(() => {});
          }
        });
    }
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    player.classList.remove('playing');
    document.getElementById('musicPlayBtn').querySelector('.btn-icon').textContent = '♪';
  }

  // Play/pause button
  document.getElementById('musicPlayBtn').addEventListener('click', () => {
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(currentTrack, true);
    } else if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // Volume slider
  document.getElementById('volSlider').addEventListener('input', function () {
    audio.volume = parseFloat(this.value);
    document.getElementById('muteBtn').textContent = audio.volume === 0 ? '🔇' : '🔊';
  });

  // Mute toggle
  document.getElementById('muteBtn').addEventListener('click', () => {
    audio.muted = !audio.muted;
    document.getElementById('muteBtn').textContent = audio.muted ? '🔇' : '🔊';
  });

  // Auto-start with gentle fade-in when user first interacts with the page
  let started = false;
  function tryAutoStart() {
    if (started) return;
    started = true;
    loadTrack(0, true);
    // Fade in volume
    audio.volume = 0;
    document.getElementById('volSlider').value = 0;
    const fadeIn = setInterval(() => {
      if (audio.volume < 0.45) {
        audio.volume = Math.min(0.45, audio.volume + 0.04);
        document.getElementById('volSlider').value = audio.volume;
      } else {
        clearInterval(fadeIn);
      }
    }, 120);
  }

  // Try to play when envelope is opened (user gesture)
  const origOpenBtn = document.getElementById('openEnvelope');
  if (origOpenBtn) {
    origOpenBtn.addEventListener('click', tryAutoStart, { once: true });
  }

  // Also try on any first click/touch as fallback
  document.addEventListener('click', tryAutoStart, { once: true });
  document.addEventListener('touchstart', tryAutoStart, { once: true, passive: true });

  // Error fallback — if track fails, try next
  audio.addEventListener('error', () => {
    if (audio.src !== fallbackSrc) {
      audio.src = fallbackSrc;
      if (isPlaying) audio.play().catch(() => {});
    }
  });
})();

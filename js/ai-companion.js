  // ── Intersection observer for reveal animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Immediately show elements already in viewport on load
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });

  // ── Timeline path draw-on-scroll ──
  const tlPath = document.getElementById('tl-path');
  const tlSection = document.getElementById('timeline');

  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        tlPath.style.transition = 'stroke-dashoffset 2s ease';
        tlPath.style.strokeDashoffset = '0';
        tlObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  tlObserver.observe(tlSection);

  // ── Timeline ↔ stage card cross-highlighting (bidirectional) ──
  const setStageActive = (stage, on) => {
    document.querySelectorAll(`[data-stage="${stage}"]`).forEach(el => {
      el.classList.toggle('active', on);
    });
  };

  document.querySelectorAll('.tl-dot, .stage-card').forEach(el => {
    const stage = el.dataset.stage;
    if (stage == null) return;
    el.addEventListener('mouseenter', () => setStageActive(stage, true));
    el.addEventListener('mouseleave', () => setStageActive(stage, false));
  });

  // ── Influences SVG animate arcs on scroll ──
  const arcs = document.querySelectorAll('#influences-svg ellipse');
  const infObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        arcs.forEach((arc, i) => {
          arc.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
          arc.style.opacity = '1';
          arc.style.transform = 'scaleY(1)';
        });
        infObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  arcs.forEach(arc => { arc.style.opacity = '0'; arc.style.transform = 'scaleY(0.6)'; arc.style.transformOrigin = 'bottom'; });
  infObserver.observe(document.getElementById('influences'));

  // ── Keyboard: ArrowDown / PageDown scroll to next <section> ──
  // ── DOMContentLoaded: roll-in image and animate only title elements ──
  document.addEventListener('DOMContentLoaded', async () => {
    const img = document.querySelector('#ai-image');

    const vw = window.innerWidth || document.documentElement.clientWidth || 1024;
    const startX = Math.round(vw * 1.1);
    const endX = Math.round(-vw * 0.45);

    if (!window.gsap) {
      console.warn('GSAP not loaded — using vanilla JS for animations.');
      if (img) {
        img.style.opacity = '0';
        img.style.transform = `translate(-50%, -50%) translateX(${startX}px) rotate(0deg)`;
        if (img.animate) {
          const imgAnim = img.animate([
            { transform: `translate(-50%, -50%) translateX(${startX}px) rotate(0deg)`, opacity: 0 },
            { transform: `translate(-50%, -50%) translateX(${endX}px) rotate(720deg)`, opacity: 0.45 }
          ], { duration: 1200, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' });
          await imgAnim.finished;
        } else {
          img.style.transition = 'transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 1.2s ease';
          img.getBoundingClientRect();
          img.style.transform = `translate(-50%, -50%) translateX(${endX}px) rotate(720deg)`;
          img.style.opacity = '0.45';
          await new Promise(r => setTimeout(r, 1220));
        }
      }

      const nextBtns = document.querySelectorAll('.next-btn');
      nextBtns.forEach((btn, i) => {
        btn.style.opacity = '0';
        if (btn.animate) {
          setTimeout(() => {
            btn.animate([
              { opacity: 0 },
              { opacity: 1 }
            ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
          }, 1000 + i * 80);
        } else {
          btn.style.transition = 'opacity 0.6s ease-out';
          setTimeout(() => { btn.style.opacity = '1'; }, 1000 + i * 80);
        }
      });
      return;
    }

    // GSAP path: animate image only
    if (img) {
      gsap.set(img, { xPercent: -50, yPercent: -50, x: startX, opacity: 0, rotation: 0, transformOrigin: '50% 50%' });
    }

    const tl = gsap.timeline();
    if (img) tl.to(img, { duration: 1.2, x: endX, opacity: 0.45, rotation: 720, ease: 'power3.out' });

    const nextBtns = document.querySelectorAll('.next-btn');
    if (nextBtns && nextBtns.length) {
      gsap.set(nextBtns, { opacity: 0 });
      gsap.to(nextBtns, { duration: 0.6, opacity: 1, delay: 3.5, stagger: 0.08, ease: 'power1.out' });
    }

  });

  (() => {
    const sections = Array.from(document.querySelectorAll('section'))
      .sort((a, b) => a.offsetTop - b.offsetTop);

    const isEditable = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    document.addEventListener('keydown', (e) => {
      if (isEditable(e.target)) return; // ignore when typing in fields
      if (e.key !== 'ArrowDown' && e.key !== 'PageDown') return;
      e.preventDefault();

      const currentY = window.scrollY || window.pageYOffset;
      const padding = 10; // small offset to avoid selecting the same section
      const next = sections.find(s => s.offsetTop > currentY + padding);
      if (next) {
        next.scrollIntoView({ behavior: 'smooth' });
      }
    });
  })();

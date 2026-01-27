	document.addEventListener('DOMContentLoaded', () => {
		const img = document.querySelector('#ai-image');

		// helper to animate a single section's titles/headings sequentially
		async function animateSection(section) {
			if (!section) return;
			const titles = section.querySelectorAll('.title');
			const headings = section.querySelectorAll('.heading1');
			const regulars = section.querySelectorAll('.heading2');

			if (titles && titles.length) {
				for (let i = 0; i < titles.length; i++) {
					const el = titles[i];
					el.style.opacity = '0';
					el.style.transform = 'translateX(110vw)';
					if (el.animate) {
						const anim = el.animate([
							{ transform: 'translateX(110vw)', opacity: 0 },
							{ transform: 'translateX(0)', opacity: 1 }
						], { duration: 800, easing: 'ease-out', fill: 'forwards' });
						await anim.finished;
					} else {
						el.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
						el.getBoundingClientRect();
						el.style.transform = 'translateX(0)';
						el.style.opacity = '1';
						await new Promise(r => setTimeout(r, 820));
					}
				}
			}

			if (headings && headings.length) {
				for (let i = 0; i < headings.length; i++) {
					const h = headings[i];
					h.style.opacity = '0';
					if (h.animate) {
						const anim = h.animate([
							{ opacity: 0 },
							{ opacity: 1 }
						], { duration: 600, easing: 'ease-out', fill: 'forwards' });
						await anim.finished;
					} else {
						h.style.transition = 'opacity 0.6s ease-out';
						h.getBoundingClientRect();
						h.style.opacity = '1';
						await new Promise(r => setTimeout(r, 650));
					}
				}
			}

			// animate regular-text after headings
			if (regulars && regulars.length) {
				for (let i = 0; i < regulars.length; i++) {
					const r = regulars[i];
					r.style.opacity = '0';
					if (r.animate) {
						const anim = r.animate([
							{ opacity: 0, transform: 'translateY(8px)' },
							{ opacity: 1, transform: 'translateY(0)' }
						], { duration: 600, easing: 'ease-out', fill: 'forwards' });
						await anim.finished;
					} else {
						r.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
						r.getBoundingClientRect();
						r.style.transform = 'translateY(0)';
						r.style.opacity = '1';
						await new Promise(r => setTimeout(r, 650));
					}
				}
			}
		}

		// kept for compatibility; left empty

		// Compute start (off-screen right) and end (left side) positions in pixels
		const vw = window.innerWidth || document.documentElement.clientWidth || 1024;
		const startX = Math.round(vw * 1.1); // start just off the right edge
		const endX = Math.round(-vw * 0.45); // land toward the left side

		if (!window.gsap) {
			console.warn('GSAP not loaded — using vanilla JS for animations.');
			if (img) {
				img.style.opacity = '0';
				img.style.transform = `translateX(${startX}px) rotate(0deg)`;
				if (img.animate) {
					img.animate([
						{ transform: `translateX(${startX}px) rotate(0deg)`, opacity: 0 },
						{ transform: `translateX(${endX}px) rotate(720deg)`, opacity: 0.5 }
					], { duration: 1200, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' });
				} else {
					img.style.transition = 'transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 1.2s ease';
					img.getBoundingClientRect();
					img.style.transform = `translateX(${endX}px) rotate(720deg)`;
					img.style.opacity = '0.5';
				}
			}
			// Fade in next buttons after 1s (fallback)
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

			// animate first visible section (slide1)
			const firstSection = document.getElementById('slide1');
			animateSection(firstSection);
			return;
		}
		// Use GSAP to roll the image in from the right to the left side, then sequence the first section
		gsap.set(img, { x: startX, opacity: 0, rotation: 0, transformOrigin: '50% 50%' });

		const firstSection = document.getElementById('slide1');
		let sTitles = [];
		let sHeadings = [];
		let sRegulars = [];
		if (firstSection) {
			sTitles = firstSection.querySelectorAll('.title');
			sHeadings = firstSection.querySelectorAll('.heading1');
			sRegulars = firstSection.querySelectorAll('.heading2');
			if (sTitles && sTitles.length) gsap.set(sTitles, { x: '110vw', opacity: 0 });
			if (sHeadings && sHeadings.length) gsap.set(sHeadings, { opacity: 0 });
			if (sRegulars && sRegulars.length) gsap.set(sRegulars, { opacity: 0, y: 8 });
		}

		const tl = gsap.timeline();
		tl.to(img, { duration: 1.2, x: endX, opacity: 0.5, rotation: 720, ease: 'power3.out' });

		if (sTitles.length) tl.to(sTitles, { duration: 0.8, x: '0', opacity: 1, stagger: 0.12, ease: 'power2.out' }, '+=0.08');
		if (sHeadings.length) tl.to(sHeadings, { duration: 0.6, opacity: 1, stagger: 0.12, ease: 'power2.out' }, '+=0.06');
		// regular-text appears right after headings
		if (sRegulars.length) tl.to(sRegulars, { duration: 0.6, opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out' }, '+=0.02');
        
		// Fade-in all next buttons after a short delay
		const nextBtns = document.querySelectorAll('.next-btn');
		if (nextBtns && nextBtns.length) {
			gsap.set(nextBtns, { opacity: 0 });
			gsap.to(nextBtns, { duration: 0.6, opacity: 1, delay: 3.5, stagger: 0.08, ease: 'power1.out' });
		}

		// Attach button handlers to scroll to next section (works with scroll snapping)
		const slideSections = Array.from(document.querySelectorAll('.slide-section'));
		nextBtns.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				const sec = btn.closest('.slide-section');
				if (!sec) return;
				const idx = slideSections.indexOf(sec);
				const next = slideSections[idx + 1];
				if (next) next.scrollIntoView({ behavior: 'smooth' });
			});
		});

		// Allow keyboard navigation: ArrowDown advances, ArrowUp goes back
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowDown' || e.keyCode === 40 || e.key === 'ArrowUp' || e.keyCode === 38) {
				const isDown = (e.key === 'ArrowDown' || e.keyCode === 40);
				// find the section closest to the top of the viewport
				let currentIndex = -1;
				for (let i = 0; i < slideSections.length; i++) {
					const rect = slideSections[i].getBoundingClientRect();
					if (rect.top >= -10 && rect.top < window.innerHeight / 2) {
						currentIndex = i;
						break;
					}
				}
				if (currentIndex === -1) {
					let min = Infinity; let idx = 0;
					slideSections.forEach((sec, i) => {
						const t = Math.abs(sec.getBoundingClientRect().top);
						if (t < min) { min = t; idx = i; }
					});
					currentIndex = idx;
				}
				const targetIndex = isDown ? currentIndex + 1 : currentIndex - 1;
				const target = slideSections[targetIndex];
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth' });
				}
			}
		});

		// GSAP timeline handles the first-section animations; do not call the fallback to avoid duplicate runs
	});

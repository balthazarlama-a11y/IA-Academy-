/* ============================================
   IA Studio — Main JavaScript
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ===== Navbar scroll =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // ===== Scroll reveal =====
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // ===== Smooth scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) {
                const off = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
                window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off - 20, behavior: 'smooth' });
            }
        });
    });

    // ===== Animated counters =====
    const counters = document.querySelectorAll('[data-count]');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const dur = 1800, start = performance.now();
        const suffix = el.dataset.suffix || '', prefix = el.dataset.prefix || '';
        const update = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    const cObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));

    // ===== FILTER SYSTEM =====
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.tool-card');
    const countEl = document.querySelector('.tools__count strong');
    const gridEl = document.querySelector('.tools__grid');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active pill
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const cat = pill.dataset.category;
            let visibleCount = 0;

            // Animate cards out, then in
            cards.forEach((card, i) => {
                const match = cat === 'all' || card.dataset.category === cat;

                if (!match) {
                    card.classList.remove('card-enter');
                    card.classList.add('card-exit');
                    setTimeout(() => {
                        card.style.display = 'none';
                        card.classList.remove('card-exit');
                    }, 250);
                } else {
                    visibleCount++;
                    setTimeout(() => {
                        card.style.display = '';
                        card.classList.remove('card-exit');
                        card.classList.add('card-enter');
                        // Remove class after animation completes
                        setTimeout(() => card.classList.remove('card-enter'), 400);
                    }, 150 + (visibleCount * 60));
                }
            });

            // Update count text
            if (countEl) {
                setTimeout(() => {
                    countEl.textContent = visibleCount;
                }, 200);
            }
        });
    });

    // ===== Search filter =====
    const searchInput = document.querySelector('.hero__search input');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const query = searchInput.value.toLowerCase().trim();

                // Reset pills to "Todos"
                pills.forEach(p => p.classList.remove('active'));
                pills[0]?.classList.add('active');

                let visibleCount = 0;
                cards.forEach(card => {
                    const name = (card.querySelector('.tool-card__name')?.textContent || '').toLowerCase();
                    const desc = (card.querySelector('.tool-card__desc')?.textContent || '').toLowerCase();
                    const match = !query || name.includes(query) || desc.includes(query);

                    if (match) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (countEl) countEl.textContent = visibleCount;
            }, 200);
        });
    }

    // ===== Mobile burger =====
    const burger = document.querySelector('.navbar__burger');
    const mobileLinks = document.querySelector('.navbar__links');
    if (burger && mobileLinks) {
        burger.addEventListener('click', () => {
            mobileLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

});

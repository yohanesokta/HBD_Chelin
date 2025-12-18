document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const isMobile = window.innerWidth < 768;

    /* CUSTOM CURSOR */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            gsap.to(cursorDot, { x: clientX, y: clientY, duration: 0.2, ease: 'power2.out' });
            gsap.to(cursorOutline, { x: clientX, y: clientY, duration: 0.4, ease: 'power2.out' });
        });
        const handleMouseEnter = () => gsap.to(cursorOutline, { scale: 1.5, opacity: 1, duration: 0.3 });
        const handleMouseLeave = () => gsap.to(cursorOutline, { scale: 1, opacity: 0.3, duration: 0.3 });
        document.querySelectorAll('a, button, .gallery-item, .id-card-container, .cube').forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* ANIMATIONS */
    const heroTitle = new SplitText('.hero-title', { type: 'chars' });
    gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from(heroTitle.chars, { y: 115, stagger: 0.03, duration: 1 })
        .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1.2 }, '-=0.7')
        .from('.scroll-indicator', { opacity: 0, y: 20, duration: 1 }, '-=0.5');

    gsap.utils.toArray('.parallax-bg').forEach(bg => {
        gsap.to(bg, {
            y: (i, target) => -(target.parentElement.offsetHeight - target.offsetHeight) * 0.4,
            ease: "none",
            scrollTrigger: { trigger: bg.parentElement, start: "top top", end: "bottom top", scrub: true }
        });
    });

    const animateOnScroll = (elem, vars) => gsap.from(elem, { scrollTrigger: { trigger: elem, start: 'top 85%', toggleActions: 'play none none none' }, ...vars });
    animateOnScroll('.glowing-card', { opacity: 0, y: 80, duration: 1, ease: 'power3.out' });
    gsap.from('.gallery-item', { scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' }, opacity: 0, y: 50, scale: 0.9, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 85%', onEnter: () => item.classList.add('is-visible') },
            opacity: 0, x: item.classList.contains('timeline-left') ? -80 : 80, duration: 1.2, ease: 'power3.out'
        });
    });
    animateOnScroll('#stats .container', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#id-card .container', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#dimension .container', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('.game-container', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' });
    animateOnScroll('.surprise-title', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish h2', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish p', { opacity: 0, y: 50, duration: 1, stagger: 0.2 });
    animateOnScroll('.final-text', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out' });

    /* LOVE STATS CHART */
    const loveChartCanvas = document.getElementById('loveChart');
    if (loveChartCanvas) {
        ScrollTrigger.create({
            trigger: loveChartCanvas,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const ctx = loveChartCanvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(249, 93, 122, 0.5)');
                gradient.addColorStop(1, 'rgba(249, 93, 122, 0)');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array.from({length: 24}, (_, i) => `Bulan ${i + 1}`),
                        datasets: [{
                            label: 'Rasa Sayang',
                            data: [80, 85, 90, 75, 60, 65, 70, 85, 95, 100, 85, 70, 75, 80, 90, 95, 80, 65, 70, 80, 90, 100, 100, 110],
                            borderColor: 'rgba(249, 93, 122, 1)',
                            borderWidth: 3,
                            fill: true,
                            backgroundColor: gradient,
                            tension: 0.4,
                            pointBackgroundColor: 'rgba(249, 93, 122, 1)',
                            pointRadius: 0,
                            pointHoverRadius: 8,
                            pointHoverBorderColor: 'white',
                            pointHoverBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 2000, easing: 'easeInOutQuart' },
                        scales: {
                            y: { display: false },
                            x: { ticks: { color: '#e0e0e0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.1)' } }
                        },
                        plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 5 } }
                    }
                });
            }
        });
    }

    /* ID CARD FLIP */
    const idCard = document.getElementById('idCard');
    if(idCard) {
        idCard.addEventListener('click', () => idCard.classList.toggle('is-flipped'));
    }

    /* 3D CUBE DRAG */
    const cube = document.getElementById('cube');
    if(cube) {
        let isDragging = false, prevX, prevY;
        let rotationX = -30, rotationY = -45;

        gsap.set(cube, { rotationX, rotationY });

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = true;
            cube.style.animationPlayState = 'paused';
            prevX = e.clientX || e.touches[0].clientX;
            prevY = e.clientY || e.touches[0].clientY;
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const dX = clientX - prevX;
            const dY = clientY - prevY;
            
            rotationY += dX * 0.5;
            rotationX -= dY * 0.5;
            
            gsap.to(cube, { rotationX, rotationY, duration: 0.1, ease: 'power1.out' });

            prevX = clientX;
            prevY = clientY;
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            cube.style.animationPlayState = 'running';
        };
        
        cube.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        cube.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    /* MINI GAME (V2 - MORE FUN!) */
    const yesBtn = document.getElementById('yesBtn');
    if(yesBtn) {
        const noBtn = document.getElementById('noBtn');
        const gameContainer = document.querySelector('.game-container');
        const gameResult = document.getElementById('gameResult');
        const noButtonPhrases = ["Yakin?", "Serius?", "Coba lagi 😜", "Nggak boleh!", "Pikirin lagi...", "Dilarang!"];

        const moveNoButton = (e) => {
            const rand = Math.random();
            
            // Add varied "runaway" animations
            if (rand < 0.6) { // 60% chance: Standard move
                gsap.to(noBtn, {
                    x: gsap.utils.random(0, gameContainer.offsetWidth - noBtn.offsetWidth),
                    y: gsap.utils.random(0, gameContainer.offsetHeight - noBtn.offsetHeight),
                    duration: 0.4,
                    ease: 'power3.out'
                });
            } else if (rand < 0.8) { // 20% chance: Shrink, move, grow
                gsap.timeline()
                    .to(noBtn, { scale: 0.1, duration: 0.2, ease: 'power2.in' })
                    .to(noBtn, {
                        x: gsap.utils.random(0, gameContainer.offsetWidth - noBtn.offsetWidth),
                        y: gsap.utils.random(0, gameContainer.offsetHeight - noBtn.offsetHeight),
                        duration: 0.01
                    })
                    .to(noBtn, { scale: 1, duration: 0.3, ease: 'back.out' });
            } else { // 20% chance: Taunt shake then move
                gsap.timeline()
                    .to(noBtn, { rotation: gsap.utils.random(-15, 15), x: '+=10', repeat: 3, yoyo: true, duration: 0.05 })
                    .to(noBtn, {
                        x: gsap.utils.random(0, gameContainer.offsetWidth - noBtn.offsetWidth),
                        y: gsap.utils.random(0, gameContainer.offsetHeight - noBtn.offsetHeight),
                        rotation: 0,
                        duration: 0.5,
                        ease: 'expo.out'
                    });
            }
            
            noBtn.textContent = noButtonPhrases[Math.floor(Math.random() * noButtonPhrases.length)];
            if (e.type !== 'mouseover') gsap.fromTo(gameContainer, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, clearProps: 'x' });
        };

        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('click', moveNoButton);

        yesBtn.addEventListener('click', () => {
            // More explosive celebration
            const shockwave = document.createElement('div');
            shockwave.style.position = 'absolute';
            shockwave.style.left = '50%';
            shockwave.style.top = '50%';
            shockwave.style.transform = 'translate(-50%, -50%)';
            shockwave.style.width = '100px';
            shockwave.style.height = '100px';
            shockwave.style.borderRadius = '50%';
            shockwave.style.backgroundColor = 'white';
            shockwave.style.zIndex = '0';
            gameContainer.appendChild(shockwave);

            // Confetti
            const duration = 3 * 1000, animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 80 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 } });
            }, 250);
            
            // Result text animation
            gameResult.textContent = "UDAH KUTEBAK SIH ❤️";
            const resultSplit = new SplitText(gameResult, { type: 'chars' });

            gsap.timeline()
                .to([yesBtn, noBtn], { opacity: 0, scale: 0, duration: 0.5, ease: 'back.in(1.7)' })
                .to(shockwave, { scale: 20, opacity: 0, duration: 1, ease: 'power2.out' }, "-=0.4")
                .from(resultSplit.chars, {
                    y: 50,
                    opacity: 0,
                    scale: 2,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                    onComplete: () => shockwave.remove()
                }, "-=0.8");
        });
    }

    /* SURPRISE TYPING ANIMATION */
    const surpriseTextElement = document.getElementById('surpriseText');
    if(surpriseTextElement) {
        const surpriseText = "Aku janji bakal selalu bikin kamu ketawa, jadi fans nomer #1 kamu, dan makin sayang setiap harinya. Yuk, bikin lebih banyak lagi kenangan indah bareng-bareng.";
        let i = 0;
        const typeWriter = () => { if (i < surpriseText.length) { surpriseTextElement.innerHTML += surpriseText.charAt(i++); setTimeout(typeWriter, 60); } };
        ScrollTrigger.create({ trigger: '#surprise', start: 'top 70%', onEnter: () => { if (i === 0) typeWriter(); }, once: true });
    }

    /* FLOATING HEARTS */
    const floatingHeartsContainer = document.getElementById('floatingHearts');
    if(floatingHeartsContainer) {
        gsap.ticker.add(() => {
            if (Math.random() < 0.03) {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.innerText = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
                floatingHeartsContainer.appendChild(heart);
                gsap.fromTo(heart, {
                    x: Math.random() * window.innerWidth, y: window.innerHeight + 50, scale: Math.random() * 1 + 0.5, opacity: 0
                }, {
                    y: -100, x: '+=_random(-100, 100)', opacity: 1, duration: Math.random() * 5 + 5, ease: "none", onComplete: () => heart.remove()
                });
            }
        });
    }
});
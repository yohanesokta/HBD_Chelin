document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, Draggable);

    function manualSplitText(element) {
        if (!element) return [];
        const text = element.textContent;
        element.innerHTML = '';
        const chars = [];
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.position = 'relative';
            if (char === ' ') span.style.width = '0.5em';
            span.textContent = char;
            element.appendChild(span);
            chars.push(span);
        }
        return chars;
    }

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
            gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
        });
        const handleMouseEnter = () => gsap.to(cursorOutline, { scale: 1.5, opacity: 1, duration: 0.3 });
        const handleMouseLeave = () => gsap.to(cursorOutline, { scale: 1, opacity: 0.3, duration: 0.3 });
        document.querySelectorAll('a, button, .gallery-item, .id-card-container, .cube, #introOverlay').forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    } else {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        if (dot) dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    const introOverlay = document.getElementById('introOverlay');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const heroTitleElement = document.querySelector('.hero-title');
    let heroTl;

    if (heroTitleElement) {
        const heroTitleChars = manualSplitText(heroTitleElement);
        heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
        heroTl.from(heroTitleChars, { y: 115, opacity: 0, stagger: 0.03, duration: 1 })
            .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1.2 }, '-=0.7')
            .from('.scroll-indicator', { opacity: 0, y: 20, duration: 1 }, '-=0.5');
    }

    introOverlay.addEventListener('click', () => {
        if (backgroundAudio && backgroundAudio.paused) {
            backgroundAudio.volume = 0.4;
            backgroundAudio.play().catch(e => console.error("Audio play failed:", e));
        }

        gsap.to(introOverlay, {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                introOverlay.style.display = 'none';
                document.body.classList.remove('intro-active');
                
                ScrollTrigger.refresh();

                if (heroTl) {
                    heroTl.play();
                }
            }
        });
    }, { once: true });


    const animateOnScroll = (elem, vars) => {
        const elements = gsap.utils.toArray(elem);
        elements.forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }, ...vars });
        });
    };

    gsap.utils.toArray('.parallax-bg').forEach(bg => {
        gsap.to(bg, {
            y: (i, target) => -(target.parentElement.offsetHeight - target.offsetHeight) * 0.4,
            ease: "none",
            scrollTrigger: { trigger: bg.parentElement, start: "top top", end: "bottom top", scrub: true }
        });
    });

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
    animateOnScroll('.surprise-title', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish h2', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish p', { opacity: 0, y: 50, duration: 1, stagger: 0.2 });
    animateOnScroll('.final-text', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out' });

    const loveChartCanvas = document.getElementById('loveChart');
    if (loveChartCanvas && typeof Chart !== 'undefined') {
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
                    type: 'line', data: {
                        labels: Array.from({length: 24}, (_, i) => `Bulan ${i + 1}`),
                        datasets: [{ label: 'Rasa Sayang', data: [80, 85, 90, 75, 60, 65, 70, 85, 95, 100, 85, 70, 75, 80, 90, 95, 80, 65, 70, 80, 90, 100, 100, 110], borderColor: 'rgba(249, 93, 122, 1)', borderWidth: 3, fill: true, backgroundColor: gradient, tension: 0.4, pointRadius: 0, pointHoverRadius: 8, pointHoverBorderColor: 'white', pointHoverBorderWidth: 2 }]
                    }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 2000, easing: 'easeInOutQuart' }, scales: { y: { display: false }, x: { ticks: { color: '#e0e0e0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.1)' } } }, plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, cornerRadius: 5 } } }
                });
            }
        });
    }

    /* ID CARD FLIP */
    const idCard = document.getElementById('idCard');
    if(idCard) idCard.addEventListener('click', () => idCard.classList.toggle('is-flipped'));

    /* 3D CUBE DRAG */
    const cube = document.getElementById('cube');
    if(cube) {
        let rotX = -30, rotY = -45;
        let autoRotate = gsap.to(cube, { rotationY: "+=360", rotationX: "+=10", duration: 30, ease: "none", repeat: -1 });
        gsap.set(cube, { rotationX: rotX, rotationY: rotY });
        
        Draggable.create(cube, {
            onDragStart: function() {
                autoRotate.pause();
                gsap.to(cube.querySelectorAll('.cube-face'), { boxShadow: "0 0 40px var(--glow-cyan) inset", duration: 0.3 });
            },
            onDrag: function() {
                rotY += this.deltaX * 0.5;
                rotX -= this.deltaY * 0.5;
                gsap.to(cube, { rotationX: rotX, rotationY: rotY, duration: 0.1, ease: 'power1.out' });
            },
            onDragEnd: function() {
                autoRotate.resume();
                gsap.to(cube.querySelectorAll('.cube-face'), { boxShadow: "0 0 20px var(--glow-cyan) inset", duration: 0.5 });
            }
        });
    }

    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) {
        const quizContent = document.getElementById('quizContent');
        const quizProgress = document.getElementById('quizProgress');
        const quizQuestion = document.getElementById('quizQuestion');
        const quizAnswers = document.getElementById('quizAnswers');
        const quizResultScreen = document.getElementById('quizResultScreen');
        const quizScoreEl = document.getElementById('quizScore');
        const quizResultMessage = document.getElementById('quizResultMessage');
        const quizData = [
            { question: "Di mana tempat pertama kali kita 'official' jalan bareng?", answers: ["Taman Bungkul", "Alun-Alun Surabaya", "Alun-Alun Sidoarjo", "KBS"], correct: 1 },
            { question: "Kapan tanggal Kita jadian? dd-mm-yyyy", answers: ["29-03-2024", "29-3-2023", "3-29-2024", "2024-03-29"], correct: 0 },
            { question: "Apa panggilan sayang favoritku buat kamu?", answers: ["Kidang", "Sayang", "Yuyu Rumpung", "Cucak Rowo"], correct: 1 },
            { question: "Warna apa yang paling sering aku sebut sebagai warna favoritku?", answers: ["Hitam", "Pink", "Biru", "Ungu"], correct: 1 },
            { question: "Kalau kita cuma bisa makan satu jenis makanan selamanya, apa yang bakal kamu pilih?", answers: ["Seblak", "Bakso", "Nasi Goreng", "Pizza"], correct: 0 }
        ];
        let currentQuestionIndex = 0, score = 0;

        function loadQuestion() {
            if (currentQuestionIndex >= quizData.length) { showResults(); return; }
            const currentQuestion = quizData[currentQuestionIndex];
            quizProgress.textContent = `Pertanyaan ${currentQuestionIndex + 1} / ${quizData.length}`;
            quizQuestion.textContent = currentQuestion.question;
            quizAnswers.innerHTML = '';
            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('answer-btn');
                button.dataset.index = index;
                button.addEventListener('click', selectAnswer);
                quizAnswers.appendChild(button);
            });
        }

        function selectAnswer(e) {
            const selectedButton = e.target;
            const selectedIndex = parseInt(selectedButton.dataset.index);
            const correctIndex = quizData[currentQuestionIndex].correct;
            document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
            if (selectedIndex === correctIndex) {
                score++;
                selectedButton.classList.add('correct');
                if(typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, shapes: ['star'], colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585'] });
            } else {
                selectedButton.classList.add('incorrect');
                gsap.fromTo('body', { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.05, clearProps: 'x' });
            }
            setTimeout(() => { currentQuestionIndex++; loadQuestion(); }, 1500);
        }

        function showResults() {
            gsap.timeline().to(quizContent, { opacity: 0, duration: 0.5 }).set(quizContent, { display: 'none' }).set(quizResultScreen, { display: 'block', opacity: 0 }).to(quizResultScreen, { opacity: 1, duration: 0.5 });
            quizScoreEl.textContent = `Skor Kamu: ${score} / ${quizData.length}`;
            let message = (score === quizData.length) ? "SEMPURNA! Kamu emang paling ngerti aku. Makin sayang deh! ❤️" : (score >= quizData.length / 2) ? "Hampir sempurna! Not bad, kamu cukup kenal aku kok. Hehe." : "Hmm, kayaknya kita perlu lebih banyak ngobrol nih, hehe. But it's okay, I still love you the same!";
            quizResultMessage.textContent = message;
        }
        loadQuestion();
    }

    const surpriseTextElement = document.getElementById('surpriseText');
    if(surpriseTextElement) {
        const surpriseText = "Aku janji bakal selalu bikin kamu ketawa, jadi fans nomer #1 kamu, dan makin sayang setiap harinya. Yuk, bikin lebih banyak lagi kenangan indah bareng-bareng.";
        let i = 0;
        const typeWriter = () => { if (i < surpriseText.length) { surpriseTextElement.innerHTML += surpriseText.charAt(i++); setTimeout(typeWriter, 60); } };
        ScrollTrigger.create({ trigger: '#surprise', start: 'top 70%', onEnter: () => { if (i === 0) typeWriter(); }, once: true });
    }

    const floatingHeartsContainer = document.getElementById('floatingHearts');
    if(floatingHeartsContainer) {
        gsap.ticker.add(() => {
            if (Math.random() < 0.03) {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.innerText = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
                floatingHeartsContainer.appendChild(heart);
                gsap.fromTo(heart, { x: Math.random() * window.innerWidth, y: window.innerHeight + 50, scale: Math.random() * 1 + 0.5, opacity: 0 }, { y: -100, x: `+=${gsap.utils.random(-100, 100)}`, opacity: 1, duration: gsap.utils.random(5, 10), ease: "none", onComplete: () => heart.remove() });
            }
        });
    }

    const sectionColors = { "#hero": "#0d0c1d", "#letter": "#2c233d", "#gallery": "#1a1a1a", "#timeline": "#1a2a45", "#stats": "#4d2241", "#id-card": "#12343b", "#dimension": "#123b3b", "#game": "#4a2d5e", "#surprise": "#5e4a2d", "#wish": "#3b3251", "#final": "#0d0c1d" };
    gsap.utils.toArray("section").forEach(section => {
        const color = sectionColors[`#${section.id}`];
        if (color) {
            ScrollTrigger.create({
                trigger: section, start: "top 60%", end: "bottom 40%",
                onEnter: () => gsap.to('body', { backgroundColor: color, duration: 1.0, ease: 'sine.inOut' }),
                onEnterBack: () => gsap.to('body', { backgroundColor: color, duration: 1.0, ease: 'sine.inOut' })
            });
        }
    });
});
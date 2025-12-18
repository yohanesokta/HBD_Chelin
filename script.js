document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Helper function to replace GSAP's premium SplitText plugin
    function manualSplitText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        const chars = [];
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.position = 'relative'; // For animation purposes
            if(char === ' ') span.style.width = '0.5em'; // Give space element some width
            span.textContent = char;
            element.appendChild(span);
            chars.push(span);
        }
        return chars;
    }

    const isMobile = window.innerWidth < 768;

    /* CUSTOM CURSOR */
    if (!isMobile) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
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
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        if (dot) dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* ANIMATIONS */
    const heroTitleElement = document.querySelector('.hero-title');
    if (heroTitleElement) {
        const heroTitleChars = manualSplitText(heroTitleElement);
        gsap.timeline({ defaults: { ease: 'power4.out' } })
            .from(heroTitleChars, { y: 115, stagger: 0.03, duration: 1 })
            .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1.2 }, '-=0.7')
            .from('.scroll-indicator', { opacity: 0, y: 20, duration: 1 }, '-=0.5');
    }


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
    animateOnScroll('#quizContainer', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' });
    animateOnScroll('.surprise-title', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish h2', { opacity: 0, y: 50, duration: 1 });
    animateOnScroll('#wish p', { opacity: 0, y: 50, duration: 1, stagger: 0.2 });
    animateOnScroll('.final-text', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out' });

    /* LOVE STATS CHART */
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
                        scales: { y: { display: false }, x: { ticks: { color: '#e0e0e0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.1)' } } },
                        plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 5 } }
                    }
                });
            }
        });
    }

    /* ID CARD FLIP */
    const idCard = document.getElementById('idCard');
    if(idCard) { idCard.addEventListener('click', () => idCard.classList.toggle('is-flipped')); }

    /* 3D CUBE DRAG (FIXED & POLISHED) */
    const cube = document.getElementById('cube');
    if(cube) {
        let isDragging = false, prevX, prevY;
        let rotX = -30, rotY = -45;
        let autoRotate = gsap.to(cube, { rotationY: "+=360", rotationX: "+=10", duration: 30, ease: "none", repeat: -1 });

        gsap.set(cube, { rotationX: rotX, rotationY: rotY });

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = true;
            autoRotate.pause();
            prevX = e.clientX || e.touches[0].clientX;
            prevY = e.clientY || e.touches[0].clientY;
            gsap.to(cube.querySelectorAll('.cube-face'), { boxShadow: "0 0 40px var(--glow-cyan) inset", duration: 0.3 });
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const dX = clientX - prevX;
            const dY = clientY - prevY;
            
            rotY += dX * 0.5;
            rotX -= dY * 0.5;
            
            gsap.to(cube, { rotationX: rotX, rotationY: rotY, duration: 0.1, ease: 'power1.out' });

            prevX = clientX;
            prevY = clientY;
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            autoRotate.resume();
            gsap.to(cube.querySelectorAll('.cube-face'), { boxShadow: "0 0 20px var(--glow-cyan) inset", duration: 0.5 });
        };
        
        cube.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        cube.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    /* QUIZ LOGIC (Replaces Mini-Game) */
    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) {
        const quizContent = document.getElementById('quizContent');
        const quizProgress = document.getElementById('quizProgress');
        const quizQuestion = document.getElementById('quizQuestion');
        const quizAnswers = document.getElementById('quizAnswers');
        const quizResultScreen = document.getElementById('quizResultScreen');
        const quizScore = document.getElementById('quizScore');
        const quizResultMessage = document.getElementById('quizResultMessage');

        const quizData = [
            { question: "Di mana tempat pertama kali kita 'official' jalan bareng?", answers: ["Taman Bungkul", "Galaxy Mall", "Alun-Alun Sidoarjo", "KBS"], correct: 2 },
            { question: "Apa judul film pertama yang kita tonton bareng di bioskop?", answers: ["Agak Laen", "KKN Di Desa Penari", "Pengabdi Setan 2", "Doctor Strange"], correct: 0 },
            { question: "Apa panggilan sayang favoritku buat kamu?", answers: ["Gembul", "Sayang", "Ndut", "Semua benar"], correct: 3 },
            { question: "Warna apa yang paling sering kamu sebut sebagai warna favoritmu?", answers: ["Hitam", "Pink", "Biru", "Ungu"], correct: 1 },
            { question: "Kalau kita cuma bisa makan satu jenis makanan selamanya, apa yang bakal kamu pilih?", answers: ["Seblak", "Bakso", "Nasi Goreng", "Pizza"], correct: 0 }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        function loadQuestion() {
            if (!quizContent || currentQuestionIndex >= quizData.length) {
                showResults();
                return;
            }

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
                if(typeof confetti === 'function'){
                    const flowerConfetti = confetti.create(null, { resize: true });
                    flowerConfetti({ particleCount: 30, spread: 60, origin: { y: 0.6 }, shapes: ['star'], colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585'] });
                }
            } else {
                selectedButton.classList.add('incorrect');
                gsap.fromTo('body', { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.05, clearProps: 'x' });
            }

            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 1500);
        }

        function showResults() {
            if(quizContent) quizContent.style.display = 'none';
            if(quizResultScreen) quizResultScreen.style.display = 'block';

            quizScore.textContent = `Skor Kamu: ${score} / ${quizData.length}`;
            let message = "";
            if (score === quizData.length) {
                message = "SEMPURNA! Kamu emang paling ngerti aku. Makin sayang deh! ❤️";
            } else if (score >= quizData.length / 2) {
                message = "Hampir sempurna! Not bad, kamu cukup kenal aku kok. Hehe.";
            } else {
                message = "Hmm, kayaknya kita perlu lebih banyak ngobrol nih, hehe. But it's okay, I still love you the same!";
            }
            quizResultMessage.textContent = message;
        }

        loadQuestion();
    }

    /* SURPRISE TYPING ANIMATION */
    const surpriseTextElement = document.getElementById('surpriseText');
    if(surpriseTextElement) {
        const surpriseText = "Aku janji bakal selalu bikin kamu ketawa, jadi fans nomer #1 kamu, dan makin sayang setiap harinya. Yuk, bikin lebih banyak lagi kenangan indah bareng-bareng.";
        let i = 0;
        const typeWriter = () => { if (i < surpriseText.length) { surpriseTextElement.innerHTML += surpriseText.charAt(i++); setTimeout(typeWriter, 60); } };
        ScrollTrigger.create({ trigger: '#surprise', start: 'top 70%', onEnter: () => { if (i === 0) typeWriter(); }, once: true });
    }

    /* FLOATING HEARTS (FIXED) */
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
                    y: -100, x: `+=${gsap.utils.random(-100, 100)}`, opacity: 1, duration: gsap.utils.random(5, 10), ease: "none", onComplete: () => heart.remove()
                });
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel3d');
    const figures = carousel.querySelectorAll('figure');
    const total = figures.length;
    let currentIndex = 0;
    let autoPlay;

    const dotsContainer = document.getElementById('carouselDots');
    const yearEl = document.getElementById('year');
    const descEl = document.getElementById('desc');
    const prevBtn = document.querySelector('.carousel-3d-btn.prev');
    const nextBtn = document.querySelector('.carousel-3d-btn.next');

    // Crear dots
    figures.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function update() {
        figures.forEach((fig, i) => {
            // Diferencia mínima circular (-2 a +2 para 5 slides)
            let diff = i - currentIndex;
            if (diff > Math.floor(total / 2)) diff -= total;
            if (diff < -Math.floor(total / 2)) diff += total;

            const angle = 360 / total;
            const rotY = diff * angle;

            // Profundidad: central = 600px adelante, laterales progresivamente atrás
            const translateZ = (Math.abs(diff) === 0) ? 600 :
                               (Math.abs(diff) === 1) ? 200 :
                               (Math.abs(diff) === 2) ? -100 : -200;

            // Opacidad y escala
            const opacity = (Math.abs(diff) === 0) ? 1 :
                            (Math.abs(diff) === 1) ? 0.9 :
                            (Math.abs(diff) === 2) ? 0.6 : 0.4;

            const scale = (Math.abs(diff) === 0) ? 1 :
                          (Math.abs(diff) === 1) ? 0.9 : 0.8;

            fig.style.transform = `rotateY(${rotY}deg) translateZ(${translateZ}px) scale(${scale})`;
            fig.style.opacity = opacity;
            fig.style.zIndex = 10 - Math.abs(diff); // Central más alto
        });

        // Caption y dots
        yearEl.textContent = figures[currentIndex].dataset.year;
        descEl.textContent = figures[currentIndex].dataset.desc;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
        currentIndex = (index + total) % total;
        update();
        resetAutoPlay();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Auto-play
    function startAutoPlay() {
        autoPlay = setInterval(next, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    startAutoPlay();

    // Swipe en móvil
    let startX = 0;
    carousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    });

    // Inicializar
    update();
});
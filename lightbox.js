(function () {
    const grid = document.querySelector('.art-grid');
    const lightbox = document.getElementById('lightbox');
    if (!grid || !lightbox) return;

    const imgEl = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let images = [];
    let currentIndex = 0;

    function show(index) {
        if (!images.length) return;
        currentIndex = (index + images.length) % images.length;
        const src = images[currentIndex];
        imgEl.src = src.dataset.fullSrc || src.src;
        imgEl.alt = src.alt || '';
    }

    function open(img) {
        images = Array.from(grid.querySelectorAll('.art-img'));
        const idx = images.indexOf(img);
        if (idx < 0) return;
        show(idx);
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        imgEl.src = '';
    }

    grid.addEventListener('click', (e) => {
        const img = e.target.closest('.art-img');
        if (img) open(img);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        show(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        show(currentIndex + 1);
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(currentIndex - 1);
        else if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
})();

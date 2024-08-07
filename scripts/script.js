document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('container');
    const chapters = ['chapters/chapter1.html', 'chapters/chapter2.html'];
    let currentPageIndex = parseInt(localStorage.getItem('currentPageIndex')) || 0;

    async function loadChapters() {
        for (let i = 0; i < chapters.length; i++) {
            const response = await fetch(chapters[i]);
            const text = await response.text();
            const div = document.createElement('div');
            div.classList.add('chapter');
            div.innerHTML = text;
            container.appendChild(div);
        }
        showPage(currentPageIndex);
    }

    function showPage(index) {
        const pages = document.querySelectorAll('.chapter');
        pages.forEach((page, i) => {
            page.style.display = (i === index) ? 'block' : 'none';
        });
        localStorage.setItem('currentPageIndex', index);
    }

    function handleSwipe(event) {
        let newIndex = currentPageIndex;
        if (event.direction === Hammer.DIRECTION_LEFT) { // Swiped left
            newIndex = Math.min(currentPageIndex + 1, chapters.length - 1);
        } else if (event.direction === Hammer.DIRECTION_RIGHT) { // Swiped right
            newIndex = Math.max(currentPageIndex - 1, 0);
        }
        if (newIndex !== currentPageIndex) {
            currentPageIndex = newIndex;
            showPage(currentPageIndex);
        }
    }

    const hammer = new Hammer(container);
    hammer.on('swipe', handleSwipe);

    await loadChapters();
});

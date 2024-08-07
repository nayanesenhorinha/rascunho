document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('container');
    const navContainer = document.getElementById('nav');
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
    }

    async function loadNav() {
        const response = await fetch('nav.html');
        const text = await response.text();
        navContainer.innerHTML = text;
        navContainer.querySelectorAll('li').forEach((item) => {
            item.addEventListener('click', (event) => {
                currentPageIndex = parseInt(event.target.getAttribute('data-chapter')) + 2; // Ajusta o índice para capítulos
                showPage(currentPageIndex);
            });
        });
    }

    function showPage(index) {
        container.style.transform = `translateX(-${index * 100}vw)`;
        localStorage.setItem('currentPageIndex', index);
    }

    function handleSwipe(event) {
        let newIndex = currentPageIndex;
        if (event.direction === Hammer.DIRECTION_LEFT) { // Swiped left
            newIndex = Math.min(currentPageIndex + 1, chapters.length + 1);
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
    await loadNav();
    showPage(currentPageIndex);
});

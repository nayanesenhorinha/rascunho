document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('chapters');
    const navContainer = document.getElementById('nav');
    const pages = ['index', 'nav'];
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
            pages.push(div);
        }
    }

    async function loadNav() {
        const response = await fetch('nav.html');
        const text = await response.text();
        navContainer.innerHTML = text;
    }

    function showPage(index) {
        pages.forEach((page, i) => {
            if (typeof page === 'string') {
                document.getElementById(page).style.display = (i === index) ? 'block' : 'none';
            } else {
                page.style.display = (i === index) ? 'block' : 'none';
            }
        });
        localStorage.setItem('currentPageIndex', index);
    }

    function handleSwipe(event) {
        let newIndex = currentPageIndex;
        if (event.direction === Hammer.DIRECTION_LEFT) { // Swiped left
            newIndex = Math.min(currentPageIndex + 1, pages.length - 1);
        } else if (event.direction === Hammer.DIRECTION_RIGHT) { // Swiped right
            newIndex = Math.max(currentPageIndex - 1, 0);
        }
        if (newIndex !== currentPageIndex) {
            currentPageIndex = newIndex;
            showPage(currentPageIndex);
        }
    }

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('nav-link')) {
            currentPageIndex = 1;
            showPage(currentPageIndex);
        } else if (event.target.classList.contains('chapter-link')) {
            currentPageIndex = parseInt(event.target.getAttribute('data-chapter')) + 2; // Adjust index for chapters
            showPage(currentPageIndex);
        }
    });

    const hammer = new Hammer(document.body);
    hammer.on('swipe', handleSwipe);

    await loadChapters();
    await loadNav();
    showPage(currentPageIndex);
});

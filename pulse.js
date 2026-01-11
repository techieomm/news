const API_KEY ='f0537f89944ccb4226bcd39bd03dbcd4';
const BASE_URL = 'https://gnews.io/api/v4';

const grid = document.getElementById('newsGrid');
const hero = document.getElementById('heroSection');
const searchInput = document.getElementById('searchInput');
const title = document.getElementById('sectionTitle');
const catBtns = document.querySelectorAll('.cat-btn');

let currentCategory = 'general';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.dataset.cat;
        title.innerText = `${currentCategory.charAt(0).toUpperCase()}${currentCategory.slice(1)} News`;
        searchQuery = '';
        searchInput.value = '';

        loadNews();
    });
});

searchInput.addEventListener('keyup', e => {
    searchQuery = e.target.value;
    if (searchQuery.length > 2 || searchQuery.length === 0) {
        loadNews();
    }
});

async function loadNews() {
    grid.innerHTML = 'Loading...';

    let url = searchQuery
        ? `${BASE_URL}/search?q=${searchQuery}&lang=en&apikey=${API_KEY}`
        : `${BASE_URL}/top-headlines?category=${currentCategory}&lang=en&apikey=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    renderNews(data.articles);
}

function renderNews(articles) {
    if (!articles || !articles.length) {
        grid.innerHTML = 'No articles found';
        return;
    }

    const heroArticle = articles[0];
    hero.innerHTML = `
        <div class="hero-card">
            <img src="${heroArticle.image}">
            <div class="hero-overlay">
                <h1>${heroArticle.title}</h1>
            </div>
        </div>
    `;

    grid.innerHTML = articles.slice(1).map(a => `
        <div class="card">
            <img src="${a.image}">
            <div class="card-body">
                <div class="card-title">${a.title}</div>
                <p>${a.description || ''}</p>
            </div>
        </div>
    `).join('');
}

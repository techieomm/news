const API_KEY = "29650ca2fdda94918f5359b6bd3dc5cd"; // ⚠️ Visible on GitHub (OK for college projects)
const BASE_URL = "https://gnews.io/api/v4";

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
        title.innerText =
            currentCategory.charAt(0).toUpperCase() +
            currentCategory.slice(1) +
            ' News';

        searchQuery = '';
        searchInput.value = '';
        loadNews();
    });
});

searchInput.addEventListener('keyup', e => {
    searchQuery = e.target.value.trim();
    if (searchQuery.length > 2 || searchQuery.length === 0) {
        loadNews();
    }
});

async function loadNews() {
    grid.innerHTML = 'Loading...';
    hero.innerHTML = '';

    const url = searchQuery
        ? `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&apikey=${API_KEY}`
        : `${BASE_URL}/top-headlines?category=${currentCategory}&lang=en&max=10&apikey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            grid.innerHTML = 'No articles found';
            return;
        }

        renderNews(data.articles);
    } catch (error) {
        console.error(error);
        grid.innerHTML = 'Failed to load news';
    }
}

function renderNews(articles) {
    const heroArticle = articles[0];

    hero.innerHTML = `
        <div class="hero-card">
            <img src="${heroArticle.image || ''}">
            <div class="hero-overlay">
                <h1>${heroArticle.title}</h1>
            </div>
        </div>
    `;

    grid.innerHTML = articles.slice(1).map(article => `
        <div class="card">
            <img src="${article.image || ''}">
            <div class="card-body">
                <div class="card-title">${article.title}</div>
                <p>${article.description || ''}</p>
            </div>
        </div>
    `).join('');
}

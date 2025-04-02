// Aktive Navigation markieren
function updateActiveNav() {
    const currentPath = window.location.hash || '#home';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Event Listener für Navigation
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    window.addEventListener('hashchange', updateActiveNav);
});

// Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling für Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Download Funktionalität
const downloadPassword = document.getElementById('download-password');
const checkPassword = document.getElementById('check-password');
const downloadLink = document.getElementById('download-link');
const passwordError = document.getElementById('password-error');
const downloadButton = document.getElementById('download-button');

// Passwort-Überprüfung
checkPassword.addEventListener('click', () => {
    if (downloadPassword.value === CONFIG.downloadPassword) {
        downloadLink.style.display = 'block';
        passwordError.style.display = 'none';
        downloadButton.href = CONFIG.downloadLink;
    } else {
        passwordError.style.display = 'block';
        downloadLink.style.display = 'none';
    }
});

// Hero Button Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    const heroButton = document.querySelector('.hero .btn');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            const downloadSection = document.querySelector('.download');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Version Management
document.getElementById('current-version').textContent = CONFIG.version;
document.getElementById('download-version').textContent = CONFIG.version;

// News laden
const newsSearch = document.getElementById('news-search');
let newsData = [];

async function loadNews() {
    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = '<div class="loading"></div>';

    try {
        const response = await fetch('./data/news.json');
        if (!response.ok) throw new Error('Netzwerk-Antwort war nicht ok');
        const data = await response.json();
        newsData = data.news;
        displayNews(newsData);
    } catch (error) {
        console.error('Fehler beim Laden der News:', error);
        newsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Entschuldigung, die News konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
            </div>
        `;
    }
}

function displayNews(news) {
    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = '';

    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.style.animationDelay = `${index * 0.1}s`;
        
        let imageHtml = '';
        if (item.hasImage) {
            imageHtml = `
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://picsum.photos/800/400?random=${index}'">
                </div>
            `;
        }

        let patchNotesHtml = '';
        if (item.patchNotes) {
            patchNotesHtml = `
                <div class="patch-notes">
                    <h4>${item.patchNotes.title}</h4>
                    <ul>
                        ${item.patchNotes.items.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        newsItem.innerHTML = `
            ${imageHtml}
            <div class="news-content">
                <div class="news-date">${item.date}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                ${patchNotesHtml}
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

newsSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNews = newsData.filter(news => 
        news.title.toLowerCase().includes(searchTerm) ||
        news.description.toLowerCase().includes(searchTerm)
    );
    displayNews(filteredNews);
});

// Changelog laden
const changelogSearch = document.getElementById('changelog-search');
const filterButtons = document.querySelectorAll('.filter-btn');
let changelogData = [];

async function loadChangelog() {
    const changelogContainer = document.querySelector('.changelog-container');
    changelogContainer.innerHTML = '<div class="loading"></div>';

    try {
        const response = await fetch('./data/changelog.json');
        if (!response.ok) throw new Error('Netzwerk-Antwort war nicht ok');
        const data = await response.json();
        changelogData = data.changelog;
        displayChangelog(changelogData);
    } catch (error) {
        console.error('Fehler beim Laden des Changelogs:', error);
        changelogContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Entschuldigung, der Changelog konnte nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
            </div>
        `;
    }
}

function displayChangelog(changelog) {
    const changelogContainer = document.querySelector('.changelog-container');
    changelogContainer.innerHTML = '';

    changelog.forEach((version, index) => {
        const versionItem = document.createElement('div');
        versionItem.className = 'changelog-item';
        versionItem.style.animationDelay = `${index * 0.1}s`;
        
        let changesHtml = '';
        version.changes.forEach(change => {
            changesHtml += `
                <div class="change-type ${change.type}">
                    <h4>${change.title}</h4>
                    <ul>
                        ${change.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        });

        versionItem.innerHTML = `
            <div class="version-header">
                <h3>Version ${version.version}</h3>
                <span class="version-date">${version.date}</span>
            </div>
            ${changesHtml}
        `;
        changelogContainer.appendChild(versionItem);
    });
}

changelogSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredChangelog = changelogData.filter(version => 
        version.version.toLowerCase().includes(searchTerm) ||
        version.changes.some(change => 
            change.title.toLowerCase().includes(searchTerm) ||
            change.items.some(item => item.toLowerCase().includes(searchTerm))
        )
    );
    displayChangelog(filteredChangelog);
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;
        const filteredChangelog = filter === 'all' 
            ? changelogData 
            : changelogData.map(version => ({
                ...version,
                changes: version.changes.filter(change => change.type === filter)
            })).filter(version => version.changes.length > 0);

        displayChangelog(filteredChangelog);
    });
});

// Lade News und Changelog beim Start
loadNews();
loadChangelog();

// Responsive Navigation
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
});

// "Zurück nach oben" Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}); 
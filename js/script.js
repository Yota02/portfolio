document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeModal();
    /* initializeDaruma(); */
    initializeKanjiEffects();
});

// Configuration des galeries de projets
const projectGalleries = {
    'CodeTonFutur': {
        images: [
            '../images/projet/CodeTonFutur/chatbot.png',
            '../images/projet/CodeTonFutur/Exercice1.png',
            '../images/projet/CodeTonFutur/main.png'
        ],
        titles: [
            'Chatbot IA',
            'Exercices Interactifs',
            'Interface Principale'
        ],
        descriptions: [
            'Interface de discussion avec notre assistant virtuel',
            'Plateforme d\'exercices avec correction instantanée',
            'Dashboard personnalisé pour suivre sa progression'
        ]
    },
    'StarGuardian': {
        images: [
            '../images/projet/StarGuardian/execl_star_guardian.png',
            '../images/projet/CodeTonFutur/Exercice1.png',
            '../images/projet/CodeTonFutur/main.png'
        ],
        titles: [
            'Execl final',
            'Exercices Interactifs',
            'Interface Principale'
        ],
        descriptions: [
            'Interface de discussion avec notre assistant virtuel',
            'Plateforme d\'exercices avec correction instantanée',
            'Dashboard personnalisé pour suivre sa progression'
        ]
    },
    'PlayToWin': {
        images: [
            '../images/projet/PlayToWin/playtowin.png',
            '../images/projet/PlayToWin/liste-coach.gif',
            '../images/projet/PlayToWin/admin.png',
            '../images/projet/PlayToWin/service.gif',
        ],
        titles: [
            'Chatbot IA',
            'Exercices Interactifs',
            'Interface Principale'
        ],
        descriptions: [
            'Interface de discussion avec notre assistant virtuel',
            'Plateforme d\'exercices avec correction instantanée',
            'Dashboard personnalisé pour suivre sa progression',
            'Service '
        ]
    },
    'BreakTheCode': {
        images: [
            '../images/projet/CTF/cristal_malicieux.gif',
            '../images/projet/CTF/rainbow_jumper.gif',
            '../images/projet/CTF/ssh.png',
            '../images/projet/CTF/challenges.gif',
            '../images/projet/CTF/affichage_challenge.png',
            '../images/projet/CTF/wordpress_defis.png',
        ],
        titles: [
            'Chatbot IA',
            'Exercices Interactifs',
            'Interface Principale'
        ],
        descriptions: [
            'Interface de discussion avec notre assistant virtuel',
            'Plateforme d\'exercices avec correction instantanée',
            'Dashboard personnalisé pour suivre sa progression'
        ]
    },
    // Ajoutez d'autres projets ici
};


let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Effet manga/anime
            const elements = document.querySelectorAll('h1, h2, h3');
            elements.forEach(el => {
                el.style.fontFamily = "'Comic Sans MS', cursive";
                el.style.transition = 'all 0.5s';
                el.dataset.originalText = el.textContent;
                el.textContent = `${el.textContent} ゼロツー`;
            });

            // Jouer un son d'anime
            const animeSound = new Audio('sounds/anime-wow.mp3');
            animeSound.play();

            // Créer l'effet de pétales qui tombent
            createSakuraPetals();

            // Retour à la normale après 5 secondes
            setTimeout(() => {
                elements.forEach(el => {
                    el.style.fontFamily = '';
                    el.textContent = el.dataset.originalText;
                });
            }, 5000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function createSakuraPetals() {
    const petals = ['🌸', '🌺']; // Différents types de pétales
    for (let i = 0; i < 60; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = -50 + 'px'; // Commence au-dessus de l'écran
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
        document.body.appendChild(petal);

        // Supprimer les pétales après leur animation
        setTimeout(() => {
            petal.remove();
        }, 10000);
    }
}

let darumaClicks = 0;
const darumaMessages = ['がんばって！', 'よくできました！', '素晴らしい！'];

function initializeDaruma() {
    const daruma = document.createElement('div');
    daruma.className = 'daruma';
    daruma.innerHTML = '🎎';
    daruma.style.position = 'fixed';
    daruma.style.bottom = '20px';
    daruma.style.right = '20px';
    daruma.style.fontSize = '30px';
    daruma.style.cursor = 'pointer';
    
    daruma.addEventListener('click', () => {
        darumaClicks++;
        if (darumaClicks % 3 === 0) {
            const msg = darumaMessages[Math.floor(Math.random() * darumaMessages.length)];
            showJapaneseMessage(msg);
        }
        daruma.style.transform = `scale(${1 + (darumaClicks % 3) * 0.1})`;
    });
    
    document.body.appendChild(daruma);
}

function showJapaneseMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'japanese-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

function initializeKanjiEffects() {
    const kanji = ['夢', '希望', '努力', '成功', '技術'];
    let kanjiIndex = 0;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY % 200 === 0) {
            const floatingKanji = document.createElement('div');
            floatingKanji.className = 'floating-kanji';
            floatingKanji.textContent = kanji[kanjiIndex];
            floatingKanji.style.left = `${Math.random() * 100}vw`;
            document.body.appendChild(floatingKanji);
            
            kanjiIndex = (kanjiIndex + 1) % kanji.length;
            
            setTimeout(() => floatingKanji.remove(), 3000);
        }
    });
}


// Variables globales pour la galerie
let currentProject = '';
let currentSlideIndex = 0;

// Initialisation de la navigation
function initializeNavigation() {
    const isIndexPage = document.getElementById('accueil') !== null;
    const navLinks = document.querySelectorAll('.main-nav a');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 60;

    setupSmoothScrolling(navLinks, isIndexPage, headerHeight);
    if (isIndexPage) {
        setupScrollspy(navLinks, headerHeight);
    } else {
        setActiveProjectNav(navLinks);
    }
}

// Configuration du défilement fluide
function setupSmoothScrolling(navLinks, isIndexPage, headerHeight) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isInternalLink = href.startsWith('#') || href.startsWith('index.html#');

        if (isInternalLink) {
            link.addEventListener('click', (e) => handleNavClick(e, link, isIndexPage, headerHeight));
        }
    });
}

// Gestion des clics de navigation
function handleNavClick(e, link, isIndexPage, headerHeight) {
    const targetId = link.getAttribute('href').split('#')[1];
    const targetElement = document.getElementById(targetId);

    if (targetElement && isIndexPage) {
        e.preventDefault();
        scrollToElement(targetElement, headerHeight);
    } else if (link.getAttribute('href').startsWith('index.html#')) {
        window.location.href = link.getAttribute('href');
    }
}

// Défilement vers un élément
function scrollToElement(element, headerHeight) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 20;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Configuration du Scrollspy
function setupScrollspy(navLinks, headerHeight) {
    const sections = document.querySelectorAll('section[id]');
    
    const activateNavLinks = () => {
        const scrollPosition = window.pageYOffset + headerHeight + 50;
        let currentSectionId = '';

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && 
                scrollPosition < section.offsetTop + section.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        updateActiveNavLink(navLinks, currentSectionId);
    };

    window.addEventListener('scroll', activateNavLinks);
    activateNavLinks();
}

// Mise à jour du lien actif
function updateActiveNavLink(navLinks, currentSectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${currentSectionId}` || linkHref === `index.html#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Configuration du lien Projets actif
function setActiveProjectNav(navLinks) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes('#projets')) {
            link.classList.add('active');
        }
    });
}

// Initialisation de la galerie
function initializeGallery() {
    const projectPath = window.location.pathname.split('/').pop().replace('.html', '');
    currentProject = projectPath;
    
    if (projectGalleries[currentProject]) {
        setupGalleryGrid();
    }
}

// Configuration de la grille de la galerie
function setupGalleryGrid() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const gallery = projectGalleries[currentProject];
    galleryGrid.innerHTML = gallery.images.map((src, index) => `
        <div class="gallery-item">
            <img src="${src}" alt="${gallery.titles[index]}" onclick="openModal(${index})">
            <div class="gallery-overlay">
                <h3>${gallery.titles[index]}</h3>
                <p>${gallery.descriptions[index]}</p>
            </div>
        </div>
    `).join('');
}

// Initialisation du modal
function initializeModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    setupModalEvents();
    setupKeyboardNavigation();
}

// Configuration des événements du modal
function setupModalEvents() {
    const modal = document.getElementById('imageModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Configuration de la navigation au clavier
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('imageModal').style.display !== 'block') return;

        switch(e.key) {
            case 'ArrowLeft': changeSlide(-1); break;
            case 'ArrowRight': changeSlide(1); break;
            case 'Escape': closeModal(); break;
        }
    });
}

// Fonctions de gestion du modal
function openModal(index) {
    if (!projectGalleries[currentProject]) return;
    
    document.getElementById('imageModal').style.display = 'block';
    currentSlideIndex = index;
    showSlide();
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function changeSlide(direction) {
    if (!projectGalleries[currentProject]) return;
    
    const images = projectGalleries[currentProject].images;
    currentSlideIndex = (currentSlideIndex + direction + images.length) % images.length;
    showSlide();
}

function showSlide() {
    if (!projectGalleries[currentProject]) return;
    
    const gallery = projectGalleries[currentProject];
    const modalImg = document.getElementById('modalImage');
    const counter = document.getElementById('imageCounter');
    
    modalImg.src = gallery.images[currentSlideIndex];
    counter.textContent = `${currentSlideIndex + 1} / ${gallery.images.length}`;
}

// Fonction pour le défilement vers une catégorie
function scrollToCategory(categoryId) {
    if (!categoryId) return;
    
    const element = document.getElementById(categoryId);
    if (!element) return;

    const headerOffset = 150;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

// Ajouter ces nouvelles fonctions après les fonctions modal existantes

function openMainImageModal() {
    const mainImage = document.querySelector('.main-project-image');
    const modal = document.getElementById('mainImageModal');
    const modalImg = document.getElementById('mainModalImage');
    
    if (!mainImage || !modal || !modalImg) return;
    
    modal.style.display = 'block';
    modalImg.src = mainImage.src;
    
    // Ajouter un gestionnaire d'événements pour fermer avec Escape
    document.addEventListener('keydown', closeMainImageModalOnEscape);
}

function closeMainImageModal() {
    const modal = document.getElementById('mainImageModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    // Retirer le gestionnaire d'événements
    document.removeEventListener('keydown', closeMainImageModalOnEscape);
}

function closeMainImageModalOnEscape(e) {
    if (e.key === 'Escape') {
        closeMainImageModal();
    }
}

// Modifier la fonction initializeModal pour inclure la nouvelle modal
function initializeModal() {
    const galleryModal = document.getElementById('imageModal');
    const mainModal = document.getElementById('mainImageModal');
    
    if (galleryModal) {
        setupModalEvents();
        setupKeyboardNavigation();
    }
    
    if (mainModal) {
        mainModal.addEventListener('click', (e) => {
            if (e.target === mainModal) {
                closeMainImageModal();
            }
        });
    }
}
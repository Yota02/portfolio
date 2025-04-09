document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeModal();
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
    // Ajoutez d'autres projets ici
};

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
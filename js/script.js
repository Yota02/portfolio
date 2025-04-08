document.addEventListener('DOMContentLoaded', () => {

    const isIndexPage = document.getElementById('accueil') !== null; // Vérifie si on est sur index.html
    const navLinks = document.querySelectorAll('.main-nav a');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 60; // Hauteur par défaut si header non trouvé

    // --- Smooth scrolling (seulement pour les liens internes sur index.html) ---
    navLinks.forEach(link => {
        // Vérifie si le lien pointe vers une ancre sur la page actuelle OU vers index.html
        const href = link.getAttribute('href');
        const isInternalLink = href.startsWith('#') || href.startsWith('index.html#');

        if (isInternalLink) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').split('#')[1]; // Extrait l'ID après #
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                     e.preventDefault(); // Empêche le saut uniquement si la cible est sur cette page

                     // Si on est sur une page projet et on clique sur un lien vers index.html#...
                    if (!isIndexPage && href.startsWith('index.html#')) {
                         window.location.href = href; // Redirige simplement
                         // Le scroll se fera au chargement de index.html (voir ci-dessous)
                    } else if (isIndexPage) {
                        // Scroll fluide sur index.html
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerHeight - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                } else if (href.startsWith('index.html#')) {
                     // Si on est sur une page projet et l'élément n'est pas trouvé (normal), redirige
                      window.location.href = href;
                }
            });
        }
    });

    // --- Active Navigation Link Highlighting ---
    if (isIndexPage) {
        // Scrollspy uniquement sur index.html
        const sections = document.querySelectorAll('section[id]');

        const activateNavLinks = () => {
            let currentSectionId = '';
            const scrollPosition = window.pageYOffset + headerHeight + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

             // Cas spécial pour être tout en haut (section accueil)
             if (window.pageYOffset < sections[0].offsetTop - headerHeight) {
                 currentSectionId = sections[0].getAttribute('id');
             }

            navLinks.forEach(link => {
                link.classList.remove('active');
                // Compare l'ID de section avec la partie après # dans href
                 const linkHref = link.getAttribute('href');
                if (linkHref === `#${currentSectionId}` || linkHref === `index.html#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', activateNavLinks);
        activateNavLinks(); // Initial call

        // --- Scroll vers l'ancre si on arrive depuis une autre page ---
        if (window.location.hash) {
             setTimeout(() => { // Timeout pour laisser le temps au DOM de se stabiliser
                 const targetElement = document.querySelector(window.location.hash);
                 if (targetElement) {
                     const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                     const offsetPosition = elementPosition - headerHeight - 20;
                     window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                 }
             }, 100);
         }

    } else {
        // Si ce n'est pas index.html (donc une page projet), forcer 'Projets' à être actif
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes('#projets')) {
                link.classList.add('active');
            }
        });
    }

    // --- Ajouter d'autres interactions si besoin ---

}); // End DOMContentLoaded

function scrollToCategory(categoryId) {
    if (!categoryId) return;
    
    const element = document.getElementById(categoryId);
    const headerOffset = 150; // Ajuster selon la hauteur du header + menu
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les éléments communs
    initializeHeaderEffects();
    initializeProgressBars();
    initializeGallery();
    initializeFormHandlers();
    initializeModals();
    
    // Animations spécifiques selon le type de projet
    const projectType = document.body.dataset.projectType;
    if (projectType) {
        initializeSpecificTypeEffects(projectType);
    }
});

/**
 * Initialisation des effets d'en-tête et animations de défilement
 */
function initializeHeaderEffects() {
    // Animation du titre principal
    const mainTitle = document.querySelector('.project-header h1');
    if (mainTitle) {
        mainTitle.classList.add('animated');
        
        // Animation du sous-titre avec délai
        const subtitle = document.querySelector('.project-subtitle');
        if (subtitle) {
            setTimeout(() => {
                subtitle.classList.add('visible');
            }, 300);
        }
    }
    
    // Animation au défilement
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Ne plus observer une fois l'effet appliqué
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Initialisation et animation des barres de progression
 */
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(container => {
        const progressBar = container.querySelector('.progress');
        const progressValue = container.querySelector('.progress-value');
        
        if (progressBar && progressValue) {
            const targetWidth = progressBar.dataset.value || '0%';
            
            // Animation progressive de la barre
            setTimeout(() => {
                progressBar.style.width = targetWidth;
                
                // Mettre à jour le compteur pendant l'animation
                const percentage = parseInt(targetWidth);
                let currentValue = 0;
                const duration = 1500; // ms
                const interval = 20; // ms
                const increment = percentage / (duration / interval);
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= percentage) {
                        currentValue = percentage;
                        clearInterval(counter);
                    }
                    progressValue.textContent = Math.round(currentValue) + '%';
                }, interval);
            }, 500);
        }
    });
}

/**
 * Initialisation de la galerie d'images
 */
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Animer les éléments de la galerie avec un délai séquentiel
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 100 * index);
        
        // Ajouter l'effet de zoom au clic
        const itemImage = item.querySelector('img');
        if (itemImage) {
            itemImage.addEventListener('click', function() {
                openModal(this.src, this.alt);
            });
        }
    });
}

/**
 * Gestion des formulaires
 */
function initializeFormHandlers() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'envoi du formulaire
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Merci pour votre commentaire !';
                
                commentForm.replaceWith(successMessage);
            }, 1000);
        });
    }
    
    // Gestion du formulaire de feedback
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Afficher la confirmation
            document.getElementById('feedbackContainer').classList.add('submitted');
        });
    }
}

/**
 * Initialisation des modales
 */
function initializeModals() {
    // Modal pour les images
    const modal = document.getElementById('imageModal');
    if (modal) {
        // Fermeture de la modale
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        // Fermer la modale au clic en dehors de l'image
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    // Modales de dialogue
    const dialogTriggers = document.querySelectorAll('[data-open-dialog]');
    dialogTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const dialogId = this.dataset.openDialog;
            const dialog = document.getElementById(dialogId);
            
            if (dialog) {
                dialog.classList.add('open');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    // Fermeture des dialogues
    const dialogClosers = document.querySelectorAll('[data-close-dialog]');
    dialogClosers.forEach(closer => {
        closer.addEventListener('click', function() {
            const dialogId = this.dataset.closeDialog;
            const dialog = document.getElementById(dialogId);
            
            if (dialog) {
                dialog.classList.remove('open');
                document.body.classList.remove('modal-open');
            }
        });
    });
}

/**
 * Ouvre la modal d'image
 */
function openModal(src, alt) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.style.display = 'flex';
        modalImg.src = src;
        modalImg.alt = alt || 'Image agrandie';
        
        document.body.classList.add('modal-open');
    }
}

/**
 * Ferme la modal d'image
 */
function closeModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * Initialise des effets spécifiques selon le type de projet
 */
function initializeSpecificTypeEffects(projectType) {
    switch(projectType) {
        case 'prototype':
            initializePrototypeEffects();
            break;
        case 'experimental':
            initializeExperimentalEffects();
            break;
        case 'conceptual':
            initializeConceptualEffects();
            break;
    }
    
    // Ajout d'un effet visuel spécifique au type dans l'en-tête
    addHeaderTypeEffect(projectType);
}

/**
 * Ajoute un effet visuel dans l'en-tête selon le type
 */
function addHeaderTypeEffect(projectType) {
    const header = document.querySelector('.project-header');
    if (!header) return;
    
    // Création d'un élément d'arrière-plan
    const bgEffect = document.createElement('div');
    bgEffect.className = `header-bg-effect ${projectType}`;
    
    // Styles spécifiques par type
    switch(projectType) {
        case 'prototype':
            for (let i = 0; i < 5; i++) {
                const circle = document.createElement('div');
                circle.className = 'bg-circle prototype';
                circle.style.top = `${Math.random() * 100}%`;
                circle.style.left = `${Math.random() * 100}%`;
                circle.style.width = `${Math.random() * 50 + 20}px`;
                circle.style.height = circle.style.width;
                circle.style.opacity = Math.random() * 0.2 + 0.1;
                bgEffect.appendChild(circle);
            }
            break;
            
        case 'experimental':
            for (let i = 0; i < 8; i++) {
                const line = document.createElement('div');
                line.className = 'bg-line experimental';
                line.style.top = `${Math.random() * 100}%`;
                line.style.left = `${Math.random() * 100}%`;
                line.style.width = `${Math.random() * 100 + 50}px`;
                line.style.transform = `rotate(${Math.random() * 360}deg)`;
                line.style.opacity = Math.random() * 0.15 + 0.05;
                bgEffect.appendChild(line);
            }
            break;
            
        case 'conceptual':
            for (let i = 0; i < 3; i++) {
                const blob = document.createElement('div');
                blob.className = 'bg-blob conceptual';
                blob.style.top = `${Math.random() * 100}%`;
                blob.style.left = `${Math.random() * 100}%`;
                blob.style.opacity = Math.random() * 0.1 + 0.05;
                bgEffect.appendChild(blob);
            }
            break;
    }
    
    // Insérer l'effet en arrière-plan
    header.style.position = 'relative';
    header.style.overflow = 'hidden';
    header.insertBefore(bgEffect, header.firstChild);
}

/**
 * Effets spécifiques aux prototypes
 */
function initializePrototypeEffects() {
    // Animation des éléments interactifs
    const interactiveElements = document.querySelectorAll('.interactive-element');
    interactiveElements.forEach(el => {
        el.addEventListener('click', function() {
            // Désactiver tous les éléments
            interactiveElements.forEach(item => item.classList.remove('active'));
            // Activer l'élément cliqué
            this.classList.add('active');
            
            // Effet de highlight temporaire
            const highlight = document.createElement('span');
            highlight.className = 'element-highlight';
            this.appendChild(highlight);
            
            setTimeout(() => {
                if (highlight && highlight.parentNode) {
                    highlight.parentNode.removeChild(highlight);
                }
            }, 700);
        });
    });
    
    // Gestion du formulaire de feedback
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animation de soumission
            const submitBtn = this.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            // Simuler l'envoi et afficher la confirmation
            setTimeout(() => {
                document.getElementById('feedbackContainer').classList.add('submitted');
            }, 1000);
        });
    }
    
    // Ajouter des effets de survol aux listes de fonctionnalités
    const featureItems = document.querySelectorAll('.feature-list li');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '30px';
            this.style.color = 'var(--prototype-color)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '25px';
            this.style.color = '';
        });
    });
}

/**
 * Effets spécifiques aux projets expérimentaux
 */
function initializeExperimentalEffects() {
    // Effet de laboratoire avec particules
    document.querySelectorAll('.lab-effect').forEach(element => {
        // Animation au survol avec effet de particules
        element.addEventListener('mousemove', function(e) {
            // Effet parallaxe léger
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Effet de déplacement subtil
            const moveX = (x - rect.width / 2) / 30;
            const moveY = (y - rect.height / 2) / 30;
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Génération occasionnelle de particules
            if (Math.random() > 0.92) {
                createParticle(x, y, this);
            }
        });
        
        // Réinitialiser la position au départ du survol
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
    
    // Fluctuations aléatoires pour les données
    simulateDataFluctuations();
    
    // Ajout d'un effet visuel expérimental
    const mainImage = document.querySelector('.main-project-image');
    if (mainImage) {
        // Appliquer un effet de glitch occasionnellement
        setInterval(() => {
            if (Math.random() > 0.7) {
                applyGlitchEffect(mainImage);
            }
        }, 5000);
    }
}

/**
 * Crée une particule pour l'effet de laboratoire
 */
function createParticle(x, y, parent) {
    const particle = document.createElement('span');
    particle.className = 'lab-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Ajouter une trajectoire aléatoire
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 30 + 10;
    particle.style.setProperty('--move-x', `${Math.cos(angle) * speed}px`);
    particle.style.setProperty('--move-y', `${Math.sin(angle) * speed}px`);
    
    parent.appendChild(particle);
    
    // Supprimer après l'animation
    setTimeout(() => {
        if (particle.parentNode === parent) {
            parent.removeChild(particle);
        }
    }, 1000);
}

/**
 * Simule des fluctuations de données pour les moniteurs
 */
function simulateDataFluctuations() {
    const dataValues = document.querySelectorAll('.monitor-value');
    
    dataValues.forEach(value => {
        // Stocker la valeur initiale
        const initialValue = parseFloat(value.textContent);
        
        // Simuler des fluctuations périodiques
        setInterval(() => {
            // Fluctuation aléatoire de ±5%
            const fluctuation = (Math.random() - 0.5) * 2 * (initialValue * 0.05);
            const newValue = (initialValue + fluctuation).toFixed(1);
            
            // Ajouter une classe pour l'animation avant le changement
            value.classList.add('value-change');
            
            // Actualiser la valeur affichée
            setTimeout(() => {
                value.textContent = newValue;
                setTimeout(() => {
                    value.classList.remove('value-change');
                }, 300);
            }, 100);
        }, 3000 + Math.random() * 2000); // Intervalle variable
    });
}

/**
 * Applique un effet de glitch temporaire à une image
 */
function applyGlitchEffect(element) {
    // Ajouter la classe d'effet
    element.classList.add('glitch-effect');
    
    // Créer des couches de glitch
    const glitchLayers = 3;
    for (let i = 0; i < glitchLayers; i++) {
        const glitchLayer = document.createElement('div');
        glitchLayer.className = `glitch-layer layer-${i+1}`;
        glitchLayer.style.backgroundImage = `url(${element.src})`;
        element.parentNode.appendChild(glitchLayer);
    }
    
    // Supprimer l'effet après un court délai
    setTimeout(() => {
        element.classList.remove('glitch-effect');
        document.querySelectorAll('.glitch-layer').forEach(layer => {
            if (layer.parentNode) {
                layer.parentNode.removeChild(layer);
            }
        });
    }, 1000);
}

/**
 * Effets spécifiques aux projets conceptuels
 */
function initializeConceptualEffects() {
    // Effet de zoom sur les diagrammes conceptuels
    const conceptDiagrams = document.querySelectorAll('.concept-diagram');
    conceptDiagrams.forEach(setupZoomEffect);
    
    // Animation des connexions entre concepts
    animateConceptConnections();
    
    // Effet de surlignage sur les textes théoriques
    setupTextHighlighting();
    
    // Animation des caractères japonais au survol
    setupJapaneseTextEffects();
}

/**
 * Configure l'effet de zoom sur un diagramme
 */
function setupZoomEffect(diagram) {
    const img = diagram.querySelector('img');
    if (!img) return;
    
    // Créer le conteneur de zoom
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-container';
    
    // Créer l'image zoomée
    const zoomedImg = document.createElement('img');
    zoomedImg.src = img.src;
    zoomedImg.alt = img.alt;
    zoomedImg.className = 'zoomed-image';
    
    zoomContainer.appendChild(zoomedImg);
    document.body.appendChild(zoomContainer);
    
    // Gérer le survol pour l'effet de zoom
    diagram.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        zoomedImg.style.transformOrigin = `${x}% ${y}%`;
        
        // Positionner le zoom près du curseur
        zoomContainer.style.display = 'block';
        zoomContainer.style.left = `${e.clientX + 20}px`;
        zoomContainer.style.top = `${e.clientY - 100}px`;
    });
    
    // Masquer le zoom quand on quitte le diagramme
    diagram.addEventListener('mouseleave', function() {
        zoomContainer.style.display = 'none';
    });
}

/**
 * Anime les connexions entre concepts
 */
function animateConceptConnections() {
    const connections = document.querySelectorAll('.concept-connection');
    
    // Animation séquentielle
    connections.forEach((connection, index) => {
        // Animation initiale avec délai séquentiel
        setTimeout(() => {
            connection.classList.add('pulse');
            setTimeout(() => {
                connection.classList.remove('pulse');
            }, 1000);
        }, index * 400);
        
        // Animation périodique aléatoire
        setInterval(() => {
            if (Math.random() > 0.7) {
                connection.classList.add('pulse');
                setTimeout(() => {
                    connection.classList.remove('pulse');
                }, 1000);
            }
        }, 5000 + Math.random() * 3000);
    });
}

/**
 * Configure l'effet de surlignage des textes théoriques
 */
function setupTextHighlighting() {
    const paragraphs = document.querySelectorAll('.discussion-point p');
    
    paragraphs.forEach(paragraph => {
        paragraph.addEventListener('mouseenter', function() {
            // Sélection aléatoire de mots clés à mettre en évidence
            const text = this.innerHTML;
            const words = text.split(' ');
            
            // Mots à mettre en évidence (environ 15%)
            const highlightCount = Math.max(1, Math.floor(words.length * 0.15));
            const indices = [];
            
            // Sélectionner des indices aléatoires
            while (indices.length < highlightCount) {
                const index = Math.floor(Math.random() * words.length);
                if (words[index].length > 4 && !indices.includes(index)) {
                    indices.push(index);
                }
            }
            
            // Appliquer le surlignage
            indices.forEach(index => {
                words[index] = `<span class="highlight-conceptual">${words[index]}</span>`;
            });
            
            this.innerHTML = words.join(' ');
        });
        
        paragraph.addEventListener('mouseleave', function() {
            // Restaurer le texte original (supprimer les spans)
            const text = this.innerText;
            this.innerHTML = text;
        });
    });
}

/**
 * Configure les effets sur le texte japonais
 */
function setupJapaneseTextEffects() {
    const headingsWithJP = document.querySelectorAll('h3[data-jp]');
    
    headingsWithJP.forEach(heading => {
        heading.addEventListener('mouseenter', function() {
            // Afficher le texte japonais avec un effet de fade
            const jpText = this.getAttribute('data-jp');
            const jpSpan = document.createElement('span');
            jpSpan.className = 'jp-text-effect';
            jpSpan.textContent = jpText;
            
            this.appendChild(jpSpan);
            
            setTimeout(() => {
                jpSpan.style.opacity = '1';
                jpSpan.style.transform = 'translateY(0)';
            }, 10);
        });
        
        heading.addEventListener('mouseleave', function() {
            const jpSpan = this.querySelector('.jp-text-effect');
            if (jpSpan) {
                jpSpan.style.opacity = '0';
                jpSpan.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    if (jpSpan.parentNode === this) {
                        this.removeChild(jpSpan);
                    }
                }, 500);
            }
        });
    });
}

// Fonction openMainImageModal mise à jour pour être utilisée dans une namespace
function openMainImageModal() {
    const mainImage = document.querySelector('.main-project-image');
    const modal = document.getElementById('mainImageModal');
    const modalImg = document.getElementById('mainModalImage');
    
    if (mainImage && modal && modalImg) {
        modal.style.display = 'block';
        modalImg.src = mainImage.src;
        document.body.classList.add('modal-open');
    }
}

// Exporter les fonctions dans un namespace
window.mainTemplate = {
    openModal: openMainImageModal,
    closeModal: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.classList.remove('modal-open');
    },
    changeSlide: function(direction) {
        changeSlide(direction);
    }
};

// Exportation des fonctions utilitaires
window.labTemplate = {
    openModal,
    closeModal
};
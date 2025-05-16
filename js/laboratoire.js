document.addEventListener('DOMContentLoaded', function() {
    // Filtrage des projets
    const filterButtons = document.querySelectorAll('.filter-btn');
    const labCards = document.querySelectorAll('.lab-card');
    
    // Animation d'entrée initiale avec séquençage amélioré
    setTimeout(() => {
        labCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade', 'show');
                // Ajouter une petite rotation aléatoire pour un effet naturel
                const randomRotate = (Math.random() * 2 - 1) * 1;
                card.style.transform = `rotateZ(${randomRotate}deg)`;
                setTimeout(() => {
                    card.style.transform = '';
                }, 500);
            }, index * 150); // Délai augmenté pour une entrée plus séquentielle
        });
    }, 300);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Animation du bouton au clic
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
            
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filtrage des cartes avec animation améliorée
            labCards.forEach(card => {
                card.classList.remove('show');
                
                setTimeout(() => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        // Délai aléatoire pour effet cascade naturel
                        const randomDelay = Math.floor(Math.random() * 200);
                        setTimeout(() => {
                            card.classList.add('show');
                        }, 50 + randomDelay);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    // Animation des barres de progression améliorées
    const progressBars = document.querySelectorAll('.progress');
    
    // Fonction d'animation des barres avec effet de progression
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            // Détecter quand la carte est visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation séquentielle
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(bar.closest('.lab-card'));
        });
    };
    
    animateProgressBars();

    // Créer des effets d'ondulation (ripple) sur les boutons du laboratoire
    const labButtons = document.querySelectorAll('.lab-button');
    labButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Gestion du formulaire d'idées avec animation améliorée
    const ideaButton = document.getElementById('openIdeaForm');
    const ideaFormOverlay = document.getElementById('ideaFormOverlay');
    const closeForm = document.querySelector('.close-form');
    const ideaForm = document.getElementById('ideaForm');
    
    if (ideaButton && ideaFormOverlay) {
        ideaButton.addEventListener('click', () => {
            ideaFormOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animation d'entrée du formulaire
            const formContainer = ideaFormOverlay.querySelector('.idea-form-container');
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(50px) scale(0.95)';
            
            setTimeout(() => {
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0) scale(1)';
            }, 100);
        });
        
        // Fonction pour fermer le formulaire avec animation de sortie
        const closeFormWithAnimation = () => {
            const formContainer = ideaFormOverlay.querySelector('.idea-form-container');
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                ideaFormOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                // Réinitialiser pour la prochaine ouverture
                formContainer.style.transition = 'none';
                setTimeout(() => {
                    formContainer.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }, 50);
            }, 300);
        };
        
        closeForm.addEventListener('click', closeFormWithAnimation);
        
        ideaFormOverlay.addEventListener('click', (e) => {
            if (e.target === ideaFormOverlay) {
                closeFormWithAnimation();
            }
        });
    }
    
    // Bouton "Charger plus" pour le journal
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simuler le chargement de nouvelles entrées
            const journalEntries = document.querySelector('.journal-entries');
            
            // Exemple d'entrées supplémentaires
            const newEntries = [
                {
                    date: '5 Janvier 2025',
                    title: 'Percée dans le traitement du langage naturel',
                    content: 'J\'ai réussi à améliorer la compréhension contextuelle de mon modèle NLP en introduisant une nouvelle couche d\'attention qui prend en compte les relations entre phrases distantes.',
                    tags: ['NLP', 'Deep Learning']
                },
                {
                    date: '17 Décembre 2024',
                    title: 'Tests initiaux sur le compilateur quantique',
                    content: 'Les premiers tests montrent une réduction de 40% du temps de compilation pour les algorithmes quantiques simples. Les prochaines étapes consisteront à optimiser pour des algorithmes plus complexes.',
                    tags: ['Quantum', 'Compilation']
                }
            ];
            
            // Création des nouvelles entrées
            newEntries.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.classList.add('journal-entry');
                
                entryElement.innerHTML = `
                    <div class="entry-date">${entry.date}</div>
                    <h3>${entry.title}</h3>
                    <p>${entry.content}</p>
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                    </div>
                `;
                
                journalEntries.appendChild(entryElement);
                
                // Animation d'apparition
                setTimeout(() => {
                    entryElement.style.opacity = '1';
                    entryElement.style.transform = 'translateY(0)';
                }, 100);
            });
            
            // Masquer le bouton après le chargement
            loadMoreBtn.textContent = 'Toutes les entrées chargées';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.6';
            loadMoreBtn.style.cursor = 'default';
        });
    }
});

// Ajouter une animation aux cartes en fonction du défilement
document.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.lab-card:not(.show)');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            card.classList.add('show');
        }
    });
});
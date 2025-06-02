/**
 * Script pour la roadmap interactive des projets
 */

document.addEventListener('DOMContentLoaded', function() {
    initRoadmapFilters();
    animateOnScroll();
    updateStats();
});

/**
 * Initialise les filtres de la roadmap
 */
function initRoadmapFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-milestone');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage des projets
            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                const status = project.getAttribute('data-status');
                
                if (filter === 'all' || 
                    category === filter || 
                    status === filter) {
                    project.style.display = 'block';
                    project.style.animation = 'fadeIn 0.5s ease';
                } else {
                    project.style.display = 'none';
                }
            });
            
            // Mettre à jour les statistiques
            updateStats(filter);
        });
    });
}

/**
 * Animation au scroll
 */
function animateOnScroll() {
    const milestones = document.querySelectorAll('.project-milestone');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    milestones.forEach(milestone => {
        milestone.style.opacity = '0';
        milestone.style.transform = 'translateY(30px)';
        milestone.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(milestone);
    });
}

/**
 * Met à jour les statistiques
 */
function updateStats(filter = 'all') {
    const projects = document.querySelectorAll('.project-milestone');
    let total = 0, completed = 0, inProgress = 0, planned = 0;
    
    projects.forEach(project => {
        const status = project.getAttribute('data-status');
        const category = project.getAttribute('data-category');
        
        // Si un filtre est appliqué et ne correspond pas, ignorer
        if (filter !== 'all' && category !== filter && status !== filter) {
            return;
        }
        
        total++;
        switch(status) {
            case 'completed':
                completed++;
                break;
            case 'in-progress':
                inProgress++;
                break;
            case 'planned':
                planned++;
                break;
        }
    });
    
    // Mise à jour des compteurs avec animation
    animateCounter('total-projects', total);
    animateCounter('completed-projects', completed);
    animateCounter('active-projects', inProgress);
    animateCounter('planned-projects', planned);
}

/**
 * Animation des compteurs
 */
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        element.textContent = currentValue + (targetValue >= 10 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Ajouter CSS pour l'animation fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
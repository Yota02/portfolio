/**
 * Gestionnaire centralisé des projets open source
 * Ce script permet de définir quels projets sont open source
 * et de spécifier leur dépôt GitHub correspondant
 */

// Liste des projets open source avec leurs informations GitHub
const openSourceProjects = {
    // Format: 'nom-du-projet-html': 'user/repo'
    'OneClickIssue': 'Yota02/OneClickIssue',
    'ProjektBersetzung': 'Yota02/Projekt--bersetzung',
};

document.addEventListener('DOMContentLoaded', function() {
    // Pour les pages de détails de projets
    setupProjectDetailPage();
    
    // Pour la page tous-les-projets
    setupProjectsListingPage();
    
    // Pour d'autres pages (comme l'index)
    setupOtherPages();
});



/**
 * Configure la page de listing des projets
 */
function setupProjectsListingPage() {
    // Vérifier si nous sommes sur la page de listing des projets
    if (!window.location.pathname.includes('tous-les-projets.html')) return;
    
    // Ajouter l'attribut data-github aux projets open source
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectLink = card.querySelector('a');
        if (!projectLink) return;
        
        const href = projectLink.getAttribute('href');
        const projectName = href.split('/').pop().replace('.html', '');
        
        if (openSourceProjects[projectName]) {
            card.setAttribute('data-open-source', 'true');
            
            // Ajouter un badge "Open Source"
            const badgeContainer = document.createElement('div');
            badgeContainer.className = 'project-badges';
            badgeContainer.innerHTML = `
                <span class="open-source-badge">
                    <svg height="12" viewBox="0 0 16 16" width="12">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    Open Source
                </span>
            `;
            
            const projectInfo = card.querySelector('.project-info');
            if (projectInfo) {
                projectInfo.appendChild(badgeContainer);
            }
        }
    });
}

/**
 * Configure les mentions open source sur d'autres pages
 */
function setupOtherPages() {
    // Pour la page d'accueil par exemple
    const featuredProjects = document.querySelectorAll('.project-item');
    
    featuredProjects.forEach(project => {
        const projectLink = project.querySelector('a');
        if (!projectLink) return;
        
        const href = projectLink.getAttribute('href');
        const projectMatch = href.match(/projets\/([^.]+)\.html/);
        
        if (projectMatch && openSourceProjects[projectMatch[1]]) {
            // Ajouter un badge "Open Source"
            const title = project.querySelector('.project-title') || project.querySelector('h3');
            
            if (title) {
                const badge = document.createElement('span');
                badge.className = 'open-source-badge small';
                badge.innerHTML = `
                    <svg height="10" viewBox="0 0 16 16" width="10">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    Open Source
                `;
                title.appendChild(badge);
            }
        }
    });
}

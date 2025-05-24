/**
 * Module de gestion des projets GitHub
 * Ce script permet de récupérer et afficher des informations
 * sur les projets open source depuis GitHub
 */

// Configuration
const GITHUB_CACHE_DURATION = 3600000; // 1 heure en millisecondes
const GITHUB_API_BASE = 'https://api.github.com/repos/';

// État global pour le suivi des requêtes
const githubState = {
    projectsProcessed: new Set(),
    apiRateLimitExceeded: false,
    apiRateLimitReset: null
};

// Initialisation du module GitHub Projects
document.addEventListener('DOMContentLoaded', function() {
    initGitHubProjects();
});

/**
 * Initialise tous les projets GitHub sur la page
 */
function initGitHubProjects() {
    const githubProjects = document.querySelectorAll('[data-github]');
    
    if (githubProjects.length === 0) return;
    
    // Vérifier si des données en cache sont disponibles
    const cachedData = loadGithubDataFromCache();
    
    githubProjects.forEach(project => {
        const repoPath = project.getAttribute('data-github');
        if (!repoPath) return;
        
        // Vérifier si les données sont dans le cache et toujours valides
        if (cachedData && cachedData[repoPath] && !isCacheExpired(cachedData.timestamp)) {
            displayGithubData(project, cachedData[repoPath]);
        } else {
            fetchGithubData(project, repoPath);
        }
    });
}

/**
 * Récupère les données d'un repository GitHub
 * @param {HTMLElement} projectElement - Élément DOM du projet
 * @param {string} repoPath - Chemin du repository (format: 'username/repo')
 */
function fetchGithubData(projectElement, repoPath) {
    // Si on a déjà dépassé la limite d'API, ne pas faire d'autres requêtes
    if (githubState.apiRateLimitExceeded) {
        displayRateLimitMessage(projectElement);
        return;
    }
    
    // Éviter les requêtes en double
    if (githubState.projectsProcessed.has(repoPath)) return;
    githubState.projectsProcessed.add(repoPath);
    
    // Afficher un indicateur de chargement
    showLoadingIndicator(projectElement);
    
    fetch(GITHUB_API_BASE + repoPath)
        .then(response => {
            if (response.status === 403) {
                githubState.apiRateLimitExceeded = true;
                const resetTime = response.headers.get('X-RateLimit-Reset');
                if (resetTime) {
                    githubState.apiRateLimitReset = new Date(parseInt(resetTime) * 1000);
                }
                throw new Error('Rate limit exceeded');
            }
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Récupérer des informations complémentaires (issues, commits)
            return Promise.all([
                data,
                fetch(`${GITHUB_API_BASE}${repoPath}/issues?state=all&per_page=1`)
                    .then(res => res.headers.get('Link') ? 
                        parseInt(res.headers.get('Link').match(/page=(\d+)>; rel="last"/)[1]) : 0)
                    .catch(() => 0),
                fetch(`${GITHUB_API_BASE}${repoPath}/commits?per_page=1`)
                    .then(res => res.ok ? res.json() : [])
                    .then(commits => commits.length > 0 ? commits[0] : null)
                    .catch(() => null)
            ]);
        })
        .then(([repoData, issuesCount, lastCommit]) => {
            // Enrichir les données avec des infos complémentaires
            const enrichedData = {
                ...repoData,
                issues_count: issuesCount,
                last_commit: lastCommit
            };
            
            // Sauvegarder dans le cache
            cacheGithubData(repoPath, enrichedData);
            
            // Afficher les données sur la page
            displayGithubData(projectElement, enrichedData);
        })
        .catch(error => {
            console.error(`Error fetching GitHub data for ${repoPath}:`, error);
            if (githubState.apiRateLimitExceeded) {
                displayRateLimitMessage(projectElement);
            } else {
                displayErrorMessage(projectElement);
            }
        });
}

/**
 * Affiche les données GitHub récupérées
 * @param {HTMLElement} projectElement - Élément DOM du projet
 * @param {Object} data - Données du repository
 */
function displayGithubData(projectElement, data) {
    // Supprimer l'indicateur de chargement s'il existe
    removeLoadingIndicator(projectElement);
    
    // Créer la section GitHub
    const githubSection = document.createElement('div');
    githubSection.className = 'github-info';
    
    // Construire le contenu HTML
    const lastUpdated = new Date(data.updated_at || data.pushed_at).toLocaleDateString();
    const starsCount = data.stargazers_count;
    const forksCount = data.forks_count;
    const issuesCount = data.open_issues_count;
    
    githubSection.innerHTML = `
        <div class="github-header">
            <div class="github-logo">
                <svg height="24" viewBox="0 0 16 16" width="24">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </div>
            <div class="github-repo-name">
                <a href="${data.html_url}" target="_blank">${data.name}</a>
            </div>
        </div>
        <div class="github-stats">
            <div class="github-stat">
                <span class="stat-label">Stars</span>
                <span class="stat-value">${starsCount}</span>
            </div>
            <div class="github-stat">
                <span class="stat-label">Forks</span>
                <span class="stat-value">${forksCount}</span>
            </div>
            <div class="github-stat">
                <span class="stat-label">Issues</span>
                <span class="stat-value">${issuesCount}</span>
            </div>
        </div>
        <div class="github-info-row">
            <span class="info-label">Mis à jour:</span>
            <span class="info-value">${lastUpdated}</span>
        </div>
        <div class="github-info-row">
            <span class="info-label">Langage:</span>
            <span class="info-value">${data.language || 'Non spécifié'}</span>
        </div>
        <div class="github-cta">
            <a href="${data.html_url}" target="_blank" class="github-button">Voir sur GitHub</a>
        </div>
    `;
    
    // Ajouter le badge Open Source au titre du projet
    const projectHeader = document.querySelector('.project-header h1');
    if (projectHeader && !projectHeader.querySelector('.open-source-badge')) {
        const badge = document.createElement('span');
        badge.className = 'open-source-badge';
        badge.innerHTML = `
            <svg height="16" viewBox="0 0 16 16" width="16">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            Open Source
        `;
        projectHeader.appendChild(badge);
    }
    
    // Déterminer l'emplacement pour insérer la section GitHub
    const targetContainer = projectElement.querySelector('.project-details') || 
                           projectElement.querySelector('.tech-stack');
    
    if (targetContainer) {
        // Insérer après les détails du projet s'ils existent
        targetContainer.insertBefore(githubSection, targetContainer.lastElementChild);
    } else {
        // Ou ajouter à la fin du projet
        projectElement.appendChild(githubSection);
    }
}

/**
 * Fonctions utilitaires pour les indicateurs et la gestion du cache
 */
function showLoadingIndicator(projectElement) {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'github-loading';
    loadingEl.innerHTML = `
        <div class="github-loading-spinner"></div>
        <span>Chargement des données GitHub...</span>
    `;
    
    const targetContainer = projectElement.querySelector('.project-details') || 
                          projectElement.querySelector('.tech-stack');
    
    if (targetContainer) {
        targetContainer.appendChild(loadingEl);
    } else {
        projectElement.appendChild(loadingEl);
    }
}

function removeLoadingIndicator(projectElement) {
    const loadingEl = projectElement.querySelector('.github-loading');
    if (loadingEl) {
        loadingEl.remove();
    }
}

function displayRateLimitMessage(projectElement) {
    removeLoadingIndicator(projectElement);
    
    const errorEl = document.createElement('div');
    errorEl.className = 'github-error';
    
    let resetMessage = '';
    if (githubState.apiRateLimitReset) {
        const resetTime = githubState.apiRateLimitReset.toLocaleTimeString();
        resetMessage = `<p>Réessayez après ${resetTime}</p>`;
    }
    
    errorEl.innerHTML = `
        <div class="github-error-icon">⚠️</div>
        <div class="github-error-message">
            <p>Limite de l'API GitHub atteinte.</p>
            ${resetMessage}
        </div>
    `;
    
    const targetContainer = projectElement.querySelector('.project-details') || 
                          projectElement.querySelector('.tech-stack');
    
    if (targetContainer) {
        targetContainer.appendChild(errorEl);
    } else {
        projectElement.appendChild(errorEl);
    }
}

function displayErrorMessage(projectElement) {
    removeLoadingIndicator(projectElement);
    
    const errorEl = document.createElement('div');
    errorEl.className = 'github-error';
    errorEl.innerHTML = `
        <div class="github-error-icon">⚠️</div>
        <div class="github-error-message">
            <p>Impossible de charger les données GitHub.</p>
        </div>
    `;
    
    const targetContainer = projectElement.querySelector('.project-details') || 
                          projectElement.querySelector('.tech-stack');
    
    if (targetContainer) {
        targetContainer.appendChild(errorEl);
    } else {
        projectElement.appendChild(errorEl);
    }
}

/**
 * Gestion du cache des données GitHub
 */
function cacheGithubData(repoPath, data) {
    try {
        const cache = JSON.parse(localStorage.getItem('github_data_cache') || '{}');
        cache[repoPath] = data;
        cache.timestamp = Date.now();
        localStorage.setItem('github_data_cache', JSON.stringify(cache));
    } catch (error) {
        console.error('Error caching GitHub data:', error);
    }
}

function loadGithubDataFromCache() {
    try {
        const cache = localStorage.getItem('github_data_cache');
        return cache ? JSON.parse(cache) : null;
    } catch (error) {
        console.error('Error loading GitHub data from cache:', error);
        return null;
    }
}

function isCacheExpired(timestamp) {
    const now = Date.now();
    return (now - timestamp) > GITHUB_CACHE_DURATION;
}

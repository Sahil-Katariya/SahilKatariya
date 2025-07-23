// Projects System
class ProjectsManager {
    constructor() {
        this.projectsGrid = document.getElementById('projects-grid');
        this.modal = document.getElementById('project-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        
        this.projects = [];
        this.currentProject = null;
        
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupModal();
    }

    loadProjects() {
        // Sample project data - replace with actual data source
        this.projects = [
            {
                id: 1,
                title: "AI-Powered Web Application",
                description: "A full-stack web application that leverages machine learning algorithms to provide intelligent recommendations and data analysis.",
                image: "https://via.placeholder.com/400x250/6366f1/ffffff?text=AI+Web+App",
                tags: ["React", "Python", "TensorFlow", "Node.js"],
                features: [
                    "Machine learning integration",
                    "Real-time data processing",
                    "Responsive design",
                    "User authentication",
                    "Data visualization"
                ],
                technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB", "Express"],
                liveUrl: "#",
                githubUrl: "#",
                category: "fullstack"
            },
            {
                id: 2,
                title: "Robotics Control System",
                description: "An advanced control system for autonomous robots with computer vision capabilities and real-time navigation.",
                image: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Robotics+System",
                tags: ["C++", "OpenCV", "Arduino", "ROS"],
                features: [
                    "Computer vision integration",
                    "Autonomous navigation",
                    "Real-time control",
                    "Sensor fusion",
                    "Path planning algorithms"
                ],
                technologies: ["C++", "OpenCV", "Arduino", "ROS", "Python", "Linux"],
                liveUrl: "#",
                githubUrl: "#",
                category: "robotics"
            },
            {
                id: 3,
                title: "Mobile Finance App",
                description: "A comprehensive mobile application for personal finance management with budgeting tools and expense tracking.",
                image: "https://via.placeholder.com/400x250/ec4899/ffffff?text=Finance+App",
                tags: ["React Native", "Firebase", "Node.js"],
                features: [
                    "Expense tracking",
                    "Budget management",
                    "Financial analytics",
                    "Secure authentication",
                    "Cloud synchronization"
                ],
                technologies: ["React Native", "Firebase", "Node.js", "Express", "MongoDB"],
                liveUrl: "#",
                githubUrl: "#",
                category: "mobile"
            }
        ];

        this.renderProjects();
    }

    renderProjects() {
        if (!this.projectsGrid) return;

        this.projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card animate-on-scroll" data-project-id="${project.id}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        <button class="btn-primary view-project" data-project-id="${project.id}">
                            <span>View Details</span>
                            <i class="arrow">→</i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        this.setupProjectCards();
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        const viewButtons = document.querySelectorAll('.view-project');

        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.view-project')) {
                    const projectId = parseInt(card.dataset.projectId);
                    this.openModal(projectId);
                }
            });
        });

        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = parseInt(button.dataset.projectId);
                this.openModal(projectId);
            });
        });
    }

    setupModal() {
        if (!this.modal) return;

        // Close modal handlers
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalOverlay?.addEventListener('click', () => this.closeModal());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        this.currentProject = project;
        this.populateModal(project);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProject = null;
    }

    populateModal(project) {
        // Update modal content
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-main-image').src = project.image;
        document.getElementById('modal-main-image').alt = project.title;
        
        // Update tags
        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // Update features
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
        
        // Update technologies
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        
        // Update links
        document.getElementById('modal-live-link').href = project.liveUrl;
        document.getElementById('modal-github-link').href = project.githubUrl;
    }

    // Public method to add new project
    addProject(project) {
        this.projects.push(project);
        this.renderProjects();
    }

    // Public method to filter projects
    filterProjects(category) {
        const filteredProjects = category === 'all' 
            ? this.projects 
            : this.projects.filter(p => p.category === category);
        
        // Re-render with filtered projects
        this.renderFilteredProjects(filteredProjects);
    }

    renderFilteredProjects(projects) {
        if (!this.projectsGrid) return;

        this.projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card animate-on-scroll" data-project-id="${project.id}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        <button class="btn-primary view-project" data-project-id="${project.id}">
                            <span>View Details</span>
                            <i class="arrow">→</i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.setupProjectCards();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsManager;
}

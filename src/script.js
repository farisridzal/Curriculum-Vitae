// Skills Daten als Array mit Objekten
const skillsData = [
    { name: "Java", percentage: 50, category: "programmierung" },
    { name: "Python", percentage: 40, category: "programmierung" },
    { name: "JavaScript", percentage: 40, category: "programmierung" },
    { name: "HTML/CSS", percentage: 70, category: "web" },
    { name: "Angular", percentage: 20, category: "web" },
    { name: "Node.js", percentage: 30, category: "web" },
    { name: "REST APIs", percentage: 70, category: "web" },
    { name: "JSON/XML", percentage: 80, category: "web" },
    { name: "MySQL", percentage: 80, category: "datenbank" },
    { name: "MongoDB", percentage: 30, category: "datenbank" },
    { name: "SPS-Programmierung", percentage: 90, category: "automation" },
    { name: "HMI-Entwicklung", percentage: 70, category: "automation" },
    { name: "Git", percentage: 80, category: "tools" },
    { name: "Docker", percentage: 40, category: "tools" },
    { name: "Visual Studio", percentage: 80, category: "tools" },
    { name: "IntelliJ IDEA", percentage: 60, category: "tools" },
];

let skillsAnimated = false;

// Mobile Navigation Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Smooth Scrolling für Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });

            // Schliesse das mobile Menü nach dem Klick
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
});

// Skills dynamisch rendern
function renderSkills(skills = skillsData) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    skills.forEach((skill, index) => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill';
        skillElement.innerHTML = `
                    <div class="skill-category">${getCategoryDisplayName(skill.category)}</div>
                    <h3>${skill.name}</h3>
                    <div class="progress-bar">
                        <div class="progress" data-percentage="${skill.percentage}"></div>
                    </div>
                    <div class="skill-percentage">${skill.percentage}%</div>
                `;
        container.appendChild(skillElement);
    });

    // Nach dem Rendern die Animation für die neuen Skills einrichten
    setTimeout(() => {
        setupSkillsAnimation();
    }, 100);
}

// Kategorie-Namen für die Anzeige
function getCategoryDisplayName(category) {
    const categoryNames = {
        'programmierung': 'Programmierung',
        'datenbank': 'Datenbank',
        'web': 'Web-Technologien',
        'automation': 'Automation',
        'tools': 'Tools & Frameworks'
    };
    return categoryNames[category] || category;
}

// Filter-Funktionalität
function setupSkillsFilter() {
    const filterSelect = document.getElementById('category-filter');

    filterSelect.addEventListener('change', function () {
        const selectedCategory = this.value;
        const container = document.getElementById('skills-container');

        if (selectedCategory === 'alle') {
            // Alle Skills anzeigen
            renderSkills(skillsData);
        } else {
            // Nur Skills der gewählten Kategorie anzeigen
            const filteredSkills = skillsData.filter(skill => skill.category === selectedCategory);
            renderSkills(filteredSkills);
        }

        // Nach dem Filtern die Animation zurücksetzen
        skillsAnimated = false;
        animateVisibleSkills();
    });
}

// Animiere nur die sichtbaren Skills
function animateVisibleSkills() {
    const progressBars = document.querySelectorAll('.progress');

    progressBars.forEach((progress, index) => {
        const skillElement = progress.closest('.skill');
        const skillRect = skillElement.getBoundingClientRect();
        const isVisible = skillRect.top < window.innerHeight && skillRect.bottom > 0;

        if (isVisible) {
            const percentage = progress.getAttribute('data-percentage');
            setTimeout(() => {
                progress.style.width = percentage + '%';
            }, index * 100);
        }
    });
}

// Verbesserte Skills-Animation mit Intersection Observer
function setupSkillsAnimation() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.querySelector('.progress');
                    const percentage = progress.getAttribute('data-percentage');

                    setTimeout(() => {
                        progress.style.width = percentage + '%';
                    }, 200);

                    skillsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Beobachte alle Skill-Elemente
        document.querySelectorAll('.skill').forEach(skill => {
            skillsObserver.observe(skill);
        });
    } else {
        // Fallback für ältere Browser
        animateVisibleSkills();
    }
}

// Veraltete animateSkills Funktion entfernen und durch setupSkillsAnimation ersetzen
function checkSkillsVisibility() {
    const skillsSection = document.querySelector('.skills');
    const skillsPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (skillsPosition < screenPosition && !skillsAnimated) {
        setupSkillsAnimation();
        skillsAnimated = true;
    }
}

// Aktiver Navigationslink beim Scrollen
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');

    let current = '';
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition + windowHeight >= documentHeight - 100) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            current = lastSection.getAttribute('id');
        }
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Timeline Animation beim Scrollen
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (itemPosition < screenPosition) {
            item.classList.add('animate');
        }
    });
}

// Intersection Observer für bessere Performance
function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Beobachte Timeline-Items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Event Listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    checkSkillsVisibility();
    animateTimeline();
});

// Initialisierung beim Laden der Seite
window.addEventListener('load', () => {
    renderSkills();
    setupSkillsFilter();
    setupIntersectionObserver();
    checkSkillsVisibility();
    animateTimeline();
});

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    setupSkillsFilter();
    // Skills-Animation wird durch setupSkillsAnimation in renderSkills aufgerufen
});
// Skills Daten als Array mit Objekten
const skillsData = [
    { name: "Java", percentage: 50, category: "programmierung" },
    { name: "Python", percentage: 40, category: "programmierung" },
    { name: "JavaScript", percentage: 40, category: "programmierung" },
    { name: "HTML/CSS", percentage: 70, category: "web" },
    { name: "Angular", percentage: 20, category: "web" },
    { name: "Node.js", percentage: 30, category: "web" },
    { name: "REST APIs", percentage: 60, category: "web" },
    { name: "JSON/XML", percentage: 70, category: "web" },
    { name: "MySQL", percentage: 50, category: "datenbank" },
    { name: "MongoDB", percentage: 30, category: "datenbank" },
    { name: "SPS-Programmierung", percentage: 60, category: "automation" },
    { name: "HMI-Entwicklung", percentage: 50, category: "automation" },
    { name: "Git", percentage: 80, category: "tools" },
    { name: "Docker", percentage: 50, category: "tools" },
];

let skillsObserver = null;

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
    setupSkillsAnimation();
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

        if (selectedCategory === 'alle') {
            // Alle Skills anzeigen
            renderSkills(skillsData);
        } else {
            // Nur Skills der gewählten Kategorie anzeigen
            const filteredSkills = skillsData.filter(skill => skill.category === selectedCategory);
            renderSkills(filteredSkills);
        }
    });
}

// Balken auf seinen Wert füllen. Zwei Frames warten, damit der Browser
// zuerst die Breite 0 zeichnet und die CSS-Transition sichtbar abläuft.
function fillProgressBar(progress, delay = 0) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                progress.style.width = progress.dataset.percentage + '%';
            }, delay);
        });
    });
}

// Skills-Animation: jeder Balken füllt sich, sobald er ins Bild scrollt
function setupSkillsAnimation() {
    const skills = document.querySelectorAll('.skill');

    if (!('IntersectionObserver' in window)) {
        // Fallback für ältere Browser
        skills.forEach(skill => fillProgressBar(skill.querySelector('.progress')));
        return;
    }

    // Alten Observer aufräumen, z. B. nach einem Filterwechsel
    if (skillsObserver) {
        skillsObserver.disconnect();
    }

    skillsObserver = new IntersectionObserver((entries, observer) => {
        let staggerIndex = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Balken, die gleichzeitig sichtbar werden, leicht versetzt starten
                fillProgressBar(entry.target.querySelector('.progress'), staggerIndex * 100);
                staggerIndex++;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skills.forEach(skill => skillsObserver.observe(skill));
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
    animateTimeline();
});

// Initialisierung beim Laden der Seite
window.addEventListener('load', () => {
    setupIntersectionObserver();
    animateTimeline();
});

// Skills nur einmal rendern, sobald das HTML bereit ist
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    setupSkillsFilter();
});

// Aktuelles Jahr im Footer
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

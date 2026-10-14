import './styles/main.css';
import { BackgroundScene } from './three/scene';
import { profile } from './content/profile';
import { LoadingScreen, ResourceTracker } from './loader/LoadingScreen';
import { NavbarLogo } from './three/NavbarLogo';

document.body.classList.add('loading');

const loadingScreen = new LoadingScreen();
const resourceTracker = new ResourceTracker(loadingScreen);

resourceTracker.trackResource();
resourceTracker.trackResource();
resourceTracker.trackResource();
resourceTracker.trackResource();

document.fonts.ready.then(() => {
  resourceTracker.resourceLoaded();
});

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;

loadingScreen.onComplete(() => {
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');

  const navbarCanvas = document.getElementById('navbar-logo-canvas') as HTMLCanvasElement;
  if (navbarCanvas) {
    new NavbarLogo(navbarCanvas);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  resourceTracker.resourceLoaded();

  populateHero();
  populateAbout();
  populateSkills();
  populateExperience();
  populateProjects();
  populateCertifications();
  populateContact();
  setupNavigation();
  setupScrollAnimations();

  resourceTracker.resourceLoaded();

  if (canvas) {
    new BackgroundScene(canvas);
    resourceTracker.resourceLoaded();
  }

  setTimeout(() => {
    resourceTracker.complete();
  }, 500);
});

function populateHero(): void {
  const nameEl = document.querySelector('.hero-name');
  const headlineEl = document.querySelector('.hero-headline');
  const locationEl = document.querySelector('.hero-location');

  if (nameEl) nameEl.textContent = profile.name;
  if (headlineEl) headlineEl.textContent = profile.headline;
  if (locationEl) locationEl.textContent = `Based in ${profile.location}`;
}

function populateAbout(): void {
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    aboutText.textContent = profile.summary;
  }
}

function populateSkills(): void {
  const skillsGrid = document.querySelector('.skills-grid');
  if (!skillsGrid) return;

  profile.skills.forEach(category => {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'skill-category';
    categoryEl.innerHTML = `
      <h3>${category.category}</h3>
      <div class="skill-items">
        ${category.items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    `;
    skillsGrid.appendChild(categoryEl);
  });
}

function populateExperience(): void {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  profile.experience.forEach(exp => {
    const itemEl = document.createElement('div');
    itemEl.className = 'timeline-item';
    itemEl.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-title">${exp.title}</span>
        <span class="timeline-company">@ ${exp.company}</span>
      </div>
      <div class="timeline-meta">${exp.location} | ${exp.period}</div>
      <ul class="timeline-bullets">
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    `;
    timeline.appendChild(itemEl);
  });
}

function populateProjects(): void {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  profile.projects.forEach(project => {
    const cardEl = document.createElement('div');
    cardEl.className = 'project-card';
    cardEl.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">${project.name}</h3>
        <span class="project-year">${project.year}</span>
      </div>
      <p class="project-description">${project.description}</p>
      <div class="project-tech">
        ${project.tech.map(t => `<span class="project-tech-tag">${t}</span>`).join('')}
      </div>
      <ul class="project-highlights">
        ${project.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    `;
    projectsGrid.appendChild(cardEl);
  });
}

function populateCertifications(): void {
  const certsGrid = document.querySelector('.certs-grid');
  if (!certsGrid) return;

  const icons: { [key: string]: string } = {
    'CEH': '🛡️',
    'CC': '🔐',
    'DevOps': '⚙️',
    'CTF': '🏆',
    'Student': '🎓'
  };

  profile.certifications.forEach(cert => {
    let icon = '📜';
    for (const key in icons) {
      if (cert.name.includes(key)) {
        icon = icons[key];
        break;
      }
    }

    const cardEl = document.createElement('div');
    cardEl.className = 'cert-card';
    cardEl.innerHTML = `
      <span class="cert-icon">${icon}</span>
      <div class="cert-info">
        <h4>${cert.name}</h4>
        <span>${cert.issuer}</span>
      </div>
    `;
    certsGrid.appendChild(cardEl);
  });
}

function populateContact(): void {
  const contactLinks = document.querySelector('.contact-links');
  if (!contactLinks) return;

  // Define all possible contact links
  const allLinks = [
    {
      href: `mailto:${profile.contact.email}`,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      text: 'Email',
      show: true
    },
    {
      href: profile.contact.linkedin,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      text: 'LinkedIn',
      show: !!profile.contact.linkedin
    },
    {
      href: profile.contact.github || '',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
      text: 'GitHub',
      show: !!profile.contact.github
    },
    {
      href: profile.contact.twitter || '',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      text: 'Twitter/X',
      show: !!profile.contact.twitter
    },
    {
      href: profile.contact.discord || '',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
      text: 'Discord',
      show: !!profile.contact.discord
    },
    {
      href: profile.contact.instagram || '',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      text: 'Instagram',
      show: !!profile.contact.instagram
    },
    {
      href: profile.contact.website || '',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      text: 'Website',
      show: !!profile.contact.website
    },
    {
      href: `tel:${profile.contact.phone}`,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      text: 'Phone',
      show: true
    }
  ];

  // Only show links that have values
  const links = allLinks.filter(link => link.show);

  links.forEach(link => {
    const linkEl = document.createElement('a');
    linkEl.href = link.href;
    linkEl.className = 'contact-link';
    linkEl.target = link.href.startsWith('http') ? '_blank' : '_self';
    linkEl.rel = 'noopener noreferrer';
    linkEl.innerHTML = `${link.icon}<span>${link.text}</span>`;
    contactLinks.appendChild(linkEl);
  });
}

function setupNavigation(): void {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href')!);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setupScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

const style = document.createElement('style');
style.textContent = `
  .section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .section.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  .hero {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(style);

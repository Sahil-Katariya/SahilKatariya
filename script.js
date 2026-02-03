// Particle Animation
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.theme = "dark";

    this.resize();
    this.init();
    this.animate();

    window.addEventListener("resize", () => this.resize());
    window.addEventListener("themeChanged", (e) => {
      this.theme = e.detail.theme;
    });
    canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const particleCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 15000
    );

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= dx * 0.02 * force;
        particle.y -= dy * 0.02 * force;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      const particleColor =
        this.theme === "dark" ? "99, 102, 241" : "99, 102, 241";
      this.ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
      this.ctx.fill();

      // Draw connections
      this.particles.slice(index + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          const connectionOpacity = this.theme === "dark" ? 0.15 : 0.08;
          this.ctx.strokeStyle = `rgba(${particleColor}, ${connectionOpacity * (1 - distance / 120)
            })`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Typing Animation
class TypingAnimation {
  constructor(element, texts, speed = 100) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.speed;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500; // Pause before next text
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "dark";
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Update particle colors based on theme
    this.updateParticleColors();
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }

  updateParticleColors() {
    // This will be called by the particle system to update colors
    const event = new CustomEvent("themeChanged", {
      detail: { theme: this.theme },
    });
    window.dispatchEvent(event);
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }
}

// Contact Form Management
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.submitBtn = this.form.querySelector(".submit-btn");
    this.successMessage = document.getElementById("form-success");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearError(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (!value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    } else {
      // Specific field validation
      switch (fieldName) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email address";
          }
          break;
        case "name":
          if (value.length < 2) {
            isValid = false;
            errorMessage = "Name must be at least 2 characters long";
          }
          break;
        case "message":
          if (value.length < 10) {
            isValid = false;
            errorMessage = "Message must be at least 10 characters long";
          }
          break;
      }
    }

    this.showError(field, errorMessage);
    return isValid;
  }

  validateForm() {
    const fields = this.form.querySelectorAll("input, textarea");
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (message) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
      field.style.borderColor = "#ef4444";
    } else {
      errorElement.classList.remove("show");
      field.style.borderColor = "";
    }
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    errorElement.classList.remove("show");
    field.style.borderColor = "";
  }

  getFieldLabel(fieldName) {
    const labels = {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    };
    return labels[fieldName] || fieldName;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setLoading(true);

    // Simulate form submission (replace with actual email service)
    try {
      await this.submitForm();
      this.showSuccess();
    } catch (error) {
      this.showError(this.form, "Failed to send message. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  async submitForm() {
    const formData = new FormData(this.form);

    try {
      const response = await fetch("https://formspree.io/f/mpqlnodp", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success! The promise resolves and your calling code 
        // can show the #form-success div.
        return true;
      } else {
        // If Formspree returns an error (e.g., rate limiting)
        const data = await response.json();
        throw new Error(data.errors ? data.errors[0].message : "Submission failed");
      }
    } catch (error) {
      console.error("Formspree Error:", error);
      alert("Oops! There was a problem: " + error.message);
      throw error; // Propagate error so the loading state can reset
    }
  }

  setLoading(loading) {
    if (loading) {
      this.submitBtn.classList.add("loading");
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove("loading");
      this.submitBtn.disabled = false;
    }
  }

  showSuccess() {
    this.successMessage.classList.add("show");
    this.form.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.successMessage.classList.remove("show");
    }, 3000);
  }
}

// Page Loader
class PageLoader {
  constructor() {
    this.loader = document.getElementById("page-loader");
    this.progressBar = document.getElementById("progress-bar");
    this.progress = 0;
    this.init();
  }

  init() {
    document.body.classList.add("loading");
    this.simulateLoading();
  }

  simulateLoading() {
    const interval = setInterval(() => {
      this.progress += Math.random() * 15;

      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => this.hideLoader(), 500);
      }

      this.updateProgress();
    }, 100);
  }

  updateProgress() {
    this.progressBar.style.width = `${this.progress}%`;
  }

  hideLoader() {
    this.loader.classList.add("hidden");
    document.body.classList.remove("loading");

    // Trigger entrance animations
    setTimeout(() => {
      this.triggerEntranceAnimations();
    }, 100);
  }

  triggerEntranceAnimations() {
    // Add staggered animations to hero elements
    const heroElements = document.querySelectorAll(".hero-content > *");
    heroElements.forEach((el, index) => {
      el.style.setProperty("--stagger-delay", `${index * 0.1}s`);
      el.classList.add("stagger-animation", "slide-in-up");
    });
  }
}
class AnimationManager {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupMicroInteractions();
  }

  /**
   * Sets up a single IntersectionObserver to handle all scroll-triggered animations.
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a generic class to trigger animations defined in CSS
          entry.target.classList.add("animated");

          // Special handling for elements needing JavaScript animations
          if (entry.target.matches(".about-stats")) {
            this.animateCounters(entry.target);
          }
          if (entry.target.matches(".skills-section")) {
            this.animateSkillBars(entry.target);
          }
          // The stagger logic is now part of the generic animation via CSS

          // OPTIMIZATION: Stop observing the element once it's animated
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with the 'animate-on-scroll' class
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      this.observer.observe(el);
    });
  }

  /**
   * Public method to allow other parts of the app (e.g., ProjectManager)
   * to add dynamically created elements to the observer.
   * @param {HTMLElement} element The element to observe.
   */
  observeNewElement(element) {
    if (element) {
      this.observer.observe(element);
    }
  }

  setupHoverEffects() {
    // This logic is fine as is.
    document
      .querySelectorAll(
        ".project-card, .tool-item, .contact-method, .stat-item, .experience-item, .education-item, .achievement-item, .cert-item"
      )
      .forEach((el) => {
        el.classList.add("hover-lift");
      });

    document.querySelectorAll(".btn-primary, .btn-secondary").forEach((el) => {
      el.classList.add("hover-glow");
    });
  }

  setupMicroInteractions() {
    // Add click ripple effect to buttons
    document
      .querySelectorAll("button, .btn-primary, .btn-secondary")
      .forEach((button) => {
        // FIX: Use an arrow function to ensure context is correct
        button.addEventListener("click", (e) => this.createRipple(e));
      });

    // Add focus animations to form inputs
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused");
      });
      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused");
      });
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    // Ensure the button is positioned to contain the ripple
    if (getComputedStyle(button).position === "static") {
      button.style.position = "relative";
    }
    button.style.overflow = "hidden";

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect"); // Use a class for cleaner CSS

    button.appendChild(ripple);

    // Clean up the ripple element after the animation finishes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  animateCounters(container) {
    const counters = container.querySelectorAll(".stat-number");
    counters.forEach((counter) => {
      const target = counter.getAttribute("data-target");
      if (target) {
        // Ensure CounterAnimation class is available
        new CounterAnimation(counter, target).animate();
      }
    });
  }

  animateSkillBars(container) {
    const skillBars = container.querySelectorAll(".skill-fill");
    skillBars.forEach((bar, index) => {
      const width = bar.getAttribute("data-width");
      if (width) {
        // Stagger the animation start time for a nice effect
        setTimeout(() => {
          // Ensure SkillBarAnimation class is available
          new SkillBarAnimation(bar, width).animate();
        }, index * 100);
      }
    });
  }

  // REMOVED: staggerProjectCards() is no longer needed.
  // Staggering should be handled via CSS transition-delay on child elements
  // when their parent container gets the 'in-view' class.
}

// Add ripple animation CSS
const rippleCSS = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.form-group.focused label {
    color: var(--accent-primary);
    transform: translateY(-2px);
}
`;

const style = document.createElement("style");
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize page loader
  new PageLoader();

  // Initialize theme manager
  new ThemeManager();

  // Initialize animation manager
  const animationManager = new AnimationManager();

  // Initialize particles
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    new ParticleSystem(canvas);
  }

  // Initialize typing animation
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    new TypingAnimation(typingElement, [
      "Full Stack Developer",
      "Robotics Enthusiast",
      "Front End Developer",
      "Problem Solver",
      "Back End Developer",
      "Innovation Driver",
      "AI/ML Engineer",
    ]);
  }

  // Initialize project manager
  new ProjectManager(animationManager);

  // Initialize contact form
  new ContactForm();

  // Initialize custom cursor (desktop only)
  if (window.innerWidth > 768) {
    initCustomCursor();
  }
});


// Custom Cursor
function initCustomCursor() {
  if (window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("custom-cursor-active");
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor movement
    function animateCursor() {
      // cursorX += (mouseX - cursorX) * 0.3; // instead of 0.1
      // cursorY += (mouseY - cursorY) * 0.3;

      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // speed factor adjusts dynamically
      const speed = Math.min(0.3, 0.1 + distance / 100);

      cursorX += dx * speed;
      cursorY += dy * speed;

      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll(
      "a, button, .project-card, .tool-item, .contact-method"
    );
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Scroll Effect Logic --- */
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      // When scrolled down 50px, add the 'scrolled' class
      navbar.classList.add('scrolled');
    } else {
      // When at the top, remove the class
      navbar.classList.remove('scrolled');
    }
  });

  /* --- 2. Mobile Menu Logic --- */
  // Ensure your HTML has these IDs/Classes:
  // Button: id="mobile-menu-toggle"
  // Menu List: class="nav-menu"

  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      // Toggle the active class on the menu
      navMenu.classList.toggle('active');

      // Optional: Animate the hamburger icon lines
      const spans = mobileBtn.querySelectorAll('span');
      if (spans.length === 3) {
        if (navMenu.classList.contains('active')) {
          // Turn into X
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          // Reset to hamburger
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        // Reset hamburger icons
        const spans = mobileBtn.querySelectorAll('span');
        if (spans.length === 3) {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  /* --- 3. Theme Toggle Logic (Optional) --- */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});


// Counter Animation
class CounterAnimation {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseInt(target);
    this.duration = duration;
    this.current = 0;
    this.increment = this.target / (duration / 16);
    this.hasAnimated = false;
  }

  animate() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    const updateCounter = () => {
      this.current += this.increment;
      if (this.current >= this.target) {
        this.element.textContent = this.target;
        return;
      }
      this.element.textContent = Math.floor(this.current);
      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  }
}

// Skill Bar Animation
class SkillBarAnimation {
  constructor(element, width) {
    this.element = element;
    this.width = parseInt(width);
    this.hasAnimated = false;
  }

  animate() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    setTimeout(() => {
      this.element.style.width = `${this.width}%`;
    }, 100);
  }
}

// Project Data
const projectsData = [
  {
    id: 0,
    title: "FeedBack Hub",
    description:
      "AI-powered feedback analytics platform for data-driven business decisions",
    longDescription:
      "Built a production-style full-stack platform that centralizes user feedback and converts raw text into actionable insights using NLP models. Designed REST APIs, implemented authentication, and delivered a real-time analytics dashboard for sentiment trends and reporting.",
    category: ["fullstack", "web"],
    tags: ["Full Stack", "AI", "NLP", "Analytics"],
    features: [
      "Multi-source feedback ingestion",
      "NLP-based sentiment analysis",
      "Secure authentication & role management",
      "Live analytics dashboards",
      "Automated insight generation",
      "Custom reports & exports",
      "Scalable backend APIs",
    ],
    technologies: [
      "React",
      "Flask",
      "Python",
      "MongoDB",
      "TensorFlow",
      "Chart.js",
    ],
    images: [
      "./feedbackhub/feedbackhub(1).jpg",
      "./feedbackhub/feedbackhub(2).jpg",
      "./feedbackhub/feedbackhub(3).jpg",
      "./feedbackhub/feedbackhub(4).jpg",
      "./feedbackhub/feedbackhub(5).jpg",
      "./feedbackhub/feedbackhub(6).jpg",
    ],
    liveUrl: "https://sahil-katariya.github.io/FeedBack-Hub/",
    githubUrl: "https://github.com/Sahil-Katariya/FeedBack-Hub",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },

  {
    id: 2,
    title: "AeroQSense",
    description:
      "IoT-powered air quality monitoring dashboard with real-time analytics",
    longDescription:
      "Developed an end-to-end IoT and web platform that streams sensor data to cloud services and visualizes pollution metrics in real time. Implemented dashboards, alerts, historical trend analysis, and predictive models for AQI forecasting.",
    category: ["fullstack", "iot", "web"],
    tags: ["IoT", "Dashboard", "Data Visualization"],
    features: [
      "Live AQI streaming",
      "Sensor ingestion pipeline",
      "Trend forecasting models",
      "Threshold alerts",
      "Historical analytics",
      "Remote monitoring",
      "Cloud-connected backend",
    ],
    technologies: ["ESP32", "React", "MongoDB", "Chart.js"],
    images: [
      "./aqi/aqi (1).jpg",
      "./aqi/aqi (2).jpg",
      "./aqi/aqi (3).jpg",
      "./aqi/aqi (4).jpg",
      "./aqi/aqi (5).jpg",
      "./aqi/aqi (6).jpg",
    ],
    liveUrl: "https://aeroqsense.netlify.app/",
    githubUrl: "https://github.com/Sahil-Katariya/AQI",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
  },

  {
    id: 1,
    title: "School Website Platform",
    description:
      "Responsive school management website with admin dashboard and CMS features",
    longDescription:
      "Created a fully responsive web platform for a school with modules for announcements, faculty profiles, inquiries, and administrative workflows. Focused on accessibility, SEO, and performance optimization.",
    category: ["web", "frontend"],
    tags: ["Responsive", "SEO", "Admin Panel"],
    features: [
      "Mobile-first layout",
      "CMS-style admin controls",
      "Inquiry forms",
      "SEO-ready structure",
      "Staff directory",
      "Events system",
      "Optimized performance",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    images: [
      "./school/school(1).jpg",
      "./school/school(2).jpg",
      "./school/school(3).jpg",
      "./school/school(4).jpg",
    ],
    liveUrl: "https://sahil-katariya.github.io/sarasvati-school/",
    githubUrl: "https://www.github.com/sahil-katariya/sarasvati-school/",
    gradient: "linear-gradient(135deg, #10b981, #3b82f6)",
  },

  {
    id: 3,
    title: "Animal Heaven",
    description:
      "Pet adoption and community web platform with authentication and admin tools",
    longDescription:
      "Built a community-focused web application where users can create pet listings, apply for adoption, and interact socially. Implemented role-based moderation, responsive UI, and CRUD workflows.",
    category: ["fullstack", "web"],
    tags: ["Auth", "CRUD", "Community"],
    features: [
      "User authentication",
      "Pet listings & adoption flows",
      "Moderation dashboard",
      "Search & filters",
      "Responsive UI",
      "Admin tools",
      "Community features",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    images: [
      "./animalheaven/animalheaven(1).jpg",
      "./animalheaven/animalheaven(2).jpg",
    ],
    liveUrl: "",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },

  {
    id: 4,
    title: "Lunar DEM Generation",
    description:
      "Computer vision pipeline for lunar terrain reconstruction (ISRO Hackathon)",
    longDescription:
      "Designed a scalable image-processing pipeline that reconstructs lunar terrain using mono images and shape-from-shading algorithms. Integrated GIS visualization tools and automated elevation mapping.",
    category: ["computer-vision"],
    tags: ["OpenCV", "GIS", "Image Processing"],
    features: [
      "Terrain reconstruction",
      "Shape-from-shading",
      "GIS visualization",
      "Batch pipelines",
      "Scientific plotting",
    ],
    technologies: ["Python", "OpenCV", "QGIS", "NumPy"],
    images: ["./ldem/ldem(1).jpg"],
    liveUrl: "",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },

  {
    id: 5,
    title: "ANAV Drone Navigation System",
    description:
      "Vision-based autonomous drone navigation for ISRO Robotics Challenge",
    longDescription:
      "Led development of a GPS-independent drone navigation stack using computer vision and sensor fusion. Focused on obstacle detection, real-time path planning, and autonomous flight control.",
    category: ["robotics", "ai"],
    tags: ["Autonomy", "CV", "Robotics"],
    features: [
      "Obstacle avoidance",
      "Vision-based localization",
      "Path planning",
      "Sensor fusion",
      "Real-time inference",
    ],
    technologies: ["Python", "OpenCV", "ROS", "TensorFlow"],
    images: ["./anav/anav(1).jpg"],
    liveUrl: "https://github.com/Sahil-Katariya/QuodeCopter",
    githubUrl: "https://github.com/Sahil-Katariya/QuodeCopter",
    gradient: "linear-gradient(135deg, #ec4899, #f59e0b)",
  },

  {
    id: 6,
    title: "Face Attendance System",
    description:
      "Face recognition attendance platform with admin analytics dashboard",
    longDescription:
      "Implemented a real-time face authentication system integrated with a web dashboard for managing users and attendance records. Built reporting tools and exportable logs for administrators.",
    category: ["computer-vision", "web"],
    tags: ["CV", "Security", "Analytics"],
    features: [
      "Face recognition",
      "Admin dashboard",
      "Attendance logs",
      "Export reports",
      "User management",
    ],
    technologies: ["Python", "Flask", "OpenCV", "SQLite"],
    images: ["./attendance/attendance(1).jpg"],
    liveUrl: "",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #f59e0b, #10b981)",
  },
];

// Project Management Class
class ProjectManager {
  constructor(animationManager) {
    // 1. Accept animationManager
    this.projects = projectsData;
    this.animationManager = animationManager; // Store the instance
    this.currentFilter = "all";
    this.modal = document.getElementById("project-modal");

    this.projectsToShowInitially = 2; // Adjusted for a better initial view
    this.visibleProjectsCount = this.projectsToShowInitially;

    this.init();
  }

  init() {
    this.renderProjects();
    this.bindEvents();
  }

  renderProjects() {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = "";

    const showMoreBtn = document.getElementById("show-more-btn");

    const filteredProjects =
      this.currentFilter === "all"
        ? this.projects
        : this.projects.filter((project) =>
          project.category.includes(this.currentFilter)
        );

    const projectsToRender = filteredProjects.slice(
      0,
      this.visibleProjectsCount
    );

    projectsToRender.forEach((project) => {
      const projectCard = this.createProjectCard(project);
      grid.appendChild(projectCard);
    });

    // 3. The old observer logic is now handled inside createProjectCard, so it's removed from here.

    if (showMoreBtn) {
      if (this.visibleProjectsCount < filteredProjects.length) {
        showMoreBtn.style.display = "block";
      } else {
        showMoreBtn.style.display = "none";
      }
    }
  }

  createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card animate-on-scroll fade-in-up"; // 2. Add animation classes
    card.dataset.projectId = project.id;

    card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.images[0]
      }')"></div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags
        .map((tag) => `<span class="project-tag">${tag}</span>`)
        .join("")}
            </div>
        </div>
    `;

    card.addEventListener("click", () => this.openModal(project));

    // 2. Tell the main AnimationManager to observe this new card
    if (this.animationManager) {
      this.animationManager.observeNewElement(card);
    }

    return card;
  }

  filterProjects(category) {
    this.currentFilter = category;
    this.visibleProjectsCount = this.projectsToShowInitially;

    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-filter="${category}"]`)
      .classList.add("active");

    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card) => card.classList.add("hidden"));

    setTimeout(() => this.renderProjects(), 300);
  }

  openModal(project) {
    this.populateModal(project);
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  populateModal(project) {
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-description").textContent =
      project.longDescription;
    document.getElementById("modal-live-link").href = project.liveUrl;
    document.getElementById("modal-github-link").href = project.githubUrl;

    // Tags
    const tagsContainer = document.getElementById("modal-tags");
    tagsContainer.innerHTML = project.tags
      .map((tag) => `<span class="project-tag">${tag}</span>`)
      .join("");

    // Features
    const featuresContainer = document.getElementById("modal-features");
    featuresContainer.innerHTML = project.features
      .map((feature) => `<li>${feature}</li>`)
      .join("");

    // Technologies
    const techContainer = document.getElementById("modal-tech");
    techContainer.innerHTML = project.technologies
      .map((tech) => `<span class="tech-item">${tech}</span>`)
      .join("");

    // Images
    const mainImage = document.getElementById("modal-main-image");
    const thumbnailsContainer = document.getElementById("modal-thumbnails");

    mainImage.src = project.images[0];
    mainImage.alt = project.title;

    thumbnailsContainer.innerHTML = project.images
      .map(
        (image, index) =>
          `<div class="thumbnail ${index === 0 ? "active" : ""
          }" data-image="${image}">
                <img src="${image}" alt="${project.title} ${index + 1}">
            </div>`
      )
      .join("");

    // Bind thumbnail clicks
    thumbnailsContainer.querySelectorAll(".thumbnail").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        thumbnailsContainer
          .querySelectorAll(".thumbnail")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        mainImage.src = thumb.dataset.image;
      });
    });
  }

  showMoreProjects() {
    // Incrementally show more projects instead of all at once
    const filteredProjects =
      this.currentFilter === "all"
        ? this.projects
        : this.projects.filter((project) =>
          project.category.includes(this.currentFilter)
        );

    this.visibleProjectsCount = filteredProjects.length; // Or use an incremental approach: this.visibleProjectsCount += 3;
    this.renderProjects();
  }

  bindEvents() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterProjects(btn.dataset.filter);
      });
    });

    document
      .getElementById("modal-close")
      .addEventListener("click", () => this.closeModal());
    document
      .getElementById("modal-overlay")
      .addEventListener("click", () => this.closeModal());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });

    const showMoreBtn = document.getElementById("show-more-btn");
    if (showMoreBtn) {
      showMoreBtn.addEventListener("click", () => this.showMoreProjects());
    }
  }
}

// Counter Animation
function initializeCounterAnimations() {
  const counters = document.querySelectorAll("[data-target]");

  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        if (current > target) current = target;

        if (target % 1 !== 0) {
          counter.textContent = current.toFixed(2);
        } else {
          counter.textContent = Math.floor(current);
        }

        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

// Floating Animations
function initializeFloatingAnimations() {
  const floatingElements = document.querySelectorAll(".floating-animation");

  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`;
  });
}

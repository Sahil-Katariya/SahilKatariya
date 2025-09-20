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
          this.ctx.strokeStyle = `rgba(${particleColor}, ${
            connectionOpacity * (1 - distance / 120)
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
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form submitted:", new FormData(this.form));
        resolve();
      }, 2000);
    });

    // For real implementation, you would use EmailJS or similar service:
    // To use EmailJS, first sign up at https://www.emailjs.com/
    // Then create a service, template, and get your public key.
    // Replace 'your_service_id', 'your_template_id', and 'your_public_key' below.
    // Uncomment the code after installing the emailjs SDK:
    // 1. Add <script src="https://cdn.emailjs.com/dist/email.min.js"></script> in your HTML.
    // 2. Initialize EmailJS: emailjs.init('your_public_key');
    // 3. Uncomment the code below:

    // return emailjs.sendForm(
    //     'your_service_id',
    //     'your_template_id',
    //     this.form,
    //     'your_public_key'
    // );
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
    }, 5000);
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
          entry.target.classList.add("in-view");

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

// You would also add this CSS for the ripple and stagger effects:
/*
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

// Example for staggering project cards:
.projects-grid.in-view .project-card {
    // This will apply the animation to each card
}

.projects-grid .project-card:nth-child(1) { transition-delay: 0.1s; }
.projects-grid .project-card:nth-child(2) { transition-delay: 0.2s; }
.projects-grid .project-card:nth-child(3) { transition-delay: 0.3s; }
// etc.
*/

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
      "AI/ML Engineer",
      "Robotics Enthusiast",
      "Computer Vision Expert",
    ]);
  }

  // Initialize project manager
  new ProjectManager(animationManager);

  // Initialize contact form
  new ContactForm();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize custom cursor (desktop only)
  if (window.innerWidth > 768) {
    initCustomCursor();
  }
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      }
    });
  }
}

// Custom Cursor
function initCustomCursor() {
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

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";

  if (window.scrollY > 100) {
    navbar.style.background =
      currentTheme === "dark"
        ? "rgba(10, 10, 10, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
  } else {
    navbar.style.background =
      currentTheme === "dark"
        ? "rgba(10, 10, 10, 0.9)"
        : "rgba(255, 255, 255, 0.9)";
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
    }, 300);
  }
}

// Project Data
const projectsData = [
  {
    id: 0,
    title: "AeroQSense",
    description:
      "Smart air quality monitoring and analysis system with visual insights through interactive dashboards",
    longDescription:
      "Developed an advanced Air Quality Index (AQI) monitoring system that integrates multiple environmental sensors to track pollutants like PM2.5, PM10, CO2, and NOx. The platform processes real-time data, applies predictive analytics, and provides visual insights through interactive dashboards for better environmental awareness and decision-making.",
    category: ["iot", "fullstack"],
    tags: [
      "IoT",
      "Air Quality Monitoring",
      "Data Analytics",
      "Machine Learning",
    ],
    features: [
      "Real-time air quality monitoring",
      "Multi-sensor integration (PM2.5, PM10, CO2, NOx)",
      "Predictive analytics for pollution trends",
      "Interactive visualization dashboard",
      "Data logging and historical comparison",
      "Alert system for threshold exceedance",
      "Cloud connectivity for remote access",
    ],
    technologies: ["Arduino/ESP32", "React", "MongoDB", "Chart.js"],
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
    title: "School Website",
    description:
      "Responsive and modern school website with comprehensive features",
    longDescription:
      "Developed a comprehensive school website with modern design and responsive layout. The website includes features for student information management, event announcements, faculty profiles, and administrative functions. Built with focus on user experience and accessibility.",
    category: ["web", "design"],
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    features: [
      "Responsive design for all devices",
      "Student information management",
      "Event and announcement system",
      "Faculty and staff profiles",
      "Administrative dashboard",
      "Contact and inquiry forms",
      "SEO optimized structure",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "jQuery"],
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
    id: 2,
    title: "FeedBack Hub",
    description:
      "Centralized platform to analyze feedback and drive data-informed improvements",
    longDescription:
      "Developed a comprehensive feedback analysis platform using AI and machine learning to centralize feedback collection and analysis. The system provides actionable insights through advanced analytics, sentiment analysis, and automated reporting to drive data-informed business improvements.",
    category: ["fullstack", "design"],
    tags: ["AI", "Machine Learning", "Data Analytics", "Python"],
    features: [
      "Centralized feedback collection system",
      "AI-powered sentiment analysis",
      "Real-time analytics dashboard",
      "Automated insight generation",
      "Multi-channel feedback integration",
      "Custom reporting and visualization",
      "Data-driven recommendation engine",
    ],
    technologies: [
      "Python",
      "TensorFlow",
      "Flask",
      "React",
      "MongoDB",
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
    id: 3,
    title: "Lunar DEM Generation (LDEM)",
    description:
      "ISRO Bharatiya Antariksh Hackathon - DEM pipeline using mono images",
    longDescription:
      "Developed a comprehensive Digital Elevation Model (DEM) pipeline using mono images for lunar surface mapping. This project was part of the ISRO Bharatiya Antariksh Hackathon, utilizing advanced computer vision techniques including Shape-from-Shading, OpenCV, and QGIS for accurate terrain reconstruction.",
    category: ["fullstack", "design"],
    tags: ["Python", "OpenCV", "QGIS", "Computer Vision"],
    features: [
      "Mono image processing for DEM generation",
      "Shape-from-Shading algorithm implementation",
      "QGIS integration for geographic visualization",
      "Advanced computer vision techniques",
      "Lunar surface terrain reconstruction",
      "High-accuracy elevation mapping",
      "Scalable processing pipeline",
    ],
    technologies: ["Python", "OpenCV", "QGIS", "NumPy", "SciPy", "Matplotlib"],
    images: ["./ldem/ldem(1).jpg", "./ldem/ldem(2).jpg"],
    liveUrl: "",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    id: 4,
    title: "ANAV Autonomous Drone Navigation System",
    description:
      "GPS-independent vision-based navigation system for autonomous drone traversal",
    longDescription:
      "Developed a sophisticated GPS-independent, vision-based navigation system for autonomous drone traversal as part of the ISRO Robotics Challenge 2025. The system uses advanced computer vision algorithms and machine learning for real-time navigation and obstacle avoidance.",
    category: ["mobile", "fullstack"],
    tags: ["Python", "Computer Vision", "Robotics", "AI"],
    features: [
      "GPS-independent navigation system",
      "Real-time computer vision processing",
      "Autonomous obstacle avoidance",
      "Machine learning-based path planning",
      "Drone control and stabilization",
      "Real-time video processing",
      "Advanced sensor fusion",
    ],
    technologies: [
      "Python",
      "OpenCV",
      "TensorFlow",
      "ROS",
      "NumPy",
      "Matplotlib",
    ],
    images: ["./anav/anav(1).jpg", "./anav/anav(2).jpg"],
    liveUrl: "https://github.com/Sahil-Katariya/QuodeCopter",
    githubUrl: "https://github.com/Sahil-Katariya/QuodeCopter",
    gradient: "linear-gradient(135deg, #ec4899, #f59e0b)",
  },
  {
    id: 5,
    title: "Animal Heaven",
    description:
      "Web application for animal lovers to share and discover content and connect with other animal lovers",
    longDescription:
      "a pet adoption website where users can post about their pets, find pets to adopt, and connect with other animal lovers.",
    category: ["fullstack", "design"],
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    features: [
      "User registration and authentication",
      "Pet profile creation and management",
      "Pet adoption and fostering",
      "Community features for interaction",
      "Search and filtering options",
      "Responsive design for all devices",
      "Admin panel for moderation",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    images: [
      "./animalheaven/animalheaven(1).jpg",
      "./animalheaven/animalheaven(2).jpg",
      "./animalheaven/animalheaven(3).jpg",
    ],
    liveUrl: "",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },
  {
    id: 6,
    title: "Face Authentication Attendance System",
    description:
      "Real-time face detection & logging system for attendance management",
    longDescription:
      "Implemented a sophisticated face authentication system for attendance management using real-time face detection and logging. The system uses advanced computer vision algorithms for accurate face recognition, anti-spoofing measures, and comprehensive attendance tracking with detailed analytics.",
    category: ["fullstack", "design"],
    tags: ["OpenCV", "Face Recognition", "Python", "Real-time"],
    features: [
      "Real-time face detection and recognition",
      "Anti-spoofing security measures",
      "Automated attendance logging",
      "Comprehensive user management",
      "Detailed attendance analytics",
      "Multi-camera support",
      "Export and reporting functionality",
    ],
    technologies: ["Python", "OpenCV", "dlib", "Flask", "SQLite", "NumPy"],
    images: [
      "./attendance/attendance(1).jpg",
      "./attendance/attendance(2).jpg",
    ],
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
        <div class="project-image" style="background-image: url('${
          project.images[0]
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
          `<div class="thumbnail ${
            index === 0 ? "active" : ""
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

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize page loader
  const pageLoader = new PageLoader();

  // Initialize other components after page loads
  pageLoader.onComplete(() => {
    // Initialize particle system
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
      new ParticleSystem(canvas);
    }

    // Initialize typing animation
    const typingElement = document.getElementById("typing-text");
    if (typingElement) {
      const texts = [
        "Full Stack Developer",
        "AI/ML Engineer",
        "Robotics Enthusiast",
        "Problem Solver",
        "Innovation Driver",
      ];
      new TypingAnimation(typingElement, texts, 100);
    }

    // Initialize theme manager
    new ThemeManager();

    // Initialize contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      new ContactForm();
    }

    // Initialize mobile menu
    initMobileMenu();

    // Initialize custom cursor
    initCustomCursor();

    // Initialize counter animations
    initializeCounterAnimations();

    // Initialize floating animations
    initializeFloatingAnimations();
  });
});

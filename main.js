// -------------------------------------------------------------
// PIYA DUTTA - Portfolio Interactive Logic & Robust PDF Download
// -------------------------------------------------------------

import { downloadPDF, pdfBase64 } from './cv-data.js';

document.addEventListener('DOMContentLoaded', () => {

  // Create a Blob URL for the live CV preview iframe
  let previewBlobUrl = '';
  function updatePreviewBlob() {
    try {
      const binaryString = window.atob(pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      if (previewBlobUrl && previewBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewBlobUrl);
      }
      previewBlobUrl = URL.createObjectURL(blob);
    } catch (err) {
      console.warn('Could not create Blob URL for iframe preview:', err);
      previewBlobUrl = './assets/Piya_Dutta_CV.pdf?v=' + Date.now();
    }
  }
  updatePreviewBlob();

  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');
  const drawerItems = document.querySelectorAll('.drawer-item');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileDrawerOverlay) mobileDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileDrawerOverlay) mobileDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);
  drawerItems.forEach(item => item.addEventListener('click', closeDrawer));

  // 2. Sticky Navbar & Active Section Highlighting
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  });

  // 3. Back-to-Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. CV Modal View Logic
  const cvModal = document.getElementById('cv-modal');
  const openCvHero = document.getElementById('open-cv-modal-hero');
  const openCvNav = document.getElementById('open-cv-modal-nav');
  const closeCvModal = document.getElementById('close-cv-modal');
  const closeCvModalBtn = document.getElementById('close-cv-modal-btn');
  const cvOverlay = document.getElementById('cv-modal-overlay');
  const cvIframe = document.getElementById('cv-iframe');

  function openCvModalHandler() {
    updatePreviewBlob();
    if (cvIframe && previewBlobUrl) {
      cvIframe.src = previewBlobUrl;
    }
    cvModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCvModalHandler() {
    cvModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openCvHero) openCvHero.addEventListener('click', openCvModalHandler);
  if (openCvNav) openCvNav.addEventListener('click', openCvModalHandler);
  if (closeCvModal) closeCvModal.addEventListener('click', closeCvModalHandler);
  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeCvModalHandler);
  if (cvOverlay) cvOverlay.addEventListener('click', closeCvModalHandler);

  // 6. Project Details Modal
  const projectModal = document.getElementById('project-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const closeProjectModalBtn = document.getElementById('close-project-modal-btn');
  const projectOverlay = document.getElementById('project-modal-overlay');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectDesc = document.getElementById('modal-project-desc');
  const openProjectBtns = document.querySelectorAll('.open-project-modal');

  openProjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      modalProjectTitle.textContent = title;
      modalProjectDesc.textContent = desc;
      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeProjectModalHandler() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeProjectModal) closeProjectModal.addEventListener('click', closeProjectModalHandler);
  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModalHandler);
  if (projectOverlay) projectOverlay.addEventListener('click', closeProjectModalHandler);

  // 7. Toast Notification Utility
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, icon = 'fa-circle-check') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 8. PDF Download Handler using in-memory Base64 Blob (bypasses browser HTTP cache)
  const downloadBtns = document.querySelectorAll('.download-cv-btn, a[download]');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Downloading Piya_Dutta_CV.pdf...', 'fa-file-arrow-down');
      downloadPDF();
    });
  });

  // 9. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name').value;
      showToast(`Thank you, ${nameInput}! Your message has been sent successfully.`, 'fa-paper-plane');
      contactForm.reset();
    });
  }

  // 10. Dark / Light Theme Switcher
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeTextMobile = document.getElementById('theme-text-mobile');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const isLight = theme === 'light';
    const iconClass = isLight ? 'fa-sun' : 'fa-moon';

    if (themeToggle) {
      themeToggle.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }
    if (themeToggleMobile) {
      const icon = themeToggleMobile.querySelector('i');
      if (icon) icon.className = `fa-solid ${iconClass}`;
      if (themeTextMobile) {
        themeTextMobile.textContent = isLight ? 'Dark Mode' : 'Light Mode';
      }
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme.toUpperCase()} theme`, nextTheme === 'light' ? 'fa-sun' : 'fa-moon');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  console.log('Piya Dutta Portfolio initialized with robust PDF Blob download.');
});

/* ==========================================================================
   main.js | runs on EVERY page
   Features:
     1. Theme toggle (dark / light) saved in localStorage
     2. Mobile menu open/close
     3. Active navigation link highlight
     4. Scroll-reveal animation (IntersectionObserver)
     5. Typing effect (Home page)
     6. Count-up numbers (Home page)
     7. Back-to-top button
     8. Footer year
   ========================================================================== */

"use strict"; // catches common coding mistakes early

/* ---------- 1. THEME TOGGLE ----------
   The saved theme is applied immediately so the page never "flashes". */
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

// localStorage can be blocked in some browsers, so we wrap it in try/catch
function getSavedTheme() {
  try { return localStorage.getItem("bj-theme") || "dark"; }
  catch (err) { return "dark"; }
}
function saveTheme(theme) {
  try { localStorage.setItem("bj-theme", theme); } catch (err) { /* ignore */ }
}

applyTheme(getSavedTheme());

document.addEventListener("DOMContentLoaded", () => {

  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      saveTheme(next);
      themeBtn.setAttribute("aria-pressed", String(next === "light"));
    });
  }

  /* ---------- 2. MOBILE MENU ---------- */
  const menuBtn  = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  function closeMenu() {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen)); // for screen readers
    });
    // Close the menu after choosing a link, or when pressing Escape
    navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- 3. ACTIVE NAV LINK ----------
     Compare each link with the current file name (e.g. "about.html"). */
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = link.getAttribute("href");
    if (target === currentPage || (currentPage === "" && target === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- 4. SCROLL REVEAL ----------
     IntersectionObserver tells us when an element enters the screen,
     which is faster than listening to every scroll event. */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target); // animate only once
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("in-view")); // old browsers
  }

  /* ---------- 5. TYPING EFFECT ----------
     Cycles through the phrases listed in the data-phrases attribute. */
  const typingEl = document.getElementById("typing-text");
  if (typingEl) {
    const phrases = JSON.parse(typingEl.dataset.phrases); // array of strings
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      typingEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0, charIndex = 0, deleting = false;

      function type() {
        const current = phrases[phraseIndex];
        typingEl.textContent = current.substring(0, charIndex);

        if (!deleting && charIndex < current.length) {          // typing forward
          charIndex++;
          setTimeout(type, 70);
        } else if (!deleting) {                                 // finished: pause
          deleting = true;
          setTimeout(type, 1800);
        } else if (charIndex > 0) {                             // deleting
          charIndex--;
          setTimeout(type, 35);
        } else {                                                // next phrase
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
        }
      }
      type();
    }
  }

  /* ---------- 6. COUNT-UP NUMBERS ----------
     Elements with data-count="12" animate from 0 up to 12 when visible. */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count);
        const duration = 1400;                 // milliseconds
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);   // ease-out curve
          el.textContent = Math.round(end * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => countObserver.observe(c));
  }

  /* ---------- 7. BACK-TO-TOP BUTTON ---------- */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- 8. FOOTER YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

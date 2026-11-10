/* ==========================================================================
   projects.js | runs only on the Projects page
   1. Filter buttons (show or hide project cards)
   2. Detail pop-up (modal) filled from the `projects` array
   3. Live password-strength demo inside the modal
   ========================================================================== */

"use strict";

/* ---------- DATA: an array of objects describing each project ---------- */
const projects = [
  {
    id: "dashboard",
    title: "Smart Building Security Dashboard",
    image: "assets/images/project-dashboard.svg",
    alt: "Mockup of the Smart Building Security Dashboard",
    summary: "A web dashboard that gives facility managers one clear view of a building's connected systems. It uses simulated data for doors, cameras, HVAC controllers and sensors, and highlights anything that looks unsafe.",
    features: [
      "Live counters for secured doors, online cameras and active alerts",
      "Traffic chart to spot unusual network activity",
      "Colour-coded device status list (green, amber, red)",
      "Event log that flags out-of-date firmware and suspicious access attempts"
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    demo: false
  },
  {
    id: "network",
    title: "Python Network Inventory Tool",
    image: "assets/images/project-network.svg",
    alt: "Mockup of the Python Network Inventory Tool in a terminal",
    summary: "A Python script that builds an inventory of the devices connected to a facility network and ranks each one by risk, so a security team knows what to fix first.",
    features: [
      "Lists every device with its IP address, type and vendor",
      "Flags devices that still use default usernames and passwords",
      "Highlights unknown devices that are not on the approved list",
      "Exports a CSV report that can be opened and sorted in Excel"
    ],
    tech: ["Python", "CSV", "Excel"],
    demo: false
  },
  {
    id: "password",
    title: "Password Strength Checker",
    image: "assets/images/project-password.svg",
    alt: "Mockup of the Password Strength Checker",
    summary: "A small JavaScript tool that scores a password as you type. It checks five simple rules and shows which ones are still missing. Try the working demo below.",
    features: [
      "Instant feedback on every keystroke",
      "Five rules: length, mixed case, numbers, symbols and common-password check",
      "Colour meter from red (weak) to green (excellent)",
      "Runs entirely in your browser, so nothing you type is stored or sent"
    ],
    tech: ["JavaScript", "HTML", "CSS"],
    demo: true
  }
];

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. FILTERS ---------- */
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("empty-state");
  const status = document.getElementById("filter-status");

  function applyFilter(filter) {
    let visible = 0;

    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;                 // the `hidden` attribute hides the card
      if (show) {
        visible++;
        card.classList.add("in-view");     // make sure revealed cards are visible
      }
    });

    chips.forEach((chip) => {
      const active = chip.dataset.filter === filter;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });

    emptyState.classList.toggle("show", visible === 0);
    status.textContent = "Showing " + visible + (visible === 1 ? " project" : " projects");
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
  });

  /* ---------- 2. MODAL ---------- */
  const modal = document.getElementById("project-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalSummary = document.getElementById("modal-summary");
  const modalFeatures = document.getElementById("modal-features");
  const modalTags = document.getElementById("modal-tags");
  const modalDemo = document.getElementById("modal-demo");
  let lastTrigger = null;                  // remember which button opened it

  function openProject(id, triggerButton) {
    const project = projects.find((p) => p.id === id);   // search the array
    if (!project) return;

    lastTrigger = triggerButton;
    modalImg.src = project.image;
    modalImg.alt = project.alt;
    modalTitle.textContent = project.title;
    modalSummary.textContent = project.summary;

    // Rebuild the lists. textContent (not innerHTML) keeps this safe from injected HTML.
    modalFeatures.replaceChildren();
    project.features.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      modalFeatures.appendChild(li);
    });

    modalTags.replaceChildren();
    project.tech.forEach((name) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = name;
      modalTags.appendChild(tag);
    });

    modalDemo.hidden = !project.demo;
    if (project.demo) resetDemo();

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");      // very old browsers
    }
  }

  function closeModal() {
    modal.close();
    if (lastTrigger) lastTrigger.focus();  // return keyboard focus
  }

  document.querySelectorAll("[data-project]").forEach((btn) => {
    btn.addEventListener("click", () => openProject(btn.dataset.project, btn));
  });
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-close-2").addEventListener("click", closeModal);

  // Clicking the dark backdrop (outside the box) also closes it
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  /* ---------- 3. PASSWORD DEMO ---------- */
  const demoInput = document.getElementById("demo-input");
  const demoMeter = document.getElementById("demo-meter");
  const demoLabel = document.getElementById("demo-label");
  const demoChecks = document.getElementById("demo-checks");

  const commonPasswords = ["password", "123456", "12345678", "qwerty", "admin", "letmein", "welcome", "iloveyou"];

  // Each rule is an object with a label and a test function
  const rules = [
    { label: "At least 12 characters",        test: (p) => p.length >= 12 },
    { label: "Upper and lower case letters",  test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { label: "Contains a number",             test: (p) => /\d/.test(p) },
    { label: "Contains a symbol (!@#$%)",     test: (p) => /[^A-Za-z0-9]/.test(p) },
    { label: "Not a common password",         test: (p) => p.length > 0 && !commonPasswords.includes(p.toLowerCase()) }
  ];
  const levelNames = ["", "Very weak", "Weak", "Fair", "Strong", "Excellent"];

  function updateDemo() {
    const pw = demoInput.value;
    let score = 0;

    demoChecks.replaceChildren();
    rules.forEach((rule) => {
      const passed = rule.test(pw);
      if (passed) score++;
      const li = document.createElement("li");
      li.textContent = rule.label;
      if (passed) li.classList.add("ok");
      demoChecks.appendChild(li);
    });

    if (pw.length === 0) {
      // Nothing typed yet: empty meter and a prompt
      demoMeter.className = "meter__fill";
      demoLabel.textContent = "Start typing to see your score";
      return;
    }

    // A score of 0 still counts as "Very weak" (e.g. the word "password")
    const level = Math.max(score, 1);
    demoMeter.className = "meter__fill s" + level;
    demoLabel.textContent = "Strength: " + levelNames[level] + " (" + score + "/5)";
  }

  function resetDemo() {
    demoInput.value = "";
    updateDemo();
  }

  demoInput.addEventListener("input", updateDemo);
  updateDemo();

  // Start with the "All" filter active
  applyFilter("all");
});

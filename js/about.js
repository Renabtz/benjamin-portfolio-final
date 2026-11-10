/* ==========================================================================
   about.js | runs only on the About page
   1. Animates the skill bars when they scroll into view
   2. Calculates the GPA from the academic record table
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. SKILL BARS ----------
     Every .skill__fill has a data-level (e.g. "70").
     When it becomes visible we set its width to that percentage,
     and the CSS transition animates the change. */
  const fills = document.querySelectorAll(".skill__fill");

  function fillBar(el) {
    el.style.width = el.dataset.level + "%";
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach((bar) => observer.observe(bar));
  } else {
    fills.forEach(fillBar);       // older browsers: just show the final width
  }

  /* ---------- 2. GPA CALCULATOR ----------
     GPA = sum(units x grade point) / sum(units)
     We read the numbers straight out of the table cells, so if you edit
     the table in the HTML, the GPA updates by itself. */
  const rows = document.querySelectorAll("#record-table tbody tr");
  const courses = [];                       // array of { units, points }

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    courses.push({
      units:  Number(cells[2].textContent),
      points: Number(cells[4].textContent)
    });
  });

  function calculateGpa(list) {
    const totalUnits = list.reduce((sum, c) => sum + c.units, 0);
    const totalPoints = list.reduce((sum, c) => sum + c.units * c.points, 0);
    return { totalUnits, gpa: totalUnits ? totalPoints / totalUnits : 0 };
  }

  const result = calculateGpa(courses);
  const unitsCell = document.getElementById("total-units");
  const gpaCell = document.getElementById("gpa");
  if (unitsCell && gpaCell) {
    unitsCell.textContent = result.totalUnits;
    gpaCell.textContent = result.gpa.toFixed(2);
  }
});

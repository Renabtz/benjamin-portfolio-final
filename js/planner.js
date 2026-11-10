/* ==========================================================================
   planner.js | the Academic Planner (runs only on planner.html)

   How it works, in one paragraph:
   All tasks live in ONE array called `tasks`. Every action (add, complete,
   delete, filter) changes that array, saves it, and then calls render(),
   which redraws the list from scratch. Keeping "the data" and "what is
   drawn" separate like this keeps the code simple and bug-free.
   ========================================================================== */

"use strict";

const STORAGE_KEY = "bj-planner-tasks";
const PRIORITIES = ["low", "medium", "high"];

let tasks = [];             // the single source of truth: an array of task objects
let currentFilter = "all";  // "all" | "active" | "done"

/* A task object looks like:
   { id: "t1700000000000", title: "Finish assignment", course: "CSC 102",
     due: "2026-11-12", priority: "high", done: false } */


/* ---------- DATE HELPERS ----------
   We use local dates formatted as YYYY-MM-DD, which can be compared as text. */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function daysFromToday(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return toISODate(date);
}

function formatDue(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}


/* ---------- STORAGE ---------- */
/* Data from localStorage is "untrusted" (anyone can edit it in dev tools),
   so every field is checked and cleaned before we use it. */
function cleanTask(raw) {
  if (!raw || typeof raw !== "object") return null;
  const title = String(raw.title || "").trim().slice(0, 100);
  if (!title) return null;
  return {
    id: String(raw.id || "t" + Date.now() + Math.random().toString(16).slice(2)),
    title: title,
    course: String(raw.course || "").trim().slice(0, 30),
    due: /^\d{4}-\d{2}-\d{2}$/.test(raw.due) ? raw.due : "",
    priority: PRIORITIES.includes(raw.priority) ? raw.priority : "medium",
    done: raw.done === true
  };
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return null;                 // first visit
    const list = JSON.parse(saved);
    return Array.isArray(list) ? list.map(cleanTask).filter(Boolean) : [];
  } catch (err) {
    return null;                                     // storage blocked or corrupt
  }
}

function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch (err) { /* storage unavailable: the planner still works for this visit */ }
}

/* Sample tasks shown on the very first visit so the page is not empty */
function sampleTasks() {
  return [
    { id: "s1", title: "Submit portfolio website", course: "CSC 104", due: daysFromToday(3), priority: "high",   done: false },
    { id: "s2", title: "Read Chapter 3: Network basics", course: "CYB 104", due: daysFromToday(5), priority: "medium", done: false },
    { id: "s3", title: "Practise Python loops", course: "CSC 102", due: daysFromToday(8), priority: "low",    done: false },
    { id: "s4", title: "Set up GitHub repository", course: "CSC 104", due: daysFromToday(-1), priority: "medium", done: true }
  ];
}


/* ---------- ACTIONS (these change the data, then redraw) ---------- */
function addTask(data) {
  tasks.push({
    id: "t" + Date.now() + Math.random().toString(16).slice(2, 6),
    title: data.title,
    course: data.course,
    due: data.due,
    priority: data.priority,
    done: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  render();
  announce('"' + task.title + '" marked ' + (task.done ? "complete" : "pending"));
}

function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  tasks = tasks.filter((t) => t.id !== id);          // keep everything except this one
  saveTasks();
  render();
  announce('Deleted "' + task.title + '"');
}

function clearCompleted() {
  const count = tasks.filter((t) => t.done).length;
  if (count === 0) { announce("No completed tasks to clear"); return; }
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
  announce(count + (count === 1 ? " completed task cleared" : " completed tasks cleared"));
}


/* ---------- RENDERING (draw the list from the array) ---------- */
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("task-empty");
const template = document.getElementById("task-template");
const statusEl = document.getElementById("planner-status");

function announce(message) {
  statusEl.textContent = message;                    // read out by screen readers
}

function visibleTasks() {
  let list = tasks.filter((t) =>
    currentFilter === "all" ? true : currentFilter === "done" ? t.done : !t.done
  );
  // Sort: unfinished first, then earliest due date, then highest priority
  const weight = { high: 0, medium: 1, low: 2 };
  list = list.slice().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.due !== b.due) {
      if (!a.due) return 1;                          // tasks with no date go last
      if (!b.due) return -1;
      return a.due < b.due ? -1 : 1;
    }
    return weight[a.priority] - weight[b.priority];
  });
  return list;
}

function buildTaskRow(task) {
  const row = template.content.firstElementChild.cloneNode(true);   // copy the template
  const today = toISODate(new Date());

  row.dataset.id = task.id;
  row.classList.add("task--" + task.priority);
  if (task.done) row.classList.add("task--done");

  const check = row.querySelector(".task__check");
  const title = row.querySelector(".task__title");
  check.id = "check-" + task.id;
  check.checked = task.done;
  title.htmlFor = check.id;                          // clicking the text toggles the checkbox
  title.textContent = task.title;                    // textContent = safe against injected HTML

  const badge = row.querySelector(".badge");
  badge.textContent = task.priority;
  badge.classList.add("badge--" + task.priority);

  const course = row.querySelector(".task__course");
  if (task.course) course.textContent = task.course; else course.remove();

  const due = row.querySelector(".task__due");
  if (task.due) {
    if (task.due === today) due.textContent = "Due today";
    else due.textContent = "Due " + formatDue(task.due);
    if (!task.done && task.due < today) {
      due.classList.add("task__due--overdue");
      due.textContent = "Overdue: " + formatDue(task.due);
    }
  } else {
    due.remove();
  }

  row.querySelector(".task__delete").setAttribute("aria-label", "Delete task: " + task.title);
  return row;
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-todo").textContent = total - done;
  document.getElementById("progress-text").textContent = percent + "%";
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-bar").setAttribute("aria-valuenow", String(percent));
}

function render() {
  const list = visibleTasks();
  listEl.replaceChildren(...list.map(buildTaskRow));  // swap the whole list in one go

  emptyEl.hidden = list.length !== 0;
  if (list.length === 0) {
    emptyEl.textContent = tasks.length === 0
      ? "Nothing here yet. Add a task to get started."
      : "No tasks match this filter.";
  }
  updateStats();
}


/* ---------- EVENTS ---------- */
document.addEventListener("DOMContentLoaded", () => {

  // Load saved tasks (or the samples on the first visit)
  const saved = loadTasks();
  tasks = saved === null ? sampleTasks() : saved;
  if (saved === null) saveTasks();

  /* Add-task form */
  const form = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const titleField = document.getElementById("field-title");
  const errorEl = document.getElementById("task-error");

  function showError(message) {
    errorEl.textContent = message;
    titleField.classList.toggle("field--invalid", Boolean(message));
    titleInput.setAttribute("aria-invalid", message ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();                              // stop the page reloading
    const title = titleInput.value.trim();

    if (title === "") { showError("Please enter a task before adding it."); titleInput.focus(); return; }
    if (title.length < 3) { showError("Task must be at least 3 characters."); titleInput.focus(); return; }

    showError("");
    addTask({
      title: title,
      course: document.getElementById("task-course").value.trim(),
      due: document.getElementById("task-due").value,
      priority: document.getElementById("task-priority").value
    });
    announce('Added "' + title + '"');
    form.reset();
    document.getElementById("task-priority").value = "medium";
    titleInput.focus();
  });

  titleInput.addEventListener("input", () => { if (errorEl.textContent) showError(""); });

  /* Event delegation: ONE listener on the list handles every row,
     including rows that are created later. */
  listEl.addEventListener("change", (e) => {
    if (e.target.classList.contains("task__check")) {
      toggleTask(e.target.closest(".task").dataset.id);
    }
  });

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".task__delete");
    if (!btn) return;
    const row = btn.closest(".task");
    row.classList.add("task--removing");             // fade-out animation first
    setTimeout(() => deleteTask(row.dataset.id), 250);
  });

  /* Filter buttons */
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      currentFilter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle("active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  document.getElementById("clear-done").addEventListener("click", clearCompleted);

  render();
});

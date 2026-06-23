const input = document.getElementById("task-input");
const dateInput = document.getElementById("task-date");
const addBtn = document.getElementById("add-task");
const list = document.getElementById("task-list");
const search = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");
const counter = document.getElementById("task-counter");
const themeToggle = document.getElementById("theme-toggle");
const langToggle = document.getElementById("lang-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentLang = localStorage.getItem("lang") || "en";

function renderTasks() {
  list.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    const matchText = task.text.toLowerCase().includes(search.value.toLowerCase());
    const matchFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" && task.done) ||
      (currentFilter === "pending" && !task.done);
    return matchText && matchFilter;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    li.innerHTML = `
      <span>${task.text} <small>(${task.date})</small></span>
      <div class="actions">
        <button onclick="toggleDone(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateCounter();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  const date = dateInput.value;

  if (text === "" || date === "") return;

  tasks.push({ text, date, done: false });
  input.value = "";
  dateInput.value = "";
  renderTasks();
});

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

search.addEventListener("input", renderTasks);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

function updateCounter() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  counter.textContent = currentLang === "ar"
    ? `✅ ${done}/${total} مهمة مكتملة`
    : `✅ ${done}/${total} tasks completed`;
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem("lang", currentLang);
  applyLanguage();
});

function applyLanguage() {
  if (currentLang === "ar") {
    document.documentElement.lang = "ar";
    document.body.dir = "rtl";
    document.querySelector("h1").textContent = "🧠 مهامي الذكية";
    input.placeholder = "أدخل مهمة...";
    dateInput.placeholder = "التاريخ";
    addBtn.textContent = "➕";
    search.placeholder = "🔍 ابحث في المهام...";
    document.querySelectorAll(".filter-btn")[0].textContent = "الكل";
    document.querySelectorAll(".filter-btn")[1].textContent = "✅ تم";
    document.querySelectorAll(".filter-btn")[2].textContent = "🕓 لم يتم";
    langToggle.textContent = "🌐 AR";
  } else {
    document.documentElement.lang = "en";
    document.body.dir = "ltr";
    document.querySelector("h1").textContent = "🧠 SmartTasks";
    input.placeholder = "Write a task...";
    addBtn.textContent = "➕";
    search.placeholder = "🔍 Search tasks...";
    document.querySelectorAll(".filter-btn")[0].textContent = "All";
    document.querySelectorAll(".filter-btn")[1].textContent = "✅ Done";
    document.querySelectorAll(".filter-btn")[2].textContent = "🕓 Pending";
    langToggle.textContent = "🌐 EN";
  }
  renderTasks();
}

applyLanguage();

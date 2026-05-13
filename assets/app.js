const canvas = document.querySelector("#chipCanvas");
const ctx = canvas.getContext("2d");
const themeToggle = document.querySelector("#themeToggle");
const noteInput = document.querySelector("#noteInput");
const saveNote = document.querySelector("#saveNote");
const clearNotes = document.querySelector("#clearNotes");
const savedNotes = document.querySelector("#savedNotes");
const noteCount = document.querySelector("#noteCount");
const filterButtons = document.querySelectorAll(".filter-pill");
const postCards = document.querySelectorAll(".post-card");

const storageKey = "ysyx-blog-notes";
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(rect.width, rect.height);
}

function createParticles(width, height) {
  const count = Math.max(26, Math.floor(width / 34));
  particles = Array.from({ length: count }, (_, index) => ({
    x: (index * 71) % width,
    y: (index * 47) % height,
    speed: 0.28 + (index % 5) * 0.06,
    lane: index % 2 === 0 ? "x" : "y",
  }));
}

function drawChip(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#17211f";
  ctx.fillRect(0, 0, width, height);

  const grid = Math.max(34, Math.min(58, width / 18));
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(63, 190, 174, 0.18)";

  for (let x = 0; x < width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const chipSize = Math.min(width * 0.38, height * 0.5, 360);
  const cx = width * 0.7;
  const cy = height * 0.48;
  const left = cx - chipSize / 2;
  const top = cy - chipSize / 2;

  ctx.fillStyle = "rgba(18, 45, 41, 0.86)";
  ctx.strokeStyle = "rgba(241, 196, 86, 0.9)";
  ctx.lineWidth = 2;
  ctx.fillRect(left, top, chipSize, chipSize);
  ctx.strokeRect(left, top, chipSize, chipSize);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  const innerStep = chipSize / 6;
  for (let i = 1; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(left + i * innerStep, top + 20);
    ctx.lineTo(left + i * innerStep, top + chipSize - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left + 20, top + i * innerStep);
    ctx.lineTo(left + chipSize - 20, top + i * innerStep);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(236, 124, 88, 0.92)";
  for (let i = 0; i < 16; i += 1) {
    const offset = (i + 1) * (chipSize / 17);
    ctx.fillRect(left - 12, top + offset, 12, 3);
    ctx.fillRect(left + chipSize, top + offset, 12, 3);
    ctx.fillRect(left + offset, top - 12, 3, 12);
    ctx.fillRect(left + offset, top + chipSize, 3, 12);
  }

  particles.forEach((particle, index) => {
    if (particle.lane === "x") {
      particle.x = (particle.x + particle.speed) % width;
    } else {
      particle.y = (particle.y + particle.speed) % height;
    }
    const pulse = 0.55 + Math.sin(time / 420 + index) * 0.35;
    ctx.fillStyle = `rgba(63, 190, 174, ${pulse})`;
    ctx.fillRect(particle.x, particle.y, 4, 4);
  });

  requestAnimationFrame(drawChip);
}

function getNotes() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function renderNotes() {
  const notes = getNotes();
  noteCount.textContent = String(notes.length);
  savedNotes.innerHTML = "";

  notes.slice(0, 5).forEach((note) => {
    const article = document.createElement("article");
    article.className = "note-item";

    const time = document.createElement("time");
    time.dateTime = note.createdAt;
    time.textContent = new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(note.createdAt));

    const body = document.createElement("p");
    body.textContent = note.text;

    article.append(time, body);
    savedNotes.append(article);
  });
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;
  const notes = getNotes();
  notes.unshift({ text, createdAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(notes));
  noteInput.value = "";
  renderNotes();
}

function filterPosts(filter) {
  postCards.forEach((card) => {
    const tags = card.dataset.tags.split(" ");
    card.hidden = filter !== "all" && !tags.includes(filter);
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("ysyx-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

saveNote.addEventListener("click", addNote);
clearNotes.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  renderNotes();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterPosts(button.dataset.filter);
  });
});

if (localStorage.getItem("ysyx-theme") === "dark") {
  document.body.classList.add("dark");
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
renderNotes();
requestAnimationFrame(drawChip);

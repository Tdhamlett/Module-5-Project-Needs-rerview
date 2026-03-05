console.log("script loaded");

// =======================
// Row scroll arrows
// =======================
const rows = document.querySelectorAll(".card-row");

function getScrollAmount(row) {
  return Math.max(row.clientWidth * 0.9, 260);
}

function updateArrowStates(row) {
  const prev = document.querySelector(
    `.row-nav.prev[data-row-target="${row.id}"]`
  );
  const next = document.querySelector(
    `.row-nav.next[data-row-target="${row.id}"]`
  );

  if (!prev || !next) return;

  const maxScroll = row.scrollWidth - row.clientWidth - 2;
  prev.disabled = row.scrollLeft <= 2;
  next.disabled = row.scrollLeft >= maxScroll;
}

function scrollRow(row, direction) {
  row.scrollBy({
    left: direction * getScrollAmount(row),
    behavior: "smooth",
  });
}

rows.forEach((row) => {
  updateArrowStates(row);
  row.addEventListener("scroll", () => updateArrowStates(row), { passive: true });
});

window.addEventListener("resize", () => {
  rows.forEach((row) => updateArrowStates(row));
});

document.querySelectorAll(".row-nav").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.rowTarget;
    const row = document.getElementById(targetId);
    if (!row) return;

    const direction = button.classList.contains("next") ? 1 : -1;
    scrollRow(row, direction);
  });
});

// =======================
// Search Feature
// =======================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const carPages = {
  "rivian r1s": "rivian.html",
  "volvo ex30": "volvo.html",
  "mach e": "mache.html",
  "kia ev9": "ev9.html",
  "audi q8 e tron": "audi.html",
  "nissan ariya": "ariya.html",
  "polestar 5": "polestar.html",
  "cadillac celestiq": "celestiq.html",
  "afeela ev": "afeela.html",
  "genesis gv90": "gv90.html",
  "lotus type 135": "lotus.html",
  "scout traveler ev": "scout.html",
};

function runSearch() {
  if (!searchInput) return;

  const userInput = searchInput.value.toLowerCase().trim();

  if (carPages[userInput]) {
    window.open(carPages[userInput], "_blank");
  } else {
    alert("Car not found.");
  }
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", runSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
}

// =======================
// Sorting Filter (Default / A-Z / Z-A)
// =======================
const sortSelect = document.getElementById("sortSelect");

// Save original order (so Default works)
const defaultOrderMap = new Map();
document.querySelectorAll(".card-row").forEach((row) => {
  defaultOrderMap.set(row.id, Array.from(row.querySelectorAll(".car-card")));
});

function sortRow(rowEl, mode) {
  if (!rowEl) return;

  if (mode === "default") {
    const original = defaultOrderMap.get(rowEl.id) || [];
    original.forEach((card) => rowEl.appendChild(card));
    return;
  }

  const cards = Array.from(rowEl.querySelectorAll(".car-card"));

  cards.sort((a, b) => {
    const aTitle = a.querySelector("h3")?.innerText.trim().toLowerCase() || "";
    const bTitle = b.querySelector("h3")?.innerText.trim().toLowerCase() || "";

    if (mode === "az") return aTitle.localeCompare(bTitle);
    if (mode === "za") return bTitle.localeCompare(aTitle);
    return 0;
  });

  cards.forEach((card) => rowEl.appendChild(card));
}

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    const mode = e.target.value;
    document.querySelectorAll(".card-row").forEach((row) => sortRow(row, mode));
  });
}

// =======================
// Trailer Modal (Popup)
// =======================
const playTrailerBtn = document.getElementById("playTrailerBtn");
const trailerModal = document.getElementById("trailerModal");
const closeTrailer = document.getElementById("closeTrailer");
const trailerVideo = document.querySelector("#trailerModal iframe");

if (playTrailerBtn && trailerModal) {
  playTrailerBtn.addEventListener("click", () => {
    trailerModal.style.display = "flex";
  });
}

if (closeTrailer && trailerModal && trailerVideo) {
  closeTrailer.addEventListener("click", () => {
    trailerModal.style.display = "none";

    // STOP VIDEO (guaranteed)
    trailerVideo.src = "";
    trailerVideo.src = "https://www.youtube.com/embed/5gw91lFMckg";
  });
}

    

// Optional: click outside modal content to close (still simple)
if (trailerModal) {
  trailerModal.addEventListener("click", (e) => {
    if (e.target === trailerModal) {
      trailerModal.style.display = "none";
    }

  });
}
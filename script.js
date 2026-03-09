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
// Search Feature (API fetch)
// Uses NHTSA vPIC GetModelsForMake
// =======================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

async function runSearch() {
  if (!searchInput || !searchResults) return;

  const userInput = searchInput.value.trim();

  if (!userInput) {
    searchResults.innerHTML = "<p>Please enter a car make.</p>";
    return;
  }

  searchResults.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(
        userInput
      )}?format=json`
    );

    const data = await response.json();

    if (!data.Results || data.Results.length === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
      return;
    }

    const firstSix = data.Results.slice(0, 6);

    searchResults.innerHTML = firstSix
      .map(
        (car) => `
          <article class="search-card">
            <h3>${car.Model_Name}</h3>
            <p>${car.Make_Name}</p>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.error("Search error:", error);
    searchResults.innerHTML = "<p>Something went wrong.</p>";
  }
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", runSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
}

// =======================
// Sorting Filter
// =======================
const sortSelect = document.getElementById("sortSelect");

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
// Trailer Modal
// =======================
const playTrailerBtn = document.getElementById("playTrailerBtn");
const trailerModal = document.getElementById("trailerModal");
const closeTrailer = document.getElementById("closeTrailer");
const trailerVideo = document.querySelector("#trailerModal iframe");

function resetTrailer() {
  if (!trailerVideo) return;
  trailerVideo.src = "";
  trailerVideo.src = "https://www.youtube.com/embed/5gw91lFMckg";
}

if (playTrailerBtn && trailerModal) {
  playTrailerBtn.addEventListener("click", () => {
    trailerModal.style.display = "flex";
  });
}

if (closeTrailer && trailerModal) {
  closeTrailer.addEventListener("click", () => {
    trailerModal.style.display = "none";
    resetTrailer();
  });
}

if (trailerModal) {
  trailerModal.addEventListener("click", (e) => {
    if (e.target === trailerModal) {
      trailerModal.style.display = "none";
      resetTrailer();
    }
  });
}
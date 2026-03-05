const rows = document.querySelectorAll(".card-row");

function getScrollAmount(row) {
  return Math.max(row.clientWidth * 0.9, 260);
}

function updateArrowStates(row) {
  const prev = document.querySelector(`.row-nav.prev[data-row-target="${row.id}"]`);
  const next = document.querySelector(`.row-nav.next[data-row-target="${row.id}"]`);
  if (!prev || !next) return;

  const maxScroll = row.scrollWidth - row.clientWidth - 2;
  prev.disabled = row.scrollLeft <= 2;
  next.disabled = row.scrollLeft >= maxScroll;
}

function scrollRow(row, direction) {
  row.scrollBy({
    left: direction * getScrollAmount(row),
    behavior: "smooth"
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

// ===== Search Feature =====

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const carPages = {
  "rivian r1s": "rivian.html",
  "volvo ex30": "volvo.html",
  "mach-e": "mache.html",
  "kia ev9": "ev9.html",
  "audi q8 e-tron": "audi.html",
  "nissan ariya": "ariya.html",
  "polestar 5": "polestar.html",
  "cadillac celestiq": "celestiq.html",
  "afeela ev": "afeela.html",
  "genesis gv90": "gv90.html",
  "lotus type 135": "lotus.html",
  "scout traveler ev": "scout.html"
};

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const userInput = searchInput.value.toLowerCase().trim();

    if (carPages[userInput]) {
      window.open(carPages[userInput], "_blank");
    } else {
      alert("Car not found.");
    }
  });

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
}

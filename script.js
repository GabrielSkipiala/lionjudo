let lastScrollY = window.scrollY;
const navbar = document.getElementById("navbar");
const toggleBtn = document.getElementById("toggleNavbar");

// Na starcie chowamy przycisk
toggleBtn.style.display = "none";

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY && window.scrollY > 50) {
    // Scroll w dół → chowamy pasek, pokazujemy ptaszka
    navbar.classList.add("hidden");
    toggleBtn.style.display = "block";
  } else if (window.scrollY < lastScrollY) {
    // Scroll w górę → pokazujemy pasek, chowamy ptaszka
    navbar.classList.remove("hidden");
    toggleBtn.style.display = "none";
  }
  lastScrollY = window.scrollY;
});

toggleBtn.addEventListener("click", () => {
  navbar.classList.remove("hidden");
  toggleBtn.style.display = "none";
});

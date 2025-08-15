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


const slideContainer = document.querySelector('.slide-container');
const slides = document.querySelectorAll('.slide-container img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;

function showSlide(i) {
  if (i < 0) index = slides.length - 1;
  else if (i >= slides.length) index = 0;
  else index = i;

  slideContainer.style.transform = `translateX(${-index * 100}%)`;
}

prevBtn.addEventListener('click', () => showSlide(index - 1));
nextBtn.addEventListener('click', () => showSlide(index + 1));


const dotsContainer = document.querySelector('.slider-dots');

// Tworzenie kropek
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.slider-dots button');

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Modyfikacja funkcji showSlide
function showSlide(i) {
  if (i < 0) index = slides.length - 1;
  else if (i >= slides.length) index = 0;
  else index = i;

  slideContainer.style.transform = `translateX(${-index * 100}%)`;
  updateDots();
}

// Na start ustaw aktywną kropkę
updateDots();

const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");
const originalCards = Array.from(track.children);
const container = document.querySelector(".carousel-container");

let currentIndex = 0;
let cardWidth = originalCards[0].offsetWidth + 20;
let cards = [];
let autoSlideInterval;

function cloneCards() {
    const first = originalCards.slice(0, 3).map(card => card.cloneNode(true));
    const last = originalCards.slice(2).map(card => card.cloneNode(true));

    // Clone and append/prepend
    last.reverse().forEach(card => {
        card.classList.add("clone");
        track.insertBefore(card, track.firstChild);
    });
    first.forEach(card => {
        card.classList.add("clone");
        track.appendChild(card);
    });

    cards = Array.from(track.children);
}

function updateCarousel(animate = true) {
    const containerWidth = container.offsetWidth;
    const offset = (cardWidth * currentIndex) - (containerWidth / 2) + (cardWidth / 2);
    track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
}

function updateDots() {
    const dots = dotsContainer.querySelectorAll("span");
    dots.forEach(dot => dot.classList.remove("active"));

    let logicalIndex = currentIndex - 2;
    if (logicalIndex < 0) logicalIndex += originalCards.length;
    if (logicalIndex >= originalCards.length) logicalIndex -= originalCards.length;

    if (dots[logicalIndex]) dots[logicalIndex].classList.add("active");
}

function createDots() {
    for (let i = 0; i < originalCards.length; i++) {
        const dot = document.createElement("span");
        dot.addEventListener("click", () => {
            currentIndex = i + 2;
            updateCarousel();
            resetAutoSlide(); // Optional: reset timer on manual nav
        });
        dotsContainer.appendChild(dot);
    }
}

function setupInfiniteLoop() {
    track.addEventListener("transitionend", () => {
        if (cards[currentIndex].classList.contains("clone")) {
            if (currentIndex < 2) {
                currentIndex = originalCards.length + currentIndex;
            } else if (currentIndex >= originalCards.length + 2) {
                currentIndex = currentIndex - originalCards.length;
            }
            updateCarousel(false);
        }
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentIndex++;
        updateCarousel();
    }, 2000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function init() {
    cloneCards();
    cards = Array.from(track.children);
    createDots();
    currentIndex = 4; // Start with the 3rd actual card (index 2)
    updateCarousel();
    setupInfiniteLoop();
    startAutoSlide();
}

init();



const nameTarget = document.getElementById("nameTarget");
const bgmToggle = document.getElementById("bgmToggle");
const bgm = document.getElementById("bgm");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");
const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const videoModalClose = document.querySelector(".video-modal__close");
const videoModalOverlay = document.querySelector(".video-modal__overlay");

let noClicks = 0;
let currentName = "";

function showMessage(text, celebrate = false) {
  message.textContent = text;
  message.classList.remove("hidden", "celebrate", "visible");

  if (celebrate) {
    message.classList.add("celebrate");
  }

  // force reflow so the transition retriggers
  void message.offsetWidth;
  message.classList.add("visible");
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const entries = {};
  for (const [key, value] of params.entries()) {
    entries[key] = value;
  }
  return entries;
}

function createHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);

  heart.addEventListener(
    "animationend",
    () => {
      heart.remove();
    },
    { once: true }
  );
}

// Read name from URL (coming from login.html) and personalize
const query = getQueryParams();
if (query.name) {
  currentName = query.name.trim();
  if (currentName) {
    nameTarget.textContent = `, ${currentName}`;
  }
} else {
  // If someone opens index.html directly, gently send them to login
  window.location.replace("login.html");
}

function showVideo(videoSrc) {
  modalVideo.src = videoSrc;
  videoModal.classList.remove("hidden");
  modalVideo.play().catch((err) => {
    console.error("Video autoplay failed:", err);
  });
}

function closeVideo() {
  modalVideo.pause();
  modalVideo.src = "";
  videoModal.classList.add("hidden");
}

videoModalClose.addEventListener("click", closeVideo);
videoModalOverlay.addEventListener("click", closeVideo);

// Background music toggle
if (bgmToggle && bgm) {
  bgmToggle.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play().catch((err) => console.error("BGM play failed:", err));
      bgmToggle.classList.add("is-playing");
    } else {
      bgm.pause();
      bgmToggle.classList.remove("is-playing");
    }
  });
}

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !videoModal.classList.contains("hidden")) {
    closeVideo();
  }
});

yesBtn.addEventListener("click", (e) => {
  const nameBit = currentName ? `, ${currentName}` : "";
  showMessage(`Yay! You just made my whole day${nameBit}. 💘`, true);

  // burst of hearts
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 7; i++) {
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 30;
    createHeart(centerX + offsetX, centerY + offsetY);
  }

  // Show and play yes.mp4 video
  showVideo("yes.mp4");
});

noBtn.addEventListener("mouseenter", () => {
  noClicks++;

  if (noClicks === 1) {
    showMessage("Are you suuuure? I think you meant to press Yes. 😏");
  } else if (noClicks === 2) {
    showMessage("Hmm, this button seems shy. Maybe try the other one? 💗");
  } else if (noClicks >= 3) {
    showMessage("Okay, okay, I get it... but I’m still choosing you. 💌");
  }

  const card =
    noBtn.closest(".valentine-card") || noBtn.closest(".card") || document.body;
  const bounds = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 16;
  const maxX = bounds.width - btnRect.width - padding;
  const maxY = bounds.height - btnRect.height - 80; // keep within the bottom

  let randomX = Math.random() * maxX;
  let randomY = Math.random() * maxY;

  // prevent it from going too close to the yes button horizontally
  const yesRect = yesBtn.getBoundingClientRect();
  const relativeYesX = yesRect.left - bounds.left;

  if (Math.abs(randomX - relativeYesX) < 60) {
    randomX = (randomX + bounds.width / 2) % maxX;
  }

  noBtn.style.position = "absolute";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY + 10}px`;
});

noBtn.addEventListener("click", () => {
  // In case someone actually manages to click it on mobile
  showMessage("You tapped No, but my heart definitely heard Yes. 💞");
  
  // Show and play no.mp4 video
  showVideo("no.mp4");
});

// Stacked cards scroll effect using GSAP + ScrollTrigger
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);  const cards = gsap.utils.toArray(".c-card");
  const lastIndex = cards.length - 1;

  if (cards.length > 0) {
    const lastCardST = ScrollTrigger.create({
      trigger: cards[lastIndex],
      start: "center center",
    });

    cards.forEach((card, index) => {
      const scale = index === lastIndex ? 1 : 0.85;      gsap.to(card, {
        scale,
        scrollTrigger: {
          trigger: card,
          start: "top top",
          end: () => lastCardST.start,
          pin: true,
          pinSpacing: false,
          scrub: 0.5,
        },
      });
    });
  }
}
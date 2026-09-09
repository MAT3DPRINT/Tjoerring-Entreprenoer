const panicModal = document.getElementById("panicModal");
const modalClose = document.getElementById("modalClose");
const modalOkay = document.getElementById("modalOkay");
const panicButtons = document.querySelectorAll(".panic-btn");
const distance = document.getElementById("distance");
const recalculate = document.getElementById("recalculate");
const logo = document.getElementById("logo");
const toast = document.getElementById("toast");

function openModal() {
  panicModal.classList.add("show");
  panicModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  panicModal.classList.remove("show");
  panicModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

panicButtons.forEach(btn => btn.addEventListener("click", openModal));
modalClose.addEventListener("click", closeModal);
modalOkay.addEventListener("click", closeModal);

panicModal.addEventListener("click", (event) => {
  if (event.target === panicModal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

recalculate.addEventListener("click", () => {
  const fakeDistance = (Math.random() * 8.7 + 0.3).toFixed(1).replace(".", ",");
  distance.textContent = `${fakeDistance} KM`;
  recalculate.textContent = "Meget videnskabeligt beregnet ✓";

  setTimeout(() => {
    recalculate.textContent = "Beregn igen";
  }, 1800);
});

// Logoet fungerer som et normalt link tilbage til forsiden.
// Easter-egget er flyttet til Shift + klik, så almindelige klik altid virker.
logo.addEventListener("click", (event) => {
  if (event.shiftKey) {
    event.preventDefault();
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }
});


const heroLogoCard = document.getElementById("heroLogoCard");
let heroLogoBusy = false;

function runHeroLogoEasterEgg() {
  if (!heroLogoCard || heroLogoBusy) return;
  heroLogoBusy = true;

  const steps = ["step-rumble","step-dump","step-surprise"];
  heroLogoCard.classList.remove(...steps);
  void heroLogoCard.offsetWidth;

  // 1) Maskinen vågner: VRRRR...
  heroLogoCard.classList.add("step-rumble");

  // 2) Der dumpes jord hen over logoet
  setTimeout(() => {
    heroLogoCard.classList.remove("step-rumble");
    heroLogoCard.classList.add("step-dump");
  }, 1200);

  // 3) Solbriller, skilt, konfetti og punchline
  setTimeout(() => {
    heroLogoCard.classList.add("step-surprise");
  }, 2450);

  // 4) Tilbage til normalen efter et par sekunder
  setTimeout(() => {
    heroLogoCard.classList.remove(...steps);
    heroLogoBusy = false;
  }, 6500);
}

if (heroLogoCard) {
  heroLogoCard.addEventListener("click", runHeroLogoEasterEgg);
  heroLogoCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      runHeroLogoEasterEgg();
    }
  });
}

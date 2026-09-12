const panicModal = document.getElementById("panicModal");
const modalClose = document.getElementById("modalClose");
const modalOkay = document.getElementById("modalOkay");
const panicButtons = document.querySelectorAll(".panic-btn");
const distance = document.getElementById("distance");
const recalculate = document.getElementById("recalculate");
const logo = document.getElementById("logo");
const toast = document.getElementById("toast");
const defaultToastText = "Stop med at trykke på gravemaskinen.";
let toastTimer;
function showToast(text, duration) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.textContent = defaultToastText;
  }, duration);
}

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

const panicSequence = document.getElementById("panicSequence");
const panicStatus = document.getElementById("panicStatus");

function runPanicSequence() {
  if (panicSequence.classList.contains("show")) return;
  panicSequence.classList.add("show");
  panicSequence.setAttribute("aria-hidden", "false");

  const stages = [
    "🚜 Gravemaskine startet...",
    "💨 Fuld gas...",
    "🥤 Pepsi Max er sikret...",
    "⚠️ Naboen er informeret...",
    "✅ For sent at fortryde."
  ];
  stages.forEach((text, i) => {
    setTimeout(() => { panicStatus.textContent = text; }, i * 650);
  });

  setTimeout(() => {
    panicSequence.classList.remove("show");
    panicSequence.setAttribute("aria-hidden", "true");
    openModal();
  }, 3400);
}

panicButtons.forEach(btn => btn.addEventListener("click", runPanicSequence));
modalClose.addEventListener("click", closeModal);
modalOkay.addEventListener("click", closeModal);

panicModal.addEventListener("click", (event) => {
  if (event.target === panicModal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

let recalculateTimer;
recalculate.addEventListener("click", () => {
  clearTimeout(recalculateTimer);
  const fakeDistance = (Math.random() * 8.7 + 0.3).toFixed(1).replace(".", ",");
  distance.textContent = `${fakeDistance} KM`;
  recalculate.textContent = "Meget videnskabeligt beregnet ✓";

  recalculateTimer = setTimeout(() => {
    recalculate.textContent = "Beregn igen";
  }, 1800);
});

// Logoet fungerer som et normalt link tilbage til forsiden.
// Easter-egget er flyttet til Shift + klik, så almindelige klik altid virker.
logo.addEventListener("click", (event) => {
  if (event.shiftKey) {
    event.preventDefault();
    showToast(defaultToastText, 2600);
  }
});

const coffeeStatus = document.getElementById("coffeeStatus");
const dieselStatus = document.getElementById("dieselStatus");
const planStatus = document.getElementById("planStatus");
const entrepreneurValue = document.getElementById("entrepreneurValue");
const meterFill = document.getElementById("meterFill");
const taskGenerator = document.getElementById("taskGenerator");
const randomTask = document.getElementById("randomTask");
const driveby = document.getElementById("driveby");

const plans = [
  "❓ Ukendt",
  "🕳️ Grave noget",
  "👀 Kigge ned i et hul",
  "🥤 Strategisk Pepsi Max-pause",
  "🚜 FULD SEND",
  "📏 Måle to gange. Grave tre."
];
const diesels = ["⛽ Det går nok","⛽ Nok-ish","⛽ Mere end i går","⛽ Spørg ikke","⛽ 73% + moms"];
const tasks = [
  "Der står en gammel terrasse i vejen.",
  "Naboen sagde, at hækken skulle blive stående.",
  "Der ligger muligvis et kabel her.",
  "Nogen har bestilt 14 tons stabilgrus. Ingen ved hvem.",
  "Indkørslen ser alt for hel ud.",
  "Der mangler et hul. Vi ved bare ikke hvor.",
  "Kunden sagde: “Det tager vel kun en time?”",
  "En stub har kigget forkert på os."
];

function updateLiveNonsense() {
  const coffee = Math.floor(Math.random() * 18) + 82;
  document.getElementById("pepsiPercent").textContent = `${coffee}%`;
  const boost = document.getElementById("boostStatus");
  if (coffee < 105 && boost?.classList.contains("overpressure")) {
    boost.classList.remove("overpressure");
    boost.textContent = "NORMAL DRIFT";
  }
  dieselStatus.textContent = diesels[Math.floor(Math.random() * diesels.length)];
  planStatus.textContent = plans[Math.floor(Math.random() * plans.length)];

  const level = Math.floor(Math.random() * 7) + 97;
  entrepreneurValue.textContent = `${level}%`;
  meterFill.style.width = `${Math.min(level,100)}%`;
}
updateLiveNonsense();
setInterval(updateLiveNonsense, 12000);

let taskTimer;
taskGenerator.addEventListener("click", () => {
  clearTimeout(taskTimer);
  randomTask.textContent = tasks[Math.floor(Math.random() * tasks.length)];
  taskGenerator.textContent = "GRAV FØRST – SPØRG BAGEFTER™";
  taskTimer = setTimeout(() => taskGenerator.textContent = "🚜 GIV OS EN OPGAVE", 1700);
});

function runDriveby() {
  if (driveby.classList.contains("go")) return;
  driveby.classList.add("go");
  driveby.setAttribute("aria-hidden","false");
  setTimeout(() => {
    driveby.classList.remove("go");
    driveby.setAttribute("aria-hidden","true");
  }, 7200);
}
setTimeout(runDriveby, 35000);
setInterval(runDriveby, 90000);

// Keep continuous effects at their current position while the tab is hidden.
const updateAnimationVisibility = () => {
  document.body.classList.toggle("animations-paused", document.visibilityState === "hidden");
};
document.addEventListener("visibilitychange", updateAnimationVisibility);
updateAnimationVisibility();

let typed = "";
let fullSendTimer;
document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1) return;
  typed = (typed + event.key.toLowerCase()).slice(-4);
  if (typed === "grav") {
    clearTimeout(fullSendTimer);
    document.body.classList.add("full-send");
    showToast("⚠️ ENTREPRENØR MODE AKTIVERET — FULD SEND 🚜", 3200);
    runDriveby();
    fullSendTimer = setTimeout(() => {
      document.body.classList.remove("full-send");
    }, 3200);
  }
});

// --- Chaos Pack ---
const cableButton = document.getElementById("cableButton");
const cableResult = document.getElementById("cableResult");
const pepsiCans = document.querySelector("#coffeeStatus .pepsi-cans");
const pepsiPercent = document.getElementById("pepsiPercent");
const boostStatus = document.getElementById("boostStatus");
const dontClick = document.getElementById("dontClick");
const holeOverlay = document.getElementById("holeOverlay");
const seriousMode = document.getElementById("seriousMode");
const seriousMessage = document.getElementById("seriousMessage");

const cableAnswers = [
  "✅ Nej. Grav bare. Hvad kan gå galt?",
  "👀 Måske. Det er spændende.",
  "🤷 Spørg ikke os.",
  "⚡ 73% sandsynlighed. Det er næsten sikkert nok.",
  "💥 Det gjorde der.",
  "📞 Ledningsejerregistret har forladt chatten."
];

if (cableButton) {
  cableButton.addEventListener("click", () => {
    cableButton.disabled = true;
    cableResult.textContent = "📡 Scanner jorden med meget dyr fantasi...";
    setTimeout(() => {
      cableResult.textContent = cableAnswers[Math.floor(Math.random() * cableAnswers.length)];
      cableButton.disabled = false;
      cableButton.textContent = "⚡ PRØV IGEN";
    }, 1600);
  });
}

let pepsiBoost = 0;
if (pepsiCans) {
  pepsiCans.style.cursor = "pointer";
  pepsiCans.setAttribute("title", "Klik for Pepsi Max Boost");

  pepsiCans.addEventListener("click", () => {
    pepsiBoost++;
    const current = parseInt(pepsiPercent.textContent, 10) || 87;
    const value = Math.min(current + 11, 149);

    pepsiPercent.textContent = value + "%";
    pepsiCans.classList.remove("boosted");
    void pepsiCans.offsetWidth;
    pepsiCans.classList.add("boosted");

    if (value >= 105) {
      boostStatus.textContent = "⚠️ OVERTRYK — ARBEJDSHASTIGHED +40%";
      boostStatus.classList.add("overpressure");
      entrepreneurValue.textContent = "127%";
      meterFill.style.width = "100%";
    } else {
      boostStatus.textContent = "PEPSI MAX TILFØRT";
      boostStatus.classList.remove("overpressure");
    }
  });
}

if (dontClick) {
  dontClick.addEventListener("click", () => {
    if (document.body.classList.contains("hole-chaos")) return;
    document.body.classList.add("hole-chaos");
    holeOverlay.classList.add("active");
    holeOverlay.setAttribute("aria-hidden","false");
    setTimeout(() => {
      holeOverlay.classList.remove("active");
      holeOverlay.setAttribute("aria-hidden","true");
      document.body.classList.remove("hole-chaos");
      showToast("🔧 Hjemmesiden er lappet. Nogenlunde.", 2200);
    }, 4700);
  });
}

let seriousTimer;
let seriousResetTimer;
// The footer owns placement; this function owns actual visibility and ARIA.
function updateSeriousMessageVisibility(atBottom) {
  if (!seriousMessage) return;
  const inFooter = !!seriousMessage.closest(".footer-message-slot");
  const visible = inFooter
    ? (atBottom ?? (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24))
    : seriousMessage.classList.contains("show");
  const footerVisible = inFooter && visible;
  if (seriousMessage.classList.contains("footer-visible") !== footerVisible) seriousMessage.classList.toggle("footer-visible", footerVisible);
  const ariaHidden = visible ? "false" : "true";
  if (seriousMessage.getAttribute("aria-hidden") !== ariaHidden) seriousMessage.setAttribute("aria-hidden", ariaHidden);
}
function resetSeriousMessage() {
  seriousMessage.querySelector("strong").textContent = "PROFESSIONEL TILSTAND";
  seriousMessage.querySelector("span").textContent = "Ingen jokes. Ingen panik. Ingen dårlige beslutninger.";
}
if (seriousMode) {
  seriousMode.addEventListener("change", () => {
    clearTimeout(seriousTimer);
    clearTimeout(seriousResetTimer);
    resetSeriousMessage();
    if (seriousMode.checked) {
      document.body.classList.add("serious-mode");
      seriousMessage.classList.add("show");
      updateSeriousMessageVisibility();
      seriousTimer = setTimeout(() => {
        seriousMode.checked = false;
        document.body.classList.remove("serious-mode");
        seriousMessage.querySelector("strong").textContent = "DET HER HOLDER VI IKKE UD.";
        seriousMessage.querySelector("span").textContent = "Den fjollede hjemmeside er tilbage.";
        updateSeriousMessageVisibility();
        seriousResetTimer = setTimeout(() => {
          seriousMessage.classList.remove("show");
          resetSeriousMessage();
          updateSeriousMessageVisibility();
        }, 1800);
      }, 5000);
    } else {
      document.body.classList.remove("serious-mode");
      seriousMessage.classList.remove("show");
      updateSeriousMessageVisibility();
    }
  });
}

let panicCount = 0;
panicButtons.forEach(btn => {
  const originalText = btn.textContent;
  let resetTimer;
  btn.addEventListener("mouseenter", () => {
    panicCount++;
    if (panicCount % 10 === 0) {
      clearTimeout(resetTimer);
      btn.textContent = "🥤 MANGLER PEPSI MAX";
      resetTimer = setTimeout(() => btn.textContent = originalText, 1800);
    }
  });
});

// Indlæs den rigtige, mekaniske besøgstæller.
const visitorCounterScript = document.createElement("script");
visitorCounterScript.src = "visitor-counter.js";
visitorCounterScript.defer = true;
document.body.appendChild(visitorCounterScript);

// Indlæs faste oversættelser og sprogknap på preview-versionen.
const translationScript = document.createElement("script");
translationScript.src = "translations.js";
translationScript.defer = true;
document.body.appendChild(translationScript);

// Indlæs den nye filosofi-sektion.
const philosophyScript = document.createElement("script");
philosophyScript.src = "philosophy.js";
philosophyScript.defer = true;
document.body.appendChild(philosophyScript);

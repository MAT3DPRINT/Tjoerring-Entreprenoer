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
  dieselStatus.textContent = diesels[Math.floor(Math.random() * diesels.length)];
  planStatus.textContent = plans[Math.floor(Math.random() * plans.length)];

  const level = Math.floor(Math.random() * 7) + 97;
  entrepreneurValue.textContent = `${level}%`;
  meterFill.style.width = `${Math.min(level,100)}%`;
}
updateLiveNonsense();
setInterval(updateLiveNonsense, 12000);

taskGenerator.addEventListener("click", () => {
  randomTask.textContent = tasks[Math.floor(Math.random() * tasks.length)];
  taskGenerator.textContent = "GRAV FØRST – SPØRG BAGEFTER™";
  setTimeout(() => taskGenerator.textContent = "🚜 GIV OS EN OPGAVE", 1700);
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
// Første lille overraskelse efter 35 sekunder, derefter sjældent.
setTimeout(runDriveby, 35000);
setInterval(runDriveby, 90000);

let typed = "";
document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1) return;
  typed = (typed + event.key.toLowerCase()).slice(-4);
  if (typed === "grav") {
    document.body.classList.add("full-send");
    toast.textContent = "⚠️ ENTREPRENØR MODE AKTIVERET — FULD SEND 🚜";
    toast.classList.add("show");
    runDriveby();
    setTimeout(() => {
      document.body.classList.remove("full-send");
      toast.classList.remove("show");
      toast.textContent = "Stop med at trykke på gravemaskinen.";
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
      toast.textContent = "🔧 Hjemmesiden er lappet. Nogenlunde.";
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        toast.textContent = "Stop med at trykke på gravemaskinen.";
      }, 2200);
    }, 4700);
  });
}

let seriousTimer;
if (seriousMode) {
  seriousMode.addEventListener("change", () => {
    clearTimeout(seriousTimer);
    if (seriousMode.checked) {
      document.body.classList.add("serious-mode");
      seriousMessage.classList.add("show");
      seriousMessage.setAttribute("aria-hidden","false");
      seriousTimer = setTimeout(() => {
        seriousMode.checked = false;
        document.body.classList.remove("serious-mode");
        seriousMessage.querySelector("strong").textContent = "DET HER HOLDER VI IKKE UD.";
        seriousMessage.querySelector("span").textContent = "Den fjollede hjemmeside er tilbage.";
        setTimeout(() => {
          seriousMessage.classList.remove("show");
          seriousMessage.setAttribute("aria-hidden","true");
          seriousMessage.querySelector("strong").textContent = "PROFESSIONEL TILSTAND";
          seriousMessage.querySelector("span").textContent = "Ingen jokes. Ingen panik. Ingen dårlige beslutninger.";
        }, 1800);
      }, 5000);
    } else {
      document.body.classList.remove("serious-mode");
      seriousMessage.classList.remove("show");
    }
  });
}

// Sjældent alternativ til PANIK-sekvensen.
let panicCount = 0;
panicButtons.forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    panicCount++;
    if (panicCount % 10 === 0) {
      btn.textContent = "🥤 MANGLER PEPSI MAX";
      setTimeout(() => btn.textContent = "🚨 PANIK!", 1800);
    }
  });
});

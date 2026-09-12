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

// Dynamisk forventet ankomst: en humoristisk hverdag før i dag.
// Mandag -> fredag, tirsdag -> mandag, onsdag -> tirsdag osv.
const arrivalValue = Array.from(document.querySelectorAll('.status-row')).find(row =>
  row.querySelector('span')?.textContent.trim() === 'Forventet ankomst'
)?.querySelector('strong');

function updateExpectedArrival() {
  if (!arrivalValue) return;
  const dayNames = ['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'];
  const today = new Date().getDay();
  let targetDay = (today + 6) % 7;

  // I weekenden holder vi fast i fredags-energien.
  if (today === 0 || today === 6) targetDay = 5;

  arrivalValue.textContent = `Fra nu til ${dayNames[targetDay]}`;
}
updateExpectedArrival();
setInterval(updateExpectedArrival, 60 * 60 * 1000);

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

// Indlæs den fotorealistiske filosofi-sektion på preview-branchen.
const philosophyScript = document.createElement("script");
philosophyScript.src = "philosophy.js";
philosophyScript.defer = true;
document.body.appendChild(philosophyScript);

// Event-driven tools. Stable nodes; dynamic text is owned here, not by the observer.
(() => {
  if (!document.getElementById('diggingTools')) return;
  const fields = ['holeLength','holeWidth','holeDepth'].map(id => document.getElementById(id));
  const defaults = [4,3,0.7];
  const limits = [100,100,20];
  const verdicts = ["Det dér er næsten bare en aggressiv blomsterkrukke.","Det starter altid sådan her.","Nu begynder naboen at blive nysgerrig.","Det her kræver mere end en skovl og optimisme.","Kommunen vil muligvis gerne høre om det her.","Vi antager, at du har en gravemaskine. Og en plan. Forhåbentlig."];
  const excuses = ["Maskinen skulle lige tænke.","Jorden var hårdere end forventet.","Vi ventede på en Pepsi Max.","Google Maps sagde drej til venstre.","Det så nemmere ud på YouTube.","Der stod ikke noget om det kabel.","Nogen havde parkeret en gravemaskine i vejen.","Vi målte to gange. Det hjalp ikke.","Det begyndte som en fem minutters opgave.","Det var sådan, da vi kom."];
  let excuseIndex = Math.floor(Math.random() * excuses.length);
  let feedback = '';
  const t = value => window.TjoerringI18n?.text(value) || value;
  const set = (id,value) => {
    const node = document.getElementById(id);
    if (node.textContent !== value) node.textContent = value;
  };
  const values = () => fields.map((field,i) => {
    const value = field.valueAsNumber;
    return Number.isFinite(value) ? Math.min(limits[i],Math.max(0,value)) : 0;
  });
  function render() {
    const lang = window.TjoerringI18n?.getLanguage() || 'da';
    const format = new Intl.NumberFormat(lang,{maximumFractionDigits:3});
    const volume = values().reduce((a,b) => a*b,1);
    set('holeVolume',format.format(volume));
    set('holeBarrows',format.format(Math.ceil(volume/0.12)));
    set('holeTrailers',format.format(Math.ceil(volume/3)));
    set('holeSaturdays',format.format(Math.ceil(volume/3)));
    const tier = [0.5,3,15,50,200].findIndex(limit => volume < limit);
    set('holeVerdict',t(verdicts[tier < 0 ? 5 : tier]));
    set('holeFeedback',t(feedback));
    set('dailyExcuse',t(excuses[excuseIndex]));
  }
  fields.forEach((field,i) => {
    field.addEventListener('input',() => {
      // Keep an empty field editable; clamp finite out-of-range values immediately.
      if (Number.isFinite(field.valueAsNumber) && (field.valueAsNumber < 0 || field.valueAsNumber > limits[i])) field.value = String(values()[i]);
      feedback = '';
      render();
    });
    field.addEventListener('change',() => { field.value = String(values()[i]); render(); });
  });
  document.getElementById('growHole').addEventListener('click',() => {
    const before = values();
    const after = before.map((value,i) => Math.min(limits[i],Math.round(value*1.1*1000)/1000));
    fields.forEach((field,i) => { field.value = String(after[i]); });
    feedback = after.some((v,i) => v > before[i]) ? 'Sådan. Meget bedre.' : 'Nu er hullet stort nok. Selv for os.';
    render();
  });
  document.getElementById('resetHole').addEventListener('click',() => {
    fields.forEach((field,i) => { field.value = String(defaults[i]); });
    feedback = 'Vi lader som om, det aldrig skete.';
    render();
  });
  document.getElementById('newExcuse').addEventListener('click',() => {
    excuseIndex = (excuseIndex + 1 + Math.floor(Math.random()*(excuses.length-1))) % excuses.length;
    render();
  });
  document.addEventListener('tjoerring:languagechange',render);
  render();
})();

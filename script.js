const panicModal = document.getElementById("panicModal");
const modalClose = document.getElementById("modalClose");
const modalOkay = document.getElementById("modalOkay");
const panicButtons = document.querySelectorAll(".panic-btn");
const distance = document.getElementById("distance");
const recalculate = document.getElementById("recalculate");
const logo = document.getElementById("logo");
const toast = document.getElementById("toast");
let toastTimer;
let toastCopy = [];
const translateCopy = text => window.TjoerringI18n?.text(text) || text;
function renderToast() {
  const text = toastCopy.map(translateCopy).join('\n');
  if (toast.textContent !== text) toast.textContent = text;
}
function showToast(copy, duration = 2600) {
  clearTimeout(toastTimer);
  toastCopy = Array.isArray(copy) ? copy : [copy];
  renderToast();
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastCopy = ['Stop med at trykke på gravemaskinen.'];
    renderToast();
  }, duration);
}
document.addEventListener('tjoerring:languagechange',renderToast);

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
    showToast('Stop med at trykke på gravemaskinen.');
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
let fullSendTimer;
document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1) return;
  typed = (typed + event.key.toLowerCase()).slice(-4);
  if (typed === "grav") {
    document.body.classList.add("full-send");
    showToast("⚠️ ENTREPRENØR MODE AKTIVERET — FULD SEND 🚜", 3200);
    runDriveby();
    clearTimeout(fullSendTimer);
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
    pepsiBoost = Math.min(pepsiBoost + 1, 10);
    const current = parseInt(pepsiPercent.textContent, 10) || 87;
    const value = Math.min(current + 11, 149);

    pepsiPercent.textContent = value + "%";
    pepsiCans.classList.remove("boosted");
    void pepsiCans.offsetWidth;
    pepsiCans.classList.add("boosted");

    if (pepsiBoost * 20 > 100) {
      entrepreneurValue.textContent = "127%";
      meterFill.style.width = "100%";
    }
    phase3.renderPepsi();
    phase3.record('pepsi');
  });
  pepsiCans.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    pepsiCans.click();
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
      phase3.record('hole');
    });
    field.addEventListener('change',() => { field.value = String(values()[i]); render(); });
  });
  document.getElementById('growHole').addEventListener('click',() => {
    const before = values();
    const after = before.map((value,i) => Math.min(limits[i],Math.round(value*1.1*1000)/1000));
    fields.forEach((field,i) => { field.value = String(after[i]); });
    feedback = after.some((v,i) => v > before[i]) ? 'Sådan. Meget bedre.' : 'Nu er hullet stort nok. Selv for os.';
    render();
    phase3.record('hole');
    phase3.record('grow');
  });
  document.getElementById('resetHole').addEventListener('click',() => {
    fields.forEach((field,i) => { field.value = String(defaults[i]); });
    feedback = 'Vi lader som om, det aldrig skete.';
    render();
  });
  document.getElementById('newExcuse').addEventListener('click',() => {
    excuseIndex = (excuseIndex + 1 + Math.floor(Math.random()*(excuses.length-1))) % excuses.length;
    render();
    phase3.record('excuse');
  });
  document.addEventListener('tjoerring:languagechange',render);
  render();
})();

// Phase 2: local state, fixed controls and the existing explicit language event.
(() => {
  const root = document.getElementById('contractorInteractives');
  if (!root) return;
  const get = id => document.getElementById(id);
  const t = value => window.TjoerringI18n?.text(value) || value;
  const set = (id,text) => { const node = get(id); if (node.textContent !== text) node.textContent = text; };
  const questions = [{"question":"Du ser et perfekt græsareal. Hvad tænker du?","answers":["Flot græs.","Der kunne måske være en terrasse.","Der mangler helt klart et hul.","Hvor er gravemaskinen?"]},{"question":"Kunden siger: Det er bare en lille opgave. Hvad gør du?","answers":["Tager det helt roligt.","Tager ekstra værktøj med.","Bestiller en container.","Ringer efter mere diesel og Pepsi Max."]},{"question":"Du finder et kabel i jorden. Hvad gør du?","answers":["Stopper og undersøger det.","Kigger lidt nærmere.","Siger: Det stod ikke på tegningen.","Råber: HVEM HAR LAGT DEN DER?"]},{"question":"Hvornår er et hul stort nok?","answers":["Når opgaven er løst.","Når kunden er tilfreds.","Når naboen begynder at kigge.","Det spørgsmål giver ingen mening."]},{"question":"Hvad er vigtigst på en arbejdsdag?","answers":["Planlægning.","Godt værktøj.","Gravemaskinen.","Pepsi Max og en dårlig idé."]}];
  const levels = [["Kontormenneske","Du bruger ord som projektplan uden at grine."],["Lærling med potentiale","Du kigger stadig efter ledningsplaner. Det er sødt."],["Godkendt til mindre huller","Du må gerne få en skovl. Gravemaskinen venter lidt endnu."],["Professionel hullespecialist","Du er nu farligt tæt på at få lov til at vælge skovlstørrelse."],["FULD SEND","Du ser ikke problemer. Du ser jord, der endnu ikke er flyttet."],["TJØRRING ENTREPRENØR","Vi beklager. Der findes ingen behandling."]];
  const problems = [["Der mangler et hul","Diagnose: Akut mangel på hul.","Heldigvis kan det behandles."],["Hullet er for lille","Diagnose: Klassisk undergravning.","Anbefalet behandling: Gør hullet større."],["Der er noget i vejen","Diagnose: Objekt placeret forkert.","Standardprocedure: Flyt det. Eventuelt med skovlen."],["Kunden sagde: Det tager kun en time","Diagnose: Urealistiske forventninger.","Forventet behandlingstid: Resten af dagen."],["Jeg ved det ikke, men vi skal bruge en gravemaskine","Diagnose: Perfekte arbejdsforhold.","Start maskinen."]];
  const quiz = {currentQuestion:0,score:0,answers:Array(questions.length).fill(null)};
  const emergency = {currentStep:'start',problem:null,pepsi:null};
  const radios = [...root.querySelectorAll('input[name="contractorAnswer"]')];
  function renderQuiz() {
    const finished = quiz.currentQuestion === questions.length;
    get('quizQuestions').hidden = finished;
    get('quizResult').hidden = !finished;
    if (!finished) {
      const question = questions[quiz.currentQuestion];
      set('quizProgress',t('Spørgsmål')+' '+(quiz.currentQuestion+1)+' '+t('af')+' '+questions.length);
      set('quizQuestion',t(question.question));
      radios.forEach((radio,i) => { radio.checked = quiz.answers[quiz.currentQuestion] === i; set('quizAnswer'+i,t(question.answers[i])); });
      get('quizNext').disabled = quiz.answers[quiz.currentQuestion] === null;
      set('quizNext',t(quiz.currentQuestion === questions.length-1 ? 'VIS DOMMEN' : 'NÆSTE'));
    } else {
      const percent = Math.round(quiz.score/(questions.length*3)*100);
      const tier = percent === 100 ? 5 : percent > 80 ? 4 : percent > 60 ? 3 : percent > 40 ? 2 : percent > 20 ? 1 : 0;
      set('quizPercent',percent+' %');
      set('quizLevel',t(levels[tier][0]));
      set('quizVerdict',t(levels[tier][1]));
      set('quizPepsi',t('Pepsi Max-kompatibilitet')+': '+Math.round(20+percent*0.8)+' %');
    }
  }
  function renderEmergency() {
    const step = emergency.currentStep;
    root.querySelectorAll('[data-emergency-step]').forEach(node => { node.hidden = node.dataset.emergencyStep !== step; });
    get('emergencyReset').hidden = step === 'start';
    const copy = {
      start:['',''],
      pepsi:['Rolig. Først det vigtigste: Er der Pepsi Max?',''],
      supply:['⚠️ Situationen er mere alvorlig end først antaget.','Find Pepsi Max. Vi venter med at stille flere spørgsmål.'],
      problem:['Hvad er problemet?',''],
      diagnosis:problems[emergency.problem]?.slice(1) || ['',''],
      sent:['🚜 FULD SEND AKTIVERET','En gravemaskine er nu følelsesmæssigt på vej.']
    }[step];
    get('emergencyPrompt').hidden = !copy[0];
    get('emergencyDetail').hidden = !copy[1];
    set('emergencyPrompt',t(copy[0]));
    set('emergencyDetail',t(copy[1]));
  }
  function renderLanguage() {
    root.querySelectorAll('[data-interactive-copy]').forEach(node => {
      const text = t(node.dataset.interactiveCopy);
      if (node.textContent !== text) node.textContent = text;
    });
    renderQuiz();renderEmergency();
  }
  radios.forEach((radio,i) => radio.addEventListener('change',() => {
    if (quiz.currentQuestion >= questions.length || !radio.checked) return;
    quiz.answers[quiz.currentQuestion] = i;
    renderQuiz();
  }));
  get('quizNext').addEventListener('click',() => {
    if (quiz.currentQuestion >= questions.length || quiz.answers[quiz.currentQuestion] === null) return;
    quiz.currentQuestion++;
    quiz.score = quiz.answers.reduce((sum,value) => sum+(value ?? 0),0);
    if (quiz.currentQuestion === questions.length && quiz.score/(questions.length*3) >= 0.8) phase3.record('quiz');
    renderQuiz();
    get(quiz.currentQuestion === questions.length ? 'quizLevel' : 'quizQuestion').focus({preventScroll:true});
  });
  get('quizReset').addEventListener('click',() => {
    if (quiz.currentQuestion !== questions.length) return;
    quiz.currentQuestion = 0;quiz.score = 0;quiz.answers.fill(null);
    renderQuiz();get('quizQuestion').focus({preventScroll:true});
  });
  function advanceEmergency(from,to,update) {
    if (emergency.currentStep !== from) return;
    if (update) update();
    emergency.currentStep = to;renderEmergency();get('emergencyPrompt').focus({preventScroll:true});
    if (to === 'sent') phase3.record('emergency');
  }
  get('emergencyStart').addEventListener('click',() => advanceEmergency('start','pepsi'));
  get('emergencyYes').addEventListener('click',() => advanceEmergency('pepsi','problem',() => { emergency.pepsi = true; }));
  get('emergencyNo').addEventListener('click',() => advanceEmergency('pepsi','supply',() => { emergency.pepsi = false; }));
  get('emergencySupply').addEventListener('click',() => advanceEmergency('supply','problem',() => { emergency.pepsi = true; }));
  root.querySelectorAll('[data-emergency-problem]').forEach(button => button.addEventListener('click',() => {
    if (!emergency.pepsi) return;
    advanceEmergency('problem','diagnosis',() => { emergency.problem = Number(button.dataset.emergencyProblem); });
  }));
  get('emergencySend').addEventListener('click',() => advanceEmergency('diagnosis','sent'));
  get('emergencyReset').addEventListener('click',() => {
    emergency.currentStep = 'start';emergency.problem = null;emergency.pepsi = null;
    renderEmergency();get('emergencyStart').focus({preventScroll:true});
  });
  document.addEventListener('tjoerring:languagechange',renderLanguage);
  renderLanguage();
})();

// Phase 3: bounded session state and stable nodes; no polling or observers.
const phase3 = (() => {
  const get = id => document.getElementById(id);
  const t = translateCopy;
  const set = (node, value) => { if (node.textContent !== value) node.textContent = value; };
  const achievements = {
    hole:{target:1,title:'HULSPECIALIST'}, grow:{target:3,title:'DET KAN ALTID BLIVE STØRRE'},
    excuse:{target:3,title:'UNDSKYLDNINGSMESTER'}, quiz:{target:1,title:'FULD SEND'},
    emergency:{target:1,title:'AKUT GODKENDT'}, pepsi:{target:5,title:'PEPSI MAX-ANSVARLIG'}
  };
  const counts = Object.fromEntries(Object.keys(achievements).map(key => [key,0]));
  function renderAchievements() {
    let total = 0;
    Object.entries(achievements).forEach(([key, achievement]) => {
      const unlocked = counts[key] >= achievement.target;
      if (unlocked) total++;
      const card = document.querySelector(`[data-achievement="${key}"]`);
      if (card.classList.contains('unlocked') !== unlocked) card.classList.toggle('unlocked',unlocked);
      set(card.querySelector('.achievement-status'),t(unlocked ? '✓ OPNÅET' : '🔒 LÅST'));
    });
    set(get('academyCount'),total+' / 6');
  }
  function record(key) {
    const achievement = achievements[key];
    if (!achievement || counts[key] >= achievement.target) return;
    counts[key]++;
    if (counts[key] === achievement.target) {
      renderAchievements();
      showToast(['🏆 ACHIEVEMENT UNLOCKED',achievement.title]);
    }
  }
  const pepsiLevels = [
    ['NORMAL DRIFT','Alt ser mistænkeligt professionelt ud.'],
    ['ØGET ARBEJDSLYST','Produktiviteten er steget. Ingen ved hvorfor.'],
    ['TVIVLSOMT HØJT TEMPO','Gravemaskinen virker pludselig større.'],
    ['FULD SEND','Planlægningen er officielt blevet sprunget over.'],
    ['⚠ OVERTRYK','Arbejdshastighed +40 %. Dømmekraft -63 %.'],
    ['🚨 KRITISK ENTREPRENØRTILSTAND','STOP MED AT GIVE DEM PEPSI MAX.']
  ];
  function renderPepsi() {
    const level = pepsiBoost * 20;
    const tier = level <= 25 ? 0 : level <= 50 ? 1 : level <= 75 ? 2 : level <= 100 ? 3 : level <= 150 ? 4 : 5;
    set(get('boostLevel'),level+' %');
    set(boostStatus,t(pepsiLevels[tier][0]));
    set(get('boostMessage'),t(pepsiLevels[tier][1]));
    if (boostStatus.classList.contains('overpressure') !== (level > 100)) boostStatus.classList.toggle('overpressure',level > 100);
    if (boostStatus.classList.contains('critical') !== (level > 150)) boostStatus.classList.toggle('critical',level > 150);
    const title = t('Klik for Pepsi Max Boost');
    if (pepsiCans.getAttribute('title') !== title) pepsiCans.setAttribute('title',title);
  }
  const selectIds = ['offerWork','offerUrgency','offerPepsi'];
  let offer = null;
  function calculateOffer(variation = 0) {
    const [work, urgency, supply] = selectIds.map(id => Math.min(3,Math.max(0,Number(get(id).value) || 0)));
    const surcharge = [3000,1500,0,0][supply];
    const price = [4847,12847,9847,19847][work] + [0,2400,7900,11000][urgency] + surcharge - supply*200 + variation;
    offer = {price,uncertainty:Math.round(price*(0.45+work*0.1+urgency*0.05)/100)*100,surcharge,urgency,work,supply};
    renderOffer();
  }
  function renderOffer() {
    if (!offer) return;
    if (get('offerResult').hidden) get('offerResult').hidden = false;
    const money = value => new Intl.NumberFormat(window.TjoerringI18n?.getLanguage() || 'da',{style:'currency',currency:'DKK',maximumFractionDigits:0}).format(value);
    set(get('offerPrice'),money(offer.price));
    set(get('offerUncertainty'),'± '+money(offer.uncertainty));
    set(get('offerTime'),t(offer.urgency >= 2 ? 'Vi skulle helst have været færdige i går.' : 'Et sted mellem 45 minutter og torsdag.'));
    set(get('offerRisk'),t(offer.work+offer.urgency >= 4 ? 'Højt. Naboen er allerede nervøs.' : 'Moderat, men stigende.'));
    set(get('offerSurcharge'),money(offer.surcharge)+' – '+t(offer.supply >= 2 ? 'kunden har styr på prioriteterne.' : 'strategisk forsyning mangler.'));
  }
  get('offerForm').addEventListener('submit', event => { event.preventDefault();calculateOffer(); });
  selectIds.forEach(id => get(id).addEventListener('change',() => { if (offer) calculateOffer(); }));
  get('worseOffer').addEventListener('click',() => calculateOffer(100 + Math.floor(Math.random()*10)*100));
  const proofCopy = [
    ['Pæn græsplæne','Potentiale'],['Lille bunke jord','Geografisk landemærke'],['Kunden: Bare lige lidt','Projektet har udviklet sig']
  ];
  const after = [false,false,false];
  function renderProof(index) {
    const card = document.querySelector(`[data-proof="${index}"]`);
    const button = card.querySelector('button');
    if (card.classList.contains('is-after') !== after[index]) card.classList.toggle('is-after',after[index]);
    const pressed = String(after[index]);
    if (button.getAttribute('aria-pressed') !== pressed) button.setAttribute('aria-pressed',pressed);
    set(get('proofCaption'+index),t(after[index] ? 'EFTER' : 'FØR')+': '+t(proofCopy[index][after[index] ? 1 : 0]));
    set(button,t(after[index] ? 'VIS FØR' : 'VIS EFTER'));
  }
  document.querySelectorAll('[data-proof-toggle]').forEach(button => button.addEventListener('click',() => {
    const index = Number(button.dataset.proofToggle);after[index] = !after[index];renderProof(index);
  }));
  function renderLanguage() {
    document.querySelectorAll('[data-phase3-copy]').forEach(node => set(node,t(node.dataset.phase3Copy)));
    renderAchievements();renderOffer();renderPepsi();after.forEach((_,i) => renderProof(i));
  }
  document.addEventListener('tjoerring:languagechange',renderLanguage);
  renderLanguage();
  return {record,renderPepsi};
})();

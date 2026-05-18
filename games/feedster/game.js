const FAVORITE_FOODS = [
  "cookies",
  "cupcakes",
  "donuts",
  "berries",
  "pizza bites",
  "cheese cubes"
];

const YUCKY_FOODS = [
  "broccoli",
  "peas",
  "carrots",
  "spinach",
  "brussels sprouts"
];

const SPRITES = {
  waiting: "assets/feedster/feedster_waiting_neutral.png",
  correct: "assets/feedster/feedster_grinning.png",
  feast: "assets/feedster/feedster_feasting.png",
  wrong: "assets/feedster/feedster_cranky.png",
  yucky: "assets/feedster/feedster_gross_veggies.png",
  done: "assets/feedster/feedster_stuffed_full.png"
};

const DIFFICULTIES = {
  easy: {
    label: "Easy",
    scarfing: {
      targetMin: 4,
      targetMax: 10,
      currentMin: 1,
      answerMin: 1
    },
    yuckies: {
      startMin: 1,
      startMax: 10,
      removeMin: 1,
      answerMin: 0
    },
    feastRounds: 5,
    feastSeconds: 18
  },
  medium: {
    label: "Medium",
    scarfing: {
      targetMin: 8,
      targetMax: 20,
      currentMin: 2,
      answerMin: 2
    },
    yuckies: {
      startMin: 8,
      startMax: 20,
      removeMin: 1,
      answerMin: 1
    },
    feastRounds: 7,
    feastSeconds: 15
  },
  hard: {
    label: "Hard",
    scarfing: {
      targetMin: 100,
      targetMax: 150,
      currentMin: 20,
      answerMin: 12,
      answerMax: 99
    },
    yuckies: {
      startMin: 100,
      startMax: 150,
      removeMin: 12,
      removeMax: 99,
      answerMin: 10
    },
    feastRounds: 10,
    feastSeconds: 12
  }
};

const MODES = {
  scarfing: "Scarfing",
  yuckies: "Yuckies",
  feast: "FEAST"
};

const DIFFICULTY_HINTS = {
  easy: "Easy: snack counts up to 10",
  medium: "Medium: snack counts up to 20",
  hard: "Hard: 3-digit snack math"
};

const SINGULAR_FOODS = {
  cookies: "cookie",
  cupcakes: "cupcake",
  donuts: "donut",
  berries: "berry",
  "pizza bites": "pizza bite",
  "cheese cubes": "cheese cube",
  broccoli: "broccoli",
  peas: "pea",
  carrots: "carrot",
  spinach: "spinach",
  "brussels sprouts": "brussels sprout"
};

const FOOD_IMAGES = {
  cookies: "assets/food/food_cookies.png",
  cupcakes: "assets/food/food_cupcake.png",
  donuts: "assets/food/food_donut.png",
  berries: "assets/food/food_berries.png",
  "pizza bites": "assets/food/food_pizza_bites.png",
  "cheese cubes": "assets/food/food_cheese_cubes.png",
  broccoli: "assets/food/food_broccoli.png"
};

const ACTIVE_FAVORITE_FOODS = FAVORITE_FOODS.filter((food) => FOOD_IMAGES[food]);
const ACTIVE_YUCKY_FOODS = YUCKY_FOODS.filter((food) => FOOD_IMAGES[food]);

const STORAGE_KEYS = {
  sound: "feedsterSoundEnabled",
  problemSpeech: "feedsterProblemSpeechEnabled",
  bestStreak: "feedsterBestStreak"
};

const state = {
  mode: "scarfing",
  difficulty: "easy",
  round: 1,
  feastIndex: 0,
  feastScore: 0,
  answer: null,
  currentProblem: null,
  timeLeft: 0,
  timerId: null,
  speechRecognizer: null,
  isListening: false,
  isAdvancing: false,
  soundEnabled: readStoredBoolean(STORAGE_KEYS.sound, false),
  canSpeak: "speechSynthesis" in window,
  problemSpeechEnabled: readStoredBoolean(STORAGE_KEYS.problemSpeech, "speechSynthesis" in window),
  problemSpeechReady: false,
  audioContext: null,
  stats: {
    correct: 0,
    attempts: 0,
    streak: 0,
    best: readStoredNumber(STORAGE_KEYS.bestStreak, 0)
  }
};

const elements = {
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  difficultyButtons: [...document.querySelectorAll("[data-difficulty]")],
  numberButtons: [...document.querySelectorAll("[data-number]")],
  answerInput: document.querySelector("#answerInput"),
  clearButton: document.querySelector("#clearButton"),
  submitButton: document.querySelector("#submitButton"),
  newRoundButton: document.querySelector("#newRoundButton"),
  helpButton: document.querySelector("#helpButton"),
  helpDialog: document.querySelector("#helpDialog"),
  helpCloseButton: document.querySelector("#helpCloseButton"),
  readButton: document.querySelector("#readButton"),
  soundButton: document.querySelector("#soundButton"),
  talkButton: document.querySelector("#talkButton"),
  promptText: document.querySelector("#promptText"),
  difficultyHint: document.querySelector("#difficultyHint"),
  feedsterSprite: document.querySelector("#feedsterSprite"),
  plateItems: document.querySelector("#plateItems"),
  coachText: document.querySelector("#coachText"),
  modeLabel: document.querySelector("#modeLabel"),
  scoreLabel: document.querySelector("#scoreLabel"),
  timerWrap: document.querySelector("#timerWrap"),
  timerLabel: document.querySelector("#timerLabel"),
  timerBar: document.querySelector("#timerBar"),
  sessionStat: document.querySelector("#sessionStat"),
  streakStat: document.querySelector("#streakStat"),
  bestStat: document.querySelector("#bestStat")
};

function readStoredBoolean(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function readStoredNumber(key, fallback) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Local storage can be unavailable in private or locked-down contexts.
  }
}

function isTouchPrimaryInput() {
  return window.matchMedia?.("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function syncAnswerInputMode() {
  const touchPrimary = isTouchPrimaryInput();

  elements.answerInput.readOnly = touchPrimary;
  elements.answerInput.inputMode = touchPrimary ? "none" : "numeric";
  elements.answerInput.setAttribute("inputmode", touchPrimary ? "none" : "numeric");
  elements.answerInput.setAttribute("aria-readonly", String(touchPrimary));
  elements.answerInput.title = touchPrimary
    ? "Use the number buttons below."
    : "Type an answer or use the number buttons.";

  if (touchPrimary && document.activeElement === elements.answerInput) {
    elements.answerInput.blur();
  }
}

function focusAnswerInput(options = {}) {
  if (isTouchPrimaryInput()) {
    return;
  }

  elements.answerInput.focus({ preventScroll: true, ...options });
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(items) {
  return items[randomInt(0, items.length - 1)];
}

function foodLabel(food, count) {
  if (count === 1) {
    return SINGULAR_FOODS[food] || food;
  }

  return food;
}

function buildScarfingProblem() {
  const config = DIFFICULTIES[state.difficulty].scarfing;
  const target = randomInt(config.targetMin, config.targetMax);
  const maxAnswer = Math.min(config.answerMax || target, target - config.currentMin);
  const answer = randomInt(config.answerMin, maxAnswer);
  const current = target - answer;
  const food = sample(ACTIVE_FAVORITE_FOODS);

  return {
    type: "scarfing",
    food,
    shownCount: current,
    totalCount: target,
    answer,
    prompt: `Feedster has ${current} ${foodLabel(food, current)}. He wants ${target}. How many more?`,
    correct: `Yes. ${answer} more ${foodLabel(food, answer)} for Feedster.`,
    wrong: `Almost. Count from ${current} up to ${target}.`
  };
}

function buildYuckiesProblem() {
  const config = DIFFICULTIES[state.difficulty].yuckies;
  const start = randomInt(config.startMin, config.startMax);
  const maxRemove = Math.min(config.removeMax || start, start - config.answerMin);
  const remove = randomInt(config.removeMin, maxRemove);
  const answer = start - remove;
  const food = sample(ACTIVE_YUCKY_FOODS);

  return {
    type: "yuckies",
    food,
    shownCount: start,
    removeCount: remove,
    answer,
    prompt: `There are ${start} ${foodLabel(food, start)}. Take away ${remove}. How many are left?`,
    correct: `Good. Only ${answer} ${foodLabel(food, answer)} left on the plate.`,
    wrong: `Try counting back ${remove} from ${start}.`
  };
}

function buildProblem() {
  if (state.mode === "scarfing") {
    return buildScarfingProblem();
  }

  if (state.mode === "yuckies") {
    return buildYuckiesProblem();
  }

  return Math.random() > 0.5 ? buildScarfingProblem() : buildYuckiesProblem();
}

function setSprite(kind) {
  elements.feedsterSprite.src = SPRITES[kind];
  elements.feedsterSprite.alt = `Feedster ${kind}`;
}

function renderPlate(problem) {
  const count = problem.shownCount;
  const visibleCount = Math.min(count, 12);
  const hiddenCount = Math.max(0, count - visibleCount);
  const fragment = document.createDocumentFragment();

  elements.plateItems.innerHTML = "";
  elements.plateItems.dataset.type = problem.type;

  const facts = document.createElement("div");
  facts.className = "plate-facts";

  if (problem.type === "scarfing") {
    facts.appendChild(createFact("has", count));
    facts.appendChild(createFact("wants", problem.totalCount));
    facts.appendChild(createFact("add", "?"));
  } else {
    facts.appendChild(createFact("start", count));
    facts.appendChild(createFact("take", problem.removeCount));
    facts.appendChild(createFact("left", "?"));
  }

  fragment.appendChild(facts);

  if (count === 0) {
    const empty = document.createElement("span");
    empty.className = "food-token food-token-empty";
    empty.textContent = "empty plate";
    fragment.appendChild(empty);
  }

  for (let index = 0; index < visibleCount; index += 1) {
    fragment.appendChild(createFoodToken(problem.food));
  }

  if (hiddenCount > 0) {
    const item = document.createElement("span");
    item.className = "food-token food-token-count";
    item.textContent = `+${hiddenCount}`;
    fragment.appendChild(item);
  }

  if (problem.type === "yuckies") {
    const removeBadge = document.createElement("span");
    removeBadge.className = "remove-badge";
    removeBadge.textContent = `take away ${problem.removeCount}`;
    fragment.appendChild(removeBadge);
  }

  elements.plateItems.appendChild(fragment);
}

function createFact(label, value) {
  const fact = document.createElement("span");
  fact.className = "plate-fact";
  fact.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  return fact;
}

function createFoodToken(food) {
  const item = document.createElement("span");
  const foodName = foodLabel(food, 1);
  const image = FOOD_IMAGES[food];

  item.className = "food-token";
  item.setAttribute("aria-label", foodName);
  item.title = foodName;

  if (!image) {
    item.textContent = foodName;
    return item;
  }

  item.classList.add("food-token-image");

  const img = document.createElement("img");
  img.src = image;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  item.appendChild(img);
  return item;
}

function updateSelectorState() {
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
  elements.difficultyButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === state.difficulty);
  });
}

function updateLabels() {
  elements.modeLabel.textContent = `${MODES[state.mode]} - ${DIFFICULTIES[state.difficulty].label}`;
  elements.difficultyHint.textContent = DIFFICULTY_HINTS[state.difficulty];

  if (state.mode === "feast") {
    const total = DIFFICULTIES[state.difficulty].feastRounds;
    elements.scoreLabel.textContent = `Bite ${state.feastIndex + 1}/${total} - ${state.feastScore} right`;
  } else {
    elements.scoreLabel.textContent = `Round ${state.round}`;
  }
}

function updateStats() {
  elements.sessionStat.textContent = `Right ${state.stats.correct}/${state.stats.attempts}`;
  elements.streakStat.textContent = `Streak ${state.stats.streak}`;
  elements.bestStat.textContent = `Best ${state.stats.best}`;
}

function recordResult(isCorrect) {
  state.stats.attempts += 1;

  if (isCorrect) {
    state.stats.correct += 1;
    state.stats.streak += 1;
  } else {
    state.stats.streak = 0;
  }

  if (state.stats.streak > state.stats.best) {
    state.stats.best = state.stats.streak;
    writeStoredValue(STORAGE_KEYS.bestStreak, state.stats.best);
  }

  updateStats();
}

function updateSoundButton() {
  elements.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
  elements.soundButton.setAttribute("aria-label", state.soundEnabled ? "Turn sound off" : "Turn sound on");
  elements.soundButton.textContent = state.soundEnabled ? "Sound On" : "Sound";
}

function updateReadButton() {
  elements.readButton.disabled = !state.canSpeak;
  elements.readButton.setAttribute("aria-pressed", String(state.problemSpeechEnabled && state.canSpeak));
  elements.readButton.setAttribute(
    "aria-label",
    state.problemSpeechEnabled ? "Turn problem reading off" : "Turn problem reading on"
  );
  elements.readButton.textContent = state.problemSpeechEnabled && state.canSpeak ? "Read On" : "Read";
  elements.readButton.title = state.canSpeak
    ? "Read each new problem out loud."
    : "Problem reading is not supported in this browser.";
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  writeStoredValue(STORAGE_KEYS.sound, state.soundEnabled);
  updateSoundButton();

  if (state.soundEnabled) {
    playCue("toggle");
  }
}

function markProblemSpeechReady() {
  state.problemSpeechReady = true;
}

function speakMessage(message) {
  if (!state.canSpeak || !state.problemSpeechEnabled || !message) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.94;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function speakCurrentProblem() {
  if (!state.currentProblem || !state.problemSpeechReady) {
    return;
  }

  speakMessage(state.currentProblem.prompt);
}

function toggleProblemSpeech() {
  if (!state.canSpeak) {
    return;
  }

  markProblemSpeechReady();
  state.problemSpeechEnabled = !state.problemSpeechEnabled;
  writeStoredValue(STORAGE_KEYS.problemSpeech, state.problemSpeechEnabled);

  if (!state.problemSpeechEnabled) {
    window.speechSynthesis.cancel();
  }

  updateReadButton();

  if (state.problemSpeechEnabled) {
    speakCurrentProblem();
  }
}

function openHelp() {
  if (elements.helpDialog.showModal) {
    elements.helpDialog.showModal();
    return;
  }

  elements.helpDialog.setAttribute("open", "");
}

function closeHelp() {
  if (elements.helpDialog.close) {
    elements.helpDialog.close();
    return;
  }

  elements.helpDialog.removeAttribute("open");
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return null;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContext();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }

  return state.audioContext;
}

function playCue(kind) {
  if (!state.soundEnabled) {
    return;
  }

  const audioContext = getAudioContext();

  if (!audioContext) {
    return;
  }

  const cues = {
    toggle: [420, 540],
    correct: [520, 720, 880],
    wrong: [220, 170],
    done: [420, 620, 760, 520]
  };
  const frequencies = cues[kind] || cues.toggle;
  const start = audioContext.currentTime;

  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const cueStart = start + index * 0.08;
    const cueEnd = cueStart + 0.09;

    oscillator.type = kind === "wrong" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, cueStart);
    gain.gain.setValueAtTime(0.0001, cueStart);
    gain.gain.exponentialRampToValueAtTime(kind === "wrong" ? 0.08 : 0.12, cueStart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, cueEnd);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(cueStart);
    oscillator.stop(cueEnd + 0.01);
  });
}

function clearTimer() {
  window.clearInterval(state.timerId);
  state.timerId = null;
  elements.timerWrap.hidden = true;
}

function startTimer() {
  clearTimer();

  if (state.mode !== "feast") {
    return;
  }

  const seconds = DIFFICULTIES[state.difficulty].feastSeconds;
  state.timeLeft = seconds;
  elements.timerWrap.hidden = false;
  renderTimer(seconds);

  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    renderTimer(seconds);

    if (state.timeLeft <= 0) {
      clearTimer();
      state.isAdvancing = true;
      recordResult(false);
      elements.answerInput.value = "";
      handleIncorrect("Time. Feedster is still chomping.");
      window.setTimeout(nextFeastProblem, 850);
    }
  }, 1000);
}

function renderTimer(totalSeconds) {
  const percent = Math.max(0, (state.timeLeft / totalSeconds) * 100);
  elements.timerLabel.textContent = `${state.timeLeft}`;
  elements.timerBar.style.width = `${percent}%`;
}

function newProblem() {
  state.isAdvancing = false;
  state.currentProblem = buildProblem();
  state.answer = state.currentProblem.answer;
  elements.answerInput.value = "";
  elements.promptText.textContent = state.currentProblem.prompt;
  elements.coachText.textContent = state.mode === "feast"
    ? "Quick bite. Answer before the crunch runs out."
    : "Type or tap the answer.";
  setSprite(state.currentProblem.type === "yuckies" ? "yucky" : state.mode === "feast" ? "feast" : "waiting");
  renderPlate(state.currentProblem);
  updateLabels();
  startTimer();
  focusAnswerInput();
  speakCurrentProblem();
}

function startMode() {
  clearTimer();
  state.round = 1;
  state.feastIndex = 0;
  state.feastScore = 0;
  updateSelectorState();
  newProblem();
}

function nextRegularProblem() {
  state.round += 1;
  newProblem();
}

function finishFeast() {
  const total = DIFFICULTIES[state.difficulty].feastRounds;
  clearTimer();
  state.currentProblem = null;
  state.isAdvancing = false;
  elements.promptText.textContent = `FEAST complete. Feedster got ${state.feastScore} out of ${total}.`;
  elements.coachText.textContent = state.feastScore === total
    ? "Stuffed and triumphant."
    : "Feedster is full. Try another FEAST when ready.";
  elements.scoreLabel.textContent = `${state.feastScore}/${total} right`;
  elements.answerInput.value = "";
  setSprite("done");
  playCue("done");
}

function nextFeastProblem() {
  const total = DIFFICULTIES[state.difficulty].feastRounds;
  state.feastIndex += 1;

  if (state.feastIndex >= total) {
    finishFeast();
    return;
  }

  newProblem();
}

function handleCorrect() {
  state.isAdvancing = true;
  clearTimer();
  recordResult(true);
  playCue("correct");
  setSprite(state.mode === "feast" ? "feast" : "correct");
  elements.coachText.textContent = state.currentProblem.correct;

  if (state.mode === "feast") {
    state.feastScore += 1;
    updateLabels();
    window.setTimeout(nextFeastProblem, 700);
    return;
  }

  window.setTimeout(nextRegularProblem, 900);
}

function handleIncorrect(message = state.currentProblem.wrong) {
  playCue("wrong");
  setSprite("wrong");
  elements.coachText.textContent = message;
}

function submitAnswer() {
  if (!state.currentProblem || state.isAdvancing) {
    return;
  }

  const rawAnswer = elements.answerInput.value.trim();

  if (rawAnswer === "") {
    elements.coachText.textContent = "Feedster needs a number.";
    return;
  }

  const numericAnswer = Number(rawAnswer);

  if (!Number.isInteger(numericAnswer) || numericAnswer < 0) {
    elements.coachText.textContent = "Use a whole number.";
    return;
  }

  if (numericAnswer === state.answer) {
    handleCorrect();
    return;
  }

  if (state.mode === "feast") {
    state.isAdvancing = true;
    clearTimer();
    recordResult(false);
    handleIncorrect();
    window.setTimeout(nextFeastProblem, 850);
    return;
  }

  recordResult(false);
  handleIncorrect();
}

function appendNumber(number) {
  const current = elements.answerInput.value;

  if (current.length >= 3) {
    return;
  }

  elements.answerInput.value = `${current}${number}`;
  focusAnswerInput();
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    elements.talkButton.disabled = true;
    elements.talkButton.textContent = "Type";
    elements.talkButton.title = "Speech input is not supported in this browser.";
    return;
  }

  const recognizer = new SpeechRecognition();
  recognizer.lang = "en-US";
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;
  state.speechRecognizer = recognizer;

  recognizer.addEventListener("start", () => {
    state.isListening = true;
    elements.talkButton.classList.add("is-listening");
    elements.talkButton.textContent = "Listen";
    elements.coachText.textContent = "Say the number.";
  });

  recognizer.addEventListener("end", () => {
    state.isListening = false;
    elements.talkButton.classList.remove("is-listening");
    elements.talkButton.textContent = "Talk";
  });

  recognizer.addEventListener("error", () => {
    elements.coachText.textContent = "Voice did not catch it. Type or tap the answer.";
  });

  recognizer.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const parsed = parseSpokenNumber(transcript);

    if (parsed === null) {
      elements.coachText.textContent = `Heard "${transcript}". Try a number.`;
      return;
    }

    elements.answerInput.value = parsed;
    elements.coachText.textContent = `Heard ${parsed}. Tap Go.`;
  });
}

function parseSpokenNumber(transcript) {
  const digitMatch = transcript.match(/\d+/);

  if (digitMatch) {
    return digitMatch[0];
  }

  const smallWords = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19
  };
  const tensWords = {
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90
  };

  const parts = transcript.replace(/-/g, " ").split(/\s+/).filter((part) => part !== "and");
  let value = 0;
  let found = false;

  parts.forEach((part) => {
    if (smallWords[part] !== undefined) {
      value += smallWords[part];
      found = true;
      return;
    }

    if (tensWords[part] !== undefined) {
      value += tensWords[part];
      found = true;
      return;
    }

    if (part === "hundred") {
      value = (value || 1) * 100;
      found = true;
    }
  });

  return found ? String(value) : null;
}

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    markProblemSpeechReady();
    state.mode = button.dataset.mode;
    startMode();
  });
});

elements.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    markProblemSpeechReady();
    state.difficulty = button.dataset.difficulty;
    startMode();
  });
});

elements.numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

elements.clearButton.addEventListener("click", () => {
  elements.answerInput.value = "";
  focusAnswerInput();
});

elements.submitButton.addEventListener("click", () => {
  markProblemSpeechReady();
  submitAnswer();
});
elements.newRoundButton.addEventListener("click", () => {
  markProblemSpeechReady();
  startMode();
});
elements.helpButton.addEventListener("click", openHelp);
elements.helpCloseButton.addEventListener("click", closeHelp);
elements.helpDialog.addEventListener("click", (event) => {
  if (event.target === elements.helpDialog) {
    closeHelp();
  }
});
elements.readButton.addEventListener("click", toggleProblemSpeech);
elements.soundButton.addEventListener("click", toggleSound);

elements.answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    markProblemSpeechReady();
    submitAnswer();
  }
});

elements.answerInput.addEventListener("pointerdown", (event) => {
  if (!isTouchPrimaryInput() || event.pointerType === "mouse") {
    return;
  }

  event.preventDefault();
  elements.answerInput.blur();
});

elements.talkButton.addEventListener("click", () => {
  if (!state.speechRecognizer || state.isListening) {
    return;
  }

  state.speechRecognizer.start();
});

syncAnswerInputMode();

if (window.matchMedia) {
  const pointerQuery = window.matchMedia("(pointer: coarse)");

  if (pointerQuery.addEventListener) {
    pointerQuery.addEventListener("change", syncAnswerInputMode);
  } else if (pointerQuery.addListener) {
    pointerQuery.addListener(syncAnswerInputMode);
  }
}

setupSpeechRecognition();
updateReadButton();
updateSoundButton();
updateStats();
startMode();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

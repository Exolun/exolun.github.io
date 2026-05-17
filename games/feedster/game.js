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
  waiting: "assets/feedster/feedster_salivating.png",
  correct: "assets/feedster/feedster_grinning.png",
  feast: "assets/feedster/feedster_feasting.png",
  wrong: "assets/feedster/feedster_cranky.png",
  yucky: "assets/feedster/feedster_gross_veggies.png",
  done: "assets/feedster/feedster_stuffed_full.png"
};

const DIFFICULTIES = {
  easy: {
    label: "Easy",
    max: 10,
    feastRounds: 5,
    feastSeconds: 18
  },
  medium: {
    label: "Medium",
    max: 20,
    feastRounds: 7,
    feastSeconds: 15
  },
  hard: {
    label: "Hard",
    max: 50,
    feastRounds: 10,
    feastSeconds: 12
  }
};

const MODES = {
  scarfing: "Scarfing",
  yuckies: "Yuckies",
  feast: "FEAST"
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
  isAdvancing: false
};

const elements = {
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  difficultyButtons: [...document.querySelectorAll("[data-difficulty]")],
  numberButtons: [...document.querySelectorAll("[data-number]")],
  answerInput: document.querySelector("#answerInput"),
  clearButton: document.querySelector("#clearButton"),
  submitButton: document.querySelector("#submitButton"),
  newRoundButton: document.querySelector("#newRoundButton"),
  talkButton: document.querySelector("#talkButton"),
  promptText: document.querySelector("#promptText"),
  feedsterSprite: document.querySelector("#feedsterSprite"),
  plateItems: document.querySelector("#plateItems"),
  coachText: document.querySelector("#coachText"),
  modeLabel: document.querySelector("#modeLabel"),
  scoreLabel: document.querySelector("#scoreLabel"),
  timerWrap: document.querySelector("#timerWrap"),
  timerLabel: document.querySelector("#timerLabel"),
  timerBar: document.querySelector("#timerBar")
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(items) {
  return items[randomInt(0, items.length - 1)];
}

function buildScarfingProblem() {
  const max = DIFFICULTIES[state.difficulty].max;
  const target = randomInt(Math.min(4, max), max);
  const current = randomInt(0, target);
  const food = sample(FAVORITE_FOODS);

  return {
    type: "scarfing",
    food,
    shownCount: current,
    totalCount: target,
    answer: target - current,
    prompt: `Feedster has ${current} ${food}. He wants ${target}. How many more?`,
    correct: `Yes. ${target - current} more ${food} for Feedster.`,
    wrong: `Almost. Count from ${current} up to ${target}.`
  };
}

function buildYuckiesProblem() {
  const max = DIFFICULTIES[state.difficulty].max;
  const start = randomInt(1, max);
  const remove = randomInt(0, start);
  const food = sample(YUCKY_FOODS);

  return {
    type: "yuckies",
    food,
    shownCount: start,
    removeCount: remove,
    answer: start - remove,
    prompt: `There are ${start} ${food}. Take away ${remove}. How many are left?`,
    correct: `Good. Only ${start - remove} ${food} left on the plate.`,
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
  const visibleCount = Math.min(count, 16);
  const hiddenCount = Math.max(0, count - visibleCount);
  const fragment = document.createDocumentFragment();

  elements.plateItems.innerHTML = "";
  elements.plateItems.dataset.type = problem.type;

  for (let index = 0; index < visibleCount; index += 1) {
    const item = document.createElement("span");
    item.className = "food-token";
    item.textContent = problem.food;
    fragment.appendChild(item);
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

  if (state.mode === "feast") {
    const total = DIFFICULTIES[state.difficulty].feastRounds;
    elements.scoreLabel.textContent = `Bite ${state.feastIndex + 1}/${total} - ${state.feastScore} right`;
  } else {
    elements.scoreLabel.textContent = `Round ${state.round}`;
  }
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
  elements.answerInput.focus({ preventScroll: true });
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
    handleIncorrect();
    window.setTimeout(nextFeastProblem, 850);
    return;
  }

  handleIncorrect();
}

function appendNumber(number) {
  const current = elements.answerInput.value;

  if (current.length >= 3) {
    return;
  }

  elements.answerInput.value = `${current}${number}`;
  elements.answerInput.focus({ preventScroll: true });
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

  const numberWords = {
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
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50
  };

  const parts = transcript.replace(/-/g, " ").split(/\s+/);
  let total = 0;
  let found = false;

  parts.forEach((part) => {
    if (numberWords[part] !== undefined) {
      total += numberWords[part];
      found = true;
    }
  });

  return found ? String(total) : null;
}

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    startMode();
  });
});

elements.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.difficulty = button.dataset.difficulty;
    startMode();
  });
});

elements.numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

elements.clearButton.addEventListener("click", () => {
  elements.answerInput.value = "";
  elements.answerInput.focus({ preventScroll: true });
});

elements.submitButton.addEventListener("click", submitAnswer);
elements.newRoundButton.addEventListener("click", startMode);

elements.answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitAnswer();
  }
});

elements.talkButton.addEventListener("click", () => {
  if (!state.speechRecognizer || state.isListening) {
    return;
  }

  state.speechRecognizer.start();
});

setupSpeechRecognition();
startMode();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

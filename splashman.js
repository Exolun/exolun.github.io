const WORD_BANK = {
  animals: [
    "panda",
    "tiger",
    "otter",
    "zebra",
    "rabbit",
    "monkey",
    "koala",
    "dolphin"
  ],
  colors: [
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "silver",
    "indigo",
    "scarlet"
  ],
  shapes: [
    "circle",
    "square",
    "triangle",
    "oval",
    "star",
    "heart",
    "diamond",
    "crescent"
  ],
  everyday: [
    "cookie",
    "rocket",
    "blanket",
    "rainbow",
    "backpack",
    "pencil",
    "window",
    "garden"
  ]
};

const CATEGORY_LABELS = {
  animals: "Animals",
  colors: "Colors",
  shapes: "Shapes",
  everyday: "Everyday Words"
};

const LETTER_ALIASES = {
  a: "a",
  ay: "a",
  bee: "b",
  be: "b",
  cee: "c",
  sea: "c",
  dee: "d",
  e: "e",
  ee: "e",
  gee: "g",
  jay: "j",
  kay: "k",
  cue: "q",
  queue: "q",
  are: "r",
  tea: "t",
  tee: "t",
  you: "u",
  why: "y"
};

const FILLER_WORDS = new Set([
  "guess",
  "letter",
  "my",
  "is",
  "the",
  "please",
  "pick",
  "choose",
  "its",
  "it's",
  "i"
]);

const BOTSLY_FRAMES = {
  panic: [1, 2, 3, 4, 5, 6],
  lose: 7,
  win: 9
};

const PANIC_MESSAGES = [
  "Botsly is feeling brave.",
  "Botsly looks a little worried.",
  "Botsly is getting twitchy.",
  "Botsly is wobbling on the platform.",
  "Botsly is really nervous now.",
  "Botsly is one miss away from a splash."
];

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

const state = {
  targetWord: "",
  category: "animals",
  correctGuesses: [],
  wrongGuesses: [],
  remainingSplashes: 6,
  maxSplashes: 6,
  status: "idle",
  lastTranscript: "",
  lastMessage: "",
  listening: false,
  voiceAvailable: !!SpeechRecognitionCtor && window.isSecureContext,
  canSpeak: "speechSynthesis" in window,
  recognition: null
};

const els = {
  app: document.getElementById("gameApp"),
  categorySelect: document.getElementById("categorySelect"),
  wordDisplay: document.getElementById("wordDisplay"),
  stageScene: document.getElementById("stageScene"),
  botslySprite: document.getElementById("botslySprite"),
  moodText: document.getElementById("moodText"),
  chanceText: document.getElementById("chanceText"),
  mistakeMeter: document.getElementById("mistakeMeter"),
  wrongGuesses: document.getElementById("wrongGuesses"),
  statusMessage: document.getElementById("statusMessage"),
  lastTranscript: document.getElementById("lastTranscript"),
  talkButton: document.getElementById("talkButton"),
  voiceHint: document.getElementById("voiceHint"),
  letterInput: document.getElementById("letterInput"),
  guessButton: document.getElementById("guessButton"),
  newGameButton: document.getElementById("newGameButton"),
  repeatButton: document.getElementById("repeatButton")
};

function spritePath(index) {
  return `assets/botsly/${index}.png`;
}

function pickRandomWord(category) {
  const words = WORD_BANK[category];
  return words[Math.floor(Math.random() * words.length)];
}

function currentPanicFrameIndex() {
  return Math.min(state.wrongGuesses.length, BOTSLY_FRAMES.panic.length - 1);
}

function currentSpriteIndex() {
  if (state.status === "won") {
    return BOTSLY_FRAMES.win;
  }

  if (state.status === "lost") {
    return BOTSLY_FRAMES.lose;
  }

  return BOTSLY_FRAMES.panic[currentPanicFrameIndex()];
}

function currentMoodText() {
  if (state.status === "won") {
    return "Botsly stayed dry and is doing a victory pose.";
  }

  if (state.status === "lost") {
    return "Splash! Botsly fell into the water.";
  }

  return PANIC_MESSAGES[currentPanicFrameIndex()];
}

function remainingMissText() {
  if (state.status === "won") {
    return "You saved Botsly";
  }

  if (state.status === "lost") {
    return "Out of chances";
  }

  const label = state.remainingSplashes === 1 ? "miss left" : "misses left";
  return `${state.remainingSplashes} ${label}`;
}

function buildCategoryButtons() {
  Object.entries(CATEGORY_LABELS).forEach(([categoryKey, label]) => {
    const option = document.createElement("option");
    option.value = categoryKey;
    option.textContent = label;
    els.categorySelect.appendChild(option);
  });
}

function startNewGame(options = {}) {
  const { speak = false } = options;
  state.targetWord = pickRandomWord(state.category);
  state.correctGuesses = [];
  state.wrongGuesses = [];
  state.remainingSplashes = state.maxSplashes;
  state.status = "playing";
  state.lastTranscript = "";

  const message = `New game. ${CATEGORY_LABELS[state.category]}. Say one letter or type one letter to help Botsly stay dry.`;
  setStatusMessage(message, { speak });
  render();
  focusLetterInput();
}

function focusLetterInput() {
  if (!isGameOver()) {
    els.letterInput.focus({ preventScroll: true });
  }
}

function normalizeManualInput(value) {
  return value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 1);
}

function render() {
  els.app.dataset.state = state.listening ? "listening" : state.status;
  els.categorySelect.value = state.category;

  renderCharacterScene();
  renderWord();
  renderMistakeMeter();
  renderWrongGuesses();
  renderStatus();
  renderVoiceState();
  renderControlState();
}

function renderCharacterScene() {
  const spriteIndex = currentSpriteIndex();
  els.stageScene.dataset.frame = String(spriteIndex);
  els.botslySprite.src = spritePath(spriteIndex);
  els.botslySprite.alt = currentMoodText();
  els.moodText.textContent = currentMoodText();
  els.chanceText.textContent = remainingMissText();
}

function renderWord() {
  els.wordDisplay.textContent = "";

  [...state.targetWord].forEach((letter) => {
    const letterBox = document.createElement("div");
    const shouldReveal = state.correctGuesses.includes(letter) || state.status === "lost";
    letterBox.className = `letter-box${shouldReveal ? "" : " is-hidden"}`;
    letterBox.textContent = letter.toUpperCase();
    letterBox.setAttribute("aria-label", shouldReveal ? `Letter ${letter.toUpperCase()}` : "Hidden letter");
    els.wordDisplay.appendChild(letterBox);
  });
}

function renderMistakeMeter() {
  els.mistakeMeter.textContent = "";

  for (let i = 0; i < state.maxSplashes; i += 1) {
    const dot = document.createElement("div");
    dot.className = `mistake-dot${i < state.wrongGuesses.length ? " is-used" : ""}`;
    els.mistakeMeter.appendChild(dot);
  }
}

function renderWrongGuesses() {
  els.wrongGuesses.textContent = "";

  if (!state.wrongGuesses.length) {
    const empty = document.createElement("span");
    empty.className = "empty-note";
    empty.textContent = "No misses yet";
    els.wrongGuesses.appendChild(empty);
    return;
  }

  state.wrongGuesses.forEach((letter) => {
    const chip = document.createElement("span");
    chip.className = "wrong-chip";
    chip.textContent = letter.toUpperCase();
    els.wrongGuesses.appendChild(chip);
  });
}

function renderStatus() {
  els.statusMessage.textContent = state.lastMessage;
  els.lastTranscript.textContent = state.lastTranscript ? `Heard: "${state.lastTranscript}"` : "";
}

function renderVoiceState() {
  if (state.voiceAvailable) {
    els.voiceHint.textContent = "Voice works best on a secure site. Tap once and say a single letter.";
    els.talkButton.disabled = isGameOver();
    els.talkButton.querySelector(".talk-button-main").textContent = state.listening ? "Listening..." : "Tap to Talk";
    els.talkButton.querySelector(".talk-button-sub").textContent = state.listening
      ? "Say one letter now"
      : "Say one letter like \"B\" or \"guess D\"";
    return;
  }

  els.voiceHint.textContent = "Voice input is not available on this browser or connection. You can still play by typing.";
  els.talkButton.disabled = true;
  els.talkButton.querySelector(".talk-button-main").textContent = "Voice Unavailable";
  els.talkButton.querySelector(".talk-button-sub").textContent = "Type one letter below instead";
}

function renderControlState() {
  const disabled = isGameOver();
  els.letterInput.disabled = disabled;
  els.guessButton.disabled = disabled;
}

function setStatusMessage(message, options = {}) {
  const { speak = false } = options;
  state.lastMessage = message;
  renderStatus();

  if (speak) {
    speakMessage(message);
  }
}

function speakMessage(message) {
  if (!state.canSpeak || !message) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.95;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function submitGuess(rawLetter, source = "manual") {
  if (isGameOver()) {
    setStatusMessage("Tap New Game to play again.", { speak: source === "voice" });
    return;
  }

  const letter = normalizeManualInput(rawLetter);

  if (!letter) {
    setStatusMessage("Please guess one letter.", { speak: source === "voice" });
    return;
  }

  if (state.correctGuesses.includes(letter) || state.wrongGuesses.includes(letter)) {
    setStatusMessage(`You already guessed ${letter.toUpperCase()}. Try a new letter.`, { speak: source === "voice" });
    return;
  }

  if (state.targetWord.includes(letter)) {
    state.correctGuesses.push(letter);

    if (isGameWon()) {
      state.status = "won";
      setStatusMessage(`Great job. You solved the word ${state.targetWord.toUpperCase()} and kept Botsly dry!`, { speak: true });
    } else {
      setStatusMessage(`Nice guess. ${letter.toUpperCase()} is in the word.`, { speak: source === "voice" });
    }
  } else {
    state.wrongGuesses.push(letter);
    state.remainingSplashes -= 1;

    if (isGameLost()) {
      state.status = "lost";
      setStatusMessage(`Splash! Botsly fell in. The word was ${state.targetWord.toUpperCase()}.`, { speak: true });
    } else {
      setStatusMessage(`Oops. ${letter.toUpperCase()} is not in the word. Botsly looks more nervous.`, { speak: source === "voice" });
    }
  }

  els.letterInput.value = "";
  render();
  focusLetterInput();
}

function isGameWon() {
  return [...new Set(state.targetWord)].every((letter) => state.correctGuesses.includes(letter));
}

function isGameLost() {
  return state.remainingSplashes <= 0;
}

function isGameOver() {
  return state.status === "won" || state.status === "lost";
}

function parseTranscriptToLetter(transcript) {
  const cleaned = transcript
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return {
      success: false,
      letter: "",
      reason: "I did not hear a letter."
    };
  }

  if (/^[a-z]$/.test(cleaned)) {
    return {
      success: true,
      letter: cleaned,
      reason: ""
    };
  }

  const tokens = cleaned.split(" ").filter(Boolean);
  const candidates = [];

  tokens.forEach((token) => {
    if (FILLER_WORDS.has(token)) {
      return;
    }

    if (/^[a-z]$/.test(token)) {
      candidates.push(token);
      return;
    }

    if (LETTER_ALIASES[token]) {
      candidates.push(LETTER_ALIASES[token]);
    }
  });

  const uniqueCandidates = [...new Set(candidates)];

  if (uniqueCandidates.length === 1) {
    return {
      success: true,
      letter: uniqueCandidates[0],
      reason: ""
    };
  }

  return {
    success: false,
    letter: "",
    reason: "Please say exactly one letter, or type it below."
  };
}

function stopRecognition() {
  if (state.recognition) {
    state.recognition.onresult = null;
    state.recognition.onerror = null;
    state.recognition.onend = null;
    state.recognition.stop();
    state.recognition = null;
  }

  state.listening = false;
  render();
}

function startVoiceRecognition() {
  if (!state.voiceAvailable || isGameOver()) {
    return;
  }

  if (state.listening) {
    stopRecognition();
    setStatusMessage("Voice stopped. You can tap again when you are ready.");
    return;
  }

  const recognition = new SpeechRecognitionCtor();
  state.recognition = recognition;
  state.listening = true;
  state.lastTranscript = "";
  state.status = isGameOver() ? state.status : "playing";
  render();
  setStatusMessage("Listening for one letter...");

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript || "";
    state.lastTranscript = transcript.trim();
    const parsed = parseTranscriptToLetter(transcript);
    stopRecognition();

    if (!parsed.success) {
      setStatusMessage(parsed.reason, { speak: true });
      return;
    }

    submitGuess(parsed.letter, "voice");
  };

  recognition.onerror = () => {
    stopRecognition();
    setStatusMessage("Voice had a little splash. Try again or type a letter.", { speak: true });
  };

  recognition.onend = () => {
    if (state.recognition) {
      stopRecognition();
    }
  };

  recognition.start();
}

function handleManualGuess() {
  submitGuess(els.letterInput.value, "manual");
}

function handleRepeat() {
  if (!state.lastMessage) {
    return;
  }

  speakMessage(state.lastMessage);
  setStatusMessage(state.lastMessage);
}

function bindEvents() {
  els.talkButton.addEventListener("click", startVoiceRecognition);
  els.guessButton.addEventListener("click", handleManualGuess);
  els.newGameButton.addEventListener("click", () => startNewGame({ speak: true }));
  els.repeatButton.addEventListener("click", handleRepeat);
  els.categorySelect.addEventListener("change", () => {
    state.category = els.categorySelect.value;
    startNewGame({ speak: true });
  });

  els.letterInput.addEventListener("input", () => {
    const normalized = normalizeManualInput(els.letterInput.value);
    els.letterInput.value = normalized.toUpperCase();
  });

  els.letterInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleManualGuess();
    }
  });
}

function init() {
  buildCategoryButtons();
  bindEvents();
  startNewGame({ speak: false });
}

init();

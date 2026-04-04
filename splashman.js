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

const WORD_HINTS = {
  panda: "Black and white bear.",
  tiger: "A striped jungle cat.",
  otter: "A playful animal that swims.",
  zebra: "An animal with black and white stripes.",
  rabbit: "A fluffy hopper with long ears.",
  monkey: "Likes bananas.",
  koala: "A sleepy tree climber from Australia.",
  dolphin: "A smart animal that swims in the ocean.",
  blue: "The color of the sky.",
  green: "The color of grass.",
  orange: "A fruit and a color.",
  purple: "A royal color.",
  yellow: "The color of the sun.",
  silver: "A shiny metal color.",
  indigo: "A deep blue-purple color.",
  scarlet: "A bright red color.",
  circle: "A round shape with no corners.",
  square: "A shape with four equal sides.",
  triangle: "A shape with three sides.",
  oval: "A stretched-out circle.",
  star: "A shape that shines in the night sky.",
  heart: "A shape that means love.",
  diamond: "A shape like a tilted square.",
  crescent: "A moon-shaped curve.",
  cookie: "A sweet baked treat.",
  rocket: "It blasts into space.",
  blanket: "Keeps you warm in bed.",
  rainbow: "Many colors in the sky after rain.",
  backpack: "You carry books in it.",
  pencil: "You write with it.",
  window: "You look through it.",
  garden: "Flowers and plants grow there."
};

const CATEGORY_LABELS = {
  random: "Random",
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
  "word",
  "solve",
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
  category: "random",
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
  if (category === "random") {
    const availableCategories = Object.keys(WORD_BANK);
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    return pickRandomWord(randomCategory);
  }

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

  const message = `New game. ${CATEGORY_LABELS[state.category]}. Say or type a guess to help Botsly stay dry.`;
  setStatusMessage(message, { speak });
  render();
  focusLetterInput({ source: "new-game" });
}

function isTouchPrimaryInput() {
  return window.matchMedia?.("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function blurLetterInput() {
  if (document.activeElement === els.letterInput) {
    els.letterInput.blur();
  }
}

function focusLetterInput(options = {}) {
  const { source = "manual" } = options;

  if (isGameOver() || source === "voice") {
    return;
  }

  if (isTouchPrimaryInput()) {
    return;
  }

  els.letterInput.focus({ preventScroll: true });
}

function normalizeGuessInput(value) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function displayGuess(guess) {
  return guess.toUpperCase();
}

function isLetterGuess(guess) {
  return guess.length === 1;
}

function hasGuessedAlready(guess) {
  return state.correctGuesses.includes(guess) || state.wrongGuesses.includes(guess);
}

function applyWrongGuess(guess, shouldSpeakFeedback) {
  state.wrongGuesses.push(guess);
  state.remainingSplashes -= 1;

  if (isGameLost()) {
    state.status = "lost";
    setStatusMessage(`Splash! Botsly fell in. The word was ${state.targetWord.toUpperCase()}.`, { speak: true });
    return;
  }

  if (isLetterGuess(guess)) {
    setStatusMessage(`Oops. ${displayGuess(guess)} is not in the word. Botsly looks more nervous.`, { speak: shouldSpeakFeedback });
    return;
  }

  setStatusMessage(`Not this time. ${displayGuess(guess)} is not the word. Botsly looks more nervous.`, { speak: shouldSpeakFeedback });
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
    els.voiceHint.textContent = "Voice works best on a secure site. Tap once and say a letter or the whole word.";
    els.talkButton.disabled = isGameOver();
    els.talkButton.querySelector(".talk-button-main").textContent = state.listening ? "Listening..." : "Tap to Talk";
    els.talkButton.querySelector(".talk-button-sub").textContent = state.listening
      ? "Say your guess now"
      : "Say a letter or solve the word";
    return;
  }

  els.voiceHint.textContent = "Voice input is not available on this browser or connection. You can still play by typing.";
  els.talkButton.disabled = true;
  els.talkButton.querySelector(".talk-button-main").textContent = "Voice Unavailable";
  els.talkButton.querySelector(".talk-button-sub").textContent = "Type your guess below instead";
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

function submitGuess(rawGuess, source = "manual") {
  const shouldSpeakFeedback = source === "voice" || source === "manual";

  if (isGameOver()) {
    setStatusMessage("Tap New Game to play again.", { speak: shouldSpeakFeedback });
    return;
  }

  const guess = normalizeGuessInput(rawGuess);

  if (!guess) {
    setStatusMessage("Please enter a guess.", { speak: shouldSpeakFeedback });
    return;
  }

  if (hasGuessedAlready(guess)) {
    setStatusMessage(`You already guessed ${displayGuess(guess)}. Try something new.`, { speak: shouldSpeakFeedback });
    return;
  }

  if (isLetterGuess(guess)) {
    if (state.targetWord.includes(guess)) {
      state.correctGuesses.push(guess);

      if (isGameWon()) {
        state.status = "won";
        setStatusMessage(`Great job. You solved the word ${state.targetWord.toUpperCase()} and kept Botsly dry!`, { speak: true });
      } else {
        setStatusMessage(`Nice guess. ${displayGuess(guess)} is in the word.`, { speak: shouldSpeakFeedback });
      }

    } else {
      applyWrongGuess(guess, shouldSpeakFeedback);
    }
  } else {
    if (guess === state.targetWord) {
      state.status = "won";
      setStatusMessage(`Amazing. You solved the word ${state.targetWord.toUpperCase()} and kept Botsly dry!`, { speak: true });
    } else {
      applyWrongGuess(guess, shouldSpeakFeedback);
    }
  }

  els.letterInput.value = "";
  render();
  focusLetterInput({ source });
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

function parseTranscriptToGuess(transcript) {
  const cleaned = transcript
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return {
      success: false,
      guess: "",
      reason: "I did not hear a guess."
    };
  }

  if (/^[a-z]$/.test(cleaned)) {
    return {
      success: true,
      guess: cleaned,
      reason: ""
    };
  }

  const tokens = cleaned
    .split(" ")
    .filter(Boolean)
    .filter((token) => !FILLER_WORDS.has(token));

  if (!tokens.length) {
    return {
      success: false,
      guess: "",
      reason: "Please say a letter or the whole word, or type it below."
    };
  }

  const normalizedTokens = tokens.map((token) => {
    if (/^[a-z]$/.test(token)) {
      return token;
    }

    return LETTER_ALIASES[token] || token;
  });

  if (normalizedTokens.length === 1) {
    return {
      success: true,
      guess: normalizedTokens[0],
      reason: ""
    };
  }

  const uniqueCandidates = [...new Set(normalizedTokens)];

  if (uniqueCandidates.length === 1 && uniqueCandidates[0].length === 1) {
    return {
      success: true,
      guess: uniqueCandidates[0],
      reason: ""
    };
  }

  if (normalizedTokens.every((token) => /^[a-z]+$/.test(token) && token.length > 1)) {
    return {
      success: true,
      guess: normalizedTokens.join(""),
      reason: ""
    };
  }

  return {
    success: false,
    guess: "",
    reason: "Please say a letter or the whole word, or type it below."
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
  blurLetterInput();
  state.recognition = recognition;
  state.listening = true;
  state.lastTranscript = "";
  state.status = isGameOver() ? state.status : "playing";
  render();
  setStatusMessage("Listening for your guess...");

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript || "";
    state.lastTranscript = transcript.trim();
    const parsed = parseTranscriptToGuess(transcript);
    stopRecognition();

    if (!parsed.success) {
      setStatusMessage(parsed.reason, { speak: true });
      return;
    }

    submitGuess(parsed.guess, "voice");
  };

  recognition.onerror = () => {
    stopRecognition();
    setStatusMessage("Voice had a little splash. Try again or type your guess.", { speak: true });
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
  const hint = WORD_HINTS[state.targetWord];
  if (!hint) {
    setStatusMessage("No hint is ready for this word yet.");
    return;
  }

  const hintMessage = `Hint: ${hint}`;
  setStatusMessage(hintMessage, { speak: true });
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
    const normalized = normalizeGuessInput(els.letterInput.value);
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

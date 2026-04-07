const WORD_BANK = {
  animals: [
    "panda",
    "tiger",
    "otter",
    "zebra",
    "rabbit",
    "monkey",
    "koala",
    "dolphin",
    "lion",
    "giraffe",
    "elephant",
    "penguin",
    "cheetah",
    "kangaroo",
    "hamster",
    "parrot",
    "turtle",
    "walrus",
    "fox",
    "beaver",
    "lemur",
    "rhino",
    "whale",
    "puppy"
  ],
  colors: [
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "silver",
    "indigo",
    "scarlet",
    "red",
    "pink",
    "brown",
    "black",
    "white",
    "gold",
    "teal",
    "navy",
    "peach",
    "coral",
    "amber",
    "violet",
    "turquoise",
    "maroon",
    "gray",
    "crimson"
  ],
  food: [
    "apple",
    "banana",
    "pizza",
    "muffin",
    "carrot",
    "cereal",
    "pancake",
    "pretzel",
    "noodles",
    "waffles",
    "burger",
    "grapes",
    "melon",
    "peach",
    "cherry",
    "taco",
    "yogurt",
    "oatmeal",
    "pickle",
    "lemon",
    "peanut",
    "jelly",
    "brownie",
    "bacon"
  ],
  shapes: [
    "circle",
    "square",
    "triangle",
    "oval",
    "star",
    "heart",
    "diamond",
    "crescent",
    "rectangle",
    "hexagon",
    "octagon",
    "pentagon",
    "rhombus",
    "trapezoid",
    "cross",
    "cube",
    "sphere",
    "cylinder",
    "cone",
    "spiral",
    "arrow",
    "semicircle",
    "prism",
    "ring"
  ],
  clothes: [
    "shirt",
    "pants",
    "socks",
    "shoes",
    "jacket",
    "mitten",
    "boots",
    "sweater",
    "pajamas",
    "hat",
    "scarf",
    "shorts",
    "dress",
    "zipper",
    "pocket",
    "raincoat",
    "slippers",
    "apron",
    "cap",
    "hoodie",
    "glove",
    "sandal",
    "costume",
    "vest"
  ],
  vehicles: [
    "car",
    "truck",
    "train",
    "bus",
    "wagon",
    "scooter",
    "airplane",
    "boat",
    "subway",
    "tractor",
    "helicopter",
    "ambulance",
    "taxi",
    "van",
    "canoe",
    "motorcycle",
    "sailboat",
    "bulldozer",
    "racecar",
    "spaceship",
    "jeep",
    "trolley",
    "skateboard",
    "kayak"
  ],
  nature: [
    "tree",
    "flower",
    "river",
    "mountain",
    "forest",
    "cloud",
    "acorn",
    "pebble",
    "leaf",
    "seed",
    "sunset",
    "sunrise",
    "meadow",
    "cactus",
    "ocean",
    "pond",
    "branch",
    "pinecone",
    "waterfall",
    "stone",
    "hill",
    "valley",
    "moss",
    "tulip"
  ],
  jobs: [
    "teacher",
    "doctor",
    "baker",
    "artist",
    "pilot",
    "farmer",
    "nurse",
    "chef",
    "dentist",
    "singer",
    "dancer",
    "driver",
    "builder",
    "painter",
    "coach",
    "vet",
    "firefighter",
    "scientist",
    "mailman",
    "officer",
    "barber",
    "mechanic",
    "actor",
    "plumber"
  ],
  everyday: [
    "cookie",
    "rocket",
    "blanket",
    "rainbow",
    "backpack",
    "pencil",
    "window",
    "garden",
    "bicycle",
    "sandwich",
    "balloon",
    "laptop",
    "helmet",
    "toothbrush",
    "popcorn",
    "camera",
    "snowman",
    "pillow",
    "firetruck",
    "umbrella",
    "cupcake",
    "treasure",
    "library",
    "kitchen"
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
  lion: "A big cat with a mighty roar.",
  giraffe: "A tall animal with a very long neck.",
  elephant: "A huge animal with a trunk.",
  penguin: "A black and white bird that waddles.",
  cheetah: "A very fast spotted cat.",
  kangaroo: "A jumper with a pouch.",
  hamster: "A tiny furry pet with cheek pouches.",
  parrot: "A colorful bird that can copy sounds.",
  turtle: "A slow animal with a shell.",
  walrus: "A large sea animal with tusks.",
  fox: "A clever animal with a fluffy tail.",
  beaver: "An animal that builds dams.",
  lemur: "A tree climber with big eyes.",
  rhino: "A heavy animal with a horn on its nose.",
  whale: "A giant animal that lives in the ocean.",
  puppy: "A young playful dog.",
  blue: "The color of the sky.",
  green: "The color of grass.",
  orange: "A fruit and a color.",
  purple: "A royal color.",
  yellow: "The color of the sun.",
  silver: "A shiny metal color.",
  indigo: "A deep blue-purple color.",
  scarlet: "A bright red color.",
  red: "The color of many apples.",
  pink: "A soft rosy color.",
  brown: "The color of tree bark.",
  black: "The darkest color.",
  white: "The color of fresh snow.",
  gold: "A bright shiny treasure color.",
  teal: "A blue-green color.",
  navy: "A deep dark blue.",
  peach: "A soft orange-pink color.",
  coral: "A pink-orange ocean color.",
  amber: "A warm golden-orange color.",
  violet: "A purple flower color.",
  turquoise: "A bright blue-green gem color.",
  maroon: "A dark red color.",
  gray: "A smoky in-between color.",
  crimson: "A rich deep red color.",
  apple: "A crunchy fruit that can be red or green.",
  banana: "A long yellow fruit.",
  pizza: "A cheesy slice for lunch or dinner.",
  muffin: "A small baked treat for breakfast.",
  carrot: "An orange vegetable that grows underground.",
  cereal: "A breakfast food you eat in a bowl.",
  pancake: "A flat breakfast cake with syrup.",
  pretzel: "A twisty salty snack.",
  noodles: "Long wiggly pieces of pasta.",
  waffles: "A breakfast food with little squares.",
  burger: "A sandwich with a patty inside.",
  grapes: "Small round fruit that grow in bunches.",
  melon: "A big fruit with juicy slices.",
  peach: "A soft fuzzy fruit.",
  cherry: "A small red fruit with a pit.",
  taco: "A folded shell with food inside.",
  yogurt: "A creamy snack you eat with a spoon.",
  oatmeal: "A warm breakfast made from oats.",
  pickle: "A sour crunchy snack from a cucumber.",
  lemon: "A bright yellow sour fruit.",
  peanut: "A small nut in a shell.",
  jelly: "A sweet fruit spread for bread.",
  brownie: "A soft chocolate dessert square.",
  bacon: "A crispy breakfast meat.",
  circle: "A round shape with no corners.",
  square: "A shape with four equal sides.",
  triangle: "A shape with three sides.",
  oval: "A stretched-out circle.",
  star: "A shape that shines in the night sky.",
  heart: "A shape that means love.",
  diamond: "A shape like a tilted square.",
  crescent: "A moon-shaped curve.",
  rectangle: "A shape with four sides and two long edges.",
  hexagon: "A shape with six sides.",
  octagon: "A shape with eight sides.",
  pentagon: "A shape with five sides.",
  rhombus: "A slanted shape with four equal sides.",
  trapezoid: "A shape with one pair of parallel sides.",
  cross: "A shape like a plus sign.",
  cube: "A box shape with square faces.",
  sphere: "A round ball shape.",
  cylinder: "A can-shaped solid.",
  cone: "A shape with a pointy top and round base.",
  spiral: "A shape that curls around and around.",
  arrow: "A shape that points the way.",
  semicircle: "Half of a circle.",
  prism: "A solid shape with matching ends.",
  ring: "A circle shape with a hole in the middle.",
  shirt: "You wear it on your top half.",
  pants: "Clothes that cover both legs.",
  socks: "You wear them on your feet inside shoes.",
  shoes: "You wear them when you walk outside.",
  jacket: "A coat you wear when it is chilly.",
  mitten: "It keeps your hand warm in winter.",
  boots: "Strong shoes for rain or snow.",
  sweater: "A warm shirt for cool days.",
  pajamas: "Clothes you wear to sleep.",
  hat: "You wear it on your head.",
  scarf: "A long soft piece you wear around your neck.",
  shorts: "Pants with short legs.",
  dress: "One piece of clothing you wear over your body.",
  zipper: "It slides up and down on clothes.",
  pocket: "A little pouch in your clothes.",
  raincoat: "A coat that keeps you dry in rain.",
  slippers: "Soft shoes for inside the house.",
  apron: "You wear it to help keep clothes clean.",
  cap: "A soft hat with a brim.",
  hoodie: "A sweatshirt with a hood.",
  glove: "It covers one hand and each finger.",
  sandal: "An open shoe for warm weather.",
  costume: "Clothes for pretending to be someone else.",
  vest: "A sleeveless piece of clothing.",
  car: "A road vehicle with four wheels.",
  truck: "A big vehicle that carries heavy things.",
  train: "Cars that roll on tracks.",
  bus: "A big vehicle that carries many people.",
  wagon: "A little cart you can pull.",
  scooter: "A ride you push with your foot.",
  airplane: "A vehicle that flies in the sky.",
  boat: "A vehicle that floats on water.",
  subway: "A train that travels underground.",
  tractor: "A strong farm vehicle.",
  helicopter: "A flying vehicle with spinning blades.",
  ambulance: "A helper vehicle that takes sick people to the hospital.",
  taxi: "A car that gives people rides.",
  van: "A large car with lots of room inside.",
  canoe: "A narrow boat you paddle.",
  motorcycle: "A fast vehicle with two wheels.",
  sailboat: "A boat that moves with wind in its sail.",
  bulldozer: "A heavy machine that pushes dirt.",
  racecar: "A very fast car for racing.",
  spaceship: "A vehicle that travels in space.",
  jeep: "A strong car for bumpy roads.",
  trolley: "A streetcar that rides on tracks.",
  skateboard: "A board with wheels you ride standing up.",
  kayak: "A small boat for one person to paddle.",
  tree: "A tall plant with a trunk and branches.",
  flower: "A colorful plant bloom.",
  river: "Water that flows across the land.",
  mountain: "A very tall rocky hill.",
  forest: "A place with many trees.",
  cloud: "A fluffy shape in the sky.",
  acorn: "A little nut from an oak tree.",
  pebble: "A small smooth stone.",
  leaf: "A flat green part of a plant.",
  seed: "A tiny part that can grow into a plant.",
  sunset: "When the sun goes down at the end of the day.",
  sunrise: "When the sun comes up in the morning.",
  meadow: "A grassy field with wildflowers.",
  cactus: "A plant with spines that grows in dry places.",
  ocean: "A giant body of salty water.",
  pond: "A small pool of water outdoors.",
  branch: "An arm of a tree.",
  pinecone: "A cone that falls from a pine tree.",
  waterfall: "Water that falls down over rocks.",
  stone: "A hard rock you can hold in your hand.",
  hill: "A small raised part of the land.",
  valley: "Low land between hills or mountains.",
  moss: "A soft green plant that grows on rocks and trees.",
  tulip: "A cup-shaped spring flower.",
  teacher: "A person who helps kids learn at school.",
  doctor: "A person who helps you feel better when you are sick.",
  baker: "A person who makes bread and treats.",
  artist: "A person who makes pictures or art.",
  pilot: "A person who flies an airplane.",
  farmer: "A person who grows food and cares for animals.",
  nurse: "A helper who cares for people at the hospital.",
  chef: "A cook who makes meals.",
  dentist: "A person who helps keep teeth healthy.",
  singer: "A person who sings songs.",
  dancer: "A person who moves to music.",
  driver: "A person who drives a car, bus, or truck.",
  builder: "A person who helps make houses and buildings.",
  painter: "A person who paints walls or pictures.",
  coach: "A person who teaches a team how to play.",
  vet: "A doctor for animals.",
  firefighter: "A helper who puts out fires.",
  scientist: "A person who studies and discovers new things.",
  mailman: "A person who brings letters and packages.",
  officer: "A police helper who keeps people safe.",
  barber: "A person who cuts hair.",
  mechanic: "A person who fixes cars and machines.",
  actor: "A person who pretends to be a character in a show.",
  plumber: "A person who fixes sinks, pipes, and water problems.",
  cookie: "A sweet baked treat.",
  rocket: "It blasts into space.",
  blanket: "Keeps you warm in bed.",
  rainbow: "Many colors in the sky after rain.",
  backpack: "You carry books in it.",
  pencil: "You write with it.",
  window: "You look through it.",
  garden: "Flowers and plants grow there.",
  bicycle: "You pedal it to ride around.",
  sandwich: "A lunch food between slices of bread.",
  balloon: "A floaty party decoration.",
  laptop: "A computer you can carry.",
  helmet: "You wear it to protect your head.",
  toothbrush: "You use it to clean your teeth.",
  popcorn: "A crunchy movie snack.",
  camera: "It takes pictures.",
  snowman: "A winter friend made of snow.",
  pillow: "You rest your head on it.",
  firetruck: "A bright red truck that helps put out fires.",
  umbrella: "You use it when rain falls.",
  cupcake: "A small cake with frosting.",
  treasure: "A hidden prize or chest of goodies.",
  library: "A place filled with books.",
  kitchen: "A room where meals are made."
};

const CATEGORY_LABELS = {
  random: "Random",
  animals: "Animals",
  colors: "Colors",
  food: "Food",
  shapes: "Shapes",
  clothes: "Clothes",
  vehicles: "Vehicles",
  nature: "Nature",
  jobs: "Jobs",
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
  speechEnabled: "speechSynthesis" in window,
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
  soundToggle: document.getElementById("soundToggle"),
  talkButton: document.getElementById("talkButton"),
  letterInput: document.getElementById("letterInput"),
  guessButton: document.getElementById("guessButton"),
  newGameButton: document.getElementById("newGameButton"),
  repeatButton: document.getElementById("repeatButton")
};

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    console.error("Splashman service worker registration failed.", error);
  }
}

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
  const { speak = false, speakHint = false } = options;
  state.targetWord = pickRandomWord(state.category);
  state.correctGuesses = [];
  state.wrongGuesses = [];
  state.remainingSplashes = state.maxSplashes;
  state.status = "playing";
  state.lastTranscript = "";

  const hint = WORD_HINTS[state.targetWord];
  const message = speakHint && hint
    ? `Hint: ${hint}`
    : `New game. ${CATEGORY_LABELS[state.category]}. Say or type a guess to help Botsly stay dry.`;
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

function revealWholeWord() {
  state.correctGuesses = [...new Set(state.targetWord)];
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
  renderSpeechToggle();
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

function renderSpeechToggle() {
  els.soundToggle.disabled = !state.canSpeak;
  els.soundToggle.setAttribute("aria-pressed", String(!state.speechEnabled));
  els.soundToggle.textContent = state.speechEnabled ? "Mute" : "Unmute";
  els.soundToggle.setAttribute(
    "aria-label",
    state.speechEnabled ? "Mute spoken feedback" : "Unmute spoken feedback"
  );
}

function renderVoiceState() {
  if (state.voiceAvailable) {
    els.talkButton.disabled = isGameOver();
    els.talkButton.querySelector(".talk-button-main").textContent = state.listening ? "Listening..." : "Tap to Talk";
    els.talkButton.querySelector(".talk-button-sub").textContent = state.listening
      ? "Say your guess now"
      : "Say a letter or solve the word";
    return;
  }

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
  if (!state.canSpeak || !state.speechEnabled || !message) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.95;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

async function tryLockPortraitOrientation() {
  if (!screen.orientation?.lock) {
    return;
  }

  try {
    await screen.orientation.lock("portrait");
  } catch {
    // Browsers often restrict orientation lock outside fullscreen/PWA contexts.
  }
}

function handleSoundToggle() {
  if (!state.canSpeak) {
    return;
  }

  state.speechEnabled = !state.speechEnabled;

  if (!state.speechEnabled) {
    window.speechSynthesis.cancel();
  }

  renderSpeechToggle();
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
      revealWholeWord();
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
  els.newGameButton.addEventListener("click", () => startNewGame({ speak: true, speakHint: true }));
  els.repeatButton.addEventListener("click", handleRepeat);
  els.soundToggle.addEventListener("click", handleSoundToggle);
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
  tryLockPortraitOrientation();
  buildCategoryButtons();
  bindEvents();
  startNewGame({ speak: false });
  registerServiceWorker();
}

init();

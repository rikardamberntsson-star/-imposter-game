const words = {
  food: ["Pizza", "Tacos", "Köttbullar", "Sushi", "Hamburgare", "Pannkakor", "Glass", "Lasagne", "Popcorn", "Ceasarsallad"],
  places: ["Flygplats", "Strand", "Gym", "Skola", "Bio", "Sjukhus", "Hotell", "Museum", "Fotbollsarena", "Camping"],
  sports: ["Fotboll", "Tennis", "Golf", "Ishockey", "Padel", "Simning", "Skidåkning", "Basket", "Cykling", "Boxning"],
  objects: ["Mobiltelefon", "Tandborste", "Klocka", "Ryggsäck", "Solglasögon", "Nyckel", "Kaffekopp", "Högtalare", "Fjärrkontroll", "Paraply"]
};

words.mixed = [...words.food, ...words.places, ...words.sports, ...words.objects];

let game = {
  players: [],
  word: "",
  imposterIndex: null,
  currentIndex: 0
};

const screens = {
  setup: document.getElementById("setupScreen"),
  pass: document.getElementById("passScreen"),
  role: document.getElementById("roleScreen"),
  play: document.getElementById("playScreen"),
  result: document.getElementById("resultScreen")
};

const playersInput = document.getElementById("players");
const categoryInput = document.getElementById("category");
const customWordInput = document.getElementById("customWord");

const startGameBtn = document.getElementById("startGame");
const showRoleBtn = document.getElementById("showRole");
const hideRoleBtn = document.getElementById("hideRole");
const revealResultBtn = document.getElementById("revealResult");
const newRoundBtn = document.getElementById("newRound");
const backToSetupBtn = document.getElementById("backToSetup");

const passTitle = document.getElementById("passTitle");
const playerName = document.getElementById("playerName");
const roleCard = document.getElementById("roleCard");
const roleLabel = document.getElementById("roleLabel");
const secretWord = document.getElementById("secretWord");
const roleHelp = document.getElementById("roleHelp");
const imposterName = document.getElementById("imposterName");
const finalWord = document.getElementById("finalWord");

const savedPlayers = localStorage.getItem("imposter_players");
if (savedPlayers) playersInput.value = savedPlayers;

function setScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

function parsePlayers() {
  return playersInput.value
    .split("\n")
    .map(name => name.trim())
    .filter(Boolean);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function startRound(keepPlayers = false) {
  const players = keepPlayers ? game.players : parsePlayers();

  if (players.length < 3) {
    alert("Lägg till minst 3 spelare.");
    return;
  }

  localStorage.setItem("imposter_players", players.join("\n"));

  const category = categoryInput.value;
  const customWord = customWordInput.value.trim();

  game.players = players;
  game.word = customWord || randomFrom(words[category]);
  game.imposterIndex = Math.floor(Math.random() * players.length);
  game.currentIndex = 0;

  updatePassScreen();
  setScreen("pass");
}

function updatePassScreen() {
  passTitle.textContent = `Ge mobilen till ${game.players[game.currentIndex]}`;
}

function showRole() {
  const isImposter = game.currentIndex === game.imposterIndex;

  playerName.textContent = game.players[game.currentIndex];
  roleCard.className = "role-card " + (isImposter ? "imposter" : "player");

  if (isImposter) {
    roleLabel.textContent = "Du är impostor";
    secretWord.textContent = "???";
    roleHelp.textContent = "Försök beskriva utan att veta ordet. Lyssna på de andra och försök lista ut vad ordet är.";
  } else {
    roleLabel.textContent = "Ditt ord är";
    secretWord.textContent = game.word;
    roleHelp.textContent = "Kom ihåg ordet. Beskriv det lagom tydligt utan att göra det för lätt för impostern.";
  }

  setScreen("role");
}

function hideRole() {
  game.currentIndex += 1;

  if (game.currentIndex >= game.players.length) {
    setScreen("play");
    return;
  }

  updatePassScreen();
  setScreen("pass");
}

function revealResult() {
  imposterName.textContent = game.players[game.imposterIndex];
  finalWord.textContent = game.word;
  setScreen("result");
}

startGameBtn.addEventListener("click", () => startRound(false));
showRoleBtn.addEventListener("click", showRole);
hideRoleBtn.addEventListener("click", hideRole);
revealResultBtn.addEventListener("click", revealResult);
newRoundBtn.addEventListener("click", () => startRound(true));
backToSetupBtn.addEventListener("click", () => setScreen("setup"));

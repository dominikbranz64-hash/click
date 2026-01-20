let state = JSON.parse(localStorage.getItem("branz")) || {
  score: 0,
  power: 1,
  auto: 0,
  powerCost: 50,
  autoCost: 100,

  gems: 0,

  prestige: 0,
  bonus: 1,

  pClick: 0,
  pAuto: 0,

  gemClick: false,
  gemAuto: false,
  gemOffline: false,

  lastVisit: Date.now()
};

const $ = id => document.getElementById(id);

function save() {
  state.lastVisit = Date.now();
  localStorage.setItem("branz", JSON.stringify(state));
}

function render() {
  $("score").textContent = Math.floor(state.score);
  $("gems").textContent = state.gems;
  $("prestigeCount").textContent = state.prestige;
  $("powerCost").textContent = state.powerCost;
  $("autoCost").textContent = state.autoCost;
}

function clickBranz() {
  let gain = (state.power + state.pClick) * state.bonus;
  if (state.gemClick) gain *= 2;
  state.score += gain;
  save(); render();
}

function buyPower() {
  if (state.score >= state.powerCost) {
    state.score -= state.powerCost;
    state.power++;
    state.powerCost = Math.floor(state.powerCost * 1.7);
    save(); render();
  }
}

function buyAuto() {
  if (state.score >= state.autoCost) {
    state.score -= state.autoCost;
    state.auto++;
    state.autoCost = Math.floor(state.autoCost * 2);
    save(); render();
  }
}

/* PREMIUM */
function buyGemClick() {
  if (!state.gemClick && state.gems >= 10) {
    state.gems -= 10;
    state.gemClick = true;
    save(); render();
  }
}

function buyGemAuto() {
  if (!state.gemAuto && state.gems >= 15) {
    state.gems -= 15;
    state.gemAuto = true;
    save(); render();
  }
}

function buyGemOffline() {
  if (!state.gemOffline && state.gems >= 20) {
    state.gems -= 20;
    state.gemOffline = true;
    save(); render();
  }
}

/* PRESTIGE SHOP */
function buyPrestigeClick() {
  if (state.prestige >= 1) {
    state.prestige--;
    state.pClick++;
    save(); render();
  }
}

function buyPrestigeAuto() {
  if (state.prestige >= 1) {
    state.prestige--;
    state.pAuto++;
    save(); render();
  }
}

function doPrestige() {
  if (state.score < 10000) return;

  state.prestige++;
  state.bonus = 1 + state.prestige * 0.1;

  state.score = 0;
  state.power = 1;
  state.auto = 0;
  state.powerCost = 50;
  state.autoCost = 100;

  save(); render();
}

/* AUTO CLICK */
setInterval(() => {
  let gain = (state.auto + state.pAuto) * state.bonus;
  if (state.gemAuto) gain *= 2;
  state.score += gain;
  save(); render();
}, 1000);

/* OFFLINE */
(function () {
  const seconds = Math.floor((Date.now() - state.lastVisit) / 1000);
  if (seconds > 5) {
    let gain = seconds * (state.auto + state.pAuto) * state.bonus;
    if (state.gemOffline) gain *= 2;
    state.score += gain;
  }
})();

/* ADMIN */
function openAdmin() {
  if (prompt("Admin code") === "7432") {
    $("admin").classList.remove("hidden");
  }
}

function applyAdmin() {
  state.score += Number($("aScore").value || 0);
  state.gems += Number($("aGems").value || 0);
  state.prestige += Number($("aPrestige").value || 0);
  state.bonus = 1 + state.prestige * 0.1;
  save(); render();
}

function resetGame() {
  localStorage.removeItem("branz");
  location.reload();
}

render();
save();

/* =================================================================
   ONE PIECE CHESS - FINAL CONTROLLER
   ================================================================= */

// GLOBAL VARIABLES
let game = null;
let selectedSquare = null;
let currentDifficulty = "medium";
let currentBounty = parseInt(localStorage.getItem("op_chess_bounty")) || 0;
let unlockedThemes = JSON.parse(localStorage.getItem("op_chess_themes")) || [
  "default",
];
let currentTheme = localStorage.getItem("op_chess_current_theme") || "default";

const REWARDS = { easy: 30000000, medium: 100000000, hard: 500000000 };

// ASSETS MAP
const pieceImages = {
  w: {
    p: "assets/images/pieces/w_pawn.png",
    n: "assets/images/pieces/w_knight.png",
    b: "assets/images/pieces/w_bishop.png",
    r: "assets/images/pieces/w_rook.png",
    q: "assets/images/pieces/w_queen.png",
    k: "assets/images/pieces/w_king.png",
  },
  b: {
    p: "assets/images/pieces/b_pawn.png",
    n: "assets/images/pieces/b_knight.png",
    b: "assets/images/pieces/b_bishop.png",
    r: "assets/images/pieces/b_rook.png",
    q: "assets/images/pieces/b_queen.png",
    k: "assets/images/pieces/b_king.png",
  },
};
const pieceValues = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("⚓ System Initializing...");

  // 1. Verify Engine
  if (typeof Chess === "undefined") {
    alert("CRITICAL ERROR: 'js/chess-lib.js' not found or failed to load.");
    return;
  }
  game = new Chess();

  // 2. Attach Listeners Safely
  bindClick("btn-play", () => {
    switchScreen("screen-home", "screen-difficulty");
  });
  bindClick("btn-shop", () => {
    switchScreen("screen-home", "screen-shop");
    updateShopUI();
  });
  bindClick("btn-back-shop", () => {
    switchScreen("screen-shop", "screen-home");
  });
  bindClick("btn-back-menu", () => {
    switchScreen("screen-difficulty", "screen-home");
  });

  // Pause Menu
  bindClick("btn-open-menu", () =>
    document.getElementById("modal-pause").classList.remove("hidden")
  );
  bindClick("btn-resume", () =>
    document.getElementById("modal-pause").classList.add("hidden")
  );
  bindClick("btn-restart", () => {
    document.getElementById("modal-pause").classList.add("hidden");
    game.reset();
    renderBoard();
  });
  bindClick("btn-quit", () => {
    document.getElementById("modal-pause").classList.add("hidden");
    switchScreen("screen-game", "screen-home");
  });

  // Theme Default Button
  const defBtn = document.getElementById("btn-theme-default");
  if (defBtn) defBtn.onclick = () => equipTheme("default");
});

// Helper: Bind click only if element exists
function bindClick(id, action) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", action);
}

function switchScreen(fromId, toId) {
  document.getElementById(fromId).classList.add("hidden");
  document.getElementById(toId).classList.remove("hidden");
}

// --- GAME LOGIC ---
window.startGame = function (difficulty) {
  currentDifficulty = difficulty;
  switchScreen("screen-difficulty", "screen-game");

  game.reset();
  selectedSquare = null;

  updateHUD(difficulty);
  renderBoard();
  document.getElementById("player-bounty").innerText =
    formatBounty(currentBounty);
};

function updateHUD(diff) {
  const names = { easy: "BUGGY", medium: "DOFLAMINGO", hard: "KAIDO" };
  const el = document.querySelector(".game-hud .name");
  if (el) el.innerText = "VS " + names[diff];
}

function handleSquareClick(squareID) {
  if (game.game_over() || game.turn() === "b") return;

  if (!selectedSquare) {
    const piece = game.get(squareID);
    if (piece && piece.color === "w") {
      selectedSquare = squareID;
      renderBoard();
    }
    return;
  }

  const move = game.move({
    from: selectedSquare,
    to: squareID,
    promotion: "q",
  });

  if (move) {
    selectedSquare = null;
    renderBoard();
    updateStatus();
    if (!game.game_over()) setTimeout(makeAIMove, 300);
  } else {
    const piece = game.get(squareID);
    selectedSquare = piece && piece.color === "w" ? squareID : null;
    renderBoard();
  }
}

// --- RENDER ENGINE ---
function renderBoard() {
  const container = document.querySelector(".board-container");
  const boardEl = document.getElementById("chess-board");
  if (!boardEl) return;

  // Apply Theme
  container.className = "board-container";
  if (currentTheme !== "default")
    container.classList.add(`board-theme-${currentTheme}`);

  boardEl.innerHTML = "";
  const boardState = game.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
      const squareID = `${String.fromCharCode(97 + col)}${8 - row}`;
      square.dataset.id = squareID;

      const piece = boardState[row][col];
      if (piece) {
        const img = document.createElement("img");
        img.className = "piece";
        img.src = pieceImages[piece.color][piece.type];
        img.onerror = function () {
          this.style.display = "none";
        };
        square.appendChild(img);
      }

      if (selectedSquare === squareID) square.classList.add("selected");
      if (selectedSquare) {
        const moves = game.moves({ square: selectedSquare, verbose: true });
        if (moves.find((m) => m.to === squareID))
          square.classList.add("legal-move");
      }

      square.onclick = () => handleSquareClick(squareID);
      boardEl.appendChild(square);
    }
  }
}

// --- AI & STATUS ---
function makeAIMove() {
  if (game.game_over()) return;
  let bestMove;
  if (currentDifficulty === "easy") {
    const moves = game.moves();
    bestMove = moves[Math.floor(Math.random() * moves.length)];
  } else {
    bestMove = getBestMove(currentDifficulty === "medium" ? 2 : 3);
  }
  game.move(bestMove);
  renderBoard();
  updateStatus();
}

function getBestMove(depth) {
  const moves = game.moves();
  let bestMove = null;
  let bestValue = -9999;
  moves.sort(() => Math.random() - 0.5);

  for (let i = 0; i < moves.length; i++) {
    game.move(moves[i]);
    let val = -minimax(depth - 1, -10000, 10000, false);
    game.undo();
    if (val > bestValue) {
      bestValue = val;
      bestMove = moves[i];
    }
  }
  return bestMove || moves[0];
}

function minimax(depth, alpha, beta, isMax) {
  if (depth === 0 || game.game_over()) return evaluateBoard();
  const moves = game.moves();
  if (isMax) {
    let maxEval = -9999;
    for (let i = 0; i < moves.length; i++) {
      game.move(moves[i]);
      let eval = minimax(depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = 9999;
    for (let i = 0; i < moves.length; i++) {
      game.move(moves[i]);
      let eval = minimax(depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateBoard() {
  let total = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const val = pieceValues[p.type];
        if (p.color === "b") total += val;
        else total -= val;
      }
    }
  }
  return total;
}

function updateStatus() {
  if (game.game_over()) {
    let msg = "Stalemate";
    if (game.in_checkmate()) {
      if (game.turn() === "b") {
        const reward = REWARDS[currentDifficulty];
        msg = `VICTORY! +฿${formatBounty(reward)}`;
        currentBounty += reward;
        localStorage.setItem("op_chess_bounty", currentBounty);
      } else {
        msg = "DEFEAT.";
      }
    }
    document.getElementById("player-bounty").innerText =
      formatBounty(currentBounty);
    setTimeout(() => alert(msg), 500);
  }
}

// --- SHOP ---
function updateShopUI() {
  document.getElementById("shop-bounty-display").innerText =
    formatBounty(currentBounty);
  updateItemBtn("default", 0);
  updateItemBtn("wano", 100000000);
  updateItemBtn("marineford", 500000000);
}

function updateItemBtn(themeId, cost) {
  let btn;
  if (themeId === "default") btn = document.getElementById("btn-theme-default");
  else btn = document.getElementById(`item-${themeId}`).querySelector("button");

  if (unlockedThemes.includes(themeId)) {
    btn.innerText = currentTheme === themeId ? "EQUIPPED" : "SELECT";
    btn.style.opacity = currentTheme === themeId ? "0.5" : "1";
    btn.onclick = currentTheme === themeId ? null : () => equipTheme(themeId);
  } else {
    btn.innerText = "UNLOCK";
    btn.onclick = () => buyTheme(themeId, cost);
  }
}

window.buyTheme = function (themeId, cost) {
  if (currentBounty >= cost) {
    currentBounty -= cost;
    unlockedThemes.push(themeId);
    localStorage.setItem("op_chess_bounty", currentBounty);
    localStorage.setItem("op_chess_themes", JSON.stringify(unlockedThemes));
    equipTheme(themeId);
  } else alert("Insufficient Bounty!");
};

window.equipTheme = function (themeId) {
  currentTheme = themeId;
  localStorage.setItem("op_chess_current_theme", currentTheme);
  updateShopUI();
};

function formatBounty(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

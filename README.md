# 🏴‍☠️ One Piece Concept Chess: Grand Line Battle (Trial 1)

> **"The goal is to reach a Nash Equilibrium where everything is carried out objectively in the best possible way... leaving space for more to be done."**

## 📖 Project Overview
This project is a centralized **One Piece-themed Chess Game** that aims to do more than just swap sprites. The goal is to capture the core spirit, adventure, and complexity of the *One Piece* universe within the strict strategic bounds of Chess.

We are utilizing Generative AI (Gemini) as a coding partner to accelerate development, ensuring we reach a playable state without getting bogged down in "fluff."

**Current Status (Nov 2025):** The game is fully playable offline with a persistent economy, AI opponents, and a thematic visual overhaul.

---

## 🧭 Core Philosophy
This project is built on three pillars:

### 1. The Nash Equilibrium Approach (Sustainability)
To prevent creator burnout—a common killer of ambitious fan projects—we are intentionally leaving parts of the project "incomplete" or modular. We provide a robust core engine, leaving clear "Expansion Slots" (e.g., specific Devil Fruit mechanics, new crews) for future collaboration.

### 2. Strategic Dexterity
We aim to elevate the strategic demand beyond traditional chess. While the current version respects standard FIDE rules, the roadmap includes integrating "Bounty" and "Haki" systems that require resource management and foresight.

### 3. The Golden Rule
**ALL STRAW HATS MUST BE INCLUDED.** (Yes, even Vivi). If the crew is not integrated, there is no One Piece.

---

## 🛠 How Are We Doing This? (Technical Execution)
This project was built using a rapid **Feasibility & Strategy Assessment** workflow. We moved from concept to deployment by stripping away complexity and focusing on "Leverage."

**The Development Roadmap (Executed Steps):**

1.  **The Feasibility Audit:** We rejected the initial idea of using an LLM API for the game engine (too slow/expensive). instead, we implemented a local **Minimax Algorithm** and `chess.js` for instant, zero-cost logic.
2.  **The "Nuclear" UI Fix:** We utilized CSS Grid and `vmin` units to force a strict **1:1 Aspect Ratio** board that resists "squashing" on any screen size, solving the layout engine conflicts.
3.  **Asset Logic:** We transitioned from text-based emojis (`♟`) to a "Caged Image" system, allowing high-fidelity `.png` character assets to scale perfectly within the squares without breaking the grid.
4.  **The Persistent Economy:** We implemented `localStorage` to create a "Bounty System." Wins against higher difficulty AI (Buggy -> Doflamingo -> Kaido) award Berries, which persist across browser sessions.
5.  **The Offline Architecture:** We flattened the file structure (removing sub-folders) and downloaded external libraries locally. This ensures the game runs 100% offline with zero external dependencies or CDN errors.

---

## 🧩 Features
* **Single Player AI:** Three distinct difficulty personalities:
    * *East Blue (Easy):* Makes random mistakes (Buggy).
    * *Grand Line (Medium):* Looks 2 moves ahead (Doflamingo).
    * *New World (Hard):* Aggressive, 3-move depth (Kaido).
* **Log Pose Shop:** Spend your hard-earned Bounty to unlock new board themes (Wano Kuni, Marineford).
* **Visuals:** Custom "Parchment" UI, wood textures, and pirate typography.
* **Zero-Server:** Runs entirely in the browser.

---

## 📊 Competitive Analysis
We are positioning this project in the gap between "Aesthetic Skins" and "Over-Complex RPGs."

| Type | Description | Flaw |
| :--- | :--- | :--- |
| **Aesthetic Substitution** | Standard commercial sets (e.g., Luffy as King). | **No Depth.** It's just chess with a skin. |
| **RPG Hybrids** | Fan games with stats, massive maps, and dice. | **Burnout.** Too complex to finish or balance. |
| **Grand Line Battle** | **Deep Mechanical Integration.** Standard chess rules enriched by asymmetry and resource management. | **The Goal.** Balanced asymmetry. |

---

## 🚀 How to Play (Offline)
Since this project uses a **Flat File Structure**, no installation is required.

1.  Download the repository.
2.  Ensure `index.html`, `app.js`, and `chess-lib.js` are in the same folder.
3.  Open `index.html` in any web browser.
4.  **Set Sail!**

---

## 📜 Disclaimer
*One Piece* is the property of Eiichiro Oda, Shueisha, and Toei Animation. This is a non-profit fan project for educational and portfolio purposes only. No monetization is involved.

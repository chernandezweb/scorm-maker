# 🚀 SCORM Maker: AI-Powered Code-First E-Learning Framework

> **A modern, Git-versionable, AI-driven alternative to Articulate Storyline 360**  
> Designed for instructional designers, integrators, and developers working with **VS Code & GitHub Copilot Agent Mode**, with native **SCORM 2004 4th Edition** tracking.

---

## 🌟 Why This Exists (Storyline vs. SCORM Maker)

| Pain Point in Articulate Storyline | SCORM Maker Solution |
| :--- | :--- |
| **Proprietary binary files (`.story`)** that cannot be versioned, diffed, or collaborated on in Git | **100% text-based components** (`.tsx`, `.json`, `.md`), full Git versioning & instant diffing |
| **Heavy export bloat** (30MB – 80MB per module) | **Ultra-lightweight builds** (~100 KB total zip payload), lightning-fast loading |
| **Fragile triggers & variable corruption** in complex gamification | **Robust state engine** with TypeScript safety and 64,000-character `cmi.suspend_data` |
| **Days spent copy-pasting Word storyboards** slide by slide | **Copilot Agent Mode** scaffolds 80% of a course from a storyboard in minutes |
| **Manual voiceover imports & timeline scrubbing** | **ElevenLabs API & auto-cue alignment** directly from in-slide scripts |
| **SharePoint / OneDrive sync conflicts** | **Decoupled architecture** keeping course assets clean and free of `node_modules` bloat |

---

## 🎯 Key Architectural Pillars

### 1. 16:9 Responsive Stage (Storyline Look & Feel)
- Fixed aspect-ratio virtual canvas ($1920 \times 1080$) that dynamically scales with pillarboxing/letterboxing.
- Pixel-identical positioning across any monitor, tablet, or browser viewport.
- Full player chrome: Course title, Slide progress ticker, Prev/Next navigation, Audio timeline, and Slide Table of Contents.

### 2. SCORM 2004 4th Edition Native Engine
- Automatically searches window hierarchy for host LMS `API_1484_11`.
- **Built-in Mock LMS Debugger:** When running in local preview outside an LMS, an authentic in-memory LMS simulator activates with an on-screen debug drawer (`cmi.completion_status`, `cmi.success_status`, `cmi.score.raw`, `cmi.suspend_data` JSON tree, and live call logs).
- Full interaction recording for quizzes (`cmi.interactions.n.*`) with latency and learner responses.

### 3. Visual Tweak Mode (The "Nudge Inspector")
Integrators do **not** need to prompt AI or edit code for tiny visual adjustments:
- Click **"Tweak Mode"** in the top player bar.
- Use on-screen sliders or arrow keys to nudge X/Y coordinates, scale, and opacity.
- Toggle the 12-column alignment grid.
- Click **"Copy JSX Props"** to paste values directly into `<Character x={35} y={42} scale={1.1} />`.

### 4. Rich Interactive Component Library
- **`<Character>`**: Illustrated vector avatars (Alex, Marcus, Sarah) with expressive poses (`neutral`, `explaining`, `warning`, `celebrating`, `thinking`) and animated speech bubbles.
- **`<Quiz>`**: SCORM 2004 certified assessment questions with instant feedback, point stacking, and celebratory confetti.
- **`<SoftwareSim>`**: Interactive corporate Webmail client mockup with clickable red flag hotspots and threat reporting.
- **`<DiceGame>`**: Interactive 3D/animated dice board game challenge with a moving player pawn, checkpoint bonuses, and state bookmarking.
- **`<AudioNarration>`**: Voiceover controller with Web Speech preview fallback, audio element support, and navigation locking until audio finishes.

### 5. AI Ingestion & Copilot Agent Mode
- Guided by `.github/copilot-instructions.md`.
- Integrators drop `storyboard.docx` or `sample-storyboard.md` into the workspace and prompt Copilot Agent:
  > *"Scaffold Module 1 slides from `storyboards/sample-storyboard.md` using the standard component library."*

---

## 📂 Project Structure

```
scorm-maker/
├── .github/
│   └── copilot-instructions.md   # Guidelines & component catalog for Copilot Agent
├── .vscode/
│   ├── tasks.json                # 1-Click tasks (Preview, Export SCORM, Audio Gen)
│   └── settings.json
├── course/                       # PURE COURSE CONTENT LAYER (SharePoint-safe)
│   ├── course.json               # Course title, passing score, theme tokens
│   ├── slides/                   # Slide declarations
│   │   ├── slide-01-welcome.tsx
│   │   ├── slide-02-phishing-sim.tsx
│   │   ├── slide-03-branching.tsx
│   │   ├── slide-04-dice-game.tsx
│   │   └── slide-05-knowledge-check.tsx
│   └── assets/                   # Media, audio narrations, and images
├── storyboards/
│   └── sample-storyboard.md      # Example strategist storyboard specification
├── scripts/
│   ├── package-scorm.js          # SCORM 2004 4th Edition imsmanifest.xml & zip builder
│   └── generate-audio.js         # ElevenLabs speech generation & cue alignment script
├── src/
│   ├── engine/                   # Core runtime (SCORM wrapper, Player Stage, Inspector)
│   ├── components/               # Slide visual components (Quiz, Sim, Game, Character)
│   ├── App.tsx                   # Main player shell
│   └── main.tsx
└── exports/                      # Ready-to-upload SCORM 2004 .zip packages
```

---

## ⚡ Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Live Preview (with Hot Reload)
```bash
npm run dev
```
*(Or in VS Code, press `Ctrl+Shift+B` or run the task **"▶️ Run Course Live Preview"**).*

Open your browser at `http://localhost:5173`. You can immediately:
- Navigate slides with the Storyline-like bottom bar.
- Test the interactive Outlook phishing simulation.
- Play the Cyber Trail dice game.
- Open **Tweak Mode** to nudge elements visually.
- Open the **LMS Inspector** to see real-time SCORM 2004 data model calls.

### 3. Generate Audio Narrations (ElevenLabs)
```bash
# Preview mode (Web Speech API is used automatically in browser)
npm run generate-audio

# Or with ElevenLabs API key for studio voices:
$env:ELEVENLABS_API_KEY="your-key"; npm run generate-audio
```

### 4. Export SCORM 2004 4th Edition Package
```bash
npm run package
```
*(Or run the VS Code task **"📦 Export SCORM 2004 4th Edition Zip"**).*

This compiles the static bundle, templates standard `imsmanifest.xml`, and outputs:
```
exports/Cybersecurity_Foundations__Phishing___Defense_v1.0.0_SCORM2004_4thEd.zip
```
Upload this zip directly to **SCORM Cloud** or your corporate LMS.

---

## 🖥️ Zero-Terminal Integrator Experience

Integrators do **not** need to open a terminal or run npm commands:
1. **Double-Click `Launch-SCORM-Studio.cmd`**:
   - Silently starts the local preview in the background.
   - Opens VS Code in the course directory.
   - Opens the 16:9 stage in **Desktop App Mode** (Edge/Chrome app window with zero URL bars or browser tabs).
2. **1-Click Packaging**: Click the green **`[ 📦 Export SCORM ]`** button directly in the stage header to build and save `.zip` packages to `exports/`.

---

## 🔄 How Integrators Update the Engine

When developers push improvements, new components, or SCORM tweaks to GitHub, integrators can update with zero terminal commands:
- **Method A (Automatic on launch):** `Launch-SCORM-Studio.cmd` silently syncs upstream engine updates every time it opens.
- **Method B (In-Browser):** When developers push an update, an **`[ 🔄 Update Engine ]`** button appears in the top header. Clicking it pulls updates and reloads the stage.
- **Method C (Double-click assistant):** Double-click **`Update-Engine.cmd`** in the root directory to run the visual updater.

*Note: All engine updates are strictly separated from `course/`, guaranteeing that existing slides, quizzes, and assets are 100% safe from merge conflicts.*

---

## 🛡️ SharePoint & OneDrive Integration Strategy

To keep SharePoint sync instant and prevent file corruption:
1. **Never commit `node_modules` to SharePoint.**
2. The `course/` folder contains only pure TypeScript/JSX definitions, JSON config, and media.
3. The engine runtime builds cache into temporary memory, ensuring seamless team collaboration without file lock conflicts.

---

## 📜 License
MIT

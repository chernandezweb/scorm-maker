# 🧠 SCORM Maker: Architectural Blueprint & Project Handover Context

> **Date:** October 2026  
> **Repository:** `https://github.com/chernandezweb/scorm-maker.git`  
> **Branch:** `main`  
> **Author & Lead:** Carlos Hernandez  
> **Purpose:** Comprehensive handover document to continue developing the framework on your work machine using VS Code, GitHub Copilot Agent Mode, and advanced LLMs.

---

## 1. Executive Summary & Problem Space

### The Core Opportunity
At our company, instructional design teams currently use **Articulate Storyline 360** to author e-learning courses, while developers maintain the LMS platform that hosts those SCORM packages. 

While instructional designers like Storyline's visual canvas, it creates massive organizational bottlenecks:
1. **Proprietary Binary Files (`.story`):** Cannot be version-controlled, diffed, or collaborated on via Git.
2. **SharePoint / OneDrive Sync Conflicts:** Huge binary files frequently corrupt or produce synchronization conflicts.
3. **Bloated SCORM Packages:** Storyline exports routinely weigh 30MB to 80MB per module.
4. **Tedious Manual Work:** Integrators spend days manually copying/pasting scripts and quiz questions from Word storyboards into Storyline forms, downloading ElevenLabs audio files, and manually scrubbing timelines to set cue markers.
5. **Fragile Gamification:** Storyline's triggers and variables are notoriously brittle and prone to state corruption in complex games.

### The Solution: "SCORM Maker"
A **pure code/AI framework** where courses are written in declarative TypeScript/React components, accelerated by **VS Code GitHub Copilot Agent Mode**, with **native SCORM 2004 4th Edition compliance**, an **in-browser 16:9 stage**, and **zero-terminal operations** designed specifically for non-coder integrators.

---

## 2. Key Personas & Operational Constraints

| Persona | Current Reality & Pain Points | Framework Requirement |
| :--- | :--- | :--- |
| **E-Learning Integrator** | Non-coders. Terrified of terminal commands, Git merge conflicts, and NPM errors. Accustomed to double-clicking an icon and seeing a visual window. | **Zero terminal needed.** Double-click `.cmd` launcher in Edge App Mode (no address bar). 1-click in-browser SCORM export button. Visual "Tweak Mode" to nudge elements with arrow keys. |
| **Instructional Strategist** | Writes course requirements in Word/Markdown storyboards with slide descriptions, narration scripts, and quiz specs. | **Copilot Storyboard Intake:** Agent parses storyboard files and scaffolds 80% of the slide code in minutes. |
| **LMS Administrator / Dev** | Manages the LMS platform. Needs rock-solid SCORM 2004 4th Edition reporting (`cmi.interactions`, 64k `cmi.suspend_data`, dual completion/success statuses). | **Standards-compliant engine:** Automatic interaction logging, session bookmarking, and sub-1MB zip packages. |
| **Enterprise IT / SharePoint** | Teams sync course source folders via OneDrive / SharePoint. | **Decoupled architecture:** The `course/` folder contains pure content. **Zero `node_modules` in SharePoint.** |

---

## 3. Architecture & What Has Been Built (Prototype State)

### A. The 16:9 Responsive Stage
- **File:** `src/engine/player/Stage.tsx`
- Emulates Storyline’s fixed-aspect-ratio virtual stage ($1920 \times 1080$).
- Auto-scales with responsive letterboxing/pillarboxing. Guarantees pixel-identical rendering on laptops, ultrawides, and mobile displays.
- Full player chrome: Header with course title & XP score counter, slide drawer menu, and bottom navigation bar with audio timeline scrubber.

### B. SCORM 2004 4th Edition Engine & Built-in Mock LMS
- **Files:** `src/engine/scorm/scorm2004.ts`, `src/engine/scorm/mockLms.ts`, `src/engine/player/LmsDebugger.tsx`
- Auto-connects to host LMS `API_1484_11`.
- **In-Browser LMS Inspector:** An on-screen drawer displaying `cmi.completion_status`, `cmi.success_status`, `cmi.score.raw`, and the live JSON tree inside `cmi.suspend_data` (64,000 char capacity).
- Real-time logging of all `SetValue`, `GetValue`, and `Commit` operations for instant local testing without SCORM Cloud.

### C. Zero-Terminal Integrator Experience
- **`Launch-SCORM-Studio.cmd`:** Double-clickable Windows launcher that boots the local server silently, opens VS Code, and opens the preview in **Microsoft Edge App Mode** (`--app=http://localhost:5173/`). Looks and feels 100% like a standalone native software.
- **In-Browser 1-Click Export:** Green `[ 📦 Export SCORM ]` button in the top header. Bundles the production build, templates standard `imsmanifest.xml`, and outputs a ready-to-upload zip directly to `exports/` (~107 KB).
- **VS Code Auto-Task:** `.vscode/tasks.json` configured with `"runOn": "folderOpen"` to boot the server automatically on folder load.

### D. Native Windows Folder Picker & Recent Courses Switcher
- **Files:** `src/engine/player/PlayerHeader.tsx`, `vite.config.ts` (`/api/browse-project`)
- Integrators click `[ 📂 Open Course... ]` in the studio header $\rightarrow$ native Windows `FolderBrowserDialog` opens $\rightarrow$ they navigate their local OneDrive/SharePoint synced directory to open or switch between course projects.
- Recent projects dropdown preserves history in `.recent-projects.json`.

### E. Visual Tweak Mode (The "Nudge Inspector")
- **File:** `src/engine/inspector/TweakOverlay.tsx`
- Allows integrators to visually nudge elements using arrow keys or on-screen sliders ($X\%$, $Y\%$, scale, opacity) without writing code or prompting AI.
- Includes a 12-column alignment grid toggle and a **"Copy JSX Props"** button (`x={35} y={42} scale={1.1}`).

### F. Interactive Component Catalog
- **`<Slide>`:** Base slide wrapper with lighting and layout variants.
- **`<Character>`:** Illustrated vector avatar with poses (`neutral`, `explaining`, `warning`, `celebrating`, `thinking`) and animated speech bubbles.
- **`<Quiz>`:** SCORM 2004 assessment questions with instant feedback, XP rewards, and confetti explosion (`canvas-confetti`).
- **`<SoftwareSim>`:** Interactive corporate Webmail client simulation with clickable red-flag hotspots and threat reporting.
- **`<DiceGame>`:** 3D animated dice board game gamification with 8 checkpoint tiles, moving player token, and state bookmarking.
- **`<AudioNarration>`:** Voiceover controller with Web Speech API preview fallback, audio element support, and navigation locking until narration ends.

### G. ElevenLabs & Auto-Cue Pipeline
- **File:** `scripts/generate-audio.js`
- Extracts slide narration scripts and interfaces with ElevenLabs API.
- Generates speech audio files and word/character timestamp alignments (`slide-XX-cues.json`), allowing UI elements to automatically appear when specific words are spoken.

### H. Engine Update & Longevity System
- **File:** `Update-Engine.cmd`, `src/engine/player/PlayerHeader.tsx` (`/api/check-update`, `/api/update-engine`)
- Developers push updates to `src/engine/` or `src/components/`.
- Integrators receive updates via:
  1. Automatic silent sync when launching `Launch-SCORM-Studio.cmd`.
  2. In-browser `[ 🔄 Update Engine ]` button in the header.
  3. Double-clicking `Update-Engine.cmd`.
- Content in `course/` is isolated from engine files, preventing merge conflicts.

---

## 4. Current File Tree

```
scorm-maker/
├── .github/
│   └── copilot-instructions.md       # Copilot Agent mode guidelines & component schema
├── .vscode/
│   ├── tasks.json                    # 1-Click tasks with folderOpen auto-run
│   └── settings.json
├── course/                           # 📂 PURE COURSE CONTENT LAYER (SharePoint safe)
│   ├── course.json                   # Metadata, passing score, theme tokens
│   ├── slides/                       # The 5 demo slides (Welcome, Sim, Branch, Game, Quiz)
│   └── assets/                       # Audio narrations, cues, images
├── storyboards/
│   └── sample-storyboard.md          # Example input specification from learning strategist
├── scripts/
│   ├── package-scorm.js              # SCORM 2004 4th Edition imsmanifest.xml & zip packager
│   └── generate-audio.js             # ElevenLabs speech generation & cue alignment script
├── src/
│   ├── engine/                       # SCORM wrapper, Mock LMS, Stage, Player, Tweak Overlay
│   ├── components/                   # Character, Quiz, SoftwareSim, DiceGame, AudioNarration
│   ├── App.tsx                       # Player Shell
│   └── main.tsx
├── Launch-SCORM-Studio.cmd           # Standalone Desktop App Launcher
├── Update-Engine.cmd                 # 1-Click Engine Updater Assistant
└── exports/
    └── ..._SCORM2004_4thEd.zip        # Packaged SCORM 2004 4th Edition package (~107 KB)
```

---

## 5. Roadmap & Next Steps for Tomorrow

When you clone and open this repository on your work computer tomorrow with Copilot (Claude Opus / GPT-4o / Astra), here are high-impact areas to expand:

### 1. Storyboard Auto-Ingestion Command (Copilot Agent Skill)
- Implement a custom slash command or Node script (`scripts/import-storyboard.js` or Copilot Agent prompt) that directly parses `.docx` tables (using `mammoth` or `officeparser`) and outputs the slide `.tsx` files automatically.

### 2. Transparent WebM AI Video Presenters
- Build an `<AvatarVideo>` component that supports transparent WebM/ProRes video (e.g. AI-generated talking-head videos from HeyGen or ElevenLabs) floating seamlessly over slides without rectangular green-screen boxes.

### 3. Lottie / After Effects Animation Component
- Add `@lottielab/lottie-player` or `lottie-react` so integrators can drop crisp 60fps vector animations from Envato / After Effects into `course/assets/lottie/` with `<Lottie src="assets/lottie/shield.json" />`.

### 4. Course Branching Scenario Graph
- Create a reusable `<BranchingScenario>` component that manages multi-scene dialogue trees (NPC conversations, customer support training) with trust meters and consequence paths.

### 5. PDF Certificate Generation
- Add a 1-click "Download Certificate of Completion" button on the final slide that generates a customized corporate certificate PDF using `jspdf` or `html2canvas`.

---

## 6. How to Start on Your Work Computer Tomorrow

```bash
# 1. Clone the repository
git clone https://github.com/chernandezweb/scorm-maker.git
cd scorm-maker

# 2. Launch the Studio (or double-click Launch-SCORM-Studio.cmd)
npm install
npm run dev
```

*All instructions, schemas, and prompts are baked into `.github/copilot-instructions.md` so Copilot Agent on your work machine will immediately understand the framework.*

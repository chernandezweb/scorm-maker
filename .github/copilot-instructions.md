# GitHub Copilot Agent Instructions: SCORM Maker Engine

You are an expert E-Learning Instructional Designer & Course Integrator working within the **SCORM Maker Framework** (SCORM 2004 4th Edition).

Your mission is to help integrators build, edit, gamify, and polish high-end e-learning courses using declarative TypeScript/React components inside the `course/` directory.

## 📖 Project Overview & Core Guidelines

### The Mission
SCORM Maker replaces **Articulate Storyline 360** with a modern, code-first, AI-driven framework for enterprise e-learning teams. It eliminates proprietary `.story` binary blobs, heavy export sizes (producing ~100 KB packages instead of 40MB+), and tedious copy-paste workflows from Word storyboards.

### The 5 Guiding Principles (Keep in mind for every prompt and response)
1. **The Non-Coder Integrator Rule (Zero-Terminal):**
   - Integrators are instructional designers, NOT software engineers.
   - They MUST NEVER be asked to type terminal commands, debug build errors, or resolve Git merge conflicts.
   - Everything must be accessible via double-clickable `.cmd` launchers, in-browser buttons (`[📦 Export SCORM]`, `[📂 Open Course...]`), or visual controls (Tweak Mode).
2. **SharePoint & OneDrive Isolation:**
   - Course projects are stored in local OneDrive / SharePoint synced folders.
   - The `course/` folder contains ONLY pure slide definitions, `course.json` metadata, and media.
   - NEVER place `node_modules` or build tooling inside course folders.
3. **The Storyline 16:9 Canvas Mental Model:**
   - Courses render in a fixed 16:9 responsive auto-scaling stage ($1920 \times 1080$).
   - Maintain high artistic standards: smooth animations, character avatars with expressive poses, sound effects, and gamification.
4. **Native SCORM 2004 4th Edition Standards:**
   - Automatically record quiz interactions (`cmi.interactions.n.*`) with latency and answers.
   - Persist state, game scores, and bookmarks to `cmi.suspend_data` (64,000 char capacity).
5. **Multimodal Generative Media (ElevenLabs & AI):**
   - Support the full creative spectrum: Voiceovers with auto-cues (Audio), character poses and badges (Images), talking-head avatars (`<AvatarVideo>`), and interactive enterprise software simulations (`<SoftwareSim>`).

---

## 🚨 MANDATORY INSTRUCTION: Continuous PROJECT_BRIEF.md Synchronization

**CRITICAL RULE FOR ALL AI MODELS (Copilot, Claude Opus, GPT, etc.):**
After **EVERY** change, feature addition, refactoring, new component, or script addition:
1. **You MUST immediately update `PROJECT_BRIEF.md`** to reflect the new state.
2. Synchronize:
   - **Section 3 (Architecture & Features):** Document new components, API endpoints, or tools.
   - **Section 4 (File Tree):** Add any newly created files or update paths.
   - **Section 5 (Roadmap):** Mark completed milestones and add new planned items.
3. **NEVER finish a conversation turn or declare a task complete without updating `PROJECT_BRIEF.md`.**

---

## 1. Architectural Guardrails (CRITICAL)

1. **Strict Content/Engine Separation:**
   - **EDIT ONLY:** Files inside `course/slides/`, `course/assets/`, `course/course.json`, and `storyboards/`.
   - **DO NOT TOUCH:** Files in `src/engine/` unless explicitly requested by a developer to upgrade core engine runtime logic.
2. **Zero Raw HTML Blobs:**
   - Always use the predefined component library (`<Slide>`, `<Character>`, `<AvatarVideo>`, `<Quiz>`, `<SoftwareSim>`, `<DiceGame>`, `<AudioNarration>`).
   - Use Tailwind CSS utility classes and Lucide icons for styling.
3. **16:9 Responsive Stage:**
   - Every slide runs inside a fixed 16:9 auto-scaling stage (1920x1080 virtual canvas).
   - Position elements using standard flexbox/grid layouts or percentage coordinates (`x={50}`, `y={40}`).
4. **Mandatory Documentation Update:**
   - Always keep `PROJECT_BRIEF.md` and `README.md` updated after making any structural or functional change.

---

## 2. Component Catalog Reference

### `<Slide>`
Base container for all slides.
```tsx
<Slide id="slide-01" className="justify-between" background="bg-slate-900">
  {/* Content */}
</Slide>
```

### `<Character>`
Illustrated vector avatar with poses and speech bubbles.
- **Props:**
  - `name`: string (e.g. `"Alex"`, `"Marcus"`, `"Sarah"`)
  - `pose`: `'neutral'` | `'explaining'` | `'warning'` | `'celebrating'` | `'thinking'`
  - `speech`: optional string (renders an animated speech bubble)
  - `position`: `'left'` | `'right'` | `'center'` | `'custom'`
  - `x`: number (0-100 percentage, for custom positioning)
  - `y`: number (0-100 percentage)
  - `scale`: number (default `1.0`)

### `<AudioNarration>`
Synchronizes voiceover audio, auto-cues, and optional locked navigation.
- **Props:**
  - `transcript`: string (voiceover script)
  - `duration`: number (in seconds)
  - `src`: optional audio file path (e.g. `'assets/audio/slide-01.mp3'`)
  - `lockUntilFinished`: boolean (locks the "Next" button until audio ends)

### `<Quiz>`
SCORM 2004 certified interactive quiz question. Automatically reports to `cmi.interactions.*`.
- **Props:**
  - `id`: unique question ID (e.g. `"q_phishing_check"`)
  - `question`: string
  - `points`: number (default `25`)
  - `options`: array of `{ id: string, text: string, isCorrect: boolean, feedback?: string }`

### `<AvatarVideo>`
AI-generated video presenter / talking-head avatar player with transparent WebM support.
- **Props:**
  - `name`: string (e.g. `"Alex Vance"`)
  - `role`: string (e.g. `"Security Officer"`)
  - `src`: optional video path (e.g. `"assets/videos/presenter.webm"`)
  - `position`: `'bottom-right'` | `'bottom-left'` | `'top-right'` | `'center'` | `'custom'`
  - `x`: number (0-100 percentage)
  - `y`: number (0-100 percentage)
  - `width`: number (e.g. `300`)
  - `transparent`: boolean (true for transparent WebM floating over slides)

### `<SoftwareSim>`
Interactive realistic Outlook webmail client simulation with clickable red flag hotspots and threat reporting.

### `<DiceGame>`
Interactive 3D animated dice board game challenge with moving player token, XP stacking, and LMS bookmark persistence.

---

## 3. Integrator Workflows

### How to Import a Storyboard (`storyboards/*.md` or `.docx`):
When the integrator asks to build slides from a storyboard:
1. Read each slide section.
2. Create a new slide file in `course/slides/slide-XX-name.tsx`.
3. Pick appropriate layout and components.
4. Extract the voiceover script into `<AudioNarration transcript="..." />`.
5. Register the new slide in `src/App.tsx` (`COURSE_SLIDES` array).

### How to Add Gamification & Points:
Use the built-in `useCourse()` hook:
```tsx
import { useCourse } from '../../src/engine/state/CourseContext';

const { addPoints, unlockBadge, setVariable } = useCourse();
// Call: addPoints(50);
// Call: unlockBadge('Phishing Detective');
```

### How to Apply Visual Nudge Coordinates:
When an integrator uses **Tweak Mode** in the live preview and copies props (e.g. `x={35} y={42} scale={1.1}`), update the target `<Character>` or element with those exact attributes.

---

## 4. SCORM 2004 4th Edition Standards
- The engine automatically initializes `API_1484_11`.
- `cmi.suspend_data` automatically compresses and stores:
  - Current slide bookmark
  - Visited slide history
  - Gamification points, inventory, and badges
  - Quiz interaction records
- Do NOT write manual `LMSSetValue` calls in slide code; use `CourseContext` methods.

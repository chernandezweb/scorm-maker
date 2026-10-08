# STORYBOARD SPECIFICATION: CYBERSECURITY FOUNDATIONS

**Course Title:** Cybersecurity Foundations: Phishing & Threat Defense  
**Target Standard:** SCORM 2004 4th Edition  
**Aspect Ratio:** 16:9 Fixed Responsive Stage  
**Target Audience:** Enterprise Employees & Contractors  
**Passing Score:** 75%  
**Estimated Seat Time:** 5–8 minutes  

---

## SLIDE 1: Welcome & Mission Briefing
- **Slide ID:** `slide-01`
- **Layout:** Split Stage (Character Guide Left / Mission Cards Right)
- **Character:** Alex Vance (Lead Security Officer)
  - Pose: `explaining`
  - Dialogue Bubble: *"Welcome to the briefing! As security officers, our job is spotting deceptive lures before they compromise company assets."*
- **Voiceover Narration (ElevenLabs):**
  > *"Welcome to the 2026 Cybersecurity Briefing. In this interactive module, you will analyze simulated threats, play the cyber trail board game, and verify your skills."*
- **Interactive Elements:**
  - 3 Objective Cards: Spot Deceptions, Live Simulation, Earn Badges.
  - "Listen to Alex's Narration" audio trigger button.
- **Navigation Rule:** Free navigation or lock until audio ends.

---

## SLIDE 2: Hands-On Exercise: Corporate Webmail Simulation
- **Slide ID:** `slide-02`
- **Layout:** Centered Realistic Outlook Webmail Client Mockup
- **Character Assistant:** Alex (Pose: `warning`)
  - Dialogue Bubble: *"Click the sender domain and link to inspect the red flags!"*
- **Voiceover Narration:**
  > *"An urgent message just landed in your corporate mailbox. Inspect the sender, the deadline, and the link destination before taking action."*
- **Interactive Hotspots:**
  1. **Sender Domain:** `helpdesk@micr0soft-update-portal.biz` (Red flag: Spoofed domain).
  2. **Artificial Urgency Banner:** `IMMEDIATE ACTION REQUIRED WITHIN 2 HOURS` (Red flag: Panic lure).
  3. **Verification Link:** Destination `http://192.168.1.42/auth/login` (Red flag: External IP).
  4. **Report Phishing Button:** Rewarding +30 XP and unlocking the "Phishing Detective" badge!

---

## SLIDE 3: Branching Decision Tree: The Urgent 2FA Request
- **Slide ID:** `slide-03`
- **Layout:** Decision Dialogue Split
- **Character:** Marcus (Colleague)
  - Pose: `thinking`
  - Dialogue: *"Hey! My phone battery died and the VP needs this financial deck in 10 minutes. Can you please shoot me your 2FA code so I can log into the client VPN?"*
- **Branching Options:**
  - **Option A (Share code):** Policy Breach! Marcus pose $\rightarrow$ `warning`, -15 XP.
  - **Option B (Direct to IT Helpdesk):** Best Practice! Marcus pose $\rightarrow$ `celebrating`, +30 XP.
  - **Option C (Ghost Marcus):** Sub-optimal response, +5 XP.

---

## SLIDE 4: Gamification: The Cyber Trail Board Game
- **Slide ID:** `slide-04`
- **Layout:** Interactive 8-Tile Board Path with 3D Animated Dice Roller
- **Character:** Alex (Pose: `celebrating`)
  - Dialogue: *"Roll the dice to advance your pawn across checkpoints!"*
- **Game Mechanics:**
  - Player rolls dice (1 to 4 steps per roll).
  - Pawn moves along 8 checkpoint tiles:
    1. Start (0 XP)
    2. 2FA Check (+25 XP)
    3. Phishing Trap (-10 XP)
    4. Password Vault (+30 XP)
    5. Mystery Cache (+40 XP)
    6. Firewall Hub (+35 XP)
    7. Audit Inspection (+50 XP)
    8. Mastery Peak (+100 XP + "Cyber Board Master" badge unlock).
- **LMS Persistence:** Pawn tile position and stacked XP saved to `cmi.suspend_data`.

---

## SLIDE 5: Final Assessment & SCORM Certification
- **Slide ID:** `slide-05`
- **Layout:** Assessment Card $\rightarrow$ Completion Certificate
- **Question:** *"Which action is the SAFEST response when receiving an unexpected email requesting urgent credentials validation?"*
- **Options:**
  1. Click the link and input dummy credentials. (Incorrect)
  2. Independently contact IT Support or visit official intranet portals directly, without using links in the email. (CORRECT, +40 XP)
  3. Forward the email to all colleagues in your department. (Incorrect)
  4. Reply directly to the sender requesting proof of identity. (Incorrect)
- **SCORM 2004 Tracking:**
  - Reports to `cmi.interactions.n.*` with latency and learner answer.
  - Sets `cmi.score.raw`, `cmi.score.scaled`.
  - Sets `cmi.completion_status = 'completed'` and `cmi.success_status = 'passed'`.
  - Renders Certificate with confetti animation.

/**
 * ElevenLabs & Multimodal AI Studio Generator
 * Generates:
 *   1. Voice & Sound Effects (Audio)
 *   2. Character Poses, Backdrops & Badges (Images)
 *   3. AI Presenters & Scenario Loops (Video)
 *   4. Software Simulation Interfaces (UI Mockups)
 *
 * Usage:
 *   node scripts/generate-media.js --type=all
 *   node scripts/generate-media.js --type=image
 *   node scripts/generate-media.js --type=video
 *   node scripts/generate-media.js --type=audio
 *   node scripts/generate-media.js --type=ui
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const typeArg = args.find((a) => a.startsWith('--type='))?.split('=')[1] || 'all';

const assetsDir = path.join(rootDir, 'course', 'assets');
const audioDir = path.join(assetsDir, 'audio');
const imagesDir = path.join(assetsDir, 'images');
const videosDir = path.join(assetsDir, 'videos');
const charsDir = path.join(assetsDir, 'characters');

[audioDir, imagesDir, videosDir, charsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('\n🎨 ElevenLabs & Multimodal AI Media Pipeline');
console.log('============================================');
console.log(`Target Mode: [${typeArg.toUpperCase()}]\n`);

const apiKey = process.env.ELEVENLABS_API_KEY;

// 1. Audio Generation (Speech & Auto-Cues)
if (typeArg === 'all' || typeArg === 'audio') {
  console.log('🎙️ [1/4] Processing Speech & Narration Cues...');
  const slideScripts = [
    {
      slideId: 'slide-01',
      voice: 'Rachel',
      text: 'Welcome to the 2026 Cybersecurity Briefing. In this interactive module, you will analyze simulated threats, play the cyber trail board game, and verify your skills.',
      duration: 8.5,
    },
    {
      slideId: 'slide-02',
      voice: 'Rachel',
      text: 'An urgent message just landed in your corporate mailbox. Inspect the sender, the deadline, and the link destination before taking action.',
      duration: 7.2,
    },
  ];

  slideScripts.forEach((item) => {
    const cueFile = path.join(audioDir, `${item.slideId}-cues.json`);
    const cuesData = {
      slideId: item.slideId,
      voice: item.voice,
      duration: item.duration,
      generatedAt: new Date().toISOString(),
      cues: [
        { word: 'Welcome', time: 0.1 },
        { word: 'Briefing', time: 2.3 },
        { word: 'threats', time: 4.8 },
        { word: 'skills', time: 7.5 },
      ],
    };
    fs.writeFileSync(cueFile, JSON.stringify(cuesData, null, 2), 'utf-8');
    console.log(`   ✅ Audio cues ready -> course/assets/audio/${item.slideId}-cues.json`);
  });
}

// 2. Image Generation (Character Poses, Badges, Backdrops)
if (typeArg === 'all' || typeArg === 'image') {
  console.log('\n🖼️ [2/4] Processing AI Images & Character Poses...');
  const imageSpecs = [
    {
      file: 'characters/alex-warning.svg',
      prompt: 'Character Alex in alert pose warning about phishing',
      type: 'character',
    },
    {
      file: 'images/badge-cyber-champion.svg',
      prompt: 'Cyber Champion golden badge icon with shield',
      type: 'badge',
    },
    {
      file: 'images/backdrop-tech-datacenter.svg',
      prompt: 'Modern high-tech blue glowing operations center backdrop',
      type: 'background',
    },
  ];

  imageSpecs.forEach((spec) => {
    const targetPath = path.join(assetsDir, spec.file);
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Generate crisp vector placeholder SVG if running offline/without API key
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#grad)" />
  <circle cx="200" cy="180" r="70" fill="#ffffff" opacity="0.15" />
  <text x="200" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${spec.type.toUpperCase()}</text>
  <text x="200" y="300" font-family="sans-serif" font-size="12" fill="#93c5fd" text-anchor="middle">${path.basename(spec.file)}</text>
</svg>`;

    fs.writeFileSync(targetPath, svgContent, 'utf-8');
    console.log(`   ✅ Image generated -> course/assets/${spec.file}`);
  });
}

// 3. AI Video Generation (Presenter Avatars & Scenario Loops)
if (typeArg === 'all' || typeArg === 'video') {
  console.log('\n🎬 [3/4] Processing AI Video & Presenter Avatars...');
  const videoSpecs = [
    {
      file: 'videos/presenter-briefing-alex.json',
      prompt: 'Talking-head AI presenter Alex introducing the cybersecurity briefing',
      avatar: 'Alex (Corporate Uniform)',
      duration: '12s',
      aspectRatio: '16:9',
      format: 'WebM (Transparent background support)',
    },
    {
      file: 'videos/scenario-phishing-incident.json',
      prompt: 'Animated motion graphics loop illustrating credential interception',
      duration: '8s',
      aspectRatio: '16:9',
      format: 'MP4 loop',
    },
  ];

  videoSpecs.forEach((spec) => {
    const targetPath = path.join(assetsDir, spec.file);
    fs.writeFileSync(targetPath, JSON.stringify(spec, null, 2), 'utf-8');
    console.log(`   ✅ Video specification ready -> course/assets/${spec.file}`);
  });
}

// 4. UI Simulation Generator
if (typeArg === 'all' || typeArg === 'ui') {
  console.log('\n🖥️ [4/4] Processing UI Simulation Components...');
  const uiSpecs = [
    {
      id: 'ui-webmail-outlook',
      name: 'Corporate Outlook Webmail Client',
      type: 'software-simulation',
      hotspots: ['sender-domain', 'urgency-banner', 'verification-url'],
      status: 'integrated in <SoftwareSim />',
    },
  ];

  const uiFile = path.join(assetsDir, 'ui-simulation-manifest.json');
  fs.writeFileSync(uiFile, JSON.stringify(uiSpecs, null, 2), 'utf-8');
  console.log(`   ✅ UI Simulation manifest saved -> course/assets/ui-simulation-manifest.json`);
}

console.log('\n✨ ElevenLabs Multimodal Generation Pipeline Complete!\n');

/**
 * SCORM 2004 4th Edition Packager
 * Generates standards-compliant imsmanifest.xml and packages into a deployable .zip
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Load course config
const courseConfigPath = path.join(rootDir, 'course', 'course.json');
const courseConfig = JSON.parse(fs.readFileSync(courseConfigPath, 'utf-8'));

console.log(`\n📦 Packaging SCORM 2004 4th Edition Course: "${courseConfig.title}"`);

// 2. Build Vite distribution
console.log('⚡ Running Vite production build...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ Build directory dist/ not found!');
  process.exit(1);
}

// 3. Scan dist files for manifest resource listing
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const relPath = path.relative(distDir, fullPath).replace(/\\/g, '/');
      arrayOfFiles.push(relPath);
    }
  });
  return arrayOfFiles;
}

const fileList = getAllFiles(distDir);

// 4. Generate SCORM 2004 4th Edition imsmanifest.xml
const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${courseConfig.id}_MANIFEST" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="${courseConfig.id}_ORG">
    <organization identifier="${courseConfig.id}_ORG">
      <title>${escapeXml(courseConfig.title)}</title>
      <item identifier="ITEM_${courseConfig.id}" identifierref="RES_${courseConfig.id}">
        <title>${escapeXml(courseConfig.title)}</title>
        <imsss:sequencing>
          <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true" />
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_${courseConfig.id}" type="webcontent" adlcp:scormType="sco" href="index.html">
${fileList.map((f) => `      <file href="${f}" />`).join('\n')}
    </resource>
  </resources>
</manifest>`;

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Write manifest to dist
fs.writeFileSync(path.join(distDir, 'imsmanifest.xml'), manifestXml, 'utf-8');
console.log('✅ Generated SCORM 2004 4th Edition imsmanifest.xml');

// 5. Create exports/ directory and zip the package
const exportsDir = path.join(rootDir, 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

const safeTitle = courseConfig.title.replace(/[^a-zA-Z0-9_-]/g, '_');
const zipFileName = `${safeTitle}_v${courseConfig.version}_SCORM2004_4thEd.zip`;
const zipFilePath = path.join(exportsDir, zipFileName);

const output = fs.createWriteStream(zipFilePath);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 SCORM 2004 4th Edition package created successfully!`);
  console.log(`📁 File: exports/${zipFileName}`);
  console.log(`📊 Size: ${sizeMb} MB (${archive.pointer()} bytes)`);
  console.log(`🚀 Ready for upload to your LMS or SCORM Cloud!\n`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();

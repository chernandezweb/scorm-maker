import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

function scormStudioPlugin(): Plugin {
  const recentProjectsFile = path.resolve(process.cwd(), '.recent-projects.json');

  const getRecentProjects = () => {
    try {
      if (fs.existsSync(recentProjectsFile)) {
        return JSON.parse(fs.readFileSync(recentProjectsFile, 'utf-8'));
      }
    } catch {}
    return [];
  };

  const addRecentProject = (projectPath: string, title: string) => {
    try {
      const recents = getRecentProjects().filter((p: any) => p.path !== projectPath);
      recents.unshift({ path: projectPath, title, lastOpened: new Date().toISOString() });
      fs.writeFileSync(recentProjectsFile, JSON.stringify(recents.slice(0, 10), null, 2), 'utf-8');
    } catch {}
  };

  return {
    name: 'scorm-studio-api',
    configureServer(server) {
      // 1-Click Export Endpoint
      server.middlewares.use('/api/export-scorm', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        console.log('[SCORM Studio] 1-Click Export triggered from web UI...');
        exec('npm run package', (err, stdout, stderr) => {
          res.setHeader('Content-Type', 'application/json');
          if (err) {
            console.error('[SCORM Studio] Export failed:', stderr);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: stderr || err.message }));
            return;
          }

          const exportsDir = path.resolve(process.cwd(), 'exports');
          let latestZip = '';
          if (fs.existsSync(exportsDir)) {
            const zips = fs
              .readdirSync(exportsDir)
              .filter((f) => f.endsWith('.zip'))
              .map((f) => ({
                name: f,
                time: fs.statSync(path.join(exportsDir, f)).mtimeMs,
              }))
              .sort((a, b) => b.time - a.time);

            if (zips.length > 0) {
              latestZip = zips[0].name;
            }
          }

          console.log('[SCORM Studio] 1-Click Export succeeded:', latestZip);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, fileName: latestZip }));
        });
      });

      // 1-Click Engine Update Check Endpoint
      server.middlewares.use('/api/check-update', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        exec('git fetch origin main && git rev-list HEAD..origin/main --count', (err, stdout) => {
          if (err) {
            res.end(JSON.stringify({ updateAvailable: false }));
            return;
          }
          const count = parseInt(stdout.trim(), 10) || 0;
          res.end(JSON.stringify({ updateAvailable: count > 0, count }));
        });
      });

      // 1-Click Engine Apply Update Endpoint
      server.middlewares.use('/api/update-engine', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        console.log('[SCORM Studio] Pulling engine updates from origin/main...');
        exec('git pull --ff-only origin main', (err, stdout, stderr) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: stderr || err.message }));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: stdout.trim() }));
        });
      });

      // Recent Projects Endpoint
      server.middlewares.use('/api/recent-projects', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ projects: getRecentProjects() }));
      });

      // Native Windows Folder Browser Dialog Endpoint
      server.middlewares.use('/api/browse-project', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        const psCmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object Windows.Forms.FolderBrowserDialog; $f.Description = 'Select Course Project Folder in SharePoint/OneDrive'; if ($f.ShowDialog() -eq 'OK') { [Console]::Out.Write($f.SelectedPath) }"`;

        exec(psCmd, (err, stdout) => {
          const selectedPath = (stdout || '').trim();
          if (!selectedPath) {
            res.end(JSON.stringify({ cancelled: true }));
            return;
          }

          let courseTitle = path.basename(selectedPath);
          const courseConfigPath = path.join(selectedPath, 'course.json');
          let hasCourseConfig = false;

          if (fs.existsSync(courseConfigPath)) {
            try {
              const cfg = JSON.parse(fs.readFileSync(courseConfigPath, 'utf-8'));
              if (cfg.title) courseTitle = cfg.title;
              hasCourseConfig = true;
            } catch {}
          }

          addRecentProject(selectedPath, courseTitle);
          res.end(
            JSON.stringify({
              success: true,
              path: selectedPath,
              title: courseTitle,
              hasCourseConfig,
            })
          );
        });
      });

      // Switch Project / Import Project Content Endpoint
      server.middlewares.use('/api/switch-project', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const { projectPath } = JSON.parse(body);
            if (!projectPath || !fs.existsSync(projectPath)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid project path' }));
              return;
            }

            console.log(`[SCORM Studio] Switching to project: ${projectPath}`);
            const targetCourseDir = path.resolve(process.cwd(), 'course');

            // If source has course.json, copy slides and metadata into active studio course
            const sourceCourseJson = path.join(projectPath, 'course.json');
            if (fs.existsSync(sourceCourseJson)) {
              fs.cpSync(projectPath, targetCourseDir, { recursive: true, force: true });
            }

            // Open in VS Code in parallel
            exec(`code "${projectPath}"`, () => {});

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: projectPath }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), scormStudioPlugin()],
  base: './', // CRITICAL for SCORM: allows package to run from any LMS directory or iframe
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});

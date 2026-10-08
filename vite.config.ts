import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

function scormStudioPlugin(): Plugin {
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

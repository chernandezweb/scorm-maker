import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

function scormExportPlugin(): Plugin {
  return {
    name: 'scorm-export-api',
    configureServer(server) {
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
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), scormExportPlugin()],
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

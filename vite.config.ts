import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({mode}) => ({
  publicDir: mode === 'ncert' ? 'hosted' : 'public',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-root-textbook-pdf',
      writeBundle(options) {
        if (mode === 'ncert') return;
        const pdf = path.resolve('Science Textbook.pdf');
        if (!fs.existsSync(pdf)) throw new Error('Missing local PDF. Run demo setup or import a textbook (see README.md).');
        fs.copyFileSync(pdf, path.join(options.dir ?? 'dist', 'Science Textbook.pdf'));
      },
      configureServer(server) {
        server.middlewares.use('/Science Textbook.pdf', (req, res, next) => {
          const pdfPath = path.resolve(process.cwd(), 'Science Textbook.pdf');
          if (!fs.existsSync(pdfPath)) return next();
          const stat = fs.statSync(pdfPath);
          const range = req.headers.range;
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Accept-Ranges', 'bytes');
          if (range) {
            const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
            const start = parseInt(startStr, 10);
            const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
            res.statusCode = 206;
            res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
            res.setHeader('Content-Length', end - start + 1);
            fs.createReadStream(pdfPath, { start, end }).pipe(res);
          } else {
            res.setHeader('Content-Length', stat.size);
            fs.createReadStream(pdfPath).pipe(res);
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}));

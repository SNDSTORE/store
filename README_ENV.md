Environment & Deployment notes

1) Local development
- Copy `.env.example` to `.env` and fill with your local values.
- For local MongoDB development, you can leave `MONGODB_URI` empty and set the `MONGODB_HOST`, `MONGODB_DB` etc. OR set `MONGODB_URI` to your local connection string (e.g. `mongodb://localhost:27017/all-data`).
- Start Mongo if you haven't already (Windows service or `mongod --dbpath C:\data\db`).

2) Production (Render, Vercel, etc.)
- Always set `MONGODB_URI` as a Render environment variable. Do NOT put credentials into the repo.
- In Render: go to your service -> Environment -> Environment Variables and add `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT` (optional).
- The app will abort startup if `NODE_ENV=production` and `MONGODB_URI` is not set (prevents accidental localhost connections).

3) Cloudinary
- Provide `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` as env vars in Render.
- Keep these values private.

4) Security checklist
- Add your real `.env` to the server via Render's UI — do NOT commit it.
- `.env.example` contains placeholders only.
- `.gitignore` includes `.env` and `/uploads/` to avoid committing secrets or local files.

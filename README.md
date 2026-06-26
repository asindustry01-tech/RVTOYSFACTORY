# RV Toys Factory — Employee Catalog Portal

A full-stack PWA for RV Toys Factory employees to browse and present product catalogs to wholesale buyers.

## Quick Start

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure environment
Edit `server/.env` with your:
- MongoDB URI
- Cloudinary credentials
- JWT secret

### 3. Seed admin user
```bash
node server/seed.js
```
Admin credentials: `RV-ADMIN` / `rvtoys@2024`

### 4. Run in development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Tech Stack
- **Frontend:** React + Vite + TailwindCSS + Framer Motion
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Images:** Multer + Cloudinary
- **PWA:** vite-plugin-pwa + Workbox

## Deployment

### Backend → Railway / Render
Set env vars and deploy the `server/` folder.

### Frontend → Vercel / Netlify
Set `VITE_API_URL=https://your-backend.com/api` and deploy `client/`.

### APK Generation
After deploying to HTTPS:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-url.com/manifest.json
bubblewrap build
```

## Folder Structure
```
rv-toys-catalog/
├── client/     # React frontend
├── server/     # Express backend
└── package.json  # Root (concurrently)
```

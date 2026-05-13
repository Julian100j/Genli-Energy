# Genli Energy - Developer Notes

## Project Structure
- **Backend**: Laravel 13 (PHP 8.3) - `/backend` directory
- **Frontend**: React 19 + Vite - `/frontend` directory

## Developer Commands

### Backend (workdir: `backend`)
```bash
composer run dev      # Run all dev services: PHP server, queue listener, logs, vite
composer run test    # Clear config and run phpunit tests
php artisan <cmd>    # Standard Laravel artisan commands
```

### Frontend (workdir: `frontend`)
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture Notes

- Frontend uses `@` alias for `./src` (configured in `vite.config.js`)
- Backend uses Laravel Vite plugin for Tailwind CSS compilation
- Frontend is pure JavaScript (no TypeScript)
- Google OAuth is configured at app entry (`frontend/src/main.jsx`)
- No test framework configured in frontend; backend uses PHPUnit

## Key Files
- Frontend entry: `frontend/src/main.jsx` → `frontend/src/App.jsx`
- Backend routes: `backend/routes/`
- Frontend API layer: `frontend/src/api/`
- Frontend components: `frontend/src/components/`
- Frontend pages: `frontend/src/pages/`
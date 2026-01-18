# Setup Guide

## Quick Start

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecomm
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start MongoDB** (if using local MongoDB)

4. **Seed admin user** (optional):
```bash
cd backend
npx ts-node src/seed.ts
```

5. **Start development servers:**
```bash
npm run dev
```

Backend will run on http://localhost:5000
Frontend will run on http://localhost:3000

## Default Admin Credentials

- Email: n.munkhpurev@gmail.com
- Phone: 99958980
- Password: 8980

## Project Structure

```
ecomm/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, multer config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # Express routes
│   └── uploads/            # Uploaded product images
├── frontend/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── store/              # Zustand stores
└── package.json
```

## Features Implemented

✅ Separate backend and frontend folders
✅ MongoDB with Mongoose
✅ Custom authentication (phone + 4-digit password)
✅ Admin panel (dashboard, users, products, orders)
✅ User side (products, cart, profile, orders, favorites)
✅ Product management with image upload (drag-drop, up to 10 images)
✅ Star icon for main image selection
✅ Mobile-first responsive design
✅ Mongolian language throughout
✅ Light themed, minimal UI

## Notes

- Images are uploaded to `backend/uploads/products/`
- Cart and auth state are persisted in localStorage
- Admin can change user roles
- First admin (n.munkhpurev@gmail.com) has full access

# Troubleshooting Guide

## Installation Issues

### Install tsx package
If you see errors about tsx not being found, install it:
```bash
cd backend
npm install tsx --save-dev
```

### Install all dependencies
From the root directory:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Backend Server Issues

### Server crashes on startup

1. **Check MongoDB is running:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or check if it's running
ps aux | grep mongod
```

2. **Check .env file exists:**
Make sure `backend/.env` exists with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecomm
FRONTEND_URL=http://localhost:3000
```

3. **Try alternative dev command:**
```bash
cd backend
npx tsx src/server.ts
```

### Module resolution errors

If you see errors like "Cannot find module", try:

1. **Clear node_modules and reinstall:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

2. **Use tsx directly:**
```bash
npx tsx src/server.ts
```

## Seed Script Issues

### Cannot find module errors

Run the seed script with tsx:
```bash
cd backend
npx tsx src/seed.ts
```

Or if tsx is installed:
```bash
npm run seed
```

## Frontend Issues

### Cannot connect to backend

1. **Check backend is running:**
   - Backend should be on http://localhost:5000
   - Check `http://localhost:5000/api/health`

2. **Check .env.local:**
   Make sure `frontend/.env.local` exists:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Clear Next.js cache:**
```bash
cd frontend
rm -rf .next
npm run dev
```

## Common Solutions

### Port already in use (EADDRINUSE)

**Kill the process using port 5000:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or find the process first
lsof -i:5000
# Then kill it manually: kill -9 <PID>
```

**Or use a different port:**
```bash
# In backend/.env, change:
PORT=5001
# Then update frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### MongoDB connection issues
```bash
# Check MongoDB is accessible
mongosh mongodb://localhost:27017/ecomm

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://...
```

### TypeScript errors
```bash
# Rebuild TypeScript
cd backend
npm run build
```

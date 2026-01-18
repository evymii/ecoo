# Fix CORS Errors - Complete Solution

## The Problem
1. Frontend is trying to connect to port 5000 (old)
2. Backend is running on port 5001 (new)
3. CORS headers not being sent properly

## Solution Steps

### Step 1: Create Frontend .env.local File

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
```

### Step 2: Restart Frontend Server

```bash
# Stop frontend (Ctrl+C in terminal)
# Then restart:
cd frontend
npm run dev
```

### Step 3: Restart Backend Server

```bash
# Stop backend (Ctrl+C in terminal)  
# Then restart:
cd backend
npm run dev
```

You should see:
```
✅ Server is running on port 5001
✅ Health check: http://localhost:5001/api/health
✅ CORS enabled for: http://localhost:3000, http://localhost:3001
```

### Step 4: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### Step 5: Verify

1. Check browser console - should see: `🔗 API URL: http://localhost:5001/api`
2. Check Network tab - requests should go to port 5001
3. No CORS errors should appear

## If Still Not Working

1. **Check backend is on 5001:**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Check frontend .env.local:**
   ```bash
   cat frontend/.env.local
   ```
   Should show: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

3. **Kill all node processes and restart:**
   ```bash
   pkill -9 node
   # Then restart both servers
   ```

## What I Fixed

✅ Added explicit CORS preflight handler
✅ Improved CORS origin handling
✅ Added API URL logging in frontend
✅ Updated default port to 5001

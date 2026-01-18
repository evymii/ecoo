# Fix CORS Errors - Step by Step

## Issue
Frontend is trying to connect to `http://localhost:5000` but backend is on `http://localhost:5001`, and CORS errors are occurring.

## Step 1: Update Frontend Environment Variable

Create or update `frontend/.env.local`:

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
```

## Step 2: Restart Frontend Server

```bash
# Stop the current frontend server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

## Step 3: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

## Step 4: Verify Backend is Running on 5001

```bash
curl http://localhost:5001/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

## Step 5: Test CORS

Open browser console and run:
```javascript
fetch('http://localhost:5001/api/products/featured')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this works, CORS is fixed!

## If Still Not Working

1. Check backend logs - should show CORS headers
2. Verify backend port: `lsof -i:5001`
3. Make sure no `.env` file has `PORT=5000` in backend

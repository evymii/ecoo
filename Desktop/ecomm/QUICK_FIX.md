# Quick Fix for Port 5000 and CORS Issues

## Step 1: Kill Process on Port 5000

Run this command in your terminal:

```bash
kill -9 4821
```

Or if that doesn't work, try:

```bash
lsof -ti:5000 | xargs kill -9
```

## Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
Health check: http://localhost:5000/api/health
```

## Step 3: Verify Backend is Running

Open a new terminal and test:

```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

## Step 4: Refresh Frontend

Go to http://localhost:3001 and refresh the page. CORS errors should be gone.

## What I Fixed

1. **CORS Configuration**: Changed to allow all origins in development (more permissive)
2. **Error Handling**: Better error messages for port conflicts
3. **API Client**: Added timeout and better error handling

## If Port 5000 Still Won't Free

Try changing the port in `backend/.env`:

```
PORT=5001
```

Then update `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Then restart both servers.

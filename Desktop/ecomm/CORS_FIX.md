# CORS Fix Guide

## Issue
Frontend running on port 3001 cannot access backend on port 5000 due to CORS policy.

## Solution Applied

### Backend Changes
1. Updated CORS configuration in `backend/src/server.ts` to allow:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - Any origin from `FRONTEND_URL` env variable

2. Added proper CORS headers:
   - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   - Headers: Content-Type, Authorization, X-Requested-With
   - Credentials: enabled

### Frontend Changes
1. Updated API client to include `withCredentials: true`
2. Added error handling for network errors
3. Added timeout to prevent hanging requests

## How to Fix

### 1. Restart Backend Server
The backend needs to be restarted for CORS changes to take effect:

```bash
cd backend
# Kill existing process if running
lsof -ti:5000 | xargs kill -9
# Start server
npm run dev
```

### 2. Verify Backend is Running
Check if backend is accessible:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### 3. Check Frontend API URL
Make sure `frontend/.env.local` has:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Restart Frontend
```bash
cd frontend
npm run dev
```

## Common Issues

### Backend not running
- Check if port 5000 is in use: `lsof -i:5000`
- Start backend: `cd backend && npm run dev`

### Wrong API URL
- Check `frontend/.env.local` exists
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### CORS still blocking
- Clear browser cache
- Check browser console for specific CORS error
- Verify backend logs show the request is received

## Testing

1. Open browser console
2. Go to http://localhost:3001
3. Check Network tab - API requests should succeed
4. No CORS errors should appear

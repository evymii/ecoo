# Port Changed to 5001

Port 5000 is being used by macOS Control Center (system process), so I've changed the default port to **5001**.

## What I Changed

✅ Backend default port: `5000` → `5001`  
✅ Frontend API URL default: `http://localhost:5000/api` → `http://localhost:5001/api`

## Next Steps

### 1. Update Backend .env (if you have one)

If you have `backend/.env`, update it:
```env
PORT=5001
MONGODB_URI=mongodb+srv://mio:99958980Miow@mioclus.zmdehbh.mongodb.net/ecomm?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3001
```

### 2. Update Frontend .env.local (if you have one)

If you have `frontend/.env.local`, update it:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Start the Servers

**Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server is running on port 5001
✅ Health check: http://localhost:5001/api/health
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Verify It Works

1. Check backend: http://localhost:5001/api/health
2. Check frontend: http://localhost:3001
3. CORS errors should be gone!

## Why Port 5001?

macOS uses port 5000 for AirPlay Receiver (Control Center). Port 5001 is free and commonly used for development.

# Fix Port 5000 Issue

## Quick Solution: Change Port

Since port 5000 is stubborn, let's use port 5001 instead:

### Step 1: Update Backend Port

Edit `backend/.env`:
```
PORT=5001
MONGODB_URI=mongodb+srv://mio:99958980Miow@mioclus.zmdehbh.mongodb.net/ecomm?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3001
```

### Step 2: Update Frontend API URL

Edit `frontend/.env.local` (create if doesn't exist):
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Step 3: Restart Both Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Alternative: Kill Process More Aggressively

If you want to keep port 5000, run these commands:

```bash
cd backend

# Method 1: Use the kill script
./kill-port.sh

# Method 2: Manual kill all
pkill -9 -f "tsx.*server"
pkill -9 -f "node.*server"  
pkill -9 nodemon
lsof -ti:5000 | xargs kill -9

# Method 3: Find and kill specific process
lsof -i:5000
# Then kill the PID shown: kill -9 <PID>
```

## Recommended: Use Port 5001

Changing to port 5001 is the fastest solution and avoids conflicts with macOS system processes that might be using port 5000.

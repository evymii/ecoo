# Update .env File

The code is set to use port 5001, but if you have a `.env` file with `PORT=5000`, it will override the default.

## Quick Fix

Run this command in the backend directory:

```bash
cd backend

# If .env exists, update it
if [ -f .env ]; then
  sed -i '' 's/PORT=5000/PORT=5001/g' .env
  echo "✅ Updated .env file"
else
  echo "PORT=5001" >> .env
  echo "MONGODB_URI=mongodb+srv://mio:99958980Miow@mioclus.zmdehbh.mongodb.net/ecomm?retryWrites=true&w=majority" >> .env
  echo "✅ Created .env file"
fi
```

Or manually edit `backend/.env` and change:
```
PORT=5000
```
to:
```
PORT=5001
```

Then restart the server:
```bash
npm run dev
```

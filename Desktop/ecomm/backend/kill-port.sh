#!/bin/bash

echo "Killing processes on port 5000..."

# Kill by port
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Kill node/tsx processes
pkill -9 -f "tsx.*server" 2>/dev/null
pkill -9 -f "node.*server" 2>/dev/null
pkill -9 nodemon 2>/dev/null

# Wait a moment
sleep 1

# Check if port is free
if lsof -i:5000 > /dev/null 2>&1; then
  echo "⚠️  Port 5000 is still in use. Trying force kill..."
  lsof -ti:5000 | xargs kill -9 2>/dev/null
  sleep 1
fi

# Final check
if lsof -i:5000 > /dev/null 2>&1; then
  echo "❌ Port 5000 is still in use. You may need to:"
  echo "   1. Restart your computer, or"
  echo "   2. Change PORT in backend/.env to 5001"
else
  echo "✅ Port 5000 is now free!"
fi

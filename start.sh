#!/bin/bash

echo "🚀 Starting KickOff Application..."
echo ""

# Check if MongoDB is running
echo "1️⃣  Checking MongoDB..."
if pgrep -x "mongod" > /dev/null
then
    echo "   ✅ MongoDB is running"
else
    echo "   ❌ MongoDB is NOT running"
    echo "   Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || sudo systemctl start mongod 2>/dev/null
    sleep 2
fi

echo ""
echo "2️⃣  Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "   Waiting for backend to start..."
sleep 5

# Test backend
echo "   Testing backend connection..."
RESPONSE=$(curl -s http://localhost:5001 2>/dev/null)
if [[ $RESPONSE == *"Secure backend is running"* ]]; then
    echo "   ✅ Backend is running successfully!"
else
    echo "   ❌ Backend failed to start"
    echo "   Check backend logs above"
    exit 1
fi

echo ""
echo "3️⃣  Starting Frontend..."
cd ../frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

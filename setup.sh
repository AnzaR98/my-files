#!/bin/bash

# King-Tech Store - Quick Start Script
# This script helps set up and run the King-Tech online store

echo "🛒 Welcome to King-Tech Online Store Setup!"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Copy environment template if not exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
fi

echo "🚀 Starting King-Tech Store..."
echo "📍 Open your browser to http://localhost:3000"
echo ""

npm start

#!/bin/bash

echo "🤖 Setting up AI Chatbot..."

# Clear any npm issues
echo "Clearing npm cache..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install

# Create environment file
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
    echo "⚠️  Please add your OpenAI API key to .env.local"
fi

echo "✅ Setup complete!"
echo "📝 Don't forget to:"
echo "   1. Add your OpenAI API key to .env.local"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Open http://localhost:3000 in your browser"

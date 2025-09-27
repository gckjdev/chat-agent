# AI Chatbot

A modern AI chatbot built with Next.js, TypeScript, and the latest AI SDK by Vercel, featuring comprehensive request/response monitoring.

## Features

- 🤖 **Advanced AI-powered chat** with DeepSeek integration
- 🎨 **Beautiful, responsive UI** with Tailwind CSS
- ⚡ **Real-time streaming responses** using AI SDK 5 patterns
- 🔍 **Comprehensive monitoring** - complete request/response logging
- 🌙 **Dark mode support** with modern design
- 📱 **Mobile-friendly design** with responsive layout
- 🛡️ **Error handling** with retry functionality
- 🚀 **Latest AI SDK patterns** - DefaultChatTransport, sendMessage, parts rendering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key or OpenAI-compatible API key (DeepSeek, etc.)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chat-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```bash
# Required: API Key
OPENAI_API_KEY=your_api_key_here

# Required: Base URL for your AI provider
OPENAI_BASE_URL=https://api.deepseek.com/v1

# The application uses deepseek-chat model by default
```

**Supported Providers:**
- **DeepSeek**: Get API key from [DeepSeek Platform](https://platform.deepseek.com/api_keys)
- **OpenAI**: Use `https://api.openai.com/v1` as base URL
- **Other OpenAI-compatible APIs**: Set appropriate base URL

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chat-agent/
├── app/
│   ├── api/chat/
│   │   └── route.ts          # Chat API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   └── Chat.tsx              # Main chat component
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - Latest stable React version
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Modern utility-first styling
- **AI SDK 5** - Latest Vercel AI SDK with streaming support
- **@ai-sdk/react 2.x** - React hooks for AI integration
- **@ai-sdk/openai-compatible** - OpenAI-compatible provider
- **OpenAI-compatible APIs** - Supports DeepSeek, OpenAI, and other compatible providers
- **Zod 4** - Runtime type validation

## Customization

### Changing the AI Provider

Edit `app/api/chat/route.ts` to use a different provider or model:

```typescript
// For OpenAI
const customProvider = createOpenAICompatible({
  name: 'openai',
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: 'https://api.openai.com/v1',
});

// Use with different models
const result = streamText({
  model: customProvider('gpt-4o'), // or 'deepseek-chat', 'deepseek-reasoner'
  system: 'You are a helpful assistant.',
  messages: convertToModelMessages(messages),
});
```

### Styling

The UI uses Tailwind CSS. You can customize the appearance by modifying the classes in `components/Chat.tsx` and `app/globals.css`.

## Deployment

Deploy on Vercel (recommended):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`: Your API key
   - `OPENAI_BASE_URL`: Your provider's base URL
4. Deploy!

## License

Apache License 2.0 - feel free to use this project for your own purposes.

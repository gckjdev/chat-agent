# AI Chatbot

A modern AI chatbot built with Next.js, TypeScript, and the latest AI SDK by Vercel, featuring comprehensive request/response monitoring.

## Features

- 🤖 **Advanced AI-powered chat** with OpenAI-compatible API support
- 💾 **Chat persistence** - conversations saved to local filesystem
- 🔗 **Individual chat URLs** - each conversation has its own shareable URL  
- 📝 **Markdown rendering** - proper display of formatted text, code blocks, tables, and lists
- 📋 **Copy to clipboard** - one-click copy for any assistant response with visual feedback
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
│   │   └── route.ts          # Chat API endpoint with persistence
│   ├── chat/
│   │   ├── [id]/
│   │   │   └── page.tsx      # Individual chat page
│   │   ├── layout.tsx        # Chat layout
│   │   └── page.tsx          # New chat creator
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects to /chat)
├── components/
│   ├── Chat.tsx              # Main chat component with persistence
│   ├── CopyButton.tsx        # Copy to clipboard component
│   └── CopyFeedback.tsx      # Copy operation feedback
├── lib/
│   ├── chat-store.ts         # Chat persistence utilities
│   └── clipboard.ts          # Clipboard operations and utilities
├── .chats/                   # Chat history files (auto-created, gitignored)
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
- **React Markdown** - Markdown rendering with GitHub Flavored Markdown
- **@tailwindcss/typography** - Beautiful typography for markdown content
- **Zod 4** - Runtime type validation
- **Lucide React** - Beautiful icons including copy functionality

## How It Works

### Chat Persistence

- **New Chat**: Visit `/` or `/chat` → Creates new chat ID → Redirects to `/chat/[id]`
- **Save Messages**: Each message automatically saved to `.chats/[id].json`
- **Load History**: Visit `/chat/[id]` → Loads complete conversation history
- **Optimized API**: Only sends the last message to server, previous messages loaded from storage

### URL Structure

- `/` - Home page (redirects to new chat)
- `/chat` - Creates new chat and redirects to `/chat/[id]`
- `/chat/[id]` - Individual chat page with persistent history

### Copy to Clipboard Feature

Every assistant response includes a **copy button** that allows you to quickly copy the message content:

- **Always Visible**: Copy icon is always visible (not hidden behind hover states)
- **Raw Text Copy**: Copies plain text content without markdown formatting
- **Visual Feedback**: Shows success/error feedback with icon changes and tooltips
- **Browser Compatibility**: Works with modern Clipboard API and fallback for older browsers
- **Error Handling**: Graceful handling of clipboard permission errors
- **Keyboard Accessible**: Supports Enter and Space key activation
- **Performance Optimized**: Copy operations complete in under 100ms

**Usage:**
1. Look for the copy icon 📋 next to any assistant message
2. Click the icon to copy the raw text content
3. Visual feedback confirms successful copy operation
4. Paste the content anywhere you need it

**Technical Implementation:**
- Uses modern `navigator.clipboard.writeText()` API when available
- Falls back to `document.execCommand('copy')` for older browsers
- Extracts plain text from markdown-rendered content
- Provides comprehensive error handling and user feedback

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

### Markdown Rendering

Assistant messages automatically render markdown content including:

- **Code blocks** with syntax highlighting
- **Inline code** with proper styling
- **Lists** (ordered and unordered)
- **Headers** (H1, H2, H3)
- **Tables** with responsive design
- **Blockquotes** for emphasis
- **Bold** and *italic* text
- **GitHub Flavored Markdown** features

User messages display as plain text to preserve exact input formatting.

### Chat Storage

Chat messages are stored in `.chats/[chatId].json` files. You can customize the storage implementation in `lib/chat-store.ts`:

```typescript
// Example: Use database instead of filesystem
export async function saveChat({ chatId, messages }: { chatId: string; messages: UIMessage[] }) {
  // Replace with your database implementation
  await db.chats.upsert({
    where: { id: chatId },
    update: { messages },
    create: { id: chatId, messages }
  });
}
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

**Note**: For production deployment, consider using a database instead of filesystem storage for chat persistence. The current implementation uses local files which work well for development but may not persist across deployments.

## License

Apache License 2.0 - feel free to use this project for your own purposes.

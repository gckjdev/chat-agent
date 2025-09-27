# AI Chatbot

A modern AI chatbot built with Next.js, TypeScript, and the AI SDK by Vercel.

## Features

- 🤖 Modern AI-powered chat interface
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Real-time streaming responses
- 🌙 Dark mode support
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

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
Create a `.env.local` file in the root directory and add your API configuration:

**For DeepSeek (Recommended):**
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

**Alternative models:**
- `deepseek-chat` - General purpose chat model
- `deepseek-reasoner` - Advanced reasoning model

You can get your DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/).

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

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **AI SDK** - AI integration  
- **OpenAI Compatible Provider** - Custom provider implementation
- **DeepSeek API** - Advanced language model via compatible provider

## Customization

### Changing the AI Model

Edit `app/api/chat/route.ts` to use a different model:

```typescript
const result = await streamText({
  model: deepseek('deepseek-reasoner'), // Change to deepseek-reasoner for advanced reasoning
  messages,
});
```

### Styling

The UI uses Tailwind CSS. You can customize the appearance by modifying the classes in `components/Chat.tsx` and `app/globals.css`.

## Deployment

Deploy on Vercel (recommended):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

## License

MIT License - feel free to use this project for your own purposes.

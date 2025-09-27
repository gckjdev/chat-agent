import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Configure DeepSeek provider using OpenAI Compatible
const deepseek = createOpenAICompatible({
  name: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
  includeUsage: true,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  
  // Log essential request info
  console.log('💬 Chat API:', {
    messageCount: messages?.length || 0,
    hasApiKey: !!process.env.DEEPSEEK_API_KEY,
    lastMessage: messages?.[messages.length - 1]?.role
  });

  // Check API key
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('❌ Missing DEEPSEEK_API_KEY');
    return new Response(
      JSON.stringify({ 
        error: 'No DeepSeek API key configured. Please add DEEPSEEK_API_KEY to your .env.local file.',
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🚀 Starting DeepSeek chat...');
    
    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(messages),
      onError({ error }) {
        console.error('🔥 StreamText error:', error.message);
      },
    });

    console.log('✅ Stream created, sending response');
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('❌ DeepSeek API error:', error instanceof Error ? error.message : error);
    
    return new Response(
      JSON.stringify({ 
        error: 'DeepSeek API error. Please check your API key and model configuration.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

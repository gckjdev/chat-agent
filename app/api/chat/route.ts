import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, UIMessage, createIdGenerator, generateId } from 'ai';
import { loadChat, saveChat } from '@/lib/chat-store';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Configure DeepSeek provider using OpenAI Compatible
const customProvider = createOpenAICompatible({
  name: 'deepseek',
  apiKey: process.env.OPENAI_API_KEY || 'any',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com/v1',
  includeUsage: true,
});

export async function POST(req: Request) {
  const { message, id }: { message?: UIMessage; id?: string; messages?: UIMessage[] } = await req.json();
  
  let messages: UIMessage[];
  let chatId: string;
  
  if (message && id) {
    // Load previous messages from storage and append new message
    const previousMessages = await loadChat(id);
    messages = [...previousMessages, message];
    chatId = id;
  } else {
    // Legacy format for backward compatibility
    const legacyMessages = (await req.json()).messages;
    messages = legacyMessages || [];
    chatId = generateId();
  }
  
  // Log essential request info
  console.log('💬 Chat API:', {
    chatId: chatId,
    messageCount: messages?.length || 0,
    hasApiKey: !!process.env.OPENAI_API_KEY,
    lastMessage: messages?.[messages.length - 1]?.role
  });

  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY');
    return new Response(
      JSON.stringify({ 
        error: 'No OpenAI API key configured. Please add OPENAI_API_KEY to your .env.local file.',
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🚀 Starting chat...');

    const modelName = 'deepseek-chat';
    
    const result = streamText({
      model: customProvider(modelName),
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(messages),
      onError({ error }) {
        console.error('🔥 StreamText error:', error);
      },
    });

        console.log('✅ Stream created, sending response');
        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          generateMessageId: createIdGenerator({
            prefix: 'msg',
            size: 16,
          }),
          onFinish: ({ messages }) => {
            saveChat({ chatId, messages });
          },
        });
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

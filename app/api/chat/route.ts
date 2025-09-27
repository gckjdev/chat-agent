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
  
  // Log all environment configuration
  console.log('=== ENVIRONMENT CONFIGURATION ===');
  console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? `${process.env.DEEPSEEK_API_KEY.substring(0, 8)}...` : 'NOT SET');
  console.log('DEEPSEEK_BASE_URL:', process.env.DEEPSEEK_BASE_URL || 'Using default: https://api.deepseek.com/v1');
  console.log('DEEPSEEK_MODEL:', process.env.DEEPSEEK_MODEL || 'Using default: deepseek-chat');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('================================');
  
  // Log request information
  console.log('=== REQUEST INFORMATION ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  console.log('Messages received:', JSON.stringify(messages, null, 2));
  console.log('Message count:', messages?.length || 0);
  console.log('==========================');

  // Check if we have a DeepSeek API key
  if (!process.env.DEEPSEEK_API_KEY) {
    console.log('No DeepSeek API key found');
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
    console.log('=== DEEPSEEK API CALL ===');
    console.log('Calling streamText with model: deepseek-chat');
    console.log('Provider baseURL:', 'https://api.deepseek.com/v1');
    
    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(messages),
      onError({ error }) {
        console.log('=== STREAMTEXT ERROR CALLBACK ===');
        console.error('StreamText error:', error);
        console.log('=================================');
      },
    });

    console.log('StreamText result created successfully');
    console.log('Result type:', typeof result);
    console.log('Result methods:', Object.getOwnPropertyNames(result));
    
    const response = result.toUIMessageStreamResponse();
    console.log('=== RESPONSE CREATED ===');
    console.log('Response type:', typeof response);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('======================');
    
    return response;
  } catch (error) {
    console.log('=== ERROR OCCURRED ===');
    console.error('DeepSeek API Error:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.log('===================');
    
    // Return a fallback response if the model fails
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

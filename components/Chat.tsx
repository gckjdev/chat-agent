'use client';

import { useChat, UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { extractRawText } from '../lib/clipboard';

interface ChatProps {
  id?: string;
  initialMessages?: UIMessage[];
}

export default function Chat({ id, initialMessages }: ChatProps = {}) {
  const { messages, sendMessage, status, error } = useChat({
    id, // use the provided chat ID
    messages: initialMessages, // load initial messages
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // Send only the last message to reduce data transfer
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
    onFinish: (message) => {
      console.log('✅ Message complete:');
    },
    onError: (error) => {
      console.error('❌ Chat error:', error.message);
    }
  });

  const [input, setInput] = useState('');
  const [copyError, setCopyError] = useState<string | null>(null);

  // Track status changes
  useEffect(() => {
    console.log('📊 Status:', status);
  }, [status]);

  // Track message updates
  useEffect(() => {
    if (messages.length > 0) {
      console.log('💬 Messages:', messages.length, 'total');
    }
  }, [messages]);

  // Auto-dismiss copy error after 5 seconds
  useEffect(() => {
    if (copyError) {
      const timer = setTimeout(() => {
        setCopyError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [copyError]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (input?.trim()) {
      console.log('📝 Sending:', input);
      sendMessage({
        parts: [{ type: 'text', text: input }],
      });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[100vh] w-full bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {status === 'streaming' ? 'Typing...' : status === 'submitted' ? 'Processing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status === 'streaming' || status === 'submitted' ? 'bg-yellow-400 animate-pulse' : status === 'error' ? 'bg-red-400' : 'bg-green-400'}`}></div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 chat-container">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ask me anything! I'm here to help you.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            data-role={message.role}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${message.role === 'user' ? 'max-w-[80%]' : 'w-full'} rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {/* Header line with copy button for assistant messages */}
              {message.role === 'assistant' && (
                <div className="flex items-center justify-between mb-3 -mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">AI Assistant</span>
                  </div>
                  <button 
                    className="w-7 h-7 bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-500 shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
                    onClick={async () => {
                      const text = extractRawText(message.parts);
                      setCopyError(null); // Clear any previous errors
                      try {
                        if (navigator.clipboard && window.isSecureContext) {
                          await navigator.clipboard.writeText(text);
                          console.log('📋 Message copied!');
                        } else {
                          // Fallback for older browsers or insecure contexts
                          const textarea = document.createElement('textarea');
                          textarea.value = text;
                          textarea.style.position = 'fixed';
                          textarea.style.left = '-999999px';
                          textarea.style.top = '-999999px';
                          document.body.appendChild(textarea);
                          textarea.focus();
                          textarea.select();
                          const successful = document.execCommand('copy');
                          document.body.removeChild(textarea);
                          if (successful) {
                            console.log('📋 Message copied using fallback!');
                          } else {
                            console.error('❌ Copy operation failed');
                            setCopyError('Copy operation failed. Please manually select and copy the text.');
                          }
                        }
                      } catch (error) {
                        console.error('❌ Copy failed:', error);
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        if (errorMessage.includes('permission') || errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
                          setCopyError('Clipboard access denied. Please check browser permissions.');
                        } else {
                          setCopyError('Copy operation failed. Please try again.');
                        }
                      }
                    }}
                    title="Copy message"
                    data-testid="copy-button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none dark:prose-invert break-words">
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <pre className="bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto border border-gray-700 max-w-full">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400 mb-2">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                    }}
                  >
                    {message.parts
                      .map((part) => (part.type === 'text' ? part.text : ''))
                      .join('')}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {message.parts.map((part, partIndex) =>
                      part.type === 'text' ? <span key={partIndex}>{part.text}</span> : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {(status === 'submitted' || status === 'streaming') && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 max-w-md">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-red-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300">Something went wrong.</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline mt-1"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {copyError && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 max-w-md" role="alert" data-testid="copy-error">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-red-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300">{copyError}</p>
                  <button 
                    onClick={() => setCopyError(null)} 
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={onSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            disabled={status !== 'ready'}
            data-testid="message-input"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input?.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-6 py-2 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {(status === 'submitted' || status === 'streaming') ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
import { loadChat } from '@/lib/chat-store';
import Chat from '@/components/Chat';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Individual chat page with persistence
 */
export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const messages = await loadChat(id);
  
  return <Chat id={id} initialMessages={messages} />;
}

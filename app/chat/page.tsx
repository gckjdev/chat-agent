import { redirect } from 'next/navigation';
import { createChat } from '@/lib/chat-store';

/**
 * Chat page that creates a new chat and redirects to it
 */
export default async function ChatPage() {
  const id = await createChat(); // create a new chat
  redirect(`/chat/${id}`); // redirect to chat page with ID
}

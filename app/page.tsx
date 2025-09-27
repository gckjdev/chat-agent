import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to create a new chat
  redirect('/chat');
}

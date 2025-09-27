import { generateId, UIMessage } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

/**
 * Create a new chat and return its ID
 */
export async function createChat(): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await writeFile(getChatFile(id), '[]'); // create an empty chat file
  return id;
}

/**
 * Load chat messages from storage
 */
export async function loadChat(id: string): Promise<UIMessage[]> {
  try {
    const content = await readFile(getChatFile(id), 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // If file doesn't exist, return empty array
    console.log('📁 Chat not found, creating new:', id);
    return [];
  }
}

/**
 * Save chat messages to storage
 */
export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(chatId), content);
  console.log('💾 Chat saved:', chatId, `(${messages.length} messages)`);
}

/**
 * Get the file path for a chat
 */
function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}

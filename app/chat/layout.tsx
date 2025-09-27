export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          AI Chatbot
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Powered by AI SDK - Ask me anything!
        </p>
      </div>
      {children}
    </main>
  );
}

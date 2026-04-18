'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([
    { id: '1', role: 'assistant', content: 'Hello! I\'m Lajos\' digital twin. Ask me anything about his career, skills, or experiences.', timestamp: new Date('2024-01-01T00:00:00') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, there was an error. Please try again.', timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, there was an error connecting to the AI.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-surface pt-16">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
            Chat with my Digital Twin
          </h1>
          <p className="mt-4 text-muted">
            Ask questions about my career, skills, and experiences.
          </p>

          <div className="mt-8 rounded-lg bg-elevated p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-accent text-bg-void'
                      : 'bg-white/10 text-fg'
                  }`}>
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-fg px-4 py-2 rounded-lg">
                    <p>Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-fg placeholder-muted focus:outline-none focus:border-accent"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-accent text-bg-void rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
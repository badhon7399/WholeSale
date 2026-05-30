'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Send, MessageSquare, User, Loader2, ArrowLeft, Building2 } from 'lucide-react';

interface ChatUser {
  _id: string;
  name: string;
  role: 'buyer' | 'supplier' | 'admin';
  companyName: string;
}

interface Conversation {
  user: ChatUser;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: {
    _id: string;
    name: string;
  };
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load conversations list
  const loadConversations = async () => {
    try {
      const data = await api.get('/messages/conversations');
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      const interval = setInterval(loadConversations, 10000); // refresh list every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Load message history for active user
  const loadMessages = async (otherUser: ChatUser, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const data = await api.get(`/messages/history/${otherUser._id}`);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Poll for messages in active conversation
  useEffect(() => {
    if (activeUser) {
      loadMessages(activeUser);

      // Mark messages as read
      api.post('/messages/read', { senderId: activeUser._id })
        .then(() => loadConversations())
        .catch(err => console.error('Error marking read:', err));

      const interval = setInterval(() => {
        loadMessages(activeUser, true);
      }, 3000); // poll every 3s

      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [activeUser]);

  // Scroll to bottom when message log changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      const sentMsg = await api.post('/messages', {
        receiverId: activeUser._id,
        messageText: newMessage.trim(),
      });
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage('');
      loadConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-55 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-grow max-w-[1650px] w-full mx-auto px-4 md:px-12 py-6 md:py-10 flex flex-col">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-150 flex flex-grow min-h-[600px] max-h-[800px] overflow-hidden">
          
          {/* Sidebar - conversations list */}
          <div className={`${activeUser ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] lg:w-[400px] flex-col border-r border-gray-100 bg-gray-50/50`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
                Messages
              </h1>
              <span className="bg-brand-light text-brand-primary text-xs font-bold px-3 py-1 rounded-full">
                {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
              </span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {loadingConversations ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-primary mb-2" />
                  <p className="text-sm">Loading chats...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 px-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-700">No messages yet</h3>
                  <p className="text-xs max-w-xs mt-1">Connect with buyers or suppliers from their products or requests to start chatting.</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = activeUser?._id === conv.user._id;
                  return (
                    <button
                      key={conv.user._id}
                      onClick={() => setActiveUser(conv.user)}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                          : 'bg-white hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-brand-light text-brand-primary'
                      }`}>
                        {conv.user.name.charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold truncate text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {conv.user.name}
                          </span>
                          <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Building2 className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white/70' : 'text-gray-400'}`} />
                          <span className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {conv.user.companyName || 'Personal'}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-2 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 border-2 ${
                          isSelected ? 'bg-white text-brand-primary border-brand-primary' : 'bg-red-500 text-white border-white shadow-sm'
                        }`}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active conversation pane */}
          <div className={`${activeUser ? 'flex' : 'hidden md:flex'} flex-grow flex-col bg-white`}>
            {activeUser ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                  <button 
                    onClick={() => setActiveUser(null)} 
                    className="md:hidden p-2 text-gray-500 hover:text-brand-primary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold">
                    {activeUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 leading-tight">{activeUser.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-medium">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full capitalize">{activeUser.role}</span>
                      <span>•</span>
                      <span className="truncate">{activeUser.companyName || 'Personal'}</span>
                    </div>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <p className="text-sm font-bold">Say hello to {activeUser.name}!</p>
                      <p className="text-xs mt-1">Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender._id === user.id;
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            isMe 
                              ? 'bg-brand-primary text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}>
                            <p className="leading-relaxed">{msg.message}</p>
                            <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-150 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white text-gray-800 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-brand-primary hover:bg-brand-dark text-white p-3 rounded-full transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 p-8">
                <div className="w-16 h-16 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Select a Conversation</h3>
                <p className="text-sm max-w-sm mt-1">Choose a chat from the sidebar to view message history and send messages.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
  Heart,
  LayoutGrid,
  Mic,
} from 'lucide-react';
import PageContainer from '@/components/shared/page-container';
import { useChatbotQuestion } from '@/services/chatbot-hybrid.service';
import ChatbotAudioComponent from '@/components/modals/chatbot-audio-modal';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  avatar?: string;
}

/**
 * Page Chatbot Vaccination - Interface Bi-Modale (Texte + Audio)
 */
export default function ChatbotPage() {
  const navigate = useNavigate();
  const { decodedToken } = useDecodedToken();
  const [activeMode, setActiveMode] = useState<'text' | 'audio'>('text');
  
  // Déterminer la destination du dashboard selon le rôle
  const getDashboardPath = () => {
    const role = decodedToken?.role || '';
    if (["ROLE_ICP", "ROLE_SAGE_FEMME", "ROLE_INFIRMIER"].includes(role)) {
      return "/medecin/dashboard";
    } else if (role === "ROLE_ADMIN") {
      return "/admin/localites";
    }
    return "/";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      content: '✨ Bienvenue dans votre Assistant de Vaccination!\n\nJe suis spécialisé dans:\n\n👶 Vaccination des enfants\n🤰 Vaccination prenatale\n💉 Calendrier vaccinal complet\n⚕️ Conseils généraux de santé\n\nVous pouvez me poser des questions par texte ou par audio. Choisissez votre mode ci-dessus!',
      timestamp: new Date(),
      avatar: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: askQuestion, isPending } = useChatbotQuestion();

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    askQuestion(input, {
      onSuccess: (response) => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: response.response,
          timestamp: new Date(),
          avatar: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      },
      onError: (error) => {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          type: 'bot',
          content: error instanceof Error 
            ? error.message 
            : 'Je suis désolé, je n\'ai pas pu traiter votre question. Veuillez vérifier votre connexion et réessayer.',
          timestamp: new Date(),
          avatar: 'bot',
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    });
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 0);
  };

  return (
    <PageContainer title="Assistant Vaccination">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header Pro */}
        <div className="sticky top-0 z-40 border-b bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 backdrop-blur-md shadow-lg dark:border-slate-700 border-blue-100">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Vaccimed Assistant
                </h1>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Expert en santé vaccinale • IA Powered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-0 font-semibold">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                En ligne
              </Badge>
              <Button
                size="icon"
                onClick={() => navigate(getDashboardPath())}
                title="Aller au tableau de bord"
                className="h-10 w-10 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 font-bold transition-all"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
          {/* Chat Container */}
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800 overflow-hidden">
            <CardContent className="p-0">
              {/* Messages */}
              <div className="flex h-[520px] flex-col overflow-y-auto bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900/90 p-6 space-y-4 scroll-smooth">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-fade-in ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar Bot */}
                    {message.type === 'bot' && (
                      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-blue-300 shadow-lg dark:border-blue-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold flex items-center justify-center">
                          <Heart className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Bubble Message */}
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 shadow-md transition-all ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none shadow-lg hover:shadow-lg'
                          : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-blue-100 dark:border-slate-600 rounded-bl-none shadow-md hover:shadow-lg dark:border-blue-900/30'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className={`block text-xs mt-2 ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Avatar User */}
                    {message.type === 'user' && (
                      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-blue-300 shadow-lg dark:border-blue-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center">
                          👤
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isPending && (
                  <div className="flex gap-3 justify-start animate-fade-in">
                    <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-blue-300 shadow-lg dark:border-blue-700">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold flex items-center justify-center">
                        <Heart className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-blue-100 dark:border-slate-600">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-200 font-semibold">
                          Réflexion en cours...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <Separator />

              {/* Questions Rapides */}
              {messages.length === 1 && (
                <div className="space-y-4 p-6 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900/50 dark:to-slate-800 border-t border-blue-100 dark:border-slate-700">
                  <p className="text-sm font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    📋 Questions fréquentes:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      onClick={() => handleQuickQuestion('Quels vaccins pour les enfants?')}
                      className="justify-start text-sm h-auto py-3 bg-white dark:bg-slate-700 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-all shadow-md"
                    >
                      <span className="text-lg mr-2">👶</span>
                      <span>Vaccins enfants</span>
                    </Button>
                    <Button
                      onClick={() => handleQuickQuestion('Informations sur la vaccination pendant la grossesse')}
                      className="justify-start text-sm h-auto py-3 bg-white dark:bg-slate-700 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-all shadow-md"
                    >
                      <span className="text-lg mr-2">🤰</span>
                      <span>Vaccins grossesse</span>
                    </Button>
                    <Button
                      onClick={() => handleQuickQuestion('Quels sont les effets secondaires des vaccins?')}
                      className="justify-start text-sm h-auto py-3 bg-white dark:bg-slate-700 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-all shadow-md"
                    >
                      <span className="text-lg mr-2">⚠️</span>
                      <span>Effets secondaires</span>
                    </Button>
                    <Button
                      onClick={() => handleQuickQuestion('Quel est le calendrier de vaccination?')}
                      className="justify-start text-sm h-auto py-3 bg-white dark:bg-slate-700 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-all shadow-md"
                    >
                      <span className="text-lg mr-2">📅</span>
                      <span>Calendrier vaccinal</span>
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Input Area - Mode Texte/Audio */}
              <div className="p-4 md:p-6 bg-white dark:bg-slate-800 border-t border-blue-100 dark:border-slate-700">
                <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as 'text' | 'audio')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-1">
                    <TabsTrigger value="text" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Texte</span>
                    </TabsTrigger>
                    <TabsTrigger value="audio" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                      <Mic className="h-4 w-4" />
                      <span className="hidden sm:inline">Audio</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* MODE TEXTE */}
                  <TabsContent value="text" className="space-y-3">
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Écrivez votre question..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isPending}
                          className="border-2 border-blue-200 dark:border-blue-800 rounded-full bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500 font-medium"
                        />
                        <Button
                          type="submit"
                          disabled={isPending || !input.trim()}
                          size="icon"
                          className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold italic">
                        💡 Conseil: Consultez toujours un professionnel de santé pour un diagnostic médical approfondi.
                      </p>
                    </form>
                  </TabsContent>

                  {/* MODE AUDIO */}
                  <TabsContent value="audio" className="space-y-4">
                    <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 shadow-md">
                      <ChatbotAudioComponent />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-center font-semibold italic">
                      🎤 Cliquez sur le microphone pour enregistrer votre question
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between border-t border-blue-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white dark:from-slate-900/30 dark:to-slate-800 px-6 py-4 shadow-sm">
                <div className="flex gap-4 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {messages.length - 1} messages
                  </span>
                  <Badge className="text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-0 font-bold">
                    v1.0 • Vaccimed
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    setMessages([
                      {
                        id: '0',
                        type: 'bot',
                        content: '✨ Bienvenue dans votre Assistant de Vaccination!\n\nJe suis spécialisé dans:\n\n👶 Vaccination des enfants\n🤰 Vaccination prenatale\n💉 Calendrier vaccinal complet\n⚕️ Conseils généraux de santé\n\nComment puis-je vous aider aujourd\'hui?',
                        timestamp: new Date(),
                        avatar: 'bot',
                      },
                    ])
                  }
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 font-bold transition-all"
                >
                  ↻ Nouveau chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 rounded-full -mr-16 -mt-16" />
            <CardContent className="pt-6 flex gap-4 relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-black text-blue-900 dark:text-blue-100 mb-2 text-base">🤖 Assistant IA Vaccination</p>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  Cet assistant utilise l&apos;intelligence artificielle pour répondre à vos questions sur la vaccination. 
                  <span className="font-bold text-blue-900 dark:text-blue-100"> Pour des conseils médicaux personnalisés, consultez toujours un professionnel de santé.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </PageContainer>
  );
}

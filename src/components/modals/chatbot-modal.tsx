import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Loader2, Heart, Maximize2 } from 'lucide-react';
import { useChatbotQuestion } from '@/services/chatbot-hybrid.service';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

/**
 * Modal de Chatbot Vaccination - Accessible depuis la header
 */
export function ChatbotModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      content: '👋 Bonjour! Je suis l\'assistant de vaccination Vaccimed. Comment puis-je vous aider?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: askQuestion, isPending } = useChatbotQuestion();

  // Auto-scroll vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Appeler le chatbot
    askQuestion(input, {
      onSuccess: (response) => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: response.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      },
      onError: (error) => {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          type: 'bot',
          content: error instanceof Error 
            ? error.message 
            : '❌ Je suis désolé, une erreur s\'est produite. Veuillez réessayer.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    });
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: '0',
        type: 'bot',
        content: '👋 Bonjour! Je suis l\'assistant de vaccination Vaccimed. Comment puis-je vous aider?',
        timestamp: new Date(),
      },
    ]);
  };

  const handleOpenFullscreen = () => {
    setOpen(false);
    navigate('/chatbot');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Assistant vaccination"
          className="rounded-full h-10 w-10 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/20"
        >
          <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[600px] max-w-2xl flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">Vaccimed Assistant</DialogTitle>
                <DialogDescription className="text-xs">
                  Expert en vaccination • Réponses instantanées
                </DialogDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              En ligne
            </Badge>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 rounded-md bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              {message.type === 'bot' && (
                <Avatar className="h-8 w-8 flex-shrink-0 border border-blue-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <span className={`block text-xs mt-1.5 ${
                  message.type === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {message.type === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0 border border-purple-200">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-xs flex items-center justify-center">
                    👤
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isPending && (
            <div className="flex gap-2 justify-start animate-fade-in">
              <Avatar className="h-8 w-8 flex-shrink-0 border border-blue-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs flex items-center justify-center">
                  <Heart className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg rounded-bl-none px-3 py-2 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Réflexion...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Separator />

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-slate-800 space-y-2 rounded-b-lg">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
              className="text-sm border-gray-200 dark:border-slate-600 rounded-full flex-1"
            />
            <Button
              type="submit"
              disabled={isPending || !input.trim()}
              size="icon"
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between px-2">
            <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Badge variant="outline" className="text-xs">
                {messages.length - 1} msg
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-xs h-auto p-0"
              >
                ↻ Effacer
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenFullscreen}
              title="Ouvrir en plein écran"
              className="text-xs h-auto p-0 gap-1 hover:bg-blue-50 dark:hover:bg-slate-700"
            >
              <Maximize2 className="h-3 w-3" />
              Plein écran
            </Button>
          </div>
        </div>
      </DialogContent>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </Dialog>
  );
}


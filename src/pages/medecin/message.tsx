import PageContainer from "@/components/shared/page-container";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Users,
  Pin,
  Star,
  Plus,
  Check,
  CheckCheck
} from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '@/components/shared/app-notification';

// Types pour le système de messages
interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  type: 'individual' | 'group';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  members?: string[];
  isPinned: boolean;
  isArchived: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  isOnline: boolean;
  status: string;
}

export default function Message() {
  const notification = useNotification();
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées pour les chats
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Dr. Aïssatou Ndiaye',
      avatar: '/avatars/aissatou.jpg',
      type: 'individual',
      lastMessage: 'Les résultats de vaccination sont prêts pour révision',
      lastMessageTime: '14:30',
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      isArchived: false
    },
    {
      id: '2',
      name: 'Équipe Centre de Dakar',
      type: 'group',
      lastMessage: 'Planning de demain confirmé',
      lastMessageTime: '13:45',
      unreadCount: 0,
      isOnline: false,
      members: ['Dr. Diop', 'Inf. Faye', 'Dr. Sarr'],
      isPinned: false,
      isArchived: false
    },
    {
      id: '3',
      name: 'Inf. Mamadou Fall',
      avatar: '/avatars/mamadou.jpg',
      type: 'individual',
      lastMessage: 'Merci pour les informations sur le nouveau protocole',
      lastMessageTime: '12:20',
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: false
    },
    {
      id: '4',
      name: 'Administration UHC Bambey',
      type: 'group',
      lastMessage: 'Rappel: Formation obligatoire vendredi',
      lastMessageTime: 'Hier',
      unreadCount: 1,
      isOnline: false,
      members: ['RH', 'Direction', 'Secrétariat'],
      isPinned: false,
      isArchived: false
    },
    {
      id: '5',
      name: 'Dr. Cheikh Ba',
      avatar: '/avatars/cheikh.jpg',
      type: 'individual',
      lastMessage: 'Les statistiques mensuelles sont disponibles',
      lastMessageTime: 'Hier',
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      isArchived: false
    }
  ];


  // Messages pour le chat sélectionné
  const messages: Message[] = [
    {
      id: '1',
      content: "Bonjour ! J'ai terminé l'analyse des données de vaccination de ce mois.",
      senderId: '1',
      senderName: 'Dr. Aïssatou Ndiaye',
      senderAvatar: '/avatars/aissatou.jpg',
      timestamp: '2024-09-13 14:15',
      isRead: true,
      type: 'text'
    },
    {
      id: '2',
      content: 'Excellent ! Peux-tu m’envoyer le rapport détaillé ?',
      senderId: 'me',
      senderName: 'Moi',
      timestamp: '2024-09-13 14:16',
      isRead: true,
      type: 'text'
    },
    {
      id: '3',
      content: 'Bien sûr, je te l’envoie maintenant. Il inclut les statistiques par district et par type de vaccin.',
      senderId: '1',
      senderName: 'Dr. Aïssatou Ndiaye',
      senderAvatar: '/avatars/aissatou.jpg',
      timestamp: '2024-09-13 14:17',
      isRead: true,
      type: 'text'
    },
    {
      id: '4',
      content: 'Les résultats de vaccination sont prêts pour révision',
      senderId: '1',
      senderName: 'Dr. Aïssatou Ndiaye',
      senderAvatar: '/avatars/aissatou.jpg',
      timestamp: '2024-09-13 14:30',
      isRead: false,
      type: 'text'
    }
  ];


  // Contacts disponibles
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Dr. Aïssatou Ndiaye',
      role: 'Médecin Chef',
      department: 'Centre de Dakar',
      avatar: '/avatars/aissatou.jpg',
      isOnline: true,
      status: 'Disponible'
    },
    {
      id: '2',
      name: 'Inf. Mamadou Fall',
      role: 'Infirmier',
      department: 'Poste de santé de Thiès',
      avatar: '/avatars/mamadou.jpg',
      isOnline: false,
      status: 'En pause'
    },
    {
      id: '3',
      name: 'Dr. Cheikh Ba',
      role: 'Médecin',
      department: 'Centre de Kaolack',
      avatar: '/avatars/cheikh.jpg',
      isOnline: true,
      status: 'En consultation'
    },
    {
      id: '4',
      name: 'Inf. Fatou Faye',
      role: 'Infirmière Chef',
      department: 'Administration Régionale',
      avatar: '/avatars/fatou.jpg',
      isOnline: false,
      status: 'Absent'
    }
  ];


  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages : [];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    notification.success({
      title: "Message envoyé",
      description: `Message envoyé à ${selectedChatData?.name}`
    });
    
    setMessageText('');
  };

  const handleNewChat = () => {
    notification.info({
      title: "Nouvelle conversation",
      description: "Sélectionnez un contact pour démarrer une conversation"
    });
  };

  const handleMarkAsRead = () => {
    notification.success({
      title: "Marqué comme lu",
      description: "Tous les messages ont été marqués comme lus"
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <PageContainer 
      title="Messages et Communication" 
      subtitle="Système de messagerie interne pour l'équipe médicale"
    >
      <div className="h-[calc(100vh-200px)] flex">
        
        {/* Sidebar - Liste des conversations */}
        <div className="w-1/3 border-r bg-card">
          <div className="p-4 space-y-4">
            {/* Header avec recherche */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Messages</h3>
              <Button size="sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedChat === chat.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{getInitials(chat.name)}</AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium truncate">{chat.name}</h4>
                        {chat.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                        {chat.type === 'group' && <Users className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de conversation principale */}
        <div className="flex-1 flex flex-col">
          {selectedChatData ? (
            <>
              {/* Header de la conversation */}
              <div className="border-b p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChatData.avatar} />
                      <AvatarFallback>{getInitials(selectedChatData.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChatData.name}</h3>
                      <div className="flex items-center space-x-2">
                        {selectedChatData.isOnline && (
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {selectedChatData.isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                        {selectedChatData.type === 'group' && selectedChatData.members && (
                          <span className="text-sm text-muted-foreground">
                            • {selectedChatData.members.length} membres
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Zone des messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-3 max-w-[70%] ${message.senderId === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {message.senderId !== 'me' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>{getInitials(message.senderName)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-lg p-3 ${
                        message.senderId === 'me' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.senderId === 'me' && (
                            <div className="ml-2">
                              {message.isRead ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="border-t p-4 bg-card">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[40px] max-h-[120px] resize-none"
                    />
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* État vide - Aucune conversation sélectionnée */
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center space-y-4">
                <div className="p-6 bg-muted rounded-full w-fit mx-auto">
                  <MessageCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aucune conversation sélectionnée</h3>
                  <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter</p>
                </div>
                <Button onClick={handleNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle conversation
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar droite - Contacts en ligne */}
        <div className="w-80 border-l bg-card">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Contacts en ligne</h3>
            
            <div className="space-y-3">
              {contacts.filter(contact => contact.isOnline).map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    <p className="text-xs text-green-600">{contact.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium mb-3">Tous les contacts</h4>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{contact.name}</h5>
                    <p className="text-xs text-muted-foreground">{contact.department}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${contact.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
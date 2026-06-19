import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { isWebSpeechAPISupported, isSpeechSynthesisSupported } from '@/services/chatbot-audio.service';
import { useChatbotQuestion } from '@/services/chatbot-hybrid.service';

interface AudioMessage {
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const cleanText = (raw: string): string => {
  return raw
    .replace(/\*\*([^*\n]*)\*\*/g, '$1')   // **gras** → gras
    .replace(/__([^_\n]*)__/g, '$1')         // __gras__ → gras
    .replace(/\*([^*\n]*)\*/g, '$1')         // *italique* → italique
    .replace(/_([^_\n]*)_/g, '$1')           // _italique_ → italique
    .replace(/^#{1,6}\s*/gm, '')             // ## Titres
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '') // emojis modernes
    .replace(/[\u{2600}-\u{27BF}]/gu, '')   // symboles divers (✅ ✓ etc.)
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '')   // flèches larges
    .replace(/[→•►◆■●]/g, '')               // puces et flèches textuelles
    .replace(/[ \t]{2,}/g, ' ')             // espaces multiples
    .replace(/^\s+/gm, '')                  // indentation inutile
    .trim();
};

export const ChatbotAudioComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [interimText, setInterimText] = useState('');
  const { mutate: askQuestion } = useChatbotQuestion();
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const webSpeechSupported = isWebSpeechAPISupported();
  const synthSupported = isSpeechSynthesisSupported();

  const speak = (text: string) => {
    if (!synthSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const welcome: AudioMessage = {
      type: 'assistant',
      text: "Bonjour ! Je suis votre assistant vaccination. Je peux vous aider sur les vaccins pour enfants, le calendrier vaccinal, les effets secondaires, la vaccination pendant la grossesse, les rappels adultes et bien plus encore. Cliquez sur le microphone ou choisissez une question rapide ci-dessous.",
      timestamp: new Date(),
    };
    setMessages([welcome]);
    if (synthSupported) speak(welcome.text);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText, isProcessing]);

  const sendToChatbot = (transcript: string) => {
    const userMsg: AudioMessage = { type: 'user', text: transcript, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    askQuestion(transcript, {
      onSuccess: (data) => {
        const clean = cleanText(data.response);
        const botMsg: AudioMessage = { type: 'assistant', text: clean, timestamp: new Date() };
        setMessages(prev => [...prev, botMsg]);
        speak(clean);
        setIsProcessing(false);
      },
      onError: () => {
        const errMsg: AudioMessage = {
          type: 'assistant',
          text: "Désolé, je n'ai pas pu traiter votre question. Veuillez réessayer.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errMsg]);
        setIsProcessing(false);
      },
    });
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    if (!webSpeechSupported) {
      alert("La reconnaissance vocale nécessite Google Chrome. Veuillez utiliser Chrome.");
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    finalTranscriptRef.current = '';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += t;
        } else {
          interim += t;
        }
      }
      setInterimText(interim);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
      const transcript = finalTranscriptRef.current.trim();
      if (transcript) {
        sendToChatbot(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      setInterimText('');
      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed') {
        alert("Accès au microphone refusé. Autorisez l'accès dans les paramètres de votre navigateur.");
      }
    };

    setIsRecording(true);
    recognition.start();
  };

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const last = [...messages].reverse().find(m => m.type === 'assistant');
      if (last) speak(last.text);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">

      {/* Titre */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">🎤 Chatbot Audio Vaccination</h2>
        <p className="text-gray-500 text-sm">Cliquez sur le micro, parlez, et écoutez la réponse</p>
      </div>

      {/* Zone messages */}
      <div className="bg-white rounded-xl p-4 h-80 overflow-y-auto mb-4 border border-blue-100 shadow-inner">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
              msg.type === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
              <p className="text-xs mt-1.5 opacity-50">{msg.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}

        {/* Aperçu en temps réel de ce que l'utilisateur dit */}
        {interimText && (
          <div className="flex justify-end mb-3">
            <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-none bg-blue-200/60 text-blue-700 text-sm italic">
              {interimText}…
            </div>
          </div>
        )}

        {/* Indicateur de traitement */}
        {isProcessing && (
          <div className="flex justify-start mb-3">
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-100 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Questions rapides — affichées uniquement au départ */}
      {messages.length === 1 && !isRecording && !isProcessing && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-semibold mb-2 text-center uppercase tracking-wide">
            Questions fréquentes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '👶', label: 'Vaccins enfants', q: 'Quels vaccins sont obligatoires pour les enfants ?' },
              { emoji: '🤰', label: 'Grossesse', q: 'Quels vaccins pendant la grossesse ?' },
              { emoji: '📅', label: 'Calendrier vaccinal', q: 'Quel est le calendrier de vaccination au Sénégal ?' },
              { emoji: '⚠️', label: 'Effets secondaires', q: 'Quels sont les effets secondaires des vaccins ?' },
              { emoji: '💉', label: 'BCG', q: 'À quoi sert le vaccin BCG ?' },
              { emoji: '🧑', label: 'Vaccins adultes', q: 'Quels vaccins recommandez-vous pour les adultes ?' },
            ].map(({ emoji, label, q }) => (
              <button
                key={q}
                onClick={() => sendToChatbot(q)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50 text-left text-xs text-gray-700 font-medium shadow-sm transition-all"
              >
                <span className="text-base flex-shrink-0">{emoji}</span>
                <span className="leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-center gap-5">

        {/* Bouton microphone */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110 focus:ring-red-300'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed focus:ring-blue-300'
            }`}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
            )}
            {isRecording
              ? <MicOff className="text-white w-7 h-7 relative z-10" />
              : <Mic className="text-white w-7 h-7" />
            }
          </button>
          <span className="text-xs text-gray-500 font-medium">
            {isRecording ? 'Arrêter' : 'Parler'}
          </span>
        </div>

        {/* Bouton haut-parleur — visible seulement s'il y a des réponses */}
        {messages.length > 1 && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleSpeakerClick}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none focus:ring-4 hover:scale-105 ${
                isSpeaking
                  ? 'bg-amber-400 hover:bg-amber-500 focus:ring-amber-300'
                  : 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
              }`}
            >
              {isSpeaking
                ? <VolumeX className="text-white w-5 h-5" />
                : <Volume2 className="text-white w-5 h-5" />
              }
            </button>
            <span className="text-xs text-gray-500 font-medium">
              {isSpeaking ? 'Arrêter' : 'Écouter'}
            </span>
          </div>
        )}
      </div>

      {/* Statut */}
      <p className={`text-center text-sm mt-4 font-medium min-h-[1.25rem] ${
        isRecording   ? 'text-red-600'    :
        isProcessing  ? 'text-blue-600'   :
        isSpeaking    ? 'text-amber-600'  :
        'text-gray-400'
      }`}>
        {isRecording
          ? '🎤 Parlez… cliquez pour terminer'
          : isProcessing
          ? '⏳ Recherche de la réponse…'
          : isSpeaking
          ? '🔊 Lecture en cours…'
          : '🎙️ Cliquez sur le micro pour poser votre question'}
      </p>

      {/* Support navigateur */}
      <div className="mt-4 text-center text-xs text-gray-400 space-y-0.5">
        <p>Micro : {webSpeechSupported ? '✅' : '❌'} · Son : {synthSupported ? '✅' : '❌'}</p>
        {!webSpeechSupported && (
          <p className="text-red-500 font-medium">⚠️ Utilisez Google Chrome pour la reconnaissance vocale</p>
        )}
      </div>
    </div>
  );
};

export default ChatbotAudioComponent;

import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader,
} from 'lucide-react';
import {
  recordAudio,
  isWebSpeechAPISupported,
  isSpeechSynthesisSupported,
  playTextAudio,
} from '@/services/chatbot-audio.service';
import { useChatbotQuestion } from '@/services/chatbot-hybrid.service';

interface AudioMessage {
  type: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

export const ChatbotAudioComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const { mutate: askQuestion } = useChatbotQuestion();
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Vérifier les capacités du navigateur
  const webSpeechSupported = isWebSpeechAPISupported();
  const speechSynthesisSupported = isSpeechSynthesisSupported();

  // Message de bienvenue automatique
  useEffect(() => {
    const welcomeMessage: AudioMessage = {
      type: 'assistant',
      text: 'Bonjour, je suis votre assistant virtuel en vaccination. Comment puis-je vous aider aujourd\'hui? Vous pouvez me poser des questions sur les vaccins, les calendriers de vaccination, ou les effets secondaires.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Jouer le message de bienvenue
    if (speechSynthesisSupported) {
      playTextAudio(welcomeMessage.text);
    }
  }, [speechSynthesisSupported]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Démarrer enregistrement audio
  const handleStartRecording = async () => {
    if (!webSpeechSupported) {
      alert("Votre navigateur ne supporte pas l'enregistrement audio");
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);

      // Timer pour afficher durée
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Enregistrer MAXIMUM 30 secondes (avec transcription en temps réel)
      const result = await recordAudio(30000);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      setIsRecording(false);

      // Transcript déjà fait pendant l'enregistrement!
      const transcript = result.transcript;

      if (!transcript) {
        alert('Impossible de transcrire votre parole. Veuillez réessayer.');
        return;
      }

      setIsProcessing(true);

      // Ajouter message utilisateur
      const userMessage: AudioMessage = {
        type: 'user',
        text: transcript,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      console.log('[AUDIO] Transcription:', transcript);

      // Obtenir réponse du chatbot
      askQuestion(transcript, {
        onSuccess: (data) => {
          const assistantMessage: AudioMessage = {
            type: 'assistant',
            text: data.response,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Synthétiser la réponse en audio
          if (speechSynthesisSupported) {
            handleSpeakText(data.response);
          }

          setIsProcessing(false);
        },
        onError: (error) => {
          console.error('[AUDIO] Chatbot error:', error);
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error('[AUDIO] Recording error:', error);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setIsRecording(false);
      setIsProcessing(false);
      alert('Erreur lors de l\'enregistrement: ' + (error as Error).message);
    }
  };

  // Convertir texte en parole et jouer
  const handleSpeakText = async (text: string) => {
    if (!speechSynthesisSupported) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    try {
      setIsSpeaking(true);

      // Utiliser Web Speech API
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synth.speak(utterance);
    } catch (error) {
      console.error('[AUDIO] Speak error:', error);
      setIsSpeaking(false);
    }
  };

  // Arrêter la parole
  const handleStopSpeaking = () => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
      {/* Titre */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎤 Chatbot Vaccination Audio
        </h2>
        <p className="text-gray-600">
          Parlez et écoutez les réponses sur la vaccination
        </p>
        {!webSpeechSupported && (
          <p className="text-red-600 mt-2 text-sm">
            ⚠️ Votre navigateur ne supporte pas l'enregistrement audio
          </p>
        )}
      </div>

      {/* Zone Messages */}
      <div className="bg-white rounded-lg p-4 h-96 overflow-y-auto mb-4 border-2 border-gray-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">
              Cliquez sur le microphone pour commencer à poser une question!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Durée d'enregistrement */}
      {isRecording && (
        <div className="text-center mb-4 text-red-600 font-semibold">
          Enregistrement en cours: {recordingTime}s
        </div>
      )}

      {/* Boutons Contrôle */}
      <div className="flex gap-3 justify-center flex-wrap">
        {/* Microphone */}
        <button
          onClick={handleStartRecording}
          disabled={isRecording || isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
          }`}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          {isRecording ? 'Arrêter' : 'Parler'}
        </button>

        {/* Haut-parleur */}
        {messages.length > 0 && (
          <button
            onClick={
              isSpeaking
                ? handleStopSpeaking
                : () => {
                    const lastAssistantMsg = [...messages]
                      .reverse()
                      .find((m) => m.type === 'assistant');
                    if (lastAssistantMsg) {
                      handleSpeakText(lastAssistantMsg.text);
                    }
                  }
            }
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              isSpeaking
                ? 'bg-yellow-500 text-white animate-pulse'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isSpeaking ? 'Arrêter' : 'Écouter'}
          </button>
        )}

        {/* Indicateur traitement */}
        {isProcessing && (
          <div className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg">
            <Loader size={20} className="animate-spin" />
            <span>Traitement...</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">💡 Comment utiliser:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Cliquez sur <strong>Parler</strong> et posez votre question</li>
          <li>Le chatbot retape et répond automatiquement</li>
          <li>Cliquez sur <strong>Écouter</strong> pour entendre la réponse</li>
          <li>Support: Français, avec accents sénégalais</li>
        </ul>
      </div>

      {/* Statut navigateur */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>
          🔊 Synthèse: {speechSynthesisSupported ? '✅' : '❌'} |
          🎤 Enregistrement: {webSpeechSupported ? '✅' : '❌'}
        </p>
      </div>
    </div>
  );
};

export default ChatbotAudioComponent;

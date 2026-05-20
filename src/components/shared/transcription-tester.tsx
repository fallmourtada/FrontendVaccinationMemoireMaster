import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Trash2, Volume2 } from 'lucide-react';
import useTranscription from '@/hooks/use-transcription';

/**
 * Composant de test pour la transcription audio
 * Permet de tester la reconnaissance vocale
 */
export function TranscriptionTester() {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    error,
  } = useTranscription({
    language: 'fr-FR',
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayback = () => {
    if (!transcript) return;

    setIsPlaying(true);
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlaying(false);
    synth.speak(utterance);
  };

  if (!isSupported) {
    return (
      <Card className="w-full bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">Transcription Audio</CardTitle>
          <CardDescription className="text-red-700">
            Web Speech API non supportée sur ce navigateur
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-red-700">
          Navigateurs supportés: Chrome, Firefox, Safari, Edge
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Testeur de Transcription
        </CardTitle>
        <CardDescription>
          Testez la reconnaissance vocale et l'API de synthèse vocale
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contrôles */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={startListening}
            disabled={isListening}
            variant={isListening ? 'destructive' : 'default'}
            size="sm"
          >
            <Mic className="w-4 h-4 mr-2" />
            Écouter
          </Button>

          <Button
            onClick={stopListening}
            disabled={!isListening}
            variant="secondary"
            size="sm"
          >
            <MicOff className="w-4 h-4 mr-2" />
            Arrêter
          </Button>

          <Button
            onClick={handlePlayback}
            disabled={!transcript || isPlaying}
            variant="outline"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Lire à haute voix
          </Button>

          <Button
            onClick={clearTranscript}
            disabled={!transcript}
            variant="ghost"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer
          </Button>
        </div>

        {/* Statut */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm font-medium text-blue-900">
            Statut:{' '}
            <span className={isListening ? 'text-red-600 animate-pulse' : 'text-green-600'}>
              {isListening ? '🔴 Écoute en cours...' : '🟢 Prêt'}
            </span>
          </p>
        </div>

        {/* Erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-900 font-medium">Erreur:</p>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        {/* Texte intérimaire */}
        {interimTranscript && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm font-medium text-yellow-900">
              Reconnaissant:
            </p>
            <p className="text-sm text-yellow-700 italic">{interimTranscript}</p>
          </div>
        )}

        {/* Transcription finale */}
        <div className="bg-gray-50 border border-gray-300 rounded p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Transcription finale:
          </p>
          <p className="text-gray-700 min-h-20 whitespace-pre-wrap">
            {transcript || '(Aucun texte reconnu)'}
          </p>
        </div>

        {/* Conseil */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
          <p className="font-medium text-blue-900 mb-1">💡 Conseil:</p>
          <ul className="text-blue-700 space-y-1 list-disc list-inside">
            <li>Parlez clairement dans le microphone</li>
            <li>L'application écoute pendant quelques secondes</li>
            <li>Utilisez le français (fr-FR)</li>
            <li>Assurez que le microphone a les permissions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default TranscriptionTester;

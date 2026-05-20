import { useState, useCallback, useRef } from 'react';
import {
  isWebSpeechSupported,
} from '@/utils/transcription-config';

export interface UseTranscriptionOptions {
  language?: string;
  onTranscriptionStart?: () => void;
  onTranscriptionEnd?: (transcript: string) => void;
  onError?: (error: Error) => void;
}

export interface UseTranscriptionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: Error | null;
}

/**
 * Hook pour la transcription audio client-side
 * Utilise Web Speech API (Chrome, Safari, Firefox, Edge)
 */
export function useTranscription(
  options: UseTranscriptionOptions = {}
): UseTranscriptionReturn {
  const {
    language = 'fr-FR',
    onTranscriptionStart,
    onTranscriptionEnd,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported = isWebSpeechSupported();

  const startListening = useCallback(() => {
    if (!isSupported) {
      const err = new Error(
        'Web Speech API not supported in this browser'
      );
      setError(err);
      onError?.(err);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.language = language;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setError(null);
          onTranscriptionStart?.();
        };

        recognitionRef.current.onresult = (
          event: any
        ) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              final += transcriptSegment;
            } else {
              interim += transcriptSegment;
            }
          }

          setInterimTranscript(interim);
          setTranscript((prev) => prev + final);
        };

        recognitionRef.current.onerror = (
          event: any
        ) => {
          const err = new Error(
            `Speech recognition error: ${event.error}`
          );
          setError(err);
          onError?.(err);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          onTranscriptionEnd?.(transcript + interimTranscript);
        };
      }

      recognitionRef.current.start();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }
  }, [isSupported, language, onTranscriptionStart, onTranscriptionEnd, transcript, interimTranscript, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript: transcript + interimTranscript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    error,
  };
}

export default useTranscription;

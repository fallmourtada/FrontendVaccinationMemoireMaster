/**
 * Configuration pour les services de transcription audio
 */

export const TRANSCRIPTION_PROVIDERS = {
  WEB_SPEECH: 'web-speech-api',
  GOOGLE: 'google',
  AZURE: 'azure',
  DEEPGRAM: 'deepgram',
} as const;

export type TranscriptionProvider =
  (typeof TRANSCRIPTION_PROVIDERS)[keyof typeof TRANSCRIPTION_PROVIDERS];

export interface TranscriptionConfig {
  provider: TranscriptionProvider;
  language: string;
  apiKey?: string;
  endpoint?: string;
}

// Configuration par défaut
export const DEFAULT_TRANSCRIPTION_CONFIG: TranscriptionConfig = {
  provider: TRANSCRIPTION_PROVIDERS.WEB_SPEECH,
  language: 'fr-FR',
  apiKey: import.meta.env.VITE_TRANSCRIPTION_API_KEY || '',
  endpoint:
    import.meta.env.VITE_TRANSCRIPTION_ENDPOINT ||
    'https://api.example.com/transcribe',
};

// Configuration pour chaque provider
export const PROVIDER_CONFIGS = {
  [TRANSCRIPTION_PROVIDERS.WEB_SPEECH]: {
    supported: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window,
    requiresApiKey: false,
    languages: ['fr-FR', 'en-US', 'es-ES'],
    maxAudioDuration: 30000,
  },
  [TRANSCRIPTION_PROVIDERS.GOOGLE]: {
    supported: true,
    requiresApiKey: true,
    endpoint: 'https://speech.googleapis.com/v1/speech:recognize',
    languages: ['fr-FR', 'en-US', 'es-ES'],
    encoding: 'WEBM_OPUS',
  },
  [TRANSCRIPTION_PROVIDERS.AZURE]: {
    supported: true,
    requiresApiKey: true,
    endpoint:
      import.meta.env.VITE_AZURE_ENDPOINT ||
      'https://{region}.stt.speech.microsoft.com',
    languages: ['fr-FR', 'en-US', 'es-ES'],
    region: import.meta.env.VITE_AZURE_REGION || 'eastus',
  },
  [TRANSCRIPTION_PROVIDERS.DEEPGRAM]: {
    supported: true,
    requiresApiKey: true,
    endpoint: 'https://api.deepgram.com/v1/listen',
    languages: ['fr-FR', 'en-US', 'es-ES'],
    models: ['nova', 'enhanced', 'base'],
  },
};

/**
 * Variables d'environnement requises
 * Ajouter à .env.local:
 *
 * # Google Cloud Speech-to-Text
 * VITE_TRANSCRIPTION_API_KEY=your_google_api_key
 *
 * # Azure Cognitive Services
 * VITE_AZURE_ENDPOINT=https://your-region.stt.speech.microsoft.com
 * VITE_AZURE_REGION=eastus
 * VITE_AZURE_API_KEY=your_azure_api_key
 *
 * # Deepgram
 * VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
 *
 * # Provider selection
 * VITE_TRANSCRIPTION_PROVIDER=web-speech-api
 */

export function getTranscriptionProvider(): TranscriptionProvider {
  const envProvider = import.meta.env.VITE_TRANSCRIPTION_PROVIDER;
  
  if (
    envProvider &&
    Object.values(TRANSCRIPTION_PROVIDERS).includes(envProvider)
  ) {
    return envProvider as TranscriptionProvider;
  }

  // Fallback based on browser support
  if (isWebSpeechSupported()) {
    return TRANSCRIPTION_PROVIDERS.WEB_SPEECH;
  }

  return TRANSCRIPTION_PROVIDERS.WEB_SPEECH;
}

export function isWebSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window ||
      'SpeechRecognition' in window)
  );
}

export function getAvailableProviders(): TranscriptionProvider[] {
  return Object.values(TRANSCRIPTION_PROVIDERS).filter((provider) => {
    const config = PROVIDER_CONFIGS[provider];
    return config.supported;
  });
}

export function getProviderConfig(
  provider: TranscriptionProvider
): (typeof PROVIDER_CONFIGS)[keyof typeof PROVIDER_CONFIGS] {
  return PROVIDER_CONFIGS[provider];
}

/**
 * Mock API pour transcription audio
 * En production, utiliser: Google Speech-to-Text, Azure, ou Deepgram
 */

// Mock implementation - À remplacer par une vrai API
export async function mockTranscribeAudio(
  _audioBlob: Blob
): Promise<string> {
  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En production, vous enverriez l'audio à un service REST
  // const formData = new FormData();
  // formData.append('audio', audioBlob);
  // const response = await fetch('https://api.example.com/transcribe', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${API_KEY}` },
  //   body: formData,
  // });

  // Mock response
  const mockResponses = [
    'Pourquoi vacciner les enfants?',
    'Calendrier vaccinal complet',
    'Effets secondaires des vaccins',
    'Importance de la vaccination',
    'Risques de ne pas vacciner',
    'Vaccins pendant la grossesse',
    'Mythes sur les vaccins',
    'Recommandations OMS',
  ];

  return mockResponses[
    Math.floor(Math.random() * mockResponses.length)
  ];
}

/**
 * Configuration pour utiliser Google Speech Recognition API
 * Ajouter clé API à .env.local
 */
export const TRANSCRIPTION_CONFIG = {
  provider: 'web-speech-api', // ou 'google', 'azure', 'deepgram'
  language: 'fr-FR',
  interim_results: true,
  max_alternatives: 1,
};

/**
 * Configuration pour Google Cloud Speech-to-Text
 */
export async function transcribeWithGoogle(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          languageCode: 'fr-FR',
          model: 'default',
        },
        audio: {
          content: await blobToBase64(audioBlob),
        },
      }),
    }
  );

  const data = await response.json();
  return data.results?.[0]?.alternatives?.[0]?.transcript || '';
}

/**
 * Configuration pour Azure Cognitive Services
 */
export async function transcribeWithAzure(
  audioBlob: Blob,
  endpoint: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `${endpoint}/speechtotext/synthesize?language=fr-FR`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'audio/wav',
      },
      body: audioBlob,
    }
  );

  const data = await response.json();
  return data.recognitionStatus === 'Success'
    ? data.bestResultsWithNBest?.[0]?.display || ''
    : '';
}

/**
 * Configuration pour Deepgram API
 */
export async function transcribeWithDeepgram(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova&language=fr&punctuate=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/webm',
      },
      body: audioBlob,
    }
  );

  const data = await response.json();
  return (
    data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
  );
}

/**
 * Utilitaires
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export { mockTranscribeAudio as transcribeAudio };

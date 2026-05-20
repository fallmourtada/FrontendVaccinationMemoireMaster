/**
 * Service Audio pour le Chatbot Vaccination
 * Convertit micro (audio) → texte → réponse → audio
 */

export interface AudioResponse {
  success: boolean;
  transcript?: string;
  response?: string;
  audioUrl?: string;
  error?: string;
}

/**
 * Transcription audio en texte via Web Speech API (CLIENT-SIDE)
 */
export async function transcribeAudio(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Utiliser Web Speech API pour la reconnaissance vocale directe
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.language = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      let transcript = '';

      recognition.onstart = () => {
        console.log('Recording started...');
      };

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        reject(new Error('Transcription failed: ' + event.error));
      };

      recognition.onend = () => {
        console.log('Recording ended');
      };

      // Démarrer transcription
      recognition.start();

    } catch (error) {
      console.error('Error transcribing audio:', error);
      reject(error);
    }
  });
}

/**
 * Synthèse texte en parole (Text-to-Speech)
 */
export async function synthesizeToSpeech(
  text: string,
  language: string = 'fr-FR'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const synth = window.speechSynthesis;
      
      // Annuler toute parole en cours
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9; // Vitesse normale
      utterance.pitch = 1;
      utterance.volume = 1;

      // Enregistrer l'audio (approximatif)
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const mediaRecorder = new MediaRecorder(
        audioContext.createMediaStreamDestination().stream
      );

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        resolve(blob);
      };

      utterance.onend = () => {
        mediaRecorder.stop();
      };

      synth.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Alternative: Utiliser API Web pour TTS (Google/Microsoft)
 */
export async function synthesizeWithAPI(
  text: string,
  language: string = 'fr'
): Promise<Blob> {
  try {
    // Option 1: Utiliser Azure Cognitive Services (besoin clé API)
    const response = await fetch('https://api.example.com/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_TTS_KEY}`,
      },
      body: JSON.stringify({
        text,
        language,
        voice: 'female',
        speed: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error('TTS API error');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}

/**
 * Récupérer les appareils audio disponibles
 */
export async function getAudioDevices(): Promise<
  MediaDeviceInfo[]
> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(
      (device) =>
        device.kind === 'audioinput' || device.kind === 'audiooutput'
    );
  } catch (error) {
    console.error('Error getting audio devices:', error);
    return [];
  }
}

/**
 * Vérifier si le navigateur supporte Web Speech API
 */
export function isWebSpeechAPISupported(): boolean {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return !!SpeechRecognition;
}

/**
 * Vérifier si le navigateur supporte Speech Synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return !!window.speechSynthesis;
}

/**
 * Enregistrer audio du micro
 */
/**
 * Enregistrement audio + transcription EN TEMPS RÉEL
 * Préférer cette méthode qui transcrit simultanément
 */
export async function recordAudio(
  durationMs: number = 5000
): Promise<{ audioBlob: Blob; transcript: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialiser la reconnaissance vocale EN TEMPS RÉEL
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.language = 'fr-FR';
      recognition.continuous = true; // Important: capture tout le discours
      recognition.interimResults = true;

      // Enregistrer aussi le blob
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      let finalTranscript = '';
      let isActive = true;

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recognition.onstart = () => {
        console.log('🎤 Recording started...');
      };

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            console.log('✓ Final:', transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Recognition error:', event.error);
      };

      recognition.onend = () => {
        console.log('⏹️ Recording ended');
      };

      // Démarrer SIMULTANÉMENT
      recognition.start();
      mediaRecorder.start();

      // Arrêter après durée
      const timeout = setTimeout(() => {
        if (isActive) {
          isActive = false;
          try {
            recognition.stop();
          } catch (e) {}
          mediaRecorder.stop();
        }
      }, durationMs);

      mediaRecorder.onstop = () => {
        clearTimeout(timeout);
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        
        resolve({
          audioBlob,
          transcript: finalTranscript.trim(),
        });
      };
    } catch (error) {
      console.error('❌ Recording error:', error);
      reject(error);
    }
  });
}

/**
 * Jouer un texte à haute voix immédiatement
 */
export function playTextAudio(text: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve(); // Continuer même en cas d'erreur
      };

      synth.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
      resolve();
    }
  });
}

/**
 * Jouer un fichier audio
 */
export function playAudio(audioUrl: string): void {
  const audio = new Audio(audioUrl);
  audio.play().catch((e) => {
    console.error('Error playing audio:', e);
  });
}

/**
 * Créer Blob URL pour l'audio
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

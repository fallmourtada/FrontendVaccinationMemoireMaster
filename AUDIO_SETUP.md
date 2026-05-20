# 🎧 Système Audio et Transcription - Documentation

## Vue d'ensemble

Ce système permet la transcription vocale et la synthèse par texte en français pour l'application de vaccinations Web.

**Fonctionnalités:**
- 🎤 Enregistrement audio du microphone (max 30 secondes)
- 🔊 Transcription vocale (parole → texte)
- 💬 Questions en français au chatbot vaccination
- 📢 Synthèse vocale (texte → parole)
- 🌐 Fonctionne dans le navigateur (aucun backend requis)
- 🔐 Données non stockées, traitement local

## Architecture

```
┌─────────────────────────────────────────────┐
│        Audio Chatbot Interface               │
│  (chatbot-audio-modal.tsx)                   │
└──────────────┬──────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│  Recording   │  │   Transcription  │
│  Media API   │  │   Web Speech API │
└──────────────┘  └──────────────────┘
      │                 │
      └────────┬────────┘
               ▼
    ┌─────────────────────────┐
    │  Process Question       │
    │  (use-chatbot-question) │
    └────────────┬────────────┘
                 ▼
    ┌─────────────────────────┐
    │  Search Local Dataset   │
    │  (vaccination-qa)       │
    └────────────┬────────────┘
                 ▼
    ┌──────────────────────────┐
    │  Synthesize to Speech    │
    │  (Speech Synthesis API)  │
    └────────────┬─────────────┘
                 ▼
         ┌──────────────┐
         │  Playback    │
         │  to Speaker  │
         └──────────────┘
```

## Fichiers créés

### 1. Services
#### `src/services/chatbot-audio.service.ts`
- **Fonction:** Orchestration des opérations audio
- **Fonctions clés:**
  - `recordAudio(durationMs)` - Enregistrer le microphone
  - `transcribeAudio(blob)` - Convertir audio-texte
  - `synthesizeToSpeech(text)` - Convertir texte-audio
  - `getAudioDevices()` - Lister appareils audio
  - Support navigateur: Chrome, Firefox, Safari, Edge
  
#### `src/services/transcription.service.ts`
- **Fonction:** Fournisseurs de transcription alternatifs
- **Options:**
  - `mockTranscribeAudio()` - Démo sans API externe
  - `transcribeWithGoogle()` - Google Cloud Speech-to-Text
  - `transcribeWithAzure()` - Azure Cognitive Services
  - `transcribeWithDeepgram()` - Deepgram API

### 2. Configuration
#### `src/utils/transcription-config.ts`
- **Fonction:** Configuration centralisée pour la transcription
- **Contient:**
  - Définitions des providers (Web Speech, Google, Azure, Deepgram)
  - Configuration par provider
  - Détection du support navigateur
  - Variables d'environnement

### 3. Hooks personnalisés
#### `src/hooks/use-transcription.ts`
- **Fonction:** Hook React pour la transcription
- **API:**
  ```javascript
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    error
  } = useTranscription({ language: 'fr-FR' });
  ```

### 4. Composants UI
#### `src/components/modals/chatbot-audio-modal.tsx`
- **Fonction:** Interface principale de chat audio
- **Caractéristiques:**
  - Bouton enregistrement/arrêt
  - Historique des messages
  - Playback audio
  - Timer d'enregistrement
  - Détection d'erreurs

#### `src/components/shared/transcription-tester.tsx`
- **Fonction:** Composant de test pour la transcription
- **Utilité:** Tester et debugger la reconnaissance vocale

#### `src/pages/chatbot-audio-page.tsx`
- **Fonction:** Page complète avec documentation
- **Sections:**
  - Chat audio
  - Fonctionnalités
  - Topics supportés
  - FAQ
  - Support

### 5. Configuration
#### `.env.example`
- **Fonction:** Template de configuration
- **Variables:**
  ```
  VITE_TRANSCRIPTION_PROVIDER=web-speech-api
  VITE_AZURE_ENDPOINT=https://...
  VITE_DEEPGRAM_API_KEY=...
  ```

## Flux d'utilisation

### Scénario 1: Utiliser avec Web Speech API (défaut)

```javascript
// 1. Importer le service
import { recordAudio, transcribeAudio, synthesizeToSpeech } from '@/services/chatbot-audio.service';

// 2. Enregistrer l'audio
const audioBlob = await recordAudio(30000); // 30s max

// 3. Transcriber
const text = await transcribeAudio(audioBlob);

// 4. Traiter la question
const response = await useChatbotQuestion(text);

// 5. Synthétiser la réponse
const audioResponse = await synthesizeToSpeech(response);

// 6. Jouer le son
audioResponse.play();
```

### Scénario 2: Utiliser avec Hook

```javascript
import useTranscription from '@/hooks/use-transcription';

export function MyChatComponent() {
  const { isListening, transcript, startListening, stopListening } = useTranscription();

  return (
    <>
      <button onClick={startListening} disabled={isListening}>
        🎤 Écouter
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Arrêter
      </button>
      <p>Vous avez dit: {transcript}</p>
    </>
  );
}
```

### Scénario 3: Utiliser le composant prêt-à-l'emploi

```javascript
import ChatbotAudioModal from '@/components/modals/chatbot-audio-modal';

export function MyPage() {
  return <ChatbotAudioModal />;
}
```

## Configuration des providers

### Web Speech API (Défaut - Recommandé pour DEV)
- ✅ Aucune configuration requise
- ✅ Fonctionne hors-ligne
- ✅ Gratuit
- ✅ Déjà dans tous les navigateurs modernes
- ⚠️ Moins précis que les services cloud

### Google Cloud Speech-to-Text
1. Créer un compte Google Cloud: https://cloud.google.com
2. Activer l'API Speech-to-Text
3. Créer une clé API
4. Ajouter à `.env.local`:
   ```
   VITE_TRANSCRIPTION_PROVIDER=google
   VITE_TRANSCRIPTION_API_KEY=your_key
   VITE_GOOGLE_PROJECT_ID=your_project
   ```
5. Prix: ~$0.006/minute, 60 min gratuit/mois

### Azure Cognitive Services
1. Créer une ressource sur Azure: https://portal.azure.com
2. Copier la clé et la région
3. Ajouter à `.env.local`:
   ```
   VITE_TRANSCRIPTION_PROVIDER=azure
   VITE_AZURE_ENDPOINT=https://region.stt.speech.microsoft.com
   VITE_AZURE_API_KEY=your_key
   ```
4. Stratégies tarifaires: Gratuit (5h/mois), Payant

### Deepgram (Recommandé pour PROD)
1. Créer un compte: https://console.deepgram.com
2. Générer une clé API
3. Ajouter à `.env.local`:
   ```
   VITE_TRANSCRIPTION_PROVIDER=deepgram
   VITE_DEEPGRAM_API_KEY=your_key
   ```
4. Prix: Gratuit (50k requêtes/mois), Payant
5. ✅ Meilleure précision, supporte accents

## Dépannage

### "Web Speech API not supported"
- **Cause:** Navigateur incompatible
- **Solution:** Utiliser Chrome, Firefox, Safari ou Edge
- **Alternative:** Configurer un provider cloud (Google, Azure, Deepgram)

### Microphone ne fonctionne pas
- **Cause:** Permission refusée
- **Solution:** 
  1. Aller à `chrome://settings/content/microphone`
  2. Autoriser le site
  3. Rafraîchir la page

### Transcription vide
- **Cause:** Microphone non reconnu ou très silencieux
- **Solution:**
  1. Vérifier les niveaux audio
  2. Parler plus près du microphone
  3. Vérifier avec TranscriptionTester

### API retourne erreur
- **Cause:** Clé API expirée ou limite atteinte
- **Solution:** Vérifier la clé, les quotas, le compte

## Tests

### Composant de test inclus

```bash
# Accéder à la page de test
/transcription-test

# Ou importer dans un composant
import TranscriptionTester from '@/components/shared/transcription-tester';
<TranscriptionTester />
```

## Performance et limites

| Aspect | Limite | Notes |
|--------|--------|-------|
| Durée d'enregistrement | 30 secondes | Configurable |
| Langues supportées | fr-FR, en-US, es-ES | Dépend du provider |
| Latence Web Speech | ~1-2 secondes | Local, pas d'API |
| Latence provider cloud | ~3-5 secondes | Dépend du réseau |
| Précision | 85-95% | Selon le provider |
| Coût | $0-0.006/min | Selon provider |

## Sécurité

- 🔒 Données audio stockées comme Blob (RAM)
- 🔒 Aucune sauvegarde sans consentement
- 🔒 Clés API isolées en `.env.local` (jamais committées)
- 🔒 HTTPS recommandé en production
- 🔒 Web Speech API traite localement (pas d'upload)

## Prochaines étapes recommandées

1. **Test en production:**
   - Tester sur véritables appareils
   - Tester sur navigateurs différents
   - Mesurer les performances réseau

2. **Optimisations:**
   - Ajouter du cache des réponses
   - Implémenter Service Worker
   - Compression audio

3. **Améliorations UX:**
   - Ajouter plus de langues
   - Visualizer le niveau audio
   - Historique sauvegardé côté client

4. **Monitoring:**
   - Logger les erreurs API
   - Suivre l'usage (combien utilisent audio?)
   - Analytics sur les questions fréquentes

## Ressources

- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Speech Synthesis API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
- [Google Speech-to-Text Docs](https://cloud.google.com/speech-to-text/docs)
- [Azure Speech Services](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/)
- [Deepgram Developer Docs](https://developers.deepgram.com/)

## Support

Pour obtenir de l'aide:
1. Consultez la section FAQ de la page audio (`/chatbot-audio`)
2. Vérifiez les logs navigateur (F12 → Console)
3. Testez avec TranscriptionTester
4. Vérifiez les permissions du microphone

---

**Dernière mise à jour:** 2024
**Version:** 1.0.0
**Auteur:** Sistema de Vacunación Web

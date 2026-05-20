# 🧪 Guide de test - Système Audio et Transcription

## Vue rapide

| Page | URL | Fonction |
|------|-----|----------|
| Chat Audio | `/chatbot-audio` | Interface complète de chat vocal |
| Testeur Audio | `/transcription-test` | Outil de diagnostic et test |
| Chat Texte | `/chatbot` | Chatbot textuel (référence) |

## Procédure de test - Chat Audio

### Prérequis
- ✅ Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- ✅ Un microphone fonctionnel
- ✅ Les permissions d'accès au microphone accordées
- ✅ Le serveur Vite en cours d'exécution

### Test de base

1. **Démarrer l'application:**
   ```bash
   cd vaccination_web
   npm install
   npm run dev
   ```

2. **Accéder à la page audio:**
   - Ouvrir: `http://localhost:5173/chatbot-audio`

3. **Autoriser le microphone:**
   - Le navigateur demande la permission
   - Cliquer "Autoriser"

4. **Tester l'enregistrement:**
   - Cliquer sur le bouton 🎤 "Parler"
   - Parler clairement pendant 5-10 secondes
   - Dire: "Pourquoi vacciner?"
   - Cliquer alors "Arrêter" ou attendre 30s

5. **Vérifier la transcription:**
   - Voir le texte reconnu en-dessous ("Reconnaisant...")
   - Vérifier que votre question est correctement transcrite

6. **Vérifier la réponse:**
   - Attendre l'indicateur "Traitement..."
   - Voir la réponse du chatbot dans l'historique

7. **Écouter la réponse:**
   - Cliquer sur 🔊 "Écouter" pour entendre la réponse

8. **Tester le playback:**
   - Le son devrait sortir sur les haut-parleurs
   - Vérifier que c'est du français clair

### Cas de test avancés

#### Test 1: Microphone non trouvé
**Étapes:**
1. Débranchez le microphone
2. Cliquez 🎤 "Parler"
3. **Résultat attendu:** Message d'erreur "Permission denied"

**Dépannage:** Vérifier les permissions du navigateur

#### Test 2: Questions multiples
**Étapes:**
1. Poser question 1: "Calendrier vaccinal?"
2. Vérifier la réponse
3. Poser question 2: "Effets secondaires?"
4. Vérifier que l'historique affiche les 2 questions

**Résultat attendu:** Historique maintient messages précédents

#### Test 3: Durée d'enregistrement
**Étapes:**
1. Cliquer 🎤 "Parler"
2. Observer le timer jusqu'à 30 secondes
3. Attendre que ça s'arrête automatiquement

**Résultat attendu:** Enregistrement s'arrête après ~30s max

#### Test 4: Performance réseau
**Étapes:**
1. Ouvrir DevTools (F12)
2. Aller à l'onglet Network
3. Poser une question
4. Observer les requêtes API

**Résultat attendu:**
- Pas de requêtes API pour Web Speech (local)
- Latence < 2 secondes avec Web Speech
- Si Azure/Google: latence < 5 secondes

#### Test 5: Accents franco-sénégalais
**Questions de test:**
- "Pourquoi vacciner les enfants?" (standard)
- "Kin vaccine?" (accent sénégalais)
- "Vaccin pour femme enceinte?" (accent local)

**Résultat attendu:** Recognition marche avec accents

## Procédure de test - Testeur Transcription

Cette page est pour le **debugging** et **développement**

1. **Accéder:** `http://localhost:5173/transcription-test`

2. **Interface:**
   - Boutons: "Écouter", "Arrêter", "Lire à haute voix", "Effacer"
   - Statut de l'écoute (rouge = en cours, vert = prêt)
   - Zone d'affichage du texte reconnu
   - Zone de texte intérimaire
   - Affichage de tout le texte reconnu à la fin

3. **Cas d'usage:**
   - Tester la reconnaissance brute
   - Verifier la precision du microphone
   - Debugger les erreurs
   - Tester les différentes langues
   - Mesurer la latence

## Tests de compatibilité

### Chrome / Chromium
```
✅ Web Speech API: Supporté
✅ Speech Synthesis: Supporté
✅ MediaRecorder: Supporté
✅ AudioContext: Supporté
Résultat: Fonctionne 100%
```

### Firefox
```
✅ Web Speech API: Supporté (via mozilla.org)
✅ Speech Synthesis: Supporté
✅ MediaRecorder: Supporté
Résultat: Fonctionne 95%
```

### Safari (macOS/iOS)
```
✅ Web Speech API: Supporté (webkit)
✅ Speech Synthesis: Supporté
⚠️ MediaRecorder: Limité
Résultat: Fonctionne 90%
```

### Edge
```
✅ Web Speech API: Supporté
✅ Speech Synthesis: Supporté
✅ MediaRecorder: Supporté
Résultat: Fonctionne 100%
```

## Tests de performance

### Mesurer la latence

1. **Ouvrir DevTools:** F12
2. **Onglet Network:** Voir les temps
3. **Onglet Console:** Voir les logs

```javascript
// Test de latence personnalisé
console.time('recognition');
// élancer l'écoute
console.timeEnd('recognition');
```

### Points de mesure

| Étape | Latence cible | Méthode |
|-------|---------------|---------|
| Enregistrement audio | < 1ms | Temps réel |
| Transcription (Web Speech) | < 2s | Local |
| Transcription (Cloud) | 2-5s | + réseau |
| Traitement chatbot | < 1s | Recherche dataset |
| Synthèse vocale | < 1s | Local |
| **Total** | **< 5s** | De question à réponse |

### Code de benchmark

```typescript
async function benchmarkAudio() {
  const start = performance.now();
  
  // 1. Record
  const recordStart = performance.now();
  const audioBlob = await recordAudio(5000);
  console.log(`Recording: ${performance.now() - recordStart}ms`);
  
  // 2. Transcribe
  const transcribeStart = performance.now();
  const text = await transcribeAudio(audioBlob);
  console.log(`Transcription: ${performance.now() - transcribeStart}ms`);
  
  // 3. Process
  const processStart = performance.now();
  const response = await useChatbotQuestion(text);
  console.log(`Processing: ${performance.now() - processStart}ms`);
  
  // 4. Synthesize
  const synthesizeStart = performance.now();
  const audioResponse = await synthesizeToSpeech(response);
  console.log(`Synthesis: ${performance.now() - synthesizeStart}ms`);
  
  console.log(`Total: ${performance.now() - start}ms`);
}
```

## Logs et debugging

### Activer les logs détaillés

1. **Ouvrir DevTools:** F12
2. **Onglet Console:** Voir tous les messages
3. **Filtrer:** `chatbot-audio` ou `transcription`

### Messages courants

```
✅ [Audio] Microphone recording started
✅ [Audio] Recording stopped, size: 12340 bytes
✅ [Audio] Transcription: "Pourquoi vacciner?"
✅ [Audio] Response: "Les vaccins protègent..."
✅ [Audio] Audio synthesis completed

❌ [Error] Web Speech API not supported
❌ [Error] Permission denied: microphone
❌ [Error] No transcript received
❌ [Error] Failed to synthesize speech
```

## Checker list pour production

- [ ] Tester sur Chrome
- [ ] Tester sur Firefox
- [ ] Tester sur Safari
- [ ] Tester sur Edge
- [ ] Tester avec microphone branché
- [ ] Tester avec casque audio
- [ ] Tester la latence réseau lente
- [ ] Tester avec 100+ questions
- [ ] Tester l'historique long (50+ messages)
- [ ] Verifier les permissions microphone
- [ ] Tester l'arrêt d'enregistrement
- [ ] Tester les clics rapides
- [ ] Verifier les accents français
- [ ] Verifier les accents sénégalais
- [ ] Tester mode hors-ligne
- [ ] Mesurer la batterie (sur mobile)
- [ ] Tester le responsive design
- [ ] Documenter les limites trouvées

## Rapports de bug

Si vous trouvez un bug, créer un rapport incluant:

```markdown
## Bug: [Titre court]

### Environnement
- Navigateur: Chrome 120
- OS: Windows 11
- URL: /chatbot-audio

### Étapes reproductibles
1. Aller à /chatbot-audio
2. Cliquer sur Parler
3. Dire "test"

### Comportement actuel
[Décrire ce qui s'est passé]

### Comportement attendu
[Décrire ce qui aurait dû faire]

### Logs de console
[Copier les erreurs de F12 → Console]

### Screenshots
[Inclure si possible]
```

## Résolution des problèmes usuels

### "Permission denied"
```
Cause: Microphone non autorisé
Solution: 
1. chrome://settings/content/microphone
2. Ajouter le domaine à la liste blanche
3. Rafraîchir la page
```

### "No speech input"
```
Cause: Microphone trop silencieux
Solution:
1. Parler plus fort
2. Vérifier niveaux audio en OS
3. Essayer un autre microphone
4. Rafraîchir le navigateur
```

### "Latence élevée"
```
Cause: Peut être réseau ou provider cloud
Solution:
1. Vérifier la vitesse réseau (DevTools)
2. Passer à Web Speech API si cloud utilisé
3. Vérifier la charge du serveur
4. Vérifier les quotas API
```

### "Audio pas synthétisé"
```
Cause: Les permissions ou le navigateur
Solution:
1. Vérifier que speaker est branché
2. Vérifier le volume du système
3. Tester avec "Lire à haute voix" du testeur
4. Essayer un autre navigateur
```

---

**Dernière mise à jour:** 2024-01-15  
**Version:** 1.0.0  
**Questions?** Consultez AUDIO_SETUP.md ou les logs console

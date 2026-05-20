# Intégration du Chatbot Vaccination

## 📋 Vue d'ensemble

Le chatbot est un assistant IA basé sur FastAPI qui utilise :
- **Modèle**: TinyLlama (1.1B)
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **Vectorstore**: FAISS
- **Framework**: LangChain

## 🏗️ Architecture

### Backend (FastAPI)
- **Port**: 8001
- **Endpoint**: `GET /ask?question=<question>`
- **Réponse**: `{ "response": "..." }`

### Frontend (React/Vite)
- **Service**: `src/services/chatbot.service.ts`
- **Modal**: `src/components/modals/chatbot-modal.tsx`
- **Hook**: `useChatbotQuestion()` (React Query)

## 🚀 Installation et Configuration

### 1. Backend FastAPI (Development)

```bash
# Installation des dépendances
pip install fastapi uvicorn torch transformers langchain sentence-transformers faiss-cpu

# Démarrer le serveur
python main.py
# ou
uvicorn main:app --host 0.0.0.0 --port 8001
```

### 2. Frontend React

```bash
# S'assurer que les variables d'environnement sont configurées
# .env.development doit contenir:
# VITE_CHATBOT_URL=http://localhost:8001

# Démarrer l'application
npm run dev
```

## 📝 Variables d'Environnement

### `.env.development`
```env
VITE_CHATBOT_URL=http://localhost:8001
```

### `.env.production`
```env
VITE_CHATBOT_URL=https://chatbot.vaccimed.com
```

## 💻 Utilisation dans le Code

### Composant Modal (Simple usage)
La modal est automatiquement intégrée dans la header. Elle s'affiche via un bouton en haut à droite.

```tsx
import { ChatbotModal } from '@/components/modals';

<ChatbotModal />
```

### Hook React Query (Custom usage)
```tsx
import { useChatbotQuestion } from '@/services/chatbot.service';

function MyComponent() {
  const { mutate: askQuestion, isPending } = useChatbotQuestion();

  const handleAsk = (question: string) => {
    askQuestion(question, {
      onSuccess: (response) => {
        console.log(response.response);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <button onClick={() => handleAsk('Quels vaccins pour les enfants ?')}>
      Poser une question
    </button>
  );
}
```

## 🔧 CORS Configuration

**Important**: Pour que le frontend accède au backend FastAPI, configurez CORS dans `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://vaccimed.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📦 Fichiers Modifiés

### Créés:
- ✅ `src/services/chatbot.service.ts` - Service API du chatbot
- ✅ `src/components/modals/chatbot-modal.tsx` - Interface de chat

### Modifiés:
- ✅ `src/services/index.service.ts` - Export du service chatbot
- ✅ `src/components/modals/index.tsx` - Export de la modal
- ✅ `src/components/shared/app-header.tsx` - Intégration dans la header
- ✅ `.env.development` - Configuration chatbot (dev)
- ✅ `.env.production` - Configuration chatbot (prod)

## 🎯 Fonctionnalités

### Modal Chatbot
- ✅ Interface conversationnelle
- ✅ Historique des messages
- ✅ Indicateur de chargement
- ✅ Gestion des erreurs
- ✅ Bouton "Effacer l'historique"
- ✅ Layout responsive
- ✅ Dark mode compatible

### Service
- ✅ Gestion automatique des requêtes
- ✅ Timeout 30s (pour le temps d'inférence du modèle)
- ✅ Gestion des erreurs API
- ✅ Variables d'environnement

## 🧪 Tests

### Test manuel de l'API FastAPI
```bash
curl -X 'GET' \
  'http://127.0.0.1:8001/ask?question=Donnez%20moi%20les%20vaccins%20prenatales%20a%20faire%20par%20la%20maman%20pendant%20la%20grossesse' \
  -H 'accept: application/json'
```

### Test dans le Frontend
1. Ouvrir l'application React
2. Cliquer sur l'icône message en haut à droite
3. Poser une question
4. Attendre la réponse

## ⚙️ Optimisations Possibles

1. **Cache des réponses** - Ajouter Redis pour cacher les réponses fréquentes
2. **Streaming** - Implémenter le SSE pour recevoir la réponse en streaming
3. **Analytics** - Logger les questions/réponses pour l'analyse
4. **Rate Limiting** - Limiter les requêtes par utilisateur
5. **Offline Mode** - Sauvegarder les réponses localement

## 🐛 Dépannage

### "Connection refused"
- Vérifier que le serveur FastAPI est démarré sur le port 8001
- Vérifier `VITE_CHATBOT_URL` dans `.env.development`

### "CORS error"
- Ajouter les origins CORS dans FastAPI
- En développement: `http://localhost:5173` (Vite port par défaut)

### Timeout (30s)
- Le modèle TinyLlama peut prendre du temps à générer
- Augmenter le timeout si nécessaire dans `chatbot.service.ts`

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://js.langchain.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Sentence Transformers](https://www.sbert.net/)
- [FAISS](https://github.com/facebookresearch/faiss)

---

**Intégration complète et prête pour la production** ✅

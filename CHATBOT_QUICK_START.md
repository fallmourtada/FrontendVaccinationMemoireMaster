# 🚀 Intégration Chatbot - Résumé Rapide

## ✅ Qu'est-ce qui a été fait?

### 1️⃣ Service Backend (Frontend)
- ✅ `src/services/chatbot.service.ts` - Client API du chatbot
- ✅ Hook React Query `useChatbotQuestion()` pour les appels async

### 2️⃣ Interface Utilisateur
- ✅ `src/components/modals/chatbot-modal.tsx` - Modal conversationnelle
- ✅ Accessible via un bouton dans la header (🗨️)
- ✅ Historique des messages inclus
- ✅ Support du mode sombre

### 3️⃣ Configuration
- ✅ `.env.development` → `VITE_CHATBOT_URL=http://localhost:8001`
- ✅ `.env.production` → `VITE_CHATBOT_URL=https://chatbot.vaccimed.com`
- ✅ Export du service dans `src/services/index.service.ts`
- ✅ Export de la modal dans `src/components/modals/index.tsx`

### 4️⃣ Documentation
- ✅ `CHATBOT_INTEGRATION.md` - Documentation complète
- ✅ `CHATBOT_SERVER_EXAMPLE.py` - Exemple de serveur avec CORS

---

## 🎯 Comment utiliser?

### Démarrage (Development)

```bash
# Terminal 1 - Serveur FastAPI
cd /path/to/chatbot/server
python main.py
# Le serveur sera sur http://localhost:8001

# Terminal 2 - Application React
cd c:\Users\lenovo\ProjetMemoire\vaccination_web\vaccination_web
npm run dev
# L'app sera sur http://localhost:5173
```

### Vérifier que ça marche
1. Ouvrir l'app sur http://localhost:5173
2. Cliquer sur l'icône 🗨️ en haut à droite
3. Poser une question comme: "Quels vaccins pour les enfants?"

---

## ⚙️ Configuration FastAPI (IMPORTANT!)

Votre serveur FastAPI doit avoir CORS activé. Voici ce qu'il faut ajouter:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite (dev)
        "http://localhost:3000",      # React (alt)
        "https://vaccimed.com",       # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

⚠️ **Sans CORS, vous aurez une erreur de type "Access-Control-Allow-Origin"**

---

## 📁 Fichiers Créés/Modifiés

```
✅ src/
   ├── services/
   │   ├── chatbot.service.ts (CRÉÉ)
   │   └── index.service.ts (MODIFIÉ - export)
   ├── components/
   │   └── modals/
   │       ├── chatbot-modal.tsx (CRÉÉ)
   │       └── index.tsx (MODIFIÉ - export)
   └── shared/
       └── app-header.tsx (MODIFIÉ - intégration)

✅ .env.development (MODIFIÉ - VITE_CHATBOT_URL)
✅ .env.production (MODIFIÉ - VITE_CHATBOT_URL)

✅ Documentation/
   ├── CHATBOT_INTEGRATION.md (CRÉÉ)
   └── CHATBOT_SERVER_EXAMPLE.py (CRÉÉ - exemple)
```

---

## 🔧 Paramètres à ajuster

### En Production
```env
# .env.production
VITE_CHATBOT_URL=https://votre-domaine-chatbot.com
```

### Pour un autre port localement
```env
# .env.development
VITE_CHATBOT_URL=http://localhost:VOTRE_PORT
```

---

## 🧪 Test API (Curl)

```bash
curl -X GET "http://localhost:8001/ask?question=Donnez%20moi%20les%20vaccins%20prenatales" \
  -H "accept: application/json"
```

---

## ⚡ Performance

- **Timeout**: 30 secondes (ajustable si le modèle est plus lent)
- **Cache**: Non implémenté (à faire si nécessaire)
- **Streaming**: Non implémenté (à faire pour meilleure UX)

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| "Connection refused" | Vérifier que FastAPI tourne sur le port 8001 |
| "CORS error" | Ajouter CORS dans FastAPI (voir config ci-dessus) |
| "Timeout after 30s" | Le modèle prend trop de temps - augmenter le timeout |
| "Chatbot button ne s'affiche pas" | Vérifier que `ChatbotModal` est importé dans `app-header.tsx` |

---

## ✨ Prochaines étapes (Optionnel)

1. **Streaming** - Utiliser EventSource/SSE pour réponses en temps réel
2. **Cache** - Redis pour les questions fréquentes  
3. **Analytics** - Logger questions/réponses
4. **Rate Limiting** - Limiter 10 requêtes/min par utilisateur
5. **Multi-langue** - Ajouter support pour d'autres langues

---

**🎉 Intégration Complète et Fonctionnelle!**

Questions? Regarder `CHATBOT_INTEGRATION.md` pour plus de détails.

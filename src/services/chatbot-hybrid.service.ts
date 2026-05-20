import { searchQADataset, vaccinationQADataset } from '../data/vaccination-qa-dataset';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// ================================
// MODE: Local first, puis server
// ================================

const CHATBOT_BASE_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:8001';
const USE_LOCAL_FIRST = true; // Active mode local

console.log('[CHATBOT] Mode démarrage:', USE_LOCAL_FIRST ? 'LOCAL FIRST' : 'SERVER ONLY');
console.log('[CHATBOT] Serveur de secours:', CHATBOT_BASE_URL);

interface ChatbotResponse {
  response: string;
  source?: 'local' | 'server';
}

class ChatbotClient {
  private client = axios.create({
    baseURL: CHATBOT_BASE_URL,
    timeout: 60000, // Réduit à 60s pour server
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  async askQuestion(question: string): Promise<ChatbotResponse> {
    // 🔵 ÉTAPE 1: Essayer le dataset local (instantané)
    if (USE_LOCAL_FIRST) {
      console.log('[CHATBOT] 🔵 Recherche locale...');
      const localResult = searchQADataset(question);
      
      if (localResult) {
        console.log('[CHATBOT] ✅ Réponse trouvée localement!', localResult.id);
        return {
          response: localResult.response,
          source: 'local'
        };
      }
      
      console.log('[CHATBOT] ⚠️ Aucune réponse locale, essai du serveur...');
    }

    // 🟢 ÉTAPE 2: Essayer le serveur FastAPI
    try {
      console.log('[CHATBOT] 🟢 Envoi au serveur:', question);
      
      const response = await this.client.get<ChatbotResponse>('/ask', {
        params: { question }
      });
      
      console.log('[CHATBOT] ✅ Réponse serveur reçue');
      return {
        ...response.data,
        source: 'server'
      };
    } catch (error) {
      console.error('[CHATBOT] ❌ Erreur serveur:', error);
      
      // 🔴 ÉTAPE 3: Fallback message informatif
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('⏱️ Le serveur met trop longtemps à répondre. Essayez une autre question ou consultez notre FAQ.');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('🔌 Impossible de contacter le serveur de l\'IA. Vous pouvez toujours consulter notre FAQ.');
        }
      }
      
      throw new Error('Erreur serveur - veuillez réessayer');
    }
  }

  /**
   * Obtenir une suggestion de question aléatoire (pour l'accueil)
   */
  getRandomQuestion() {
    const random = Math.floor(Math.random() * vaccinationQADataset.length);
    return vaccinationQADataset[random].question;
  }
}

const chatbotClient = new ChatbotClient();

// ================================
// HOOK REACT QUERY
// ================================

export const useChatbotQuestion = () => {
  return useMutation({
    mutationFn: (question: string) => chatbotClient.askQuestion(question),
  });
};

export default chatbotClient;

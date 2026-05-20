import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

// ================================
// CHATBOT API CLIENT
// ================================

const CHATBOT_BASE_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:8001';

console.log('[CHATBOT] Serveur configuré sur:', CHATBOT_BASE_URL);

interface ChatbotResponse {
  response: string;
}


class ChatbotClient {
  private client = axios.create({
    baseURL: CHATBOT_BASE_URL,
    timeout: 120000, // 120s - Le modèle peut prendre du temps!
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  async askQuestion(question: string): Promise<ChatbotResponse> {
    try {
      console.log('[CHATBOT] Envoi de la question:', question);
      console.log('[CHATBOT] URL:', this.client.defaults.baseURL + '/ask?question=' + question);
      
      const response = await this.client.get<ChatbotResponse>('/ask', {
        params: { question }
      });
      
      console.log('[CHATBOT] Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CHATBOT] Erreur complète:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('⏱️ Timeout: Le serveur a mis trop de temps à répondre (> 120s). Vérifiez que le serveur FastAPI est en ligne.');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('🔌 Erreur réseau: Impossible de contacter le serveur sur ' + CHATBOT_BASE_URL);
        }
        throw new Error(error.response?.data?.detail || error.message || 'Erreur du chatbot');
      }
      throw error;
    }
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

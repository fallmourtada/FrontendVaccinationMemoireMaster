import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatbotAudioComponent from '@/components/modals/chatbot-audio-modal';
import PageContainer from '@/components/shared/page-container';

export default function ChatbotAudioPage() {
  const navigate = useNavigate();

  return (
    <PageContainer title="Chatbot Audio" subtitle="Posez vos questions sur la vaccination en parlant">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              🎤 Chatbot Audio sur la Vaccination
            </h1>
            <p className="text-gray-600 mt-1">
              Posez vos questions en parlant et écoutez les réponses
            </p>
          </div>
        </div>

        {/* Composant Audio Principal */}
        <ChatbotAudioComponent />

        {/* Section Info/Support */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-900 mb-4">
              ✨ Fonctionnalités
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="font-semibold">Reconnaissance vocale</p>
                  <p className="text-sm text-gray-700">
                    Parlez en français naturel
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="font-semibold">IA Intelligente</p>
                  <p className="text-sm text-gray-700">
                    Répond immédiatement vos questions
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🔊</span>
                <div>
                  <p className="font-semibold">Synthèse vocale</p>
                  <p className="text-sm text-gray-700">
                    Écoutez les réponses clairement
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold">Très rapide</p>
                  <p className="text-sm text-gray-700">
                    Réponses instantanées
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Topics Couverts */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              📚 Sujets Couverts
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Calendar vaccinal complet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Effets secondaires détaillés</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Importance vaccination</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Risques non-vaccination</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Mythes vs Science</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Recommandations OMS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Cas spéciaux (enceintes, etc.)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🔧 Infos Techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Navigateurs Supportés</p>
              <p className="text-gray-600 mt-1">Chrome, Firefox, Edge, Safari</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Langue</p>
              <p className="text-gray-600 mt-1">Français (Sénégal)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Besoin</p>
              <p className="text-gray-600 mt-1">Microphone + Internet</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">
            ❓ Questions Fréquentes
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-yellow-900">
                Q: Pourquoi mon navigateur ne reconnaît pas la parole?
              </p>
              <p className="text-yellow-800 mt-1">
                R: Assurez-vous d'utiliser un navigateur moderne (Chrome, Firefox,
                Edge). Vérifiez aussi que vous avez autorisé l'accès au
                microphone.
              </p>
            </div>
            <div>
              <p className="font-semibold text-yellow-900">
                Q: La synthèse vocale est trop rapide?
              </p>
              <p className="text-yellow-800 mt-1">
                R: Nous avons réduit la vitesse à 0.9. Attendez que la parole se
                termine avant de poser une nouvelle question.
              </p>
            </div>
            <div>
              <p className="font-semibold text-yellow-900">
                Q: Puis-je l'utiliser hors ligne?
              </p>
              <p className="text-yellow-800 mt-1">
                R: Non, l'audio nécessite une connexion Internet pour la
                transcription et l'IA. C'est gratuit!
              </p>
            </div>
          </div>
        </div>

        {/* Support Button */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Des problèmes? Besoin d'aide?
          </p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            📞 Contacter Support
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

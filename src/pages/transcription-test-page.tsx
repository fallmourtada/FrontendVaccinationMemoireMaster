import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/shared/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TranscriptionTester from '@/components/shared/transcription-tester';
import { ArrowLeft, FileText } from 'lucide-react';

export function TranscriptionTestPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tester' | 'docs'>('tester');

  return (
    <PageContainer title="Testeur de Transcription Audio" subtitle="Testez la reconnaissance vocale et la synthèse vocale">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">
              Testeur de Transcription Audio
            </h1>
            <p className="text-gray-600 mt-2">
              Testez la reconnaissance vocale et la synthèse vocale
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'tester'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🎤 Testeur
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'docs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documentation
          </button>
        </div>

        {/* Contenu */}
        {activeTab === 'tester' ? (
          <div className="grid gap-6">
            <TranscriptionTester />

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">💡 Conseils pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-900">Microphone:</p>
                  <p className="text-blue-700">
                    Autorisez le microphone lors du premier usage
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Qualité audio:</p>
                  <p className="text-blue-700">
                    Parlez clairement et distinctement pour une meilleure
                    reconnaissance
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Langue:</p>
                  <p className="text-blue-700">
                    L'application utilise le français (fr-FR) par défaut
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Compatibilité:</p>
                  <p className="text-blue-700">
                    Fonctionne mieux avec Chrome, Firefox, Safari et Edge
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚙️ Configuration avancée</CardTitle>
                <CardDescription>
                  Modifier les providers de transcription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">Providers disponibles:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>
                      <strong>Web Speech API</strong> (défaut, gratuit)
                    </li>
                    <li>
                      <strong>Google Cloud</strong> (~$0.006/min)
                    </li>
                    <li>
                      <strong>Azure Cognitive</strong> (5h gratuit/mois)
                    </li>
                    <li>
                      <strong>Deepgram</strong> (50k gratuit/mois)
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600 italic">
                  Consultez <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> pour configurer
                  des providers cloud
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Le système de transcription audio permet à l'utilisateur de:
                </p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>🎤 Enregistrer sa voix (max 30 secondes)</li>
                  <li>📝 Transcrire la voix en texte</li>
                  <li>🤖 Obtenir une réponse du chatbot vaccinal</li>
                  <li>🔊 Entendre la réponse à haute voix</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fournisseurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium">Web Speech API (Recommandé)</p>
                    <p className="text-gray-600">
                      Gratuit, aucune config, fonctionne hors-ligne
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Précision: 85% | Latence: ~1s
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">Google Cloud Speech</p>
                    <p className="text-gray-600">
                      Haute précision, cloud-based
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Précision: 95% | Latence: ~3s | Prix: $0.006/min
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-medium">Azure Cognitive Services</p>
                    <p className="text-gray-600">
                      Professionnel, support Microsoft
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Précision: 93% | Latence: ~3s | Gratuit: 5h/mois
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="font-medium">Deepgram</p>
                    <p className="text-gray-600">
                      IA moderne, meilleure pour accents
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Précision: 96% | Latence: ~2s | Gratuit: 50k/mois
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dépannage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-red-600 mb-1">
                    ❌ Erreur: "Web Speech API not supported"
                  </p>
                  <p className="text-gray-600">
                    Votre navigateur ne supporte pas Web Speech API. Utilisez
                    Chrome, Firefox, Safari ou Edge.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-red-600 mb-1">
                    ❌ Erreur: "Permission denied"
                  </p>
                  <p className="text-gray-600">
                    L'application n'a pas accès au microphone. Vérifiez les
                    permissions du navigateur.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-red-600 mb-1">
                    ❌ Transcription vide
                  </p>
                  <p className="text-gray-600">
                    Le microphone n'a pas détecté de son. Parlez plus fort ou
                    vérifiez la configuration.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>📚 Documentation complète</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-blue-700 mb-3">
                  Consultez le fichier <code className="bg-blue-100 px-2 py-1 rounded">AUDIO_SETUP.md</code> pour une
                  documentation complète incluant:
                </p>
                <ul className="space-y-1 ml-4 list-disc text-blue-700">
                  <li>Architecture détaillée du système</li>
                  <li>Configuration de chaque provider</li>
                  <li>Exemples de code</li>
                  <li>API complète</li>
                  <li>Guide de performance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default TranscriptionTestPage;

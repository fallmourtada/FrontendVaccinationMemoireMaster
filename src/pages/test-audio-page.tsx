import { ChatbotAudioComponent } from '@/components/modals/chatbot-audio-modal';
import PageContainer from '@/components/shared/page-container';

export default function TestAudioPage() {
  return (
    <>
      <PageContainer 
        title="Test Audio Chatbot"
        subtitle="Testez le chatbot audio avec transcription en temps réel"
      >
        <div className="border rounded-lg p-6 bg-white">
          <ChatbotAudioComponent />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📝 Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Vous devriez entendre "Bonjour, je suis votre assistant..."</li>
            <li>✅ Cliquez "Parler" pour enregistrer une question</li>
            <li>✅ Parlez pendant maximum 30 secondes</li>
            <li>✅ Votre parole sera transcrite automatiquement</li>
            <li>✅ Une réponse s'affichera avec lecture audio</li>
          </ul>
        </div>
      </PageContainer>
    </>
  );
}

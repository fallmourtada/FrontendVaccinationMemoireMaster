import { BaseModal } from '@/components/shared/base-modal';
import { useModal } from '@/components/shared/modal-provider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Syringe, Calendar, Users, AlertCircle } from 'lucide-react';

export function DetailVaccinModal() {
  const { getModalData } = useModal();
  
  const modalData = getModalData('detail-vaccin');

  if (!modalData) {
    return null;
  }

  const getCibleLabel = (cible: string) => {
    switch (cible) {
      case 'enfant': return 'Enfant';
      case 'femme_enceinte': return 'Femme enceinte';
      case 'femme_post_accouchement': return 'Femme après accouchement';
      case 'adulte': return 'Adulte';
      case 'senior': return 'Senior';
      default: return cible;
    }
  };

  const getCibleIcon = (cible: string) => {
    switch (cible) {
      case 'enfant': return '👶';
      case 'femme_enceinte': return '🤰';
      case 'femme_post_accouchement': return '👩‍🍼';
      case 'adulte': return '👤';
      case 'senior': return '👴';
      default: return '💉';
    }
  };

  return (
    <BaseModal
      modalId="detail-vaccin"
      title="Détails du vaccin"
      description="Informations complètes sur le vaccin sélectionné"
      showFooter={false}
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête du vaccin */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Syringe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{modalData.nom}</h3>
              <p className="text-muted-foreground">{modalData.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {modalData.obligatoire ? (
              <Badge className="bg-red-500 text-white">
                <AlertCircle className="w-3 h-3 mr-1" />
                Obligatoire
              </Badge>
            ) : (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Recommandé
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Informations générales */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Population cible</span>
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCibleIcon(modalData.cible)}</span>
                <span className="text-foreground">{getCibleLabel(modalData.cible)}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Période de vaccination</span>
              </h4>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Âge minimum:</span>
                  <span className="ml-2 text-foreground font-medium">{modalData.ageMin}</span>
                </div>
                {modalData.ageMax && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Âge maximum:</span>
                    <span className="ml-2 text-foreground font-medium">{modalData.ageMax}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Statut</h4>
              <div className={`p-3 rounded-lg border ${
                modalData.obligatoire 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">
                    {modalData.obligatoire ? 'Vaccination obligatoire' : 'Vaccination recommandée'}
                  </span>
                </div>
                <p className="text-xs mt-1">
                  {modalData.obligatoire 
                    ? 'Ce vaccin est rendu obligatoire par les autorités sanitaires'
                    : 'Ce vaccin est fortement recommandé pour la protection de la santé'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rappels */}
        {modalData.rappels && modalData.rappels.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Rappels programmés</h4>
            <div className="grid grid-cols-1 gap-2">
              {modalData.rappels.map((rappel: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-medium">Rappel {index + 1}</span>
                  </div>
                  <span className="text-green-700">{rappel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Informations importantes</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Consultez toujours un professionnel de santé avant la vaccination</li>
            <li>• Respectez les intervalles recommandés entre les doses</li>
            <li>• Signalez tout effet indésirable à votre médecin</li>
            {modalData.obligatoire && (
              <li className="text-red-600">• Ce vaccin est obligatoire selon la réglementation en vigueur</li>
            )}
          </ul>
        </div>
      </div>
    </BaseModal>
  );
}

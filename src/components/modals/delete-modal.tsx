import { BaseModal } from '@/components/shared/base-modal';
import { useModal } from '@/components/shared/modal-provider';
import { AlertTriangle, Calendar, Clock, User, Syringe } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeleteModalProps {
  modalId: string;
  onConfirm: () => void;
}

export function DeleteModal({ modalId, onConfirm }: DeleteModalProps) {
  const { getModalData } = useModal();
  
  const modalData = getModalData(modalId);

  const getDeleteConfig = () => {
    if (modalId.includes('vaccin')) {
      return {
        title: 'Supprimer le vaccin',
        description: `Êtes-vous sûr de vouloir supprimer "${modalData?.nom || 'ce vaccin'}" ? Cette action est irréversible.`,
        warningMessage: 'La suppression d\'un vaccin peut affecter les rendez-vous existants.',
        details: modalData ? (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-foreground">Détails du vaccin :</h4>
            <div className="flex items-center space-x-3">
              <Syringe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{modalData.nom}</span>
            </div>
            <div className="text-sm text-muted-foreground">{modalData.description}</div>
            <div className="text-xs">
              <span className="font-medium">Cible:</span> {modalData.cible === 'enfant' ? 'Enfants' : modalData.cible === 'femme_enceinte' ? 'Femmes enceintes' : 'Femmes après accouchement'}
            </div>
          </div>
        ) : null
      };
    }
    
    if (modalId.includes('rendez-vous')) {
      return {
        title: 'Annuler le rendez-vous',
        description: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
        warningMessage: 'Cette action libérera le créneau pour d\'autres patients.',
        details: modalData ? (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-foreground">Détails du rendez-vous :</h4>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{modalData.patientPrenom} {modalData.patientNom}</span>
                  <span className="text-muted-foreground ml-2">({modalData.patientAge} an{modalData.patientAge > 1 ? 's' : ''})</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(modalData.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{modalData.heure}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Syringe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{modalData.vaccin}</span>
              </div>
            </div>
          </div>
        ) : null
      };
    }

    if (modalId.includes('patient')) {
      return {
        title: 'Supprimer le patient',
        description: `Êtes-vous sûr de vouloir supprimer "${modalData?.prenom || ''} ${modalData?.nom || 'ce patient'}" ? Cette action est irréversible.`,
        warningMessage: 'La suppression d\'un patient supprimera également tout son historique médical et ses rendez-vous.',
        details: modalData ? (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-foreground">Détails du patient :</h4>
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{modalData.prenom} {modalData.nom}</span>
            </div>
            {modalData.dateNaissance && (
              <div className="text-sm text-muted-foreground">
                Né(e) le {format(new Date(modalData.dateNaissance), 'dd/MM/yyyy')}
              </div>
            )}
          </div>
        ) : null
      };
    }

    if (modalId.includes('creneau')) {
      return {
        title: 'Supprimer le créneau',
        description: 'Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible.',
        warningMessage: 'La suppression d\'un créneau peut affecter les rendez-vous planifiés.',
        details: modalData ? (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-foreground">Détails du créneau :</h4>
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{modalData.heure} - {modalData.duree}min</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{modalData.date}</span>
            </div>
          </div>
        ) : null
      };
    }

    // Configuration par défaut
    return {
      title: 'Supprimer l\'élément',
      description: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
      warningMessage: 'Cette action ne peut pas être annulée.',
      details: null
    };
  };

  const config = getDeleteConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  if (!modalData) {
    return null;
  }

  return (
    <BaseModal
      modalId={modalId}
      title={config.title}
      description={config.description}
      onConfirm={handleConfirm}
      confirmText="Supprimer"
      confirmVariant="destructive"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">Attention !</h3>
              <p className="text-sm text-muted-foreground">
                {config.warningMessage}
              </p>
            </div>
          </div>
        </div>

        {config.details && config.details}

        {modalId.includes('rendez-vous') && (
          <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
            <strong>Note :</strong> Le patient sera automatiquement notifié de l'annulation par email et SMS si les coordonnées sont disponibles.
          </div>
        )}
      </div>
    </BaseModal>
  );
}

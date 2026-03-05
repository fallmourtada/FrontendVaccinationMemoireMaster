import { BaseModal } from '@/components/shared/base-modal';
import { useModal } from '@/components/shared/modal-provider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Syringe, 
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DetailRendezVousModal() {
  const { getModalData } = useModal();
  
  const modalData = getModalData('detail-rendez-vous');

  if (!modalData) {
    return null;
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirme':
        return <Badge className="bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'en_attente':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'reporte':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><AlertCircle className="w-3 h-3 mr-1" />Reporté</Badge>;
      case 'annule':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return '💉';
      case 'consultation': return '👩‍⚕️';
      case 'rappel': return '🔔';
      default: return '📅';
    }
  };

  return (
    <BaseModal
      modalId="detail-rendez-vous"
      title="Détails du rendez-vous"
      description="Informations complètes sur le rendez-vous sélectionné"
      showFooter={false}
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête du rendez-vous */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Rendez-vous - {modalData.type}
              </h3>
              <p className="text-muted-foreground">
                {format(new Date(modalData.date), 'EEEE dd MMMM yyyy', { locale: fr })} à {modalData.heure}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatutBadge(modalData.statut)}
          </div>
        </div>

        <Separator />

        {/* Informations du patient */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span>Informations du patient</span>
          </h4>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-lg text-foreground">
                  {modalData.patientPrenom} {modalData.patientNom}
                </div>
                <div className="text-sm text-muted-foreground">
                  {modalData.patientAge} an{modalData.patientAge > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{modalData.telephone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{modalData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Détails du rendez-vous */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Date et heure</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Date</span>
                </div>
                <span className="text-blue-800">
                  {format(new Date(modalData.date), 'dd/MM/yyyy')}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Heure</span>
                </div>
                <span className="text-green-800">{modalData.heure}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Syringe className="w-4 h-4 text-primary" />
              <span>Détails médicaux</span>
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 border border-primary/20 rounded-lg bg-primary/5">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-lg">{getTypeIcon(modalData.type)}</span>
                  <span className="font-medium text-primary">Type</span>
                </div>
                <span className="text-sm capitalize">{modalData.type}</span>
              </div>
              
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3 mb-2">
                  <Syringe className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Vaccin</span>
                </div>
                <span className="text-sm text-orange-800 font-medium">{modalData.vaccin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes supplémentaires */}
        {modalData.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Notes</span>
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{modalData.notes}</p>
              </div>
            </div>
          </>
        )}

        {/* Informations de contact et urgence */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Informations importantes</span>
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Arrivez 15 minutes avant l'heure du rendez-vous</li>
            <li>• Apportez votre carnet de vaccination</li>
            <li>• En cas d'empêchement, prévenez au moins 24h à l'avance</li>
            {modalData.statut === 'en_attente' && (
              <li className="font-medium">• Ce rendez-vous est en attente de confirmation</li>
            )}
          </ul>
        </div>
      </div>
    </BaseModal>
  );
}

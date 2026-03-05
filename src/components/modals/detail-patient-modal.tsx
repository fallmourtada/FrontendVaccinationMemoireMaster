import { useModal } from '../shared/modal-provider';
import { BaseModal } from '../shared/base-modal';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  User, 
  Baby, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Users,
  Heart,
  FileText} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNotification } from '../shared/app-notification';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: number;
  telephone: string;
  email: string;
  adresse: string;
  sexe: 'M' | 'F';
  typePatient: 'adulte' | 'enfant';
  parentId?: string;
  notes?: string;
}

// Données simulées des parents existants
const parentsData: Patient[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Marie',
    dateNaissance: '1985-03-15',
    age: 40,
    telephone: '01 23 45 67 89',
    email: 'marie.dupont@email.com',
    adresse: '123 Rue de la Santé, Paris',
    sexe: 'F',
    typePatient: 'adulte'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Pierre',
    dateNaissance: '1982-07-22',
    age: 43,
    telephone: '01 98 76 54 32',
    email: 'pierre.martin@email.com',
    adresse: '456 Avenue du Bien-être, Lyon',
    sexe: 'M',
    typePatient: 'adulte'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Sophie',
    dateNaissance: '1990-11-08',
    age: 34,
    telephone: '01 55 44 33 22',
    email: 'sophie.bernard@email.com',
    adresse: '789 Boulevard de la Paix, Marseille',
    sexe: 'F',
    typePatient: 'adulte'
  }
];

export function DetailPatientModal() {
  const { isModalOpen, getModalData } = useModal();
  const notification = useNotification();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [parent, setParent] = useState<Patient | null>(null);

  const modalId = 'detail-patient';
  const isOpen = isModalOpen(modalId);
  const data = getModalData(modalId);

  const handleInfoUpdate = () => {
    notification.info({
      title: "Informations du patient",
      description: `Fiche de ${patient?.prenom} ${patient?.nom} consultée`,
      duration: 2000
    });
  };

  // const handleViewFullRecord = () => {
  //   notification.promise(
  //     new Promise((resolve) => {
  //       setTimeout(() => resolve("Dossier chargé"), 1000);
  //     }),
  //     {
  //       loading: "Chargement du dossier complet...",
  //       success: "Dossier médical complet affiché",
  //       error: "Erreur lors du chargement du dossier"
  //     }
  //   );
  // };

  useEffect(() => {
    if (isOpen && data) {
      const patientData = data as Patient;
      setPatient(patientData);
      
      // Si c'est un enfant, récupérer les informations du parent
      if (patientData.typePatient === 'enfant' && patientData.parentId) {
        const parentData = parentsData.find(p => p.id === patientData.parentId);
        setParent(parentData || null);
      } else {
        setParent(null);
      }

      // Notification d'information
      handleInfoUpdate();
    }
  }, [isOpen, data]);

  if (!patient) return null;

  const getTypeIcon = () => {
    return patient.typePatient === 'enfant' ? <Baby className="w-5 h-5" /> : <User className="w-5 h-5" />;
  };

  const getTypeBadge = () => {
    return patient.typePatient === 'enfant' 
      ? <Badge className="bg-blue-500 text-white">Enfant</Badge>
      : <Badge className="bg-green-500 text-white">Adulte</Badge>;
  };

  const getSexeBadge = () => {
    return patient.sexe === 'M' 
      ? <Badge variant="outline" className="text-blue-600 border-blue-600">Masculin</Badge>
      : <Badge variant="outline" className="text-pink-600 border-pink-600">Féminin</Badge>;
  };

  return (
    <BaseModal
      modalId={modalId}
      title="Détails du patient"
      description="Informations complètes du patient"
      showFooter={false}
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête du patient */}
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
              {patient.prenom.charAt(0)}{patient.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              {getTypeIcon()}
              <h3 className="text-xl font-bold text-foreground">
                {patient.prenom} {patient.nom}
              </h3>
              {getTypeBadge()}
              {getSexeBadge()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{patient.age} ans</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>Né(e) le {format(new Date(patient.dateNaissance), 'PPP', { locale: fr })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold flex items-center space-x-2">
            <Phone className="w-5 h-5 text-primary" />
            <span>Informations de contact</span>
          </h4>
          <div className="grid grid-cols-1 gap-3 pl-7">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Téléphone</div>
                <div className="text-sm text-muted-foreground">{patient.telephone}</div>
              </div>
            </div>
            {patient.email && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{patient.email}</div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Adresse</div>
                <div className="text-sm text-muted-foreground">{patient.adresse}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations du parent si c'est un enfant */}
        {patient.typePatient === 'enfant' && parent && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Parent/Tuteur légal</span>
              </h4>
              <div className="pl-7">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Avatar className="h-12 w-12 border-2 border-blue-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 font-semibold">
                      {parent.prenom.charAt(0)}{parent.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h5 className="font-semibold text-foreground">
                        {parent.prenom} {parent.nom}
                      </h5>
                      <p className="text-sm text-muted-foreground">{parent.age} ans</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>{parent.telephone}</span>
                      </div>
                      {parent.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>{parent.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{parent.adresse}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes médicales */}
        {patient.notes && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Notes médicales</span>
              </h4>
              <div className="pl-7">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm leading-relaxed">{patient.notes}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}

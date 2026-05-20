import { useState, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useAppointmentsByEnfant } from '@/services/appointment.service';
import type { AppointmentDTO, EnfantDTO } from '@/types';
import { StatutRvLabels, StatutRvColors } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Syringe,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Baby,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  Eye,
  Plus,
} from 'lucide-react';

// ================================
// STYLES CSS pour l'animation de flip de page
// ================================
const flipStyles = `
  .carnet-spine {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 24px;
    background: linear-gradient(to right, #1e3a5f, #1e40af, #2563eb, #1e40af, #1e3a5f);
    z-index: 10;
    box-shadow: 2px 0 8px rgba(0,0,0,0.2);
  }
  .carnet-spine::after {
    content: '';
    position: absolute;
    left: 10px;
    top: 20px;
    bottom: 20px;
    width: 2px;
    background: rgba(255,255,255,0.15);
    border-radius: 1px;
  }

  /* Conteneur du flip avec perspective */
  .flip-perspective {
    perspective: 1800px;
    position: relative;
    overflow: visible;
  }

  /* La page visible */
  .flip-page {
    transform-origin: left center;
    transform-style: flat;
    position: relative;
    z-index: 2;
  }

  /* Animation : page qui se tourne vers la gauche (page suivante) */
  @keyframes flipOutNext {
    0% {
      transform: rotateY(0deg);
      opacity: 1;
    }
    50% {
      transform: rotateY(-90deg);
      opacity: 0.6;
      box-shadow: 10px 0 30px rgba(0,0,0,0.3);
    }
    100% {
      transform: rotateY(-180deg);
      opacity: 0;
    }
  }
  @keyframes flipInNext {
    0% {
      transform: rotateY(90deg);
      opacity: 0;
    }
    50% {
      transform: rotateY(45deg);
      opacity: 0.6;
      box-shadow: -10px 0 30px rgba(0,0,0,0.3);
    }
    100% {
      transform: rotateY(0deg);
      opacity: 1;
    }
  }

  /* Animation : page qui revient (page précédente) */
  @keyframes flipOutPrev {
    0% {
      transform: rotateY(0deg);
      opacity: 1;
    }
    50% {
      transform: rotateY(90deg);
      opacity: 0.6;
      box-shadow: -10px 0 30px rgba(0,0,0,0.3);
    }
    100% {
      transform: rotateY(180deg);
      opacity: 0;
    }
  }
  @keyframes flipInPrev {
    0% {
      transform: rotateY(-90deg);
      opacity: 0;
    }
    50% {
      transform: rotateY(-45deg);
      opacity: 0.6;
      box-shadow: 10px 0 30px rgba(0,0,0,0.3);
    }
    100% {
      transform: rotateY(0deg);
      opacity: 1;
    }
  }

  .flip-exit-next {
    animation: flipOutNext 0.7s ease-in forwards;
  }
  .flip-enter-next {
    animation: flipInNext 0.7s ease-out forwards;
  }
  .flip-exit-prev {
    animation: flipOutPrev 0.7s ease-in forwards;
  }
  .flip-enter-prev {
    animation: flipInPrev 0.7s ease-out forwards;
  }

  /* Ombre portée pendant le flip */
  .flip-page-shadow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 15%);
    pointer-events: none;
    z-index: 3;
  }

  /* Lignes de cahier */
  .page-lines {
    background-image: repeating-linear-gradient(
      transparent,
      transparent 31px,
      #e8ecf1 31px,
      #e8ecf1 32px
    );
  }
  .dark .page-lines {
    background-image: repeating-linear-gradient(
      transparent,
      transparent 31px,
      #334155 31px,
      #334155 32px
    );
  }

  /* Effet pages empilées à droite */
  .stacked-pages::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 4px;
    bottom: 4px;
    width: 3px;
    background: linear-gradient(to right, #cbd5e1, #e2e8f0);
    border-radius: 0 2px 2px 0;
  }
  .stacked-pages::before {
    content: '';
    position: absolute;
    right: -6px;
    top: 8px;
    bottom: 8px;
    width: 3px;
    background: linear-gradient(to right, #e2e8f0, #f1f5f9);
    border-radius: 0 2px 2px 0;
  }
`;

interface RendezVousCarnetModalProps {
  enfant: EnfantDTO;
  isOpen: boolean;
  onClose: () => void;
  onView?: (rdv: AppointmentDTO) => void;
  onEdit?: (rdv: AppointmentDTO) => void;
  onDelete?: (rdv: AppointmentDTO) => void;
  onCreateAppointment?: (enfant: EnfantDTO) => void;
}

function StatutBadgeRDV({ statut }: { statut: string }) {
  const colors = StatutRvColors[statut as keyof typeof StatutRvColors] || StatutRvColors.EN_ATTENTE;
  const label = StatutRvLabels[statut as keyof typeof StatutRvLabels] || statut;
  
  const Icon = {
    EN_ATTENTE: Clock,
    CONFIRME: CheckCircle2,
    REPORTE: Calendar,
    ANNULE: XCircle,
    EFFECTUE: CheckCircle2
  }[statut] || Clock;

  return (
    <Badge className={`${colors.bg} ${colors.text} border ${colors.border} text-xs`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}

function RendezVousPage({ rdv, onView, onEdit, onDelete }: { 
  rdv: AppointmentDTO; 
  onView?: (rdv: AppointmentDTO) => void;
  onEdit?: (rdv: AppointmentDTO) => void;
  onDelete?: (rdv: AppointmentDTO) => void;
}) {
  const enfant = rdv.enfant;
  const parent = rdv.utilisateur;

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  const calculateAge = (dateNaissance: string | null | undefined): string => {
    if (!dateNaissance) return '-';
    const birth = new Date(dateNaissance);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} an(s) ${remainingMonths} mois` : `${years} an(s)`;
  };

  return (
    <div className="min-h-[500px] flex flex-col">
      {/* ===== EN-TÊTE OFFICIEL ===== */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 px-8 py-5">
        <div className="flex items-center gap-4">
          {/* Logo / Emblème */}
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
            <Calendar className="h-9 w-9 text-blue-700" />
          </div>
          <div className="flex-1 text-white">
            <p className="text-xs font-medium uppercase tracking-widest opacity-80">
              République du Sénégal — Ministère de la Santé
            </p>
            <h2 className="text-xl font-bold tracking-wide mt-0.5">
              FICHE DE RENDEZ-VOUS
            </h2>
            <p className="text-xs opacity-70 mt-0.5">Programme de Vaccination - Suivi des Rendez-vous</p>
          </div>
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
            <Syringe className="h-8 w-8 text-blue-700" />
          </div>
        </div>
      </div>

      {/* ===== BARRE DE STATUT ===== */}
      <div className="px-8 py-3 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-700">Statut:</span>
          <StatutBadgeRDV statut={rdv.statut} />
        </div>
        <div className="text-sm text-muted-foreground">
          RDV #{rdv.id}
        </div>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="flex-1 px-8 py-6 page-lines space-y-6">
        {/* Section Enfant */}
        {enfant && (
          <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-700 uppercase tracking-wide text-sm">Enfant</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Nom Complet</p>
                <p className="font-bold text-gray-900 dark:text-white">{enfant.prenom} {enfant.nom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Date de Naissance</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(enfant.dateNaissance)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Sexe</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{enfant.sexe === 'MASCULIN' ? '👦 Masculin' : '👧 Féminin'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Âge Actuel</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{calculateAge(enfant.dateNaissance)}</p>
              </div>
              {enfant.lieuNaissance && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Lieu de Naissance</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{enfant.lieuNaissance}</p>
                </div>
              )}
              {enfant.allergies && (
                <div className="col-span-2 mt-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-600 font-medium text-xs uppercase">Allergies:</span>
                    <span className="font-semibold text-orange-700 dark:text-orange-400 text-xs">{enfant.allergies}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Vaccin et Date */}
        <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Syringe className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-blue-700 uppercase tracking-wide text-sm">Détails du Rendez-vous</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 ml-7">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Vaccin à Effectuer</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{rdv.nomVaccinAEffectuer || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Date Prévue</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{formatDate(rdv.date)}</p>
            </div>
          </div>
        </div>

        {/* Section Parent */}
        {parent && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-700 uppercase tracking-wide text-sm">Parent / Responsable</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Nom Complet</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{parent.prenom} {parent.nom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Téléphone</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {parent.telephone || 'N/A'}
                </p>
              </div>
              {parent.email && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Email</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{parent.email}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== PIED DE PAGE AVEC ACTIONS ===== */}
      <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        {onView && (
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(rdv)}>
            <Eye className="w-4 h-4 mr-1" /> Détails
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(rdv)}>
            <Edit className="w-4 h-4 mr-1" /> Modifier
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="destructive" onClick={() => onDelete(rdv)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function RendezVousCarnetModal({ 
  enfant,
  isOpen, 
  onClose,
  onView,
  onEdit,
  onDelete,
  onCreateAppointment
}: RendezVousCarnetModalProps) {
  const { data: appointments = [], isLoading } = useAppointmentsByEnfant(enfant?.id || 0);
  const [currentPage, setCurrentPage] = useState(0);
  const [animClass, setAnimClass] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = appointments.length;

  const flipToPage = useCallback((targetPage: number) => {
    if (targetPage === currentPage || isFlipping || targetPage < 0 || targetPage >= totalPages) return;
    const direction = targetPage > currentPage ? 'next' : 'prev';
    setIsFlipping(true);

    // Phase 1 : la page actuelle sort (flip out)
    setAnimClass(`flip-exit-${direction}`);

    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    flipTimeoutRef.current = setTimeout(() => {
      // Phase 2 : on change de page et la nouvelle entre (flip in)
      setCurrentPage(targetPage);
      setAnimClass(`flip-enter-${direction}`);

      flipTimeoutRef.current = setTimeout(() => {
        setAnimClass('');
        setIsFlipping(false);
      }, 700);
    }, 700);
  }, [currentPage, totalPages, isFlipping]);

  const goNext = useCallback(() => {
    flipToPage(currentPage + 1);
  }, [flipToPage, currentPage]);

  const goPrev = useCallback(() => {
    flipToPage(currentPage - 1);
  }, [flipToPage, currentPage]);

  return (
    <>
      <style>{flipStyles}</style>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none gap-0">
          
          {/* ===== LE CARNET ===== */}
          <div className="mx-auto w-full">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-visible border border-blue-200 dark:border-blue-900">
              
              {/* Reliure du carnet (spine) */}
              <div className="carnet-spine rounded-l-2xl" />

              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>

              {/* ===== ZONE DES PAGES DU CARNET ===== */}
              <div className="ml-6 relative">
                {isLoading ? (
                  <div className="p-8 space-y-4 min-h-[480px]">
                    <Skeleton className="h-8 w-56 mx-auto" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                  </div>
                ) : totalPages === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 p-8">
                    <div className="p-8 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                      <Calendar className="h-20 w-20 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                      Aucun rendez-vous
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Aucun rendez-vous n'a été enregistré. Les rendez-vous de vaccination apparaîtront ici sous forme de pages.
                    </p>
                    {onCreateAppointment && (
                      <Button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => onCreateAppointment(enfant)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau rendez-vous
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Zone de flip des pages */
                  <div className={`flip-perspective ${currentPage < totalPages - 1 ? 'stacked-pages' : ''}`}>
                    <div className={`flip-page ${animClass}`}>
                      <RendezVousPage 
                        rdv={appointments[currentPage]} 
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                      <div className="flip-page-shadow" />
                    </div>
                  </div>
                )}

                {totalPages > 0 && (
                  <div className="mt-6 flex items-center justify-between px-8 pb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goPrev}
                      disabled={currentPage === 0 || isFlipping}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>

                    <div className="text-center flex-1 mx-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Rendez-vous {currentPage + 1} sur {totalPages}
                      </p>
                      <div className="flex gap-1 justify-center mt-2 flex-wrap max-w-sm">
                        {appointments.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => flipToPage(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentPage
                                ? 'bg-blue-600 w-4'
                                : 'bg-blue-200 dark:bg-blue-800 w-2 hover:bg-blue-400'
                            }`}
                            disabled={isFlipping}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goNext}
                      disabled={currentPage === totalPages - 1 || isFlipping}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {onCreateAppointment && (
                  <div className="px-8 pb-6">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => onCreateAppointment(enfant)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau rendez-vous
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

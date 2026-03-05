import { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVaccinationsByAccessToken } from '@/services/public-carnet.service';
import type { EnfantDTO, VaccinationDTO } from '@/types';
import { StatutVaccinationLabels, StatutVaccinationColors } from '@/types/vaccination';
import {
  ChevronLeft,
  ChevronRight,
  Baby,
  Syringe,
  Calendar,
  User,
  Shield,
  Stethoscope,
  Pill,
  AlertTriangle,
  Hash,
  Building2,
  Droplets,
  MapPin,
  Phone,
  QrCode,
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

  .flip-perspective {
    perspective: 1800px;
    position: relative;
    overflow: visible;
  }

  .flip-page {
    transform-origin: left center;
    transform-style: flat;
    position: relative;
    z-index: 2;
  }

  @keyframes flipOutNext {
    0% { transform: rotateY(0deg); opacity: 1; }
    50% { transform: rotateY(-90deg); opacity: 0.6; box-shadow: 10px 0 30px rgba(0,0,0,0.3); }
    100% { transform: rotateY(-180deg); opacity: 0; }
  }
  @keyframes flipInNext {
    0% { transform: rotateY(90deg); opacity: 0; }
    50% { transform: rotateY(45deg); opacity: 0.6; box-shadow: -10px 0 30px rgba(0,0,0,0.3); }
    100% { transform: rotateY(0deg); opacity: 1; }
  }
  @keyframes flipOutPrev {
    0% { transform: rotateY(0deg); opacity: 1; }
    50% { transform: rotateY(90deg); opacity: 0.6; box-shadow: -10px 0 30px rgba(0,0,0,0.3); }
    100% { transform: rotateY(180deg); opacity: 0; }
  }
  @keyframes flipInPrev {
    0% { transform: rotateY(-90deg); opacity: 0; }
    50% { transform: rotateY(-45deg); opacity: 0.6; box-shadow: 10px 0 30px rgba(0,0,0,0.3); }
    100% { transform: rotateY(0deg); opacity: 1; }
  }

  .flip-exit-next { animation: flipOutNext 0.7s ease-in forwards; }
  .flip-enter-next { animation: flipInNext 0.7s ease-out forwards; }
  .flip-exit-prev { animation: flipOutPrev 0.7s ease-in forwards; }
  .flip-enter-prev { animation: flipInPrev 0.7s ease-out forwards; }

  .flip-page-shadow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 15%);
    pointer-events: none;
    z-index: 3;
  }

  .page-lines {
    background-image: repeating-linear-gradient(
      transparent,
      transparent 31px,
      #e8ecf1 31px,
      #e8ecf1 32px
    );
  }

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

// ================================
// COMPOSANT PAGE PUBLIQUE DU CARNET
// ================================

export default function PublicCarnetPage() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const { data: vaccinations, isLoading, isError } = useVaccinationsByAccessToken(accessToken);

  const [currentPage, setCurrentPage] = useState(0);
  const [animClass, setAnimClass] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const vaccinationList = vaccinations || [];
  const totalPages = vaccinationList.length;

  // Extraire les infos de l'enfant depuis la première vaccination
  const enfant: EnfantDTO | null =
    vaccinationList[0]?.enfant ||
    vaccinationList[0]?.appointment?.enfant ||
    null;

  const flipToPage = useCallback((targetPage: number) => {
    if (targetPage === currentPage || isFlipping || targetPage < 0 || targetPage >= totalPages) return;
    const direction = targetPage > currentPage ? 'next' : 'prev';
    setIsFlipping(true);

    setAnimClass(`flip-exit-${direction}`);

    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    flipTimeoutRef.current = setTimeout(() => {
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

  // ===== ÉTAT : CHARGEMENT =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <style>{flipStyles}</style>
        <div className="w-full max-w-4xl">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-visible border border-blue-200">
            <div className="carnet-spine rounded-l-2xl" />
            <div className="ml-6 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 px-8 py-5 rounded-tr-2xl">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-64 bg-blue-400/30" />
                  <Skeleton className="h-6 w-48 bg-blue-400/30" />
                </div>
              </div>
            </div>
            <div className="ml-6 p-8 space-y-4 min-h-[480px]">
              <Skeleton className="h-8 w-56 mx-auto" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ÉTAT : ERREUR OU TOKEN INVALIDE =====
  if (isError || !accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-800">Carnet introuvable</h1>
          <p className="text-red-600">
            Le lien d'accès au carnet de vaccination est invalide ou a expiré.
            Veuillez scanner à nouveau le QR code ou contacter le centre de santé.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-red-400 mt-4">
            <QrCode className="h-4 w-4" />
            <span>Accès par QR Code</span>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 md:p-8">
      <style>{flipStyles}</style>

      <div className="w-full max-w-4xl">
        {/* Badge QR Code */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-blue-100">
            <QrCode className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Carnet de Vaccination — Accès QR Code</span>
          </div>
        </div>

        {/* ===== LE CARNET ===== */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-visible border border-blue-200">
          
          {/* Reliure du carnet (spine) */}
          <div className="carnet-spine rounded-l-2xl" />

          {/* ===== EN-TÊTE OFFICIEL ===== */}
          <div className="ml-6 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 px-8 py-5 rounded-tr-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
                <Shield className="h-9 w-9 text-blue-700" />
              </div>
              <div className="flex-1 text-white">
                <p className="text-xs font-medium uppercase tracking-widest opacity-80">
                  République du Sénégal — Ministère de la Santé
                </p>
                <h2 className="text-xl font-bold tracking-wide mt-0.5">
                  CARNET DE VACCINATION
                </h2>
                <p className="text-xs opacity-70 mt-0.5">Programme Élargi de Vaccination (PEV)</p>
              </div>
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
                <Syringe className="h-8 w-8 text-blue-700" />
              </div>
            </div>
          </div>

          {/* ===== FICHE D'IDENTITÉ DE L'ENFANT ===== */}
          {enfant && (
            <div className="ml-6 px-8 py-4 bg-blue-50/80 border-b border-blue-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-500">Nom complet :</span>
                  <span className="font-bold text-gray-900">
                    {enfant.prenom} {enfant.nom}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-500">Né(e) le :</span>
                  <span className="font-semibold text-gray-800">{formatDate(enfant.dateNaissance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-500">Sexe :</span>
                  <span className="font-semibold text-gray-800">{enfant.sexe === 'MASCULIN' ? 'Masculin' : 'Féminin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-500">Âge :</span>
                  <span className="font-semibold text-gray-800">{calculateAge(enfant.dateNaissance)}</span>
                </div>
                {enfant.groupeSanguin && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <span className="text-blue-500">Groupe sanguin :</span>
                    <span className="font-bold text-red-600">{enfant.groupeSanguin}</span>
                  </div>
                )}
                {enfant.lieuNaissance && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-500">Lieu :</span>
                    <span className="font-semibold text-gray-800">{enfant.lieuNaissance}</span>
                  </div>
                )}
                {enfant.parent && (
                  <div className="flex items-center gap-2 col-span-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-500">Parent :</span>
                    <span className="font-semibold text-gray-800">
                      {enfant.parent.prenom} {enfant.parent.nom}
                    </span>
                    {enfant.parent.telephone && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 ml-2">
                        <Phone className="h-3 w-3" />
                        {enfant.parent.telephone}
                      </span>
                    )}
                  </div>
                )}
                {enfant.allergies && (
                  <div className="flex items-center gap-2 col-span-3 mt-1 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-600 font-medium text-xs">ALLERGIES :</span>
                    <span className="font-semibold text-orange-700 text-xs">{enfant.allergies}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== ZONE DES PAGES DU CARNET ===== */}
          <div className="ml-6 relative">
            {totalPages === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 p-8">
                <div className="p-8 bg-blue-50 rounded-full">
                  <Syringe className="h-20 w-20 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-blue-800">
                  Carnet vierge
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Aucune vaccination n'a encore été enregistrée pour cet enfant.
                </p>
              </div>
            ) : (
              <div className={`flip-perspective ${currentPage < totalPages - 1 ? 'stacked-pages' : ''}`}>
                <div className={`flip-page page-lines ${animClass}`}>
                  <VaccinationPage
                    vaccination={vaccinationList[currentPage]}
                    pageNumber={currentPage + 1}
                    totalPages={totalPages}
                    formatDate={formatDate}
                  />
                </div>
                <div className="flip-page-shadow" />
              </div>
            )}
          </div>

          {/* ===== BARRE DE NAVIGATION ===== */}
          {totalPages > 0 && (
            <div className="ml-6 px-8 py-4 bg-gradient-to-r from-blue-50 to-white border-t border-blue-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentPage === 0 || isFlipping}
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Page précédente
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {vaccinationList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => !isFlipping && setCurrentPage(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentPage
                          ? 'bg-blue-600 w-6'
                          : 'bg-blue-200 hover:bg-blue-300 w-2.5'
                      }`}
                      title={`Page ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goNext}
                disabled={currentPage >= totalPages - 1 || isFlipping}
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-40"
              >
                Page suivante
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ===== PIED DU CARNET ===== */}
          <div className="ml-6 px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-center rounded-b-2xl">
            <p className="text-xs text-blue-200 font-medium">
              {totalPages > 0
                ? `Ce carnet contient ${totalPages} vaccination(s) enregistrée(s) — Document officiel`
                : 'Programme Élargi de Vaccination — Document officiel'}
            </p>
          </div>
        </div>

        {/* Mention en bas de page */}
        <div className="text-center mt-6 text-xs text-gray-400">
          <p>Carnet de vaccination numérique — Accès sécurisé par QR Code</p>
          <p className="mt-1">Ministère de la Santé et de l'Action Sociale — République du Sénégal</p>
        </div>
      </div>
    </div>
  );
}

// ================================
// COMPOSANT PAGE DE VACCINATION
// ================================

interface VaccinationPageProps {
  vaccination: VaccinationDTO;
  pageNumber: number;
  totalPages: number;
  formatDate: (date: string | null | undefined) => string;
}

function VaccinationPage({ vaccination, pageNumber, totalPages, formatDate }: VaccinationPageProps) {
  const vaccine = vaccination.vaccine;
  const appointment = vaccination.appointment;
  const vaccinateur = vaccination.utilisateur;

  const statutColors = StatutVaccinationColors[vaccination.statutVaccination] || StatutVaccinationColors.EN_ATTENTE;
  const statutLabel = StatutVaccinationLabels[vaccination.statutVaccination] || vaccination.statutVaccination;

  return (
    <div className="p-8 space-y-5 bg-white min-h-[480px]">
      {/* En-tête de page */}
      <div className="flex items-center justify-between border-b-2 border-blue-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            {pageNumber}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Vaccination N°{pageNumber}</p>
            <p className="text-xs text-gray-500">Page {pageNumber} sur {totalPages}</p>
          </div>
        </div>
        <Badge className={`${statutColors.bg} ${statutColors.text} border ${statutColors.border} font-semibold`}>
          {statutLabel}
        </Badge>
      </div>

      {/* Nom du vaccin */}
      <div className="text-center py-3 bg-blue-50/80 rounded-xl border border-blue-100">
        <div className="flex items-center justify-center gap-3">
          <Syringe className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">
            {vaccine?.nom || appointment?.nomVaccinAEffectuer || 'Vaccin non renseigné'}
          </h3>
        </div>
        <p className="text-sm text-blue-600/70 mt-1 font-medium">
          Administré le {formatDate(vaccination.date)}
        </p>
      </div>

      {/* Détails en 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne gauche — Vaccin */}
        <div className="space-y-3 p-4 rounded-xl border border-blue-100 bg-white">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 border-b border-blue-100 pb-2">
            <Pill className="h-3.5 w-3.5" />
            Informations du Vaccin
          </h4>
          <div className="space-y-2.5 text-sm">
            {vaccine?.fabricant && (
              <InfoRow icon={<Building2 className="h-3.5 w-3.5" />} label="Fabricant" value={vaccine.fabricant} />
            )}
            {vaccine?.numeroLot && (
              <InfoRow icon={<Hash className="h-3.5 w-3.5" />} label="N° Lot" value={vaccine.numeroLot} mono />
            )}
            {vaccine?.typeVaccin && (
              <InfoRow icon={<Pill className="h-3.5 w-3.5" />} label="Type" value={vaccine.typeVaccin} badge />
            )}
            {vaccine?.modeAdministration && (
              <InfoRow icon={<Syringe className="h-3.5 w-3.5" />} label="Voie" value={vaccine.modeAdministration} />
            )}
            {vaccine?.dosage && (
              <InfoRow icon={<Pill className="h-3.5 w-3.5" />} label="Dosage" value={vaccine.dosage} />
            )}
          </div>
        </div>

        {/* Colonne droite — Détails vaccination */}
        <div className="space-y-3 p-4 rounded-xl border border-blue-100 bg-white">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 border-b border-blue-100 pb-2">
            <Stethoscope className="h-3.5 w-3.5" />
            Détails de l'acte
          </h4>
          <div className="space-y-2.5 text-sm">
            <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Date vaccination" value={formatDate(vaccination.date)} />

            {vaccinateur && (
              <InfoRow icon={<User className="h-3.5 w-3.5" />} label="Vaccinateur" value={`Dr. ${vaccinateur.prenom} ${vaccinateur.nom}`} />
            )}

            {appointment?.date && (
              <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="RDV prévu le" value={formatDate(appointment.date)} />
            )}

            {vaccine?.dateExpiration && (
              <InfoRow
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
                label="Exp. vaccin"
                value={formatDate(vaccine.dateExpiration)}
                danger={new Date(vaccine.dateExpiration) < new Date()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Notes / Effets secondaires */}
      {(vaccine?.description || vaccine?.effetsSecondaires) && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          {vaccine?.description && (
            <p className="text-xs text-slate-700">
              <span className="font-bold text-blue-700">Description :</span> {vaccine.description}
            </p>
          )}
          {vaccine?.effetsSecondaires && (
            <p className="text-xs text-slate-600">
              <span className="font-bold text-orange-600 inline-flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Effets secondaires :
              </span>{' '}
              {vaccine.effetsSecondaires}
            </p>
          )}
        </div>
      )}

      {/* Tampon / Signature zone */}
      <div className="flex justify-end pt-2">
        <div className="text-center p-3 border-2 border-dashed border-blue-200 rounded-xl w-48">
          <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Cachet & Signature</p>
          <div className="h-10 flex items-center justify-center">
            {vaccinateur && (
              <p className="text-xs italic text-blue-600">
                Dr. {vaccinateur.prenom} {vaccinateur.nom}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================
// COMPOSANT LIGNE D'INFO
// ================================
function InfoRow({
  icon,
  label,
  value,
  mono,
  badge: isBadge,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-gray-500 flex items-center gap-1.5 flex-shrink-0">
        {icon}
        <span className="text-xs">{label}</span>
      </span>
      {isBadge ? (
        <Badge variant="outline" className="text-xs font-medium">{value}</Badge>
      ) : (
        <span className={`font-medium text-right ${mono ? 'font-mono text-xs bg-blue-50 px-2 py-0.5 rounded' : ''} ${danger ? 'text-red-600 font-semibold' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
}

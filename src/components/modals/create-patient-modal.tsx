import { useModal } from '../shared/modal-provider';
import { BaseModal } from '../shared/base-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, Check, ChevronsUpDown, User, Baby } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNotification } from '../shared/app-notification';
import { useCreateEnfant, useCreateParent } from '@/services/index.service';
import { GroupeSanguinValues, LangueMaternelleValues, NiveauInstructionValues, NiveauEtudeValues, ZoneResidenceValues, NiveauRevenuValues, StatutMatrimonialValues, type CreateEnfantDTO, type CreateParentDTO } from '@/types';

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
    nom: 'Ndiaye',
    prenom: 'Aminata',
    dateNaissance: '1985-03-15',
    age: 40,
    telephone: '77 123 45 67',
    email: 'aminata.ndiaye@email.com',
    adresse: 'Quartier Médina, Dakar',
    sexe: 'F',
    typePatient: 'adulte'
  },
  {
    id: '2',
    nom: 'Diop',
    prenom: 'Mamadou',
    dateNaissance: '1982-07-22',
    age: 43,
    telephone: '78 987 65 43',
    email: 'mamadou.diop@email.com',
    adresse: 'Avenue Blaise Diagne, Thiès',
    sexe: 'M',
    typePatient: 'adulte'
  },
  {
    id: '3',
    nom: 'Sarr',
    prenom: 'Fatou',
    dateNaissance: '1990-11-08',
    age: 34,
    telephone: '76 554 33 21',
    email: 'fatou.sarr@email.com',
    adresse: 'Cité Keur Gorgui, Dakar',
    sexe: 'F',
    typePatient: 'adulte'
  }
];

type PatientFormData = {
  typePatient: 'adulte' | 'enfant';
};


export function CreatePatientModal() {
  const { closeModal } = useModal();
  const notification = useNotification();
  const [formData, setFormData] = useState<Partial<(CreateParentDTO & CreateEnfantDTO ) & PatientFormData>>({
    typePatient: 'adulte',
    sexe: 'MASCULIN',
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [openParentCombo, setOpenParentCombo] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Patient | null>(null);

  const { mutateAsync: createParent } = useCreateParent();
  const { mutateAsync: createEnfant } = useCreateEnfant();

  const modalId = 'create-patient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.adresse) {
      notification.validation("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.typePatient === 'adulte' && !formData.telephone) {
      notification.validation("Veuillez fournir un numéro de téléphone pour ce patient.");
      return;
    }
    const phoneRegex = /^((\+221)?7[015678]\d{7}|(33)\d{7})$/;
    if (formData.telephone &&!phoneRegex.test(formData.telephone)) {
      notification.error({
        title: "Format téléphone invalide",
        description: "Veuillez vérifier le numéro de téléphone"
      });
      return;
    }

    // Validation spécifique pour les enfants
    if (formData.typePatient === 'enfant' && !selectedParent) {
      notification.validation("Veuillez sélectionner un parent pour ce patient enfant");
      return;
    }

    // Validation de l'âge pour les enfants
    if (formData.typePatient === 'enfant' && selectedDate) {
      const age = new Date().getFullYear() - selectedDate.getFullYear();
      if (age >= 18) {
        notification.warning({
          title: "Âge incohérent",
          description: "Un patient de plus de 18 ans devrait être enregistré comme adulte"
        });
        return;
      }
    }

    // Validation de l'âge pour les adultes
      const age: number = formData.age ? Number(formData.age) : NaN;
      if (formData.typePatient === 'adulte' && isNaN(age)) {
        notification.validation("Âge invalide pour ce patient");
        return;
      }
      if(formData.age !== undefined && formData.age !== null && formData.typePatient === 'adulte' && formData.age < 18) {
        notification.warning({
          title: "Âge incohérent",
          description: "L'age du patient dois supérieur ou égal à 18 ans"
        });
        return;
      }

    // Validation de l'email si fourni
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      notification.error({
        title: "Format email invalide",
        description: "Veuillez vérifier l'adresse email"
      });
      return;
    }

  if (formData.groupeSanguin && !GroupeSanguinValues.includes(formData.groupeSanguin)) {
    notification.validation("Le groupe sanguin est invalide");
    return;
  }

  const poids = Number(formData.poids);
  if (formData.poids && (isNaN(poids) || poids <= 0)) {
    notification.validation("Le poids doit être un nombre positif valide");
    return;
  }

  const taille = Number(formData.taille);
  if (formData.taille && (isNaN(taille) || taille <= 0)) {
    notification.validation("La taille doit être un nombre positif valide");
    return;
  }



    // Simulation de l'enregistrement
    const loadingId = notification.loading({
      title: "Création du patient en cours...",
      description: "Enregistrement des informations",
      duration: 4000
    });

    // Préparer les données
    const { typePatient, ...rest } = formData;
    // Simulation de l'enregistrement
    const parentData = {
      ...rest,
      password: formData.password ?? '1234', // mot de passe par défaut
    }as CreateParentDTO;

    const enfantData = {
      ...rest,
      dateNaissance: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      parentId: selectedParent?.id ? Number(selectedParent.id) : undefined,
    }as CreateEnfantDTO & { parentId?: number };

    try {
      let response;
      if (typePatient === 'adulte') {
        response = await createParent(parentData)
      }
      if (typePatient === 'enfant') {
        response = await createEnfant(enfantData)
        
      }
      console.log('Patient créé avec succès :', response);

      setTimeout(() => {
        notification.updateLoading(loadingId, {
          type: 'success',
          title: "Patient créé avec succès",
          description: `${formData.prenom} ${formData.nom} a été ajouté${formData.typePatient === 'enfant' ? '(e)' : ''} à la base de données`,
        });
        closeModal();
      
        // Reset form
        setFormData({ typePatient: 'adulte', sexe: 'MASCULIN' });
        setSelectedDate(undefined);
        setSelectedParent(null);
    }, 1500);

    } catch (error) {
      console.error('Erreur lors de la création du patient :', error);
      notification.updateLoading(loadingId, {
        type: 'error',
        title: "Erreur de création",
        description: "Une erreur est survenue lors de la création du patient. Veuillez réessayer."
      });
    }

  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const age = new Date().getFullYear() - date.getFullYear();
      setFormData(prev => ({ 
        ...prev, 
        dateNaissance: format(date, 'yyyy-MM-dd'),
        age 
      }));
    }
  };

  const handleTypeChange = (isEnfant: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      typePatient: isEnfant ? 'enfant' : 'adulte' 
    }));
    if (!isEnfant) {
      setSelectedParent(null);
    }
  };

  const handleParentSelect = (parent: Patient) => {
    setSelectedParent(parent);
    setOpenParentCombo(false);
  };

  return (
    <BaseModal
      modalId={modalId}
      title="Nouveau patient"
      description="Créer un nouveau patient (adulte ou enfant)"
      showFooter={false}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Switch Type de Patient */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Type de patient</div>
              <div className="text-sm text-muted-foreground">
                {formData.typePatient === 'enfant' ? 'Patient mineur' : 'Patient adulte'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Label htmlFor="type-switch" className="text-sm font-medium">
              Adulte
            </Label>
            <Switch
              id="type-switch"
              checked={formData.typePatient === 'enfant'}
              onCheckedChange={handleTypeChange}
            />
            <Label htmlFor="type-switch" className="text-sm font-medium flex items-center space-x-1">
              <Baby className="w-4 h-4" />
              <span>Enfant</span>
            </Label>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom || ''}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              placeholder="Prénom"
              // required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom || ''}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              placeholder="Nom de famille"
              // required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {formData.typePatient === 'enfant' ? (
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="age">Âge *</Label>
              <Input
                id="age"
                type="text"
                value={formData.age !== undefined && formData.age !== null ? String(formData.age) : ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Entrez l'âge du patient"
                // min={0}
              />
            </div>
          )}

          {formData.typePatient === 'enfant' ? (
            <div className="space-y-2">
              <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
              <Input
                id="lieuNaissance"
                value={formData.lieuNaissance || ''}
                onChange={(e) => handleInputChange('lieuNaissance', e.target.value)}
                placeholder="Ville-Région de naissance"
              />
            </div>
          ) : null}

          <div className={`${formData.typePatient === "enfant" ? "col-span-2" : ""} space-y-2`}>
            <Label htmlFor="sexe">Sexe *</Label>
            <Select
              value={formData.sexe || 'MASCULIN'}
              onValueChange={(value) => handleInputChange('sexe', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASCULIN">Masculin</SelectItem>
                <SelectItem value="FEMININ">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sélection du parent si c'est un enfant */}
        {formData.typePatient === 'enfant' && (
          <div className="space-y-2">
            <Label htmlFor="parent">Parent/Tuteur légal *</Label>
            <Popover open={openParentCombo} onOpenChange={setOpenParentCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openParentCombo}
                  className="w-full justify-between"
                >
                  {selectedParent ? (
                    <span className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>
                        {selectedParent.prenom} {selectedParent.nom} ({selectedParent.telephone})
                      </span>
                    </span>
                  ) : (
                    "Sélectionner un parent..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un parent..." />
                  <CommandList>
                    <CommandEmpty>Aucun parent trouvé.</CommandEmpty>
                    <CommandGroup>
                      {parentsData.map((parent) => (
                        <CommandItem
                          key={parent.id}
                          value={`${parent.prenom} ${parent.nom} ${parent.telephone}`}
                          onSelect={() => handleParentSelect(parent)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedParent?.id === parent.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {parent.prenom} {parent.nom}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {parent.telephone} • {parent.email}
                              </div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Contact et adresse */}
           {formData.typePatient !== 'enfant' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={formData.telephone || ''}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="77 123 45 67"
              />
              </div>

        
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@gmail.com"
                />
              </div>
            </div>
           )}

        {/* Champs supplémentaires pour les parents */}
        {formData.typePatient !== 'enfant' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statutMatrimonial">Statut matrimonial</Label>
                <Select
                  value={formData.statutMatrimonial || ''}
                  onValueChange={(value) => handleInputChange('statutMatrimonial', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {StatutMatrimonialValues.map(statut => (
                      <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession || ''}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="Ex: Commerçante, Enseignant"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="langueMaternelle">Langue maternelle</Label>
                <Select
                  value={formData.langueMaternelle || ''}
                  onValueChange={(value) => handleInputChange('langueMaternelle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner la langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {LangueMaternelleValues.map(langue => (
                      <SelectItem key={langue} value={langue}>{langue}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveauEtude">Niveau d'étude</Label>
                <Select
                  value={formData.niveauEtude || ''}
                  onValueChange={(value) => handleInputChange('niveauEtude', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {NiveauEtudeValues.map(niveau => (
                      <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niveauInstruction">Niveau d'instruction</Label>
                <Select
                  value={formData.niveauInstruction || ''}
                  onValueChange={(value) => handleInputChange('niveauInstruction', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {NiveauInstructionValues.map(niveau => (
                      <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre_enfants">Nombre d'enfants</Label>
                <Input
                  id="nombre_enfants"
                  type="number"
                  min={0}
                  value={formData.nombre_enfants !== undefined && formData.nombre_enfants !== null ? String(formData.nombre_enfants) : ''}
                  onChange={(e) => handleInputChange('nombre_enfants', e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Ex: 3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zoneResidence">Zone de résidence</Label>
                <Select
                  value={formData.zoneResidence || ''}
                  onValueChange={(value) => handleInputChange('zoneResidence', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner la zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZoneResidenceValues.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveauRevenu">Niveau de revenu</Label>
                <Select
                  value={formData.niveauRevenu || ''}
                  onValueChange={(value) => handleInputChange('niveauRevenu', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {NiveauRevenuValues.map(niveau => (
                      <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance_centre_sante">Distance centre de santé (km)</Label>
                <Input
                  id="distance_centre_sante"
                  type="number"
                  step="0.1"
                  min={0}
                  value={formData.distance_centre_sante !== undefined && formData.distance_centre_sante !== null ? String(formData.distance_centre_sante) : ''}
                  onChange={(e) => handleInputChange('distance_centre_sante', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Ex: 5.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acces_transport">Accès au transport</Label>
                <Select
                  value={formData.acces_transport || ''}
                  onValueChange={(value) => handleInputChange('acces_transport', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oui">Oui</SelectItem>
                    <SelectItem value="Non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retard_vaccinal">Retard vaccinal</Label>
                <Select
                  value={formData.retard_vaccinal || ''}
                  onValueChange={(value) => handleInputChange('retard_vaccinal', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oui">Oui</SelectItem>
                    <SelectItem value="Non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informations tuteurs */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h4 className="font-medium text-sm">Tuteur 1</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prenomTuteur1" className="text-xs">Prénom</Label>
                  <Input
                    id="prenomTuteur1"
                    value={formData.prenomTuteur1 || ''}
                    onChange={(e) => handleInputChange('prenomTuteur1', e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nomTuteur1" className="text-xs">Nom</Label>
                  <Input
                    id="nomTuteur1"
                    value={formData.nomTuteur1 || ''}
                    onChange={(e) => handleInputChange('nomTuteur1', e.target.value)}
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numeroTuteur1" className="text-xs">Téléphone</Label>
                  <Input
                    id="numeroTuteur1"
                    value={formData.numeroTuteur1 || ''}
                    onChange={(e) => handleInputChange('numeroTuteur1', e.target.value)}
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h4 className="font-medium text-sm">Tuteur 2</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prenomTuteur2" className="text-xs">Prénom</Label>
                  <Input
                    id="prenomTuteur2"
                    value={formData.prenomTuteur2 || ''}
                    onChange={(e) => handleInputChange('prenomTuteur2', e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nomTuteur2" className="text-xs">Nom</Label>
                  <Input
                    id="nomTuteur2"
                    value={formData.nomTuteur2 || ''}
                    onChange={(e) => handleInputChange('nomTuteur2', e.target.value)}
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numeroTuteur2" className="text-xs">Téléphone</Label>
                  <Input
                    id="numeroTuteur2"
                    value={formData.numeroTuteur2 || ''}
                    onChange={(e) => handleInputChange('numeroTuteur2', e.target.value)}
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
              <Select
                value={formData.groupeSanguin || ''}
                onValueChange={(value) => handleInputChange('groupeSanguin', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le groupe sanguin" />
                </SelectTrigger>
                <SelectContent>
                  {GroupeSanguinValues.map(groupe => (
                    <SelectItem key={groupe} value={groupe}>{groupe}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse complète *</Label>
            <Input
              id="adresse"
              value={formData.adresse || ''}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              placeholder="Quartier, ville"
            />
          </div>
        </div>

        {/* Champs supplémentaires pour les enfants */}
        {formData.typePatient === 'enfant' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poids">Poids (kg)</Label>
                <Input
                  id="poids"
                  type="text"
                  step="0.1"
                  value={formData.poids || ''}
                  onChange={(e) => handleInputChange('poids', e.target.value)}
                  placeholder="Ex: 15.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taille">Taille (cm)</Label>
                <Input
                  id="taille"
                  type="text"
                  step="0.1"
                  value={formData.taille || ''}
                  onChange={(e) => handleInputChange('taille', e.target.value)}
                  placeholder="Ex: 85.0"
                />
              </div>
            </div>
          </>
        )}

        {/* Champs Allergies et Antécédents pour tous */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (séparées par des virgules)</Label>
            <Input
              id="allergies"
              value={formData.allergies || ''}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="Ex: Pénicilline, Arachides, Lactose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="antecedentsMedicaux">Antécédents médicaux (séparés par des virgules)</Label>
            <Input
              id="antecedentsMedicaux"
              value={formData.antecedentsMedicaux || ''}
              onChange={(e) => handleInputChange('antecedentsMedicaux', e.target.value)}
              placeholder="Ex: Asthme, Diabète, Eczéma"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => closeModal()}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le patient
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/shared/base-modal';
import { useModal } from '@/components/shared/modal-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VaccinFormData {
  id?: string;
  nom: string;
  description: string;
  ageMin: string;
  ageMax: string;
  obligatoire: boolean;
  rappels: string[];
  cible: 'enfant' | 'femme_enceinte' | 'femme_post_accouchement' | 'adulte' | 'senior';
}

const initialFormData: VaccinFormData = {
  nom: '',
  description: '',
  ageMin: '',
  ageMax: '',
  obligatoire: false,
  rappels: [],
  cible: 'enfant'
};

export function UpdateVaccinModal() {
  const { getModalData } = useModal();
  const [formData, setFormData] = useState<VaccinFormData>(initialFormData);
  const [rappelInput, setRappelInput] = useState('');

  const modalData = getModalData('update-vaccin');

  useEffect(() => {
    if (modalData) {
      setFormData({ ...initialFormData, ...modalData });
    } else {
      setFormData(initialFormData);
    }
  }, [modalData]);

  const handleSubmit = () => {
    console.log('Modification du vaccin:', formData);
    // Ici vous ajouterez la logique de modification
  };

  const addRappel = () => {
    if (rappelInput.trim()) {
      setFormData(prev => ({
        ...prev,
        rappels: [...prev.rappels, rappelInput.trim()]
      }));
      setRappelInput('');
    }
  };

  const removeRappel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rappels: prev.rappels.filter((_, i) => i !== index)
    }));
  };

  return (
    <BaseModal
      modalId="update-vaccin"
      title="Modifier le vaccin"
      description="Modifiez les informations du vaccin sélectionné"
      onConfirm={handleSubmit}
      size="lg"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du vaccin *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Ex: BCG, DTC-Polio..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cible">Cible *</Label>
            <Select
              value={formData.cible}
              onValueChange={(value: VaccinFormData['cible']) => 
                setFormData(prev => ({ ...prev, cible: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enfant">Enfant</SelectItem>
                <SelectItem value="femme_enceinte">Femme enceinte</SelectItem>
                <SelectItem value="femme_post_accouchement">Femme après accouchement</SelectItem>
                <SelectItem value="adulte">Adulte</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description du vaccin..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ageMin">Âge minimum</Label>
            <Input
              id="ageMin"
              value={formData.ageMin}
              onChange={(e) => setFormData(prev => ({ ...prev, ageMin: e.target.value }))}
              placeholder="Ex: Naissance, 2 mois..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageMax">Âge maximum</Label>
            <Input
              id="ageMax"
              value={formData.ageMax}
              onChange={(e) => setFormData(prev => ({ ...prev, ageMax: e.target.value }))}
              placeholder="Ex: 6 mois, 2 ans..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="obligatoire"
            checked={formData.obligatoire}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, obligatoire: checked }))}
          />
          <Label htmlFor="obligatoire">Vaccin obligatoire</Label>
        </div>

        <div className="space-y-2">
          <Label>Rappels</Label>
          <div className="flex space-x-2">
            <Input
              value={rappelInput}
              onChange={(e) => setRappelInput(e.target.value)}
              placeholder="Ex: 1 mois, 6 mois..."
              onKeyPress={(e) => e.key === 'Enter' && addRappel()}
            />
            <button
              type="button"
              onClick={addRappel}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Ajouter
            </button>
          </div>
          {formData.rappels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.rappels.map((rappel, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  {rappel}
                  <button
                    onClick={() => removeRappel(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

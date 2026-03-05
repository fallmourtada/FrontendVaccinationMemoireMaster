import { useModal } from '../shared/modal-provider';
import { BaseModal } from '../shared/base-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface RendezVous {
  id: string;
  patientNom: string;
  patientPrenom: string;
  patientAge: number;
  telephone: string;
  email: string;
  date: string;
  heure: string;
  vaccin: string;
  type: 'vaccination' | 'consultation' | 'rappel';
  statut: 'en_attente' | 'confirme' | 'annule' | 'reporte';
  notes?: string;
}

export function UpdateRendezVousModal() {
  const { isModalOpen, getModalData, closeModal } = useModal();
  const [formData, setFormData] = useState<Partial<RendezVous>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();

  const modalId = 'update-rendez-vous';
  const isOpen = isModalOpen(modalId);
  const data = getModalData(modalId);

  useEffect(() => {
    if (isOpen && data) {
      const rendezVous = data as RendezVous;
      setFormData(rendezVous);
      // Convertir la date string en objet Date
      if (rendezVous.date) {
        setSelectedDate(new Date(rendezVous.date));
      }
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convertir la date en string avant d'envoyer
    const finalData = {
      ...formData,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : formData.date
    };
    console.log('Mise à jour du rendez-vous:', finalData);
    closeModal();
  };

  const handleInputChange = (field: keyof RendezVous, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  return (
    <BaseModal
      modalId={modalId}
      title="Modifier le rendez-vous"
      description="Modifiez les informations du rendez-vous"
      showFooter={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientNom">Nom du patient</Label>
            <Input
              id="patientNom"
              value={formData.patientNom || ''}
              onChange={(e) => handleInputChange('patientNom', e.target.value)}
              placeholder="Nom de famille"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPrenom">Prénom du patient</Label>
            <Input
              id="patientPrenom"
              value={formData.patientPrenom || ''}
              onChange={(e) => handleInputChange('patientPrenom', e.target.value)}
              placeholder="Prénom"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientAge">Âge</Label>
            <Input
              id="patientAge"
              type="number"
              value={formData.patientAge || ''}
              onChange={(e) => handleInputChange('patientAge', parseInt(e.target.value))}
              placeholder="Âge du patient"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={formData.telephone || ''}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              placeholder="01 23 45 67 89"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="email@exemple.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
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
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heure">Heure</Label>
            <Input
              id="heure"
              type="time"
              value={formData.heure || ''}
              onChange={(e) => handleInputChange('heure', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vaccin">Vaccin</Label>
            <Select
              value={formData.vaccin || ''}
              onValueChange={(value) => handleInputChange('vaccin', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un vaccin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BCG">BCG</SelectItem>
                <SelectItem value="Hépatite B">Hépatite B</SelectItem>
                <SelectItem value="DTC-Polio">DTC-Polio-Hib</SelectItem>
                <SelectItem value="Pneumocoque">Pneumocoque</SelectItem>
                <SelectItem value="ROR">ROR</SelectItem>
                <SelectItem value="Méningocoque">Méningocoque</SelectItem>
                <SelectItem value="HPV">HPV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select
              value={formData.statut || ''}
              onValueChange={(value) => handleInputChange('statut', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
                <SelectItem value="reporte">Reporté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Informations complémentaires..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => closeModal()}>
            Annuler
          </Button>
          <Button type="submit">
            Mettre à jour
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}

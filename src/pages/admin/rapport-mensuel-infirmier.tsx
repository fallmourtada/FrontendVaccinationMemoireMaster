import { useMemo, useState } from 'react';
import PageContainer from '@/components/shared/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import { useUserByEmail } from '@/services/user.service';
import type { UtilisateurDTO } from '@/types';
import type { VaccineLineReport } from '@/types/monthly-vaccine-report';
import {
  createEmptyLines,
  getReportsForCentre,
  saveMonthlyReport,
} from '@/services/monthly-vaccine-report.service';
import { toast } from 'sonner';
import { AlertCircle, Send } from 'lucide-react';

const MOIS = [
  { v: 1, l: 'Janvier' },
  { v: 2, l: 'Février' },
  { v: 3, l: 'Mars' },
  { v: 4, l: 'Avril' },
  { v: 5, l: 'Mai' },
  { v: 6, l: 'Juin' },
  { v: 7, l: 'Juillet' },
  { v: 8, l: 'Août' },
  { v: 9, l: 'Septembre' },
  { v: 10, l: 'Octobre' },
  { v: 11, l: 'Novembre' },
  { v: 12, l: 'Décembre' },
];

export default function RapportMensuelInfirmierPage() {
  const { decodedToken } = useDecodedToken();
  const { data: user } = useUserByEmail(decodedToken?.sub || '');

  const centre = (user as UtilisateurDTO & { centre?: { id?: unknown; nom?: string; name?: string; locality?: { id?: unknown } } })?.centre;
  const centreId = centre?.id != null ? Number(centre.id) : NaN;
  const centreName = String(centre?.nom || centre?.name || 'Mon poste');
  const districtId = centre?.locality?.id != null ? Number(centre.locality.id) : NaN;

  const prev = useMemo(() => {
    const d = new Date();
    const p = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return { y: p.getFullYear(), m: p.getMonth() + 1 };
  }, []);

  const [year, setYear] = useState(prev.y);
  const [month, setMonth] = useState(prev.m);
  const [lines, setLines] = useState<VaccineLineReport[]>(() => createEmptyLines());
  const [listRev, setListRev] = useState(0);

  const historique = useMemo(() => {
    if (!Number.isFinite(centreId)) return [];
    return getReportsForCentre(centreId);
  }, [centreId, listRev]);

  const updateLine = (code: string, field: keyof VaccineLineReport, raw: string) => {
    const n = Math.max(0, Math.floor(Number(raw) || 0));
    setLines((prev) =>
      prev.map((row) => (row.vaccinCode === code ? { ...row, [field]: n } : row))
    );
  };

  const envoyer = () => {
    if (!Number.isFinite(centreId) || !Number.isFinite(districtId)) {
      toast.error('Profil sans poste ou district. Vérifiez le user-service.');
      return;
    }
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    saveMonthlyReport({
      id,
      centreId,
      centreName,
      districtLocalityId: districtId,
      authorEmail: decodedToken?.sub || '',
      authorName: `${(user as UtilisateurDTO)?.prenom || ''} ${(user as UtilisateurDTO)?.nom || ''}`.trim(),
      year,
      month,
      vaccines: lines.map((l) => ({ ...l })),
      submittedAt: new Date().toISOString(),
    });
    toast.success('Rapport enregistré et transmis au district (stockage local).');
    setLines(createEmptyLines());
    setListRev((x) => x + 1);
  };

  if (!Number.isFinite(centreId) || !Number.isFinite(districtId)) {
    return (
      <PageContainer title="Rapport mensuel vaccins" subtitle="Fin de mois — doses et vaccinations par type de vaccin">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex gap-3 py-6">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              Impossible de déterminer votre poste ou le district. Chargez votre profil (user-service) puis réessayez.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Rapport mensuel vaccins"
      subtitle={`Poste : ${centreName} — à envoyer en fin de mois au district (doses utilisées / restantes, filles et garçons vaccinés par vaccin)`}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Période du rapport</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Année</label>
              <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-32" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mois</label>
              <select
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 text-sm"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MOIS.map((m) => (
                  <option key={m.v} value={m.v}>
                    {m.l}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saisie par vaccin</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="p-2">Vaccin</th>
                  <th className="p-2">Doses utilisées</th>
                  <th className="p-2">Doses restantes</th>
                  <th className="p-2">Filles vaccinées</th>
                  <th className="p-2">Garçons vaccinés</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((row) => (
                  <tr key={row.vaccinCode} className="border-b">
                    <td className="p-2 font-medium">{row.vaccinLabel}</td>
                    <td className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={row.dosesUtilisees}
                        onChange={(e) => updateLine(row.vaccinCode, 'dosesUtilisees', e.target.value)}
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={row.dosesRestantes}
                        onChange={(e) => updateLine(row.vaccinCode, 'dosesRestantes', e.target.value)}
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={row.fillesVaccinees}
                        onChange={(e) => updateLine(row.vaccinCode, 'fillesVaccinees', e.target.value)}
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={row.garconsVaccines}
                        onChange={(e) => updateLine(row.vaccinCode, 'garconsVaccines', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button className="mt-4" onClick={envoyer}>
              <Send className="mr-2 h-4 w-4" />
              Enregistrer et envoyer au district
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Données stockées localement (navigateur) en attendant l’API. Une soumission remplace le rapport du même mois pour ce poste.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes rapports envoyés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historique.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun rapport pour ce poste.</p>
            ) : (
              historique.map((r) => (
                <div key={r.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold">
                    {r.year} — {MOIS.find((m) => m.v === r.month)?.l || r.month} — {new Date(r.submittedAt).toLocaleString('fr-FR')}
                  </p>
                  <ul className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
                    {r.vaccines.map((v) => (
                      <li key={v.vaccinCode}>
                        <span className="font-medium text-foreground">{v.vaccinCode}</span> : util. {v.dosesUtilisees}, rest.{' '}
                        {v.dosesRestantes}, F {v.fillesVaccinees}, G {v.garconsVaccines}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

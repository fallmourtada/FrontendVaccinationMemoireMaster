import { useMemo } from 'react';
import PageContainer from '@/components/shared/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import { useUserByEmail } from '@/services/user.service';
import type { UtilisateurDTO } from '@/types';
import { getReportsForDistrict } from '@/services/monthly-vaccine-report.service';
import { AlertCircle } from 'lucide-react';

const MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export default function RapportsDistrictIcpPage() {
  const { decodedToken } = useDecodedToken();
  const { data: user } = useUserByEmail(decodedToken?.sub || '');

  const districtId = useMemo(() => {
    const loc = (user as UtilisateurDTO & { centre?: { locality?: { id?: unknown } } })?.centre?.locality?.id;
    return loc != null ? Number(loc) : NaN;
  }, [user]);

  const rapports = useMemo(() => {
    if (!Number.isFinite(districtId)) return [];
    return getReportsForDistrict(districtId);
  }, [districtId, user]);

  if (!Number.isFinite(districtId)) {
    return (
      <PageContainer title="Rapports du district" subtitle="Rapports mensuels reçus des postes de santé">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex gap-3 py-6">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              District non trouvé sur votre profil ICP. Vérifiez le user-service et le rattachement au district.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Rapports des postes (district)"
      subtitle="Rapports mensuels de vaccins transmis par chaque poste de votre district"
    >
      <div className="space-y-4">
        {rapports.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Aucun rapport reçu pour l’instant. Les infirmiers envoient depuis « Rapport mensuel vaccins ».
            </CardContent>
          </Card>
        ) : (
          rapports.map((r) => (
            <Card key={r.id}>
              <CardHeader className="border-b bg-blue-50/60">
                <CardTitle className="text-lg">
                  {r.centreName}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    — {MOIS[r.month - 1] || r.month} {r.year}
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Reçu le {new Date(r.submittedAt).toLocaleString('fr-FR')} — Infirmier : {r.authorName || r.authorEmail}
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="p-2">Vaccin</th>
                        <th className="p-2">Doses utilisées</th>
                        <th className="p-2">Doses restantes</th>
                        <th className="p-2">Filles vaccinées</th>
                        <th className="p-2">Garçons vaccinés</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.vaccines.map((v) => (
                        <tr key={v.vaccinCode} className="border-b">
                          <td className="p-2 font-medium">{v.vaccinLabel}</td>
                          <td className="p-2">{v.dosesUtilisees}</td>
                          <td className="p-2">{v.dosesRestantes}</td>
                          <td className="p-2">{v.fillesVaccinees}</td>
                          <td className="p-2">{v.garconsVaccines}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  );
}

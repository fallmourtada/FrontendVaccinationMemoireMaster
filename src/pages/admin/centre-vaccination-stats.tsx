import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Baby,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Hospital,
  Users,
  UserX,
} from "lucide-react";

import PageContainer from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MonthStat = {
  month: string;
  enrolled: number;
  vaccinated: number;
};

type CentreState = {
  centre?: {
    id?: number | string;
    name?: string;
    type?: string;
  };
};

const MONTHS = ["Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];

const toSafeInt = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const buildMonthlyStats = (centreId: number): MonthStat[] => {
  return MONTHS.map((month, index) => {
    const base = 28 + Math.floor(seededRandom(centreId * 17 + index * 11) * 26);
    const vaccinatedRate = 0.64 + seededRandom(centreId * 9 + index * 3) * 0.28;
    const vaccinated = Math.min(base, Math.round(base * vaccinatedRate));
    return { month, enrolled: base, vaccinated };
  });
};

export default function CentreVaccinationStatsPage() {
  const navigate = useNavigate();
  const { centreId } = useParams();
  const location = useLocation();
  const locationState = location.state as CentreState | null;

  const parsedCentreId = toSafeInt(centreId);
  const centreName = locationState?.centre?.name || `Centre #${parsedCentreId || "-"}`;
  const centreType = locationState?.centre?.type || "POSTE_DE_SANTE";

  const monthlyStats = useMemo(() => buildMonthlyStats(parsedCentreId || 1), [parsedCentreId]);

  const totals = useMemo(() => {
    const enrolledChildren = monthlyStats.reduce((sum, item) => sum + item.enrolled, 0);
    const vaccinatedChildren = monthlyStats.reduce((sum, item) => sum + item.vaccinated, 0);
    const unvaccinatedChildren = Math.max(0, enrolledChildren - vaccinatedChildren);

    const boys = Math.round(enrolledChildren * 0.51);
    const girls = enrolledChildren - boys;
    const vaccinatedBoys = Math.min(boys, Math.round(vaccinatedChildren * 0.52));
    const vaccinatedGirls = Math.max(0, vaccinatedChildren - vaccinatedBoys);
    const unvaccinatedBoys = Math.max(0, boys - vaccinatedBoys);
    const unvaccinatedGirls = Math.max(0, girls - vaccinatedGirls);

    const coverageRate = enrolledChildren > 0 ? Math.round((vaccinatedChildren / enrolledChildren) * 100) : 0;

    return {
      enrolledChildren,
      boys,
      girls,
      vaccinatedBoys,
      vaccinatedGirls,
      unvaccinatedBoys,
      unvaccinatedGirls,
      coverageRate,
    };
  }, [monthlyStats]);

  const maxMonthlyEnrolled = useMemo(
    () => monthlyStats.reduce((max, item) => Math.max(max, item.enrolled), 1),
    [monthlyStats]
  );

  return (
    <PageContainer
      title="Statistiques de Vaccination du Centre"
      subtitle="Vue annuelle simulée des indicateurs clés par centre de santé"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-blue-100">Centre sélectionné</p>
              <h2 className="text-xl font-bold">{centreName}</h2>
              <p className="text-xs text-blue-100">
                ID: {parsedCentreId || "-"} • Type: {centreType}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/localites")}
              className="border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux localités
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Enfants inscrits</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{totals.enrolledChildren}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Garçons / Filles</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {totals.boys} / {totals.girls}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <Baby className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Enfants vaccinés</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    G: {totals.vaccinatedBoys} • F: {totals.vaccinatedGirls}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Non vaccinés</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    G: {totals.unvaccinatedBoys} • F: {totals.unvaccinatedGirls}
                  </p>
                  <p className="mt-1 text-xs font-medium text-blue-700">Couverture: {totals.coverageRate}%</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <UserX className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="border-b border-blue-100 bg-blue-50/70">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CalendarRange className="h-5 w-5" />
              Statistiques mensuelles (12 mois)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid gap-3">
              {monthlyStats.map((month) => {
                const barWidth = Math.max(6, Math.round((month.enrolled / maxMonthlyEnrolled) * 100));
                const vaccinatedRate = month.enrolled > 0 ? Math.round((month.vaccinated / month.enrolled) * 100) : 0;
                return (
                  <div key={month.month} className="rounded-lg border border-blue-100 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{month.month}</p>
                      <p className="text-xs text-slate-500">
                        Inscrits: <span className="font-semibold text-slate-700">{month.enrolled}</span> • Vaccinés:{" "}
                        <span className="font-semibold text-blue-700">{month.vaccinated}</span> ({vaccinatedRate}%)
                      </p>
                    </div>
                    <div className="h-2.5 rounded-full bg-blue-100">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="border-b border-blue-100 bg-blue-50/70">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BarChart3 className="h-5 w-5" />
              Indicateurs détaillés du centre
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <p className="mb-2 text-sm font-semibold text-blue-700">Vaccinés par sexe</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>Garçons vaccinés</span>
                    <span className="font-bold text-blue-700">{totals.vaccinatedBoys}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Filles vaccinées</span>
                    <span className="font-bold text-blue-700">{totals.vaccinatedGirls}</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <p className="mb-2 text-sm font-semibold text-blue-700">Non vaccinés par sexe</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>Garçons non vaccinés</span>
                    <span className="font-bold text-amber-700">{totals.unvaccinatedBoys}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Filles non vaccinées</span>
                    <span className="font-bold text-amber-700">{totals.unvaccinatedGirls}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-blue-100 bg-white p-3 text-xs text-slate-500">
              Données simulées pour démonstration. Une liaison API pourra remplacer ces valeurs avec les statistiques réelles du backend.
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/60">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Hospital className="h-5 w-5" />
            </div>
            <p className="text-sm text-blue-900">
              Cette page est optimisée pour un rendu professionnel (bleu/blanc) destiné au suivi institutionnel. Prochaine étape:
              brancher les endpoints backend de statistiques pour des chiffres temps réel.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

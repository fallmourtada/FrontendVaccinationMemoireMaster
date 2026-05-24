import type { MonthlyCentreReport, VaccineLineReport } from '@/types/monthly-vaccine-report';
import { VaccineType, type VaccineTypeEnum } from '@/types/vaccin';

const STORAGE_KEY = 'vaccimed_monthly_vaccine_reports_v1';

const VACCINE_LABELS: Record<VaccineTypeEnum, string> = {
  BCG: 'BCG (tuberculose)',
  DTP: 'DTP',
  COQUELUCHE: 'Coqueluche',
  HEPATITE_B: 'Hépatite B',
  HIB: 'Hib',
  PNEUMOCOQUE: 'Pneumocoque',
  MENINGOCOQUE_C: 'Méningocoque C',
  ROR: 'ROR',
  HEPATITE_A: 'Hépatite A',
  GRIPPE: 'Grippe',
  FIEVRE_JAUNE: 'Fièvre jaune',
  COVID19: 'COVID-19',
  AUTRES: 'Autres',
};

export const vaccineCodesForReport = (): VaccineTypeEnum[] =>
  Object.values(VaccineType).filter((c) => c !== 'AUTRES') as VaccineTypeEnum[];

export const labelForVaccine = (code: VaccineTypeEnum) => VACCINE_LABELS[code] ?? code;

function readAll(): MonthlyCentreReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MonthlyCentreReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: MonthlyCentreReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllMonthlyReports(): MonthlyCentreReport[] {
  return readAll().sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function getReportsForDistrict(districtLocalityId: number): MonthlyCentreReport[] {
  return getAllMonthlyReports().filter((r) => Number(r.districtLocalityId) === Number(districtLocalityId));
}

export function getReportsForCentre(centreId: number): MonthlyCentreReport[] {
  return getAllMonthlyReports().filter((r) => Number(r.centreId) === Number(centreId));
}

/** Une seule soumission par centre + mois + année (remplace l’ancienne). */
export function saveMonthlyReport(report: MonthlyCentreReport): void {
  const list = readAll().filter(
    (r) =>
      !(
        Number(r.centreId) === Number(report.centreId) &&
        r.year === report.year &&
        r.month === report.month
      )
  );
  list.push(report);
  writeAll(list);
}

export function createEmptyLines(): VaccineLineReport[] {
  return vaccineCodesForReport().map((code) => ({
    vaccinCode: code,
    vaccinLabel: labelForVaccine(code),
    dosesUtilisees: 0,
    dosesRestantes: 0,
    fillesVaccinees: 0,
    garconsVaccines: 0,
  }));
}

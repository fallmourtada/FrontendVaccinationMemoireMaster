// import React, { useState, useMemo } from "react";
// import PageContainer from "@/components/shared/page-container";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BarChart3, Clock } from "lucide-react";
// import { ChartContainer } from "@/components/ui/chart";
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

// export default function AdminDashboard() {
// 	// Données simulées pour la démo
// 	const [chartType, setChartType] = useState<'line' | 'bar'>('line');
// 	// Statistiques globales
// 	const stats = useMemo(() => ({
// 		nbAbandon: 12,
// 		nbRetard: 8,
import { useState, useMemo } from "react";
import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
// 		const moisFr = ["Janv", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
export default function AdminDashboard() {
	// Données simulées pour la démo
	const [chartType, setChartType] = useState<'line' | 'bar'>('line');
	// Statistiques globales
	const stats = useMemo(() => ({
		nbAbandon: 12,
		nbRetard: 8,
		enfantsAyantCommence: 50,
		tauxAbandon: 24,
		tauxRetard: 16,
	}), []);
	// Statistiques mensuelles
	const monthlyStats = useMemo(() => {
		const moisFr = ["Janv", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
		const now = new Date();
		return Array.from({ length: 12 }).map((_, i) => {
			const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
			const label = `${moisFr[d.getMonth()]} ${d.getFullYear()}`;
			return {
				mois: label,
				tauxAbandon: Math.round(Math.random() * 30),
				tauxRetard: Math.round(Math.random() * 20),
				nbCommence: Math.round(Math.random() * 10 + 40),
				nbAbandon: Math.round(Math.random() * 10),
				nbRetard: Math.round(Math.random() * 8),
			};
		});
	}, []);

	return (
		<PageContainer title="Tableau de bord" subtitle="Indicateurs clés pour la prise de décision sanitaire.">
			<>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{/* Taux d'abandon */}
					<Card>
						<CardHeader className="flex flex-row items-center gap-3">
							<BarChart3 className="h-7 w-7 text-blue-600" />
							<CardTitle>Taux d'abandon</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<div className="text-3xl font-bold text-blue-700">{stats.tauxAbandon.toFixed(1)}%</div>
								<div className="text-sm text-gray-500 mt-1">
									{stats.nbAbandon} enfant(s) sur {stats.enfantsAyantCommence} ayant commencé un schéma vaccinal n'ont pas terminé.
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Taux de retard */}
					<Card>
						<CardHeader className="flex flex-row items-center gap-3">
							<Clock className="h-7 w-7 text-orange-500" />
							<CardTitle>Taux de retard</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<div className="text-3xl font-bold text-orange-600">{stats.tauxRetard.toFixed(1)}%</div>
								<div className="text-sm text-gray-500 mt-1">
									{stats.nbRetard} enfant(s) ont reçu au moins une dose en retard.
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Courbe mensuelle taux d'abandon/retard */}
				<div className="mt-10">
					<Card>
						<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle>Évolution mensuelle des taux d'abandon et de retard (12 derniers mois)</CardTitle>
							<div className="flex gap-2 items-center">
								<span className="text-xs text-gray-500">Type de graphique :</span>
								<select
									className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
									value={chartType}
									onChange={e => setChartType(e.target.value as 'line' | 'bar')}
								>
									<option value="line">Courbe</option>
									<option value="bar">Barres</option>
								</select>
							</div>
						</CardHeader>
						<CardContent>
							<div className="w-full h-[340px] bg-gradient-to-br from-blue-50 to-white rounded-xl p-4">
								<ChartContainer config={{ abandon: { color: '#2563eb', label: "Taux d'abandon" }, retard: { color: '#f59e42', label: "Taux de retard" } }}>
									<ResponsiveContainer width="100%" height="100%">
										{chartType === 'line' ? (
											<LineChart data={monthlyStats} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
												<CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
												<XAxis dataKey="mois" tick={{ fill: '#1e3a8a', fontWeight: 500 }} />
												<YAxis tick={{ fill: '#64748b' }} domain={[0, 100]} tickFormatter={v => v + '%'} />
												<Tooltip formatter={(value: number) => value + '%'} />
												<Legend />
												<Line type="monotone" dataKey="tauxAbandon" name="Taux d'abandon" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
												<Line type="monotone" dataKey="tauxRetard" name="Taux de retard" stroke="#f59e42" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
											</LineChart>
										) : (
											<BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
												<CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
												<XAxis dataKey="mois" tick={{ fill: '#1e3a8a', fontWeight: 500 }} />
												<YAxis tick={{ fill: '#64748b' }} domain={[0, 100]} tickFormatter={v => v + '%'} />
												<Tooltip formatter={(value: number) => value + '%'} />
												<Legend />
												<Bar dataKey="tauxAbandon" name="Taux d'abandon" fill="#2563eb" radius={[4, 4, 0, 0]} />
												<Bar dataKey="tauxRetard" name="Taux de retard" fill="#f59e42" radius={[4, 4, 0, 0]} />
											</BarChart>
										)}
									</ResponsiveContainer>
								</ChartContainer>
							</div>
						</CardContent>
					</Card>
				</div>
			</>
		</PageContainer>
	);
}

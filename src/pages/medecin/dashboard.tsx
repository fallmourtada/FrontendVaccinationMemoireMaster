import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Syringe,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";

  // Données de démonstration
  const statsData = [
    {
      title: "Patients Total",
      value: "847",
      change: "+6.5%",
      changeType: "positive" as const,
      icon: Users,
      description: "vs mois dernier"
    },
    {
      title: "Vaccinations ce mois",
      value: "234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Syringe,
      description: "vs mois dernier"
    },
    {
      title: "Rendez-vous planifiés",
      value: "156",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Calendar,
      description: "cette semaine"
    },
    {
      title: "Taux de couverture",
      value: "94.2%",
      change: "+1.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "objectif: 95%"
    }
  ];

  const vaccinationData = [
    { month: 'Jan', vaccinations: 65, rappels: 28 },
    { month: 'Fév', vaccinations: 78, rappels: 35 },
    { month: 'Mar', vaccinations: 90, rappels: 42 },
    { month: 'Avr', vaccinations: 95, rappels: 38 },
    { month: 'Mai', vaccinations: 88, rappels: 45 },
    { month: 'Jun', vaccinations: 110, rappels: 52 }
  ];

  const vaccineTypeData = [
    { name: 'Obligatoires', value: 65, color: '#3b82f6' },
    { name: 'Recommandés', value: 25, color: '#1e40af' },
    { name: 'Optionnels', value: 10, color: '#60a5fa' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'vaccination',
      patient: 'Awa Diop',
      action: 'Vaccination ROR administrée',
      time: '10:30',
      avatar: 'AD'
    },
    {
      id: 2,
      type: 'appointment',
      patient: 'Mamadou Ndiaye',
      action: 'Rendez-vous confirmé',
      time: '09:15',
      avatar: 'MN'
    },
    {
      id: 3,
      type: 'reminder',
      patient: 'Fatou Sy',
      action: 'Rappel envoyé - DTP',
      time: '08:45',
      avatar: 'FS'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Cheikh Fall',
      vaccine: 'Hépatite B',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Mame Diarra Sow',
      vaccine: 'Grippe saisonnière',
      time: '14:30',
      status: 'pending'
    },
    {
      id: 3,
      patient: 'Boubacar Ba',
      vaccine: 'Rappel DTP',
      time: '15:15',
      status: 'confirmed'
    }
  ];


export default function Dashboard() {
  return (
    <PageContainer 
      title="Tableau de bord" 
      subtitle="Vue d'ensemble de votre activité de vaccination - Suivi des statistiques et des tendances en temps réel"
    >
      {/* Boutons d'actions principaux */}
      <div className="flex justify-end space-x-2 mb-8">
        <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 text-blue-700 dark:border-blue-800">
          <Activity className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md">
          <Calendar className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl dark:bg-slate-900 transition-all hover:scale-105 hover:-translate-y-1">
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-600 to-blue-400" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-md">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="flex items-center text-xs font-bold gap-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-300'}>
                  {stat.change}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-blue-700 dark:text-blue-300 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="vaccinations" className="text-blue-700 dark:text-blue-300 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">Vaccinations</TabsTrigger>
          <TabsTrigger value="patients" className="text-blue-700 dark:text-blue-300 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">Patients</TabsTrigger>
          <TabsTrigger value="analytics" className="text-blue-700 dark:text-blue-300 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Graphique principal */}
            <Card className="col-span-4 border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <h3 className="text-white font-black text-lg">Activité de vaccination</h3>
                <p className="text-blue-100 text-sm">Vaccinations et rappels des 6 derniers mois</p>
              </div>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={vaccinationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{backgroundColor: '#f0f9ff', border: '1px solid #3b82f6', borderRadius: '8px'}} />
                    <Area type="monotone" dataKey="vaccinations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="rappels" stackId="1" stroke="#1e40af" fill="#1e40af" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card className="col-span-3 border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <h3 className="text-white font-black text-lg">Activités récentes</h3>
                <p className="text-blue-100 text-sm">Dernières actions effectuées</p>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 pb-3 last:pb-0 border-b last:border-0 border-blue-100 dark:border-blue-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 -mx-3 px-3 py-2 rounded transition-colors">
                      <Avatar className="h-9 w-9 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold flex-shrink-0 shadow-md">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {activity.patient}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rendez-vous à venir */}
          <Card className="border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h3 className="text-white font-black text-lg">Rendez-vous à venir</h3>
              <p className="text-blue-100 text-sm">Prochains rendez-vous de vaccination</p>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/30 pb-4 last:border-0 last:pb-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 -mx-3 px-3 py-2 rounded transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{appointment.patient}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.vaccine}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{appointment.time}</span>
                      <Badge className={appointment.status === 'confirmed' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold border-0'}>
                        {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <h3 className="text-white font-black text-lg">Répartition par type</h3>
              </div>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={vaccineTypeData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {vaccineTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <h3 className="text-white font-black text-lg">Tendance mensuelle</h3>
              </div>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vaccinationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{backgroundColor: '#f0f9ff', border: '1px solid #3b82f6', borderRadius: '8px'}} />
                    <Line type="monotone" dataKey="vaccinations" stroke="#3b82f6" strokeWidth={3} dot={{fill: '#3b82f6', r: 5}} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card className="border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h3 className="text-white font-black text-lg">Patients récemment enregistrés</h3>
            </div>
            <CardContent className="pt-6">
              <p className="text-slate-600 dark:text-slate-400 italic">Contenu à développer avec le tableau de données des patients...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-0 shadow-lg dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h3 className="text-white font-black text-lg">Analyses avancées</h3>
            </div>
            <CardContent className="pt-6">
              <p className="text-slate-600 dark:text-slate-400 italic">Contenu à développer avec des analyses approfondies...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
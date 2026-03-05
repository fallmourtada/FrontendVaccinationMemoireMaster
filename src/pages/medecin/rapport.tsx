import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Filter, 
  Eye,
  Share2,
  Plus,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Syringe,
  CheckCircle,
  Send,
  Save,
} from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '@/components/shared/app-notification';

// Types pour les rapports
interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'weekly' | 'annual' | 'custom';
  category: 'vaccination' | 'stock' | 'performance' | 'compliance';
  status: 'draft' | 'completed' | 'sent' | 'archived';
  createdDate: string;
  completedDate?: string;
  author: string;
  recipients?: string[];
  description: string;
  dataPoints: number;
  pages: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  sections: string[];
}

export default function Rapport() {
  const notification = useNotification();
  const [selectedTab, setSelectedTab] = useState('reports');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées pour les rapports
   const reports: Report[] = [
    {
      id: '1',
      title: 'Rapport Mensuel de Vaccination - Septembre 2024',
      type: 'monthly',
      category: 'vaccination',
      status: 'completed',
      createdDate: '2024-09-01',
      completedDate: '2024-09-13',
      author: 'Dr. Aïssatou Diop',
      recipients: ['Direction Régionale de la Santé', 'Ministère de la Santé et de l’Action Sociale'],
      description: 'Analyse complète des vaccinations réalisées en septembre avec statistiques par district sanitaire et par type de vaccin.',
      dataPoints: 15847,
      pages: 24
    },
    {
      id: '2',
      title: 'Rapport de Stock - Alerte Critique',
      type: 'custom',
      category: 'stock',
      status: 'sent',
      createdDate: '2024-09-13',
      completedDate: '2024-09-13',
      author: 'Pharmacien Chef Mamadou Ndiaye',
      recipients: ['Direction du Centre de Santé', 'Équipe Logistique'],
      description: "Rapport d'urgence sur les niveaux de stock critiques (vaccins et consommables) et recommandations d’approvisionnement.",
      dataPoints: 45,
      pages: 8
    },
    {
      id: '3',
      title: 'Performance des Centres - T3 2024',
      type: 'custom',
      category: 'performance',
      status: 'completed',
      createdDate: '2024-09-10',
      completedDate: '2024-09-12',
      author: 'Responsable Qualité Fatoumata Ba',
      recipients: ['Direction', 'Chefs de District Sanitaire'],
      description: 'Évaluation des performances des centres de vaccination avec indicateurs clés (taux de couverture, ruptures de stock, retards).',
      dataPoints: 2340,
      pages: 18
    },
    {
      id: '4',
      title: 'Conformité Réglementaire - Audit T3',
      type: 'custom',
      category: 'compliance',
      status: 'draft',
      createdDate: '2024-09-12',
      author: 'Auditeur Interne Ousmane Sow',
      description: 'Rapport de conformité aux normes sanitaires et réglementaires selon les directives du Ministère de la Santé.',
      dataPoints: 156,
      pages: 12
    },
    {
      id: '5',
      title: 'Rapport Hebdomadaire - Semaine 37',
      type: 'weekly',
      category: 'vaccination',
      status: 'completed',
      createdDate: '2024-09-09',
      completedDate: '2024-09-09',
      author: 'Coordinateur Terrain Ibrahima Faye',
      recipients: ['Équipe Médicale', 'District Médical de Bambey'],
      description: 'Synthèse hebdomadaire des activités de vaccination, incidents et couverture vaccinale par aire de santé.',
      dataPoints: 1234,
      pages: 6
    }
  ];
  
  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Rapport Mensuel Standard',
      description: 'Rapport complet des activités de vaccination du mois dans la région.',
      category: 'vaccination',
      estimatedTime: '2-3 heures',
      sections: ['Statistiques générales', 'Performance par district', 'Analyse des vaccins', 'Tendances', 'Recommandations']
    },
    {
      id: '2',
      name: 'Rapport de Stock',
      description: 'État détaillé des inventaires de vaccins et consommables médicaux.',
      category: 'stock',
      estimatedTime: '1-2 heures',
      sections: ['Niveaux actuels', 'Mouvements', 'Alertes', 'Prévisions', 'Commandes recommandées']
    },
    {
      id: '3',
      name: 'Évaluation de Performance',
      description: 'Analyse de la performance opérationnelle et de la qualité du service vaccinal.',
      category: 'performance',
      estimatedTime: '3-4 heures',
      sections: ['Indicateurs clés', 'Comparaison par centre', 'Efficacité', 'Satisfaction', 'Plans d’amélioration']
    },
    {
      id: '4',
      name: 'Audit de Conformité',
      description: 'Vérification de la conformité aux normes et aux directives nationales de santé.',
      category: 'compliance',
      estimatedTime: '4-6 heures',
      sections: ['Normes appliquées', 'Contrôles effectués', 'Non-conformités', 'Actions correctives', 'Validation']
    }
  ];


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Terminé</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Brouillon</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Envoyé</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vaccination':
        return <Syringe className="h-4 w-4" />;
      case 'stock':
        return <BarChart3 className="h-4 w-4" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleGenerateReport = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    notification.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(`Rapport ${template?.name} généré`), 3000);
      }),
      {
        loading: `Génération du rapport en cours...`,
        success: `Nouveau rapport créé avec succès`,
        error: "Erreur lors de la génération du rapport"
      }
    );
  };

  const handleDownloadReport = () => {
    notification.success({
      title: "Téléchargement démarré",
      description: `Le rapport est en cours de téléchargement`
    });
  };

  const handleSendReport = (reportId: string) => {
    reports.find(r => r.id === reportId);
    notification.success({
      title: "Rapport envoyé",
      description: `Le rapport a été envoyé aux destinataires`
    });
  };

  return (
    <PageContainer 
      title="Rapports et Documents" 
      subtitle="Génération et gestion des rapports d'activité et d'analyse"
    >
      <div className="space-y-6">
        
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rapports</p>
                  <p className="text-3xl font-bold">{reports.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En Cours</p>
                  <p className="text-3xl font-bold">{reports.filter(r => r.status === 'draft').length}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminés</p>
                  <p className="text-3xl font-bold">{reports.filter(r => r.status === 'completed').length}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Envoyés</p>
                  <p className="text-3xl font-bold">{reports.filter(r => r.status === 'sent').length}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Send className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Mes Rapports</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="create">Créer un Rapport</TabsTrigger>
          </TabsList>

          {/* Liste des rapports */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Mes Rapports</span>
                    </CardTitle>
                    <CardDescription>Gestion et consultation de tous vos rapports</CardDescription>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-3">
                    <Input
                      placeholder="Rechercher un rapport..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="lg:w-64"
                    />
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="lg:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="sent">Envoyé</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="lg:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="stock">Stock</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="compliance">Conformité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-lg">
                              {getCategoryIcon(report.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{report.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Par {report.author}</span>
                                <span>•</span>
                                <span>{new Date(report.createdDate).toLocaleDateString('fr-FR')}</span>
                                <span>•</span>
                                <span>{report.pages} pages</span>
                                <span>•</span>
                                <span>{report.dataPoints.toLocaleString()} données</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground">{report.description}</p>
                          
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(report.status)}
                            {report.recipients && (
                              <Badge variant="outline">
                                <Users className="h-3 w-3 mr-1" />
                                {report.recipients.length} destinataires
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Aperçu
                          </Button>
                          {report.status === 'completed' && (
                            <Button variant="outline" size="sm" onClick={() => handleSendReport(report.id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Envoyer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modèles de rapports */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getCategoryIcon(template.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Temps estimé:</span>
                      <Badge variant="outline">{template.estimatedTime}</Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Sections incluses:</Label>
                      <div className="mt-2 space-y-1">
                        {template.sections.map((section, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{section}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleGenerateReport(template.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Générer ce rapport
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Création personnalisée */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Créer un Rapport Personnalisé</span>
                </CardTitle>
                <CardDescription>
                  Configurez un nouveau rapport selon vos besoins spécifiques
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre du rapport</Label>
                      <Input id="title" placeholder="Ex: Rapport mensuel de septembre 2024" />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="stock">Gestion des stocks</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="compliance">Conformité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="period">Période</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Cette semaine</SelectItem>
                          <SelectItem value="month">Ce mois</SelectItem>
                          <SelectItem value="quarter">Ce trimestre</SelectItem>
                          <SelectItem value="year">Cette année</SelectItem>
                          <SelectItem value="custom">Période personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Décrivez l'objectif et le contenu de ce rapport..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Destinataires</Label>
                      <div className="space-y-2 mt-2">
                        {['Direction Générale', 'Ministère de la Santé', 'Équipe Médicale', 'Responsables de Centre'].map((recipient) => (
                          <div key={recipient} className="flex items-center space-x-2">
                            <Checkbox id={recipient} />
                            <Label htmlFor={recipient} className="text-sm">{recipient}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Sections à inclure</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {[
                      'Résumé exécutif',
                      'Statistiques générales',
                      'Analyse des tendances',
                      'Performance par centre',
                      'Répartition par vaccin',
                      'Indicateurs de qualité',
                      'Recommandations',
                      'Annexes détaillées'
                    ].map((section) => (
                      <div key={section} className="flex items-center space-x-2">
                        <Checkbox id={section} />
                        <Label htmlFor={section} className="text-sm">{section}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder comme modèle
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
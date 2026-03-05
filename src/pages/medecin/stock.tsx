import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Search,
  Filter,
  Plus,
  Download,
  Thermometer,
  Clock,
  MapPin,
  ShoppingCart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotification } from '@/components/shared/app-notification';

// Types pour la gestion des stocks
interface VaccinStock {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  reserved: number;
  available: number;
  minThreshold: number;
  expiryDate: string;
  temperature: string;
  location: string;
  status: 'stock' | 'low' | 'critical' | 'expired';
  lastUpdate: string;
}

interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'transfer' | 'expired' | 'damaged';
  vaccineName: string;
  quantity: number;
  batchNumber: string;
  date: string;
  user: string;
  notes?: string;
}

export default function Stock() {
  const notification = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Données simulées pour les stocks
  const vaccinStocks: VaccinStock[] = [
    {
      id: '1',
      name: 'Pfizer COVID-19',
      manufacturer: 'Pfizer-BioNTech',
      batchNumber: 'PF001234',
      quantity: 1250,
      reserved: 150,
      available: 1100,
      minThreshold: 200,
      expiryDate: '2024-12-15',
      temperature: '-70°C',
      location: 'Congélateur A1',
      status: 'stock',
      lastUpdate: '2024-09-13 14:30'
    },
    {
      id: '2',
      name: 'Moderna COVID-19',
      manufacturer: 'Moderna',
      batchNumber: 'MD005678',
      quantity: 89,
      reserved: 45,
      available: 44,
      minThreshold: 100,
      expiryDate: '2024-11-20',
      temperature: '-20°C',
      location: 'Congélateur B2',
      status: 'low',
      lastUpdate: '2024-09-13 12:15'
    },
    {
      id: '3',
      name: 'Grippe Saisonnière',
      manufacturer: 'Sanofi',
      batchNumber: 'SF009876',
      quantity: 45,
      reserved: 30,
      available: 15,
      minThreshold: 50,
      expiryDate: '2024-10-30',
      temperature: '2-8°C',
      location: 'Réfrigérateur C1',
      status: 'critical',
      lastUpdate: '2024-09-13 16:45'
    },
    {
      id: '4',
      name: 'Hépatite B',
      manufacturer: 'GSK',
      batchNumber: 'HB234567',
      quantity: 0,
      reserved: 0,
      available: 0,
      minThreshold: 25,
      expiryDate: '2024-09-10',
      temperature: '2-8°C',
      location: 'Réfrigérateur D1',
      status: 'expired',
      lastUpdate: '2024-09-10 08:00'
    },
    {
      id: '5',
      name: 'ROR (Rougeole-Oreillons-Rubéole)',
      manufacturer: 'Merck',
      batchNumber: 'ROR789012',
      quantity: 567,
      reserved: 67,
      available: 500,
      minThreshold: 75,
      expiryDate: '2025-03-15',
      temperature: '2-8°C',
      location: 'Réfrigérateur A2',
      status: 'stock',
      lastUpdate: '2024-09-13 11:20'
    }
  ];

  const stockMovements: StockMovement[] = [
    {
      id: '1',
      type: 'in',
      vaccineName: 'Pfizer COVID-19',
      quantity: 500,
      batchNumber: 'PF001234',
      date: '2024-09-12',
      user: 'Dr. Martin',
      notes: 'Livraison programmée'
    },
    {
      id: '2',
      type: 'out',
      vaccineName: 'Moderna COVID-19',
      quantity: 25,
      batchNumber: 'MD005678',
      date: '2024-09-13',
      user: 'Inf. Sophie',
      notes: 'Vaccination campagne'
    },
    {
      id: '3',
      type: 'expired',
      vaccineName: 'Hépatite B',
      quantity: 12,
      batchNumber: 'HB234567',
      date: '2024-09-10',
      user: 'Système',
      notes: 'Expiration automatique'
    },
    {
      id: '4',
      type: 'transfer',
      vaccineName: 'ROR',
      quantity: 50,
      batchNumber: 'ROR789012',
      date: '2024-09-11',
      user: 'Dr. Claire',
      notes: 'Transfert vers Centre Sud'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stock':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">En stock</Badge>;
      case 'low':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Stock bas</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critique</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'out':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'transfer':
        return <MapPin className="h-4 w-4 text-purple-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'damaged':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'in': return 'Entrée';
      case 'out': return 'Sortie';
      case 'transfer': return 'Transfert';
      case 'expired': return 'Expiré';
      case 'damaged': return 'Endommagé';
      default: return type;
    }
  };

  const filteredStocks = vaccinStocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || stock.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || stock.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Remettre à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, locationFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const stockStats = {
    totalVaccins: vaccinStocks.reduce((sum, stock) => sum + stock.quantity, 0),
    totalTypes: vaccinStocks.length,
    lowStock: vaccinStocks.filter(stock => stock.status === 'low' || stock.status === 'critical').length,
    expired: vaccinStocks.filter(stock => stock.status === 'expired').length
  };

  const handleNewDelivery = () => {
    notification.success({
      title: "Nouvelle livraison",
      description: "Le formulaire de réception de stock a été ouvert"
    });
  };

  const handleStockAlert = () => {
    notification.warning({
      title: "Alerte de stock",
      description: "3 vaccins ont un niveau de stock critique"
    });
  };

  const handleExportInventory = () => {
    notification.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve("Inventaire exporté"), 2000);
      }),
      {
        loading: "Export de l'inventaire en cours...",
        success: "Inventaire exporté avec succès",
        error: "Erreur lors de l'export"
      }
    );
  };

  return (
    <PageContainer 
      title="Gestion des Stocks" 
      subtitle="Suivi et gestion des inventaires de vaccins"
    >
      <div className="space-y-6">
        
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vaccins</p>
                  <p className="text-3xl font-bold">{stockStats.totalVaccins.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Types de Vaccins</p>
                  <p className="text-3xl font-bold">{stockStats.totalTypes}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Bas</p>
                  <p className="text-3xl font-bold text-orange-600">{stockStats.lowStock}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expirés</p>
                  <p className="text-3xl font-bold text-red-600">{stockStats.expired}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <Clock className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher vaccin ou lot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-80"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="stock">En stock</SelectItem>
                    <SelectItem value="low">Stock bas</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les emplacements</SelectItem>
                    <SelectItem value="Congélateur">Congélateurs</SelectItem>
                    <SelectItem value="Réfrigérateur">Réfrigérateurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleStockAlert}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alertes
                </Button>
                <Button variant="outline" onClick={handleExportInventory}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button onClick={handleNewDelivery}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle livraison
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="movements">Mouvements</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
          </TabsList>

          {/* Inventaire */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Inventaire des Vaccins</span>
                </CardTitle>
                <CardDescription>
                  Gestion complète des stocks de vaccins avec suivi des lots et dates d'expiration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccin</TableHead>
                      <TableHead>Fabricant</TableHead>
                      <TableHead>N° de Lot</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Disponible</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Température</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{stock.name}</TableCell>
                        <TableCell>{stock.manufacturer}</TableCell>
                        <TableCell className="font-mono text-sm">{stock.batchNumber}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">{stock.quantity}</div>
                            {stock.reserved > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Réservé: {stock.reserved}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">{stock.available}</div>
                          {stock.available <= stock.minThreshold && (
                            <div className="text-xs text-red-500">Seuil: {stock.minThreshold}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{new Date(stock.expiryDate).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.ceil((new Date(stock.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{stock.temperature}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{stock.location}</TableCell>
                        <TableCell>{getStatusBadge(stock.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#" 
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          {/* Mouvements */}
          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Historique des Mouvements</span>
                </CardTitle>
                <CardDescription>
                  Suivi de tous les mouvements de stock (entrées, sorties, transferts)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getMovementIcon(movement.type)}
                        </div>
                        <div>
                          <div className="font-medium">{movement.vaccineName}</div>
                          <div className="text-sm text-muted-foreground">
                            Lot: {movement.batchNumber} • {movement.user}
                          </div>
                          {movement.notes && (
                            <div className="text-xs text-muted-foreground mt-1">{movement.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{getMovementLabel(movement.type)}</Badge>
                          <span className="font-semibold">
                            {movement.type === 'out' || movement.type === 'expired' || movement.type === 'damaged' ? '-' : '+'}
                            {movement.quantity}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(movement.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alertes */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Alertes Critiques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vaccinStocks
                      .filter(stock => stock.status === 'critical' || stock.status === 'expired')
                      .map((stock) => (
                        <div key={stock.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <div>
                              <div className="font-medium text-red-900 dark:text-red-100">{stock.name}</div>
                              <div className="text-sm text-red-700 dark:text-red-300">
                                {stock.status === 'expired' ? 'Vaccin expiré' : `Stock critique: ${stock.available} restants`}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Gérer
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <Clock className="h-5 w-5" />
                    <span>Expirations Prochaines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vaccinStocks
                      .filter(stock => {
                        const daysUntilExpiry = Math.ceil((new Date(stock.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                      })
                      .map((stock) => {
                        const daysUntilExpiry = Math.ceil((new Date(stock.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={stock.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-orange-500" />
                              <div>
                                <div className="font-medium text-orange-900 dark:text-orange-100">{stock.name}</div>
                                <div className="text-sm text-orange-700 dark:text-orange-300">
                                  Expire dans {daysUntilExpiry} jours • {stock.quantity} unités
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Planifier
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
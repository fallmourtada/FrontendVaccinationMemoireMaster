import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Camera,
  Globe,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '@/components/shared/app-notification';

// Types pour les paramètres
interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  specialite: string;
  numeroOrdre: string;
  avatar?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export default function Parametre() {
  const notification = useNotification();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Données utilisateur simulées
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    nom: 'Mbaye',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.mbaye@vaccimed.sn',
    telephone: '01 23 45 67 89',
    adresse: '123 Rue de la Santé, Dakar, Sénégal',
    specialite: 'Médecin généraliste',
    numeroOrdre: '123456789'
  });

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSave = () => {
    notification.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve("Profil mis à jour"), 1000);
      }),
      {
        loading: "Sauvegarde du profil en cours...",
        success: "Profil mis à jour avec succès",
        error: "Erreur lors de la mise à jour du profil"
      }
    );
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      notification.error({
        title: "Erreur de confirmation",
        description: "Les nouveaux mots de passe ne correspondent pas"
      });
      return;
    }

    if (passwords.new.length < 8) {
      notification.warning({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères"
      });
      return;
    }

    notification.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve("Mot de passe changé"), 1000);
      }),
      {
        loading: "Changement du mot de passe...",
        success: "Mot de passe modifié avec succès",
        error: "Erreur lors du changement de mot de passe"
      }
    );

    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleNotificationSave = () => {
    notification.success({
      title: "Préférences sauvegardées",
      description: "Vos préférences de notification ont été mises à jour"
    });
  };

  const handleSecuritySave = () => {
    notification.success({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos paramètres de sécurité ont été sauvegardés"
    });
  };

  return (
    <PageContainer 
      title="Paramètres" 
      subtitle="Gérez votre profil et vos préférences"
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Préférences</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles et professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="text-lg">
                    {userProfile.prenom[0]}{userProfile.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span>Changer la photo</span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Taille max: 5MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={userProfile.prenom}
                    onChange={(e) => setUserProfile({...userProfile, prenom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={userProfile.nom}
                    onChange={(e) => setUserProfile({...userProfile, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telephone"
                      value={userProfile.telephone}
                      onChange={(e) => setUserProfile({...userProfile, telephone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialite">Spécialité</Label>
                  <Select value={userProfile.specialite} onValueChange={(value) => setUserProfile({...userProfile, specialite: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Médecin généraliste">Médecin généraliste</SelectItem>
                      <SelectItem value="Pédiatre">Pédiatre</SelectItem>
                      <SelectItem value="Infectiologue">Infectiologue</SelectItem>
                      <SelectItem value="Infirmier">Infirmier</SelectItem>
                      <SelectItem value="Pharmacien">Pharmacien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroOrdre">Numéro d'ordre</Label>
                  <Input
                    id="numeroOrdre"
                    value={userProfile.numeroOrdre}
                    onChange={(e) => setUserProfile({...userProfile, numeroOrdre: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="adresse"
                    value={userProfile.adresse}
                    onChange={(e) => setUserProfile({...userProfile, adresse: e.target.value})}
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Changement de mot de passe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Changement de mot de passe</span>
                </CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="pl-10 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="pl-10 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="pl-10 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={handlePasswordChange} className="w-full">
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Paramètres de sécurité</span>
                </CardTitle>
                <CardDescription>
                  Configurez les options de sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts">Alertes de connexion</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez une alerte lors de nouvelles connexions
                    </p>
                  </div>
                  <Switch
                    id="loginAlerts"
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSecuritySave} className="w-full">
                  Sauvegarder les paramètres
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Préférences de notification</span>
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifs">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez les notifications importantes par email
                  </p>
                </div>
                <Switch
                  id="emailNotifs"
                  checked={notifSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotifSettings({...notifSettings, emailNotifications: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifs">Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez les alertes urgentes par SMS
                  </p>
                </div>
                <Switch
                  id="smsNotifs"
                  checked={notifSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotifSettings({...notifSettings, smsNotifications: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifs">Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications dans l'application web
                  </p>
                </div>
                <Switch
                  id="pushNotifs"
                  checked={notifSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotifSettings({...notifSettings, pushNotifications: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Résumé d'activité envoyé chaque semaine
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notifSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotifSettings({...notifSettings, weeklyReports: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemAlerts">Alertes système</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications sur l'état du système
                  </p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={notifSettings.systemAlerts}
                  onCheckedChange={(checked) => setNotifSettings({...notifSettings, systemAlerts: checked})}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationSave} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Préférences d'affichage</span>
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Clair</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Sombre</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>Système</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select defaultValue="europe/paris">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe/paris">Europe/Paris (GMT+1)</SelectItem>
                      <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="america/new_york">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Format des données</CardTitle>
                <CardDescription>
                  Configurez l'affichage des dates et nombres
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Format de date</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format des nombres</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">1 234,56 (Français)</SelectItem>
                      <SelectItem value="en">1,234.56 (Anglais)</SelectItem>
                      <SelectItem value="de">1.234,56 (Allemand)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
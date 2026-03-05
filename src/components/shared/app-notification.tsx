import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Loader2
} from "lucide-react";

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotificationConfig {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Configuration des styles et icônes par type de notification
const notificationStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100",
    iconColor: "text-green-600 dark:text-green-400",
    descriptionColor: "text-green-900 dark:text-green-300 font-medium"
  },
  error: {
    icon: XCircle,
    className: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-100",
    iconColor: "text-red-600 dark:text-red-400",
    descriptionColor: "text-red-900 dark:text-red-300 font-medium"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-100",
    iconColor: "text-orange-600 dark:text-orange-400",
    descriptionColor: "text-orange-900 dark:text-orange-300 font-medium"
  },
  info: {
    icon: Info,
    className: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
    iconColor: "text-blue-600 dark:text-blue-400",
    descriptionColor: "text-blue-900 dark:text-blue-300 font-medium"
  },
  loading: {
    icon: Loader2,
    className: "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100",
    iconColor: "text-gray-600 dark:text-gray-400",
    descriptionColor: "text-gray-900 dark:text-gray-300 font-medium"
  }
};

// Service de notifications
export class NotificationService {
  
  // Notification de succès
  static success(config: NotificationConfig) {
    const { icon: Icon, iconColor, className } = notificationStyles.success;
    
    toast.success(config.title, {
      description: config.description,
      duration: config.duration || 4000,
      icon: <Icon className={`h-5 w-5 ${iconColor}`} />,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick
      } : undefined,
      className: `${className} shadow-lg backdrop-blur-sm`,
      style: {
        borderLeft: "4px solid rgb(34 197 94)",
      },
    //   descriptionClassName: "text-green-900 dark:text-green-300 font-medium"
    });
  }

  // Notification d'erreur
  static error(config: NotificationConfig) {
    const { icon: Icon, iconColor, className } = notificationStyles.error;
    
    toast.error(config.title, {
      description: config.description,
      duration: config.duration || 6000,
      icon: <Icon className={`h-5 w-5 ${iconColor}`} />,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick
      } : undefined,
      className: `${className} shadow-lg backdrop-blur-sm`,
      style: {
        borderLeft: "4px solid rgb(239 68 68)",
      },
    //   descriptionClassName: "text-red-900 dark:text-red-300 font-medium"
    });
  }

  // Notification d'avertissement
  static warning(config: NotificationConfig) {
    const { icon: Icon, iconColor, className } = notificationStyles.warning;
    
    toast.warning(config.title, {
      description: config.description,
      duration: config.duration || 5000,
      icon: <Icon className={`h-5 w-5 ${iconColor}`} />,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick
      } : undefined,
      className: `${className} shadow-lg backdrop-blur-sm`,
      style: {
        borderLeft: "4px solid rgb(251 146 60)",
      },
    //   descriptionClassName: "text-orange-900 dark:text-orange-300 font-medium"
    });
  }

  // Notification d'information
  static info(config: NotificationConfig) {
    const { icon: Icon, iconColor, className } = notificationStyles.info;
    
    toast.info(config.title, {
      description: config.description,
      duration: config.duration || 4000,
      icon: <Icon className={`h-5 w-5 ${iconColor}`} />,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick
      } : undefined,
      className: `${className} shadow-lg backdrop-blur-sm`,
      style: {
        borderLeft: "4px solid rgb(59 130 246)",
      },
    //   descriptionClassName: "text-blue-900 dark:text-blue-300 font-medium"
    });
  }

  // Notification de chargement
  static loading(config: NotificationConfig) {
    const { icon: Icon, iconColor, className } = notificationStyles.loading;
    
    return toast.loading(config.title, {
      description: config.description,
      icon: <Icon className={`h-5 w-5 ${iconColor} animate-spin`} />,
      className: `${className} shadow-lg backdrop-blur-sm`,
      style: {
        borderLeft: "4px solid rgb(107 114 128)",
      },
    //   descriptionClassName: "text-gray-900 dark:text-gray-300 font-medium"
    });
  }

  // Notification personnalisée
  static custom(config: NotificationConfig & { 
    type: NotificationType;
    icon?: React.ReactNode;
  }) {
    const style = notificationStyles[config.type];
    const Icon = style.icon;
    
    toast(config.title, {
      description: config.description,
      duration: config.duration || 4000,
      icon: config.icon || <Icon className={`h-5 w-5 ${style.iconColor}`} />,
      action: config.action ? {
        label: config.action.label,
        onClick: config.action.onClick
      } : undefined,
      className: `${style.className} shadow-lg backdrop-blur-sm`,
      descriptionClassName: style.descriptionColor
    });
  }

  // Notification de mise à jour de statut
  static statusUpdate(message: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      this.success({
        title: "Statut mis à jour",
        description: message,
        duration: 3000
      });
    } else {
      this.error({
        title: "Erreur de mise à jour",
        description: message,
        duration: 4000
      });
    }
  }

  // Notification de sauvegarde
  static saved(entity: string = "Données") {
    this.success({
      title: `${entity} sauvegardé(es)`,
      description: "Les modifications ont été enregistrées avec succès",
      duration: 3000
    });
  }

  // Notification de suppression
  static deleted(entity: string = "Élément") {
    this.success({
      title: `${entity} supprimé`,
      description: "La suppression a été effectuée avec succès",
      duration: 3000
    });
  }

  // Notification de validation
  static validation(message: string) {
    this.warning({
      title: "Validation requise",
      description: message,
      duration: 5000
    });
  }

  // Notification de permission
  static permission(message: string = "Vous n'avez pas les permissions nécessaires") {
    this.error({
      title: "Accès refusé",
      description: message,
      duration: 4000
    });
  }

  // Notification de connexion
  static connection(status: 'connected' | 'disconnected' | 'reconnecting') {
    switch (status) {
      case 'connected':
        this.success({
          title: "Connexion établie",
          description: "Vous êtes maintenant connecté",
          duration: 2000
        });
        break;
      case 'disconnected':
        this.error({
          title: "Connexion perdue",
          description: "Vérifiez votre connexion internet",
          duration: 0 // Pas de timeout automatique
        });
        break;
      case 'reconnecting':
        this.loading({
          title: "Reconnexion en cours...",
          description: "Tentative de reconnexion au serveur"
        });
        break;
    }
  }

  // Mettre à jour une notification de chargement
  static updateLoading(id: string | number, config: NotificationConfig & { type: NotificationType }) {
    toast.dismiss(id);
    
    switch (config.type) {
      case 'success':
        this.success(config);
        break;
      case 'error':
        this.error(config);
        break;
      case 'warning':
        this.warning(config);
        break;
      case 'info':
        this.info(config);
        break;
    }
  }

  // Fermer toutes les notifications
  static dismissAll() {
    toast.dismiss();
  }

  // Notification promise (pour les opérations async)
  static promise<T>(
    promise: Promise<T>,
    config: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) {
    return toast.promise(promise, {
      loading: config.loading,
      success: config.success,
      error: config.error,
      className: "border dark:border-gray-700 bg-background dark:bg-gray-900/90 text-foreground shadow-lg backdrop-blur-sm",
      style: {
        borderRadius: "8px",
        padding: "16px",
      }
    });
  }
}

// Hook pour utiliser les notifications
export const useNotification = () => {
  return {
    success: NotificationService.success,
    error: NotificationService.error,
    warning: NotificationService.warning,
    info: NotificationService.info,
    loading: NotificationService.loading,
    custom: NotificationService.custom,
    statusUpdate: NotificationService.statusUpdate,
    saved: NotificationService.saved,
    deleted: NotificationService.deleted,
    validation: NotificationService.validation,
    permission: NotificationService.permission,
    connection: NotificationService.connection,
    updateLoading: NotificationService.updateLoading,
    dismissAll: NotificationService.dismissAll,
    promise: NotificationService.promise
  };
};

// Export par défaut
export default NotificationService;

// Exemples d'utilisation rapide pour les cas courants
export const showSuccess = (message: string, description?: string) => 
  NotificationService.success({ title: message, description });

export const showError = (message: string, description?: string) => 
  NotificationService.error({ title: message, description });

export const showWarning = (message: string, description?: string) => 
  NotificationService.warning({ title: message, description });

export const showInfo = (message: string, description?: string) => 
  NotificationService.info({ title: message, description });

# 📍 Guide - Gestion des Localités avec données réelles du Backend

## ✅ Étape 1: Service API créé
Fichier: `src/services/locality.service.ts`

Le service consume les endpoints du backend pour:
- **Régions**: `GET /api/v1/localities/types/regions`
- **Départements**: `GET /api/v1/localities/types/regions/{regionId}/departments`
- **Districts**: `GET /api/v1/localities/types/departments/{departmentId}/districts`
- **Centres`: `GET /api/v1/localities/centres/by-district/{districtId}`

## ✅ Étape 2: Page interactive créée
Fichier: `src/pages/admin/localite.tsx`

### Fonctionnalités:
✅ Navigation hiérarchique complète avec breadcrumbs
✅ Recherche en temps réel
✅ Design professionnel bleu/blanc cohérent
✅ Ajout de nouvelles localités (régions, départements, districts)
✅ Chargement automatique des données du backend

### Structure hiérarchique:
```
Sénégal
└── Région (Dakar, Thiès, Saint-Louis, etc.)
    └── Département (Dakar, Pikine, Guédiawaye, etc.)
        └── District Sanitaire (District Sanitaire de Dakar Centre, etc.)
            └── Centre de Santé
```

## 🌐 Accès
**URL Admin**: `/admin/localites`

## 📋 Utilisation

### Navigation:
1. **Démarrage**: Voir toutes les régions du Sénégal
2. **Cliquer sur une région**: Affiche tous les départements de cette région
3. **Cliquer sur un département**: Affiche tous les districts de ce département
4. **Cliquer sur un district**: Affiche tous les centres de santé de ce district

### Recherche:
- Recherche instantanée par nom au niveau actuel
- Fonctionne sur tous les niveaux

### Ajouter un nouvel élément:
1. Cliquer sur "+ Ajouter"
2. Entrer le nom et optionnellement le code
3. Cliquer "Ajouter"

## 🎨 Design bleu/blanc

- **Headers**: Gradient bleu (from-blue-600 to-blue-500)
- **Breadcrumbs**: Bleu avec hover effects
- **Cartes**: Ombre douce, border-0, hover scale
- **Badges**: Bleu clair avec texte bleu foncé
- **Formulaires**: Bordures bleu 2px, focus bleu

## 🔄 Prochaines étapes

### PHASE 2: Amélioration
- [ ] Détails complets pour chaque localité
- [ ] Édition/Modification des localités
- [ ] Suppression avec confirmation
- [ ] Afficher le nombre de centres par district
- [ ] Statistiques par niveau

### PHASE 3: Centres de santé avancé
- [ ] Création de centres directement depuis l'interface
- [ ] Affichage des postes de santé par centre
- [ ] Détails complets du centre (phone, adresse, etc.)

### PHASE 4: Filtrage par médecin
- [ ] Quand un médecin se connecte: voir uniquement son centre/district
- [ ] Restriction d'accès par rôle

## 🚀 État actuel

✅ Service complet
✅ Page interactive complète
✅ Navigation hiérarchique fonctionnelle
✅ Recherche en temps réel
✅ Ajout de localités
✅ Design bleu/blanc professionnel
✅ Dark mode supporté
✅ Responsive (mobile, tablet, desktop)

## ⚠️ Points à vérifier

1. Backend doit être en cours d'exécution sur `http://localhost:9090`
2. Token JWT doit être valide
3. Vérifier que les données existent en base de données

## 💡 Conseils

- Les données simulées sont encore dans `localite.tsx` (ancien système) - on peut les garder si nécessaire
- Le service peut être réutilisé dans d'autres pages
- Les mutations (create) utilisent react-query - facile à étendre pour update/delete

---

**Créé pour**: Vaccination Web Management System
**Date**: 2024
**Status**: ✅ Production-ready

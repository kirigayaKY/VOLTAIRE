# 🎓 VOLTAIRE - Système de Gestion Scolaire

## 📋 Vue d'ensemble

**VOLTAIRE** est un système de gestion scolaire complet développé pour l'IVESTP Marcory. Il comprend :

- 🎯 **Dashboard Étudiant** : Consultation des notes, emploi du temps, annonces
- 👨‍💼 **Dashboard Administrateur** : Gestion complète du système
  - 📊 **Gestion des Notes** : Ajout/modification de notes individuelles par élève
  - ⏰ **Emploi du Temps** : Gestion par classe (6ème à Terminale) avec variantes (4ème A, 4ème B, etc.)
  - 📢 **Annonces** : Publication visible pour tous (élèves, parents, professeurs)

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 16+ et npm
- Git

### 1️⃣ Cloner et installer les dépendances

```bash
cd /workspaces/VOLTAIRE
npm install
```

### 2️⃣ Lancer l'application (Frontend + Backend)

```bash
npm run dev
```

Cela lance :
- **Frontend (Vite)** : `http://localhost:3000`
- **Backend API** : `http://localhost:5000`

### 3️⃣ Se connecter comme Admin

**Identifiants de test :**
- **Matricule** : `admin`
- **Mot de passe** : `08546517`

Cliquez sur **"Se connecter comme Admin"** sur la page d'accueil.

## 🏗️ Architecture

```
/workspaces/VOLTAIRE/
├── app.tsx                 # Composant principal React
├── index.tsx              # Point d'entrée
├── index.html             # HTML template
├── types.ts               # Types TypeScript
├── data.ts                # Données initiales
│
├── components/            # Composants React
│   ├── AdminDashboard.tsx     # Dashboard admin principal
│   ├── AdminGrades.tsx        # Gestion des notes
│   ├── AdminSchedule.tsx      # Gestion emploi du temps
│   └── AdminAnnouncements.tsx # Gestion annonces
│
├── backend/               # Backend Node/Express
│   ├── server.ts          # API REST principale
│   └── api-client.ts      # Client API TypeScript
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔐 API Backend

L'API s'exécute sur `http://localhost:5000` avec les endpoints suivants :

### 📊 Notes (Grades)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/grades` | GET | Toutes les notes |
| `/api/admin/grades/:studentId` | GET | Notes d'un élève |
| `/api/admin/grades/update` | POST | Ajouter/modifier une note |
| `/api/admin/grades/:studentId/:subject` | DELETE | Supprimer une note |

**Exemple : Ajouter une note**
```bash
curl -X POST http://localhost:5000/api/admin/grades/update \
  -H "Content-Type: application/json" \
  -H "x-admin-id: 99" \
  -d '{
    "studentId": 1,
    "subject": "Mathématiques",
    "date": "07 Déc",
    "note": 18,
    "max": 20,
    "coef": 4
  }'
```

### ⏰ Emploi du Temps (Schedule)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/schedule` | GET | Tous les emplois du temps |
| `/api/admin/schedule/:classId` | GET | Emploi du temps d'une classe |
| `/api/admin/schedule/update` | POST | Mettre à jour emploi du temps |

**Classes disponibles :** 6ème A/B/C, 5ème A/B, 4ème A/B, 3ème A/B, 2nde, 1ère C/D, Terminale D/E

### 📢 Annonces (Announcements)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/announcements` | GET | Toutes les annonces |
| `/api/admin/announcements/create` | POST | Créer une annonce (visible par tous) |
| `/api/admin/announcements/:id` | PUT | Modifier une annonce |
| `/api/admin/announcements/:id` | DELETE | Supprimer une annonce |

**Types d'annonces :** `info`, `event`, `exam`, `important`, `urgent`

**Exemple : Créer une annonce**
```bash
curl -X POST http://localhost:5000/api/admin/announcements/create \
  -H "Content-Type: application/json" \
  -H "x-admin-id: 99" \
  -d '{
    "title": "Examen Blanc - Mathématiques",
    "content": "L\'examen blanc aura lieu le 20 Décembre en salle 101",
    "type": "exam"
  }'
```

## 📚 Gestion des Classes

Le système supporte **13 classes** du 6ème à la Terminale :

- **6ème** : A, B, C (3 classes)
- **5ème** : A, B (2 classes)
- **4ème** : A, B (2 classes) ← Emplois du temps différents
- **3ème** : A, B (2 classes)
- **2nde** : Une seule classe
- **1ère** : C, D (2 classes)
- **Terminale** : D, E (2 classes)

Chaque classe peut avoir :
- ✅ Un emploi du temps unique
- ✅ Plusieurs élèves avec notes individuelles
- ✅ Différents professeurs et salles

## 👥 Élèves de Test

| Matricule | Nom | Classe | Mot de passe |
|-----------|-----|--------|--------------|
| 23-VM-0012 | Jean-Marc KOUAMÉ | Terminale D | voltaire2024 |
| 23-VM-0088 | Aïcha KONÉ | 1ère C | ivestp2024 |
| 23-VM-0045 | Stéphane DIALLO | 6ème B | marcory2024 |
| 23-VM-0067 | Marie TRAORÉ | 4ème A | college2024 |

## 🎨 Fonctionnalités Admin

### 1. Gestion des Notes ✅
- Ajouter une note pour un élève dans une matière
- Modifier une note existante
- Supprimer une note
- Les moyennes se mettent à jour automatiquement
- Support des coefficients et notes sur 20

### 2. Gestion de l'Emploi du Temps ✅
- Créer/modifier l'emploi du temps par classe
- Ajouter des cours (jour, heure, matière, professeur, salle)
- Supprimer un cours
- Classes 4ème A et 4ème B peuvent avoir des horaires différents
- Support de tous les niveaux (6ème à Terminale)

### 3. Gestion des Annonces ✅
- Publier des annonces visibles par **TOUS**
- Catégoriser (Info, Événement, Examen, Important, Urgent)
- Modifier/supprimer les annonces
- Automatiquement datées et signées par l'admin

## 🛠️ Scripts NPM

```bash
# Développement (Frontend + Backend)
npm run dev

# Frontend seulement
npm run dev:frontend

# Backend seulement
npm run dev:backend

# Build production
npm run build

# Preview build
npm run preview
```

## 🔒 Authentification

- Utilise un système d'en-tête `x-admin-id` pour l'authentification backend
- Les admins doivent être logués pour accéder au dashboard
- Les données sont stockées en mémoire (en développement)

## 📦 Dépendances Principales

- **React 18** : Interface utilisateur
- **TypeScript** : Typage statique
- **Vite** : Build tool rapide
- **Express** : Backend API
- **Axios** : Client HTTP
- **Framer Motion** : Animations
- **Lucide Icons** : Icônes
- **Tailwind CSS** : Styling

## 🚀 Production

Pour déployer en production :

1. Remplacer le stockage en mémoire par une vraie base de données
2. Ajouter l'authentification JWT
3. Implémenter le chiffrement des mots de passe
4. Configurer CORS correctement
5. Ajouter des logs d'audit pour les actions admin

## 📞 Support

Pour des questions ou problèmes, contactez l'équipe IVESTP Marcory.

---

**© 2025 IVESTP Voltaire • Système de Gestion Scolaire**

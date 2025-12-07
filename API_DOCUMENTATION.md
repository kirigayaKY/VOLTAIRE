# 🔌 DOCUMENTATION API - VOLTAIRE

**Version:** 1.0.0  
**Backend:** Express.js (Port 5000)  
**Date:** Décembre 2025

---

## TABLE DES MATIÈRES

1. [Introduction](#introduction)
2. [Authentification](#authentification)
3. [Endpoints](#endpoints)
   - [Inscription & Utilisateurs](#inscription--utilisateurs)
   - [Annonces](#annonces)
   - [Notes (Grades)](#notes-grades)
   - [Classes](#classes)
   - [Emploi du temps](#emploi-du-temps)
4. [Structures de données](#structures-de-données)
5. [Codes d'erreur](#codes-derreur)
6. [Exemples](#exemples)

---

## Introduction

Cette API gère tous les flux du système de gestion scolaire VOLTAIRE:
- Inscription et authentification des élèves
- Gestion des annonces
- Gestion des notes et résultats
- Gestion des classes
- Gestion de l'emploi du temps

**Base URL:** `http://localhost:5000/api`

---

## Authentification

### Authentification Admin

Tous les endpoints admin nécessitent le header:
```http
x-admin-id: 99
```

**Admin par défaut:**
- ID: 99
- Matricule: admin
- Password: 08546517

### Authentification Élève

Utilisez les identifiants élève (matricule + password) dans le formulaire de login.

---

## Endpoints

### Inscription & Utilisateurs

#### 1. Inscription d'un nouvel élève

```http
POST /api/student/register
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "DUPONT",
  "matricule": "24-VM-0001",
  "className": "Terminale D",
  "dateOfBirth": "2006-05-15",
  "parentPhone": "+225 07 12 34 56",
  "password": "motdepasse123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Inscription réussie. Vous pouvez maintenant vous connecter.",
  "data": {
    "id": 100,
    "matricule": "24-VM-0001",
    "firstName": "Jean",
    "lastName": "DUPONT",
    "className": "Terminale D"
  }
}
```

**Erreurs:**
- 400: Données manquantes
- 400: Matricule déjà enregistré

---

#### 2. Récupérer tous les utilisateurs (Public)

```http
GET /api/public/users
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "matricule": "23-VM-0012",
      "role": "student",
      "firstName": "Jean-Marc",
      "lastName": "KOUAMÉ",
      "className": "Terminale D",
      "average": 14.5,
      "absences": 2,
      "delays": 3,
      "rank": 4,
      "dateOfBirth": "2006-05-15",
      "parentPhone": "+225 07 07 45 79 82",
      "grades": [...]
    },
    ...
  ]
}
```

---

### Annonces

#### 3. Lister les annonces (Public)

```http
GET /api/announcements
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Examen Blanc - Mathématiques",
      "content": "L'examen blanc aura lieu le 20 Mars...",
      "date": "03 Mar",
      "type": "exam",
      "author": "Direction"
    },
    ...
  ]
}
```

---

#### 4. Créer une annonce (Admin)

```http
POST /api/admin/announcements/create
x-admin-id: 99
Content-Type: application/json

{
  "title": "Fermeture extraordinaire",
  "content": "L'établissement sera fermé jeudi 20 décembre",
  "type": "urgent"
}
```

**Types d'annonces:** `exam`, `info`, `event`, `urgent`, `important`

**Response (200):**
```json
{
  "success": true,
  "message": "Annonce créée et publiée pour tous",
  "data": {
    "id": 6,
    "title": "Fermeture extraordinaire",
    "content": "L'établissement sera fermé...",
    "date": "07/12/2025",
    "type": "urgent",
    "author": "Super Admin"
  }
}
```

---

#### 5. Modifier une annonce (Admin)

```http
PUT /api/admin/announcements/:id
x-admin-id: 99
Content-Type: application/json

{
  "title": "Titre modifié",
  "content": "Contenu modifié",
  "type": "info"
}
```

---

#### 6. Supprimer une annonce (Admin)

```http
DELETE /api/admin/announcements/:id
x-admin-id: 99
```

---

### Notes (Grades)

#### 7. Récupérer les notes d'un élève (Public)

```http
GET /api/student/grades/:matricule
```

**Exemple:**
```http
GET /api/student/grades/23-VM-0012
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": 1,
      "matricule": "23-VM-0012",
      "name": "Jean-Marc KOUAMÉ",
      "className": "Terminale D",
      "average": 14.6
    },
    "grades": [
      {
        "studentId": 1,
        "studentName": "Jean-Marc KOUAMÉ",
        "subject": "Mathématiques",
        "date": "12 Mar",
        "note": 16,
        "max": 20,
        "coef": 4,
        "teacher": "Non spécifié"
      },
      ...
    ]
  }
}
```

---

#### 8. Créer/Modifier une note (Admin)

```http
POST /api/admin/grades/update
x-admin-id: 99
Content-Type: application/json

{
  "studentId": 1,
  "subject": "Mathématiques",
  "date": "07/12/2025",
  "note": 18,
  "max": 20,
  "coef": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Note mise à jour avec succès",
  "data": {
    "studentId": 1,
    "subject": "Mathématiques",
    "note": 18,
    "newAverage": 14.6
  }
}
```

---

#### 9. Lister toutes les notes (Admin)

```http
GET /api/admin/grades
x-admin-id: 99
```

---

#### 10. Notes par classe (Admin)

```http
GET /api/admin/grades/by-class/:className
x-admin-id: 99
```

---

### Classes

#### 11. Lister les classes (Admin)

```http
GET /api/admin/classes
x-admin-id: 99
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "TD",
      "gradeLevel": "Terminale",
      "letter": "D",
      "fullName": "Terminale D",
      "mainTeacher": "Prof. Martin",
      "studentCount": 35
    },
    ...
  ]
}
```

---

#### 12. Créer une classe (Admin)

```http
POST /api/admin/classes/create
x-admin-id: 99
Content-Type: application/json

{
  "id": "TS",
  "gradeLevel": "Terminale",
  "letter": "S",
  "fullName": "Terminale S",
  "mainTeacher": "Prof. Dupont",
  "studentCount": 30
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Classe créée avec succès",
  "data": {
    "id": "TS",
    "gradeLevel": "Terminale",
    "letter": "S",
    "fullName": "Terminale S",
    "mainTeacher": "Prof. Dupont",
    "studentCount": 30
  }
}
```

---

#### 13. Supprimer une classe (Admin)

```http
DELETE /api/admin/classes/:id
x-admin-id: 99
```

---

### Emploi du Temps

#### 14. Lister tous les emplois du temps (Admin)

```http
GET /api/admin/schedule
x-admin-id: 99
```

---

#### 15. Emploi du temps d'une classe (Admin)

```http
GET /api/admin/schedule/:classId
x-admin-id: 99
```

**Exemple:**
```http
GET /api/admin/schedule/Terminale D
```

---

#### 16. Créer/Modifier emploi du temps (Admin)

```http
POST /api/admin/schedule/update
x-admin-id: 99
Content-Type: application/json

{
  "classId": "Terminale D",
  "className": "Terminale D",
  "schedule": [
    {
      "day": "Lundi",
      "period": "8h-9h30",
      "subject": "Mathématiques",
      "teacher": "Prof. Dupont",
      "room": "Salle 101"
    },
    {
      "day": "Lundi",
      "period": "10h-11h30",
      "subject": "Français",
      "teacher": "Prof. Martin",
      "room": "Salle 102"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Emploi du temps mis à jour avec succès",
  "data": {
    "classId": "Terminale D",
    "className": "Terminale D",
    "schedule": [...]
  }
}
```

---

## Structures de Données

### UserData
```typescript
{
  id: number
  matricule: string
  role: 'student' | 'parent' | 'admin'
  firstName: string
  lastName: string
  password: string
  className: string
  status: 'active' | 'inactive'
  dateOfBirth: string
  parentPhone: string
  photo?: string
  average: number
  absences: number
  delays: number
  rank: number
  grades: GradeData[]
}
```

### GradeData
```typescript
{
  subject: string
  date: string
  coef: number
  note: number
  max: number
}
```

### AnnouncementData
```typescript
{
  id: number
  title: string
  content: string
  date: string
  type: 'exam' | 'info' | 'event' | 'urgent' | 'important'
  author: string
}
```

### ClassData
```typescript
{
  id: string
  gradeLevel: string
  letter: string
  fullName: string
  mainTeacher: string
  studentCount: number
}
```

### ScheduleData
```typescript
{
  classId: string
  className: string
  schedule: {
    day: string
    period: string
    subject: string
    teacher: string
    room: string
  }[]
}
```

---

## Codes d'Erreur

| Code | Message | Cause |
|------|---------|-------|
| 400 | Données manquantes | Champs obligatoires manquants |
| 400 | Matricule déjà enregistré | Utilisateur existe déjà |
| 401 | Admin authentication required | Header x-admin-id manquant |
| 403 | Unauthorized admin access | x-admin-id invalide |
| 404 | Élève non trouvé | ID/matricule n'existe pas |
| 500 | Erreur serveur | Problème serveur |

---

## Exemples

### Exemple 1: Inscription complète

```bash
# 1. Inscrire un nouvel élève
curl -X POST http://localhost:5000/api/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "KONE",
    "matricule": "24-VM-0555",
    "className": "1ère C",
    "dateOfBirth": "2007-06-10",
    "parentPhone": "+225 05 44 55 66",
    "password": "marie123456"
  }'

# 2. Récupérer les utilisateurs pour vérifier
curl http://localhost:5000/api/public/users | grep '24-VM-0555'

# 3. Accéder à ses notes (si elles existent)
curl http://localhost:5000/api/student/grades/24-VM-0555
```

### Exemple 2: Admin crée une annonce

```bash
curl -X POST http://localhost:5000/api/admin/announcements/create \
  -H "Content-Type: application/json" \
  -H "x-admin-id: 99" \
  -d '{
    "title": "Réunion parents-professeurs",
    "content": "Venez discuter de la scolarité de votre enfant le 15 décembre à 14h",
    "type": "important"
  }'

# Vérifier que l'annonce est visible publiquement
curl http://localhost:5000/api/announcements
```

### Exemple 3: Admin met à jour les notes

```bash
# Ajouter une note
curl -X POST http://localhost:5000/api/admin/grades/update \
  -H "Content-Type: application/json" \
  -H "x-admin-id: 99" \
  -d '{
    "studentId": 1,
    "subject": "Physique-Chimie",
    "date": "07/12/2025",
    "note": 17,
    "max": 20,
    "coef": 3
  }'

# Élève consulte ses notes
curl http://localhost:5000/api/student/grades/23-VM-0012
```

### Exemple 4: Admin crée une classe

```bash
curl -X POST http://localhost:5000/api/admin/classes/create \
  -H "Content-Type: application/json" \
  -H "x-admin-id: 99" \
  -d '{
    "id": "1C",
    "gradeLevel": "1ère",
    "letter": "C",
    "fullName": "1ère C",
    "mainTeacher": "Prof. Traoré",
    "studentCount": 32
  }'

# Lister les classes
curl http://localhost:5000/api/admin/classes \
  -H "x-admin-id: 99"
```

---

**FIN DE LA DOCUMENTATION API**

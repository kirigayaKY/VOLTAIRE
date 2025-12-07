# 🏗️ ARCHITECTURE TECHNIQUE - VOLTAIRE

**Version:** 1.0.0  
**Date:** Décembre 2025  
**Stack:** React + TypeScript + Express.js

---

## 📐 DIAGRAMME ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                    Port 3001 (Vite Dev Server)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Home Page  │  │ Student Space│  │ Admin Space  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │  App State  │ (useState + localStorage)     │
│                    │  - db[]     │                               │
│                    │  - user     │                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│                    ┌──────▼──────────────┐                       │
│                    │ localStorage Save   │                       │
│                    │ ("voltaire_users")  │                       │
│                    └────────────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ fetch() / API Calls
                            │ (axios client)
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                          │
│                    Port 5000 (Node Server)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Routes & Middleware                           │ │
│  │  - CORS enabled                                            │ │
│  │  - adminAuthMiddleware (x-admin-id header)                │ │
│  │  - Request logging                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────────┐ │
│  │           API Endpoints (RESTful)                           │ │
│  │  - Authentication (/api/student/register)                 │ │
│  │  - Announcements (/api/announcements, /api/admin/...)    │ │
│  │  - Grades (/api/student/grades, /api/admin/grades)       │ │
│  │  - Classes (/api/admin/classes)                           │ │
│  │  - Schedule (/api/admin/schedule)                         │ │
│  └────────────────────┬─────────────────────────────────────┘ │
│                       │                                         │
│  ┌────────────────────▼────────────────────────────────────────┐ │
│  │         In-Memory Data Storage (Arrays)                     │ │
│  │  - users[]                                                 │ │
│  │  - announcements[]                                         │ │
│  │  - classes[]                                               │ │
│  │  - classSchedules[]                                        │ │
│  │  - grades[] (embedded in users)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ STRUCTURE DES DOSSIERS

```
/VOLTAIRE
├── index.html                 # Point d'entrée HTML
├── index.tsx                  # Point d'entrée React
├── app.tsx                    # Composant principal (~1957 lignes)
├── app.css                    # Styles globaux
├── data.ts                    # Données initiales (INITIAL_USERS)
├── types.ts                   # Types TypeScript
├── tailwind.config.ts         # Configuration Tailwind
├── postcss.config.js          # Configuration PostCSS
├── vite.config.ts             # Configuration Vite
├── tsconfig.json              # Configuration TypeScript
├── package.json               # Dépendances npm
│
├── public/                    # Fichiers statiques
│   └── (aucun fichier actuellement)
│
├── components/                # Composants React
│   ├── AdminAnnouncements.tsx # Gestion annonces (admin)
│   ├── AdminClasses.tsx       # Gestion classes (admin)
│   ├── AdminDashboard.tsx     # Tableau de bord admin
│   ├── AdminGrades.tsx        # Gestion notes v1
│   ├── AdminGradesV2.tsx      # Gestion notes v2
│   ├── AdminGradesV3.tsx      # Gestion notes v3 (actuelle)
│   ├── AdminSchedule.tsx      # Gestion emploi du temps (admin)
│   └── StudentAnnouncements.tsx # Affichage annonces (élève)
│
├── backend/                   # Code serveur
│   ├── server.ts             # Serveur Express (~825 lignes)
│   └── api-client.ts         # Client API axios
│
└── Documentation
    ├── AUDIT_REPORT.md       # Rapport d'audit complet
    ├── API_DOCUMENTATION.md  # Documentation des endpoints
    ├── SECURITY_GUIDE.md     # Guide de sécurité production
    └── ARCHITECTURE.md       # Ce fichier
```

---

## 🎯 FLUX DE DONNÉES

### 1. Inscription (Sign Up)

```
User Fill Form
    ↓
handleRegister() triggered
    ↓
POST /api/student/register (Backend)
    ├─ Validate data
    ├─ Check matricule uniqueness
    ├─ Create UserData object
    └─ Add to users[] array
    ↓
Backend returns: {success: true, data: newUser}
    ↓
Frontend:
    ├─ setDb([...db, newUser]) - Add to state
    ├─ localStorage.setItem() - Save locally
    └─ Redirect to login
```

### 2. Connexion (Login)

```
User Enter Credentials
    ↓
Login Component submits
    ↓
Search in db[] (state):
    ├─ Find user by matricule + password
    └─ If admin: check hardcoded credentials (admin/08546517)
    ↓
setUser(foundUser) - Set logged in user
    ↓
Redirect to appropriate dashboard
    ├─ Admin → AdminDashboard
    └─ Student → StudentDashboard
```

### 3. Synchronisation Backend-Frontend

```
Frontend mounts (useEffect)
    ↓
GET /api/public/users
    ↓
Backend returns: {success: true, data: users[]}
    ↓
Frontend:
    ├─ setDb(data) - Update state
    └─ localStorage.setItem() - Save locally
    ↓
Page reloads with synchronized data
```

### 4. Annonces (Admin créé)

```
Admin creates announcement
    ↓
POST /api/admin/announcements/create
    ├─ Header: x-admin-id: 99
    ├─ Body: {title, content, type}
    └─ Backend validates admin
    ↓
Backend:
    ├─ Create AnnouncementData object
    ├─ Add to announcements[] array
    └─ Return {success: true}
    ↓
Frontend (Student View):
    ├─ GET /api/announcements (public)
    ├─ Receive list of announcements
    ├─ StudentAnnouncements renders them
    └─ Display in reverse order (newest first)
```

### 5. Notes (Admin met à jour)

```
Admin submits grade form
    ↓
POST /api/admin/grades/update
    ├─ Header: x-admin-id: 99
    ├─ Body: {studentId, subject, note, coef, ...}
    └─ Backend validates admin
    ↓
Backend:
    ├─ Find student by studentId
    ├─ Add/update grade in student.grades[]
    ├─ Recalculate student average
    └─ Return {success: true, newAverage}
    ↓
Frontend (Student View):
    ├─ GET /api/student/grades/:matricule (public)
    ├─ Display student's grades
    └─ Show calculated average
```

---

## 🔐 AUTHENTICATION FLOW

### Admin Authentication

```
Request to /api/admin/...
    ↓
Check header: x-admin-id
    ↓
adminAuthMiddleware:
    ├─ Extract adminId from header
    ├─ Find user with id === adminId && role === 'admin'
    └─ If found: call next() → Continue to endpoint
    └─ If not found: return 403 Unauthorized
    ↓
Execute admin endpoint
```

### Student Login

```
User submits credentials
    ↓
Search in db[] array:
    ├─ Find: matricule (case-insensitive) + password match
    └─ Check role === 'student'
    ↓
If found:
    ├─ setUser(foundUser)
    ├─ Store in state
    └─ Redirect to dashboard
    ↓
If not found:
    ├─ Show error message
    └─ Stay on login page
```

**Nota:** Système simple pour développement. Production nécessite JWT.

---

## 🗃️ STRUCTURES DE DONNÉES

### UserData (Interface)

```typescript
interface UserData {
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
  average: number          // Moyenne calculée
  absences: number         // Nombre d'absences
  delays: number          // Nombre de retards
  rank: number            // Classement
  grades: GradeData[]     // Tableau de notes
}
```

### GradeData (Interface)

```typescript
interface GradeData {
  subject: string
  date: string
  coef: number            // Coefficient
  note: number            // Note obtenue
  max: number             // Note maximale
}
```

### AnnouncementData (Interface)

```typescript
interface AnnouncementData {
  id: number
  title: string
  content: string
  date: string           // Format: "JJ/MM/AAAA"
  type: 'exam' | 'info' | 'event' | 'urgent' | 'important'
  author: string
}
```

### ClassData (Interface)

```typescript
interface ClassData {
  id: string              // Exemple: "TD" (unique identifier)
  gradeLevel: string      // Exemple: "Terminale"
  letter: string          // Exemple: "D"
  fullName: string        // Exemple: "Terminale D"
  mainTeacher: string     // Professeur principal
  studentCount: number    // Nombre d'élèves
}
```

### ScheduleData (Interface)

```typescript
interface ClassSchedule {
  classId: string
  className: string
  schedule: {
    day: string           // "Lundi", "Mardi", etc.
    period: string        // "8h-9h30"
    subject: string
    teacher: string
    room: string          // Salle de classe
  }[]
}
```

---

## 🔧 TECHNOLOGIES UTILISÉES

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI framework |
| TypeScript | 5.3 | Type safety |
| Vite | 4.5 | Build tool |
| Tailwind CSS | 3.3 | Styling |
| Framer Motion | 10.16 | Animations |
| Lucide React | 0.292 | Icons |
| Axios | 1.6 | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.18 | Web framework |
| TypeScript | 5.3 | Type safety |
| CORS | 2.8 | Cross-origin requests |
| Node.js | 22.21 | Runtime |

### Development
| Tool | Purpose |
|------|---------|
| tsx | TypeScript executor (hot reload) |
| concurrently | Run multiple commands |
| PostCSS | CSS transformations |

---

## 🔄 CYCLE DE VIE D'UNE REQUÊTE

### Example: POST /api/student/register

```typescript
// 1. CLIENT (Frontend)
const handleRegister = async (newUser: UserData) => {
  const response = await fetch('/api/student/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  const data = await response.json()
  // Handle response...
}

// 2. SERVER (Backend)
app.post('/api/student/register', (req: Request, res: Response) => {
  // a) Extract request body
  const { firstName, lastName, matricule, ... } = req.body
  
  // b) Validate inputs
  if (!firstName || !matricule || ...) {
    return res.status(400).json({ success: false, error: '...' })
  }
  
  // c) Business logic
  const duplicate = users.find(u => u.matricule === matricule)
  if (duplicate) {
    return res.status(400).json({ success: false, error: '...' })
  }
  
  // d) Create object
  const newUser: UserData = {
    id: nextId++,
    matricule: matricule.toUpperCase(),
    ...
  }
  
  // e) Save to storage
  users.push(newUser)
  
  // f) Send response
  res.json({
    success: true,
    message: 'Inscription réussie',
    data: newUser
  })
})

// 3. CLIENT (Frontend) - Receive & Process
const data = await response.json()
if (data.success) {
  setDb(prevDb => [...prevDb, data.data])         // Update state
  localStorage.setItem('voltaire_users', ...)      // Persist
  setSection('login-student')                      // Navigate
}
```

---

## 📊 STATE MANAGEMENT

### App Component State

```typescript
const App = () => {
  // Authentication state
  const [user, setUser] = useState<UserData | null>(null)
  const [section, setSection] = useState<Section>('home')
  
  // Database state
  const [db, setDb] = useState<UserData[]>(INITIAL_USERS)

  // Effects for persistence
  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('voltaire_users')
    setDb(JSON.parse(saved))
  }, [])

  useEffect(() => {
    // Sync with backend on mount
    fetch('/api/public/users').then(r => r.json()).then(data => {
      setDb(data.data)
    })
  }, [])

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('voltaire_users', JSON.stringify(db))
  }, [db])
}
```

---

## 🔌 API ENDPOINTS SUMMARY

### Public Endpoints
```
GET  /api/announcements              # List announcements
GET  /api/student/grades/:matricule  # View student grades
GET  /api/public/users               # List all users (for sync)
POST /api/student/register           # Register new student
```

### Admin Endpoints (require x-admin-id header)
```
POST   /api/admin/announcements/create
PUT    /api/admin/announcements/:id
DELETE /api/admin/announcements/:id

GET  /api/admin/classes
POST /api/admin/classes/create
DELETE /api/admin/classes/:id

GET  /api/admin/grades
GET  /api/admin/grades/by-class/:className
POST /api/admin/grades/update
DELETE /api/admin/grades/:studentId/:subject

GET  /api/admin/schedule
GET  /api/admin/schedule/:classId
POST /api/admin/schedule/update
```

---

## 🚀 DÉMARRAGE DU PROJET

### Installation
```bash
cd /workspaces/VOLTAIRE
npm install
```

### Démarrage développement
```bash
npm run dev

# Cela lance:
# - Frontend Vite sur port 3001
# - Backend Express sur port 5000
# (via concurrently)
```

### Fichiers de configuration

**package.json:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "vite",
    "dev:backend": "tsx watch backend/server.ts"
  }
}
```

---

## 📝 POINTS CLÉS À RETENIR

1. **État unique:** Toutes les données élève-admin passent par `db[]` en App
2. **Synchronisation:** Frontend se sync au démarrage via `/api/public/users`
3. **Persistance locale:** localStorage sauvegarde `voltaire_users`
4. **Persistance serveur:** In-memory (perte au redémarrage)
5. **Authentification simple:** Pas de JWT (à implémenter en production)
6. **Endpoints RESTful:** Suivent les conventions HTTP (GET, POST, PUT, DELETE)
7. **Validation minimale:** À renforcer en production
8. **CORS enabled:** Permet requêtes cross-origin frontend ↔ backend

---

## 🔮 AMÉLIORATIONS FUTURES

1. **Base de données:** PostgreSQL au lieu de in-memory
2. **Authentication:** JWT tokens au lieu de headers
3. **Real-time sync:** WebSockets au lieu de polling
4. **Offline mode:** Service Worker + sync queue
5. **Testing:** Unit tests + E2E tests
6. **Monitoring:** Error tracking + performance monitoring
7. **Scalability:** API Gateway + microservices
8. **Security:** Encryption + 2FA + audit logs

---

**FIN DE LA DOCUMENTATION ARCHITECTURE**

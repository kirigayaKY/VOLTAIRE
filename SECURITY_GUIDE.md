# 🔒 GUIDE DE SÉCURITÉ - VOLTAIRE PRODUCTION

**Version:** 1.0.0  
**Date:** Décembre 2025  
**Priorité:** 🔴 Haute

---

## 🚨 AVERTISSEMENT

⚠️ **Le code actuel est développé pour un environnement de développement local.**  
**NE DÉPLOYEZ PAS EN PRODUCTION sans implémenter les recommandations ci-dessous.**

---

## 1. AUTHENTIFICATION & AUTORISATION

### 🔴 PROBLÈME: Mots de passe stockés en clair

**Code actuel:**
```typescript
// ❌ MAUVAIS
const user = db.find(u => u.matricule === matricule && u.password === password)
```

**Solution: Utiliser bcrypt**

```bash
npm install bcrypt
```

```typescript
// ✅ BON
import bcrypt from 'bcrypt'

// Lors de l'inscription
const hashedPassword = await bcrypt.hash(password, 10)

// Lors de la connexion
const isValid = await bcrypt.compare(password, user.password)
```

### 🔴 PROBLÈME: Pas de tokens JWT

**Code actuel:**
```typescript
// ❌ MAUVAIS - Header simplement validé
const adminId = req.headers['x-admin-id'] as string
const admin = users.find(u => u.id === parseInt(adminId))
```

**Solution: Implémenter JWT**

```bash
npm install jsonwebtoken
```

```typescript
// ✅ BON - Lors du login
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)

// Middleware JWT
const jwtMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

### 🟡 PROBLÈME: Pas de refresh tokens

**Solution:**

```typescript
// Access token (15 minutes)
const accessToken = jwt.sign(data, ACCESS_SECRET, { expiresIn: '15m' })

// Refresh token (7 jours)
const refreshToken = jwt.sign(data, REFRESH_SECRET, { expiresIn: '7d' })

// Endpoint pour refresh
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET)
  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  )
  res.json({ accessToken: newAccessToken })
})
```

### 🟡 PROBLÈME: Pas de rate limiting

**Solution:**

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: 'Trop de tentatives de connexion, réessayez plus tard'
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3 // 3 inscriptions par heure
})

app.post('/api/student/register', registerLimiter, (req, res) => {
  // ...
})
```

---

## 2. VALIDATION DES DONNÉES

### 🟡 PROBLÈME: Pas de validation stricte

**Utiliser Joi ou Zod:**

```bash
npm install zod
```

```typescript
import { z } from 'zod'

const RegisterSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  matricule: z.string().regex(/^[A-Z0-9-]+$/),
  className: z.string().min(2).max(50),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  parentPhone: z.string().regex(/^\+?[0-9\s-]{10,}$/),
  password: z.string()
    .min(12) // Minimum 12 caractères
    .regex(/[A-Z]/) // Au moins une majuscule
    .regex(/[0-9]/) // Au moins un chiffre
    .regex(/[!@#$%^&*]/) // Au moins un caractère spécial
})

app.post('/api/student/register', (req, res) => {
  try {
    const validated = RegisterSchema.parse(req.body)
    // Continuer...
  } catch (error) {
    res.status(400).json({ error: 'Validation failed' })
  }
})
```

### 🟡 PROBLÈME: Pas de protection XSS/CSRF

**Solutions:**

```bash
npm install helmet express-csrf
```

```typescript
import helmet from 'helmet'
import csrf from 'express-csrf'

app.use(helmet()) // Headers de sécurité
app.use(csrf()) // Protection CSRF

// Dans le frontend
// Ajouter le token CSRF à chaque requête POST
const response = await fetch('/api/...', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  }
})
```

---

## 3. BASE DE DONNÉES

### 🔴 PROBLÈME: Données en mémoire (perdues au redémarrage)

**Solution: Utiliser PostgreSQL**

```bash
npm install pg typeorm
```

```typescript
import { createConnection } from 'typeorm'
import { User } from './entities/User'

const connection = await createConnection({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Announcement, Grade, ClassEntity]
})

// Utiliser les repositories au lieu des arrays en mémoire
const users = connection.getRepository(User)
const newUser = await users.save(userData)
```

### 🟡 PROBLÈME: Pas de backups

**Solution: Configurer des backups automatiques**

```bash
# Backup quotidien avec pg_dump
0 2 * * * pg_dump voltaire_db > /backups/voltaire_$(date +\%Y\%m\%d).sql

# Ou utiliser un service: AWS RDS, Supabase, Render, etc.
```

### 🟡 PROBLÈME: Pas de chiffrement des données sensibles

```typescript
import crypto from 'crypto'

// Chiffrer les données sensibles
const encrypt = (text: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}

// Déchiffrer
const decrypt = (encrypted: string) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

// Exemple: chiffrer le numéro de téléphone
user.parentPhone = encrypt(parentPhone)
```

---

## 4. CONFIGURATION SERVEUR

### 🔴 PROBLÈME: Pas d'HTTPS

**Solution: Ajouter SSL/TLS**

```bash
# Générer certificats (ou utiliser Let's Encrypt)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Ou avec Let's Encrypt (recommandé)
sudo certbot certonly --standalone -d yourdomain.com
```

```typescript
import https from 'https'
import fs from 'fs'

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
}

https.createServer(options, app).listen(443)
```

### 🟡 PROBLÈME: Headers de sécurité manquants

**Solution: Utiliser Helmet**

```typescript
import helmet from 'helmet'

app.use(helmet()) // Ajoute automatiquement:
// - Content-Security-Policy
// - X-Frame-Options
// - X-Content-Type-Options
// - Strict-Transport-Security
// - etc.
```

### 🟡 PROBLÈME: CORS trop permissif

**Code actuel:**
```typescript
// ❌ MAUVAIS
app.use(cors()) // Accepte tous les domaines
```

**Solution:**

```typescript
// ✅ BON
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
}))
```

---

## 5. LOGGING & MONITORING

### 🟡 PROBLÈME: Pas de logging

**Solution: Utiliser Winston ou Pino**

```bash
npm install winston
```

```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// Utiliser dans l'app
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip })
  next()
})

// Log les erreurs
app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error('Error:', { error: err.message, stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
})
```

### 🟡 PROBLÈME: Pas de monitoring

**Solutions:**

- **Sentry:** https://sentry.io/ (erreurs temps réel)
- **New Relic:** https://newrelic.com/ (performance monitoring)
- **DataDog:** https://www.datadoghq.com/ (logs et metrics)

```bash
npm install @sentry/node
```

```typescript
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

---

## 6. VARIABLES D'ENVIRONNEMENT

### 🔴 PROBLÈME: Secrets en dur dans le code

**Créer .env:**

```env
# ===== DATABASE =====
DB_HOST=localhost
DB_PORT=5432
DB_USER=voltaire_user
DB_PASSWORD=secure_password_here
DB_NAME=voltaire_db

# ===== SECURITY =====
JWT_SECRET=your_very_long_and_random_secret_key_min_32_chars
REFRESH_SECRET=another_long_and_random_secret_key_min_32_chars
ENCRYPTION_KEY=encryption_key_min_32_chars

# ===== CORS =====
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ===== ADMIN =====
ADMIN_INITIAL_PASSWORD=secure_initial_password

# ===== EXTERNAL SERVICES =====
SENTRY_DSN=https://...@sentry.io/...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# ===== ENVIRONMENT =====
NODE_ENV=production
PORT=443
```

**Charger les variables:**

```typescript
import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined')
}
```

**⚠️ Ne jamais committer .env en Git!**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

---

## 7. DÉPLOIEMENT SÉCURISÉ

### Checklist avant déploiement

- [ ] Mots de passe hashés avec bcrypt
- [ ] JWT tokens implémentés
- [ ] Rate limiting actif
- [ ] Validation strict des inputs (Zod)
- [ ] HTTPS/TLS configuré
- [ ] Headers de sécurité (Helmet)
- [ ] CORS restreint
- [ ] Base de données PostgreSQL
- [ ] Logging et monitoring actif
- [ ] Backup automatique configuré
- [ ] Variables d'environnement sécurisées
- [ ] Tests de sécurité passés

### Options de déploiement recommandées

1. **Render** (Recommandé pour débutants)
   - Auto HTTPS
   - Base de données PostgreSQL incluse
   - Déploiement facile depuis GitHub

2. **Railway**
   - Interface simple
   - PostgreSQL, Redis intégrés
   - Variables d'env sécurisées

3. **AWS/DigitalOcean/Hetzner**
   - Plus de contrôle
   - Plus cher mais scalable
   - Nécessite configuration manuelle

### Exemple avec Render

```yaml
# render.yaml
services:
  - type: web
    name: voltaire-api
    runtime: node
    plan: standard
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: voltaire_db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production

  - type: pserv
    name: voltaire_db
    runtime: postgres15
    plan: standard
```

---

## 8. TESTING DE SÉCURITÉ

### Tests à effectuer

```bash
npm install --save-dev jest supertest
```

```typescript
// test/security.test.ts

describe('Security Tests', () => {
  
  it('should reject registration with weak password', async () => {
    const response = await request(app)
      .post('/api/student/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        matricule: '24-TEST-001',
        className: 'Terminale D',
        dateOfBirth: '2006-01-01',
        parentPhone: '+225 01 02 03 04',
        password: '123' // Trop faible
      })
    
    expect(response.status).toBe(400)
  })

  it('should rate limit registration attempts', async () => {
    for (let i = 0; i < 4; i++) {
      await request(app).post('/api/student/register').send({...})
    }
    
    const response = await request(app)
      .post('/api/student/register')
      .send({...})
    
    expect(response.status).toBe(429) // Too Many Requests
  })

  it('should reject requests without JWT', async () => {
    const response = await request(app)
      .post('/api/admin/announcements/create')
      .send({...})
    
    expect(response.status).toBe(401)
  })

  it('should encrypt sensitive data', async () => {
    const response = await request(app)
      .post('/api/student/register')
      .send({...})
    
    const user = await User.findOne(response.body.data.id)
    expect(user.parentPhone).not.toBe('+225 01 02 03 04')
  })
})
```

---

## 9. CHECKLIST DE SÉCURITÉ FINALE

### Avant production

- [ ] Bcrypt + JWT implémentés
- [ ] Rate limiting sur login/register
- [ ] Validation des inputs stricte
- [ ] HTTPS/TLS configuré
- [ ] Headers de sécurité (Helmet)
- [ ] CORS restreint
- [ ] Logging et monitoring
- [ ] Backups automatiques
- [ ] Variables d'env sécurisées
- [ ] Pas de secrets en Git
- [ ] Tests de sécurité passés
- [ ] Code review effectué
- [ ] Dépendances à jour (`npm audit fix`)

### En continu

- [ ] Monitoring des erreurs (Sentry)
- [ ] Surveillance des logs
- [ ] Mises à jour de sécurité (npm audit)
- [ ] Backups testés régulièrement
- [ ] Revue de sécurité trimestrielle

---

## 10. RESSOURCES

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite Community](https://portswigger.net/burp/communitydownload)

---

**FIN DU GUIDE DE SÉCURITÉ**

Pour des questions ou clarifications, consultez la documentation officielle ou contactez l'équipe de sécurité.

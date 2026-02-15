# 🍽️ Restaurant SaaS - Les Saveurs d'Istanbul

Plateforme SaaS complète de gestion pour restaurant avec :
- 🌐 Site web public (menu, réservation, avis)
- 🛒 Click & Collect avec paiement Stripe
- 📊 Dashboard admin (commandes, menu, statistiques)
- 👨‍🍳 Kitchen Display System (KDS) temps réel
- 🔐 Authentification multi-rôles (Admin, Staff, Cuisine)

## 🚀 Stack Technique

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **UI**: shadcn/ui (40+ composants)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **ORM**: Prisma
- **Paiement**: Stripe
- **State**: Zustand
- **Build**: Vite

## 📁 Structure du Projet

```
├── prisma/
│   ├── schema.prisma      # Modèle de données
│   └── seed.ts            # Données initiales
├── src/
│   ├── components/        # Composants UI
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── MenuSection.tsx
│   │   ├── ReservationForm.tsx
│   │   ├── ReviewsSection.tsx
│   │   └── Footer.tsx
│   ├── pages/             # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── ReservationPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── KitchenDisplay.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useRestaurant.ts
│   ├── store/             # State management
│   │   └── cartStore.ts   # Panier Zustand
│   ├── types/             # Types TypeScript
│   │   ├── index.ts
│   │   └── database.ts
│   ├── lib/               # Utilitaires
│   │   ├── supabase.ts
│   │   └── prisma.ts
│   ├── App.tsx            # Router principal
│   └── main.tsx           # Point d'entrée
└── package.json
```

## 🛠️ Installation

### 1. Cloner et installer

```bash
cd /mnt/okcomputer/output/app
npm install
```

### 2. Configuration environnement

```bash
cp .env.example .env
```

Remplir les variables :

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Supabase
VITE_SUPABASE_URL="https://[project].supabase.co"
VITE_SUPABASE_ANON_KEY="[your-anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"

# Stripe
VITE_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# App
VITE_APP_URL="http://localhost:5173"
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer et appliquer les migrations
npm run db:migrate

# Seeder avec les données initiales
npm run db:seed
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## 📱 Fonctionnalités

### Site Public
- ✅ Homepage avec branding restaurant
- ✅ Menu dynamique avec catégories et filtres
- ✅ Panier Click & Collect (Zustand + persistance)
- ✅ Réservation de table avec vérification horaires
- ✅ Système d'avis clients (avec modération)
- ✅ Design responsive (mobile-first)

### Dashboard Admin
- ✅ Vue d'ensemble avec statistiques (CA, commandes, réservations)
- ✅ Gestion des commandes (statuts: PENDING → CONFIRMED → PREPARING → READY)
- ✅ Gestion du menu (CRUD plats, catégories, options)
- ✅ Gestion des réservations
- ✅ Modération des avis
- ✅ Paramètres du restaurant

### Kitchen Display System (KDS)
- ✅ Vue temps réel des commandes en attente
- ✅ Notifications sonores pour nouvelles commandes
- ✅ Gros boutons tactiles pour changement de statut
- ✅ Affichage du temps écoulé (alerte si >15min)

### Authentification
- ✅ Supabase Auth (email/password)
- ✅ RBAC : SUPER_ADMIN, ADMIN, STAFF, KITCHEN, CLIENT
- ✅ Protection des routes

## 🗄️ Modèle de Données

### Entités principales

| Entité | Description |
|--------|-------------|
| `Restaurant` | Tenant (multi-tenant ready) |
| `User` | Utilisateurs avec rôles |
| `Category` | Catégories de menu |
| `Dish` | Plats avec options |
| `DishOption` | Options/modifiers (suppléments) |
| `Order` | Commandes avec statuts |
| `OrderItem` | Lignes de commande |
| `Reservation` | Réservations de table |
| `Review` | Avis clients |
| `OpeningHours` | Horaires d'ouverture |

### Multi-tenancy

Architecture **Shared Database, Shared Schema** avec `restaurantId` sur chaque table.

Sécurité via **Row Level Security (RLS)** Supabase.

## 🚀 Déploiement

### Frontend (Vercel)

```bash
npm run build
# Déployer le dossier dist/ sur Vercel
```

### Base de données (Supabase)

Déjà hébergée sur Supabase. RLS activé pour la sécurité multi-tenant.

### Variables d'environnement production

```env
VITE_SUPABASE_URL="https://[project].supabase.co"
VITE_SUPABASE_ANON_KEY="[production-anon-key]"
VITE_STRIPE_PUBLIC_KEY="pk_live_..."
```

## 📋 Roadmap

### Phase 1 (MVP) ✅
- [x] Site public avec menu
- [x] Panier Click & Collect
- [x] Réservation
- [x] Dashboard admin basique
- [x] KDS temps réel

### Phase 2 (Améliorations)
- [ ] Upload d'images (Cloudinary)
- [ ] Paiement Stripe complet
- [ ] Notifications email/SMS
- [ ] Application mobile PWA
- [ ] Système de fidélité

### Phase 3 (SaaS)
- [ ] Multi-tenant complet (subdomains)
- [ ] Plans d'abonnement (Stripe Billing)
- [ ] Onboarding restaurant
- [ ] API publique

## 📝 Notes

### Accès par défaut

**Restaurant**: `http://localhost:5173/les-saveurs-d-istanbul`

**Admin**: `http://localhost:5173/login`
- Email: `admin@saveurs-istanbul.fr`
- Mot de passe: (à définir lors du premier login)

**KDS**: `http://localhost:5173/kitchen`

### Commandes utiles

```bash
# Reset database
npx prisma migrate reset

# Ouvrir Prisma Studio
npm run db:studio

# Générer types Supabase
npx supabase gen types typescript --project-id [project] --schema public > src/types/database.ts
```

## 🆘 Support

Pour toute question ou problème :
1. Vérifier les logs console
2. Vérifier les variables d'environnement
3. Vérifier la connexion Supabase
4. Vérifier les permissions RLS

---

**Développé avec ❤️ pour Les Saveurs d'Istanbul**

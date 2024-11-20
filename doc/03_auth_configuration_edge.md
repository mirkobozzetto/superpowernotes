# Configuration Auth.js avec Edge Runtime

## 1. Middleware (middleware.ts)

```typescript
import { auth } from "@src/lib/auth/auth";
export default auth;
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
```

**Pourquoi ?**

- `export default auth` : Utilise uniquement la version légère d'auth compatible Edge
- `matcher` : Définit quelles routes doivent passer par le middleware
  - Exclut les fichiers statiques et API
  - Prévient les erreurs Prisma en Edge Runtime

## 2. Configuration Edge (auth.config.ts)

```typescript
export const authConfig = {
  providers: [Google],
  session: {
    strategy: "database",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Logique de routage
    },
  },
};
```

**Pourquoi ?**

- Configuration légère sans Prisma pour Edge Runtime
- Gère les permissions de base :
  - Pages publiques (/)
  - Pages d'auth (/auth/\*)
  - Routes API (/api/\*)
- Empêche l'erreur "PrismaClient is not configured to run in Edge Functions"

## 3. Configuration Principale (auth.ts)

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  // ... callbacks
});
```

**Pourquoi ?**

- Étend authConfig avec les fonctionnalités compètes
- Utilise PrismaAdapter pour la persistance
- Gère la création/mise à jour des utilisateurs
- S'exécute dans l'environnement Node.js standard

## Stratégie de Session

- **database** dans auth.config.ts (middleware)
- **jwt** dans auth.ts (application)

**Pourquoi cette différence ?**

- Le middleware ne peut pas accéder à la base de données (Edge Runtime)
- Le JWT permet une vérification rapide sans accès DB
- Meilleur compromis performance/sécurité

## En résumé

1. Le middleware intercepte les requêtes (Edge)
2. La config légère gère les autorisations basiques
3. La config complète gère les opérations DB
4. Plus d'erreurs Prisma en Edge Runtime
5. Performance optimisée

C'est comme avoir deux versions de l'auth :

- Version Light → Edge (rapide, sans DB)
- Version Pro → Node.js (complète, avec DB)

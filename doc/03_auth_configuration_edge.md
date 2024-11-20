# Configuration Auth.js et Edge Runtime dans Next.js

## Le Problème

L'utilisation de Next.js avec Auth.js en Edge Runtime peut causer deux problèmes majeurs :

1. Erreurs "PrismaClient is not configured to run in Edge Functions"
2. Assets statiques (images, vidéos, etc.) inaccessibles pour les utilisateurs non connectés

## 1. Configuration de Base (auth.config.ts)

```typescript
export const authConfig = {
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/auth");
      const isPublicPage = ["/", "/auth/verify-request"].includes(nextUrl.pathname);
      const isApiRoute = nextUrl.pathname.startsWith("/api");

      // Important : Gérer tous les assets statiques
      const isStaticAsset =
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.includes("/public/") ||
        nextUrl.pathname.endsWith(".svg") ||
        nextUrl.pathname.endsWith(".ico") ||
        nextUrl.pathname.endsWith(".png") ||
        nextUrl.pathname.endsWith(".jpg") ||
        nextUrl.pathname.endsWith(".jpeg") ||
        nextUrl.pathname.endsWith(".gif") ||
        nextUrl.pathname.endsWith(".webp") ||
        nextUrl.pathname.endsWith(".mp4") ||
        nextUrl.pathname.includes("/images/");

      if (isStaticAsset) return true; // Essentiel pour les assets publics
      if (isAuthPage) return true;
      if (isPublicPage) return true;
      if (isApiRoute) return isLoggedIn;

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
```

**Points Clés :**

- Utilisation de JWT pour la compatibilité Edge
- Gestion exhaustive des assets statiques
- Configuration des routes publiques et protégées

## 2. Configuration Principale (auth.ts)

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,                    // Hérite de la config de base
  adapter: PrismaAdapter(prisma),   // DB adapter
  providers: [
    ...authConfig.providers,        // Providers de la config de base
    Resend({...}),                 // Providers additionnels
  ],
  callbacks: {
    ...authConfig.callbacks,        // Callbacks de base
    async session({session, user}) {
      // Enrichissement de la session
    },
    async signIn({user, account}) {
      // Logique de connexion
    }
  }
});
```

**Points Clés :**

- Extension de auth.config.ts
- Ajout des fonctionnalités nécessitant la base de données
- Configuration des providers additionnels

## 3. Middleware (middleware.ts)

```typescript
export { auth as middleware } from "@src/lib/auth/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**Points Clés :**

- Export simple du middleware
- Configuration du matcher pour les routes à protéger

## Gestion des Assets Statiques

La clé de cette configuration est la gestion correcte des assets statiques via `isStaticAsset` dans auth.config.ts. Cette vérification permet de :

1. Rendre les images accessibles aux utilisateurs non connectés
2. Permettre le chargement des favicons et icônes
3. Autoriser l'accès aux vidéos et autres médias
4. Conserver la protection des routes importantes

## Points importants

1. **Assets Statiques :**

   - Doivent être explicitement autorisés dans `isStaticAsset`
   - Inclure tous les types de fichiers nécessaires
   - Vérifier les chemins spéciaux (/public/, /images/)

2. **Stratégie de Session :**

   - Utiliser "jwt" pour la compatibilité Edge
   - Éviter les accès DB dans le middleware

3. **Protection :**
   - Routes API protégées pour les utilisateurs connectés
   - Assets statiques accessibles à tous
   - Pages publiques clairement définies

## Résolution des Problèmes Courants

1. **Images non affichées :**

   - Vérifier l'extension dans `isStaticAsset`
   - Ajouter le chemin du dossier si nécessaire

2. **Erreurs Prisma en Edge :**

   - Utiliser uniquement JWT dans le middleware
   - Éviter les opérations DB en Edge

3. **Assets Manquants :**
   - Ajouter les extensions manquantes
   - Vérifier les chemins spéciaux

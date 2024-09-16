# Tutoriel : Implémentation de l'authentification avec Next.js et NextAuth

## Structure du projet

```
app/
├── api
│   └── auth
│       └── [...nextauth]
│           └── route.ts
├── globals.css
├── layout.tsx
└── page.tsx
src/
├── components
│   └── auth
│       ├── AuthButton.tsx
│       ├── SignIn.tsx
│       └── SignOut.tsx
└── lib
    └── auth
        └── auth.ts
```

## Étapes d'implémentation

### 1. Configuration de NextAuth (`src/lib/auth/auth.ts`)

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
});
```

### 2. Configuration de la route d'API (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/src/lib/auth/auth";

export const { GET, POST } = handlers;
```

### 3. Création des composants d'authentification

#### a. SignIn (`src/components/auth/SignIn.tsx`)

```typescript
import { signIn } from "@/src/lib/auth/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
```

#### b. SignOut (`src/components/auth/SignOut.tsx`)

```typescript
import { signOut } from "@/src/lib/auth/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
```

#### c. AuthButton (`src/components/auth/AuthButton.tsx`)

```typescript
import { auth } from "@/src/lib/auth/auth";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function AuthButton() {
  const session = await auth();

  if (session && session.user) {
    return <SignOut />;
  } else {
    return <SignIn />;
  }
}
```

### 4. Intégration dans la page principale (`app/page.tsx`)

```typescript
import AuthButton from "@/src/components/auth/AuthButton";

export default function Home() {
  return (
    <main>
      <h1>Welcome to My App</h1>
      <AuthButton />
    </main>
  );
}
```

## Fonctionnement

- A lire avant de commencer :
  1. https://authjs.dev/getting-started/installation
  2. https://authjs.dev/getting-started/authentication/oauth
  3. https://github.com/mirkobozzetto/google-authjs-tutorial
- Le composant `AuthButton` vérifie l'état de la session de l'utilisateur.
- Il affiche le bouton `SignIn` si l'utilisateur n'est pas connecté, ou `SignOut` s'il est connecté.
- Les actions de connexion et de déconnexion sont gérées côté serveur grâce à la directive "use server".
- NextAuth s'occupe de la gestion des sessions et de l'interaction avec le provider d'authentification (Google dans cet exemple).

## Personnalisation

- Vous pouvez ajouter d'autres providers d'authentification dans `auth.ts`.
- Personnalisez l'apparence des boutons SignIn et SignOut selon vos besoins.
- Ajoutez des callbacks dans la configuration de NextAuth pour gérer des comportements spécifiques lors de l'authentification.

## Variables d'environnement nécessaires

Assurez-vous d'avoir les variables d'environnement suivantes dans votre fichier `.env.local` :

```
AUTH_SECRET="votre_secret_ici"
AUTH_GOOGLE_ID="votre_google_client_id"
AUTH_GOOGLE_SECRET="votre_google_client_secret"
```

N'oubliez pas de remplacer les valeurs par vos propres clés et secrets.

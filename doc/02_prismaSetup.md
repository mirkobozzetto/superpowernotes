# Configuration de Prisma avec NextAuth et PostgreSQL dans Next.js

Ce guide explique comment configurer Prisma avec NextAuth et PostgreSQL dans un projet Next.js.

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
    ├── auth
    │   └── auth.ts
    └── prisma.ts
```

## Configuration des fichiers

### 1. Configuration de Prisma (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  Authenticator Authenticator[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}

model Authenticator {
  credentialID         String  @unique
  userId               String
  providerAccountId    String
  credentialPublicKey  String
  counter              Int
  credentialDeviceType String
  credentialBackedUp   Boolean
  transports           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, credentialID])
}
```

### 2. Configuration de Prisma Client (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 3. Configuration de NextAuth (`src/lib/auth/auth.ts`)

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "../prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});
```

### 4. Configuration de la route d'API NextAuth (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/src/lib/auth/auth";

export const { GET, POST } = handlers;
```

## Dépendances du projet (`package.json`)

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.5.0",
    "@prisma/client": "5.12.0",
    "next": "14.2.11",
    "next-auth": "5.0.0-beta.21",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "prisma": "^5.19.1"
  }
}
```

## Étapes de configuration

1. **Installer les dépendances** :

   ```bash
   pnpm add @prisma/client @auth/prisma-adapter next-auth
   pnpm add -D prisma
   ```

2. **Initialiser Prisma** :

   ```bash
   npx prisma init
   ```

3. **Configurer la base de données** :
   Ajoutez l'URL de votre base de données PostgreSQL dans le fichier `.env` :

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"
   ```

4. **Générer le client Prisma** :

   ```bash
   npx prisma generate
   ```

5. **Créer les tables dans la base de données** :

   ```bash
   npx prisma migrate dev
   ```

6. **Configurer NextAuth** :
   Ajoutez les identifiants de votre provider (ex: Google) dans `.env` :
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

## Utilisation

Avec cette configuration, vous pouvez maintenant utiliser Prisma et NextAuth dans votre application Next.js. Les modèles Prisma sont configurés pour fonctionner avec NextAuth, et l'authentification est gérée via le provider Google.

Pour utiliser l'authentification dans vos composants, vous pouvez importer les fonctions `signIn`, `signOut`, et `auth` depuis `@/src/lib/auth/auth`.

## Notes importantes

- Assurez-vous que les versions de `@prisma/client` et `prisma` correspondent pour éviter des problèmes de compatibilité.
- La configuration inclut le support pour WebAuthn (modèle Authenticator), qui est optionnel.
- Veillez à ne pas committer vos fichiers `.env` contenant des informations sensibles.

Cette configuration fournit une base solide pour l'authentification et la gestion de base de données dans une application Next.js avec Prisma, NextAuth, et PostgreSQL.

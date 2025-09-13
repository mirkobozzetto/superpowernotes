# Super Power Notes

A voice-first note-taking application that transcribes, organizes, and intelligently tags your thoughts using AI.

## What it does

Records voice notes, transcribes them with OpenAI Whisper, automatically generates titles and tags, and organizes everything in a hierarchical folder system. Built with Next.js 15, TypeScript, and PostgreSQL.

## Key Features

**Voice Processing**: Real-time transcription with support for WebM, MP3, WAV, OGG. Automatic format conversion via FFmpeg.

**Smart Organization**: Hierarchical folders with drag-and-drop. Advanced search by keywords, tags, dates, and folders.

**Authentication**: NextAuth v5 with Google OAuth and Magic Links. Role-based access control.

**User Management**: Monthly recording quotas with automatic reset. Admin panel for user and email management.

**Browser Extension**: Record from any webpage. Cross-browser support.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI, Zustand, React Query
- **Backend**: Prisma ORM, PostgreSQL, OpenAI API, NextAuth v5
- **Infrastructure**: Vercel deployment, FFmpeg audio processing, React Email

## Setup

```bash
# Prerequisites: Node.js 18+, PostgreSQL, OpenAI API key

pnpm install
pnpm dev       # Development
pnpm build     # Production build
pnpm start     # Production server
```

## Project Structure

```
superpowernotes/
├── app/                    # Next.js App Router
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── stores/             # State management
│   └── validations/        # Zod schemas
├── prisma/                 # Database schema
└── @email/                 # Email templates
```

## License

Copyright © 2025 Bozzetto Mirko. All rights reserved.

Contact: bozzettomirko88@gmail.com

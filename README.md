# Super Power Notes 🚀

## Overview

Super Power Notes is an intelligent note-taking web application designed to function as your second brain. Built with Next.js 14 and TypeScript, it combines advanced voice transcription capabilities with traditional note management features, offering a modern and intuitive user experience.

## ✨ Key Features

### 🎤 Intelligent Voice Transcription

- **Real-time transcription** with OpenAI Whisper
- **Multi-format support**: WebM, MP3, WAV, OGG
- **Automatic conversion** of unsupported audio formats with FFmpeg
- **AI-powered automatic generation** of titles and tags
- **Cross-browser microphone permission** management

### 📁 Advanced Organization

- **Hierarchical folder system** with subfolders
- **Drag-and-drop** for note organization
- **Advanced search** by keywords, tags, dates, and folders
- **Intelligent content filtering**

### 🔐 Robust Authentication

- **NextAuth v5** with Google OAuth and Magic Links
- **Role management**: Admin, User, Beta
- **Secure sessions** with JWT
- **Route protection middleware**

### ⚡ Resource Management

- **Recording time quota system**
- **Real-time usage tracking**
- **Automatic quota reset**
- **Performance optimization** with React Query

### 🌐 Browser Extension

- **Cross-browser integration** (Chrome, Safari, Firefox)
- **Recording from any webpage**
- **Automatic synchronization** with web application
- **Intelligent browser and OS detection**

### 📧 Newsletter System

- **Subscription management** with email confirmation
- **Email templates** with React Email
- **One-click unsubscribe**
- **Admin interface** for bulk sending

### 👨‍💼 Administration Panel

- **User management** with role modification
- **Detailed usage statistics**
- **Targeted or bulk email sending**
- **Quota monitoring** and resets

## 🛠 Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **Radix UI** for interface
- **Framer Motion** for animations
- **Zustand** for state management
- **React Query** for data management

### Backend

- **Next.js API Routes** with Zod validation
- **Prisma ORM** with PostgreSQL
- **NextAuth v5** for authentication
- **OpenAI API** (Whisper + GPT) for AI
- **Resend** for email sending
- **Winston** for logging

### Infrastructure

- **PostgreSQL** as main database
- **FFmpeg** for audio conversion
- **React Email** for email templates
- **Vercel** ready for deployment

## 🚀 Installation and Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- API Keys: OpenAI, Google OAuth, Resend

### Available Scripts

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm email` - Email development
- `pnpm lint` - Code linting

## 📱 Implemented Features

### ✅ Core Features

- [x] Voice recording and transcription
- [x] Complete CRUD note management
- [x] Hierarchical folder system
- [x] Advanced search and filtering
- [x] Multi-provider authentication
- [x] User quota management
- [x] Administration interface
- [x] Newsletter system
- [x] Browser extension
- [x] Complete responsive design

### ✅ Advanced Features

- [x] AI-powered automatic title/tag generation
- [x] Automatic audio format conversion
- [x] Drag-and-drop organization
- [x] Microphone permission management
- [x] User role system
- [x] React Email templates
- [x] Structured logging with Winston
- [x] Data validation with Zod

## 🎯 Roadmap

### 🔄 In Development

- [ ] Real-time collaborative mode
- [ ] End-to-end note encryption
- [ ] Public API for integrations
- [ ] Mobile application (React Native)

### 🚀 Future Features

- [ ] Custom AI agents for enterprises
- [ ] Extensible plugin system
- [ ] Third-party integrations (Notion, Slack, etc.)
- [ ] Note sentiment analysis
- [ ] AI-powered automatic summaries
- [ ] Secure note sharing

## 🏗 Project Architecture

```
superpowernotes/
├── app/                    # Next.js App Router
│   ├── (extension)/        # Browser extension pages
│   ├── admin/              # Administration interface
│   ├── api/                # API Routes
│   └── auth/               # Authentication pages
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── services/           # Services and API calls
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities
│   └── validations/        # Zod schemas
├── prisma/                 # DB schema and migrations
├── @email/                 # Email templates
└── public/                 # Static assets
```

## 🔒 Security

- **Authentication**: NextAuth v5 with JWT sessions
- **Authorization**: Route protection middleware
- **Validation**: Zod schemas on all inputs
- **CORS**: Secure configuration for extension
- **Rate limiting**: Protection against abuse
- **Logging**: Monitoring of sensitive actions

## 📈 Performance

- **SSR/SSG**: Next.js optimization
- **Code splitting**: Dynamic imports
- **Caching**: React Query for data
- **Images**: Automatic Next.js optimization
- **Bundle**: Dependency analysis and optimization

## 🤝 Contributing

This project is currently in private development. For any questions or suggestions:

**Contact**: bozzettomirko88@gmail.com

## 📄 License

© Bozzetto Mirko - 2024. All rights reserved.

---

⚠️ **Note**: This project is in active development. Some features may evolve rapidly.

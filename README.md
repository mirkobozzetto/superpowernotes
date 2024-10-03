Super Power Notes

Welcome to Super Power Notes — the next-generation note-taking application that transforms the way you capture, transcribe, and organize your thoughts. Leveraging the power of OpenAI’s Whisper model, Super Power Notes allows you to record audio notes, automatically transcribe them, tag them for easy retrieval, and edit them on the fly.

Features

    •	Voice Transcription: Record your thoughts and let our app transcribe them using the Whisper AI model.
    •	Tagging System: Organize your notes with customizable tags for efficient searching and filtering.
    •	Note Editing: Edit your transcriptions directly within the app to ensure accuracy and clarity.
    •	User Roles: Supports both regular users and admins, each with specific permissions and monthly usage limits.
    •	Search Functionality: Advanced search options to find notes by tags, keywords, and date ranges.
    •	Responsive UI: A clean and intuitive interface built with React and Tailwind CSS for a seamless user experience.

Technology Stack

    •	Frontend: React with Next.js, Tailwind CSS for styling.
    •	Backend: Next.js API Routes, Prisma ORM connected to a PostgreSQL database.
    •	Authentication: NextAuth.js with Prisma adapter for secure user management.
    •	AI Integration: OpenAI’s Whisper model for audio transcription.
    •	State Management: Custom React hooks for handling recording and dashboard functionalities.

Core Components

AudioRecorder

    •	Handles microphone permissions and audio recording functionalities.
    •	Integrates with useRecorder hook for recording logic.
    •	Displays recording animation and controls during an active recording session.

NoteList

    •	Displays a list of transcribed notes with options to edit or delete.
    •	Shows note details like title, transcription snippet, tags, and creation date.
    •	Provides interactive buttons for editing and deleting notes.

API Routes

    •	/api/transcribe: Handles audio file uploads and returns transcriptions.
    •	/api/voice-notes: CRUD operations for managing voice notes.
    •	/api/searchNotes: Advanced search endpoint to filter notes based on tags, keywords, and dates.
    •	/api/auth: Authentication routes managed by NextAuth.js.

Getting Started

    Note: Installation instructions are omitted intentionally.

Clone the repository and explore the codebase to understand how Super Power Notes can revolutionize your note-taking experience.

Future Enhancements

    •	Advanced Editing Tools: Rich-text editing for transcriptions.
    •	Collaboration Features: Share notes with team members and collaborate in real-time.
    •	Cross-Platform Support: Native applications for iOS and Android devices.
    •	AI Summarization: Automatic summarization of lengthy transcriptions.

Contributing

We welcome contributions! Feel free to submit issues, fork the repository, and create pull requests.

License

This project is licensed under the MIT License.

# Remate Discos

A vinyl records marketplace built with Next.js, TypeScript, and Supabase.

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase
- Zustand for state management

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local` with your Supabase credentials.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/WebApp/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   └── ui/        # shadcn/ui components
│   ├── lib/           # Utilities and helpers
│   │   └── supabase/  # Supabase client
│   ├── stores/        # Zustand stores
│   └── types/         # TypeScript types
├── public/            # Static assets
└── [config files]     # Various configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check
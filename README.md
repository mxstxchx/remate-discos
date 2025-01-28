# Remate Discos

Web application for browsing and reserving vinyl records from a personal collection. Features a streamlined browse interface with dynamic filtering and alias-based reservations.

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript & Tailwind CSS
- Supabase (PostgreSQL)
- shadcn/ui components
- Zustand for state management

## Project Structure
```
/RemateDiscos
├── docs/                    # Project documentation
│   ├── PRD.md
│   ├── project_overview.md
│   ├── technical_insights.md
│   ├── supabase_status.md
│   └── supabase_exports/    # JSON exports
│
└── WebApp/                  # Next.js application
    ├── src/
    │   ├── app/            # Next.js App Router
    │   ├── components/     # React components
    │   ├── lib/           # Utilities and helpers
    │   ├── stores/        # Zustand stores
    │   └── types/         # TypeScript types
    ├── public/            # Static assets
    └── [Next.js config files]
```

## Features
- Browse interface with dynamic filtering
- Alias-based authentication
- Shopping cart with reservation system
- Multi-language support (es-CL, en-US)
- Admin interface for inventory management
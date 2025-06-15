# Concert Booking System

A full-stack web application for managing concert bookings. The system allows users to browse available concerts, make reservations, and complete transactions for concert tickets.

## Project Structure

This monorepo contains both the backend and frontend applications:

- [`/backend`](./backend/README.md) - NestJS REST API with PostgreSQL database
- [`/frontend`](./frontend/README.md) - Next.js web application

## Quick Start

The project uses `pnpm` as the package manager and includes Makefiles for easy setup.

1. Set up the backend:
```bash
cd backend
make setup
pnpm start
```

2. Set up the frontend:
```bash
cd frontend
make setup
pnpm dev
```

For detailed setup instructions and documentation:
- See [Backend Documentation](./backend/README.md)
- See [Frontend Documentation](./frontend/README.md)

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- TypeORM
- TypeScript

### Frontend
- Next.js
- React Query
- TypeScript
- Tailwind CSS
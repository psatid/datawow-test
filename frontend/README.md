# Concert Booking System - Frontend

## Description

This is a concert booking system frontend built with Next.js. It provides a user interface for browsing concerts, making reservations, and managing bookings. The application includes both user and admin interfaces for managing the concert booking system.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.3 - React Framework
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **UI Libraries**:
  - Tailwind CSS - Utility-first CSS framework
  - Lucide React - Icons
  - clsx & tailwind-merge - CSS class management
- **HTTP Client**: Axios
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── admin/        # Admin interface pages
│   └── user/         # User interface pages
├── modules/          # Feature modules
│   ├── common/       # Shared components and utilities
│   ├── concerts/     # Concert-related features
│   └── history/      # Booking history features
└── public/           # Static assets
```

## Prerequisites

- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm#installing-and-updating)
- corepack (will be installed automatically if missing)

## Getting Started

The easiest way to set up the development environment is using the provided Makefile:

```bash
make setup
```

This single command will:

1. Install and configure the correct Node.js version (22.x)
2. Install and configure pnpm (10.9.0)
3. Create a .env file with default configuration
4. Install project dependencies

After setup is complete, start the application:

```bash
make dev
```

### Manual Setup

If you prefer to set up manually, follow these steps:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a .env file by copying .env.example:

   ```bash
   cp .env.example .env
   ```

   Default configuration:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Lint the code

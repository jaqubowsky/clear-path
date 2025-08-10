# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo for a micro-SaaS application built with Next.js, React, and TypeScript. The project uses Bun as the package manager and Biome for linting and formatting.

## Development Commands

### Core Development
- `bun run dev` - Start development servers for all apps (web app runs on port 3000 with Turbopack)
- `bun run build` - Build all apps and packages
- `bun run check-types` - Type check all packages

### Code Quality
- `bun run format-and-lint` - Check formatting and linting with Biome
- `bun run format-and-lint:fix` - Fix formatting and linting issues with Biome

### Package-specific Commands
- `turbo dev --filter=web` - Run only the web app in development
- `turbo build --filter=web` - Build only the web app
- `bun run check-types` in `apps/web/` - Type check the web app only

## Architecture

This is a Turborepo monorepo with the following structure:

### Apps
- `apps/web/` - Main Next.js application (port 3000) with App Router

### Packages
- `packages/ui/` - Shared React component library using Shadcn UI, Tailwind CSS, and Lucide icons
- `packages/typescript-config/` - Shared TypeScript configurations (base, Next.js, React library)
- `packages/tailwind-config/` - Shared Tailwind CSS configuration

### Key Technologies
- **Runtime**: Bun (package manager)
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: React 19 with Shadcn UI, Tailwind CSS, Lucide icons
- **Code Quality**: Biome for linting/formatting (replaces ESLint/Prettier)
- **Monorepo**: Turborepo with workspace dependencies

### Code Style
- Biome configuration: 2-space indentation, 120 character line width, double quotes

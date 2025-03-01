# KPI Builder

A modern web application for creating and managing Key Performance Indicators (KPIs) with an intuitive drag-and-drop formula builder. Built with Next.js, React, and TypeScript.

## Features

- Intuitive drag-and-drop formula builder
- Real-time formula validation
- Dark/Light theme support
- Multiple aggregation types (average, median, sum, integration)
- Responsive design
- Error boundary protection
- SWR for efficient data fetching

## Technical Architecture

### Frontend Architecture

- Next.js 15 with App Router
- React 19 for UI components
- TypeScript for type safety
- TailwindCSS for styling
- SWR for data fetching and caching
- React DnD for drag and drop functionality

### Backend Architecture

- Next.js API Routes
- Prisma ORM
- SQLite database (configurable)
- Zod for validation

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kpi-builder
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create .env file

   ```bash
   cp .env.example .env
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start dev server
   ```bash
   npm run dev
   ```

## Key Dependencies

- Framework: Next.js 15.1.7
- UI Library: React 19.0.0
- Database: Prisma with SQLite
- State Management: SWR 2.3.2
- Drag and Drop: React DnD 16.0.1
- Styling: TailwindCSS 3.4.1
- Icons: Heroicons 2.2.0
- Validation: Zod 3.24.2
- TypeScript: 5.x

## Possible Improvements

1. Improve the FormulaBuilder:
   - features for building certain formulas are missing
   - add reordering possibility
   - allow for parsing a formula string into the visual formular representation
2. Testing (skipped that as it is a POC)
   - Unit tests for key functions
   - Itegration tests for the React components
   - E2E tests for critical paths

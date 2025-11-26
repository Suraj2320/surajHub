# E-Commerce Platform

## Overview

This is a full-stack e-commerce application built with React, Express, and PostgreSQL (via Neon). The platform supports role-based access control with three user types: regular users (customers), sellers, and administrators. The system is designed with a product-first visual hierarchy inspired by leading e-commerce platforms like Flipkart and Amazon, emphasizing high-density information architecture optimized for conversion.

The application follows a modern full-stack architecture with a Vite-powered React frontend using shadcn/ui components and Tailwind CSS, an Express backend with TypeScript, and Drizzle ORM for type-safe database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Hot Module Replacement (HMR) enabled for rapid development
- Separate development and production build configurations

**UI Component System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Component aliases configured for clean imports (`@/components`, `@/lib`, `@/hooks`)
- Comprehensive UI component library including forms, dialogs, tables, charts, and navigation elements

**State Management:**
- TanStack Query (React Query) for server state management and data fetching
- Custom hooks for authentication (`useAuth`) and common patterns
- Query client configured with credentials for session-based authentication

**Design System:**
- Typography: Inter for UI elements, Poppins for headings
- Standardized spacing units (2, 4, 6, 8, 12, 16) for consistent rhythm
- Color system with CSS custom properties supporting light/dark themes
- Three-tier layout with sticky navigation and breadcrumb navigation

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Dual-mode server setup (development with Vite middleware, production static serving)
- Session-based authentication with PostgreSQL session storage
- Request logging middleware with performance tracking

**API Design:**
- RESTful API pattern with `/api` prefix for all routes
- Route registration system in `server/routes.ts`
- Storage interface pattern for data operations abstraction
- In-memory storage implementation (`MemStorage`) for development with database migration path

**Separation of Concerns:**
- `server/app.ts`: Express application configuration and middleware
- `server/routes.ts`: Route registration and HTTP server creation
- `server/storage.ts`: Data access layer with interface-based design
- `server/db.ts`: Database connection and Drizzle ORM configuration

### Data Storage

**Database:**
- PostgreSQL (Neon serverless) as the primary database
- Drizzle ORM for type-safe queries and schema management
- WebSocket connection pooling via Neon serverless adapter
- Database migrations managed through Drizzle Kit

**Schema Design:**
- Session table for authentication persistence
- Users table with role-based access control (user, seller, admin)
- Categories table with slug-based routing
- Additional e-commerce tables defined in `shared/schema.ts`
- Shared schema between frontend and backend for type consistency

**Data Access Pattern:**
- Storage interface (`IStorage`) defines CRUD operations
- Current implementation uses in-memory storage for rapid prototyping
- Production implementation would use Drizzle ORM with the defined schema
- Type-safe insert schemas generated using drizzle-zod

### Authentication & Authorization

**Authentication Strategy:**
- Session-based authentication using connect-pg-simple
- Sessions stored in PostgreSQL for scalability
- User roles: `user` (customer), `seller`, and `admin`
- Role information stored in user table with approval workflow

**Security:**
- Credentials included in fetch requests for session handling
- Protected routes on both frontend and backend
- Unauthorized error handling with custom error utilities
- 401 responses handled gracefully with returnNull option in query client

### Design Guidelines & UX

**Product Catalog Design:**
- Product-first visual hierarchy with images and pricing as primary elements
- Grid-based layouts with consistent gaps (gap-4 for product grids)
- High-density information architecture without clutter
- Conversion-optimized flow: browse → cart → checkout

**Navigation:**
- Sticky top navbar with search bar, cart badge, and profile dropdown
- Horizontal mega-menu category bar
- Breadcrumb navigation on product/category pages
- Mobile-responsive with breakpoint at 768px

**Component Standards:**
- Card-based layouts with rounded corners and shadows
- Consistent button variants (default, outline, ghost, destructive)
- Form components with label/input patterns
- Toast notifications for user feedback

## External Dependencies

**Core Framework Dependencies:**
- `react` and `react-dom`: UI framework
- `express`: Backend web server
- `vite`: Frontend build tool and dev server
- `@vitejs/plugin-react`: React support for Vite

**Database & ORM:**
- `@neondatabase/serverless`: Neon PostgreSQL serverless driver
- `drizzle-orm`: TypeScript ORM
- `drizzle-kit`: Database migrations and schema management
- `drizzle-zod`: Zod schema generation from Drizzle schemas
- `connect-pg-simple`: PostgreSQL session store for Express

**UI Component Libraries:**
- `@radix-ui/*`: Headless UI primitives (20+ components including dialog, dropdown, select, tabs)
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe variant styles
- `tailwind-merge` and `clsx`: Utility for merging Tailwind classes

**Data Fetching & Forms:**
- `@tanstack/react-query`: Server state management
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation resolvers
- `zod`: Schema validation

**Development Tools:**
- `typescript`: Type safety
- `tsx`: TypeScript execution for development
- `esbuild`: Production bundling for backend
- `@replit/vite-plugin-*`: Replit-specific development enhancements

**Additional Libraries:**
- `date-fns`: Date manipulation and formatting
- `cmdk`: Command menu component
- `embla-carousel-react`: Carousel functionality
- `recharts`: Charting library
- `vaul`: Drawer component
- `input-otp`: OTP input component
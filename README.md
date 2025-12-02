# Capybook

Capybook is a modern reading tracking application built with Next.js. It helps readers track their reading progress, manage their book collection, set reading goals, write reviews, and connect with a community of book lovers.

## Overview

Capybook was founded in 2025 with a mission to transform how readers track and enjoy their reading experience. The application was created to solve the common problem of losing track of reading progress or forgetting where you left off in a book.

### Key Features

- 📚 **Reading Progress Tracking**: Track your progress through each book with intuitive and customizable tools
- 📖 **Book Management**: Organize your personal library with books you're reading, want to read, or have completed
- 🎯 **Reading Goals**: Set and track reading goals (books, pages, or time-based)
- ⭐ **Reviews & Ratings**: Write and share book reviews with customizable privacy settings
- 🏆 **Achievements & Badges**: Earn badges for various reading milestones
- 👥 **Community**: Connect with other readers, follow friends, and share your reading journey
- 📊 **Statistics**: Analyze your reading habits with detailed and personalized statistics
- 📅 **Daily Book**: Discover a new book recommendation every day
- 🔄 **Book Lending**: Borrow and lend books with friends
- 📝 **Notes & Quotes**: Take notes and save quotes from your books

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand, SWR
- **Animations**: Motion (Framer Motion)
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** database (local or cloud-hosted)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Raxuis/Capybook.git
cd capybook
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/capybook?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
AUTH_URL="http://localhost:3000"
```

**Important**:
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- Update `DATABASE_URL` with your PostgreSQL connection string
- For production, set `NEXTAUTH_URL` to your production domain

### 4. Database Setup

Generate Prisma Client and run migrations:

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# (Optional) Seed badges
pnpm seed-badges
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

### Development

```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

### Database

```bash
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate   # Run database migrations
pnpm prisma studio    # Open Prisma Studio (database GUI)
pnpm seed-badges      # Seed badges into database
```

### Testing

```bash
pnpm test             # Run unit tests in watch mode
pnpm test:unit        # Run unit tests once
pnpm test:unit:watch  # Run unit tests in watch mode
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with Playwright UI
pnpm test:e2e:report  # Show E2E test report
```

## Project Structure

```
capybook/
├── app/                    # Next.js App Router pages
│   ├── (user)/            # User-facing routes
│   ├── (admin)/           # Admin routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Dashboard/        # Dashboard components
│   ├── BookStore/        # Book store components
│   └── ...
├── prisma/               # Prisma schema and migrations
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── tests/                # Test files
│   ├── e2e/             # End-to-end tests
│   ├── unit/            # Unit tests
│   └── utils/           # Test utilities
└── public/              # Static assets
```

## Features in Detail

### Reading Progress

- Track progress by percentage or pages
- Set a current book
- Mark books as finished
- View reading history

### Book Management

- Add books to your collection
- Organize books into shelves (reading, want to read, completed)
- Search and discover new books
- View book details and covers

### Reviews & Privacy

- Write detailed book reviews
- Rate books from 1 to 5 stars
- Control review visibility:
  - **Public**: Visible to everyone
  - **Private**: Only accessible via private link
  - **Friends**: Visible to your followers
  - **Specific Friend**: Visible to one selected friend

### Reading Goals

- Set goals for:
  - Number of books to read
  - Number of pages to read
  - Time spent reading
- Track progress toward goals
- Set deadlines

### Statistics

- View reading statistics:
  - Books read
  - Pages read
  - Reading streak
  - Genre distribution
  - Reading pace

### Daily Book

- Discover a new book recommendation every day
- View book of the day history
- Track which daily books you've viewed

### Book Lending

- Request to borrow books from friends
- Manage lending requests (accept/reject)
- Track borrowed and lent books
- Set due dates and reminders

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts and profiles
- **Book**: Book information
- **UserBook**: User's book collection and progress
- **BookReview**: Reviews and ratings
- **ReadingGoal**: Reading objectives
- **Badge** & **UserBadge**: Achievement system
- **BookLending**: Book borrowing system
- **ReadingProgress** & **ReadingDay**: Reading statistics
- **DailyBook**: Daily book recommendations

See `prisma/schema.prisma` for the complete schema.

## Authentication

The application uses NextAuth.js v5 with:

- **Credentials Provider**: Email/password authentication
- **JWT Sessions**: 30-day session duration
- **Role-based Access**: USER, ADMIN, MODERATOR roles
- **Protected Routes**: Middleware-based route protection

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The `vercel-build` script automatically:
- Generates Prisma Client
- Runs migrations
- Seeds badges
- Builds the application

### Other Platforms

Ensure you:
1. Set all required environment variables
2. Run `pnpm prisma generate` before building
3. Run `pnpm prisma migrate deploy` to apply migrations
4. Optionally run `pnpm seed-badges` to seed initial data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and hook testing with Vitest
- **E2E Tests**: Full user flow testing with Playwright

See [TESTS.md](./TESTS.md) for detailed testing documentation.

## License

This project is licensed under a Non-Commercial License. See [LICENSE.md](./LICENSE.md) for details.

**Summary**: You are free to use, modify, and distribute this software for non-commercial purposes. Commercial use requires explicit permission from the copyright holder.

## Support

For support, email raxuis@proton.me or open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)
- Database management with [Prisma](https://www.prisma.io)

---

Made with ❤️ by [Raphaël Raclot](https://www.linkedin.com/in/raphael-raclot/)

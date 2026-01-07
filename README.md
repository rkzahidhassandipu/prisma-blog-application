# Blog Applications API

A full-featured blog API built with Node.js, Express, TypeScript, and Prisma. This application provides user authentication, post management, and comment functionality with role-based access control.

## Features

- **User Authentication**: Email/password and Google OAuth login with email verification
- **Role-Based Access Control**: USER and ADMIN roles
- **Post Management**: Create, read, update, and delete blog posts with features like tags, featured posts, and status management
- **Comment System**: Hierarchical comments with replies, approval/rejection status
- **Pagination and Sorting**: Efficient data retrieval with customizable pagination
- **Database**: PostgreSQL with Prisma ORM
- **Email Notifications**: Automated email verification using Nodemailer

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with session management
- **Email**: Nodemailer for email verification
- **Password Hashing**: bcryptjs
- **Development**: tsx for TypeScript execution

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Gmail account for email sending (or configure alternative SMTP)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rkzahidhassandipu/prisma-blog-application.git
   cd blog-applications
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
   APP_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   APP_USER="your-email@gmail.com"
   PORT=3000
   ```

4. **Database Setup**
   
   Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. **Seed Admin User**
   
   Create an initial admin user:
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/google` - Google OAuth login

### Posts
- `GET /posts` - Get all posts (with optional filters: search, tags, isFeatured, status, authorId, pagination)
- `GET /posts/my-posts` - Get posts by current user (USER/ADMIN role required)
- `POST /posts` - Create a new post (USER role required)
- `GET /posts/:postId` - Get post by ID

### Comments
- `GET /comment/author/:authorId` - Get comments by author
- `GET /comment/:commentId` - Get comment by ID
- `POST /comment` - Create a new comment (USER/ADMIN role required)
- `DELETE /comment/:commentId` - Delete comment (USER/ADMIN role required)
- `PATCH /comment/:commentId` - Update comment (USER/ADMIN role required)
- `PATCH /comment/:commentId/moderate` - Moderate comment (ADMIN role required)

## Database Schema

### Models
- **User**: User accounts with roles (USER/ADMIN)
- **Post**: Blog posts with title, content, tags, status, etc.
- **Comment**: Comments with hierarchical replies
- **Session**: Authentication sessions
- **Account**: OAuth account links

### Enums
- **PostStatus**: DRAFT, PUBLISHED, ARCHIVED
- **CommentStatus**: APPROVED, REJECT

## Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── lib/
│   ├── auth.ts            # Better Auth configuration
│   └── prisma.ts          # Prisma client
├── middlewares/
│   └── auth.ts            # Authentication middleware
├── modules/
│   ├── post/
│   │   ├── post.controller.ts
│   │   ├── post.router.ts
│   │   └── post.service.ts
│   └── comment/
│       ├── comment.controller.ts
│       ├── comment.router.ts
│       └── comment.service.ts
├── helpers/
│   └── paginationSortingHelper.ts
└── scripts/
    └── seedAdmin.ts       # Admin user seeding
prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations
```

## Usage

### Creating a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "title": "My Blog Post",
    "content": "Post content here...",
    "thumbnail": "https://example.com/image.jpg",
    "tags": ["tech", "blog"],
    "isFeatured": false
  }'
```

### Getting Posts with Filters
```bash
curl "http://localhost:3000/posts?search=tech&isFeatured=true&page=1&limit=10"
```

## Development

- **Development Mode**: `npm run dev` (uses tsx watch)
- **Database Management**: Use Prisma commands (`npx prisma studio` for GUI)
- **Testing**: Currently no test scripts configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run migrations if schema changes
5. Test your changes
6. Submit a pull request

## License

ISC License
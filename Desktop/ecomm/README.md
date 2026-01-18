# E-Commerce Full Stack Application

Full-stack e-commerce application with admin and user sides, built with Next.js, TypeScript, MongoDB, and Express.

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- Axios (API client)

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Multer (file uploads)
- bcrypt (password hashing)

## Features

### User Side

- Product browsing and filtering by category
- Shopping cart
- User profile management
- Order history
- Favorites/Wishlist
- Custom authentication (phone + 4-digit password)

### Admin Side

- Dashboard with statistics
- User management (change roles)
- Product management (CRUD)
- Order management
- Image upload (drag & drop, up to 10 images per product)
- Main image selection (star icon)

## Project Structure

```
ecomm/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/  # Database, multer config
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── frontend/        # Next.js application
│   ├── app/         # Next.js app router
│   ├── components/  # React components
│   ├── lib/         # Utilities
│   └── store/       # Zustand stores
└── package.json     # Root package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Clerk account (for authentication)

### Installation

1. Install root dependencies:

```bash
npm run install:all
```

2. Set up environment variables:

**Backend** (`backend/.env`):

```
PORT=5000
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ecomm
# OR for MongoDB Atlas (cloud) - see MONGODB_SETUP.md:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecomm?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Seed admin user (optional):

```bash
cd backend
npx ts-node src/seed.ts
```

4. Start development servers:

```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

## Default Admin Account

- Email: n.munkhpurev@gmail.com
- Phone: 99958980
- Password: 8980

## Features in Detail

### Authentication

- Custom authentication flow
- Phone number + 4-digit password login
- Email verification (not phone)
- First admin can change user roles
- Simple token-based authentication

### Product Management

- Upload up to 10 images per product
- Drag and drop file upload
- File picker option
- Star icon to mark main/featured image
- Product features: New, Featured, Discounted

### Design

- Mobile-first responsive design
- Different text sizes for mobile and desktop
- Light themed, minimal, clean UI
- Mongolian language throughout

## API Endpoints

### Auth

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/verify-email` - Verify email

### Products

- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/discounted` - Get discounted products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product by ID

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID

### Admin

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Development

### Backend

```bash
cd backend
npm run dev
# If that doesn't work, try:
# npx tsx src/server.ts
```

### Frontend

```bash
cd frontend
npm run dev
```

## License

MIT

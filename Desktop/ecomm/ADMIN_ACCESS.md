# Admin Access Guide

## How Admin Pages Work

When an admin account is signed in, the following happens:

### 1. Header Navigation
- **Desktop**: Admin link appears in the main navigation bar (blue button)
- **Mobile**: Admin link appears in the mobile navigation menu
- **User Menu**: Blue "Админ" button appears next to the user icon

### 2. Admin Pages Available
- `/admin` - Dashboard with statistics
- `/admin/users` - User management
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management

### 3. Access Protection
- All admin pages check if user is logged in
- All admin pages verify user role is 'admin'
- Non-admin users are redirected to home page
- Backend API routes also require admin authentication

### 4. Admin Sign In
To sign in as admin:
1. Use the admin credentials:
   - Email: `n.munkhpurev@gmail.com`
   - Phone: `99958980`
   - Password: `8980`

2. After signing in, you'll see:
   - "Админ" button in header (blue)
   - Access to all admin pages
   - Admin navigation bar on admin pages

### 5. Testing Admin Access
1. Sign in with admin credentials
2. Look for blue "Админ" button in header
3. Click it to go to admin dashboard
4. Use AdminNav to navigate between admin pages

## Features
✅ Automatic admin link display when admin is logged in
✅ Protected routes (redirects non-admins)
✅ Admin navigation bar on all admin pages
✅ Backend API protection for admin routes

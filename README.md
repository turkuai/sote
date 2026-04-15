# sote

## Requirements

- PHP = 8.2
- Composer
- Node.js >= 18
- phpMyAdmin 

## Before Running

Verify PHP version matches (PHP 8.2):
```bash
php -v                                    # Check your PHP version
/Applications/XAMPP/xamppfiles/bin/php -v # If using XAMPP
```

If using XAMPP, run the server with XAMPP's PHP:
```bash
/Applications/XAMPP/xamppfiles/bin/php artisan serve
```

## Setup

### 1. Submodule Setup

If you are using a submodule, make sure to initialize and update it before proceeding:

```bash
# Initialize and update submodules
git submodule init
git submodule update
```
### 2. tai-grid library
```bash
cd grid
npm install
npm run build
```

### 3. Backend (Laravel)
```bash
cd ..
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### 4. Frontend
```bash
npm install
```

## Running the app

From the root directory, in two terminals:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - frontend build
npm run dev
```

Open in browser: http://localhost:8000

## Test users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| jane@example.com | password123 | Manager |
| bob@example.com | password123 | Nurse |


## API Endpoints

### **Users**
```
GET    /api/users              → List all users
POST   /api/users              → Create user
GET    /api/users/{id}         → Get specific user
PUT    /api/users/{id}         → Update user
DELETE /api/users/{id}         → Delete user
```

### **Roles**
```
GET    /api/roles              → List all available roles
```

### **Groups**
```
GET    /api/groups             → List all groups
POST   /api/groups             → Create group
GET    /api/groups/{id}        → Get specific group
PUT    /api/groups/{id}        → Update group
DELETE /api/groups/{id}        → Delete group
```

### **Example API Request:**
```bash
curl http://localhost:8000/api/users
```

---

## The 3 Roles

### **1. Nurse** (Read-Only) - Blue Badge
- Can view user and group data
- Cannot create, update, or delete

### **2. Manager** (Administrative) - Orange Badge
- Can view all data
- Can create and update users/groups
- Can approve actions

### **3. Admin** (Full Access) - Red Badge
- Can do everything
- Can delete users/groups
- Full system control

---

## 📁 Project Structure

```
app/
├── Models/
│   ├── User.php              ← User model with roles
│   └── Group.php             ← Group model
├── Http/
│   ├── Controllers/
│   │   ├── UserController.php
│   │   ├── GroupController.php
│   │   └── PermissionExampleController.php
│   └── Middleware/
│       ├── CheckRole.php     ← Role protection
│       └── CheckPermission.php
├── Libraries/
│   ├── Role.php              ← Role system (3-tier)
│   ├── Permission.php        ← Binary permissions
│   ├── ApiResponse.php       ← Standard API responses
│   ├── BaseRepository.php    ← CRUD operations
│   └── ValidationRules.php   ← Validation rules
├── Models/
│   ├── User.php
│   └── Group.php
database/
├── migrations/
│   ├── *_create_users_table.php
│   ├── *_create_groups_table.php
│   ├── *_create_user_groups_table.php
│   └── *_add_role_type_to_users_table.php
└── seeders/
    └── DatabaseSeeder.php    ← Creates test data
resources/
└── js/
    ├── pages/
    │   └── Test.tsx          ← Main frontend component
    └── libraries/
        ├── apiClient.ts
        ├── apiResponse.ts
        ├── validation.ts
        └── components.tsx
routes/
└── web.php                   ← All API routes
```

---

## Test the System

### **Via Browser**
1. Visit `http://localhost:8000`
2. See users with role badges
3. View groups and relationships

### **Via API (Tinker)**
```bash
php artisan tinker

# Create a new user
User::create([
    'first_name' => 'Sarah',
    'last_name' => 'Williams',
    'email' => 'sarah@hospital.com',
    'role_type' => 'nurse',
    'role' => Role::getRoleValue('nurse')
]);

# See all users
User::all();

# Exit
exit()
```

### **Via cURL**
```bash
# Get all users
curl http://localhost:8000/api/users

# Get available roles
curl http://localhost:8000/api/roles

# Create new user
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "David",
    "last_name": "Brown",
    "email": "david@hospital.com",
    "role_type": "manager"
  }'
```

---

## 📚 Key Features

✅ **3-Tier Role System** - Simple roles instead of complex permissions  
✅ **Role-Based Access Control** - Middleware for route protection  
✅ **Database Integration** - MySQL with SOTE database  
✅ **Reusable Libraries** - ApiResponse, BaseRepository, ValidationRules  
✅ **API Endpoints** - Full CRUD for users and groups  
✅ **React Frontend** - TypeScript with proper types  
✅ **Test Data** - Seeder creates realistic test data  
✅ **Timestamps** - created_at and updated_at auto-managed  

---

## Useful Commands

```bash
# Reset database with fresh data
php artisan migrate:fresh --seed

# View logs
tail -f storage/logs/laravel.log

# Run migrations only
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Interactive PHP shell
php artisan tinker

# Rebuild frontend
npm run build

# Watch for frontend changes
npm run dev
```

---

## 📖 Documentation Files

Read these for more details:

- **ROLE_SYSTEM_SUMMARY.md** - Complete system overview
- **QUICK_REFERENCE.md** - Fast lookup for common tasks
- **ROLES_IMPLEMENTATION.md** - Detailed implementation guide
- **TESTING_CHECKLIST.md** - How to verify everything works
- **SYSTEM_ARCHITECTURE.md** - System design and data flow

---

## ❓ Common Questions

### **Q: How do I create a new user?**
```bash
# Via API
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role_type": "nurse"
  }'

# Via Tinker
php artisan tinker
> User::create([...])
```

### **Q: How do I change a user's role?**
```bash
# Via API
curl -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"role_type": "manager"}'

# Via Tinker
php artisan tinker
> User::find(1)->update(['role_type' => 'admin'])
```

### **Q: What's in the database?**
- `users` - User data with first_name, last_name, email, role_type, role
- `groups` - Group data
- `user_groups` - Relationships between users and groups
- `migrations` - Tracks database changes (required by Laravel)
- `sessions` - User login sessions (optional)

### **Q: Can I delete the sessions table?**
Yes, it's optional. Run:
```bash
php artisan migrate:fresh --seed
```
It will recreate the database without sessions if you remove the migration.

### **Q: How do I protect routes?**
Add middleware to `routes/web.php`:
```php
Route::delete('/api/users/{id}', [UserController::class, 'destroy'])
    ->middleware('role:admin');  // Only admins
```

---

## 🐛 Troubleshooting

### **Issue: Blank page after visiting localhost:8000**
- Check if both servers are running (Laravel on 8000, React dev server)
- Check browser console for errors (F12)
- Run `php artisan migrate:fresh --seed`

### **Issue: "Connection refused" on API calls**
- Check if Laravel is running: `php artisan serve`
- Check if port 8000 is available
- View logs: `tail -f storage/logs/laravel.log`

### **Issue: Database errors**
- Run: `php artisan migrate:fresh --seed`
- Check MySQL is running (XAMPP)
- Verify `.env` has correct database credentials

### **Issue: npm install fails**
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

---

## 🚀 Next Steps

1. **Explore the code** - Read the key files mentioned in structure
2. **Test the API** - Make requests to different endpoints
3. **Create test data** - Add more users via API or Tinker
4. **Review documentation** - Check the markdown files for details
5. **Review security** - Routes are unprotected in development (add auth for production)

---

## 📞 Need Help?

- Check `.md` files for detailed documentation
- Review test data in `database/seeders/DatabaseSeeder.php`
- Check `routes/web.php` for all available endpoints
- View `app/Http/Controllers/` for implementation details
- Run `php artisan tinker` to explore database

---

## ✅ Verification Checklist

- [ ] Composer installed: `composer install`
- [ ] NPM installed: `npm install`
- [ ] Database migrated: `php artisan migrate:fresh --seed`
- [ ] Laravel running: `php artisan serve`
- [ ] Frontend running: `npm run dev`
- [ ] Visiting http://localhost:8000 shows users
- [ ] Users have role badges (Red, Orange, Blue)
- [ ] Can see groups and assignments

---

**Ready to go!** Start with `php artisan migrate:fresh --seed` and `php artisan serve` 🎉

Questions? Check the documentation files or explore the code! 🚀

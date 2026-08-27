# sote

## Requirements

- PHP = 8.2
- Composer
- Node.js >= 18
- phpMyAdmin

## Before Running

Verify PHP version matches (PHP 8.2):

```bash
php -v                                    # Check your PHP version (if PHP is in PATH)
```

If PHP is not in PATH, use XAMPP's PHP directly:

```bash
# macOS
/Applications/XAMPP/xamppfiles/bin/php -v

# Linux
/opt/lampp/bin/php -v

# Windows
C:\xampp\php\php.exe -v
```

## Setup

** Before running the setup, make sure MySQL and Apache are running via XAMPP Control Panel.**

Run the init script to set up everything in one step (must be run in **Git Bash** on Windows):

```bash
bash init.sh
# or
npm run init
```

This will automatically:

1. Initialize and update git submodules
2. Build the tai-grid library
3. Install PHP dependencies (composer install)
4. Copy `.env.example` to `.env` and generate the app key (only on first run)
5. Run database migrations and seeders
6. Install frontend dependencies

## Code Formatting

This project uses **Prettier** for code formatting. VSCode will automatically format your code on save if you have the Prettier extension installed.

### Prettier Configuration

The following formatting rules are enforced:

- **Indentation**: 2 spaces
- **Tabs**: Disabled (spaces only)
- **Line Length**: 150 characters per line

These settings are configured in `.prettierrc` and will be applied automatically when you save files.

### Setup in VSCode

1. Install the **Prettier** extension (ID: `esbenp.prettier-vscode`)
2. Install the **PHP Intelephense** extension (ID: `bmewburn.vscode-intelephense-client`)
3. Set it as your default formatter:
   - Open VSCode Settings
   - Search for "Default Formatter"
   - Select "Prettier - Code formatter"
4. Enable "Format On Save" if desired

## Internationalisation (i18n)

The app uses **i18next** and **react-i18next** for multi-language support.

### Supported Languages

| Code | Language          | File                                |
| ---- | ----------------- | ----------------------------------- |
| `en` | English (default) | `resources/js/locales/en/common.ts` |
| `fi` | Finnish           | `resources/js/locales/fi/common.ts` |
| `sv` | Swedish           | `resources/js/locales/sv/common.ts` |

The selected language is saved in **localStorage** under the key `app_language` and persists across page reloads.

### How It Works

The i18n configuration lives in `resources/js/i18n.ts`. It is imported once in the app entry point and automatically detects the saved language from localStorage, falling back to English if none is set.

To use translations in a component:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('some.key')}</h1>;
}
```

### Translation File Structure

All translation keys are nested objects inside `resources/js/locales/{lang}/common.ts`:

```
resources/js/locales/
├── en/
│   └── common.ts   ← English translations
└── fi/
│    └── common.ts   ← Finnish translations
└── sv/
    └── common.ts   ← Swedish translations
```

Example structure:

```ts
const enCommon = {
  grid: {
    loading: 'Loading...',
    add: 'Add',
  },
  groups: {
    managementTitle: 'Groups Management',
  },
};
```

Used in code as: `t('grid.loading')`, `t('groups.managementTitle')`

### Adding a New Translation Key

1. Add the key to `resources/js/locales/en/common.ts`
2. Add the same key with a translated value to `resources/js/locales/fi/common.ts` and also in `resources/js/locales/sv/common.ts`.
3. Use it in a component with `t('your.new.key')`

> All language files must always have the same keys. If a key is missing in a language file, i18next will fall back to English.

### Adding a New Language

1. Create a new folder: `resources/js/locales/{lang}/common.ts`
2. Copy `en/common.ts` as a template and translate all values
3. Import it in `resources/js/i18n.ts`:

```ts
import svCommon from './locales/sv/common';

i18n.init({
  resources: {
    en: { translation: enCommon },
    fi: { translation: fiCommon },
    sv: { translation: svCommon }, // ← add here
  },
  supportedLngs: ['en', 'fi', 'sv'], // ← add language code
});
```

4. Add the language option to the `LanguageSwitcher` component

### Language Switcher

The `LanguageSwitcher` component (located in `resources/js/components/`) renders a dropdown that calls `i18n.changeLanguage(code)` and saves the choice to localStorage automatically.

## Running the app

Run the following command in a terminal:

```bash
composer run dev
```

Open in browser: http://localhost:8000

## Database issues

If you get constraint errors or unexpected behavior after pulling new changes, your local database may be out of date. To reset it completely:

```bash
php artisan migrate:fresh --seed
```

> ⚠️ The seeding will add 100 users for testing purposes. This command may take a while or you might run into performance issues. ⚠️

> ⚠️ This will **delete all existing data** and reseed the database from scratch.

## Test users

| Email             | Password    | Role    |
| ----------------- | ----------- | ------- |
| admin@example.com | admin123    | Admin   |
| jane@example.com  | password123 | Manager |
| bob@example.com   | password123 | Nurse   |

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

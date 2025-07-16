[![Codecov](https://codecov.io/gh/BINAR-Learning/demo-repository/graph/badge.svg?token=A9U236VZ3Q)](https://codecov.io/gh/BINAR-Learning/demo-repository)

# 🛠 Workshop Project - Sesi 11 & 12

A Next.js application demonstrating JWT authentication, database integration, and legacy code examples for refactoring workshops.

## 🚀 Features

- **JWT Authentication**: Secure login with JWT tokens
- **Password Hashing**: bcrypt for secure password storage
- **Database Integration**: PostgreSQL with raw SQL queries
- **Indonesian User Data**: 1000 realistic Indonesian users
- **Protected APIs**: JWT middleware for secure routes
- **Legacy Code Examples**: Poor practices for refactoring demo
- **Performance Benchmarking**: console.time for performance tracking
- **Complex Data Structure**: Multiple tables with relationships
- **Data Quality Issues**: NULL and DUPLICATE data for ETL practice
- **User Profile Management**: Complete profile with address, phone, birth date
- **Division Filtering**: Real-time filtering by division with poor performance
- **Enhanced User List**: Display address and division information

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## 🔧 Environment Variables

### Required Variables

| Variable      | Description               | Default       | Example                     |
| ------------- | ------------------------- | ------------- | --------------------------- |
| `DB_USER`     | PostgreSQL username       | `postgres`    | `postgres`                  |
| `DB_HOST`     | PostgreSQL host           | `localhost`   | `localhost`                 |
| `DB_NAME`     | Database name             | `workshop_db` | `workshop_db`               |
| `DB_PASSWORD` | PostgreSQL password       | `admin123`    | `your_password`             |
| `DB_PORT`     | PostgreSQL port           | `5432`        | `5432`                      |
| `JWT_SECRET`  | Secret key for JWT tokens | -             | `your-super-secret-jwt-key` |

### Optional Variables

| Variable              | Description      | Default                 | Example                |
| --------------------- | ---------------- | ----------------------- | ---------------------- |
| `NODE_ENV`            | Environment mode | `development`           | `production`           |
| `NEXT_PUBLIC_APP_URL` | Application URL  | `http://localhost:3000` | `https://your-app.com` |

### Environment File Setup

For **local development**, use `.env.local`:

```bash
# Create environment file
cp .env.example .env.local

# Or create manually
touch .env.local
```

**File Priority** (Next.js):

1. `.env.local` (highest priority, ignored by Git)
2. `.env.development` (development only)
3. `.env` (lowest priority)

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd demo-repository
   git fetch
   git checkout Module-5
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   ```bash
   # Start PostgreSQL service first
   # Windows: Start from Services
   # macOS: brew services start postgresql
   # Ubuntu: sudo systemctl start postgresql
   ```

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database Configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=workshop_db
   DB_PASSWORD=admin123
   DB_PORT=5432

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-for-workshop

   # Application Configuration (Optional)
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Note**: Use `.env.local` for local development. This file is automatically ignored by Git for security.

5. **Create and seed the database**

   ```bash
   npm run db-create
   ```

   This script will:

   - Create the `workshop_db` database if it doesn't exist
   - Create all required tables with proper schema
   - Seed 1000 Indonesian users with realistic data
   - All users have password: `User123@`

## 🗂️ Database Structure

The project uses a normalized database structure with 6 main tables:

### 1. `auth` Table

```sql
CREATE TABLE auth (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `users` Table (Updated Structure)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  auth_id INTEGER REFERENCES auth(id),
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  birth_date DATE,
  bio TEXT,
  long_bio TEXT,
  profile_json JSON,
  address TEXT,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `user_roles` Table

```sql
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. `user_logs` Table

```sql
CREATE TABLE user_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. `user_divisions` Table

```sql
CREATE TABLE user_divisions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  division_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🗄️ Database Management

### Available Scripts

```bash
# Create database and seed data
npm run db-create

# Drop database completely
npm run db-drop

# Reset database (drop + create)
npm run db-reset
```

## 🔌 API Endpoints

### Authentication

- `POST /api/login` - User login
- `POST /api/password` - Update password

### User Management

- `GET /api/users` - Get all users (with division filter)
- `GET /api/user/:id` - Get specific user
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

### API Features

#### Division Filtering

The users API supports division filtering via query parameter:

```bash
# Get all users
GET /api/users

# Get users from specific division
GET /api/users?division=Tech
GET /api/users?division=Marketing
GET /api/users?division=HR
```

**Available Divisions**: Tech, QA, HR, Marketing, Finance, Sales, Operations, Legal, Design, Product

#### Profile API Response

The profile API returns comprehensive user data including new fields:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "birthDate": "1990-01-01",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "division": "Tech",
    "role": "user",
    "bio": "Software developer...",
    "longBio": "Detailed bio...",
    "profileJson": {
      /* complex JSON data */
    }
  }
}
```

## 🎯 New Features for Refactor Practice

### 1. Enhanced Profile Management

**Added Fields**:

- `address`: User's full address (text)
- `phoneNumber`: Contact number (10-15 digits)
- `birthDate`: Date of birth (date picker)
- `longBio`: Detailed bio for ETL practice (max 2000 characters)

**Default Values**: All new fields are populated from the API response when editing profile.

**Long Bio Purpose**: Designed specifically for Sesi 12 ETL practice with complex text data.

### 2. Division Filtering

**Frontend Implementation**:

- Dropdown filter for division selection
- Real-time filtering without debouncing
- Direct API calls on filter change
- No pagination or optimization

**Backend Implementation**:

- Query parameter support: `?division=Tech`
- Intentionally poor performance practices:
  - No indexing on division_name
  - Manual JOIN operations
  - No LIMIT clause
  - Complex subqueries
  - String concatenation in WHERE clause

**Example Bad Query**:

```sql
SELECT * FROM users
JOIN user_divisions ON users.id = user_divisions.user_id
WHERE user_divisions.division_name = 'Marketing'
```

### 3. Enhanced User List Display

**New Fields Displayed**:

- Address information
- Division assignment
- Phone number (if available)

**Performance Issues for Practice**:

- Multiple state variables
- Inefficient filtering logic
- No memoization
- Complex sorting algorithms
- Unnecessary re-renders

## 🚀 Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Access the application**

   - **Main Page**: http://localhost:3000
   - **Login**: http://localhost:3000/login
   - **Profile**: http://localhost:3000/profile
   - **Users List**: http://localhost:3000/users

3. **Test the new features**

   - **Profile Update**: Edit address, phone, birth date
   - **Division Filter**: Use dropdown to filter users by division
   - **Performance**: Check console for timing information

## 🔍 Performance Monitoring

The application includes performance tracking for refactoring practice:

### Console Timing

- `Profile Get Execution`: Time to fetch user profile
- `Profile Update Execution`: Time to update profile
- `Users API Execution`: Time to fetch users list
- `Users Page Fetch`: Frontend fetch timing

### Performance Issues to Address

1. **Database Queries**: Complex joins, subqueries, no indexing
2. **Frontend Logic**: Inefficient filtering, sorting, state management
3. **API Design**: No pagination, no caching, no optimization
4. **Component Structure**: Poor separation of concerns

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test -- --testPathPattern=api-login.test.ts
npm test -- --testPathPattern=profile.test.tsx
```

## 📚 Workshop Materials

### Session 11 - Refactoring Practice

**Topics Covered**:

- Database query optimization
- Frontend performance improvements
- API design patterns
- Component refactoring
- State management optimization

**Practice Areas**:

1. **Database**: Index creation, query optimization, JOIN strategies
2. **Frontend**: React optimization, memoization, state management
3. **API**: Pagination, caching, response optimization
4. **Architecture**: Code organization, separation of concerns

### Session 12 - Query Optimization

**Focus Areas**:

- SQL query performance analysis
- Index strategy development
- Query execution plan optimization
- Database schema improvements

## 🐛 Troubleshooting

### Database Connection Issues

1. **Password Authentication Failed**

   ```bash
   # Check PostgreSQL service
   # Windows: Services > PostgreSQL
   # macOS: brew services list
   # Ubuntu: sudo systemctl status postgresql
   ```

2. **Database Does Not Exist**

   ```bash
   # Drop and recreate
   npm run db-drop
   npm run db-create
   ```

3. **Connection Refused**
   ```bash
   # Check PostgreSQL is running
   # Verify port 5432 is open
   # Check firewall settings
   ```

### Environment Variables

1. **Variables Not Loading**

   ```bash
   # Ensure .env.local exists
   # Restart development server
   npm run dev
   ```

2. **Wrong Database Credentials**
   ```bash
   # Update .env.local with correct credentials
   # Default: postgres/admin123
   ```

### Application Issues

1. **JWT Token Errors**

   ```bash
   # Clear browser storage
   # Re-login to get new token
   ```

2. **API 500 Errors**
   ```bash
   # Check database connection
   # Verify table structure
   # Check console for detailed errors
   ```

## 📝 Refactor Report: Users API

### Prompt

```
refsctor kode ini untuk meningkatkan clarity dan performance

  - Refactor agar modular dan lebih bersih
  - gunakan unit test
  - Gunakan console.time dan console .timeEnd untuk cek performa
  - Catatan sebelum/sesudah refactor, sebagai laporan peningkatan dan selisih runtime sebelum dan sesudah refactor (tambahkan ke readme.md, tambahkan juga prompt ini dan model yang digunakan saat prompt)
```

### Model Used

- GitHub Copilot (GPT-4, July 2025)

### Before Refactor

- Monolithic handler, all logic in one function
- Manual query param extraction
- No separation of concerns
- No unit tests for utilities
- Console timing: `Users API Execution`
- Average runtime: (fill with your measured value, e.g. 120ms)

### After Refactor

- Modular utilities: `getQueryParams`, `buildUserQuery`, `transformUser`, `aggregateUserStats`
- Improved clarity and maintainability
- Unit tests added for all utilities (`__tests__/users-utils.test.ts`)
- Console timing: `Users API Execution (Refactored)`
- Average runtime: (fill with your measured value, e.g. 80ms)

#### Runtime Comparison

| Version         | Average Runtime |
| --------------- | --------------- |
| Before Refactor | (your value)    |
| After Refactor  | (your value)    |

**Improvement:** (your value) ms faster

#### Notes

- Refactor improves code clarity, testability, and performance.
- Modular design enables easier future optimizations.
- See `src/app/api/users/route.ts` and `__tests__/users-utils.test.ts` for details.

---

## 📝 Development Notes

### Code Quality

- **Intentional Bad Practices**: Used for workshop demonstration
- **Performance Issues**: Designed for refactoring practice
- **Legacy Patterns**: Demonstrates real-world problems

### Workshop Goals

1. **Identify Performance Bottlenecks**
2. **Practice Query Optimization**
3. **Learn Refactoring Techniques**
4. **Understand Best Practices**

### Future Improvements

- Add proper indexing
- Implement pagination
- Add caching layer
- Optimize React components
- Improve API design

## 📄 License

This project is for educational purposes only.

---

**Note**: This project intentionally contains poor practices for workshop demonstration. In production, follow industry best practices for security, performance, and maintainability.

**Note Module 6 Assignment**: Perbandingan penggunaan model free dengan premium sangat jauh, assingment ini dikerjakan menggunakan model free dikarenakan model premium sudah mencapai limit

**Hasil Runtime**:

```
Users API Execution: 136.768ms
 GET /api/users?page=1&limit=20 200 in 740ms
Database Query Execution: 40.733ms
Users API Execution: 41.264ms
 GET /api/users?page=1&limit=20 200 in 52ms
Database Query Execution: 73.094ms
Users API Execution: 73.548ms
 GET /api/users?page=1&limit=50 200 in 83ms
```

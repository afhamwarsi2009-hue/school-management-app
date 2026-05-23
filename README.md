# Gurugram Public School Management App

Modern GPS school website with a React frontend, Express API, JWT login, Microsoft SQL Server persistence, admin operations, contact enquiries, notices, fees, attendance, homework, and results.

## Folder Structure

```text
school-management-app/
  backend/
    app.js
    server.js
    admin-panel/
    authentication/
    config/
    controllers/
    database/
    middleware/
    models/
    payment-gateway/
    routes/
    services/
    uploads/
    utilities/
    validation/
  frontend/
    authentication/
    components/
    context/
    dashboard/
    forms/
    hooks/
    layouts/
    pages/
    routes/
    services/
    styles/
    utils/
  database/
    schema.mssql.sql
    sample-queries.mssql.sql
    SQL scripts/
    stored procedures/
  admin-panel/
  student-portal/
  parent-portal/
```

## Install

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Backend dependencies used by the API:

```bash
npm install --prefix backend express cors dotenv mssql jsonwebtoken bcryptjs joi nodemailer
```

## Environment

Create `backend/.env` from `backend/.env.example`:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
SCHOOL_NAME=Gurugram Public School
SCHOOL_SHORT_NAME=GPS

DB_USER=SchoolManagement
DB_PASSWORD=School@$
DB_SERVER=AFHAMWARSI
DB_DATABASE=school_management
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_AUTO_INITIALIZE=true

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=8h

ADMIN_NAME=GPS Admin
ADMIN_EMAIL=gurugarampublic.co.in@outlook.com
ADMIN_PASSWORD=Admin@12345

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Gurugram Public School <gurugarampublic.co.in@outlook.com>
CONTACT_TO_EMAIL=gurugarampublic.co.in@outlook.com
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## SQL Setup

Run `database/schema.mssql.sql` in SSMS against SQL Server `AFHAMWARSI`. The backend also auto-creates the database and tables when `DB_AUTO_INITIALIZE=true`.

Tables created:

- `students`
- `admins`
- `contact_enquiries`
- `fees`
- `payments`
- `attendance`
- `homework`
- `results`
- `notices`
- `admissions`
- `events`

Create or refresh the admin login:

```bash
npm run create:admin --prefix backend
```

Default admin from `.env`:

```json
{
  "email": "gurugarampublic.co.in@outlook.com",
  "password": "Admin@12345",
  "role": "admin"
}
```

## Run

Backend only:

```bash
npm run dev --prefix backend
```

Frontend only:

```bash
npm run dev --prefix frontend
```

Both together:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/health`
- API health: `http://localhost:5000/api/health`

## Main APIs

Base URL: `http://localhost:5000/api`

```http
POST /auth/login
POST /students/register
POST /contact
GET /contact
GET /students
POST /students
DELETE /students/:id
GET /payments
POST /payments
GET /notices
POST /notices
GET /attendance
POST /attendance
GET /homework
POST /homework
GET /results
POST /results
```

Student login:

```json
{
  "admission_number": "GPS-2026-001",
  "password": "Student@123",
  "role": "student"
}
```

Student self-registration:

```json
{
  "admission_number": "GPS-2026-001",
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "class": "10-A",
  "roll_number": "10A-01",
  "password": "Student@123"
}
```

Admin-protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## WordPress Later

Keep this Express backend as the permanent data/API layer. When moving the public website to WordPress, add the WordPress domain to `CLIENT_ORIGIN`, then call these same API endpoints from a custom plugin, theme JavaScript, or shortcode handlers. Do not move JWT secrets or SQL credentials into WordPress frontend code; keep them in the Node backend `.env`.


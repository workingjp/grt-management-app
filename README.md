# Group Reporting Template (GRT) Management Application

A full-stack monorepo for managing Group Reporting Templates, template accounts, company chart of accounts, and account mappings. Built with Angular and an Express/MongoDB API.

## Project Structure

```
grt-management-app/
├── backend/                  # Node.js + Express REST API
│   ├── scripts/
│   │   └── seedCompanyAccounts.js
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Error handling, async wrapper
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   └── services/         # Business logic
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                 # Angular standalone application
│   ├── .env.example          # Frontend environment template
│   ├── proxy.conf.js         # Dev API proxy (reads .env)
│   ├── src/app/
│   │   ├── features/templates/
│   │   │   ├── dashboard/
│   │   │   ├── template-form/
│   │   │   └── mapping/
│   │   ├── models/
│   │   ├── services/
│   │   └── shared/
│   └── package.json
└── README.md
```

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Angular 22 (standalone components)  |
| UI       | Angular CDK (dialog, drag-and-drop) |
| Backend  | Node.js, Express 5                  |
| Database | MongoDB, Mongoose                   |
| Tooling  | npm, nodemon, dotenv                |

---

## Prerequisites

Before running the application from a fresh clone, ensure the following are installed:

| Requirement | Version / Notes                                      |
|-------------|------------------------------------------------------|
| Node.js     | v18 or later recommended                             |
| npm         | v9 or later (comes with Node.js)                     |
| MongoDB     | Local instance or MongoDB Atlas connection string    |
| Git         | Required to clone the repository                     |

---

## Setup from a Fresh Clone

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd grt-management-app
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values (see [Backend Environment Variables](#backend-environment-variables) below).

Start MongoDB locally, then seed the company chart of accounts:

```bash
npm run seed scripts/seedCompanyAccounts.js
```

Start the API:

```bash
npm run dev
```

The backend runs at **http://localhost:3000** by default.

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

The Angular app runs at **http://localhost:4200** and opens the dashboard at `/templates`.

Edit `frontend/.env` if your backend runs on a different host or port (see [Angular Environment Configuration](#angular-environment-configuration)).

### 4. Verify the stack

| Check            | Command / URL                              | Expected Result        |
|------------------|--------------------------------------------|------------------------|
| API health       | `curl http://localhost:3000/api/health`    | `{ "status": "ok" }`   |
| Company accounts | `curl http://localhost:3000/api/company-accounts` | 6 seeded accounts |
| Frontend         | http://localhost:4200/templates            | Dashboard loads        |

---

## Run Commands

### Backend (`backend/`)

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `npm install`  | Install dependencies                             |
| `npm run dev`  | Start API with nodemon (auto-reload)             |
| `npm start`    | Start API in production mode                     |
| `npm run seed scripts/seedCompanyAccounts.js` | Seed company chart of accounts (see below) |

### Frontend (`frontend/`)

| Command         | Description                                      |
|-----------------|--------------------------------------------------|
| `npm install`   | Install dependencies                             |
| `npm start`     | Start dev server at http://localhost:4200        |
| `npm run build` | Production build to `dist/frontend`              |

### Run both services (typical development workflow)

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

---

## Backend Environment Variables

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

| Variable      | Required | Default                                      | Description                          |
|---------------|----------|----------------------------------------------|--------------------------------------|
| `PORT`        | No       | `3000`                                       | HTTP port the Express server listens on |
| `MONGODB_URI` | **Yes**  | `mongodb://localhost:27017/grt-management`   | MongoDB connection string            |

### Example `.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/grt-management
```

### Notes

- `MONGODB_URI` is required. The server will not start without it.
- For MongoDB Atlas, replace the URI with your cluster connection string.
- Never commit `backend/.env` to version control. It is listed in `backend/.gitignore`.

---

## Seed Script

The seed script populates the **Company Chart of Accounts** used by the mapping screen.

### Location

`backend/scripts/seedCompanyAccounts.js`

### Run

From the `backend/` directory:

```bash
npm run seed scripts/seedCompanyAccounts.js
```

| Command | Script file | Description |
|---------|-------------|-------------|
| `npm run seed scripts/seedCompanyAccounts.js` | `scripts/seedCompanyAccounts.js` | Seed company chart of accounts |

> **Note:** `npm run seed` expects the script path relative to `backend/`. Example: `npm run seed scripts/seedCompanyAccounts.js`

### Behaviour

1. Connects to MongoDB using `MONGODB_URI` from `backend/.env`
2. **Clears** all existing `CompanyAccount` records
3. Inserts the following accounts:

| Name                 | Category  |
|----------------------|-----------|
| Revenue              | Income    |
| Cost of Goods Sold   | Expense   |
| Marketing Expenses   | Expense   |
| Salaries             | Expense   |
| Office Rent          | Expense   |
| Software Licenses    | Expense   |

### Expected output

```
MongoDB connected
Seeded 6 company accounts.
```

Re-run the seed at any time to reset company accounts to the defaults above.

---

## Angular Environment Configuration

### Setup

```bash
cd frontend
cp .env.example .env
```

| Variable        | Required | Default                    | Description                                      |
|-----------------|----------|----------------------------|--------------------------------------------------|
| `API_URL`       | No       | `http://localhost:3000`    | Backend URL used by the dev-server proxy         |
| `API_BASE_PATH` | No       | `/api`                     | API prefix used by Angular HTTP services         |

### Example `frontend/.env`

```env
API_URL=http://localhost:3000
API_BASE_PATH=/api
```

### How it works

1. `npm start` / `npm run build` runs `scripts/generate-env.js`, which reads `frontend/.env` and generates `src/environments/environment.ts`.
2. Angular services use `environment.apiBasePath` for API calls (e.g. `/api/templates`).
3. `proxy.conf.js` reads `API_URL` and `API_BASE_PATH` from `.env` and proxies dev requests to the backend.

`frontend/.env` is gitignored. Commit `.env.example` only.

### Production

1. Set `API_URL` and `API_BASE_PATH` in `frontend/.env` (or CI environment variables before build).
2. Run `npm run build` — `environment.ts` is generated at build time.
3. Serve `dist/frontend` and reverse-proxy `API_BASE_PATH` to the Express backend, **or** deploy both on the same origin.

---

## Application Routes (Frontend)

| Route                      | Screen              | Description                              |
|----------------------------|---------------------|------------------------------------------|
| `/`                        | Redirect            | Redirects to `/templates`                |
| `/templates`               | Dashboard           | List all templates with mapping counts   |
| `/templates/new`           | Create Template     | Create template and GRT accounts         |
| `/templates/:id/edit`      | Edit Template       | Edit template name and GRT accounts      |
| `/templates/:id/mapping`     | Account Mapping     | Drag-and-drop COA mapping                |

---

## API Endpoints (Backend)

### Health

| Method | Endpoint        | Description     |
|--------|-----------------|-----------------|
| GET    | `/api/health`   | Health check    |

### Templates

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| GET    | `/api/templates`                | List templates with mapped/unmapped counts |
| POST   | `/api/templates`                | Create template (`group` defaults to SaaS) |
| GET    | `/api/templates/:id`            | Get template with template accounts      |
| PUT    | `/api/templates/:id`            | Update template name                     |
| DELETE | `/api/templates/:id`            | Delete template, accounts, and mappings  |
| POST   | `/api/templates/:id/accounts`   | Add template account                     |
| GET    | `/api/templates/:id/mappings`     | Get mappings for a template              |

### Template Accounts

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| DELETE | `/api/template-accounts/:id`    | Delete template account and its mappings |

### Company Accounts

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/api/company-accounts`    | List seeded COA accounts       |

### Mappings

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/mappings?templateId=:id` | List mappings (query param variant) |
| POST   | `/api/mappings`       | Create mapping                           |
| DELETE | `/api/mappings/:id`   | Delete mapping                           |

---

## Assignment Feature Mapping

This table maps assignment requirements to the implemented solution.

| # | Requirement | Implementation |
|---|-------------|----------------|
| 1 | **Monorepo structure** (`frontend/`, `backend/`) | `grt-management-app/frontend` and `grt-management-app/backend` |
| 2 | **MongoDB connection** | `backend/src/config/database.js`, required `MONGODB_URI` in `.env` |
| 3 | **Mongoose models** — Template, TemplateAccount, CompanyAccount, Mapping | `backend/src/models/` with timestamps and indexes |
| 4 | **Seed script** — Company accounts with `npm run seed scripts/seedCompanyAccounts.js` | `backend/scripts/seedCompanyAccounts.js` |
| 5 | **REST APIs** — Templates CRUD | `GET/POST /api/templates`, `GET/PUT/DELETE /api/templates/:id` |
| 6 | **REST APIs** — Template accounts | `POST /api/templates/:id/accounts`, `DELETE /api/template-accounts/:id` |
| 7 | **REST APIs** — Company accounts | `GET /api/company-accounts` |
| 8 | **REST APIs** — Mappings | `GET /api/templates/:id/mappings`, `POST /api/mappings`, `DELETE /api/mappings/:id` |
| 9 | **Mapped / unmapped counts** on dashboard | Aggregation in `template.service.js`; displayed on dashboard table |
| 10 | **Dashboard** — list, create, edit, delete, map | `/templates` with action buttons and empty/loading states |
| 11 | **Create / Edit Template** — name, group (SaaS), GRT accounts | `/templates/new`, `/templates/:id/edit` with reactive forms |
| 12 | **Mapping screen** — drag company account onto template account | `/templates/:id/mapping` with Angular CDK drag-and-drop |
| 13 | **Cascade delete** — template deletes accounts and mappings | `deleteTemplate` in `backend/src/services/template.service.js` |
| 14 | **Validation and error handling** | `AppError`, `errorHandler` middleware; frontend validation and API error messages |
| 15 | **UX polish** — spinners, toasts, confirmations, responsive layout | Shared spinner, snackbar, confirm dialogs across all screens |

---

## Data Models

### Template

| Field     | Type     | Notes                |
|-----------|----------|----------------------|
| name      | String   | Required             |
| group     | String   | Default: `"SaaS"`    |
| createdAt | Date     | Mongoose timestamp   |
| updatedAt | Date     | Mongoose timestamp   |

### TemplateAccount

| Field      | Type     | Notes                |
|------------|----------|----------------------|
| templateId | ObjectId | Ref: Template        |
| name       | String   | Required             |
| createdAt  | Date     | Mongoose timestamp   |
| updatedAt  | Date     | Mongoose timestamp   |

### CompanyAccount

| Field     | Type     | Notes                |
|-----------|----------|----------------------|
| name      | String   | Required             |
| category  | String   | Optional             |
| createdAt | Date     | Mongoose timestamp   |
| updatedAt | Date     | Mongoose timestamp   |

### Mapping

| Field             | Type     | Notes                          |
|-------------------|----------|--------------------------------|
| templateAccountId | ObjectId | Ref: TemplateAccount           |
| companyAccountId  | ObjectId | Ref: CompanyAccount            |
| createdAt         | Date     | Mongoose timestamp             |
| updatedAt         | Date     | Mongoose timestamp             |

Unique constraint on `(templateAccountId, companyAccountId)` prevents duplicate mappings.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `MONGODB_URI is not set` | Create `backend/.env` from `.env.example` and set `MONGODB_URI` |
| `connect ECONNREFUSED 127.0.0.1:27017` | Start local MongoDB or use a valid Atlas URI |
| Frontend API calls fail with 404 | Ensure backend is running; `API_URL` in `frontend/.env` must match backend `PORT` |
| Mapping screen has no company accounts | Run `npm run seed scripts/seedCompanyAccounts.js` in `backend/` |
| Port 3000 or 4200 already in use | Update `PORT` in `backend/.env` and `API_URL` in `frontend/.env` |


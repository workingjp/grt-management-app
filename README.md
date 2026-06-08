# GRT Management Application

Group Reporting Template (GRT) Management Application — monorepo with an Angular frontend and Express/MongoDB backend.

## Project Structure

```
grt-management-app/
├── frontend/     # Angular application
├── backend/      # Express.js API
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (required when database features are added)

## Backend

### Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set `PORT` and `MONGODB_URI` as needed. MongoDB is not required for the health check endpoint.

### Run

**Development** (with auto-reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The API runs at `http://localhost:3000` by default.

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ok"
}
```

## Frontend

### Setup

```bash
cd frontend
npm install
```

### Run

**Development server**:

```bash
npm start
```

The app runs at `http://localhost:4200` by default.

### Build

```bash
npm run build
```

## Running Both Services

Open two terminals:

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

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | Angular (latest)  |
| Backend  | Node.js, Express  |
| Database | MongoDB, Mongoose |

# Grocery Delivery App

Fresh full-stack foundation for a grocery delivery platform. The first milestone establishes React, Axios, Express, and MongoDB connectivity.

## Start

1. Copy `backend/.env.example` to `backend/.env` and add your MongoDB URI and JWT secret.
2. Copy `frontend/.env.example` to `frontend/.env` if the default API URL needs changing.
3. Run `npm install` from the repository root.
4. Run `npm run dev`.

The frontend runs on `http://localhost:5173`; the API runs on `http://localhost:5000`. Visit the frontend to see API and MongoDB connection status, or request `GET /api/health`.

## Scripts

- `npm run dev` — start frontend and backend together
- `npm run frontend` — start Vite only
- `npm run backend` — start Express with file watching
- `npm run build` — production frontend build
- `npm run start` — start Express in production mode

## Environment

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`.

Frontend: `VITE_API_URL`.

## Current milestone

The project structure, workspace configuration, API health endpoint, CORS, error handling, MongoDB connection module, Axios client, React routing, and connection-status UI are implemented. Commerce, authentication, admin, upload, and database-resource APIs are intentionally deferred until this connection milestone is confirmed.

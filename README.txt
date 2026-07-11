====================================================================
 ShopEasy — Full-Stack E-Commerce Platform
====================================================================

PROJECT OVERVIEW
--------------------------------------------------------------------
A complete full-stack e-commerce platform built as a capstone
project. Customers can browse, search, filter, sort, and paginate
products, leave reviews, and manage a shopping cart. Admins can
manage the product catalog and view store statistics. The system
uses role-based authentication (Customer / Admin), a PostgreSQL
database for structured/relational data, and MongoDB for reviews
and activity logs.

TECHNOLOGIES USED
--------------------------------------------------------------------
Frontend:
  - React 18 (Vite)
  - React Router v6
  - TanStack React Query (server state / caching)
  - React Context (auth state)
  - Axios
  - Vitest + React Testing Library + MSW (testing)

Backend:
  - Node.js + Express
  - PostgreSQL + Prisma ORM (users, categories, products, cart)
  - MongoDB + Mongoose (reviews, activity logs)
  - JWT authentication + bcrypt password hashing
  - Multer (product image upload)
  - Nodemailer (welcome email)
  - Jest + Supertest (unit + integration testing)

DevOps:
  - Docker (separate Dockerfiles for frontend/backend)
  - docker-compose (Postgres + MongoDB + backend + frontend)

--------------------------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------------------------
ecommerce-platform/
  backend/            Express API, Prisma schema, Mongo models, tests
  frontend/            React app, pages, components, tests
  docker-compose.yml    Runs the entire stack together
  README.txt            This file

--------------------------------------------------------------------
HOW TO RUN — OPTION 1: DOCKER (recommended, one command)
--------------------------------------------------------------------
Requirements: Docker + Docker Compose installed.

1. From the project root, run:

     docker compose up --build

2. Wait for all 4 services to start: postgres, mongo, backend,
   frontend.

3. Run the database migration + seed once, in a separate terminal
   (first time only):

     docker compose exec backend npx prisma migrate deploy
     docker compose exec backend node prisma/seed.js

   (Note: the backend Dockerfile's CMD already attempts to run
   migrate + seed automatically on container start, but if the
   Postgres container isn't fully ready yet on first boot, run the
   two commands above manually as a fallback.)

4. Open the app in your browser (see Project URLs below).

--------------------------------------------------------------------
HOW TO RUN — OPTION 2: MANUALLY (without Docker)
--------------------------------------------------------------------
Requirements: Node.js 20+, PostgreSQL running locally, MongoDB
running locally.

Backend:
  cd backend
  cp .env.example .env        (edit DATABASE_URL / MONGO_URI if needed)
  npm install
  npx prisma migrate dev --name init
  npx prisma generate
  npm run seed
  npm run dev                  (starts on http://localhost:5000)

Frontend (in a second terminal):
  cd frontend
  cp .env.example .env
  npm install
  npm run dev                  (starts on http://localhost:5173)

--------------------------------------------------------------------
RUNNING TESTS
--------------------------------------------------------------------
Backend (Jest unit tests + Supertest integration tests):
  cd backend
  npm test

Frontend (Vitest + React Testing Library + MSW):
  cd frontend
  npm test

--------------------------------------------------------------------
PROJECT URLS
--------------------------------------------------------------------
Frontend:            http://localhost:5173
Backend API:         http://localhost:5000/api
API health check:    http://localhost:5000/api/health
PostgreSQL:          localhost:5432 (user: postgres / pass: postgres)
MongoDB:             localhost:27017

--------------------------------------------------------------------
TEST ACCOUNT CREDENTIALS (created by the seed script)
--------------------------------------------------------------------
Admin account:
  email:    admin@shop.com
  password: Admin123!

Customer account:
  email:    customer@shop.com
  password: Customer123!

--------------------------------------------------------------------
IMPORTANT NOTES
--------------------------------------------------------------------
- Environment variables (DB URLs, JWT secret) are kept in .env files
  (see .env.example in both backend/ and frontend/) and are never
  hard-coded in source files.
- Product images are uploaded via Multer and stored in
  backend/uploads, served statically at /uploads/<filename>.
- Welcome emails use Nodemailer. If no SMTP_* env vars are set, it
  falls back to a JSON transport (safe for local/dev use — it
  builds a real email object but does not require a mail server).
- The cart is persisted server-side per logged-in user (not just in
  local state), so it survives refreshes and logins from another
  device.
- Reviews and activity logs are stored in MongoDB; everything else
  (users, categories, products, cart items) is stored in PostgreSQL
  via Prisma.
- Before grading/demoing: run `docker compose up`, then walk through
  register -> login -> browse/search/filter products -> add to cart
  -> checkout the cart page -> log in as admin -> create a product
  -> view stats, to confirm everything is wired end-to-end.

ShopEasy

A full-stack e-commerce platform built with React, Express, PostgreSQL, MongoDB, Prisma, and Docker.

⸻

Features

Customer

* Register and log in
* Browse products
* Search, filter, and sort products
* Pagination
* Shopping cart
* Product reviews
* JWT authentication

Admin

* Create, edit and delete products
* Manage categories
* View store statistics
* Role-based access control

⸻

Tech Stack

Frontend

* React 18
* Vite
* React Router v6
* TanStack Query
* Axios
* Context API
* Vitest
* React Testing Library
* MSW

Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Nodemailer

DevOps

* Docker
* Docker Compose

⸻

Project Structure:
ecommerce-platform/
│
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.txt
Requirements

Docker Installation

Install Docker Desktop:

* Windows
* macOS (Intel & Apple Silicon)
* Linux

After installation verify:
docker --version
docker compose version

Running with Docker (Recommended)

From the project root:
docker compose up --build

The first build may take several minutes.

Docker starts four services:

* PostgreSQL
* MongoDB
* Backend
* Frontend

⸻

Initialize the database

If this is your first time running the project:


docker compose exec backend npx prisma migrate deploy
docker compose exec backend node prisma/seed.js

Running without Docker

Backend:
cd backend

npm install

npx prisma db push

node prisma/seed.js

npm run dev

frontend:
cd frontend

npm install

npm run dev

Ports:

Frontend

http://localhost:5173

Backend

http://localhost:5001

Health Check

http://localhost:5001/api/health

PostgreSQL

localhost:5433

MongoDB

localhost:27017

Default Accounts

Administrator:
Email:
admin@shop.com

Password:
Admin123!

Customer:
Email:
admin@shop.com

Password:
Admin123!

Environment Variables

Backend
PORT=5000

DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ecommerce?schema=public

MONGO_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your-secret

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

Inside Docker these are automatically overridden to use Docker networking:
postgres:5432
mongo:27017
so do not change them inside the container.

Running Tests:

Backend:
cd backend

npm test

Frontend:
cd frontend

npm test

Demo Checklist

* Register
* Login
* Browse products
* Search
* Filter
* Sort
* Add items to cart
* View cart
* Log in as admin
* Create a product
* Edit a product
* Delete a product
* Verify product appears on the storefront
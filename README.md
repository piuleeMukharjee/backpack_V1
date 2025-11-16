Genie Backpack - Enterprise v1
==============================

What's included:
- React frontend with Buy Now, cart, search, admin user management.
- Node + Express backend with JWT auth, product uploads, orders, admin routes.
- Docker Compose to run MongoDB + backend + frontend.
- Seed script to populate sample users and products.
- Basic GitHub Actions CI workflow.

Quickstart (Docker):
1. unzip the project
2. run: docker-compose up --build
3. Frontend: http://localhost:3000
   Backend:  http://localhost:5000

Manual (local):
# Backend
cd backend
npm install
cp .env.example .env
# edit .env if needed
npm run seed
npm start

# Frontend
cd frontend
npm install
npm start

Seeded accounts:
- admin / password
- piulee / password  (seller)
- seller2 / password (seller)
- buyer1 / password  (buyer)

Notes:
- For production deploy, use MongoDB Atlas and set MONGODB_URI accordingly.
- Set a strong JWT_SECRET in production.
- Images are stored on the backend server at /uploads (Docker-compose persists them).

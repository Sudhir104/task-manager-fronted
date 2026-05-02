# TaskFlow - Team Task Manager
## A Full-Stack Project Management Web Application

---

## LIVE URLs

- Frontend (Vercel):  https://task-manager-fronted-jade.vercel.app
- Backend API (Railway): https://task-manager-backend-production-07c9.up.railway.app

---

## GITHUB REPOSITORIES

- Frontend: https://github.com/Sudhir104/task-manager-fronted
- Backend:  https://github.com/Sudhir104/task-manager-backend

---

## PROJECT OVERVIEW

TaskFlow is a full-stack Team Task Manager web application built as part of the Ethara.ai assignment.
It allows teams to create projects, assign and manage tasks, and track progress with role-based
access control (Admin/Member).

---

## FEATURES IMPLEMENTED

1. User Authentication
   - Signup with name, email, password and role selection (Admin/Member)
   - Login with JWT token
   - Protected routes (dashboard only accessible after login)

2. Role-Based Access Control
   - Admin: Can create/delete projects, manage members, create/delete tasks
   - Member: Can view projects, create tasks, update task status

3. Task Management
   - Create tasks with title, description, status, due date, project
   - Update task status (Todo / In Progress / Done)
   - Delete tasks
   - Search tasks by title
   - Overdue task highlighting (red border)

4. Project Management
   - Create and delete projects (Admin only)
   - View all projects assigned to user
   - Progress bar showing task completion percentage
   - Member count display

5. Dashboard Stats
   - Total Tasks
   - Completed Tasks
   - In Progress Tasks
   - Todo Tasks
   - Overdue Tasks
   - Total Projects

---

## TECH STACK

Frontend:
- React.js 18 (Vite)
- React Router DOM v6
- Axios
- Deployed on: Vercel

Backend:
- Node.js + Express.js v4
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled
- Deployed on: Railway

---

## API ENDPOINTS

Authentication:
- POST /api/auth/register  - Register new user
- POST /api/auth/login     - Login and get JWT token

Tasks:
- GET    /api/tasks            - Get all tasks
- POST   /api/tasks            - Create new task
- PATCH  /api/tasks/:id        - Update task status
- DELETE /api/tasks/:id        - Delete task
- GET    /api/tasks/dashboard  - Get dashboard statistics

Projects:
- GET    /api/projects              - Get all projects
- POST   /api/projects              - Create project (Admin only)
- DELETE /api/projects/:id          - Delete project (Admin only)
- POST   /api/projects/:id/members  - Add member (Admin only)

---

## ENVIRONMENT VARIABLES (Backend)

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_key
PORT=5000

---

## LOCAL SETUP INSTRUCTIONS

Backend:
1. git clone https://github.com/Sudhir104/task-manager-backend
2. cd task-manager-backend
3. npm install
4. Create .env file with MONGO_URI and JWT_SECRET
5. npm start
6. Server runs on http://localhost:5000

Frontend:
1. git clone https://github.com/Sudhir104/task-manager-fronted
2. cd task-manager-fronted
3. npm install
4. npm run dev
5. App runs on http://localhost:5173

---

## PROJECT STRUCTURE

Backend:
task-manager-backend/
- config/db.js               MongoDB connection
- controllers/
    authController.js        Signup/Login logic
    projectController.js     Project CRUD
    taskController.js        Task CRUD + Dashboard stats
- middleware/
    authMiddleware.js         JWT verification
    roleMiddleware.js         Role-based access control
- models/
    User.js
    Project.js
    Task.js
- routes/
    authRoutes.js
    projectRoutes.js
    taskRoutes.js
- server.js

Frontend:
task-manager-fronted/
- src/
    pages/
      Login.jsx
      Signup.jsx
      Dashboard.jsx           Tasks + Projects + Stats tabs
    services/
      api.js                  Axios with JWT interceptor
    App.jsx                   Routes
    main.jsx
- index.html
- vite.config.js
- server.js                   Express static server for production

---

## AUTHOR

Name: Sudhir Mathur
GitHub: https://github.com/Sudhir104

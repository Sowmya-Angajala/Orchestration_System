# 🚀 Collaborative Workflow Orchestration System

A full-stack MERN application that enables multiple users to collaboratively manage projects, tasks, and execution workflows with real-time updates, dependency handling, and conflict-safe operations.

---

## 🔗 Live Links

* 🌐 Frontend: https://your-frontend-url.onrender.com
* ⚙️ Backend: https://your-backend-url.onrender.com
* 📦 GitHub Repo: https://github.com/your-username/your-repo

---

## 🧠 Overview

This system acts as a **lightweight workflow orchestration engine** where:

* Users create and join projects
* Tasks can depend on other tasks
* Execution plans are computed based on constraints
* Multiple users collaborate in real-time
* Conflicts are handled safely using versioning

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Context API (State management)
* Socket.IO client

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* Socket.IO
* JWT Authentication
* bcrypt (password hashing)

---

## 🛠️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

Run server:

```bash
npm start
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏗️ Architecture Overview

### Backend Architecture

* MVC-like structure
* Routes handle API logic
* Models define schema (Task, Project, User)
* Middleware handles authentication

### Frontend Architecture

* Component-based structure
* Context API for authentication
* API layer for backend communication
* Socket integration for real-time updates

---

## 🔗 Dependency Logic

* Tasks can depend on multiple other tasks
* Before execution:

  * All dependencies must be **Completed**
* Cyclic dependencies are prevented at backend
* Dependency validation ensures correctness

---

## ⚡ Execution Logic

### Endpoint:

```
POST /projects/:projectId/compute-execution
```

### Rules:

* Tasks sorted by:

  * Priority (desc)
  * Estimated hours (asc)
* Only executable tasks are included
* Blocked tasks are excluded

---

## 📊 Simulation Approach

### Endpoint:

```
POST /projects/:projectId/simulate
```

### Input:

```json
{
  "availableHours": 8
}
```

### Logic:

* Select tasks within time constraint
* Maximize total priority
* Respect dependencies
* Exclude blocked tasks

### Output:

* executionOrder
* selectedTasks
* blockedTasks
* skippedTasks
* totalPriorityScore

---

## 🔄 Concurrency Handling (CRITICAL)

### Approach: Optimistic Concurrency Control

* Each task has `versionNumber`
* Every update must include version
* If mismatch:

  * Backend returns **409 Conflict**
  * Latest version is returned

### UI Handling:

* Shows conflict message
* Provides:

  * Refresh option
  * Retry option

---

## 🕒 Task Versioning

* Every update:

  * Saves previous version in `TaskHistory`
* History API:

```
GET /tasks/:id/history
```

* Enables audit + rollback capability

---

##  Real-Time Updates

Using **Socket.IO**

Events:

* taskCreated
* taskUpdated
* statusChanged

Frontend listens and updates UI instantly (no refresh required)

---

##  Authentication & Security

* JWT-based authentication
* Protected routes
* Password hashing using bcrypt
* Invite tokens:

  * Expire in 30 minutes
  * Generated securely

---

## 🔗 Invite System

* Generate invite link per project
* Token-based joining
* Prevent duplicate members
* Environment-based frontend URL handling

---

##  Assumptions & Tradeoffs

### Assumptions

* Users are authenticated before joining projects
* Tasks are relatively small in number (no pagination implemented)
* Single resourceTag conflict handling (basic level)

### Tradeoffs

* UI simplicity over complex design systems
* No advanced caching layer
* Basic retry logic (not exponential backoff)

---

## 🧪 Features Implemented

 Authentication (Login/Signup)
 Project creation & invite system
 Task CRUD operations
 Dependency management
 Execution engine
 Simulation engine
 Real-time updates (Socket.IO)
 Versioning & history
 Conflict handling UI
 Clean responsive UI

---

## 🎥 Walkthrough Video

https://drive.google.com/file/d/1ymk72I0GnQqEFwldG3g_NaYW-VLVH8pZ/view?usp=drive_link

## 🙌 Author

* Sowmya Angajala

---

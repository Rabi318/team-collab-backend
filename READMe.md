# Collaborative Workspace Backend

This is the backend repository for a collaborative workspace application, designed to facilitate team collaboration through shared documents, task management, and real-time chat.

---

## Deployed Link

🔗 [Live Frontend App](https://team-collab-backend-5n8m.onrender.com)

### 🚀 Demo Credentials

**Admin Account**  
📧 Email: `adi@gmail.com`  
🔐 Password: `123456`

**User Account**
📧 Email: `rabi@gmail.com`  
🔐 Password: `1234567`

## ✨ Features

### User Authentication

- Secure user registration, login, and profile management (name, avatar, password change).

### Workspace Management

- Create and manage multiple workspaces.
- Invite users to workspaces with different roles (admin, member, viewer).
- Update member roles and remove members (admin-only).
- Track member status (active, invited, removed).
- Delete workspaces (owner-only).

### Document Management

- Create and store documents within workspaces.
- _(Extendable for collaborative editing)_

### Task Management (Kanban-style)

- Create, view, update, and delete tasks within a workspace.
- Assign tasks to workspace members.
- Track task status (todo, in-progress, done).

### Real-time Chat

- Create public and private chat channels within a workspace.
- Send and receive messages in real-time using Socket.IO.
- Messages include sender information.
- Mark messages as seen.

---

## 🚀 Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Socket.IO**: Real-time bidirectional communication.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt.js**: Password hashing.
- **Multer**: File uploads (e.g., avatars).
- **Dotenv**: Manage environment variables.
- **Nodemon**: Dev server restarts on change.

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: [Download Node.js (LTS)](https://nodejs.org/)
- **MongoDB**: Install locally or use MongoDB Atlas.

### Installation

```bash
git clone <repository-url>
cd <repository-directory>
npm install  # or yarn install
```

## Environment Variables

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
JWT_LIFETIME=1d
UPLOAD_FOLDER=uploads
FRONTEND_URL=http://localhost:5173
```

## Running the Server

```bash
npm run dev  # or yarn dev
```

## 📚 API Endpoints

> All endpoints require JWT in the `Authorization: Bearer <token>` header unless noted otherwise.

### 🔐 User Authentication

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Log in a user.
- `PUT /api/auth/update-profile` – Update name/avatar _(requires multipart/form-data)_.
- `PUT /api/auth/change-password` – Change password.
- `GET /api/auth/users?email=<email>` – Get user by email _(for inviting)_.

---

### 🏢 Workspaces

- `POST /api/workspaces` – Create workspace.
- `GET /api/workspaces` – Get user's workspaces.
- `GET /api/workspaces/:workspaceId` – Get workspace details.
- `POST /api/workspaces/:workspaceId/invite` – Invite member _(Admin only)_.
- `PUT /api/workspaces/:workspaceId/role/:memberId` – Update member role _(Admin only)_.
- `PUT /api/workspaces/:workspaceId/status/:memberId` – Update member status.
- `DELETE /api/workspaces/:workspaceId/member/:memberId` – Remove member _(Admin only)_.
- `DELETE /api/workspaces/:workspaceId` – Delete workspace _(Owner only)_.

---

### 📄 Documents

- `POST /api/documents` – Create document.
- `GET /api/documents/:id` – Get document.
- `PUT /api/documents/:id` – Update document.
- `DELETE /api/documents/:id` – Delete document.

---

### ✅ Tasks

- `POST /api/tasks` – Create task.
- `GET /api/tasks/workspace/:workspaceId` – Get all tasks for a workspace.
- `PUT /api/tasks/:taskId` – Update task.
- `DELETE /api/tasks/:taskId` – Delete task.

---

### 💬 Chat

- `GET /api/chat/workspace/:workspaceId/channels` – Get channels in a workspace.
- `GET /api/chat/channel/:channelId/messages` – Get channel messages.
- `POST /api/chat/channels` – Create chat channel.

---

## 💬 Socket.IO Events

### 📤 Client Emits

#### `join-chat`

- **Payload**:

```json
{ "channelId": "string" }
```

- **Description: Joins a specific chat room.**

#### `send-message`

- **Payload**:

```json
{
  "channelId": "string",
  "senderId": "string",
  "content": "string",
  "type": "text" | "file"
}

```

#### `mark-seen`

- **Payload**:

```json
{
  "messageId": "string",
  "userId": "string"
}
```

### 📤 Send Emits

#### `receive-message`

- **Payload: Full message with sender info.**
- **Description: Emitted when a message is sent.**

#### `message-error`

- **Payload**:

```json
{
  "channelId": "string",
  "error": "string"
}
```

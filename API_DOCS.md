# API Documentation - TaskMaster Pro

## Authentication

### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Response (201)**:
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John Doe", "email": "..." }
}
```

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Response (200)**: Sets HTTP-only cookie `auth-token`.

---

## Tasks

### 3. Get All Tasks (Protected)
- **Endpoint**: `GET /api/tasks?page=1&limit=10&status=pending&search=project`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by `pending`, `in-progress`, `completed`, or `all`
  - `search`: Search string for title
- **Response (200)**:
```json
{
  "tasks": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### 4. Create Task (Protected)
- **Endpoint**: `POST /api/tasks`
- **Body**:
```json
{
  "title": "Clean Project Architecture",
  "description": "Implement repository pattern and clean controllers.",
  "status": "in-progress"
}
```
- **Response (201)**:
```json
{
  "_id": "...",
  "title": "Clean Project Architecture",
  ...
}
```

### 5. Update Task (Protected)
- **Endpoint**: `PUT /api/tasks/:id`
- **Body**:
```json
{
  "status": "completed"
}
```

### 6. Delete Task (Protected)
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response (200)**:
```json
{ "message": "Task deleted successfully" }
```

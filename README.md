# Tripincento Web API

Tripincento is a Web API that is the backend for a travel-centric hackathon project. This API allows users to manage their travel data, including tracking trips, logging in and signing up, and viewing user details. Below you'll find a detailed guide to using this API, with references to the specific code implementations in the project.

## Getting Started

### 0. Clone the Repository
Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- A package manager such as `npm`


### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory
Change into the project directory:
```bash
cd tripincento
```

### 3. Install Dependencies
Install required Node.js packages:
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and specify the following variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=tripincento
JWT_SECRET=your-secret-key
PORT=3000
```

### 5. Set Up the Database
- Ensure your MySQL server is running.
- Create a database named `tripincento` and run the SQL scripts provided in `database.sql` to initialize tables.

### 6. Start the Server
Launch the application:
```bash
npm start
```
The API will be available at `http://localhost:3000` or the port specified in your `.env` file.

## API Endpoints

### User Routes

#### POST `/user/login`
- **Description**: Allows a user to log in and receive a JWT token for authentication.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "token": JWT token
  }
  ```

---

#### POST `/user/signup`
- **Description**: Allows a new user to sign up and receive a JWT token for authentication.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "password_verify": "string",
    "first_name": "string",
    "last_name": "string",
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": JWT token,
    "user": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "first_name": "string",
      "last_name": "string"
    }
  }
  ```

---

#### GET `/user/me`
- **Description**: Retrieves the authenticated user's information.
- **Headers**:
  - `Authorization: Bearer <JWT token>`
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "first_name": "string",
      "last_name": "string"
    }
  }
  ```

---

#### GET `/user/top-travelers`
- **Description**: Retrieves the top 5 users who have travelled the most distance.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Top travellers retrieved successfully",
    "travellers": [
      {
        "id": "integer",
        "username": "string",
        "first_name": "string",
        "last_name": "string",
        "total_distance": "float",
        "formatted_distance": "string"
      }
    ]
  }
  ```

---

### Trip Routes

#### GET `/user/trips`
- **Description**: Retrieves all trips for the authenticated user.
- **Headers**:
  - `Authorization: Bearer <JWT token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Trips retrieved successfully",
    "trips": [
      {
        "trip_id": "integer",
        "fleet_id": "string",
        "start_time": "string",
        "end_time": "string",
        "distance_travelled": "float",
        "duration_minutes": "integer",
        "status": "string"
      }
    ]
  }
  ```

---

#### GET `/user/trips/total-distance`
- **Description**: Retrieves the total distance travelled by the authenticated user.
- **Headers**:
  - `Authorization: Bearer <JWT token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Total distance retrieved successfully",
    "total_distance": "float",
    "formatted_distance": "string"
  }
  ```

---

#### POST `/user/trips/add`
- **Description**: Adds a new trip for the authenticated user.
- **Headers**:
  - `Authorization: Bearer <JWT token>`
- **Request Body**:
  ```json
  {
    "fleet_id": "string",
    "start_time": "string",
    "end_time": "string",
    "distance_travelled": "float",
    "duration_minutes": "integer",
    "status": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Trip added successfully",
    "trip_id": "integer"
  }
  ```

---

## Middleware

### CORS
The API uses the CORS middleware (`cors.js`) to allow cross-origin requests, enabling access from any origin with the following settings:
- **Allowed methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed headers**: Content-Type, Authorization
- **Allow credentials**: true

---

### Authentication
The API uses JWT tokens for user authentication. The `verifyToken` middleware ensures that only authenticated users can access protected routes.

---

## Database

The application uses a MySQL database. The following tables are required:
- `users`: Stores user details including `username`, `email`, `password_hash`, etc.
- `trips`: Stores trip details including `fleet_id`, `start_time`, `end_time`, `distance_travelled`, `duration_minutes`, and `status`.

---

## JWT Authentication

The API uses JWT for authentication. Upon successful login or signup, a JWT token is issued. The token must be included in the `Authorization` header as `Bearer <token>` for accessing protected routes.

---

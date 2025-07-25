# Blogify API Backend

A RESTful API backend for a blogging platform built with Node.js, Express.js, and MongoDB. This API provides comprehensive functionality for user authentication and blog post management.

## 🚀 Features

### User Management

- **User Registration** - Create new user accounts with validation
- **User Login** - Secure authentication with JWT tokens
- **User Logout** - Secure session termination
- **Password Encryption** - Secure password hashing with bcrypt

### Blog Post Management

- **Create Posts** - Add new blog posts with title, content, category, and tags
- **Read Posts** - Retrieve all posts or specific posts by ID
- **Update Posts** - Modify existing blog posts
- **Delete Posts** - Remove individual posts or all posts
- **Post Statistics** - Get analytics and statistics about posts
- **Author References** - Posts are linked to their authors

### Security & Authentication

- **JWT Authentication** - Secure token-based authentication
- **Access & Refresh Tokens** - Dual token system for enhanced security
- **Protected Routes** - Middleware-based route protection
- **Password Security** - bcrypt hashing for password protection

## 🛠️ Tech Stack

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcryptjs
- **Environment Management:** dotenv
- **Development:** nodemon for hot reloading

## 📁 Project Structure

```
src/
├── app.js                 # Express application setup
├── server.js             # Server entry point
├── config/
│   └── db.js            # Database connection configuration
├── controllers/
│   ├── post.controller.js # Blog post business logic
│   └── user.controller.js # User authentication logic
├── middleware/
│   ├── auth.middleware.js # JWT authentication middleware
│   └── errorHandler.js   # Global error handling
├── models/
│   ├── posts.models.js   # Post data schema
│   └── user.models.js    # User data schema
├── routes/
│   ├── posts.route.js    # Post-related API routes
│   └── user.route.js     # User-related API routes
└── utils/
    ├── ApiError.js       # Custom error handling
    ├── ApiResponse.js    # Standardized API responses
    └── asyncHandler.js   # Async error wrapper
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/jalal1122/Blogify-Api-BackEnd.git
   cd Blogify-Api-BackEnd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   # Port
   PORT=5000

   # Database Connection String
   CONNECTION_STRING=your_mongodb_connection_string

   # CORS Origin
   ORIGIN=*

   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret

   # Token Expiry
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=7d
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

#### Register User

```http
POST /api/user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Logout User

```http
GET /api/user/logout
Authorization: Bearer <your_jwt_token>
```

### Blog Post Endpoints

#### Get All Posts

```http
GET /api/posts
```

#### Get Post by ID

```http
GET /api/post/:id
```

#### Create New Post

```http
POST /api/post
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "title": "My Blog Post",
  "content": "This is the content of my blog post...",
  "category": "Technology",
  "tags": ["nodejs", "express", "mongodb"]
}
```

#### Update Post

```http
PUT /api/post/:id
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "title": "Updated Blog Post",
  "content": "Updated content...",
  "category": "Technology",
  "tags": ["nodejs", "express"]
}
```

#### Delete Post

```http
DELETE /api/post/:id
Authorization: Bearer <your_jwt_token>
```

#### Get Post Statistics

```http
GET /api/posts/stats
```

#### Delete All Posts

```http
DELETE /api/posts
Authorization: Bearer <your_jwt_token>
```

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. After successful login, you'll receive an access token that must be included in the Authorization header for protected routes:

```
Authorization: Bearer <your_access_token>
```

## 📊 Data Models

### User Model

```javascript
{
  username: String (required, unique, 3-20 chars)
  email: String (required, unique, valid email)
  password: String (required, hashed)
  refreshToken: String
  createdAt: Date
  updatedAt: Date
}
```

### Post Model

```javascript
{
  title: String (required)
  content: String (required)
  author: ObjectId (required, ref: User)
  category: String (required)
  tags: [String]
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

- Use strong, unique secrets for JWT tokens
- Set appropriate CORS origins
- Use a production MongoDB connection string

### Docker Deployment (Optional)

You can containerize this application using Docker. Create a `Dockerfile` in the root directory for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**MjDevStudio**

- GitHub: [@jalal1122](https://github.com/jalal1122)

## 🐛 Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/jalal1122/Blogify-Api-BackEnd/issues).

## 📈 Future Enhancements

- [ ] Email verification for user registration
- [ ] Password reset functionality
- [ ] Image upload for blog posts
- [ ] Comments system
- [ ] Post categories and filtering
- [ ] User profiles and bio
- [ ] Rate limiting for API endpoints
- [ ] API documentation with Swagger
- [ ] Unit and integration tests

---

**Happy Blogging! 📝**

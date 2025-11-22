# Prabin Institute - Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - Payment gateway keys
   - WhatsApp API credentials

4. Run the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Enrollments
- `POST /api/enrollments` - Create enrollment
- `GET /api/enrollments/my-courses` - Get my enrollments
- `GET /api/enrollments/all` - Get all enrollments (Admin)
- `PUT /api/enrollments/approve/:id` - Approve enrollment (Admin)
- `PUT /api/enrollments/reject/:id` - Reject enrollment (Admin)

### Payments
- `POST /api/payments/esewa/initiate` - Initiate eSewa payment
- `POST /api/payments/khalti/initiate` - Initiate Khalti payment
- `POST /api/payments/stripe/create` - Create Stripe payment

### AI Features
- `GET /api/ai/recommendations` - Get course recommendations
- `POST /api/ai/summary` - Generate video summary
- `POST /api/ai/certificate` - Generate certificate
- `POST /api/ai/search` - AI-powered search


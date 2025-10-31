# Inventory Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing inventory with role-based access control, real-time notifications, and analytics.

## Features

- **CRUD Operations**: Create, read, update, and delete inventory items
- **Toast Notifications**: Real-time notifications for stock changes (empty, added, removed)
- **Authentication**: Simple JWT-based authentication with MongoDB
- **Role-Based Access**:
  - **Admin**: View analytics and reports only
  - **Staff**: Manage inventory (add, update, delete items)
- **Analytics Dashboard**: Charts and visualizations for inventory data
- **Stock History**: Complete history of all stock movements
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18
- Vite
- React Router
- Axios
- Recharts for data visualization
- Shadcn UI components
- Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/inventory-management
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Initial User Setup

To create initial users, use the registration endpoint:

```bash
# Create an admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'

# Create a staff user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"staff","password":"staff123","role":"staff"}'
```

Or use a tool like Postman to make the request.

## Usage

1. **Homepage**: Visit the homepage to see information about the system
2. **Login**: Click "Get Started" and login as either admin or staff
3. **Admin Dashboard**: View analytics, charts, and reports
4. **Staff Dashboard**: Manage inventory items, add/remove stock, view history
5. **Settings**: Access account settings and logout

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Inventory (Requires Staff role)
- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/history/all` - Get all history
- `GET /api/inventory/history/:id` - Get item history

### Analytics (Requires Admin role)
- `GET /api/analytics` - Get analytics data

## Project Structure

```
MinorProject/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Inventory.js
│   │   └── StockHistory.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features in Detail

### Toast Notifications
- Stock added: Green notification
- Stock removed: Success notification
- Stock empty: Red error notification
- Low stock: Yellow warning notification

### Analytics Dashboard
- Total items and quantity
- Low stock alerts
- Category distribution (Pie chart)
- Activity distribution (Bar chart)
- Daily stock changes (Line chart)
- Recent activities list

### Stock History
- Complete audit trail of all operations
- Shows who made changes and when
- Tracks quantity changes with before/after values

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add input validation and sanitization
- Use HTTPS in production

## Deployment

This application is configured for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Steps

1. **Set up MongoDB Atlas** (free tier available)
2. **Deploy Backend to Vercel**:
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables (MONGODB_URI, JWT_SECRET, FRONTEND_URL)
3. **Deploy Frontend to Vercel**:
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable (VITE_API_URL = your-backend-url/api)
4. **Create initial users** using the `/api/auth/register` endpoint

For complete deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is open source and available for educational purposes.


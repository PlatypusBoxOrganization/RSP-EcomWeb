# ElectroHive E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Product catalog with filtering and search
- Shopping cart functionality
- Wishlist management
- Responsive design
- Secure checkout process

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account or local MongoDB instance
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/electrohive.git
cd electrohive
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### 4. Start the development server

```bash
# Start both frontend and backend
tmux new-session -d 'cd server && npm run dev' 'cd client && npm run dev'

# Or run in separate terminals
# Terminal 1 (backend):
cd server
npm run dev

# Terminal 2 (frontend):
cd client
npm run dev
```

## Deployment

### Render.com (Recommended)

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Environment**: Node

5. Add environment variables in the Render dashboard:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret_here`
   - `JWT_EXPIRE=30d`
   - `FRONTEND_URL=your_render_app_url`

### Manual Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   NODE_ENV=production node server/server.js
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

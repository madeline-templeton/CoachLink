# CoachLink

A TypeScript/React application with Firebase backend (Firestore + Storage)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express, TypeScript, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

## Project Structure

```
CoachLink/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # Express backend server
│   ├── src/
│   │   ├── firebase/
│   │   └── handlers/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/madeline-templeton/CoachLink.git
cd CoachLink
```

2. Install root dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database and Storage
3. Create a web app and get your Firebase config
4. Generate a service account key for Admin SDK

### Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** (`backend/.env`):
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

## Running the Application

### Development Mode

**Frontend** (from `frontend/` directory):
```bash
npm run dev
```
Server runs on http://localhost:5173

**Backend** (from `backend/` directory):
```bash
npm run dev
```
Server runs on http://localhost:8080

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with watch mode
- `npm run debug` - Start server with debugger
- `npm run test` - Run tests

## Contributing

This is a personal project. Please contact the repository owner for contribution guidelines.

## License

Private project - All rights reserved
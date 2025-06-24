# NestJS Chat UI

A real-time chat application built with React and Socket.io, designed to work with the [nest-chat-api](https://github.com/ahmadrajpoot062/nest-chat-api) backend.


## Features

- 💬 Real-time messaging using Socket.io
- 👤 User authentication with JWT
- 🖼️ Avatar upload and management
- 🌓 Light/dark mode toggle
- 🔔 Toast notifications
- ⌨️ Typing indicators

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Installation

### 1. Clone both repositories

```bash
# Clone the backend repository
git clone https://github.com/ahmadrajpoot062/nest-chat-api.git

# Clone the frontend repository
git clone https://github.com/ahmadrajpoot062/nest-chat-ui.git
```

### 2. Set up the backend (API)

```bash
# Navigate to the backend directory
cd nest-chat-api

# Install dependencies
npm install

# Start the backend server (runs on port 3000)
npm run start:dev
```

The backend will be available at http://localhost:3000 with Swagger documentation at http://localhost:3000/api

### 3. Set up the frontend (UI)

```bash
# Navigate to the frontend directory
cd nest-chat-ui

# Install dependencies
npm install

# Start the frontend development server (will run on port 3001)
npm start

It will tell that something is running on port 3000. so choose another port to run frontend by pressing yes. Then frontend will run on port 3001
```

> **Note:** The frontend is configured to connect to the backend at http://localhost:3000, so make sure the backend is running before starting the frontend.

## Usage

1. Open your browser and go to http://localhost:3001
2. Register a new account or login with existing credentials
3. Join a chat room
4. Start messaging in real-time!

## Project Structure

```
nest-chat-ui
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── logo192.png
│   └── logo512.png
│   └── manifest.json
│   └── robots.txt
└── src
    ├── components
    │   ├── Avatar
    │   ├── PrivateRoute
    ├── context
    │   └── UserContext.tsx
    ├── pages
    │   ├── Chat
    │   ├── Login
    │   ├── Register
    │   └── SelectRoom
    ├── Services
    │   └── api.ts
    ├── theme
    │   └── Colors.ts
    ├── App.tsx
    ├── index.tsx
    └── reportWebVitals.ts
```

## Troubleshooting Common Issues

- **Backend not starting:** Ensure that you have installed all dependencies and that there are no errors in the terminal.
- **Frontend not connecting to backend:** Check that the backend server is running and that you have the correct URL in your frontend configuration.
- **Socket.io issues:** Make sure that you have the latest version of Socket.io installed in both frontend and backend projects.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for real-time communication in web applications.
- Built with passion and dedication to learning and improving development skills.

---



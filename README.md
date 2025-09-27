# MERN Stack Application with AI Chat (TextGen-AI)

This is a full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack. It includes user authentication, a contact form, and an AI-powered chat feature using Google's Gemini Pro model.

## Tech Stack

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web development.
- **Tailwind CSS:** A utility-first CSS framework.
- **Axios:** A promise-based HTTP client for the browser and Node.js.
- **React Router:** A standard library for routing in React.
- **React Globe GL:** A React component for 3D globe data visualization.
- **tsParticles:** A lightweight library for creating particles.

### Backend

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL document database.
- **Mongoose:** An elegant MongoDB object modeling for Node.js.
- **JWT (JSON Web Token):** A compact, URL-safe means of representing claims to be transferred between two parties.
- **Bcrypt.js:** A library for hashing passwords.
- **Nodemailer:** A module for Node.js applications to allow easy as cake email sending.
- **Dotenv:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **@google/generative-ai:** Google's SDK for the Gemini API.

## Features

-   User registration and login with JWT authentication.
-   A contact form that sends an email using Nodemailer.
-   Interactive globe and particle animations on the frontend.
-   **New:** AI-powered chat feature using Google's Gemini model.

## API Endpoints

### Authentication

-   `POST /api/auth/signup`: Register a new user.
-   `POST /api/auth/login`: Authenticate a user and get a JWT token.

### Contact

-   `POST /api/contact`: Send a message from the contact form.

### Chat

-   `POST /api/chat`: Send a message to the AI and get a response.

## Getting Started

### Prerequisites

-   Node.js and npm installed
-   MongoDB installed and running
-   A `.env` file in the `backend` directory with the following variables:
    -   `JWT_SECRET`: A secret key for JWT.
    -   `EMAIL_USER`: Your email address for sending emails.
    -   `EMAIL_PASS`: Your email password.
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `GEMINI_API_KEY`: Your API key for the Gemini API.

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:5000` (by default, can be configured).

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend development server will be running on `http://localhost:5173` (by default, can be configured).

    Once the application is running, you can access the chat feature by navigating to the `/chat` route. You will need to enter your Gemini API key in the chat interface to use the AI chat.

# TextGen-AI: MERN Stack Application with AI

TextGen-AI is a full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack. It provides a modern, interactive user experience with features like user authentication, a contact form, and an AI-powered chat powered by Google's Gemini Pro model. This project serves as a comprehensive example of a modern web application with a decoupled frontend and backend architecture.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web development.
- **Tailwind CSS:** A utility-first CSS framework for creating modern and responsive designs.
- **Axios:** A promise-based HTTP client for making requests to the backend.
- **React Router:** A library for handling client-side routing in a React application.
- **React Globe GL:** A React component for 3D globe data visualization.
- **tsParticles:** A lightweight library for creating interactive particle animations.

### Backend

- **Node.js:** A JavaScript runtime environment for executing server-side code.
- **Express:** A minimalist web framework for Node.js, used for building the RESTful API.
- **MongoDB:** A NoSQL document database for storing application data.
- **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.
- **JWT (JSON Web Token):** A compact, URL-safe means of representing claims to be transferred between two parties, used for user authentication.
- **Bcrypt.js:** A library for hashing user passwords before storing them in the database.
- **Nodemailer:** A module for sending emails from the Node.js server, used for the contact form.
- **Dotenv:** A zero-dependency module that loads environment variables from a `.env` file.
- **@google/generative-ai:** The official Google SDK for interacting with the Gemini API.

## Features

- **User Authentication:** Secure user registration and login system with JWT-based authentication.
- **Contact Form:** A functional contact form that sends an email to the site administrator using Nodemailer.
- **AI-Powered Chat:** An interactive chat interface that leverages Google's Gemini Pro model to provide intelligent and conversational responses.
- **Interactive UI:** Engaging user interface with a 3D globe and particle animations.
- **RESTful API:** A well-structured backend API for managing application data and logic.

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and receive a JWT token.

### Contact

- `POST /api/contact`: Send a message from the contact form.

### Chat

- `POST /api/chat`: Send a message to the AI and get a response.

## Getting Started

To get the application up and running on your local machine, follow the instructions below.

### Prerequisites

- Node.js and npm (Node Package Manager) installed.
- MongoDB installed and running locally or a connection string to a cloud-hosted instance.
- A `.env` file in the `backend` directory with the following variables:
  - `JWT_SECRET`: A secret key for signing JWT tokens.
  - `EMAIL_USER`: Your email address for sending emails via the contact form.
  - `EMAIL_PASS`: Your email password.
  - `MONGO_URI`: Your MongoDB connection string.
  - `GEMINI_API_KEY`: Your API key for the Gemini API.

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
    The backend server will be running on `http://localhost:5000` by default.

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
    The frontend development server will be running on `http://localhost:5173` by default.

Once the application is running, you can access the chat feature by navigating to the `/chat` route. You will need to enter your Gemini API key in the chat interface to use the AI chat.

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

- **`frontend/`**: Contains the React application, including all components, pages, and static assets.
- **`backend/`**: Contains the Express server, including all API routes, models, and controllers.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

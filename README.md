
# DesignSight - MERN Prototype

DesignSight is an AI-powered design feedback platform that provides structured, coordinate-anchored feedback on uploaded screen designs, with role-based filtering and collaborative discussion features.

## Features

- **Project Management:** Create projects to organize your designs.
- **Image Upload:** Upload screen designs (PNG/JPG) for analysis.
- **AI-Powered Analysis:** Get structured feedback on your designs, including:
  - Accessibility
  - Visual Hierarchy
  - Content & Copy
  - UI/UX Patterns
- **Coordinate-Anchored Feedback:** Feedback is visually anchored to specific coordinates on the image.
- **Role-Based Filtering:** Filter feedback based on your role (Designer, Reviewer, Product Manager, Developer).

## Tech Stack

- **Frontend:** React, Vite, Axios, React Router
- **Backend:** Node.js, Express, Mongoose, Multer, OpenAI
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- An OpenAI API key

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Create a `.env` file in the `backend` directory:**
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Add your OpenAI API key to the `backend/.env` file:**
   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Build and run the application with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

5. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## API Provider Guidance

This prototype uses the OpenAI GPT-4 Vision API. You will need to have an OpenAI account with access to this API.

### API Costs

The cost of the OpenAI API is based on the number of tokens used. The `gpt-4-vision-preview` model is currently priced at $0.01 per 1K input tokens and $0.03 per 1K output tokens. The cost of analyzing a single image will vary depending on the complexity of the image and the length of the generated feedback.

## TODO.md

- Implement threaded discussion system.
- Implement export & handoff features (PDF, JSON).
- Add user authentication and authorization.
- Write a comprehensive test suite.
- Improve error handling and UI/UX.

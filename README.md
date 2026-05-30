# GitHub Profile Analyzer

A backend service that fetches a GitHub user’s public profile, analyzes their repositories, generates an AI‑powered summary (using Google Gemini), and stores insights in a MySQL database.

**Live API:** [https://analyzer-dun.vercel.app](https://analyzer-dun.vercel.app)

## Features

- Fetch GitHub user profile + all repositories (handles pagination)
- Calculate total stars across repos and identify top programming language
- Generate concise, insightful summary with **Google Gemini AI**
- Store all data in **MySQL** (hosted on Railway)
- REST API endpoints to trigger analysis and retrieve stored user data
- Deployed on **Vercel** (serverless functions) + **Railway MySQL**

## Tech Stack

- **Node.js** + **Express** – Backend (running as Vercel serverless functions)
- **MySQL** – Database (Railway MySQL)
- **Axios** – GitHub API client
- **Google Gemini AI** – AI summary generation
- **dotenv** – Environment variables
- **mysql2** – MySQL driver

## API Endpoints

| Method | Endpoint                         | Description |
|--------|----------------------------------|-------------|
| POST   | `/api/users/:username`           | Analyze GitHub user, generate AI summary, store in DB |
| GET    | `/api/users/:username`           | Retrieve stored user insights from DB |

### Example Usage

## Try with Postman

### 1. Analyze a user (POST)

- **Method:** `POST`
- **URL:** `https://analyzer-dun.vercel.app/api/users/octocat`
- **Headers:** (none required)
- **Body:** none

**Response example:**

```json
{
  "message": "User analyzed and stored",
  "user": {
    "login": "octocat",
    "totalStars": 456,
    "topLanguage": "JavaScript",
    "summary": "Octocat focuses on open-source tooling with JavaScript and Ruby."
  }
}
```

### 1. Retrieve stored user (GET)

- **Method:** `GET`
- **URL:** `https://analyzer-dun.vercel.app/api/users/octocat`

**Response example:**

```json
{
  "id": 583231,
  "login": "octocat",
  "name": "The Octocat",
  "public_repos": 8,
  "followers": 12345,
  "total_stars": 456,
  "top_language": "JavaScript",
  "summary": "Octocat focuses on open-source tooling with JavaScript and Ruby.",
  "last_fetched": "2026-05-30T12:00:00.000Z"
}
```

## Database Schema

```MySQL
CREATE TABLE users (
    id INT PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    public_repos INT,
    followers INT,
    total_stars INT DEFAULT 0,
    top_language VARCHAR(100),
    summary TEXT,
    last_fetched TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup Instructions
### 1. Clone the repository
bash
git clone https://github.com/yourusername/github-analyzer.git
cd github-analyzer
### 2. Install dependencies
bash
npm install
### 3. Environment variables
Create a .env file in the root:

```env
DB_URL=mysql://username:password@host:port/database_name
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_google_gemini_api_key
DB_URL – MySQL connection string (e.g., from Railway)
```
GITHUB_TOKEN – Create a personal access token with public_repo scope

GEMINI_API_KEY – Get a free key from Google AI Studio

### 4. Database setup
Run the SQL schema on your MySQL instance (e.g., Railway MySQL CLI).

### 5. Run locally
bash
node server.js
# or
npm start
# Your Birthday, Remembered

A birthday reminder service that automatically sends personalized birthday emails to registered users on their special day. Users submit their name, email and date of birth through a simple form and the app takes care of the rest.

---

## Table of Contents

- [Your Birthday, Remembered](#your-birthday-remembered)
  - [Table of Contents](#table-of-contents)
  - [How It Works](#how-it-works)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Deploying to Vercel](#deploying-to-vercel)
  - [API Reference](#api-reference)
    - [POST /api/users](#post-apiusers)
    - [GET /api/users/trigger-birthdays?secret=your\_cron\_secret](#get-apiuserstrigger-birthdayssecretyour_cron_secret)
    - [GET /api/health](#get-apihealth)
  - [Scheduling Birthday Checks](#scheduling-birthday-checks)
  - [License](#license)

---

## How It Works

A user fills out the form with their name, email address and date of birth. That data is validated and saved to MongoDB.

Once a day, an external scheduler hits the `/api/users/trigger-birthdays` endpoint. The endpoint queries the database for any users whose birth month and day match today's date (in Nigerian time, WAT/UTC+1), then sends each of them a personalized birthday email via Resend.

```
User submits form
    |
    v
Data validated + saved to MongoDB
    |
    v
Cron Job hits /api/users/trigger-birthdays daily
    |
    v
Birthday matches found --> Resend sends personalized HTML email
```

---

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Hosting   | Vercel (serverless functions) |
| Database  | MongoDB (via Mongoose)        |
| Email     | Resend                        |
| Scheduler | cron-job.org                  |
| Frontend  | Vanilla HTML, CSS, JavaScript |

---

## Project Structure

```
birthday-reminder-app/
├── api/
│   ├── health.js                    # Health check endpoint
│   └── users/
│       ├── index.js                 # POST /api/users - register a user
│       └── trigger-birthdays.js     # GET /api/users/trigger-birthdays - cron trigger
├── config/
│   └── dbConfig.js                  # MongoDB connection
├── controllers/
│   └── userController.js            # User registration logic + validation
├── models/
│   └── userModel.js                 # Mongoose schema
├── public/
│   ├── index.html                   # Registration form
│   ├── script.js                    # Form submission + validation
│   └── styles.css
├── services/
│   └── emailService.js              # Resend email logic
├── vercel.json                      # Vercel routing config
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB database (local or hosted on MongoDB Atlas)
- A [Resend](https://resend.com) account with a verified sending domain

### Installation

```bash
git clone https://github.com/adetolaa99/birthday-reminder-app.git
cd birthday-reminder-app
npm install
```

### Environment Variables

When deploying to Vercel, add these in your project's environment variable settings:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/birthday-reminder-app
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Your Birthday, Remembered <hello@yourdomain.com>
CRON_SECRET=a_long_random_secret_string
```

`CRON_SECRET` is used to protect the birthday trigger endpoint from unauthorized access. Set it to any long random string and use the same value when configuring your cron schedule.

### Deploying to Vercel

1. Push the repository to GitHub
2. Import the project in the [Vercel dashboard](https://vercel.com/dashboard)
3. Add the environment variables above under **Settings > Environment Variables**
4. Click Deploy. Vercel will automatically detect the `api/` folder and deploy serverless functions

---

## API Reference

### POST /api/users

Registers a new user for birthday reminders.

**Request body:**

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "dob": "1998-03-15"
}
```

`dob` should be an ISO date string (`YYYY-MM-DD`). The date cannot be in the future or more than 120 years in the past.

**Response `201`:**

```json
{
  "message": "User added successfully",
  "user": {
    "name": "Test User",
    "email": "testuser@example.com",
    "dob": "1998-03-15"
  }
}
```

**Response `400`** - validation error:

```json
{
  "error": "Email already exists!"
}
```

---

### GET /api/users/trigger-birthdays?secret=your_cron_secret

Checks for users whose birthday matches today's date (WAT, UTC+1) and sends them a birthday email. Protected by a secret query parameter.

**Response `200`:**

```json
{
  "success": true,
  "message": "Processed 2 birthdays for 03-15"
}
```

**Response `401`-** missing or incorrect secret:

```json
{
  "error": "Unauthorized"
}
```

---

### GET /api/health

Returns the current server status and timestamp. Useful for uptime monitoring.

**Response `200`:**

```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:00:00.000Z"
}
```

---

## Scheduling Birthday Checks

The trigger endpoint needs to be called once a day by an external scheduler. This project uses [cron-job.org](https://cron-job.org) to do that.

Set up a new cron job pointing to:

```
https://your-vercel-app.vercel.app/api/users/trigger-birthdays?secret=your_cron_secret
```

Set it to run once daily at your preferred time. The endpoint checks birthdays against Nigerian time (WAT, UTC+1), so schedule accordingly.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

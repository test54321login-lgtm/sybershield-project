# CyberShield - Cyber Awareness & Malware Information Portal

CyberShield is a web-based cyber awareness and malware information portal built for students, beginners, and general internet users. The platform aims to bridge the knowledge gap in cybersecurity by delivering interactive educational content, practical assessments, and real-time safety tips.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Malware Encyclopedia**: Comprehensive information on 10 different types of malware
- **Interactive Quiz**: 10-question quiz with timer and score tracking
- **Cyber Safety Checklist**: 15-item checklist to evaluate cybersecurity hygiene
- **Practice Space**: Password strength tester and phishing email spotter
- **News & Tips Feed**: Dynamic content feed with category filtering

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas
- **Authentication**: Custom JWT + bcryptjs
- **Hosting**: Vercel

## Project Structure

```
cybershield/
├── index.html
├── login.html
├── quiz.html
├── checklist.html
├── feed.html
├── encyclopedia/
│   ├── index.html
│   ├── virus.html
│   ├── trojan.html
│   ├── ransomware.html
│   ├── spyware.html
│   ├── adware.html
│   ├── worm.html
│   ├── rootkit.html
│   ├── keylogger.html
│   ├── botnet.html
│   └── phishing.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── quiz.js
│   ├── checklist.js
│   ├── feed.js
│   └── utils.js
├── api/
│   ├── lib/
│   │   ├── db.js
│   │   └── auth.js
│   ├── auth/
│   │   ├── signup.js
│   │   └── login.js
│   ├── quiz/
│   │   ├── submit.js
│   │   └── history.js
│   ├── checklist/
│   │   ├── get.js
│   │   └── update.js
│   └── feed/
│       └── index.js
├── package.json
└── vercel.json
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, random secret string (minimum 32 characters)
4. Deploy to Vercel or run locally with `vercel dev`

## Environment Variables

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for signing JWT tokens

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Quiz
- `POST /api/quiz/submit` - Submit quiz score (requires auth)
- `GET /api/quiz/history` - Get user's quiz history (requires auth)

### Checklist
- `GET /api/checklist/get` - Get user's checklist progress (requires auth)
- `POST /api/checklist/update` - Update checklist progress (requires auth)

### Feed
- `GET /api/feed` - Get news and tips (no auth required)

## Database Collections

- `users`: Stores user information (username, email, hashed password, creation date)
- `quiz_scores`: Stores quiz scores with timestamps
- `checklist_progress`: Tracks user's checklist completion
- `tips_feed`: Contains news and tips content

## Security Features

- Passwords are hashed using bcrypt with saltRounds=10
- JWT tokens with 7-day expiration
- Input validation on all API endpoints
- CORS headers configured appropriately
- Protected routes requiring valid JWT tokens

## Development

This project follows a JAMstack architecture with static HTML/CSS/JS files served from Vercel's CDN, and dynamic functionality handled by Vercel Serverless Functions acting as a lightweight API layer.

## Deployment

The project is designed for deployment on Vercel with automatic deployments from GitHub. Set the required environment variables in the Vercel dashboard under Project Settings > Environment Variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


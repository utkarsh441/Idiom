# Idiom

A real-time AI-powered multilingual chat application that enables users to communicate seamlessly across different languages through instant message translation.

## Overview

Idiom is a real-time chat application built to eliminate language barriers in conversations. It combines Socket.IO for instant messaging with the Google Gemini API for real-time translation, allowing users to chat in their preferred languages without manual translation.

The application also provides secure authentication, profile management, and a friend system to deliver a smooth and intuitive messaging experience.

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| Real-Time Messaging | Instant one-to-one messaging using Socket.IO | ✅ |
| AI Translation | Translate messages in real time using Google Gemini API | ✅ |
| JWT Authentication | Secure user authentication and protected routes | ✅ |
| Password Encryption | Password hashing using bcrypt | ✅ |
| Friend System | Add and remove friends using usernames | ✅ |
| Username Search | Search and connect with users | ✅ |
| Profile Management | Upload and update profile pictures | ✅ |
| Minimal UI | Clean and responsive chat interface | ✅ |

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Real-Time Communication | Socket.IO |
| AI | Google Gemini API |

---

## Architecture

```
React Frontend
        │
        │ REST API + Socket.IO
        ▼
Express Backend
        │
        ├── Authentication
        ├── Friends
        ├── Messaging
        ├── Translation
        └── Profiles
               │
               ├── MongoDB
               └── Google Gemini API
```

---

## Project Structure

```
Idiom
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middlewares
│   │   ├── services
│   │   ├── sockets
│   │   └── db
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── Frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── services
    │   └── assets
    └── package.json
```

---

## Future Enhancements

- Group chats
- Online/offline status
- Last seen
- Read receipts
- Typing indicators
- Message scheduling
- Chat themes
- Push notifications
- Image sharing in chats
- Message search

---

If you found this project useful, consider giving it a ⭐ on GitHub.

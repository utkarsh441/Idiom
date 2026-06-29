# Idiom

A real-time AI-powered multilingual chat application that enables seamless communication across different languages through instant message translation.

## Overview

Idiom is a real-time chat application designed to eliminate language barriers in conversations. Built using the MERN stack and Socket.IO, it delivers instant one-to-one messaging while leveraging the Google Gemini API to translate messages in real time.

The application also provides secure authentication, profile management, and a username-based friend system, offering a simple and intuitive messaging experience.

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| Real-Time Messaging | Instant one-to-one messaging using Socket.IO | ✅ |
| AI Translation | Translate messages in real time using Google Gemini API | ✅ |
| JWT Authentication | Secure authentication and protected routes | ✅ |
| Password Encryption | Password hashing using bcrypt | ✅ |
| Friend System | Add and remove friends using usernames | ✅ |
| Username Search | Search and connect with users through unique usernames | ✅ |
| Profile Management | Update profile information and profile picture | ✅ |
| Minimal UI | Clean and responsive user interface | ✅ |

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

```text
React Frontend
        │
        │ REST API + Socket.IO
        ▼
Express Backend
        │
        ├── Authentication
        ├── User Management
        ├── Friend Management
        ├── Messaging
        ├── Translation
        └── Profile Management
               │
               ├── MongoDB
               └── Google Gemini API
```

---

## Project Structure

```text
Idiom
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── sockets
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── Frontend
    ├── src
    │   ├── components
    │   ├── context
    │   ├── hooks
    │   ├── pages
    │   ├── services
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## Future Enhancements

- Online/Offline user status
- Last seen
- Typing indicators
- Read receipts
- Group chats
- Message scheduling
- Chat themes
- Image sharing in chats
- Message search
- Push notifications
- Rate limiting for enhanced security

---

If you found this project useful, consider giving it a ⭐ on GitHub.

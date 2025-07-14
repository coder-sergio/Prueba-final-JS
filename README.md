# SPA Event Management

## Description

This project is a single-page web application (SPA) for event management. It allows users to register, log in, sign up for events, and, for administrators, create and edit events. The application uses a JSON server as an API to store user and event data.

## Features

- Registration and login with roles.
- Course CRUD for administrators.
- Course enrollment for students.
- Session persistence with Local Storage.
- Secure routes and redirection.

- **Authentication**: Registration and login with roles (administrator and student).
- **Event Management**:
- Administrators can create, edit, and view the list of event registrants.
- Students can enroll in available events.
- **Session persistence**: Use of `localStorage` to maintain the active session.

- **Routing**: Navigation between views using hashes (`#`).
- **Route Protection**: Restrict access to certain views based on the user's authentication status and role.

## Available Scripts

- **npm run start:api**: Starts the JSON server on port 3000.
- **npm start**: Starts the JSON server on the default port.
## Instructions

1. Install dependencies:
```
npm install
```

2. Start the API:
```
npm run start:api
```

3. Start the local server:
```
npm start
```
4. Open in browser: ` http://localhost:3000`

## Test User

- **Administrator:** admin@eventos.com / admin123

## Rights
```This project is licensed by Sergio Bonlla, email: bsergio274@gmail.com, belonging to the Riwi Mangrove Clan.


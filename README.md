[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/qBr6G7dS)
# final-project
Web Programming 2023 - Final Project

## address to the running service
https://final-frontend.onrender.com/

## installation

Start docker:

`docker compose up -d`

### Backend
--------------------
`cd backend`
`touch .env`

Add backend .env variables to .env file:
```
MYSQL_HOST='localhost'
MYSQL_USERNAME='root'
MYSQL_PASSWORD='example'
MYSQL_DATABASE='example_db'
MYSQL_PORT=3306
JWT_KEY='super-secret-key-for-token'
```
`npm istall`
`npm run dev`

### Frontend
---------------------
`cd frontend`
`touch .env`

Add frontend .env variables to .env file:
```
VITE_API_URL="http://localhost:5000"
```

`npm install` 
`npm run dev`

Open http://localhost:5173/ in your browser.

## self-valuation

1. User Authentication  :   16 points
- User registration and login functionality works as expected (8 points)
- User session management is implemented properly (4 points)
- User authentication is secure, e.g validations, tokens, using password hashes (4 points)

2. Listing Creation :  20 points
- Users can create new listings with all required information (6 points)
- Proper error handling for missing or incorrect listing information (4 points)
- Users can edit or delete their own listings (6 points)
- Listing creation is secure, e.g validations (4 points)

3. Listing Viewing and Searching  :   28 points
- Users can view all listings (8 points)
- User can view only own listings (6 points)
- Users can search for listings by keyword, category, and other filters (4 points)  // keyword, price only
- Listing lists and details are displayed in a clear and organized manner (4 points)
- Proper error handling for missing or invalid listings (3 points)
- Listing viewing and searching is secure e.g validation, authorization (3 points)

4. Quality and CI/CD :    11 points
- Tests for all essential functionality (4 points) // Backend tests only
- CI/CD workflows are in place (7 points)

5. Documentation :    5 points
- Installation instructions (5 points)

6. Bonus:   5 poinst
- Site is responsive, works on different screen sizes (5 points)

total: 85 points




# To Do List Web App

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)

## General info
A responsive To-Do List application with user authentication and full CRUD functionality. This project allows users to manage their tasks effectively with features like sorting, marking tasks as complete, and more.

## Technologies
### Backend
* JavaScript
* Node.js
* Express.js
* MySQL
* JWT
### Frontend
* HTML
* CSS
* JavaScript

## Features
### General Features
* User Authentication - Register and login securely.
* CRUD Operations - Create, view, edit, and delete tasks.
* Task Status Management - Mark tasks as completed or pending.
* Sorting - Sort tasks by completion status.
* Responsive Design - Works on all screen sizes, including mobile.
### Backend
* Built with Node.js.
* Uses Express.js for routing and middleware.
* JWT Authentication for secure routes.
* MySQL for database management.
### Frontend
* Built with HTML, CSS and JavaScript.
* Fully responsive design.

## Setup
1. Clone the repository:
```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
2. Backend setup:
* Navigate to the backend folder:
```
cd backend
```
* Install dependencies:
```
npm install
```
* Configure your database connection in the .env file (example values):
```
MYSQL_HOST="localhost"
MYSQL_PORT="1234"
MYSQL_USER="root"
MYSQL_PASSWORD="your_password"
MYSQL_DATABASE="to_do_list"
JWT_SECRET="your_secret"
```
* Run the database script:
```
mysql -u root -p < create_database.sql
```
* Start the backend server:
```
npm start
```
3. Frontend setup
* Open your-directory-path/frontend/public/index.html in your browser or deploy it to a static server.

## Got questions or suggestions? Feel free to reach out! 🚀

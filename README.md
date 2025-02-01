# To Do List Web App

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)
* [Screenshots](#screenshots)

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

## Screenshots
* Landing page
![1](https://github.com/user-attachments/assets/5d49c96f-b633-4b83-9fae-08182385116d)
* Login panel
![2](https://github.com/user-attachments/assets/926263be-e6e7-4df0-913f-69c45073bd14)
* Logged in user
![3](https://github.com/user-attachments/assets/edaeeacd-20dc-490e-94d2-74d23e140f7b)
* Task filter
![4](https://github.com/user-attachments/assets/2888f41a-853f-4257-bb7b-616d3f9d7f8c)

## Got questions or suggestions? Feel free to reach out! 🚀

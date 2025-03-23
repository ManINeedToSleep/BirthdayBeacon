# BirthdayBeacon 🎂

BirthdayBeacon is a social birthday tracking application that helps you keep track of your friends' birthdays. Never miss wishing someone on their special day again!

## 🌟 Features

- **User Management**: Create an account, customize your profile, and secure login
- **Friend Tracking**: Add and manage friends with their birthday information
- **Birthday Calendar**: View all birthdays in an interactive calendar format
- **Notifications**: Get reminders for upcoming birthdays
- **Relationship Management**: Add notes and categorize your relationships
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technical Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templates with JavaScript and CSS
- **Database**: MySQL with Sequelize ORM
- **Authentication**: Express-session and bcrypt for secure user management
- **API**: RESTful endpoints for users, friends, and birthdays

## 📦 Dependencies

- Express.js - Web application framework
- Sequelize - ORM for database interactions
- EJS - Templating engine
- bcrypt - Password hashing
- express-session - Session management
- mysql2 - MySQL driver
- dotenv - Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
   ```
   git clone https://github.com/ManINeedToSleep/BirthdayBeacon.git
   cd BirthdayBeacon
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=yourusername
   DB_PASSWORD=yourpassword
   DB_NAME=birthdaybeacon
   PORT=3000
   ```

4. Initialize the database
   ```
   npm run start
   ```

5. Access the application
   ```
   http://localhost:3000
   ```

## 📂 Project Structure

- `/config` - Database and application configuration
- `/middleware` - Authentication and utility middleware
- `/models` - Sequelize data models
- `/public` - Static files (CSS, JS, images)
- `/routes` - Express routes for all endpoints
- `/views` - EJS templates for the frontend

## 🧑‍💻 Development

Start the development server with automatic restart:

```
npm install nodemon --save-dev
npx nodemon server.js
```

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👏 Acknowledgements

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [Node.js](https://nodejs.org/)

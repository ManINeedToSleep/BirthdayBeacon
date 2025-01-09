import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

// Import models
import defineUserModel from './models/user.js';
import defineFriendsModel from './models/Friends.js';
import defineBirthdayModel from './models/Birthday.js';

// Import routes
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

// Configure __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize models
const User = defineUserModel(sequelize);
const Friends = defineFriendsModel(sequelize);
const Birthday = defineBirthdayModel(sequelize);

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Use absolute path for views
app.use(express.static(path.join(__dirname, 'public'))); // Use absolute path for static files
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true in production with HTTPS
    })
);

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

// Sync database and start server
(async () => {
    try {
        await sequelize.sync(); // Sync models with the database
        console.log('Database synced successfully');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing the server:', error);
    }
})();

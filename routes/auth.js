import express from 'express';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
const { User } = db;

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        // If user doesn't exist or password is invalid
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { 
                error: 'Invalid email or password',
                email // Keep email in form
            });
        }

        // Set user session
        setUserSession(req, user);

        // Redirect to dashboard
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { 
            error: 'An error occurred during login',
            email: req.body.email
        });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validate input
        const validationError = validateSignupInput(username, email, password, confirmPassword);
        if (validationError) {
            return res.render('signup', validationError);
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('signup', {
                error: 'Email already registered',
                username
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Set user session
        setUserSession(req, user);

        // Redirect to dashboard
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', {
            error: 'An error occurred during signup',
            username: req.body.username,
            email: req.body.email
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Helper function to set user session
function setUserSession(req, user) {
    req.session.userId = user.id;
    req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
    };
}

// Helper function to validate signup input
function validateSignupInput(username, email, password, confirmPassword) {
    if (!username || !email || !password || !confirmPassword) {
        return {
            error: 'All fields are required',
            username,
            email
        };
    }

    if (password !== confirmPassword) {
        return {
            error: 'Passwords do not match',
            username,
            email
        };
    }

    if (password.length < 6) {
        return {
            error: 'Password must be at least 6 characters long',
            username,
            email
        };
    }

    return null;
}

export default router;
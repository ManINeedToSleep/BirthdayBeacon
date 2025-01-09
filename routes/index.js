// THIS IS A ROUTE FOR THE MAIN / LANDING PAGE!!!

import express from 'express';
const router = express.Router();

// Landing page route
router.get('/', (req, res) => {
    res.render('landing');  // Create a landing.ejs that has links to both login and signup
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login');
});

// Signup page route
router.get('/signup', (req, res) => {
    res.render('signup');
});

export default router;
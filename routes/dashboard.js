import express from 'express';
import db from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();
const { User, Friends } = db;

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Apply middleware to all dashboard routes
router.use(isAuthenticated);

// Dashboard home page
router.get('/', (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

// Add Friend page
router.get('/add-friend', (req, res) => {
    res.render('add-friend', { user: req.session.user });
});

// Get all birthdays for calendar
router.get('/api/birthdays', async (req, res) => {
    try {
        const friends = await Friends.findAll({
            where: { userId: req.session.userId },
            include: [{
                model: User,
                as: 'friend',  // This matches the association alias in your Friends model
                attributes: ['username']  // Only get the username
            }]
        });
        
        const events = friends ? friends.map(friend => ({
            id: friend.id,
            title: friend.friend.username,  // Use the joined user's username
            start: friend.dateOfBirth,
            allDay: true
        })) : [];
        
        return res.json(events);
    } catch (error) {
        console.error('Error fetching birthdays:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get birthdays for specific date
router.get('/api/birthdays/:date', async (req, res) => {
    try {
        const friends = await Friends.findAll({
            where: { 
                userId: req.session.userId,
                dateOfBirth: req.params.date
            },
            include: [{
                model: User,
                as: 'friend',
                attributes: ['username', 'email']
            }]
        });

        // Transform the data to match the expected format
        const formattedFriends = friends.map(friend => ({
            id: friend.id,
            name: friend.friend.username,
            email: friend.friend.email,
            relationship: friend.description || 'Friend',
            dateOfBirth: friend.dateOfBirth
        }));

        res.json(formattedFriends);
    } catch (error) {
        console.error('Error fetching birthday by date:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Add new birthday
router.post('/api/birthdays', async (req, res) => {
    try {
        const friend = await Friends.create({
            userId: req.session.userId,
            friendId: req.body.friendId,
            dateOfBirth: req.body.dateOfBirth,
            description: req.body.notes,
            status: 'upcoming',
            reminderEnabled: true
        });
        res.json(friend);
    } catch (error) {
        console.error('Error creating friend:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add this new route to get available friends
router.get('/api/available-friends', async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: req.session.userId } // exclude current user
            },
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching available friends:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// API route to add a new friend
router.post('/api/friends', async (req, res) => {
    try {
        const { username, email, dateOfBirth } = req.body;
        
        // Create new user for the friend
        const newUser = await User.create({
            username,
            email,
            password: Math.random().toString(36).slice(-8), // temporary password
        });

        // Create friendship connection with dateOfBirth
        await Friends.create({
            userId: req.session.userId,
            friendId: newUser.id,
            dateOfBirth: dateOfBirth,
            status: 'upcoming',
            reminderEnabled: true
        });

        res.json({ success: true, user: newUser });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ 
            message: 'Error adding friend', 
            error: error.message 
        });
    }
});

export default router;
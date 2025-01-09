import express from 'express';
import Birthday from '../models/Birthday.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// Dashboard page render
router.get('/', (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

// Get all birthdays for calendar
router.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.findAll({
            where: { userId: req.session.userId }
        });
        
        const events = birthdays.map(birthday => ({
            id: birthday.id,
            title: birthday.name,
            start: birthday.birthDate,
            allDay: true
        }));
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get birthdays for specific date
router.get('/api/birthdays/:date', async (req, res) => {
    try {
        const birthdays = await Birthday.findAll({
            where: { 
                userId: req.session.userId,
                birthDate: req.params.date
            }
        });
        res.json(birthdays);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new birthday
router.post('/api/birthdays', async (req, res) => {
    try {
        const birthday = await Birthday.create({
            ...req.body,
            userId: req.session.userId
        });
        res.json(birthday);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
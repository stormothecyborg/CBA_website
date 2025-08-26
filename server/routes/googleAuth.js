// In a new file, e.g., routes/googleAuth.js

const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, jwtToken) => {
                    if (err) throw err;
                    res.json({ token: jwtToken, user: { id: user.id, username: user.username, email: user.email } });
                }
            );
        } else {
            // New user, register them
            const newUser = new User({
                username: name,
                email,
                googleId,
                // You might add a field for a password later if needed
            });
            await newUser.save();

            const payload = {
                user: {
                    id: newUser.id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, jwtToken) => {
                    if (err) throw err;
                    res.json({ token: jwtToken, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
                }
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// user apply for account
exports.applyForAccess = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({
            fullName,
            email,
            role,
            accountStatus: 'Pending'
        });

        await newUser.save();
        res.status(201).json({ message: 'Application submitted successfully. Waiting for manager approval.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// admin approve user account
exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.accountStatus = 'Approved';
        await user.save();

        res.status(200).json({ message: `User ${user.email} has been approved` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// approved user sets their passwords for acc activation
exports.setupPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.bodyl

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.accountStatus === 'Pending') {
            return res.status(403).json({ message: 'Your account has not been approved yet.' });
        }
        if (user.accountStatus === 'Active') {
            return res.status(400).json({ message: 'Account is already active. You can log in.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.accountState = 'Active';
        await user.save();

        res.status(200).json({ message: 'Password set successfully. Your cna now login.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// normal login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Invalid credentials' });

        if (user.accountStatus !== 'Active') {
            return res.status(403).json({ message: 'Your account is not active. Please contact your manager.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

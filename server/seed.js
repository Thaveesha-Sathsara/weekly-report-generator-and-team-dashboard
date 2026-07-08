const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/user.model')
require('dotenv').config()

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@sisenco.com';

        // check if the manager already exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Manager already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const admin = new User({
            fullName: 'System Manager',
            email: email,
            passwordHash: passwordHash,
            role: 'Manager',
            accountStatus: 'Active'
        });

        await admin.save();
        console.log('Manager seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding manager:', error);
        process.exit(1);
    }
};

seedManager();
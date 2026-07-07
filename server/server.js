const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import authRoutes from './routes/auth.routes.js';

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//db connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
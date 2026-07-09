const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require ('./routes/auth.routes.js');
const projectRoutes = require('./routes/project.routes.js');
const reportRoutes = require('./routes/report.routes.js');
const aiRoutes = require('./routes/ai.routes.js');

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
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
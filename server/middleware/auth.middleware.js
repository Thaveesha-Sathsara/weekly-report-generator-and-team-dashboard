const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token: token.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user - decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.managerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Manager') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a Manager' });
    }
};
const jwt=require('jsonwebtoken');
const User=require('./../models/user');
require('dotenv').config();
const verifyToken=async (req, res, next)=>{
     try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);
        if (!user) return res.status(401).json({ message: 'Invalid token' });

        req.user = user;  // ✅ attach user to request
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports=verifyToken;
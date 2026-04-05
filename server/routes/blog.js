const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');

// Middleware to verify admin
const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });
        const decoded = jwt.verify(token, 'your_jwt_secret');
        if (decoded.role !== 'admin' && decoded.role !== 'Super Admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.user = decoded;
        next();
    } catch (e) { res.status(401).json({ message: 'Invalid token' }); }
};

// Public: Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: Create blog
router.post('/', isAdmin, async (req, res) => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// Admin: Update blog
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(blog);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// Admin: Delete blog
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;

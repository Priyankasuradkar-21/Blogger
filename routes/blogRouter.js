const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, upload } = require('../controller/blogController');
const userMiddleware = require('../middleware/userAuthentication');
const router = express.Router();

router.post('/blog/create', userMiddleware, upload.single('Blog'), createBlog);
router.patch('/blog/update', userMiddleware, updateBlog);
router.get('/blog/get/:id', userMiddleware, getBlog);
router.get('/blog/all', userMiddleware, getAllBlog);
router.delete('/blog/delete/:id', userMiddleware, deleteBlog);
module.exports = router;
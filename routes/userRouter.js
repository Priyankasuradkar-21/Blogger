const express = require('express');
const { login, userRegistration, updateUser, getUser, deleteUser } = require('../controller/userController');
const userMiddleware = require('../middleware/userAuthentication');
const router = express.Router();


router.post('/user/create',userRegistration);
router.post('/user/login', login)
router.patch('/user/update', userMiddleware, updateUser);
router.get('/user/get/:id', userMiddleware, getUser); 
router.delete('/user/delete', userMiddleware, deleteUser); 
module.exports = router;
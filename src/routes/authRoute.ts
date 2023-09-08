const authController = require('./../controllers/authController');
const express = require('express');

let router = express.Router();

// anybody can access this routes
router.get('/:id/verify/:token', authController.verifyUser)
router.post('/signUp', authController.SignUp)
router.post('/signIn', authController.Login)
router.post('/forgottenPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.get('/allUsers', 
// authController.restrictTo("admin"), 
authController.getAllUsers)

// only logged in users have access to this routes
router.use(authController.protect)
router.patch('/updatePassword', authController.updatePassword);
router.patch('/myProfile', authController.updateMe)
router.patch('/deleteAccount', authController.deleteMe)

// only admins have access to this route
router.use(authController.restrictTo("user"))
router.get('/:id', authController.getUserById)
router.get('/me', authController.getUser)


module.exports = router;
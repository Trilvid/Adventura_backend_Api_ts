const myauthController = require('./../controllers/authController');
const myexpress = require('express');

let routerx = myexpress.Router();

// anybody can access this routes
routerx.get('/:id/verify/:token', myauthController.verifyUser)
routerx.post('/signUp', myauthController.SignUp)
routerx.post('/signIn', myauthController.Login)
routerx.post('/forgottenPassword', myauthController.forgotPassword)
routerx.patch('/resetPassword/:token', myauthController.resetPassword)

routerx.get('/allUsers', 
// myauthController.restrictTo("admin"), 
myauthController.getAllUsers)

// only logged in users have access to this routes
routerx.use(myauthController.protect)
routerx.patch('/updatePassword', myauthController.updatePassword);
routerx.patch('/myProfile', myauthController.updateMe)
routerx.patch('/deleteAccount', myauthController.deleteMe)

// only admins have access to this route
routerx.use(myauthController.restrictTo("user"))
routerx.get('/:id', myauthController.getUserById)
routerx.get('/me', myauthController.getUser)


module.exports = routerx;
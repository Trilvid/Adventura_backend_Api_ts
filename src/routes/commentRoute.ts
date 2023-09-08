const mauthController = require('../controllers/authController');
const ourcommentController = require('../controllers/commentController');
const yexpress = require('express');

const routery = yexpress.Router({ mergeParams: true });

routery.get('/allComment', ourcommentController.getAllComments)
routery.get('/:id', ourcommentController.getComment)
routery.post('/', ourcommentController.newComment)

// only logged in users can use this route
routery.use(mauthController.protect, mauthController.restrictTo('user'))   
routery.delete('/:id', ourcommentController.deleteComment)

// nested route for comments
// router.post('/', commentController.newComment)


module.exports = routery;
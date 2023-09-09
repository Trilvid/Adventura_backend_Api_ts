const mauthController = require('../controllers/authController');
const ourcommentController = require('../controllers/commentController');
const yexpress = require('express');

const routery = yexpress.Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/comment/allComment:
 *  get:
 *      tags:
 *      - Comments
 *      summary: Get all comments 
 *      description: This is shows all available comments in this platform
 *      responses:
 *          200:
 *              description: App is up and running
 * 
 * /api/v1/stories/{storyId}/comments:
 *  post:
 *      tags:
 *      - Comments
 *      summary: Create a new Story
 *      parameters:
 *      - name: storyId
 *      in: path
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateComment'
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * '/api/v1/comment/{commentId}':
 *  get:
 *      tags:
 *      - Comments
 *      summary: Gets a single comment by the commentId
 *      parameters:
 *      - name: commentId
 *      in: path
 *      description: The comment id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Comment not Found 
 * 
 * '/api/v1/comment/{id}':
 *  delete:
 *      tags:
 *      - Comments
 *      summary: Delete a comment
 *      parameters:
 *      - name: id
 *      in: path
 *      description: This route deletes a comment
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Story not Found
 *
 *   
 */

routery.get('/allComment', ourcommentController.getAllComments)
routery.get('/:id', ourcommentController.getComment)
routery.post('/', ourcommentController.newComment)

// only logged in users can use this route
routery.use(mauthController.protect, mauthController.restrictTo('user'))   
routery.delete('/:id', ourcommentController.deleteComment)

// nested route for comments
// router.post('/', commentController.newComment)


module.exports = routery;
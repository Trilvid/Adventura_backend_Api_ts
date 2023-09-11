const authController = require('../controllers/authController');
const storyController = require('../controllers/storyController');
const commentRouter = require('./../routes/commentRoute')
const express = require('express');

const router = express.Router();


/**
 * @openapi
 * /api/v1/stories/allstories:
 *  get:
 *      tags:
 *      - Stories
 *      summary: Get all available stories 
 *      description: This is shows all available stories in this platform
 *      responses:
 *          200:
 *              description: App is up and running
 * 
 * /api/v1/stories/newstory:
 *  post:
 *      tags:
 *      - Stories
 *      summary: Create a new Story
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateStoryInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:          
 *                          $ref: '#/components/schemas/StoryResponse'          
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * '/api/v1/stories/{storyId}':
 *  get:
 *      tags:
 *      - Stories
 *      summary: Gets a single story by the storyId
 *      parameters:
 *      - name: storyId
 *      in: path
 *      description: The story id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Story not Found 
 * 
 * '/api/v1/stories/':
 *  get:
 *      tags:
 *      - Stories
 *      summary: History
 *      description: Gets all stories posted by this user
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Story not Found 
 * 
 * '/api/v1/stories/{id}':
 *  delete:
 *      tags:
 *      - Stories
 *      summary: Delete a story
 *      parameters:
 *      - name: id
 *      in: path
 *      description: This route deletes a story
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Story not Found
 *
 *   
 */


router.use('/:storyId/comments', commentRouter)
router.get('/allstories', storyController.getAllStories)
router.get('/:id', storyController.getAStory)

// only logged in users can use this route 
router.use(authController.protect, authController.restrictTo('user'))
router.get('/', storyController.prevStory)
router.post('/newstory', storyController.newStory)
router.delete('/:id', storyController.deleteStory)




module.exports = router;


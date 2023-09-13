"use strict";
const myauthController = require('./../controllers/authController');
const myexpress = require('express');
const routerx = myexpress.Router();
/**
 * @openapi
 * /api/v1/users/allusers:
 *  get:
 *      tags:
 *      - User
 *      summary: Get all registered user
 *      description: This is shows all users in this system
 *      responses:
 *          200:
 *              description: App is up and running
 *
 * /api/v1/auth/signup:
 *  post:
 *      tags:
 *      - User
 *      summary: Register a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserResponse'
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * '/api/v1/users/{id}':
 *  get:
 *      tags:
 *      - User
 *      summary: Gets a single user by the userId
 *      parameters:
 *      - name: userId
 *      in: path
 *      description: The users id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/CreateUserInput'
 *          404:
 *              description: User not Found
 *
 * '/api/v1/users/me':
 *  get:
 *      tags:
 *      - User
 *      summary: Gets a logged in user
 *      description: Gets the logged in Users details
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: User not Found
 *
 * /api/v1/auth/signin:
 *  post:
 *      tags:
 *      - User
 *      summary: Login a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginUser'
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/users/forgottenpassword:
 *  post:
 *      tags:
 *      - User
 *      summary: Forgotten user password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserForgottenPassword'
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * '/api/v1/users/resetpassword/{token}':
 *  patch:
 *      tags:
 *      - User
 *      summary: Reset user password
 *      parameters:
 *      - name: token
 *      in: path
 *      description: The token sent to your email
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/UserResetPassword'
 *          404:
 *              description: User not Found
 *
 * '/api/v1/auth/{id}/verify/{token}':
 *  get:
 *      tags:
 *      - User
 *      summary: Verify your email adddress
 *      parameters:
 *      - name: token
 *      - name: id
 *      in: path
 *      description: The email verification was sent to your email
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: User not Found
 *
 * /api/v1/users/updatepassword:
 *  patch:
 *      tags:
 *      - User
 *      summary: Change user password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/updatePassword'
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/users/myprofile:
 *  patch:
 *      tags:
 *      - User
 *      summary: Change user profile
 *      description: the photo field should contain the url to the picture
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/userProfile'
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/users/deleteAccount:
 *  delete:
 *      tags:
 *      - User
 *      summary: Delete a user account
 *      description: delete can only work for a logged in user
 *      responses:
 *          200:
 *              description: Success
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 */
// anybody can access this routes
routerx.get('/:id/verify/:token', myauthController.verifyUser);
routerx.post('/signup', myauthController.SignUp);
routerx.post('/signin', myauthController.Login);
routerx.post('/forgottenpassword', myauthController.forgotPassword);
routerx.patch('/resetpassword/:token', myauthController.resetPassword);
// only logged in users have access to this routes
routerx.use(myauthController.protect);
routerx.patch('/updatepassword', myauthController.updatePassword);
routerx.patch('/myprofile', myauthController.updateMe);
routerx.patch('/deleteaccount', myauthController.deleteMe);
// only admins have access to this route
routerx.get(`/me`, myauthController.restrictTo('user', 'admin'), myauthController.getUser);
routerx.use(myauthController.restrictTo("admin"));
routerx.get('/allusers', myauthController.getAllUsers);
routerx.get('/:id', myauthController.getUserById);
module.exports = routerx;

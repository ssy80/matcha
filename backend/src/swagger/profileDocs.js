/**
 * @swagger
 * /api/profile/update:
 *   patch:
 *     summary: Update user profile
 *     description: Partially update user profile information including personal details, preferences, interests, and pictures.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "john.doe@example.com"
 *               gender:
 *                 type: string
 *                 description: User's gender
 *                 example: "male"
 *               biography:
 *                 type: string
 *                 description: User's biography/description
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Love hiking and reading books. Looking for meaningful connections."
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth (YYYY-MM-DD), must be at least 18 years old
 *                 example: "1990-05-15"
 *               sexual_preference:
 *                 type: string
 *                 description: User's sexual preference
 *                 example: "male"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user interests
 *                 example: ["#music", "#jog", "#movie"]
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of base64 encoded images or image URLs
 *                 example: [
 *                      {"base64_image": "data:image/png;base64,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", "isProfilePicture": 1},        
 *                      {"base64_image": "data:image/png;base64,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", "isProfilePicture": 0}
 *                       ]
 *     responses:
 *       '201':
 *         description: Profile successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidFirstname:
 *                       value: "invalid firstname"
 *                     invalidLastname:
 *                       value: "invalid lastname"
 *                     invalidEmail:
 *                       value: "invalid email"
 *                     invalidGender:
 *                       value: "invalid gender"
 *                     invalidBiography:
 *                       value: "invalid biography"
 *                     invalidDateOfBirth:
 *                       value: "invalid date of birth"
 *                     invalidSexualPreference:
 *                       value: "invalid sexual preferences"
 *                     invalidInterests:
 *                       value: "invalid interests"
 *                     invalidPictures:
 *                       value: "invalid pictures"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '409':
 *         description: Conflict - Email already in use by another user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "email in use"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieve the complete profile information of the currently authenticated user including personal details, interests, and pictures.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User ID
 *                       example: 123
 *                     username:
 *                       type: string
 *                       description: User's username
 *                       example: "johndoe123"
 *                     first_name:
 *                       type: string
 *                       description: User's first name
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       description: User's last name
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                       example: "john.doe@example.com"
 *                     gender:
 *                       type: string
 *                       description: User's gender
 *                       example: "male"
 *                     biography:
 *                       type: string
 *                       description: User's biography/description
 *                       example: "Love hiking and reading books. Looking for meaningful connections."
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       description: User's date of birth (YYYY-MM-DD)
 *                       example: "1990-05-15"
 *                     sexual_preference:
 *                       type: string
 *                       description: User's sexual preference
 *                       example: "heterosexual"
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of user interests
 *                       example: ["hiking", "reading", "music", "travel"]
 *                     pictures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of user pictures (URLs or base64 encoded)
 *                       example: [
 *                          {"picture":"http://localhost:3000/images/2d9f1228febe150178f255115348f5f6.png",
 *                           "is_profile_picture":1},
 *                          {"picture":"http://localhost:3000/images/2fcfcaa2519ee1251692867be19cecb8.png",
 *                          "is_profile_picture":0}]
 *                     fame_rating:
 *                       type: object
 *                       description: Fame rating information
 *                       properties:
 *                         stars:
 *                           type: integer
 *                           example: 4
 *                         liked_count:
 *                           type: integer
 *                           example: 150
 * 
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '409':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "no such user"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/viewed_me_list:
 *   get:
 *     summary: Get list of users who viewed my profile
 *     description: Retrieve a list of users who have viewed the current user's profile, ordered by most recent view first.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of users who viewed my profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 viewed_me_list:
 *                   type: array
 *                   description: List of users who viewed the profile, ordered by most recent first
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: User ID of the viewer
 *                         example: 456
 *                       username:
 *                         type: string
 *                         description: Username of the viewer
 *                         example: "janedoe456"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the profile was viewed
 *                         example: "2024-01-15T10:30:00Z"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/liked_me_list:
 *   get:
 *     summary: Get list of users who liked my profile
 *     description: Retrieve a list of users who have liked the current user's profile, ordered by most recent like first.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of users who liked my profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 liked_me_list:
 *                   type: array
 *                   description: List of users who liked the profile, ordered by most recent first
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: User ID of the user who liked the profile
 *                         example: 456
 *                       username:
 *                         type: string
 *                         description: Username of the user who liked the profile
 *                         example: "janedoe456"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the profile was liked
 *                         example: "2024-01-15T10:30:00Z"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     description: Retrieve detailed profile information of a specific user including location, fame rating, online status, and relationship status (likes, blocks). Automatically records a view history when viewing other users' profiles.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID of the profile to retrieve
 *         example: 456
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User ID
 *                       example: 456
 *                     username:
 *                       type: string
 *                       description: Username
 *                       example: "janedoe456"
 *                     first_name:
 *                       type: string
 *                       description: First name
 *                       example: "Jane"
 *                     last_name:
 *                       type: string
 *                       description: Last name
 *                       example: "Doe"
 *                     gender:
 *                       type: string
 *                       description: Gender
 *                       example: "female"
 *                     biography:
 *                       type: string
 *                       description: Biography/description
 *                       example: "Love hiking and photography"
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       description: Date of birth
 *                       example: "1992-08-20"
 *                     age:
 *                       type: integer
 *                       description: Calculated age
 *                       example: 31
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of interests
 *                       example: ["hiking", "photography", "travel"]
 *                     sexual_preference:
 *                       type: string
 *                       description: Sexual preference
 *                       example: "heterosexual"
 *                     pictures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of pictures
 *                       example: [
 *                          {"picture":"http://localhost:3000/images/2d9f1228febe150178f255115348f5f6.png",
 *                           "is_profile_picture":1},
 *                          {"picture":"http://localhost:3000/images/2fcfcaa2519ee1251692867be19cecb8.png",
 *                          "is_profile_picture":0}]
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           format: float
 *                           example: 40.7128
 *                         longitude:
 *                           type: number
 *                           format: float
 *                           example: -74.0060
 *                         neighborhood:
 *                           type: string
 *                           example: "Manhattan"
 *                         city:
 *                           type: string
 *                           example: "New York"
 *                         country:
 *                           type: string
 *                           example: "USA"
 *                     distance_km:
 *                       type: number
 *                       format: float
 *                       description: Distance from current user in kilometers
 *                       example: 15.75
 *                     fame_rating:
 *                       type: object
 *                       description: Fame rating information
 *                       properties:
 *                         stars:
 *                           type: integer
 *                           example: 4
 *                         liked_count:
 *                           type: integer
 *                           example: 150
 *                     last_seen:
 *                       type: string
 *                       format: date-time
 *                       description: Last seen timestamp
 *                       example: "2024-01-15T14:30:00Z"
 *                     is_liked_me:
 *                       type: boolean
 *                       description: Whether this user liked the current user's profile
 *                       example: true
 *                     is_i_liked:
 *                       type: boolean
 *                       description: Whether the current user liked this user's profile
 *                       example: false
 *                     is_blocked:
 *                       type: boolean
 *                       description: Whether the current user blocked this user
 *                       example: false
 *       '400':
 *         description: Invalid user ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid view user id"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '409':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "no such user"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/liked_profile:
 *   post:
 *     summary: Like or unlike a user profile
 *     description: Like or unlike another user's profile. Both users must have profile pictures to perform this action. Cannot like your own profile.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - liked_user_id
 *               - is_liked
 *             properties:
 *               liked_user_id:
 *                 type: integer
 *                 description: ID of the user to like/unlike
 *                 example: 456
 *               is_liked:
 *                 type: boolean
 *                 description: true to like, false to unlike
 *                 example: true
 *     responses:
 *       '201':
 *         description: Successfully liked/unliked the profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidLikedUserId:
 *                       value: "invalid liked user id"
 *                     invalidIsLiked:
 *                       value: "invalid is_liked"
 *       '409':
 *         description: Operation failed due to business rules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidUser:
 *                       value: "invalid liked user"
 *                     noProfilePicture:
 *                       value: "no profile picture"
 *                     cannotLikeOwnself:
 *                       value: "cannot liked ownself"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/fame_rating/{id}:
 *   get:
 *     summary: Get user's fame rating
 *     description: Retrieve the fame rating information for a specific user including stars and like count.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to get fame rating for
 *         example: 456
 *     responses:
 *       '200':
 *         description: Successfully retrieved fame rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 fame_rating:
 *                   type: object
 *                   properties:
 *                     stars:
 *                       type: integer
 *                       description: Star rating based on popularity (0-5)
 *                       example: 4
 *                     liked_count:
 *                       type: integer
 *                       description: Number of likes received by the user
 *                       example: 150
 *       '400':
 *         description: Invalid user ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid user id"
 *       '409':
 *         description: Unable to calculate fame rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "unable to calculate fame rating"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/online/{id}:
 *   get:
 *     summary: Get user's online status
 *     description: Retrieve the last seen timestamp for a specific user to determine their online status.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to get online status for
 *         example: 456
 *     responses:
 *       '200':
 *         description: Successfully retrieved online status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 last_seen:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the user was last active
 *                   example: "2024-01-15T14:30:00Z"
 *       '400':
 *         description: Invalid user ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid user id"
 *       '409':
 *         description: User not found or no online status available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid user id"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/viewed_me/{id}:
 *   get:
 *     summary: Check if a user viewed my profile
 *     description: Check whether a specific user has viewed the current user's profile.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to check if they viewed current user's profile
 *         example: 456
 *     responses:
 *       '200':
 *         description: Successfully checked view status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 is_viewed_me:
 *                   type: boolean
 *                   description: Whether the specified user has viewed the current user's profile
 *                   example: true
 *       '400':
 *         description: Invalid user ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid viewed me user id"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/liked_me/{id}:
 *   get:
 *     summary: Check if a user liked my profile
 *     description: Check whether a specific user has liked the current user's profile.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to check if they liked current user's profile
 *         example: 456
 *     responses:
 *       '200':
 *         description: Successfully checked like status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 is_liked_me:
 *                   type: boolean
 *                   description: Whether the specified user has liked the current user's profile
 *                   example: true
 *       '400':
 *         description: Invalid user ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "invalid liked me user id"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/blocked_user:
 *   post:
 *     summary: Block or unblock a user
 *     description: Block or unblock a specific user. Cannot block your own profile.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocked_user_id
 *               - is_blocked
 *             properties:
 *               blocked_user_id:
 *                 type: integer
 *                 description: ID of the user to block/unblock
 *                 example: 456
 *               is_blocked:
 *                 type: boolean
 *                 description: true to block, false to unblock
 *                 example: true
 *     responses:
 *       '201':
 *         description: Successfully blocked/unblocked the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidBlockedUserId:
 *                       value: "invalid blocked user id"
 *                     invalidIsBlocked:
 *                       value: "invalid is_blocked"
 *       '409':
 *         description: Operation failed due to business rules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidUser:
 *                       value: "invalid blocked user"
 *                     cannotBlockOwnself:
 *                       value: "cannot block ownself"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */


/**
 * @swagger
 * /api/profile/faked_user:
 *   post:
 *     summary: Report or unreport a user as fake
 *     description: Report or unreport a specific user's profile as fake. Cannot report your own profile.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - faked_user_id
 *               - is_faked
 *             properties:
 *               faked_user_id:
 *                 type: integer
 *                 description: ID of the user to report/unreport as fake
 *                 example: 456
 *               is_faked:
 *                 type: boolean
 *                 description: true to report as fake, false to remove fake report
 *                 example: true
 *     responses:
 *       '201':
 *         description: Successfully reported/unreported the user as fake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidFakedUserId:
 *                       value: "invalid faked user id"
 *                     invalidIsFaked:
 *                       value: "invalid is_faked"
 *       '409':
 *         description: Operation failed due to business rules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidUser:
 *                       value: "invalid faked user"
 *                     cannotFakeOwnself:
 *                       value: "cannot faked ownself"
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */

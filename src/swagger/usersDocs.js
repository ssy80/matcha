/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided information and sends an activation email
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - first_name
 *               - last_name
 *               - user_password
 *               - date_of_birth
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *                 minLength: 3
 *                 maxLength: 50
 *               username:
 *                 type: string
 *                 description: User's username (alphanumeric)
 *                 example: "johndoe123"
 *                 minLength: 3
 *                 maxLength: 50
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *                 minLength: 3
 *                 maxLength: 50
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *                 minLength: 3
 *                 maxLength: 50
 *               user_password:
 *                 type: string
 *                 description: User's password (must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character)
 *                 example: "Password123!"
 *                 minLength: 6
 *                 maxLength: 12
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth (YYYY-MM-DD), must be at least 18 years old
 *                 example: "1990-01-15"
 *     responses:
 *       '201':
 *         description: User successfully registered
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
 *       '409':
 *         description: Conflict - Username or email already in use
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
 * /api/users/activate:
 *   post:
 *     summary: Activate user account
 *     description: Activates a user account using the activation UUID sent via email
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activation_uuid
 *             properties:
 *               activation_uuid:
 *                 type: string
 *                 description: Activation UUID received via email
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 format: uuid
 *     responses:
 *       '201':
 *         description: User successfully activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid request data
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
 *                   example: "invalid activation uuid"
 *       '409':
 *         description: Conflict - Activation failed
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
 *                     invalidActivationUuid:
 *                       value: "invalid activation uuid"
 *                     invalidUserStatus:
 *                       value: "invalid user status"
 *                     invalidUserActivationStatus:
 *                       value: "invalid user activation status"
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
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with username and password, returns JWT token upon successful login
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username (alphanumeric)
 *                 example: "johndoe123"
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 description: User's password (must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character)
 *                 example: "Password123!"
 *                 minLength: 6
 *                 maxLength: 12
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwiaWF0IjoxNzA0MDAwMDAwLCJleHAiOjE3MDQwMDM2MDB9.abc123def456"
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
 *                     invalidUsername:
 *                       value: "invalid username"
 *                     invalidPassword:
 *                       value: "invalid password"
 *       '409':
 *         description: Authentication failed
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
 *                     noUser:
 *                       value: "no user with this username"
 *                     notActivated:
 *                       value: "user is not activated"
 *                     passwordMismatch:
 *                       value: "passwords does not match"
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
 * /api/users/reset_password_request:
 *   post:
 *     summary: Request password reset
 *     description: Initiates a password reset process by sending a reset email with UUID token (valid for 10 minutes)
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       '201':
 *         description: Reset password email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Invalid email format
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
 *                   example: "invalid email"
 *       '409':
 *         description: Reset request failed
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
 *                     noUser:
 *                       value: "no user with this email"
 *                     notActivated:
 *                       value: "user is not activated"
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
 * /api/users/reset_user_password:
 *   post:
 *     summary: Reset user password
 *     description: Resets user password using the reset UUID from email (token valid for 10 minutes)
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - reset_uuid
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password (must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character)
 *                 example: "NewPassword123!"
 *                 minLength: 6
 *                 maxLength: 12
 *               reset_uuid:
 *                 type: string
 *                 description: Reset UUID received via email
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 format: uuid
 *     responses:
 *       '201':
 *         description: Password successfully reset
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
 *                     invalidPassword:
 *                       value: "invalid password"
 *                     invalidResetUuid:
 *                       value: "invalid reset uuid"
 *       '409':
 *         description: Reset password failed
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
 *                     invalidResetUuid:
 *                       value: "invalid reset uuid"
 *                     resetExpired:
 *                       value: "reset password expired"
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

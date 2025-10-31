/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a chat message
 *     description: Send a chat message to another user. Both users must have liked each other (connected) and neither user can be blocked.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_user_id
 *               - message
 *             properties:
 *               to_user_id:
 *                 type: integer
 *                 description: ID of the user to send message to
 *                 example: 456
 *               message:
 *                 type: string
 *                 description: Message content (max 500 characters)
 *                 example: "Hello! How are you doing today?"
 *                 maxLength: 500
 *     responses:
 *       '201':
 *         description: Message successfully sent
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
 *                     invalidToUserId:
 *                       value: "invalid to_user_id"
 *                     invalidMessage:
 *                       value: "invalid message"
 *       '409':
 *         description: Cannot send message due to relationship status
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
 *                     notConnected:
 *                       value: "not connected"
 *                     blocked:
 *                       value: "blocked"
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
 * /api/chat/get:
 *   get:
 *     summary: Get chat messages
 *     description: Retrieve all chat messages for the current user and mark them as delivered. Returns messages from all conversations.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   description: Array of chat messages
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Message ID
 *                         example: 123
 *                       from_user_id:
 *                         type: integer
 *                         description: ID of the user who sent the message
 *                         example: 456
 *                       to_user_id:
 *                         type: integer
 *                         description: ID of the user who received the message
 *                         example: 789
 *                       message:
 *                         type: string
 *                         description: Message content
 *                         example: "Hello! How are you?"
 *                       status:
 *                         type: string
 *                         description: Message status (new, delivered, read)
 *                         example: "delivered"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the message was sent
 *                         example: "2024-01-15T14:30:00Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the message was last updated
 *                         example: "2024-01-15T14:30:00Z"
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

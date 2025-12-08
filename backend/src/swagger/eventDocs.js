/**
 * @swagger
 * /api/event/get:
 *   get:
 *     summary: Get user events
 *     description: Retrieve new events for the current user and mark them as delivered. Events typically include notifications about profile views, likes, matches, etc.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 events:
 *                   type: array
 *                   description: Array of new events for the user
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Event ID
 *                         example: 123
 *                       user_id:
 *                         type: integer
 *                         description: User ID associated with the event
 *                         example: 456
 *                       event_type:
 *                         type: string
 *                         description: Type of event (view, like, match, etc.)
 *                         example: "like"
 *                       event_data:
 *                         type: object
 *                         description: Additional data related to the event
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the event was created
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

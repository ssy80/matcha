/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /api/search/suggested_profiles:
 *   get:
 *     summary: Get suggested profiles
 *     description: Retrieves suggested user profiles based on location, shared interests, and fame rating. Requires authentication.
 *     tags:
 *       - Search
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved suggested profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 123
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *                       first_name:
 *                         type: string
 *                         example: "Jane"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       distance_km:
 *                         type: number
 *                         format: float
 *                         example: 5.25
 *                         description: Distance in kilometers (rounded to 2 decimal places)
 *                       interests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["hiking", "reading", "music"]
 *                       num_shared_interest:
 *                         type: integer
 *                         example: 3
 *                         description: Number of shared interests with the user
 *                       fame_rating:
 *                         type: object
 *                         properties:
 *                           stars:
 *                             type: integer
 *                             example: 4
 *                             description: Star rating based on popularity
 *                           liked_count:
 *                             type: integer
 *                             example: 150
 *                             description: Number of likes received
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
 *         description: User location not set or invalid
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
 *                   example: "invalid user location"
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
 * /api/search/search_profiles:
 *   post:
 *     summary: Search user profiles with filters
 *     description: Search for user profiles with various filters including distance, age, interests, and fame rating. Requires authentication and at least one search criteria.
 *     tags:
 *       - Search
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min_dist_km:
 *                 type: number
 *                 format: float
 *                 description: Minimum distance in kilometers (must be used with max_dist_km)
 *                 example: 0
 *               max_dist_km:
 *                 type: number
 *                 format: float
 *                 description: Maximum distance in kilometers (must be used with min_dist_km)
 *                 example: 50
 *               min_age:
 *                 type: integer
 *                 description: Minimum age (must be used with max_age)
 *                 example: 18
 *               max_age:
 *                 type: integer
 *                 description: Maximum age (must be used with min_age)
 *                 example: 35
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of interests to filter by
 *                 example: ["#jog", "#music", "#movie"]
 *               min_stars:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Minimum fame rating stars (0-5, must be used with max_stars)
 *                 example: 3
 *               max_stars:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Maximum fame rating stars (0-5, must be used with min_stars)
 *                 example: 5
 * 
 *     responses:
 *       '200':
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 123
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *                       first_name:
 *                         type: string
 *                         example: "Jane"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       age:
 *                         type: integer
 *                         example: 28
 *                       distance_km:
 *                         type: number
 *                         format: float
 *                         example: 15.75
 *                         description: Distance in kilometers (rounded to 2 decimal places)
 *                       interests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["#jog", "#movie", "#music"]
 *                       fame_rating:
 *                         type: object
 *                         properties:
 *                           stars:
 *                             type: integer
 *                             example: 4
 *                             description: Star rating based on popularity (0-5)
 *                           liked_count:
 *                             type: integer
 *                             example: 150
 *                             description: Number of likes received
 *                       num_shared_interest:
 *                         type: integer
 *                         example: 3
 *                         description: Number of shared interests with the user
 * 
 *       '400':
 *         description: Invalid search criteria
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
 *                     invalidMinDist:
 *                       value: "invalid min_dist_km"
 *                     invalidMaxDist:
 *                       value: "invalid max_dist_km"
 *                     invalidDistPair:
 *                       value: "invalid min_dist_km or max_dist_km"
 *                     invalidMinAge:
 *                       value: "invalid min_age"
 *                     invalidMaxAge:
 *                       value: "invalid max_age"
 *                     invalidAgePair:
 *                       value: "invalid min_age or max_age"
 *                     invalidInterests:
 *                       value: "invalid interests"
 *                     invalidMinStars:
 *                       value: "invalid min_stars"
 *                     invalidMaxStars:
 *                       value: "invalid max_stars"
 *                     starsRange:
 *                       value: "min_stars must be between 0 and 5"
 *                     starsPair:
 *                       value: "invalid min_stars or max_stars"
 *                     noCriteria:
 *                       value: "at least one search criteria"
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
 *         description: User location not set or invalid
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
 *                   example: "invalid user location"
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

/**
 * @swagger
 * /api/location/manual_update:
 *   post:
 *     summary: Manually update user location using IP address
 *     description: |
 *       Manually update the user's location by providing an IPv4 address and a neighborhood name.
 *       The IP address is converted to latitude and longitude using an internal IP geolocation service.
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ip
 *               - neighborhood
 *             properties:
 *               ip:
 *                 type: string
 *                 description: Valid IPv4 address used for geolocation lookup
 *                 example: "42.61.211.133"
 *               neighborhood:
 *                 type: string
 *                 description: Neighborhood name (3–50 characters")
 *                 example: "Jurong West"
 *     responses:
 *       '201':
 *         description: Successfully updated user location
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
 *                     invalidIp:
 *                       value: "invalid ip"
 *                     invalidNeighborhood:
 *                       value: "invalid neighborhood"
 *       '502':
 *         description: IP geolocation service unavailable or failed
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
 *                   example: "failed to fetch geolocation data"
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
 * /api/location/update:
 *   post:
 *     summary: Update user location
 *     description: Update the user's location using either coordinates (latitude/longitude) or IP address. Uses OpenCage Geocoding API and ipapi.co to determine location details.
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude coordinate (use with longitude)
 *                 example: 1.3804850253907623
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude coordinate (use with latitude)
 *                 example: 103.69842170992649
 *               ip:
 *                 type: string
 *                 description: IP address for location lookup (alternative to coordinates)
 *                 example: "42.61.211.133"
 *     responses:
 *       '201':
 *         description: Successfully updated user location
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
 *                     invalidLatitude:
 *                       value: "invalid latitude"
 *                     invalidLongitude:
 *                       value: "invalid longitude"
 *                     invalidIp:
 *                       value: "invalid ip"
 *       '409':
 *         description: Invalid location data or geolocation lookup failed
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
 *                     invalidLocationData:
 *                       value: "invalid location data"
 *                     invalidGeolocationData:
 *                       value: "invalid geolocation data"
 *                     invalidIpGeolocationData:
 *                       value: "invalid ip geolocation data"
 *       '502':
 *         description: Geolocation service unavailable
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
 *                     geolocationFailed:
 *                       value: "failed to fetch geolocation data"
 *                     ipGeolocationFailed:
 *                       value: "failed to fetch ip geolocation data"
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
 * /api/location/get:
 *   get:
 *     summary: Get current user's location
 *     description: Retrieve the current user's location information including coordinates and address details.
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 location:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: float
 *                       description: Latitude coordinate
 *                       example: 40.7128
 *                     longitude:
 *                       type: number
 *                       format: float
 *                       description: Longitude coordinate
 *                       example: -74.0060
 *                     neighborhood:
 *                       type: string
 *                       description: Neighborhood name
 *                       example: "Manhattan"
 *                     city:
 *                       type: string
 *                       description: City name
 *                       example: "New York"
 *                     country:
 *                       type: string
 *                       description: Country name
 *                       example: "United States"
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

import express from 'express';
//import {router as userRoutes} from './routes/userRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { swaggerUi, swaggerSpec } from './swagger/swagger.js';


const app = express();
const port = 3000; // Or any other desired port



//app.use() = "Use this function/middleware for incoming requests"
// 1. Security middleware (first)
//app.use(helmet());
//app.use(cors());

//middleware 
app.use(express.json())  //without path, all req will use
//app.use(express.urlencoded({ extended: true }));   //form data

// Routes
app.use('/api/users', userRoutes);

// Define a basic route
/*app.get('/', (req, res) => {
    console.log(`req method: ${req.method}`);
    res.send('Hello World from Express!');
});*/

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve swagger spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// 6. 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 7. Error handling middleware (always last)
/*app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});*/

// Start the server
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

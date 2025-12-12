import express from 'express';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
import locationRoutes from './routes/locationRoutes.js'
import { swaggerUi, swaggerSpec } from './swagger/swagger.js';
import { authenticateToken } from './middlewares/authentication.js';
import searchRoutes from './routes/searchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.API_HOST_PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//app.use(cors());


// 1. Security middleware (first)
//app.use(helmet());
//app.use(cors());
app.use("/images", express.static("public/images"));

//middleware 
//app.use(express.json())  //without path, all req will use
app.use(express.json({ limit: '5mb' }));
//app.use(express.urlencoded({ extended: true }));   //form data

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profile', authenticateToken, profileRoutes);
app.use('/api/location', authenticateToken, locationRoutes);
app.use('/api/search', authenticateToken, searchRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/event', authenticateToken, eventRoutes);



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
/*app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});*/

app.listen(port, '0.0.0.0', () => {
    console.log(`Express app listening at http://0.0.0.0:${port}`);
});

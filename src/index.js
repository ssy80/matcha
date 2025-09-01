const express = require('express');

const app = express();
const port = 3000; // Or any other desired port

// Define a basic route
app.get('/', (req, res) => {
    console.log(`req method: ${req.method}`);
    res.send('Hello World from Express!');
});

// Start the server
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
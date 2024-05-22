const express = require('express');
const connectDB = require('./db');
const app = express();

// Connect DB
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/', require('./routes/route'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
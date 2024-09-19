require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Rotas
const userRoutes = require('./routes/userRoute');
const characterRoutes = require('./routes/characterRoute');

app.use('/users', userRoutes);
app.use('/characters', characterRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
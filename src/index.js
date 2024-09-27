require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Rotas
const userRoutes = require('./routes/userRoute');
const characterRoutes = require('./routes/characterRoute');
const attributesRoutes = require('./routes/attributesRoute');
const inventoryRoutes = require('./routes/inventoryRoute');
const abilitiesRoutes = require('./routes/abilitiesRoute');
const spellsRoutes = require('./routes/spellsRoute');
const diceRoutes = require('./routes/diceRoute');

app.use('/users', userRoutes);
app.use('/characters', characterRoutes);
app.use('/attributes', attributesRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/ability', abilitiesRoutes);
app.use('/spells', spellsRoutes);
app.use('/dice', diceRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
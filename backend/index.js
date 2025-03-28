const express = require('express');
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');
require('dotenv').config();


app.use(cors({
    origin: 'http://localhost:5173',
}));

app.options('*', cors());

app.use(express.json());
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hola mundo!');
});

app.use('/', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).send('Algo salió mal!');
});

app.listen(port, () => {
    console.log(`Servidor en ejecución en http://127.0.0.1:${port}`);
});
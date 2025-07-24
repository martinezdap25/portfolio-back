// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    'http://localhost:3000', // Tu frontend en desarrollo
    'https://portfolio-ignacio-martinez.vercel.app' // Asumo que esta es la URL de tu frontend desplegado, ¡ajústala si es diferente!
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando 🔥');
});

const projectsRoutes = require('./routes/projects');
app.use('/projects', projectsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('🟢 Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('🔴 Error al conectar a MongoDB:', err);
    });

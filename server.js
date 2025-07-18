// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
const allowedOrigins = [
    'http://localhost:3000',
    'https://ignacio-martinez.vercel.app',
];

app.use(cors({
    origin: (origin, callback) => {
        console.log('🌐 Verificando origin:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('🌪️ Origin no permitido por CORS: ' + origin));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando 🔥');
});

const projectsRoutes = require('./routes/projects');
app.use('/projects', projectsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('🟢 Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('🔴 Error al conectar a MongoDB:', err);
    });

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - permitir todo temporalmente
app.use(cors({
    origin: '*', // ⚠️ Esto permite cualquier origen (solo para pruebas)
    credentials: false // no se puede usar true con origin '*'
}));

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

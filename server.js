/**
 * Use npm start at the root of this folder to start the application.
 * You will need node beforehand though.
*/

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory.
app.use(express.static('public'));
app.use(express.static('src'))

// Serve your index.html.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/*
// Works but only for main.js, then the include in main.js (game.js) will not be found this time.
app.get('/src/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/main.js'));
});
*/

// Choose the port to listen on.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Le serveur a démarré sur http://localhost:${PORT} !`);
});

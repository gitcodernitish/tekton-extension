const express = require('express');
const path = require('path');
const app = express();
app.get('/sample', (req, res) => res.send('Hello Tekton Dashboard !'));
app.get('/bundle', (req, res) => res.sendFile(path.resolve(__dirname, './build/static/js/main.40657832.js')));
app.listen(3000, '0.0.0.0');


const express = require('express');
const path = require('path');
const app = express();

const PIPELINES = ["CDM_DLC_PIPELINE", "DAG_PIPELINE1", "DAG_PIPELINE2"];

app.get('/sample', (req, res) => res.send('Hello New Tekton Dashboard !'));
app.get('/bundle', (req, res) => res.sendFile(path.resolve(__dirname, './dist/bundle.js')));
app.get('/pipelines', (req, res) => res.send(JSON.stringify(PIPELINES)));
app.listen(3000, '0.0.0.0');


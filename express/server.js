'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config({ path: '.env' })
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer();

const router = express.Router();

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.get('/', (req, res) => {
  const url = 'http://104.208.71.137:3000'
  proxy.web(req, res, {target: url})
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', router);


module.exports = app;
module.exports.handler = serverless(app);

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

const uri = process.env.TARGET_URL

router.get('/another', (req, res) => res.json({ route: uri }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.get('/', (req, res) => {
  proxy.web(req, res, {target: uri})
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', router);


module.exports = app;
module.exports.handler = serverless(app);

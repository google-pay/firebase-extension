/*
 * Copyright 2021 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const http = require('http');
const express = require('express');
const open = require('open');
const path = require('path');

module.exports = function(options) {
  options = options || {};
  options.port = options.port || 3000;
  options.timeout = options.timeout || (2 * 60 * 1000) // 2 minutes;

  return new Promise((resolve, reject) => {
    const app = express();
    const server = http.createServer(app);

    server.on('error', reject);

    server.listen(options.port, () => {
      open(`http://localhost:${options.port}/?postback`, {wait: true});
    });

    setTimeout(() => {
      server.close();
      reject(`Timeout after ${options.timeout} ms`);
    }, options.timeout);

    app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'token.html'));
      if (req.query.paymentRequest) {
        server.close();
        resolve(JSON.parse(req.query.paymentRequest));
      }
    });
  });
};
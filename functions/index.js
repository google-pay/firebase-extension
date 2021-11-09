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

const functions = require('firebase-functions');
const clients = require('google-pay-psp-client');

// Each PSP contains general config stored as a JSON string
// in a parameter, as well as a sensitive parameter stored
// in Cloud Secrets - getConfig returns both as a single
// object for the given PSP.
function getConfig(psp) {
  let config;
  try {
    config = JSON.parse(process.env[psp.toUpperCase() + '_CONFIG']);
  } catch {
    throw `Config for psp '${psp}' is invalid JSON`;
  }

  // Mapping of the Cloud Secrets parameter names to the
  // config variable names that each PSP expects.
  const names = {
    adyen: {secret: 'ADYEN_API_KEY', config: 'apiKey'},
    braintree: {secret: 'BRAINTREE_PRIVATE_KEY', config: 'privateKey'},
    checkoutltd: {secret: 'CHECKOUTLTD_SECRET_KEY', config: 'secretKey'},
    cybersource: {secret: 'CYBERSOURCE_SECRET_KEY', config: 'merchantsecretKey'},
    square: {secret: 'SQUARE_ACCESS_TOKEN', config: 'accessToken'},
  }[psp];

  config[names.config] = process.env[names.secret];
  if (!config[names.config]) {
    throw `Missing value for ${names.secret}`;
  }
  return config;
}

// Stringify function is the same on each client, this
// just gives us a shortcut to it since we don't always
// have a client object.
function stringify(object) {
  for (const psp in clients) {
    if (clients[psp].stringify) {
      return clients[psp].stringify(object);
    }
  }
}

// Main payment function.
function pay(order) {
  // Make testing payment tokens in the emulator easier.
  if (process.env.FUNCTIONS_EMULATOR) {
    if (!order.currency) {order.currency = 'USD';}
    if (!order.total) {order.total = 100;}
  }

  // Validate PSP and config.
  let error, config, client = clients[order.psp];
  if (client === undefined || client.pay === undefined) {
    error = `Invalid payload value for 'psp': ${order.psp}`;
  } else {
    try {
      config = getConfig(order.psp);
    } catch (e) {
      error = e;
    }
  }

  if (error) {
    return Promise.reject({error: error});
  } else {
    return client.pay(config, order);
  }
}

// Firestore listener.
exports.databasePay = functions.handler.firestore.document.onCreate((snapshot, context) => {
  function respond(response) {
    // Firestore requires coercing response into a simple object.
    return snapshot.ref.update(JSON.parse(stringify(response)));
  }

  return pay(snapshot.data()).then(response => {
    return respond({success: response});
  }).catch(err => {
    return respond({error: err});
  });
});
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

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
  credential: cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS))
});

const db = getFirestore();

async function makePaymentDatabase(paymentRequest) {
  const doc = db.collection('payments').doc();

  try {
    const res = await doc.set(paymentRequest);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}

// Example usage:
//
// const paymentRequest = {
//   psp: 'braintree',
//   total: 100,
//   currency: 'USD',
//   paymentToken: <Google Pay API payment token>
// }
//
// makePaymentDatabase(paymentRequest);
//
// For this example, we use a util to open a local web page
// in the browser which will allow you to choose a payment
// method with Google Pay, which will then send back a
// payment request to the makePaymentDatabase function.

const tokenFromBrowser = require('./util/token-from-browser.js');

tokenFromBrowser()
  .then(makePaymentDatabase)
  .catch(console.error)
  .finally(process.exit);

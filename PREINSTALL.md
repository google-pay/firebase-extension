Use this extension to make payments with your preferred Payment Service Provider (PSP) using Google Pay.

With this extension installed, you can pass a payment token from the [Google Pay API](https://developers.google.com/pay/api) to your Cloud Firestore database. The extension will listen for a request written to the path defined during installation, and then send the request to the PSP's API. It will then write the response back to the same Firestore node.

Write the following JSON payload to your Cloud Firestore instance to make a payment request:

```js
{
  psp: 'braintree',
  total: 100,
  currency: 'USD',
  paymentToken: <Google Pay API payment token>
}
```

As you can see, the PSP is specified in the request payload, which means you can configure and support multiple PSPs using this extension. The following PSPs are currently supported (the value for the 'psp' field above is noted in parentheses):

- Adyen (adyen)
- Braintree (braintree)
- Checkout.com (checkoutltd)
- Cybersource (cybersource)
- Square (square)

#### Additional setup

Before installing this extension, make sure that you've created an account with your selected PSP. When installing this extension, you will need to provide PSP-specific configuration in the form of a JSON string. These are the expected configurations for each PSP:

- [Adyen](https://docs.adyen.com/payment-methods/google-pay/api-only)

  ```js
  {
      "environment": "",
      "merchantAccount": ""
  }
  ```

- [Braintree](https://developer.paypal.com/braintree/docs/guides/google-pay/overview)

  ```js
  {
      "environment": "Sandbox",
      "merchantId": "",
      "publicKey": ""
  }
  ```

- [Checkout.com](https://docs.checkout.com/payments/payment-methods)

  ```js
  {
      "publicKey": ""
  }
  ```

- [Cybersource](https://docs.cybersource.com/en/payments-tech-docs/googlepay.html)

  ```js
  {
      "authenticationType": "",
      "runEnvironment": "",
      "merchantID": "",
      "merchantKeyId": ""
  }
  ```

- [Square](https://developer.squareup.com/docs/payment-form/add-digital-wallets/google-pay)

  ```js
  {
      "environment": ""
  }
  ```

Each PSP also requires a parameter that the extension will store using [Cloud Secret Manager](https://cloud.google.com/functions/docs/configuring/secrets), such as an API key or access token, specific to the PSP.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Firestore
  - Cloud Secret Manager
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

You are also responsible for any fees charged by the PSPs you use.

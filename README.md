# Make Payments with Google Pay

**Author**: Google Pay (**[https://developers.google.com/pay/api](https://developers.google.com/pay/api)**)

**Description**: Makes a payment with Google Pay via one or more supported Payment Service Providers, and writes the response to Cloud Firestore.



**Details**: Use this extension to make payments with your preferred Payment Service Provider (PSP) using Google Pay.

With this extension installed, you can pass a payment token from the [Google Pay API](https://developers.google.com/pay/api) to your Cloud Firestore database. The extension will listen for a request written to the path defined during installation, and then send the request to the PSP's API. It will then write the response back to the same Firestore node.

Write the following JSON payload to your Cloud Firestore instance to make a payment request:

```
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

  ```
  {
      "environment": "",
      "merchantAccount": ""
  }
  ```

- [Braintree](https://developer.paypal.com/braintree/docs/guides/google-pay/overview)

  ```
  {
      "environment": "Sandbox",
      "merchantId": "",
      "publicKey": ""
  }
  ```

- [Checkout.com](https://docs.checkout.com/payments/payment-methods)

  ```
  {
      "publicKey": ""
  }
  ```

- [Cybersource](https://docs.cybersource.com/en/payments-tech-docs/googlepay.html)

  ```
  {
      "authenticationType": "",
      "runEnvironment": "",
      "merchantID": "",
      "merchantKeyId": ""
  }
  ```

- [Square](https://developer.squareup.com/docs/web-payments/google-pay)

  ```
  {
      "environment": ""
  }
  ```

Each PSP also requires a parameter that the extension will store using [Cloud Secret Manager](https://cloud.google.com/functions/docs/configuring/secrets), such as an API key or access token, specific to the PSP.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Cloud Firestore
  - Cloud Secret Manager
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

You are also responsible for any fees charged by the PSPs you use.




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. Realtime Database instances are located in `us-central1`. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Cloud Firestore path: What is the path to the Cloud Firestore collection you want to use for payment requests? You make payment requests by adding documents to this collection; the response will be written back to the same document.

* Adyen Config: If you will use Adyen as a payment processor, specify your account information as a JSON object.

* Adyen API Key: If you will use Adyen as a payment processor, specify your Adyen API key.

* Braintree Config: If you will use Braintree as a payment processor, specify your account information as a JSON object.

* Braintree Private Key: If you will use Braintree as a payment processor, specify your Braintree private key.

* Checkout.com Config: If you will use Checkout.com as a payment processor, specify your account information as a JSON object.

* Checkout.com Secret Key: If you will use Checkout.com as a payment processor, specify your Checkout.com secret key.

* Cybersource Config: If you will use Cybersource as a payment processor, specify your account information as a JSON object.

* Cybersource Secret Key: If you will use Cybersource as a payment processor, specify your Cybersource secret key.

* Square Config: If you will use Square as a payment processor, specify your account information as a JSON object.

* Square Access token: If you will use Square as a payment processor, specify your Square access token.

**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows this extension to access Cloud Firestore to read and process added payment documents.)

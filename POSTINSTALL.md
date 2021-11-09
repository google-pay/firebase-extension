### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

1.  If it doesn't already exist, create the collection you specified during installation: `${param:FIRESTORE_PATH}`.

1.  [Generate a sample Google Pay token](https://developers.google.com/pay/api/web/guides/resources/sample-tokens).

1.  Add a document with information corresponding to your configured PSP. For example:

    ```js
    psp: 'braintree',
    total: 100,
    currency: 'USD',
    paymentToken: <Google Pay API payment token>
    ```

1.  In a few seconds, you'll see result fields appear in the document.

**Note:** You can also use the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) to add a document:

```js
admin
  .firestore()
  .collection("${param:FIRESTORE_PATH}")
  .add({
    psp: 'braintree',
    total: 100,
    currency: 'USD',
    paymentToken: <Google Pay API payment token>
  })
  .then(() => console.log("Payment request submitted!"));
```

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

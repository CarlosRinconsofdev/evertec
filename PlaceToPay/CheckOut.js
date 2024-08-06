curl -X "POST" https://checkout-test.placetopay.com/api/session \
  -H "Content-Type: application/json" \
  -d '{
      "locale": "es_CO",
      "auth": {
        "login":"PJeJwxFo0KWOlNbI22j+ACqgUjDRwW/6FiLcVM4mxJM=",
        "tranKey":"VQOcRcVH2DfL6Y4B4SaK6yhoH/VOUveZ3xT16OQnvxE=",
        "nonce":"NjEzODM2",
        "seed":"2024-08-06T05:17:56.580Z"
      },
      "payment": {
          "reference": "1122334455",
          "description": "Prueba",
          "amount": {
            "currency": "USD",
            "total": 100
          }
      },
      "expiration": "2021-12-30T00:00:00-05:00",
      "returnUrl": "https://dnetix.co/p2p/client",
      "ipAddress": "127.0.0.1",
      "userAgent": "PlacetoPay Sandbox"
  }'


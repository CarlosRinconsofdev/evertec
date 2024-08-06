#!/bin/bash

# Variables
LOGIN="2d9eaf1e662518756a3d78806543af5b"
TRANKEY="uw9xOlpmPPMlehvbXKkBiW1EWHXMEYuoRZScq/RGJNA="
NONCE="MjQ5NTc3"
SEED="2024-08-05T23:14:40.212Z"

# Solicitud POST usando curl
curl -X POST "https://checkout-test.placetopay.com/api/session" \
     -H "Content-Type: application/json" \
     -d '{
           "auth": {
             "login": "'"$LOGIN"'",
             "tranKey": "'"$TRANKEY"'",
             "nonce": "'"$NONCE"'",
             "seed": "'"$SEED"'"
           },
           "amount": 10000,
           "currency": "USD",
           "returnUrl": "https://mywebsite.com/return",
           "cancelUrl": "https://mywebsite.com/cancel"
         }'

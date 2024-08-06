#!/bin/bash

# Variables
LOGIN="662518756a3d78806543af5b"
TRANKEY="XwIBTYtIEDQ4Z5EUTgCK/n80aVBOxrNm4jHPb4NrRHQ="
NONCE="ODAxMDA5"
SEED="2024-08-06T05:46:18.366Z"

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
          "payment": {
          "reference": "1122334455",
          "description": "Prueba",
          "amount": {
            "currency": "USD",
            "total": 100
         },
  }
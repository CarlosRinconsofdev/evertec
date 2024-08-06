curl -X POST "https://checkout-test.placetopay.com/api/session" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{
           "auth": {
             "login": "2d9eaf1e662518756a3d78806543af5b",
             "tranKey": "fBfqSMyBIit5v9GTzZJzUH0j3X6BLrM+ywao0NzdfT8=",
             "nonce": "NTIyMDc2",
             "seed": "2024-08-05T22:42:50.339Z"
           },
           "other_params": "values_here"
         }'
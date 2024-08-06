# Placetopay ChecKout
Api request: 
Protocolo http.
metodo post.

#### Solicitud
```
{
  "auth": {
    "login":"2d9eaf1e662518756a3d78806543af5b",
    "tranKey":"kzf368TEfQhT1OpTCEEbUgryE0RChUL52F0r6G6RRTs=",
    "nonce":"NTM3MzM5",
    "seed":"2024-08-05T23:33:09.041Z"
  },
  "payment": {
          "reference": "1122334455",
          "description": "Prueba",
          "amount": {
            "currency": "USD",
            "total": 100
    }
  },
     "expiration": "2024-12-30T00:00:00-05:00",
      "returnUrl": "https://dnetix.co/p2p/client",
      "ipAddress": "127.0.0.1",
      "userAgent": "PlacetoPay Sandbox"
}
```
#### Respuesta: 
```
{
    "status": {
        "status": "OK",
        "reason": "PC",
        "message": "La petición se ha procesado correctamente",
        "date": "2024-08-05T18:35:30-05:00"
    },
    "requestId": 3042141,
    "processUrl": "https://checkout-test.placetopay.com/spa/session/3042141/c955e1963573cfcd03c5aacca9ffe510"
}
```
## Como funciona:

Para realizar el proceso transaccional por el cual deseamos consumir el servicio api de placetopay es necesario autenticarse con las credenciales otorgadas por el administrador de la aplicacion, **login** y **secretKey** las cuales sirven de insumo para los datos requeridos al momento de la autenticacion, estos son:

**login:** Es el dato para la identificacion del sitio, suministrado previamente.
**secretkey:** Es la credencial que brinda la seguridad al sitio, suministrado previamente.
**seed:** Es la fecha en que se ha generado la autenticacion. Requiere formato ISO8601.
**nonce:** Dato que identifica cada petición como unica. Requiere codificacion en base64.
**trankey:** Se obtiene concatenando los datos nonce + seed + secretkey. Requiere codificacion en base64

El código fuente para obtener los datos segun sus requerimientos se encuentra dentro del fichero ![fichero](credenciales.js), el cual debe ejecutarse **node credenciales.js** al momento de suministrar los datos ya que su disponibilidad para la peticion es de 5 minutos. 

```
const crypto = require('crypto');

const login = "2d9eaf1e662518756a3d78806543af5b";
const secretKey = "3YC5brb5eAR4xBGQ";
const seed = new Date().toISOString();
const rawNonce = Math.floor(Math.random() * 1000000);

const tranKey = Buffer.from(crypto.createHash('sha256').update(rawNonce + seed + secretKey).digest(), 'binary').toString('base64');
const nonce = Buffer.from(rawNonce.toString()).toString('base64');

const body = {
  auth: {
    login: login,
    tranKey: tranKey,
    nonce: nonce,
    seed: seed,
  },
  // ... other params
};


console.log(`seed: ${seed}`);
console.log(`nonce: ${nonce}`);
console.log(`tranKey: ${tranKey}`);
```

Ademas de estos datos se requiere proporcionar los siguientes datos considerado como los parametros de entrada al servicio.

**auth:** Son los datos previamente indicados.

**payment:** Contiene la información del pago que el usuario desea realizar.
 
- referencía: Informacion que nos indica a que tipo de transaccion se refiere. 
- Descripción: Contextualiza sobre la opracion (Por ejemplo en esta ocasion es un prueba).
- amount: contiene el valor del monto y el tipo de moneda.


**expiration:** Indica la fecha y la hora en la que la sesion de pago debe expirar.
**returnUrl:** Se refiere a la url a la cual será redigirido el usuario luego de realizar el pago.
**ipAdress:** Reconoce la direccion ip desde cual se realiza la solicitud de pago.
**userAgent:** Describe el software usuario
 



![evidencia1](/evidencia1.png)
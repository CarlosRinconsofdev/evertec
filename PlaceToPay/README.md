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


**``login``**: Es el dato para la identificacion del sitio, suministrado previamente.

**`secretkey`**: Es la credencial que brinda la seguridad al sitio, suministrado previamente.

**`seed`**: Es la fecha en que se ha generado la autenticacion. Requiere formato ISO8601.

**`nonce`**: Dato que identifica cada petición como unica. Requiere codificacion en base64.

**`trankey`**: Se obtiene concatenando los datos nonce + seed + secretkey. Requiere codificacion en base64

El código fuente para obtener los datos segun sus requerimientos se encuentra dentro del fichero ![fichero](credenciales.js), el cual debe ejecutarse `node credenciales.js` al momento de suministrar los datos ya que su disponibilidad para la peticion es de 5 minutos. 

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

Ademas de estos datos se requiere proporcionar los siguientes parametros de entrada al servicio.

**auth:** Este contiene los datos previamente indicados.

**payment:** Contiene la información del pago que el usuario desea realizar.
 
- referencía: Informacion que nos indica a que tipo de transaccion se refiere. 
- description: Contextualiza sobre la opracion (Por ejemplo en esta ocasion es un prueba).
- amount: contiene el valor del monto y el tipo de moneda.


**`expiration`**: Indica la fecha y la hora en la que la sesion de pago debe expirar.

**`returnUrl`**: Se refiere a la url a la cual será redigirido el usuario luego de realizar el pago.

**`ipAdress`**: Reconoce la direccion ip desde cual se realiza la solicitud de pago.

**`userAgent`**: Describe el navegador o software del usuario.
 
A continuacion se comparte evidencia de la inegracion para el consumo del servicio api de placetopay por medio de la herramienta Postman, sin embargo el código fuente para determinar los datos requeridos para la solicitud está basado en JavaScript y bash, y estos fueron ejecutados en SO linux-Ubuntu.

<image src="evidencia1.png" alt="evidencia1">

### Punto 2

- **Requestid:** Es el identificador de cada solicitud de transaccion que se realiza dentro de la plataforma, el cual sirve para diferentes aspectos, como el rastreo y gestion de las transacciones para el seguimiento de estado y resolución de posibles problemas que ocurran.
Este dato se puede repetir cuando se realiza una solicitud para una sesion de pago con dispersión por ser una solicitud con multiples destinatarios de pago, ademas del pago por recurrencia en donde se genera una solicitud de pago que reiteradamente va ser objeto de transacción.


 Los posibles estados que puede presentar una trasaccion son diferentes gracias a la fase en que se encuentre el proceso o situaciones adversas que afecten el proceso, estos son los siguientes:

**``PENDING``** : Es el estado en que se encuentra una transacción en el momento de validacion y confirmacion del pago, tambien puede presentarse este cuando un pago usuario tiene oportunidad de realizar un nuevo intento en la transaccion ya que posiblemente fue rechazada. En general este estado indica que el proceso transaccional no ha concluido.

**``APPROVED``**: Es el estado en que se encuentra una transaccion que ha sido aprobada y su proceso culminó con exito, es un estado final del proceso.

**``REJECTED``**: Es el estado que presenta la transacción cuando esta ha sido cancelada ya sea por el usuario o su periodo a expirado sin obtener un pago aprobado, es un estado final del proceso.

**``APPROVED_PARTIAL``**: Es el estado que presenta una sesion de pago parcial y el usuario ha pagado una parte del valor total solicitado  y el valor restante está pendiente, aunque todavía sería posible completar la totalidad del valor de pago con otras transacciones.

**``PARTIAL_EXPIRED``**: Es el estado que presenta una sesión de pago parcial cuando el usuario solo pago una fracción del valor total de solicitado y el tiempo disponible para completar el pago ha caducado, es un estado final de proceso.

- **Preautorizacion** Es una sesión de pago en la cual el usuario completa el proceso y el valor de dicha transaccion queda reservado o congelado para que posteriormente por medio de validación, pueda ser modificado, confirmado o cancelado. Está basado en un flujo de trabajo `CHECKIN` y `CHECKOUT`. Un ejemplo claro para este tipo de sesión es el utilizado por las aplicaciones de transporte rentado, ya que cuando el usuario realiza el pago con tarjeta crédito, la aplicación genera la reserva del valor posible total en el momento que se toma  el servicio, pero cuando termina el servicio, este valor total puede cambiar por lo cual requiere validacion si hay modificaciones en el valor inicial por distancia o tiempo  o si el servicio fue cancelado. 

- La diferencia entre el cobro por suscripción y el cobro por recurrencia consta en el tipo de procedimiento que se aplica para cada uno

  El cobro  por recurrencia es un proceso en el cual se genera una solicitud con un valor total de pago determinado y el usuario genera el proceso de pago con tarjeta de credito, posterior a esto se realizan los pagos automaticos, este cobro define concretamente la periodicidad con que esta transacción se va a realizar, para este efecto se definen las transacciones por medio del parametro `recurring`.

  El cobro por suscripcion es en el que se genera un token, es decir el usuario registra un producto financiero como tarjeta credito/debito, el producto es seguramente almacenado por medio de tokenizacion, y luego este medio de pago puede ser usado para realizar los procesos de pagos en la pasarela.

### Punto 3

- Mucho gusto, soy Carlos Rincon Alvarez, analista de soporte para la implementacion de placetopay de Evertec, estoy para brindarle solución a las dificultades que está presentado con la plataforma. Validando el error que me indica que está apareciendo al momento de generar las transacciones puedo indicarle que es una falla tecnica en el proceso de validacion de las credenciales de usuario y gracías a esto es sencillo recuperar el procesamiento de las transacciones. Me indica las credencíales que se le han suministrado en el correo electronico con asunto: Credenciales de registro. De acuerdo a la información que me brinda los datos fueron modificados por parte del usuario, sin embargo en el este momento estoy reestableciendo los valores. Acabo de realizar la prueba de integración y el proceso transaccional me brinda un estatus ok con el mensaje: la peticion se ha procesado correctamente, lo que indica que puede seguir generando los procesos transaccionales, espero haber cumplido a satisfaccion con sus requerimientos, o si tiene alguna otra dificultad con la plataforma me puede indicar. Lo invito a continuar usando nuestros servicios, ya que podemos brindarle un soporte tecnico oportuno y eficaz, agradezco por la confianza que ha depositado en nosotros para realizar sus procesos transaccionales. Estaré atento ante cualquier duda o eventualidad que se le presente. Gracias.

- Mucho gusto, soy Carlos Rincon Alvarez, analista de soporte para la implementacion de placetopay de Evertec, ante las dificultades que estan presentando, me gustaría consultarle cual es el mensaje error que recibe al momento de iniciar el proceso transaccional. De acuerdo a lo que me indica debemos hacer una actualización en el archivo de configuración para las peticiones del procesamiento transaccional, ya que no se está definiendo el dato preciso con el que se determina la caducidad de cada transaccion, permitame unos minutos mientras lo resulvo. De acuerdo ahora ha sido actualizado este archivo y puede retomar con las transacciones, se han realizado las pruebas pertinentes y estas validan que se está generando el proceso correctamente. Gracias.

- Apreciado usuario, me dispongo a brindarle una explicacion clara del funcionamiento de nuestros servicios, me gustaría saber cuales son las dudas o dificultades que encuentra en el proceso para la implementacion del proyecto, y así puedo resolver con mayore enfoque las dificultades, para esto ademas puedo generar un flujo de trabajo sobre como se realiza cada uno de los pasos para la implementacion del proyeco. Me interesa mucho poder dejar el proyecto ejecutandose correctamente en su compañía.

- Sin embargo si considera que mi metodolodía no es buena o no cumple sus expectativas, me excuso en nombre de Evertec y quiero que nos reunamos con el lider de soporte de implementacion y encontremos una solucion a esta dificultad, ya que estoy idoneamente capacitado para brindarle la solución en la implementación del proyecto sin embargo es oportuno realizar una valoracion a mi competencia en el proceso de capacitación a los usuarios. Recuerde que estamos para brindarle soluciones a su medida.

### Punto 4

<image src="/flujograma.jpg" alt="flujo1">




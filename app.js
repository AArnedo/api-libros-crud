//!IMPORTANDO LAS VARIABLES DE ENTORNO
console.log('Aplicacion iniciando..')
require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const dbconnect = require('./config/db')
const librosRoutes = require('./routes/libros')
//!Middelware
const loginMiddleware = require('./middlewares/loginMiddlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')
//!Cors Config
const cors = require('cors');
app.use(cors());



//Para utilizar middleware Login en toda la aplicacion
app.use(loginMiddleware);
//Para que acepten los datos en formato JSON
app.use(express.json());
//Para que utilice nuestras rutas
app.use("/api", librosRoutes);

//MIDDLEWARES
app.use(errorMiddleware);
app.use(notFoundMiddleware);

//? Conexion a la base de datos.
dbconnect().then(() => {
        console.log('El servidor esta corriendo')
}).catch(err =>{
    console.log('No se pudo iniciar el servidor debido a un error en la base de datos')
});

module.exports = app; //Exportamos nuestra aplicacion para delegarle le control a Vercel.
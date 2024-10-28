const mongoose = require('mongoose');

// Funcion para conectar a MongoDB
const dbconnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('URI;', process.env.MONGO_URI)
        console.log('Conexion a base de dato establecida con exito!')
    }
    catch{
        console.error('error en la conexion de la base de dato', err);
        process.exit(1) //! Detenemos el proceso si hay algun error grave en la conexion
    }
}

module.exports = dbconnect;
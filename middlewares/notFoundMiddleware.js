const notFoundMiddleware = (req,res,next) =>{
    res.status(404).send({mensaje: 'La ruta no fue encontrada'});
}

module.exports = notFoundMiddleware
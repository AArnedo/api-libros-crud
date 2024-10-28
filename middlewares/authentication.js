    const TOKEN_SECRETO = 'miTokenSecreto';
    
    const authentication = (req, res, next) =>{
        const token = req.headers['authorization'];
        if (token === TOKEN_SECRETO){
            next()
        } else{
            res.status(403).send({mensaje: "Acceso denegado"})
        }
    };

    module.exports = authentication
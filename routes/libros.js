const express = require('express')
const router = express.Router();
const ModelLibro = require('../models/libromodel.js');
const authentication = require('../middlewares/authentication.js')
const errorMiddleware = require('../middlewares/errorMiddleware.js')

//Obtener todos los libros
router.get('/libros', async (req, res) =>{
    try {
        const libros = await ModelLibro.find();
        res.status(200).send(libros);
    } catch (error) {
        res.status(500).send({mensaje: 'Error al obtener los libros', error})
    }
})

//Obtener libros por medio de un ID
router.get('/libros/:id', async (req, res) =>{
    try {
        const libro = await ModelLibro.findById(req.params.id)
        if (!libro){
            return res.status(404).send({mensaje: 'Libro no encontrado'});
        }
        res.status(200).send(libro)
    } catch (error) {
        /* res.status(500).send({mensaje: 'Error al obtener el libro', error}) */
        next(errorMiddleware);
    }
});

//Crear un nuevo libro
router.post('/libros',authentication, async (req, res) =>{
    const body = req.body
    try {
        const nuevoLibro = await ModelLibro.create(body);
        res.status(201).send(nuevoLibro)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Actualizar un libro por ID
router.put('/libros/:id', async (req, res) =>{
    try {
        const libroActualizado = await ModelLibro.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!libroActualizado){
            return res.status(404).send({mensaje: 'Libro no encontrado'});
        }
        res.status(200).send(libroActualizado)
    } catch (error) {
        res.status(400).send({mensaje: 'Error al actualizar el libro', error})
    }
});

//Eliminar libro por ID
router.delete('/libros/:id', async (req, res) =>{
    try {
        const libroEliminado = await ModelLibro.findByIdAndDelete(req.params.id)
        if (!libroEliminado){
            return res.status(404).send({mensaje: 'Libro no encontrado'})
        }
        res.status(200).send({mensaje: 'Libro eliminado correctamente'})
    } catch (error) {
        res.status(500).send({mensaje: 'Error al eliminar el libro',error})
    }
})

//!---------------------------------------------------------------------
//Obtener libros segun filtros de busqueda (autor, categoria, estado)
router.get('/libros/negocio/busqueda', async (req, res) =>{
    const { autor, categoria, estado } = req.query; //Obtenemos el autor, categoria y estado desde los query
    try {
        const query = {}; //Creamos un objeto vacio para almacenar los filtros
        if (autor) query.autor = autor; //Si el autor esta en los query parameters, lo va a agregar al filtro
        if (categoria) query.categoria = categoria;
        if (estado) query.estado = estado;

        const libros = await ModelLibro.find(query) //Buscamos los libros en los filtros
        
        if(!libros.length){
            res.status(404).send({mensaje: 'No se encontraron los libros con los filtros proporcionados'})
        }
        res.status(200).send(libros);

    } catch (error) {
        res.status(500).send({mensaje: 'Error al obtener los libros', error})
    }
})

//Actualizar el estado de un libro a "Prestado" y agregar fechas de prestamo y devolucion
router.put('/libros/:id/prestar', async (req, res) =>{
    try {
        //Encontramos el libro
        const libro = await ModelLibro.findById(req.params.id);
        if(!libro){
            return res.status(404).send({mensaje: 'Libro no encontrado'})
        }
        libro.estado = 'Prestado'
        libro.fechaPrestamo = new Date(); //Fecha de prestamo va a ser igual a la fecha actual
        //Definir fecha de devolucion(por ejemplo dentro de 14 dias):
        const fechaDevolucion = new Date(); //!Obtiene fecha actual.
        fechaDevolucion.setDate(fechaDevolucion.getDate() + 14); //!Le sumamos 14 dias a la fecha actual.
        libro.fechaDevolucion = fechaDevolucion //!Asignamos la fecha de devolucion al libro.
        //Guardamos el libro
        await libro.save();
        res.status(200).send(libro)

    } catch (error) {
        res.status(400).send({mensaje: 'Error al actualizar el estado del libro', error})
    }
})

//Enpoint para devolver un libro, cambiar el estado a "Disponible" y limpiar fechas de prestamo y devolucion.
router.put('/libros/:id/devolver', async (req, res) =>{
    try {
        //Encontramos el libro
        const libro = await ModelLibro.findById(req.params.id);
        if(!libro) {
            return res.status(404).send({mensaje:'no se encontro el libro'});
        }
        //Actualizar estado:
        libro.estado = 'Disponible';
        libro.fechaPrestamo = null //!Limpiamos fecha
        libro.fechaDevolucion = null //!Limpiamos fecha
        await libro.save() //Guardamos el libro
        res.status(200).send(libro)
    } catch (error) {
        res.status(400).send({mensaje: 'Error al devolver el libro', error})
    }
})

module.exports = router;

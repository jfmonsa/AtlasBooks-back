import express from 'express';

const app = express()

const port = 3001

app.get('/', (req, res) => {
    res.send({
        data: 'Hola mundo'
    })
})

app.listen(port, () => {
    console.log('La aplicacion esta en linea');
})

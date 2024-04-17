const express = require('express')
const handlebars = require('express-handlebars')
const productRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')
const viewsRouter = require('./routes/views.router')
const ProductManager = require('./dao/fileSystem/productmanager')
//const product = require('./ClasesProduct/productmanager')
const { Server, Socket } = require('socket.io')
const dbConnection = require('./config/dbConnection')
const chatModel =require('./models/chat')
const productManager = new ProductManager()

const app = express()

dbConnection()

//configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//
app.use(express.static(`${__dirname}/./public`))

//permitir envio de informacion mediante formularios y json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', viewsRouter)

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

const PORT = 8080

const httpserver = app.listen(PORT, () => {
    console.log(`Expres por local host ${httpserver.address().port}`)
})


httpserver.on("Error", (error) => {
    console.log(`Error del servidor ${error}`)
})

const wsServer = new Server(httpserver)

let productos
let mensajes

wsServer.on('connection', async (clientSocket) => {
    console.log(`Cliente conectado, ID: ${clientSocket.id}`)
    try {
        productos = await productManager.getProduct()
        mensajes = await chatModel.find()
        clientSocket.emit('mensajeServer', productos)
        clientSocket.emit('mensajesChat', mensajes)
    } catch (error) {
        console.log(error)
    }

    clientSocket.on('product', async data => {
        console.log('data: ', data)
        const {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        } = data

        // let producto1 = new product(title, description, price, thumbnail, code, stock)

        if (title == '' || description == '' || price == '' || thumbnail == '' || code == '' || stock == '') {
            console.log('todo mal');
        } else {
            try {
                console.log('Aca estoy');
                await productManager.addProducts(title, description, price, thumbnail, code, stock)
                let datos = await productManager.getProduct()
                wsServer.emit('productoAgregado', datos)
            } catch (error) {
                console.log(error)
            }
        }
    })

    clientSocket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProduct()
            wsServer.emit('prodcutoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })

    clientSocket.on('msg', async data => {
        console.log(data);
        try {
            await chatModel.insertMany(data)
            let datos = await chatModel.find()
            wsServer.emit('newMsg', datos)
        } catch (error) {
            console.log(error)
        }
    })


})
const { Router } = require('express')
const ProductManager = require('../dao/fileSystem/productmanager')
const chatModel = require('../models/chat')

const productManager = new ProductManager()
const route = new Router()

route.get('/products', async (req, res) => {
    try {
        const productos = await productManager.getProduct()
        let datos = {
            productos
        }

        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }

})

route.get('/realTimeProducts', async (__, res) => {
    try {

        res.render('realTimeProducts', {
            title: 'Websockets',
            useWS: true,
            scripts: [
                'index.js'
            ]
        })
    } catch (error) {
        console.log(error)
    }

})
route.get('/chat', (req, res) => {
    res.render('chat')
})

module.exports = route;
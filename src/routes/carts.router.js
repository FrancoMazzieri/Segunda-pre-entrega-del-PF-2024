const { Router } = require('express')
const ProductManager  = require('../dao/fileSystem/productmanager')
const CartManager = require('../dao/fileSystem/cartsManager')
const MongoCartManager = require('../dao/mongo/mongoCartManager')
const productsModel  = require('../models/products')

const CartRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager ()
const mongoCartManager = new MongoCartManager()



CartRouter.post("/", async(req, res)=>{
    res.send(await mongoCartManager.addCarts())
})
CartRouter.get("/", async(req, res)=>{
    res.send(await mongoCartManager.readCarts())
})
CartRouter.get("/:id", async(req, res)=>{
    res.send(await mongoCartManager.getCartById(req.params.id))
})
CartRouter.post("/:cid/products/:pid", async(req, res)=>{
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await mongoCartManager.addProductInCart(cartId, productId))
})

module.exports = CartRouter;
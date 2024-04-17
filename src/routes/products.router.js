const { Router } = require('express')
const productsModel = require('../models/products')
const MongoProductManager = require('../dao/mongo/mongoProductManager')

const ProductRouter = Router();

const mongoProductManager  = new MongoProductManager()

const leerProductos = mongoProductManager.getProduct()

ProductRouter.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit)

    if (!limit) return res.send(await leerProductos)

    let allProduct = await leerProductos

    let productLimit = allProduct.slice(0, limit)

    res.json(productLimit)
})
ProductRouter.get('/:id', async (req, res) => {

    let id = +req.params.id

    let allProduct = await leerProductos

    let productById = allProduct.find(product => product.id === id)

    if (productById) {
        console.log(productById)
    } else {
        console.log("Not found")
    }

    res.json(productById)
})
ProductRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await mongoProductManager.addProducts(newProduct))
})
ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProducts = req.body
    res.send(await mongoProductManager.updateProducts(id, updateProducts))
})

ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await mongoProductManager.deleteProduct(id))
})


module.exports = ProductRouter;
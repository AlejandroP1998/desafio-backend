import express from 'express'
import { ProductManager } from './ProductManager.js'

const app = express()
const manager = new ProductManager('./database/products.json')

app.get('/products', async (req, res) => {
  const limite = parseInt(req.query.limit)
  let products = null
  if (Number.isNaN(limite)) {
    products = await manager.getProducts()
    res.json(products)
  } else {
    products = await manager.getProductsLimited(limite)
    res.json(products)
  }
})

app.get('/products/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid)
  product ? 
    res.json(product)
    : res.status(400).json({"message":"No se encontro el producto con el id "+req.params.pid})
})

const server = app.listen(8080)


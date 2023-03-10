import fs from 'fs/promises'
import { randomUUID } from 'crypto'

//Con esta variable valido que el archivo no se cargue con cada llamada al metodo que lo carga
let loadSuccess = true

//Objeto Product
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        const map = new Map([[title], [description], [price], [thumbnail], [code], [stock]])
        if (map.has("") || map.has(0)) {
            throw ("Todos los campos son obligatorios, creación de producto fallida");
        } else {
            this.title = title
            this.description = description
            this.price = price
            this.thumbnail = thumbnail
            this.code = code
            this.stock = stock
        }
    }
}

//Clase principal
export class ProductManager {

    #path
    #products

    constructor(path) {
        this.#path = path
        this.#products = []
    }

    async #cargar() {
        let file, prod, id = null
        try {
            if (loadSuccess) {
                file = await fs.readFile(this.#path, 'utf-8')
                prod = await JSON.parse(file)
                prod.forEach(element => {
                    this.#products.push(element)
                })
                loadSuccess = false
                return
            } else return
        } catch (error) {
            throw('No se pudo cargar el archivo'+error)
        }
    }

    async getProducts() {
        await this.#cargar()
        return this.#products
    }

    async getProductsLimited(limit) {
        await this.#cargar()
        const prodsLimited = []

        for (let i = 0; i <= limit; i++) { 
            if(i<this.#products.length) prodsLimited.push(this.#products[i])
        }
        return prodsLimited
    }

    async addProduct(product) {
        await this.#cargar()
        let json, id = null;
        if (Object.entries(product).length === 0) {
            throw ('No se añadio el producto, verificar propiedades\n\n');
        } else {
            const codeRepeated = this.#products.some((prod) => prod.code === product.code)
            if (codeRepeated) {
                throw ('El codigo ' + product.code + ' esta repetido, no se añadio el producto\n\n')
            } else {
                id = randomUUID()
                product.id = id
                this.#products.push(product)
                json = JSON.stringify(this.#products, null, 4)
                await fs.writeFile(this.#path, json)
            }
        }
    }

    async getProductById(id) {
        await this.#cargar()
        try {
            const product = this.#products.find((prod) => prod.id === id)
            return product
        } catch (error) {
            throw('--Not found--')
        }

    }

    async updateProduct(id, campo, data) {
        await this.#cargar()
        let json, i = null;
        const modificar = (i, campo, data) => {
            for (const property in this.#products[i]) {
                if (property === campo) {
                    this.#products[i][property] = data
                }
            }
        }
        const idFinded = this.#products.some((prod) => prod.id === id)
        if (idFinded) {
            i = this.#products.findIndex((prod) => prod.id === id)
            modificar(i, campo, data)
            json = JSON.stringify(this.#products, null, 4)
            await fs.writeFile(this.#path, json)
        } else throw ('--- Not found ---\n\n')

    }

    async deleteProduct(id) {
        await this.#cargar()
        let json, i = null
        const idFinded = this.#products.some((prod) => prod.id === id)
        if (idFinded) {
            i = this.#products.findIndex((prod) => prod.id === id),
                this.#products.splice(i, 1)
            json = JSON.stringify(this.#products, null, 4)
            await fs.writeFile(this.#path, json)
            return
        } else throw ('--Not found--')
    }

}
const express = require('express')
const router = express.Router()
const Product = require('../models/products')

router.get('/', async (req, res) => {
    // Get All or Filter by Name
    try {
        const { name } = req.query;

        if (name) {
            // If 'name' query parameter is provided, filter by name
            const filteredProducts = await Product.find({ name: { $regex: new RegExp(name, 'i') } });
            res.json(filteredProducts);
        } else {
            // If 'name' query parameter is not provided, get all products
            const allProducts = await Product.find();
            res.json(allProducts);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', getProduct, (req, res) => { //Get One
    res.json(res.product)
})

router.post('/', async (req, res) => { //Make One
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category
    })

    try {
        const newProdcut = await product.save()
        res.status(201).json(newProdcut)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/:id', getProduct, async (req, res) => { //Update One
    try {
        if (req.body.name != null) {
            res.product.name = req.body.name
        }
        if (req.body.description != null) {
            res.product.description = req.body.description
        }
        if (req.body.price != null) {
            res.product.price = req.body.price
        }
        if (req.body.quantity != null) {
            res.product.quantity = req.body.quantity
        }
        if (req.body.category != null) {
            res.product.category = req.body.category
        }
        const updatedProdcut = await res.product.save()
        res.json(updatedProdcut)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', getProduct, async (req, res) => { //Delete One
    try {
        await res.product.deleteOne()
        res.json({ message: 'Deleted Product' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/', async (req, res) => { //Delete All
    try {
        // Delete all documents in the 'products' collection
        const result = await Product.deleteMany({});
        
        if (result.deletedCount > 0) {
            res.json({ message: 'All products deleted' });
        } else {
            res.json({ message: 'No products found to delete' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ message: 'Connot find product' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.product = product
    next()
}


module.exports = router
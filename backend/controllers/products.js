const Joi = require('joi');
const products = require('../models/products');

const getProducts = async(req, res) => {
    try {
        const response = await products.findAll();
        if (response) {
            res.send(response);
        }        
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

const getProductsByUser = async(req, res) => {
    try {
        const response = await products.findProductByUser(req.params.id);
        if (response) {
            res.send(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

const getProductById = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await products.findProductById(id);
        if (response.length === 1) {
            res.send(response[0]);
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
}

const createProduct = async (req, res) => {

    const schema = Joi.object({
        title: Joi.string().max(60).required(),
        description: Joi.string().optional().allow('').max(255),
        image: Joi.string().optional().allow('').uri({
            scheme: [
              'http',
              'https',
            ]
          }),
        price: Joi.number().integer().min(0).required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        const response = {
            OK: false,
            statusCode: 400,
            error: error.details[0].message,
        }
        res.status(400).send(response);
        return;
    }
    
    try {

    const product = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        seller: req.userData.userId,
    }

    const response = await products.create(product);
    if (response) {
        product.id = response.insertId;
        const resp = {
            OK: true,
            statusCode: 201,
            product: product,
        }
        res.status(201).send(resp);
    }
} catch (err) {
    res.status(500).send("Something went wrong");
}
}

const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const response = await products.deleteById(productId, req.userData.userId);
        if (response) {
            res.status(200).json(productId);
        }        
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
} 



module.exports = { getProducts, getProductById, createProduct, getProductsByUser, deleteProduct};
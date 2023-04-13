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
        }
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
}

const createProduct = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        image: Joi.string(),
        price: Joi.number().required(),
        seller: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    try {

    const product = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        seller: req.body.seller,
    }

    const response = await products.create(product);
    if (response) {
        product.id = response.insertId;
        res.status(201).send(product);
    }
} catch (err) {
    res.status(500).send("Something went wrong");
}
}

const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await products.deleteById(id);
        if (response) {
            res.status(200).json('Product deleted.');
        }        
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
} 



module.exports = { getProducts, getProductById, createProduct, getProductsByUser, deleteProduct};
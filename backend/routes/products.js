const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {getProducts, getProductById, createProduct, getProductsByUser, deleteProduct} = require('../controllers/products');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/users/:id', getProductsByUser);
router.post('/', createProduct);
router.delete('/:id', deleteProduct)
router.use(verifyToken);

module.exports = router;
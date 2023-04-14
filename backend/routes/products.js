const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {getProducts, getProductById, createProduct, getProductsByUser, deleteProduct} = require('../controllers/products');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/users/:id', getProductsByUser);

router.use(verifyToken);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);


module.exports = router;
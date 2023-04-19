const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {getProducts, searchProducts, getProductById, createProduct, getProductsByUser, deleteProduct, editProduct, getPriceRange} = require('../controllers/products');

router.get('/', getProducts);
router.get('/range/', getPriceRange);
router.get('/search/', searchProducts);
router.get('/:id', getProductById);
router.get('/users/:id', getProductsByUser);

router.use(verifyToken);
router.post('/', createProduct);
router.put('/:id', editProduct)
router.delete('/:id', deleteProduct);


module.exports = router;
const Joi = require("joi");
const products = require("../models/products");

const schema = 
  Joi.object({
  title: Joi.string().max(60).required(),
  description: Joi.string().optional().allow("").max(255),
  image: Joi.string()
    .optional()
    .allow("")
    .uri({
      scheme: ["http", "https"],
    }),
  price: Joi.number().integer().min(0).required(),
});

const getProducts = async (req, res) => {  
  try {
    const response = await products.findAll();
    if (response) {
      return res.send(response);
    }
  } catch (err) {
    console.log(err);
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

const getPriceRange = async (req, res) => {
    try {
    const response = await products.getPriceRange();
    if (response) {
      return res.send(response);
    }
  } catch (err) {
    console.log(err);
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
}

const searchProducts = async (req, res) => {
  const schema = Joi.object({
    text: Joi.string().optional().allow(""),
    min: Joi.number().optional(),
    max: Joi.number().optional(),
  })
  const { error } = schema.validate(req.query);
  if (error) {
    const response = {
      OK: false,
      statusCode: 400,
      error: error.details[0].message,
    };
    return res.status(400).send(response);    
  }

  try {
    const minValue = req.query.min ? parseInt(req.query.min) : null;
    const maxValue = req.query.max ? parseInt(req.query.max) : null;
    const response = await products.search(req.query.text, minValue, maxValue);
    if (response) {
      return res.send(response);
    }
  } catch (err) {
    console.log(err);
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
}

const getProductsByUser = async (req, res) => {
  try {
    const response = await products.findProductByUser(req.params.id);
    if (response) {
      return res.send(response);
    }
  } catch (err) {
    console.log(err);
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await products.findProductById(id);
    if (response.length === 1) {
      return res.send(response[0]);
    } else {
      const notFound = {
        OK: false,
        statusCode: 404,
        error: "Product not found.",
      }
      return res.status(404).send(notFound);
    }
  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

const editProduct = async (req, res) => {  
  const { error } = schema.validate(req.body);
  if (error) {
    const response = {
      OK: false,
      statusCode: 400,
      error: error.details[0].message,
    };
    return res.status(400).send(response);
  }

  try {
    const product = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      id: req.params.id,
    };

    const response = await products.update(product, req.userData.userId);
    if (response) {      
        const success = {
            OK: true,
            statusCode: 200,
            product: product,
        } 
        return res.status(200).send(success);
    }
  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

const createProduct = async (req, res) => {
  
  const { error } = schema.validate(req.body);
  if (error) {
    const response = {
      OK: false,
      statusCode: 400,
      error: error.details[0].message,
    };
    return res.status(400).send(response);
  }

  try {
    const product = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      seller: req.userData.userId,
    };
    const response = await products.create(product);
    if (response) {
      product.id = response.insertId;
      const success = {
        OK: true,
        statusCode: 201,
        product: product,
      };
      return res.status(201).send(success);
    }
  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const response = await products.deleteById(productId, req.userData.userId);
    if (response) {
      return res.status(200).send({
        OK: true,
        statusCode: 200,
        productId: productId,
      });
    }
  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getPriceRange,
  getProductById,
  createProduct,
  getProductsByUser,
  deleteProduct,
  editProduct,
};

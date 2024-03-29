const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const users = require('../models/users');

const getUserById = async (req, res) => {
  try {
    const response = await users.findById(req.params.id);
    if (response.length === 1) {
      return res.send(response[0]);
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

const signUpUser = async (req, res) => {
  const { name, email, password, phone} = req.body;
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional().allow('').min(7).max(14),
});

const {error} = schema.validate(req.body);
if (error) {
    const response = {
      OK: false,
      statusCode: 403,
      error: error.details[0].message,
    }
    return res.status(403).send(response);
}
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: 'Could not create user, try again please',
    }
    return res.status(500).send(response);
  }

  const newUser = {
    id: v4(),
    name,
    email,
    password: hashedPassword,
    phone,
  };

  try {
    const exist = await users.findByEmail(newUser.email);
    if(exist.length > 0) {
      const response = {
        OK: false,
        statusCode: 422,
        error: 'Could not create user, user exists',
      }
      return res.status(422).send(response);
    }

    const result = await users.create(newUser);
    if(!result) {
      const response = {
        OK: false,
        statusCode: 500,
        error: 'Could not create user, try again please',
      }
      return res.status(500).send(response);
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    
    const response = {
      OK: true,
      statusCode: 201,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      },
      token: token,
    }
    return res.status(201).send(response);

  } catch (err) {
    const response = {
      OK: false,
      statusCode: 500,
      error: 'Could not create user, try again please',
    }
    return res.status(500).send(response);
  }
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  
  let identifiedUser;
  try {
    const result = await users.findByEmail(email);
    if(!result[0]) {
      const response = {
        OK: false,
        statusCode: 401,
        error: 'User not found - Check your credentials',
      }
      return res.status(401).send(response);
    }
    identifiedUser = result[0];
  } catch (err) {
    console.log(err);
    const response = {
      OK: false,
      statusCode: 500,
      error: err,
    };
    return res.status(500).send(response);    
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    if(!isValidPassword) {
      const response = {
        OK: false,
        statusCode: 401,
        error: 'Invalid password - Check your credentials',
      }
      return res.status(401).send(response);
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

  try {
    const token = jwt.sign(
      {
        id: identifiedUser.id,
        email: identifiedUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      OK: true,
      statusCode: 200,
      user: {
        id: identifiedUser.id,
        name: identifiedUser.name,
        email: identifiedUser.email,
        phone: identifiedUser.phone,
      },
      token: token,
    })
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

module.exports = {
  loginUser,
  signUpUser,
  getUserById
}

const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');

const users = require('../models/users');

const getUserById = async (req, res) => {
  try {
    const response = await users.findById(req.params.id);
    if (response.length === 1) {
      res.send(response[0]);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
}

const signUpUser = async (req, res) => {
  const { name, email, password, phone} = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).send('Could not create user, try again please');
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
      return res.status(422).send('Could create user, user exists');
    }

    const result = await users.create(newUser);
    if(!result) {
      return res.status(500).send('Could not create user, try again please');
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      token
    })

  } catch (err) {
    return res.status(500).send('Could not create user, try again please');
  }
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  
  let identifiedUser;
  try {
    const result = await users.findByEmail(email);
    if(!result[0]) {
      return res.status(401).send('No user found - Check your credentials');
    }
    identifiedUser = result[0];
  } catch (err) {
    return res.status(500).send('Something went wrong');
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    if(!isValidPassword) {
      return res.status(401).send('No user found - Check your credentials');
    }
  } catch (err) {
    return res.status(500).send('Something went wrong');
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

    res.status(201).json({
      id: identifiedUser.id,
      name: identifiedUser.name,
      email: identifiedUser.email,
      phone: identifiedUser.phone,
      token
    })
  } catch (err) {
    return res.status(500).send('Something went wrong');
  }


};

module.exports = {
  loginUser,
  signUpUser,
  getUserById
}

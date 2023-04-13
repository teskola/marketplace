const express = require('express');
const router = express.Router();

const { loginUser, signUpUser, getUserById } = require('../controllers/users');

router.get('/:id', getUserById);
router.post('/signup', signUpUser);
router.post('/login', loginUser);

module.exports = router;
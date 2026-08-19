const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/createContactController');

router.post('/', createContact);

module.exports = router;

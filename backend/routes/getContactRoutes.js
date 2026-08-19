const express = require('express');
const router = express.Router();
const { getContacts } = require('../controllers/getContactController');

router.get('/', getContacts);

module.exports = router;

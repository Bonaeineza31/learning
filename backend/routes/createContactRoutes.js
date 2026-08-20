import express from 'express';
import { createContact } from '../controllers/createContactController.js';

const router = express.Router();

router.post('/', createContact);

export default router;

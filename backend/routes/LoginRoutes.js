import express from 'express';
import {RegisterUser} from '../controllers/LoginConroller.js';

const router = express.Router();

router.post('/', RegisterUser);


export default router;

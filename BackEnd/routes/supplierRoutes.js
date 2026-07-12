import express from 'express';
import { getSuppliers, getSupplierById } from '../controllers/supplierController.js';

const router = express.Router();

router.get('/', getSuppliers);
router.get('/:id', getSupplierById);

export default router;

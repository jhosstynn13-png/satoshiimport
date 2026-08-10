import { Router } from 'express';
import { getCatalog, updateCatalog } from '../controllers/catalogController.js';

const router = Router();

router.get('/', getCatalog);
router.post('/update', updateCatalog);

export default router;

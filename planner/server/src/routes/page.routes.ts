import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createPage,
  getPages,
  updatePage,
  deletePage
} from '../controllers/page.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Page routes
router.post('/', createPage);
router.get('/', getPages);
router.patch('/:id', updatePage);
router.delete('/:id', deletePage);

export default router; 
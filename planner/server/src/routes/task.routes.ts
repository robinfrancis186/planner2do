import express, { RequestHandler } from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  uploadTaskImage,
  downloadTaskImage
} from '../controllers/task.controller';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Apply auth middleware to all routes
router.use(auth);

// Task CRUD routes
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

// File upload/download routes
router.post('/upload/:taskId?', upload.single('image'), uploadTaskImage);
router.get('/download/:fileName', downloadTaskImage);

export default router; 
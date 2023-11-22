import express from 'express';
import { allStudents, getStudent, deleteStudent, updateStudent} from '../controllers/student.controller.js';
import { verifyToken } from '../utils/verifyStudent.js';


const router = express.Router();

router.get('/all', allStudents);
router.post('/update/:id', verifyToken, updateStudent)
router.delete('/delete/:id', verifyToken, deleteStudent)
router.get('/:id', getStudent)

export default router;
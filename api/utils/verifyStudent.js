import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET, async (err, student) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.student = await Student.findById(student.id);

    next();
  });
};

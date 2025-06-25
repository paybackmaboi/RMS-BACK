import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { createRequest, getStudentRequests, getAllRequests, updateRequestStatus, getRequestDocument } from '../controllers/requestController';
import { authMiddleware, adminMiddleware} from '../middleware/authMiddleware';
import upload from '../middleware/fileUpload';

const router = Router();
const adminOrAccountingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const role = req.user?.role;
  if (role === 'admin' || role === 'accounting') {
    next();
  } else {
    res.status(403).json({
      message: 'Forbidden: Access is restricted to admin and accounting',
    });
  }
};

// FIX: Changed to handle multiple documents, up to 5.
router.post('/', authMiddleware, upload.array('documents', 5), createRequest);

// Student gets their own requests.
router.get('/my-requests', authMiddleware, getStudentRequests);

// --- Admin-Only Routes ---
// The following routes are now protected by adminMiddleware.

// Admin gets all requests.
router.get('/', authMiddleware, adminOrAccountingMiddleware, getAllRequests);

// Admin updates a request's status. It expects a JSON body.
router.patch('/:id', express.json(), authMiddleware, adminMiddleware, updateRequestStatus);

// FIX: Updated route to get a specific document by its index.
router.get('/:id/document/:docIndex', authMiddleware, adminMiddleware, getRequestDocument);

export default router;
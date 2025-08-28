"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = express_1.default.Router();
// Get all requests (admin/accounting can see all, students see their own)
router.get('/', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.getAllRequests);
// Get student's own requests (must come before /:id route)
router.get('/my-requests', sessionAuthMiddleware_1.studentSessionAuthMiddleware, requestController_1.getStudentRequests);
router.get('/student/:studentId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.getRequestsByStudentId);
// Create new request (students only) - with file upload support
router.post('/', sessionAuthMiddleware_1.studentSessionAuthMiddleware, fileUpload_1.default.array('documents', 5), requestController_1.createRequest);
// Get specific request by ID
router.get('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.getRequestById);
// Get document by request ID and document index (admin/accounting only)
router.get('/:id/document/:docIndex', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.getRequestDocument);
// Update request status (admin/accounting only)
router.patch('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.updateRequestStatus);
// Delete request (admin only)
router.delete('/:id', sessionAuthMiddleware_1.adminSessionAuthMiddleware, requestController_1.deleteRequest);
exports.default = router;

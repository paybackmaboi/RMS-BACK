"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
// This import will now work correctly
const authMiddleware_1 = require("../middleware/authMiddleware");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = (0, express_1.Router)();
// Student creates a request.
router.post('/', authMiddleware_1.authMiddleware, fileUpload_1.default.single('document'), requestController_1.createRequest);
// Student gets their own requests.
router.get('/my-requests', authMiddleware_1.authMiddleware, requestController_1.getStudentRequests);
// --- Admin-Only Routes ---
// The following routes are now protected by adminMiddleware.
// Admin gets all requests.
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, requestController_1.getAllRequests);
// Admin updates a request's status. It expects a JSON body.
router.patch('/:id', express_2.default.json(), authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, requestController_1.updateRequestStatus);
// Admin gets a specific document for a request.
router.get('/:id/document', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, requestController_1.getRequestDocument);
exports.default = router;

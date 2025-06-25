"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = (0, express_1.Router)();
const adminOrAccountingMiddleware = (req, res, next) => {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role === 'admin' || role === 'accounting') {
        next();
    }
    else {
        res.status(403).json({
            message: 'Forbidden: Access is restricted to admin and accounting',
        });
    }
};
// FIX: Changed to handle multiple documents, up to 5.
router.post('/', authMiddleware_1.authMiddleware, fileUpload_1.default.array('documents', 5), requestController_1.createRequest);
// Student gets their own requests.
router.get('/my-requests', authMiddleware_1.authMiddleware, requestController_1.getStudentRequests);
// --- Admin-Only Routes ---
// The following routes are now protected by adminMiddleware.
// Admin gets all requests.
router.get('/', authMiddleware_1.authMiddleware, adminOrAccountingMiddleware, requestController_1.getAllRequests);
// Admin updates a request's status. It expects a JSON body.
router.patch('/:id', express_2.default.json(), authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, requestController_1.updateRequestStatus);
// FIX: Updated route to get a specific document by its index.
router.get('/:id/document/:docIndex', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, requestController_1.getRequestDocument);
exports.default = router;

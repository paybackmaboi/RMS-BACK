"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requirementsController_1 = require("../controllers/requirementsController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(sessionAuthMiddleware_1.adminSessionAuthMiddleware);
// Upload a requirement document
router.post('/upload', fileUpload_1.default.single('document'), requirementsController_1.uploadDocument);
// Send announcement to student about requirements
router.post('/announcement', requirementsController_1.sendAnnouncement);
// Get requirements status for a student
router.get('/status/:studentId', requirementsController_1.getRequirementsStatus);
// Update requirement status
router.put('/status', requirementsController_1.updateRequirementStatus);
exports.default = router;

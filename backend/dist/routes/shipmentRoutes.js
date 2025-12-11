"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipmentController_1 = __importDefault(require("../controllers/shipmentController"));
const router = (0, express_1.Router)();
router.get('/', shipmentController_1.default.getAllShipments);
router.get('/:id', shipmentController_1.default.getShipmentById);
router.get('/tracking/:trackingNumber', shipmentController_1.default.getShipmentByTrackingNumber);
router.post('/', shipmentController_1.default.createShipment);
router.put('/:id/status', shipmentController_1.default.updateShipmentStatus);
exports.default = router;
//# sourceMappingURL=shipmentRoutes.js.map
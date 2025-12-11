"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const shipmentRoutes_1 = __importDefault(require("./routes/shipmentRoutes"));
const connection_1 = require("./db/connection");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', async (req, res) => {
    try {
        const dbResult = await (0, connection_1.query)('SELECT NOW() as server_time');
        const response = {
            success: true,
            message: 'ZYX Logistics API is running',
            data: {
                service: 'ZYX Logistics Tracker',
                version: '2.0.0-alpha (TypeScript Migration)',
                author: 'Victor Luiz de França',
                database: {
                    connected: true,
                    server_time: dbResult.rows[0].server_time
                },
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                endpoints: [
                    'GET /api/health',
                    'GET /api/shipments',
                    'GET /api/shipments/:id',
                    'GET /api/shipments/tracking/:trackingNumber',
                    'POST /api/shipments',
                    'PUT /api/shipments/:id/status'
                ]
            }
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            message: 'API running but database connection failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
        res.status(500).json(response);
    }
});
app.use('/api/shipments', shipmentRoutes_1.default);
app.get('/', (req, res) => {
    const response = {
        success: true,
        message: 'ZYX Logistics Tracker API',
        data: {
            service: 'ZYX Logistics Tracker',
            status: 'operational',
            documentation: 'See /api/health for detailed information',
            migration: 'TypeScript migration in progress'
        }
    };
    res.json(response);
});
app.use('*', (req, res) => {
    const response = {
        success: false,
        message: 'Endpoint not found',
        error: `Path ${req.originalUrl} does not exist`
    };
    res.status(404).json(response);
});
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    const response = {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Contact administrator'
    };
    res.status(500).json(response);
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`ZYX Logistics Server started on port ${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Database: PostgreSQL on port ${process.env.DB_PORT || '5433'}`);
        console.log(`Migration: TypeScript migration in progress (server.ts)`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map
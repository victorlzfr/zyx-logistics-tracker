import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import shipmentRoutes from './routes/shipmentRoutes';
import { query } from './db/connection';
import { ApiResponse } from './types/shipment.types';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const dbResult = await query<{ server_time: Date }>('SELECT NOW() as server_time');
    
    const response: ApiResponse = {
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
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'API running but database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
    res.status(500).json(response);
  }
});

app.use('/api/shipments', shipmentRoutes);
// app.use('/api/shipments', shipmentRoutes);

// Temporary root endpoint
app.get('/', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
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

// 404 handler
app.use('*', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: false,
    message: 'Endpoint not found',
    error: `Path ${req.originalUrl} does not exist`
  };
  res.status(404).json(response);
});

// Global error handler
app.use((error: Error, req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  console.error('Server error:', error);
  
  const response: ApiResponse = {
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Contact administrator'
  };
  
  res.status(500).json(response);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ZYX Logistics Server started on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: PostgreSQL on port ${process.env.DB_PORT || '5433'}`);
    console.log(`Migration: TypeScript migration in progress (server.ts)`);
  });
}

export default app;

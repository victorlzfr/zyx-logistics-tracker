import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types/shipment.types';

const router: Router = Router();

// Temporary routes for compilation
router.get('/', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: true,
    message: 'Shipment routes will be migrated in next PR',
    data: {
      status: 'pending_migration',
      original_file: 'shipmentRoutes.js',
      target_file: 'shipmentRoutes.ts',
      estimated_completion: 'PR #04'
    }
  };
  res.json(response);
});

router.get('/:id', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: true,
    message: 'Individual shipment endpoint - migration pending',
    data: {
      shipment_id: req.params.id,
      status: 'pending_migration'
    }
  };
  res.json(response);
});

export default router;

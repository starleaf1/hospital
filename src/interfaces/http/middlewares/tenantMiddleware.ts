import { Request, Response, NextFunction } from 'express';

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'];
  
  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: 'x-tenant-id header is required' });
  }

  (req as any).tenantId = tenantId;
  next();
};

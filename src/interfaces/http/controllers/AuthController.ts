import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { tenant: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passHash = hashPassword(password);
      if (user.passwordHash !== passHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        id: user.id,
        name: user.name,
        roles: user.roles,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

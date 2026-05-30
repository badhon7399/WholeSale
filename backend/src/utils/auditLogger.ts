import { AuditLog } from '../models/AuditLog';
import { logger } from './logger';

export const logAuditEvent = async (params: {
  action: string;
  performedBy: string;
  targetEntity: 'User' | 'Product' | 'Order' | 'RFQ' | 'Category';
  targetId: string;
  details?: any;
  ipAddress?: string;
}): Promise<void> => {
  try {
    await AuditLog.create(params);
    logger.info(
      `[AUDIT] Action: ${params.action} | PerformedBy: ${params.performedBy} | Target: ${params.targetEntity}(${params.targetId})`
    );
  } catch (error) {
    logger.error('Failed to write audit log:', error);
  }
};

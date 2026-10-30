import { Router, Response } from 'express';
import {
  getSecurityLogs,
  deleteSecurityLog,
  getAggregatedMetrics,
} from '../db.ts';
import { optionalAuth, requireAuth, AuthenticatedRequest } from '../auth.ts';

const router = Router();

// GET /api/logs
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role || 'Security Analyst';

    const scan_type = req.query.scan_type ? String(req.query.scan_type) : undefined;
    const threats_only = req.query.threats_only === 'true';
    const search = req.query.search ? String(req.query.search) : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    const data = await getSecurityLogs({
      user_id: userId,
      role,
      scan_type,
      threats_only,
      search,
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: data.logs,
      total: data.total,
      limit,
      offset,
      user_role: role,
    });
  } catch (err: any) {
    console.error('[Get Logs Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve security logs' });
  }
});

// GET /api/metrics
router.get('/metrics', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role || 'Admin';

    const metrics = await getAggregatedMetrics(userId, role);
    return res.json(metrics);
  } catch (err: any) {
    console.error('[Get Metrics Error]:', err);
    return res.status(500).json({ error: 'Failed to compute security metrics' });
  }
});

// GET /api/logs/export
router.get('/export', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role || 'Security Analyst';
    const format = req.query.format === 'csv' ? 'csv' : 'json';

    const { logs } = await getSecurityLogs({
      user_id: userId,
      role,
      limit: 1000,
    });

    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'User', 'Scan Type', 'Threat Detected', 'Risk Score', 'Payload Preview'];
      const rows = logs.map((l) => [
        l.id,
        `"${l.created_at}"`,
        `"${l.user_email || l.user_id}"`,
        `"${l.scan_type}"`,
        l.threat_detected ? 'TRUE' : 'FALSE',
        l.risk_score,
        `"${(l.input_payload || '').replace(/"/g, '""').slice(0, 100)}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=trustguard-audit-logs-${Date.now()}.csv`);
      return res.send(csvContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=trustguard-audit-logs-${Date.now()}.json`);
    return res.json({
      exported_at: new Date().toISOString(),
      record_count: logs.length,
      logs,
    });
  } catch (err: any) {
    console.error('[Export Logs Error]:', err);
    return res.status(500).json({ error: 'Failed to export logs' });
  }
});

// DELETE /api/logs/:id
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logId = parseInt(req.params.id, 10);
    if (isNaN(logId)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }

    const userId = req.user!.userId;
    const role = req.user!.role;

    const deleted = await deleteSecurityLog(logId, userId, role);
    if (!deleted) {
      return res.status(404).json({ error: 'Log not found or you do not have permission to delete it.' });
    }

    return res.json({ success: true, message: `Log #${logId} successfully deleted.` });
  } catch (err: any) {
    console.error('[Delete Log Error]:', err);
    return res.status(500).json({ error: 'Failed to delete log' });
  }
});

export default router;

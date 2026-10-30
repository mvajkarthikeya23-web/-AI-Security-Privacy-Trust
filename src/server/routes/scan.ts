import { Router, Response } from 'express';
import { analyzePii, analyzeThreat, auditModelOutput } from '../gemini.ts';
import { createSecurityLog } from '../db.ts';
import { optionalAuth, AuthenticatedRequest } from '../auth.ts';
import { scanSchema, threatScanSchema, auditScanSchema } from '../validation.ts';

const router = Router();

// POST /api/scan/pii
router.post('/pii', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = scanSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { text, redaction_mode } = parseResult.data;
    const analysis = await analyzePii(text, redaction_mode);

    // Persist to security_logs
    const userId = req.user?.userId || 1;
    const log = await createSecurityLog({
      user_id: userId,
      scan_type: 'PII_DETECTION',
      input_payload: text,
      analysis_result: analysis,
      threat_detected: analysis.has_pii,
      risk_score: analysis.risk_score,
    });

    return res.json({
      success: true,
      log_id: log.id,
      analysis,
    });
  } catch (err: any) {
    console.error('[Scan PII API Error]:', err);
    return res.status(500).json({
      error: 'PII Scanning failed. ' + (err.message || 'Unknown processing error'),
    });
  }
});

// POST /api/scan/threat
router.post('/threat', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = threatScanSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { text, sensitivity } = parseResult.data;
    const analysis = await analyzeThreat(text, sensitivity);

    // Persist to security_logs
    const userId = req.user?.userId || 1;
    const log = await createSecurityLog({
      user_id: userId,
      scan_type: 'PROMPT_INJECTION',
      input_payload: text,
      analysis_result: analysis,
      threat_detected: analysis.is_malicious,
      risk_score: analysis.risk_score,
    });

    return res.json({
      success: true,
      log_id: log.id,
      analysis,
    });
  } catch (err: any) {
    console.error('[Scan Threat API Error]:', err);
    return res.status(500).json({
      error: 'Prompt Injection Analysis failed. ' + (err.message || 'Unknown processing error'),
    });
  }
});

// POST /api/scan/audit
router.post('/audit', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = auditScanSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { text, prompt } = parseResult.data;
    const analysis = await auditModelOutput(text, prompt);

    const userId = req.user?.userId || 1;
    const threatDetected = !analysis.is_safe || analysis.toxicity_score > 30 || analysis.hallucination_probability > 40;
    const riskScore = Math.max(0, Math.min(100, 100 - analysis.overall_score));

    const log = await createSecurityLog({
      user_id: userId,
      scan_type: 'MODEL_AUDIT',
      input_payload: text,
      analysis_result: analysis,
      threat_detected: threatDetected,
      risk_score: riskScore,
    });

    return res.json({
      success: true,
      log_id: log.id,
      analysis,
    });
  } catch (err: any) {
    console.error('[Scan Audit API Error]:', err);
    return res.status(500).json({
      error: 'Model Safety Audit failed. ' + (err.message || 'Unknown processing error'),
    });
  }
});

export default router;

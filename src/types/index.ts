export type UserRole = 'Admin' | 'Security Analyst' | 'Developer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface DetectedEntity {
  type: string; // 'SSN' | 'EMAIL' | 'CREDIT_CARD' | 'PHONE' | 'API_KEY' | 'IP_ADDRESS' | 'MEDICAL_ID' | 'CUSTOM'
  value: string;
  start?: number;
  end?: number;
  confidence: number;
  category: 'Direct Identifier' | 'Financial' | 'Contact' | 'Authentication' | 'Healthcare';
  complianceTags: string[]; // ['GDPR Art 4', 'HIPAA', 'PCI-DSS']
}

export interface PiiScanResult {
  has_pii: boolean;
  detected_entities: DetectedEntity[];
  redacted_text: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number; // 0-100
  entity_counts: Record<string, number>;
  compliance_impact: {
    gdpr_violation_risk: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE';
    hipaa_violation_risk: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE';
    pci_dss_violation_risk: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE';
    summary: string;
  };
  processing_time_ms: number;
}

export interface ThreatScanResult {
  is_malicious: boolean;
  threat_type: string; // 'Direct Prompt Injection' | 'Jailbreak (DAN/Persona)' | 'Data Exfiltration' | 'System Leakage' | 'Token Smuggling' | 'Benign'
  risk_score: number; // 0-100
  severity: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  firewall_action: 'ALLOW' | 'MONITOR' | 'SANITIZE' | 'BLOCK';
  explanation: string;
  mitigation_advice: string;
  indicators: string[];
  attack_vector?: string;
  confidence: number;
  processing_time_ms: number;
}

export interface ModelAuditResult {
  is_safe: boolean;
  overall_score: number; // 0-100
  toxicity_score: number; // 0-100
  hallucination_probability: number; // 0-100
  bias_indicators: Array<{ category: string; description: string; score: number }>;
  safety_categories: {
    hate_speech: 'CLEAN' | 'WARNING' | 'VIOLATION';
    harassment: 'CLEAN' | 'WARNING' | 'VIOLATION';
    dangerous_content: 'CLEAN' | 'WARNING' | 'VIOLATION';
    system_leakage: 'CLEAN' | 'WARNING' | 'VIOLATION';
  };
  recommendation: string;
}

export interface SecurityLog {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  scan_type: 'PII_DETECTION' | 'PROMPT_INJECTION' | 'MODEL_AUDIT';
  input_payload: string;
  analysis_result: PiiScanResult | ThreatScanResult | ModelAuditResult;
  threat_detected: boolean;
  risk_score: number;
  created_at: string;
}

export interface MetricsSummary {
  totalScans: number;
  threatsDetected: number;
  threatRatePercent: number;
  piiLeaksBlocked: number;
  averageRiskScore: number;
  overallPostureScore: number; // 0-100
  scansByType: {
    pii: number;
    threat: number;
    audit: number;
  };
  trend7Days: Array<{
    date: string;
    total: number;
    threats: number;
    pii: number;
    clean: number;
  }>;
  threatDistribution: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  complianceScores: {
    gdpr: number;
    hipaa: number;
    pciDss: number;
    euAiAct: number;
  };
}

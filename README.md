# TrustGuard AI — Enterprise AI Security, Privacy & Governance Platform

TrustGuard AI is a production-grade enterprise platform designed to protect sensitive organizational data, detect adversarial threats, intercept prompt injections and jailbreaks in real time, ensure regulatory compliance (GDPR, HIPAA, PCI-DSS, EU AI Act), and establish transparency and trust in AI workflows.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC) & Authentication**:
   - Secure JSON Web Token (JWT) sessions with 24-hour expiration.
   - Encrypted password hashing with `bcrypt` (10 rounds).
   - Roles: **Admin (CISO)**, **Security Analyst (SecOps)**, and **Developer (AI Engineer)**.
   - Strict Row-Level Security (RLS) ensuring users only view their own scan telemetry unless they hold an Admin role.

2. **PII & Sensitive Data Redaction Studio**:
   - High-throughput hybrid scanning engine combining regex rule signatures (SSN, credit card PANs with Luhn validation, emails, phone numbers, API keys/JWTs, cloud credentials, IP addresses) with Google Gemini semantic entity extraction.
   - Dual-pane comparison (Raw Input vs. Redacted Output).
   - Masking styles: `[REDACTED_TYPE_N]`, Asterisks (`****`), or cryptographic SHA-256 hashes.
   - Immediate statutory risk scoring (GDPR Articles 4/32, HIPAA Safe Harbor 18 identifiers, PCI-DSS Req 3.4).

3. **AI Vulnerability & Prompt Injection Firewall**:
   - Real-time simulation of LLM firewalls using Google Gemini 3.8 Flash.
   - Interception of direct prompt injections, persona jailbreaks (DAN, Developer Mode hacks, Grandma exploits), token smuggling (base64/rot13), and system prompt leakage attempts.
   - Actionable verdicts (`ALLOW`, `MONITOR`, `SANITIZE`, `BLOCK`) with risk scores (0–100) and developer defense remediation steps.

4. **AI Trust, Bias & Output Safety Audit**:
   - Audits LLM model responses for algorithmic bias (gender, age, race), hallucination probability, toxicity, and safety category ratings.
   - Formatted compliance guidance aligned with the EU AI Act Title III high-risk framework.

5. **PostgreSQL Audit Ledger & Analytics**:
   - Every inspection is recorded in the PostgreSQL `security_logs` table with user attribution, input payloads, risk scores, and structured JSONB analysis.
   - 7-day trend activity charts, threat taxonomy breakdown, and regulatory readiness scorecards using Recharts.
   - 1-click JSON and CSV export capabilities.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, TypeScript (`tsx`), JWT, `bcryptjs`, `zod`.
- **Database**: PostgreSQL (via `pg` Pool) with high-availability fallback and seed profiles.
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK) utilizing `gemini-3.8-flash` exclusively on the backend with zero browser exposure.

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
# Optional PostgreSQL URL
# DATABASE_URL=postgresql://user:password@localhost:5432/trustguard
```

### 3. Start Development Server
Run the unified Express + Vite dev server:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 👥 Demo Pre-Seeded Accounts

For immediate testing of RBAC roles, use the **Demo Profiles** dropdown in the top navigation or log in with:
- **Admin**: `admin@trustguard.ai` / `AdminPass123!`
- **Security Analyst**: `analyst@trustguard.ai` / `AnalystPass123!`
- **Developer**: `dev@trustguard.ai` / `DevPass123!`

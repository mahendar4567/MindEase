# 🛡️ MindEase Local Security Scanner & DevSecOps Setup

This folder contains configuration files and instructions for running standard open-source defensive security scanners locally on the **MindEase Student Wellness Platform**.

---

## 🛠️ Security Scanners & npm Commands

| Command | Scanner / Tool | Description | Output Report File |
| :--- | :--- | :--- | :--- |
| `npm run security:dependencies` | `npm audit` | Checks installed dependencies for known CVEs | `security-audit-report.json` |
| `npm run security:code` | `ESLint / Semgrep` | Scans source code for security anti-patterns | `security-sast-report.txt` |
| `npm run security:secrets` | `Gitleaks` | Detects committed API keys or JWT secrets | `security-gitleaks-report.txt` |
| `npm run security:all` | All Tools | Executes full local security suite | Output in `Vulnerability Test Results/` |

---

## 📋 Tool Installation & Manual Run Guide

### 1. Dependency Vulnerability Scanner (`npm audit`)
```bash
cd backend
npm run security:dependencies
```

### 2. Static Code Security Scanner (`Semgrep` & `ESLint`)
- **Installation**:
  ```bash
  pip install semgrep
  ```
- **Execution**:
  ```bash
  semgrep --config security/semgrep.yml backend/
  ```

### 3. Secret Detection Scanner (`Gitleaks`)
- **Installation (via winget / brew / binary)**:
  ```bash
  winget install Gitleaks.Gitleaks
  ```
- **Execution**:
  ```bash
  gitleaks detect --config security/.gitleaks.toml --source . --verbose
  ```

### 4. OWASP ZAP Local Dev Server Baseline Scanner
- **Docker Command (Local Only)**:
  ```bash
  docker run -v $(pwd)/security:/zap/wrk/:rw -t zaproxy/zap-stable zap-baseline.py -t http://localhost:5000 -c zap-baseline.conf -r local-zap-report.html
  ```

---

## 🔒 Security Scope Disclaimer
- Scans must only be run locally against your authorized development environment (`http://localhost:5000` / `http://localhost:5173`).
- Do not scan external networks or public endpoints.
